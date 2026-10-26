import { test, expect } from '@playwright/test';

async function expectUniqueIDs(page) {
  const duplicates = await page.locator('[id]').evaluateAll((nodes) => {
    const ids = nodes.map((node) => node.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
}

for (const language of ['', '/zh']) {
  test(`nested HTML fragments reveal every ancestor: ${language || 'en'}`, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-tabs:v1:example-syntax', 'example');
      localStorage.setItem('td-tabs:v1:platform', 'unix');
    });
    await page.goto(`${language}/tests/print-tabs/a/#platform-windows`);
    const outer = page.locator('#example-syntax-syntax');
    const inner = page.locator('#platform-windows');
    await expect(outer).toBeVisible();
    await expect(inner).toBeVisible();
    await expect(inner).toBeInViewport();
    const preferences = () => page.evaluate(() => [
      localStorage.getItem('td-tabs:v1:example-syntax'),
      localStorage.getItem('td-tabs:v1:platform'),
    ]);
    expect(await preferences()).toEqual(['example', 'unix']);
    await page.locator('[aria-controls="example-syntax-example"]').click();
    await expect(outer).toBeHidden();
    await page.evaluate(() => { location.hash = encodeURIComponent('嵌套打印标题'); });
    await expect(outer).toBeVisible();
    await expect(page.locator('[id="嵌套打印标题"]')).toBeInViewport();
    expect(await preferences()).toEqual(['example', 'unix']);
    await page.evaluate(() => { location.hash = 'platform-unix'; });
    await expect(page.locator('#platform-unix')).toBeVisible();
    await page.evaluate(() => { location.hash = encodeURIComponent('打印片段'); });
    await expect(page.locator('[id="打印片段"]')).toBeInViewport();
    expect(await preferences()).toEqual(['example', 'unix']);
  });

  for (const width of [360, 1440]) {
    test(`grouped tab links stay in their Print chapter: ${language || 'en'} ${width}`, async ({ page }) => {
      // Link contracts do not depend on clicking during smooth fragment scrolling.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      const route = `${language}/tests/print-tabs`;
      const syntax = language ? '章节 b 语法.' : 'Chapter b syntax.';
      const ownLink = language ? '本章语法' : 'Own syntax';
      const otherLink = language ? '另一章语法' : 'Other chapter syntax';
      const encodedLink = language ? '编码标题' : 'Encoded heading';
      const encodedHeading = language ? '章节 b 编码标题' : 'Chapter b encoded heading';
      const nestedLink = language ? '嵌套标题' : 'Nested heading';
      const nestedHeading = language ? '章节 b 嵌套标题' : 'Chapter b nested heading';

      await page.goto(`${route}/b/#example-syntax-syntax`);
      const panel = page.locator('#example-syntax-syntax');
      await expect(panel).toBeVisible();
      await expect(panel).toContainText(syntax);
      await expect(page.locator('#platform-unix')).toBeVisible();
      await expectUniqueIDs(page);
      await expect(page.getByRole('link', { name: otherLink, exact: true }))
        .toHaveJSProperty('href', new URL(`${route}/a/#example-syntax-syntax`, page.url()).href);
      await page.getByRole('link', { name: encodedLink, exact: true }).click();
      await expect(page.locator(':target')).toContainText(encodedHeading);
      await page.getByRole('link', { name: nestedLink, exact: true }).click();
      await expect(page.locator(':target')).toContainText(nestedHeading);

      await page.goto(`${language}/_print/tests/print-tabs/b/#example-syntax-syntax`);
      await expect(page.locator(':target')).toContainText(syntax);
      await expect(page.locator('#example-syntax-syntax')).toHaveCount(1);
      await expect(page.locator('#platform-windows')).toBeVisible();
      await expectUniqueIDs(page);
      await expect(page.getByRole('link', { name: ownLink, exact: true }))
        .toHaveAttribute('href', '#example-syntax-syntax');
      await page.getByRole('link', { name: encodedLink, exact: true }).click();
      await expect(page.locator(':target')).toContainText(encodedHeading);
      await page.getByRole('link', { name: nestedLink, exact: true }).click();
      await expect(page.locator(':target')).toContainText(nestedHeading);

      await page.goto(`${language}/_print/tests/print-tabs/`);
      const laterChapter = page.getByRole('link', { name: ownLink, exact: true }).nth(1);
      await expect(laterChapter).toHaveAttribute('href', /^#pg-[\da-f]+--example-syntax-syntax$/);
      await laterChapter.click();
      await expect(page.locator(':target')).toContainText(syntax);
      await expect(page.locator('[id$="--example-syntax-syntax"]')).toHaveCount(2);
      await expect(page.locator('#authored-b')).toHaveCount(1);
      await expect(page.getByRole('link', { name: otherLink, exact: true }).nth(1))
        .toHaveAttribute('href', `${route}/a/#example-syntax-syntax`);
      for (const [variant, title] of Object.entries({
        single: "fake href='#example-syntax-syntax'",
        bare: 'fake href=#example-syntax-syntax > text',
        double: 'fake href="#example-syntax-syntax"',
        entity: 'encoded fragment',
        self: 'same page',
      })) {
        const link = page.locator(`[data-test-tab-link="${variant}"]`).nth(1);
        await expect(link).toHaveAttribute('title', title);
        await expect(link).toHaveAttribute('href', await laterChapter.getAttribute('href'));
        await link.click();
        await expect(page.locator(':target')).toContainText(syntax);
      }
      const laterEncoded = page.getByRole('link', { name: encodedLink, exact: true }).nth(1);
      await expect(laterEncoded).toHaveAttribute('href', /^#pg-[\da-f]+--打印片段$/);
      await laterEncoded.click();
      await expect(page.locator(':target')).toContainText(encodedHeading);
      const laterNested = page.getByRole('link', { name: nestedLink, exact: true }).nth(1);
      await expect(laterNested).toHaveAttribute('href', /^#pg-[\da-f]+--嵌套打印标题$/);
      await laterNested.click();
      await expect(page.locator(':target')).toContainText(nestedHeading);
      await expectUniqueIDs(page);
    });
  }
}
