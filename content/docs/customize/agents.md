---
title: AI-agent support
linkTitle: AI-agent support
description: Publish a `.md` version of each page and an `llms.txt` site index. Let readers open the current page in ChatGPT or Claude.
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

An HTML page includes a sidebar, scripts, and styles. A model must remove that
shell before it reads the content. OINK can emit the same content as plain
Markdown. It provides one `.md` per page, one `llms.txt` index at the site root,
and a "copy as Markdown" button on the page. All three use build-time artifacts.
They require no runtime service or content negotiation.

The site must declare all three under `outputs`. The theme does not enable
them. Two other optional artifacts help an agent read more than one page:
a full-text bundle per section and a navigation tree per language.

## A `.md` per page {#markdown-output}

`markdown` is one of Hugo's built-in output formats. Add it to the page kinds
that need it:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

This site uses the configuration above. Each key under `outputs` is a
**wholesale replacement**, not a merge. When you add `markdown`, include every
format that the page kind already used (`RSS`, `print`). If you omit a format,
you lose that output.

The URL rule is the page URL plus `index.md`:

| Page | Markdown |
| --- | --- |
| `/docs/customize/agents/` | [`/docs/customize/agents/index.md`](/docs/customize/agents/index.md) |
| `/docs/customize/` (section index) | [`/docs/customize/index.md`](/docs/customize/index.md) |
| `/` (site home) | [`/index.md`](/index.md) |

Each HTML page's `<head>` includes a discovery link. A crawler therefore does
not need to guess the URL:

```html
<link rel="alternate" type="text/markdown" href="https://oink.pgsty.com/docs/customize/agents/index.md">
```

## What the `.md` contains {#markdown-shape}
This output contains **the source you wrote**. It is not a conversion of rendered
HTML. Front matter becomes an H1 and a blockquoted summary. The body follows
verbatim. The theme expands shortcodes in place into their Markdown forms.

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

Native Markdown components retain their source in the `.md`. These include
callouts, tables, field lists, image attribute lines, code fences, and data
fences. The model reads the source you wrote. A section index also appends a
`Section pages:` list of child links after the body.

Each shortcode has a defined Markdown fallback. A
[badge](/docs/components/badge/) becomes emphasized text or a link. A
[key](/docs/components/kbd/) becomes `Ctrl + K`.
[Tabs](/docs/components/tabs/) become consecutive `**Label**` subsections.
[Fields](/docs/components/fields/) become an item list. Each component page
describes its fallback in the *Output* section.

If the site has not enabled `LLMS` output, the `LLMS index:` line does not
appear. The theme never links to a file that it did not publish.

## `llms.txt` {#llms-txt}

[`llms.txt`](https://llmstxt.org/) is a plain-text manifest at the site root.
It identifies site content and its machine-readable versions. To generate it,
add the `LLMS` output format to the **home page**:

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

The `Site index` contains this language's home page and the site's main menu
(`menus.main`). It links to an entry's Markdown version when available. It
includes `description` when present. The `Documentation index` contains the
`docs` subsections and the level of pages beneath them. It indents entries by
level and includes each page's `description`. The `Site locales` section lists
every configured language. The index omits off-site menu entries, such as
GitHub or an issue tracker. These entries belong to navigation, not site content.

To improve `llms.txt`, change the main menu and each section index's
`description`. You do not need to change the template.

## Full-text bundle {#full-text-bundle}

One `.md` per page suits an agent that knows which page it needs. To read the
whole manual, an agent would otherwise crawl each page. The `LLMSFULL` output
provides one `llms-full.txt` per top-level section. It contains every included
page in reading order. OINK 0.8.0 introduced this output. It remains off until
a section enables it.

The switch is the section index's own front matter rather than the site
configuration:

```yaml {title="content/docs/_index.md"}
---
title: Docs
outputs: [HTML, print, RSS, markdown, LLMSFULL]
---
```

Front matter `outputs` replaces the page's site-level list. Include the formats
that the section already used. If you omit `markdown` or `print`, the section
index loses those outputs. Front matter applies per language. For a bilingual
site, repeat the line in `_index.zh.md` to generate the Chinese bundle.

The output contains one file per language at the section root:
`/docs/llms-full.txt` and `/zh/docs/llms-full.txt`. It uses the sidebar and pager
reading order. For a `docs` or `book` section with an explicit
`data/docs_nav.json` tree, it uses that tree. Otherwise, it uses the weighted
content tree. Pages excluded from the sidebar with `toc_hide` are also excluded
from the bundle.

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

Only a top-level section can publish a bundle. If you list `LLMSFULL` further
down the tree, the theme warns: "LLMSFULL output requires a top-level section".
It emits nothing. The `hugo server` preview continues to work. Review the diagnostic and confirm the unsupported output is absent.

If at least one section has a bundle, `llms.txt` includes a `## Full-text
bundles` list for that language. An agent can discover bundles in the file it
already fetches.

This site's docs section enables the bundle.
<https://oink.pgsty.com/docs/llms-full.txt> contains the entire English
documentation in one file.

## Navigation JSON {#navigation-json}

The sidebar is the site's table of contents. An agent can read it to plan
which pages to fetch. The `NAVJSON` output publishes the tree as
`navigation.json`, with one file per language at the language root. OINK 0.8.0
introduced this output. It is off by default. Enable it for the home page:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
```

This produces `/navigation.json` and `/zh/navigation.json`. It uses the same
tree as the sidebar and pager. For a `docs` or `book` section with an explicit
`data/docs_nav.json` tree, it uses that tree. Elsewhere, it uses the weighted
content tree:

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
| `id` | The page path without its language prefix. The same page has the same `id` in every language |
| `url` | The absolute URL of this language's HTML page |
| `markdown` | The absolute URL of the page's `.md`, present only where the page publishes one |
| `title` | The navigation title (`linkTitle`, falling back to `title`) |
| `description` | The page's `description`, where it has one |
| `kind` | `home`, `section`, or `page` for real pages. `external` or `link` for placeholders |
| `children` | The ordered children, where the node has any |

Array order is part of the contract. The theme never serializes `weight`
because it has already applied the order. If a consumer sorts the array again,
its order can differ from the source sidebar.

Placeholder rows retain the sidebar's structure. A `manual_link` entry becomes
an `external` node with the authored URL. A `manual_link_relref` entry becomes
a `link` node with the resolved reference. Neither has page identity, an `id`,
or a `markdown` URL. The tree omits sidebar dividers and pages that Hugo never
renders. Their children remain in place.

The contract has a version. The value of `schemaVersion` is `1`. The theme
repository ships its JSON Schema as
[`schema/nav.v1.schema.json`](https://github.com/pgsty/oink/blob/main/schema/nav.v1.schema.json).
If you consume the file, validate it against this schema. If the site publishes
it, `llms.txt` lists `navigation.json` for its language in the site index.

This site has it enabled: <https://oink.pgsty.com/navigation.json> is a live
instance of the tree.

## Agent actions on the page {#page-actions}

Four entries in the action menu at the right of the breadcrumb row relate to
agents:

| Entry | What it does | When it appears |
| --- | --- | --- |
| Copy as Markdown | Copies this page's `.md` to the clipboard. Prefetches on hover to avoid a perceptible wait after a click | This page has a `markdown` output |
| View Markdown source | Opens the `.md` in a new tab | This page has a `markdown` output |
| Open in ChatGPT | Opens ChatGPT with a prompt | `assistant_links: true` |
| Open in Claude | Opens Claude with a prompt | `assistant_links: true` |

The first two actions appear when `markdown` output is enabled. "Copy" is the
left half of the split button, with the clipboard icon. After a successful
copy, it briefly shows a check mark.

The last two are off by default and must be enabled explicitly:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: true
```

When the reader clicks an enabled assistant action, the runtime creates a
prompt from the address bar's full URL. It includes the real domain, query
string, and anchor. In English, the prompt is "Please read the contents of <URL> so that I can ask you
about it." The action then opens the other site. **Only the URL leaves this
site. The body is never uploaded.** The other site fetches the content itself.
Do not put confidential information in a URL. Document this third-party
boundary in the site's privacy statement.

A page may restrict the site policy but cannot reverse it. The front matter
`page_context_menu: { assistant_links: false }` disables assistant links for
that page. If the site has not enabled them, setting `true` has no effect.
To disable the entire menu for a page, use `page_context_menu: false`.
See [Page parameters](/docs/write/frontmatter/).

Both assistant actions are also searchable in the command palette, from the same
action manifest — see [Command palette](/docs/customize/panel/).

## Opting a page out of `.md` output {#opt-out}
Replace `outputs` in the page's front matter. This replaces the complete list.
Include only the formats that you want to keep:

```yaml {title="content/legal/terms.md"}
---
title: Terms of service
outputs: [HTML]
---
```

To keep RSS and remove only Markdown, list the remaining formats:

```yaml {title="content/blog/_index.md"}
---
title: Blog
outputs: [HTML, RSS, print]
---
```

## Customizing the output {#customize-output}

The theme renders Markdown output with `layouts/all.md` and generates
`llms.txt` with `layouts/index.llms.txt`. The two optional formats use
`layouts/list.llmsfull.txt` and `layouts/index.navjson.json`. To replace a
complete template, put a file with the same name under the site's `layouts/`.
**First consider an override with a smaller scope**:

- **Per content type**: a typed path such as `layouts/blog/single.md` or `layouts/docs/list.md` affects only that content kind. The theme specializes its print templates this way (`layouts/blog/single.print.html`). Check the [template lookup order](https://gohugo.io/templates/lookup-order/) for your combination.
- **Per shortcode**: a site shortcode can use an [output-format-specific template](https://gohugo.io/templates/shortcode/). This can provide a more machine-readable form in Markdown output.
- **Per page**: for a few high-value pages, writing the output by hand requires less work than changing a template.

The content of `llms.txt` follows the site's structure. Before changing the
template, check the main menu and each `description` for the problem. If you
replace `index.navjson.json`, you also take responsibility for the `nav.v1`
contract. Your output must still satisfy `schema/nav.v1.schema.json` for
consumers that validate it.

## Verify {#verify}

Run from your site's root, with Markdown and LLMS outputs enabled. Replace
`PAGE_MD` with an actual page's generated Markdown file. The section paths below
assume a `docs` section; adjust them and any language prefix to your site.

```bash
hugo --printPathWarnings
PAGE_MD=public/docs/getting-started/index.md
ls "$PAGE_MD" public/llms.txt
# Only if you enabled LLMSFULL on docs and NAVJSON on home:
ls public/docs/llms-full.txt public/navigation.json
```

Against a running local preview or production, use your own base URL and page
path. `BASE_URL` includes the deployment subpath and, when testing a translated
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

- Confirm that the selected page's HTML `<head>` has `rel="alternate" type="text/markdown"`;
- Click the copy button beside the title and paste the result. Confirm that it is Markdown instead of HTML;
- `llms.txt` contains no off-site links;
- If you enabled these outputs, confirm that each page in `llms-full.txt` starts with a `Source:` line. The same page must have the same `id` in each language's `navigation.json`.

## Limits {#limits}

- The theme produces four types of machine-readable build-time files: a `.md` per page, `llms.txt`, optional `llms-full.txt` per top-level section, and optional `navigation.json` per language. Hugo still owns `sitemap.xml`.
- A bundle belongs to a top-level section. There is no whole-site `llms-full.txt`. To read everything, an agent reads the section bundles listed in `llms.txt`.
- `LLMS`, `LLMSFULL`, and `NAVJSON` are non-alternative formats. They have no `<head>` alternate links or page actions. Agents discover them through conventional paths and their entries in `llms.txt`.
- Server-side content negotiation (one URL returning Markdown for `Accept: text/markdown`) is outside the theme's scope and belongs to the hosting layer.
- Markdown output uses the **source**. Content generated only by browser JavaScript, such as a runtime-drawn chart, appears in the `.md` as fence source. It does not appear as a diagram.

## Related {#related}

- [Print](/docs/customize/print/) — the other non-HTML output
- [Command palette](/docs/customize/panel/) — the other entry point to the assistant actions
- [Page parameters](/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [Navigation and menus](/docs/customize/navigation/) — `llms.txt`'s site index comes from the main menu
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.ui.page_context_menu.*`
