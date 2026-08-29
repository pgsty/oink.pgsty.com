---
title: Starter repository tour
linkTitle: Repository tour
description: A file-level map of oink-starter — what owns identity, languages, home, content, navigation, brand, deployment, and the pinned theme.
weight: 20
search_keywords: [starter structure, repository tour, anatomy, hugo.yaml, content, data home, workflows]
aliases:
  - /docs/about/architecture/
---

This page describes the repository created from
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter). It is not a tour
of the much larger `oink.pgsty.com` documentation and regression repository.
The theme source is not copied into either site: `go.mod` pins it as a Hugo
Module, and Hugo stores the resolved source in the Go module cache.

## Top-level map {#layout}

```filetree {title="oink-starter/"}
- oink-starter/
  - hugo.yaml                         # identity, languages, outputs, parameters, module import
  - go.mod                            # site module and exact OINK release
  - go.sum                            # module checksums
  - examples/
    - hugo.single.yaml                # English-only complete profile
    - hugo.bilingual.yaml             # English + Chinese complete profile
  - data/
    - home/
      - en.yaml                       # one compact landing page per language
      - zh.yaml
      - fr.yaml
  - content/
    - _index.md                       # language home roots
    - _index.zh.md
    - _index.fr.md
    - docs/                           # Introduction, Get Started, Tutorial, Reference
    - blog/                           # posts, design records, release announcements
    - book/                           # sequential tutorial about the Starter
  - assets/
    - icons/logo.svg                  # processed project logo
  - static/
    - favicon.svg                     # copied unchanged to the site root
  - i18n/
    - fr.yaml                         # Starter-specific French interface overrides
  - .github/workflows/
    - github-pages.yaml               # strict build and GitHub Pages deployment
    - cloudflare-pages.yaml           # strict build and Cloudflare Direct Upload
  - README.md                         # operating summary for repository maintainers
  - LICENSE                           # template source license
```

Generated `public/`, `resources/`, `.hugo_build.lock`, and module caches are
ignored build state, not source.

## What to change first {#change-first}

| Path | Responsibility | Initial action |
| --- | --- | --- |
| `hugo.yaml` | Identity, canonical URL, languages, outputs, theme features, optional integrations | Change the two marked values; choose a language profile before other edits |
| `data/home/` | Home-page promise, cards, calls to action | Rewrite every enabled language after one language is approved |
| `content/` | All reader-facing material | Replace example leaves; keep a section root until deciding to remove that whole surface |
| `assets/icons/logo.svg` | Processed logo | Replace only with final artwork |
| `static/favicon.svg` | Browser icon | Replace together with the logo review |
| `params.github_*` in `hugo.yaml` | Edit/history/new-page/issue links | Uncomment only after the destination repository exists |

## What to keep {#keep}

- `go.mod` and `go.sum`: together they pin and verify OINK
  {{% param version %}}. Commit both.
- The three Goldmark settings in `hugo.yaml`: native Steps, Cards, Fields,
  image attributes, and Book targets depend on them.
- `outputs`: removing `markdown`, `LLMS`, or `print` intentionally removes the
  corresponding Markdown, agent-index, or print surfaces.
- `fetch-depth: 0` in workflows when `enableGitInfo` stays on: last-modified and
  contributor facts need repository history.
- `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` in CI: a developer's local
  workspace must not replace the published release being verified.

## Optional surfaces {#optional}

Docs, Blog, and Book are independent top-level surfaces. To remove one safely:

1. delete its `content/<surface>/` tree;
1. remove any home-page card or link that targets it;
1. confirm no other page links to it;
1. run a warning-strict build and inspect the remaining top navigation.
{.steps}

Do not delete only translated section roots: that creates language-specific
navigation and fallback behaviour that is difficult to distinguish from a
mistake. Remove a surface in all enabled languages or document the asymmetry.

The two configuration profiles under `examples/` are optional after the
language decision. They are useful references, but the root `hugo.yaml` is the
only active site configuration.

## Content and navigation {#content-navigation}

Under Docs and Book, directory structure and `weight` form the sidebar and
pager sequence. Top navigation comes from `menus.main` on section roots. A
translated root repeats the same `identifier`, `parent`, and weight while
translating visible labels.

The Starter intentionally demonstrates the Documentation System model:

- Introduction explains what and why;
- Get Started gets a new user to a result;
- Tutorial teaches an end-to-end task;
- Reference records exact supported behaviour.

Rename or reshape those sections for the project, but preserve the separation
between learning paths rather than mixing every kind of answer into one tree.

## Language model {#languages}

English source files end in `.md`; Chinese and French peers end in `.zh.md` and
`.fr.md`. Home data uses language keys under `data/home/`. The root profile
declares the languages, their locale, order, and site description.

The single and bilingual profiles keep disabled languages declared. This is
intentional: Hugo then recognizes the unused suffixes as translations instead
of rendering several files onto one English URL. Copy a profile only before
project-specific configuration begins; afterwards merge changes by hand.

## Where OINK lives {#theme}

Two files establish the module boundary:

```yaml {title="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: '{{< param hugoMinVersion >}}'
```

```go-mod {title="go.mod"}
module github.com/OWNER/PROJECT-DOCS

go 1.27.0

require github.com/pgsty/oink {{< param tdVersion.latest >}}
```

`hugo mod graph` shows the resolved version. Production follows the exact tag
in `go.mod`; a local `HUGO_MODULE_REPLACEMENTS` value is a development override
and must never be committed or treated as release proof.

## Deployment files {#deployment}

The GitHub Pages workflow runs automatically on pushes to `main`; repository
settings must select GitHub Actions as the Pages source. The Cloudflare workflow
runs manually, or automatically only after the repository variable
`CLOUDFLARE_PAGES_ENABLED=true` is set. Its required account ID and API token
remain repository secrets.

Keep only the workflows for deployment paths you operate. Cloudflare Direct
Upload and Cloudflare Git integration are alternative ownership models for the
same project, not two gates to run together.

## Safe customization order {#order}

1. Prove the untouched preview.
1. Change identity and select languages.
1. Replace one home page and then its translations.
1. Replace content and verify navigation.
1. Change brand and reader features one group at a time.
1. Enable complete external integrations.
1. Run the strict production build.
1. Deploy, then verify production independently.
{.steps}

Commit between layers when the repository is already yours. Small boundaries
make a later regression or rollback attributable to one decision.

## Verify {#verify}

```bash
hugo mod graph | grep github.com/pgsty/oink
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
git status --short
```

The module graph names the pinned release, the build emits no warning or error,
and Git status contains source edits but no `public/` or cache files. Then open
the enabled language roots and one Docs, Blog, and Book route before moving to
deployment.

## Related {#related}

- [Use OINK Starter](/docs/start/starter/) — the complete layered workflow
- [From scratch](/docs/start/from-scratch/) — add OINK without adopting this content model
- [Organizing content](/docs/write/organize/) — sidebar, pager, and menu authority
- [Configuration](/docs/customize/config/) — every current site parameter
- [Deploy](/docs/admin/deploy/) — host-specific setup and production checks
