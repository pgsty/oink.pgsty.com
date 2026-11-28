import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const docs = '/docs/customize/config/';

test('coordinated closure leaves focus alone when Appearance is closed', async ({ page }) => {
  await page.goto(docs);
  const main = page.locator('#td-main-content');
  await main.focus();
  await page.evaluate(() => window.OinkSurfaceCoordinator.closeAll(true));
  await expect(main).toBeFocused();
});

const presets = ['paper', 'slate', 'github', 'ink', 'news', 'terminal'];
const canvases = { ink: { light: 'rgb(243, 234, 215)', dark: 'rgb(27, 23, 48)' }, terminal: { light: 'rgb(244, 245, 242)', dark: 'rgb(5, 8, 6)' }, paper: { light: 'rgb(247, 246, 243)', dark: 'rgb(22, 21, 19)' }, slate: { light: 'rgb(241, 244, 248)', dark: 'rgb(11, 17, 25)' }, news: { light: 'rgb(240, 238, 232)', dark: 'rgb(15, 15, 15)' }, github: { light: 'rgb(255, 255, 255)', dark: 'rgb(13, 17, 23)' } };

// The site offers Color, so every Appearance trigger shows the reader's
// choice there -- sun, moon, or the half-filled circle for System -- whatever
// mode System resolves to; the mode itself lives on the root element.
async function expectModeIcons(page, mode, choice = mode) {
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', mode);
  await expect(page.locator('html')).toHaveAttribute('data-td-color-mode', choice);
  const glyph = { light: 'sun', dark: 'moon', auto: 'contrast' }[choice];
  const triggers = page.locator('[data-td-appearance-trigger]:visible');
  expect(await triggers.count()).toBeGreaterThan(0);
  for (const trigger of await triggers.all()) {
    await expect(trigger.locator('.td-shell-icon--palette')).toHaveCount(0);
    for (const icon of ['sun', 'moon', 'contrast']) {
      const locator = trigger.locator(`[data-td-theme-icon] > .td-shell-icon--${icon}`);
      if (icon === glyph) await expect(locator).toBeVisible();
      else await expect(locator).toBeHidden();
    }
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

for (const preset of presets) {
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
            if (preset === 'paper' && path !== '/') {
              const headings = page.locator('.td-content > h2');
              expect(await headings.count()).toBeGreaterThan(0);
              for (const heading of await headings.all()) {
                expect(await heading.evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
              }
            }
            if (path === '/' || path === docs) await page.screenshot({ path: info.outputPath(path === '/' ? 'home.png' : 'docs.png') });
          }
          const { trigger, panel } = await openAppearance(page);
          expect(await panel.evaluate(el => el.matches(':modal'))).toBe(width < 768);
          await expect(panel.locator(`[data-td-preset-value="${preset}"]`)).toBeChecked();
          await expect(panel.locator(`[data-bs-theme-value="${mode}"]`)).toBeChecked();
          // Each legend names the key that steps its group.
          await expect(panel.locator('legend')).toHaveText(locale ? ['风格 (T)', '明暗 (Y)'] : ['Style (T)', 'Color (Y)']);
          await expect(panel.locator('fieldset').nth(0)).toHaveAttribute('aria-keyshortcuts', 'T');
          await expect(panel.locator('fieldset').nth(1)).toHaveAttribute('aria-keyshortcuts', 'Y');
          await expect(panel.locator('.td-appearance__swatch, .td-appearance__experimental')).toHaveCount(0);
          const buttons = panel.locator('.td-appearance__card');
          await expect(buttons).toHaveCount(6);
          const layout = await buttons.evaluateAll(items => items.map(item => {
            const box = item.getBoundingClientRect();
            const icon = item.querySelector('.td-appearance__preset-icon .td-shell-icon');
            const name = item.querySelector('.td-appearance__name');
            return { x: box.x, y: box.y, width: box.width, height: box.height, color: getComputedStyle(icon).color, glyph: getComputedStyle(icon, '::before').content, clipped: name.scrollWidth > name.clientWidth };
          }));
          // Six styles in two rows of three, in the columns of the three modes.
          expect(layout[0].y).toBe(layout[1].y);
          expect(layout[1].y).toBe(layout[2].y);
          expect(layout[3].y).toBe(layout[4].y);
          expect(layout[4].y).toBe(layout[5].y);
          expect(layout[3].y).toBeGreaterThan(layout[0].y);
          const modes = await panel.locator('.td-appearance__segment').evaluateAll(items => items.map(item => {
            const box = item.getBoundingClientRect();
            return { x: box.x, width: box.width };
          }));
          expect(modes).toHaveLength(3);
          for (const column of [0, 1, 2]) {
            expect(layout[column].x).toBe(layout[column + 3].x);
            expect(Math.abs(modes[column].x - layout[column].x)).toBeLessThan(1);
            expect(Math.abs(modes[column].width - layout[column].width)).toBeLessThan(1);
          }
          expect(layout.some(item => item.clipped)).toBe(false);
          expect(new Set(layout.map(item => item.color)).size).toBe(6);
          expect(new Set(layout.map(item => item.glyph)).size).toBe(6);
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
          // GitHub sets every role in system stacks and loads neither face.
          const unused = { paper: ['/inter/'], terminal: ['/inter/'], news: ['/inter/', '/ibm-plex-sans/'], slate: ['/ibm-plex-sans/'], ink: ['/ibm-plex-sans/', '/inter/'], github: ['/inter/', '/ibm-plex-sans/'] }[preset];
          expect(fontRequests.some(url => unused.some(face => url.includes(face)))).toBe(false);
        });
      }
    }
  }
}

test('News keeps navigation, style tiles and article surfaces square and flat', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('td-preset', 'news'));
  for (const mode of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: mode });
    for (const [path, selectors] of [
      ['/', ['.td-site-header .nav-link', '.td-landing-component-board [aria-pressed="true"]', '.td-landing-logo-card', '.td-case-mini__tag', '.td-landing-faq']],
      [docs, ['.td-shell-tree__chevron', '.td-page-actions__item', '.td-content > h2']],
      ['/blog/immersive-reading/', ['.td-byline__avatar', '.td-share__item']],
      ['/docs/components/social/', ['.td-social', '.td-social__avatar']],
    ]) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', mode);
      for (const selector of selectors) {
        const surface = page.locator(selector).first();
        await expect(surface, selector).toHaveCSS('border-radius', '0px');
        await expect(surface, selector).toHaveCSS('box-shadow', 'none');
      }
    }
  }
});

test('independent state, native keyboard, navigation, default reset and cross-tab sync', async ({ page, context }) => {
  await page.goto(docs);
  await page.emulateMedia({ colorScheme: 'light' });
  await expectModeIcons(page, 'light', 'auto');
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
  await expectModeIcons(page, 'dark', 'auto');
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#161513');
  await page.emulateMedia({ colorScheme: 'light' });
  await expectModeIcons(page, 'light', 'auto');
  await page.keyboard.press('Escape');
  await page.locator('[aria-controls="td-appearance-footer"]').click();
  const footerPanel = page.locator('#td-appearance-footer');
  await expect(footerPanel).toBeVisible();
  await footerPanel.locator('[data-bs-theme-value="dark"]').check();
  await expectModeIcons(page, 'dark');
  await second.close();
});

test('Appearance stays expanded after an immediate close and reopen', async ({ page }) => {
  await page.goto(docs);
  const { trigger, panel } = await openAppearance(page);
  await trigger.evaluate(button => {
    button.click();
    button.click();
  });
  // Native dialog close events are queued; wait until that queue has drained.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(trigger.locator('..')).toHaveClass(/td-is-open/);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
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
  const giscusCanvas = { paper: ['#f7f6f3', '#161513'], github: ['#ffffff', '#0d1117'], ink: ['#f3ead7', '#1b1730'], news: ['#f0eee8', '#0f0f0f'], terminal: ['#f4f5f2', '#050806'] };
  for (const preset of presets) for (const mode of ['light', 'dark']) {
    const response = await page.request.get(palettes[preset][mode]);
    expect(response.ok()).toBe(true);
    const css = await response.text();
    expect(css).toContain(`color-scheme: ${mode}`);
    if (giscusCanvas[preset]) expect(css).toContain(`--color-canvas-default: ${giscusCanvas[preset][mode === 'light' ? 0 : 1]}`);
    expect(css).not.toMatch(/@import|fonts\.google/);
  }
});

for (const preset of ['github', 'ink', 'news', 'terminal']) for (const mode of ['light', 'dark']) {
  test(`${preset} ${mode}: experimental geometry, reading fonts, search and print on real site`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(({ preset, mode }) => {
      localStorage.setItem('td-preset', preset);
      localStorage.setItem('td-color-theme', mode);
    }, { preset, mode });
    const paths = ['/', docs, '/docs/components/callout/', '/docs/components/tabs/', '/docs/components/code/', '/docs/components/fields/', '/blog/', '/book/08-design/', '/docs/write/openapi/', '/docs/components/mermaid/', '/docs/components/echarts/'];
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
        // Ink sets prose in Palatino beside Fangsong, then Song, and headings
        // and chrome in Palatino beside Kai; News sets prose and chrome in a
        // system serif with Song and headlines in Times New Roman; Terminal
        // sets prose in mono with the platform Hei for Han; GitHub uses
        // GitHub's own system stack.
        const prose = { ink: /^Palatino,.*"OINK Fangsong", "Songti SC"/, news: /^Charter,.*"Songti SC"/, terminal: /^"IBM Plex Mono",.*"PingFang SC"/, github: /^-apple-system,.*"PingFang SC"/ }[preset];
        const heading = { ink: /^"OINK Kai", "OINK Kai Synth", Palatino,/, news: /^"Times New Roman",.*"Songti SC"/, terminal: /IBM Plex Mono/, github: /^-apple-system/ }[preset];
        await expect(article).toHaveCSS('font-family', prose);
        await expect(page.locator('h1').first()).toHaveCSS('font-family', heading);
        if (preset === 'ink' || preset === 'terminal') await expect(page.locator('.td-nav-search-box:visible')).toHaveCSS('border-radius', preset === 'ink' ? '0px' : '2px');
        // Ink writes every heading at text weight, sections in italic under a
        // brush stroke, on a shaded paper; News sets a heavy headline and
        // opens a section under a thick-and-thin rule, and its darkroom glows
        // in one corner; dark Terminal's headings glow.
        if (preset === 'ink') {
          await expect(page.locator('h1').first()).toHaveCSS('font-weight', '400');
          await expect(article.locator(':scope > h2').first()).toHaveCSS('font-weight', '400');
          await expect(article.locator(':scope > h2').first()).toHaveCSS('font-style', 'italic');
          await expect(article.locator(':scope > h2').first()).toHaveCSS('background-image', /linear-gradient/);
          await expect(page.locator('body')).toHaveCSS('background-image', /radial-gradient/);
          await expect(page.locator('.td-shell-tree__link').first()).toHaveCSS('font-family', /^Palatino,.*"OINK Kai"/);
        }
        if (preset === 'news') {
          await expect(page.locator('h1').first()).toHaveCSS('font-weight', '800');
          await expect(article.locator(':scope > h2').first()).toHaveCSS('border-top-style', 'solid');
          await expect(article.locator(':scope > h2').first()).toHaveCSS('border-top-width', '3px');
          await expect(page.locator('body')).toHaveCSS('background-image', mode === 'dark' ? /radial-gradient/ : 'none');
          await expect(page.locator('.td-shell-tree__link').first()).toHaveCSS('font-family', /^Charter,.*"Songti SC"/);
        }
        if (preset === 'terminal') await expect(article.locator(':scope > h2').first()).toHaveCSS('text-shadow', mode === 'dark' ? /rgba\(61, 255, 122/ : 'none');
        // Dark Terminal keeps green for headings and links; text stays grey.
        if (preset === 'terminal' && mode === 'dark') {
          await expect(article).toHaveCSS('color', 'rgb(201, 210, 204)');
          await expect(article.locator(':scope > h2').first()).toHaveCSS('color', 'rgb(61, 255, 122)');
        }
        if (preset === 'terminal') await expect(article.locator('table').first()).toHaveCSS('font-family', /^"IBM Plex Mono"/);
        else await expect(article.locator('p a').first()).toHaveCSS('text-decoration-line', 'underline');
      }
    }
    await page.goto(docs);
    await page.locator('[data-td-shell-search-open]:visible').first().click();
    const search = page.locator('#td-shell-search');
    await search.locator('.td-shell-search__input').fill('configuration');
    await expect(search.getByRole('listbox').getByRole('option').first()).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(search.locator('.td-shell-search__panel')).toHaveCSS('opacity', '1');
    const scan = await new AxeBuilder({ page }).include('#td-shell-search').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations).toEqual([]);
    await page.screenshot({ path: info.outputPath('search.png') });
    await page.keyboard.press('Escape');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('.td-content')).toHaveCSS('color', { ink: 'rgb(36, 26, 16)', terminal: 'rgb(29, 33, 31)', news: 'rgb(22, 22, 22)', github: 'rgb(31, 35, 40)' }[preset]);
    // Paper output keeps a reading face: Terminal prints in Plex Sans.
    if (preset === 'terminal') await expect(page.locator('.td-content')).toHaveCSS('font-family', /^"IBM Plex Sans"/);
  });
}


test('Mermaid keeps one mode palette across all presets with readable dark labels', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('td-color-theme', 'dark'));
  await page.goto('/docs/components/mermaid/');
  await expect(page.locator('[data-td-diagram-stage] svg').first()).toBeVisible();
  for (const preset of presets) {
    await page.evaluate(preset => window.OinkAppearance.applyPreset(preset, true), preset);
    expect(await page.evaluate(() => window.mermaid.mermaidAPI.getConfig().themeVariables.edgeLabelBackground)).toBe('#404040');
    const result = await new AxeBuilder({ page }).include('[data-td-diagram]').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations).toEqual([]);
  }
});

for (const prefix of ['', '/zh']) {
  test(`${prefix || 'en'} home style board switches presets in place and stays synced with Appearance`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${prefix}/`);
    await page.evaluate(() => document.fonts.ready);
    const board = page.locator('.td-landing-component-board[role="group"]').first();
    await board.scrollIntoViewIfNeeded();
    const tiles = board.locator('button[data-td-preset-select]');
    await expect(tiles).toHaveCount(presets.length);
    await expect(board.locator('[data-td-preset-select="paper"]')).toHaveAttribute('aria-pressed', 'true');
    for (const preset of ['terminal', 'ink', 'news', 'github', 'slate', 'paper']) {
      const tile = board.locator(`[data-td-preset-select="${preset}"]`);
      const beforeTop = await tile.evaluate(el => el.getBoundingClientRect().top);
      await tile.click();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
      await expect(tile).toHaveAttribute('aria-pressed', 'true');
      await expect(board.locator('[data-td-preset-select][aria-pressed="true"]')).toHaveCount(1);
      await expect.poll(async () => Math.abs(await tile.evaluate(el => el.getBoundingClientRect().top) - beforeTop)).toBeLessThan(28);
    }
    await board.locator('[data-td-preset-select="terminal"]').click();
    const { panel } = await openAppearance(page);
    await expect(panel.locator('[data-td-preset-value="terminal"]')).toBeChecked();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'terminal');
    await expect(page.locator('[data-td-preset-select="terminal"]')).toHaveAttribute('aria-pressed', 'true');
  });
}

for (const prefix of ['', '/zh']) {
  test(`${prefix || 'en'} nonmodal Appearance permits search while modal dialogs retain keys`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${prefix}/docs/customize/config/`);
    const search = page.locator('#td-shell-search');
    for (const key of ['/', 'Control+k', 'Meta+k', 'f']) {
      const { trigger, panel } = await openAppearance(page);
      expect(await panel.evaluate(node => node.matches(':modal'))).toBe(false);
      await trigger.focus();
      await page.keyboard.press(key);
      await expect(search).toBeVisible();
      await expect(panel).toBeHidden();
      await page.keyboard.press('Escape');
      await expect(search).toBeHidden();
    }
    // A second native dialog must not be overlooked after the Appearance panel.
    const { trigger } = await openAppearance(page);
    await page.evaluate(() => {
      const dialog = document.createElement('dialog');
      dialog.id = 'test-second-dialog';
      dialog.innerHTML = '<button>Dialog action</button>';
      document.body.appendChild(dialog);
      dialog.showModal();
    });
    await page.keyboard.press('Control+k');
    await expect(search).toBeHidden();
    await page.keyboard.press('Escape');
    await trigger.press('Escape');
    await page.setViewportSize({ width: 390, height: 844 });
    const { panel } = await openAppearance(page);
    expect(await panel.evaluate(node => node.matches(':modal'))).toBe(true);
    await panel.locator('[data-td-appearance-close]').focus();
    for (const key of ['/', 'Control+k', 'Meta+k', 'f']) {
      await page.keyboard.press(key);
      await expect(search).toBeHidden();
      await expect(panel).toBeVisible();
    }
  });
}
