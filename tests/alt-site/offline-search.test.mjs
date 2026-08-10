import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));

// Build the site in a non-production environment -- `params.offlineSearch` is
// on in `hugo.yml`, and a non-production build leaves the index filenames
// un-fingerprinted -- then validate the generated language-specific indexes.
// This guards the page collection used by
// theme/assets/json/offline-search-index.json.
test('offline-search index covers all site languages', (t) => {
  // Scratch space, kept after the run for inspection; cleared at start.
  const outDir = join(siteDir, 'tmp', 'offline-search');
  rmSync(outDir, { recursive: true, force: true });

  const res = spawnSync(
    `npm run _hugo -- -e dev -DFE ` + `--baseURL http://localhost -d ${outDir}`,
    { cwd: siteDir, shell: true, encoding: 'utf8' },
  );
  const output = `${res.stdout ?? ''}${res.stderr ?? ''}`;
  assert.equal(res.status, 0, `Build failed:\n${output}`);

  for (const [language, ref] of [
    ['en', '/docs/'],
    ['zh', '/zh/docs/'],
  ]) {
    const indexPath = join(outDir, `offline-search-index.${language}.json`);
    assert.ok(existsSync(indexPath), `Missing ${indexPath}`);
    const entries = JSON.parse(readFileSync(indexPath, 'utf8'));
    assert.ok(Array.isArray(entries), `${language} index is not a JSON array`);
    assert.ok(
      entries.length > 80,
      `Suspiciously few ${language} index entries: ${entries.length}`,
    );
    for (const key of ['ref', 'title', 'description', 'headings', 'excerpt']) {
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
          ? entry.ref.startsWith('/zh/')
          : !entry.ref.startsWith('/zh/'),
      ),
      `${language} index contains another language`,
    );
    t.diagnostic(`${language} index entries: ${entries.length}`);
  }
});
