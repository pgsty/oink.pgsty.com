---
downstream_modified: true
title: Git repository layout and branch model
linkTitle: Git repos and branches
---

## Repositories

Oink uses two focused repositories:

| Repository            | Responsibility                                    |
| --------------------- | ------------------------------------------------- |
| [Oink theme][]        | Published Hugo Module, layouts, assets, and i18n  |
| [Oink project site][] | Documentation, examples, regression tests, and CI |

The theme repository includes a deliberately small `exampleSite/` for checking
the theme checkout, but no project-site content or npm workspace. Consumer sites
import `github.com/pgsty/oink`; the independent project site is one such
consumer.

For local development, clone both repositories as siblings and connect them with
an ignored Go workspace:

```text
~/pgsty/
├── oink/
└── oink.pgsty.com/
```

```sh
cd ~/pgsty/oink.pgsty.com
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
npm ci
npm run serve
```

## Branch model

The theme repository uses:

- `main` for the next theme release;
- `release` for the current stable release and maintenance work;
- `vX.Y.Z` tags for immutable public releases.

The site repository uses:

- `main` as its only long-lived branch for documentation, previews, and
  production deployment.

Site-only changes do not require a theme release. Theme changes are first
validated against a local sibling checkout, released from the theme repository,
then pinned in the site's `go.mod`.

## Published site variants

The site has a single configuration file, `hugo.yml` at the repository root.
There are no per-environment config overlays, so [production][prod-site],
previews, and local builds all resolve the same parameters; the Hugo environment
(`-e`) only selects build-time behavior such as asset fingerprinting and
minification.

The production workflow builds directly from `main`, uploads `public/` as a
GitHub Pages artifact, and deploys it through the Pages API. The repository does
not maintain a generated Pages branch.

## Release workflow

1. Develop the theme on `main` and test it against the sibling site checkout.
2. Merge the release candidate to `release` and create the `vX.Y.Z` tag in the
   theme repository.
3. Update the site with `hugo mod get github.com/pgsty/oink@vX.Y.Z`, run its
   checks, and merge the resulting `go.mod` and `go.sum` changes.
4. Merge and push the reviewed site update to `main`; that push triggers the
   production deployment.

This keeps theme artifacts immutable and lets documentation deploy on its own
schedule.

[Oink project site]: <{{% param github_repo %}}>
[Oink theme]: <{{% param github_project_repo %}}>
[prod-site]: https://oink.pgsty.com
