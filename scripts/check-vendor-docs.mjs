// The documentation checkout targets the sibling release candidate before its tag exists.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const manifest = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const packages = new Map(manifest.dependencies.map(({ name, version, license }) => [name, [version, license]]));

for (const file of ['license.md', 'license.zh.md']) {
  const page = readFileSync(new URL('../content/docs/about/' + file, import.meta.url), 'utf8');
  const rows = [...page.matchAll(/^\|\s*([^|\s]+)\s*\|\s*(\d[\w.-]*)\s*\|\s*([^|]+?)\s*\|/gm)];
  assert.equal(rows.length, packages.size, file + ' dependency count');
  assert.deepEqual(new Map(rows.map(([, name, version, license]) => [name, [version, license]])), packages, file);
  const metadata = file === 'license.md'
    ? /generated ([\d-]+), schema (\d+), (\d+) entries/
    : /生成于 ([\d-]+)，schema (\d+)，共 (\d+) 项/;
  assert.deepEqual(page.match(metadata)?.slice(1), [manifest.generated, String(manifest.schema), String(packages.size)], file + ' manifest summary');
}
console.log('Both license tables match all ' + packages.size + ' vendored dependencies.');
