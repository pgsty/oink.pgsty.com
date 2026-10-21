---
title: Navigation and menus
linkTitle: Navigation and menus
description: Configure the navbar menu, dropdowns, section switcher, breadcrumbs, page actions, pager, and footer links.
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

The navbar comes from Hugo's `menus.main`. Docs and Book navigation defaults
to the `content/` tree; sites importing an existing reading order may use
[`data/docs_nav.json`](/docs/customize/layout/#sidebar). The sidebar, pager
and section index share the selected order.

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

Lower `weight` values appear first. Use `pageRef` for site pages and `url`
for external pages. External links automatically receive `target="_blank"`,
`rel="noopener noreferrer"`, and an external-link mark. The `identifier` is a
stable configuration reference. The keys `quick_links` and `sidebar_root_menu`
match it. Translate `name` per language. Do not translate the identifier.

You can also define a menu entry in page front matter. Use this when "this page
is itself a top-level entry":

```yaml {title="content/download/_index.md"}
---
title: Download
menu:
  main:
    weight: 30
---
```

The navbar's right-hand GitHub entry is **not** a menu item. It uses
`params.github_project_repo`, with a fallback to `params.github_repo`. The menu
area skips entries identified as `github`. To change the GitHub target, change
the repository parameters. See [Repository links and page info](/docs/customize/repository/).

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
        description: Start from OINK Starter, customize in layers, deploy
    - identifier: docs-components
      parent: docs
      name: Components
      pageRef: /docs/components
      weight: 20
      params:
        icon: fa-solid fa-cubes
```

- Every entry is one icon and one title on its own row, in one
  moderate-width column. A child's `params.description` is configuration
  data only; the panel never renders it.
- **The parent is itself an ordinary link**. Hover or focus it to expand the panel. Click it or press Enter to open the parent page. There is no separate expansion arrow. On touch screens, readers open the parent page, whose body lists the same links.
- Keyboard: the down arrow expands the panel and focuses its first item. {{< kbd "Esc" >}} closes it and returns focus to the link. Clicking outside also closes it.
- The 0.5 `params.columns` parameter is retired: setting it emits a build
  warning and the panel keeps its single column.
- A third level produces a build warning and becomes a static group heading. It does **not** create a third-level flyout. Put deeper levels in the sidebar.

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

A top-level taxonomy entry (`/tags/`, `/categories/`) needs no manually written
submenu. The panel shows a grid of "term + count" chips, sorted by descending count.

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

The navbar is 50px tall. It contains the brand logo or wordmark, a centered
menu, and utility controls at the end. When enabled, it appears across layouts.
On narrow screens, Home and Landing use a site-menu drawer. Shell pages with
a sidebar use the sidebar's drawer instead.

The navbar has a full desktop tier and a compact icon tier:

| Viewport | State |
| --- | --- |
| `lg` and above | Brand, centered menu text, and search, version, language, theme, and GitHub controls. No drawer button |
| `md` to below `lg` | Centered menu icons and utility controls at the end. No drawer button |
| Below `md` | Centered menu icons remain. Search and the appropriate drawer button remain at the end. Version, language, theme, and keyboard help remain in the footer's bottom bar |

Enable individual controls through their settings. The search icon requires
`params.offline_search`; see [Search](/docs/customize/search/). The version menu
requires `params.versions`; see [Versions](/docs/customize/versions/). With two
or more configured languages, the language menu appears automatically; see
[Languages](/docs/customize/i18n/). The theme control requires
`params.ui.dark_mode`; see [Brand and appearance](/docs/customize/brand/#dark-mode).

### Auto-hide {#autohide}

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_autohide: true
```

With auto-hide enabled, the hidden navbar retains its 50px band. Move the
pointer into the upper 60% of that band, or focus the navbar with the keyboard.
The navbar fades in at the same position. The layout does not move, and the
hidden navbar does not cover content. The wake zone excludes 64px on each side.
Collapsed sidebar and outline restore controls therefore remain usable.

It is disabled automatically below 768px, on a coarse pointer, and on a
touch-only device, where the navbar stays visible. Home ignores the site-wide
setting unless its own front matter enables it. Hero pages retain their
overlay navbar, which scrolls with the hero. A top-level `navbar_autohide` in
page front matter or a section cascade overrides the site setting.

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

If the navbar is off, the theme restores mobile subnavigation, a brand and
search row at the sidebar top, and utility buttons on the outline rail. Use
this switch for pages that need the whole viewport. It is not a general
layout preference. This site's documentation section keeps
the navbar enabled and disables its auto-hide behavior with
`navbar_autohide: false`, so section navigation stays visible.

## The section switcher {#root-menu}

The section switcher is the sidebar's top row. It selects the displayed tree.
The theme builds and deduplicates entries in this order: eligible top-level
sections → eligible sections with `sidebar_root_for: self` → the current
resolved root. Candidates must have a permalink. They cannot be divider groups.

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

The value `self` makes the section index and all descendants use the new tree.
The value `children` keeps the index in the parent tree. Only descendants use
the new tree.
To exclude a top-level section or a nested self-root from the global choices,
set `sidebar_root_menu: false` in its front matter. The current resolved root is
still appended if absent. Inside that section, it remains a location marker.
The 1.1 implementation excludes both nested self-roots and top-level sections.
The 1.0 implementation could still include a nested self-root despite `false`.
A root with `build.render: never`, or a divider root, never becomes a switcher
link.

With no entries, the switcher renders nothing. One entry becomes a borderless
link. Two or more entries create a dropdown. The tree below still lists the
section index first. The switcher selects a tree. The root link selects a document.

## Breadcrumbs and page actions {#breadcrumb}

An ordinary content page has breadcrumbs above its title and page actions at
the row's right end. A top-level section omits single-level breadcrumbs that
only repeat its title. Action buttons retain their positions.

```yaml {title="hugo.yml"}
params:
  ui:
    breadcrumb: false
```

Breadcrumb labels use the localized `linkTitle`, and the hierarchy matches the
sidebar.

### The page action menu {#page-actions}

The split button at the title row's end contains page actions. Click its left
half to copy the page's Markdown. A successful copy shows a green check mark.
Click the right arrow to expand the full menu. The menu groups actions for
exporting content and for changing or producing content:

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

Assistant entries are off by default. When clicked, **they send the full current
URL, including its query and fragment, to a third party with a localized prompt**.
They do not upload the body. Before enabling them, confirm that URLs contain no
sensitive information. Document this boundary in the privacy statement.
Page front matter can restrict the site policy. It cannot enable assistant
links that the site has not enabled:

```yaml {title="Page front matter"}
page_context_menu:
  assistant_links: false
```

Confirm that ChatGPT and Claude are absent from both the title menu and the
command palette on that page. See [AI-agent support](/docs/customize/agents/)
for the handoff behavior.

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

On the blog root and its first-level subsections, the left half becomes an
RSS subscription link. "copy as Markdown" remains in the menu. Without Markdown
output, a page has no left half. The arrow becomes a labeled "Actions" button.

These actions are also entries in the
[command palette](/docs/customize/panel/).

## The pager {#pager}

Previous / next are two text links at the body end. They follow the visible
sidebar tree: root page → first page → through to the last. The root has no
previous link. The last page has no next link. If the site provides
`data/docs_nav.json`, that tree also orders the pager and declared docs or book
section indexes. The sidebar, pager, and index therefore show children in the
same order. Undeclared sections and sites without the file use the content
tree. See [Layouts and page types](/docs/customize/layout/#sidebar).

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book, blog]
```

The `pager_types` list accepts only `docs`, `book`, and `blog`. Any other value
warns and is discarded. To disable paging on a page, use front matter:

```yaml {title="content/docs/appendix.md"}
---
title: Appendix
pager: false
---
```

The page's `<head>` uses the same order. When previous or next pages exist,
it emits `<link rel="prev">` and `<link rel="next">`. Browsers and crawlers can
then identify the reading sequence.

```html {title="page source"}
<link rel="prev" href="/docs/customize/home/">
<link rel="next" href="/docs/customize/layout/">
```

Paging applies to HTML output only. Print, Markdown and RSS have neither the
links nor the two `rel` relationships.

The pager is the third of these four page-end components: feedback → annotation →
pager → comments. Their order is fixed. Each has an independent switch. An
optional Share bar appears before these components.

## Backlinks {#backlinks}

The right rail can list pages that link to the current page. Its "Linked
from" group has a link icon and appears below the table of contents, above
taxonomy clouds. It starts expanded. Below `xl`, it moves into the sidebar
drawer with the table of contents. Readers arriving from search can identify
related pages and the current page's place in the site. Backlinks remain off
until the site enables them:

```yaml {title="hugo.yml"}
params:
  ui:
    backlinks: true
```

A page overrides it in front matter, and a section cascades it to everything
below:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  backlinks: true
---
```

Hugo derives the index at build time from ordinary Markdown links and
`ref` / `relref` shortcodes in page source. No new syntax, migration, or
JavaScript is required. The list is in HTML. Before scanning, the theme removes
fenced and inline code. Multiple links to one target become one entry. It
ignores self links, external links, `mailto:`, and same-page anchors.

The theme removes fragments when identifying target pages. Each language has
its own graph. A Chinese page never appears below an English page. Entries
sort by stable page path, so identical content always produces identical order.
If no pages link in, the entire block is absent, including its heading and
container.

The first eight entries are visible. Remaining entries use a native "Show N
more" disclosure. This limits right-rail space for heavily referenced pages.
No JavaScript is required. Each entry shows its source page's description on hover.

Source scanning has a known limit. URLs in custom shortcode parameters and
raw `<a href>` elements do not become edges. Unresolved destinations are
discarded without a warning. Backlinks enhance navigation. They do not check
links. Continue using a link checker to find broken links.

A non-boolean value warns and falls back to off. The `hugo server` preview continues to work.

The page's Markdown output carries the same list, introduced by "Backlinks:".
RSS omits it, and the `print` output format omits it with the rest of the rail.

This site enables backlinks site-wide. See this page's right rail for an
example. The most-referenced page, [Configuration](/docs/customize/config/),
lists more than forty inbound links. Most use the disclosure.

## The footer {#footer}

The `params.ui.footer_style` setting selects `fat` / `slim` / `none`.
See [Brand and appearance](/docs/customize/brand/#footer). The `fat` link grid
reads `data/footer/<language>.yaml`. It is not a menu. The theme has no
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

- If `brand.name` and `brand.logo` are absent, the footer uses the site's brand name, logo, and wordmark. The fields `tagline` and `slogan` render Markdown.
- An internal `url` resolves against the current language root. The setting `external: true` opens a new tab with `rel="noopener noreferrer"`.
- The grid has as many columns as the data does.
- A single-language site can use `data/footer.yaml`.
- If `fat` is configured without data, the footer automatically falls back to `slim`. You can enable it before content exists.

The `fat` footer's copyright row has a collapse arrow at its right end. It
hides or restores the link grid above. The grid starts expanded. localStorage
stores the reader's choice under `td-footer-collapsed` across pages. The styles
`slim` and `none` have no collapse button. This state is independent of focused
reading mode.

Every rendered bottom bar ends with an icon dock in this order: version,
language, theme, then keyboard help. Configured menus open upward. The version
trigger shows only an icon. Its choices retain full labels. The `fat` footer's
collapse arrow follows the four controls. The sidebar has no duplicate dock.
The setting `footer_style: none` removes both the footer and bar.

The copyright row and the centre note are parameters — see
[Configuration](/docs/customize/config/#identity).

## Verify {#verify}

```bash
hugo --printPathWarnings
```

After changing navigation, check each of these:

- Confirm that the build has no `Navbar menu … supports one interactive child level` warning. This warning indicates a three-level menu;
- On desktop, click a parent to open its page. Hover to expand the panel. Press {{< kbd "Esc" >}} to close it;
- Narrow the window below `lg`. Confirm that each top-level entry has an icon. An entry without an icon is blank at this width;
- Below `md`, confirm that Home and Landing navbars retain search and the drawer button on the right. Version, language, theme, and keyboard help must remain in the footer bottom bar;
- The switcher at the top of the sidebar lists every top-level section, with the current one marked;
- On a documentation page, use {{< kbd "E" >}} / {{< kbd "Q" >}} to check sidebar paging order. Confirm matching `rel="prev"` / `rel="next"` in page source;
- With backlinks enabled, confirm that `grep td-backlinks public/<a page that is linked to>/index.html` finds the block. A page with no inbound links must have no backlink markup;
- Open the page action menu. Confirm that expected actions appear and unavailable actions are absent. For example, "open a project issue" should be absent without `github_project_repo`.

## Related {#related}

- [Layouts and page types](/docs/customize/layout/) — sidebar tree, outline and shell types
- [Configuration](/docs/customize/config/#navbar-footer) — defaults of the navigation parameters
- [Command palette](/docs/customize/panel/) — page actions and custom commands
- [Repository links and page info](/docs/customize/repository/) — the edit, history and issue links
- [Organizing content](/docs/write/organize/) — how the directory structure decides the sidebar
