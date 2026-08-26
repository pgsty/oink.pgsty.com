---
title: Print
linkTitle: Print
description: A single page goes to the browser's Cmd/Ctrl+P; a whole section becomes one continuous document through the print output format.
weight: 130
search_keywords:
  [print, print a chapter, print view, PDF, export, outputs, _print, no_print]
aliases:
  - /docs/advanced/print/
---

Printing one page needs no configuration: the shell (sidebar, outline, navbar,
buttons) all carries `d-print-none`, so the browser's `Cmd/Ctrl+P` yields a
clean body. That is why the theme has no per-page "print this page" button.

What does need configuration is the other thing: assembling a whole section (or
a whole book) and all its pages into one continuous document with a table of
contents. What follows covers enabling it, the structure of the print view, and
how to exclude pages.

## Enabling whole-section print {#enable}

`print` is a custom output format the theme declares and does not enable for a
site. Add it to `section` in the site's own `hugo.yml`:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

That is this site's configuration. Each key under `outputs` is a **wholesale
replacement** rather than a merge: adding `print` means writing back every
format that kind already had (`HTML`, `RSS`, `markdown`), and omitting one loses
that output.

Once on, every section gains a URL. The `_print` segment comes first, after the
language prefix:

| Page | Print view |
| --- | --- |
| `/docs/customize/` | [`/_print/docs/customize/`](/_print/docs/customize/) |
| `/docs/` | `/_print/docs/` |
| `/blog/release/` | `/_print/blog/release/` |

"Print the whole section" also appears in the page action menu, and the same
entry is searchable in the command palette (action ID `print_section`). It
prints the **current section**: clicking it on `/docs/customize/print/` produces
the entire Customization section, not this one page.

## The structure of a print view {#anatomy}
Opening any of those links, from top to bottom:

1. A notice bar: "This is the multi-page printable view of this section. Click here to print. Return to the regular view of this page." It carries `d-print-none` and appears on screen only, never on paper.
2. The section title and summary.
3. A whole-section table of contents, numbered `1:`, `2:`, `2.1:` by level, linking to in-document anchors.
4. Each page in turn, its title becoming "number - title" as in `1 - Configuration", its description a standfirst, and its body rendered as it stands.

Page order is sidebar order (`weight`), with subsections expanded recursively.
Every page from the second onwards starts a new sheet; whether the first does
depends on whether the section index's own body exceeds 50 words, so an index of
one sentence does not take a sheet to itself. The threshold is adjustable:

```yaml {title="hugo.yml"}
params:
  print:
    section_break_wordcount: 120
```

To drop the table of contents:

```yaml {title="hugo.yml"}
params:
  print:
    toc: false
```

It can also be turned off for one section, in the section index's front matter:

```yaml {title="content/docs/components/_index.md"}
---
title: Components
print:
  toc: false
---
```

## Excluding pages {#exclude-pages}

Link-only pages, pages that are one redirect note, and pages that are one
enormous screenshot are not worth paper. Give them `no_print`:

```yaml {title="content/docs/about/showcase.md"}
---
title: Showcase
no_print: true
---
```

It affects the whole-section print view only; the page's own HTML and the
browser's `Cmd/Ctrl+P` are unaffected. Sidebar dividers (`sidebar_divider`) are
excluded automatically.

## How components look in print {#components}

Print is one of the four outputs, and every component has a defined print shape.
The whole-section print view and the browser printing one page follow the same
rule: **anything interactive degrades to static, and anything collapsible is
expanded**.

| Component | Print shape |
| --- | --- |
| [Callouts](/docs/components/callout/) | Static blocks, with every collapsible kind (`-` / `+` / `DETAILS`) expanded; borders go grey and backgrounds drop |
| [Tabs](/docs/components/tabs/) | The tab bar disappears and every panel is expanded in turn, each with its own heading |
| [Code Blocks](/docs/components/code/) | Copy and fold controls removed, max height and scrolling dropped, long lines wrapped |
| [Tables](/docs/components/table/) | Full-width static tables with no horizontal scroll; headers repeat across pages |
| [Images](/docs/components/image/) | Image and caption kept, zoom attributes stripped, width brought inside the measure |
| [Gallery](/docs/components/gallery/) | The grid becomes a vertical stack |
| [FileTree](/docs/components/filetree/) | A static panel with every directory expanded and the split frozen at its build-time width |
| [Fields](/docs/components/fields/) | A complete definition list, identical in both forms |
| [Math](/docs/components/math/) | Statically rendered KaTeX / MathML |
| [Mermaid](/docs/components/mermaid/) · [Markmap](/docs/components/markmap/) · [PlantUML](/docs/components/plantuml/) | Still rendered as diagrams: the print view is an HTML page, and these runtimes load as usual |
| [ECharts](/docs/components/echarts/) · [Infographic](/docs/components/infographic/) | Degrade to the fence source block; no chart is drawn |
| [Asciinema](/docs/components/asciinema/) · [OpenAPI](/docs/write/openapi/) | A labelled static link showing the recording or specification address; none of the three runtimes loads |
| Cards / steps / badges / keys | Static, with content unchanged |

The page shell never reaches paper: sidebar, outline, navbar, the page action
menu, the feedback widget, heading anchor links and inline copy buttons.

For the three diagram kinds above that a browser runtime draws (Mermaid, Markmap,
PlantUML), confirm they have finished drawing before triggering print.

## Browser print styles {#print-css}

The theme ships a layer of `@media print` rules shared by single-page and
whole-section printing:

- `A4` paper with `18mm 16mm 20mm` margins; 10.5pt body text; the light palette forced.
- Fonts switch to the `--td-print-font-family` typography token — see [Brand and appearance](/docs/customize/brand/).
- Headings do not separate from their body (`break-after: avoid-page`), and paragraphs and list items keep three-line orphan and widow control.
- Tables, images, blockquotes, callouts, cards and tabs avoid breaking across pages where possible; code blocks may break, and wrap rather than truncate.
- Links are underlined and turned dark blue, and the URL text is not printed after them. A site that wants that behaviour adds it:

```scss {title="assets/scss/_styles_project.scss"}
@media print {
  .td-content a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 0.85em;
    word-break: break-all;
  }
}
```

- A closed `<details>` is always expanded: collapsed callouts and file tree directories are complete on paper.

Custom print styling goes in a `@media print` block in
`assets/scss/_styles_project.scss` and needs no template change.

## Replacing the print templates {#customize-templates}

To change the structure — adding a running header, or changing the numbering
format — override the narrowest partial. They are all under
`layouts/_partials/print/`:

| Partial | Responsibility |
| --- | --- |
| `print/render.html` | The whole-section skeleton: notice bar, contents, recursive content |
| `print/page-heading.html` | The title and standfirst at the top of the document |
| `print/content.html` | How one page appears inside the whole-section view |
| `print/toc-li.html` | One row of the table of contents |

The last three additionally support **per content type**: create
`print/page-heading-blog.html` or `print/content-book.html` and the theme
prefers the type-suffixed one.

Printing a whole book (`type: book`) takes a different path, where chapter
numbers, figure numbers and cross-references stay continuous across the book —
see [Books](/docs/write/book/).

## Verify {#verify}

```bash
hugo -d public
ls public/_print/docs/          # one directory per section
```

Then look at the page:

- Open `/_print/docs/customize/` in a browser and confirm the contents has as many rows as the section has pages (minus those with `no_print: true`).
- Press `Cmd/Ctrl+P` in that view: the print preview should show no notice bar, no navbar and no buttons.
- Find a page with tabs and a collapsed callout (for example [Tabs](/docs/components/tabs/)) and confirm every panel is expanded in the preview.
- Print a PDF and read the pagination through, adjusting `section_break_wordcount` where the threshold does not suit.

## Related {#related}

- [Books](/docs/write/book/) — numbering, indexes and print for a whole book
- [Organizing content](/docs/write/organize/) — print order is sidebar order
- [Brand and appearance](/docs/customize/brand/) — the print font token
- [AI-agent support](/docs/customize/agents/) — the other non-HTML output
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.print.*`
