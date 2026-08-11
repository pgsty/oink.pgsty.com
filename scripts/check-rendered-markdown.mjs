#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { JSDOM } from 'jsdom';

const publicRoot = path.resolve(process.argv[2] ?? 'public');
const failures = new Map();

const rules = [
  {
    kind: 'strong emphasis',
    pattern: /\*\*|__[^_\n]*(?:\p{Script=Han}|\s)[^_\n]*__/u,
  },
  {
    kind: 'emphasis',
    pattern:
      /(?<!\*)\*[^*\n]*(?:\p{Script=Han}|\s)[^*\n]*\*(?!\*)|_[^_\n]*(?:\p{Script=Han}|\s)[^_\n]*_/u,
  },
  { kind: 'inline code', pattern: /`[^`\n]+`/ },
  {
    kind: 'link',
    pattern: /!?\[[^\]\n]+\](?:\([^\)\n]+\)|\[[^\]\n]*\])/,
  },
  { kind: 'strikethrough', pattern: /~~[^~\n]+~~/ },
  { kind: 'shortcode', pattern: /\{\{[%<][^\n]+[%>]\}\}/ },
  { kind: 'code fence', pattern: /```|~~~/ },
  {
    kind: 'block marker',
    pattern: /\n\s{0,3}(?:#{1,6}|>|[-+*]|\d+\.)\s+\S/,
  },
  {
    kind: 'table delimiter',
    pattern: /(?:^|\n)\s*\|?\s*:?-{3,}:?\s*(?:\||$)/,
  },
];

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
  if (name.includes('/_print/') || /\/page\/\d+\//.test(name)) return false;
  return (
    name === 'index.html' ||
    name === 'zh/index.html' ||
    /^(?:zh\/)?(?:docs|blog|about|examples|community|project|tests)\/.*\.html$/.test(
      name,
    )
  );
}

function pageUrl(file) {
  const name = relative(file);
  if (name === 'index.html') return '/';
  return `/${name.replace(/index\.html$/, '')}`;
}

function snippet(value) {
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact.length > 180 ? `${compact.slice(0, 179)}…` : compact;
}

function record(kind, source, value) {
  const preview = snippet(value);
  const key = `${kind}\0${source}\0${preview}`;
  if (!failures.has(key)) failures.set(key, { kind, source, preview });
}

if (!existsSync(publicRoot)) {
  console.error(`Rendered site does not exist: ${publicRoot}`);
  process.exit(1);
}

const pages = walk(publicRoot)
  .filter((file) => file.endsWith('.html') && inScope(file))
  .sort();
let contentPages = 0;
let textNodes = 0;

for (const sourceFile of pages) {
  const source = pageUrl(sourceFile);
  const document = new JSDOM(readFileSync(sourceFile, 'utf8')).window.document;
  const contentRoots = document.querySelectorAll('.td-content');
  if (!contentRoots.length) continue;
  contentPages += 1;

  for (const content of contentRoots) {
    const iterator = document.createNodeIterator(
      content,
      document.defaultView.NodeFilter.SHOW_TEXT,
    );

    for (let node = iterator.nextNode(); node; node = iterator.nextNode()) {
      if (
        node.parentElement?.closest(
          'pre, code, samp, kbd, script, style, textarea, [data-td-code-group-tab], .td-code-group__print-title, .td-code-group__static-title',
        )
      ) {
        continue;
      }
      if (!node.data.trim()) continue;
      textNodes += 1;

      for (const { kind, pattern } of rules) {
        if (pattern.test(node.data)) record(kind, source, node.data);
      }
    }
  }
}

console.log(
  `Rendered Markdown check: ${contentPages} content pages; ${textNodes} text nodes.`,
);

for (const { kind, source, preview } of failures.values()) {
  console.error(`unparsed ${kind}: ${source}: ${preview}`);
}

if (failures.size) process.exitCode = 1;
