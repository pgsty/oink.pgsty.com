import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const tmpDir = join(siteDir, 'tmp');

function buildSite() {
  if (process.env.OINK_BUILD_LOG) {
    return readFileSync(join(siteDir, process.env.OINK_BUILD_LOG), 'utf8');
  }

  mkdirSync(tmpDir, { recursive: true });
  const destDir = mkdtempSync(join(tmpDir, 'no-deprecations-'));
  try {
    const res = spawnSync('npm run build -- -d ' + destDir + ' --noBuildLock', {
      cwd: siteDir,
      shell: true,
      encoding: 'utf8',
    });
    const output = `${res.stdout ?? ''}${res.stderr ?? ''}`;
    assert.equal(res.status, 0, `Build failed:\n${output}`);
    return output;
  } finally {
    rmSync(destDir, { recursive: true, force: true });
  }
}

test('site build logs no Hugo deprecation notices', (t) => {
  // The complete suite explicitly passes the successful `test:base` log.
  // Focused runs build a fresh copy instead of trusting an implicit tmp file.
  const output = buildSite();
  assert.match(output, /Start building sites/);
  assert.match(output, /Total in \d+ ms/);
  const deprecations = output
    .split('\n')
    .filter((line) => /deprecated/i.test(line));
  assert.deepEqual(deprecations, [], 'Hugo build logged deprecation notice(s)');
  t.diagnostic(`Scanned ${output.split('\n').length} build-log lines`);
});

// The check above can only catch deprecations if the build runs at a log level
// where Hugo surfaces them (`info` or more verbose). Rather than re-derive that
// with a second build that seeds a deprecated API call -- which would have to
// mutate tracked source -- assert the invariant statically against the `_hugo`
// script. If someone raises the level (e.g. to `warn`), this fails fast.
test('the site build runs at a log level that surfaces deprecations', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
  );
  const hugoScript = pkg.scripts?._hugo ?? '';
  const match = hugoScript.match(/--logLevel\s+(\w+)/);
  assert.ok(match, `_hugo script has no --logLevel flag: ${hugoScript}`);
  assert.ok(
    ['info', 'debug'].includes(match[1]),
    `_hugo --logLevel ${match[1]} is too quiet to surface Hugo deprecation ` +
      'notices; use info (or more verbose)',
  );
});
