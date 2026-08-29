---
title: Shell and navigation contract
linkTitle: Shell and navigation
description: Navigation authorities, immersive blog presentation, search, actions, taxonomies, indexes, and page-end composition.
weight: 30
icon: fa-solid fa-window-maximize
search_keywords: [OINK shell, navigation contract, search, actions, blog presentation, authors, series, pager]
contract_status: released-v0.8.1
---

> [!IMPORTANT] OINK 0.8.1 contract
> This is the shell and navigation contract released with OINK 0.8.1. This
> page is the canonical English source; its Chinese peer is maintained beside
> it in `content/docs/design/`.

## Authorities and navigation {#authorities-and-navigation}

| Concern | Authority |
| --- | --- |
| Global navigation | Hugo `menus.main` |
| Docs / Book sidebar and pager | content tree or `data/docs_nav.json` |
| Root switcher | resolved top-level content roots |
| Discovery | per-language local search index |
| Page and Palette actions | shared action registry |

No feature introduces another menu or page tree. One menu child level is
interactive; deeper levels warn and flatten beneath linked group headings.
External links use `target="_blank" rel="noopener noreferrer"`; internal links
remain language- and subpath-aware.

Navbar desktop and drawer views project one tree, and every dropdown panel is
one moderate column of icon-and-title rows — the mega panel and its `columns`
menu parameter are retired, and a configured `columns` warns while keeping the
single column. Menu descriptions are configuration data only. The link tree
stays
true-centered at every width: text links from lg, icon links below. Between lg
and md the end edge keeps search, version, language, theme, and GitHub with no
menu button. Below md those utilities move to the footline dock, and Home or
explicit Landing pages add one drawer entry beside search that opens the full
labelled tree; no other width or surface renders a drawer entry. Language
links target the
page translation or that language's home, stay relative when languages share a
host/base path, and become absolute only for language-specific `baseURL`s;
`hreflang` stays absolute. `navbar_autohide` applies to fine pointers from
768px, never touch or drawer widths, and the hidden bar keeps its slot: the
layout reserves the navbar band in both states, a pinned bar occupies exactly
that band with its rule inside it, revealing fades the bar in place without
covering resting content, and hero pages ignore the policy in favour of their
overlay bar. The home page owns the same soft boundary a hero page does: its
navbar carries no bottom rule and no scrolled shadow, resolving into a short
wash below the bar instead.

Sidebar and pager share root and order. `manual_link`, `build.render: link`,
dividers, hidden nodes, and placeholders retain their documented semantics.
`sidebar_icon_policy` is `all` (default), `groups`, or `none`; icons are one
Font Awesome class pair. Invalid policies follow the shared warning/fallback
contract.

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

## Search, actions, and runtime {#search-actions-and-runtime}

`params.offline_search` opts into a local per-language index. When enabled it
also builds under `hugo server` by default; set `offline_search_on_serve: false`
for large edit loops. HTML search appears on Home, shell pages, and Landing when
`landing_search` is enabled. Other non-shell pages and Print omit the dialog,
Lunr, and Palette.

Search metadata is `search_keywords`, `search_boost` (default 1), and
`search_exclude`. The index carries URL, title, taxonomies, excerpt, headings,
description, body/summary, root, section, type, keywords, boost, breadcrumb,
and icon. Fixture budget is 2 MiB raw / 512 KiB gzip. Sites may return extra
strings from `hooks/search-keywords-extra.html`.

Built-in action IDs are `copy_markdown`, `copy_link`, `open_chatgpt`,
`open_claude`, `view_markdown`, `view_history`, `edit_page`,
`create_child_page`, `create_issue`, `create_project_issue`, `print_section`,
`print`, `switch_theme`, `switch_language`, `switch_version`, and
`open_github`. `copy_link` is Palette-only outside the share bar. Site commands
under `languages.<lang>.params.ui.command_palette.commands` may open a safe URL
or invoke a built-in ID, never inject JavaScript.

The Palette has empty, text-search, and `>` command modes; quick links derive
from navigation. It has no history, semantic search, personalization, or remote
fallback. Search queries stay in-browser and no default telemetry is sent.

`OinkSurfaceCoordinator` arbitrates Palette, drawer, root, language, and version
menus. Surfaces own focus restoration and Escape. Keyboard navigation ignores
editable controls and modals: `/`, `\`, `f`, `c` open search/commands; `j`/`k`
move headings; `q`/`e` move pages; `h` changes presentation; `l`/`y`, `t`, and
`r` open language, theme, and root choices. Sidebar WASD/Arrow navigation uses
real focus without rewriting Tab order.

The outline derives cursor and visible-heading range from one heading model and
the scroller's computed `scroll-padding-top`; its SVG line and dot share the
same animated values so they cannot drift. No speculative DOM repair pass is
allowed.

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

Page annotation resolves descriptors in `annotation-items.html` and renders
them through `page-meta-lastmod.html`; either may be overridden narrowly. Lines
appear in this order:

| Line | Condition |
| --- | --- |
| Last modified | `Lastmod` is set |
| Upstream | front matter `upstream_link` is non-empty |
| Translation | configured authoritative language has a translation and this page has authored text |

`upstream_link` is per-page; a cascade counts, and `upstream_link: ""` opts out.
Other upstream facts resolve site params → `data/upstreams[upstream_source]` →
front matter: `upstream_name`, `upstream_copyright`, `upstream_license`,
`upstream_notice`, optional `upstream_ref`, and `upstream_modified`. The first
four are required with a link. Invalid or incomplete attribution warns and
emits no legal notice; unsupported URLs are refused. Publication gates reject
the warning with `--panicOnWarning`.

`upstream_modified` changes the credit verb and links commit history; it adds no
line. The notice page carries full license/warranty text. Translation notice is
opt-in through `params.ui.translation_notice`, cascades as the page key
`translation_notice`, skips generated or bodyless pages, and can be disabled on
a natively authored page with `translation_notice: false`.

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
and the term-archive filter chips stay text plus count, because repeating the
glyph beside an announced taxonomy is noise. The byline carries the people
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
Term and taxonomy pages stay row lists.

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

## Verification {#verification}

`bin/check-navigation-contract.py`, `bin/check-shell.py`, JS tests, output
goldens, and the consumer browser suite cover navigation, language/subpath
links, blog variants, page-end order, keyboard behavior, accessibility, and
responsive layout.
