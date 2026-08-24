---
title: Page parameters
linkTitle: Page parameters
description: The full front matter table — every page key the theme actually reads, grouped by sidebar, shell, search, output, page end, Book, landing and release pages.
weight: 30
search_keywords: [page parameters, front matter, cascade, page override, parameter table]
---

This page is the complete table of page-level parameters, listing only the keys
the OINK theme reads. Hugo's own front matter fields (`slug`, `url`, `build`,
`sitemap`, `expiryDate` and the rest) work as usual; their meaning is in the
[Hugo documentation](https://gohugo.io/content-management/front-matter/). Site
parameters (`params.*` in `hugo.yml`) are in
[Configuration](/docs/customize/config/).

## How to read the tables {#how-to-read}
Precedence, highest first:

1. The page's own front matter;
2. The nearest `cascade` (when several cascade layers set the same key, the one closest to the page wins);
3. The site parameter in `hugo.yml`.

Keys whose *Default* column says "site value" fall back to the site parameter of
the same name when unset.

Page keys are written at the top level of the front matter, and the key name is
the site key with its `ui.` prefix dropped: the site's
`params.ui.section_index` is the page's `section_index`. Front matter never
carries a `ui:` block; the keys sit at the top level. A `ui:` block written
there is not read and not reported, so check the key name against this page
when a setting seems to have no effect.

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

Inside a `cascade` the key names are unchanged, just one level deeper:

```yaml {title="content/docs/reference/_index.md"}
cascade:
  pager: false
  section_index: list
```

An invalid value does not stop the build. The theme warns — naming the key, the
value it got and the fallback it used — and renders the page with the default in
the table, so one typo degrades one setting instead of serving HTTP 500 on every
URL under `hugo server`. It still never ships: every publishing gate builds with
`--panicOnWarning`, which turns that warning back into a hard failure where it
counts.

A few keys do stop the build, and their rows say so. They are the ones where
carrying on would publish something wrong rather than merely plain: an
incomplete upstream attribution (a partial notice reads exactly like a complete
one), `translation_notice`, the `release` facts, landing `sections`, and any
reference that cannot resolve.

## Basics {#basic}

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | — | Page heading, browser title, search result title. Required on every page |
| `linkTitle` | string | `title` | Short name in the sidebar, breadcrumbs, pager and cards |
| `description` | string | — | One-sentence summary: section cards, search snippet, `meta description`; rendered as a standfirst above the body on blog pages |
| `weight` | integer | `0` | Ordering among siblings; use multiples of 10. `0` (unset) sorts after every page that has a weight — see [Organizing content](/docs/write/organize/#weight) |
| `draft` | boolean | `false` | A draft never reaches the build output; `hugo server -D` previews it — see [Writing pages](/docs/write/pages/#drafts) |
| `date` | date | — | Blog date, and the sort key for release pages; a future date is excluded by default |
| `lastmod` | date | Git commit time | The page-end "last modified"; not needed by hand when the site enables `enableGitInfo` |
| `aliases` | string array | — | Redirects an old path to this page; for page migration, not for everyday navigation |
| `type` | string | top-level directory name | Decides the template and the shell: `docs`, `book`, `blog`, `swagger` — see [Organizing content](/docs/write/organize/#type-and-shell) |
| `layout` | string | — | Picks a layout for one page: `landing`, `releases` |
| `cascade` | map | — | Pushes the keys below down the whole subtree |
{.fields meta="type default"}

## Sidebar and navigation {#navigation}

The guide is [Organizing content](/docs/write/organize/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | Font Awesome class pair | — | Icon in the sidebar, section cards and search results, e.g. `fa-solid fa-rocket` |
| `toc_hide` | boolean | `false` | Absent from the sidebar tree and from the pager sequence |
| `hide_summary` | boolean | `false` | Absent from the section index |
| `sidebar_divider` | boolean | `false` | The row renders as a sidebar group heading: not a link, and not in the pager sequence |
| `sidebar_expanded` | boolean | `true` for blog sections, `false` otherwise | This section is expanded by default in the sidebar |
| `sidebar_root_for` | `self` / `children` | — | Makes this section a sidebar tree root; `self` includes the section index, `children` covers descendants only. Any other value warns and is ignored |
| `sidebar_root_link_self` | boolean | `true` | The root row links to itself; `false` links to the parent section instead. A non-boolean fails the build |
| `sidebar_root_menu` | boolean | `true` | Whether a top-level section appears in the root switcher |
| `toc_root` | boolean | `false` | When the sidebar root is the site home, excludes this whole top-level section from the tree and the pager sequence |
| `manual_link` | URL | — | The sidebar and section index row points elsewhere |
| `manual_link_relref` | content reference | — | The same, resolved with `relref`; a missing target fails the build |
| `manual_link_title` | string | `title` | Hover title for the manual link |
| `manual_link_target` | string | — | For example `_blank`; the theme adds `noopener` |
| `no_list` | boolean | `false` | The section index generates no child list |
| `simple_list` | boolean | `false` | The child index renders as a compact bulleted list |
| `section_index` | `list` / `cards` | site value (`list`) | Style of the child index. An invalid value warns and falls back |
| `section_index_columns` | integer | `2` | Column count in the card style |
| `notoc` | boolean | `false` | Hides the right-hand page outline |
| `pager` | boolean | decided by `params.ui.pager_types` | `false` turns off previous / next for this page. A non-boolean warns and is ignored |
| `navbar_enabled` | boolean | site value (`true`) | Whether this page renders the navbar |
| `navbar_autohide` | boolean | site value (`false`) | The navbar hides itself on pointer devices |
| `theme_color` | string | site value | `#rgb`/`#rrggbb` hex tinting this page's accent grounds. On a section root's `cascade` it gives the whole section an identity — see [Brand and appearance](/docs/customize/brand/#theme-color) |
| `theme_color_dark` | string | derived | The dark half of the accent. A page overriding `theme_color` under a cascade that also sets this key inherits that dark value, so override both. `theme_color: false` opts the page out of an inherited section color entirely |
| `page_context_menu` | boolean | site value (`true`) | The page action menu on the title row (copy Markdown, edit this page, print, …) |
| `page_context_menu.assistant_links` | boolean | site value (`false`) | The ChatGPT / Claude handover items, written `page_context_menu: { assistant_links: false }`. A page may only narrow the site policy, never enable it alone |
{.fields meta="type default"}

## Page shell {#shell}

Site-level defaults and what they do are in
[Layouts and page types](/docs/customize/layout/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `page_width` | `normal` / `wide` / `full` | `normal` | Width of the content column. An invalid value warns and falls back |
| `reading_width` | `slim` / `normal` / `wide` | `normal` | Reading measure on Book pages; applies to `type: book` only |
| `footer_style` | `fat` / `slim` / `none` | site value (`fat`) | Footer shape. An invalid value warns and falls back |
| `body_class` | string | — | A class appended to `<body>` for the site's own CSS |
| `reading_time` | boolean | site value | Whether this page shows a reading time; `false` hides it |
| `sidebar_enabled` | boolean | `true` | Whether this page shows the left sidebar; `false` hides it |
| `scroll_spy` | boolean | site value | Scroll tracking in the outline; `true` enables it |
| `keyboard_nav` | boolean | site value (`true`) | Single-key keyboard navigation — see [Keyboard navigation](/docs/customize/keyboard/). A non-boolean warns and falls back |
| `lastmod_commit` | `subject` / `hash` / `none` | `subject` | How the commit is shown after "last modified". An invalid value warns and falls back |
| `sidebar_expand_levels`, `sidebar_menu_compact`, `sidebar_menu_foldable`, `sidebar_item_overflow` | as the site parameter | site value | Sidebar behaviour can be overridden per page too; the values are in [Configuration](/docs/customize/config/) |
{.fields meta="type default"}

## Search {#search}

The guide is [Search](/docs/customize/search/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `search_keywords` | string or string array | — | Extra search terms, including synonyms and other languages |
| `search_boost` | positive number | `1.0` | Ranking multiplier; the final score is the text match score times this value. A non-numeric, non-finite, zero or negative value warns and falls back to `1.0` |
| `search_exclude` | boolean | `false` | Keeps the page out of the local index |
{.fields meta="type default"}

## Output formats {#outputs}

The guides are [AI-agent support](/docs/customize/agents/) (`.md` and
`llms.txt`) and [Print](/docs/customize/print/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `outputs` | string array | site `outputs` | Which output formats this page generates; `[HTML]` stops the `.md` twin |
| `no_print` | boolean | `false` | Excluded from the whole-chapter and whole-book print aggregate |
{.fields meta="type default"}

## Page end: comments, feedback and provenance {#page-end}

The order is fixed as feedback → provenance → pager → comments; see
[Writing pages](/docs/write/pages/#page-end).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `comments` | boolean | site `params.comments.enable` (`false`) | Whether this page shows the giscus comment section — see [Comments](/docs/admin/comments/) |
| `feedback` | boolean or map | site `params.ui.feedback` (off) | The map form takes `enable` and `reasons`. Anything else warns and falls back |
| `annotation` | boolean | site `params.ui.annotation` (on) | The "last modified / provenance" block at the page end. Only a boolean is accepted; anything else warns and falls back |
| `translation_notice` | language code or `false` | site `params.ui.translation_notice` (off) | The language code of the authoritative version, so a translation can say so and link back; write `false` on a page authored natively in this language |
{.fields meta="type default"}

### Upstream attribution {#upstream}

When a page is derived from material elsewhere, `upstream_link` declares the
source and the page-end provenance line gives the work, the copyright holder,
the licence and a link to the full notice. This family resolves site parameters
→ the `data/upstreams` entry named by `upstream_source` → this page's front
matter, so the most specific declaration wins.

`upstream_link` is read from front matter only (a cascade counts, site
parameters do not) — a site-wide value would make every page claim the same
source. Any companion key without `upstream_link` fails the build.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `upstream_link` | URL | — | The address of the material this page is derived from. An empty string opts out of an inherited cascade value |
| `upstream_name` | string | — | The upstream work, as the attribution names it. Required once `upstream_link` is set |
| `upstream_copyright` | string | — | The copyright notice, retained as upstream wrote it. Required |
| `upstream_license` | SPDX identifier | — | Must be found in `data/licenses`, or the build fails. Required |
| `upstream_notice` | site path or URL | — | The page carrying the full notice (licence text, warranty disclaimer, upstream NOTICE, snapshot pin). Required |
| `upstream_ref` | string | — | The tag or commit the snapshot pins, shown in parentheses after the work |
| `upstream_source` | string | site parameter | The entry name in `data/upstreams`, for upstream facts shared by many pages; a missing entry fails the build |
| `upstream_modified` | boolean | `false` | Adds a "modified downstream" line; carries a "view history" link when the site has repository information. A non-boolean fails the build |
{.fields meta="type default"}

Missing any one of the four required keys (`upstream_name`,
`upstream_copyright`, `upstream_license`, `upstream_notice`) fails the build: a
partial attribution is worse than an obvious omission. The theme ships an SPDX
table at `data/licenses.yaml`, and a site adds to or overrides it with a file of
the same name.

## Image zoom {#image-zoom}

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `image_zoom` | boolean | site value (`false`) | Whether images on this page open full size — see [Images](/docs/components/image/). A non-boolean warns and falls back |
{.fields meta="type default"}

## Blog posts {#blog}

The guide is [Blog posts](/docs/write/blog/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `author` | string | — | Post byline; inline Markdown is allowed. Ignored on a page that has `authors` |
| `authors` | string array | — | Terms of the `authors` taxonomy, in byline order — see [Authors and bylines](/docs/write/blog/#authors). Needs `author: authors` under `taxonomies:` |
| `series` | string array | — | Terms of the `series` taxonomy. The strip above the body uses the first one — see [Series](/docs/write/blog/#series) |
| `series_weight` | integer | — | Place in the series. Weighted members come first in ascending order, the rest follow by ascending date |
| `tags` | string array | — | Tags — see [Taxonomies](/docs/customize/taxonomy/) |
| `categories` | string array | — | Categories, likewise |
| `images` | string array | — | The first entry becomes the post's featured image and share card; put it in a section `_index.md` cascade for a section-wide default, and `images: []` means no featured image |
| `featured_image` | `none` / `banner` / `wash` | site value (`none`) | How this article renders its own featured image. An invalid value warns and falls back |
| `blog_index` | `list` / `cards` | site value (`list`) | Written on a blog root, the list form for that section. An invalid value warns and falls back |
| `share` | string array or `false` | site `params.ui.share` (empty) | The page-end share targets, replacing any inherited list; `false` opts this page out — see [Share](/docs/write/blog/#share). An unknown target warns and is dropped |
| `summary` | string | — | Fallback excerpt for post rows on tag and category pages; `description` wins |
{.fields meta="type default"}

## Book {#book}

The guide is [Books](/docs/write/book/). A whole book sets `type: book` through
a section `cascade`.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `book_number` | string | — | Chapter number, shown before the page title and the sidebar entry |
| `book_status` | `draft` | — | Marks a draft chapter: flagged in the sidebar and contents, and left out of the indexes by default |
| `sidebar_headings` | `false` / `true` / integer 2–4 | site value (`false`) | Expands the h2–h4 branch under the current sidebar entry. Out of range warns and falls back |
| `book_draft_banner` | boolean | site value (`false`) | Adds a banner at the top of a draft chapter. A non-boolean warns and falls back |
{.fields meta="type default"}

## Landing {#landing}

The guide is [Home and landing pages](/docs/customize/home/). Any page with
`layout: landing` uses the landing shell.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `landing` | string | — | Data is taken from `data/landing/<key>/<language>.yaml` |
| `sections` | array | — | Section definitions inlined in front matter, taking precedence over `landing`. Anything but an array fails the build |
{.fields meta="type default"}

## Release pages {#releases}

The guide is [Releases and downloads](/docs/write/releases/). A section with
`layout: releases` ignores `weight` and sorts by release date and SemVer,
newest first.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `release` | string or map | — | The release facts. The string form is `https://github.com/<owner>/<repo>/releases/tag/<tag>`; the map form takes `product`, `version`, `repo`, `tag`, `date`, `prev` and `checksums`, of which `version` and `repo` are required, and an unknown key or a wrong type fails the build |
| `release_products` | string or string array | — | Restricts the release list to these products. An invalid filter fails the build |
| `release_group_by_product` | boolean | `false` | Groups by product; with it on, every selected post must set `release.product` |
{.fields meta="type default"}

## Related {#related}

- [Writing pages](/docs/write/pages/) — the handful of keys every page needs
- [Organizing content](/docs/write/organize/) — what the sidebar and navigation keys actually do
- [Configuration](/docs/customize/config/) — the full table of site parameters in `hugo.yml`
