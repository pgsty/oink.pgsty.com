import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const route = '/docs/components/presentation/';
const presets = ['paper', 'slate', 'ink', 'terminal'];

test.beforeEach(async ({ context }) => {
  await context.route('https://giscus.app/**', route => route.abort());
});

for (const preset of presets) {
  for (const mode of ['light', 'dark']) {
    for (const locale of ['', '/zh']) {
      test(`${preset} ${mode} ${locale || 'en'}: component layout and states`, async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await page.addInitScript(({ preset, mode }) => {
          localStorage.setItem('td-preset', preset);
          localStorage.setItem('td-color-theme', mode);
        }, { preset, mode });
        await page.goto(locale + route);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);

        for (const width of [1440, 768, 390, 320]) {
          await page.setViewportSize({ width, height: 900 });
          expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
          const commands = page.locator('.td-code-command');
          for (const command of await commands.all()) {
            const geometry = await command.evaluate(el => {
              const source = el.querySelector('.td-code__viewport').getBoundingClientRect();
              const copy = el.querySelector('button').getBoundingClientRect();
              return { sourceRight: source.right, copyLeft: copy.left, right: el.getBoundingClientRect().right };
            });
            expect(geometry.sourceRight).toBeLessThanOrEqual(geometry.copyLeft);
            expect(geometry.right).toBeLessThanOrEqual(width + 1);
          }
          await expect(page.locator('#presentation-card-list')).toHaveCSS('grid-template-columns', /\d/);
          if (width === 390) {
            const scan = await new AxeBuilder({ page }).include('#td-main-content')
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
            expect(scan.violations).toEqual([]);
          }
        }

        const summary = page.locator('details.td-callout--details > summary');
        const before = await summary.boundingBox();
        await summary.click();
        const after = await summary.boundingBox();
        expect(after.height).toBeCloseTo(before.height, 1);
        await summary.focus();
        await page.keyboard.press('Space');
        await expect(summary.locator('..')).not.toHaveAttribute('open');

        const card = page.locator('#presentation-cards > li').first();
        await card.scrollIntoViewIfNeeded();
        const cardBefore = await card.boundingBox();
        await card.hover();
        const cardAfter = await card.boundingBox();
        expect(cardAfter.y).toBeCloseTo(cardBefore.y, 1);

        const button = page.locator('#presentation-command [data-td-code-copy]');
        const source = 'hugo server --bind 127.0.0.1 --port 1313\n';
        const copyBefore = await button.boundingBox();
        await button.click();
        await expect(button).toHaveAttribute('data-td-state', 'success');
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
        expect((await button.boundingBox()).width).toBe(copyBefore.width);

        // Inline emphasis must not put a secondary link behind the card target.
        const nativeCard = page.locator('#presentation-card-list > li').first();
        await nativeCard.locator('strong a').click();
        await expect(page).toHaveURL(new RegExp(`${locale}/docs/customize/config/`));
        await page.goBack();
        await nativeCard.click({ position: { x: 8, y: 8 } });
        await expect(page).toHaveURL(new RegExp(`${locale}/docs/write/`));
        await page.goBack();

        // A card without a title URL must leave body links independently usable.
        const bodyLink = page.locator('.td-content-card__description a').first();
        await bodyLink.click();
        await expect(page).toHaveURL(new RegExp(`${locale}/docs/customize/config/`));
      });
    }
  }
}

for (const locale of ['', '/zh']) {
  test(`${locale || 'en'}: no scripts, print, and touch retain content`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto(locale + route);
    const summary = page.locator('details.td-callout--details > summary');
    await summary.tap();
    await expect(summary.locator('..')).toHaveAttribute('open', '');
    await expect(page.locator('#presentation-steps')).toHaveAttribute('start', '3');
    await expect(page.locator('.td-code-command pre')).toHaveCount(2);
    await expect(page.locator('.td-code__copy:visible')).toHaveCount(0);
    await expect(page.locator('.td-code-command .td-code__utilities:visible')).toHaveCount(0);
    await page.goto(`${locale}/_print/docs/components/presentation/`);
    await expect(page.locator('details')).toHaveCount(0);
    await expect(page.locator('pre').filter({ hasText: 'brew install hugo' })).toBeVisible();
    await expect(page.locator('pre').filter({ hasText: 'sudo apt install hugo' })).toBeVisible();
    await context.close();
  });
}

test('coarse-pointer controls and reduced-motion press keep geometry stable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(route);
  for (const selector of ['#presentation-command button', '.td-tabs__tab']) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const copy = page.locator('#presentation-command button');
  await copy.focus();
  await page.keyboard.down('Space');
  expect(await copy.evaluate(el => getComputedStyle(el, '::before').transform)).toBe('none');
  await page.keyboard.up('Space');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.locator('.td-tabs__tab[aria-selected="true"]')).toBeVisible();
  await context.close();
});

test('Landing command feedback keeps its size and readable contrast on dark surfaces', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/tests/runtime/landing/');
  for (const preset of presets) {
    for (const mode of ['light', 'dark']) {
      await page.evaluate(({ preset, mode }) => {
        localStorage.setItem('td-preset', preset);
        localStorage.setItem('td-color-theme', mode);
      }, { preset, mode });
      await page.reload();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', mode);
      const button = page.locator('.td-landing-command-box button');
      const before = await button.boundingBox();
      await button.click();
      await expect(button).toHaveAttribute('data-td-copy-state', 'success');
      const after = await button.boundingBox();
      expect(after.width).toBe(before.width);
      expect(after.height).toBe(before.height);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('echo landing fallback');
      const scan = await new AxeBuilder({ page }).include('.td-landing-command-box')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(scan.violations).toEqual([]);
      await expect(button).toHaveAttribute('data-td-copy-state', 'success');
    }
  }
});
