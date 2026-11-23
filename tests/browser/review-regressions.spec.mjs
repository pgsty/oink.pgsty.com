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
  await expect(version.getByRole('list')).toBeVisible();
  await expect(drawer).toBeVisible();
  await version.locator('a').first().focus();
  await page.keyboard.press('Escape');
  await expect(version.getByRole('list')).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
});

test('the bottom-bar version menu toggles and dismisses without a dropdown library', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/docs/customize/config/');
  expect(await page.evaluate(() => typeof window.bootstrap)).toBe('undefined');
  const version = page.locator('.td-shell-footline__right [data-td-version-menu]');
  const trigger = version.locator('.td-version-menu__title');
  const list = version.getByRole('list');
  await trigger.scrollIntoViewIfNeeded();
  await expect(list).toBeHidden();
  await trigger.click();
  await expect(list).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  // The list ends at the trigger's edge of the dock and stays in the viewport.
  const [triggerBox, listBox] = await Promise.all([trigger.boundingBox(), list.boundingBox()]);
  expect(listBox.y + listBox.height).toBeLessThanOrEqual(triggerBox.y + 1);
  expect(Math.abs(listBox.x + listBox.width - (triggerBox.x + triggerBox.width))).toBeLessThanOrEqual(1);
  expect(listBox.x).toBeGreaterThanOrEqual(0);
  await trigger.press('ArrowDown');
  await expect(list.getByRole('link').first()).toBeFocused();
  await trigger.press('ArrowUp');
  await expect(list.getByRole('link').last()).toBeFocused();
  // A press elsewhere dismisses it before any click arrives: iOS sends none
  // for a tap on plain content. The next click opens it again.
  await page.locator('#td-main-content').dispatchEvent('pointerdown');
  await expect(list).toBeHidden();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(list).toBeVisible();
  await trigger.click();
  await expect(list).toBeHidden();
});

test.describe('phone touch', () => {
  test.use({ viewport: { width: 360, height: 890 }, isMobile: true, hasTouch: true });

  test('drawer delivers the tap after an open version list to Appearance or Search', async ({ page }) => {
    await page.goto('/blog/oink/immersive-reading/');
    const opener = page.locator('[data-td-landing-menu-toggle]');
    const drawer = page.locator('[data-td-landing-menu]');
    const version = drawer.locator('[data-td-version-menu] button');
    await opener.tap();
    await version.tap();
    await expect(version).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(version).toBeFocused();
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await opener.tap();
    await version.tap();
    const appearance = drawer.locator('[data-td-appearance-trigger]');
    await appearance.tap();
    await expect(drawer.getByRole('dialog')).toBeVisible();
    await expect(version).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Escape');
    await expect(appearance).toBeFocused();
    await version.tap();
    await drawer.locator('[data-td-shell-search-open]').tap();
    await expect(page.locator('#td-shell-search')).toBeVisible();
    await expect(drawer).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
  });
});

test('hover and activation on the sticky version trigger preserve the reading position', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/customize/config/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo({ top: 1800, behavior: 'instant' });
  });
  const trigger = page.locator('.td-nav-version-menu button');
  const box = await trigger.boundingBox();
  const center = [box.x + box.width / 2, box.y + box.height / 2];
  await page.mouse.move(...center);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.mouse.click(...center);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => scrollY)).toBe(1800);
});

test('a lone footer version control keeps long labels and the last link reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/docs/customize/config/');
  const version = page.locator('.td-shell-footline__version');
  await version.evaluate(wrapper => {
    wrapper.parentElement.replaceChildren(wrapper);
    const list = wrapper.querySelector('ul');
    const item = list.querySelector('a').closest('li');
    for (let index = 0; index < 40; index++) list.append(item.cloneNode(true));
    item.querySelector('a').textContent = 'PostgreSQL'.repeat(20);
  });
  await version.getByRole('button').click();
  for (const direction of ['ltr', 'rtl']) {
    await page.locator('html').evaluate((root, dir) => { root.dir = dir; }, direction);
    const list = version.getByRole('list');
    const box = await list.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    expect(await list.evaluate(node => node.scrollWidth)).toBe(await list.evaluate(node => node.clientWidth));
    await list.getByRole('link').last().focus();
    await expect(list.getByRole('link').last()).toBeInViewport();
  }
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
