import { expect, test } from '@playwright/test';

const componentsPath = '/docs/components/';
const badgePath = `${componentsPath}badge/`;
const kbdPath = `${componentsPath}kbd/`;
const fieldsPath = `${componentsPath}fields/`;
const fileTreePath = `${componentsPath}filetree/`;
const imageZoomPath = `${componentsPath}image-zoom/`;
const galleryPath = `${componentsPath}gallery/`;
const layoutPath = `${componentsPath}layout/`;

async function gridColumnCount(grid) {
  return grid.evaluate(
    (element) =>
      getComputedStyle(element).gridTemplateColumns.split(/\s+/).filter(Boolean)
        .length,
  );
}

test.describe('Everyday content primitive guides', () => {
  test('Gallery and Image Zoom do not raise page errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    await page.locator('.td-gallery .td-image-zoom__trigger').first().click();
    await page.locator('[data-td-image-zoom-close]').click();

    expect(errors).toEqual([]);
  });

  test('overview links to every guide and examples render semantically', async ({
    page,
  }) => {
    await page.goto(componentsPath, { waitUntil: 'domcontentloaded' });
    for (const path of [
      badgePath,
      kbdPath,
      fieldsPath,
      fileTreePath,
      imageZoomPath,
      galleryPath,
    ]) {
      await expect(
        page.locator(`#td-main-content a[href="${path}"]`).first(),
      ).toBeVisible();
    }

    await page.goto(badgePath, { waitUntil: 'domcontentloaded' });
    const badges = page.locator('#td-main-content .td-badge');
    await expect(badges).toHaveCount(6);
    await expect(badges.filter({ hasText: 'Beta' })).toHaveClass(
      /td-badge--warning/,
    );
    await expect(badges.filter({ hasText: 'Deprecated' })).toHaveClass(
      /td-badge--filled/,
    );
    await expect(badges.filter({ hasText: 'v0.3' })).toHaveAttribute(
      'href',
      '/blog/release/',
    );

    await page.goto(kbdPath, { waitUntil: 'domcontentloaded' });
    const keySequence = page
      .locator('#td-main-content .td-kbd-sequence')
      .first();
    await expect(keySequence.locator('kbd')).toHaveCount(2);
    await expect(keySequence.locator('kbd').nth(0)).toHaveText('Ctrl');
    await expect(keySequence.locator('kbd').nth(1)).toHaveText('K');

    await page.goto(fieldsPath, { waitUntil: 'domcontentloaded' });
    const fields = page.locator('.td-fields').filter({
      has: page.getByText('Search configuration', { exact: true }),
    });
    await expect(fields.locator('dl')).toHaveCount(1);
    await expect(fields.locator('table')).toHaveCount(0);
    await expect(fields.locator('dt')).toHaveCount(4);
    await expect(fields.locator('dd')).toHaveCount(4);
    await expect(fields).toContainText('default: ""');
    await expect(fields).toContainText(
      'theme.components.media.previewMaximumWidthInCharacters',
    );

    await page.goto(fileTreePath, { waitUntil: 'domcontentloaded' });
    const fileTree = page.locator('.td-filetree').filter({
      has: page.getByText('Repository structure', { exact: true }),
    });
    await expect(fileTree.locator('[role="tree"]')).toHaveCount(0);
    await expect(fileTree.locator('details')).toHaveCount(4);
    await expect(fileTree).toContainText(
      'a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md',
    );

    const firstFolder = fileTree.locator('details').first();
    const firstSummary = firstFolder.locator(':scope > summary');
    await expect
      .poll(() => firstFolder.evaluate((node) => node.open))
      .toBe(true);
    await firstSummary.focus();
    await page.keyboard.press('Enter');
    await expect
      .poll(() => firstFolder.evaluate((node) => node.open))
      .toBe(false);
    await page.keyboard.press('Space');
    await expect
      .poll(() => firstFolder.evaluate((node) => node.open))
      .toBe(true);
    await expect(firstSummary).toBeFocused();

    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    const gallery = page.locator('.td-gallery--columns-3');
    await expect(gallery.locator('.td-gallery__item')).toHaveCount(3);
    await expect(gallery.locator('figure')).toHaveCount(3);
    await expect(gallery.locator('figcaption')).toHaveCount(3);
    await expect(gallery.locator('img').first()).toHaveAttribute(
      'alt',
      'OINK documentation overview',
    );
  });

  test('gallery breakpoints and long content stay within the viewport', async ({
    page,
  }) => {
    const cases = [
      { width: 1200, columns: 3 },
      { width: 700, columns: 2 },
      { width: 500, columns: 1 },
    ];

    for (const { width, columns } of cases) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
      const grid = page.locator('.td-gallery--columns-3 .td-gallery__grid');
      await expect.poll(() => gridColumnCount(grid)).toBe(columns);

      for (const { path, selector } of [
        { path: galleryPath, selector: '.td-gallery' },
        { path: fieldsPath, selector: '.td-fields' },
        { path: fileTreePath, selector: '.td-filetree' },
      ]) {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        const overflow = await page.locator(selector).evaluateAll((elements) =>
          elements.map((element) => ({
            className: element.className,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            right: element.getBoundingClientRect().right,
            viewport: document.documentElement.clientWidth,
          })),
        );
        expect(
          overflow.filter(
            ({ clientWidth, scrollWidth, right, viewport }) =>
              scrollWidth > clientWidth + 1 || right > viewport + 1,
          ),
          `${path} overflowed at ${width}px`,
        ).toEqual([]);
      }
    }
  });

  test('Gallery Zoom triggers grow again after a live viewport resize', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    const item = page
      .locator('.td-gallery--columns-3 .td-gallery__item')
      .first();
    const trigger = item.locator('.td-image-zoom__trigger');

    const narrow = await trigger.evaluate(
      (element) => element.getBoundingClientRect().width,
    );
    await page.setViewportSize({ width: 500, height: 900 });
    await expect
      .poll(() =>
        trigger.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(narrow + 50);

    const widths = await item.evaluate((element) => ({
      item: element.getBoundingClientRect().width,
      trigger: element
        .querySelector('.td-image-zoom__trigger')
        .getBoundingClientRect().width,
    }));
    expect(Math.abs(widths.item - widths.trigger)).toBeLessThan(25);
  });

  test('Image Zoom opens and closes through every supported control', async ({
    page,
  }) => {
    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    const trigger = page.locator('.td-gallery .td-image-zoom__trigger').first();
    const dialog = page.locator('[data-td-image-zoom-dialog]');
    const close = dialog.locator('[data-td-image-zoom-close]');
    const preview = dialog.locator('[data-td-image-zoom-image]');
    const caption = dialog.locator('[data-td-image-zoom-caption]');

    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await trigger.click();
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(true);
    await expect(close).toBeFocused();
    await expect(preview).toHaveAttribute(
      'src',
      '/images/content-primitives/oink.webp',
    );
    await expect(caption).toHaveText(
      'A global image resource with known intrinsic dimensions.',
    );
    await page.keyboard.press('Escape');
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(false);
    await expect(trigger).toBeFocused();

    await trigger.press('Enter');
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(true);
    await close.click();
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(false);
    await expect(trigger).toBeFocused();

    await trigger.press('Space');
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(true);
    await dialog.dispatchEvent('pointerdown', { pointerType: 'mouse' });
    await dialog.dispatchEvent('click');
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(false);
    await expect(trigger).toBeFocused();
  });

  test('linked images stay links and unrelated pages omit the Zoom runtime', async ({
    page,
    request,
  }) => {
    await page.goto(imageZoomPath, { waitUntil: 'domcontentloaded' });
    const linkedImage = page.getByAltText('Linked OINK image remains a link');
    await expect(linkedImage.locator('xpath=..')).toHaveAttribute(
      'href',
      '/docs/',
    );
    await expect(linkedImage.locator('xpath=ancestor::button')).toHaveCount(0);
    await expect(linkedImage).not.toHaveAttribute(
      'data-td-image-zoom-ready',
      '',
    );

    const componentBundleURL = await page
      .locator('script[src*="/js/main-"]')
      .getAttribute('src');
    const componentBundle = await (
      await request.get(componentBundleURL)
    ).text();
    expect(componentBundle).toContain('data-td-image-zoom-dialog');

    await page.goto('/docs/configure/overview/', {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('[data-td-image-zoom-dialog]')).toHaveCount(0);
    const plainBundleURL = await page
      .locator('script[src*="/js/main-"]')
      .getAttribute('src');
    const plainBundle = await (await request.get(plainBundleURL)).text();
    expect(plainBundle).not.toContain('data-td-image-zoom-dialog');
  });

  test('content remains complete without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.td-image-zoom__trigger')).toHaveCount(0);
      await expect(page.locator('.td-gallery__image')).toHaveCount(3);
      await expect(page.locator('.td-gallery__caption')).toHaveCount(3);
      await expect(
        page.getByText(
          'A global image resource with known intrinsic dimensions.',
          { exact: true },
        ),
      ).toBeVisible();
    } finally {
      await context.close();
    }
  });

  test('content remains complete when native dialog is unavailable', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'HTMLDialogElement', {
        configurable: true,
        value: undefined,
      });
    });
    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.td-image-zoom__trigger')).toHaveCount(0);
    await expect(page.locator('.td-gallery__image')).toHaveCount(3);
    await expect(page.locator('.td-gallery__caption')).toHaveCount(3);
  });
});

test('Asciinema waits for its web font before measuring terminal cells', async ({
  page,
}) => {
  let releaseFont;
  const fontReleased = new Promise((resolve) => {
    releaseFont = resolve;
  });
  let markFontRequested;
  const fontRequested = new Promise((resolve) => {
    markFontRequested = resolve;
  });

  await page.route(
    '**/webfonts/brand/ibm-plex-mono-latin-400-normal.woff2',
    async (route) => {
      markFontRequested();
      await fontReleased;
      await route.continue();
    },
  );

  await page.goto(layoutPath, {
    waitUntil: 'domcontentloaded',
  });
  await fontRequested;

  const player = page.locator('[data-td-asciinema] .ap-player');
  await expect(player).toHaveCount(0);

  releaseFont();
  await expect(player).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() => document.fonts.check('15px "IBM Plex Mono"')),
    )
    .toBe(true);
});
