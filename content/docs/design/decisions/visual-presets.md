---
title: Paper and Slate visual presets
linkTitle: Visual presets
description: Accepted phase-one visual identity and appearance controls, with separate reader style and mode state.
weight: 50
icon: fa-solid fa-palette
design_kind: decision
design_status: accepted
decision_date: 2026-10-05
---

> [!IMPORTANT] Local, unreleased implementation
> This decision accepts phase 1. It does not publish a release, upgrade a
> consumer, or implement Ink and Terminal.

## Decision {#decision}

Paper is the default, with warm paper/ink colors, blue links, IBM Plex Sans,
heading hairlines and framed tables. Slate retains the v1.1.0 palette,
Inter/Chakra/Plex Mono roles and Landing grid/glow. This gives reading sites a
quieter default while preserving an explicit compatibility choice. The cost is
a visible default change: existing sites can set `params.ui.preset: slate`.
No release-version decision is made here.

The reader menu is opt-in (`preset_menu: false`). The docs site enables it.
One Appearance disclosure combines native Style and Mode radio groups;
mobile uses a modal dialog in the browser top layer. It is reachable by touch
and keyboard without relying on hover. The cost is replacing the old one-click
mode toggle with a selection panel; the `t` shortcut still toggles mode.

Style and mode use separate attributes and storage keys. Choosing the site
Default clears the style key. Hugo renders the default without JavaScript;
an allowlisted inline script restores reader state before CSS. This prevents
the common initial preset mismatch, while keeping blocked storage usable.
Both presets ship in one stylesheet, at the cost of additional CSS bytes.

`brand` separates the wordmark from display headings. Paper adds the local
OFL IBM Plex Sans variable font, including normal/italic and the six supported
small writing-system subsets. Font files download on use; system typography
and explicit role overrides retain priority. Chinese uses the system stack.
Phase 1 includes no serif face and no external font request.

Page task determines density: Landing keeps display scale, long articles keep
their reading measure, and navigation/configuration tables remain compact.
No global spacing increase, new shell, or geometry abstraction is introduced.
Giscus and print follow the preset; API vendors and charts retain their current
mode-only behavior. This keeps the first implementation bounded.

## Later work {#later-work}

A subsequent October 5 experiment implements Ink and Terminal behind explicit
configuration; see the [experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/).
They are not stable defaults. `preset_menu: true` offers Paper/Slate and the site
default; an explicit list can expose either experiment. The menu uses the same
compact icon-and-name buttons for all four, without experiment badges.
This gives reviewers actual theme output without changing ordinary menu choices.
The cost is additional scoped CSS and a larger menu when experiments are enabled.

The experiment uses owned component rules for square/2 px geometry and compact
desktop navigation instead of introducing a global density framework. It reuses
existing local fonts, state handling and accessibility controls. Charts and API
vendors stay mode-only; comment palettes and print follow the experiments.
Remaining work is visual acceptance, wider device review and any decision to
promote them into the stable set.

## Evidence {#evidence}

The [architecture contract](/docs/design/architecture/#visual-presets) and
[shell contract](/docs/design/shell/#appearance-control) own behavior.
`check-presets.py` owns token parity, AA palette checks, the frozen Slate
v1.1.0 palette and strict configuration output. Font, parameter, vendor,
namespace, action and runtime checkers retain their existing ownership.
The documentation site's `appearance.spec.mjs` tests real output; the
[dated acceptance record](/docs/design/research/2026-10-05-visual-presets-acceptance/)
distinguishes executed checks from remaining experiments.
