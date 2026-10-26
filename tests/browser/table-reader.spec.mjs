import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const dialog = '[data-td-table-reader]';
const frameFor = (page, id) => page.locator(`#${id}`).locator('..').locator('..');
async function open(page, id = 'reader-main') {
  const frame = frameFor(page, id);
  await frame.scrollIntoViewIfNeeded();
  await frame.hover();
  await frame.locator('.td-table-expand').click();
  await expect(page.locator(`${dialog}[open] #${id}`)).toBeVisible();
}
async function closed(page, id = 'reader-main') {
  await expect(page.locator(`${dialog}[open]`)).toHaveCount(0);
  await expect(page.locator(`[data-td-table-expand] > .td-table-scroll > #${id}`)).toBeVisible();
}
async function geometry(page) {
  return page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
}

for (const locale of ['', '/zh']) {
  const path = `${locale}/tests/table-reader/`;
  const label = locale ? '展开表格' : 'Expand table';

  test(`${locale || 'en'}: opt-in, corner reveal, original nodes, scroll and keyboard restoration`, async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const frame = frameFor(page, 'reader-main');
    const button = frame.getByRole('button', { name: label });
    const titleGeometry = await frame.evaluate(el => {
      const caption = el.querySelector('caption');
      const header = el.querySelector('thead th');
      const textBox = node => {
        const range = document.createRange(); range.selectNodeContents(node);
        return range.getBoundingClientRect();
      };
      return {
        inset: textBox(caption).x - caption.getBoundingClientRect().x,
        alignment: textBox(caption).x - textBox(header).x,
        top: textBox(caption).y - caption.getBoundingClientRect().y,
      };
    });
    expect(titleGeometry.inset).toBeGreaterThanOrEqual(8);
    expect(titleGeometry.top).toBeGreaterThanOrEqual(8);
    expect(Math.abs(titleGeometry.alignment)).toBeLessThanOrEqual(1);
    await expect(page.locator('#reader-plain').locator('..').locator('..').locator(':scope > .td-table-expand')).toHaveCount(0);
    await expect(frameFor(page, 'reader-reference').locator('.td-table-expand')).toHaveCount(0);
    await frame.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await expect(button).toHaveCSS('opacity', '0');
    await frame.hover();
    await expect(button).toHaveCSS('opacity', '1');
    await page.mouse.move(0, 0);
    await button.focus();
    await expect(button).toHaveCSS('opacity', '1');
    // Focus can start Bootstrap's smooth page scroll. The reader saves the
    // position at activation, which may differ from the earlier focus call.
    await button.evaluate(el => el.addEventListener('click', () => {
      window.__readerOpenY = scrollY;
    }, { capture: true }));
    const original = await page.locator('#reader-main').evaluate(el => {
      window.__readerTable = el;
      el.parentElement.scrollLeft = 140;
      return {
        left: el.parentElement.scrollLeft,
        font: getComputedStyle(el.querySelector('td')).fontSize,
        code: getComputedStyle(el.querySelector('code')).fontSize,
        count: document.querySelectorAll('#table-cell-anchor').length,
      };
    });
    for (const key of ['Enter', 'Space']) {
      await button.focus();
      await page.keyboard.press(key);
      await expect(page.locator(`${dialog}[open]`)).toBeVisible();
      await expect(page.locator('#td-table-reader-title')).toBeFocused();
      await expect(page.locator(`${dialog} table`)).toHaveCount(1);
      expect(await page.locator('#reader-main').evaluate(el => el === window.__readerTable)).toBe(true);
      await expect(page.locator('#reader-main td').first()).toHaveCSS('font-size', original.font);
      await expect(page.locator('#reader-main code').first()).toHaveCSS('font-size', original.code);
      await expect(page.locator('#table-cell-anchor')).toHaveCount(original.count);
      await page.keyboard.press('Shift+Tab');
      expect(await page.evaluate(() => document.querySelector('[data-td-table-reader]').contains(document.activeElement))).toBe(true);
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-td-table-close]')).toBeFocused();
      await page.locator(`${dialog} .td-table-scroll`).evaluate(el => { el.scrollTop = 300; el.scrollLeft = 300; });
      await page.keyboard.press('Escape');
      await closed(page);
      await expect(button).toBeFocused();
      const restored = await page.locator('#reader-main').evaluate(el => ({ left: el.parentElement.scrollLeft, y: scrollY, same: el === window.__readerTable }));
      expect(restored).toEqual({ left: original.left, y: await page.evaluate(() => window.__readerOpenY), same: true });
    }
  });

  test(`${locale || 'en'}: native links, selection, numbered caption and independent modifiers`, async ({ page }) => {
    await page.goto(path);
    await open(page);
    const selection = await page.locator('#reader-main tbody td').first().evaluate(el => {
      const range = document.createRange(); range.selectNodeContents(el);
      getSelection().removeAllRanges(); getSelection().addRange(range);
      return getSelection().toString();
    });
    expect(selection).toBe('pgvector');
    await page.locator(`${dialog} a[href$="#table-cell-anchor"]`).click();
    await expect(page.locator(`${dialog}[open]`)).toBeVisible();
    await page.locator(`${dialog} a[href$="#after-tables"]`).click();
    await closed(page);
    await expect(page).toHaveURL(/#after-tables$/);
    await expect(page.locator('#after-tables')).toBeInViewport();
    const numberedButton = page.locator('#reader-book .td-table-expand');
    await numberedButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#td-table-reader-title')).toContainText('8-1');
    await expect(page.locator('#td-table-reader-title')).toContainText('Numbered packages');
    await expect(page.locator(`${dialog} table`)).toHaveAttribute('aria-labelledby', 'td-table-reader-title');
    await page.locator('[data-td-table-close]').click();
    await expect(page.locator('#reader-book table')).not.toHaveAttribute('aria-labelledby');
    for (const id of ['reader-only', 'reader-matrix']) {
      await open(page, id);
      if (id === 'reader-matrix') await expect(page.locator(`${dialog} th[scope="row"]`)).toHaveCount(1);
      await page.keyboard.press('Escape');
      await closed(page, id);
    }
    await page.getByRole('tab', { name: 'Details', exact: true }).click();
    await open(page, 'reader-tab');
    await page.keyboard.press('Escape');
    await closed(page, 'reader-tab');
    await page.locator('#reader-details > summary').click();
    await open(page, 'reader-disclosed');
    await page.keyboard.press('Escape');
    await closed(page, 'reader-disclosed');
  });

  test(`${locale || 'en'}: print restores synchronously, stale events and coordinated close preserve state`, async ({ page }) => {
    await page.goto(path);
    await open(page);
    const immediate = await page.evaluate(() => {
      window.dispatchEvent(new Event('beforeprint'));
      return document.querySelector('[data-td-table-expand] > .td-table-scroll > #reader-main') !== null;
    });
    expect(immediate).toBe(true);
    await closed(page);
    await page.emulateMedia({ media: 'print' });
    await expect(frameFor(page, 'reader-main').locator('.td-table-expand')).toBeHidden();
    await expect(page.locator('#reader-main').locator('..')).toHaveCSS('overflow-x', 'visible');
    await page.emulateMedia({ media: 'screen' });
    // A close event from the prior session must not close a newly opened table.
    await page.evaluate(() => {
      document.querySelector('#reader-main').closest('.td-table-frame').querySelector('button').click();
      document.querySelector('[data-td-table-close]').click();
      document.querySelector('#reader-only').closest('.td-table-frame').querySelector('button').click();
    });
    await expect(page.locator(`${dialog}[open] #reader-only`)).toBeVisible();
    await page.evaluate(() => {
      window.OinkSurfaceCoordinator.closeOthers('test-surface');
      document.querySelector('#td-main-content').focus({ preventScroll: true });
    });
    await closed(page, 'reader-only');
    await expect(page.locator('#td-main-content')).toBeFocused();
    await page.goto(`${locale}/_print/tests/table-reader/`);
    await expect(page.locator('.td-table-expand')).toHaveCount(0);
    await expect(page.locator(dialog)).toHaveCount(0);
    await expect(page.locator('#reader-main tbody tr')).toHaveCount(30);
  });

  for (const width of [390, 1440]) {
    test(`${locale || 'en'}: ${width}px preset compatibility and accessible dialog`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
        for (const color of ['light', 'dark']) {
          await page.evaluate(({ preset, color }) => {
            document.documentElement.dataset.tdPreset = preset;
            document.documentElement.dataset.bsTheme = color;
          }, { preset, color });
          await open(page);
          const { width: w, scroll } = await geometry(page);
          expect(scroll, `${preset}/${color} page width`).toBeLessThanOrEqual(w);
          const rect = await page.locator(dialog).boundingBox();
          expect(rect.width).toBeLessThanOrEqual(width);
          expect(rect.height).toBeLessThanOrEqual(900);
          await expect(page.locator('[data-td-table-close]')).toBeInViewport();
          if (preset === 'paper') {
            const result = await new AxeBuilder({ page }).include(dialog).analyze();
            expect(result.violations).toEqual([]);
          }
          await page.keyboard.press('Escape');
          await closed(page);
        }
      }
    });
  }
}

test('touch entry is visible and usable without hover', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/zh/tests/table-reader/');
  const button = frameFor(page, 'reader-main').locator('.td-table-expand');
  await expect(button).toHaveCSS('opacity', '1');
  const rect = await button.boundingBox();
  expect(rect.width).toBeGreaterThanOrEqual(44);
  expect(rect.height).toBeGreaterThanOrEqual(44);
  await button.tap();
  await expect(page.locator(`${dialog}[open]`)).toBeVisible();
  await page.locator('[data-td-table-close]').tap();
  await closed(page);
  await context.close();
});

for (const fallback of ['no-js', 'blocked', 'unsupported', 'failed-open']) {
  test(`${fallback} preserves complete inline content`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: fallback !== 'no-js' });
    const page = await context.newPage();
    if (fallback === 'blocked') await page.route('**/js/chunks/table-reader*.js', route => route.abort());
    if (fallback === 'unsupported') await page.addInitScript(() => { HTMLDialogElement.prototype.showModal = undefined; });
    if (fallback === 'failed-open') await page.addInitScript(() => { HTMLDialogElement.prototype.showModal = () => { throw new Error('Unavailable'); }; });
    await page.goto('/tests/table-reader/');
    if (fallback === 'failed-open') {
      await frameFor(page, 'reader-main').locator('button').focus();
      await page.keyboard.press('Enter');
    }
    await expect(frameFor(page, 'reader-main').locator('.td-table-expand')).toHaveCount(0);
    await expect(page.locator('#reader-main tbody tr')).toHaveCount(30);
    await expect(page.locator('#reader-main')).toBeVisible();
    await expect(page.locator(`${dialog}[open]`)).toHaveCount(0);
    await context.close();
  });
}
