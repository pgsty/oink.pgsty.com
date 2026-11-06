#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from 'parse5';

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
    /^(?:zh\/)?(?:docs|blog|book|case|expo|about|examples|community|project|tests)\/.*\.html$/.test(
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

// Text inside these elements is code or chrome, not rendered prose. This is
// the former `closest()` selector: pre, code, samp, kbd, script, style,
// textarea, annotation, [data-td-code-group-tab], and three classes.
const exemptTags = new Set(['pre', 'code', 'samp', 'kbd', 'script', 'style', 'textarea', 'annotation']);
const exemptClasses = ['td-code-group__print-title', 'td-code-group__static-title', 'td-page-annotation'];

function classesOf(node) {
  return (node.attrs?.find(({ name }) => name === 'class')?.value ?? '').split(/\s+/);
}

function exempt(node) {
  return exemptTags.has(node.tagName) ||
    Boolean(node.attrs?.some(({ name }) => name === 'data-td-code-group-tab')) ||
    classesOf(node).some((name) => exemptClasses.includes(name));
}

// Depth-first in document order. `exempt` is inherited from every ancestor,
// including those above a content root, exactly as `closest()` searched.
function* walkTree(root, exemptAbove) {
  const stack = [{ node: root, exempted: exemptAbove }];
  while (stack.length) {
    const { node, exempted } = stack.pop();
    const inherited = exempted || Boolean(node.tagName && exempt(node));
    yield { node, exempted, inherited };
    const children = node.childNodes ?? [];
    for (let index = children.length - 1; index >= 0; index -= 1) {
      stack.push({ node: children[index], exempted: inherited });
    }
  }
}

for (const sourceFile of pages) {
  const source = pageUrl(sourceFile);
  // parse5 builds a plain tree that is dropped after each page; a JSDOM window
  // per page kept several megabytes each and exhausted the CI heap.
  const document = parse(readFileSync(sourceFile, 'utf8'), { scriptingEnabled: false });
  const contentRoots = [];
  for (const { node, exempted } of walkTree(document, false)) {
    if (node.tagName && classesOf(node).includes('td-content')) contentRoots.push({ node, exempted });
  }
  if (!contentRoots.length) continue;
  contentPages += 1;

  for (const content of contentRoots) {
    for (const { node, exempted } of walkTree(content.node, content.exempted)) {
      if (node.nodeName !== '#text' || exempted) continue;
      if (!node.value.trim()) continue;
      textNodes += 1;

      for (const { kind, pattern } of rules) {
        if (pattern.test(node.value)) record(kind, source, node.value);
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
