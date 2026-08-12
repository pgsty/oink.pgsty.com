import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function fail(message) {
  console.error(`Release pin check failed: ${message}`);
  process.exitCode = 1;
}

function hasThemeReplacement(goMod) {
  let replaceBlock = false;
  for (const sourceLine of goMod.split(/\r?\n/)) {
    const line = sourceLine.replace(/\s*\/\/.*$/, '').trim();
    if (!line) continue;
    if (replaceBlock) {
      if (line === ')') {
        replaceBlock = false;
      } else if (/^github\.com\/pgsty\/oink(?:\s|$)/.test(line)) {
        return true;
      }
      continue;
    }
    if (/^replace\s*\($/.test(line)) {
      replaceBlock = true;
    } else if (/^replace\s+github\.com\/pgsty\/oink(?:\s|$)/.test(line)) {
      return true;
    }
  }
  return false;
}

try {
  const config = readFileSync(new URL('../hugo.yml', import.meta.url), 'utf8');
  const goMod = readFileSync(new URL('../go.mod', import.meta.url), 'utf8');
  const siteVersion = config.match(/^  version: (v\d+\.\d+\.\d+)$/m)?.[1];
  const latestVersion = config.match(
    /^    latest: [^\r\n]*?\b(v\d+\.\d+\.\d+)\b[^\r\n]*$/m,
  )?.[1];
  const pinnedTheme = goMod.match(
    /^\s*(?:require\s+)?github\.com\/pgsty\/oink\s+(\S+)(?:\s+\/\/.*)?$/m,
  )?.[1];

  assert.ok(siteVersion, 'hugo.yml has no stable params.version');
  assert.equal(
    latestVersion,
    siteVersion,
    `tdVersion.latest ${latestVersion ?? '(missing)'} differs from ${siteVersion}`,
  );
  assert.equal(
    pinnedTheme,
    siteVersion,
    `go.mod pins ${pinnedTheme ?? '(missing)'} while the site advertises ${siteVersion}`,
  );
  assert.equal(
    hasThemeReplacement(goMod),
    false,
    'go.mod must not replace the published OINK module in a release build',
  );
  console.log(
    `Release pin check passed: site and theme both use ${siteVersion}`,
  );
} catch (error) {
  fail(error.message);
}
