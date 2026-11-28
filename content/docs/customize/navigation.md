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

The menu across the top of every page is the map of your site: the handful of
places, such as Docs, Blog and Download, that a reader should reach from
anywhere. You write it once per language in `hugo.yml`. The other ways of
moving around (the section switcher at the top of the sidebar, breadcrumbs,
previous and next links, backlinks) follow from your content tree, so you
adjust them rather than build them. The sidebar tree and the page outline are
covered in [Layouts and page types](/docs/customize/layout/).

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

Entries appear in ascending `weight`. Point at your own pages with `pageRef`,
so that Hugo resolves the page in each language and marks the entry active on
every page beneath it, and use `url` for anything else. An external `url` opens
in a new tab with `rel="noopener noreferrer"` and carries an external-link
mark. Translate `name` in every language but keep `identifier` the same,
because other settings refer to entries by it: `params.ui.quick_links` picks
[command palette](/docs/customize/panel/) quick links by identifier,
and the default icon is matched against it.

A page can also add itself to the menu from its front matter, which is handy
when the page itself is the top-level destination:

```yaml {title="content/download/_index.md"}
---
title: Download
menu:
  main:
    weight: 30
---
```

The GitHub button at the right end of the navbar is not a menu entry, and a
menu entry with the identifier `github` is skipped. The button links to
`params.github_project_repo`, or to `params.github_repo` when that is unset, so
change those to change it; see
[Repository links and page info](/docs/customize/repository/).

### Dropdowns {#dropdown}

Give an entry a `parent` to place it in that entry's dropdown panel:

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
    - identifier: docs-components
      parent: docs
      name: Components
      pageRef: /docs/components
      weight: 20
      params:
        icon: fa-solid fa-cubes
```

The panel is a single column with one icon and one name per row; it does not
display a child's `params.description`, and a `params.columns` setting is
ignored with a build warning. The parent stays an ordinary link: hovering or
focusing it opens the panel, while clicking it or pressing {{< kbd "Enter" >}}
opens the parent page. Touch readers therefore go straight to that page, so it
should link to the same children, as a section index does by itself. With the
keyboard, {{< kbd "↓" >}} opens the panel and focuses its first item, and
{{< kbd "Esc" >}} closes it and returns focus to the parent; clicking outside
also closes it.

Dropdowns go one level deep. A grandchild entry is rendered as a plain group
heading inside the panel, not as a third-level flyout, and the build warns
`only one interactive child level is supported`. Put deeper structure in the
sidebar.

### Menu icons {#menu-icons}

Below the `lg` breakpoint the navbar shows each top-level entry as its icon
alone, so give every top-level entry one. An entry's icon is the first of:

1. the menu entry's own `params.icon`;
2. `icon` in the target page's front matter;
3. a built-in default matched against the identifier, the target's section or
   the first segment of its URL (`docs`, `guide`, `blog`, `news`, `examples`,
   `community`, `about`, `download`, `github`);
4. `fa-solid fa-link`.

An icon is one Font Awesome class pair; the theme ships the free icon set, so
nothing is downloaded. Setting `params.icon` to `false` or `"none"` removes the
icon, and the entry then keeps its text label at every width:

```yaml {title="hugo.yml"}
menus:
  main:
    - identifier: handbook
      name: Operations handbook
      pageRef: /handbook
      weight: 40
      params:
        icon: false
```

### Taxonomy menus {#taxonomy-menu}

A top-level entry that points at a taxonomy list page such as `/tags/` needs
no children: its panel fills itself with the taxonomy's terms and their page
counts, most-used first. The entry is written like any other; see
[The taxonomy panel in the navbar](/docs/customize/taxonomy/#navbar-panel).

## Navbar controls {#navbar}

The 50px navbar holds the brand logo or wordmark at the start, the menu in the
middle, and utility controls at the end. It adapts to the viewport in three
tiers:

| Viewport | State |
| --- | --- |
| `lg` and above | Brand, menu labels, and the search, version, language, appearance and GitHub controls. No drawer button |
| `md` to below `lg` | Menu icons in the middle, utility controls at the end. No drawer button |
| Below `md` | Menu icons in the middle; only search and a drawer button at the end. Version, language, appearance and keyboard help move to the footer's bottom bar |

The drawer button opens the sidebar on pages that have one, and a site menu on
Home and Landing pages.

Menu entries never wrap onto a second line. When the brand, a fixed desktop
sidebar and the utility controls leave too little room, entries with icons
collapse to their icons first, while entries with `params.icon: false` keep
their labels; whatever still does not fit folds into a trailing `…` panel that
shows each entry's icon, name and children.

Each utility control appears once its feature is configured: search with
`params.offline_search` ([Search](/docs/customize/search/)), the version menu
with `params.versions` ([Versions](/docs/customize/versions/)), the language
menu with two or more languages ([Languages](/docs/customize/i18n/)), and the
appearance menu when the site offers a color-mode or preset choice
([Brand and appearance](/docs/customize/brand/#dark-mode)).

### Auto-hide {#autohide}

On long pages you can give the navbar's space back to the content:

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_autohide: true
```

The hidden navbar keeps its 50px band, so nothing below it moves. Pointing into
the upper 60% of that band, or tabbing into the navbar, fades it back in place
without covering the page. The wake zone leaves out 64px at each side, so the
buttons that restore a collapsed sidebar or outline stay clickable.

Auto-hide stays off below 768px and on coarse-pointer or touch-only devices,
where the navbar is always visible. Home ignores the site setting unless its
own front matter turns it on, and hero pages keep their overlay navbar, which
scrolls away with the hero. A top-level `navbar_autohide` in page front matter
or a section cascade overrides the site setting.

### Turning the navbar off {#navbar-disable}

For pages that need the whole viewport, such as a full-screen report or an
embedded application, turn the navbar off for the site:

```yaml {title="hugo.yml"}
params:
  ui:
    navbar_enabled: false
```

or for one page or section:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  navbar_enabled: false
---
```

Without the navbar, the theme moves its essentials elsewhere: a mobile
subnavigation, a brand and search row at the top of the sidebar, and the
utility buttons on the outline rail. Readers lose the site menu, though, so
reserve this for pages that need it rather than using it as a style choice.

## The section switcher {#root-menu}

The row at the top of the sidebar switches between whole trees: Docs, Blog, a
Book, or any large subtree you promote to a root of its own. It lists every
top-level section, then every section marked `sidebar_root_for: self`, without
duplicates, and adds the root the reader is currently in when it is not
already listed. Sections without a permalink (`build.render: never`) and
divider groups never appear. With no entries the switcher is absent, with one
it is a plain link, and with two or more it is a dropdown.

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    sidebar_root_menu: true
```

Both default to `true`. `sidebar_root_menu: false` removes the switcher.
`sidebar_root_enabled: false` ignores `sidebar_root_for`, so every page shows
the tree of its top-level section.

To make a large subtree, such as a versioned API reference or a self-contained
handbook, a root of its own, mark its `_index.md`:

```yaml {title="content/docs/api-v2/_index.md"}
---
title: API reference v2
sidebar_root_for: self
sidebar_root_link_self: true
---
```

With `self`, the section index and everything below it use the new tree; with
`children`, the index stays in its parent's tree and only its descendants
switch. `sidebar_root_link_self` (default `true`) points the link at the top of
the new tree to the section's own index; set it to `false` to point that link
at the parent section instead. The switcher picks the tree, and that root link
opens a page in it.

To keep a top-level section or a self root out of the switcher, set
`sidebar_root_menu: false` in its front matter. While a reader is inside that
section, it still appears in the switcher to mark where they are.

## Breadcrumbs and page actions {#breadcrumb}

Above each page title, a breadcrumb shows where the page sits, using the
localized `linkTitle` of each ancestor in the same hierarchy as the sidebar.
The page action menu sits at the right end of the same row. A top-level
section leaves out the one-item breadcrumb that would only repeat its title,
and the action menu keeps its place. Blog pages show no breadcrumb by default,
because a post reads as a standalone piece; set `breadcrumb` in front matter or
a cascade to change that for a page or section, or turn breadcrumbs off for the
whole site:

```yaml {title="hugo.yml"}
params:
  ui:
    breadcrumb: false
```

### The page action menu {#page-actions}

The split button at the end of the title row gives readers what they can do
with the page: take its content elsewhere, or change it at the source. Its left
half copies the page's Markdown and shows a green check mark when the copy
succeeds; the arrow opens the full menu. Each entry appears only when the site
can serve it, and each has a stable action ID that the command palette and
custom CSS use:

| Entry | Action ID | Appears when |
| --- | --- | --- |
| Copy Markdown | `copy_markdown` | The page has the `markdown` output format |
| Open in ChatGPT | `open_chatgpt` | `page_context_menu.assistant_links: true` |
| Open in Claude | `open_claude` | `page_context_menu.assistant_links: true` |
| View markdown | `view_markdown` | The page has the `markdown` output format |
| View edit history | `view_history` | `params.github_repo` is set and the page's source path resolves |
| Edit this page | `edit_page` | The same |
| Create child page | `create_child_page` | The same |
| Create docs issue | `create_issue` | `params.github_repo` is set |
| Create project issue | `create_project_issue` | `params.github_project_repo` is set |
| Print entire section | `print_section` | The section has the [`print` output format](/docs/customize/print/#enable) |

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      enable: true
      assistant_links: false
      links: []
```

`page_context_menu: false`, for the site or in a page's front matter, removes
the button; the same actions stay in the [command palette](/docs/customize/panel/).
The assistant entries are off by default because clicking one sends the page's
full URL, query and fragment included, to that third party. A page can switch
them off but cannot switch them on when the site has not;
[AI-agent support](/docs/customize/agents/#page-actions) covers the prompt they
send and what to put in your privacy statement.

`links` adds your own external actions at the end of the menu. In `url`,
`{url}` is the page's full address, `{title}` its title and `{markdown_url}`
the address of its Markdown version, each URL-encoded:

```yaml {title="hugo.yml"}
params:
  ui:
    page_context_menu:
      links:
        - name: Ask the internal assistant
          icon: fa-solid fa-wand-magic-sparkles
          url: https://assistant.example.com/new?source={markdown_url}&title={title}
```

On the blog root and its first-level sections the left half is an RSS
subscription link instead, and Copy Markdown moves into the menu. A page
without Markdown output has no left half, and the arrow becomes a labeled
"Actions" button.

## The pager {#pager}

Two text links at the end of the body lead to the previous and next page in
the order of the visible sidebar tree, from the root page down to the last
page. The root has no previous link and the last page no next link. When the
site supplies [`data/docs_nav.json`](/docs/customize/layout/#docs-nav), that
tree orders the pager and the section indexes it declares, so the sidebar, the
pager and the index list children in the same order; other sections follow the
content tree.

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book, blog]
```

`pager_types` accepts only `docs`, `book` and `blog`; any other value warns and
is dropped. To remove the pager from one page:

```yaml {title="content/docs/appendix.md"}
---
title: Appendix
pager: false
---
```

The same order goes into the page's `<head>` as `<link rel="prev">` and
`<link rel="next">`, so browsers and crawlers can follow the reading sequence:

```html {title="page source"}
<link rel="prev" href="/docs/customize/home/">
<link rel="next" href="/docs/customize/layout/">
```

Only HTML pages carry the pager and these links; print, Markdown and RSS
output have neither. The pager is one of the blocks at the end of a page, which
appear in a fixed order; see [What the page end is made of](/docs/customize/repository/#page-end).

## Backlinks {#backlinks}

Backlinks list the pages that link to the current one, so a reader who lands
from search sees which pages consider it worth pointing to and where it sits in
the rest of the site. They are off until you turn them on:

```yaml {title="hugo.yml"}
params:
  ui:
    backlinks: true
```

A page overrides the setting with `backlinks` in its front matter, and a
section passes it down with a cascade:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  backlinks: true
---
```

The list appears in the right rail as an expanded "Backlinks" group, below the
outline and above the taxonomy clouds; below `xl` it moves into the sidebar
drawer with the outline. The first eight entries are visible and the rest sit
behind a native "Show N more" disclosure, and hovering an entry shows its
source page's description. A page that nothing links to has no backlinks block
at all, heading included. A non-boolean value warns and counts as off.

Hugo builds the list at build time from the ordinary Markdown links and
`ref` / `relref` shortcodes you already write, so there is no new syntax and no
JavaScript. Links inside code are ignored, as are self links, external links,
`mailto:` and same-page anchors; several links to one page count once, and a
fragment is ignored when matching the target. Each language has its own list,
so a Chinese page never appears under an English one, and entries are sorted by
page path, so the same content always gives the same order.

URLs in custom shortcode parameters or raw `<a href>` elements are not counted,
and links that do not resolve are dropped silently. Backlinks help readers
navigate; keep running a link checker to find broken links.

The page's Markdown output carries the same list after a "Backlinks:" line;
RSS and the print view leave it out. This site enables backlinks everywhere,
so the right rail of this page shows a live example, and
[Configuration](/docs/customize/config/) lists more than forty, most of them
behind the disclosure.

## The footer {#footer}

`params.ui.footer_style` chooses `fat`, `slim` or `none`; see
[Brand and appearance](/docs/customize/brand/#footer). The link grid of the
`fat` footer comes from `data/footer/<language>.yaml`, not from a menu (the
theme has no `menus.footer`):

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

- Without `brand.name` and `brand.logo`, the footer uses the site's own brand name, logo and wordmark. `tagline` and `slogan` render Markdown.
- An internal `url` resolves against the current language root. `external: true` opens the link in a new tab with `rel="noopener noreferrer"`.
- The grid has as many columns as the data has.
- A single-language site can use `data/footer.yaml`.
- A `fat` footer with no data falls back to `slim`, so you can switch it on before writing the data.

An arrow at the end of the `fat` footer's copyright row collapses and restores
the link grid. The grid starts expanded, and the reader's choice is kept in
`localStorage` under `td-footer-collapsed` across pages; it is independent of
Zen Mode. `slim` and `none` have no such arrow.

The footer's bottom bar ends with an icon dock holding, in order, the version,
language, appearance and keyboard-help controls, followed by the `fat`
footer's collapse arrow. Their menus open upward. Hovering keyboard help
previews the full three-column [shortcuts](/docs/customize/keyboard/#help) sheet
above the footer, and clicking it opens the centered modal dialog. The version button shows only an icon, while its choices keep
their full labels. The sidebar does not repeat these controls, and
`footer_style: none` removes the bottom bar together with the footer.

The copyright row and the note in its center are set in
[Configuration](/docs/customize/config/#identity).

## Verify {#verify}

Build, then check the warnings and the rendered navigation:

```bash
hugo --printPathWarnings
```

- No build warning says `only one interactive child level is supported`; if one does, a menu is nested three levels deep.
- On desktop, hovering a parent opens its panel, clicking it opens its page, and {{< kbd "Esc" >}} closes the panel.
- Below `lg`, every top-level entry shows an icon; an entry without one is blank at that width.
- Below `md`, the Home and Landing navbars keep only search and the drawer button at the end, and version, language, appearance and keyboard help are in the footer's bottom bar.
- The switcher at the top of the sidebar lists every top-level section and marks the current one.
- On a documentation page, {{< kbd "E" >}} / {{< kbd "Q" >}} page through the sidebar order, and the page source has the matching `rel="prev"` / `rel="next"`.
- With backlinks on, `grep td-backlinks public/<a page that is linked to>/index.html` finds the block, and a page nothing links to has none.
- The page action menu shows the entries you expect and nothing else; for example, Create project issue is absent without `github_project_repo`.

## Related {#related}

- [Layouts and page types](/docs/customize/layout/) — sidebar tree, outline and shell types
- [Configuration](/docs/customize/config/#navbar-footer) — defaults of the navigation parameters
- [Command palette](/docs/customize/panel/) — page actions and custom commands
- [Repository links and page info](/docs/customize/repository/) — the edit, history and issue links
- [Organizing content](/docs/write/organize/) — how the directory structure decides the sidebar
