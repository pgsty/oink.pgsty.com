import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const publicDir = new URL('../../public/', import.meta.url);

test('page actions open the published Markdown index in the reader’s language', () => {
  for (const [prefix, label] of [['', 'Markdown index'], ['zh/', 'Markdown 索引']]) {
    const html = readFileSync(new URL(`${prefix}docs/customize/search/index.html`, publicDir), 'utf8');
    const { document } = new JSDOM(html).window;
    const links = [...document.querySelectorAll('[data-td-page-actions] a')];
    const matches = links.filter((link) => link.textContent.trim() === label);
    assert.equal(matches.length, 1, prefix || 'en');
    assert.equal(matches[0].getAttribute('href'), `/${prefix}llms.txt`);
    assert.match(readFileSync(new URL(`${prefix}llms.txt`, publicDir), 'utf8'), /^# /m);
  }
});
