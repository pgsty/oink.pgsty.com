---
title: Organizing content
linkTitle: Organizing content
description: Arrange folders and `_index.md` files into the sidebar you want, then control order, section indexes, icons, folding, hidden pages and where documentation lives.
weight: 20
search_keywords: [organizing content, directory structure, sidebar, weight, _index, section, type, cascade, sidebar_root_for]
aliases:
  - /docs/content/organize/
---

The folders under `content/` are your navigation. Each folder becomes a group
in the sidebar, each Markdown file a page, and `weight` sets the order, so you
shape the sidebar by arranging files instead of maintaining a separate menu.
The same tree drives the breadcrumbs, the previous/next pager and the child
list on every section page, which keeps all of them in agreement.

## Directories are the sidebar {#tree-is-sidebar}

Hugo calls a folder a section; the Markdown files in it are its pages, and
nested folders are subsections. The sidebar renders that tree level by level,
labels each entry with `linkTitle` (or `title` when there is none), and orders
siblings by `weight`. A product's documentation might look like this:

```filetree {title="content/docs/"}
- content/
  - docs/
    - _index.md                      # the Docs root: type: docs + cascade
    - install/                       # weight: 10
      - _index.md
      - requirements.md              # weight: 10
      - linux.md                     # weight: 20
      - kubernetes.md                # weight: 30
    - operate/                       # weight: 20
      - _index.md
      - backup.md                    # weight: 10
      - upgrade/                     # weight: 20, a page bundle
        - index.md
        - upgrade-dialog.webp
    - reference/                     # weight: 90
      - _index.md
      - configuration.md
```

`upgrade/` is a page bundle: a folder holding `index.md` and the files that
page uses. It appears in the sidebar and gets its URL exactly like a single
file would; see [Creating a page](/docs/write/pages/#new-page).

## Every directory needs an `_index.md` {#index-pages}

A section's own page is the `_index.md` in its folder (`_index.zh.md` for
Chinese). Without it, Hugo still creates the section, but with no title,
description, icon or `weight`: the sidebar shows the bare folder name and you
cannot control its position.

```yaml {title="content/docs/deploy/_index.md"}
---
title: Deploy
linkTitle: Deploy
description: Publish the site to GitHub Pages, Cloudflare Pages or your own Nginx.
weight: 50
icon: fa-solid fa-cloud-arrow-up
---
```

A section's `_index.md` can also carry `cascade`, which applies front matter to
every page below it, so a setting shared by a whole subtree is written once:

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

Siblings sort by ascending `weight`; only pages with equal weights fall back to
date and then `linkTitle`. Number in steps of 10 (10, 20, 30) so you can later
insert a page between two others without renumbering them. A section's own
`weight`, set in its `_index.md`, places it among its siblings.

A page without `weight` counts as 0, and Hugo puts such pages after every page
that has one, ordered among themselves by date and title. That order shifts as
content changes, so give every page a `weight`.

## List or cards on a section index {#section-index}

Below the body of an `_index.md`, the theme lists the section's children, so a
section page needs no hand-written table of contents. The site chooses the
style:

```yaml {title="hugo.yml: the site-wide default"}
params:
  ui:
    section_index: cards # list | cards
```

`list`, the theme default, shows one line per child with its title and
description. `cards` lays out a grid of link cards built from each child's
`icon`, `linkTitle` and `description`; this section's own index page is an
example. In the card style, `description` is the card's text, so keep it to
one sentence that fits on a line. A section that needs the other style
overrides it in its front matter:

```yaml {title="content/docs/reference/_index.md"}
section_index: list
cascade:
  section_index: list   # and its descendant sections too
```

Two page switches work with either style: `simple_list: true` renders a compact
bulleted list of titles, and `no_list: true` leaves the list out for a page
whose body already provides its own navigation. Site-wide settings such as the
number of card columns are in
[Section index style](/docs/customize/layout/#section-index).

## Hiding from the sidebar {#hiding}

| Front matter | Effect |
| --- | --- |
| `toc_hide: true` | The page is absent from the sidebar tree and from the previous/next sequence. It is still published, and links to it still work |
| `hide_summary: true` | The page is absent from its section's child list |
| `sidebar_divider: true` | The entry stops being a link and becomes a group heading in the sidebar |
| `manual_link: https://…` | The sidebar row points elsewhere. Pair it with `manual_link_title` and `manual_link_target: _blank` |

`toc_hide` and `hide_summary` control two different places, so set both only
when the page should appear in neither.

## Sidebar icons {#icons}

Give a page or a section an icon with one Font Awesome class pair in its front
matter:

```yaml {title="content/docs/deploy/_index.md"}
icon: fa-solid fa-cloud-arrow-up
```

An icon on every leaf page makes a long sidebar hard to scan, so a site-wide
policy decides which entries show theirs:

```yaml {title="hugo.yml"}
params:
  ui:
    sidebar_icon_policy: groups # all | groups | none
```

| Value | Effect |
| --- | --- |
| `all` | Every entry that declares an `icon` shows it. This is the default when the key is unset |
| `groups` | Only the root and entries with children show icons; ordinary leaf pages do not |
| `none` | No entry icons in the sidebar |

For a new site, set `groups` explicitly: sections keep the icons that identify
them, and leaf pages stay plain. This site uses `groups`, which is why only
its sections carry icons in the sidebar.

## Expanding and folding {#folding}

A section with children has a fold arrow in the sidebar. By default the branch
that holds the current page is open and the others are closed, except blog
sections, which start open. `sidebar_expanded` in a section's `_index.md`
overrides that default in either direction:

```yaml {title="content/docs/reference/_index.md"}
sidebar_expanded: true   # this section is always expanded by default
```

The browser remembers the reader's choices for the sidebar as a whole: whether
it is collapsed, its width and its scroll position. It does not remember
individual branches; a site that wants that can add it with the
[sidebar API](#sidebar-api). Site-level folding, compact mode, how many levels
start open, width and truncation are set in
[Layouts and page types](/docs/customize/layout/#sidebar), and every key is
defined in [Configuration](/docs/customize/config/#sidebar).

## Groups without a landing page {#group-only}

When a folder exists only to group its children, make its `_index.md` a
divider and do not publish it:

```yaml
---
title: Reference
sidebar_divider: true
build:
  render: never
---
```

The title becomes a plain group label in the sidebar. When folding is on, its
button opens and closes the children, and without JavaScript the group stays
open. The children remain in the pager, search, the navigation JSON and the
print view. Omit `build` to keep publishing the section page while the sidebar
still shows a non-link label. A divider without children renders as a plain
separator heading.

Three other switches look similar but do something else, so none of them
replaces a group: `toc_hide` hides the section's whole subtree, `no_list` only
drops the child list from the section's own page, and `hide_summary` only
removes the entry from its parent's list. `build.render: link` keeps a
permalink without publishing a page; for a group that should never be a
destination, use `never`, so no other navigation can offer a link to it.

## The shell follows `type`, not the path {#type-and-shell}

The documentation shell (sidebar, table of contents, breadcrumbs, pager) does
not depend on the folder name. It comes with the page's `type`: the five
built-in types below have it, and they are the default of
`params.ui.shell_types` (see [Layouts and page types](/docs/customize/layout/#shell-types)
before changing that list).

```yaml {title="hugo.yml: the theme default"}
params:
  ui:
    shell_types: [docs, book, blog, swagger, expo]
```

Documentation can therefore live at any path, with a cascade assigning
`type: docs`. To put a handbook at `content/handbook/`, its section root reads:

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

The sidebar shows one tree at a time, and a row above it names that tree's
root: by default, the top-level section the reader is in. A large subtree, such
as a versioned API reference or a self-contained handbook, can become a root of
its own:

```yaml {title="content/docs/api/v2/_index.md"}
---
title: API reference v2
sidebar_root_for: self   # self | children
---
```

| Value | Meaning |
| --- | --- |
| `self` | The section's index page and all its descendants take it as their sidebar root |
| `children` | The index page stays in the parent tree; only its descendants use this root |

The switcher above the tree is the same on every page. It lists each top-level
section and each section that declares `sidebar_root_for: self`, as a plain
link when there is one entry and as a dropdown when there are more. To keep a
top-level section or a nested root out of that list, set
`sidebar_root_menu: false` in its `_index.md`; while a reader is inside that
section, the switcher still shows it as the current location.

Below the switcher, the root's index page is the first link in the tree: the
switcher picks a tree, and the root link opens a page. Set
`sidebar_root_link_self: false` to make that row point to the parent section
instead.

## Verify {#verify}

```bash
hugo --printPathWarnings
```

The build should end with `Total in …` and no `ERROR`. After moving folders
around, `--printPathWarnings` reports any two pages that now publish to the
same path.

Then check in the browser:

1. The sidebar order matches the `weight` values you wrote, and a new section appears where you expect it.
2. Each section index lists all of its children; a missing one has `hide_summary` set or lacks an `_index.md`.
3. Breadcrumbs and the pager follow the sidebar's order, because they read the same tree.
4. The tree has the same shape in every language, which needs a translated `_index.md` (such as `_index.zh.md`) beside each original.

If a section has more entries than `params.ui.sidebar_menu_truncate` allows,
the build warns and names the value to raise it to. Act on that warning: the
entries past the limit are missing from the sidebar.

## Controlling a branch from site code {#sidebar-api}

`window.OinkSidebar` lets site code open and close sidebar branches, for
example to restore a reader's saved choices. Load the script after the theme's
own scripts, for instance from `layouts/_partials/hooks/body-end.html`, and
wait for `ready` before reading or changing state. This example expands the
first group in the sidebar:

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

A branch's ID is the `aria-controls` value of its toggle button.
`getState(id)` returns `{id, expanded}`, or `null` for an unknown ID. Each
change dispatches one `oink:sidebar-disclosure` event on `document`, with the
detail `{id, expanded, source}`, after the button, the branch and their
accessibility state agree; setting the value a branch already has sends no
event. A branch that contains the current page stays open when you restore
state through the API, though the reader can still fold it.

If you persist branch choices, scope the storage key by language and by
navigation version, cope with storage being unavailable, and ignore saved IDs
that the current page does not have. The
[sidebar contract](/docs/design/shell/#sidebar-runtime) defines the full
lifecycle.

## Related {#related}

- [Writing pages](/docs/write/pages/) — how to write a single page
- [Page parameters](/docs/write/frontmatter/) — the full definition of every front matter key used here
- [Layouts and page types](/docs/customize/layout/) — site-level shell, sidebar and table-of-contents settings
- [Navigation and menus](/docs/customize/navigation/) — the navbar menu, breadcrumbs and pager
- [Languages](/docs/customize/i18n/) — keeping a bilingual tree consistent
