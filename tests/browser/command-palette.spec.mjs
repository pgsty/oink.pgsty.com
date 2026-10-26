import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const docsPath = "/docs/customize/config/";
const zhDocsPath = "/zh/docs/customize/config/";

async function openPalette(page, path = docsPath, viewport = null) {
  if (viewport) await page.setViewportSize(viewport);
  await page.goto(path, { waitUntil: "domcontentloaded" });
  // An auto-hidden navbar reveals on hover: park the pointer on its band
  // first so the wake strip cannot swallow the opener's preflight hit
  // check. Drawer widths render the band as display: contents (no box).
  const autohide = page.locator("[data-td-navbar-autohide]");
  const band = (await autohide.count()) ? await autohide.boundingBox() : null;
  if (band) {
    await page.mouse.move(band.x + band.width / 2, band.y + 8);
    await page.waitForTimeout(250);
  }
  await page.locator("[data-td-shell-search-open]:visible").first().click();
  const dialog = page.locator("#td-shell-search");
  const input = dialog.locator(".td-shell-search__input");
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  return { dialog, input };
}

function group(dialog, label) {
  return dialog.getByRole("group", { name: label, exact: true });
}

async function fillCommandAndWait(
  input,
  dialog,
  value,
  optionText,
  actionsLabel = /^(Actions|操作)$/,
) {
  await input.fill(value);
  const actions = dialog.getByRole("group", { name: actionsLabel });
  await expect(actions).toBeVisible();
  await expect(
    dialog.getByRole("group", { name: /^(Quick links|快速链接)$/ }),
  ).toHaveCount(0);
  const option = actions
    .getByRole("option", {
      name: new RegExp(optionText, "i"),
    })
    .first();
  await expect(option).toBeVisible();
  return option;
}

test("empty Palette exposes shared quick links, page actions, and preferences", async ({
  page,
}) => {
  const { dialog, input } = await openPalette(page);
  await expect(input).toHaveAttribute("role", "combobox");
  await expect(input).toHaveAttribute("aria-expanded", "true");

  const quick = group(dialog, "Quick links");
  await expect(quick).toContainText("Docs");
  await expect(quick).toContainText("Blog");
  const actions = group(dialog, "Page actions");
  await expect(actions).toContainText("Copy Markdown");
  await expect(actions).toContainText("Open in ChatGPT");
  await expect(actions).toContainText("Open in Claude");
  await expect(actions).toContainText("View markdown");
  await expect(actions).toContainText("View edit history");
  await expect(actions).toContainText("Edit this page");
  await expect(actions).toContainText("Create docs issue");
  await expect(actions).toContainText("Create child page");
  await expect(actions).toContainText("Create project issue");
  await expect(actions).toContainText("Print entire section");
  const preferences = group(dialog, "Preferences");
  await expect(preferences).toContainText("Toggle color theme");
  await expect(preferences).toContainText("Switch language");
  await expect(preferences).toContainText("v1.4.0");
  const commands = group(dialog, "Commands");
  await expect(commands).toContainText("OINK issues");
  await expect(commands).not.toContainText("Copy Markdown");

  const rows = dialog.locator('[role="option"]');
  const activeId = await input.getAttribute("aria-activedescendant");
  expect(activeId).toBeTruthy();
  await expect(page.locator(`#${activeId}`)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(rows.first()).not.toHaveAttribute("tabindex", "0");
});

test("ordinary EN/ZH queries group pages and actions without external requests", async ({
  page,
}) => {
  for (const [path, query, expected, groupLabel] of [
    [docsPath, "config", "Configuration", "Docs"],
    [zhDocsPath, "配置", "配置", "文档"],
  ]) {
    await page.route("https://giscus.app/**", (route) => route.abort());
    const indexRequests = [];
    page.on("request", (request) => {
      if (request.url().includes("offline-search-index")) {
        indexRequests.push(request.url());
      }
    });
    const { dialog, input } = await openPalette(page, path);
    const pages = group(dialog, groupLabel);
    await input.fill(query);
    await expect(pages).toContainText(expected);
    expect(indexRequests).toHaveLength(1);
    expect(new URL(indexRequests[0]).origin).toBe(new URL(page.url()).origin);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  }
});

test("command mode is index-free and localizes configured commands", async ({
  page,
}) => {
  const indexRequests = [];
  page.on("request", (request) => {
    if (request.url().includes("offline-search-index")) {
      indexRequests.push(request.url());
    }
  });
  const { dialog, input } = await openPalette(page, zhDocsPath);
  expect(indexRequests).toEqual([]);
  await fillCommandAndWait(input, dialog, "> 暗色", "切换配色");
  await expect(dialog.locator('[role="option"]')).toHaveCount(1);
  await expect(dialog.locator('[role="option"]')).toContainText("切换配色");
  expect(indexRequests).toEqual([]);

  await fillCommandAndWait(input, dialog, "> OINK 问题", "OINK 问题反馈");
  await expect(dialog.locator('[role="option"]')).toContainText(
    "OINK 问题反馈",
  );
  expect(indexRequests).toEqual([]);
});

test("slash opens search, backslash opens command mode, both yield to fields", async ({
  page,
}) => {
  await page.goto(docsPath, { waitUntil: "domcontentloaded" });
  const opener = page.locator("[data-td-shell-search-open]:visible").first();
  await opener.focus();
  await page.keyboard.press("/");

  const dialog = page.locator("#td-shell-search");
  const input = dialog.locator(".td-shell-search__input");
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("");
  await expect(group(dialog, "Quick links")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await page.keyboard.press("\\");
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(">");
  await expect(group(dialog, "Quick links")).toHaveCount(0);
  await expect(group(dialog, "Page actions")).toHaveCount(0);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await page.evaluate(() => {
    const input = document.createElement("input");
    input.setAttribute("data-test-slash-field", "");
    document.body.appendChild(input);
  });
  const search = page.locator("[data-test-slash-field]");
  await search.focus();
  await search.fill("docs");
  await search.press("/");
  await expect(search).toHaveValue("docs/");
  await search.press("\\");
  await expect(search).toHaveValue("docs/\\");
  await expect(dialog).toBeHidden();
});

test("built-in choice actions reuse theme, language, and version executors", async ({
  page,
}) => {
  const { dialog, input } = await openPalette(page);
  await fillCommandAndWait(
    input,
    dialog,
    "> toggle color",
    "Toggle color theme",
  );
  await page.keyboard.press("Enter");
  await expect(dialog.locator(".td-shell-search__group-label")).toHaveText(
    "Choose an option",
  );
  await expect(dialog.locator('[role="option"]')).toHaveCount(3);
  await expect(dialog).toContainText("Dark");
  await dialog.getByRole("option", { name: /^Dark$/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-bs-theme", "dark");
  await expect(dialog).toBeVisible();

  await fillCommandAndWait(
    input,
    dialog,
    "> switch language",
    "Switch language",
  );
  await page.keyboard.press("Enter");
  await expect(dialog).toContainText("English");
  await expect(dialog).toContainText("简体中文");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.keyboard.press(
    process.platform === "darwin" ? "Meta+k" : "Control+k",
  );
  await fillCommandAndWait(input, dialog, "> version", "v1.4.0");
  await page.keyboard.press("Enter");
  await expect(dialog).toContainText("v1.4.0");
});

test("Copy Markdown executes once through the shared registry", async ({
  page,
}) => {
  // Observe the shared clipboard call in every engine; Playwright only supports
  // granting clipboard-read/write permissions in Chromium.
  await page.addInitScript(() => {
    window.__paletteClipboardWrites = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text) => window.__paletteClipboardWrites.push(text) },
    });
  });
  const { dialog, input } = await openPalette(page);
  await fillCommandAndWait(input, dialog, "> copy markdown", "Copy Markdown");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__paletteClipboardWrites))
    .toEqual([expect.stringContaining("# Configuration")]);

  await expect(dialog).toBeVisible();
});

test("URL actions match progressive-enhancement anchors", async ({ page }) => {
  await page.goto(docsPath, { waitUntil: "domcontentloaded" });
  const manifest = await page
    .locator("#td-action-manifest")
    .evaluate((node) => JSON.parse(node.textContent || "{}"));
  const action = (id) =>
    manifest.actions.find((candidate) => candidate.id === id);
  const controls = page.locator("[data-td-page-context]");
  for (const [id, selector] of [
    ["open_chatgpt", '[data-td-action="open_chatgpt"]'],
    ["open_claude", '[data-td-action="open_claude"]'],
    ["view_markdown", '[data-td-action="view_markdown"]'],
    ["view_history", '[data-td-action="view_history"]'],
    ["edit_page", '[data-td-action="edit_page"]'],
    ["create_issue", '[data-td-action="create_issue"]'],
  ]) {
    const descriptor = action(id);
    const anchor = controls.locator(selector);
    if (id === "open_chatgpt" || id === "open_claude") {
      const href = new URL(await anchor.getAttribute("href"));
      expect(href.origin).toBe(new URL(descriptor.url).origin);
      const prompt = href.searchParams.get(
        id === "open_chatgpt" ? "prompt" : "q",
      );
      expect(prompt).toContain(page.url());
    } else {
      await expect(anchor).toHaveAttribute("href", descriptor.url);
    }
    await expect(anchor).toHaveAttribute("target", "_blank");
    await expect(anchor).toHaveAttribute("rel", /noopener/);
  }

  const githubURL = action("open_github").url;
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }).first(),
  ).toHaveAttribute("href", githubURL);
});

test("assistant command resolves the browser URL at activation time", async ({
  page,
}) => {
  const { dialog, input } = await openPalette(page);
  await page.evaluate(() => {
    history.replaceState(null, "", "?mode=release-review#literal-$&");
    window.__openedUrls = [];
    window.open = (url, target, features) => {
      window.__openedUrls.push({ url, target, features });
      return null;
    };
  });
  const currentUrl = page.url();
  expect(currentUrl).toContain("$&");

  const option = await fillCommandAndWait(
    input,
    dialog,
    "> ChatGPT",
    "Open in ChatGPT",
  );
  await option.click();

  await expect
    .poll(() => page.evaluate(() => window.__openedUrls))
    .toHaveLength(1);
  const opened = await page.evaluate(() => window.__openedUrls[0]);
  const manifest = await page
    .locator("#td-action-manifest")
    .evaluate((node) => JSON.parse(node.textContent || "{}"));
  const action = manifest.actions.find(
    (candidate) => candidate.id === "open_chatgpt",
  );
  const target = new URL(opened.url);
  expect(target.origin).toBe("https://chatgpt.com");
  expect(target.searchParams.get("prompt")).toBe(
    action.promptTemplate.replace("%s", () => currentUrl),
  );
  expect(opened.target).toBe("_blank");
  expect(opened.features).toBe("noopener,noreferrer");
});

test("preset choices retain the Palette for another action", async ({ page }) => {
  const { dialog, input } = await openPalette(page);
  const action = await fillCommandAndWait(input, dialog, '> style', '^Style');
  await action.click();
  await dialog.getByRole('listbox').getByRole('option', { name: /Slate/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-td-preset', 'slate');
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
});

test("Landing drawer search returns focus to its visible menu toggle", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[data-td-landing-menu-toggle]');
  await toggle.click();
  await page.locator('[data-td-landing-menu] [data-td-shell-search-open]').click();
  const dialog = page.locator('#td-shell-search');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("mobile Palette restores focus and has no WCAG AA violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh/", { waitUntil: "domcontentloaded" });
  const opener = page.locator("[data-td-shell-search-open]:visible");
  await opener.focus();
  await opener.click();
  const dialog = page.locator("#td-shell-search");
  await expect(dialog).toBeVisible();
  await fillCommandAndWait(
    dialog.locator(".td-shell-search__input"),
    dialog,
    "> 打印完整章节",
    "打印完整章节",
    /^操作$/,
  );

  const { violations } = await new AxeBuilder({ page })
    .include("#td-shell-search")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(violations).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

for (const clipboardMode of ["unavailable", "denied"]) {
  test(`Palette retains typing and focus isolation after ${clipboardMode} clipboard fallback`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(Navigator.prototype, "clipboard", {
        configurable: true,
        get() {
          return mode === "unavailable" ? undefined : {
            writeText() { return Promise.reject(new Error("Clipboard denied")); },
          };
        },
      });
      // Keep the browser's real textarea focus/selection behavior but avoid
      // changing the host clipboard while exercising the fallback path.
      document.execCommand = (command) => {
        window.fallbackCopiedText = document.querySelector("textarea")?.value;
        return command === "copy";
      };
    }, clipboardMode);
    const { dialog, input } = await openPalette(page);
    await fillCommandAndWait(input, dialog, "> copy link", "Copy link");
    await input.evaluate(node => node.setSelectionRange(2, 6, "backward"));
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => window.fallbackCopiedText)).toMatch(/\/docs\/customize\/config\/$/);
    await expect(input).toBeFocused();
    expect(await input.evaluate(node => [node.selectionStart, node.selectionEnd, node.selectionDirection]))
      .toEqual([2, 6, "backward"]);
    await page.keyboard.type("copied");
    await expect(input).toHaveValue("> copied link");
    // Recover even if site code sends focus outside the open Palette.
    await page.locator(".td-skip-link").focus();
    await page.keyboard.press("Tab");
    await expect(input).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
}

test("fixed ARIA dialogs own keyboard shortcuts only while visible", async ({ page }) => {
  await page.goto(docsPath, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const modal = document.createElement("div");
    modal.id = "fixed-dialog-probe";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.cssText = "position:fixed;inset:20px;z-index:100000;background:white";
    modal.innerHTML = '<button id="fixed-dialog-focus">Modal control</button>';
    document.body.append(modal);
    modal.firstElementChild.focus();
  });
  const modal = page.locator("#fixed-dialog-probe");
  const palette = page.locator("#td-shell-search");
  const theme = await page.locator("html").getAttribute("data-bs-theme");
  expect(await modal.evaluate(node => node.offsetParent)).toBeNull();
  for (const shortcut of ["Control+k", "Meta+k", "f", "c", "t"]) {
    await page.keyboard.press(shortcut);
    await expect(palette).toBeHidden();
    await expect(page.locator("#fixed-dialog-focus")).toBeFocused();
    await expect(page.locator("html")).not.toHaveAttribute("data-td-shell-lock");
    await expect(page.locator("html")).toHaveAttribute("data-bs-theme", theme);
  }
  for (const [hiddenStyle, shortcut] of [["display:none", "Control+k"], ["visibility:hidden", "f"]]) {
    await modal.evaluate((node, style) => { node.style.cssText += `;${style}`; }, hiddenStyle);
    await page.keyboard.press(shortcut);
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();
    await modal.evaluate(node => { node.style.display = ""; node.style.visibility = ""; });
  }
});

test("clipboard fallback restores a backward DOM selection on success and failure", async ({ page }) => {
  await page.goto(docsPath, { waitUntil: "domcontentloaded" });
  for (const outcome of ["success", "rejected", "throw"]) {
    const result = await page.evaluate(async outcome => {
      const field = document.createElement("p");
      field.contentEditable = "true";
      field.textContent = "0123456789";
      document.body.append(field);
      field.focus();
      const text = field.firstChild;
      const selection = getSelection();
      selection.setBaseAndExtent(text, 8, text, 2);
      const original = document.execCommand;
      document.execCommand = () => {
        if (outcome === "throw") throw new Error("Copy failed");
        return outcome === "success";
      };
      let rejected = false;
      try {
        await window.OinkClipboard.writeText("Copy text", document, {
          clipboard: { writeText() { return Promise.reject(new Error("Clipboard denied")); } },
        });
      } catch { rejected = true; }
      finally { document.execCommand = original; }
      const state = {
        rejected, focused: document.activeElement === field,
        anchor: selection.anchorNode === text && selection.anchorOffset,
        focus: selection.focusNode === text && selection.focusOffset,
        text: selection.toString(),
      };
      field.remove();
      return state;
    }, outcome);
    expect(result).toEqual({
      rejected: outcome !== "success", focused: true,
      anchor: 8, focus: 2, text: "234567",
    });
  }
});

// Local search: same palette, real summaries/headings, current-root filter.
const searchPrefix = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173').pathname.replace(/\/$/, '');
for (const language of ['en', 'zh']) {
  for (const width of [390, 1440]) {
    for (const theme of ['light', 'dark']) {
      test(`local search ${language} ${width} ${theme}: mixed terms, anchors and accessible scope`, async ({page}, testInfo) => {
        await page.addInitScript(mode => localStorage.setItem('td-color-theme', mode), theme);
        const path = searchPrefix + (language === 'zh' ? zhDocsPath : docsPath);
        const {dialog, input} = await openPalette(page, path, {width, height:900});
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', theme);
        const scopes = dialog.getByRole('radiogroup', {name: language === 'zh' ? '搜索范围' : 'Search in', exact:true});
        const all = scopes.locator('input[value=""]');
        const current = scopes.locator('input[value="docs"]');
        await expect(all).toBeChecked();
        for (const radio of await scopes.getByRole('radio').all())
          expect((await radio.boundingBox()).height).toBeGreaterThanOrEqual(44);
        const panel = dialog.locator('.td-shell-search__panel');
        await expect(panel).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
        const rect = await panel.boundingBox();
        // Chromium can report fractional layout noise after the transform settles.
        expect(rect.width).toBeLessThanOrEqual(Math.min(600, width - 16) + 0.5);
        expect(rect.height).toBeLessThanOrEqual((width < 576 ? 640 : 520) + 0.5);
        await testInfo.attach('search-empty', {body:await panel.screenshot(),contentType:'image/png'});
        await input.fill(language === 'zh' ? '侧栏 标题' : 'sidebar headings');
        await expect.poll(async () => page.evaluate(() => window.OinkCommandPalette.instance.rows().filter(r=>r.type==='page').length)).toBeGreaterThan(0);
        let rows = await page.evaluate(() => window.OinkCommandPalette.instance.rows().filter(r=>r.type==='page'));
        const target = rows.find(r => r.ref.endsWith('/docs/customize/layout/#sidebar-headings'));
        expect(target).toBeTruthy();
        expect(rows.every(r=> language === 'zh' ? r.ref.includes('/zh/') : !r.ref.includes('/zh/'))).toBeTruthy();
        expect(new Set(rows.map(r=>r.sourceId)).size).toBe(rows.length);
        expect(await dialog.locator('mark').count()).toBeGreaterThan(0);
        await input.press('Tab');
        // WebKit follows macOS tab preferences and may skip the close button.
        if (!(await all.evaluate(el => el === document.activeElement)))
          await page.keyboard.press('Tab');
        await expect(all).toBeFocused();
        await page.keyboard.press('ArrowRight');
        await expect(current).toBeChecked();
        await expect(current).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(input).toBeFocused();
        await input.press('Shift+Tab');
        await expect(current).toBeFocused();
        await page.keyboard.press('ArrowLeft');
        await expect(all).toBeChecked();
        await page.keyboard.press('Tab');
        await expect(input).toBeFocused();
        await current.check();
        rows = await page.evaluate(() => window.OinkCommandPalette.instance.rows().filter(r=>r.type==='page'));
        expect(rows.length).toBeGreaterThan(0);
        expect(rows.every(r=>r.page.doc.root==='docs')).toBeTruthy();
        await testInfo.attach('search-results', {body:await panel.screenshot(),contentType:'image/png'});
        await input.fill(language === 'zh' ? '配置 qzxnomatchword' : 'config qzxnomatchword');
        await expect(dialog.locator('[data-td-shell-search-status]')).toContainText(language === 'zh' ? '部分匹配' : 'partial matches');
        await expect(dialog.locator('.td-shell-search__item-ref').first()).toContainText('1/2');
        const violations = (await new AxeBuilder({page}).include('#td-shell-search').analyze()).violations;
        expect(violations).toEqual([]);
        await testInfo.attach('search-palette', {body:await panel.screenshot(),contentType:'image/png'});
        await input.fill('>');
        await expect(scopes).toBeHidden();
        await expect(dialog.getByRole('group', {name: /^(Actions|操作)$/})).toBeVisible();
        await page.keyboard.press('Escape');
        await page.goto(new URL(target.ref, page.url()).href);
        await expect(page.locator('[id="sidebar-headings"]').first()).toBeVisible();
        expect(new URL(page.url()).hash).toBe('#sidebar-headings');
      });
    }
  }
}

test('local search normalized matches keep original excerpts and safe highlighting', async ({page}) => {
  await page.route('**/offline-search-index*.json', route => route.fulfill({
    json: [{ref:searchPrefix+'/docs/customize/config/',root:'docs',title:'ＰｏｓｔｇｒｅＳＱＬ',
      body:'Details '+ 'x'.repeat(180)+' cafe\u0301 backup <img src=x onerror=alert(1)>',
      sections:[{id:'search',title:'Details',start:0}]}],
  }));
  const {dialog,input}=await openPalette(page, searchPrefix+docsPath);
  await input.fill('postgresql café');
  const row=dialog.getByRole('listbox').getByRole('option').first();
  await expect(row).toContainText('cafe\u0301 backup');
  await expect(row.locator('mark')).toHaveText(['ＰｏｓｔｇｒｅＳＱＬ','cafe\u0301']);
  await expect(row.locator('img')).toHaveCount(0);
  await expect(row).toContainText('<img src=x onerror=alert(1)>');
});

test('local search composition freezes pending results and Enter, then commits mixed text', async ({page}) => {
  const {dialog,input} = await openPalette(page, searchPrefix + zhDocsPath);
  await input.fill('配置');
  await expect(dialog.getByRole('listbox').getByRole('option').first()).toContainText('配置');
  const before = await dialog.locator('[role="listbox"]').textContent();
  await input.evaluate(el => {
    el.dispatchEvent(new CompositionEvent('compositionstart', {bubbles:true}));
    el.value = 'offline_search 中文';
    el.dispatchEvent(new InputEvent('input', {bubbles:true, isComposing:true}));
    el.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter', isComposing:true, bubbles:true}));
  });
  await page.waitForTimeout(180); // exceeds the controller debounce
  expect(await dialog.locator('[role="listbox"]').textContent()).toBe(before);
  await expect(dialog).toBeVisible();
  await input.evaluate(el => el.dispatchEvent(new CompositionEvent('compositionend', {bubbles:true})));
  await expect(dialog.getByRole('listbox').getByRole('option').first()).toContainText('全文检索');
});

test('local search scope follows Blog and Book roots and does not remove page actions', async ({page}) => {
  for (const root of ['blog','book']) {
    const {dialog,input} = await openPalette(page, searchPrefix + '/' + root + '/');
    const current = dialog.locator(`[data-td-search-scope][value="${root}"]`);
    await current.check();
    await input.fill('OINK');
    await expect.poll(async () => page.evaluate(() => window.OinkCommandPalette.instance.rows().filter(r=>r.type==='page').length)).toBeGreaterThan(0);
    const rows = await page.evaluate(() => window.OinkCommandPalette.instance.rows().filter(r=>r.type==='page'));
    expect(rows.every(r=>r.page.doc.root===root)).toBeTruthy();
    await input.fill('');
    await expect(dialog.getByRole('group',{name:'Page actions',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await page.keyboard.press('/');
    await expect(current).toBeChecked();
    await page.keyboard.press('Escape');
  }
});
