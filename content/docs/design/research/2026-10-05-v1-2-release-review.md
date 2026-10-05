---
title: OINK 1.2 pre-release review, 2026-10-05
linkTitle: OINK 1.2 pre-release review
description: Local 1.2.0 candidate review, cleanup, compatibility, resource provenance and publication checks, with release boundaries.
weight: 15
icon: fa-solid fa-clipboard-check
design_kind: research
design_status: local-verification
research_date: 2026-10-05
---

> [!IMPORTANT] Local candidate evidence
> This review covers the October 5 working trees, including uncommitted changes.
> It does not certify an immutable release commit or a published 1.2.0 module.
> The public theme tag and the documentation site's consumer pin remain v1.1.0.

## Scope and inputs {#scope}

The theme starts at `a1979a4` and the documentation site at `ed2d0e3`.
The reviewed working trees also contain the CJK keyword-summary, literal-percent
outline and repository-source-path fixes, the site's existing English editorial
changes, and the cleanup below. The separate optional CLI is not part of this
theme release. No tag, push, consumer upgrade or deployment was performed.

Most checks used Hugo Extended 0.166.0, Go 1.27.1, Node 26.9.0 and
Playwright 1.62.1 on macOS ARM64. Official, checksum-verified Hugo Extended
0.160.1 and 0.165.0 binaries were used for selected compatibility checks.
These are local results, not a replay of the full Linux CI toolchain.

## Review findings and cleanup {#findings}

| Finding | Correction | Impact |
| --- | --- | --- |
| The 1.2 release draft omitted the new default and appearance controls | Update both release drafts and upgrade guidance with Paper, the Slate compatibility setting, independent persistence, current-state icons and experimental preset selection | Readers can identify the visible upgrade change before adoption |
| Current proposal, decision, experiment and source comments still described preview letters, experimental badges, a separate Default card or an undecided release target | Align current descriptions with compact icon/name buttons, site-default reset and 1.2 release preparation; preserve dated test evidence | Guidance agrees with the accepted interface without rewriting historical results |
| A working-tree ignore rule hid all site `tests/` except two files | Remove that broad rule; retain existing generated-output exclusions | New regression tests remain visible to Git; no test or build output was deleted |
| Development previews do not expose production-only analytics | Inspect strict production output and distinguish core local resources from explicitly configured services | The local-first claim has an observable boundary |

These cleanup findings required no runtime change. Earlier working-tree runtime
fixes are covered by their owning checks and the final integration run.

## Executed verification {#verification}

The local candidate passed the following technical pre-release checks. No
release-blocking theme defect was found within this scope. Counts are dated
snapshots of this working-tree review.

| Check | Result and scope |
| --- | --- |
| Preset checker | Passed: seven warning-strict configuration builds, 28 document roots, light/dark token parity, AA text/link/accent checks on three surfaces and the frozen Slate v1.1.0 base palette |
| Runtime tests | 49 Node tests passed, including current-state icons, search summaries, outline tracking, clipboard and dialog focus |
| Theme regression and tooling checks | 40 checker/tool commands passed, including 90 migration tests, snapshot/consumer safety and current output goldens; the PDF browser case was then rerun with an explicit browser, with all three isolation tests passing |
| Documentation checks | Final `make check`: 57 tests passed; 143/143 bilingual files, 1,197 source headings, 228 rendered content pages and internal links checked; only the new research index entry and changed release title/description required reviewed Markdown-golden updates |
| Standard browser suites | One complete `make browser` run passed all 219 checks across nine suites, including the full 372-route sitemap axe scan; no failed, flaky or skipped cases |
| Documentation follow-up | A fresh build passed a separate axe scan of 14 updated EN/ZH routes, including this new report pair; this supplements the original full sitemap scan |
| Browser engines | Six appearance checks passed on Chromium, Firefox and WebKit at 390/1440 px; pre-CSS restoration, keyboard selection, persistence and focus return; desktop Chromium also used 4× CPU throttling |
| Visual spot checks | Current-output captures inspected for the Chinese mobile Paper menu, English desktop dark Paper menu and Chinese Terminal reading on mobile/desktop; two-column icon/name options, current-state icons and reading layout confirmed |
| Hugo compatibility floor | 0.160.1 passed preset and reading/math checkers plus a strict minified production build of the actual documentation site |
| CI Hugo version | 0.165.0 passed a strict minified production build of the actual site, Hugo Module/include/static/print checks, system typography, legacy Sass font overrides and expected rejection of invalid typography |
| Production resources | 28 page visits across four presets and seven routes; core fonts and scripts served from the site's origin; configured external services recorded separately |
| Production output security | Passed on 921 files in the final strict production build with the documented third-party integration policy |
| Book publication | Root and subpath EPUBs passed the theme checker and EPUBCheck 5.3.0 with zero errors/warnings; both PDFs passed the 23-page, five-chapter structure checks; the root PDF script-isolation probe passed |
| Published consumer pin | Existing v1.1.0 resolved and passed the site's release-pin check with environment replacements and both workspaces disabled; this is not validation of a published v1.2.0 |

The full sitemap scan follows the site's existing axe policy: OINK-maintained
surfaces are checked, Giscus requests are blocked, and Swagger UI/Redoc vendor
DOM is excluded. It does not establish accessibility of those widgets.
Responsive checks cover 360, 768, 820, 1024, 1200 and 1440 px in
English/Chinese and light/dark mode.

Appearance checks use the same Home, configuration, callout and tab content in
four presets, both languages, 390/1440 px and light/dark mode. They also cover
search, code, tables, input/focus states, Blog, Book, API, diagrams and print.
Ink and Terminal remain explicitly selected experiments; passing these checks
does not promote them to stable presets.

Publication used local Pandoc 3.11, Java 26 and Chrome headless-shell
151.0.7922.34. The first attempt with the full Chrome for Testing application
timed out on this Mac. Selecting headless-shell explicitly, as CI does,
produced the verified PDFs. This does not claim compatibility with every
Chrome installation. CI pins Pandoc 3.10 and Java 21 on Linux.

## Local-first resource boundary {#local-resources}

IBM Plex Sans, Inter, IBM Plex Mono, Chakra Petch, icons, KaTeX fonts and core
browser libraries are bundled locally. Preset switching introduces no runtime
font-service or CDN-script dependency. System typography and explicit font-role
overrides retain their documented precedence.

The production audit loaded Home, Chinese configuration, math, Mermaid,
Markmap, ECharts and OpenAPI under each preset, then switched dark/light mode.
The production base origin was preserved while built files were served locally.
Request tracing recorded and blocked off-origin requests; local fonts and
diagrams still loaded without uncaught JavaScript or local HTTP errors.

Two configured services requested external scripts: Giscus and Google
Analytics. Giscus is an accepted optional comments integration; its OINK
palette files are local. This documentation site already configures an
analytics ID, so production output includes Google Tag Manager's script.
Neither service is required by the new presets. They were left configured;
the documentation site therefore does not have a zero-external-request claim.
Authored remote media and explicitly selected diagram services retain their
existing opt-in boundaries.

## Repeating the checks {#repeat}

Run owning theme checks before the real-site checks. These commands use the
sibling theme through the documented Make targets; do not commit a filesystem
module replacement:

```bash
python3 bin/check-presets.py
node --test 'tests/js/**/*.test.js'
make -C ../oink.pgsty.com check
env -u A11Y_PATHS -u PLAYWRIGHT_BASE_URL make -C ../oink.pgsty.com browser
```

The full theme checker set and publication commands are defined in
`.github/workflows/ci.yml`. Run all owning checkers with fresh fixtures,
including parameters/schema, vendored assets/fonts, navigation/search/actions,
components, output/namespace/goldens, migrations, snapshot protection,
consumer tooling and PDF isolation. The engine suite is
`npm run test:appearance:engines` in the site repository.

For compatibility checks, put the selected Hugo binary on `PATH`, disable
inherited Go/Hugo workspaces, and identify the sibling replacement explicitly.
Build the real site with `--environment production --minify --printPathWarnings
--panicOnWarning` into a separate output directory. For published-pin checks,
disable the replacement as well. These are different validation targets.

## Remaining release steps and limits {#release-boundary}

Local technical pre-release acceptance passed. A release still needs reviewed
changes assembled into commits, CI on those exact commits, a published tag and
module archive, consumer adoption and hosted verification.
Changing a version label cannot complete those steps. Release notes remain
drafts and existing consumer pins were not changed.

Real Windows/Android font rendering, manual screen-reader speech and first-paint
filmstrips were not verified. Windows source-path behavior was checked through
deterministic fixtures rather than a Windows host. Ink/Terminal design follow-up
remains in the [experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/#remaining-work).
