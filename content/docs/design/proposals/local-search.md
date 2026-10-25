---
title: Local search refinement
linkTitle: Local search
description: A local candidate for mixed-language queries, technical identifiers, section results, and palette scope.
design_kind: proposal
design_status: implemented
search_exclude: true
---

> [!NOTE] Local implementation candidate, 2026-10-25
> Owner: OINK maintainers. Affected contract: [Shell](/docs/design/shell/#search-actions-and-runtime).
> This work is unreleased; the public baseline remains v1.3.2.

## Evidence and scope {#scope}

The existing CJK path requires one contiguous query in one field. English uses
Lunr, and both return page links without section context. Preserve the one local
index per language, existing commands, input-method composition, exclusions,
keyword weights, and positive page boosts. No dictionary, service, account,
external executable, configuration key, or extra build step is introduced.

## Proposed behavior {#behavior}

Split whitespace and Latin/CJK boundaries while preserving technical identifiers
such as `shared_buffers`, `pg_basebackup`, `--baseURL`, and `/pg/data`. Match terms
across indexed fields. Return all-term pages first, with contiguous phrases ahead
of other matches; only when no page covers every term show partial matches with
visible coverage. Apply the page boost within those tiers. Keep English stemming
and bounded spelling fallback through the bundled Lunr runtime.

One result per page selects its best matching section and excerpt. Read actual
rendered heading IDs, never reconstruct a slug. Preserve language and base paths.
Store body text once, with UTF-8 byte offsets for section boundaries. Heading and
summary scopes keep heading anchors but do not silently index full bodies.

Add a labeled native radio group inside the existing palette, offering all
pages or the current top-level content root. Default to all pages; commands and
actions remain available. Announce result counts and partial coverage. Preserve
keyboard selection, focus trapping, and deferred search during IME composition.

## Compatibility and checks {#checks}

Existing page metadata and scope configuration remain valid. Sections are additive
index metadata; the engine continues to accept old indexes without sections.
Theme owners: `check-search.py`, search-engine/runtime tests, and palette checks.
Site owners: bilingual real-content query expectations, root/subpath anchor checks,
and browser keyboard, composition, scope, responsive, light/dark, and axe checks.
Compare old/new results and latency on identical real corpora. Record page and
section counts, tool versions, warmup/repeats, and raw/gzip bytes. Every language
must remain within 2 MiB raw and 512 KiB gzip. Synthetic cases cover ambiguous
identifiers and duplicate, Unicode, explicit, and special-character heading IDs.

## Decisions and acceptance {#decisions}

2026-10-25: Implemented locally after the initial design. The Shell contract
and Search/Command palette guides now own the behavior. Theme checks exercise
all four index scopes, actual UTF-8 section offsets, multilingual/subpath IDs,
legacy index compatibility, boosts, and root-aware dialog caching. The site
owns `tests/search/queries.json` and `scripts/check-search-corpus.mjs`; its
summary query gate runs in root and subpath integration builds.

On the frozen documentation source `ab2747a` (149 pages and 1,321 headings per
language), the 43-query set includes two negative summary cases. Top-five
expected-page hits are EN summary 7/7 → 7/7, ZH summary 2/7 → 7/7, EN content
10/10 → 10/10, and ZH content 6/17 → 17/17. These are curated regression
expectations, not general relevance scores. `连接池 超时` has no full match in
this corpus and deliberately checks labeled partial results; a synthetic owner
case checks the full match. No claim depends on adding the query examples to
new documentation.

Frozen summary indexes are 185,183/184,281 bytes raw and 39,529/43,208 bytes gzip
(EN/ZH), within budget. Full-content diagnostic indexes are 1,640,294/1,516,283
bytes raw and 536,971/578,674 bytes gzip, over the gzip budget. The maintained
site retains summary scope; enabling all historical research text is not a
budget-compliant configuration. The implementation never silently truncates it.

Browser acceptance covers EN/ZH, 390/1440 px, light/dark, real anchor navigation,
visible/announced partial states, native scope selection, Blog/Book roots,
composition and command retention. The artifact directory for this local run is
`/Users/vonng/tmp/oink-search-20261025/`; it contains exact commands, JSON timings,
logs and screenshots. No commit, tag, consumer upgrade, or deployment is implied.

2026-10-26: Fixed cross-output contamination during index reads, added multi-output
owner coverage, and completed the failed-route accessibility and file-tree retries.

2026-10-26: Refined the palette after visual review. The two scope choices are
visible as compact segments with native radio keyboard behavior and 44 px hit
areas. Reduced the desktop panel and row spacing, softened the selected result,
and combined live status and keyboard hints into one footer.

2026-10-26: Adversarial review corrected normalized excerpt/highlight offsets,
distinguished heading IDs from data attributes and script strings, and scoped
English spelling fallback to the selected root. Regressions cover compatibility
characters, combining marks, shortcode headings, and literal HTML in result text.
