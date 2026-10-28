---
title: Publish more than reference pages
linkTitle: Choose a publishing surface
description: Use Docs, Blog, Case, Book, and release pages as distinct answers to distinct reader needs.
book_kind: chapter
book_number: 5
weight: 50
---

One site can publish several kinds of knowledge without forcing them into one
layout. The content type selects the shell; front matter variants refine the
presentation inside that shell.

## Match the surface to the reader {#surfaces}

- Docs answer a task or reference question and expose their place in a tree.
- Blog posts are dated articles with authors, taxonomies, feeds, and sharing.
- Case pages explain how a real site applies the theme.
- Book chapters form a deliberate reading sequence with stable references.
- Release notes connect a version to migration and verification evidence.

## Configure a Blog family {#blog-family}

An ordinary Blog section can use horizontal entries (`list`), regular cards
(`cards`), a compact table (`table`), or a cover gallery (`gallery`). OINK 1.4.0
supports all four. The [blog layout guide](/docs/write/blog/#list) covers selection,
reader switching, and the gallery's three arrangements.

A section that needs an immersive opening keeps the same type and changes
four independent presentation keys:

```yaml
type: blog
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

This is the same configuration used by
[Immersive reading](/blog/oink/immersive-reading/), sharing the standard `blog`
templates, feeds, and taxonomy pages.

## Turn examples into Case studies {#case-studies}

A Case index uses the Blog card form, while each internal page documents the
site, source, language model, scale, and OINK features before linking to the
live result. Giving each case its own overview page lets readers inspect how the
site is structured before visiting the live URL.

## Keep Book and Docs complementary {#book-and-docs}

Reference pages remain exhaustive and independently searchable. A tutorial
selects a path through that reference, introduces one decision at a time, and
links back when a reader needs the full parameter table.

To see how a dated release announcement complements your documentation tree,
add `content/blog/release/0.2.0.md` (and `0.2.0.zh.md`) in your Starter checkout
and link it directly to the guide you created in Chapter 3:

```markdown {title="content/blog/release/0.2.0.md"}
---
title: Acme 0.2.0
date: 2026-10-28
description: Adds local preview verification and bilingual home-page navigation.
tags: [release, preview]
---

Acme 0.2.0 adds a repeatable local preview check before production builds.

## Highlights {#highlights}

- Added the [Verify a local preview](/docs/preview-check/) guide.
- Updated the English and Chinese home pages to link directly to the workflow.
```

Open `http://localhost:1313/blog/release/0.2.0/`. The release post announces
*when* and *why* the change shipped, while `/docs/preview-check/` stays the
evergreen *how-to* reference.

