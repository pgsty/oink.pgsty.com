---
title: Book publishing
linkTitle: Book publishing
weight: 40
description: >-
  Publish long-form content with one navigation tree, numbered components,
  stable cross-references, generated indexes, and whole-Book print HTML.
search_keywords: [book, chapter, figure, table, equation, xref, print]
---

Oink's Book capability extends the documentation shell. It uses the existing
content tree or `data/docs_nav.json`, the same breadcrumbs and pager, and the
same output-aware component system. It does not introduce a second chapter
manifest or a parallel navigation implementation.

## Create the Book root {#book-root}

A section Book declares its type, requests the outputs it needs, and cascades
the type to descendants:

```yaml
---
title: Systems Handbook
type: book
book_kind: book
book_number: B
outputs: [HTML, print, markdown]
cascade:
  type: book
---
```

The Book root is always the current first section, even when the site enables a
sidebar root switcher. Its navigation cannot leak into sibling docs or blogs. If
a site overrides `params.ui.shell_types`, retain `book` in that list.

Request `print` explicitly: Oink never adds an expensive aggregate output to a
consumer configuration. For a section Book, the relevant Hugo output kind is
`section`; use `home` only when the Book is the site root:

```yaml
outputs:
  section: [HTML, print]
params:
  ui:
    shell_types: [docs, book, blog, swagger]
    sidebar_headings: 3
    book_draft_banner: true
```

`sidebar_headings` accepts `false`, `true` (level 2), or a maximum heading level
from 2 through 4. It projects the active page's Hugo fragment tree below the
chapter row. Use explicit heading IDs for anything that will be cited:

```markdown
## Synchronous replication {#sec_replication_sync}
```

Generated heading slugs are convenient navigation, not a durable citation API.

## Describe chapters {#chapter-metadata}

Chapters may use the established metadata namespace:

```yaml
---
title: Replication
book_kind: chapter
book_number: 3
book_part: II
book_status: draft
weight: 30
---
```

`book_number` appears beside titles in the page, sidebar, and generated Book
table of contents. `book_status: draft` is a visible editorial label and does
not change Hugo's publication state. Set `book_draft_banner: true` to add a
localized page notice as well.

## Add numbered components {#numbered-components}

The numbered forms of `fig`, `tbl`, and `eq` require a **quoted** `num` matching
letters, numbers, dots, or hyphens. Their default IDs are `fig-<num>`,
`tbl-<num>`, and `eq-<num>`; set an explicit stable ID when preserving an
existing public anchor.

### Figures {#figures}

```go-html-template
{{</* fig num="2-1" id="office_2003" src="/fig/office.png"
    caption="The Word 2003 interface" alt="Word 2003 with stacked toolbars"
    width="960" height="640" */>}}
```

New figures should always provide meaningful `alt`. `title` is a migration alias
for `caption` and the two are mutually exclusive. A figure may use `src` or
inner Markdown content, never both. URLs, class tokens, and positive image
dimensions are validated.

### Tables {#tables}

<!-- prettier-ignore-start -->
```go-html-template
{{</* tbl num="2-1" id="output-matrix" caption="Output behavior by surface." */>}}
| Surface | Label | Anchor |
| --- | --- | --- |
| HTML | Visible | Stable |
| Print | Visible | Stable |
{{</* /tbl */>}}
```
<!-- prettier-ignore-end -->

The component keeps label, Markdown table, caption, and anchor inside one
semantic figure. It does not simulate captions with a heading.

### Equations {#equations}

```go-html-template
{{</* eq num="5.3" id="eq-capacity" caption="Capacity approximation." */>}}
X \approx \frac{C}{R+Z}
{{</* /eq */>}}
```

Equation content goes directly through local server-side KaTeX, even if the site
has not enabled Goldmark passthrough. The parameter-free `eq` form remains an
unnumbered display-math escape hatch and cannot be an `xref` target.

Duplicate IDs, or two components of the same kind claiming one number with
different IDs, are build errors. Captions are plain text; figure and table body
content follows the page's Markdown policy.

## Cross-reference safely {#cross-references}

Reference a numbered target by kind and number:

```go-html-template
See {{</* xref fig="2-1" anchor="office_2003" */>}}.
```

Reference a heading on another page with explicit link text:

```go-html-template
See {{</* xref page="../replication" anchor="sec_replication_sync" */>}}synchronous replication{{</* /xref */>}}.
```

`xref` accepts at most one kind (`fig`, `tbl`, or `eq`), plus optional `page`
and `anchor`. A kind supplies the localized default label and derives the
default anchor. An anchor-only reference requires inner text. Cross-page lookup
uses Hugo's current-language page resolution, so source never hard-codes an
`/en/` route.

References are order-independent and may appear before their targets. In
whole-Book print, Book-aware xrefs become document-local fragments. Ordinary
Markdown cross-page links intentionally remain site URLs, so use `xref` for
citations that must work inside the aggregate.

## Generate Book indexes {#book-indexes}

Build a table of contents from the same ordered Book tree:

```go-html-template
{{</* book-toc depth=3 */>}}
```

Depth 1 lists chapters, depth 2 includes nested sections, and depth 3 also
projects each page's heading tree. `drafts=false` filters visible editorial
drafts from this generated list only; it does not unpublish their pages.

Generate figure, table, or equation lists:

```go-html-template
{{</* book-figures */>}}
{{</* book-figures kind="tbl" */>}}
{{</* book-figures kind="eq" */>}}
```

These shortcodes trigger and aggregate descendant content deterministically,
then link to stable target IDs. They do not require a copied registry file.

## Publish whole-Book print {#whole-book-print}

The Book root's `print` output emits a cover, local table of contents, then the
root and visible descendants in reading order. `no_print: true`, link-only
nodes, sidebar dividers, and hidden placeholders do not become chapters.

Numbered target IDs remain byte-stable. Page-local Markdown heading IDs receive
a source-page prefix in the aggregate, so repeated anchors such as `summary`
remain unique; generated heading links are rewritten accordingly. Book ToC,
figure-list, and `xref` destinations become document-local.

The result is print-oriented HTML, not a network-dependent PDF/EPUB pipeline.
Pagination, PDF conversion, and EPUB packaging remain site-owned concerns.

## Migrate existing books {#migration}

Inventory first, transform only unambiguous forms, and stop rather than guessing
missing numbers, captions, alternatives, or targets. Preserve existing public
IDs independently from display numbers. Run migrations on a branch, retain a
machine-readable before/after report, validate every skipped record, and require
a zero-change second run.

The Oink v0.4.0 source ships a dry-run-first, idempotent migration tool and
observed-site recipes for
[TPME](https://github.com/pgsty/oink/blob/v0.4.0/docs/prd5-migrate-tpme.md),
[DDIA](https://github.com/pgsty/oink/blob/v0.4.0/docs/prd5-migrate-ddia.md), and
[pg-internal](https://github.com/pgsty/oink/blob/v0.4.0/docs/prd5-migrate-pg-internal.md).
Treat those as executable patterns for the named source forms, not universal
caption heuristics.

## Validate a Book {#validation}

1. Compare the sidebar, pager, generated ToC, and whole-Book chapter order.
2. Verify every numbered target ID is unique and every xref reaches a matching
   kind and number in each language.
3. Confirm numbered figure alternatives are meaningful and caption compatible.
4. Inspect standalone HTML, Markdown, print, and the whole-Book aggregate.
5. Test repeated heading names and cross-chapter citations in aggregate print.
6. Run the theme's `scripts/check-book.py` when working from a theme checkout,
   or implement the same rendered-anchor checks in consumer CI.
