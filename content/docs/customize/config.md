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

Every site-wide setting OINK reads lives in `hugo.yml` and appears in a table
on this page with its type, its default and a link to the guide that shows it
in use. The defaults are conservative: local search, image zoom, comments, page
feedback and the light/dark menu stay off until you turn them on, so your
configuration only needs the keys you want to change. There is no master
switch and no `params.oink.*` namespace, so a key that is not on this page does
nothing. Settings for a single page are in
[Page parameters](/docs/write/frontmatter/).

An empty Default cell means the theme has no default and the feature stays off
until you set the key. Each group has its own anchor, such as
`/docs/customize/config/#sidebar`.

## The layers of hugo.yml {#layers}

Configuration keys come in four layers, and the layer tells you where a key's
behavior is documented:

| Layer | Examples | Who defines it |
| --- | --- | --- |
| Hugo's own top-level keys | `baseURL` `title` `languages` `markup` `outputs` `taxonomies` `module` | Hugo itself. See [gohugo.io](https://gohugo.io/configuration/) for behavior |
| Top-level `params` | `logo` `offline_search` `github_repo` `version` `page_width` `comments` | Site-level options the theme reads |
| `params.ui.*` | `navbar_enabled` `sidebar_width_min` `typography` `pager_types` | The shell, navigation and reading interface |
| `params.<runtime>` | `mermaid` `plantuml` `drawio` `markmap` | Each content runtime's own switch and endpoint |

A working site needs only the first two layers, including the Goldmark
settings that OINK's Markdown components depend on:

```yaml {title="hugo.yml"}
title: Product Docs
baseURL: https://docs.example.com/
defaultContentLanguage: en
enableGitInfo: true

markup:
  goldmark:
    renderer:
      unsafe: true
    parser:
      attribute:
        block: true
      wrapStandAloneImageWithinParagraph: false
  highlight:
    noClasses: false

module:
  imports:
    - path: github.com/pgsty/oink

params:
  offline_search: true
  github_repo: https://github.com/example/product-docs
```

## When a value is wrong {#principles}

OINK checks every value it reads. When it cannot use one, such as a misspelled
choice, a string where a boolean belongs, or a color that is not hex, it prints
a warning that names the key, the value and the fallback, then continues with
the documented default:

```text
WARN invalid params.ui.typography "solarized" (allowed: technical | system) -- using "technical"
```

The site keeps building, so a typo under `hugo server` changes one setting
instead of taking every page down. The same applies to front matter overrides,
where the warning also names the page. Read the warnings after each change,
because a warning usually means a feature you expected is running on its
default or is switched off; [Verifying a configuration change](#verify) lists
the common ones.
For the same reason, leave Hugo's `--panicOnWarning` off: OINK reports
fallbacks as warnings on purpose, and the flag would turn each one into a
failed build.

Features that depend on an outside service stay off until their configuration
is complete. Draw.io without `drawio_server`, maps without `tiles` and
`attribution`, Algolia without all three keys and giscus without its four
required values each warn and render nothing; the theme never substitutes a
public service of its own choosing. Upstream attribution that is missing
required fields also warns and is left out entirely, because a partial credit
line would look complete.

One check keeps your value. If `theme_color` reads below 4.5:1, the AA
contrast for body text, against the theme's canvas, the color still ships,
since a custom canvas or a brand rule may justify it. The warning prints an
`ignoreLogs` id you can add to silence it. Only a value that is not a hex color
is dropped, leaving the default palette.

Hugo itself can still stop a build when a content reference resolves to no
page.

## Page-level override precedence {#overrides}

Most parameters can be overridden for one page or a whole section. Hugo's
`.Param` lookup takes the first value it finds, in this order:

1. The page's own front matter;
2. `cascade` in an ancestor section's `_index.md` (the nearest wins);
3. Site `params`.

**Drop the `ui.` prefix in front matter.** The site key `params.ui.reading_time`
becomes `reading_time` on a page. The theme silently ignores a `ui:` block in
front matter, so when an override seems to have no effect, check the key name
against [Page parameters](/docs/write/frontmatter/) first.

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

Override where the content genuinely differs. A page that rebuilds its own
visual system out of overrides tends to drift out of step with the rest of the
site after a theme upgrade.

## The three Goldmark prerequisites {#goldmark}

Hugo does **not** merge a theme module's `markup` settings into the site, so
these lines belong in your own `hugo.yml`:

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

The first three settings are the prerequisites every OINK site needs; the rest
switch on math, theme-aware highlighting and a deeper outline. Each one shows
a visible symptom when it is missing:

| Setting | Without it |
| --- | --- |
| `parser.attribute.block: true` | Attribute lines such as `{.fields}`, `{.steps}` and `{caption=…}` print as literal text |
| `parser.wrapStandAloneImageWithinParagraph: false` | A standalone image cannot take an attribute line, so captions and numbered figures do not work |
| `renderer.unsafe: true` | Hugo escapes the HTML that steps, cards and `{{%/* … */%}}` shortcodes produce |
| `extensions.passthrough` | `\(x\)` and `$$…$$` stay as text instead of becoming formulas |
| `highlight.noClasses: false` | Code is colored with inline styles, so it cannot switch palette with dark mode |
| `tableOfContents.endLevel: 4` | Optional: without it the outline stops at `###` headings |

`renderer.unsafe: true` also lets raw HTML in Markdown through. That suits a
team writing its own documentation, but it is not a filter: if the site
publishes contributions from untrusted authors, review them before they merge.

## Site identity and brand {#identity}

Hugo's own keys name the site and turn on Git metadata:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | | Site name, shown in the navbar, `<title>` and the footer |
| `baseURL` | string | | The production domain. Include the path segment for a subpath deployment |
| `copyright` | string | | Fallback copyright line, rendered as HTML when `params.copyright` is unset |
| `enableGitInfo` | boolean | false | Needed for "last modified" dates and commit information |
| `enableRobotsTXT` | boolean | false | Generates `robots.txt` |
| `enableEmoji` | boolean | false | Allows `:smile:` emoji shortcodes |
{.fields meta="type default"}

The theme's keys add the logo, footer text and accent color:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.logo` | string | icons/logo.svg | Brand mark, from an `assets/` resource or a `static/` path. See [Brand and appearance](/docs/customize/brand/#logo) |
| `params.wordmark` | string | | Horizontal wordmark shown beside the logo in place of the site name. Below 992 px the navbar shows the logo alone |
| `params.description` | string | | Site description, used as the meta description when a page has none |
| `params.copyright` | string or map | | A string renders as Markdown. A map takes `authors`, `from_year` and `to_year`; `present` means the current year |
| `params.footer_center_info` | string | Powered by [Oink](https://oink.pgsty.com) | Inline Markdown in the middle of the footer. An empty string hides it |
| `params.author` | string or map | | The RSS author. A map takes `name` and `email` |
| `params.ui.theme_color` | string | | `#rgb` or `#rrggbb` accent for the shell's colored backgrounds. Prose links and inline code keep their own colors. See [Brand and appearance](/docs/customize/brand/#theme-color) |
| `params.ui.theme_color_dark` | string | derived | The dark-mode accent. When omitted, the theme lightens `theme_color` until it meets AA contrast on the dark canvas |
{.fields meta="type default"}

Favicons have no parameter: the theme picks up the conventional file names in
`static/` (`favicon.ico`, `favicon.svg`, `favicon-NxN.png`,
`apple-touch-icon.png`, `apple-touch-icon-NxN.png`). See
[Brand and appearance](/docs/customize/brand/#favicon).

## Shell types and section roots {#shell}

The reading shell follows a page's **type**, not its folder, so documentation
can live in any directory as long as a cascade gives it `type: docs`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.shell_types` | list | [docs, book, blog, swagger, expo] | Types that get the reading shell with a sidebar. See [Layouts and page types](/docs/customize/layout/#shell-types) |
| `params.ui.docs_section` | string | docs | Folder name of the documentation section, used only to resolve navigation |
| `params.ui.blog_section` | string | blog | Folder name of the blog section |
| `params.ui.docs_sidebar_root` | enum | section | Where a docs sidebar starts: `section` at the documentation section, `home` at the site home |
| `params.ui.quick_links` | list | [docs_section, blog_section] | Top-level menu identifiers the command palette lists before you type. See [Command palette](/docs/customize/panel/) |
| `params.ui.sidebar_root_enabled` | boolean | true | Lets a subsection become its own sidebar tree with `sidebar_root_for: self` |
| `params.ui.sidebar_root_menu` | boolean | true | Section switcher above the sidebar. With a single entry it becomes a plain link |
| `params.ui.section_index` | enum | list | How a section index lists its children: `list` or `cards`. Overridable per section |
| `params.ui.section_index_columns` | integer | 2 | Columns when `section_index: cards` |
{.fields meta="type default"}

## Expo albums {#expo}

Site-wide defaults for [Expo albums](/docs/write/expo/). A page's own `expo`
block replaces this block as a whole and takes built-in defaults for the fields
it leaves out, and a reader's saved mode and size override both. The complete
rules are in [Expo defaults](/docs/write/expo/#defaults).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.expo.images` | string | `images/*` | Pattern that selects the image resources in the page bundle |
| `params.ui.expo.mode` | enum | `wall` | `wall`, `cards` or `seamless` |
| `params.ui.expo.size` | integer | `240` | Target tile size, from 160 to 360 CSS pixels |
{.fields meta="type default"}

## Blog {#blog}

These keys shape the section named by `params.ui.blog_section`, and each can be
overridden for one section through front matter or a `cascade` on the blog
root. The [blog layout guide](/docs/write/blog/#list) compares the four index
layouts side by side.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.featured_image` | enum | none | How a post's featured image appears on its page and in section indexes: `none` shows nothing, `banner` a 16:9 figure above the title, `wash` the image behind the article header at one-tenth opacity, `hero` a full-bleed background behind the shell that moves the opening down. It is the same image as the post card and `og:image`, so the three always agree. Without an image, every mode shows nothing |
| `params.ui.blog_index` | enum | list | `list` horizontal entries, `cards` image cards, `table` compact rows, `gallery` linked covers. All are newest first; `table` always lists the whole section on one page |
| `params.ui.blog_index_columns` | integer | 3 | Columns for `blog_index: cards` from the xl breakpoint up. Between md and xl there are always two columns, below md one |
| `params.ui.blog_index_size` | integer | 12 | Posts per page for `list`, `cards` and `gallery`, and for all four layouts when `blog_index_toggle` is on. A standalone `table` ignores it |
| `params.ui.blog_index_toggle` | boolean | false | Publishes all four layouts and lets readers cycle `list` → `cards` → `table` → `gallery`, remembering their choice. When false, only the configured layout is published |
| `params.ui.blog_gallery.mode` | enum | wall | Tile arrangement inside `gallery`: `wall` with 6px gaps, `seamless` with none, `cards` as a masonry with visible captions. Independent of `blog_index` |
| `params.ui.blog_gallery.size` | integer | 240 | Target gallery tile size, 160–360 CSS pixels. It does not change the number of posts per page |
| `params.ui.toc_style` | enum | fixed | Right-rail presentation: `fixed` pins a panel to the viewport; `flow` uses a wider panel that starts level with the article and pins only once you scroll |
| `params.ui.toc_taxonomies` | boolean | true | Taxonomy term clouds in the right rail. A rail with neither an outline nor clouds is not rendered |
{.fields meta="type default"}

A page or cascade `blog_gallery` block replaces the whole site block. Fields it
leaves out take `wall` and `240`. A reader's saved arrangement and size
override the author's defaults and are kept separately from Expo preferences.
See [Gallery](/docs/write/blog/#list-gallery).

Authors and series are taxonomies rather than parameters; see
[Taxonomies](/docs/customize/taxonomy/#authors) and
[Writing a blog](/docs/write/blog/).

## Navbar and footer {#navbar-footer}

The navbar, the footer and the page-action menu at the right end of the
breadcrumb row:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.navbar_enabled` | boolean | true | Whether the site navbar renders. A page overrides it with a top-level `navbar_enabled`. See [Navigation and menus](/docs/customize/navigation/#navbar) |
| `params.ui.navbar_autohide` | boolean | false | The navbar slides up out of view and returns when the pointer reaches its wake zone at the top. Inactive below 768px and on coarse pointers |
| `params.ui.footer_style` | enum | fat | `fat` is a multi-column grid plus the copyright line, `slim` the copyright line only, `none` nothing |
| `params.ui.dark_mode` | boolean or map | false | `true` turns on the dark palette and the light/dark control. `{ show_menu: true }` implies `enable: true`; `{ enable: true, show_menu: false }` keeps the palette without showing the menu control |
| `params.ui.breadcrumb` | boolean | per-shell (`true`; `false` in `blog`) | Breadcrumbs above the title. A top-level section never shows a one-level breadcrumb |
| `params.ui.page_context_menu.enable` | boolean | true | The page-action split button at the right end of the breadcrumb row |
| `params.ui.page_context_menu.assistant_links` | boolean | false | Adds "Open in ChatGPT" and "Open in Claude". A click sends the page's full URL to that site |
| `params.ui.page_context_menu.links` | list | [] | Your own external actions. `url` may use the `{url}`, `{title}` and `{markdown_url}` placeholders |
| `params.ui.github_stars` | string or number | | Star count on the navbar GitHub mark. It is a constant you write; the page makes no request |
| `params.ui.alt_site` | map | | Link to a sibling site in a single-language footer. Needs both `label` and an absolute `http(s)` `url` |
{.fields meta="type default"}

The fat footer's columns come from `data/footer/<language>.yaml`, not from a
parameter; see [Navigation and menus](/docs/customize/navigation/#footer).

## Sidebar {#sidebar}

How the left navigation tree renders. Its structure comes from the `content/`
folders ([Organizing content](/docs/write/organize/)), and
[Layouts and page types](/docs/customize/layout/#sidebar) shows these keys in
use.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.sidebar_menu_compact` | boolean | true | Expands only the current branch and its neighbours |
| `params.ui.sidebar_menu_foldable` | boolean | true | Lets the reader expand and collapse sections |
| `params.ui.sidebar_menu_truncate` | integer | 2000 | Most entries rendered in one section; the rest are cut |
| `params.ui.sidebar_cache_limit` | integer | 500 | From this page count on, pages that share a language, sidebar root and effective settings reuse one copy of the navigation markup, and the browser marks the active entry |
| `params.ui.sidebar_width_min` | integer | 220 | Narrowest width, in pixels, the reader can drag the sidebar to on the desktop |
| `params.ui.sidebar_width_max` | integer | 480 | Widest width, in pixels, for drag-resizing |
| `params.ui.sidebar_item_overflow` | enum | ellipsis | A long title is cut with `ellipsis` or wraps with `wrap` |
| `params.ui.sidebar_icon_policy` | enum | all | Icon density: `all` everywhere, `groups` only on the root and on entries with children, `none` nowhere |
| `params.ui.sidebar_expand_levels` | integer | 2 | Tree levels expanded by default |
| `params.ui.sidebar_headings` | boolean or integer | false | `type: book` only: shows the current page's headings as a branch under its sidebar row. Takes an integer from 2 to 4; `true` means 2 |
| `params.ui.sidebar_enabled` | boolean | true | The left sidebar. Usually turned off per page rather than for the whole site |
| `params.ui.taxonomy_icons` | map | built-in | Icons per taxonomy, keyed by plural. Each taxonomy has two: `taxonomy` for the whole classification, such as a right-rail cloud heading, and `term` for one term's badge. A string such as `tags: fa-solid fa-tags` sets both; a map with `taxonomy` and `term` sets them separately, and a key it leaves out keeps the built-in. Built-in pairs cover `tags`, `categories`, `modules`, `authors` and `series`; any other taxonomy uses a generic shapes icon |
{.fields meta="type default"}

## Table of contents {#toc}

Hugo decides which heading levels the right-hand outline collects; the theme
only controls how it follows your reading. Hide the outline on one page with
`notoc: true` ([Page parameters](/docs/write/frontmatter/)).

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `markup.tableOfContents.startLevel` | integer | 2 | Hugo's own: the highest heading level collected |
| `markup.tableOfContents.endLevel` | integer | 3 | Hugo's own: the lowest heading level collected |
| `params.ui.scroll_spy` | boolean | false | No effect: the outline always highlights the current heading. Safe to delete from older configurations |
{.fields meta="type default"}

## Pager and page end {#page-end}

The blocks at the end of a page always come in the same order: share,
feedback, page information, pager, comments. Each has its own switch.
Backlinks sit in the right rail beside the outline.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.share` | list | [] | Share targets at the page end, in the order listed, chosen from `x` `bluesky` `mastodon` `facebook` `linkedin` `reddit` `hackernews` `telegram` `whatsapp` `line` `pinterest` `weibo` `chatgpt` `claude` `email` `copy`. An empty list hides the bar. Each target is a plain link, with no SDK, iframe, third-party script or share count. An unknown target warns and is dropped. See [Writing a blog](/docs/write/blog/#share) |
| `params.ui.pager_types` | list | [docs, book, blog] | Types that show previous and next links. Turn them off on one page with `pager: false`. An unknown type warns and is dropped |
| `params.ui.annotation` | boolean | true | The "last modified" and provenance block at the end of the body. Upstream attribution comes from the page's `upstream_link` keys; see [Page parameters](/docs/write/frontmatter/#upstream) |
| `params.ui.backlinks` | boolean | false | A "Backlinks" group in the right rail listing the pages that link here, worked out at build time from ordinary links. See [Navigation and menus](/docs/customize/navigation/#backlinks) |
| `params.ui.compare` | boolean | false | Duo View: two panes side by side on Docs, Book and blog pages that have an HTML translation on the same site. A language can set it to `false` to opt out. See [Duo view](/docs/customize/i18n/#bilingual-view) |
| `params.ui.translation_notice` | language code or false | false | The language code of the authoritative version, so that a translated page shows a line pointing back to it. A page opts out with `translation_notice: false` |
| `params.ui.reading_time` | boolean | false | Reading time under the page title |
| `params.ui.book_draft_banner` | boolean | false | A banner at the top of a draft Book page |
{.fields meta="type default"}

## Search and command palette {#search}

Local search is off by default. Turning it on also brings up the command
palette, which opens from the navbar magnifier, {{< kbd "Cmd/Ctrl" "K" >}}, `/`
and `\`.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.offline_search` | boolean | false | Builds one local index per language and turns on the command palette. See [Search](/docs/customize/search/) |
| `params.offline_search_on_serve` | boolean | true | Builds the index under `hugo server` too, so the preview searches like production. On a very large site, `false` speeds up local rebuilds |
| `params.offline_search_index` | enum | content | How much of each page is indexed, each level adding to the one before: `title`, `heading`, `summary`, `content` |
| `params.offline_search_summary_length` | integer | 70 | Length, in characters, of the excerpt stored for each page; a result shows it when no passage matches |
| `params.offline_search_max_results` | integer | 10 | Most page results one search returns |
| `params.ui.landing_search` | boolean | true | Keeps a search entry point on `layout: landing` pages |
| `params.ui.command_palette.commands` | list | [] | Your own palette commands, each with either a `url` or a built-in `action`. See [Command palette](/docs/customize/panel/#custom-commands) |
| `params.gcs_engine_id` | string | | A Google Programmable Search engine ID. Searches then go to Google |
| `params.search.algolia` | map | | Algolia DocSearch. `appId`, `apiKey` and `indexName` are all required |
{.fields meta="type default"}

A custom command takes only seven keys: `id`, `title`, `description`, `icon`,
`keywords`, `url` and `action`. The `id` must match `^[a-z][a-z0-9_-]*$` and
must not repeat a built-in action ID. Put per-language titles under
`languages.<lang>.params.ui.command_palette.commands`.

## Keyboard {#keyboard}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.keyboard_nav` | boolean | true | Twenty-nine single-key shortcuts for navigation, page actions and the view, plus the browsing history and the reader's column width. With `false`, the runtime is left out of the page, so nothing is bound, recorded or restored. See [Keyboard navigation](/docs/customize/keyboard/) |
{.fields meta="type default"}

## Image zoom {#image-zoom}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.image_zoom` | boolean | false | Lets body images open full size. A page overrides it with `image_zoom` in front matter |
{.fields meta="type default"}

[Images](/docs/components/image/) explains which images can be zoomed.

## Typography {#typography}

The visual preset, the fonts and the page widths:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.ui.preset` | enum | paper | Site-wide look: `paper` or `slate`, or the explicit experiments `github`, `ink`, `news` and `terminal` |
| `params.ui.preset_menu` | boolean or list | false | `true` lets readers choose Paper, Slate or the site default. A list names the presets offered, may include the experiments, and must include the site default. Independent of `dark_mode` |
| `params.ui.typography` | enum | technical | `technical` uses the selected preset's bundled fonts (Paper: Plex Sans; Slate: Inter); `system` uses the platform font stack and requests no brand font |
| `params.ui.fonts` | map | | Font-family names for the `ui`, `body`, `heading`, `code`, `display`, `meta`, `brand` and `print` roles. The theme checks the names but loads no font files. End each list with a generic family |
| `params.page_width` | enum | normal | Overall shell width: `normal`, `wide`, `full`. Overridable per page |
| `params.reading_width` | enum | normal | Body text width on Book pages: `slim`, `normal`, `wide`. The shell is unaffected |
{.fields meta="type default"}

`params.ui.fonts` suits faces that are already on the reader's system or that
the site declares with `@font-face`. To ship font files with the site or
change finer typography, use the project stylesheet; see
[Brand and appearance](/docs/customize/brand/#fonts).

## Comments and feedback {#comments-feedback}

Comments use giscus, which keeps each page's discussion in a GitHub repository;
page feedback is two buttons with no backend of its own.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.comments.enable` | boolean | false | Site-wide comment switch. A page overrides it with `comments` in front matter. See [Comments](/docs/admin/comments/) |
| `params.comments.type` | string | giscus | Only `giscus` renders today |
| `params.comments.giscus.repo` | string | | The GitHub repository that holds the discussions; required |
| `params.comments.giscus.repoId` | string | | The repository ID; required |
| `params.comments.giscus.category` | string | | The discussion category name; required |
| `params.comments.giscus.categoryId` | string | | The discussion category ID; required |
| `params.comments.giscus.mapping` | string | pathname | How pages map to discussions |
| `params.comments.giscus.term` | string | | The discussion title or number when `mapping` is `specific` or `number`. Omitted when unset |
| `params.comments.giscus.strict` | string | 0 | Strict title matching |
| `params.comments.giscus.reactionsEnabled` | string | 1 | Shows reactions on the main post |
| `params.comments.giscus.emitMetadata` | string | 0 | Sends discussion metadata to the parent page |
| `params.comments.giscus.inputPosition` | string | top | Whether the input box sits above or below the comments |
| `params.comments.giscus.theme` | string | auto | The giscus theme. `auto` follows the site's light/dark state |
| `params.comments.giscus.lightTheme` | string | OINK palette | giscus theme name or custom CSS URL for light mode. By default, OINK's own stylesheet for the active preset, so comments match the page |
| `params.comments.giscus.darkTheme` | string | OINK palette | giscus theme name or custom CSS URL for dark mode. By default, OINK's own stylesheet for the active preset |
| `params.comments.giscus.loading` | string | lazy | `lazy` requests the giscus script only when the reader nears the comments, except on return from GitHub sign-in; `eager` requests it at once |
| `params.comments.giscus.lang` | string | derived from the site language | The giscus interface language. When unset, Chinese sites resolve to `zh-CN`, `zh-TW` or `zh-HK` and other languages use their base code; a language giscus does not support falls back to `en` |
| `params.comments.giscus.ariaLabel` | string | translated | The comment container's `aria-label`. The default is "Comments" in the page's language |
| `params.comments.giscus.errorMessage` | string | translated | Text shown when loading fails. The default is "Comments could not be loaded." in the page's language |
| `params.ui.feedback.enable` | boolean | false | "Was this page helpful?" buttons at the page end. There is no backend; when `gtag` is present, each answer is recorded as a structured event |
| `params.ui.feedback.reasons` | boolean | true | Offers four optional reasons after "no" |
{.fields meta="type default"}

Without all four required giscus values, the page has no comment section.
[Comments](/docs/admin/comments/#enable) shows where to find them.

## Repository links and page information {#repository}

Links from each page back to its source, and the information block at its end:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.github_repo` | string | | URL of the repository that holds the content. Drives "Edit this page", "View edit history", "Create child page" and "Create docs issue". See [Repository links and page info](/docs/customize/repository/) |
| `params.github_project_repo` | string | github_repo | URL of the product repository, for "Create project issue" and the navbar GitHub entry |
| `params.github_branch` | string | main | The branch that edit links point at |
| `params.github_subdir` | string | | The content site's subdirectory inside a monorepo |
| `params.path_base_for_github_subdir` | string or map | | Rewrites source paths (normalized to `/`) before they become repository links. A map takes `from` and `to`. Content mounted from outside the repository needs an explicit mapping to a repository-relative path. See [repository links](/docs/customize/repository/#imported-content) |
| `params.github_url` | — | — | Removed and ignored. Use `params.github_repo` |
| `params.ui.lastmod_commit` | enum | subject | What follows "last modified": `subject` the commit subject, `hash` the short hash, `none` nothing |
| `params.images` | string array | — | Site-wide social card: supplies `og:image` for pages without their own image. Metadata only; never shown as a list thumbnail |
| `params.upstream_source` | string | — | Default `data/upstreams` record for pages that declare `upstream_link`. A page's front matter can override it |
| `params.upstream_modified` | boolean | `false` | Site default for whether attributed material has been adapted. A page can override it. Nothing renders without `upstream_link` |
| `params.default_featured` | — | — | Removed and ignored. Use `params.images`, or `images` in a section `cascade` |
{.fields meta="type default"}

## Content runtimes {#runtimes}

Mermaid, KaTeX, ECharts, Infographic, Asciinema, Swagger UI and Redoc load by
themselves on the pages that use them, and only in HTML output, so they have
no switch. The features below need one, mostly because they talk to a service
you choose. PlantUML renders in the reader's browser unless you set
`svg_image_url`, which hands rendering to a server;
[PlantUML](/docs/components/plantuml/) compares the two modes.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.markmap` | boolean | false | Turns on the mind-map fence site-wide. See [Markmap](/docs/components/markmap/) |
| `params.mermaid` | map | | Configuration passed to `mermaid.initialize()`. Keys are lowercase. Dark mode overrides `theme` automatically |
| `params.plantuml` | boolean or map | disabled | `true` turns on local rendering; `false` turns off all PlantUML rendering |
| `params.plantuml.enable` | boolean | false | Turns on local PlantUML rendering. See [PlantUML](/docs/components/plantuml/) |
| `params.plantuml.svg_image_url` | string | | Optional PlantUML server endpoint. Without it, diagrams render in the browser |
| `params.plantuml.svg` | boolean | false | Server mode only: inline SVG instead of an `<img>` |
| `params.drawio.enable` | boolean | false | Adds an edit button to `.drawio.svg` images. See [Draw.io](/docs/components/drawio/) |
| `params.drawio.drawio_server` | string | | Address of the Draw.io editor. Required when `enable` is true |
| `params.video_embeds` | list | `[]` | Platforms (`youtube`, `bilibili`, `vimeo`) whose player loads in place after a reader clicks a video card. Empty: cards only link out. See [Video](/docs/components/video/#platforms) |
| `params.map` | boolean or map | disabled | Interactive maps above `map` place lists. See [Map](/docs/components/map/) |
| `params.map.enable` | boolean | false | Turns on interactive maps; needs `tiles` and `attribution` |
| `params.map.tiles` | string | | HTTPS tile template with `{z}`, `{x}` and `{y}` (`{s}`, `{r}` and `{-y}` allowed; any other placeholder warns and the template is ignored). The theme names no tile service; required when enabled |
| `params.map.attribution` | string | | The plain-text attribution the tile service requires. Required when enabled |
| `params.map.attribution_url` | string | | Optional `https://` URL turning `attribution` into a clickable link |
| `params.map.dark_tiles` | string | | Optional tile template for dark mode |
| `params.map.subdomains` | string | | Optional `{s}` subdomain characters as a quoted string (e.g. `abcd`, `"01234567"`); empty uses Leaflet's `abc` |
| `params.map.max_zoom` | integer | 19 | Highest zoom level, 1–22 |
| `params.map.loading` | `lazy` \| `click` | `lazy` | Mount near viewport (`lazy`) or wait for a reader click (`click`) |
| `params.highlight_classes` | boolean | true | Emits Chroma classes for syntax highlighting; `false` returns to Hugo's inline styles |
| `params.ui.code_copy` | boolean | true | Copy button on code blocks. `false` removes it site-wide; a fence's own `copy=` still wins |
| `params.ui.rich_copy` | boolean | true | Typeset HTML copy for article prose selections pasted into rich-text editors; overridable per page or cascade. See [Copying into rich-text editors](/docs/customize/print/#typeset-copy) |
{.fields meta="type default"}

Math needs no parameter, only the [`passthrough` setting](#goldmark).

## Output formats {#outputs}

The theme defines extra output formats but turns none of them on, because some
are expensive to build and most sites need only a few. List the ones you want
under `outputs`:

```yaml {title="hugo.yml"}
outputs:
  home: [HTML, markdown, LLMS, NAVJSON]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| Format | Output | Description |
| --- | --- | --- |
| `HTML` | `index.html` | The interactive page; required |
| `markdown` | `index.md` | A plain Markdown version of each page. "Copy Markdown" and "View markdown" need it. See [AI-agent support](/docs/customize/agents/) |
| `LLMS` | `llms.txt` | A plain-text site index for language models, usually on `home` only |
| `LLMSFULL` | `llms-full.txt` | Opt-in for a top-level section: its pages' Markdown joined in sidebar order, one file per language |
| `NAVJSON` | `navigation.json` | Opt-in on `home`: the sidebar and pager tree as JSON, once per language, validated by `schema/nav.v1.schema.json` |
| `print` | `_print/index.html` | A whole section as one printable page. See [Print](/docs/customize/print/) |
| `BookManifest` | `book.json` | Optional JSON at a Book root for EPUB and PDF packaging tools. It is not an ebook itself |
| `RSS` | `index.xml` | Hugo's own format. Add it to `section` to give each section a feed |

`LLMSFULL` and `BookManifest` go in the front matter of the top-level section
that publishes them, not in the site configuration, and `NAVJSON` belongs on
`outputs.home`. [AI-agent support](/docs/customize/agents/) and
[Books](/docs/write/book/) have complete examples.

Two parameters shape the print output:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.print.toc` | boolean | true | A table of contents at the top of the print page. `false` leaves it out |
| `params.print.section_break_wordcount` | integer | 50 | How many words a section needs before it starts on a new print page |
{.fields meta="type default"}

## Languages and versions {#languages-versions}

Languages are defined in Hugo's own `languages` block, and the theme reads the
translation links Hugo builds from it:

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultContentLanguage` | string | en | The primary language, served without a path prefix |
| `languages.<lang>.label` | string | | The language's own name, shown in the language menu |
| `languages.<lang>.locale` | string | | The full locale, used for `<html lang>` and SEO |
| `languages.<lang>.weight` | integer | | Language order, which is also the cycle order when the reader clicks the language icon |
| `languages.<lang>.title` | string | | The site name in that language |
| `languages.<lang>.direction` | string | ltr | `rtl` for a right-to-left language |
{.fields meta="type default"}

Paired files, anchor alignment and fallback for untranslated pages are covered
in [Languages](/docs/customize/i18n/).

Version keys:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.version` | string | | Identifier of this site variant; it need not be a Git ref. See [Versions](/docs/customize/versions/) |
| `params.version_menu` | string | Version | Title of the version menu |
| `params.version_menu_pagelinks` | boolean | | When switching version, try the same path on the target site first |
| `params.versions` | list | | Version entries with `version`, `url` and `kind`; `name: '---'` is a divider |
| `params.archived_version` | boolean | | Shows the "this is an archived version" banner at the top |
| `params.url_latest_version` | string | | Link to the current version inside that banner |
| `params.time_format_blog` | string | 2006-01-02 | Blog date format, overridable per language |
| `params.time_format_default` | string | 2006-01-02 | Every other date format, overridable per language |
{.fields meta="type default"}

## Miscellaneous {#misc}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `taxonomies` | map | | Hugo's own: turns on `tag: tags` and `category: categories`. See [Taxonomies](/docs/customize/taxonomy/) |
| `params.taxonomy.page_header` | list | | Taxonomies shown in a post header. When unset, all of them |
| `services.googleAnalytics.id` | string | | Hugo's own: the analytics script is added to production builds only. See [Analytics and SEO](/docs/admin/analytics/) |
{.fields meta="type default"}

## Editor completion via generated schemas {#editor-schema}

The theme publishes JSON Schemas for its configuration, so your editor can
complete keys, show each key's documentation on hover and flag a wrong type as
you type. `schema/site-params.schema.json` covers `hugo.yml`, and
`schema/front-matter.schema.json` covers page front matter. Take them from the
same release tag as the theme pinned in your `go.mod`, because keys change
between releases.

With the VS Code YAML extension, map the site schema in your settings. This
example uses OINK v1.7.0 and covers both common file names; replace the tag
with the one in your `go.mod`:

```json {title=".vscode/settings.json"}
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/pgsty/oink/v1.7.0/schema/site-params.schema.json": ["hugo.yml", "hugo.yaml"]
  }
}
```

To confirm the mapping works, give a boolean such as `params.offline_search` a
string value for a moment: the editor should flag the type. Then put the valid
value back. Front matter completion depends on your Markdown tooling; associate
it with `front-matter.schema.json` in the same way. That schema does not
enforce types, because keys such as `share` and `theme_color` also accept a
bare boolean to opt out.

## Verifying a configuration change {#verify}

Build once after each configuration change:

```bash
hugo --printPathWarnings
```

The build is good when it ends with `Total in …` and prints no `ERROR`. Then
read each `WARN` line; these are the common ones:

| Warning fragment | Cause |
| --- | --- |
| `invalid params.ui.typography` | The only choices are `technical` and `system` |
| `invalid params.ui.footer_style … (allowed: fat \| slim \| none)` | A misspelled footer style. When it comes from front matter, the warning names the page |
| `invalid params.page_width … (allowed: normal \| wide \| full)` | A misspelled page width |
| `invalid params.ui.section_index … (allowed: list \| cards)` | A misspelled section index style |
| `invalid params.offline_search_index` | The scopes are `title`, `heading`, `summary` and `content` |
| `params.drawio.enable requires an explicit params.drawio.drawio_server` | Draw.io is enabled without an editor address |
| `params.map.enable requires params.map.tiles … and params.map.attribution` | Maps are enabled without a complete tile service |
| `params.map.tiles may use only the {s}, {z}, {x}, {y}, {-y} and {r} placeholders` | The template has a placeholder such as `{apikey}` that nothing fills; write the key into the URL |
| `params.video_embeds must be a list of platforms` | Written as a single string or a boolean |
| `params.search.algolia requires explicit appId, apiKey, and indexName` | One of the three Algolia values is missing |
| `params.ui.image_zoom must be true or false` | Written as a string such as `"true"` |
| `theme_color … is not a #rgb or #rrggbb hex color` | The value is not a hex color; the default palette stays |
| `theme_color … reads at about N:1 against the theme's … canvas` | Advisory: the color still ships, and the message prints the id that silences it |
| `theme_color_dark … has no theme_color to pair with` | Only the dark color was set. It is ignored, and both modes keep the default palette |
| `command … must define exactly one of url or action` | A custom command has both `url` and `action`, or neither |
| `invalid params.ui.sidebar_icon_policy …; using all` | A misspelled icon policy |

Then check three things in a browser: one page in each language, one page
without a translation to see the fallback, and links under the production
`baseURL`, including any subpath the site is deployed under. Build with the
same Hugo that builds the site in production; [Get started](/docs/start/#tools)
lists the versions it needs.

## Related {#related}

- [Brand and appearance](/docs/customize/brand/) — site name, logo, colors, fonts
- [Navigation and menus](/docs/customize/navigation/) — navbar menu, page actions, footer
- [Layouts and page types](/docs/customize/layout/) — shell, sidebar, table of contents
- [Page parameters](/docs/write/frontmatter/) — the full front matter table
- [Troubleshooting](/docs/admin/troubleshooting/) — locating a build failure
