---
title: Visual preset acceptance, 2026-10-05
linkTitle: Preset acceptance
description: Local Paper and Slate verification, real theme output, and bounded browser evidence.
weight: 15
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-10-05
---

> [!IMPORTANT] Local evidence only
> This record concerns sibling-checkout theme output, with no injected prototype
> styles. It is not a release, a consumer upgrade, or hosted-site acceptance.

## Inputs {#inputs}

Theme and documentation working trees on 2026-10-05; Hugo Extended 0.166.0,
Go 1.27.1, Node 26.9.0 and Playwright 1.62.1 on macOS ARM64. The ordinary
browser suite uses Chromium; the additional engine gate uses Chromium, Firefox
and WebKit.
The site still pins v1.1.0; `make check`, `make browser`, and `make dev` select
the local sibling theme. The published pin was not changed. This run is not a
Hugo 0.160.1 compatibility-floor or pinned-CI-toolchain test.

## Executed checks {#executed-checks}

| Evidence | Result and scope |
| --- | --- |
| `check-presets.py` | Paper light/dark token parity and AA text/link/code/copper contrast; frozen v1.1.0 Slate base palette; four strict configuration builds and 16 HTML roots including 404 and print |
| Existing theme checkers | Parameters, font roles, vendor inventory, 32 locale catalogs, actions, shell, output, namespace, Landing and runtime isolation passed; generated schemas match their sources |
| `check-goldens.py` | 52 surfaces passed after reviewing and updating the 34 HTML/print expectations affected by root attributes, prepaint colors, the menu and its action/runtime; other output formats were unchanged |
| Strict site build | Real sibling-theme EN/ZH site built with `--panicOnWarning`; translations, rendered Markdown and internal links passed |
| `node --test 'tests/js/**/*.test.js'` | 49 runtime tests passed |
| `appearance.spec.mjs` | 25 tests passed: Paper/Slate × EN/ZH × 390/1440 px × light/dark on Home, configuration, callouts and tabs; menu axe checks; keyboard, persistence, default reset, language navigation, cross-tab sync, blocked storage, invalid values, no JS, print, command palette, reading-anchor/breakpoint handling and generated comment stylesheets |
| `appearance-engines.spec.mjs` | Six checks passed: Chromium, Firefox and WebKit at 390/1440 px; stored state and browser chrome color restored before CSS, native keyboard selection, focus return and language navigation. Desktop Chromium also used 4× CPU throttling |
| Font requests | All observed fonts were local. Paper requested no Inter; Slate requested no Plex Sans. Two real-site overlay builds proved system typography requests no bundled text face and explicit font roles override both presets |
| `make check` | Complete non-browser suite passed: 57 tests, 141/141 translated pages and the existing Markdown/rendered-content/internal-link checks |
| `make browser` | 197 tests passed across all nine standard suites; sitemap axe scan scoped to the 15 routes below |
| Visual inspection | Actual Paper desktop Home, mobile long-form Docs, English/Chinese light/dark Appearance panels and Slate dark Home reviewed; screenshots come from browser tests, not injected styles |

The browser suite's sitemap axe pass is deliberately scoped with `A11Y_PATHS`
to 15 representative routes: EN/ZH Home, configuration, callouts, tabs and
OpenAPI; English search, Mermaid, ECharts, Blog and a Book chapter. The existing
responsive axe matrix runs in addition. Cross-origin Giscus and vendor API
widget DOM retain the suite's established exclusions. This is not an exhaustive
sitemap scan.

The integration run found and fixed Paper dark highlighted-line gutter contrast
and smooth-scroll interference with reading-anchor restoration. Theme-color
checks now assert both presets: Paper's opaque warm selection surface and
Slate's existing translucent selection surface.

## Limits and next checks {#limits}

Manual screen-reader speech and visual filmstrip/paint traces remain unverified.
The blocked-stylesheet and throttled-CPU assertions verify initialization order,
not every browser's first painted frame. Slate comparison freezes
base palette values and verifies rendered font behavior; it does not claim
pixel identity for all 1.1.0 components after unrelated 1.2 work.

Mermaid/ECharts retain mode-only palettes. Ink and Terminal remain research;
serif display headings, full geometry/density tokens and preset-colored charts
remain later work. No release tag, push, cross-site upgrade or deployment was
performed for this work.
