---
title: Taxonomies
linkTitle: Taxonomies
description: Use tags and categories to index pages across directories, with automatic term pages, term cards, rail clouds, and navbar panels.
weight: 110
search_keywords:
  [taxonomy, taxonomies, tags, categories, term pages, tag cloud, term]
aliases:
  - /docs/content/taxonomy/
---

A directory tree gives a page one path. A taxonomy gives it a second. A
PostgreSQL backup document can be in an "Operations" directory and on a
"backup" tag page. To enable this, set Hugo's `taxonomies:`
configuration. The theme generates term pages, term cards, the rail cloud, and
the navbar panel. You do not need to write a template.

This page has a category. The "Categories: Customization" line appears under
the title. Counted chips appear under the outline in the right column. Neither
requires configuration on the page itself.

## Enabling a taxonomy {#enable}

Hugo owns taxonomies. The theme adds no switch of its own. Write
`taxonomies:` at the **top level** of `hugo.yml`, with the singular name as the
key and the plural as the value:

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
```

This site uses that configuration. Apply these three rules:

- `taxonomies:` defines the **complete list**. It does not add to an existing list. To retain `tags` / `categories`, include them with custom taxonomies.
- The plural is also the URL segment: `/tags/`, `/categories/`.
- To disable all taxonomies, use `disableKinds: [taxonomy, term]`.

To add a taxonomy for product modules, use:

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
  module: modules
```

The six keys `tag`, `tags`, `category`, `categories`, `module`, and
`modules` have localized titles in all theme language files. Other taxonomies
use the humanized plural (`products` → `Products`). To set a custom name, write
`title` / `linkTitle` in `content/<plural>/_index.md` and
`_index.zh.md`. The theme gives that name priority:

```yaml {title="content/modules/_index.md"}
---
title: Product modules
linkTitle: Modules
---
```

## Tagging a page {#assign}
The front matter key is the **plural** (the value column of `taxonomies`), and
the value is always a list, even with one entry:

```yaml {title="content/docs/ha/patroni.md"}
---
title: Patroni high availability
description: Managing PostgreSQL failover with Patroni.
categories: [High availability]
tags: [PostgreSQL, Patroni, failover]
---
```

If a whole section shares one category, set it in the section index's
`cascade`. Do not repeat it on every page:

```yaml {title="content/docs/customize/_index.md"}
---
title: Customization
linkTitle: Customization
icon: fa-solid fa-sliders
cascade:
  categories: [Customization]
---
```

All six documentation sections on this site use this configuration. A page's
own `categories:` replaces the cascade. It does not merge with it. To add a
category beside the section's category, write both.

## The term line on a page {#page-header}

Documentation and blog pages show assigned terms under the title and summary.
Each term links to its term page. This page shows "Categories: Customization". Its container is
`.taxonomy-terms-article`. Each taxonomy adds a `.taxo-<plural>` class.
Use those two selectors to style it.

By default, it lists **every** taxonomy except the reserved plurals
`authors` and `series`. These have their own surfaces: a byline and a series
strip. Chips would repeat that information. To include either taxonomy, name
it in `page_header`.

To show only some, in a fixed order:

```yaml {title="hugo.yml"}
params:
  taxonomy:
    page_header: [categories]
```

The key is listed in [Configuration](/docs/customize/config/). It cannot
hide the line. See [Limits](#limits).

## Two taxonomies the theme knows by name {#authors}

`authors` and `series` are ordinary Hugo taxonomies. Declare them in the usual
way. The theme adds no parameter for either. It adds a rendering for each
taxonomy. The declaration alone enables that rendering:

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
  series: series
```

| Plural | What the declaration turns on | The term page becomes |
| --- | --- | --- |
| `authors` | Portraits and linked names in the article head, names on list rows, one `<dc:creator>` per author in the feed | The author's profile. The display name uses `linkTitle`, or `title` if absent. `description` supplies the short introduction. The body supplies the long introduction. The featured-image resolver selects the avatar |
| `series` | A strip above the article body naming the series, this article's position, the next part, and the whole list behind a `<details>` | The series introduction, listing its members in **reading order** rather than newest-first |

For complete details and required front matter, see
[Writing a blog](/docs/write/blog/#authors). Keep these two rules in mind:

- There is deliberately no `data/authors` file. The term page owns the profile, which prevents conflicting sources.
- A series term page does not use reverse-date order. Members with a `series_weight` come first in ascending order. Other members follow by ascending date. A term page cannot give Hugo an order. The theme resolves the order once. Both surfaces use that result.

## Term and taxonomy pages {#term-pages}

Each taxonomy generates two levels of page:

| Page | URL | Contents |
| --- | --- | --- |
| Taxonomy list | `/categories/` | The heading shows the taxonomy's glyph, localized name ("Categories"), and term count. Cards show each term, most-used first. Each card shows its glyph (an author's portrait), name, and page count |
| Term page | `/categories/customization/` | The heading shows the term's title and page count. If breadcrumbs are disabled, a "Categories" kicker links to the list. Member pages follow, newest first, in blog-list style |

A Chinese term's URL uses Chinese characters. The address bar shows 定制站点, and
the HTML is percent-encoded. Hugo does not transliterate. For ASCII URLs, use
English terms. Give each a display name with `title` in
`content/categories/<term>/_index.zh.md` — Hugo's
[term page content file](https://gohugo.io/content-management/taxonomies/#add-custom-metadata-to-a-taxonomy-or-term)
mechanism.

A term page has no fixed location in the content tree. If all members belong
to one top-level section, it uses that section's sidebar tree and root link.
A reader who clicks a documentation tag thus remains in the documentation
navigation. If members belong to different sections, the page uses the site-level tree.

Term cards appear only on the taxonomy list page. Term pages show the rail
cloud instead.

## The rail cloud {#rail-cloud}

Documentation, blog and term pages carry one group per taxonomy in the right
column (under the outline), with counted, collapsible chips. The group is
automatic by default. It appears where a taxonomy is defined and the
current scope has terms. Set `toc_taxonomies: false` in a page's front matter
to hide its rail clouds and taxonomy switcher, or set
`params.ui.toc_taxonomies: false` in `hugo.yml` site-wide. These display settings
leave the page's tags, byline, series and taxonomy membership intact.

Taxonomy list pages and term pages put a taxonomy switcher at the top of the
column. Each declared taxonomy has one row with its glyph, name, and term
count. The row links to its list page. The current taxonomy is highlighted.
A list page counts its clouds site-wide. It excludes its own taxonomy because
the adjacent cards show those terms. A site with a single taxonomy shows no switcher.

The count is **per top-level section**, not site-wide. The theme first looks
for a section named after the page's `type`. A `type: docs` page uses the `/docs/`
tree. Otherwise, it uses the page's top-level section. "Tags: release
4" on a blog page means four posts in the blog. It does not mean four on the site.

Icons are configured by plural name:

```yaml {title="hugo.yml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: fa-solid fa-tags
      modules: fa-solid fa-cubes
```

Those two are the defaults for `categories` and `tags`. Other
taxonomies default to `fa-solid fa-shapes`. An icon is one Font Awesome class
pair, written as everywhere else on the site.

## The taxonomy panel in the navbar {#navbar-panel}

A main-menu entry that points to a taxonomy list page becomes a term-chip
panel automatically. It shows counts and sorts by descending usage. No manual
dropdown is required:

```yaml {title="hugo.yml"}
languages:
  en:
    menus:
      main:
        - identifier: tags
          name: Tags
          pageRef: /tags
          weight: 60
```

Both `pageRef: /tags` and the older `url: /tags/` are recognized. The theme
resolves a URL-form menu entry to a site page before checking its kind.
Migration from an older configuration needs no rewrite. Other ways to write menus are in
[Navigation and menus](/docs/customize/navigation/).

## Bilingual terms {#bilingual}

Hugo counts and links taxonomies per language. `/categories/` and
`/zh/categories/` are separate trees. A Chinese page belongs only to the
Chinese tree. Terms are written once per language in each front matter:

```yaml {title="content/docs/ha/patroni.md"}
categories: [High availability]
tags: [PostgreSQL, Patroni, failover]
```

```yaml {title="content/docs/ha/patroni.zh.md"}
categories: [高可用]
tags: [PostgreSQL, Patroni, 故障切换]
```

Apply these two language rules:

- The same word in both languages (such as `release`) still creates two term pages: `/categories/release/` and `/zh/categories/release/`. Each counts only pages in its own language. Do not use English terms on Chinese pages only for consistency. The rail chips would then show English.
- For the six built-in keys, a taxonomy's display name follows the language. **A term's name does not**. It is the exact front-matter string. The theme does not translate it. If you write `高可用` on an English page, its chip shows `高可用`.

The rest of running a multilingual site is in
[Languages](/docs/customize/i18n/).

## Switching by content type {#per-type}

To retain the rail clouds on documentation but hide them on a blog section,
set the display switch on that section index and its descendants:

```yaml {title="content/blog/_index.md front matter"}
toc_taxonomies: false
cascade:
  toc_taxonomies: false
```

Taxonomy membership is a separate choice: it comes from the terms assigned to
pages. For example, this documentation site uses:

| Content | categories | tags | Effect |
| --- | --- | --- | --- |
| `content/docs/**` | Section-level cascade (the six sections) | none | The term line has one row, Categories |
| `content/blog/**` | Per post (`release`, `oink`) | Per post (`Oink`, `Release`) | Two rows in the term line, two chip groups in the rail |

To exclude a whole section from the taxonomy, delete `categories` from
the section index's cascade. No other change is needed. To exclude one page,
write `categories: []` in its front matter. The empty list overrides the cascade.

## Verify {#verify}

Choose a page in your own site with taxonomy terms assigned, then check:

- Its title area shows the terms selected by `params.taxonomy.page_header`.
- With `toc_taxonomies` enabled, the right rail shows term groups and counts. Disabling it hides the clouds but retains the page's terms.
- Your taxonomy index (for example `/categories/`) lists terms whose links open their member pages.

Run from your site's root, replacing both sample paths with your own page and
taxonomy output paths, including language prefixes:

```bash
hugo --printPathWarnings
PAGE=public/docs/getting-started/index.html
TAXONOMY_DIR=public/categories
ls "$TAXONOMY_DIR"
test -f "$PAGE" && grep -o 'taxonomy-term' "$PAGE"
```

The theme's `bin/check-taxonomy.py` is a maintainer regression check using
synthetic fixtures. It does not inspect your site's content. Use the checks
above to validate your configuration.

## Limits {#limits}

- `page_header: []` does **not** hide the term line. An empty list is treated as unset and lists every taxonomy. To remove the line, stop tagging those pages. Alternatively, hide `.taxonomy-terms-article` in `assets/scss/_styles_project.scss`.
- `toc_taxonomies: false` hides the rail clouds. There is no configuration key to limit the number of terms in a visible cloud.
- Term pages have no cross-language pairing. Language switching does not guarantee the same term in the other language.

## Related {#related}

- [Page parameters](/docs/write/frontmatter/) — `categories` / `tags` and the other front matter keys
- [Blog posts](/docs/write/blog/) — how the blog list works with taxonomies
- [Navigation and menus](/docs/customize/navigation/) — how to write navbar entries
- [Languages](/docs/customize/i18n/) — per-language content and menus
- [Configuration](/docs/customize/config/) — full definitions of `params.taxonomy.*` and `params.ui.taxonomy_icons`
