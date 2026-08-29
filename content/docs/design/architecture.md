---
title: Architecture contract
linkTitle: Architecture
description: Repository assembly, configuration, diagnostics, output, performance, security, CSS, accessibility, and release-state boundaries.
weight: 10
icon: fa-solid fa-sitemap
search_keywords: [OINK architecture, repository boundary, runtime, output formats, security, accessibility, performance]
contract_status: released-v0.8.1
---

> [!IMPORTANT] OINK 0.8.1 contract
> This is the architecture contract released with OINK 0.8.1. This page is the
> canonical English source; its Chinese peer is maintained beside it in
> `content/docs/design/`.

## Repository and assembly {#repository-and-assembly}

The repository root is a Hugo Module and complete theme, not a site or npm
workspace. Hugo Extended compiles SCSS and templates. Browser runtimes and
third-party assets are committed, so a normal build performs no network fetch.
Public bilingual documentation, examples, and browser tests live in the
sibling `oink.pgsty.com` repository; the theme repository keeps only narrow
internal regression fixtures under `tests/site/` and has no separate public
example surface.

Generated `public/` and `resources/` trees are never source. Vendored runtimes,
font families, and Font Awesome glyph definitions are supported distributions,
not dead-code candidates; `VENDOR.json` and `bin/check-vendor.py` pin their
integrity. OINK ships the complete supported Font Awesome distribution because
consumer-authored content may use icons that theme templates do not.

The official compiled Font Awesome CSS is one stable, fingerprinted vendor
stylesheet loaded before the fingerprinted `main.css` produced from theme and
consumer SCSS. A site-style edit therefore does not invalidate the icon
distribution, while ordinary cascade order still lets the site override it.
Capability styles such as KaTeX, DocSearch, Swagger, and Asciinema remain
separate and load only when used. Fingerprints make immutable URLs possible;
the deployment host, not the Hugo theme, owns their HTTP cache headers.

Hugo types `docs`, `book`, `blog`, and `swagger` select the reading shells;
`params.ui.shell_types` may add types. Landing is `layout: landing`. There is no
`article` type or second blog shell: immersive pages are a blog presentation
described in the [shell contract](/docs/design/shell/).

`layouts/_partials/shell/config.html` resolves shared shell facts. Layouts must
render through `content/render.html` before `scripts.html`, because render hooks
and shortcodes register capability flags in the Page Store. Override the
narrowest partial; superficially similar base templates remain separate where
merging would change Hugo lookup precedence.

## Configuration and diagnostics {#configuration-and-diagnostics}

Theme policy lives under `params.ui.*`; multi-setting integrations such as
`comments.giscus`, `plantuml`, and `drawio` stay top-level. Boolean features use
bare booleans unless they also have several settings. A page override drops the
`ui.` prefix: `params.ui.image_zoom` becomes `image_zoom`, never a front-matter
`ui` map. `hugo.yaml` declares published defaults; an owning resolver and its
checker define any optional configuration shape or range.

Invalid input follows one rule: warn with the value, allowed shape, and safe
fallback; then use that fallback or omit the unsafe feature. Ordinary
`hugo server` therefore remains usable, while every publishing gate uses
`--panicOnWarning`. The theme never calls `errorf`, and `check-params.py`
enforces that boundary. Do not add speculative validation for unreachable
states.

There is no generic renamed-key registry. A transition that still needs a
migration diagnostic uses a targeted warning in its owning resolver plus a
strict negative test; removed keys are never read as a compatibility path.

Network-capable features are explicit and degrade closed. PlantUML requires
`plantuml.svg_image_url`, Draw.io requires `drawio.drawio_server`, and Algolia
requires `appId`, `apiKey`, and `indexName`; incomplete configuration warns and
emits no request. Draw.io loads only when rendered content contains PNG or SVG
candidates, then inspects each distinct image URL once.

## Featured images {#featured-images}

Hugo's `images` is the single authored API; `params.images` is only the
site-wide social fallback.

| Source | Reader thumbnail | Social card |
| --- | --- | --- |
| Page `images`, or bundled `**featured*`, `*feature*`, `{*cover*,*thumbnail*}` | yes | yes |
| Section `cascade.images` | yes | yes |
| Site `params.images` | no | yes |

`images: []` clears an explicit or cascaded value but does not disable bundled
resource discovery. Only the first resolved image is representative. Local
processable rasters may be cropped; SVG, static, and remote resources remain
valid without Hugo image operations.

`featured-image-resolve.html` owns source ranking and relative/absolute URLs.
A page's bundled resource outranks an inherited cascade image. List thumbnails,
Open Graph/Twitter/schema helpers, author avatars, Pinterest media, and blog
presentation all consume that decision.

`params.ui.featured_image` is blog-only and defaults to `none`; front matter
overrides it per page or cascade. `banner` renders a figure above a single-page
title, `wash` colors its header, and `hero` paints the shell backdrop on single
pages and section indexes. Missing images and non-HTML output render no image.

## Outputs and runtime {#outputs-and-runtime}

Every base template sets `Page.Store.tdOutputFormat`:

| Output | Contract |
| --- | --- |
| HTML | Complete semantic content; local runtime only for used capabilities |
| Print | Expanded content; no shell navigation, search, or zoom runtime; the shared action layer supports explicit print controls |
| Markdown / LLMS | Source-shaped Markdown without `td-` component markup |
| LLMSFULL | Opt-in per top-level section: one `llms-full.txt` per enabled section per language, that same Markdown concatenated in reading order |
| RSS | Safe static summary or explicit omission |
| NAVJSON | Opt-in per site: one `navigation.json` per language, serializing the navigation authority the sidebar and pager already read |
| BookManifest | Opt-in ordered JSON handoff for a publication packager; never presented as an EPUB or PDF |

Consumers opt into custom outputs; OINK does not force expensive Book
aggregates. HTML gets the shared action and core layers plus stable first-party
capability chunks selected by the page flags. Templated capabilities publish at
most one chunk per language; flags choose script tags and never create a new
combination bundle. Print keeps the action layer and only runtimes required by
rendered print features. Large third-party UMD files stay separate; unused
feature runtimes stay absent.

`LLMSFULL` is enabled by a top-level section listing it in its `_index` front
matter `outputs`; the theme never adds it to a site's output set. One shared
renderer produces the per-page Markdown and the bundle, so a bundle is that same
semantic Markdown -- no `td-` component markup -- concatenated in the sidebar and
pager reading order. Enabling it below the top level warns and emits nothing, so
an ordinary build stays usable while `--panicOnWarning` blocks publication.

`NAVJSON` is enabled by the site's `outputs.home` and publishes one
`navigation.json` per language at the language root. It serializes the same
authority chain the sidebar and pager read: an explicit `data/docs_nav.json`
tree when present, the weighted content tree otherwise. Array order is the
contract and `weight` is never serialized, and the output is `notAlternative`.
`schema/nav.v1.schema.json` versions the format as a hand-authored contract
artifact, edited with its templates and checker rather than by the generated
configuration schemas' drift gate. Both outputs default off, so a site that
enables neither builds byte-identically; `bin/check-agent-indexes.py` owns them.

`BookManifest` is disabled unless a Book root explicitly lists it in `outputs`.
It references that Book's existing per-page Markdown and records derived page
order, headings, numbered targets, and xrefs. It contains no publication
metadata guessed by the theme and is not a distributable ebook.

The theme repository ships `bin/book-epub.py` and `bin/book-pdf.py` as explicit
publication steps, with `bin/check-book-epub.py` and `bin/check-book-pdf.py` as
their artifact gates. The EPUB packager combines `BookManifest` with the same
whole-Book Print HTML and accepts consumer metadata separately. The PDF runner
serves that Print output only on a temporary loopback address, invokes an
explicit Chrome/Chromium binary behind a `script-src 'none'` Content Security
Policy, and emits A4 pages with CSS page numbers.
Both tools refuse missing or out-of-tree resources; network resources and
output replacement each require a separate explicit flag. The network opt-in
allows passive HTTP(S) media only; remote scripts and local-file schemes remain
invalid. Relative assets in the EPUB metadata file resolve from that file's
directory, not from the caller's working directory. No publication work runs
during an ordinary Hugo build, and PDF remains Print-derived rather than
another template output.

Performance rules:

- do not walk `.Site.Pages` per page when a site-level resource or
  `partialCached` result can own the work;
- render `.Content` once and read Page Store flags only after it;
- emit correct markup instead of scanning the DOM to repair it;
- group browser work by resource URL, not DOM instance;
- keep ordinary outputs opt-in when their aggregate cost is material;
- emit no Speculation Rules by default: a named production consumer must first
  measure `Sec-Purpose: prefetch` requests, useful navigations, transferred
  bytes, and CSP impact with a reversible `moderate` experiment;
- validate reachable author input, not hypothetical internal states.

`bin/measure-baseline.py` measures build time, output weight, bundle count, and
shortcode density. `bin/sites/build-all.py` builds maintained consumers in
isolated snapshots.

## Trust, CSS, and accessibility {#trust-css-and-accessibility}

Authors may enable Goldmark `unsafe`; configuration and component parameters
are not raw HTML. The shared attribute policy consumes an allowlist, validates
class tokens, passes `data-*` and `aria-*`, and warns while dropping `style`,
`srcdoc`, `on*`, reserved, and unknown attributes. URL helpers reject dangerous
schemes and protocol-relative URLs where local or explicit absolute URLs are
required. Promised remote URLs remain supported but are never fetched at build
time.

Theme output uses `td-` classes, `data-td-*` attributes, and `--td-*` custom
properties; author markers such as `.steps`, `.cards`, and `.full-width` stay
unprefixed. CSS supports RTL, print, forced colors, reduced motion, long tokens,
and narrow viewports. Theme-owned decorative icons carry `aria-hidden`; pages
with task lists or raw authored Font Awesome elements alone load the authored
accessibility repair.

Font roles are `ui`, `body`, `heading`, `code`, `display`, `meta`, and
`print`, exposed as `--td-*-font-family`. `ui` is the main face: `body`
resolves through it, and `heading` through `body`, so one assignment moves
chrome, prose, and headings together. `params.ui.typography` is `technical` or
`system`; both compile into one stylesheet with no runtime. Legacy
Bootstrap/Docsy Sass variables continue to seed these roles.

`params.ui.fonts` reaches the same roles from configuration, for a site that
would rather not mount SCSS or add a stylesheet. It names faces and never
loads them: a family must be one the reader has or one the site declared in an
`@font-face` of its own, which keeps the key outside the network contract.
Values are gated to plain font family syntax and the emitted `:root` block is
rebuilt from the matched parts; an unknown role or an unsafe value warns and is
dropped alone. The block renders after the stylesheet, which is what lets an
authored face outrank the preset at equal specificity. A shell reads in the
site's faces and owns none of its own: a Book sets its numbers and captions in
the prose face, not in a technical one.

The accent family splits by role. Accent *text* -- links, external URLs, inline
code -- follows the Bootstrap link family and `--bs-code-color`, which a theme
color never redeclares; inline code is a fixed crimson pair so a page dense in
identifiers reads as code and prose rather than code and links. Accent
*grounds* -- selected rows, the greyed ground a navigation row takes under the
pointer, hover washes, the outline pill, rail and dot, chip hovers, a card's
hovered edge, a share button's hover fill, selection, focus rings -- follow
`--td-accent`, `--td-accent-rgb` and `--td-accent-hover`, which default to the
link family and are the only properties `params.ui.theme_color` emits. Ink that
belongs to the shell rather than to the prose follows them too: the outline
anchors the viewport is standing over, and a Book chapter's headings under the
pointer or keyboard focus, light in the section's color, not in the link blue.
`theme_color` and `theme_color_dark` take `#rgb`/`#rrggbb`; front matter and
section cascades override the site value. An unconfigured site emits nothing.
An unparseable value warns and keeps the default palette. A resolved color below 4.5:1 against the theme's own
canvas warns with a suppressible id and still ships: the check is advisory, and
only a parse failure drops a color. The light color is the key: a
`theme_color_dark` with no valid `theme_color` warns and is ignored, so a page
is colored in both modes or in neither. An omitted dark half lightens toward
white in 4% steps until it clears 4.5:1 on the dark canvas. Every emitted byte is
formatted from parsed integer channels, never from author text. One resolver
answers "what color is this page" for the head block and the sidebar root
switcher alike.

## Release states {#release-states}

Source complete, locally validated, committed, tagged, pushed, pinned by a
consumer, deployed, and production-identical are distinct states. A local Hugo
build proves only local validation.
