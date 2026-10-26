---
title: Local preview
linkTitle: Local preview
description: Preview changes with hugo server and build deployable output with hugo. Neither Node nor a CDN is required.
weight: 10
search_keywords: [local preview, hugo server, development server, drafts, production build, container, Docker, cache, offline, air-gapped]
aliases:
  - /docs/tutorial/container/
  - /docs/deploy/local/
---

Use `hugo server` to preview local changes. Use `hugo` to produce a `public/`
directory that you can deploy to any static host. Install Hugo Extended
({{< param hugoMinVersion >}} or newer) on the machine. If you install the theme
as a Hugo Module, also install Go. The build does not require Node.js, npm, or
PostCSS. Only this repository's regression checks use those tools.

## The preview server {#hugo-server}

From the site root (the directory holding `hugo.yml`):

```bash {title="Terminal"}
hugo server
```

Open <http://localhost:1313/>. When you save a file, Hugo rebuilds the site and
refreshes the browser. Switching Git branches also triggers a rebuild. The first
start is slower. For a Hugo Module, Hugo downloads the module through Go into
its cache. Later starts read the cache.

## The switches worth knowing {#server-flags}

| Switch | Default | Description |
| --- | --- | --- |
| `-D` / `--buildDrafts` | off | Also builds pages with `draft: true` |
| `-F` / `--buildFuture` | off | Also builds pages whose `date` / `publishDate` is in the future |
| `-E` / `--buildExpired` | off | Also builds pages whose `expiryDate` has passed |
| `--disableFastRender` | off | Re-renders the complete site on every change instead of using incremental rendering |
| `-M` / `--renderToMemory` | off (writes to disk) | Renders only in memory. Writes no `public/` |
| `-N` / `--navigateToChanged` | off | The browser opens the page you saved |
| `--bind` | `127.0.0.1` | The listen address. Use `0.0.0.0` for access from a LAN or outside a container |
| `-p` / `--port` | `1313` | The listen port |
| `--minify` | off | Minifies the preview too, to reproduce production rendering |
| `--printPathWarnings` | off | Warns when two pages write to the same target path |
{.fields meta="default"}

The combination used while developing this site:

```bash {title="Terminal"}
hugo server -DFE \
  --disableFastRender --renderToMemory --minify \
  --printPathWarnings --logLevel info
```

`-DFE` means `-D -F -E`. It builds drafts, future pages, and expired pages
together. Newly created pages are therefore visible while you write them.

### A change that did not take effect {#fast-render}

Hugo enables fast render by default. It rebuilds only the output that it
identifies as affected. Changes to layouts, configuration, `data/`, or a file
used by `include` can escape detection. If the page appears unchanged, follow
these three steps:

1. Restart with `--disableFastRender`. Check whether the change appears.
1. Force a browser refresh (`Cmd`/`Ctrl` + `Shift` + `R`) to exclude browser cache as the cause.
1. If the change still does not appear, [clear the caches](#clean-caches) and restart.
{.steps}

### Reaching it from another device {#bind}
`hugo server` listens on `127.0.0.1` only, so no other device can reach it. To
preview on a phone or another machine:

```bash {title="Terminal"}
hugo server --bind 0.0.0.0 --port 1313 --baseURL http://192.168.1.10:1313/
```

Set `--baseURL` to an address that the other device can reach. Otherwise, the
page opens, but resources with absolute paths point to `localhost`. These
resources include CSS and the search index.

## Production build {#production-build}

Build deployable output with `hugo`, not `hugo server`:

```bash {title="Terminal"}
hugo --gc --minify --printPathWarnings
```

Hugo writes the output to `public/`. You can deploy it independently of the
source tree. The four switches have these functions:

| Switch | Description |
| --- | --- |
| `--gc` | Clears cached resources in `resources/_gen` that are no longer referenced |
| `--minify` | Minifies the HTML, CSS, JS and XML output |
| `--printPathWarnings` | Warns when two pages use the same output path. This is the most common silent error on multilingual sites |
{.fields}

Use Hugo Extended 0.168.0 and leave warnings visible. Do not enable
`--panicOnWarning` or `HUGO_PANICONWARNING`: Hugo's upstream LibSass deprecation
warning is accepted. Invalid giscus settings or unsupported theme values also
warn and fall back; review these diagnostics and the rendered output before
publication.

This site's CI uses the production command above, with local module
replacements and workspaces disabled for published-pin acceptance.

### baseURL and the build environment {#baseurl-and-environment}

`baseURL` lives in `hugo.yml` and can be overridden on the command line:

```yaml {title="hugo.yml"}
baseURL: https://oink.pgsty.com
```

```bash {title="Terminal"}
hugo --minify --baseURL "https://example.com/docs/"
```

When deploying to a subpath, `--baseURL` must include that path segment; the
details are in [Deploy](/docs/admin/deploy/#baseurl).

Select the build environment with `-e` / `--environment`. The default is
`production` for `hugo` and `development` for `hugo server`. This choice has
three visible effects in OINK:

- Only `production` emits `<meta name="robots" content="index, follow">`. Other environments emit `noindex, nofollow`.
- In `production`, `robots.txt` contains `Allow: /`. In other environments, it contains `Disallow: /`.
- Only `production` renders Hugo's Google Analytics template, and only there are static assets fingerprinted with SRI.

For preview deployments, including PR previews and staging, use a
non-production environment. The output automatically disables analytics and
requests no indexing:

```bash {title="Terminal"}
hugo --minify --environment staging --baseURL "$PREVIEW_URL"
```

## Previewing in a container {#container}

A container is optional. Use one if your team needs a pinned toolchain version
or does not want to install Hugo on every developer's machine.

```dockerfile {title="Dockerfile" collapse=16}
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.168.0
ARG GO_VERSION=1.27.3
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl --fail --location -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && curl --fail --location -o /tmp/go.tgz \
      "https://go.dev/dl/go${GO_VERSION}.linux-${TARGETARCH}.tar.gz" \
    && tar -C /usr/local -xzf /tmp/go.tgz \
    && rm -rf /var/lib/apt/lists/* /tmp/hugo.deb /tmp/go.tgz

RUN case "${TARGETARCH}" in \
      amd64) sass_arch=x64; sass_sha=a530ee08d5792c80bdb9d9614b45fb58219c890cb42a280a80775f0af9c29582 ;; \
      arm64) sass_arch=arm64; sass_sha=40c7a1946f654163daab34d3824cf572d2e72cc48a2efcf9ca0a33140007d374 ;; \
      *) exit 1 ;; \
    esac \
    && curl --fail --location -o /tmp/sass.tgz \
      "https://github.com/sass/dart-sass/releases/download/1.105.2/dart-sass-1.105.2-linux-${sass_arch}.tar.gz" \
    && echo "${sass_sha}  /tmp/sass.tgz" | sha256sum --check \
    && tar -C /opt -xzf /tmp/sass.tgz \
    && rm /tmp/sass.tgz

ENV PATH="/usr/local/go/bin:/opt/dart-sass:${PATH}"
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

The image includes Go because Hugo needs it to resolve and download a Hugo
Module. If the site uses a submodule, offline archive, or plain clone, you can
remove Go. This makes the image much smaller.

> [!WARNING] Do not let root write `public/`
> A container process runs as root by default. The generated `public/` belongs
> to root, so the host cannot delete it. In a shared environment, map the user
> ID with `--user "$(id -u):$(id -g)"`. The production build command above
> already does this.

The image requires no Node.js, npm, or PostCSS. It should not fetch remote
browser assets. For a network-isolated environment, mirror the base image and
the Hugo and Go packages in advance.

## Clearing caches {#clean-caches}

Hugo stores intermediate output in three places. Clear the smallest scope first:

| Directory / command | Contents | When to clear |
| --- | --- | --- |
| `public/` | The previous build's output | A deleted page remains live. You can also let the build clear this directory with `hugo --cleanDestinationDir` |
| `resources/_gen/` | Processed images and compiled CSS | Image processing parameters, fonts, or the accent color changed, but the page still shows the old appearance |
| `hugo mod clean` | The Hugo Module cache | The theme version changed, but the old version still resolves. Add `--all` to clear the complete module cache |
{.fields}

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo mod clean          # only the modules this project uses
hugo mod clean --all    # the whole module cache; the next build downloads again
```

Add both `public/` and `resources/` to `.gitignore`. Never commit generated output.

## Working on the theme alongside {#theme-workspace}

If you change the theme and site together, temporarily select a local checkout
with `HUGO_MODULE_REPLACEMENTS`. Leave `go.mod` unchanged:

```bash {title="Terminal"}
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> /absolute/path/to/oink' hugo server
```

This site's `Makefile` wraps those commands and expects the theme checkout at
the sibling `../oink`:

```text {title="Makefile targets" copy=false}
make dev     # development server with ../oink substituted
make check   # full regression suite (npm test) with ../oink substituted
make build   # build with the version in go.mod
make serve   # preview server with the production configuration
```

> [!DANGER] Local overrides can mask the published version
> CI and production builds can still inherit replacements or workspaces.
> Do not commit a workspace containing developer-machine paths. To verify a
> published tag, unset `HUGO_MODULE_REPLACEMENTS` and set both `GOWORK=off` and
> `HUGO_MODULE_WORKSPACE=off`. Also inspect persistent replacements in `go.mod`
> and Hugo configuration, and any `_vendor/` copy; confirm the exact version in
> `hugo mod graph` under the same environment before building.

## Verifying an offline build {#air-gapped}

For acceptance in a network-isolated environment, check both the build and the
browser. Follow these six steps:

1. Start from a verified theme archive and an empty module cache (`hugo mod clean --all`).
1. Block outbound HTTP, HTTPS and the Go module proxy.
1. Run the production build `hugo --gc --minify --printPathWarnings`.
1. Browse pages in both languages: a documentation page, a blog page, the home page, the 404.
1. Exercise search, the light/dark toggle, diagrams and content components.
1. Check subresource origins and confirm there is no unexpected remote host.
{.steps}

For the last step, use the output checker from a theme checkout matching your
pinned release. It needs Python 3, not this documentation site's test framework.
Replace both absolute paths below and use the same base URL as the build:

```bash {title="Terminal"}
python3 /path/to/oink/bin/check-output-security.py \
  --public /path/to/my-site/public --base-url https://docs.internal.example.com/
```

The script scans every `href` / `src` / `srcset` / `poster` and form `action`
in all four outputs. Each value must be a site-relative path or use `http` /
`https` / `mailto` / `tel`. The script rejects inline `on*` handlers and
`javascript:` URLs. An `<iframe>`, `<script>`, `<link>`, `<img>`, `<video>`,
`<audio>`, `<embed>`, `<object>`, or `<source>` that points to another host is
an error. If the site intentionally embeds third-party content, use
`--third-party` to permit it. For a multi-domain language configuration, add
first-party hosts with `--allow-host`.

A passing check validates that commit in that environment. Repeat it for every
theme candidate and after every bundled-dependency update.

## Verify {#verify}

A clean production build should look like this:

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings
```

The build passes when it reports `Total in …` with no ERROR; review warnings and accept only the known upstream LibSass noticeING.
Then check the following items:

- Confirm that the log has no npm, PostCSS, Autoprefixer, or browser-asset download step. Such a step indicates upstream Docsy configuration.
- `public/` has `sitemap.xml` and `robots.txt`, and `robots.txt` reads `Allow: /`.
- If local search is enabled, confirm that each language has an index in `public/`. Production filenames are `offline-search-index.<language>.<hash>.json`. Development filenames omit the hash. Open search and confirm that the actual `data-td-index-src` URL returns 200.
- With `hugo server`, open one documentation page, one blog page, the home page, and the 404. Check both languages and both color schemes.

For a failing build or a wrong result, see
[Troubleshooting](/docs/admin/troubleshooting/).

## Related {#related}

- [Deploy](/docs/admin/deploy/) — getting `public/` to GitHub Pages, Cloudflare or elsewhere
- [Troubleshooting](/docs/admin/troubleshooting/) — the four common fault classes: build, language, search, platform
- [From scratch and other install methods](/docs/start/from-scratch/) — weighing Hugo Module, submodule and offline archive
- [Configuration](/docs/customize/config/) — every key in `hugo.yml`
