import { inflateRawSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

async function isolate(page, baseURL) {
  const unexpected = [];
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (/^https?:$/.test(url.protocol) && url.origin !== new URL(baseURL).origin) {
      unexpected.push(url.href);
      return route.abort();
    }
    return route.continue();
  });
  return unexpected;
}

test('DocSearch uses the configured index, displays results and follows a result', async ({ page, baseURL }) => {
  const unexpected = await isolate(page, baseURL);
  const requests = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/https:\/\/[^/]+\.(algolia\.net|algolianet\.com)\/.*queries/, async route => {
    const payload = route.request().postDataJSON();
    requests.push(...payload.requests);
    const hierarchy = { lvl0: 'Docs', lvl1: 'Dependency acceptance', lvl2: null, lvl3: null, lvl4: null, lvl5: null, lvl6: null };
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ results: payload.requests.map(request => ({
      hits: [{ objectID: 'acceptance', type: 'lvl1', hierarchy, content: 'Dependency acceptance result',
        url: new URL('/tests/dependency-notes/?found=1', baseURL).href,
        _highlightResult: { hierarchy: Object.fromEntries(Object.entries(hierarchy).map(([key, value]) => [key, { value, matchLevel: 'full', matchedWords: ['dependency'] }])) },
        _snippetResult: { content: { value: 'Dependency acceptance result', matchLevel: 'full' } },
      }],
      nbHits: 1, page: 0, nbPages: 1, hitsPerPage: 20, processingTimeMS: 1,
      query: request.query || new URLSearchParams(request.params).get('query') || '', params: '',
    })) }) });
  });
  await page.goto('/tests/dependency-notes/');
  await page.locator('#td-docsearch button').click();
  await page.locator('.DocSearch-Input').fill('dependency');
  const hit = page.locator('.DocSearch-Hit a').filter({ hasText: 'Dependency acceptance' });
  await expect(hit).toBeVisible();
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every(request => request.indexName === 'oink-test')).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.DocSearch-Modal')).toHaveCount(0);
  await expect(page.locator('#td-docsearch button')).toBeFocused();
  await page.locator('#td-docsearch button').click();
  await page.locator('.DocSearch-Input').fill('dependency');
  await hit.click();
  await expect(page).toHaveURL(new URL('/tests/dependency-notes/?found=1', baseURL).href);
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});

test('DocSearch stays usable after a service error and retries a new query', async ({ page, baseURL }) => {
  const unexpected = await isolate(page, baseURL);
  let unavailable = true;
  const responses = [];
  await page.route(/https:\/\/[^/]+\.(algolia\.net|algolianet\.com)\/.*queries/, route => {
    const requests = route.request().postDataJSON().requests;
    responses.push(unavailable ? 503 : 200);
    return route.fulfill({ status: unavailable ? 503 : 200, contentType: 'application/json',
      body: JSON.stringify(unavailable ? { message: 'Temporarily unavailable', status: 503 } : {
        results: requests.map(() => ({ hits: [], nbHits: 0, page: 0, nbPages: 0, hitsPerPage: 20, processingTimeMS: 1, query: 'recovered', params: '' })),
      }),
    });
  });
  await page.goto('/zh/tests/dependency-notes/');
  await page.locator('#td-docsearch button').click();
  await page.locator('.DocSearch-Input').fill('unavailable');
  // DocSearch 5.2 treats exhausted transport retries as an empty result set.
  // Verify the real vendor behavior and recovery rather than assuming its
  // unused ErrorScreen component is part of this path.
  await expect(page.locator('.DocSearch-NoResults')).toContainText('unavailable');
  expect(responses).toContain(503);
  unavailable = false;
  await page.locator('.DocSearch-Input').fill('recovered');
  await expect(page.locator('.DocSearch-NoResults')).toContainText('recovered');
  expect(responses).toContain(200);
  await page.keyboard.press('Escape');
  await expect(page.locator('#td-docsearch button')).toBeFocused();
  expect(unexpected).toEqual([]);
});

function decodePlantUML(value) {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  const bytes = [];
  for (let i = 0; i < value.length; i += 4) {
    const [a, b, c, d] = [...value.slice(i, i + 4)].map(character => alphabet.indexOf(character));
    bytes.push((a << 2) | (b >> 4), ((b & 15) << 4) | (c >> 2), ((c & 3) << 6) | d);
  }
  return inflateRawSync(Buffer.from(bytes)).toString('utf8');
}

for (const storage of ['indexedDB', 'unavailable']) {
  test(`server PlantUML preserves UTF-8 and renders independent SVGs with ${storage} storage`, async ({ page, baseURL }) => {
    const unexpected = await isolate(page, baseURL);
    const requests = [];
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (storage === 'unavailable') await page.addInitScript(() => {
      for (const key of ['indexedDB', 'localStorage']) Object.defineProperty(window, key, {
        configurable: true, get() { throw new DOMException('Storage denied', 'SecurityError'); },
      });
    });
    await page.route('https://plantuml.invalid/svg/*', route => {
      requests.push(decodePlantUML(new URL(route.request().url()).pathname.split('/').pop()));
      return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><defs><linearGradient id="accent"><stop stop-color="red"/></linearGradient></defs><rect width="200" height="60" fill="url(#accent)"/><text x="10" y="30">中文 SVG</text></svg>' });
    });
    await page.goto('/tests/dependency-services/');
    const diagrams = page.locator('.td-content svg[data-src]');
    await expect(diagrams).toHaveCount(2);
    for (const diagram of await diagrams.all()) await expect(diagram).toContainText('中文 SVG');
    expect(requests).toEqual(['@startuml\nAlice -> Bob: 中文 <tag> & "quotes"\n@enduml']);
    const ids = await diagrams.locator('linearGradient').evaluateAll(nodes => nodes.map(node => node.id));
    expect(new Set(ids).size).toBe(2);
    for (let i = 0; i < 2; i++) await expect(diagrams.nth(i).locator('rect')).toHaveAttribute('fill', `url(#${ids[i]})`);
    if (storage === 'indexedDB') {
      await expect.poll(() => page.evaluate(async () => {
        const request = indexedDB.open('keyval-store');
        const db = await new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = reject; });
        try {
          const read = db.transaction('keyval').objectStore('keyval').getAllKeys();
          return await new Promise((resolve, reject) => { read.onsuccess = () => resolve(read.result.filter(key => key.startsWith('loader_')).length); read.onerror = reject; });
        } finally { db.close(); }
      })).toBe(1);
      await page.reload();
      for (const diagram of await diagrams.all()) await expect(diagram).toContainText('中文 SVG');
      expect(requests).toHaveLength(1);
    }
    expect(unexpected).toEqual([]);
    expect(errors).toEqual([]);
  });
}
