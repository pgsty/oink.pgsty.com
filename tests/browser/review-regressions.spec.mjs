import { expect, test } from '@playwright/test';

test('keyboard can reach heading anchors and dismiss a language menu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/docs/customize/config/');
  const anchor = page.locator('.td-content .td-heading-self-link').first();
  await anchor.focus();
  await expect(anchor).toBeFocused();
  await expect(anchor).toHaveCSS('opacity', '1');
  const menu = page.locator('.td-site-header .td-language-selector--menu');
  const trigger = menu.locator('.td-language-selector__trigger');
  await trigger.focus();
  await expect(menu.locator('ul')).toBeVisible();
  await menu.locator('ul a').first().focus();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(menu.locator('ul')).toBeHidden();
});

test('closed mobile drawer has no visible shadow and immersive pages retain utilities', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/docs/customize/config/');
  await expect(page.locator('.td-shell-sidebar__panel')).toHaveCSS('box-shadow', 'none');
  await page.goto('/blog/oink/immersive-reading/');
  const opener = page.locator('[data-td-landing-menu-toggle]');
  await expect(opener).toBeVisible();
  await opener.click();
  const drawer = page.locator('[data-td-landing-menu]');
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('.td-language-selector')).toBeVisible();
  await expect(drawer.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/pgsty/oink');
  const version = drawer.locator('[data-td-version-menu]');
  const trigger = version.locator('button');
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(version.locator('.dropdown-menu')).toBeVisible();
  await expect(drawer).toBeVisible();
  await version.locator('a').first().focus();
  await page.keyboard.press('Escape');
  await expect(version.locator('.dropdown-menu')).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(drawer).toBeVisible();
});

test('Book TOC and component lists keep their own spacing', async ({ page }) => {
  await page.goto('/book/');
  const toc = page.locator('.td-book-toc ol').first();
  await expect(toc).toHaveCSS('list-style-type', 'none');
  await page.goto('/tests/filetree-wrap/');
  const item = page.locator('.td-filetree__item').first();
  await expect(item).toHaveCSS('margin-bottom', '0px');
});

test('Landing uses fluid section spacing and print links remain underlined', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tests/landing-fixes/');
  const padding = await page.locator('.td-landing-section').first().evaluate(node => parseFloat(getComputedStyle(node).paddingTop));
  expect(padding).toBeGreaterThan(90);
  await page.goto('/_print/docs/customize/config/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.td-content p a').first()).toHaveCSS('text-decoration-line', 'underline');
});

test('Chinese blog pagination is a localized navigation landmark', async ({ page }) => {
  await page.goto('/zh/blog/');
  const pager = page.getByRole('navigation', { name: '分页导航', exact: true });
  await expect(pager).toBeVisible();
  await expect(pager.getByRole('link', { name: '下一页', exact: true })).toBeVisible();
  await expect(pager.getByRole('button')).toHaveCount(0);
});
