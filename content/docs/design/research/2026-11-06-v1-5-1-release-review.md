---
title: OINK 1.5.1 readiness review, 2026-11-06
linkTitle: 1.5.1 readiness review
description: Three reproduced candidate regressions, complete browser acceptance, and remaining publication gates.
weight: 71
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-11-06
---

> [!NOTE] Local repair acceptance complete
> The three reproduced regressions below have been repaired in the working trees and the targeted, theme, site, and browser checks pass. This dated review does not announce a release, consumer upgrade, or deployment.

## Inputs and method {#inputs}

The review covered theme `v1.5.0` (`84b93e4`) through `c55849e`: all six
post-tag commits and 186 changed files. The documentation site was `43990ac`.
Theme `main` was three committed changes ahead of `origin/main` (`d9ad654`).
Both working trees were clean before the initial review. Its original evidence
is retained below; the later repair pass is recorded separately. No tag, push,
consumer update, or deployment was performed.

The formal local toolchain was Hugo Extended 0.168.0 with built-in LibSass,
Go 1.27.3, Node 26.12.0, npm 11.20.0, and Python 3.14.8 on macOS ARM64.
CI uses Node 24. Supplemental Hugo 0.169.0 checks do not replace the pinned
baseline. The accepted upstream LibSass deprecation remained visible.

Methods included implementation and contract inspection, the ordered theme CI
commands, sibling-site checks, production builds, Chromium tests, and controlled
minimal reproductions. Temporary fixtures and generated artifacts stayed outside
Git. Local-theme and published-module checks used separate commands with both
workspace mechanisms disabled.

## Confirmed regressions {#findings}

### P2: RSS format restoration contaminates another render {#rss-format}

The final assignment in `layouts/_partials/content/rss-description.html`
restores a captured `tdOutputFormat` into the page Store, which shortcodes also
read. In the reproduction, a summary render restores `html` while the page's
RSS shortcode render still uses that Store, producing mixed static and
interactive output.

The formal `bin/check-release-assets.py` run failed because the RSS checksum
table header disappeared and `data-td-asset` and `<button` appeared. A standalone
rerun and eight single-page reproductions passed; rerunning until green does
not resolve the original failure.

For a more reliable reproduction, expand that checker's RSS fixture to 24
RSS-only pages, each with `release-card` and 20 `release-assets` blocks. Keep
its custom `layouts/docs/single.rss.xml`, which sets `tdOutputFormat` to `rss`
before `.RenderShortcodes`, and keep the ordinary home feed enabled. Build
fresh output on Hugo 0.168.0 and inspect each page XML for interactive markers.

Three candidate builds all contaminated `docs/rss-9/index.xml`. One captured
output had six static tables, fourteen interactive tables, and 28 buttons.
The same fixture against published v1.5.0 passed three times. Overriding only
the candidate summary partial to omit the final Store restoration also passed
three times.

The confirmed scope is the custom RSS-page render exercised by the required
checker, not every ordinary feed. Keep format state stable within its rendering
context and add multi-page coverage while preserving HTML, Print, and normal
RSS summaries. The temporary removal was a causal probe, not an accepted fix.

### P2: Blog pagination duplicates Print aggregates {#print-pagination}

`layouts/_partials/head.html` calls `shell/blog-index-state.html` for every blog
section, including Print. That partial calls `.Paginate`, so Hugo generates
Print archive pages that each contain the entire section.

Use three dated blog posts, `outputs.section: [HTML, print]`, and
`params.ui.blog_index_size: 1`. The candidate generates
`_print/blog/index.html`, `_print/blog/page/2/index.html`, and
`_print/blog/page/3/index.html`; all three contain all three bodies. Overriding
only `head.html` with its v1.5.0 version generates one aggregate. Both builds
succeed on Hugo 0.168.0.

The documentation site's production build also adds four duplicate aggregates
across its English and Chinese blog roots and release indexes, totalling
1,120,141 bytes. Large archives amplify this waste. Limit blog-index pagination
and its head links to HTML, then verify one Print aggregate and correct HTML
pagination links.

### P2: A stalled Duo View document never reaches Retry {#duo-timeout}

`assets/js/document-compare.js` returns immediately for `about:blank`, including
when its 15-second timeout calls `ready(true)`. A pending main-document request
therefore consumes the timeout without invoking failure handling. Loading and
busy states remain without Retry or a direct-link fallback.

In the sibling site's browser fixture, open `/tests/compare-reader/` and hold
`/zh/tests/compare-reader/?oink_compare_pane=1` pending with a Playwright route.
Open Duo View and wait 17 seconds. The source pane is ready, the target remains
`about:blank`, and there is one loading note, zero failure panels, and zero Retry
buttons.

This is not covered by the existing 404 and slow-image tests. Timeout expiry
must fail a still-blank document while ignoring its initial blank load event
and preserving parsed articles with slow images. Add the stalled-document case
to the site's comparison suite and retain the localized fallback promised by
the [shell contract](/docs/design/shell/#translation-comparison).

## Initial validation {#validation}

| Check | Result and scope |
| --- | --- |
| Theme CI commands | 48 of 49 runnable steps passed on Hugo 0.168.0. The release-assets RSS step failed; theme acceptance is not all green. |
| Theme tests | 81 JavaScript tests, 90 migration tests, and 22 snapshot/consumer-tool tests passed. Locale parity, schemas, vendor inventory, output goldens, and Sass-boundary checks passed. |
| Site `make check` | Passed, including 67 Node tests and source, translation, rendered-Markdown, and rendered-link checks. |
| Site `make browser` | A single complete invocation passed 518 Chromium tests in approximately 23 minutes. `A11Y_PATHS` was unset: the sitemap scan was unrestricted. |
| Candidate production build | Passed with the local theme and ordinary production configuration. Only the accepted LibSass warning appeared. Print duplication was inspected separately. |
| Publication isolation | All three PDF safety tests passed with real Chromium, including remote CSS blocking and disabled scripts. |
| Publication smoke test | Current-candidate EPUB/PDF generation and owning artifact checks passed: five chapters, 31 EPUB targets, and a 23-page PDF. Local Pandoc was 3.12.1. The CI-pinned Pandoc 3.10, Java 21, EPUBCheck, and subpath matrix were not rerun locally. |
| Published baseline | Go proxy v1.5.0 resolved to `84b93e4` with the site's recorded checksums. The release-pin check and production build passed with replacements and both workspaces disabled. |

Browser groups passed 30 accessibility, 117 responsive-shell, 16 keyboard,
70 content-component, 37 code/Landing, 8 PRD5, 10 theme-color, 42
community-feedback, 53 appearance, 50 Expo, 8 blog-gallery, 8 PlantUML,
19 diagram, 15 table-reader, 26 standard comparison, and 9 multilingual
comparison tests. The local sibling theme used
`hugo.yml,tests/fixtures/browser.yml` and the separate eight-language comparison
fixture. Firefox and WebKit were not rerun.

The suite at the initial review did not cover the additional stalled-request and Print
cardinality cases above. The earlier
[review-repair record](/docs/design/research/2026-11-06-review-repairs/)
explicitly excludes later Duo View work from its 508-test result; this review
supplies fresh evidence for the current candidate.

## Repair verification {#repair-verification}

The repair pass changes the working trees based on theme `c55849e` and site
`43990ac`. The changes remain uncommitted and are not included in the remote CI
runs linked below.

- RSS summary rendering no longer restores the stale format value. The owning
  release-assets checker now renders 24 RSS pages with 20 asset tables each
  alongside the home feed, asserting every static table and checksum and the
  absence of interactive controls. A temporary override with the pre-fix
  partial fails this check; the repaired partial passes.
- Blog pagination in the shared head is limited to HTML. The reading checker
  verifies one complete Print aggregate, three distinct HTML archive pages,
  correct HTML `prev`/`next` links, and no Print pagination links. A temporary
  override with the pre-fix head generates three Print aggregates and fails;
  the repaired head passes.
- Duo View distinguishes document timeout from the initial blank load event.
  The new browser case holds the target document pending, checks the Retry
  label and direct link, and verifies that Retry restores the pane when the
  request can proceed. It passes with the repair. The earlier slow-image case
  continues to cover readiness without waiting for all resources.

The bilingual architecture and shell contracts and the theme's Unreleased
changelog accompany these fixes. The site's LLMS golden gains only the new
research-page entry; the output diff was reviewed before updating it.

| Repair acceptance | Result |
| --- | --- |
| Theme CI commands | All 49 locally runnable steps pass on Hugo Extended 0.168.0, including 81 JavaScript, 90 migration, and 22 snapshot/consumer-tool tests. |
| Site `make check` | Passes all source/rendered checks and 67 Node tests. |
| Site `make browser` | Final complete invocation passes 519 Chromium tests: 510 in the main suite and 9 in the eight-language comparison suite. `A11Y_PATHS` was unset, so sitemap accessibility coverage was unrestricted. |
| Production build | Passes with the local theme. Each EN/ZH blog and release index has one Print aggregate and no Print pagination links; all four duplicate aggregates are gone. |

Browser acceptance uses the installed Playwright browsers without an executable
path override, allowing the bfcache case to select full Chromium. That case and
the new stalled-document Retry test also pass individually. These results use
the same local tool versions recorded above; the publication-toolchain limits in
the initial validation still apply.

All three reproduced regressions are locally resolved. The next release gates
remain commit and push of the reviewed changes, green remote CI for that exact
revision, then the separate tag, Go-proxy, consumer-pin, deployment, and
production-identity states.

## Publication and adoption {#publication}

The latest observed public tag remains v1.5.0. The green
[theme CI run](https://github.com/pgsty/oink/actions/runs/42176246278), including
Book publication, belongs to `d9ad654`, not local `c55849e`. The green
[site checks](https://github.com/pgsty/oink.pgsty.com/actions/runs/42207218597)
and [browser workflow](https://github.com/pgsty/oink.pgsty.com/actions/runs/42207218621)
also tested the remote theme available then. They do not certify the three
later local commits.

A read-only `bin/update-consumers.py v1.5.0` inventory found 50 primary
checkouts: 42 current, three module consumers skipped for non-default branches,
and five classic `themes/oink` consumers. All 45 module pins were v1.5.0.
Four classic theme repositories were clean at the exact v1.5.0 tag. The remaining
source copy matched sampled implementation files; that is not a full identity
audit. No consumer was upgraded or deployed. The skipped branches and classic
copies need individual handling during eventual adoption.

## Release exit criteria {#exit-criteria}

The three repairs, their owning checks, browser coverage, and bilingual
contracts are present locally, and the working-tree acceptance recorded above
is green. The next gate is green remote CI on the final release commit.
Deferred design and accessibility work from the earlier review remains
a separate backlog; this record does not claim every historical finding is fixed.

After code acceptance, prepare the 1.5.1 changelog and current version references,
push reviewed commits, and verify CI for that revision. Tagging, push and Go-proxy
verification, consumer pinning and appearance checks, deployment, and production
identity are separate subsequent states. Those future steps are normal release
preparation and remain distinct from local repair acceptance.
