import { expect, test } from '@playwright/test';

const docPath = '/docs/content/configuration/';
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

    const context = page.locator('[data-td-page-context]');
    const toc = page.locator('.td-shell-toc__panel');
    const utilities = page.locator('.td-shell-sidebar__utils');

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
      await expect(utilities).toBeVisible();
      await expect(toc).toBeVisible();
    }

    const actionsToggle = page.locator(
      '[aria-controls="td-shell-aside-actions"]:visible',
    );
    await expect(actionsToggle).toBeVisible();
    if ((await actionsToggle.getAttribute('aria-expanded')) === 'false') {
      await actionsToggle.click();
    }
    await expect(actionsToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(context).toBeVisible();

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

for (const [
  locale,
  path,
  docsLabel,
  docsHref,
  blogLabel,
  blogHref,
  projectLabel,
  projectHref,
] of [
  ['en', docPath, 'Docs', '/docs/', 'Blog', '/blog/', 'Project', '/project/'],
  [
    'zh',
    '/zh/docs/content/configuration/',
    '文档',
    '/zh/docs/',
    '博客',
    '/zh/blog/',
    '项目',
    '/zh/project/',
  ],
]) {
  test(`${locale} root switcher resolves docs, blog, and project sections`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await openCleanPage(page, path);

    const trigger = page.locator('.td-shell-root__trigger');
    await expect(trigger).toContainText(docsLabel);
    await trigger.click();

    const items = page.locator('.td-shell-root__item');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveAttribute('href', docsHref);
    await expect(items.nth(0).locator('.td-shell-root__item-title')).toHaveText(
      docsLabel,
    );
    await expect(items.nth(1)).toHaveAttribute('href', blogHref);
    await expect(items.nth(1).locator('.td-shell-root__item-title')).toHaveText(
      blogLabel,
    );
    await expect(items.nth(2)).toHaveAttribute('href', projectHref);
    await expect(items.nth(2).locator('.td-shell-root__item-title')).toHaveText(
      projectLabel,
    );
  });
}

test('desktop navbar keeps parent navigation separate from disclosure', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page, '/');

  const menu = page.locator('[data-td-navbar-menu]').filter({
    has: page.locator('[data-td-navbar-label="Docs"]'),
  });
  const parent = menu.locator('.nav-menu__parent-link');
  const toggle = menu.locator('[data-td-navbar-toggle]');
  const panel = menu.locator('[data-td-navbar-panel]');
  await expect(parent).toHaveAttribute('href', '/docs/');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();

  await parent.evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });
    link.click();
  });
  await expect(panel).toBeHidden();

  await toggle.focus();
  await toggle.press('ArrowDown');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(panel.locator('a').first()).toBeFocused();
  await expect(
    panel.locator('.td-navbar-entry__description').first(),
  ).toHaveText(/first documentation site/);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();

  const issues = page.locator(
    '[data-td-navbar-region="desktop"][data-td-navbar-label="Issues"]',
  );
  await expect(issues).toHaveAttribute(
    'href',
    'https://github.com/pgsty/oink/issues',
  );
  await expect(issues).toHaveAttribute('target', '_blank');
  await expect(issues).toHaveAttribute('rel', 'noopener noreferrer');
});

test('mobile navbar accordions allow multiple open parents', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openCleanPage(page, '/');
  await page.locator('[data-menu-toggle]').click();
  const drawer = page.locator('[data-mobile-menu]');
  await expect(drawer).toBeVisible();

  const sections = drawer.locator('[data-td-navbar-accordion]');
  await expect(sections).toHaveCount(2);
  const docs = sections.nth(0);
  const blog = sections.nth(1);
  await expect(docs.locator('.mobile-menu-parent-link')).toHaveAttribute(
    'href',
    '/docs/',
  );

  await docs.locator('[data-td-navbar-accordion-toggle]').click();
  await blog.locator('[data-td-navbar-accordion-toggle]').click();
  await expect(docs.locator('[data-td-navbar-accordion-panel]')).toBeVisible();
  await expect(blog.locator('[data-td-navbar-accordion-panel]')).toBeVisible();
  await expect(
    docs.locator('[data-td-navbar-label="Tutorials"]'),
  ).toContainText('Tutorials');

  await expect(drawer.locator('[data-td-shell-search-open]')).toBeVisible();
  await expect(drawer.locator('[data-td-theme-toggle]')).toBeVisible();
  await expect(
    drawer.locator('.mobile-menu-chip[hreflang="zh-CN"]'),
  ).toBeVisible();
});

test('page actions are complete and keyboard operable', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openCleanPage(page);

  const actionsToggle = page.locator(
    '[aria-controls="td-shell-aside-actions"]:visible',
  );
  await actionsToggle.focus();
  await actionsToggle.press('Enter');
  await expect(actionsToggle).toHaveAttribute('aria-expanded', 'true');

  const context = page.locator('[data-td-page-context]');
  const actions = context.locator('.td-page-meta__action');
  await expect(context).toBeVisible();
  await expect(context).toContainText('Open in ChatGPT');
  await expect(context).toContainText('Open in Claude');
  await expect(context).toContainText('Copy Markdown');
  await expect(context).toContainText('View Markdown');
  await expect(context).toContainText('Edit this page');
  await expect(context).toContainText('Create docs issue');
  await expect(context).toContainText('Print this page');

  const chatgpt = context.locator('[data-td-page-open-in="chatgpt"]');
  const claude = context.locator('[data-td-page-open-in="claude"]');
  await expect(chatgpt).toHaveAttribute('target', '_blank');
  await expect(chatgpt).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(claude).toHaveAttribute('target', '_blank');
  await expect(claude).toHaveAttribute('rel', 'noopener noreferrer');

  await page.evaluate(() =>
    history.replaceState(null, '', '?mode=review#code-blocks'),
  );
  await chatgpt.evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });
    link.click();
  });
  await claude.evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });
    link.click();
  });

  const currentURL = page.url();
  const chatgptURL = new URL(await chatgpt.getAttribute('href'));
  const claudeURL = new URL(await claude.getAttribute('href'));
  expect(chatgptURL.origin).toBe('https://chatgpt.com');
  expect(chatgptURL.searchParams.get('hints')).toBe('search');
  expect(chatgptURL.searchParams.get('prompt')).toBe(
    `Read from ${currentURL} so I can ask questions about it.`,
  );
  expect(claudeURL.origin).toBe('https://claude.ai');
  expect(claudeURL.searchParams.get('q')).toBe(
    `Read from ${currentURL} so I can ask questions about it.`,
  );

  await actions.first().focus();
  await expect(actions.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(actions.nth(1)).toBeFocused();

  await actionsToggle.focus();
  await actionsToggle.press('Enter');
  await expect(actionsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(context).toBeHidden();
  await expect(actionsToggle).toBeFocused();
});

test('page actions localize AI labels and prompts', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openCleanPage(page, '/zh/docs/content/configuration/');

  const actionsToggle = page.locator(
    '[aria-controls="td-shell-aside-actions"]:visible',
  );
  await actionsToggle.click();

  const context = page.locator('[data-td-page-context]');
  await expect(context).toContainText('在 ChatGPT 中打开');
  await expect(context).toContainText('在 Claude 中打开');

  const prompt = new URL(
    await context
      .locator('[data-td-page-open-in="chatgpt"]')
      .getAttribute('href'),
  ).searchParams.get('prompt');
  expect(prompt).toBe(`请阅读 ${page.url()} 的内容，以便我就此向你提问。`);
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
  ['zh', '/zh/docs/content/configuration/', '配置'],
]) {
  test(`${locale} search exposes listbox state and keeps the page result cap`, async ({
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
    await expect(
      page.locator('#td-shell-search-results mark', { hasText: query }).first(),
    ).toBeVisible();
    await expect(options.first()).toBeVisible();
    const pageOptionCount = await page
      .locator('#td-shell-search-results [role="group"]')
      .evaluateAll((groups) =>
        groups.reduce((total, group) => {
          const labelId = group.getAttribute('aria-labelledby');
          return (
            total +
            (labelId === 'td-shell-search-group-actions'
              ? 0
              : group.querySelectorAll('[role="option"]').length)
          );
        }, 0),
      );
    expect(pageOptionCount).toBeLessThanOrEqual(10);

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
  await openCleanPage(page, '/docs/about/local-first/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('[data-td-page-context]')).toBeHidden();
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
