# Components

> Pick the component that fits what you are writing and look up its shortest syntax, its form and whether it loads a script.

---

LLMS index: [llms.txt](/llms.txt)

---

Components are what a documentation page needs beyond paragraphs: a warning
the reader must not skip, install commands for three platforms, a diagram, a
chart, a terminal recording. Most of them are ordinary Markdown with one
attribute line, so the source still reads cleanly on GitHub, and the theme
turns it into the richer version when Hugo builds the site. Pick one from the
table below; each component's page opens with the shortest source and its
result, then the variations, then every parameter.
[Component presentation](/docs/components/presentation/) shows the most common
ones side by side in each visual preset.

## Cheatsheet {#cheatsheet}

*Form* says how you write it: **native** is Markdown syntax plus an attribute
line, **fence** is a code fence with a language tag, **shortcode** is
`{{< … >}}`. *Runtime* says whether the reader's browser downloads a script
for it: **none**, **per page** (only on pages that use it), or **site switch**
(off until you enable it in `hugo.yml`, then per page).

### Core writing {#writing}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Callouts](/docs/components/callout/) | A prerequisite, warning or aside the reader must not miss | `> [!NOTE]` | native | none |
| [Code Blocks](/docs/components/code/) | Commands and source with a filename, exact copy, folding and line links | ```` ```sh ```` | fence | per page |
| [Tables](/docs/components/table/) | Comparisons and matrices, full-width, captioned or numbered | `{.full-width}` | native | tabs or `.expand` only |
| [Fields](/docs/components/fields/) | Parameter lists with type, required and default chips | `{.fields meta="type default"}` | native + shortcode | none |
| [Badge](/docs/components/badge/) | A one- or two-word status beside a name, such as Beta | `{{< badge text="Beta" >}}` | shortcode | none |
| [Kbd](/docs/components/kbd/) | Key names and keyboard shortcuts | `{{< kbd "Ctrl" "K" >}}` | shortcode | none |
{.wide}

### Structure & flow {#structure}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Tabs](/docs/components/tabs/) | The same instructions for several platforms or languages | attribute `{tab="Linux"}` | native + shortcode | per page |
| [Steps](/docs/components/steps/) | A procedure the reader carries out in order | `{.steps}` | native + shortcode | none |
| [Timeline](/docs/components/timeline/) | Dated or ordered events on an axis | `{.timeline}` on a definition list | native | none |
| [Update](/docs/components/update/) | Changelog entries that stay headings in the table of contents | `## v1.6 {.update date="2026-11-23"}` | native | none |
| [Cards](/docs/components/cards/) | A few parallel destinations for the reader to choose from | `{.cards}` | native + shortcode | none |
| [Includes](/docs/components/include/) | Reuse a file, print a site parameter, keep a note out of the output | `{{< include file="parts/x.md" >}}` | shortcode | none |
{.wide}

### Diagrams, charts & math {#diagrams}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Mermaid](/docs/components/mermaid/) | Flowcharts, sequence diagrams and Gantt charts drawn from text | ```` ```mermaid ```` | fence | per page |
| [PlantUML](/docs/components/plantuml/) | UML diagrams, rendered in the browser or by your own server | ```` ```plantuml ```` | fence | site switch |
| [Draw.io](/docs/components/drawio/) | Diagrams readers can open in the Draw.io editor; needs an editor address | `![alt](arch.drawio.svg)` | native | site switch |
| [ECharts](/docs/components/echarts/) | Bar, line and pie charts declared as data | ```` ```echarts ```` | fence | per page |
| [Infographic](/docs/components/infographic/) | AntV infographics that show order, hierarchy or comparison | ```` ```infographic ```` | fence | per page |
| [Maps](/docs/components/map/) | Places as a list, plus an interactive map when enabled | ```` ```map ```` | fence | site switch |
| [Markmap](/docs/components/markmap/) | A Markdown outline drawn as a mind map | ```` ```markmap ```` | fence | site switch |
| [FileTree](/docs/components/filetree/) | A directory layout with an aligned comment beside each entry | ```` ```filetree ```` | fence | per page |
| [Math](/docs/components/math/) | Inline and display formulas, rendered by KaTeX at build time | `$$ … $$` | native | none |
{.wide}

### Media & embeds {#media}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Images](/docs/components/image/) | Screenshots and figures with captions, sizing, zoom and numbering | `![alt](oink.webp)` | native | site switch |
| [Gallery](/docs/components/gallery/) | A set of images browsed in one shared zoom dialog | ```` ```gallery ```` | fence | site switch |
| [Video](/docs/components/video/) | Video files, looping demos, YouTube and Bilibili cards | `![name](demo.mp4)` | native | per page; players need a site switch |
| [Audio](/docs/components/audio/) | Podcast episodes and voice samples in a titled native player | `![name](episode.mp3)` | native | per page |
| [Asciinema](/docs/components/asciinema/) | Terminal sessions replayed as selectable text | `{{< asciinema file="images/x.cast" >}}` | shortcode | per page |
| [Social](/docs/components/social/) | Quote a social post without contacting its platform | ``> [!SOCIAL] Name `@handle` `` | native | none |
{.wide}

A few entries in the *Runtime* column depend on what is on the page:

- A code block loads `code-block.js` only when some block on the page has a
  copy or fold control. A file tree loads `filetree.js` only when it has a
  comment column, which the reader can resize by dragging.
- Images and galleries share one zoom dialog. It needs
  `params.ui.image_zoom: true` and at least one image on the page that can be
  zoomed.
- Math loads the KaTeX stylesheet and fonts but no script, because the
  formulas are already HTML and MathML when the page is built.
- Draw.io loads only on pages with PNG or SVG images, and it downloads each
  distinct image once to look for an editable copy.
- Video and audio share `media.js`, loaded on any page with a local audio or
  video player (progress and single-active playback) or a card whose platform
  is in `params.video_embeds`. A map loads Leaflet only when `params.map` is
  enabled (`enable: true` with valid `tiles` and `attribution`); otherwise it
  stays a list of places.

No component loads a script in print, Markdown or RSS output. Each component
page says what those outputs contain when it differs from what you would
expect.

## Two forms {#two-forms}

Prefer the native form: a blockquote, list, table, image or fence, followed
by a `{…}` attribute line. It stays readable on GitHub and in any Markdown
editor, and the page's Markdown output keeps your source instead of rendered
HTML.

Shortcodes cover what Markdown cannot express, such as tabs that hold prose,
parameter lists whose descriptions contain code blocks, cards with icons and
badges, and terminal recordings. They follow the same rules everywhere:

- Write every shortcode as `{{< name >}}`. Only `{{% steps %}}` uses
  `%`, because its body is page-level Markdown with headings.
- Child shortcodes (`tab`, `card`, `field`) work only inside their parent.
- Parameters such as titles, labels and captions are plain text, not
  Markdown. Only bodies are Markdown: the bodies of `tab`, `card` and `field`,
  files pulled in by `include`, and the Book `fig`, `tbl` and `eg` bodies.
- A wrong parameter never stops the build. Hugo prints a warning with the
  file and line, and the component falls back to the behavior its page
  documents or leaves the unsafe part out, so read the warnings before you
  publish. See
  [When a value is wrong](/docs/customize/config/#principles).

## Site prerequisites {#prerequisites}

Components rely on three Goldmark settings. Hugo does not take `markup`
settings from a theme, so they must be in your site's own configuration. OINK
Starter already has them; on a site you set up yourself, add:

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

- `renderer.unsafe: true` keeps raw HTML in the rendered content. Without it,
  Goldmark drops that HTML and markup inside component bodies disappears.
- `parser.attribute.block: true` turns on attribute lines. Without it,
  `{.steps}` and `{caption="…"}` show up as literal text.
- `parser.wrapStandAloneImageWithinParagraph: false` stops Goldmark from
  wrapping an image that stands alone in a `<p>`, which is what lets it become
  a captioned figure with an attribute line.

A few components need more. Math written with `$$`, `\[…\]` or `\(…\)` needs
Goldmark's passthrough extension. PlantUML, Markmap, Draw.io, the image zoom dialog,
in-page video players and maps each have a site switch, and Draw.io also needs
an editor address. Each component page shows its setting, and
[Configuration](/docs/customize/config/#goldmark) has the complete `markup`
block.

---

Section pages:

- [Callouts](/docs/components/callout/): Write notes, warnings, and collapsible asides with colors, icons, and titles. Use `> [!NOTE]` blockquotes without shortcodes.
- [Code Blocks](/docs/components/code/): Show commands, configuration and source code in a Markdown fence with a filename, exact copying, line numbers, highlighting, wrapping, folding and linkable lines.
- [Tables](/docs/components/table/): Turn an ordinary Markdown table into a captioned table, a compatibility matrix, a field list, a numbered book table or a tab set, and give wide technical tables room to read.
- [Fields](/docs/components/fields/): Document configuration keys, command flags and API fields as a field list that stays readable on a phone and gives every entry its own link.
- [Badge](/docs/components/badge/): Mark a feature, version or table cell with a short status label such as Beta or deprecated, in one of five semantic tones.
- [Kbd](/docs/components/kbd/): Use `kbd` with one key name per parameter to display a semantic key sequence. Instructions remain readable in print and Markdown.
- [Tabs](/docs/components/tabs/): Put equivalent alternatives such as package managers or config formats side by side, and let one reader choice follow them across every page.
- [Steps](/docs/components/steps/): Add `{.steps}` to an ordered list for a numbered procedure. Use the steps shortcode when each step needs a table-of-contents heading.
- [Timeline](/docs/components/timeline/): Turn a Markdown definition list into a vertical timeline of dated or ordered events, for milestones, incident write-ups, product history or an agenda.
- [Update](/docs/components/update/): Write a changelog, a "What's new" page or weekly notes as ordinary headings marked `{.update}`, with an optional date and tags under each entry.
- [Cards](/docs/components/cards/): Turn a Markdown link list into a grid of navigation cards, and use the shortcode when cards need icons, badges or images.
- [Includes](/docs/components/include/): Reuse one source across pages with include for shared fragments and files, param for site and page values, and comment for notes that never publish.
- [Mermaid](/docs/components/mermaid/): Use a `mermaid` fence for flowcharts, sequence diagrams, Gantt charts, class diagrams, and state diagrams. Bundled Mermaid follows the color scheme; source diffs show changes.
- [PlantUML](/docs/components/plantuml/): Render sequence, class, component, activity and use-case diagrams in the browser with bundled assets and no rendering service.
- [Draw.io](/docs/components/drawio/): Publish a Draw.io export as an ordinary image that readers can open in the Draw.io editor, change and download.
- [ECharts](/docs/components/echarts/): Draw bar, line and pie charts by writing ECharts options as YAML or JSON in an `echarts` fence, with colors that follow light and dark mode.
- [Infographic](/docs/components/infographic/): Turn a title and a short list of items into a flow, timeline, funnel, grid or hierarchy graphic with an `infographic` fence and an AntV template.
- [Maps](/docs/components/map/): List places in a `map` fence to get a numbered place list in HTML, Print and RSS, plus an interactive map once the site names a tile service.
- [Markmap](/docs/components/markmap/): Use a `markmap` fence for an expandable mind map with zoom controls. Its source remains a readable Markdown outline.
- [FileTree](/docs/components/filetree/): Draw an annotated directory tree in a `filetree` fence, with aligned comments, per-entry icons and collapsible directories.
- [Math](/docs/components/math/): Use KaTeX for inline and display mathematics at build time. Readers download no script.
- [Images](/docs/components/image/): Add images with plain Markdown, then use one attribute line for a caption, a size, zoom, a link, a figure number or Hugo image processing.
- [Gallery](/docs/components/gallery/): Lay out a set of related screenshots as a responsive grid with a `gallery` fence, each with an optional description or link.
- [Video](/docs/components/video/): Embed product demos, screen recordings and muted loops that replace GIFs, and link YouTube, Bilibili or Vimeo talks without contacting the platform until a reader clicks.
- [Audio](/docs/components/audio/): Put a podcast episode, voice sample or recorded talk on a page with image syntax, as a titled native player with its transcript beside it.
- [Asciinema](/docs/components/asciinema/): Embed a .cast terminal recording that readers can play, pause and copy text from, with the player shipped in the theme.
- [Social](/docs/components/social/): Quote a post from X, Bluesky, Mastodon, or another platform with a `> [!SOCIAL]` callout. The page supplies the quote and attribution without a platform script, and plain Markdown viewers show an ordinary blockquote.
- [Component presentation](/docs/components/presentation/): Cards, disclosures, tabs, and compact procedures across OINK's four visual presets.

---

Backlinks:

- [Introducing OINK](/blog/oink-announcement/)
- [Components](/book/04-components/)
- [Ship](/book/10-ship/)
- [OINK Docs](/case/oink/)
- [Docs](/docs/)
- [Introduction](/docs/about/)
- [Highlights](/docs/about/features/)
- [Upgrade](/docs/admin/upgrade/)
- [Audio](/docs/components/audio/)
- [Presentation](/docs/components/presentation/)
- [Tables](/docs/components/table/)
- [Timeline](/docs/components/timeline/)
- [Components](/docs/design/components/)
- [Content components expansion](/docs/design/proposals/content-components-expansion/)
- [Authoring](/docs/write/)
- [Blog posts](/docs/write/blog/)
- [Writing pages](/docs/write/pages/)
- [OINK v0.2.0](/release/0.2.0/)
- [OINK v0.3.0](/release/0.3.0/)
