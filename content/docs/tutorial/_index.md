---
title: Get started
linkTitle: Get started
description:
  Build a bilingual OINK documentation site from scratch and deploy it.
weight: 10
icon: fa-solid fa-rocket
cascade:
  categories: [Tutorial]
---

OINK is a Hugo theme that ships its browser runtimes with the theme. A consuming
site needs **only Hugo Extended**: no Node.js, no PostCSS, no CDN, and no remote
theme asset download during the build.

## What this chapter covers {#what-this-chapter-covers}

Read these seven pages in order and you will have a deployable bilingual
documentation site:

{{< fields >}} {{< field name="Prerequisites" type="5 min" >}} Install Hugo
Extended and confirm the binary reports `extended`. Git and Go are needed
depending on how you obtain the theme. {{< /field >}}
{{< field name="Install OINK" type="5 min" >}} Pin a version with Hugo Modules.
The other three distribution methods — offline archive, submodule, clone — are
on the same page. {{< /field >}}
{{< field name="Create a site" type="15 min" >}} From an empty directory to a
previewable page, including how bilingual content is organized. {{< /field >}}
{{< field name="Basic configuration" type="20 min" >}} Site identity, languages,
search, repository links, and production build flags. {{< /field >}}
{{< field name="Project site" type="optional" >}} Adapt `oink.pgsty.com`
directly as a template, which suits an open-source project that wants a
documentation site quickly. {{< /field >}}
{{< field name="Container preview" type="optional" >}} Run previews and
production builds in a container instead of installing Hugo locally.
{{< /field >}} {{< field name="Troubleshooting" type="reference" >}} How to
locate build, language, search, and platform problems. {{< /field >}}
{{< /fields >}}

## Three starting points {#three-starting-points}

| Your situation      | Suggested path                                                                        |
| ------------------- | ------------------------------------------------------------------------------------- |
| New project         | [Prerequisites](prerequisites/) → [Install](install/) → [Create a site](create-site/) |
| Existing Hugo site  | Go straight to [Install](install/) and import OINK as a module                        |
| Existing Docsy site | See [Migrate from Docsy](/docs/upgrade/from-docsy/); prose does not need rewriting    |

## Shortest path {#shortest-path}

With Hugo Extended, Git, and Go already installed, three commands get you
running:

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{% param tdVersion.latest %}}
hugo server
```

Add the module import to `hugo.yaml`:

```yaml {title="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

Every supported installation method uses the same preview and production
commands:

```sh
hugo server --disableFastRender   # local preview
hugo --gc --minify                # production build
```

## Next steps {#next-steps}

Once the site runs, continue as needed:

- [Site configuration](/docs/configure/): navigation menus, languages, versions
- [Components](/docs/components/): code blocks, Fields, FileTree, and the rest
- [Deployment](/docs/deploy/): Cloudflare Pages, GitHub Pages, and other hosts
