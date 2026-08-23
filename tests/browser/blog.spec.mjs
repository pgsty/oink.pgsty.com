import { expect, test } from '@playwright/test';

const blogPath = '/zh/blog/';
const blogSections = ['release', 'oink'];
const blogArticles = {
  release: ['0.6.0', '0.5.0', '0.4.0', '0.3.0', '0.2.0', '0.1.0'],
  oink: [
    'immersive-reading',
    'oink-announcement',
    'oink-implementation-diary',
  ],
};

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

test('blog metadata links to the post section without changing resting color', async ({
  page,
}) => {
  await openCleanBlog(page, 1024, '/blog/');

  // The migrated Blog defaults to cards; section metadata belongs to its
  // richer list form. Cycle cards -> table -> list through the public control.
  const indexToggle = page.locator('[data-td-blog-index-toggle]');
  await indexToggle.click();
  await indexToggle.click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-td-blog-index',
    'list',
  );

  const sectionLink = page
    .locator(
      '[data-td-blog-form="list"] .td-blog-meta__section[href="/blog/release/"]',
    )
    .first();
  await expect(sectionLink).toHaveText('Releases');
  await expect(sectionLink).toHaveAttribute('href', '/blog/release/');

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
  await expect(page).toHaveURL(/\/blog\/release\/$/);
});

test('blog sidebar keeps bilingual sections and posts in the configured order', async ({
  page,
}) => {
  for (const languagePrefix of ['', '/zh']) {
    await page.goto(`${languagePrefix}/blog/`, {
      waitUntil: 'domcontentloaded',
    });

    const hrefs = await page
      .locator('#td-section-nav a.td-shell-tree__link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const sectionHrefs = blogSections.map(
      (section) => `${languagePrefix}/blog/${section}/`,
    );

    expect(hrefs.filter((href) => sectionHrefs.includes(href))).toEqual(
      sectionHrefs,
    );

    for (const section of blogSections) {
      const sectionPrefix = `${languagePrefix}/blog/${section}/`;
      expect(
        hrefs.filter(
          (href) => href.startsWith(sectionPrefix) && href !== sectionPrefix,
        ),
      ).toEqual(
        blogArticles[section].map((article) => `${sectionPrefix}${article}/`),
      );
    }
  }
});

test('series member targets mirror their leading indent in RTL', async ({
  page,
}) => {
  await openCleanBlog(page, 360, '/blog/release/0.6.0/');

  const strip = page.locator('.td-series-strip');
  const summary = strip.locator('.td-series-strip__summary');
  await expect(strip).toBeVisible();
  await summary.click();

  const firstMember = strip.locator('.td-series-strip__link').first();
  await expect(firstMember).toBeVisible();

  const measure = () =>
    firstMember.evaluate((element) => {
      const style = getComputedStyle(element);
      const link = element.getBoundingClientRect();
      const bar = element.closest('.td-series-strip').getBoundingClientRect();
      return {
        paddingInlineStart: Number.parseFloat(style.paddingInlineStart),
        paddingInlineEnd: Number.parseFloat(style.paddingInlineEnd),
        paddingLeft: Number.parseFloat(style.paddingLeft),
        paddingRight: Number.parseFloat(style.paddingRight),
        insideBar: link.left >= bar.left - 1 && link.right <= bar.right + 1,
      };
    });

  const ltr = await measure();
  expect(ltr.paddingInlineStart).toBeGreaterThan(ltr.paddingInlineEnd);
  expect(ltr.paddingLeft).toBeGreaterThan(ltr.paddingRight);
  expect(ltr.insideBar).toBe(true);

  await page.locator('html').evaluate((element) => {
    element.dir = 'rtl';
  });

  const rtl = await measure();
  expect(rtl.paddingInlineStart).toBe(ltr.paddingInlineStart);
  expect(rtl.paddingInlineEnd).toBe(ltr.paddingInlineEnd);
  expect(rtl.paddingRight).toBeGreaterThan(rtl.paddingLeft);
  expect(rtl.insideBar).toBe(true);
});
