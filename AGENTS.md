# Oink project-site guide

Start with `README.md` for this site's build and repository boundary, and
`TRANSLATION.md` for bilingual content rules. Public maintainer contracts,
accepted decisions, dated research, and proposals live under
`content/docs/design/`; this directory is their canonical bilingual source,
not a projection of a second theme-local document tree.

## Current baseline

As checked on 2026-10-04, `go.mod` and the advertised versions in `hugo.yml`
still pin the published theme `v1.1.0`. The working Design contracts and
`content/blog/release/1.2.0{,.zh}.md` describe unreleased theme work. CLI
documentation describes the separate local `0.1.0-dev` candidate. Recheck
those files and actual release state rather than treating drafts as delivery.

## Repository boundary

- This repository contains the documentation and regression site.
- Theme code belongs in `github.com/pgsty/oink`.
- The optional Go CLI and its native command, artifact, and workspace
  implementation/tests belong in `../oink-cli`. This site owns its public
  bilingual contracts, usage guides, and dated acceptance records.
- This site is the canonical integration, browser, accessibility, responsive,
  and visual-review surface for theme development.
- The site imports the theme in `hugo.yml` and pins it in `go.mod`.
- Site configuration is a single root `hugo.yml`; there is no `config/`
  directory and no per-environment config overlay.
- For sibling-checkout development, set `HUGO_MODULE_REPLACEMENTS` inline for
  the command that needs the local theme; do not generate a workspace from the
  Makefile or commit a filesystem module replacement.
- New consumer sites start from `pgsty/oink-starter`, not this documentation
  and regression repository.

## Content conventions

- Keep English primary and add Simplified Chinese peers as `.zh.md` files.
- Follow `TRANSLATION.md` and the published Design contracts.
- Update both language versions of an affected Design contract in the same
  delivery as its theme implementation and owning checker.
- Preserve explicit stable heading IDs and verify them in rendered HTML.
- Keep changelog, upgrade guidance, current docs, and release messages focused
  on their distinct audiences.
- Current CLI behavior belongs to `content/docs/design/decisions/cli{,.zh}.md`
  and `content/docs/start/cli{,.zh}.md`. The `cli-overview` page is a historical
  first-stage snapshot; proposal roadmaps are not the current command API.

## Design records and PRDs

- Put every new PRD, RFC, or design proposal in
  `content/docs/design/proposals/<slug>.md` with a matching `<slug>.zh.md`.
- Follow the lifecycle and template published at `/docs/design/proposals/`.
  A proposal is non-normative until implementation and acceptance are recorded.
- Put accepted rationale under `content/docs/design/decisions/` and dated,
  non-normative evidence under `content/docs/design/research/`.
- Do not create repository-local `plan/`, `plans/`, `proposal/`, or parallel
  design-document trees. Use Git history and `CHANGELOG.md` for retired drafts.
- When a proposal changes public behavior, update the theme implementation,
  owning checker, and affected English and Chinese contract in one delivery.

## Validation

Use the smallest relevant command from `package.json`. The five Make targets
select different theme sources:

| Target | Theme source and purpose |
| --- | --- |
| `make check` | Sibling `../oink`; complete non-browser site suite |
| `make browser` | Sibling `../oink`; Playwright and axe suites |
| `make dev` | Sibling `../oink`; fast, memory-rendered development preview |
| `make build` | Published pin; minified Hugo build |
| `make serve` | Published pin; production preview without fast/live reload |

Direct `npm test` and `npm run test:browser` do not select the sibling theme
themselves; use the Make targets for local theme acceptance. `build` and `serve`
do not clear inherited replacements or workspaces; use the published-pin
commands below to establish release identity. Node >= 24 and npm >= 11.16.0
are contributor test dependencies, not ordinary Hugo consumer requirements.
CI pins Hugo Extended 0.165.0, Go 1.27.0, and Node 24. Test configuration overlays
such as `tests/fixtures/browser.yml` do not change the single-root-config rule
for the production site.

For published-pin acceptance, disable environment replacements and both
workspace mechanisms, verify advertised/pinned versions, and build strictly:

```sh
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  npm run test:release-pin
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
```

`make check` uses a development build; `make build` alone is not warning-fatal.
Neither replaces the strict production gate above. Review changed Markdown,
LLMS, and favicon output before refreshing goldens; do not update expectations
merely to hide a failed check.

Use this site for rendered EN/ZH, desktop/mobile, light/dark, accessibility,
and interaction review. `A11Y_PATHS` restricts the sitemap scan; report that
scope explicitly. When `PLAYWRIGHT_BASE_URL` points to an existing server,
identify its module source and configuration instead of assuming the test
started the current checkout. CLI command checks remain owned by the CLI's Make targets.

Keep generated `public/`, `resources/`, `tmp/`, caches, and workspace files out
of Git. Preserve unrelated source edits. Local validation, commits, theme/CLI
publication, consumer adoption, and hosted deployment are separate states.
