import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const codeFixture = '/tests/code-blocks/';

async function clipboardText(page) {
  return page.evaluate(() => navigator.clipboard.readText());
}

test.describe('Enhanced code blocks', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('Copy preserves source and excludes inline/table line numbers', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });

    await page.locator('#copy-source [data-td-code-copy]').click();
    await expect
      .poll(() => clipboardText(page))
      .toBe(
        "message: '你好, OINK'\nenabled: true\nitems:\n  - first\n\n  - third\n",
      );

    const copyButton = page.locator('#copy-source [data-td-code-copy]');
    await expect(copyButton).toHaveAccessibleName('Copy code');
    await expect(copyButton).toHaveText('');
    await expect
      .poll(() =>
        copyButton.evaluate((node) => node.getBoundingClientRect().width),
      )
      .toBeLessThanOrEqual(36);

    await expect(page.locator('#copy-disabled')).toHaveAttribute(
      'data-td-language',
      'sh',
    );
    // The lexer name is data, not UI: no language label is rendered, and a
    // copy=false block carries no utility cluster at all.
    await expect(page.locator('#copy-disabled .td-code__language')).toHaveCount(
      0,
    );
    await expect(
      page.locator('#copy-disabled .td-code__utilities'),
    ).toHaveCount(0);

    await page.locator('#numbered-inline [data-td-code-copy]').click();
    await expect
      .poll(() => clipboardText(page))
      .toBe(
        'package main\n\nfunc main() {\n    println("inline numbers")\n}\n',
      );

    await page.locator('#numbered-table [data-td-code-copy]').click();
    await expect
      .poll(() => clipboardText(page))
      .toBe('SELECT 1;\nSELECT 2;\nSELECT 3;\n');
  });

  test('console modes copy commands or the complete transcript exactly', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });

    const commands = page.locator('#console-commands [data-td-code-copy]');
    await commands.focus();
    await commands.press('Enter');
    await expect
      .poll(() => clipboardText(page))
      .toBe(
        "printf 'hello\\n'\nprintf 'world\\n'\nprintf '%s\\n' \\\n  first \\\n  second\n",
      );
    await expect(
      page.locator('#console-commands [data-td-code-status]'),
    ).toHaveText('Copied');

    await page.locator('#console-all [data-td-code-copy]').click();
    await expect
      .poll(() => clipboardText(page))
      .toBe("$ printf 'all\\n'\nall\n");
    await expect(
      page.locator('#copy-disabled [data-td-code-copy]'),
    ).toHaveCount(0);
    await expect(
      page.locator('#copy-disabled [data-td-code-status]'),
    ).toHaveCount(0);
  });

  test('command mode never falls back to transcript text without prompt tokens', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => navigator.clipboard.writeText('sentinel'));

    const button = page.locator('#session-no-prompt [data-td-code-copy]');
    await button.click();
    await expect(button).toHaveAttribute('data-td-state', 'error');
    await expect(
      page.locator('#session-no-prompt [data-td-code-status]'),
    ).toHaveText('Copy failed');
    await expect.poll(() => clipboardText(page)).toBe('sentinel');
  });

  test('clipboard rejection uses the local textarea fallback', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'clipboard', {
        configurable: true,
        get: () => ({
          writeText: () => Promise.reject(new Error('forced rejection')),
        }),
      });
      Document.prototype.execCommand = function execCommand(command) {
        window.__fallbackCommand = command;
        window.__fallbackText = document.querySelector('textarea')?.value;
        return command === 'copy';
      };
    });
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    await page.locator('#copy-source [data-td-code-copy]').click();

    await expect
      .poll(() =>
        page.evaluate(() => [window.__fallbackCommand, window.__fallbackText]),
      )
      .toEqual([
        'copy',
        "message: '你好, OINK'\nenabled: true\nitems:\n  - first\n\n  - third\n",
      ]);
  });

  test('dark syntax colors retain token roles without error boxes or line borders', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() =>
      document.documentElement.setAttribute('data-bs-theme', 'dark'),
    );

    const colors = await page.locator('#copy-source').evaluate((root) => {
      const color = (selector) =>
        getComputedStyle(root.querySelector(selector)).color;
      return {
        key: color('.nt'),
        boolean: color('.kc'),
        string: color('.s1'),
      };
    });
    expect(new Set(Object.values(colors)).size).toBe(3);

    const terminal = await page
      .locator('#console-commands')
      .evaluate((root) => ({
        prompt: getComputedStyle(root.querySelector('.gp')).color,
        output: getComputedStyle(root.querySelector('.go')).color,
        command: getComputedStyle(root.querySelector('.cl')).color,
      }));
    expect(terminal.prompt).not.toBe(terminal.output);
    expect(terminal.output).not.toBe(terminal.command);

    const errorBackgrounds = await page
      .locator('#template-source .err')
      .evaluateAll((tokens) =>
        tokens.map((token) => getComputedStyle(token).backgroundColor),
      );
    expect(errorBackgrounds.length).toBeGreaterThan(0);
    expect(new Set(errorBackgrounds)).toEqual(new Set(['rgba(0, 0, 0, 0)']));

    const highlight = await page
      .locator('#numbered-inline .hl')
      .first()
      .evaluate((line) => ({
        background: getComputedStyle(line).backgroundColor,
        shadow: getComputedStyle(line).boxShadow,
      }));
    expect(highlight.background).not.toBe('rgba(0, 0, 0, 0)');
    const parsedChannels = highlight.background.match(/[\d.]+/g).map(Number);
    const channels = highlight.background.startsWith('color(')
      ? parsedChannels.slice(0, 3).map((channel) => channel * 255)
      : parsedChannels.slice(0, 3);
    expect(Math.max(...channels)).toBeLessThan(60);
    expect(highlight.shadow).toContain('3px 0px');
    expect(highlight.shadow).not.toContain('0px 0px 0px 1px');
  });

  test('collapse is measured, reversible, hash-aware, and motion-safe', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const hiddenNumberLink = page.locator(
      '#numbered-inline-9 a[href="#numbered-inline-9"]',
    );
    await expect(hiddenNumberLink).toHaveAttribute('tabindex', '-1');
    await page.locator('#numbered-inline [data-td-code-expand]').click();
    await expect(hiddenNumberLink).not.toHaveAttribute('tabindex', '-1');

    const root = page.locator('#wrapped-collapsed');
    const expand = root.locator('[data-td-code-expand]');
    await expect(root).toHaveClass(/is-collapsed/);
    await expect(expand).toBeVisible();
    await expect(expand).toHaveAttribute('aria-expanded', 'false');
    await expand.click();
    await expect(root).toHaveClass(/is-expanded/);
    await expect(expand).toHaveAttribute('aria-expanded', 'true');
    await expand.click();
    await expect(root).toHaveClass(/is-collapsed/);
    await expect(
      page.locator('#below-collapse-threshold [data-td-code-expand]'),
    ).toHaveCount(0);

    await page.goto(`${codeFixture}#numbered-inline-10`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('#numbered-inline')).toHaveClass(/is-expanded/);
    await expect(hiddenNumberLink).not.toHaveAttribute('tabindex', '-1');
    await expect
      .poll(async () => {
        const box = await page.locator('#numbered-inline-10').boundingBox();
        return box ? box.y : Number.POSITIVE_INFINITY;
      })
      .toBeLessThan(page.viewportSize().height);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    await expect
      .poll(() =>
        page
          .locator('#wrapped-collapsed [data-td-code-viewport]')
          .evaluate((node) => getComputedStyle(node).transitionDuration),
      )
      .toBe('0s');
  });
});

// Adjacent fences with a `tab` attribute are regrouped into `.td-tabs` sets at
// load. Two sets on the fixture share `group="package-manager"` (client and
// tool installs); a third run has no group and switches locally.
const packageManagerSets = (page) =>
  page.locator('.td-tabs[data-td-tabs-group="package-manager"]');
const tabOf = (set, value) =>
  set.locator(`[role="tab"][data-td-tabs-value="${value}"]`);
const activePanel = (set) =>
  set.locator('.td-tabs__panel[data-td-tabs-active]');

test.describe('Tab set state', () => {
  test('hash wins without overwriting persistence and missing sync values stay put', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-tabs:v1:package-manager', 'npm');
    });
    await page.goto(`${codeFixture}#package-manager-yarn`, {
      waitUntil: 'domcontentloaded',
    });

    const sets = packageManagerSets(page);
    await expect(sets).toHaveCount(2);
    const client = sets.nth(0);
    const tool = sets.nth(1);
    await expect(tabOf(client, 'yarn')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    // The tool set has no `yarn` value, so it keeps the stored selection.
    await expect(tabOf(tool, 'npm')).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem('td-tabs:v1:package-manager')),
      )
      .toBe('npm');
    const viewport = page.viewportSize();
    await expect
      .poll(async () => {
        const box = await client.boundingBox();
        return box ? box.y : Number.POSITIVE_INFINITY;
      })
      .toBeLessThan(viewport.height);
  });

  test('user selection syncs peers, replaces the hash, and persists once', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const sets = packageManagerSets(page);
    const client = sets.nth(0);
    const tool = sets.nth(1);
    const historyLength = await page.evaluate(() => history.length);
    await tabOf(client, 'pnpm').click();
    await expect(tabOf(client, 'pnpm')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(tabOf(tool, 'pnpm')).toHaveAttribute('aria-selected', 'true');
    await expect(activePanel(tool)).toContainText('pnpm add --global');
    await expect(page).toHaveURL(/#package-manager-pnpm$/);
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem('td-tabs:v1:package-manager')),
      )
      .toBe('pnpm');
    expect(await page.evaluate(() => history.length)).toBe(historyLength);
    await expect(
      activePanel(client).locator('[data-td-code-copy]'),
    ).toBeVisible();
  });

  test('an ungrouped run switches locally, keeps literal titles, and writes no key', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const literal = page
      .locator('.td-tabs:not([data-td-tabs-group])')
      .filter({ has: page.getByRole('tab', { name: 'Plain' }) });
    await expect(literal).toHaveCount(1);
    await expect(literal.getByRole('tab')).toHaveText([
      'Backticks **literal** [label]',
      'Plain',
    ]);
    await literal.getByRole('tab', { name: 'Plain' }).click();
    await expect(literal.getByRole('tab', { name: 'Plain' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(activePanel(literal).locator('.td-code')).toHaveClass(
      /is-collapsed/,
    );
    await expect(page).not.toHaveURL(/#/);
    expect(
      await page.evaluate(() =>
        Object.keys(localStorage).filter((key) =>
          key.startsWith('td-tabs:v1:'),
        ),
      ),
    ).toEqual([]);
  });

  test('hash history restores tabs without mutating the saved preference', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-tabs:v1:package-manager', 'pnpm');
    });
    await page.goto(`${codeFixture}#package-manager-npm`, {
      waitUntil: 'domcontentloaded',
    });
    const client = packageManagerSets(page).nth(0);
    await expect(tabOf(client, 'npm')).toHaveAttribute('aria-selected', 'true');

    await page.goto(`${codeFixture}#package-manager-yarn`);
    await expect(tabOf(client, 'yarn')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.goBack();
    await expect(tabOf(client, 'npm')).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem('td-tabs:v1:package-manager')),
      )
      .toBe('pnpm');
  });

  test('storage exceptions do not prevent tab activation', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new Error('forced storage read failure');
      };
      Storage.prototype.setItem = () => {
        throw new Error('forced storage write failure');
      };
    });
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const sets = packageManagerSets(page);
    await tabOf(sets.nth(0), 'pnpm').click();
    await expect(tabOf(sets.nth(0), 'pnpm')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(tabOf(sets.nth(1), 'pnpm')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page).toHaveURL(/#package-manager-pnpm$/);
  });

  test('a grouped set restores its stored value on load and saves clicks', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-tabs:v1:yaml-json', 'json');
    });
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const set = page.locator('.td-tabs[data-td-tabs-group="yaml-json"]');
    await expect(tabOf(set, 'json')).toHaveAttribute('aria-selected', 'true');
    await expect(activePanel(set)).toContainText('"message"');
    await tabOf(set, 'yaml').click();
    await expect(tabOf(set, 'yaml')).toHaveAttribute('aria-selected', 'true');
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem('td-tabs:v1:yaml-json')),
      )
      .toBe('yaml');
  });

  test('arrow keys move and activate tabs while focus stays on the tab', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const client = packageManagerSets(page).nth(0);
    await tabOf(client, 'npm').focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabOf(client, 'pnpm')).toBeFocused();
    await expect(tabOf(client, 'pnpm')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.keyboard.press('End');
    await expect(tabOf(client, 'yarn')).toBeFocused();
    await expect(tabOf(client, 'yarn')).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.keyboard.press('Home');
    await expect(tabOf(client, 'npm')).toBeFocused();
  });
});

test('the EN and ZH guide pair every authoring example with a rendered result', async ({
  page,
}) => {
  // The guides show the markup in a fence titled "Source" / "源码" and put the
  // live rendering immediately after it. Every source fence must be followed by
  // something rendered before the next source fence begins.
  for (const [path, sourceLabel] of [
    ['/docs/components/code/', 'Source'],
    ['/zh/docs/components/code/', '源码'],
  ]) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const pairs = await page.locator('article').evaluate((article, label) => {
      const isSource = (node) =>
        node.matches?.('.td-code') &&
        node.querySelector('.td-code__filename')?.textContent.trim() === label;
      const blocks = [...article.querySelectorAll('.td-code, .td-tabs')];
      const sources = blocks.filter(isSource);
      const followedByRendering = (start) => {
        for (
          let node = start.nextElementSibling;
          node;
          node = node.nextElementSibling
        ) {
          if (isSource(node)) return false;
          if (node.matches('.td-code, .td-tabs, .td-tab-block, table, figure'))
            return true;
          if (node.querySelector?.('.td-code, .td-tabs, .td-tab-block'))
            return true;
        }
        return false;
      };
      return {
        sourceCount: sources.length,
        allPaired: sources.every(followedByRendering),
      };
    }, sourceLabel);
    expect(pairs.sourceCount).toBeGreaterThanOrEqual(8);
    expect(pairs.allPaired).toBe(true);
  }
});

test('code guide surfaces meet WCAG AA in both color themes', async ({
  page,
}) => {
  // Giscus owns its cross-origin widget DOM. This test covers the code guide
  // surfaces, so prevent the third-party iframe from racing the axe scan.
  await page.route('https://giscus.app/**', (route) => route.abort());

  for (const path of [
    '/docs/components/code/',
    '/zh/docs/components/code/',
    codeFixture,
  ]) {
    for (const theme of ['light', 'dark']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.evaluate(
        (selectedTheme) =>
          localStorage.setItem('td-color-theme', selectedTheme),
        theme,
      );
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute(
        'data-bs-theme',
        theme,
      );
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          targets: violation.nodes.map((node) => node.target),
        })),
        `${path} · ${theme}`,
      ).toEqual([]);
    }
  }
});

test('code runtimes are absent on a page without code or tabs', async ({
  page,
}) => {
  await page.goto('/tests/layouts/no-left-sidebar/', {
    waitUntil: 'domcontentloaded',
  });
  const source = await page.evaluate(async () => {
    const script = [...document.scripts].find((entry) =>
      entry.src.includes('/js/main-'),
    );
    return script ? fetch(script.src).then((response) => response.text()) : '';
  });
  expect(source).not.toContain('data-td-code-copy');
  expect(source).not.toContain('td-tabs:v1');
  expect(source).not.toContain('data-td-tab-group');
});

test('print reveals every group panel and hides interactive controls', async ({
  page,
}) => {
  await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
  await page.emulateMedia({ media: 'print' });
  const panels = packageManagerSets(page).nth(0).locator('.td-tabs__panel');
  await expect(panels).toHaveCount(3);
  for (const panel of await panels.all()) {
    await expect(panel).toHaveCSS('display', 'block');
  }
  await expect(
    packageManagerSets(page).nth(0).locator('.td-tabs__list'),
  ).toBeHidden();
  await expect(
    page.locator('#wrapped-collapsed [data-td-code-expand]'),
  ).toBeHidden();
});

test.describe('Code blocks without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('source remains complete and enhancement controls stay hidden', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    await expect(
      page.locator('#wrapped-collapsed [data-td-code-expand]'),
    ).toBeHidden();
    await expect(page.locator('#copy-source [data-td-code-copy]')).toBeHidden();
    await expect(page.locator('#wrapped-collapsed')).not.toHaveClass(
      /is-collapsed/,
    );
    await expect(page.locator('#wrapped-collapsed code')).toContainText(
      'theta = eight',
    );
  });
});
