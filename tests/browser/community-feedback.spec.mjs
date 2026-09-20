import { expect, test } from '@playwright/test';

async function openDocs(page, locale = '', color = 'light') {
  await page.addInitScript(({ color }) => {
    localStorage.removeItem('td-shell-sidebar-collapsed');
    localStorage.removeItem('td-shell-toc-collapsed');
    localStorage.setItem('td-color-theme', color);
  }, { color });
  await page.goto(`${locale}/docs/customize/config/`);
  await page.evaluate(() => window.OinkSidebar.ready);
}

async function expectIsolated(page, isolated) {
  const panel = page.locator('.td-shell-sidebar__panel');
  if (isolated) {
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await expect(panel.getByRole('link')).toHaveCount(0);
    expect(await panel.evaluate(el => [...el.children].every(child => child.inert))).toBe(true);
    expect(await panel.evaluate(el => el.contains(document.activeElement))).toBe(false);
  } else {
    await expect(panel).not.toHaveAttribute('aria-hidden');
    expect(await panel.evaluate(el => [...el.children].some(child => child.inert))).toBe(false);
  }
}

for (const locale of ['', '/zh']) {
  for (const color of ['light', 'dark']) {
    test(`${locale || 'en'} ${color}: sidebar isolation preserves restore, hover, drawer and breakpoint behavior`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await openDocs(page, locale, color);
      await page.locator('.td-shell-sidebar__collapse').click();
      await expectIsolated(page, true);
      const restore = page.locator('.td-shell-float [data-td-shell-sidebar-toggle]');
      await expect(restore).toBeFocused();
      for (let index = 0; index < 12; index += 1) {
        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => !!document.activeElement.closest('[inert], [aria-hidden="true"]'))).toBe(false);
      }
      await page.mouse.move(2, 300);
      await expect(page.locator('#td-shell-sidebar')).toHaveClass(/td-shell-sidebar--overlay/);
      await expectIsolated(page, false);
      await page.mouse.move(700, 300);
      await expectIsolated(page, true);
      await restore.click();
      await expectIsolated(page, false);
      await expect(page.locator('.td-shell-sidebar__collapse')).toBeFocused();

      await page.setViewportSize({ width: 375, height: 813 });
      await expectIsolated(page, true);
      const opener = page.locator('[data-td-shell-drawer-open]:visible');
      await opener.click();
      await expectIsolated(page, false);
      const close = page.locator('button[data-td-shell-drawer-close]');
      await expect(close).toBeFocused();
      for (const button of await page.locator('[data-td-shell-aside] [data-td-shell-tree-toggle]').all()) {
        if (await button.getAttribute('aria-expanded') === 'true') await button.click();
      }
      const firstControl = page.locator('#td-shell-sidebar [data-td-shell-search-open]:visible');
      const lastControl = page.locator('[data-td-shell-aside] [data-td-shell-tree-toggle]').last();
      await firstControl.focus();
      await expect(firstControl).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(lastControl).toBeFocused();
      expect(await page.evaluate(() => !!document.activeElement.closest('[inert], [hidden]'))).toBe(false);
      await page.keyboard.press('Tab');
      await expect(firstControl).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(opener).toBeFocused();
      await expectIsolated(page, true);
      await opener.click();
      await page.locator('.td-shell-drawer-backdrop').click({ position: { x: 10, y: 300 } });
      await expectIsolated(page, true);
      await opener.click();
      await page.setViewportSize({ width: 1024, height: 900 });
      await expect(page.locator('html')).not.toHaveAttribute('data-td-shell-drawer');
      await expectIsolated(page, false);
      expect(await page.locator('html').evaluate(el => getComputedStyle(el).overflowY)).not.toBe('hidden');
    });
  }
}

for (const locale of ['', '/zh']) {
  test(`${locale || 'en'}: sidebar readiness observes the hydrated active path`, async ({ page }) => {
    await page.addInitScript(() => {
      function snapshot() {
        const path = [...document.querySelectorAll('#td-sidebar-menu .td-active-path > .td-shell-tree__row [data-td-shell-tree-toggle]')];
        return {
          pending: !!document.querySelector('[data-td-sidebar-hydrate-active]'),
          active: !!document.querySelector('#td-sidebar-menu a[aria-current="page"]'),
          pathCount: path.length,
          expanded: path.every(button => window.OinkSidebar.getState(button.getAttribute('aria-controls')).expanded),
        };
      }
      document.addEventListener('oink:sidebar-ready', () => { window.sidebarReadyEvent = snapshot(); });
      document.addEventListener('DOMContentLoaded', () => {
        window.OinkSidebar.ready.then(() => { window.sidebarReadyPromise = snapshot(); });
      });
    });
    await page.goto(`${locale}/docs/customize/config/`);
    await page.waitForFunction(() => window.sidebarReadyPromise && window.sidebarReadyEvent);
    for (const state of await page.evaluate(() => [window.sidebarReadyPromise, window.sidebarReadyEvent])) {
      expect(state.pending).toBe(false);
      expect(state.active).toBe(true);
      expect(state.pathCount).toBeGreaterThan(0);
      expect(state.expanded).toBe(true);
    }
  });

  test(`${locale || 'en'}: collapsed right rail isolates focus without disabling relocated contents`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${locale}/docs/customize/config/`);
    await page.evaluate(() => window.OinkSidebar.ready);
    const panel = page.locator('.td-shell-toc__panel');
    const hide = panel.locator('[data-td-shell-right-toggle]');
    const restore = page.locator('.td-shell-toc-float [data-td-shell-right-toggle]');
    await hide.click();
    await expect(panel).toHaveAttribute('inert');
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await expect(restore).toBeFocused();
    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press('Tab');
      expect(await panel.evaluate(el => el.contains(document.activeElement))).toBe(false);
    }
    await restore.click();
    await expect(panel).not.toHaveAttribute('inert');
    await expect(panel).not.toHaveAttribute('aria-hidden');
    await expect(hide).toBeFocused();
    await hide.click();
    await page.reload();
    await expect(panel).toHaveAttribute('inert');
    await page.setViewportSize({ width: 1024, height: 900 });
    const relocated = page.locator('[data-td-shell-aside-slot] [data-td-shell-aside]');
    await expect(relocated).toBeVisible();
    const heading = relocated.locator('[aria-controls="td-shell-aside-toc"]');
    await heading.focus();
    await expect(heading).toBeFocused();
    expect(await heading.evaluate(el => !!el.closest('[inert], [aria-hidden="true"]'))).toBe(false);
    await page.setViewportSize({ width: 375, height: 813 });
    await page.locator('[data-td-shell-drawer-open]:visible').click();
    await heading.focus();
    await expect(heading).toBeFocused();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(panel).toHaveAttribute('inert');
    expect(await panel.evaluate(el => el.contains(document.activeElement))).toBe(false);
    await restore.click();
    await expect(hide).toBeFocused();
  });
}

test('disclosure API commits once, scopes targets, and survives responsive relocation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openDocs(page);
  await page.evaluate(() => {
    window.disclosureEvents = [];
    document.addEventListener('oink:sidebar-disclosure', event => {
      const button = document.querySelector(`[aria-controls="${event.detail.id}"]`);
      const target = document.getElementById(event.detail.id);
      window.disclosureEvents.push({ ...event.detail,
        atomic: button.getAttribute('aria-expanded') === String(event.detail.expanded) &&
          target.classList.contains('td-is-open') === event.detail.expanded &&
          button.getAttribute('aria-label') === (event.detail.expanded ? button.dataset.tdLabelCollapse : button.dataset.tdLabelExpand),
      });
    });
  });
  const button = page.locator('#td-sidebar-menu .td-shell-tree__item:not(.td-active-path) > .td-shell-tree__row [data-td-shell-tree-toggle]').first();
  const id = await button.getAttribute('aria-controls');
  await button.click();
  const state = await page.evaluate(id => window.OinkSidebar.getState(id), id);
  expect(await page.evaluate(state => window.OinkSidebar.setExpanded(state.id, state.expanded), state)).toBe(true);
  expect(await page.evaluate(() => window.OinkSidebar.setExpanded('td-main-content', true))).toBe(false);
  expect(await page.evaluate(() => window.disclosureEvents)).toEqual([{ id, expanded: state.expanded, source: 'user', atomic: true }]);
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await page.evaluate(() => window.disclosureEvents.some(event => event.source === 'responsive'))).toBe(true);
  expect(await page.evaluate(() => window.disclosureEvents.every(event => event.atomic))).toBe(true);
});

test('search returns focus to the visible restore control after a hover panel closes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openDocs(page);
  await page.locator('.td-shell-sidebar__collapse').click();
  await page.mouse.move(700, 300);
  await expectIsolated(page, true);
  await page.waitForTimeout(180); // The deliberate post-toggle hover lock.
  await page.mouse.move(2, 300);
  await expectIsolated(page, false);
  await page.locator('.td-shell-sidebar__search').click();
  await page.mouse.move(700, 300);
  await expectIsolated(page, true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.td-shell-float [data-td-shell-sidebar-toggle]')).toBeFocused();
});

test('downstream restoration keeps the active path and tolerates blocked storage', async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', async () => {
      const sidebar = await window.OinkSidebar.ready;
      document.querySelectorAll('#td-sidebar-menu [data-td-shell-tree-toggle]').forEach(button => {
        sidebar.setExpanded(button.getAttribute('aria-controls'), false);
      });
      window.sidebarRestored = true;
    });
  });
  await openDocs(page);
  await page.waitForFunction(() => window.sidebarRestored);
  const path = page.locator('#td-sidebar-menu .td-active-path > .td-shell-tree__row [data-td-shell-tree-toggle]');
  for (const button of await path.all()) await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await page.reload();
  await page.waitForFunction(() => window.sidebarRestored);
  await expect(page.locator('#td-sidebar-menu a[aria-current="page"]')).toBeVisible();
});

for (const color of ['light', 'dark', 'forced']) {
  test(`${color}: pointer reading focus stays quiet while keyboard and skip-link focus remain visible`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    if (color === 'forced') await page.emulateMedia({ forcedColors: 'active' });
    await openDocs(page, '', color === 'dark' ? 'dark' : 'light');
    for (const [clickTarget, focused] of [
      ['.td-content h1', '#td-main-content'],
      ['.td-table-scroll th', '.td-table-scroll'],
      ['pre.chroma', 'pre.chroma'],
    ]) {
      const target = page.locator(clickTarget).first();
      const container = page.locator(focused).first();
      await target.click({ position: { x: 15, y: 15 } });
      await expect(container).toBeFocused();
      await page.keyboard.press('z');
      await expect(container).toHaveCSS('outline-style', 'none');
      await expect(container).toHaveAttribute('data-td-pointer-focus');
      await page.keyboard.press('Tab');
      await expect(container).not.toHaveAttribute('data-td-pointer-focus');
      // A fresh programmatic focus after keyboard input receives the same cue
      // as keyboard navigation; it cannot inherit the old pointer exemption.
      await container.focus();
      if (focused === '#td-main-content') {
        await expect(page.locator('.td-content h1').first()).toHaveCSS('outline-style', 'solid');
      } else await expect(container).toHaveCSS('outline-style', 'solid');
    }
    await page.goto('/docs/customize/config/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.td-skip-link');
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#td-main-content')).toBeFocused();
    await expect(page.locator('.td-content h1').first()).toHaveCSS('outline-style', 'solid');
  });
}

for (const locale of ['', '/zh']) {
  test(`${locale || 'en'}: group-only section keeps children, keyboard disclosure and the no-script fallback`, async ({ page, browser }) => {
    const path = `${locale}/tests/group-demo/group-only/one/`;
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path);
    const group = page.locator('.td-shell-tree__group').filter({ hasText: locale ? '没有目录页的分组' : 'Group without a landing page' });
    const row = group.locator('..');
    await expect(row.locator('a')).toHaveCount(0);
    const toggle = row.locator('[data-td-shell-tree-toggle]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const child = page.locator(`#td-sidebar-menu a[href="${locale}/tests/group-demo/group-only/two/"]`);
    await expect(child).toBeVisible();
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(child).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(child).toBeVisible();
    const first = page.locator(`#td-sidebar-menu a[href="${path}"]`);
    for (const [back, forward] of [['ArrowLeft', 'ArrowRight'], ['a', 'd']]) {
      await child.focus();
      await page.keyboard.press(back);
      await expect(toggle).toBeFocused();
      await page.keyboard.press(back);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await page.keyboard.press(forward);
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press(forward);
      await expect(first).toBeFocused();
      await page.keyboard.press('w');
      await expect(toggle).toBeFocused();
      await page.keyboard.press('s');
      await expect(first).toBeFocused();
    }
    await expect(page.locator('[data-td-pager-next]')).toHaveAttribute('href', `${locale}/tests/group-demo/group-only/two/`);
    await expect(page.locator(`a[href="${locale}/tests/group-demo/group-only/"]`)).toHaveCount(0);
    const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const staticPage = await noScript.newPage();
    await staticPage.goto(new URL(path, page.url()).href);
    await expect(staticPage.locator(`#td-sidebar-menu a[href="${locale}/tests/group-demo/group-only/two/"]`)).toBeVisible();
    await noScript.close();
  });
}

test('search-tail rows use native pointer, keyboard and ARIA behavior and hand focus to another dialog', async ({ page }) => {
  await openDocs(page, '/zh');
  await page.evaluate(() => {
    window.tailContexts = [];
    window.tailActivations = [];
    window.removeTail = window.OinkCommandPalette.registerSearchTail({
      id: 'review-helper',
      rows(context) {
        window.tailContexts.push(context);
        return [{ id: 'ask', title: 'Ask <Helper>', description: context.query }];
      },
      activate(row, context) {
        window.tailActivations.push({ row, query: context.query, locale: context.locale });
        context.handoff();
        const dialog = document.createElement('dialog');
        const button = document.createElement('button');
        button.textContent = 'Assistant focus';
        dialog.appendChild(button);
        document.body.appendChild(dialog);
        dialog.showModal();
        button.focus();
        window.tailSignal = context.signal;
        return Promise.resolve();
      },
    });
    window.OinkCommandPalette.instance.open();
  });
  expect(await page.evaluate(() => window.tailContexts.length)).toBe(0);
  const input = page.locator('.td-shell-search__input');
  await input.fill('sidebar');
  const row = page.getByRole('option', { name: /Ask <Helper>/ });
  await expect(row).toBeVisible();
  expect(await page.evaluate(() => window.tailContexts.at(-1).locale)).toBe('zh-CN');
  expect(await page.evaluate(() => window.OinkCommandPalette.instance.rows().at(-1).type)).toBe('extension');
  await page.keyboard.press('Control+End');
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await expect(input).toHaveAttribute('aria-activedescendant', await row.getAttribute('id'));
  await page.keyboard.press('ArrowUp');
  await row.hover();
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await row.click();
  await expect(page.getByRole('button', { name: 'Assistant focus' })).toBeFocused();
  expect(await page.evaluate(() => window.tailActivations)).toEqual([{
    row: { id: 'ask', title: 'Ask <Helper>', description: 'sidebar', icon: '', available: true, disabledReason: '' },
    query: 'sidebar', locale: 'zh-CN',
  }]);
  expect(await page.evaluate(() => window.tailSignal.aborted)).toBe(false);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { window.removeTail(); window.OinkCommandPalette.instance.open(); });
  await expect(page.getByRole('option', { name: /Ask <Helper>/ })).toHaveCount(0);
});
