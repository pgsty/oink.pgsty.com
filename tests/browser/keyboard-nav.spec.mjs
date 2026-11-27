import { expect, test } from '@playwright/test';

const docsPath = '/docs/customize/config/';

// The 3 x 10 shortcut sheet, in help order.
const SHORTCUT_ROWS = [
  ['tree-move', 'tree-toggle', 'tree-open', 'page-move', 'heading-move',
    'language', 'route', 'version', 'history', 'home'],
  ['search', 'commands', 'edit', 'new-page', 'issue', 'expand-all', 'print',
    'chatgpt', 'claude', 'gemini'],
  ['duo', 'zen', 'markdown', 'style', 'theme', 'layout', 'gallery',
    'image-size', 'page-width', 'help'],
];

async function openDocs(page, viewport = { width: 1280, height: 600 }) {
  await page.setViewportSize(viewport);
  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
}

// Page actions open new tabs, print, and copy. Record them instead.
async function recordPageActions(page) {
  await page.addInitScript(() => {
    window.__opened = [];
    window.open = (url, target, features) => {
      window.__opened.push({ url: String(url), target, features });
      return null;
    };
    window.__printed = 0;
    window.print = () => {
      window.__printed += 1;
    };
    window.__copied = [];
    const execCommand = document.execCommand.bind(document);
    document.execCommand = (command, ...rest) => {
      if (command !== 'copy') return execCommand(command, ...rest);
      const field = document.activeElement;
      window.__copied.push(field && 'value' in field ? field.value : String(document.getSelection()));
      return true;
    };
  });
}

async function openHelp(page) {
  const dialog = page.locator('[data-td-keyboard-dialog]');
  await page.keyboard.press("'");
  await expect(dialog).toBeVisible();
  return dialog;
}

async function unavailableRows(dialog) {
  return dialog.evaluate((element) =>
    Array.from(element.querySelectorAll('[data-td-shortcut].td-is-unavailable'))
      .map((row) => row.getAttribute('data-td-shortcut')),
  );
}

function articleWidth(page) {
  return page.locator('.td-shell-layout .td-shell-article')
    .evaluate((article) => Math.round(article.getBoundingClientRect().width));
}

function storedWidth(page) {
  return page.evaluate(() => localStorage.getItem('td-shell-article-w'));
}

function focusedTreeLink(page) {
  return page.locator('#td-sidebar-menu a.td-shell-tree__link:focus');
}

async function treeNeighbors(page) {
  return page.evaluate(() => {
    const links = Array.from(
      document.querySelectorAll('#td-sidebar-menu a.td-shell-tree__link'),
    ).filter((link) => link.offsetParent !== null);
    const index = links.findIndex((link) => link.classList.contains('active'));
    return {
      active: links[index] ? links[index].pathname : null,
      next: links[index + 1] ? links[index + 1].pathname : null,
      prev: links[index - 1] ? links[index - 1].pathname : null,
    };
  });
}

test('WASD moves in one step from the current page with a row highlight', async ({
  page,
}) => {
  await openDocs(page);
  const neighbors = await treeNeighbors(page);

  await page.keyboard.press('s');
  const focused = focusedTreeLink(page);
  await expect(focused).toHaveCount(1);
  expect(await focused.getAttribute('href')).toBe(neighbors.next);

  const ring = page.locator('.td-kbd-focus');
  await expect(ring).toHaveCount(1);
  await expect(ring).toHaveClass(/td-shell-tree__row/);
  await expect(ring.locator('a.td-shell-tree__link')).toBeFocused();

  await page.keyboard.press('w');
  expect(await focusedTreeLink(page).getAttribute('href')).toBe(
    neighbors.active,
  );

  await page.keyboard.press('Escape');
  await expect(focusedTreeLink(page)).toHaveCount(0);
  await expect(page.locator('.td-kbd-focus')).toHaveCount(0);
});

test('a folds from the current page in one step; d unfolds again', async ({
  page,
}) => {
  await openDocs(page);

  // `a` lands on the current leaf and jumps to its parent group.
  await page.keyboard.press('a');
  const parentRow = page.locator('.td-kbd-focus');
  const chevron = parentRow.locator('[data-td-shell-tree-toggle]');
  await expect(chevron).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('a');
  await expect(chevron).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('d');
  await expect(chevron).toHaveAttribute('aria-expanded', 'true');

  // `d` on an expanded group steps into its first child.
  await page.keyboard.press('d');
  const childHref = await focusedTreeLink(page).getAttribute('href');
  expect(childHref.endsWith(docsPath)).toBe(true);
});

test('Enter and Space open the focused page and q/e follow the tree order', async ({
  page,
}) => {
  await openDocs(page);
  const neighbors = await treeNeighbors(page);
  expect(neighbors.next).not.toBe(null);

  await page.keyboard.press('e');
  await page.waitForURL(`**${neighbors.next}`);

  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('q');
  await page.waitForURL(`**${neighbors.prev}`);

  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('s');
  await page.keyboard.press('Enter');
  await page.waitForURL(`**${neighbors.next}`);

  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('w');
  await page.keyboard.press('Space');
  await page.waitForURL(`**${neighbors.prev}`);

  // G no longer activates the tree: from a focused row it goes home.
  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('s');
  await expect(focusedTreeLink(page)).toHaveCount(1);
  await page.keyboard.press('g');
  await page.waitForURL((url) => url.pathname === '/');
});

test('the Docs landing is the first focus and paging destination', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/docs/', { waitUntil: 'domcontentloaded' });
  const links = page.locator('#td-sidebar-menu a.td-shell-tree__link');
  await expect(links.first()).toHaveAttribute('href', '/docs/');
  await expect(links.first()).toHaveAttribute('aria-current', 'page');

  await page.keyboard.press('w');
  await expect(links.first()).toBeFocused();
  const firstChild = await links.nth(1).getAttribute('href');
  await page.keyboard.press('Escape');
  await page.keyboard.press('e');
  await page.waitForURL(`**${firstChild}`);
  await page.keyboard.press('q');
  await page.waitForURL('**/docs/');
});

test('j and k jump quickly to adjacent outline items while inputs keep every key', async ({
  page,
}) => {
  await openDocs(page, { width: 1000, height: 500 });

  const outline = await page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const scrollPadding =
      parseFloat(rootStyle.getPropertyValue('scroll-padding-top')) || 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    return Array.from(
      document.querySelectorAll('#TableOfContents a[href^="#"]'),
    )
      .slice(0, 2)
      .map((anchor) => {
        const hash = anchor.getAttribute('href');
        const heading = document.getElementById(hash.slice(1));
        const headingStyle = getComputedStyle(heading);
        const scrollMargin =
          parseFloat(
            headingStyle.getPropertyValue('scroll-margin-block-start'),
          ) ||
          parseFloat(headingStyle.getPropertyValue('scroll-margin-top')) ||
          0;
        const offset = Math.max(0, scrollPadding + scrollMargin);
        return {
          hash,
          y: Math.min(
            Math.max(scrollY + heading.getBoundingClientRect().top - offset, 0),
            max,
          ),
        };
      });
  });
  expect(outline).toHaveLength(2);

  await page.keyboard.press('j');
  await page.keyboard.press('j');
  await page.waitForTimeout(180);
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - outline[1].y),
  ).toBeLessThan(3);
  expect(await page.evaluate(() => window.location.hash)).toBe(outline[1].hash);

  await page.keyboard.press('k');
  await page.waitForTimeout(180);
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - outline[0].y),
  ).toBeLessThan(3);
  expect(await page.evaluate(() => window.location.hash)).toBe(outline[0].hash);

  await page.keyboard.press('k');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(3);

  await page.evaluate(() => {
    const field = document.createElement('input');
    field.setAttribute('data-test-kbd-field', '');
    // Keep the synthetic editor inside the viewport. An offscreen caret has
    // native browser scroll behavior unrelated to shortcut ownership.
    Object.assign(field.style, {
      position: 'fixed',
      inset: '80px auto auto 80px',
      zIndex: '1000',
    });
    document.body.appendChild(field);
  });
  const field = page.locator('[data-test-kbd-field]');
  await field.evaluate((element) => element.focus({ preventScroll: true }));
  const typingScrollY = await page.evaluate(() => window.scrollY);
  await field.press('j');
  await expect(field).toHaveValue('j');
  expect(
    Math.abs((await page.evaluate(() => window.scrollY)) - typingScrollY),
  ).toBeLessThanOrEqual(1);
  await field.press('s');
  await expect(field).toHaveValue('js');
  await expect(focusedTreeLink(page)).toHaveCount(0);
});

test('homepage j and k jump between landing sections, g returns to the top, and z hides page chrome', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const sections = page.locator('[data-td-landing] > section[id]');
  await expect(sections).toHaveCount(7);
  expect(await sections.nth(0).getAttribute('id')).toBe('hero');
  expect(await sections.nth(1).getAttribute('id')).toBe('capabilities');

  await page.keyboard.press('j');
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#capabilities');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);

  await page.keyboard.press('k');
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#hero');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);

  // G on the home page glides back to the top instead of reloading.
  await page.keyboard.press('j');
  await page.keyboard.press('j');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.keyboard.press('g');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(3);
  expect(new URL(page.url()).pathname).toBe('/');

  await page.keyboard.press('z');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-header]')).toBeHidden();
  await expect(page.locator('[data-td-shell-footer]')).toBeHidden();

  // H is history now, not a Zen alias.
  await page.keyboard.press('h');
  await expect(page.locator('#td-shell-history')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#td-shell-history')).toBeHidden();

  await page.keyboard.press('z');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-header]')).toBeVisible();
});

test('content articles carry one pinned navbar without a subnav', async ({
  page,
}) => {
  // Docs, Book and Blog all pin the title bar: reading and reference alike
  // never make the bar appear and disappear under the pointer. Each still
  // renders exactly one header and no subnav. Auto-hide stays a live policy —
  // the taxonomy surfaces below still opt into it.
  const cases = [
    { path: '/docs/customize/config/', autohide: 0 },
    { path: '/release/0.4.0/', autohide: 0 },
    { path: '/book/01-start/', autohide: 0 },
  ];
  for (const { path, autohide } of cases) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-td-header]')).toHaveCount(1);
    await expect(page.locator('[data-td-navbar-autohide]')).toHaveCount(autohide);
    await expect(page.locator('.td-shell-subnav')).toHaveCount(0);
    await expect(page.locator('.td-shell-footline')).toHaveCount(1);
    await expect(page.locator('#td-site-footer')).toHaveCount(1);
    await expect(page.locator('[data-td-footer-toggle]')).toHaveAttribute(
      'aria-expanded', 'true',
    );
  }
});

test('the narrowest tier keeps the navbar visible even in zen', async ({
  page,
}) => {
  await openDocs(page, { width: 479, height: 844 });
  const header = page.locator('.td-site-header');
  await expect(page.locator('.td-shell-subnav')).toHaveCount(0);
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS('position', 'sticky');

  const [bar, menu] = await Promise.all([
    header.boundingBox(),
    header.locator('.td-nav-menu-zone').boundingBox(),
  ]);
  expect(bar).not.toBeNull();
  expect(menu).not.toBeNull();
  expect(
    Math.abs(menu.x + menu.width / 2 - (bar.x + bar.width / 2)),
  ).toBeLessThanOrEqual(1);

  // The drawer-width tier is the final authority: a persisted keyboard zen
  // state must not remove the only always-visible navigation surface.
  await page.evaluate(() => sessionStorage.setItem('td-kbd-zen', '1'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(header).toBeVisible();
});

test('collapsed rail restore buttons align with the article topline', async ({
  page,
}) => {
  await openDocs(page, { width: 1280, height: 900 });
  await page
    .locator('#td-shell-sidebar [data-td-shell-sidebar-toggle]')
    .first()
    .evaluate((button) => button.click());
  await page
    .locator('.td-shell-toc__panel [data-td-shell-right-toggle]')
    .first()
    .evaluate((button) => button.click());

  const [topline, leftRestore, rightRestore] = await Promise.all([
    page.locator('.td-shell-topline').boundingBox(),
    page.locator('.td-shell-float').boundingBox(),
    page.locator('.td-shell-toc-float').boundingBox(),
  ]);
  expect(topline).not.toBeNull();
  expect(leftRestore).not.toBeNull();
  expect(rightRestore).not.toBeNull();
  expect(Math.abs(leftRestore.y - topline.y)).toBeLessThanOrEqual(4);
  expect(Math.abs(rightRestore.y - topline.y)).toBeLessThanOrEqual(4);
});

test('modified keys and visible dialog surfaces keep ownership', async ({
  page,
}) => {
  await openDocs(page);

  await page.keyboard.press('Shift+s');
  await expect(focusedTreeLink(page)).toHaveCount(0);

  await page.evaluate(() => {
    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('data-test-kbd-dialog', '');
    document.body.appendChild(dialog);
  });
  await page.keyboard.press('s');
  await expect(focusedTreeLink(page)).toHaveCount(0);
});

test('WASD restores a collapsed sidebar but yields while zen mode hides it', async ({
  page,
}) => {
  await openDocs(page);
  const sidebarToggle = page
    .locator('#td-shell-sidebar [data-td-shell-sidebar-toggle]')
    .first();
  // Trigger the setup action directly so this test stays about keyboard-owned
  // sidebar restoration rather than pointer targeting.
  await sidebarToggle.evaluate((button) => button.click());
  await expect(page.locator('html')).toHaveAttribute(
    'data-td-shell-sidebar',
    'collapsed',
  );

  await page.keyboard.press('s');
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-td-shell-sidebar',
    'collapsed',
  );
  await expect(focusedTreeLink(page)).toHaveCount(1);

  await page.keyboard.press('Escape');
  await page.keyboard.press('z');
  await page.keyboard.press('s');
  await expect(focusedTreeLink(page)).toHaveCount(0);
});

test('z toggles the chrome-free reading mode and survives paging', async ({
  page,
}) => {
  await openDocs(page);
  const sidebar = page.locator('#td-shell-sidebar');
  const toc = page.locator('.td-shell-toc');
  const footer = page.locator('[data-td-shell-footer]');
  await expect(sidebar).toBeVisible();

  await page.keyboard.press('z');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(sidebar).toBeHidden();
  await expect(toc).toBeHidden();
  await expect(footer).toBeHidden();

  const neighbors = await page.evaluate(() => {
    const links = Array.from(
      document.querySelectorAll('#td-sidebar-menu a.td-shell-tree__link'),
    );
    const index = links.findIndex((link) => link.classList.contains('active'));
    return links[index + 1] ? links[index + 1].pathname : null;
  });
  await page.keyboard.press('e');
  await page.waitForURL(`**${neighbors}`);
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');

  await page.keyboard.press('z');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('#td-shell-sidebar')).toBeVisible();
});

test('t steps the visual style, y cycles light/dark/system, and x switches the language', async ({
  page,
}) => {
  await openDocs(page);

  // T cycles Paper, Slate, Ink and Terminal in offered order.
  const offered = ['paper', 'slate', 'ink', 'terminal'];
  const style = () =>
    page.evaluate(() => document.documentElement.getAttribute('data-td-preset'));
  const first = await style();
  for (let step = 1; step <= offered.length; step += 1) {
    await page.keyboard.press('t');
    await expect
      .poll(style)
      .toBe(offered[(offered.indexOf(first) + step) % offered.length]);
  }

  // Y cycles Light, Dark, and System (auto) color modes in order.
  const modes = ['light', 'dark', 'auto'];
  const mode = () =>
    page.evaluate(() => document.documentElement.getAttribute('data-td-color-mode'));
  const initialMode = await mode();
  expect(modes).toContain(initialMode);
  for (let step = 1; step <= modes.length; step += 1) {
    const expected = modes[(modes.indexOf(initialMode) + step) % modes.length];
    await page.keyboard.press('y');
    await expect.poll(mode).toBe(expected);
    if (expected === 'light' || expected === 'dark') {
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', expected);
    }
    await expect(
      page.locator(`input[data-bs-theme-value="${expected}"]`).first(),
    ).toBeChecked();
  }

  // L is the index layout now; on a docs page it has nothing to switch.
  await page.keyboard.press('l');
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(new URL(page.url()).pathname).toBe(docsPath);

  await page.keyboard.press('x');
  await page.waitForURL(`**/zh${docsPath}`);
  await page.keyboard.press('x');
  await page.waitForURL((url) => url.pathname === docsPath);
});

test("' toggles the 3 x 10 shortcut help anywhere and dims what the page cannot run", async ({
  page,
}) => {
  await openDocs(page, { width: 1280, height: 720 });
  const dialog = page.locator('[data-td-keyboard-dialog]');

  // Open from the top of the page (the footer is off-screen); the dialog is centered.
  await page.keyboard.press("'");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog.locator('[data-td-keyboard-dialog-close]')).toBeFocused();
  await expect(dialog.locator('[data-td-keyboard-dialog-close]')).toHaveAttribute(
    'aria-keyshortcuts',
    "Escape '",
  );

  // Three groups of ten, in help order, side by side on desktop without duplicate IDs.
  const layout = await page.evaluate(() => {
    const el = document.querySelector('[data-td-keyboard-dialog]');
    const sections = Array.from(el.querySelectorAll('.td-shell-keyboard-help__section'));
    const ids = Array.from(document.querySelectorAll('[id]')).map((node) => node.id);
    return {
      dialogRect: el.getBoundingClientRect(),
      sectionRects: sections.map((section) => section.getBoundingClientRect()),
      titles: sections.map((section) =>
        section.querySelector('.td-shell-keyboard-help__section-title').textContent.trim()),
      rows: sections.map((section) =>
        Array.from(section.querySelectorAll('[data-td-shortcut]'))
          .map((row) => row.getAttribute('data-td-shortcut'))),
      dupes: ids.filter((id, index) => ids.indexOf(id) !== index),
    };
  });
  expect(layout.dupes).toEqual([]);
  expect(layout.titles).toEqual(['Navigation', 'Actions', 'View']);
  expect(layout.rows).toEqual(SHORTCUT_ROWS);
  expect(layout.dialogRect.top).toBeGreaterThanOrEqual(0);
  expect(layout.dialogRect.bottom).toBeLessThanOrEqual(720);
  for (const index of [1, 2]) {
    expect(Math.abs(layout.sectionRects[index].top - layout.sectionRects[0].top)).toBeLessThanOrEqual(2);
    expect(layout.sectionRects[index].left).toBeGreaterThan(layout.sectionRects[index - 1].left + 200);
  }

  // Keycaps follow the new map.
  const keycaps = (id) => dialog.locator(`[data-td-shortcut="${id}"] kbd`).allTextContents();
  expect(await keycaps('history')).toEqual(['H']);
  expect(await keycaps('home')).toEqual(['G']);
  expect(await keycaps('commands')).toEqual(['C', '`']);
  expect(await keycaps('gemini')).toEqual(['\\']);
  expect(await keycaps('layout')).toEqual(['L']);
  expect(await keycaps('gallery')).toEqual([';']);
  expect(await keycaps('page-width')).toEqual(['-', '=']);
  expect(await keycaps('help')).toEqual(["'"]);

  // This docs page has one version, no index layout and no gallery: those
  // rows stay in place, dimmed and announced as unavailable.
  expect((await unavailableRows(dialog)).sort()).toEqual(
    ['gallery', 'image-size', 'layout', 'version'],
  );
  // Dimming keeps AA contrast: secondary text plus dashed keycaps, never opacity.
  const version = dialog.locator('[data-td-shortcut="version"]');
  await expect(version).toHaveCSS('opacity', '1');
  await expect(version.locator('kbd').first()).toHaveCSS('border-top-style', 'dashed');
  await expect(dialog.locator('[data-td-shortcut="history"] kbd').first()).not.toHaveCSS('border-top-style', 'dashed');
  await expect(version.locator('[data-td-shortcut-state]')).toHaveText(/unavailable/);
  await expect(dialog.locator('[data-td-shortcut="history"] [data-td-shortcut-state]')).toHaveCount(0);

  // Other shortcuts stand down while the help dialog is open.
  await page.keyboard.press('z');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');

  // A second ' closes it.
  await page.keyboard.press("'");
  await expect(dialog).toBeHidden();

  // It opens inside Zen Mode although the footer is hidden, and availability
  // is evaluated again: the tree rows dim while the sidebar is gone.
  await page.keyboard.press('z');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-shell-footer]')).toBeHidden();
  await page.keyboard.press("'");
  await expect(dialog).toBeVisible();
  expect(await unavailableRows(dialog)).toEqual(
    expect.arrayContaining(['tree-move', 'tree-toggle', 'tree-open']),
  );

  // Escape closes it without leaving Zen Mode.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');

  // Clicking the backdrop closes it too.
  await page.keyboard.press("'");
  await expect(dialog).toBeVisible();
  await page.mouse.click(8, 8);
  await expect(dialog).toBeHidden();
  await page.keyboard.press('z');

  // ; is the gallery layout now and opens nothing here.
  await page.keyboard.press(';');
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(dialog).toBeHidden();

  // A narrow viewport stacks the groups inside the viewport.
  await page.setViewportSize({ width: 390, height: 700 });
  await page.keyboard.press("'");
  await expect(dialog).toBeVisible();
  const mobileBox = await dialog.boundingBox();
  expect(mobileBox).not.toBeNull();
  expect(mobileBox.x).toBeGreaterThanOrEqual(0);
  expect(mobileBox.x + mobileBox.width).toBeLessThanOrEqual(390.5);
  const stacked = await dialog.evaluate((element) =>
    Array.from(element.querySelectorAll('.td-shell-keyboard-help__section'))
      .map((section) => Math.round(section.getBoundingClientRect().left)));
  expect(new Set(stacked).size).toBe(1);
  await dialog.locator('[data-td-keyboard-dialog-close]').click();
  await expect(dialog).toBeHidden();
});

test('the Chinese shortcut help keeps the same grid with localized groups', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`/zh${docsPath}`, { waitUntil: 'domcontentloaded' });
  const dialog = await openHelp(page);
  const titles = await dialog.locator('.td-shell-keyboard-help__section-title').allTextContents();
  expect(titles.map((title) => title.trim())).toEqual(['导航', '操作', '样式']);
  await expect(dialog.locator('[data-td-shortcut]')).toHaveCount(30);
  await expect(dialog.locator('[data-td-shortcut="history"]')).toContainText('浏览历史');
  await expect(dialog.locator('[data-td-shortcut="home"]')).toContainText('回到首页');
  await expect(dialog.locator('[data-td-shortcut="gemini"]')).toContainText('Gemini');
  await expect(
    dialog.locator('[data-td-shortcut="version"] [data-td-shortcut-state]'),
  ).toHaveText(/暂不可用/);
});

test('l cycles layout modes on blog and release index pages and ;/,/. control visible gallery view', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.removeItem('td-blog-index');
    localStorage.removeItem('td-blog-gallery-mode');
    localStorage.removeItem('td-blog-gallery-size');
  });
  await page.goto('/blog/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'cards');
  await expect(page.locator('[data-td-blog-index-toggle]')).toHaveAttribute('aria-keyshortcuts', 'L');

  // The layout row is live here; the gallery rows wait for a visible gallery.
  let help = await openHelp(page);
  let dimmed = await unavailableRows(help);
  expect(dimmed).not.toContain('layout');
  expect(dimmed).toEqual(expect.arrayContaining(['gallery', 'image-size']));
  await page.keyboard.press("'");
  await expect(help).toBeHidden();

  const gallery = page.locator('[data-td-blog-gallery]');
  const slider = gallery.locator('input[data-gallery-size]');

  // While cards view is active, the hidden gallery ignores ;/,/..
  await page.keyboard.press(';');
  await page.keyboard.press('.');
  await expect(gallery).toHaveAttribute('data-td-mode', 'wall');
  await expect(slider).toHaveValue('240');

  // Cycle cards -> table -> gallery with L; V is the version key now.
  await page.keyboard.press('v');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'cards');
  await page.keyboard.press('l');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'table');
  await page.keyboard.press('l');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'gallery');
  await expect(gallery.locator('fieldset.td-expo-modes')).toHaveAttribute('aria-keyshortcuts', ';');

  help = await openHelp(page);
  dimmed = await unavailableRows(help);
  expect(dimmed).not.toContain('gallery');
  expect(dimmed).not.toContain('image-size');
  await page.keyboard.press('Escape');
  await expect(help).toBeHidden();

  // Once gallery view is visible, ; cycles modes and ,/< ./> adjust tile size and reflow geometry.
  for (const expected of ['cards', 'seamless', 'wall']) {
    await page.keyboard.press(';');
    await expect(gallery).toHaveAttribute('data-td-mode', expected);
  }
  const tileHeight = () =>
    gallery.locator('.td-blog-gallery__media').first().evaluate((el) => el.getBoundingClientRect().height);
  const initialHeight = await tileHeight();

  await page.keyboard.press(',');
  await expect(slider).toHaveValue('220');
  await page.keyboard.press('<');
  await expect(slider).toHaveValue('200');
  await page.keyboard.press(',');
  await expect(slider).toHaveValue('180');
  await page.keyboard.press('<');
  await expect(slider).toHaveValue('160');
  await expect.poll(tileHeight).toBeLessThan(initialHeight);

  await page.keyboard.press('.');
  await expect(slider).toHaveValue('180');
  await page.keyboard.press('>');
  await expect(slider).toHaveValue('200');
  await page.keyboard.press('.');
  await expect(slider).toHaveValue('220');
  await page.keyboard.press('>');
  await expect(slider).toHaveValue('240');
  for (const expected of ['260', '280', '300', '320', '340', '360']) {
    await page.keyboard.press(expected === '360' ? '>' : '.');
    await expect(slider).toHaveValue(expected);
  }
  await expect.poll(tileHeight).toBeGreaterThan(initialHeight);

  // Clicking a layout radio or focusing the range slider must not trap ;/,/. shortcuts.
  await gallery.locator('label.td-expo-mode').nth(1).click();
  await expect(gallery).toHaveAttribute('data-td-mode', 'cards');
  await page.keyboard.press(';');
  await expect(gallery).toHaveAttribute('data-td-mode', 'seamless');
  await slider.focus();
  await expect(slider).toBeFocused();
  await page.keyboard.press(',');
  await expect(slider).toHaveValue('340');
  await page.keyboard.press('.');
  await expect(slider).toHaveValue('360');
  expect(
    await page.evaluate(() => [
      localStorage.getItem('td-blog-gallery-mode'),
      localStorage.getItem('td-blog-gallery-size'),
    ]),
  ).toEqual(['seamless', '360']);

  // Continue the L cycle gallery -> list -> cards.
  await page.keyboard.press('l');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'list');
  await page.keyboard.press('l');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'cards');
});

test('f and c open the palette in search and command mode', async ({
  page,
}) => {
  await openDocs(page);
  const dialog = page.locator('#td-shell-search');
  const input = dialog.locator('.td-shell-search__input');

  for (const [key, value] of [['f', ''], ['/', ''], ['c', '>'], ['`', '>'], ['~', '>']]) {
    await page.keyboard.press(key);
    await expect(dialog).toBeVisible();
    await expect(input).toHaveValue(value);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});

test('the footer arrow collapses the fat footer and persists', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const toggle = page.locator('[data-td-footer-toggle]');
  const grid = page.locator('#td-site-footer');
  await expect(page.locator('.td-site-footer__column').first()).toHaveCSS(
    'padding-left',
    '10px',
  );
  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(grid).toBeVisible();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(grid).toBeHidden();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#td-site-footer')).toBeHidden();
  await expect(page.locator('[data-td-footer-toggle]')).toHaveAttribute(
    'aria-expanded',
    'false',
  );

  const restore = page.locator('[data-td-footer-toggle]');
  await restore.scrollIntoViewIfNeeded();
  await restore.click();
  await expect(page.locator('#td-site-footer')).toBeVisible();
});

test('on a drawer viewport the first press opens the drawer', async ({
  page,
}) => {
  await openDocs(page, { width: 500, height: 800 });

  await page.keyboard.press('s');
  await expect(page.locator('html')).toHaveAttribute(
    'data-td-shell-drawer',
    'open',
  );
  await expect(focusedTreeLink(page)).toHaveCount(1);

  await page.keyboard.press('Escape');
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-td-shell-drawer',
    'open',
  );
});

test('h lists earlier pages newest first, filters, forgets and clears them', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const visited = [];
  for (const path of [docsPath, '/docs/customize/keyboard/', '/docs/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    visited.push({
      path,
      title: await page.evaluate(() =>
        document.querySelector('meta[property="og:title"]').getAttribute('content')),
    });
  }

  const root = page.locator('#td-shell-history');
  const input = root.locator('.td-shell-search__input');
  const rows = root.locator('[role="option"]');
  await expect(root).toBeHidden();
  await page.keyboard.press('h');
  await expect(root).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-td-shell-lock', '');

  // Newest first, without the page being read.
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText(visited[1].title);
  await expect(rows.nth(0)).toContainText(visited[1].path);
  await expect(rows.nth(1)).toContainText(visited[0].title);
  await expect(rows.nth(0)).toHaveAttribute('aria-selected', 'true');

  // Page shortcuts stand down while the list owns the keyboard.
  await input.press('z');
  await expect(input).toHaveValue('z');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');
  await input.fill('');

  // Every typed word must match the title or the path.
  await input.fill('config');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText(visited[0].title);
  await expect(rows.first().locator('mark').first()).toBeVisible();

  // Shift+Delete forgets the selected page.
  await input.press('Shift+Delete');
  await expect(rows).toHaveCount(0);
  await expect(root.locator('.td-shell-search__empty')).toBeVisible();
  await input.fill('');
  await expect(rows).toHaveCount(1);
  const stored = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((name) => name.startsWith('td-history:'));
    return { key, entries: JSON.parse(localStorage.getItem(key)).map((entry) => entry.url) };
  });
  expect(stored.key).toBe('td-history:/');
  expect(stored.entries).toEqual(['/docs/', '/docs/customize/keyboard/']);

  // Clear empties the list and the storage, then disables itself.
  const clear = root.locator('[data-td-history-clear]');
  await clear.click();
  await expect(rows).toHaveCount(0);
  await expect(root.locator('.td-shell-search__empty')).toBeVisible();
  await expect(clear).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('td-history:/'))).toBeNull();

  await page.keyboard.press('Escape');
  await expect(root).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute('data-td-shell-lock', '');
});

test('h then Enter returns to the previous page, and the palette opens the same list with focus return', async ({
  page,
}) => {
  await recordPageActions(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });

  // First visit: only the current page is stored, so Clear history starts disabled.
  const root = page.locator('#td-shell-history');
  await page.keyboard.press('h');
  await expect(root).toBeVisible();
  await expect(root.locator('[role="option"]')).toHaveCount(0);
  await expect(root.locator('[data-td-history-clear]')).toBeDisabled();

  // Escape during IME composition must not close the history overlay.
  await root.locator('.td-shell-search__input').evaluate((input) => {
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape', keyCode: 229, isComposing: true, bubbles: true, cancelable: true,
    }));
  });
  await expect(root).toBeVisible();
  await root.locator('.td-shell-search__input').evaluate((input) => {
    input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  });
  await page.keyboard.press('Escape');
  await expect(root).toBeHidden();

  await page.goto('/zh/docs/customize/keyboard/', { waitUntil: 'domcontentloaded' });

  // Every language of the site shares one history; Ctrl+Enter opens in a new tab.
  await page.keyboard.press('h');
  await expect(root).toBeVisible();
  await expect(root.locator('[role="option"]').first()).toContainText(docsPath);
  await root.locator('.td-shell-search__input').press('Control+Enter');
  await expect.poll(() => page.evaluate(() => window.__opened.length)).toBe(1);
  const newTab = await page.evaluate(() => window.__opened[0]);
  expect(new URL(newTab.url).pathname).toBe(docsPath);
  expect(newTab.target).toBe('_blank');
  expect(newTab.features).toBe('noopener');
  await expect(root).toBeVisible();

  await page.keyboard.press('Enter');
  await page.waitForURL((url) => url.pathname === docsPath);

  // Opening Browsing history from the Command Palette restores focus to the
  // original visible opener on Escape instead of dropping focus on the closed palette.
  const trigger = page.locator('[data-td-shell-search-open]:visible').first();
  await trigger.focus();
  await trigger.click();
  const palette = page.locator('#td-shell-search');
  await expect(palette).toBeVisible();
  await palette.locator('.td-shell-search__input').fill('>Browsing history');
  const option = palette.getByRole('option', { name: /Browsing history/ }).first();
  await expect(option).toBeVisible();
  await option.click();
  await expect(root).toBeVisible();
  await expect(palette).toBeHidden();
  await expect(root.locator('[role="option"]').first()).toContainText('/zh/docs/customize/keyboard/');
  await page.keyboard.press('Escape');
  await expect(root).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('g opens the home page of the current language', async ({ page }) => {
  await openDocs(page);
  await page.keyboard.press('g');
  await page.waitForURL((url) => url.pathname === '/');

  await page.goto(`/zh${docsPath}`, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('g');
  await page.waitForURL((url) => url.pathname === '/zh/');
});

test('o opens every fold, then folds all but the current branch without moving the text', async ({
  page,
}) => {
  await openDocs(page, { width: 1440, height: 900 });
  // A closed disclosure above the second outline heading.
  await page.evaluate(() => {
    const details = document.createElement('details');
    details.setAttribute('data-test-fold', '');
    details.innerHTML = '<summary>More</summary><p style="height:400px">Folded detail</p>';
    document.querySelector('.td-content h2').before(details);
  });
  const hash = await page.locator('#TableOfContents a[href^="#"]').nth(1).getAttribute('href');
  const target = page.locator(`[id="${decodeURIComponent(hash.slice(1))}"]`);
  // The root scrolls smoothly; place the heading instantly so the baseline is settled.
  await target.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect.poll(() => target.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(120);
  const before = await target.evaluate((element) => element.getBoundingClientRect().top);

  const toggles = page.locator('#td-shell-sidebar [data-td-shell-tree-toggle]');
  // A toggle belongs to the active path when its own item does.
  const states = () => toggles.evaluateAll((buttons) => buttons.map((button) => {
    const item = button.closest('.td-shell-tree__item');
    return {
      expanded: button.getAttribute('aria-expanded') === 'true',
      activePath: Boolean(item && item.classList.contains('td-active-path')),
    };
  }));

  await page.keyboard.press('o');
  await expect(page.locator('[data-test-fold]')).toHaveAttribute('open', '');
  expect((await states()).every((state) => state.expanded)).toBe(true);
  await expect(page.locator('[aria-controls="td-shell-aside-toc"]')).toHaveAttribute('aria-expanded', 'true');
  const after = await target.evaluate((element) => element.getBoundingClientRect().top);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(2);

  await page.keyboard.press('o');
  await expect(page.locator('[data-test-fold]')).not.toHaveAttribute('open', '');
  const folded = await states();
  expect(folded.filter((state) => !state.activePath).every((state) => !state.expanded)).toBe(true);
  expect(folded.filter((state) => state.activePath).every((state) => state.expanded)).toBe(true);
  await expect(page.locator(`#td-sidebar-menu a[aria-current="page"]`)).toBeVisible();
  await expect(page.locator('[aria-controls="td-shell-aside-toc"]')).toHaveAttribute('aria-expanded', 'false');
  // Rails and popovers are not folded content.
  await expect(page.locator('html')).not.toHaveAttribute('data-td-shell-sidebar', 'collapsed');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-shell-toc', 'collapsed');

  await page.keyboard.press('o');
  expect((await states()).every((state) => state.expanded)).toBe(true);
});

test('o keeps the reading line steady on wide screens and ignores hidden rails in Zen Mode', async ({
  page,
}) => {
  await openDocs(page, { width: 1920, height: 1000 });
  await page.evaluate(() => {
    const details = document.createElement('details');
    details.setAttribute('data-test-fold', '');
    details.innerHTML = '<summary>More</summary><p style="height:400px">Folded detail</p>';
    document.querySelector('.td-content h2').before(details);
  });
  const hash = await page.locator('#TableOfContents a[href^="#"]').nth(1).getAttribute('href');
  const target = page.locator(`[id="${decodeURIComponent(hash.slice(1))}"]`);
  await target.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  const beforeWide = await target.evaluate((element) => element.getBoundingClientRect().top);

  await page.keyboard.press('o');
  await expect(page.locator('[data-test-fold]')).toHaveAttribute('open', '');
  const afterWide = await target.evaluate((element) => element.getBoundingClientRect().top);
  expect(Math.abs(afterWide - beforeWide)).toBeLessThanOrEqual(2);

  // Enter Zen Mode: hidden rail toggles must not affect o, so pressing o once
  // closes the open <details> and keeps the heading anchored.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.keyboard.press('z');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await target.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  const beforeZen = await target.evaluate((element) => element.getBoundingClientRect().top);

  await page.keyboard.press('o');
  await expect(page.locator('[data-test-fold]')).not.toHaveAttribute('open', '');
  const afterZen = await target.evaluate((element) => element.getBoundingClientRect().top);
  expect(Math.abs(afterZen - beforeZen)).toBeLessThanOrEqual(2);

  // Without any visible article foldables in Zen Mode, help dims expand-all.
  await page.evaluate(() => {
    document.querySelectorAll('.td-content details, .td-content [data-td-code].is-collapsible')
      .forEach((el) => el.remove());
  });
  const dialog = await openHelp(page);
  expect(await unavailableRows(dialog)).toContain('expand-all');
  await page.keyboard.press('Escape');
});

test('- and = step smoothly on Book slim reading_width, ignore invalid prepaint values, and yield to print', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.goto('/book/01-start/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    document.body.classList.remove('td-book-content--normal', 'td-book-content--wide');
    document.body.classList.add('td-book-content--slim');
  });
  const contentWidth = () => page.locator('.td-shell-layout .td-shell-article > .td-content')
    .evaluate((el) => Math.round(el.getBoundingClientRect().width));

  const slimWidth = await contentWidth();
  expect(slimWidth).toBe(768);

  await page.keyboard.press('-');
  await expect.poll(contentWidth).toBe(slimWidth - 100);
  await page.keyboard.press('=');
  await expect.poll(contentWidth).toBe(slimWidth);
  expect(await storedWidth(page)).toBeNull();

  await page.keyboard.press('=');
  await expect.poll(contentWidth).toBe(slimWidth + 100);

  // Print ignores the screen-only reader width override.
  await page.emulateMedia({ media: 'print' });
  await expect.poll(async () => page.locator('.td-shell-layout .td-shell-article')
    .evaluate((el) => getComputedStyle(el).maxWidth)).not.toBe(
      `${await storedWidth(page)}px`,
    );
  await page.emulateMedia({ media: 'screen' });

  // Prepaint rejects stored widths below the 600 px minimum.
  await page.evaluate(() => localStorage.setItem('td-shell-article-w', '200'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).not.toHaveAttribute('data-td-shell-article-w', '');
});

test('- and = narrow and widen the reading column, persist, and step back to the page width', async ({
  page,
}) => {
  await openDocs(page, { width: 1920, height: 1000 });
  const pageWidth = await articleWidth(page);
  const container = await page.locator('.td-shell-layout .td-shell-article')
    .evaluate((article) => Math.round(article.parentElement.clientWidth));
  expect(container).toBeGreaterThan(pageWidth + 150);

  await page.keyboard.press('=');
  await expect.poll(() => articleWidth(page)).toBe(pageWidth + 100);
  expect(await storedWidth(page)).toBe(String(pageWidth + 100));
  await expect(page.locator('html')).toHaveAttribute('data-td-shell-article-w', '');

  // The prepaint script restores the reader's width on the next page.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-td-shell-article-w', '');
  expect(await articleWidth(page)).toBe(pageWidth + 100);

  // Stepping back to the page's own width forgets the stored value.
  await page.keyboard.press('-');
  await expect.poll(() => articleWidth(page)).toBe(pageWidth);
  expect(await storedWidth(page)).toBeNull();
  await expect(page.locator('html')).not.toHaveAttribute('data-td-shell-article-w', '');

  // Never narrower than 600 px.
  for (let press = 0; press < 8; press += 1) await page.keyboard.press('-');
  await expect.poll(() => articleWidth(page)).toBe(600);
  expect(await storedWidth(page)).toBe('600');

  // Widening back stops at the page width before going past it.
  for (let press = 0; press < 8; press += 1) {
    await page.keyboard.press('=');
    if ((await storedWidth(page)) === null) break;
  }
  expect(await articleWidth(page)).toBe(pageWidth);
  expect(await storedWidth(page)).toBeNull();

  // Reaching the rails stores "fill", so a wider window still fills.
  for (let press = 0; press < 8; press += 1) await page.keyboard.press('+');
  await expect.poll(() => storedWidth(page)).toBe('none');
  expect(await articleWidth(page)).toBe(container);
  await page.setViewportSize({ width: 2200, height: 1000 });
  const wider = await page.locator('.td-shell-layout .td-shell-article')
    .evaluate((article) => Math.round(article.parentElement.clientWidth));
  await expect.poll(() => articleWidth(page)).toBe(wider);
});

test('page action keys run the same actions as the page menu', async ({ page }) => {
  await recordPageActions(page);
  await openDocs(page, { width: 1280, height: 800 });
  const manifest = await page.locator('#td-action-manifest')
    .evaluate((node) => JSON.parse(node.textContent || '{}'));
  const action = (id) => manifest.actions.find((candidate) => candidate.id === id);
  const opened = () => page.evaluate(() => window.__opened.map((entry) => entry.url));

  for (const [key, id] of [
    ['u', 'edit_page'],
    ['n', 'create_child_page'],
    ['i', 'create_issue'],
    ['m', 'view_markdown'],
  ]) {
    expect(action(id).available).toBe(true);
    await page.keyboard.press(key);
    await expect.poll(async () => (await opened()).at(-1)).toBe(new URL(action(id).url, page.url()).href);
  }
  const lastOpen = await page.evaluate(() => window.__opened.at(-1));
  expect(lastOpen.target).toBe('_blank');
  expect(lastOpen.features).toBe('noopener,noreferrer');

  await page.keyboard.press('p');
  await expect.poll(() => page.evaluate(() => window.__printed)).toBe(1);

  for (const [key, origin, parameter] of [
    ['[', 'https://chatgpt.com', 'prompt'],
    [']', 'https://claude.ai', 'q'],
    ['\\', 'https://gemini.google.com', 'q'],
  ]) {
    await page.keyboard.press(key);
    await expect.poll(async () => new URL((await opened()).at(-1)).origin).toBe(origin);
    const prompt = new URL((await opened()).at(-1)).searchParams.get(parameter);
    expect(prompt).toContain(page.url());
  }
  // Gemini also gets the prompt on the clipboard, copied before its tab opens.
  const gemini = new URL((await opened()).at(-1));
  expect(gemini.pathname).toBe('/app');
  expect(await page.evaluate(() => window.__copied)).toEqual([gemini.searchParams.get('q')]);

  // The same keys are inert inside a text field.
  const count = (await opened()).length;
  await page.evaluate(() => {
    const field = document.createElement('input');
    field.setAttribute('data-test-kbd-field', '');
    document.body.appendChild(field);
  });
  const field = page.locator('[data-test-kbd-field]');
  await field.focus();
  await field.press('u');
  await field.press('[');
  await field.press('\\');
  await expect(field).toHaveValue('u[\\');
  expect((await opened()).length).toBe(count);
  expect(await page.evaluate(() => window.__printed)).toBe(1);
});
