import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const docsPath = '/docs/content/configuration/';
const zhDocsPath = '/zh/docs/content/configuration/';

async function openPalette(page, path = docsPath, viewport = null) {
  if (viewport) await page.setViewportSize(viewport);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-td-shell-search-open]:visible').first().click();
  const dialog = page.locator('#td-shell-search');
  const input = dialog.locator('.td-shell-search__input');
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  return { dialog, input };
}

function group(dialog, label) {
  return dialog.getByRole('group', { name: label, exact: true });
}

async function fillCommandAndWait(
  input,
  dialog,
  value,
  optionText,
  actionsLabel = /^(Actions|操作)$/,
) {
  await input.fill(value);
  const actions = dialog.getByRole('group', { name: actionsLabel });
  await expect(actions).toBeVisible();
  await expect(
    dialog.getByRole('group', { name: /^(Quick links|快速链接)$/ }),
  ).toHaveCount(0);
  const option = actions
    .getByRole('option', {
      name: new RegExp(optionText, 'i'),
    })
    .first();
  await expect(option).toBeVisible();
  return option;
}

test('empty Palette exposes shared quick links, page actions, and preferences', async ({
  page,
}) => {
  const { dialog, input } = await openPalette(page);
  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAttribute('aria-expanded', 'true');

  const quick = group(dialog, 'Quick links');
  await expect(quick).toContainText('Docs');
  await expect(quick).toContainText('Blog');
  await expect(quick).toContainText('Project');
  const actions = group(dialog, 'Page actions');
  await expect(actions).toContainText('Copy Markdown');
  await expect(actions).toContainText('View Markdown');
  await expect(actions).toContainText('Edit this page');
  await expect(actions).toContainText('Create docs issue');
  await expect(actions).toContainText('Print this page');
  const preferences = group(dialog, 'Preferences');
  await expect(preferences).toContainText('Toggle color theme');
  await expect(preferences).toContainText('Switch language');
  await expect(preferences).toContainText('v0.2.0');
  const commands = group(dialog, 'Commands');
  await expect(commands).toContainText('OINK issues');
  await expect(commands).toContainText('Copy page Markdown');

  const rows = dialog.locator('[role="option"]');
  const activeId = await input.getAttribute('aria-activedescendant');
  expect(activeId).toBeTruthy();
  await expect(page.locator(`#${activeId}`)).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(rows.first()).not.toHaveAttribute('tabindex', '0');
});

test('ordinary EN/ZH queries group pages and actions without external requests', async ({
  page,
}) => {
  for (const [path, query, expected, groupLabel] of [
    [docsPath, 'config', 'Configuration', 'Docs'],
    [zhDocsPath, '配置', '配置', '文档'],
  ]) {
    await page.route('https://giscus.app/**', (route) => route.abort());
    const indexRequests = [];
    page.on('request', (request) => {
      if (request.url().includes('offline-search-index')) {
        indexRequests.push(request.url());
      }
    });
    const { dialog, input } = await openPalette(page, path);
    const pages = group(dialog, groupLabel);
    await input.fill(query);
    await expect(pages).toContainText(expected);
    expect(indexRequests).toHaveLength(1);
    expect(new URL(indexRequests[0]).origin).toBe(new URL(page.url()).origin);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});

test('command mode is index-free and localizes configured commands', async ({
  page,
}) => {
  const indexRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('offline-search-index')) {
      indexRequests.push(request.url());
    }
  });
  const { dialog, input } = await openPalette(page, zhDocsPath);
  expect(indexRequests).toEqual([]);
  await fillCommandAndWait(input, dialog, '> 深色', '选择颜色主题');
  await expect(dialog.locator('[role="option"]')).toHaveCount(1);
  await expect(dialog.locator('[role="option"]')).toContainText('选择颜色主题');
  expect(indexRequests).toEqual([]);

  await fillCommandAndWait(input, dialog, '> OINK 问题', 'OINK 问题反馈');
  await expect(dialog.locator('[role="option"]')).toContainText(
    'OINK 问题反馈',
  );
  expect(indexRequests).toEqual([]);
});

test('choice aliases reuse theme, language, and version actions', async ({
  page,
}) => {
  const { dialog, input } = await openPalette(page);
  await fillCommandAndWait(
    input,
    dialog,
    '> choose theme',
    'Choose color theme',
  );
  await page.keyboard.press('Enter');
  await expect(dialog.locator('.td-shell-search__group-label')).toHaveText(
    'Choose an option',
  );
  await expect(dialog.locator('[role="option"]')).toHaveCount(3);
  await expect(dialog).toContainText('Dark');
  await dialog.getByRole('option', { name: /^Dark$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await expect(dialog).toBeVisible();

  await fillCommandAndWait(
    input,
    dialog,
    '> switch language',
    'Switch language',
  );
  await page.keyboard.press('Enter');
  await expect(dialog).toContainText('English');
  await expect(dialog).toContainText('简体中文');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.keyboard.press(
    process.platform === 'darwin' ? 'Meta+k' : 'Control+k',
  );
  await fillCommandAndWait(input, dialog, '> version', 'v0.2.0');
  await page.keyboard.press('Enter');
  await expect(dialog).toContainText('v0.2.0');
});

test('Copy Markdown and Print execute once through the shared registry', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const { dialog, input } = await openPalette(page);
  await fillCommandAndWait(
    input,
    dialog,
    '> copy page markdown',
    'Copy page Markdown',
  );
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('# Configuration');

  const printOption = await fillCommandAndWait(
    input,
    dialog,
    '> print page',
    'Print this page',
  );
  await page.evaluate(() => {
    window.__printCalls = 0;
    window.print = () => {
      window.__printCalls += 1;
    };
  });
  await printOption.click();
  await expect.poll(() => page.evaluate(() => window.__printCalls)).toBe(1);
  await expect(dialog).not.toHaveClass(/is-open/);
});

test('URL actions match progressive-enhancement anchors', async ({ page }) => {
  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
  const manifest = await page
    .locator('#oink-action-manifest')
    .evaluate((node) => JSON.parse(node.textContent || '{}'));
  const action = (id) =>
    manifest.actions.find((candidate) => candidate.id === id);
  const controls = page.locator('[data-td-page-context]');
  for (const [id, selector] of [
    ['view_markdown', '[data-oink-action="view_markdown"]'],
    ['edit_page', '[data-oink-action="edit_page"]'],
    ['create_issue', '[data-oink-action="create_issue"]'],
  ]) {
    const descriptor = action(id);
    const anchor = controls.locator(selector);
    await expect(anchor).toHaveAttribute('href', descriptor.url);
    await expect(anchor).toHaveAttribute('target', '_blank');
    await expect(anchor).toHaveAttribute('rel', 'noopener');
  }

  await expect(page.locator('a[aria-label="GitHub"]').first()).toHaveAttribute(
    'href',
    action('open_github').url,
  );
});

test('mobile Palette restores focus and has no WCAG AA violations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/zh/', { waitUntil: 'domcontentloaded' });
  const menuToggle = page.locator('[data-menu-toggle]:visible');
  await menuToggle.click();
  await page.locator('[data-mobile-menu] [data-td-shell-search-open]').click();
  const dialog = page.locator('#td-shell-search');
  await expect(dialog).toBeVisible();
  await fillCommandAndWait(
    dialog.locator('.td-shell-search__input'),
    dialog,
    '> 打印',
    '打印当前页面',
    /^操作$/,
  );

  const { violations } = await new AxeBuilder({ page })
    .include('#td-shell-search')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(menuToggle).toBeFocused();
});
