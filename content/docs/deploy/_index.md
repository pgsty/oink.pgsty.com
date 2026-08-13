---
title: Deployment
linkTitle: Deployment
weight: 70
icon: fa-solid fa-cloud-arrow-up
description: Build once, publish to any static host.
cascade:
  categories: [Deployment]
---

An OINK site builds to a plain static directory. **Anywhere that serves static
files can host it** — no Node runtime, no server-side rendering, no build
plugins.

## Production build {#production-build}

```sh
hugo --gc --minify
```

Output goes to `public/`, which can be deployed independently of the source
tree.

{{< fields >}} {{% field name="--gc" type="flag" %}} Cleans unreferenced cache
resources after the build. {{% /field %}}
{{% field name="--minify" type="flag" %}} Minifies HTML, CSS, JS, and XML
output. {{% /field %}} {{% field name="--baseURL" type="string" %}} Overrides
the configured `baseURL`. **Must include the path when deploying to a subpath.**
{{% /field %}} {{< /fields >}}

## baseURL is the most common failure {#baseurl}

When deploying to a subpath, `baseURL` must contain it:

```sh
hugo --gc --minify --baseURL https://example.com/docs/
```

Getting it wrong does not produce a blank site. It produces a **subtler
half-broken state**: pages render, but the search index 404s, page-action links
point at the wrong location, and some assets fail to load.

When diagnosing, first check the path the browser requests for
`offline-search-index.*.json`.

## In this chapter {#in-this-chapter}

- [Cloudflare Pages](cloudflare/): Git integration, built on the platform
- [GitHub Pages](github-pages/): built and published with Actions
- [Other hosts](other/): Netlify, S3/CloudFront, and generic static hosting
- [Local and offline builds](local/): network-isolated environments

## Build environments and indexing {#build-environments}

Hugo's `-e` selects build-time behavior such as fingerprinting and minification.
It does **not** change which content exists.

A preview environment should keep search engines out:

```yaml {filename="hugo.yaml"}
params:
  # true on preview deployments
  private: true
```

Alternatively, build previews with a different `--baseURL` and set
`X-Robots-Tag` at the host.

## Pre-publish checklist {#pre-publish-checklist}

- [ ] `baseURL` is the real production address, including any subpath
- [ ] both languages open and the language switch works
- [ ] search returns results (check the index request path)
- [ ] print view and both color modes render
- [ ] the 404 page is reachable
- [ ] analytics, comments, and other integrations behave as intended
