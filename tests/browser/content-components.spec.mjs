import { expect, test } from '@playwright/test';

test('Asciinema waits for its web font before measuring terminal cells', async ({
  page,
}) => {
  let releaseFont;
  const fontReleased = new Promise((resolve) => {
    releaseFont = resolve;
  });
  let markFontRequested;
  const fontRequested = new Promise((resolve) => {
    markFontRequested = resolve;
  });

  await page.route(
    '**/webfonts/brand/ibm-plex-mono-latin-400-normal.woff2',
    async (route) => {
      markFontRequested();
      await fontReleased;
      await route.continue();
    },
  );

  await page.goto('/docs/content/components/', {
    waitUntil: 'domcontentloaded',
  });
  await fontRequested;

  const player = page.locator('[data-td-asciinema] .ap-player');
  await expect(player).toHaveCount(0);

  releaseFont();
  await expect(player).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() => document.fonts.check('15px "IBM Plex Mono"')),
    )
    .toBe(true);
});
