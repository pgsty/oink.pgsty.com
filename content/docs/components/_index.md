---
title: Components
linkTitle: Components
description: Pick the component that fits what you are writing and look up its shortest syntax, its form and whether it loads a script.
weight: 40
icon: fa-solid fa-cubes
search_keywords: [components, cheatsheet, Markdown syntax, shortcode, native form]
cascade:
  categories: [Components]
# The body's task map links every child page; the generated card list
# would repeat it. The Markdown output still lists the children.
no_list: true
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
`{{</* … */>}}`. *Runtime* says whether the reader's browser downloads a script
for it: **none**, **per page** (only on pages that use it), or **site switch**
(off until you enable it in `hugo.yml`, then per page).

### Writing & structure {#writing}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Callouts](/docs/components/callout/) | A prerequisite, warning or aside the reader must not miss | `> [!NOTE]` | native | none |
| [Code Blocks](/docs/components/code/) | Commands and source with a filename, exact copy, folding and line links | ```` ```sh ```` | fence | per page |
| [Tabs](/docs/components/tabs/) | The same instructions for several platforms or languages | attribute `{tab="Linux"}` | native + shortcode | per page |
| [Tables](/docs/components/table/) | Comparisons and matrices, full-width, captioned or numbered | `{.full-width}` | native | tabs or `.expand` only |
| [Fields](/docs/components/fields/) | Parameter lists with type, required and default chips | `{.fields meta="type default"}` | native + shortcode | none |
| [Steps](/docs/components/steps/) | A procedure the reader carries out in order | `{.steps}` | native + shortcode | none |
| [Badge](/docs/components/badge/) | A one- or two-word status beside a name, such as Beta | `{{</* badge text="Beta" */>}}` | shortcode | none |
| [Kbd](/docs/components/kbd/) | Key names and keyboard shortcuts | `{{</* kbd "Ctrl" "K" */>}}` | shortcode | none |
| [Includes](/docs/components/include/) | Reuse a file, print a site parameter, keep a note out of the output | `{{</* include file="parts/x.md" */>}}` | shortcode | none |
{.wide}

### Diagrams, charts & math {#diagrams}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Mermaid](/docs/components/mermaid/) | Flowcharts, sequence diagrams and Gantt charts drawn from text | ```` ```mermaid ```` | fence | per page |
| [PlantUML](/docs/components/plantuml/) | UML diagrams, rendered in the browser or by your own server | ```` ```plantuml ```` | fence | site switch |
| [Draw.io](/docs/components/drawio/) | Diagrams readers can open in the Draw.io editor; needs an editor address | `![alt](arch.drawio.svg)` | native | site switch |
| [ECharts](/docs/components/echarts/) | Bar, line and pie charts declared as data | ```` ```echarts ```` | fence | per page |
| [Infographic](/docs/components/infographic/) | AntV infographics that show order, hierarchy or comparison | ```` ```infographic ```` | fence | per page |
| [Markmap](/docs/components/markmap/) | A Markdown outline drawn as a mind map | ```` ```markmap ```` | fence | site switch |
| [FileTree](/docs/components/filetree/) | A directory layout with an aligned comment beside each entry | ```` ```filetree ```` | fence | per page |
| [Math](/docs/components/math/) | Inline and display formulas, rendered by KaTeX at build time | `$$ … $$` | native | none |
| [Maps](/docs/components/map/) | Places as a list, plus an interactive map when enabled | ```` ```map ```` | fence | site switch |
{.wide}

### Media & showcase {#media}

| Component | Use it for | Shortest form | Form | Runtime |
| --- | --- | --- | --- | --- |
| [Images](/docs/components/image/) | Screenshots and figures with captions, sizing, zoom and numbering | `![alt](oink.webp)` | native | site switch |
| [Gallery](/docs/components/gallery/) | A set of images browsed in one shared zoom dialog | ```` ```gallery ```` | fence | site switch |
| [Video](/docs/components/video/) | Video files, looping demos, YouTube and Bilibili cards | `![name](demo.mp4)` | native | per page; players need a site switch |
| [Audio](/docs/components/audio/) | Podcast episodes and voice samples in a titled player | `![name](episode.mp3)` | native | per page |
| [Asciinema](/docs/components/asciinema/) | Terminal sessions replayed as selectable text | `{{</* asciinema file="images/x.cast" */>}}` | shortcode | per page |
| [Social](/docs/components/social/) | Quote a social post without contacting its platform | ``> [!SOCIAL] Name `@handle` `` | native | none |
| [Cards](/docs/components/cards/) | A few parallel destinations for the reader to choose from | `{.cards}` | native + shortcode | none |
| [Timeline](/docs/components/timeline/) | Dated or ordered events on an axis | `{.timeline}` on a definition list | native | none |
| [Update](/docs/components/update/) | Changelog entries that stay headings in the table of contents | `## v1.7 {.update date="2026-11-28"}` | native | none |
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

- Write every shortcode as `{{</* name */>}}`. Only `{{%/* steps */%}}` uses
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
