---
title: Give the content a structure
linkTitle: Structure the content
description: Turn directories, section indexes, page bundles, and weights into one predictable reading and navigation order.
book_kind: chapter
book_number: 2
weight: 20
---

OINK does not keep a second navigation database for an ordinary site. The
content tree is the sidebar tree, and the same order drives the pager and the
Book contents. A reader should not encounter three different answers to “what
comes next?”

## Start from the reader's questions {#reader-questions}

Name the top-level sections after tasks or subjects the reader recognizes. A
small engineering site usually needs a start section, a reference, operations
guidance, and a record of change. Add a directory only when it gives several
pages a useful shared context.

## Build the tree {#content-tree}

```filetree {title="A small bilingual documentation tree"}
- content/
  - _index.md
  - _index.zh.md
  - docs/
    - _index.md
    - _index.zh.md
    - start/
      - _index.md
      - _index.zh.md
      - install.md
      - install.zh.md
  - blog/
    - _index.md
    - _index.zh.md
```

Every directory that readers can enter gets an `_index.md`. A translation sits
beside its English source with the `.zh.md` suffix. Use a Page Bundle when a
page owns images or downloads; keep a single Markdown file when it does not.

## Keep order explicit {#ordering}

Use weights in multiples of ten. The gaps leave room for a future page without
renumbering every sibling.

| Item | Weight | Why it comes here |
| --- | ---: | --- |
| Get started | 10 | Establish the working baseline |
| Write content | 20 | Build on a running site |
| Customize | 30 | Change presentation after structure |
| Operate | 40 | Validate and publish the result |
{#tbl-reading-order num="2-1" caption="One explicit order is reused by navigation, paging, and generated contents."}

## Make stable addresses {#stable-addresses}

Write an explicit ID on every heading another page may cite. The English and
Chinese pages use the same ID even though their visible headings differ. This
keeps links, the table of contents, and whole-book print aligned across both
languages.

The [Chapter 1 baseline](/book/01-start/#baseline) is a visible reference
point. The tree in this chapter gives every later change a stable place
relative to it.

For the complete rules, see [Writing pages](/docs/write/pages/) and
[Organizing content](/docs/write/organize/).
