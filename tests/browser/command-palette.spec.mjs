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
  await expect(preferences).toContainText("v0.8.1");
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
  await fillCommandAndWait(input, dialog, "> version", "v0.8.1");
  await page.keyboard.press("Enter");
  await expect(dialog).toContainText("v0.8.1");
});

test("Copy Markdown executes once through the shared registry", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const { dialog, input } = await openPalette(page);
  await fillCommandAndWait(input, dialog, "> copy markdown", "Copy Markdown");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("# Configuration");

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
