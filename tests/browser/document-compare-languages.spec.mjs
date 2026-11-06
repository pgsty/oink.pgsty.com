import { test, expect } from '@playwright/test';

test('eight languages: seven targets, language menu, target replacement, RTL and one Back to exit', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  const sync = page.locator('[data-td-compare-sync]');
  await expect(sync).toBeEnabled();
  const language = page.locator('[data-td-compare-language]');
  await expect(page.locator('[data-td-compare-language-option]')).toHaveCount(7);
  await expect(page.locator('[data-td-compare-frame]')).toHaveCount(2);
  await language.focus();
  await page.keyboard.press('Enter');
  await expect(language).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(language).toHaveAttribute('aria-expanded', 'false');
  await sync.uncheck();
  await language.click();
  await page.getByRole('option', { name: 'Deutsch', exact: true }).click();
  await expect(page.frameLocator('iframe[data-td-compare-frame="1"]').locator('.td-content h1')).toHaveText('Deutsch');
  await expect(sync).toBeEnabled();
  await expect(sync).not.toBeChecked();
  await language.click();
  await page.getByRole('option', { name: 'العربية', exact: true }).click();
  await expect(page.frameLocator('iframe[data-td-compare-frame="1"]').locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(sync).toBeEnabled();
  await expect(page.locator('[data-td-compare-frame]')).toHaveCount(2);
  await page.goBack();
  await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
  await expect(page).toHaveURL(/\/tests\/compare-reader\/$/);
});

test('eight languages: Escape on the closed language trigger closes the reader and returns focus', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  const link = page.locator('.td-content a', { hasText: 'Documentation home' }).first();
  await link.focus();
  await page.keyboard.press('b');
  await expect(page.locator('[data-td-compare-sync]')).toBeEnabled();
  const language = page.locator('[data-td-compare-language]');
  await language.focus();
  await page.keyboard.press('Enter');
  await expect(language).toHaveAttribute('aria-expanded', 'true');
  // The first Escape belongs to the open menu, the next one to the reader.
  await page.keyboard.press('Escape');
  await expect(language).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('dialog[data-td-compare][open]')).toBeVisible();
  await language.focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
  await expect(link).toBeFocused();
});

test('eight languages: Escape right after choosing a language closes the reader', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator('[data-td-compare-sync]')).toBeEnabled();
  const language = page.locator('[data-td-compare-language]');
  await language.click();
  // The selected option keeps the shared language bar's selected state.
  const selected = page.locator('[data-td-compare-language-option][aria-selected="true"]');
  await expect(selected).toHaveCSS('font-weight', '600');
  expect(await selected.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await page.getByRole('option', { name: 'Deutsch', exact: true }).click();
  await expect(language).toBeFocused();
  await expect(language).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
  await expect(page.locator('[data-td-compare-open]')).toBeFocused();
});

test('eight languages: a reload restores the session and the language is remembered', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  const sync = page.locator('[data-td-compare-sync]');
  const target = page.frameLocator('iframe[data-td-compare-frame="1"]').locator('.td-content h1');
  const current = () => page.frames().find(frame => frame.url() && new URL(frame.url()).pathname === '/tests/compare-reader/' && frame !== page.mainFrame());
  await expect(sync).toBeEnabled();
  await page.locator('[data-td-compare-language]').click();
  await page.getByRole('option', { name: 'Deutsch', exact: true }).click();
  await expect(target).toHaveText('Deutsch');
  await expect(sync).toBeEnabled();
  await current().evaluate(() => {
    document.dispatchEvent(new WheelEvent('wheel'));
    scrollTo({ top: scrollY + document.getElementById('middle').getBoundingClientRect().top - 24, behavior: 'instant' });
  });
  // The session is written once scrolling settles.
  await expect.poll(() => page.evaluate(() => history.state?.oinkCompareSession?.marks?.[0]?.before ?? '')).not.toBe('');
  await page.reload();
  await expect(page.locator('dialog[data-td-compare][open]')).toBeVisible();
  await expect(target).toHaveText('Deutsch');
  await expect(sync).toBeEnabled();
  await expect.poll(() => current().evaluate(() => Math.abs(document.getElementById('middle').getBoundingClientRect().top - 24))).toBeLessThan(4);
  // A later explicit opening starts from the remembered language.
  await page.locator('[data-td-compare-close]').click();
  await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
  await page.locator('[data-td-compare-open]').click();
  await expect(target).toHaveText('Deutsch');
  await expect(page.locator('[data-td-compare-language-option][aria-selected="true"]')).toHaveText('Deutsch');
});

test('rtl host: the current page sits on the reading-start side', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/ar/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator('[data-td-compare-frame]')).toHaveCount(2);
  const current = await page.locator('[data-td-compare-side="0"]').boundingBox();
  const target = await page.locator('[data-td-compare-side="1"]').boundingBox();
  expect(current.x).toBeGreaterThan(target.x);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
});

for (const locale of ['', '/ar']) {
  for (const side of [0, 1]) {
    test(`${locale || 'en'} compare: resizing preserves menu focus and visible pane ${side}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${locale}/tests/compare-reader/`);
      await page.locator('[data-td-compare-open]').click();
      await expect(page.locator('[data-td-compare-sync]')).toBeEnabled();
      await page.locator('.td-compare__tab').nth(side).click();
      // Keep pointer hover separate from the keyboard state under test: in
      // RTL the wide language menu can move beneath the last tab-click point.
      await page.mouse.move(1, 1);
      const language = page.locator('[data-td-compare-language]');
      const options = page.locator('[data-td-compare-language-option]');
      await language.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowDown');
      await expect(options.nth(1)).toBeFocused();
      for (const width of [1200, 390]) {
        await page.setViewportSize({ width, height: 844 });
        // Include the focusout/pointerleave close delay in the observation.
        await page.waitForTimeout(180);
        await expect(options.nth(1)).toBeFocused();
        await expect(language).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('.td-compare__tab').nth(side)).toHaveAttribute('aria-pressed', 'true');
        const host = width < 900 ? '.td-compare__mobile' : '[data-td-compare-side="1"] .td-compare__pane-heading';
        await expect(page.locator(`${host} [data-td-compare-language]`)).toBeVisible();
      }
      await page.keyboard.press('ArrowDown');
      await expect(options.nth(2)).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(options.nth(2)).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('[data-td-compare-sync]')).toBeEnabled();
      // A selected language returns focus to a closed trigger; resizing
      // preserves that state as well as focus within an open menu.
      for (const width of [1200, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.waitForTimeout(180);
        await expect(language).toBeFocused();
        await expect(language).toHaveAttribute('aria-expanded', 'false');
      }
      await expect(page.locator(`[data-td-compare-side="${side}"]`)).toBeVisible();
      await expect(page.locator(`[data-td-compare-side="${1 - side}"]`)).toBeHidden();
      await page.keyboard.press('Enter');
      await expect(options.nth(2)).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(language).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator(`[data-td-compare-frame="${side}"]`)).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog[data-td-compare]')).toHaveCount(0);
    });
  }
}
