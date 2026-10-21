---
title: OINK CLI maintenance roadmap
linkTitle: CLI maintenance
description: Historical R1–R8 requirements for documentation maintenance and Oink Studio, distinct from acceptance evidence and the current reduced CLI contract.
weight: 35
icon: fa-solid fa-list-check
search_keywords: [OINK CLI, PRD, roadmap, translations, CI, impact, Studio]
design_kind: proposal
design_status: implemented
toc_hide: true
hide_summary: true
last_verified: 2026-10-04
proposal_date: 2026-10-03
---

> [!NOTE] Implemented requirements record
> The finite R1–R8 supported local implementation and A18 runtime/archive
> scope passed for the historical source and binaries recorded in the acceptance
> supplement. The current reduced CLI requires its own validation. This dated
> requirements record is retained at its original URL
> and anchors, with historical planning text and failed trials preserved. Stable
> behavior belongs to the [CLI contract](/docs/design/decisions/cli/) and
> [CLI introduction](/docs/cli/). Historical evidence belongs to the
> [2026-10-04 supplement](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#a18).
> It retires from active navigation. Uninvoked E1–E4 are separate inactive scope.
> Rendered navigation/URL verification requires its own receipt for these exact promoted bytes.

The proposed product should complete documentation maintenance before adding a
local visual interface. It should help maintainers check changes, understand
their effects, review safe modifications, and publish the exact artifact that
passed checks. Studio should expose those same capabilities.

| Record | Value |
| --- | --- |
| Status | Implemented. R1–R8 supported local scope and current A18 runtime/archive qualification passed. Rendered lifecycle verification has a separate exact-byte receipt boundary |
| Owner | OINK maintainers. Implementation and review assignments remain to be confirmed |
| Date | 2026-10-03 |
| Baseline | Local CLI `0.1.0-dev`, commit `e623d93`. Hugo Extended 0.166.0 and Go 1.27.1 on macOS arm64 |
| Completion scope | R1–R8 and the acceptance cases below. Conditional extensions have separate entry criteria |
| Affected surfaces | CLI command/result contract, Starter projection, consumer CI, translation policy, maintenance operations, local Studio, EN/ZH guides |
| Schedule assumption | One full-time developer with scheduled documentation and review support. Estimates are planning judgments |

## Background and evidence {#background}

The [original CLI roadmap](/docs/design/proposals/oink-cli-roadmap/) accepted
an independent Go executable and narrowed the first implementation to
`doctor`, `check`, `init`, single-site `upgrade`, `dev`, and `build`.
This proposal adds a maintenance program with a defined scope. Docsy migration, version
lifecycle, OpenAPI generation, and theme 1.2 retain their own scopes.

The 2026-10-03 local audit reran the Go suite and actual Hugo integration tests.
A bilingual initialized site passed checks over 223 files and 4,461 references.
The PIG consumer site passed over 1,392 files and 64,440 references, with 858
source files and its Git state unchanged. These observations establish local
validation without establishing public distribution, independent adoption, or
deployment.

The audit also reproduced four limits. A missing rendered link failed `check`
while `build` succeeded. Ordinary HTML references outside the configured base
path were marked untested. `doctor --release` accepted a Starter still using
`https://example.org/`. Both embedded deployment workflows called Hugo without
the CLI's additional checks. Translation completeness and readable upgrade
diffs were absent. These findings define the first changes.

## Product goal and users {#product-goal}

Prioritize maintainers of multilingual engineering documentation and small
teams maintaining several Hugo sites. Their recurring jobs are reviewing
translations, preventing broken publications, updating dependencies, and
reorganizing content without losing references or public URLs.

The product succeeds when an ordinary consumer repository can use one quality
entry point locally and in CI. Maintainers must be able to inspect affected
pages and apply reviewed changes while preserving unrelated work. CLI, Studio, and Agent callers must
receive the same findings and change plans.

## Feature selection {#feature-selection}

| Capability from the supplied design | Decision | Delivery |
| --- | --- | --- |
| Links, anchors, attachments and machine outputs | Strengthen existing checks and explain uncovered cases | R1–R3 |
| Environment diagnosis, preview and strict builds | Complete release diagnosis and add opt-in verified builds | R1, R3 |
| Translation completeness and protected structure | Build as a primary product capability | R2 |
| Initialization and CI configuration | Extend the fixed Starter and manage reviewed CI changes | R3–R4 |
| Native content rules and project style | Implement a small deterministic core. Optional general tools | R2, R6 |
| New content, snippets and editor setup | Implement ordinary Hugo inputs with overwrite protection | R4 |
| Safe upgrades and migration preflight | Add diffs and candidate comparisons. Framework migration remains separate | R4 |
| Page moves, renaming and impact analysis | Implement after page relationships and change plans are dependable | R5 |
| Issue panels and translation comparison | Build a read-only local Studio first | R7 |
| Multiple sites | Add an explicit site registry over the same single-site engine | R6 |
| EPUB, PDF and offline packaging | Conditional adapter to distributed publication tools | E1 |
| Executable documentation examples | Conditional, explicit execution profiles | E2 |
| Agent inspection, impact and context | Implement deterministic local operations | R5 |
| AI translation and semantic review | Conditional proposals after deterministic maintenance works | E4 |
| Sources, evidence and knowledge dependencies | Limit this program to build/review provenance and observed page relationships | Wider knowledge management deferred |
| Rich editing, live collaboration and native desktop apps | Deliver safe Markdown editing only. Defer the broader platform | R8. Remainder deferred |

## Scope and non-goals {#scope}

R1–R8 define this PRD's finite completion scope. Each stage can deliver value
and be accepted separately. Suggested CLI versions `0.2`, `0.3`, and `0.4`
identify release candidates. They do not require public tags or theme versions.

The program does not include a renderer, universal migration engine, hosting
account manager, deployment API, built-in LLM, vector database, remote editor,
real-time collaboration, native desktop shell, or full WYSIWYG editor.
Existing provider workflows perform deployment. Publication permissions and
credentials remain consumer-owned.

## Shared project facts and check policy {#shared-project-facts}

This scope is accepted locally. The original requirements below are retained
as proposal history. Current behavior and flags belong to the
[CLI contract](/docs/design/decisions/cli/#project-policy).

Extend the existing isolated Hugo analysis. Do not introduce a second
configuration parser or navigation authority. Proposed internal facts include
page identity, language, publication state, actual output URLs, known source
files, translation relationships, and observed rendered references.

Use Hugo's public [Page.Translations](https://gohugo.io/methods/page/translations/)
and [Page.OutputFormats](https://gohugo.io/methods/page/outputformats/) for
relationships and outputs. [Page.File](https://gohugo.io/methods/page/file/) can
provide provenance, but some pages have no backing file. Such findings must
retain an output location and unknown source state. Any temporary probe must
leave ordinary published outputs unchanged after its removal.

Use `oink.yaml` only for check selection, severity, translation policy,
reviewed exclusions, and tool/workflow options. Hugo continues to own languages,
titles, menus, URLs, and site configuration. Module files own theme versions.
Initially provide `check links`, `check translations`, and `check style` over
one shared analysis. Keep `--json`. `--format json` may be an additive alias.

Report blocking errors, warnings, and suggestions through the existing
`error`, `warning`, and `info` severities. Unsupported required tools or input
shapes remain exit `2`. Policy cannot turn failed builds, unreadable inputs,
or incomplete required checks into success. Source locations need reliable
mapping. Otherwise report the actual output and pointer.

## Translation maintenance {#translation-maintenance}

This scope is accepted locally. The original requirements below are retained
as proposal history. Current behavior and flags belong to the
[CLI contract](/docs/design/decisions/cli/#translations).

Support filename languages, language-specific content directories, and
`translationKey` relationships as resolved by Hugo. Coverage policies select
required languages for an explicit content scope. Disabled languages and
intentional localizations must not become missing-translation errors.
Check duplicate identities and configured draft/publication requirements.
If a production build omits a source needed to assess policy, use an explicit
analysis view. Do not confuse that view with publishable output.

Provide two policies: strict correspondence for manuals, and localized content
for blogs or product pages. Strict policy can require explicit IDs, declared
placeholders, selected code blocks, and necessary fields to agree. Localized
policy checks only declared shared constraints. Heading counts and all code
blocks must not become universal requirements.

Propose `translations status`, `translations diff <page>`, and an explicit
review-record operation. A versioned review record binds the translation to a
source content hash or Git revision, plus the translation hash and declared
source language. A missing record means unknown. A changed hash means changed
since review, not automatically a bad translation. Recording review requires
a user-requested write and must never happen just because a checker ran.

## Native content rules and baselines {#native-content-rules}

This scope is accepted locally. The original requirements below are retained
as proposal history. Current behavior and flags belong to the
[CLI contract](/docs/design/decisions/cli/#native-content).

Start with a small catalog of high-confidence rules drawn from actual
consumer failures: malformed supported component/attribute usage, conflicting
explicit IDs, known deprecated forms, and configured protected content.
Respect the syntax boundaries of code, inline code, shortcode bodies, raw HTML,
and attributes. Do not apply regular expressions without regard to these boundaries.

Use the effective theme version's contracts. An editor schema that omits
types is not a complete strict validator. Missing compatible metadata must
produce explicit limited coverage rather than validate against the latest
theme. Do not require a future theme release to finish basic checks.

A visible versioned baseline can acknowledge existing findings with stable
fingerprints, reasons, and review metadata. Reports show acknowledged and new
findings separately. Baseline updates are explicit and reviewable. They cannot
hide required incomplete work. Formatting and prose suggestions are optional.
Automatic fixes first produce a diff, then validate a candidate before applying
a narrow set of files.

## Verified publication and CI {#verified-publication}

This scope is accepted locally. The original requirements below are retained
as proposal history. Current behavior and flags belong to the
[CLI contract](/docs/design/decisions/cli/#checked-artifacts).

Preserve the current transparent `build` default. Add an explicit managed
`build --check` workflow. Run one strict Hugo build. Run selected checks on the
same output. Export only that verified artifact to a new or empty destination.
Do not delete arbitrary directories or mix stale files into a verified tree.
Default `build` must continue to report when extra checks did not run.

A local versioned manifest records the source revision and dirty state when
known. It also records the source-input hash, effective theme identity, Hugo/CLI
versions, build settings, base URL, check coverage, and file digests. Secrets and machine paths must not
be copied into public metadata. If a public build marker is enabled, it contains
only the minimum identity needed for verification. Artifact changes after
validation invalidate the recorded result.

Propose `ci init github-pages` and `ci init cloudflare-pages --mode direct-upload`.
Generate local configuration only, explain variables and permissions, and
record template provenance. Detect existing workflows, preview diffs, preserve
unknown modifications, and require explicit application. Both use the same
quality engine and upload the verified output without another Hugo build.
Before a public CLI release, templates must accept a documented immutable
source/archival input rather than assume a nonexistent download tag.

Extend release diagnosis with an example-address warning, a release-policy
error when publication checks require a real address, effective local source
commit/dirty state when available, and comparisons with supported generated CI
settings. Unknown custom CI is reported as unknown. A local checkout's commit
does not attest to a published module. Vendor byte identity remains separate.

Propose `verify --site URL --manifest FILE` with explicit network permission.
Check representative pages, languages, resources, search/Markdown outputs,
canonical addresses, and artifact identity. A generic fallback with HTTP 200
must fail identity checks. Timeout, authentication, rate limiting, or an absent
required identity produce unknown/incomplete results, not invented success.
Local HTTP fixtures test this without deploying to a provider.

## Authoring and upgrade assistance {#authoring-and-upgrades}

Add `new`, a small snippet catalog, and explicit editor-schema setup. Create
page bundles, selected translation drafts, and ordinary front matter while
refusing existing files. Translation drafts are not completed translations.
Editor hints follow the effective theme and preserve existing editor settings.

Extend `init` with docs, blog, book, and project profiles by composing one
licensed Starter source. Do not maintain four copied template trees. For existing
projects, provide diagnosis and reviewed proposals. Do not replace their configuration.

Keep the explicit-tag, single-site upgrade protections. Add readable unified
diffs and baseline/candidate route and capability comparisons. Report removed
URLs, changed aliases and missing previously enabled outputs. A clean candidate
build alone does not prove compatibility. Proposed configuration migrations
need a documented transform and tests. Otherwise return a manual action.
Conflicting replacements and vendor refresh remain explicit owner operations.

## Impact analysis and safe content changes {#impact-and-change-plans}

This supported scope is accepted locally. The original proposal requirements
below remain as history. Current behavior, limits and flags belong to the
[captured-facts contract](/docs/design/decisions/cli/#project-graph) and
[move contract](/docs/design/decisions/cli/#content-moves).

Provide `inspect <page>`, `impact --since <ref>`, and `context <task>` over the
shared facts. Inspect shows provenance, publication state, references,
translations, and outputs. Context packages relevant local material with
versions, paths, selection reasons, and size limits. No vector service or LLM
is required. Document content is data. It cannot authorize command execution.

Initially `check --since` may still perform a full check and say so. Later
optimization must include changed targets, their inbound references, translations,
and derived outputs. Deleting B must still inspect unchanged A that links to B.
Configuration, templates, navigation, or uncertain dependency changes expand
the scope to a full check. Cache data is disposable evidence. It is not an authority.

Propose `move <source> <target>` as preview by default. A plan contains touched
files, readable diffs, base hashes, translations, attachments, route changes,
and an alias recommendation. Rewrite only links whose meaning and ownership are known. Ambiguous template/shortcode references require review. Apply verifies bases,
validates an isolated candidate, protects concurrent edits, and retains recovery
information. A failed or stale plan must not partially overwrite user work.

## Workspaces and optional tools {#workspaces-and-optional-tools}

An explicit workspace registry names selected site directories. It reuses the
single-site engine, reports per-site results and aggregate completion, and
allows writes only to explicitly selected sites. It must not discover and
upgrade every sibling repository automatically or duplicate Hugo settings.

Optional markdownlint, Vale, and lychee adapters use explicitly configured,
already provisioned tools and normalize their findings. Required missing tools
return `2`. Optional omissions remain visible. If the adapter cannot understand syntax, exclude it. Do not rewrite it. Ambiguous external-link failures require a
network-status distinction. Tool installation and network access are separate
actions, and generic formatters never overwrite content by default.

### R6 accepted local boundary {#r6-candidate}

The explicit registry and optional adapters are accepted locally in supported R6
scope. Stable fields and limits are documented in the
[registry contract](/docs/design/decisions/cli/#workspace-registry) and
[tool contract](/docs/design/decisions/cli/#optional-checkers). The accepted R7/R8
boundaries below retain their own evidence and limits.

`oink.workspace/v1` names 1–64 literal directories in one regular YAML file
bounded to 256 KiB, without duplicating Hugo settings or discovering siblings.
Exact names, canonical root identity, registry-order selection, per-site
`0`/`1`/`2` parity and explicit-name saved-plan application are the supported
workspace boundary. Already provisioned markdownlint-cli `0.49.1`, Vale
`3.24.0` and lychee `0.24.2` extend each site's policy, with captured
configuration and typed protocol/source/network coverage. They do not install
or format tools/content. Lychee needs explicit network consent. Ambiguous
external failures remain unknown rather than definite broken links.

Frozen Go/vet, actual Hugo/pinned-tool, and owning race gates have passed. The
exact binary also passed four-site direct/aggregate diagnostic/coverage/exit
parity and all source byte, full-mode, Git, ignored-input, and directory guards. Initial
preparation failures remain excluded, and the receipt-driver-only command
metadata correction is recorded without a CLI runtime correction or rerun.
Guarded canonical EN/ZH source/rendered checks passed, and supported R6/A07/A15
scope is accepted locally in the
[R6 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6).
Current A18 runtime/archive qualification passed. Darwin amd64 remains
experimental/unverified. Focused tests do not establish a release, consumer adoption, source write,
or deployment.

## Read-only Oink Studio {#read-only-studio}

Build a local web interface with project overview, issue panel, translation
comparison, page relationships, and publication panel. These views use the same
core results as CLI/CI. Support filters, known-source navigation, actual Hugo
preview, change comparisons, and copying proposed actions. A large graph or
embedded editor is not needed for this acceptance.

Default to loopback and an explicit site allowlist. Separate untrusted rendered
content from the management origin. Handle Host/Origin checks and session
authorization before adding write APIs. Ship prebuilt UI assets with the CLI. Node is a contributor build dependency, not a consumer runtime requirement.
Cover keyboard operation, screen-reader labels, mobile layouts, light/dark
themes, and readable long diagnostic lists.

### R7 candidate boundary {#r7-candidate}

The read-only Studio candidate now serves an embedded five-view browser and
an authenticated literal-loopback API over the same native checks and captured
Hugo facts. Stable candidate boundaries are in the
[contract](/docs/design/decisions/cli/#studio). Explicit existing-site/registry selection,
typed paginated findings, source/diff/hash states, actual production preview and
separate optional analysis coverage preserve the CLI authority.

Frozen native/browser/core-case and exact-binary four-consumer receipts now
qualify the supported read-only scope, including explicit partial-preview
incompletion. They exercise native `0`/`1`/`2` parity, keyboard/mobile/light/dark
flows, literal source data and separate-origin preview attacks. R7/A16
passed guarded canonical promotion/rendered gates and is accepted locally.
R1–R8 supported scope and current A18 runtime/archive qualification passed. No
consumer Node requirement, implicit installation, source writes, public
release/adoption or deployment is introduced.

## Safe Markdown editing {#safe-markdown-editing}

After the read-only interface is accepted, add Markdown editing, front matter
forms, selected component insertion, and attachments. Reuse the CLI change-plan
engine and actual Hugo preview. There is no second save/validation mechanism.

An unchanged open/save cycle must preserve bytes. Updating one field preserves
unknown fields, comments, order, encoding, and unrelated whitespace. Detect
external-editor changes and refuse stale saves. If a front matter form cannot
preserve a construct, keep it editable as text and explain the form limitation.
Do not round-trip the whole document through a generic serializer.

Writes need an authorized local session, an allowed directory, base verification,
and a visible diff. Reject path traversal, symlink escapes, and requests from
untrusted preview content. Attachments must not overwrite existing files.
Publishing a static site never adds these management APIs to it.

### R8 accepted editing boundary {#r8-candidate}

R8 now has one source-preserving proposal engine for CLI `edit text`, `field`,
`snippet` and `attachment`, and the explicit `studio --edit` flow. Default Studio
remains read-only. Known site-owned Markdown, exact source hashes, supported
top-level YAML scalars with text fallback, original catalog byte-boundary
insertion and new-only leaf-bundle attachments share the same saved plans and
guarded writer. The complete visible review binds plan, file, and full-mode identities. Candidate HTML comes from actual selected nonpublishable Hugo analysis, with
native findings and required view incompletion kept distinct.

The accepted local interface is documented in the
[contract](/docs/design/decisions/cli/#editing).
Corrected frozen public/Go/race/vet, actual/ordinary Hugo, Editor browser
accessibility/mobile and exact-binary four-consumer preservation gates passed.
R8/A17 supported local scope also passed guarded canonical source/render gates
and is accepted in the
[R8 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r8).
Earlier failed browser/preparation trials provide evidence for their inputs.
They do not qualify later bytes. R1–R8 supported scope and current A18 runtime/archive qualification passed.
Darwin amd64 stays experimental/unverified. Public release, adoption and
deployment are separate unperformed states.

## Delivery sequence and schedule {#delivery-sequence}

The following estimate assumes one developer and is a planning judgment rather
than a productivity measurement. T0 is the implementation start after scope
approval; no calendar start date has been committed. Dependencies are sequential
acceptance gates, which additional staff can support through independent tests
and UI work but cannot remove.

| Stage | Effective weeks | Delivery | Acceptance gate |
| --- | --- | --- | --- |
| R1 | 1–2 | Shared facts, check policy, focused scopes, trustworthy locations | Hugo owns routes/relationships. Required incomplete checks cannot pass |
| R2 | 3–5 | Translation policy/review state, native checks, visible baseline | Three language layouts. Strict/localized cases. Reviewed fixes preserve files |
| R3 | 6–8 | Verified build artifacts, CI init, release diagnosis, deployed-site verification | One checked artifact is uploaded. Stale bytes and HTTP 200 fallback are detected |
| R4 | 9–11 | New content, profiles, snippets/editor setup, upgrade diffs/comparisons | Ordinary Hugo build. Dirty/replaced/vendor and route-regression cases remain safe |
| R5 | 12–15 | Inspect, impact, context, move and shared change plans | Unchanged inbound links and translations are included. Stale plans cannot write |
| R6 | 16–17 | Explicit workspaces and optional check adapters | Per-site parity. Required unavailable tools are incomplete. No implicit installs |
| R7 | 18–20 | Read-only Studio and its security boundary | Five useful views. CLI/UI findings agree. Accessibility and preview isolation pass |
| R8 | 21–24 | Safe Markdown/forms/attachments with conflict review | No-op save has zero diff. Comments/unknown fields survive. Concurrent saves fail safely |

Allow another 4–6 weeks for integration, false-positive review, cross-platform
execution, and repairs, distributed across the gates. The total planning range is
28–30 effective weeks. At roughly half-time availability, elapsed calendar time
may be roughly twice that. This is an assumption to revisit, not a promise.

R1–R3 yield a proposed `0.2` quality/publication candidate around weeks 9–10
including early reserve. R4–R6 yield a proposed `0.3` maintenance candidate
around weeks 19–20 cumulatively. R7–R8 yield a proposed `0.4` local Studio
candidate around weeks 28–30 cumulatively. Public publication is a separate
authorized action. Local candidates do not require releasing every stage.

## Conditional extensions {#conditional-extensions}

| Extension | Entry criterion | Proposed boundary | Separate estimate |
| --- | --- | --- | --- |
| E1 Publication exports | At least two maintained books need a recurring export workflow | Reuse distributable EPUB/PDF tools and package local artifacts. Declare external dependencies | 1–2 weeks after R3/R4 |
| E2 Executable examples | Explicit owners identify runnable examples and disposable test environments | Reviewed execution profiles, time/resource limits, offline default. Never execute discovered prose automatically | 3–5 weeks after R5 |
| E3 MCP | An existing Agent integration needs capabilities beyond invoking JSON CLI results | Thin adapter over inspect/check/impact/context/plans. Same permissions and diagnostics | 1–2 weeks after R5 |
| E4 AI review and translation | Deterministic translation maintenance works and a reviewed evaluation corpus exists | User-selected provider, explicit network/cost settings, proposals bound to source hashes. No automatic source writes | 3–6 weeks for a limited experiment after R5 |

The R1–R8 total excludes these estimates. Activate an extension only for its
stated use case. A future need is not an unfinished core milestone. Remote
Studio, live collaboration, native shells, general knowledge provenance, vector
retrieval, and universal framework migration require separate PRDs and evidence.

## Architecture and compatibility {#architecture-and-compatibility}

Use Go for core operations. Use subprocesses for Hugo and optional tools.
Extend existing packages when they own the behavior. Add a package only with
its capability. Do not create a generic plugin platform, public SDK, or shared
service layer before an actual consumer needs it.

Preserve `oink.result/v1`, exit meanings, and the default thin wrappers. New
diagnostic details and command data may be additive. Changed field semantics
need a new result version. Version review records, baselines, plans, build
manifests, and workspace registries independently. Detect supported capabilities
from the actual theme. Do not require all users to install the latest release.

Read/check/preview, local file application, networking, example execution, and
deployment have separate side effects. No telemetry, background updater,
credential discovery, arbitrary directory cleanup, global configuration change,
commit, push, or deployment happens as a maintenance side effect. Read-only
consumer trials preserve sources, replacements, workspaces, and vendor bytes.

## Acceptance cases and owning checks {#acceptance-cases}

| Case | Required outcome | Primary owner |
| --- | --- | --- |
| A01 JSON and completion | One JSON result on stdout. Clean stderr separation. Findings `1`, required incompletion `2` | `internal/report`, `internal/app`, Schema |
| A02 Hugo truth | Slug/url/permalinks/aliases, custom mounts, unlisted pages and language roots follow actual Hugo results | `internal/site`, `internal/outputcheck`, actual Hugo fixtures |
| A03 Subpaths | A definite project-local missing route fails. Outside-origin/path references remain classified honestly. Declared external scopes avoid false positives | Output checker and policy tests |
| A04 Translations | Filename, directory and translationKey layouts. Duplicate/missing/draft cases. Strict/localized policy | Translation engine and public-command tests |
| A05 Review state | No record is unknown. Changed source hash is visible. Mtime never determines review state | Translation/review-record tests |
| A06 Content syntax | Fences, inline code, shortcodes, HTML, attributes, custom fields and configured protected text do not generate invented findings | Native-rule tests and real content corpus |
| A07 Baselines and adapters | Acknowledged findings remain visible. New findings fail policy. Unavailable required tools cannot pass | Policy/adapter tests |
| A08 Artifact identity | Modify a file after check and manifest verification fails. Provider upload uses the same exported tree without rebuilding | Managed-build and workflow tests |
| A09 CI preservation | Both templates, existing customized workflows, permissions/variables, preview/apply conflict and provenance | Starter/CI tests and local workflow rehearsal |
| A10 Public verification | HTTP 200 fallback, wrong language/build, missing resource, canonical mismatch, timeout/auth/rate limit | Local HTTP fixtures, no required cloud account |
| A11 Initialization and authoring | Supported profiles/languages. Empty-target protection. Generated sites build with ordinary Hugo. Editor config preserves unknown settings | `internal/starter`, authoring and Hugo tests |
| A12 Upgrade | Readable diff, old/new routes, dirty files, both workspaces, replacement/vendor, failure recovery and concurrent edits | `internal/upgrade`, public-command/Hugo tests |
| A13 Impact | Deleted B finds unchanged A. Translations/attachments/derived outputs included. Global changes expand scope | Impact and Git-baseline fixtures |
| A14 Change application | Candidate validation before apply. Hash conflicts and failed writes preserve subsequent edits. Ambiguous references are not rewritten | Shared plan/apply and move tests |
| A15 Workspace and context | Per-site results match direct invocation. Selected writes only. Bounded context gives paths/versions/reasons without executing content | Workspace/context tests |
| A16 Studio parity | Five views show the same results as CLI. Usable keyboard/mobile/light/dark flows and source/preview separation | Studio browser/accessibility tests |
| A17 Editor preservation | No-op save is byte-identical. YAML comments/unknown values/order survive. Stale saves and attachment collisions are rejected | Editor/browser and shared apply tests |
| A18 Runtime and recovery | Test actual declared macOS/Linux targets. Signals stop child processes. Cached operations work offline. Unsupported inputs remain explicit | Process/integration/installation tests |

Run the smallest owning tests before broader integration. Keep Go unit fixtures
offline. Repeat actual Hugo tests after parser, snapshot, probe, initialization,
or upgrade changes. Keep focused checks. Do not require consumers to run theme internals or a
browser suite for every document change.

For each candidate, record tool versions and source identities. Then test the
Starter and three distinct maintained sites without writes. Compare source bytes,
modes, and Git state before and after. Tests for new native rules need a reviewed
valid/invalid corpus. Fix false positives before enabling a blocking default.
Before promising incremental speed, measure full-build time against the same
current-site baseline. Functional correctness takes priority over check counts.

## Completion and release evidence {#completion-and-release}

For each stage, record implemented behavior, known limits, focused tests, and
actual integration results. Provide updated EN/ZH contracts/guides and a
reviewable diff. Track individual requirement/case statuses. Passing an aggregate command
does not automatically close every requirement. This PRD is complete only when
R1–R8 and their required acceptance cases are satisfied.

Keep implementation, local validation, commits, archive/runtime qualification,
public distribution, consumer adoption, provider deployment, and public content
verification separate. Cross-compilation is not runtime acceptance. Missing
credentials or an unpublished download URL do not justify claiming remote
delivery, nor require building a hosting control plane.

After supported behavior is accepted, move it into the owning CLI contract,
usage guides, and durable decisions. Retire the corresponding proposal sections
through the existing lifecycle. Do not use this PRD as a permanent second manual.

## Decisions and stop conditions {#decisions-and-stop-conditions}

Confirm staffing and start date before turning relative weeks into calendar
dates. Decide supported runtime targets, review-record storage details, initial
native-rule catalog, and precise additive command flags in R1. These are bounded
implementation choices within this scope, not reasons to reopen the product
boundary or wait for an entire theme release.

If preservation or correctness work exceeds a stage estimate, move its optional
convenience work later. Never remove stale-write protection, truthful completion,
or ordinary-Hugo compatibility. If repeated corpus review shows that a rule is unreliable, keep it advisory
or remove it. If a form cannot preserve source
bytes, keep that syntax in text mode. Interest in implementing a conditional extension does not add it to the
critical path.

## Decision log {#decision-log}

| Date | Record |
| --- | --- |
| 2026-10-03 | Created from the current CLI audit and the supplied feature goals. Proposed R1–R8, optional extension gates, resource assumptions and executable acceptance cases. No new CLI capability, release, consumer adoption or deployment is claimed by this document. |
| 2026-10-03 | R1 shared Hugo facts and check policy passed local owning/actual-Hugo checks. Stable behavior moved into the [CLI contract](/docs/design/decisions/cli/#project-policy). The [acceptance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r1) tracks final refreshed reports and rendered EN/ZH evidence separately. R2–R8 and conditional extensions remain open. No public distribution, adoption or deployment is claimed. |
| 2026-10-03 | R2 translation scopes/hash reviews, syntax-bounded native rules and visible baselines now use shared guarded file plans. Local owning, actual-Hugo and focused race gates passed. Final refreshed consumer and EN/ZH documentation acceptance remains pending in the [record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r2). Implemented behavior is in the [contract](/docs/design/decisions/cli/#translations). R3–R8 remain open. |
| 2026-10-03 | R2 final corpus and bilingual documentation gates passed. R3 one-render checked export, exact file identity, guarded CI plans for both providers, release diagnosis and explicit-network HTTP verification passed their scoped local gates, including custom-workflow discovery. Stable behavior moved to the [contract](/docs/design/decisions/cli/#checked-artifacts). Exact evidence and A08–A10 outcomes belong to the [maintenance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r3). R4–R8, final A18 runtime/archive refresh and Darwin amd64 remain open. No public distribution, hosted CI execution, adoption or deployment is claimed. |
| 2026-10-03 | R4 supported local scope passed frozen Go/vet, actual Hugo/race and exact-binary read-only Starter/docs/PIG/repository gates. One unchanged licensed Starter composes all profiles/languages. Ordinary new/editor/snippet flows and source/external-input guards passed, as did readable bounded upgrade views and alias/output regression protection. Stable behavior belongs to the [contract](/docs/design/decisions/cli/#authoring). Exact A11/A12 evidence and remaining limits belong to the [record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r4). R5–R8, final A18 runtime/archive refresh and Darwin amd64 stay open. No release, consumer writes/adoption or deployment occurred. |
| 2026-10-03 | R5 corrected frozen Go/vet, actual Hugo/race and exact-binary four-consumer read-only gates completed. Inspect/context complete for all sites. Historical impact and move blockers remain explicit. Guarded canonical source/rendered gates and stage acceptance are pending. Stable behavior belongs to the [contract](/docs/design/decisions/cli/#project-graph). The [record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r5) identifies A13/A14/context evidence, the cached-module correction and exact preservation receipt. R6–R8, workspace A15 and final A18 remain open. No consumer writes or deployment occurred. |
| 2026-10-03 | R5 supported inspection/impact/bounded-context and guarded move scope is accepted locally after corrected frozen owning gates, exact-binary four-consumer preservation and first-promotion canonical source/rendered gates. The production translation owner retains only its known draft-release omission. Separate nonpublishable analysis passes all owners. Stable behavior belongs to the [contract](/docs/design/decisions/cli/#project-graph) and [command reference](/docs/design/decisions/cli/#content-moves). The [record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r5) retains exact outcomes and the separate post-render evidence boundary. A13/A14 supported CLI scope passed. A15 context passed while workspace/direct parity remains R6. R6–R8 and final A18 remain open. No release, consumer writes/adoption or deployment occurred. |
| 2026-10-03 | R6 explicit registry and bounded optional-tool candidate implemented. Focused workspace and corrected actual-protocol trials passed, with preparation failures kept separate. Final runtime/corpus/canonical gates and A07/A15 stage acceptance remain pending in the [R6 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6). R7/R8 and final A18 remain open. No release, consumer write or deployment. |
| 2026-10-03 | R6 frozen Go/vet, actual Hugo/pinned tools, owning race and exact-binary four-consumer direct/aggregate parity/preservation qualified. The completed receipt records six original operations, existing repository duplicate-ID findings and a driver-only command-summary correction over unchanged raw outputs. No CLI/Hugo rerun or runtime fix was needed. Canonical source/render checks and explicit R6/A07/A15 stage acceptance remain pending in the [record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6). R7/R8/final A18 remain open. No consumer source writes, release or deployment. |
| 2026-10-03 | R6 supported explicit-registry and optional-tool scope is accepted locally after frozen Go/vet, actual Hugo/pinned tools, race, exact-binary four-consumer parity/preservation and guarded canonical source/render gates. A07 adapters and A15 workspace/direct/context supported scope passed. The [R6 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6) separates first-promotion rendered bytes from this post-render status/evidence amendment. R7/R8 and final A18 remain open. No public release, consumer source writes/adoption or deployment. |

| 2026-10-03 | R7 read-only embedded Studio candidate and authenticated loopback views implemented. Frozen core/browser and exact-binary four-consumer qualification completed within the declared scope. Guarded canonical promotion/render and explicit R7/A16 acceptance remain pending. R1–R6 remain accepted. R8/final A18 open. No consumer writes, release or deployment. |

| 2026-10-03 | R7/A16 supported read-only Studio is accepted locally after frozen cumulative executed-case/browser proof, exact-binary four-consumer parity/preservation and guarded canonical source/render gates. First-promotion rendered bytes remain distinct from this post-render status amendment. Whole invocation failure and explicit partial-preview incompletion stay visible. R1–R7 accepted. R8/final A18 open. No public release, consumer write/adoption or deployment. |

| 2026-10-03 | R8 CLI/opt-in Editor source-editing candidate implemented. Default Studio remains read-only. Pure-core/streaming-output focused evidence is recorded and failed browser trials retained. Final frozen public/browser/consumer/canonical gates and A17 stage acceptance remain pending in the [R8 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r8). R1–R7 remain accepted. R8/final A18 open. No public release or consumer writes/deployment. |

| 2026-10-03 | R8/A17 reviewed CLI/opt-in Editor supported local scope is accepted after corrected frozen whole owning/browser gates, exact-binary four-consumer proposal parity/source preservation and guarded first canonical promotion/actual rendering. R1–R8 are accepted locally. The [R8 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r8) separately binds first-rendered and current status bytes, retaining every failed trial, native finding and required partial-preview incompletion. Final A18 current Linux/archive qualification remains open. No consumer writes, public release, adoption or deployment. |

| 2026-10-04 | Current backend integrity correction, refreshed owning/Hugo/race, carried unchanged-runtime four-consumer preservation and three declared runtime/archive qualifications passed. See the [dated completion supplement](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#a18). Finite R1–R8 implementation is complete locally. Retain this requirements record and anchors, retire it from active navigation, and keep stable behavior in the contract/guide. Final canonical rendered lifecycle verification remains separate. E1–E4 have not been invoked. No public release, adoption or deployment. |
