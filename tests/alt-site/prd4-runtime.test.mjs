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

function mainBundle(outDir, pageHTML, required = true) {
  const sources = [...pageHTML.matchAll(/<script\b[^>]+src="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => /\/js\/chunks\/[^/]+\.js$/.test(value));
  if (sources.length === 0) {
    assert.equal(required, false, 'Page has no runtime chunks');
    return '';
  }
  return sources
    .map((source) => html(outDir, source.replace('/preview/', '')))
    .join('\n');
}

function sharedBundle(outDir, pageHTML, name) {
  const source = [...pageHTML.matchAll(/<script\b[^>]+src="([^"]+)"/g)]
    .map((match) => match[1])
    .find((value) =>
      new RegExp(`/js/${name}(?:-[^/]+)?\\.js$`).test(value),
    );
  assert.ok(source, `Page has no ${name} bundle`);
  return html(outDir, source.replace('/preview/', ''));
}

function manifest(pageHTML) {
  const match = pageHTML.match(
    /<script type="application\/json" id="td-action-manifest">(.*?)<\/script>/s,
  );
  assert.ok(match, 'Page has no action manifest');
  return JSON.parse(match[1]);
}

test('subpath manifests localize safe commands and preserve action URLs', () => {
  const outDir = build('manifest');
  for (const [relative, language, titles] of [
    ['docs/customize/config/index.html', 'en', ['OINK issues']],
    ['zh/docs/customize/config/index.html', 'zh', ['OINK 问题反馈']],
  ]) {
    const page = html(outDir, relative);
    const data = manifest(page);
    assert.equal(data.language, language);
    assert.deepEqual(
      data.commands.map((command) => command.id),
      // The site deliberately defines only genuinely site-specific commands.
      // Aliasing a built-in action here would surface the same action twice
      // under two different labels.
      ['theme_issues'],
    );
    assert.deepEqual(
      data.commands.map((command) => command.title),
      titles,
    );
    assert.deepEqual(
      data.commands.map((command) => command.action),
      [''],
    );
    assert.equal(data.commands[0].url, 'https://github.com/pgsty/oink/issues');
    assert.deepEqual(
      data.quickLinks.map((link) => link.id),
      ['quick_docs', 'quick_blog'],
    );
    assert.ok(
      data.quickLinks.every((link) => link.url.startsWith('/preview/')),
    );
    for (const [id, suffix] of [
      ['copy_markdown', '/docs/customize/config/index.md'],
      ['view_markdown', '/docs/customize/config/index.md'],
    ]) {
      const action = data.actions.find((candidate) => candidate.id === id);
      const languagePrefix = language === 'zh' ? '/preview/zh' : '/preview';
      assert.equal(action.url, `${languagePrefix}${suffix}`);
    }
    assert.deepEqual(
      data.actions.map((action) => action.id),
      [
        'copy_markdown',
        'copy_link',
        'open_chatgpt',
        'open_claude',
        'view_markdown',
        'view_history',
        'edit_page',
        'create_child_page',
        'create_issue',
        'create_project_issue',
        'print_section',
        'print',
        'switch_version',
        'switch_language',
        'switch_theme',
        'open_github',
      ],
    );
  }
});

test('search-disabled pages omit the Palette runtime but retain page actions', () => {
  const outDir = build('disabled', [
    '--config',
    'hugo.yml,tests/fixtures/prd4-palette/search-disabled.yml',
  ]);
  for (const relative of [
    'docs/customize/config/index.html',
    'zh/docs/customize/config/index.html',
  ]) {
    const page = html(outDir, relative);
    assert.doesNotMatch(page, /id="td-shell-search"/);
    assert.doesNotMatch(page, /data-td-shell-search-open/);
    assert.doesNotMatch(page, /data-index-src=/);
    assert.match(page, /id="td-action-manifest"/);
    assert.match(page, /data-td-action="copy_markdown"/);
    const bundle = mainBundle(outDir, page);
    const actions = sharedBundle(outDir, page, 'actions');
    // keyboard-nav.js may reference the palette global as a consumer; only
    // the controller's own definition is barred on search-off pages.
    assert.doesNotMatch(bundle, /OinkCommandPalette\s*=|td-shell-search/);
    assert.match(actions, /OinkActionRegistry/);
    assert.match(actions, /data-td-action/);
  }
  assert.equal(existsSync(join(outDir, 'offline-search-index.en.json')), false);
  assert.equal(existsSync(join(outDir, 'offline-search-index.zh.json')), false);
});

test('print output omits all Palette and local-index runtime', () => {
  const outDir = build('print');
  for (const relative of [
    '_print/docs/write/index.html',
    'zh/_print/docs/write/index.html',
  ]) {
    const page = html(outDir, relative);
    assert.doesNotMatch(page, /id="td-shell-search"/);
    assert.doesNotMatch(page, /data-td-shell-search-open/);
    assert.doesNotMatch(page, /data-index-src=/);
    assert.doesNotMatch(page, /lunr(?:\.min)?\.js/);
    const bundle = mainBundle(outDir, page, false);
    assert.doesNotMatch(bundle, /OinkCommandPalette|OinkPaletteModel/);
    assert.doesNotMatch(bundle, /OinkSearchEngine|td-shell-search/);
  }
});
