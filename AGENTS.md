# Oink project-site guide

Start with `README.md` for this site's build and repository boundary, and
`TRANSLATION.md` for bilingual content rules. Public maintainer contracts,
accepted decisions, dated research, and proposals live under
`content/docs/design/`; this directory is their canonical bilingual source,
not a projection of a second theme-local document tree.

## Repository boundary

- This repository contains the documentation and regression site.
- Theme code belongs in `github.com/pgsty/oink`.
- This site is the canonical integration, browser, accessibility, responsive,
  and visual-review surface for theme development.
- The site imports the theme in `hugo.yml` and pins it in `go.mod`.
- Site configuration is a single root `hugo.yml`; there is no `config/`
  directory and no per-environment config overlay.
- For sibling-checkout development, set `HUGO_MODULE_REPLACEMENTS` inline for
  the command that needs the local theme; do not generate a workspace from the
  Makefile.

## Content conventions

- Keep English primary and add Simplified Chinese peers as `.zh.md` files.
- Follow `TRANSLATION.md` and the published Design contracts.
- Update both language versions of an affected Design contract in the same
  delivery as its theme implementation and owning checker.
- Preserve explicit stable heading IDs and verify them in rendered HTML.
- Keep changelog, upgrade guidance, current docs, and release messages focused
  on their distinct audiences.

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

Use the smallest relevant command from `package.json`; run `npm test` for the
complete non-browser site suite and `npm run test:browser` for Playwright and
axe coverage. A local build, a public theme release, and a hosted site
deployment are separate completion states.
