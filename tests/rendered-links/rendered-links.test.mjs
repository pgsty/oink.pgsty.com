import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const checker = path.join(root, 'scripts/check-rendered-links.mjs');

function writeHtml(publicRoot, relative, body) {
  const target = path.join(publicRoot, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `<!doctype html><html><body>${body}</body></html>`);
}

function fixture(run) {
  const temporary = mkdtempSync(path.join(tmpdir(), 'oink-rendered-links-'));
  try {
    run(temporary);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

function check(publicRoot) {
  return spawnSync(process.execPath, [checker, publicRoot], {
    cwd: root,
    encoding: 'utf8',
  });
}

test('valid Book and Case links pass in both languages', () => {
  fixture((publicRoot) => {
    writeHtml(publicRoot, 'target/index.html', '<h2 id="present">Target</h2>');
    for (const source of [
      'book/page/index.html',
      'case/page/index.html',
      'zh/book/page/index.html',
      'zh/case/page/index.html',
    ]) {
      writeHtml(publicRoot, source, '<a href="/target/#present">Valid</a>');
    }

    const result = check(publicRoot);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /5 pages; 4 internal links; 4 fragments/);
  });
});

test('broken Book and Case targets and fragments fail in both languages', () => {
  fixture((publicRoot) => {
    writeHtml(publicRoot, 'target/index.html', '<h2 id="present">Target</h2>');
    const sources = [
      ['book', 'book/broken/index.html'],
      ['case', 'case/broken/index.html'],
      ['zh-book', 'zh/book/broken/index.html'],
      ['zh-case', 'zh/case/broken/index.html'],
    ];
    for (const [name, source] of sources) {
      writeHtml(
        publicRoot,
        source,
        `<a href="/missing-${name}/">Missing</a>` +
          `<a href="/target/#missing-${name}">Missing fragment</a>`,
      );
    }

    const result = check(publicRoot);
    assert.equal(result.status, 1, result.stdout);
    for (const [name, source] of sources) {
      const route = `/${source.replace(/index\.html$/, '')}`;
      assert.match(result.stderr, new RegExp(`missing target: /missing-${name}/`));
      assert.match(result.stderr, new RegExp(`missing fragment: /target/#missing-${name}`));
      assert.match(result.stderr, new RegExp(`from ${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    }
  });
});

test('intentional opt-outs and generated HTML sources remain excluded', () => {
  fixture((publicRoot) => {
    writeHtml(
      publicRoot,
      'index.html',
      '<div data-proofer-ignore><a href="/ignored/">Ignored subtree</a></div>' +
        '<a href="/ignored-too/?link-check=no">Ignored link</a>',
    );
    writeHtml(publicRoot, '_print/book/index.html', '<a href="/missing-print/">Print</a>');
    writeHtml(publicRoot, 'zh/_print/case/index.html', '<a href="/missing-print-zh/">Print</a>');
    writeHtml(publicRoot, '404.html', '<a href="/missing-404/">404</a>');
    writeHtml(
      publicRoot,
      'old/index.html',
      '<meta http-equiv="refresh" content="0; url=/"><a href="/missing-alias/">Alias</a>',
    );

    const result = check(publicRoot);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /1 pages; 0 internal links; 0 fragments/);
  });
});
