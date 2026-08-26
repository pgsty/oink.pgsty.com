---
title: Book publication pipeline
linkTitle: Book publication
description: Move Book semantic lowering and generic EPUB/PDF packaging into OINK without taking publication facts away from consumers.
weight: 40
icon: fa-solid fa-book-open
search_keywords: [Book publication, EPUB, PDF, Pandoc, print, manifest]
design_kind: proposal
design_status: draft
proposal_owner: OINK maintainers
proposal_date: 2026-08-24
affected_contracts: [architecture, authoring, Book, outputs]
---

> [!WARNING] Draft proposal with implemented publication tooling
> The opt-in `BookManifest`, the generic EPUB and PDF runners and their artifact
> validation are released, and the normative account of them is in
> [Architecture](/docs/design/architecture/). No build publishes either file on
> its own. What remains open here, and only here, is consumer migration.

## Context and evidence {#context-and-evidence}

OINK already owns Book navigation order, numbered figures, tables, equations,
examples, cross-references, whole-Book Print HTML, heading and footnote
namespacing, and per-page Markdown degradation. The missing boundary is a
machine-readable whole-Book handoff that a generic packager can consume.

DDIA currently carries a substantial EPUB preprocessor that follows OINK's
numbered primitives, cross-page links, footnotes, image paths, and Book order.
TPME retains an older exporter whose historical root-file inputs no longer
match its current Hugo content tree. The first proves that publication is real;
the second proves that a consumer-local recipe can quietly become stale.

An EPUB is not one rendered template. It is a ZIP container with publication
metadata, a resource manifest, a spine, navigation, content documents, styles,
and media. Hugo can render an intermediate output, but a packaging tool must
produce and validate the final file.

## Goals {#goals}

1. Give every Book primitive one theme-owned semantic result for publication.
2. Publish an opt-in whole-Book intermediate with deterministic page order,
   stable targets, and cross-references; resolve local resources from the
   semantic Print document only during explicit packaging.
3. Provide a generic, versioned EPUB packager and a version-pinned Print-to-PDF
   runner that consumers invoke with their own publication facts.
4. Prove the boundary on two structurally different public Book consumers.

## Non-goals {#non-goals}

- Do not enable an expensive aggregate output for every site or section.
- Do not call a Markdown, JSON, or HTML intermediate an EPUB.
- Do not infer title, author, cover, ISBN, edition, rights, or release policy.
- Do not fetch remote images or services during an ordinary Hugo build.
- Do not add a second Book shell, duplicate navigation authority, or a generic
  publication-configuration namespace.
- Do not promise pixel-identical PDF pagination across browser engines.

## Ownership boundary {#ownership-boundary}

| OINK owns | The consumer owns |
| --- | --- |
| Book order derived from the existing navigation authority | Which language, edition, and Book root to publish |
| Semantic lowering for `fig`, `tbl`, `eq`, `eg`, xrefs, headings, and footnotes | Title, authors, identifier, cover, rights, and imprint |
| Stable intermediate schema and generic packager behavior | Optional chapter exclusions and publication-specific front/back matter |
| EPUB structure/link validation and Print-to-PDF runner | Release automation, signing, distribution, and legal approval |
| Theme fixtures and compatibility checks | Content correctness and final artifact approval |

The consumer passes facts; it does not patch OINK markup. OINK supplies
semantics; it does not decide whether a book may be distributed.

## Proposed behavior {#proposed-behavior}

The first implementation is an opt-in Book manifest, not a final ebook. It
references the already published per-page Markdown and records only facts the
theme can derive honestly:

- schema version and language;
- Book root and flattened page order;
- page title, optional Book number, HTML URL, and Markdown URL;
- stable heading and numbered-object targets;
- cross-page references.

The manifest is emitted only for a Book root that explicitly enables the output.
The normal HTML, Print, Markdown, RSS, search, and navigation builds remain
byte-for-byte independent of that opt-in.

The OINK EPUB packager consumes the manifest and the existing whole-Book Print
HTML, whose semantic output already contains namespaced headings and footnotes,
numbered targets, raw authored anchors, MathML, and static interaction
fallbacks. It rewrites only publication URLs, invokes pinned Pandoc 3.10,
and validates the result with EPUBCheck plus OINK's internal-target checker. A
consumer supplies a small metadata file and cover. Per-page Markdown remains in
the manifest as an auditable source-shaped output, not as a second semantic
conversion path.

Local resources must exist under the generated `public/` tree and are packaged
without network access. A consumer that knowingly retains a remote image must
opt in with `--allow-remote-resources`; this permits passive HTTP(S) media only,
never remote scripts or local-file schemes. The tool refuses to replace an
existing EPUB unless `--force` is explicit.

PDF derives from the same whole-Book Print HTML. The runner exposes the build on
a temporary loopback server with `script-src 'none'`, blocks external resources
by default, invokes an explicit Chrome/Chromium binary, and refuses implicit
replacement. Print CSS
owns A4 size, paper-safe code wrapping, full-width numbered equations, and page
numbers. The checker uses Poppler to verify the PDF structure, A4 geometry,
extractable Book titles, and sampled page-number margins; final approval still
includes rendered-page review.

The reference workflow remains four explicit steps, not a new Hugo mode:

```sh
python3 /path/to/oink/bin/book-epub.py --manifest public/book/book.json \
  --public public --metadata metadata.yaml --output output/book.epub
python3 /path/to/oink/bin/check-book-epub.py output/book.epub \
  --manifest public/book/book.json
python3 /path/to/oink/bin/book-pdf.py --manifest public/book/book.json \
  --public public --chrome /path/to/chrome-headless-shell --output output/book.pdf
python3 /path/to/oink/bin/check-book-pdf.py output/book.pdf \
  --manifest public/book/book.json
```

## Output, accessibility, and security {#output-accessibility-security}

- HTML and existing outputs do not load an exporter or gain browser runtime.
- The intermediate preserves document language, heading hierarchy, alternative
  text, table headers, link text, and source order.
- Interactive controls degrade to their existing static Markdown/Print forms.
- Resource paths must resolve inside the build output or be explicit outbound
  links; packaging never follows an arbitrary local path from authored content.
- No consumer value becomes raw HTML, CSS, command arguments, or a filesystem
  path without the same validation and normalization used by current outputs.

## Compatibility and migration {#compatibility-and-migration}

This is additive and opt-in. Existing Book sites keep their current outputs and
scripts. The DDIA pilot removes consumer-side transformations only after the
theme intermediate accounts for every currently validated chapter, numbered
object, footnote, image, and internal link. TPME is the second-consumer gate;
no DDIA-specific route, label, or chapter list may enter the generic schema.

## Prototype evidence {#prototype-evidence}

An isolated opt-in build against the first manifest prototype produced these
results without modifying either consumer checkout:

| Consumer | Ordered pages | Headings | Raw Markdown anchors | Numbered targets | Xrefs | Unresolved |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| DDIA | 23 | 597 | 33 | 131 (106 figures, 3 tables, 22 examples) | 292 | 0 |
| TPME | 18 | 295 | 946 | 41 (31 figures, 10 tables) | 1,062 | 0 |

Neither manifest contained a duplicate numbered target ID. Strict builds added
about 0.28 seconds for DDIA and 0.22 seconds for TPME in this local sample. The
large TPME raw-anchor count is decisive: the packager must consume a rendered
output where those explicit anchors survive. Whole-Book Print HTML already does
so while also carrying namespaced headings, footnotes, numbered targets, and
MathML; the manifest must not duplicate the whole document tree.

The same isolated snapshots were then packaged through one generic command:

| Consumer | EPUB chapters | Typed targets | Package size | OINK package/link check | EPUBCheck 5.3.0 |
| --- | ---: | ---: | ---: | --- | --- |
| DDIA | 23 | 131 | 22.9 MB | 0 errors | 0 errors, 0 warnings |
| TPME | 18 | 41 | 2.2 MB | 0 errors | 0 errors, 0 warnings |

DDIA's one remote poster required the explicit network-resource opt-in; TPME
packaged entirely from local output. The generic checker verifies every page
anchor and each target's `kind` and `num` against `BookManifest`, rather than
depending on the old DDIA preprocessor's wrapper classes. The theme fixture
also passes after a minified Hugo build. Publication CI pins Pandoc 3.10 and
EPUBCheck 5.3.0 by version and archive digest, in a separate job from the Hugo
compatibility matrix.

The Print-to-PDF pilot uses Chrome for Testing headless shell 151.0.7922.34,
pinned by archive digest in the same publication CI job:

| Consumer | Book pages | PDF pages | Package size | Structural/text/page-number check | Rendered review |
| --- | ---: | ---: | ---: | --- | --- |
| Theme fixture | 5 | 23 | 1.1 MB | 0 errors | cover, tables, code, equations, footnotes |
| DDIA | 23 | 527 | 60.3 MB | 0 errors | CJK, tables, figures, code, references, end matter |
| TPME | 18 | 197 | 8.4 MB | 0 errors | CJK, wide tables, code, callouts, end matter |

All three PDFs are tagged, unencrypted A4 documents. The real-consumer checker
found every manifest page title and the first, middle, and last CSS page number.
Visual review exposed and fixed three pre-existing Print defects: child math did
not propagate the KaTeX stylesheet to the Book aggregate; a broad Bootstrap
column reset matched KaTeX `col-align-*` internals; and `pre > code` defeated
paper-edge wrapping. These are narrow print fixes, not exporter-specific DOM
rewrites.

## Implementation plan {#implementation-plan}

1. **Done:** extract the Print page sequence into one shared Book partial without
   changing rendered Print output.
2. **Done:** add the disabled-by-default manifest and fixture checker.
3. **Done:** package isolated DDIA and TPME snapshots with one generic EPUB path,
   then validate typed targets, internal links, and EPUB 3.3 conformance.
4. **Done:** render the theme fixture plus isolated DDIA and TPME snapshots with
   one pinned Chrome runner; validate and visually review representative pages.
5. **Next consumer migration:** replace DDIA's semantic preprocessor with metadata
   plus one invocation only after its repository independently accepts the new
   publication gate.

## Acceptance criteria {#acceptance-criteria}

- Default sites publish no new aggregate file and incur no material build cost.
- Hugo 0.160.1 and the current supported Hugo build the opt-in fixture with
  warnings fatal.
- Existing HTML, Print, Markdown, RSS, navigation, search, and browser tests pass.
- The DDIA pilot retains 23 chapters and all 106 figures, 3 tables, 22 examples,
  and internal links as typed semantic targets with zero unresolved target.
- TPME produces an artifact through the same schema and packager.
- No consumer script contains OINK primitive-specific regular expressions.
- EPUBCheck and OINK's package/link checker pass; the PDF structure/text/page
  checker and representative rendered-page review pass.

## Open decisions {#open-decisions}

1. Should consumer migration happen before or after the next OINK release tag?

## Decision log {#decision-log}

- 2026-08-24: Drafted the theme/consumer ownership boundary. Chose an opt-in
  semantic intermediate before any final EPUB API or implementation.
- 2026-08-24: The DDIA/TPME isolated pilot resolved the first format decision:
  keep one JSON manifest and consume existing whole-Book Print HTML; do not add
  a generated whole-Book Markdown output or another semantic lowering path.
- 2026-08-24: The packager consumes whole-Book Print HTML, so the manifest uses
  the existing `no_print` exclusion too. This keeps one publication sequence
  and avoids a second output-specific exclusion key.
- 2026-08-24: Implemented the generic EPUB path and pinned Pandoc 3.10 plus
  EPUBCheck 5.3.0 in publication CI. Isolated DDIA and TPME packages pass both
  the typed-target/internal-link checker and official EPUB 3.3 validation.
- 2026-08-24: Remote publication resources remain rejected by default. DDIA's
  historical remote poster exercises an explicit opt-in instead of weakening
  the default or adding a DDIA-specific rewrite.
- 2026-08-24: Added the loopback Print-to-PDF runner and pinned Chrome for
  Testing headless shell 151.0.7922.34 by archive digest. Theme, DDIA, and TPME
  PDFs pass structural, text, A4, and page-number checks plus rendered review.
- 2026-08-24: PDF review fixed only the owning Print contracts: aggregate math
  capability propagation, Bootstrap column-selector scope, code wrapping,
  single-column numbered equations, and CSS page margins.
