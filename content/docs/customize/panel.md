---
title: Command palette
linkTitle: Command palette
description: One dialog carrying page search, page actions and site commands — how to open it, what it groups, and how to add commands of your own.
weight: 70
search_keywords: [command palette, Cmd+K, Ctrl+K, shortcuts, page actions, custom commands, quick links, page context menu, action registry]
---

The command palette is the site's one modal entry point: searching pages,
copying this page's Markdown, switching language, switching version and jumping
to a site's own links all happen in one dialog. It is assembled together with
local search: with `params.offline_search` off, the palette, the index and Lunr
all stay out of the page — see [Search](/docs/customize/search/).

## Opening the palette {#open}

| How to open it | What opens |
| --- | --- |
| Click the search box in the navbar or sidebar | Full search mode |
| <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Full search mode; press again to close |
| <kbd>/</kbd> | Full search mode |
| The backslash key | Command-only mode (equivalent to a prefilled `>`) |
| <kbd>f</kbd> / <kbd>c</kbd> | The same two, provided by [keyboard navigation](/docs/customize/keyboard/) |
| Typing a query beginning with `>` in the box | Command-only mode |

<kbd>/</kbd>, backslash, <kbd>f</kbd> and <kbd>c</kbd> are all bare single keys
and stand down for typing: while focus is in an input, textarea, select or
`contenteditable`, and while an input method is composing, they type an ordinary
character. The modified <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> has no such
restriction and opens the palette even from inside a text box.

Inside the palette: <kbd>↑</kbd> <kbd>↓</kbd> select, <kbd>Enter</kbd> runs, and
<kbd>Esc</kbd> closes and returns focus to whatever opened it.

## What the palette holds {#contents}
With nothing typed, the palette lists four groups in a fixed order:

| Group | Contents | Decided by |
| --- | --- | --- |
| Quick links | A few entry points chosen from the navbar's top-level menu | `params.ui.quick_links` |
| Page actions | Copy Markdown, view Markdown source, edit this page, view history, create a child page, open an issue, print the section | Repository configuration and whether this page has a Markdown output |
| Preferences | Switch version → switch language → switch theme | Whether the site configures versions, languages and the light/dark menu |
| Commands | Open the GitHub repository, then the site's own commands | `params.github_project_repo` (falling back to `github_repo`) and `ui.command_palette.commands` |

The three preferences follow the same order as the navbar controls (version,
language, theme); palette and navbar share one ordering. Choosing something like
"switch language" does not jump immediately — the palette expands the options in
place for a second choice.

As soon as text is typed, page results come first, grouped by content root (the
group name is the first breadcrumb segment, and the groups follow the navbar's
top-level menu order), with commands and actions merged into one group at the
end.

A query starting with `>` lists commands and actions only and searches no pages.
Use it when you are unsure which menu holds a feature.

An unavailable item is still listed when the reason can be stated. With no
repository configured, "edit this page" stays in the list with an "unavailable"
note rather than disappearing.

## Quick links {#quick-links}

Quick links are selected from Hugo's main menu by identifier rather than written
out a second time:

```yaml {title="hugo.yml"}
params:
  ui:
    quick_links: [docs, blog]
```

The values are the `identifier` of entries in `menus.main`. Left unset, it
defaults to the documentation and blog sections (`params.ui.docs_section` and
`blog_section`). Configuring the menu itself is in
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

That is the one this site uses. There are seven fields. An unsupported key or
invalid record warns and drops that command during ordinary preview; strict
publishing rejects the warning:

- `id` is required, starts with a lowercase letter, and holds only lowercase letters, digits, underscores and hyphens; it must not collide with a built-in action ID.
- `title` is what the palette shows; `description` is the smaller line beneath it; `icon` is one Font Awesome class pair.
- `keywords` is an array that takes part in matching without being displayed, for the search terms a reader might type.
- `url` and `action` are **mutually exclusive and one is required**. `url` accepts a full `http`/`https` address, a site path, or an in-page anchor beginning with `#`; an address with a host opens in a new tab. `action` references a built-in action ID.

> [!WARNING] Do not alias a built-in action with `action:`
> Built-in actions are already in the palette, and wrapping one makes the same
> feature appear twice under two names.

A multilingual site writes the commands under
`languages.<lang>.params.ui.command_palette.commands` so titles and keywords can
be localized. The order comes from the default language's list: an entry with
the same `id` in another language overrides fields only, and a new `id` is
appended at the end. Command order is therefore identical across languages, and
nothing moves when a reader switches.

Configuration can only supply a link or reference a built-in action; it cannot
inject a JavaScript callback. What the palette reads is a plain data manifest.

## Page actions {#page-actions}

The palette's "page actions" and the split button beside a documentation title
are one implementation: the same action descriptors, the same URL generation, the
same executor. The button's left half copies this page's Markdown, and the arrow
on the right expands every action.

To turn the whole group off, or off on certain pages:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      # "Open in ChatGPT / Claude" appears only once this is on
      assistant_links: false
      links: []
```

`enable: false` removes only the button beside the title; the corresponding
items stay in the palette, which is itself the command entry point. A single
page overrides it with the front matter `page_context_menu: false`.

`assistant_links` is off by default because clicking one **sends the current
page's full URL — including query string and anchor — to a third party**, while
the body is never uploaded. That is a site-level choice, and a page's
`assistant_links` in front matter can only narrow it, never enable it on the
site's behalf.

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
depends on the repository configuration — see
[Repository links and page info](/docs/customize/repository/). "Copy Markdown"
and "view Markdown source" need the page to have the `markdown` output — see
[AI-agent support](/docs/customize/agents/).

## How it relates to full-text search {#search}

One dialog, two independent data sources:

- **Page results** come from the local search index. When the index was never generated or fails to download, the palette still opens and still runs commands, and the page section reads "the page index is unavailable; actions still work".
- **Commands and actions** come from a JSON manifest embedded in the page and need no network.

The palette is not assembled in print state, so print output has none of it.
With `offline_search` off there is likewise no palette, and <kbd>f</kbd> and
<kbd>c</kbd> stay silent without disturbing normal typing.

## Verify {#verify}

1. After a build, confirm the command manifest reached the page:

   ```bash
   grep -o 'id="oink-action-manifest"' public/docs/customize/panel/index.html
   ```

   Its absence means local search is off, or this page is not in a shell layout.

2. Open the site and press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> without typing: quick links, page actions, preferences and commands should appear in that order.

3. Type `>`: only commands and actions remain. A newly added command should sit after "open the GitHub repository".

4. Repeat step 3 in another language, and confirm the command titles changed while the order did not.

5. A print preview (<kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>P</kbd>) should show no trace of the palette.

## Related {#related}

- [Search](/docs/customize/search/) — where the palette's page results come from
- [Keyboard navigation](/docs/customize/keyboard/) — <kbd>f</kbd>, <kbd>c</kbd> and the other single keys
- [Navigation and menus](/docs/customize/navigation/) — the source of quick links and group order
- [Repository links and page info](/docs/customize/repository/) — prerequisites for the edit, history and issue actions
- [Configuration](/docs/customize/config/) — full definitions of `ui.command_palette` and `ui.page_context_menu`
