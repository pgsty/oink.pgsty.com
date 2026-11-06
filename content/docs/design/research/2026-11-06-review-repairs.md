---
title: Review repairs, 2026-11-06
linkTitle: v1.5.0 review repairs
description: Reproduced build, feed, navigation and interaction defects, bounded repairs, and remaining review work.
weight: 69
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-11-06
---

> [!IMPORTANT] Development evidence
> This record describes local changes after v1.5.0. It does not establish a new release, consumer upgrade, or deployment. The original review's roughly 170 entries have not all been accepted or fixed.

## Inputs and method {#inputs}

The review started from theme `84b93e4` and documentation `a8eeb92`.
The candidate keeps Hugo Extended 0.168.0 and its built-in LibSass, with Go
1.27.3, Node 26.12.0, npm 11.20.0, and Python 3.14.8 on macOS ARM64.
The Hugo 0.169.0 executable on the normal system path is outside this validation
baseline. Its golden differences are not evidence of a defect on 0.168.0.

Build and output claims were checked with synthetic inputs in the owning theme
checkers. Interaction claims were checked against the sibling documentation
site through Playwright. Browser previews used the local theme replacement and
`hugo.yml,tests/fixtures/browser.yml`, with both workspace mechanisms, watching,
and live reload disabled. Existing passing snapshots were reviewed before
recording intentional changes.

## Confirmed defects and repairs {#repairs}

| Area | Confirmed behavior and repair | Repeatable evidence |
| --- | --- | --- |
| Invalid input | Positional arguments reached map-only shortcode operations and failed the build. Named-parameter guards now warn and safely omit or fall back. Negative checks require exit status zero. | `check-content-primitives.py`, `check-book.py` |
| Book numbering | Invalid numbers produced empty targets such as `fig-`. Unnumbered content now retains readable output without target registration. | `check-book.py`: HTML, print, Markdown, BookManifest and index rows, with valid-number controls |
| Nested components | Independent Markdown documents and sibling shortcode containers reused local ordinals. Generated IDs and their references now include the containing scope. Authored code IDs are preserved. | `check-code-blocks.py`: repeated nested code, fields, charts and FileTree in HTML and print |
| Feeds | Weight-based order was limited before date sorting, undated items emitted year-one dates, and several components emitted raw Markdown. Both feeds now sort before limiting and omit unavailable dates; components use static HTML or their documented omission. | `check-content-primitives.py`, `check-book.py`, RSS goldens |
| References and versions | Missing manual references could fail Hugo; version links could repeat the deployment prefix. Shared resolvers now provide warning fallbacks and join version paths once. | `check-agent-indexes.py`, `check-actions.py` |
| Navigation under subpaths | Language-neutral navigation IDs and section-index keys retained the deployment prefix. A shared key resolver now removes deployment and language prefixes while published links keep both. | `check-agent-indexes.py`: EN/ZH under root and subpath deployments, with and without a default-language directory |
| Landing | Invalid record shapes and optional fields could break Markdown output. HTML and Markdown now share record and URL validation, preserve fragments and queries, and include standalone CTA links. Unsafe targets do not become empty links. | `check-landing.py` |
| Blog navigation | List pages inherited article-sequence navigation and English pagination. Localized semantic pagination now owns list navigation and head links. | `check-reading.py`, `check-shell.py`, browser pagination regression |
| Focus and menus | Native disabling removed focused controls; hidden self-links were unreachable; focus-opened menus reopened after Escape. Guarded `aria-disabled` controls retain focus, self-links remain reachable, and Escape restores focus before closing. | JS units and browser code, shell, comparison and Expo suites |
| Mobile shell | Navbar-only articles lacked mobile utilities, and closed sidebar drawers leaked a shadow. Site drawers now expose language, version and repository links; shadows appear only when open. | `check-shell.py`, responsive browser regressions |
| Layout | Book TOCs displayed two counters, prose margins affected component lists, Landing padding was overridden, and global link rules suppressed print underlines. The owning rules are now scoped correctly. | Browser review regressions and SCSS checks |
| Locale and schema | Pagination and breadcrumb labels were untranslated; several locale strings and the appearance legend were incorrect; the schema rejected language-code translation notices. Labels now cover all 32 locales and generated schemas match the resolver. | `check-i18n.py`, `generate-config-schema.py --check` |
| Preset and alternate rendering | Terminal's current-row chevron selector was wrong; focus rings were translucent or clipped; forced colors hid current-state cues; the RTL artifact overwrote font roles. Targeted rules now retain these states. Repeated marquee rows are hidden from assistive technology. | Preset/SCSS checks and browser accessibility coverage |

## Qualifications to the original review {#qualifications}

The original report's severity labels grouped build failures, accessibility
defects, wording, and design preferences together. They should not all be treated
as release-blocking failures. Reproducible build and output defects deserve the
first repair batch; cosmetic consistency needs its own acceptance criteria.

“No TOC” does not mean “empty right rail.” Blog indexes can still contain author,
category, series, and tag clouds. Removing the fallback control made that rail
impossible to collapse and failed the existing RSS/browser regression. The final
repair omits genuinely empty rails and labels populated non-TOC rail controls as
sidebar actions. It preserves collapsing, focus restoration, and RSS access.

RSS fixes do not require every component to appear in feeds. Release assets keep
their explicit omission. The Book checker now exercises the ordinary section
feed instead of treating raw `RenderShortcodes` output as the RSS contract.

Different corner radii, duplicated template shells, and native/shortcode layout
differences are maintenance or design concerns until a specific contract or user
failure is demonstrated. Merging base templates solely because their bytes are
equal can change Hugo lookup precedence. No such broad consolidation is included.

## Validation {#validation}

The theme's focused checks, schema parity, 32-locale parity, 80 JavaScript tests,
and 90 migration tests were run on the fixed toolchain. Output changes cover 52
HTML, print, Markdown, RSS, and LLMS golden surfaces. These checks are local unit
and output evidence; the separate CI PDF/EPUB publication job is not claimed.

The documentation site's final `make check` passed, including all 64 non-browser
tests, with a larger Node heap for its rendered-link scan. A local production
build also passed and generated 462 pages per language, with only the accepted
upstream LibSass deprecation warning. The first browser pass completed all 30 accessibility tests;
the responsive group passed 117 tests after retaining the taxonomy rail control.
The other canonical browser groups also passed in their respective runs: keyboard
16, content components 70, code blocks and Landing 37, PRD5 8, theme color 10,
community feedback 42, appearance 53, Expo 50, gallery 8, PlantUML 8, diagrams
19, table reader 15, standard comparison 19, and eight-language/RTL comparison 6.
The canonical browser set totals 508 passed tests across these runs. A later
focused accessibility run passed all 30 cases on the new research and blog pages.
After the Escape correction, a fresh shell, blog and menu regression run passed
56/56. The final Landing checker passed after its metrics links were routed
through the same URL policy.

The browser counts describe this repair candidate before separate comparison
interface work appeared in the shared checkout. That concurrent work is outside
this record's browser acceptance. The completion audit additionally verified
navigation keys under language/deployment prefixes and invalid Book numbers in
HTML, print, Markdown, BookManifest, and the generated indexes.

## Remaining work and order {#remaining}

This is a bounded repair batch. The following work remains outside its acceptance:

1. Reader control over single-character shortcuts, command-palette handoff and
   localized error messages, and plural-aware contributor/search/code counts.
2. Non-default-language Google search destinations and the documented meaning of
   relative content URLs.
3. Remaining contrast cases and the previously recorded narrow, large-text footer
   overflow. These require their own rendered reproductions and browser checks.
4. Geometry, interaction-state and overlay tokens, remaining manual-link owners,
   shared shell structure, and stylesheet size. These need bounded design decisions
   and measurements rather than a blanket replacement of literals.

The [component](/docs/design/components/#unreleased-review-corrections),
[shell](/docs/design/shell/#unreleased-review-corrections),
[architecture](/docs/design/architecture/#unreleased-review-corrections), and
[Landing](/docs/design/landing/#unreleased-review-corrections) contracts describe
this batch's development behavior. Historical release claims remain unchanged.
