import { expect, test } from '@playwright/test';

for (const language of ['', '/zh']) {
  for (const colorScheme of ['light', 'dark']) {
    test(`MathML and KaTeX layout remain compatible: ${language || 'en'} ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${language}/docs/components/math/`);
      await page.evaluate(() => document.fonts.ready);
      const formulas = page.locator('#td-main-content .katex');
      expect(await formulas.count()).toBeGreaterThan(5);
      const layout = await formulas.evaluateAll((nodes) => nodes.map((node) => {
        const base = node.querySelector('.katex-base');
        const strut = node.querySelector('.katex-strut');
        const script = node.querySelector('.katex-sizing.reset-size6.size3');
        return {
          mathml: !!node.querySelector('math annotation'),
          base: base && getComputedStyle(base).position,
          strut: strut && getComputedStyle(strut).display,
          scriptRatio: script && parseFloat(getComputedStyle(script).fontSize) /
            parseFloat(getComputedStyle(node).fontSize),
        };
      }));
      for (const formula of layout) {
        expect(formula.mathml).toBe(true);
        expect(formula.base).toBe('relative');
        expect(formula.strut).toBe('inline-block');
      }
      const scripts = layout.filter((formula) => formula.scriptRatio !== null);
      expect(scripts.length).toBeGreaterThan(0);
      for (const formula of scripts) expect(formula.scriptRatio).toBeCloseTo(0.7, 2);
      const display = page.locator('#td-main-content .katex-display').first();
      await expect(display).toHaveAttribute('tabindex', '0');
      await display.focus();
      await expect(display).toBeFocused();
      // A numbered equation's caption shares the narrow reading column and
      // must wrap instead of widening the document on a phone.
      await expect(page.locator('.td-book-figure--eq figcaption').first()).toHaveCSS('white-space', 'normal');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
}
