---
title: Dependency acceptance, 2026-11-11
linkTitle: Dependency acceptance
description: Functional, failure-path and browser acceptance of the local dependency migration after OINK 1.5.1.
weight: 76
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-11-11
---

> [!IMPORTANT] Local candidate
> This record covers the dependency migration after theme `ef3f119`
> and documentation `18cca3d`. It does not establish a release, consumer upgrade
> or deployment. The published baseline remains OINK v1.5.1.

## Inputs and method {#inputs}

The [dependency contract](/docs/design/architecture/#unreleased-dependencies)
owns the versions and migration boundaries. Initial runtime acceptance used macOS ARM64,
Hugo Extended 0.168.0 with built-in LibSass, Go 1.27.3, Node 26.12.0,
npm 11.20.0 and Python 3.14.8. Both workspaces are disabled; the documentation
site selects the sibling theme with a command-local module replacement.
Theme checks build fresh fixtures. Final browser previews disable watching and
live reload. Production checks use a fresh minified build under `/preview/`.
Algolia, the demo API and server-mode PlantUML receive controlled responses;
these tests check browser clients, not remote service availability.

## Repairs found during acceptance {#repairs}

| Area | Reproduced issue and repair |
| --- | --- |
| Markmap appearance | Open notes retained their old palette. They now follow color-mode and preset changes without triggering animated SVG transitions. |
| Markmap animated unfold | Animated `stateTween` unfolding inserted child SVG nodes after the initial `render` event, leaving links nameless and note markers unlabeled. A scoped `MutationObserver` and explicit SVG link `:focus-visible` style now keep ARIA attributes and focus rings live across transitions. |
| Markmap keyboard and Duo View | Focus-induced smooth scrolling could dismiss a newly opened note, SVG `<a>` links (`SVGAElement`) broke Duo View click routing, and open ARIA note dialogs or redrawn markers conflicted with Duo View shortcuts. Opening finishes smooth scrolling first, Duo View resolves `SVGAElement` URLs and yields shortcuts to open ARIA dialogs, and note focus resolves live SVG markers. |
| Markmap authoring | Included Markmap fences wrote capability flags to the snippet page instead of the host page, missed CRLF front matter, and repeated legacy-option warnings across non-HTML outputs. The render hook now targets the host page, accepts CRLF headers and warns once in HTML. |
| Markmap failures | A missing note chunk left its content inaccessible. The affected map now restores complete Markdown and focus, disconnects its listeners and leaves other maps usable. |
| Markmap print and links | Floating notes appeared in print, and vendor links lacked adequate light-mode contrast and underlines. Print hides the panels; note links now use the article's link color and an underline. |
| ReDoc frame origin guard | Navigating directly to `redoc-frame.<hash>.html?spec=https://...` previously loaded arbitrary remote specs. Cross-origin specs now require embedding inside a same-origin `.td-redoc__frame` with the matching authored URL. |
| Asciinema | No JavaScript or a missing bundle left an empty player. Fetch/parse errors also lost the recording link. HTML now starts with a link, and synchronous or asynchronous errors restore it together with any player focus. |

## Validation evidence {#validation}

Before the toolchain refresh below, the theme's owning checks passed: vendored inventory/checksums, built-in Sass,
output structure, namespace, configuration and locale parity, 52 output goldens,
82 JavaScript tests and 90 migration tests. The media golden intentionally
records the recording link and its word-count effect. The documentation site's
`make check` and canonical browser groups cover accessibility, responsive shells,
keyboard navigation, components, code, appearance, Expo, galleries, diagrams,
tables and document comparison. Failed cases were repaired and their owning
suites repeated before acceptance: 544 canonical browser cases pass across
those runs, including the four new open-note accessibility cases.

The final dependency suite defines 23 cases per engine (verified across Chromium
and WebKit after the final review repairs, alongside the initial 63-case
three-engine pass), with another 4 explicit-service cases per engine. Diagram layout and math
compatibility pass across those engines. Coverage includes:

- ReDoc independent routers, article anchors, copy, downloads, external links
  and missing specs/modules; Swagger expands operations and sends a mock API request.
- DocSearch configured indices, results, navigation, keyboard dismissal and
  recovery after service errors; PlantUML UTF-8 encoding, SVG ID isolation,
  persistent cache reuse and unavailable IndexedDB/local storage.
- Real terminal playback/pause and theme changes; missing or invalid recordings;
  rich Markmap notes, math, sanitization, focus, missing chunks, fit/pan and hidden
  containers; Mermaid ELK and existing controls, KaTeX, Infographic and ECharts.

Visual review covers EN/ZH, 390/1440 px, light/dark, print and disabled JavaScript.
Open notes pass eight WCAG AA scans and forced-color visibility checks. The
production subpath build loads fingerprinted local assets without page overflow
or unexpected external dependency requests. Optional site analytics/comments
are blocked during deterministic review.

## Toolchain refresh {#toolchain-refresh}

The subsequent refresh uses Go 1.27.4, Hugo Extended 0.169.0, Node 26.13.0
and npm 12.2.2 on macOS ARM64. All 27 direct vendored dependencies match the
npm registry's stable releases; the documentation site's direct dependencies
have no available updates. Compatible transitive dependencies were refreshed,
including the Markmap build's KaTeX and highlighting dependencies. Both npm
dependency sets report zero audit findings. CLI dependencies used by builds
and tests are current, including `golang.org/x/mod` 0.43.0; `go mod verify`
passes. Unused upstream module-graph entries retain their upstream constraints.

The 43 theme checks, 82 JavaScript tests, built-in Sass check and documentation
`make check` pass with the new toolchain. Hugo 0.169.0's plain-text spacing,
the updated toolchain examples and the search close-button name account for
the reviewed golden changes. CLI offline tests, `go vet`, and actual Hugo
integration pass after repeating the application suite with its corrected deadline.
The release-pin regression now expects Hugo 0.169.0. Real CLI integration
commands receive a two-minute test deadline because one command can perform
several isolated Hugo renders; the integration target has a 30-minute ceiling.
Axe 4.14 caught a label/name mismatch in the search close button. Its localized
name now includes the visible Esc key; the owning output checker covers it.
The updated browser also exposed intermittent focus loss when Duo View's
language menu moved across the narrow breakpoint. CSS could hide the old host
before the media-query callback captured focus. Host visibility now changes in
the same runtime update as the move, and the browser checks exercise both
899/900 px and 390/1200 px with the menu open and closed in LTR and RTL.

Publication checks use Pandoc 3.13, EPUBCheck 5.4.0, Temurin 27.0.1.0.2 and
Chrome headless shell 157.0.8103.50. Root and subpath EPUBs pass both structural
checks and EPUBCheck without warnings or errors. Both PDFs pass page, title and
content checks, and all three PDF isolation probes pass, including the real
browser case. Downloaded tools and publication artifacts remain outside Git.

With Playwright 1.65.0, the initial runs and focused repair reruns cover all
546 canonical Chromium cases. The final engines are Chromium 158.0.8127.18,
Firefox 159.0 and WebKit 27.2. Firefox and WebKit each pass 39 dependency,
diagram-layout and math cases plus four service cases. All nine multilingual
Duo View cases pass in each engine; the Escape test establishes its keyboard
origin explicitly because pointer activation does not focus buttons in every
engine. The 27 ordinary Duo View and history cases also pass after the fix.

A separate production build resolves the published OINK v1.5.1 pin with module
replacements removed and both workspaces disabled. The advertised version and
module pin match. This verifies compatibility of that published version with
the new toolchain; it does not publish the local theme changes.

Before committing, the theme's vendor, comparison, Palette and 52 golden checks
and the documentation site's `make check` pass again. The CLI toolchain changes
are also tested independently on its committed source: module verification,
offline tests, `go vet` and actual Hugo integration pass. The CLI's separate
feature work remains in the working tree and is outside these commits.

## Repetition and limits {#repeat}

Run the theme checks in `AGENTS.md`, then the site's `make check` and `make browser`.
The service suite is included in `test:content-components`. From the documentation
checkout, with the pinned Hugo on `PATH`, repeat the engine gate with:

```sh
export GOWORK=off HUGO_MODULE_WORKSPACE=off
export HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> $PWD/../oink"
npx playwright test tests/browser/dependencies.spec.mjs \
  tests/browser/diagram-layout.spec.mjs tests/browser/math-compat.spec.mjs --browser all
npx playwright test --config playwright.dependencies.config.mjs --browser all
```

DocSearch 5.2 presents exhausted transport retries as an empty result set; it
does not reliably distinguish an outage from no matches. A later query can
recover. ReDoc retains its independent reader palette. Swagger and ReDoc retain
the [documented upstream accessibility limits](/docs/write/openapi/#limits);
the whole-site WCAG gate excludes their generated interiors. The engines tested
are installed modern versions, not every historical version allowed by the
minimum browser requirement. Live Algolia credentials,
consumer adoption and deployment are outside this acceptance. Ordinary consumers
still need only Hugo; its accepted LibSass deprecation warning remains visible.
