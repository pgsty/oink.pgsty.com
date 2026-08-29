---
title: Landing contract
linkTitle: Landing pages
description: The maintainer contract for landing data, the built-in section registry, language resolution, runtime, accessibility, and outputs.
weight: 40
icon: fa-solid fa-panorama
search_keywords: [OINK landing contract, landing sections, homepage data, progressive enhancement, landing outputs]
contract_status: released-v1.0.0
---

> [!IMPORTANT] OINK 1.0.0 contract
> This is the landing-page contract released with OINK 1.0.0. This page is the
> canonical English source; its Chinese peer is maintained beside it in
> `content/docs/design/`.

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

Narrative files may be language-specific. Shared fact fields resolve
`<field>_<exact language>` with `-` normalized to `_`, then
`<field>_<primary language>`, then the unsuffixed field. camelCase aliases are
not accepted. Narrative fields render inline or block Markdown through the
site's hooks; values reused as accessible names are plainified. Section copy is
site data; only theme controls use OINK i18n.

Interactive HTML sets `hasLanding`, which conditionally adds only `landing.js`.
The runtime reuses `OinkSurfaceCoordinator` and owns reveal, count-up, copy,
compact-menu, and theme-image enhancement. Server output remains complete
without JavaScript.

Marquee duplication is CSS-only; the duplicate is `aria-hidden` and `inert`,
and a localized checkbox persists pause without JS. Reduced motion disables
motion, forced colors preserves controls, and theme images follow the shared
theme event. The navbar mega panel and its `columns` parameter are retired: a
menu that still sets `columns` warns and keeps the single column. The compact menu uses real
links/buttons, traps no focus, and does not duplicate the desktop tree.

## Outputs and compatibility {#outputs-and-compatibility}

| Output | Contract |
| --- | --- |
| HTML | Full static sections plus progressive enhancement |
| Print | Static grids and content; controls removed |
| Markdown | Headings, prose, lists, tables, and code without theme classes |
| RSS | Landing sections omitted |

Non-HTML output sets no Landing flag or runtime. Root-relative links and assets
honor deployment subpaths; normal builds download no images.

Removed 0.4 component forms belong to the migration toolkit, not parallel
Landing implementations. OINK adds no pricing-period toggle, remote-fact API,
hotspot editor, visual builder, or second registry. Existing homepage data and
explicit custom section partials remain valid.
