---
title: Optional CLI and result contract
linkTitle: CLI contract
description: The independent Go executable boundary, versioned diagnostics, isolated validation, and guarded maintenance plans for the current local CLI candidate.
weight: 50
icon: fa-solid fa-terminal
search_keywords: [OINK CLI, oink.result/v1, diagnostics, exit code, coverage, offline, upgrade]
design_kind: decision
design_status: accepted
decision_date: 2026-09-29
last_verified: 2026-10-04
implementation_status: local-candidate-not-released
---

> [!IMPORTANT] Current scope; local candidate
> This contract describes the reduced local `0.1.0-dev` command surface on
> 2026-10-04. Keep site diagnosis, real Hugo checks, initialization, builds,
> upgrades, and guarded maintenance plans. Cobra provides command help;
> colored English text is the default, with JSON/YAML results available.
> Studio, general editing, context, snippets, editor setup, and CI generation
> are retired. Historical R1–R8 acceptance applies only to its recorded source
> and binaries; it does not replace validation of the current implementation.
> No public CLI release, Homebrew distribution, or deployment is established.

## Context and ownership {#ownership}

The theme is a Hugo module; consumer tooling is an optional executable with a
different installation and release lifecycle. `pgsty/oink-cli` owns that
executable, named `oink`, and its Go tests. It invokes an external Hugo binary
without importing Hugo's private runtime or depending on a sibling checkout,
Python, Node.js, or unpublished theme scripts at runtime.

Hugo owns configuration resolution, rendering, routes, and anchors. The CLI
inspects Hugo's effective configuration, module graph, mounts, and rendered
files. It does not create a second route resolver, navigation authority, or
configuration namespace. Theme-only regression scripts remain maintainer tools.
Configuration preprocessing relocates workspace, replacement, and cache paths
only in the temporary copy. Hugo still owns defaults, configuration merging,
language selection, validation, and rendering semantics.
The public [architecture contract](/docs/design/architecture/) continues to own
theme behavior; this page owns the initial CLI boundary and result envelope.

The [usage guide](/docs/start/cli/) contains installation and command examples.
The [dated acceptance record](/docs/design/research/2026-09-29-cli-acceptance/)
separates executed checks from open limitations and release states. The
[maintenance acceptance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
preserves the earlier R1–R8 program and its source-bound evidence. The
[roadmap](/docs/design/proposals/oink-cli-roadmap/) retains future proposals and
adoption hypotheses rather than duplicating the current command reference.

## Command and mutation boundary {#commands}

Help groups commands by daily, maintenance, and release work. Run
`oink COMMAND --help` for the exact options.

| Command | Behavior and mutation boundary |
| --- | --- |
| `doctor` | Read-only toolchain, configuration, module source, workspace/replacement/vendor diagnosis |
| `check [links\|translations\|style]` | Actual Hugo output and declared source/translation policy in isolated copies |
| `init DIRECTORY` | Validate the fixed Starter before creating a new or empty site |
| `dev`, `build` | Ordinary Hugo processes; Hugo owns normal output/cache writes |
| `upgrade --to TAG` | Preview by default; only `--write` applies verified module changes |
| `translations status`, `translations diff PAGE` | Read-only relationships, hash-review states, and differences |
| `translations review SOURCE TARGET`, `baseline capture` | Explicit reviewer/reason; preview with optional new `--plan` |
| `new BUNDLE --title TEXT`, `move SOURCE TARGET` | Validate a candidate and preview its full diff; optional new `--plan` |
| `plans apply FILE` | Revalidate supported saved plans; write only selected files in the selected site |
| `inspect PAGE`, `impact --since REF` | Read-only actual page and historical/current impact facts |
| `workspace list`, `workspace check [GROUP]` | Select only explicitly registered sites |
| `build --check` | Check, seal, and export the same isolated production render |
| `artifacts verify` | Compare local artifacts with a manifest offline |
| `verify` | Compare deployed HTTP responses with a manifest after explicit `--network` |

Network access is off by default. All commands are non-interactive. Only
`dev` and `build` accept Hugo arguments after `--`. Removed commands and their
old plans cannot apply. Supported plan kinds are `authoring.new`,
`translations.review`, `baseline.capture`, and `content.move`.

## Versioned result envelope {#result}

| Option | Output |
| --- | --- |
| Default | Concise colored English text |
| `--json`, `-J` | One JSON `oink.result/v1` object |
| `--yaml`, `-Y` | One YAML document with the same result fields and types |
| `--verbose`, `-v` | All findings, coverage details, and tool logs |
| `--no-color` | Plain English text |

Choose one structured format. Nonempty `NO_COLOR` or `TERM=dumb` also disables
text colors. Structured output adds no terminal colors. Tool logs go to
stderr. `--format json|yaml` and `--non-interactive` remain hidden compatibility
options. Every command is non-interactive.

Default text shows status, counts, up to eight active findings, and explicit
coverage omissions. Detailed facts and reviewed findings remain available in
structured results. Plan and upgrade previews retain their complete diffs.
Cobra owns command dispatch and focused help. CLI messages use short, active
English sentences inspired by ASD-STE100; this does not assert certification.
User content and external tool evidence retain their original language.

| Field | Type and meaning |
| --- | --- |
| `schema_version` | String; `oink.result/v1` for this contract |
| `version` | String; CLI build version, including a development suffix when applicable |
| `command` | String; requested command, or `help` / `version` |
| `site` | Optional string; selected source or generated target directory when available |
| `exit_code` | Integer; the CLI result code defined below |
| `diagnostics` | Array of findings; an empty array means no recorded findings |
| `coverage` | Array of scoped coverage statements; callers must inspect these alongside findings |
| `evidence` | Array of subprocess records; empty when no subprocess ran |
| `data` | Optional command-specific JSON value; current commands return objects such as inspected facts, initialization provenance, or an upgrade plan |

The [JSON Schema](/schema/cli-result.v1.schema.json) describes this envelope.

The first version permits additive fields and new rule IDs. Consumers should
ignore unknown fields and treat IDs as opaque strings, not parse their spelling.
A change to the meaning or type of an existing envelope field requires a new
schema version. Command-specific facts and raw tool output are evidence, not
an SDK for importing internal Go packages.

The machine-readable schema is shipped in the CLI repository as
`schema/result.v1.schema.json`. Its identifier is not evidence that a schema
endpoint or public CLI release has been deployed.

Each evidence record has `command` (an argument array), optional `directory`,
`stdout`, `stderr`, and the subprocess's `exit_code`. Captured inspection and
build output remains available in the result. Directly streamed `dev`/`build`
output is sent to the logging stream rather than buffered again in evidence.
The subprocess status remains distinct from the CLI's `0`/`1`/`2` result; a
negative subprocess status can indicate that no normal exit code was obtained.

## Findings, severity, and locations {#diagnostics}

Every diagnostic has `rule_id`, `severity`, `message`, and `action`, plus an
optional `location`. Stable rule IDs identify the condition. Raw Hugo wording,
translated messages, paths, and build-specific details are not stable IDs.
Existing IDs must not be reassigned to a different condition.

The optional `incomplete: true` identifies a required-work failure that policy
cannot downgrade. Reviewed exclusions and baseline acknowledgements retain the
finding in `diagnostics` with `disposition: "excluded"` or `"baseline"` and
`review` containing `reason`,
`reviewed_by`, and RFC 3339 `reviewed_at`. An excluded finding remains visible
with its recorded severity; it does not block the completed policy check.
Any uncompleted required coverage, including `not_checked`, determines exit
`2`; only `complete` or `not_applicable` satisfies required coverage.

The severity vocabulary is `info`, `warning`, and `error`. `error` is blocking.
`info` and `warning` are advisory unless the underlying required Hugo
build fails under `--panicOnWarning`, in which case required work is incomplete.
Informational completion and scope explanations belong in coverage details.
Automation must use the result exit code and coverage, not only count severities.

When present, `location` contains `file`, with optional `kind`, `line`, and
`pointer`. `kind` distinguishes `source` from `output`. A rendered finding
points to the actual artifact and may include an element, attribute, or JSON
location hint in `pointer`; that field does not universally claim RFC 6901
syntax. A line number is included only when known. A rendered link failure
does not justify inventing a Markdown source line.

The CLI does not reject unknown valid front matter merely because a generated
editor schema omits it. Configuration validity continues to follow Hugo and
the owning theme resolver/checker; see the
[generated schema decision](/docs/design/decisions/config-schema/).

## Coverage and exit semantics {#coverage}

Each coverage entry contains `id`, `status`, `required` (boolean), and `detail`.
Entries describe the scope that actually ran. A report may contain several
statements about the same broad area; inspect all of them.

| Status | Meaning |
| --- | --- |
| `complete` | The stated operation, inspection, or artifact-check scope completed |
| `not_checked` | This run did not inspect the stated scope |
| `not_applicable` | The stated check is unnecessary for these inputs |
| `unsupported` | The stated contract or required input shape is unsupported |
| `incomplete` | The stated work was required but could not finish |

| CLI exit code | Meaning |
| --- | --- |
| `0` | Requested required work completed without blocking findings |
| `1` | Completed checks identified a policy violation, such as a broken local link or an unsafe requested write |
| `2` | Required work is incomplete, including argument, tool, build, I/O, cancellation, or required unsupported-contract failures |

Incomplete work takes precedence over policy findings. Required coverage that
has not completed cannot produce success; only `complete` or `not_applicable`
can satisfy it. Hugo build failure preserves the
raw evidence and stops output acceptance; the CLI does not report stale or
partial output as a passing check. Disabled optional machine outputs do not
become missing-output errors.

The rendered-reference scope includes supported HTML URLs and anchors and
supported emitted machine contracts. Coverage explicitly excludes browser
interaction, accessibility, visual presentation, external URL availability,
hosting redirects, and production deployment. It also identifies uninspected
dynamic resources and content semantics. Static output evidence does not prove
undeclared translation coverage, semantic translation equivalence or browser execution.

Hugo's public `Page.OutputFormats` supplies expected artifact names and URLs
per page and per enabled language. The isolated copy adds an unlisted probe
with a unique per-run identifier; each enabled language must emit its own
verified manifest. Identified probe files are removed before artifact checks.
Existing authored pages retain their output selections. Static content hidden
from ordinary page lists is resolved through Hugo's `GetPage`, without
deriving its route or output filename from source syntax. Effective per-language
base URLs and local-search settings accompany that enumeration. Enabled
supported machine artifacts are checked against these exact expectations;
optional disabled outputs remain optional.

The same Hugo probe supplies `data.pages` through public `Page.Path`,
`Page.File`, `Page.Translations`, `Page.Aliases`, and `Page.OutputFormats`.
Facts retain language, actual URLs, publication settings, translation
relationships and declared outputs. `sourceKnown: false` and
`sourceScope: "unknown"` identify pages without proven source provenance;
generated sections do not receive invented source files. Site-owned known
paths are relative to the selected site. Known copied dependency inputs have
explicit dependency scope. These facts describe the production view; a separate
internal analysis view can include drafts, future and expired pages without
changing production artifacts or claiming they are published.

`data.references` records observed HTML and machine-output references, their
actual resolved URL, output file/pointer, local target when present, and anchor
status when checked. It does not infer a Markdown source line. Page and
reference data remain additive command evidence, not a public Go SDK.

## Project check policy {#project-policy}

An optional regular `oink.yaml` at the selected site's root uses
`schema_version: oink.policy/v1`. It owns check selection, severity overrides,
reviewed finding exclusions, reviewed external URL scopes, translation scopes,
protected prose declarations and the optional baseline file path. Hugo inputs
continue to own languages, titles, URLs, menus and configuration; module files
own dependency versions. A symlink, unknown key/group, unsupported version,
invalid review metadata or multiple YAML documents is required input failure
(exit `2`). Diagnosis and checks only read this policy.

Without a policy, links, translations and style are enabled and required.
`check links`, `check translations`, or `check style` explicitly selects one
required group, regardless of its policy selection. Unselected or disabled
optional groups report `not_checked`. Every check invocation retains the
required strict Hugo build and output-enumeration prerequisites. Standalone
translation/source checks also use an explicit nonpublishable draft/future/expired
analysis view; it never replaces production artifacts. Managed `build --check`
renders only the production view and returns `2` for unknown required scope identities.

The `rules` mapping assigns `error`, `warning` or `info` to exact opaque rule
IDs. A reviewed `exclusions` entry requires `rule_id`, a clean relative `file`
glob, `reason`, `reviewed_by` and RFC 3339 `reviewed_at`; `**` patterns and path
escape forms are unsupported. Findings remain visible with review metadata.
Site-local source locations match against their relative site path; source
paths outside the selected site cannot match an exclusion.
Required build, input, tool or coverage failure cannot become success through
severity changes or exclusions.

Same-origin HTML references outside the configured base path are policy
findings unless a reviewed `external_scopes` URL declares a separately deployed
path scope. Each scope needs the same review metadata and an absolute HTTP(S)
URL without credentials, query or fragment. Matching uses complete path
segments. The scope cannot exempt missing targets inside the project or required
local machine-output targets. Different-origin references remain explicitly
unverified by offline static checks.

## Translation policy and review evidence {#translations}

`translations.scopes` selects source pages using clean absolute Hugo
`Page.Path` prefixes, then finds targets through Hugo's translation identity.
It does not infer a public route or language from a filename. Each scope has
`path`, `source_language`, `required_languages`, `mode` and `drafts`.
`mode` defaults to `localized`; `strict` is also supported. `drafts` defaults
to `include`; `ignore` excludes draft sources/targets, and `require-published`
requires the selected source and required targets to exist in production.
Known disabled Hugo languages are `not_applicable`; unknown languages are
invalid policy. The most specific matching path owns a source page.

Without scopes, existing pairs rooted in Hugo's enabled default language and
duplicate relationships are inspected. Universal localization is not required;
`translations.coverage` records the unconfigured language scope as optional
`not_checked`. Missing required targets and duplicate selected relationships
are policy findings. Draft/publication state is independent of review state.

Constraints are opt-in: `explicit_ids` compares the full recognized explicit-ID
map in strict mode; localized mode requires a selected `ids` list. `ids` requires
each named ID in both files, `placeholders` compares exact declared prose-literal
counts, and `code_labels` protects fenced blocks with each named language/info
token. `required_fields` requires nonempty dotted front matter fields in both
files; `equal_fields` compares their actual values. No rule requires matching
heading counts, translated prose or all code blocks by default.

`.oink/translations.json` uses `oink.translations/v1`. Explicit review records
bind Hugo source/target IDs, source language, complete source/translation byte
SHA-256 values, reviewer, reason and RFC 3339 time. An absent record is `unknown`;
equal hashes are `current`; source-only, target-only or both changes are
`source_changed`, `translation_changed` or `both_changed`. These are evidence
of changes since review, not semantic judgments. File modification time never
establishes review. Unproven sources stay unknown; a recorded review or protected
constraint that cannot be verified produces required incompletion.

## Native content rules and coverage {#native-content}

Source rules extract evidence from Markdown structure and independent enabled
Hugo attributes, preserving original UTF-8 bytes, CRLF/BOM, source offsets and
YAML/TOML/JSON front matter with unknown fields. Actual effective Hugo attribute
switches and configured math passthrough delimiters control recognition.
Fenced/inline code, shortcode bodies, raw HTML and passthrough contents do not
become prose or invented headings. Unsupported body syntax remains visible;
required source coverage cannot silently pass.

Generic rules detect duplicate recognized explicit IDs and evaluate declared
`style.protected` entries with `file`, exact prose `literal` and expected `count`.
The bounded OINK v1.1.0 catalog adds advisory code/table attribute, deprecated
front matter and dropped unsafe-attribute findings. Each rule records module,
version, immutable revision, module sum, license and exact source-file SHA-256
provenance in `data.native_rule_provenance`.

The catalog runs only when the actual mounted public v1.1.0 module-cache inputs
match those hashes. A replacement, vendor copy, other version or unknown source
does not select a latest-theme fallback: `native-theme-rules` is optional
`not_checked`, while generic syntax checks still run. This catalog does not
certify every custom component or theme feature.

## Baselines and reviewed file plans {#review-plans}

`baseline` selects a clean relative file, default `.oink/baseline.json`, using
`oink.baseline/v1`. Capture requires completed work and explicit review metadata.
The fingerprint binds exact rule ID, normalized location/pointer and condition
message; it excludes severity. Acknowledged findings stay visible with
`disposition: "baseline"` and original severity; new conditions still block
according to policy. Required incomplete findings/coverage cannot be acknowledged.

Review and capture preview `oink.plan/v1` with selected edits, readable diffs,
base existence/bytes/modes, after bytes and read guards. The plan ID excludes
mutable validated/applied/recovery state. `--plan FILE` exclusively saves the
plan; these commands do not accept `--write`. `plans apply FILE --site DIR`
requires that exact selected site, fresh isolated candidate validation through
the same checks and rechecked source guards before any write. Escapes, `.git`,
symlinks and nonregular files are protected; overlapping candidate/source trees
are refused. Stale plans fail safely. Optional `external_inputs_hash` binds
captured non-site input bytes, full modes and inventory into the plan ID. This
opaque SHA-256 grants no external paths or permission to read them. The owning
validator compares fresh proven inputs; trusted original external guards are
rechecked around selected writes.

Exclusive installation preserves a file created during commit. Partial failures
restore owned unchanged writes; subsequent editor bytes, modes or deletions
remain intact. The reported recovery directory keeps original bytes/modes and
actual concurrent captured evidence. Unrelated files and new editor children
are preserved. No file content authorizes shell execution or publication.

## Captured page inspection and impact {#project-graph}

`inspect PAGE` selects an actual Hugo page by exact language:path ID, Hugo
Path, permalink or proven site-owned source file. A known default language
resolves a multilingual Path; remaining ambiguity or an unknown selector is
required incomplete (`2`). `data.inspection` exposes source byte hash/full
mode, actual output identities, observed inbound/outbound references,
translations and physical bundle attachments. Physical attachments are
distinguished from observed published resources.

`impact --since REF` compares captured current inputs and an isolated committed
Git tree rendered by the same Hugo engine. It retains deleted prior pages and
their inbound edges, unchanged referring pages, translation peers, attachments
and actual derived outputs. Global or uncertain inputs expand causal scope;
an unowned actual HTML output such as an alias also forces conservative full
scope. Alias declarations never create guessed route ownership. Historical
inputs in proven Git mode scopes compare only Git's executable bit; other
module/foreign inputs and current facts retain full modes.

Historical materialization reads bounded Git objects without checkout hooks,
filters, smudge execution or document execution. The limits are 10,000 files,
16 MiB per file and 128 MiB per tree; required private history is bounded at
256 MiB. Symlinks, submodules, capped or missing objects, required incomplete
history and unsupported monorepo GitInfo are explicit incomplete states.
Committed site-owned dependencies can be proven. Current external local
replacement/workspace bytes cannot substitute for historical evidence.

`data.impact.baseline_state` is `complete`, `incomplete` or `unavailable`.
When the required baseline is unavailable, the result returns `2`, retains all
known current pages/attachments/references/outputs and expands full scope. It
creates no prior pages or invented changes; only an actually resolved commit
is recorded. `check [GROUP] --since REF` deliberately performs the full
current check and declares `data.check_scope: full`; no incremental speed or
partial validation claim is made. `data.impact.full_scope` describes causal
uncertainty separately from that validation scope.

Completed `inspect` and `impact` fact queries return `0` even when
their separately reported `data.current_check` has completed quality findings
(`1`). Required capture failures remain top-level `2`. `check --since` keeps
the current policy's quality exit code and required completion precedence.


`context` is removed. Read page facts through the JSON/YAML report from `inspect`.

## Content move plans {#content-moves}

`move SOURCE TARGET [--plan FILE]` previews a physical site-relative file or
bundle relocation. Actual Hugo identities determine translation peers and
old/new outputs. The plan includes byte/full-mode-preserved files and binary
attachments, readable diffs, proven Markdown destination rewrites, observed
route changes and alias advice. Front matter is not rewritten to install
aliases. Raw HTML, shortcode output, transformed destinations and ambiguous
source/output ownership stay visible manual actions; opaque source spans are
not changed. Repeated ordinary Markdown destinations can also lack a unique
source/output occurrence proof, including aggregate/print appearances. Matching
URLs alone do not authorize rewriting those occurrences. A relocated physical
attachment does not prove its new published URL. Resource URL changes require
paired actual rendered edges and equal emitted bytes; a proven processed image
URL does not prove an absolute original-resource URL. Unproven original URLs
stay manual and are not constructed from the directory move.

The original `before` check and provisional `route_probe` are separate from
the final candidate check. The provisional relocation may expose findings
`1` from stale inbound links. A plan is validated or saved only after the
final isolated candidate and reference proof pass. Unsupported identity or
required capture failure returns `2`; an actual final quality failure remains
`1` and cannot save an applicable plan.

Content move plans must be saved outside the selected site. Their additive
`oink.plan/v1` `move` selectors and `source_inputs_hash` bind the complete raw
source inventory, bytes and full modes; external-input and fresh-directory
guards also apply. Saved apply regenerates the original/relocated Hugo proof
and requires exact expected plan ID and files before final reference
verification. It rechecks current guards before writes, restores raw original
modes rather than private-copy modes, and preserves later editor bytes/modes
on refusal or guarded recovery. Stale inputs or an occupied fresh target lack
the required proof and return `2`. Only explicit `plans apply` writes selected
files; previews never stage or commit Git changes.

## Supported input boundary {#supported-inputs}

Initial full validation supports materialized files in a normal checkout or
without Git metadata, including supported local module replacements copied
into the isolated tree. It does not follow mounted symlinks or external mounts
back into the user's workspace. Auxiliary symlinks outside effective mounts
are omitted rather than validated. Linked Git worktrees with a `.git` file
need a materialized review copy; Git-dependent behavior needs a copy with its
own Git metadata.

The snapshot excludes top-level `public`, `resources`, `node_modules`, `tmp`,
and the Hugo build lock. A mount that needs excluded input cannot silently
pass. Root configuration and the standard `config` tree are supported;
explicit configuration files must be inside the selected site, and custom
`HUGO_CONFIGDIR` locations are refused. Supported configuration relocation is
not a second implementation of Hugo validation.

Content adapters (`_content.gotmpl`) can create unlisted pages that cannot be
enumerated completely through the supported public Hugo APIs. Full output
validation therefore reports incomplete work for those inputs. A disabled
page kind or render segment that omits an enabled language's probe is also
incomplete. Multihost language configuration is outside the first full-check
scope and returns incomplete work; multilingual paths on a single host remain
supported. These cases must not be presented as a successful partial check.

## Ordinary content plans {#authoring}

`new BUNDLE --title TEXT [--language LANG] [--translations LANGS]`
`[--kind page|docs|blog|book] [--plan FILE]` previews an ordinary Hugo leaf
bundle through captured site-owned content mounts. The primary language
falls back to the effective default; selected peers must be distinct enabled
languages. Shared filename and language-directory layouts follow actual Hugo
mounts, including observed `sites.matrix.languages` selection rather than an
assumed legacy `lang` field. Ambiguous, filtered or unsupported mappings require
manual authoring.
Existing bundles or sibling files owning that page are refused.

The primary index has `draft: false`; selected peer indexes have `draft: true`.
The title is a supplied literal, not translated text. No review record is
created. Full quality analysis and isolated candidate validation precede the
shared guarded plan. Every proposed new file must map to exactly one actual
site-owned Hugo source page with actual rendered outputs, including translation
drafts in the explicit analysis view. Link-only/no-output, ignored, hidden or
build-never content cannot
pass merely because the existing site renders cleanly; required identity is
checked even when ordinary source-check groups are disabled. Saving `--plan` creates only a new plan file; explicit
`plans apply FILE --site DIR` revalidates and checks source bytes/modes,
existence, fresh directories and later attachment conflicts before applying.
Fresh-directory state is bound into the plan identity and checked before/after
validation, between writes and at completion. Rollback preserves later editor
attachments and reports recovery; it does not delete unrelated directory entries.

Editor settings and Markdown snippets belong to the site editor.
`editor` and `snippets` are removed.

## Initialization profiles {#init-profiles}

`init DIR [--profile project|docs|blog|book] [--languages en|en,zh|all]`
composes one embedded MIT-licensed Starter archive. The default `project`
retains the previous complete language projection byte-for-byte. The language
selection is independent of the content profile: `all` means English,
Chinese and French.

Explicit `docs`, `blog`, and `book` retain their corresponding archived content
section and shared home, assets, examples, workflows and license. Native
section front matter defines their documentation, blog or sequential book
model and navigation. Each language's site title/description comes from its
archived section; existing localized home cards/actions/CTA are projected to
that section. Only their generated `hugo.yaml` and `data/home` YAML files are
serialized; retained content/license bytes stay unchanged. There are no four
copied Starter trees or runtime template downloads.

Unknown profiles are policy refusals (`1`) before candidate validation or
writes. Missing/failed required Hugo validation remains incomplete (`2`). New
and empty-target, candidate-before-publication, exclusive creation and
concurrent-edit recovery protections apply to every profile. Ordinary Hugo
builds each generated site with provisioned dependencies. Archived workflows
remain source examples; `init` does not generate or execute the checksum-bound
R3 CI templates.

## Bounded upgrade comparison {#upgrade-comparison}

`upgrade --to TAG` now captures baseline and candidate views from the same
original site inputs and returns a readable module diff with full mode changes.
Its comparison records actual Hugo pages/outputs/language settings, emitted
file hashes/sizes/modes, raw alias declarations and separately observed alias
redirect files. It reports removed/added URLs, proven redirects, alias target/
byte changes and enabled language/output/search changes. A clean candidate
build alone does not prove route or capability preservation.

A previous URL is preserved only when an observed redirect at its exact old
output file targets the corresponding actual candidate page. Unknown/relative
custom alias identity remains required incomplete (`2`). Removed previously
emitted routes or outputs are blocking findings (`1`). Both resolved theme
versions must match the explicitly selected pins; unknown/substituted pins,
unknown/different normalized Hugo versions or environments, or unexpected
other input changes remain incomplete. Comparison supports one HTTP(S) base
origin/path; multihost inputs stay incomplete. No configuration migration
transform or universal browser/theme compatibility is claimed; manual review
remains explicit optional unchecked coverage. Observed aliases that retarget a different
unique Hugo page are blocking independently of same-page URL moves.

The v2 upgrade plan ID binds the selected module plan, copied source bytes/full
modes/file inventory and normalized actual comparison. `--expect-plan ID`
checks a fresh capture/comparison, not a previously saved successful build.
Because emitted file hashes are bound, nondeterministic templates can require
a refreshed preview even when source files appear unchanged. Guards are rechecked before returning a preview, before each write and after
writes, including proven local dependency/workspace inputs read-only. Only
selected module files are written; rollback restores only unchanged files
owned by the operation and preserves later editor bytes. Existing dirty target,
replacement and vendor safeguards remain in force.

## File preservation and release checks {#preservation}

Initialization embeds the complete Starter commit and preserves its license.
The provenance records its hash and every projection: independent content/language
selection, the exact public theme pin/checksums, and disabling Git metadata for
a fresh directory. The default project retains prior bytes; selected content
profiles share the same archived source and license. Candidate validation precedes target writes. Exclusive
creation refuses existing files; rollback removes only unchanged files created
by that invocation and preserves concurrent user edits with recovery evidence.

Upgrade owns only a single site's selected `go.mod` and `go.sum` changes. It
preserves unrelated dependencies and directives, refuses dirty target files
for `--write`, checks the reviewed plan ID when provided, rechecks targets
before writing, and records backups/recovery. Unrelated dirty source files do
not block read-only diagnosis or justify overwriting them.

`check --release` disables `GOWORK` and `HUGO_MODULE_WORKSPACE` and removes
the environment replacement for the subprocess. It preserves `go.mod`
replacements, reports conflicting local OINK replacement policy, and keeps
vendor evidence separate from the public requirement. Upgrade refuses an OINK
replacement and refuses `_vendor`; vendor refresh remains a separate explicit
workflow. No module pin change is described as updating vendor bytes. If Hugo
actually selects vendored OINK, `--release` reports required public-source
verification as incomplete (exit `2`); matching version metadata is not proof
that the vendor bytes match the public tag. Ordinary `check` still validates
the actual vendor build.

Configured Hugo module replacements are also disabled only in the release
snapshot. If Hugo changes module files in that snapshot during resolution or
build, the CLI reports that dependency inputs need explicit preparation and
review. It preserves the original bytes rather than silently accepting a
build that depended on an unreviewed generated module-file change.

## Checked builds and artifact identity {#checked-artifacts}

`build --check --destination DIR --manifest FILE` uses an isolated,
warning-strict production build. Hugo renders once; the check engines inspect
that output, then seal and export those same bytes. It never invokes a second
renderer to create the publication tree. The source checkout remains unchanged.
Only an outcome of `0` with complete or inapplicable required coverage can be
sealed. Blocked or incomplete checks do not create a verified export.

This production view does not include the separate nonpublishable maintenance
render. An explicit scoped translation policy whose required Hugo identities
are unknown because publication excludes their sources returns `2`. It does
not infer missing translations from filenames or silently skip the scope.
Standalone `check` and `translations` retain the full maintenance view.

The destination must be new or empty, with an existing parent; the local
manifest must be a new file outside that tree. Export uses exclusive creation,
preserves exact bytes and full regular-file modes regardless of umask, and
rechecks source and destination against the manifest. Existing entries,
symlinks and overlapping trees are refused. Failed partial exports remain
unverified evidence and are preserved. Empty directories and directory modes
are outside the published file inventory.

`--marker` is optional and off by default. It adds
`.well-known/oink-build.json` with only `oink.build-marker/v1` and the artifact
ID. That file's entry is excluded from artifact-ID calculation to avoid a
circular hash, then its exact digest is included in the final inventory.
An existing marker path is refused. The manifest is never copied into the
public tree automatically.

The separately saved `oink.artifact/v1` manifest records the source-input hash,
known source Git revision and dirty state, actual resolved theme identity,
CLI/Hugo versions, effective environment/base URL/release settings, required
coverage, actual Hugo route contexts and each file's relative path, size, full
mode and SHA-256. Canonical URLs and HTML language values come from emitted
HTML; Hugo language keys remain separate. Unknown Git state stays unknown.
Original input bytes and modes are captured before temporary probe overlays
or workspace/replacement path rebasing. The public manifest omits absolute
local paths, arbitrary arguments, process logs and free-form coverage details.
Hashes prove byte identity, not a signature or publication of a local checkout.

Managed builds accept only the boolean Hugo flags `--minify`, `--gc`,
`--ignoreCache` and `--noTimes` after `--`, including `=true`/`=false` forms.
Other passthrough flags are unsupported inputs. Ordinary `build` keeps its
existing transparent passthrough behavior. Effective example/local addresses
are warnings during ordinary diagnosis and errors for checked release builds.
`--release` still requires separate evidence for actual public theme resolution;
a local Git revision or declared pin does not attest to vendor/replacement bytes.

## Local and deployed verification {#artifact-verification}

`artifacts verify --artifact DIR --manifest FILE` is read-only and offline.
It compares the exact file set, bytes, sizes and full modes. Changed, missing,
additional, unsafe or mode-changed files invalidate identity (`1`). Invalid
manifests, unreadable inputs and unsupported or interrupted inspection return
`2`. Verify the export again immediately before an uploader consumes it; later
edits cannot inherit a previous successful result.

`verify --site URL --manifest FILE --network` explicitly authorizes HTTP reads.
It checks every declared file and distinct actual Hugo route URL, including
all language/subpath contexts, against the manifest's bounded response size
and decoded-byte digest. Recorded HTML canonical/language values and an enabled marker are
checked when available. Shared URL/file requests may be coalesced without
removing their recorded contexts. HTTP cannot verify local file-mode bits.

A wrong body, soft-404, wrong route, changed captured canonical/language value
or wrong marker is a conclusive finding (`1`). Timeouts, authentication failures,
rate limiting, server unavailability and an absent required marker leave work
incomplete (`2`). Redirects outside the selected origin/base path are blocked;
the command does not discover or send credentials. Static build checks do not
perform this deployment check. Network permission for a build does not authorize
a later verification request or an upload.

## Retired CI generation {#ci-generation}

`ci init` is removed. Keep CI configuration in the site or Starter.
Local CLI validation does not execute hosted CI or deploy a site. Previously
saved CI plans are rejected by `plans apply`.

## Explicit workspace registry {#workspace-registry}

> [!NOTE] R6 supported local scope accepted
> The registry and optional-tool boundaries passed frozen owning/runtime, actual
> protocol, four-consumer parity/preservation and canonical source/render gates.
> A07 adapter and A15 workspace supported scope is accepted locally in the
> [maintenance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6).
> The recorded R1–R8 and A18 scope passed for its historical source and binaries;
> changes to the current CLI require new evidence.

A workspace is one explicitly supplied YAML registry, independently versioned
as `oink.workspace/v1`. It contains only site names and directories:

```yaml
schema_version: oink.workspace/v1
sites:
  - name: docs
    directory: ../docs-site
  - name: blog
    directory: ../blog-site
```

The registry must be a regular nonsymlink file containing exactly one YAML
document with known fields, 1–64 entries and at most 256 KiB. Names match
`[A-Za-z][A-Za-z0-9_-]{0,63}` and are case sensitive. Directories are literal
relative paths from the registry's actual parent, or absolute paths; variables,
globs and sibling discovery are not evaluated. Explicit directory symlinks and
operating-system aliases resolve to their canonical identity. Duplicate names,
duplicate or overlapping actual roots, filesystem roots, dangling symlinks
and nondirectory ancestors are rejected. Missing directories with a proven
existing ancestor remain listed; checking one returns that site's `2` without
preventing later selected sites from being checked.

`workspace list|check [GROUP] --workspace FILE [--sites NAME,NAME]` selects all
registered sites when `--sites` is omitted. Explicit selections require exact,
nonempty, distinct registered names and retain registry order, including when
the names were supplied in another order. `list` needs no Hugo renderer.
`check` reuses the single-site engine and each site's own Hugo inputs and
`oink.policy/v1` policy. It never duplicates Hugo configuration in the registry.

The existing `oink.result/v1` envelope contains `data.registry`,
`selected_sites`, `sites: [{name, path, result}]`, `completed_sites`,
`finding_sites` and `incomplete_sites`. Each child is a full single-site result.
Completed sites include exits `0` and `1`; finding sites are the `1` subset.
The aggregate exit is `2` if any selected site is incomplete, otherwise `1` if
any has blocking findings, otherwise `0`. Human output includes each site's
result and findings. This aggregation does not infer completion for unselected
sites.

Supported single-site commands accept `--workspace FILE --site NAME`, with one
explicit registered name and no default site. `init`, `artifacts` and `verify`
do not accept this selection. A saved `plans apply FILE` must bind to
the selected canonical directory; selecting another registered site returns
`2` before source writes. There is no automatic multi-site apply or upgrade.
Existing candidate validation and source/dependency byte and mode guards still
apply. Registry listing/checking neither provisions missing sites nor installs
tools, commits or writes consumer configuration.

## Optional check adapters {#optional-checkers}

Explicit `tools` entries in each site's `oink.yaml` select already provisioned
executables. These entries extend `oink.policy/v1`; they are not a second Hugo
configuration or an installer. Each kind has `enabled` (default `true`),
`required` (default `false`), `command` (default the kind's name), `config`
(a clean site-relative regular file when supplied) and `timeout_seconds`
(default 60 seconds; bounded nondefault values 1–300). Commands are one
executable name or absolute path, not shell expressions.

| Kind | Owning check group | Current supported protocol | Configuration boundary |
| --- | --- | --- | --- |
| `markdownlint` | `style` | markdownlint-cli `0.49.1` | Optional declarative JSON/YAML/TOML; no JS, JSONC, custom rules or `extends` |
| `vale` | `style` | Vale `3.24.0` | Explicit INI plus captured styles from the supported declarative subset |
| `lychee` | `links` | lychee `0.24.2` | Optional bounded request settings; explicit network consent |

Unconfigured tools are not discovered. A tool outside the selected check group
is visibly `not_checked`. A configured optional tool that is unavailable,
unsupported or cannot complete leaves an omission; required incompletion
returns `2` and cannot be downgraded by rule severity, exclusions or a problem
baseline. Required and disabled cannot be combined. Completed typed findings
still follow policy: blocking findings return `1`. An unrecognized tool version
or invalid protocol output does not count as a completed check.

`data.adapters` records each kind, requirement, status, typed diagnostics,
`adapter.KIND` coverage, raw process evidence, omissions and provenance.
Provenance includes the observed supported version, executable SHA-256,
captured configuration/style paths with SHA-256 and full mode, and pinned
public protocol sources. Tool logs stay in stderr and evidence; JSON stdout
remains one result. Per-process time and output are bounded, and changed
executables, captured configurations or tool-modified private inputs invalidate
their evidence.

Prose tools receive private masked copies of proven site-owned Markdown.
Front matter, BOM/CRLF and UTF-8 offsets, code, shortcodes, raw HTML, configured
math and attributes retain their source boundaries. Code prose is outside source attribution; Markdown structure and fence/inline
code boundaries remain available to markdownlint, while Vale receives the
prose-only mask. Findings touching excluded or synthetic mask text are not
attributed to original source. Source locations are emitted only for proven
original lines/ranges; unsupported syntax and
suppressed findings remain visible omissions. These adapters do not format or
rewrite original content.

Markdownlint uses an unpredictable generated JSON pointer to isolate the
captured rule object after upstream rc merging. Executable configs, custom
rule loaders and recursive `extends` are refused. Vale uses an explicit
captured INI, `--no-global` and copied declarative styles; sync, packages,
actions, scripts, conversions and style pipelines are unsupported. Lychee
accepts bounded `timeout`, `max_retries` and `max_concurrency` settings, plus
the literal `cache = false`; caching remains disabled and `cache = true` is
refused. Preprocessors and arbitrary command options are refused.

Offline is the default. Lychee is not invoked, including its version probe,
unless `--network` is explicit: optional coverage is `not_checked`, required
coverage is incomplete `2`. It receives only observed external HTTP(S)
references from actual Hugo output; local links remain the native check's
responsibility. Definitive failed `4xx` responses are policy findings, except
`401`, `403`, `408`, `425` and `429`; those, `5xx`, DNS/TLS failures and timeouts
are inconclusive, returning `2` when required and an omission when optional.
External fragments, browser behavior and remote content identity are not
verified. Findings retain the rendered output file and DOM pointer; no Markdown
line is invented from an external URL.

Child processes do not receive caller proxy-URL/credential settings or Node
preload variables. Literal `NO_PROXY`/`no_proxy` host-list data may be forwarded
for the qualified runtime. This is not a promise that every operating-system
proxy route is disabled, or an OS network sandbox. Tool preparation and any
network operation remain separate explicit actions; no tool is installed by
these commands.

## Offline and compatibility boundary {#offline}

Offline is the default for managed subprocesses. Dependency misses are
incomplete work. `--network` explicitly enables network use for the current
operation; it conflicts with `--offline`. Isolated checks may seed disposable
caches from already provisioned local modules. Downloading into a disposable
cache does not promise a persistent cache for the next invocation.

Only module download artifacts are seeded; isolated resource caches start
fresh. The CLI does not reuse a global `GetRemote` cache to promise offline
remote-resource builds. Required resources must be available as local inputs,
or that operation must explicitly enable network access.

The CLI does not download a Go toolchain, install packages, alter global
configuration, or enable telemetry. Its process policy is not an operating
system network sandbox. Qualification records distinguish ordinary offline
execution from tests that actually deny outbound access at the OS boundary.

Compatibility is declared from executed evidence, not inferred from a
successful cross compilation. The local candidate has an exercised macOS
arm64 path with Hugo Extended 0.166.0 and public OINK v1.1.0; the version gate
accepts Hugo Extended 0.160.1 or newer without claiming all such versions were
tested. Initialized sites retain normal Hugo inputs and require only their
documented dependencies after removing the CLI.

## Retired local Studio {#studio}

`studio` is removed from the CLI. Use an ordinary editor and `oink dev` for
a site preview. Read maintenance facts through `inspect` and structured reports.
The dated R7 acceptance remains historical evidence for its identified inputs.

### Retired management API {#studio-api}

The CLI no longer serves a management API. Earlier Studio API acceptance
does not describe the current executable.

### Historical capture limits {#studio-limits}

Historical R7 limits belong to the dated acceptance record. Current command
coverage and supported inputs are defined in this contract.

## Retired general editing {#editing}

`edit` and Studio editing are removed. Edit source with an ordinary editor,
then run `check`. `new`, `move`, review records, and baseline plans retain
candidate validation and byte/mode guards. Previously saved editing plans
are rejected. The dated R8 record remains historical evidence.

### Retired text and field editing {#editing-text-fields}

The CLI no longer owns general text or front matter editing forms.

### Retired snippets and attachment editing {#editing-components-attachments}

Write Markdown and add attachments with the site editor. The CLI no longer
provides a snippet catalog or general attachment editing command.

### Retired Studio editing {#editing-studio}

The CLI does not serve an editor or accept browser Apply requests.

## Verification and remaining scope {#verification}

Use `make test` for offline Go tests and vet. Use `make test-hugo` for actual
Hugo integration and `make test-tools` for configured optional tools.
Skipped integration cases are not passing runtime evidence. Current changes
need new source/binary-bound evidence; an older record does not qualify them.

> [!WARNING] Current integration gate is incomplete
> On 2026-10-04, `make test` passed on macOS arm64 with Go 1.27.1 and Hugo
> Extended 0.166.0. The `make test-hugo` run failed
> `TestPublicR5CachedPublicModuleMovePreviewApplyAndOrdinaryHugo`: module-collection
> text preceded the configuration JSON, and the move returned `2` with
> `Hugo config did not return JSON`. Candidate validation refused the operation
> and reported the source unchanged. An immediate targeted rerun passed.
> The intermittent failure remains unexplained; the rerun does not establish
> a passing full integration gate for the current candidate.

The dated [maintenance acceptance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/)
preserves earlier R1–R8 and A18 evidence. Declared targets are macOS arm64 and
Linux arm64/amd64. Darwin amd64 is experimental and unqualified; Windows is
unsupported. Archive creation, signing, distribution, consumer adoption, and
deployment are separate states. This contract authorizes no automatic commit,
push, publication, or deployment.
