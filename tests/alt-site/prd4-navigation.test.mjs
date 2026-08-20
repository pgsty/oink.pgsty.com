import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const fixtureDir = join(siteDir, 'tests', 'fixtures', 'prd4-navigation');
const localWorkspace = join(siteDir, 'go.work');
const moduleWorkspace =
  process.env.HUGO_MODULE_WORKSPACE ||
  (existsSync(localWorkspace) ? localWorkspace : undefined);

function build(name, { baseURL, fixture } = {}) {
  const outDir = join(siteDir, 'tmp', `prd4-navigation-${name}`);
  rmSync(outDir, { recursive: true, force: true });
  const args = [
    'run',
    '_hugo',
    '--',
    '-e',
    'dev',
    '-DFE',
    '--baseURL',
    baseURL,
    '--destination',
    outDir,
    '--noBuildLock',
    '--printPathWarnings',
  ];
  if (fixture) {
    args.push('--config', `hugo.yml,${join(fixtureDir, fixture)}`);
  }
  const result = spawnSync('npm', args, {
    cwd: siteDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...(moduleWorkspace ? { HUGO_MODULE_WORKSPACE: moduleWorkspace } : {}),
    },
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  assert.equal(result.status, 0, `Build failed:\n${output}`);
  return { outDir, output };
}

function documentAt(outDir, path) {
  const file = join(outDir, path.replace(/^\//, ''), 'index.html');
  assert.ok(existsSync(file), `Missing rendered route ${path}`);
  return new JSDOM(readFileSync(file, 'utf8')).window.document;
}

function navbarEntries(document, region = 'desktop') {
  return [
    ...document.querySelectorAll(`[data-td-navbar-region="${region}"]`),
  ].map((node) => ({
    label: node.dataset.tdNavbarLabel,
    href: node.getAttribute('href'),
    level: Number(node.dataset.tdNavbarLevel),
    kind: node.dataset.tdNavbarKind,
    target: node.getAttribute('target') || '',
    rel: node.getAttribute('rel') || '',
    description:
      node.querySelector('.td-navbar-entry__description')?.textContent.trim() ||
      '',
  }));
}

for (const [deployment, baseURL, prefix] of [
  ['root', 'https://example.test/', ''],
  ['subpath', 'https://example.test/preview/', '/preview'],
]) {
  test(`nested navigation resolves EN/ZH under ${deployment} deployment`, () => {
    const { outDir, output } = build(deployment, { baseURL });
    assert.doesNotMatch(output, /only one interactive child level is supported/);

    for (const route of [
      '/docs',
      '/book',
      '/case',
      '/blog',
      '/zh/docs',
      '/zh/book',
      '/zh/case',
      '/zh/blog',
    ]) {
      documentAt(outDir, route);
    }

    for (const [languagePath, labels, panelCount] of [
      ['', ['Docs', 'Get started', 'Book', 'Case', 'Blog'], 2],
      ['/zh', ['文档', '快速上手', '教程', '案例', '博客'], 2],
    ]) {
      const home = documentAt(outDir, languagePath || '/');
      const desktop = navbarEntries(home);
      for (const label of labels) {
        assert.ok(
          desktop.some((entry) => entry.label === label),
          label,
        );
      }
      assert.deepEqual(
        desktop
          .filter((entry) => entry.level === 0)
          .map((entry) => entry.label),
        [labels[0], labels[2], labels[3], labels[4]],
      );
      // The compact breakpoint reuses these semantic links as icons; it does
      // not render a second mobile navigation tree.
      assert.deepEqual(navbarEntries(home, 'mobile'), []);
      assert.equal(home.querySelectorAll('[data-td-navbar-toggle]').length, 0);
      assert.equal(
        home.querySelectorAll('[data-td-navbar-accordion-toggle]').length,
        0,
      );

      // Docs and Blog own nested panels; Book and Case are direct roots.
      const controls = [...home.querySelectorAll('[aria-controls]')].filter(
        (control) =>
          control.getAttribute('aria-controls')?.startsWith('td-navbar-'),
      );
      assert.equal(controls.length, panelCount);
      assert.ok(
        controls.every(
          (control) =>
            control.matches(
              '[data-td-navbar-menu] > a.td-nav-menu__parent-link[data-td-navbar-region="desktop"][data-td-navbar-level="0"]',
            ) &&
            control.getAttribute('aria-expanded') === 'false',
        ),
      );
      const controlledIds = controls.map((control) =>
        control.getAttribute('aria-controls'),
      );
      assert.equal(new Set(controlledIds).size, controlledIds.length);
      for (const id of controlledIds) {
        assert.equal(home.querySelectorAll(`#${id}`).length, 1, id);
      }

      const tutorial = desktop.find((entry) => entry.label === labels[1]);
      assert.equal(tutorial.level, 1);
      assert.ok(tutorial.description.length > 10);
      // External-link behavior is asserted by the flat fixture, which still
      // configures a labelled external entry. The live site only has the
      // icon-only GitHub link, which is not a labelled navbar entry.
    }

    const englishHome = navbarEntries(documentAt(outDir, '/'));
    assert.equal(
      englishHome.find((entry) => entry.label === 'Docs').href,
      `${prefix}/docs/`,
    );
    assert.equal(
      englishHome.find((entry) => entry.label === 'Get started').href,
      `${prefix}/docs/start/`,
    );
    const chineseHome = navbarEntries(documentAt(outDir, '/zh'));
    assert.equal(
      chineseHome.find((entry) => entry.label === '文档').href,
      `${prefix}/zh/docs/`,
    );

    for (const [route, current, roots] of [
      [
        '/docs',
        'Docs',
        [
          { href: `${prefix}/book/`, title: 'Book' },
          { href: `${prefix}/case/`, title: 'Cases' },
          { href: `${prefix}/blog/`, title: 'Blog' },
          { href: `${prefix}/docs/`, title: 'Docs' },
        ],
      ],
      [
        '/zh/docs',
        '文档',
        [
          { href: `${prefix}/zh/book/`, title: '教程' },
          { href: `${prefix}/zh/case/`, title: '案例' },
          { href: `${prefix}/zh/blog/`, title: '博客' },
          { href: `${prefix}/zh/docs/`, title: '文档' },
        ],
      ],
    ]) {
      const page = documentAt(outDir, route);
      assert.equal(
        page.querySelector('.td-shell-root__title')?.textContent.trim(),
        current,
      );
      assert.deepEqual(
        [...page.querySelectorAll('.td-shell-root__item')]
          .map((node) => ({
            href: node.getAttribute('href'),
            title: node
              .querySelector('.td-shell-root__item-title')
              ?.textContent.trim(),
          }))
          .sort((left, right) => left.href.localeCompare(right.href)),
        roots.sort((left, right) => left.href.localeCompare(right.href)),
      );
    }

    for (const route of ['/docs', '/blog', '/zh/docs', '/zh/blog']) {
      assert.equal(
        documentAt(outDir, route)
          .querySelector('[data-td-sidebar-icon-policy]')
          ?.getAttribute('data-td-sidebar-icon-policy'),
        'groups',
        `${route} sidebar policy`,
      );
    }
  });
}

test('flat legacy fixture emits links without disclosure controls', () => {
  const { outDir, output } = build('flat', {
    baseURL: 'https://example.test/preview/',
    fixture: 'flat.yml',
  });
  assert.doesNotMatch(output, /only one interactive child level is supported/);
  const home = documentAt(outDir, '/');
  assert.deepEqual(navbarEntries(home, 'mobile'), []);
  assert.equal(home.querySelectorAll('[data-td-navbar-toggle]').length, 0);
  assert.equal(
    home.querySelectorAll('[data-td-navbar-accordion-toggle]').length,
    0,
  );
  assert.deepEqual(
    navbarEntries(home).map(({ label, href, level, target, rel }) => ({
      label,
      href,
      level,
      target,
      rel,
    })),
    [
      { label: 'Docs', href: '/preview/docs/', level: 0, target: '', rel: '' },
      { label: 'Blog', href: '/preview/blog/', level: 0, target: '', rel: '' },
      {
        label: 'Issues',
        href: 'https://github.com/pgsty/oink/issues',
        level: 0,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ],
  );
});

test('deep fixture warns and degrades to a static group', () => {
  const { outDir, output } = build('deep', {
    baseURL: 'https://example.test/preview/',
    fixture: 'deep.yml',
  });
  assert.match(output, /only one interactive child level is supported/);
  const home = documentAt(outDir, '/');
  assert.deepEqual(navbarEntries(home, 'mobile'), []);
  assert.equal(home.querySelectorAll('[data-td-navbar-toggle]').length, 0);
  assert.equal(
    home.querySelectorAll('[data-td-navbar-accordion-toggle]').length,
    0,
  );
  const parent = home.querySelector(
    '[data-td-navbar-menu] > .td-nav-menu__parent-link[data-td-navbar-region="desktop"]',
  );
  assert.equal(parent?.getAttribute('aria-expanded'), 'false');
  assert.equal(
    parent?.getAttribute('aria-controls'),
    home.querySelector('[data-td-navbar-panel]')?.id,
  );
  assert.equal(home.querySelectorAll('[data-td-navbar-group]').length, 1);

  const desktop = navbarEntries(home);
  const tutorial = desktop.find((entry) => entry.label === 'Tutorials');
  const advanced = desktop.find((entry) => entry.label === 'Advanced setup');
  assert.deepEqual(
    { level: tutorial.level, kind: tutorial.kind },
    { level: 1, kind: 'group' },
  );
  assert.deepEqual(
    { level: advanced.level, kind: advanced.kind },
    { level: 2, kind: 'link' },
  );
  assert.equal(
    home.querySelectorAll('[data-td-navbar-group] button').length,
    0,
  );
});
