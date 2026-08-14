---
downstream_modified: true
title: Deployment on GitHub Pages
linkTitle: GitHub Pages
description: Build and publish an Oink site with GitHub Actions and Pages.
weight: 20
aliases: [/docs/deployment/github-pages/]
---

If your source is hosted on [GitHub][], GitHub Pages can build and publish the
site with a single Actions workflow. The consuming site needs Hugo Extended but
does not need Node.js, npm, PostCSS, or a generated deployment branch.

Project sites use a URL such as `https://<OWNER>.github.io/<REPOSITORY>/`; user
and organization sites use `https://<OWNER>.github.io/`. Custom domains are also
supported.

## Prepare the repository

Push the complete site source to GitHub and confirm that this command succeeds
from the repository root:

```sh
hugo --gc --minify
```

Set the site's `baseURL` to its production URL, or pass the Pages URL with
Hugo's `--baseURL` option in the workflow. A project site must include the
repository path; otherwise CSS, JavaScript, and other resources will resolve
from the wrong location.

## Add the Pages workflow

Create `.github/workflows/pages.yml` with the following contents. Keep
`HUGO_VERSION` aligned with a version validated by the theme.

```yaml {filename=".github/workflows/pages.yml" lineNos="inline" collapse=24}
name: Deploy Hugo site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

env:
  GO_VERSION: 1.26.6
  HUGO_VERSION: 0.164.0

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
          submodules: recursive
      - uses: actions/setup-go@v6
        with:
          go-version: ${{ env.GO_VERSION }}
      - name: Install Hugo Extended
        run: |
          curl -L -o hugo.deb \
            "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
          sudo dpkg -i hugo.deb
      - uses: actions/configure-pages@v6
        id: pages
      - name: Build
        run: >-
          hugo --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
      - uses: actions/upload-pages-artifact@v5
        with:
          path: public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

If the theme is installed as a Git submodule, `submodules: recursive` checks it
out before Hugo runs. A complete offline archive can instead commit or restore
the site-owned `themes/oink/` directory as part of the repository or build
input.

## Enable GitHub Pages

In the repository settings, open **Pages**. Under **Build and deployment**, set
**Source** to **GitHub Actions**. Push the workflow to `main`, then follow its
first run in the repository's **Actions** tab.

The workflow uploads only the generated `public/` directory and publishes it
through the Pages deployment API. It does not maintain a `gh-pages` branch.

For other authentication, domain, and permission options, see GitHub's [Pages
documentation][GitHub Pages] and Hugo's [GitHub hosting guide][Hugo guide].

[GitHub]: https://github.com/
[GitHub Pages]: https://docs.github.com/en/pages
[Hugo guide]: https://gohugo.io/host-and-deploy/host-on-github-pages/
