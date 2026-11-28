import { test, expect } from '@playwright/test';

// Headless Chromium normally hides scrollbars, which masks the width/height
// feedback loop that can occur when an image wall almost fits the viewport.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

const settle = page => page.evaluate(() => new Promise(resolve =>
  requestAnimationFrame(() => requestAnimationFrame(resolve))));

async function sampleGeometry(page) {
  return page.evaluate(async () => {
    const samples = [];
    const grid = document.querySelector('[data-td-expo-grid]');
    for (let frame = 0; frame < 60; frame++) {
      await new Promise(requestAnimationFrame);
      const rect = grid.getBoundingClientRect();
      const image = document.querySelector('[data-td-expo-viewer][open] [data-td-expo-full]');
      const imageRect = image?.getBoundingClientRect();
      samples.push([document.documentElement.clientWidth, document.documentElement.scrollHeight,
        rect.x, rect.y, rect.width, rect.height, imageRect?.width, imageRect?.height]);
    }
    return [...new Set(samples.slice(12).map(sample => JSON.stringify(sample)))];
  });
}

for (const preset of ['paper', 'slate', 'github', 'ink', 'news', 'terminal']) {
  for (const mode of ['wall', 'cards', 'seamless']) {
    test(`Expo ${preset} ${mode}: real scrollbars settle at the viewport threshold`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(({ preset, mode }) => {
        localStorage.setItem('td-preset', preset);
        localStorage.setItem('td-expo-mode', mode);
      }, { preset, mode });
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 400 });
        await page.goto('/expo/studies/');
        await page.evaluate(() => document.fonts.ready);
        // macOS can choose overlay scrollbars even after Chromium's hide flag
        // is removed. Explicit geometry keeps this regression independent of
        // that host preference without stabilizing the document width itself.
        await page.addStyleTag({ content: 'html::-webkit-scrollbar { width: 15px; height: 15px; }' });

        // Measure the actual content under both scrollbar states. Choosing a
        // height between them reproduces the unstable case without hard-coding
        // one font, collection, caption length or operating-system gutter size.
        const forced = await page.addStyleTag({ content: 'html { overflow-y: scroll !important; }' });
        await settle(page);
        const contentHeight = () => page.evaluate(() =>
          document.querySelector('.td-shell-article').getBoundingClientRect().bottom + scrollY +
          document.querySelector('[data-td-shell-footer]').getBoundingClientRect().height);
        const narrow = await contentHeight();
        expect(await page.evaluate(() => innerWidth - document.documentElement.clientWidth)).toBeGreaterThan(0);
        await forced.evaluate(style => { style.textContent = 'html { overflow-y: hidden !important; }'; });
        await settle(page);
        const wide = await contentHeight();
        const threshold = Math.floor((narrow + wide) / 2);
        await page.setViewportSize({ width, height: threshold });
        await forced.evaluate(style => style.remove());

        expect(await sampleGeometry(page)).toHaveLength(1);
        const before = await page.locator('[data-td-expo-grid]').evaluate(grid => grid.getBoundingClientRect().width);
        await page.locator('#img-small [data-td-expo-image]').click();
        await expect(page.locator('[data-td-expo-viewer]')).toBeVisible();
        expect(await sampleGeometry(page)).toHaveLength(1);
        expect(await page.locator('[data-td-expo-grid]').evaluate(grid => grid.getBoundingClientRect().width)).toBe(before);
        await page.keyboard.press('Escape');
        expect(await sampleGeometry(page)).toHaveLength(1);
        expect(await page.locator('[data-td-expo-grid]').evaluate(grid => grid.getBoundingClientRect().width)).toBe(before);
      }
    });
  }
}
