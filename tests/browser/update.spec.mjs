import { expect, test } from '@playwright/test';

for (const language of ['', '/zh']) {
  test(`update headings keep TOC anchors, metadata flow, and mobile layout: ${language || 'en'}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${language}/docs/components/update/`);

    const metrics = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('.td-content h2.update, .td-content h3.update'));
      const metas = Array.from(document.querySelectorAll('.td-content .td-update-meta'));
      const firstMeta = metas[0];
      const time = firstMeta ? firstMeta.querySelector('time[datetime]') : null;
      const tags = firstMeta ? Array.from(firstMeta.querySelectorAll('.td-update-tag')) : [];
      const seps = firstMeta ? Array.from(firstMeta.querySelectorAll('.td-update-sep')) : [];
      const tocLinks = Array.from(document.querySelectorAll('.td-shell-toc a[href^="#"]'))
        .map((a) => a.getAttribute('href'));
      return {
        headingCount: headings.length,
        metaCount: metas.length,
        allHaveIds: headings.every((h) => Boolean(h.id)),
        firstInToc: Boolean(headings[0] && tocLinks.includes(`#${headings[0].id}`)),
        hasDatetime: Boolean(time && /^\d{4}-\d{2}-\d{2}$/.test(time.getAttribute('datetime'))),
        tagCount: tags.length,
        sepFontZero: seps.every((sep) => parseFloat(getComputedStyle(sep).fontSize) === 0),
        textSeparated: firstMeta ? /\d{4}-\d{2}-\d{2},\s*\S/.test(firstMeta.textContent.trim()) : false,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    expect(metrics.headingCount).toBeGreaterThanOrEqual(2);
    expect(metrics.metaCount).toBeGreaterThanOrEqual(2);
    expect(metrics.allHaveIds).toBe(true);
    expect(metrics.firstInToc).toBe(true);
    expect(metrics.hasDatetime).toBe(true);
    expect(metrics.tagCount).toBeGreaterThanOrEqual(1);
    expect(metrics.sepFontZero).toBe(true);
    expect(metrics.textSeparated).toBe(true);
    expect(metrics.overflowX).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    const narrowOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(narrowOverflow).toBe(false);
  });
}

test('update metadata stays legible in dark-mode print and forced colors', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem('td-preset', 'paper');
    localStorage.setItem('td-color-theme', 'dark');
  });
  await page.goto('/docs/components/update/');
  await page.emulateMedia({ media: 'print' });

  const printInfo = await page.evaluate(() => {
    const heading = document.querySelector('.td-content h2.update, .td-content h3.update');
    const meta = document.querySelector('.td-content .td-update-meta');
    const tag = meta ? meta.querySelector('.td-update-tag') : null;
    return {
      headingFound: Boolean(heading),
      headingBorderBottom: heading ? getComputedStyle(heading).borderBottomWidth : null,
      metaVisible: Boolean(meta && getComputedStyle(meta).display !== 'none'),
      tagBorder: tag ? getComputedStyle(tag).borderTopStyle : null,
    };
  });
  expect(printInfo.headingFound).toBe(true);
  expect(printInfo.metaVisible).toBe(true);
  expect(printInfo.headingBorderBottom).toBe('0px');
  expect(printInfo.tagBorder).toBe('solid');

  await page.emulateMedia({ media: 'screen', forcedColors: 'active' });
  const forcedTag = await page.evaluate(() => {
    const tag = document.querySelector('.td-content .td-update-tag');
    return tag ? getComputedStyle(tag).borderTopStyle : null;
  });
  expect(forcedTag).toBe('solid');
});
