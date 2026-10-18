---
title: Landing contract
linkTitle: Landing pages
description: The maintainer contract for landing data, the built-in section registry, language resolution, runtime, accessibility, and outputs.
weight: 40
icon: fa-solid fa-panorama
search_keywords: [OINK landing contract, landing sections, homepage data, progressive enhancement, landing outputs]
contract_status: v1.3.2
---

> [!NOTE] OINK 1.3.2 contract
> This contract describes OINK v1.3.2. Theme development uses the sibling
> checkout; release acceptance verifies the published module with replacements
> and workspaces disabled. Consumer adoption and deployment have their own checks.

Shared rules live in the [architecture](/docs/design/architecture/) and
[component](/docs/design/components/) contracts; migration belongs in the
[migration contract](/docs/design/migration/).

## Shell and data {#shell-and-data}

Any regular page may declare `layout: landing`. It renders navbar, full-width
canvas, and footer without docs sidebars or TOC rails. The homepage keeps
`data/home/<lang>.yaml` as a compatible authoring path through the same renderer.

A non-home page resolves `sections` from inline front matter,
`data/landing/<key>/<lang>.yaml`, an exact-language entry in one
`data/landing/<key>.yaml`, then English or unsuffixed local data. Landing never
fetches mutable facts; stars, prices, screenshots, and avatars are committed or
generated before Hugo runs.

`params.ui.landing_search` defaults to true and enables the existing local
Palette only when `offline_search` is enabled. `params.ui.github_stars` and
`params.ui.alt_site` are optional local chrome facts.

## Section registry {#section-registry}

The registry has exactly 22 built-ins:

- `hero`, `metrics`, `capabilities`, `principles`, `cards`, `logo-wall`,
  `gallery`, `testimonials`, `contributors`, `faq`, `markdown`, `cta`;
- `pricing`, `pricing-compare`, `command-box`, `steps`, `timeline`,
  `code-plate`, `preview`, `case-study`, `download`, `bar-chart`.

An entry is a type string or a map with `type`, `key`, `id`, `enabled`, inline
`data`, or a deliberate local `partial`. Authors provide unique IDs; OINK
normalizes them to anchor-safe values. Unknown types follow the shared
warn-and-safe-fallback policy; they never vanish silently, and
`--panicOnWarning` rejects them at publication. `landing/` partials own
built-ins; removed `home/` partial names are not an API.

`preview` places Markdown `source` beside `RenderString` output through the
site's hooks, so its content registers the same runtimes as docs content. The
source pane uses Chroma and a `file` name, default `page.md`. Markdown output
uses a four-backtick `markdown` fence; RSS omits it. Pane labels are theme i18n.

`hero.align` is `start` or `center`. Center is text-only; combining it with an
image warns and falls back to `start`, preserving the image. `download`
consumes the same `data/download/<key>.yaml` schema as the shortcode and
introduces no second channel, version, publication, or interpolation model.

## Language, runtime, and accessibility {#language-runtime-and-accessibility}

Narrative files may be language-specific.
Shared fact fields resolve `<field>_<exact language>`, with `-` converted to `_`, then `<field>_<primary language>`, then the unsuffixed field.
camelCase aliases are not accepted.
Narrative fields use site hooks to render inline or block Markdown. Values reused as accessible names become plain text.
Section text is site data. Only theme controls use OINK i18n.

Each built-in Markdown render has a stable section, item, and field scope.
Repeated bodies and marquee copies therefore get distinct generated code IDs,
including their copy controls, titles, viewports, and line links. The scope does
not depend on render order or output order. Explicit code IDs remain unchanged;
repeating one in the assembled Landing output warns and fails a strict build.
Custom partials that reuse the Markdown helpers should pass a distinct stable
`scope` for each rendered position.

Block Markdown bodies use the shared `.td-content` component scope and register
the runtimes their rendered content needs. Code folding, tables, images, and
other content primitives retain their normal styles inside a Landing section.
This scope belongs to the body, not the surrounding marketing headings or grid.

Interactive HTML sets `hasLanding`, which conditionally adds only `landing.js`.
The runtime uses `OinkSurfaceCoordinator` for reveal, count-up, copy, compact-menu, and theme-image enhancements.
Server output stays complete without JavaScript or if the Landing script fails to load.
Reveal candidates are initially visible; only an installed observer may mark one as pending entrance animation.
The server renders metrics with configured number formatting, prefixes, and suffixes, and the count-up's final frame uses the same display.

Landing code plates accept keyboard focus in interactive HTML, including
`capabilities` code visuals and `code-plate` line lists. Readers can tab to long
lines and scroll them with arrow keys without relying on a browser's implicit
scroll-container focus behavior. Static Print output adds no focus target to
these line-based renderers.

Marquee duplication uses only CSS. The duplicate is `aria-hidden` and `inert`.
A localized checkbox preserves pause state without JS.
Reduced motion disables animation. Forced colors preserve controls. Theme images follow the shared theme event.
The navbar mega panel and `columns` menu parameter are retired.
Menus with `columns` warn and keep one column.
Compact menus use real links and buttons, trap no focus, and do not duplicate the desktop tree.

## Outputs and compatibility {#outputs-and-compatibility}

| Output | Contract |
| --- | --- |
| HTML | Full static sections plus progressive enhancement |
| Print | Static grids and content; controls removed |
| Markdown | Headings, prose, lists, tables, and code without theme classes |
| RSS | Valid RSS document when configured; Landing sections omitted |

Non-HTML outputs set no Landing flag and load no Landing runtime.
An enabled RSS output uses the shared feed renderer and matches the feed URL
advertised in the HTML head. Section and home feeds keep ordinary child-page
summaries; an explicitly enabled regular-page feed may have an empty channel.
Omitting Landing sections never means emitting an empty file or advertising a
missing feed.
Root-relative links and assets honor deployment subpaths. Normal builds download no images.

Removed 0.4 forms belong to the migration toolkit, not parallel Landing implementations.
OINK adds no pricing-period toggle, remote-fact API, hotspot editor, visual builder, or second registry.
Existing homepage data and explicit custom section partials remain valid.

## Visual presets {#visual-presets}

Paper removes the hero grid and glow, uses warm shadows, Plex Sans display
headings, and a link-colored primary action. Slate retains its technical grid,
glow, Chakra Petch headings, and original primary-action colors. Shared section
geometry and density remain unchanged. The mobile drawer includes the shared
Appearance sheet; see the [shell contract](/docs/design/shell/#appearance-control).

The explicit Ink/Terminal experiments also remove the grid, glow and shadows.
Ink uses heavy Inter headings, square cards and a red primary action. Terminal
uses mono headings, 2 px corners and an amber primary action with a static
cursor-shaped decoration. Neither adds animation or changes section columns.
