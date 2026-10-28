---
title: Theme review, 2026-10-13
linkTitle: 2026-10-13 theme review
description: Reproduced image escaping and interaction defects, their repairs, and local theme and consumer validation.
weight: 80
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [theme review, image escaping, Draw.io, keyboard focus, appearance, performance]
design_kind: research
design_status: review-snapshot
last_verified: 2026-10-13
---

> [!NOTE] Local review snapshot
> This record describes local source and tests against the `v1.2.0` consumer baseline.

## Scope {#scope}

The review began at theme commit `f8f476e`, with existing consumer-maintenance and compact-sidebar changes and an ongoing English documentation revision in the shared checkouts. Those edits were preserved. During the review, the existing sidebar repair was committed separately as `8f1f08d`; its file contents remained unchanged.

Work covered the theme's owning checkers, runtime unit tests, synthetic output fixtures, the real bilingual documentation site, and two different consumers: DDIA's book and SILO's large documentation tree. Source inspection focused on URL handling, image output, message boundaries, focus transitions, runtime isolation, and navigation. Visual review used real consumer pages and the documentation site.

## Reproduced defects and repairs {#repairs}

| Defect | Reproduction and observed result | Repair and regression |
| --- | --- | --- |
| Image URL escapes its HTML attribute | An ordinary image or Gallery URL containing a quote followed by an attribute-shaped query value creates an extra HTML attribute. An ampersand can also change the browser's decoded URL. | Escape URLs as HTML attributes after validation. `check-media-primitives.py` parses block and inline image attributes in HTML, Print, and RSS; `check-gallery.py` checks the quoted Gallery URL. The harmless extra-attribute probe failed before the repair. |
| Draw.io loses endpoint parameters and mishandles messages | An endpoint with an existing query or fragment receives malformed embedding parameters. Null or malformed messages can throw; message handling does not require the configured origin. | Build the URL with `URL` and `searchParams`; require the active iframe and configured origin; ignore malformed data; send to the exact origin and accept only PNG/SVG image export URLs. New Draw.io unit tests and the site's editor integration tests exercise these paths. |
| Page Actions loses the keyboard interaction contract | ArrowDown opens the menu before its CSS visibility transition permits focus. Tab can leave the disclosure while it remains open. | Make visibility immediate, retain the opacity and movement transitions, and close on focus leaving the entire disclosure without reclaiming focus. Runtime and real-browser regressions cover forward and backward traversal. |
| Appearance clears a newly reopened dialog's state | Close and immediately reopen the dialog before its queued native `close` event arrives. The dialog stays visible while `aria-expanded` becomes false. | Ignore an earlier close event while the dialog is open. Real-browser tests cover the race in Chromium, Firefox, and WebKit at desktop and phone widths. |

The two taxonomy HTML goldens also needed the already accepted sidebar repair: 33 hidden-leaf markers in each snapshot were removed after reviewing the complete diff. The 52-surface golden gate then passed.

The behavior is recorded in the bilingual [architecture](/docs/design/architecture/) and [shell](/docs/design/shell/) contracts. No configuration migration or new dependency is required.

## Validation {#validation}

Local tools were Hugo Extended **0.166.0**, Go **1.27.1**, Node **26.9.0**, Pandoc **3.11**, and Chromium **151.0.7922.34** for PDF generation.

| Layer | Evidence |
| --- | --- |
| Theme runtime | All 52 JavaScript tests passed after the repairs. Python discovery passed 116 tests; the 90-test migration suite was also run separately. |
| Theme ownership | Every `bin/check-*.py` checker was exercised, including explicit output-security arguments and packaged EPUB/PDF checks. Configuration schema generation was checked. Changed media, Gallery, output and golden owners were rerun after their repairs. Builds used warning-failure gates where the checker builds valid publishing output. |
| Documentation integration | `make check` passed with the local theme replacement: source/rendered Markdown, bilingual heading coverage, internal links, alternate-site builds, favicons, output goldens and release-pin contracts. |
| Browser integration | `make browser` passed **229 tests**, including the full sitemap accessibility scan, six responsive widths, EN/ZH, navigation, search, components, code, community regressions and all four visual presets. The additional engine gate passed **6 tests** across Chromium, Firefox and WebKit at 390 and 1440 px. |
| Publication fixtures | EPUB: 5 chapters, 31 link targets, no internal-check errors; EPUBCheck **5.3.0** reported zero errors and warnings. PDF: 23 pages, all 5 expected titles, no internal-check errors; rendered pages were inspected. |
| DDIA sample | Local-theme `make check-local` passed, including 14 translation chapters, 196 figure-layout checks and 38,170 internal references across 57 second-edition pages. Desktop, phone and dark reading views and the four-style menu were sampled. |
| SILO sample | Local-theme `make check` passed, including 536,561 internal references across 1,552 HTML files. Desktop documentation and phone search results were sampled. |

The initial broad run exposed the stale goldens. One standalone security invocation also lacked its required CLI arguments; its corrected invocation passed over 493 fixture output files. A new Print assertion initially omitted Print from the test page's own output list; correcting that test setup produced a passing HTML/Print/RSS regression.

## Performance observations {#performance}

A strict, minified local production build of the documentation site was inspected. For `/docs/customize/config/`, the referenced local JavaScript totals **62,192 bytes gzip** (about 61 KiB, including Lunr); the two stylesheets total **98,838 bytes gzip** (about 97 KiB), excluding fonts, images, search indexes, and third-party service traffic.

The ordinary documentation page omits the large diagram bundles. The Mermaid sample adds a **976,006-byte gzip** Mermaid dependency (about 953 KiB) plus its small page runtime. Runtime-isolation and output checkers passed.

## Limits and delivery state {#limits}

The accessibility suite excludes upstream Redoc and Swagger UI DOM under its existing policy. Consumer browser checks sampled key desktop and mobile routes across DDIA and SILO. The repairs were grouped into local theme and documentation commits.
