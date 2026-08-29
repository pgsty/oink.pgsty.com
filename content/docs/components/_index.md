---
title: Components
linkTitle: Components
description: Every component available for writing, one page each, examples from the simplest upwards, with the parameter table at the end.
weight: 40
icon: fa-solid fa-cubes
search_keywords: [components, cheatsheet, Markdown syntax, shortcode, native form]
cascade:
  categories: [Components]
---

This section answers one question: how do I write this component in Markdown?
Every page has the same shape — the shortest example, progressively richer
examples, the output matrix, the parameter table, the limits. For syntax at a
glance, use the cheatsheet below.

## Two forms {#two-forms}

A component's first form is Markdown itself: blockquotes, lists, tables,
images, fences — plus a single `{…}` attribute line right after them. The
native form stays readable on GitHub and in any Markdown editor, and the
Markdown output keeps the source rather than the rendered HTML.

Whatever the native form cannot express is a shortcode: tabs in running text,
parameter tables with block-level descriptions, cards with icons and badges,
terminal recordings. Five rules cover them:

- Every shortcode is written `{{</* name */>}}`. Only `{{%/* steps */%}}` uses
  the `%` delimiter, because its body is page-level Markdown.
- Nested names (`tab`, `card`, `field`) are valid only inside their parent.
- A bad author parameter never degrades silently. An ordinary preview warns,
  names the source position, and uses the documented fallback or omits the
  unsafe part; a publishing build with `--panicOnWarning` fails on that warning.
- Public string parameters (captions, labels, titles) are plain text and are
  not parsed as Markdown. Only bodies are Markdown: `tab`, `card` and `field`
  bodies, files pulled in by `include`, and the Book `fig` / `tbl` / `eg`
  bodies.
- A component the page never used ships no runtime. HTML references only the
  stable capability chunks the page actually needs; print, Markdown and RSS
  load no interactive runtime.

## Site prerequisites {#prerequisites}

Components depend on three Goldmark settings. OINK Starter provides them
already configured; copy the snippet when starting from scratch:

```yaml {title="hugo.yml"}
markup:
  goldmark:
    renderer:
      unsafe: true # keep HTML that content emits
    parser:
      attribute:
        block: true # enable {…} attribute lines
      wrapStandAloneImageWithinParagraph: false # standalone images are not wrapped in <p>
```

- `renderer.unsafe: true` — Goldmark drops raw HTML in content by default;
  with it off, HTML nested inside component bodies disappears.
- `parser.attribute.block: true` — the master switch for attribute lines. With
  it off, `{.steps}` and `{caption="…"}` are just a line of text.
- `parser.wrapStandAloneImageWithinParagraph: false` — a standalone image is no
  longer wrapped in `<p>`, so it can become a captioned figure and an attribute
  line can follow it.

A few components have their own prerequisites: mathematics needs Goldmark
passthrough, PlantUML and Draw.io need a rendering server you run yourself.
Each page says so. The complete set of configuration keys is in
[Configuration](/docs/customize/config/).

## Cheatsheet {#cheatsheet}

Values in the *Form* column: native = Markdown syntax plus an attribute line;
fence = a fenced block with a language tag; shortcode = `{{</* … */>}}`. The
*Runtime* column says whether the component ships JavaScript to the page.

| Component | In one line | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Callouts](/docs/components/callout/) | Separate prerequisites, warnings and asides from the prose | `> [!NOTE]` | native | none |
| [Images](/docs/components/image/) | Captions, sizing, zoom, numbering and build-time processing | `![alt](oink.webp)` | native | site switch |
| [Code Blocks](/docs/components/code/) | Highlighting, titles, copy, folding, linkable lines | ```` ```sh ```` | fence | per page |
| [Tabs](/docs/components/tabs/) | One thing, several platforms or languages | attribute `{tab="Linux"}` | native + shortcode | per page |
| [Tables](/docs/components/table/) | Plain tables plus full-width, matrix, caption and numbering | `{.full-width}` | native | none |
| [Fields](/docs/components/fields/) | Parameter lists with type / required / default chips | `{.fields meta="type default"}` | native + shortcode | none |
| [Steps](/docs/components/steps/) | A procedure with an order | `{.steps}` | native + shortcode | none |
| [Cards](/docs/components/cards/) | A set of parallel destinations | `{.cards}` | native + shortcode | none |
| [FileTree](/docs/components/filetree/) | Directory structure with an aligned comment column | ```` ```filetree ```` | fence | per page |
| [Math](/docs/components/math/) | KaTeX inline and display formulas | `$$ … $$` | native | per page |
| [Mermaid](/docs/components/mermaid/) | Flowcharts, sequence diagrams, Gantt charts | ```` ```mermaid ```` | fence | per page |
| [PlantUML](/docs/components/plantuml/) | UML diagrams; needs a rendering server | ```` ```plantuml ```` | fence | site switch |
| [Markmap](/docs/components/markmap/) | A Markdown outline becomes a mind map | ```` ```markmap ```` | fence | site switch |
| [Draw.io](/docs/components/drawio/) | Diagrams that stay editable; needs a server | `![alt](arch.drawio.svg)` | native | site switch |
| [ECharts](/docs/components/echarts/) | Declarative statistical charts | ```` ```echarts ```` | fence | per page |
| [Infographic](/docs/components/infographic/) | AntV infographics | ```` ```infographic ```` | fence | per page |
| [Gallery](/docs/components/gallery/) | A set of images sharing one zoom dialog | ```` ```gallery ```` | fence | site switch |
| [Badge](/docs/components/badge/) | Inline status markers | `{{</* badge text="Beta" */>}}` | shortcode | none |
| [Kbd](/docs/components/kbd/) | Key names and chords | `{{</* kbd "Ctrl" "K" */>}}` | shortcode | none |
| [Includes](/docs/components/include/) | Pull in files, print site parameters, drop build-time notes | `{{</* include file="parts/x.md" */>}}` | shortcode | none |
| [Asciinema](/docs/components/asciinema/) | Terminal recordings | `{{</* asciinema file="images/x.cast" */>}}` | shortcode | per page |

Four notes on the *Runtime* column:

- A code block loads `code-block.js` only when a block on the page has a copy
  or fold control; a file tree loads `filetree.js` only when the tree has a
  comment column, which is the runtime that drags the split.
- Images and galleries share one zoom dialog runtime. It needs `ui.image_zoom`
  on for the site and at least one eligible image on the page.
- Mathematics is rendered to HTML and MathML by KaTeX at build time. The page
  gains a KaTeX stylesheet and its fonts, and no script.
- Draw.io loads only on pages whose rendered content contains PNG or SVG
  candidates, then inspects each distinct image URL once.

Every component has a defined shape in all four outputs — HTML, print, Markdown
and RSS. See the *Output* section on each page.
