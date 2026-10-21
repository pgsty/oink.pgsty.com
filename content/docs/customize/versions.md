---
title: Versions
linkTitle: Versions
description: Configure the version switcher and archive banner, and select a deployment layout for multiple documentation versions.
weight: 100
search_keywords: [versions, versioning, version menu, version_menu_pagelinks, archived_version, url_latest_version, archive, subpath deployment]
aliases:
  - /docs/configure/versioning/
---

If a product supports several versions, its documentation usually needs
versions too. The theme provides a navbar version switcher and an archive
banner on older sites. The site selects the deployment layout. The theme does
not build across versions. Each version requires a separate Hugo build.

## The version switcher {#version-menu}

List the menu versions under `params.versions`. If the list is nonempty, a
branch-icon menu appears in the navbar's utility area. An icon-only upward
menu in the footer's bottom bar shows the same content.

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

A menu entry shows its `version` value by default. If `name` is given, it
shows that name. An entry is selected if its `version` equals
`params.version` or its `url` equals the site's `baseURL`.

An entry without a `url` is a gray item that cannot be clicked. You can use
it as a group heading. `name: '---'` creates a divider. A `url` on a divider
causes a warning. `name` accepts inline Markdown:

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

The same list supplies "switch version" in the
[command palette](/docs/customize/panel/). The menu and palette therefore agree.

## The trade-off in page-for-page links {#pagelinks}

`version_menu_pagelinks: true` appends the current page's path to the target
version's URL. Version switching thus **keeps the reader on the same document**.

The target version may not have that page. Documentation structure can change
between versions. If an older version lacks a new page, switching to it
produces a 404. This site leaves the option off.

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
> Enable it where the structure is stable. Disable it where the structure changed.
> An extra step to a version's home page is preferable to a 404.

## The archive banner {#archived-banner}

If a version is no longer maintained, identify its site as a snapshot:

```yaml {title="hugo.yml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

With `archived_version: true`, a banner appears at the top of every
documentation and book page body. It states that the current version is no
longer actively maintained and links to `url_latest_version`. The text uses
the site's language. You do not need to write it. The banner shows the
`version` value as its version number.

The banner appears on documentation and book pages only, not on blog or landing
pages.

## `params.version` versus `params.versions` {#site-version}

These two parameters have different purposes:

- `params.versions` is **a cross-site list**. It identifies the versions available in the menu and their locations. It describes other sites.
- `params.version` identifies this build's version. It selects the menu entry and supplies the archive banner's version number. It is also the fallback when `data/download/*.yaml` omits `version`. See [Releases and downloads](/docs/write/releases/).

It does not have to be a Git ref. If you need a resolvable release tag, declare
a separate parameter. For example, an install command can use that parameter.
Do not reuse `params.version` for this purpose. The full definitions of both keys are in
[Configuration](/docs/customize/config/).

## Deployment layouts for multiple versions {#deployment}
| Layout | `baseURL` | Characteristics |
| --- | --- | --- |
| Subdomain | `https://v1-9.docs.example.com/` | Versions are fully independent. Each needs its own DNS and certificate |
| Subpath | `https://docs.example.com/v1.9/` | One domain concentrates SEO weight. The host must route paths to different artifacts |

Each version is an independent build. Check out its content from the branch or
tag. Build with that version's `hugo.yml`. Publish to the matching address.
The current version's site lists every version. Older sites list them and add
the archive banner.

> [!IMPORTANT] On a subpath deployment, `baseURL` must include the path segment
> Otherwise the search index, page actions and asset links all point at the
> domain root. The page looks correct, but search returns nothing. This is the
> most common subpath failure. For deployment details, see
> [Deploy](/docs/admin/deploy/).

## Verify {#verify}

Run from your site's root after a production build. In the commands below, replace
`public/docs/getting-started/index.html` with an actual generated documentation
page in your site (including a language prefix if needed).

1. After a build, confirm the version menu reached the page:

   ```bash
   hugo --printPathWarnings
   PAGE=public/docs/getting-started/index.html
   test -f "$PAGE" && grep -c 'nav-version-menu' "$PAGE"
   ```

   With `params.versions` empty or unset, the menu is not generated at all.

2. Check whether the current version is marked selected:

   ```bash
   grep -o 'td-nav-hover-menu__option td-is-active[^>]*' "$PAGE"
   ```

   If there is no result, `params.version` does not match an entry's `version`
   field, or `baseURL` does not match that entry's `url`. Check the trailing
   slash.

3. Visit each menu link. With `version_menu_pagelinks` enabled, switch from a document that an older version lacks. Confirm that the destination is acceptable.

4. On an archived site, open a documentation page. Confirm that the banner appears at the top of the body. It should use the site's language and link to the current version.

5. Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette. Confirm that "switch version" lists the same versions.

## Related {#related}

- [Navigation and menus](/docs/customize/navigation/) — where the version menu sits in the navbar and sidebar
- [Command palette](/docs/customize/panel/) — "switch version" in the palette
- [Deploy](/docs/admin/deploy/) — `baseURL`, subpaths and multi-target publishing
- [Releases and downloads](/docs/write/releases/) — download data falling back to `params.version`
- [Configuration](/docs/customize/config/) — full definitions of `version` / `versions` / `archived_version`
