import { expect, test } from '@playwright/test';

const docsPath = '/docs/configure/overview/';

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
  await expect(sections).toHaveCount(5);
  expect(await sections.nth(0).getAttribute('id')).toBe('hero');
  expect(await sections.nth(1).getAttribute('id')).toBe('release');

  await page.keyboard.press('j');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => location.hash)).toBe('#release');
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);

  await page.keyboard.press('k');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => scrollY)).toBeLessThan(3);
  expect(await page.evaluate(() => location.hash)).toBe('#hero');

  await page.keyboard.press('n');
  await page.waitForTimeout(180);
  expect(await page.evaluate(() => location.hash)).toBe('#release');
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);

  await page.keyboard.press('h');
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('.landing-header')).toBeHidden();
  await expect(page.locator('[data-td-shell-footer]')).toBeHidden();
});

test('docs and blog cascades disable desktop navbars and keep slim footers', async ({
  page,
}) => {
  for (const path of ['/docs/configure/overview/', '/blog/release/0.4.0/']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.landing-header')).toHaveCount(0);
    await expect(page.locator('.td-shell-subnav')).toHaveCount(1);
    await expect(page.locator('.td-shell-footline')).toHaveCount(1);
    await expect(page.locator('#td-site-footer')).toHaveCount(0);
  }
});

test('the narrowest tier forces the navbar-off mobile bar to stay visible', async ({
  page,
}) => {
  await openDocs(page, { width: 479, height: 844 });
  const header = page.locator('.td-shell-subnav');
  await expect(page.locator('.landing-header')).toHaveCount(0);
  await expect(header).toBeVisible();
  await expect(header).toHaveCSS('position', 'sticky');

  const [bar, menu] = await Promise.all([
    header.boundingBox(),
    header.locator('.td-shell-subnav__menu').boundingBox(),
  ]);
  expect(bar).not.toBeNull();
  expect(menu).not.toBeNull();
  expect(
    Math.abs(menu.x + menu.width / 2 - (bar.x + bar.width / 2)),
  ).toBeLessThanOrEqual(1);

  await page.evaluate(() => sessionStorage.setItem('td-kbd-zen', '1'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-td-kbd-zen', '');
  await expect(page.locator('.td-shell-subnav')).toBeVisible();
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

test('h toggles the chrome-free reading mode and survives paging', async ({
  page,
}) => {
  await openDocs(page);
  const sidebar = page.locator('#td-shell-sidebar');
  const toc = page.locator('.td-shell-toc');
  const footer = page.locator('[data-td-shell-footer]');
  await expect(sidebar).toBeVisible();

  await page.keyboard.press('h');
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

test('t flips the color theme and l/y switch the language', async ({
  page,
}) => {
  await openDocs(page);
  const initial = await page.evaluate(() =>
    document.documentElement.getAttribute('data-bs-theme'),
  );
  await page.keyboard.press('t');
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.documentElement.getAttribute('data-bs-theme'),
      ),
    )
    .toBe(initial === 'dark' ? 'light' : 'dark');

  await page.keyboard.press('l');
  await page.waitForURL(`**/zh${docsPath}`);
  await page.keyboard.press('y');
  await page.waitForURL(`**${docsPath}`);
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
