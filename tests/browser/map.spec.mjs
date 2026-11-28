import { expect, test } from '@playwright/test';

// 1x1 light gray PNG returned for all tile requests so browser tests never hit
// tile.openstreetmap.org.
const TILE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2dIAAAAASUVORK5CYII=',
  'base64',
);

const MAP_PATH = '/docs/components/map/';
const MAP_ZH_PATH = '/zh/docs/components/map/';
const NON_MAP_PATH = '/docs/components/badge/';

async function stubTiles(page, { status = 200 } = {}) {
  const urls = [];
  await page.route(/tile\.openstreetmap\.org/i, (route) => {
    urls.push(route.request().url());
    if (status !== 200) {
      return route.fulfill({ status, body: 'tile error' });
    }
    return route.fulfill({ status: 200, contentType: 'image/png', body: TILE_PNG });
  });
  return urls;
}

function contrastRatio(fg, bg) {
  const parse = (css) => {
    const match = String(css).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
  };
  const luminance = ([r, g, b]) =>
    [r, g, b]
      .map((channel) => {
        const c = channel / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      })
      .reduce((sum, val, i) => sum + val * [0.2126, 0.7152, 0.0722][i], 0);
  const l1 = luminance(parse(fg));
  const l2 = luminance(parse(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

test.describe('Map component', () => {
  test('non-map pages load no Leaflet assets and off-screen maps defer Leaflet and tiles', async ({
    page,
  }) => {
    const tiles = await stubTiles(page);
    const leafletRequests = [];
    page.on('request', (req) => {
      if (/leaflet/i.test(req.url())) leafletRequests.push(req.url());
    });

    await page.goto(NON_MAP_PATH, { waitUntil: 'networkidle' });
    expect(leafletRequests).toEqual([]);
    expect(tiles).toEqual([]);

    // Small viewport keeps the first map more than 320px below the fold.
    await page.setViewportSize({ width: 1280, height: 320 });
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });
    expect(leafletRequests.some((url) => /\.js(\?|$)/i.test(url))).toBe(false);
    expect(tiles).toEqual([]);

    // Scrolling the first map into view loads Leaflet and mounts only that map.
    await page.locator('[data-td-map]').first().scrollIntoViewIfNeeded();
    await expect(page.locator('[data-td-map] .td-map__canvas').first()).toHaveClass(
      /leaflet-container/,
    );
    expect(leafletRequests.some((url) => /\.js(\?|$)/i.test(url))).toBe(true);
    expect(tiles.length).toBeGreaterThan(0);
    await expect(page.locator('[data-td-map] .td-map__canvas').last()).toBeHidden();
  });

  test('scroll wheel scrolls the page without zooming the map', async ({ page }) => {
    await stubTiles(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });

    const routeMap = page.locator('[data-td-map]').nth(1);
    const canvas = routeMap.locator('.td-map__canvas');
    await routeMap.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveClass(/leaflet-container/);

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    const beforeScrollY = await page.evaluate(() => window.scrollY);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(150);
    const afterScrollY = await page.evaluate(() => window.scrollY);
    expect(afterScrollY).toBeGreaterThan(beforeScrollY);
  });

  test('keyboard navigation, accessible marker names, Escape dismissal, and linked attribution', async ({
    page,
  }) => {
    await stubTiles(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });

    const routeMap = page.locator('[data-td-map]').nth(1);
    const canvas = routeMap.locator('.td-map__canvas');
    await routeMap.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveClass(/leaflet-container/);

    // OSM attribution is rendered as a safe external link.
    const attrLink = canvas.locator('.leaflet-control-attribution a');
    await expect(attrLink).toHaveAttribute('href', 'https://www.openstreetmap.org/copyright');
    await expect(attrLink).toHaveAttribute('rel', 'external');

    // Focus the map and verify +/-/w yield from keyboard-nav.js (no column width change or sidebar steal).
    await canvas.focus();
    const beforeWidth = await page.evaluate(
      () => document.querySelector('.td-shell-article')?.getBoundingClientRect().width || 0,
    );
    await page.keyboard.press('-');
    await page.keyboard.press('+');
    await page.keyboard.press('w');
    const afterState = await page.evaluate(() => ({
      width: document.querySelector('.td-shell-article')?.getBoundingClientRect().width || 0,
      stored: localStorage.getItem('td-shell-article-w'),
      inMap: Boolean(document.activeElement?.closest('[data-td-map-canvas]')),
    }));
    expect(Math.abs(afterState.width - beforeWidth)).toBeLessThanOrEqual(1);
    expect(afterState.stored).toBeNull();
    expect(afterState.inMap).toBe(true);

    // Marker carries accessible place name, Enter opens popup with thumbnail, Escape closes it and restores focus.
    await expect(routeMap.locator('.td-map__places .td-map__thumb')).toHaveCount(4);
    const firstMarker = canvas.locator('.td-map__marker').first();
    await expect(firstMarker).toHaveAttribute('aria-label', /^1\. Forbidden City$/);
    await firstMarker.focus();
    await page.keyboard.press('Enter');
    await expect(canvas.locator('.leaflet-popup')).toBeVisible();
    await expect(canvas.locator('.leaflet-popup .td-map__popup img')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(canvas.locator('.leaflet-popup')).toBeHidden();
    await expect(firstMarker).toBeFocused();

    // Clicking a place in the list opens its popup; clicking an anchor link stays navigation.
    await routeMap.locator('.td-map__places > li').nth(1).click();
    await expect(canvas.locator('.leaflet-popup .td-map__popup-name')).toHaveText(
      'Jingshan Park',
    );
    await expect(canvas.locator('.leaflet-popup .td-map__popup img')).toBeVisible();
  });

  test('localized Chinese labels include popup close button and rich-copy drops map canvas', async ({
    page,
  }) => {
    await stubTiles(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(MAP_ZH_PATH, { waitUntil: 'networkidle' });

    const routeMap = page.locator('[data-td-map]').nth(1);
    const canvas = routeMap.locator('.td-map__canvas');
    await routeMap.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveClass(/leaflet-container/);

    await canvas.locator('.td-map__marker').first().click();
    await expect(canvas.locator('.leaflet-popup-close-button')).toHaveAttribute(
      'aria-label',
      '关闭',
    );
    const popupMetrics = await canvas.evaluate((cv) => {
      const content = cv.querySelector('.leaflet-popup-content');
      const para = cv.querySelector('.td-map__popup p');
      const cs = getComputedStyle(para);
      const lineHeight = parseFloat(cs.lineHeight) || 20;
      return {
        contentWidth: content.getBoundingClientRect().width,
        paraWidth: para.getBoundingClientRect().width,
        paraHeight: para.getBoundingClientRect().height,
        lineHeight,
      };
    });
    expect(popupMetrics.contentWidth).toBeGreaterThanOrEqual(180);
    expect(popupMetrics.paraWidth).toBeGreaterThanOrEqual(180);
    expect(popupMetrics.paraHeight).toBeLessThanOrEqual(popupMetrics.lineHeight * 2.5);

    const copied = await page.evaluate(() => {
      const fig = document.querySelectorAll('[data-td-map]')[1];
      if (!window.OinkRichCopy) return '';
      const skin = window.OinkRichCopy.readSkin(getComputedStyle(document.documentElement), 'ltr');
      return window.OinkRichCopy.render(window.OinkRichCopy.collector(null, {}).walk(fig), skin);
    });
    expect(copied).toContain('故宫');
    expect(copied).not.toContain('OpenStreetMap contributors');
  });

  test('all four presets in light and dark modes preserve contrast, typography, and popup geometry', async ({
    page,
  }) => {
    await stubTiles(page);
    await page.setViewportSize({ width: 1280, height: 900 });

    for (const preset of ['paper', 'slate', 'github', 'ink', 'news', 'terminal']) {
      for (const theme of ['light', 'dark']) {
        await page.addInitScript(
          ({ p, t }) => {
            localStorage.setItem('td-preset', p);
            localStorage.setItem('td-color-theme', t);
          },
          { p: preset, t: theme },
        );
        await page.goto(MAP_PATH, { waitUntil: 'networkidle' });
        const routeMap = page.locator('[data-td-map]').nth(1);
        const canvas = routeMap.locator('.td-map__canvas');
        await routeMap.scrollIntoViewIfNeeded();
        await expect(canvas).toHaveClass(/leaflet-container/);
        await canvas.locator('.td-map__marker').first().click();
        await expect(canvas.locator('.leaflet-popup')).toBeVisible();

        const metrics = await routeMap.evaluate((fig) => {
          const cv = fig.querySelector('.td-map__canvas');
          const marker = cv.querySelector('.td-map__marker');
          const popupWrap = cv.querySelector('.leaflet-popup-content-wrapper');
          const popupContent = cv.querySelector('.leaflet-popup-content');
          const popupLink = cv.querySelector('a.td-map__popup-name');
          const closeBtn = cv.querySelector('.leaflet-popup-close-button');
          const linkRect = popupLink.getBoundingClientRect();
          const closeRect = closeBtn.getBoundingClientRect();
          const overlap =
            linkRect.right > closeRect.left &&
            linkRect.left < closeRect.right &&
            linkRect.bottom > closeRect.top &&
            linkRect.top < closeRect.bottom;
          return {
            figFont: getComputedStyle(fig).fontFamily,
            canvasFont: getComputedStyle(cv).fontFamily,
            markerBg: getComputedStyle(marker).backgroundColor,
            markerFg: getComputedStyle(marker).color,
            popupBg: getComputedStyle(popupWrap).backgroundColor,
            popupLinkFg: getComputedStyle(popupLink).color,
            popupContentWidth: popupContent.getBoundingClientRect().width,
            overlap,
          };
        });

        expect(metrics.canvasFont, `${preset}-${theme} canvas font`).toBe(metrics.figFont);
        expect(
          metrics.canvasFont.toLowerCase().startsWith('"helvetica neue"'),
          `${preset}-${theme} does not fall back to Leaflet Helvetica`,
        ).toBe(false);
        expect(
          contrastRatio(metrics.markerFg, metrics.markerBg),
          `${preset}-${theme} marker contrast`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(metrics.popupLinkFg, metrics.popupBg),
          `${preset}-${theme} popup link contrast`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(metrics.popupContentWidth, `${preset}-${theme} popup width`).toBeGreaterThanOrEqual(
          180,
        );
        expect(metrics.popupContentWidth, `${preset}-${theme} popup max width`).toBeLessThanOrEqual(
          295,
        );
        expect(metrics.overlap, `${preset}-${theme} popup close button overlap`).toBe(false);
      }
    }
  });

  test('touchscreens disable single-finger map dragging so vertical page scroll is never trapped', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await stubTiles(page);
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });

    const firstMap = page.locator('[data-td-map]').first();
    const canvas = firstMap.locator('.td-map__canvas');
    await firstMap.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveClass(/leaflet-container/);

    const touchProps = await canvas.evaluate((el) => ({
      classes: el.className,
      touchAction: getComputedStyle(el).touchAction,
    }));
    expect(touchProps.classes).not.toContain('leaflet-touch-drag');
    expect(touchProps.touchAction).toContain('pan-y');
    await context.close();
  });

  test('print media from dark mode hides canvas and prints legible dark ink with break-inside auto', async ({
    page,
  }) => {
    await stubTiles(page);
    await page.addInitScript(() => {
      localStorage.setItem('td-preset', 'paper');
      localStorage.setItem('td-color-theme', 'dark');
    });
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });
    const routeMap = page.locator('[data-td-map]').nth(1);
    await routeMap.scrollIntoViewIfNeeded();
    await expect(routeMap.locator('.td-map__canvas')).toHaveClass(/leaflet-container/);

    await page.emulateMedia({ media: 'print' });
    const printMetrics = await routeMap.evaluate((fig) => ({
      canvasDisplay: getComputedStyle(fig.querySelector('.td-map__canvas')).display,
      figureBreak: getComputedStyle(fig).breakInside,
      textColor: getComputedStyle(fig.querySelector('.td-map__text')).color,
      captionColor: getComputedStyle(fig.querySelector('figcaption')).color,
    }));
    expect(printMetrics.canvasDisplay).toBe('none');
    expect(printMetrics.figureBreak).toBe('auto');
    expect(contrastRatio(printMetrics.textColor, 'rgb(255, 255, 255)')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(printMetrics.captionColor, 'rgb(255, 255, 255)')).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  test('tile failure and Leaflet failure both hide the canvas and keep the place list', async ({
    page,
  }) => {
    // 1. All tiles return 503. Leaflet must finish its own 'load' dispatch
    // before the map is removed, so the fallback throws nothing.
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await stubTiles(page, { status: 503 });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });
    const firstMap = page.locator('[data-td-map]').first();
    await firstMap.scrollIntoViewIfNeeded();
    await expect(firstMap.locator('.td-map__canvas')).toBeHidden();
    await expect(firstMap.locator('.td-map__places > li')).toHaveCount(3);
    await page.waitForTimeout(300);
    expect(pageErrors).toEqual([]);

    // 2. Leaflet script itself fails to load.
    await page.unroute(/tile\.openstreetmap\.org/i);
    await stubTiles(page, { status: 200 });
    await page.route(/leaflet.*\.js/i, (route) => route.abort());
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });
    await firstMap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await expect(firstMap.locator('.td-map__canvas')).toBeHidden();
    await expect(firstMap.locator('.td-map__places > li')).toHaveCount(3);
  });

  test('reduced motion disables Leaflet fade and zoom animations', async ({ page }) => {
    await stubTiles(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(MAP_PATH, { waitUntil: 'networkidle' });

    const firstMap = page.locator('[data-td-map]').first();
    const canvas = firstMap.locator('.td-map__canvas');
    await firstMap.scrollIntoViewIfNeeded();
    await expect(canvas).toHaveClass(/leaflet-container/);
    const classes = await canvas.getAttribute('class');
    expect(classes).not.toContain('leaflet-fade-anim');
    expect(classes).not.toContain('leaflet-zoom-anim');
  });
});
