---
title: Deploy
linkTitle: Deploy
description: Publish public/ to GitHub Pages, Cloudflare Pages or any static host, with the right baseURL, CI settings, security policy, checks and rollback.
weight: 20
search_keywords: [deploy, publish, GitHub Pages, Cloudflare Pages, Netlify, Vercel, Nginx, object storage, hugo deploy, baseURL, subpath, CSP, hosting]
aliases:
  - /docs/deploy/
  - /docs/deploy/github-pages/
  - /docs/deploy/cloudflare/
  - /docs/deploy/other/
---

An OINK site builds to a directory of static files, so any host that serves
files can serve it, with no Node runtime, server-side rendering or build
plugin. Deploying comes down to three things: run the
[production build](/docs/admin/preview/#production-build), publish `public/`,
and set `baseURL` to the address readers will use. A site created from the
OINK Starter already has GitHub Pages and Cloudflare Pages workflows that do
all three.

## Getting baseURL right {#baseurl}

A wrong `baseURL` is the most common deployment fault, and a quiet one: pages
open, but the search index returns 404, page-action links point elsewhere and
some assets fail to load.

At the root of a domain:

```yaml {title="hugo.yml"}
baseURL: https://docs.example.com
```

Under a subpath such as `https://example.com/docs/`, include the path:

```yaml {title="hugo.yml"}
baseURL: https://example.com/docs/
```

You can also override it at build time, which lets one source tree deploy to
several addresses:

```bash {title="Terminal"}
hugo --gc --minify --baseURL "https://example.com/docs/"
```

> [!WARNING] Do not fix a subpath with `canonifyURLs`
> Leave `canonifyURLs` at Hugo's default, `false`. OINK's templates and
> content links resolve against `baseURL`, so a wrong path means a wrong
> `baseURL`. Turning on `canonifyURLs` also rewrites relative links that were
> already correct, which makes the fault harder to find.

With local search enabled, open search on the deployed site and watch the
index request in the browser's Network panel: it must carry the right language
and subpath and return 200. Take the URL from the page's `data-td-index-src`
attribute instead of guessing it, because production filenames include a
content hash (`offline-search-index.<language>.<hash>.json`).

## Choosing a host {#hosts}

{{< tabs group="host" default="ghpages" label="Host" >}}
{{< tab label="GitHub Pages" value="ghpages" >}}

If the source lives on GitHub, one Actions workflow builds the site and
publishes it through the Pages deployment API, with no `gh-pages` branch to
maintain. The OINK Starter ships this file; copy it only when you assemble a
site yourself.

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
  GO_VERSION: 1.27.4
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
          go-version: ${{ env.GO_VERSION }}
          check-latest: true
          cache-dependency-path: go.sum

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Install Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest

      - name: Record build tool versions
        run: |
          go version
          hugo version

      - name: Download OINK
        run: go mod download github.com/pgsty/oink

      - name: Build
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings \
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

[Build settings for CI](#ci) explains each setting; keep them when you edit
the file. One is specific to GitHub Pages: `--baseURL` takes the address that
`configure-pages` computes, `https://<OWNER>.github.io/<REPO>/` for a project
site, so you never hard-code it.

In the repository, set Settings → Pages → Build and deployment → Source to
GitHub Actions, push to `main`, and watch the first run on the Actions tab.

For a custom domain, enter it under Custom domain on the same settings page,
configure DNS as prompted, and set `baseURL` in `hugo.yaml` to the new domain.
If your publishing process needs a `CNAME` file, put it at `static/CNAME`;
Hugo copies it unchanged into `public/`.

{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}

The OINK Starter ships `.github/workflows/cloudflare-pages.yaml`, a Direct
Upload workflow: the production build runs in GitHub Actions with the same
[build settings](#ci) as the GitHub Pages workflow, and Wrangler uploads the
resulting `public/` to a Cloudflare Pages project. It is the recommended path
for Starter sites.

1. Create a **Direct Upload** Pages project. Its name defaults to the
   repository name; to use another, set the repository variable
   `CLOUDFLARE_PROJECT_NAME`.
1. Add the repository secrets `CLOUDFLARE_ACCOUNT_ID` and
   `CLOUDFLARE_API_TOKEN`. The token needs **Account → Cloudflare Pages → Edit**.
1. Run **Deploy to Cloudflare Pages** once by hand. To deploy every push to
   `main`, set the repository variable `CLOUDFLARE_PAGES_ENABLED=true`.
1. The canonical URL defaults to `https://<project>.pages.dev/`. When a custom
   domain becomes production, set `CLOUDFLARE_SITE_URL` to it.
{.steps}

Cloudflare's Git integration also works, with Cloudflare running the build:
set the build command to `hugo --gc --minify --printPathWarnings`, the output
directory to `public`, Hugo to {{< param hugoMinVersion >}} or newer and Go to
`1.27.4` or newer. Choose one mode per project, Git integration **or** the
Direct Upload workflow, and build preview deployments with their own URL and a
[non-production environment](#preview-builds).

{{< /tab >}}
{{< tab label="Others" value="other" >}}

**Netlify** — set the build command to `hugo --gc --minify`, the publish
directory to `public`, and the `HUGO_VERSION` environment variable. The same
settings can live in the repository:

```toml {title="netlify.toml"}
[build]
command = "hugo --gc --minify --printPathWarnings"
publish = "public"

[build.environment]
# the platform needs an explicit release; 0.169.0 is the theme's minimum
HUGO_VERSION = "0.169.0"
```

A theme installed as a submodule needs recursive submodule checkout enabled;
one installed as a Hugo Module needs Git and Go in the build image. Build
previews with the same Hugo release as production, unless the preview exists
to test an upgrade.

**Vercel** — set the build command to `hugo --gc --minify`, the output
directory to `public`, and the `HUGO_VERSION` environment variable. There is
no npm install step.

**Any static server (Nginx, Caddy)** — serve an unchanged copy of `public/`.
The example serves `/var/www/oink/current`, a symlink to a release directory
that the offline packaging steps below create:

```nginx {title="/etc/nginx/conf.d/docs.conf"}
server {
    listen 80;
    server_name docs.example.com;
    root /var/www/oink/current;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
}
```

The site is purely static, so there is nothing to proxy to an application
server.

**Object storage** — Hugo's `deploy` command uploads to S3, Google Cloud
Storage or Azure. Name the target in the configuration:

```yaml {title="hugo.yml"}
deployment:
  targets:
    - name: aws
      URL: 's3://www.your-domain.tld'
      cloudFrontDistributionID: E9RZ8T1EXAMPLEID
```

After a build, `hugo deploy` compares the bucket with `public/`, uploads only
what changed, and invalidates the CDN cache when `cloudFrontDistributionID` is
set. Without `--target` it uses the first target; run it with `--dryRun` first
to see what it would change. The Hugo binary must be built `withdeploy` (check
`hugo version`), and the cloud credentials come from the provider's standard
environment variables or configuration file; on AWS, confirm access with
`aws s3 ls` first.

**Offline packaging** — for a network-isolated server, build on a connected
machine with the target's `baseURL` and carry the output over as one archive.
Give every archive a new release name:

```bash {title="Terminal"}
hugo --cleanDestinationDir --gc --minify --baseURL "https://docs.internal.example.com/" &&
  tar -czf oink-site-20260929-01.tar.gz -C public .
```

On the Linux host you need write access to `/var/www/oink` and GNU `mv`;
`current` must be absent or a symlink, and `current.next` must not exist.
Unpack each release into a new directory and switch `current` to it:

```bash {title="Linux host"}
release_dir=/var/www/oink/releases/20260929-01
mkdir -p /var/www/oink/releases
mkdir "$release_dir" &&
  tar -xzf oink-site-20260929-01.tar.gz -C "$release_dir" &&
  test -f "$release_dir/index.html" &&
  ln -s "$release_dir" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

The chain switches `current` only after the directory was created, the
archive extracted and `index.html` found, and the final `mv` replaces the link
in one step, so readers never see a half-written site. Never unpack over an
existing release directory, and keep the previous one: it is your
[rollback](#rollback). A different `baseURL` means a new build, not an edit
of the output.

**A host without Go** — a theme installed as a Hugo Module needs Go in the
build environment. Where the platform has none, install the theme as a Git
submodule (run `git submodule update --init` before the build) or commit an
offline archive under `themes/oink/`; see
[From scratch and other install methods](/docs/start/from-scratch/).

{{< /tab >}}
{{< /tabs >}}

## Build settings for CI {#ci}

These settings belong in any CI build of an OINK site, whichever host
receives the output. The Starter's workflows already contain them.

- `fetch-depth: 0` on checkout — with `enableGitInfo`, last-modified dates and contributor lists come from Git history, and a shallow clone gives every page the same date.
- Go, then `go mod download github.com/pgsty/oink` — Hugo needs Go to fetch a theme installed as a Hugo Module. A submodule install checks out with `submodules: recursive` instead, and an offline archive is committed under `themes/oink/`; either way, drop both Go steps.
- `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` — keep a developer's Go workspace out of the build, so CI builds the release pinned in `go.mod` and nothing else.
- Hugo `latest` — the theme builds with any Hugo edition from {{< param hugoMinVersion >}}, so CI can follow current releases. A site still pinned to OINK 1.5.1 or older cannot; see [Upgrade](/docs/admin/upgrade/#hugo-extended).
- `--environment production` and the real `--baseURL` — the environment decides indexing and analytics (see [below](#preview-builds)), and `baseURL` every absolute link.
- `--printPathWarnings`, and no `--panicOnWarning` — OINK's warnings are deliberate: a mistyped key or an incomplete integration warns and falls back to a safe default so the site still builds. Turning warnings into errors with `--panicOnWarning` or `HUGO_PANICONWARNING` would fail builds that are fine. Read the warnings in the build log instead.

## Keeping preview deployments unindexed {#preview-builds}

Hugo's `-e` / `--environment` changes how OINK builds, not what the site
contains. Only a `production` build:

- emits `<meta name="robots" content="index, follow">` (other environments emit `noindex, nofollow`);
- writes `Allow: /` and a `Sitemap:` line to `robots.txt` (other environments write `Disallow: /`);
- renders the Google Analytics snippet;
- fingerprints the theme's scripts and stylesheets and adds SRI `integrity` attributes.

`hugo` defaults to `production`, even on a preview host, so build pull-request
previews and staging sites with another environment:

```bash {title="Terminal"}
hugo --gc --minify --environment staging --baseURL "$PREVIEW_URL"
```

The output then asks search engines to stay away and sends nothing to an
analytics service.

## Content Security Policy {#csp}

The theme's scripts, fonts and icons are all served from your own origin, but
`script-src 'self'; style-src 'self'` alone still blocks parts of an ordinary
OINK page. The theme writes small inline scripts that set the color mode and
the page shell's state before the first paint, inline styles for the
initial canvas, theme colors and font roles, and `style` attributes on some
components; Markmap adds inline configuration and styles. OINK ships no
ready-made policy, CSP hashes or nonce injection, so derive the policy from
your own built output.

Features you enable add their own requirements:

- Inline HTML and scripts that authors write under `renderer.unsafe: true` are the site's to review.
- [ECharts `$fn:` callbacks](/docs/components/echarts/#callbacks): the site registers its functions on `window.OinkEchartsFunctions`, so the registering script's origin belongs in `script-src`.
- [Analytics scripts](/docs/admin/analytics/#other-analytics): the script you insert, and the host it reports to.
- [Local PlantUML rendering](/docs/components/plantuml/#limits): same-origin scripts, `wasm-unsafe-eval` in `script-src` to compile WebAssembly, and `blob:` in `img-src`. No rendering-service origin is needed.
- [Remote API specifications](/docs/write/openapi/#spec-file) and [self-hosted diagram services](/docs/components/plantuml/#server): their origins in `connect-src` and `img-src`.
- [giscus](/docs/admin/comments/#privacy): both `script-src` and `frame-src`.
- [Duo view](/docs/customize/i18n/#bilingual-view) and ReDoc API references render in same-origin frames, so `frame-src` (or `child-src`) must allow `'self'`, and responses must allow same-origin framing (no `X-Frame-Options: DENY` or `frame-ancestors 'none'`). Duo view also adds an inline bootstrap script to every HTML page, which changes the script hashes.

Hash each inline script and style block you allow from the final deployed
bytes, or have the host inject a fresh nonce into both the policy header and
the matching tags on every response. A `<style>` nonce does not cover
`style="…"` attributes, which need `style-src-attr` of their own. Hashes
change with content, configuration, minification and theme upgrades, so
recompute them after each.

Start from a minimal policy that covers only the features you have reviewed,
and add permissions one at a time: keep ECharts options as pure data when no
callback is needed, review author-written inline scripts, and add a remote
origin only for an integration the site explicitly enabled. The output
checker in [Verifying an offline build](/docs/admin/preview/#air-gapped) lists
every subresource origin, which is a good starting inventory. Ship the policy
as `Content-Security-Policy-Report-Only` first, and enforce it only after
light/dark startup, shell state, menus and every enabled component work in
the browser.

## Acceptance checklist {#checklist}

Go through this table after each deployment. The first four rows can be
checked in the build output; the rest need the real URL.

| Check | How to confirm |
| --- | --- |
| The build succeeded and you read its warnings | The log of a build with `--printPathWarnings` ends with `Total in …` |
| `baseURL` is correct | `<link rel="canonical">` in the page source points at the real production address, subpath included |
| Sitemap | `<baseURL>/sitemap.xml` resolves; on a multilingual site it is an index pointing at `/en/sitemap.xml`, `/zh/sitemap.xml` and so on |
| robots | `<baseURL>/robots.txt` reads `Allow: /` with a `Sitemap:` line; a preview deployment reads `Disallow: /` |
| Search index | With local search enabled, the URL in `data-td-index-src` returns 200, its filename carries a hash, and site search returns results |
| Markdown output | Where the site enables `markdown` under `outputs.page`, appending `index.md` to a page URL returns plain text |
| `llms.txt` | Where the site enables `LLMS` under `outputs.home`, the root of every enabled language serves `llms.txt` |
| Every language | Documentation, blog and home pages open in each, and the language switcher lands on the matching page rather than the home page |
| Appearance and interaction | The light/dark toggle, the print view and common components (callouts, tabs, code-block copy) work |
| 404 | A path that does not exist shows the site's own 404 page |
{.fields}

The switches for `sitemap.xml`, `robots.txt`, `.md` and `llms.txt` are in
[Configuration](/docs/customize/config/), and the agent-facing outputs are
described in [AI-agent support](/docs/customize/agents/).

## Rollback {#rollback}

Roll back a static site by publishing the last known-good build again. Never
patch files on the production host, because the next deploy silently undoes
the patch and nothing records what changed.

- GitHub Pages: find the last successful `Deploy to GitHub Pages` run under Actions and choose Re-run all jobs, or `git revert` the faulty commit and push.
- Cloudflare Pages, Netlify, Vercel: pick the last good deployment in the platform's list and promote it with Rollback or Publish deploy.
- Your own static server: point `current` back at the previous release directory kept by [offline packaging](#hosts). Do not extract the old archive over the new files; paths that only the newer release added would stay live.

On the Linux host, with the same symlink and GNU `mv` prerequisites as above,
replace the example with the release you kept:

```bash {title="Terminal"}
previous_release=/var/www/oink/releases/20260928-01
test -d "$previous_release" &&
  ln -s "$previous_release" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

Then open an old page at the public URL, and confirm that a path only the
rejected release added is gone.

If a theme upgrade caused the problem, roll back the version pin in `go.mod`
instead; see [Upgrade](/docs/admin/upgrade/#rollback).

## Related {#related}

- [Local preview](/docs/admin/preview/) — the production build, clearing caches and offline verification
- [Troubleshooting](/docs/admin/troubleshooting/) — 404s, empty search and platform-specific faults
- [Analytics and SEO](/docs/admin/analytics/) — being indexed correctly after launch
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme and rolling it back
- [Configuration](/docs/customize/config/) — `baseURL`, `outputs` and the other site keys
