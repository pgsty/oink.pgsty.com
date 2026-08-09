import { expect, test } from '@playwright/test';

const docPath = '/docs/oink/configuration/';
const widths = [360, 768, 820, 1024, 1200, 1440];

async function openCleanPage(page, path = docPath) {
  await page.addInitScript(() => {
    localStorage.removeItem('td-shell-sidebar-collapsed');
    localStorage.removeItem('td-shell-sidebar-w');
    localStorage.removeItem('td-shell-toc-collapsed');
  });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

for (const width of widths) {
  test(`${width}px keeps a reachable action surface`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openCleanPage(page);

    await expect(page.locator('.td-page-context')).toBeVisible();
    const toc = page.locator('.td-shell-toc__panel');
    const utilities = page.locator('.td-shell-sidebar__mobile-utils');

    if (width < 768) {
      await expect(page.locator('.td-shell-subnav')).toBeVisible();
      await page.locator('[data-td-shell-drawer-open]:visible').click();
      await expect(page.locator('html')).toHaveAttribute(
        'data-td-shell-drawer',
        'open',
      );
      await expect(utilities).toBeInViewport();
      await expect(toc).toBeHidden();
    } else if (width < 1200) {
      await expect(page.locator('.td-shell-subnav')).toBeHidden();
      await expect(page.locator('.td-shell-sidebar__panel')).toBeVisible();
      await expect(utilities).toBeVisible();
      await expect(toc).toBeHidden();
    } else {
      await expect(utilities).toBeHidden();
      await expect(toc).toBeVisible();
    }

    if (width < 1200) {
      await expect(utilities.locator('.td-language-selector')).toBeVisible();
      await expect(utilities.locator('[data-td-theme-toggle]')).toBeVisible();
      await expect(utilities.locator('a[aria-label="GitHub"]')).toBeVisible();
    } else {
      await expect(toc.locator('.td-shell-language-selector')).toBeVisible();
      await expect(toc.locator('[data-td-theme-toggle]')).toBeVisible();
      await expect(toc.locator('a[aria-label="GitHub"]')).toBeVisible();
    }
  });
}

test('page context menu is complete and keyboard operable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openCleanPage(page);

  const context = page.locator('.td-page-context');
  const toggle = context.locator('[data-td-page-context-toggle]');
  const menu = context.getByRole('menu');
  await toggle.focus();
  await toggle.press('ArrowDown');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu).toBeVisible();

  const items = menu.getByRole('menuitem');
  await expect(items.first()).toBeFocused();
  await expect(menu).toContainText('Copy as Markdown');
  await expect(menu).toContainText('View Markdown');
  await expect(menu).toContainText('Edit this page');
  await expect(menu).toContainText('Create documentation issue');
  await expect(menu).toContainText('Print this page');

  await items.first().press('ArrowDown');
  await expect(items.nth(1)).toBeFocused();
  await items.nth(1).press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('sidebar sections use a semantic keyboard toggle', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openCleanPage(page);

  const toggle = page.locator('[data-td-shell-tree-toggle]:visible').first();
  const before = await toggle.getAttribute('aria-expanded');
  const beforeLabel = await toggle.getAttribute('aria-label');
  const targetId = await toggle.getAttribute('aria-controls');
  expect(targetId).toBeTruthy();

  await toggle.focus();
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute(
    'aria-expanded',
    before === 'true' ? 'false' : 'true',
  );
  await expect(toggle).not.toHaveAttribute('aria-label', beforeLabel || '');
  await expect(page.locator(`#${targetId}`)).toHaveClass(
    before === 'true' ? /^(?!.*\bis-open\b)/ : /\bis-open\b/,
  );
});

for (const [locale, path, query] of [
  ['en', docPath, 'OINK'],
  ['zh', '/zh/docs/oink/configuration/', '配置'],
]) {
  test(`${locale} search exposes listbox state and respects the result cap`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await openCleanPage(page, path);

    await page.locator('[data-td-shell-search-open]:visible').first().click();
    const input = page.locator('.td-shell-search__input');
    await expect(input).toHaveAttribute('role', 'combobox');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await input.fill(query);

    const options = page.locator('#td-shell-search-results [role="option"]');
    await expect(options.first()).toBeVisible();
    expect(await options.count()).toBeLessThanOrEqual(10);

    const activeId = await input.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    await expect(page.locator(`#${activeId}`)).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('[data-td-shell-search-status]')).not.toBeEmpty();
  });
}

test('print media produces a clean document surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCleanPage(page, '/docs/oink/local-first/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.td-page-context')).toBeHidden();
  await expect(page.locator('.td-shell-sidebar')).toBeHidden();
  await expect(page.locator('.td-shell-toc')).toBeHidden();

  await expect(page.locator('.td-shell-article')).toHaveCSS(
    'padding-top',
    '0px',
  );
  await expect(page.locator('.td-content pre').first()).toHaveCSS(
    'white-space',
    'pre-wrap',
  );
  await expect(page.locator('.td-content table').first()).toHaveCSS(
    'display',
    'table',
  );
  await expect(page.locator('.td-content h2').first()).toHaveCSS(
    'break-after',
    'avoid-page',
  );
});
