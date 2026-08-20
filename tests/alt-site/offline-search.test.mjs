import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const localWorkspace = join(siteDir, 'go.work');
const moduleWorkspace =
  process.env.HUGO_MODULE_WORKSPACE ||
  (existsSync(localWorkspace) ? localWorkspace : undefined);
const rawBudget = 2 * 1024 * 1024;
const gzipBudget = 512 * 1024;
const requiredFields = [
  'ref',
  'title',
  'categories',
  'tags',
  'excerpt',
  'headings',
  'description',
  'root',
  'section',
  'type',
  'keywords',
  'boost',
  'breadcrumb',
  'icon',
];

function entryBySuffix(entries, suffix) {
  const matches = entries.filter((entry) => entry.ref.endsWith(suffix));
  assert.equal(matches.length, 1, `Expected one index entry ending ${suffix}`);
  return matches[0];
}

// Build the site in a non-production environment -- `params.offline_search` is
// on in `hugo.yml`, and a non-production build leaves the index filenames
// un-fingerprinted -- then validate the generated language-specific indexes.
// This guards the page collection used by
// theme/assets/json/offline-search-index.json.
for (const [deployment, baseURL, prefix] of [
  ['root', 'https://example.test/', ''],
  ['subpath', 'https://example.test/preview/', '/preview'],
]) {
  test(`offline-search index covers all site languages under ${deployment}`, (t) => {
    // Scratch space, kept after the run for inspection; cleared at start.
    const outDir = join(siteDir, 'tmp', `offline-search-${deployment}`);
    rmSync(outDir, { recursive: true, force: true });

    const res = spawnSync(
      `npm run _hugo -- -e dev -DFE ` +
        `--baseURL ${baseURL} -d ${outDir} --noBuildLock`,
      {
        cwd: siteDir,
        shell: true,
        encoding: 'utf8',
        env: {
          ...process.env,
          ...(moduleWorkspace
            ? { HUGO_MODULE_WORKSPACE: moduleWorkspace }
            : {}),
        },
      },
    );
    const output = `${res.stdout ?? ''}${res.stderr ?? ''}`;
    assert.equal(res.status, 0, `Build failed:\n${output}`);

    for (const [language, ref] of [
      ['en', `${prefix}/docs/`],
      ['zh', `${prefix}/zh/docs/`],
    ]) {
      const indexPath = join(outDir, `offline-search-index.${language}.json`);
      assert.ok(existsSync(indexPath), `Missing ${indexPath}`);
      const entries = JSON.parse(readFileSync(indexPath, 'utf8'));
      assert.ok(
        Array.isArray(entries),
        `${language} index is not a JSON array`,
      );
      assert.ok(
        entries.length > 60,
        `Suspiciously few ${language} index entries: ${entries.length}`,
      );
      for (const key of requiredFields) {
        assert.ok(key in entries[0], `${language} entries lack "${key}"`);
      }
      assert.ok(
        !('body' in entries[0]),
        `${language} summary entries unexpectedly contain full page bodies`,
      );
      assert.ok(
        entries.some((e) => e.ref === ref),
        `Index lacks an entry for ${ref}`,
      );
      assert.ok(
        entries.every((entry) =>
          language === 'zh'
            ? entry.ref.startsWith(`${prefix}/zh/`)
            : entry.ref.startsWith(`${prefix}/`) &&
              !entry.ref.startsWith(`${prefix}/zh/`),
        ),
        `${language} index contains another language`,
      );

      const payload = readFileSync(indexPath);
      assert.ok(
        payload.length <= rawBudget,
        `${language} raw index exceeds budget`,
      );
      const compressed = gzipSync(payload, { mtime: 0 });
      assert.ok(
        compressed.length <= gzipBudget,
        `${language} gzip index exceeds budget`,
      );

      const config = entryBySuffix(entries, '/docs/customize/config/');
      const tutorial = entryBySuffix(entries, '/docs/start/from-scratch/');
      const blog = entryBySuffix(entries, '/blog/oink/oink-announcement/');
      assert.equal(config.boost, 1.6);
      assert.equal(tutorial.boost, 1.35);
      assert.equal(blog.boost, 0.9);
      // Each language carries its own search_keywords: a reader searching in
      // Chinese matches the Chinese terms, and the shared configuration key
      // names appear in both.
      assert.deepEqual(
        config.keywords,
        language === 'zh'
          ? [
              '配置', '参数', '站点配置', 'hugo.yml', 'params', 'params.ui',
              'configuration', 'config', '默认值', 'default',
            ]
          : [
              'configuration', 'hugo.yml', 'parameters', 'params.ui',
              'defaults', 'site settings', 'reference',
            ],
      );
      assert.deepEqual(
        config.breadcrumb,
        language === 'zh'
          ? ['文档', '定制站点', '配置总览']
          : ['Docs', 'Customization', 'Configuration'],
      );
      assert.deepEqual([config.root, blog.root], ['docs', 'blog']);
      assert.ok(
        entries.every(
          (entry) =>
            ![
              '/tests/alerts/',
              '/tests/code-blocks/',
              '/tests/layouts/no-left-sidebar/',
            ].some((suffix) => entry.ref.endsWith(suffix)),
        ),
        `${language} index retained an excluded alias fixture`,
      );
      assert.ok(entries.every((entry) => entry.boost > 0));
      assert.ok(entries.every((entry) => Array.isArray(entry.keywords)));
      assert.ok(entries.every((entry) => Array.isArray(entry.breadcrumb)));
      t.diagnostic(
        `${language}: ${entries.length} entries, ${payload.length} B raw, ` +
          `${compressed.length} B gzip`,
      );
    }
  });
}
