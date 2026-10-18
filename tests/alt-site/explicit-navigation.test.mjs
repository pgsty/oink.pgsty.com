import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));

// A standalone module consumer models the PG Exporter layout: /docs/ owns
// navigation, but manuals remain physical siblings at the content root.
for (const cacheLimit of [10000, 1]) {
  test(`explicit root-level manuals retain topology with cache limit ${cacheLimit}`, (t) => {
    const source = mkdtempSync(join(tmpdir(), 'oink-explicit-consumer-'));
    t.after(() => rmSync(source, { recursive: true, force: true }));
    const write = (name, content) => {
      const path = join(source, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    };
    for (const name of ['go.mod', 'go.sum']) copyFileSync(join(siteDir, name), join(source, name));
    write('hugo.yaml', `baseURL: https://example.test/handbook/
title: Root-level manual
defaultContentLanguage: en
languages:
  en: {locale: en-US}
  zh: {locale: zh-CN}
module:
  imports:
    - path: github.com/pgsty/oink
disableKinds: [RSS, sitemap, taxonomy, term]
outputs:
  home: [HTML, NAVJSON]
  section: [HTML]
  page: [HTML]
params:
  offline_search: false
  ui:
    sidebar_menu_compact: false
    sidebar_cache_limit: ${cacheLimit}
`);
    const pages = {
      _index: 'title: Home\ntype: home\ncascade:\n  type: docs',
      'docs/_index': 'title: Docs',
      intro: 'title: Introduction',
      config: 'title: Configuration',
      api: 'title: API',
      'book/_index': 'title: Book\ntype: book\ncascade:\n  type: book',
      'book/chapter': 'title: Chapter',
    };
    for (const suffix of ['', '.zh']) {
      for (const [name, frontmatter] of Object.entries(pages)) {
        write(`content/${name}${suffix}.md`, `---\n${frontmatter}\n---\nManual content.\n`);
      }
    }
    // No legacy URL hints. Config and API are not physical parent and child.
    write('data/docs_nav.json', JSON.stringify({ sections: [
      { page: 'intro' },
      { page: 'config', children: [{ page: 'api' }] },
      { page: 'book', children: [{ page: 'book/chapter' }] },
    ] }));
    const output = join(source, 'public');
    const build = spawnSync('hugo', [
      '--environment', 'development', '--destination', output,
      '--cacheDir', join(source, 'cache'), '--noBuildLock',
      '--ignoreVendorPaths', 'github.com/pgsty/oink',
      '--printPathWarnings',
    ], {
      cwd: source, encoding: 'utf8', timeout: 120000,
      env: { ...process.env, GOWORK: 'off', HUGO_MODULE_WORKSPACE: 'off', HUGO_RESOURCEDIR: join(source, 'resources') },
    });
    assert.equal(build.status, 0, `${build.error ?? ''}\n${build.stdout}\n${build.stderr}`);
    for (const language of ['', 'zh/']) {
      const prefix = `/handbook/${language}`;
      const documentAt = (route) => new JSDOM(readFileSync(join(output, language, route, 'index.html'), 'utf8')).window.document;
      const links = (document) => [...document.querySelectorAll('.td-shell-tree__link')].map((node) => node.getAttribute('href'));
      const api = documentAt('api');
      assert.deepEqual(links(api), ['docs', 'intro', 'config', 'api'].map((route) => `${prefix}${route}/`));
      assert.equal(api.querySelector('[data-td-pager-prev]').getAttribute('href'), `${prefix}config/`);
      const current = api.querySelectorAll('.td-shell-tree__link[aria-current="page"]');
      if (cacheLimit === 1) {
        assert.equal(current.length, 0);
        assert.ok(api.querySelector('[data-td-sidebar-hydrate-active]'));
      } else {
        assert.equal(current.length, 1);
        assert.equal(current[0].getAttribute('href'), `${prefix}api/`);
        const parent = api.querySelector(`.td-shell-tree__link[href="${prefix}config/"]`).closest('li');
        assert.equal(parent.querySelector('[data-td-shell-tree-toggle]').getAttribute('aria-expanded'), 'true');
      }
      assert.deepEqual(links(documentAt('book/chapter')), ['book', 'book/chapter'].map((route) => `${prefix}${route}/`));
      const navigation = JSON.parse(readFileSync(join(output, language, 'navigation.json'), 'utf8'));
      const docs = navigation.root.children.find((node) => node.id === `${prefix}docs/`);
      assert.deepEqual(docs.children.map((node) => node.id), [`${prefix}intro/`, `${prefix}config/`]);
      assert.equal(docs.children[1].children[0].id, `${prefix}api/`);
    }
  });
}
