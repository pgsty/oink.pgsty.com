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
      'data-language',
      'sh',
    );
    await expect(page.locator('#copy-disabled .td-code__language')).toHaveText(
      'BASH',
    );

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
    await expect(button).toHaveAttribute('data-state', 'error');
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

test.describe('Code Group state', () => {
  test('hash wins without overwriting persistence and missing sync values stay put', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-code-group:v1:sync:package-manager', 'npm');
    });
    await page.goto(`${codeFixture}#install-client-yarn`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.locator('#install-client-yarn-tab')).toHaveClass(
      /active/,
    );
    await expect(page.locator('#install-tool-npm-tab')).toHaveClass(/active/);
    await expect
      .poll(() =>
        page.evaluate(() =>
          localStorage.getItem('td-code-group:v1:sync:package-manager'),
        ),
      )
      .toBe('npm');
    const viewport = page.viewportSize();
    await expect
      .poll(async () => {
        const box = await page.locator('#install-client').boundingBox();
        return box ? box.y : Number.POSITIVE_INFINITY;
      })
      .toBeLessThan(viewport.height);
  });

  test('user selection syncs peers, replaces the hash, and persists once', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const historyLength = await page.evaluate(() => history.length);
    await page.locator('#install-client-npm-tab').click();

    await expect(page.locator('#install-client-npm-tab')).toHaveClass(/active/);
    await expect(page.locator('#install-tool-npm-tab')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#install-client-npm$/);
    await expect
      .poll(() =>
        page.evaluate(() =>
          localStorage.getItem('td-code-group:v1:sync:package-manager'),
        ),
      )
      .toBe('npm');
    expect(await page.evaluate(() => history.length)).toBe(historyLength);
    await expect(
      page.locator(
        '#install-client [data-td-code-group-action="npm"] [data-td-code-copy]',
      ),
    ).toBeVisible();
  });

  test('persist=false still switches but writes no group key', async ({
    page,
  }) => {
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    await page.locator('#literal-markers-plain-tab').click();
    await expect(page.locator('#literal-markers-plain-tab')).toHaveClass(
      /active/,
    );
    await expect(page.locator('#literal-markers-ticks-tab')).toHaveText(
      'Backticks **literal** [label]',
    );
    await expect(page.locator('#literal-markers-plain-code')).toHaveClass(
      /is-collapsed/,
    );
    await expect
      .poll(() =>
        page.evaluate(() =>
          localStorage.getItem('td-code-group:v1:group:literal-markers'),
        ),
      )
      .toBeNull();
  });

  test('hash history restores tabs without mutating the saved preference', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-code-group:v1:sync:package-manager', 'pnpm');
    });
    await page.goto(`${codeFixture}#install-client-npm`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('#install-client-npm-tab')).toHaveClass(/active/);

    await page.goto(`${codeFixture}#install-client-yarn`);
    await expect(page.locator('#install-client-yarn-tab')).toHaveClass(
      /active/,
    );
    await page.goBack();
    await expect(page.locator('#install-client-npm-tab')).toHaveClass(/active/);
    await expect
      .poll(() =>
        page.evaluate(() =>
          localStorage.getItem('td-code-group:v1:sync:package-manager'),
        ),
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
    await page.locator('#install-client-npm-tab').click();
    await expect(page.locator('#install-client-npm-tab')).toHaveClass(/active/);
    await expect(page.locator('#install-tool-npm-tab')).toHaveClass(/active/);
    await expect(page).toHaveURL(/#install-client-npm$/);
  });

  test('legacy tabpane reads and writes its existing timestamp keys', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('td-tp-persist-count', '7');
      localStorage.setItem('td-tp-persist:json', '7');
    });
    await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
    const json = page.locator('[data-td-tp-persist="json"]');
    const yaml = page.locator('[data-td-tp-persist="yaml"]');
    await expect(json).toHaveClass(/active/);
    await yaml.click();
    await expect(yaml).toHaveClass(/active/);
    await expect
      .poll(() =>
        page.evaluate(() => [
          localStorage.getItem('td-tp-persist-count'),
          localStorage.getItem('td-tp-persist:yaml'),
        ]),
      )
      .toEqual(['8', '8']);
  });
});

test('the EN and ZH guide pair every authoring example with a rendered result', async ({
  page,
}) => {
  for (const [path, authoring, rendered] of [
    ['/docs/content/code-blocks/', 'Authoring', 'Rendered result'],
    ['/zh/docs/content/code-blocks/', '作者写法', '实际效果'],
  ]) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const pairs = await page.locator('article').evaluate(
      (article, labels) => {
        const labelParagraphs = [...article.querySelectorAll('p')].filter(
          (paragraph) =>
            paragraph.children.length === 1 &&
            paragraph.firstElementChild?.tagName === 'STRONG',
        );
        const authors = labelParagraphs.filter(
          (paragraph) => paragraph.textContent.trim() === labels.authoring,
        );
        const results = labelParagraphs.filter(
          (paragraph) => paragraph.textContent.trim() === labels.rendered,
        );
        const hasComponentBeforeNextLabel = (start) => {
          for (
            let node = start.nextElementSibling;
            node;
            node = node.nextElementSibling
          ) {
            if (labelParagraphs.includes(node)) return false;
            if (node.matches('.td-code, .td-code-group')) return true;
          }
          return false;
        };
        return {
          authorCount: authors.length,
          resultCount: results.length,
          authorSources: authors.every(hasComponentBeforeNextLabel),
          renderedOutputs: results.every(hasComponentBeforeNextLabel),
        };
      },
      { authoring, rendered },
    );
    expect(pairs.authorCount).toBeGreaterThanOrEqual(8);
    expect(pairs.resultCount).toBe(pairs.authorCount);
    expect(pairs.authorSources).toBe(true);
    expect(pairs.renderedOutputs).toBe(true);
  }
});

test('code guide surfaces meet WCAG AA in both color themes', async ({
  page,
}) => {
  // Giscus owns its cross-origin widget DOM. This test covers the code guide
  // surfaces, so prevent the third-party iframe from racing the axe scan.
  await page.route('https://giscus.app/**', (route) => route.abort());

  for (const path of [
    '/docs/content/code-blocks/',
    '/zh/docs/content/code-blocks/',
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
  expect(source).not.toContain('td-code-group:v1');
  expect(source).not.toContain('td-tp-persist');
});

test('print reveals every group panel and hides interactive controls', async ({
  page,
}) => {
  await page.goto(codeFixture, { waitUntil: 'domcontentloaded' });
  await page.emulateMedia({ media: 'print' });
  const panels = page.locator('#install-client [data-td-code-group-panel]');
  await expect(panels).toHaveCount(3);
  for (const panel of await panels.all()) {
    await expect(panel).toHaveCSS('display', 'block');
  }
  await expect(
    page.locator('#install-client .td-code-group__print-title').first(),
  ).toBeVisible();
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
