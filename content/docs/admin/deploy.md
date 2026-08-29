---
title: Deploy
linkTitle: Deploy
description: Publish public/ to GitHub Pages, Cloudflare Pages or any static host — matching baseURL, Content Security Policy, the acceptance checklist and rollback.
weight: 20
search_keywords: [deploy, publish, GitHub Pages, Cloudflare Pages, Netlify, Vercel, Nginx, object storage, hugo deploy, baseURL, subpath, CSP, hosting]
aliases:
  - /docs/deploy/
  - /docs/deploy/github-pages/
  - /docs/deploy/cloudflare/
  - /docs/deploy/other/
---

An OINK site's output is a plain static directory, deployable anywhere that
hosts static files, with no Node runtime, no server-side rendering and no build
plugin. The host's side is three things: run one command with the right Hugo
version, publish `public/`, and keep `baseURL` matching the final address.

The prerequisite is a warning-free
[production build](/docs/admin/preview/#production-build) locally.

## Getting baseURL right {#baseurl}
`baseURL` is the commonest source of failure, and it fails quietly: the page
opens, but the search index 404s, page action links point at the wrong place,
and some assets do not load.

Deploying at a domain root:

```yaml {title="hugo.yml"}
baseURL: https://oink.pgsty.com
```

Deploying to a subpath (`https://example.com/docs/`), the path must be in
`baseURL`:

```yaml {title="hugo.yml"}
baseURL: https://example.com/docs/
```

It can also be overridden at build time, so one source deploys to several
places:

```bash {title="Terminal"}
hugo --gc --minify --baseURL "https://example.com/docs/"
```

> [!WARNING] Do not fix a subpath with `canonifyURLs`
> Hugo's `canonifyURLs` defaults to `false`; keep that default. OINK's templates
> and content links all resolve against `baseURL`: a wrong path means a wrong
> `baseURL`, and turning `canonifyURLs` on rewrites the relative links that were
> already correct, making the problem harder to locate.

To tell whether it matches, look at the search index request path after a build:
the browser should fetch `<baseURL>/offline-search-index.en.json`, and fetching
it from anywhere else means `baseURL` is wrong.

## Choosing a host {#hosts}

{{< tabs group="host" default="ghpages" label="Host" >}}
{{< tab label="GitHub Pages" value="ghpages" >}}

With the source on GitHub, one Actions workflow is enough: the build runs in
Actions and the output is published through the Pages deployment API, with no
`gh-pages` branch to maintain. OINK Starter already includes the file below;
copy it only when assembling a site manually.

```yaml {title=".github/workflows/github-pages.yaml" lineNos="inline" collapse=30}
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

env:
  HUGO_VERSION: 0.165.0
  # a workspace from a sibling checkout must never take part in a CI build
  GOWORK: off
  HUGO_MODULE_WORKSPACE: off
  HUGO_CACHEDIR: ${{ github.workspace }}/.hugo_cache

jobs:
  build:
    name: Build Pages artifact
    runs-on: ubuntu-latest
    steps:
      - name: Check out source
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Set up Go
        uses: actions/setup-go@v7
        with:
          go-version-file: go.mod
          cache-dependency-path: go.sum

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Install Hugo Extended
        run: |
          curl --fail --location --silent --show-error \
            --output "${RUNNER_TEMP}/hugo.deb" \
            "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
          sudo dpkg -i "${RUNNER_TEMP}/hugo.deb"

      - name: Download OINK
        run: go mod download github.com/pgsty/oink

      - name: Build
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings --panicOnWarning \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: public

  deploy:
    name: Deploy
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Publish
        id: deployment
        uses: actions/deploy-pages@v5
```

That is the workflow shipped by OINK Starter. Several pieces cannot be removed:

- `fetch-depth: 0` — with `enableGitInfo` on, "last modified" and contributor information need the full Git history, and a shallow clone leaves them empty.
- `setup-go` plus `go mod download` — with the theme as a Hugo Module, Hugo needs Go to resolve it. A site installing the theme as a submodule uses `submodules: recursive` instead, and one using an offline archive commits `themes/oink/`; either way both steps go.
- `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` — keep a local development `go.work` from taking part in the CI build, so CI verifies the published tag pinned in `go.mod`.
- `--baseURL "${{ steps.pages.outputs.base_url }}/"` — a project site's URL is `https://<OWNER>.github.io/<REPO>/`, and `configure-pages` computes it, so it need not be hard-coded.
- `--panicOnWarning` — a warning means no publish.

In the repository, set Settings → Pages → Build and deployment → Source to
GitHub Actions, push to `main`, and watch the first run on the Actions tab.

A custom domain goes in the Custom domain field on that same settings page, with
DNS configured as prompted, after which `baseURL` in `hugo.yaml` becomes that
domain. Where the publishing flow needs a `CNAME` file in the output, put it at
`static/CNAME` and Hugo copies it into `public/` unchanged.

{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}

OINK Starter ships `.github/workflows/cloudflare-pages.yaml`, a Direct Upload
workflow. The strict build stays in GitHub Actions and Wrangler uploads the
same `public/` artifact to a Cloudflare Pages project.

1. Create a **Direct Upload** Pages project. By default its name matches the
   repository; override it with repository variable `CLOUDFLARE_PROJECT_NAME`.
1. Add repository secrets `CLOUDFLARE_ACCOUNT_ID` and
   `CLOUDFLARE_API_TOKEN`. The token needs **Account → Cloudflare Pages → Edit**.
1. Run **Deploy to Cloudflare Pages** manually once. Set repository variable
   `CLOUDFLARE_PAGES_ENABLED=true` to deploy every push to `main`.
1. The canonical URL defaults to `https://<project>.pages.dev/`. Set
   `CLOUDFLARE_SITE_URL` when a custom domain becomes production.
{.steps}

The workflow pins Hugo Extended 0.165.0, reads Go from `go.mod`, disables local
module workspaces, and builds with `--panicOnWarning` before upload. It is the
recommended reproducible path for Starter users.

Cloudflare Git integration remains valid as a separate mode: configure build
command `hugo --gc --minify --printPathWarnings --panicOnWarning`, output
directory `public`, Hugo `0.165.0`, and Go `1.27`. Use Git integration **or**
the Direct Upload workflow for one project, not both. A preview deployment is
still not production proof; rebuild with its own URL and keep it unindexed.

{{< /tab >}}
{{< tab label="Others" value="other" >}}

**Netlify** — build command `hugo --gc --minify`, publish directory `public`,
environment variable `HUGO_VERSION`. The same settings can live in the
repository:

```toml {title="netlify.toml"}
[build]
command = "hugo --gc --minify --printPathWarnings --panicOnWarning"
publish = "public"

[build.environment]
HUGO_VERSION = "0.165.0"
```

With the theme as a submodule, enable recursive submodule checkout; with a Hugo
Module, the build environment needs Git and Go. Production and preview should
use one Hugo version, unless the preview environment exists to test an upgrade.

**Vercel** — the same three things: build command `hugo --gc --minify`, output
directory `public`, environment variable `HUGO_VERSION`. It likewise needs no
npm install.

**Any static server (Nginx / Caddy)** — lay the contents of `public/` down as
they are:

```nginx {title="/etc/nginx/conf.d/docs.conf"}
server {
    listen 80;
    server_name docs.example.com;
    root /var/www/oink;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

The site is purely static; there is no path to forward to an application server.

**Object storage** — Hugo has a `deploy` command; put the target in the
configuration:

```yaml {title="hugo.yml"}
deployment:
  targets:
    - name: aws
      URL: 's3://www.your-domain.tld'
      cloudFrontDistributionID: E9RZ8T1EXAMPLEID
```

Run `hugo deploy` after a build: it compares the remote with `public/`, uploads
only what changed, and invalidates the CDN cache when given a
`cloudFrontDistributionID`. Without `--target` it uses the first target, and
`--dryRun` shows what would change first. Two prerequisites: a Hugo binary built
`withdeploy` (visible in `hugo version`), and cloud credentials supplied through
the standard environment variables or configuration file (on AWS, confirm with
`aws s3 ls` first).

**Offline packaging** — in a network-isolated environment, build on a connected
machine and carry the output across as one package:

```bash {title="Terminal"}
hugo --gc --minify --baseURL "https://docs.internal.example.com/"
tar -czf oink-site-$(date +%Y%m%d).tar.gz -C public .

# on the target machine
tar -xzf oink-site-20260817.tar.gz -C /var/www/oink
```

Build with the target environment's `baseURL` from the start; the absolute links
in the output cannot be changed after unpacking.

**A host without Go** — the Hugo Module method needs Go in the build
environment. Where a platform does not provide it, switch to a Git submodule
(running `git submodule update --init` before the build) or an offline archive
(committing `themes/oink/`) — see
[From scratch and other install methods](/docs/start/from-scratch/).

{{< /tab >}}
{{< /tabs >}}

## Keeping preview deployments unindexed {#preview-builds}

Hugo's `-e` / `--environment` selects build-time behaviour and does not change
the site's content, but three things in OINK follow it: only `production` emits
`<meta name="robots" content="index, follow">`, only it makes `robots.txt` read
`Allow: /`, and only it renders the Google Analytics template. Do not build PR
previews and staging with `--environment production`:

```bash {title="Terminal"}
hugo --gc --minify --environment staging --baseURL "$PREVIEW_URL"
```

The output then carries `noindex, nofollow` and `Disallow: /`, and reports
nothing to an analytics service.

## Content Security Policy {#csp}

The runtimes, fonts and icons the theme ships are all same-origin assets, so a
strict Content Security Policy is workable. The theme provides no general
policy: which directives you need depends on what the site enabled.

Five things change the directives needed:

- Inline HTML and inline scripts written by authors, which are the author's responsibility under `renderer.unsafe: true`.
- [ECharts `$fn:` callbacks](/docs/components/echarts/#callbacks): the callback functions are registered by the site on `window.OinkEchartsFunctions`, and the registering script's origin belongs in `script-src`.
- [Analytics scripts](/docs/admin/analytics/#other-analytics): the script the site inserts, and the destination it reports to.
- [Remote API specifications](/docs/write/openapi/#spec-file) and [self-hosted diagram services](/docs/components/plantuml/#server): these land in `connect-src` and `img-src`.
- [giscus](/docs/admin/comments/#privacy): `script-src` and `frame-src` must both permit it.

Start from a minimal policy covering only reviewed features and permit things
one at a time: keep ECharts options pure data where no callback is needed,
review inline scripts written by authors, and add a remote origin only for an
integration the site deliberately enabled. Subresource origins in the output can
be swept first with the script in
[Verifying an offline build](/docs/admin/preview/#air-gapped).

## Acceptance checklist {#checklist}

Walk this table after deploying. The first four are build-time; the rest have to
be checked on the real URL.

| Check | How to confirm |
| --- | --- |
| A warning-free build | The build command carries `--printPathWarnings --panicOnWarning` and the log has `Total in …` |
| `baseURL` is correct | `<link rel="canonical">` in the page source points at the real production address, subpath included |
| Sitemap | `<baseURL>/sitemap.xml` resolves; a multilingual site has an index pointing at `/en/sitemap.xml` and `/zh/sitemap.xml` |
| robots | `<baseURL>/robots.txt` reads `Allow: /` with a `Sitemap:` line; a preview deployment should read `Disallow: /` |
| Search index | The browser can fetch `<baseURL>/offline-search-index.<language>.json`, and site search returns results |
| Markdown output | Appending `index.md` to any page URL returns plain text (where the site enabled `markdown` under `outputs.page`) |
| `llms.txt` | The primary and every enabled language root publish `llms.txt` where the site enabled `LLMS` under `outputs.home` |
| Enabled languages | Documentation, blog and home pages open in each, and switching language lands on the corresponding page rather than the home page |
| Appearance and interaction | The light/dark toggle, the print view and representative components (callouts, tabs, code block copy) all work |
| 404 | Visiting a path that does not exist shows the site's own 404 page |
{.fields}

The switches for `sitemap.xml`, `robots.txt`, `.md` and `llms.txt` are in
[Configuration](/docs/customize/config/), and the agent output details are in
[AI-agent support](/docs/customize/agents/).

## Rollback {#rollback}

Rolling back a static site means republishing the last known-good commit; never
edit files by hand in production.

- GitHub Pages: find the last successful `Deploy to GitHub Pages` run in Actions and click Re-run all jobs; or `git revert` the offending commit and push again.
- Cloudflare Pages / Netlify / Vercel: pick the last successful deployment from the list and use the platform's Rollback / Publish deploy to make it production again.
- A self-hosted static server: keep the previous `tar.gz` and unpack it over the top. The dated suffix in [offline packaging](#hosts) exists for exactly this.

Where the problem is a theme upgrade rather than the content, what rolls back is
the version pinned in `go.mod` — see
[Upgrade](/docs/admin/upgrade/#rollback).

## Related {#related}

- [Local preview](/docs/admin/preview/) — the full production build command, clearing caches and offline verification
- [Troubleshooting](/docs/admin/troubleshooting/) — 404s, empty search, platform-specific faults
- [Analytics and SEO](/docs/admin/analytics/) — being indexed correctly after launch
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme version and rolling back
- [Configuration](/docs/customize/config/) — `baseURL`, `outputs` and the other site keys
