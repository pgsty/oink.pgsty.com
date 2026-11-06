---
title: CLI maintenance acceptance on 2026-10-03
linkTitle: 2026-10-03 CLI maintenance
description: Dated source and binary evidence for the local R1–R8/A18 program, preserving the initial audit, failed trials, and final acceptance scope.
weight: 55
icon: fa-solid fa-magnifying-glass-chart
search_keywords: [OINK CLI, maintenance, acceptance, translations, CI, Studio, preservation]
design_kind: research
design_status: finalized-locally-validated
last_verified: 2026-10-04
---

> [!NOTE] Historical CLI maintenance acceptance ledger (2026-10-03 to 2026-10-04)
> This record preserves the initial audit, intermediate trials, and local R1–R8 and A18 runtime/archive acceptance for the CLI maintenance roadmap. On 2026-10-04, the CLI surface was simplified to the Cobra/text/JSON/YAML command set defined in the [current CLI contract](/docs/design/decisions/cli/) and [CLI introduction](/docs/cli/). These results apply only to the recorded historical source and binaries; later changes to the reduced CLI require separate validation.

## Scope and evidence rules {#scope}

The [maintenance roadmap](/docs/design/proposals/oink-cli-maintenance-roadmap/)
defines the authorized R1–R8 scope. The [current CLI contract](/docs/design/decisions/cli/)
defines its compatibility baseline; the [original roadmap](/docs/design/proposals/oink-cli-roadmap/)
does not add Docsy migration, version lifecycle, OpenAPI, theme publication,
or the conditional E1–E4 extensions to this program. Hugo remains an external
renderer. Generated sites remain ordinary Hugo projects.

Stages are accepted in dependency order. Each stage needs a complete usable
flow supported by owning tests and relevant actual Hugo integration, together
with known limits, a reviewable diff, and accepted EN/ZH contract and guide
updates. New public behavior moves from
the proposal into the owning contract only after its implementation and
acceptance evidence exist.

In the tables below, **existing, not rerun** means code or a named test was
inspected but its current runtime outcome was not established. **Partial**
means the first candidate provides a reusable part of the required behavior.
**Open** means new implementation or decisive acceptance evidence is missing.
**Passed**, **failed**, **unverified**, and **unsupported** describe a
specific executed input and scope when later runs are recorded.

## Inspected inputs and tools {#inputs}

The initial 2026-10-03 audit read both repositories' instructions and the
documentation README and translation rules, both maintenance PRD languages,
the original proposal, and the current CLI contract. It also inspected existing
Go packages and test names. Execution was limited to version and Git inspection
commands, without running the owning suites or writing consumer sources.

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
provides baseline reproduction inputs from the first candidate.

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
{.wide .expand}

## Evidence pages {#evidence}

The stage-by-stage receipts are kept on two companion pages, moved there
unchanged on 2026-11-06 so each page stays small enough for people and agents
to read whole:

- [R1–R5 evidence](/docs/design/research/2026-10-03-cli-maintenance-acceptance-r1-r5/): local validation for R1
  to R3, authoring and upgrade acceptance (R4), and implementation and
  documentation acceptance (R5).
- [R6–R8 and A18 evidence](/docs/design/research/2026-10-03-cli-maintenance-acceptance-r6-r8/): workspace and
  adapter acceptance (R6), the read-only Studio candidate (R7), accepted reviewed
  editing (R8), and the 2026-10-04 runtime completion supplement (A18).

## Acceptance case ledger {#cases}

This ledger combines the initial audit with accepted R1–R7 evidence and the
qualified R8 candidate gates.

| Case | Required outcome | Code or checker evidence | Status and missing decisive evidence |
| --- | --- | --- | --- |
| A01 | One `oink.result/v1` JSON result. Stderr logs. Policy `1`, required incompletion `2` |Protocol/public R1–R8 commands, frozen owning tests and exact-binary CLI/API reports. Unchanged result schema. Current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported current command scope |
| A02 | Hugo resolves slug/url/permalinks/aliases, mounts, unlisted pages and language roots | Real PageFacts/manifest/custom-mount/translationKey fixtures. Preserved ordinary artifacts. Final consumer facts | R1 scope passed |
| A03 | Definite local missing routes fail. Outside origin/path and declared external scope classified honestly | Actual rendered-reference fixture plus subpath/policy regressions and final real sites | Passed the required A03 scope. External availability remains unchecked |
| A04 | Filename, directory and `translationKey`. Duplicate/missing/draft cases. Strict/localized policy | R2 translation engine, actual Hugo/public commands, final reports and numeric supplement | Passed R2 required scope |
| A05 | Absent record unknown. Changed source/translation hash visible. No mtime inference | R2 hash/status/diff, public preview/apply and final reports | Passed R2 required scope |
| A06 | Real fences, inline code, shortcodes, HTML, attributes, unknown fields and protected text boundaries | R2 actual syntax/provenance fixtures, reviewed corpus and final reports | Passed R2 required scope. Catalog and unsupported-source limits remain explicit |
| A07 | Acknowledged findings visible. New findings block per policy. Required unavailable tools cannot pass | R2 baseline/public plans. R6 fake/actual protocol, missing/unsafe/offline/network-uncertainty and required-precedence fixtures passed | Supported scope passed. Required unavailable/uncertain tools remain `2` |
| A08 | Post-check bytes invalidate manifest. Provider uploads verified tree without another build | R3 manifest/export/tampering/public one-build tests. Final ordinary-Hugo comparison and provider rehearsal | Passed R3 required local scope |
| A09 | Both CI templates. Custom workflows preserved. Permissions/variables/provenance and stale plan protection | R3 offline generation/bootstrap, public preview/apply/stale-input tests, custom workflow supplement and local rehearsal | Passed R3 required local scope. Custom workflows remain unknown and unchanged |
| A10 | Reject HTTP 200 fallback, wrong language/build, missing resource/canonical mismatch. Incomplete timeout/auth/rate-limit | R3 explicit-network local HTTP and public result fixtures, including required identity absence | Passed R3 required fixture scope |
| A11 | All declared profiles/languages. Target protection. Ordinary Hugo. Unknown editor settings retained | R4 24 ordinary Hugo/public profiles, full Starter authoring/editor flow, snippets, actual mounts, source identities, JSONC preservation and external schema reproof | Required supported R4 local implementation/corpus scope passed. Documented unsupported editor inputs remain explicit |
| A12 | Readable diff and route comparison. Dirty/workspaces/replacement/vendor. Recovery/concurrency | Frozen actual-Hugo seven synthetic pinned cases, public upgrade, source/external guards, observed alias retarget and guarded partial rollback | Required bounded R4 local implementation/corpus scope passed. Unknown redirects/multihost remain incomplete |
| A13 | Deleted B finds unchanged inbound A. Translations/attachments/derived outputs. Global full scope | R5 committed Git/actual Hugo deletion, alias-inbound, global/uncertain input and unavailable-baseline fixtures. Exact-binary consumer reports | Passed required supported R5 scope. Unavailable or unproven historical inputs stay explicit `2` |
| A14 | Candidate before apply. Stale/hash/write failures preserve later edits. Ambiguous references unchanged |R2/R4 shared safety, R5 full-mode/inventory moves and R8 regenerated intent/fresh-input candidate validation, guarded writer and stale/late-editor/attachment tests. Current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported R5 CLI and R8 CLI/Studio editing scope. Ambiguous or unavailable required inputs still block |
| A15 | Workspace/direct parity. Selected writes only. Bounded context with paths/versions/reasons. No content execution | R5 bounded captured-source/context fixtures and four-site queries. R6 registry/direct/aggregate parity and explicit-name saved apply with other sites preserved | Supported context/workspace scope passed. No implicit batch writes |
| A16 | Five useful CLI-parity views. Keyboard/mobile/light/dark. Source/preview isolation |Accepted R7 evidence retained. Historical source-bound R8 read-only 14 axe/screenshots and Editor 12 axe/screenshots with unchanged UI bytes. Current backend gates, ARM and corpus separately verified, native/API parity, preview isolation, four consumers and canonical render passed. Current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported local views. Required partial-preview incompletion/native findings remain visible |
| A17 | No-op bytes. YAML unknown/comment/order preservation. Stale-save and attachment collisions rejected |Corrected frozen core/public/guarded-writer race, actual Hugo/tools, source-bound Editor/read-only browsers, exact-binary four-consumer proposal parity/preservation and guarded canonical source/render passed in #r8. Current eight owning gates/Linux qualification plus unchanged-runtime carry-forward of the preceding corpus in #a18 | Passed supported local editing scope. Required partial preview/native findings still block Apply. Final A18 separate |
| A18 | Actual declared macOS/Linux runtimes. Child signals. Provisioned offline runs. Honest unsupported inputs | Current freeze/source and repeated five-archive reproduction. Darwin arm64, native Linux arm64 and emulated Linux amd64 nonroot ext4/full offline unit-vet/selected Hugo/native archive/signal smokes passed in #a18 | Passed current declared runtime/archive scope. Optional guest prerequisites remain explicit skips. Darwin amd64 is experimental/unverified and Windows outside scope |
{.wide .expand}

## Candidate sites and source preservation {#sites}

The selected acceptance inputs include the embedded Starter and three distinct
maintained consumer sites, reusing the historical corpus without writing
consumer sources. The Starter source checkout provides provenance, while
generated profile trials use disposable directories.

| Input in the sibling checkout layout | Initial observed identity and purpose | Current candidate acceptance |
| --- | --- | --- |
| `oink-starter` / generated Starter | Source `137843b`, two initial status entries. Licensed fixed archive, language/profile/root/subpath trials | R1 bilingual init/check and R4 all-profile ordinary/public authoring flows passed. Archive/license unchanged |
| `oink.pgsty.com` | Source `907d873` with existing changes. Bilingual documentation/regression and explicit local-theme trial | Final R1 check and source preservation passed. Local-theme evidence remains distinct from public-pin evidence |
| `pig.pgsty.com` | Source `75050c0`, five initial status entries. Root Docs/Blog rewrites and nonrendering sidebar entries. Declared v1.1.0 | Final R1 check and source preservation passed |
| `repo.pgsty.com` | Unborn `main`, no HEAD revision. Materialized untracked sources, generated catalog and declared v1.1.0 | Final R1 check and source preservation passed. Revision remains unknown |

For each run, record effective module source and versions, flags/network
policy, exit/result/coverage, raw evidence location, and preservation outcome.
Before/after inventories must include all tracked and non-ignored untracked
source bytes and modes, Git status/index state, workspace/replacement files,
and effective vendor inputs. Compare exact inventories. Keep reports, isolated candidates, output and
caches outside consumer sources and outside Git. Full-build timing comparisons
must use the same current input baseline.

## Owning checks and documentation gate {#checks}

Start with the smallest affected Go packages and public behavior tests. The
existing repository gates are `make test` (offline tests and vet) and
`make test-hugo` (actual Hugo Starter, snapshot, manifest and public command
fixtures). The owning Hugo gate now runs all owning packages without the old
narrow test-name filter. New fixtures must remain in that gate.
Use a race run for concurrent plan/server changes when the focused tests justify
it. Unit fixtures remain offline. Networking requires explicit invocation.

For documentation, preserve EN/ZH heading number, order and stable explicit
IDs. Use these narrow source checks:

```sh
node scripts/check-markdown-style.mjs content/docs/design/research
node scripts/check-doc-translations.mjs
```

Both source checks passed after this record and its Chinese peer were added.
Eight Chinese research files passed the style checker. Translation source
coverage was 137/137 pairs with 1,082 source headings.

After building the relevant site, complete the rendered documentation gate:

```sh
npm run _check:markdown-style
npm run _check:translations
npm run _check:rendered-markdown
npm run _check:rendered-links
```

`make build` validates the declared published pin. `make check` selects the
sibling theme for the complete non-browser regression suite. Studio uses its own actual browser and
accessibility checks.

## Delivery state and remaining limits {#delivery}

| State | Current completion evidence. History retained above |
| --- | --- |
| Local implementation | Finite R1–R8 supported implementation completed locally, including Studio/read-only and opt-in reviewed editing. Current A18 runtime/archive scope passed. Canonical lifecycle rendering is bound separately to these exact bytes |
| Local validation | Historical R1–R8 owning/browser/corpus/render records retained. Current 2026-10-04 backend correction and eight current owning gates, actual three-target runtime/archive checks and unchanged-runtime carry-forward of the preceding four-consumer preservation/parity passed in #a18. Required repository findings/partial preview remain visible. Rendered navigation/URL checks have a separate exact-byte receipt boundary |
| Commits | Baseline CLI commit identified |
| Archive and runtime qualification | Current corrected source: Darwin arm64, native Linux arm64 and QEMU-TCG-emulated Linux amd64 passed installed archive/offline/signal/filesystem flows. Two fresh builds reproduce all five archives. Darwin amd64 remains experimental/unverified after actual failed execution |
| Public distribution and consumer adoption | Not performed in this local validation run |
| Deployment and public-content verification | Verified against local HTTP fixtures |

The finite R1–R8 implementation and required current A01–A18 runtime/archive
scope have local acceptance evidence. Known repository findings and required preview incompletion
remain visible diagnostic outputs.
