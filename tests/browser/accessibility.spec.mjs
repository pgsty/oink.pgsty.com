import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];
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

// 1x1 light gray PNG returned for tile requests so sitemap scans stay offline.
const TILE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2dIAAAAASUVORK5CYII=',
  'base64',
);

// Players, charts, infographics and maps mount as a reader approaches them,
// and everything above the reader is due at once. Standing at the end of the
// page therefore mounts every visible one, so the scan still covers what a
// reader ends up looking at rather than a link or a source block.
async function mountDeferredComponents(page) {
  const deferred =
    '[data-td-asciinema], [data-td-echarts], [data-td-infographic], [data-td-map], pre > code.language-markmap';
  if (!(await page.locator(deferred).count())) return;

  await page.waitForFunction(
    () => {
      // Checked once per frame. A page that is still growing (API readers,
      // images, a player that just mounted) moves its end, so go there again
      // each time; the observers report on the frame after.
      scrollTo(0, document.documentElement.scrollHeight);
      // The content of a closed disclosure keeps its boxes, so ask the
      // browser whether the node is rendered rather than whether it has one.
      const shown = (node) => node.checkVisibility();
      const waiting = (selector, mounted) =>
        [...document.querySelectorAll(selector)]
          .filter(shown)
          .some((node) => !node.querySelector(mounted));
      const waitingMap = () =>
        [...document.querySelectorAll('[data-td-map]')]
          .filter(shown)
          .some(
            (node) =>
              !node.classList.contains('td-map--mounted') &&
              !node.querySelector('[data-td-map-load]') &&
              !node.querySelector('[data-td-map-canvas][hidden]'),
          );
      return (
        ![...document.querySelectorAll('pre > code.language-markmap')].some(shown) &&
        !waiting('[data-td-asciinema]', '.ap-player') &&
        !waiting('[data-td-echarts]', 'canvas, pre.td-echarts-source, [role="alert"]') &&
        !waiting('[data-td-infographic]', 'svg, pre.td-infographic-source, [role="alert"]') &&
        !waitingMap()
      );
    },
    undefined,
    { timeout: 30_000 },
  );
  await page.evaluate(() => scrollTo(0, 0));
}

async function waitForStableMarkmaps(page) {
  if (!(await page.locator('.language-markmap, .markmap').count())) return;

  await page.waitForFunction(
    () => {
      // A hidden map keeps its source until its panel is shown.
      const sourceBlocks = [...document.querySelectorAll('.language-markmap')].filter(
        (block) => block.checkVisibility(),
      );
      // Hidden maps deliberately defer rendering until their panel is shown.
      const maps = [...document.querySelectorAll('div.markmap')].filter(map =>
        map.getClientRects().length && getComputedStyle(map).visibility !== 'hidden');
      const labels = maps.flatMap(map => [...map.querySelectorAll('svg text')]);

      return (
        sourceBlocks.length === 0 &&
        maps.every((map) => map.querySelector('svg text')) &&
        labels.every(
          (label) => Number.parseFloat(getComputedStyle(label).opacity) >= 0.999,
        )
      );
    },
    undefined,
    { timeout: 10_000 },
  );
}

test.describe('WCAG AA contract', () => {
  test.beforeEach(async ({ page }) => {
    // Giscus owns its cross-origin widget DOM, and interactive maps request
    // tiles from OSM. Keep the OINK accessibility contract deterministic and
    // offline, scanning only surfaces maintained by this site.
    await page.route('https://giscus.app/**', (route) => route.abort());
    await page.route(/tile\.openstreetmap\.org/i, (route) =>
      route.fulfill({ status: 200, contentType: 'image/png', body: TILE_PNG }),
    );
  });

  // The sitemap grows with the case library; four interleaved shards keep each
  // scan well inside its own budget on a CI worker.
  const SITEMAP_SHARDS = 4;
  for (let shard = 0; shard < SITEMAP_SHARDS; shard += 1) {
    test(`every page in the multilingual sitemap (${shard + 1}/${SITEMAP_SHARDS})`, async ({ page, request }) => {
      test.setTimeout(20 * 60_000);
      await page.setViewportSize({ width: 1440, height: 900 });
      const allPaths = requestedPaths.length
        ? requestedPaths
        : await sitemapPaths(request);
      expect(allPaths.length).toBeGreaterThan(0);
      const paths = allPaths.filter((_, index) => index % SITEMAP_SHARDS === shard);

      const failures = [];
      for (const path of paths) {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        if (!response?.ok()) {
          failures.push(`${path}: HTTP ${response?.status() || 'no response'}`);
          continue;
        }
        // Markmap replaces every source block asynchronously and fades each SVG
        // label through a d3 transition. On slower CI workers, a fixed delay can
        // scan later maps mid-fade and report phantom contrast failures.
        await mountDeferredComponents(page);
        await waitForStableMarkmaps(page);
        const { violations } = await scan(page);
        if (violations.length) {
          failures.push(`${path}\n${describeViolations(path, violations)}`);
        }
      }

      expect(failures.length, failures.join('\n\n')).toBe(0);
    });
  }

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

  test('cached sidebar hydrates its active path without a contrast transition', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem('td-color-theme', 'light');
    });
    await page.goto('/zh/docs/customize/config/', {
      waitUntil: 'domcontentloaded',
    });

    const state = await page.evaluate(() => {
      const current = document.querySelector('#m-zhdocscustomizeconfig');
      const branch = document.querySelector('#m-zhdocscustomize-children');
      return {
        marker: document
          .querySelector('#td-sidebar-menu')
          ?.hasAttribute('data-td-sidebar-hydrate-active'),
        active:
          current?.classList.contains('active') &&
          current.getAttribute('aria-current') === 'page',
        activeRow: current
          ?.closest('.td-shell-tree__row')
          ?.classList.contains('td-shell-active'),
        activePath: current
          ?.closest('li')
          ?.classList.contains('td-active-path'),
        open: branch?.classList.contains('td-is-open'),
        runningAnimations:
          branch
            ?.getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length ??
          -1,
      };
    });
    expect(state).toEqual({
      marker: false,
      active: true,
      activeRow: true,
      activePath: true,
      open: true,
      runningAnimations: 0,
    });

    const { violations } = await scan(page, '#td-sidebar-menu');
    expect(
      violations,
      describeViolations('/zh/docs/customize/config/', violations),
    ).toEqual([]);
  });

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

  for (const { label, path, viewport, theme, open } of [
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
    {
      label: 'shortcut help dialog · en · light',
      path: '/docs/customize/config/',
      viewport: { width: 1280, height: 720 },
      open: async (page) => {
        await page.keyboard.press("'");
        await expect(page.locator('[data-td-keyboard-dialog]')).toBeVisible();
      },
    },
    {
      label: 'shortcut help dialog · zh · dark',
      path: '/zh/docs/customize/config/',
      viewport: { width: 390, height: 844 },
      theme: 'dark',
      open: async (page) => {
        await page.keyboard.press("'");
        await expect(page.locator('[data-td-keyboard-dialog]')).toBeVisible();
      },
    },
    {
      label: 'browsing history · en · dark',
      path: '/docs/customize/config/',
      viewport: { width: 1280, height: 720 },
      theme: 'dark',
      open: async (page) => {
        await page.goto('/docs/customize/keyboard/', { waitUntil: 'domcontentloaded' });
        await page.keyboard.press('h');
        await expect(page.locator('#td-shell-history')).toBeVisible();
        await expect(page.locator('#td-shell-history [role="option"]')).not.toHaveCount(0);
      },
    },
    {
      label: 'browsing history · zh · light · empty',
      path: '/zh/docs/customize/config/',
      viewport: { width: 390, height: 844 },
      open: async (page) => {
        await page.keyboard.press('h');
        await expect(page.locator('#td-shell-history .td-shell-search__empty')).toBeVisible();
      },
    },
  ]) {
    test(`open ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      if (theme) {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('td-color-theme', selectedTheme);
        }, theme);
      }
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
