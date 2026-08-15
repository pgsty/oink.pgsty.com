import { expect, test } from '@playwright/test';

const docPath = '/docs/configure/overview/';
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
    const subnav = page.locator('.td-shell-subnav');
    const utilityDock = page.locator('.td-shell-sidebar__footer');

    await expect(page.locator('.landing-header')).toHaveCount(0);

    if (width < 768) {
      await expect(subnav).toBeVisible();
      await page.locator('[data-td-shell-drawer-open]:visible').click();
      await expect(page.locator('html')).toHaveAttribute(
        'data-td-shell-drawer',
        'open',
      );
      await expect(page.locator('.td-shell-sidebar__panel')).toBeInViewport();
      await expect(toc).toBeHidden();
      await expect(utilityDock.locator('.td-language-selector')).toBeVisible();
      await expect(utilityDock.locator('.td-shell-keyboard')).toBeVisible();
      await expect(utilityDock.locator('[data-td-theme-toggle]')).toBeVisible();
      await expect(utilityDock.locator('a[aria-label="GitHub"]')).toBeVisible();
      await page.locator('button[data-td-shell-drawer-close]:visible').click();
      await expect(page.locator('html')).not.toHaveAttribute(
        'data-td-shell-drawer',
        'open',
      );
    } else if (width < 1200) {
      await expect(subnav).toBeHidden();
      await expect(page.locator('.td-shell-sidebar__panel')).toBeVisible();
      await expect(toc).toBeHidden();
    } else {
      await expect(subnav).toBeHidden();
      await expect(toc).toBeVisible();
    }

    if (width >= 768) {
      await expect(utilityDock.locator('.td-language-selector')).toBeVisible();
      await expect(utilityDock.locator('.td-shell-keyboard')).toBeVisible();
      await expect(utilityDock.locator('[data-td-theme-toggle]')).toBeVisible();
      await expect(utilityDock.locator('a[aria-label="GitHub"]')).toBeVisible();
    }

    const actionsToggle = page.locator('[data-td-page-actions-toggle]:visible');
    await expect(actionsToggle).toBeVisible();
    if ((await actionsToggle.getAttribute('aria-expanded')) === 'false') {
      await actionsToggle.click();
    }
    await expect(actionsToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(context.locator('[data-td-page-actions-menu]')).toBeVisible();
  });
}

for (const [locale, path, docsLabel, docsHref, blogHref] of [
  ['en', docPath, 'Docs', '/docs/', '/blog/'],
  ['zh', '/zh/docs/configure/overview/', '文档', '/zh/docs/', '/zh/blog/'],
]) {
  test(`${locale} root switcher keeps the active docs and blog roots`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await openCleanPage(page, path);

    const trigger = page.locator('.td-shell-root__trigger');
    await expect(trigger).toContainText(docsLabel);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page.locator(`.td-shell-root__item[href="${docsHref}"]`),
    ).toHaveClass(/is-active/);
    await expect(
      page.locator(`.td-shell-root__item[href="${blogHref}"]`),
    ).toHaveCount(1);
  });
}

test('desktop navbar opens a parent panel on focus without replacing its link', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page, '/');

  const menu = page.locator('[data-td-navbar-menu]').filter({
    has: page.locator('[data-td-navbar-label="Docs"]'),
  });
  const parent = menu.locator('.nav-menu__parent-link');
  const panel = menu.locator('[data-td-navbar-panel]');
  await expect(parent).toHaveAttribute('href', '/docs/');
  await expect(parent).toHaveAttribute('aria-expanded', 'false');
  await expect(parent).toHaveAttribute(
    'aria-controls',
    await panel.getAttribute('id'),
  );
  await expect(panel).toBeHidden();

  await parent.focus();
  await expect(parent).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await parent.press('ArrowDown');
  await expect(panel.locator('a').first()).toBeFocused();
  await expect(
    panel.locator('.td-navbar-entry__description').first(),
  ).toHaveText(/first documentation site/);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(parent).toBeFocused();

  const github = page.locator('.nav-github[aria-label="GitHub"]');
  await expect(github).toHaveAttribute('href', 'https://github.com/pgsty/oink');
  await expect(github).toHaveAttribute('target', '_blank');
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer');
});

test('compact navbar keeps the same named root links without a second menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openCleanPage(page, '/');
  await expect(page.locator('[data-mobile-menu]')).toHaveCount(0);
  await expect(page.locator('[data-menu-toggle]')).toHaveCount(0);

  for (const [label, href] of [
    ['Docs', '/docs/'],
    ['Blog', '/blog/'],
  ]) {
    const link = page
      .locator(
        `[data-td-navbar-region="desktop"][data-td-navbar-label="${label}"]`,
      )
      .first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('aria-label', label);
    await expect(link).toHaveAttribute('href', href);
  }
  await expect(page.locator('[data-td-navbar-region="mobile"]')).toHaveCount(0);
  await expect(
    page.locator('[data-td-shell-search-open]:visible'),
  ).toBeVisible();
  await expect(
    page.locator('.nav-util-zone [data-td-theme-toggle]'),
  ).toBeHidden();
  await expect(
    page.locator('.nav-util-zone [hreflang="zh-CN"]').first(),
  ).toBeHidden();
  await expect(page.locator('.nav-util-zone .nav-github')).toBeHidden();

  const [bar, menu] = await Promise.all([
    page.locator('.landing-nav').boundingBox(),
    page.locator('.nav-menu-zone').boundingBox(),
  ]);
  expect(bar).not.toBeNull();
  expect(menu).not.toBeNull();
  expect(
    Math.abs(menu.x + menu.width / 2 - (bar.x + bar.width / 2)),
  ).toBeLessThanOrEqual(1);
});

test('desktop and mobile search actions immediately precede their navigation controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page);

  const desktopSearch = page.locator(
    '.td-shell-sidebar__brand-row > [data-td-shell-search-open]',
  );
  await expect(desktopSearch).toBeVisible();
  expect(
    await desktopSearch.evaluate((button) =>
      button.nextElementSibling?.matches('[data-td-shell-sidebar-toggle]'),
    ),
  ).toBe(true);
  await desktopSearch.click();
  await expect(page.locator('#td-shell-search')).toBeVisible();
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const mobileSearch = page.locator(
    '.td-shell-subnav__actions > [data-td-shell-search-open]',
  );
  await expect(mobileSearch).toBeVisible();
  expect(
    await mobileSearch.evaluate((button) =>
      button.nextElementSibling?.matches('[data-td-shell-drawer-open]'),
    ),
  ).toBe(true);
  await mobileSearch.click();
  await expect(page.locator('#td-shell-search')).toBeVisible();
});

test('shortcut help uses KBD keycaps on desktop and in the mobile drawer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page);
  const trigger = page.locator('.td-shell-keyboard__trigger');
  const help = page.locator('.td-shell-keyboard-help');
  await trigger.hover();
  await expect(help).toBeVisible();
  await expect(help.locator('.td-kbd-sequence kbd')).not.toHaveCount(0);
  await expect(help.locator('pre, code')).toHaveCount(0);
  expect(
    await trigger.evaluate((button) =>
      button
        .closest('.td-shell-keyboard')
        ?.nextElementSibling?.classList.contains('td-shell-sidebar__theme'),
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-td-shell-drawer-open]:visible').click();
  await page
    .locator('.td-shell-keyboard__trigger')
    .evaluate((button) => button.click());
  await expect(page.locator('.td-shell-keyboard-help')).toBeVisible();
});

test('page actions are complete and keyboard operable', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openCleanPage(page);

  const actionsToggle = page.locator('[data-td-page-actions-toggle]:visible');
  await actionsToggle.focus();
  await actionsToggle.press('Enter');
  await expect(actionsToggle).toHaveAttribute('aria-expanded', 'true');

  const context = page.locator('[data-td-page-context]');
  const menu = context.locator('[data-td-page-actions-menu]');
  const actions = menu.locator('.td-page-actions__item');
  await expect(context).toBeVisible();
  await expect(context).toContainText('Open in ChatGPT');
  await expect(context).toContainText('Open in Claude');
  await expect(context).toContainText('Copy Markdown');
  await expect(context).toContainText('View markdown');
  await expect(context).toContainText('View edit history');
  await expect(context).toContainText('Edit this page');
  await expect(context).toContainText('Create docs issue');
  await expect(context).toContainText('Create child page');
  await expect(context).toContainText('Create project issue');
  await expect(context).toContainText('Print entire section');

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

  await actionsToggle.click();
  await expect(menu).toBeVisible();
  await actions.first().focus();
  await expect(actions.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(actions.nth(1)).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(actionsToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeHidden();
  await expect(actionsToggle).toBeFocused();
});

test('page actions localize AI labels and prompts', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await openCleanPage(page, '/zh/docs/configure/overview/');

  const actionsToggle = page.locator('[data-td-page-actions-toggle]:visible');
  await actionsToggle.click();

  const context = page.locator('[data-td-page-context]');
  await expect(context).toContainText('在 ChatGPT 中打开');
  await expect(context).toContainText('在 Claude 中打开');
  await expect(context).toContainText('复制 Markdown 文本');
  await expect(context).toContainText('查阅 Markdown 源码');
  await expect(context).toContainText('查阅编辑历史');

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
  ['zh', '/zh/docs/configure/overview/', '配置'],
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
