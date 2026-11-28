---
title: Page parameters
linkTitle: Page parameters
description: Look up every front matter key OINK reads, with its type, default and effect, to change one page or a whole section.
weight: 30
search_keywords: [page parameters, front matter, cascade, page override, parameter table]
---

Front matter lets one page, or a whole section through `cascade`, depart from
the site-wide settings in `hugo.yml`: a wide layout for one reference table, no
pager on a landing page, comments on blog posts but not on the docs. The keys
below are every page key OINK reads, grouped by what they change. Hugo's own
fields (`slug`, `url`, `build`, `sitemap`, `expiryDate` and the rest) work as
usual and are documented by
[Hugo](https://gohugo.io/content-management/front-matter/). Site parameters
are in [Configuration](/docs/customize/config/).

## How page keys work {#how-to-read}

**A page key is the site key without `params.` and `ui.`, written at the top
level of the front matter.** The site's `params.ui.section_index` becomes
`section_index` on a page, and `params.page_width` becomes `page_width`. Do not
nest page keys under a `ui:` block: the theme does not read one and does not
warn about it either, so the setting silently has no effect. When a key seems
to do nothing, check its name and placement against these tables first.

```yaml {title="content/docs/wide-reference.md"}
---
title: Compatibility matrix
weight: 40
page_width: wide
footer_style: slim
image_zoom: true
section_index: list
---
```

A section's `cascade` uses the same names one level deeper and applies them to
every page beneath it:

```yaml {title="content/docs/reference/_index.md"}
cascade:
  pager: false
  section_index: list
```

When several places set the same key, the most specific wins:

1. the page's own front matter;
2. the nearest `cascade` above it;
3. the site parameter in `hugo.yml`.

A *Default* of "site value" means the key falls back to the site parameter of
the same name. An invalid value warns and the page uses the default shown here,
as described in [Configuration](/docs/customize/config/#principles); the
tables mention a fallback only where it differs. Keys that OINK has renamed or
retired are not listed: the build warns when it meets one, and
[Upgrade](/docs/admin/upgrade/) has the replacements.

## Basics {#basic}

Every page uses a few of these, and `title` is the one it cannot do without.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | — | Page heading, browser title and search result title. Required on every page |
| `linkTitle` | string | `title` | Short name in the sidebar, breadcrumbs, pager and cards |
| `description` | string | — | One-sentence summary for section cards, search snippets and `meta description`. Blog pages also show it as an introduction above the body |
| `weight` | integer | `0` | Order among siblings; use multiples of 10. `0` (unset) sorts after every page with a weight. See [Organizing content](/docs/write/organize/#weight) |
| `draft` | boolean | `false` | A draft never reaches the build output; preview it with `hugo server -D`. See [Writing pages](/docs/write/pages/#drafts) |
| `date` | date | — | Blog date and release-page sort key. A future date keeps the page out of the build by default |
| `lastmod` | date | Git commit time | The page-end "last modified" time. With `enableGitInfo` on, Git supplies it and you need not write it |
| `aliases` | string array | — | Old paths that redirect to this page, for when a page moves |
| `type` | string | top-level directory name | Picks the template and the shell: `docs`, `book`, `blog`, `swagger`, `expo`. See [Organizing content](/docs/write/organize/#type-and-shell) |
| `layout` | string | — | Picks a layout for one page: `landing` or `releases` |
| `cascade` | map | — | Applies the keys below to the whole subtree |
{.fields meta="type default"}

## Sidebar and navigation {#navigation}

Reach for these when a page belongs somewhere else in the sidebar, or nowhere,
or when a section index should list its children differently.
[Organizing content](/docs/write/organize/) shows how they combine.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | Font Awesome class pair | — | Icon in the sidebar, section cards and search results, such as `fa-solid fa-rocket` |
| `toc_hide` | boolean | `false` | Removes this page and its subtree from the sidebar and the pager sequence, in content-derived and explicit trees alike |
| `hide_summary` | boolean | `false` | Leaves the page out of its section index |
| `sidebar_divider` | boolean | `false` | Turns the entry into a group heading without a link, which the pager skips; a section marked this way still lists its children. For a group with no page of its own, use `build.render: never` instead ([group without a page](/docs/write/organize/#group-only)) |
| `sidebar_expanded` | boolean | `true` for blog sections, `false` otherwise | Opens this section in the sidebar by default |
| `sidebar_root_for` | `self` / `children` | — | Makes this section the root of the sidebar tree. `self` includes the section index; `children` covers only its descendants. Any other value warns and is ignored |
| `sidebar_root_link_self` | boolean | `true` | The root row links to the section itself; `false` links it to the parent section instead |
| `sidebar_root_menu` | boolean | `true` | Offers a top-level section or nested self-root in the sidebar's root switcher. An excluded root still shows as the current location while you are inside it |
| `toc_root` | boolean | `false` | When the sidebar root is the site home, removes this whole top-level section from the tree and the pager sequence |
| `manual_link` | URL | — | Points this row in the sidebar and section index somewhere else |
| `manual_link_relref` | content reference | — | The same link, resolved with `relref`. A missing target fails the build |
| `manual_link_title` | string | `title` | Hover title for the manual link |
| `manual_link_target` | string | — | Link target such as `_blank`; the theme adds `noopener` |
| `no_list` | boolean | `false` | The section index lists no children |
| `simple_list` | boolean | `false` | The section index lists children as a compact bulleted list |
| `section_index` | `list` / `cards` | site value (`list`) | Style of the section index |
| `section_index_columns` | integer | `2` | Column count of the card style |
| `notoc` | boolean | `false` | Hides the outline in the right rail |
| `pager` | boolean | decided by `params.ui.pager_types` | `false` removes previous / next from this page. A non-boolean warns and the page keeps its type's setting |
| `navbar_enabled` | boolean | site value (`true`) | Whether this page renders the navbar |
| `navbar_autohide` | boolean | site value (`false`) | On desktop screens with a mouse, hides the navbar until the pointer nears the top edge or keyboard focus enters it. The home page ignores the site value and follows only its own front matter |
| `breadcrumb` | boolean | shell default | Whether this page renders breadcrumbs. Docs and Book pages default on, Blog pages off |
| `theme_color` | string | site value | `#rgb` or `#rrggbb` accent for this page. In a section root's `cascade`, it gives the whole section its own color. See [Brand and appearance](/docs/customize/brand/#theme-color) |
| `theme_color_dark` | string | derived | The dark-mode accent. A page that overrides only `theme_color` under a cascade that sets this key inherits the cascade's dark value, so override both. `theme_color: false` opts the page out of an inherited section color |
| `page_context_menu` | boolean | site value (`true`) | The page action menu on the title row: copy Markdown, edit this page, print and so on |
| `page_context_menu.assistant_links` | boolean | site value (`false`) | The ChatGPT and Claude items, written `page_context_menu: { assistant_links: false }`. A page can only turn them off; it cannot turn them on when the site has not |
{.fields meta="type default"}

## Page shell {#shell}

Change these when one page needs a different frame around its content: a
wider column, no sidebar, a slimmer footer. Site defaults and their effects are
in [Layouts and page types](/docs/customize/layout/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `page_width` | `normal` / `wide` / `full` | `normal` | Width of the content column |
| `reading_width` | `slim` / `normal` / `wide` | `normal` | Line length on Book pages. Applies only to `type: book` |
| `footer_style` | `fat` / `slim` / `none` | site value (`fat`) | Footer shape |
| `body_class` | string | — | A class added to `<body>` for the site's own CSS |
| `reading_time` | boolean | site value | Whether this page shows a reading time |
| `sidebar_enabled` | boolean | `true` | `false` hides the left sidebar on this page |
| `scroll_spy` | boolean | site value | Accepted and ignored: the outline always highlights the heading you are reading |
| `keyboard_nav` | boolean | site value (`true`) | Single-key keyboard navigation. See [Keyboard navigation](/docs/customize/keyboard/) |
| `lastmod_commit` | `subject` / `hash` / `none` | `subject` | What follows "last modified": the commit subject, its hash, or nothing |
| `sidebar_expand_levels`, `sidebar_menu_compact`, `sidebar_menu_foldable`, `sidebar_item_overflow` | as the site parameter | site value | Per-page sidebar behavior; the values are in [Configuration](/docs/customize/config/) |
| `sidebar_width_min`, `sidebar_width_max` | positive integer | site value (`220` / `480`) | Limits for resizing the desktop sidebar on this page. A minimum above its maximum warns and restores the site pair |
| `code_copy` | boolean | site value (`true`) | Default copy button on this page's code blocks. A fence's own `copy=` wins |
| `rich_copy` | boolean | site value (`true`) | Typeset HTML copy for prose selections pasted into rich-text editors |
| `toc_style` | `fixed` / `flow` | site value (`fixed`) | A fixed right-rail panel, or a wider rail that starts in the content flow |
| `toc_taxonomies` | boolean | site value (`true`) | Whether taxonomy clouds join the outline in the right rail |
| `taxonomy_icons` | map | site value | Per-taxonomy icon overrides for this page, or for a section through `cascade` |
{.fields meta="type default"}

## Search {#search}

Use these to make the right page rank first for a query, or to keep a page out
of search entirely. The guide is [Search](/docs/customize/search/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `search_keywords` | string or string array | — | Extra search terms: synonyms, abbreviations, other languages |
| `search_boost` | positive number | `1.0` | Ranking multiplier: the final score is the text match score times this value. A non-numeric, infinite, zero or negative value falls back to `1.0` |
| `search_exclude` | boolean | `false` | Keeps the page out of the local index |
{.fields meta="type default"}

## Output formats {#outputs}

Set these when a page should not get a Markdown copy or should stay out of the
printed chapter. The guides are [AI-agent support](/docs/customize/agents/)
(`.md` and `llms.txt`) and [Print](/docs/customize/print/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `outputs` | string array | site `outputs` | The output formats this page generates. `[HTML]` drops its `.md` version |
| `no_print` | boolean | `false` | Leaves the page out of the whole-chapter and whole-book print view |
{.fields meta="type default"}

## Page end: comments, feedback and provenance {#page-end}

These decide what follows the article. The order is fixed: share bar, then
feedback, then provenance, then the pager, then comments. See
[Writing pages](/docs/write/pages/#page-end).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `comments` | boolean | site `params.comments.enable` (`false`) | Whether this page shows the giscus comment section. See [Comments](/docs/admin/comments/) |
| `feedback` | boolean or map | site `params.ui.feedback` (off) | The "was this page helpful?" widget. The map form takes `enable` and `reasons` |
| `annotation` | boolean | site `params.ui.annotation` (on) | The "last modified" and provenance block at the page end |
| `backlinks` | boolean | site `params.ui.backlinks` (off) | Lists the pages that link here in a "Backlinks" group beside the outline. A section can cascade it. See [Navigation and menus](/docs/customize/navigation/#backlinks) |
| `translation_notice` | language code or `false` | site `params.ui.translation_notice` (off) | The language of the authoritative version, so a translation can say so and link back. Write `false` on a page written natively in this language |
{.fields meta="type default"}

### Upstream attribution {#upstream}

Declare a source when a page is adapted from someone else's material. The
provenance line at the page end then names the work, the copyright holder and
the license, and links to the full notice. Values resolve from the site
parameters, then the `data/upstreams` entry named by `upstream_source`, then
the page's front matter; the most specific declaration wins.

`upstream_link` itself is read only from front matter (a cascade counts, a
site parameter does not), because a site-wide value would make every page
claim the same source.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `upstream_link` | URL | — | Address of the material this page is derived from. An empty string opts out of a value inherited through `cascade` |
| `upstream_name` | string | — | Name of the upstream work, as the credit shows it. Required once `upstream_link` is set |
| `upstream_copyright` | string | — | Copyright notice, kept exactly as upstream wrote it. Required |
| `upstream_license` | SPDX identifier | — | Must appear in `data/licenses`. Required |
| `upstream_notice` | site path or URL | — | Page carrying the full notice: license text, warranty disclaimer, upstream NOTICE, snapshot pin. Required |
| `upstream_ref` | string | — | Tag or commit of the snapshot, shown in parentheses after the work |
| `upstream_source` | string | site parameter | Entry in `data/upstreams` that holds upstream facts shared by many pages |
| `upstream_modified` | boolean | `false` | Changes the credit to say the work was adapted. When the site has repository information, the same sentence also links to the page's history. A non-boolean is treated as `false` |
{.fields meta="type default"}

The attribution is all or nothing, because a partial credit misleads readers
more than an obvious gap. A companion key without `upstream_link`, a missing
required key, a license not found in `data/licenses` or an unknown
`upstream_source` entry each warns and omits the whole attribution. The theme
ships an SPDX table at `data/licenses.yaml`; a site adds or overrides entries
with a file of the same name.

## Image zoom {#image-zoom}

Turn this on for pages of screenshots or diagrams that readers need to see at
full size.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `image_zoom` | boolean | site value (`false`) | Whether images on this page open full size when clicked. See [Images](/docs/components/image/) |
{.fields meta="type default"}

## Blog posts {#blog}

Posts use these for bylines, series and featured images, and blog sections use
them to choose the post index. The guide is [Blog posts](/docs/write/blog/);
[List layouts](/docs/write/blog/#list) compares the four index layouts.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `author` | string | — | Post byline; inline Markdown is allowed. Ignored on a page that has `authors` |
| `authors` | string array | — | Terms of the `authors` taxonomy, in byline order. Needs `author: authors` under `taxonomies:`. See [Authors and bylines](/docs/write/blog/#authors) |
| `series` | string array | — | Terms of the `series` taxonomy; the strip above the body uses the first one. See [Series](/docs/write/blog/#series) |
| `series_weight` | integer | — | Place in the series. Weighted members come first in ascending order, the rest follow by ascending date |
| `tags` | string array | — | Tags. See [Taxonomies](/docs/customize/taxonomy/) |
| `categories` | string array | — | Categories, likewise |
| `images` | string array | — | The first entry is the post's featured image and share card. In a section's `cascade`, it sets a default for the section. `images: []` opts a page out of an inherited value, but does not hide an image the page bundle supplies as `featured`, `cover` or `thumbnail` |
| `byline` | string | — | Credit shown with the featured image wherever that image is rendered |
| `featured_image` | `none` / `banner` / `wash` / `hero` | site value (`none`) | How the post shows its featured image on the article itself; `hero` makes a full-width image header |
| `blog_index` | `list` / `cards` / `table` / `gallery` | site value (`list`) | Layout of the blog section's post index. `table` always lists the whole section without pagination |
| `blog_index_columns` | positive integer | site value (`3`) | Card columns at wide breakpoints; medium and narrow screens keep their own limits |
| `blog_index_size` | positive integer | site value (`12`) | Posts per page for `list`, `cards` and `gallery`, and for all four views when switching is on. A standalone `table` ignores it |
| `blog_index_toggle` | boolean | site value (`false`) | Publishes all four layouts with a switch that remembers the reader's choice. When `false`, only the configured layout is published and saved choices are ignored |
| `blog_gallery` | map | site block | Replaces the site's whole gallery block; omitted fields use the built-in defaults. A reader's saved mode and size win |
| `blog_gallery.mode` | `wall` / `cards` / `seamless` | `wall` within a page block | Justified rows with 6px gaps, masonry with visible captions, or rows without gaps. Independent of `blog_index` |
| `blog_gallery.size` | integer 160–360 | `240` within a page block | Target tile size in CSS pixels; independent of posts per page |
| `share` | string array or `false` | site `params.ui.share` (empty) | Share targets at the page end. Replaces any inherited list; `false` opts the page out; an unknown target warns and is dropped. See [Share](/docs/write/blog/#share) |
| `summary` | string | — | Excerpt for gallery entries and for post rows on tag and category pages when `description` is absent |
{.fields meta="type default"}

## Book {#book}

A book sets `type: book` on its section through `cascade`; these keys then
number chapters and mark drafts. The guide is [Books](/docs/write/book/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `book_number` | string | — | Chapter number, shown before the page title and the sidebar entry |
| `book_status` | `draft` | — | Marks an unfinished chapter: flagged in the sidebar and contents; `book-toc` with `drafts=false` leaves it out |
| `sidebar_headings` | `false` / `true` / integer 2–4 | site value (`false`) | Lists the current page's headings under its sidebar entry, down to the given level; `true` means h2 |
| `book_draft_banner` | boolean | site value (`false`) | Adds a banner at the top of a draft chapter |
{.fields meta="type default"}

## Expo albums {#expo}

An album page (`type: expo`) reads its images and opening arrangement from
this block. The guide is [Expo albums](/docs/write/expo/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `expo` | map | site `params.ui.expo` | Replaces the site block; absent fields use the defaults below |
| `expo.images` | string | `images/*` | Pattern matching the image resources in the page bundle |
| `expo.mode` | `wall` / `cards` / `seamless` | `wall` | Arrangement shown until the reader picks one |
| `expo.size` | integer | `240` | Target tile size from 160 to 360 CSS pixels; a size the reader saved wins |
{.fields meta="type default"}

Titles, captions, credits, weights, explicit IDs and separate originals for
individual images use Hugo's native `resources` metadata; see
[Image metadata](/docs/write/expo/#image-metadata).

## Landing {#landing}

A page with `layout: landing` builds its sections from a data file or from its
own front matter. The guide is [Home and landing pages](/docs/customize/home/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `landing` | string | — | Reads the sections from `data/landing/<key>/<language>.yaml` |
| `sections` | array | — | Section definitions written in the front matter, taking precedence over `landing`. A value that is not an array warns and renders no sections |
{.fields meta="type default"}

## Release pages {#releases}

A release note names its GitHub release with one key, and a section with
`layout: releases` lists those pages newest first by date and then SemVer,
ignoring `weight`. The guide is [Releases and downloads](/docs/write/releases/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `release_url` | string | — | One GitHub release URL, `https://github.com/<owner>/<repo>/releases/tag/<tag>`. The theme derives the owner, project, tag and source archive links from it and takes the date from the page's `date`; download assets come from a `checksums` block in the body. Any other value warns and the release block is skipped |
{.fields meta="type default"}

## Related {#related}

- [Writing pages](/docs/write/pages/) — the handful of keys every page needs
- [Organizing content](/docs/write/organize/) — what the sidebar and navigation keys do together
- [Configuration](/docs/customize/config/) — every site parameter in `hugo.yml`
