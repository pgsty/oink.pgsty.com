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

test('j and k jump quickly to adjacent outline items while inputs keep every key', async ({
  page,
}) => {
  await openDocs(page, { width: 1000, height: 500 });

  const outline = await page.evaluate(() => {
    const offset =
      (parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--td-shell-nav-h',
        ),
      ) || 0) + 24;
    const max = document.documentElement.scrollHeight - innerHeight;
    return Array.from(
      document.querySelectorAll('#TableOfContents a[href^="#"]'),
    )
      .slice(0, 2)
      .map((anchor) => {
        const hash = anchor.getAttribute('href');
        const heading = document.getElementById(hash.slice(1));
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
  await sidebarToggle.click();
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

test('t flips the color theme and l switches the language', async ({
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
  await openDocs(page);
  const toggle = page.locator('[data-td-footer-toggle]');
  const grid = page.locator('#td-site-footer');
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
