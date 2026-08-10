import { expect, test } from '@playwright/test';

const blogPath = '/zh/blog/';

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

  const sectionLink = page.locator('.td-blog-posts-list__section-link').first();
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
