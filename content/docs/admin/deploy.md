---
title: Deploy
linkTitle: Deploy
description: Publish public/ to GitHub Pages, Cloudflare Pages, or another static host. Set baseURL, review Content Security Policy, verify deployment, and prepare rollback.
weight: 20
search_keywords: [deploy, publish, GitHub Pages, Cloudflare Pages, Netlify, Vercel, Nginx, object storage, hugo deploy, baseURL, subpath, CSP, hosting]
aliases:
  - /docs/deploy/
  - /docs/deploy/github-pages/
  - /docs/deploy/cloudflare/
  - /docs/deploy/other/
---

An OINK site produces a plain static directory. You can deploy it to any host
that serves static files. It requires no Node runtime, server-side rendering,
or build plugin. On the host, run one command with the correct Hugo version.
Publish `public/` and set `baseURL` to match the final address.

First complete a local [production build](/docs/admin/preview/#production-build)
and review its diagnostics, including the accepted upstream LibSass warning.

> [!NOTE] OINK 1.4.0 build requirements
> Maintained sites use Hugo Extended 0.168.0 and its built-in LibSass.
> No external Sass installation is required. Keep the upstream LibSass warning
> visible and review it; do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`.

## Getting baseURL right {#baseurl}
An incorrect `baseURL` is the most common source of failure. The page can open
without an obvious error. However, the search index 404s, page action
links use incorrect addresses, and some assets do not load.

For deployment at a domain root, use:

```yaml {title="hugo.yml"}
baseURL: https://oink.pgsty.com
```

For deployment to a subpath (`https://example.com/docs/`), include that path in
`baseURL`:

```yaml {title="hugo.yml"}
baseURL: https://example.com/docs/
```

You can also override this value at build time. This lets you deploy one source to
several locations:

```bash {title="Terminal"}
hugo --gc --minify --baseURL "https://example.com/docs/"
```

> [!WARNING] Do not fix a subpath with `canonifyURLs`
> Keep Hugo's default value `false` for `canonifyURLs`. OINK's templates and content links
> resolve against `baseURL`. If the path is incorrect, correct `baseURL`.
> Enabling `canonifyURLs` rewrites relative links that were already correct.
> This makes the problem harder to diagnose.

If local search is enabled, open search. Inspect its index request in the
browser's Network panel. The request must use the correct language and
deployment subpath, and return 200. Read the actual URL from the page's
`data-td-index-src` attribute. Production filenames are
`offline-search-index.<language>.<hash>.json`. Development filenames have no
hash. Do not guess the filename.

## Choosing a host {#hosts}

{{< tabs group="host" default="ghpages" label="Host" >}}
{{< tab label="GitHub Pages" value="ghpages" >}}

If the source is on GitHub, one Actions workflow is sufficient. Actions builds
the site and publishes the output through the Pages deployment API. You do not
need a `gh-pages` branch. OINK Starter includes the file below. Copy it only if
you assemble a site manually.

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
  GO_VERSION: stable
  HUGO_VERSION: "0.168.0"
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

      - name: Install Hugo Extended
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: ${{ env.HUGO_VERSION }}
          extended: true

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

OINK Starter ships this workflow. The following settings are required:

- `fetch-depth: 0` — if `enableGitInfo` is enabled, "last modified" and contributor information require the complete Git history. A shallow clone leaves them empty.
- `setup-go` plus `go mod download` — Hugo needs Go to resolve the theme as a Hugo Module. For a submodule installation, use `submodules: recursive` instead. For an offline archive, commit `themes/oink/`. With either alternative, remove both Go steps.
- `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` — exclude a local development `go.work` from the CI build. CI then verifies the published tag pinned in `go.mod`.
- `--baseURL "${{ steps.pages.outputs.base_url }}/"` — a project site's URL is `https://<OWNER>.github.io/<REPO>/`. Use the value computed by `configure-pages` instead of a hard-coded address.
Warnings remain visible for review. Do not enable `--panicOnWarning` or
`HUGO_PANICONWARNING`; the upstream LibSass deprecation warning is accepted.

In the repository, set Settings → Pages → Build and deployment → Source to
GitHub Actions. Push to `main`. Check the first run on the Actions tab.

For a custom domain, enter it in the Custom domain field on the same settings
page. Configure DNS as prompted. Then set `baseURL` in `hugo.yaml` to that
domain. If the publishing process requires a `CNAME` file, put it at
`static/CNAME`. Hugo copies it unchanged into `public/`.

{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}

OINK Starter ships `.github/workflows/cloudflare-pages.yaml`, a Direct Upload
workflow. The production build stays in GitHub Actions and Wrangler uploads the
same `public/` artifact to a Cloudflare Pages project.

1. Create a **Direct Upload** Pages project. Its name defaults to the repository
   name. To override it, set repository variable `CLOUDFLARE_PROJECT_NAME`.
1. Add repository secrets `CLOUDFLARE_ACCOUNT_ID` and
   `CLOUDFLARE_API_TOKEN`. The token needs **Account → Cloudflare Pages → Edit**.
1. Run **Deploy to Cloudflare Pages** manually once. To deploy every push to
   `main`, set repository variable `CLOUDFLARE_PAGES_ENABLED=true`.
1. The canonical URL defaults to `https://<project>.pages.dev/`. Set
   `CLOUDFLARE_SITE_URL` when a custom domain becomes production.
{.steps}

The workflow pins Hugo Extended 0.168.0, reads Go from `go.mod`, disables local
module workspaces, and builds with Hugo Extended 0.168.0 and visible warnings
before upload. It is the
recommended reproducible path for Starter users.

You can also use Cloudflare Git integration as a separate mode. Set the build
command to `hugo --gc --minify --printPathWarnings`, the output
directory to `public`, Hugo to `0.168.0`, and Go to `1.27`. For one project,
use either Git integration **or** the Direct Upload workflow. Do not use both.
A preview deployment does not verify production. Rebuild the preview with its
own URL and keep it unindexed.

{{< /tab >}}
{{< tab label="Others" value="other" >}}

**Netlify** — build command `hugo --gc --minify`, publish directory `public`,
environment variable `HUGO_VERSION`. The same settings can live in the
repository:

```toml {title="netlify.toml"}
[build]
command = "hugo --gc --minify --printPathWarnings "
publish = "public"

[build.environment]
HUGO_VERSION = "0.168.0"
```

If the theme is a submodule, enable recursive submodule checkout. For a Hugo
Module, install Git and Go in the build environment. Use the same Hugo version
for production and preview, unless the preview tests an upgrade.

**Vercel** — set the build command to `hugo --gc --minify`, the output directory
to `public`, and environment variable `HUGO_VERSION`. No npm install is required.

**Any static server (Nginx / Caddy)** — serve an unchanged copy of `public/`.
The example below uses a `current` symlink to a release directory; create it
with the offline packaging steps below. Set the host's document root to that
link when configuring Nginx or Caddy:

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

After a build, run `hugo deploy`. It compares the remote output with `public/`
and uploads only changed files. If you supply `cloudFrontDistributionID`, it
also invalidates the CDN cache. Without `--target`, it uses the first target.
Use `--dryRun` first to inspect the proposed changes.

Two prerequisites apply. The Hugo binary must be built `withdeploy`, as shown
by `hugo version`. Supply cloud credentials through the standard environment
variables or configuration file. On AWS, first confirm access with `aws s3 ls`.

**Offline packaging** — for a network-isolated environment, build on a connected
machine. Transfer the output as one package. Choose your archive path and use a
new release name for every artifact. On the Linux host, you need write access
to `/var/www/oink` and GNU `mv`. The path `current` must be absent or a symlink.
The path `current.next` must not already exist. Configure Nginx or Caddy to
serve `current`, as shown above. Configure this on the host, not in Hugo.

```bash {title="Terminal"}
hugo --cleanDestinationDir --gc --minify --baseURL "https://docs.internal.example.com/" &&
  tar -czf oink-site-20260929-01.tar.gz -C public .

```

After the build and packaging succeed, transfer the archive to the Linux host.
Run the following commands there. Use a new release name for every artifact:

```bash {title="Linux host"}
release_dir=/var/www/oink/releases/20260929-01
mkdir -p /var/www/oink/releases
mkdir "$release_dir" &&
  tar -xzf oink-site-20260929-01.tar.gz -C "$release_dir" &&
  test -f "$release_dir/index.html" &&
  ln -s "$release_dir" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

The command chain switches `current` only after it creates a new directory,
extracts the archive successfully, and confirms that `index.html` exists.
Then check the deployed pages. Retain the previous release directory for
rollback. Never unpack a release over an existing release directory.

Use the target environment's `baseURL` for the initial build. If you change it,
build again.

**A host without Go** — the Hugo Module method requires Go in the build
environment. If the platform does not provide Go, use a Git submodule or an
offline archive. For a submodule, run `git submodule update --init` before the
build. For an archive, commit `themes/oink/`. See
[From scratch and other install methods](/docs/start/from-scratch/).

{{< /tab >}}
{{< /tabs >}}

## Keeping preview deployments unindexed {#preview-builds}

Hugo's `-e` / `--environment` selects build-time behavior. It does not change
site content. Three OINK outputs depend on this setting. Only `production`
emits `<meta name="robots" content="index, follow">`, writes `Allow: /` in
`robots.txt`, and renders the Google Analytics template. Do not build PR
previews or staging with `--environment production`:

```bash {title="Terminal"}
hugo --gc --minify --environment staging --baseURL "$PREVIEW_URL"
```

The output then carries `noindex, nofollow` and `Disallow: /`, and reports
nothing to an analytics service.

## Content Security Policy {#csp}

The bundled runtimes, fonts, and icons are same-origin assets. However,
`script-src 'self'; style-src 'self'` alone does not cover a normal OINK page.
The theme emits inline theme initialization and shell prepaint scripts. It
also emits inline styles for the initial canvas, theme colors, and font roles.
Some components have style attributes. Markmap adds inline configuration and styles.

The theme provides no general policy, automatic CSP hashes, or nonce injection.
The deployment must define its policy from the actual built output.

Additional features change the directives needed:

- Inline HTML and inline scripts written by authors, which are the author's responsibility under `renderer.unsafe: true`.
- [ECharts `$fn:` callbacks](/docs/components/echarts/#callbacks): the site registers callback functions on `window.OinkEchartsFunctions`. Include the registering script's origin in `script-src`.
- [Analytics scripts](/docs/admin/analytics/#other-analytics): the script the site inserts, and the destination it reports to.
- [Local PlantUML rendering](/docs/components/plantuml/#limits) in OINK 1.4.0 needs same-origin scripts, `wasm-unsafe-eval` in `script-src` for WebAssembly compilation, and `blob:` in `img-src`. It needs no rendering-service origin.
- [Remote API specifications](/docs/write/openapi/#spec-file) and [self-hosted diagram services](/docs/components/plantuml/#server): these require permissions in `connect-src` and `img-src`.
- [giscus](/docs/admin/comments/#privacy): `script-src` and `frame-src` must both permit it.

Hash each permitted inline script/style block from the final deployed bytes.
Alternatively, have the host inject a fresh nonce into the response policy
and corresponding tags. A nonce on a style tag does not authorize style
attributes. Review those separately under `style-src-attr`. Recheck hashes
after changes to content, configuration, minification, or the theme. Start with
`Content-Security-Policy-Report-Only`. Before enforcement, test light/dark
startup, shell state, menus, and every enabled component. An origin scan alone
cannot establish CSP compatibility.

Start with a minimal policy that covers only reviewed features. Add permissions
one at a time. If ECharts needs no callback, keep its options as pure data.
Review inline scripts written by authors. Add a remote origin only for an
integration that the site explicitly enabled. First, you can scan output
subresource origins with the script in
[Verifying an offline build](/docs/admin/preview/#air-gapped).

## Acceptance checklist {#checklist}

After deployment, complete this table. The first four checks concern build-time
output. Check the remaining items at the real URL.

| Check | How to confirm |
| --- | --- |
| A successful build with reviewed diagnostics | The build command carries `--printPathWarnings` and the log has `Total in …`; the upstream LibSass warning is accepted |
| `baseURL` is correct | `<link rel="canonical">` in the page source points at the real production address, subpath included |
| Sitemap | `<baseURL>/sitemap.xml` resolves; a multilingual site has an index pointing at `/en/sitemap.xml` and `/zh/sitemap.xml` |
| robots | `<baseURL>/robots.txt` reads `Allow: /` with a `Sitemap:` line; a preview deployment should read `Disallow: /` |
| Search index | With local search enabled, the URL from `data-td-index-src` returns 200; production filenames contain a hash, and site search returns results |
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

To roll back a static site, republish the last known-good commit. Never edit
production files by hand.

- GitHub Pages: find the last successful `Deploy to GitHub Pages` run in Actions. Click Re-run all jobs. Alternatively, use `git revert` on the faulty commit and push again.
- Cloudflare Pages / Netlify / Vercel: pick the last successful deployment from the list and use the platform's Rollback / Publish deploy to make it production again.
- A self-hosted static server: point `current` to the previous release directory from [offline packaging](#hosts). Do not extract the old archive over the new files. Paths added by the newer release would remain live.

On the Linux host, replace the example path with the retained known-good release.
The same symlink and GNU `mv` prerequisites apply:

```bash {title="Terminal"}
previous_release=/var/www/oink/releases/20260928-01
test -d "$previous_release" &&
  ln -s "$previous_release" /var/www/oink/current.next &&
  mv -Tf /var/www/oink/current.next /var/www/oink/current
```

Check a representative old page at the public URL and confirm that a path added
only by the rejected release is no longer served.

If a theme upgrade caused the problem, roll back the version pin in `go.mod`.
See [Upgrade](/docs/admin/upgrade/#rollback).

## Related {#related}

- [Local preview](/docs/admin/preview/) — the full production build command, clearing caches and offline verification
- [Troubleshooting](/docs/admin/troubleshooting/) — 404s, empty search, platform-specific faults
- [Analytics and SEO](/docs/admin/analytics/) — being indexed correctly after launch
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme version and rolling back
- [Configuration](/docs/customize/config/) — `baseURL`, `outputs` and the other site keys
