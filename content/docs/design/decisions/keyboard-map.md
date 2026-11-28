---
title: Keyboard map
linkTitle: Keyboard map
description: Record why OINK binds twenty-nine single-key shortcuts in three groups, dims what a page cannot run, and adds local history, fold-all, and a reader width.
weight: 72
icon: fa-solid fa-keyboard
design_kind: decision
design_status: accepted
decision_date: 2026-11-27
---

> [!NOTE] Accepted in OINK 1.7.0
> This keyboard map, local history, fold-all, reader width, and reader shortcut switch ship in OINK v1.7.0.

The [Shell contract](/docs/design/shell/#keyboard-shortcuts) defines the
required bindings, hooks, and storage. The
[keyboard guide](/docs/customize/keyboard/) explains them to readers.

## Context {#context}

Shortcuts had grown one feature at a time. Several keys carried two meanings
or an alias (`l` and `y` for language, `g` beside Enter in the tree, `n` only
on the home page), the help sheet split into two
uneven columns, and frequent page actions such as editing, printing, or
handing a page to an assistant had no key at all. Readers also asked for three
capabilities the theme lacked: returning to recently read pages, opening every
folded block at once, and using spare width on large screens.

## Decisions {#decisions}

### Three groups {#three-groups}

The project owner set the map on 2026-11-27: ten shortcuts for navigation,
nine for actions on the page, and ten for the view, each a bare key with one
meaning.
The help sheet shows the same three columns in the same order, so the sheet
doubles as a keyboard diagram. Neighboring keys share a purpose: `w` `a` `s`
`d` for the tree, `q` `e` for paging, `/` `\` for search and commands, `[` `]`
for ChatGPT and Claude, `,` `.` for image size, `-` `=` for width.

| Change | Reason |
| --- | --- |
| Retired 1.6.0 bindings (`h` Zen → `z`, `l`/`y` language → `x`, `g` tree open, home `n`) | Each letter is needed for its own feature; one key per action keeps the sheet honest |
| Commands stay on `\` (with `c`) | Mirrors `/` for search and stays consistent with earlier OINK releases; Gemini is omitted because it has no prompt URL parameter |
| Help is `'` | `'` sits beside `;`, which cycles gallery layouts next to `l` for index layouts |
| `m` opens Markdown | Duo View, Zen Mode, and Markdown form one row of reading views: `b`, `z`, `m` |

`?` and the digits stay unbound, and modifiers suppress every binding except
`Shift` when it produces `,` `.` `;` `<` `>` `=` or `+`, so browser and assistive-technology shortcuts
keep their keys. Readers can also turn off all single-key shortcuts for
themselves in the help sheet (`td-single-key-shortcuts:<basePath>`), keeping
`Cmd/Ctrl+K` and `Escape` active.

### Dim, do not hide {#dim-not-hide}

Rows a page cannot run stay in the sheet, dimmed and announced as unavailable,
instead of disappearing. Hiding them made the sheet change shape from page to
page and taught readers nothing about where a feature does exist. The sheet is
one cached template per language; availability is decided in the browser each
time the dialog opens, because it depends on live state such as a visible
gallery or an open drawer.

### Full sheet on hover, modal dialog on click {#hint-and-sheet}

Hovering or focusing the bottom-bar `?` button reveals the full three-group
cheat sheet above the footer (three columns side by side on wide screens,
wrapping cleanly on narrower screens), with unavailable rows already dimmed for
the current page. Clicking `?` (or pressing `'`) opens the same sheet as a
centered modal dialog with the **Enable shortcuts** toggle.

### History stays in the browser {#local-history}

`h` lists recently read pages from `localStorage`, newest first, without the
current page, so `h` then Enter means "back to the previous page". The list is
keyed by the site's base path so that two sites on one domain never mix, is
capped at 100 entries, accepts only same-site paths, and can be pruned entry by
entry or cleared. It is never transmitted, and it exists only where keyboard
navigation is on, so a site that turns shortcuts off records nothing.

### Fold everything, keep your place {#fold-all}

`o` treats every disclosure as one set: sidebar and right-rail groups,
`<details>`, and shortened code blocks. Anything folded means "expand all";
otherwise it collapses all. Collapsing keeps the current page's branch open,
the rule the sidebar already applies to persisted state, and the line being
read stays put while content above it changes height. Popover menus and rail
visibility are excluded: they are transient surfaces or layout, not content.

### A reader width with a way back {#reader-width}

`-` and `=` move the reading column in 100 px steps between 600 px and the
space between the rails, and the choice applies site-wide in this browser.
Reaching the rails stores "fill" rather than a pixel count, so a larger screen
still fills. A step that reaches the page's own width stops there and forgets
the stored value, which restores every page's authored `page_width` without a
separate reset key.

### Two assistants with prompt URLs {#assistants}

ChatGPT and Claude accept a prompt in their URL; Gemini documents no such
parameter, so OINK does not include a built-in Gemini handoff. Both assistant
actions stay behind the opt-in `assistant_links` gate, so no site sends a URL
to a third party without choosing to.

## Consequences {#consequences}

Readers who learned the retired 1.6.0 keys must relearn them, and sites that
documented the 1.6.0 keys (`h`, `l`, `y`, `t`, `g`) must update their pages. The keyboard chunk now
carries the history runtime, and every page with keyboard navigation writes
one small `localStorage` entry per visit. No new configuration, network
request, or build step is introduced.

## Verification and ownership {#verification-and-ownership}

The theme's `bin/check-keyboard.py` checks the bound keys against the
documented map, the chunk assembly, and the gating; `tests/js` covers the
runtime units. The documentation site's `tests/browser/keyboard-nav.spec.mjs`
owns browser acceptance: the three-column dialog and its dimmed rows, the hover sheet,
history recording and pruning, fold-all, the reader width across reloads, and
the page-action keys.
