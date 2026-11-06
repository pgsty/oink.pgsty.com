import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const checker = path.join(root, 'scripts/check-rendered-markdown.mjs');

function writeHtml(publicRoot, relative, body) {
  const target = path.join(publicRoot, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `<!doctype html><html><body>${body}</body></html>`);
}

function check(run) {
  const publicRoot = mkdtempSync(path.join(tmpdir(), 'oink-rendered-markdown-'));
  try {
    run(publicRoot);
    return spawnSync(process.execPath, [checker, publicRoot], { cwd: root, encoding: 'utf8' });
  } finally {
    rmSync(publicRoot, { recursive: true, force: true });
  }
}

test('unparsed Markdown in prose fails while code, chrome and other regions pass', () => {
  const result = check((publicRoot) => {
    writeHtml(
      publicRoot,
      'docs/page/index.html',
      '<nav>Outside **content** stays out of scope</nav>' +
        '<div class="td-content">' +
        '<p>Leaked **bold** text</p>' +
        '<p><code>**literal**</code> and <kbd>~~keys~~</kbd></p>' +
        '<div class="td-page-annotation"><p>Annotated `code` note</p></div>' +
        '<div data-td-code-group-tab><span>`tab`</span></div>' +
        '</div>',
    );
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /1 content pages; 2 text nodes/);
  assert.match(result.stderr, /unparsed strong emphasis: \/docs\/page\/: Leaked \*\*bold\*\* text/);
  assert.doesNotMatch(result.stderr, /Outside|literal|keys|Annotated|tab/);
});

test('pages without a content region and print pages are not counted', () => {
  const result = check((publicRoot) => {
    writeHtml(publicRoot, 'docs/plain/index.html', '<p>No **content** region</p>');
    writeHtml(publicRoot, 'docs/_print/index.html', '<div class="td-content"><p>Print **copy**</p></div>');
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /0 content pages; 0 text nodes/);
});
