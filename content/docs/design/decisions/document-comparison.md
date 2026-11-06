---
title: Translation comparison
linkTitle: Translation comparison
description: Compare a page with an existing same-origin translation in a two-pane reader that loads only when asked.
weight: 70
design_kind: decision
design_status: accepted
decision_date: 2026-11-04
aliases:
  - /docs/design/proposals/document-comparison/
---

> [!NOTE] Accepted in OINK 1.5.0
> This decision records the released `params.ui.compare` translation reader.

The [shell contract](/docs/design/shell/#translation-comparison) defines the reader and its controls. The [architecture contract](/docs/design/architecture/#translation-reader-runtime) defines the browser boundary. The [multilingual guide](/docs/customize/i18n/#bilingual-view) gives site setup; the [dated research](/docs/design/research/2026-10-29-document-comparison/) retains the earlier source review.

## Context {#context}

Translated documentation is often read and reviewed side by side. Without built-in support, readers had to open two browser tabs and scroll each one manually. Generating a dedicated layout or prebuilt language-pair pages at build time would multiply the output tree and duplicate content. Because OINK sites already publish each translation as a standard HTML page with aligned heading IDs, a lightweight reader can pair those existing pages directly in the browser.

## Decision {#decision}

A single boolean parameter, `params.ui.compare` (default `false`), enables comparison. Hugo lists only published, same-origin HTML translations of Docs, Book, and blog pages. Drafts, non-HTML output formats, external hosts, and the language-home navigation fallback never qualify. Neither do translations whose build policy writes no HTML (`build.render: link` or `never`, set directly or by cascade), nor blog archive pages after the first, which have no counterpart. Any language that sets `compare: false` under `languages.<lang>.params.ui` is excluded as both a host page and a comparison target. Authors do not need to add front matter, custom layouts, or extra output formats.

The reader loads on demand: from an icon button beside the page actions, via the `B` keyboard shortcut when keyboard navigation is enabled (pressing it again closes the reader), or through the Command Palette action `compare_translations`. It opens two existing HTML pages inside same-origin frames within a modal dialog. The current page stays on the reading-start side, so right-to-left host pages mirror the pane order. Across the UI, the feature uses a single name: **Duo View**, with the trigger labelled **Open duo view** (it shipped in 1.5.0 as Bilingual View; see [Revisions](#revisions)).

The **Sync Scroll** switch matches shared visible heading IDs and interpolates smoothly between them. Partial matches use the available anchors; when two pages share no headings, the reader falls back to overall document progress. An orange exclamation mark beside the switch explains either case. Matched headings that cannot scroll to the reading line do not count as a mismatch. Duplicate or out-of-order heading IDs disable synchronization while leaving both panes independently scrollable. Clicking **Close**, pressing `Escape` or `B`, or navigating **Back** restores the host page's scroll position and focus. Reloading an open reader or returning to its history entry reopens the view in place so a single **Back** step still closes it.

On viewports narrower than 900 CSS pixels, the reader displays one retained pane at a time beneath a compact toolbar row and a language switcher bar (which also holds the target-language menu). At 320 × 256 CSS pixels (roughly 400% zoom), at least 160 CSS pixels of vertical reading space remain visible.

Pane documents suppress shell navigation runtimes, search, comments, and theme-managed analytics. When `params.ui.compare` is enabled, the theme renders Google Analytics through its own pane-aware template so pane loads are not counted as separate page views; a site's local override of Hugo's `google_analytics.html` partial is not used. Custom scripts in head hooks can check `window.OinkComparePane`.

## Boundaries {#boundaries}

This release does not include cross-version diffing, manual page-pair maps, paragraph-by-paragraph row locking, text diffs, or cross-origin targets. Panes require `frame-src 'self'` and same-origin framing: `X-Frame-Options: DENY` or `frame-ancestors 'none'` blocks frame loading and falls back to a direct link. While open, the host page and its two panes exist as three live documents; nothing extra is fetched until the reader opens.

## Ownership and validation {#validation}

The theme owns discovery, the lazy entry and reader runtimes, the 32 interface catalogs, and scoped SCSS. `bin/check-compare.py` covers discovery, Docs, Book and blog pages, the per-language opt-out, keyboard hints, analytics, output isolation, and how every runtime behaves inside a pane. `tests/js/compare-scroll.test.js` covers scroll geometry. The documentation site's `test:compare` suite owns sync, lifecycle, reload, narrow and zoomed layouts, right-to-left order, eight languages, failures, and accessibility.

## Revisions {#revisions}

- **v1.5.1 (2026-11-06):** The interface name changed from Bilingual View to Duo View (Chinese 双列视图). The reader sets any two pages side by side, including same-language script pairs such as Simplified and Traditional Chinese, so a short name for the two-pane layout fits better than one about two languages; each locale uses its own concise equivalent. The entry, Command Palette action, title and help panel follow; the parameter and action ID are unchanged. `B` now toggles between the page and the reader, and scroll keys work as soon as it opens. The last chosen target language and Sync setting are remembered in the browser, and a reload or back/forward restore also brings back the visible pane and both reading positions. Sync Scroll became a switch. Its warning became an orange exclamation mark without a badge, with a note on hover, focus or tap that distinguishes a partial match from overall-progress sync. A matched heading that merely cannot reach the reading line no longer reports a mismatch; when no shared heading can anchor the map at all, the note says that sync follows overall reading progress.

The proposal draft is retired from active proposals and retained in Git history.
