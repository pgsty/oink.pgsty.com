---
title: AI-agent support
linkTitle: AI-agent support
description: Give every page a `.md` twin, the site root an `llms.txt`, and the reader a way to hand the current page to ChatGPT or Claude.
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

An HTML page carries a sidebar, scripts and styles, and a model has to strip
that shell before reading it. OINK emits the same content a second time as plain
Markdown: one `.md` per page, one `llms.txt` index at the site root, and a "copy
as Markdown" button on the page. All three are build-time artifacts, with no
runtime service and no content negotiation.

All three have to be declared by the site under `outputs`; the theme does not
turn them on. Two further artifacts, equally opt-in, serve an agent that wants
more than one page at a time: a full-text bundle per section and a navigation
tree per language.

## A `.md` per page {#markdown-output}

`markdown` is one of Hugo's built-in output formats. Add it to the page kinds
that need it:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

That is this site's configuration. Each key under `outputs` is a **wholesale
replacement** rather than a merge: adding `markdown` means writing back every
format that kind already had (`RSS`, `print`), and omitting one loses that
output.

The URL rule is the page URL plus `index.md`:

| Page | Markdown |
| --- | --- |
| `/docs/customize/agents/` | [`/docs/customize/agents/index.md`](/docs/customize/agents/index.md) |
| `/docs/customize/` (section index) | [`/docs/customize/index.md`](/docs/customize/index.md) |
| `/` (site home) | [`/index.md`](/index.md) |

Each HTML page's `<head>` also carries a discovery link, so a crawler need not
guess the URL:

```html
<link rel="alternate" type="text/markdown" href="https://oink.pgsty.com/docs/customize/agents/index.md">
```

## What the `.md` contains {#markdown-shape}
It is not rendered HTML converted back to Markdown but **the source you wrote**:
the front matter becomes an H1 and a blockquoted summary, and the body follows
verbatim, with shortcodes expanded in place into their own Markdown forms.

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

Components in their native Markdown form (callouts, tables, field lists, image
attribute lines, code fences, data fences) keep their source in the `.md`, so
what the model reads is what you wrote. A section index additionally appends a
`Section pages:` list of child links after the body.

Shortcode forms each have a defined degradation: a
[badge](/docs/components/badge/) becomes emphasized text or a link, a
[key](/docs/components/kbd/) becomes `Ctrl + K`,
[tabs](/docs/components/tabs/) become a run of `**Label**` subsections, and
[fields](/docs/components/fields/) become an item list. Each component page's
*Output* section states its own row.

Where the site has not enabled the `LLMS` output, that `LLMS index:` line does
not appear: the theme never points at a file it did not publish.

## `llms.txt` {#llms-txt}

[`llms.txt`](https://llmstxt.org/) is a plain-text manifest at the site root
telling a model what the site holds and where the machine-readable versions
are. Add the `LLMS` output format to the **home page** to generate it:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
```

A multilingual site gets one per language: [`/llms.txt`](/llms.txt) and
[`/zh/llms.txt`](/zh/llms.txt). The content is a generated site index:

```text {title="/llms.txt (excerpt)"}
# OINK

> A local-first, Hugo-only theme for technical documentation

## Site index

- [Home page](https://oink.pgsty.com/index.md)
- [Docs](https://oink.pgsty.com/docs/index.md): OINK is a local-first Hugo documentation framework…
- [Blog](https://oink.pgsty.com/blog/index.md): Docsy articles, OINK engineering stories, and OINK release notes

## Documentation index

- [Introduction](https://oink.pgsty.com/docs/about/index.md): A local-first Hugo documentation framework evolved from Docsy…
  - [Highlights](https://oink.pgsty.com/docs/about/features/index.md): What separates OINK from an ordinary Hugo theme…
  - [Cases](https://oink.pgsty.com/docs/about/showcase/index.md): Find the production case closest to your site…
- [Get started](https://oink.pgsty.com/docs/start/index.md): Start from the official OINK Starter, establish a local baseline, and customize it in layers.
…

## Site locales

- [English](https://oink.pgsty.com/index.md)
- [简体中文](https://oink.pgsty.com/zh/index.md)
```

Where the three sections come from: `Site index` is this language's home page
plus the site's main menu (`menus.main`, linking the Markdown version where an
entry has one, and carrying `description` where present); `Documentation index`
is the `docs` section's subsections and the level of pages beneath them, indented
by level, each row carrying that page's `description`; `Site locales` is every
language in the site configuration. Menu entries pointing off-site (GitHub, an
issue tracker) are dropped: they belong to the navigation shell rather than to
this site's content.

The way to improve `llms.txt` is through the main menu and each section index's
`description`, not through this template.

## Full-text bundle {#full-text-bundle}

One `.md` per page suits an agent that already knows which page it wants; an
agent that wants the whole manual has to crawl it page by page. The `LLMSFULL`
output collapses that into one file per top-level section: `llms-full.txt`,
holding every page of the section in reading order. It is new in OINK 0.8.0 and
stays off until a section asks for it.

The switch is the section index's own front matter rather than the site
configuration:

```yaml {title="content/docs/_index.md"}
---
title: Docs
outputs: [HTML, print, RSS, markdown, LLMSFULL]
---
```

Front matter `outputs` replaces the site-level list for that page, so write back
the formats the section already had: omitting `markdown` or `print` here costs
the section index those outputs. Front matter is per language, so a bilingual
site repeats the line in `_index.zh.md` to get the Chinese bundle.

The result is one file per language at the section root — `/docs/llms-full.txt`
and `/zh/docs/llms-full.txt`. The order is the reading order the sidebar and the
pager present: the explicit `data/docs_nav.json` tree where a `docs` or `book`
section declares one, the weighted content tree otherwise. Pages held out of the
sidebar (`toc_hide`) stay out of the bundle too.

Each page is introduced by a separator carrying its source URL, and the body
that follows is byte-identical to that page's own `.md`:

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

`Source:` points at the page's Markdown output, falling back to its HTML URL
where the page publishes no `.md`.

Only a top-level section can carry a bundle. Listing `LLMSFULL` further down the
tree warns — "LLMSFULL output requires a top-level section" — and emits nothing,
so `hugo server` keeps working while a publishing build with `--panicOnWarning`
stops there.

Where at least one section has a bundle, `llms.txt` grows a `## Full-text
bundles` list of this language's bundles: discovery stays in the file an agent
already fetches.

This site's docs section has it enabled:
<https://oink.pgsty.com/docs/llms-full.txt> is the entire English
documentation in one fetch.

## Navigation JSON {#navigation-json}

The sidebar is the site's table of contents, and an agent that can read it plans
a route before fetching anything. The `NAVJSON` output publishes it as data:
`navigation.json`, one file per language at the language root. Like the bundle
it is new in OINK 0.8.0 and off by default; the site turns it on for the home
page:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
```

That yields `/navigation.json` and `/zh/navigation.json`. The tree is the one
the sidebar and the pager already read — the explicit `data/docs_nav.json` tree
where a `docs` or `book` section declares one, the weighted content tree
everywhere else:

```json {title="/navigation.json (excerpt)"}
{
  "baseURL": "https://oink.pgsty.com/",
  "language": "en",
  "root": {
    "children": [
      {
        "children": [
          {
            "description": "Give every page a .md twin, the site root an llms.txt…",
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
| `id` | The page's path with the language prefix removed, so the same page carries the same `id` in every language |
| `url` | The absolute URL of this language's HTML page |
| `markdown` | The absolute URL of the page's `.md`, present only where the page publishes one |
| `title` | The navigation title (`linkTitle`, falling back to `title`) |
| `description` | The page's `description`, where it has one |
| `kind` | `home`, `section` or `page` for real pages; `external` or `link` for placeholders |
| `children` | The ordered children, where the node has any |

Array order is the contract, and `weight` is never serialized: the ordering has
already been applied, and a consumer re-sorting the array would disagree with
the sidebar the array came from.

Placeholder rows keep the shape the sidebar gives them: a `manual_link` entry
becomes a node of kind `external` carrying the URL as authored, a
`manual_link_relref` entry becomes kind `link` with the reference resolved.
Neither has page identity, so neither carries an `id` or a `markdown` URL.
Sidebar dividers and pages Hugo never renders drop out, while their children
stay in place.

The contract is versioned: `schemaVersion` is `1`, and the JSON Schema ships in
the theme repository as
[`schema/nav.v1.schema.json`](https://github.com/pgsty/oink/blob/main/schema/nav.v1.schema.json)
— validate against it if you consume the file. Where the site publishes it,
`llms.txt` lists `navigation.json` for its own language in the site index.

This site has it enabled: <https://oink.pgsty.com/navigation.json> is a live
instance of the tree.

## Agent actions on the page {#page-actions}

Four entries in the action menu at the right of the breadcrumb row relate to
agents:

| Entry | What it does | When it appears |
| --- | --- | --- |
| Copy as Markdown | Fetches this page's `.md` into the clipboard (prefetched on hover, so a click has no perceptible wait) | This page has a `markdown` output |
| View Markdown source | Opens the `.md` in a new tab | This page has a `markdown` output |
| Open in ChatGPT | Jumps to ChatGPT with a prompt | `assistant_links: true` |
| Open in Claude | The same, to Claude | `assistant_links: true` |

The first two exist as soon as the `markdown` output is on. "Copy" is the left
half of the split button (the clipboard icon), and shows a brief tick on
success.

The last two are off by default and must be enabled explicitly:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: true
```

Where the boundary lies once enabled: on a click, the runtime composes a prompt
using the full URL from the address bar (real domain, query string and anchor
included) — in English, "Please read the contents of <URL> so that I can ask you
about it." — and then jumps to the other site. **The URL is the only thing that
leaves this site; the body is never uploaded**, and the other side fetches the
content itself. Do not put confidential information in a URL, and disclose this
third-party boundary in the site's privacy statement.

A page may narrow the site policy but not reverse it: front matter
`page_context_menu: { assistant_links: false }` turns the assistant links off
for that page, while writing `true` where the site has not enabled them has no
effect. To turn the whole menu off for a page, use `page_context_menu: false` —
see [Page parameters](/docs/write/frontmatter/).

Both assistant actions are also searchable in the command palette, from the same
action manifest — see [Command palette](/docs/customize/panel/).

## Opting a page out of `.md` output {#opt-out}
Rewrite `outputs` in the page's front matter. It is likewise a wholesale
replacement, so write only the formats you keep:

```yaml {title="content/legal/terms.md"}
---
title: Terms of service
outputs: [HTML]
---
```

To keep RSS and drop only Markdown, list the rest:

```yaml {title="content/blog/_index.md"}
---
title: Blog
outputs: [HTML, RSS, print]
---
```

## Customizing the output {#customize-output}

The theme renders Markdown output with `layouts/all.md`, generates `llms.txt`
with `layouts/index.llms.txt`, and owns the two opt-in formats in
`layouts/list.llmsfull.txt` and `layouts/index.navjson.json`. A site replaces
any of them wholesale by placing a file of the same name under its own
`layouts/`, but **consider a narrower approach first**:

- **Per content type**: a typed path such as `layouts/blog/single.md` or `layouts/docs/list.md` affects only that kind of content, which is how the theme's own print templates are specialized (`layouts/blog/single.print.html`). Check the [template lookup order](https://gohugo.io/templates/lookup-order/) for your combination.
- **Per shortcode**: a site's own shortcode can have an [output-format-specific template](https://gohugo.io/templates/shortcode/) giving it a more machine-readable form in Markdown output.
- **Per page**: hand-writing the content of a few high-value pages costs less than changing a template.

The content of `llms.txt` follows the site's structure, so before changing the
template, confirm the problem is not in the main menu or a `description`.
Replacing `index.navjson.json` also takes over the `nav.v1` contract: whatever
you emit still has to satisfy `schema/nav.v1.schema.json` for a consumer that
validates.

## Verify {#verify}

```bash
hugo -d public
ls public/llms.txt public/docs/customize/agents/index.md
ls public/docs/llms-full.txt public/navigation.json   # where you opted in
```

With `curl`, against production or a local preview:

```console
$ curl -s http://localhost:1313/docs/customize/agents/index.md | head -5
# AI-agent support

> Give every page a `.md` twin, the site root an `llms.txt`, and the reader a way to hand the current page to ChatGPT or Claude.

$ curl -sI http://localhost:1313/llms.txt | head -3

$ curl -s http://localhost:1313/docs/llms-full.txt | head -3
================
Source: http://localhost:1313/docs/index.md
================
```

Then check four things:

- Any page's HTML `<head>` has `rel="alternate" type="text/markdown"`;
- Clicking the copy button at the right of the breadcrumb row and pasting yields Markdown rather than HTML;
- `llms.txt` contains no off-site links;
- Where you enabled them: every page in `llms-full.txt` opens with a `Source:` line, and the same page carries the same `id` in each language's `navigation.json`.

## Limits {#limits}

- The machine-readable surface the theme produces is four build-time files: a `.md` per page, `llms.txt`, and — where you opt in — `llms-full.txt` per top-level section and `navigation.json` per language. The sitemap is still Hugo's own `sitemap.xml`.
- A bundle belongs to a top-level section. There is no whole-site `llms-full.txt`: an agent that wants everything reads one bundle per section, listed in `llms.txt`.
- `LLMS`, `LLMSFULL` and `NAVJSON` are all declared as non-alternative formats, so none of them appears in the `<head>` alternate links or gains a page action. They are discovered by their conventional paths and by the entries `llms.txt` carries for them.
- Server-side content negotiation (one URL returning Markdown for `Accept: text/markdown`) is outside the theme's scope and belongs to the hosting layer.
- Markdown output follows the **source** path: content generated only in the browser by JavaScript (a runtime-drawn chart) appears in the `.md` as fence source, not as a diagram.

## Related {#related}

- [Print](/docs/customize/print/) — the other non-HTML output
- [Command palette](/docs/customize/panel/) — the other entry point to the assistant actions
- [Page parameters](/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [Navigation and menus](/docs/customize/navigation/) — `llms.txt`'s site index comes from the main menu
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.ui.page_context_menu.*`
