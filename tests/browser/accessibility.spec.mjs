import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];
const widths = [360, 768, 820, 1024, 1200, 1440];
const locales = [
  ['en', '/docs/content/configuration/'],
  ['zh', '/zh/docs/content/configuration/'],
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

async function scan(page) {
  return new AxeBuilder({ page }).withTags(wcagTags).analyze();
}

test.describe('WCAG AA contract', () => {
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
});
