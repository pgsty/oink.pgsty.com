---
title: Get started
linkTitle: Get started
description: Start from the official OINK Starter. Verify the local site, then customize content, language, brand, integrations, and deployment in that order.
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords:
  [
    get started,
    quick start,
    OINK Starter,
    template,
    install,
    Hugo,
    preview,
    deploy,
  ]
aliases:
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

For a new site, the recommended path starts with
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter), instead of a copy
of this documentation and regression repository. The Starter is a public GitHub
template. It pins a published OINK release and builds without changes. It
contains only neutral project content and deployment workflows.

> [!IMPORTANT] Current Hugo baseline
> Development, CI, and release tests use Hugo Extended {{% param hugoMinVersion %}}
> and Go 1.27. The Hugo baseline remains pinned. When starting
> from an older Starter snapshot, update its Hugo workflow pins to this baseline;
> older Hugo compatibility is no longer maintained.

## Choose a path {#choose}

| Starting point | Path | Result |
| --- | --- | --- |
| New documentation or project site | [OINK Starter](/docs/start/starter/) | A small three-language Docs, Blog, and Book site with two deployment workflows |
| Existing Hugo site | [From scratch](/docs/start/from-scratch/) | Add the OINK module and required Goldmark settings without replacing content |
| Existing Docsy or older OINK site | [Upgrade](/docs/admin/upgrade/) | Preserve content, migrate supported syntax, and review site overrides |

## Five-minute baseline {#baseline}

1. ### Install the tools {#tools}

   Install Git, Go 1.27 or newer, and Hugo Extended 0.168.0 or newer. The Hugo
   output must contain `extended`:

   ```console
   $ go version
   go version go1.27.0 darwin/arm64
   $ hugo version
   hugo v0.168.0+extended+withdeploy darwin/arm64
   ```

   On macOS, `brew install git go hugo` supplies them. On Linux and Windows,
   use the official [Hugo installation guide](https://gohugo.io/installation/)
   and [Go downloads](https://go.dev/dl/). Choose Hugo **Extended**.

1. ### Create or clone the site {#clone}

   If you intend to keep the repository, open the Starter and select
   **Use this template**. Then clone the repository that GitHub creates.
   To evaluate the original without changes, use these commands:

   ```bash
   git clone https://github.com/pgsty/oink-starter.git my-docs
   cd my-docs
   hugo server
   ```

1. ### Open the baseline {#open}

   Open <http://localhost:1313/>. The default Starter also publishes Chinese at
   `/zh/` and French at `/fr/`. Confirm that Docs, Blog, Book, search, language
   switching, and light/dark mode all work before editing anything.

1. ### Make one visible change {#first-change}

   Change the title and canonical URL at the top of `hugo.yaml`, then edit one
   sentence in `data/home/en.yaml`. Reload the browser. If both changes appear, configuration, content, and the
   pinned theme are connected correctly.
{.steps}

## Customize from shallow to deep {#learning-path}

- [Use OINK Starter](/docs/start/starter/) — choose languages first, then identity,
  home page, content, navigation, brand, integrations, and deployment.
- [Starter repository tour](/docs/start/anatomy/) — which file owns each part
  of the site, what to replace, and what can be removed.
- [Writing pages](/docs/write/pages/) — front matter, headings, links, images,
  drafts, and the page-end controls.
- [Components](/docs/components/) — add expression only after the content tree
  is stable.
- [Brand and appearance](/docs/customize/brand/) — logo, accent, typography,
  width, and CSS extension points.
- [Deploy](/docs/admin/deploy/) — use the supplied GitHub Pages or Cloudflare
  Pages workflow, then verify the real public routes.
{.cards}

Verify the build and content tree first. This makes the site easier to debug.
Changing languages, navigation, CSS, analytics, and hosting together makes it
harder to identify a failure.

## Publication gate {#publication-gate}

Before the first push, run the production build that the Starter workflows use.
This build keeps warnings visible for review:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

The command succeeds if it ends with `Total in …` and prints no warning or
error. `public/` must contain the language roots and representative Docs, Blog,
and Book routes. This does not prove deployment. A local build, commit, push,
successful workflow, and correct public rendering are separate checks.

## Next {#next}

Start with the [complete Starter tutorial](/docs/start/starter/). If the
template has more structure than your project needs, use the
[repository tour](/docs/start/anatomy/) to remove it safely. Use
[From scratch](/docs/start/from-scratch/) only when adding OINK to an existing
site or when you explicitly want to assemble every file yourself.
