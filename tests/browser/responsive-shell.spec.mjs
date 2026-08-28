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

    // Docs pins its navbar: no auto-hide band, and one visible bar at every
    // width. Auto-hide keeps its own coverage on the taxonomy surfaces below.
    const header = page.locator('.td-site-header');
    await expect(page.locator('[data-td-navbar-autohide]')).toHaveCount(0);
    await expect(header).toHaveCount(1);
    await expect(header).toHaveCSS('opacity', '1');
    await expect(page.locator('.td-shell-sidebar__footer')).toHaveCount(0);
    // Navbar-on pages never render the phone subnav; the navbar itself
    // carries the drawer opener below md.
    await expect(subnav).toHaveCount(0);

    if (width < 768) {
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
      await expect(page.locator('.td-shell-sidebar__panel')).toBeVisible();
      await expect(toc).toBeHidden();
    } else {
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

// The taxonomy surfaces are the site's remaining `navbar_autohide` opt-in, so
// the policy keeps live coverage now that Docs, Book and Blog all pin the bar.
test('an auto-hiding surface rests faded and reveals under the pointer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page, '/categories/');

  const band = page.locator('[data-td-navbar-autohide]');
  const header = page.locator('.td-site-header');
  await expect(band).toHaveCount(1);
  await expect(header).toHaveCSS('opacity', '0');

  await band.hover({ position: { x: 640, y: 8 } });
  await expect(header).toHaveCSS('opacity', '1');
});

// Below md the drawer tier is the final authority: no pointer can reveal a
// hidden bar there, so the same surface keeps the ordinary visible navbar.
test('an auto-hiding surface keeps a visible navbar at drawer widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await openCleanPage(page, '/categories/');

  await expect(page.locator('.td-site-header')).toHaveCSS('opacity', '1');
});

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
    // The drawer entry renders for Home and Landing but stays hidden until
    // the below-md tier; the link tree itself is the visible navigation.
    await expect(page.locator('[data-td-landing-menu-toggle]')).toBeHidden();
    await expect(page.locator('[data-td-landing-menu]')).toBeHidden();
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
  // One icon and one title per row; the retired description never renders.
  await expect(panel.locator('.td-navbar-entry__description')).toHaveCount(0);

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
  test(`${locale} phone navbar pairs the centered tree with its drawer entry`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openCleanPage(page, path);

    const menuZone = page.locator('.td-nav-menu-zone');
    const search = page.locator('.td-nav-util-zone > .td-nav-search-box');
    const toggle = page.locator('[data-td-landing-menu-toggle]');
    const drawer = page.locator('[data-td-landing-menu]');
    await expect(menuZone).toBeVisible();
    await expect(search).toBeVisible();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    for (const [label, href] of roots) {
      const link = page.locator(
        `.td-nav-menu-zone > .td-nav-menu > .td-nav-menu__parent-link[href="${href}"], ` +
          `.td-nav-menu-zone > .nav-link[href="${href}"]`,
      );
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('aria-label', label);
      await expect(link.locator('.td-navbar-entry__label')).toBeHidden();
    }

    // Search leads the two-control end edge; the drawer entry sits outermost.
    const [searchBox, toggleBox, zoneBox] = await Promise.all([
      search.boundingBox(),
      toggle.boundingBox(),
      menuZone.boundingBox(),
    ]);
    expect(searchBox).not.toBeNull();
    expect(toggleBox).not.toBeNull();
    expect(zoneBox).not.toBeNull();
    expect(searchBox.x).toBeGreaterThan(zoneBox.x + zoneBox.width - 1);
    expect(toggleBox.x).toBeGreaterThan(searchBox.x);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).toBeVisible();
    for (const [label, href] of roots) {
      const link = drawer.locator(`a.td-site-nav__menu-link[href="${href}"]`);
      await expect(link).toBeVisible();
      await expect(link).toContainText(label);
    }
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(toggle).toBeFocused();

    // The pad tier keeps the centered tree and the full utility cluster with
    // no menu button.
    await page.setViewportSize({ width: 820, height: 900 });
    await expect(toggle).toBeHidden();
    await expect(menuZone).toBeVisible();
    await expect(
      page.locator('.td-nav-util-zone > .td-nav-theme-menu'),
    ).toBeVisible();
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
  // Navbar-on pages have no phone subnav: the navbar's search box leads the
  // end edge and the shell drawer opener sits immediately after it.
  const mobileSearch = page.locator('.td-nav-util-zone > .td-nav-search-box');
  const drawerOpen = page.locator(
    '.td-nav-util-zone > [data-td-shell-drawer-open]',
  );
  await expect(mobileSearch).toBeVisible();
  await expect(drawerOpen).toBeVisible();
  const [searchBox, openBox] = await Promise.all([
    mobileSearch.boundingBox(),
    drawerOpen.boundingBox(),
  ]);
  expect(searchBox).not.toBeNull();
  expect(openBox).not.toBeNull();
  expect(openBox.x).toBeGreaterThan(searchBox.x + searchBox.width - 1);
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

  await page.setViewportSize({ width: 820, height: 900 });
  await expect(dock).toHaveCSS('justify-content', 'center');
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
  await expect(feedback).toHaveCSS('border-top-style', 'solid');
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
  const pager = page.locator('.td-pager');
  const pagerBox = await pager.boundingBox();
  expect(pagerBox).not.toBeNull();
  for (const link of await pager.locator('.td-pager__link').all()) {
    await expect(link).toHaveCSS('font-family', proseFont);
    const title = link.locator('.td-pager__title');
    await expect(title).toHaveCSS('text-overflow', 'ellipsis');
    await expect(title).toHaveCSS('white-space', 'nowrap');
    const linkBox = await link.boundingBox();
    expect(linkBox).not.toBeNull();
    expect(linkBox.width).toBeLessThanOrEqual(pagerBox.width / 2 + 1);
  }

  const previous = pager.locator('.td-pager__link--prev');
  if (await previous.count()) {
    const box = await previous.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box.x - pagerBox.x)).toBeLessThanOrEqual(1);
  }
  const next = pager.locator('.td-pager__link--next');
  if (await next.count()) {
    const box = await next.boundingBox();
    expect(box).not.toBeNull();
    expect(
      Math.abs(box.x + box.width - (pagerBox.x + pagerBox.width)),
    ).toBeLessThanOrEqual(1);
  }

  const [toplineBox, actionsBox] = await Promise.all([
    page.locator('.td-shell-topline').boundingBox(),
    page.locator('[data-td-page-actions-toggle]:visible').boundingBox(),
  ]);
  expect(toplineBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(toplineBox.height).toBeGreaterThanOrEqual(actionsBox.height);
  expect(actionsBox.y).toBeGreaterThanOrEqual(toplineBox.y - 1);
  expect(actionsBox.y + actionsBox.height).toBeLessThanOrEqual(
    toplineBox.y + toplineBox.height + 1,
  );
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

    // Target the sidebar's opener: the auto-hidden navbar also carries one,
    // and its resting band would swallow a blind first-visible click.
    await page
      .locator('.td-shell-sidebar__brand-row > [data-td-shell-search-open]')
      .click();
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

test('Book sidebar numbers stay atomic when navigation titles wrap', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openCleanPage(page, '/book/01-start/');
  await page.locator('body').evaluate((body) => {
    body.classList.add('td-shell-layout--nav-wrap');
  });

  const number = page.locator(
    'a[href="/book/01-start/"] > .td-book-number',
  );
  await number.evaluate((node) => {
    node.textContent = '11.1';
  });
  await expect(number).toHaveCSS('white-space', 'nowrap');
  await expect(number).toHaveCSS('overflow-wrap', 'normal');
  await expect(number).toHaveCSS('flex-basis', 'auto');

  const metrics = await number.evaluate((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const textRects = [...range.getClientRects()];
    const numberBox = node.getBoundingClientRect();
    const titleBox = node.nextElementSibling.getBoundingClientRect();
    return {
      lineCount: new Set(textRects.map((rect) => Math.round(rect.y))).size,
      numberWidth: numberBox.width,
      textWidth: textRects[0]?.width || 0,
      gap: titleBox.left - numberBox.right,
    };
  });
  expect(metrics.lineCount).toBe(1);
  expect(metrics.numberWidth).toBeGreaterThanOrEqual(metrics.textWidth);
  expect(metrics.gap).toBeGreaterThanOrEqual(7);
});

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

test('print gives numbered equations the full paper width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCleanPage(page, '/docs/components/math/');
  await page.emulateMedia({ media: 'print' });

  const equation = page.locator('.td-book-figure--eq').last();
  const body = equation.locator('.td-book-equation__body');
  const caption = equation.locator('figcaption');
  await expect(equation).toBeVisible();
  await expect(caption).toHaveCSS('white-space', 'normal');

  const metrics = await equation.evaluate((node) => {
    const body = node.querySelector('.td-book-equation__body');
    const caption = node.querySelector('figcaption');
    const figureBox = node.getBoundingClientRect();
    const bodyBox = body.getBoundingClientRect();
    const captionBox = caption.getBoundingClientRect();
    return {
      columns: getComputedStyle(node).gridTemplateColumns.split(' ').length,
      figureWidth: figureBox.width,
      bodyWidth: bodyBox.width,
      bodyBottom: bodyBox.bottom,
      captionTop: captionBox.top,
    };
  });
  expect(metrics.columns).toBe(1);
  expect(metrics.bodyWidth).toBeGreaterThanOrEqual(metrics.figureWidth - 1);
  expect(metrics.captionTop).toBeGreaterThanOrEqual(metrics.bodyBottom - 1);
});
