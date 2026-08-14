---
title: Start from the project site
linkTitle: Project site
weight: 50
description:
  Adapt oink.pgsty.com as a template to get a fully configured bilingual site
  quickly.
---

[`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) is OINK's
bilingual example and regression site. It is **deliberately more complete than a
minimal consuming site** — treat it as a reference, then delete what your
product does not need.

This path suits you if you want a working bilingual structure immediately and do
not mind deleting before editing. To control every setting from the start, use
[Create a site](../create-site/).

## Clone and build {#clone-and-build}

```sh
git clone https://github.com/pgsty/oink.pgsty.com.git product-docs
cd product-docs
hugo --gc --minify
```

The committed `go.mod` pins a public version of `github.com/pgsty/oink`, so a
fresh clone builds as-is.

If you are changing the theme at the same time, clone it as a sibling and use
the
[workspace commands on the install page](../install/#develop-against-a-local-checkout).

## Site checks need Node {#site-checks-need-node}

> [!IMPORTANT] This is easy to misread: **building a site with OINK does not
> need Node.js**. Node is required only to maintain this example repository and
> run its formatting, link, translation, and regression checks:
>
> ```sh
> npm ci
> npm test
> ```
>
> Your own product documentation site does not inherit that toolchain.

## Replace the example identity {#replace-the-example-identity}

Edit `hugo.yml` and replace these fields:

{{< fields >}} {{% field name="title / languages.<lang>.title" type="string" %}}
The site name, set per language. {{% /field %}}
{{% field name="baseURL" type="string" %}} Your own production address.
{{% /field %}} {{% field name="params.github_repo" type="string" %}} Your own
content repository, or Edit this page points at OINK's repository.
{{% /field %}} {{% field name="params.copyright" type="string | map" %}}
Docsy-compatible authors and year range for the bottom bar. {{% /field %}}
{{% field name="params.footer_center_info" type="string" %}} Optional inline
Markdown in the center of the bottom bar. {{% /field %}}
{{% field name="params.logo / params.wordmark" type="string" %}} Brand assets.
Replace the favicons under `static/` as well. {{% /field %}}
{{% field name="services.googleAnalytics.id" type="string" %}} **Delete it**
unless you actually want analytics. {{% /field %}}
{{% field name="params.comments" type="map" %}} The giscus configuration points
at OINK's repository; replace or remove it. {{% /field %}} {{< /fields >}}

## Replace the example content {#replace-the-example-content}

These directories under `content/` are OINK's own content. Delete them:

{{< filetree >}} {{< filetree/folder name="content" open=true >}}
{{< filetree/folder name="docs" >}}{{< /filetree/folder >}}
{{< filetree/folder name="blog" >}}{{< /filetree/folder >}}
{{< filetree/folder name="project" >}}{{< /filetree/folder >}}
{{< filetree/folder name="tests" >}}{{< /filetree/folder >}}
{{< /filetree/folder >}} {{< /filetree >}}

`project/` is OINK's own project record and `tests/` holds regression pages;
neither means anything for your product.

Keep the directory structure and `_index` pages of `docs/` and `blog/`, and
replace the prose with your own.

## Configure search {#configure-search}

The project site enables local search by default:

```yaml {filename="hugo.yml"}
params:
  offlineSearch: true
  offlineSearchIndex: summary
  offlineSearchMaxResults: 10
```

`offlineSearchIndex` takes two values:

| Value     | Indexed content             | Use when                                             |
| --------- | --------------------------- | ---------------------------------------------------- |
| `summary` | Title, description, excerpt | **Recommended**; keeps the index small               |
| `content` | Full body text              | Small sites; a thousand-page site produces megabytes |

## Put it in version control {#put-it-in-version-control}

After cleaning up, restart the repository history — your product documentation
should not carry OINK's commits:

```sh
rm -rf .git
git init
git add .
git commit -m "Initial documentation site"
```

Confirm `.gitignore` covers `public/`, `resources/`, and `go.work`.

## Next steps {#next-steps}

- [Basic configuration](../configuration/): review each setting
- [Deployment](/docs/deploy/): choose a hosting target
