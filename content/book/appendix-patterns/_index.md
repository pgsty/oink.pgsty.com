---
title: Front matter patterns
linkTitle: "Appendix: Patterns"
description: Copy-and-adapt contracts for Book roots, chapters, immersive Blog posts, and generated Book outputs.
book_kind: appendix
book_number: A
book_status: draft
weight: 70
---

These patterns are intentionally small. Copy the fields that establish the
content contract, then add presentation options only when a reader-facing need
requires them.

## Book section root {#section-root}

```yaml
type: book
book_kind: book
outputs: [HTML, print, markdown]
cascade:
  type: book
  book_draft_banner: true
```

The root declares the Book shell and generated outputs. It does not need a
chapter number; numbering belongs to the material that appears in the reading
sequence.

## Book chapter {#chapter-pattern}

```yaml
book_kind: chapter
book_number: 1
book_status: draft
weight: 10
```

Use `book_status: draft` for a visible editorial state. Unlike Hugo's
`draft: true`, it keeps the page available in a normal build so reviewers can
read the unfinished chapter.

## Immersive Blog article {#article-pattern}

```yaml
type: blog
authors: [oink, vonng]
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

The article remains part of the Blog family—feeds, authors, series, and sharing
continue to work—while the keys above change only its reading presentation.

## Generated output matrix {#output-matrix}

| Output | Scope | Typical use |
| --- | --- | --- |
| HTML | One root or chapter | Reading, navigation, and search |
| print | The complete Book | Review, printing, and PDF conversion |
| markdown | The source-shaped Book | Export and downstream processing |
{#tbl-output-matrix num="A-1" caption="One source tree can expose several purpose-specific Book outputs."}

The generated contents, figure, table, equation, and example indexes on the
Book root prove these contracts together. Keep explicit heading and object IDs
aligned between translations so every format preserves the same references.
