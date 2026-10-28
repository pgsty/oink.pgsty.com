---
title: Explicit table reading
linkTitle: Table reading
description: Separate technical table layout from an optional corner action for reading in a larger viewport.
weight: 66
design_kind: decision
design_status: accepted
decision_date: 2026-10-26
aliases:
  - /docs/design/proposals/large-table-reading/
---

> [!NOTE] Accepted in OINK 1.4.0
> This decision records the released `.expand` table-reader behavior.

The [component contract](/docs/design/components/#table-reading) defines the behavior. The [table guide](/docs/components/table/#expand) gives author syntax; the [dated research](/docs/design/research/2026-10-26-large-table-reading/) retains the earlier comparisons.

## Context {#context}

Most documentation tables fit ordinary reading. A few package, parameter, or compatibility tables benefit from more room. A toolbar above every table adds visual weight to an occasional task. The reviewed prototypes compared a corner expand action and a hover-revealed ellipsis menu.

## Decision {#decision}

Use `.expand` to opt individual Markdown tables into a native reading dialog. `.wide` controls intrinsic table sizing independently; `{.wide .expand}` combines both. Do not infer expansion from size, column count, or `.wide`, and do not add a site-wide switch.

A single expand action needs one click. Place it at the top-right corner, revealing it on desktop hover or keyboard focus and keeping it visible on touch devices. The visible icon stays small; its touch target is at least 44px. Do not add an above-table toolbar or a one-item ellipsis menu.

Move the original table and its scroll wrapper into one modal dialog; preserve text size, native semantics, links, selection, and authored order. Restore that same node, inline scroll offsets, page position, and entry focus on close. Numbered captions supply the dialog title without duplicating IDs. Restore the table synchronously before browser printing. Without JavaScript or dialog support, readers retain the original inline table.

## Boundaries {#boundaries}

This delivery has no sorting, filtering, TSV export, density/wrapping switches, new column-pinning controls, virtualization, separate reading route, or Fullscreen API. Existing `.matrix` semantics remain available. Only theme-rendered Markdown tables opt in; `.fields` warns and ignores `.expand`. Tables with external `headers` or ARIA references stay inline because the modal makes their external targets inert. Custom ancestor-dependent styles need review when a table moves to the dialog.

The dialog inherits existing preset and light/dark tokens. Paper is the reviewed entrance design; other presets receive compatibility checks rather than new visual variants. Mobile reading still uses horizontal scrolling when the data is wider than the viewport.

## Ownership and validation {#validation}

The theme owns table rendering, the capability-gated runtime, localization, and scoped SCSS. `bin/check-content-primitives.py` covers opt-in, invalid combinations, localization, and static outputs. The documentation site's `tests/browser/table-reader.spec.mjs` owns keyboard, touch, links, selection, focus/scroll restoration, printing, failures, and accessibility checks. Runtime checks and both site Make suites remain delivery gates.

The original draft is retired from active proposals and retained in Git history. The research describes dated experiments, including features intentionally excluded here.
