---
title: Versions
linkTitle: Versions
description: Configure the version switcher and the archive banner, and choose how several versions are laid out across domains.
weight: 100
search_keywords: [versions, versioning, version menu, version_menu_pagelinks, archived_version, url_latest_version, archive, subpath deployment]
aliases:
  - /docs/configure/versioning/
---

When a product has several supported versions, its documentation usually needs
versions too. The theme provides two things: a version switcher in the navbar,
and an archive banner on older sites. The deployment layout is the site's
decision — the theme does no cross-version build, and each version is its own
Hugo build.

## The version switcher {#version-menu}

List the versions that should appear in the menu under `params.versions`. When
that list is non-empty, a branch-icon menu appears in the navbar's utility area,
with the same content in an icon-only upward menu in the footer's bottom bar.

```yaml {title="hugo.yml"}
params:
  # which version this site is
  version: v2.1
  # the accessible menu name; bottom-bar trigger remains icon-only
  version_menu: v2.1
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v2.0
      url: https://v2-0.docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
```

A menu entry shows its `version` value by default, or `name` when one is given.
The current entry is marked selected, decided by either the entry's `version`
equalling `params.version` or the entry's `url` equalling the site's `baseURL`.

An entry with no `url` renders as an unclickable grey item, usable as a group
heading; `name: '---'` is a divider (a `url` on a divider warns). `name` accepts
inline Markdown:

```yaml {title="hugo.yml"}
params:
  versions:
    - name: '**Current**'
    - version: v2.1
      url: https://docs.example.com
    - name: '---'
    - name: '**Older versions**'
    - version: v1.9
      url: https://v1-9.docs.example.com
```

The same list feeds "switch version" in the
[command palette](/docs/customize/panel/), so menu and palette never disagree.

## The trade-off in page-for-page links {#pagelinks}

`version_menu_pagelinks: true` appends the current page's path to the target
version's URL, so switching version **keeps the reader on the same document**.

The cost is that the target version may not have that page: documentation
structure evolves between versions, an older version lacks a newly added page,
and the reader who switches lands on a 404. This site leaves the option off.

A single entry can override the global setting:

```yaml {title="hugo.yml"}
params:
  version_menu_pagelinks: true
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
      pagelinks: false # this version's structure differs; go to its home page
```

> [!TIP] Judge by how stable the structure is, not by how far apart the versions are
> Turn it on where structure is stable and off where it moved. One extra step to
> a version's home page still beats a 404.

## The archive banner {#archived-banner}

On the site of a version no longer maintained, tell the reader it is a snapshot:

```yaml {title="hugo.yml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

With `archived_version: true`, a banner appears at the top of the body on every
documentation and book page, saying the current version is no longer actively
maintained and linking to `url_latest_version`. The wording is localized to the
site's language and needs no authoring; `version` is the version number the
banner shows.

The banner appears on documentation and book pages only, not on blog or landing
pages.

## `params.version` versus `params.versions` {#site-version}

Two similar names with different jobs:

- `params.versions` is **a cross-site list**: which versions the menu can reach and where each lives. It describes other sites.
- `params.version` is this build's own version identifier. It decides which menu entry is marked selected and which version number the archive banner shows, and it is the fallback when `data/download/*.yaml` omits `version` (see [Releases and downloads](/docs/write/releases/)).

It need not be a Git ref. Where a resolvable release tag is needed — the one an
install command references, say — declare a parameter of your own rather than
reusing `params.version`. The full definitions of both keys are in
[Configuration](/docs/customize/config/).

## Deployment layouts for multiple versions {#deployment}
| Layout | `baseURL` | Characteristics |
| --- | --- | --- |
| Subdomain | `https://v1-9.docs.example.com/` | Versions are fully independent; each needs its own DNS and certificate |
| Subpath | `https://docs.example.com/v1.9/` | One domain, SEO weight concentrated; the host must route by path to different artifacts |

Each version is an independent build: check the content out from its branch or
tag, build with that version's own `hugo.yml`, and publish to the matching
address. The current version's site lists every version; an older version's site
lists them and adds the archive banner.

> [!IMPORTANT] On a subpath deployment, `baseURL` must include the path segment
> Otherwise the search index, page actions and asset links all point at the
> domain root: the page looks fine and search returns nothing. This is the most
> common subpath failure; deployment details are in
> [Deploy](/docs/admin/deploy/).

## Verify {#verify}

1. After a build, confirm the version menu reached the page:

   ```bash
   grep -c 'nav-version-menu' public/docs/customize/versions/index.html
   ```

   With `params.versions` empty or unset, the menu is not generated at all.

2. Check whether the current version is marked selected:

   ```bash
   grep -o 'nav-hover-menu__option is-active[^>]*' public/index.html
   ```

   None at all means `params.version` does not match any entry's `version`
   field, or `baseURL` does not match that entry's `url` (mind the trailing
   slash).

3. Visit each link in the menu. With `version_menu_pagelinks` on, try it once from a document an older version lacks and confirm the landing is acceptable.

4. On an archived site, open any documentation page: the banner should sit at the top of the body, in the site's language, linking to the current version.

5. Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette; "switch version" should list the same set.

## Related {#related}

- [Navigation and menus](/docs/customize/navigation/) — where the version menu sits in the navbar and sidebar
- [Command palette](/docs/customize/panel/) — "switch version" in the palette
- [Deploy](/docs/admin/deploy/) — `baseURL`, subpaths and multi-target publishing
- [Releases and downloads](/docs/write/releases/) — download data falling back to `params.version`
- [Configuration](/docs/customize/config/) — full definitions of `version` / `versions` / `archived_version`
