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

> [!IMPORTANT] Local acceptance only
> [Phases 0–3 and final acceptance in phase 5](/docs/design/proposals/component-refinement/) are complete for this component change. The implementation and documentation are committed locally. This does not establish a public release, consumer upgrade, or deployment. The moving selection trial remains deferred.

## Inputs and method {#inputs}

The final review used isolated sibling checkouts based on theme `7f9589f` and documentation `855d890`, with only this task's source changes applied. Concurrent PlantUML, toolchain, and workflow work was excluded from the candidate and preserved in the shared worktrees. The accepted implementation is theme commit `15c39ef`; guides, contracts, examples, and browser coverage are in documentation commit `81e2be9`. This follow-up records their final acceptance.

Validation used macOS ARM64, Hugo Extended 0.168.0 with built-in LibSass, Go 1.27.3, Node 26.12.0, and npm 11.20.0. The LibSass deprecation warning remained visible. Browser previews used the isolated sibling theme and `hugo.yml,tests/fixtures/browser.yml`, with both workspace mechanisms, watching, and live reload disabled. Screenshots came from actual documentation output. The [bilingual comparison guide](/docs/components/presentation/) owns the reusable examples.

## Executed validation {#validation}

| Check | Result and scope |
| --- | --- |
| Theme component owners | SCSS/compiler hooks, fonts, presets, content primitives, components, code blocks, and Landing passed. Invalid variants and inapplicable command strips warn and preserve content. |
| Theme shell/output owners | Shell, actions, palette, keyboard, runtime isolation, and output checks passed. Output security passed on 501 fixture files with the fixture's intentional third-party embeds enabled. |
| Real site | `make check` passed all 64 non-browser tests, including bilingual headings, rendered Markdown, and internal links. Reviewed navigation/backlink additions account for the site's Markdown golden changes. |
| Full browser suite | `make browser` passed 409 Chromium tests. After the last correction to hide an empty command action column without JavaScript, all 20 presentation tests and the SCSS checker passed again against a fresh build. |
| Presentation coverage | Four presets × light/dark × EN/ZH; 1440/768/390/320px layouts; literal clipboard text; independently operable native and full card links; native disclosures; no JavaScript; print; coarse pointers; reduced motion; forced colors; and Landing feedback width/contrast. |
| Additional engine review | Chromium 151.0.7922.34, Firefox 153.0, and WebKit 26.5 passed 48 preset/mode/locale combinations covering Tabs, Fields, card links, and 1440/390/320px layouts. The final no-JavaScript command presentation also passed in all three engines. This is targeted engine coverage, not three runs of the full suite. |
| Visual review | Reviewed actual Paper, Slate, Ink, and Terminal cards, disclosures, Tabs, command strips, and field labels in light/dark and desktop/mobile output. Stable viewport captures preserve each preset's geometry and reading hierarchy. |
| Production | The final candidate passed a minified production build. Resource measurements below use the CSS linked by the generated page and the same documentation source for both builds. |

The full suite's `A11Y_PATHS` covered EN/ZH Presentation, Cards, Callouts, Tabs, Code, and Fields, plus English Badge and Kbd: 14 routes. The existing responsive accessibility matrix ran as well. Presentation axe scans included the article at 390px; the Landing check included its command box in all eight preset/mode combinations. Giscus requests were blocked as in the existing suites. This is not a full sitemap audit or manual screen-reader acceptance.

## Asset cost {#assets}

The exported theme base and the final candidate used the same documentation source and production build mode:

| Asset | Before | After | Change |
| --- | ---: | ---: | ---: |
| Minified main CSS | 528,665 bytes | 539,450 bytes | +10,785 bytes |
| Main CSS, gzip | 79,541 bytes | 80,887 bytes | +1,346 bytes |
| Built JavaScript | 39 files | Identical hashes | 0 bytes |

These final measurements supersede the earlier 539,437-byte / 80,856-byte initial refinement measurement. No framework, font, remote asset, or JavaScript dependency was added. Builds, screenshots, logs, source manifests, and comparison JSON remain outside Git.

## Tab review follow-up {#tab-review}

Maintainer review rejected the raised selected Tab. The accepted treatment keeps individual labels transparent at rest, supplies a subtle fill only on hover-capable devices, and uses link color plus a 2px bottom rule for selection. Labels retain the same medium weight and position. Keyboard focus has its own outline; coarse-pointer targets remain at least 44px high. Final engine review verified these states, arrow-key selection, and narrow layouts.

## Field names and final corrections {#final-corrections}

Terminal field names now use the same unboxed, emphasized monospace treatment as the other presets. Both native Markdown tables and full Fields shortcodes were checked in EN/ZH and light/dark output. Ordinary prose code and keycap borders retain their separate role.

Final review reproduced and fixed two further edge cases:

- A native card's stretched title link intercepted a secondary link nested inside emphasis. Secondary controls now remain above that target; pointer checks verify both the nested link and the rest of the card navigate correctly. The title's keyboard focus outline follows the card's own shape.
- A command strip retained a small empty action column when JavaScript was disabled. The wrapper now disappears until its copy control is available. In all three engines, the source column occupies the full 356px inner width of the 390px sample, while the normal enhanced copy control remains usable.

## Baseline failures and limits {#limits}

Two theme checks fail identically in the exported base and the component candidate:

- `check-namespace.py`: committed blog gallery output uses unprefixed `data-height`, `data-width`, `data-mode`, and `data-size`, with corresponding unprefixed dataset reads.
- `check-goldens.py`: the committed gallery's prepaint condition, toolbar icon, and gallery markup are absent from the existing theme goldens. Comparing base and candidate with the checker's normalizer found no additional difference across all 52 golden surfaces.

These are existing gallery failures, not a clean repository-wide gate. Their assertions and goldens were not relaxed. The component checker has a separate narrow correction: reject obsolete configuration keys rather than any occurrence of `gallery`, allowing the valid `blog_gallery` key.

Local acceptance covers this component change and its two final repairs. Ink and Terminal retain their experimental status. Runtime JavaScript is unchanged, so its unit suite was not rerun. The commits have not been pushed, tagged, released, adopted by consumers, or deployed as part of this work.
