import { expect, test } from '@playwright/test';

const EN_VIDEO = '/docs/components/video/';
const ZH_VIDEO = '/zh/docs/components/video/';
const PLAYER_HOSTS = [
  'player.bilibili.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
];

function parseColor(value) {
  const match = value.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
}

function luminance([r, g, b]) {
  const channel = (n) => {
    const s = n / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

async function stubPlayers(page) {
  for (const host of PLAYER_HOSTS) {
    await page.route(`https://${host}/**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: `<!doctype html><title>Stub ${host}</title><body style="margin:0;background:#111;color:#fff;font:14px sans-serif">stub player</body>`,
      });
    });
  }
}

async function openVideo(page, url, { preset = 'paper', mode = 'light', reducedMotion = 'no-preference' } = {}) {
  await page.emulateMedia({ reducedMotion });
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
  await page.goto(url, { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', preset);
}

test.describe('Video component', () => {
  test('makes zero third-party requests before click, honors modified clicks, and loads a hardened iframe on Enter', async ({ page }) => {
    const externalBeforeClick = [];
    const baseHost = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173').host;
    page.on('request', (req) => {
      const url = new URL(req.url());
      if ((url.protocol === 'http:' || url.protocol === 'https:') && url.host !== baseHost) {
        externalBeforeClick.push(req.url());
      }
    });
    await stubPlayers(page);
    await openVideo(page, EN_VIDEO);

    // Wait briefly to confirm no eager background fetch or thumbnail request occurs.
    await page.waitForTimeout(300);
    expect(externalBeforeClick).toEqual([]);

    const card = page.locator('a.td-media-card[data-td-media-embed]').first();
    await expect(card).toBeVisible();
    const accessibleText = (await card.textContent()) || '';
    expect(accessibleText).toContain('·');
    expect(accessibleText).toContain('Bilibili');

    // A modified click must not swap the card into an iframe.
    await card.scrollIntoViewIfNeeded();
    const preventedByPlayer = await card.evaluate(link => {
      let prevented;
      // Observe the click after the player's document handler, then keep native navigation local to the test.
      window.addEventListener('click', event => {
        prevented = event.defaultPrevented;
        event.preventDefault();
      }, { once: true });
      link.dispatchEvent(new MouseEvent('click', { button: 0, metaKey: true, cancelable: true, bubbles: true }));
      return prevented;
    });
    expect(preventedByPlayer).toBe(false);
    await expect(card).toBeVisible();
    await expect(page.locator('.td-media-player iframe')).toHaveCount(0);
    expect(externalBeforeClick).toEqual([]);

    // Keyboard activation (focus + Enter) swaps the card for a hardened iframe and moves focus into it.
    const playerRequests = [];
    page.on('request', (req) => {
      if (req.url().startsWith('https://player.bilibili.com/')) {
        playerRequests.push(req.url());
      }
    });
    await card.focus();
    await page.keyboard.press('Enter');

    const frame = page.locator('.td-media-player > iframe').first();
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute(
      'src',
      'https://player.bilibili.com/player.html?bvid=BV1o3411w7hP&p=1&autoplay=1&danmaku=0',
    );
    await expect(frame).toHaveAttribute('allow', 'autoplay; picture-in-picture; fullscreen');
    await expect(frame).toHaveAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox',
    );
    await expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    await expect(frame).toHaveAttribute('title', /Pigsty/);
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName || '');
    expect(focusedTag).toBe('IFRAME');
    expect(playerRequests.length).toBeGreaterThan(0);

    // Sibling print fallback URL survives iframe replacement.
    const fallbackUrl = page.locator('.td-media--embed .td-media__url').first();
    await expect(fallbackUrl).toHaveCount(1);
    await expect(fallbackUrl).toContainText('https://www.bilibili.com/video/BV1o3411w7hP');
  });

  test('gates autoplay videos by reduced motion, visibility, and reader pause', async ({ page }) => {
    await stubPlayers(page);

    // Under reduced motion, autoplay videos stay paused even when scrolled into view.
    await openVideo(page, EN_VIDEO, { reducedMotion: 'reduce' });
    const reducedVideo = page.locator('video[data-td-media-autoplay]').first();
    await reducedVideo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const reducedState = await reducedVideo.evaluate((el) => ({
      paused: el.paused,
      muted: el.muted,
      controls: el.hasAttribute('controls'),
      autoplayAttr: el.hasAttribute('autoplay'),
    }));
    expect(reducedState).toEqual({
      paused: true,
      muted: true,
      controls: true,
      autoplayAttr: false,
    });

    // Under normal motion, video autoplays in view, respects reader pause, and pauses off-screen.
    await openVideo(page, EN_VIDEO, { reducedMotion: 'no-preference' });
    const video = page.locator('video[data-td-media-autoplay]').first();
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((el) => !el.paused)).toBe(true);

    // Reader pauses manually: slight scrolling inside viewport does not resume it.
    await video.evaluate((el) => el.pause());
    await expect.poll(() => video.evaluate((el) => el.paused)).toBe(true);
    await page.evaluate(() => window.scrollBy(0, 24));
    await page.waitForTimeout(300);
    expect(await video.evaluate((el) => el.paused)).toBe(true);

    // Scroll far away (leaving viewport), then return: resumes muted autoplay.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((el) => !el.paused && el.muted)).toBe(true);

    // Scroll back to top: pauses again.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => video.evaluate((el) => el.paused)).toBe(true);
  });

  for (const preset of ['paper', 'slate', 'ink', 'terminal']) {
    for (const mode of ['light', 'dark']) {
      test(`${preset} ${mode} maintains >= 3:1 hover contrast on the play button`, async ({ page }) => {
        await stubPlayers(page);
        await openVideo(page, EN_VIDEO, { preset, mode });
        const card = page.locator('a.td-media-card').first();
        await card.scrollIntoViewIfNeeded();
        await card.hover();
        await page.waitForTimeout(200);
        const colors = await card.locator('.td-media-card__play').evaluate((el) => {
          const style = getComputedStyle(el);
          return { fg: style.color, bg: style.backgroundColor };
        });
        const ratio = contrastRatio(parseColor(colors.fg), parseColor(colors.bg));
        expect(ratio, `${preset}/${mode} contrast ${colors.fg} on ${colors.bg}`).toBeGreaterThanOrEqual(3);
      });
    }
  }

  test('narrow viewports keep card play button clear of wrapped titles without horizontal overflow', async ({ page }) => {
    await stubPlayers(page);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [url, preset, mode] of [
      [EN_VIDEO, 'terminal', 'dark'],
      [ZH_VIDEO, 'paper', 'light'],
    ]) {
      await openVideo(page, url, { preset, mode });
      const card = page.locator('a.td-media-card').first();
      await card.scrollIntoViewIfNeeded();
      const geometry = await card.evaluate((el) => {
        const play = el.querySelector('.td-media-card__play').getBoundingClientRect();
        const text = el.querySelector('.td-media-card__text').getBoundingClientRect();
        return {
          playBottom: play.bottom,
          textTop: text.top,
          overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });
      expect(geometry.playBottom, `${url} ${preset}/${mode} overlap`).toBeLessThanOrEqual(geometry.textTop + 0.5);
      expect(geometry.overflowX).toBe(false);
    }
  });

  test('dark mode browser print gives poster-less card text the paper ink', async ({ page }) => {
    await stubPlayers(page);
    await openVideo(page, EN_VIDEO, { mode: 'dark' });
    await page.emulateMedia({ media: 'print' });
    const card = page.locator('a.td-media-card').first();
    // Poll: the theme's color transitions may still be settling after the media switch.
    for (const part of ['.td-media-card__title', '.td-media-card__platform']) {
      await expect
        .poll(async () => {
          const color = await card.locator(part).evaluate((el) => getComputedStyle(el).color);
          return contrastRatio(parseColor(color), [255, 255, 255]);
        }, { message: `dark-mode print ${part} on paper` })
        .toBeGreaterThanOrEqual(4.5);
    }
  });

  test('forced colors and browser print (before and after iframe swap) render cleanly', async ({ page }) => {
    await stubPlayers(page);
    await openVideo(page, EN_VIDEO);

    // Forced colors: play button has an explicit border.
    await page.emulateMedia({ forcedColors: 'active' });
    const forcedBorder = await page.locator('.td-media-card__play').first().evaluate((el) => {
      return parseFloat(getComputedStyle(el).borderTopWidth);
    });
    expect(forcedBorder).toBeGreaterThanOrEqual(1);

    // Browser print BEFORE click: hide play glyph, no card underline, show URL without duplicate title.
    await page.emulateMedia({ forcedColors: 'none', media: 'print' });
    const beforePrint = await page.locator('.td-media--embed').first().evaluate((fig) => {
      const card = fig.querySelector('.td-media-card');
      const play = fig.querySelector('.td-media-card__play');
      const url = fig.querySelector('.td-media__url');
      const urlTitle = fig.querySelector('.td-media__url-title');
      return {
        playDisplay: getComputedStyle(play).display,
        cardDeco: getComputedStyle(card).textDecorationLine,
        urlDisplay: getComputedStyle(url).display,
        urlTitleDisplay: getComputedStyle(urlTitle).display,
      };
    });
    expect(beforePrint).toEqual({
      playDisplay: 'none',
      cardDeco: 'none',
      urlDisplay: 'block',
      urlTitleDisplay: 'none',
    });

    // Click card in screen mode, then print: hide iframe box and reveal title + platform + watch URL.
    await page.emulateMedia({ media: 'screen' });
    await page.locator('a.td-media-card[data-td-media-embed]').first().click();
    await expect(page.locator('.td-media-player > iframe').first()).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    const afterPrint = await page.locator('.td-media--embed').first().evaluate((fig) => {
      const player = fig.querySelector('.td-media-player');
      const url = fig.querySelector('.td-media__url');
      const urlTitle = fig.querySelector('.td-media__url-title');
      return {
        playerDisplay: getComputedStyle(player).display,
        urlDisplay: getComputedStyle(url).display,
        urlTitleDisplay: getComputedStyle(urlTitle).display,
        urlText: url.textContent.trim(),
      };
    });
    expect(afterPrint.playerDisplay).toBe('none');
    expect(afterPrint.urlDisplay).toBe('block');
    expect(afterPrint.urlTitleDisplay).not.toBe('none');
    expect(afterPrint.urlText).toContain('Bilibili');
    expect(afterPrint.urlText).toContain('https://www.bilibili.com/video/BV1o3411w7hP');
  });
});
