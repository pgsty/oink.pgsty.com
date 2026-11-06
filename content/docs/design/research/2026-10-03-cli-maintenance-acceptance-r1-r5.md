---
title: 'CLI maintenance acceptance on 2026-10-03: R1–R5'
linkTitle: 2026-10-03 CLI maintenance · R1–R5
description: R1–R5 local validation and acceptance evidence from the dated CLI maintenance record.
weight: 56
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] Part of the [CLI maintenance acceptance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
> These R1–R5 sections of the dated record were moved here unchanged on
> 2026-11-06 so each page stays small enough to read whole. The scope, evidence
> rules, case ledger and delivery state remain on the main page.

## R1 local validation {#r1}

R1 now provides shared Hugo page/translation/source facts, rendered reference
and anchor evidence, strict `oink.policy/v1` input, `check links`,
`--format json`, visible reviewed exclusions/external scopes and required-work
precedence. Translation and style selections explicitly return required
unsupported coverage while those engines remain unimplemented. Default build/dev
remain direct Hugo operations.

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
{.wide .expand}

These earlier reports spell optional unselected coverage `not_selected`,
outside the existing result-schema enum. The final code corrects it to
`not_checked` and includes `project.pages` coverage. Their measured counts and
exact inventories remain valid observations of the earlier binary. The final
reports below establish final JSON conformance. Raw evidence stays in task-named local
acceptance directories outside consumer sources.

The final R1 binary was rebuilt from the dirty CLI working tree based on
`e623d93d589c49e5c58b8fae1bd5db720fc904cb`. The recorded input inventory includes
file hashes, modes and Git-status identity. Its SHA-256, computed over sorted
JSON serialization, is
`518260f07f3c916468ee3d56c4eeca03c131514155aa82539564ccd2f3c1f664`.
The exercised binary SHA-256 is
`3deb7e357fc86f6907df60da0769d93f2d41ba5e01949b641548a67d7f459d12`.

| Final current-binary trial | Source files | Built files | HTML files | References | Page facts | Acceptance |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| OINK documentation | 421 | 1,139 | 512 | 74,755 | 341 | Exit `0`, valid result, complete page facts, exact source bytes/modes/Git preservation |
| PIG project site | 858 | 1,392 | 424 | 64,440 | 248 | Exit `0`, valid result, complete page facts, exact source bytes/modes/Git preservation |
| Repository catalog | 2,294 | 3,287 | 1,635 | 851,535 | 1,572 | Exit `0`, valid result, complete page facts, exact source bytes/modes/Git preservation |
{.wide .expand}

Each final result has required `check.links: complete` and `project.pages: complete`
coverage. Unselected translation/style coverage is optional and reports `not_checked`.
The final offline `make test` and vet passed; the corrected actual-Hugo owning
target also passed. The recorded tools remain Go 1.27.1, Hugo Extended 0.166.0,
Git 2.54.0 on macOS arm64. The three exact before/after inventories were
independently compared while preparing this record.

Production output passed rendered Markdown and link checks. Its global
translation checker returned `1` solely because the pre-existing draft
`content/blog/release/1.2.0.md` / `.zh.md` pair is absent from
production. The changed R1 pages rendered in both languages. A separate explicit
analysis build set `HUGO_BUILDDRAFTS`, `HUGO_BUILDFUTURE` and
`HUGO_BUILDEXPIRED` to `true`. All three owning checks passed: 137/137 paired
sources, 1,085 headings, rendered Markdown and rendered links. That view checks excluded sources in isolation while keeping production output unchanged.

## R2 local validation {#r2}

The local candidate now implements translation policy/status/diff/hash review,
syntax-bounded native content rules, visible reviewed baselines and shared
`oink.plan/v1` preview/validate/apply. Default `check` requires links,
translations and style. Production output and the explicit draft/future/expired
analysis are separate. Stable behavior and
examples are in the [contract](/docs/design/decisions/cli/#translations). The R2 local gate passed owning checks,
final frozen-input consumer reports and rendered bilingual documentation.
The exact exercised binary and the subsequent narrow equality fix are recorded
below.

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
site-source identities from the recorded configuration. Supplemental Markdown
includes disabled/unpublished files. It does not invent routes or relationships.
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
returned `2`. This was a validation setup error. Selecting its actual `site` child
returned `0`, with evidence in
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r2-starter-27vmi0w5`.

| Preliminary check | Exit | Page facts | Built files | References | Translation statuses | Outcome |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Correct Starter child | 0 | 66 | 223 | 4,461 | 28 | Complete; 97 source files/inventory unchanged |
| Documentation | 0 | 341 | 1,139 | 74,755 | 144 | Complete; 421 source files/inventory unchanged |
| PIG | 0 | 248 | 1,392 | 64,440 | 120 | Complete; 858 source files/inventory unchanged |
| Repository catalog | 1 | 1,572 | 3,287 | 851,535 | 788 | Completed policy check: 10,462 actual `HTML_ID_DUPLICATE` findings in existing merged-print output; 2,294 source files/inventory unchanged |
{.wide .expand}

The repository catalog run completed with policy findings from existing duplicate HTML IDs in merged-print output; informational review states remain visible.

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
{.wide .expand}

No final report has incomplete diagnostics. The repository catalog retains
10,462 actual merged-print `HTML_ID_DUPLICATE` findings and 788 informational
review states; the other sites retain informational unknown review states.

Kept production docs at
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-2201601475/public`
passed rendered Markdown and links. Global translation checking returned `1`
only for the existing draft release `1.2.0` pair absent from production. The
separate draft/future/expired analysis at
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-site-3698773232/public`
passed all three node checks: 137 pairs/1,092 headings, 216 content pages/41,586
text nodes, and 347 pages/48,682 internal links/4,171 fragments. Evidence logs
are `/tmp/oink-r2-docs-production-{translations,markdown,links}.log` and
`/tmp/oink-r2-docs-analysis-{translations,markdown,links}.log`.

A final review identified optional `equal_fields` comparing JSON `7.0` with
YAML/TOML numeric `7` by representation. The narrow supplement now normalizes
decoded numeric values recursively to an exact rational number tag, preserving
strings versus numbers, map keys and array order. Tests cover decimals/exponents,
negative zero, integers beyond float64 precision, and nested differences. They
also cover source byte preservation and required incompletion for unrepresentable values.
Actual-Hugo translation tests passed in `/tmp/oink-r2-numeric-translations-gate.log`;
all public maintenance actual-Hugo cases passed in
`/tmp/oink-r2-numeric-public-gate.log`; owning vet and whitespace checks passed.
Supplemental source SHA-256 values are:

| Source | SHA-256 |
| --- | --- |
| `internal/translations/check.go` | `24664377e14b4ae2fc554d0d7fde2ec33cc987707250e130fd88d9a25d5e1637` |
| `internal/translations/translations_test.go` | `f58f4a305fe9fe3f5500ddfcf85faf3cfa37d72f8c220a1cb16ce4ccfbddb74d` |

The frozen real-site reports and Linux qualification predate this
supplement; because those sites configured no numeric equality constraint, the fix does not
affect their recorded outputs.

At this stage, macOS arm64 was exercised; an attempted Darwin amd64 runtime
on this host failed with `arch -x86_64` / `posix_spawn: Bad CPU type in executable`
(`/tmp/oink-r2-darwin-amd64-gate.log`) because Rosetta was not installed.
Both native Linux arm64 and Docker Desktop Rosetta-emulated Linux amd64
executed the same runtime/schema/license inputs. Their SHA-256 is
`0f786df68ef3c4844c983a51595f79242d1cb1d2bf6c5b5eb7f2c6415fb8d861`.
Evidence is retained at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-a18-linux-ajbbnvki`
in `arm64-results`, `amd64-results`, `commands.json`, `candidate-inputs.json`,
`preparation.json` and `qualify.sh`. Each target passed 270 test/subtest cases with zero failures and two
optional external corpus/provenance skips. Checks included full actual-Hugo
`go test ./...`, vet, and built CLI version/bilingual init/doctor/full
check/translation status, plus missing-Hugo exit `2` smoke. JSON stdout and source
byte/mode inventories were verified. Go 1.27.1 ran on Linux arm64; Hugo Extended
0.166.0 architecture assets were SHA-verified.

## R3 local validation {#r3}

R3 adds managed `build --check`, `oink.artifact/v1` sealing/export/local
verification, explicit-network HTTP verification, release diagnosis and
guarded local CI generation. The default build/dev path remains ordinary Hugo.
The executed runtime and paired contract/guide gates passed.

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

Each run used offline `build --check`. It used fresh external
destination/manifest paths, the optional marker, and retained isolated work. These existing local
consumer inputs were checked without `--release`. Their configured workspaces
were preserved. Every raw report records exactly one strict Hugo renderer,
zero incomplete diagnostics and zero required unfinished coverage.

| Final managed build | Exit | Source files | Copied source inputs | Page facts | Built files | References | Exported files | Local artifact verify |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Starter | 0 | 97 | 94 | 66 | 223 | 4,461 | 224 | 0 |
| Documentation | 0 | 421 | 427 | 341 | 1,139 | 74,825 | 1,140 | 0 |
| PIG | 0 | 858 | 861 | 248 | 1,392 | 64,440 | 1,393 | 0 |
| Repository catalog | 1 | 2,294 | 2,299 | 1,572 | 3,287 | 851,535 | None | Not exported |
{.wide .expand}

Both inventories compare exact bytes, modes and file types before/after; the
primary inventory also compares logical Git state. Git sites include tracked
and non-ignored untracked sources; the non-Git Starter includes its existing
generated files and lock. The supplemental copied-source inventory also
includes ignored workspace/editor metadata read by snapshots, excluding
existing generated output/cache trees.
All four comparisons were exactly equal.

The repository catalog retains 10,462 existing merged-print
`HTML_ID_DUPLICATE` findings, so neither destination nor manifest was created.
Production review states number 28/143/120/786. Analysis includes
unpublished pages, which explains the earlier R2 144/788 counts. Existing custom
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

Earlier R3 captures preceded the runtime freeze (`oink-r3-final-pisrr21h` preceded custom-CI
diagnosis), and an initial `/Users/vonng/pgsty/PIG` target selection returned `2` before switching to `pig.pgsty.com`.

The scoped R3 documentation gate passed at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-docs-render-pljj5aqd/summary.json`.
Ten paired contract/guide/roadmap/index/overview edits were installed only after
the original bytes/modes matched. Their recorded hashes are at
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r3-doc-drafts-s0b3g48l/applied-files.json`.
Source style passed 88 Chinese docs; translation coverage passed 137 pairs and
1,099 headings; schemas remained equal and scoped whitespace passed. Actual
production Markdown passed 214 pages/41,871 text nodes; links passed 345
pages/48,344 internal links/4,171 fragments. Production translations returned
`1` only for the unchanged draft release `1.2.0` absent from production. A
separate draft/future/expired analysis passed Hugo
and all three owning checks: 137 pairs/1,099 headings, 216 pages/42,177 text
nodes and 347 pages/48,720 links/4,199 fragments. All 421 canonical and 488
copied source files retained exact bytes/modes throughout these rendered
checks.

## R4 authoring and upgrade acceptance {#r4}

The supported R4 implementation and read-only corpus scope are locally
accepted after frozen owning/full gates. This record covers profiles, ordinary
authoring/editor/snippets and bounded upgrade views, along with guarded canonical
documentation promotion and fresh scoped rendered validation.

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
Generated source counts are project 94, docs 58, blog 40 and book 34.

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
remain visible.

Consumer upgrade previews selected the available public v1.1.0 pin and did
not apply writes. Cross-version route/alias/output regressions use explicit
synthetic fixture pins. New/editor
plans were validated previews without saving or applying consumer plans.
Multi-host and unknown relative-alias identities stay incomplete, and nondeterministic
output requires a fresh v2 plan preview.

Fresh canonical documentation acceptance passed after applying the
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

The temporary helper copied the frozen
core without modifying it: helper source SHA
`7faea7e726a6c6fb2e0747be1a4428f4c5fb5734fa52b6f981157a5fe37d9989`
and helper binary SHA
`532638e76f96f8b173c122e512b3bf5fc2c4d4a7130f59c99c2c69e135e87073`
are retained with raw logs.

## R5 implementation and documentation acceptance {#r5}

R5's supported local scope is accepted after focused public/core, corrected
frozen full-stage, exact-binary read-only consumer and guarded canonical
source/rendered documentation gates.

The actual public Git/Hugo flow at `/tmp/oink-r5-public-final-flow.log` passed
in 53.963 seconds. Its committed synthetic site owns its local theme, bilingual
pages and binary attachment. Ordinary modes `0640` and `0600` remain full
current facts. Historic Git comparison uses only executable bits.
Deleting B selects unchanged inbound A, the remaining translation, removed
attachment and actual RSS output. Actual alias-inbound uncertainty, global
configuration/template/data and unknown-input changes expand full scope.

Completed inspect/impact/context returns `0` with separate current-check
findings `1`. Check-since retains current quality `1` and full validation scope.
Missing/unborn/foreign history returns `2`. It retains every known current
page/attachment/reference/output. It does not invent a prior identity or change.
Malformed selectors/limits, missing tools and failed renderer logs are tested.
Bounded context gives reasons/versions/source and excerpt hashes, visible
omission/truncation and no execution of literal document instructions.

Saved move preview/apply and subsequent ordinary Hugo passed, retaining
binary bytes, raw full modes, unrelated files and Git index/revision. Actual
opaque HTML/shortcode references remain manual. Inline/fenced/opaque spans
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

The first frozen consumer trial exposed a cached-public-module guard
gap. The original graph contained resolved module inputs that were absent from
a fresh outer candidate hash. It returned false incomplete `2`, without source
writes. Content plans now resolve/capture the same module inputs before
comparison. Legacy metadata/authoring plan scopes remain unchanged. The separate
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
The corrected four-consumer capture completed 16 commands
in 831.825 seconds at
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-corpus-corrected-y2eue81h`.
Its bounded `final-receipt.json` has SHA-256
`b86e0e6c7dbfbaed62c845c03a55d963068f7d9a16771de5ff3b0974e76fce3b`;
the receipt retains 12 copied owning gate logs and all 20 observed move routes.
It links to the complete raw JSON/logs and per-move classifications.

| Site | Primary/copied inputs/directories | Inspect/context | Current check | Impact | Move preview |
| --- | --- | --- | --- | --- | --- |
| Starter | 97/94/21 | `0`/`0` | `0` | `2`: no Git baseline | `0`: validated, unapplied |
| Documentation | 421/427/109 | `0`/`0` | `0` | `0`: complete historical comparison | `1`: six candidate missing references |
| PIG | 858/861/52 | `0`/`0` | `0` | `2`: historical foreign-input provenance incomplete | `1`: 32 candidate missing references |
| Repository | 2294/2299/48 | `0`/`0` | `1`: 10,462 existing duplicate HTML IDs | `2`: unborn HEAD baseline unavailable | `1`: the same existing duplicate IDs |
{.wide .expand}

Starter and Repository impact retain known current facts without inventing
prior pages or changes. PIG's actual baseline is complete (theme v1.0.0 versus
current v1.1.0). Required foreign-input provenance is incomplete. The comparison
therefore expands full scope and returns `2`. These are distinct outcomes.
Documentation impact completes with 192 captured input changes, 343 affected
prior/current pages and full scope. All completed fact queries expose current
quality findings separately. Repository inspect/context remain `0`.

Documentation move proves 18 rewrites and four routes. Two ordinary literal
`/docs/admin/comments/` occurrences in `content/docs/customize/repository.md`
at lines 216 and 313 remain manual because repeated source/output occurrences
cannot be attributed precisely across ordinary and print outputs. Their six
missing candidate references block validation. PIG moves two Markdown files
and four binary attachments, with eight proven page/processed-resource routes.
Equal-byte paired outputs prove processed `featured_hu_*` resources, but not
new URLs for the four original absolute image references
`/article/pgext-day/{featured,topic,venue,schedule}.webp`. Their 32 candidate
missing references block validation. Original-asset rewrites are not guessed.
These ordinary Markdown limits are separate from opaque HTML/shortcode limits.

Repository move proves ten rewrites and four routes. Its candidate retains
only the same 10,462 existing duplicate-ID findings. It has no new missing
reference or required incomplete finding. Starter's zero-link bilingual move is
validated. All four moves remain unapplied. No consumer plans were saved.
No consumer source writes occurred. Failed candidates have `validated: false`.
All JSON stdout is pure. Primary/copied inputs, full modes, directory
inventories and logical Git/index state are unchanged. These comparisons include
ignored copied inputs. The Git metadata inventory excludes immutable object storage.
The runtime and broader CLI inventories still match the captured identities.

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

The permanent first-promotion `applied-files.json` in
`/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r5-doc-drafts-t3_klnck`
retains the ten authorized files and their original modes. Core owning logs `/tmp/oink-r5-frozen-core-hugo.log`,
`/tmp/oink-r5-owning-race.log` and `/tmp/oink-r5-owning-vet.log` passed.
A13 impact, A14 move safety, and A15 bounded context passed their required supported CLI scope.
