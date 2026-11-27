---
title: Component contract
linkTitle: Components
description: The maintainer contract for OINK authoring primitives, validation, Book and release behavior, and output degradation.
weight: 20
icon: fa-solid fa-cubes-stacked
search_keywords: [OINK component contract, shortcode API, Markdown components, Book, release, validation]
contract_status: v1.6.0
---

> [!NOTE] OINK 1.6.0 contract
> This contract describes OINK v1.6.0.

The reader-facing [Components](/docs/components/) section provides tutorials and complete examples.
This page defines the API and behavior used by those guides.

## Authoring model {#authoring-model}

Use ordinary Markdown when one block with attributes can express the component.
Use shortcodes for compound bodies or information that Markdown cannot represent. There is no parallel component registry.
Native forms require:

```yaml
markup:
  goldmark:
    renderer: { unsafe: true }
    parser:
      wrapStandAloneImageWithinParagraph: false
      attribute: { block: true }
```

The native timeline also needs Goldmark definition lists (`markup.goldmark.extensions.definitionList`), which Hugo enables by default.

Only `{{%/* steps */%}}` uses percent delimiters because its body belongs to the page outline.
Other shortcodes use angle delimiters. Compound bodies use `content/render-block.html` with a unique ID scope.
Shortcode and component captions, labels, titles, and names are plain text. Put Markdown in bodies.
Landing narrative fields have their own contract. Icons use one Font Awesome class pair.
Components expose safe classes and attributes. They do not expose arbitrary colors or inline styles.

## Public API {#public-api}

OINK has 30 shortcodes:

- core: `tabs`, `tab`, `steps`, `cards`, `card`, `fields`, `field`, `include`,
  `kbd`, `badge`, `param`, `comment`, `contributors`, `asciinema`, `social`;
- Book: `fig`, `tbl`, `eq`, `eg`, `xref`, `book-toc`, `book-figures`,
  `book-tables`, `book-equations`, `book-examples`;
- release: `release-card`, `release-assets`, `download`;
- OpenAPI: `swagger`, `redoc`.

| Component | Native form | Shortcode form | HTML runtime |
| --- | --- | --- | --- |
| Callout | `> [!TYPE]`, fold, `{icon=}` | none | none |
| Tabs | adjacent fences/tables with `{tab= group= value=}` | `tabs` / `tab` | tabs on used pages |
| Steps | ordered list + `{.steps}` | `steps` | none |
| Cards | link list + `{.cards}` | `cards` / `card` | none |
| Fields | table + `{.fields}` | `fields` / `field` | none |
| FileTree | `filetree` data fence | none | divider only with comments |
| Gallery | `gallery` data fence | none | shared Image Zoom when eligible |
| Image | Markdown image + block attributes | none | Image Zoom when eligible |
| Table | attributes, caption, number, or tabs | `tbl` for compound Book tables | tabs when tabbed; reader with `.expand` |
| Book target | image/table/passthrough/fence + `{num=}` | `fig`, `tbl`, `eq`, `eg` | none |
| Release assets | `checksums` data fence | `release-assets` | copy in HTML |
| Math and chemistry | passthrough, `math`, `chem` fences | `eq` | none; build-time rendering and local styles |
| Diagram/data | `mermaid`, `plantuml`, `markmap`, `echarts`, `infographic` fences | none | selected local runtime only |
| Timeline | definition list + `{.timeline}` | none | none |
| Update | heading + `{.update date= tags=}` | none | none |
| Video | block image of a video file or platform URL + `{caption= poster= track= autoplay=}` | none | `media` for autoplay, enabled players, or 2+ players |
| Audio | block image of an audio file + `{caption= id= preload=}` | none | `media` when 2+ players on page |
| Social post | none | `social` | none |
| Map | `map` data fence | none | Leaflet only with complete `params.map` |

> [!NOTE] Unified diagram reading in OINK 1.4.0
> Mermaid and local PlantUML share pan/zoom, fit, source viewing/copy and standalone
> SVG download. Engines load and render only for measurable diagrams within 320px
> of the viewport. Each engine loads once; both render serially on the main thread.
> Hidden content waits until revealed, and obsolete theme results are discarded.
> The viewer reuses rendered results, retains reading position, and supports touch,
> keyboard, focus restoration and reduced motion. PlantUML retains Blob-image
> isolation: its SVG markup never enters the live DOM. Source is escaped exactly
> once, preserving arrows, quotes, ampersands and Chinese. Errors keep source
> without blocking subsequent diagrams. Copy/export failures show feedback;
> downloads report initiation only. Exports embed styling and reject external
> resource dependencies. Ordinary browser printing keeps light Mermaid and
> PlantUML pictures; dark Mermaid and unfinished diagrams use black-on-white
> wrapped source, ready without asynchronous print-time rendering. Source
> disclosures return to their reading state after printing; rendered results and
> preferences are preserved. Dedicated Print, Markdown and RSS retain source fallback. See
> [Mermaid](/docs/components/mermaid/#zoom) and [PlantUML](/docs/components/plantuml/).
> Explicit server mode retains its existing behavior.

> [!NOTE] Runtime behavior in OINK 1.6.0
> Markmap 1 renders SVG text, with local MathJax for formulas and notes for
> paragraphs, code and tables. Its renamed options warn instead of being silently
> accepted. Dedicated Print retains source; ordinary browser print keeps rendered
> SVG with black text. ReDoc 3 uses isolated local documents with telemetry off.
> Mermaid 12 retains the previous theme/layout/look defaults. See the
> [dependency contract](/docs/design/architecture/#unreleased-dependencies).
> The text/background tokens become `--mm-text` and `--mm-bg`. SVG links have
> accessible names; notes support keyboard opening and Escape with focus return.
> Open notes follow appearance changes and stay out of browser print. A failed
> note chunk restores that map's complete source and focus without affecting others.
> Note links use the article's link color and have an underline.
> Printing restores note focus afterwards, falling back to its marker if closed.
> Asciinema keeps a recording link until its player mounts, including with
> JavaScript disabled or an unavailable player bundle. Recording fetch/parse
> failures restore the link and any focus held by the player.

> [!NOTE] Unreleased
> Implemented on the theme's main branch after v1.6.0; no tagged release contains it yet.
>
> Asciinema `markers="time:label, …"` reaches the player as a list of
> `[time, label]` pairs with trimmed labels, the only shape besides bare
> numbers that asciinema-player 3.18 accepts. A label keeps its colons; a bare
> time gets an empty label. Earlier output spread the pairs into one flat list,
> which the player rejected, so any `markers` value left only the recording link.

## Optional component presentation {#component-refinement}

OINK 1.4.0 supports the following opt-in presentation variants. See the
[presentation examples](/docs/components/presentation/).

| Component | Native modifier | Full form |
| --- | --- | --- |
| Divided card list | `{.cards .td-cards-list}` | `cards variant="list"` |
| Compact steps | `{.steps .td-steps-compact}` | `steps variant="compact"`, with percent delimiters |
| Command strip | A one-line fence with `{class="td-code-command"}` | Existing code renderer; no new shortcode |

Unrecognized `variant` values warn and fall back to the default layout. A command strip with multiple lines, line numbers (including site defaults), or collapse warns and uses the regular block, preserving every source line. Existing `copy` and `wrap` policies still apply. No new runtime or component registry is introduced.

Native and full cards share surface and title rules. Only cards with links receive hover emphasis; secondary body links remain operable above a stretched title link. Tabs have transparent individual backgrounds at rest, a subtle hover fill on hover-capable devices, and a thin underline plus link color for selection. Labels keep the same weight and position between states; keyboard focus remains a distinct outline. Native disclosures retain an independently operable summary. Copy controls preserve their target geometry and existing success/error semantics. Coarse-pointer copy and tab controls have at least 44px height.

Preset colors and font roles remain authoritative. Ink/Terminal keep flat surfaces and square/2px geometry. Print, RSS, Markdown, and LLMS keep the content and their existing output semantics; presentation adds no hidden content or extra controls to static output.

Field names use unboxed, emphasized monospace text in all four presets, including Terminal, for both Markdown tables and full shortcodes.

## Validation {#validation}

Invalid author input follows the [architecture contract](/docs/design/architecture/).
Warn, then use the documented safe fallback or omit the component.
Do not combine named and positional forms.
Book target IDs match `[A-Za-z][A-Za-z0-9_.:-]*`. Book numbers match `[0-9A-Za-z.-]+`. Classes use token validation.
Hooks and shortcodes share one page target registry so collisions cannot produce duplicate output IDs.

URLs use `content/url.html`. Raw backslashes are invalid because browsers can interpret them as URL separators.
Images resolve through page resources, section resources, global assets, then static or explicit remote URLs.
Local rasters include intrinsic dimensions. SVG, static, and remote sources remain valid but cannot use Hugo image operations.
Resource metadata `alt` must be a string. Invalid values warn and are ignored, preserving authored alt text.

Empty `tabs` warn and emit no container in HTML, Print, Markdown, or RSS.
An `xref` without a usable target or with a missing target page preserves its
text without a link. If `fig` supplies both `caption` and `title`, the warning
and all outputs prefer `caption`.
Generic attributes on block mathematics do not enable Book numbering. Without
`num`, `id` and `caption` warn and are ignored; the formula stays unnumbered.

## Component behavior {#component-behavior}

### Callouts and tabs {#callouts-and-tabs}

Callout types are `note`, `tip`, `important`, `warning`, `caution`, `success`, `danger`, `question`, `example`, `quote`, and `details`.
`-` makes the callout initially collapsed. `+` makes it expanded.
Unknown types render as plain blockquotes, with their markers preserved and no JS.

Adjacent tabs group only when consecutive and of the same block kind.
`group` enables the hash `#<group>-<value>` and storage `td-tabs:v1:<group>`. Ungrouped tabs use neither.
In OINK 1.4.0, an initial fragment or `hashchange` targeting a panel
or a heading within it opens all ancestor panels from outside in before scrolling
to the target. Hash selection takes priority over saved preferences and
synchronizes named peers, but does not overwrite storage. Only explicit reader
selection persists; ordinary headings outside tabs retain native navigation.
HTML exposes all panels before JS. Print expands them. Markdown keeps authored source. RSS provides the rendered text summary.
Grouped tab IDs and local links remain unchanged in HTML and single-page Print.
Repeated groups and nested tab containers keep unique IDs within each page.
Multi-page section and whole-Book Print prefix generated tab container and panel IDs with the source page namespace and update their local links. Reusing a group across chapters must not send a tab link to another chapter. Cross-page links to ordinary HTML keep their destination.
Fragment rewriting accepts normal HTML attribute syntax and preserves text inside other attributes.
The full form supports arbitrary Markdown. `tab.label` is required. `value` is required exactly when the parent has `group`.
Orphan `tab` shortcodes warn and render nothing.

### Steps, cards, fields, and tables {#steps-cards-fields-and-tables}

Native steps accept ordinary block content. Use shortcodes only when steps must contain percent-delimited containers.
Native cards use link lists. The full form adds bodies, badges, icons, and images.
Native fields use the first column for names, the last for descriptions, and middle columns for metadata through `meta=` or headings.
The full form accepts block descriptions. Use `card` and `field` only within their parents.

Field anchors use `field-<name>`, with lowercase punctuation runs replaced by hyphens.
Thus `params.ui.typography` becomes `field-params-ui-typography`. Duplicate anchors get positional suffixes.

`field` accepts `id`, which replaces the generated anchor.
An empty value, a non-string, or a value holding whitespace, quotes, `<`, `>` or `&` warns and keeps the generated anchor.
This includes leading and trailing spaces and Unicode whitespace anywhere in the value.
So does an `id` that another field on the page already uses.
Each anchored field carries `data-td-search-entry` with its plain name, from the shortcode and from a `{.fields}` table alike.
[Local search](/docs/design/shell/#search-engine) records it as an entry of its page and opens it by name.

The table hook owns responsive wrapping and captions.
Captions have balanced inset spacing inside the frame, aligned with cell text;
an available corner action reserves space at the end of the inline caption.
`.matrix` makes the first
column row headers; `.full-width` widens the outer wrapper to the article width.
On screens, `.wide` opts technical tables into intrinsic sizing inside
that scrollable wrapper, preserving identifiers with `overflow-wrap: break-word`
and `word-break: normal`. Body cells have a soft `max-width: 40ch` bound so prose
wraps. Ordinary tables retain their existing layout. The modifier has no effect
on `.fields`, which renders a definition list, or on static and print output.
`.fields` cannot combine with matrix, full-width, numbering, or tabs; numbering
and tabs are also mutually exclusive.

> [!NOTE] `.wide` in OINK 1.4.0
> The short author marker retains the technical-table layout introduced in 1.3.1
> and compatibility with existing markup. It composes with `.matrix` and
> `.full-width`; Markdown preserves the authored marker.

### Table reading {#table-reading}

> [!NOTE] `.expand` in OINK 1.4.0
> Explicit opt-in for theme-rendered Markdown tables, independent of `.wide`.

Only `.expand` tables receive an HTML reader frame and load `table-reader.js`.
The runtime adds a direct top-right corner action, revealed on hover or keyboard
focus and visible on touch and in forced colors. It adds no above-table toolbar,
global setting, automatic size detection, or whole-table click handler.
`.fields .expand` warns and ignores expansion; layout markers, captions, numbering,
and tabs otherwise compose normally. Goldmark supports `{.wide .expand}` and
`{class="wide expand"}` with block attributes enabled and no intervening blank line.

One native modal moves the original table and scroll wrapper, keeping IDs, links,
selection, text size, row order, and native table semantics. Its title receives
initial focus; Tab stays inside; Escape and Close restore the original nodes,
inline/page scroll positions, and entry focus. Coordinated closes suppress focus
return. Plain captions remain native; numbered captions name the dialog and any
otherwise unnamed table while open. Single-row headers stick inside the viewport;
`.matrix` retains its existing row headers and pinned first column. There are no
sorting, filtering, density, export, or virtualization controls.

Missing JavaScript, blocked assets, or unsupported dialogs leave readable inline
content with no dead entry. Tables with references outside their movable subtree
stay inline; same-page links to outside targets restore the table before navigation.
Before browser printing, restoration is synchronous. Dedicated Print, RSS, Markdown,
and LLMS keep their existing content boundaries without reader UI/runtime. The
[accepted decision](/docs/design/decisions/large-table-reading/) records the rationale.

### Images, Gallery, FileTree, and fences {#images-gallery-filetree-and-fences}

The Markdown image hook is the ordinary image API. Inline images stay inline. Block images become figures with `caption` or `num`.
Only the native form supports image processing.
The full `fig` source form is a numbered container and deliberately excludes `command`/`options`.
For processed numbered images, use native block images with `num`.
Allowed image attributes are `id`, `num`, `caption`, `width`, `height`, `link`, `command`, and `options`, plus shared safe attributes.
`command` and `options` must appear together. They use Hugo `Fit`, `Resize`, `Fill`, or `Crop` on processable local resources.
Plain linked images use Markdown syntax. The `link` attribute therefore requires a caption or number.
Linked and decorative images do not load Zoom.

Zoom triggers keep image alt text and the localized preview action in their ARIA accessible name.
They insert no helper text into articles.
Plain-text or rich-HTML copying must not add preview instructions, even if the editor removes theme styles.
Authored images and captions remain intact.
When Draw.io and Image Zoom share an image, Edit and Zoom remain separate sibling buttons.
The editor control supports keyboards and stays visible on touch devices and in forced-colors mode.
The Draw.io editor opens in a modal dialog with a localized host Close button. The button, backdrop, editor exit message, and Escape while focus is in the host dialog dismiss it, release its message listener, and restore focus to Edit. Cross-origin iframe keystrokes belong to the editor and cannot bubble to the host; users can leave the editor's Tab sequence to reach the host Close button. Opening another editor starts a fresh session.

Gallery accepts one Markdown image per line with optional description, link,
and class. FileTree accepts indentation, `- name`, optional `/`, comments, and
validated icon/tone/open/type attributes. FileTree fence `wrap` accepts `true`
or `false`, defaults to `false`, and changes only screen comment layout: `true`
wraps comments, including unbroken tokens, while rows grow from their existing
minimum height. Filenames retain ellipsis. Missing or false values preserve
compact desktop/tablet rows; mobile stacking, divider controls, directory
folding, and expanded Print output keep their existing behavior. Invalid values
warn and fall back to false. Markdown
preserves explicit wrap values and tree source; Print renders expanded static
figures and trees.

All code highlighting uses Chroma.
Common fence attributes include `title`, `copy`, `wrap`, `collapse`, `label`, `id`, line options, tabs, and Book `num`/`caption`.
Copy returns authored source.
Mermaid palettes follow light/dark mode, independently of visual preset. The default dark edge-label background is `#404040` for AA contrast with its label text; explicit `params.mermaid.themeVariables` values retain priority.

ECharts uses declarative JSON/YAML. Callbacks use `$fn:<name>` from `window.OinkEchartsFunctions`. Embedded scripts are never executed.

> [!NOTE] Unreleased
> Implemented on the theme's main branch after v1.6.0; no tagged release contains it yet.
>
> A fence `theme` other than ECharts' built-in `dark` names an entry of
> `window.OinkEchartsThemes`, an object of theme name to ECharts theme object.
> The engine loads only when a chart comes due, so a site script has no
> moment to call `echarts.registerTheme()`; the runtime registers every object
> entry immediately before each chart initializes and ignores other values.
> This registry is the supported registration point. An entry named `dark`
> also replaces the palette that unpinned charts use in dark mode, and an
> undefined name draws with ECharts' defaults without a warning.

In OINK 1.4.0, Infographic SVGs scale with their container width,
including orientation and shell layout changes, without repeated DSL rendering.
Initially hidden containers wait until measurable. Fence `height` and `full`
keep their existing meanings.
Transparent Infographic output receives a white canvas; an explicit DSL background
sets the canvas instead. Site light/dark changes leave authored `light`, `dark`,
`hand-drawn`, palettes, and SVG styles intact. The default dark text therefore
remains readable without recoloring author content. Authors remain responsible for
contrast when explicitly choosing transparent backgrounds or custom text colors.

Markmap node text on screens follows the article text color (`--bs-body-color`)
via `--markmap-text-color`, dynamically adapting to light/dark mode changes,
style presets, and restored user preferences to maintain contrast. Printing
retains Markmap's default dark text on the white canvas. This mapping is scoped
to article content across both the wrapper and generated SVG, and can still be
overridden by site CSS of equal specificity or SVG inline tokens. (Added in OINK 1.3.1.)

In OINK 1.4.0, Markmap fits on first measurable display and container
resize, including hidden panels when revealed. Reader pan/zoom suspends automatic
fitting so layout changes preserve their view. The keyboard-accessible **Fit to
window** button restores the whole map and resumes automatic fitting. Layout fits
do not animate; reduced motion also disables node transitions. The control is
omitted from print. Source normalization removes surrounding blank lines and
common indentation before parsing, preserving YAML options and outline levels.

Mathematics uses Hugo's build-time KaTeX output and local CSS, without a browser mathematics runtime.
HTML and Print use the vendored stylesheet and preserve MathML and authored TeX.
Validate mathematics with a Hugo release that meets the minimum in the [architecture contract](/docs/design/architecture/#hugo-toolchain).
OINK 1.6.0 renders Markmap formulas on demand with local MathJax (1.5.1 and
older used KaTeX inside Markmap).
In OINK 1.4.0, numbered equations reserve readable formula space based
on the available column width, including columns narrowed by a sidebar or TOC.
Captions move below the formula when they do not fit beside it; long words wrap.
Number-only captions, MathML, and TeX remain available. Print gives the formula
the full reading width and places the caption below it. Long captions must
neither squeeze the formula to zero nor widen the page.

Swagger and Redoc accept HTTP(S) specification URLs or paths rooted under `static/`. Neither resolves page resources.
Redoc handles paths with or without leading slashes identically and joins local paths to `baseURL`.
Only HTML is interactive. Print, Markdown, and RSS provide static specification links.

### Timeline, updates, media, social posts, and maps {#timeline-media-social-and-maps}

> [!NOTE] Unreleased
> Implemented on the theme's main branch after v1.6.0; no tagged release contains it yet.

A definition list followed by `{.timeline}` is a timeline: terms are markers in free text, definitions are events with block content.
Goldmark emits the `<dl>`; the theme adds only CSS scoped to `.td-content dl.timeline`, with a marker column on wide screens and one column on narrow viewports or inside `.td-content-card` containers.
Hollow nodes read `--td-timeline-surface` so they blend with callouts, cards and tab panels, and the rail uses `--td-brand-line-strong` for consistency with the Landing timeline.
Print maps the timeline to the paper palette tokens (`--td-print-ink`, `--td-print-meta`, `--td-print-table-line`, `--td-print-quote-line`) regardless of screen color mode and avoids page breaks inside definitions.
Build-time checks in `content/check-timeline.html` warn with the page path when `{.timeline}` is detached by a blank line, lands on a non-`<dl>` block (including when `definitionList` is disabled), or when a callout header is swallowed into `<dl><dt>`; `bin/check-site-markup.py` validates `markup.goldmark.extensions.definitionList: true`.
Because Hugo has no `<dl>` render hook, attributes on `<dl class="timeline">` (like `.steps`) rely on Goldmark's default filtering, which strips `on*` handlers but passes `style`.

A heading marked `{.update}` is a changelog entry. It also accepts string `date` (`YYYY`, `YYYY-MM` or valid calendar `YYYY-MM-DD`, rendered as `<time datetime>`) and string `tags` (comma-separated plain text accepting `,` and `，`, rendered as neutral chips).
The heading itself is unchanged, so its TOC entry, anchor, search section and Print ID behave as for any heading; a `td-update-meta` line follows it with `<span class="td-update-sep">, </span>` separators between items. The line is inline flow, not flex, and the separators are in-flow text set to `font-size: 0` without `user-select: none`, so plain-text copy in Chromium, Firefox and WebKit, offline search (`offline_search_index: content`), RSS readers and the accessibility tree all keep tokens distinct; flex items are blockified and broke or glued the copied text.
Invalid calendar dates and non-string `date` or `tags` values warn with the page path and are dropped while keeping the heading and any remaining valid metadata; `date` and `tags` without the marker are unknown attributes.
Goldmark gives every heading an `id` attribute, so `render-heading.html` takes a fast path, skipping the attribute partials, when that id is the only attribute; its output is byte-identical to the full path.
Update styles live in `assets/css/td/update.css`, using `:has(+ .td-update-meta)` and the items' own block margins instead of negative margins, mapping print rules to `--td-print-*` tokens regardless of screen color mode, and suppressing `h2.update` bottom rules in print; `rich-copy.js` formats `.td-update-meta` as separated metadata on the paper palette.

A block image whose destination is a video or audio file, or a YouTube, Bilibili or Vimeo URL, is media (`content/media.html`).
Files are recognized by the Hugo media type of a resolved resource, otherwise by extension; resolved local resources preserve query strings and fragments (such as `#t=30,60`). Images, the warning for other non-image resources, and the lookup order are unchanged; `content/resource-lookup.html` now holds that order for both resolvers.
Video accepts `caption`, `num` (a Book `fig` target), `id`, `poster`, `track` (one WebVTT file in the page language; local resources preserve query strings, and a remote `track` URL sets `crossorigin="anonymous"` on `<video>`), `autoplay`, `width` and `height` (required as a positive-integer pair; sets the box aspect ratio without replacing the poster `<img>`'s intrinsic dimensions). Audio accepts `caption`, `id` and `preload` (`metadata` or `none`; the first six audio players on a page default to `metadata` and the seventh onward to `none`, an `id` that another unnumbered audio or video figure or a numbered Book target already uses warns and is dropped from whichever comes second, in either order; heading and plain image IDs are not compared). Audio figures omit `.td-figure`, display bracket text as a visible title, and bind `<audio>` via `aria-labelledby` (and `aria-describedby` when captioned), with generated IDs scope-rewritten inside `content/render-block.html`.
`autoplay=true` emits `muted loop playsinline` without the `autoplay` attribute; `js/chunks/media.js` plays the video while at least half of it is visible, never under reduced motion, and pauses it off-screen. Native controls remain. On pages with two or more `<audio>` or `<video>` players, `js/chunks/media.js` also enforces single-active playback: a player that becomes audible, by starting with sound or by being unmuted while it plays (`play` and `volumechange`, both in the capture phase), pauses every other audible player, and opening an enabled platform card silences audible local players before mounting the iframe. Muted or zero-volume players, including autoplay loops and authors' own muted loops, neither interrupt nor get interrupted, and cross-origin platform iframes cannot be paused by local players later. A page with a single audio player loads no script.
A platform URL renders a link card (YouTube `/shorts/` defaults to `9:16` when no poster or size is given; empty platform names fall back to the watch URL; Draw.io skips images inside `a.td-media-card` and still probes other linked images). The card carries its ratio as `--td-media-ratio`; `media.css` derives the box ratio and a `min(100%, 80vh × ratio)` width cap from it for the card and the player that replaces it, and where container units exist the ratio is a minimum height measured from the figure, so a wrapped title grows the card in every engine. For platforms listed in `params.video_embeds`, a plain click loads a sandboxed player iframe (`allow="autoplay; picture-in-picture; fullscreen"`, `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`) whose URL the theme derived from validated IDs (`youtube-nocookie.com`, Bilibili with `danmaku=0`, Vimeo with `dnt=1`, supporting `youtube-nocookie.com`, `music.youtube.com`, `player.vimeo.com`, Vimeo `?h=`/`#t=`, `b23.tv/BV…`, Bilibili embed-code `player.bilibili.com/player.html?bvid=…|aid=…`, and decimal leading-zero timestamps); nothing is requested earlier.
Inline media render as links. Dedicated Print receives static figures with visible `.td-media__link` URLs (including platform watch URLs); browser printing of the HTML page reveals the screen-hidden `.td-media__url` line instead, with paper-palette resets in `@media print` regardless of screen theme and a fallback that survives iframe replacement; RSS renders video/platform static figures (with watch URLs and true poster dimensions) and links the audio title directly to the absolute file URL; Markdown keeps the authored line; `rich-copy.js` keeps start alignment and the clickable recording URL (avoiding duplicate links on unclicked platform cards while keeping the fallback URL after click). Media figures without `.td-figure` keep 1.5rem/1.75rem margins through `:where(.td-media):not(.td-figure)`, one class of weight above Bootstrap's `figure` reset. Consecutive audio figures (16px apart) and an immediately following `.td-callout--details` transcript (8px) use `:has()` positive margins so each audio-transcript pair groups visually tighter than adjacent pairs (24px).

`social` quotes a post from the page alone, with `author`, `handle`, `avatar`, `date`, `url` and `platform` (`x` by default on top-level cards, `none` by default when nested, plus `bluesky`, `mastodon`, `threads`, `weibo`, `zhihu`, `telegram`, `linkedin`; it selects the icon and the platform name announced to assistive technology and written into Markdown and RSS, and omitting it on a nested quote omits both icon and hidden platform label while an explicit nested `platform` renders both).
Parameters validate string types and reject unknown/positional keys; `avatar` passes `parameter="avatar"` through `content/image-resolve.html` and, when the project's own `static/` directory exists, warns offline with the suppressible ID `social:avatar-static` when the decoded, cleaned static path is missing there (module mounts and a custom `staticDir` are not visible to the check); a static path that climbs above the site root with `..` always warns. Missing avatars draw the first grapheme cluster after leading `@`, Unicode spaces, controls and invisible format characters are stripped (or a user icon when nothing remains).
`date` emits `<time datetime>` only for `YYYY-MM`, or `YYYY-MM-DD` with an optional `HH:MM[:SS]` and optional `Z` or `±HH:MM`, on a real calendar day, and `<span class="td-social__date">` otherwise; `url` adds `rel="external"` only for external schemes.
The body is Markdown, so images, a `gallery` fence (in a compact card grid matching the active preset's radius) and a nested `social` (warning deeper than one level) compose in it; HTML isolates LTR handles and ISO timestamps under RTL, maps `@media print` to `--td-print-*` tokens regardless of screen color mode, and adds author context to the original-post link.
Markdown renders a blockquote using context-aware inline escaping (`content/markdown-escape-inline.html`) and inline-code handles, and ends it with a blank line so adjacent cards stay separate quotations; RSS omits empty `<blockquote>` on link-only cards and absolutizes internal URLs.
Without `author` and `handle`, a body renders as a plain blockquote whose `url` survives only as `cite` (omitted from Markdown) while `date`, `platform` and `avatar` are ignored (and an empty body with `url` renders a blockquote link in every output with one warning); without a body or `url`, nothing renders. Hugo's embedded `x` shortcode is not overridden.

A `map` fence holds a YAML or JSON list of places (`name`, `lat`, `lng`, `text`, `image`, `link`), parsed as YAML by name rather than by content sniffing. Its attributes are `caption`, `route`, `zoom` (whole number 1–22 without leading zeros), `height`, `id` and the adjacent-tab keys.
Every output renders the numbered place list with space-separated LTR-isolated OpenStreetMap coordinate links (decimal formatted without scientific notation), `rel="external"` on external place links, and decorative thumbnails placed after the place text in DOM order; non-string `name` or `text` fields warn instead of stringifying. When `params.map` is complete (`tiles` accepting `{s}`, `{r}` and `{-y}` and warning on any other placeholder, which Leaflet would throw on, required plain-text `attribution`, plus optional `attribution_url`, `dark_tiles`, `subdomains`, `max_zoom` 1–22 without leading zeros, and `loading: lazy | click`), HTML adds a canvas and the validated places as JSON; `content-components.js` (deferring until `DOMContentLoaded` after `tabs.js` hides inactive panels) loads the vendored Leaflet engine and stylesheet only on those pages.
The map keeps scroll-wheel zoom off, starts with drag off because Leaflet reports touch on every Pointer Events browser and turns it on for a mouse or pen and off for a finger so one-finger page scrolling is never trapped, yields `keyboard-nav.js` single-key shortcuts while focused inside the canvas, respects `prefers-reduced-motion`, frames multi-place fences with explicit `zoom` via a single `setView` on the bounding-box center to avoid a wasted tile wave, uses numbered HTML markers with `aria-label` names, builds popups and optional linked attribution via DOM APIs (`textContent`, validating `href` schemes and setting `rel="external"` on external place links), moves focus into a popup opened with `Enter` and returns it to the marker when `Escape` or the close button closes the popup, pans to a place when its list entry is clicked, dims light tiles gently in dark mode without inverting colors, falls back to those dimmed light tiles when every dark tile fails, and hides the canvas if Leaflet or all light tiles fail, removing the Leaflet map only after Leaflet finishes dispatching the failing layer's `load`. Under `loading: click` the load button names every host the map may contact (`{s}` as `*`, the `dark_tiles` host included, isolated left-to-right) and, activated from the keyboard, hands focus to the mounted map. Invalid places (including `NaN`/`Inf` coordinates) warn and are skipped; browser print hides the canvas and uses print ink tokens, and `rich-copy.js` omits the canvas, aligns map and social figures to start, drops decorative social avatars, and places map thumbnails on their own line.

### Book {#book}

The `book` type extends the docs shell and follows the content tree or `data/docs_nav.json`.
`book_number`, `book_part`, `book_kind`, and `book_status` are presentation metadata. They do not change Hugo publication state.

Numbered kinds are `fig`, `tbl`, `eq`, and `eg`. Their default ID is `<kind>-<num>`.
`eg` requires a caption. `eq` without `num` is an unnumbered display formula.
`xref` names exactly one kind with optional `page`/`anchor`, or an anchor with explicit text.
Numbered examples have one framed body and caption.

Footnotes belong to the page document. Native numbered tables and fences keep them there.
Shortcode bodies are separate Goldmark documents, so footnote references in `tbl`, `eg`, `fig`, `card`, `tab`, `field`, or `include` warn and remain literal.
The check ignores text that has code syntax.

`book-toc` follows navigation order at depth 1–3. Each of the four `book-*` indexes collects one target kind.
Single-page Print keeps ordinary heading, footnote, and tab IDs exactly as regular HTML renders them.
Multi-page section and whole-Book Print rewrite cross-page links and namespace page-local headings, footnotes, and generated tab IDs to prevent collisions.
Local heading links match after one URL-fragment decoding step, so ordinary Markdown links to Unicode headings retain their target in an aggregate.
Each numbered figure, table, equation and example keeps its ID in chapter HTML, single-page Print and whole-Book Print, including targets inside shortcode bodies. If two definitions on the same page use the same ID, the build warns and the first definition keeps it.
Consumers opt into these potentially expensive aggregate outputs.
Consumer-authored raw HTML anchors and custom shortcode IDs remain global by default.
Add the boolean `data-td-print-local` attribute to an element with an `id` to declare a page-local anchor.
An aggregate namespaces that ID and its same-page links; ordinary HTML and single-page Print retain the original ID.
This lets legacy aliases and custom shortcode headings keep their existing deep links while remaining unique across aggregated chapters.
Unmarked authored IDs must remain unique within their aggregate.

### Release and download {#release-and-download}

Release front matter uses one `release_url` matching `https://github.com/<owner>/<repo>/releases/tag/<tag>`.
The URL supplies owner, project, and tag. The page supplies the date. No remote release state is fetched.
Removed `release`, `release_products`, and `release_group_by_product` warn with their replacements. They provide no compatibility path.
The section index lists every page. It uses parsed `project tag` when available, otherwise the page title.
For `layout: releases`, HTML keeps this release index; section Print aggregates the full release bodies with chapter-local IDs, in both development and production builds.

Checksums accept canonical lines or one source resource, never both. Filenames cannot be paths.
HTML adds local copying. Static outputs show complete hashes.

Downloads use `data/download/<key>.yaml`. Channels are `rolling` or `pinned`.
Only pinned URLs and commands interpolate `${version}` and `${tag}`.
Before publication, rolling channels remain usable, while pinned channels show pending.
Markdown renders the complete channel list. RSS omits the component.

Switching tabs remeasures collapsible code blocks in the newly visible panel.
Their expand and collapse controls remain usable after fonts settle and when
`ResizeObserver` is unavailable.

## Verification {#verification}

The [architecture contract](/docs/design/architecture/) defines shared output rules. Component-specific exceptions appear above.
Markdown and RSS set no browser runtime flags. Print keeps only flags required by rendered print features.
Source checks cover parameters, hook policy, runtime isolation, and migration.
Output checks compare HTML, print, Markdown, RSS, and LLMS goldens. Browser tests cover interactive features.
See the [migration contract](/docs/design/migration/) for migration rules.

## v1.5.1 review corrections {#unreleased-review-corrections}

The following corrections shipped in v1.5.1 and are part of the current consumer contract.

- Named-parameter shortcodes reject positional arguments with warnings and
  continue the ordinary build. Invalid input checks require a successful build
  and verify the safe output, rather than accepting either exit status.
- Invalid or missing Book numbers retain unnumbered readable content, without
  empty `fig-`, `tbl-`, `eg-`, or `eq-` targets or figure-index registration.
- Generated IDs include the complete shortcode ancestry. Independently rendered
  Markdown bodies namespace generated code, chart, FileTree, and field IDs along
  with their references; authored code IDs remain intact.
- RSS renders static HTML for Book figures, tables, equations, examples, links,
  contributors, specification links, recordings, and checksum tables. It does
  not expose their Markdown source or browser controls. Release assets retain
  their documented RSS omission. The RSS check uses the ordinary section feed.
- Copy feedback uses `aria-disabled` with an operation guard, preserving keyboard
  focus while preventing duplicate clipboard writes.
