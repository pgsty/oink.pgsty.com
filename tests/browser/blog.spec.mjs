import { expect, test } from '@playwright/test';

const blogPath = '/zh/blog/';
const blogSections = ['release', 'oink', 'docsy'];
const blogArticles = {
  release: ['0.3.0', '0.2.0', '0.1.0'],
  oink: ['oink-announcement', 'oink-implementation-diary'],
  docsy: [
    '0.16.0',
    'hugo-0.158.0+',
    '0.15.0',
    '0.14.0',
    'hugo-0.152.0+',
    '0.13.0',
    '0.12.0',
    'year-in-review',
    '0.10.0',
    '0.9.0',
    'priorities-for-2024',
    '0.7.x',
    'bootstrap-5-migration',
    'hello',
  ],
};

async function openCleanBlog(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(() => {
    localStorage.removeItem('td-shell-toc-collapsed');
  });
  await page.goto(blogPath, { waitUntil: 'domcontentloaded' });
}

test('RSS joins the right rail control when the rail is collapsed', async ({
  page,
}) => {
  await openCleanBlog(page, 1200);

  const contentRSS = page.locator('.td-rss-button--content');
  const floatingControls = page.locator('.td-shell-toc-float');
  const floatingRSS = floatingControls.getByRole('link', { name: 'RSS' });

  await expect(contentRSS).toBeVisible();
  await expect(floatingControls).toBeHidden();

  await page.locator('.td-shell-toc__title-btn').click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-td-shell-toc',
    'collapsed',
  );
  await expect(contentRSS).toBeHidden();
  await expect(floatingControls).toBeVisible();
  await expect(floatingRSS).toHaveAttribute('href', '/zh/blog/index.xml');
  await expect(
    floatingControls.locator('[data-td-shell-right-toggle]'),
  ).toBeVisible();
});

test('blog metadata links to the post section without changing resting color', async ({
  page,
}) => {
  await openCleanBlog(page, 1024);

  const sectionLink = page
    .locator('.td-blog-posts-list__section-link[href="/zh/blog/oink/"]')
    .first();
  await expect(sectionLink).toHaveText('Oink');
  await expect(sectionLink).toHaveAttribute('href', '/zh/blog/oink/');

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
  await expect(page).toHaveURL(/\/zh\/blog\/oink\/$/);
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
