---
title: Consumer and migration evidence
linkTitle: Consumer evidence
description: A dated consumer corpus survey that informed OINK shells, authoring primitives, and deterministic Book migration rules.
weight: 20
icon: fa-solid fa-chart-column
search_keywords: [consumer survey, corpus, migration evidence, Book, DDIA, TPME]
design_kind: research
design_status: verified-snapshot
last_verified: 2026-08-24
---

> [!NOTE] Dated corpus snapshot
> These counts describe repositories inspected in August 2026 to inform OINK's
> shell, component, and Book migration design.

## Corpus {#corpus}

The authoring survey scanned the `content/` trees of eleven OINK consumer sites
and found 5,325 Markdown files, of which 5,293 had YAML front matter.
The survey included single-language English and Chinese references, bilingual
product sites, release archives, custom landing pages, and separate Book consumers.

The survey measured source Markdown, counting
shortcode calls, fenced-code attributes, callouts, table markers,
raw HTML, front-matter keys, content types, and site-local layouts.
A later Book-focused survey added five long-form consumers.

## Findings that changed the design {#findings}

| Evidence                                                                                               | Resulting choice                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Content ranged from nearly plain Markdown to pages with many nested components                         | Native Markdown is the default form; a full form survives only for a named capability gap                                                        |
| Documentation, Blog, Landing, releases, and books repeatedly reimplemented navigation or cards locally | Extend the shared shell, registry, and primitive rather than adding a parallel system                                                            |
| Site-specific table classes were common, while canonical Field-table headings were rare                | Hook attributes use an allowlist but preserve documented site-class extension points; Fields cannot be inferred from arbitrary two-column tables |
| Book sites carried private figure, table, equation, example, and cross-reference conventions           | Numbered primitives and migration profiles need deterministic classification, stable IDs, and rendered-target verification                       |
| Sites mixed single-language, peer-file bilingual, and generated-language content                       | Language authority and generation boundaries must be explicit; a migration never treats an untracked generated tree as source                    |
| Rich HTML pages still needed print, Markdown, feeds, and agent output                                  | Every component declares its output degradation before its interactive HTML is accepted                                                          |

The evidence also ruled out several additions: documentation sites did not
require a second Landing system, Book sites did not need a new cover component,
and a serial archive did not require a new shell type. Remote API collection
belongs in site-side CI, outside a Hugo theme built for local rendering.

## Block and table evidence {#block-and-table-evidence}

A focused survey of eleven sites plus Book consumers found 11,484 pipe tables,
but only eleven matched the strict Field-table heading vocabulary. Roughly 874
were reference-style tables and about 1,300 were compatibility matrices. OINK
therefore uses explicit `.fields` and `.matrix` markers rather than inferring
these components from table shape.

The same survey found eighteen Steps blocks in the eleven-site corpus, all
using the full form with headings and rich content. Platform probes showed that
a native ordered list could contain most of that content, but not another full
`%` container inside a list item. OINK keeps both forms because their technical
capabilities differ.

## Deterministic Book migration {#book-migration}

Three dated dry-run profiles checked whether migration rules accounted for
every recognized source without inventing meaning:

| Profile snapshot     | Classified result                                                                  | Manual boundary                                                 |
| -------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| DDIA v2              | 106 figures, 3 tables, 22 code examples, and all 304 relevant links accounted for  | One caption link flattened to visible text; no unaccounted skip |
| DDIA v1              | 90 numbered figures and 203 matching references                                    | 14 decorative or unnumbered images deliberately left alone      |
| TPME                 | 31 figures, 10 tables, 44 numbered references, and 1,018 generic stable references | No skipped recognized item                                      |
| Private Book profile | 119 figures, 5 tables, and 136 numbered references                                 | 3 ambiguous images retained for manual review                   |

Each profile first ran without writes, and writes began only after reviewers
understood its ambiguous inputs. A second run produced zero changes.
Each profile built with warnings fatal and passed rendered kind/number/anchor
checks. The public migration toolkit and current profile boundaries are
documented in
[Writing a book](/docs/write/book/#migrate) and the
[migration contract](/docs/design/migration/).

## Publication adoption snapshot {#publication-adoption}

An isolated 2026-08-24 check tested the released generic Book publication
path with two consumers:

| Consumer | Generic publication evidence                                                                                 | Downstream status                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| DDIA     | 23 ordered pages, 131 typed targets, and 292 resolved cross-references; EPUBCheck, internal, and PDF checks passed | At this snapshot it still retained a semantic preprocessor pending independent acceptance of the new gate |
| TPME     | 18 ordered pages, 41 typed targets, and 1,062 resolved cross-references; the same generic checks passed     | A second consumer confirmed portability; it created no upstream migration gate                            |

These results record downstream adoption of the generic publication pipeline.

## Limits {#limits}

Repeating this survey requires a fresh repository list and a new dated
snapshot. This public record omits local filesystem paths, uncommitted content,
private repository names, and generated build artifacts.
