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

The theme repository has no embedded example site or npm workspace. Consumer
sites import `github.com/pgsty/oink`; the project site is one such consumer.

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
npm install
npm run serve
```

## Branch model

The theme repository uses:

- `main` for the next theme release;
- `release` for the current stable release and maintenance work;
- `vX.Y.Z` tags for immutable public releases.

The site repository uses:

- `main` for documentation and preview development;
- `deploy/prod` for the production documentation baseline;
- `doc-rooted` for the experimental doc-rooted variant.

Site-only changes do not require a theme release. Theme changes are first
validated against a local sibling checkout, released from the theme repository,
then pinned in the site's `go.mod`.

## Published site variants

A variant's identity comes from its configuration directory under `config/`:

| Site variant                | Publishing branch | Version params |
| --------------------------- | ----------------- | -------------- |
| [Latest release][prod-site] | `deploy/prod`     | `production/`  |
| Next                        | `main`            | `_default/`    |
| Doc-rooted (experimental)   | `doc-rooted`      | `doc-rooted/`  |

The production workflow builds directly from `deploy/prod`, uploads `public/` as
a GitHub Pages artifact, and deploys it through the Pages API. The `deploy/prod`
branch contains source only; the repository does not maintain a generated Pages
branch.

Pull request deploy previews use the Next configuration.

## Release workflow

1. Develop the theme on `main` and test it against the sibling site checkout.
2. Merge the release candidate to `release` and create the `vX.Y.Z` tag in the
   theme repository.
3. Update the site with `hugo mod get github.com/pgsty/oink@vX.Y.Z`, run its
   checks, and merge the resulting `go.mod` and `go.sum` changes.
4. Publish site updates by advancing `deploy/prod` from `main` when ready.

This keeps theme artifacts immutable and lets documentation deploy on its own
schedule.

[Oink project site]: <{{% param github_repo %}}>
[Oink theme]: <{{% param github_project_repo %}}>
[prod-site]: https://oink.pgsty.com
