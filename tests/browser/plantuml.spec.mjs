import { expect, test } from '@playwright/test';

const fixture = '/tests/plantuml/';
const rendered = '.td-plantuml[data-td-plantuml-state="rendered"]';

async function visitAll(page) {
  for (const figure of await page.locator('.td-plantuml').all()) {
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toHaveAttribute('data-td-plantuml-state', /rendered|error/);
  }
}


async function localOnly(page) {
  const external = [];
  const requests = [];
  await page.route('**/*', route => {
    const url = route.request().url();
    requests.push(url);
    if (/^https?:/.test(url) && new URL(url).origin !== new URL(test.info().project.use.baseURL || process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173').origin) {
      external.push(url);
      return route.abort();
    }
    return route.continue();
  });
  return { external, requests };
}

test('local engine renders multiple diagrams, preserves source, and recovers after unsupported input', async ({ page }) => {
  const network = await localOnly(page);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(fixture);
  await expect(page.locator('.td-plantuml')).toHaveCount(8);
  await visitAll(page);
  await expect(page.locator('[data-td-plantuml-state="pending"]')).toHaveCount(0);
  const figures = page.locator('.td-plantuml');
  for (const i of [0, 1, 7]) {
    await expect(figures.nth(i)).toHaveAttribute('data-td-plantuml-state', 'rendered');
    await expect(figures.nth(i).locator('pre')).toBeHidden();
    await expect(figures.nth(i).locator('img')).toHaveAttribute('src', /^blob:/);
    expect(await figures.nth(i).locator('img').evaluate(img => img.naturalWidth)).toBeGreaterThan(50);
  }
  for (const i of [2, 3, 4, 5, 6]) {
    await expect(figures.nth(i)).toHaveAttribute('data-td-plantuml-state', 'error');
    await expect(figures.nth(i).locator('pre')).toBeVisible();
    await expect(figures.nth(i).getByRole('alert')).toBeVisible();
  }
  expect(await figures.first().locator('code').textContent()).toBe('@startuml\nAlice -> Bob: 中文 <tag> & "quotes"\n@enduml');
  const svg = await figures.first().locator('img').evaluate(async img => (await fetch(img.src)).text());
  expect(svg).toContain('中文');
  expect(svg).not.toContain('Syntax Error');
  await expect(figures.locator('svg')).toHaveCount(0);
  expect(network.external).toEqual([]);
  expect(network.requests.filter(url => /\/third_party\/plantuml\/.*\.js/.test(url))).toHaveLength(2);
  expect(errors).toEqual([]);
});

test('theme changes redraw every diagram and release obsolete images', async ({ page }) => {
  await page.goto(fixture);
  await visitAll(page);
  await expect(page.locator(rendered)).toHaveCount(3);
  const original = await page.locator(rendered).first().locator('img').getAttribute('src');
  await page.evaluate(() => {
    document.documentElement.dataset.bsTheme = 'dark';
    document.documentElement.dataset.bsTheme = 'light';
    document.documentElement.dataset.bsTheme = 'dark';
  });
  await visitAll(page);
  for (const figure of await page.locator(rendered).all()) {
    await figure.scrollIntoViewIfNeeded();
    await expect(figure).toHaveAttribute('data-td-plantuml-theme', 'dark');
  }
  await expect(page.locator(`${rendered}[data-td-plantuml-theme="dark"]`)).toHaveCount(3);
  await visitAll(page);
  await expect(page.locator('[data-td-plantuml-state="pending"]')).toHaveCount(0);
  await expect(page.locator('[data-td-plantuml-state="error"]')).toHaveCount(5);
  await expect(page.locator(rendered).first().locator('img')).not.toHaveAttribute('src', original);
  expect(await page.evaluate(async url => {
    try { await fetch(url); return true; } catch { return false; }
  }, original)).toBe(false);
  await expect(page.locator(`${rendered} .td-plantuml__image`)).toHaveCount(3);
});

test('missing local runtime keeps readable source without external fallback', async ({ page }) => {
  const network = await localOnly(page);
  await page.route('**/third_party/plantuml/plantuml*.js', route => route.abort());
  await page.goto(fixture);
  await visitAll(page);
  await expect(page.locator('[data-td-plantuml-state="error"]')).toHaveCount(8);
  for (const pre of await page.locator('.td-plantuml pre').all()) await expect(pre).toBeVisible();
  await expect(page.locator('.td-plantuml img')).toHaveCount(0);
  expect(network.external).toEqual([]);
});

test('ordinary pages and Print load no PlantUML assets; no-JS retains source', async ({ page, browser }) => {
  const network = await localOnly(page);
  for (const path of ['/docs/start/', '/_print/tests/plantuml/']) {
    await page.goto(path);
    await expect(page.locator('script[src*="plantuml"]')).toHaveCount(0);
  }
  expect(network.requests.filter(url => /\/third_party\/plantuml\//.test(url))).toEqual([]);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(new URL(fixture, page.url()).href);
  await expect(staticPage.locator('code.language-plantuml')).toHaveCount(8);
  await expect(staticPage.locator('code.language-plantuml').first()).toBeVisible();
  await context.close();
});

for (const locale of ['', '/zh']) {
  for (const colorScheme of ['light', 'dark']) {
    test(`documentation examples remain readable: ${locale || 'en'} ${colorScheme}`, async ({ page }) => {
      const network = await localOnly(page);
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${locale}/docs/components/plantuml/`);
      await visitAll(page);
      await expect(page.locator(rendered)).toHaveCount(5);
      await expect(page.locator('[data-td-plantuml-state="error"]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const image = page.locator('.td-plantuml__image').first();
      await image.focus();
      await expect(image).toBeFocused();
      await expect(image).toHaveCSS('outline-style', 'solid');
      await page.setViewportSize({ width: 1440, height: 900 });
      expect(network.external).toEqual([]);
    });
  }
}
