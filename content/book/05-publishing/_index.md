---
title: Publish more than reference pages
linkTitle: Choose a publishing surface
description: Use Docs, Blog, Case, Book, and release pages as distinct answers to distinct reader needs.
book_kind: chapter
book_number: 5
book_status: draft
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

An ordinary Blog section can choose rows, cards, or a table. A section that
needs an immersive opening keeps the same type and changes four independent
presentation keys:

```yaml
type: blog
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

This is the same contract demonstrated by
[Immersive reading](/blog/oink/immersive-reading/). There is no second Article
type and no duplicated publishing pipeline.

## Turn examples into Case studies {#case-studies}

A Case index uses the Blog card form, while each internal page documents the
site, source, language model, scale, and OINK features before linking to the
live result. Keeping an internal explanation page makes the showcase part of
the documentation rather than a wall of outbound logos.

## Keep Book and Docs complementary {#book-and-docs}

Reference pages remain exhaustive and independently searchable. A tutorial
selects a path through that reference, introduces one decision at a time, and
links back when a reader needs the full parameter table.

The complete walkthrough will add a new article, one Case study, and a short
Book chapter from the same source facts, then compare their reader experience.

