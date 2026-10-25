import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const gallery = page => page.locator('[data-td-blog-gallery]');
const tiles = page => gallery(page).locator('[data-gallery-item]');
const choose = (page, mode) => gallery(page).locator(`[data-gallery-mode][value="${mode}"]`).check();

async function geometry(page) {
  await expect.poll(() => tiles(page).evaluateAll(nodes => {
    const boxes = nodes.map(n => n.getBoundingClientRect());
    return boxes.every((a, i) => boxes.slice(i + 1).every(b =>
      a.right <= b.left + 1 || b.right <= a.left + 1 || a.bottom <= b.top + 1 || b.bottom <= a.top + 1));
  })).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  // A fixed height plus aspect-ratio must not make the media narrower or wider
  // than its link: that silently clips portraits and adds gaps in justified rows.
  await expect.poll(() => tiles(page).evaluateAll(nodes => nodes.every(n => {
    const link = n.querySelector('a').getBoundingClientRect();
    const media = n.querySelector('.td-blog-gallery__media').getBoundingClientRect();
    return Math.abs(link.width - media.width) < 1;
  }))).toBe(true);
}

for (const locale of ['', '/zh']) {
  for (const touch of [false, true]) {
    test(`${locale || 'en'} gallery ${touch ? 'touch dark' : 'desktop light'}: geometry, focus and article links`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({
        viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        hasTouch: touch, isMobile: touch, colorScheme: touch ? 'dark' : 'light',
      });
      const page = await context.newPage();
      await page.goto(`${baseURL}${locale}/tests/blog-gallery/`);
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', touch ? 'dark' : 'light');
      await expect(tiles(page)).toHaveCount(8);
      await expect(gallery(page).locator('.is-missing')).toHaveCount(1);
      await expect(page.locator('[data-td-expo-viewer]')).toHaveCount(0);
      for (const mode of ['wall', 'seamless', 'cards']) {
        await choose(page, mode);
        await expect(gallery(page)).toHaveAttribute('data-mode', mode);
        await geometry(page);
        if (touch) {
          const widths = await tiles(page).locator('.td-blog-gallery__caption').evaluateAll(nodes => nodes.map(n => n.clientWidth));
          expect(Math.min(...widths)).toBeGreaterThanOrEqual(96);
        }
        if (touch || mode === 'cards') {
          const caption = tiles(page).first().locator('.td-blog-gallery__caption');
          await expect(caption).toHaveCSS('opacity', '1');
          expect(await caption.evaluate(el => el.getBoundingClientRect().top >= el.previousElementSibling.getBoundingClientRect().bottom - 1)).toBe(true);
        }
      }
      await choose(page, 'wall');
      const link = tiles(page).first().locator('a');
      await link.focus();
      await expect(link.locator('.td-blog-gallery__caption')).toHaveCSS('opacity', '1');
      const scan = await new AxeBuilder({ page }).include('[data-td-blog-gallery]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(scan.violations).toEqual([]);
      await page.screenshot({ path: test.info().outputPath('gallery.png') });
      await link.press('Enter');
      await expect(page).toHaveURL(new RegExp(`${locale}/tests/blog-gallery/01/$`));
      await context.close();
    });
  }
}

test('gallery switching, settings, pagination and resize preserve the posts', async ({ page }) => {
  await page.goto('/tests/blog-gallery/');
  const switcher = page.locator('[data-td-blog-index-toggle]');
  const expected = await tiles(page).locator('a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
  for (const form of ['list', 'cards', 'table', 'gallery']) {
    await switcher.click();
    await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', form);
    await expect(page.locator(`[data-td-blog-form="${form}"]`)).toBeVisible();
    if (form !== 'gallery') await expect(gallery(page)).toBeHidden();
  }
  expect(await tiles(page).locator('a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')))).toEqual(expected);
  await geometry(page);
  await choose(page, 'cards');
  await gallery(page).locator('[data-gallery-size]').press('ArrowRight');
  await expect(gallery(page).locator('[data-gallery-size]')).toHaveValue('260');
  await page.setViewportSize({ width: 768, height: 900 });
  await geometry(page);
  await page.reload();
  await expect(gallery(page)).toBeVisible();
  await expect(gallery(page)).toHaveAttribute('data-mode', 'cards');
  await expect(gallery(page).locator('[data-gallery-size]')).toHaveValue('260');
  await page.locator('.td-blog-posts__pagination a').filter({ hasText: /^2$/ }).click();
  await expect(tiles(page)).toHaveCount(1);
  const second = await tiles(page).locator('a').getAttribute('href');
  expect(expected).not.toContain(second);
  await geometry(page);
});

test('gallery works without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/tests/blog-gallery/`);
  await expect(gallery(page)).toBeVisible();
  await expect(gallery(page).locator('[data-gallery-controls]')).toBeHidden();
  await expect(page.locator('[data-td-blog-index-toggle]')).toBeHidden();
  await expect(tiles(page).first().locator('h3')).toBeVisible();
  await geometry(page);
  await tiles(page).first().locator('a').click();
  await expect(page).toHaveURL(/\/tests\/blog-gallery\/01\/$/);
  await context.close();
});

test('failed covers retain visible linked titles', async ({ page }) => {
  await page.route('**/blog-gallery/01/featured.svg', route => route.abort());
  await page.goto('/tests/blog-gallery/');
  await expect(tiles(page).first()).toHaveClass(/is-missing/);
  await expect(tiles(page).first().locator('.td-blog-gallery__caption')).toHaveCSS('opacity', '1');
  await geometry(page);
});

test('fixed gallery ignores a stored outer form, and Expo settings are independent', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('td-blog-index', 'cards');
    localStorage.setItem('td-expo-mode', 'seamless');
    localStorage.setItem('td-expo-size', '360');
  });
  await page.goto('/tests/blog-gallery/');
  await expect(gallery(page)).toHaveAttribute('data-mode', 'wall');
  await expect(gallery(page).locator('[data-gallery-size]')).toHaveValue('240');
  await page.goto('/tests/blog-gallery-fixed/');
  await expect(gallery(page)).toBeVisible();
  await expect(page.locator('[data-td-blog-index-toggle]')).toHaveCount(0);
  await geometry(page);
});
