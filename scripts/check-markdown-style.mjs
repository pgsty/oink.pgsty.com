#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const sourceRoot = path.resolve(process.argv[2] ?? 'content');
const failures = [];
const wordCharacter = /[\p{L}\p{N}]/u;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

function relative(file) {
  return path.relative(process.cwd(), file).split(path.sep).join('/');
}

function maskRange(characters, start, end) {
  for (let index = start; index < end; index += 1) characters[index] = ' ';
}

function maskComments(line, state) {
  const characters = line.split('');
  let cursor = 0;

  while (cursor < line.length) {
    if (state.inComment) {
      const end = line.indexOf('-->', cursor);
      if (end === -1) {
        maskRange(characters, cursor, line.length);
        break;
      }
      maskRange(characters, cursor, end + 3);
      state.inComment = false;
      cursor = end + 3;
      continue;
    }

    const start = line.indexOf('<!--', cursor);
    if (start === -1) break;
    const end = line.indexOf('-->', start + 4);
    if (end === -1) {
      maskRange(characters, start, line.length);
      state.inComment = true;
      break;
    }
    maskRange(characters, start, end + 3);
    cursor = end + 3;
  }

  return characters.join('');
}

function maskInlineCode(line) {
  const characters = line.split('');
  let cursor = 0;

  while (cursor < line.length) {
    if (line[cursor] !== '`') {
      cursor += 1;
      continue;
    }

    let length = 1;
    while (line[cursor + length] === '`') length += 1;
    const delimiter = '`'.repeat(length);
    const end = line.indexOf(delimiter, cursor + length);
    if (end === -1) {
      cursor += length;
      continue;
    }
    maskRange(characters, cursor, end + length);
    cursor = end + length;
  }

  return characters.join('');
}

function record(file, line, kind, source) {
  failures.push({ file: relative(file), line, kind, source: source.trim() });
}

if (!existsSync(sourceRoot)) {
  console.error(`Markdown source does not exist: ${sourceRoot}`);
  process.exit(1);
}

const files = walk(sourceRoot)
  .filter((file) => file.endsWith('.zh.md'))
  .sort();
let strongSpans = 0;
let emphasisSpans = 0;

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const state = { fence: null, inComment: false };

  for (const [index, source] of lines.entries()) {
    const withoutComments = maskComments(source, state);
    const fence = withoutComments.match(/^\s*(`{3,}|~{3,})/);
    if (state.fence) {
      if (
        fence &&
        fence[1][0] === state.fence.character &&
        fence[1].length >= state.fence.length
      ) {
        state.fence = null;
      }
      continue;
    }
    if (fence) {
      state.fence = { character: fence[1][0], length: fence[1].length };
      continue;
    }

    const line = maskInlineCode(withoutComments);
    for (const match of line.matchAll(/\*\*([^*\n]+)\*\*/g)) {
      strongSpans += 1;
      const before = line[match.index - 1] ?? '';
      const after = line[match.index + match[0].length] ?? '';
      if (wordCharacter.test(before) || wordCharacter.test(after)) {
        record(
          file,
          index + 1,
          'strong emphasis touches ordinary text',
          source,
        );
      }
      if (match[1].endsWith('：')) {
        record(
          file,
          index + 1,
          'Chinese colon is inside strong emphasis',
          source,
        );
      }
    }

    for (const match of line.matchAll(/(?<!\*)\*([^*\n]+)\*(?!\*)/g)) {
      emphasisSpans += 1;
      const before = line[match.index - 1] ?? '';
      const after = line[match.index + match[0].length] ?? '';
      if (wordCharacter.test(before) || wordCharacter.test(after)) {
        record(file, index + 1, 'emphasis touches ordinary text', source);
      }
    }

    for (const match of line.matchAll(/_([^_\n]*\p{Script=Han}[^_\n]*)_/gu)) {
      emphasisSpans += 1;
      const before = line[match.index - 1] ?? '';
      const after = line[match.index + match[0].length] ?? '';
      if (wordCharacter.test(before) || wordCharacter.test(after)) {
        record(
          file,
          index + 1,
          'underscore emphasis touches ordinary text',
          source,
        );
      }
    }
  }
}

console.log(
  `Markdown style check: ${files.length} Chinese files; ${strongSpans} strong spans; ${emphasisSpans} emphasis spans.`,
);

for (const { file, line, kind, source } of failures) {
  console.error(`${file}:${line}: ${kind}: ${source}`);
}

if (failures.length) process.exitCode = 1;
