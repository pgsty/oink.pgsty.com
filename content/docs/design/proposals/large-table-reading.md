---
title: Give large tables a reading viewport
linkTitle: Large-table reading
description: Draft requirements for an optional native table reader, preserving article context, semantics, and static outputs.
design_kind: proposal
design_status: draft
date: 2026-10-26
owner: OINK maintainers
---

> [!WARNING] Draft candidate; not implemented
> Owner: OINK maintainers. Date: 2026-10-26. This is a possible **1.4.0 direction**, not an accepted API or release commitment. Affected contracts: [Components](/docs/design/components/#steps-cards-fields-and-tables), [Architecture](/docs/design/architecture/#outputs-and-runtime), [Shell](/docs/design/shell/#search-actions-and-runtime), and [Migration](/docs/design/migration/). The public baseline remains v1.3.2. The external prototype is a concept, not a theme feature.

## Give the table space without shrinking text {#context}

Parameter tables, extension matrices, and version comparisons can exceed the normal article measure for different reasons. More columns need horizontal space; more rows need orientation; long descriptions need wrapping; merged headers need preserved associations. A hover magnifier does not address all four. The [dated research](/docs/design/research/2026-10-26-large-table-reading/) compares five documentation frameworks, three table libraries, and three reading modes using real consumer content.

The bounded concept measured 653–686px baseline table viewports at a 1440px desktop width, 1130px when widened inline, and 1358px in a dialog. At 390px, baseline and inline measured 358px, versus 374px in the dialog. Body text stayed 16px and code 14px. These are concept measurements, not complete-shell or user-study results. Desktop gains justify evaluating a dialog; mobile gains chiefly concern focus and controls, not a dramatically wider table.

## Choose a surface with a clear return path {#alternatives}

| Option | Benefit | Cost and proposed role |
| --- | --- | --- |
| Inline widening | Keeps prose, links, and browser search together; requires little interaction | Limited to article canvas and device width. Keep existing author layout controls as the first remedy. |
| Near-full viewport native `<dialog>` | Gives desktop tables most of the viewport and keeps a short return path | Requires focus, scrolling, node restoration, and print coordination. Recommended first experiment. It does not invoke the Fullscreen API. |
| Separate reading page | Can support a stable link, long sessions, and independent navigation | Adds route, source, translation, canonical-link, and output ownership. Defer until sharing or sustained comparison demands it. |

The separate action row above the table is rejected. Compare two compact entrances at the top-right table corner: **A**, a quiet expand icon that opens the reader directly; **B**, an ellipsis revealed on table hover or keyboard focus, opening a small action menu. Touch devices retain a visible corner control. Both preserve cell links, selection, and scrolling. Evaluate these two Paper prototypes before extending other presets or adding actions; the entrance is not yet selected.

## Start with reading, then earn data operations {#scope}

Phase one proposes explicit author opt-in, the reading dialog, comfortable spacing, optional compact padding and wrapping, a basic sticky header, and optional first-column pinning. A working marker name is **`.table-reader` (proposed, unimplemented)**; its spelling is an open decision, not usable configuration documentation. Enhance eligible native tables only. Do not infer eligibility from size, `.wide`, `.matrix`, or page type. Add no global setting or automatic library dependency.

Keep sorting, filtering, column hiding, pagination, virtualization, editing, and a separate reading route out of the initial scope. Version strings, units, nulls, and meaningful author order need explicit sorting semantics. Filtering and hidden columns change what readers can compare, copy, print, and find. Virtualization removes offscreen cells from the DOM and requires new browser-find, accessibility, and output strategies. Introduce these only after task or performance evidence; a 24-row sample cannot establish a virtualization threshold. TSV is a separately gated enhancement, not a prerequisite for the reader.

## Preserve the table through one open–close lifecycle {#interaction}

Opening first asks `OinkSurfaceCoordinator` to close other transient surfaces without restoring their focus. Allow one table reader at a time. Save the invoker, original parent/next sibling, article scroll position, and table-wrapper scroll offsets. Insert a stable placeholder that preserves article geometry. Move the original table once into the reader and restore that same node once on close; repeated initialization must not create nested wrappers or listeners.

Use `showModal()` and normal dialog close/cancel events. Keep a visible title and Close button outside the scrolling table area. Name the dialog with `aria-labelledby`; initially focus its static title with `tabindex="-1"`. Do not put `tabindex` on `<dialog>`. Tab/Shift+Tab remain in the modal; Escape closes it. Give the dual-axis viewport a distinct accessible name and keyboard focus. Do not summarize a complex table into a long `aria-describedby` string. These requirements follow the [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [HTML dialog model](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element).

On ordinary close, restore the node before restoring wrapper offsets and article position; return focus to the invoker without scrolling. If the invoker vanished, use a documented nearby heading fallback. A coordinated handoff suppresses focus return. Guard stale close events and exceptions so they cannot steal focus or strand the table. Preserve the reader's offsets during density or appearance changes, clamped to the new bounds. Reopening starts from the saved inline offsets; exact restoration takes precedence over smooth animation.

Use ordinary scrolling and selection, with no drag-to-pan, wheel zoom, scale transforms, or double-tap interception. Preserve browser text zoom and pinch zoom. Respect reduced motion; use dynamic viewport height, safe-area insets, and touch controls at least 44px high. Toolbar wrapping must leave Close reachable on narrow screens and with enlarged text.

## Keep semantics and visual roles intact {#semantics}

Preserve `caption`, `thead`, `th`, `scope`, `headers`, cell links, code, IDs, language, direction, and DOM order. Do not convert reading tables to ARIA grids. An ordinary caption travels with the table. A numbered Book table has an outer `figcaption`; derive a plain-text reader title from it without cloning its IDs, and temporarily associate an otherwise unnamed table with that local title, restoring the previous attribute state on close.

Moving preserves node identity and event state but changes ancestors. Scope reader styles to reproduce the owning table rules and inherited font roles; verify project styles rather than copying a frozen computed stylesheet. Cloning risks duplicate IDs, ambiguous `headers`, divergent interactive state, and duplicate browser-find results. Re-rendering data discards authored markup. Neither is the default escape hatch.

Preflight references: if authored `headers`, `aria-labelledby`, or `aria-describedby` depend on nodes outside the movable table, initially keep inline reading and explain why enhancement is unavailable unless that relationship has a validated handoff. Do not silently redirect authored references into an inert background. Same-document links to external footnotes or headings close and restore the reader before normal navigation, suppressing return focus so the destination remains reachable. Links within the table retain their targets.

| Content shape | Initial reading behavior |
| --- | --- |
| Many columns | One dual-axis scroll region; no page-level horizontal overflow or text shrinkage |
| Many rows | Sticky single-row header within that region; native rows remain present |
| Long cells | Comfortable wrapping; optional no-wrap for inspection; compact changes padding only |
| Multirow/merged headers | Preserve native associations and readable scrolling; disable reader sticky headers unless cumulative offsets are validated |
| Wide first column | Pinning is optional, initially off; disable when it would consume over 40% of the viewport, a proposed threshold requiring review |

Paper uses a quiet paper surface and restrained rules; Slate follows its existing rounded controls and borders. Ink uses flat surfaces and sharp separators. Terminal uses mono control chrome while retaining its existing prose/code font roles. All four inherit root preset and light/dark tokens; none receives a separate palette or smaller text. Ink/Terminal remain experimental. This proposal does not redesign their shared contracts.

## Define a bounded human-text copy contract {#tsv}

If delivered, **Copy TSV** copies the whole eligible table, including headers and rows/columns outside the current scroll viewport, in authored order. It copies rendered human text, not raw records or URLs. Links become labels; code characters remain text. Exclude hidden controls and decorative glyphs. Meaningful icon-only values need explicit localized text equivalents; reject copying if their meaning cannot be recovered. Do not infer support from icon shape or color.

Initially support only simple rectangular tables with one header row, equal cell counts, no nested tables, and every cell's DOM `rowSpan` and `colSpan` equal to 1. Reject any other value, explicitly including `rowspan="0"`, which spans the remaining rows of its row group. Tables with author-hidden data rows or columns are initially unsupported; never silently change the copy scope. Readable merged tables remain eligible for the reader; copy is visibly unavailable with a reason. Future rectangularization needs tested rules for repeated versus blank span coverage. Never silently flatten merges.

The proposed plain-text TSV profile separates cells with TAB and rows with LF, without a trailing row separator. Normalize CRLF/CR to LF; replace in-cell tabs and line breaks with spaces so they cannot create new cells or rows. Keep literal quotes unchanged; this profile does not use CSV quoting. Preserve other code characters and spacing, while explicitly documenting that multiline code whitespace is normalized. This is a convenience export, not a lossless source format.

Before serialization, detect a leading `=`, `+`, `-`, or `@` after leading whitespace/control characters and prefix the whole cell with an apostrophe. This intentionally changes negative-looking values and formulas into text. Quoting alone is not a formula defense. Spreadsheet importers differ; the prefix is risk reduction, not a universal safety guarantee. Verify intended Excel, LibreOffice, and Google Sheets paste paths before shipping. An explicit future raw-data or URL export requires its own contract.

Copy only after an explicit action using the Clipboard API. Announce success or failure through a polite status message. If secure-context support or permission is unavailable, expose the same normalized text in a labelled, selectable read-only field with manual-copy instructions; never announce success before completion. Propose a 1 MiB UTF-8 payload limit, pending measurement; above it, explain unavailability without truncation. The concept's Copy TSV control is unavailable and establishes none of these behaviors.

## Keep author markers and static outputs compatible {#compatibility}

`.wide` and `.td-table--wide` remain layout-only aliases; the short alias is local unreleased work beyond v1.3.2. `.full-width` continues to use the available article canvas. `.matrix` retains row-header semantics and its existing inline sticky behavior; the reader applies its separately validated sticky policy. `.fields` renders a definition list and is ineligible. Preserve existing classes, numbering, tabs, anchors, and project hooks without a content migration.

Without JavaScript, blocked assets, or dialog support, the original named scroll region stays readable and no dead reader control appears. Dedicated Print remains static, scrollable in its browser preview and expanded for print media. Markdown preserves authored tables/attributes; RSS keeps its existing static-content or summary boundary. Neither gains toolbar text or runtime. Browser printing while a reader is open must synchronously restore the original table before print layout, suppress transient controls, and leave it readable if printing is cancelled. Do not depend on asynchronous `beforeprint` work.

## Assign implementation and acceptance owners {#implementation}

If accepted, extend `oink/layouts/_partials/content/table-render.html` and `table-body.html` for HTML-only eligibility and names, with scoped table SCSS, localized labels, and a small capability-gated runtime. Reuse surface-coordinator conventions, not diagram image transforms. Keep Hugo Extended 0.168.0, Go 1.27.3, built-in LibSass, and ordinary Hugo-only builds. Record any actual dependency in `VENDOR.json`; none is proposed now.

`oink/bin/check-content-primitives.py` owns emitted table semantics, markers, diagnostics, and HTML/Print/Markdown/RSS boundaries. Runtime isolation and JS tests own capability loading, state transitions, failure cleanup, and copy serialization if included. The documentation site's existing readability/browser coverage owns real-content integration and visual review; add focused cases there without making `tests/site/` a public demonstration. Implementation acceptance runs the smallest theme checker, runtime tests, then sibling-site `make check`, `make browser`, and reviewed `make dev`. Keep warnings visible and update both affected contracts only with implementation. These are future implementation gates; current scoped research evidence belongs to the [dated report](/docs/design/research/2026-10-26-large-table-reading/).

## Require the same data across every comparison {#acceptance}

| Area | Required evidence before acceptance |
| --- | --- |
| Visual comparison | Same parameter/package/version data in baseline plus inline-wide, dialog, and separate-page concepts; Paper/Slate/Ink/Terminal × light/dark × desktop/mobile, with EN/ZH peers. Page mode remains research-only. |
| Geometry | Record viewport, scroll widths, computed text/code sizes; no whole-page overflow; no mobile width-gain claim unsupported by measurements |
| Input and focus | Enter/Space open, title focus, contained Tab cycle, Escape/Close return, missing invoker fallback, links, selection, touch and browser zoom |
| Lifecycle | Same DOM node and unique IDs after repeated open/close; exact inline/page scroll restoration; no stale-event focus theft or competing surfaces |
| Structure | Plain/numbered captions, row headers, multirow/spans, footnotes, external ARIA references, tabs/disclosures and project styling |
| Accessibility | Named dialog/region, unobscured focus, contrast, enlarged text, reduced motion, forced colors, screen-reader review and targeted axe in both languages |
| Degradation | No JS, failed assets, unsupported dialog, dedicated Print, open-dialog browser print/cancel, Markdown and RSS |
| Optional copy | Labels/code, icon values, tabs/newlines/quotes, formula prefixes, limits, denied clipboard, polite feedback and visibly unsupported spans |
| Compatibility/performance | Chromium/Firefox/WebKit and touch review; actual large-row measurements before adding grid features; record asset delta and loading scope |

## Leave product choices open until review {#decisions}

Open decisions are the opt-in spelling, first-column width threshold, copy payload bound, whether TSV meets the first release gate, literal-HTML eligibility, and whether a later shareable route has a demonstrated use case. The concept's 16 geometry cases and single Paper/light/desktop axe scan do not close these decisions or constitute accessibility certification.

Decision log, 2026-10-26: reject the above-table action row and narrow entrance review to two Paper corner prototypes. Defer other preset variants until an entrance is chosen. Retain the draft native-table dialog direction with unchanged text scale, explicit entry, one-node restoration, and static fallbacks. Keep inline widening available and the separate page as an evaluated alternative. No implementation, API acceptance, release, consumer adoption, or deployment is recorded. On acceptance, move behavior to the owning contracts and durable rationale to Decisions according to the [proposal lifecycle](/docs/design/proposals/#lifecycle).
