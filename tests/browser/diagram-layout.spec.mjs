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
      const nodes = svg.locator('foreignObject');
      await expect(nodes).toHaveText([roots[index]]);
      await expect.poll(() => nodes.first().evaluate(node => node.width.baseVal.value)).toBe(120);
      await svg.locator('.markmap-node > circle').click();
      await expect(nodes).toHaveCount(2);
      await expect(svg.locator('.markmap-node[data-depth="2"] foreignObject')).toHaveText(language ? '子节点' : 'Child');
      await maps.nth(index).getByRole('button', { name: language ? '适应窗口' : 'Fit to window' }).click();
      await svg.locator('.markmap-fold > circle').click();
      await expect(nodes).toHaveCount(3);
      await expect(svg.locator('.markmap-node[data-depth="3"] foreignObject')).toHaveText(language ? '叶节点' : 'Leaf');
    }
  });

  test(`Infographic keeps a readable canvas and authored themes: ${language || 'en'}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('td-color-theme', 'dark'));
    await page.goto(`${language}/docs/components/infographic/`);
    const defaultCanvas = page.locator('[data-td-infographic-canvas]').first();
    await expect(defaultCanvas.locator('svg')).toBeVisible();
    await expect(defaultCanvas).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await page.goto(`${language}/tests/diagram-layout/`);
    for (const [name, background] of Object.entries({
      light: 'rgb(255, 255, 255)', dark: 'rgb(31, 31, 31)',
      'hand-drawn': 'rgb(255, 255, 255)', custom: 'rgb(255, 242, 204)',
    })) {
      const canvas = page.locator(`[data-theme-case="${name}"] [data-td-infographic-canvas]`);
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
    const map = page.locator('.td-content > .markmap').first();
    const svg = map.locator('svg');
    const fitted = () => svg.evaluate((el) => {
      const bounds = el.getBoundingClientRect();
      const labels = [...el.querySelectorAll('foreignObject')];
      return labels.length > 5 && labels.every((label) => {
        const rect = label.getBoundingClientRect();
        return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 &&
          rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1;
      });
    });
    await expect(svg).toBeVisible();
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
    await reset.focus();
    await page.keyboard.press('Enter');
    await expect.poll(fitted).toBe(true);
    await page.setViewportSize({ width: 820, height: 900 });
    await expect.poll(fitted).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect.poll(fitted).toBe(true);
    await page.goto(`${language}/tests/diagram-layout/`);
    const disclosure = page.locator('details').filter({ has: page.locator('.language-markmap, .markmap') });
    await disclosure.locator('summary').click();
    await expect(disclosure.locator('svg foreignObject').first()).toBeVisible();
    expect(await disclosure.locator('svg > g').first().getAttribute('transform')).not.toMatch(/NaN|Infinity/);
  });

  test(`Infographic follows its container through resize and reveal: ${language || 'en'}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${language}/docs/components/infographic/`);
    const canvases = page.locator('[data-td-infographic-canvas]');
    await expect(canvases.first().locator('svg')).toBeVisible();
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
