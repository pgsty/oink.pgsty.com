import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const publicDir = new URL('../../public/', import.meta.url);

test('Cloudflare Pages preserves HTML at the root and nested directory URLs', () => {
  const headers = readFileSync(new URL('_headers', publicDir), 'utf8');
  const rules = headers.trim().split(/\n\s*\n/);
  for (const route of ['/', '/*/']) {
    const rule = rules.find((block) => block.startsWith(route + '\n'));
    assert.ok(rule, `missing Pages header rule for ${route}`);
    const policy = rule.match(/^\s+Cache-Control:\s*(.+)$/im)?.[1];
    assert.ok(policy?.split(',').some((value) => value.trim() === 'no-transform'),
      `Cloudflare can rewrite module references at ${route}`);
  }
});

test('readers can copy the published installation command without JavaScript in both languages', () => {
  const goMod = readFileSync(new URL('../../go.mod', import.meta.url), 'utf8');
  const version = goMod.match(/\bgithub\.com\/pgsty\/oink\s+(v\d+\.\d+\.\d+)\b/)?.[1];
  assert.ok(version, 'expected a published theme pin');
  const command = `hugo mod get github.com/pgsty/oink@${version}`;
  for (const prefix of ['', 'zh/']) {
    for (const route of ['docs/admin/upgrade/', `release/${version.slice(1)}/`]) {
      const html = readFileSync(new URL(`${prefix}${route}index.html`, publicDir), 'utf8');
      const { document } = new JSDOM(html).window;
      const examples = [...document.querySelectorAll('pre code')];
      assert.ok(examples.some((code) => code.textContent.includes(command)), prefix + route);
    }
  }
});
