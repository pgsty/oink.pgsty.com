import { expect, test } from '@playwright/test';

// A real page with headings, prose, callouts, code and tables.
const page_ = '/zh/docs/components/callout/';
const mod = process.platform === 'darwin' ? 'Meta' : 'Control';

async function open(page, { preset = 'paper', mode = 'light' } = {}) {
  await page.addInitScript(
    ([p, m]) => {
      try {
        localStorage.setItem('td-preset', p);
        localStorage.setItem('td-color-theme', m);
      } catch (error) {
        /* storage may be blocked */
      }
    },
    [preset, mode],
  );
  await page.goto(page_);
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
  await page.evaluate(() => {
    window.__copied = null;
    window.addEventListener('copy', (event) => {
      window.__copied = {
        handled: event.defaultPrevented,
        html: event.clipboardData.getData('text/html'),
        text: event.clipboardData.getData('text/plain'),
        selection: String(getSelection()),
      };
    });
  });
}

async function copy(page) {
  await page.keyboard.press(`${mod}+c`);
  await expect.poll(() => page.evaluate(() => window.__copied)).not.toBeNull();
  return page.evaluate(() => window.__copied);
}

// Code cards are surfaces in their own right: the block and its filename strip.
function prose(html) {
  return html.replace(/<pre[\s\S]*?<\/pre>/g, '').replace(/<p style="[^"]*border-bottom:0;[^"]*">[^<]*<\/p>/g, '');
}

function canvasOf(page) {
  return page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
    return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
  });
}

test.describe('Typeset copy', () => {
  test('select all copies the article without canvas or interface', async ({ page }) => {
    await open(page);
    expect(await canvasOf(page)).toBe('#faf9f5');
    await page.locator('.td-content > p').first().click();
    await page.keyboard.press(`${mod}+a`);
    const { handled, html, text, selection } = await copy(page);

    expect(handled).toBe(true);
    expect(text).toBe(selection);
    expect(html).toMatch(/^<h1 style="/);
    expect(html).toContain('<h2 style="');
    expect(html).toContain('<blockquote style="');
    expect(html).toContain('<pre style="');
    // No block of prose is painted: the page canvas does not ride along. A
    // quote or a callout keeps its own quiet ground.
    expect(prose(html)).not.toMatch(/<(?:p|h[1-6]|li|ul|ol|td)\b[^>]*background/);
    // No theme markup, no interface: parsed, because this page's own code
    // samples quote class names and attributes as text.
    const markup = await page.evaluate((source) => {
      const holder = document.createElement('template');
      holder.innerHTML = source;
      const all = [...holder.content.querySelectorAll('*')];
      return {
        tags: [...new Set(all.map((node) => node.localName))].sort(),
        attributes: [...new Set(all.flatMap((node) => node.getAttributeNames()))].sort(),
        classes: [...new Set(all.flatMap((node) => [...node.classList]))].filter((name) => !name.startsWith('language-')),
        styles: all.map((node) => node.getAttribute('style') || '').join('\n'),
      };
    }, html);
    for (const tag of markup.tags)
      expect(['a', 'blockquote', 'br', 'code', 'del', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'th', 'tr', 'u', 'ul', 'caption']).toContain(tag);
    for (const name of markup.attributes)
      expect(['alt', 'class', 'colspan', 'href', 'rowspan', 'src', 'start', 'style']).toContain(name);
    expect(markup.classes).toEqual([]);
    expect(markup.styles).not.toMatch(/rem\b|var\(--|font-family:[^;]*Plex/);
    const title = await page.locator('.td-content h1').innerText();
    expect(html).toContain(`>${title}</h1>`);
    const pager = page.locator('.td-pager');
    if (await pager.count()) {
      const next = (await pager.first().innerText()).trim().split('\n')[0];
      if (next) expect(html).not.toContain(next);
    }
  });

  test('a phrase travels bare and interface selections stay native', async ({ page }) => {
    await open(page);
    await page.evaluate(() => {
      const text = [...document.querySelector('.td-content > p').childNodes].find(
        (node) => node.nodeType === 3 && node.nodeValue.trim().length > 6,
      );
      const range = document.createRange();
      range.setStart(text, 1);
      range.setEnd(text, 6);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    });
    const phrase = await copy(page);
    expect(phrase.handled).toBe(true);
    expect(phrase.html).not.toContain('style=');
    expect(phrase.html.replace(/<[^>]+>/g, '')).toBe(phrase.text.trim());

    await page.evaluate(() => {
      window.__copied = null;
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.td-shell-toc, nav'));
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    });
    const chrome = await copy(page);
    expect(chrome.handled).toBe(false);
  });

  for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
    test(`${preset} dark mode still copies ink on paper`, async ({ page }) => {
      await open(page, { preset, mode: 'dark' });
      await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
      const expected = await page.evaluate(() => {
        const read = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim().toLowerCase();
        const hex = (value) => (/^#[0-9a-f]{3}$/.test(value) ? '#' + [...value.slice(1)].map((c) => c + c).join('') : value);
        return { ink: hex(read('--td-print-ink')), link: hex(read('--td-print-link')) };
      });
      const canvas = await canvasOf(page);
      await page.evaluate(() => {
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('.td-content'));
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      });
      const { handled, html } = await copy(page);
      expect(handled).toBe(true);
      expect(html).toMatch(new RegExp(`<p style="[^"]*color:${expected.ink};`));
      // Only a code card may stay dark; prose never carries the canvas.
      expect(prose(html)).not.toMatch(/<(?:p|h[1-6]|li|ul|ol|td)\b[^>]*background/);
      expect(prose(html)).not.toContain(canvas);
    });
  }
});
