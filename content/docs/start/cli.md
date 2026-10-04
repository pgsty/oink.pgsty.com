---
title: Use the OINK CLI
linkTitle: OINK CLI
description: Build the optional Go executable locally, initialize a pinned Starter, inspect existing sites, and validate a single-site upgrade before writing.
weight: 40
icon: fa-solid fa-terminal
search_keywords: [OINK CLI, oink, doctor, check, init, upgrade, offline, JSON]
last_verified: 2026-10-04
---

`oink` is an optional Go CLI for Hugo sites. The local `0.1.0-dev` candidate
focuses on diagnosis, real output checks, initialization, builds, theme
upgrades, and guarded maintenance plans. Hugo remains the renderer. Sites
continue to work with ordinary Hugo.

> [!IMPORTANT] Local implementation
> This guide describes the reduced command surface on 2026-10-04. The CLI
> has no established public release or distribution. Earlier R1–R8 acceptance
> belongs to its historical source and binaries. The [CLI contract](/docs/design/decisions/cli/)
> defines current behavior. Studio, general editing, context, snippets,
> editor setup, and CI generation are retired.

The current cached-module move integration failed once and passed a targeted
rerun; the intermittent failure remains open. For the recorded scope,
see the [verification limits](/docs/design/decisions/cli/#verification).

## Build and install locally {#install}

From an available `oink-cli` source checkout, use Go 1.26 or newer and Make:

```sh
make deps                    # explicit network preparation of Go dependencies
make build                   # local toolchain, offline build into bin/oink
./bin/oink --version
./bin/oink --help
make install                 # defaults to $HOME/.local/bin
export PATH="$HOME/.local/bin:$PATH"
```

The `export` affects this shell only. The CLI does not install system tools or
change a shell profile. `make install PREFIX=/your/prefix` chooses another
prefix; `BINDIR=/your/bin` selects the exact directory. A source build needs
the dependencies in `go.sum`; `make deps` explicitly prepares them when network
access is available. The build and install targets then use the local
toolchain without downloading dependencies or another Go compiler.

The [dated runtime acceptance record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#a18)
exercised its identified historical candidate on macOS arm64, native
Linux arm64 and Linux amd64 emulated through QEMU TCG, with Go 1.27.1, Hugo
Extended 0.166.0 and the public OINK v1.1.0 module. The Hugo version gate accepts
Extended 0.160.1 or newer; this is not a claim that every accepted version has
been tested. The embedded Starter documents Hugo Extended 0.165.0 or newer
and requires Go 1.27. Those Linux tests ran as nonroot users on ext4 with
provisioned offline dependencies; required filesystem/signal and selected
actual-Hugo cases execute. Optional tools absent from a guest stay explicit
skips; they have separate host protocol evidence. Two fresh builds reproduced
all five archives, and the three declared runtime archives were extracted and
executed outside a checkout without Node. Darwin amd64 is an experimental
archive and remains unverified after actual Bad CPU type; cross-compilation
does not prove runtime support. Windows is outside the declared scope.
These results remain bound to the recorded source and archives; they do not
qualify the later reduced CLI or a newly built executable automatically.

`make release VERSION=0.1.0-dev DIST=dist` prepares four binary archives, a
source archive, and `SHA256SUMS` in a new or empty directory. It does not
publish them. See the [archive acceptance and reproduction steps](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#a18)
for the exercised platform and reproducibility limits.

## Create a site from the fixed Starter {#init}

Prepare the public theme once if it is not already cached. This explicit
provisioning command may use the network:

```sh
GOWORK=off GOTOOLCHAIN=local go mod download github.com/pgsty/oink@v1.1.0
export GOMODCACHE="$(go env GOMODCACHE)"
oink init my-docs --profile docs --languages en,zh
```

`init` accepts a new directory or an existing empty directory. Its parent must
exist. It refuses existing files, including dotfiles, and refuses a symbolic
link as the target. It validates a temporary candidate before creating any
target file and detects target changes during that operation.

Choose `--profile project` (the default), `docs`, `blog`, or `book`. `project`
keeps the complete previous Starter projection. The other choices retain their
archived content section and adapt the existing localized site title, home
cards/actions and navigation to that section. Selected content and shared
assets/examples/workflows/license retain their archived bytes; generated
configuration and homepage YAML are the only serialized profile projections.
The archived workflow examples remain unchanged and are not the checksum-bound
CI plans from `ci init`.

Language choices remain `en` (default), `en,zh`, and `all` (English, Chinese and
French), independently of the selected profile. Every composition uses the
same MIT-licensed Starter commit
`137843b25bacd76ddd1f7ce71330bf2e3155b954` embedded in the executable, pins OINK
v1.1.0 with recorded Go checksums and disables `enableGitInfo` before the first
Git commit. No runtime template fetch, Git initialization or commit occurs.
Unknown profiles fail before writing; unavailable or failed required Hugo
validation leaves the new/empty target unchanged.

Edit the title and `baseURL` in `my-docs/hugo.yaml`, then edit the home data and
sample content using the [Starter tutorial](/docs/start/starter/). After
creating Git history yourself, you can enable `enableGitInfo` if wanted.
Ordinary Hugo can build the generated site without the CLI:

```sh
cd my-docs
GOWORK=off HUGO_MODULE_WORKSPACE=off GOPROXY=off HUGO_MODULE_PROXY=off \
  GOTOOLCHAIN=local hugo --environment production --panicOnWarning
cd ..
```

This uses the `GOMODCACHE` exported above and provisioned dependencies. All
12 profile/language combinations passed ordinary warning-strict Hugo at both
root and `/manual/` URLs (24 builds). Rendered local references were checked,
and complete source bytes/modes/file inventories compared equal before/after.
Public init/check tests separately cover all four profiles in English and
bilingual configurations, default-project byte/mode parity and failure paths.

## Create ordinary content {#authoring}

Start from the initialized bilingual site above. Preview a new bundle and its
Chinese draft, inspect the diff and candidate result, then apply the saved plan:

```sh
oink new content/docs/guide --site ./my-docs --title "Getting started" --translations zh --kind docs --plan new-guide.json
oink plans apply new-guide.json --site ./my-docs
```

`--language` defaults to the effective default language; `--kind` defaults to
`page` and also accepts `docs`, `blog`, or `book`. The site-relative bundle path
must map unambiguously through actual content mounts and their language-site
matrix. Language directories retain distinct physical indexes; shared filenames
use the actual language relationships. Existing bundles or
same-page sibling files are preserved. The primary file is an ordinary page;
selected translation files are drafts with the supplied title as placeholder.
They remain unreviewed until explicit human review. Each proposed file must
be recognized as one actual site-owned Hugo page with actual rendered outputs;
link-only/no-output, ignored or build-never new files cannot pass merely because
existing content builds cleanly.
Saving a plan does not write those site files. Apply rechecks the bound fresh
directory and source state and preserves later editor attachments on failure.

Configure editor hints and snippets with the ordinary site editor. The CLI
no longer generates these settings.

## Inspect pages and committed impact {#project-graph}

Use an actual page ID, Hugo Path, permalink or captured source path. The
language:path ID removes multilingual selector ambiguity:

```sh
oink inspect 'en:/docs/old' --site my-docs --offline --json
oink impact --since HEAD --site my-docs --offline --json
oink check links --since HEAD --site my-docs --offline --json
```

Choose IDs from the actual captured page facts; these example pages must exist
in your site. `inspect` exposes observed references, actual outputs, translation
peers and physical bundle inputs. `impact` renders the selected committed Git
tree and the current site, including old deleted identities and unchanged
inbound pages. Changed global configuration/templates/data and uncertain
ownership expand scope. An observed alias output with unproven page ownership
also causes full scope, without guessing an owner from front matter.

`check --since` currently runs the full current check. Read
`data.check_scope: full` separately from causal `data.impact.full_scope`.
Completed `inspect`/`impact` queries return `0` while quality findings remain
in `data.current_check`; full checking retains policy findings `1`. Missing
or unrenderable history is required incomplete `2`: known current facts remain
visible, while old identities and changes stay unknown. Current external
local dependencies are never borrowed as historical bytes. A committed
site-owned theme is supported; symlink/submodule and required unsupported or
incomplete history states are explicit limits.

## Preview and apply a content move {#content-moves}

```sh
oink move content/docs/old content/docs/new --site my-docs --offline \
  --plan /tmp/oink-move-plan.json --json
oink plans apply /tmp/oink-move-plan.json --site my-docs --offline --json
```

Use clean physical site-relative file/bundle paths and save the new plan
outside the selected site. The preview shows original checks, a provisional
route probe, final validation, translation/attachment mappings, byte/full-mode
diffs, actual old/new routes, alias advice and manual references. A provisional
probe may report stale-link findings `1`; only the final candidate can validate
the plan. Raw HTML, shortcode output, transformed or ambiguous destinations
are not rewritten. Repeated ordinary Markdown destinations can also stay
manual when exact source/output occurrence ownership is unproven, including
aggregate/print output. Their final broken targets return `1` and no plan is
saved. Review manual source locations and actual output pointers in your editor,
then create a fresh preview. A moved attachment needs a proven new published
URL, not merely a new physical path. Paired equal-byte processed image outputs
can be proven while absolute original-resource URLs remain manual; those
unproven URLs are not constructed automatically.
Aliases are advice for review, not automatically serialized front matter.

Explicit saved apply captures and regenerates the actual proof before selected
writes. Complete source hashes/modes/inventory, external inputs and fresh
target directories remain guarded. Existing targets, later source/attachment/
configuration edits or mode changes return `2` without overwriting them.
The move preserves original modes and binary bytes, unrelated files and the
Git index; it does not commit. The resulting ordinary Hugo inputs remain
buildable with Hugo independently of the CLI. Inspect the named recovery
directory if an apply reports a failure during writes.

## Diagnose and validate an existing site {#check}

Run these commands from any directory and select exactly one site:

```sh
oink doctor --site ./my-docs
oink check --site ./my-docs
oink check links --site ./my-docs --format json
oink check --site ./my-docs --base-url https://example.org/manual/
oink check --site ./my-docs --release --keep-work
```

`doctor` reports the real Hugo executable and version, required tools, the
declared theme pin, effective Hugo configuration, module graph and mounts,
workspaces, replacements, vendor presence, languages, and enabled outputs.
It does not build the site. Keep the raw subprocess evidence alongside the
structured findings when investigating a Hugo error.

`check` copies the inputs into a disposable directory, isolates build outputs
and caches, invokes Hugo with `--panicOnWarning`, and checks supported local
links, anchors, resources, and machine-output references against the rendered
files. Hugo itself enumerates each page's enabled output formats and URLs for
each language, including front matter overrides and statically authored pages
excluded from ordinary page lists. A temporary verification output is added
only in the disposable copy and removed before artifact checks. The CLI does
not infer routes from Markdown filenames. Disabled machine outputs are not
errors. Coverage entries identify checks that were
completed, omitted, unsupported, or incomplete. Browser interactions,
accessibility, external URL availability, server redirects, and deployment are
outside this static check.

JSON `data.pages` supplies Hugo's page identities, actual routes, aliases,
languages, translations, publication settings, known source provenance and
outputs. `data.references` supplies observed rendered references and checked
anchor state. Generated pages with no proven file retain an explicit unknown
source. These are production-view facts; their presence does not certify
undeclared translation coverage or invent a Markdown source line.
Human output summarizes page/reference counts; use JSON for the full arrays.

Both commands preserve source files. `--keep-work` retains the disposable
directory and reports its path for inspection; otherwise it is removed. Use
`--config FILE`, `--environment NAME`, and `--hugo PATH` when the site needs a
specific configuration, environment, or Hugo executable. Configuration files
must be inside the selected site. For inspection, `--environment` takes
precedence over `HUGO_ENVIRONMENT`; otherwise the environment is `production`.
If Hugo adds or changes `go.mod` or `go.sum` in the temporary copy, the CLI
reports that required dependency preparation remains unreviewed; it does not
apply those changes to the source or silently call the original inputs ready.

`--release` disables both Go and Hugo workspaces and disables environment and
Hugo-configuration replacements in the disposable copy. It preserves `go.mod`
replacements. A local
OINK replacement must be reviewed explicitly before claiming a public-pin
check; the CLI does not silently delete it. Vendor evidence is also separate:
a public requirement in `go.mod` does not establish which bytes are in
`_vendor`.

The initial isolated-check scope has these limits:

| Input shape | Current behavior |
| --- | --- |
| Normal checkout with its own `.git` directory, or materialized files without Git | Supported within the other documented boundaries |
| Linked Git worktree with a `.git` file | Rejected; use a separate materialized copy with its own Git metadata if Git history is needed |
| Mounted symlinks or mounts still pointing outside the isolated snapshot | Rejected; materialize those inputs inside the selected site or supported local dependency |
| Unmounted auxiliary symlinks | Omitted from the snapshot; this does not validate their contents |
| Mounts using excluded `public`, `resources`, `node_modules`, or `tmp` trees | Rejected when they are required source inputs; keep authored/generated source in a dedicated source directory |
| Custom `HUGO_CONFIGDIR` outside the supported `config` location | Rejected; use the site's `config` tree or an explicit in-site `--config` file |
| Hugo content adapters (`_content.gotmpl`) | Complete enabled-output enumeration is unsupported; `check` and candidate validation return incomplete work |
| Multihost language configuration | Unsupported for full output validation; returns incomplete work rather than treating each host as one output tree |

Likewise, disabling page rendering or selecting render segments that omit an
enabled language's verification output cannot produce a successful full
check. These are coverage limits, not instructions to delete a worktree,
replacement, symlink, or authored content. `doctor` can still inspect supported
configuration without claiming a completed output build.

## Select checks and record project policy {#project-policy}

Create a regular `oink.yaml` at the site's root when the project needs explicit
checking policy. It uses `schema_version: oink.policy/v1` in one YAML document.
Keep languages, menus, URLs and theme versions in existing Hugo/module inputs.
Unknown policy keys/groups, invalid reviews and required disabled groups
return `2`.

This example retains required links and demonstrates a reviewed finding and
a separately deployed URL scope. Replace illustrative paths and review
metadata with actual project decisions:

```yaml
schema_version: oink.policy/v1
checks:
  links: {enabled: true, required: true}
rules:
  ANCHOR_MISSING: warning
exclusions:
  - rule_id: REFERENCE_MISSING
    file: docs/legacy/index.html
    reason: Reviewed legacy reference awaiting removal
    reviewed_by: site-maintainer
    reviewed_at: "2026-10-03T00:00:00Z"
external_scopes:
  - url: https://example.org/status/
    reason: Separately deployed status application
    reviewed_by: site-maintainer
    reviewed_at: "2026-10-03T00:00:00Z"
```

Rules use exact diagnostic IDs and `error`, `warning` or `info`. Exclusion
globs use clean relative paths; recursive `**` and escape paths are unsupported.
Excluded findings stay visible with `disposition: "excluded"` and review
metadata. Checks never create review records as a side effect. Required
build/input/tool failures and unsupported coverage remain `2` despite policy.

For a site at `https://example.org/manual/`, same-origin HTML `/status/`
references normally fail as outside the published base path. The reviewed
scope declares that separate application; availability remains untested.
Complete path-segment matching excludes `/status-other/`. A scope cannot hide
missing targets inside `/manual/` or required local machine-output references.

Without a policy, `check` enables required links, translations and style.
`check links`, `check translations` and `check style` each select one required
engine; unselected groups report optional `not_checked`. Explicit policy groups
can disable optional checks. Every check retains its strict Hugo prerequisites.

## Declare translation coverage {#translations}

Start with Hugo's actual page identities in `check --json` (`data.pages`), then
declare the source `Page.Path` scope and required enabled languages. Paths are
Hugo source identities, independent of slug, URL, aliases or language prefixes.
Extend the same single `oink.yaml` object; this complete example also declares
protected prose and the baseline path:

```yaml
schema_version: oink.policy/v1
checks:
  links: {enabled: true, required: true}
  translations: {enabled: true, required: true}
  style: {enabled: true, required: true}
translations:
  scopes:
    - path: /docs/handbook
      source_language: en
      required_languages: [zh]
      mode: localized
      drafts: include
      constraints:
        explicit_ids: true
        ids: [setup]
        placeholders: ["${SERVICE_NAME}"]
        code_labels: [bash]
        required_fields: [title]
        equal_fields: [weight]
style:
  protected:
    - file: content/docs/handbook.md
      literal: "${SERVICE_NAME}"
      count: 1
baseline: .oink/baseline.json
```

Use real page paths, filenames, IDs and protected literals from your project.
`mode` defaults to `localized`, `drafts` to `include`. Strict mode with
`explicit_ids: true` requires complete recognized explicit-ID correspondence;
localized mode protects the selected `ids`. Placeholder counts, named fenced
code, required dotted fields and equal dotted values are separate opt-in
constraints. Other prose, heading counts and code may differ.

`drafts: ignore` skips draft sources and treats draft targets as unavailable;
`require-published` requires the source and required targets in the production
view. Hugo-disabled known languages are optional `not_applicable`; unknown
languages fail policy loading. Without scopes, existing default-language pairs
and duplicate relationships are inspected, but universal localization is not
required. JSON `data.translations` distinguishes missing, draft and hash-review
states. An explicit nonpublishable analysis includes draft/future/expired pages
without replacing production output or publishing them.

## Inspect source rules and provenance {#native-content}

```sh
oink check style --site ./my-docs --json
```

Generic rules inspect recognized explicit IDs and declared protected prose.
The parser follows effective Hugo `markup.goldmark.parser.attribute.title`
and `.block`, plus `markup.goldmark.extensions.passthrough.enable` and its
configured `.delimiters`. These settings remain in Hugo configuration.
It keeps original UTF-8/CRLF/BOM offsets and accepts
unknown valid YAML/TOML/JSON front matter. Code, shortcode bodies, raw HTML and
math contents are excluded from prose evidence; an attribute after a fence is
not treated as a supported code attribute. Unsupported required source syntax
or absent declared protected inputs returns `2`.

The small native OINK v1.1.0 catalog reports advisory code/table conflicts,
deprecated attribution fields and attributes the published theme drops.
`data.native_rule_provenance` records immutable source/license hashes. The
catalog runs only for a SHA-verified actual public module-cache mount. Other
versions, replacements, vendor copies and unknown identities report optional
`native-theme-rules: not_checked`; generic rules still run. Review this coverage
before treating the check as complete for a particular component.

## Review translations and apply metadata plans {#review-plans}

Use the exact Hugo IDs or unambiguous captured source filenames from the report:

```sh
oink translations status --site ./my-docs --json
oink translations diff 'en:/docs/handbook' --site ./my-docs
oink translations review 'en:/docs/handbook' 'zh:/docs/handbook' \
  --site ./my-docs --reviewed-by site-maintainer \
  --reason 'Reviewed source and translation together' --plan /tmp/oink-review.json
oink plans apply /tmp/oink-review.json --site ./my-docs
```

Review previews `.oink/translations.json` (`oink.translations/v1`) after candidate
validation. It never writes the site during preview. The record binds full
source/translation byte SHA-256 values and explicit reviewer/reason/time.
`--reviewed-at RFC3339` is optional and defaults to current UTC. No record means
`unknown`; `current`, `source_changed`, `translation_changed` and `both_changed`
describe hashes since review, without judging translation accuracy. Modification
time is not review evidence. `diff` shows captured source text for comparison.

To acknowledge completed, reviewed existing findings while keeping them visible:

```sh
oink baseline capture --site ./my-docs --reviewed-by site-maintainer \
  --reason 'Reviewed existing findings for this maintenance baseline' \
  --plan /tmp/oink-baseline.json
oink plans apply /tmp/oink-baseline.json --site ./my-docs
```

The default baseline is `.oink/baseline.json` (`oink.baseline/v1`); `baseline` in
policy can select another clean relative file. Acknowledged exact rule,
normalized location/pointer and condition remain visible with
`disposition: "baseline"` and review metadata. Severity changes do not invalidate
that fingerprint; new conditions still block. Required incomplete work cannot
be captured or hidden by a baseline.

Both preview commands require reviewer and reason. `--plan FILE` creates a new
`oink.plan/v1` file without overwriting; omitting it prints the validated plan
only. Review the readable diff, site, file list and base byte/mode guards before
`plans apply`. That command validates a fresh isolated candidate and refuses
stale guards, escapes, `.git`, symlinks and nonregular files. It writes only
the plan's selected files; these commands do not use `--write`. Failed partial
writes restore owned unchanged files and preserve later editor bytes, modes or
deletions. The reported recovery directory retains original/concurrent evidence.

## Preview and apply one theme upgrade {#upgrade}

Choose an explicit release tag. The following command validates a candidate
and prints the proposed module-file changes without applying them:

```sh
oink upgrade --site ./my-docs --to v1.1.0 --json > upgrade-plan.json
```

The normal human output shows a unified module diff, mode changes and bounded
route/alias/capability changes. In JSON, review `data.plan_id`, `data.changes`,
`data.comparison`, baseline/candidate check summaries and raw evidence. A
missing old URL/output blocks the update unless an observed redirect at its
old output file proves preservation; unknown custom alias identity stays
incomplete. This is not universal theme or browser compatibility. To apply
the freshly revalidated reviewed plan, use its recorded ID:

```sh
oink upgrade --site ./my-docs --to v1.1.0 --write \
  --expect-plan 'COPY_PLAN_ID_FROM_PREVIEW'
```

The CLI changes only the selected `go.mod` and `go.sum` bytes after candidate
validation. It preserves unrelated requirements, replacement directives,
comments, and unrelated uncommitted work. `--write` refuses uncommitted changes
to either selected file, and detects changes after planning. Recovery evidence
identifies backups and any rollback that could not safely restore a
concurrently changed file.

The ID binds current copied source bytes/modes/inventory and actual comparison,
not just module-file text. A later source/workspace/dependency edit requires a
new preview; only selected module files are applied. Unknown resolved pins or
changed/unknown renderer/environment cannot pass. Comparison supports a single
HTTP(S) base origin/path; multihost inputs stay incomplete. Emitted byte hashes
also bind the ID, so nondeterministic templates can require a refreshed preview.
No configuration migration is performed automatically; review unsupported
changes manually.

An OINK `go.mod replace` is a blocking condition for this public-pin workflow.
A site containing `_vendor` is also refused: this release does not refresh
vendor content. Prepare a separate reviewed copy, update the intended pin and
run `hugo mod vendor` explicitly, then review and validate the entire vendor
change. A `go.mod` bump alone is never reported as a vendor upgrade.

## Preview and build through Hugo {#hugo}

```sh
oink dev --site ./my-docs -- --port 1315 --bind 127.0.0.1
oink build --site ./my-docs -- --minify
```

Arguments after `--` go directly to Hugo. The CLI shows the effective command
and forwards process cancellation. `dev` runs `hugo server`; `build` selects
the production environment by default and adds `--panicOnWarning`. These are
direct Hugo operations by default and may create the site's normal output and
cache files. They do not run the reference checks performed by `oink check`.

## Check and export one build {#checked-artifacts}

Choose a real publication URL in `OINK_PUBLIC_BASE_URL`, prepare the site's
exact dependencies, then use a fresh output directory and separate new manifest:

```sh
OINK_ARTIFACT_DIR=$(mktemp -d)
oink build --check --site ./my-docs --release \
  --base-url "$OINK_PUBLIC_BASE_URL" \
  --destination "$OINK_ARTIFACT_DIR/public" \
  --manifest "$OINK_ARTIFACT_DIR/build-manifest.json" --marker
```

Add `--network` to this operation only if its dependencies or required remote
resources need downloading. An example/local publication address is a release
error; ordinary diagnosis reports a warning. `--release` also checks actual
public theme resolution independently of local Git history or declared pins.

Hugo renders one isolated production output. The CLI checks, seals and exports
that same tree without rebuilding or changing site sources. Required incomplete
coverage returns `2`; blocking findings return `1`. Neither result creates a verified
export. An explicit scoped translation policy needing publication-excluded Hugo
identities returns `2`; run standalone `check`/`translations` for the full
nonpublishable maintenance view, or deliberately select a production policy.
The command does not infer identities from filenames.

The destination must be new or empty and its parent must exist. The manifest
must be a new file outside the public tree. Existing entries are preserved;
failed partial export remains explicitly unverified. Optional `--marker` adds
only the artifact identity at `.well-known/oink-build.json`; without the flag,
no marker is added. The local `oink.artifact/v1` manifest records original
input identity, known Git state, effective settings/theme/tools, required
coverage, Hugo routes and exact file digests/modes. It excludes absolute local
paths and logs and is saved with mode `0600`. Keep it outside the upload.

Managed builds allow only `--minify`, `--gc`, `--ignoreCache` and `--noTimes`
after `--`, with optional boolean `=true`/`=false`. The ordinary `build` example
above still accepts transparent Hugo arguments.

## Verify artifacts and a deployed site {#artifact-verification}

Immediately before uploading, check the exported directory offline:

```sh
oink artifacts verify --artifact "$OINK_ARTIFACT_DIR/public" \
  --manifest "$OINK_ARTIFACT_DIR/build-manifest.json"
```

This compares the exact files, bytes and full modes. Missing, additional or
modified files invalidate the previous identity. Upload this directory without
rebuilding; preserve its hidden `.well-known` marker when enabled.

After a separately authorized deployment, check its public URL explicitly:

```sh
oink verify --site "$OINK_PUBLIC_BASE_URL" \
  --manifest "$OINK_ARTIFACT_DIR/build-manifest.json" --network
```

Verification reads every declared file and distinct actual Hugo route, including
language/subpath URLs, and compares bounded decoded response digests plus recorded HTML
canonical/language identities and the enabled marker. HTTP cannot inspect local
file modes. Wrong content, a soft-404 or a different captured identity returns
`1`. Timeouts, authentication/rate-limit failures, server unavailability and a
missing required marker return `2`; redirects outside the selected origin/path
are blocked. No credentials are discovered or sent. A build's `--network`
permission does not authorize this later request or any upload.

## Retired CI generation {#ci-generation}

`ci init` is removed. Keep CI configuration in the site or Starter.
Local CLI validation does not execute hosted CI or deploy a site. Previously
saved CI plans are rejected by `plans apply`.

## Check explicitly registered sites {#workspace-registry}

> [!NOTE] R6 supported local scope accepted
> Workspace and adapter examples passed owning/runtime, actual protocol,
> four-consumer parity/preservation and canonical source/render gates. A07/A15
> supported scope is accepted locally in the
> [R6 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r6).
> They do not describe a published CLI release or a completed platform refresh.

Create a separate registry such as `oink.workspace.yaml` beside your selected
projects. Its only site fields are `name` and `directory`; keep Hugo settings
in each site and checking policy in that site's `oink.yaml`.

```yaml
schema_version: oink.workspace/v1
sites:
  - name: docs
    directory: ../docs-site
  - name: blog
    directory: ../blog-site
```

```sh
oink workspace list --workspace ./oink.workspace.yaml
oink workspace check --workspace ./oink.workspace.yaml --offline --json
oink workspace check links --workspace ./oink.workspace.yaml \
  --sites docs,blog --offline --json
oink check style --workspace ./oink.workspace.yaml --site docs --offline --json
```

| Command | Selection |
| --- | --- |
| `workspace list --workspace FILE` | List explicit entries without running Hugo |
| `workspace check [GROUP] --workspace FILE [--sites NAME,NAME]` | Check all or an exact subset, in registry order |
| `check ... --workspace FILE --site NAME` | Run the normal single-site check for one registered name |
| `plans apply FILE --workspace FILE --site NAME` | Revalidate and apply only a plan bound to that named canonical site |

Names are case sensitive ASCII identifiers matching
`[A-Za-z][A-Za-z0-9_-]{0,63}`. A regular nonsymlink registry has one strict YAML
document, 1–64 nonoverlapping sites and a 256 KiB limit. Directories are literal
relative paths from its actual parent, or absolute paths; no environment/glob
expansion or sibling discovery occurs. Canonical aliases identify the same site
and cannot register it twice. Missing directories remain listed; their check
returns `2`, while the remaining explicit sites are still checked. The aggregate
returns `2` before `1` before `0`, preserving full per-site findings and coverage.
Omitting `--sites` means all registered sites; an explicit list rejects blanks,
duplicates and unknown names and keeps registry order.

A direct command needs `--site NAME`; there is no default registry site. `init`,
`artifacts` and `verify` do not accept registry selection. Save a
reviewed plan outside its site, then explicitly apply it to the same name:

```sh
oink translations review en:/docs/manual zh:/docs/manual \
  --workspace ./oink.workspace.yaml --site docs \
  --reviewed-by 'Maintainer' --reason 'Reviewed terminology and examples' \
  --reviewed-at 2026-10-03T00:00:00Z --plan ./review.plan.json --offline
oink plans apply ./review.plan.json \
  --workspace ./oink.workspace.yaml --site docs --offline
```

Use actual page identities returned by your site's checks for the review
selectors. Selecting `blog` for a plan bound to `docs` returns `2` before a
source write. Preview, validation, freshness and byte/mode safeguards are the
same as direct single-site use; no other registered or neighboring site is
updated automatically.

## Configure already provisioned optional tools {#optional-checkers}

The CLI does not install markdownlint, Vale or lychee. After provisioning tools
separately, add explicit entries to the selected site's `oink.yaml`. The current
protocols are markdownlint-cli `0.49.1`, Vale `3.24.0` and lychee `0.24.2`;
other reported versions remain unsupported until qualified.

```yaml
schema_version: oink.policy/v1
tools:
  markdownlint:
    required: false
    config: .markdownlint.yaml
    timeout_seconds: 60
  vale:
    required: false
    config: .vale.ini
    timeout_seconds: 60
  lychee:
    required: false
    config: lychee.toml
    timeout_seconds: 60
```

`enabled` defaults to `true`, `required` to `false`, and `command` to the kind's
name. You can select one provisioned executable by name or absolute path;
commands are not shell snippets. Configuration paths must be clean relative
paths inside the captured site. Process time defaults to 60 seconds, with
bounded nondefault values 1–300. Unavailable optional tools show omissions;
required unavailability or unsupported protocol returns `2`. A problem baseline
or lower rule severity cannot turn required incompletion into success.

Markdownlint and Vale belong to `style`; lychee belongs to `links`. Select the
group whose tools you intend to run:

```sh
oink check style --workspace ./oink.workspace.yaml --site docs --offline --json
oink check links --workspace ./oink.workspace.yaml --site docs --network --json
```

The second command explicitly permits actual external HTTP requests. Without
`--network`, lychee is not invoked: optional coverage is `not_checked`, required
coverage returns `2`. A successful native local-links check does not attest
external availability. HTTP `401`, `403`, `408`, `425`, `429`, `5xx`, DNS/TLS
failures and timeouts are inconclusive, not definite broken links. Other failed
`4xx` responses are typed findings. External locations remain actual output
files and DOM pointers; the CLI does not guess their Markdown line.

For markdownlint, use declarative JSON, YAML or TOML, for example:

```yaml
default: true
MD013: false
```

JS/JSONC configs, custom rules and `extends` are unsupported. The CLI stages
a private rule object behind an unpredictable JSON pointer so upstream rc data
does not change its effective rules. Vale requires an explicit INI and captured
styles. A supported minimal configuration is:

```ini
StylesPath = styles
MinAlertLevel = warning

[*.md]
BasedOnStyles = Project
```

Provide declarative rule files under `styles/Project/`. Supported rule kinds are
`existence`, `substitution`, `repetition`, `occurrence`, `consistency`,
`capitalization` and `sequence`. Actions, scripts, packages, sync, conversion
assets and style pipelines require manual review and are not executed by this
adapter. Lychee accepts these bounded request settings:

```toml
timeout = 10
max_retries = 0
max_concurrency = 8
```

Allowed ranges are 1–300 seconds, 0–3 retries and 1–32 concurrent requests.
The literal `cache = false` is also accepted; `cache = true` is refused. Cache
and preprocessors are disabled; arbitrary extra tool arguments are not
accepted. No adapter fixes or formats source files. Code prose is outside
source attribution; Markdown structure and fence/inline code boundaries remain
available to markdownlint, while Vale receives the prose-only mask. Private
masks preserve proven UTF-8/BOM/CRLF boundaries around front matter, shortcodes,
raw HTML, configured math and attributes; findings from excluded/synthetic text
remain omissions. Only already captured site-owned Markdown is read for prose
tools.

Inspect `data.adapters`, `adapter.KIND` coverage and raw `evidence` before
interpreting an exit. Each adapter retains version/executable/configuration
hashes and protocol provenance. Caller proxy URLs/credentials and Node preload
settings are not forwarded; literal `NO_PROXY`/`no_proxy` host-list data may be
retained for the qualified runtime. This does not disable every operating-system
proxy route or create a network sandbox. Network checks do not verify external
fragments, browser behavior or remote content identity.

## Retired local Studio {#studio}

`studio` is removed from the CLI. Use an ordinary editor and `oink dev` for
a site preview. Read maintenance facts through `inspect` and structured reports.
The dated R7 acceptance remains historical evidence for its identified inputs.

### Retired Studio views {#studio-views}

Read page and quality facts with `inspect`, `check`, and structured reports.

### Retired browser targets {#studio-tests}

The CLI Studio browser test targets are removed with the implementation.
Current CLI checks remain Go and actual Hugo tests.

## Retired general editing {#editing}

`edit` and Studio editing are removed. Edit source with an ordinary editor,
then run `check`. `new`, `move`, review records, and baseline plans retain
candidate validation and byte/mode guards. Previously saved editing plans
are rejected. The dated R8 record remains historical evidence.

### Retired edit commands {#editing-cli}

The `edit text|field|snippet|attachment` command family is removed.
Run `new --help` or `move --help` for the retained bounded file workflows.

### Retired Studio editing {#editing-studio}

The CLI does not serve an editor or accept browser Apply requests.

### Retained plan review {#editing-review}

Retained previews display the complete proposed diff. Save a new plan, then
explicitly run `plans apply FILE --site DIR`. Candidate validation, source and
external input guards, and concurrent-edit recovery remain required.

## Network and offline operation {#offline}

Network access is disabled by default; `--offline` makes that choice explicit.
Missing dependencies produce an incomplete result. The CLI does not install
Hugo, download a Go toolchain, change global configuration, or enable telemetry.
Allow the current operation to use the network only when intended:

```sh
oink check --site ./my-docs --network
```

`--network` and `--offline` cannot be combined. Diagnostic and validation
operations use disposable caches; a download there does not establish a
persistent cache for the next offline run. For repeatable offline work,
provision the exact module versions in a normal Go module cache and set
`GOMODCACHE` explicitly as shown above. Include all transitive dependencies
needed by your site. Isolated validation reuses provisioned module download
artifacts, not Hugo's global remote-resource (`GetRemote`) cache. A prewarmed
remote-resource cache alone does not make this check work offline. Materialize
required remote content as local site resources, or explicitly use
`--network` for that build. Theme assets that already ship as local files do
not require such a download.

## Text, JSON, YAML, and automation {#json}

```sh
oink check --site ./my-docs
oink check --site ./my-docs --verbose
oink check --site ./my-docs -J > check.json 2> check.log
oink check --site ./my-docs -Y > check.yaml 2> check.log
oink translations review --help
```

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

| Exit code | Meaning |
| --- | --- |
| `0` | Requested work completed without blocking findings |
| `1` | Completed checks found a policy problem |
| `2` | Required work could not complete, including tool, build, or I/O failure |

Always inspect coverage alongside the exit code. An exit code of zero from
`doctor` does not prove a build, and a successful static check does not prove
browser behavior or a public deployment. These commands do not commit, push,
publish a theme, or deploy a site.
