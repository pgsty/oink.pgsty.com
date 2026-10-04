---
title: OINK CLI capabilities and next steps
linkTitle: CLI overview
description: The 2026-09-30 six-command CLI snapshot, its safety and automation features, and the development directions proposed at that time.
weight: 35
icon: fa-solid fa-terminal
search_keywords: [OINK CLI, capabilities, command line, roadmap, doctor, check, init, upgrade]
last_verified: 2026-09-30
---

> [!NOTE] Historical first-stage snapshot
> This page retains the 2026-09-30 command inventory and evidence. Its six-command,
> platform and suggested-CI statements describe that date. Current maintenance
> behavior belongs to the [CLI contract](/docs/design/decisions/cli/)
> and [usage guide](/docs/start/cli/); the
> [maintenance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
> preserves earlier acceptance for its identified source and binaries.
> Local acceptance does not imply a public CLI release or deployment.

`oink` is a command-line tool for OINK site maintainers. It brings site creation,
environment diagnosis, output validation, local preview, and theme upgrades
into one interface. Its six commands already form a usable local workflow.
The next useful investment is to help more users install it, understand
failures, and repeat routine maintenance. Migration, documentation version
management, and API reference generation can follow one capability at a time.

This page explains current capabilities and possible next steps. For complete
installation instructions, see [Using OINK CLI](/docs/start/cli/). Executed tests
are recorded in the [first-stage acceptance report](/docs/design/research/2026-09-29-cli-acceptance/).

> [!NOTE] Current status
> As of 2026-09-30, this page describes local `0.1.0-dev`, commit `e623d93`.
> Code, tests, installation, and reproducible archives have been prepared and
> validated. Public CLI publication and deployment have not been completed.
> Future capabilities below are suggestions or existing proposals, not available
> commands or committed delivery dates.

## Purpose and audience {#purpose}

The OINK theme owns presentation, navigation, search, content components, and
output formats. Hugo loads configuration and renders the site. The CLI connects
those inputs and results into repeatable maintenance: configuration mistakes,
the actual theme source, broken references, and proposed upgrade changes should
all have inspectable evidence.

The CLI is a standalone Go executable that calls external Hugo. It requires no
Python, Node.js, account, or background service. Initialized sites retain normal
Hugo configuration and content. Once dependencies are available, ordinary Hugo
can build them without the CLI. Theme and CLI version numbers serve different
purposes.

It serves three audiences: new maintainers establishing a working baseline,
existing maintainers diagnosing and upgrading sites, and CI or automation
programs consuming stable JSON results and exit codes.

## The six implemented commands {#commands}

| Command | Problem it addresses | Current behavior and boundary |
| --- | --- | --- |
| `oink doctor` | Is the environment ready, and what does this site actually use? | Inspects Hugo Extended/version, required Go/Git, effective configuration, the declared theme version and resolved source, workspaces, replacements, vendor, languages, and outputs. Read-only diagnosis; no site build. |
| `oink check` | Does the rendered site contain detectable problems? | Copies inputs, isolates output and caches, builds with `--panicOnWarning`, then checks actual local links, anchors, resources, and supported machine outputs. |
| `oink init <directory>` | How can I get a usable, reproducible starting point? | Creates a site from an embedded, fixed Starter snapshot with its license and provenance. Supports `en`, `en,zh`, and `all` (EN/ZH/FR); validates before creating files and refuses nonempty targets. |
| `oink upgrade --to <tag>` | Will an upgrade work, and what will it change? | Handles one selected site, validates a candidate, and reports a plan. Preview is the default; only explicit `--write` applies selected module-file changes. |
| `oink dev` | How do I start everyday local preview? | Transparently runs `hugo server`, forwards arguments after `--`, and forwards process signals. |
| `oink build` | How do I run a strict production build? | Transparently runs Hugo, defaults to `production`, and adds `--panicOnWarning`. It does not run the additional reference checks provided by `check`. |

`doctor` inspects readiness; `check` also builds and validates artifacts.
`build` produces the site's normal publishing output, while `check` validates
in an isolated copy. `dev` and `build` can write normal Hugo output and caches;
read-only diagnosis and upgrade preview preserve site sources.

### Checks follow rendered output {#rendered-checks}

`check` asks Hugo to enumerate the output formats and URLs declared by each
page in each language, then verifies the generated files. It handles multiple
languages, root URLs and subpaths, URL encoding, and external-link boundaries.
It does not derive a second routing system from Markdown filenames. Page-level
output overrides, statically mounted unlisted pages, and intentional link-only
pages follow Hugo's actual semantics.

Supported machine outputs include NAVJSON v1 navigation trees, BookManifest v1
book manifests, offline search indexes, LLMS indexes, and LLMSFULL content
bundles. Disabled outputs are optional. A valid artifact in one language cannot
hide a missing required artifact in another. An unknown required contract is
reported as incomplete coverage.

`check --release` verifies a build intended to use a public theme version. It
disables both Go and Hugo workspaces and Hugo replacements in the isolated
copy. A conflicting theme `go.mod replace` is reported, never silently removed.
Ordinary `check` can validate a selected vendor build; `--release` explicitly
reports that verification of its public-source byte identity is incomplete.

### Upgrades validate the candidate first {#upgrade-safety}

An upgrade plan identifies the target version, selected files, and before/after
state. `--expect-plan` can bind a write to a reviewed plan; the command also
checks whether target files changed after planning. Dirty target module files
are protected, unrelated dependencies and edits survive, and write failures
provide backup and recovery evidence. Recovery must preserve concurrent user
edits instead of overwriting them to undo the CLI's own work.

Current upgrades handle `go.mod` and `go.sum`. They do not refresh `_vendor` or
rewrite arbitrary content or configuration. Vendor refresh requires a separate,
explicit, reviewable workflow. The CLI does not commit, push, or deploy.

## Automation and offline use {#automation}

Every command is non-interactive. With `--json`, stdout contains exactly one
`oink.result/v1` result; tool logs go to stderr. Results include rule IDs,
severity, known locations, explanations, actions, coverage, and raw Hugo
evidence. A source line number is never invented when the available evidence
cannot establish it.

| Exit | Meaning | Interpretation for automation |
| --- | --- | --- |
| `0` | Required work completed without blocking findings. | This request passed; still inspect coverage that was not checked. |
| `1` | Completed checks found policy violations. | Fix the reported inputs and check again. |
| `2` | Required work did not complete. | Investigate tools, builds, I/O, caches, or unsupported inputs; this is not a passing check. |

The default process policy is offline. Only explicit `--network` allows network
use for that invocation. The CLI does not download Go toolchains, install system
packages, change global configuration, or add telemetry. Supported workflows
can run offline after module preparation; a missing cache entry fails explicitly.

Isolated commands use disposable caches. A successful `init --network` does
not establish a persistent cache for subsequent commands. Only prepared module
download artifacts are reused; Hugo's global remote-resource cache is not.
Required remote content must be materialized locally or fetched during an
invocation that explicitly permits network access.

## A complete working path {#workflow}

After [installing locally](/docs/start/cli/#install) and installing the Go, Git,
and Hugo Extended versions required by Starter, use the following sequence.
The first command is an explicit dependency-preparation step that may use the
network:

```sh
GOWORK=off GOTOOLCHAIN=local go mod download github.com/pgsty/oink@v1.1.0
export GOMODCACHE="$(go env GOMODCACHE)"

oink init my-docs --languages en,zh
oink doctor --site my-docs
oink dev --site my-docs -- --bind 127.0.0.1 --port 1313
```

Edit the site title, `baseURL`, and content during preview. After stopping the
preview process, run:

```sh
oink check --site my-docs --release --json > check.json 2> check.log
oink build --site my-docs -- --minify
```

For an existing site's upgrade, preview first, then review and explicitly apply
the plan using the [upgrade guide](/docs/start/cli/#upgrade). OINK v1.1.0 here is
the tested initialization baseline, not a claim that it is always the latest
theme version.

## Verified scope and current limits {#limits}

First-stage acceptance covers Go tests, vet, race checks, ordinary Hugo builds
for all three Starter profiles at root URLs and subpaths, and three real
consumer repositories: the OINK documentation site, the PIG site, and repository
documentation. It also includes initialization and checking with OS-level
network denial, real upgrade write protection, thin-wrapper process checks,
and archive reproduction.

The exercised runtime platform is macOS arm64, with Go 1.27.1 and Hugo Extended
0.166.0. Darwin amd64 and Linux amd64/arm64 were cross-compiled but have not
completed runtime qualification on those systems. Windows is outside the
first-stage support scope. Source installation is available; public downloads,
tag-based installation, and Homebrew distribution are not delivered yet.

Isolated checks currently support materialized, single-host sites. Linked Git
worktree metadata, mounted symlinks, mounts outside the isolated inputs, custom
configuration directories, dynamic content adapters, multihost language output,
and render segments that suppress verification probes have explicit boundaries
in the [input scope table](/docs/start/cli/#check). Unsupported required inputs
cannot receive a complete passing result.

Static checking does not certify browser interaction, accessibility, external
URL availability, hosting redirects, translation completeness, or content
semantics. Browser and deployment acceptance remain separate workflows.

## Improvements to prioritize next {#next}

First reduce friction in the six existing commands. These are suggested
capabilities based on current limitations, not implemented features. New flags
and contracts still belong in the [formal proposal process](/docs/design/proposals/).

| Priority area | Possible additions | Evidence of completion |
| --- | --- | --- |
| Installation and platform support | Exercise complete workflows on target macOS/Linux systems, publish checksummed archives, and provide reproducible tag-based or Homebrew installation. | New users can install, initialize, preview, and check using public instructions; supported platforms have execution evidence. |
| More actionable diagnosis | Group findings by tools, dependencies, configuration, and artifacts; add rule explanations and repair examples; map to source only when reliable; evaluate CI annotations or SARIF export. | Users can identify the input to change, CI retains raw evidence, and false positives can be reviewed against real samples. |
| Explicit dependency preparation | Offer deliberate cache preparation and missing-input reports, distinguish modules from remote resources, and record exact versions, sources, and network requirements. | One preparation step supports repeated offline runs, with precise explanations when an input is missing. |
| More complete upgrade maintenance | Evaluate separate vendor candidate refresh and byte comparison, persistable review plans, and clearer recovery instructions. | Users can review the complete diff while vendor content, unrelated dependencies, and concurrent edits remain protected. |
| Easier initialization and authoring | Accept declarative site title, URL, and supported language-profile inputs; add a small set of official document, article, and Book page templates. | Fewer manual placeholder edits; output remains ordinary Markdown, data, and Hugo configuration. |
| Broader real-project coverage | Qualify common structures such as linked worktrees first; extend to multihost, external mounts, and dynamic content when needed; optimize large-site checks from measurements. | Every added input profile has regression evidence for source preservation and explainable failures. |

These directions should not all start at once. Use independent installation and
maintenance sessions to identify recurring obstacles, then choose one measurable
improvement at a time. Future ignore rules or lint baselines must not hide Hugo
build failures or missing required coverage.

## Later product capabilities {#later}

The following directions are discussed in the [CLI roadmap](/docs/design/proposals/oink-cli-roadmap/)
and remain proposals. They preserve the boundary that generated site sources
are ordinary files and rendering does not depend on the CLI.

| Capability | The CLI's possible responsibility | Prerequisites and limits |
| --- | --- | --- |
| Bounded Docsy migration | Produce an assessment classifying inputs as compatible, convertible, requiring review, or unsupported; later convert into a new directory and compare old/new routes. | Start with one documented profile from real sites, not arbitrary Docsy, MDX, or React conversion; preserve original files and literal code examples. |
| Documentation version lifecycle | Prepare version snapshots, maintain a small version manifest, and validate page correspondence and archive status. | The theme owns reader presentation; the CLI generates reviewable configuration. Missing pages must not be presented as equivalents, and versions remain independently buildable. |
| Static OpenAPI reference | Generate operation, parameter, request/response, and schema Markdown/data from local specifications for the existing Hugo output pipeline. | Define the specification subset, generate deterministically, and protect manual edits. Prepare remote references explicitly; request execution, credentials, and SDK platforms are separate work. |
| Agent and editor integration | Evaluate editor entry points or MCP over stable JSON results so other tools can reuse the same diagnostics and upgrade plans. | Establish repeated use of the core commands first. MCP, Studio, graphs, and hosted services require independent demand and maintenance capacity. |

The recommended sequence is a publicly usable maintenance tool, followed by
assessment for one migration path. For the next content capability, prefer
documentation version lifecycle unless real API users demonstrate stronger
repeated demand for static OpenAPI. Choose one foundation per stage to avoid
maintaining several models before users have validated them.

## Further reading {#references}

- [Using OINK CLI](/docs/start/cli/): builds, installation, flags, and complete workflows.
- [CLI and result contract](/docs/design/decisions/cli/): stable behavior, JSON, exit codes, and file protection.
- [First-stage acceptance](/docs/design/research/2026-09-29-cli-acceptance/): executed tests, real sites, and platform boundaries.
- [CLI and the next product stage](/docs/design/proposals/oink-cli-roadmap/): rationale, priorities, and acceptance conditions for future work.
