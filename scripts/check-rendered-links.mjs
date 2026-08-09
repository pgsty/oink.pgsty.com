#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { JSDOM } from 'jsdom';

const publicRoot = path.resolve(process.argv[2] ?? 'public');
const localOrigin = 'https://oink.invalid';
const documentCache = new Map();
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

function inScope(file) {
  const name = relative(file);
  return (
    name === 'index.html' ||
    name === 'zh/index.html' ||
    /^(?:zh\/)?(?:docs|blog|about|examples|community)\/.*\.html$/.test(name)
  );
}

function pageUrl(file) {
  const name = relative(file);
  if (name === 'index.html') return '/';
  return `/${name.replace(/index\.html$/, '')}`;
}

function documentFor(file) {
  if (!documentCache.has(file)) {
    documentCache.set(
      file,
      new JSDOM(readFileSync(file, 'utf8')).window.document,
    );
  }
  return documentCache.get(file);
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
  const sourceDocument = documentFor(sourceFile);

  for (const anchor of sourceDocument.querySelectorAll('a[href]')) {
    if (anchor.closest('[data-proofer-ignore]')) continue;
    const href = anchor.getAttribute('href')?.trim();
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
    const targetDocument = documentFor(targetFile);
    if (
      !targetDocument.getElementById(fragment) &&
      targetDocument.getElementsByName(fragment).length === 0
    ) {
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
