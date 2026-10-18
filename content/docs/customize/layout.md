---
title: Layouts and page types
linkTitle: Layouts and page types
description: Let `type` decide which shell a page uses, then adjust sidebar width and icons, outline depth, section index style and page width.
weight: 50
search_keywords:
  [layout, page type, shell, sidebar, table of contents, TOC, section index, page width, type]
---

This page covers a page's skeleton: whether it has a sidebar, how wide that is,
how deep the outline goes, and whether a section index is a list or cards. Where
content goes is in [Organizing content](/docs/write/organize/); this page is
only about the shell.

The rule is that **the shell follows `type`, not the path**. Documentation can
live anywhere under `content/` as long as it has `type: docs`.

## Shell types {#shell-types}

`params.ui.shell_types` lists the types that use the reading shell with a
sidebar:

```yaml {title="hugo.yml"}
params:
  ui:
    shell_types: [docs, book, blog, swagger]
```

| type | Shell |
| --- | --- |
| `docs` | The documentation shell: left sidebar (section switcher + tree) + body + right-hand outline |
| `book` | The documentation shell, plus numbered targets, the `reading_width` measure and the draft banner |
| `blog` | The documentation shell, with the sidebar expanded by default and RSS as the left half of the title row |
| `swagger` | The documentation shell, with the body handed to Swagger UI or Redoc — see [API reference pages](/docs/write/openapi/) |
| Any other type | An ordinary page: navbar + single-column body + footer, with no sidebar |

OINK 1.3.0 adds `expo`: a shared sidebar and an image album,
with full page width and no right-hand outline. Its default `shell_types`
list includes `expo`. If you set the explicit list above, add `expo` to it.
See [Expo albums](/docs/write/expo/).

Taxonomy and term pages are not in this table but use the same shell.

Assigning a type to a subtree uses a cascade, which is how documentation ends up
at an arbitrary path:

```yaml {title="content/handbook/_index.md"}
---
title: Operations handbook
type: docs
cascade:
  type: docs
---
```

### Section roots are only navigation starting points {#sections}

```yaml {title="hugo.yml"}
params:
  ui:
    docs_section: docs
    blog_section: blog
```

These two keys **do not decide the shell**. They tell the theme where the
documentation and blog trees are rooted, for resolving the sidebar root, quick
links and default icons. The `content/handbook/` example above still has the
documentation shell, and leaving `docs_section` at `docs` does not affect it.

To make a docs page's sidebar root the site home rather than the documentation
section:

```yaml {title="hugo.yml"}
params:
  ui:
    docs_sidebar_root: home # home | section
```

Only these two values are valid. In normal preview, any other value warns and
uses `section`. Review the warning and rendered fallback before publication.

### Documentation at the site root {#docs-at-root}

A documentation-first site can publish the `docs` section at the URL root while
the source stays in `content/docs/`. Three pieces of configuration are needed
together.

The first uses Hugo's own `permalinks` to drop the `docs/` segment from URLs:

```yaml {title="hugo.yml"}
permalinks:
  page:
    docs: /:sections[1:]/:slug/
  section:
    docs: /:sections[1:]
```

The second keeps the physical site root index usable as a link target while no
longer competing for the same output path. Every language's site root index
(`content/_index.md`, `content/_index.zh.md`) needs it:

```yaml {title="content/_index.md"}
---
title: Product Docs
build: { render: link }
---
```

The third declares the sidebar root to be the site home, so the sidebar and the
pager share one tree:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_root_enabled: true
    docs_sidebar_root: home
```

With `docs_sidebar_root: home`, every top-level section of the site home enters
that tree. Overview sections that are not part of the reading sequence — blog,
community, download — opt out with `toc_root: true` in their own `_index.md`,
which keeps them out of the tree and out of the paging order:

```yaml {title="content/blog/_index.md"}
---
title: Blog
toc_root: true
---
```

Documentation then shares the URL root with blog, community and the rest. Build
with `--printPathWarnings` and resolve every duplicate target before publishing.

### Landing pages {#landing}

Any page with `layout: landing` uses the landing layout: navbar + a body
assembled from sections + footer, with no sidebar. How to write the data is in
[Home and landing pages](/docs/customize/home/).

```yaml {title="hugo.yml"}
params:
  ui:
    landing_search: true
```

`landing_search: false` removes the search entry point from the landing shell
and affects no other page.

## Sidebar {#sidebar}

The sidebar tree comes from the shape of `content/`, ordered by `weight` and
labelled with `linkTitle` where one exists. What is adjustable is density and
size:

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

- `sidebar_menu_compact` expands only the current branch and its neighbours; `false` expands the whole tree.
- `sidebar_menu_foldable` lets the reader expand and collapse sections manually. Blog sections are expanded by default; to collapse one by default, write `sidebar_expanded: false` in its `_index.md`.
- `sidebar_expand_levels` is how many levels are expanded by default.
- `sidebar_menu_truncate` is the maximum entries rendered per section, so a thousand-page tree does not inflate the HTML past usability.
- `sidebar_width_min` / `sidebar_width_max` bound drag-resizing on the desktop, in pixels. The reader's adjusted width is kept locally, and double-clicking the divider restores the default.
- `sidebar_item_overflow` defaults to `ellipsis` (long titles truncate); a site with many long titles can use `wrap`.

At `sidebar_cache_limit`, pages with the same effective settings may share a
neutral rendered tree. It remains visible and navigable without JavaScript;
the shell runtime only adds the current path and opens its ancestors. Page or
cascade overrides select the matching cached variant. A Book page with
`sidebar_headings` enabled keeps its page-specific tree instead.

Fold state, width and scroll position are stored locally per language. Below
`md` the sidebar becomes a drawer with a backdrop.

To drop the sidebar on one page, use front matter:

```yaml {title="content/docs/fullscreen-report.md"}
---
title: Full-screen report
sidebar_enabled: false
---
```

### An explicit navigation tree, data/docs_nav.json {#docs-nav}

By default, the theme derives the sidebar tree from `content/`. A site may
instead supply an explicit navigation manifest. The theme uses it only when
all three conditions hold:

- The site has a `data/docs_nav.json` containing a `sections` key;
- The page's type is `docs` or `book`;
- The resolved sidebar root is not the site home.

The file contains a nested node tree. Each node's `page` identifies a content
path, and `children` defines its navigation children. The theme resolves links
and the active branch from page identity and this tree. `url` and the
`active_path_by_url` ancestor map are optional legacy hints:

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

Write these paths without a language prefix or the deployment subpath from
`baseURL`. Since OINK 1.1, both prefixes are stripped before comparison,
so the same `/docs/start/` key works at `/zh/docs/start/` and
`/handbook/zh/docs/start/`. Rendered links retain the real language and deployment
prefixes.

The manifest can group root-level manuals without moving their source files
under `content/docs/`. Nodes apply to a sidebar root if they are that root,
content descendants, or Docs/Book pages resolving to the same root. For example,
with `docs_section: docs` and `docs_sidebar_root: section`, root-level pages
whose type is `docs` can use this tree:

```json {title="data/docs_nav.json"}
{
  "sections": [
    { "page": "/intro" },
    { "page": "/config", "children": [{ "page": "/api" }] }
  ]
}
```

Here `content/config.md` and `content/api.md` remain sibling files, while API
appears under Config in navigation. Selecting API expands Config without URL
hints. A custom page URL changes its link, not its sidebar ownership. A separate
Book root or nested `sidebar_root_for` root selects its own branch; a root
absent from the manifest uses its content tree.

This tree also sets paging order and navigation JSON. The sidebar and previous
/ next links therefore agree. An empty `sections` array warns and falls back to the content
tree. A nonexistent `page` warns and skips that entry. Review the warning and rendered fallback before publication. Placeholder nodes with `manual_link` and
`sidebar_divider` rows stay in the sidebar without becoming paging targets.
In 1.1, a divider section retains its children in this explicit tree too; use
the same [group-only front matter](/docs/write/organize/#group-only) as for the
content-derived tree.

Use an explicit tree when an external tool generates navigation order. For
example, a manual migrated from a Sphinx toctree may need to preserve chapter
order. If `weight` in `content/` maintains the order, you do not need this file.

### Sidebar icon density {#sidebar-icons}

An `icon` in a page's front matter appears in the sidebar. Icons on every leaf
page reduce readability, so a density policy controls them:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| Value | Effect |
| --- | --- |
| `all` | Every entry with an icon shows it (the compatibility default when unset) |
| `groups` | Only the root and nodes with children show icons |
| `none` | No entry icons in the sidebar |

An invalid value only warns and falls back to `all` rather than failing the
build. This site uses `groups`.

### Expanding headings in the sidebar {#sidebar-headings}

Book pages keep headings out of the left page tree by default. To add an
h2–h4 branch under the current sidebar row, opt in explicitly:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_headings: 3 # false | true | 2 | 3 | 4
```

An integer sets the deepest expanded level (2–4). The value `true` means 2,
or h2 only. The value `false` disables the branch. An out-of-range value warns
and disables it in normal preview. Review the warning and rendered fallback before publication.
This feature applies only to `type: book` pages. It expands only below the
current sidebar row. Page front matter or a section cascade can set the same
key; `sidebar_headings: false` turns off an inherited opt-in. The right outline
remains available.

## Table of contents {#toc}

The right-hand outline is generated by Hugo from the Markdown headings, and the
levels collected are Hugo's own configuration:

```yaml {title="hugo.yml"}
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
```

The normal shell runtime always tracks the active heading. It draws a continuous
rail, highlights the current section, and marks the position without a separate
switch. The reader can collapse the right column entirely, and that state is
kept locally. Below `xl` the right column is hidden and its content moves into
the sidebar drawer.

The 1.2.0 working implementation decodes valid URL fragments when tracking
headings. A malformed percent sequence falls back to the literal heading ID,
including when following a link to a heading near the page end.

The old `params.ui.scroll_spy` site key and `scroll_spy` page key remain accepted
as quiet compatibility no-ops throughout 1.x. Either boolean value produces the
same outline and loads no extra runtime; removing the keys is reserved for a
future breaking release.

To hide the outline on one page, use the front matter `notoc: true`.

Only headings that reach Hugo's table of contents appear in the outline:
headings emitted by a Markdown-form shortcode (`{{%/* … */%}}`) do, and those
from an ordinary shortcode (`{{</* … */>}}`) usually do not. Structural headings
belong in the Markdown.

## Section index style {#section-index}

A section with an `_index.md` lists its child pages automatically, in one of two
styles:

```yaml {title="hugo.yml"}
params:
  ui:
    section_index: cards # list | cards
    section_index_columns: 2
```

- `list` (the default): one title plus description paragraph per child page;
- `cards`: a grid of cards reading each child's `title` (or `linkTitle`), `description` and `icon`.

You can override this setting per section. An invalid value warns and uses a
fallback in normal preview. Review the warning and rendered fallback before publication:

```yaml {title="content/docs/components/_index.md"}
---
title: Components
section_index: cards
section_index_columns: 3
---
```

Related page-level switches: `no_list: true` lists no children;
`simple_list: true` emits a bulleted list with no descriptions; and a child page
with `hide_summary: true` removes itself from the list. **Do not hand-write a
child list**: a hand-written one goes out of step with the sidebar.

## Page width {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

`normal` is the usual reading width, `wide` widens the content column, and
`full` fills the viewport. It can be overridden per page or per section; wide
tables, large images and API reference pages often use `wide`:

```yaml {title="content/docs/api/reference.md"}
---
title: API reference
page_width: wide
---
```

Book pages also support `reading_width` (`slim` / `normal` / `wide`). This
changes body reading width without changing the shell. An invalid value in
either key warns and uses a fallback in normal preview. Review the warning and rendered fallback before publication.

## Navbar and footer switches {#chrome}

The navbar and footer are per-page layout decisions, written at the **top
level** of front matter (not under `ui`), and can be set once with a section
cascade:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  navbar_enabled: false
  footer_style: slim
---
```

The behaviour is in
[Navigation and menus](/docs/customize/navigation/#navbar-disable) and
[Brand and appearance](/docs/customize/brand/#footer), and the key definitions
in [Page parameters](/docs/write/frontmatter/).

## Verify {#verify}

```bash
hugo --printPathWarnings
```

- The build prints `Total in …` with no ERROR; review warnings and accept only the known upstream LibSass notice;
- Confirm that a new `type: docs` page has a left sidebar. If it does not, check its cascade and `shell_types`;
- Drag the sidebar divider and reload. Confirm that the width persists. Double-click to restore the default;
- Below `md` the sidebar becomes a closable drawer, and below `xl` the outline moves into the drawer;
- A section index has as many cards as the sidebar has child pages;
- A page with `page_width: wide` is wider than its neighbours;
- With documentation at the site root, `hugo --printPathWarnings` reports no duplicate output paths.

## Related {#related}

- [Configuration](/docs/customize/config/#shell) — defaults for the shell, sidebar and outline parameters
- [Organizing content](/docs/write/organize/) — directory structure, `weight` and the sidebar tree
- [Navigation and menus](/docs/customize/navigation/) — navbar, section switcher and pager
- [Home and landing pages](/docs/customize/home/) — writing the data for `layout: landing`
- [Page parameters](/docs/write/frontmatter/) — the front matter keys used for per-page overrides
