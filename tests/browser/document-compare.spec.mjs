import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const reader = 'dialog[data-td-compare]';
const sync = '[data-td-compare-sync]';
async function open(page, path = '/tests/compare-reader/') {
  await page.goto(path);
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await expect(page.locator(sync)).toBeEnabled();
  return page.frames().filter(frame => frame.url().includes('oink_compare_pane=1'));
}
async function scrollTo(frame, id, fraction = 0) {
  await frame.evaluate(({ id, fraction }) => {
    document.dispatchEvent(new WheelEvent('wheel'));
    const heading = document.getElementById(id);
    scrollTo({ top: scrollY + heading.getBoundingClientRect().top - 24 + fraction, behavior: 'instant' });
  }, { id, fraction });
}
async function closed(page) { await expect(page.locator(reader)).toHaveCount(0); }

test('compare: the entry leaves root-page titles unobstructed', async ({ page }) => {
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/docs/', '/book/', '/blog/', '/zh/docs/', '/zh/book/', '/zh/blog/']) {
      await page.goto(path);
      const button = page.locator('[data-td-compare-open]');
      await expect(button).toBeVisible();
      const entry = await button.boundingBox();
      const title = await page.locator('.td-content h1').boundingBox();
      expect(entry.y + entry.height).toBeLessThanOrEqual(title.y);
    }
  }
});

for (const locale of ['', '/zh']) {
  test(`${locale || 'en'} compare: lazy loading, semantic sync in both directions and independent reading`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${locale}/tests/compare-reader/`);
    expect(await page.evaluate(() => performance.getEntriesByType('resource').some(r => /document-compare.*\.js/.test(r.name)))).toBe(false);
    await page.locator('[data-td-compare-open]').click();
    await expect(page.locator(sync)).toBeEnabled();
    const [left, right] = page.frames().filter(f => f.url().includes('oink_compare_pane=1'));
    await expect(page.locator('[data-td-compare-frame]')).toHaveCount(2);
    await expect(page.locator(sync)).toBeChecked();
    await scrollTo(left, 'transactions');
    await expect.poll(() => right.locator('#transactions').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
    await scrollTo(right, 'middle');
    await expect.poll(() => left.locator('#middle').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
    await page.locator(sync).uncheck();
    const before = await right.evaluate(() => scrollY);
    await scrollTo(left, 'isolation');
    await expect.poll(() => left.locator('#isolation').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
    expect(await right.evaluate(() => scrollY)).toBe(before);
    await page.locator(sync).check();
    await expect.poll(() => right.locator('#isolation').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
    for (const frame of [left, right]) {
      expect(await frame.evaluate(() => !!window.OinkComparePane)).toBe(true);
      await expect(frame.locator('.td-site-header')).toBeHidden();
      await expect(frame.locator('[data-td-compare-open]')).toBeHidden();
      await expect(frame.locator('.td-page-end')).toBeHidden();
    }
    await page.locator('[data-td-compare-close]').click();
    await closed(page);
    await expect(page.locator('[data-td-compare-open]')).toBeFocused();
  });
}

test('compare: opening preserves the current passage and closing restores host position', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  const original = await page.evaluate(() => {
    scrollTo({ top: scrollY + document.getElementById('middle').getBoundingClientRect().top + 80, behavior: 'instant' });
    return scrollY;
  });
  await page.evaluate(() => window.OinkActions.run('compare_translations'));
  await expect(page.locator(sync)).toBeEnabled();
  const left = page.frames().find(f => f.url().includes('/tests/compare-reader/?'));
  expect(await left.evaluate(() => scrollY)).toBeGreaterThan(500);
  expect(await left.evaluate(() => [...document.querySelectorAll('.td-content h2')].filter(el => el.getBoundingClientRect().top <= 24).at(-1)?.id)).toBe('middle');
  await page.goBack();
  await closed(page);
  expect(await page.evaluate(() => scrollY)).toBe(original);
});

test('compare: closing returns focus to the reading place, and one target needs no menu', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  const link = page.locator('.td-content a', { hasText: 'Documentation home' }).first();
  await link.focus();
  await page.keyboard.press('b');
  await expect(page.locator(sync)).toBeEnabled();
  // A single translation is a plain label, not a one-option menu.
  await expect(page.locator('[data-td-compare-language]')).toHaveCount(0);
  await expect(page.locator('.td-compare__pane-heading')).toHaveText(['English', '简体中文']);
  await page.keyboard.press('Escape');
  await closed(page);
  await expect(link).toBeFocused();
});

test('compare: scroll keys scroll the reading pane right after opening', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const [left, right] = await open(page);
  // Focus stays on the title so the dialog is announced; keys still scroll.
  await expect(page.locator('.td-compare__title')).toBeFocused();
  await page.keyboard.press('PageDown');
  await expect.poll(() => left.evaluate(() => scrollY)).toBeGreaterThan(300);
  await expect.poll(() => right.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.keyboard.press('End');
  await expect.poll(() => left.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  await page.keyboard.press('Home');
  await expect.poll(() => left.evaluate(() => scrollY)).toBe(0);
  // Space on the Sync switch still toggles it rather than scrolling.
  await page.locator(sync).focus();
  await page.keyboard.press('Space');
  await expect(page.locator(sync)).not.toBeChecked();
});

test('compare: a pane navigated to another document by script fails safely', async ({ page }) => {
  const [left] = await open(page);
  await left.evaluate(() => { setTimeout(() => location.assign('/docs/'), 0); });
  await expect(page.locator('[data-td-compare-side="0"] .td-compare__failure')).toBeVisible();
  await expect(page.locator('[data-td-compare-side="0"] .td-compare__retry')).toBeVisible();
  await expect(page.locator(sync)).toBeDisabled();
});

test('compare: the Sync choice is remembered for the next opening', async ({ page }) => {
  await open(page);
  await page.locator(sync).click();
  await expect(page.locator(sync)).not.toBeChecked();
  await page.locator('[data-td-compare-close]').click();
  await closed(page);
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled();
  await expect(page.locator(sync)).not.toBeChecked();
});

test('compare: continuous owner scrolling keeps the follower in step', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const error = await page.evaluate(async () => {
    const geometry = window.OinkCompareScroll;
    const [left, right] = [...document.querySelectorAll('[data-td-compare-frame]')].map(frame => frame.contentWindow);
    const rows = win => [...win.document.querySelectorAll('#td-main-content .td-content :is(h2,h3,h4,h5,h6)[id]')]
      .filter(node => node.getClientRects().length)
      .map(node => ({ id: node.id, y: node.getBoundingClientRect().top + win.scrollY - 24 }));
    const max = win => win.document.documentElement.scrollHeight - win.innerHeight;
    const map = geometry.create(rows(left), rows(right), max(left), max(right));
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    left.document.dispatchEvent(new left.WheelEvent('wheel'));
    const errors = [];
    // Trackpads and momentum deliver a scroll step on every frame.
    for (let step = 0; step < 40; step++) {
      left.scrollBy({ top: 25, behavior: 'instant' });
      await frame(); await frame();
      errors.push(Math.abs(geometry.project(map, left.scrollY, 0) - right.scrollY));
    }
    return errors.sort((a, b) => a - b)[Math.floor(errors.length * 0.9)];
  });
  expect(error).toBeLessThan(30);
});

test('compare: B toggles the localized duo view and the toolbar stays icon-only where requested', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('B');
  await expect(page.locator('.td-shell-keyboard-help')).toContainText('Duo View');
  await page.keyboard.press('b');
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await expect(page.locator('.td-compare__title')).toHaveText('Duo View');
  await expect(page.getByRole('switch', { name: 'Sync Scroll' })).toBeChecked();
  await expect(page.locator('[data-td-compare-close]')).toHaveText('');
  await expect(page.locator('[data-td-compare-close]')).toHaveAttribute('aria-label', 'Close');
  await expect(page.locator('[data-td-compare-close]')).toHaveAttribute('aria-keyshortcuts', 'Escape B');
  // B in the toolbar returns to the page and leaves no reader history entry.
  await expect(page.locator(sync)).toBeEnabled();
  await page.keyboard.press('b');
  await closed(page);
  await expect(page).toHaveURL(/\/tests\/compare-reader\/$/);
  expect(await page.evaluate(() => history.state?.oinkCompareReader ?? null)).toBeNull();
  await expect(page.locator('[data-td-compare-open]')).toHaveAttribute('aria-label', 'Open duo view');
  await expect(page.locator('[data-td-compare-open]')).toHaveAttribute('aria-keyshortcuts', 'B');
  // B inside a pane closes it too, but not while typing or with a modifier.
  const [left] = await open(page);
  await left.locator('.td-content h1').click();
  await page.keyboard.press('Shift+B');
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await page.keyboard.press('b');
  await closed(page);
});

test('compare: a reload reopens the reader and Back still closes it', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled();
  const length = await page.evaluate(() => history.length);
  const token = await page.evaluate(() => history.state.oinkCompareReader);
  await page.reload();
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await expect(page.locator(sync)).toBeEnabled();
  expect(await page.evaluate(() => history.length)).toBe(length);
  expect(await page.evaluate(() => history.state.oinkCompareReader)).toBe(token);
  await page.goBack();
  await closed(page);
  await expect(page).toHaveURL(/\/tests\/compare-reader\/$/);
  expect(await page.evaluate(() => history.state?.oinkCompareReader ?? null)).toBeNull();
});

test('compare: forward restores the reader entry without an extra Back stop', async ({ page }) => {
  await page.goto('/book/');
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled();
  const length = await page.evaluate(() => history.length);
  await page.reload();
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await page.goBack();
  await closed(page);
  await page.goForward();
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await expect(page.locator(sync)).toBeEnabled();
  expect(await page.evaluate(() => history.length)).toBe(length);
  await page.goBack();
  await closed(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/book\/$/);
});

test('compare: Back cancels a pending reload resume', async ({ page }) => {
  await page.goto('/book/');
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled();

  let release;
  let requested;
  const gate = new Promise(resolve => { release = resolve; });
  const scriptRequested = new Promise(resolve => { requested = resolve; });
  await page.route('**/js/chunks/document-compare*.js', async route => {
    requested();
    await gate;
    await route.continue();
  });
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await scriptRequested;
    await page.evaluate(() => history.back());
    await expect.poll(() => page.evaluate(() => history.state?.oinkCompareReader ?? null)).toBeNull();
  } finally {
    release();
  }
  // Wait for the delayed runtime and the entry's promise, so the assertion
  // cannot pass merely because the stale restore has not run yet.
  await page.waitForFunction(() => Boolean(window.OinkCompare));
  await expect(page.locator('[data-td-compare-open]')).toBeEnabled();
  await closed(page);
  expect(await page.evaluate(() => history.state?.oinkCompareReader ?? null)).toBeNull();
  await expect(page).toHaveURL(/\/tests\/compare-reader\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/book\/$/);
});

test('compare: content components, fragment history and nested Escape keep working', async ({ page }) => {
  const [left] = await open(page);
  await left.getByRole('tab', { name: 'Details', exact: true }).click();
  await expect(left.getByText('Content in a second tab.')).toBeVisible();
  await left.getByRole('tab', { name: 'SQL', exact: true }).click();
  await expect(left.locator('pre')).toContainText("SELECT 'translation reader'");
  await left.locator('.td-table-expand').click({ force: true });
  await expect(left.locator('[data-td-table-reader][open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(left.locator('[data-td-table-reader][open]')).toHaveCount(0);
  await expect(page.locator(reader)).toBeVisible();
  await left.getByRole('link', { name: 'First section', exact: true }).click();
  await expect.poll(() => left.locator('#first').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
  await page.goBack();
  await closed(page);
});

test('compare: a fragment link into a hidden tab reveals its panel without adding history', async ({ page }) => {
  const [left] = await open(page);
  const length = await page.evaluate(() => history.length);
  const id = await left.evaluate(() => {
    const panel = [...document.querySelectorAll('.td-tabs__panel')].find(candidate => candidate.hidden);
    const target = panel.querySelector('p') || panel;
    target.id ||= 'compare-hidden-tab-target';
    const link = document.createElement('a');
    link.href = `#${target.id}`;
    link.textContent = 'Jump into the hidden tab';
    document.querySelector('.td-content').prepend(link);
    return target.id;
  });
  await expect(left.locator(`#${id}`)).toBeHidden();
  await left.getByRole('link', { name: 'Jump into the hidden tab', exact: true }).click();
  await expect(left.locator(`#${id}`)).toBeVisible();
  expect(await page.evaluate(() => history.length)).toBe(length);
  await page.goBack();
  await closed(page);
});

test('compare: a changed layout is remeasured without losing the reading section', async ({ page }) => {
  const [left, right] = await open(page);
  await scrollTo(left, 'transactions');
  await expect.poll(() => right.locator('#transactions').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
  await right.evaluate(() => {
    const spacer = document.createElement('div'); spacer.style.height = '600px';
    document.getElementById('middle').after(spacer);
  });
  await expect.poll(() => right.locator('#transactions').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect.poll(() => left.locator('#transactions').evaluate(el => Math.abs(el.getBoundingClientRect().top - 24))).toBeLessThan(2);
});

test('compare: pane shortcuts stay isolated and another document exits without leaking pane state', async ({ page }) => {
  const [left] = await open(page);
  await left.locator('.td-content h1').click();
  await page.keyboard.press('Control+k');
  await expect(left.locator('[data-td-shell-search]')).toBeHidden();
  await expect(page.locator(reader)).toBeVisible();
  await left.getByRole('link', { name: 'Documentation home', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await expect(page.locator('html')).not.toHaveAttribute('data-td-compare-pane');
  await expect(page.locator('.td-site-header')).toBeVisible();
  await expect(page.locator('iframe[data-td-compare-frame]')).toHaveCount(0);
  expect(page.frames().filter(frame => frame.url().includes('oink_compare_pane=1'))).toHaveLength(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/tests\/compare-reader\/$/);
  await closed(page);
});

test('compare: narrow and dark views preserve both documents and remain accessible', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('td-color-theme', 'dark'));
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, '/zh/tests/compare-reader/');
  await expect(page.locator('[data-td-compare-side="0"]')).toBeVisible();
  await expect(page.locator('[data-td-compare-side="1"]')).toBeHidden();
  await page.locator('.td-compare__tab').nth(1).click();
  await expect(page.locator('[data-td-compare-side="0"]')).toBeHidden();
  await expect(page.locator('[data-td-compare-side="1"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
  await page.setViewportSize({ width: 320, height: 640 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  const result = await new AxeBuilder({ page }).include(reader).analyze();
  expect(result.violations).toEqual([]);
});

test('compare: 400% zoom keeps the reading area dominant and the controls in reach', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 256 });
  await open(page, '/zh/tests/compare-reader/');
  const body = await page.locator('[data-td-compare-side="0"] .td-compare__body').boundingBox();
  expect(body.height).toBeGreaterThanOrEqual(160);
  await expect(page.locator('[data-td-compare-side="0"] .td-compare__pane-heading')).toBeHidden();
  // One target: the switcher tabs name both panes and no extra menu is shown.
  await expect(page.locator('.td-compare__mobile [data-td-compare-language]')).toHaveCount(0);
  const close = await page.locator('[data-td-compare-close]').boundingBox();
  expect(320 - (close.x + close.width)).toBeLessThan(24);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.locator('[data-td-compare-side="1"] .td-compare__pane-heading')).toBeVisible();
  await expect(page.locator('[data-td-compare-side="1"] .td-compare__pane-heading [data-td-compare-language]')).toHaveCount(0);
  await page.locator('[data-td-compare-close]').click();
  await closed(page);
});

test('compare: unmatched headings and failed loads retain independent reading or a direct link', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 600 });
  await page.goto('/tests/compare-unmatched/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator('.td-compare__status')).toHaveCount(0);
  await expect(page.locator(sync)).toBeEnabled();
  await expect(page.locator(sync)).toBeChecked();
  const warning = page.locator('.td-compare__sync-warning');
  const tip = page.locator('.td-compare__sync-tip');
  await expect(warning).toBeVisible();
  await expect(warning).toHaveAccessibleName(/No usable shared heading/);
  await expect(tip).toBeHidden();
  // The note appears on hover; Escape dismisses it before it closes the reader.
  await warning.hover();
  await expect(tip).toBeVisible();
  await expect(tip).toHaveText(/No usable shared heading/);
  await page.keyboard.press('Escape');
  await expect(tip).toBeHidden();
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await page.mouse.move(1, 400);
  await warning.click();
  await expect(tip).toBeVisible();
  await page.locator('[data-td-compare-close]').click();
  await closed(page);
  await page.goto('/tests/compare-reader/');
  await page.route('**/zh/tests/compare-reader/?oink_compare_pane=1', route => route.fulfill({ status: 404, contentType: 'text/html', body: '<p>Missing translation</p>' }));
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator('.td-compare__failure a')).toHaveAttribute('href', /\/zh\/tests\/compare-reader\/$/);
  await expect(page.locator(sync)).toBeDisabled();
  await expect(page.locator(sync)).not.toBeChecked();
  // Retry reloads the pane in place once the page is reachable again.
  await page.unroute('**/zh/tests/compare-reader/?oink_compare_pane=1');
  await page.locator('.td-compare__retry').click();
  await expect(page.locator('[data-td-compare-frame]')).toHaveCount(2);
  await expect(page.locator(sync)).toBeEnabled();
  await expect(page.locator('.td-compare__failure')).toHaveCount(0);
});

test('compare: a slow image does not block a readable pane or discard it', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 700 });
  // Serve the target promptly but give it an eager image that never arrives,
  // so the frame's load event stays pending.
  await page.route('**/zh/tests/compare-reader/?oink_compare_pane=1', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace('<body', '<img src="/compare-never.png" alt="" width="1" height="1"><body');
    await route.fulfill({ response, body });
  });
  await page.route('**/compare-never.png', () => {});
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled({ timeout: 8000 });
  await expect(page.locator('.td-compare__loading')).toHaveCount(0);
  await expect(page.locator('[data-td-compare-frame]')).toHaveCount(2);
  await expect(page.locator('.td-compare__failure')).toHaveCount(0);
  await page.locator('[data-td-compare-close]').click();
  await closed(page);
});

test('compare: a stalled document reaches the localized retry state', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 700 });
  // Hold the target's main document itself. A pending image is a different
  // case: the article is already readable and must remain usable.
  let stalled = true;
  await page.route('**/zh/tests/compare-reader/?oink_compare_pane=1', route => {
    if (!stalled) return route.continue();
  });
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(`${reader}[open]`)).toBeVisible();
  await expect(page.locator('[data-td-compare-side="0"] .td-compare__loading')).toHaveCount(0);
  await expect(page.locator('[data-td-compare-side="1"] .td-compare__retry')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('[data-td-compare-side="1"] .td-compare__retry')).toHaveText('Retry');
  await expect(page.locator('[data-td-compare-side="1"] .td-compare__failure a')).toHaveAttribute(
    'href',
    /\/zh\/tests\/compare-reader\/$/,
  );
  await expect(page.locator(sync)).toBeDisabled();
  await expect(page.locator('[data-td-compare-side="1"] .td-compare__loading')).toHaveCount(0);
  stalled = false;
  await page.locator('[data-td-compare-side="1"] .td-compare__retry').click();
  await expect(page.locator(sync)).toBeEnabled();
  await expect(page.locator('.td-compare__failure')).toHaveCount(0);
});

test('compare: heading-less pages use whole-document progress with one inline warning', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 600 });
  await page.goto('/tests/compare-plain/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled();
  await expect(page.locator(sync)).toBeChecked();
  await expect(page.locator('.td-compare__status')).toHaveCount(0);
  await expect(page.locator('.td-compare__sync-warning')).toBeVisible();
  const [left, right] = page.frames().filter(frame => frame.url().includes('oink_compare_pane=1'));
  const leftMax = await left.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const rightMax = await right.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await left.evaluate(max => scrollTo({ top: max * .5, behavior: 'instant' }), leftMax);
  await expect.poll(async () => (await right.evaluate(() => scrollY)) / rightMax).toBeCloseTo(.5, 1);
  await page.locator('[data-td-compare-close]').click();
  await closed(page);
});

test('compare: twenty open/close cycles remove frames and restore focus', async ({ page }) => {
  await page.goto('/tests/compare-reader/');
  for (let i = 0; i < 20; i++) {
    await page.locator('[data-td-compare-open]').click();
    await expect(page.locator(sync)).toBeEnabled();
    await page.locator('[data-td-compare-close]').click();
    await closed(page);
    await expect(page.locator('[data-td-compare-open]')).toBeFocused();
  }
  await expect(page.locator('iframe[data-td-compare-frame]')).toHaveCount(0);
});

test('compare: an immediate reopen waits for the transient history entry', async ({ page }) => {
  await page.goto('/book/');
  await page.goto('/tests/compare-reader/');
  await page.locator('[data-td-compare-open]').click();
  await expect(page.locator(sync)).toBeEnabled();
  const length = await page.evaluate(() => history.length);
  await page.reload();
  await expect(page.locator(sync)).toBeEnabled();
  await page.evaluate(() => {
    window.OinkCompare.close();
    document.querySelector('[data-td-compare-open]').click();
    // Exercise an automatic restore while the explicit reopen is queued.
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect(page.locator(sync)).toBeEnabled();
  expect(await page.evaluate(() => history.length)).toBe(length);
  await page.goBack();
  await closed(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/book\/$/);
});

test('compare: a top-level pane flag and no JavaScript keep normal pages readable', async ({ page, browser }) => {
  await page.goto('/tests/compare-reader/?oink_compare_pane=1');
  await expect(page.locator('html')).not.toHaveAttribute('data-td-compare-pane');
  await expect(page.locator('.td-site-header')).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto(new URL('/tests/compare-reader/', page.url()).href);
  await expect(plain.locator('[data-td-compare-open]')).toBeHidden();
  await expect(plain.locator('.td-content h1')).toBeVisible();
  await context.close();
});
