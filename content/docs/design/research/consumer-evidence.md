---
title: Consumer and migration evidence
linkTitle: Consumer evidence
description: A dated corpus snapshot that shaped OINK's shells, authoring primitives, and deterministic Book migration policy.
weight: 20
icon: fa-solid fa-chart-column
search_keywords: [consumer survey, corpus, migration evidence, Book, DDIA, TPME]
design_kind: research
design_status: verified-snapshot
last_verified: 2026-08-24
---

> [!NOTE] Dated corpus snapshot
> These counts describe the repositories inspected in August 2026. They are
> evidence for design choices, not live product metrics or compatibility
> promises.

## Corpus {#corpus}

The authoring survey scanned the `content/` trees of eleven OINK consumer sites:
5,325 Markdown files, of which 5,293 had YAML front matter. The set included
single-language English and Chinese references, bilingual product sites,
release archives, custom landing pages, and separate Book consumers.

The survey deliberately measured source Markdown rather than generated HTML.
It counted shortcode calls, fenced-code attributes, callouts, table markers,
raw HTML, front-matter keys, content types, and site-local layouts. A later
Book-focused pass added five long-form consumers.

## Findings that changed the design {#findings}

| Evidence                                                                                               | Resulting choice                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Content ranged from nearly plain Markdown to pages with many nested components                         | Native Markdown is the default form; a full form survives only for a named capability gap                                                        |
| Documentation, Blog, Landing, releases, and books repeatedly reimplemented navigation or cards locally | Extend the shared shell, registry, and primitive rather than adding a parallel system                                                            |
| Site-specific table classes were common, while canonical Field-table headings were rare                | Hook attributes use an allowlist but preserve documented site-class extension points; Fields cannot be inferred from arbitrary two-column tables |
| Book sites carried private figure, table, equation, example, and cross-reference conventions           | Numbered primitives and migration profiles need deterministic classification, stable IDs, and rendered-target verification                       |
| Sites mixed single-language, peer-file bilingual, and generated-language content                       | Language authority and generation boundaries must be explicit; a migration never treats an untracked generated tree as source                    |
| Rich HTML pages still needed print, Markdown, feeds, and agent output                                  | Every component declares its output degradation before its interactive HTML is accepted                                                          |

The evidence also rejected several attractive additions. Documentation sites
did not justify a second Landing system; Book sites did not need a new cover
component; a serial archive did not justify a new shell type; and remote API
collection belonged to site-side CI rather than a Hugo theme that promises
local builds.

## Block and table evidence {#block-and-table-evidence}

A focused pass over eleven sites plus Book consumers found 11,484 pipe tables.
Only eleven already matched the strict Field-table heading vocabulary, while
roughly 874 were reference-style tables and about 1,300 were compatibility
matrices. The result was explicit `.fields` and `.matrix` markers rather than
shape guessing.

The same pass found eighteen Steps blocks in the eleven-site corpus. They all
used the full form with headings and rich content. Platform probes showed that
a native ordered list could carry most of that content, while another full `%`
container inside a list item could not. OINK therefore keeps both forms for a
technical capability boundary, not merely for stylistic preference.

## Deterministic Book migration {#book-migration}

Three dated dry-run profiles tested whether the migration rules could account
for every recognized source without inventing semantics:

| Profile snapshot     | Classified result                                                                  | Manual boundary                                                 |
| -------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| DDIA v2              | 106 figures, 3 tables, 22 code examples, and all 304 relevant links accounted for  | One caption link flattened to visible text; no unaccounted skip |
| DDIA v1              | 90 numbered figures and 203 matching references                                    | 14 decorative or unnumbered images deliberately left alone      |
| TPME                 | 31 figures, 10 tables, 44 numbered references, and 1,018 generic stable references | No skipped recognized item                                      |
| Private Book profile | 119 figures, 5 tables, and 136 numbered references                                 | 3 ambiguous images retained for manual review                   |

Each profile was dry-run first, wrote only after its ambiguity boundary was
understood, produced zero changes on a second run, built with warnings fatal,
and passed rendered kind/number/anchor checks. The public migration toolkit and
current profile boundaries are documented in
[Writing a book](/docs/write/book/#migrate) and the
[migration contract](/docs/design/migration/).

## Publication adoption snapshot {#publication-adoption}

An isolated 2026-08-24 pass exercised the released generic Book publication
path against two consumers:

| Consumer | Generic publication evidence                                                                                 | Downstream status                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| DDIA     | 23 ordered pages, 131 typed targets, and 292 resolved cross-references; EPUBCheck, internal, and PDF checks passed | At this snapshot it still retained a semantic preprocessor pending independent acceptance of the new gate |
| TPME     | 18 ordered pages, 41 typed targets, and 1,062 resolved cross-references; the same generic checks passed     | A second consumer confirmed portability; it created no upstream migration gate                            |

This is downstream adoption evidence, not an open upstream design boundary.

## Limits {#limits}

These counts should not be copied into product marketing or used as a current
site inventory. Repeating the research requires a fresh repository list and a
new dated report. Paths, uncommitted content, private repository names, raw
agent transcripts, and generated build artifacts are intentionally excluded
from this public record.
