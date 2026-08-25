import { expect, test } from '@playwright/test';

// The theme-color contract, pinned where it is actually observable: the
// browser. `bin/check-output.py` owns the head emission -- which three custom
// properties a configured page declares -- and stops there. What this file
// owns is the other half: that the shell surfaces which are supposed to read
// those properties really do, so a section's colour reaches the selected row,
// the row under the pointer, a Book chapter's headings, a share fill and a
// card's hovered edge instead of leaking the brand link blue.
//
// Assertions are written against the page's own resolved tokens rather than
// against hard-coded hexes, so re-colouring a section in its cascade is not a
// test failure -- only breaking the wiring is.

const BOOK = '/book/04-design/';
const DOCS = '/docs/';
const BLOG = '/blog/';

function parseColor(value) {
  // Custom properties keep the author's token form, so a resolved
  // `--td-accent` arrives as `#245f94` while computed styles arrive as
  // `rgb()` / `rgba()` / `color(srgb ...)`.
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const digits =
      hex[1].length === 3
        ? [...hex[1]].map((digit) => digit + digit)
        : hex[1].match(/../g);
    const [r, g, b] = digits.map((pair) => Number.parseInt(pair, 16));
    return { r, g, b, a: 1 };
  }
  const srgb = value
    .trim()
    .match(
      /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/,
    );
  if (srgb) {
    return {
      r: Number(srgb[1]) * 255,
      g: Number(srgb[2]) * 255,
      b: Number(srgb[3]) * 255,
      a: srgb[4] === undefined ? 1 : Number(srgb[4]),
    };
  }
  // Chromium serialises some computed colours in oklab; convert back so every
  // comparison below happens in one space.
  const oklab = value
    .trim()
    .match(
      /^oklab\(\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/,
    );
  if (oklab) {
    const [lightness, greenRed, blueYellow] = oklab.slice(1, 4).map(Number);
    const cube = (x) => x ** 3;
    const long = cube(
      lightness + 0.3963377774 * greenRed + 0.2158037573 * blueYellow,
    );
    const medium = cube(
      lightness - 0.1055613458 * greenRed - 0.0638541728 * blueYellow,
    );
    const short = cube(
      lightness - 0.0894841775 * greenRed - 1.291485548 * blueYellow,
    );
    const encode = (linear) => {
      const clamped = Math.min(1, Math.max(0, linear));
      return (
        255 *
        (clamped <= 0.0031308
          ? 12.92 * clamped
          : 1.055 * clamped ** (1 / 2.4) - 0.055)
      );
    };
    return {
      r: encode(
        4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
      ),
      g: encode(
        -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
      ),
      b: encode(
        -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
      ),
      a: oklab[4] === undefined ? 1 : Number(oklab[4]),
    };
  }
  const rgb = value.trim().match(/^rgba?\(([^)]+)\)$/);
  if (!rgb) throw new Error(`unparsed colour: ${value}`);
  const parts = rgb[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  return {
    r: parts[0],
    g: parts[1],
    b: parts[2],
    a: parts.length > 3 ? parts[3] : 1,
  };
}

// CSS color-mix() in srgb, premultiplied by alpha -- the same arithmetic the
// browser runs for `color-mix(in srgb, first <percent>, second)`.
function mix(first, percent, second) {
  const w1 = percent;
  const w2 = 1 - percent;
  const a = w1 * first.a + w2 * second.a;
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const channel = (key) =>
    (w1 * first.a * first[key] + w2 * second.a * second[key]) / a;
  return { r: channel('r'), g: channel('g'), b: channel('b'), a };
}

function withAlpha(color, a) {
  return { ...color, a };
}

function near(actual, expected, tolerance = 1.5) {
  return (
    Math.abs(actual.r - expected.r) <= tolerance &&
    Math.abs(actual.g - expected.g) <= tolerance &&
    Math.abs(actual.b - expected.b) <= tolerance &&
    Math.abs(actual.a - expected.a) <= 0.01
  );
}

function same(a, b) {
  return near(a, b, 0.6);
}

const relativeLuminance = ({ r, g, b }) => {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  );
};

function contrast(foreground, background) {
  const light = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const dark = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (light + 0.05) / (dark + 0.05);
}

// Resolve tokens off the root, where both _brand.scss and the head-emitted
// theme-color block declare them.
async function tokens(page, names) {
  const resolved = await page.evaluate((keys) => {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      keys.map((key) => [key, style.getPropertyValue(key).trim()]),
    );
  }, names);
  return Object.fromEntries(
    Object.entries(resolved).map(([key, value]) => [key, parseColor(value)]),
  );
}

const cssOf = (locator, property) =>
  locator.evaluate(
    (node, name) => getComputedStyle(node).getPropertyValue(name),
    property,
  );

// Hover and wait for the value to *land*. Every one of these surfaces fades
// -- rows and cards over --td-motion-duration, links and share buttons over
// the fast one -- so both "read in the same tick" and "read as soon as it
// differs" sample the transition rather than its destination. Settling means
// two consecutive reads agree on something other than the resting value.
async function hoverUntilChanged(locator, property) {
  const resting = await cssOf(locator, property);
  await locator.hover();
  let previous = null;
  await expect
    .poll(async () => {
      const current = await cssOf(locator, property);
      const settled = current !== resting && current === previous;
      previous = current;
      return settled;
    })
    .toBe(true);
  return {
    resting: parseColor(resting),
    hovered: parseColor(await cssOf(locator, property)),
  };
}

// Top-level rows are always laid out and reachable; deeper ones can sit inside
// a collapsed branch.
const TOP_ROW =
  '.td-shell-tree__list--1 > li > .td-shell-tree__row:not(.td-shell-active)';

async function setTheme(page, mode) {
  await page.evaluate((value) => {
    document.documentElement.setAttribute('data-bs-theme', value);
    document.body.setAttribute('data-bs-theme', value);
  }, mode);
}

test.describe('Section theme colour reaches the shell', () => {
  test('sidebar rows: the pointer ground is the section accent, one step under the selected row', async ({
    page,
  }) => {
    await page.goto(BOOK, { waitUntil: 'domcontentloaded' });

    const palette = await tokens(page, [
      '--td-accent',
      '--td-shell-accent',
      '--bs-link-color',
    ]);
    // The fixture book is deliberately not the brand blue; without that the
    // rest of this test could not tell accent from link family.
    expect(same(palette['--td-accent'], palette['--bs-link-color'])).toBe(
      false,
    );

    const active = page.locator('.td-shell-tree__row.td-shell-active').first();
    await expect(active).toBeVisible();
    const activeGround = parseColor(await cssOf(active, 'background-color'));
    expect(near(activeGround, withAlpha(palette['--td-accent'], 0.14))).toBe(
      true,
    );

    const row = page.locator(TOP_ROW).first();
    await expect(row).toBeVisible();
    const { hovered: hoverGround } = await hoverUntilChanged(
      row,
      'background-color',
    );

    // Same hue, greyed toward the rail's neutral and poured thinner: it must
    // be neither the old neutral ground nor the selected row.
    const expected = mix(
      withAlpha(palette['--td-accent'], 0.1),
      0.6,
      palette['--td-shell-accent'],
    );
    expect(near(hoverGround, expected)).toBe(true);
    expect(same(hoverGround, palette['--td-shell-accent'])).toBe(false);
    expect(hoverGround.a).toBeLessThan(activeGround.a);

    // Dark mode pours the same recipe one step stronger.
    await setTheme(page, 'dark');
    const darkPalette = await tokens(page, [
      '--td-accent',
      '--td-shell-accent',
    ]);
    await page.mouse.move(0, 0);
    const { hovered: darkHover } = await hoverUntilChanged(
      row,
      'background-color',
    );
    expect(
      near(
        darkHover,
        mix(
          withAlpha(darkPalette['--td-accent'], 0.14),
          0.6,
          darkPalette['--td-shell-accent'],
        ),
      ),
    ).toBe(true);
    expect(
      parseColor(await cssOf(active, 'background-color')).a,
    ).toBeGreaterThan(darkHover.a);
  });

  test('sidebar rows: two differently coloured sections hover differently', async ({
    page,
  }) => {
    const groundOf = async (path) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const row = page.locator(TOP_ROW).first();
      await expect(row).toBeVisible();
      return {
        hover: (await hoverUntilChanged(row, 'background-color')).hovered,
        neutral: (await tokens(page, ['--td-shell-accent']))[
          '--td-shell-accent'
        ],
      };
    };

    const book = await groundOf(BOOK);
    const docs = await groundOf(DOCS);

    // The stock neutral is shared; only the accent poured into it differs, so
    // a difference here can only come from the section colour.
    expect(same(book.neutral, docs.neutral)).toBe(true);
    expect(same(book.hover, docs.hover)).toBe(false);
  });

  test('book headings under a chapter light in the section accent, not the link colour', async ({
    page,
  }) => {
    await page.goto(BOOK, { waitUntil: 'domcontentloaded' });
    const palette = await tokens(page, ['--td-accent', '--bs-link-color']);

    const heading = page.locator('.td-shell-tree__headings a').first();
    await expect(heading).toBeVisible();
    const { resting, hovered } = await hoverUntilChanged(heading, 'color');
    expect(same(hovered, resting)).toBe(false);
    expect(same(hovered, palette['--td-accent'])).toBe(true);
    expect(same(hovered, palette['--bs-link-color'])).toBe(false);
  });

  test('a share button fills with the section accent and keeps the copied check legible', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto(BLOG, { waitUntil: 'domcontentloaded' });
    const post = page.locator('.td-blog-card .td-content-card__title').first();
    await post.click();
    await page.waitForURL(/\/blog\/.+/);

    const palette = await tokens(page, [
      '--td-accent',
      '--bs-body-bg',
      '--bs-link-color',
    ]);
    expect(same(palette['--td-accent'], palette['--bs-link-color'])).toBe(
      false,
    );

    const copy = page.locator('.td-share__item[data-td-action]').first();
    await expect(copy).toBeVisible();
    await copy.scrollIntoViewIfNeeded();
    const { hovered: fill } = await hoverUntilChanged(copy, 'background-color');
    expect(same(fill, palette['--td-accent'])).toBe(true);

    // The pointer stays on the button through the click, so the copied state
    // is read on that fill. A success-green check would sit at ~2.5:1 there,
    // under the 3:1 a meaningful glyph needs.
    await copy.click();
    await expect(copy).toHaveClass(/td-is-copied/);
    const done = copy.locator('.td-share__icon--done');
    await expect(done).toBeVisible();
    const check = parseColor(await cssOf(done, 'color'));
    expect(same(check, palette['--bs-body-bg'])).toBe(true);
    expect(contrast(check, fill)).toBeGreaterThanOrEqual(3);
  });

  test("a content card's hovered edge follows the section accent", async ({
    page,
  }) => {
    await page.goto(BLOG, { waitUntil: 'domcontentloaded' });
    const palette = await tokens(page, [
      '--td-accent',
      '--bs-border-color',
      '--bs-link-color',
    ]);
    expect(same(palette['--td-accent'], palette['--bs-link-color'])).toBe(
      false,
    );

    const card = page.locator('.td-blog-card').first();
    await card.scrollIntoViewIfNeeded();
    const { resting, hovered } = await hoverUntilChanged(
      card,
      'border-top-color',
    );
    expect(same(hovered, resting)).toBe(false);
    expect(
      near(hovered, mix(palette['--td-accent'], 0.45, palette['--bs-border-color'])),
    ).toBe(true);
    expect(
      near(
        hovered,
        mix(palette['--bs-link-color'], 0.45, palette['--bs-border-color']),
      ),
    ).toBe(false);
  });
});
