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

    await page.goto(imageZoomPath, { waitUntil: 'domcontentloaded' });
    await page.locator('.td-figure .td-image-zoom__trigger').first().click();
    await page.locator('[data-td-image-zoom-close]').click();

    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('ul.gallery > li')).toHaveCount(3);

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
      /td-badge--danger/,
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
    // The table form (`{.fields}`) and the shortcode form both render the
    // same definition-list markup under the same label.
    const fields = page.locator('.td-fields').filter({
      has: page.getByText('Search configuration', { exact: true }),
    });
    await expect(fields).toHaveCount(2);
    await expect(fields.locator('dl')).toHaveCount(2);
    await expect(fields.locator('table')).toHaveCount(0);
    const shortcodeFields = fields.last();
    await expect(shortcodeFields.locator('dt')).toHaveCount(4);
    await expect(shortcodeFields.locator('dd')).toHaveCount(4);
    await expect(shortcodeFields).toContainText(
      'theme.components.media.previewMaximumWidthInCharacters',
    );

    await page.goto(fileTreePath, { waitUntil: 'domcontentloaded' });
    // FileTree is a plain nested list: no disclosure widgets, no tree roles.
    const fileTree = page.locator('#td-main-content ul.filetree').first();
    await expect(fileTree).toBeVisible();
    await expect(fileTree.locator('[role="tree"]')).toHaveCount(0);
    await expect(fileTree.locator('details')).toHaveCount(0);
    await expect(fileTree.locator('ul')).toHaveCount(4);
    await expect(fileTree).toContainText(
      'a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md',
    );
    await expect(fileTree).toContainText('Section landing page');
    const treeFonts = await fileTree.evaluate((tree) => ({
      tree: getComputedStyle(tree).fontFamily,
      body: getComputedStyle(document.body).fontFamily,
    }));
    expect(treeFonts.tree).not.toBe(treeFonts.body);

    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    const gallery = page.locator('#td-main-content ul.gallery').first();
    await expect(gallery.locator(':scope > li')).toHaveCount(3);
    await expect(gallery.locator('img')).toHaveCount(3);
    await expect(gallery.locator('img').first()).toHaveAttribute(
      'alt',
      'OINK documentation overview',
    );
    await expect(gallery).toContainText(
      'A global image resource with known intrinsic dimensions.',
    );
  });

  test('gallery breakpoints and long content stay within the viewport', async ({
    page,
  }) => {
    // `ul.gallery` is an auto-fit grid: the column count only shrinks as the
    // viewport narrows, down to a single column on a phone-sized screen.
    const cases = [
      { width: 1200, minColumns: 2 },
      { width: 700, minColumns: 1 },
      { width: 500, minColumns: 1, maxColumns: 1 },
    ];
    let previousColumns = Number.POSITIVE_INFINITY;

    for (const { width, minColumns, maxColumns } of cases) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
      const grid = page.locator('#td-main-content ul.gallery').first();
      const columns = await gridColumnCount(grid);
      expect(columns).toBeGreaterThanOrEqual(minColumns);
      expect(columns).toBeLessThanOrEqual(maxColumns ?? previousColumns);
      previousColumns = columns;

      for (const { path, selector } of [
        { path: galleryPath, selector: 'ul.gallery' },
        { path: fieldsPath, selector: '.td-fields' },
        { path: fileTreePath, selector: 'ul.filetree' },
      ]) {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        const overflow = await page.locator(selector).evaluateAll((elements) =>
          elements.map((element) => ({
            className: element.className,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            right: element.getBoundingClientRect().right,
            viewport: document.documentElement.clientWidth,
            // FileTree never wraps long names; it scrolls like a code block.
            scrolls: ['auto', 'scroll'].includes(
              getComputedStyle(element).overflowX,
            ),
          })),
        );
        expect(
          overflow.filter(
            ({ clientWidth, scrollWidth, right, viewport, scrolls }) =>
              (!scrolls && scrollWidth > clientWidth + 1) ||
              right > viewport + 1,
          ),
          `${path} overflowed at ${width}px`,
        ).toEqual([]);
      }
    }
  });

  test('Gallery items grow again after a live viewport resize', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(galleryPath, { waitUntil: 'domcontentloaded' });
    const item = page.locator('#td-main-content ul.gallery > li').first();
    const image = item.locator('img');

    const narrow = await item.evaluate(
      (element) => element.getBoundingClientRect().width,
    );
    await page.setViewportSize({ width: 500, height: 900 });
    await expect
      .poll(() =>
        item.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(narrow + 50);

    const widths = await item.evaluate((element) => ({
      item: element.getBoundingClientRect().width,
      image: element.querySelector('img').getBoundingClientRect().width,
    }));
    expect(Math.abs(widths.item - widths.image)).toBeLessThan(25);
    await expect(image).toHaveAttribute('loading', 'lazy');
  });

  test('Image Zoom opens and closes through every supported control', async ({
    page,
  }) => {
    await page.goto(imageZoomPath, { waitUntil: 'domcontentloaded' });
    const trigger = page.locator('.td-figure .td-image-zoom__trigger').first();
    const dialog = page.locator('[data-td-image-zoom-dialog]');
    const close = dialog.locator('[data-td-image-zoom-close]');
    const preview = dialog.locator('[data-td-image-zoom-image]');
    const caption = dialog.locator('[data-td-image-zoom-caption]');

    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await trigger.click();
    await expect.poll(() => dialog.evaluate((node) => node.open)).toBe(true);
    await expect(close).toBeFocused();
    await expect(preview).toHaveAttribute('src', /\/images\/feedback\.png$/);
    await expect(caption).toHaveText('The feedback controls under an article');
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
      await expect(
        page.locator('#td-main-content ul.gallery > li'),
      ).toHaveCount(3);
      await expect(page.locator('#td-main-content ul.gallery img')).toHaveCount(
        3,
      );
      await expect(
        page.locator('#td-main-content ul.gallery > li').first(),
      ).toBeVisible();
      await expect(
        page.locator('#td-main-content ul.gallery > li').first(),
      ).toContainText(
        'A global image resource with known intrinsic dimensions.',
      );
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
    await page.goto(imageZoomPath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.td-image-zoom__trigger')).toHaveCount(0);
    await expect(page.locator('.td-figure img')).toHaveCount(2);
    await expect(page.locator('.td-figure figcaption')).toHaveCount(2);
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
