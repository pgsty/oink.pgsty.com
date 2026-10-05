import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const docs = '/docs/customize/config/';
const canvases = { ink: { light: 'rgb(255, 255, 255)', dark: 'rgb(11, 11, 11)' }, terminal: { light: 'rgb(244, 245, 242)', dark: 'rgb(12, 15, 14)' }, paper: { light: 'rgb(247, 246, 243)', dark: 'rgb(22, 21, 19)' }, slate: { light: 'rgb(241, 244, 248)', dark: 'rgb(11, 17, 25)' } };

async function expectModeIcons(page, mode) {
  const slots = page.locator('[data-td-theme-icon]:visible');
  expect(await slots.count()).toBeGreaterThan(0);
  for (const slot of await slots.all()) {
    const shown = mode === 'light' ? 'sun' : 'moon';
    const hidden = mode === 'light' ? 'moon' : 'sun';
    await expect(slot.locator(`.td-shell-icon--${shown}.fa-${shown}`)).toBeVisible();
    await expect(slot.locator(`.td-shell-icon--${hidden}`)).toBeHidden();
  }
}

async function openAppearance(page) {
  const trigger = page.locator('[data-td-appearance-trigger]:visible').first();
  await trigger.click();
  const panel = page.locator('dialog.td-appearance__panel[open]');
  await expect(panel).toBeVisible();
  return { trigger, panel };
}

test.beforeEach(async ({ context }) => {
  await context.route('https://giscus.app/**', route => route.abort());
});

for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
  for (const mode of ['light', 'dark']) {
    for (const locale of ['', '/zh']) {
      for (const width of [390, 1440]) {
        test(`${preset} ${mode} ${locale || 'en'} ${width}: real pages, fonts and accessible menu`, async ({ page }, info) => {
          const fontRequests = [];
          page.on('request', r => { if (r.resourceType() === 'font') fontRequests.push(r.url()); });
          await page.setViewportSize({ width, height: 900 });
          await page.addInitScript(({ preset, mode }) => {
            localStorage.setItem('td-preset', preset);
            localStorage.setItem('td-color-theme', mode);
          }, { preset, mode });
          for (const path of ['/', docs, '/docs/components/callout/', '/docs/components/tabs/']) {
            const response = await page.goto(locale + path);
            expect(response.status()).toBe(200);
            await page.evaluate(() => document.fonts.ready);
            await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
            await expect(page.locator('body')).toHaveCSS('background-color', canvases[preset][mode]);
            await expectModeIcons(page, mode);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
            if (path === '/' || path === docs) await page.screenshot({ path: info.outputPath(path === '/' ? 'home.png' : 'docs.png') });
          }
          const { trigger, panel } = await openAppearance(page);
          expect(await panel.evaluate(el => el.matches(':modal'))).toBe(width < 768);
          await expect(panel.locator(`[data-td-preset-value="${preset}"]`)).toBeChecked();
          await expect(panel.locator(`[data-bs-theme-value="${mode}"]`)).toBeChecked();
          await expect(panel.locator('legend')).toHaveText(locale ? ['风格', '明暗'] : ['Style', 'Light']);
          await expect(panel.locator('.td-appearance__swatch, .td-appearance__experimental')).toHaveCount(0);
          const buttons = panel.locator('.td-appearance__card');
          await expect(buttons).toHaveCount(4);
          const layout = await buttons.evaluateAll(items => items.map(item => {
            const box = item.getBoundingClientRect();
            const icon = item.querySelector('.td-appearance__preset-icon .td-shell-icon');
            return { x: box.x, y: box.y, height: box.height, color: getComputedStyle(icon).color, glyph: getComputedStyle(icon, '::before').content };
          }));
          expect(layout[0].y).toBe(layout[1].y);
          expect(layout[2].y).toBe(layout[3].y);
          expect(layout[0].x).toBe(layout[2].x);
          expect(layout[2].y).toBeGreaterThan(layout[0].y);
          expect(new Set(layout.map(item => item.color)).size).toBe(4);
          expect(new Set(layout.map(item => item.glyph)).size).toBe(4);
          if (width < 768) expect(layout.every(item => item.height >= 44)).toBe(true);
          const scan = await new AxeBuilder({ page }).include('dialog[open]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
          expect(scan.violations).toEqual([]);
          await page.screenshot({ path: info.outputPath('appearance.png') });
          writeFileSync(info.outputPath('variant.json'), JSON.stringify({ preset, mode, locale: locale ? 'zh' : 'en', width }));
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
          await expect(trigger).toBeFocused();
          expect(fontRequests.length).toBeGreaterThan(0);
          expect(fontRequests.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
          expect(fontRequests.some(url => url.includes(['paper', 'terminal'].includes(preset) ? '/inter/' : '/ibm-plex-sans/'))).toBe(false);
        });
      }
    }
  }
}

test('independent state, native keyboard, navigation, default reset and cross-tab sync', async ({ page, context }) => {
  await page.goto(docs);
  await page.emulateMedia({ colorScheme: 'light' });
  await expectModeIcons(page, 'light');
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'paper');
  let { trigger, panel } = await openAppearance(page);
  await expect(panel.locator('[data-td-preset-value="paper"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
  await page.keyboard.press('Tab');
  await expect(panel.locator('[data-bs-theme-value="auto"]')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await expectModeIcons(page, 'dark');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.goto('/zh' + docs);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  const second = await context.newPage();
  await second.goto(docs);
  ({ panel } = await openAppearance(page));
  await panel.locator('[data-td-preset-value="paper"]').check();
  await expect(second.locator('html')).toHaveAttribute('data-td-preset', 'paper');
  expect(await page.evaluate(() => localStorage.getItem('td-preset'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('td-color-theme'))).toBe('dark');
  await panel.locator('[data-bs-theme-value="light"]').check();
  await expect(second.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  await expectModeIcons(page, 'light');
  await expectModeIcons(second, 'light');
  await panel.locator('[data-bs-theme-value="auto"]').check();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await expect(panel.locator('[data-bs-theme-value="auto"]')).toBeChecked();
  await expectModeIcons(page, 'dark');
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#161513');
  await page.emulateMedia({ colorScheme: 'light' });
  await expectModeIcons(page, 'light');
  await page.keyboard.press('Escape');
  await page.locator('[aria-controls="td-appearance-footer"]').click();
  const footerPanel = page.locator('#td-appearance-footer');
  await expect(footerPanel).toBeVisible();
  await footerPanel.locator('[data-bs-theme-value="dark"]').check();
  await expectModeIcons(page, 'dark');
  await second.close();
});

test('blocked storage preserves checked radios and system preference in-page', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) Object.defineProperty(Storage.prototype, method, { value() { throw new Error('blocked'); } });
  });
  await page.goto(docs);
  const { panel } = await openAppearance(page);
  await panel.locator('[data-td-preset-value="slate"]').check();
  await panel.locator('[data-bs-theme-value="dark"]').check();
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await expect(panel.locator('[data-bs-theme-value="dark"]')).toBeChecked();
  await expect(panel.locator('[data-td-appearance-note]')).toBeVisible();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
});

test('invalid stored values recover to defaults before CSS and scripts complete', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('td-preset', 'folio');
    localStorage.setItem('td-color-theme', 'broken');
  });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(docs);
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'paper');
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  expect(await page.evaluate(() => [localStorage.getItem('td-preset'), localStorage.getItem('td-color-theme')])).toEqual([null, null]);
});

test('saved preset and mode are applied ahead of the stylesheet', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('td-preset', 'slate');
    localStorage.setItem('td-color-theme', 'dark');
  });
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/*.css*', async route => { await gate; await route.continue(); });
  const loaded = page.goto(docs);
  try {
    await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#0b1119');
  } finally { release(); }
  await loaded;
});

test('no JavaScript uses Paper and light print stays readable from either mode', async ({ browser, baseURL, page }) => {
  const nojs = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const plain = await nojs.newPage();
  await plain.goto(docs);
  await expect(plain.locator('html')).toHaveAttribute('data-td-preset', 'paper');
  await expect(plain.locator('body')).toHaveCSS('background-color', canvases.paper.light);
  await nojs.close();
  await page.goto(docs);
  await page.evaluate(() => { document.documentElement.setAttribute('data-bs-theme', 'dark'); });
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.td-content')).toHaveCSS('color', 'rgb(33, 32, 28)');
});

test('preset is a command-palette choice using the shared executor', async ({ page }) => {
  await page.goto(docs);
  await page.locator('[data-td-shell-search-open]:visible').first().click();
  const search = page.locator('#td-shell-search');
  await search.locator('.td-shell-search__input').fill('> preset');
  await search.getByRole('option').filter({ hasText: 'Style' }).first().click();
  await search.getByRole('option').filter({ hasText: 'Slate' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
  expect(await page.evaluate(() => localStorage.getItem('td-preset'))).toBe('slate');
});

test('Landing drawer sheet stays above the drawer and Escape restores its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-td-landing-menu-toggle]').click();
  const trigger = page.locator('[data-td-appearance-modal] [data-td-appearance-trigger]');
  await trigger.click();
  const panel = page.locator('#td-appearance-drawer');
  expect(await panel.evaluate(el => el.matches(':modal'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.locator('[data-td-landing-menu]')).toBeVisible();
});

test('switching a long article preserves the reading anchor and closes cleanly on resize', async ({ page }) => {
  await page.goto(docs);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#typography').scrollIntoViewIfNeeded();
  const anchor = await page.evaluate(() => {
    const scope = document.getElementById('td-main-content');
    const blocks = [...scope.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,pre,table,figure,blockquote,dt,dd')];
    const node = blocks.find(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.height > 0; });
    node.setAttribute('data-test-anchor', '');
    return node.getBoundingClientRect().top;
  });
  await page.evaluate(() => window.OinkAppearance.applyPreset('slate', true));
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(async () => Math.abs(await page.locator('[data-test-anchor]').evaluate(el => el.getBoundingClientRect().top) - anchor)).toBeLessThan(28);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const { panel } = await openAppearance(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(panel).toBeHidden();
  const reopened = await openAppearance(page);
  expect(await reopened.panel.evaluate(el => el.matches(':modal'))).toBe(true);
});

test('comment stylesheet output provides offered preset palettes without font imports', async ({ page }) => {
  await page.goto('/docs/admin/comments/');
  const section = page.locator('[data-td-giscus]').first();
  await expect(section).toBeAttached();
  const palettes = await section.evaluate(el => JSON.parse(el.dataset.tdPresetThemes));
  for (const preset of ['paper', 'slate', 'ink', 'terminal']) for (const mode of ['light', 'dark']) {
    const response = await page.request.get(palettes[preset][mode]);
    expect(response.ok()).toBe(true);
    const css = await response.text();
    expect(css).toContain(`color-scheme: ${mode}`);
    if (preset === 'paper') expect(css).toContain(`--color-canvas-default: ${mode === 'light' ? '#f7f6f3' : '#161513'}`);
    expect(css).not.toMatch(/@import|fonts\.google/);
  }
});

for (const preset of ['ink', 'terminal']) for (const mode of ['light', 'dark']) {
  test(`${preset} ${mode}: experimental geometry, reading fonts, search and print on real site`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(({ preset, mode }) => {
      localStorage.setItem('td-preset', preset);
      localStorage.setItem('td-color-theme', mode);
    }, { preset, mode });
    const paths = ['/', docs, '/docs/components/callout/', '/docs/components/tabs/', '/docs/components/code/', '/docs/components/fields/', '/blog/', '/book/04-design/', '/docs/write/openapi/', '/docs/components/mermaid/', '/docs/components/echarts/'];
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      // Match the existing site's boundary: vendor API widgets own their DOM.
      const scan = await new AxeBuilder({ page }).exclude('.td-redoc').exclude('.td-swagger-ui').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(scan.violations, `${preset} ${mode} ${path}`).toEqual([]);
      if (path === docs) {
        const article = page.locator('.td-content').first();
        await expect(article).toHaveCSS('font-family', preset === 'ink' ? /Inter/ : /IBM Plex Sans/);
        await expect(page.locator('h1').first()).toHaveCSS('font-family', preset === 'ink' ? /Inter/ : /IBM Plex Mono/);
        await expect(page.locator('.td-nav-search-box:visible')).toHaveCSS('border-radius', preset === 'ink' ? '0px' : '2px');
        if (preset === 'ink') await expect(article.locator('p a').first()).toHaveCSS('text-decoration-line', 'underline');
        else await expect(article.locator('table').first()).toHaveCSS('font-family', /IBM Plex Sans/);
      }
    }
    await page.goto(docs);
    await page.locator('[data-td-shell-search-open]:visible').first().click();
    const search = page.locator('#td-shell-search');
    await search.locator('.td-shell-search__input').fill('configuration');
    await expect(search.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('ArrowDown');
    const scan = await new AxeBuilder({ page }).include('#td-shell-search').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations).toEqual([]);
    await page.screenshot({ path: info.outputPath('search.png') });
    await page.keyboard.press('Escape');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('.td-content')).toHaveCSS('color', preset === 'ink' ? 'rgb(20, 20, 20)' : 'rgb(29, 33, 31)');
  });
}


test('Mermaid keeps one mode palette across all presets with readable dark labels', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('td-color-theme', 'dark'));
  await page.goto('/docs/components/mermaid/');
  await expect(page.locator('[data-td-diagram-stage] svg').first()).toBeVisible();
  for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
    await page.evaluate(preset => window.OinkAppearance.applyPreset(preset, true), preset);
    expect(await page.evaluate(() => window.mermaid.mermaidAPI.getConfig().themeVariables.edgeLabelBackground)).toBe('#404040');
    const result = await new AxeBuilder({ page }).include('[data-td-diagram]').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations).toEqual([]);
  }
});
