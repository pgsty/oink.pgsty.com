---
title: Architecture contract
linkTitle: Architecture
description: Repository assembly, configuration, diagnostics, localization, output, performance, security, CSS, accessibility, and release-state boundaries.
weight: 10
icon: fa-solid fa-sitemap
search_keywords: [OINK architecture, repository boundary, runtime, i18n, Docsy locales, output formats, security, accessibility, performance]
contract_status: v1.4.0
---

> [!NOTE] OINK 1.4.0 contract
> This contract describes OINK v1.4.0.

## Hugo toolchain {#hugo-toolchain}

Use **OINK v1.4.0** and **Hugo Extended 0.168.0** for maintained sites,
development, CI, and release validation. Keep this toolchain pinned.

Do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`. Warnings remain
visible and are reviewed. The upstream LibSass deprecation warning is accepted;
it does not make a successful build fail. Invalid-input tests verify their
specific warning and safe fallback output directly.

OINK uses Hugo's built-in LibSass for main and ReDoc styles. Ordinary consumers
need no Dart Sass or other Sass executable. Project-variable and project-style
SCSS hooks remain supported. Future upgrades must preserve this dependency
boundary. Update requirements, checkers, CI pins, and both language contracts
together; historical release and research records retain their original tools.

The module requires Go **1.27.3**, also pinned for development and CI. Go resolves
Hugo Modules and is not needed for a prepared classic theme copy.

## Repository and assembly {#repository-and-assembly}

The repository root is a complete Hugo Module theme. It is not a site or npm workspace.
Hugo Extended compiles SCSS and templates. Committed browser runtimes and third-party assets need no network fetch during normal builds.
Public bilingual documentation, examples, and browser tests belong to the sibling `oink.pgsty.com` repository.
The theme keeps only narrow internal regression fixtures under `tests/site/`. It has no separate public example site.

Generated `public/` and `resources/` directories are never source.
Vendored runtimes, font families, and Font Awesome glyph definitions are supported distributions. Do not remove them as dead code.
`VENDOR.json` and `bin/check-vendor.py` verify their integrity.
OINK includes the complete supported Font Awesome distribution because consumer content can use icons absent from theme templates.

The official compiled Font Awesome CSS is a stable, fingerprinted vendor stylesheet.
It loads before fingerprinted `main.css`, which is compiled from theme and consumer SCSS.
Site style changes therefore preserve the icon distribution's fingerprint, while cascade order still lets sites override its styles.
Capability styles, including KaTeX, DocSearch, Swagger, and Asciinema, stay separate and load only when used.
Fingerprints permit immutable URLs. The deployment host controls their HTTP cache headers.

Hugo types `docs`, `book`, `blog`, and `swagger` select reading shells. `params.ui.shell_types` may add types.
Landing uses `layout: landing`. There is no `article` type or second blog shell.
The [shell contract](/docs/design/shell/) defines immersive pages as a blog presentation.

`layouts/_partials/shell/config.html` resolves shared shell settings.
Layouts must render through `content/render.html` before `scripts.html` because render hooks and shortcodes register capability flags in the Page Store.
Override the narrowest partial. Keep similar base templates separate when merging them would change Hugo lookup precedence.

## Configuration and diagnostics {#configuration-and-diagnostics}

Theme policy uses `params.ui.*`. Integrations with multiple settings, such as `comments.giscus`, `plantuml`, and `drawio`, remain top-level.
Boolean features use bare booleans unless they have multiple settings.
Page overrides omit the `ui.` prefix. Thus `params.ui.image_zoom` becomes `image_zoom`, never a front matter `ui` map.
`hugo.yaml` declares published defaults. The owning resolver and checker define optional configuration shapes or ranges.

For invalid input, warn with the value, allowed shape, and safe fallback. Then apply the fallback or omit the unsafe feature.
Ordinary builds and previews remain usable.
The theme never calls `errorf`. `check-params.py` enforces this rule.
Do not add speculative validation for unreachable states.

There is no generic registry of renamed keys.
If a transition needs a migration diagnostic, add a targeted warning to its resolver and a negative test that verifies the warning and fallback.
Never read removed keys as a compatibility path.

Network-capable features require explicit configuration and remain disabled when that configuration is invalid.
OINK 1.4.0 renders PlantUML locally when it is enabled without an endpoint;
an explicit `plantuml.svg_image_url` keeps server mode. Draw.io requires
`drawio.drawio_server`. Algolia requires `appId`, `apiKey`, and `indexName`.
Incomplete configuration warns and sends no request.
Draw.io loads only if rendered content has PNG or SVG candidates. It inspects each distinct image URL once.
Diagram endpoints must be strings with an HTTP(S) URL containing a host or a same-site path.
Unsupported schemes, protocol-relative URLs, backslashes, whitespace, and same-site references without paths warn and disable the integration before runtime selection.

> [!NOTE] Self-contained PlantUML in OINK 1.4.0
> `plantuml: true` or `plantuml.enable: true`
> without an endpoint selects browser rendering. The two pinned local assets
> (`@plantuml/core` 1.2026.9 and Viz.js 3.24.0) load only on HTML pages with
> PlantUML fences. Normal builds and readers need no Java, Graphviz executable,
> npm installation, CDN or rendering service. A nonempty endpoint still selects
> server mode and retains its validation and `svg` behavior; invalid endpoints
> do not fall through to local mode. No optional libraries, themes, include files
> or external resources are downloaded by local rendering. Generated SVG is
> displayed as a Blob image, never inserted into the page DOM. Failed input or
> loading keeps readable source; dedicated Print, Markdown and RSS keep source
> without a runtime. This behavior is part of the v1.4.0 release.

> [!NOTE] Fixed in OINK 1.3.0
> Editor URLs retain their query parameters and fragments when embedding
> options are added. Messages must come from the active editor frame and its
> configured origin; unrelated or malformed messages are ignored. Diagram
> data is sent only to that origin. Exports must be PNG or SVG data URLs.

> [!NOTE] Lazy diagram loading in OINK 1.4.0
> The small Mermaid/local-PlantUML scheduler appears only on HTML pages using
> these diagrams. Large engines load as visible diagrams approach the viewport.
> Engines are shared, with serial main-thread rendering; no Worker, dependency
> or build step is added. Scroll/size checks replace IntersectionObserver when
> unavailable. Ordinary browser printing cannot wait for asynchronous rendering:
> completed diagrams show images and the remainder retain source. Dedicated
> outputs are unchanged.

## Interface localization {#interface-localization}

> [!NOTE] Available since OINK 1.1
> OINK 1.1.0 expands the native interface catalogs to the complete locale set
> below. Consumer-authored content still needs its own translations.

OINK ships native interface catalogs for the 31 locale filenames present in
[`google/docsy@64f51c5`](https://github.com/google/docsy/tree/64f51c5bde2abd2e8a001cb31b32656f5800ca56/theme/i18n),
plus generic `zh` as the Simplified Chinese default:

```text
ar az bg bn de en es et fa fi fr he hi hu it ja ko nl no oc pl pt-br ro ru
sr-cyrl sr-latn sv tr uk zh-cn zh-tw
```

These catalogs cover theme UI strings; sites translate their own content.
New Docsy locales do not enter OINK automatically: they need a complete OINK catalog and the same review as existing locales.

`i18n/en.yaml` defines the message schema. Each of the 32 OINK bundles has exactly these keys and native interface text.
An English value may remain only as a reviewed product name, punctuation token, conventional abbreviation, or word shared by the target language.
There are no generated English fallback blocks.
`zh` and `zh-cn` use Simplified Chinese. `zh-tw` uses Traditional Chinese.

The current Hugo baseline accepts `locale: zh` for the generic `zh` language
alongside regional Chinese catalogs. A site may also select `locale: zh-CN`.
Neither choice changes the `i18n/zh.yaml` filename.

Runtime placeholders such as `%s`, `{count}`, and `{{ .Count }}` may move for natural grammar. Their bytes must stay identical.
Values are strings or Hugo plural-message maps. Plural maps use supported locale categories: `zero`, `one`, `two`, `few`, `many`, and `other`.
`other` is required. Each form must be a string with the same placeholders.
Catalogs contain no hidden bidirectional controls.
Arabic, Persian, and Hebrew direction comes from consumer language configuration (`direction: rtl`), not injected translation characters.
`bin/check-i18n.py` checks locales, schema, value shapes, placeholders, directional controls, and the small reviewed set of English-identical terms.
Translate every new visible string in every bundle in the same change. Do not generate fallback text.

## Featured images {#featured-images}

Hugo's `images` is the single authoring API. `params.images` supplies only the site-wide social fallback.

| Source | Reader thumbnail | Social card |
| --- | --- | --- |
| Page `images`, or bundled `**featured*`, `*feature*`, `{*cover*,*thumbnail*}` | yes | yes |
| Section `cascade.images` | yes | yes |
| Site `params.images` | no | yes |

`images: []` clears explicit or cascaded values but does not disable bundle resource discovery.
Only the first resolved image represents the page. Local processable rasters may be cropped.
SVG, static, and remote resources remain valid without Hugo image operations.

`featured-image-resolve.html` defines source priority and relative or absolute URLs.
Explicit page `images` take precedence over bundle resources. Bundle resources take precedence over inherited cascade images.
This order also applies when explicit and inherited values are identical.
For file-backed pages, authored presence is read from source front matter. Hugo parses YAML, TOML, or JSON.
For generated pages without source files, resolved `images` count as explicit.
List thumbnails, Open Graph/Twitter/schema helpers, author avatars, Pinterest media, and blog presentation all use this decision.

`params.ui.featured_image` applies only to blogs and defaults to `none`. Page front matter or cascades can override it.
`banner` adds a figure above single-page titles. `wash` colors the header.
`hero` fills the shell background on single pages and section indexes.
Missing images and non-HTML outputs render no image.

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
| BookManifest | Opt-in ordered JSON handoff for EPUB/PDF packaging tools |

Output formats run in their defined order. Mutable format state does not create a cross-format race.
Within Print, Hugo can render Book pages and overlapping aggregates in parallel.
A cached coordinator for each page creates plain and Book variants in a fixed order. Each caller selects its required form.
Plain Print keeps page-local headings and routed xref URLs. Book aggregates keep namespaced headings and in-document xrefs.
Relative content links resolve against each source page's HTML URL before its body moves into Print.
This preserves language and deployment prefixes, query strings, and encoded paths in both single-page and aggregate output.
Only actual `href` attributes are rewritten; matching text in `title` or other non-link attributes is preserved.
Fragment-only links remain local for heading and footnote namespacing; canonical and external links keep their destinations.
Heading fragments are percent-decoded once for namespace lookup, including Unicode and encoded ASCII.
Literal plus signs remain plus signs; malformed escapes remain unchanged. HTML entities in IDs and attributes are decoded separately.
The path, query, and external origin are never changed by fragment normalization.
Rendered Markdown headings inside Tabs and other Markdown shortcodes receive the same namespace, even when Hugo omits them from `Page.Fragments`.
Their rendered heading IDs own the identity, preserving Chinese text, literal plus signs, and percent sequences without deriving IDs from escaped self-link URLs.

Configured RSS output on a Landing page generates a static feed through the shared RSS renderer.
An advertised alternate output must have a generated file; omitting interactive Landing components does not omit the feed itself.

Print is a browser-readable document before it is sent to paper. On screen,
wide tables stay inside labelled, keyboard-focusable scroll regions without
widening the page. Print-media CSS expands these regions for printing. This
requires no table runtime; RSS tables remain non-focusable static content.

Consumers opt into custom outputs. OINK does not force expensive Book aggregates.
HTML loads shared action and core layers, plus stable first-party capability chunks selected by page flags.
Templated capabilities publish at most one chunk per language. Flags select script tags and never create bundles for feature combinations.
Print keeps the action layer and only runtimes needed by rendered print features.
Large third-party UMD files stay separate. Unused feature runtimes remain absent.

A top-level section enables `LLMSFULL` by listing it in its `_index` front matter `outputs`.
The theme never adds it to site outputs. One renderer creates per-page Markdown and the bundle.
The bundle concatenates the same semantic Markdown, without `td-` component markup, in sidebar and pager reading order.
Enabling it below the top level warns and emits nothing.
Builds remain usable; the warning and absence of the disabled output are checked directly.

Site `outputs.home` enables `NAVJSON`. It publishes one `navigation.json` per language at the language root.
It uses the sidebar and pager authority: explicit `data/docs_nav.json` when present, or the weighted content tree otherwise.
Array order is the contract. `weight` is never serialized. The output is `notAlternative`.
The manually maintained `schema/nav.v1.schema.json` versions the format.
Edit it with its templates and checker. It is outside the generated configuration schema drift gate.
Both outputs default off. Sites that enable neither build byte-identically. `bin/check-agent-indexes.py` owns their checks.

`BookManifest` is disabled unless a Book root explicitly lists it in `outputs`.
It references existing per-page Markdown and records derived page order, headings, numbered targets, and xrefs.
The theme guesses no publication metadata.

The theme repository provides `bin/book-epub.py` and `bin/book-pdf.py` for explicit publication steps.
`bin/check-book-epub.py` and `bin/check-book-pdf.py` validate their artifacts.
The EPUB packager combines `BookManifest` with whole-Book Print HTML and accepts consumer metadata separately.
The PDF runner serves Print output at a temporary loopback address. It invokes an explicit Chrome/Chromium binary with `script-src 'none'` CSP.
It produces A4 pages with CSS page numbers.
The PDF server also applies a CSP sandbox, rejects meta-refresh navigation, and refuses symlinks outside the build tree.
Without network opt-in, image and media requests allow only the loopback origin and data URLs. This includes requests from CSS or SVG.
Both tools refuse missing resources and resources outside the build tree.
Network resources and output replacement each need a separate explicit flag.
Network opt-in permits only passive HTTP(S) media. Remote scripts and local-file schemes remain invalid.
Relative EPUB metadata assets resolve from the metadata file's directory, not the working directory.
Ordinary Hugo builds run no publication steps. PDF remains derived from Print, rather than a separate template output.

Performance rules:

- Do not walk `.Site.Pages` for every page if a site-level resource or `partialCached` result can perform the work.
- Render `.Content` once. Read Page Store flags only after rendering it.
- Emit correct markup. Do not scan the DOM to repair it.
- Group browser work by resource URL, not DOM instance.
- Keep ordinary outputs opt-in when their aggregate cost is material.
- Emit no Speculation Rules by default. First, a named production consumer must measure `Sec-Purpose: prefetch` requests, useful navigations, bytes, and CSP impact.
  Use a reversible `moderate` experiment.
- Validate reachable author input. Do not validate hypothetical internal states.

`bin/measure-baseline.py` measures build time, output weight, bundle count, and
shortcode density.

Single-page Print emits the page description once. Section Print carries
mathematics capability from every included descendant to the aggregate root,
so a formula-free index still loads local KaTeX styles when a child needs them.
Formula-free Print documents do not load those styles.

## Trust, CSS, and accessibility {#trust-css-and-accessibility}

Authors may enable Goldmark `unsafe`. Configuration and component parameters are not raw HTML.
The shared attribute policy uses an allowlist, validates class tokens, and passes `data-*` and `aria-*`.
It warns and removes `style`, `srcdoc`, `on*`, reserved attributes, and unknown attributes.
URL helpers reject dangerous schemes and protocol-relative URLs where local or explicit absolute URLs are required.
Promised remote URLs remain supported. They are never fetched at build time.

> [!NOTE] Fixed in OINK 1.3.0
> Image and Gallery URLs are HTML-attribute escaped after URL validation,
> including full-size Zoom sources. Quotes and ampersands remain part of the
> URL; they cannot introduce attributes or be decoded as HTML entities.

Theme output uses `td-` classes, `data-td-*` attributes, and `--td-*` custom properties.
Author markers such as `.steps`, `.cards`, `.full-width`, `.wide`, and `.expand` remain unprefixed.
CSS supports RTL, print, forced colors, reduced motion, long tokens, and narrow viewports.
Theme decorative icons have `aria-hidden`. Only pages with task lists or raw authored Font Awesome elements load the authored accessibility repair.

Reading-container focus distinguishes pointer input from keyboard navigation.
A pointer-focused main region, table viewport, or code `pre` does not gain an outline merely when another key is pressed.
Tab, blur, or new non-pointer focus clears that exception.
Controls keep their focus styles. Scrollable containers keep `tabindex`.
The skip-link destination shows a local outline around its title instead of the whole article.
Forced colors retain keyboard focus indication. No global focus-outline reset is used.

Font roles are `ui`, `body`, `heading`, `code`, `display`, `meta`, `brand`, and `print`. They use `--td-*-font-family` properties.
`ui` is the primary face, with `body` resolving through it and `heading` through `body`, so one assignment changes interface text, prose, and headings together.
`params.ui.typography` accepts `technical` or `system`. Both compile into one stylesheet and need no runtime.
Legacy Bootstrap/Docsy Sass variables still initialize these roles.

`params.ui.fonts` configures the same roles without mounted SCSS or an added stylesheet.
It names faces without loading them, so readers must have the family or the site must declare it through its own `@font-face`.
This key remains outside the network contract.
Values must use plain font-family syntax. The emitted `:root` block is reconstructed from matched parts.
Unknown roles or unsafe values warn and are individually removed.
The block follows the stylesheet, allowing authored faces to override presets at equal specificity.
Shells inherit site faces and define none of their own. Book numbers and captions use the prose face, not a technical face.

Accent roles are separate. Accent *text*, including links, external URLs, and inline code, uses the Bootstrap link family and `--bs-code-color`.
Theme colors never redeclare these properties. Inline code follows the visual preset: Slate keeps the crimson pair; Paper uses ink text on a quiet chip.
Accent *backgrounds* include selected rows, gray pointer-hover navigation backgrounds, hover washes, outline pills, rails, dots, chip hovers, and hovered card borders.
They also include share-button hover fills, selections, and focus rings.
These use `--td-accent`, `--td-accent-rgb`, and `--td-accent-hover`, which default to the link family.
These are the only properties emitted by `params.ui.theme_color`.
Shell text uses them too: active outline anchors and Book chapter headings under pointer or keyboard focus use the section color, not link blue.
`theme_color` and `theme_color_dark` accept `#rgb`/`#rrggbb`. Page front matter and section cascades override site values.
Unconfigured sites emit nothing. Unparseable values warn and keep the default palette.
Resolved colors below 4.5:1 against the theme canvas warn with a suppressible ID but are still emitted.
This check uses the site default preset canvas and is advisory. Only parse failures remove colors.
The light color is required. `theme_color_dark` without valid `theme_color` warns and is ignored.
A page therefore receives color in both modes or neither.
If dark color is omitted, the theme lightens toward white in 4% steps until it reaches 4.5:1 on the dark canvas.
Every emitted byte is formatted from parsed integer channels, never author text.
One resolver supplies page colors to both the head block and sidebar root switcher.

## Visual presets {#visual-presets}

OINK 1.2.0 defaults to Paper. `params.ui.preset` accepts
`paper`, `slate`, and the explicit experimental presets `ink`, `terminal`.
Invalid and reserved names (`folio`, `canvas`) warn and fall back to `paper`.
`params.ui.preset_menu` defaults to `false`; `true` offers Paper, Slate and the
site default. A list selects available choices, including experiments. A list must include the site default; missing it
warns and adds it. There is no page-level preset override.

Hugo renders `data-td-preset` and `data-td-site-preset` on every document root,
including 404 and print output. With reader choice enabled, an inline head
script validates `td-preset` before CSS loads. Selecting the default removes
that storage key. Invalid saved values are removed; blocked storage leaves
in-page controls usable and shows a non-persistence note. The `storage` event
synchronizes tabs. `td-preset-change` carries `{preset, previous, stored}`.
Mode remains independent: `data-bs-theme`, `td-color-theme`, and
`td-theme-change` retain their meaning. The browser chrome color follows the
resolved mode and preset. Without JavaScript, the site default light palette
renders; appearance controls require JavaScript.

All four presets compile into one stylesheet. Slate retains the v1.1.0 base
palette selectors and values. Paper changes palette and selected component
rules without changing shell columns, breakpoints, or global spacing. Dark
Paper redeclares every light palette token, including nested dark islands.
Font roles have equal selector specificity: preset, then `typography: system`,
then head-emitted `params.ui.fonts`. Site `_styles_project.scss` remains last.
`brand` controls the wordmark independently from display headings. Paper uses
local IBM Plex Sans; Slate keeps Inter; both retain Chakra Petch for the
wordmark and IBM Plex Mono for code. System typography requests no bundled
text face unless the site explicitly overrides a role. No external font is
introduced. Ink uses Inter throughout, with red markers, underlined prose
links, square geometry and no shadows. Terminal uses mono chrome/headings,
Plex Sans prose, teal links, amber accents, 2 px corners and no shadows. Its
navigation density changes only on desktop; prose measure and mobile targets
remain unchanged. CSS heading marks have empty accessible alternatives and
are omitted in unsupported browsers. Explicit `fonts.ui` still supplies the
main face unless a valid `fonts.body` overrides it. See the
[experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/).

> [!NOTE] Paper section headings in OINK 1.4.0
> Paper no longer draws a decorative line to the right of content `h2` headings,
> in either light or dark mode. Heading typography, spacing, anchors, and normal
> wrapping are preserved. Site-authored heading borders remain supported.

Giscus auto palettes follow both dimensions; explicit Giscus theme or
light/dark stylesheet overrides remain authoritative. Print uses a light
preset palette on white paper even when the screen is dark. Mermaid and
ECharts continue to follow mode only; API widgets retain vendor palettes.
See the [accepted decision](/docs/design/decisions/visual-presets/) and
[local acceptance record](/docs/design/research/2026-10-05-visual-presets-acceptance/).

## Release states {#release-states}

Keep local validation, module tagging, consumer pin updates, and site deployment distinct during release workflows.
