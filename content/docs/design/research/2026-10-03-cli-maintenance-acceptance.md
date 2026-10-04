---
title: CLI maintenance acceptance on 2026-10-03
linkTitle: 2026-10-03 CLI maintenance
description: Dated source and binary evidence for the R1–R8/A18 local implementation program, preserving its initial audit, failed trials, and final supported acceptance scope.
weight: 55
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] Historical source and binary evidence
> This record preserves earlier R1–R8/A18 acceptance. Command changes do not
> rewrite those results. The reduced CLI and its Cobra/text/JSON/YAML interface
> on 2026-10-04 are defined by the [current contract](/docs/design/decisions/cli/)
> and [guide](/docs/start/cli/). Earlier runtime qualification does not qualify
> a changed binary automatically.


> [!IMPORTANT] Finite implementation locally validated
> The initial audit is retained below. R1 implementation and owning checks
> have passed their local scope, including refreshed consumer reports and
> scoped rendered EN/ZH acceptance. R2's scoped local gate is also accepted,
> with a separately tested numeric-equality supplement. R3's runtime and
> paired documentation gates have passed and its local stage is accepted.
> R4 supported implementation and read-only corpus gates have passed locally;
> guarded canonical documentation validation is recorded separately below.
> R5 corrected implementation/read-only corpus and guarded canonical
> documentation gates have passed; its supported local scope is accepted.
> R6 explicit workspace and optional adapters passed frozen owning/runtime,
> exact-binary consumer and guarded canonical source/render gates; supported
> R6/A07/A15 scope is accepted locally. R7 read-only Studio/A16 also passed its
> browser, four-consumer and guarded canonical rendered gates. R8 reviewed
> editing/A17 passed its corrected frozen owning/browser, exact-binary consumer
> and guarded canonical source/render gates. R1–R8 supported scope is accepted
> locally. The 2026-10-04 supplement refreshes the changed backend and closes
> current A18 runtime/archive qualification for the three declared targets.
> Canonical lifecycle promotion/render has a separate exact-byte receipt boundary;
> public release, adoption and deployment have not occurred.

## Scope and evidence rules {#scope}

The [maintenance roadmap](/docs/design/proposals/oink-cli-maintenance-roadmap/)
defines the authorized R1–R8 scope. The [current CLI contract](/docs/design/decisions/cli/)
defines its compatibility baseline; the [original roadmap](/docs/design/proposals/oink-cli-roadmap/)
does not add Docsy migration, version lifecycle, OpenAPI, theme publication,
or the conditional E1–E4 extensions to this program. Hugo remains an external
renderer and generated sites remain ordinary Hugo projects.

Stages are accepted in dependency order. Every stage needs a complete usable
flow, its owning tests, relevant actual Hugo integration, known limits, a
reviewable diff, and accepted EN/ZH contract and guide updates. Passing an
aggregate command alone does not close a case. New public behavior moves from
the proposal into the owning contract only after its implementation and
acceptance evidence exist.

In the tables below, **existing, not rerun** means code or a named test was
inspected but its current runtime outcome was not established. **Partial**
means the first candidate provides a reusable part of the required behavior.
**Open** means new implementation or decisive acceptance evidence is missing.
**Passed**, **failed**, **unverified**, and **unsupported** must describe a
specific executed input and scope when later runs are recorded. No historical
result is relabeled as a current pass.

## Inspected inputs and tools {#inputs}

The initial 2026-10-03 audit read both repositories' instructions, the
documentation README and translation rules, both maintenance PRD languages,
the original proposal, the current CLI contract, and existing Go packages and
test names. It executed version and Git inspection commands only; it did not
run the owning suites or write consumer sources.

| Input | Observed initial state |
| --- | --- |
| Host and Go | `darwin/arm64`; `go version go1.27.1 darwin/arm64` |
| Hugo | `hugo v0.166.0+extended+withdeploy darwin/arm64`, Homebrew build dated 2026-09-09 |
| Node and npm | `v26.9.0`; `11.19.1`; contributor/documentation tools, not CLI consumer requirements |
| Git | `2.54.0 (Apple Git-157)` |
| CLI source | `e623d93d589c49e5c58b8fae1bd5db720fc904cb`, `main`; clean initial tracked/untracked status; generated `bin/`, `dist/`, `tmp/` ignored |
| Documentation source | `907d873eb05cfc2e194f492462dfa94849e93474`, `main`; 184 initial porcelain entries, including existing proposals, contracts, guides, and unrelated content changes |
| Embedded Starter | `137843b25bacd76ddd1f7ce71330bf2e3155b954`; provenance and license already recorded by `internal/starter` |
| Declared theme baseline | `github.com/pgsty/oink v1.1.0` in Starter and the three selected sites; effective resolved bytes still require each acceptance run |

The [2026-09-29 acceptance record](/docs/design/research/2026-09-29-cli-acceptance/)
contains historical first-candidate checks. It supplies useful reproduction
inputs, but does not prove the new maintenance scope. Existing dirty files are
preserved; this initial research addition does not accept or overwrite them.

## Stage requirements and implementation evidence {#stages}

| Stage | Required complete flow and invariants | Initial implementation evidence | Acceptance evidence still needed |
| --- | --- | --- | --- |
| R1 | Shared page identity, languages, publication state, source provenance, actual outputs, translations and observed references from Hugo; `oink.yaml` owns check policy only; links/translations/style share analysis; severity and exclusions cannot hide required incompletion; trustworthy locations | Partial: `internal/site` isolated snapshots and `Page.OutputFormats` probe, `internal/outputcheck`, `internal/report`; no shared translation/page facts or policy commands at initial audit | Real Hugo routes, aliases, mounts, unlisted/generated-source cases and language relationships; public focused-check/policy cases; required unknown/tool/build/input failures remain `2`; source locations only when reliable |
| R2 | Three language layouts; strict/manual and localized policies; duplicate, missing and draft states; explicit versioned review records bind source language and source/translation hashes; bounded native syntax rules; effective-theme coverage; visible versioned baseline; reviewed fixes validate before narrow apply | Open: no translation/review/native-rule/baseline public command at initial audit; rendered-reference checks remain reusable | A04–A07; valid/invalid reviewed content corpus; no mtime review inference; disabled/localized languages handled; acknowledged findings stay visible; missing required checks stay incomplete; fix preservation |
| R3 | Preserve thin default build/dev; `build --check` checks and manifests one strict Hugo output, exports only to new/empty target; digest/provenance manifest and optional minimal public identity; both local CI templates upload the same tree; release diagnosis; explicit-network public verification | Partial: direct wrappers, strict isolated checks and licensed workflow inputs exist; managed build/export, digest verification, CI plans and public verify are absent at initial audit | A08–A10; exactly one Hugo build; stale-byte rejection; revision/dirty/input/theme/tool/settings/coverage provenance without secrets or machine paths; workflow customization/conflicts/provenance and immutable source input; example address policy; fallback/language/resource/canonical/timeout/auth/rate-limit HTTP fixtures |
| R4 | `new`, snippets and editor setup create ordinary inputs without overwrite; docs/blog/book/project profiles compose one licensed Starter; upgrades provide readable diff and old/new routes, aliases and enabled outputs; unsupported migrations give manual action; existing protections survive | Partial: fixed archive language profiles and hash-bound single-site module upgrade with candidate validation, backups, dirty/workspace/replacement/vendor protection | A11–A12; all new profile/language combinations build with ordinary Hugo; unknown editor settings retained; upgrade route/capability regression and readable diff; source provenance and licenses retained |
| R5 | `inspect`, `impact --since`, bounded `context`, preview `move`; shared plans include touched files, diff, base hashes, translations, attachments, output/route changes and alias advice; candidate validation and stale/concurrent-safe recovery; ambiguous references require review | Partial: module-specific upgrade plan/apply primitives; no shared content plans or inspect/impact/context/move flow at initial audit | A13–A15; deleting B includes unchanged inbound A; translation/attachment/derived-output impact; uncertain/global changes force full checks; no content execution; candidate/stale/failed-write preservation and ambiguous-link handling |
| R6 | Explicit versioned site registry reuses single-site engine; per-site and aggregate completion; writes only to selected sites; configured preinstalled markdownlint/Vale/lychee adapters normalize findings and declare syntax/network coverage | Open: no workspace/adapter public command at initial audit | A07/A15/A18; direct/per-site parity; no sibling discovery, implicit installation or default formatting writes; required missing tool `2`, optional omission visible, external network uncertainty distinct |
| R7 | Read-only loopback Studio with overview, issues, translation comparison, page relationships and publication views; filters, known sources, actual Hugo preview, comparisons and copied actions; CLI parity; prebuilt assets; explicit allowlist, separate preview origin, Host/Origin/session protection | Open: no Studio server or assets at initial audit | A16; browser/keyboard/screen-reader/mobile/light/dark/long-list flows; same underlying results as CLI; unauthorized hosts/origins/sessions and preview-to-management requests rejected; Node unnecessary for consumer runtime |
| R8 | Markdown/text and front matter forms, selected components and collision-safe attachments reuse plans; authorized allowed writes with visible diff, hashes and candidate validation; no-op bytes and unknown fields/comments/order/encoding/whitespace retained; unsupported form syntax stays text | Open: editing follows accepted read-only R7; no editor API at initial audit | A17/A14; byte-identical no-op, surgical YAML field updates and text fallbacks; stale external-editor saves, traversal/symlink escapes and preview requests fail safely; attachments never overwrite; no management API in static publication |

## R1 local validation {#r1}

R1 now provides shared Hugo page/translation/source facts, rendered reference
and anchor evidence, strict `oink.policy/v1` input, `check links`,
`--format json`, visible reviewed exclusions/external scopes and required-work
precedence. Translation and style selections explicitly return required
unsupported coverage; they are not implemented engines. Default build/dev
remain direct Hugo operations. The following evidence accepts the tested
shared-facts/policy scope without closing R2–R8 or the full A01–A18 cases.

| Requirement | Executed evidence | Current outcome |
| --- | --- | --- |
| Public result/policy and incomplete precedence | `make test`: all packages and vet; public severity/exclusion/unimplemented-group/JSON-alias tests; `TestEveryRequiredUncompletedCoverageFails` | Passed R1 scope; any required uncompleted status, including `not_checked`, remains `2` |
| One build and shared facts | `TestPublicCheckSharesOneBuildAndRenderedFacts` | Passed; one strict Hugo build supplies page and observed target/anchor facts |
| Hugo authority and source mapping | Actual `TestPageFacts*` fixtures: translationKey, actual routes/aliases, unknown generated nodes, custom mounts, excluded-page analysis and failure preservation | Passed; separate analysis preserves production facts/artifact bytes and source bytes/modes |
| Repeatable real Hugo gate | Corrected `make test-hugo` includes `TestPageFacts*` and `TestHugoRendered*`, alongside Starter and manifest fixtures | Passed; scoped route/reference, reviewed external-scope and original-output preservation cases |
| Fresh Starter | Bilingual `init`, `check links`, ordinary strict Hugo using isolated provisioned v1.1.0 module archives | Exit `0`; 223 files, 4,461 references, 66 page facts; dependency preparation remains explicit |
| R1 documentation source and schema | Markdown style under `content/docs`; bilingual source checker; JSON parse and equality of CLI/docs result schemas; scoped diff whitespace check | Passed: 88 Chinese docs, 137/137 source pairs and 1,085 headings; schemas remain additive `oink.result/v1` with exits 0/1/2 |
| Final candidate reports and rendered EN/ZH | Refreshed current-binary consumer reports; actual rendered source/Markdown/link owning checks below | R1 scoped gate passed; existing draft-release omission in production is recorded separately |

Earlier offline R1 trials returned `0` without diagnostics on three consumers:

| Earlier trial | Source files | Built files | HTML files | References | Page facts | Bytes/modes/Git inventory |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK documentation | 421 | 1,139 | 512 | 74,689 | 341 | Exact before/after equality |
| PIG project site | 858 | 1,392 | 424 | 64,440 | 248 | Exact before/after equality |
| Repository catalog | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | Exact before/after equality |

These earlier reports spell optional unselected coverage `not_selected`,
outside the existing result-schema enum. The final code corrects it to
`not_checked` and includes `project.pages` coverage. Their measured counts and
exact inventories remain valid earlier-binary observations; final JSON
conformance is established by the final reports below. Raw evidence stays in task-named local
acceptance directories outside consumer sources. These trials do not prove
external availability, deployment, Linux runtime or translation/style acceptance.

The final R1 binary was rebuilt from the dirty CLI working tree based on
`e623d93d589c49e5c58b8fae1bd5db720fc904cb`. The recorded input inventory includes
file hashes, modes and Git-status identity. Its SHA-256, computed over sorted
JSON serialization, is
`518260f07f3c916468ee3d56c4eeca03c131514155aa82539564ccd2f3c1f664`.
The exercised binary SHA-256 is
`3deb7e357fc86f6907df60da0769d93f2d41ba5e01949b641548a67d7f459d12`.
This identifies local inputs and an executed binary, not a maintenance commit,
public archive or published module.

| Final current-binary trial | Source files | Built files | HTML files | References | Page facts | Acceptance |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK documentation | 421 | 1,139 | 512 | 74,755 | 341 | Exit `0`, valid result, complete page facts, exact source bytes/modes/Git preservation |
| PIG project site | 858 | 1,392 | 424 | 64,440 | 248 | Exit `0`, valid result, complete page facts, exact source bytes/modes/Git preservation |
| Repository catalog | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | Exit `0`, valid result, complete page facts, exact source bytes/modes/Git preservation |

Each final result has `check.links: complete` and `project.pages: complete`,
both required. Unselected translation/style coverage is `not_checked`, optional.
The final offline `make test` and vet passed; the corrected actual-Hugo owning
target also passed. The recorded tools remain Go 1.27.1, Hugo Extended 0.166.0,
Git 2.54.0 on macOS arm64. The three exact before/after inventories were
independently compared while preparing this record.

Production output passed rendered Markdown and link checks. Its global
translation checker returned `1` solely because the pre-existing draft
`content/blog/release/1.2.0.md` / `.zh.md` pair is correctly absent from
production. The changed R1 pages rendered in both languages. A separate explicit
analysis build with `HUGO_BUILDDRAFTS`, `HUGO_BUILDFUTURE` and
`HUGO_BUILDEXPIRED` set to `true` passed all three owning checks: 137/137 paired
sources, 1,085 headings, rendered Markdown and rendered links. That view is
nonpublishable evidence for excluded sources; it never replaces production
output and does not change or publish the draft. No existing draft file was
modified to make the global production checker green.

## R2 local validation {#r2}

The local candidate now implements translation policy/status/diff/hash review,
syntax-bounded native content rules, visible reviewed baselines and shared
`oink.plan/v1` preview/validate/apply. Default `check` requires links,
translations and style. Production output and the explicit draft/future/expired
analysis are separate; the latter is not publishable. Stable behavior and
examples are in the [contract](/docs/design/decisions/cli/#translations) and
[guide](/docs/start/cli/#translations). The R2 local gate passed owning checks,
final frozen-input consumer reports and rendered bilingual documentation.
The exact exercised binary and the subsequent narrow equality fix are recorded
separately below; no public release or consumer write is implied.

| Requirement | Executed owning evidence | Outcome and limit |
| --- | --- | --- |
| A04 translation relationships/policy | Actual `TestHugoFilenameDirectoryAndTranslationKeyLayouts`; scope, duplicate/missing/disabled-language, draft, strict/localized and selected-constraint tests | Passed owning tests; no universal heading/code/localization parity |
| A05 explicit review and diff | Full byte hash/current/source/translation/both-changed, mtime-independent, unknown/unreadable/ambiguous and malformed-record tests; public status/diff/review preview/apply fixtures | Passed owning tests; review state is change evidence, not semantic judgment |
| A06 source boundary and provenance | Actual Hugo enabled/disabled canonical `title`/block attributes and configured passthrough fixtures; front matter/CRLF/BOM/shortcode/code/HTML tests; every public v1.1.0 source/license SHA verified | Passed owning tests; unsupported syntax remains incomplete and custom hooks remain outside catalog attestation |
| A07 baseline scope | Capture/visible acknowledgement/new finding/incomplete precedence and malformed-record tests; public baseline preview/apply fixtures | Passed R2 baseline scope; external tool adapter acceptance belongs to R6 |
| A14 shared metadata plans | Stale bytes/modes/existence/guards; edits during validation; exclusive commit collision; partial restore; later editor bytes/modes/deletion; old open inode write; new-directory children; confinement/identity/diff tests | Passed owning tests and vet; candidate/source overlap refused; later move/reference ambiguity remains R5 scope |
| Frozen runtime gates | macOS arm64 `make test`/vet, owning actual Hugo and focused race runs | Passed; logs `/tmp/oink-r2-frozen-go-gate.log`, `/tmp/oink-r2-frozen-hugo-gate.log`, `/tmp/oink-r2-frozen-race-gate.log`; final all-owning-package Hugo gate `/tmp/oink-r2-owning-hugo-final.log` explicitly includes configured passthrough |
| Bilingual documentation | Narrow source style/pairing/IDs, equal result schemas, scoped whitespace and actual production/analysis node checks | Passed scoped gate: 88 Chinese docs, 137/137 source pairs and 1,092 headings; production draft omission separately recorded below |

The frozen parser corpus at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-source-corpus-lqx25kwr/summary.json`
records parser input SHA-256
`a601200ec4fe275d2bd4baf11d4db7d46a2cc6f1674900c1fd801769e55d12de`.
Each scope parsed completely with zero findings. The core uses actual Hugo
site-source identities from the recorded configuration; supplemental Markdown
includes disabled/unpublished files and does not invent routes or relationships.
These captures precede the authorized R2 documentation edits.

| Corpus | Unique actual Hugo source files | Supplemental local Markdown | Source inventory files | Bytes/modes/Git |
| --- | ---: | ---: | ---: | --- |
| Starter | 52 | 78 | 97 | Exact before/after equality |
| OINK documentation | 272 | 274 | 421 | Exact before/after equality |
| PIG | 212 | 212 | 858 | Exact before/after equality |
| Repository catalog | 1,568 | 1,572 | 2,294 | Exact before/after equality |

Preliminary public-command reports at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-final-qu_zprps/summary.json`
used binary `c8d87e6d73d3101fefcb62c5d6845518573c02c400f474dc9f4603afafc774d5`
and CLI input inventory `d8a75be0e074365a4164b7aaaa27d82a1e844e04406a36c3dd6d39ff2b6e873f`.
They precede the final parser/doc freeze and are not final acceptance evidence.
The initial Starter invocation selected the enclosing evidence folder and
returned `2`; it was a validation setup error. Selecting its actual `site` child
returned `0`, with evidence in
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-starter-27vmi0w5`.

| Preliminary check | Exit | Page facts | Built files | References | Translation statuses | Outcome |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Correct Starter child | 0 | 66 | 223 | 4,461 | 28 | Complete; 97 source files/inventory unchanged |
| Documentation | 0 | 341 | 1,139 | 74,755 | 144 | Complete; 421 source files/inventory unchanged |
| PIG | 0 | 248 | 1,392 | 64,440 | 120 | Complete; 858 source files/inventory unchanged |
| Repository catalog | 1 | 1,572 | 3,287 | 851,535 | 788 | Completed policy check: 10,462 actual `HTML_ID_DUPLICATE` findings in existing merged-print output; 2,294 source files/inventory unchanged |

The repository catalog result is a completed finding outcome, not a passing
site or implementation failure. No policy was weakened and no consumer source
was changed. Informational review states remain visible.

The final frozen-input reports at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-candidate-6xzcs7fk/summary.json`
exercise binary SHA-256
`ff88b407a6cddb9007f94275c65a80ed4c9c4fd13f5e821f9b7a4a8973abaa56`
from CLI input inventory
`bd8c71b55250a89dc15c7534924bb82a5447d6f2628eba23c8cb3d864309ee9f`.
All four exact source byte/mode/Git inventories were independently compared
equal before/after. These reports supersede preliminary public-command trials:

| Final check | Exit | Source files | Page facts | Built files | References | Translation statuses |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Starter | 0 | 97 | 66 | 223 | 4,461 | 28 |
| Documentation | 0 | 421 | 341 | 1,139 | 74,825 | 144 |
| PIG | 0 | 858 | 248 | 1,392 | 64,440 | 120 |
| Repository catalog | 1 | 2,294 | 1,572 | 3,287 | 851,535 | 788 |

No final report has incomplete diagnostics. The repository catalog retains
10,462 actual merged-print `HTML_ID_DUPLICATE` findings and 788 informational
review states; the other sites retain informational unknown review states.
This accepts the tested checking behavior and source preservation, without
calling that catalog a passing publication.

Kept production docs at
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-2201601475/public`
passed rendered Markdown and links. Global translation checking returned `1`
only for the existing draft release `1.2.0` pair absent from production. The
separate explicitly nonpublishable draft/future/expired analysis at
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-3698773232/public`
passed all three node checks: 137 pairs/1,092 headings, 216 content pages/41,586
text nodes, and 347 pages/48,682 internal links/4,171 fragments. Evidence logs
are `/tmp/oink-r2-docs-production-{translations,markdown,links}.log` and
`/tmp/oink-r2-docs-analysis-{translations,markdown,links}.log`. Neither analysis
output nor authored draft replaced production or was published.

A final review identified optional `equal_fields` comparing JSON `7.0` with
YAML/TOML numeric `7` by representation. The narrow supplement now normalizes
decoded numeric values recursively to an exact rational number tag, preserving
strings versus numbers, map keys and array order. Tests cover decimals/exponents,
negative zero, integers beyond float64 precision, nested differences, source
byte preservation and required incompletion for unrepresentable values.
Actual-Hugo translation tests passed in `/tmp/oink-r2-numeric-translations-gate.log`;
all public maintenance actual-Hugo cases passed in
`/tmp/oink-r2-numeric-public-gate.log`; owning vet and whitespace checks passed.
Supplemental source SHA-256 values are:

| Source | SHA-256 |
| --- | --- |
| `internal/translations/check.go` | `24664377e14b4ae2fc554d0d7fde2ec33cc987707250e130fd88d9a25d5e1637` |
| `internal/translations/translations_test.go` | `f58f4a305fe9fe3f5500ddfcf85faf3cfa37d72f8c220a1cb16ce4ccfbddb74d` |

The frozen real-site reports and Linux qualification above/below predate this
supplement. Those sites configured no numeric equality constraint, so their
recorded outputs are unaffected and were not rerun for this narrow fix. Later
full runtime and archive qualification must refresh the subsequent source.
The evidence amendments here are authorized documentation writes after the
acceptance runs; their before/after preservation scope ends before this amendment.

A18 remains open. macOS arm64 is exercised; an attempted Darwin amd64 runtime
on this host failed with `arch -x86_64` / `posix_spawn: Bad CPU type in executable`
(`/tmp/oink-r2-darwin-amd64-gate.log`). This is unavailable host runtime support,
not a code failure or Darwin amd64 acceptance. No system installation was made.
Native Linux arm64 and Docker Desktop Rosetta-emulated Linux amd64 were both
actually executed with the same runtime/schema/license input SHA-256
`0f786df68ef3c4844c983a51595f79242d1cb1d2bf6c5b5eb7f2c6415fb8d861`.
Evidence is retained at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-a18-linux-ajbbnvki`
in `arm64-results`, `amd64-results`, `commands.json`, `candidate-inputs.json`,
`preparation.json` and `qualify.sh`. Each target passed 270 test/subtest cases,
with no failures and two optional external corpus/provenance skips: full
actual-Hugo `go test ./...`, vet, built CLI version/bilingual init/doctor/full
check/translation status and missing-Hugo exit `2` smoke. JSON stdout and source
byte/mode inventories were verified. Go 1.27.1 ran on Linux arm64; Hugo Extended
0.166.0 architecture assets were SHA-verified. This qualifies those source
runtime paths, not final archives or hosted CI. Darwin amd64 remains open;
cross compilation does not close it. Later stages and future command/adapter/browser
acceptance remain open.

## R3 local validation {#r3}

R3 adds managed `build --check`, `oink.artifact/v1` sealing/export/local
verification, explicit-network HTTP verification, release diagnosis and
guarded local CI generation. The default build/dev path remains ordinary Hugo.
The executed runtime and paired contract/guide gates passed; R3 is locally
accepted. Hosted CI and deployment were not executed.

| Requirement | Executed owning evidence | Outcome and limit |
| --- | --- | --- |
| A08 one checked artifact | Public fake/actual Hugo one-renderer tests; exact export, manifest/marker, post-check byte/mode/missing/extra/symlink tampering, failure/concurrency and source-preservation tests | Passed local scope; a failed/incomplete check cannot seal/export; local artifact verification does not rebuild |
| A09 both CI providers | Offline deterministic generation, pinned source/Hugo archives and action revisions; safe bootstrap archives; guarded public preview/apply/stale-input cases; actual-Hugo original-input binding | Passed local configuration scope; every existing generated target is refused and custom workflows remain unchanged |
| A09 upload identity | Both local provider rehearsals and `TestProviderUploadRehearsalPreservesActualSealedManifestIdentity` | Passed: one managed build, separate verification, then the same tree; GitHub tar includes the hidden marker, Cloudflare rehearsal receives that verified directory; no provider upload executed |
| A09 custom workflow diagnosis | Generated-plus-other-custom and standalone-custom/no-metadata public tests, actual-Hugo preview and owning vet | Passed supplement in `/tmp/oink-r3-ci-custom-owning-gate.log` and `/tmp/oink-r3-ci-custom-vet-gate.log`; each unrepresented workflow stays `unknown`, informational and optional `release.ci: not_checked`, including beside valid generated metadata |
| A10 deployed identity | Local HTTP fixtures for all recorded files/routes/languages, marker, canonical/base/inert-template behavior, HTTP 200 fallback, wrong bytes/language/build, missing resources/Markdown/search JSON | Passed local fixture scope; definite mismatches return `1`; browser JavaScript is explicitly unchecked |
| A10 unknown network state | Explicit network/credential refusal, timeout before headers/during body, authentication/rate-limit/server errors, required marker absence, bounded body/gzip and redirect/no-cookie fixtures | Passed local fixture scope; incomplete states return `2` with remaining requests unknown; no public deployment was contacted |
| Frozen runtime gates | Full tests/vet, owning actual Hugo and focused race checks | Passed on macOS arm64 in `/tmp/oink-r3-frozen-go-gate.log`, `/tmp/oink-r3-frozen-hugo-gate.log`, `/tmp/oink-r3-frozen-race-gate.log`; the subsequent custom-CI change has the focused supplement above |

The latest single-binary corpus is retained at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-ci-final-ahc4csjk/summary.json`.
It compiled an exact captured CLI input copy, with binary SHA-256
`425845c1d2db7b1cd3c3cdb5f28475cb06ba6f656054909759e2359a39925dd2`,
67 runtime/schema/license inputs SHA-256
`6789a3a0235ff8d81453b9bfde37824979eac7d56af3710da390e4d2ef8479dc`,
and 108 broader CLI inputs SHA-256
`4ca473a4cb586d232baeb4cee029b281469c5bb03c831cc199b95451e6832c60`.
Runtime inputs remained exactly equal after all runs. Live tools were Go
1.27.1 and Hugo Extended 0.166.0 on Darwin arm64. The manifest's normalized
Hugo version excludes vendor build text and private paths.

Each run used offline `build --check` with fresh external destination/manifest
paths, the optional marker and retained isolated work. These existing local
consumer inputs were checked without `--release`; their configured workspaces
were preserved. Every raw report records exactly one strict Hugo renderer,
zero incomplete diagnostics and zero required unfinished coverage.

| Final managed build | Exit | Source files | Copied source inputs | Page facts | Built files | References | Exported files | Local artifact verify |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Starter | 0 | 97 | 94 | 66 | 223 | 4,461 | 224 | 0 |
| Documentation | 0 | 421 | 427 | 341 | 1,139 | 74,825 | 1,140 | 0 |
| PIG | 0 | 858 | 861 | 248 | 1,392 | 64,440 | 1,393 | 0 |
| Repository catalog | 1 | 2,294 | 2,299 | 1,572 | 3,287 | 851,535 | None | Not exported |

Both inventories compare exact bytes, modes and file types before/after; the
primary inventory also compares logical Git state. Git sites include tracked
and non-ignored untracked sources; the non-Git Starter includes its existing
generated files and lock. The supplemental copied-source inventory also
includes ignored workspace/editor metadata read by snapshots, excluding
existing generated output/cache trees. Counts alone are not the proof.
All four comparisons were exactly equal.

The repository catalog retains 10,462 existing merged-print
`HTML_ID_DUPLICATE` findings, so neither destination nor manifest was created.
This is a complete policy finding, not a passing publication or implementation
failure. Production review states number 28/143/120/786; analysis includes
unpublished pages, explaining the earlier R2 144/788 counts. Existing custom
workflow information remains visible, and Starter's example address is a
warning in this non-release run.

The three fresh exports match the retained independent ordinary-Hugo trees
in every original file's SHA-256, size and mode. The sole extra file is
`.well-known/oink-build.json`. Their original source inventories and complete
manifest input hashes match the earlier capture, so reusing those ordinary
trees does not substitute different inputs. The helper source SHA-256 is
`13e4957a3d7847eb28c8b1eeba3588a4f4a9982c2bfca2ebc729ab2827159607`;
its binary SHA-256 is
`b2699fe7a7aa3a34c41f9e4aba4b22d39cf8d0c156a369f3dfc4ca8c8c0fbce5`.
Raw helper and ordinary evidence are in
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-candidate-wb643dhh`;
the temporary compilation source was removed after building the helper.

Earlier R3 captures remain historical: the first capture preceded runtime
freeze; the first frozen capture at `oink-r3-final-pisrr21h` preceded custom-CI
diagnosis. An initial `/Users/vonng/pgsty/PIG` selection returned `2` because
that different repository is not the intended site; corrected
`pig.pgsty.com` passed. Those setup trials are retained, not relabeled as
candidate failures. This latest corpus supersedes their managed-build results.
The CI templates/bootstrap are independently authored from recorded primary
provider contracts; no provider implementation code was incorporated.

The scoped R3 documentation gate passed at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-docs-render-pljj5aqd/summary.json`.
Ten paired contract/guide/roadmap/index/overview edits were installed only after
matching their original bytes/modes; recorded hashes are at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-doc-drafts-s0b3g48l/applied-files.json`.
Source style passed 88 Chinese docs; translation coverage passed 137 pairs and
1,099 headings; schemas remained equal and scoped whitespace passed. Actual
production Markdown passed 214 pages/41,871 text nodes; links passed 345
pages/48,344 internal links/4,171 fragments. Production translations returned
`1` only for the unchanged draft release `1.2.0` absent from production. A
separate explicitly nonpublishable draft/future/expired analysis passed Hugo
and all three owning checks: 137 pairs/1,099 headings, 216 pages/42,177 text
nodes and 347 pages/48,720 links/4,199 fragments. All 421 canonical and 488
copied source files retained exact bytes/modes throughout these rendered
checks. Analysis was not published and did not replace production. This
acceptance amendment follows that frozen preservation boundary.

This gate does not claim hosted workflow execution, uploads, publication,
minimum-version combinations, browser behavior or current Linux/Darwin amd64
qualification. A18 remains open; historical Linux R2 results retain their
original source hash. Authorized bilingual evidence/contract/guide writes
occur after these preservation inventories and are outside their no-write scope.

## R4 authoring and upgrade acceptance {#r4}

The supported R4 implementation and read-only corpus scope are locally
accepted after frozen owning/full gates. This record covers profiles, ordinary
authoring/editor/snippets and bounded upgrade views. Guarded canonical
documentation promotion and fresh scoped rendered validation also passed as
recorded below; R5–R8 and final A18 qualification stay open.

| Executed profile evidence | Outcome and limit |
| --- | --- |
| One fixed licensed archive | Snapshot verification against commit `137843b25bacd76ddd1f7ce71330bf2e3155b954` passed without `--write`; archive SHA `e55bde279715f6d8d19d3d88671a2cf7561b515be46915b0f12c640d0ce1d958` and MIT license unchanged; projection metadata/script match |
| Composition and preservation | Default/explicit project byte parity; selected archived model/localized home, invalid profile, nonempty target, concurrent validation/publication and cancellation recovery tests passed; unit/vet/race gates passed |
| Ordinary Hugo | All four profiles × three language choices × root/subpath passed 24 actual warning-strict offline builds using provisioned public OINK v1.1.0; complete source byte/mode/no-extra-file and rendered-reference checks passed |
| Public init workflow | Four profiles with en/en,zh, actual subsequent root/subpath Hugo URL facts/checks, workflow/license preservation and default parity passed; unknown/nonempty refusals `1`, missing/failed Hugo `2`, empty/absent targets and pure JSON/separate logs verified |
| Public authoring and source identity | Actual candidate/apply/ordinary Hugo, review-unknown and source preservation passed in `/tmp/oink-r4-authoring-public-gate.log`; fresh-directory/site guards and vet passed in `/tmp/oink-r4-new-input-race.log` and `/tmp/oink-r4-public-core-vet.log`. Actual ignored input refuses `2` without a saved plan or source writes even when source groups are disabled; selected draft peers still force analysis identity in `/tmp/oink-r4-authoring-sourceproof-gate.log`. Supported owning scope passed |
| Bounded upgrade owning gate | Seven actual-Hugo synthetic pinned module-fixture cases, observed-stream digest/inventory fidelity, independent cross-page alias-retarget blocking, source/concurrency/exclusive installation and later-edit rollback protection passed under race; vet passed. Final hardening logs `/tmp/oink-r4-hardening-owning-gate.log`, `/tmp/oink-r4-hardening-final-focused.log`, `/tmp/oink-r4-hardening-vet.log`; final public/full frozen gates passed |
| Integrated authoring/editor hardening | Actual-Hugo language-directory plan/apply/ordinary builds, link/never new-source refusal, external schema/license/full-mode/module identity and legacy schema reproof, shared translation/baseline/CI regression and full Starter docs→new draft peer→editor→check→ordinary Hugo flow passed. `/tmp/oink-r4-app-authoring-hardening-gate.log` (58.241s), focused race and vet passed; post-candidate external mutation proof `/tmp/oink-r4-app-external-during-validation.log` passed. Opaque saved external-input hashes and canonical workspace-origin guards passed `/tmp/oink-r4-external-plan-binding-final.log`, `/tmp/oink-r4-workspace-origin-gate.log` and their vet logs. Frozen full-stage, corpus and scoped canonical rendered documentation gates passed |
| Actual language mounts | Standalone ordinary per-language contentDir and explicit site-matrix fixtures each passed config/mounts/strict-render with source bytes/modes unchanged; Hugo0.166 emits `sites.matrix.languages` and distinct physical files with reciprocal public translations. `/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-language-mounts-lgmve1sk/summary.json`; public actual language-directory plan/apply/ordinary-Hugo integration passed |

Owning evidence is retained at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-starter-owning-0pv41lw5/summary.json`.
Logs are `/tmp/oink-r4-starter-{unit,hugo,vet,snapshot,race}-gate.log` and
`/tmp/oink-r4-public-init-gate.log`, `/tmp/oink-r4-public-init-vet-gate.log`.
Generated source counts are project 94, docs 58, blog 40 and book 34. No Starter
checkout edits, release, consumer adoption or deployment occurred.


Final frozen gates all returned `0`: `make test`/vet
`/tmp/oink-r4-frozen-go-gate.log`, `make test-hugo`
`/tmp/oink-r4-frozen-hugo-gate.log` and actual-Hugo core race
`/tmp/oink-r4-frozen-core-race-gate.log`. The final public flow includes
Starter docs → primary/translation draft → editor → check → ordinary Hugo;
post-candidate external schema mutation still refuses before source writes.
Seventeen owning and three final gate logs are retained verbatim with hashes
in the final corpus's `owning-gates.json`.

The exact four-site evidence is
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-corpus-lw2cjyq6/summary.json`
with bounded `summary.compact.json`, raw JSON/logs and per-command inventories.
Binary SHA is `c169b3d4d046c811dca80867068b86fb66ada5c8ce6910dd5cda7353c406f377`;
82 runtime-input files bind SHA
`fdff7f50d49b44f03fa1db79eec6b6c9b9bd5e52f8967a88aed84b3207a7b3c6`,
which equals the final root inventory with no runtime changes. The broader
139 CLI inputs bind SHA
`562e838d9eccb628eac86ae59b9b9587c1e23ad52991ec50eafb1e604e3924da`.
Driver SHA is `d3ac41dc2e18295bfb26134d1a696935c8174913e2801a5766dbf7a1139d89f8`.
Actual tools were Go 1.27.1 and Hugo 0.166.0 Extended on macOS arm64.

| Frozen consumer | Primary/copied source files | Pages; output files; references | Managed build / artifact verify | Read-only upgrade / new / editor |
| --- | --- | --- | --- | --- |
| Starter | 97 / 94 | 66; 223; 4,461 | `0` / `0`; 224 exported files including marker | `0` / `0` / `0` |
| Documentation | 421 / 427 | 341; 1,139; 74,937 | `0` / `0`; 1,140 exported files including marker | `0` / `0` / `0` |
| PIG | 858 / 861 | 248; 1,392; 64,440 | `0` / `0`; 1,393 exported files including marker | `0` / `0` / `0` |
| Repository | 2,294 / 2,299 | 1,572; 3,287; 851,535 | Completed finding `1`; no export/manifest | Completed finding `1`; new/editor not attempted after blockers |

Each managed build used exactly one strict production Hugo render and had no
required incompletion or uncompleted required coverage. Primary Git-visible
source bytes/full modes/logical Git state, supplemental copied inputs and
source directory modes matched exactly before/after every command and each
complete site flow. Repo's `10,462` existing `merged_print` duplicate HTML IDs
remain visible; its completed finding is neither a passing artifact nor an
implementation failure. No policy or consumer inputs were adjusted.

Consumer upgrade previews selected the available public v1.1.0 pin and did
not apply writes. Cross-version route/alias/output regressions use explicit
synthetic fixture pins, not an invented published theme release. New/editor
plans were validated previews; no consumer plan was saved or applied.
Multi-host and unknown relative-alias identities stay incomplete. Nondeterministic
output may require a fresh v2 plan preview; browser/universal compatibility,
configuration migration and current cross-platform/archive qualification remain
outside this scoped result. The prior Linux R2 source hash remains historical;
Darwin amd64 and final A18 refresh are still unverified. Authorized bilingual
canonical writes occur only after this frozen no-write evidence boundary.

Fresh canonical documentation acceptance passed after the parent applied the
ten guarded files. Evidence is
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-docs-render-v01eima0/summary.json`;
the promotion manifest is
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r4-doc-drafts-3i8bw994/applied-files.json`.
The frozen `c169b3…` CLI performed one strict production render and its focused
link check returned `0`.

| Fresh canonical documentation gate | Executed result |
| --- | --- |
| Source owners | Translations `0`: 137/137 pairs and 1,104 headings; complete canonical style `0`: 137 Chinese files, 181 strong spans, no emphasis; ten-file whitespace check and public JSON schema equality passed |
| Production rendered Markdown/links | Both `0`: 214 content pages / 42,214 text nodes; 345 pages / 48,360 internal links / 4,187 fragments |
| Production translations | `1` solely for the pre-existing draft `content/blog/release/1.2.0.md` absent from production; no new pairing/heading finding |
| Separate nonpublishable analysis | Fresh ordinary Hugo with the actual original snapshot environment/rebased paths and explicit draft/future/expired flags returned `0`; all three owners `0`: Markdown 216 pages / 42,520 nodes, links 347 pages / 48,736 links / 4,215 fragments, translations 137/137 pairs / 1,104 headings |
| Source preservation | Canonical 421 Git-inventoried files and 427 copied inputs retained exact bytes, modes, Git state and directory modes; production copied 428 and analysis copied 427 files remained unchanged through their checks; analysis build also retained copied full modes |

Production output remained separate and was never replaced by the analysis
tree; the analysis is not publishable. The temporary helper copied the frozen
core without modifying it: helper source SHA
`7faea7e726a6c6fb2e0747be1a4428f4c5fb5734fa52b6f981157a5fe37d9989`
and helper binary SHA
`532638e76f96f8b173c122e512b3bf5fc2c4d4a7130f59c99c2c69e135e87073`
are retained with raw logs. This authorized bilingual research amendment
occurs after the exact no-write capture boundary and receives narrow source
checks separately. R4's scoped local documentation gate is accepted; this
result does not claim publication, deployment, R5–R8 completion or final A18
qualification.

## R5 implementation and documentation acceptance {#r5}

R5's supported local scope is accepted after focused public/core, corrected
frozen full-stage, exact-binary read-only consumer and guarded canonical
source/rendered documentation gates. The bounded outcomes remain explicit
below. R6–R8, workspace A15 and final A18 qualification stay open. The first
promotion and separately authorized post-render status/evidence amendment
retain distinct preservation boundaries.

The actual public Git/Hugo flow at `/tmp/oink-r5-public-final-flow.log` passed
in 53.963 seconds. Its committed synthetic site owns its local theme, bilingual
pages and binary attachment; ordinary modes `0640` and `0600` remain full
current facts while historic Git comparison uses executable bits only.
Deleting B selects unchanged inbound A, the remaining translation, removed
attachment and actual RSS output. Actual alias-inbound uncertainty, global
configuration/template/data and unknown-input changes expand full scope.

Completed inspect/impact/context returns `0` with separate current-check
findings `1`; check-since retains current quality `1` and full validation scope.
Missing/unborn/foreign history returns `2`, retaining every known current
page/attachment/reference/output with no fabricated prior identity or change.
Malformed selectors/limits, missing tools and failed renderer logs are tested.
Bounded context gives reasons/versions/source and excerpt hashes, visible
omission/truncation and no execution of literal document instructions.

Saved move preview/apply and subsequent ordinary Hugo passed, retaining
binary bytes, raw full modes, unrelated files and Git index/revision. Actual
opaque HTML/shortcode references remain manual; inline/fenced/opaque spans
stay unchanged. Their broken final candidate returns `1`, with no saved plan
or source writes. Source/config/attachment/mode/fresh-target drift returns `2`
and preserves the later edit. A deterministic mutation after the actual
candidate renderer also refuses before writes and preserves editor bytes/mode.
Focused actual move race passed in 8.286 seconds at
`/tmp/oink-r5-public-move-race.log`; app vet passed at
`/tmp/oink-r5-public-vet.log`.

Before the cached-module supplement, frozen parent `make test`/vet and
`make test-hugo` both passed at
`/tmp/oink-r5-frozen-go-gate.log` and `/tmp/oink-r5-frozen-hugo-gate.log`
(actual app fixtures 185.709 seconds). Actual move/source race and vet passed
`/tmp/oink-r5-move-hugo-gate.log`, `/tmp/oink-r5-source-move-race-gate.log`
and its vet counterpart; full inventory/mode/selector plan safety passed
`/tmp/oink-r5-plan-owning-final.log`.

A first frozen consumer trial exposed an actual cached-public-module guard
gap: resolved module inputs present in the original graph were absent from a
fresh outer candidate hash. It returned false incomplete `2`, without source
writes. Content plans now resolve/capture the same module inputs before
comparison, retaining legacy metadata/authoring plan scopes. The separate
checksum-verified public OINK v1.1.0 regression passed preview, fresh saved
apply and ordinary bilingual Hugo in 27.42 seconds (package 28.220) at
`/tmp/oink-r5-public-cached-module-move.log`, including raw modes, binary bytes,
unrelated inputs and Git preservation. Corrected current-binary corpus and
supplemental race evidence remain separate from the earlier unaccepted trial.

The corrected current candidate passed full `make test`/vet at
`/tmp/oink-r5-corrected-frozen-go-gate.log` and actual `make test-hugo` at
`/tmp/oink-r5-corrected-frozen-hugo-gate.log` (app 278.787 seconds). The
cached/public and committed/in-site move safety race passed in 38.578 seconds
at `/tmp/oink-r5-public-cached-seam-race.log`; its app vet also passed.

`/tmp/oink-r5-corrected-runtime-freeze.json` records 96 runtime inputs with
SHA-256 `e5b6e0eda972116dbb94a8086668e6ef34bfaa56138cf31f1f71f4832c477842`
and 165 broader CLI inputs with SHA-256
`4965a0c92cb6126f67a6dabd548c7c25ee5d7c9c57e14cce5e55ebb7a22fca2d`.
The corrected binary SHA-256 is
`d7675aecca2f77b1eb37bb4f664c3314cf5207149e6abbb86523686c5c50bff0`.
These are local working-input/executable identities, not a new commit or
published archive. The corrected four-consumer capture completed 16 commands
in 831.825 seconds at
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-corpus-corrected-y2eue81h`.
Its bounded `final-receipt.json` has SHA-256
`b86e0e6c7dbfbaed62c845c03a55d963068f7d9a16771de5ff3b0974e76fce3b`;
the receipt retains 12 copied owning gate logs, all 20 observed move routes
and links to the complete raw JSON/logs and per-move classifications.

| Site | Primary/copied inputs/directories | Inspect/context | Current check | Impact | Move preview |
| --- | --- | --- | --- | --- | --- |
| Starter | 97/94/21 | `0`/`0` | `0` | `2`: no Git baseline | `0`: validated, unapplied |
| Documentation | 421/427/109 | `0`/`0` | `0` | `0`: complete historical comparison | `1`: six candidate missing references |
| PIG | 858/861/52 | `0`/`0` | `0` | `2`: historical foreign-input provenance incomplete | `1`: 32 candidate missing references |
| Repository | 2294/2299/48 | `0`/`0` | `1`: 10,462 existing duplicate HTML IDs | `2`: unborn HEAD baseline unavailable | `1`: the same existing duplicate IDs |

Starter and Repository impact retain known current facts without inventing
prior pages or changes. PIG's actual baseline is complete (theme v1.0.0 versus
current v1.1.0), but required foreign-input provenance is incomplete, so the
comparison expands full scope and returns `2`. These are distinct outcomes.
Documentation impact completes with 192 captured input changes, 343 affected
prior/current pages and full scope. All completed fact queries expose current
quality findings separately; Repository inspect/context remain `0`.

Documentation move proves 18 rewrites and four routes. Two ordinary literal
`/docs/admin/comments/` occurrences in `content/docs/customize/repository.md`
at lines 216 and 313 remain manual because repeated source/output occurrences
cannot be attributed precisely across ordinary and print outputs. Their six
missing candidate references block validation. PIG moves two Markdown files
and four binary attachments, with eight proven page/processed-resource routes.
Equal-byte paired outputs prove processed `featured_hu_*` resources, but not
new URLs for the four original absolute image references
`/article/pgext-day/{featured,topic,venue,schedule}.webp`. Their 32 candidate
missing references block validation; no guessed original-asset rewrites occur.
These ordinary Markdown limits are separate from opaque HTML/shortcode limits.

Repository move proves ten rewrites and four routes; its candidate has only
the same 10,462 existing duplicate-ID findings, with no new missing reference
or required incomplete finding. Starter's zero-link bilingual move is
validated. All four moves remain unapplied, no consumer plans were saved and
no consumer source writes occurred. Failed candidates have `validated: false`.
All JSON stdout is pure. Primary/copied inputs, full modes, directory
inventories and logical Git/index state are unchanged; ignored copied inputs
are included. The Git metadata inventory excludes immutable object storage.
The runtime and broader CLI inventories still match the captured identities.
The receipt does not qualify another platform, browser runtime or deployment.

The first ten-file guarded canonical promotion was qualified in 62.37
seconds with the corrected frozen binary and runtime hashes above. The
separate rendered receipt is
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-docs-render-ks2tw82c/summary.json`,
SHA-256 `06ae844a4b3f1c01bb5faa8a21091d5461c28aab592d12c4310fb34bc176c5d4`.

| Canonical documentation gate | Executed result |
| --- | --- |
| Source owners | Translation `0`: 137/137 pairs, 1,109 headings; style `0`: 137 Chinese files, 181 strong spans, no emphasis; scoped whitespace and public JSON schema equality passed |
| Frozen CLI | Production `check links` returned `0` using the exact corrected binary |
| Fresh ordinary production Hugo | Build `0`; Markdown `0`: 214 pages/42,571 nodes; links `0`: 345 pages/48,376 links/4,203 fragments |
| Production translation owner | `1` only for the pre-existing draft release-1.2 omission from ordinary production output; no new R5 discrepancy |
| Separate ordinary analysis Hugo | Fresh nonpublishable `-DFE` build `0`, without the CLI probe; Markdown `0`: 216 pages/42,877 nodes; links `0`: 347 pages/48,752 links/4,231 fragments; translations `0`: 137 pairs/1,109 headings |
| Input preservation | All per-command and overall guards passed: 421 primary files, 427 copied inputs, 109 directories and 36 mutable Git files retained bytes/full modes/logical Git state; both isolated source copies remained unchanged |

The analysis tree did not replace production output and is not publishable.
The permanent first-promotion `applied-files.json` in
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-doc-drafts-t3_klnck`
retains the ten authorized files and their original modes. This separately
authorized post-render amendment touches only six paired proposal/index/research
files, after the recorded no-write boundary; the qualified contract and guide
bytes remain frozen. Its guarded originals, prepared diff and focused source
checks are retained separately. It does not retroactively claim these later
evidence bytes were in the earlier rendered capture, and no full corpus or
rendered rerun is inferred from the amendment.

Core owning logs `/tmp/oink-r5-frozen-core-hugo.log`,
`/tmp/oink-r5-owning-race.log` and `/tmp/oink-r5-owning-vet.log` passed.
A13 impact and A14 move safety passed their required supported CLI scope;
A15 bounded context passed, while workspace/direct parity remains R6 scope.
No consumer source write, commit, publication, network deployment, remote
model integration or incremental speed claim is made.

## R6 workspace and adapter acceptance evidence {#r6}

R6 supported scope is accepted locally after frozen owning/runtime, exact-binary
consumer parity/preservation and guarded canonical source/render gates.
The supported registry/tool fields belong in the
[contract](/docs/design/decisions/cli/#workspace-registry) and
[guide](/docs/start/cli/#optional-checkers). R1–R6 are accepted locally; historical
receipts remain intact. A07 adapter and A15 workspace/direct/context supported
scope passed the gates below; R7/R8 and final A18 remain open.

The registry is independently versioned `oink.workspace/v1`: strict one-document
regular YAML, 1–64 entries, at most 256 KiB, exact ASCII names, literal
relative/absolute directories, proven canonical identities and overlap
refusal. Missing-site results stay per-site incomplete while later selected
sites run. Selection preserves registry order; no default named site,
sibling discovery, Hugo settings duplication or automatic multi-site apply is
provided. Optional tools extend `oink.policy/v1`, with pinned protocol versions,
configuration/full-mode provenance and typed omissions/coverage.

### Workspace owning receipts {#r6-workspace-gates}

| Focused gate | Executed local evidence |
| --- | --- |
| Registry core | Strict fields/document/bounds/names/literal paths, existing aliases/case-inode ancestry, duplicate/overlap refusal, missing-directory listing and exact subset order; `go test -race ./internal/workspace -count=1` passed in 1.414 seconds, `/tmp/oink-r6-workspace-core-race.log` |
| Public actual Hugo | `OINK_TEST_HUGO=1 go test ./internal/app -run '^TestPublicR6Workspace' -count=1 -v` passed in 10.498 seconds, `/tmp/oink-r6-workspace-public-hugo.log` |
| Public race | The same workspace public suite with `-race` passed in 12.426 seconds, `/tmp/oink-r6-workspace-public-race.log`; excluded commands specifically reject registry selection |
| Vet | `go vet ./internal/workspace ./internal/app` completed with exit `0`, `/tmp/oink-r6-workspace-vet.log` |
| Public outcomes | Actual bilingual committed fixture sites retain direct diagnostics/coverage/exit parity for `links` and full checks. A missing first site yields `2` while later clean/finding sites yield `0`/`1`; explicit subsets preserve registry order, invalid unregistered siblings remain untouched and human output retains findings |
| Selected application | Saved translation-review preview is validated but unapplied; a different registered name is refused before writes and preserves plan/source bytes/full modes/Git. Explicit matching-name apply writes only its planned review file; other registered and unregistered sites remain unchanged |

These are owning fixture outcomes, not consumer adoption or permission to apply
plans to actual consumers. The inspected core `workspace.go` SHA-256 is
`cf2cbc9509e8c83eedf6d8833c9eb0ea6492de9a85c959798112fa3f105213f4`;
its owning test is
`9070a8e2c3e58680f6567f2394160ec682bf0457c068c2addf354921e7612d6b`;
the public test is
`3e57a6417ae2e7604f7cb06933759bb06a2f40758ff7059848593cedbaa6570a`.
All three inspected files retain mode `0600`. These owning source captures are
covered by the frozen all-runtime inventory below; their individual hashes do
not identify the exercised binary.

### Corrected protocols and stage gates {#r6-pending-gates}

| Protocol or gate | Recorded status |
| --- | --- |
| Actual markdownlint-cli `0.49.1` and Vale `3.24.0` | Corrected public trial passed: exactly one finding mapped to the original UTF-8/BOM/CRLF line; excluded front matter/shortcode/math/raw HTML/enabled attributes/code produced no false original attribution |
| Actual lychee `0.24.2` | Corrected trial actually reached the local HTTP fixture: `200` → `0`, `404` → `1`, `401`/`403`/`429`/`503`/timeout → required `2`. Optional offline → `0`, required offline → `2`, both with zero HTTP requests |
| Final focused actual-tool receipt | `/tmp/oink-r6-public-actual-tools-final.log` passed in 15.192 seconds; the earlier corrected 14.686-second run is retained as prior evidence. Node preload and discovered JS configuration did not execute; source full modes/Git were preserved |
| Fake/protocol failure receipt | `/tmp/oink-r6-public-fake-tools-final.log` passed in 13.089 seconds: malformed output, version mismatch, timeout, unsafe configs, required missing/optional/group omissions and raw stderr normalization |
| Focused public race/vet | `/tmp/oink-r6-public-tools-race.log` passed in 30.273 seconds across fake and actual cases; `/tmp/oink-r6-public-tools-vet.log` completed with exit `0` |
| Frozen runtime inputs | Parent freeze at `2026-10-03T10:58:01.807947Z`, `/tmp/oink-r6-runtime-freeze.json`: 103 runtime inputs bind `b85affd96378b45bfc56a996b0c5672d02ee4c6cc9bc95335fa5072f6c42a03b`; 179 broader CLI inputs bind `fbb8176ebc58f1aa26336f4e6036cf9bd5f7a0d62b142f16532b50a8071e9fbe`. The exercised `0.3.0-r6-local` binary SHA-256 is `aa8b347fbe01071f9da729f4d98aa2f50d7264456be6c5f05771bcfadadc371f` |
| Frozen owning suites | Full Go/vet completed with exit `0`, `/tmp/oink-r6-frozen-go-gate.log`; full actual Hugo plus pinned tools completed with exit `0`, `/tmp/oink-r6-frozen-hugo-gate.log` (app 382.832 seconds). Workspace/core/protocol/source-mask/policy/report race and vet receipts passed and are copied into the final receipt |
| Four consumer sites | Qualified: exact-binary direct/aggregate diagnostics, coverage, exit, identity and registry-order parity for all four sites; per-command/overall source byte/full-mode/type/logical and mutable Git/ignored-input/directory guards passed. Aggregate completed `4`, finding `1`, incomplete `0`, exit `1` |
| Canonical EN/ZH | Passed: guarded first ten-file promotion, source owners and fresh ordinary production/nonpublishable rendered evidence; only the known production draft-release omission remains |
| Stage decision | Supported R6/A07/A15 scope accepted locally after the required receipts; R7/R8/final A18 open; no public release, consumer source write, adoption or deployment |

The durable focused-tool receipt is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-tools-6bf67ltv/r6-public-tools-acceptance.json`,
SHA-256 `16b6e47fc0618c76d2f9e3680a4112b6e47b478af8aabd3f2fc84821f840cc8a`.
It binds the provision record, executable/configuration evidence and 1,422
resolved Node package files. Markdownlint reports original `content/tools.md`
line 7, `bytes[80:92]` (`ppears here.`); Vale reports the same line,
`bytes[71:78]` (`BADTERM`). Each of the seven network cases actually makes
one HTTP request. These records do not certify every transitive interpreter,
another runtime target or the full consumer corpus.

The exact-binary consumer receipt is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-corpus-59_asiyr/final-receipt.json`,
42,212 bytes, SHA-256
`0ad86afaf235bdcff0c474e76b08e0591591a7b22c7992b02e20fb17975d029e`;
the completed summary binds
`467b66eb6d178829508115050d4243909313acf1b4d59317ecda37ab7383ca55`.
It retains 14 copied owning/completion gate logs. The six original operations
sum to 314.912887 seconds, excluding candidate compilation and receipt-only
correction. `workspace list` returns `0`; four direct full checks return
`0`/`0`/`0`/`1`; the aggregate returns `1` with all four sites completed.

| Site | Preserved source files | Direct/aggregate child exit | Diagnostics/coverage | Recorded finding boundary |
| --- | --- | --- | --- | --- |
| Starter | 97 | `0`/`0` | 28/29 | Translation review information only |
| Documentation | 421 | `0`/`0` | 144/34 | Translation review information only |
| PIG | 858 | `0`/`0` | 120/41 | Translation review information only |
| Repository | 2,294 | `1`/`1` | 11,250/29 | Existing 10,462 duplicate-ID findings and 788 translation review information items |

Direct and aggregate child identities, order, every diagnostic and coverage
record match. All four consumer sources retain full modes/types, logical and
mutable Git metadata, ignored copied inputs and directory inventories after
every operation and overall; the complete root CLI inventory also still equals
its frozen capture. The 478,603,149-byte direct repository JSON and
635,470,795-byte aggregate JSON were validated streamingly rather than
truncated. Optional-tool protocols are qualified by their separate pinned-tool
fixtures; the consumer registry is task-local and writes no consumer policy.

The initial acceptance driver overwrote a summarized result's `command` string
with invocation argv, producing a false parity exception after all six CLI
operations and their per-operation guards had completed. The failed driver and
summary remain preserved as `pre-correction.r6_qualify.py` and
`pre-correction.summary.json`. Receipt completion corrected only invocation
metadata, verified unchanged raw-result SHA-256 values and header commands,
retained all original full-stream diagnostic/coverage digests, and rechecked
overall consumer/root guards. No CLI runtime correction or Hugo/CLI rerun was
needed. The receipt-only completion took 2.002 seconds and exited `0` in
`/tmp/oink-r6-corpus-receipt-completion.log`.

The executed driver SHA-256 is
`4d2a360c6f7f6f96c38698bd189bc4d4b2cb02a7509858920d752897fdd85988`;
the corrected driver is
`4870f5c0374fcc11ad1a6b2e3aefe36f493b6f9f4666c293993dc6a59df8a11b`;
the receipt-completion driver is
`cd50d3fe704370f73fa4e7d94ce8e4bc925d11ec8ef04d463aacec37c2053daf`.
The streaming helper binds
`144f778cdb7907372797b47b97f817f340e70423701a2a958dee589281a9a11c`,
and the inventory helper binds
`d3ac41dc2e18295bfb26134d1a696935c8174913e2801a5766dbf7a1139d89f8`.
This receipt qualifies local darwin/arm64 with Go 1.27.1, Hugo Extended
0.166.0, Node 26.9.0 and Apple Git 2.54.0. It does not refresh final A18,
qualify Darwin amd64 or another platform, apply a consumer plan, publish or
deploy. At corpus capture, canonical promotion and actual rendered EN/ZH owning gates
were separate pending work. The later receipt below closes that boundary; the
first-promotion bytes do not claim this post-render amendment retrospectively.

The initial actual-tool trial was preparation evidence, not a passed
qualification. It exposed Darwin `/var` versus `/private/var` staging identity,
actual loopback proxy routing, and an invalid inline-block-attribute/line
assertion in the Vale fixture. Staging is now canonical; the Vale fixture uses
a real standalone block attribute without changing the source-mask boundary.
The qualified child environment forwards literal `NO_PROXY`/`no_proxy` host-list
data while omitting proxy URLs/credentials and Node preload settings. Neither
an empty proxy environment nor `NO_PROXY=*` established the tested Darwin
loopback path; no universal operating-system proxy bypass is claimed.

Supported source diagnostics require proven original ranges; rendered lychee
locations remain output file/DOM pointers, with no inferred Markdown line.
Offline lychee is not invoked. Authentication/rate-limit/server/transport
uncertainty cannot become required success through severity, exclusions or
baseline acknowledgement. External fragments, browser execution and remote
content identity are not proven. The declarations, output envelope and
required-incomplete precedence remain independent from final platform/archive
qualification; Darwin amd64 and final A18 are still open.

The first guarded ten-file promotion and its fresh rendered qualification are
now complete. The receipt is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-docs-render-dcwtcmyl/summary.json`,
555,297 bytes, SHA-256
`ee153932900dc6f1ec62beef1a75927fc60b857efccfbcc558bf0e2c2b12cc04`.
The 64.17-second run used the exact qualified `aa8b347f…371f` binary and unchanged
103-input `b85affd9…a03b` runtime inventory recorded above.

| First-promotion documentation owner | Actual result |
| --- | --- |
| CLI production links | `0`; one strict production Hugo renderer, no analysis build |
| Ordinary production Hugo / Markdown / links | `0` / `0` / `0`; 214 content pages and 43,376 text nodes; 345 HTML pages, 48,438 internal references and 4,259 fragments |
| Ordinary production translations | `1` only for the existing draft `content/blog/release/1.2.0.md` absent from production; not a new R6 failure |
| Independent ordinary nonpublishable Hugo / Markdown / links / translations | All `0`; 216 content pages and 43,682 text nodes; 347 HTML pages, 48,814 internal references and 4,287 fragments; 137/137 pairs and 1,118 headings |
| Source owners / schema | Translation, style and whitespace all `0`; 137/137 pairs, 1,118 headings; 137 Chinese files, 181 strong marks, zero emphasis marks; CLI/documented result schema both bind `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda` |
| Preservation | All 12 owner commands, CLI/schema checks and overall comparison preserve 421 primary files, 427 copied inputs, 109 directories and 36 mutable Git files with full modes/types/bytes and logical Git; both private ordinary source copies and all 103 runtime inputs unchanged |

The first-promotion installer receipt,
`oink-r6-doc-drafts-ymjop499/applied-files.json`, binds
`13c965592d64056d8365aed1927d2d422fadec8adc54ee7050b22e2ea0ad6270`.
It retains captured actual original inodes in private temporary storage,
preserving later old-open-handle writes; recovery also preserves later target
edits or deletion. The subsequent paired status/evidence amendment has its own
full-byte/full-mode guards and source-owner receipt. It updates current notes,
command status and this ledger, preserving earlier receipts and configuration
examples. Its new bytes were not inputs to the 64.17-second rendered run, and
that run is not claimed as their rerender. Supported R6/A07/A15 is accepted
locally after these gates; R7/R8 and final A18 remain open. No duplicate corpus,
public release, consumer plan application/adoption or deployment is claimed.

## R7 read-only Studio candidate evidence {#r7}

R7 implements the embedded five-view browser and authenticated loopback API
candidate described in the [contract](/docs/design/decisions/cli/#studio) and
[guide](/docs/start/cli/#studio). R1–R6 historical sections and their exact
receipts remain unchanged. Frozen core/browser and exact-binary four-consumer
qualification and guarded canonical rendered gates passed within the declared
scope. R7/A16 supported read-only scope is accepted locally; R1–R7 are accepted. R8 editing and final A18 remain open.

### Focused native and browser evidence {#r7-focused-gates}

| Owning boundary | Evidence status |
| --- | --- |
| Native/public parity | Actual shared check reports preserve diagnostic/coverage/exit identity for `0`/`1`/`2`; explicit selected workspace startup, cleanup/signal and no-source-write proofs are recorded separately by the owning test receipts |
| HTTP management/source/preview | Literal-loopback selection; exact Host/origin/Bearer checks; no arbitrary request paths/writes; captured source/diff bounds and source-mode/output inventory guards; focused core/new browser and current corpus receipts below bind this supported scope |
| Initial held browser | 14 axe checks with zero violations and 14 screenshots; five desktop light views, captured BOM/CRLF source/diff, desktop dark, mobile dark and all five 320-pixel light views plus capture changes. Synthetic actual-Hugo fixture retains 228 native diagnostics and coverage parity; copied suggestions use a private test clipboard, leaving the host clipboard unchanged |
| Browser preview attack | Actual attack script executes in the isolated preview, but parent access, management fetch and popup are blocked; token query refused. Actual draft-only page remains production `404`. This proves the tested browser/CSP scope, not an OS network sandbox |
| Snapshot preservation | Captured source instructions/HTML stay literal data; the initial capture retains its old bytes before refresh after an explicit task-fixture external edit. Source full modes/Git/directories preserved except that declared fixture edit; changes show the actual modified captured input |
| Preceding held browser | Passed refreshed held UI/backend receipt: all 14 axe checks zero violations and 14 screenshots, including declared/captured theme rows. This predates the partial-preview runtime correction and does not qualify that new runtime |
| New partial-preview browser | Passed new frozen partial-preview runtime: 14 axe checks with zero violations and 14 screenshots; actual Hugo normal HTML `200` and 67,108,865-byte output `413`; native `1`/228 diagnostics and coverage retained, required partial coverage visible and Studio/refresh `2` |

Initial browser receipt:
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-AfwaYi/summary.json`,
SHA-256 `930fbd1ab86806069b963bff2e3e95aaa07e3634400cec65e2b8c7922e2a1707`.
Its exact binary binds
`92e5b962e40fbe828a0b006f3ae76a2bddf4ad7e8b1c5b6967e365b8f1827879`;
the subsequent declared/captured theme metadata row is not claimed tested by
that preceding binary. The qualified local versions are Node 26.9.0,
Playwright 1.62.1, `@axe-core/playwright` 4.13.0 and Chromium 151.0.7922.34.
These are explicitly prepared contributor dependencies, not consumer runtime
requirements or automatic installations. Clipboard evidence covers the actual
UI click with a private clipboard implementation, not the whole host clipboard.

The refreshed held UI/backend browser receipt is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-vn0ofb/summary.json`,
SHA-256 `520603779f712539865c6e9ef7a9ad3ad21ec1906adfb067ec607cc69d071b7e`,
with exact binary `73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`.
All 14 axe runs and 14 screenshots passed, including declared/captured
theme metadata and all five views at 320 pixels. It retains the same bounded
synthetic-fixture/source/preview/clipboard claims above for that preceding
runtime. It does not qualify the later partial-preview correction; new browser,
full-stage, consumer and rendered-documentation qualification remains separate.

The initial parallel whole-suite trials in
`/tmp/oink-r7-frozen-go-gate.log` and
`/tmp/oink-r7-frozen-hugo-gate.log` failed and are not qualification receipts.
The failures were existing ten-second CI-test deadlines under parallel package
load and a graph test observer refreshing its own Git index. The isolated CI
target sets then passed in 12.149 and 2.291 seconds; the controlled Git-observer
graph run passed in 1.354 seconds. Only
`internal/projectgraph/hugo_test.go` changed: its read-only observer disables
Git optional locks, filesystem monitoring and the untracked cache. The ordinary
actual-Hugo graph run passed in 1.562 seconds after that test-only correction.
No runtime or embedded UI bytes changed.

The corrected freeze is recorded in
`/tmp/oink-r7-corrected-runtime-freeze.json`: the 113 runtime inputs retain
`15a7de85a1ae9e6a73d8ea6570aa4f97bdd0ad5677ad7ca996fdd081ad43f7b5`;
the 193 broader inputs now bind
`67c6d36cf91d175f208f79cdd4d337aab6d2ef71e43453b20394b677678725e8`,
with only the test-observer file changed from the preceding
`85ad60d24c93e899020fbdcd34f8252c578253ce5afaf8652e561a432ecc8067`
freeze. Corrected serial Go tests and vet passed in
`/tmp/oink-r7-corrected-go-gate.log`. The corrected serial actual-Hugo/pinned-tool
suite also passed in `/tmp/oink-r7-corrected-hugo-gate.log`, SHA-256
`2aed822ff6fc8be04919aa74ca6ada721789232c14c1d77f1d44113bc0d235a7`;
the application package took 220.782 seconds. The independent post-Go
source-preservation audit is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-postgo-audit-qygh7bcc/receipt.json`,
SHA-256 `5ee45fe041536243bc1229054516835c61b27909a4f296ac226b1a138e4bc8dc`.
It verifies the full physical/logical input guards, not Hugo or consumer results.

The durable corrected owning-gate receipt is
`/tmp/oink-r7-corrected-owning-gates.json`, SHA-256
`c7f94a740e33a7349886b3f3689419719f857f39031375e80ca384a3dac36e67`.
It binds both successful serial runs to the corrected freeze and preserves the
failed trials as unqualified. The prepared documentation renderer now requires
the completed consumer receipt to prove a private captured-source rebuild
byte-identical to the final browser binary. Its source-only independent audit,
`oink-r7-docdriver-audit-ig_r8ud1/receipt.json`, binds SHA-256
`858cc48bf602fbdb26fcbda03c78ca485338b1295d64257d32cfb14b24f1ade3`
and prepared driver
`f25d9ac4bf1a7ef43d5526b7b3cbadf84dd64ad8a57fd82d1c82e76fdb2b3435`.
That audit did not execute or qualify canonical rendering.

The first consumer driver trial, `oink-r7-corpus-h1lOFl`, stopped with
`KeyError('preview_base_path')`: it indexed a field legitimately omitted when
the actual preview base path is empty. Its private rebuild was byte-identical
to the final browser binary
`73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`,
and all four consumer source inventories and the root inventory were preserved.
That failed driver run does not qualify the four-consumer gate. The fresh
`oink-r7-corpus-corrected-cByXTa` driver changes only those two accesses to
`get(..., '')`, with SHA-256
`4c409acacbb9b82e658e6705eddefd9a3541def5c63c340b65678a6c9a8354e4`.
That fresh run subsequently failed when the repository produced an inventoried
file larger than 64 MiB: the preceding runtime refused all production preview.
Its native check retained outcome `1`, while required unavailable preview made
Studio outcome `2`. Starter, docs and PIG completed that run with outcome `0`;
all four source inventories and the root inventory stayed preserved. The failed
`cByXTa` trial is retained and does not qualify the four-consumer gate. Neither
empty-base-path driver correction changed runtime or consumer sources.

The parent then authorized a narrow runtime/test correction for partial
preview. It keeps the 64 MiB limit, exposes guarded production files within the
limit, returns `413` for the exact skipped oversized paths and keeps required
`studio.preview` coverage incomplete. Native check outcome remains unchanged;
Studio still returns `2` for required incomplete preview. The embedded UI is
held unchanged. All preceding browser/owning/binary/corpus receipts describe
their earlier runtime boundaries, not this new runtime. The new owning/browser
gates are recorded separately below rather than inferred from those earlier
receipts; exact-binary four-consumer qualification remains separate.
The old failed capture proved that an output exceeded 64 MiB but did not expose
its captured path/size; ignored repository output is not evidence for that
capture's identity. The new bounded coverage detail will record actual omitted
relative paths, sizes and count. A prepared real-Hugo browser fixture adds
`static/oversized.bin` at 64 MiB plus one byte to exercise an available guarded
HTML preview, an exact skipped-file `413`, native outcome `1` and required
partial-view outcome `2`. That fixture preparation alone was not browser
qualification; the subsequent completed browser proof is recorded below.

The new partial-preview freeze is
`/tmp/oink-r7-partial-preview-runtime-freeze.json`, SHA-256
`c426ce3e641ed7b39bb711a26006306cab22e761c5062f2164f10deb4bea8765`.
Its 113 runtime inputs bind
`4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84`;
193 broader inputs bind
`8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`.
Only `internal/studio/preview.go` changed among runtime inputs; the broader
changes also include its test and `scripts/test-studio.mjs`. All three UI files
retain their exact bytes and modes. Focused core final race passed in 1.748
seconds, with vet and scoped whitespace checks also passing. Its receipt,
`oink-r7-partial-preview-owning-a56dunn4/receipt.json`, binds SHA-256
`7b6ecb491f283d04fe54347e564dba426b1a84d152040a1d945af54bc67756ac`.
The initial sparse-fixture mode trial is excluded: host umask `0077` made a
requested `0640` file actually `0600`; explicit fixture chmod to `0640` corrected
that setup without changing production behavior. Focused proof covers normal
`200`, oversized `GET`/`HEAD` `413`, changed identity `409`, private path `404`
and refusal for other unknown output errors. It does not substitute for the
subsequent independent broader browser/owning/corpus/render gates.

Whole serial Go tests for the new partial-preview freeze then passed in 61.481
seconds, and vet passed in 0.571 seconds. Completed logs are
`/tmp/oink-r7-partial-preview-go-gate.log`, SHA-256
`be7d6eccf99a6f4c1b8f09d1fb782455c7cbd3bad4a2f37e2f0e9da916bcb313`,
and `/tmp/oink-r7-partial-preview-vet-gate.log`, the empty SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
The independent held-input audit
`oink-r7-partial-held-audit-o6p98i1l/receipt.json`, SHA-256
`e567efc5f580db9395afab8ad36c4db842c3db95db442eb1cb1c740dbd43ec31`,
verified all 113/193 inputs and physical/logical identities during that parent
Go/vet run. It is not a post-suite or browser/corpus/render completion claim.
The new whole actual-Hugo/pinned-tool invocation subsequently completed with
exit `1` after 285.649 seconds. Its sole failure was the parent's unavailable
Markdownlint preparation path `/md/node_modules`; all other actual cases passed.
The log remains a failed invocation:
`/tmp/oink-r7-partial-preview-hugo-gate.log`, SHA-256
`1ab6b8cfd399d484e08a1d1f05d25475754caa731991dd1eec1cca03cf6ce970`.
The sole owning case was rerun with the exact provisioned
`/markdownlint/node_modules` executable, with no source/runtime change, and
passed: application package 2.317 seconds, wall 3.265 seconds. Its receipt is
`/tmp/oink-r7-partial-preview-corrected-tools-gate.json`, SHA-256
`62b75e563e8074995ed9dd354434e653b2f5f2c6d20767226286d0c08d4c667c`;
log SHA-256 is
`e9bddac210654d219d9c5d6ebabaa3b91a0f5f4de4daf228b3ae21aeaac7673a`.
The executable comes from provision receipt
`268e601e81bc03a263296d57257b85635371bda642d0632532a7d9318c981461`.
The independent case-matrix/held-source audit verifies cumulative executed
actual-owning-case coverage `0` from the failed whole invocation plus that
corrected case. Its receipt,
`oink-r7-partial-case-matrix-audit-16_bl9hr/receipt.json`, binds SHA-256
`0a9e4a1a1e1a08f597becb2f27e743c9f23df672c713c2757241704edb16b51e`.
All 113/193 physical/logical inputs remain frozen. Optional
`TestArtifactCorpus` and `TestPublishedRuleSourceProvenance` cases were explicitly
skipped. This never relabels the whole invocation as exit `0`, nor claims those
skipped cases executed.

The new post-Go input audit,
`oink-r7-partial-postgo-audit-g1hcqdtl/receipt.json`, SHA-256
`b369737ec48456f673c850ea702cb3cb7efffb8ecc129d87e00dc03af82b2e3b`,
then confirmed the complete held 113/193 physical/logical inputs after Go/vet.
That scope does not claim whole Hugo, browser or consumer completion.

The new partial-preview browser passed against exact binary
`f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e`,
version `0.4.0-r7-local`, 16,000,578 bytes and mode `0700`. Its summary is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-cE9be3/summary.json`,
SHA-256 `9099e6c407fd0f9de3c29ce80e03f034a4223d7d7a7c1f1378052e8b9084e0ae`;
provenance SHA-256 is
`85b9f537fb09eecbb09d133b53a297c78184c11200ab0938734c0d10f3449095`.
The private `oink-r7-browser-partial-ZZIqzZ/source-binding.build.json`, SHA-256
`7a89ab8318c3a38455ab6ce12bcdbc53ae5ce0674fb5aaaa1df0fcf68a093399`,
binds all 113 runtime and 193 broader source inputs plus physical identities
before capture/build/after to the new freeze; root inputs stayed unchanged.
All 14 axe checks had zero violations and all 14 screenshots passed, retaining
the keyboard/mobile/light-dark/source/clipboard/security checks described above.
Actual Hugo emitted `oversized.bin` at 67,108,865 bytes, reached through its
rendered `/sub/oversized.bin` link and returning `413`; ordinary actual HTML
returned `200`. Required partial preview coverage stayed visible; 228 typed
native diagnostics and native coverage/outcome `1` matched the CLI/API/UI,
while Studio and the subsequent refresh returned `2`. Source preservation still
excludes only the declared task-fixture external edit. This is the bounded
synthetic browser proof, not a completed four-consumer or canonical render gate.

Another prepared, unexecuted corpus driver had assumed that an available normal
preview always appends a `studio.preview` coverage row. Actual normal
Starter/docs/PIG Overviews do not emit that row; the preparation assumption
was corrected without changing native coverage. The repaired fresh
`oink-r7-corpus-partial-pZLwY0` driver, SHA-256
`47778df62505beeb7432985be927f1b001e03824e9dee3a6dbed9d9b2dbe049c`,
was reviewed against those three retained actual Overviews and the current
partial browser capture. Normal availability still requires its actual preview
URL and independent HTML `200`; a partial capture retains its actual required
row, omitted count/identities and `413`. The preparation audit is
`oink-r7-partial-driver-correction-audit-sa98cm6k/receipt.json`, SHA-256
`a519a5bc6ae83438146ff4710d53f5edb0e656a05d0532c02123e5771416f07e`.
Its earlier `f762` preparation was not executed or qualified. The parent has
released the corrected driver for a fresh all-four run; its completed
qualification is recorded next.

The fresh four-consumer qualification completed with driver outcome `0` in
234.6425 seconds. Its current summary is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-corpus-partial-pZLwY0/summary.json`,
SHA-256 `d7b5a4f1607b6f75ae6a596c19cbab28685fb67dac750096173060ed097c8bf5`;
log `/tmp/oink-r7-partial-corpus-gate.log` binds SHA-256
`a7b724500569bd594d8e01502ec1956eb089cc9153b04b693992a9322013c811`.
The durable current corpus `qualification.receipt.json` binds SHA-256
`4e5df7c3fda9f0b763091af3e6cb85c68c736c319a1de68030b81d5cd5b384bc`;
primary source inventories contain 97/421/858/2,294 files respectively.
The private captured-source rebuild is byte-identical to the new browser binary
`f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e`.
Runtime 113/broader 193 inputs and root physical identities stayed frozen;
every operation and the overall boundary preserve all four consumer bytes,
full modes/types, logical/mutable Git, ignored copied inputs and directories.

| Consumer | Native outcome | Typed diagnostics | Studio outcome | Actual captured pages |
| --- | --- | --- | --- | --- |
| Starter | `0` | 28 review-info records | `0` | 66 |
| docs | `0` | 144 review-info records | `0` | 343 |
| PIG | `0` | 120 review-info records | `0` | 248 |
| repo | `1` | 10,462 existing duplicate-ID findings plus 788 review-info records | `2` | 1,576 |

Nested native headers, typed diagnostics, coverage and exit match direct CLI
checks exactly for all four sites. Issues were fully paginated; other views
were bounded samples, with captured physical source and translation diff
available on all four. The first three actual production previews returned
HTML `200`; they emit no `studio.preview` omission row, and the driver invents
none. The repository normal HTML returned `200` with 60,100 bytes. Its current
capture exposes exactly four oversized print paths; each actual `HEAD` returned
`413` with zero response-body bytes:

| Captured omitted relative path | Captured byte size |
| --- | --- |
| `_print/pkg/index.html` | 73,976,221 |
| `_print/pkg/pgsql/index.html` | 69,903,999 |
| `zh/_print/pkg/index.html` | 73,086,240 |
| `zh/_print/pkg/pgsql/index.html` | 69,052,754 |

These identities come from current bounded capture detail and live requests,
not the earlier ignored-output clues. Required `studio.preview` remains
incomplete, so repository Studio `2` retains native `1`. Actual analysis-only
draft routes returned production `404` in docs and repo; that test was explicitly
not applicable in Starter/PIG without a unique captured draft route. Workspace
subset/full/healthy-subset sessions selected only registered sites and closed
listeners without captures; unknown or selected missing sites returned `2`
before startup. This is local Darwin/arm64 CLI/API evidence with Hugo 0.166.0
Extended, Go 1.27.1 and Git 2.54.0; browser scope remains the separate synthetic
fixture. No source writes, install, publication, adoption or deployment occurred.
Independent final corpus audit
`oink-r7-final-corpus-audit-xr3_u5dt/receipt.json`, SHA-256
`b8a8eedf5c899fe5830bdde959783c46b3f191ab144c0d3798077555d55238fc`,
verifies raw typed native/API/shutdown parity, all 132 operation preservation
comparisons and four overall guards without rerendering or new HTTP requests.
Only guarded canonical promotion/render and the explicit R7/A16 stage decision
remain pending; R8 and final A18 remain open.

For temporary disk capacity, the parent retired only three explicitly created
private Go build caches, totaling 366,184,826 bytes, as recorded in
`/tmp/oink-r7-private-cache-retirement.json`. Sources, binaries and qualification
evidence were retained; no global, user or system cache was removed. This
preparation action is not a runtime correction or a qualification gate.

### Remaining stage gates and promotion boundary {#r7-pending-gates}

| Required gate | Current status |
| --- | --- |
| Frozen runtime input/binary identity | New partial-preview freeze binds 113 runtime inputs `4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84` and 193 broader inputs `8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`; all UI bytes/modes unchanged. Source-bound browser binary `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` passed; fresh private consumer rebuild is byte-identical |
| Full Go/vet and actual Hugo | New whole serial Go/vet and browser passed. New actual-Hugo/pinned-tool whole invocation remains exit `1` for a preparation path; sole corrected owning case passed `0`, yielding independently verified cumulative executed actual-case coverage `0`; two optional cases explicitly skipped |
| Four consumers | Completed exact-binary CLI/API qualification; native `0/0/0/1`, Studio `0/0/0/2`, exact nested native parity and source byte/full-mode/type/Git/ignored-input/directory guards; repository partial preview remains required incomplete |
| Canonical paired sources/render | First guarded TEN promotion and scoped actual render passed; the post-render status amendment has separate fresh source checks and is not claimed rerendered |
| Stage decision | R7/A16 supported local scope accepted; R1–R7 accepted locally, R8 and final A18 remain open |

The next prepared documentation installer retains the actual captured old inode
outside canonical source storage on both success and recovery, without
unlinking its last name after an earlier target identity check. This private
helper hardening and its new recovery fixture are a new preparation boundary;
executed R6 installers/hashes/receipts remain immutable and are not retroactively
claimed to contain it. R6's successful promotions already retained originals.
No consumer plan writes, release, adoption or deployment are implied by this
candidate documentation or the local browser fixtures.

The completed first-promotion rendered gate is `/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-docs-render-n8tw2tbw/summary.json`, SHA-256 `35e79f51d39803b3e4cdf134ed277957dd627acba42e0e0dc785e4745ec3c481`, with log SHA-256 `de3a07eac661c15805070e0ed2e364a71ebbd38e15d8907aab3bdf716e95131d` and elapsed 63.33 seconds. Exact qualified binary `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` passed production CLI links with one strict Hugo build. Ordinary production Hugo without a probe passed rendered Markdown (214 pages/44,075 text nodes) and links (345 pages/48,482 internal links/4,303 fragments). Its translation owner retained exit `1` only for the existing nonpublished release `1.2.0` draft. Independent draft/future/expired analysis passed Markdown (216 pages/44,381 nodes), links (347 pages/48,858 internal links/4,331 fragments) and translations (137 pairs/1,129 headings); it did not replace production output. Source translation/style/whitespace checks passed and CLI/docs schema `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda` remained identical. All twelve operations, schema and overall guards preserved 421 primary files, 427 copied inputs, 109 directories, 36 mutable Git files and 113 runtime inputs.

The first guarded promotion receipt `oink-r7-root-promotion-p9g1u7pz/summary.json`, SHA-256 `323a5ce267e39aaf8f97dc4a12cccbdde83730155a199efb5f3815e29b334e4a`, verifies actual original inodes retained outside canonical source. Its post-apply receipt lookup initially used `0` instead of `00`; that metadata-only driver failure is preserved, followed by receipt finalization with unchanged raw guards. The successful source installation was not reapplied. Executed R6/R7 helpers and first-promotion receipts remain immutable.

R7/A16 supported read-only local scope is accepted after the frozen cumulative owning-case/browser/corpus and canonical gates above. The original whole-Hugo invocation still has exit `1`; the corrected sole tool case plus independent matrix establishes cumulative executed-case coverage. Repository native `1` and required partial preview/Studio `2` remain visible. R1–R7 are accepted locally; R8 editing and final A18 remain open. This post-render status/evidence amendment has its own byte/full-mode guards, unchanged headings/command fences, paired source checks and retained-inode installer fixtures. Its new bytes are not claimed tested by the preceding 63.33-second render; no additional rendering, consumer write, public release, adoption or deployment is implied.

## R8 accepted reviewed editing evidence {#r8}

R8/A17 supported editing scope is accepted locally after the corrected frozen
owning/browser/corpus and guarded canonical rendered gates recorded below. CLI `edit text`, `field`, `snippet` and `attachment` preview the same
bound `oink.edit/v1` intent used by explicit `studio --edit`. Saved-plan apply or
explicit acknowledged Editor Apply owns selected source writes. The default
Studio session remains read-only. This section retains capture-time candidate
facts and trials, followed by the completed current qualification; it does not
extend earlier R1–R7 evidence to changed code.

### Candidate scope and preservation {#r8-scope}

Known site-owned UTF-8 Markdown is bounded to 1 MiB. Full text and supported
ordinary top-level YAML scalar forms retain the declared BOM/line-ending and
source-span preservation boundaries; unsupported form shapes remain text.
Exact `value_json` numeric tokens avoid browser Number rounding. Scalar forms
bound numeric literals to 4,096 bytes and absolute decimal exponent 10,000;
larger/nonfinite constructs remain manual text. Field JSON is at most 1 MiB;
escaped lone surrogates refuse, valid Unicode pairs are supported. Catalog
components use original UTF-8 body byte offsets; attachments require actual
leaf-bundle identity, at most 4 MiB and an exclusive new clean basename.
Source hashes, full modes, all site/external inputs, regenerated intent and
fresh actual Hugo validation bind the same shared guarded application path.

The Editor displays the complete UTF-8 review, selected-file base/after
identity and native candidate result; the review is capped at 2 MiB and its
literal bytes are hash-checked before acknowledgement. The actual selected
candidate HTML is draft/future/expired analysis, visibly nonpublishable and
separate from the original production preview. Required candidate-view
incompletion may raise the proposal/session to `2` without changing native
findings. For page-file edits, the selected candidate source hash/full mode
matches its reviewed After state; attachment/no-op proposals retain the
selected page’s reviewed Base state.
Stale/replayed plans, attachment collisions and untrusted preview requests are
refused; applied-with-refresh-error remains explicitly applied.

### Focused preparation receipts {#r8-focused-gates}

| Candidate evidence | Current observation and boundary |
| --- | --- |
| Pure editing core | Owner's focused exact-numeric tests passed for `18446744073709551615` and `7.12345678901234567890123456789`, exact no-op raw bytes and changed final decimal digit; broader frozen receipt pending |
| Actual DFE output ownership | Live ordinary output is copied through a confined `os.Root`, exclusive target files and guarded streaming reads; files over 64 MiB can be captured while serving limits remain unchanged |
| Copy cancellation/race | Context-aware helper focused `0` in 0.703 s, race `0` in 1.856 s, vet/whitespace `0`; actual first-chunk cancellation retains partial output, source bytes/modes/identity unchanged; source FIFO replacement cannot block before descriptor proof |
| Helper log identities | Focused `c227a88210ab0dc46b24eaff50a347d5c494e9ce23f5bdef5d5b822efab4976f`; race `13f0616d55fd4df791ecded0712a18096392c88cb9b849383414c305e50b6779`; vet is empty SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| Read-only candidate integration review | Selected actual HTML URI/base prefix and inventory, retained private DFE lifetime, source SHA/full-mode equality, native versus view coverage and cancellation reviewed; no new material defect found within this code review scope |
| First Editor browser trial | Harness stopped on ambiguous global Open editor selector; retained as failed trial, no UI qualification claim |
| Corrected-selector Editor trial | Desktop field/component/binary apply checks and axe checks passed before 320 px draft-review horizontal overflow failed; retained original trial, not a final browser pass |
| Narrow layout correction | Editor review hashes/receipt text wrap and intrinsic widths are bounded; prior CSS and failure evidence retained separately. Development rerun passed 12 axe checks/screenshots, including real 320 px dark review and light receipts/refusals; final frozen-source/binary rerun pending |

The helper evidence is focused file-copy/cancellation qualification, not the
whole editing application or all platform support. Browser trials describe
their actual stopped scope. They do not establish final A17, consumer adoption,
deployment or a successful current frozen browser binary.

The preceding preparation rows were captured before the first complete R8
freeze. They remain development history. The first whole frozen gates later
passed for binary `84b804d3246a5be581e44884ed910fa3f45d8be29734b8babdeeb763a11fa882`
(`0.5.0-r8-local`), runtime 123/`58517b8e98b80df6642be4ee6275a0074ec187768b20e009f41da2607b635d46`
and broader 212/`d81335c78413acc60e27adee0ac794862285e41cb2a3a7687ec820c1065ba003`.
The whole-gate summary is `b49f4a3272af3e3dcc92e7e9b38d4289bb49cb19aa3e9354ea148d2d8cb2cea8`:
Go tests `0`/56.523 s, vet `0`/0.904 s, whole actual Hugo plus all three pinned
tools `0`/320.044 s, core race `0`/16.610 s and public R8/helper race `0`/48.319 s.
Its source guards passed. These receipts qualify those earlier bytes only.

The first frozen browser receipt
`eb6977235ef9ae6cec28651b5654eb101685af67abe0cbed0acb0f8375458d9c`
binds that same binary and source freeze. Editor had 12 axe runs with zero
violations and 12 screenshots; retained read-only Studio had 14/zero/14.
The actual form preserved the literal `1e400`, its planned after hash and diff,
then discarded it; exponent ±10,001 and a 4,097-byte numeric literal refused
locally without an API request. Four acknowledged field/component/binary/draft
applications occurred only in disposable fixtures. Default read-only refusal,
stale preservation, no-op source bytes, preview isolation and native-result
independence passed. This is development browser evidence for the first
freeze, not a four-consumer or current corrected-runtime acceptance.

The first exact-binary consumer trial then stopped at Starter after 37.533 s.
Its immutable failed-trial receipt is
`853a8397ba4c527c03aa3cc9ac7cacc41c0ab0379549d145b874f1d1ecc3901c`.
Two failures are recorded separately. A driver event hash depended on JSON
object-key order even though recursive comparison proved API/CLI arrays equal:
28 diagnostics, 29 coverage rows and native exits `0`/`0`. Separately, repeated
resolved cache capture produced a genuine duplicate module input
`.gitattributes`; required candidate graph capture became incomplete, mutation
outcome `2`, with native check still `0`, no actual selected DFE HTML and no
applicable lease. The public published-cache fixture reproduced that defect;
its retained failing log is
`50ab704e715665096e0f36391bb1364841c3a2b2ac88dd262915ce53fb66afa6`.
All 48 recorded per-operation source proofs and four overall consumer guards
preserved bytes, full modes, types, Git, ignored copied inputs and directories;
root inputs stayed exact. No Apply or saved plan was performed. This stopped
trial has no completed four-consumer qualification claim.

The narrow runtime correction gathers complete resolved-module rows before
committing additions. Identical repeated or reordered captures retain the
original inventory. Changed hashes/full modes, added or removed paths within
an existing scope, missing scopes, conflicting identities or capture errors
refuse without refreshing prior evidence or appending partial additions;
non-module rows remain exact. Site owning receipt
`e7b284b9dece1c5f2b696cd76166d2286fcbec69e6c48912ab9a78204bdb980b`
records focused `0`/0.746 s, site `0`/2.123 s, focused race `0`/1.958 s and vet
`0`/0.167 s. This compares reobserved complete rows; it does not lock module
files against concurrent writers.

The corrected published-cache receipt
`6358dc81f06e34b789cb47a0f4442d6d036d2e33423a06f5dbe85b3064766da6`
records actual `github.com/pgsty/oink@v1.1.0` from a task-local copied checksummed
archive, with no downloads or replacement. Original and candidate graphs each
have 1,256 unique inputs, including 1,198 module inputs. Full API/CLI typed
diagnostics, coverage, exits and plan identity match; actual selected DFE HTML
returns `200`, with source bytes/full modes/Git unchanged and no Apply or saved
plan. Owning race passed in 30.255 s; vet passed. Its corrected race log is
`c7d21a30b8af141d9d9604a80ddf9cf3f608320b97a441a06a742376e2119551`.

The current complete corrected freeze is
`fb276500a3d2643bd0aa220f8bebb380fce2c98493d62b0502b6497b2f02949f`,
runtime 123/`cdf629eeb4bbef6d4d88ee27fe3fb0a73b07b6bf6438336e033a18fb7feb1c17`
and broader 212/`f6e305e792733a550814eb841615d12fa14a9a6bb2a97c4ada85f7275183e579`.
Only `source_inputs.go`, its owning test and the public published-cache test
differ from the first freeze; held UI/helper bytes and all full modes remain
unchanged. The rebuilt candidate is
`bd25f9e0b35ec10e227aabf9582ae40b0b367390f64b93668de6ae85222c3d71`
(`0.5.0-r8-local`). Its observed corrected source-bound browser receipt
`33a698985a55c14c3e64e981da1f8e74c686497083dc0edb241406f185e3eeb8`
again reports Editor 12/zero/12 and read-only 14/zero/14 with complete 123/212
pre/post source preservation. Corrected whole owning gates, the fresh
four-consumer corpus and protected canonical rendering are still pending at
this evidence amendment. R8/A17 is not stage accepted; final A18 stays open.

At the next evidence observation, the corrected whole gates completed for
that held `bd25f9e0…22c3d71` binary and `fb276500…02949f` freeze. Summary
`208f156c0954e803eccbada678a4689683dc1576c543c379e5cc04b3497ef772`
records Go tests `0`/57.826 s, vet `0`/0.521 s, whole actual Hugo plus all three
pinned tools `0`/378.847 s, core/site/Studio race `0`/17.937 s and public
R8/attachment/output-helper race `0`/85.159 s. Every gate's source pre/post guard
passed. The actual-Hugo log has 434 top-level passes and zero failures; the two
optional external fixtures `TestArtifactCorpus` and
`TestPublishedRuleSourceProvenance` remained explicitly skipped. Those skips
are not claimed as executed corpus or provenance qualification.

The corrected whole actual-Hugo log is
`4eb1a2afdce2adbe570b10922fd53b6d8954f7c95747370c3c661e94d2f71a05`;
Go log `ea59463e9649ffe2f8aff9da66c91cf6895c86fde96a524db23c89cd4eb35925`,
core race `cdd3d761b5ca7b5e986b25aee3129d65663e3e5ebb83eecb6fbb080387298a58`
and public race `bb610bdcd7a299cb9b66f4c69e30e246c20546efae47653c01d350b1026ea2de`.
The corrected browser-only evidence above remains bound to the same current
source and binary. The separately authorized fresh four-consumer trial is in
progress; no completed corpus, canonical render, R8/A17 acceptance or final
A18 qualification is inferred from these owning gates.

The 434 passes and two optional skips above are top-level counts. The same
whole invocation also skipped the nested Unix-socket refusal fixture because
the Darwin temporary pathname exceeded the socket limit. A first shorter
private-path trial still skipped: receipt
`93106854ca890b497d3c74522b895f597ac60cec55ced42cad7b187d334da200`
retains process exit `0` but explicitly records no actual socket execution and
failed qualification. It is not relabeled as a passing fixture.

A subsequent nonresolved short private `TMPDIR` executed the same frozen
socket fixture under race detection without a skip: `0`/2.954 s. Receipt
`531a503b3b91e1b423c2be61b92ed806d3a813738c38d57e5ec122577b4337f9`
and log `236c84f1842ffce76174c834f3888718a109cec6377ada6f3242b02f551f00b3`
bind `fb276500…02949f` and all 123/212 logical/physical/Git inputs unchanged
before/after. This supplies the actual socket-refusal case without changing
source or the original whole invocation's skip history. Corpus, canonical
render, R8/A17 stage acceptance and final A18 remain pending.

The preceding pending-corpus statements record their observation times. The
corrected four-consumer trial subsequently completed in 845.705 s. Summary
`af4fc53326163c4a03aa2982c1f01363fbbdd5a447c9baed3639bd8599d46370`
and qualification receipt
`4d6fd02543c1920497e1a1bb0a68fcf89b0546130fd9cc12c1df391b7e673e75`
bind a byte-identical private rebuild of `bd25f9e0…22c3d71`, the complete held
123/`cdf629ee…feb1c17` runtime and 212/`f6e305e7…5183e579` inputs. Original
failed corpus, published-cache regression and first frozen browser/gate bytes
remain separate historical evidence; all 2,383 entries of the first failed
trial retained their exact bytes/full modes/types.

| Corrected consumer | Native/current and native candidate exit | API candidate outcome | Full diagnostics/coverage | Actual selected analysis HTML |
| --- | --- | --- | --- | --- |
| Starter | `0` / `0` | `0` | `28` / `29` | `200`, 48,149 bytes, `/blog/design/content-model/` |
| Documentation | `0` / `0` | `0` | `144` / `34` | `200`, 61,738 bytes, `/blog/oink/immersive-reading/` |
| PIG | `0` / `0` | `0` | `120` / `41` | `200`, 55,641 bytes, `/404/` |
| Repository | `1` / `1` | `2` | `11,250` / `29` | `200`, 92,352 bytes, `/blog/infra/2020-12/` |

These are actual selected Hugo HTML routes in the separate, visibly
nonpublishable draft/future/expired candidate view; each expected candidate
marker was present. API and CLI matched full typed diagnostics/coverage, native exits, plan ID,
Base/After hashes and full modes, unified diff and the selected page’s proposed
source. The complete literal API review and its hash were independently
validated. No consumer Apply or
saved plan occurred, and no listeners remained. The repository retained
10,462 existing duplicate-ID findings and 788 information records. Its four
actual PRINT outputs remained required partial-preview incompletion:
`_print/pkg/index.html` 73,976,221 bytes,
`_print/pkg/pgsql/index.html` 69,903,999 bytes,
`zh/_print/pkg/index.html` 73,086,240 bytes and
`zh/_print/pkg/pgsql/index.html` 69,052,754 bytes. Each bounded HEAD request
returned `413` with zero body; selected in-limit HTML remained `200`. Native
`1` remained unchanged, proposal/session `2` and Apply refusal stayed visible.
The other three complete previews had no invented explicit complete-coverage
row: actual guarded HTML `200` supplied that evidence.

Exactly 53 protected operations each checked all four sources: 212
per-operation source proofs plus four overall proofs, with source bytes/full
modes/types, copied ignored inputs, directories and logical/mutable Git
unchanged. Each source proof compared four inventory categories, yielding 864
raw inventory pairs including the overall comparisons. All 53 root guards and
the final complete 123/212 logical/physical inputs also matched. All issues and
pages were paginated; the other five view endpoints were sampled to their
first 50 records, with one known source and one bounded diff per site. Full
native/CLI record parity used the declared bounded complete-record codec;
object order was canonicalized while array order, types, null and field
presence remained significant. This does not claim every relationship was
visually reviewed or every source was edited.

Independent audit receipt
`6b72ca06d8392a5271fc40757f176f26e1144c21eec93dbd035e0a1bd645657b`
verified 69 artifact hashes, complete bounded API/spool/shutdown typed records
and the large native/CLI raw-file digest bindings. It did not separately
repeat multi-gigabyte native semantic scans. Its additive receipt
`335f137663d4ec0b2a0d3e49c8d70b9918f86078ab6264855171a2644d8aa6c6`
also verified the fresh current root's complete logical Git inventory against
the freeze; the original audit stayed immutable. Corrected owning, socket,
browser and four-consumer supported scopes are qualified. Canonical TEN
promotion/rendering, the R8/A17 stage decision and final A18 remain pending.

The preceding R8 candidate/trial statements retain their capture-time scope.
The reviewed first TEN promotion subsequently passed through the guarded
retained-inode installer, root receipt
`7cd9b4604d2340b9e46965a26281c921b967060909d518b8b4b31e5f42d0120c`.
Its actual original source inodes remained retained outside the documentation
site; unselected source/copied inputs, directories and Git, and complete CLI
123/212 logical/physical inputs stayed unchanged.

The separately authorized canonical render then completed exactly once in
67.21 s, summary
`bb0d0710294f810fb14284f7b5b0329befbd290b66c21397b9a45e8382287fb6`,
qualification receipt
`32d3ffeca43bc9ad4615edcca0d3cc47cc932bbc93c6576724c800e0a62405b1`.
It used the exact qualified `bd25f9e0…22c3d71` binary and corrected 123/212
freeze. Actual CLI production links passed `0` with one strict Hugo build.
Independent ordinary probe-free production Hugo/Markdown/links passed: 214
Markdown pages/44,691 nodes and 345 link pages/48,532 internal references/4,351
fragments. Its translation owner retained `1` solely for the existing
`release/1.2.0` draft absent from production. Separate explicitly nonpublishable
draft/future/expired Hugo analysis passed Markdown (216 pages/44,997 nodes),
links (347 pages/48,908 references/4,379 fragments) and all translations `0`.
Analysis did not replace production output.

Source translations passed 137/137 pairs and 1,143 headings; Chinese style
passed 137 files/181 strong spans/zero emphasis, whitespace passed and schema
SHA-256 `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda`
matched exactly. All 12 commands, schema and overall guards preserved 421
primary source files, 427 copied inputs, 109 directories and 36 mutable Git
files, plus all 123 runtime/212 broader CLI logical/physical inputs. The
qualification receipt binds 60 canonical inventory pairs, 15 CLI guard pairs
and six private-copy source pairs; it claims no consumer writes or deployment.

R8/A17 supported local editing scope is accepted after corrected owning,
socket, source-bound browser, exact-binary four-consumer preservation and
these guarded canonical gates. R1–R8 are accepted locally; native repository
findings and required partial-preview `2`/Apply refusal remain visible. Final
A18 current Linux/runtime/archive qualification stays open. The separate
platform-authority audit
`762571dab9a07651ac8e4c71764bfef292f8d5eba729a089e72d9d755b7e2d7c`
confirms that the initial contract qualifies actually exercised architectures:
macOS arm64, native Linux arm64 and emulated Linux amd64. Darwin amd64 remains
an experimental archive with failed actual execution/unverified runtime; its
history is preserved, and no successful cross compilation becomes a runtime
pass. Both current Linux runtimes and final archives still require fresh proof.

This post-render status/evidence amendment has separate full-byte/full-mode
and inode guards, unchanged stable IDs/command fences, paired source checks
and retained-inode installer fixtures. Its new bytes were not rendered by the
preceding 67.21-second run. No repeated rendering, consumer source write,
public release, adoption or deployment is implied.

### Required gate matrix {#r8-pending-gates}

| Required gate | Current status |
| --- | --- |
| Final immutable runtime/source freeze and exact CLI binary | Corrected complete 123/212 freeze and `bd25f9e0…22c3d71` bind completed owning/browser/corpus/canonical scope; first-freeze trials separate |
| Public CLI/JSON/exit, stale source/config/external-input and guarded writer tests | Corrected public R8/attachment/output-helper race, whole Go/vet/actual Hugo and canonical stage gates passed |
| Frozen whole Go/race/vet and actual Hugo/ordinary Hugo after selected application | Corrected whole Go/vet/actual Hugo and core/public race passed; 434 top-level passes, zero failures, two optional external fixture skips explicit; first trials remain separate |
| Editor browser five-view parity, text/forms/components/binary attachments, exact numeric/no-op, stale rejection and preview isolation | Corrected source-bound Editor 12 zero-violation axe runs/12 screenshots and read-only 14/zero/14 passed; bound completed corpus and canonical acceptance |
| Exact-binary four-consumer read-only qualification | Corrected all-four completed in 845.705 s; full typed native/API/CLI candidate parity, 212 per-operation source proofs plus four overall, no Apply/save/source writes; first failed trial preserved |
| Protected canonical TEN promotion, EN/ZH source/schema/style/whitespace and actual production/analysis render | Guarded first promotion and independent exact-binary 67.21 s render passed; only known draft translation omission in production; rendered and status bytes separately bound |
| R8/A17 stage decision | Supported local scope accepted after corrected whole owning/browser/corpus/canonical gates; R1–R8 accepted locally |
| Final A18/platform/archive delivery | Open; compile success alone is not runtime qualification |

Passed and pending entries are explicit; later gates are not inferred successes. Prior R1–R7
sections, whole-invocation failures and scoped acceptance receipts remain
unchanged. Temporary qualification files stay outside canonical content and
Git; first canonical promotion/rendering has exact receipts, while this status
amendment remains a guarded proposal. No public release or deployment is claimed.

## Current runtime completion supplement on 2026-10-04 {#a18}

This supplement records the current candidate on 2026-10-04 (Asia/Shanghai).
The dated page URL and all initial 2026-10-03/R1–R7 records remain unchanged.
The preceding R8 stage and browser/render receipts are historical input-bound
proofs; they do not qualify subsequently changed backend bytes. The three UI
files retain exactly the browser-qualified bytes and full modes. Current Go,
Hugo, platform, archive and four-consumer checks refresh the changed backend.

The first current ARM offline unit run exposed a real output-copy integrity gap:
adding a directory entry on ext4 could retain the parent's allocation size and
observed timestamp. That failed run stopped before later qualification steps. The
bounded correction captures and rechecks actual sorted directory membership and
entry identity, alongside regular-file byte/full-mode proofs. Only
`internal/app/studio_output.go` and its owning test changed. The failed receipt
and independent audit are retained; a failure never becomes a passed run.

The preceding integrity-correction qualification freeze is `683daca0e522193c7ff1b0de6ac2fee5d2fca080811bf184a8dfd5b90a33f224`:
123 runtime inputs hash to `d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`,
and 212 complete CLI inputs hash to `2abd1a044d8192b07f9bbc06b55dc8b4544d66ca17b8867971cec702ba3af088`.
The `0.5.0-r8-local` Darwin arm64 candidate is
`74ad94e73557f6538cd64edd1766d6df92c596d98411031159d94af072c186ec`.
The observed integrity-correction receipts below bind that source scope; old R2 Linux and earlier R8
binary receipts retain their historical scope. The later one-test fixture amendment has its own complete source identity and
completed formal qualification boundary, recorded below.

The current complete source freeze is now
`196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`.
The 123 runtime inputs remain exactly
`d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`;
the 212 complete CLI inputs are
`2c487bfb4c65ed40ff78356b2860de627e6ac1afa0da2df433b09345dab7f5b0`.
Only the owning published-cache test changed, to source
`54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`.
The fixture amendment is separately guarded; production bytes and all semantic
assertions remain unchanged. Formal qualification of this complete source, including current eight owning
gates, reproduced archives and full plain-Go AMD/ARM runs, passed. Root A18
proof `2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` binds all three declared supported targets and five reproduced
archives. Earlier receipts retain their captured inputs; they are not relabeled
as runs of this amended test source.

| Current proof and preserved earlier input boundary | Observed result and bound receipt |
| --- | --- |
| New complete-source formal qualification | Freeze `196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`, owning test `54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`, unchanged runtime123. Current eight gates, host/archive and both full plain-Go Linux flows passed, bound by root A18 proof `2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60`; this does not claim final document bytes were already rendered |
| Narrow integrity correction | Owning receipt `6966d768025497b45958073d4c53a2a2981065c8a95857834dcf6a4faa4f0201`; independent audit `6cb5d2eabf57b41079026a38a674f46def9f56a15df17ad27e671e4f765798df` |
| Prior-source six frozen owning gates | Build, full offline Go unit/vet, whole actual Hugo/pinned tools, core race and public R8/output-helper race all `0`; elapsed 3.501/68.257/3.909/333.801/37.070/79.670 seconds. Summary `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`; independent audit `20780662b7ff35019b2c8c84e6dc763f9351ae0816f6ef7a7789f7a15be99167` |
| Eight current frozen owning gates | Selected published-cache actual Hugo and race, build, full offline unit/vet, whole actual Hugo/pinned tools, core race and public R8/output-helper race all `0`. Current summary `d6272fcc4dfab114aecfcdf19a7e2b78f1e931817331b460f43ff2056bf754a4`; raw whole Hugo has 435 top-level passes, no failures, two optional top-level skips and the explicit long-path socket child skip. Runtime/binary bytes remain identical |
| Prior-source Darwin arm64 and archives | Current extracted candidate runs outside the checkout with no consumer Node requirement. Seventeen commands and eight actual process tests, including child signals, passed without process-test skips. Two fresh release directories contain byte-identical five archives and checksums; source/license/provenance/canonical tar checks pass. Summary `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1`; independent audit `60a04771365d8be15ac91fbbd8d485b019aae081598e468018861ca5734e387c` |
| Current Darwin arm64 and deterministic archives | Seventeen extracted-archive/ordinary-Hugo/process commands passed expected exits, with missing Hugo explicitly `2`; eight actual signal/process cases ran without skips. Two independent fresh builds reproduced five byte-identical archives from current complete source. Summary `3890fd8468b6bce5271bb32ffa1a18bd5daf99c19c43becac0be8e3b908a5d57`; source, tools, module-cache and smoke-source guards remained equal |
| Prior-source Linux arm64 | Actual nonroot Linux arm64 on ext4 with Go 1.27.1, Hugo Extended 0.166.0 and Git 2.47.3: full offline Go unit/vet, all 13 required pure top-level pass records and the membership case plus its four children without skips, 10 selected actual-Hugo cases without skips, native rebuilt archive identity, installed bilingual/offline/ordinary-Hugo/missing-Hugo `2` JSON and signal/source-mode checks passed. Guest summary `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7`; outer receipt `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898`; exported-record audit `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` |
| Current Linux arm64 | Current nonroot Linux arm64 on ext4, native ARM through QEMU HVF, Go1.27.1/HugoExtended0.166.0/Git2.47.3: full offline unit/vet (370 top-level passes), all13 decisive pure cases and4 membership children without skips,10 selected actual-Hugo cases without skips, exact native/installed current archive identity and bilingual/offline/ordinary-Hugo/signal flows passed. 24 commands reach expected exits including missingHugo2. Guest `268102f69c0950f9d2994d22cd2fd290fc11e24bd6d6f916fd70a93ca4946c74`; outer `f3c066fdc9b97feff92160346185a1af978a5172eed5c81904ac7c0e5fc6c982`; source/SDK/borrowed/old-task guards equal and owned VM reaped. Default optional unit skips retain their named gating reasons; no full Linux Hugo-suite/browser/linter claim |
| Prior-source Linux amd64 failed trial | Unqualified after the preserved current TCG trial failed: outer receipt `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`, guest summary `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240`. Full offline units (370 top-level passes), vet and the first three selected Hugo cases passed. The published-cache candidate request hit the test HTTP client's 90-second deadline; candidate parity, the remaining six selected Hugo cases, native rebuilt archive and installed archive smokes were not reached. Deadline review `12917b9eb89e3abc5893e08da3b6b6e20743dcb4c14e6f7ba8561628e3566934`. A18 stays open; no future preflight or full qualification result is inferred |
| Current Linux amd64 | Current nonroot Linux amd64 on ext4, QEMU TCG emulation, Go1.27.1/HugoExtended0.166.0/Git2.47.3: full offline unit/vet (370 top-level passes), all13 decisive pure cases and4 membership children without skips,10 selected actual-Hugo cases without skips, exact native/installed current archive identity and bilingual/offline/ordinary-Hugo/signal flows passed. 49 commands reach expected exits including missingHugo2. Guest `3a1a32979efc843de8b95b7c13824026e17f71c06d4c458b738c0b9583fb4723`; outer `30cf4950cc83fa0732047d9a0f89bb59e68779ee2e8f5c755724c9679be265e3`; source/SDK/borrowed/old-task guards equal and owned VM reaped. Default optional unit skips retain their named gating reasons; no full Linux Hugo-suite/browser/linter claim |
| Runtime-equivalent preceding four-consumer candidate corpus | Source epoch `683daca0…33f224`; runtime123/binary74ad is byte-identical to current `196245a3…42d43`. The corpus was not rerun after the test-only amendment. 853.249 seconds; native/candidate-native `0/0/0/1`, API/view `0/0/0/2`; diagnostics `28/144/120/11250`, coverage `29/34/41/29`. Summary `a1e98ca3e10095a1134381666bacf256f8e8827cd3900c9e811b7120de4c2974`, receipt `05c4562a50d9f83ba2c99879ec841870c5e753199e41792bd5bc718cf8046e7b`, independent audit `3a1b0b6e3a8c6b1a0d82c5f82b46c84b1e44d6c30bab655610cb9e86e6a30b47`; final TEN bytes have their own render boundary |
| Final canonical lifecycle and rendered checks | The exact promoted TEN bytes require independent canonical rendering and navigation/URL receipts; earlier rendered proofs do not qualify these amended bytes |

The preceding six-gate `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`, host/archive `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1`, and ARM outer `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898` / guest `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7` / audit `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` remain passed only for their captured source. They are retained alongside the new exact-source proof, not overwritten or relabeled. Historical 26 axe checks/screenshots and 22 codec cases are carried with unchanged UI/codec/runtime inputs, not claimed re-executed.

The initial `max`-CPU AMD trial stays failed: receipt `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`, guest summary `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240`. The test client timed out after 90 seconds awaiting candidate headers; candidate parity and the remaining six selected Hugo cases/native rebuild/installed smokes were not reached. Guest inputs stayed exact; the host guard recorded only a `.git` directory timestamp change, whose cause was not proven. The separate qemu64 one-test preflight also failed at the unchanged 90-second HTTP client deadline: outer receipt `fc68173ccdfd8ce263ecdf082a533d9da666a4cc2e1e5e29880ee827286132ac`, guest summary `e350ff65feeee166ffac1d337db9bbd70d3895b1fb6d93df0a30ca4de09019fc`. The named case took 177.71 seconds, compared with 176.64 seconds in the first trial; no CPU-model speedup is inferred. Its inputs remained exact and its VM was reaped. Neither failed trial is relabeled as a pass.

A later, explicitly nonqualifying Go-overlay diagnostic preserved the same
production source and every original semantic assertion. Outer receipt
`0bc6d563b7cd9ca862717c2123ee0836d83b6b927d00204a0b031049c38e93f0`
and raw-bound classification
`66a1422cdb79ab9f1cf683f441ade0ce4adb4a7a666d524c4b9ed98ebee28708`
record a passed named case in 352.40 seconds. Original capture took 26.254 seconds,
Studio capture 26.211, candidate HTTP 94.312, direct preview 94.318 and CLI
preview 81.962. Both graphs retained 1,256 unique inputs, including 1,198 module
inputs. The old original-capture context was expired by the HTTP result; fresh
independent direct/CLI contexts completed normally. All 20,564 host guards and
five guest command guard pairs stayed exact; the owned VM was cleanly reaped.
This diagnostic altered test budgets and is not exact-source or full A18
qualification. The scoped owning-fixture amendment now uses a 300-second budget
for that candidate request and fresh direct/CLI operations, about 3.18 times the
slowest observed operation. General/original-capture 90-second limits, restoration
of the shared client, shutdown 15 seconds and Go's default ten-minute cap remain
unchanged. These are test fixture limits, not a product performance SLA. Formal plain-Go AMD/ARM and current archive qualification is recorded in the
current table above; the diagnostic itself remains nonqualifying.

This preceding corpus qualifies the unchanged runtime CLI against its captured, unchanged
pre-final-TEN consumer inputs. It does not qualify subsequently amended
canonical document bytes; the final TEN has a separate rendered receipt boundary.

The consumer driver compared complete typed diagnostics, coverage, native exit,
PlanID, selected Base/After/full modes, unified diff and selected source between
API and CLI. It separately verified the complete literal API review and its
hash. For attachments and no-ops the selected page retains reviewed Base;
page-file edits match reviewed After. Nonissue views are bounded samples; all
issues and pages are paginated. The 53 protected operations have 212 all-four
per-operation source proofs plus four overall proofs (864 raw inventory pairs
across four categories) and 53 root pairs. Seventy-one retained artifacts are
bound. No Apply, saved plan or consumer write occurred. The completed corpus's
file-only collector needed two preserved metadata corrections for absent
historical trial/self-test files; no CLI/Hugo operation was rerun. The existing
22 negative codec cases are historical checks of unchanged codec bytes, not a
newly executed self-test.

The repository retains its 10,462 pre-existing duplicate-ID findings and 788
review-info records. Its selected actual DFE HTML is available, while four
oversized actual PRINT files stay unserved (`413`, zero response body):
`_print/pkg/index.html` 73,976,221 bytes, `_print/pkg/pgsql/index.html` 69,903,999,
`zh/_print/pkg/index.html` 73,086,240 and `zh/_print/pkg/pgsql/index.html` 69,052,754.
The 64 MiB per-file preview bound is unchanged: required partial-preview
incompletion remains `2`, native findings remain `1`, and Apply is refused.
This is an expected diagnostic outcome, not a failed preservation check.

Linux prerequisites were prepared in exclusively owned guests from signed
Debian metadata: exactly ten new packages and three approved existing-package
updates, verified before and after installation. SDK/Hugo/module caches were
provisioned separately and reused offline. Qualification runs as an ordinary
user on ext4; cached inputs and all 212 source files’ bytes/full modes stay guarded.
Optional tools/browser tests are not silently claimed on guests without those
prerequisites: default unit skips retain their actual gating/not-applicable
reasons, while all required pure top-level cases, the no-skip membership children, selected Hugo and signal cases must execute.
Linux amd64 uses QEMU TCG on the ARM host and is explicitly emulated. Darwin
amd64 remains an experimental archive: actual execution returned Bad CPU type
(errno 86), with no Rosetta installation or claimed supported runtime. Windows
is outside the declared scope.

The current Linux archive digests are `ac883e54a1df0b820696279c63881ba75a00d279f507330128fe8d5aff59c52e`
(arm64, 4,552,687 bytes) and `2dde43bf94ef35aac2111b07dcb9b2766fbf9f883fe39ccd646d14a98b94d734`
(amd64, 5,034,668 bytes). The preceding `683daca0…33f224`
archive digests `c191383af21913be6940ec41be11755b3d985344bbc0f65cc3f5de16424a96a4`
and `6531b27d889260afe804c1f49f37541fbae46e57b5d17a20178c28cb51968794`
remain historical. Cross-compilation alone does not establish runtime
support. SDK/guest preparation failures, the first ext4 membership failure,
and earlier private host metadata/resources trials remain immutable evidence.
Local completion does not establish a commit, public release, consumer adoption,
hosted CI execution, deployment or public-site verification. Uninvoked E1–E4
extensions are separate inactive scope and do not hold finite R1–R8 completion
open.

## Acceptance case ledger {#cases}

This ledger combines the initial audit with accepted R1–R7 evidence and the
qualified R8 candidate gates. Each
full case stays open until its entire outcome is recorded; an accepted stage
does not close later-stage scope.

| Case | Required outcome | Code or checker evidence | Status and missing decisive evidence |
| --- | --- | --- | --- |
| A01 | One `oink.result/v1` JSON result; stderr logs; policy `1`, required incompletion `2` |Protocol/public R1–R8 commands, frozen owning tests and exact-binary CLI/API reports; unchanged result schema; current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported current command scope; future added commands require their own evidence |
| A02 | Hugo resolves slug/url/permalinks/aliases, mounts, unlisted pages and language roots | Real PageFacts/manifest/custom-mount/translationKey fixtures; preserved ordinary artifacts; final consumer facts | R1 scope passed; later stage-specific use of those facts requires its own acceptance |
| A03 | Definite local missing routes fail; outside origin/path and declared external scope classified honestly | Actual rendered-reference fixture plus subpath/policy regressions and final real sites | Passed the required A03 scope; external availability remains explicitly unchecked |
| A04 | Filename, directory and `translationKey`; duplicate/missing/draft cases; strict/localized policy | R2 translation engine, actual Hugo/public commands, final reports and numeric supplement | Passed R2 required scope |
| A05 | Absent record unknown; changed source/translation hash visible; no mtime inference | R2 hash/status/diff, public preview/apply and final reports | Passed R2 required scope |
| A06 | Real fences, inline code, shortcodes, HTML, attributes, unknown fields and protected text boundaries | R2 actual syntax/provenance fixtures, reviewed corpus and final reports | Passed R2 required scope; catalog and unsupported-source limits remain explicit |
| A07 | Acknowledged findings visible; new findings block per policy; required unavailable tools cannot pass | R2 baseline/public plans; R6 fake/actual protocol, missing/unsafe/offline/network-uncertainty and required-precedence fixtures passed | Supported scope passed; required unavailable/uncertain tools remain `2` |
| A08 | Post-check bytes invalidate manifest; provider uploads verified tree without another build | R3 manifest/export/tampering/public one-build tests; final ordinary-Hugo comparison and provider rehearsal | Passed R3 required local scope; provider upload not executed |
| A09 | Both CI templates; custom workflows preserved; permissions/variables/provenance and stale plan protection | R3 offline generation/bootstrap, public preview/apply/stale-input tests, custom workflow supplement and local rehearsal | Passed R3 required local scope; custom workflows remain unknown and unchanged; hosted CI not executed |
| A10 | Reject HTTP 200 fallback, wrong language/build, missing resource/canonical mismatch; incomplete timeout/auth/rate-limit | R3 explicit-network local HTTP and public result fixtures, including required identity absence | Passed R3 required fixture scope; public deployment and browser runtime not verified |
| A11 | All declared profiles/languages; target protection; ordinary Hugo; unknown editor settings retained | R4 24 ordinary Hugo/public profiles, full Starter authoring/editor flow, snippets, actual mounts, source identities, JSONC preservation and external schema reproof | Required supported R4 local implementation/corpus scope passed; documented unsupported editor inputs remain explicit |
| A12 | Readable diff and route comparison; dirty/workspaces/replacement/vendor; recovery/concurrency | Frozen actual-Hugo seven synthetic pinned cases, public upgrade, source/external guards, observed alias retarget and guarded partial rollback | Required bounded R4 local implementation/corpus scope passed; unknown redirects/multihost remain incomplete and no automatic config migration is claimed |
| A13 | Deleted B finds unchanged inbound A; translations/attachments/derived outputs; global full scope | R5 committed Git/actual Hugo deletion, alias-inbound, global/uncertain input and unavailable-baseline fixtures; exact-binary consumer reports | Passed required supported R5 scope; unavailable or unproven historical inputs stay explicit `2` |
| A14 | Candidate before apply; stale/hash/write failures preserve later edits; ambiguous references unchanged |R2/R4 shared safety, R5 full-mode/inventory moves and R8 regenerated intent/fresh-input candidate validation, guarded writer and stale/late-editor/attachment tests; current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported R5 CLI and R8 CLI/Studio editing scope; ambiguous or unavailable required inputs still block |
| A15 | Workspace/direct parity; selected writes only; bounded context with paths/versions/reasons; no content execution | R5 bounded captured-source/context fixtures and four-site queries; R6 registry/direct/aggregate parity and explicit-name saved apply with other sites preserved | Supported context/workspace scope passed; no implicit batch writes |
| A16 | Five useful CLI-parity views; keyboard/mobile/light/dark; source/preview isolation |Accepted R7 evidence retained; historical source-bound R8 read-only 14 axe/screenshots and Editor 12 axe/screenshots with unchanged UI bytes; current backend gates, ARM and corpus separately verified, native/API parity, preview isolation, four consumers and canonical render passed; current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported local views; required partial-preview incompletion/native findings remain visible; no universal browser/platform claim |
| A17 | No-op bytes; YAML unknown/comment/order preservation; stale-save and attachment collisions rejected |Corrected frozen core/public/guarded-writer race, actual Hugo/tools, source-bound Editor/read-only browsers, exact-binary four-consumer proposal parity/preservation and guarded canonical source/render passed in #r8; current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported local editing scope; required partial preview/native findings still block Apply; final A18 separate |
| A18 | Actual declared macOS/Linux runtimes; child signals; provisioned offline runs; honest unsupported inputs | Current freeze/source and repeated five-archive reproduction; Darwin arm64, native Linux arm64 and emulated Linux amd64 nonroot ext4/full offline unit-vet/selected Hugo/native archive/signal smokes passed in #a18 | Passed current declared runtime/archive scope; optional guest prerequisites remain explicit skips; Darwin amd64 is experimental/unverified and Windows outside scope |

## Candidate sites and source preservation {#sites}

The selected acceptance inputs are the embedded Starter plus three distinct
maintained consumer sites. They reuse the historical corpus without writing
consumer sources. The Starter source checkout is provenance input; generated
profile trials use disposable directories.

| Input in the sibling checkout layout | Initial observed identity and purpose | Current candidate acceptance |
| --- | --- | --- |
| `oink-starter` / generated Starter | Source `137843b`, two initial status entries; licensed fixed archive, language/profile/root/subpath trials | R1 bilingual init/check and R4 all-profile ordinary/public authoring flows passed; archive/license unchanged |
| `oink.pgsty.com` | Source `907d873` with existing changes; bilingual documentation/regression and explicit local-theme trial | Final R1 check and source preservation passed; local-theme evidence remains distinct from public-pin evidence |
| `pig.pgsty.com` | Source `75050c0`, five initial status entries; root Docs/Blog rewrites and nonrendering sidebar entries; declared v1.1.0 | Final R1 check and source preservation passed |
| `repo.pgsty.com` | Unborn `main`, no HEAD revision; materialized untracked sources, generated catalog and declared v1.1.0 | Final R1 check and source preservation passed; revision remains unknown |

For each run, record effective module source and versions, flags/network
policy, exit/result/coverage, raw evidence location, and preservation outcome.
Before/after inventories must include all tracked and non-ignored untracked
source bytes and modes, Git status/index state, workspace/replacement files,
and effective vendor inputs. Compare exact inventories; unchanged file counts
alone do not prove preservation. Keep reports, isolated candidates, output and
caches outside consumer sources and outside Git. Full-build timing comparisons
must use the same current input baseline before any incremental speed claim.

## Owning checks and documentation gate {#checks}

Start with the smallest affected Go packages and public behavior tests. The
existing repository gates are `make test` (offline tests and vet) and
`make test-hugo` (actual Hugo Starter, snapshot, manifest and public command
fixtures). The owning Hugo gate now runs all owning packages without the old
narrow test-name filter; new fixtures must remain in that gate.
Use a race run for concurrent plan/server changes when the focused tests justify
it. Unit fixtures remain offline; networking requires explicit invocation.

For documentation, preserve EN/ZH heading number, order and stable explicit
IDs. The narrow source checks are:

```sh
node scripts/check-markdown-style.mjs content/docs/design/research
node scripts/check-doc-translations.mjs
```

Both source checks passed after adding this record and its Chinese peer:
eight Chinese research files passed the style checker; translation source
coverage was 137/137 pairs with 1,082 source headings. These checks establish
source style, pairing and explicit translated IDs only. Rendered acceptance
was not run by this documentation audit.

After building the relevant site, complete the rendered documentation gate:

```sh
npm run _check:markdown-style
npm run _check:translations
npm run _check:rendered-markdown
npm run _check:rendered-links
```

`make build` validates the declared published pin. `make check` selects the
sibling theme for the complete non-browser regression suite; these inputs
cannot substitute for one another. Studio requires its own actual browser and
accessibility acceptance. A passing prose source check does not prove rendered
bilingual output or Studio interaction.

## Delivery state and remaining limits {#delivery}

| State | Current completion evidence; history retained above |
| --- | --- |
| Local implementation | Finite R1–R8 supported implementation completed locally, including Studio/read-only and opt-in reviewed editing; current A18 runtime/archive scope passed. Canonical lifecycle rendering is bound separately to these exact bytes |
| Local validation | Historical R1–R8 owning/browser/corpus/render records retained; current 2026-10-04 backend correction and eight current owning gates, actual three-target runtime/archive checks and unchanged-runtime carry-forward of the preceding four-consumer preservation/parity passed in #a18. Required repository findings/partial preview remain visible. Rendered navigation/URL checks have a separate exact-byte receipt boundary |
| Commits | Baseline CLI commit identified; no maintenance commit established by this record |
| Archive and runtime qualification | Current corrected source: Darwin arm64, native Linux arm64 and QEMU-TCG-emulated Linux amd64 passed installed archive/offline/signal/filesystem flows; two fresh builds reproduce all five archives. Darwin amd64 remains experimental/unverified after actual failed execution |
| Public distribution and consumer adoption | Not performed by this work |
| Deployment and public-content verification | Not performed by this work; local HTTP fixtures can prove the verifier without cloud credentials |

The finite R1–R8 implementation and required current A01–A18 runtime/archive
scope have decisive local evidence. Canonical lifecycle rendering requires a separate receipt for these exact
new documentation bytes; preceding rendered evidence does not qualify them. Uninvoked E1–E4 and
experimental/unsupported platforms do not add unfinished core requirements.
Publication, pushing, deployment, hosted CI and consumer writes remain separate
unperformed actions; known repository findings and required preview incompletion
remain diagnostic limitations, not hidden successes.
