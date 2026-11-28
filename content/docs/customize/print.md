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

Documentation ends up on paper more often than you might expect: a runbook
taken into a server room with no network, a chapter handed out at a training,
a PDF attached to a change request. Any single page already prints cleanly
with the browser's `Cmd/Ctrl+P`: the navbar, sidebar, outline and buttons
carry Bootstrap's `d-print-none` class and stay off the paper, so the theme
needs no "print this page" button. For a whole section or book, turn on the
`print` output format. Every section then gets a print view that joins its
pages, in sidebar order, into one document with a table of contents, ready to
print or save as a PDF.

## Enabling whole-section print {#enable}

The theme defines the `print` output format but leaves it to the site, because
it adds a page per section to every build. Add it to `section` in your
`hugo.yml`:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

Each key under `outputs` replaces the list for that page kind rather than
adding to it, so keep every format the kind already had (here `HTML`, `RSS`
and `markdown`); a format you leave out is no longer generated.

Each section's print view lives under `_print`, which comes right after the
language prefix:

| Page | Print view |
| --- | --- |
| `/docs/customize/` | [`/_print/docs/customize/`](/_print/docs/customize/) |
| `/docs/` | `/_print/docs/` |
| `/blog/release/` | `/_print/blog/release/` |

Readers reach it through **Print entire section** in the page action menu, or
by searching the command palette for the same action (`print_section`). It
prints the section the page belongs to: from `/docs/customize/print/` it
prints the whole Customization section, not just this page.

## The structure of a print view {#anatomy}

A print view contains, from top to bottom:

1. A notice: "This is the multi-page printable view of this section. Click here to print. Return to the regular view of this page." It appears on screen only, never on paper.
2. The section title and summary.
3. A table of contents for the whole section, numbered `1:`, `2:`, `2.1:` by level and linked to anchors in the document.
4. Every page in turn, titled "number - title" (for example "1 - Configuration"), with its description as a standfirst and its body unchanged.

Pages follow the sidebar order (`weight`), with subsections expanded in place.
Every page after the first starts on a new sheet. The first page does so only
when the section index's own body is longer than 50 words, so that an index of
one sentence does not waste a sheet. To change the threshold:

```yaml {title="hugo.yml"}
params:
  print:
    section_break_wordcount: 120
```

To leave out the table of contents for the whole site:

```yaml {title="hugo.yml"}
params:
  print:
    toc: false
```

or for one section, in its index's front matter:

```yaml {title="content/docs/components/_index.md"}
---
title: Components
print:
  toc: false
---
```

## Excluding pages {#exclude-pages}

Some pages add nothing on paper: a page of links, a redirect note, a single
large screenshot. Set `no_print` to leave one out:

```yaml {title="content/docs/about/showcase.md"}
---
title: Showcase
no_print: true
---
```

`no_print` affects only the section print view; the page itself still prints
with `Cmd/Ctrl+P`. Sidebar dividers (`sidebar_divider`) are left out
automatically, but when a divider is a section, its child pages stay in the
print sequence.

## How components look in print {#components}

On paper, nothing can be clicked or expanded, so the same rule applies to the
section print view and to a single page printed from the browser: interactive
components become static, and collapsed content is printed open.

| Component | Print shape |
| --- | --- |
| [Callouts](/docs/components/callout/) | Static blocks. All collapsible kinds (`-` / `+` / `DETAILS`) expand. Borders turn gray and backgrounds are removed |
| [Tabs](/docs/components/tabs/) | The tab bar disappears and every panel is printed in turn, each under its own heading |
| [Code Blocks](/docs/components/code/) | Copy and fold controls removed, maximum height and scrolling dropped, long lines wrapped |
| [Tables](/docs/components/table/) | Complete static tables. On screen the print view keeps keyboard scrolling; on paper the table expands and its header repeats on every page |
| [Images](/docs/components/image/) | Image and caption kept, zoom removed, width limited to the text column |
| [Gallery](/docs/components/gallery/) | The grid becomes a vertical stack |
| [FileTree](/docs/components/filetree/) | A static panel with every directory expanded. A split layout keeps its build-time width |
| [Fields](/docs/components/fields/) | The complete definition list, the same as on screen |
| [Math](/docs/components/math/) | Statically rendered KaTeX / MathML |
| [Mermaid](/docs/components/mermaid/) | The print view keeps the source and loads no engine. A browser-printed page shows the rendered diagram, or the source if it has not rendered |
| [Markmap](/docs/components/markmap/) | The print view keeps the outline source and loads no runtime. A browser-printed page shows the rendered map without its floating notes, or the source if it has not mounted |
| [PlantUML](/docs/components/plantuml/) | The print view keeps the source and loads no runtime. A browser-printed page shows the rendered image, or the source if it has not rendered |
| [ECharts](/docs/components/echarts/) · [Infographic](/docs/components/infographic/) | The print view keeps the fenced source and draws no chart. A browser-printed page shows the rendered chart, or the declared options / DSL if it has not mounted |
| [Asciinema](/docs/components/asciinema/) · [OpenAPI](/docs/write/openapi/) | A labeled static link to the recording or specification; none of the three runtimes loads |
| [Timeline](/docs/components/timeline/) · [Updates](/docs/components/update/) | Static axis or heading + metadata line on the light paper palette; avoids page breaks inside entries |
| [Video](/docs/components/video/) · [Audio](/docs/components/audio/) | Static figure with poster (for video), caption and visible file or watch URL; no `<video>`, `<audio>` or `<iframe>` in the print view |
| [Social](/docs/components/social/) | Static quoted card with author, body, attachments and original-post link on the paper palette |
| [Maps](/docs/components/map/) | Numbered place list with coordinates and links; no Leaflet map canvas |
| Cards / steps / badges / keys | Static, with content unchanged |

Besides the shell, print leaves out the page action menu, the feedback widget,
heading anchor links and inline copy buttons. Before printing a page with
diagrams from the browser, wait until they have finished drawing.

## Browser print styles {#print-css}

A set of `@media print` rules, shared by single pages and section print views,
lays the page out for paper:

- `A4` paper with `18mm 16mm 20mm` margins, 10.5pt body text, and the light palette even when the reader browses in dark mode.
- Text uses the `--td-print-font-family` typography token; see [Brand and appearance](/docs/customize/brand/).
- Headings stay with the text that follows them (`break-after: avoid-page`), and paragraphs and list items keep at least three lines together at a page break.
- Tables, images, blockquotes, callouts, cards and tabs avoid breaking across pages where they can. Code blocks may break, and long lines wrap rather than being cut off.
- A closed `<details>` always prints open, so collapsed callouts and file tree directories show their content.
- Links are dark blue and underlined, without the URL printed after them. If your readers need the addresses on paper, add them:

```css {title="assets/css/project.css"}
@media print {
  .td-content a[href^='http']::after {
    content: ' (' attr(href) ')';
    font-size: 0.85em;
    word-break: break-all;
  }
}
```

Put any other print styling in a `@media print` block in
`assets/css/project.css`; no template change is needed.

## Copying into rich-text editors {#typeset-copy}

Readers also copy articles into WeChat, Word or an email. When they copy part
of an article and paste it into a rich-text editor, they get typeset text in
the same light palette print uses, without the page background, dark-mode
colors, heading anchors, copy buttons or line numbers. Selecting the whole page
(<kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>A</kbd>) copies only the article: title,
description and body.

- Headings, lists, quotes, callouts, tables and code blocks keep their
  structure, with sizes in pixels, so editors that drop stylesheets still show
  them correctly.
- Code blocks keep their syntax colors. Copied in dark mode, a code block stays
  a dark card while the prose around it is dark text on white.
- A few words selected inside one paragraph copy without formatting and take
  the style of the document they are pasted into.
- Pasting as plain text is unchanged.

To restyle the pasted result, override the print palette, for example
`--td-print-ink` or `--td-print-quote-line`, in `assets/css/project.css`. To
keep the browser's own copy behavior, set `rich_copy: false` for the site, or
in a page's front matter for that page:

```yaml {title="hugo.yml"}
params:
  ui:
    rich_copy: false
```

Each editor filters pasted HTML in its own way, so check an important article
in the editor you publish to.

## Replacing the print templates {#customize-templates}

To change the structure, for example to add a running header or a different
numbering, override the narrowest partial under `layouts/_partials/print/`:

| Partial | Responsibility |
| --- | --- |
| `print/render.html` | The section view's skeleton: notice, table of contents, the pages in order |
| `print/page-heading.html` | The title and standfirst at the top of the document |
| `print/content.html` | How one page appears inside the section view |
| `print/toc-li.html` | One row of the table of contents |
{.fields}

The last three can also be overridden for one content type: a file such as
`print/page-heading-blog.html` or `print/content-book.html` takes precedence
over the generic partial for pages of that type.

A whole book (`type: book`) prints through its own path, which keeps chapter
numbers, figure numbers and cross-references continuous across the book; see
[Books](/docs/write/book/).

## Verify {#verify}

From your site's root, build and check that a section where you enabled
`print` has its print view. Replace the example path with that section's
output, including its language prefix if it has one:

```bash
hugo --printPathWarnings
PRINT_PAGE=public/_print/docs/index.html
test -f "$PRINT_PAGE"
```

Then open **Print entire section** on the running site:

- The print view contains the section's pages, without those marked `no_print: true`.
- `Cmd/Ctrl+P` shows no notice, navbar or buttons in the preview.
- On a page with [tabs](/docs/components/tabs/) and a collapsed callout, every panel is open in the preview.
- In a saved PDF, the page breaks fall where you want them; if not, adjust `section_break_wordcount`.

## Related {#related}

- [Books](/docs/write/book/) — numbering, indexes and print for a whole book
- [Organizing content](/docs/write/organize/) — print order is sidebar order
- [Brand and appearance](/docs/customize/brand/) — the print font token
- [AI-agent support](/docs/customize/agents/) — the other non-HTML output
- [Configuration](/docs/customize/config/) — full definitions of `outputs` and `params.print.*`
