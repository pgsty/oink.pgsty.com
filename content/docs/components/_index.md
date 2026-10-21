---
title: Components
linkTitle: Components
description: Find each writing component, from simple examples to detailed examples, with its output matrix, parameters, and limits.
weight: 40
icon: fa-solid fa-cubes
search_keywords: [components, cheatsheet, Markdown syntax, shortcode, native form]
cascade:
  categories: [Components]
---

Use this section to write components in Markdown. Each page starts with the shortest example, then gives more detailed examples.
The page also gives the output matrix, parameter table, and limits. Use the cheatsheet below for a quick syntax reference.

## Two forms {#two-forms}

The native form uses Markdown blockquotes, lists, tables, images, or fences, followed by one `{…}` attribute line.
This form stays readable on GitHub and in Markdown editors. Markdown output preserves the source instead of rendered HTML.

Use a shortcode for features that the native form cannot express. Examples include tabs in prose and parameter tables with block descriptions.
Cards with icons and badges, and terminal recordings, also need shortcodes. Follow these five rules:

- Write every shortcode as `{{</* name */>}}`. Only `{{%/* steps */%}}` uses the `%` delimiter because its body is page-level Markdown.
- Use nested names (`tab`, `card`, `field`) only inside their parent.
- Invalid author parameters never fail silently. Ordinary previews warn, identify the source position, and use the documented fallback or omit unsafe content.
  Review the warning and rendered fallback before publication.
- Public string parameters, such as captions, labels, and titles, are plain text. They are not parsed as Markdown.
  Only bodies are Markdown: `tab`, `card` and `field` bodies, files loaded by `include`, and Book `fig` / `tbl` / `eg` bodies.
- Components that a page does not use load no runtime. HTML references only the stable capability chunks that the page needs.
  Print, Markdown, and RSS load no interactive runtime.

## Site prerequisites {#prerequisites}

Components need three Goldmark settings. OINK Starter configures these settings. If you start from scratch, copy this snippet:

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

- `renderer.unsafe: true` keeps raw HTML in content. Goldmark drops it by default. Without this setting, HTML inside component bodies disappears.
- `parser.attribute.block: true` enables attribute lines. Without it, `{.steps}` and `{caption="…"}` appear as text.
- `parser.wrapStandAloneImageWithinParagraph: false` prevents `<p>` wrappers around standalone images. This permits captioned figures and attribute lines after images.

Some components need other settings. Mathematics needs Goldmark passthrough. PlantUML and Draw.io need a rendering server that you run yourself.
Each component page explains its requirements. [Configuration](/docs/customize/config/) lists all configuration keys.

## Cheatsheet {#cheatsheet}

The *Form* column uses three labels. Native means Markdown syntax plus an attribute line.
Fence means a fenced block with a language tag. Shortcode means `{{</* … */>}}`.
The *Runtime* column shows whether the component loads JavaScript on the page.

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
| [Math](/docs/components/math/) | KaTeX inline and display formulas | `$$ … $$` | native | none |
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

- A code block loads `code-block.js` only if a block on the page has a copy or fold control.
  A file tree loads `filetree.js` only if it has a comment column. This runtime lets readers drag the splitter.
- Images and galleries share one zoom dialog runtime. It needs site-level `ui.image_zoom` and at least one eligible image on the page.
- KaTeX renders mathematics to HTML and MathML at build time. The page loads a KaTeX stylesheet and fonts, but no script.
- Draw.io loads only on pages whose rendered content has PNG or SVG candidates. It inspects each distinct image URL once.

Every component defines its behavior in four outputs: HTML, print, Markdown, and RSS. See *Output* on each component page.
