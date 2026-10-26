---
title: Ink and Terminal need reading acceptance
linkTitle: Ink and Terminal review
description: Source review, bounded visual evidence, current failures and promotion limits for Ink and Terminal on 2026-10-26.
weight: 70
icon: fa-solid fa-flask
design_kind: research
design_status: local-verification
research_date: 2026-10-26
---

> [!NOTE] Research before release preparation
> This record preserves inputs and measurements from before the 2026-10-26 release preparation.
> Current contracts use OINK 1.4.0; Ink and Terminal stabilization remains a later proposal.

> [!WARNING] Local research — shared blocker remains
> At 320px with a 32px root/default font, footer links cause document overflow in all four presets. Ink and Terminal remain experiments; the CSS comparison does not fix this failure or establish stability.

**Keep Ink neutral sans editorial and Terminal a readable engineering handbook.** Both can become coherent official styles through their existing role system and shared shell. A new serif identity would weaken Ink's distinction from a future Folio; a simulated terminal would weaken long-form engineering reading. The immediate work is shared text resilience, quieter hierarchy and component consistency. Token checks and exploratory measurements support that direction but do not close manual, device or contrast acceptance. The [proposal](/docs/design/proposals/ink-terminal-stabilization/) owns desired behavior and promotion gates.

## The evidence identifies a local snapshot {#inputs}

This 2026-10-26 review combines primary-source text/HTML/CSS inspection, an exported source snapshot, real documentation rendering and a bounded injected CSS comparison. Theme HEAD was `7bc8658bc1be13ef0ad3050b9d9f6862f8f1f65f`; documentation HEAD was `99751179eefada3fa7a91318c792ddac46d7e6bf`. The snapshot also included recorded dirty work, including concurrent table changes: those hashes alone cannot reproduce the complete input. The retained source manifest identifies that extra state. Public tag lookup observed v1.3.2, peeled to `bd2e856e6e2f7027a9189af009701f5b8cf562cf`; documentation pinned v1.3.2. No consumer inventory or deployed-site verification was performed. The [earlier experiment](/docs/design/research/2026-10-05-ink-terminal-experiment/) and [component review](/docs/design/research/2026-10-25-component-refinement/) provide history, not current acceptance.

The documentation server used the sibling snapshot with `hugo.yml,tests/fixtures/browser.yml`, both workspace mechanisms off, memory rendering, no watching/live reload, and `enableGitInfo=false` because the export lacked Git metadata. Tools were macOS ARM64, Hugo Extended 0.168.0, Go 1.27.3, Node 26.12.0, npm 11.20.0 and Playwright 1.62.1; engines were Chromium 151.0.7922.34, Firefox 153.0 and WebKit 26.5. Built-in LibSass warnings stayed visible. These are engine versions, not evidence of branded Safari or actual mobile devices. ([Playwright boundary](https://playwright.dev/docs/browsers#webkit))

The reproducible method loads the same real route, language, mode and preset at each width, compares baseline with the listed overlay, records full-document dimensions and computed styles, then captures relevant components. Source manifests, `review-metrics.json`, `api-supplement.json`, `text-resize-findings.json`, `stress-metrics.json`, `reference-rendering.json` and screenshots remain outside Git. This public account records scope and limits without publishing workstation paths.

## Whole-document overflow outweighs targeted passes {#results}

At 320px/32px root font, English Ink had `scrollWidth=424` (+104px), Terminal 408 (+88px). Chinese Chromium overflow was +12px/+21px respectively; English Terminal also exceeded 768px by 11px. The overlay produced the same failures. Firefox's actual `font.size.variable.x-western=32` preference reproduced English overflow across all four presets; Paper reached 413px and Slate approximately 400px. Footer links including “Customization”, “Components” and “Docsy discussions” exceed two narrow columns. This is a **shared baseline blocker**, not an overlay regression.

These probes exercise CSS root enlargement and native default-font preferences. Combining 320px width with enlarged text is a stronger stress condition than standalone reflow; it is not sufficient to assign a specific WCAG failure without the separate assessment. Full manual 200% text enlargement and 400% browser zoom remain pending. ([Resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html))

**Owning checks**: `check-presets.py` passed text/link/accent checks over three surfaces, mode parity, frozen Slate and configuration output; `check-font-tokens.py` passed. These inspect bounded roles, not every rendered state.

**Existing suites**: 28 appearance-engine, text-reflow and component tests passed. Their page-context/topline assertions missed the footer. The source-snapshot `make check` passed 64 non-browser tests before these documents were added. With the new documents, the site built and passed Markdown, bilingual heading and internal-link checks; 63 of the 64 non-browser tests passed, including suites run separately after the first failure. The remaining `llms.txt` golden differs only by the two new English document entries. The golden was preserved within this four-file delivery scope; the full command is therefore not green. No full `make browser` run was performed.

**Main measurement matrix**: Chromium: 11 valid routes × two presets × two modes × EN/ZH × 320/390/768/1440px × baseline/overlay. Firefox/WebKit: presentation/configuration/Book only at 320/1440px. Normal-size pages showed no document overflow.

**Counting correction**: The initial ledger's 960 entries were computed-state observations, not independent tests. A mistaken API route produced 32 harness 404s; the corrected `/docs/write/openapi/` supplement contributed 64 valid observations with HTTP 200 and no document overflow.

**Additional stress**: 64 simultaneous spacing observations used line-height 1.5, paragraph margin 2em, letter spacing .12em and word spacing .16em; no page/heading overflow was observed. Sixteen 320px long-unbroken heading/Field-label probes preserved text without page overflow. These exploratory observations do not establish full spacing or resize acceptance.

**axe**: 32 article scans at 390px covered presentation/configuration, both languages/modes/presets and baseline/overlay. No violations were reported; all scans retained contrast incompletes. Representative inspected targets were `aria-hidden=true` pager-arrow spans with non-text characters: manual graphic-contrast questions, not proven text failures.

**Visual material**: The archive contains 352 comparison captures, including later Blog/Expo/Mermaid/ECharts scenes, plus eight external references. Representative desktop/mobile light/dark pages and controls were inspected; the archive was not exhaustively visually approved.

**Long reading**: The real EN/ZH `/blog/oink/oink-implementation-diary/` article was checked in four selected combinations: Ink EN/1440/light, Ink ZH/390/dark, Terminal EN/390/light and Terminal ZH/1440/dark. Baseline/overlay captures at top/middle/footer produced 24 additional images, separate from the comparison archive; normal-size document overflow was zero throughout. Eight representative images were actually inspected, including English before/after prose, Chinese prose, Terminal's English mobile footer and Ink's English desktop opening. This is a targeted check, not a complete matrix or reader study.

The Chromium routes were home, Presentation, Configuration, Fields, Code, Table, Book structure, immersive-reading Blog, Expo studies, Mermaid and ECharts, plus the corrected OpenAPI guide. Chinese peers were included. The later capture pass verified the first rendered Mermaid and an ECharts canvas; this does not audit every diagram or vendor DOM. The comparison gallery spans 11 scenes; seven control scenes cover both presets, modes, languages and two widths. Offsite requests, including Giscus, were blocked in the main matrix, so remote iframe behavior remains unaccepted.

### The overlay tests a limited editorial change {#overlay}

Ink kept its palette/fonts while changing article `h1` from 800/`-.035em` to 750/`-.025em`, `h2/h3` from 750/`-.025em` to 700/`-.012em`, and its 2px emphasis top rule to a 1px existing strong-line rule. It removed enforced uppercase/tracking on minor/table/callout headings, used zero Chinese heading tracking, and compared native underlines at `max(1px,.06em)`/`.22em`, with Chinese `.25em` and `skip-ink: none`.

Terminal kept teal/mint and amber, used heading weight 600/zero tracking, removed generated heading prefixes and callout brackets, changed descriptive table headers to body `0.875rem/600` and search titles/excerpts to body, and reduced decorative code/tab/table/callout frames to the existing border role. Technical paths/controls stayed mono and Field names stayed unboxed. FileTree's omitted literal 0.6rem radius became 0px/2px for Ink/Terminal. Flat Tabs, mobile targets and vendor boundaries remained intact. **No theme implementation, font, runtime or configuration was added by the overlay.** Broader desired behavior in the proposal was not thereby implemented.

Authored accent colors on actual pages were documentation blue `#245f94/#5da2dd`, Book orange `#9a3412/#fb923c` and Blog violet `#6d28d9/#a78bfa`. Separately labeled palette probes reset only that authored accent to the preset default on both variants. They are controlled comparisons, not unmodified site output. The [architecture contract](/docs/design/architecture/#visual-presets) preserves overrides and the shared shell.

### Palette calculations expose state risks {#contrast}

Opaque sRGB calculations and alpha compositing used source tokens and the WCAG luminance formula; displayed ratios are rounded, pass decisions are not. They do not measure every actual background or interaction. ([Contrast method](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [palette source](https://github.com/pgsty/oink/blob/v1.3.2/assets/scss/td/_experimental-presets.scss))

| Pair, light / dark | Calculated contrast | Implication |
| --- | --- | --- |
| Ink accent `#c8102e` on white / `#ff5c4d` on `#0b0b0b` | 5.88 / 6.46 | Retain mode-specific red; these pairs do not justify repeated red decoration. |
| Terminal body on canvas | 14.88 / 13.64 | Strong neutral reading pair. |
| Terminal link on canvas / secondary surface | 6.31 / 9.54; 5.75 / 8.73 | Existing teal/mint supports these exact surfaces. |
| Terminal tertiary text on secondary surface | 4.63 / 5.93 | Light muted text has little margin for further tint/opacity. |
| Terminal amber on canvas | 5.47 / 9.44 | Amber remains a separate emphasis role. |
| Terminal 32%-alpha border on canvas | 1.97 / 2.36 | Insufficient if it alone identifies a required control/state; decorative rules are different. |
| Terminal 55%-alpha strong line on canvas | 3.63 / 4.73 | Candidate functional boundary on these canvases, not every surface. |
| White on dark mint `#4cc9bd` | 2.02 | Do not assume white labels work on light mint fills. |

Cross-mode reuse also fails ordinary text contrast: mint on the light canvas is 1.85, dark teal on the dark canvas 2.79. There is no evidence-based red-pixel quota, and no need to replace the palette before reducing competing signals. Semantic tones, author accents, syntax comments, selected search excerpts, focus and text-selection composites still require state-specific review. Non-text contrast concerns necessary identifying information, not every separator. ([WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html))

## Mature precedents support roles, not transplantation {#precedents}

All external references were accessed **2026-10-26**. Observations below distinguish published guidance/CSS from OINK design inference. External Chromium rendering at 1440/390px returned HTTP 200 for Tufte, GOV.UK Headings, Effective Go and A List Apart. Eight captures were saved; the actually inspected views were **Tufte desktop, GOV.UK mobile, Go mobile and A List Apart desktop**. No external interaction, screen-reader or accessibility audit was performed; the other precedents received source review only.

**[Practical Typography](https://practicaltypography.com/typography-in-ten-minutes.html)**. Puts body text first; prescribes Latin-oriented size, spacing and measure. Its [underlining advice](https://practicaltypography.com/underlining.html) opposes link underlines. Exact CSS was not verified after direct TLS retrieval failed.

Review complete paragraphs before display titles. Do not import its underline opinion, tighter Latin rhythm or commercial-font advice as bilingual evidence.

**[Tufte CSS](https://edwardtufte.github.io/tufte-css/)**. Inspected desktop shows a narrow serif reading column and underlines. [CSS](https://edwardtufte.github.io/tufte-css/tufte.css) declares ET Book, light `#fffff8/#111`, dark `#151515/#ddd` and mobile note toggles.

Borrow proximity of explanation/figures and note hierarchy. Serif/margin geometry belongs to possible Folio research; toggled notes and its dark rule are not accessibility acceptance.

**[GOV.UK Headings](https://design-system.service.gov.uk/styles/headings/)**. Inspected mobile view has generous sans headings and underlined links; cookie banner was visible. Current [type scale](https://design-system.service.gov.uk/styles/type-scale/) uses 19px/25px body sizing on small and large screens. [Links](https://design-system.service.gov.uk/styles/links/) distinguish prose from navigation; [tables](https://design-system.service.gov.uk/components/table/) emphasize structure.

Strongest functional input for Ink's sans hierarchy and persistent link cues. Do not copy its font licensing, brand or exact scale into Chinese. No complete dark-mode evidence follows.

**[A List Apart: A Dao of Web Design](https://alistapart.com/article/dao/)**. Inspected desktop distinguishes serif body from sans headings/controls. [Current CSS](https://alistapart.com/wp-content/themes/ala/style.css?ver=1757090064) uses Georgia `1.125rem/1.7`, red `#ba3925` h2 and blue links.

Separate reading/UI/code roles and keep adaptable content. Do not import surrounding promotions/sidebar, serif Ink or repeated red headings. Current styling is not a reconstruction of the article's 2000 appearance.

**[Rust Book: Ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)**. Source exposes numbered chapter structure, explanations and code; [CSS](https://doc.rust-lang.org/book/css/general-e96d0476.css) separates Open Sans prose and mono code.

Strong Terminal precedent for explanation/syntax separation and real chapter numbers. Mono headings remain OINK's own choice; do not copy shortcut behavior or text-size suppression.

**[Effective Go](https://go.dev/doc/effective_go)**. Source/CSS separates platform sans and mono; inspected mobile TOC is dense and two-column. The page flags its technical guidance as no longer actively updated.

Borrow straightforward technical hierarchy, not the dense mobile TOC or branding. Content-maintenance limits do not invalidate its role separation as a design observation.

**[man7 open(2)](https://man7.org/linux/man-pages/man2/open.2.html)**. Stable reference sections, signatures, links and preformatted text; `(2)` names a manual section.

Preserve predictable lookup and complete identifiers. Do not turn bilingual prose into fixed-width terminal cells or mistake manual sections for Book numbering.

**[CLI Guidelines](https://clig.dev/#output)**. A navigable explanatory web guide recommends intentional, limited color.

Borrow restraint and clear labels. TTY, `NO_COLOR`, pager and prompt conventions do not define web interaction; no terminal key capture or ASCII boxes.

These references establish useful design practices, not a controlled comparison proving sans/serif superiority, faster reading, an optimal accent density or a universal line length. Paper's warm general reading, Slate's established technical presentation, Ink's neutral editorial restraint and Terminal's technical role contrast can remain distinct without four shells.

## Language and accessibility need independent evidence {#language-accessibility}

Actual Chromium per-glyph inspection on macOS found Inter for Ink Latin, IBM Plex Sans for Terminal prose, IBM Plex Mono for Terminal headings, and PingFang SC for Chinese in both. This is stronger than a computed family string but says nothing about Windows or Android. Microsoft inventories plausible Windows candidates; AOSP's Android 15 reference uses language-specific CJK fallback and permits OEM changes. Font names in CSS do not prove availability or glyph selection. ([CSS font matching](https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm), [Windows fonts](https://learn.microsoft.com/en-us/typography/fonts/windows_11_font_list), [Android fallback](https://source.android.com/docs/core/fonts/custom-font-fallback))

Chinese underline clearance remains unresolved. The CSS Text Decoration Working Draft explains Han collisions and fragmented ink skipping; CLReq's Group Note Draft discusses interlinear marks without banning hyperlink underlines. The overlay's `.25em`/continuous line is only one comparison. Compare language-scoped `text-underline-position: under` with a small offset and initial `skip-ink: auto`, including Chinese inside English pages and mixed-script wrapped links. Neither source proves uniform device support. ([CSS draft](https://www.w3.org/TR/css-text-decor-4/#text-underline-position-property), [CLReq](https://www.w3.org/TR/clreq/))

WCAG A/AA governs color-independent meaning, text/non-text contrast, keyboard operation, resize, reflow, spacing, language and status announcements. OINK's proposed 44px routine touch targets, 7:1 main text and stronger 2px-area focus treatment must remain separately labeled project targets, not AA minima or whole-page AAA claims. Automated axe incompletes need interpretation; engine screenshots cannot establish spoken task success. ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), [axe-core](https://github.com/dequelabs/axe-core), [focus appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html))

Still pending are actual Windows/Android loaded/blocked/system-font comparisons; branded Safari/iOS rendering; manual NVDA, VoiceOver and TalkBack tasks; full manual 200%/400% zoom; and comprehensive keyboard, forced-colors and state-contrast review. Those tasks must include navigation, meaningful Book numbers, table relationships, field errors, Chinese search input, status feedback and dialog return focus. The new spacing probes narrow uncertainty without closing this work.

## Promotion should follow resilient reading {#implications}

The footer exposes an acceptance-method defect as well as a layout defect: checking the article's opening cannot protect the complete reading journey. Shared repair and whole-document regression should therefore precede preset promotion. FileTree's radius leak and competing Terminal punctuation are bounded owner-level changes; importing another layout or palette would not resolve the missing evidence.

For 1.4, refine existing owners and promote Ink or Terminal independently only when its gates close. Otherwise retain experimental status without delaying unrelated work. Folio offers distinct academic serif reading at real font/licensing/fallback cost; Canvas offers creator geometry with weaker evidence and substantial overlap/QA cost. Neither justifies a new preset in this delivery. A local comparison, accepted design, commit, public tag, consumer pin and deployment remain separate outcomes.
