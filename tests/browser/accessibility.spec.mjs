import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const widths = [360, 768, 820, 1024, 1200, 1440];
const locales = [
  ['en', '/docs/customize/config/'],
  ['zh', '/zh/docs/customize/config/'],
];
const themes = ['light', 'dark'];
const requestedPaths = (process.env.A11Y_PATHS || '')
  .split(',')
  .map((path) => path.trim())
  .filter(Boolean);

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

async function sitemapPaths(request) {
  const queue = ['/sitemap.xml'];
  const seen = new Set();
  const pages = new Set();

  while (queue.length) {
    const sitemap = queue.shift();
    if (seen.has(sitemap)) continue;
    seen.add(sitemap);

    const response = await request.get(sitemap);
    expect(response.ok(), `Unable to load ${sitemap}`).toBeTruthy();
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) =>
      decodeXml(match[1].trim()),
    );

    for (const location of locations) {
      const parsed = new URL(location, 'https://sitemap.invalid');
      const path = `${parsed.pathname}${parsed.search}`;
      if (parsed.pathname.endsWith('/sitemap.xml')) queue.push(path);
      else pages.add(path);
    }
  }

  return [...pages].sort();
}

function describeViolations(path, violations) {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => node.target.join(' '));
      const nodes = targets
        .slice(0, 12)
        .map((target) => `    ${target}`)
        .join('\n');
      const remainder =
        targets.length > 12 ? `\n    ... ${targets.length - 12} more` : '';
      return (
        `  [${violation.impact}] ${violation.id}: ${violation.help}\n${nodes}` +
        remainder
      );
    })
    .join(`\n  page: ${path}\n`);
}

// Swagger UI and Redoc render their own DOM from the vendored upstream
// distribution. Their markup carries WCAG AA violations this site cannot fix
// without forking them (Redoc: colour contrast in operation descriptions;
// Swagger UI: an unnamed server select and a scrollable version stamp), so they
// are scoped out for the same reason as the Giscus widget above: the contract
// covers surfaces maintained by this site.
const thirdPartyWidgets = ['.td-redoc', '.td-swagger-ui'];

async function scan(page, include) {
  const builder = new AxeBuilder({ page }).withTags(wcagTags);
  if (include) builder.include(include);
  for (const selector of thirdPartyWidgets) builder.exclude(selector);
  return builder.analyze();
}

test.describe('WCAG AA contract', () => {
  test.beforeEach(async ({ page }) => {
    // Giscus owns its cross-origin widget DOM. Keep the OINK accessibility
    // contract deterministic and scan only surfaces maintained by this site.
    await page.route('https://giscus.app/**', (route) => route.abort());
  });

  test('every page in the multilingual sitemap', async ({ page, request }) => {
    test.setTimeout(20 * 60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    const paths = requestedPaths.length
      ? requestedPaths
      : await sitemapPaths(request);
    expect(paths.length).toBeGreaterThan(0);

    const failures = [];
    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      if (!response?.ok()) {
        failures.push(`${path}: HTTP ${response?.status() || 'no response'}`);
        continue;
      }
      const { violations } = await scan(page);
      if (violations.length) {
        failures.push(`${path}\n${describeViolations(path, violations)}`);
      }
    }

    expect(failures.length, failures.join('\n\n')).toBe(0);
  });

  for (const width of widths) {
    for (const [locale, path] of locales) {
      for (const theme of themes) {
        test(`${width}px · ${locale} · ${theme}`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await page.addInitScript((selectedTheme) => {
            localStorage.setItem('td-color-theme', selectedTheme);
            localStorage.removeItem('td-shell-sidebar-collapsed');
            localStorage.removeItem('td-shell-toc-collapsed');
          }, theme);
          await page.goto(path, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('html')).toHaveAttribute(
            'data-bs-theme',
            theme,
          );

          const { violations } = await scan(page);
          const summaries = violations.map(
            (violation) =>
              `[${violation.impact}] ${violation.id}: ${violation.help}\n${violation.nodes
                .map((node) => `  ${node.target.join(' ')}`)
                .join('\n')}`,
          );
          expect(
            summaries,
            `${width}px ${locale} ${theme}\n${describeViolations(path, violations)}`,
          ).toEqual([]);
        });
      }
    }
  }

  for (const { locale, path, theme, viewport } of [
    {
      locale: 'en',
      path: '/docs/components/image/',
      theme: 'light',
      viewport: { width: 1200, height: 900 },
    },
    {
      locale: 'zh',
      path: '/zh/docs/components/image/',
      theme: 'dark',
      viewport: { width: 390, height: 844 },
    },
  ]) {
    test(`open Image Zoom dialog · ${locale} · ${theme}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem('td-color-theme', selectedTheme);
      }, theme);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.locator('.td-figure .td-image-zoom__trigger').first().click();
      const dialog = page.locator('[data-td-image-zoom-dialog]');
      await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(true);
      await expect(dialog.locator('[data-td-image-zoom-close]')).toBeFocused();

      const { violations } = await scan(page, '[data-td-image-zoom-dialog]');
      expect(
        violations,
        `${locale} ${theme} open Image Zoom dialog\n${describeViolations(
          path,
          violations,
        )}`,
      ).toEqual([]);
    });
  }

  for (const { label, path, viewport, open } of [
    {
      label: 'desktop navbar panel',
      path: '/',
      viewport: { width: 1280, height: 900 },
      open: async (page) => {
        const parent = page.locator('.td-nav-menu__parent-link').first();
        await parent.focus();
        await expect(parent).toHaveAttribute('aria-expanded', 'true');
      },
    },
    {
      label: 'compact shell drawer',
      path: '/docs/customize/config/',
      viewport: { width: 390, height: 844 },
      open: async (page) => {
        await page.locator('[data-td-shell-drawer-open]:visible').click();
        await expect(page.locator('html')).toHaveAttribute(
          'data-td-shell-drawer',
          'open',
        );
      },
    },
  ]) {
    test(`open ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await open(page);
      const { violations } = await scan(page);
      expect(
        violations,
        `${label}\n${describeViolations(path, violations)}`,
      ).toEqual([]);
    });
  }
});
