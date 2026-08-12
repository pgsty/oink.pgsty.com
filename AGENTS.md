# Oink project-site guide

The `content/project/` tree is authoritative for repository structure,
branching, CI/CD, and releases. Start with `content/project/build/git-repo.md`.

## Repository boundary

- This repository contains the documentation and regression site.
- Theme code belongs in `github.com/pgsty/oink`.
- The site imports the theme in `hugo.yml` and pins it in `go.mod`.
- Site configuration is a single root `hugo.yml`; there is no `config/`
  directory and no per-environment config overlay.
- For sibling-checkout development, use an ignored `go.work` and set
  `HUGO_MODULE_WORKSPACE=go.work`.

## Content conventions

- Keep English primary and add Simplified Chinese peers as `.zh.md` files.
- Follow `TRANSLATION.md` and `content/project/style-guide.md`.
- Preserve explicit stable heading IDs and verify them in rendered HTML.
- Keep changelog, upgrade guidance, current docs, and release messages focused
  on their distinct audiences.

## Validation

Use the smallest relevant command from `package.json`; run `npm test` for the
complete non-browser site suite and `npm run test:browser` for Playwright and
axe coverage. A local build, a public theme release, and a hosted site
deployment are separate completion states.
