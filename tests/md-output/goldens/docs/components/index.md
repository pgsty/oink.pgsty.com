# Components

> Find each writing component, from simple examples to detailed examples, with its output matrix, parameters, and limits.

---

LLMS index: [llms.txt](/llms.txt)

---

Use this section to write components in Markdown. Each page starts with the shortest example, then gives more detailed examples.
The page also gives the output matrix, parameter table, and limits. Use the cheatsheet below for a quick syntax reference.

## Two forms {#two-forms}

The native form uses Markdown blockquotes, lists, tables, images, or fences, followed by one `{…}` attribute line.
This form stays readable on GitHub and in Markdown editors. Markdown output preserves the source instead of rendered HTML.

Use a shortcode for features that the native form cannot express. Examples include tabs in prose and parameter tables with block descriptions.
Cards with icons and badges, and terminal recordings, also need shortcodes. Follow these five rules:

- Write every shortcode as `{{< name >}}`. Only `{{% steps %}}` uses the `%` delimiter because its body is page-level Markdown.
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

Some components need other settings. Mathematics needs Goldmark passthrough. Draw.io needs an explicitly configured editor service.
Each component page explains its requirements. [Configuration](/docs/customize/config/) lists all configuration keys.

OINK 1.4.0 renders PlantUML locally when enabled without an endpoint, using two
bundled scripts. An explicit endpoint keeps server mode; see the
[PlantUML guide](/docs/components/plantuml/) for both modes.

## Cheatsheet {#cheatsheet}

The *Form* column uses three labels. Native means Markdown syntax plus an attribute line.
Fence means a fenced block with a language tag. Shortcode means `{{< … >}}`.
The *Runtime* column shows whether the component loads JavaScript on the page.

| Component | In one line | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Callouts](/docs/components/callout/) | Separate prerequisites, warnings and asides from the prose | `> [!NOTE]` | native | none |
| [Images](/docs/components/image/) | Captions, sizing, zoom, numbering and build-time processing | `![alt](oink.webp)` | native | site switch |
| [Code Blocks](/docs/components/code/) | Highlighting, titles, copy, folding, linkable lines | ```` ```sh ```` | fence | per page |
| [Tabs](/docs/components/tabs/) | One thing, several platforms or languages | attribute `{tab="Linux"}` | native + shortcode | per page |
| [Tables](/docs/components/table/) | Plain tables plus full-width, matrix, caption and numbering | `{.full-width}` | native | tabs or `.expand` only |
| [Fields](/docs/components/fields/) | Parameter lists with type / required / default chips | `{.fields meta="type default"}` | native + shortcode | none |
| [Steps](/docs/components/steps/) | A procedure with an order | `{.steps}` | native + shortcode | none |
| [Cards](/docs/components/cards/) | A set of parallel destinations | `{.cards}` | native + shortcode | none |
| [FileTree](/docs/components/filetree/) | Directory structure with an aligned comment column | ```` ```filetree ```` | fence | per page |
| [Math](/docs/components/math/) | KaTeX inline and display formulas | `$$ … $$` | native | none |
| [Mermaid](/docs/components/mermaid/) | Flowcharts, sequence diagrams, Gantt charts | ```` ```mermaid ```` | fence | per page |
| [PlantUML](/docs/components/plantuml/) | UML diagrams; local rendering in OINK 1.4.0 | ```` ```plantuml ```` | fence | site switch |
| [Markmap](/docs/components/markmap/) | A Markdown outline becomes a mind map | ```` ```markmap ```` | fence | site switch |
| [Draw.io](/docs/components/drawio/) | Diagrams that stay editable; needs a server | `![alt](arch.drawio.svg)` | native | site switch |
| [ECharts](/docs/components/echarts/) | Declarative statistical charts | ```` ```echarts ```` | fence | per page |
| [Infographic](/docs/components/infographic/) | AntV infographics | ```` ```infographic ```` | fence | per page |
| [Gallery](/docs/components/gallery/) | A set of images sharing one zoom dialog | ```` ```gallery ```` | fence | site switch |
| [Badge](/docs/components/badge/) | Inline status markers | `{{< badge text="Beta" >}}` | shortcode | none |
| [Kbd](/docs/components/kbd/) | Key names and chords | `{{< kbd "Ctrl" "K" >}}` | shortcode | none |
| [Includes](/docs/components/include/) | Pull in files, print site parameters, drop build-time notes | `{{< include file="parts/x.md" >}}` | shortcode | none |
| [Asciinema](/docs/components/asciinema/) | Terminal recordings | `{{< asciinema file="images/x.cast" >}}` | shortcode | per page |
{.wide .expand}

Four notes on the *Runtime* column:

- A code block loads `code-block.js` only if a block on the page has a copy or fold control.
  A file tree loads `filetree.js` only if it has a comment column. This runtime lets readers drag the splitter.
- Images and galleries share one zoom dialog runtime. It needs site-level `ui.image_zoom` and at least one eligible image on the page.
- KaTeX renders mathematics to HTML and MathML at build time. The page loads a KaTeX stylesheet and fonts, but no script.
- Draw.io loads only on pages whose rendered content has PNG or SVG candidates. It inspects each distinct image URL once.

Every component defines its behavior in four outputs: HTML, print, Markdown, and RSS. See *Output* on each component page.

---

Section pages:

- [Callouts](/docs/components/callout/): Write notes, warnings, and collapsible asides with colors, icons, and titles. Use `> [!NOTE]` blockquotes without shortcodes.
- [Images](/docs/components/image/): Use Markdown image syntax and attributes for captions, sizing, zoom, links, numbering, and Hugo image processing.
- [Code Blocks](/docs/components/code/): Use a Markdown fence and attributes for titles, exact copying, line numbers, highlighting, wrapping, folding, and line links.
- [Tabs](/docs/components/tabs/): Add `{tab=}` to adjacent fences or tables to create tabs. Add a group to enable links, synchronization, and saved selections.
- [Tables](/docs/components/table/): Add attributes to a GFM table for captions, compatibility matrices, field lists, numbering, or tabs. Wide tables scroll within their own regions.
- [Fields](/docs/components/fields/): Add `{.fields}` to a table to document configuration keys, command flags, and API fields. Entries adapt to narrow screens and have individual anchors.
- [Steps](/docs/components/steps/): Add `{.steps}` to an ordered list for a numbered procedure. Use the steps shortcode when each step needs a table-of-contents heading.
- [Cards](/docs/components/cards/): Add `{.cards}` to a link list to create navigation cards. Use the shortcode for icons, badges, or images.
- [FileTree](/docs/components/filetree/): Write directory listings in a `filetree` fence. Use indentation for depth, trailing slashes for directories, and aligned comments for explanations.
- [Math](/docs/components/math/): Use KaTeX for inline and display mathematics at build time. Readers download no script.
- [Mermaid](/docs/components/mermaid/): Use a `mermaid` fence for flowcharts, sequence diagrams, Gantt charts, class diagrams, and state diagrams. Bundled Mermaid follows the color scheme; source diffs show changes.
- [Component presentation](/docs/components/presentation/): Cards, disclosures, tabs, and compact procedures across OINK's four visual presets.
- [PlantUML](/docs/components/plantuml/): Render sequence, class, component, activity and use-case diagrams in the browser with bundled assets and no rendering service.
- [Markmap](/docs/components/markmap/): Use a `markmap` fence for an expandable mind map with zoom controls. Its source remains a readable Markdown outline.
- [Draw.io](/docs/components/drawio/): Display a `.drawio.svg` with an embedded editable copy as an ordinary image. Its edit button opens the Draw.io editor.
- [ECharts](/docs/components/echarts/): Write ECharts options as YAML or JSON in an `echarts` fence. Hugo validates them, and bundled ECharts draws charts that follow the color scheme.
- [Infographic](/docs/components/infographic/): Use an `infographic` fence and AntV template to display a title and items as a flow, timeline, funnel, grid, or hierarchy.
- [Gallery](/docs/components/gallery/): Use a `gallery` fence for a responsive image grid with optional descriptions and links. Images share the page zoom dialog.
- [Badge](/docs/components/badge/): Add a semantic status label beside a feature name, version, or table cell. Choose from five tones; custom colors are not supported.
- [Kbd](/docs/components/kbd/): Use `kbd` with one key name per parameter to display a semantic key sequence. Instructions remain readable in print and Markdown.
- [Includes](/docs/components/include/): Use include to insert a file, param to print a site parameter, and comment to remove a note from every output.
- [Asciinema](/docs/components/asciinema/): Display a .cast terminal recording with selectable text. The theme includes the player and does not use a CDN.

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
- [Presentation](/docs/components/presentation/)
- [Components](/docs/design/components/)
- [Get started](/docs/start/)
- [Authoring](/docs/write/)
- [Blog posts](/docs/write/blog/)
- [Books](/docs/write/book/)
- [Writing pages](/docs/write/pages/)
