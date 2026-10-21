---
title: Configuration
linkTitle: Configuration
description: Find every site parameter that the theme reads, with its type, default, description, and related guide.
weight: 10
search_keywords: [configuration, hugo.yml, parameters, params.ui, defaults, site settings, reference]
search_boost: 1.6
aliases:
  - /docs/configure/overview/
---

This page defines site parameters. Each key that the theme reads has a table
row below. The row gives its type, default, short description, and related
guide. The guides provide examples that you can copy. They do not repeat these
definitions. For page-level front matter parameters, see
[Page parameters](/docs/write/frontmatter/).

The tables are grouped by function, with one `##` per group. You can link to
their anchors, such as `/docs/customize/config/#sidebar`. **An empty default
column means the theme has no default**. If you omit the key, the feature is off.

## The layers of hugo.yml {#layers}

An OINK site's configuration has four kinds of key. Choose the layer that
controls the feature you want to change:

| Layer | Examples | Who defines it |
| --- | --- | --- |
| Hugo's own top-level keys | `baseURL` `title` `languages` `markup` `outputs` `taxonomies` `module` | Hugo itself. See [gohugo.io](https://gohugo.io/configuration/) for behavior |
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
    min: 0.168.0

params:
  offline_search: true
  github_repo: https://github.com/example/product-docs
```

## Configuration principles {#principles}

- **The theme's defaults are conservative; write only the keys you change.** Local search, image zoom, comments, feedback, and the light/dark menu are off by default. The site chooses its policy for these interactive features. Add keys as needed. Reducing a "complete configuration" can leave unnecessary keys.
- **There is no theme master switch.** There is no `oink.enabled` or `params.oink.*` namespace. No option switches between a "Docsy shell" and an "OINK shell". A switch that is absent from this page does not exist.
- **An invalid value warns and falls back to the documented default.** The setting `params.ui.typography: solarized` reports `invalid params.ui.typography "solarized" (allowed: technical | system) -- using "technical"`. The site still builds. The settings `footer_style: thin`, `page_width: huge`, and `section_index: grid` behave the same way. One typo therefore changes one setting instead of producing HTTP 500 on every URL under `hugo server`. Review the warning and fallback output before publication.
- **One warning keeps the value instead of dropping it.** If `theme_color` is below AA body-text contrast (4.5:1) against the theme canvas, the color still appears in output. The author may choose it for a custom canvas or brand requirement. The warning includes the `ignoreLogs` id that can silence it. This is advice, not rejection. Use a darker color or silence the warning with one configuration line. Review the actual contrast before publication. Only an unparseable hex value is discarded. It falls back to the default palette, like other invalid values.

- **The theme itself never stops the build.** Its templates contain no `errorf`. Every invalid value uses the warning and fallback behavior above. If an external endpoint is missing, PlantUML, Draw.io, or Algolia warns and stays off. The theme never chooses a public service for you. Incomplete upstream attribution produces a warning and omits the entire notice. A partial notice could appear complete. Hugo can still stop a build if a content reference resolves to nothing or its version is below `module.hugoVersion.min`.

## Page-level override precedence {#overrides}

Hugo's `.Param` lookup lets you override most parameters per page. It applies
the following precedence, from highest to lowest:

1. The page's own front matter;
2. `cascade` in an ancestor section's `_index.md` (nearer wins);
3. Site `params`.

**Remove the `ui.` prefix in front matter.** The site key
`params.ui.reading_time` becomes `reading_time` on a page. The theme ignores a
front matter `ui:` block and does not report it. If a setting has no effect,
first check [Page parameters](/docs/write/frontmatter/).

```yaml {title="content/docs/wide-reference.md"}
---
title: Wide reference
page_width: wide
navbar_enabled: false
footer_style: slim
reading_time: false
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

Use overrides for actual content differences. Separate visual systems on
individual pages can become inconsistent after a theme upgrade.

## The three Goldmark prerequisites {#goldmark}

Hugo does **not** merge a theme module's `markup` configuration into the site.
Put these three prerequisites in the site's own `hugo.yml`. Without them,
attribute lines, component HTML, and mathematics do not work:

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

Without `attribute.block`, `{.fields}`, `{.steps}`, and `{caption=…}` render as
literal text. Without `passthrough`, `\(x\)` does not become a formula.
Without `unsafe`, Hugo escapes the structure of steps and cards.

The setting `renderer.unsafe: true` also permits raw HTML in Markdown. It is
for trusted authors and is not a submission filter. Review untrusted content
in the contribution process.

## Site identity and brand {#identity}

Hugo's own top-level keys:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | | Site name, shown in the navbar, `<title>` and the footer |
| `baseURL` | string | | The production domain. Include the path segment for a subpath deployment |
| `copyright` | string | | Fallback for the copyright line, rendered as HTML when `params.copyright` is unset |
| `enableGitInfo` | boolean | false | Required before "last modified" and commit information exist |
| `enableRobotsTXT` | boolean | false | Generates `robots.txt` |
| `enableEmoji` | boolean | false | Allows `:smile:` shortcodes |
{.fields meta="type default"}

Theme parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.logo` | string | icons/logo.svg | Brand mark. May use an `assets/` resource or a `static/` path. See [Brand and appearance](/docs/customize/brand/#logo) |
| `params.wordmark` | string | | Horizontal wordmark. If set, replaces "icon + site name" in the navbar |
| `params.description` | string | | Site description, the meta fallback when a page has no `description` |
| `params.copyright` | string or map | | A string renders as Markdown. A map accepts `authors`, `from_year`, and `to_year`. The value `present` means this year |
| `params.footer_center_info` | string | Powered by [Oink](https://oink.pgsty.com) | Inline Markdown in the footer center. An empty string hides it |
| `params.author` | string or map | | The RSS author. A map accepts `name` and `email` |
| `params.ui.theme_color` | string | | `#rgb`/`#rrggbb` hex color for shell accent backgrounds. Does not affect prose links or inline code. See [Brand and appearance](/docs/customize/brand/#theme-color) |
| `params.ui.theme_color_dark` | string | derived | The dark accent color. If omitted, the theme derives it from `theme_color` until it meets AA contrast on the dark canvas |
{.fields meta="type default"}

There is no favicon parameter. The theme scans `static/` for conventional names
(`favicon.ico`, `favicon.svg`, `favicon-NxN.png`, `apple-touch-icon.png`,
`apple-touch-icon-NxN.png`). See
[Brand and appearance](/docs/customize/brand/#favicon).

## Shell types and section roots {#shell}

The shell follows the **page type**, not the path. Documentation can live in any
directory, with a cascade giving it `type: docs`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.shell_types` | list | [docs, book, blog, swagger] | Which types use the reading shell with a sidebar — see [Layouts and page types](/docs/customize/layout/#shell-types) |
| `params.ui.docs_section` | string | docs | The documentation section's root directory name, used for navigation resolution only |
| `params.ui.blog_section` | string | blog | The blog section's root directory name |
| `params.ui.docs_sidebar_root` | enum | section | With `section`, a docs sidebar starts at the documentation section. With `home`, it starts at the site home. An invalid value warns and uses a fallback |
| `params.ui.quick_links` | list | [docs_section, blog_section] | Top-level menu identifiers listed by the command palette on an empty query — see [Command palette](/docs/customize/panel/) |
| `params.ui.sidebar_root_enabled` | boolean | true | Allows a subsection to become its own sidebar tree with `sidebar_root_for: self` |
| `params.ui.sidebar_root_menu` | boolean | true | Shows the section switcher above the sidebar. With only one entry, it becomes a plain link |
| `params.ui.section_index` | enum | list | Child list style on a section index: `list` or `cards`, overridable per section |
| `params.ui.section_index_columns` | integer | 2 | Column count when `section_index: cards` |
{.fields meta="type default"}

## Expo albums {#expo}

OINK 1.3.0 adds `expo` to the default
`shell_types` list and supports these settings:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.expo.images` | string | `images/*` | Pattern for image resources in the bundle |
| `params.ui.expo.mode` | enum | `wall` | `wall`, `cards`, or `seamless` |
| `params.ui.expo.size` | integer | `240` | Target size from 160 to 360 CSS pixels |
{.fields meta="type default"}

A page's `expo` block replaces the site block. Absent fields use built-in
defaults. Stored reader choices override the author defaults for mode and size.
See [Expo defaults](/docs/write/expo/#defaults) for the complete rules.

## Blog {#blog}

Seven keys shape a blog section. They apply to the section named by
`params.ui.blog_section`, and each can be overridden per section through front
matter or a `cascade` on the blog root.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.featured_image` | enum | none | Controls the article's featured image on single pages and section indexes. The mode `none` renders nothing. The mode `banner` shows a 16:9 figure above the title. The mode `wash` shows the image behind the article header at a tenth of its opacity. The mode `hero` uses a full-bleed shell background and moves the opening down. It uses the same image as the page card and `og:image`, so they cannot differ. Without an image, every mode renders nothing |
| `params.ui.blog_index` | enum | list | Blog index form. The mode `list` shows rows. The mode `cards` shows image cards with dates and summaries. The mode `table` shows compact rows. All sort by date, newest first, without year groups. Only a standalone `table` with `blog_index_toggle: false` shows the complete section without pagination |
| `params.ui.blog_index_columns` | integer | 3 | Column count for `blog_index: cards`. Regardless of this value, uses two columns between md and xl breakpoints and one below md |
| `params.ui.blog_index_size` | integer | 12 | Posts per page for `list`, `cards`, and all three views when the toggle is enabled. A standalone `table` ignores it |
| `params.ui.blog_index_toggle` | boolean | false | Lets readers cycle through list, cards, and table in the index toolbar. Off by default because it adds all three forms to the document. Hidden forms load no images, but their markup remains |
| `params.ui.toc_style` | enum | fixed | Right-rail presentation. The mode `fixed` pins a panel to the viewport. The mode `flow` uses a wider panel in content flow. It starts with the article and pins only on scroll |
| `params.ui.toc_taxonomies` | boolean | true | Taxonomy term clouds in the right rail. If the rail has neither a table of contents nor clouds, it renders nothing |
{.fields meta="type default"}

Article authorship and series are taxonomies rather than parameters — see
[Taxonomies](/docs/customize/taxonomy/#authors) and
[Writing a blog](/docs/write/blog/).

## Navbar and footer {#navbar-footer}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.navbar_enabled` | boolean | true | Whether the site navbar renders; overridable with a top-level `navbar_enabled` on a page — see [Navigation and menus](/docs/customize/navigation/#navbar) |
| `params.ui.navbar_autohide` | boolean | false | The navbar retracts above the viewport. It returns when the pointer enters the wake zone. Inactive below 768px and on coarse pointers |
| `params.ui.footer_style` | enum | fat | `fat` is a multi-column grid plus the copyright line, `slim` is the copyright line only, `none` renders nothing. An invalid value warns and falls back |
| `params.ui.dark_mode` | boolean or map | false | `true` enables the dark palette and theme control. For only the control, use `dark_mode: { show_menu: true }` |
| `params.ui.breadcrumb` | boolean | true | Breadcrumbs; `false` turns them off. A top-level section already omits a one-level breadcrumb |
| `params.ui.page_context_menu.enable` | boolean | true | The page action split button beside the title |
| `params.ui.page_context_menu.assistant_links` | boolean | false | Shows "Open in ChatGPT / Claude"; clicking sends the full URL off-site |
| `params.ui.page_context_menu.links` | list | [] | Custom external actions; `url` supports the `{url}`, `{title}` and `{markdown_url}` placeholders |
| `params.ui.github_stars` | string or number | | Star count on the navbar GitHub mark. Uses a local constant and makes no request |
| `params.ui.alt_site` | map | | Sibling-site link in a single-language footer. Requires both `label` and an absolute `http(s)` `url` |
{.fields meta="type default"}

The fat footer's column data comes from `data/footer/<language>.yaml` rather
than from a parameter — see
[Navigation and menus](/docs/customize/navigation/#footer).

## Sidebar {#sidebar}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.sidebar_menu_compact` | boolean | true | Expands only the current branch and its neighbours |
| `params.ui.sidebar_menu_foldable` | boolean | true | Lets the reader expand and collapse sections |
| `params.ui.sidebar_menu_truncate` | integer | 2000 | Maximum rendered entries in one section. Truncates the remaining entries |
| `params.ui.sidebar_cache_limit` | integer | 500 | At this page count, reuses visible neutral navigation markup for matching language/root/effective settings. The browser adds active state |
| `params.ui.sidebar_width_min` | integer | 220 | Lower bound in pixels for drag-resizing on the desktop |
| `params.ui.sidebar_width_max` | integer | 480 | Upper bound in pixels for drag-resizing |
| `params.ui.sidebar_item_overflow` | enum | ellipsis | `ellipsis` truncates a long title, `wrap` wraps it |
| `params.ui.sidebar_icon_policy` | enum | all | Icon density: `all` everywhere, `groups` only on the root and nodes with children, `none` nowhere. An invalid value warns and falls back to `all` |
| `params.ui.sidebar_expand_levels` | integer | 2 | Tree levels expanded by default |
| `params.ui.sidebar_headings` | boolean or integer | false | For `type: book` only. Expands a heading branch below the current sidebar row. Accepts an integer from 2 to 4. The value `true` means 2 |
| `params.ui.sidebar_enabled` | boolean | true | The left sidebar. The value `false` disables it, usually per page instead of per site |
| `params.ui.taxonomy_icons` | map | | Right-column group icons by taxonomy plural, for example `tags: fa-solid fa-tags` |
{.fields meta="type default"}

For sidebar use, see [Layouts and page types](/docs/customize/layout/#sidebar).
The tree uses the structure of `content/`. See
[Organizing content](/docs/write/organize/).

## Table of contents {#toc}

Hugo's configuration sets the outline levels. The theme controls only tracking
behavior:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `markup.tableOfContents.startLevel` | integer | 2 | Hugo's own: the highest heading level collected |
| `markup.tableOfContents.endLevel` | integer | 3 | Hugo's own: the lowest heading level collected |
| `params.ui.scroll_spy` | boolean | false | Quiet 1.x compatibility no-op; the normal shell runtime always tracks the active outline heading and this key emits no asset |
{.fields meta="type default"}

Hide the outline on one page with the front matter `notoc: true` — see
[Page parameters](/docs/write/frontmatter/).

## Pager and page end {#page-end}

Page-end components have a fixed order: share → feedback → page information →
pager → comments. Each has its own switch. Backlinks appear in the right rail
beside the table of contents.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.share` | list | [] | Page-end share targets, in the order given, from `x` `bluesky` `mastodon` `facebook` `linkedin` `reddit` `hackernews` `telegram` `whatsapp` `line` `pinterest` `weibo` `chatgpt` `claude` `email` `copy`. An empty list disables the bar. Each target is a plain intent link. There is no SDK, iframe, third-party script, or share count. See [Writing a blog](/docs/write/blog/#share). An unknown target warns and is discarded |
| `params.ui.pager_types` | list | [docs, book, blog] | Types that show previous / next links. To disable them on a page, use front matter `pager: false`. An unknown type warns and is discarded |
| `params.ui.annotation` | boolean | true | The "last modified" and provenance block at the end of the body; the upstream attribution line is driven by the page's `upstream_link` family — see [Page parameters](/docs/write/frontmatter/#upstream) |
| `params.ui.backlinks` | boolean | false | Lists the pages that link to this one as a "Backlinks" group in the right rail beside the table of contents, derived at build time from ordinary links — see [Navigation and menus](/docs/customize/navigation/#backlinks) |
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
| `params.offline_search_on_serve` | boolean | true | Also builds the index under `hugo server`, so preview matches production. For a very large site, set `false` to reduce local rebuild time |
| `params.offline_search_index` | enum | content | Index scope, cumulative: `title`, `heading`, `summary`, `content`. An invalid value warns and uses `content` |
| `params.offline_search_summary_length` | integer | 70 | Word cut-off for the `summary` scope's excerpt |
| `params.offline_search_max_results` | integer | 10 | Result cap, bounding both Lunr and the CJK substring fallback |
| `params.ui.landing_search` | boolean | true | Whether a `layout: landing` page keeps a search entry point |
| `params.ui.command_palette.commands` | list | [] | Custom commands, each with either `url` or a built-in `action` — see [Command palette](/docs/customize/panel/#custom-commands) |
| `params.gcs_engine_id` | string | | A Google Programmable Search engine ID; enabling it brings in an external service |
| `params.search.algolia` | map | | Algolia DocSearch. You must supply `appId`, `apiKey`, and `indexName` explicitly. Otherwise, the theme warns and DocSearch remains off |
{.fields meta="type default"}

A custom command accepts only seven keys: `id`, `title`, `description`, `icon`,
`keywords`, `url`, and `action`. The `id` must match `^[a-z][a-z0-9_-]*$` and
must not duplicate a built-in action ID. Put per-language titles under
`languages.<lang>.params.ui.command_palette.commands`.

## Keyboard {#keyboard}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.keyboard_nav` | boolean | true | Single-key navigation for the tree (WASD / arrows), headings (j/k), paging (q/e), palette, and shell switches. With `false`, the runtime is excluded from the bundle. See [Keyboard navigation](/docs/customize/keyboard/) |
{.fields meta="type default"}

## Image zoom {#image-zoom}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.image_zoom` | boolean | false | Lets body images open at full size. Override per page with front matter `image_zoom`. A non-boolean warns and uses a fallback |
{.fields meta="type default"}

Which images become zoom candidates is in [Images](/docs/components/image/).

## Typography {#typography}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.preset` | enum | paper | Site-wide visual preset: `paper`, `slate`, or the explicit experiments `ink`, `terminal`. Available in 1.2.0; choose `slate` to retain the previous appearance |
| `params.ui.preset_menu` | boolean or list | false | `true` offers Paper, Slate and the site default; a list explicitly opts into experiments and must include the site default. Independent of `dark_mode` |
| `params.ui.typography` | enum | technical | `technical` uses the selected preset’s local fonts (Paper: Plex Sans; Slate: Inter); `system` uses the platform stack only and requests no brand font. An invalid value warns and falls back |
| `params.ui.fonts` | map | | Font-family names for the `ui`, `body`, `heading`, `code`, `display`, `meta`, `brand`, and `print` roles. The theme validates names but never loads font files. End each list with a generic family |
| `params.page_width` | enum | normal | Overall shell width: `normal`, `wide`, `full`; overridable per page |
| `params.reading_width` | enum | normal | Book body reading width: `slim`, `normal`, `wide`. Does not affect the shell |
{.fields meta="type default"}

Use `params.ui.fonts` when the faces already exist on the reader's system or the
site has declared them with `@font-face`. To bundle font files or change
lower-level typography, use the SCSS/CSS entry points. See
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
| `params.comments.giscus.lang` | string | derived from the site language | The giscus interface language. If unset, Chinese sites resolve `zh-CN` / `zh-TW` / `zh-HK`. Other languages use the base language code. Unsupported languages fall back to `en` |
| `params.comments.giscus.ariaLabel` | string | Comments | The comment container's `aria-label`. The default is English. For a multilingual site, write one per language |
| `params.comments.giscus.errorMessage` | string | Comments could not be loaded. | Text shown after loading fails. The default is English. For a multilingual site, write one per language |
| `params.ui.feedback.enable` | boolean | false | The two "was this page helpful?" buttons at the page end. There is no backend. Records a structured event if `gtag` is present |
| `params.ui.feedback.reasons` | boolean | true | Expands four optional reasons after "no" |
{.fields meta="type default"}

If a required giscus value is missing, the theme warns and skips the comment
section. Normal preview continues. Review the warning and confirm comments are disabled.
See [Comments](/docs/admin/comments/#enable) for the required fields.

## Repository links and page information {#repository}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.github_repo` | string | | The content repository URL, resolving "edit this page", "view history", "create child page" and "open a documentation issue" — see [Repository links and page info](/docs/customize/repository/) |
| `params.github_project_repo` | string | github_repo | The product repository URL, for "open a project issue" and the navbar GitHub entry |
| `params.github_branch` | string | main | The branch edit links point at |
| `params.github_subdir` | string | | The content site's subdirectory inside a monorepo |
| `params.path_base_for_github_subdir` | string or map | | Rewrites normalized `/` source paths. The map accepts `from` and `to`. External mounts require an explicit mapping to a repository-relative result. See [repository links](/docs/customize/repository/#imported-content). |
| `params.github_url` | — | — | Removed. Use `params.github_repo`. The old migration registry no longer names the replacement. The theme now ignores an old key |
| `params.ui.lastmod_commit` | enum | subject | What follows "last modified": `subject` the commit subject, `hash` the short hash, `none` nothing. An invalid value warns and falls back |
| `params.images` | string array | — | Site-level social card. Supplies `og:image` if a page has no image. Used only for metadata. Never rendered as a list thumbnail |
| `params.upstream_source` | string | — | Default `data/upstreams` record name for pages that declare `upstream_link`; page front matter can override it |
| `params.upstream_modified` | boolean | `false` | Site default for whether attributed material is adapted. A page can override it. No attribution renders without `upstream_link` |
| `params.default_featured` | — | — | Removed. Use `params.images` or a section `cascade` with `images`. As above, the theme now ignores an old key |
{.fields meta="type default"}

## Content runtimes {#runtimes}

The theme detects Mermaid, KaTeX, ECharts, Infographic, Asciinema, Swagger UI,
and Redoc from content. They load only on pages that use them, and only in
HTML output. They have no site switch. Only the features below need a switch
or external endpoint:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.markmap` | boolean | false | Enables the mind map fence site-wide — see [Markmap](/docs/components/markmap/) |
| `params.mermaid` | map | | Configuration passed to `mermaid.initialize()`. Keys are lowercase. Dark mode automatically overrides `theme` |
| `params.plantuml.enable` | boolean | false | Enables the PlantUML fence — see [PlantUML](/docs/components/plantuml/) |
| `params.plantuml.svg_image_url` | string | | PlantUML service SVG endpoint. Required when enabled. If absent, the theme warns and leaves PlantUML off |
| `params.plantuml.svg` | boolean | | Renders inline SVG instead of an `<img>` |
| `params.drawio.enable` | boolean | false | Enables the edit button on `.drawio.svg` images — see [Draw.io](/docs/components/drawio/) |
| `params.drawio.drawio_server` | string | | Draw.io editor address. Required when enabled. If absent, the theme warns and leaves Diagrams.net off |
| `params.highlight_classes` | boolean | true | Emits Chroma classes for highlighting; `false` returns to Hugo's inline styles |
| `params.ui.code_copy` | boolean | true | Copy button on code blocks. The value `false` removes it globally. A fence's own `copy=` still takes precedence |
{.fields meta="type default"}

Mathematics needs no parameter, only the
[`passthrough` prerequisite](#goldmark).

## Output formats {#outputs}

The theme declares custom output formats but **does not enable them for a
site**. Request the formats you need under `outputs`. You must explicitly enable
expensive aggregate and machine-readable outputs.

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| Format | Output | Description |
| --- | --- | --- |
| `HTML` | `index.html` | The interactive form; required |
| `markdown` | `index.md` | Plain Markdown version of each page. Required for "copy Markdown" and "view source". See [AI-agent support](/docs/customize/agents/) |
| `LLMS` | `llms.txt` | A plain-text format the theme declares, usually attached to `home` only |
| `LLMSFULL` | `llms-full.txt` | A top-level section opt-in: the same per-page Markdown concatenated in sidebar reading order, one bundle per language |
| `NAVJSON` | `navigation.json` | A home opt-in: the sidebar/pager navigation authority serialized once per language, validated by `schema/nav.v1.schema.json` |
| `print` | `_print/index.html` | The whole-section print page the theme declares — see [Print](/docs/customize/print/) |
| `BookManifest` | `book.json` | Optional Book-root JSON input for EPUB/PDF packaging tools. It is not an ebook |
| `RSS` | `index.xml` | Hugo's own format. Attach it to `section` to give each section a feed |

`LLMSFULL` and `BookManifest` are enabled in the relevant top-level section's
front matter rather than globally. `NAVJSON` belongs on `outputs.home`. The
complete examples and constraints are in [AI-agent support](/docs/customize/agents/)
and [Books](/docs/write/book/).

Two parameters for print output:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.print.toc` | boolean | true | Generates a table of contents at the top of the print page. The value `false` omits it |
| `params.print.section_break_wordcount` | integer | 50 | How many words a section needs before it starts a new print page |
{.fields meta="type default"}

## Languages and versions {#languages-versions}

Define languages with Hugo's `languages` block. The theme reads the translation
relationships that Hugo establishes:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultContentLanguage` | string | en | The primary language, served without a path prefix |
| `languages.<lang>.label` | string | | The language's endonym, shown in the language menu |
| `languages.<lang>.locale` | string | | The full locale, used for `<html lang>` and SEO |
| `languages.<lang>.weight` | integer | | Language order, and the cycle order when clicking the language icon |
| `languages.<lang>.title` | string | | The site name in that language |
| `languages.<lang>.direction` | string | ltr | Set `rtl` for a right-to-left language |
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
| `params.time_format_blog` | string | 2006-01-02 | Blog date format, overridable per language |
| `params.time_format_default` | string | 2006-01-02 | All other date formats, overridable per language |
{.fields meta="type default"}

## Miscellaneous {#misc}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `taxonomies` | map | | Hugo's own: enables `tag: tags` / `category: categories` — see [Taxonomies](/docs/customize/taxonomy/) |
| `params.taxonomy.page_header` | list | | Shows only listed taxonomies in a post header. If unset, shows all |
| `services.googleAnalytics.id` | string | | Hugo's own: the analytics script is injected in production builds only — see [Analytics and SEO](/docs/admin/analytics/) |
| `module.hugoVersion.min` | string | 0.168.0 | The theme's declared Hugo floor. An older version fails the build |
| `module.hugoVersion.extended` | boolean | true | Hugo Extended is required (SCSS has to be compiled) |
{.fields meta="type default"}

## Editor completion via generated schemas {#editor-schema}

The theme ships two generated JSON Schemas under `schema/`:
`site-params.schema.json` for site `hugo.yaml` and `front-matter.schema.json`
for page front matter. They derive from the theme's `hugo.yaml` defaults and
parameter-scan registry. Configuration comments supply hover text. Theme CI
regenerates the schemas and fails if they differ. Use the schema from the same
release tag as your theme pin.

With the VS Code YAML extension, map the site schema in your settings. This
example matches OINK v1.3.2; replace that tag with the one in your `go.mod`.
Both common YAML configuration filenames are covered:

```json {title=".vscode/settings.json"}
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/pgsty/oink/v1.3.2/schema/site-params.schema.json": ["hugo.yml", "hugo.yaml"]
  }
}
```

To check the association, temporarily give a known boolean, such as
`params.offline_search`, a string value. The editor should report the type
mismatch. Then restore the valid value. Front matter completion depends on
your Markdown tooling. Associate it with `front-matter.schema.json` in the
same way. The front matter schema deliberately omits type constraints. Keys
such as `share` and `theme_color` accept a bare-boolean opt-out as well as their
normal type.

## Verifying a configuration change {#verify}

Run a production build after changing configuration:

```bash
hugo --printPathWarnings
```

It passes only when the output reads `Total in …` with no ERROR; review warnings and accept only the known upstream LibSass notice.
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

After a configuration change, perform at least three checks. Open one page in
each language. Open a page without a translation to check fallback. Check
links under the production `baseURL`, including any deployment subpath.

The theme's minimum and single test baseline are Hugo Extended `0.168.0`.
Validate configuration changes with this version. Keep the default baseline pinned; do not run older-Hugo compatibility tests or add adaptation:

```bash
# require v0.168.0+extended in this output
hugo version
hugo --printPathWarnings
```

The theme declares the minimum in `hugo.yaml` and `theme.toml`. The site's
`module.hugoVersion.min` should match it. Update these declarations, CI pins,
and current documentation together when advancing the baseline.

## Related {#related}

- [Brand and appearance](/docs/customize/brand/) — site name, logo, colors, fonts
- [Navigation and menus](/docs/customize/navigation/) — navbar menu, page actions, footer
- [Layouts and page types](/docs/customize/layout/) — shell, sidebar, table of contents
- [Page parameters](/docs/write/frontmatter/) — the full front matter table
- [Troubleshooting](/docs/admin/troubleshooting/) — locating a build failure
