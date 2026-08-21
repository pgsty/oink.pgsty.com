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
turn them on.

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
- [Docs](https://oink.pgsty.com/docs/index.md): OINK is a documentation theme that needs nothing but Hugo Extended…
- [Blog](https://oink.pgsty.com/blog/index.md): Docsy articles, OINK engineering stories, and OINK release notes

## Documentation index

- [Introduction](https://oink.pgsty.com/docs/about/index.md): A documentation theme that needs nothing but Hugo Extended…
  - [Highlights](https://oink.pgsty.com/docs/about/features/index.md): What separates OINK from an ordinary Hugo theme…
  - [Showcase](https://oink.pgsty.com/docs/about/showcase/index.md): Fourteen production sites run on OINK…
- [Get started](https://oink.pgsty.com/docs/start/index.md): Clone the OINK documentation site, preview it locally, replace the site details, and deploy to GitHub Pages.
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

The theme renders Markdown output with `layouts/all.md` and generates
`llms.txt` with `layouts/index.llms.txt`. A site replaces either wholesale by
placing a file of the same name under its own `layouts/`, but **consider a
narrower approach first**:

- **Per content type**: a typed path such as `layouts/blog/single.md` or `layouts/docs/list.md` affects only that kind of content, which is how the theme's own print templates are specialized (`layouts/blog/single.print.html`). Check the [template lookup order](https://gohugo.io/templates/lookup-order/) for your combination.
- **Per shortcode**: a site's own shortcode can have an [output-format-specific template](https://gohugo.io/templates/shortcode/) giving it a more machine-readable form in Markdown output.
- **Per page**: hand-writing the content of a few high-value pages costs less than changing a template.

The content of `llms.txt` follows the site's structure, so before changing the
template, confirm the problem is not in the main menu or a `description`.

## Verify {#verify}

```bash
hugo -d public
ls public/llms.txt public/docs/customize/agents/index.md
```

With `curl`, against production or a local preview:

```console
$ curl -s http://localhost:1313/docs/customize/agents/index.md | head -5
# AI-agent support

> Give every page a `.md` twin, the site root an `llms.txt`, and the reader a way to hand the current page to ChatGPT or Claude.

$ curl -sI http://localhost:1313/llms.txt | head -3
```

Then check three things:

- Any page's HTML `<head>` has `rel="alternate" type="text/markdown"`;
- Clicking the copy button at the right of the breadcrumb row and pasting yields Markdown rather than HTML;
- `llms.txt` contains no off-site links.

## Limits {#limits}

- The machine-readable surface the theme produces is exactly two things: a `.md` per page and `llms.txt`. There is no `nav.json` and no other structured index interface; the sitemap is still Hugo's own `sitemap.xml`.
- The `LLMS` output format is declared as a non-alternative format, so `llms.txt` never appears in the `<head>` alternate links and has no page action. It is discovered by its conventional root path.
- Server-side content negotiation (one URL returning Markdown for `Accept: text/markdown`) is outside the theme's scope and belongs to the hosting layer.
- Markdown output follows the **source** path: content generated only in the browser by JavaScript (a runtime-drawn chart) appears in the `.md` as fence source, not as a diagram.

## Related {#related}

- [Print](/docs/customize/print/) — the other non-HTML output
- [Command palette](/docs/customize/panel/) — the other entry point to the assistant actions
- [Page parameters](/docs/write/frontmatter/) — `outputs` / `assistant_links` / `page_context_menu`
- [Navigation and menus](/docs/customize/navigation/) — `llms.txt`'s site index comes from the main menu
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.ui.page_context_menu.*`
