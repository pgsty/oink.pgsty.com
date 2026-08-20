import { expect, test } from '@playwright/test';

const docPath = '/docs/customize/config/';
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
    const utilityDock = page.locator('.td-shell-footline__right');

    await expect(page.locator('.td-site-header')).toHaveCount(0);
    await expect(page.locator('.td-shell-sidebar__footer')).toHaveCount(0);

    if (width < 768) {
      await expect(subnav).toBeVisible();
      await page.locator('[data-td-shell-drawer-open]:visible').click();
      await expect(page.locator('html')).toHaveAttribute(
        'data-td-shell-drawer',
        'open',
      );
      await expect(page.locator('.td-shell-sidebar__panel')).toBeInViewport();
      await expect(toc).toBeHidden();
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
      await expect(toc.locator('.td-shell-toc__actions')).toHaveCount(0);
      await expect(
        toc.locator(
          '.td-language-selector, [data-td-theme-toggle], a[aria-label="GitHub"]',
        ),
      ).toHaveCount(0);

      const [breadcrumbBox, tocHeadingBox] = await Promise.all([
        page.locator('.td-breadcrumbs').boundingBox(),
        toc.locator('.td-shell-aside-group--toc').boundingBox(),
      ]);
      expect(breadcrumbBox).not.toBeNull();
      expect(tocHeadingBox).not.toBeNull();
      expect(Math.abs(breadcrumbBox.y - tocHeadingBox.y)).toBeLessThanOrEqual(
        1,
      );
    }

    await expect(utilityDock.locator('.td-version-menu--icon-only')).toBeVisible();
    await expect(utilityDock.locator('.td-language-selector')).toBeVisible();
    await expect(utilityDock.locator('.td-shell-keyboard')).toBeVisible();
    await expect(utilityDock.locator('[data-td-theme-toggle]')).toBeVisible();
    await expect(utilityDock.locator('a[aria-label="GitHub"]')).toHaveCount(0);

    const actionsToggle = page.locator('[data-td-page-actions-toggle]:visible');
    await expect(actionsToggle).toBeVisible();
    if ((await actionsToggle.getAttribute('aria-expanded')) === 'false') {
      await actionsToggle.click();
    }
    await expect(actionsToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(context.locator('[data-td-page-actions-menu]')).toBeVisible();
  });
}

for (const [locale, path, labels] of [
  ['en', '/', ['Docs', 'Book', 'Case', 'Blog']],
  ['zh', '/zh/', ['文档', '教程', '案例', '博客']],
]) {
  test(`${locale} homepage navbar contains the four content roots`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openCleanPage(page, path);

    const roots = page.locator(
      '.td-nav-menu-zone > .td-nav-menu > .td-nav-menu__parent-link, .td-nav-menu-zone > .nav-link',
    );
    await expect(roots).toHaveText(labels);
    // The homepage keeps one visible link tree at every width; only explicit
    // non-home Landing layouts render the separate drawer entry.
    await expect(page.locator('[data-td-landing-menu-toggle]')).toHaveCount(0);
    await expect(page.locator('[data-td-landing-menu]')).toHaveCount(0);
  });
}

for (const [locale, path, docsLabel, rootHrefs] of [
  ['en', docPath, 'Docs', ['/docs/', '/book/', '/case/', '/blog/']],
  [
    'zh',
    '/zh/docs/customize/config/',
    '文档',
    ['/zh/docs/', '/zh/book/', '/zh/case/', '/zh/blog/'],
  ],
]) {
  test(`${locale} root switcher keeps all content roots`, async ({
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
      page.locator(`.td-shell-root__item[href="${rootHrefs[0]}"]`),
    ).toHaveClass(/is-active/);
    for (const href of rootHrefs) {
      await expect(
        page.locator(`.td-shell-root__item[href="${href}"]`),
      ).toHaveCount(1);
    }
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
  const parent = menu.locator('.td-nav-menu__parent-link');
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
  ).toHaveText(/What OINK is, highlights, showcase/);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(parent).toBeFocused();

  const github = page.locator('.td-nav-github[aria-label="GitHub"]');
  await expect(github).toHaveAttribute('href', 'https://github.com/pgsty/oink');
  await expect(github).toHaveAttribute('target', '_blank');
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer');
});

for (const [locale, path, roots] of [
  [
    'en',
    '/',
    [
      ['Docs', '/docs/'],
      ['Book', '/book/'],
      ['Case', '/case/'],
      ['Blog', '/blog/'],
    ],
  ],
  [
    'zh',
    '/zh/',
    [
      ['文档', '/zh/docs/'],
      ['教程', '/zh/book/'],
      ['案例', '/zh/case/'],
      ['博客', '/zh/blog/'],
    ],
  ],
]) {
  test(`${locale} phone navbar keeps its centered link tree`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openCleanPage(page, path);

    const menuZone = page.locator('.td-nav-menu-zone');
    const search = page.locator('.td-nav-util-zone > .td-nav-search-box');
    await expect(menuZone).toBeVisible();
    await expect(search).toBeVisible();
    // No drawer on the homepage: the link tree itself stays reachable as
    // icon-only entries between the brand and the end-edge search action.
    await expect(page.locator('[data-td-landing-menu-toggle]')).toHaveCount(0);
    await expect(page.locator('[data-td-landing-menu]')).toHaveCount(0);

    for (const [label, href] of roots) {
      const link = page.locator(
        `.td-nav-menu-zone > .td-nav-menu > .td-nav-menu__parent-link[href="${href}"], ` +
          `.td-nav-menu-zone > .nav-link[href="${href}"]`,
      );
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('aria-label', label);
      await expect(link.locator('.td-navbar-entry__label')).toBeHidden();
    }

    const [searchBox, zoneBox] = await Promise.all([
      search.boundingBox(),
      menuZone.boundingBox(),
    ]);
    expect(searchBox).not.toBeNull();
    expect(zoneBox).not.toBeNull();
    expect(searchBox.x).toBeGreaterThan(zoneBox.x + zoneBox.width - 1);
  });
}

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

for (const [locale, path] of [
  ['en', docPath],
  ['zh', '/zh/docs/customize/config/'],
]) {
  for (const theme of ['light', 'dark']) {
    test(`${locale} ${theme} shortcut help stays compact on desktop and phone`, async ({
      page,
    }) => {
      await page.addInitScript((colorTheme) => {
        localStorage.setItem('td-color-theme', colorTheme);
      }, theme);

      for (const width of [1280, 360]) {
        await page.setViewportSize({ width, height: 900 });
        await openCleanPage(page, path);
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', theme);

        const trigger = page.locator('.td-shell-keyboard__trigger');
        const help = page.locator('.td-shell-keyboard-help');
        await trigger.scrollIntoViewIfNeeded();
        if (width >= 768) await trigger.hover();
        else await trigger.click();
        await expect(help).toBeVisible();
        await expect(help.locator('.td-kbd-sequence kbd')).not.toHaveCount(0);
        await expect(help.locator('pre, code')).toHaveCount(0);

        const box = await help.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width).toBeLessThanOrEqual(336.5);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width + 0.5);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        if (width === 360) {
          const dockBox = await page
            .locator('.td-shell-footline__right')
            .boundingBox();
          expect(dockBox).not.toBeNull();
          expect(
            Math.abs(dockBox.x + dockBox.width - (width - 16)),
          ).toBeLessThanOrEqual(1);
        }
      }
    });
  }
}

test('bottom bar utilities keep their order and open upward', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page, '/');

  const dock = page.locator('.td-shell-footline__right');
  await dock.scrollIntoViewIfNeeded();
  await expect(page.locator('.td-shell-sidebar__footer')).toHaveCount(0);
  await expect(dock.locator('a[aria-label="GitHub"]')).toHaveCount(0);
  await expect(dock.locator('.td-version-menu__title-text')).toHaveCount(0);

  expect(
    await dock.evaluate((element) =>
      Array.from(element.children).map((child) => {
        if (child.classList.contains('td-shell-footline__version')) return 'version';
        if (child.classList.contains('td-language-selector')) return 'language';
        if (child.classList.contains('td-shell-footline__theme')) return 'theme';
        if (child.classList.contains('td-shell-keyboard')) return 'help';
        if (child.classList.contains('td-shell-footline__toggle')) return 'collapse';
        return 'unknown';
      }),
    ),
  ).toEqual(['version', 'language', 'theme', 'help', 'collapse']);

  for (const [triggerSelector, menuSelector] of [
    ['.td-version-menu__title', '.td-version-menu .dropdown-menu'],
    ['.td-language-selector__trigger', '.td-language-selector > ul'],
    ['[data-td-theme-toggle]', '.td-shell-footline__theme .td-nav-hover-menu__pop'],
    ['.td-shell-keyboard__trigger', '.td-shell-keyboard-help'],
  ]) {
    const trigger = dock.locator(triggerSelector);
    const menu = dock.locator(menuSelector);
    await trigger.hover();
    await expect(menu).toBeVisible();
    const [triggerBox, menuBox] = await Promise.all([
      trigger.boundingBox(),
      menu.boundingBox(),
    ]);
    expect(triggerBox).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(menuBox.y + menuBox.height).toBeLessThanOrEqual(triggerBox.y + 1);
  }
});

test('page-end feedback and metadata use the compact prose presentation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // The docs cascade sets feedback: false; this page opts back in.
  await openCleanPage(page, '/docs/customize/repository/');

  const feedback = page.locator('.td-feedback');
  await expect(feedback.locator('.td-feedback__choice')).toHaveText([
    'Yes',
    'No',
  ]);
  await expect(feedback).toHaveCSS('border-bottom-style', 'none');
  await expect(feedback.locator('.td-feedback__prompt')).toHaveCSS(
    'flex-wrap',
    'nowrap',
  );
  await expect(feedback.locator('.td-feedback__question')).toHaveCSS(
    'margin-top',
    '0px',
  );
  await expect(feedback.locator('.td-feedback__question')).toHaveCSS(
    'border-bottom-style',
    'none',
  );

  // Annotation omits its wrapper when there is no fact to report. Probe it on
  // a tracked page with Git metadata instead of coupling this test to whether
  // the newly migrated repository guide has already been committed.
  await openCleanPage(page, '/docs/components/badge/');
  const proseFont = await page
    .locator('.td-content')
    .evaluate((element) => getComputedStyle(element).fontFamily);
  await expect(page.locator('.td-page-annotation')).toHaveCSS(
    'font-family',
    proseFont,
  );
  await expect(page.locator('.td-pager__summary')).toHaveCount(0);
  for (const link of await page.locator('.td-pager__link').all()) {
    await expect(link).toHaveCSS('font-family', proseFont);
  }
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
  await openCleanPage(page, '/zh/docs/customize/config/');

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
  ['zh', '/zh/docs/customize/config/', '配置'],
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
  await openCleanPage(page, '/docs/components/code/');
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
