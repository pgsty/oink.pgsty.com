---
title: Local preview
linkTitle: Local preview
description: Watch your changes render as you save with hugo server, then build the public/ directory you deploy.
weight: 10
search_keywords: [local preview, hugo server, development server, drafts, production build, container, Docker, cache, offline, air-gapped]
aliases:
  - /docs/tutorial/container/
  - /docs/deploy/local/
---

Two commands cover daily work. `hugo server` rebuilds the site every time you
save and reloads the browser for you; `hugo` writes the finished site to
`public/`, the directory you deploy:

```bash {title="Terminal"}
hugo server                                                   # preview at http://localhost:1313/
hugo --cleanDestinationDir --gc --minify --printPathWarnings  # build public/ for deployment
```

Neither needs Node.js, npm or a CDN. The tools they do need, Git, Go and Hugo,
are listed in [Get started](/docs/start/#tools).

## The preview server {#hugo-server}

Run `hugo server` from the site root, the directory that holds `hugo.yml`, and
open <http://localhost:1313/>. Each save, and each switch of Git branch,
triggers a rebuild and a browser refresh. The first start is slower because
Hugo downloads the theme module into its cache; later starts read the cache.

## The switches worth knowing {#server-flags}

| Switch | Default | What it does |
| --- | --- | --- |
| `-D` / `--buildDrafts` | off | Also builds pages with `draft: true` |
| `-F` / `--buildFuture` | off | Also builds pages whose `date` / `publishDate` is in the future |
| `-E` / `--buildExpired` | off | Also builds pages whose `expiryDate` has passed |
| `--disableFastRender` | off | Re-renders the whole site on every change instead of only the pages Hugo thinks changed |
| `-M` / `--renderToMemory` | off (writes to disk) | Serves from memory and writes nothing to `public/` |
| `-N` / `--navigateToChanged` | off | Sends the browser to the page you just saved |
| `--bind` | `127.0.0.1` | The listen address; use `0.0.0.0` to reach the server from your LAN or from outside a container |
| `-p` / `--port` | `1313` | The listen port |
| `--minify` | off | Minifies the preview as well, to reproduce production rendering |
| `--printPathWarnings` | off | Warns when two pages write to the same output path |
{.fields meta="default"}

A good combination while writing:

```bash {title="Terminal"}
hugo server -DFE \
  --disableFastRender --renderToMemory --minify \
  --printPathWarnings --logLevel info
```

`-DFE` is short for `-D -F -E`, so drafts, future-dated and expired pages all
appear while you work on them. `--renderToMemory` keeps those pages out of
`public/`, so a later deploy cannot pick them up by accident.

### A change that did not take effect {#fast-render}

By default Hugo re-renders only what it judges affected by a change, and edits
to layouts, configuration, `data/` or an `include`d file sometimes slip past
that judgment. When a page looks unchanged:

1. Restart with `--disableFastRender`.
1. Force a browser reload (`Cmd`/`Ctrl` + `Shift` + `R`) to rule out the browser cache.
1. If the page is still stale, [clear the caches](#clean-caches) and restart.
{.steps}

### Reaching it from another device {#bind}

The server listens on `127.0.0.1` only, so a phone or another computer cannot
reach it. Bind to every interface and give the address the other device will
use:

```bash {title="Terminal"}
hugo server --bind 0.0.0.0 --port 1313 --baseURL http://192.168.1.10:1313/
```

Without `--baseURL`, the page opens but its absolute links, the stylesheet and
the search index among them, still point at `localhost`.

## Production build {#production-build}

Build what you deploy with `hugo`, never with `hugo server`:

```bash {title="Terminal"}
hugo --cleanDestinationDir --gc --minify --printPathWarnings
```

The output in `public/` is self-contained, so you can copy it anywhere
without the source tree. Each switch earns its place:

| Switch | Why |
| --- | --- |
| `--cleanDestinationDir` | Deletes files the current build did not write, so a page you removed does not stay live |
| `--gc` | Removes processed resources in `resources/_gen` that nothing references any more |
| `--minify` | Minifies the HTML, CSS, JS and XML output |
| `--printPathWarnings` | Warns when two pages claim the same output path, the most common silent error on a multilingual site |
{.fields}

A successful build ends with a `Total in …` line. Read any warnings before you
deploy: each one names a setting the theme ignored, and the build kept going
with a safe default.

Two settings matter as soon as the output leaves your machine. `baseURL`
decides every absolute link, including a subpath such as `/docs/`; see
[Getting baseURL right](/docs/admin/deploy/#baseurl). The build environment,
`production` for `hugo` and `development` for `hugo server`, decides whether
pages ask to be indexed and whether analytics load; see
[Keeping preview deployments unindexed](/docs/admin/deploy/#preview-builds).

## Previewing in a container {#container}

A container is optional. It helps when a team wants everyone on the same
toolchain, or does not want Hugo installed on every machine.

```dockerfile {title="Dockerfile" collapse=16}
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.169.0
ARG GO_VERSION=1.27.4
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl --fail --location -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && curl --fail --location -o /tmp/go.tgz \
      "https://go.dev/dl/go${GO_VERSION}.linux-${TARGETARCH}.tar.gz" \
    && tar -C /usr/local -xzf /tmp/go.tgz \
    && rm -rf /var/lib/apt/lists/* /tmp/hugo.deb /tmp/go.tgz

ENV PATH="/usr/local/go/bin:${PATH}"
WORKDIR /src
EXPOSE 1313
ENTRYPOINT ["hugo"]
CMD ["server", "--bind", "0.0.0.0", "--disableFastRender"]
```

```bash {title="Terminal"}
docker build -t oink-hugo .

# preview: mount the site source, and the Go module cache with it
docker run --rm -it -p 1313:1313 \
  -v "$PWD:/src" \
  -v "$HOME/go/pkg/mod:/root/go/pkg/mod" \
  oink-hugo

# production build: override the default server command
docker run --rm --user "$(id -u):$(id -g)" \
  -v "$PWD:/src" \
  oink-hugo --gc --minify
```

Set `HUGO_VERSION` to the release your team builds with,
{{< param hugoMinVersion >}} or newer. A site still pinned to OINK 1.5.1 or
older needs a different package; see [Upgrade](/docs/admin/upgrade/#hugo-extended).

Go is in the image because Hugo needs it to download a theme installed as a
Hugo Module. A site that uses a submodule, an offline archive or a plain clone
can drop Go and get a much smaller image. Nothing in the image needs Node.js,
npm or PostCSS, and the build fetches no browser assets, so for a
network-isolated environment you only have to mirror the base image and the
Hugo and Go packages.

> [!WARNING] Do not let root write `public/`
> A container runs as root unless told otherwise, and a `public/` written by
> root cannot be deleted from the host without `sudo`. Map your user ID with
> `--user "$(id -u):$(id -g)"`, as the production build command above does.

## Clearing caches {#clean-caches}

Hugo keeps intermediate output in three places. Clear the smallest one that
explains the symptom:

| Directory / command | Holds | Clear it when |
| --- | --- | --- |
| `public/` | The previous build's output | A deleted page is still live. `hugo --cleanDestinationDir` does this as part of the build |
| `resources/_gen/` | Processed images | You changed image processing, fonts or the accent color and the page still looks old |
| `hugo mod clean` | The Hugo Module cache | You changed the theme version and the old one still resolves. Add `--all` to clear the whole module cache |
{.fields}

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo mod clean          # only the modules this project uses
hugo mod clean --all    # the whole module cache; the next build downloads again
```

List both `public/` and `resources/` in `.gitignore`. They are regenerated on
every build, and committed copies go stale and bloat the repository.

## Previewing against a theme checkout {#theme-workspace}

When you change the theme and the site together, point the preview at your
local theme checkout for one command with `HUGO_MODULE_REPLACEMENTS`. `go.mod`
stays untouched, so the substitution cannot be committed by accident:

```bash {title="Terminal"}
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> /absolute/path/to/oink' hugo server
```

[From scratch](/docs/start/from-scratch/#local-theme-checkout) shows the
directory layout and the Go workspace alternative.

> [!WARNING] A replacement hides the version you pinned
> While the variable is set or a Go workspace is active, every build uses the
> local checkout, whatever `go.mod` says, and a CI job can inherit either. To
> build the published release, unset `HUGO_MODULE_REPLACEMENTS`, set
> `GOWORK=off` and `HUGO_MODULE_WORKSPACE=off`, look for permanent `replace`
> directives in `go.mod` and the Hugo configuration and for a `_vendor/` copy,
> then confirm the exact version with `hugo mod graph` in that same
> environment. Never commit a workspace file that names a path on your
> machine.

## Verifying an offline build {#air-gapped}

If the site must work in a network-isolated environment, test both the build
and the browser with the network cut off:

1. Start from a verified theme archive and an empty module cache (`hugo mod clean --all`).
1. Block outbound HTTP, HTTPS and the Go module proxy.
1. Run the production build `hugo --gc --minify --printPathWarnings`.
1. Browse pages in every language: a documentation page, a blog page, the home page, the 404.
1. Use search, the light/dark toggle, diagrams and the content components the site relies on.
1. Check every subresource origin and confirm that no unexpected remote host appears.
{.steps}

For the last step, run the output checker from a theme checkout of the same
release your site pins. It needs only Python 3. Replace both paths and use the
base URL you built with:

```bash {title="Terminal"}
python3 /path/to/oink/bin/check-output-security.py \
  --public /path/to/my-site/public --base-url https://docs.internal.example.com/
```

The script reads every `href`, `src`, `srcset`, `poster` and form `action` in
the HTML, print, Markdown and RSS output. Each must be a site-relative path or
use `http`, `https`, `mailto` or `tel`, and inline `on*` handlers and
`javascript:` URLs are rejected. An `<iframe>`, `<script>`, `<link>`, `<img>`,
`<video>`, `<audio>`, `<embed>`, `<object>` or `<source>` that points to
another host is an error. If the site embeds third-party content on purpose,
pass `--third-party`; if its languages live on several domains, list the extra
first-party hosts with `--allow-host`.

A pass covers that build only. Run the check again after every theme upgrade.

## Verify {#verify}

Start from empty caches so nothing stale hides a problem:

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings
```

The build passes when it ends with `Total in …` and reports no ERROR. Then
check:

- The log shows no npm, PostCSS, Autoprefixer or asset-download step. One that appears comes from leftover Docsy configuration.
- `public/` contains `sitemap.xml` and `robots.txt`, and `robots.txt` reads `Allow: /`.
- With local search enabled, `public/` holds an index per language, named `offline-search-index.<language>.<hash>.json` in production (development builds omit the hash). Open search and confirm that the URL in the page's `data-td-index-src` attribute returns 200.
- In `hugo server`, a documentation page, a blog page, the home page and the 404 render correctly in every language and in both color schemes.

After deployment, repeat the checks on the live site with the
[deployment checklist](/docs/admin/deploy/#checklist). For a build that fails
or looks wrong, see [Troubleshooting](/docs/admin/troubleshooting/).

## Related {#related}

- [Deploy](/docs/admin/deploy/) — getting `public/` to GitHub Pages, Cloudflare or elsewhere
- [Troubleshooting](/docs/admin/troubleshooting/) — build, language, search and platform faults
- [From scratch and other install methods](/docs/start/from-scratch/) — Hugo Module, submodule or offline archive
- [Configuration](/docs/customize/config/) — every key in `hugo.yml`
