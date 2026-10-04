---
title: CLI acceptance snapshot, 2026-09-29
linkTitle: 2026-09-29 CLI acceptance
description: Executed Starter, real-site, offline, upgrade, and reproducible-archive checks for the local CLI candidate, with final acceptance and publication kept separate.
weight: 60
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, acceptance, Starter, offline, reproducible build, upgrade, local candidate]
design_kind: research
design_status: locally-validated
last_verified: 2026-09-29
---

> [!IMPORTANT] Local implementation and acceptance completed
> The local `0.1.0-dev` implementation passed the checks recorded here. The CLI
> source is committed as `e623d93`; public publication, downstream adoption,
> and production deployment remain separate and have not been performed.

## Inputs and method {#inputs}

The CLI lives in the independent `oink-cli` Go repository. Its accepted
boundary is the [CLI and result contract](/docs/design/decisions/cli/), with
reproducible user steps in the [usage guide](/docs/start/cli/). Hugo remains an
external renderer; generated sites contain normal Hugo inputs.

| Input | Observed baseline |
| --- | --- |
| Host | macOS, `darwin/arm64` |
| Go | `go1.27.1` |
| Hugo | `0.166.0+extended+withdeploy` |
| CLI | `0.1.0-dev`, local commit `e623d93d589c49e5c58b8fae1bd5db720fc904cb` |
| Embedded Starter | Commit `137843b25bacd76ddd1f7ce71330bf2e3155b954`, complete licensed Git archive |
| Generated theme pin | Public `github.com/pgsty/oink v1.1.0`, with recorded Go checksums |
| Documentation-site theme | Local theme HEAD `b0af631` plus uncommitted changes; this is not the public module's byte identity |

The Starter archive hash is
`e55bde279715f6d8d19d3d88671a2cf7561b515be46915b0f12c640d0ce1d958`.
Its recorded projections select an existing language profile, pin OINK v1.1.0,
and set `enableGitInfo: false` for a new directory. The last projection was
required by an observed failure: the original `enableGitInfo: true` caused a
warning-strict build to fail before the site's first Git commit. No Git
repository or commit was created to hide that failure.

Checks used disposable source copies, module/render caches, and output
directories. Original Starter and consumer source trees were not written by
the CLI checks. Existing unrelated theme and documentation edits were retained.
Counts below are snapshots of those inputs and CLI revisions, not thresholds
that later documentation edits must preserve.

## Starter and ordinary Hugo {#starter}

All six ordinary-Hugo cases passed `--environment production
--panicOnWarning`, with provisioned modules and isolated caches:

| Language profile | Root URL | `/manual/` subpath | Reported Hugo pages |
| --- | --- | --- | --- |
| `en` | Passed | Passed | EN 90 |
| `en,zh` | Passed | Passed | EN 91, ZH 89 |
| `all` | Passed | Passed | EN 91, ZH 89, FR 89 |

The tests checked expected language roots and representative Docs, Blog, and
Book outputs, and compared generated source bytes before and after Hugo.
The public CLI's `init` command also passed separately for all three profiles,
with zero diagnostics and 94 generated source files per profile. The three
profiles differ in the selected root configuration; untranslated sample files
remain in the snapshot and are disabled through the existing profiles.

Starter package unit, race, and vet checks passed. Its failure cases exercise
nonempty and symlink targets, validation failure, target replacement after
planning, cancellation rollback, concurrent modification/deletion, and archive
path rejection. The regeneration script reproduced the fixed archive,
provenance, and license exactly.

## Real-site inspection snapshot {#sites}

Each run below returned CLI exit `0` with zero recorded diagnostics. Counts
describe rendered artifacts and inspected references; they are not counts of
authored pages or independent users.

| Site shape and theme source | Files | HTML files | References | Machine artifacts |
| --- | ---: | ---: | ---: | ---: |
| Three-language Starter, public v1.1.0, release check at `/manual/` | 316 | 142 | 7,042 | 6 |
| OINK documentation/regression site, local theme HEAD `b0af631` plus dirty changes | 1,127 | 506 | 72,562 | 8 |
| PIG project site, root Docs/Blog route rewrites, public v1.1.0 | 1,392 | 424 | 64,440 | 4 |
| Repository documentation with generated catalog, public v1.1.0 | 3,287 | 1,635 | 851,535 | 12 |

The last three are distinct local consumer repositories. PIG and the catalog
site validate published-pin resolution. The OINK documentation run validates
the explicitly selected local theme changes; it cannot be substituted for a
public-pin or deployed-site acceptance result. Source instructions were read
before these read-only pilots.

The inspection covered the implemented HTML link/anchor/resource and emitted
machine-artifact checks. It did not execute JavaScript, check external URLs,
inspect hosting redirects, or perform browser, accessibility, and visual
acceptance. The completed Hugo manifest enumerated 261, 766, 662, and 3,192
output declarations respectively. Every supported enabled machine output was
required by its actual language and URL. Before/after manifests compared all
tracked and non-ignored untracked source bytes, modes, and Git status: unchanged
for all four sites (94, 415, 858, and 2,294 source files respectively).

Two real regressions were fixed during this work. A NAVJSON template that
rendered only English had previously hidden the missing Chinese output; it now
returns policy exit `1` with the missing output location. PIG's intentional
`build.render: link` sidebar entries were initially mistaken for missing pages;
Hugo's effective build parameters now exclude them, with direct and cascaded
regression cases. A paired build of the bilingual Starter also proved all 223
ordinary artifacts byte-identical before and after adding the isolated probe.

## Offline execution and upgrade {#offline-upgrade}

On macOS, a full `check` of an initialized bilingual Starter passed under
`sandbox-exec` with `(deny network*)`, after dependency provisioning. The
result was exit `0`, zero diagnostics, 223 files, 95 HTML files, 4,461
references, and four machine artifacts. A separate English `init` also passed
under the same OS-level network denial, returning exit `0`, zero diagnostics,
and the expected 94 generated files. These are executed network denial tests
for those operations, not Linux firewall tests or evidence for every possible
consumer's remote-resource workflow.

A cold-cache fixture requiring `example.invalid/oink-cache-miss@v0.0.1`
returned CLI exit `2` and retained Hugo's original
`module lookup disabled by GOPROXY=off` evidence. A missing dependency was
therefore reported as incomplete work, without silently enabling resolution.

A separate temporary site exercised a real public-module upgrade from v1.0.0
to v1.1.0. The original consumer was not used as a write target:

| Operation | Observed result |
| --- | --- |
| Preview | Exit `0`; candidate validated; `applied: false`; plan named only `go.mod` and `go.sum` |
| `--write --expect-plan` | Exit `0`; the matching plan was validated and applied |
| Repeat the same target version | Exit `0`; candidate validated; no proposed changes and `applied: false` |

Unrelated dirty `README.md` content and untracked `user-note.txt` survived all three operations. The preview and
write shared the same plan ID and before/after module-file hashes. This proves
the exercised single-site path; it does not establish vendor refresh or an
upgrade performed by an independent user. Replacement, workspace, dirty-file,
rollback, and failure-protection cases passed the final focused Go tests and
race run. Only `go.mod` and `go.sum` changed on write; backup manifests retained
original bytes. Preview and repeat executions preserved all source bytes.

Real thin-wrapper smoke tests also passed in a disposable initialized site.
`build --json` returned `0` and produced `index.html`. `dev --json` served HTTP
200, forwarded SIGINT to Hugo, and closed the listener. Hugo exited `0`; the
cancelled wrapper reported `2` under the documented cancellation semantics.
These runs used provisioned local caches without `--network`.

Final `make test` (all packages plus vet), `make test-hugo` (ordinary Hugo,
workspace/config precedence, output manifest, missing-language regressions),
and `go test -race ./...` passed. All three public `init` profiles were rerun
under OS-denied networking; the cold dependency fixture again returned `2`.

## Archive and installation preparation {#archives}

One frozen CLI source snapshot produced four binary archives and one source
archive, plus `SHA256SUMS`. Rebuilding independently from the source archive
produced the same SHA-256 values for all five archives. The tested packaging
input hash was:

```text
b07c5b98ef787dfe9924ce7b50c57d018c6149ec493124bb0103551a01535547
```

This final snapshot supersedes the intermediate archive experiments. All five
archive checksums were verified and reproduced from the extracted source
archive. Both source and binary archives include the versioned JSON schema,
licenses, dependency pins, and Starter provenance. Local `make install` into
a temporary prefix and the installed binary's `--version` succeeded.

| Target | Evidence |
| --- | --- |
| `darwin/arm64` | Compiled; host binary executed; local installation path exercised |
| `darwin/amd64` | Cross compiled only; not executed on that architecture |
| `linux/amd64` | Cross compiled only; not executed on Linux |
| `linux/arm64` | Cross compiled only; not executed on Linux |

The archive builder records toolchain, flags, source-input hash, and platform
limits. It prepares local files only. There is no public download URL or
published installation tag established by this test.

## Reproduce the relevant checks {#reproduce}

From a CLI checkout with dependencies already provisioned:

```sh
make build
make test
make test-hugo
go run scripts/snapshot-starter.go --source ../oink-starter
```

To repeat rendered-site checks in the sibling layout, keep JSON and logs
outside each consumer's source tree:

```sh
oink_acceptance_dir="$(mktemp -d)"
mkdir "$oink_acceptance_dir/reports"
./bin/oink init "$oink_acceptance_dir/my-docs" --languages all
./bin/oink check --site "$oink_acceptance_dir/my-docs" --release \
  --base-url https://example.org/manual/ --json \
  > "$oink_acceptance_dir/reports/starter.json" \
  2> "$oink_acceptance_dir/reports/starter.log"
HUGO_MODULE_REPLACEMENTS="github.com/pgsty/oink -> $(cd ../oink && pwd)" \
  ./bin/oink check --site ../oink.pgsty.com --json \
  > "$oink_acceptance_dir/reports/docs.json" \
  2> "$oink_acceptance_dir/reports/docs.log"
./bin/oink check --site ../pig.pgsty.com --release --json \
  > "$oink_acceptance_dir/reports/pig.json" \
  2> "$oink_acceptance_dir/reports/pig.log"
./bin/oink check --site ../repo.pgsty.com --release --json \
  > "$oink_acceptance_dir/reports/catalog.json" \
  2> "$oink_acceptance_dir/reports/catalog.log"
```

On a macOS host providing `sandbox-exec`, after initializing a bilingual site:

```sh
./bin/oink init "$oink_acceptance_dir/my-bilingual-docs" --languages en,zh
sandbox-exec -p '(version 1) (allow default) (deny network*)' \
  ./bin/oink check --site "$oink_acceptance_dir/my-bilingual-docs" --json \
  > "$oink_acceptance_dir/reports/offline.json" \
  2> "$oink_acceptance_dir/reports/offline.log"
sandbox-exec -p '(version 1) (allow default) (deny network*)' \
  ./bin/oink init "$oink_acceptance_dir/offline-en" --languages en --json \
  > "$oink_acceptance_dir/reports/offline-init.json" \
  2> "$oink_acceptance_dir/reports/offline-init.log"
```

The [upgrade guide](/docs/start/cli/#upgrade) describes preview, plan review,
and explicit application. Use a separate review copy for write-path testing.
For the archive experiment, keep the same Go toolchain and release version:

```sh
make release VERSION=0.1.0-dev DIST=dist/first
mkdir -p dist/rebuild
tar -xzf dist/first/oink_0.1.0-dev_source.tar.gz -C dist/rebuild
make -C dist/rebuild/oink_0.1.0-dev_source release \
  VERSION=0.1.0-dev DIST=dist
cmp dist/first/SHA256SUMS \
  dist/rebuild/oink_0.1.0-dev_source/dist/SHA256SUMS
```

## Limits and delivery state {#limits}

| State | At this snapshot |
| --- | --- |
| Local implementation | Six first-stage commands and versioned result format exist |
| Executed validation | The runs described above passed for their recorded inputs |
| Owning checks and documentation-site `make check` | Passed after implementation and bilingual-document updates |
| Commit, tag, push | CLI committed locally as `e623d93`; no tag, remote, or push. Documentation changes remain local alongside existing work |
| Public CLI release or distribution | Not performed |
| Consumer source adoption or production deployment | Not performed by these checks |
| Independent-user study or adoption | No measured 4-of-5 / 15-minute study, retention, or independent-team adoption data |

Raw JSON, logs, source-preservation manifests, upgrade recovery evidence, and
archive-verification results are retained locally under the CLI checkout's
ignored `tmp/acceptance/`; archives are in `dist/first/`. They are local evidence,
not published downloads. No browser suite was run because this delivery changes
CLI behavior and prose, not theme presentation or interaction.

No Docsy conversion is implemented in this first-stage candidate. The pilots
above already use OINK and cannot validate arbitrary Docsy or MDX migration.
The [roadmap](/docs/design/proposals/oink-cli-roadmap/) retains bounded Docsy
assessment and later migration, theme descriptor, version lifecycle, OpenAPI,
MCP, and Studio as separate proposals. No future capability is accepted or
counted complete by this local evidence record.
