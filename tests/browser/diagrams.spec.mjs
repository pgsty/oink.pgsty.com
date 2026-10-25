import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const path = '/tests/diagrams/';
const dialog = '[data-td-diagram-zoom-dialog]';
const kinds = ['mermaid', 'plantuml'];
const figure = (page, kind, index = 0) => page.locator(`.td-diagram--${kind}`).nth(index);
const assets = url => /\/third_party\/(mermaid|plantuml)\/.*\.js/.test(url);
async function ready(block) {
  await block.scrollIntoViewIfNeeded();
  await expect(block).toHaveAttribute('data-td-diagram-state', 'rendered');
}
async function enlarge(page, block) {
  await ready(block);
  await block.locator('[data-td-diagram-expand]').click();
  await expect(page.locator(`${dialog} img`)).toBeVisible();
}

test('both engines wait for the viewport, share downloads, and retain errors without stopping later diagrams', async ({ page }) => {
  const requests = [];
  page.on('request', req => { if (assets(req.url())) requests.push(req.url()); });
  await page.goto(path);
  await expect(page.locator('.td-diagram')).toHaveCount(14);
  await expect(page.locator('.td-diagram[data-td-diagram-state="pending"]')).toHaveCount(0);
  expect(requests).toEqual([]);
  await ready(figure(page, 'mermaid'));
  expect(requests.filter(url => url.includes('/mermaid/'))).toHaveLength(1);
  expect(requests.filter(url => url.includes('/plantuml/'))).toHaveLength(0);
  await ready(figure(page, 'plantuml'));
  await ready(figure(page, 'mermaid', 1));
  await ready(figure(page, 'plantuml', 1));
  for (const kind of kinds) {
    const broken = figure(page, kind, 5);
    await broken.scrollIntoViewIfNeeded();
    await expect(broken).toHaveAttribute('data-td-diagram-state', 'error');
    await expect(broken.locator('pre')).toBeVisible();
    await expect(broken.getByRole('alert')).toBeVisible();
    await ready(figure(page, kind, 6));
  }
  expect(requests.filter(url => url.includes('/mermaid/'))).toHaveLength(1);
  expect(requests.filter(url => url.includes('/plantuml/'))).toHaveLength(2);
});

for (const fallback of [false, true]) {
  test(`hidden tabs, disclosures and zero width recover (${fallback ? 'observer fallback' : 'observers'})`, async ({ page }) => {
    if (fallback) await page.addInitScript(() => { window.IntersectionObserver = undefined; window.ResizeObserver = undefined; });
    await page.goto(path);
    const tab = page.getByRole('tab', { name: 'Hidden diagrams', exact: true });
    await tab.scrollIntoViewIfNeeded();
    for (const kind of kinds) await expect(figure(page, kind, 2)).toHaveAttribute('data-td-diagram-state', 'idle');
    await tab.click();
    for (const kind of kinds) await ready(figure(page, kind, 2));
    await page.locator('[data-diagram-fold] > summary').click();
    for (const kind of kinds) await ready(figure(page, kind, 3));
    const zero = page.locator('#diagram-zero');
    await zero.scrollIntoViewIfNeeded();
    for (const kind of kinds) await expect(figure(page, kind, 4)).toHaveAttribute('data-td-diagram-state', 'idle');
    await zero.evaluate(el => { el.style.width = '100%'; });
    for (const kind of kinds) await ready(figure(page, kind, 4));
  });
}

for (const kind of kinds) {
  test(`${kind}: exact source, clipboard feedback, standalone SVG, keyboard and focus`, async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(path);
    const block = figure(page, kind);
    const expected = kind === 'plantuml' ? '@startuml\nAlice -> Bob: 中文 <tag> & "quotes"\n@enduml' : 'sequenceDiagram\nAlice->>Bob: 中文 <tag> & "quotes"';
    await enlarge(page, block);
    await expect(page.locator('[data-td-diagram-zoom-close]')).toBeFocused();
    await page.keyboard.press('+');
    const transform = await page.locator('[data-td-diagram-zoom-canvas]').getAttribute('style');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-td-diagram-zoom-canvas]')).not.toHaveAttribute('style', transform);
    await page.keyboard.press('0');
    await page.locator('[data-td-diagram-source-toggle]').click();
    await expect(page.locator('[data-td-diagram-zoom-source] code')).toHaveText(expected);
    await page.locator('[data-td-diagram-copy]').click();
    await expect(page.locator('[data-td-diagram-status]')).toHaveText('Copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-td-diagram-download]').click();
    const download = await downloadPromise;
    const svg = await readFile(await download.path(), 'utf8');
    expect(svg).toContain('中文');
    expect(svg).not.toMatch(/<script|@import|(?:href|src)="https?:|url\(\s*['"]?https?:/i);
    await expect(page.locator('[data-td-diagram-status]')).toHaveText('SVG download requested');
    const isolated = await context.newPage();
    const remote = [];
    await isolated.route('**/*', route => { remote.push(route.request().url()); return route.abort(); });
    await isolated.setContent('<img alt="Export">');
    expect(await isolated.locator('img').evaluate(async (img, svg) => {
      img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      await img.decode(); return img.naturalWidth;
    }, svg)).toBeGreaterThan(50);
    expect(remote).toEqual([]);
    await isolated.close();
    await page.evaluate(async () => {
      const clipboard = navigator.clipboard;
      await clipboard.writeText('unchanged clipboard sentinel');
      window.readDiagramClipboard = () => clipboard.readText();
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('blocked')) } });
    });
    await page.locator('[data-td-diagram-copy]').click();
    await expect(page.locator('[data-td-diagram-status]')).toHaveText('Copied');
    expect(await page.evaluate(() => readDiagramClipboard())).toBe(expected);
    await expect(page.locator('[data-td-diagram-copy]')).toBeFocused();
    await page.evaluate(() => { document.execCommand = () => false; });
    await page.locator('[data-td-diagram-copy]').click();
    await expect(page.locator('[data-td-diagram-status]')).toHaveText('Copy failed');
    await page.evaluate(() => { HTMLAnchorElement.prototype.click = () => { throw new Error('blocked'); }; });
    await page.locator('[data-td-diagram-download]').click();
    await expect(page.locator('[data-td-diagram-status]')).toHaveText('Could not download SVG');
    await page.keyboard.press('Escape');
    await expect(block.locator('[data-td-diagram-expand]')).toBeFocused();
    if (kind === 'plantuml') await expect(block.locator('svg')).toHaveCount(0);
  });
}

test('rapid themes preserve the open view, discard stale work and revoke Blob URLs', async ({ page }) => {
  await page.goto(path);
  for (const kind of kinds) {
    const block = figure(page, kind);
    await page.evaluate(() => { document.documentElement.dataset.bsTheme = 'light'; });
    await ready(block);
    await expect(block).toHaveAttribute('data-td-diagram-theme', 'light');
    await enlarge(page, block);
    await page.keyboard.press('+');
    await page.keyboard.press('ArrowRight');
    const transform = await page.locator('[data-td-diagram-zoom-canvas]').getAttribute('style');
    const before = await page.locator(`${dialog} img`).getAttribute('src');
    await page.evaluate(async () => {
      for (const mode of ['light', 'dark', 'light', 'dark']) {
        document.documentElement.dataset.bsTheme = mode;
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });
    await expect(block).toHaveAttribute('data-td-diagram-theme', 'dark');
    await expect(page.locator(`${dialog} img`)).not.toHaveAttribute('src', before);
    await expect(page.locator('[data-td-diagram-zoom-canvas]')).toHaveAttribute('style', transform);
    expect(await page.evaluate(async url => { try { await fetch(url); return true; } catch { return false; } }, before)).toBe(false);
    await page.keyboard.press('Escape');
  }
});

test('blocked engines, no JavaScript, and early browser printing keep readable source', async ({ page, browser }) => {
  await page.route('**/third_party/{mermaid,plantuml}/**', route => route.abort());
  await page.goto(path);
  await page.emulateMedia({ media: 'print' });
  for (const kind of kinds) await expect(figure(page, kind).locator('pre')).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  for (const kind of kinds) {
    const block = figure(page, kind);
    await block.scrollIntoViewIfNeeded();
    await expect(block).toHaveAttribute('data-td-diagram-state', 'error');
    await block.locator('[data-td-diagram-expand]').click();
    await expect(page.locator('[data-td-diagram-zoom-source]')).toBeVisible();
    await expect(page.locator('[data-td-diagram-download]')).toBeDisabled();
    await page.keyboard.press('Escape');
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  await staticPage.goto(new URL(path, page.url()).href);
  for (const kind of kinds) await expect(staticPage.locator(`pre > code.language-${kind}`).first()).toBeVisible();
  await noJS.close();
});

for (const locale of ['', '/zh']) {
  for (const colorScheme of ['light', 'dark']) {
    test(`real docs, wide reader, touch and axe: ${locale || 'en'} ${colorScheme}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const base = test.info().project.use.baseURL || process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
      const remote = [];
      await page.route('**/*', route => {
        if (/^https?:/.test(route.request().url()) && new URL(route.request().url()).origin !== new URL(base).origin) {
          // The documentation site separately opts into Giscus comments.
          if (!route.request().url().startsWith('https://giscus.app/')) remote.push(route.request().url());
          return route.abort();
        }
        return route.continue();
      });
      for (const kind of kinds) {
        await page.goto(`${base}${locale}/docs/components/${kind}/`);
        await enlarge(page, figure(page, kind));
        expect((await new AxeBuilder({ page }).include(dialog).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
        const controls = page.locator('.td-diagram-zoom__control');
        for (const control of await controls.all()) expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(44);
        await page.keyboard.press('Escape');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      await page.goto(base + path);
      for (const kind of kinds) {
        await enlarge(page, figure(page, kind, 1));
        const viewport = page.locator('[data-td-diagram-zoom-viewport]');
        const canvas = page.locator('[data-td-diagram-zoom-canvas]');
        const initial = await canvas.getAttribute('style');
        const initialScale = await canvas.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
        const session = await context.newCDPSession(page);
        const rect = await viewport.boundingBox();
        const a = { x: rect.x + 80, y: rect.y + 180, id: 1 };
        const b = { x: rect.x + 220, y: rect.y + 180, id: 2 };
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [a, b] });
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...a, x: a.x - 30 }, { ...b, x: b.x + 35 }] });
        await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await expect(canvas).not.toHaveAttribute('style', initial);
        expect(await canvas.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBeGreaterThan(initialScale);
        const pinched = await canvas.getAttribute('style');
        await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [a] });
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...a, x: a.x + 30, y: a.y + 20 }] });
        await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await expect(canvas).not.toHaveAttribute('style', pinched);
        await page.locator('[data-td-diagram-zoom-reset]').click();
        const image = await page.locator(`${dialog} img`).boundingBox();
        expect(image.width).toBeLessThanOrEqual(rect.width);
        await page.keyboard.press('Escape');
        await session.detach();
      }
      expect(remote).toEqual([]);
      await context.close();
    });
  }
}

test('shared queue serializes mixed renderers and discards an in-flight result after a theme change', async ({ page }) => {
  await page.goto(path);
  await page.evaluate(() => {
    document.documentElement.dataset.bsTheme = 'light';
    window.diagramRace = { active: 0, max: 0, calls: [], release: [], disposed: [] };
    for (const kind of ['mermaid', 'plantuml']) {
      const block = document.createElement('figure');
      block.id = 'race-' + kind;
      const pre = document.createElement('pre'); pre.textContent = kind;
      const stage = document.createElement('div');
      block.append(stage, pre);
      document.querySelector('main').prepend(block);
      OinkDiagrams.register({ kind, block, pre, stage, source: kind, render: (source, dark) => {
        const race = window.diagramRace;
        race.max = Math.max(race.max, ++race.active);
        race.calls.push([source, dark]);
        return new Promise(resolve => race.release.push(() => {
          --race.active;
          const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          node.textContent = `${source}:${dark}`;
          resolve({ node, svg: '<svg/>', width: 100, height: 50, dispose: () => race.disposed.push([source, dark]) });
        }));
      } });
    }
  });
  await expect.poll(() => page.evaluate(() => diagramRace.calls.length)).toBe(1);
  await page.locator('#race-mermaid pre').focus();
  await page.evaluate(() => { document.documentElement.dataset.bsTheme = 'dark'; });
  await expect(page.locator('#race-mermaid')).toHaveAttribute('data-td-diagram-state', 'pending');
  await page.evaluate(() => diagramRace.release.shift()());
  await expect.poll(() => page.evaluate(() => diagramRace.calls.length)).toBe(2);
  await expect(page.locator('#race-mermaid svg, #race-plantuml svg')).toHaveCount(0);
  await page.evaluate(() => diagramRace.release.shift()());
  await expect.poll(() => page.evaluate(() => diagramRace.calls.length)).toBe(3);
  await page.evaluate(() => diagramRace.release.shift()());
  for (const kind of kinds) await expect(page.locator('#race-' + kind)).toHaveAttribute('data-td-diagram-theme', 'dark');
  await expect(page.locator('#race-mermaid .td-diagram__source')).toHaveAttribute('open', '');
  await expect(page.locator('#race-mermaid pre')).toBeFocused();
  expect(await page.evaluate(() => ({ max: diagramRace.max, disposed: diagramRace.disposed }))).toEqual({ max: 1, disposed: [['mermaid', false]] });
});

test('browser print keeps a picture or source for every diagram, including hidden content', async ({ page }) => {
  await page.goto(path);
  await ready(figure(page, 'mermaid'));
  await page.evaluate(() => dispatchEvent(new Event('beforeprint')));
  await page.emulateMedia({ media: 'print' });
  for (const block of await page.locator('.td-diagram').all()) {
    if (await block.getAttribute('data-td-diagram-rendered') === 'true') {
      await expect(block.locator('.td-diagram__stage')).toBeVisible();
      await expect(block.locator('pre')).toBeHidden();
    } else {
      // A deliberately zero-width author container stays zero-width in print.
      // Its readable source remains present; ordinary tabs/disclosures expand.
      if (!(await block.evaluate(el => !!el.closest('#diagram-zero')))) await expect(block.locator('pre')).toBeVisible();
      expect(await block.locator('pre').textContent()).not.toBe('');
    }
  }
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  await expect(figure(page, 'mermaid').locator('pre')).toBeHidden();
});

test('a stalled engine load times out and the other engine can still render', async ({ page }) => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/third_party/mermaid/**', async route => { await gate; await route.abort(); });
  try {
    await page.goto(path);
    const mermaid = figure(page, 'mermaid');
    await mermaid.scrollIntoViewIfNeeded();
    await expect(mermaid).toHaveAttribute('data-td-diagram-state', 'pending');
    await figure(page, 'plantuml').scrollIntoViewIfNeeded();
    await expect(mermaid).toHaveAttribute('data-td-diagram-state', 'error', { timeout: 20_000 });
    await ready(figure(page, 'plantuml'));
    await expect(mermaid.locator('pre')).toBeVisible();
  } finally { release(); }
});
