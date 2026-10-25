---
title: Component refinement across four visual presets
linkTitle: Component refinement
description: A staged plan for refining OINK components, adding Markdown presentation variants, and evaluating limited motion across Paper, Slate, Ink, and Terminal.
weight: 50
icon: fa-solid fa-sliders
search_keywords: [component refinement, Fluid Functionalism, Paper, Slate, Ink, Terminal, Markdown, motion]
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-10-25
---

> [!NOTE] Local implementation — not released
> Phases 0–3 and phase 5 acceptance are complete locally. The three presentation variants are documented in the [component contract](/docs/design/components/#component-refinement) and the [comparison guide](/docs/components/presentation/). Phase 4's moving selection background is deferred. Local validation does not establish a published release or consumer adoption.

## Status and scope {#status}

| Item | Boundary |
| --- | --- |
| Status | Phases 0–3 and 5 accepted and committed locally; [final validation recorded](/docs/design/research/2026-10-25-component-refinement/) with separate gallery baseline failures; no release assigned |
| Owner | OINK maintainers; theme implementation in `oink`, public documentation and integration acceptance in `oink.pgsty.com` |
| Date | 2026-10-25; follows the Fluid Functionalism review of 2026-10-24 |
| Contract baseline | OINK v1.3.2; Hugo Extended 0.168.0 with built-in LibSass; Go 1.27.3 |
| Implementation base | Theme `7f9589f`; documentation `855d890`, plus local refinement changes; the separate blog-gallery work has committed |
| Affected contracts | [Components](/docs/design/components/), [Shell](/docs/design/shell/), [Landing](/docs/design/landing/), [visual preset decision](/docs/design/decisions/visual-presets/) and applicable writing guides |
| Minimum useful delivery | Shared style rules plus Cards, disclosures, Tabs, and copy feedback; later variants and motion can ship separately |

The intended result is a more coherent set of existing components, with three optional authoring variants. Paper, Slate, Ink, and Terminal keep their own visual identities. Ink and Terminal remain explicit experiments; this proposal does not promote their stability status.

## Context and evidence {#context}

[Fluid Functionalism](https://www.fluidfunctionalism.com/) is useful for its treatment of surface hierarchy, grouped rows, state changes, and small interaction details. The strongest references are its [surfaces](https://www.fluidfunctionalism.com/docs/surfaces), [cards](https://www.fluidfunctionalism.com/docs/card), [accordion](https://www.fluidfunctionalism.com/docs/accordion), [tabs](https://www.fluidfunctionalism.com/docs/tabs), [copy control](https://www.fluidfunctionalism.com/docs/input-copy), and [button](https://www.fluidfunctionalism.com/docs/button).

Two details are particularly transferable: moving the button background while keeping its label stable, and reserving space for copy feedback. Its [fluid hover](https://www.fluidfunctionalism.com/docs/fluid-hover) suggests a possible moving selection background, but introduces geometry and lifecycle work that deserves a separate trial.

The earlier review inspected public documentation, registry source, and the rendered homepage. Detail-page browser inspection was incomplete; it did not establish keyboard, accessibility, or mobile acceptance of the reference library. Borrowed ideas must therefore pass OINK's own review. The library's eight-level surfaces, small application typography, and Inter-specific font animation are not adoption targets.

OINK already has the relevant component families, native Markdown enhancements, clipboard behavior, and appearance system. Refinement should happen in those owners. Paper's decorative heading hairline was removed in the inspected local revisions; this plan keeps it removed.

## Goals and exclusions {#goals}

1. Make surfaces, spacing, borders, icon alignment, and interaction states consistent within each preset.
2. Improve the components readers encounter most often before adding author-facing syntax.
3. Keep native Markdown as the first choice; add explicit presentation modifiers where they provide a useful distinction.
4. Keep content available without JavaScript and preserve keyboard, touch, reduced-motion, print, and machine-readable output behavior.
5. Reuse existing style tokens, renderers, action handling, and runtime modules.

This work excludes a fifth preset, a global density setting, a replacement surface engine, a component registry, and new React, Tailwind, Motion, Radix, or Base UI dependencies. It does not add font downloads or an external Sass executable. Form builders, sliders, color pickers, chat interfaces, a generic dialog shortcode, a tooltip authoring language, and vendor-component redesign are outside scope. Existing blog-gallery changes remain separate.

## Shared style rules {#style-rules}

### Surfaces and geometry {#surfaces}

Use three practical roles: page canvas, content surface, and floating surface. Map them onto the current palette and component tokens. Add a narrowly named `--td-*` role in the existing token layer only when an actual component need cannot be expressed there; do not create a parallel palette authority.

An independent card has its own boundary. A grouped list has one enclosing frame with internal dividers. Tabs containing code or a table should read as one composed panel, without redundant nested borders. Use luminance and borders to separate dark-mode surfaces; shadows alone do not establish hierarchy.

Use a 4px rhythm as a review aid. Start with roughly 8px between icons and labels and 12–16px row insets, then adjust against the bilingual sample page. These values apply to component internals, not a global rewrite of article layout. Keep current reading width, body size, font-selection policy, and Chinese readability. Compact controls may have a small visual body, but effective coarse-pointer targets should reach 44×44px without overlapping adjacent controls. Static badges and labels are not controls.

### States and motion {#states}

| State | Proposed rule |
| --- | --- |
| Rest | Quiet boundary and readable label; no implied interaction on plain content |
| Hover | A small background or border change; no title, weight, or layout shift |
| Selected/current | Persistent indication distinguishable from hover |
| Keyboard focus | Immediate, visible 2px outline with appropriate contrast; never waits for animation |
| Pressed | For eligible buttons, move only the background inward by about 1px; text and hit target remain fixed |
| Success/failure | Reserve localized feedback space; announce results through existing feedback semantics |
| Disabled | Preserve readability and existing disabled semantics; do not rely on color alone |

Reuse the current 100/150/250ms motion roles for quick feedback, ordinary state changes, and occasional larger transitions. Consolidate component-specific literal timings where useful. Transition named properties only; do not introduce shared `transition: all` rules. Theme and preset switches remain immediate. Reduced motion removes travel while preserving visible state changes.

Native disclosures do not need animated height. A short chevron rotation and clear open state are sufficient. Do not animate text weight or hide inactive tab labels. Copy success appears only after the clipboard operation succeeds; failures remain visible and retryable.

## Adaptation by preset {#presets}

The following radii are starting ranges for phase 1 review, not accepted token values. Shared geometry rules must not flatten the differences between presets.

| Preset | Surface and shape | Typography and emphasis | Motion |
| --- | --- | --- | --- |
| Paper | Warm surfaces, hairline dividers, restrained shadows; containers around 10–12px, small controls 6–8px | Preserve Plex reading, blue links, and generous prose rhythm; keep heading hairlines removed | Short fades and quiet press feedback |
| Slate | Preserve the frozen base palette; clarify technical-panel hierarchy; containers around 12–14px, controls 6–8px | Preserve the existing Inter/Chakra/Plex roles and clear metadata hierarchy | Best candidate for a modest moving selection background |
| Ink | Square corners, precise rules, flat surfaces, no elevation shadows | Preserve monochrome structure, red emphasis, and underlined links | Direct state changes; no bounce or traveling decoration |
| Terminal | 2px corners, flat surfaces, compact local controls, no elevation shadows | Preserve monospaced UI/headings, Plex prose, cyan links, and amber emphasis | Fast, direct feedback; no decorative travel |

Site-authored `theme_color`, font overrides, system typography, and project SCSS hooks continue to take precedence according to the current contract. Ink and Terminal must not acquire Paper's rounded, elevated treatment through shared selectors.

## Component worklist {#components}

| Component | Concrete change | Authoring impact | Phase |
| --- | --- | --- | --- |
| Cards | Align icon/title/description; consistent inset, border, hover, and focus treatment; share visual rules between native lists and shortcodes | Existing grid remains; optional divided list variant later | 2, 3 |
| Callouts and disclosures | Align marker, title, and chevron; make the summary row a coherent target; quiet neutral disclosures while retaining warning/error semantics | Existing alert syntax and native `details` remain; no automatic grouping of adjacent blockquotes | 2 |
| Tabs | Clarify selected versus hover state; stabilize label geometry; support long, scrollable labels; remove redundant frames around nested code/tables | Preserve labels, grouping, hash/storage behavior, and keyboard model | 2 |
| Code and copy controls | Reserve feedback width and utility space; keep long commands unobscured; keep actions available on touch; refine success/error feedback | Existing fences unchanged; optional command presentation later | 2, 3 |
| Tables and Fields | Refine header/body hierarchy, cell padding, rules, and alignment; quiet row tracking without implying clickable rows | Preserve `.matrix`, wide-table behavior, anchors, and existing syntax | 3 |
| Badges and `kbd` | Correct baseline alignment, padding, border contrast, and preset-specific corners | Keep existing shortcode and HTML paths; no new inline Markdown DSL | 3 |
| Steps | Refine markers and connector spacing; add compact treatment for short procedures or static timelines | Preserve full tutorial steps; optional compact modifier | 3 |
| Buttons and Landing command boxes | Align geometry, surface-only press, copy feedback, and narrow-screen action layout | Reuse current data and action handling | 3 |
| Search, command palette, sidebar, appearance menu | Align icon/title/meta/shortcut columns; consistent row groups, hover/current/focus, and floating surfaces | No navigation or preference-storage redesign | 3 |
| Moving selection background | Trial a shared background inside the existing command palette only | No new author syntax; static fallback always available | 4, optional |

Cards with plain text remain plain content. Link cards keep valid link semantics and avoid nested interactive targets. Disclosures stay independently operable; an exclusive FAQ group is not needed for the first delivery. Steps may contain existing disclosures, but static timelines use actual dates and statuses rather than simulated AI progress.

## Candidate Markdown variants {#variants}

Phase 0 confirmed Goldmark attribute propagation. The three variants below are implemented locally with focused output checks and bilingual examples. Their public behavior belongs to the component contract; the original staged plan remains here for the deferred motion work.

### Divided card list {#card-list}

```markdown
- [Installation](/docs/start/) — Set up a local site.
- [Configuration](/docs/customize/config/) — Configure the site.
{.cards .td-cards-list}
```

The modifier would turn the existing card list into a single-column group with internal dividers, useful for related pages, resources, and short navigation lists. The default card grid remains unchanged. Preserve item order, descriptions, links, and mobile wrapping.

The local full `cards` shortcode now accepts `variant="list"`; unsupported values warn and fall back to the default grid. Native and shortcode forms share the same surface rules while preserving their existing DOM and output content.

### Compact command block {#command-block}

````markdown
```bash {class="td-code-command"}
hugo server
```
````

Use the existing code renderer, highlighting, and clipboard action to present a deliberately marked short command as a compact strip. Preserve literal copy text and existing `wrap` behavior. Do not automatically compact every one-line fence. Multiline, numbered, or collapsed blocks should keep the regular code presentation with an owning diagnostic when the modifier is inapplicable; never discard content to fit the strip.

### Compact steps {#compact-steps}

```markdown
1. Prepare configuration.
1. Run the local preview.
1. Review the generated page.
{.steps .td-steps-compact}
```

This variant reduces marker size and gutter spacing for short procedures, release summaries, and migration checklists. It keeps ordered-list semantics, numbering, start values, anchors, and nesting. Release timelines reuse existing metadata when available. The local full `steps` shortcode now accepts `variant="compact"`; unsupported values warn and keep the default presentation.

## Delivery stages {#stages}

The main path is **0 → 1 → 2 → 3 → 5**. Phase 4 is an optional branch after phase 3 and cannot block phase 5. Phase 2 is the minimum useful delivery; it may go directly to the applicable phase 5 acceptance without new variants or moving highlights.

### Phase 0 — Establish the comparison baseline {#phase-0}

- Record both Git revisions, dirty paths, module source, actual tool versions, and built CSS/JS sizes.
- Create a bilingual comparison page in the real documentation site with Cards, disclosures, Tabs, and copy controls. Include long Chinese labels, wrapped titles, nested code/table panels, and touch-sized actions.
- Capture four presets × light/dark × desktop/mobile, with keyboard focus and representative states. Store screenshots and logs outside Git; theme `tests/site/` remains a synthetic checker input.
- Probe the three candidate Markdown modifiers and shortcode owners; confirm attribute propagation, fallback, and output implications.

**Deliverable:** a before-state comparison and a short defect list tied to actual components. **Exit:** review criteria, sample content, candidate syntax feasibility, and implementation boundaries are concrete. No theme redesign is accepted merely by creating the page.

### Phase 1 — Establish shared component rules {#phase-1}

- Inventory existing surface, border, radius, spacing, typography, and motion roles. Reuse them and add only proven missing component roles.
- Map the four presets, including dark mode, without changing the frozen Slate palette or authored overrides.
- Consolidate state treatment and timing. Pilot surface-only press on one owned copy/action button before wider use.

**Deliverable:** a small shared SCSS change plus preset mappings. **Exit:** the sample page has consistent states in all eight preset/mode combinations, stable labels and layout, and no new dependency or global density setting.

### Phase 2 — Refine the four sample families {#phase-2}

Work in order: **Cards → callouts/disclosures → Tabs → code/copy feedback**. Use a separate reviewable change for each family. Include both native Markdown and full shortcode forms where they exist, the focused checker, and affected bilingual contracts in the same delivery.

**Deliverable:** four frequently used families with coherent visual treatment and unchanged author syntax. **Exit:** desktop/mobile, EN/ZH, keyboard, touch, reduced-motion, print, and no-JavaScript behavior pass the applicable checks. This is the first independently shippable refinement milestone.

### Phase 3 — Add opt-in variants and extend coverage {#phase-3}

- Implement divided card lists, command strips, and compact steps as three separate changes after their probes pass. Each includes validation, fallback, output review, and bilingual author examples.
- Refine Tables/Fields, badges/`kbd`, and Landing actions using the accepted rules.
- Apply the same row and state treatment to search, the command palette, sidebar, and appearance menu without changing navigation behavior.

**Deliverable:** accepted variants and consistent adjacent components. **Exit:** old pages need no edits; inapplicable input falls back safely; native/full forms agree visually. A variant may be deferred without delaying phase 2 or the other variants.

### Phase 4 — Trial a moving selection background {#phase-4}

Limit the first experiment to the existing command palette's active row. Reuse its selection model; pointer position must not choose a different nearest item, and Enter must keep activating the same selected target. The visual layer is noninteractive and never substitutes for immediate focus indication.

Use one background element, cached geometry, and explicit invalidation after filtering, resizing, font changes, or scrolling. Avoid layout reads on every animation frame and any idle animation loop. Use existing vanilla JavaScript and runtime boundaries, with direct state changes for reduced motion and a static fallback.

**Deliverable:** a bounded prototype with before/after interaction and asset-size evidence. **Exit:** adopt only if it improves continuity without lag, misalignment, selection ambiguity, or a new dependency. Otherwise retain the static state treatment. Promotion to short menus or Tabs needs its own evidence; article lists and card grids are outside this trial.

### Phase 5 — Accept and prepare delivery {#phase-5}

- Run focused theme checkers first, then the real site's `make check`, `make browser`, and visual review. Verify production output as applicable and identify its module source.
- Compare CSS/JS sizes using the same build mode and toolchain. Account for every added runtime byte; no new framework, remote asset, or unconditional runtime is justified by this plan.
- Update the owning bilingual contracts, writing guides, changelog, and accepted rationale. Move completed decisions out of the proposal and retire resolved material according to the proposal lifecycle.
- Prepare release and downstream adoption only when that work is scheduled. A future release uses `bin/update-consumers.py` and preserves maintained sites' Paper default and explicit four-choice menu.

**Deliverable:** accepted implementation, documentation, and a source-identified validation record. Local changes, commits, tags, published modules, consumer pins, and deployment remain separate states. Creating this plan performs none of those release actions.

## Implementation and checker ownership {#implementation}

Paths in the following table are relative to the theme repository. Extend existing owners instead of adding a second rendering or action layer.

| Work | Implementation owners | Focused checks |
| --- | --- | --- |
| Shared rules and presets | `assets/scss/td/_presets.scss`, `_experimental-presets.scss`, `_brand.scss`, `_tokens-typography.scss`, `shell/_tokens.scss` | `bin/check-presets.py`, `check-font-tokens.py`, `check-scss.py`, `check-namespace.py` |
| Cards and Steps | Native lists in `assets/scss/td/_markers.scss`; full forms in `_content-components.scss`, `shortcodes/_steps.scss`; `layouts/_shortcodes/cards.html`, `card.html`, `steps.html` | `bin/check-content-primitives.py`, `check-components.py` |
| Callouts/disclosures | `assets/scss/td/_alerts.scss`, `layouts/_markup/render-blockquote-alert.html` | `bin/check-components.py`, applicable output checks |
| Tabs | `assets/scss/td/_tabs.scss`, `assets/js/tabs.js`, `layouts/_partials/content/tab-block.html`, existing shortcodes | `bin/check-components.py`, affected runtime tests |
| Code/copy | `assets/scss/td/_code.scss`, `layouts/_partials/code/` normalization/render/action paths, `assets/js/code-block.js`, `clipboard.js` | `bin/check-code-blocks.py`, `check-runtime-isolation.py`, affected runtime tests |
| Tables/Fields/badges | `assets/scss/td/_table.scss`, `_content-components.scss`, `shortcodes/_content-primitives.scss`, owning hooks/partials | `bin/check-content-primitives.py`, `check-components.py` |
| Shell rows and selection | `assets/scss/td/shell/` search/sidebar/appearance styles, existing `command-palette.js`, `appearance.js`, action modules | `bin/check-shell.py`, `check-actions.py`, `check-palette.py`, `check-keyboard.py` |
| Landing actions | `assets/scss/td/_landing.scss`, `layouts/_partials/landing/sections/command-box.html`, action partials, `assets/js/landing.js` | `bin/check-landing.py`, `check-actions.py` |

There is no `layouts/_markup/render-list.html` owner to modify for native Cards/Steps. Confirm rendered list attributes before deciding whether those variants need anything beyond scoped styles. Add meaningful behavior/output assertions, not tests that only lock CSS source text or every radius value.

Output changes also use the applicable `check-output.py`, `check-goldens.py`, and `check-output-security.py` checks. Runtime changes use `node --test 'tests/js/**/*.test.js'`. Run `python3 bin/generate-config-schema.py --check` only if the implementation affects configuration/schema ownership. Review generated differences before changing goldens.

Real-site coverage belongs in the existing browser suites: content components, code blocks, appearance/fonts, command palette, responsive shell, keyboard navigation, print tabs, and accessibility. Extend only the affected cases. Use `make -C ../oink.pgsty.com check`, `browser`, and `dev` for the sibling theme; never use the theme's destructive `c` or `clean` targets as checks. The existing Hugo subprocess limit and accepted LibSass warning remain in force; do not enable panic-on-warning behavior.

## Compatibility and output boundaries {#compatibility}

- Existing Markdown, shortcodes, component IDs, URLs, tabs grouping, storage keys, and authored overrides remain compatible. New presentation variants are explicit opt-ins and require no bulk content migration.
- Preserve current class/parameter validation. Add only the intended names through their owning allowlists; retain safe fallback for unsupported input. Do not add raw-HTML injection paths, remote fetches, or inline-event requirements.
- No-JavaScript pages retain all content and useful links; native `details` remains operable and existing Tabs fallback exposes its content. Print expands content according to the current contract.
- Markdown, LLMS, and RSS outputs preserve content and existing semantics. Presentation modifiers must not leak UI controls, hide steps, change copied code, or duplicate text in those outputs.
- Ordinary consumers continue to build with Hugo Extended's built-in LibSass. Project SCSS hooks remain supported, and the optional OINK CLI is not required.

## Acceptance criteria and open decisions {#acceptance}

| Area | Required evidence |
| --- | --- |
| Visual identity | Four presets × two modes × EN/ZH; Paper/Slate refinement and Ink/Terminal identity are individually reviewed |
| Responsive layout | Representative 1440, 768, and 390px views, plus a 320px overflow check; long labels and nested components remain usable |
| Geometry | No label movement on hover, press, or copy feedback; multiline content grows naturally; hit targets do not overlap |
| Contrast | At least 4.5:1 for ordinary text and 3:1 for large text and required non-text indicators, measured against actual composited backgrounds |
| Interaction | Keyboard order, immediate focus, applicable focus return, persistent current state, touch, forced colors, and reduced motion reviewed |
| Content and outputs | Existing syntax and overrides, `.matrix`, wide tables, anchors, literal copy, no-JavaScript content, print, Markdown/LLMS/RSS preserved |
| Equivalent forms | Native Markdown and full shortcode variants reviewed together even where their HTML differs |
| Runtime cost | Same-build CSS/JS comparison; optional highlight has bounded measurement, no idle loop, and no new dependency |

The local implementation confirms the modifier names above. Shared controls use 8px corners in Paper/Slate, square corners in Ink, and 2px corners in Terminal; containers retain their preset-owned radii. Phase 4 remains deferred because the static selection states already serve this delivery without geometry tracking or extra runtime. Future FAQ grouping and any release schedule remain separate decisions.

## Decision log {#decision-log}

| Date | Decision |
| --- | --- |
| 2026-10-25 | Drafted from the Fluid Functionalism review. Prioritize existing component refinement, retain four preset identities, propose three explicit variants, and isolate moving selection as optional. This entry records a plan, not implementation or release acceptance. |
| 2026-10-25 | Maintainer authorized implementation after the independent blog-gallery commit. Phases 0–3 are implemented locally; the three variants, shared surfaces, static selection, and background-only press feedback are documented in their owning contracts. Phase 4 is deferred; no JavaScript or dependency was added. |
| 2026-10-25 | Recorded focused checks, real-site validation, bounded Chromium/visual evidence, and the same-build asset comparison in [Research](/docs/design/research/2026-10-25-component-refinement/). Final visual approval and release remain separate; known gallery namespace/golden failures reproduce in the implementation base. |
| 2026-10-25 | Maintainer review rejected the raised-looking selected Tab. Replace its filled, outlined shape with transparent labels, a thin selected underline, and subtle hover-only fill. Keep label weight and geometry stable, distinct keyboard focus, and touch targets. |
| 2026-10-25 | Maintainer requested unboxed Terminal field names; native and full Fields now agree across all presets. Final delegated acceptance passed the scoped checks, 409 browser tests and targeted three-engine review; fixed nested native-card links and the no-script command action column. Implementation and documentation were committed locally; phase 5 is complete, phase 4 remains deferred, and release work is separate. |
