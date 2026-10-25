---
title: Unified diagram reading
description: Shared Mermaid and local PlantUML viewing, source export and demand loading.
design_kind: proposal
design_status: implemented-local
date: 2026-10-25
---

> [!WARNING] Implemented locally, awaiting maintainer review
> Owner: OINK maintainers. Date: 2026-10-25. Affected contracts: Components,
> Architecture and browser printing. The public baseline remains v1.3.2.

## Context {#context}

Mermaid already has a pan/zoom dialog but loads its engine at page startup and
renders a second SVG for the dialog. Local PlantUML loads both engines at startup
and offers only horizontal scrolling. Both preserve authored source.

## Scope {#scope}

Share the existing dialog and styles, source viewing/copy, and standalone SVG
download. Defer large engines and rendering until a diagram is within 320px of
the viewport. Do not change pinned libraries, server-mode PlantUML, other diagram
families, the CLI, or ordinary consumers' Hugo-only build requirements.

## Behavior and boundaries {#behavior}

One lightweight scheduler serializes both engines on the main thread. Each engine
loads once. Hidden or zero-width containers wait until visible. Theme changes
invalidate old results; the open viewer retains its reading position. The viewer
reuses a rendered snapshot, supports touch pan/pinch, wheel and keyboard controls,
fit, Escape, focus restoration and reduced motion. Source is available even after
an error. Copy and export report failure, and downloads report initiation only.

PlantUML stays in Blob images; its SVG is never inserted into the live DOM. SVG
exports embed their styling, remove active content and reject external resource
dependencies. No includes, themes or optional libraries are downloaded. Browser
printing shows a rendered diagram or readable source synchronously; it cannot wait
for an asynchronous engine in `beforeprint`. Dedicated Print, Markdown and RSS
retain their existing source fallback.

## Compatibility {#compatibility}

No configuration or build step is added. Local PlantUML remains opt-in; explicit
endpoints retain the legacy renderer. Without IntersectionObserver, bounded
scroll/resize checks perform the same visibility test. Source survives disabled
JavaScript and blocked assets. No background-worker claim is made.

## Implementation and acceptance {#acceptance}

Extract shared scheduling and viewing from `assets/js/mermaid.js`; retain engine
adapters and the existing dialog partial. Update focused output checkers, runtime
tests, real EN/ZH documentation and browser tests. Verify multiple and wide
diagrams, hidden tabs/disclosures, rapid themes, errors, blocked resources,
source fidelity, standalone exports, touch, keyboard, accessibility and printing.
Compare requests before/after. Keep logs and previews outside Git.

## Decision log {#decisions}

- 2026-10-25: Initial bounded design. Main-thread serialization and Blob isolation
  are retained. Immediate browser printing uses source for unrendered figures.
  Local implementation and focused browser acceptance are complete; broader site
  validation is recorded with the delivery evidence. No public release is implied.
