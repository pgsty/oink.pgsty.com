---
title: Organizing content
linkTitle: Organizing content
description: The directory structure is the sidebar tree — `_index.md` and weight, section index styles, icons and folding, hiding pages, and putting documentation at any path.
weight: 20
search_keywords: [organizing content, directory structure, sidebar, weight, _index, section, type, cascade, sidebar_root_for]
aliases:
  - /docs/content/organize/
---

OINK needs no separate navigation configuration: the directory structure under
`content/` is the sidebar tree. This page covers how directories and files are
arranged, section indexes, ordering, icons, folding, hiding, and multiple
sidebar roots.

## Directories are the sidebar {#tree-is-sidebar}

A directory is a section (Hugo's term), the Markdown files inside it are its
pages, and a nested directory is a subsection. The sidebar renders that tree
level by level, ordered by `weight`, labelled with `linkTitle` and falling back
to `title`. The tree on the left comes from this source:

```filetree {title="the first two levels of content/docs/"}
- content/
  - docs/
    - _index.md                      # section root: type: docs + cascade
    - about/                         # Introduction   {open=false}
      - _index.md
      - features.md
    - start/                         # Get started    {open=false}
      - _index.md
    - write/                         # Authoring (this section)
      - _index.md                    # weight: 30
      - pages.md                     # weight: 10
      - organize.md                  # weight: 20
      - frontmatter.md               # weight: 30
    - components/                    # Components     {open=false}
      - _index.md
```

## Every directory needs an `_index.md` {#index-pages}

A section index is the `_index.md` inside the directory (`_index.zh.md` for
Chinese). Without one Hugo still creates the section, but it has no title,
description, icon or `weight`: the sidebar row shows the directory name and the
ordering is out of your control.

```yaml {title="content/docs/deploy/_index.md"}
---
title: Deploy
linkTitle: Deploy
description: Publish the site to GitHub Pages, Cloudflare Pages or your own Nginx.
weight: 50
icon: fa-solid fa-cloud-arrow-up
---
```

A section `_index.md` has one further power: `cascade` pushes shared settings
down the whole subtree once, instead of repeating them on every page.

```yaml {title="content/docs/reference/_index.md"}
---
title: Reference
weight: 90
cascade:
  pager: false        # no previous / next on any page in this subtree
  search_boost: 0.8   # reference pages rank slightly lower in search
---
```

## Ordering: use multiples of 10 for weight {#weight}

Pages in a section are sorted by ascending `weight`, and only equal weights fall
back to date and `linkTitle`. Always use multiples of 10 (10, 20, 30) so a page
can be inserted between two others without touching the rest. A section's own
`weight` decides its position among its siblings.

A page with no `weight` counts as 0, and Hugo places those after every page that
does have one, ordered among themselves by date and title. That order drifts as
content changes, so give every page a `weight`.

## Single file or page bundle {#bundles}

A page with no resources of its own is a single `slug.md`. A page carrying
images, cast files or example files becomes a directory with an `index.md` and
the resources beside it. The two shapes look identical in the sidebar and
produce the same URL. See
[Writing pages](/docs/write/pages/#new-page).

## List or cards on a section index {#section-index}

After the body of an `_index.md`, the theme appends an index of the child pages
in one of two styles:

```yaml {title="hugo.yml: the site-wide default"}
params:
  ui:
    section_index: cards # list | cards
```

`list` is the theme default — one line per child page with its title and
description. `cards` is a grid of link cards reading each child's `icon`,
`linkTitle` and `description`. This site uses `cards`, and this section's index
page is the example. Override it in a single section's front matter when that
section needs the other style:

```yaml {title="content/docs/reference/_index.md"}
section_index: list
cascade:
  section_index: list   # and its descendant sections too
```

Two page-level switches are independent of the style: `simple_list: true`
renders a compact bulleted list, and `no_list: true` generates no index at all,
for a page whose body writes its own navigation.

> [!TIP]
> In the card style, `description` is the card body. Keep it to one sentence
> that fits on a single line.

## Sidebar icons {#icons}

Write one Font Awesome class pair in a page's or section's front matter:

```yaml {title="content/docs/deploy/_index.md"}
icon: fa-solid fa-cloud-arrow-up
```

Icon density is a site-level policy, so that leaf pages do not all carry icons:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| Value | Effect |
| --- | --- |
| `all` | Every entry that declares an `icon` shows it (the compatibility default when unset) |
| `groups` | Only the root and nodes that have children show icons; ordinary leaf pages do not |
| `none` | No entry icons in the sidebar |

A new site is better off writing `groups` explicitly: the semantic markers on
groups stay and the leaf-level icons go. This site uses that setting, so only
the six sections on the left carry icons.

## Expanding and folding {#folding}

A section with children carries a fold arrow in the sidebar, and the reader's
expansion state is kept locally. The default behaviour: the path containing the
current page is expanded and everything else is collapsed; blog-type sections
are expanded by default.

```yaml {title="content/docs/reference/_index.md"}
sidebar_expanded: true   # this section is always expanded by default
```

Site-level folding, compact mode, initial expansion depth, width and truncation
are configured in [Layouts and page types](/docs/customize/layout/); the full
key definitions are in [Configuration](/docs/customize/config/).

## Hiding from the sidebar {#hiding}

| Front matter | Effect |
| --- | --- |
| `toc_hide: true` | The page is absent from the sidebar tree (it is still published, and links to it still work) |
| `hide_summary: true` | The page is absent from the section index |
| `sidebar_divider: true` | The entry stops being a link and becomes a group heading in the sidebar |
| `manual_link: https://…` | The sidebar row points elsewhere; pair it with `manual_link_title` and `manual_link_target: _blank` |

`toc_hide` and `hide_summary` control two different entry points, so set both
only when the page should appear in neither.

## The shell follows `type`, not the path {#type-and-shell}

The documentation shell (sidebar, table of contents, breadcrumbs, pager) does
not depend on the directory name. It depends only on whether the page's `type`
is listed in `params.ui.shell_types`:

```yaml {title="hugo.yml: the theme default"}
params:
  ui:
    shell_types: [docs, book, blog, swagger]
```

Documentation can therefore live at any path, with `type` assigned by a cascade.
To put a handbook at `content/handbook/`, the section root reads:

```yaml {title="content/handbook/_index.md"}
---
title: Operations handbook
type: docs
sidebar_root_for: self      # the sidebar tree roots here rather than falling back to /docs
cascade:
  type: docs                # the whole subtree uses the documentation shell
---
```

> [!IMPORTANT]
> When the documentation directory is not called `docs`, `sidebar_root_for: self`
> is needed alongside `type: docs`. Otherwise the sidebar looks for its root at
> `params.ui.docs_section` (default `docs`), and a reader under `/handbook/`
> sees the `/docs/` tree.

## Multiple sidebar roots {#sidebar-roots}

By default the sidebar tree roots at the top-level section the reader is in, and
a row above the tree names the current root. A large subtree can become a root
of its own — a versioned API reference, say, or a self-contained handbook:

```yaml {title="content/docs/api/v2/_index.md"}
---
title: API reference v2
sidebar_root_for: self   # self | children
---
```

| Value | Meaning |
| --- | --- |
| `self` | The section's index page and all its descendants take it as their sidebar root |
| `children` | The index page stays in the parent tree; only the descendants root here |

The switcher above the root is site-wide: it lists every top-level section plus
every section anywhere that declares `sidebar_root_for: self`. With only one
entry it degrades to a plain link; two or more make it a dropdown. To keep a
top-level section out of the switcher, write `sidebar_root_menu: false` in its
`_index.md`.

Below the switcher, the section index remains the first link in the tree: the
switcher picks a tree and the root link points at a document.
`sidebar_root_link_self: false` makes that row point at the parent section
instead.

## Verify {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

It must reach `Total in …` with no ERROR and no WARN. `--printPathWarnings`
reports two pages resolving to the same output path, which happens most often
while changing the directory structure.

Then confirm each of these in the browser:

1. The sidebar order matches the `weight` values you wrote, and a new section appears where expected;
2. The section index lists every child (a missing one comes from `hide_summary` or a missing `_index.md`);
3. Breadcrumbs and the pager follow the same order as the sidebar, because the pager reads the same tree;
4. The tree has the same shape after switching language (every `_index.md` needs a `.zh.md` counterpart).

When sidebar entries exceed `params.ui.sidebar_menu_truncate`, the build warns
and says what to raise it to. That warning cannot be ignored: truncated entries
never appear in the sidebar.

## Related {#related}

- [Writing pages](/docs/write/pages/) — how to write a single page
- [Page parameters](/docs/write/frontmatter/) — the full definition of every front matter key used here
- [Layouts and page types](/docs/customize/layout/) — site-level shell, sidebar and table-of-contents settings
- [Navigation and menus](/docs/customize/navigation/) — the navbar menu, breadcrumbs and pager
- [Languages](/docs/customize/i18n/) — keeping a bilingual tree consistent
