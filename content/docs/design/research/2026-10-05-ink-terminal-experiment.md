---
title: Ink and Terminal experiment, 2026-10-05
linkTitle: Ink / Terminal experiment
description: Explicit experimental presets in real theme output, their design tradeoffs, checks and remaining work.
weight: 14
icon: fa-solid fa-flask
design_kind: research
design_status: local-verification
research_date: 2026-10-05
---

> [!IMPORTANT] Local experiment, not a release
> Ink and Terminal now compile into the actual theme stylesheet and use the
> existing Appearance control. These are not injected screenshot styles.
> They remain explicitly enabled experiments, pending design acceptance.

## Inputs and method {#inputs}

This extends the [Paper/Slate implementation](/docs/design/research/2026-10-05-visual-presets-acceptance/)
on the October 5 working trees. Tools: Hugo Extended 0.166.0, Go 1.27.1,
Node 26.9.0 and Playwright 1.62.1 on macOS ARM64. The documentation site's
local sibling-theme build is the integration surface; its published pin remains
v1.1.0. This is not compatibility-floor, pinned-CI-toolchain or hosted acceptance.

The same Home, configuration, callout and tab content is compared across four
presets, EN/ZH, 390/1440 px and light/dark mode. Checks inspect real rendered
fonts, overflow, appearance controls and local font requests. Further component
checks cover code, parameter fields, Blog, Book, API, Mermaid, ECharts, search
and print. API vendor DOM is excluded from axe under the site's existing policy.

## Design choices {#design-choices}

| Choice | Improvement | Cost / limit |
| --- | --- | --- |
| Ink: black/white canvas, Inter, red markers, underlined prose links, strong heading rules | Clear hierarchy and link affordance with little decoration | Heavier headings and repeated rules need long-page editorial review |
| Terminal: mono controls/headings, sans prose/tables, teal links and amber emphasis | A recognizable technical interface while retaining paragraph readability | Long Latin navigation labels wrap sooner; CJK uses platform fallback faces |
| Square Ink geometry, 2 px Terminal geometry, no component shadows | Visibly different surfaces using the same content and layout | Scoped component rules add CSS; this is not a global spacing/radius API |
| Compact Terminal desktop navigation only | More useful navigation rows without shrinking article text | Density is a preset decision, not a new reader preference |
| Existing local fonts and state handling | No new font files, external font service, framework or persistence mechanism | All preset CSS remains in one stylesheet |
| Explicit experimental menu entries | Reviewers can switch immediately without changing ordinary menu choices | Four cards make the enabled menu taller |

Ink uses `#ffffff` / `#0b0b0b` canvases, `#141414` / `#ededed` text and
`#c8102e` / `#ff5c4d` accent. Terminal uses `#f4f5f2` / `#0c0f0e` canvases,
`#1d211f` / `#d3dbd6` text, `#0a6560` / `#4cc9bd` links and
`#935400` / `#f0a73a` accent. Site/section accent overrides still win.
Terminal's heading markers use empty accessible alternatives; unsupported
engines omit them. Its hero cursor is a static shape, with no typing, blinking,
scanlines or glow.

## Try it {#try-it}

```yaml
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    dark_mode: true
```

The local docs site enables this list. Select Ink or Terminal in Appearance,
then choose light, dark or system independently. Following the October 5 menu
revision, all four options use icon-and-name buttons without experiment badges.
A site may set either as `preset` without enabling reader choice.
`preset_menu: true` remains Paper/Slate plus the site default; it does not
include every experiment. Selecting the site's default preset clears the saved preset.
Font overrides, system typography and pre-CSS initialization use the same
contracts as Paper/Slate.

## Verification {#verification}

| Executed check | Result and scope |
| --- | --- |
| `check-presets.py` | AA text/link/accent contrast on three surfaces, light/dark token parity, advisory canvas luminance, frozen Slate v1.1.0 palette; seven strict builds and 28 document roots |
| Theme checks | Parameters, font roles, 32 catalogs with 205 keys, generated schemas, component/output contracts, runtime isolation and namespace passed; 52 existing output goldens unchanged |
| Runtime tests | 49 Node tests passed |
| `make check` | 57 non-browser tests passed; EN/ZH coverage 142/142, Markdown, rendered content and internal links checked |
| Standard browser suites | Eight suites passed 170 tests; the appearance suite passed all 49 after fixing the default-Terminal build issue below. The nine suites total 219 checks; this records the initial run plus the focused rerun, not one uninterrupted successful `make browser` invocation |
| Appearance coverage | Four presets × EN/ZH × 390/1440 px × light/dark on Home, configuration, callouts and tabs; local font requests and menu axe checks; state, keyboard, print and Giscus asset checks; four experiment/mode checks over 11 page types plus search, and shared Mermaid contrast |
| Font/configuration builds | Actual docs site rebuilt with Terminal as default: system fonts with/without explicit overrides, plus explicit technical-font overrides; all three passed |
| Browser engines | Six checks passed on Chromium, Firefox and WebKit at 390/1440 px, including pre-CSS state, keyboard selection through Ink/Terminal, persistence and focus return; desktop Chromium also used 4× CPU throttling |
| Visual review | 96 actual-output viewport captures; representative Home, Docs and mobile menu images inspected. The local comparison gallery selects content, language, size and mode without injecting styles |

The standard sitemap axe pass used 15 routes: EN/ZH Home, configuration,
callouts, tabs and OpenAPI; English search, Mermaid, ECharts, Blog and
`/book/04-design/`. The existing responsive axe matrix also ran. This was not
an exhaustive sitemap scan. Standard browser checks used the established
4173 fixture server; the engine gate used the identified sibling-theme dev
server at port 1313. No external font request was observed in the appearance matrix.

The first default-Terminal font build found an omitted entry in the advisory
canvas-luminance map, causing false accent-contrast warnings. Both experimental
canvases now participate, with checker assertions and authored-accent fixtures.
Only the affected appearance suite was rerun after this correction. The added
research index entry and updated proposal description were reviewed before
refreshing the corresponding two changes in the LLMS golden.

The experiment exposed two new styling faults: the global underline suppression
hid Ink's links, and Terminal's selected search row retained dim summary text.
Both received scoped fixes. A separate inherited Mermaid dark-label pair
(`#cccccc` on `#585858`, 4.43:1) reproduced in Paper and Slate. The shared
mode-only default label background is now `#404040`; authored Mermaid values
retain priority. This does not introduce preset-specific chart palettes.

## Remaining work {#remaining-work}

Before stable promotion, review the look on real Windows and Android devices,
including CJK fallback faces, underlines, mono heading wraps and long parameter
tables. Manual screen-reader speech and first-paint filmstrips remain unverified.
CSS initialization-order checks are not a guarantee about every painted frame.

Mermaid/ECharts keep mode-only palettes, API widgets keep vendor styling, and
Giscus coverage checks generated palette assets rather than the remote iframe.
The experiment does not introduce a complete geometry/density token framework.
The decision to promote Ink/Terminal or redesign chart palettes remains open.
No commit, push, release, consumer upgrade or deployment is part of this record.
