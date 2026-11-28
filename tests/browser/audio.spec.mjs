import { expect, test } from '@playwright/test';

const mod = process.platform === 'darwin' ? 'Meta' : 'Control';

async function open(page, url, { preset = 'paper', mode = 'light', viewport } = {}) {
  if (viewport) await page.setViewportSize(viewport);
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
  await page.goto(url);
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
}

test.describe('Audio component', () => {
  test('ARIA references, start alignment, and distinct transcript labels hold', async ({ page }) => {
    await open(page, '/docs/components/audio/', { preset: 'terminal', mode: 'dark', viewport: { width: 390, height: 844 } });

    const audit = await page.evaluate(() => {
      const figures = [...document.querySelectorAll('figure.td-media--audio')];
      const audioCheck = figures.map((fig) => {
        const audio = fig.querySelector('audio');
        const title = fig.querySelector('.td-media__title');
        const caption = fig.querySelector('.td-fig-caption');
        const lbl = audio?.getAttribute('aria-labelledby') || '';
        const desc = audio?.getAttribute('aria-describedby') || '';
        const row = fig.querySelector(':scope > .td-media__controls');
        const seek = row?.querySelector('.td-media__seek');
        return {
          rowNamedByTitle: !!row && row.getAttribute('aria-labelledby') === title?.id,
          // A narrow row gives the one progress bar a line of its own.
          seekFillsRow: !!seek && Math.abs(seek.getBoundingClientRect().width - row.getBoundingClientRect().width) < 1,
          hasTdFigure: fig.classList.contains('td-figure'),
          hasAriaLabel: audio?.hasAttribute('aria-label'),
          lblMatches: !!lbl && lbl === title?.id,
          descMatches: caption ? desc === caption.id : desc === '',
          figAlign: getComputedStyle(fig).textAlign,
          captionAlign: caption ? getComputedStyle(caption).textAlign : null,
        };
      });
      const summaries = [...document.querySelectorAll('figure.td-media--audio + details.td-callout--details > summary')]
        .map((el) => el.textContent.trim());
      const overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      return { audioCheck, summaries, overflowX };
    });

    expect(audit.audioCheck.length).toBeGreaterThanOrEqual(5);
    for (const item of audit.audioCheck) {
      expect(item.hasTdFigure).toBe(false);
      expect(item.hasAriaLabel).toBe(false);
      expect(item.lblMatches).toBe(true);
      expect(item.rowNamedByTitle).toBe(true);
      expect(item.seekFillsRow).toBe(true);
      expect(item.descMatches).toBe(true);
      expect(['start', 'left']).toContain(item.figAlign);
      if (item.captionAlign) expect(['start', 'left']).toContain(item.captionAlign);
    }
    expect(audit.overflowX).toBe(false);
    expect(audit.summaries.length).toBe(2);
    expect(new Set(audit.summaries).size).toBe(2);
  });

  test('audio keeps media margins and pairs with transcripts and samples', async ({ page }) => {
    await open(page, '/docs/components/audio/', { preset: 'paper', mode: 'light', viewport: { width: 1280, height: 900 } });

    const layout = await page.evaluate(() => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const gap = (a, b) => Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom);
      const section = (id, selector) => {
        const items = [];
        for (let el = document.getElementById(id).nextElementSibling; el && el.tagName !== 'H2'; el = el.nextElementSibling) {
          if (el.matches(selector)) items.push(el);
        }
        return items;
      };
      // A lone recording: Bootstrap's figure reset must not win over the media margins.
      const lone = section('minimal', 'figure.td-media--audio')[0];
      const style = getComputedStyle(lone);
      const pair = section('transcript', 'figure.td-media--audio, details.td-callout--details');
      const samples = section('caption', 'figure.td-media--audio');
      return {
        rem,
        loneTop: parseFloat(style.marginTop),
        loneBottom: parseFloat(style.marginBottom),
        loneToText: gap(lone, lone.nextElementSibling),
        count: pair.length,
        audioToTranscript1: gap(pair[0], pair[1]),
        transcript1ToAudio2: gap(pair[1], pair[2]),
        audioToTranscript2: gap(pair[2], pair[3]),
        sampleCount: samples.length,
        sampleToSample: gap(samples[0], samples[1]),
      };
    });

    const px = (value) => Math.round(value * layout.rem);
    expect(layout.loneTop).toBe(px(1.5));
    expect(layout.loneBottom).toBe(px(1.75));
    expect(layout.loneToText).toBe(px(1.75));
    expect(layout.count).toBe(4);
    expect(layout.audioToTranscript1).toBe(px(0.5));
    expect(layout.transcript1ToAudio2).toBe(px(1.5));
    expect(layout.audioToTranscript2).toBe(px(0.5));
    expect(layout.sampleCount).toBe(2);
    expect(layout.sampleToSample).toBe(px(1));
  });

  test('Paper and Terminal presets match sibling surface, radius, border, and title font', async ({ page }) => {
    await open(page, '/docs/components/audio/', { preset: 'paper', mode: 'light' });
    const paperTokens = await page.evaluate(() => {
      const card = document.querySelector('figure.td-media--audio');
      const callout = document.querySelector('details.td-callout--details');
      return {
        cardRadius: getComputedStyle(card).borderTopLeftRadius,
        calloutRadius: getComputedStyle(callout).borderTopLeftRadius,
        cardBg: getComputedStyle(card).backgroundColor,
        calloutBg: getComputedStyle(callout).backgroundColor,
      };
    });
    expect(paperTokens.cardRadius).toBe(paperTokens.calloutRadius);
    expect(paperTokens.cardBg).toBe(paperTokens.calloutBg);

    await open(page, '/docs/components/audio/', { preset: 'terminal', mode: 'dark' });
    const terminalTokens = await page.evaluate(() => {
      const card = document.querySelector('figure.td-media--audio');
      const title = card.querySelector('.td-media__title');
      const rootStyle = getComputedStyle(document.documentElement);
      const probe = document.createElement('div');
      probe.style.borderColor = 'var(--td-brand-line-strong)';
      document.body.appendChild(probe);
      const expectedBorder = getComputedStyle(probe).borderTopColor;
      probe.remove();
      return {
        borderColor: getComputedStyle(card).borderTopColor,
        expectedBorder,
        titleFont: getComputedStyle(title).fontFamily,
        uiFont: rootStyle.getPropertyValue('--td-ui-font-family').trim(),
      };
    });
    expect(terminalTokens.borderColor).toBe(terminalTokens.expectedBorder);
    expect(terminalTokens.titleFont.toLowerCase()).toContain('mono');
  });

  test('dedicated Print shows visible recording URLs on screen and paper', async ({ page }) => {
    await open(page, '/_print/docs/components/', { preset: 'paper', mode: 'light' });

    const result = await page.evaluate(() => {
      const figures = [...document.querySelectorAll('figure.td-media--audio')];
      const links = figures.map((fig) => {
        const a = fig.querySelector('p.td-media__link > a');
        const rect = a?.getBoundingClientRect();
        return {
          hasAudio: !!fig.querySelector('audio'),
          hasHiddenUrl: !!fig.querySelector('.td-media__url'),
          href: a?.getAttribute('href') || '',
          text: a?.textContent?.trim() || '',
          visible: !!rect && rect.width > 0 && rect.height > 0 && getComputedStyle(a).display !== 'none',
        };
      });
      const detailsCount = figures.reduce((acc, fig) => {
        const next = fig.nextElementSibling;
        return acc + (next && next.tagName === 'DETAILS' ? 1 : 0);
      }, 0);
      return { links, detailsCount };
    });

    expect(result.links.length).toBeGreaterThanOrEqual(5);
    expect(result.detailsCount).toBe(0);
    for (const item of result.links) {
      expect(item.hasAudio).toBe(false);
      expect(item.hasHiddenUrl).toBe(false);
      expect(item.visible).toBe(true);
      expect(item.text).toMatch(/^https?:\/\/.+\.mp3$/);
    }
  });

  test('dark mode browser print resets audio figures to paper palette', async ({ page }) => {
    for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
      await open(page, '/docs/components/audio/', { preset, mode: 'dark' });
      await page.emulateMedia({ media: 'print' });

      const metrics = await page.evaluate(() => {
        const fig = document.querySelector('figure.td-media--audio');
        const title = fig.querySelector('.td-media__title');
        const url = fig.querySelector('.td-media__url');
        const link = url.querySelector('a');
        const audio = fig.querySelector('audio');
        const parseRgb = (str) => (str.match(/\d+/g) || []).map(Number);
        const bg = getComputedStyle(fig).backgroundColor;
        const titleRgb = parseRgb(getComputedStyle(title).color);
        const linkRgb = parseRgb(getComputedStyle(link).color);
        return {
          bg,
          audioDisplay: getComputedStyle(audio).display,
          urlDisplay: getComputedStyle(url).display,
          titleLuminance: titleRgb[0] + titleRgb[1] + titleRgb[2],
          linkLuminance: linkRgb[0] + linkRgb[1] + linkRgb[2],
        };
      });

      expect(metrics.bg, `${preset} dark print card bg`).toMatch(/^rgba\(0, 0, 0, 0\)|rgb\(255, 255, 255\)$/);
      expect(metrics.audioDisplay, `${preset} dark print hides <audio>`).toBe('none');
      expect(metrics.urlDisplay, `${preset} dark print shows .td-media__url`).toBe('block');
      expect(metrics.titleLuminance, `${preset} dark print title ink must be dark`).toBeLessThan(220);
      expect(metrics.linkLuminance, `${preset} dark print link ink must be dark`).toBeLessThan(400);
      await page.emulateMedia({ media: 'screen' });
    }
  });

  test('one audible player at a time, with real playback', async ({ page }) => {
    await open(page, '/docs/components/audio/', { preset: 'paper', mode: 'light' });

    const scriptLoaded = await page.evaluate(() =>
      [...document.scripts].some((s) => /\/js\/chunks\/media(?:\.min\.[0-9a-f]+)?\.js$/.test(s.src)),
    );
    expect(scriptLoaded).toBe(true);

    // A click is the user activation that lets audible playback start.
    await page.locator('h1').first().click();
    const state = await page.evaluate(async () => {
      const settle = () => new Promise((resolve) => setTimeout(resolve, 150));
      const [first, second] = document.querySelectorAll('figure.td-media--audio audio');
      const loop = (marked) => {
        const el = document.createElement('audio');
        el.src = first.currentSrc || first.src;
        el.loop = true;
        el.muted = true;
        if (marked) el.setAttribute('data-td-media-autoplay', '');
        document.body.appendChild(el);
        return el;
      };
      const out = {};

      await first.play();
      await second.play();
      await settle();
      out.switch = { first: first.paused, second: second.paused };

      // The theme's muted loop and an author's own muted loop are silent:
      // they neither pause the audio nor get paused by it.
      const themed = loop(true);
      const own = loop(false);
      await themed.play();
      await own.play();
      await settle();
      out.silentStart = { second: second.paused, themed: themed.paused, own: own.paused };
      await first.play();
      await settle();
      out.silentKept = { second: second.paused, themed: themed.paused, own: own.paused };

      // Unmuting a loop that is already playing fires volumechange, not play.
      themed.muted = false;
      await settle();
      out.unmuted = { first: first.paused, themed: themed.paused, own: own.paused };

      [first, second, themed, own].forEach((el) => el.pause());
      themed.remove();
      own.remove();
      return out;
    });

    expect(state.switch).toEqual({ first: true, second: false });
    expect(state.silentStart).toEqual({ second: false, themed: false, own: false });
    expect(state.silentKept).toEqual({ second: true, themed: false, own: false });
    expect(state.unmuted).toEqual({ first: true, themed: false, own: false });
  });

  test('rich copy preserves audio URL and start alignment', async ({ page }) => {
    await open(page, '/docs/components/audio/', { preset: 'paper', mode: 'light' });
    await page.evaluate(() => {
      window.__copied = null;
      window.addEventListener('copy', (event) => {
        window.__copied = {
          handled: event.defaultPrevented,
          html: event.clipboardData.getData('text/html'),
        };
      });
      const fig = document.querySelector('#caption ~ figure.td-media--audio');
      const range = document.createRange();
      range.setStartBefore(fig.previousElementSibling);
      range.setEndAfter(fig.nextElementSibling);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    });
    await page.keyboard.press(`${mod}+c`);
    await expect.poll(() => page.evaluate(() => window.__copied)).not.toBeNull();
    const { handled, html } = await page.evaluate(() => window.__copied);

    expect(handled).toBe(true);
    expect(html).not.toContain('<audio');
    expect(html).toContain('text-align:left;');
    expect(html).toMatch(/<a href="https?:\/\/[^"]+welcome-en\.mp3"/);
  });
});
