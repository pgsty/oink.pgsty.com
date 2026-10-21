---
title: Print
linkTitle: Print
description: Print one page with the browser's Cmd/Ctrl+P. Use the print output format to combine a section into one continuous document.
weight: 130
search_keywords:
  [print, print a chapter, print view, PDF, export, outputs, _print, no_print]
aliases:
  - /docs/advanced/print/
---

Printing one page needs no configuration. The sidebar, outline, navbar, and
buttons have `d-print-none`. The browser's `Cmd/Ctrl+P` therefore prints only
the body. The theme has no per-page "print this page" button.

To combine a whole section or book and its pages into one continuous document,
configure print output. This document includes a table of contents. This page
explains how to enable the output, understand its structure, and exclude pages.

## Enabling whole-section print {#enable}

The theme declares the custom `print` output format but does not enable it for
the site. Add it to `section` in the site's own `hugo.yml`:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

This site uses the configuration above. Each key under `outputs` is a
**wholesale replacement**, not a merge. When you add `print`, retain every
format that the page kind already used (`HTML`, `RSS`, `markdown`). If you
omit a format, you lose that output.

After you enable print output, each section has a print URL. The `_print`
segment comes first after the language prefix:

| Page | Print view |
| --- | --- |
| `/docs/customize/` | [`/_print/docs/customize/`](/_print/docs/customize/) |
| `/docs/` | `/_print/docs/` |
| `/blog/release/` | `/_print/blog/release/` |

"Print the whole section" appears in the page action menu. You can also find
it in the command palette by action ID `print_section`. It prints the
**current section**. On `/docs/customize/print/`, it prints the entire
Customization section, not only this page.

## The structure of a print view {#anatomy}
Each print view contains these items from top to bottom:

1. A notice bar: "This is the multi-page printable view of this section. Click here to print. Return to the regular view of this page." It carries `d-print-none` and appears on screen only, never on paper.
2. The section title and summary.
3. A whole-section table of contents, numbered `1:`, `2:`, `2.1:` by level, linking to in-document anchors.
4. Each page appears in sequence. Its title uses "number - title", such as "1 - Configuration". Its description introduces the body. The body is rendered unchanged.

Pages follow sidebar order (`weight`), with subsections expanded recursively.
Each page after the first starts a new sheet. The first page starts a new
sheet only if the section index body exceeds 50 words. A one-sentence index
therefore does not occupy a separate sheet. You can adjust the threshold:

```yaml {title="hugo.yml"}
params:
  print:
    section_break_wordcount: 120
```

To remove the table of contents:

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

To exclude link-only pages, redirect notes, or pages with one large screenshot,
set `no_print`:

```yaml {title="content/docs/about/showcase.md"}
---
title: Showcase
no_print: true
---
```

This setting affects only the whole-section print view. It does not affect the
page's HTML or browser `Cmd/Ctrl+P`. The view automatically excludes sidebar
dividers (`sidebar_divider`). If a divider is a section, its child documents
remain in the print sequence.

## How components look in print {#components}

Print is one of four outputs. Each component has a defined print form.
Whole-section print and single-page browser print use the same rule:
**interactive content becomes static, and collapsible content expands**.

| Component | Print shape |
| --- | --- |
| [Callouts](/docs/components/callout/) | Static blocks. All collapsible kinds (`-` / `+` / `DETAILS`) expand. Borders become gray, and backgrounds are removed |
| [Tabs](/docs/components/tabs/) | The tab bar disappears and every panel is expanded in turn, each with its own heading |
| [Code Blocks](/docs/components/code/) | Copy and fold controls removed, max height and scrolling dropped, long lines wrapped |
| [Tables](/docs/components/table/) | Complete static tables with a keyboard-scrollable browser preview; print-media CSS expands them for paper and headers repeat across pages |
| [Images](/docs/components/image/) | Retains image and caption. Removes zoom attributes and limits width to the reading measure |
| [Gallery](/docs/components/gallery/) | The grid becomes a vertical stack |
| [FileTree](/docs/components/filetree/) | A static panel with all directories expanded. The split retains its build-time width |
| [Fields](/docs/components/fields/) | A complete definition list, identical in both forms |
| [Math](/docs/components/math/) | Statically rendered KaTeX / MathML |
| [Mermaid](/docs/components/mermaid/) · [Markmap](/docs/components/markmap/) · [PlantUML](/docs/components/plantuml/) | Renders diagrams. The print view is HTML, and these runtimes load normally |
| [ECharts](/docs/components/echarts/) · [Infographic](/docs/components/infographic/) | Shows the fence source block. Draws no chart |
| [Asciinema](/docs/components/asciinema/) · [OpenAPI](/docs/write/openapi/) | A labeled static link to the recording or specification. None of the three runtimes loads |
| Cards / steps / badges / keys | Static, with content unchanged |

Print excludes the page shell: sidebar, outline, navbar, page action menu,
feedback widget, heading anchor links, and inline copy buttons.

For the three diagram kinds above that a browser runtime draws (Mermaid, Markmap,
PlantUML), confirm they have finished drawing before triggering print.

## Browser print styles {#print-css}

The theme ships a layer of `@media print` rules shared by single-page and
whole-section printing:

- `A4` paper with `18mm 16mm 20mm` margins; 10.5pt body text; the light palette forced.
- Fonts use the `--td-print-font-family` typography token. See [Brand and appearance](/docs/customize/brand/).
- Headings do not separate from their body (`break-after: avoid-page`), and paragraphs and list items keep three-line orphan and widow control.
- Tables, images, blockquotes, callouts, cards, and tabs avoid page breaks where possible. Code blocks may break across pages. Long lines wrap instead of truncating.
- Links are underlined and dark blue. Print does not append URL text. To append it, add this rule:

```scss {title="assets/scss/_styles_project.scss"}
@media print {
  .td-content a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 0.85em;
    word-break: break-all;
  }
}
```

- A closed `<details>` always expands. Printed callouts and file tree directories therefore show all content.

Custom print styling goes in a `@media print` block in
`assets/scss/_styles_project.scss` and needs no template change.

## Replacing the print templates {#customize-templates}

To add a running header or change numbering, override the partial with the
smallest relevant scope. Print partials are under `layouts/_partials/print/`:

| Partial | Responsibility |
| --- | --- |
| `print/render.html` | The whole-section skeleton: notice bar, contents, recursive content |
| `print/page-heading.html` | The title and standfirst at the top of the document |
| `print/content.html` | How one page appears inside the whole-section view |
| `print/toc-li.html` | One row of the table of contents |

The last three also support overrides **per content type**. Create
`print/page-heading-blog.html` or `print/content-book.html`. The theme gives
the type-suffixed partial precedence.

Whole-book printing (`type: book`) uses a separate path. Chapter numbers,
figure numbers, and cross-references remain continuous across the book. See
[Books](/docs/write/book/).

## Verify {#verify}

In your site's root, build and check the print output for a section where you
enabled `print`. Replace the example path with that section's actual output,
including its language prefix if applicable:

```bash
hugo --printPathWarnings
PRINT_PAGE=public/_print/docs/index.html
test -f "$PRINT_PAGE"
```

Then open that section's **Print the whole section** action on the running site:

- Confirm the print view contains the section's pages, excluding `no_print: true` pages.
- Press `Cmd/Ctrl+P`. Confirm that print preview shows no notice bar, navbar, or buttons.
- Use a page with tabs and a collapsed callout. Confirm that every panel expands in preview. See [Tabs](/docs/components/tabs/) for authoring syntax.
- Print a PDF and check pagination. If necessary, adjust `section_break_wordcount`.

## Related {#related}

- [Books](/docs/write/book/) — numbering, indexes and print for a whole book
- [Organizing content](/docs/write/organize/) — print order is sidebar order
- [Brand and appearance](/docs/customize/brand/) — the print font token
- [AI-agent support](/docs/customize/agents/) — the other non-HTML output
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.print.*`
