import { expect, test } from '@playwright/test';

const docsPath = '/docs/customize/config/';

async function openDocs(page, viewport = { width: 1280, height: 600 }) {
  await page.setViewportSize(viewport);
  await page.goto(docsPath, { waitUntil: 'domcontentloaded' });
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

test('Enter opens the focused page and q/e follow the tree order', async ({
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

test('homepage n, j, and k jump between landing sections while h hides page chrome', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const sections = page.locator('[data-td-landing] > section[id]');
  await expect(sections).toHaveCount(7);
  expect(await sections.nth(0).getAttribute('id')).toBe('hero');
  expect(await sections.nth(1).getAttribute('id')).toBe('capabilities');

  await page.keyboard.press('j');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => location.hash)).toBe('#capabilities');
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);

  await page.keyboard.press('k');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(3);
  expect(await page.evaluate(() => location.hash)).toBe('#hero');

  await page.keyboard.press('n');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => location.hash)).toBe('#capabilities');
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);

  await page.keyboard.press('h');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-header]')).toBeHidden();
  await expect(page.locator('[data-td-shell-footer]')).toBeHidden();

  await page.keyboard.press('z');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-header]')).toBeVisible();
  await page.keyboard.press('z');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-header]')).toBeHidden();
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
  await page.keyboard.press('h');
  await page.keyboard.press('s');
  await expect(focusedTreeLink(page)).toHaveCount(0);
});

test('h and z toggle the chrome-free reading mode and survive paging', async ({
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

  await page.keyboard.press('h');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('#td-shell-sidebar')).toBeVisible();
});

test('t steps the visual style, y cycles light/dark/system, and l/x switch the language', async ({
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

  // The bottom-right shortcut help lists K, J, H/Z, L/X, T, Y, and ; (and omits V on docs pages).
  for (const keycap of ['K', 'J', 'H', 'Z', 'L', 'X', 'T', 'Y', ';']) {
    await expect(
      page.locator('.td-shell-keyboard-help kbd', { hasText: new RegExp(`^${keycap}$`) }),
    ).toHaveCount(1);
  }
  await expect(
    page.locator('.td-shell-keyboard-help kbd', { hasText: /^V$/ }),
  ).toHaveCount(0);
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('Zen Mode');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('Switch section');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('Shortcut help');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('Previous heading');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('Next heading');

  await page.keyboard.press('l');
  await page.waitForURL(`**/zh${docsPath}`);
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('禅意模式');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('切换栏目');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('热键说明');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('上一个标题');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('下一个标题');
  await page.keyboard.press('x');
  await page.waitForURL(`**${docsPath}`);
  await page.keyboard.press('x');
  await page.waitForURL(`**/zh${docsPath}`);
  await page.keyboard.press('l');
  await page.waitForURL(`**${docsPath}`);
});

test('; toggles the top-layer shortcut help dialog anywhere, including Zen Mode', async ({
  page,
}) => {
  await openDocs(page, { width: 1280, height: 720 });
  const dialog = page.locator('[data-td-keyboard-dialog]');

  // Open from top of page (footer is off-screen); dialog renders centered in viewport.
  await page.keyboard.press(';');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(dialog.locator('[data-td-keyboard-dialog-close]')).toBeFocused();

  // Desktop renders the two sections side by side without duplicate IDs.
  const geometry = await page.evaluate(() => {
    const el = document.querySelector('[data-td-keyboard-dialog]');
    const sections = Array.from(el.querySelectorAll('.td-shell-keyboard-help__section'));
    const rects = sections.map((s) => s.getBoundingClientRect());
    const ids = Array.from(document.querySelectorAll('[id]')).map((n) => n.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    return {
      dialogRect: el.getBoundingClientRect(),
      sectionRects: rects,
      dupes,
    };
  });
  expect(geometry.dupes).toEqual([]);
  expect(geometry.sectionRects).toHaveLength(2);
  expect(geometry.dialogRect.top).toBeGreaterThanOrEqual(0);
  expect(geometry.dialogRect.bottom).toBeLessThanOrEqual(720);
  expect(Math.abs(geometry.sectionRects[0].top - geometry.sectionRects[1].top)).toBeLessThanOrEqual(2);
  expect(geometry.sectionRects[1].left).toBeGreaterThan(geometry.sectionRects[0].left + 200);

  // Other shortcuts stand down while the help dialog is open.
  await page.keyboard.press('z');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-kbd-zen', '');

  // Second ; closes it.
  await page.keyboard.press(';');
  await expect(dialog).toBeHidden();

  // Works inside Zen Mode even though the footer is display:none.
  await page.keyboard.press('z');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('[data-td-shell-footer]')).toBeHidden();
  await page.keyboard.press(';');
  await expect(dialog).toBeVisible();

  // Escape closes it without leaving Zen Mode.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');

  // Clicking the backdrop closes it too.
  await page.keyboard.press(';');
  await expect(dialog).toBeVisible();
  await page.mouse.click(8, 8);
  await expect(dialog).toBeHidden();

  // Narrow viewport collapses cleanly to one column inside the viewport.
  await page.setViewportSize({ width: 390, height: 700 });
  await page.keyboard.press(';');
  await expect(dialog).toBeVisible();
  const mobileBox = await dialog.boundingBox();
  expect(mobileBox).not.toBeNull();
  expect(mobileBox.x).toBeGreaterThanOrEqual(0);
  expect(mobileBox.x + mobileBox.width).toBeLessThanOrEqual(390.5);
  await dialog.locator('[data-td-keyboard-dialog-close]').click();
  await expect(dialog).toBeHidden();
});

test('v cycles layout modes on blog and release index pages and m/,/. control visible gallery view', async ({
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
  for (const keycap of ['V', 'M', '<', '>']) {
    await expect(
      page.locator('.td-shell-keyboard-help kbd', { hasText: new RegExp(`^${keycap}$`) }),
    ).toHaveCount(1);
  }

  const gallery = page.locator('[data-td-blog-gallery]');
  const slider = gallery.locator('input[data-gallery-size]');

  // While cards view is active, the hidden gallery ignores m/,/..
  await page.keyboard.press('m');
  await page.keyboard.press('.');
  await expect(gallery).toHaveAttribute('data-td-mode', 'wall');
  await expect(slider).toHaveValue('240');

  // Cycle cards -> table -> gallery with V.
  await page.keyboard.press('v');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'table');
  await page.keyboard.press('v');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'gallery');

  // Once gallery view is visible, m cycles modes and ,/< ./> adjust tile size.
  for (const expected of ['cards', 'seamless', 'wall']) {
    await page.keyboard.press('m');
    await expect(gallery).toHaveAttribute('data-td-mode', expected);
  }
  await page.keyboard.press(',');
  await expect(slider).toHaveValue('220');
  await page.keyboard.press('<');
  await expect(slider).toHaveValue('200');
  await page.keyboard.press('.');
  await expect(slider).toHaveValue('220');
  await page.keyboard.press('>');
  await expect(slider).toHaveValue('240');

  // Continue V cycle gallery -> list -> cards.
  await page.keyboard.press('v');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'list');
  await page.keyboard.press('v');
  await expect(page.locator('html')).toHaveAttribute('data-td-blog-index', 'cards');
});

test('f and c open the palette in search and command mode', async ({
  page,
}) => {
  await openDocs(page);
  const dialog = page.locator('#td-shell-search');
  const input = dialog.locator('.td-shell-search__input');

  await page.keyboard.press('f');
  await expect(dialog).toBeVisible();
  await expect(input).toHaveValue('');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.keyboard.press('c');
  await expect(dialog).toBeVisible();
  await expect(input).toHaveValue('>');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
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
