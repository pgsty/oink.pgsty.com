import { test, expect } from '@playwright/test';

// Playwright's default headless shell disables bfcache. Use full Chromium
// with it enabled and assert a persisted pageshow, not a network reload.
test.use({
  channel: 'chromium',
  launchOptions: {
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    ignoreDefaultArgs: ['--disable-back-forward-cache'],
  },
});

test('compare: bfcache return reuses the reader entry and one Back closes it', async ({ page }) => {
  await page.addInitScript(() => {
    window.compareRestoredFromCache = false;
    addEventListener('pageshow', event => {
      if (event.persisted) window.compareRestoredFromCache = true;
    });
  });
  await page.goto('/book/');
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  const sync = page.locator('[data-td-compare-sync]');
  await expect(sync).toBeEnabled();
  const token = await page.evaluate(() => history.state.oinkCompareReader);
  await page.goto('/docs/');
  const length = await page.evaluate(() => history.length);
  await page.evaluate(() => history.back());
  await expect(page).toHaveURL(/\/tests\/compare-reader\/$/);
  await expect.poll(() => page.evaluate(() => window.compareRestoredFromCache)).toBe(true);
  await expect(sync).toBeEnabled();
  expect(await page.evaluate(() => history.state.oinkCompareReader)).toBe(token);
  expect(await page.evaluate(() => history.length)).toBe(length);
  // bfcache does not emit a new load event; observe the resulting UI/URL.
  await page.evaluate(() => history.back());
  await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
  await page.evaluate(() => history.back());
  await expect(page).toHaveURL(/\/book\/$/);
});
