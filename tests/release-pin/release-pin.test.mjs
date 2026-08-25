import assert from 'node:assert/strict';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const scriptSource = new URL(
  '../../scripts/check-release-pin.mjs',
  import.meta.url,
);

function runCheck(goMod, config = null) {
  const fixture = mkdtempSync(join(tmpdir(), 'oink-release-pin-'));
  try {
    mkdirSync(join(fixture, 'scripts'));
    copyFileSync(scriptSource, join(fixture, 'scripts/check-release-pin.mjs'));
    writeFileSync(
      join(fixture, 'hugo.yml'),
      config ||
        [
          'params:',
          '  version: v0.3.0',
          '  tdVersion:',
          '    latest: Current (v0.3.0)',
          '',
        ].join('\n'),
    );
    writeFileSync(join(fixture, 'go.mod'), goMod);
    return spawnSync(process.execPath, ['scripts/check-release-pin.mjs'], {
      cwd: fixture,
      encoding: 'utf8',
    });
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test('accepts an exact stable theme tag in either go.mod require form', () => {
  for (const goMod of [
    'module example.test/site\n\nrequire github.com/pgsty/oink v0.3.0\n',
    [
      'module example.test/site',
      '',
      'require (',
      '  github.com/pgsty/oink v0.3.0',
      ')',
      '',
    ].join('\n'),
  ]) {
    const result = runCheck(goMod);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /site and theme both use v0\.3\.0/);
  }
});

test('rejects a pseudo-version when the site advertises a stable release', () => {
  const result = runCheck(
    'module example.test/site\n\nrequire github.com/pgsty/oink v0.2.2-0.20260812083702-9fc1d5ea50c8\n',
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /go\.mod pins .* while the site advertises v0\.3\.0/,
  );
});

test('rejects a local replacement even when the exact tag is required', () => {
  const result = runCheck(
    [
      'module example.test/site',
      '',
      'require github.com/pgsty/oink v0.3.0',
      'replace github.com/pgsty/oink => ../oink',
      '',
    ].join('\n'),
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must not replace the published OINK module/);
});

test('rejects a local replacement inside a replace block', () => {
  const result = runCheck(
    [
      'module example.test/site',
      '',
      'require github.com/pgsty/oink v0.3.0',
      'replace (',
      '  // Release builds must not use this local checkout.',
      '  github.com/pgsty/oink => ../oink',
      ')',
      '',
    ].join('\n'),
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must not replace the published OINK module/);
});

test('rejects disagreement between the advertised current and latest versions', () => {
  const result = runCheck(
    'module example.test/site\n\nrequire github.com/pgsty/oink v0.3.0\n',
    [
      'params:',
      '  version: v0.3.0',
      '  tdVersion:',
      '    latest: Current (v0.2.1)',
      '',
    ].join('\n'),
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /tdVersion\.latest v0\.2\.1 differs from v0\.3\.0/,
  );
});

test('CI resolves a public pin without a workspace and fails on warnings', () => {
  // These steps lived in the GitHub Pages deploy workflow until that second,
  // unused publication target was removed -- Cloudflare Pages serves the site.
  const workflow = readFileSync(
    new URL('../../.github/workflows/site-checks.yml', import.meta.url),
    'utf8',
  );
  assert.match(workflow, /^  GOWORK: off$/m);
  assert.match(workflow, /^  HUGO_MODULE_WORKSPACE: off$/m);
  assert.match(workflow, /go mod download github\.com\/pgsty\/oink/);
  assert.match(workflow, /node scripts\/check-release-pin\.mjs/);
  assert.match(workflow, /--printPathWarnings --panicOnWarning/);
  assert.ok(
    workflow.indexOf('go mod download github.com/pgsty/oink') <
      workflow.indexOf('node scripts/check-release-pin.mjs') &&
      workflow.indexOf('node scripts/check-release-pin.mjs') <
        workflow.indexOf('hugo --cleanDestinationDir'),
    'CI must resolve the public module and verify its pin before building',
  );
});
