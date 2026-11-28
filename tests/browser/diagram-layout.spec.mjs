import { expect, test } from '@playwright/test';

for (const language of ['', '/zh']) {
  test(`Markmap preserves frontmatter and hierarchy through source whitespace: ${language || 'en'}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${language}/tests/diagram-layout/`);
    const maps = page.locator('div.markmap:visible');
    await expect(maps).toHaveCount(2);
    const roots = language
      ? ['开头有空行且标题很长的根节点', '整体缩进且标题很长的根节点']
      : ['Blank line root with a long label', 'Indented root with a long label'];
    for (let index = 0; index < roots.length; index++) {
      const svg = maps.nth(index).locator('svg');
      const nodes = svg.locator('text');
      await expect(nodes).toHaveCount(1);
      await expect.poll(async () => (await nodes.first().textContent()).replace(/\s/g, '')).toBe(roots[index].replace(/\s/g, ''));
      await expect.poll(() => nodes.first().evaluate(node => node.getBBox().width)).toBeLessThanOrEqual(120);
      await svg.locator('g[data-key="node:root"] > rect').click();
      await expect(nodes).toHaveCount(2);
      await expect(svg.locator('text').filter({ hasText: language ? '子节点' : 'Child' })).toHaveText(language ? '子节点' : 'Child');
      await maps.nth(index).getByRole('button', { name: language ? '适应窗口' : 'Fit to window' }).click();
      await svg.locator('g[data-key^="node:"]:not([data-key="node:root"]) > rect').click();
      await expect(nodes).toHaveCount(3);
      await expect(svg.locator('text').filter({ hasText: language ? '叶节点' : 'Leaf' })).toHaveText(language ? '叶节点' : 'Leaf');
    }
  });

  test(`Infographic keeps a readable canvas and authored themes: ${language || 'en'}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('td-color-theme', 'dark'));
    await page.goto(`${language}/docs/components/infographic/`);
    const defaultCanvas = page.locator('[data-td-infographic-canvas]').first();
    // Infographics render as the reader approaches them, not at page load.
    await defaultCanvas.scrollIntoViewIfNeeded();
    await expect(defaultCanvas.locator('svg')).toBeVisible();
    await expect(defaultCanvas).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await page.goto(`${language}/tests/diagram-layout/`);
    for (const [name, background] of Object.entries({
      light: 'rgb(255, 255, 255)', dark: 'rgb(31, 31, 31)',
      'hand-drawn': 'rgb(255, 255, 255)', custom: 'rgb(255, 242, 204)',
    })) {
      const canvas = page.locator(`[data-theme-case="${name}"] [data-td-infographic-canvas]`);
      await canvas.scrollIntoViewIfNeeded();
      const svg = canvas.locator('svg');
      await expect(svg).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(canvas).toHaveCSS('background-color', background);
      const markup = await svg.evaluate(el => el.outerHTML);
      expect(markup).toContain('#123456');
      for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
        for (const mode of ['light', 'dark']) {
          await page.evaluate(({ preset, mode }) => {
            document.documentElement.dataset.tdPreset = preset;
            document.documentElement.dataset.bsTheme = mode;
          }, { preset, mode });
          await expect(canvas).toHaveCSS('background-color', background);
          expect(await svg.evaluate(el => el.outerHTML)).toBe(markup);
          const contrast = await canvas.evaluate(el => {
            const luminance = color => {
              const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(c => {
                const s = c / 255;
                return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
              });
              return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
            };
            const label = el.querySelector('[data-element-type="title"] span');
            const fg = luminance(getComputedStyle(label).color);
            const bg = luminance(getComputedStyle(el).backgroundColor);
            return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
          });
          expect(contrast).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  test(`Markmap refits until the reader pans, and offers keyboard reset: ${language || 'en'}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${language}/docs/components/markmap/`);
    // A map keeps its source until the reader approaches it.
    await page.locator('.td-content > pre:has(> code.language-markmap)').first().scrollIntoViewIfNeeded();
    const map = page.locator('.td-content > .markmap').first();
    const svg = map.locator('svg');
    const fitted = () => svg.evaluate((el) => {
      const bounds = el.getBoundingClientRect();
      const labels = [...el.querySelectorAll('text')];
      return labels.length > 5 && labels.every((label) => {
        const rect = label.getBoundingClientRect();
        return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 &&
          rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1;
      });
    });
    await expect(svg).toBeVisible();
    await expect.poll(fitted).toBe(true);
    // Clicking a fold control is not panning. Automatic fitting must remain
    // active when the reader opens the branch and later resizes the column.
    const rootToggle = svg.locator('g[data-key="node:root"] > rect');
    await rootToggle.click();
    await expect(svg.locator('text')).toHaveCount(1);
    await rootToggle.click();
    await expect.poll(fitted).toBe(true);
    for (const width of [390, 820, 320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(fitted).toBe(true);
    }
    await page.setViewportSize({ width: 820, height: 900 });
    for (let toggle = 0; toggle < 2; toggle++) {
      await page.locator(toggle ? '.td-shell-float [data-td-shell-sidebar-toggle]' : '.td-shell-sidebar__collapse').click();
      await expect.poll(fitted).toBe(true);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect.poll(fitted).toBe(true);
    await svg.scrollIntoViewIfNeeded();
    const box = await svg.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 40, { steps: 5 });
    await page.mouse.up();
    const position = await svg.locator(':scope > g').getAttribute('transform');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300); // Let ResizeObserver and any vendor transitions settle.
    expect(await svg.locator(':scope > g').getAttribute('transform')).toBe(position);
    const reset = map.getByRole('button', { name: language ? '适应窗口' : 'Fit to window' });
    const download = map.getByRole('button', { name: language ? '下载 SVG' : 'Download SVG' });
    const controlStyles = await map.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const bar = node.querySelector('.td-markmap__controls');
      const buttons = [...node.querySelectorAll('.td-markmap__control')];
      const barRect = bar.getBoundingClientRect();
      return {
        count: buttons.length,
        atBottomRight:
          barRect.right <= box.right + 1 &&
          barRect.bottom <= box.bottom + 1 &&
          barRect.left >= box.left + box.width / 2,
        borderless: buttons.every(
          (btn) => getComputedStyle(btn).borderTopWidth === '0px' && getComputedStyle(btn).backgroundColor === 'rgba(0, 0, 0, 0)',
        ),
      };
    });
    expect(controlStyles).toEqual({ count: 2, atBottomRight: true, borderless: true });

    await reset.focus();
    await page.keyboard.press('Enter');
    await expect.poll(fitted).toBe(true);

    const downloadPromise = page.waitForEvent('download');
    await download.click();
    const file = await downloadPromise;
    expect(file.suggestedFilename()).toMatch(/^markmap-\d+\.svg$/);
    const stream = await file.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const svgText = Buffer.concat(chunks).toString('utf8');
    expect(svgText).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svgText).toContain('viewBox="');
    expect(svgText).toContain('<rect ');
    expect(svgText).not.toContain('var(--mm-');

    await page.setViewportSize({ width: 820, height: 900 });
    await expect.poll(fitted).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect.poll(fitted).toBe(true);
    await page.goto(`${language}/tests/diagram-layout/`);
    const disclosure = page.locator('details').filter({ has: page.locator('.language-markmap, .markmap') });
    await disclosure.locator('summary').click();
    await expect(disclosure.locator('svg text').first()).toBeVisible();
    expect(await disclosure.locator('svg > g').first().getAttribute('transform')).not.toMatch(/NaN|Infinity/);
  });

  test(`Infographic follows its container through resize and reveal: ${language || 'en'}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${language}/docs/components/infographic/`);
    const canvases = page.locator('[data-td-infographic-canvas]');
    await expect(canvases.first().locator('svg')).toBeVisible();
    // An infographic mounts as the reader approaches it; walk the page once
    // so the resize checks below cover every one of them.
    for (const figure of await page.locator('[data-td-infographic]').all()) {
      await figure.scrollIntoViewIfNeeded();
    }
    await expect(canvases.filter({ has: page.locator('svg') })).toHaveCount(await canvases.count());
    await page.evaluate(() => document.fonts.ready);
    for (const width of [390, 820, 320, 600, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => canvases.evaluateAll((nodes) => nodes.every((node) => {
        const svg = node.querySelector('svg');
        return svg && Math.abs(svg.getBoundingClientRect().width - node.clientWidth) < 2;
      }))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.setViewportSize({ width: 820, height: 900 });
    for (let toggle = 0; toggle < 2; toggle++) {
      await page.locator(toggle ? '.td-shell-float [data-td-shell-sidebar-toggle]' : '.td-shell-sidebar__collapse').click();
      await expect.poll(() => canvases.first().evaluate(el =>
        Math.abs(el.querySelector('svg').getBoundingClientRect().width - el.clientWidth))).toBeLessThan(2);
    }
    await page.goto(`${language}/tests/diagram-layout/`);
    const disclosure = page.locator('details').filter({ has: page.locator('[data-td-infographic]') });
    await disclosure.locator('summary').click();
    const chart = disclosure.locator('[data-td-infographic-canvas] svg');
    await expect(chart).toBeVisible();
    await expect.poll(() => chart.evaluate((svg) => svg.viewBox.baseVal.width)).toBeGreaterThan(0);
    await expect(chart).toContainText(language ? '隐藏图表' : 'Hidden chart');
    await disclosure.locator('summary').click();
    await page.setViewportSize({ width: 390, height: 844 });
    await disclosure.locator('summary').click();
    await expect(chart).toBeVisible();
    expect(await chart.evaluate((svg) => svg.getBoundingClientRect().width <= svg.parentElement.clientWidth + 1)).toBe(true);
    expect(await chart.getAttribute('height')).toBe('320px');
  });
}
