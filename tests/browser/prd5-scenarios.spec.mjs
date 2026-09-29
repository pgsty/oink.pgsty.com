import { expect, test } from '@playwright/test';

const middlePath = '/tests/prd5/reading/middle/';
const assetsPath = '/tests/prd5/assets/';
const landingPath = '/tests/prd5/landing/';

test('Pager follows the sidebar preorder in links, head metadata, and navigation', async ({
  page,
}) => {
  await page.goto(middlePath, { waitUntil: 'domcontentloaded' });

  const previous = page.locator('[data-td-pager-prev]');
  const next = page.locator('[data-td-pager-next]');
  await expect(previous).toHaveAttribute('href', '/tests/prd5/reading/first/');
  await expect(next).toHaveAttribute('href', '/tests/prd5/reading/last/');
  await expect(page.locator('head link[rel="prev"]')).toHaveAttribute(
    'href',
    /\/tests\/prd5\/reading\/first\/$/,
  );
  await expect(page.locator('head link[rel="next"]')).toHaveAttribute(
    'href',
    /\/tests\/prd5\/reading\/last\/$/,
  );

  await next.click();
  await expect(page).toHaveURL(/\/tests\/prd5\/reading\/last\/$/);
  await expect(page.locator('h1')).toHaveText('Last reading page');
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await previous.click();
  await expect(page).toHaveURL(/\/tests\/prd5\/reading\/first\/$/);
  await expect(page.locator('h1')).toHaveText('First reading page');
});

test('Release asset controls copy exact sha256sum lines', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(assetsPath, { waitUntil: 'domcontentloaded' });

  const rows = page.locator('[data-td-asset]');
  await expect(rows).toHaveCount(2);
  const firstCopy = rows.first().locator('[data-td-asset-copy]');
  await expect(firstCopy).toBeVisible();
  await firstCopy.click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  oink-0.4.0-linux-amd64.tar.gz\n',
    );
  await expect(firstCopy).toHaveAttribute('data-td-state', 'success');

  const copyAll = page.locator('[data-td-asset-copy-all]');
  await copyAll.click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(
      '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  oink-0.4.0-linux-amd64.tar.gz\n' +
        'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210 *oink-0.4.0-darwin-arm64.tar.gz\n',
    );
  await expect(copyAll).toHaveAttribute('data-td-state', 'success');
});

test('CSS marquee pauses by focus or choice and isolates its duplicate track', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(landingPath, { waitUntil: 'domcontentloaded' });

  const marquee = page.locator('[data-td-marquee]');
  const track = marquee.locator('.td-landing-marquee__track');
  const pause = marquee.locator('[data-td-marquee-pause]');
  const duplicate = marquee.locator('.td-landing-marquee__group[aria-hidden="true"]');
  await expect(duplicate).toHaveAttribute('inert', '');
  await expect(duplicate.locator('a')).toHaveCount(3);
  await expect(pause).toHaveAccessibleName('Pause motion');
  await expect
    .poll(() =>
      track.evaluate((node) => getComputedStyle(node).animationPlayState),
    )
    .toBe('running');

  await pause.focus();
  await expect
    .poll(() =>
      track.evaluate((node) => getComputedStyle(node).animationPlayState),
    )
    .toBe('paused');
  await page.locator('.td-landing-hero__actions a').focus();
  await expect
    .poll(() =>
      track.evaluate((node) => getComputedStyle(node).animationPlayState),
    )
    .toBe('running');

  await pause.focus();
  await pause.press('Space');
  await page.locator('.td-landing-hero__actions a').focus();
  await expect(pause).toBeChecked();
  await expect
    .poll(() =>
      track.evaluate((node) => getComputedStyle(node).animationPlayState),
    )
    .toBe('paused');
});

test('Landing page opens the shared Command Palette without article rails', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(landingPath, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-td-landing]')).toBeVisible();
  await expect(page.locator('#td-section-nav')).toHaveCount(0);

  // Reveal the real pointer target when this fixture enables navbar auto-hide.
  // With a persistent landing navbar there is no reveal interaction to perform.
  const autohide = page.locator('[data-td-navbar-autohide]');
  if (await autohide.count()) {
    await autohide.hover({ position: { x: 640, y: 8 } });
  }
  await expect(page.locator('[data-td-header]')).toBeVisible();
  const opener = page.locator('[data-td-shell-search-open]:visible').first();
  await expect(opener).toBeInViewport();
  await opener.click();
  const dialog = page.locator('#td-shell-search');
  const input = dialog.locator('.td-shell-search__input');
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await expect(
    dialog.getByRole('group', { name: 'Page actions' }),
  ).toContainText('Copy Markdown');
  await input.fill('configuration');
  await expect(
    dialog.getByRole('option', { name: /^Configuration/i }).first(),
  ).toBeVisible();
});

const fallbackLandingPath = '/tests/runtime/landing/';
const metricDisplay = ['2.2k', '32+', '$12.50/day'];

for (const failure of ['no JavaScript', 'missing Landing script']) {
  test(`Landing content and metric labels survive ${failure}`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: failure !== 'no JavaScript',
      reducedMotion: 'no-preference',
    });
    try {
      const page = await context.newPage();
      if (failure === 'missing Landing script') {
        await page.route('**/js/chunks/landing*.js', route => route.abort());
      }
      await page.goto(fallbackLandingPath, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.td-landing-command-box')).toContainText('echo landing fallback');
      await expect(page.locator('.td-landing-pricing-grid')).toContainText('Community');
      // toBeVisible deliberately ignores opacity. Check the computed result
      // so invisible-but-laid-out server content cannot pass this regression.
      const candidates = page.locator('[data-td-reveal]');
      await expect(candidates).toHaveCount(2);
      for (const candidate of await candidates.all()) {
        await expect(candidate).toHaveCSS('opacity', '1');
        await expect(candidate).toHaveCSS('transform', 'none');
      }
      await expect(page.locator('#animated-metrics strong')).toHaveText(metricDisplay);
      await expect(page.locator('#static-metrics strong')).toHaveText(metricDisplay);
    } finally {
      await context.close();
    }
  });
}

for (const reducedMotion of ['reduce', 'no-preference']) {
  test(`Landing metrics preserve their server display after count-up (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto(fallbackLandingPath, { waitUntil: 'domcontentloaded' });
    await page.locator('#animated-metrics').scrollIntoViewIfNeeded();
    await expect(page.locator('#animated-metrics [data-td-count-complete]')).toHaveCount(3);
    await expect(page.locator('#animated-metrics strong')).toHaveText(metricDisplay);
    await expect(page.locator('#static-metrics strong')).toHaveText(metricDisplay);
    for (const candidate of await page.locator('[data-td-reveal]').all()) {
      await candidate.scrollIntoViewIfNeeded();
      await expect(candidate).toHaveCSS('opacity', '1');
    }
  });
}
