---
title: AI-agent support
linkTitle: AI-agent support
description: Publish a Markdown copy of every page and an `llms.txt` index, so AI agents and chat assistants can read the site without scraping its HTML.
weight: 140
search_keywords:
  [
    agent,
    AI,
    LLM,
    Markdown output,
    llms.txt,
    copy Markdown,
    llmstxt,
    outputs,
    llms-full.txt,
    LLMSFULL,
    navigation.json,
    NAVJSON,
  ]
aliases:
  - /docs/advanced/agent-support/
---

More and more of your readers arrive through a language model: a coding agent
looking up an option, or a person pasting a page into a chat to ask about it.
An HTML page is a poor source for them, because the sidebar, scripts and
styles have to be stripped away before the content appears, and what survives
is a lossy copy. OINK can publish the same content as plain Markdown instead,
so a model reads exactly what you wrote and spends its context on the content.

Three outputs do this: a `.md` file beside every page, an `llms.txt` index at
the site root that tells an agent what the site contains, and a
**Copy Markdown** button on each page. All three are files written at build
time, so they need no runtime service and no content negotiation. The theme
turns none of them on; you list them under `outputs`. Two more outputs serve an
agent that reads more than one page: a full-text bundle per top-level section
and a navigation tree per language.

## A `.md` per page {#markdown-output}

`markdown` is one of Hugo's built-in output formats. Add it to every page kind
that should have one:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

This is the configuration this site uses. Each key under `outputs`
**replaces** the list for that page kind rather than adding to it, so keep
every format the kind already had, such as `RSS` and `print`; a format you
leave out is no longer published.

The Markdown file sits at the page URL plus `index.md`:

| Page | Markdown |
| --- | --- |
| `/docs/customize/agents/` | [`/docs/customize/agents/index.md`](/docs/customize/agents/index.md) |
| `/docs/customize/` (section index) | [`/docs/customize/index.md`](/docs/customize/index.md) |
| `/` (site home) | [`/index.md`](/index.md) |

Every HTML page also announces its Markdown version in `<head>`, so a crawler
does not have to guess the URL:

```html
<link rel="alternate" type="text/markdown" href="https://oink.pgsty.com/docs/customize/agents/index.md">
```

## What the `.md` contains {#markdown-shape}

The file holds **the source you wrote**, not a conversion of the rendered
HTML. The title becomes an H1 and the `description` a blockquote, then the
body follows as written, with shortcodes expanded in place into their Markdown
forms:

```markdown {title="the start of /docs/customize/print/index.md"}
# Print

> A single page goes to the browser's Cmd/Ctrl+P; a whole section becomes one continuous document through the print output format.

---

LLMS index: [llms.txt](/llms.txt)

---

Printing one page needs no configuration: the shell (sidebar, outline, navbar,
buttons) all carries `d-print-none`, so the browser's `Cmd/Ctrl+P` yields a
clean body.
```

Native Markdown components keep their source: callouts, tables, field lists,
image attribute lines, code fences and data fences reach the model exactly as
you wrote them. A section index adds a `Section pages:` list of links to its
children after the body, and when [backlinks](/docs/customize/navigation/#backlinks)
are on, a page ends with a `Backlinks:` list. Every list and label in the file
is in the page's language.

Each shortcode has a defined Markdown form. A [badge](/docs/components/badge/)
becomes emphasized text or a link, a [key](/docs/components/kbd/) becomes
`Ctrl + K`, [tabs](/docs/components/tabs/) become consecutive `**Label**`
subsections, and [fields](/docs/components/fields/) become an item list. Each
component page gives its own form in its *Output* section.

The `LLMS index:` line appears only when the site publishes `llms.txt`, so the
file never links to something that does not exist.

## `llms.txt` {#llms-txt}

[`llms.txt`](https://llmstxt.org/) is a convention for a small plain-text map
at the site root: an agent fetches one file and learns what the site contains
and where the Markdown versions are. Add the `LLMS` output format to the
**home page** to publish it:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
```

A multilingual site gets one per language, [`/llms.txt`](/llms.txt) and
[`/zh/llms.txt`](/zh/llms.txt), each generated from the site's structure:

```text {title="/llms.txt (excerpt)"}
# OINK

> A local-first Hugo theme for technical documentation

## Site index

- [Home page](https://oink.pgsty.com/index.md)
- [navigation.json](https://oink.pgsty.com/navigation.json)
- [Docs](https://oink.pgsty.com/docs/index.md): Build a technical content site…
- [Blog](https://oink.pgsty.com/blog/index.md): Oink engineering notes, design stories, and reading shell guides

## Documentation index

- [Introduction](https://oink.pgsty.com/docs/about/index.md): A local-first Hugo documentation framework that evolved from Docsy…
  - [Highlights](https://oink.pgsty.com/docs/about/features/index.md): Compare OINK with an ordinary Hugo theme…
  - [Cases](https://oink.pgsty.com/docs/about/showcase/index.md): Find the OINK production case closest to your site…
- [Get started](https://oink.pgsty.com/docs/start/index.md): Start from the official OINK Starter…
…

## Full-text bundles

- [Docs](https://oink.pgsty.com/docs/llms-full.txt)

## Site locales

- [English](https://oink.pgsty.com/index.md)
- [简体中文](https://oink.pgsty.com/zh/index.md)
```

- **Site index** lists this language's home page, its `navigation.json` when
  the site publishes one, and the entries of the main menu (`menus.main`),
  linking each entry's Markdown version when it has one and adding its
  `description`.
- **Documentation index** lists every page of the documentation section, each
  indented under its subsection and followed by its `description`.
- **Full-text bundles** appears when at least one section publishes a bundle.
- **Site locales** lists every configured language.

Menu entries that point off the site, such as GitHub or an issue tracker, are
left out: they are navigation, not content. So to improve `llms.txt`, edit the
main menu and each page's `description`; the template rarely needs to change.

## Full-text bundle {#full-text-bundle}

A `.md` per page suits an agent that knows which page it wants. An agent that
needs the whole manual would otherwise crawl it page by page. The `LLMSFULL`
output gives it one file instead: an `llms-full.txt` per top-level section,
holding every page of that section in reading order.

You turn it on in the section index's own front matter, not in the site
configuration:

```yaml {title="content/docs/_index.md"}
---
title: Docs
outputs: [HTML, print, RSS, markdown, LLMSFULL]
---
```

Front matter `outputs` replaces the site-level list for that page, so repeat
the formats the section already had; leave out `markdown` or `print` and the
section index loses them. Front matter is per language, so a bilingual site
repeats the line in `_index.zh.md` to get the Chinese bundle.

Each language gets one file at the section root, `/docs/llms-full.txt` and
`/zh/docs/llms-full.txt`, in the order of the sidebar and pager: the explicit
`data/docs_nav.json` tree for a `docs` or `book` section that has one, and the
weighted content tree otherwise. Pages hidden from the sidebar with `toc_hide`
are left out of the bundle too.

A separator line with the source URL introduces each page, and the body that
follows is byte for byte that page's own `.md`:

```text {title="/docs/llms-full.txt (excerpt)"}
================
Source: https://oink.pgsty.com/docs/customize/print/index.md
================

# Print

> A single page goes to the browser's Cmd/Ctrl+P; a whole section becomes one continuous document through the print output format.
…

================
Source: https://oink.pgsty.com/docs/customize/agents/index.md
================

# AI-agent support
…
```

`Source:` points at the page's Markdown output, or at its HTML URL when the
page publishes no `.md`.

Only a top-level section can publish a bundle. Listed further down the tree,
`LLMSFULL` produces a warning ("LLMSFULL output requires a top-level section")
and no file. Every published bundle is listed under `## Full-text bundles` in
that language's `llms.txt`, so an agent finds it in the file it already reads.

This site's docs section publishes one:
<https://oink.pgsty.com/docs/llms-full.txt> is the entire English
documentation in one file.

## Navigation JSON {#navigation-json}

The sidebar is the site's table of contents, and an agent that can read it can
plan which pages to fetch before fetching any. The `NAVJSON` output publishes
that tree as `navigation.json`, one file per language at the language root.
Turn it on for the home page:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
```

This produces `/navigation.json` and `/zh/navigation.json`, built from the same
tree as the sidebar and pager: the explicit `data/docs_nav.json` tree for a
`docs` or `book` section that has one, and the weighted content tree
elsewhere:

```json {title="/navigation.json (excerpt)"}
{
  "baseURL": "https://oink.pgsty.com/",
  "language": "en",
  "root": {
    "children": [
      {
        "children": [
          {
            "description": "Publish a Markdown copy of every page and an llms.txt index…",
            "id": "/docs/customize/agents/",
            "kind": "page",
            "markdown": "https://oink.pgsty.com/docs/customize/agents/index.md",
            "title": "AI-agent support",
            "url": "https://oink.pgsty.com/docs/customize/agents/"
          }
        ],
        "id": "/docs/",
        "kind": "section",
        "title": "Docs",
        "url": "https://oink.pgsty.com/docs/"
      }
    ],
    "id": "/",
    "kind": "home",
    "title": "OINK",
    "url": "https://oink.pgsty.com/"
  },
  "schemaVersion": 1
}
```

| Key | What it holds |
| --- | --- |
| `id` | The page path without its language prefix. The same page has the same `id` in every language |
| `url` | The absolute URL of this language's HTML page |
| `markdown` | The absolute URL of the page's `.md`, present only where the page publishes one |
| `title` | The navigation title (`linkTitle`, falling back to `title`) |
| `description` | The page's `description`, where it has one |
| `kind` | `home`, `section`, or `page` for real pages. `external` or `link` for placeholders |
| `children` | The ordered children, where the node has any |

Array order is part of the contract. The theme has already applied the
sidebar order and does not serialize `weight`, so a consumer that sorts the
array again ends up with an order that no longer matches the sidebar.

Placeholder rows keep the sidebar's structure. A `manual_link` entry becomes
an `external` node with the URL as written, and a `manual_link_relref` entry
becomes a `link` node with the resolved reference. Neither is a page, so
neither has an `id` or a `markdown` URL. Sidebar dividers and pages Hugo never
renders are left out, while their children stay in place.

The format is versioned: `schemaVersion` is `1`, and the theme repository
publishes its JSON Schema as
[`schema/nav.v1.schema.json`](https://github.com/pgsty/oink/blob/main/schema/nav.v1.schema.json).
Validate the file against it if you consume it. When a language publishes
`navigation.json`, its `llms.txt` lists the file in the site index.

This site publishes it: <https://oink.pgsty.com/navigation.json> is the live
tree.

## Agent actions on the page {#page-actions}

The page-action menu at the right end of the breadcrumb row has four entries
for agents and chat assistants:

| Entry | What it does | When it appears |
| --- | --- | --- |
| Copy Markdown | Copies this page's `.md` to the clipboard. It prefetches on hover, so the copy feels instant | This page has a `markdown` output |
| View markdown | Opens the `.md` in a new tab | This page has a `markdown` output |
| Open in ChatGPT | Opens ChatGPT with a prompt about this page | `assistant_links: true` |
| Open in Claude | Opens Claude with a prompt about this page | `assistant_links: true` |

The first two come with the `markdown` output. **Copy Markdown** is also the
left half of the split button, shown as a clipboard icon that briefly turns
into a check mark after a successful copy.

The two assistant entries are off until you turn them on:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: true
```

When a reader clicks one, the page builds a prompt from the full URL in the
address bar, including the real domain, query string and anchor. In English
the prompt reads "Read from <URL> so I can ask questions about it.", and the
other site opens with it. **Only the URL leaves your site; the page body is
never uploaded,** and the assistant fetches the content itself. Keep
confidential information out of URLs, and mention this third-party hand-off in
the site's privacy statement.

A page can narrow the site policy but not widen it. In front matter,
`page_context_menu: { assistant_links: false }` removes the assistant links
from that page, while `true` has no effect when the site has not turned them
on. `page_context_menu: false` removes the whole menu from a page. See
[Page parameters](/docs/write/frontmatter/).

Your own entries go in `params.ui.page_context_menu.links`. This site uses one
to add a **Markdown index** entry that opens `llms.txt`, and sets it per
language so that the label is translated:

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      ui:
        page_context_menu:
          links:
            - { name: Markdown index, url: llms.txt, icon: fa-solid fa-list }
```

The command palette offers the same assistant actions, from the same action
list; see [Command palette](/docs/customize/panel/).

## Opting a page out of `.md` output {#opt-out}

Set `outputs` in the page's front matter. It replaces the whole list, so name
only the formats you want to keep:

```yaml {title="content/legal/terms.md"}
---
title: Terms of service
outputs: [HTML]
---
```

To drop only Markdown and keep a section's feed and print view, list the rest:

```yaml {title="content/blog/_index.md"}
---
title: Blog
outputs: [HTML, RSS, print]
---
```

## Customizing the output {#customize-output}

Most problems with these files are content problems: when `llms.txt` reads
badly, fix the main menu and the `description` fields before you touch a
template. When you do need a different shape, the theme renders the `.md`
output with `layouts/all.md`, `llms.txt` with `layouts/index.llms.txt`, and the
two optional outputs with `layouts/list.llmsfull.txt` and
`layouts/index.navjson.json`. A file of the same name under your site's
`layouts/` replaces the theme's, but a narrower override is usually less work
to maintain:

- **Per content type**: a typed path such as `layouts/blog/single.md` or `layouts/docs/list.md` affects only that kind of content, the way the theme's own print templates specialize (`layouts/blog/single.print.html`). Check Hugo's [template lookup order](https://gohugo.io/templates/lookup-order/) for your combination.
- **Per shortcode**: a site shortcode can have an [output-format-specific template](https://gohugo.io/templates/shortcode/) that gives it a more machine-readable form in Markdown.
- **Per page**: for a handful of important pages, writing the content by hand is cheaper than changing a template.

Replacing `index.navjson.json` makes you responsible for the `nav.v1` format:
your output must still validate against `schema/nav.v1.schema.json` for
consumers that check it.

## Verify {#verify}

Run these from your site's root after enabling the Markdown and LLMS outputs.
Set `PAGE_MD` to the generated Markdown file of a real page; the paths assume
a `docs` section, so adjust them and any language prefix to your site:

```bash
hugo --printPathWarnings
PAGE_MD=public/docs/getting-started/index.md
ls "$PAGE_MD" public/llms.txt
# Only if you enabled LLMSFULL on docs and NAVJSON on home:
ls public/docs/llms-full.txt public/navigation.json
```

Against a running preview or the production site, use your own base URL and
page path. `BASE_URL` includes any deployment subpath and, for a translated
site, the language prefix:

```bash
BASE_URL=https://your-site.example/
PAGE_PATH=docs/getting-started/index.md
curl -fsS "${BASE_URL}${PAGE_PATH}" | head -5
curl -fsSI "${BASE_URL}llms.txt" | head -3
# Only if you enabled LLMSFULL on docs:
curl -fsS "${BASE_URL}docs/llms-full.txt" | head -3
```

Then check four things:

- The page's HTML `<head>` has `rel="alternate" type="text/markdown"`;
- Clicking the copy button beside the breadcrumbs and pasting gives Markdown, not HTML;
- `llms.txt` contains no off-site links;
- If you enabled them, every page in `llms-full.txt` starts with a `Source:` line, and a page has the same `id` in every language's `navigation.json`.

## Limits {#limits}

- The theme produces four kinds of machine-readable file: a `.md` per page, `llms.txt`, and, when you enable them, `llms-full.txt` per top-level section and `navigation.json` per language. `sitemap.xml` remains Hugo's own.
- Bundles belong to top-level sections, and there is no whole-site `llms-full.txt`. An agent that wants everything reads the section bundles that `llms.txt` lists.
- `LLMS`, `LLMSFULL` and `NAVJSON` get no `<head>` alternate link and no page action. Agents find them at their conventional paths and through `llms.txt`.
- Serving Markdown from the page URL itself when a client sends `Accept: text/markdown` is content negotiation, which belongs to your web server or host, not the theme.
- The Markdown output is built from the **source**, so anything drawn only in the browser, such as a chart rendered at runtime, appears in the `.md` as its fence source, not as a picture.

## Related {#related}

- [Print](/docs/customize/print/) — the other non-HTML output
- [Command palette](/docs/customize/panel/) — the other entry point to the assistant actions
- [Page parameters](/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [Navigation and menus](/docs/customize/navigation/) — `llms.txt`'s site index comes from the main menu
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.ui.page_context_menu.*`
