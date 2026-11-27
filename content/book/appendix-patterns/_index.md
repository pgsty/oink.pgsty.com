---
title: Front matter patterns
linkTitle: "Appendix: Patterns"
description: Copy-and-adapt front matter for Docs groups and pages, blog roots, immersive columns, posts, author profiles, book roots and chapters, as used in this book.
book_kind: appendix
book_number: A
weight: 110
---

Each pattern holds only the keys that establish the page's role; add
presentation keys when a reader-facing need asks for them. The chapter named
under each pattern explains its keys.

## Docs group {#docs-group}

```yaml {title="content/docs/operations/_index.md"}
title: Operations
description: Back up, upgrade and monitor a running server.
weight: 35
icon: fa-solid fa-screwdriver-wrench
```

A directory with this `_index.md` becomes a sidebar group whose page lists its
children. See [Chapter 3](/book/03-pages/#tree).

## Docs page {#docs-page}

```yaml {title="content/docs/get-started/quick-start.md"}
title: Quick start
description: Start a server, write a data point and query it back in five minutes.
weight: 30
search_keywords: [getting started, first query]
```

The Chinese peer, `quick-start.zh.md`, keeps the same `weight` and the same
heading IDs. See [Chapter 3](/book/03-pages/#first-page).

## Blog root {#blog-root}

```yaml {title="content/blog/_index.md"}
title: Blog
type: blog
sidebar_root_for: self
blog_index: cards
blog_index_toggle: true
cascade:
  type: blog
  feedback: false
```

See [Chapter 6](/book/06-blog/#index).

## Immersive column {#immersive}

```yaml {title="content/blog/post/_index.md"}
title: Posts
cascade:
  featured_image: hero
  toc_style: flow
  toc_taxonomies: false
  sidebar_enabled: false
```

Posts under this column open on a full-width image, with the outline in the
text column and no sidebar; feeds, bylines and series are unchanged. See
[Chapter 6](/book/06-blog/#immersive).

## Blog post {#post}

```yaml {title="content/blog/post/why-monthly-partitions/index.md"}
title: Why Acme DB partitions by month
date: 2026-11-02
description: Monthly partitions make retention a file deletion.
authors: [mei-lin]
series: [storage-internals]
series_weight: 10
tags: [storage, design]
```

A `featured.webp` beside `index.md` becomes the thumbnail and share image.
`authors` and `series` need their taxonomies declared in `hugo.yaml`. See
[Chapter 6](/book/06-blog/#post).

## Author profile {#author}

```yaml {title="content/authors/mei-lin/_index.md"}
title: Mei Lin
description: Maintains the Acme DB storage engine.
images: [portrait.webp]
```

See [Chapter 6](/book/06-blog/#authors).

## Book root {#book-root}

```yaml {title="content/book/_index.md"}
title: The Acme DB Operations Handbook
type: book
book_kind: book
outputs: [HTML, print, markdown]
cascade:
  type: book
  sidebar_headings: 3
```

The root holds `book-toc` and the index shortcodes, and its `print` output is
the whole book as one document. See [Chapter 7](/book/07-book/#root).

## Book chapter {#chapter}

```yaml {title="content/book/03-capacity.md"}
title: Plan capacity
book_kind: chapter
book_number: 3
book_status: draft
weight: 30
```

`book_number` is printed exactly as written; `book_status: draft` labels the
chapter without unpublishing it. See [Chapter 7](/book/07-book/#chapters).

## Where each key takes effect {#key-map}

| Key | Set on | Effect |
| --- | --- | --- |
| `weight` | Any page | Order among siblings in the sidebar, the pager and the book contents |
| `type` | A section root, passed down by `cascade` | The reading shell: `docs`, `blog` or `book` |
| `cascade` | A section root | Applies its keys to every page below |
| `blog_index` | A blog root or column | `list`, `cards`, `table` or `gallery` |
| `featured_image` | A blog column or post | `none`, `banner`, `wash` or `hero` on the article |
| `book_number` | A book chapter | The chapter number, shown as written |
| `outputs` | A section root | Replaces the site's output list for that page |
{#tbl-key-map num="A-1" caption="The front matter keys used in this book, and where each takes effect."}
