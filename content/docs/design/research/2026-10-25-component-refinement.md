---
title: Component refinement, 2026-10-25
linkTitle: Component refinement review
description: Local four-preset component validation, asset measurements, and separately reproduced gallery baseline failures.
weight: 65
icon: fa-solid fa-list-check
design_kind: research
design_status: local-verification
research_date: 2026-10-25
---

> [!IMPORTANT] Local evidence only
> This records local implementation of [phases 0–3](/docs/design/proposals/component-refinement/). It establishes no commit, public release, consumer upgrade, or deployment. The moving selection trial remains deferred.

## Inputs and method {#inputs}

Theme base `7f9589f` and documentation base `855d890`, plus the component refinement working-tree changes. The independent gallery work was already committed. Unrelated toolchain and workflow edits were preserved. Validation used Hugo Extended 0.168.0 with built-in LibSass, Go 1.27.3, Node 26.12.0, and npm 11.20.0 on macOS ARM64. The LibSass deprecation warning remained visible.

The browser preview used the sibling theme, `hugo.yml,tests/fixtures/browser.yml`, both workspace mechanisms disabled, and live reload/watching disabled. Screenshots came from actual theme output. The [bilingual comparison guide](/docs/components/presentation/) owns the reusable examples.

## Executed validation {#validation}

| Check | Result and scope |
| --- | --- |
| Theme component owners | SCSS/compiler hooks, fonts, presets, content primitives, components, code blocks, and Landing passed. Invalid variants and inapplicable command strips warn and preserve content. |
| Theme shell/output owners | Shell, actions, palette, keyboard, runtime isolation, and output checks passed. Output security passed on 501 fixture files with the fixture's intentional third-party embeds enabled. |
| Real site | `make check` passed, including bilingual headings, rendered Markdown, internal links, and all 64 non-browser tests. Only reviewed additions to navigation/backlinks were accepted in the site's Markdown goldens. |
| Full browser suite | `make browser` passed 408 Chromium tests. The sitemap axe scan used the bounded routes described below. |
| New presentation coverage | All 20 tests passed after the final Landing success-color correction: four presets × light/dark × EN/ZH; 1440/768/390/320px layout; literal clipboard text; native disclosures; no JavaScript; print; coarse pointers; reduced motion; forced colors; and Landing feedback width/contrast. |
| Visual review | Desktop card/command samples and mobile samples across all eight preset/mode combinations; selected Paper, Slate, Ink, Terminal, and forced-colors screens inspected. No horizontal overflow in the measured 390px samples. Landing copy feedback retained its 109.0625 × 44px button. |
| Production | The local sibling theme passed a minified production build. A separate replacement-free v1.3.2 build also succeeded, with expected unsupported-variant warnings; it does not contain the new presentation APIs. |

The full suite's `A11Y_PATHS` covered EN/ZH Presentation, Cards, Callouts, Tabs, Code, and Fields, plus English Badge and Kbd: 14 routes. The existing responsive accessibility matrix ran as well. New presentation axe scans included the article at 390px; the Landing check included its command box in all eight preset/mode combinations. Giscus requests were blocked in the component presentation tests, as in the existing suites. This is not a full sitemap audit or manual screen-reader acceptance.

## Asset cost {#assets}

The same documentation source and production build mode were used with an exported theme `7f9589f` and the initial local refinement candidate, before the Tab review below. Only the main stylesheet changed among the built CSS/JavaScript assets:

| Asset | Before | After | Change |
| --- | ---: | ---: | ---: |
| Minified main CSS | 528,665 bytes | 539,437 bytes | +10,772 bytes |
| Main CSS, gzip | 79,541 bytes | 80,856 bytes | +1,315 bytes |
| Built JavaScript | Identical hashes | Identical hashes | 0 bytes |

No framework, font, remote asset, or JavaScript dependency was added. Generated builds, screenshots, logs, and the size-comparison JSON were retained outside Git.

## Tab review follow-up {#tab-review}

The maintainer preferred the earlier flat Tab treatment. The revision removes the selected label's fill, enclosing border, and inset shadow. Selection uses link color and a 2px bottom rule; hover-capable devices show a subtle fill only under the pointer. All labels use the same medium weight. The shared header surface remains quiet.

`check-components.py` and the 19 applicable presentation browser tests passed. A separate eight-preset/mode inspection verified transparent resting labels, hover fill, stable geometry, arrow-key selection, visible focus, a forced-colors underline, and no 390px overflow. Paper light, Slate dark, and Terminal dark screenshots were inspected. This CSS-only revision did not repeat the full 408-test suite or the earlier production size measurement.

## Baseline failures and limits {#limits}

Two theme checks still fail in both the exported base and the local candidate:

- `check-namespace.py`: the committed blog gallery emits unprefixed `data-height`, `data-width`, `data-mode`, and `data-size` and reads corresponding unprefixed dataset properties.
- `check-goldens.py`: the committed gallery's prepaint condition, toolbar icon, and gallery markup are absent from the existing theme goldens. Comparing the base and candidate with the checker's normalizer found no additional change across the 52 golden surfaces.

These failures are separate from component refinement; their expectations were not relaxed or refreshed. The component checker did need a narrow correction: reject obsolete configuration keys, rather than any occurrence of the word `gallery`, so the valid `blog_gallery` key can coexist with the old-feature guard.

This run used Chromium, not a new Firefox/WebKit acceptance pass. Ink and Terminal retain their experimental status. No new runtime was introduced, so the JavaScript unit suite was not rerun. Final visual approval and any release/consumer work remain separate from these local results.
