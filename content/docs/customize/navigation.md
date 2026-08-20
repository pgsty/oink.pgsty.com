---
title: Navigation and menus
linkTitle: Navigation and menus
description: Configure the navbar menu and its dropdowns, the section switcher, breadcrumbs, page actions, the pager and the footer links.
weight: 40
search_keywords:
  [navigation, menu, navbar, dropdown, breadcrumb, pager, footer, page actions]
aliases:
  - /docs/configure/navigation/
---

This page covers the ways a reader moves between pages: the navbar menu, the
section switcher, breadcrumbs, page actions, previous / next, and the footer.
The sidebar tree and the outline belong to
[Layouts and page types](/docs/customize/layout/).

Navigation has no second information architecture: the navbar comes from Hugo's
`menus.main`, and the sidebar from the shape of `content/`. The theme reads no
parallel navigation tree such as a `docs.json` or a `navigation.yaml`.

## The navbar menu {#main-menu}

Top-level entries go in each language's `menus.main`:

```yaml {title="hugo.yml"}
languages:
  en:
    menus:
      main:
        - identifier: docs
          name: Docs
          pageRef: /docs
          weight: 20
        - identifier: blog
          name: Blog
          pageRef: /blog
          weight: 50
        - identifier: download
          name: Download
          pageRef: /download
          weight: 60
          params:
            icon: fa-solid fa-download
```

A lower `weight` comes first. `pageRef` points at a site page and `url` at an
external one; an external link automatically gains `target="_blank"`,
`rel="noopener noreferrer"` and an external-link mark. `identifier` is the
stable handle configuration uses to reference the entry (`quick_links` and
`sidebar_root_menu` match on it), `name` is translated per language, and the
identifier is not.

A menu entry can also hang off a page's front matter, which suits "this page is
itself a top-level entry":

```yaml {title="content/download/_index.md"}
---
title: Download
menu:
  main:
    weight: 30
---
```

The GitHub entry at the right of the navbar is **not** a menu item: it comes
from `params.github_project_repo` (falling back to `params.github_repo`). A menu
entry identified as `github` is skipped by the menu area and never shows. To
change that entry's target, change the repository parameters — see
[Repository links and page info](/docs/customize/repository/).

### Dropdowns {#dropdown}

Use Hugo's `parent` to establish a parent-child relationship. **Only one level
of children is supported**:

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: docs
      name: Docs
      pageRef: /docs
      weight: 20
    - identifier: docs-start
      parent: docs
      name: Get started
      pageRef: /docs/start
      weight: 10
      params:
        icon: fa-solid fa-rocket
        description: Install Hugo, clone this site, deploy in ten minutes
    - identifier: docs-components
      parent: docs
      name: Components
      pageRef: /docs/components
      weight: 20
      params:
        icon: fa-solid fa-cubes
        description: How to write callouts, code blocks, tables and diagrams
```

- A child's `params.description` appears under its title, so a reader can judge what the entry is for.
- **The parent is itself an ordinary link**: hovering or focusing it expands the panel, and clicking or pressing Enter goes to the parent page. There is no separate expand arrow, and a touch reader lands on the parent page, whose body lists the same links.
- Keyboard: the down arrow expands and focuses the first item, {{< kbd "Esc" >}} closes and returns focus to the link, and clicking outside closes it.
- The panel can be split into columns with `params.columns` (1–4) on the parent; out of range fails the build.
- A third level warns at build time and degrades to a static group heading; it does **not** produce a third-level flyout. Put deeper levels in the sidebar.

### Menu icons {#menu-icons}

Below `lg` a menu entry is reduced to its icon, so every top-level entry should
have one. Icons resolve in this order:

1. `icon` in the target page's front matter;
2. The menu entry's own `params.icon`;
3. A built-in default matched by identifier or section name (`docs`, `blog`, `examples`, `community`, `about`, `download`, `github` and others);
4. `fa-solid fa-link` when none matched.

An icon is one Font Awesome class pair, with the free faces supplied locally by
the theme:

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: handbook
      name: Operations handbook
      pageRef: /handbook
      weight: 40
      params:
        icon: fa-solid fa-screwdriver-wrench
```


### Taxonomy menus {#taxonomy-menu}

A top-level entry pointing at a taxonomy page (`/tags/`, `/categories/`) needs
no hand-written submenu: the panel renders a grid of "term + count" chips,
ordered by descending count.

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: tags
      name: Tags
      pageRef: /tags
      weight: 60
```

Enabling taxonomies is in [Taxonomies](/docs/customize/taxonomy/).

## Navbar controls {#navbar}

The navbar is 50px tall and holds, left to right: the brand (logo or wordmark),
the menu area, search, version, language, theme, GitHub. Home and Landing pages
keep a final drawer menu button at the right edge. The navbar renders on every
layout; documentation, blog and taxonomy pages use the same controls without
that Landing drawer.

The navbar has a full desktop tier and a compact icon tier:

| Viewport | State |
| --- | --- |
| `lg` and above | Full: brand, menu entries with text, all utility controls; Home/Landing ends with the drawer button |
| Below `lg` | Compact: the brand stays, everything else becomes right-aligned icons |
| Below `md` | Only search and the drawer button remain in the navbar; version, language, theme and keyboard help remain in the footer's bottom bar |

The individual controls are switched on elsewhere: the search icon needs
`params.offline_search` (see [Search](/docs/customize/search/)), the version
menu needs `params.versions` (see [Versions](/docs/customize/versions/)), the
language menu appears automatically with two or more languages configured (see
[Languages](/docs/customize/i18n/)), and the theme control needs
`params.ui.dark_mode` (see
[Brand and appearance](/docs/customize/brand/#dark-mode)).

### Auto-hide {#autohide}

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_autohide: true
```

With it on, the navbar leaves the normal flow and rests above the viewport,
sliding out only when the pointer enters the middle 60% of the area above its
original position (or keyboard focus arrives), and it overlays the body rather
than pushing it down. 64px at each side is outside the wake zone, so it does not
cover the collapsed sidebar and outline restore buttons.

It is disabled automatically below 768px, on a coarse pointer, and on a
touch-only device, where the navbar stays visible. A top-level
`navbar_autohide` in page front matter or a section cascade overrides it per
section.

### Turning the navbar off {#navbar-disable}

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_enabled: false
```

It can also be turned off for one page or one section:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  navbar_enabled: false
---
```

With it off, the theme restores the interface the navbar carried: mobile
subnavigation, a brand and search row at the top of the sidebar, and utility
buttons on the outline rail. The switch suits pages that must own the viewport;
it is not a general layout preference. This site's documentation section uses
it: documentation pages navigate through the sidebar, and the navbar is one row
too many.

## The section switcher {#root-menu}

The row at the top of the sidebar is the section switcher, deciding which tree
is shown. Its entries are built in order and deduplicated: every top-level
section → every section anywhere with `sidebar_root_for: self` → the currently
resolved root.

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

To let a large subtree become a root of its own (a versioned API reference, a
self-contained handbook), in its `_index.md`:

```yaml {title="content/docs/api-v2/_index.md"}
---
title: API reference v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

`self` makes the section index and all its descendants use the new tree;
`children` leaves the index in the parent tree and binds only the descendants.
To keep a top-level section out of the switcher, set `sidebar_root_menu: false`
in its front matter.

With one entry the switcher degrades to a borderless link; two or more make it a
dropdown. The tree below it still has the section index as its first link: the
switcher picks a tree, and the root link picks a document.

## Breadcrumbs and page actions {#breadcrumb}

An ordinary content page has a breadcrumb row above its title, and that row's
right end carries the page actions. A top-level section omits a single-level
breadcrumb that would only repeat the title, and the action buttons stay where
they are.

```yaml {title="hugo.yml"}
params:
  ui:
    breadcrumb: false
```

Breadcrumb labels use the localized `linkTitle`, and the hierarchy matches the
sidebar.

### The page action menu {#page-actions}

Page actions are the split button at the end of the title row: the left half
copies this page's Markdown in one click (turning into a green tick on success),
and the arrow on the right expands the full menu. The menu has two groups —
taking the content away, and changing or producing it:

| Action | When it appears |
| --- | --- |
| Copy as Markdown | The site enabled the `markdown` output format |
| Open in ChatGPT | `page_context_menu.assistant_links: true` |
| Open in Claude | The same |
| View Markdown source | The `markdown` output format |
| View history | `params.github_repo` can resolve the source path |
| Edit this page | `params.github_repo` |
| Create child page | `params.github_repo` |
| Open a documentation issue | `params.github_repo` |
| Open a project issue | `params.github_project_repo` |
| Print the whole section | The section enabled the `print` output format |

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: false
      links: []
```

The assistant entries are off by default: on a click **the full current URL
(query and fragment included) goes to a third party with a localized prompt**,
while the body is not uploaded. Before enabling it, confirm no sensitive
information appears in URLs, and disclose the boundary in the privacy statement.
A page can narrow the site policy with a boolean `assistant_links` in front
matter, but cannot enable it on the site's behalf.

Custom external actions come last in the menu, and `url` supports three
URL-encoded placeholders:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      links:
        - name: Ask the internal assistant
          icon: fa-solid fa-wand-magic-sparkles
          url: https://assistant.example.com/new?source={markdown_url}&title={title}
```

The placeholders are `{url}` (the page's full address), `{title}` (the page
title) and `{markdown_url}` (the Markdown version's address).

On the blog root section and its first-level subsections, the left half becomes
the RSS subscription link while "copy as Markdown" stays in the menu. A page
with no Markdown output loses the left half, and the arrow becomes an "Actions"
button with a label.

These actions are also entries in the
[command palette](/docs/customize/panel/).

## The pager {#pager}

Previous / next at the end of the body are two text links, ordered by the
sidebar's visible tree: root page → first page → through to the last. The root
has no previous, and the last page has no next. Where a site provides
`data/docs_nav.json`, that explicit tree decides the paging order too — and the
section index on a docs or book section the file declares, so the sidebar, the
pager and the index can no longer show the same children in three different
orders. A section the file does not declare, and a site without the file, keep
walking the content tree. See
[Layouts and page types](/docs/customize/layout/#sidebar).

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book, blog]
```

`pager_types` accepts only `docs`, `book` and `blog`; any other value warns and
is dropped. A page opts out through front matter:

```yaml {title="content/docs/appendix.md"}
---
title: Appendix
pager: false
---
```

The same order is written into `<head>`: with a previous or next page, it emits
`<link rel="prev">` and `<link rel="next">` so browsers and crawlers can see the
reading sequence.

```html {title="page source"}
<link rel="prev" href="/docs/customize/home/">
<link rel="next" href="/docs/customize/layout/">
```

Paging applies to HTML output only. Print, Markdown and RSS have neither the
links nor the two `rel` relationships.

The pager is the third of the four page-end components (feedback → annotation →
pager → comments), in a fixed order with four independent switches.

## The footer {#footer}

The footer's shape comes from `params.ui.footer_style` (`fat` / `slim` / `none`
— see [Brand and appearance](/docs/customize/brand/#footer)). The `fat` link
grid reads `data/footer/<language>.yaml`. It is not a menu, and the theme has no
`menus.footer`:

```yaml {title="data/footer/en.yaml"}
brand:
  name: Product Docs
  tagline: A short description that **supports Markdown**.
  slogan: Close to the product, with clear answers.
columns:
  - title: Docs
    links:
      - { label: Get started, url: /docs/start/ }
      - { label: Components, url: /docs/components/ }
  - title: Project
    links:
      - { label: GitHub, url: https://github.com/pgsty/oink, external: true }
      - { label: Releases, url: /blog/release/ }
```

- Without `brand.name` and `brand.logo` it falls back to the site's own brand name, logo and wordmark; `tagline` and `slogan` render Markdown.
- An internal `url` resolves against the current language root; `external: true` opens in a new tab with `rel="noopener noreferrer"`.
- The grid has as many columns as the data does.
- A single-language site can use `data/footer.yaml`.
- With `fat` configured but no data, it degrades to `slim` automatically, so it can be enabled before the content exists.

The `fat` footer's copyright row has a collapse arrow at its right end, hiding
or restoring the link grid above it. It starts expanded, and the reader's choice
is kept in localStorage under `td-footer-collapsed` across pages. `slim` and
`none` have no such button, and it is unrelated to focused reading mode.

Every rendered bottom bar ends with the same icon dock: version, language,
theme, then keyboard help. Each configured menu opens upward; the version
trigger stays icon-only while its choices keep their full labels. The `fat`
footer's collapse arrow follows those four controls. The sidebar has no second
copy of the dock, and `footer_style: none` removes the bar with the footer.

The copyright row and the centre note are parameters — see
[Configuration](/docs/customize/config/#identity).

## Verify {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

After changing navigation, check each of these:

- The build has no `Navbar menu … supports one interactive child level` warning; one means the menu is three levels deep;
- On the desktop: clicking a parent goes to the parent page, hovering expands the panel, and {{< kbd "Esc" >}} closes it;
- Narrow the window below `lg`: every top-level entry still has an icon, and one without an icon is blank at this width;
- Below `md`: Home and Landing navbars keep search and the drawer button on the right; version, language, theme and keyboard help stay in the persistent footer bottom bar;
- The switcher at the top of the sidebar lists every top-level section, with the current one marked;
- On any documentation page, {{< kbd "E" >}} / {{< kbd "Q" >}} page in sidebar order, and the page source has matching `rel="prev"` / `rel="next"`;
- Open the page action menu and confirm what should be there is, and what should not is not (for example "open a project issue" with no `github_project_repo` configured).

## Related {#related}

- [Layouts and page types](/docs/customize/layout/) — sidebar tree, outline and shell types
- [Configuration](/docs/customize/config/#navbar-footer) — defaults of the navigation parameters
- [Command palette](/docs/customize/panel/) — page actions and custom commands
- [Repository links and page info](/docs/customize/repository/) — the edit, history and issue links
- [Organizing content](/docs/write/organize/) — how the directory structure decides the sidebar
