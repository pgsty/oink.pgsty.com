---
downstream_modified: true
title: Navigation and menus
weight: 20
description: Configure navigation, language switching, sidebars, and outlines.
---

OINK combines Hugo's content tree and menu model with a documentation workspace:
a site navbar on every layout, a collapsible and resizable section sidebar, a
collapsible page outline in the right rail, and a site footer. The same
structure works for English, Chinese, and right-to-left languages.

## Site navbar

The navbar is built from Hugo's `main` menu plus OINK-generated controls: the
version selector, the language selector, the color-mode control, search, and the
project repository link. It renders on **every layout** — landing pages, docs,
blog, Swagger, and taxonomy pages alike — so the same site-level navigation is
one click away from anywhere.

### Turning the navbar off {#navbar-enabled}

`navbar_enabled` defaults to `true`. Turn the navbar off for the whole site, for
one section through a front-matter cascade, or for a single page:

```yaml {filename="hugo.yaml"}
params:
  ui:
    navbar_enabled: false
```

```yaml
---
title: Standalone report
navbar_enabled: false
---
```

Front matter wins over the site parameter, and an explicit `false` is honored at
every level. Without the navbar OINK restores the chrome the navbar replaced:
the mobile subnav, the sidebar's brand and search rows, the utility buttons on
the TOC rail, and the sidebar footer utilities. Use it for a page that has to
own the full viewport, not as a general layout preference.

### Two states, no separate mobile menu {#navbar-states}

The navbar has exactly two states:

| Width       | State                                                      |
| ----------- | ---------------------------------------------------------- |
| `lg` and up | Full: brand, menu labels, and the utility controls         |
| Below `lg`  | Compact: the logo, then every item as a right-aligned icon |

Compact is not a reduced menu. Menu entries keep their icons, search stays a
magnifier, and the version, language, and theme controls stay where they are —
nothing collapses into a hamburger, because there is no separate mobile menu to
collapse into. The one width-gated control is on shell pages below `md`, where
an extra icon opens the sidebar drawer.

> [!NOTE] `navbar_accordion_single_open` is retired. The parameter is ignored;
> remove it from existing configuration.

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

### Nested dropdowns {#nested-menus}

Top-level menus support **one level of dropdown**. Use Hugo's `parent` to
establish the relationship:

```yaml {filename="hugo.yaml"}
menus:
  main:
    - identifier: docs
      name: Docs
      pageRef: /docs
      weight: 20
    - identifier: docs-tutorial
      parent: docs
      name: Get started
      pageRef: /docs/tutorial
      weight: 10
      params:
        icon: fa-solid fa-route
        description: Install OINK and build your first site
```

A child's `params.description` renders under its title in the dropdown, helping
a reader decide where to go.

One interaction detail matters: **the parent is a plain link**. Its panel opens
on hover and on keyboard focus, and clicking or pressing Enter navigates to the
parent page. There is no disclosure caret to press, and no state in which the
parent page is captured by its own menu. Escape closes the panel and leaves
focus on the link; touch users navigate straight to the parent page, which
carries the same links in its own content.

> [!NOTE] Only one child level is interactive. Deeper entries emit a build
> warning and degrade to static group headings — they never create a third-level
> flyout. Deep information architecture belongs in the content sidebar, not the
> top menu.

### Version menu

The selector appears when `params.versions` is configured. It is a branch icon
that opens its list on hover or keyboard focus, sharing one popover style with
the language and theme controls. Each entry can be a heading, separator,
release, development build, or site variant:

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
URL. One configured language hides the control. With two or more languages, the
language icon advances to the next language by weight on click, while hovering
for half a second or focusing it opens the complete menu. The current site
cycles from English to Simplified Chinese and back. Targets include `lang`,
`hreflang`, locale, and text-direction attributes.

### Light/dark theme menu

When color-mode support is enabled, the navbar shows a theme control. Clicking
it toggles light and dark; hovering or focusing it opens a **System / Light /
Dark** picker, where System follows the reader's operating system. See
[Light/dark-mode menu](/docs/appearance/styling/#lightdark-mode-menu).

### Search box

Search is a magnifier icon in the navbar. It opens the Command Palette, as do
`Cmd/Ctrl-K` and, outside editable controls, `/`. The icon appears when offline
search is enabled; with the navbar disabled the search row returns to the top of
the sidebar. Online search integrations remain available by explicit
configuration. See [Search](/docs/advanced/search/).

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

Below `lg` the icon is all that remains of a menu entry, so give every top-level
entry a `pre` icon. An entry without one has nothing to show in the compact
state.

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
---
```

Use icons consistently across siblings. They are secondary cues, not a
replacement for text labels.

### Sidebar icon density {#sidebar-icon-policy}

An icon on every leaf page produces noticeable visual noise. Control the density
with `sidebar_icon_policy`:

```yaml {filename="hugo.yaml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| Value    | Effect                                                             |
| -------- | ------------------------------------------------------------------ |
| `all`    | Every eligible sidebar entry shows its icon                        |
| `groups` | Only roots and nodes with children show icons; plain leaves do not |
| `none`   | Sidebar entry icons are omitted entirely                           |

The compatibility default for an unset value is `all`. **New sites should set
`groups` explicitly** — it keeps the semantic marker on groups while removing
the noise at leaf level. This site uses that setting.

An invalid value warns and falls back to `all`.

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

### Section as sidebar root {#sidebar-root}

The sidebar tree is rooted at the reader's current top-level section, and the
row above the tree names that root. A large sub-tree — a versioned API
reference, a separate handbook — can become a root of its own so readers can
switch into it without leaving the section:

```yaml
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

Then set a descendant section's `_index.md`:

```yaml
---
title: API Reference v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

`self` applies the root to the section index and descendants; `children` keeps
the index in the parent tree but roots its descendants. Rooted sections can
nest, but redundant or invalid values produce build warnings.

The switcher is **scoped to the current top-level section**. Its entries are
that section itself, which is the default, plus every descendant that sets
`sidebar_root_for: self`. Sibling top-level sections are not listed — moving
between Docs and Blog is the navbar's job. A section with no switchable
descendant therefore shows no dropdown at all: the row is a plain, unboxed link
to the section landing page, flush with the tree's top-level rows.

Taxonomy term pages have no content ancestry, so a term adopts the top section
its members share. Following a tag from a docs page keeps the docs tree and the
docs root link instead of falling back to the site-wide tree; a term whose
members span several sections shows no root row.

## Table of contents (TOC) {#table-of-contents}

Hugo builds the right-side page outline from Markdown headings. OINK renders it
as the first group in a fixed right rail, followed by the taxonomy clouds for
the current section. Readers can collapse the rail; its state is stored locally.

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

### Right-rail groups {#rail-groups}

Every group in the rail uses the same header row: an icon, a title, and a
chevron, with the whole row highlighting as one item. The outline group is
titled **Content**, and its icon is a three-line glyph that collapses the rail
rather than a decoration. In the sidebar drawer the same group keeps a static
three-line icon so it reads like the taxonomy heads beside it.

Taxonomy group icons are configurable by plural taxonomy name:

```yaml {filename="hugo.yaml"}
params:
  ui:
    taxonomy_icons:
      categories: fa-solid fa-folder
      tags: fa-solid fa-tags
      projects: fa-solid fa-diagram-project
```

`categories` defaults to a folder and `tags` to tags; any other taxonomy gets a
generic shapes glyph until it is named here. See
[Taxonomy support](/docs/content/taxonomy/#sidebar-and-rail) for how the clouds
themselves are scoped.

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

Breadcrumbs are shown above ordinary content pages and in taxonomy results, and
that row also carries the page actions. Top-level section pages keep their
one-crumb breadcrumb so the row stays anchored at every depth. Disable
breadcrumbs globally:

```yaml
params:
  ui:
    breadcrumb_disable: true
    taxonomy_breadcrumb_disable: true
```

The same `ui.breadcrumb_disable` value can be set in a page or section cascade.
Breadcrumb labels come from localized page titles and must follow the same
logical hierarchy as the sidebar.

### Page actions {#page-actions}

The page actions are an icon-only split button at the end of the breadcrumb row.
The primary half copies the page's Markdown and flips to a green check on
success; the caret opens a menu of ten actions in two halves. The reading half
takes the page somewhere else:

- Copy Markdown
- Open in ChatGPT
- Open in Claude
- View markdown
- View edit history

A separator follows, then the acting half, which changes or produces something:

- Edit this page
- Create child page
- Create docs issue
- Create project issue
- Print entire section

Configured `page_context_menu.links` come last, after a second separator. Every
entry appears only when it can resolve: the Markdown actions need the `markdown`
output format, the repository actions need `github_repo`, the project issue
needs `github_project_repo`, and the assistant actions need
`params.ui.page_context_menu.assistant_links`.

On the blog root and its first-level sections the primary half is the RSS link
instead of the copy control, and the menu still offers Copy Markdown. Blog leaf
pages carry no feed icon. A page with no Markdown output drops the primary half
and renders a labeled **Actions** button instead.

`create_child_page`, `create_project_issue`, and `print_section` are first-class
registry actions, so they appear in the
[Command Palette](/docs/advanced/search/#palette-contents) too. The page-level
`print` action is retired; readers use the browser's own `Cmd/Ctrl+P`.

## Site footer {#site-footer}

The footer renders on every layout and has three shapes, selected with
`footer_style`:

| Value  | Renders                                                |
| ------ | ------------------------------------------------------ |
| `fat`  | The column grid above the copyright line (the default) |
| `slim` | The copyright line only                                |
| `none` | No footer at all                                       |

```yaml {filename="hugo.yaml"}
params:
  ui:
    footer_style: fat
```

Front matter — including a section cascade — overrides the site value:

```yaml
---
title: Embedded reference
footer_style: slim
---
```

An unrecognized value **fails the build** instead of falling back silently.

### Fat-footer data {#footer-data}

The column grid reads `data/footer/<language>.yaml`, or `data/footer.yaml` on a
single-language site:

```yaml {filename="data/footer/en.yaml"}
brand:
  name: Product Docs
  tagline: A short **Markdown-enabled** description.
  slogan: Clear answers, close to the product.
columns:
  - title: Documentation
    links:
      - { label: Docs, url: /docs/ }
      - { label: Blog, url: /blog/ }
  - title: Project
    links:
      - { label: GitHub, url: https://github.com/pgsty/oink, external: true }
```

`brand.name` and `brand.logo` fall back to the site's own brand name, logo, and
wordmark. `tagline` and `slogan` render Markdown. Internal `url` values resolve
against the language root; `external: true` opens the link in a new tab with
`rel="noopener noreferrer"`. The grid's track count follows the number of
columns in the data.

A `fat` footer with no data degrades to `slim`, so a site can keep the default
while it writes the columns.

> [!NOTE] The `footer` block in `data/home/<language>.yaml` is still read as a
> fallback. It used to render on the homepage only and now applies site-wide, so
> check that the columns still make sense from a deep documentation page before
> keeping the legacy location.

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
