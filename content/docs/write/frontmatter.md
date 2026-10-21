---
title: Page parameters
linkTitle: Page parameters
description: The full front matter table — active page keys and retained 1.x compatibility no-ops, grouped by sidebar, shell, search, output, page end, Book, Expo, landing and release pages.
weight: 30
search_keywords: [page parameters, front matter, cascade, page override, parameter table]
---

This page lists all page-level parameters that OINK reads, including explicit
1.x compatibility no-ops. It omits keys that the theme reads only to warn about
a rename or removal. Those keys are in
[Migration](/docs/design/migration/), and they are also kept out of the
generated editor schema. Hugo's own front matter fields (`slug`, `url`, `build`,
`sitemap`, `expiryDate` and others) work as usual. For their meaning, see the
[Hugo documentation](https://gohugo.io/content-management/front-matter/). Site
parameters (`params.*` in `hugo.yml`) are in
[Configuration](/docs/customize/config/).

## How to read the tables {#how-to-read}
Precedence, highest first:

1. The page's own front matter.
2. The nearest `cascade`. If several cascade layers set the same key, the closest layer takes precedence.
3. The site parameter in `hugo.yml`.

Keys whose *Default* column says "site value" fall back to the site parameter of
the same name when unset.

Write page keys at the top level of front matter, without the site key's `ui.`
prefix. For example, the site's `params.ui.section_index` becomes the page's
`section_index`. Do not nest these keys in a `ui:` block: the theme neither
reads nor reports a `ui:` block there. If a setting has no effect, check its
key name against this page.

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

Inside a `cascade`, use the same key names one level deeper:

```yaml {title="content/docs/reference/_index.md"}
cascade:
  pager: false
  section_index: list
```

An invalid value does not stop an ordinary build. The theme warns and names
the key, supplied value, and fallback. It renders the page with the table's
default. One typo affects one setting rather than serving HTTP 500 on every
URL under `hugo server`. Review the warning and rendered fallback before publication.

No front matter key stops the build. The theme's templates never raise an
error. If continuing would publish incorrect information, the theme warns and
omits the whole block. It does not use a fallback. For example, a partial
upstream attribution can appear complete, so the theme omits it. An unresolved
reference can stop a build. Hugo controls that failure.

## Basics {#basic}

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | string | — | Page heading, browser title, search result title. Required on every page |
| `linkTitle` | string | `title` | Short name in the sidebar, breadcrumbs, pager and cards |
| `description` | string | — | One-sentence summary for section cards, search snippets, and `meta description`. Blog pages also show it as an introduction above the body |
| `weight` | integer | `0` | Order among siblings. Use multiples of 10. `0` (unset) sorts after every page with a weight. See [Organizing content](/docs/write/organize/#weight) |
| `draft` | boolean | `false` | A draft never reaches build output. Use `hugo server -D` to preview it. See [Writing pages](/docs/write/pages/#drafts) |
| `date` | date | — | Blog date and release-page sort key. A future date excludes the page by default |
| `lastmod` | date | Git commit time | The page-end "last modified" time. No manual value is needed if the site enables `enableGitInfo` |
| `aliases` | string array | — | Redirects an old path to this page. Use for page migration rather than everyday navigation |
| `type` | string | top-level directory name | Decides the template and the shell: `docs`, `book`, `blog`, `swagger` — see [Organizing content](/docs/write/organize/#type-and-shell) |
| `layout` | string | — | Picks a layout for one page: `landing`, `releases` |
| `cascade` | map | — | Applies the keys below to the whole subtree |
{.fields meta="type default"}

## Sidebar and navigation {#navigation}

The guide is [Organizing content](/docs/write/organize/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | Font Awesome class pair | — | Icon in the sidebar, section cards and search results, e.g. `fa-solid fa-rocket` |
| `toc_hide` | boolean | `false` | Excludes this page and its subtree from sidebar navigation and the pager sequence, in both content-derived and explicit trees |
| `hide_summary` | boolean | `false` | Absent from the section index |
| `sidebar_divider` | boolean | `false` | A non-link group heading, excluded from pager destinations. The 1.1 implementation retains a section's children. Use `build.render: never` for a [group without its own page](/docs/write/organize/#group-only) |
| `sidebar_expanded` | boolean | `true` for blog sections, `false` otherwise | This section is expanded by default in the sidebar |
| `sidebar_root_for` | `self` / `children` | — | Makes this section a sidebar tree root. `self` includes the section index. `children` covers descendants only. Any other value warns and is ignored |
| `sidebar_root_link_self` | boolean | `true` | The root row links to itself. `false` links to the parent section instead. A non-boolean warns and uses `true` |
| `sidebar_root_menu` | boolean | `true` | Includes a top-level section or nested self-root in global switcher choices. An excluded current root remains a location marker. The nested-root exclusion is fixed in 1.1 |
| `toc_root` | boolean | `false` | When the sidebar root is the site home, excludes this whole top-level section from the tree and the pager sequence |
| `manual_link` | URL | — | The sidebar and section index row points elsewhere |
| `manual_link_relref` | content reference | — | The same link, resolved with `relref`. A missing target fails the build |
| `manual_link_title` | string | `title` | Hover title for the manual link |
| `manual_link_target` | string | — | For example `_blank`. The theme adds `noopener` |
| `no_list` | boolean | `false` | The section index generates no child list |
| `simple_list` | boolean | `false` | The child index renders as a compact bulleted list |
| `section_index` | `list` / `cards` | site value (`list`) | Style of the child index. An invalid value warns and falls back |
| `section_index_columns` | integer | `2` | Column count in the card style |
| `notoc` | boolean | `false` | Hides the right-hand page outline |
| `pager` | boolean | decided by `params.ui.pager_types` | `false` turns off previous / next for this page. A non-boolean warns and is ignored |
| `navbar_enabled` | boolean | site value (`true`) | Whether this page renders the navbar |
| `navbar_autohide` | boolean | site value (`false`) | The navbar hides itself on pointer devices |
| `breadcrumb` | boolean | shell default | Whether this page renders breadcrumbs. Docs/Book default on. Blog defaults off |
| `theme_color` | string | site value | `#rgb`/`#rrggbb` hex value for this page's accent backgrounds. In a section root's `cascade`, it gives the whole section an identity. See [Brand and appearance](/docs/customize/brand/#theme-color) |
| `theme_color_dark` | string | derived | The dark-mode accent. If a page overrides `theme_color` under a cascade that sets this key, it inherits that dark value. Override both. `theme_color: false` opts the page out of an inherited section color entirely |
| `page_context_menu` | boolean | site value (`true`) | The page action menu on the title row (copy Markdown, edit this page, print, …) |
| `page_context_menu.assistant_links` | boolean | site value (`false`) | The ChatGPT / Claude link items, written `page_context_menu: { assistant_links: false }`. A page may only restrict the site policy. It may never enable these links alone |
{.fields meta="type default"}

## Page shell {#shell}

Site-level defaults and what they do are in
[Layouts and page types](/docs/customize/layout/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `page_width` | `normal` / `wide` / `full` | `normal` | Width of the content column. An invalid value warns and falls back |
| `reading_width` | `slim` / `normal` / `wide` | `normal` | Reading width on Book pages. Applies only to `type: book` |
| `footer_style` | `fat` / `slim` / `none` | site value (`fat`) | Footer shape. An invalid value warns and falls back |
| `body_class` | string | — | A class appended to `<body>` for the site's own CSS |
| `reading_time` | boolean | site value | Whether this page shows a reading time. `false` hides it |
| `sidebar_enabled` | boolean | `true` | Whether this page shows the left sidebar. `false` hides it |
| `scroll_spy` | boolean | site value | Silent 1.x compatibility no-op. The normal shell runtime always provides active-heading tracking |
| `keyboard_nav` | boolean | site value (`true`) | Single-key keyboard navigation — see [Keyboard navigation](/docs/customize/keyboard/). A non-boolean warns and falls back |
| `lastmod_commit` | `subject` / `hash` / `none` | `subject` | How the commit is shown after "last modified". An invalid value warns and falls back |
| `sidebar_expand_levels`, `sidebar_menu_compact`, `sidebar_menu_foldable`, `sidebar_item_overflow` | as the site parameter | site value | Each page can override sidebar behavior. The values are in [Configuration](/docs/customize/config/) |
| `sidebar_width_min`, `sidebar_width_max` | positive integer | site value (`220` / `480`) | Per-page minimum and maximum for desktop sidebar resizing. A minimum above its maximum warns and restores the site pair |
| `code_copy` | boolean | site value (`true`) | Default copy control for code blocks on this page. An explicit fence `copy=` takes precedence |
| `toc_style` | `fixed` / `flow` | site value (`fixed`) | Fixed right-rail panel or a wider rail beginning in the content flow |
| `toc_taxonomies` | boolean | site value (`true`) | Whether taxonomy clouds join the right-rail outline |
| `taxonomy_icons` | map | site value | Per-taxonomy icon overrides for this page or section cascade |
{.fields meta="type default"}

## Search {#search}

The guide is [Search](/docs/customize/search/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `search_keywords` | string or string array | — | Extra search terms, including synonyms and other languages |
| `search_boost` | positive number | `1.0` | Ranking multiplier. The final score is the text match score times this value. A non-numeric, non-finite, zero or negative value warns and falls back to `1.0` |
| `search_exclude` | boolean | `false` | Keeps the page out of the local index |
{.fields meta="type default"}

## Output formats {#outputs}

The guides are [AI-agent support](/docs/customize/agents/) (`.md` and
`llms.txt`) and [Print](/docs/customize/print/).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `outputs` | string array | site `outputs` | The output formats this page generates. `[HTML]` disables the `.md` version |
| `no_print` | boolean | `false` | Excluded from the whole-chapter and whole-book print aggregate |
{.fields meta="type default"}

## Page end: comments, feedback and provenance {#page-end}

The order is fixed: feedback → provenance → pager → comments. See
[Writing pages](/docs/write/pages/#page-end).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `comments` | boolean | site `params.comments.enable` (`false`) | Whether this page shows the giscus comment section — see [Comments](/docs/admin/comments/) |
| `feedback` | boolean or map | site `params.ui.feedback` (off) | The map form takes `enable` and `reasons`. Anything else warns and falls back |
| `annotation` | boolean | site `params.ui.annotation` (on) | The "last modified / provenance" block at the page end. Only a boolean is accepted. Other values warn and fall back |
| `backlinks` | boolean | site `params.ui.backlinks` (off) | Whether the right rail shows the "Backlinks" group beside the table of contents. A section can cascade it. Only a boolean is accepted; anything else warns and falls back — see [Navigation and menus](/docs/customize/navigation/#backlinks) |
| `translation_notice` | language code or `false` | site `params.ui.translation_notice` (off) | The language code of the authoritative version, so a translation can say so and link back. Write `false` on a page authored natively in this language |
{.fields meta="type default"}

### Upstream attribution {#upstream}

When a page is derived from material elsewhere, `upstream_link` declares the
source and the page-end provenance line gives the work, the copyright holder,
the license, and a link to the full notice. This family resolves site parameters
→ the `data/upstreams` entry named by `upstream_source` → this page's front
matter. The most specific declaration takes precedence.

`upstream_link` is read from front matter only (a cascade counts, site
parameters do not). A site-wide value would make every page claim the same
source. A companion key without `upstream_link` warns and the attribution is omitted.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `upstream_link` | URL | — | The address of the material this page is derived from. An empty string opts out of an inherited cascade value |
| `upstream_name` | string | — | The upstream work, as the attribution names it. Required once `upstream_link` is set |
| `upstream_copyright` | string | — | The copyright notice, retained as upstream wrote it. Required |
| `upstream_license` | SPDX identifier | — | Must be found in `data/licenses`, or it warns and the attribution is omitted. Required |
| `upstream_notice` | site path or URL | — | The page carrying the full notice (licence text, warranty disclaimer, upstream NOTICE, snapshot pin). Required |
| `upstream_ref` | string | — | The tag or commit the snapshot pins, shown in parentheses after the work |
| `upstream_source` | string | site parameter | The entry name in `data/upstreams`, for upstream facts shared by many pages. A missing entry warns and omits the attribution |
| `upstream_modified` | boolean | `false` | Changes the credit verb to say the work was adapted. If the site has repository information, the same attribution sentence also includes a "view history" link. A non-boolean warns and the page is treated as unmodified |
{.fields meta="type default"}

Missing any one of the four required keys (`upstream_name`,
`upstream_copyright`, `upstream_license`, `upstream_notice`) warns and omits the attribution.
A partial attribution can mislead readers more than an obvious omission. The theme ships an SPDX
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
| `author` | string | — | Post byline. Inline Markdown is allowed. Ignored on a page that has `authors` |
| `authors` | string array | — | Terms of the `authors` taxonomy, in byline order — see [Authors and bylines](/docs/write/blog/#authors). Needs `author: authors` under `taxonomies:` |
| `series` | string array | — | Terms of the `series` taxonomy. The strip above the body uses the first one — see [Series](/docs/write/blog/#series) |
| `series_weight` | integer | — | Place in the series. Weighted members come first in ascending order, the rest follow by ascending date |
| `tags` | string array | — | Tags — see [Taxonomies](/docs/customize/taxonomy/) |
| `categories` | string array | — | Categories, likewise |
| `images` | string array | — | The first entry becomes the post's featured image and share card. Put it in a section `_index.md` cascade for a section-wide default. `images: []` opts the page out of an inherited cascade value. It does not suppress an image the page bundle already supplies under a `featured`, `cover` or `thumbnail` name |
| `byline` | string | — | Credit shown with the resolved featured image when that image is rendered |
| `featured_image` | `none` / `banner` / `wash` / `hero` | site value (`none`) | How this article renders its own featured image. `hero` creates a full-width image shell. An invalid value warns and falls back |
| `blog_index` | `list` / `cards` / `table` | site value (`list`) | Written on a blog root, the index form for that section. A standalone `table` with `blog_index_toggle: false` lists the whole section without pagination. An invalid value warns and falls back |
| `blog_index_columns` | positive integer | site value (`3`) | Card columns at wide breakpoints. Medium and narrow layouts retain their responsive limits |
| `blog_index_size` | positive integer | site value (`12`) | Posts per page for `list`, `cards`, and all three views when the toggle is enabled. A standalone `table` ignores it |
| `blog_index_toggle` | boolean | site value (`false`) | Publishes all three index forms and lets the reader switch among them. Hidden forms do not load images |
| `share` | string array or `false` | site `params.ui.share` (empty) | The page-end share targets. Replaces any inherited list. `false` opts this page out. See [Share](/docs/write/blog/#share). An unknown target warns and is dropped |
| `summary` | string | — | Fallback excerpt for post rows on tag and category pages. `description` takes precedence |
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

## Expo albums {#expo}

OINK 1.3.0 uses `type: expo` for album pages. See [Expo albums](/docs/write/expo/) for the authoring guide.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `expo` | map | site `params.ui.expo` | Replaces the site block; absent fields use the built-in defaults below |
| `expo.images` | string | `images/*` | Pattern for image resources in the page bundle |
| `expo.mode` | `wall` / `cards` / `seamless` | `wall` | Initial mode when the reader has no stored choice |
| `expo.size` | integer | `240` | Target size from 160 to 360 CSS pixels; a stored reader size takes precedence |
{.fields meta="type default"}

Image titles, captions, credits, weights, explicit IDs, and separate originals
use native Hugo `resources` metadata. See [Image metadata](/docs/write/expo/#image-metadata)
for the fields and an example.

## Landing {#landing}

The guide is [Home and landing pages](/docs/customize/home/). Any page with
`layout: landing` uses the landing shell.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `landing` | string | — | Data is taken from `data/landing/<key>/<language>.yaml` |
| `sections` | array | — | Section definitions inlined in front matter, taking precedence over `landing`. A non-array value warns. No sections render |
{.fields meta="type default"}

## Release pages {#releases}

The guide is [Releases and downloads](/docs/write/releases/). A section with
`layout: releases` ignores `weight` and sorts by release date and SemVer,
newest first.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `release_url` | string | — | One GitHub release URL, `https://github.com/<owner>/<repo>/releases/tag/<tag>`. The theme extracts the owner, project and tag and generates source archive links. The date comes from the page's `date`. Download assets come from the release body's `checksums` block (see [Releases](/docs/write/releases/)). Anything else warns and the release block is skipped |
{.fields meta="type default"}

## Related {#related}

- [Writing pages](/docs/write/pages/) — the handful of keys every page needs
- [Organizing content](/docs/write/organize/) — what the sidebar and navigation keys actually do
- [Configuration](/docs/customize/config/) — the full table of site parameters in `hugo.yml`
