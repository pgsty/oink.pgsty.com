import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function offline(page) {
  const external = [];
  await page.route('**/*', route => {
    const url = route.request().url();
    const origin = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173').origin;
    if (/^https?:/.test(url) && new URL(url).origin !== origin) {
      external.push(url);
      return route.abort();
    }
    return route.continue();
  });
  return external;
}

// The player, the chart and the map mount as a reader approaches them, so a
// test walks to the static form of the component it is about to assert on.
const PLAYER = '[data-td-asciinema]';
const CHART = '[data-td-echarts]';
const MAP = '#svg-map';
async function approach(scope, ...selectors) {
  for (const selector of selectors) {
    await scope.locator(selector).first().scrollIntoViewIfNeeded();
  }
}

test('ReDoc ESM readers keep independent routes and make no default external request', async ({ page, context }) => {
  const external = await offline(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tests/dependencies/#api-readers');
  const frames = page.locator('.td-redoc iframe');
  await expect(frames).toHaveCount(2);
  for (const frame of await frames.all()) {
    await frame.scrollIntoViewIfNeeded();
    await expect(frame.contentFrame().getByText('Demo Cluster API (1.0.0)', { exact: true })).toBeVisible();
  }
  const first = frames.nth(0).contentFrame();
  await frames.nth(0).scrollIntoViewIfNeeded();
  const group = first.getByRole('link', { name: 'clusters', exact: true });
  if (!await group.isVisible()) await first.getByRole('button', { name: 'Open navigation menu' }).click();
  await group.click();
  await expect(first.getByText('列出集群', { exact: true }).first()).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#api-readers');
  expect(page.frames().filter(frame => frame.url().includes('redoc-frame')).map(frame => new URL(frame.url()).hash)).toEqual(['#/clusters', '']);
  await expect(frames.nth(1).contentFrame().getByText('Demo Cluster API (1.0.0)', { exact: true })).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  // A reader-initiated external link must work inside the sandbox. Keep the
  // destination offline and confirm the parent article retains its location.
  await context.route('https://www.apache.org/licenses/LICENSE-2.0', route => route.fulfill({
    contentType: 'text/html', body: '<title>License</title><p>License destination</p>',
  }));
  const popupPromise = page.waitForEvent('popup');
  await frames.nth(1).scrollIntoViewIfNeeded();
  await frames.nth(1).contentFrame().getByRole('link', { name: 'Apache-2.0', exact: true }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL('https://www.apache.org/licenses/LICENSE-2.0');
  await expect(popup.getByText('License destination')).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#api-readers');
  await popup.close();
});

test('Markmap math and notes use local chunks; source escaping and print stay intact', async ({ page }) => {
  const external = await offline(page);
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/tests/dependencies/');
  await approach(page, MAP);
  const map = page.locator('div.markmap');
  await map.scrollIntoViewIfNeeded();
  await expect(map.locator('text').filter({ hasText: 'x > y & z "quoted"' })).toHaveCount(1);
  await expect.poll(() => requests.some(url => /mathjax.*\.js/.test(url))).toBe(true);
  await expect(map.locator('svg path[d^="M"]')).not.toHaveCount(0);
  await expect(map.getByRole('link', { name: 'Theme source', exact: true })).toBeVisible();
  await expect(map.getByRole('link', { name: 'Docs', exact: true })).toBeVisible();
  // Exercise animated fold/unfold (without reduced motion) so async stateTween
  // redraws prove they preserve accessible link names and note button semantics.
  await map.locator('g[data-key="node:root"] > rect').click();
  await expect(map.getByRole('link')).toHaveCount(0);
  await map.locator('g[data-key="node:root"] > rect').click();
  await expect(map.getByRole('link', { name: 'Theme source', exact: true })).toBeVisible();
  await expect(map.getByRole('link', { name: 'Docs', exact: true })).toBeVisible();
  const notes = map.getByRole('button', { name: 'Details: Notes', exact: true });
  await expect(notes).toBeVisible();
  const { violations: unfoldViolations } = await new AxeBuilder({ page })
    .include('div.markmap')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(unfoldViolations).toEqual([]);
  await notes.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Details: Notes', exact: true });
  await expect(dialog).toContainText('A paragraph becomes a note.');
  await expect(dialog).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(notes).toBeFocused();
  expect(external).toEqual([]);
  await page.goto('/_print/tests/dependencies/');
  await expect(page.locator('code.language-markmap')).toContainText('x > y & z "quoted"');
  await expect(page.locator('[data-td-markmap-config], .td-redoc iframe')).toHaveCount(0);
});

test('the player, chart and map engines wait until the reader approaches', async ({ page }) => {
  const engines = [];
  page.on('request', request => {
    const match = request.url().match(/third_party\/(asciinema|echarts|markmap)\/(?:asciinema-player|echarts|markmap)[^/]*\.js/);
    if (match) engines.push(match[1]);
  });
  await page.goto('/tests/dependencies/');
  await expect(page.locator('.td-redoc iframe').first()).toBeAttached();
  await expect(page.locator('code.language-markmap')).toBeAttached();
  await expect(page.locator('[data-td-asciinema-player] a')).toHaveText('Recording fallback');
  expect(engines).toEqual([]);

  // Browser printing cannot wait for a script: what has not mounted prints
  // its declared source, as the Print output does, and takes it back after.
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.td-echarts > pre.td-echarts-source')).toContainText('"type": "bar"');
  await expect(page.locator('[data-td-echarts-canvas]')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await expect(page.locator('.td-echarts > pre.td-echarts-source')).toHaveCount(0);
  expect(engines).toEqual([]);

  await approach(page, MAP, PLAYER, CHART);
  await expect(page.locator('div.markmap text').first()).toBeAttached();
  await expect(page.locator('.ap-player')).toBeVisible();
  await expect(page.locator('[data-td-echarts-canvas] canvas')).toBeVisible();
  expect([...engines].sort()).toEqual(['asciinema', 'echarts', 'markmap']);
});

test('a jump past the components mounts what is now above the reader', async ({ page }) => {
  await page.goto('/tests/dependencies/');
  await expect(page.locator('code.language-markmap')).toBeAttached();
  // Mounting above the reader later would move the text being read, so
  // everything above is due at once.
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('div.markmap text').first()).toBeAttached();
  await expect(page.locator('[data-td-echarts-canvas] canvas')).toBeAttached();
  await expect(page.locator('.ap-player')).toBeAttached();
});

test('a chart whose engine cannot load shows its declared options', async ({ page }) => {
  await page.route('**/third_party/echarts/*.js', route => route.abort());
  await page.goto('/tests/dependencies/');
  await approach(page, CHART);
  await expect(page.locator('.td-echarts > pre.td-echarts-source')).toContainText('"type": "bar"');
  await expect(page.locator('[data-td-echarts-canvas]')).toBeHidden();
  await expect(page.locator('[data-td-echarts-canvas] canvas')).toHaveCount(0);
});

test('a synchronous player failure keeps its link and lets charts mount', async ({ page }) => {
  await page.route('**/third_party/asciinema/asciinema-player*.js', route => route.fulfill({
    contentType: 'text/javascript', body: 'window.AsciinemaPlayer = {create() {throw new Error("invalid player option")}};',
  }));
  await page.goto('/tests/dependencies/');
  await approach(page, PLAYER, CHART);
  await expect(page.locator('[data-td-asciinema-player] a')).toHaveText('Recording fallback');
  await expect(page.locator('[data-td-echarts-canvas] canvas')).toBeVisible();
});

test('Mermaid 12 supports an explicit ELK layout with entirely local assets', async ({ page }) => {
  const external = await offline(page);
  await page.goto('/tests/dependencies/');
  const diagram = page.locator('.td-diagram--mermaid');
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute('data-td-diagram-state', 'rendered');
  await expect(diagram.locator('svg')).toContainText('ELK');
  expect(external).toEqual([]);
});

test('Markmap rich notes follow appearance, keep focus, sanitize content and stay out of print', async ({ page }) => {
  const external = await offline(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tests/dependency-notes/');
  const first = page.getByRole('button', { name: 'Details: Rich notes', exact: true });
  await first.focus();
  await page.keyboard.press('Space');
  const dialog = page.getByRole('dialog', { name: 'Details: Rich notes', exact: true });
  await expect(dialog).toBeFocused();
  await expect(dialog.locator('pre code')).toHaveText('const greeting = "hello <world> & friends";');
  await expect(dialog.locator('pre code .hljs-keyword')).toHaveText('const');
  await expect(dialog.getByRole('img', { name: 'x^2', exact: true })).toBeVisible();
  await expect(dialog.getByRole('cell', { name: '中文', exact: true })).toBeVisible();
  await expect(dialog.locator('script, a[href^="javascript:"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.markmapUnsafe)).toBeUndefined();
  for (const [mode, preset] of [['dark', 'slate'], ['light', 'paper']]) {
    await page.evaluate(([mode, preset]) => {
      document.documentElement.dataset.bsTheme = mode;
      document.documentElement.dataset.tdPreset = preset;
    }, [mode, preset]);
    await expect.poll(() => dialog.evaluate(el => getComputedStyle(el).color)).toBe(
      await page.locator('.td-content').evaluate(el => getComputedStyle(el).color));
    await expect.poll(() => dialog.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(
      await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor));
  }
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await page.emulateMedia({ media: 'print' });
  await expect(dialog).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await expect(dialog).toBeFocused();
  await dialog.getByRole('link', { name: 'a local link', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(first).toBeFocused();
  const second = page.getByRole('button', { name: 'Details: Independent notes', exact: true });
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toContainText('Notes in the second map');
  await page.keyboard.press('Escape');
  await expect(second).toBeFocused();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

for (const width of [390, 1440]) {
  for (const [locale, theme] of [['', 'light'], ['/zh', 'dark']]) {
    test(`Markmap open-note accessibility: ${locale || 'en'} ${theme} ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(theme => localStorage.setItem('td-color-theme', theme), theme);
      await page.goto(`${locale}/tests/dependency-notes/`);
      const trigger = page.getByRole('button', { name: /Rich notes$/ });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: /Rich notes$/ });
      await expect(dialog.getByRole('img', { name: 'x^2', exact: true })).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        .include('.markmap-popover').include('div.markmap')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(violations).toEqual([]);
      const bounds = await dialog.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
      await page.emulateMedia({ forcedColors: 'active' });
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    });
  }
}

for (const chunk of ['markmap.js', 'notes-html-*.js', 'mathjax-*.js']) {
  test(`Markmap retains readable content when ${chunk} cannot load`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(`**/third_party/markmap/${chunk}`, route => route.abort());
    await page.goto('/tests/dependency-notes/');
    if (chunk !== 'markmap.js') {
      await page.getByRole('button', { name: 'Details: Rich notes', exact: true }).click();
    }
    if (chunk === 'mathjax-*.js') {
      await expect(page.getByRole('dialog').locator('code.language-math')).toHaveText('x^2');
      await expect(page.getByRole('dialog')).toContainText('hello <world> & friends');
    } else {
      const source = page.locator('pre > code.language-markmap').first();
      await expect(source).toBeVisible();
      await expect(source).toContainText('hello <world> & friends');
      if (chunk === 'notes-html-*.js') {
        await expect(source.locator('..')).toBeFocused();
        // A later appearance change must not call into a destroyed map.
        await page.evaluate(() => document.documentElement.dataset.bsTheme = 'dark');
        await page.getByRole('button', { name: 'Details: Independent notes', exact: true }).click();
        await expect(page.locator('pre > code.language-markmap')).toHaveCount(2);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('the real terminal player plays, pauses and remounts on a theme change', async ({ page }) => {
  const external = await offline(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tests/dependencies/');
  await approach(page, PLAYER);
  const player = page.locator('.ap-player');
  await player.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(player).toContainText('bash-5.3$');
  await expect(player.locator('.ap-timer')).not.toHaveText(/--:--|00:00/);
  await player.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(player.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await page.evaluate(() => document.documentElement.dataset.bsTheme = 'dark');
  await expect(player).toHaveCount(1);
  await expect(player).toHaveClass(/asciinema-player-theme-td-dark/);
  await player.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(player).toContainText('bash-5.3$');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('Swagger expands operations and sends a reader-initiated request', async ({ page }) => {
  const external = await offline(page);
  const requests = [];
  await page.route('https://api.example.org/v1/clusters?*', route => {
    requests.push(route.request().url());
    return route.fulfill({ contentType: 'application/json', body: '[{"name":"acceptance","version":18,"instances":3}]' });
  });
  await page.goto('/tests/dependencies/');
  const swagger = page.locator('.td-swagger-ui');
  await swagger.getByRole('button', { name: 'GET /clusters 列出集群', exact: true }).click();
  await swagger.getByRole('button', { name: 'Try it out', exact: true }).click();
  await swagger.locator('input[type="text"]').fill('2');
  await swagger.getByRole('button', { name: 'Execute', exact: true }).click();
  await expect(swagger.locator('.responses-wrapper')).toContainText('acceptance');
  expect(requests).toEqual(['https://api.example.org/v1/clusters?limit=2']);
  expect(external).toEqual([]);
});

test('ReDoc downloads the spec and copies text without changing the article route', async ({ page }) => {
  await offline(page);
  await page.goto('/tests/dependencies/#api-readers');
  const iframe = page.locator('.td-redoc iframe').first();
  await iframe.scrollIntoViewIfNeeded();
  const frame = iframe.contentFrame();
  await expect(frame.getByText('Demo Cluster API (1.0.0)', { exact: true })).toBeVisible();
  await frame.locator('body').evaluate(() => {
    // ReDoc uses a selection and the native copy event. Observe that event
    // without changing clipboard behavior or requiring OS clipboard access.
    document.addEventListener('copy', () => {
      window.copiedText = document.getSelection().toString();
    }, true);
  });
  await frame.getByRole('button', { name: 'Copy', exact: true }).first().click();
  await expect.poll(() => frame.locator('body').evaluate(() => window.copiedText)).toMatch(/Demo Cluster API/);
  const downloadPromise = page.waitForEvent('download');
  await frame.getByRole('link', { name: 'Download description', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('docs-demo.yaml');
  expect(await download.failure()).toBeNull();
  expect(new URL(page.url()).hash).toBe('#api-readers');
});

for (const failure of ['spec', 'module']) {
  test(`ReDoc keeps a direct specification link after a ${failure} failure`, async ({ page }) => {
    await page.route(failure === 'spec' ? '**/openapi/docs-demo.yaml' : '**/third_party/redoc/*.js', route =>
      failure === 'spec' ? route.fulfill({ status: 404, body: 'Missing specification' }) : route.abort());
    await page.goto('/tests/dependencies/');
    const redoc = page.locator('.td-redoc').first();
    await redoc.scrollIntoViewIfNeeded();
    await expect(redoc.locator(':scope > p > a')).toBeVisible();
    await expect(redoc.locator(':scope > p > a')).toHaveAttribute('href', /\/openapi\/docs-demo\.yaml$/);
    await approach(page, MAP, CHART);
    await expect(page.locator('div.markmap text').first()).toBeAttached();
    await expect(page.locator('[data-td-echarts-canvas] canvas')).toBeAttached();
  });
}

test('without JavaScript the source, recording and specification remain accessible', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/tests/dependencies/');
    await expect(page.locator('code.language-markmap')).toBeVisible();
    await expect(page.locator('[data-td-asciinema-player] a')).toHaveText('Recording fallback');
    await expect(page.locator('.td-redoc > p > a')).toHaveCount(2);
    await expect(page.locator('.td-diagram--mermaid pre')).toBeVisible();
  } finally { await context.close(); }
});

test('a missing player bundle keeps the original recording link', async ({ page }) => {
  await page.route('**/third_party/asciinema/*.js', route => route.abort());
  await page.goto('/tests/dependencies/');
  await approach(page, PLAYER, CHART);
  await expect(page.locator('[data-td-asciinema-player] a')).toHaveText('Recording fallback');
  await expect(page.locator('[data-td-echarts-canvas] canvas')).toBeAttached();
});

for (const failure of ['missing', 'invalid']) {
  test(`a ${failure} recording restores the link and focus without disrupting charts`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/images/install.cast', route => route.fulfill({
      status: failure === 'missing' ? 404 : 200,
      contentType: 'text/plain', body: 'This is not an asciicast',
    }));
    await page.goto('/tests/dependencies/');
    await approach(page, PLAYER, CHART);
    await page.locator('.ap-player').getByRole('button', { name: 'Play', exact: true }).focus();
    await page.keyboard.press('Enter');
    const link = page.locator('[data-td-asciinema-player] a');
    await expect(link).toHaveText('Recording fallback');
    await expect(link).toBeFocused();
    await expect(page.locator('[data-td-echarts-canvas] canvas')).toBeAttached();
    expect(errors).toEqual([]);
  });
}

test('ReDoc frame rejects unauthored cross-origin specs when navigated directly', async ({ page }) => {
  const external = await offline(page);
  await page.goto('/tests/dependencies/#api-readers');
  const frameSrc = await page.locator('.td-redoc iframe').first().getAttribute('src');
  const framePath = new URL(frameSrc, page.url()).pathname;
  await page.goto(`${framePath}?spec=${encodeURIComponent('https://evil.example/phish.yaml')}`);
  await page.waitForTimeout(250);
  expect(external).toEqual([]);
  await expect(page.locator('#api')).toBeEmpty();
  await page.goto(`${framePath}?spec=${encodeURIComponent('/openapi/docs-demo.yaml')}`);
  await expect(page.getByText('Demo Cluster API (1.0.0)', { exact: true })).toBeVisible();
});

test('Markmap SVG links and open notes cooperate cleanly inside Duo View', async ({ page, context }) => {
  await offline(page);
  await context.route('https://github.com/pgsty/oink', route => route.fulfill({
    contentType: 'text/html', body: '<title>OINK Repo</title><p>Repository destination</p>',
  }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tests/dependencies/#svg-map');
  await page.locator('[data-td-compare-open]').click();
  const reader = page.locator('dialog[data-td-compare][open]');
  await expect(reader).toBeVisible();
  const leftPane = reader.locator('[data-td-compare-frame]').first().contentFrame();
  await approach(leftPane, MAP);
  const map = leftPane.locator('div.markmap');
  await map.scrollIntoViewIfNeeded();
  await expect(map.getByRole('link', { name: 'Theme source', exact: true })).toBeVisible();

  const noteBtn = map.getByRole('button', { name: 'Details: Notes', exact: true });
  await noteBtn.focus();
  await page.keyboard.press('Enter');
  const noteDialog = leftPane.getByRole('dialog', { name: 'Details: Notes', exact: true });
  await expect(noteDialog).toContainText('A paragraph becomes a note.');
  // Pressing Duo View's toggle key or Escape while a Markmap note dialog is open
  // must not close Duo View; Escape closes only the note and restores focus.
  await page.keyboard.press('b');
  await expect(reader).toBeVisible();
  // Simulate an SVG node redraw detaching the original note trigger while open.
  await map.locator('[data-action="notes"]').evaluate(rect => {
    rect.replaceWith(rect.cloneNode(true));
  });
  await page.keyboard.press('Escape');
  await expect(noteDialog).toHaveCount(0);
  await expect(reader).toBeVisible();
  await expect(map.getByRole('button', { name: 'Details: Notes', exact: true })).toBeFocused();

  const popupPromise = page.waitForEvent('popup');
  await map.getByRole('link', { name: 'Theme source', exact: true }).click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL('https://github.com/pgsty/oink');
  await expect(popup.getByText('Repository destination')).toBeVisible();
  await popup.close();
  await expect(reader).toBeVisible();
});
