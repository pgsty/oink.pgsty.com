import { expect, test } from '@playwright/test';

function parseRgb(color) {
  const match = color.match(/rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/);
  if (!match) return null;
  return { r: +match[1], g: +match[2], b: +match[3], a: match[4] === undefined ? 1 : +match[4] };
}

function contrastOnWhite(color) {
  const c = parseRgb(color);
  if (!c) return 0;
  const r = c.r * c.a + 255 * (1 - c.a);
  const g = c.g * c.a + 255 * (1 - c.a);
  const b = c.b * c.a + 255 * (1 - c.a);
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return (1.05) / (lum + 0.05);
}

for (const language of ['', '/zh']) {
  test(`timeline wide layout, node stacking, multi-paragraph gap and mobile reflow: ${language || 'en'}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${language}/docs/components/timeline/`);

    const metrics = await page.evaluate(() => {
      const lists = Array.from(document.querySelectorAll('.td-content dl.timeline'));
      const first = lists[0];
      const dt0 = first.querySelector(':scope > dt');
      const after0 = getComputedStyle(dt0, '::after');
      const events = lists.find((dl) => dl.querySelector(':scope > dd > p'));
      const secondPara = events.querySelector(':scope > dd > p');
      const several = lists.find((dl) => dl.querySelector(':scope > dd + dd'));
      const firstSharedDd = several.querySelector(':scope > dd:has(+ dd)');
      const singleDd = first.querySelector(':scope > dd');
      return {
        count: lists.length,
        display: getComputedStyle(first).display,
        isolation: getComputedStyle(first).isolation,
        dotZIndex: after0.zIndex,
        paraMarginTop: parseFloat(getComputedStyle(secondPara).marginTop),
        sharedDdPadBottom: parseFloat(getComputedStyle(firstSharedDd).paddingBottom),
        regularDdPadBottom: parseFloat(getComputedStyle(singleDd).paddingBottom),
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    expect(metrics.count).toBeGreaterThanOrEqual(4);
    expect(metrics.display).toBe('grid');
    expect(metrics.isolation).toBe('isolate');
    expect(Number(metrics.dotZIndex)).toBeGreaterThanOrEqual(1);
    expect(metrics.paraMarginTop).toBeGreaterThanOrEqual(10);
    expect(metrics.sharedDdPadBottom).toBeLessThan(metrics.regularDdPadBottom);
    expect(metrics.overflowX).toBe(false);

    // Narrow viewport switches cleanly to single column with no overflow.
    await page.setViewportSize({ width: 390, height: 844 });
    const narrow = await page.evaluate(() => {
      const first = document.querySelector('.td-content dl.timeline');
      return {
        display: getComputedStyle(first).display,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    expect(narrow.display).toBe('block');
    expect(narrow.overflowX).toBe(false);
  });
}

test('timeline stays legible in dark-mode browser print across all four presets', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const [preset, expectedRadius] of [
    ['paper', '50%'],
    ['slate', '50%'],
    ['ink', '0px'],
    ['terminal', '2px'],
  ]) {
    await page.addInitScript(({ p }) => {
      localStorage.setItem('td-preset', p);
      localStorage.setItem('td-color-theme', 'dark');
    }, { p: preset });
    await page.goto('/docs/components/timeline/');
    await page.emulateMedia({ media: 'print' });

    const data = await page.evaluate(() => {
      const dl = document.querySelector('.td-content dl.timeline');
      const dt = dl.querySelector(':scope > dt');
      const dd = dl.querySelector(':scope > dd');
      const dd2 = dl.querySelectorAll(':scope > dd')[1] || dd;
      const after = getComputedStyle(dt, '::after');
      return {
        dtColor: getComputedStyle(dt).color,
        ddColor: getComputedStyle(dd).color,
        axisBorder: getComputedStyle(dd2).borderInlineStartColor,
        dotBg: after.backgroundColor,
        dotBorder: after.borderTopColor,
        dotRadius: after.borderRadius,
        dtBreakAfter: getComputedStyle(dt).breakAfter,
        ddBreakInside: getComputedStyle(dd).breakInside,
      };
    });

    expect(contrastOnWhite(data.ddColor), `${preset} dark print dd contrast`).toBeGreaterThanOrEqual(10);
    expect(contrastOnWhite(data.dtColor), `${preset} dark print dt contrast`).toBeGreaterThanOrEqual(7);
    expect(contrastOnWhite(data.axisBorder), `${preset} dark print axis visibility`).toBeGreaterThanOrEqual(1.6);
    expect(contrastOnWhite(data.dotBorder), `${preset} dark print node contrast`).toBeGreaterThanOrEqual(4.5);
    expect(data.dotBg).toBe('rgb(255, 255, 255)');
    expect(data.dotRadius).toBe(expectedRadius);
    expect(['avoid', 'avoid-page']).toContain(data.dtBreakAfter);
    expect(['avoid', 'avoid-page']).toContain(data.ddBreakInside);
  }
});

test('timeline honors forced colors and RTL marker alignment', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/docs/components/timeline/');

  const fc = await page.evaluate(() => {
    const dl = document.querySelector('.td-content dl.timeline');
    const dt = dl.querySelector(':scope > dt');
    const dd1 = dl.querySelector(':scope > dd');
    const after = getComputedStyle(dt, '::after');
    return {
      dotZIndex: after.zIndex,
      dotBg: after.backgroundColor,
      dotBorder: after.borderTopColor,
      dd1BorderLeftWidth: getComputedStyle(dd1).borderLeftWidth,
    };
  });
  expect(Number(fc.dotZIndex)).toBeGreaterThanOrEqual(1);
  expect(fc.dotBg).not.toBe(fc.dotBorder);
  // First dd drops its own border so forced-colors never paints a stub above the first node.
  expect(fc.dd1BorderLeftWidth).toBe('0px');

  // Switch to normal colors and test RTL mirroring + BiDi marker alignment (wide and narrow).
  await page.emulateMedia({ forcedColors: 'none' });
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
  const rtlWide = await page.evaluate(() => {
    const dl = document.querySelectorAll('.td-content dl.timeline')[1];
    const dt = dl.querySelector(':scope > dt');
    const dd = dl.querySelector(':scope > dd');
    const range = document.createRange();
    range.selectNodeContents(dt);
    const textRect = range.getBoundingClientRect();
    const dtRect = dt.getBoundingClientRect();
    const ddRect = dd.getBoundingClientRect();
    return {
      dtLeft: dtRect.left,
      ddRight: ddRect.right,
      // Distance from the axis edge (left side of dt) vs outer right edge.
      distToAxis: textRect.left - dtRect.left,
      distToOuter: dtRect.right - textRect.right,
      unicodeBidi: getComputedStyle(dt).unicodeBidi,
      textAlign: getComputedStyle(dt).textAlign,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  // In RTL wide mode, the marker column sits to the right of the event column
  // and even Latin timestamps hug the axis (left edge) rather than drifting right.
  expect(rtlWide.dtLeft).toBeGreaterThanOrEqual(rtlWide.ddRight - 1);
  expect(rtlWide.textAlign).toBe('left');
  expect(rtlWide.distToAxis).toBeLessThan(rtlWide.distToOuter);
  expect(rtlWide.unicodeBidi).toBe('plaintext');
  expect(rtlWide.overflowX).toBe(false);

  await page.setViewportSize({ width: 390, height: 844 });
  const rtlNarrow = await page.evaluate(() => {
    const dl = document.querySelectorAll('.td-content dl.timeline')[1];
    const dt = dl.querySelector(':scope > dt');
    const range = document.createRange();
    range.selectNodeContents(dt);
    const textRect = range.getBoundingClientRect();
    const dtRect = dt.getBoundingClientRect();
    return {
      // In RTL narrow mode, axis is on the right edge of dt.
      distToAxis: dtRect.right - textRect.right,
      distToOuter: textRect.left - dtRect.left,
      textAlign: getComputedStyle(dt).textAlign,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  expect(rtlNarrow.textAlign).toBe('right');
  expect(rtlNarrow.distToAxis).toBeLessThan(rtlNarrow.distToOuter);
  expect(rtlNarrow.overflowX).toBe(false);
});
