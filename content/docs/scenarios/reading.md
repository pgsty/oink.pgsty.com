---
title: Sequential reading and mathematics
linkTitle: Reading
weight: 10
description: >-
  Configure the shared docs, Book, and blog pager and render mathematics with
  local server-side KaTeX.
search_keywords: [pager, prev, next, reading order, math, katex, equation]
---

Oink 0.4.0 gives manuals, Books, and blogs a defined reading sequence. The same
release also makes server-rendered mathematics a first-class content path.

## Enable or narrow the pager {#configure-pager}

The pager is enabled by default for the `docs`, `book`, and `blog` content
types. Replace that set explicitly when a site uses only some of them:

```yaml
params:
  ui:
    pager:
      types: [docs, book, blog]
```

Only those three type names are valid. A page or section can opt out with a
boolean front matter value:

```yaml
---
pager: false
---
```

Interactive HTML renders only the previous or next destination that exists and
adds matching `<link rel="prev">` and `<link rel="next">` elements to the page
head. Print, Markdown, and RSS contain no pager markup or relations.

## Understand reading order {#reading-order}

Docs and Books use a pre-order traversal of the **same navigation root as the
sidebar**: a section index precedes its visible children, and ordinary children
follow weight order. If `data/docs_nav.json` supplies an explicit tree, that
tree is authoritative for both sidebar and pager.

These visible navigation entries are not destinations:

- pages hidden with `toc_hide`;
- link-only placeholders using `manualLink` or `manualLinkRelref`;
- non-linking rows marked `sidebar_divider: true`.

Blogs preserve Hugo's section time order. This is deliberately different from
the manual tree order.

Manuals normally live below the configured docs section. If manual pages
deliberately live at the content root and `/docs/` is only an overview, set:

```yaml
params:
  ui:
    sidebar_root_enabled: true
    docs_root: home
```

`docs_root` accepts only `section` (the default) or `home`; an invalid value is
a build error. With `home`, top-level `toc_root: true` overview sections remain
outside the manual sequence.

## Render delimiter mathematics {#math-passthrough}

Hugo does not merge a theme's Goldmark configuration into a consuming site, so
the site must enable passthrough delimiters:

```yaml
markup:
  goldmark:
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
```

Oink supplies the passthrough render hook and local KaTeX CSS. Formulae render
server-side as KaTeX and MathML, and only formula pages receive the stylesheet.
`math: true` by itself does not enable delimiter parsing.

Build a page containing both inline and display delimiters, then inspect the
HTML for MathML rather than literal `$$`. Long display formulae scroll within
the article column on screen and remain static in print.

## Use the display-math escape hatch {#equation-shortcode}

When a site cannot enable Goldmark passthrough yet, use the parameter-free
display form:

```go-html-template
{{</* eq */>}}E = mc^2{{</* /eq */>}}
```

This form is intentionally unnumbered. It creates no anchor, caption, or Book
registry entry and emits a plain `$$` block in Markdown and RSS. To create a
numbered, referenceable equation, adopt the
[Book equation form](/docs/scenarios/book/#numbered-components) and add a quoted
`num`.

## Validate the reading experience {#validation}

1. Compare sidebar order with the `q`/`e` shortcuts and visible pager.
2. Confirm link-only, divider, and hidden entries are skipped.
3. Inspect head relations at the first, middle, and last destination.
4. Build from a subpath and confirm pager links remain on the current origin.
5. Check that print, Markdown, and RSS omit interaction-only pager markup.
6. Test formula pages in both color modes and print, then confirm an ordinary
   page does not load KaTeX CSS.

See [Keyboard navigation](/docs/advanced/keyboard/) for all reading keys.
