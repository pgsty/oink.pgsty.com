---
title: Configuration
linkTitle: Configuration
description: The one place site parameters are defined — every key the theme reads, with its type, default and the guide that covers it.
weight: 10
search_keywords: [configuration, hugo.yml, parameters, params.ui, defaults, site settings, reference]
search_boost: 1.6
aliases:
  - /docs/configure/overview/
---

This is the single home of site parameters. Every key the theme reads has a row
in one of the tables below, giving its type, default and a one-line description,
and linking to the guide that covers it. The guides give pasteable snippets and
never repeat the definitions. Page-level parameters (front matter) are in
[Page parameters](/docs/write/frontmatter/).

The tables are grouped by function, one `##` each, and the anchors are
referenceable — for example `/docs/customize/config/#sidebar`. **An empty
default column means the theme has no default**: leave the key out and the
feature is off.

## The layers of hugo.yml {#layers}

An OINK site's configuration has four kinds of key, and which layer you change
depends on what you are changing:

| Layer | Examples | Who defines it |
| --- | --- | --- |
| Hugo's own top-level keys | `baseURL` `title` `languages` `markup` `outputs` `taxonomies` `module` | Hugo itself; the behaviour is on [gohugo.io](https://gohugo.io/configuration/) |
| Top-level `params` | `logo` `offline_search` `github_repo` `version` `page_width` `comments` | Site-level options the theme reads |
| `params.ui.*` | `navbar_enabled` `sidebar_width_min` `typography` `pager_types` | The shell, navigation and reading interface |
| `params.<runtime>` | `mermaid` `plantuml` `drawio` `markmap` | Each content runtime's own switch and endpoint |

A minimal working configuration needs only the first two layers:

```yaml {title="hugo.yml"}
title: Product Docs
baseURL: https://docs.example.com/
defaultContentLanguage: en
enableGitInfo: true

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: 0.160.1

params:
  offline_search: true
  github_repo: https://github.com/example/product-docs
```

## Configuration principles {#principles}

- **The theme's defaults are conservative; write only the keys you change.** Interactive features (local search, image zoom, comments, feedback, the light/dark menu) are off by default, because the theme does not make policy for a site. Trimming a "complete configuration" leaves behind keys you never needed more readily than adding them as you go.
- **There is no theme master switch.** There is no `oink.enabled`, no `params.oink.*` namespace, and no option that swaps between a "Docsy shell" and an "OINK shell". A switch you cannot find on this page does not exist.
- **An invalid value warns and falls back to the documented default.** `params.ui.typography: solarized` reports `invalid params.ui.typography "solarized" (allowed: technical | system) -- using "technical"` and the site still builds; `footer_style: thin`, `page_width: huge` and `section_index: grid` behave the same way. One typo therefore degrades one setting instead of serving HTTP 500 on every URL under `hugo server`. It cannot ship silently either: every publishing gate builds with `--panicOnWarning`, which turns the warning back into a hard failure.
- **One warning keeps the value instead of dropping it.** A `theme_color` the theme reads as below AA body text (4.5:1) against its own canvas still ships — a custom canvas or a brand mandate is the author's call — but says so, and prints the `ignoreLogs` id that silences it. Treat it as advice, not a rejection: the fix is either a darker color or one line of configuration, and the publishing gate stops the build until you choose. Only an unparseable hex is dropped outright, and that one falls back to the default palette like every other invalid value.

- **A few things still stop the build**, and they are the ones where carrying on would publish something wrong rather than merely plain. A feature needing an external endpoint — PlantUML, Draw.io, Algolia — errors when the endpoint is missing, because the theme never connects to a public service on your behalf. An incomplete upstream attribution errors, because a partial notice reads exactly like a complete one. `params.offline_search_index`, the `release` facts and unresolvable content references do the same.

## Page-level override precedence {#overrides}

Hugo's `.Param` lookup lets most parameters be overridden per page, highest
precedence first:

1. The page's own front matter;
2. `cascade` in an ancestor section's `_index.md` (nearer wins);
3. Site `params`.

**Drop the `ui.` prefix when writing it in front matter.** The site's
`params.ui.scroll_spy` is simply `scroll_spy` on a page. A `ui:` block in front
matter is read by nobody and reported by nobody, so a setting that seems to have
no effect is worth checking against
[Page parameters](/docs/write/frontmatter/) first.

```yaml {title="content/docs/wide-reference.md"}
---
title: Wide reference
page_width: wide
navbar_enabled: false
footer_style: slim
scroll_spy: true
---
```

A cascade sets a whole subtree at once:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  type: docs
  footer_style: slim
  feedback: true
---
```

Overrides are for real differences in content. Rebuilding a visual system page
by page tends to fall out of step at the next theme upgrade.

## The three Goldmark prerequisites {#goldmark}

Hugo does **not** merge a theme module's `markup` configuration into the site,
so these three must be in the site's own `hugo.yml`, or attribute lines,
component HTML and mathematics all stop working:

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      # block images may carry an attribute line ({caption=…}, numbered figures)
      wrapStandAloneImageWithinParagraph: false
      attribute:
        block: true
    renderer:
      # HTML emitted by `{{%/* … */%}}` shortcodes has to survive
      unsafe: true
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
  highlight:
    # class-based highlighting, so light and dark can each have a palette
    noClasses: false
  tableOfContents:
    endLevel: 4
```

Without `attribute.block`, `{.fields}`, `{.steps}` and `{caption=…}` render as
literal text; without `passthrough`, `\(x\)` never becomes a formula; without
`unsafe`, the structure of steps and cards is escaped away.

`renderer.unsafe: true` also lets raw HTML in Markdown through. It is meant for
trusted authors, not as a submission filter. Where content comes from untrusted
sources, the review belongs in the contribution process.

## Site identity and brand {#identity}

Hugo's own top-level keys:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | | Site name, shown in the navbar, `<title>` and the footer |
| `baseURL` | string | | The production domain; include the path segment for a subpath deployment |
| `copyright` | string | | Fallback for the copyright line, rendered as HTML when `params.copyright` is unset |
| `enableGitInfo` | boolean | false | Required before "last modified" and commit information exist |
| `enableRobotsTXT` | boolean | false | Generates `robots.txt` |
| `enableEmoji` | boolean | false | Allows `:smile:` shortcodes |
{.fields meta="type default"}

Theme parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.logo` | string | icons/logo.svg | Brand mark; may point at an `assets/` resource or a `static/` path — see [Brand and appearance](/docs/customize/brand/#logo) |
| `params.wordmark` | string | | Horizontal wordmark; when set, the navbar uses it instead of "icon + site name" |
| `params.description` | string | | Site description, the meta fallback when a page has no `description` |
| `params.copyright` | string or map | | A string renders as Markdown; a map takes `authors`, `from_year` and `to_year` (`present` means this year) |
| `params.footer_center_info` | string | Powered by [Oink](https://oink.pgsty.com) | Inline Markdown in the centre of the footer; an empty string hides it |
| `params.author` | string or map | | The RSS author; a map takes `name` and `email` |
| `params.ui.theme_color` | string | | `#rgb`/`#rrggbb` hex tinting the shell's accent grounds; prose links and inline code are unaffected — see [Brand and appearance](/docs/customize/brand/#theme-color) |
| `params.ui.theme_color_dark` | string | derived | The dark half of the accent; omitted, it is derived from `theme_color` until it clears AA on the dark canvas |
{.fields meta="type default"}

There is no favicon parameter: the theme scans `static/` for conventional names
(`favicon.ico`, `favicon.svg`, `favicon-NxN.png`, `apple-touch-icon.png`,
`apple-touch-icon-NxN.png`) — see
[Brand and appearance](/docs/customize/brand/#favicon).

## Shell types and section roots {#shell}

The shell follows the **page type**, not the path. Documentation can live in any
directory, with a cascade giving it `type: docs`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.shell_types` | list | [docs, book, blog, swagger] | Which types use the reading shell with a sidebar — see [Layouts and page types](/docs/customize/layout/#shell-types) |
| `params.ui.docs_section` | string | docs | The documentation section's root directory name, used for navigation resolution only |
| `params.ui.blog_section` | string | blog | The blog section's root directory name |
| `params.ui.docs_sidebar_root` | enum | section | With `section`, a docs page's sidebar roots at the documentation section; with `home`, at the site home. An invalid value warns and falls back |
| `params.ui.quick_links` | list | [docs_section, blog_section] | Top-level menu identifiers listed by the command palette on an empty query — see [Command palette](/docs/customize/panel/) |
| `params.ui.sidebar_root_enabled` | boolean | true | Allows a subsection to become its own sidebar tree with `sidebar_root_for: self` |
| `params.ui.sidebar_root_menu` | boolean | true | Shows the section switcher above the sidebar; it degrades to a plain link when there is only one entry |
| `params.ui.section_index` | enum | list | Child list style on a section index: `list` or `cards`, overridable per section |
| `params.ui.section_index_columns` | integer | 2 | Column count when `section_index: cards` |
{.fields meta="type default"}

## Blog {#blog}

Three keys shape a blog section. They apply to the section named by
`params.ui.blog_section`, and each can be overridden per section through front
matter or a `cascade` on the blog root.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.featured_image` | enum | none | How an article renders its own featured image: `none` renders nothing, `banner` frames it above the title in a 16:9 figure, `wash` lays it behind the article header at a tenth of its opacity. The image is whichever one the page already shares in its card and `og:image`, so the two cannot disagree. An article with no image renders nothing in either mode |
| `params.ui.blog_index` | enum | list | The blog section's list page: `list` is the row list, `cards` a grid of content cards with a 16:9 lead image, the date and section line, and a three-line summary. Year grouping, pagination and `manual_link` behave the same in both |
| `params.ui.blog_index_columns` | integer | 3 | Column count when `blog_index: cards`; two between the md and xl breakpoints, one below md, whatever this says |
{.fields meta="type default"}

Article authorship and series are taxonomies rather than parameters — see
[Taxonomies](/docs/customize/taxonomy/#authors) and
[Writing a blog](/docs/write/blog/).

## Navbar and footer {#navbar-footer}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.navbar_enabled` | boolean | true | Whether the site navbar renders; overridable with a top-level `navbar_enabled` on a page — see [Navigation and menus](/docs/customize/navigation/#navbar) |
| `params.ui.navbar_autohide` | boolean | false | The navbar retracts above the viewport and returns when the pointer enters the wake zone; inactive below 768px and on coarse pointers |
| `params.ui.footer_style` | enum | fat | `fat` is a multi-column grid plus the copyright line, `slim` is the copyright line only, `none` renders nothing. An invalid value warns and falls back |
| `params.ui.dark_mode` | boolean or map | false | `true` enables both the dark palette and the theme control; for the control alone write `dark_mode: { show_menu: true }` |
| `params.ui.breadcrumb` | boolean | true | Breadcrumbs; `false` turns them off. A top-level section already omits a one-level breadcrumb |
| `params.ui.page_context_menu.enable` | boolean | true | The page action split button beside the title |
| `params.ui.page_context_menu.assistant_links` | boolean | false | Shows "Open in ChatGPT / Claude"; clicking sends the full URL off-site |
| `params.ui.page_context_menu.links` | list | [] | Custom external actions; `url` supports the `{url}`, `{title}` and `{markdown_url}` placeholders |
| `params.ui.github_stars` | string or number | | The star count on the navbar GitHub mark; a local constant, never a request |
| `params.ui.alt_site` | map | | A sibling-site link shown in the footer of a single-language site; `label` and an absolute `http(s)` `url` are both required |
{.fields meta="type default"}

The fat footer's column data comes from `data/footer/<language>.yaml` rather
than from a parameter — see
[Navigation and menus](/docs/customize/navigation/#footer).

## Sidebar {#sidebar}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.sidebar_menu_compact` | boolean | true | Expands only the current branch and its neighbours |
| `params.ui.sidebar_menu_foldable` | boolean | true | Lets the reader expand and collapse sections |
| `params.ui.sidebar_menu_truncate` | integer | 2000 | Maximum entries rendered in one section; the rest are truncated |
| `params.ui.sidebar_cache_limit` | integer | 500 | Above this page count the site reuses shared navigation markup, and the browser restores the active state |
| `params.ui.sidebar_width_min` | integer | 220 | Lower bound in pixels for drag-resizing on the desktop |
| `params.ui.sidebar_width_max` | integer | 480 | Upper bound in pixels for drag-resizing |
| `params.ui.sidebar_item_overflow` | enum | ellipsis | `ellipsis` truncates a long title, `wrap` wraps it |
| `params.ui.sidebar_icon_policy` | enum | all | Icon density: `all` everywhere, `groups` only on the root and nodes with children, `none` nowhere. An invalid value warns and falls back to `all` |
| `params.ui.sidebar_expand_levels` | integer | 2 | Tree levels expanded by default |
| `params.ui.sidebar_headings` | boolean or integer | false | `type: book` only: expands a heading branch under the current sidebar row; an integer from 2 to 4, and `true` means 2 |
| `params.ui.sidebar_enabled` | boolean | true | The left sidebar; `false` turns it off, usually per page rather than per site |
| `params.ui.taxonomy_icons` | map | | Right-column group icons by taxonomy plural, for example `tags: fa-solid fa-tags` |
{.fields meta="type default"}

How to use the sidebar is in
[Layouts and page types](/docs/customize/layout/#sidebar); the tree itself comes
from the shape of `content/` — see
[Organizing content](/docs/write/organize/).

## Table of contents {#toc}

The outline's levels come from Hugo's own configuration; the theme controls only
the tracking behaviour:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `markup.tableOfContents.startLevel` | integer | 2 | Hugo's own: the highest heading level collected |
| `markup.tableOfContents.endLevel` | integer | 3 | Hugo's own: the lowest heading level collected |
| `params.ui.scroll_spy` | boolean | false | Scroll position tracking; `true` highlights the active entry |
{.fields meta="type default"}

Hide the outline on one page with the front matter `notoc: true` — see
[Page parameters](/docs/write/frontmatter/).

## Pager and page end {#page-end}

The page-end components are in a fixed order — share → feedback → page
information → pager → comments — and each has its own switch.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.share` | list | [] | Page-end share targets, in the order given, from `x` `bluesky` `mastodon` `facebook` `linkedin` `reddit` `hackernews` `telegram` `whatsapp` `line` `pinterest` `weibo` `chatgpt` `claude` `email` `copy`. Empty means no bar. Every target is a plain intent link — no SDK, no iframe, no third-party script, no share counts — see [Writing a blog](/docs/write/blog/#share). An unknown target warns and is dropped |
| `params.ui.pager_types` | list | [docs, book, blog] | Which types show previous / next; a page opts out with the front matter `pager: false`. An unknown type warns and is dropped |
| `params.ui.annotation` | boolean | true | The "last modified" and provenance block at the end of the body; the upstream attribution line is driven by the page's `upstream_link` family — see [Page parameters](/docs/write/frontmatter/#upstream) |
| `params.ui.translation_notice` | language code or false | false | The language code of the authoritative version, so a translated page shows a line pointing back at it; a page opts out with `translation_notice: false` |
| `params.ui.reading_time` | boolean | false | Shows a reading time under the page title |
| `params.ui.book_draft_banner` | boolean | false | Adds a banner at the top of a draft Book page |
{.fields meta="type default"}

## Search and command palette {#search}

Local search is off by default, and the command palette appears only once it is
on (the navbar magnifier, {{< kbd "Cmd/Ctrl" "K" >}}, `/`, `\`).

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.offline_search` | boolean | false | Generates one local index per language and enables the command palette — see [Search](/docs/customize/search/) |
| `params.offline_search_on_serve` | boolean | true | Builds the index under `hugo server` too, so the preview behaves like production; set `false` on a very large site to speed up local rebuilds |
| `params.offline_search_index` | enum | content | Index scope, cumulative: `title`, `heading`, `summary`, `content`. An invalid value fails the build |
| `params.offline_search_summary_length` | integer | 70 | Word cut-off for the `summary` scope's excerpt |
| `params.offline_search_max_results` | integer | 10 | Result cap, bounding both Lunr and the CJK substring fallback |
| `params.ui.landing_search` | boolean | true | Whether a `layout: landing` page keeps a search entry point |
| `params.ui.command_palette.commands` | list | [] | Custom commands, each with either `url` or a built-in `action` — see [Command palette](/docs/customize/panel/#custom-commands) |
| `params.gcs_engine_id` | string | | A Google Programmable Search engine ID; enabling it brings in an external service |
| `params.search.algolia` | map | | Algolia DocSearch; `appId`, `apiKey` and `indexName` must all be given explicitly or the build fails |
{.fields meta="type default"}

A custom command record accepts seven keys only — `id`, `title`, `description`,
`icon`, `keywords`, `url`, `action` — and `id` must match `^[a-z][a-z0-9_-]*$`
and must not collide with a built-in action ID. Per-language titles go under
`languages.<lang>.params.ui.command_palette.commands`.

## Keyboard {#keyboard}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.keyboard_nav` | boolean | true | Single-key navigation (WASD / arrows walk the tree, j/k jump headings, q/e page, palette and shell switches). With `false` the runtime never enters the bundle — see [Keyboard navigation](/docs/customize/keyboard/) |
{.fields meta="type default"}

## Image zoom {#image-zoom}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.image_zoom` | boolean | false | Lets body images open full size; a page overrides it with the front matter `image_zoom`. A non-boolean warns and falls back |
{.fields meta="type default"}

Which images become zoom candidates is in [Images](/docs/components/image/).

## Typography {#typography}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.typography` | enum | technical | `technical` uses the bundled Inter / Chakra Petch / IBM Plex Mono; `system` uses the platform stack only and requests no brand font. An invalid value warns and falls back |
| `params.page_width` | enum | normal | Overall shell width: `normal`, `wide`, `full`; overridable per page |
| `params.reading_width` | enum | normal | Reading measure of a Book page's body: `slim`, `normal`, `wide`; it does not affect the shell |
{.fields meta="type default"}

Custom fonts and colours go through the SCSS entry points rather than YAML — see
[Brand and appearance](/docs/customize/brand/#fonts).

## Comments and feedback {#comments-feedback}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.comments.enable` | boolean | false | The site-level comment switch; a page overrides it with the front matter `comments` — see [Comments](/docs/admin/comments/) |
| `params.comments.type` | string | giscus | Only `giscus` actually renders today |
| `params.comments.giscus.repo` | string | | The GitHub repository hosting the discussions; required |
| `params.comments.giscus.repoId` | string | | The repository ID; required |
| `params.comments.giscus.category` | string | | The discussion category name; required |
| `params.comments.giscus.categoryId` | string | | The discussion category ID; required |
| `params.comments.giscus.mapping` | string | pathname | How pages map to discussions |
| `params.comments.giscus.term` | string | | The discussion title or number when `mapping` is `specific` or `number`; the attribute is omitted when unset |
| `params.comments.giscus.strict` | string | 0 | Strict title matching |
| `params.comments.giscus.reactionsEnabled` | string | 1 | Shows reactions on the main post |
| `params.comments.giscus.emitMetadata` | string | 0 | Sends discussion metadata to the parent page |
| `params.comments.giscus.inputPosition` | string | top | Whether the input box sits above or below the list |
| `params.comments.giscus.theme` | string | auto | The giscus theme; `auto` follows the site's light/dark state |
| `params.comments.giscus.lightTheme` | string | light | The giscus theme or custom CSS URL used in light mode |
| `params.comments.giscus.darkTheme` | string | dark | The giscus theme or custom CSS URL used in dark mode |
| `params.comments.giscus.loading` | string | lazy | The iframe loading strategy |
| `params.comments.giscus.lang` | string | derived from the site language | The giscus interface language. Unset, a Chinese site resolves `zh-CN` / `zh-TW` / `zh-HK`, other languages take the base language code, and anything giscus does not support falls back to `en` |
| `params.comments.giscus.ariaLabel` | string | Comments | The `aria-label` on the comment container; the default is English, so a multilingual site writes one per language |
| `params.comments.giscus.errorMessage` | string | Comments could not be loaded. | Text shown when loading fails; the default is English, so a multilingual site writes one per language |
| `params.ui.feedback.enable` | boolean | false | The two "was this page helpful?" buttons at the page end; there is no backend, and a structured event is recorded when `gtag` is present |
| `params.ui.feedback.reasons` | boolean | true | Expands four optional reasons after "no" |
{.fields meta="type default"}

Missing any one of the four required giscus values leaves the comment section
unrendered: no error, and nothing appears.

## Repository links and page information {#repository}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.github_repo` | string | | The content repository URL, resolving "edit this page", "view history", "create child page" and "open a documentation issue" — see [Repository links and page info](/docs/customize/repository/) |
| `params.github_project_repo` | string | github_repo | The product repository URL, for "open a project issue" and the navbar GitHub entry |
| `params.github_branch` | string | main | The branch edit links point at |
| `params.github_subdir` | string | | The content site's subdirectory inside a monorepo |
| `params.path_base_for_github_subdir` | string or map | | Source path rewriting; the map form takes `from` and `to` |
| `params.github_url` | — | — | Removed; write `params.github_repo`. The migration registry that used to name the replacement is gone, so an old key is now simply an unread key |
| `params.ui.lastmod_commit` | enum | subject | What follows "last modified": `subject` the commit subject, `hash` the short hash, `none` nothing. An invalid value warns and falls back |
| `params.images` | string array | — | The site-level social card: fills `og:image` when a page has no image of its own. Metadata only; never rendered as a list thumbnail |
| `params.default_featured` | — | — | Removed; write `params.images`, or a section `cascade` carrying `images`. As above, an old key is now simply an unread key |
{.fields meta="type default"}

## Content runtimes {#runtimes}

Mermaid, KaTeX, ECharts, Infographic, Asciinema, Swagger UI and Redoc are
detected from the content and load only where a page uses them; they have no
site switch. Only these need a switch or an external endpoint:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.markmap` | boolean | false | Enables the mind map fence site-wide — see [Markmap](/docs/components/markmap/) |
| `params.mermaid` | map | | Configuration passed to `mermaid.initialize()`; keys are lowercase, and dark mode overrides `theme` automatically |
| `params.plantuml.enable` | boolean | false | Enables the PlantUML fence — see [PlantUML](/docs/components/plantuml/) |
| `params.plantuml.svg_image_url` | string | | The PlantUML service's SVG endpoint; required when enabled, and its absence fails the build |
| `params.plantuml.svg` | boolean | | Renders inline SVG instead of an `<img>` |
| `params.drawio.enable` | boolean | false | Enables the edit button on `.drawio.svg` images — see [Draw.io](/docs/components/drawio/) |
| `params.drawio.drawio_server` | string | | The Draw.io editor address; required when enabled, and its absence fails the build |
| `params.highlight_classes` | boolean | true | Emits Chroma classes for highlighting; `false` returns to Hugo's inline styles |
| `params.ui.code_copy` | boolean | true | The copy button on code blocks; `false` removes it globally, and a fence's own `copy=` still wins |
{.fields meta="type default"}

Mathematics needs no parameter, only the
[`passthrough` prerequisite](#goldmark).

## Output formats {#outputs}

The theme declares two custom output formats and **does not enable them for a
site**: request what you want under `outputs`.

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| Format | Output | Description |
| --- | --- | --- |
| `HTML` | `index.html` | The interactive form; required |
| `markdown` | `index.md` | Each page's plain Markdown twin, which "copy Markdown" and "view source" depend on — see [AI-agent support](/docs/customize/agents/) |
| `LLMS` | `llms.txt` | A plain-text format the theme declares, usually attached to `home` only |
| `print` | `_print/index.html` | The whole-section print page the theme declares — see [Print](/docs/customize/print/) |
| `RSS` | `index.xml` | Hugo's own; attach it to `section` so every section has a feed |

Two parameters for print output:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.print.toc` | boolean | true | Generates a table of contents at the top of the print page; `false` omits it |
| `params.print.section_break_wordcount` | integer | 50 | How many words a section needs before it starts a new print page |
{.fields meta="type default"}

## Languages and versions {#languages-versions}

Languages are defined with Hugo's own `languages` block, and the theme only
reads the translation relationships it establishes:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultContentLanguage` | string | en | The primary language, served without a path prefix |
| `languages.<lang>.label` | string | | The language's endonym, shown in the language menu |
| `languages.<lang>.locale` | string | | The full locale, used for `<html lang>` and SEO |
| `languages.<lang>.weight` | integer | | Language order, and the cycle order when clicking the language icon |
| `languages.<lang>.title` | string | | The site name in that language |
| `languages.<lang>.languageDirection` | string | ltr | Set `rtl` for a right-to-left language |
{.fields meta="type default"}

Paired files, anchor alignment and fallback for untranslated pages are in
[Languages](/docs/customize/i18n/).

Version parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.version` | string | | The identifier of this site variant, which need not be a Git ref — see [Versions](/docs/customize/versions/) |
| `params.version_menu` | string | Version | The version menu's title |
| `params.version_menu_pagelinks` | boolean | | On switching version, try the same path on the target site first |
| `params.versions` | list | | Version entries: `version`, `url`, `kind`; `name: '---'` is a divider |
| `params.archived_version` | boolean | | Shows the "this is an archived version" banner at the top |
| `params.url_latest_version` | string | | The link to the current version inside that banner |
| `params.time_format_blog` | string | Monday, January 02, 2006 | Blog date format, overridable per language |
| `params.time_format_default` | string | January 2, 2006 | All other date formats, overridable per language |
{.fields meta="type default"}

## Miscellaneous {#misc}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `taxonomies` | map | | Hugo's own: enables `tag: tags` / `category: categories` — see [Taxonomies](/docs/customize/taxonomy/) |
| `params.taxonomy.page_header` | list | | Shows only these taxonomies in a post header; unset shows all |
| `services.googleAnalytics.id` | string | | Hugo's own: the analytics script is injected in production builds only — see [Analytics and SEO](/docs/admin/analytics/) |
| `module.hugoVersion.min` | string | 0.160.1 | The Hugo floor the theme declares; anything older fails the build |
| `module.hugoVersion.extended` | boolean | true | Hugo Extended is required (SCSS has to be compiled) |
{.fields meta="type default"}

## Editor completion via generated schemas {#editor-schema}

The theme ships two generated JSON Schemas under its `schema/` directory:
`site-params.schema.json` for a site's `hugo.yaml` and
`front-matter.schema.json` for page front matter. They are projections of the
theme's own `hugo.yaml` defaults (with the comment documentation as hover
text) and its parameter-scan registry; the theme's CI regenerates them and
fails on drift, so they can never disagree with the theme you have pinned.

With the VS Code YAML extension, map the site schema in your settings:

```json {title=".vscode/settings.json"}
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/pgsty/oink/main/schema/site-params.schema.json": "hugo.yaml"
  }
}
```

Pin the URL to your release tag instead of `main` to match your `go.mod` pin.
Front matter completion depends on your Markdown tooling; point it at
`front-matter.schema.json` the same way. The front-matter schema deliberately
omits type constraints, because keys like `share` and `theme_color` accept a
bare-boolean opt-out beside their ordinary type.

## Verifying a configuration change {#verify}

Run a strict build after changing configuration:

```bash
hugo --printPathWarnings --panicOnWarning
```

It passes only when the output reads `Total in …` with no ERROR and no WARN.
Common errors and what they mean:

| Error fragment | Cause |
| --- | --- |
| `invalid params.ui.typography` | The presets are `technical` and `system` |
| `invalid footer_style … (allowed: fat \| slim \| none)` | A bad footer style; the error names the page |
| `invalid page_width … (allowed: normal \| wide \| full)` | A bad page width |
| `invalid params.ui.section_index … (allowed: list \| cards)` | A bad section index style |
| `invalid params.offline_search_index` | The scopes are `title`, `heading`, `summary`, `content` |
| `params.plantuml.enable requires an explicit params.plantuml.svg_image_url` | PlantUML enabled with no endpoint |
| `params.drawio.enable requires an explicit params.drawio.drawio_server` | Draw.io enabled with no server address |
| `params.search.algolia requires explicit appId, apiKey, and indexName` | All three Algolia values are required |
| `params.ui.image_zoom must be a boolean` | Written as the string `"true"` |
| `theme_color … is not a #rgb or #rrggbb hex color` | The value is not a hex color; the default palette is kept |
| `theme_color … reads at about N:1 against the theme's … canvas` | Advisory: the color ships, and the message prints the id that silences it |
| `theme_color_dark … has no theme_color to pair with` | The dark half was set without a valid `theme_color`; it is ignored and the default palette is kept in both modes |
| `command … must define exactly one of url or action` | A custom command gave both `url` and `action`, or neither |
| `invalid params.ui.sidebar_icon_policy …; using all` | Only a warning, but the value is misspelled |

A configuration change also needs at least three checks: one page in each
language, a page with no translation to see the fallback, and the links under
the production `baseURL` (easy to miss on a subpath deployment).

The theme's declared Hugo floor is `0.160.1`, and the currently verified version
is `0.164.0`. Building against both after a configuration change catches
anything that only works on the newer one:

```bash
# the floor binary
/path/to/hugo-0.160.1 --printPathWarnings --panicOnWarning
# the currently verified version
hugo --printPathWarnings --panicOnWarning
```

The floor is declared in the theme's `hugo.yaml` and `theme.toml`, and a site's
own `module.hugoVersion.min` should agree with it.

## Related {#related}

- [Brand and appearance](/docs/customize/brand/) — site name, logo, colours, fonts
- [Navigation and menus](/docs/customize/navigation/) — navbar menu, page actions, footer
- [Layouts and page types](/docs/customize/layout/) — shell, sidebar, table of contents
- [Page parameters](/docs/write/frontmatter/) — the full front matter table
- [Troubleshooting](/docs/admin/troubleshooting/) — locating a build failure
