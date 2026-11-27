import { expect, test } from '@playwright/test';

const fixture = '/tests/book-navigation/';

async function openClean(page, path, width = 1440) {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    for (const key of ['td-shell-sidebar-collapsed', 'td-shell-sidebar-w', 'td-shell-toc-collapsed']) {
      localStorage.removeItem(key);
    }
  });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.OinkSidebar?.isReady);
}

for (const prefix of ['', '/zh']) {
  test(`Book ${prefix || 'en'} keeps left headings off and the outline reachable`, async ({ page }) => {
    await openClean(page, `${prefix}/book/03-pages/`);
    await expect(page.locator('[data-td-book-headings]')).toHaveCount(0);
    await expect(page.locator('.td-shell-toc__panel #TableOfContents')).toBeVisible();

    for (const width of [820, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      if (width < 768) {
        await page.locator('[data-td-shell-drawer-open]:visible').click();
      }
      const container = page.locator(width < 1200 ? '[data-td-shell-aside-slot]' : '.td-shell-toc__panel');
      const group = container.locator('.td-shell-aside-group--toc');
      await expect(group).toBeVisible();
      const toggle = group.locator('[data-td-shell-tree-toggle]');
      if ((await toggle.getAttribute('aria-expanded')) === 'false') await toggle.click();
      await expect(group.locator('#TableOfContents a').first()).toBeVisible();
      await expect(page.locator('[data-td-book-headings]')).toHaveCount(0);
    }
  });
}

for (const width of [390, 1440]) {
  test(`optional Book headings follow the parent and heading depths at ${width}px`, async ({ page }) => {
    for (const [path, anchor] of [['plain/', 'review'], ['part/', 'overview'], ['part/chapter/', 'confirm']]) {
      await openClean(page, `${fixture}${path}`, width);
      if (width < 768) await page.locator('[data-td-shell-drawer-open]:visible').click();
      const branch = page.locator('[data-td-book-headings]');
      await expect(branch).toHaveCount(1);
      await expect(branch).toBeVisible();
      if (path === 'part/') {
        await expect(page.locator('.td-shell-tree__row.td-shell-active .td-shell-tree__link > i')).toHaveCount(1);
      }

      for (const direction of ['ltr', 'rtl']) {
        await page.locator('html').evaluate((html, dir) => { html.dir = dir; }, direction);
        const geometry = await branch.evaluate((node) => {
          const row = node.previousElementSibling;
          const title = row.querySelector('.td-shell-tree__link > span:not(.td-book-number)');
          const edge = (element) => {
            const box = element.getBoundingClientRect();
            return document.documentElement.dir === 'rtl' ? -box.right : box.left;
          };
          return { parent: edge(title), headings: [...node.querySelectorAll('a')].map(edge) };
        });
        expect(geometry.headings[0] - geometry.parent).toBeGreaterThanOrEqual(10);
        for (let i = 1; i < geometry.headings.length; i++) {
          expect(geometry.headings[i] - geometry.headings[i - 1]).toBeGreaterThanOrEqual(11);
        }
      }
      await page.locator('html').evaluate((html) => { html.dir = 'ltr'; });
      await branch.locator('a').last().focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`#${anchor}$`));
    }

    await openClean(page, `${fixture}part/disabled/`, width);
    await expect(page.locator('[data-td-book-headings]')).toHaveCount(0);
    await expect(page.locator('#TableOfContents a')).not.toHaveCount(0);
  });
}

for (const [name, path, minimum, fraction, maximum] of [
  ['Book', fixture, 286, 0.2, 420],
  ['Docs', '/docs/customize/layout/', 286, 0.2, 420],
  ['flow', '/blog/immersive-reading/', 340, 0.22, 440],
]) {
  test(`${name} outline grows within bounds and survives viewport transitions`, async ({ page }) => {
    await openClean(page, path);
    const rail = page.locator('.td-shell-toc');
    const panel = page.locator('.td-shell-toc__panel');
    for (const width of [360, 767, 768, 820, 1024, 1199, 1200, 1440, 1600, 1920, 2560, 1199, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      if (width < 1200) {
        await expect(rail).toBeHidden();
        // The immersive Blog deliberately disables its left sidebar. Other
        // shells relocate the same outline into their sidebar/drawer.
        if (name === 'flow') await expect(panel).toBeHidden();
        else await expect(page.locator('[data-td-shell-aside-slot] #TableOfContents')).toHaveCount(1);
      } else {
        await expect(panel).toBeVisible();
        const expected = Math.min(maximum, Math.max(minimum, width * fraction));
        await expect.poll(async () => (await panel.boundingBox()).width).toBeCloseTo(expected, 0);
        expect((await rail.boundingBox()).width).toBeCloseTo(expected, 0);
        const article = await page.locator('.td-shell-article').boundingBox();
        const railBox = await rail.boundingBox();
        expect(article.width).toBeGreaterThan(500);
        expect(article.x + article.width).toBeLessThanOrEqual(railBox.x + 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }

    await panel.locator('[data-td-shell-right-toggle]').click();
    await expect.poll(async () => (await rail.boundingBox()).width).toBe(0);
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
    await page.locator('.td-shell-toc-float [data-td-shell-right-toggle]').click();
    await expect(panel).not.toHaveAttribute('aria-hidden', 'true');
    await expect.poll(async () => (await rail.boundingBox()).width).toBeCloseTo(Math.min(maximum, 1920 * fraction), 0);
  });
}

test('a long Book outline label unwraps as the rail gains space', async ({ page }) => {
  await openClean(page, fixture, 1200);
  const label = page.locator('.td-shell-toc__panel #TableOfContents a').first();
  const narrow = await label.boundingBox();
  await page.setViewportSize({ width: 2560, height: 1000 });
  await expect.poll(async () => (await label.boundingBox()).height).toBeLessThan(narrow.height);
  await expect(page.locator('[data-td-book-headings]')).toHaveCount(0);
});

test('the fixed outline and its reserved column resize together on every frame', async ({ page }) => {
  await openClean(page, fixture);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1920, 1440]) {
    await page.evaluate(() => {
      window.railWidthSamples = [];
      const sample = () => {
        const reserved = document.querySelector('.td-shell-toc').getBoundingClientRect().width;
        const visible = document.querySelector('.td-shell-toc__panel').getBoundingClientRect().width;
        window.railWidthSamples.push(Math.abs(reserved - visible));
        if (window.railWidthSamples.length < 30) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForFunction(() => window.railWidthSamples.length === 30);
    expect(await page.evaluate(() => Math.max(...window.railWidthSamples))).toBeLessThanOrEqual(1);
  }
});

for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
  for (const mode of ['light', 'dark']) {
    for (const [name, path, minimum, fraction, maximum] of [
      ['Book', '/zh/book/03-pages/', 286, 0.2, 420],
      ['Docs', '/docs/customize/layout/', 286, 0.2, 420],
      ['flow', `${fixture}flow/`, 340, 0.22, 440],
    ]) {
      test(`${name} ${preset} ${mode}: article never rebounds while shrinking past its full width`, async ({ page }) => {
        // Exercise normal motion: reduced-motion tests hide width-transition lag.
        // Cross the point where the article starts giving up its maximum width.
        await page.addInitScript(({ preset, mode }) => {
          localStorage.setItem('td-preset', preset);
          localStorage.setItem('td-color-theme', mode);
        }, { preset, mode });
        await openClean(page, path, 2560);
        await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', mode);
        await page.evaluate(() => document.fonts.ready);
        const maximumArticle = (await page.locator('.td-shell-article').boundingBox()).width;
        const sidebarWidth = await page.locator('.td-shell-sidebar').evaluateAll(
          nodes => nodes[0]?.getBoundingClientRect().width || 0,
        );
        const boundary = Math.ceil((maximumArticle + sidebarWidth) / (1 - fraction));
        await page.setViewportSize({ width: boundary + 24, height: 1000 });
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.evaluate(() => {
          window.resizeSamples = [];
          window.sampleResize = true;
          const sample = () => {
            const width = (selector) => document.querySelector(selector).getBoundingClientRect().width;
            window.resizeSamples.push({
              viewport: innerWidth,
              article: width('.td-shell-article'),
              reserved: width('.td-shell-toc'),
              panel: width('.td-shell-toc__panel'),
            });
            if (window.sampleResize) requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        });
        for (let width = boundary + 24; width >= boundary - 48; width -= 2) {
          await page.setViewportSize({ width, height: 1000 });
          // Allow several frames between drag steps to expose a delayed rebound.
          await page.evaluate(() => new Promise(resolve => {
            requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          }));
        }
        const samples = await page.evaluate(() => {
          window.sampleResize = false;
          return window.resizeSamples;
        });
        expect(samples.length).toBeGreaterThan(70);
        expect(samples[0].article).toBeCloseTo(maximumArticle, 0);
        expect(samples.at(-1).article).toBeLessThan(maximumArticle - 20);
        for (const [index, sample] of samples.entries()) {
          const expected = Math.min(maximum, Math.max(minimum, sample.viewport * fraction));
          expect(Math.abs(sample.reserved - expected), `reserved width at frame ${index}`).toBeLessThanOrEqual(1);
          expect(Math.abs(sample.panel - expected), `panel width at frame ${index}`).toBeLessThanOrEqual(1);
          if (index) {
            expect(sample.article - samples[index - 1].article, `article rebound at frame ${index}`).toBeLessThanOrEqual(0.02);
          }
        }
      });
    }
  }
}
