---
title: Starter repository tour
linkTitle: Repository tour
description: Find the OINK Starter file behind each part of your site, what you can delete, and what the build depends on.
weight: 20
search_keywords: [starter structure, repository tour, anatomy, hugo.yaml, content, data home, workflows]
aliases:
  - /docs/about/architecture/
---

Every file in the [OINK Starter](https://github.com/pgsty/oink-starter) has one
job. Use this map to find the file behind a part of your site, to see what you
can delete, and to know what the build depends on. The theme itself is not in
the repository: `go.mod` pins it as a Hugo Module, and Hugo downloads it into
the Go module cache on the first build. To change these files in a sensible
order, follow [Use OINK Starter](/docs/start/starter/).

## Top-level map {#layout}

```filetree {title="oink-starter/"}
- oink-starter/
  - hugo.yaml                         # the only site configuration: identity, languages, outputs, features, theme import
  - go.mod                            # site module and the exact OINK release
  - go.sum                            # checksums that verify that release
  - examples/
    - hugo.single.yaml                # complete English-only configuration
    - hugo.bilingual.yaml             # complete English + Chinese configuration
  - data/
    - home/
      - en.yaml                       # one short home page per language
      - zh.yaml
      - fr.yaml
  - content/
    - _index.md                       # home page roots, one per language
    - _index.zh.md
    - _index.fr.md
    - docs/                           # Introduction, Get Started, Tutorial, Reference
    - blog/                           # post/, design/ and release/
    - book/                           # a four-chapter guide to the Starter
  - assets/
    - icons/logo.svg                  # project logo, processed by Hugo
  - static/
    - favicon.svg                     # browser icon, copied to the site root unchanged
  - i18n/
    - fr.yaml                         # French wording for a few interface strings
  - .github/workflows/
    - github-pages.yaml               # production build, then GitHub Pages
    - cloudflare-pages.yaml           # production build, then Cloudflare Direct Upload
  - Makefile                          # dev, serve and build shortcuts
  - .gitignore                        # keeps build output out of Git
  - AGENTS.md                         # build baseline and rules for coding agents
  - README.md                         # a one-page summary for repository maintainers
  - LICENSE                           # MIT; put your own copyright line in it
```

`.gitignore` already excludes what a build creates (`public/`, `resources/`,
`.hugo_build.lock`, and the `.hugo_cache/` module cache the workflows use), so
after a build `git status --short` lists only the files you edited.

## What to change first {#change-first}

| Path | Controls | First action |
| --- | --- | --- |
| `hugo.yaml` | Identity, canonical URL, languages, outputs, theme features, optional integrations | Choose the languages, then change the two values marked `CHANGE ME` |
| `data/home/` | The home page's tagline, cards and call to action | Rewrite one language, then translate it into the others |
| `content/` | Everything readers see besides the home page | Replace the sample pages; keep each section's `_index.md` until you decide to drop the whole part |
| `assets/icons/logo.svg` | The logo in the navbar | Replace once you have final artwork |
| `static/favicon.svg` | The browser tab icon | Replace together with the logo |
| `params.github_*` in `hugo.yaml` | Edit, history, new-page and issue links | Uncomment once the repository exists |

## What to keep {#keep}

- **`go.mod` and `go.sum`.** Together they pin the OINK release and verify its
  download, so commit both. Upgrade the theme in a commit of its own, which
  makes it easy to review and to revert.
- **The three Goldmark settings and `markup.highlight.noClasses: false` in
  `hugo.yaml`.** Steps, cards, field tables, image attributes and Book targets
  are written as Markdown attribute lines, and they render as literal text
  without these settings. See [the Goldmark prerequisites](/docs/customize/config/#goldmark).
- **`outputs`.** Removing `markdown`, `LLMS` or `print` removes the page's
  Markdown version, the `llms.txt` index for agents, or the print view.
- **`fetch-depth: 0` in both workflows.** The Starter sets `enableGitInfo: true`;
  with a shallow clone every page would show the same last-modified date.
- **`GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` in CI.** A Go workspace
  could otherwise replace the published theme release with another copy, and
  the site you deploy would not be the one you tested.

## Optional surfaces {#optional}

Docs, Blog and Book are independent parts of the site, and you can delete any
of them. Its menu entry lives in its own `_index.md` files, so deleting the
tree removes the entry too:

1. Delete `content/<part>/` with all of its language files.
1. Remove the home-page links to it from every `data/home/<lang>.yaml`. In the
   Starter, the hero's second button points to `book/` and the cards point to
   `blog/`, `docs/` and `book/`.
1. Search `content/` for other links to it and mentions of it; in the
   Starter, the Book's second chapter describes both `content/blog/` and
   `content/docs/`.
1. Build, read the warnings, and check the navbar in every language.
{.steps}

Remove a part in every enabled language at once. Deleting only one language's
section root leaves a menu entry and a sidebar in the other languages that
readers will take for a missing translation.

After you have chosen your languages, the two files under `examples/` are only
reference material. Keep or delete them; the root `hugo.yaml` is the only
configuration Hugo reads.

## Content and navigation {#content-navigation}

Under Docs and Book, folders and `weight` set the order of the sidebar and of
the previous/next links. The navbar comes from `menus.main` in each section's
`_index.md`: the Docs subsections declare `parent: docs`, which turns them into
the Docs dropdown. A translated `_index` repeats the same `identifier`,
`parent` and `weight` and translates only the visible title.

The Docs tree follows a common documentation model, with one kind of answer per
section:

- **Introduction** explains what the project does and why.
- **Get Started** takes a new user to a first working result.
- **Tutorial** teaches one complete task.
- **Reference** records exact, supported behavior.

Rename or reorganize these sections for your project, but keep the kinds of
answer apart: a reader looking up a flag should not have to read a tutorial to
find it.

## Language model {#languages}

English files end in `.md`, and their Chinese and French translations sit
beside them as `.zh.md` and `.fr.md`. The home page has one data file per
language under `data/home/`. The `languages` block in `hugo.yaml` sets each
language's label, locale, order, title and site description, and
`i18n/fr.yaml` adjusts the French wording of a few theme interface strings.

The two profiles under `examples/` keep the languages they disable declared,
so that Hugo still treats `.zh.md` and `.fr.md` as translations rather than as
extra English pages. [Layer 1](/docs/start/starter/#languages) of the
walkthrough explains how to choose a language set.

## Where OINK lives {#theme}

Two files connect the site to the theme:

```yaml {title="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

```go-mod {title="go.mod"}
module github.com/pgsty/oink-starter

go 1.27.4

require github.com/pgsty/oink v1.6.0
```

`hugo mod graph | grep github.com/pgsty/oink` prints the release a build
actually resolved. If your copy of the Starter pins an older release, follow
[Upgrade](/docs/admin/upgrade/).

The Makefile has three targets. `make serve` and `make build` run Hugo against
the release in `go.mod`, with any local replacement switched off. `make dev`
serves the site against a theme checkout in the sibling directory `../oink`
(change it with `THEME_DIR=…`), which you only need when changing the theme
itself; see [Developing against a local theme checkout](/docs/start/from-scratch/#local-theme-checkout).

## Deployment files {#deployment}

Both workflows install Go 1.27.4 and the latest Hugo, download the pinned theme
and run the same production build, then differ in where they publish:

- `github-pages.yaml` runs on every push to `main` and on demand. It builds
  with the address GitHub Pages assigns and publishes through the Pages API. It
  needs only **Settings → Pages → Source: GitHub Actions**.
- `cloudflare-pages.yaml` runs on demand, and on every push to `main` once the
  repository variable `CLOUDFLARE_PAGES_ENABLED` is `true`. It reads the
  account ID and API token from repository secrets, and the optional variables
  `CLOUDFLARE_PROJECT_NAME` and `CLOUDFLARE_SITE_URL`.

Delete the workflow for the host you do not use. For Cloudflare, a project uses
either this Direct Upload workflow or Cloudflare's Git integration, never both.
The setup steps are in [Build and deploy](/docs/start/starter/#build-deploy).

## Related {#related}

- [Use OINK Starter](/docs/start/starter/) — change these files layer by layer
- [From scratch](/docs/start/from-scratch/) — add OINK to a site without this content model
- [Organizing content](/docs/write/organize/) — how folders, `weight` and `_index.md` build the sidebar
- [Configuration](/docs/customize/config/) — every site parameter and its default
- [Deploy](/docs/admin/deploy/) — hosts, `baseURL`, and checking the live site
