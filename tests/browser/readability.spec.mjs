import { expect, test } from '@playwright/test';

async function clearPreferences(page) {
  await page.addInitScript(() => {
    localStorage.removeItem('td-shell-toc-collapsed');
    localStorage.removeItem('td-shell-sidebar-collapsed');
    localStorage.removeItem('td-blog-index');
    localStorage.removeItem('td-footer-collapsed');
  });
}

async function footerGeometry(page) {
  return page.evaluate(() => {
    const top = document.querySelector('[data-td-shell-footer]').getBoundingClientRect().top;
    const panel = document.querySelector('.td-shell-toc__panel');
    const visible = Math.max(0, innerHeight - top);
    const actual = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--td-shell-footer-offset'));
    return { top, bottom: panel.getBoundingClientRect().bottom,
      expected: visible > 0 ? visible + 1 : 0, actual, scrollY };
  });
}

async function expectFooterClearance(page) {
  await expect.poll(async () => {
    const geometry = await footerGeometry(page);
    return Math.abs(geometry.actual - geometry.expected);
  }).toBeLessThan(2);
  const geometry = await footerGeometry(page);
  expect(geometry.bottom).toBeLessThanOrEqual(Math.min(geometry.top, 900) + 2);
}

for (const locale of ['', '/zh']) {
  test(`${locale || 'en'}: Markmap follows restored and changed appearance, with dark print text`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-color-theme', 'dark');
      localStorage.setItem('td-preset', 'terminal');
    });
    await page.goto(`${locale}/docs/components/markmap/`);
    const label = page.locator('.td-content .markmap svg foreignObject div').first();
    await expect(label).toBeVisible();
    expect(await label.evaluate(el => getComputedStyle(el).color === getComputedStyle(el.closest('.td-content')).color)).toBe(true);
    for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
      for (const color of ['light', 'dark']) {
        await page.evaluate(({ preset, color }) => {
          // These are the public appearance attributes observed by CSS.
          document.documentElement.setAttribute('data-td-preset', preset);
          document.documentElement.setAttribute('data-bs-theme', color);
        }, { preset, color });
        await expect.poll(async () => label.evaluate(el => {
          const body = el.closest('.td-content');
          return getComputedStyle(el).color === getComputedStyle(body).color;
        })).toBe(true);
      }
    }
    await page.emulateMedia({ media: 'print' });
    await expect(label).toHaveCSS('color', 'rgb(51, 51, 51)');
  });

  test(`${locale || 'en'}: fixed TOC clears the footer and resets after blog reflow without scrolling`, async ({ page }) => {
    await clearPreferences(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${locale}/blog/`);
    const toggle = page.locator('[data-td-blog-index-toggle]');
    await toggle.click(); // cards -> table
    await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'table');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expectFooterClearance(page);
    expect((await footerGeometry(page)).actual).toBeGreaterThan(0);
    const before = await footerGeometry(page);
    // A normal click would scroll the offscreen control into view and mask
    // the bug. Invoke its real click handler while preserving the viewport.
    await toggle.evaluate(el => { el.click(); el.click(); }); // table -> gallery -> list
    await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'list');
    await expectFooterClearance(page);
    const after = await footerGeometry(page);
    expect(after.actual).toBe(0);
    expect(after.scrollY).toBe(before.scrollY);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expectFooterClearance(page);
    await page.locator('[data-td-footer-toggle]').evaluate(el => el.click());
    await expectFooterClearance(page);
  });

  for (const width of [1440, 390]) {
    test(`${locale || 'en'} ${width}: technical table opt-in preserves readable columns and local scrolling`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${locale}/tests/readable-tables/`);
      const table = page.locator('#wide-technical-table');
      const legacy = page.locator('#legacy-technical-table');
      await expect(table).toHaveClass('wide td-table--wide');
      await expect(legacy).toHaveClass('td-table--wide');
      await page.evaluate(() => document.fonts.ready);
      for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
        for (const color of ['light', 'dark']) {
          const layouts = await page.evaluate(({ preset, color }) => {
            document.documentElement.setAttribute('data-td-preset', preset);
            document.documentElement.setAttribute('data-bs-theme', color);
            return ['wide-technical-table', 'legacy-technical-table'].map(id => {
              const el = document.getElementById(id);
              return [...el.querySelectorAll('th, td')].map(cell => {
                const rect = cell.getBoundingClientRect();
                const style = getComputedStyle(cell);
                return { width: rect.width, height: rect.height,
                  wrap: style.overflowWrap, break: style.wordBreak,
                  maxWidth: style.maxWidth };
              });
            });
          }, { preset, color });
          expect(layouts[0], `${preset}/${color}: short and legacy markers must render alike`).toEqual(layouts[1]);
        }
      }
      const sizes = await table.evaluate(el => {
        const row = el.tBodies[0].rows[0];
        const wrapper = el.parentElement;
        return { description: row.cells[4].getBoundingClientRect().width,
          row: row.getBoundingClientRect().height, scrollable: wrapper.scrollWidth > wrapper.clientWidth,
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          wrap: getComputedStyle(row.cells[0]).overflowWrap };
      });
      expect(sizes.description).toBeGreaterThan(200);
      expect(sizes.row).toBeLessThan(250);
      expect(sizes.scrollable).toBe(true);
      expect(sizes.pageOverflow).toBeLessThanOrEqual(1);
      expect(sizes.wrap).toBe('break-word');
      const wrapper = table.locator('..');
      await wrapper.scrollIntoViewIfNeeded();
      await wrapper.focus();
      await expect(wrapper).toBeFocused();
      // Retry real keys while WebKit finishes its automatic focus scroll.
      await expect.poll(async () => {
        await page.keyboard.press('ArrowRight');
        return wrapper.evaluate(el => el.scrollLeft);
      }).toBeGreaterThan(0);
      const ordinary = page.locator('#ordinary-prose-table tbody td').first();
      await expect(ordinary).toHaveCSS('overflow-wrap', 'anywhere');
      await expect(page.locator('#wide-matrix-table')).toHaveClass(/td-table--matrix/);
      await expect(page.locator('#wide-matrix-table').locator('..')).toHaveClass(/td-table-scroll--full/);

      await page.emulateMedia({ media: 'print' });
      await expect(table.locator('tbody td').first()).toHaveCSS('max-width', 'none');
      await expect(legacy.locator('tbody td').first()).toHaveCSS('max-width', 'none');
      // Paper layout has its own minimum sheet width, independent of a
      // narrow screen viewport; print must expose the complete table.
      await expect(wrapper).toHaveCSS('overflow-x', 'visible');
      await page.emulateMedia({ media: 'screen' });
      await page.goto(`${locale}/_print/tests/readable-tables/`);
      for (const id of ['wide-technical-table', 'legacy-technical-table']) {
        await expect(page.locator(`#${id}`).locator('..')).toHaveClass(/td-table-scroll--static/);
        await expect(page.locator(`#${id} tbody td`).first()).toHaveCSS('overflow-wrap', 'anywhere');
      }
    });
  }
}

test('TOC without a sidebar clears the footer; flow and mobile keep their own layout', async ({ page }) => {
  await clearPreferences(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tests/footer-clearance/');
  await expect(page.locator('.td-shell-sidebar__panel')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expectFooterClearance(page);
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.locator('.td-shell-toc__panel')).toBeHidden();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tests/book-navigation/flow/');
  await expect(page.locator('.td-shell-toc__panel')).toHaveCSS('position', 'sticky');
  await expect(page.locator('.td-shell-toc__panel')).toHaveCSS('bottom', 'auto');
});
