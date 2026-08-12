import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const localWorkspace = join(siteDir, 'go.work');
const moduleWorkspace =
  process.env.HUGO_MODULE_WORKSPACE ||
  (existsSync(localWorkspace) ? localWorkspace : undefined);

function build(name, extraArgs = []) {
  const outDir = join(siteDir, 'tmp', `prd4-runtime-${name}`);
  rmSync(outDir, { recursive: true, force: true });
  const result = spawnSync(
    'npm',
    [
      'run',
      '_hugo',
      '--',
      '-e',
      'dev',
      '-DFE',
      '--baseURL',
      'https://example.test/preview/',
      '--destination',
      outDir,
      '--noBuildLock',
      ...extraArgs,
    ],
    {
      cwd: siteDir,
      encoding: 'utf8',
      env: {
        ...process.env,
        ...(moduleWorkspace ? { HUGO_MODULE_WORKSPACE: moduleWorkspace } : {}),
      },
    },
  );
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  assert.equal(result.status, 0, `Build failed:\n${output}`);
  return outDir;
}

function html(outDir, relative) {
  const path = join(outDir, relative);
  assert.ok(existsSync(path), `Missing ${path}`);
  return readFileSync(path, 'utf8');
}

function mainBundle(outDir, pageHTML) {
  const source = [...pageHTML.matchAll(/<script\b[^>]+src="([^"]+)"/g)]
    .map((match) => match[1])
    .find((value) => /\/js\/main-[^/]+\.js$/.test(value));
  assert.ok(source, 'Page has no main bundle');
  return html(outDir, source.replace('/preview/', ''));
}

function manifest(pageHTML) {
  const match = pageHTML.match(
    /<script type="application\/json" id="oink-action-manifest">(.*?)<\/script>/s,
  );
  assert.ok(match, 'Page has no action manifest');
  return JSON.parse(match[1]);
}

test('subpath manifests localize safe commands and preserve action URLs', () => {
  const outDir = build('manifest');
  for (const [relative, language, titles] of [
    [
      'docs/content/configuration/index.html',
      'en',
      [
        'OINK issues',
        'Copy page Markdown',
        'Print this page',
        'Choose color theme',
      ],
    ],
    [
      'zh/docs/content/configuration/index.html',
      'zh',
      ['OINK 问题反馈', '复制页面 Markdown', '打印当前页面', '选择颜色主题'],
    ],
  ]) {
    const page = html(outDir, relative);
    const data = manifest(page);
    assert.equal(data.language, language);
    assert.deepEqual(
      data.commands.map((command) => command.id),
      ['theme_issues', 'copy_source', 'print_page', 'choose_theme'],
    );
    assert.deepEqual(
      data.commands.map((command) => command.title),
      titles,
    );
    assert.deepEqual(
      data.commands.map((command) => command.action),
      ['', 'copy_markdown', 'print', 'switch_theme'],
    );
    assert.equal(data.commands[0].url, 'https://github.com/pgsty/oink/issues');
    assert.deepEqual(
      data.quickLinks.map((link) => link.id),
      ['quick_docs', 'quick_blog', 'quick_project'],
    );
    assert.ok(
      data.quickLinks.every((link) => link.url.startsWith('/preview/')),
    );
    for (const [id, suffix] of [
      ['copy_markdown', '/docs/content/configuration/index.md'],
      ['view_markdown', '/docs/content/configuration/index.md'],
    ]) {
      const action = data.actions.find((candidate) => candidate.id === id);
      const languagePrefix = language === 'zh' ? '/preview/zh' : '/preview';
      assert.equal(action.url, `${languagePrefix}${suffix}`);
    }
    for (const id of [
      'copy_markdown',
      'view_markdown',
      'edit_page',
      'create_issue',
      'print',
      'switch_theme',
      'switch_language',
      'switch_version',
      'open_github',
    ]) {
      assert.ok(
        data.actions.some((action) => action.id === id),
        id,
      );
    }
  }
});

test('search-disabled pages omit the Palette runtime but retain page actions', () => {
  const outDir = build('disabled', [
    '--config',
    'hugo.yml,tests/fixtures/prd4-palette/search-disabled.yml',
  ]);
  for (const relative of [
    'docs/content/configuration/index.html',
    'zh/docs/content/configuration/index.html',
  ]) {
    const page = html(outDir, relative);
    assert.doesNotMatch(page, /id="td-shell-search"/);
    assert.doesNotMatch(page, /data-td-shell-search-open/);
    assert.doesNotMatch(page, /data-index-src=/);
    assert.match(page, /id="oink-action-manifest"/);
    assert.match(page, /data-oink-action="copy_markdown"/);
    const bundle = mainBundle(outDir, page);
    assert.doesNotMatch(bundle, /OinkCommandPalette|td-shell-search/);
    assert.match(bundle, /OinkActionRegistry/);
    assert.match(bundle, /data-oink-action/);
  }
  assert.equal(existsSync(join(outDir, 'offline-search-index.en.json')), false);
  assert.equal(existsSync(join(outDir, 'offline-search-index.zh.json')), false);
});

test('print output omits all Palette and local-index runtime', () => {
  const outDir = build('print');
  for (const relative of [
    '_print/docs/content/index.html',
    'zh/_print/docs/content/index.html',
  ]) {
    const page = html(outDir, relative);
    assert.doesNotMatch(page, /id="td-shell-search"/);
    assert.doesNotMatch(page, /data-td-shell-search-open/);
    assert.doesNotMatch(page, /data-index-src=/);
    assert.doesNotMatch(page, /lunr(?:\.min)?\.js/);
    const bundle = mainBundle(outDir, page);
    assert.doesNotMatch(bundle, /OinkCommandPalette|OinkPaletteModel/);
    assert.doesNotMatch(bundle, /OinkSearchEngine|td-shell-search/);
  }
});
