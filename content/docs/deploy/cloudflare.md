---
title: Deployment on Cloudflare Pages
linkTitle: Cloudflare Pages
description: Build and publish an Oink site with Cloudflare Pages.
weight: 30
aliases: [/docs/deployment/cloudflare/]
---

[Cloudflare Pages][] can build an Oink site from a connected GitHub or GitLab
repository and create preview deployments for reviewed branches. The consumer
build runs Hugo Extended directly and does not need a frontend package install.

## Configure the project {#configure-the-project}

Import the repository in **Workers & Pages**, select the production branch, and
use these settings:

| Setting                   | Value                                 |
| ------------------------- | ------------------------------------- |
| Production branch         | `main`, or the reviewed source branch |
| Build command             | `hugo --gc --minify`                  |
| Build output directory    | `public`                              |
| `HUGO_VERSION`            | `0.164.0`                             |
| `SKIP_DEPENDENCY_INSTALL` | `1`                                   |

Set `HUGO_VERSION` in both the Production and Preview environments. Cloudflare
Pages' v3 [build image][] currently defaults to Hugo `0.147.7`, which is below
Oink's minimum `0.160.1`. Pinning the validated version prevents a build-image
update from silently changing the toolchain. `SKIP_DEPENDENCY_INSTALL=1`
disables the generic dependency installation step that an Oink consumer does not
use.

If the Hugo site lives below the repository root, set **Root directory** to that
directory. The output value is relative to the selected root.

## Set the base URL {#set-the-base-url}

Production builds should use the site's canonical custom domain in `baseURL`.
For a preview that needs its generated Pages URL in canonical and absolute
links, use Cloudflare's deployment URL:

```sh
hugo --gc --minify --baseURL "$CF_PAGES_URL"
```

Do not publish that preview artifact as production without rebuilding it for the
canonical origin.

## Deploy and verify {#deploy-and-verify}

Save the configuration and inspect the first build log. A normal Oink consumer
build should run Hugo without npm, PostCSS, Autoprefixer, or theme-owned CDN
downloads. After deployment, verify:

- the `*.pages.dev` preview or custom domain serves the expected commit;
- English and translated routes use the intended canonical origin;
- search, language switching, dark mode, print, and representative components
  work;
- redirects, headers, custom domains, and `404` behavior match the Pages project
  configuration.

Cloudflare Git integration and Direct Upload are different project modes. Check
the current Pages documentation before choosing a mode that must later support
an external deployment pipeline.

[Cloudflare Pages]:
  https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/
[build image]:
  https://developers.cloudflare.com/pages/configuration/build-image/
