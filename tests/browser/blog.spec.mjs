import { expect, test } from '@playwright/test';

const blogPath = '/zh/blog/';
const blogArticles = [
  'blog-gallery',
  'sdd',
  'oink-intro',
  'immersive-reading',
  'oink-release',
  'oink-announcement',
  'oink-implementation-diary',
];
const releaseArticles = [
  '1.7.0',
  '1.6.0',
  '1.5.1',
  '1.5.0',
  '1.4.0',
  '1.3.2',
  '1.3.1',
  '1.3.0',
  '1.2.0',
  '1.1.0',
  '1.0.0',
  '0.8.2',
  '0.8.1',
  '0.8.0',
  '0.7.1',
  '0.7.0',
  '0.6.0',
  '0.5.0',
  '0.4.0',
  '0.3.0',
  '0.2.0',
  '0.1.0',
];

async function openCleanBlog(page, width, path = blogPath) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(() => {
    localStorage.removeItem('td-shell-toc-collapsed');
    localStorage.removeItem('td-blog-index');
  });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

test('RSS stays in page actions when the right rail is collapsed', async ({
  page,
}) => {
  await openCleanBlog(page, 1200);

  const contentRSS = page
    .locator('[data-td-page-actions]')
    .getByRole('link', { name: 'RSS' });
  const floatingControls = page.locator('.td-shell-toc-float');

  await expect(contentRSS).toBeVisible();
  await expect(floatingControls).toBeHidden();
  await expect(page.locator('.td-shell-toc .td-shell-tags-cloud').first()).toBeVisible();
  await expect(page.locator('.td-shell-toc__title-btn')).toHaveAttribute('aria-label', '收起侧栏');

  await page.locator('.td-shell-toc__title-btn').click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-td-shell-toc',
    'collapsed',
  );
  await expect(contentRSS).toBeVisible();
  await expect(floatingControls).toBeVisible();
  await expect(contentRSS).toHaveAttribute('href', '/zh/blog/index.xml');
  await expect(
    floatingControls.locator('[data-td-shell-right-toggle]'),
  ).toBeVisible();
});

test('blog and release metadata links to the section without changing resting color', async ({
  page,
}) => {
  await openCleanBlog(page, 1024, '/blog/');

  // The migrated Blog defaults to cards; section metadata belongs to its
  // richer list form. Cycle cards -> table -> gallery -> list through the public control.
  const indexToggle = page.locator('[data-td-blog-index-toggle]');
  await indexToggle.click();
  await indexToggle.click();
  await indexToggle.click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-td-blog-index',
    'list',
  );

  const sectionLink = page
    .locator('[data-td-blog-form="list"] .td-blog-meta__section[href="/blog/"]')
    .first();
  await expect(sectionLink).toHaveText('Blog');
  await expect(sectionLink).toHaveAttribute('href', '/blog/');

  const restingColor = await sectionLink.evaluate(
    (element) => getComputedStyle(element.parentElement).color,
  );
  await expect(sectionLink).toHaveCSS('color', restingColor);

  await sectionLink.hover();
  await expect
    .poll(() =>
      sectionLink.evaluate((element) => getComputedStyle(element).color),
    )
    .not.toBe(restingColor);

  await sectionLink.click();
  await expect(page).toHaveURL(/\/blog\/$/);
});

test('blog sidebar and release table keep bilingual posts in the configured order', async ({
  page,
}) => {
  for (const languagePrefix of ['', '/zh']) {
    await page.goto(`${languagePrefix}/blog/`, {
      waitUntil: 'domcontentloaded',
    });

    const hrefs = await page
      .locator('#td-section-nav a.td-shell-tree__link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const blogPrefix = `${languagePrefix}/blog/`;
    expect(
      hrefs.filter((href) => href.startsWith(blogPrefix) && href !== blogPrefix),
    ).toEqual(blogArticles.map((article) => `${blogPrefix}${article}/`));

    await openCleanBlog(page, 1280, `${languagePrefix}/release/`);
    const releaseHrefs = await page
      .locator('[data-td-blog-form="table"] a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const releasePrefix = `${languagePrefix}/release/`;
    expect(
      releaseHrefs.filter(
        (href) => href.startsWith(releasePrefix) && href !== releasePrefix,
      ),
    ).toEqual(releaseArticles.map((article) => `${releasePrefix}${article}/`));
  }
});

test('series member targets mirror their leading indent in RTL', async ({
  page,
}) => {
  await openCleanBlog(page, 360, '/release/0.6.0/');

  const strip = page.locator('.td-series-strip');
  const summary = strip.locator('.td-series-strip__summary');
  await expect(strip).toBeVisible();
  await summary.click();

  const firstMember = strip.locator('.td-series-strip__link').first();
  await expect(firstMember).toBeVisible();

  const measure = () =>
    firstMember.evaluate((element) => {
      const rtl = getComputedStyle(element).direction === 'rtl';
      const link = element.getBoundingClientRect();
      const title = element
        .querySelector('.td-series-strip__title')
        .getBoundingClientRect();
      const bar = element.closest('.td-series-strip').getBoundingClientRect();
      const leading = rtl ? link.right - title.right : title.left - link.left;
      const trailing = rtl ? title.left - link.left : link.right - title.right;
      return {
        leading,
        trailing,
        insideBar: link.left >= bar.left - 1 && link.right <= bar.right + 1,
      };
    });

  const titleEdges = () =>
    strip.evaluate((element) => {
      const rtl = getComputedStyle(element).direction === 'rtl';
      return [...element.querySelectorAll('.td-series-strip__link')].map(
        (link) => {
          const row = link.getBoundingClientRect();
          const title = link
            .querySelector('.td-series-strip__title')
            .getBoundingClientRect();
          return Math.round(rtl ? row.right - title.right : title.left - row.left);
        },
      );
    });

  const ltr = await measure();
  expect(ltr.leading).toBeGreaterThan(ltr.trailing);
  expect(ltr.insideBar).toBe(true);
  expect(new Set(await titleEdges()).size).toBe(1);

  await page.locator('html').evaluate((element) => {
    element.dir = 'rtl';
  });

  const rtl = await measure();
  expect(rtl.leading).toBeCloseTo(ltr.leading, 1);
  expect(rtl.trailing).toBeCloseTo(ltr.trailing, 1);
  expect(rtl.insideBar).toBe(true);
  expect(new Set(await titleEdges()).size).toBe(1);
});

test('blog cards keep a 16:9 image and a reserved three-line summary', async ({
  page,
}) => {
  await openCleanBlog(page, 1280, '/blog/');

  const card = page.locator('.td-blog-card').filter({
    has: page.locator('.td-blog-card__image'),
  }).filter({
    has: page.locator('.td-blog-card__summary'),
  }).first();
  const image = card.locator('.td-blog-card__image');
  const summary = card.locator('.td-blog-card__summary');
  await expect(card).toBeVisible();
  await expect(image).toHaveCSS('object-fit', 'cover');

  const imageBox = await image.boundingBox();
  expect(imageBox).not.toBeNull();
  expect(imageBox.width / imageBox.height).toBeCloseTo(16 / 9, 2);

  const summaryMetrics = await summary.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      clamp: style.webkitLineClamp,
      lineHeight: Number.parseFloat(style.lineHeight),
      minBlockSize: Number.parseFloat(style.minBlockSize),
      overflow: style.overflow,
      overflowWrap: style.overflowWrap,
    };
  });
  expect(summaryMetrics.clamp).toBe('3');
  expect(summaryMetrics.overflow).toBe('hidden');
  expect(summaryMetrics.overflowWrap).toBe('anywhere');
  expect(summaryMetrics.minBlockSize).toBeGreaterThanOrEqual(
    summaryMetrics.lineHeight * 3 - 1,
  );
});

test('share controls are centered full-size touch targets', async ({ page }) => {
  await openCleanBlog(page, 1280, '/release/0.6.0/');

  const share = page.locator('.td-share');
  const controls = share.locator('.td-share__item');
  await expect(share).toBeVisible();
  await expect(share).toHaveCSS('justify-content', 'center');
  await expect(share).toHaveCSS('border-top-style', 'none');
  await expect(controls).toHaveCount(7);

  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test('a banner heading takes the full phone measure in both languages', async ({
  page,
}) => {
  for (const path of [
    '/zh/blog/oink-implementation-diary/',
    '/blog/oink-implementation-diary/',
  ]) {
    for (const width of [360, 390]) {
      await openCleanBlog(page, width, path);
      const heading = page.locator('.td-featured-banner + .td-page-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveCSS('padding-inline-end', '0px');
      const [headingBox, contentBox] = await Promise.all([
        heading.boundingBox(),
        page.locator('.td-content').boundingBox(),
      ]);
      expect(headingBox).not.toBeNull();
      expect(contentBox).not.toBeNull();
      expect(headingBox.width).toBeGreaterThanOrEqual(contentBox.width - 1);
    }
  }
});
