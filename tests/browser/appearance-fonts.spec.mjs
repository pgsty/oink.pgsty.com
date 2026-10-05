import { expect, test } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';

// Build the actual documentation site with configuration overlays. Serve those
// exact bytes to the isolated browser context; no injected style or prototype.
for (const [typography, override] of [['system', false], ['system', true], ['technical', true]]) {
  test(`${typography} typography, explicit fonts=${override}: all presets honor font policy`, async ({ browser }) => {
    test.setTimeout(120_000);
    const temp = mkdtempSync(join(tmpdir(), 'oink-font-browser-'));
    const config = join(temp, 'fonts.yml');
    writeFileSync(config, `params:\n  ui:\n    typography: ${typography}\n    preset: terminal\n` + (override ? '    fonts:\n      ui: serif\n      brand: serif\n      code: monospace\n' : ''));
    const build = spawnSync('hugo', ['--config', `hugo.yml,${config}`, '--destination', join(temp, 'public'), '--baseURL', 'http://preset-font.test/', '--noBuildLock', '--panicOnWarning', '-DFE'], { encoding: 'utf8', timeout: 120_000 });
    expect(build.status, build.stdout + build.stderr).toBe(0);
    const context = await browser.newContext();
    try {
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'preset-font.test') return route.abort();
        let path = decodeURIComponent(url.pathname);
        if (path.endsWith('/')) path += 'index.html';
        if (path.includes('..')) return route.abort();
        const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
        try { await route.fulfill({ body: readFileSync(join(temp, 'public', path)), contentType: types[extname(path)] || 'application/octet-stream' }); }
        catch { await route.fulfill({ status: 404, body: '' }); }
      });
      for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
        const page = await context.newPage();
        const fonts = [];
        page.on('request', request => { if (request.resourceType() === 'font') fonts.push(request.url()); });
        await page.addInitScript(p => { localStorage.setItem('td-preset', p); }, preset);
        await page.goto('http://preset-font.test/docs/customize/config/');
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
        await expect(page.locator('html')).toHaveAttribute('data-td-typography', typography);
        if (typography === 'system') expect(fonts.filter(url => /\/(brand|inter|ibm-plex-sans)\//.test(url))).toEqual([]);
        if (override) {
          await expect(page.locator('body')).toHaveCSS('font-family', 'serif');
          await expect(page.locator('.td-content')).toHaveCSS('font-family', 'serif');
          await expect(page.locator('h1').first()).toHaveCSS('font-family', 'serif');
        }
        if (preset === 'terminal') {
          await page.locator('[data-td-appearance-trigger]:visible').first().click();
          const panel = page.locator('dialog[open]');
          await expect(panel.locator('[data-td-preset-value="terminal"]')).toBeChecked();
          const name = panel.locator('[data-td-preset-value="terminal"] + .td-appearance__card .td-appearance__name');
          expect(await name.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
        }
        await page.close();
      }
    } finally {
      await context.close();
      rmSync(temp, { recursive: true, force: true });
    }
  });
}
