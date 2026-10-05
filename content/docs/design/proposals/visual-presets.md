---
title: Visual presets and appearance switching
linkTitle: Visual presets
description: Paper and Slate ship in 1.2.0; Ink and Terminal are explicitly enabled experiments awaiting design acceptance.
weight: 40
icon: fa-solid fa-swatchbook
search_keywords:
  [
    visual preset,
    theme preset,
    Paper,
    Slate,
    Ink,
    Terminal,
    appearance menu,
    dark mode,
    typography,
    IBM Plex Sans,
  ]
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-10-04
---

> [!IMPORTANT] Phase 1 released in 1.2.0; Ink/Terminal opt-ins available
> Paper, Slate and the Appearance menu ship with OINK 1.2.0. The [architecture contract](/docs/design/architecture/#visual-presets),
> [accepted decision](/docs/design/decisions/visual-presets/) and
> [acceptance record](/docs/design/research/2026-10-05-visual-presets-acceptance/)
> own phase-one behavior and evidence. A subsequent [Ink/Terminal experiment](/docs/design/research/2026-10-05-ink-terminal-experiment/)
> provides actual selectable output; this proposal remains active for their design acceptance. The October 4 injected screenshots are research prototypes; they
> are distinct from the October 5 screenshots of actual theme output.

## Status and surface {#status-and-surface}

| Field | Value |
| --- | --- |
| Status | Phase 1 released in 1.2.0; Ink/Terminal explicit opt-ins |
| Owner | OINK maintainers |
| Date | 2026-10-04 |
| Baseline | Theme `main` after `v1.1.0` with unreleased `1.2.0` work; documentation site pinned to `v1.1.0` |
| Affected contracts | [Architecture: Trust, CSS, and accessibility](/docs/design/architecture/#trust-css-and-accessibility) (font roles, accent roles, inline-code colour), [Shell](/docs/design/shell/) (theme control), [Landing](/docs/design/landing/), [Configuration decision](/docs/design/decisions/configuration/), [Brand guide](/docs/customize/brand/) |
| Phase 1 | Paper preset, Slate preset, default changed to Paper, reader switching between Paper and Slate |
| Later phases | Ink/Terminal design acceptance; Folio and Canvas names reserved only |

## Context and evidence {#context-and-evidence}

The baseline and limitations below record the October 4 research input, before phase 1.

OINK ships one visual identity, referred to here as **Slate**: a cool blue-grey
canvas (`#f1f4f8` / `#0b1119`), navy text, steel-blue links (`#245f94`), copper
accents, Inter for interface and prose, Chakra Petch for display and wordmark,
IBM Plex Mono for code and technical labels, a blueprint grid and glow on the
Landing hero, and a crimson inline-code pair. It is defined by Bootstrap
custom properties in `assets/scss/td/_brand.scss`, shell tokens in
`assets/scss/td/shell/_tokens.scss`, and font roles in
`assets/scss/td/_tokens-typography.scss`.

PG.CENTER, an independent site, has a warm editorial reading style that
maintainers want as the future OINK default. Its presentation tokens live in
`media/css/pgsql.css` of that project. Measured on its local preview
(2026-10-04, light and dark, home, Docs index, long manual page, component
manual):

| Role | Light | Dark | Note |
| --- | --- | --- | --- |
| Canvas | `#f7f6f3` | `#161513` | warm white / warm black |
| Raised surface | `#ffffff` | `#1d1c19` | cards, code blocks |
| Secondary surface | `#efede8` | `#262420` | table header, hover |
| Ink | `#21201c` | `#ece9e3` | body text |
| Secondary text | `#56534c` | `#b6b1a7` | |
| Lines and washes | ink at 4.5–22 % alpha | light ink at similar alpha | no tinted greys |
| Radius | 12 px / 8 px | same | |
| Shadow | `0 2px 10px rgba(33,32,28,.07)` | black-based | warm, soft |
| Motion | 160 ms `cubic-bezier(.2,.7,.2,1)` | same | |

Typography is IBM Plex Sans (variable, 400–600) for interface and prose, IBM
Plex Mono for code, dates and versions, and Chakra Petch for the wordmark
only. The component-manual pages are the best long-form model: lead paragraph
17 px capped at 70ch, h2 followed by a hairline that runs to the edge, framed
tables with a header band and no zebra, monochrome callouts with a 3 px rule.

The following PG.CENTER elements are **site identity, not reusable reading
rules**: the PostgreSQL brand blue `#336791` family, wine content links,
version-state colours, release strips, search-kind badges, wiki tones, the
duotone hero, and the 144-character measure of the imported PostgreSQL manual.
Two values fail WCAG AA (muted text 3.67:1, link hover 4.22:1) and are
corrected below rather than copied.

Measured OINK docs typography for comparison: 16 px / 1.7 body, ≈ 76ch measure,
h1 36 px / 700, h2 24 px / 600, code 14 px. PG.CENTER Docs index: 15.5 px / 1.7,
≈ 120ch.

### Current limitations {#current-limitations}

- Colours are tied to `data-bs-theme` only. No attribute selects a second
  palette, and several surfaces bypass tokens: the Landing primary button
  (`#2f6793` with navy glows), the grid, scrims (`rgba(4,10,18,.45)`), print
  colours, asciinema surfaces, and the giscus stylesheets.
- About 85 literal border radii and several literal shadows make a flat preset
  impossible without a radius and shadow scale.
- The light/dark control expands on hover or focus. Touch readers cannot reach
  "follow system"; the trigger mixes `aria-pressed` and `aria-expanded`; Esc
  does not close it. The Landing mobile drawer has no theme control.
- `contrast-on-canvas.html` hard-codes Slate canvas luminance for the
  `theme_color` warning.
- `dark_mode` is opt-in (`false` by default), so the palette and its menu are
  absent unless a site enables them.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- one site key selects the default visual preset; Paper becomes the default;
- Slate remains available and reproduces current output for sites that choose it;
- readers can switch Paper and Slate instantly, without reload, independent of light/dark/system mode;
- the configured default renders without JavaScript and with storage unavailable;
- presets share templates, components, and layout geometry; they change paint and type;
- local fonts only, ordinary Hugo build, no new runtime framework or required build tool.

Non-goals:

- implementing Ink, Terminal, Folio, or Canvas in phase 1;
- copying PG.CENTER brand colours, version UI, or page structures;
- per-page or per-section presets (section colour remains `theme_color`);
- changing layout geometry, density, or navigation structure per preset in phase 1;
- theming Swagger UI, ReDoc, or third-party embeds beyond their existing light/dark handling.

## Preset model {#preset-model}

This table and the phase-one configuration below retain the original scope.
The later experiment adds explicit `ink`/`terminal` configuration and menu-list
entries; `true` still offers the stable set plus the site default. The
[architecture contract](/docs/design/architecture/#visual-presets) owns current behavior.

| Preset | Direction | Phase 1 | Reader menu |
| --- | --- | --- | --- |
| `paper` | Warm editorial minimalism | Implemented, default | Yes |
| `slate` | Technical minimalism (current OINK) | Implemented | Yes |
| `ink` | Typographic minimalism, Swiss-inspired | Spec + research prototype | No |
| `terminal` | Terminal-inspired utilitarian | Spec + research prototype | No |
| `folio` | Academic / book publishing | Name reserved | No |
| `canvas` | Playful geometric / creator | Name reserved | No |

Reserved names are rejected by validation until implemented, with a warning
that names the stable presets.

## Configuration {#configuration}

```yaml
params:
  ui:
    preset: paper        # paper | slate        (theme default: paper)
    preset_menu: false   # false | true | [paper, slate]
```

- `preset` selects the site default. Invalid or reserved values warn through
  the existing validation path and fall back to `paper`. Publishing gates turn
  the warning into a failure.
- `preset_menu` controls the reader choice. `false` renders no style group and
  emits no preset-init script; `true` offers every stable preset; a list offers
  a subset that must contain `preset`. Following the `dark_mode` precedent, the
  default is `false`; the documentation site enables it; starter adoption is outside this change.
- `preset` is site-level only. Page and section overrides are not supported:
  switching identity per page would break reader expectation and the stored
  choice.
- The Appearance menu exists when either `dark_mode.show_menu` or a style
  choice is enabled. A site with `dark_mode: false` and `preset_menu: true`
  shows only the Style group.

### Relationship to existing keys {#existing-keys}

Precedence, lowest to highest:

1. Slate base tokens on `:root` / `[data-bs-theme]` (unchanged selectors).
2. Preset tokens on `[data-td-preset=X]`.
3. `params.ui.typography: system` — collapses font roles to system faces after
   the preset blocks, so it still requests no brand font in any preset.
4. `params.ui.fonts` — emitted inline after the stylesheet at `:root`; equal
   specificity and later source order beat preset font roles. Explicit fonts
   always win.
5. `theme_color` / `theme_color_dark` — page and section accent *backgrounds*
   only. They override the preset accent; they never touch links or inline code.
6. Site `_styles_project.scss` — last in the bundle.

`typography: technical` remains the name for "use the preset's bundled faces".
The preset decides which bundled faces those are (Paper: Plex Sans; Slate:
Inter + Chakra Petch).

## Reader state {#reader-state}

Two independent dimensions:

| Dimension | Attribute | Storage | Values |
| --- | --- | --- | --- |
| Style | `data-td-preset` on `<html>` | `localStorage['td-preset']` | stable preset names |
| Mode | `data-bs-theme` (+ `.dark-mode`, vendor `data-theme` mirror) | `localStorage['td-color-theme']` | `light`, `dark`, `auto` |

| Situation | Result |
| --- | --- |
| First visit | Server renders `data-td-preset="<site preset>"` and `data-td-site-preset`; no script needed |
| Reader chooses a preset | Applied at once, stored, `td-preset-change` dispatched |
| Reader chooses the preset marked "Default" | Storage key removed; future site default changes reach this reader |
| Next page, refresh, other language | Inline head script applies the stored value before first paint |
| Stored value no longer offered | Removed; site default used |
| Storage unavailable | Choice applies to the current page; the menu states that it will not persist |
| JavaScript disabled | Site default preset renders in its light palette, as the current theme does without script; no style or mode control is usable |
| Style change | Never writes `td-color-theme`; mode change never writes `td-preset` |
| Other tab changes the value | `storage` event applies it |

The inline script runs before the stylesheet, beside the existing dark-mode
script. It validates the stored value against the allowed list embedded at
build time, sets the attribute, and updates the `theme-color` meta and the
pre-paint canvas colour for the preset and mode. It is emitted only when the
menu offers more than one preset. Independently of the menu, the static
pre-paint `<style>` and the resolved `theme-color` meta in `head.html` are rendered
from the site default preset's canvases instead of the current hard-coded
`#0b0d12`, `#ffffff`, and `#000000`.

On switch the runtime sets `data-td-preset-switching` for one frame to suppress
colour transitions, records the first visible heading or block as a scroll
anchor, applies the attribute, and restores the anchor offset, again after
`document.fonts.ready` because Plex Sans and Inter have different metrics.
Focus, open menus, and form state stay untouched. Phase 1 uses no cross-fade
or View Transition.

## Appearance menu {#appearance-menu}

Three options were compared:

| Option | Assessment |
| --- | --- |
| Keep the hover menu, add a style row | Keeps the touch and keyboard gaps; hover-only discovery |
| Separate style and mode buttons | Two icons in a crowded navbar; mobile drawer gets longer |
| **One Appearance disclosure with two radio groups** | Chosen: one entry point, works with touch and keyboard, scales to more presets |

Behaviour:

- **Trigger:** one icon button (`aria-expanded`, `aria-controls`, label
  "Appearance"). It replaces the current theme button in the navbar and in the
  shell footer line. Sun means the current light state; moon means dark.
  The `t` shortcut keeps toggling light/dark.
- **Panel:** a non-modal popover containing two native `fieldset` radio
  groups. The October 5 revision uses *Style*: icon-and-name buttons in two
  columns, with a preset-colored icon and no preview letters or experiment
  badges. The site default is identified by its tooltip and accessible name.
  *Light*: a segmented Light / Dark / System control. Selection applies
  immediately and the panel stays open so readers can compare.
- **Keyboard:** Enter/Space or ArrowDown opens and focuses the checked radio;
  arrow keys move within a group (native radio behaviour); Tab moves between
  groups; Esc closes and returns focus to the trigger; focus leaving the panel
  or an outside click closes it.
- **Feedback:** the selected option has a tinted background and accent border;
  keyboard focus has a separate outline. Changes are announced through native
  radio semantics; no extra live region.
- **Restore default:** selecting the site's default preset clears the stored choice.
  No separate reset button is needed.
- **Mobile (< 768 px):** the trigger stays in the compact header and is also
  offered in the docs drawer footer and in a new row of the Landing mobile
  drawer. The panel opens as a bottom sheet with 44 px targets, the same two
  groups, and a close button. The sheet is a modal `<dialog>` opened with
  `showModal()`, so it lives in the top layer: the prototype showed that the
  sticky header's `backdrop-filter` otherwise becomes the containing block of a
  `position: fixed` sheet and the drawer's stacking context hides it.
- **Command palette:** a `switch_preset` action next to `switch_theme`.

`dark-mode.js` keeps its storage key and attributes. It must sync the
`checked` state of the Light radios and listen to their `change` events instead
of the current `aria-pressed` buttons.

## Token architecture {#token-architecture}

All presets compile into the single existing `main.css`. Fonts are declared
with `@font-face` and are downloaded only when a rule uses them, so offering a
preset costs CSS bytes but no font bytes until it is selected.

```scss
// Slate: existing selectors and values, unchanged
:root, [data-bs-theme='light'] { … }
[data-bs-theme='dark'] { … }

// Every other preset
[data-td-preset='paper'] { /* light tokens + font roles */ }            // (0,1,0)
[data-td-preset='paper'][data-bs-theme='dark'],
[data-td-preset='paper'] [data-bs-theme='dark'] { /* dark tokens */ }   // (0,2,0)

// Then: [data-td-typography='system'] font block (moved after presets)
```

Rules:

1. **Token parity.** Each dark block redeclares every token of its light block,
   so Slate dark never leaks into another preset. A checker enforces it.
2. **Dark islands.** The descendant form covers nested `data-bs-theme="dark"`
   islands (Landing code plate, previews).
3. **Font roles only at (0,1,0)**, so `params.ui.fonts` keeps winning.
4. **Accent indirection.** Presets set `--td-preset-accent` (and `-rgb`,
   `-hover`); `--td-accent` defaults to it. `theme_color` keeps writing
   `--td-accent` and therefore overrides the preset in both modes.
5. **Slate stays attribute-free.** `data-td-preset="slate"` matches no override
   block, so current site overrides of brand tokens behave exactly as today.
6. **Geometry is shared.** Presets do not change grid columns, sidebar width,
   or breakpoints in phase 1.
7. **Preset-specific rules are few and scoped** to `[data-td-preset=X]` in one
   partial per preset. Anything two presets need becomes a token.

New shared tokens required before Paper (phase 1): `--td-shell-scrim`, Landing
`--td-grid` / `--td-glow` / primary-button tokens, `--td-callout-tint`,
`--td-code-inline-bg`, `--td-hairline`, and a `brand` font role
(`--td-brand-font-family`, default `var(--td-display-font-family)`) so the
wordmark can keep Chakra Petch while Paper's display headings use Plex Sans.

The original phase-two plan proposed global radius, shadow and density scales.
The October 5 experiment instead scopes those changes to owned components;
a wider token refactor is not a prerequisite for trying the designs.

Contract change: the architecture contract currently fixes inline code to a
crimson pair. This proposal makes `--bs-code-color` a **preset** token (Slate
keeps crimson, Paper uses an ink chip). `theme_color` still never touches it.

## Fonts {#fonts}

| Preset | UI / body / heading | Display | Brand (wordmark) | Meta | Code | New bytes |
| --- | --- | --- | --- | --- | --- | --- |
| Paper | IBM Plex Sans | IBM Plex Sans | Chakra Petch | IBM Plex Sans | IBM Plex Mono | Plex Sans |
| Slate | Inter | Chakra Petch | Chakra Petch | IBM Plex Mono | IBM Plex Mono | none |
| Ink | Inter | Inter | Inter | Inter (tabular) | IBM Plex Mono | none |
| Terminal | Plex Mono chrome, Plex Sans prose | IBM Plex Mono | IBM Plex Mono | IBM Plex Mono | IBM Plex Mono | none after Paper |

Paper vendors `@fontsource-variable/ibm-plex-sans` (OFL-1.1) into
`third_party/` with a `VENDOR.json` entry: Latin, Latin Extended, Cyrillic, Cyrillic Extended, Greek and Vietnamese
subsets, normal and italic, weights 100–700. PG.CENTER's normal-only 400–600 subset is
40,240 B (latin) + 25,868 B (latin-ext); exact sizes are recorded at vendor
time. Italic is required because OINK prose uses emphasis and PG.CENTER's
synthesized italic is not acceptable. The full small subsets preserve the existing locale coverage; the browser
loads only the ranges actually used. All 12 font files are recorded in VENDOR.json.

Chinese, Japanese and Korean use system stacks placed after the Latin face:
`-apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
'Noto Sans CJK SC', 'Noto Sans SC', sans-serif`. IBM Plex Sans SC was rejected
because its files are megabyte-scale. Monospace stacks insert CJK sans
families before the generic `monospace` keyword so mixed code keeps a
predictable CJK face.

`typography: system` continues to request no brand font: the system block
follows every preset block and resets all roles, including `brand`.

**Serif.** Phase 1 uses no serif. Latin serif headings beside CJK sans
headings look inconsistent, Windows' default CJK serif renders poorly at
heading sizes, and a serif costs another font. A later opt-in display-only
serif can be reviewed with the side-by-side mockup produced for this proposal.

## Preset specifications {#preset-specifications}

### Shared foundation {#shared-foundation}

Belongs to every preset, not to Slate:

- layout geometry, breakpoints, sidebar/TOC widths, ≈ 76ch prose measure;
- body 1rem / 1.7 for prose, 0.875rem for chrome, 0.8125rem for meta;
- type scale ratios (h1 2.25rem, h2 1.5rem, h3 1.25rem, h4 1rem) — presets tune
  weight and tracking, not size, in phase 1;
- focus ring: 2 px accent outline with 2 px offset, never removed; forced-colors
  fallbacks unchanged;
- semantic status colours (note, tip, important, warning, caution) keep their
  hue; presets change tint strength and frame;
- syntax highlighting keeps the existing light/dark Chroma palettes in phase 1;
- motion tokens 100/150/250 ms; `prefers-reduced-motion` disables transitions;
- WCAG AA: 4.5:1 body, 3:1 large text and UI boundaries, in both modes.

### Paper {#paper}

*Warm editorial minimalism.* Warm paper, ink text, quiet hairlines, soft
shadows, and generous but not loose reading rhythm. It serves long-form
reading: lower blue light on large canvases, less chrome contrast, and a
typeface (Plex Sans) with open counters that reads well at 16 px.

| Token | Light | Dark |
| --- | --- | --- |
| Canvas `--bs-body-bg` | `#f7f6f3` | `#161513` |
| Raised `--td-brand-elev`, `--td-pre-bg` | `#ffffff` | `#1f1e1a` / `#121110` |
| Secondary surface | `#efede8` | `#1f1e1a` |
| Body | `#21201c` (15.09:1) | `#ece9e3` |
| Secondary text | `#56534c` (7.10:1) | `#b6b1a7` |
| Tertiary text | `#6b665d` (5.27:1) | `#958f84` (5.68:1) |
| Border | ink 12 % | light ink 13 % |
| Link / hover | `#2b5f8c` (6.23:1) / `#1d68a5` (5.43:1) | `#7db5e6` (8.36:1) / `#a3cdf3` |
| Accent (copper) | `#9c5530` (5.17:1) | `#d99a6c` |
| Inline code | ink on ink-6 % chip | light ink on 8 % chip |
| Shadow sm / md | `0 2px 10px` / `0 14px 38px` ink 7 % / 13 % | black 35 % / 50 % |
| Radius | code 12 px, cards 12 px, controls 8 px | same |

Rules specific to Paper: headings Plex Sans 600 with −0.006em (h1 −0.012em);
h2 followed by an edge hairline; framed tables (radius 10, header band, no
zebra); callouts with a 4 % (dark 6 %) semantic wash and a single 3 px rule;
hairline blockquote; Landing without grid or glow, primary button from tokens
with a warm shadow, hero title 600 / −0.025em; selected navigation rows on a
warm neutral ground with 9 % (dark 12 %) accent mixed in. Links remain blue: a
reading convention, not decoration. Motion 160 ms ease-out for hover and
popovers; no movement on scroll.

### Slate {#slate}

*Technical minimalism.* The current OINK appearance, unchanged: cool blue-grey
canvas, navy ink, steel blue and copper, Inter body, Chakra Petch display,
Plex Mono labels and metadata, blueprint grid and hero glow, crimson inline
code, 8–12 px radii. Selecting `preset: slate` must reproduce `v1.1` token
values; a checker compares them. Grid, glow, Chakra display headings, mono
metadata and crimson inline code are Slate identity. Layout, focus, status
colours, and the shell structure are shared foundation.

### Ink {#ink}

*Typographic minimalism, Swiss-inspired information design.* Black, white and
neutral grey; one red accent; hierarchy carried by size, weight and alignment
rather than colour, shadow or rounded surfaces.

| Token | Light | Dark |
| --- | --- | --- |
| Canvas | `#ffffff` | `#0b0b0b` |
| Body | `#141414` | `#ededed` |
| Secondary / tertiary | `#474747` / `#636363` | `#b5b5b5` / `#8f8f8f` |
| Surface | `#f4f4f4` | `#161616` |
| Link | ink, underlined; hover red | light ink, underlined; hover red |
| Accent | `#c8102e` (5.88:1) | `#ff5c4d` |
| Radius / shadow | 0 / none | 0 / none |

Differences from Slate: no tinted canvas, no blue, no grid texture, no
shadows, no rounded corners; links are identified by underline, not hue;
headings use Inter 700–800 with tight tracking instead of Chakra Petch.
Differences from Paper: neutral not warm, flat not soft, ruled not hairline,
underline links not blue. Distinctive rules: 2 px black rule above h2; h1 800 /
−0.035em; uppercase tracked h4, table headers and callout titles; selected
navigation row marked by a 3 px red bar, not a fill; tabular numerals.

### Terminal {#terminal}

*Terminal-inspired utilitarian design.* Structure and information expression,
not CRT effects: monospaced chrome, command and path notation, compact
controls, strong panel borders, amber or teal accents.

| Token | Light | Dark |
| --- | --- | --- |
| Canvas | `#f4f5f2` | `#0c0f0e` |
| Body | `#1d211f` | `#d3dbd6` |
| Secondary | `#4a514d` | `#9aa59f` |
| Surface | `#e9ebe6` | `#141a18` |
| Link (teal) | `#0a6560` (6.31:1) | `#4cc9bd` |
| Accent (amber) | `#935400` (5.47:1) | `#f0a73a` |
| Radius | 2 px | 2 px |

Mono scope: navigation, headings, labels, metadata, breadcrumbs, buttons and
code use IBM Plex Mono. Prose paragraphs, lists and table bodies use Plex Sans
with platform CJK fallbacks, because long monospaced paragraphs and mixed CJK/Latin mono lines
read poorly. Distinctive rules: `## ` prefix before headings rendered with
`content: '## ' / ''` so assistive technology ignores it; bracketed callout
labels (`[NOTE]`); the selected navigation row is inverted with a `▸` marker;
1 px strong panel borders; static `▍` caret in the hero. No scanlines, glow,
blinking, or typing animation.

### Difference matrix {#difference-matrix}

| | Paper | Slate | Ink | Terminal |
| --- | --- | --- | --- | --- |
| Temperature | warm | cool | neutral | neutral-green |
| Canvas light | `#f7f6f3` | `#f1f4f8` | `#ffffff` | `#f4f5f2` |
| Canvas dark | `#161513` | `#0b1119` | `#0b0b0b` | `#0c0f0e` |
| Prose face | Plex Sans | Inter | Inter | Plex Sans |
| Heading face | Plex Sans 600 | Inter 600–700 | Inter 700–800 | Plex Mono |
| Display / wordmark | Plex Sans / Chakra | Chakra / Chakra | Inter / Inter | Plex Mono |
| Link signal | blue | steel blue | underline + red hover | teal |
| Accent | copper | copper | red | amber |
| Radius | 8–12 | 8–12 | 0 | 2 |
| Shadow | soft warm | navy-tinted | none | none |
| Section rule | h2 trailing hairline | none | 2 px top rule | `##` marker |
| Selected row | warm tint | accent tint | red bar | inverted + `▸` |
| Inline code | ink chip | crimson | ink chip | ink chip, bordered |
| Landing texture | none | grid + glow | none | none |
| Chrome density | standard | standard | standard | compact |

## Page density {#page-density}

Density follows the task, not the preset: the Landing hero allows the largest
display type and brand expression; Docs prose keeps 1rem / 1.7 and ≈ 76ch;
sidebar, TOC, parameter tables, search results and the command palette keep
compact rows (0.875rem, 1.4–1.5 line height). Presets may change paint inside
these zones but not their spacing in phase 1. Terminal's compact chrome is a
phase 2 density token.

## Runtime surfaces {#runtime-surfaces}

| Surface | Phase 1 impact |
| --- | --- |
| Blog, Book, taxonomy | Tokens only; Book captions keep the prose face |
| Search dialog and command palette | Scrim tokenized; selected row uses `--td-shell-primary-dim` |
| Mermaid, ECharts | Colours baked at init on `data-bs-theme`. Add a `data-td-preset` observer only if charts take preset colours; phase 1 keeps mode-only chart palettes |
| asciinema | Surface tokens; re-mount only if the code face changes (not in phase 1) |
| giscus | Needs one stylesheet per preset and mode, re-posted on `td-preset-change` |
| Swagger UI, ReDoc | Keep vendor styling and current light/dark handling |
| Print | Tokenize navy and cool greys; print always uses a light palette from the active preset |
| 404 | Its own `<html>` must carry the new attributes |

## Accessibility, security, and output {#boundaries}

- Every preset palette passes WCAG AA for body, secondary and tertiary text,
  links, and accents in both modes (values above). `theme_color` contrast
  warnings compute against the active site default preset's canvases.
- The menu uses native radios; no `role="menu"`. Focus is never trapped
  except in the mobile bottom sheet, which is modal and restores focus.
- `prefers-reduced-motion` and forced colors keep current behaviour.
- The init script is inline, static, and derived from validated configuration;
  the stored value is matched against a build-time allowlist before use.
- No external font or script request is added. Output adds two `<html>`
  attributes, one inline script, and CSS.

## Compatibility and migration {#compatibility-and-migration}

Changing the default to Paper changes every site that does not set `preset`.

- Sites that want the current look add `params.ui.preset: slate`; the upgrade
  note leads with this one line. Slate output must equal `v1.1` tokens.
- Sites with custom brand overrides in `_styles_project.scss`: light overrides
  on `:root` keep working under Paper by source order; dark overrides on
  `[data-bs-theme='dark']` are outranked by Paper's dark block. Such sites
  should choose Slate or move overrides to `[data-td-preset='paper'][data-bs-theme='dark']`.
  The upgrade note and brand guide document this.
- `theme_color`, `typography`, and `fonts` keep their meaning and precedence.
- Sites with `dark_mode: false` still get one light palette, now Paper.
- The release that changes the default must state it as a visible change.
  Whether that release is a minor (`1.x`) or major version is an open decision.
- A consumer inventory should report sites with brand overrides before the
  default change is published.

## Implementation plan {#implementation-plan}

Phase 1, in dependency order. Each step names its owning checker.

1. **Tokenize Slate leaks.** Landing primary button, grid, glow, scrims, print
   colours, asciinema surfaces; add `--td-preset-accent`, `brand` font role,
   and per-preset canvas luminance in `contrast-on-canvas.html`. Slate output
   must stay byte-for-byte equivalent in computed colour.
   Checkers: `check-landing.py`, `check-output.py`, `check-font-tokens.py`.
2. **Vendor IBM Plex Sans.** `third_party/`, `VENDOR.json`, licence file.
   Checker: `check-vendor.py`.
3. **Preset tokens.** New `assets/scss/td/_presets.scss` (imported after
   `_brand.scss`); the implementation keeps Paper in that file instead of a
   separate `presets/_paper.scss`. Place preset font roles before the `system`
   typography reset. Checkers: extend `check-font-tokens.py` (Plex Sans family,
   system block order, token parity between light and dark blocks).
4. **Configuration.** `hugo.yaml` defaults (`preset: paper`,
   `preset_menu: false`); a resolver partial used by `validate.html`,
   `document-attrs.html`, `layouts/404.html`, and `head.html` (init script,
   `theme-color`, pre-paint canvas). Regenerate the schema. Checkers:
   `check-params.py` (accepted, invalid, reserved), `generate-config-schema.py --check`,
   `check-namespace.py`.
5. **Appearance menu.** Shared partial used by `navbar.html`,
   `shell/footer-line.html`, and the Landing mobile drawer; `preset.js` runtime
   (or a section of `dark-mode.js`); `dark-mode.js` radio sync; palette action
   `switch_preset`; i18n strings in all 32 catalogs. Checkers: `check-shell.py`,
   `check-actions.py`, i18n checker, `tests/js/preset.test.js`,
   `tests/js/dark-mode.test.js`.
6. **Third-party surfaces.** Per-preset giscus stylesheets and re-post.
7. **Documentation.** EN/ZH architecture, shell and landing contracts; brand
   guide (presets, migration, fonts); configuration reference; changelog and
   upgrade note.
8. **Site validation.** `make -C ../oink.pgsty.com check`, `browser` (add
   preset switching, persistence, storage failure, no-JS, EN/ZH,
   desktop/mobile, light/dark cases), and `dev` for visual review.

## Acceptance criteria {#acceptance-criteria}

The following are the original acceptance targets. Executed checks and remaining
limits are recorded separately in the [October 5 acceptance record](/docs/design/research/2026-10-05-visual-presets-acceptance/):

- With no `preset` key, output carries `data-td-preset="paper"` and renders
  Paper with JavaScript disabled.
- `preset: slate` produces computed colours and font roles equal to `v1.1`
  across the checker fixtures.
- Switching style never changes `td-color-theme`; switching mode never changes
  `td-preset`; both survive navigation, reload, and language switch.
- Invalid stored values are removed; storage failure leaves the page usable
  and shows the non-persistence note.
- No first-paint flash between presets in Chromium, Firefox and WebKit at
  normal and throttled CPU.
- Scroll position after a switch stays within one line of the anchor.
- `typography: system` triggers no font request in any preset;
  `params.ui.fonts` overrides preset faces.
- `theme_color` overrides the accent in both modes under Paper and Slate.
- The menu is fully operable with keyboard, touch, and screen readers; axe
  reports no new violations.
- All palettes meet the contrast table in both modes.
- Presets add no external font or script dependency; explicitly configured
  services such as Giscus remain separate. `--panicOnWarning` builds pass.

## Open decisions {#open-decisions}

1. Resolved for phase 1: `preset_menu: false`; the docs site enables it.
2. Target resolved for release preparation: `1.2.0`, with a prominent Paper-default notice and the `preset: slate` compatibility setting. Published in 1.2.0.
3. Resolved for phase 1: the wordmark role is `brand`.
4. Whether a display-only serif becomes a Paper option after phase 1.
5. Whether charts (Mermaid, ECharts) should take preset colours in phase 2.

## Ink and Terminal backlog {#ink-terminal-backlog}

Implemented experimentally: both palettes, existing font roles, prose link and
selection signals, heading treatments, scoped geometry, compact Terminal
navigation, Giscus palettes, print and the existing switching mechanism. No new
font file, animation or runtime is added. See the
[experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/)
for actual output and verification.

Before stable promotion, review long-page red accent density and CJK underline
weight in Ink; numbered headings, mono wrapping and dense parameter tables in
Terminal; Windows/Android fallback faces and manual screen-reader speech.
Mermaid/ECharts and API vendors remain mode-only for this experiment. Wider
geometry/density tokens and preset-colored charts require a separate decision.

## Decision log {#decision-log}

| Date | Change |
| --- | --- |
| 2026-10-04 | Draft created with Paper/Slate phase-1 scope, Ink/Terminal research specs, Appearance menu choice, and token architecture |
| 2026-10-05 | Phase 1 implemented locally; defaults, brand role and mode-only chart scope accepted; release version undecided and no publication performed |
| 2026-10-05 | Subsequent explicit Ink/Terminal experiments implemented; stable menu policy retained; design acceptance remains open |
| 2026-10-05 | Release preparation targets 1.2.0; simplified Style/Light controls and current-state icons replace the earlier swatch proposal; no tag or deployment created |
