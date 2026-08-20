---
title: Markdown-first authoring
linkTitle: Markdown-first authoring
description: Native Markdown carries common semantics; shortcodes fill real capability gaps, and content models extend shared shells instead of forking them.
weight: 30
icon: fa-brands fa-markdown
search_keywords:
  [Markdown first, authoring API, shortcode, render hook, content model]
design_kind: decision
design_status: accepted
decision_date: 2026-08-17
---

> [!IMPORTANT] Decision
> Prefer a native Markdown form when Goldmark can preserve the intended
> semantics. Keep a shortcode only when it provides a capability the native
> form cannot express. Add a content scenario by extending an existing shell
> and data model, not by creating a parallel rendering system.

## Context {#context}

OINK serves short manuals, large references, release archives, landing pages,
and books. A survey of eleven consumer sites covered more than five thousand
Markdown files and exposed both extremes: pages with almost no theme syntax and
pages assembled from many nested shortcodes and local layout overrides.

A component API optimized only for the second group becomes a private DSL. An
API optimized only for plain Markdown leaves books, rich figures, tab groups,
and structured releases to site-local HTML. The useful boundary is capability,
not novelty.

## Decision {#decision}

OINK applies the following order:

1. **Native Markdown first.** Lists become Steps, Cards, or FileTree markers;
   tables become Fields or matrices; blockquotes become callouts; fenced code,
   images, and passthrough blocks carry attributes through render hooks.
2. **Shortcodes for missing capability.** A full-form shortcode remains where
   CommonMark indentation, nested containers, processing options, or
   cross-page registration cannot express the same result safely.
3. **One semantic implementation.** Native and full forms normalize into the
   same partials and output contract. They are not two components that merely
   look alike.
4. **One extension line.** A new Landing section joins the section registry; a
   new Blog presentation remains a Blog variant; Book numbering joins the
   content primitive and navigation systems. OINK does not add a second card,
   landing, navigation, or article shell for one feature.
5. **Facts stay outside presentation strings.** Versions, repositories,
   dates, and ordered records come from front matter, site parameters, or data
   files. A shortcode argument is not a second source of truth.

## Output contract {#output-contract}

An authoring form is complete only when its semantic content has a deliberate
result in every enabled output:

| Output          | Requirement                                                              |
| --------------- | ------------------------------------------------------------------------ |
| HTML            | Semantic server-rendered content; JavaScript only enhances it            |
| Print           | Static, expanded, and free of controls that require interaction          |
| Markdown / LLMS | Source-shaped prose, links, lists, tables, and fences; no component HTML |
| RSS             | Safe static content or an explicit omission                              |

This requirement prevents an attractive HTML-only component from silently
damaging agent output, feeds, or a printable book.

## Trust and presentation {#trust-and-presentation}

Render hooks and shortcodes consume explicit allowlists. Unsafe URL schemes,
inline event handlers, and arbitrary style input are dropped. Author-provided
classes are accepted only on the documented surfaces where downstream site CSS
is part of the established authoring contract. Icons use one Font Awesome class
pair; OINK does not invent a second icon-ID language.

## Consequences {#consequences}

- A proposed component must first show why Markdown plus an existing hook is
  insufficient.
- Keeping a full-form shortcode requires a named capability and tests for both
  forms reaching the same normalized output.
- Shell variants use independent presentation keys so opting into a hero or a
  flow outline does not change taxonomies, feeds, pager order, or content type.
- Consumer evidence is dated research, not a permanent excuse to freeze an
  accidental syntax. The current public surface remains defined by the
  [component contract](/docs/design/components/) and
  [shell contract](/docs/design/shell/).

## Verification {#verification}

The authoring contract is exercised by theme component, Book, output, and
golden checkers, then by this site's bilingual examples and browser suites. The
Goldmark facts behind the native forms are recorded in
[block-attribute research](/docs/design/research/goldmark-attributes/).
