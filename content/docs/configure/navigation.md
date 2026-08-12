---
downstream_modified: true
title: Navigation and menus
weight: 50
icon: fa-solid fa-bars
description: Configure navigation, language switching, sidebars, and outlines.
---

OINK combines Hugo's content tree and menu model with a documentation workspace:
a global navbar, a collapsible and resizable section sidebar, and a collapsible
page outline. The same structure works for English, Chinese, and right-to-left
languages.

## Site navbar

The global navbar is built from Hugo's `main` menu plus OINK-generated controls.
Depending on configuration and page type, it can include version, language,
color-mode, and search controls.

### Adding `main` menu entries

Define a menu entry in page front matter:

```yaml
---
title: Documentation
linkTitle: Docs
menu:
  main:
    weight: 20
    pre: <i class="fa-solid fa-book" aria-hidden="true"></i>
---
```

Lower weights appear first. A site-level external link is similar:

```yaml
menus:
  main:
    - name: GitHub
      identifier: github
      weight: 50
      url: https://github.com/pgsty/oink
      pre: <i class="fa-brands fa-github" aria-hidden="true"></i>
```

Use an `identifier` for configuration that refers to a menu item. Localize
`name` or `linkTitle` in language configuration, but keep identifiers stable.

### Version menu

The selector appears when `params.versions` is configured. Each entry can be a
heading, separator, release, development build, or site variant:

```yaml
params:
  version: v1.0.0
  version_menu: v1.0.0
  version_menu_pagelinks: true
  versions:
    - version: v1.1.0-dev
      kind: next
      url: https://next.example.org/
    - version: v1.0.0
      kind: latest
      url: https://docs.example.org/
```

`version` identifies the published site variant and is not necessarily a Git
ref. Commands that require a resolvable tag should use the project's explicit
release-ref parameter instead. With page links enabled, OINK first tries the
equivalent path on the target version and otherwise uses its configured URL.

### Language menu

OINK builds language targets from Hugo's `AllTranslations`. When a translated
peer is missing, the target language's home page is used instead of a broken
URL. One configured language hides the control. With two or more languages, a
click advances to the next language by weight, while hovering for half a second
or focusing the control opens the complete menu. The current site cycles from
English to Simplified Chinese and back. Targets include `lang`, `hreflang`,
locale, and text-direction attributes.

### Light/dark theme menu

When color-mode support is enabled, the navbar and documentation workspace show
a theme control. See
[Light/dark-mode menu](/docs/appearance/styling/#lightdark-mode-menu).

### Search box

The documentation workspace uses a local search dialog when offline search is
enabled. The sidebar button advertises the platform shortcut (Command/Ctrl+K).
Online search integrations remain available by explicit configuration. See
[Search](/docs/advanced/search/).

### Adding icons to the navbar

Use `pre` or `post` on a menu entry. OINK includes the free local Font Awesome
assets:

```yaml
menus:
  main:
    - name: Source
      identifier: source
      url: https://github.com/pgsty/oink
      weight: 50
      pre: <i class="fa-brands fa-github" aria-hidden="true"></i>
      post: <span class="visually-hidden"> (external)</span>
```

Decorative icons need `aria-hidden="true"`; the link itself must retain a useful
text or accessible label. External links that open a new tab must use
`rel="noopener"`.

## Side navigation {#side-nav}

The left panel on docs and blog pages is generated from the content hierarchy.
OINK orders entries by `weight` and uses `linkTitle` when present. Sections come
from `_index.md` files; translated sections need a peer `_index.zh.md` so their
navigation metadata is localized.

Hide a page from the sidebar with:

```yaml
toc_hide: true
```

Hide it from a section landing-page summary with `hide_summary: true`. Set both
only when the page should be absent from both discovery surfaces.

### Side-nav options

The common controls are:

```yaml
params:
  ui:
    sidebar_menu_compact: true
    sidebar_menu_foldable: true
    sidebar_menu_truncate: 128
    sidebar_cache_limit: 2000
    sidebar_search_disable: false
    sidebar_width_min: 220
    sidebar_width_max: 480
    sidebar_item_overflow: ellipsis
```

- `sidebar_menu_compact` shows the active branch and nearby entries.
- `sidebar_menu_foldable` lets readers expand or collapse sections.
- `sidebar_menu_truncate` limits entries and emits a build warning when the
  limit is too small.
- `sidebar_cache_limit` enables shared navigation markup above the configured
  site size.
- `sidebar_width_min` and `sidebar_width_max` clamp the desktop drag-resizer.
- `sidebar_item_overflow` is `ellipsis` by default; use `wrap` for long labels.

The reader's collapse state, width, and scroll position are preserved locally.
The mobile view becomes a dismissible drawer with a backdrop and focus-safe
controls.

### Adding icons to the side nav

Set `icon` in page front matter:

```yaml
---
title: Operations
icon: fa-solid fa-screwdriver-wrench
---
```

Use icons consistently across siblings. They are secondary cues, not a
replacement for text labels.

### Adding manual links to the side nav

Create a placeholder page at the desired position:

```yaml
---
title: API status
weight: 90
manualLink: https://status.example.org/
manualLinkTitle: Live service status
manualLinkTarget: _blank
---
```

Use `manualLinkRelref` instead of `manualLink` for an internal content
reference; Hugo then fails the build if it cannot resolve the destination. OINK
adds `noopener` for new-tab links. Include a short body explaining the
destination because Hugo still generates a page for the placeholder.

### Section as sidebar root (EXPERIMENTAL) {#sidebar-root}

Enable rooted sidebars:

```yaml
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

Then set a section's `_index.md`:

```yaml
---
title: API Reference v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

`self` applies the root to the section index and descendants; `children` keeps
the index in the parent tree but roots its descendants. The optional root menu
lets readers switch between roots. Rooted sections can nest, but redundant or
invalid values produce build warnings.

## Table of contents (TOC) {#table-of-contents}

Hugo builds the right-side page outline from Markdown headings. OINK renders it
as a fixed documentation panel with quick links, language and theme controls,
repository metadata, and taxonomy terms. Readers can collapse the panel; its
state is stored locally.

Headings emitted by Markdown shortcodes (`{{%/* ... */%}}`) participate in
Hugo's table of contents. Headings emitted only by standard shortcodes
(`{{</* ... */>}}`) generally do not, so content structure should remain in
Markdown whenever possible.

### TOC customization

Hide the outline on one page:

```yaml
notoc: true
```

Configure which heading levels Hugo includes:

```yaml
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
```

Localize labels such as `toc_on_this_page` in the site's i18n bundle. If custom
CSS changes the outline rail or fixed-panel dimensions, test active tracking,
zoom, keyboard focus, and pages with no headings.

### Active TOC entry tracking with ScrollSpy {#toc-entry-tracking}

OINK uses a local Bootstrap ScrollSpy patch and IntersectionObserver to track
the active heading. The workspace draws a continuous rail, active segment, and
position marker. Disable tracking for a page with:

```yaml
params:
  ui:
    scrollSpy:
      disable: true
```

The legacy ScrollSpy configuration also accepts a global `rootMargin`. Changing
it affects when an entry becomes active and should be tested with short
sections, long sections, and direct fragment navigation.

#### Advanced ScrollSpy customization

Prefer configuration and project CSS. Overriding the ScrollSpy attribute partial
or `docs-shell.js` creates an implementation-level fork; add browser fixtures
for hash updates, back/forward navigation, resizing, reduced motion, and pages
that contain duplicate or missing IDs.

## Breadcrumb navigation

Breadcrumbs are shown above ordinary content pages and in taxonomy results.
Disable them globally:

```yaml
params:
  ui:
    breadcrumb_disable: true
    taxonomy_breadcrumb_disable: true
```

The same `ui.breadcrumb_disable` value can be set in a page or section cascade.
Breadcrumb labels come from localized page titles and must follow the same
logical hierarchy as the sidebar.

## Heading self links

Enable OINK's heading render hook in a consuming site:

```go-html-template
{{ partial "td/render-heading.html" . }}
```

The generated `.td-heading-self-link` control uses `#` by default. It remains
visible on touch devices and appears on hover or focus for pointer devices. Keep
the link keyboard reachable and preserve a scroll offset that clears fixed
navigation.

## Heading aliases and in-page targets <a id="a-heading-aliases"></a> {#heading-aliases}

Changing a heading can break inbound fragment links. Treat its ID as a public
route. To rename an ID, retain the old one as an empty anchor and set the new
one explicitly:

```html
## Quickstart <a id="get-started"></a> {#quickstart}
```

Use an empty `<a id="..."></a>` for an alias or other in-page target. Do not use
a `span` solely as a fragment target. IDs must be unique, stable, ASCII where
practical, and identical across language variants.

## Quickstart <a id="get-started"></a> {#quickstart}

This live heading demonstrates that both `#get-started` and `#quickstart` reach
the same location. Translated headings should write the English rendered ID
explicitly rather than relying on language-specific automatic slug generation.

### Implementation notes {#heading-aliases-implementation-notes}

- The document sets a global scroll offset for fixed chrome.
- Built-in block targets use `td-anchor-no-extra-offset` to avoid applying the
  additional offset twice.
- The translation audit compares rendered heading IDs between English and
  Chinese pages.
- Removing an old alias is a breaking documentation change and needs a redirect
  or an explicitly documented compatibility decision.
