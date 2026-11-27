---
title: Layouts and page types
linkTitle: Layouts and page types
description: Choose which shell a page renders in, and tune its sidebar, table of contents, section index and page width.
weight: 50
search_keywords:
  [layout, page type, shell, sidebar, table of contents, TOC, section index, page width, type]
---

Every page renders in a shell: the reading shell, with a sidebar on the left
and an outline on the right, or a plain single column. The page's `type`
chooses the shell, not the folder it lives in, so documentation can sit
anywhere under `content/`. To give an operations handbook in
`content/handbook/` the documentation shell, set the type on its section and
cascade it to every page below:

```yaml {title="content/handbook/_index.md"}
---
title: Operations handbook
type: docs
cascade:
  type: docs
---
```

Where content goes and how the sidebar tree follows the folders is covered in
[Organizing content](/docs/write/organize/); this page covers the shell around
it.

## Shell types {#shell-types}

| `type` | Shell |
| --- | --- |
| `docs` | The reading shell: left sidebar with section switcher and page tree, the body, and the outline on the right |
| `book` | The reading shell, plus numbered chapters, figures and tables, the `reading_width` measure and an optional draft banner |
| `blog` | The reading shell, with blog sections expanded in the sidebar and the breadcrumb off; on blog index pages the page-action button leads with RSS |
| `swagger` | The reading shell, with Swagger UI or Redoc rendering the body. See [API reference pages](/docs/write/openapi/) |
| `expo` | The shared sidebar and a full-width image album, without the outline. See [Expo albums](/docs/write/expo/) |
| Any other type | A plain page: navbar, a single-column body and the footer, with no sidebar |

Taxonomy and term pages, such as `/tags/`, also use the reading shell.

`params.ui.shell_types` lists the types that get the reading shell's
behavior; its default is the five types above:

```yaml {title="hugo.yml"}
params:
  ui:
    shell_types: [docs, book, blog, swagger, expo]
```

If you override the list, keep those five in it, because the theme loads the
shell's scripts only for listed types. Listing a type of your own switches the
shell's behavior on for it but does not draw a sidebar unless your own
templates for that type do; to make a section read like documentation, give
it `type: docs` as above.

### Section roots {#sections}

```yaml {title="hugo.yml"}
params:
  ui:
    docs_section: docs
    blog_section: blog
```

These keys name the top folders of the documentation and the blog. The theme
uses them to find sidebar roots, the command palette's quick links and default
icons, but **they do not choose the shell**: the handbook above gets the
documentation shell while `docs_section` stays `docs`.

A docs page's sidebar normally starts at the documentation section. To start
it at the site home instead, so it shows every top-level section:

```yaml {title="hugo.yml"}
params:
  ui:
    docs_sidebar_root: home # home | section
```

Any other value warns and uses `section`.

### Documentation at the site root {#docs-at-root}

A site that is mostly documentation can serve it from the URL root, as
`/install/` rather than `/docs/install/`, while the source stays in
`content/docs/`. It takes three changes, made together.

First, drop the `docs/` segment from URLs with Hugo's own `permalinks`:

```yaml {title="hugo.yml"}
permalinks:
  page:
    docs: /:sections[1:]/:slug/
  section:
    docs: /:sections[1:]
```

Second, stop each language's site root index (`content/_index.md`,
`content/_index.zh.md`, …) from rendering, so it no longer competes with the
docs section for the same output path while remaining a valid link target:

```yaml {title="content/_index.md"}
---
title: Product Docs
build: { render: link }
---
```

Third, root the sidebar at the site home, so the sidebar and the
previous/next links walk one tree:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    docs_sidebar_root: home
```

With `docs_sidebar_root: home`, every top-level section joins that tree. Take
out the ones that are not part of the reading order, such as the blog, a
community page or downloads, with `toc_root: true` in their `_index.md`; they
then appear neither in the tree nor in the paging order:

```yaml {title="content/blog/_index.md"}
---
title: Blog
toc_root: true
---
```

The documentation now shares the URL root with every other section, so build
with `--printPathWarnings` and resolve any duplicate target before you
publish.

### Landing pages {#landing}

A page with `layout: landing` gets neither shell: it keeps the navbar and
footer and fills the width between them with sections such as a hero, cards
and pricing. See [Home and landing pages](/docs/customize/home/#landing-page).

## Sidebar {#sidebar}

The sidebar mirrors the folders under `content/`, ordered by `weight` and
labeled with `linkTitle` where a page has one. These settings, shown with
their defaults, tune how much of the tree is open and how wide it is:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_menu_compact: true
    sidebar_menu_foldable: true
    sidebar_menu_truncate: 2000
    sidebar_width_min: 220
    sidebar_width_max: 480
    sidebar_item_overflow: ellipsis # ellipsis | wrap
    sidebar_expand_levels: 2
```

- `sidebar_menu_compact` opens only the branch of the current page and its
  neighbors; `false` opens the whole tree.
- `sidebar_menu_foldable` lets readers open and close sections. Blog sections
  start open; set `sidebar_expanded: false` in a section's `_index.md` to start
  it closed.
- `sidebar_expand_levels` is how many levels are open by default.
- `sidebar_menu_truncate` caps the entries rendered per section, which keeps
  the HTML of a thousand-page tree usable. When a section is cut, a build
  warning names it and the value it needs.
- `sidebar_width_min` and `sidebar_width_max` bound the width, in pixels, that
  readers can drag the sidebar to on desktop. Double-clicking the divider
  restores the default.
- `sidebar_item_overflow: ellipsis` cuts long titles short; `wrap` suits a
  site with many long titles, such as Chinese ones.

Each reader's open sections, sidebar width and scroll position are kept in the
browser, separately for each language. Below the `md` breakpoint the sidebar
becomes a drawer with a backdrop.

On a large site, rendering every page's sidebar separately slows the build.
Once the site reaches `params.ui.sidebar_cache_limit` pages (500 by default),
pages with the same effective sidebar settings share one cached tree, and the
browser marks the current page and opens its ancestors. The shared tree is
still complete and navigable without JavaScript. Below the limit, each page's
current position is rendered at build time. A Book page with
[`sidebar_headings`](#sidebar-headings) on always gets its own tree.

To remove the sidebar from one page:

```yaml {title="content/docs/fullscreen-report.md"}
---
title: Full-screen report
sidebar_enabled: false
---
```

### An explicit navigation tree, data/docs_nav.json {#docs-nav}

Use an explicit tree when the order of a manual comes from somewhere else,
such as a Sphinx toctree you migrated and want to keep; when `weight` in
`content/` already gives the order, you do not need this file. The theme uses
`data/docs_nav.json` instead of the folder tree when all three hold:

- the file exists and has a `sections` key;
- the page's type is `docs` or `book`;
- the page's resolved sidebar root is not the site home.

The file is a tree of nodes. Each node's `page` names a content path and its
`children` are its children in the navigation. The theme resolves links and
the current branch from page identity; `url` and the `active_path_by_url`
ancestor map are optional hints kept for older files:

```json {title="data/docs_nav.json"}
{
  "sections": [
    {
      "page": "/docs/start",
      "url": "/docs/start/",
      "children": [{ "page": "/docs/start/install", "url": "/docs/start/install/" }]
    }
  ],
  "active_path_by_url": {
    "/docs/start/install/": ["/docs/start/"]
  }
}
```

Write paths without a language prefix and without the deployment subpath from
`baseURL`. The theme strips both before comparing, so `/docs/start/` matches
`/zh/docs/start/` and `/handbook/zh/docs/start/`, and rendered links keep the
real prefixes.

The tree can also group pages without moving their files. With
`docs_section: docs` and `docs_sidebar_root: section`, root-level pages of type
`docs` can be arranged like this:

```json {title="data/docs_nav.json"}
{
  "sections": [
    { "page": "/intro" },
    { "page": "/config", "children": [{ "page": "/api" }] }
  ]
}
```

`content/config.md` and `content/api.md` stay sibling files, but API appears
under Config, and opening API expands Config. A node applies to a sidebar
root when it is that root, sits below it in `content/`, or is a Docs or Book
page that resolves to the same root. A custom page URL changes the link, not
where the page sits in the sidebar. A separate Book root, or a root nested
with `sidebar_root_for`, uses its own branch, and a root missing from the file
keeps its folder tree.

The same tree drives the previous/next links and the navigation JSON, so the
pager and the sidebar always agree. An empty `sections` array warns and falls
back to the folder tree, and a `page` that does not exist warns and is
skipped. Placeholder nodes with `manual_link` and `sidebar_divider` rows stay
in the sidebar without becoming paging targets. A divider section keeps its
children here too; use the same
[group-only front matter](/docs/write/organize/#group-only) as in the folder
tree.

### Sidebar icon density {#sidebar-icons}

A page's `icon` front matter shows in the sidebar. An icon on every leaf makes
a long tree harder to scan, so you can limit them:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| Value | Effect |
| --- | --- |
| `all` (default) | Every entry with an icon shows it |
| `groups` | Only the root and entries with children show icons |
| `none` | No entry icons in the sidebar |

An invalid value warns and uses `all`. This site uses `groups`.

### Expanding headings in the sidebar {#sidebar-headings}

On a long Book chapter, readers can jump between sections from the sidebar
when the current page's h2–h4 headings appear as a branch under its row. The
branch is off by default; turn it on with:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_headings: 3 # false | true | 2 | 3 | 4
```

An integer from 2 to 4 is the deepest level shown, `true` means 2 (h2 only),
and `false` turns the branch off; any other value warns and turns it off. It
applies only to `type: book` pages and only under the current page's row, and
the outline on the right stays. Front matter or a section cascade can set the
same key, and `sidebar_headings: false` turns off an inherited setting.

## Table of contents {#toc}

The outline on the right lists the page's Markdown headings. Which levels it
collects is Hugo's own setting:

```yaml {title="hugo.yml"}
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
```

The outline always follows the reader: a continuous rail marks the current
section as the page scrolls, with no setting to turn on. Readers can collapse
the right column, and the browser remembers it. Below the `xl` breakpoint the
column hides and the outline moves into the sidebar drawer. An older
configuration may still set `params.ui.scroll_spy` or a page-level
`scroll_spy`; both are accepted and ignored.

To hide the outline on one page, set `notoc: true` in its front matter.

Only headings that reach Hugo's table of contents appear. Headings produced by
Markdown-style shortcodes (`{{%/* … */%}}`) do; headings inside ordinary
shortcodes (`{{</* … */>}}`) usually do not, so write structural headings in
Markdown.

## Section index style {#section-index}

A section with an `_index.md` lists its child pages automatically, either as a
list or as cards:

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
    section_index_columns: 2
```

- `list` (default): each child's title, then its description.
- `cards`: a grid of cards showing each child's `title` (or `linkTitle`),
  `description` and `icon`; `section_index_columns` (default 2) sets the
  columns.

A section can choose its own style in its front matter. An invalid value warns
and uses the default:

```yaml {title="content/docs/components/_index.md"}
---
title: Components
section_index: cards
section_index_columns: 3
---
```

`no_list: true` lists no children, `simple_list: true` lists them as plain
bullets without descriptions, and a child with `hide_summary: true` leaves
itself out. Let the theme build these lists rather than writing them by hand,
because a hand-written list drifts out of step with the sidebar.

## Page width {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

`normal` is a comfortable reading width, `wide` widens the content column and
`full` fills the window. Set it per page or, through a cascade, per section;
wide tables, large images and API references often need `wide`:

```yaml {title="content/docs/api/reference.md"}
---
title: API reference
page_width: wide
---
```

Book pages also accept `reading_width` (`slim`, `normal` or `wide`), which
changes the measure of the text without changing the shell. An invalid value
for either key warns and uses `normal`.

## Navbar and footer switches {#chrome}

The navbar and footer can be switched per page with top-level front matter
keys, not keys under `ui`. To change a whole section, set them once in its
cascade:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  navbar_enabled: false
  footer_style: slim
---
```

What each key does is described in
[Navigation and menus](/docs/customize/navigation/#navbar-disable) and
[Brand and appearance](/docs/customize/brand/#footer); the full list of keys is
in [Page parameters](/docs/write/frontmatter/).

## Verify {#verify}

```bash
hugo --printPathWarnings
```

- The build ends with `Total in …` and reports no ERROR.
- A new `type: docs` page has the left sidebar. If not, check that the cascade
  reaches it and that its type is in `shell_types`.
- Dragging the sidebar divider and reloading keeps the width; double-clicking
  restores the default.
- Below `md` the sidebar is a drawer you can close, and below `xl` the outline
  sits in that drawer.
- A section index shows as many entries as the sidebar has child pages.
- A page with `page_width: wide` is wider than its neighbors.
- With documentation at the site root, the build reports no duplicate output
  paths.

## Related {#related}

- [Configuration](/docs/customize/config/#shell) — defaults of the shell, sidebar and outline settings
- [Organizing content](/docs/write/organize/) — folder structure, `weight` and the sidebar tree
- [Navigation and menus](/docs/customize/navigation/) — navbar, section switcher and pager
- [Home and landing pages](/docs/customize/home/) — data for `layout: landing`
- [Page parameters](/docs/write/frontmatter/) — the front matter keys for per-page overrides
