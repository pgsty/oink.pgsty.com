---
title: Local preview
linkTitle: Local preview
description: Preview changes with hugo server, build a deployable public/ with hugo --panicOnWarning, and need neither Node nor a CDN.
weight: 10
search_keywords: [local preview, hugo server, development server, drafts, production build, container, Docker, cache, offline, air-gapped]
aliases:
  - /docs/tutorial/container/
  - /docs/deploy/local/
---

Two commands cover the daily work: `hugo server` previews changes locally, and
`hugo` produces a `public/` deployable to any static host. The prerequisite is
Hugo Extended ({{< param hugoMinVersion >}} or newer) on the machine, plus Go
when the theme comes in as a Hugo Module. The build depends on no Node.js, npm
or PostCSS — those serve only this repository's own regression checks.

## The preview server {#hugo-server}

From the site root (the directory holding `hugo.yml`):

```bash {title="Terminal"}
hugo server
```

Open <http://localhost:1313/>. Saving a file rebuilds and refreshes the browser,
and switching Git branches triggers a rebuild too. The first start is slower:
with the theme as a Hugo Module, Hugo has to download the module through Go into
its cache, and every start after that reads the cache.

## The switches worth knowing {#server-flags}

| Switch | Default | Description |
| --- | --- | --- |
| `-D` / `--buildDrafts` | off | Also builds pages with `draft: true` |
| `-F` / `--buildFuture` | off | Also builds pages whose `date` / `publishDate` is in the future |
| `-E` / `--buildExpired` | off | Also builds pages whose `expiryDate` has passed |
| `--disableFastRender` | off | Re-renders the whole site on every change instead of incrementally |
| `-M` / `--renderToMemory` | off (writes to disk) | Renders in memory only, writing no `public/` |
| `-N` / `--navigateToChanged` | off | The browser jumps to whichever page you saved |
| `--bind` | `127.0.0.1` | The listen address; use `0.0.0.0` to reach it from a LAN or outside a container |
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

`-DFE` is shorthand for `-D -F -E`, building drafts, future and expired pages
together so a newly created page is visible while writing.

### A change that did not take effect {#fast-render}

Hugo enables fast render by default, rebuilding only what it judges affected.
When editing layouts, configuration, `data/`, or a file pulled in by `include`,
that judgement can miss, and the page appears unchanged. Three steps:

1. Restart with `--disableFastRender` and see whether it comes back.
1. Hard-refresh the browser (`Cmd`/`Ctrl` + `Shift` + `R`) to rule out browser cache.
1. If it still does not, [clear the caches](#clean-caches) and restart.
{.steps}

### Reaching it from another device {#bind}
`hugo server` listens on `127.0.0.1` only, so no other device can reach it. To
preview on a phone or another machine:

```bash {title="Terminal"}
hugo server --bind 0.0.0.0 --port 1313 --baseURL http://192.168.1.10:1313/
```

`--baseURL` must be an address the other device can reach, or the page opens
while CSS and the search index — anything using an absolute path — point at
`localhost`.

## Production build {#production-build}

Build deployable output with `hugo`, not `hugo server`:

```bash {title="Terminal"}
hugo --gc --minify --printPathWarnings --panicOnWarning
```

The output goes to `public/`, which can be deployed independently of the source
tree. Each of the four switches does one thing:

| Switch | Description |
| --- | --- |
| `--gc` | Clears cached resources in `resources/_gen` that are no longer referenced |
| `--minify` | Minifies the HTML, CSS, JS and XML output |
| `--printPathWarnings` | Warns when two pages collide on one output path, the commonest silent error on a multilingual site |
| `--panicOnWarning` | Fails the build on the first WARNING |
{.fields}

`--panicOnWarning` deserves its own note. Most of OINK's degradation paths warn
rather than error: a missing required giscus key, an unsupported
`params.comments.type`, a configuration key Hugo has deprecated — each prints one
WARNING and moves on. CI logs are rarely read line by line, so those reach
production. Putting this switch in the build command makes zero warnings the
condition for a passing build.

This site's CI build step (`.github/workflows/pages.yml`) is
`hugo --cleanDestinationDir --gc --minify --environment production
--printPathWarnings --panicOnWarning`, so any warning stops the deployment at
the build stage.

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

The build environment is chosen with `-e` / `--environment`; `hugo` defaults to
`production` and `hugo server` to `development`. That choice has three visible
consequences in OINK:

- Only `production` emits `<meta name="robots" content="index, follow">`; other environments emit `noindex, nofollow`.
- Under `production` `robots.txt` is `Allow: /`; elsewhere it is `Disallow: /`.
- Only `production` renders Hugo's Google Analytics template, and only there are static assets fingerprinted with SRI.

Build preview deployments (PR previews, staging) with a non-production
environment, and the output declines indexing and analytics by itself:

```bash {title="Terminal"}
hugo --minify --environment staging --baseURL "$PREVIEW_URL"
```

## Previewing in a container {#container}

A container is not required. Two situations suit one: a team that needs a pinned
toolchain version, or one that would rather not install Hugo on every developer
machine.

```dockerfile {title="Dockerfile" collapse=16}
FROM debian:bookworm-slim

ARG HUGO_VERSION=0.164.0
ARG GO_VERSION=1.26.6
ARG TARGETARCH

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && curl -L -o /tmp/hugo.deb \
      "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${TARGETARCH}.deb" \
    && apt-get install -y /tmp/hugo.deb \
    && curl -L -o /tmp/go.tgz \
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

Go is in the image because Hugo needs it to resolve and download the module when
the theme comes in as a Hugo Module. A site using a submodule, an offline
archive or a plain clone can drop Go, and the image gets much smaller.

> [!WARNING] Do not let root write `public/`
> A container process is root by default, the generated `public/` belongs to
> root, and the host cannot delete it. In a shared environment, map the user ID
> with `--user "$(id -u):$(id -g)"` (the production build command above already
> does).

The image needs no Node.js, npm or PostCSS, and should have no step fetching
remote browser assets. A network-isolated environment needs the base image and
those two packages mirrored in advance.

## Clearing caches {#clean-caches}

Hugo's intermediate output lives in three places; clear them lightest first:

| Directory / command | Contents | When to clear |
| --- | --- | --- |
| `public/` | The previous build's output | A page was deleted but is still live; or let the build clear it with `hugo --cleanDestinationDir` |
| `resources/_gen/` | Processed images and compiled CSS | Image processing parameters, fonts or the accent colour changed and the page still looks old |
| `hugo mod clean` | The Hugo Module cache | The theme version changed but the old one still resolves; add `--all` to clear the whole module cache |
{.fields}

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo mod clean          # only the modules this project uses
hugo mod clean --all    # the whole module cache; the next build downloads again
```

Both `public/` and `resources/` belong in `.gitignore`; generated output is
never committed.

## Working on the theme alongside {#theme-workspace}

This section applies only when changing the theme and the site together. Point
the module at a local checkout temporarily with `HUGO_MODULE_REPLACEMENTS`,
leaving `go.mod` untouched:

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

> [!DANGER] A replacement is local only
> Whether through the environment variable or a Go workspace
> (`go work init` plus `HUGO_MODULE_WORKSPACE=go.work`), CI and production builds
> read only `go.mod`; `go.work` records a developer machine's paths and is never
> committed. To judge whether a release tag works, drop the replacement and build
> once against the version in `go.mod`.

## Verifying an offline build {#air-gapped}

Acceptance in a network-isolated environment has to cover both the build stage
and the browser stage. Six steps:

1. Start from a verified theme archive and an empty module cache (`hugo mod clean --all`).
1. Block outbound HTTP, HTTPS and the Go module proxy.
1. Run the production build `hugo --gc --minify --printPathWarnings --panicOnWarning`.
1. Browse pages in both languages: a documentation page, a blog page, the home page, the 404.
1. Exercise search, the light/dark toggle, diagrams and content components.
1. Check subresource origins and confirm there is no unexpected remote host.
{.steps}

The last step uses a script from the theme repository that does not depend on
the site's test framework:

```bash {title="Terminal"}
python3 bin/check-output-security.py \
  --public public --base-url https://docs.internal.example.com/
```

The script scans every `href` / `src` / `srcset` / `poster` and form `action` in
all four outputs, requiring each to be a site-relative path or `http` /
`https` / `mailto` / `tel`, and rejecting inline `on*` handlers and
`javascript:` URLs. An `<iframe>`, `<script>`, `<link>`, `<img>`, `<video>`,
`<audio>`, `<embed>`, `<object>` or `<source>` pointing at another host is an
error; where a site genuinely embeds third-party content, `--third-party`
permits it, and a multi-domain language configuration adds first-party hosts
with `--allow-host`.

One pass proves that commit in that environment. Run it again for every theme
candidate and after every bundled-dependency update.

## Verify {#verify}

A clean production build should look like this:

```bash {title="Terminal"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning
```

It passes on `Total in …` with no ERROR and no WARNING. Then confirm:

- The log has no npm, PostCSS, Autoprefixer or browser-asset download step. One appearing means upstream Docsy's process has crept into the configuration.
- `public/` has `sitemap.xml` and `robots.txt`, and `robots.txt` reads `Allow: /`.
- On a site with local search, `public/` has `offline-search-index.<language>.json` at its root.
- Open representative pages with `hugo server`: one documentation page, one blog page, the home page and the 404, in both languages and both colour schemes.

For a failing build or a wrong result, see
[Troubleshooting](/docs/admin/troubleshooting/).

## Related {#related}

- [Deploy](/docs/admin/deploy/) — getting `public/` to GitHub Pages, Cloudflare or elsewhere
- [Troubleshooting](/docs/admin/troubleshooting/) — the four common fault classes: build, language, search, platform
- [From scratch and other install methods](/docs/start/from-scratch/) — weighing Hugo Module, submodule and offline archive
- [Configuration](/docs/customize/config/) — every key in `hugo.yml`
