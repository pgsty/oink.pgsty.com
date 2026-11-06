---
title: 'CLI maintenance acceptance on 2026-10-03: R6–R8 and A18'
linkTitle: 2026-10-03 CLI maintenance · R6–R8
description: R6–R8 and A18 workspace, Studio, editing and runtime evidence from the dated CLI maintenance record.
weight: 57
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] Part of the [CLI maintenance acceptance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
> These R6–R8 and A18 sections of the dated record were moved here unchanged on
> 2026-11-06 so each page stays small enough to read whole. The scope, evidence
> rules, case ledger and delivery state remain on the main page.

## R6 workspace and adapter acceptance evidence {#r6}

R6 supported scope is accepted locally after frozen owning/runtime, exact-binary
consumer parity/preservation and guarded canonical source/render gates.
The supported registry/tool fields are documented in the
[contract](/docs/design/decisions/cli/#workspace-registry) and
[command reference](/docs/design/decisions/cli/#optional-checkers).

The registry has an independent version, `oink.workspace/v1`. It requires
strict one-document regular YAML, 1–64 entries, and at most 256 KiB. It requires
exact ASCII names, literal relative/absolute directories, and proven canonical
identities. It refuses overlap. Missing-site results stay per-site incomplete while later selected
sites run. Selection preserves registry order. There is no default named site,
sibling discovery, Hugo settings duplication or automatic multi-site apply. Optional tools extend `oink.policy/v1`, with pinned protocol versions,
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

The inspected core `workspace.go` SHA-256 is
`cf2cbc9509e8c83eedf6d8833c9eb0ea6492de9a85c959798112fa3f105213f4`;
its owning test is
`9070a8e2c3e58680f6567f2394160ec682bf0457c068c2addf354921e7612d6b`;
the public test is
`3e57a6417ae2e7604f7cb06933759bb06a2f40758ff7059848593cedbaa6570a`.
All three inspected files retain mode `0600`.

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
| Stage decision | Supported R6/A07/A15 scope accepted locally after the required receipts |

The durable focused-tool receipt is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r6-tools-6bf67ltv/r6-public-tools-acceptance.json`,
SHA-256 `16b6e47fc0618c76d2f9e3680a4112b6e47b478af8aabd3f2fc84821f840cc8a`.
It binds the provision record, executable/configuration evidence and 1,422
resolved Node package files. Markdownlint reports original `content/tools.md`
line 7, `bytes[80:92]` (`ppears here.`); Vale reports the same line,
`bytes[71:78]` (`BADTERM`). Each of the seven network cases actually makes
one HTTP request.

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
record match. After every operation and overall, all four consumer sources retain full
modes/types, logical and mutable Git metadata, ignored copied inputs and directory
inventories. The complete root CLI inventory still equals its frozen capture. The 478,603,149-byte direct repository JSON and
635,470,795-byte aggregate JSON were validated streamingly rather than
truncated. Separate pinned-tool fixtures qualify optional-tool protocols.
The consumer registry is task-local and writes no consumer policy.

The initial acceptance driver overwrote a summarized result's `command` string
with invocation argv, producing a false parity exception after all six CLI
operations and their per-operation guards had completed. The failed driver and
summary remain preserved as `pre-correction.r6_qualify.py` and
`pre-correction.summary.json`. Receipt completion corrected only invocation
metadata. It verified unchanged raw-result SHA-256 values and header commands.
It retained all original full-stream diagnostic/coverage digests and rechecked
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
0.166.0, Node 26.9.0 and Apple Git 2.54.0.

The initial actual-tool trial exposed Darwin `/var` versus `/private/var` staging identity,
actual loopback proxy routing, and an invalid inline-block-attribute/line
assertion in the Vale fixture. Staging is now canonical. The Vale fixture uses
a real standalone block attribute. The source-mask boundary is unchanged.
The qualified child environment forwards literal `NO_PROXY`/`no_proxy` host-list
data while omitting proxy URLs/credentials and Node preload settings.

Supported source diagnostics require proven original ranges. Rendered lychee
locations remain output file/DOM pointers without inferring a Markdown line.
Offline lychee is not invoked. Authentication/rate-limit/server/transport
uncertainty cannot become required success through severity, exclusions or
baseline acknowledgement.

The first guarded ten-file promotion and its fresh rendered qualification are
complete. The receipt is
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
preserving later old-open-handle writes. Recovery also preserves later target
edits or deletion.

## R7 read-only Studio candidate evidence {#r7}

R7 implements the embedded five-view browser and authenticated loopback API
candidate described in the [contract](/docs/design/decisions/cli/#studio). Frozen core/browser, exact-binary four-consumer
qualification, and guarded canonical rendered gates passed within the declared
scope.

### Focused native and browser evidence {#r7-focused-gates}

| Owning boundary | Evidence status |
| --- | --- |
| Native/public parity | Actual shared check reports preserve diagnostic/coverage/exit identity for `0`/`1`/`2`; explicit selected workspace startup, cleanup/signal and no-source-write proofs are recorded separately by the owning test receipts |
| HTTP management/source/preview | Literal-loopback selection; exact Host/origin/Bearer checks; no arbitrary request paths/writes; captured source/diff bounds and source-mode/output inventory guards; focused core/new browser and current corpus receipts below bind this supported scope |
| Initial held browser | 14 axe checks with zero violations and 14 screenshots; five desktop light views, captured BOM/CRLF source/diff, desktop dark, mobile dark and all five 320-pixel light views plus capture changes. Synthetic actual-Hugo fixture retains 228 native diagnostics and coverage parity; copied suggestions use a private test clipboard, leaving the host clipboard unchanged |
| Browser preview attack | Actual attack script executes in the isolated preview, but parent access, management fetch and popup are blocked; token query refused. Actual draft-only page remains production `404` |
| Snapshot preservation | Captured source instructions/HTML stay literal data; the initial capture retains its old bytes before refresh after an explicit task-fixture external edit. Source full modes/Git/directories preserved except that declared fixture edit; changes show the actual modified captured input |
| Preceding held browser | Passed refreshed held UI/backend receipt: all 14 axe checks zero violations and 14 screenshots, including declared/captured theme rows |
| New partial-preview browser | Passed new frozen partial-preview runtime: 14 axe checks with zero violations and 14 screenshots; actual Hugo normal HTML `200` and 67,108,865-byte output `413`; native `1`/228 diagnostics and coverage retained, required partial coverage visible and Studio/refresh `2` |

Initial browser receipt:
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-AfwaYi/summary.json`,
SHA-256 `930fbd1ab86806069b963bff2e3e95aaa07e3634400cec65e2b8c7922e2a1707`.
Its exact binary binds
`92e5b962e40fbe828a0b006f3ae76a2bddf4ad7e8b1c5b6967e365b8f1827879`.
The qualified local versions are Node 26.9.0,
Playwright 1.62.1, `@axe-core/playwright` 4.13.0 and Chromium 151.0.7922.34.

The refreshed held UI/backend browser receipt is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-studio-browser-vn0ofb/summary.json`,
SHA-256 `520603779f712539865c6e9ef7a9ad3ad21ec1906adfb067ec607cc69d071b7e`,
with exact binary `73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`.
All 14 axe runs and 14 screenshots passed, including declared/captured
theme metadata and all five views at 320 pixels.

The initial parallel whole-suite trials in
`/tmp/oink-r7-frozen-go-gate.log` and
`/tmp/oink-r7-frozen-hugo-gate.log` failed due to ten-second CI-test deadlines under parallel package
load and a graph test observer refreshing its own Git index. The isolated CI
target sets then passed in 12.149 and 2.291 seconds. The controlled Git-observer
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

The durable corrected owning-gate receipt is
`/tmp/oink-r7-corrected-owning-gates.json`, SHA-256
`c7f94a740e33a7349886b3f3689419719f857f39031375e80ca384a3dac36e67`.
The prepared documentation renderer requires
the completed consumer receipt to prove a private captured-source rebuild
byte-identical to the final browser binary. Its source-only independent audit,
`oink-r7-docdriver-audit-ig_r8ud1/receipt.json`, binds SHA-256
`858cc48bf602fbdb26fcbda03c78ca485338b1295d64257d32cfb14b24f1ade3`
and prepared driver
`f25d9ac4bf1a7ef43d5526b7b3cbadf84dd64ad8a57fd82d1c82e76fdb2b3435`.

The first consumer driver trial, `oink-r7-corpus-h1lOFl`, stopped with
`KeyError('preview_base_path')` because it indexed a field omitted when
the actual preview base path is empty. Its private rebuild was byte-identical
to the final browser binary
`73bf90c69dce84849ee20ddfbfe825b9f2dd46f0cd37a228ce1b041a83afa33f`,
and all four consumer source inventories and the root inventory were preserved.
The fresh
`oink-r7-corpus-corrected-cByXTa` driver changes only those two accesses to
`get(..., '')`, with SHA-256
`4c409acacbb9b82e658e6705eddefd9a3541def5c63c340b65678a6c9a8354e4`.
That fresh run subsequently failed when the repository produced an inventoried
file larger than 64 MiB: the preceding runtime refused all production preview.
Its native check retained outcome `1`, while required unavailable preview made
Studio outcome `2`. Starter, docs and PIG completed that run with outcome `0`.
All four source inventories and the root inventory were preserved.

A narrow runtime/test correction for partial
preview keeps the 64 MiB limit, exposes guarded production files within the
limit, returns `413` for the exact skipped oversized paths and keeps required
`studio.preview` coverage incomplete. Native check outcome remains unchanged.
Studio still returns `2` for required incomplete preview. The embedded UI is
held unchanged. The bounded coverage detail records actual omitted
relative paths, sizes and count. A prepared real-Hugo browser fixture adds
`static/oversized.bin` at 64 MiB plus one byte to exercise an available guarded
HTML preview, an exact skipped-file `413`, native outcome `1` and required
partial-view outcome `2`.

The new partial-preview freeze is
`/tmp/oink-r7-partial-preview-runtime-freeze.json`, SHA-256
`c426ce3e641ed7b39bb711a26006306cab22e761c5062f2164f10deb4bea8765`.
Its 113 runtime inputs bind
`4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84`;
193 broader inputs bind
`8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`.
Only `internal/studio/preview.go` changed among runtime inputs. The broader
changes also include its test and `scripts/test-studio.mjs`. All three UI files
retain their exact bytes and modes. Focused core final race passed in 1.748
seconds, with vet and scoped whitespace checks also passing. Its receipt,
`oink-r7-partial-preview-owning-a56dunn4/receipt.json`, binds SHA-256
`7b6ecb491f283d04fe54347e564dba426b1a84d152040a1d945af54bc67756ac`.
In the initial sparse-fixture mode trial, host umask `0077` made a
requested `0640` file actually `0600`; explicit fixture chmod to `0640` corrected
the setup. Focused proof covers normal
`200`, oversized `GET`/`HEAD` `413`, changed identity `409`, private path `404`
and refusal for other unknown output errors.

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
Go/vet run.
The new whole actual-Hugo/pinned-tool invocation subsequently completed with
exit `1` after 285.649 seconds. Its sole failure was the parent's unavailable
Markdownlint preparation path `/md/node_modules`. All other actual cases passed.
The log is
`/tmp/oink-r7-partial-preview-hugo-gate.log`, SHA-256
`1ab6b8cfd399d484e08a1d1f05d25475754caa731991dd1eec1cca03cf6ce970`.
The sole owning case was rerun with the exact provisioned
`/markdownlint/node_modules` executable. Source/runtime did not change. The case
passed: application package 2.317 seconds, wall 3.265 seconds. Its receipt is
`/tmp/oink-r7-partial-preview-corrected-tools-gate.json`, SHA-256
`62b75e563e8074995ed9dd354434e653b2f5f2c6d20767226286d0c08d4c667c`;
log SHA-256 is
`e9bddac210654d219d9c5d6ebabaa3b91a0f5f4de4daf228b3ae21aeaac7673a`.
The executable comes from provision receipt
`268e601e81bc03a263296d57257b85635371bda642d0632532a7d9318c981461`.
The independent case-matrix/held-source audit verifies cumulative executed
actual-owning-case coverage `0` from the whole invocation plus that
corrected case. Its receipt,
`oink-r7-partial-case-matrix-audit-16_bl9hr/receipt.json`, binds SHA-256
`0a9e4a1a1e1a08f597becb2f27e743c9f23df672c713c2757241704edb16b51e`.
All 113/193 physical/logical inputs remain frozen. Optional
`TestArtifactCorpus` and `TestPublishedRuleSourceProvenance` cases were explicitly
skipped.

The new post-Go input audit,
`oink-r7-partial-postgo-audit-g1hcqdtl/receipt.json`, SHA-256
`b369737ec48456f673c850ea702cb3cb7efffb8ecc129d87e00dc03af82b2e3b`,
then confirmed the complete held 113/193 physical/logical inputs after Go/vet.

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
Actual Hugo emitted `oversized.bin` at 67,108,865 bytes. A request through its
rendered `/sub/oversized.bin` link returned `413`. Ordinary actual HTML
returned `200`. Required partial preview coverage stayed visible. The CLI/API/UI matched
228 typed native diagnostics and native coverage/outcome `1`.
Studio and the subsequent refresh returned `2`. Source preservation still
excludes only the declared task-fixture external edit.

Another prepared corpus driver had assumed that an available normal
preview always appends a `studio.preview` coverage row. Actual normal
Starter/docs/PIG Overviews do not emit that row, so the driver assumption
was corrected without changing native coverage. The repaired fresh
`oink-r7-corpus-partial-pZLwY0` driver, SHA-256
`47778df62505beeb7432985be927f1b001e03824e9dee3a6dbed9d9b2dbe049c`,
was reviewed against those three retained actual Overviews and the current
partial browser capture. Normal availability still requires its actual preview
URL and independent HTML `200`. A partial capture retains its actual required
row, omitted count/identities and `413`. The preparation audit is
`oink-r7-partial-driver-correction-audit-sa98cm6k/receipt.json`, SHA-256
`a519a5bc6ae83438146ff4710d53f5edb0e656a05d0532c02123e5771416f07e`.

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
Runtime 113/broader 193 inputs and root physical identities stayed frozen.
Every operation and the overall boundary preserve all four consumer bytes,
full modes/types, logical/mutable Git, ignored copied inputs and directories.

| Consumer | Native outcome | Typed diagnostics | Studio outcome | Actual captured pages |
| --- | --- | --- | --- | --- |
| Starter | `0` | 28 review-info records | `0` | 66 |
| docs | `0` | 144 review-info records | `0` | 343 |
| PIG | `0` | 120 review-info records | `0` | 248 |
| repo | `1` | 10,462 existing duplicate-ID findings plus 788 review-info records | `2` | 1,576 |

Nested native headers, typed diagnostics, coverage and exit match direct CLI
checks exactly for all four sites. All issues were paginated. Other views
used bounded samples. Captured physical source and translation diff were
available on all four. The first three actual production previews returned
HTML `200` and emit no `studio.preview` omission row. The repository normal HTML returned `200` with 60,100 bytes. Its current
capture exposes four oversized print paths, where each actual `HEAD` returned
`413` with zero response-body bytes:

| Captured omitted relative path | Captured byte size |
| --- | --- |
| `_print/pkg/index.html` | 73,976,221 |
| `_print/pkg/pgsql/index.html` | 69,903,999 |
| `zh/_print/pkg/index.html` | 73,086,240 |
| `zh/_print/pkg/pgsql/index.html` | 69,052,754 |

Required `studio.preview` remains
incomplete, so repository Studio `2` retains native `1`. Actual analysis-only
draft routes returned production `404` in docs and repo (Starter/PIG had no unique captured draft route). Workspace
subset/full/healthy-subset sessions selected only registered sites and closed
listeners without captures. Unknown or selected missing sites returned `2`
before startup. Independent final corpus audit
`oink-r7-final-corpus-audit-xr3_u5dt/receipt.json`, SHA-256
`b8a8eedf5c899fe5830bdde959783c46b3f191ab144c0d3798077555d55238fc`,
verifies raw typed native/API/shutdown parity, all 132 operation preservation
comparisons and four overall guards.

For temporary disk capacity, the parent retired three private Go build caches totaling 366,184,826 bytes, as recorded in
`/tmp/oink-r7-private-cache-retirement.json`.

### Remaining stage gates and promotion boundary {#r7-pending-gates}

| Required gate | Current status |
| --- | --- |
| Frozen runtime input/binary identity | New partial-preview freeze binds 113 runtime inputs `4900ae05abbdf4409b0be54f276fb4135269cf0a49e9071013ccf42544d35c84` and 193 broader inputs `8b172cef2b228e2642f0139d6cc569136e86843f818e52e412fa4a2d56add25d`; all UI bytes/modes unchanged. Source-bound browser binary `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` passed; fresh private consumer rebuild is byte-identical |
| Full Go/vet and actual Hugo | New whole serial Go/vet and browser passed. New actual-Hugo/pinned-tool whole invocation remains exit `1` for a preparation path; sole corrected owning case passed `0`, yielding independently verified cumulative executed actual-case coverage `0`; two optional cases explicitly skipped |
| Four consumers | Completed exact-binary CLI/API qualification; native `0/0/0/1`, Studio `0/0/0/2`, exact nested native parity and source byte/full-mode/type/Git/ignored-input/directory guards; repository partial preview remains required incomplete |
| Canonical paired sources/render | First guarded TEN promotion and scoped actual render passed |
| Stage decision | R7/A16 supported local scope accepted |

The documentation installer retains the actual captured old inode
outside canonical source storage on both success and recovery, without
unlinking its last name after an earlier target identity check.

The completed first-promotion rendered gate is
`/private/var/folders/df/bfm8q07d7bv3kpjf1fjchq4m0000gn/T/oink-r7-docs-render-n8tw2tbw/summary.json`.
Its SHA-256 is `35e79f51d39803b3e4cdf134ed277957dd627acba42e0e0dc785e4745ec3c481`.
The log SHA-256 is `de3a07eac661c15805070e0ed2e364a71ebbd38e15d8907aab3bdf716e95131d`.
The run took 63.33 seconds. Exact qualified binary `f39d6754f7ad13599e4e849394e0f470b2c6f26edf96ce40f199d27b65a8030e` passed production CLI links with one strict Hugo build. Ordinary production Hugo without a probe passed rendered Markdown (214 pages/44,075 text nodes) and links (345 pages/48,482 internal links/4,303 fragments). Its translation owner retained exit `1` only for the existing nonpublished release `1.2.0` draft. Independent draft/future/expired analysis passed Markdown (216 pages/44,381 nodes), links (347 pages/48,858 internal links/4,331 fragments) and translations (137 pairs/1,129 headings).
Source translation/style/whitespace checks passed and CLI/docs schema `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda` remained identical. All twelve operations, schema and overall guards preserved 421 primary files, 427 copied inputs, 109 directories, 36 mutable Git files and 113 runtime inputs.

The first guarded promotion receipt is `oink-r7-root-promotion-p9g1u7pz/summary.json`,
SHA-256 `323a5ce267e39aaf8f97dc4a12cccbdde83730155a199efb5f3815e29b334e4a`,
verifying that actual original inodes are retained outside canonical source.

## R8 accepted reviewed editing evidence {#r8}

R8/A17 supported editing scope is accepted locally after the corrected frozen
owning/browser/corpus and guarded canonical rendered gates recorded below. CLI `edit text`, `field`, `snippet` and `attachment` preview the same
bound `oink.edit/v1` intent. Explicit `studio --edit` uses this intent. Saved-plan apply or
explicit acknowledged Editor Apply owns selected source writes. The default
Studio session remains read-only.

### Candidate scope and preservation {#r8-scope}

Known site-owned UTF-8 Markdown is bounded to 1 MiB. Full text and supported
ordinary top-level YAML scalar forms retain the declared BOM/line-ending and
source-span preservation boundaries. Unsupported form shapes remain text.
Exact `value_json` numeric tokens avoid browser Number rounding. Scalar forms
limit numeric literals to 4,096 bytes and absolute decimal exponent 10,000.
Larger/nonfinite constructs remain manual text. Field JSON is at most 1 MiB.
Escaped lone surrogates are refused. Valid Unicode pairs are supported. Catalog
components use original UTF-8 body byte offsets. Attachments require actual
leaf-bundle identity, at most 4 MiB and an exclusive new clean basename.
Source hashes, full modes, all site/external inputs, regenerated intent and
fresh actual Hugo validation bind the same shared guarded application path.

The Editor displays the complete UTF-8 review, selected-file base/after
identity and native candidate result. The review is capped at 2 MiB. Its
literal bytes are hash-checked before acknowledgement. The actual selected
candidate HTML is draft/future/expired analysis, visibly nonpublishable and
separate from the original production preview. Required candidate-view
incompletion may raise the proposal/session to `2` without changing native
findings. For page-file edits, the selected candidate source hash/full mode
matches its reviewed After state. Attachment/no-op proposals retain the
selected page’s reviewed Base state.
Stale/replayed plans, attachment collisions and untrusted preview requests are
refused. Applied-with-refresh-error remains explicitly applied.

### Focused preparation receipts {#r8-focused-gates}

| Candidate evidence | Current observation and boundary |
| --- | --- |
| Pure editing core | Owner's focused exact-numeric tests passed for `18446744073709551615` and `7.12345678901234567890123456789`, exact no-op raw bytes and changed final decimal digit; broader frozen receipt pending |
| Actual DFE output ownership | Live ordinary output is copied through a confined `os.Root`, exclusive target files and guarded streaming reads; files over 64 MiB can be captured while serving limits remain unchanged |
| Copy cancellation/race | Context-aware helper focused `0` in 0.703 s, race `0` in 1.856 s, vet/whitespace `0`; actual first-chunk cancellation retains partial output, source bytes/modes/identity unchanged; source FIFO replacement cannot block before descriptor proof |
| Helper log identities | Focused `c227a88210ab0dc46b24eaff50a347d5c494e9ce23f5bdef5d5b822efab4976f`; race `13f0616d55fd4df791ecded0712a18096392c88cb9b849383414c305e50b6779`; vet is empty SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| Read-only candidate integration review | Selected actual HTML URI/base prefix and inventory, retained private DFE lifetime, source SHA/full-mode equality, native versus view coverage and cancellation reviewed; no new material defect found within this code review scope |
| First Editor browser trial | Harness stopped on ambiguous global Open editor selector; retained as failed trial |
| Corrected-selector Editor trial | Desktop field/component/binary apply checks and axe checks passed before 320 px draft-review horizontal overflow failed; retained original trial |
| Narrow layout correction | Editor review hashes/receipt text wrap and intrinsic widths are bounded; prior CSS and failure evidence retained separately. Development rerun passed 12 axe checks/screenshots, including real 320 px dark review and light receipts/refusals; final frozen-source/binary rerun pending |

The preceding preparation rows were captured before the first complete R8
freeze. The first whole frozen gates later
passed for binary `84b804d3246a5be581e44884ed910fa3f45d8be29734b8babdeeb763a11fa882`
(`0.5.0-r8-local`), runtime 123/`58517b8e98b80df6642be4ee6275a0074ec187768b20e009f41da2607b635d46`
and broader 212/`d81335c78413acc60e27adee0ac794862285e41cb2a3a7687ec820c1065ba003`.
The whole-gate summary is `b49f4a3272af3e3dcc92e7e9b38d4289bb49cb19aa3e9354ea148d2d8cb2cea8`:
Go tests `0`/56.523 s, vet `0`/0.904 s, whole actual Hugo plus all three pinned
tools `0`/320.044 s, core race `0`/16.610 s and public R8/helper race `0`/48.319 s.
Its source guards passed.

The first frozen browser receipt
`eb6977235ef9ae6cec28651b5654eb101685af67abe0cbed0acb0f8375458d9c`
binds that same binary and source freeze. Editor had 12 axe runs with zero
violations and 12 screenshots. Retained read-only Studio had 14/zero/14.
The actual form preserved the literal `1e400`, its planned after hash and diff.
It then discarded the proposal. Exponent ±10,001 and a 4,097-byte numeric literal
were refused locally without an API request. Four acknowledged field/component/binary/draft
applications occurred only in disposable fixtures. Default read-only refusal,
stale preservation, no-op source bytes, preview isolation and native-result
independence passed.

The first exact-binary consumer trial then stopped at Starter after 37.533 s.
Its immutable failed-trial receipt is
`853a8397ba4c527c03aa3cc9ac7cacc41c0ab0379549d145b874f1d1ecc3901c`.
Two failures are recorded separately. A driver event hash depended on JSON
object-key order. Recursive comparison nevertheless proved API/CLI arrays equal:
28 diagnostics, 29 coverage rows and native exits `0`/`0`. Separately, repeated
resolved cache capture produced a genuine duplicate module input,
`.gitattributes`. Required candidate graph capture became incomplete. Mutation
outcome was `2`, and native check remained `0`. There was no actual selected
DFE HTML or applicable lease. The public published-cache fixture reproduced that defect;
its retained failing log is
`50ab704e715665096e0f36391bb1364841c3a2b2ac88dd262915ce53fb66afa6`.
All 48 recorded per-operation source proofs and four overall consumer guards
preserved bytes, full modes, types, Git, ignored copied inputs and directories;
root inputs stayed exact. No Apply or saved plan was performed.

The narrow runtime correction gathers complete resolved-module rows before
committing additions. Identical repeated or reordered captures retain the
original inventory. Changed hashes/full modes and added or removed paths within
an existing scope are refused. Missing scopes, conflicting identities and capture
errors are also refused. Refusal does not refresh prior evidence or append partial
additions. Non-module rows remain exact. Site owning receipt
`e7b284b9dece1c5f2b696cd76166d2286fcbec69e6c48912ab9a78204bdb980b`
records focused `0`/0.746 s, site `0`/2.123 s, focused race `0`/1.958 s and vet
`0`/0.167 s.

The corrected published-cache receipt
`6358dc81f06e34b789cb47a0f4442d6d036d2e33423a06f5dbe85b3064766da6`
records actual `github.com/pgsty/oink@v1.1.0` from a task-local copied checksummed
archive, with no downloads or replacement. Original and candidate graphs each
have 1,256 unique inputs, including 1,198 module inputs. Full API/CLI typed
diagnostics, coverage, exits and plan identity match. Actual selected DFE HTML
returns `200`. Source bytes/full modes/Git are unchanged. No Apply or saved
plan occurred. Owning race passed in 30.255 s; vet passed. Its corrected race log is
`c7d21a30b8af141d9d9604a80ddf9cf3f608320b97a441a06a742376e2119551`.

The current complete corrected freeze is
`fb276500a3d2643bd0aa220f8bebb380fce2c98493d62b0502b6497b2f02949f`,
runtime 123/`cdf629eeb4bbef6d4d88ee27fe3fb0a73b07b6bf6438336e033a18fb7feb1c17`
and broader 212/`f6e305e792733a550814eb841615d12fa14a9a6bb2a97c4ada85f7275183e579`.
Only `source_inputs.go`, its owning test and the public published-cache test
differ from the first freeze. Held UI/helper bytes and all full modes remain
unchanged. The rebuilt candidate is
`bd25f9e0b35ec10e227aabf9582ae40b0b367390f64b93668de6ae85222c3d71`
(`0.5.0-r8-local`). Its observed corrected source-bound browser receipt
`33a698985a55c14c3e64e981da1f8e74c686497083dc0edb241406f185e3eeb8`
again reports Editor 12/zero/12 and read-only 14/zero/14 with complete 123/212
pre/post source preservation.

At the next evidence observation, the corrected whole gates completed for
that held `bd25f9e0…22c3d71` binary and `fb276500…02949f` freeze. Summary
`208f156c0954e803eccbada678a4689683dc1576c543c379e5cc04b3497ef772`
records Go tests `0`/57.826 s, vet `0`/0.521 s, whole actual Hugo plus all three
pinned tools `0`/378.847 s, core/site/Studio race `0`/17.937 s and public
R8/attachment/output-helper race `0`/85.159 s. Every gate's source pre/post guard
passed. The actual-Hugo log has 434 top-level passes and zero failures. The two
optional external fixtures `TestArtifactCorpus` and
`TestPublishedRuleSourceProvenance` remained explicitly skipped.

The corrected whole actual-Hugo log is
`4eb1a2afdce2adbe570b10922fd53b6d8954f7c95747370c3c661e94d2f71a05`;
Go log `ea59463e9649ffe2f8aff9da66c91cf6895c86fde96a524db23c89cd4eb35925`,
core race `cdd3d761b5ca7b5e986b25aee3129d65663e3e5ebb83eecb6fbb080387298a58`
and public race `bb610bdcd7a299cb9b66f4c69e30e246c20546efae47653c01d350b1026ea2de`.

The 434 passes and two optional skips above are top-level counts. The same
whole invocation also skipped the nested Unix-socket refusal fixture because
the Darwin temporary pathname exceeded the socket limit. A first shorter
private-path trial still skipped. Receipt
`93106854ca890b497d3c74522b895f597ac60cec55ced42cad7b187d334da200`
retains process exit `0` and records no actual socket execution.

A subsequent nonresolved short private `TMPDIR` executed the same frozen
socket fixture under race detection without a skip: `0`/2.954 s. Receipt
`531a503b3b91e1b423c2be61b92ed806d3a813738c38d57e5ec122577b4337f9`
and log `236c84f1842ffce76174c834f3888718a109cec6377ada6f3242b02f551f00b3`
bind `fb276500…02949f` and all 123/212 logical/physical/Git inputs unchanged
before/after.

The corrected four-consumer trial subsequently completed in 845.705 s. Summary
`af4fc53326163c4a03aa2982c1f01363fbbdd5a447c9baed3639bd8599d46370`
and qualification receipt
`4d6fd02543c1920497e1a1bb0a68fcf89b0546130fd9cc12c1df391b7e673e75`
bind a byte-identical private rebuild of `bd25f9e0…22c3d71`, the complete held
123/`cdf629ee…feb1c17` runtime and 212/`f6e305e7…5183e579` inputs. All 2,383 entries of the first failed
trial retained their exact bytes/full modes/types.

| Corrected consumer | Native/current and native candidate exit | API candidate outcome | Full diagnostics/coverage | Actual selected analysis HTML |
| --- | --- | --- | --- | --- |
| Starter | `0` / `0` | `0` | `28` / `29` | `200`, 48,149 bytes, `/blog/design/content-model/` |
| Documentation | `0` / `0` | `0` | `144` / `34` | `200`, 61,738 bytes, `/blog/oink/immersive-reading/` |
| PIG | `0` / `0` | `0` | `120` / `41` | `200`, 55,641 bytes, `/404/` |
| Repository | `1` / `1` | `2` | `11,250` / `29` | `200`, 92,352 bytes, `/blog/infra/2020-12/` |

These are actual selected Hugo HTML routes in the separate, visibly
nonpublishable draft/future/expired candidate view. Each expected candidate
marker was present. API and CLI matched full typed diagnostics/coverage, native exits, and plan ID.
They also matched Base/After hashes and full modes, unified diff, and the
selected page’s proposed source. The complete literal API review and its hash were independently
validated. No consumer Apply or
saved plan occurred, and no listeners remained. The repository retained
10,462 existing duplicate-ID findings and 788 information records. Its four
actual PRINT outputs remained required partial-preview incompletion:
`_print/pkg/index.html` 73,976,221 bytes,
`_print/pkg/pgsql/index.html` 69,903,999 bytes,
`zh/_print/pkg/index.html` 73,086,240 bytes and
`zh/_print/pkg/pgsql/index.html` 69,052,754 bytes. Each bounded HEAD request
returned `413` with zero body. Selected in-limit HTML remained `200`. Native
`1` remained unchanged. Proposal/session `2` and Apply refusal stayed visible.
The other three complete previews had no invented explicit complete-coverage
row. Actual guarded HTML `200` supplied the evidence.

Exactly 53 protected operations each checked all four sources: 212
per-operation source proofs plus four overall proofs, with source bytes/full
modes/types, copied ignored inputs, directories and logical/mutable Git
unchanged. Each source proof compared four inventory categories, yielding 864
raw inventory pairs including the overall comparisons. All 53 root guards and
the final complete 123/212 logical/physical inputs also matched. All issues and
pages were paginated. The other five view endpoints were sampled to their
first 50 records. Each site included one known source and one bounded diff. Full
native/CLI record parity used the declared bounded complete-record codec.
Object order was canonicalized. Array order, types, null and field
presence remained significant.

Independent audit receipt
`6b72ca06d8392a5271fc40757f176f26e1144c21eec93dbd035e0a1bd645657b`
verified 69 artifact hashes, complete bounded API/spool/shutdown typed records
and the large native/CLI raw-file digest bindings. Its additive receipt
`335f137663d4ec0b2a0d3e49c8d70b9918f86078ab6264855171a2644d8aa6c6`
also verified the fresh current root's complete logical Git inventory against
the freeze. The original audit stayed immutable.

The reviewed first TEN promotion subsequently passed through the guarded
retained-inode installer, root receipt
`7cd9b4604d2340b9e46965a26281c921b967060909d518b8b4b31e5f42d0120c`.
Its actual original source inodes were retained outside the documentation
site. Unselected source/copied inputs, directories and Git, and complete CLI
123/212 logical/physical inputs stayed unchanged.

The canonical render then completed in
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

Source translations passed 137/137 pairs and 1,143 headings. Chinese style
passed 137 files/181 strong spans/zero emphasis. Whitespace passed. Schema
SHA-256 `7468c2d04cde8a368ce0ba44a1f27125b5fca364b6d4672353519b9545b3bdda`
matched exactly. All 12 commands, schema and overall guards preserved 421
primary source files, 427 copied inputs, 109 directories and 36 mutable Git
files, plus all 123 runtime/212 broader CLI logical/physical inputs. The
qualification receipt binds 60 canonical inventory pairs, 15 CLI guard pairs
and six private-copy source pairs.

R8/A17 supported local editing scope is accepted after corrected owning,
socket, source-bound browser, exact-binary four-consumer preservation and
these guarded canonical gates. R1–R8 are accepted locally. Native repository
findings and required partial-preview `2`/Apply refusal remain visible. The separate
platform-authority audit
`762571dab9a07651ac8e4c71764bfef292f8d5eba729a089e72d9d755b7e2d7c`
confirms that the initial contract qualifies actually exercised architectures:
macOS arm64, native Linux arm64 and emulated Linux amd64. Darwin amd64 remains
an experimental archive with failed actual execution/unverified runtime.

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
| Final A18/platform/archive delivery | Completed in the 2026-10-04 supplement below |

Prior R1–R7
sections, whole-invocation failures and scoped acceptance receipts remain
unchanged. Temporary qualification files stay outside canonical content and
Git.

## Current runtime completion supplement on 2026-10-04 {#a18}

This supplement records the current candidate on 2026-10-04 (Asia/Shanghai).
The dated page URL and all initial 2026-10-03/R1–R7 records remain unchanged.
The three UI
files retain the browser-qualified bytes and full modes. Current Go,
Hugo, platform, archive and four-consumer checks refresh the changed backend.

The first current ARM offline unit run exposed an output-copy integrity gap.
On ext4, adding a directory entry could preserve the parent's allocation size
and observed timestamp. That failed run stopped before later qualification steps. The
correction captures and rechecks actual sorted directory membership and entry
identity. It also checks regular-file bytes and full modes. Only
`internal/app/studio_output.go` and its owning test changed. The failed receipt
and independent audit are retained.

The preceding integrity-correction qualification freeze is `683daca0e522193c7ff1b0de6ac2fee5d2fca080811bf184a8dfd5b90a33f224`:
123 runtime inputs hash to `d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`,
and 212 complete CLI inputs hash to `2abd1a044d8192b07f9bbc06b55dc8b4544d66ca17b8867971cec702ba3af088`.
The `0.5.0-r8-local` Darwin arm64 candidate is
`74ad94e73557f6538cd64edd1766d6df92c596d98411031159d94af072c186ec`.
The integrity-correction receipts below bind that source scope. The later one-test
fixture amendment has a separate complete source identity and completed formal
qualification boundary. Both are recorded below.

The current complete source freeze is now
`196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`.
The 123 runtime inputs remain
`d346ad15cd4239004e32e1b9f30d727eaf156be0187dc165ca874032a7cf962a`. The 212 complete CLI inputs are
`2c487bfb4c65ed40ff78356b2860de627e6ac1afa0da2df433b09345dab7f5b0`.
Only the owning published-cache test changed, to source
`54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`.
The fixture amendment is separately guarded. Production bytes and all semantic
assertions remain unchanged. Formal qualification of this complete source
passed. It includes the current eight owning gates, reproduced archives, and
full plain-Go AMD/ARM runs. Root A18
proof `2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` binds all three declared supported targets and five reproduced
archives.

| Current proof and preserved earlier input boundary | Observed result and bound receipt |
| --- | --- |
| New complete-source formal qualification | Freeze `196245a3ba09305e34b86539c8eb79f1473e4373ee47aa1f56f8933b04a42d43`, owning test `54c10ef89310256b5f4c165c7de5de9668e1d4d2991b71751076680141dbe779`, unchanged runtime123. Current eight gates, host/archive and both full plain-Go Linux flows passed, bound by root A18 proof `2c018cb2afa3f26699a9e6b5a0971096246b12405fde5a27e43a9e213e46da60` |
| Narrow integrity correction | Owning receipt `6966d768025497b45958073d4c53a2a2981065c8a95857834dcf6a4faa4f0201`. Independent audit `6cb5d2eabf57b41079026a38a674f46def9f56a15df17ad27e671e4f765798df` |
| Prior-source six frozen owning gates | Build, full offline Go unit/vet, whole actual Hugo/pinned tools, core race and public R8/output-helper race all `0`. Elapsed 3.501/68.257/3.909/333.801/37.070/79.670 seconds. Summary `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`. Independent audit `20780662b7ff35019b2c8c84e6dc763f9351ae0816f6ef7a7789f7a15be99167` |
| Eight current frozen owning gates | Selected published-cache actual Hugo and race, build, full offline unit/vet, whole actual Hugo/pinned tools, core race and public R8/output-helper race all `0`. Current summary `d6272fcc4dfab114aecfcdf19a7e2b78f1e931817331b460f43ff2056bf754a4`. Raw whole Hugo has 435 top-level passes, no failures, two optional top-level skips and the explicit long-path socket child skip. Runtime/binary bytes remain identical |
| Prior-source Darwin arm64 and archives | Current extracted candidate runs outside the checkout with no consumer Node requirement. Seventeen commands and eight actual process tests, including child signals, passed without process-test skips. Two fresh release directories contain byte-identical five archives and checksums. Source/license/provenance/canonical tar checks pass. Summary `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1`. Independent audit `60a04771365d8be15ac91fbbd8d485b019aae081598e468018861ca5734e387c` |
| Current Darwin arm64 and deterministic archives | Seventeen extracted-archive/ordinary-Hugo/process commands passed expected exits, with missing Hugo explicitly `2`. Eight actual signal/process cases ran without skips. Two independent fresh builds reproduced five byte-identical archives from current complete source. Summary `3890fd8468b6bce5271bb32ffa1a18bd5daf99c19c43becac0be8e3b908a5d57`. Source, tools, module-cache and smoke-source guards remained equal |
| Prior-source Linux arm64 | Actual nonroot Linux arm64 on ext4 with Go 1.27.1, Hugo Extended 0.166.0 and Git 2.47.3: full offline Go unit/vet, all 13 required pure top-level pass records and the membership case plus its four children without skips, 10 selected actual-Hugo cases without skips, native rebuilt archive identity, installed bilingual/offline/ordinary-Hugo/missing-Hugo `2` JSON and signal/source-mode checks passed. Guest summary `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7`. Outer receipt `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898`. Exported-record audit `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` |
| Current Linux arm64 | Current nonroot Linux arm64 ran on ext4, with native ARM through QEMU HVF and Go1.27.1/HugoExtended0.166.0/Git2.47.3. Full offline unit/vet passed with 370 top-level passes. The following cases passed without skips: all13 decisive pure cases and4 membership children, and 10 selected actual-Hugo cases. Exact native/installed current archive identity and bilingual/offline/ordinary-Hugo/signal flows passed. 24 commands reached expected exits, including missingHugo2. Guest `268102f69c0950f9d2994d22cd2fd290fc11e24bd6d6f916fd70a93ca4946c74`. Outer `f3c066fdc9b97feff92160346185a1af978a5172eed5c81904ac7c0e5fc6c982`. Source/SDK/borrowed/old-task guards were equal. The owned VM was reaped. Default optional unit skips retain their named gating reasons |
| Prior-source Linux amd64 failed trial | Preserved current TCG trial failed. Outer receipt `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`, guest summary `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240`. Full offline units (370 top-level passes), vet and the first three selected Hugo cases passed. The published-cache candidate request reached the test HTTP client's 90-second deadline. Candidate parity, the remaining six selected Hugo cases, native rebuilt archive and installed archive smokes were not reached. Deadline review `12917b9eb89e3abc5893e08da3b6b6e20743dcb4c14e6f7ba8561628e3566934` |
| Current Linux amd64 | Current nonroot Linux amd64 ran on ext4 under QEMU TCG emulation, with Go1.27.1/HugoExtended0.166.0/Git2.47.3. Full offline unit/vet passed with 370 top-level passes. The following cases passed without skips: all13 decisive pure cases and4 membership children, and 10 selected actual-Hugo cases. Exact native/installed current archive identity and bilingual/offline/ordinary-Hugo/signal flows passed. 49 commands reached expected exits, including missingHugo2. Guest `3a1a32979efc843de8b95b7c13824026e17f71c06d4c458b738c0b9583fb4723`. Outer `30cf4950cc83fa0732047d9a0f89bb59e68779ee2e8f5c755724c9679be265e3`. Source/SDK/borrowed/old-task guards equal and owned VM reaped. Default optional unit skips retain their named gating reasons |
| Runtime-equivalent preceding four-consumer candidate corpus | Source epoch `683daca0…33f224`. Runtime123/binary74ad is byte-identical to current `196245a3…42d43`. The corpus was not rerun after the test-only amendment. 853.249 seconds. Native/candidate-native `0/0/0/1`, API/view `0/0/0/2`. Diagnostics `28/144/120/11250`, coverage `29/34/41/29`. Summary `a1e98ca3e10095a1134381666bacf256f8e8827cd3900c9e811b7120de4c2974`, receipt `05c4562a50d9f83ba2c99879ec841870c5e753199e41792bd5bc718cf8046e7b`, independent audit `3a1b0b6e3a8c6b1a0d82c5f82b46c84b1e44d6c30bab655610cb9e86e6a30b47` |
| Final canonical lifecycle and rendered checks | The promoted TEN bytes use independent canonical rendering and navigation/URL receipts |

The preceding six-gate `b40b7787b3da8dc1e0763812b6dde529b4b5b69fe479d79940f1161223124e1d`, host/archive `bcb4d7599e965c1b3cfe7fe698ca14061ad53d45e7a194337aeebb8d37aa77c1`, and ARM outer `a022e40f068703cd59ce6d6a7fb6530cce6907681baa26eb1dfc77c09f0c8898` / guest `409990bc1425f4bf219f8911a71581af6e68729865580121dbeb6d85a06d2ea7` / audit `24afc50f6f860394d1ebfa7a8b754ddd9cb97f9e88a0dcfcbcb659193ecbfe5f` remain retained alongside the new exact-source proof. Historical 26 axe checks/screenshots and 22 codec cases are carried with unchanged UI/codec/runtime inputs.

The initial `max`-CPU AMD trial remains failed: receipt `3543664ba5590f2ba5a8f676b196bb636b72bc819913289f415d0a8a841c1bdb`, guest summary `16075204d287713c7f7650c0a65dd289dd4bd83db07c9ba4b85b3f21244d5240`. The test client timed out after 90 seconds while awaiting candidate headers. Candidate parity and the remaining six selected Hugo cases/native rebuild/installed smokes were not reached. Guest inputs stayed exact. The host guard recorded only a `.git` directory timestamp change. The separate qemu64 one-test preflight also failed at the unchanged 90-second HTTP client deadline: outer receipt `fc68173ccdfd8ce263ecdf082a533d9da666a4cc2e1e5e29880ee827286132ac`, guest summary `e350ff65feeee166ffac1d337db9bbd70d3895b1fb6d93df0a30ca4de09019fc`. The named case took 177.71 seconds. The first trial took 176.64 seconds. Its inputs remained exact and its VM was reaped.

A later Go-overlay diagnostic preserved the same
production source and every original semantic assertion. Outer receipt
`0bc6d563b7cd9ca862717c2123ee0836d83b6b927d00204a0b031049c38e93f0`
and raw-bound classification
`66a1422cdb79ab9f1cf683f441ade0ce4adb4a7a666d524c4b9ed98ebee28708`
record a passed named case in 352.40 seconds. Original capture took 26.254 seconds,
Studio capture 26.211, candidate HTTP 94.312, direct preview 94.318 and CLI
preview 81.962. Both graphs retained 1,256 unique inputs, including 1,198 module
inputs. The original-capture context had expired when the HTTP result arrived. Fresh
independent direct/CLI contexts completed normally. All 20,564 host guards and
five guest command guard pairs stayed exact. The owned VM was cleanly reaped.
The scoped owning-fixture amendment now uses a 300-second budget
for that candidate request and fresh direct/CLI operations, about 3.18 times the
slowest observed operation. General/original-capture 90-second limits, restoration
of the shared client, shutdown 15 seconds and Go's default ten-minute cap remain
unchanged.

The consumer driver compared complete typed diagnostics, coverage, native exit,
PlanID, selected Base/After/full modes, unified diff and selected source between
API and CLI. It separately verified the complete literal API review and its
hash. For attachments and no-ops, the selected page retains reviewed Base.
Page-file edits match reviewed After. Nonissue views are bounded samples. All
issues and pages are paginated. The 53 protected operations have 212 all-four
per-operation source proofs plus four overall proofs (864 raw inventory pairs
across four categories) and 53 root pairs. Seventy-one retained artifacts are
bound. No Apply, saved plan or consumer write occurred. The completed corpus's
file-only collector needed two preserved metadata corrections for absent
historical trial/self-test files. No CLI/Hugo operation was rerun.

The repository retains its 10,462 pre-existing duplicate-ID findings and 788
review-info records. Its selected actual DFE HTML is available. Four oversized
actual PRINT files remain unserved (`413`, zero response body):
`_print/pkg/index.html` 73,976,221 bytes, `_print/pkg/pgsql/index.html` 69,903,999,
`zh/_print/pkg/index.html` 73,086,240 and `zh/_print/pkg/pgsql/index.html` 69,052,754.
The 64 MiB per-file preview bound is unchanged. Required partial-preview
incompletion remains `2`. Native findings remain `1`. Apply is refused.

Linux prerequisites were prepared in exclusively owned guests from signed
Debian metadata. Exactly ten new packages and three approved existing-package
updates were verified before and after installation. SDK/Hugo/module caches were
provisioned separately and reused offline. Qualification runs as an ordinary
user on ext4. Cached inputs and all 212 source files’ bytes/full modes stay guarded.
Default unit skips retain their actual gating/not-applicable reasons. All
required pure top-level cases, no-skip membership children, selected Hugo cases,
and signal cases must execute.
Linux amd64 uses QEMU TCG on the ARM host and is explicitly emulated. Darwin
amd64 remains an experimental archive. Actual execution returned Bad CPU type
(errno 86). Windows
is outside the declared scope.

The current Linux archive digests are `ac883e54a1df0b820696279c63881ba75a00d279f507330128fe8d5aff59c52e`
(arm64, 4,552,687 bytes) and `2dde43bf94ef35aac2111b07dcb9b2766fbf9f883fe39ccd646d14a98b94d734`
(amd64, 5,034,668 bytes). The preceding `683daca0…33f224`
archive digests `c191383af21913be6940ec41be11755b3d985344bbc0f65cc3f5de16424a96a4`
and `6531b27d889260afe804c1f49f37541fbae46e57b5d17a20178c28cb51968794`
remain historical. SDK/guest preparation failures, the first ext4 membership failure,
and earlier private host metadata/resources trials remain immutable evidence.
Uninvoked E1–E4
extensions are separate inactive scope.
