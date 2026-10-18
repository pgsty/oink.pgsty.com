---
title: Shell and navigation contract
linkTitle: Shell and navigation
description: Navigation authorities, immersive blog presentation, search, actions, taxonomies, indexes, and page-end composition.
weight: 30
icon: fa-solid fa-window-maximize
search_keywords: [OINK shell, navigation contract, search, actions, blog presentation, authors, series, pager]
contract_status: v1.3.2
---

> [!NOTE] OINK 1.3.2 contract
> This contract describes OINK v1.3.2. Theme development uses the sibling
> checkout; release acceptance verifies the published module with replacements
> and workspaces disabled. Consumer adoption and deployment have their own checks.

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

`window.OinkSidebar` owns registered tree disclosures and movable TOC,
backlink, and taxonomy groups, independent of their current DOM parent.
`setExpanded(id, boolean, {source})` returns true for a valid target and false
for unknown IDs or non-boolean values. `getState(id)` returns a fresh
`{id, expanded}` snapshot or null. IDs are the existing `aria-controls` region
IDs; arbitrary elements outside the registered OINK groups cannot be changed.

Sources are `user`, `active-path`, `responsive`, and `api` (default). Every
writer commits `aria-expanded`, `td-is-open`, the localized label, and the
region's inert state before one `oink:sidebar-disclosure` document event with
`detail: {id, expanded, source}`. Repeated state writes emit no event. API
restoration keeps current-path ancestors expanded; explicit user disclosure
can still collapse them. Closing a region containing focus returns it to the
toggle before isolation.

`ready` is a Promise resolving to the API after initial hydration and responsive
placement; `isReady` and `oink:sidebar-ready` also expose completion to late
consumers. Optional persistence belongs to the site: await ready, read storage
inside a try/catch, and restore valid region IDs through the setter. OINK owns
whole-column collapse, width, and scroll persistence, not a version/locale
schema for reader-selected branches.

Desktop collapse and a closed mobile drawer make panel content inert and mark
the panel `aria-hidden`. Focus leaves before isolation; opening clears it
before focus enters. The panel itself remains the 16px pointer sensor, and the
external restore control remains active. Hover, Escape, backdrop dismissal,
breakpoint cleanup, and scroll unlocking retain their existing behavior.
These runtime attributes are not emitted into the no-JavaScript fallback.

Whole-column TOC collapse also isolates its hidden panel. If the collapsing
control held focus, focus moves to the visible floating restore button; restoring
the column returns focus to its visible column control. When the aside moves
into the mobile sidebar, its former column isolation is cleared before the
drawer owns interaction. The drawer's Tab trap includes only rendered,
non-inert controls, excluding hidden or collapsed descendants.

## Immersive blog presentation {#immersive-blog-presentation}

There is no article type or second shell. Immersive reading is four independent
keys on the ordinary blog shell, set on a page or section cascade; the section
index repeats values it also needs:

```yaml
featured_image: hero
toc_style: flow
toc_taxonomies: false
sidebar_enabled: false
```

The blog shell renders no breadcrumb by default—an article reads as a
standalone piece—so the recipe needs no key for it. `breadcrumb` remains an
ordinary key a page or cascade may still set either way, on any shell.

`hero` uses the shared featured image as a decorative full-bleed backdrop on
single pages and section indexes. With no image it renders the normal opening;
`banner` and `wash` remain single-page modes. The navbar overlays a hero on a
contrast scrim and scrolls with it.

`toc_style` is `fixed` or `flow`; flow places a wider rail beside the article
and pins it only after scrolling. Its resting place aligns with the article's
info line, or its description where a page has no info line. `docs-shell.js`
measures the offset because a title wraps to an unknown number of lines;
without JavaScript the rail starts where the article starts.
`toc_taxonomies: false` removes term clouds; a rail with neither TOC nor clouds
renders nothing. `notoc` remains the page-level TOC opt-out. These switches do
not change bylines, tags, series, pager order, feeds, or page-end composition,
and the rail disappears below the `xl` breakpoint.

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

Built-in action IDs are `copy_markdown`, `copy_link`, `open_chatgpt`, `open_claude`, `view_markdown`, `view_history`, `edit_page`,
`create_child_page`, `create_issue`, `create_project_issue`, `print_section`, `print`, `switch_preset`, `switch_theme`, `switch_language`, `switch_version`, and `open_github`.
Outside the share bar, `copy_link` appears only in the Palette.
Site commands under `languages.<lang>.params.ui.command_palette.commands` may open safe URLs or invoke built-in IDs. They never inject JavaScript.
The legacy clipboard fallback restores previous focus and selection, including selection direction.
It does not reclaim focus if another control acquired it during copying.

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

Trusted site JavaScript may call
`OinkCommandPalette.registerSearchTail({id, rows, activate})`; YAML and the
action manifest remain data-only. The bundle stays conditional on local search.
Registration requires a unique ID matching `[A-Za-z0-9][A-Za-z0-9_-]*` and two
functions; invalid or duplicate registrations throw. The returned unregister
function is idempotent and cannot remove a later registration reusing the ID.
Live changes schedule one owned render; removal cancels that provider's pending action.

`rows(context)` synchronously returns descriptors. Context is a frozen snapshot
`{query, locale, phase, pageResultCount}`: query is trimmed; locale is the HTML
language tag; phase is `results`, `empty`, or `error`; count covers only local
page results after the limit. Providers run only for settled, non-empty text
search, never empty, command, choice, or loading states. Rows follow all native
results and actions in the localized Actions group, in registration order.
Native empty/error messages and input-triggered index retry remain available.

Each descriptor requires a unique per-provider `id` with the same ID syntax and
a non-empty string `title`. Optional `description`, `icon`, and `disabledReason`
are strings; `available` is boolean, default true. OINK copies and freezes these
fields and renders display strings as text. Invalid descriptors, duplicate IDs,
an asynchronous return, or a thrown callback discard that provider for the
render without affecting other providers. No callback-count promise is made.

`activate(row, context)` runs only through ordinary row activation. It receives
the copied descriptor and its original context plus an `AbortSignal` and a
`handoff()` function. Pending activation blocks all other row activations,
including entry into native choice menus. Synchronous throws
and rejected promises release pending state, keep the Palette open, and announce
the localized action-failed message. Fulfillment values are ignored; success
closes the Palette without stealing focus from another surface. Closing,
reopening, changing the rendered query, or unregistering cancels pending work;
late settlement cannot modify a newer session.

Before opening another coordinated surface, call `context.handoff()`. It closes
the Palette without returning focus or aborting that activation. The consumer
then owns the new surface's focus and error UI. A later Palette session or
unregistration can still cancel unfinished work; successful completion does not
abort a handed-off operation. OINK imposes no timeout.

`rows()` must remain pure. This is a trusted-code contract, not a sandbox. The
default query remains local, with no remote provider or telemetry bundled.
Any extension network behavior and provider consent belong to the site.

Desktop nonmodal Appearance permits search shortcuts; mobile modal Appearance
and every other open dialog retain keyboard ownership. In the mobile drawer,
Escape dismisses the focused root switcher first and returns focus to its toggle;
a second Escape closes the drawer. Focus leaving the switcher dismisses it.
Search opened from the Landing drawer returns focus to the visible menu toggle.
Choosing a visual preset in the Palette keeps it open for the next action.

## Share {#share}

`params.ui.share` is empty by default and accepts any ordered subset of 16
targets: `x`, `bluesky`, `mastodon`, `facebook`, `linkedin`, `reddit`,
`hackernews`, `telegram`, `whatsapp`, `line`, `pinterest`, `weibo`, `chatgpt`,
`claude`, `email`, and `copy`. A page list replaces its inherited list;
`share: false` opts out. Unknown entries warn and are dropped. Only regular
pages render the bar; print, Markdown, and RSS omit it.

Targets are plain intent links carrying the page permalink/title, plus the
local `copy_link` button. Pinterest media comes from the shared featured-image
resolver. ChatGPT and Claude receive build-time permalink prompts and are
independent of page-menu assistant actions. Discord has no public intent target
and is deliberately absent.

The bar loads no platform SDK, iframe, script, stylesheet, counter, or campaign
parameter and makes no request until a reader activates a link. It is one
accessible labeled glyph row. `share/items.html` resolves targets and
`share/bar.html` renders them.

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
Publication gates reject the warning with `--panicOnWarning`.

`upstream_modified` changes the credit verb and links commit history within the existing attribution sentence.
The notice page includes complete license and warranty text.
`params.ui.translation_notice` enables translation notices. The page key `translation_notice` can cascade.
Notices skip generated pages and pages without bodies. Natively authored pages can use `translation_notice: false` to disable them.

## Authors and series {#authors-and-series}

A blog article head is title, info line, term badges, byline, then the series
strip; the description leads the body below them. The info line
(`article-info.html`) always carries the date; with `reading_time` on it adds
the word count and the minutes. Front matter `upstream_link`—the same per-page
fact the annotation attributes—adds a localized link to the original, gated by
the shared URL policy. Term rows are bare badge runs whose taxonomy name lives
on the group label, not as a visible prefix. At rest a term badge is a pale
neutral chip with muted ink, led by the taxonomy's term glyph; a linked badge
picks up the current section's accent wash, border, and ink on hover or focus.
`taxonomy-icon.html` owns the vocabulary—each taxonomy pairs a whole-taxonomy
glyph with a term glyph (`folder-open`/`folder`, `tags`/`tag`, `cubes`/`cube`,
`users`/`user-pen`, `book-bookmark`/`book` for series, generic `shapes`)—and
`params.ui.taxonomy_icons` overrides a pair with one string for both surfaces
or a `taxonomy`/`term` map; unusable input warns and keeps the built-in. The
right-rail cloud wears the whole-taxonomy glyph on its head alone: cloud chips
stay text plus count, because repeating the glyph beside an announced taxonomy
is noise. A standalone taxonomy directory card carries one term glyph; the
byline carries the people
alone—portrait, name, and the profile's one-line bio—with no label and no date.
List rows, cards, and term archives share one metadata line of the same shape:
date, one localized author-and-section phrase, then word count and minutes
behind the same `reading_time` switch. Under that sentence sits one wrapping
badge line with every taxonomy's terms, taxonomies in alphabetical order, each
badge wearing its term glyph; cards leave out `authors`, whom their sentence
already names.

Authors activate only through `taxonomies: {author: authors}`. The profile term
page owns display name, summary, body, and featured-image avatar; an absent
profile falls back to link title, initial, and archive. `authors-resolve.html`
preserves front-matter order for article heads, list rows, and one RSS
`dc:creator` per author. Legacy `author` remains unchanged when `authors` is
absent; when both exist, `authors` wins without warning. Custom author taxonomy
plurals behave as ordinary taxonomies.

Series activate only through `taxonomies: {series: series}`. Term pages own the
introduction; no parameter, data file, cover model, or runtime is added. A page
uses `series: [name]` and optional `series_weight`. `series-pages.html` orders
weighted members first by weight, then unweighted members by ascending date,
with `Path` tie-breaks; strip and term page share it. The first named series gets
one HTML/print strip. The panel is translucent over a blur rather than an opaque
card, because a `hero` article paints its featured image behind this band and an
opaque ground would punch a hole through the picture; on a plain article the tint
resolves to the page's own ground, so one treatment serves both. Its summary owns
the full bar and trailing caret, while the series name -- its taxonomy icon
included -- remains a sibling link laid over a hidden width reservation so the
summary never contains a nested interactive control. Opening the bar rules a
hairline under it and places the reading order in one adaptive grid on the same
surface, preserving DOM order. Every member link owns its ordinal, set at the end
of a fixed square track so the titles hold one edge at any list length; equal
cells stay one column when narrow and add columns only while each title retains a
readable measure, so a desktop panel uses its width without stretching one
selected row across it. Hover and the reader's own place borrow the two grounds
sidebar navigation already uses for those states, and the current member adds a
filled ordinal and a heavier title, so the cue is never colour alone. Print shows the same list expanded in one column. Singleton
series and non-HTML outputs omit it. Numbering, cross-references, and aggregate
output remain Book concerns.

The default article taxonomy chips omit reserved `authors` and `series` because
their dedicated surfaces already carry them. Explicit
`params.taxonomy.page_header` restores either.

## Blog indexes and page composition {#blog-indexes-and-page-composition}

Blog section indexes use `params.ui.blog_index`: `list` (default) and `cards`
are one flat run, newest first, sharing `blog_index_size` pagination—the
metadata line's dates make year headings redundant; `table` shows the whole
section as date/title/tag rows without pagination. Cards use the shared lead
image, localized date/author/section metadata, tags, and a three-line summary.

A taxonomy page (`/tags/`, `/authors/`) and its term pages share one head,
`shell/taxonomy-head.html`. The taxonomy page opens with the whole-taxonomy
glyph in a tinted tile, the localized name, and a count of terms. A term page
opens with the term's title and its page count from `ui_taxonomy_pages`, using
the current locale's CLDR plural form; where no breadcrumb is rendered, a kicker above the
title names the taxonomy and links back to it, since an enabled trail already
does both one line higher: a crumb standing for a generated taxonomy page
borrows the same localized label the head renders, not Hugo's plural title.
Under the head the taxonomy page lays its terms out as a grid of one-line
cards, `shell/taxonomy-cards.html`, most-used first with alphabetical ties—the
order the rail cloud already uses—filling equal columns by `auto-fill` so a
short taxonomy never stretches two cards across the page. A card is the term
glyph, the term, and its page count, and the whole card is the link; authors
alone lead with the byline's small portrait through the same avatar partial.
No card carries a description or a newest page: a term has nothing to say
that its title and count do not, and the extra line only blurred the grid.
There is no filter chip row and no "All" chip: the section root already lives
in the sidebar and the navbar. Term pages stay row lists, and author profiles
keep their own head.

The rail on a taxonomy or term page leads with `shell/taxonomy-switcher.html`:
one row per declared taxonomy—whole-taxonomy glyph, localized name, term
count—linking to its index page, the current taxonomy on the selected ground.
It is the way from one taxonomy's pages to another's, because cloud chips jump
to terms and cloud heads only collapse; a site with one taxonomy renders no
switcher. The group sits behind the same `toc_taxonomies` switch as the clouds.
A taxonomy page scopes its clouds to the whole site (`taxonomy-root.html`
returns no root for that kind) and omits its own cloud, whose terms are the
cards beside it; term pages keep the section scope and the full set.

`params.ui.blog_index_toggle` renders all three forms for the current paginator
slice and lets readers cycle them. The configured form controls first paint and
hidden forms load no images. A reader's stored choice is scoped to indexes that
publish all three forms: a section whose toggle is off publishes one form and
always shows it. A front-matter value or cascade overrides the site mode per
section. A table published without the toggle remains a complete, unpaginated
archive.

`params.logo` is always the brand mark; `params.wordmark`, or the site title, is
the text half hidden at compact widths. Docs, Book, Blog, and Swagger share one
shell model. Page-end order is Share, Feedback, Annotation, Pager, Comments.
Docs/Book pager follows sidebar preorder; Blog uses weight then reverse date;
`pager: false` opts out. Static outputs omit pager UI.

Every rendered footer style keeps an icon-only utility dock at the end of its
bottom line: version, language, theme, then keyboard help. Its menus open upward;
the version trigger never exposes the current branch or release label. The fat
footer's collapse chevron follows the dock. Below `lg` the bottom line gives up
its copyright/center/dock columns and stacks them as three centered full-width
rows, the dock last. These global controls do not render in the sidebar footer,
and `footer_style: none` removes the whole bottom line.

There is no archive shell, arbitrary-depth flyout, second navigation authority,
query upload, or browser compatibility shim for removed config. Feedback emits
only `docs_feedback` through an existing `gtag`, stores the choice locally, and
does not replace Giscus.

An explicit `params.ui.quick_links: []` disables quick links instead of restoring
the defaults. Invalid `sidebar_root_link_self` values warn and keep the documented
`true` fallback. Taxonomy and term pages use the shared `page_width` validator,
including its warning-fatal publication gate.

## Verification {#verification}

`bin/check-navigation-contract.py`, `bin/check-shell.py`, JS tests, output
goldens, and the consumer browser suite cover navigation, language/subpath
links, blog variants, page-end order, keyboard behavior, accessibility, and
responsive layout.

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

The local Ink/Terminal experiments require explicit configuration;
`preset_menu: true` continues
to offer Paper/Slate plus the site default. Both reuse the same state, keyboard,
command-palette and bottom-sheet mechanisms. Terminal compacts desktop
navigation rows, while prose and mobile touch targets retain their sizes.

## Expo albums {#expo-albums}

The new `type: expo` reuses this shell and adds image-album presentation.
The [Expo contract](/docs/design/expo/) owns its content model, controls, and outputs.
