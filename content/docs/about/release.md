---
title: Release process
weight: 50
icon: fa-solid fa-tag
description: Release the Oink theme and update its independent project site.
aliases: [/docs/oink/release/]
---

Oink treats implementation, validation, publication, and deployment as different
states. A green local build is useful evidence, but it is not a public tag, a
downloadable module, or a deployed documentation update.

## Release states

| State           | Required evidence                                                    |
| --------------- | -------------------------------------------------------------------- |
| Source complete | Scope, docs, changelog, attribution, and review are complete         |
| Validated       | Theme-module and project-site checks pass                            |
| Published       | An immutable root tag exists in `pgsty/oink` and resolves through Go |
| Documented      | `pgsty/oink.pgsty.com` pins and documents that tag                   |
| Deployed        | The hosted documentation and target consumers pass verification      |

Report the exact state and evidence; do not call a local build a release.

## Versioning

Theme releases use root tags such as `vX.Y.Z` in `github.com/pgsty/oink`. The
theme is now the repository's root module, so nested `theme/vX.Y.Z` tags are no
longer used.

The project site's `version` parameter identifies a published site variant and
is not automatically a Git ref. Installation instructions and `go.mod` must use
the actual resolvable theme tag.

## Validate the theme repository

From a clean `pgsty/oink` checkout:

1. inspect the source diff and attribution changes;
2. verify every `VENDOR.json` file and SHA-256 entry;
3. confirm the repository has no generated `public/`, resource cache,
   `node_modules/`, or embedded example site;
4. build a minimal consumer through the Hugo Module path with the minimum and
   current supported Hugo Extended versions;
5. inspect the module zip and confirm layouts, assets, translations, static
   files, licenses, and notices are present.

The module zip test matters because Go excludes special directory names such as
`vendor` from published modules. Oink stores bundled dependencies under
`assets/third_party/` so they survive module distribution.

## Validate the project site

Clone `pgsty/oink` and `pgsty/oink.pgsty.com` as siblings, then connect them
with an ignored workspace:

```sh
cd oink.pgsty.com
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
export HUGO_MODULE_WORKSPACE=go.work
npm ci
npm test
```

Inspect representative English and Chinese pages, mobile navigation, both color
modes, local search, print output, diagrams, API documentation, and `404` pages.
This validates the candidate against the site; it does not publish either
repository.

## Tag and publish the theme

After review, create one immutable signed root tag on the reviewed release
commit in the theme repository. OINK currently tags the reviewed `main` commit;
a maintenance branch is optional and must exist before documentation refers to
it:

```sh
git tag -s vX.Y.Z -m "Oink vX.Y.Z"
git push origin main vX.Y.Z
```

Pushing and creating a GitHub release require explicit authorization. After the
tag is public, verify it from a clean environment:

```sh
hugo mod get github.com/pgsty/oink@vX.Y.Z
hugo mod graph
```

If an offline archive is attached to the release, publish and independently
verify its SHA-256 checksum. Keep `LICENSE`, `NOTICE`, and `VENDOR.json` in the
archive.

## Update the project site

Once the theme tag resolves publicly, update the independent site repository:

```sh
hugo mod get github.com/pgsty/oink@vX.Y.Z
hugo mod tidy
npm test
npm run test:browser
```

The Pages workflow also runs `node scripts/check-release-pin.mjs`; deployment
stops if `params.version`, `tdVersion.latest`, and the exact theme requirement
in `go.mod` are not the same stable tag. Candidate testing can still use the
ignored sibling `go.work`, but that workspace is never publication evidence.

Commit `go.mod`, `go.sum`, version parameters, changelog, and upgrade guidance
together. Deploy previews first, then advance the production publishing branch
only after review.

## Post-release verification

After publication:

1. fetch the tag from a clean clone and inspect its signature;
2. resolve the module through the public Go proxy;
3. build a minimal new site with the documented commands;
4. open the production documentation and verify module instructions, canonical
   links, languages, search, and assets;
5. verify any released archive and checksum;
6. record the final tag, module version, hosted URLs, and artifact hashes.

## Hotfix and rollback

A hotfix follows the same evidence chain with a smaller scope. Never move or
replace a published tag. Roll back a site deployment to a known artifact, then
publish a new patch version of the theme when necessary.

## Definition of done

A release is complete only when the approved tag exists, the public module
resolves, required checks pass, the project site pins the tag, and hosted smoke
tests succeed. Anything less should be reported by its actual state.
