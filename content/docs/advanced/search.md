---
title: Search and Command Palette
linkTitle: Search and Command Palette
weight: 10
description:
  The local index, ranking, the Palette's three modes, and optional hosted
  search.
---

OINK defaults to and recommends **local search**: Hugo generates a separate
index per language, and Lunr plus the CJK fallback are served from same-origin
assets. A site builds and searches without a public crawler, an external
account, a CDN, or a network connection.

Google Custom Search and Algolia DocSearch remain as compatible integrations and
are off by default. **Only one search implementation can be active at a time.**

## Enable local search {#enable-local-search}

```yaml {filename="hugo.yaml"}
params:
  offlineSearch: true
  offlineSearchIndex: summary # summary | content
  offlineSearchSummaryLength: 120
  offlineSearchMaxResults: 12
```

{{< fields >}}
{{% field name="offlineSearch" type="boolean" default="false" required=true %}}
Enables the local index and the Command Palette. Do not also configure
`gcs_engine_id` or `params.search.algolia`. {{% /field %}}
{{% field name="offlineSearchIndex" type="string" default="content" %}}
`summary` indexes titles, descriptions, and excerpts; `content` indexes full
body text. **A thousand-page site should use `summary`** — `content` produces a
multi-megabyte index that every reader downloads before their first search.
{{% /field %}}
{{% field name="offlineSearchSummaryLength" type="integer" default="70" %}} The
length of a result summary. {{% /field %}}
{{% field name="offlineSearchMaxResults" type="integer" default="10" %}} How
many results to show. Keep it low enough that the dialog stays usable on mobile.
{{% /field %}} {{< /fields >}}

The build produces one index per language:

```text {copy=false}
public/offline-search-index.en.json
public/offline-search-index.zh.json
```

> [!IMPORTANT] Under a subpath deployment, confirm the browser requests the
> index from the configured `baseURL` rather than the domain root. This is the
> most common cause of "search returns nothing" — and the pages themselves look
> fine.

## Command Palette {#command-palette}

Local search is reached through the Command Palette, which has **three modes**:

| Mode         | Trigger                    | Contents                               |
| ------------ | -------------------------- | -------------------------------------- |
| Empty query  | `Cmd/Ctrl-K` with no input | Quick links, page actions, preferences |
| Text query   | Start typing               | Page results grouped by section        |
| Command mode | `/`, or a `>` prefix       | Commands only, no page results         |

`/` is a bare single-character shortcut, so it applies **only outside editable
controls** — typing a slash inside an input, textarea, select, or
contenteditable region still types a slash. Modifier combinations such as
`Ctrl-/` do not trigger it either.

Pressing `/` while the Palette is already open does not clear the current query.

### What the Palette contains {#palette-contents}

- **Quick links**: the top-level menu entries named by `params.ui.quick_links`
- **Page actions**: Copy Markdown, Open in ChatGPT/Claude, View markdown, View
  edit history, Edit this page, Create child page, Create docs issue, Create
  project issue, Print entire section
- **Preferences**: switch color theme, language, or version, and open the
  project repository

Page actions and Palette commands run through **one shared registry**, so an
action behaves identically whether it is invoked from the
[breadcrumb split button](/docs/configure/navigation/#page-actions) or the
Palette.

> [!NOTE] The page-level `print` action is retired. Printing one page is what
> the browser's `Cmd/Ctrl+P` already does; `print_section` remains, because
> rendering a whole section as one printable document is not something the
> browser can do on its own.

### Custom commands {#custom-commands}

A site can add its own commands:

```yaml {filename="hugo.yaml"}
languages:
  en:
    params:
      ui:
        command_palette:
          commands:
            - id: status
              title: Service status
              description: Current service health
              url: https://status.example.com/
              icon: fa-solid fa-signal
              keywords: [uptime, incident]
```

Only a **URL** or a **built-in action ID** is accepted; arbitrary JavaScript
callbacks are not.

> [!WARNING] Do not use `action:` to alias a built-in action. Built-ins are
> already in the Palette, and wrapping one only makes the same capability appear
> twice under two different names. This site made that mistake.

On a multilingual site, define commands under `languages.<lang>.params` so
titles and keywords are localized.

## Search ranking {#search-ranking}

Pages influence ranking through front matter:

```yaml
---
title: PostgreSQL configuration
search_keywords: [postgres, postgresql, pg]
search_boost: 1.5
search_exclude: false
---
```

{{< fields >}} {{% field name="search_keywords" type="string or array" %}} Extra
matching terms, used on both the Latin and CJK paths — a reader searching `pg`
reaches a page whose title only says "PostgreSQL". {{% /field %}}
{{% field name="search_boost" type="number" default="1.0" %}} A positive
multiplier. Invalid values — zero, negative, non-numeric — warn and fall back to
`1.0`. {{% /field %}}
{{% field name="search_exclude" type="boolean" default="false" %}} Excludes the
page from the index. The older `exclude_search` and `excludeSearch` remain
accepted. {{% /field %}} {{< /fields >}}

`search_boost` can be set for a whole section through cascade, with page-level
values winning:

```yaml
---
title: Documentation
cascade:
  search_boost: 1.25
---
```

Exclusion uses **any-true-wins** precedence: if the canonical field or any
compatibility alias is true, the page is excluded. `search_exclude: false`
cannot override a true legacy alias.

> [!NOTE] A local index is downloadable by every visitor and **is not an
> access-control mechanism**. Keep content that should not be public out of the
> index, and do not rely on search exclusion to protect it.

## Chinese and CJK {#cjk}

Lunr cannot tokenize Chinese reliably, so the Palette switches to **substring
matching** when it detects CJK characters. Both paths apply the same
`search_boost`, so ranking stays consistent.

When a Chinese search returns nothing, first confirm the Chinese content
actually reached the Chinese index before changing tokenization.

## Optional hosted search {#hosted-search}

### Google Custom Search {#google-search}

```yaml {filename="hugo.yaml"}
params:
  gcs_engine_id: YOUR_ENGINE_ID
```

### Algolia DocSearch {#algolia-docsearch}

```yaml {filename="hugo.yaml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

All three values **must be provided explicitly**; a missing one fails the build,
because OINK will not fall back to another project's public index.

Enabling hosted search means accepting its external requests, indexing model,
availability, and privacy boundary. That is an explicit product decision and
belongs in the site's privacy statement.

## Next steps {#next-steps}

- [Languages](/docs/configure/language/): per-language index details
- [AI and agent support](../agent-support/): Markdown output and `llms.txt`
