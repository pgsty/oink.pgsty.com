import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

for (const locale of ['', '/zh']) {
  for (const guide of ['cli', 'cli-overview']) {
    const legacy = `${locale}/docs/start/${guide}/`;
    const target = `${locale}/docs/cli/`;

    test(`${legacy} redirects to the localized CLI introduction`, () => {
      const html = readFileSync(path.join(publicDir, legacy, 'index.html'), 'utf8');
      const { document } = new JSDOM(html).window;
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      const refresh = document.querySelector('meta[http-equiv="refresh"]')?.content;
      assert.ok(canonical, 'Legacy route has no canonical destination');
      assert.equal(new URL(canonical).pathname, target);
      assert.match(refresh ?? '', /^0;\s*url=/i, 'Legacy route must redirect immediately');
      assert.equal(refresh.replace(/^0;\s*url=/i, ''), canonical);
      assert.notEqual(new URL(canonical).pathname, legacy, 'Redirect loops to itself');

      const destination = new JSDOM(
        readFileSync(path.join(publicDir, target, 'index.html'), 'utf8'),
      ).window.document;
      assert.equal(destination.querySelector('h1')?.textContent.trim(), 'OINK CLI');
      assert.equal(destination.documentElement.lang.split('-')[0], locale ? 'zh' : 'en');
    });
  }
}
