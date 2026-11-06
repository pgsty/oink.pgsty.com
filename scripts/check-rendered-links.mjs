#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from 'parse5';

const publicRoot = path.resolve(process.argv[2] ?? 'public');
const localOrigin = 'https://oink.invalid';
// Each page is parsed once and reduced to strings: its link targets, element
// IDs and names, and whether it is a redirect. parse5 builds a plain tree that
// is dropped right after, so peak memory is one page rather than every page of
// the site at once. (A JSDOM window kept about 8 MB per page even after close.)
const summaries = new Map();
const failures = new Map();

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

function relative(file) {
  return path.relative(publicRoot, file).split(path.sep).join('/');
}

// Mirrors the DOM queries this check used to run: `a[href]` outside any
// `[data-proofer-ignore]` ancestor (or the link itself), every `[id]` and
// `[name]`, and `meta[http-equiv=refresh]`. Template content is not part of
// the document tree, so it is not walked.
function summaryFor(file) {
  if (!summaries.has(file)) {
    const summary = { redirect: false, hrefs: [], ids: new Set(), names: new Set() };
    // jsdom parsed with scripting off, so <noscript> content is markup here too.
    const stack = [{ node: parse(readFileSync(file, 'utf8'), { scriptingEnabled: false }), ignored: false }];
    while (stack.length) {
      const { node, ignored } = stack.pop();
      let skip = ignored;
      let href;
      let httpEquiv;
      for (const { name, value } of node.attrs ?? []) {
        if (name === 'id') summary.ids.add(value);
        else if (name === 'name') summary.names.add(value);
        else if (name === 'href') href = value;
        else if (name === 'http-equiv') httpEquiv = value;
        else if (name === 'data-proofer-ignore') skip = true;
      }
      if (node.tagName === 'meta' && httpEquiv?.toLowerCase() === 'refresh') summary.redirect = true;
      if (node.tagName === 'a' && href !== undefined && !skip) summary.hrefs.push(href);
      const children = node.childNodes ?? [];
      for (let index = children.length - 1; index >= 0; index -= 1) {
        stack.push({ node: children[index], ignored: skip });
      }
    }
    summaries.set(file, summary);
  }
  return summaries.get(file);
}

function inScope(file) {
  const name = relative(file);
  if (name.split('/').includes('_print') || /(^|\/)404\.html$/.test(name)) {
    return false;
  }
  return !summaryFor(file).redirect;
}

function pageUrl(file) {
  const name = relative(file);
  if (name === 'index.html') return '/';
  return `/${name.replace(/index\.html$/, '')}`;
}

function localFile(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const item = path.resolve(publicRoot, `.${decoded}`);
  if (item !== publicRoot && !item.startsWith(`${publicRoot}${path.sep}`)) {
    return null;
  }
  if (existsSync(item) && statSync(item).isFile()) return item;

  const index = path.join(item, 'index.html');
  return existsSync(index) && statSync(index).isFile() ? index : null;
}

function record(kind, target, source) {
  const key = `${kind}\0${target}`;
  if (!failures.has(key)) failures.set(key, { kind, target, sources: [] });
  const sources = failures.get(key).sources;
  if (!sources.includes(source)) sources.push(source);
}

if (!existsSync(publicRoot)) {
  console.error(`Rendered site does not exist: ${publicRoot}`);
  process.exit(1);
}

const pages = walk(publicRoot)
  .filter((file) => file.endsWith('.html') && inScope(file))
  .sort();
let links = 0;
let fragments = 0;

for (const sourceFile of pages) {
  const source = pageUrl(sourceFile);

  for (const rawHref of summaryFor(sourceFile).hrefs) {
    const href = rawHref?.trim();
    if (!href || href === '#' || href.includes('link-check=no')) continue;

    let url;
    try {
      url = new URL(href, `${localOrigin}${source}`);
    } catch {
      record('invalid URL', href, source);
      continue;
    }

    if (!['http:', 'https:'].includes(url.protocol)) continue;
    if (!['oink.invalid', 'localhost', '127.0.0.1'].includes(url.hostname)) {
      continue;
    }

    links += 1;
    const targetFile = localFile(url.pathname);
    const target = `${url.pathname}${url.hash}`;
    if (!targetFile) {
      record('missing target', target, source);
      continue;
    }
    if (!url.hash || !targetFile.endsWith('.html')) continue;

    fragments += 1;
    let fragment;
    try {
      fragment = decodeURIComponent(url.hash.slice(1));
    } catch {
      record('invalid fragment', target, source);
      continue;
    }
    const targetSummary = summaryFor(targetFile);
    if (!targetSummary.ids.has(fragment) && !targetSummary.names.has(fragment)) {
      record('missing fragment', target, source);
    }
  }
}

console.log(
  `Rendered link check: ${pages.length} pages; ${links} internal links; ${fragments} fragments.`,
);

for (const { kind, target, sources } of failures.values()) {
  const examples = sources.slice(0, 3).join(', ');
  const remainder = sources.length > 3 ? `, +${sources.length - 3} more` : '';
  console.error(`${kind}: ${target} (from ${examples}${remainder})`);
}

if (failures.size) process.exitCode = 1;
