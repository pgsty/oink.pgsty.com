---
title: Stabilizing Ink and Terminal for reading
linkTitle: Ink and Terminal stabilization
description: A conditional stabilization plan for two distinct reading styles, with a shared footer blocker and explicit bilingual accessibility gates.
weight: 60
icon: fa-solid fa-palette
design_kind: proposal
design_status: draft
proposal_date: 2026-10-26
---

> [!WARNING] Draft — promotion blocked
> **Enlarged text overflows the shared footer.** At 320px with a 32px root/default font, English Ink reaches 424px document width and Terminal 408px. The comparison overlay does not repair this shared failure. Neither prototype is stable or accepted for promotion.

## Status, ownership and scope {#status}

**Status and date**: Draft, 2026-10-26; proposed design direction, not an implementation contract

**Accountable owner**: OINK maintainers; separate recorded acceptance for each preset

**Delivery owners**: Theme maintainers own CSS, resolvers and focused checkers; documentation maintainers own bilingual contracts, real-site fixtures and browser review; accessibility reviewers own manual task evidence

**Baseline**: OINK v1.4.0; local source identity and dirty-snapshot limits are recorded in the [research](/docs/design/research/2026-10-26-ink-terminal-stabilization/#inputs)

**Affected surfaces**: [Architecture](/docs/design/architecture/#visual-presets), [Components](/docs/design/components/), [Shell](/docs/design/shell/), [Landing](/docs/design/landing/) and the [visual preset decision](/docs/design/decisions/visual-presets/)

**Release intent**: A later release, subject to refinement and independent acceptance; no new preset recommended

## Context and evidence {#context}

Ink and Terminal already exist as explicit experiments. Their shared shell is an advantage: readers retain navigation, search, appearance controls and content semantics when changing style. Their remaining problems are repeated decoration, typography outside ordinary prose, inconsistent owned geometry, and incomplete acceptance. Ink is already **neutral sans editorial**; making it serif would consume Folio's separate territory. Terminal should become a **readable engineering handbook**, retaining mono technical roles alongside proportional explanations.

The [dated research](/docs/design/research/2026-10-26-ink-terminal-stabilization/) distinguishes source facts, measurements, design judgments and a limited CSS overlay. Normal-size measurements, spacing probes and focused checks are encouraging, but the whole-document footer failure survives them. A 32px native-default-font probe is actual font-preference evidence, not completed manual 200% text-resize or 400% browser-zoom acceptance. Historical October 5 and October 25 records explain prior decisions; they do not accept this candidate.

## Goals and explicit exclusions {#goals}

| Preset | Audience and primary task | Distinct identity within the same shell |
| --- | --- | --- |
| Paper | Broad documentation readers; guides and sustained reading | Warm Plex Sans reading surfaces and restrained rounded components; remains the default |
| Slate | Existing technical/product sites; reference navigation and product presentation | Established cool palette, Inter/Chakra/Plex roles and richer Landing presentation; compatibility choice |
| Ink | Editors, authors and readers of essays, design rationale and long documentation | Neutral Inter/CJK sans, square flat surfaces, visible prose underlines and sparse red or authored accents |
| Terminal | Engineers and operators; procedures, configuration lookup and code explanation | Plex Sans explanations, mono headings/controls/identifiers, teal/mint links, amber emphasis and flat 2px geometry |

Both candidates must work across Docs, Book, Blog, galleries, Expo and Landing in EN/ZH, light/dark and narrow/wide views. Neither is a separate shell, accessibility mode or table-density mode. Exclude new renderers, global spacing changes, font downloads, runtime dependencies, terminal effects, moving selection tracks, raised Tabs, boxed Field names and Paper heading tails.

Two optional concepts remain outside 1.4 scope:

| Concept | Distinct future purpose | Cost and disposition |
| --- | --- | --- |
| Folio | Academic/book publishing: serif reading roles and scholarly captions/notes, sans navigation/search, mono code | Requires a matched EN/ZH serif strategy, licensing, local font payload and fallback/print/device acceptance. Keep the shared shell; no imported margin-note column. Credible future study, not an Ink replacement. |
| Canvas | Playful geometric presentation for creators: existing sans faces, controlled lilac/ochre accents and a few geometric markers | No inherent font cost, but added palette/state/shape rules, asset guidance, menu and full regression coverage. Evidence is weaker and overlap with Slate is substantial. Defer until creator tasks justify it. |

## Proposed behavior and boundaries {#behavior}

### Preserve the palette, assign each role {#palette}

Retain these source colors initially. Values below are light/dark pairs, not a new configuration authority; [preset SCSS](https://github.com/pgsty/oink/blob/v1.4.0/assets/scss/td/_experimental-presets.scss) remains the implementation owner. Refine repetition before changing hue.

| Role | Ink light / dark | Terminal light / dark |
| --- | --- | --- |
| Canvas | `#ffffff` / `#0b0b0b` | `#f4f5f2` / `#0c0f0e` |
| Body | `#141414` / `#ededed` | `#1d211f` / `#d3dbd6` |
| Emphasis | `#000000` / `#ffffff` | `#111713` / `#edf4ef` |
| Secondary text | `#474747` / `#b5b5b5` | `#4a514d` / `#9aa59f` |
| Tertiary text | `#636363` / `#8f8f8f` | `#606b63` / `#8b9990` |
| Secondary surface / code header | `#f4f4f4` / `#161616` | `#e9ebe6` / `#141a18` |
| Tertiary surface | `#ffffff` / `#161616` | `#f8f9f6` / `#18201c` |
| Code block | `#fafafa` / `#111111` | `#ffffff` / `#0a0d0b` |
| Link | `#141414` / `#ededed` | `#0a6560` / `#4cc9bd` |
| Hover link | `#c8102e` / `#ff5c4d` | `#084f4b` / `#7de0d7` |
| Default accent | `#c8102e` / `#ff5c4d` | `#935400` / `#f0a73a` |
| On-link foreground | `#ffffff` / `#0b0b0b` | `#ffffff` / `#0c0f0e` |
| Ordinary border | Body RGB at 24% / 24% | Body RGB at 32% / 32% |
| Strong line | Body RGB at 55% / 50% | Body RGB at 55% / 55% |
| Inline code | Body foreground; body RGB fill 5% / 6% | Body foreground; body RGB fill 5% / 7% |

Success, warning, error and information retain their semantic tones, icons and labels. Red is not every Ink status; mint is not every Terminal status. Keep neutral badges distinguishable from success. Decorative separators may remain subtle; required control boundaries need independent contrast measurements.

Authored `theme_color` remains authoritative for accent surfaces. Actual documentation uses blue `#245f94/#5da2dd`, Book orange `#9a3412/#fb923c`, and Blog violet `#6d28d9/#a78bfa`. These do not replace the link/code text roles. Review both authored accents and preset defaults; an injected palette probe is not unmodified site output.

### Keep reading roles and verify actual fallback {#typography}

| Role | Ink default | Terminal default |
| --- | --- | --- |
| `body` | Inter + platform sans | IBM Plex Sans + platform sans |
| `ui` | Inter + platform sans | Code role: IBM Plex Mono + mono fallbacks |
| `heading` | Body role | UI role |
| `code` | IBM Plex Mono + mono fallbacks | IBM Plex Mono + mono fallbacks |
| `display` | Heading role | Heading role |
| `meta` | UI role | UI role |
| `brand` | UI role | UI role |
| `print` | Body role | Body role |

Book captions, table descriptions and human-readable search titles/excerpts use the body role. Authored chapter numbers retain their meaning and follow their heading's role. Technical paths, command controls and identifiers remain mono in Terminal. Field names stay unboxed, at weight 600. Descriptive Terminal table headers move to body `0.875rem/600`; ordinary prose retains `1rem/1.7` and the shared reading measure. Display titles retain page-specific scale and wrap; do not shrink mobile prose to accommodate mono chrome.

The existing sans fallback order is `-apple-system`, `BlinkMacSystemFont`, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans SC, generic sans-serif and emoji. The mono list follows IBM Plex Mono with SFMono-Regular, Cascadia Code, Roboto Mono, Menlo, Consolas, Liberation Mono, Sarasa Mono SC, Noto Sans Mono CJK SC and generic monospace. Listed names do not install fonts. YaHei precedes Segoe and can supply Latin too. Chinese glyphs need not occupy Latin mono cells. Preserve language metadata, `typography: system`, explicit roles and legacy Sass precedence; inspect loaded, blocked, system and overridden font conditions on actual Windows/Android. ([Font matching](https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm))

### Establish hierarchy and language-sensitive links {#hierarchy-links}

Compare Ink article `h1` at weight 750/tracking `-.025em`, `h2/h3` at 700/`-.012em`, and a 1px strong-token top rule instead of the current heavier rule. Chinese headings use zero tracking. Remove enforced uppercase/tracking from minor headings, table headings and callout titles. Terminal headings use 600/zero tracking; remove generated `##`/`###` and callout brackets while preserving authored Book numbers, semantic labels and heading anchors. No fake prompts, blinking cursor effects or decorative heading tails.

Ink prose links remain natively underlined at rest, including lists, notes and citations. Terminal retains a persistent non-color link distinction; verify its existing semibold cue in real prose and use native underlines where that cue is insufficient. Navigation relies on its location and persistent current-state marks. Hover must not change layout, weight or hit area. ([GOV.UK links](https://design-system.service.gov.uk/styles/links/))

Underline geometry remains a review decision. The overlay uses `max(1px, .06em)` thickness, `.22em` offset, with a Chinese `.25em`/`skip-ink: none` comparison. **A blanket `.25em` rule is not accepted.** Compare English `.12–.18em` and Chinese `text-underline-position: under` with only `0–.06em` extra offset, starting with `skip-ink: auto`. Scope by actual language, including Chinese blocks inside English pages. Test mixed glyphs, punctuation, descenders, inline code and wrapped links; no line may collide with glyphs or adjacent lines. The CSS specification explains the issue, not a universally supported optimum. ([CSS Text Decoration draft](https://www.w3.org/TR/css-text-decor-4/#text-underline-position-property))

### Make component states coherent {#components}

**Owned component corner radii**: Ink 0px, Terminal 2px, no elevation shadows; include FileTree's currently hard-coded 0.6rem corner radius. Preserve image, avatar, status-dot and vendor geometry.

**Current/selected**: Ink keeps a static accent rail; Terminal keeps neutral inverse rows/marker. Programmatic state remains. Hover, selection and keyboard focus stay distinct; no traveling pill.

**Focus**: Immediate static indicator, independently measured on every adjacent surface, visible in forced colors; no global outline reset.

**Text selection**: Start from current authored-accent fill at 22% light/35% dark; measure composited text/inline-code pairs. Change through the owning role if needed; do not assume the opacity passes.

**Tabs**: Flat labels, static bottom selection rule, separate focus; no raised active tab. Preserve keyboard, hash/storage behavior, long labels and touch hit areas.

**Fields and inputs**: Unboxed technical Field names; descriptions remain prose. Actual input controls retain persistent labels, identifiable boundaries and associated error text; placeholder alone is insufficient.

**Code and tables**: Quiet single frame; preserve syntax semantics, comments, copying, captions, header associations and numeric alignment. Descriptive headers can wrap; no whole-table uppercase. Preserve authored width/overflow policy and local scroll access.

**Notes, quotes, footnotes**: Keep essential text visible; restrained semantic marker/rule, close attribution and usable reference/backlinks. No oversized quote ornaments, blanket Chinese italics or added margin column.

**Cards, steps, badges, disclosures**: Stable labels and geometry; distinguish clickable from static content, keep real step numbers, native disclosure semantics and labeled states.

**Search and appearance**: Body-role result titles/excerpts, mono technical paths; readable matching/selected/muted text. Preserve dialog focus/return, IME editing, loading/error/no-results feedback and reachability with a mobile keyboard.

**Landing, Blog/gallery, Book, Expo**: Preserve existing composition and media behavior; fit display titles, captions, bylines and utilities into each reading task. Do not turn image surfaces into squared global resets.

### Preserve output, vendor and security boundaries {#outputs}

Mermaid/ECharts remain **mode-only**; API widgets retain vendor palettes and their existing mode behavior. Do not add preset recoloring inside vendor DOM. Giscus automatic palettes follow preset and mode; explicit overrides remain authoritative, but blocked remote frames are not accepted by this review. Print keeps the light preset on white paper; no-JavaScript output keeps the site-default light palette and readable content. Markdown/RSS preserve semantic content without decorative prefixes or control leakage. Keep existing escaping, validated font/color inputs, local assets and appearance storage behavior; no new network permission or script dependency.

## Compatibility and migration {#compatibility}

Keep preset names, independent mode/style state, shell columns, breakpoints, content syntax and author overrides. Retain Paper as default and maintained consumers' explicit `[paper, slate, ink, terminal]` menu. A refinement can ship while a preset remains experimental.

Promotion changes the meaning of `preset_menu: true`: it offers stable presets plus the site default, so promoting either experiment expands that automatic set. Make that change explicit in `layouts/_partials/preset-config.html`, its checker and bilingual configuration/release guidance. Explicit lists retain their chosen membership. Promotion requires per-preset maintainer acceptance, not a status-label edit. Preserve reserved Folio/Canvas warning/fallback behavior. Consumer upgrades, public module resolution and deployment remain separate steps.

## Implementation and owning-checker plan {#implementation}

| Stage / owner | Work and evidence |
| --- | --- |
| Shared repair / shell maintainer | Fix footer shrink/wrap behavior at its owner; add whole-document scroll-width and visible-content assertions through the footer for all four presets. Avoid clipping or hiding overflow as a remedy. |
| Refinement / theme maintainer | Implement reviewed changes in existing preset, typography and component owners. Start with `bin/check-presets.py`, `bin/check-font-tokens.py` and affected component/output checks; preserve frozen Slate. |
| Integration / documentation maintainer | Extend appearance, font, component and text-reflow suites on real EN/ZH pages; include full-page checks and annotated visual review. Run sibling-source `make check`, `make browser`, and `make dev` review. |
| Promotion / maintainers and reviewers | Close the gates below; update owning implementation/checker and affected EN/ZH contracts together, then record durable rationale and user-facing migration guidance. |

Use Hugo Extended 0.168.0, Go 1.27.3 and built-in LibSass. Record actual versions; keep the accepted warning visible and never enable panic-on-warning. Runtime edits additionally require `node --test 'tests/js/**/*.test.js'`; schema edits require `python3 bin/generate-config-schema.py --check`. This draft itself authorizes neither implementation nor release.

## Acceptance gates and open decisions {#acceptance}

### Distinguish accessibility requirements from project targets {#accessibility}

WCAG 2.2 A/AA is the baseline; this focused checklist is not a whole-site conformance certificate. References were accessed on **2026-10-26**.

| Gate | Required assessment |
| --- | --- |
| Text and controls | Normal text 4.5:1; qualifying large text 3:1 (24px regular or 18⅔px bold, equivalent CJK sizing). Required control/state cues 3:1 against adjacent colors; decorative dividers are different. Include code comments, placeholders and every selected/hover state. ([1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)) |
| Reflow and resizing | Independently test 320 CSS px reflow, manual 200% text enlargement and 400% browser zoom from a 1280px viewport. Necessary two-dimensional regions require individual justification; code/tables are not blanket exemptions. Also close the separate 320px/32px-font stress blocker. ([1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)) |
| Spacing | Tolerate simultaneous line-height 1.5, paragraph-after spacing 2em, letter spacing .12em and word spacing .16em without loss. These are user overrides, not default typography; assess applicable Chinese/mixed-script properties. ([1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)) |
| Keyboard and meaning | Visible focus; focused controls not entirely obscured by authored content; non-color state cues; correct language, headings, labels and table relationships. Character shortcuts need disable/remap/focus-only handling, not merely suppression in text inputs. Announce applicable search statuses without moving focus. ([2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html), [4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)) |
| Target minimum | AA uses 24×24 CSS px or a qualifying exception. For its spacing exception, a 24px-diameter circle centered on each undersized target must intersect neither another target nor another undersized target's circle; inline, equivalent, user-agent and essential exceptions also exist. ([2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)) |
| Proposed stronger targets | Routine touch controls 44×44px; main text 7:1; whole focused control/ring visible; static indicator at least a 2px-perimeter area with 3:1 change at the same pixels, plus adjacent-color contrast. These go beyond AA and need explicit adoption; they do not imply whole-page AAA. ([2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html), [1.4.6](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html), [2.4.13](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)) |

### Record complete tasks before promotion {#promotion}

Require both languages and modes at **320/390/768/1440px**, with normal, enlarged and overridden text. Review long pages at top/middle/footer, heading/Book numbering, URLs, Fields, tables, code, search, appearance, media and Landing. Inspect rest/hover/current/selected/focus/text-selection, forced colors, reduced motion and no-JavaScript/print/Markdown/RSS. Record actual color pairs and human review of axe incompletes; automated token passes are not all-state contrast acceptance.

Actual Windows Chrome/Edge and Android Chrome font/rendering work remains pending, as do branded macOS/iOS Safari checks. Record device/OS/browser/font conditions. Pending manual tasks use NVDA on Windows, VoiceOver with actual Safari, and TalkBack on Android: traverse headings and meaningful numbers, read tables/field errors, search with Chinese input, hear concise status feedback, open/close dialogs and regain focus. Browser-engine automation cannot substitute for these records.

Open decisions are the Chinese underline treatment, stronger project targets, any state-specific color repair, and the promotion of each preset. If gates remain incomplete, retain experimental status or defer refinement; unrelated 1.4 work need not wait for new styles. Release verification must separately identify the published module with replacements/workspaces disabled, consumer pins and deployment.

## Decision log {#decision-log}

| Date | Proposed decision and status |
| --- | --- |
| 2026-10-26 | Keep Ink neutral sans editorial and Terminal a readable engineering handbook; preserve current palettes and author accents. Direction recommended; no stability acceptance. |
| 2026-10-26 | Prioritize shared enlarged-font footer repair; keep flat Tabs, unboxed Fields and no Paper tails. Remove decorative Terminal punctuation through existing owners. |
| 2026-10-26 | Chinese underline alternatives and stronger accessibility targets remain review decisions; exploratory probes do not close promotion gates. |
| 2026-10-26 | No new preset for 1.4; Folio/Canvas remain distinct future concepts. Per-preset promotion and automatic-menu expansion require explicit acceptance. |
