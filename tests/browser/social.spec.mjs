import { expect, test } from '@playwright/test';

function parseRgb(color) {
  const match = color.match(/rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/);
  if (!match) return null;
  return { r: +match[1], g: +match[2], b: +match[3], a: match[4] === undefined ? 1 : +match[4] };
}

function luminance(r, g, b) {
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastOnWhite(color) {
  const c = parseRgb(color);
  if (!c) return 0;
  const r = c.r * c.a + 255 * (1 - c.a);
  const g = c.g * c.a + 255 * (1 - c.a);
  const b = c.b * c.a + 255 * (1 - c.a);
  return 1.05 / (luminance(r, g, b) + 0.05);
}

function contrastBetween(fg, bg) {
  const f = parseRgb(fg);
  const b = parseRgb(bg);
  if (!f || !b) return 0;
  const bgL = luminance(b.r, b.g, b.b);
  const fgR = f.r * f.a + b.r * (1 - f.a);
  const fgG = f.g * f.a + b.g * (1 - f.a);
  const fgB = f.b * f.a + b.b * (1 - f.a);
  const fgL = luminance(fgR, fgG, fgB);
  return (Math.max(fgL, bgL) + 0.05) / (Math.min(fgL, bgL) + 0.05);
}

for (const language of ['', '/zh']) {
  test(`social makes zero third-party requests and preserves semantics and image zoom: ${language || 'en'}`, async ({ page }) => {
    const external = [];
    await page.route('**/*', (route) => {
      const reqUrl = route.request().url();
      const base = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173');
      if (/^https?:/.test(reqUrl) && new URL(reqUrl).origin !== base.origin) {
        external.push(reqUrl);
        return route.abort();
      }
      return route.continue();
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${language}/docs/components/social/`, { waitUntil: 'networkidle' });
    expect(external, 'social page must not request any external host').toEqual([]);

    const check = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.td-content figure.td-social:not(.td-social--nested)'));
      const nested = document.querySelector('.td-content figure.td-social--nested');
      const fullCard = cards.find((c) => c.querySelector('img.td-image'));
      const galleryCard = cards.find((c) => c.querySelector('.td-gallery'));
      const galleryItems = Array.from(galleryCard.querySelectorAll('.td-gallery__item'));
      const pairedNames = cards
        .map((c) => c.querySelector('.td-social__names'))
        .filter((el) => el.querySelector('.td-social__name') && el.querySelector('.td-social__handle'));
      const nestedCaption = nested.querySelector('figcaption');
      const metaLink = fullCard.querySelector('.td-social__meta a');
      const proseP = document.querySelector('.td-content > p');
      const body = fullCard.querySelector('.td-social__body');
      const nestedBody = nested.querySelector('.td-social__body');
      return {
        outerCount: cards.length,
        nestedExists: Boolean(nested),
        captionHasSpace: pairedNames.length > 0 && pairedNames.every((el) => {
          const name = el.querySelector('.td-social__name').textContent;
          const handle = el.querySelector('.td-social__handle').textContent;
          return el.textContent.includes(`${name} ${handle}`);
        }),
        nestedHasPlatformIcon: Boolean(nestedCaption.querySelector('.td-social__platform')),
        nestedHasHiddenPlatform: Boolean(nestedCaption.querySelector('.visually-hidden')),
        metaLinkHasAuthorSr: Boolean(metaLink.querySelector('.visually-hidden')),
        metaLinkUnderline: getComputedStyle(metaLink).textDecorationLine,
        bodyFontFamily: getComputedStyle(body).fontFamily,
        proseFontFamily: getComputedStyle(proseP).fontFamily,
        outerBodySize: parseFloat(getComputedStyle(body).fontSize),
        nestedBodySize: parseFloat(getComputedStyle(nestedBody).fontSize),
        gallerySameRow: galleryItems.length >= 2 &&
          Math.abs(galleryItems[0].getBoundingClientRect().top - galleryItems[1].getBoundingClientRect().top) < 2,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    expect(check.outerCount).toBeGreaterThanOrEqual(5);
    expect(check.nestedExists).toBe(true);
    expect(check.captionHasSpace, 'author name and handle must be separated by whitespace').toBe(true);
    expect(check.nestedHasPlatformIcon).toBe(false);
    expect(check.nestedHasHiddenPlatform, 'nested quote without platform must not fabricate hidden X text').toBe(false);
    expect(check.metaLinkHasAuthorSr).toBe(true);
    expect(check.metaLinkUnderline).toContain('underline');
    expect(check.bodyFontFamily).not.toContain('OINK Kai');
    expect(check.bodyFontFamily).toBe(check.proseFontFamily);
    expect(check.nestedBodySize).toBeLessThan(check.outerBodySize);
    expect(check.gallerySameRow, '2-image gallery inside social card should stay 2-up on desktop').toBe(true);
    expect(check.overflowX).toBe(false);

    // Attached image opts into OINK's shared Image Zoom dialog.
    const zoomImg = page.locator('.td-content figure.td-social img[data-td-image-zoom]').first();
    await expect(zoomImg).toBeVisible();
    await zoomImg.click();
    await expect(page.locator('dialog.td-image-zoom[open]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.td-image-zoom[open]')).toHaveCount(0);

    // Narrow viewport (390px): no horizontal overflow.
    await page.setViewportSize({ width: 390, height: 844 });
    const narrowOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(narrowOverflow).toBe(false);
  });
}

test('social adapts geometry, contrast and nested surfaces across all four presets and color modes', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const cases = [
    ['paper', '12px', '10px', '50%', '8px'],
    ['slate', '12px', '10px', '50%', '8px'],
    ['ink', '0px', '0px', '50%', '0px'],
    ['terminal', '2px', '2px', '2px', '2px'],
  ];

  for (const [preset, outerR, nestedR, avatarR, galleryR] of cases) {
    for (const mode of ['light', 'dark']) {
      await page.addInitScript(({ p, m }) => {
        localStorage.setItem('td-preset', p);
        localStorage.setItem('td-color-theme', m);
      }, { p: preset, m: mode });
      await page.goto('/docs/components/social/', { waitUntil: 'domcontentloaded' });

      const metrics = await page.evaluate(() => {
        const outer = document.querySelector('.td-content figure.td-social:not(.td-social--nested)');
        const nested = document.querySelector('.td-content figure.td-social--nested');
        const avatar = outer.querySelector('.td-social__avatar');
        const initialOuter = outer.querySelector('.td-social__avatar--initial');
        const initialNested = nested.querySelector('.td-social__avatar--initial');
        const galleryItem = document.querySelector('.td-content figure.td-social .td-gallery__item');
        const prose = document.querySelector('.td-content > p');
        const body = outer.querySelector('.td-social__body');
        return {
          outerRadius: getComputedStyle(outer).borderTopLeftRadius,
          nestedRadius: getComputedStyle(nested).borderTopLeftRadius,
          avatarRadius: getComputedStyle(avatar).borderTopLeftRadius,
          galleryRadius: getComputedStyle(galleryItem).borderTopLeftRadius,
          outerBg: getComputedStyle(outer).backgroundColor,
          outerColor: getComputedStyle(body).color,
          bodySize: parseFloat(getComputedStyle(body).fontSize),
          proseSize: parseFloat(getComputedStyle(prose).fontSize),
          initialBorderWidth: parseFloat(getComputedStyle(initialOuter).borderTopWidth),
          initialOuterFont: parseFloat(getComputedStyle(initialOuter).fontSize),
          initialNestedFont: parseFloat(getComputedStyle(initialNested).fontSize),
        };
      });

      expect(metrics.outerRadius, `${preset}/${mode} outer radius`).toBe(outerR);
      expect(metrics.nestedRadius, `${preset}/${mode} nested radius`).toBe(nestedR);
      expect(metrics.avatarRadius, `${preset}/${mode} avatar radius`).toBe(avatarR);
      expect(metrics.galleryRadius, `${preset}/${mode} gallery item radius`).toBe(galleryR);
      expect(metrics.bodySize, `${preset}/${mode} body matches prose size`).toBeCloseTo(metrics.proseSize, 1);
      expect(metrics.initialBorderWidth, `${preset}/${mode} initial avatar border`).toBeGreaterThanOrEqual(1);
      expect(metrics.initialNestedFont, `${preset}/${mode} nested initial scales down`).toBeLessThan(metrics.initialOuterFont);
      expect(contrastBetween(metrics.outerColor, metrics.outerBg), `${preset}/${mode} AA body contrast`).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test('social switches cleanly to paper palette in dark-mode browser print across all four presets', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
    await page.addInitScript(({ p }) => {
      localStorage.setItem('td-preset', p);
      localStorage.setItem('td-color-theme', 'dark');
    }, { p: preset });
    await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
    await page.goto('/docs/components/social/', { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
      const card = document.querySelector('.td-content figure.td-social:has(figure.td-social--nested)');
      const body = card.querySelector(':scope > .td-social__body');
      const nested = card.querySelector('figure.td-social--nested');
      const nestedBody = nested.querySelector(':scope > .td-social__body');
      const metaLink = card.querySelector(':scope > .td-social__meta a');
      const linkAfter = getComputedStyle(metaLink, '::after').content;
      return {
        cardBg: getComputedStyle(card).backgroundColor,
        bodyBg: getComputedStyle(body).backgroundColor,
        bodyColor: getComputedStyle(body).color,
        bodyBorderLeft: parseFloat(getComputedStyle(body).borderLeftWidth),
        nestedBg: getComputedStyle(nested).backgroundColor,
        nestedBodyColor: getComputedStyle(nestedBody).color,
        linkColor: getComputedStyle(metaLink).color,
        linkAfter,
      };
    });

    expect(data.cardBg, `${preset} dark print card bg`).toBe('rgb(255, 255, 255)');
    expect(data.bodyBg, `${preset} dark print body must not have blockquote cutout bg`).toBe('rgba(0, 0, 0, 0)');
    expect(data.bodyBorderLeft, `${preset} dark print body must not have blockquote bar`).toBe(0);
    expect(contrastOnWhite(data.bodyColor), `${preset} dark print body contrast`).toBeGreaterThanOrEqual(10);
    expect(contrastOnWhite(data.linkColor), `${preset} dark print link contrast`).toBeGreaterThanOrEqual(4.5);
    expect(contrastBetween(data.nestedBodyColor, data.nestedBg), `${preset} dark print nested contrast`).toBeGreaterThanOrEqual(10);
    expect(data.linkAfter, `${preset} print exposes original URL`).toContain('https://example.com/');
  }
});

test('social preserves forced colors and RTL handle/timestamp isolation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/docs/components/social/', { waitUntil: 'domcontentloaded' });

  const fc = await page.evaluate(() => {
    const initial = document.querySelector('.td-content .td-social__avatar--initial');
    return {
      borderStyle: getComputedStyle(initial).borderTopStyle,
      borderWidth: parseFloat(getComputedStyle(initial).borderTopWidth),
    };
  });
  expect(fc.borderStyle).toBe('solid');
  expect(fc.borderWidth).toBeGreaterThanOrEqual(1);

  await page.emulateMedia({ forcedColors: 'none' });
  await page.evaluate(() => { document.documentElement.dir = 'rtl'; });

  const rtl = await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('.td-content figure.td-social:not(.td-social--nested)'))
      .find((c) => c.querySelector('.td-social__handle') && c.querySelector('time[datetime]'));
    const avatar = card.querySelector('.td-social__avatar').getBoundingClientRect();
    const handle = card.querySelector('.td-social__handle');
    const handleRect = handle.getBoundingClientRect();
    const time = card.querySelector('time[datetime]');
    return {
      handleDirAttr: handle.getAttribute('dir'),
      handleDirection: getComputedStyle(handle).direction,
      handleBidi: getComputedStyle(handle).unicodeBidi,
      timeDirection: getComputedStyle(time).direction,
      timeBidi: getComputedStyle(time).unicodeBidi,
      // In RTL, avatar sits at the right edge and handle stays to its left, flush right.
      handleRightNearAvatar: avatar.left - handleRect.right >= -1 && avatar.left - handleRect.right < 30,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });

  expect(rtl.handleDirAttr).toBe('ltr');
  expect(rtl.handleDirection).toBe('ltr');
  expect(rtl.handleBidi).toBe('isolate');
  expect(rtl.timeDirection).toBe('ltr');
  expect(rtl.timeBidi).toBe('isolate');
  expect(rtl.handleRightNearAvatar, 'LTR handle should remain flush-right beside avatar in RTL').toBe(true);
  expect(rtl.overflowX).toBe(false);
});
