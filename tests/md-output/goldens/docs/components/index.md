# Components

> Every component available for writing, one page each, examples from the simplest upwards, with the parameter table at the end.

---

LLMS index: [llms.txt](/llms.txt)

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

- Every shortcode is written `{{< name >}}`. Only `{{% steps %}}` uses
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
fence = a fenced block with a language tag; shortcode = `{{< … >}}`. The
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
| [Badge](/docs/components/badge/) | Inline status markers | `{{< badge text="Beta" >}}` | shortcode | none |
| [Kbd](/docs/components/kbd/) | Key names and chords | `{{< kbd "Ctrl" "K" >}}` | shortcode | none |
| [Includes](/docs/components/include/) | Pull in files, print site parameters, drop build-time notes | `{{< include file="parts/x.md" >}}` | shortcode | none |
| [Asciinema](/docs/components/asciinema/) | Terminal recordings | `{{< asciinema file="images/x.cast" >}}` | shortcode | per page |

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

---

Section pages:

- [Callouts](/docs/components/callout/): Write notes, warnings and collapsible asides — with colour, icon and title — as `> [!NOTE]` blockquotes, no shortcode involved.
- [Images](/docs/components/image/): Plain Markdown image syntax plus one attribute line gives you captions, sizing, zoom, links, numbering and Hugo image processing.
- [Code Blocks](/docs/components/code/): A plain Markdown fence plus one attribute line gives you a filename title, exact copy, line numbers, highlighting, wrapping, folding and linkable lines.
- [Tabs](/docs/components/tabs/): A `{tab=}` attribute on adjacent fences or tables makes a tab set; add a group and it becomes linkable, synchronized and remembered.
- [Tables](/docs/components/table/): A plain GFM table plus one attribute line becomes a captioned table, a compatibility matrix, a field list, a numbered table or a tab set; wide tables scroll on their own.
- [Fields](/docs/components/fields/): A plain table plus `{.fields}` documents configuration keys, command flags and API fields — name, type, default and description each in place, readable on a narrow screen, every entry individually linkable.
- [Steps](/docs/components/steps/): An ordered list plus `{.steps}` becomes a numbered procedure with dots and a connecting rule; switch to the steps shortcode when each step needs a heading in the table of contents.
- [Cards](/docs/components/cards/): A link list plus `{.cards}` lays out a grid of navigation cards; switch to the shortcode when you need icons, badges or images.
- [FileTree](/docs/components/filetree/): A `filetree` fence draws an annotated directory structure — aligned comment column, per-entry icons, collapsible directories, a draggable split.
- [Math](/docs/components/math/): Inline and display mathematics with KaTeX, rendered at build time — the reader downloads no script.
- [Mermaid](/docs/components/mermaid/): A `mermaid` fence turns text into flowcharts, sequence diagrams, Gantt charts, class diagrams and state diagrams — rendered locally, theme-aware, diff-friendly.
- [PlantUML](/docs/components/plantuml/): A `plantuml` fence writes sequence, class, component, activity and use-case diagrams; rendering requires a PlantUML server you configure yourself.
- [Markmap](/docs/components/markmap/): A `markmap` fence turns a Markdown outline into an expandable, zoomable mind map — and the source stays a readable outline.
- [Draw.io](/docs/components/drawio/): Put a `.drawio.svg` that carries an editable copy on the page as an ordinary image; hovering gives the reader a button that opens the Draw.io editor.
- [ECharts](/docs/components/echarts/): Write ECharts options as YAML or JSON in an `echarts` fence; Hugo validates them at build time and the browser draws a theme-aware chart with the local ECharts.
- [Infographic](/docs/components/infographic/): An `infographic` fence picks an AntV template and renders a title plus a list of items as a flow, timeline, funnel, grid or hierarchy.
- [Gallery](/docs/components/gallery/): A `gallery` fence arranges related screenshots in a responsive grid, each with an optional description or link, reusing the page's image zoom dialog.
- [Badge](/docs/components/badge/): Put a semantic status label next to a feature name, a version or a table cell — five tones, no custom colours.
- [Kbd](/docs/components/kbd/): Write shortcuts with `kbd` — one shortcode, a list of key names, a semantic key sequence that stays readable in print and in Markdown output.
- [Includes](/docs/components/include/): Pull an external file in with include, print a site parameter with param, and write a note that reaches no output at all with comment.
- [Asciinema](/docs/components/asciinema/): Put a .cast terminal recording on the page — the text stays selectable text, and the player ships with the theme rather than coming from a CDN.

---

Backlinks:

- [Introducing OINK](/blog/oink/oink-announcement/)
- [Oink v0.2.0](/blog/release/0.2.0/)
- [Oink v0.3.0](/blog/release/0.3.0/)
- [Compose the page](/book/03-compose/)
- [OINK Docs](/case/oink/)
- [Docs](/docs/)
- [Introduction](/docs/about/)
- [Highlights](/docs/about/features/)
- [Upgrade](/docs/admin/upgrade/)
- [Components](/docs/design/components/)
- [Get started](/docs/start/)
- [Authoring](/docs/write/)
- [Blog posts](/docs/write/blog/)
- [Books](/docs/write/book/)
- [Writing pages](/docs/write/pages/)
