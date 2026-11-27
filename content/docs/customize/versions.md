---
title: Versions
linkTitle: Versions
description: Publish documentation for several product versions side by side, with a version switcher and a banner that marks unmaintained versions as archives.
weight: 100
search_keywords: [versions, versioning, version menu, version_menu_pagelinks, archived_version, url_latest_version, archive, subpath deployment]
aliases:
  - /docs/configure/versioning/
---

A site needs versioned documentation when readers run different releases of
your product at the same time and those releases differ in ways a reader acts
on: commands, configuration keys, defaults. If most readers can move to the
latest release, or old releases differ only in fixed bugs, keep one site and
mark the exceptions in the text; a single site is easier to maintain and to
search.

OINK treats each version as a separate site: its own Hugo build, usually from
its own Git branch or tag, published at its own address. The theme connects
those sites with a version menu in the navbar and an archive banner on the
versions you no longer maintain.

## The version switcher {#version-menu}

List the versions under `params.versions`. When the list is not empty, a
branch icon in the navbar opens the version menu, and an icon-only menu in the
footer's bottom bar opens upward with the same entries.

```yaml {title="hugo.yml"}
params:
  # the version this site is
  version: v2.1
  # the menu's accessible name and tooltip (default: Version)
  version_menu: v2.1
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v2.0
      url: https://v2-0.docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
```

An entry shows its `version`, or its `name` when it has one. The entry whose
`version` equals `params.version`, or whose `url` equals the site's `baseURL`
(a trailing slash aside), is marked as the current one.

An entry without a `url` is a gray item that cannot be clicked, which makes a
group heading, and `name: '---'` draws a divider (a `url` on a divider warns).
`name` accepts inline Markdown:

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
[command palette](/docs/customize/panel/), so the menu and the palette always
agree.

## The trade-off in page-for-page links {#pagelinks}

By default a menu entry opens the target version's home page.
`version_menu_pagelinks: true` appends the current page's path to the target
URL instead, so switching version keeps the reader on the same document. The
risk is a 404: documentation structure changes between versions, and a page
added in v2.1 does not exist in v1.9. This site leaves the option off.

When most versions share a structure and one does not, turn the option on and
opt that one entry out:

```yaml {title="hugo.yml"}
params:
  version_menu_pagelinks: true
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
      pagelinks: false # restructured since; go to its home page
```

`pagelinks: false` is the only per-entry setting; an entry cannot turn page
links on when the site-wide option is off. Decide by how stable the structure
is rather than by how far apart the version numbers are: one extra click from
a version's home page costs the reader less than a 404.

## The archive banner {#archived-banner}

When you stop maintaining a version, mark its site as a snapshot so that
readers arriving from a search engine know to look for something newer:

```yaml {title="hugo.yml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

With `archived_version: true`, every page of the site, blog and landing pages
included, opens with a banner saying that version v1.9 is no longer actively
maintained and that this is an archived snapshot, with a link to
`url_latest_version`. The text comes in the site's language, so you write none
of it. The version number in the banner is `params.version`; without it the
banner has no text, so set both. A `url_latest_version` that fails the theme's
URL check warns, and the banner appears without the link.

## `params.version` versus `params.versions` {#site-version}

The two keys look alike but describe different things:

- `params.versions` is a list of sites: the versions in the menu and where
  each one lives.
- `params.version` names the version this build is. It marks the current menu
  entry, supplies the banner's version number, and is the fallback when a
  `data/download/*.yaml` file omits `version` (see
  [Releases and downloads](/docs/write/releases/)).

`params.version` is a label for readers and need not be a Git ref. When
content needs a release tag that resolves, such as the version in an install
command, declare a separate parameter for it instead of reusing
`params.version`. Both keys are defined in
[Configuration](/docs/customize/config/#languages-versions).

## Deployment layouts for multiple versions {#deployment}

| Layout | `baseURL` | Characteristics |
| --- | --- | --- |
| Subdomain | `https://v1-9.docs.example.com/` | Versions are fully independent; each needs its own DNS record and certificate |
| Subpath | `https://docs.example.com/v1.9/` | One domain collects all search ranking; the host must route each path to a different build |

Build each version on its own: check out its branch or tag, build with that
version's `hugo.yml`, and publish to its address. Because the menu is part of
each build, adding a version means updating `params.versions` on every branch
you still publish and rebuilding those sites; an old site that is not rebuilt
keeps its old menu. Archived sites carry the same list plus
`archived_version: true`.

> [!IMPORTANT] On a subpath deployment, `baseURL` must include the path segment
> Otherwise the search index, page actions and asset links all point at the
> domain root. The page looks correct, but search returns nothing, which makes
> this the most common subpath failure. See [Deploy](/docs/admin/deploy/) for
> the rest of the host setup.

## Verify {#verify}

Run these from your site's root after a production build. Replace
`public/docs/getting-started/index.html` with a documentation page your site
actually generates, including the language prefix if it has one.

1. Confirm that the version menu reached the page:

   ```bash
   hugo --printPathWarnings
   PAGE=public/docs/getting-started/index.html
   test -f "$PAGE" && grep -c 'nav-version-menu' "$PAGE"
   ```

   With `params.versions` empty or unset there is no menu at all.

2. Check that the current version is marked:

   ```bash
   grep -o 'td-nav-hover-menu__option td-is-active[^>]*' "$PAGE"
   ```

   No result means that no entry's `version` equals `params.version` and no
   entry's `url` equals `baseURL`.

3. Follow each menu link. With `version_menu_pagelinks` on, switch from a page
   that an older version lacks and check that the reader lands somewhere
   acceptable.

4. On an archived site, open any page and check that the banner is at the top,
   in the site's language, with a working link to the current version.

5. Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> and check that "switch
   version" lists the same versions as the menu.

## Related {#related}

- [Navigation and menus](/docs/customize/navigation/) — where the version menu sits in the navbar and sidebar
- [Command palette](/docs/customize/panel/) — "switch version" in the palette
- [Deploy](/docs/admin/deploy/) — `baseURL`, subpaths and multi-target publishing
- [Releases and downloads](/docs/write/releases/) — download data falling back to `params.version`
- [Configuration](/docs/customize/config/) — full definitions of `version` / `versions` / `archived_version`
