import { expect, test } from '@playwright/test';

async function commentBox(tree) {
  return tree.locator('.td-filetree__comment-text').first().evaluate(el => {
    const row = el.closest('.td-filetree__row');
    const range = document.createRange();
    range.selectNodeContents(el);
    const bounds = el.getBoundingClientRect();
    const rowBounds = row.getBoundingClientRect();
    return {
      rowHeight: row.getBoundingClientRect().height,
      box: bounds.toJSON(), row: rowBounds.toJSON(),
      fragments: [...range.getClientRects()].map(rect => rect.toJSON()),
      clipped: el.scrollWidth > el.clientWidth + 1,
      whiteSpace: getComputedStyle(el).whiteSpace,
      contained: [...range.getClientRects()].every(rect =>
        rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 &&
        // Font fallback may extend ink beyond its line box; it must stay in the row.
        rect.top >= rowBounds.top - 1 && rect.bottom <= rowBounds.bottom + 1),
    };
  });
}

for (const locale of ['', '/zh']) {
  for (const width of [1440, 768, 390]) {
    for (const mode of ['light', 'dark']) {
      test(`${locale || 'en'} ${width} ${mode}: FileTree wrap is opt-in and stays within its columns`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.addInitScript(mode => {
          localStorage.setItem('td-color-theme', mode);
          localStorage.setItem('td-preset', mode === 'dark' ? 'terminal' : 'paper');
        }, mode);
        await page.goto(`${locale}/tests/filetree-wrap/`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(() => document.fonts.ready);
        const regular = page.locator('[data-case="default"]');
        const compact = page.locator('[data-case="false"]');
        const wrapped = page.locator('[data-case="true"]');
        await expect(regular).not.toHaveClass(/td-filetree--wrap/);
        await expect(compact).not.toHaveClass(/td-filetree--wrap/);
        await expect(wrapped).toHaveClass(/td-filetree--wrap/);
        const before = await commentBox(regular);
        expect((await commentBox(compact)).rowHeight).toBeCloseTo(before.rowHeight, 0);
        expect(await commentBox(wrapped)).toEqual(expect.objectContaining({ contained: true }));
        for (const tree of [regular, compact, wrapped]) {
          const name = tree.locator('.td-filetree__name').filter({ hasText: 'a-deliberately-long-runbook-filename' });
          await expect(name).toHaveCSS('text-overflow', 'ellipsis');
          await expect(name).toHaveCSS('white-space', 'nowrap');
        }
        const divider = wrapped.locator('[data-td-filetree-divider]');
        if (width >= 576) {
          expect(before.whiteSpace).toBe('nowrap');
          expect(before.clipped).toBe(true);
          expect((await commentBox(wrapped)).rowHeight).toBeGreaterThan(before.rowHeight);
          await divider.focus();
          await page.keyboard.press('Home');
          await expect(divider).toHaveAttribute('aria-valuenow', '50');
          const atHalf = await commentBox(wrapped);
          await page.keyboard.press('End');
          await expect(divider).toHaveAttribute('aria-valuenow', '70');
          const atNarrow = await commentBox(wrapped);
          expect(atNarrow.contained).toBe(true);
          expect(atNarrow.rowHeight).toBeGreaterThanOrEqual(atHalf.rowHeight);
          const token = wrapped.locator('.td-filetree__comment-text').nth(1);
          expect(await token.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
          await divider.scrollIntoViewIfNeeded();
          const handle = await divider.boundingBox();
          await page.mouse.move(handle.x + handle.width / 2, handle.y + 12);
          await page.mouse.down();
          await page.mouse.move(handle.x - 40, handle.y + 12, { steps: 4 });
          await page.mouse.up();
          expect(Number(await divider.getAttribute('aria-valuenow'))).toBeLessThan(70);
          expect(await commentBox(wrapped)).toEqual(expect.objectContaining({ contained: true }));
        } else {
          await expect(divider).toBeHidden();
          expect(before.whiteSpace).toBe('normal');
          expect(before.contained).toBe(true);
        }
        const archive = wrapped.locator('details').filter({ has: page.locator('summary .td-filetree__name', { hasText: 'archive/' }) }).last();
        await expect(archive).not.toHaveAttribute('open');
        await archive.locator(':scope > summary').click();
        await expect(archive).toHaveAttribute('open', '');
        await expect(archive.locator('ul')).toBeVisible();
        await expect(page.locator('[data-case="plain"] [data-td-filetree-divider]')).toHaveCount(0);
        await expect(page.locator('[data-case="plain"]')).not.toHaveAttribute('data-td-filetree');
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      });
    }
  }

  test(`${locale || 'en'}: wrapped FileTree works in tabs and all Print trees expand`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${locale}/tests/filetree-wrap/`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('tab', { name: 'Wrapped', exact: true }).click();
    await expect(page.locator('[data-case="tabbed"]')).toBeVisible();
    expect((await commentBox(page.locator('[data-case="tabbed"]'))).contained).toBe(true);
    await page.goto(`${locale}/_print/tests/filetree-wrap/`);
    await expect(page.locator('.td-filetree details')).toHaveCount(0);
    await expect(page.locator('[data-td-filetree-divider]')).toHaveCount(0);
    await page.emulateMedia({ media: 'print' });
    for (const key of ['default', 'false', 'true', 'tabbed']) {
      const tree = page.locator(`[data-case="${key}"]`);
      expect((await commentBox(tree)).whiteSpace).toBe('normal');
      expect((await commentBox(tree)).contained).toBe(true);
    }
  });

  test(`${locale || 'en'}: wrap and directory disclosure work without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1024, height: 900 } });
    const page = await context.newPage();
    try {
      await page.goto(`${test.info().project.use.baseURL || 'http://127.0.0.1:4173'}${locale}/tests/filetree-wrap/`);
      const tree = page.locator('[data-case="true"]');
      expect((await commentBox(tree)).contained).toBe(true);
      const directory = tree.locator('details').first();
      await directory.locator(':scope > summary').click();
      await expect(directory).not.toHaveAttribute('open');
      await directory.locator(':scope > summary').click();
      await expect(directory).toHaveAttribute('open', '');
    } finally {
      await context.close();
    }
  });
}
