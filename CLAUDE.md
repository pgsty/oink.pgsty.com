# Oink project-site guide for Claude

Read `README.md`, `TRANSLATION.md`, and `AGENTS.md` before changing this
repository. This is the public documentation site and the canonical integration,
browser, accessibility, responsive, and visual-review surface for the OINK theme.
Theme implementation belongs in the sibling `github.com/pgsty/oink` repository.

## Canonical Design records

`content/docs/design/` is the only canonical maintainer design tree. It contains:

- normative contracts at the section root;
- accepted rationale under `decisions/`;
- dated, non-normative evidence under `research/`; and
- active PRDs and RFCs under `proposals/`.

Create every new PRD or proposal as
`content/docs/design/proposals/<slug>.md` plus `<slug>.zh.md`, following the
published template at `/docs/design/proposals/`. Do not create a local `plan/`,
`plans/`, `proposal/`, or second design-document directory in either repository.
Publication is not proof of implementation: accepted behavior must also update
the theme implementation, its owning checker, and both language versions of the
affected contract. Preserve retired drafts in Git history and `CHANGELOG.md`.

## Content and validation

- English is primary; every public page needs a Simplified Chinese `.zh.md` peer.
- Keep paired heading order and explicit stable IDs aligned.
- Use an inline `HUGO_MODULE_REPLACEMENTS` value when testing a sibling theme
  checkout; do not create or mutate a workspace file.
- Run the smallest relevant `package.json` check, then `npm test` for the full
  non-browser suite and `npm run test:browser` for Playwright and axe coverage.
- Treat local-theme validation, a public theme release, and hosted deployment as
  separate completion states.
