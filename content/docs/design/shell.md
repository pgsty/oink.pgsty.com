---
title: Shell and navigation contract
linkTitle: Shell and navigation
description: Navigation authorities, immersive blog presentation, search, actions, taxonomies, indexes, and page-end composition.
weight: 30
icon: fa-solid fa-window-maximize
search_keywords: [OINK shell, navigation contract, search, actions, blog presentation, authors, series, pager]
contract_status: v1.6.0
---

> [!NOTE] OINK 1.6.0 contract
> This contract describes OINK v1.6.0.

## Authorities and navigation {#authorities-and-navigation}

| Concern | Authority |
| --- | --- |
| Global navigation | Hugo `menus.main` |
| Docs / Book sidebar and pager | content tree or `data/docs_nav.json` |
| Root switcher | resolved top-level content roots |
| Discovery | per-language local search index |
| Page and Palette actions | shared action registry |

No feature adds another menu or page tree. One menu child level is interactive.
Deeper levels warn and flatten below linked group headings.
External links use `target="_blank" rel="noopener noreferrer"`. Internal links retain language and deployment subpaths.

Desktop and drawer navbar views use the same tree. Every dropdown has one moderate-width column of icon and title rows.
The mega panel and its `columns` menu parameter are retired. Configured `columns` warns and keeps one column.
Menu descriptions remain configuration data only.
The link tree stays on a single line and never wraps; it stays centered when space allows.
From lg upward, entries show icons and labels while horizontal space permits.
When the row cannot fit every entry beside the brand, fixed desktop sidebar, and utility controls, entries that define an icon automatically collapse to icon-only mode (`data-td-nav-compact="icons"`), while entries that opt out of icons (`params.icon: false` or `"none"`) keep their single-line labels.
Below lg, icon-bearing entries use icon mode by default, and at phone widths the bar reserves the brand and utility controls' widths before centering, so a longer menu cannot overlap the search control.
At any width where even collapsed entries do not fit, trailing entries fold into a `…` overflow disclosure (`ui_nav_more`) whose panel restores their full icon, label, and child hierarchy.
Between lg and md, the end edge keeps search, version, language, theme, and GitHub controls without a menu button.
Below md, appearance stays beside search and the drawer entry; version, language, and GitHub move to the footer dock.
Home and explicit Landing pages add a drawer control beside search, opening the complete labeled tree.
Shell pages with sidebars use the sidebar drawer control in that position.
Explicit Landing layouts use only the Landing drawer, including pages whose
content type is Book or Docs. A page never renders both drawer controls.
The navbar loads its drawer runtime even when a site supplies a custom homepage
or Landing body without the theme's section renderer.
No drawer button appears from md upward.
The stock 404 page has no reading sidebar and never advertises its drawer, even when a root cascade assigns it a Docs or Book type.
Adding a custom type to `shell_types` recognizes its shell capabilities; it does not create a sidebar in a custom template. Full-width custom pages without a sidebar set `sidebar_enabled: false`.
Language links target the page translation or the language home.
Links stay relative for languages sharing a host/base path. They become absolute only for language-specific `baseURL`s.
`hreflang` stays absolute and lists only actual translations. It never includes the switcher's language-home fallback.
Paginated blog indexes have their own canonical URLs; later pages omit cross-language alternates because translated archives can have different page boundaries.
`navbar_autohide` applies only to fine pointers from 768px. It never applies at touch or drawer widths.
The hidden bar keeps its reserved space, and a pinned bar occupies exactly that space, including its rule.
Revealing fades the bar in place without covering resting content. Hero pages use their overlay navbar instead of this policy.
The homepage shares their soft boundary: a short background wash below the bar replaces the bottom rule and scrolled shadow.

Sidebar and pager share the navigation root and order.
`manual_link`, `build.render: link`, dividers, hidden nodes, and placeholders keep their documented behavior.
`sidebar_icon_policy` accepts `all`, the default, `groups`, or `none`. Icons use one Font Awesome class pair.
Invalid policies follow the shared warning and fallback contract.
At `sidebar_cache_limit`, both walkers may reuse neutral markup only for the same language, root, and effective settings that affect output.
The markup stays visible without JavaScript. The normal shell runtime adds the active path.
Book pages with `sidebar_headings` remain page-specific and bypass the shared tree cache.
Below the limit, the content-tree walker renders a branch the current page is not in once,
and reuses it wherever it appears at the same depth with the same effective settings.
No row in such a branch is active, on the active path, or carrying Book headings.
Output is unchanged, and the active state is still rendered at build time.

Root candidates are linkable, non-divider top-level sections, followed by sections with `sidebar_root_for: self`.
Candidates are deduplicated by URL. Both sources honor `sidebar_root_menu: false`. Absent or true values preserve inclusion.
The current resolved root is appended even if excluded from global choices.
Zero entries render no control. One entry renders a static link.
Every URL keeps language and deployment prefixes.
Dividers and sections with `build.render: never` cannot be switcher links.

A `sidebar_divider` leaf keeps its static heading.
Divider sections keep children in both sidebar walkers. Their label is not a link.
When folding is enabled, they have a real disclosure button.
Dividers never become pager targets. Children keep their positions.
Use `build.render: never` to omit the divider section's outputs without hiding descendants.
Breadcrumbs show its label without a link. Search omits it. Navigation JSON promotes its children. Print keeps child documents.
Book TOCs keep the group label and child links, but omit headings from the unpublished group body.
`toc_hide` still hides the whole subtree. It is not a grouping option.
Explicit navigation keys are independent of language and deployment paths. Rendered links retain both prefixes.
The sidebar, pager, and navigation JSON select explicit sections by the resolved
`page` identity. A node belongs to a root when it is that root, a content
descendant, or a Docs/Book page that resolves to the same sidebar root. This
lets a manual keep files at the content root while the Docs section owns its
navigation. The selected node's `children` define its navigation hierarchy;
they need not be physical content descendants. Custom `url` values do not
change ownership. A tree for Docs does not replace a separate Book root, or
vice versa; a nested sidebar root selects its own branch. Roots absent from
the explicit tree use the content tree.
Only section-root Docs/Book navigation evaluates the explicit tree. Home-root
navigation and other shells ignore it, including its warnings. An explicitly
empty `sections` array warns and falls back only where that tree applies.
Uncached explicit sidebars mark the current page and expand its authored
navigation ancestors from the resolved page identity, even when a node omits
`url` or the page has a custom URL. Listed physical ancestors still expand
when the current page is absent from the manifest. Legacy URL and active-path
hints remain supported.
Both authorities remove `toc_hide` subtrees.
Navigation JSON keeps `manual_link_relref` as an internal link to its resolved destination, not a page identity.

## Book headings and responsive outlines {#book-headings-and-outlines}

`params.ui.sidebar_headings` defaults to `false`. Book pages show the page tree
in the left sidebar and the page outline in the right rail. Set
`sidebar_headings: true` (h2 only) or `2`, `3`, `4` (deepest heading level) to add
headings below the active Book row. Page front matter overrides a section
cascade or site setting; explicit `false` disables an inherited opt-in. This
setting does not disable the right outline or its relocation below `xl`.

> [!NOTE] Fixed in OINK 1.3.0
> The documentation Book no longer opts into sidebar headings. When enabled,
> the branch follows the parent row's navigation depth, reserves its icon and
> chapter-number columns, and adds one indent. Deeper headings indent again;
> the same logical spacing applies in right-to-left layouts.
>
> From 1200px, the fixed right rail uses 20% of viewport width, clamped to
> 286–420px. The flow rail uses 22%, clamped to 340–440px, and still honors
> `--td-shell-toc-flow-w`. The reserved column and visible panel share one width.
> Responsive widths follow the viewport immediately, without width transitions:
> shrinking the window must not make the article rebound between drag steps.
> Long labels wrap inside the rail; widening it can bring them onto one line.
> Below 1200px, outline groups move to the left sidebar when enabled; below
> 768px, they live in its mobile drawer. Pages with `sidebar_enabled: false`
> keep the rail hidden below 1200px. Browser zoom follows these CSS breakpoints.
> Collapsing the right rail releases its full width at once at every desktop
> size; the panel retains its slide and fade.

## Sidebar runtime {#sidebar-runtime}

> [!NOTE] Fixed in OINK 1.3.0
> With `sidebar_menu_foldable: true`, each branch controls the visibility of
> its children. `sidebar_menu_compact` must not permanently hide leaf entries
> inside an expanded branch. This applies to cached and per-page trees in
> both Docs and Book. Non-foldable trees retain compact filtering.
> Sites still using OINK 1.2.0 can set `sidebar_menu_compact: false` while
> keeping folding enabled until they adopt this fix.

> [!NOTE] Available since OINK 1.1
> OINK 1.1.0 provides this disclosure API and explicit hidden-content isolation.
> Version 1.0.0 does not provide the API.

`window.OinkSidebar` controls registered tree disclosures and movable TOC, backlink, and taxonomy groups, regardless of their current DOM parent.
`setExpanded(id, boolean, {source})` returns true for valid targets. It returns false for unknown IDs or non-boolean values.
`getState(id)` returns a new `{id, expanded}` snapshot or null.
IDs are existing `aria-controls` region IDs. The API cannot change arbitrary elements outside registered OINK groups.

Sources are `user`, `active-path`, `responsive`, and `api`, the default.
Each writer sets `aria-expanded`, `td-is-open`, the localized label, and region inert state before emitting one document event.
The event is `oink:sidebar-disclosure` with `detail: {id, expanded, source}`.
Repeated writes of the same state emit no event.
API restoration keeps current-path ancestors expanded. Explicit user actions can still collapse them.
Before isolating a closing region that contains focus, return focus to its toggle.

`ready` is a Promise that resolves to the API after initial hydration and responsive placement.
`isReady` and `oink:sidebar-ready` also expose completion to late consumers.
Sites own optional persistence. Await readiness, read storage inside try/catch, then restore valid region IDs through the setter.
OINK owns whole-column collapse, width, and scroll persistence.
It does not define a version or locale schema for reader-selected branches.

Desktop collapse and closed mobile drawers make panel content inert and mark the panel `aria-hidden`.
Focus leaves before isolation. Opening clears isolation before focus enters.
The panel remains the 16px pointer sensor. The external restore control remains active.
Moving the pointer onto that edge during collapse opens the overlay after the brief hover delay.
Hover, Escape, backdrop dismissal, breakpoint cleanup, and scroll unlocking keep their existing behavior.
No-JavaScript fallbacks omit these runtime attributes.

Whole-column TOC collapse also isolates hidden panels.
If the collapsing control has focus, move focus to the visible floating restore button.
Restoring the column returns focus to its visible column control.
When the aside moves into the mobile sidebar, clear former column isolation
before the drawer controls interaction.
The drawer's Tab trap includes only rendered, non-inert controls. It excludes hidden and collapsed descendants.

## Immersive blog presentation {#immersive-blog-presentation}

There is no article type or second shell. Four independent keys enable immersive reading on the ordinary blog shell.
Set them on pages or section cascades. Repeat values on the section index when it also needs them:

```yaml
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

Blog shells omit breadcrumbs by default because articles are standalone pieces. The recipe therefore needs no breadcrumb key.
`breadcrumb` remains an ordinary key that pages or cascades may enable or disable on any shell.

`hero` uses the shared featured image as a decorative full-width background on single pages and section indexes.
Without an image, it renders the normal opening. `banner` and `wash` remain single-page modes.
The navbar overlays a hero with a contrast scrim and scrolls with it.

`toc_style` accepts `fixed` or `flow`. Flow places a wider rail beside the article and fixes its position only after scrolling.
Its resting position aligns with the article info line, or the description if no info line exists.
`docs-shell.js` measures this offset because title wrapping is unpredictable.
Without JavaScript, the rail starts at the article's start.
`toc_taxonomies: false` removes term clouds. Rails with neither TOC nor clouds render nothing.
`notoc` remains the page-level TOC opt-out.
These switches do not change bylines, tags, series, pager order, feeds, or page-end composition.
The rail disappears below the `xl` breakpoint.

When scrolling down and the footer enters the viewport, the fixed TOC rail (`fixed`)
shares the visible-footer offset (`--td-shell-footer-offset`) so its scrollable
area ends neatly above the footer, keeping the lowest headings and taxonomy links
accessible by wheel and keyboard. Footer resizing and content reflow, including tabs, blog view switches and
loaded media, update this boundary without requiring a scroll event. This clearance applies even when the sidebar is
disabled (`sidebar_enabled: false`). With no footer the offset is zero, while
`toc_style: flow` relies on its own sticky boundary. Mobile drawer placement and
print visibility are unchanged. (Added in OINK 1.3.1.)

## Search, actions, and runtime {#search-actions-and-runtime}

`params.offline_search` enables a local index per language.
When enabled, it also builds under `hugo server` by default. Use `offline_search_on_serve: false` for large editing cycles.
HTML search appears on Home, shell pages, and Landing pages with `landing_search` enabled.
Other non-shell pages and Print omit the dialog and Palette.

Search metadata uses `search_keywords`, `search_boost`, default 1, and `search_exclude`.
The index includes URL, title, taxonomies, excerpt, headings, description, body/summary, root, section, type, keywords, boost, breadcrumb, and icon.
The fixture budget is 2 MiB raw / 512 KiB gzip.
Sites may return extra strings from `hooks/search-keywords-extra.html`.
Keywords affect matching and ranking. CJK matches found only through keywords display the description or excerpt, not the keyword list.
Body matches keep surrounding text as context.

Optional `sections` entries carry actual rendered `id` and `title`; content scope
also carries UTF-8 byte `start` offsets into the single stored body. Read IDs from
rendered content, including h1/h6, shortcodes, and `data-td-search-entry` elements, instead of reconstructing them
from titles or the configured TOC. Index reads temporarily select HTML and
restore the previous output context, so RSS/Print traversal cannot poison
HTML content. Reduced scopes omit body offsets. Old indexes
without sections remain usable. Return one result per page with its best matching
section, encoded fragment and nearby text; metadata-only matches may target the
page. Preserve language/subpath URLs, exclusions, and scope-specific content.
Normalized matches retain the original text in excerpts and highlights. Heading
extraction distinguishes `id` from `data-id` and ignores script/style content.

The labeled native radio group shows all roots and the page's `FirstSection`
root as two adjacent scope options, using the index's existing root authority.
Each option has a 44 px hit area and a visible focus ring. Tab visits the selected
option; arrow keys change scope, and Tab/Shift+Tab stay within the dialog.
Filter before ranking/limiting; another root's match cannot suppress spelling
fallback within the selected root.
The default is all roots; the choice lasts only on the loaded page. Scope affects
pages only and is hidden in command/choice mode. Counts and partial coverage are
visible and live-announced in one footer, alongside desktop keyboard hints.
Mobile hides only the hints. Composition suspends delayed and index-load renders
as well as Enter activation. No new configuration authority or build step exists.
The global result limit precedes existing root grouping and menu group order.
The owning theme search checker and the site's real-corpus/browser tests cover
these additions; the maintained summary indexes keep the 2 MiB / 512 KiB budgets.

### Local search engine {#search-engine}

No page loads Lunr, and the theme ships no copy.
One engine scans the folded index text and builds no index of its own.
A character's Unicode script decides how it is read; the page language does not.
A query is cut into words, identifiers, symbol runs of two or more characters, and CJK runs.
It is cut again where a CJK character meets a letter or digit.
A CJK run matches as its overlapping bigrams, without a dictionary. A run of one character is one term.
A page must cover atoms: each word, identifier, and symbol run, and each character of a CJK run, up to 30.
A short list of English function words and six Chinese question words is scored at a tenth and never required.
A query made only of such words is searched as written.

A word matches exactly as a whole word.
It matches loosely as the beginning of a longer word, as another inflection, and as one part of an underscore name.
It also matches loosely inside a compound when it has five or more characters, and as a correction.
Inflection uses Porter's suffix rules for `a`–`z` words.
Words of other alphabets share four leading characters and differ by at most three trailing ones.
Spelling fallback applies only when the selected scope holds no form of the word.
It covers `a`–`z0`–`9` words of five or more characters with one edit, or two from eight. A transposition is one edit.
Identifiers and symbol runs are literal and are never corrected.
One found inside a longer identifier or operator is a loose match.

A page is a complete match when it covers 90% of the atoms by weight.
An atom weighs the inverse document frequency of its commonest covering term.
A bigram absent from the scope is not required while other bigrams cover its characters.
Complete matches hide partial ones.
A page covered within one section and its own page fields precedes a page that needs several sections.
Strength is next. Each atom takes its strongest match: title 10, keywords 8, tags and categories 6, headings 5, description 3, body 1.
A loose match counts 0.7 of its field.
Strength is the weighted mean over atoms, times 1.5 when the pieces are adjacent and in order, times the page boost.
The best section's BM25 score times the boost follows, then title and URL.
Repetition changes only the BM25 score, so it reorders only pages of equal strength.
Partial matches sort by coverage in tenths before those keys and keep the matched/total label.
In that label a CJK run counts by pairs of characters.

BM25 runs per section with `k1` 1.2 and `b` 0.5 over length in characters.
Occurrences carry field weights and match quality, capped at 24 per field.
The excerpt is the 160-character passage of the best section that shows the most different matches.
A result carries the strings found, so inflections and corrections are highlighted as the page writes them.
`OinkSearchEngine.create` takes `(documents, maxResults)`.

The index template writes every document with its body. Output up to 2 MiB is published as the index, unchanged.
Larger output is split: the index keeps every field except `body`, and `offline-search-body.<lang>.json` holds a list of `{ref, body}` entries.
Section `start` offsets stay in the index and address the separated text.
The dialog then carries `data-td-body-src` and `data-td-body-bytes`.
The 2 MiB / 512 KiB budget applies to the index that is fetched first.
The palette requests the index on the first search keystroke and shows its results at once.
Page text up to 8 MiB follows by itself. Larger text, or any size under Save-Data, waits for the "Search page text" row, which shows its size.
While the text loads, the status says so, and an empty result reads as loading.
When it arrives the engine is created again and the selected row is kept. A failed download returns that row.
Opening the palette, command mode, and an unsplit index request nothing more than before.

Besides headings, the index records search entries: any rendered element with an `id` and a non-empty `data-td-search-entry` title.
Every anchored [field](/docs/design/components/#steps-cards-fields-and-tables) is one.
The entry title accepts both quoted and unquoted HTML attribute values.
A heading that contains an entry keeps its full visible title. Both anchors appear
in document order and share a byte offset when their text starts at the same place.
Entries join `sections` in document order with the same `id`, `title`, and `start`.
The page text is divided among headings and entries in that order, so text inside an entry opens that entry.
The `headings` field lists headings only.
An entry without an id or a title warns and is skipped.
An entry is scored and opened like a section, and its title counts as a heading.
The [proposal](/docs/design/proposals/local-search-engine/) records the design rationale and evaluation evidence.

Built-in action IDs are `compare_translations`, `copy_markdown`, `copy_link`, `open_chatgpt`, `open_claude`, `open_gemini`, `view_markdown`, `view_history`, `edit_page`,
`create_child_page`, `create_issue`, `create_project_issue`, `print_section`, `print`, `switch_preset`, `switch_theme`, `switch_language`, `switch_version`, `open_github`, and `browse_history`.
Outside the share bar, `copy_link` appears only in the Palette.
Site commands under `languages.<lang>.params.ui.command_palette.commands` may open safe URLs or invoke built-in IDs. They never inject JavaScript.
The legacy clipboard fallback restores previous focus and selection, including selection direction.
It does not reclaim focus if another control acquired it during copying.

In OINK 1.4.0, breadcrumbs and page actions wrap onto separate rows
when the reading column or enlarged text requires it. Long unbroken path labels
wrap without clipping; all breadcrumb links stay available. The action menu is
bounded by the viewport and retains keyboard focus and dismissal behavior at
200% text size, including a 320px viewport.

> [!NOTE] Fixed in OINK 1.3.0
> The page-action disclosure closes when keyboard focus leaves its containing
> controls, including Tab and Shift+Tab. Moving between its controls keeps it
> open; dismissal leaves focus at the reader's new destination. ArrowDown on
> its closed toggle opens the menu and focuses the first action immediately.

Edit, history, and create-child actions require repository-relative source files.
Normalize physical filenames and the site working directory to `/` separators before containment checks.
`path_base_for_github_subdir` matches this normalized path.
For local content, it matches relative to the working directory. For external mounts, it matches the absolute path.
A string regex removes matches. A `{from, to}` map may replace them.
External sources need an explicit match.
After mapping and cleanup, empty paths, `.`, absolute paths, drive-qualified paths, and paths starting with a `..` segment suppress these three actions.
Docs and project issue actions remain available under their existing repository settings.
Windows mappings must match `/`, not `\`. Normalization preserves filename case.

The Palette has empty, text-search, and `>` command modes. Quick links come from navigation.
It keeps no query history and provides no semantic search, personalization, or remote fallback.
Its `browse_history` command opens the separate browsing-history overlay of [keyboard shortcuts](#keyboard-shortcuts).
Queries stay in the browser. No default telemetry is sent.

`OinkSurfaceCoordinator` coordinates the Palette, Appearance, keyboard shortcuts help dialog, browsing history, Draw.io, Expo viewer, drawer, root, language, and version menus.
Each surface controls focus restoration and Escape.
Already closed Appearance menus do not restore focus when the coordinator closes them.
Keyboard navigation ignores text-entry controls (`textarea`, `select`, `contenteditable`, and text-entry `input` types) and modals, while allowing non-text controls such as gallery layout radios and tile-size range sliders; modifiers suppress bindings except `Shift` for `<` (`Shift+,`), `>` (`Shift+.`), `+` (`Shift+=`), and the Palette's `~` (Shift with the backtick key). The desktop nonmodal Appearance panel permits search shortcuts; its mobile modal sheet and other open dialogs, including fixed-position ARIA dialogs, retain keyboard ownership.
Inside the mobile drawer, Escape closes the root switcher first and returns focus to its trigger. A subsequent Escape closes the drawer. Moving focus outside the root switcher dismisses its popover.
The version disclosure opens on hover, focus or tap. Tab and the up/down arrows reach the version links.
Escape dismisses the list even when a touch browser leaves focus on the page body. A second Escape closes the drawer.
The list wraps long labels and scrolls above the bottom bar. In the phone drawer it expands in the flow so the drawer can scroll to its last link.
A press outside a floating list closes it at once, because iOS sends no click for a tap on plain content. The drawer's list closes on the click, so the row under the finger stays in place.

The outline uses one heading model and computed `scroll-padding-top` to derive the cursor and visible-heading range.
Its SVG line and dot share animated values, preventing drift.
Valid URL fragments are decoded. Malformed percent sequences use the literal heading ID.
This applies when indexing links and selecting requested headings near the page end.
No speculative DOM repair pass is allowed. The normal shell runtime always owns this tracking.
`params.ui.scroll_spy` and page `scroll_spy` remain quiet compatibility no-ops throughout 1.x.
They emit no separate runtime and may be removed only in a future breaking release.

### Keyboard shortcuts {#keyboard-shortcuts}

`params.ui.keyboard_nav` (default `true`; site, page or cascade) adds the stable
`js/chunks/keyboard.js` chunk, `history.js` followed by `keyboard-nav.js`, to
interactive HTML pages. A page with `false` ships neither file, so it binds no
key, records no history and restores no reading width. The map is thirty bare
keys in three groups of ten, and the shortcut help lists them in this order:

| Group | Keys, in help order |
| --- | --- |
| Navigation | `w`/`s` tree move, `a`/`d` collapse/expand, `Enter`/`Space` open the focused tree item, `q`/`e` page, `k`/`j` heading, `x` language, `r` section, `v` version, `h` history, `g` home |
| Actions | `/` and `f` search, `c` and `` ` `` commands, `u` edit, `n` child page, `i` docs issue, `o` fold all, `p` print, `[` ChatGPT, `]` Claude, `\` Gemini |
| View | `b` Duo View, `z` Zen Mode, `m` Markdown source, `t` preset, `y` color mode, `l` index layout, `;` gallery layout, `,`/`.` gallery size (`<`/`>` too), `-`/`=` reading width (`+` too), `'` help |

Scopes:

- Tree keys need `#td-sidebar-menu` outside Zen Mode. Up/Down/Left/Right act
  only once focus is in the tree, where Left and Right swap in RTL; elsewhere
  the arrows keep native scrolling and `Space` keeps scrolling the page.
  Movement uses real focus without changing Tab order, starting from the
  current page's row. Non-link divider buttons take part. From a child,
  Left/`a` focuses its parent group and a second press collapses it;
  Right/`d` opens a closed group or enters the first visible child of an open
  one. A closed drawer or collapsed desktop sidebar opens on the first press.
- `q`/`e` work on shell pages and follow the visible sidebar links only, never
  group buttons, then the page-end pager, then `rel` links. `k`/`j` and `z`
  work on shell pages and the home page; on the home page `k`/`j` move between
  `[data-td-landing] > section[id]`. Every other key works on every
  interactive page when its target exists and does nothing otherwise.
- `/` and `` ` `` (also `~`) belong to the Command Palette and keep working
  when `keyboard_nav` is `false`; `\` no longer opens commands. `f` and `c`
  open the same instance, or on a standalone home page without a palette move
  to `[data-td-keyboard-search-route]` and resume the requested mode there.
- `u`, `n`, `i`, `p`, `m`, `[`, `]` and `\` run `edit_page`,
  `create_child_page`, `create_issue`, `print`, `view_markdown`,
  `open_chatgpt`, `open_claude` and `open_gemini` through the action registry,
  only while the descriptor is available. `x` and `v` move to the next
  available, non-active option with a URL of `switch_language` and
  `switch_version`, wrapping at the end; `x` falls back to
  `[data-td-language-route]`. `g` opens the manifest's `home`
  (`Site.Home.RelPermalink`), falling back to the brand link; on the home page
  it glides to the top.
- `open_gemini` targets `https://gemini.google.com/app?q=` with the prompt and
  shares the `assistant_links` gate and placements of the other assistants;
  the page menu lists ChatGPT, Claude, Gemini. Gemini documents no prompt
  parameter, so every activation first copies the prompt synchronously with
  `OinkClipboard.copyNow` and then opens the tab.
- `?` and the digits stay unbound. `l` as a language alias, `h` as a Zen alias,
  the home page's `n` alias, `g` as tree activation, `v` for the index layout,
  `m` for the gallery layout and `;` for help are retired.

The shortcut help is one sheet in `<template data-td-keyboard-help-source>`,
rendered in the footer menu or, under `footer_style: none`, by `scripts.html`.
It holds three `.td-shell-keyboard-help__section` groups
(`td-shell-shortcuts-navigation`, `-actions`, `-view`) of ten
`.td-shell-keyboard-help__row[data-td-shortcut]` rows. The row IDs, in order,
are `tree-move`, `tree-toggle`, `tree-open`, `page-move`, `heading-move`,
`language`, `route`, `version`, `history`, `home`; `search`, `commands`,
`edit`, `new-page`, `issue`, `expand-all`, `print`, `chatgpt`, `claude`,
`gemini`; `duo`, `zen`, `markdown`, `style`, `theme`, `layout`, `gallery`,
`image-size`, `page-width`, `help`. `'` toggles a modal
`<dialog data-td-keyboard-dialog>` cloned from the sheet with `-dialog` ID
suffixes. Each opening evaluates every row against the live page; a row that
cannot run stays in place with `td-is-unavailable` and a visually hidden
"unavailable" note, so the grid keeps its shape. Dimming never lowers opacity:
the label takes the secondary text color and the keycaps lose their fill for a
dashed border, which keeps WCAG AA contrast in every preset, and forced colors
use `GrayText`. The dialog is
`min(58rem, 100vw − 1.5rem)` wide with auto-fit columns of at least 16.5rem:
three side by side on desktop, stacked on phones. `'`, Escape, the close button
(`aria-keyshortcuts="Escape '"`) and a backdrop click close it, and focus
returns to the trigger without reopening its hover card. Other shortcuts stand
down while it is open.

The footer `?` trigger declares `aria-keyshortcuts="'"` and
`aria-haspopup="dialog"`. Hover or focus shows a short hint card
(`.td-shell-keyboard-hint`): search and commands when local search is on,
history, help, and "Click for all shortcuts". A click opens the dialog. With
`keyboard_nav: false` and local search on, the hint keeps only the `/` and
`` ` `` rows and opens no dialog.

Browsing history is local. `history.js` records each HTML page load except the
404 page as `{url, title, time}`: the path and query without the fragment, the
`og:title` or document title, and the visit time. Entries live in
`localStorage` under `td-history:` plus the site base path (`"/" | relURL`),
newest first, unique by URL and capped at 100; entries outside the base path
or malformed ones are dropped, never repaired. The list is never transmitted.
`h` or the palette-only `browse_history` action, available when
`keyboard_nav` is on, opens `#td-shell-history[data-td-history]`, which
reuses the palette surface classes. It omits the current page, filters on
every typed token across title and path, and supports Up/Down, Enter (same
tab), Ctrl/Cmd+Enter or a modified click (new tab), Shift+Delete (remove the
selected entry) and the `[data-td-history-clear]` button (clear all, disabled
when empty). With no rows the listbox stays childless and the empty or
no-match text appears in the sibling `[data-td-history-empty]`. Escape or the
backdrop closes it and restores focus. It holds
`data-td-shell-lock` while open and registers as `history` with the
coordinator.

`o` folds or unfolds together the tree and right-rail groups
(`[data-td-shell-tree-toggle]` in `#td-shell-sidebar` or
`[data-td-shell-aside]`, through `OinkSidebar.setExpanded` with source `api`),
every `<details>` outside dialogs, hover menus, the site header and templates,
and `[data-td-code].is-collapsible` blocks through their expand button. If any
target is folded, all expand; otherwise all collapse, and the `api` source
keeps the current page's active path open. Rail collapse and popover menus are
not targets. One frame of `html[data-td-kbd-instant]` suppresses transitions
while the element at the top of the main column keeps its viewport position.

`-` and `=` (or `+`) set a reader width for `.td-shell-layout .td-shell-article`
in 100 px steps from the rendered width, never below 600 px (or the container
when narrower). Reaching the container stores `none`, which fills it on any
screen. A step that reaches or crosses the page's own width, measured without
the override, stops there and removes the stored value. The value lives in
`localStorage` as `td-shell-article-w` (pixels or `none`); on shell pages with
keyboard navigation the prepaint script restores it as
`html[data-td-shell-article-w]` with `--td-shell-article-w`. The `@media screen`
rule overrides `page_width` and the Book `.td-content` measure; print ignores
it.

## Search-tail extensions {#search-tail-extensions}

> [!NOTE] Available since OINK 1.1
> This API is included in OINK 1.1.0 and absent from version 1.0.0.

Trusted site JavaScript may call `OinkCommandPalette.registerSearchTail({id, rows, activate})`.
YAML and the action manifest remain data-only. The bundle loads only when local search is enabled.
Registration requires a unique ID matching `[A-Za-z0-9][A-Za-z0-9_-]*` and two functions. Invalid or duplicate registrations throw.
The returned unregister function is idempotent. It cannot remove later registrations that reuse the ID.
Live changes schedule one owned render. Removal cancels the provider's pending action.

`rows(context)` returns descriptors synchronously. Context is a frozen `{query, locale, phase, pageResultCount}` snapshot.
Query is trimmed. Locale is the HTML language tag. Phase is `results`, `empty`, or `error`.
Count includes only local page results after the limit.
Providers run only for settled, nonempty text searches. They never run in empty, command, choice, or loading states.
Rows appear after native results and actions in the localized Actions group, in registration order.
Native empty/error messages and input-triggered index retries remain available.

Each descriptor requires a unique per-provider `id` with the same ID syntax and a nonempty string `title`.
Optional `description`, `icon`, and `disabledReason` values are strings. `available` is boolean and defaults to true.
OINK copies and freezes these fields. Display strings render as text.
Invalid descriptors, duplicate IDs, asynchronous returns, or thrown callbacks discard that provider for the render.
Other providers remain unaffected. Callback counts are not guaranteed.

`activate(row, context)` runs only through ordinary row activation.
It receives the copied descriptor and original context, with an `AbortSignal` and `handoff()` function.
While activation is pending, all other row activations are blocked, including entry into native choice menus.
Synchronous throws and rejected promises clear pending state, keep the Palette open, and announce the localized action-failed message.
Fulfillment values are ignored. Success closes the Palette without taking focus from another surface.
Closing, reopening, changing the rendered query, or unregistering cancels pending work.
Late settlement cannot modify newer sessions.

Before opening another coordinated surface, call `context.handoff()`.
It closes the Palette without returning focus or aborting the activation. The consumer then owns the new surface's focus and error interface.
Later Palette sessions or unregistration can still cancel unfinished work.
Successful completion does not abort handed-off operations. OINK sets no timeout.

`rows()` must remain pure. This trusted-code contract is not a sandbox.
Default queries remain local. No remote provider or telemetry is bundled.
Sites own extension network behavior and provider consent.

Desktop nonmodal Appearance permits search shortcuts; mobile modal Appearance
and every other open dialog retain keyboard ownership. In the mobile drawer,
Escape dismisses the focused root switcher first and returns focus to its toggle;
a second Escape closes the drawer. Focus leaving the switcher dismisses it.
Search opened from the Landing drawer returns focus to the visible menu toggle.
Choosing a visual preset in the Palette keeps it open for the next action.

## Share {#share}

`params.ui.share` defaults to empty and accepts any ordered subset of 16 targets:
`x`, `bluesky`, `mastodon`, `facebook`, `linkedin`, `reddit`, `hackernews`, `telegram`, `whatsapp`, `line`, `pinterest`, `weibo`, `chatgpt`, `claude`, `email`, and `copy`.
Page lists replace inherited lists. `share: false` disables the share bar for that page.
Unknown entries warn and are removed. Only regular pages display the bar.
Print, Markdown, and RSS omit it.

Targets are plain intent links containing the page permalink/title, plus a local `copy_link` button.
Pinterest media uses the shared featured-image resolver.
ChatGPT and Claude receive build-time permalink prompts independently of page-menu assistant actions.
Discord has no public intent target and is deliberately absent.

The bar loads no platform SDK, iframe, script, stylesheet, counter, or campaign parameter.
It sends no request until a reader activates a link. It displays one accessible labeled glyph row.
`share/items.html` resolves targets. `share/bar.html` renders them.

## Annotation {#annotation}

`annotation-items.html` resolves page annotation descriptors. `page-meta-lastmod.html` renders them.
Inline annotation links are underlined so readers can identify them without
relying on color, including muted last-modified and upstream attribution lines.
You may override either partial narrowly. Lines appear in this order:

| Line | Condition |
| --- | --- |
| Last modified | `Lastmod` is set |
| Upstream | front matter `upstream_link` is non-empty |
| Translation | configured authoritative language has a translation and this page has authored text |

`upstream_link` is per-page and can be inherited through cascades. `upstream_link: ""` disables it.
Other facts resolve from site params → `data/upstreams[upstream_source]` → front matter:
`upstream_name`, `upstream_copyright`, `upstream_license`, `upstream_notice`, optional `upstream_ref`, and `upstream_modified`.
A link requires the first four facts.
Invalid or incomplete attribution warns and emits no legal notice. Unsupported URLs are refused.

`upstream_modified` changes the credit verb and links commit history within the existing attribution sentence.
The notice page includes complete license and warranty text.
`params.ui.translation_notice` enables translation notices. The page key `translation_notice` can cascade.
Notices skip generated pages and pages without bodies. Natively authored pages can use `translation_notice: false` to disable them.

## Authors and series {#authors-and-series}

Blog article heads show title, info line, term badges, byline, then series strip. The description starts the body below them.
`article-info.html` always shows the date. With `reading_time` enabled, it also shows word count and minutes.
Front matter `upstream_link` supplies the same per-page fact used by annotation.
It adds a localized original-source link, validated by the shared URL policy.
Term rows contain badge sequences. The taxonomy name appears on the group label, not as a visible prefix.
Inactive badges use pale neutral backgrounds, muted text, and the taxonomy's term glyph.
Linked badges use the current section's accent background, border, and text on hover or focus.
`taxonomy-icon.html` defines taxonomy and term glyph pairs:
`folder-open`/`folder`, `tags`/`tag`, `cubes`/`cube`, `users`/`user-pen`, `book-bookmark`/`book` for series, and generic `shapes`.
`params.ui.taxonomy_icons` overrides a pair with one string for both uses, or a `taxonomy`/`term` map.
Invalid values warn and keep built-ins.
Right-rail clouds show the whole-taxonomy glyph only in their heading; repeating it on chips would add noise beside an already announced taxonomy.
Their chips therefore contain only text and counts.
Standalone taxonomy directory cards show one term glyph.
Bylines show only portraits, names, and one-line profile bios. They have no label or date.
List rows, cards, and term archives share a metadata line: date, localized author-and-section phrase, then word count and minutes.
The same `reading_time` switch controls these last two values.
A wrapping badge line follows, with terms from every taxonomy in alphabetical taxonomy order.
Each badge has its term glyph. Cards omit `authors` because the metadata sentence already names them.

Authors activate only through `taxonomies: {author: authors}`.
Profile term pages define display names, summaries, bodies, and featured-image avatars.
Missing profiles use link titles, initials, and archives.
`authors-resolve.html` keeps front matter order for article heads, list rows, and one RSS `dc:creator` per author.
Legacy `author` stays unchanged when `authors` is absent.
When both exist, `authors` takes precedence without warning. Custom author-taxonomy plurals remain ordinary taxonomies.

Series activate only through `taxonomies: {series: series}`. Term pages own the introductions without adding a parameter, data file, cover model, or runtime.
Pages use `series: [name]` with optional `series_weight`.
`series-pages.html` puts weighted members first, ordered by weight. Unweighted members follow in ascending date order, with `Path` tie-breaks.
The strip and term page share this order. The first named series gets one HTML/print strip.
The panel uses translucency and background blur because an opaque surface would obscure the featured image behind the band in `hero` articles.
On plain articles, the tint resolves to the page background, allowing one treatment to serve both.

The summary covers the full bar and trailing caret, while the series name and taxonomy icon remain a sibling link over a hidden width reservation.
This keeps nested interactive controls out of the summary. Opening adds a thin rule below the bar and displays reading order in an adaptive grid on the same surface, preserving DOM order.

Each member link aligns its ordinal at the end of a fixed square track so titles keep one edge at every list length.
Equal cells stay in one column when narrow and add columns only while titles retain a readable width, allowing desktop panels to use their width without stretching one selected row across the panel.
Hover and current-position states reuse the two backgrounds from sidebar navigation; current members also have filled ordinals and heavier titles, so color is not the only cue.
Print expands the list in one column. Singleton series and non-HTML outputs omit the strip.
Numbering, cross-references, and aggregate outputs remain Book features.

Default article taxonomy chips omit reserved `authors` and `series` because dedicated features already show them.
Explicit `params.taxonomy.page_header` restores either.

## Blog indexes and page composition {#blog-indexes-and-page-composition}

Blog section indexes use `params.ui.blog_index`.
`list`, the default, `cards`, and `gallery` show one flat sequence,
newest first, with shared `blog_index_size` pagination and no year headings.
`table` shows date/title/tag rows and always lists the complete section without
pagination, both standalone and when toggled.
Cards use shared lead images, localized date/author/section metadata, tags, and three-line summaries.

Taxonomy pages such as `/tags/` and `/authors/`, and their term pages, share `shell/taxonomy-head.html`.
Taxonomy heads show a whole-taxonomy glyph in a tinted tile, the localized name, and term count.
Term heads show the term title and page count from `ui_taxonomy_pages`, using the locale's CLDR plural form.
If no breadcrumb appears, a label above the title names and links the taxonomy, since enabled breadcrumbs already provide this context.
Generated taxonomy breadcrumbs use the head's localized label, not Hugo's plural title.
Below the head, `shell/taxonomy-cards.html` lays out one-line term cards.
They use the rail cloud's order: most-used first, with alphabetical ties.
`auto-fill` creates equal columns, preventing short taxonomies from stretching two cards across the page.
Each card contains the term glyph, term, and page count. The whole card is linked.
Author cards instead lead with the byline's small portrait, using the same avatar partial.
Cards include no description or newest page because the title and count already identify the term; another line only blurs the grid.
There is no filter-chip row or "All" chip because the section root is already in the sidebar and navbar.
Term pages stay row lists. Author profiles keep their own head.

Taxonomy and term rails start with `shell/taxonomy-switcher.html`.
Each declared taxonomy has one row with its whole-taxonomy glyph, localized name, and term count, linking to its index.
The current taxonomy uses the selected background.
The switcher connects taxonomy pages because cloud chips link to terms and cloud headings only collapse.
Sites with one taxonomy show no switcher. The switcher and clouds share the `toc_taxonomies` switch.
Taxonomy pages scope clouds to the whole site (`taxonomy-root.html` returns no root for this page kind) and omit their own cloud because its terms already appear in the cards.
Term pages keep section scope and all clouds.

`params.ui.blog_index_toggle` renders all four forms — `list`, `cards`, and `gallery` for the current paginator slice, plus `table` as a complete unpaginated archive — and lets readers cycle between them: `list`, `cards`, `table`, then `gallery`.
The fourth form is included in OINK 1.4.0.
The configured form controls initial display. Hidden forms load no images.
Stored reader preferences apply only to indexes that publish all four forms.
Sections without toggles publish one form and always show it.
Front matter or cascades override site mode per section.
Tables remain complete, unpaginated archives whether or not the switch is enabled.

### Blog gallery {#blog-gallery}

`blog_index: gallery` presents each post as a linked cover. It uses the shared
featured-image resolver, the same date order and `blog_index_size` paginator as
rows and cards, and preserves `manual_link`. It does not change the content
type to Expo. Clicking a cover navigates to the article; no image viewer opens.

`params.ui.blog_gallery` accepts `mode` (`wall`, `cards`, or `seamless`, default
`wall`) and `size` (integer CSS pixels, 160–360, default 240). A page or cascade
`blog_gallery` block replaces the site block. Missing or invalid fields use
their built-in defaults; invalid values warn. The gallery toolbar changes
mode and size independently of Expo albums, using `td-blog-gallery-mode` and
`td-blog-gallery-size` storage keys. The outer view retains `td-blog-index`.

Wall uses Expo's justified row geometry with 6px gaps; Seamless removes the
gaps. Cards uses columns filled from the shortest column. Covers keep their
proportions within bounded tile ratios and are contained rather than cropped.
Below 500px of gallery width, Wall and Seamless bound tile ratios more tightly
to keep the caption columns readable, including for very tall images.
Processable covers larger than 960px receive a preview within a 960 × 960 box;
GIF previews are still images. No build-time remote fetch is introduced.

Wall and Seamless reveal titles and descriptions on hover or keyboard focus.
Without hover, captions remain below images, and row spacing includes their
height. Cards always shows captions. Covers without images retain a linked,
named placeholder; failed images receive the same fallback after enhancement.
The title names the link and the cover is decorative. Hidden forms use lazy
images. Reappearing forms, resized sidebars, fonts, and late image dimensions
trigger layout without overlapping items. Without JavaScript, a responsive
grid keeps links and captions visible and hides the inactive controls.

`params.logo` always supplies the brand mark. `params.wordmark`, or the site title, supplies text hidden at compact widths.
Docs, Book, Blog, and Swagger share one shell model.
Page-end order is Share, Feedback, Annotation, Pager, Comments.
Docs/Book pagers follow sidebar preorder. Blog pagers use weight, then reverse date.
`pager: false` disables the pager. Static outputs omit pager controls.

Every rendered footer has an icon-only utility dock at the end of its bottom line.
Dock order is version, language, theme, then keyboard help. Menus open upward.
Hovering or focusing the keyboard-help trigger shows a short hint card; clicking it when `keyboard_nav` is enabled opens the three-group shortcut dialog described in [keyboard shortcuts](#keyboard-shortcuts).
The version control never shows the current branch or release label.
The fat footer's collapse chevron follows the dock.
Below `lg`, copyright, center content, and dock become three centered full-width rows, with the dock last.
These global controls do not appear in sidebar footers.
`footer_style: none` removes the whole bottom line.

There is no archive shell, arbitrary-depth flyout, second navigation authority, query upload, or browser compatibility shim for removed configuration.
Feedback sends only `docs_feedback` through an existing `gtag` and stores the selection locally.
It does not replace Giscus.

An explicit `params.ui.quick_links: []` disables quick links instead of restoring
the defaults. Invalid `sidebar_root_link_self` values warn and keep the documented
`true` fallback. Taxonomy and term pages use the shared `page_width` validator.

## Translation comparison {#translation-comparison}

`params.ui.compare: true` adds an icon-only **Open duo view** entry, whose glyph
differs from every shell control's, beside
the page actions and a localized **Duo View** action (`compare_translations`)
in the Command Palette on Docs, Book, and blog pages that have an actual HTML
translation on the same origin. The reader title, its Sync Scroll switch, close
icon and sync notes use the same catalog. The entry exposes its label as its
tooltip and accessible name. When keyboard navigation is enabled, `B` toggles the
reader: it opens it from the page and closes it from the toolbar or either pane,
under the page shortcut's guards (no modifier, composition or editable target).
The entry and Close declare `aria-keyshortcuts`, and the shortcut help dims the
Duo View row on pages without a real target. The default is `false`. This is one
site setting; there is no page-pair data, new layout, or output format. A
language that sets it to `false` offers no entry and is never a target.
Navigation's language-home fallback is never a comparison target, nor is a
translation whose build policy writes no HTML (`build.render: link` or `never`,
including cascaded policy). Blog archive pages after the first offer no entry,
palette action or shortcut, because they have no counterpart.

The reader fills the viewport with two ordinary pages. The current page is fixed
on the reading-start side, so a right-to-left host mirrors the pane order. The
target selector uses existing language order and the same icon, rounded trigger,
floating menu style and selected and hover option states as the site's language bar. Its menu supports pointer and
keyboard selection. Only the selected sibling is loaded, and replacing it
preserves the synchronization preference. Each pane keeps its language,
direction, footnotes and content components.

Below 900 CSS pixels, one toolbar row and one switcher row show one retained pane
at a time. The title truncates while Sync Scroll and Close stay at the end. The
switcher row holds the language buttons and, with more than one target, an
icon-only target-language menu, so pane headings are not repeated. A single
target is a plain label in the pane heading and the switcher, never a
one-option menu. Short viewports tighten both rows: at
320 × 256 CSS pixels (400% zoom) at least 160 pixels of text remain. Forced-colors
mode marks the selected pane with a border. Crossing the breakpoint moves the
language menu while preserving its keyboard focus, open state and selected pane.

Shared visible heading IDs determine linked scrolling, using interpolation
between matched headings. Unmatched headings are skipped. **Sync Scroll** is a
labelled switch (`role="switch"`): while panes load it keeps the reader's
preference and is disabled, and it reads off when sync is unavailable or a pane
fails. A partial match anchors the estimate between matching headings; with no
common headings the reader falls back to a bounded beginning-to-end
document-progress estimate. In either case an orange exclamation mark beside the
switch, without a badge, names the case in a note shown on hover, keyboard focus
or tap; Escape dismisses a visible note before it closes the reader. Matching and
usable geometry are separate facts: a matched heading that cannot scroll to the
reading line adds no anchor without counting as a mismatch, so it never raises
the partial-match note. When no shared heading can anchor the map at all, the
note says that sync follows overall reading progress.
Duplicate or reordered matches are ambiguous, so the switch is disabled and the
note explains why; the two panes remain independently readable. While the owner scrolls continuously
(trackpad, momentum, a held key), the follower tracks it instantly on every
frame; a single discrete jump eases when motion is allowed. Reduced motion and
bookmark restoration always position instantly.
Turning off **Sync Scroll** restores independent scrolling; synchronized
scrolling aligns sections by heading anchors rather than locking individual
paragraph rows. Opening resumes the current passage after reflow. Focus starts
on the dialog title so the view is announced; until the reader Tabs into a pane,
PageUp, PageDown, Space, the arrow keys, Home and End pressed there scroll the
reading pane (the visible one below 900 pixels) and sync follows. A late image
or font load preserves the first keystroke when the reading position already matches its bookmark. Closing,
Escape, `B` or Back restores host scroll and returns focus to the element that
had it when the reader opened, such as the reading link where `B` was pressed,
falling back to the entry when that element is gone or hidden. Only an open
language menu or a visible sync note consumes Escape before the reader does. A reload, or a back/forward
restore, onto the reader's history entry reopens the reader without adding a
record, so one Back closes it and Forward can reopen it. That restore brings back
the selected target, Sync Scroll, the visible pane and both reading positions,
which the reader keeps on its own history entry once scrolling settles. The last
explicitly chosen target language and Sync setting are also remembered in this
browser for later openings; without storage the first target and Sync on apply. Back also cancels a
reload restore whose reader script is still loading. A pane-local modal consumes
Escape before the outer reader does. Fragment
links stay in the pane without adding history and, like a native fragment
jump, reveal the hidden tab panels that contain their target; another document exits
comparison; external links open outside it. A localized loading note covers a
pane until its article is readable. The iframe's initial `about:blank` load is
ignored while the target request is pending; a document still blank at the
15-second timeout is treated as failed. A page that cannot be loaded shows a
localized Retry button and a direct link; choosing the same language again also
retries it.

The [accepted decision](/docs/design/decisions/document-comparison/) records the
rationale and boundaries. `bin/check-compare.py`, the theme's scroll geometry
tests, and the site's `test:compare` browser suite own verification. The
dedicated eight-language fixture is synthetic evidence, not a downstream
adoption claim.

## Verification {#verification}

`bin/check-navigation-contract.py`, `bin/check-shell.py`, JS tests, output goldens, and consumer browser tests verify these contracts.
They cover navigation, language/subpath links, blog variants, page-end order, keyboard behavior, accessibility, and responsive layout.

## Appearance control {#appearance-control}

The navbar and footer dock share one click/keyboard disclosure. The Landing
mobile drawer also provides a labeled Appearance row. The panel offers native
Style radios when `preset_menu` allows a choice and native Light/Dark/System
radios when `dark_mode.show_menu` is enabled. Selection is immediate and keeps
the panel open. Enter, Space, or ArrowDown opens it; arrow keys select within
a group; Tab moves between groups; Escape closes and returns focus. Sun/moon
trigger icons show the resolved current state: sun for light and moon for
dark, including changes while following the system.

The English group labels are Style and Light. Style options are independent
buttons in a two-column grid, with a colored page, layers, pen-nib or terminal
icon and the preset name. There are no Aa previews or experiment badges.
The site default is identified in its tooltip and accessible name; selecting
it clears the saved preset. A tinted background and border show selection,
and keyboard focus has a separate outline.

Desktop uses a non-modal dialog anchored to the trigger; outside press or
focus leaving closes it. Below 768 px and inside the Landing drawer,
`showModal()` opens a bottom sheet in the browser top layer with a close
button and 44 px option targets. Closing the sheet preserves the underlying
drawer. The surface coordinator closes unrelated popovers before opening.
The `t` shortcut runs `switch_preset` with the next offered preset in order (Paper, Slate, Ink, Terminal) and wraps after the last; it does nothing when the site offers no preset choice. The `y` shortcut cycles color mode through `light`, `dark`, and `auto` (system) via `switch_theme`. `switch_preset` is also the command-palette choice.

> [!NOTE] Fixed in OINK 1.3.0
> A queued close event from an earlier appearance dialog must not clear the
> expanded state of a newly reopened dialog.

The Ink and Terminal experimental presets require explicit configuration;
`preset_menu: true` continues
to offer Paper/Slate plus the site default. Both reuse the same state, keyboard,
command-palette and bottom-sheet mechanisms. Terminal compacts desktop
navigation rows, while prose and mobile touch targets retain their sizes.

## Expo albums {#expo-albums}

The new `type: expo` reuses this shell and adds image-album presentation.
The [Expo contract](/docs/design/expo/) owns its content model, controls, and outputs.

## Local component surfaces {#component-surfaces}

OINK 1.4.0 aligns search/command rows, sidebar corners, and Appearance controls with the component geometry. Selected and hovered rows remain distinct, keyboard focus remains immediate, and preference storage, navigation, and palette selection are unchanged. No moving-highlight runtime is added.

## Archived-version banner {#archived-banner}

> [!NOTE] Unreleased
> Implemented on the theme's main branch after v1.6.0; no tagged release contains it yet.

With `params.archived_version: true`, every HTML shell and Landing page opens
with `version-banner.html`: a `td-page-notice td-page-notice--primary` element
with `role="note"`, in which a decorative `fa-box-archive` icon precedes the
localized `version_banner_archived` sentence and, when
`params.url_latest_version` passes the shared URL policy, the
`version_banner_latest` link. The sentence names `params.version`; without one
the build warns once and omits the banner rather than emitting an empty element.

`alerts.css` styles `td-page-notice` with the callout accent grammar in the
interface face: a primary-tinted band whose accent rule uses
`border-inline-start`, so right-to-left pages mirror it. Directly under
`<main>`, in Landing and default layouts, it keeps the 1050px article measure
with a 1rem gutter. Forced colors use system colors, and browser print keeps
the banner in ink without the tint. The Print output's printable-section
notice shares the class and stays screen-only; the dedicated Print output does
not render the archive banner.

## v1.5.1 review corrections {#unreleased-review-corrections}

These corrections shipped in v1.5.1 and are part of the current consumer contract.

- Invalid `manual_link_relref` values warn and use the page permalink. Sidebar,
  section index, and navigation JSON share resolution, including deployment
  subpaths. Missing references must not stop an ordinary build.
- Navigation JSON IDs and section-index lookup keys remove the deployment prefix
  before the language prefix. Explicit section order and cross-language identity
  remain stable with or without a directory for the default language. Published
  links retain both prefixes.
- Version menus and commands share URL resolution. Page links remove the current
  deployment prefix before joining the target version URL, retaining the language
  path without duplicating the old version directory.
- Blog indexes own their pagination: localized navigation contains ordinary
  links with `aria-current`, and head `prev`/`next` point to list pages. The
  article-sequence pager is omitted on blog lists. Archive pagination and its
  head links apply only to HTML. Print emits one complete section aggregate,
  without repeating it for each HTML archive page.
- All navbar-only pages, including immersive blog articles, expose the mobile
  site drawer. Language, version, and repository links remain reachable there.
  Closed sidebar drawers cast no shadow into the viewport.
- The `groups` icon policy includes the navigation root, top-level entries, and
  entries with children in both tree walkers. Deeper leaves omit icons.
- A rail with no TOC, taxonomy output, or backlinks renders no empty panel or
  controls. Taxonomy-only rails retain collapse/expand controls labelled as
  sidebar actions, rather than TOC actions. Book TOCs suppress the browser's
  list counter alongside authored numbering.
- Escape dismisses language, version, and utility hover menus and returns focus
  to the trigger without reopening the menu. Copy, feedback, comparison loading,
  and Expo boundary controls preserve the focused element.
