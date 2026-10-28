---
title: Organizing content
linkTitle: Organizing content
description: Use the directory structure to create the sidebar tree. Configure `_index.md`, weight, index styles, icons, folding, hidden pages, and documentation paths.
weight: 20
search_keywords: [organizing content, directory structure, sidebar, weight, _index, section, type, cascade, sidebar_root_for]
aliases:
  - /docs/content/organize/
---

OINK requires no separate navigation configuration. The directory structure
under `content/` creates the sidebar tree. This page covers how directories and files are
arranged, section indexes, ordering, icons, folding, hiding, and multiple
sidebar roots.

## Directories are the sidebar {#tree-is-sidebar}

Hugo calls a directory a section. Its Markdown files are pages. A nested
directory is a subsection. The sidebar renders this tree level by level.
`weight` determines order. `linkTitle` supplies labels, with `title` as fallback. The tree on the left comes from this source:

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
Chinese). Without this file, Hugo still creates the section. It has no title,
description, icon, or `weight`. The sidebar shows the directory name. You cannot
control its order.

```yaml {title="content/docs/deploy/_index.md"}
---
title: Deploy
linkTitle: Deploy
description: Publish the site to GitHub Pages, Cloudflare Pages or your own Nginx.
weight: 50
icon: fa-solid fa-cloud-arrow-up
---
```

A section `_index.md` also supports `cascade`. It applies shared settings to
the whole subtree. You do not need to repeat them on each page.

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

Pages in a section use ascending `weight` order. Only equal weights use date
and `linkTitle`. Always use multiples of 10, such as 10, 20, and 30. You can
then insert a page between others without changing their weights. A section's own
`weight` decides its position among its siblings.

A page with no `weight` counts as 0, and Hugo places those after every page that
does have one, ordered among themselves by date and title. That order changes as
content changes. Give every page a `weight`.

## Single file or page bundle {#bundles}

A page with no resources of its own is a single `slug.md`. For a page with
images, cast files, or example files, use a directory. Put `index.md` and the
resources in that directory. The two shapes look identical in the sidebar and
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

`list` is the theme default. It shows one line per child page with its title
and description. `cards` is a grid of link cards reading each child's `icon`,
`linkTitle` and `description`. This site uses `cards`, and this section's index
page is the example. Override it in a single section's front matter when that
section needs the other style:

```yaml {title="content/docs/reference/_index.md"}
section_index: list
cascade:
  section_index: list   # and its descendant sections too
```

Two page-level switches work independently of the style. `simple_list: true`
renders a compact bulleted list. `no_list: true` generates no index. Use the
latter when the page body supplies its own navigation.

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
| `groups` | Only the root and nodes with children show icons. Ordinary leaf pages do not |
| `none` | No entry icons in the sidebar |

For a new site, set `groups` explicitly. Groups then keep their identifying
icons, and leaf pages omit icons. This site uses that setting. Only the six
sections on the left have icons.

## Expanding and folding {#folding}

A section with children carries a fold arrow in the sidebar. OINK saves the
whole sidebar's collapse, width, and scroll state. To persist individual branch
choices, add optional site code using the [sidebar runtime API](/docs/design/shell/#sidebar-runtime).
By default, the path containing the current page is expanded. Other paths are
collapsed. Blog-type sections are expanded by default.

```yaml {title="content/docs/reference/_index.md"}
sidebar_expanded: true   # this section is always expanded by default
```

Site-level folding, compact mode, initial expansion depth, width and truncation
are configured in [Layouts and page types](/docs/customize/layout/). The full
key definitions are in [Configuration](/docs/customize/config/).

## Hiding from the sidebar {#hiding}

| Front matter | Effect |
| --- | --- |
| `toc_hide: true` | The page is absent from the sidebar tree (it is still published, and links to it still work) |
| `hide_summary: true` | The page is absent from the section index |
| `sidebar_divider: true` | The entry stops being a link and becomes a group heading in the sidebar |
| `manual_link: https://…` | The sidebar row points elsewhere. Pair it with `manual_link_title` and `manual_link_target: _blank` |

`toc_hide` and `hide_summary` control two different entry points, so set both
only when the page should appear in neither.

## Groups without a landing page {#group-only}

Since OINK 1.1, a divider section keeps its children while its title has no
link. This fixes the missing children in v1.0.0. Use this
`_index.md` when the directory should only organize child pages:

```yaml
---
title: Reference
sidebar_divider: true
build:
  render: never
---
```

The title is a group label. If sidebar folding is enabled, its button folds
the children. The children remain in the pager, search, navigation JSON, and Print. Without JavaScript,
the group stays expanded. Omit `build` to keep publishing the section page
while still showing a non-link sidebar label. Leaf dividers keep their old
separator appearance.

`toc_hide` hides a section's entire subtree. `no_list` only removes the child
list from a section's body, and `hide_summary` removes an entry from its parent
page. None of these is a replacement for a group-only section. `build.render:
link` retains a permalink without publishing a page. For an unpublished group,
prefer `never`. This prevents other navigation from creating a destination.

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

By default, the current top-level section is the sidebar root. A row above the
tree names that root. A large subtree can have its own root. For example, use
a separate root for a versioned API reference or a self-contained handbook:

```yaml {title="content/docs/api/v2/_index.md"}
---
title: API reference v2
sidebar_root_for: self   # self | children
---
```

| Value | Meaning |
| --- | --- |
| `self` | The section's index page and all its descendants take it as their sidebar root |
| `children` | The index page stays in the parent tree. Only descendants use this root |

The switcher above the root is site-wide. It lists every top-level section and
every section that declares `sidebar_root_for: self`. With one entry, it shows
a plain link. With two or more entries, it shows a dropdown. To keep a
top-level section or nested self-root out of the global choices, write
`sidebar_root_menu: false` in its `_index.md`. The current root remains as a
location marker when browsing that section.

Below the switcher, the section index remains the tree's first link. The
switcher selects a tree. The root link opens a document.
`sidebar_root_link_self: false` makes that row point at the parent section
instead.

## Verify {#verify}

```bash
hugo --printPathWarnings
```

The build must complete with `Total in …` and no ERROR. `--printPathWarnings`
flags any two pages that resolve to the same output path when restructuring
directories.

Then confirm each of these in the browser:

1. The sidebar order matches the `weight` values you wrote, and a new section appears where expected.
2. The section index lists every child (a missing one comes from `hide_summary` or a missing `_index.md`).
3. Breadcrumbs and the pager follow the same order as the sidebar, because the pager reads the same tree.
4. The tree has the same shape after switching language (every `_index.md` needs a `.zh.md` counterpart).

When sidebar entries exceed `params.ui.sidebar_menu_truncate`, the build warns
and says what to raise it to. Do not ignore that warning. Truncated entries
never appear in the sidebar.

## Controlling a branch from site code {#sidebar-api}

The `window.OinkSidebar` API is available since OINK 1.1. v1.0.0 does not
provide it. Load site code after the theme scripts, for example through
`layouts/_partials/hooks/body-end.html`, and wait for `ready` before reading or
restoring branch state. This example expands the first sidebar group:

```javascript
const sidebar = window.OinkSidebar;
if (sidebar) {
  sidebar.ready.then(() => {
    const button = document.querySelector(
      '#td-shell-sidebar [data-td-shell-tree-toggle]'
    );
    if (!button) return;
    const id = button.getAttribute('aria-controls');
    sidebar.setExpanded(id, true);
  });
}
```

Use the button's existing `aria-controls` value as the region ID.
`getState(id)` returns `{id, expanded}` or `null`. A change sends one
`oink:sidebar-disclosure` event on `document`, after the button, region and
accessibility state agree. Its detail is `{id, expanded, source}`. Repeated
writes of the same value send no event. Restoring through the API keeps the
current page's ancestor groups open, while a reader can still fold them.

The theme does not save individual branch preferences. A site that adds this
should own the storage key's language and navigation-version scope, tolerate
unavailable storage, and ignore IDs absent from the current page. The
[sidebar contract](/docs/design/shell/#sidebar-runtime) defines the lifecycle.


## Related {#related}

- [Writing pages](/docs/write/pages/) — how to write a single page
- [Page parameters](/docs/write/frontmatter/) — the full definition of every front matter key used here
- [Layouts and page types](/docs/customize/layout/) — site-level shell, sidebar and table-of-contents settings
- [Navigation and menus](/docs/customize/navigation/) — the navbar menu, breadcrumbs and pager
- [Languages](/docs/customize/i18n/) — keeping a bilingual tree consistent
