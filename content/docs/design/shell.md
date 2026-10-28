---
title: Shell and navigation contract
linkTitle: Shell and navigation
description: Navigation authorities, immersive blog presentation, search, actions, taxonomies, indexes, and page-end composition.
weight: 30
icon: fa-solid fa-window-maximize
search_keywords: [OINK shell, navigation contract, search, actions, blog presentation, authors, series, pager]
contract_status: v1.4.0
---

> [!NOTE] OINK 1.4.0 contract
> This contract describes OINK v1.4.0.

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
The link tree stays centered when space allows. At phone widths it reserves the
brand and utility controls' widths before centering, so a longer menu cannot
overlap the search control. It uses text links from lg and icon links below lg.
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
Other non-shell pages and Print omit the dialog, Lunr, and Palette.

Search metadata uses `search_keywords`, `search_boost`, default 1, and `search_exclude`.
The index includes URL, title, taxonomies, excerpt, headings, description, body/summary, root, section, type, keywords, boost, breadcrumb, and icon.
The fixture budget is 2 MiB raw / 512 KiB gzip.
Sites may return extra strings from `hooks/search-keywords-extra.html`.
Keywords affect matching and ranking. CJK matches found only through keywords display the description or excerpt, not the keyword list.
Body matches keep surrounding text as context.

> [!NOTE] Local search in OINK 1.4.0

Queries normalize case/Unicode width and split whitespace and CJK/Latin boundaries,
up to 24 unique terms, preserving identifier punctuation. A CJK run is a literal
substring; no dictionary or remote dependency is added. Literal field matches and
English Lunr stemming cover terms across fields; typo fallback applies only to
ASCII words of at least five characters (one edit, or two from eight characters).
All-term pages suppress partial results. Otherwise coverage is shown and sorted
first. A contiguous whole phrase leads within equal coverage; the positive page
boost multiplies the strongest-field sum within those tiers. Title/URL break ties.
The global result limit precedes existing root grouping and menu group order.

Optional `sections` entries carry actual rendered `id` and `title`; content scope
also carries UTF-8 byte `start` offsets into the single stored body. Read IDs from
rendered content, including h1/h6 and shortcodes, instead of reconstructing them
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
The owning theme search checker and the site's real-corpus/browser tests cover
these additions; the maintained summary indexes keep the 2 MiB / 512 KiB budgets.

Built-in action IDs are `copy_markdown`, `copy_link`, `open_chatgpt`, `open_claude`, `view_markdown`, `view_history`, `edit_page`,
`create_child_page`, `create_issue`, `create_project_issue`, `print_section`, `print`, `switch_preset`, `switch_theme`, `switch_language`, `switch_version`, and `open_github`.
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
It provides no history, semantic search, personalization, or remote fallback.
Queries stay in the browser. No default telemetry is sent.

`OinkSurfaceCoordinator` coordinates the Palette, Appearance, Draw.io, Expo viewer, drawer, root, language, and version menus.
Each surface controls focus restoration and Escape.
Already closed Appearance menus do not restore focus when the coordinator closes them.
Keyboard navigation ignores editable controls and modals. The desktop nonmodal Appearance panel permits search shortcuts; its mobile modal sheet and other open dialogs, including fixed-position ARIA dialogs, retain keyboard ownership.
Inside the mobile drawer, Escape closes the root switcher first and returns focus to its trigger. A subsequent Escape closes the drawer. Moving focus outside the root switcher dismisses its popover.
`/`, `\`, `f`, and `c` open search or commands. `j`/`k` move between headings. `q`/`e` move between pages.
`h` changes presentation. `l`/`y`, `t`, and `r` open language, theme, and root choices.
Sidebar WASD/Arrow navigation uses real focus without changing Tab order.
Non-link divider buttons participate in tree navigation.
From a child, Left/`a` focuses its parent group. A second press collapses it.
Right/`d` opens closed groups or enters the first visible child of open groups.
Previous and next page navigation includes only links, never group buttons.

The outline uses one heading model and computed `scroll-padding-top` to derive the cursor and visible-heading range.
Its SVG line and dot share animated values, preventing drift.
Valid URL fragments are decoded. Malformed percent sequences use the literal heading ID.
This applies when indexing links and selecting requested headings near the page end.
No speculative DOM repair pass is allowed. The normal shell runtime always owns this tracking.
`params.ui.scroll_spy` and page `scroll_spy` remain quiet compatibility no-ops throughout 1.x.
They emit no separate runtime and may be removed only in a future breaking release.

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
`table` shows date/title/tag rows; without a layout switch, it lists the complete
section without pagination. With switching enabled, it uses the same page as
the other layouts.
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

`params.ui.blog_index_toggle` renders all four forms for the current paginator slice and lets readers cycle between them: `list`, `cards`, `table`, then `gallery`.
The fourth form is included in OINK 1.4.0.
The configured form controls initial display. Hidden forms load no images.
Stored reader preferences apply only to indexes that publish all four forms.
Sections without toggles publish one form and always show it.
Front matter or cascades override site mode per section.
Tables published without toggles remain complete, unpaginated archives.

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
The `t` shortcut still toggles light/dark through `switch_theme`;
`switch_preset` is the separate command-palette choice.

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
