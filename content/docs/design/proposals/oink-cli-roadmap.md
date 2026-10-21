---
title: OINK CLI and the next product stage
linkTitle: CLI and roadmap
description: The accepted independent CLI boundary and local first-stage scope, with later adoption, theme, migration, and content-model work still proposed.
weight: 30
icon: fa-solid fa-terminal
search_keywords: [OINK CLI, roadmap, PRD, doctor, check, upgrade, migration, versioning, OpenAPI]
design_kind: proposal
design_status: partially-implemented
proposal_date: 2026-09-29
---

> [!WARNING] Local first-stage candidate; later roadmap remains draft
> The independent Go repository `pgsty/oink-cli` and first-stage development were authorized on 2026-09-29. Its six commands now have a local `0.1.0-dev` implementation, with final local acceptance recorded separately. Current behavior belongs to the [CLI decision and result contract](/docs/design/decisions/cli/) and [CLI introduction](/docs/cli/). This is not a public CLI release or independent-user adoption record. Theme 1.2, its tooling descriptor, Docsy migration, version lifecycle, OpenAPI, MCP, and Studio remain proposals.

| Record | Value |
| --- | --- |
| Status | Repository choice and first-stage scope accepted. Local candidate implemented and validated. Later roadmap remains draft |
| Owner | OINK maintainers. Final local acceptance and public release remain separate |
| Date | 2026-09-29 |
| Scope | OINK theme, independent CLI, existing Starter, and documentation site |
| Affected contracts | Architecture, configuration/diagnostics, outputs, migration, and later version navigation/API content |
| Source snapshot | Theme HEAD `3a18234`, documentation HEAD `85f16bf`, Starter HEAD `137843b`, plus the explicitly identified local work below |

## Recommendation {#recommendation}

Create a separate **`oink-cli` repository**, publish one executable named **`oink`**, and keep **OINK** as the single product identity. The theme renders content. The CLI helps users initialize, inspect, validate, upgrade, and eventually migrate their sites. The documentation site continues to own public guides, bilingual design records, and integration acceptance.

The repository choice and Go implementation are now accepted and exist locally, with public publication remaining a separate action. The [CLI contract](/docs/design/decisions/cli/) owns first-stage behavior, while the [dated acceptance record](/docs/design/research/2026-09-29-cli-acceptance/) identifies executed checks and remaining limits. This roadmap stays active for its later stages and adoption targets.

The first release should improve the path from an existing repository to a reliable publication. Its four main workflows are **doctor, check, init, and upgrade**. `dev` and `build` may provide small, transparent Hugo shortcuts. A supported Docsy migration path follows evidence from actual input repositories. Version lifecycle and OpenAPI generation come after that first usable release, with one major content-model project active at a time.

Keep the theme usable without the CLI. Commit or otherwise deliver generated Hugo inputs. After you remove the CLI, ordinary Hugo must still be able to build the site. Regenerating those inputs remains a separate operation.

## Product position and target user {#position}

Recommended public description:

> OINK is a local-first documentation toolkit built on Hugo, publishing engineering knowledge for readers and agents.

Retain “Hugo theme” in installation and discovery pages because it describes what users install. “Knowledge compiler” is a useful architectural direction, but it is not yet evidence that OINK owns a new product category. A new name should keep the current Markdown/Hugo workflow clear.

Prioritize Git-oriented maintainers of open-source infrastructure, developer tools, and multilingual technical documentation. They need to get a site working, diagnose failures, upgrade safely, and move content without losing URLs or meaning. Existing maintained sites provide regression coverage, while independent teams provide adoption evidence; the two answer different questions.

For the first stage, non-goals include a visual CMS, hosted accounts, a deployment control plane, a package marketplace, an LLM runtime, a semantic-search service, and a new rendering engine. Books, blogs, and landing pages remain supported, but their feature catalogs do not drive this roadmap.

## Evidence and changes to the research recommendation {#evidence}

This proposal considers the supplied strategy report and checks it against the local implementation, bilingual Design section, Starter, and current primary documentation. It does not treat the report's star counts, effort estimates, commercial prices, or market claims as verified demand.

| Observation | Product consequence |
| --- | --- |
| OINK already has a public Starter, generated configuration schemas, migration scripts, publication tools, and focused theme checkers | Provide selected workflows as product features. Do not create a second implementation of every tool |
| The front-matter schema deliberately omits type constraints | It is not a complete executable validator. Strict checks must follow the owning resolvers and actual Hugo output |
| Existing version support includes a cross-site menu, archive banners, and optional path concatenation | The gap is lifecycle and reliable page correspondence, not another menu or banner |
| Current version documentation explicitly uses independent Hugo builds | Preserve that model initially. Do not silently add a multi-version renderer to one build |
| OpenAPI widgets become specification links outside HTML and have documented accessibility exclusions | Static, accessible endpoint content is a concrete future improvement |
| Backlinks are implemented. G2/G3 remain draft | A graph visualization is not an already-accepted commitment |
| `bin/update-consumers.py` exists in this working tree as uncommitted local work | Its release-resolution and preservation rules are useful design input, not a claim of shipped CLI functionality |
| The theme and documentation trees contain substantial unrelated local changes | This proposal records recommendations. It does not certify or release that work |

The supplied report emphasizes adoption and an optional tools layer. Four changes make its recommendations implementable:

1. Put safe upgrades alongside initialization and diagnosis. Existing users have an immediate, testable maintenance need.
2. Separate maintainer regression checkers from consumer checks. A synthetic-fixture checker is not automatically a general-purpose site validator.
3. Treat migrations as supported input profiles, not a promise of complete Docsy or arbitrary MDX conversion.
4. Replace the simultaneous versioning/OpenAPI/graph/platform program with sequential decisions. A feature list and hour estimates are not a staffed delivery plan.

Current competitors validate the workflow direction, not demand for OINK itself. [Mintlify's CLI](https://www.mintlify.com/docs/cli/commands) exposes preview, validation, and link checking. [Nimbus](https://github.com/cloudflare/nimbus) combines scaffolding and agent-readable output while remaining pre-1.0. [Docusaurus](https://docusaurus.io/docs/versioning) makes version snapshots explicit and warns about their maintenance/build cost. Copying Nimbus's full source-owned UI model would move upgrade work to OINK consumers. Use that pattern for small generated recipes. Keep the upgradable theme module.

## Why a separate repository {#repository-choice}

| Option | Benefit | Cost | Decision |
| --- | --- | --- | --- |
| Extend Python scripts under theme `bin/` | Fastest small maintenance improvements. Tests accompany the change | Difficult installation and distribution. No unified public command contract | Retain for internal and historical tooling |
| Put `cmd/oink` in the theme's root Go module | One checkout and atomic source edits | Mixes a Hugo asset module with application dependencies, binary releases, and consumer support | Do not choose for the public CLI |
| Use an isolated Go submodule in the theme repository | Atomic repository changes without sharing Go dependencies | Separate module tags and releases still need management. Code can more easily depend on unpublished theme internals | Viable fallback for a prototype with a fixed time limit. Not the preferred product repository |
| Create `pgsty/oink-cli` | Clear executable boundary, independent releases, no need for users to clone theme internals | Requires explicit compatibility and cross-repository acceptance | Accepted. Local Go repository created |

This decision assigns release and maintenance responsibilities rather than claiming that a monorepo is technically impossible. A nested module can isolate dependencies, and separate repositories still require coordination: a renderer change may need two pull requests, paired contracts, and a compatibility test. OINK already operates a theme/site/Starter split, so that cost is acceptable if the public boundary stays small.

Theme and CLI releases must not share a forced version number. A proposed `oink` CLI `0.1.x` should work with a tested OINK `1.1.0` baseline and the next supported theme release. Declare compatibility per capability. Report unsupported functionality. Do not assume that every schema from the newest theme is valid for every older site.

Do not create separate repositories for the linter, migration engine, OpenAPI generator, or a shared SDK now. They can begin as internal CLI packages. The binary can be built in Go without importing Hugo's internal Go packages or making the theme module depend on the CLI.

## Responsibility map {#responsibilities}

| Surface | Owner | Boundary |
| --- | --- | --- |
| Layouts, components, style, navigation, search, accessibility, output semantics | `pgsty/oink` | Executes inside Hugo and the static site |
| Theme defaults, owning resolvers, generated schemas, output schemas | `pgsty/oink` | Authoritative theme behavior and its projections |
| Theme implementation checks and narrow invalid-input fixtures | `pgsty/oink` | Remain maintainer tools, even if implemented in Python or JavaScript |
| Environment diagnosis, consumer checks, initialization, upgrade; later migration transformations | `pgsty/oink-cli` | Initial commands implemented locally; migration remains proposed |
| OpenAPI parsing and generated source, later version snapshot orchestration | Proposed later `pgsty/oink-cli` capabilities | Produces ordinary Hugo inputs; does not own final rendering |
| Small official site skeleton and language profiles | `pgsty/oink-starter` | Single source for CLI initialization. Pinned snapshots can be embedded in CLI releases |
| Guides, examples, PRDs, accepted rationale, EN/ZH integration/browser review | `pgsty/oink.pgsty.com` | Continues as the canonical public documentation and regression site |
| Hosting credentials, account setup, deployment authorization | Consumer workflow | Existing CI/provider tools. The first CLI release does not deploy |

```text
                          optional oink CLI
                  init / doctor / check / upgrade
                      later migrate / generate
                               |
                               v
              user-owned Markdown + Hugo config + data
                               |
                     Hugo Extended + OINK theme
                               |
               HTML / Print / Markdown / search / indexes
                               |
                  readers / agents / optional adapters
```

The CLI reads Hugo's effective configuration, the resolved theme's published contract artifacts, and rendered outputs. It must not guess the final page tree from filenames or maintain a second navigation resolver. [Hugo config](https://gohugo.io/commands/hugo_config/) exposes effective configuration. Module inspection must also account for replacements, workspaces, and [vendoring](https://gohugo.io/hugo-modules/use-modules/).

## Next theme release: proposed OINK 1.2 {#theme-next}

This section remains draft. The local CLI candidate works against published OINK v1.1.0. The first-stage CLI decision neither accepts nor requires a 1.2 release or a new tooling descriptor.

Set an adoption objective for this release: **a site can explain its configuration and output capabilities to tools, and upgrade without adopting a new authoring model**. The release should be small enough to ship independently of the broader roadmap.

| Priority | Requirement | Acceptance |
| --- | --- | --- |
| P0 | Package a small, versioned tooling descriptor beside existing schemas, describing available schema/output contracts and supported toolchain boundaries | Check the descriptor against its owning implementation. The CLI can inspect it from the resolved module. No extra per-page output or runtime request |
| P0 | Make selected high-value configuration diagnostics actionable: parameter, invalid value, expected form, fallback, and owning guide | Cover actual onboarding failures such as Goldmark/output/language configuration. Retain ordinary preview warnings and strict publication failure |
| P0 | Preserve one navigation and Markdown authority across reader and machine outputs | Existing output and navigation checks continue to cover language, ordering, subpath, and opt-in behavior. No duplicate CLI renderer |
| P0 | Release with a tested Starter snapshot and a reviewed downstream adoption record | Validate published module resolution separately from sibling replacement builds. Record consumer pins and deployments independently |
| P1 | Add stable identifiers to the small set of diagnostics consumed by tooling, if the prototype shows they are necessary | A focused owning checker verifies each identifier. The CLI never depends on parsing all human warning prose |

The descriptor contains release metadata without becoming a configuration authority. Configuration schemas remain generated from current authorities, whose resolver/checker continues to own optional shape validation. A generic renamed-key registry would conflict with the current diagnostic decision. Migration transformations therefore belong to explicit CLI profiles rather than a permanent compatibility path in templates.

No new visual component family is required for 1.2. Correctness, accessibility, and already-demonstrated regressions can still justify changes. Existing media work keeps its own acceptance scope. This roadmap does not require every draft to be complete before release.

## First CLI release: proposed 0.1 {#cli-first}

The commands below are implemented in the local `0.1.0-dev` candidate. Their current flags, result semantics, and limits are defined by the [CLI contract](/docs/design/decisions/cli/) and [CLI introduction](/docs/cli/). Public distribution and final acceptance are separate states.

| Command | User outcome | First-release boundary |
| --- | --- | --- |
| `oink doctor` | Understand why the site cannot run or why its environment differs from CI | Inspect Hugo Extended/version, module pin and effective source, Starter/toolchain requirements, essential configuration, and enabled outputs. No repair by default |
| `oink check` | Know whether a publication build and its local references are valid | One strict build into isolated output, then check local links/anchors/assets and enabled machine outputs. Report coverage and unsupported checks |
| `oink init my-docs` | Start a small, neutral site that can be maintained without the CLI | Generate from a pinned Starter snapshot into a new/empty target. Select the supported language profile and explicit theme pin |
| `oink upgrade --to <tag>` | See the exact changes needed for a theme upgrade | Preview first. `--write` applies a reviewed scope after validation. Protect unrelated module dependencies, user changes, and vendored output |
| `oink dev` / `oink build` | Use a memorable entry point without learning a second build system | Thin Hugo invocations with visible effective arguments. `build` uses publication strictness. Direct Hugo remains fully supported |

`check` is the single quality entry point. Avoid separate overlapping `lint`, `validate`, `audit`, and `check` products in 0.1. Later `--scope` options can separate source hints from rendered-output validation when users need the distinction.

### Diagnosis and quality scope {#diagnosis-quality}

Start with failures that users can act on and that checks can identify reliably: wrong toolchain, unresolved theme, malformed required configuration, missing local link targets/anchors/assets, and inconsistent enabled output references. Resolve routing and anchor truth from Hugo's output, including language and base-path handling. Do not label a valid custom front-matter key as invalid merely because an editor schema does not list it.

Disabled optional outputs are not missing-output errors. The local candidate does not check translation completeness. Any future completeness rule must use the site's declared languages and coverage policies. Duplicate titles, orphan pages, missing descriptions, prose style, and freshness remain later optional observations after real false-positive review. Static inspection is not a claim that browser accessibility or interaction tests passed.

The local candidate freezes `oink.result/v1`. Structured diagnostics have stable rule IDs, severity, known locations, explanations, actions, and explicit coverage. JSON stdout contains only the result. Logs go to stderr. No command waits for input. Exit meanings are `0` for completed work with no blocking findings, `1` for policy findings, and `2` for required incomplete work. Required unsupported checks cannot succeed. The [result contract](/docs/design/decisions/cli/#result) owns the detailed fields. Build-derived findings never receive invented line numbers.

Keep raw Hugo errors available as subprocess evidence. Their translated wording is not the CLI protocol. A future SARIF export can project from the same result without changing rule semantics.

### Upgrade and file preservation {#upgrade-preservation}

The existing consumer-upgrade script provides local precedents: distinguish declared pin from resolved version, disable both workspace mechanisms for release verification, recognize module replacements, and inspect `_vendor`. Port those behaviors with focused tests. Do not call unpublished Python files while describing the executable as a standalone Go binary.

For 0.1, upgrade one explicitly selected site. Multi-site fleet discovery stays with the maintainer script until a consumer need is demonstrated. A normal `check` may examine an intentional local theme replacement. `check --release` must verify the declared published release without those replacements. It should report a conflicting `go.mod` replacement rather than edit it away.

Preview the proposed touched files and verify the prospective upgrade before applying it. Back up only those files, refuse changes to files that changed since the preview, and preserve unrelated dirty work. A failed operation must describe what was and was not applied, with a recovery path that does not overwrite subsequent edits. A dirty repository is not a reason to block read-only diagnosis. Refreshing vendor content requires a separate explicit action. Changing only `go.mod` does not upgrade vendored output.

Do not commit, push, deploy, alter global agent settings, or install system packages as side effects of initialization or repair. Initialization creates the requested named directory. Changes to existing files default to a preview. Do not build a generic workflow engine to implement these bounded operations.

### Distribution and offline behavior {#distribution-offline}

The local candidate currently provides a tested source/Make installation path and archive preparation. A published Homebrew formula and public download/tag installation remain future distribution work. Runtime qualification at this stage covers macOS arm64. Other archive targets are cross-compiled candidates. They have not been tested as runtime platforms.

Use a Go executable with release archives/checksums and a Homebrew installation path. Initially qualify macOS and Linux on tested architectures. Mark other targets experimental until you validate their filesystem and process behavior. The installed CLI itself needs no installed Go toolchain, Python, Node, or account. Hugo remains an external renderer. Initial module resolution still needs the site's documented Git/Go/Hugo toolchain.

Embed or ship an exact, licensed Starter snapshot for deterministic initialization. Do not fetch a moving `main` branch on every invocation, and do not maintain handwritten CLI copies of Starter configuration. Check embedded/template drift during CLI release.

Distinguish a cold installation from offline operation. Downloading Hugo, the theme, or an uncached template requires connectivity unless supplied locally. Once dependencies are present, local diagnosis/check/build paths must work without external services. On a cache miss, an offline request must fail clearly. It must never fetch silently. External URL checking, remote specifications, and other network actions are separate opt-ins. No default telemetry or background update check is required.

## Migration: the first expansion {#migration}

Start with a **documented Docsy input profile** selected from actual candidate sites, reusing the current migration fixtures and report model as evidence. Existing OINK 0.4/0.6 transformations are not proof that arbitrary Docsy sites can already migrate. Validate configuration, navigation, assets, languages, and routes as well as Markdown syntax.

Proposed workflow: `oink migrate --from docsy --source <site> --output <new-site>`. Assess the migration before writing. Apply it only with an explicit flag and a separate destination. Every source item receives one primary status: unchanged-compatible, transformed, manual-review, or unsupported. Counts must reconcile, with reasons and source locations. Custom templates and dynamic behavior remain visible manual work.

Acceptance means source preservation, idempotent supported transforms, no edits inside literal code examples, valid local references, and an explicit old-to-new route report. Prefer unchanged URLs. URL changes require a redirect plan for the hosting target. HTML build success alone does not establish semantic parity or production redirects.

Do not promise “one command migrates any Docusaurus site.” Arbitrary JSX, imports, and embedded React/Vue are programs. Do not execute untrusted source to infer their meaning or silently drop unsupported constructs. Start a second framework only after the first profile is reused successfully without maintainer rescue. Full MDX migration is a later product investment, not an MVP parser task.

## Next content capability: version lifecycle {#version-lifecycle}

After the first CLI is useful, version lifecycle is the default next candidate because it extends OINK's existing independent-build model. Move OpenAPI ahead only if real API users provide the stronger repeated need. Do not implement both foundations simultaneously with one primary maintainer.

Theme responsibilities: consistent version identity in the reader surface, reliable page switching, archive status, and correctly scoped search/machine outputs. CLI responsibilities: inspect/list versions, prepare a snapshot, validate page correspondence, and change declared lifecycle state. Use `oink --version` for the executable. A future `oink docs version ...` namespace would distinguish documentation versions.

Prefer a small version manifest with version label, source reference, base URL, status, and default selection. Keep independent per-version builds and existing external archives. CLI-managed manifests may produce checked-in Hugo configuration; in that mode, authors edit the manifest and configuration becomes a checked projection. Existing manually managed `params.versions` remains supported. The initial prototype must settle this projection before freezing its format.

Page correspondence needs a logical page key scoped by documentation family, language, and version. Reuse a suitable existing `translationKey` or explicit stable key before inventing universal UUIDs. You should disclose missing peers and link them to a defined version/section landing page. You should not fabricate an equivalent page or concatenate an unchecked URL. Route aliases handle moves separately from page identity.

Distinct historical content should ordinarily keep its own canonical URL. Do not point every old page at the newest version. Language alternates must refer to genuine translated peers in the same version. Default search and agent bundles stay inside the selected language/version. A cross-version collection, if later needed, is explicit. Archiving preserves the source and records how the built artifact is retained. It does not delete the source or silently redeploy an immutable archive.

`NAVJSON` v1 currently has closed object schemas. Adding version or identity fields therefore requires an explicit new schema/output contract or a separate artifact, not a supposedly harmless addition to v1. No change to current page identity is justified merely to reserve space for a future graph.

## Following capability: static OpenAPI reference {#openapi}

The first OpenAPI product should be a **read-only static reference generator**. The CLI parses a local specification and supported local references, emits ordinary Markdown/Hugo data, and records source provenance. The theme supplies accessible semantic presentation and the existing output pipeline. Ordinary Hugo then builds HTML, Print, Markdown, search, and agent indexes from those generated pages.

Start with operations, parameters, request/response bodies, and linked schema descriptions. After a parser prototype, explicitly declare supported OpenAPI versions and constructs. Unsupported constructs cannot disappear silently. Scope operation identity to the API/specification. If `operationId` is missing, the generator can derive a method/path key and warn about identity changes. Reused `operationId` values across different APIs must not collide.

Keep human-authored guides separate from generated facts. Generation must be deterministic, record source hashes and generator version, detect stale output, and refuse to overwrite unexpected human changes. Check generated source into the site, or supply it as a versioned build input, so rendering itself remains CLI-independent. Resolve remote references in an explicit preparation step. Normal generation must not follow arbitrary external URLs.

Acceptance requires a real user specification in addition to a toy example, complete accounting of supported operations, cyclic-reference handling, stable routes, semantic content in all selected outputs, and accessibility checks with no inherited Swagger/Redoc exclusion for the new static renderer. Measure a representative large specification before promising a throughput target.

Keep existing Swagger/Redoc integrations compatible. Interactive requests, credential handling, SDK generation, mock servers, and an API testing platform are outside this first compiler increment.

## Architecture and compatibility rules {#architecture}

Keep CLI internals small: command handling, Hugo/process integration, diagnostics, template loading, and bounded file changes. Add migration and OpenAPI packages when their stages begin. This is a suggested decomposition, not a plugin ABI or public SDK.

Three boundaries need versioning: the CLI's machine result format, the theme's public schema/output contracts, and each supported migration/generation input profile. Prefer capability checks over a single “requires newest OINK” rule. A newer unsupported schema must produce a useful compatibility diagnosis.

The CLI cannot import a sibling theme's private Python modules, depend on a local checkout layout, or download executable checks at runtime. Port selected consumer operations and test their behavior. Keep template-internal checkers in the theme, and make future changes to exposed consumer rules update their owning contract. Keep existing scripts available during the transition. Remove duplication only after the replacement covers supported cases.

No CLI configuration file is required initially. Hugo retains rendering configuration. If repeated usage later justifies a tool-policy file, it may hold ignored paths, rule severity, or a reviewed baseline, but must not mirror `params.ui`, navigation, languages, or module pins. A reviewed lint baseline cannot suppress a failed Hugo build, an unreadable input, or an unsupported required check.

## Roadmap and staffing assumption {#roadmap}

The planning envelope below is retained as the original proposal, not as an execution log. Stages 0 and 1 have a local first-stage candidate. This does not complete publication, independent-user studies, migration, or later content-model outcomes. Actual evidence belongs in the [acceptance record](/docs/design/research/2026-09-29-cli-acceptance/).

The following is an **8–12 week first-stage planning envelope**, assuming roughly one full-time implementation owner plus part-time documentation/review help. It is not a commitment or a claim about actual staffing. Toolchain qualification, recruitment, and bilingual review take time. Reduce scope before adding planned parallel work.

| Stage | Timing from approval | Deliverable | Exit evidence |
| --- | --- | --- | --- |
| 0: establish the boundary | Weeks 1–2 | Accept repository choice; collect failure examples; define result format and supported baseline; prototype read-only doctor/check against current 1.1.0 | Starter plus at least three varied real repositories; failures and coverage omissions recorded |
| 1: complete the daily workflow | Weeks 3–6 | Doctor/check, pinned init, thin dev/build; prospective single-site upgrade and file-preservation tests | New users can diagnose a seeded failure; ordinary Hugo still builds generated sites; no unexplained source changes |
| 2: release a bounded product | Weeks 7–12 | Proposed theme 1.2 + CLI 0.1; compatibility record; docs; qualified installation; limited Docsy migration assessment/pilot | First-run study and repeat upgrade use; migration limitations are explicit; published pins and consumer adoption checked separately |
| 3: validate migration and one content model | Months 4–6 | Harden the first migrator; choose version lifecycle or OpenAPI based on users; propose theme 1.3 / CLI 0.2 as needed | At least two real repositories use the chosen workflow; accepted contract precedes compatibility promises |
| 4: earn expansion | After month 6 | The other content capability, then optional recipes/provenance or agent transport where justified | Repeated use and maintenance capacity; no automatic commitment to a SaaS product |

If stage 2 overruns, remove migration writing from that release and keep its assessment report. Do not cut upgrade preservation, truthful diagnostics, or independence from the CLI. If no independent team wants the migration profile, stop expanding framework coverage and investigate onboarding/positioning instead.

Freshness/ownership is a later optional quality feature, initially a report whose findings users actually act on. A modification date must never be presented as verification. Ship a handful of useful official page recipes before a registry. Graph G2/G3, MCP, analytics adapters, executable examples, Studio, and managed services each need a specific user problem and capacity decision; this roadmap assigns them no delivery dates. Existing static agent outputs make MCP less urgent than adoption.

## Acceptance and product measures {#acceptance}

The user/adoption measures below remain targets. Local pilots run by maintainers validate implementation and preservation. They do not establish independent teams, first-user success rates, retention, or production adoption.

| Area | Initial target or required property |
| --- | --- |
| First successful use | With prerequisites already installed, at least 4 of 5 unfamiliar target users reach local preview and a passing strict check within 15 minutes without maintainer intervention; Record cold installation separately |
| Maintenance value | At least three real sites use diagnosis/checks and repeat a supported upgrade; Every failure has an actionable report |
| Diagnostic precision | Triage all blocking findings in the pilot; aim for less than 5% false positives in an explicitly counted labeled sample, rather than an unmeasured headline claim |
| Integrity | Zero silent content loss; every migration input is accounted for; repeat transforms have no diff; user edits and unrelated dependencies survive |
| Independence | Initialized/generated sites build through ordinary Hugo with provisioned dependencies; optional CLI and output features remain optional |
| Offline behavior | Run the qualified local workflow with outbound access denied after provisioning; record cache misses and explicitly networked features separately |
| Compatibility | Current tested theme baseline and candidate release, pinned site regression toolchain, root/subpath, and EN/ZH cases; do not imply that every Hugo version above the floor was tested |
| Adoption | Seek five independent pilot teams within the first stage, and track which reach production and continue using the result at 30/90 days; This is a validation target. It is not observed adoption |

Use independently maintained production sites as the main adoption measure, verified through public references or voluntary user confirmation. A stable documentation site should not stop counting merely because it has no commit in 60 days. Track theme upgrade recency separately from retention. Stars, download counts, internal consumer count, and agent-generated volume are supporting signals, not proof of independent adoption.

Track time to first local success, time to production, upgrade effort, and manual migration effort separately. Deployment can depend on accounts and providers outside the CLI, so do not equate successful local validation with publication. Do not add default telemetry to obtain these measures.

## Implementation ownership and validation {#implementation-validation}

| Change | Owning validation |
| --- | --- |
| Tooling descriptor and schema compatibility | A focused theme descriptor check plus `generate-config-schema.py --check` and relevant parameter checks |
| Diagnostics exposed to consumers | Owning resolver/checker cases; CLI diagnostic result/exit-code tests |
| Existing output behavior | `check-agent-indexes.py`, output/security/navigation checks appropriate to the changed surface |
| Init and upgrade | CLI tests against pinned Starter snapshots and repositories with replacements, vendor content, unrelated dependencies, and dirty target files |
| Migration | Ported/extended transform cases, source-preservation and repeat-run checks; reviewed real-site route/content evidence |
| Future version/API presentation | Theme output checks plus bilingual documentation-site integration, browser, accessibility, responsive, and visual review |

Run the smallest owning check first. Public behavior changes still require implementation, checker, and both language contracts in one coordinated delivery. Use the sibling site's `make check`, `make browser`, and `make dev` workflow for actual integration and visual acceptance. Do not move public regression scenarios into the theme's synthetic fixture tree, or force consumer installations to install the maintainer Node test stack.

For a release, separately record local checks, commits, tags, published module/binary resolution, consumer pins, and deployment. Theme release adoption continues through the maintained consumer inventory procedure. Use a coordinated issue/checklist to connect the repositories. No new orchestration framework is needed.

## Open decisions and stop conditions {#open-decisions}

Repository selection and first-stage implementation are settled locally. Remaining release decisions include qualified platforms, the public distribution channel, compatibility claims justified by executed evidence, and independent pilot recruitment. The acceptance record identifies the actual local toolchain and selected sites. It does not validate future platforms or users.

Result and exit semantics are frozen for the local candidate in the CLI contract. The minimal theme descriptor and stable theme warning identifiers remain separate proposals, not prerequisites retroactively added to this first CLI. Before a versioning beta, settle manifest projections, archive retention, and page correspondence. Before an OpenAPI beta, settle the supported spec subset and generated-source ownership.

Reconsider the separate CLI investment if pilots only need a tiny maintenance script, if rules must repeatedly duplicate template semantics, or if maintaining distribution consumes more effort than the measured user benefit. Keep successful standalone scripts in that case. If evidence changes, reorder versioning and OpenAPI. Do not expand the total concurrent scope.

## Decision log and sources {#decision-log}

| Date | Record |
| --- | --- |
| 2026-09-29 | Draft created from the supplied strategy research and local source review. Recommends a separate optional CLI, a small adoption release, bounded migrations, and sequential content capabilities. No implementation or repository creation accepted by this document. |
| 2026-09-29 | Subsequent user authorization accepted the independent Go repository and first-stage development. A local `0.1.0-dev` candidate implements doctor/check/init/upgrade/dev/build. Stable behavior moved to the CLI decision and usage guide. Local acceptance passed for CLI commit `e623d93`. Public release, independent adoption, and all later-stage proposals retain separate states. |

Local authorities consulted: [Architecture](/docs/design/architecture/), [generated schema decision](/docs/design/decisions/config-schema/), [migration boundary](/docs/design/migration/), [version behavior](/docs/customize/versions/), [OpenAPI limits](/docs/write/openapi/#limits), and [graph proposal status](/docs/design/proposals/knowledge-graph/). The source inspection also covered theme `bin/`, `schema/nav.v1.schema.json`, the existing Starter, and documentation-site build/check commands. Local in-progress changes are not represented as published release evidence.

External primary sources were checked on 2026-09-29: the linked Mintlify command reference, Nimbus repository, Docusaurus versioning guide, and Hugo config/module documentation. They inform comparisons. They do not validate OINK market demand or the proposed schedule.
