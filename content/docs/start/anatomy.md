---
title: Starter repository tour
linkTitle: Repository tour
description: Find the oink-starter files that control identity, languages, home, content, navigation, brand, deployment, and the pinned theme.
weight: 20
search_keywords: [starter structure, repository tour, anatomy, hugo.yaml, content, data home, workflows]
aliases:
  - /docs/about/architecture/
---

This page describes the repository created from
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter). It does not describe
the much larger `oink.pgsty.com` documentation and regression repository.
Neither site contains a copy of the theme source. `go.mod` pins the theme as
a Hugo Module. Hugo stores the resolved source in the Go module cache.

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
    - github-pages.yaml               # production build and GitHub Pages deployment
    - cloudflare-pages.yaml           # production build and Cloudflare Direct Upload
  - README.md                         # operating summary for repository maintainers
  - LICENSE                           # template source license
```

Generated `public/`, `resources/`, `.hugo_build.lock`, and module caches contain
build state. Git ignores them. They are not source files.

## What to change first {#change-first}

| Path | Responsibility | Initial action |
| --- | --- | --- |
| `hugo.yaml` | Identity, canonical URL, languages, outputs, theme features, optional integrations | Change the two marked values. Choose a language profile before other edits |
| `data/home/` | Home-page promise, cards, calls to action | Rewrite every enabled language after one language is approved |
| `content/` | All reader-facing material | Replace example leaf pages. Keep each section root until you decide to remove the whole surface |
| `assets/icons/logo.svg` | Processed logo | Replace only with final artwork |
| `static/favicon.svg` | Browser icon | Replace together with the logo review |
| `params.github_*` in `hugo.yaml` | Edit/history/new-page/issue links | Uncomment only after the destination repository exists |

## What to keep {#keep}

- `go.mod` and `go.sum` pin and verify the template's selected OINK release.
  Commit both. Record a later upgrade separately from this baseline.
- The three Goldmark settings in `hugo.yaml`: native Steps, Cards, Fields,
  image attributes, and Book targets depend on them.
- `outputs`: if you remove `markdown`, `LLMS`, or `print`, you remove the
  corresponding Markdown, agent-index, or print output.
- `fetch-depth: 0` in workflows if `enableGitInfo` stays on. Last-modified and
  contributor facts require repository history.
- `GOWORK: off` and `HUGO_MODULE_WORKSPACE: off` in CI. A developer's local
  workspace must not replace the published release under verification.

## Optional surfaces {#optional}

Docs, Blog, and Book are independent top-level surfaces. To remove one safely:

1. Delete its `content/<surface>/` tree.
1. Remove any home-page card or link that targets it.
1. Confirm that no other page links to it.
1. Run a build that keeps warnings visible for review. Inspect the remaining top navigation.
{.steps}

Do not delete only translated section roots. This creates language-specific
navigation and fallback behavior that can appear to be an error. Remove a surface in all enabled languages or document the asymmetry.

The two configuration profiles under `examples/` are optional after the
language decision. They are useful references, but the root `hugo.yaml` is the
only active site configuration.

## Content and navigation {#content-navigation}

Under Docs and Book, directory structure and `weight` form the sidebar and
pager sequence. Top navigation comes from `menus.main` on section roots. A
translated root repeats the same `identifier`, `parent`, and weight while
translating visible labels.

The Starter intentionally demonstrates the Documentation System model:

- Introduction explains what the project does and why.
- Get Started helps a new user achieve a result.
- Tutorial teaches a complete task.
- Reference records exact supported behavior.

Rename or restructure these sections for your project. Keep the learning paths
separate. Do not combine every type of answer in one tree.

## Language model {#languages}

English source files end in `.md`; Chinese and French peers end in `.zh.md` and
`.fr.md`. Home data uses language keys under `data/home/`. The root profile
declares the languages, their locale, order, and site description.

The single and bilingual profiles keep disabled languages declared. Hugo then
recognizes unused suffixes as translations. It does not render several files
to one English URL. Copy a profile only before you start project-specific
configuration. After that, merge changes manually.

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

require github.com/pgsty/oink v1.0.0
```

This example uses the tutorial's `137843b` Starter snapshot. It does not use
the latest OINK release. For a newer template, read its own `go.mod`.

`hugo mod graph` shows the resolved version. Production uses the exact tag
in `go.mod`. A local `HUGO_MODULE_REPLACEMENTS` value overrides it for
development. Never commit this override or use it as release proof.

## Deployment files {#deployment}

The GitHub Pages workflow runs automatically on pushes to `main`. In repository
settings, select GitHub Actions as the Pages source. The Cloudflare workflow
runs manually, or automatically only after the repository variable
`CLOUDFLARE_PAGES_ENABLED=true` is set. Its required account ID and API token
remain repository secrets.

Keep only the workflows for deployment paths you use. For one project, choose
either Cloudflare Direct Upload or Cloudflare Git integration. Do not run both
as deployment checks.

## Safe customization order {#order}

1. Prove the untouched preview.
1. Select languages, then change identity.
1. Replace one home page and then its translations.
1. Replace content and verify navigation.
1. Change brand and reader features one group at a time.
1. Enable complete external integrations.
1. Run the production build.
1. Deploy, then verify production independently.
{.steps}

If you own the repository, commit after each group of changes. This lets you
identify the decision that caused a regression or needs a rollback.

## Verify {#verify}

```bash
hugo mod graph | grep github.com/pgsty/oink
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
git status --short
```

Confirm that the module graph names the pinned release. The build must emit
no warning or error. Git status must contain source edits but no `public/` or
cache files. Before deployment, open each enabled language root and one route
from each of Docs, Blog, and Book.

## Related {#related}

- [Use OINK Starter](/docs/start/starter/) — the complete layered workflow
- [From scratch](/docs/start/from-scratch/) — add OINK without adopting this content model
- [Organizing content](/docs/write/organize/) — sidebar, pager, and menu authority
- [Configuration](/docs/customize/config/) — every current site parameter
- [Deploy](/docs/admin/deploy/) — host-specific setup and production checks
