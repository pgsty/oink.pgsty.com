---
title: "oink: preview and multi-version serving from a docs repository"
linkTitle: oink and versioned serving
description: A draft PRD for one oink binary that embeds Hugo and OINK and runs directly on a Git documentation repository for local preview, production serving, multi-version publishing, single-file packages and online features, with the theme changes it needs.
weight: 31
icon: fa-solid fa-server
search_keywords: [oink, PRD, serve, versions, Git, tags, branches, SQLite, full-text search, .oink, Crib]
design_kind: proposal
design_status: draft
proposal_date: 2026-11-28
---

> [!WARNING] Draft, 2026-11-28
> This proposal describes a product direction that is not implemented. Do not use it as a
> configuration or command reference. Current behavior is defined by the
> [architecture contract](/docs/design/architecture/), the [CLI contract](/docs/design/decisions/cli/)
> and the [versions guide](/docs/customize/versions/).

## Status and surface {#status}

**Status and date**: draft, 2026-11-28; product requirements and an architecture direction, not an implementation contract

**Owner**: OINK maintainer

**Baseline**: OINK v1.7.0; installed Hugo v0.170.1; the local `0.1.0-dev` candidate of `pgsty/oink-cli` (unreleased, no users)

**Affected contracts**: [CLI contract](/docs/design/decisions/cli/) (superseded if this proposal is accepted),
[Architecture · Outputs and runtime](/docs/design/architecture/#outputs-and-runtime),
[Shell · Search, actions, and runtime](/docs/design/shell/#search-actions-and-runtime),
[Shell · Archived-version banner](/docs/design/shell/#archived-banner), [versions guide](/docs/customize/versions/)

**Related proposals**: takes over the unimplemented version-lifecycle stage of the
[CLI roadmap](/docs/design/proposals/oink-cli-roadmap/#version-lifecycle); answers the open question of
[theme roadmap R2](/docs/design/proposals/theme-roadmap/#version-lifecycle), "native version dimension or
independent builds"; delivers the database backend that the
[local search proposal](/docs/design/proposals/local-search-engine/) left open

**Affected implementation**: a new `oink` binary repository (see [open decisions](#open-decisions)); the theme's
version menu, banner, search, comments, sidebar and error pages (see
[theme coordination](#theme-coordination))

**Release intent**: staged, see [milestones](#milestones); this proposal commits to no release date

## Summary {#summary}

Run the same `oink` binary in any OINK documentation repository:

```sh
oink dev                      # preview the working tree, refresh on save
oink serve                    # production: publish branches and tags as versions
oink build -o site.oink       # export the same versions as a static tree or one file
```

The machine needs no Hugo, Go or Node. The binary embeds upstream Hugo (imported as a library, not forked)
and the OINK theme.

The core model fits in one sentence: **Git is the content store, a version is a label bound to a ref, and
rendered output is a content-addressed snapshot.** The production server publishes only committed,
successfully built snapshots and moves version pointers atomically. Storage and computation grow with
unique content, not with versions times pages.

Four invariants run through the whole document:

1. **Plain Hugo still builds the site.** oink adds versions, serving and online features and never changes
   what a page means; without oink nothing breaks.
2. **Production serves only committed, successfully built snapshots.** Half-edited files, bad commits and
   build timeouts never replace live content; the last good snapshot keeps serving.
3. **Appearance has one authority.** Hugo and OINK render every byte of HTML, including error pages, version
   menu fragments and corpus shells. The server routes, splices declared slots and caches; it renders no
   templates.
4. **Cost follows unique content.** A tag is built once, and an unchanged page is stored once.

## Context and evidence {#context}

### Current state {#current-state}

- OINK treats each documentation version as a separate site: built and deployed on its own, with the
  `params.versions` menu written into every build. Adding a version means updating the list on every
  branch and rebuilding them all (see the [versions guide](/docs/customize/versions/)).
- `oink-cli` is a local candidate that calls an external Hugo; it is unreleased and has no users. On
  2026-11-28 the owner said the new design need not follow it.
- Comments, page views, sign-in, access control and cross-version search have no home on static hosting;
  comments are giscus only.

### Why per-version static builds explode {#explosion}

Measured on 2026-11-28 in the pgdoc-cn repository (the pgweb HTML of the Chinese PostgreSQL manual,
559 releases plus `master`) and on the bilingual PG 18 OINK site:

| Measurement | Result |
| --- | --- |
| Every version checked out | 6.15 GB of HTML in 529k files; the Git pack is 78 MiB |
| File-level deduplication | 527k unique files, almost none removed: each minor release touches about 1,000 files, most of them only for the version number in the page header and footer |
| Deduplication by body after stripping header and footer | 98k unique bodies, 1.29 GB |
| Pages that really change per minor release | median 107 (p90 333); about 35 on the 17 and 18 lines |
| zstd in ~1 MiB clusters sorted by path across versions | 31 MB of unique bodies; 73 MB for whole pages with headers and footers |
| Read one page from Git / turn it into an OINK body | p50 156 µs / p50 0.38 ms (p99 2.7 ms) |
| One OINK build (bilingual PG 18, v1.7.0) | 38 s, 4.2 GB peak, 808 MB; 431 KB per page on average, 55% of the SELECT page is sidebar |
| The site's own vendored OINK v1.4.0 | fails to build on Hugo 0.170.1 |

The explosion has three sources: version-dependent chrome baked into every page, storage file by file, and
OINK inlining the whole sidebar in every page. None of them is content. Without them all 560 versions
take 30–70 MB, and materializing all of them in the background costs about one CPU minute. The last row
also shows that an old version cannot be re-rendered with the theme it once used.

### What Hugo already provides {#hugo-facts}

- **The whole command line is one function.** Hugo's `commands.Execute(args []string) error` is the entry
  point of a public package (v0.168.0 source, `commands/commandeer.go`); embedding Hugo's CLI is one line.
- **Replacing the theme needs no Go.** With no `go` on `PATH`, pointing `github.com/pgsty/oink` at a local
  directory through `HUGO_MODULE_REPLACEMENTS` builds an OINK site completely; without the replacement
  Hugo stops with `binary with name "go" not found in PATH` (measured on 2026-11-28 with Hugo v0.170.1).
- **Static compilation should work.** In the v0.168.0 source, WebP and AVIF codecs run in WASM and cgo
  serves only the removed LibSass; OINK is plain CSS, so a binary that embeds Hugo should cross-compile
  with `CGO_ENABLED=0` (not yet tried).
- **The sites matrix has a version dimension.** Since v0.153, `[versions]` configuration,
  `sites.matrix.versions` on mounts, and `site.Version` and `.Rotate` in templates form a native version
  dimension. It puts every version in one build, which suits small static sites; see
  [alternatives](#alternatives).
- **The development server is already good.** `hugo server` rebuilds incrementally, live-reloads and shows
  errors in the browser.

### Owner inputs {#owner-inputs}

These requirements come from the owner's discussion on 2026-11-27 and 2026-11-28 and are the premise of
this proposal. Everything else on this page is a proposal and binds nothing until the owner accepts it.

- One Go binary named `oink`, in OINK style; local Markdown in Git is the only authoritative source.
- It runs directly on a documentation repository: local preview with live updates while editing, and
  production serving.
- Production is Git-aware: it can pin one branch or publish a set of tags as versions; the default
  branch is the default version; in PG a major version is a branch and a minor version a tag; historical
  versions are read from Git and rendered on the fly.
- Building many static versions must not make the site explode.
- SQLite keeps state and the full-text index, with better full-text search, page views, comments and even
  access control.
- It is based on Hugo, embedded thinly, like the Hugo module inside Caddy.
- A `.oink` package format that the macOS app Crib opens directly.
- First-round requirements: comments, users, access control, full-text search, page views and versions;
  covering pg.center and pgext; 500+ PG documentation versions; Cloudflare preferred; images may come from
  nginx.
- The existing `oink-cli` may be disregarded, and the requirements themselves may be improved.

## Goals and non-goals {#goals}

Goals:

- **G1 One binary.** Running `oink` in any OINK repository previews it without Hugo, Go or Node; the same
  binary is the production server.
- **G2 Git-aware versions.** Versions come from branches and tags; aliases such as `current` and `latest`
  move atomically; all 560 versions of pgdoc-cn are available.
- **G3 No explosion.** Storage and build cost follow unique content; the store for every pgdoc-cn version
  stays under 100 MB.
- **G4 No outage from edits or bad commits.** Production follows commits only, keeps the last good
  snapshot, and rolls back in about a second.
- **G5 One experience.** A commit looks and behaves the same in `hugo`, `oink dev`, `oink serve` and a
  `.oink` package; every version shares the current appearance.
- **G6 Optional online features.** Full-text search, page views, accounts, access control and comments run
  on SQLite, are off by default and are enabled per site.
- **G7 Offline and distribution.** One `.oink` file opens directly in `oink serve` and in Crib.

Non-goals for the first version:

- No visual CMS, in-browser editing or Git commits from the web.
- No Hugo fork, and no new rendering engine or template language.
- No multiple sites per process and no state shared across instances; a PostgreSQL state backend can come
  later.
- No built-in TLS certificate issuance; run behind Cloudflare, nginx or Caddy.
- Version slots and online features are not supported for non-OINK themes (such sites build, but are out
  of scope).
- No reconstruction of the theme an old tag once used.

## Users and scenarios {#scenarios}

| Role | Scenario | Expectation |
| --- | --- | --- |
| Authors and translators | Writing in the repository | Run `oink`, refresh on save; warnings appear in the page with file and line |
| Maintainers | Publishing a version | A new tag goes live automatically; a bad commit never reaches readers; one command rolls back |
| Operators | Deploying and upgrading | One binary and one data directory; serving resumes immediately after a restart; upgrades need no downtime rebuild |
| Readers | Reading and finding | Switching versions stays on the same page; old versions carry a clear banner; search and comments work |
| Offline readers | Crib or an air-gapped network | One `.oink` file opens every version |

What each target site uses:

| Site | Shape | Main capabilities |
| --- | --- | --- |
| PG documentation on pgsql.cc | 560 versions of pgweb HTML | HTML corpus renderer, lines and aliases, cross-version search, `.oink` package |
| Product docs such as Pigsty | one line per minor release | Hugo renderer, default version at the root, comments |
| pgext | one version, about 10,000 pages | atomic publishing, server search, page views |
| pg.center | dynamic Go and PG application | `oink serve` for the documentation part; embedding as a Go library later |

## Product shape {#product}

### Commands {#commands}

| Command | What it does |
| --- | --- |
| `oink` | `oink dev` inside a site directory; help elsewhere |
| `oink dev [DIR]` | Preview the working tree: refresh on save, drafts shown, localhost only by default |
| `oink serve [DIR \| GIT-URL \| FILE.oink]` | Production: publish versions from Git refs, or serve one package read-only |
| `oink build [--versions] [-o DIR \| FILE.oink]` | Export a static tree or a single-file package |
| `oink check [--versions]` | Build and summarize Hugo and OINK diagnostics with CI-friendly exit codes |
| `oink versions` | List the versions, aliases and refs resolved from Git without building |
| `oink new [site \| page]` | Create a site or page skeleton |
| `oink status`, `rebuild`, `rollback`, `user` | Manage a running server through a local socket in its data directory |
| `oink hugo …` | Run the embedded Hugo command line unchanged |
| `oink --version` | Print the versions of oink, the embedded Hugo and the embedded theme |

### Development mode {#dev}

- **The source is the working tree**, uncommitted files included; drafts and future-dated pages show;
  it listens on `127.0.0.1` by default.
- **The engine is Hugo's own development server.** oink runs the embedded `hugo server` in a child process
  (render to memory, incremental rebuilds, live reload) and reverse-proxies it, adding three things:
  - an in-page diagnostics overlay, so Hugo and OINK warnings appear with file and line in the page and
    not only in the terminal;
  - the same `/_oink/` endpoints as production, so search, comments and the rest can be tried against a
    local `state.db`;
  - other versions from Git on request (`--versions`), so the whole site with its version menu can be
    seen locally.
- **No blank page on failure.** A failed rebuild keeps the last good page, and the overlay points to the
  error.
- **Folder mode** (a later milestone): a directory without Hugo configuration gets a generated temporary
  configuration and the embedded theme, `README.md` becomes the section index, and the folder structure
  becomes the sidebar.

### Production mode {#serve}

- **It reads Git and never the working tree.** A half-edited file can never reach production; that is
  the fundamental guarantee that editing a file cannot crash the site.
- **It serves at startup.** Snapshots in the store are usable immediately and nothing rebuilds at boot.
  Only a change of engine identity (the oink, Hugo or theme release) rebuilds, in the background and one
  version at a time.
- **It accepts three inputs**: the current checkout (using its `.git`); a remote repository URL (mirrored
  into the data directory); or a `.oink` package (read-only, no builds).
- **It keeps following refs**: resolve versions, build missing snapshots in the background, switch
  atomically after success; `oink status`, `oink rollback` and `oink rebuild` handle status, rollback and
  rebuilds.

### Static and packaged output {#build}

`oink build` is `serve` frozen into files: the same snapshots and the same slot splicing.

- `oink build` builds the default version into `public/`, used like `hugo`.
- `oink build --versions -o dist/` writes a static multi-version tree: each version under its prefix,
  version slots spliced at export time, a `versions.json`, and aliases as `_redirects`. It suits sites
  with few versions and static hosts such as Cloudflare Pages.
- `oink build --versions -o site.oink` writes a single-file package; see
  [content store and the .oink format](#store).

## Core model {#model}

| Concept | Definition |
| --- | --- |
| Source | A Git repository; in development mode, the working tree |
| Version | A label bound to a ref: `3.7` → `v3.7.2`, `devel` → `main` |
| Line | Releases of one series; `17` contains `17.0` to `17.12` |
| Alias | A movable pointer to a version: `current` → `18` |
| Skin | The ref that supplies configuration, layouts, assets and the theme release; by default the default branch |
| Renderer | Turns skin plus one version's content into files: `hugo` or `html` |
| Snapshot | One version rendered at one commit: an immutable manifest from paths to objects |
| Store | Content-addressed object clusters; rebuildable; its format is `.oink` |
| State | Accounts, sessions, comments, counters and access rules; not rebuildable, back it up |

```text
Git refs ──resolve──▶ versions ──render+ingest──▶ snapshots ──publish──▶ aliases and pointers ──serve──▶ readers
          (label→ref)          (Hugo or corpus)  (immutable)            (atomic switch)          (splice slots, cache)
```

### Versions from Git refs {#versions}

- **Without configuration**, the head of the default branch is the only version, served at `/`. Pinning
  a branch is this case, or `--ref` chooses one.
- **`tags`** is a regular expression with the named groups `line` and `patch`. Each line becomes a
  version labeled with its `line`, whose content is the tag with the highest `patch`. With
  `releases: true`, every tag also becomes an exact release such as `17.4`.
- **`branches`** maps labels to branches, for moving versions such as `devel` or `next`.
- **Line content** comes from the newest tag by default; `line_branch` publishes the head of the line's
  branch instead, for translation projects that ship corrections between releases.
- **`aliases`** maps names to versions or to the computed target `latest`, the highest-numbered line.
- **`default`** names the version served without a version prefix; **`archived`** marks lines that are no
  longer maintained.
- **Ordering** compares dotted numbers component by component; tags that do not match the expression
  (such as `v4.0.0-rc1`) are not published.

Product documentation: one line per minor release, default version at the root.

```yaml {title="oink.yaml"}
versions:
  tags: '^v(?P<line>\d+\.\d+)\.(?P<patch>\d+)$' # v3.7.2 → line 3.7
  branches: { devel: main }
  default: latest # the newest line is served at /
  url: '/v{label}/' # other versions: /v3.6/…
  archived: ['< 3.0']
```

The Chinese PostgreSQL manual: two version-number styles, 560 versions.

```yaml {title="oink.yaml"}
versions:
  renderer: { type: html, profile: pgweb }
  tags: '^v(?P<line>\d+(?:\.\d+)??)\.(?P<patch>\d+)$' # v17.4 → 17; v9.6.24 → 9.6
  releases: true # also /docs/17.4/
  branches: { devel: master }
  aliases: { current: latest }
  url: '/docs/{label}/'
  archived: ['< 15']
```

| URL | Meaning |
| --- | --- |
| `/docs/17.4/sql-select.html` | Exact release, immutable, `noindex` |
| `/docs/17/sql-select.html` | The newest release of line 17 |
| `/docs/current/sql-select.html` | Alias of the highest-numbered line, served in place |
| `/docs/devel/sql-select.html` | Head of `master`, `noindex` |

### Content per version, current appearance {#skin}

When the Hugo renderer builds a version, it takes `content/` (and any other path listed in
`versions.content`) from the **version commit** and everything else from the **skin commit**:
`hugo.yaml`, `layouts/`, `assets/`, `i18n/`, `data/`, `static/`, `go.mod` and the theme release. The
worktree's `HEAD` is the version commit, so each page's last-modified date and author belong to that
version and not to the skin.

There are four reasons:

1. An old theme may not build on a new Hugo (v1.4.0 already fails on 0.170.1).
2. Navigation, the version menu and search look the same in every version, so switching versions never
   lands the reader on a different site.
3. One deployment has one theme release, so fixes and improvements reach every version at once.
4. Templates come only from the skin; old tags and preview branches contribute content and never run
   templates of their own.

The cost: configuration differences of old versions (menu entries, parameters) no longer apply, and old
content that uses a removed shortcode warns and degrades safely under the theme's rules.
`oink check --versions` reports these warnings per version. A version that really needs its own
configuration can set `skin: self` and build with its own configuration, layouts and theme release; if
that fails on the embedded Hugo, the version is unavailable and its status says why. Docusaurus works the
same way: documentation content is versioned, the theme is always current.

When a skin commit changes only content paths, only its own version (usually `devel`) rebuilds. When it
changes configuration, layouts or assets, the other versions rebuild in the background while their old
snapshots keep serving.

### URLs, canonical links and indexing {#urls}

- **The default version is served without a version number.** Adopting versions changes no existing URL.
  `/v{default}/x` answers 301 to `/x`.
- **Other versions** live under the prefix of the `url` template, `/{label}/` by default. The Hugo
  renderer's prefix must start at the site root because the whole build is relocated; an HTML corpus can
  be mounted under any prefix, such as `/docs/{label}/`.
- **Aliases** are served in place when the output is location-independent (HTML corpora are now; Hugo
  output will be after the theme delivers [T10](#theme-later)), and redirect with 302 otherwise.
- **Canonical links**: a page in a non-default version points `canonical` at the same page in the
  `canonical` version (by default `default`; `current` in the PG example), or at itself when that page
  does not exist. The PostgreSQL and Python documentation both do this (pages of `docs/16` and `3.11`
  checked on 2026-11-28). The server rewrites the link while serving, which needs theme item
  [T5](#theme-stage-two); until then the canonical link points at the page itself.
- **Indexing**: exact releases and prerelease versions carry `noindex` (through the build-level parameter
  of [T4](#theme-stage-one)); the sitemap lists the default version only.
- **Version-aware 404**: when a path does not exist in a version, that version's own 404 page is
  returned, and the theme runtime calls `/_oink/where` to list the versions that have the path, such as
  "since 9.4" or "removed in 12" (this needs [T3](#theme-stage-one) and [T8](#theme-stage-two)).

## Architecture {#architecture}

### Pipeline {#pipeline}

```text
                ┌──────────────────────── oink serve ─────────────────────────────┐
 Git refs  ───▶ │ resolve ──▶ materialize ──▶ render ──▶ ingest ──▶ publish        │ ───▶ HTTP
 fetch/webhook/ │ versions    skin+content    Hugo child  dedup,     atomic        │      splice slots
 local push     │             worktree        or corpus   index      pointer       │      cache
                └──────────────┬───────────────────────────────────┬──────────────┘
                               ▼                                   ▼
                     store.oink (rebuildable)              state.db (back it up)
```

1. **Resolve**: read the `oink.yaml` committed on the skin ref and map refs to versions and aliases. Each
   version's snapshot key is H(version commit, skin commit, engine identity, URL base); an existing key
   means there is nothing to do.
2. **Materialize**: the Hugo renderer creates a `git worktree` at the version commit and overlays the
   skin's files; an HTML corpus is not materialized and its pages are read straight from Git objects.
3. **Render**: run the embedded Hugo in a child process into a temporary directory; transform HTML corpus
   pages one at a time.
4. **Ingest**: hash every output file and write only new objects into clusters; record the byte offsets of
   slots in HTML; extract search records; write the manifest.
5. **Publish**: once the snapshot is complete and its checks pass, switch the version pointer in one SQLite
   transaction; optionally ask the CDN to purge by prefix.
6. **Serve**: find the version and snapshot from the URL prefix, read the object, splice version slots and
   answer with the cache policy.

### Rendering engine {#engine}

- **Embed Hugo's command line.** `oink` links Hugo's `commands` package, and `oink hugo …` is stock Hugo.
  Builds re-execute the binary as a child process (`oink hugo --source … --destination …`). The coupling
  to Hugo is its command-line flags and output directory only, never the unstable `hugolib` internals.
- **Why a child process.** One PG 18 build peaks at 4.2 GB; inside the long-running server, one OOM or hang
  would take the service down. A child process has a timeout, a memory limit, a concurrency limit and a
  lower scheduling priority, and returns all of its memory when it exits.
- **Theme injection.** The embedded theme is extracted into a cache directory keyed by release and
  checksum, and the child runs with `HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> <dir>"`,
  `GOWORK=off` and `HUGO_MODULE_WORKSPACE=off`. This is verified to need no Go.
- **The theme release follows the skin's `go.mod`**, as with plain Hugo. It is sourced, in order, from the
  embedded theme when the release matches, the site's `_vendor/`, a local cache, or a download from the
  Go module proxy verified against `go.sum` (forbidden with `--offline`). Other Hugo modules likewise come
  from `_vendor/` or the cache; otherwise oink reports a clear error.
- **Build security.** Published refs build under the site's own Hugo `security` configuration; preview
  refs always build under a tightened one: no `exec`, no `getenv`, no remote HTTP, and no inline
  shortcodes. Child processes receive only the environment variables a build needs, and never a secret.
- **Incremental work.** The first version is incremental at the store level: only changed versions
  rebuild and only changed objects are stored. Hugo-level incremental rebuilds (a warm Hugo fed Git diffs
  as file-change events) wait for measurements.

### Two renderers {#renderers}

| | `hugo` (default) | `html` (HTML corpus) |
| --- | --- | --- |
| Input | One ref of an OINK or Hugo site | A rendered HTML tree, such as the DocBook output in pgdoc-cn |
| Granularity | One build per version | Per page, on first request or during background warm-up |
| Page chrome | Complete pages built by Hugo | A theme-rendered shell template plus the transformed body |
| Measured cost | 38 s and 4.2 GB for one bilingual PG 18 version | 0.38 ms per page (p99 2.7 ms); about one CPU minute for 98k bodies |
| Aliases | 302; in place once the theme delivers T10 | In place |

The HTML corpus renderer follows a built-in profile: how to find the body and title, which of the original
chrome to drop, how to rewrite internal links to the version prefix, how to map admonitions and tables to
the markup of theme components, and how to derive the navigation tree from the table of contents. The
first version allows no user scripts, and profiles start with `pgweb`. Transformed bodies are
location-independent and can sit unchanged under any alias.

### Content store and the .oink format {#store}

The store is one SQLite file, and the production cache, distribution packages and Crib's reading source
all use this one format:

```text
meta(key, value)                         format version, generator, site, signature
clusters(id, codec, raw_size, data)      about 1 MiB of raw data per cluster, zstd by default
objects(id, hash, cluster, offset, size, type)
paths(id, path)
snapshots(id, version, commit, skin, engine, base, created, state)
entries(snapshot, path, object)          WITHOUT ROWID
versions(label, snapshot, line, kind, status, sort_key)
aliases(name, target)
docs(object, lang, title, …) + fts5      one search record per unique body
```

- **The writer carries the complexity; a reader only fetches bytes by path.** The read path is path →
  entry → object → cluster (decoded clusters stay in an in-memory LRU) → bytes.
- **Append while serving, compact before distributing.** A running server appends new objects to new
  clusters; `oink build -o x.oink` reorders them so that the versions of one path sit together, packs them,
  and can add an Ed25519 signature.
- **Measured size**: 31 MB for every unique pgdoc-cn body, and only 73 MB even for whole pages with
  headers and footers; decoding a 1 MiB cluster takes 0.3–0.43 ms at p99.
- **The codec is recorded per cluster.** Apple's Compression framework has no zstd and Crib has no
  third-party dependencies. Either Crib adds a decode-only libzstd, or packages built for Crib use a codec
  Apple ships; measure first, see [open decisions](#open-decisions).
- **State never enters the store.** `store.oink` can be deleted and rebuilt at any time; `state.db` lives
  and is backed up on its own.

### Serving and caching {#serving}

A request goes through: dispatch of `/_oink/` endpoints → longest-prefix match of a version or alias (no
prefix means the default version) → access check → pinning the snapshot this request uses → entry lookup.
A hit is answered; a miss goes to the version-aware 404; a version not built yet returns a theme-rendered
503 "building" page with `Retry-After`.

Slots come in two kinds:

- **Version slots** are spliced by the server and cacheable: the version menu, archived or prerelease
  banners, `canonical` and `robots`. They depend only on which version this is and which versions exist,
  so every anonymous reader gets the same bytes and a CDN can cache them.
- **Reader slots** are filled in the browser and never cached: sign-in state, comments, page views, and
  the versions that contain this page. The theme runtime renders them from `/_oink/` JSON endpoints;
  cached HTML never carries anything personal to a reader.

Version slots arrive in two stages:

1. **Stage one changes nothing in the theme.** Each Hugo version is built with existing parameters
   injected: `params.version`, `params.versions`, `archived_version` and `url_latest_version`. When the
   set of versions or the skin changes, every Hugo version rebuilds in the background. For a site with a
   few dozen versions that is minutes of background CPU.
2. **Stage two takes slots from the theme** ([T5](#theme-stage-two)). Pages carry empty
   `<template data-td-slot="…">` markers. When the set of versions changes, oink runs a small fragment
   build of the skin: no content, plus one page per version generated by a content adapter, reusing the
   theme's existing version-menu and banner partials. It writes each version's menu and banner, and the
   shell template for HTML corpora. The server splices those bytes at the offsets recorded during ingest
   and renders no templates. Sites with many versions need this stage; HTML corpora use fragments and
   shells from the start.

| Response | `Cache-Control` | Invalidation |
| --- | --- | --- |
| Fingerprinted assets (CSS, JS chunks, fonts) | `public, max-age=31536000, immutable` | The file name changes with the content |
| HTML of releases and lines | `public, max-age=300, s-maxage=86400`, with ETag | Purge the CDN on a release or skin change |
| HTML of moving versions such as `devel` | `public, max-age=60, s-maxage=300`, with ETag | Purge on each publish |
| `/_oink/versions.json` | `public, max-age=60` | Expires naturally |
| Other `/_oink/` endpoints and protected pages | `private, no-store` | Never cached |

The ETag combines the object hash and the slot generation. A `media` mount serves a directory outside Git
under a prefix, unchanged, with Range requests and long caching, and never enters the store; large images
and video can also stay on nginx or R2.

### Updates, failures and rollback {#updates}

- **Triggers**: a periodic `git fetch` (every 60 s by default); a webhook (`POST /_oink/hooks/<provider>`,
  verified by HMAC); or a bare repository on the server used as a push target, whose refs are watched
  directly.
- **Queue**: the default version first, then lines by traffic; concurrency 1 by default; a newer commit of
  a version replaces its queued build.
- **Atomicity**: each request pins its snapshot when it starts; the pointer switches only after the new
  snapshot is complete and its checks pass.
- **Failure**: a failed, timed-out or rejected build keeps the old snapshot, and the status records the
  commit, the log tail and the number of warnings; an outgoing notification is optional.
- **Retention and rollback**: moving versions keep their three latest snapshots, and
  `oink rollback <version>` switches back in about a second; garbage collection removes objects no longer
  referenced, then clusters are compacted.
- **Upgrade**: replace the binary and restart; existing snapshots serve immediately, and a changed engine
  identity rebuilds in the background, version by version.
- **Crash safety**: both SQLite files use WAL; after `kill -9` and a restart, no published snapshot is
  lost.

### Search {#search}

- **Data**: ingest writes one record per unique body (title, headings, text, language) and notes the
  versions it belongs to. The Hugo renderer reuses the fields of the theme's local search index first, so
  both backends search the same text.
- **Engine**: SQLite FTS5 with BM25. CJK text is pre-segmented in Go, aligned with the theme's local engine
  and with Crib's `pgdash-han2-v1` analyzer, so FTS5 needs only `unicode61` and no custom tokenizer.
- **Scope**: the current line by default; optionally every version, with results merged per page and
  labeled with versions. pgdoc-cn indexes 98k bodies, not 529k pages.
- **Access**: results are filtered to what the reader may see.
- **Interface**: the theme's search interface stays, with `/_oink/search` as its backend; static hosts keep
  the local engine.

### Accounts, access, comments and page views {#services}

- **Accounts**: OAuth/OIDC sign-in, GitHub first; sessions live in `state.db`. `oink user add --admin`
  creates the first administrator and prints a one-time sign-in link in the terminal, so no mail service
  is needed.
- **Access**: `oink.yaml` grants roles by path and version. Protected content never enters the CDN, never
  appears in other readers' search results, and `oink build` refuses to export it.
- **Previews**: previews of branches, pull requests or arbitrary commits are for maintainers only and are
  served from a separate host name that has no session cookie of the main site.
- **Comments**: keyed by page identity (mount, language and path within the version, with Hugo `aliases`
  covering renames), shared across versions by default and labeled "written on 3.7"; a Markdown subset is
  sanitized on the server; a new user's first comment waits for review, and the endpoints are
  rate-limited. giscus stays the option for static sites.
- **Page views**: each page load sends a `sendBeacon` to `/_oink/hit`; no cookie and no IP address are
  kept; counts accumulate in memory and are written per day every minute; whether they are shown is a
  theme parameter.

### Configuration {#configuration}

Two files, one job each:

- `hugo.yaml` decides how pages look and behave, including the comment provider, the search backend and
  whether page views are shown.
- `oink.yaml` decides what is published where, plus server policy: versions, skin, renderers, access,
  moderation and media directories. It must not set `params.ui.*`; oink reads the effective configuration
  through the embedded Hugo to decide which services to run.

Production reads the `oink.yaml` committed on the skin ref, so a change of publishing policy is also
reviewed and committed. Secrets come only from environment variables; deployment settings such as the
listen address and data directory can be overridden on the command line.

```yaml {title="oink.yaml"}
origin: https://docs.example.com
skin: main
versions:
  tags: '^v(?P<line>\d+\.\d+)\.(?P<patch>\d+)$'
  branches: { devel: main }
  default: latest
  url: '/v{label}/'
access:
  - path: /internal/**
    allow: [role:staff]
previews:
  refs: refs/heads/*
  origin: https://preview.docs.example.com
  allow: [role:maintainer]
accounts:
  providers: [github] # secret: OINK_GITHUB_CLIENT_SECRET
comments:
  moderation: first-post
media:
  - url: /media/
    dir: /srv/media
```

## Output, accessibility and security boundaries {#boundaries}

- **Output**: HTML stays semantic-first and progressively enhanced. The server splices the version menu
  and banners, so they work without JavaScript; reader slots are absent without JavaScript and the page
  stays complete. Print, Markdown and LLMS outputs are generated per version, and `llms.txt` lists the
  versions; RSS comes from the default version only.
- **Accessibility**: new interface (the dynamic form of the version menu, banners, sign-in, comments, page
  views, error pages) follows the theme's component rules, has strings in all 32 locales, and passes the
  documentation site's axe checks.
- **Build isolation**: production builds only refs that match the configuration; previews are served from
  a separate host name and built under the tightened policy; child processes have timeouts and memory
  limits.
- **Sessions and endpoints**: cookies use the `__Host-` prefix with `HttpOnly`, `Secure` and
  `SameSite=Lax`; write endpoints check `Origin`; comments are sanitized on the server; the server sets the
  CSP.
- **Management**: management commands use only the local socket in the data directory; `/_oink/metrics` is
  open to localhost or administrators only.
- **Privacy**: page views collect nothing that identifies a person and use no cookie.

## Theme coordination {#theme-coordination}

To give one site the same experience in plain Hugo, `oink dev`, `oink serve` and a `.oink` package, the
theme has to make the changes below. "Today" comes from a read-only survey of the theme's working tree on
2026-11-28; paths are relative to the theme repository root. Under the theme's rules, each item ships with
its owning checker, strings in all 32 locales and the bilingual contract. Stage one depends only on
T1–T4; with version slots (T5), a new release no longer rebuilds old versions.

### Before stage one (M1–M2) {#theme-stage-one}

- **T1 An embeddable theme module.** Today: the root has no Go file, and `go.mod` declares
  `module github.com/pgsty/oink` with `go 1.27.4`. Change: add an `embed.go` of a few lines that exports
  the module files as an `embed.FS` with `//go:embed all:layouts all:assets …`. The binary takes the theme
  from the same module zip Hugo downloads, the binary repository keeps no second copy, and plain Hugo
  users see no difference.
- **T2 The cost of the sidebar and pager.** Today: the sidebar is rendered into every shell page; at
  `sidebar_cache_limit` (500 pages) the whole tree is `partialCached` and its active row is set in the
  browser. The sidebar's share of page bytes measured 31% on oink.pgsty.com (51 KB of 163 KB) and 63% on
  pigsty.io (203.5 KB of 313 KB, a build from 2026-11-13). `pager-state.html` scans the whole reading
  sequence for every page. Change: publish the full navigation tree once per version as a fingerprinted
  file, inline only the current branch in each page, and compute prev/next from one precomputed index.
  Builds get faster and lighter, unchanged pages become byte-identical across versions so store
  deduplication actually works, and the roughly 10,000-page pgext depends on it.
- **T3 Error and status pages.** Today: only `404.html` exists; in production it says `index, follow`, and
  it carries no archive banner. Change: add 401, 403 and 503 (building) templates, all `noindex`, and give
  the 404 page a reader slot where the runtime lists the versions that have the path. Every page the
  server returns is rendered by the theme.
- **T4 Per-version edit links and indexing control.** Today: `actions/page-urls.html` builds edit and
  history links from `github_repo` and `github_branch` (default `main`), and the branch can be set per
  site, section or page; the robots meta tag depends only on whether the build is production
  (`head.html`) and has no `noindex` parameter; shortcut preferences and reading history are partitioned
  by the path of `baseURL` (`scripts.html`, `shell/history-dialog.html`). Change: oink injects
  `github_branch` per version (the line branch or the default branch), and the theme offers a switch that
  hides edit links for tag-only versions; add a build-level `noindex` parameter; partition local storage
  by site instead of version prefix, so readers keep preferences and history across versions.

### Stage two (M3–M4) {#theme-stage-two}

- **T5 Version slots and fragments.** Today: the version list is written at build time into the navbar,
  drawer and footer (`navbar.html`, `navbar-version-selector.html`, `shell/footer-line.html`) and into the
  command-palette JSON of every page, about 9 KB each (`actions/context.html`); the active entry and the
  path appended by `version_menu_pagelinks` (`content/version-url.html`) are decided at build time too.
  `canonical` is always `.Permalink` with no override (`seo-alternates.html`). At 500 pages,
  `sidebar-nav.js` finds the active sidebar row from `link[rel="canonical"]`, which breaks as soon as the
  canonical link points at another version. Change: mark the version menu, banners (404 included) and
  `canonical` with `<template data-td-slot>` and add fragment layouts that render on their own; have the
  palette and the `V` key read their options from the same fragment data; locate the sidebar's active
  row from the page's own URL; stop opening a new tab for an archive-banner link within the site. On
  static hosts the runtime fills the same slots from `versions.json`.
- **T6 A search backend.** Today: the local index is the resource `offline-search-index.<lang>.json`, with
  bodies split into a separate file above 2 MiB, and the page gives its base-prefixed path in
  `data-td-index-src`. There is no server backend: `initSearch` accepts `searchApi`, but the palette
  initializes itself, and `registerSearchTail` accepts only synchronous rows. Change: add a configured
  server backend (`/_oink/search`) with the local engine's result shape, version scopes, and CJK
  segmentation that matches the server. oink reads each version's local index files during ingest, so
  both backends search the same text.
- **T7 A comment provider.** Today: `comments.type` supports only `giscus` and warns on anything else
  (`comments.html`, `comments-state.html`); giscus maps threads by `pathname` by default, so one page splits
  into separate discussions under different version prefixes. Change: add an `oink` provider that renders a
  reader slot in the theme's own styles, and give giscus a version-independent page key on multi-version
  sites.
- **T8 The reader-slot runtime.** Today: there is no sign-in, user menu or page-view component, and the
  only analytics integration is Google Analytics. Change: add one stable `js/chunks/` target, loaded only
  on pages with oink services enabled, for sign-in state, page views and the versions that contain the
  page; every new string goes into the 32 locale files.
- **T9 Corpus shells and body markup.** Today: none. Change: provide a shell layout from which the fragment
  build writes whole-page shells with slots, and publish the body-markup contract that the HTML corpus
  renderer must emit (admonitions, tables, code blocks), so transformed bodies get theme styles directly.
  Until then the M0 prototype cuts its shell from one built OINK page.

### Later {#theme-later}

- **T10 Location-independent output.** Today: the theme tests subpath deployment (several checkers use
  `/preview/` as the base), has no hard-coded root-relative paths and uses relative paths in CSS; but
  `canonical`, hreflang, taxonomy-term links and share and copy links use absolute `.Permalink`, PlantUML
  and ReDoc chunks embed URLs at build time, NAVJSON and LLMS emit absolute addresses, and `relativeURLs`
  is unsupported. Change: let one output serve under any prefix, so aliases of Hugo versions can be
  served in place. Until then aliases use 302, and stage one is unaffected.
- **T11 Per-version machine outputs.** LLMS, NAVJSON and BookManifest carry absolute addresses and
  `baseURL`, so building them per version is enough; `llms.txt` gains a version list so that agents can
  find the other versions.
- **T12 Hugo's native version dimension.** The theme uses neither `site.Version`, `.Rotate` nor a
  versioned `sites.matrix` today. Whether small static multi-version sites get the native dimension is
  theme roadmap R2's decision; this proposal's slot contract should stay compatible with it.

### Process coordination {#theme-process}

- **Release order**: the theme is tagged → an oink release embedding it ships → sites update `go.mod` →
  deployments upgrade oink. The post-release adoption flow (`update-consumers.py`) gains a step: sites that
  use `oink serve` upgrade the binary too.
- **Contract ownership**: slots, fragments, `versions.json` and the corpus body markup are public theme
  contracts, written into the bilingual Design contracts with a version; oink detects the skin's theme
  release and falls back to stage one when slots are unsupported.
- **Configuration boundary**: the binary repository generates the schema of `oink.yaml` from its own types,
  outside the theme's `schema/site-params.schema.json`; `params.ui.*` stays in `hugo.yaml` only.
- **Checkers**: `check-shell.py` verifies slot markup and fragment layouts, `check-goldens.py` records the
  new HTML structure, `check-i18n.py` keeps the 32 locales identical, and the documentation site runs its
  browser suites through `oink serve`.

## Compatibility and migration {#compatibility}

- **Sites that do not use oink are unaffected.** The theme repository stays a pure Hugo module with no
  server code, and plain Hugo builds produce the same output.
- **Multi-site deployments that use `params.versions` can stay as they are.** After moving to
  `oink serve`, stage one has oink inject `params.versions`; a hand-written list in the repository is
  overridden with a warning.
- **Existing URLs stay.** The default version is served at the root; old versions that lived on
  subdomains can answer 301 to their new prefixes.
- **The `oink-cli` candidate retires.** Its still-useful checks (links, translations) move to
  `oink check`; the `oink.result/v1` result format, which has no users, is not kept. If this proposal is
  accepted, the [CLI contract](/docs/design/decisions/cli/) is marked superseded, and the version-lifecycle
  and platform stages of the CLI roadmap retire with it.
- **Revising an accepted decision.** The CLI contract requires calling an external Hugo, importing no
  private Hugo runtime, and creating no second route or navigation authority. The new design embeds Hugo's
  public command line, and routing and rendering inside one version still belong to Hugo; oink adds only
  two authorities: the version dimension and the import of external corpora.
- **Crib**: the `.crib` format does not change; Crib gains a reading mode for `.oink`, see milestone M5.

## Implementation and checker plan {#implementation}

- **Binary repository**: the new `oink` lives in its own repository (reuse `pgsty/oink-cli` or create one;
  see open decisions). A rough package split: `engine` (embedded Hugo, theme injection, child processes),
  `gitsrc` (ref resolution, worktrees, object reads), `render/hugo`, `render/html`, `store` (`.oink`),
  `serve` (routing, slots, caching), `search`, `state` (accounts, comments, counters) and `admin`.
- **Theme repository**: implement the items of [theme coordination](#theme-coordination) in priority
  order, each delivered with its owning checker and bilingual contract.
- **Documentation site**: once this proposal is accepted, add an `oink` user guide and contract page;
  `make browser` gains a Playwright suite whose pages are served by `oink serve`.
- **Checkers**: Go tests in the binary repository cover parity with plain Hugo output, a pgdoc subset
  benchmark, recovery after `kill -9`, ETags and cache headers, and access that does not leak; on the theme
  side `check-shell.py`, `check-goldens.py` and `check-i18n.py` cover the new markup and strings.

### Milestones {#milestones}

| Milestone | Scope | Exit evidence |
| --- | --- | --- |
| M0 prototype (about 2–3 weeks) | `oink serve --git pgdoc-cn`: HTML renderer, versions and aliases, store, FTS; the shell temporarily taken from one OINK page | All 560 versions reachable; store under 100 MB; latency targets met; no theme change |
| M1 single binary | `oink dev`, `build`, `check`, `hugo`; embedded theme (T1) | A machine with only oink and git previews and builds this documentation site, matching a build with the same Hugo release |
| M2 versioned serving | Hugo renderer, `oink.yaml`, atomic publishing, last good snapshot, rollback, status, webhooks; stage-one version interface; theme T2–T4 | A site with five or more tags goes live; bad commits stay out; recovery after `kill -9`; the version menu matches the static build |
| M3 search and slots | FTS5, page views, version slots, corpus shells; theme T5, T6, T8, T9 | A new release needs no rebuild of old versions; server search agrees with the local engine at the agreed rate |
| M4 accounts and comments | OAuth, roles, access, comments, preview host name; theme T7 | Protected content never reaches caches, other readers' search or exports |
| M5 packages and Crib | `.oink` compaction, signatures, `oink serve x.oink`, Crib reading mode | Byte-identical round trip; Crib opens every pgdoc version |

## Acceptance criteria {#acceptance}

1. On a machine with only `oink` and `git`, `oink dev` previews this documentation site and `oink build`
   produces the same output as plain Hugo with the same Hugo release and theme release (build timestamps
   aside).
2. `oink serve` serves pgdoc-cn: all 560 versions resolve; the store stays under 100 MB; serving starts
   within 2 s of a cold start; origin p99 latency stays under 5 ms on a hit and 10 ms on a cluster miss,
   and under 20 ms for the first transformation of a corpus page; the server's resident memory stays under
   512 MB, build children excluded.
3. After a new tag is pushed, its build starts within 90 s when polling and within 10 s with a webhook, and
   the pointer switches atomically after success; no page mixes old and new content around the switch.
4. On a Hugo site, a bad commit, a build timeout and `kill -9` neither replace nor lose a published
   snapshot; `oink rollback` takes effect within 1 s.
5. The same version menu renders identically from a static `params.versions` build and from `oink serve`
   (golden comparison); the documentation site served by `oink serve` passes the EN/ZH, desktop/mobile,
   light/dark and axe checks.
6. On a fixed corpus, the top ten results of server search agree with the theme's local engine at the
   agreed threshold, Chinese queries included.
7. Protected paths are invisible to anonymous readers and absent from the CDN cache, search results and
   `oink build` output; the preview host name carries no session cookie of the main site.
8. After `oink build -o x.oink` and `oink serve x.oink`, every URL returns the same bytes as the original
   server.

## Risks {#risks}

| Risk | Mitigation |
| --- | --- |
| Hugo's command line or output changes across releases | Pin the embedded Hugo; CI also runs the latest Hugo; the coupling is only flags and the output directory |
| Binary size (about 87 MB for Hugo, 36 MB of theme files) | Ship compressed archives; if needed, a slim build that downloads the theme on first use |
| Stage-one full rebuilds are too slow | Concurrency and priority control; an external sidebar (T2) shortens builds; stage-two slots (T5) remove these rebuilds |
| Old content warns a lot under the current appearance | `oink check --versions` reports per version; `skin: self` for an individual version when needed |
| The slot contract and the theme release disagree | Version the slot contract; oink detects the skin's theme release and falls back to stage one when unsupported |
| Online features expand the scope | No accounts or comments before M2; each feature is off by default and enabled on its own |
| Previews of untrusted branches | A separate host name, the tightened build policy, content only and never templates |

## Alternatives {#alternatives}

| Alternative | Conclusion |
| --- | --- |
| Static builds per version (the mike and Read the Docs approach) | Storage explodes (6.15 GB raw for pgdoc-cn; 808 MB per OINK version); old themes fail on new Hugo; the version menu forces full rebuilds |
| Hugo's native version dimension with every version in one build | Build cost and memory grow with versions times pages, 560 versions are not feasible, and every new tag rebuilds all versions; it suits small static sites and belongs to theme roadmap R2 |
| Forking Hugo, or calling `hugolib` in-process | A fork is costly to maintain; `hugolib` is not a stable API; in-process builds bring memory peaks and crashes into the server |
| A CMS that keeps everything in a database | Loses Git and Markdown as the authority, and the review workflow with them |
| Running Hugo per request to render one page | Hugo needs the whole site graph to render a page and cannot work page by page |
| Cloudflare Pages with Functions and D1 or Hyperdrive | Multi-version static trees hit per-deployment file limits; build time is limited; online features scatter across Workers. Keep Pages as a static target of `oink build` and Cloudflare as the CDN in front of `oink serve` |
| `.oink` as tar.zst, ZIP, a Git pack, or a custom ZIM-style binary | tar has no random access; ZIP compresses per file and is 12 times larger than clusters; a Git pack makes every reader implement Git and rendering; a custom binary needs its own parser and remains a second-stage option for remote Range reads |

## Open decisions {#open-decisions}

The default recommendation is in parentheses. Without an answer from the owner, the prototype proceeds on
the recommendation, which does not count as acceptance.

1. On acceptance, formally supersede the CLI contract and the related CLI roadmap stages, and retire the
   `oink-cli` candidate? (Yes)
2. Put the binary in the existing `pgsty/oink-cli` repository or a new one? (Reuse and rename it, keeping
   history)
3. Is the default skin the head of the default branch or the newest release tag? (The default branch)
4. Canonical links: do old pages point at the same page in the default version (this proposal) or at
   themselves (the CLI roadmap draft)? (The default version)
5. Is the default version served without a version number, or does every version carry a prefix? (Without)
6. Does line content default to the newest tag or to the head of the line's branch? (The newest tag;
   translation projects can switch to the branch)
7. Are comments shared across versions or kept per version? (Shared and labeled with the version)
8. Does the theme release strictly follow `go.mod`, or may the embedded theme override it? (Strictly)
9. The `.oink` codec: zstd with a decoder in Crib, or a codec Apple ships for packages built for Crib?
   (Measure first)
10. Does the first version support only a SQLite state store? (Yes; a PostgreSQL backend waits until
    pg.center needs several instances)
11. Does `oink` without a subcommand mean `oink dev` in a site directory? (Yes)
12. Should the theme support Hugo's native version dimension for static users? (Outside this proposal;
    theme roadmap R2 decides)

## Decision log {#decision-log}

| Date | Record |
| --- | --- |
| 2026-11-27 | The owner sets requirements for an online form: comments, users, access control, full-text search, page views and versions, covering pg.center, pgext and 500+ PG documentation versions, with Cloudflare preferred |
| 2026-11-28 | The owner proposes the `oink` binary, a Git-aware production mode, SQLite, `.oink` packages and Crib; deduplication, packing and rendering are measured on pgdoc-cn and the PG 18 site |
| 2026-11-28 | The owner says the existing `oink-cli` need not constrain the design and the requirements may be improved; this proposal is drafted |
