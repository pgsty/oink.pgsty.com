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

The directory tree gives each page one place; tags and categories give it more.
A PostgreSQL backup guide can live under "Operations" and still be one click
away from the "backup" tag, so readers who think in topics rather than in your
folder structure find it too. Declare the taxonomies in `hugo.yml` and tag your
pages; OINK generates the term pages, the term cards, the clouds in the right
rail and the navbar panel without a template of your own.

This page is an example: the "Categories: Customization" line under its title
and the counted chips under the outline in the right rail come from its
section's category, with no configuration on the page itself.

## Enabling a taxonomy {#enable}

Taxonomies are a Hugo feature, so there is no theme switch. Write
`taxonomies:` at the **top level** of `hugo.yml`, with the singular name as the
key and the plural as the value:

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
```

- The list is complete, not added to Hugo's defaults: once you write `taxonomies:`, `tags` and `categories` exist only if you list them.
- The plural is also the URL segment: `/tags/`, `/categories/`.
- `disableKinds: [taxonomy, term]` turns all taxonomies off.

To classify pages by product module as well:

```yaml {title="hugo.yml"}
taxonomies:
  tag: tags
  category: categories
  module: modules
```

`tags`, `categories`, `modules`, `authors` and `series`, and their singular
forms, have translated names in every theme language file. Any other taxonomy
is named after its plural (`products` becomes "Products"). To choose the name
yourself, write `title` / `linkTitle` in `content/<plural>/_index.md` and its
translations, such as `_index.zh.md`; that name takes precedence:

```yaml {title="content/modules/_index.md"}
---
title: Product modules
linkTitle: Modules
---
```

## Tagging a page {#assign}

The front matter key is the **plural** (the value side of `taxonomies`), and
its value is always a list, even with a single term:

```yaml {title="content/docs/ha/patroni.md"}
---
title: Patroni high availability
description: Managing PostgreSQL failover with Patroni.
categories: [High availability]
tags: [PostgreSQL, Patroni, failover]
---
```

When a whole section shares a category, set it once in the section index's
`cascade` instead of on every page:

```yaml {title="content/docs/customize/_index.md"}
---
title: Customization
linkTitle: Customization
icon: fa-solid fa-sliders
cascade:
  categories: [Customization]
---
```

All six documentation sections of this site do this. A page's own
`categories:` replaces the cascaded value rather than merging with it, so to
add a category next to the section's, list both.

## The term line on a page {#page-header}

Documentation and blog pages list their terms under the title and summary,
each linked to its term page; on this page that is "Categories: Customization".
To style the line, target its container `.taxonomy-terms-article` and the
`.taxo-<plural>` class each taxonomy adds.

By default the line shows **every** taxonomy except `authors` and `series`,
whose terms already appear in the byline and the series strip; listing them
again as chips would say the same thing twice. To show only some taxonomies, in
a fixed order, name them in `page_header`; naming `authors` or `series` there
brings them back:

```yaml {title="hugo.yml"}
params:
  taxonomy:
    page_header: [categories]
```

`page_header` cannot hide the line; see [Limits](#limits). The key is listed in
[Configuration](/docs/customize/config/).

## Two taxonomies the theme knows by name {#authors}

`authors` and `series` are ordinary Hugo taxonomies with no theme parameters of
their own. Declaring them is the whole switch, because the theme has a
dedicated presentation for each:

```yaml {title="hugo.yml"}
taxonomies:
  category: categories
  tag: tags
  author: authors
  series: series
```

| Plural | What the declaration turns on | The term page becomes |
| --- | --- | --- |
| `authors` | Portraits and linked names in the article head, names on list rows, one `<dc:creator>` per author in the feed | The author's profile. The display name is `linkTitle`, or `title` if absent; `description` is the short introduction and the body the long one; the featured-image resolver picks the portrait |
| `series` | A strip above the article body naming the series, this article's position and the next part, with the whole list behind a `<details>` | The series introduction, listing its members in **reading order** rather than newest first |

[Writing a blog](/docs/write/blog/#authors) covers both in full, with the front
matter each needs. Two design choices are worth knowing in advance:

- There is no `data/authors` file. The term page is the profile, so there is never a second source to disagree with it.
- Series members are ordered for reading: members with a `series_weight` come first in ascending order, then the rest by ascending date. Hugo cannot be given that order for a term page, so the theme computes it once and both the strip and the term page use the result.

## Term and taxonomy pages {#term-pages}

Each taxonomy generates two levels of page:

| Page | URL | Contents |
| --- | --- | --- |
| Taxonomy list | `/categories/` | A heading with the taxonomy's icon, its localized name ("Categories") and the number of terms, then one card per term, most-used first, each with its icon (an author's portrait), name and page count |
| Term page | `/categories/customization/` | A heading with the term's title and page count, plus a "Categories" kicker linking to the list when breadcrumbs are off. The member pages follow, newest first, styled like a blog list |

Term cards appear only on the taxonomy list page; term pages show the rail
cloud instead.

Hugo does not transliterate, so a Chinese term gets a Chinese URL: the address
bar shows 定制站点 and the HTML carries it percent-encoded. For ASCII URLs, use
English terms and give each a display name with `title` in
`content/categories/<term>/_index.zh.md`, Hugo's
[term page content file](https://gohugo.io/content-management/taxonomies/#add-custom-metadata-to-a-taxonomy-or-term)
mechanism.

A term page has no place of its own in the content tree, so it borrows one.
When all its members belong to one top-level section, it shows that section's
sidebar tree and root link, so a reader who clicks a documentation tag stays in
the documentation navigation. When the members span sections, it shows the
site-level tree.

## The rail cloud {#rail-cloud}

The right rail of documentation, blog and term pages has one group per
taxonomy under the outline, with counted, collapsible chips. A group appears
whenever the taxonomy is declared and has terms in the current scope. To hide
the clouds and the taxonomy switcher, set `toc_taxonomies: false` in a page's
front matter, or `params.ui.toc_taxonomies: false` in `hugo.yml` for the whole
site. This changes only the rail: the page keeps its terms, byline, series and
membership.

Taxonomy list pages and term pages start the rail with a taxonomy switcher: one
row per declared taxonomy with its icon, name and term count, linking to its
list page, with the current one highlighted. A site with a single taxonomy has
no switcher. A list page counts its clouds across the whole site and leaves
out its own taxonomy, whose terms are already the cards beside it.

Elsewhere the counts are **per top-level section**, not site-wide. The theme
first looks for a section named after the page's `type`, so a `type: docs` page
counts within `/docs/`; otherwise it uses the page's own top-level section.
"Tags: release 4" on a blog page therefore means four posts in the blog, not
four pages on the site.

Each taxonomy has two built-in icons: one for its group heading and one for
each term chip.

| Taxonomy | Group icon | Term icon |
| --- | --- | --- |
| `categories` | `fa-solid fa-folder-open` | `fa-solid fa-folder` |
| `tags` | `fa-solid fa-tags` | `fa-solid fa-tag` |
| `modules` | `fa-solid fa-cubes` | `fa-solid fa-cube` |
| `authors` | `fa-solid fa-users` | `fa-solid fa-user-pen` |
| `series` | `fa-solid fa-book-bookmark` | `fa-solid fa-book` |
| Any other | `fa-solid fa-shapes` | `fa-solid fa-shapes` |

Override them by plural name. A string sets both icons; a map with `taxonomy`
and `term` sets them separately, and a key you leave out keeps its built-in
icon. Each value is one Font Awesome class pair:

```yaml {title="hugo.yml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: { taxonomy: fa-solid fa-tags, term: fa-solid fa-hashtag }
      modules: fa-solid fa-cubes
```

## The taxonomy panel in the navbar {#navbar-panel}

A main-menu entry that points at a taxonomy list page opens a panel of term
chips with their counts, most-used first. You write no dropdown entries for it:

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

The older `url: /tags/` form works too, because the theme resolves a URL entry
to the site page it names before checking whether that page is a taxonomy, so
an existing menu needs no rewrite. Other menu options are in
[Navigation and menus](/docs/customize/navigation/).

## Bilingual terms {#bilingual}

Hugo counts and links taxonomies per language: `/categories/` and
`/zh/categories/` are separate trees, and a Chinese page belongs only to the
Chinese one. Write the terms in each language's front matter:

```yaml {title="content/docs/ha/patroni.md"}
categories: [High availability]
tags: [PostgreSQL, Patroni, failover]
```

```yaml {title="content/docs/ha/patroni.zh.md"}
categories: [高可用]
tags: [PostgreSQL, Patroni, 故障切换]
```

- The same string in both languages, such as `release`, still makes two term pages, `/categories/release/` and `/zh/categories/release/`, each counting only its own language. Using English terms on Chinese pages for the sake of consistency therefore gains nothing and shows English chips to Chinese readers.
- Taxonomy names are translated for the built-in plurals, but **term names are not**: a term is exactly the string in front matter. Write `高可用` on an English page and its chip shows `高可用`.

Running a multilingual site is covered in [Languages](/docs/customize/i18n/).

## Switching by content type {#per-type}

The rail clouds are a display setting. To keep them in the documentation but
hide them throughout the blog, set the switch on the blog index and cascade it
to its pages:

```yaml {title="content/blog/_index.md front matter"}
toc_taxonomies: false
cascade:
  toc_taxonomies: false
```

Which pages belong to a taxonomy is a separate choice, made by the terms you
assign. This site, for example, uses categories for sections and tags only on
the blog:

| Content | categories | tags | Effect |
| --- | --- | --- | --- |
| `content/docs/**` | Section-level cascade (the six sections) | none | The term line has one row, Categories |
| `content/blog/**` | Per post (`release`, `oink`) | Per post (`Oink`, `Release`) | Two rows in the term line, two chip groups in the rail |

To take a whole section out of a taxonomy, delete `categories` from its index's
cascade. To take out one page, write `categories: []` in its front matter; the
empty list overrides the cascade.

## Verify {#verify}

On a page of your own that has terms assigned, check that:

- the title area shows the taxonomies chosen by `params.taxonomy.page_header`;
- with `toc_taxonomies` on, the right rail shows term groups with counts, and turning it off hides the clouds but keeps the page's terms;
- your taxonomy list page (for example `/categories/`) lists the terms, and each opens a page of its members.

From your site's root, replacing both example paths with your own, language
prefix included:

```bash
hugo --printPathWarnings
PAGE=public/docs/getting-started/index.html
TAXONOMY_DIR=public/categories
ls "$TAXONOMY_DIR"
test -f "$PAGE" && grep -o 'taxonomy-term' "$PAGE"
```

## Limits {#limits}

- `page_header: []` does **not** hide the term line: an empty list counts as unset, so every taxonomy is listed. To remove the line, stop tagging those pages, or hide `.taxonomy-terms-article` in `assets/css/project.css`.
- `toc_taxonomies: false` hides the rail clouds, but no setting limits how many terms a visible cloud shows.
- Term pages are not paired across languages, so switching language on a term page does not necessarily lead to the same term in the other language.

## Related {#related}

- [Page parameters](/docs/write/frontmatter/) — `categories` / `tags` and the other front matter keys
- [Blog posts](/docs/write/blog/) — how the blog list works with taxonomies
- [Navigation and menus](/docs/customize/navigation/) — how to write navbar entries
- [Languages](/docs/customize/i18n/) — per-language content and menus
- [Configuration](/docs/customize/config/) — full definitions of `params.taxonomy.*` and `params.ui.taxonomy_icons`
