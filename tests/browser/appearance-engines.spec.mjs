import { chromium, firefox, webkit, expect, test } from '@playwright/test';

// Optional engine gate: install Playwright's Firefox/WebKit before running
// `npm run test:appearance:engines`. The normal make browser suite stays on
// its established Chromium dependency.
for (const engine of [chromium, firefox, webkit]) {
  for (const width of [390, 1440]) {
    test(`${engine.name()} ${width}: pre-CSS restoration and native Appearance interaction`, async ({ baseURL }, info) => {
      const browser = await engine.launch();
      const context = await browser.newContext({ baseURL, viewport: { width, height: 900 } });
      try {
        await context.route('https://giscus.app/**', route => route.abort());
        const page = await context.newPage();
        // The desktop Chromium leg also checks state initialization under
        // throttled CPU. This tests ordering, not a filmstrip/paint guarantee.
        if (engine === chromium && width === 1440) {
          const session = await context.newCDPSession(page);
          await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        }
        await page.addInitScript(() => {
          if (!sessionStorage.getItem('preset-seeded')) {
            localStorage.setItem('td-preset', 'slate');
            localStorage.setItem('td-color-theme', 'dark');
            sessionStorage.setItem('preset-seeded', 'yes');
          }
        });
        let release;
        const gate = new Promise(resolve => { release = resolve; });
        await page.route('**/*.css*', async route => { await gate; await route.continue(); });
        const loaded = page.goto('/docs/customize/config/');
        try {
          await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
          await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
          await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#0b1119');
        } finally { release(); }
        await loaded;
        const trigger = page.locator('[data-td-appearance-trigger]:visible').first();
        await expect(trigger.locator('.td-shell-icon--moon')).toBeVisible();
        await expect(trigger.locator('.td-shell-icon--sun')).toBeHidden();
        await trigger.focus();
        await page.keyboard.press('Enter');
        const panel = page.locator('dialog.td-appearance__panel[open]');
        await expect(panel).toBeVisible();
        await expect(panel.locator('[data-td-preset-value="slate"]')).toBeFocused();
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'paper');
        await expect(panel.locator('[data-td-preset-value="paper"]')).toBeChecked();
        await panel.locator('[data-bs-theme-value="light"]').check();
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
        await page.keyboard.press('Escape');
        await expect(trigger).toBeFocused();
        await expect(trigger.locator('.td-shell-icon--sun')).toBeVisible();
        await expect(trigger.locator('.td-shell-icon--moon')).toBeHidden();
        await page.goto('/zh/docs/customize/config/');
        await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'paper');
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
        for (const preset of ['ink', 'terminal']) {
          await page.locator('[data-td-appearance-trigger]:visible').first().click();
          if (preset === 'ink') await page.keyboard.press('ArrowRight'); // Paper -> Slate
          await page.keyboard.press('ArrowRight'); // Slate -> Ink -> Terminal
          await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
          await page.keyboard.press('Escape');
          await page.reload();
          await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
          await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
        }
        await page.screenshot({ path: info.outputPath('actual-output.png') });
        await info.attach('engine-version', { body: browser.version(), contentType: 'text/plain' });
      } finally {
        await context.close();
        await browser.close();
      }
    });
  }
}
