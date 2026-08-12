---
title: Versions
linkTitle: Versions
weight: 40
description:
  Let readers move between documentation versions, and mark archived ones.
cSpell:ignore: pagelinks
---

When a product has several supported releases, the documentation usually
follows. OINK provides two things: a **version switcher** and an **archived
version banner**.

How each version is deployed is up to you — commonly one subdomain or subpath
per version, each built separately.

## Version menu {#adding-a-version-drop-down-menu}

List the versions that should appear in the menu under `params.versions`:

```yaml {filename="hugo.yaml"}
params:
  version_menu: v2.1
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v2.0
      url: https://v2-0.docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
```

{{< fields >}} {{% field name="version_menu" type="string" %}} The label on the
menu button, usually the current version. {{% /field %}}
{{% field name="versions[].version" type="string" required=true %}} The version
identifier shown on the menu entry. {{% /field %}}
{{% field name="versions[].url" type="string" required=true %}} That version's
documentation address. An entry with no URL renders as unavailable.
{{% /field %}}
{{% field name="version_menu_pagelinks" type="boolean" default="false" %}}
Whether to append the current page path to the target version's URL.
{{% /field %}} {{< /fields >}}

Insert a separator with `- name: '---'` to divide supported from historical
releases:

```yaml {filename="hugo.yaml"}
params:
  versions:
    - name: '**Current**'
    - version: v2.1
      url: https://docs.example.com
    - name: '---'
    - name: '**Historical**'
    - version: v1.9
      url: https://v1-9.docs.example.com
```

## The page-level switching trade-off {#page-level-switching}

`version_menu_pagelinks: true` appends the current page path to the target
version's URL, so a reader switching versions **stays on the same document**.

The cost is that **the target version may not have that page**. Documentation
structure evolves between releases, an older version may not contain a newly
written page, and the reader lands on a 404.

```yaml {filename="hugo.yaml"}
params:
  version_menu_pagelinks: true
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
      pagelinks: false # structure differs too much; go to the home page
```

`pagelinks: false` on an individual entry overrides the global setting so that
version only ever receives its home page.

> [!TIP] Enable `pagelinks` when structure is broadly stable across versions.
> When it is not, leaving it off is better: an extra click beats a 404.

## Archived version banner {#archived-banner}

On a site for a release you no longer maintain, say so explicitly:

```yaml {filename="hugo.yaml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

{{< fields >}}
{{% field name="archived_version" type="boolean" default="false" %}} When
`true`, shows an archive notice at the top of every page. {{% /field %}}
{{% field name="version" type="string" %}} The version shown in the banner.
{{% /field %}} {{% field name="url_latest_version" type="string" %}} The current
version's address; the banner links to it. {{% /field %}} {{< /fields >}}

The banner text is localized with the site language; you do not write it.

## Deployment layout {#deployment-layout}

Two common arrangements:

| Layout    | `baseURL`                        | Character                      |
| --------- | -------------------------------- | ------------------------------ |
| Subdomain | `https://v1-9.docs.example.com/` | Fully independent versions     |
| Subpath   | `https://docs.example.com/v1.9/` | One domain; needs path routing |

> [!IMPORTANT] Under a subpath deployment, `baseURL` must include that path, or
> the search index, page actions, and asset links all point to the wrong place.
> This is the most common subpath failure.

Each version is built **independently**: check out the content from its branch
or tag, build with that version's own `hugo.yaml`, and publish the output to the
matching address. OINK does not build several versions in one pass.

## Next steps {#next-steps}

- [Languages](../language/): combining languages with versions
- [Deployment](/docs/deploy/): publishing each version
