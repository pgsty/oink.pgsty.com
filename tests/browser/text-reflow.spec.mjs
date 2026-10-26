import { expect, test } from '@playwright/test';

test.use({ launchOptions: { firefoxUserPrefs: { 'font.size.variable.x-western': 32, 'font.size.variable.zh-CN': 32 } } });

for (const language of ['', '/zh']) {
  test(`page context reflows at 200 percent text size: ${language || 'en'}`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`${language}/docs/components/presentation/`);
    // Firefox uses its native default font preference. Other engines exercise
    // the same computed text size without changing viewport or CSS pixel zoom.
    if (browserName !== 'firefox') await page.addStyleTag({ content: 'html { font-size: 32px !important; }' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('html')).toHaveCSS('font-size', '32px');
    const noOverlap = () => page.locator('.td-shell-topline').evaluate(el => {
      const actions = el.querySelector('.td-page-actions').getBoundingClientRect();
      const row = el.getBoundingClientRect();
      return Math.abs(actions.right - row.right) < 2 &&
        [...el.querySelectorAll('.breadcrumb-item')].every(item =>
        [...item.getClientRects()].every(rect => rect.right <= actions.left ||
          rect.left >= actions.right || rect.bottom <= actions.top || rect.top >= actions.bottom));
    });
    await expect.poll(noOverlap).toBe(true);
    await page.locator('.breadcrumb-item a').first().evaluate(el => {
      el.textContent = 'LongUnbrokenDocumentationSectionName'.repeat(3);
      const copy = el.parentElement.cloneNode(true);
      el.closest('ol').appendChild(copy);
    });
    for (const width of [320, 390, 768, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(noOverlap).toBe(true);
      expect(await page.locator('.td-breadcrumbs').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      const toggle = page.locator('.td-page-actions__toggle');
      await toggle.focus();
      await page.keyboard.press('ArrowDown');
      const menu = page.locator('.td-page-actions__menu');
      await expect(menu).toBeVisible();
      const box = await menu.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      await expect(menu.locator(':focus')).toHaveCount(1);
      await page.keyboard.press('Escape');
      await expect(toggle).toBeFocused();
    }
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`${language}/docs/components/presentation/`);
    await page.addStyleTag({ content: 'html { font-size: 16px !important; }' });
    await expect.poll(noOverlap).toBe(true);
  });
}
