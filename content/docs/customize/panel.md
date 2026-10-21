---
title: Command palette
linkTitle: Command palette
description: Use one dialog for page search, page actions, and site commands. Open the palette, use its groups, and add custom commands.
weight: 70
search_keywords: [command palette, Cmd+K, Ctrl+K, shortcuts, page actions, custom commands, quick links, page context menu, action registry]
---

The command palette provides one modal dialog for page search and site actions.
Use it to copy page Markdown, switch language or version, and open site links.
The theme assembles it with local search. If `params.offline_search` is off,
the page has no palette, index, or Lunr runtime. See [Search](/docs/customize/search/).

## Opening the palette {#open}

| How to open it | What opens |
| --- | --- |
| Click the search box in the navbar or sidebar | Full search mode |
| <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Full search mode. Press again to close |
| <kbd>/</kbd> | Full search mode |
| The backslash key | Command-only mode (equivalent to a prefilled `>`) |
| <kbd>f</kbd> / <kbd>c</kbd> | The same two, provided by [keyboard navigation](/docs/customize/keyboard/) |
| Typing a query beginning with `>` in the box | Command-only mode |

<kbd>/</kbd>, backslash, <kbd>f</kbd>, and <kbd>c</kbd> are bare single keys.
They do not open the palette during typing. This applies to focus in an input,
textarea, select, or `contenteditable`, and to input-method composition. The
keys type ordinary characters instead. The modified
<kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> can open the palette from a text box. It also remains inactive
during input-method composition. Another open native dialog or visible ARIA
dialog blocks every opening shortcut, including fixed-position dialogs.
Hidden ARIA dialogs do not block them.

Inside the palette, use <kbd>↑</kbd> <kbd>↓</kbd> to select an item. Press
<kbd>Enter</kbd> to run it. Press <kbd>Esc</kbd> to close the palette and return
focus to the opening control.

## What the palette holds {#contents}
With nothing typed, the palette lists four groups in a fixed order:

| Group | Contents | Decided by |
| --- | --- | --- |
| Quick links | A few entry points chosen from the navbar's top-level menu | `params.ui.quick_links` |
| Page actions | Copy Markdown, view Markdown source, edit this page, view history, create a child page, open an issue, print the section | Repository configuration and whether this page has a Markdown output |
| Preferences | Switch version → switch language → switch theme | Whether the site configures versions, languages and the light/dark menu |
| Commands | Open the GitHub repository, then the site's own commands | `params.github_project_repo` (falling back to `github_repo`) and `ui.command_palette.commands` |

The three preferences follow the navbar order: version, language, theme.
Selecting a preference such as "switch language" does not navigate immediately.
The palette expands its options in place. Select an option in a second action.

When you type text, page results appear first, grouped by content root. Each
group uses the first breadcrumb segment as its name. Groups follow the
navbar's top-level menu order. Commands and actions appear together in the
final group.

A query starting with `>` lists commands and actions only and searches no pages.
Use it when you are unsure which menu holds a feature.

If the theme can explain why an item is unavailable, the item remains listed.
Without repository configuration, "edit this page" remains with an "unavailable"
note.

## Quick links {#quick-links}

Select quick links from Hugo's main menu by identifier. You do not need to
define them again:

```yaml {title="hugo.yml"}
params:
  ui:
    quick_links: [docs, blog]
```

Values use the `identifier` of entries in `menus.main`. If unset, the list
defaults to the documentation and blog sections (`params.ui.docs_section` and
`blog_section`). To configure the menu, see
[Navigation and menus](/docs/customize/navigation/).

## Custom commands {#custom-commands}

A site's own commands go under `params.ui.command_palette.commands`, after the
built-in ones, in the order written:

```yaml {title="hugo.yml"}
params:
  ui:
    command_palette:
      commands:
        - id: theme_issues
          title: OINK issues
          description: Report or browse theme and documentation issues
          url: https://github.com/pgsty/oink/issues
          icon: fa-brands fa-github
          keywords: [bug, support, roadmap]
```

This site uses the command above. Commands have seven fields. In normal
preview, an unsupported key or invalid record warns and discards that command.
Review the warning and rendered fallback before publication:

- `id` is required. It must start with a lowercase letter and contain only lowercase letters, digits, underscores, and hyphens. It must not duplicate a built-in action ID.
- `title` supplies the displayed title. The `description` supplies the smaller line below it. The `icon` is one Font Awesome class pair.
- `keywords` is an array of possible reader search terms. It participates in matching but is not displayed.
- `url` and `action` are **mutually exclusive and one is required**. The `url` accepts a full `http`/`https` address, site path, or in-page anchor beginning with `#`. An address with a host opens in a new tab. The `action` references a built-in action ID.

> [!WARNING] Do not alias a built-in action with `action:`
> Built-in actions are already in the palette, and wrapping one makes the same
> feature appear twice under two names.

For a multilingual site, put commands under
`languages.<lang>.params.ui.command_palette.commands`. This lets you localize
titles and keywords. The default language's list sets the order. An entry
with the same `id` in another language overrides only fields. A new `id` is
appended. Command order therefore remains the same across languages.

Configuration can supply only a link or built-in action reference. It cannot
inject a JavaScript callback. The palette reads a plain data manifest.

## Page actions {#page-actions}

The palette's "page actions" and the documentation title's split button share
one implementation. They use the same action descriptors, URL generation, and
executor. The button's left half copies the page's Markdown. Its right arrow
expands all actions.

To hide the button beside the title, set `page_context_menu: false`. The
corresponding actions stay in the palette:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu: false
```

To hide the button on just one page, use `page_context_menu: false` in that
page's front matter instead.

The `assistant_links` setting is off by default. Clicking an assistant link
**sends the current page's full URL, including query string and anchor, to a
third party**. It never uploads the body. Enable links site-wide through
`params.ui.page_context_menu.assistant_links`. A page can only restrict that
policy with this front matter:

```yaml {title="Page front matter"}
page_context_menu:
  assistant_links: false
```

Check the title menu and palette. Neither should offer assistant links on
that page. See [AI-agent support](/docs/customize/agents/) for handoff behavior.

`links` adds external actions that appear only in the menu beside the title, not
in the palette:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      links:
        - name: Ask in Discussions
          url: https://github.com/pgsty/oink/discussions/new?title={title}
          icon: fa-solid fa-comments
```

The three placeholders `{url}`, `{title}` and `{markdown_url}` are replaced with
the current page's values.

Whether "edit this page", "view history" and "open an issue" are available
depends on repository configuration. See
[Repository links and page info](/docs/customize/repository/). "Copy Markdown"
and "view Markdown source" require the page's `markdown` output. See
[AI-agent support](/docs/customize/agents/).

## How it relates to full-text search {#search}

The dialog uses two independent data sources:

- **Page results** come from the local search index. If the index was not generated or fails to download, the palette still opens and runs commands. The page section reads "the page index is unavailable; actions still work".
- **Commands and actions** come from a JSON manifest embedded in the page and need no network.

The theme does not assemble the palette for print output. If `offline_search`
is off, there is also no palette. The keys <kbd>f</kbd> and <kbd>c</kbd> then
do nothing and do not affect normal typing.

## Query-aware site actions {#search-tail}

The runtime hook for trusted site JavaScript is available since OINK 1.1.
Feature-detect it: v1.0.0 and pages without local search do not provide it.
Load the integration after the theme scripts, for example through
`layouts/_partials/hooks/body-end.html`. This example assumes the site
implements `openSiteAssistant` and owns its provider settings:

```javascript
if (window.OinkCommandPalette?.registerSearchTail) {
  const unregister = window.OinkCommandPalette.registerSearchTail({
    id: 'ask-site',
    rows(context) {
      return [{ id: 'ask', title: 'Ask the site', description: context.query }];
    },
    activate(row, context) {
      context.handoff();
      return openSiteAssistant(context.query, {
        locale: context.locale,
        signal: context.signal,
      });
    },
  });
  // Call unregister() when removing this integration.
}
```

Rows follow native results and actions, including empty/error searches. They
are absent in empty, command, choice, and loading states. Keep `rows()` pure
and synchronous. All strings render as text. Activation receives the query
that created the row, not newer input. Before opening another coordinated
surface, use `handoff()`. The site then owns its focus and failure UI.
For non-UI actions, return the operation without calling handoff.

The [Shell contract](/docs/design/shell/#search-tail-extensions) defines fields,
cancellation, validation, and lifecycle. YAML cannot contain callbacks. OINK
adds no remote service or telemetry by default.

## Verify {#verify}

Run from your site's root after a production build. In the commands below, replace
`public/docs/getting-started/index.html` with an actual generated documentation
page in your site (including a language prefix if needed).

1. After a build, confirm the command manifest reached the page:

   ```bash
   hugo --printPathWarnings
   PAGE=public/docs/getting-started/index.html
   test -f "$PAGE" && grep -o 'td-action-manifest' "$PAGE"
   ```

   This confirms that HTML contains the action data. The remaining steps check
   the palette interface with local search enabled.

2. Open the site. Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> without typing. Confirm this order: quick links, page actions, preferences, commands.

3. Type `>`. Confirm that only commands and actions remain. A new command should appear after "open the GitHub repository".

4. Repeat step 3 in another language. Confirm that command titles change and order remains the same.

5. Open print preview (<kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>P</kbd>). Confirm that it contains no palette.

## Related {#related}

- [Search](/docs/customize/search/) — where the palette's page results come from
- [Keyboard navigation](/docs/customize/keyboard/) — <kbd>f</kbd>, <kbd>c</kbd> and the other single keys
- [Navigation and menus](/docs/customize/navigation/) — the source of quick links and group order
- [Repository links and page info](/docs/customize/repository/) — prerequisites for the edit, history and issue actions
- [Configuration](/docs/customize/config/) — full definitions of `ui.command_palette` and `ui.page_context_menu`
