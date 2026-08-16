---
title: FileTree
description:
  Present annotated repository and directory structures with semantic,
  progressively disclosed lists.
weight: 50
---

Use FileTree to explain the part of a repository or directory layout that
matters to the reader. File and folder names use the code-font token, folders
show distinct open and closed states, and optional comments or filesystem
metadata add context without turning the tree into a wide table.

## When to use {#when-to-use}

FileTree works best for curated structures in setup guides, architecture
overviews, deployment runbooks, and contribution instructions. Use a code block
for literal command output that should be copied verbatim. Describe generated or
highly dynamic trees in prose instead of committing a large snapshot that will
quickly drift.

## Quick start {#quick-start}

This repository example combines stateful folders, linked files, custom icons,
semantic colors, `#` comments, and the compact mode/owner:group region.

### Source {#source}

```go-html-template
{{</* filetree label="Repository structure" */>}}
  {{</* filetree/folder name="content" open=true comment="Page bundles and templates" owner="docs" group="writers" mode="0755" */>}}
    {{</* filetree/file name="_index.md" icon="fa-solid fa-file-code" color="primary" comment="Section landing page" owner="docs" group="writers" mode="0644" */>}}
    {{</* filetree/folder name="docs" open=true comment="Product guides" */>}}
      {{</* filetree/folder name="operations-and-troubleshooting" open=true icon="fa-solid fa-screwdriver-wrench" color="warning" comment="Runbooks and recovery" */>}}
        {{</* filetree/file name="a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md" link="/docs/" color="danger" comment="Emergency procedure" owner="sre" group="on-call" mode="0640" */>}}
      {{</* /filetree/folder */>}}
      {{</* filetree/file name="configuration.md" link="/docs/configure/" icon="fa-solid fa-gears" color="info" comment="Runtime settings" */>}}
    {{</* /filetree/folder */>}}
    {{</* filetree/folder name="blog" comment="Release notes and stories" */>}}
      {{</* filetree/file name="release.md" icon="fa-regular fa-newspaper" color="secondary" comment="Release announcement" */>}}
    {{</* /filetree/folder */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/file name="hugo.yml" link="https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml" icon="fa-solid fa-gears" color="warning" comment="Site configuration" owner="root" group="wheel" mode="0640" */>}}
{{</* /filetree */>}}
```

### Rendered result {#rendered-result}

<!-- prettier-ignore-start -->

- content/ — 0755 docs:writers · Page bundles and templates
  - _index.md — 0644 docs:writers · Section landing page
  - docs/ — Product guides
    - operations-and-troubleshooting/ — Runbooks and recovery
      - [a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md](/docs/) — 0640 sre:on-call · Emergency procedure
    - [configuration.md](/docs/configure/) — Runtime settings
  - blog/ — Release notes and stories
    - release.md — Release announcement
- [hugo.yml](https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml) — 0640 root:wheel · Site configuration
{.filetree}

<!-- prettier-ignore-end -->

The `blog` folder starts closed and uses the default closed-folder icon.
Activate its row with a pointer, Enter, or Space to reveal the child and switch
to the open-folder icon. The authored wrench icon on
`operations-and-troubleshooting` deliberately stays the same in both states.

## Rich examples {#rich-examples}

### Ownership and permissions {#ownership-and-permissions}

Use `mode`, `owner`, and `group` when the layout itself explains an operational
boundary. The fixed-width mode comes first, followed by `owner` or
`owner:group`. A long identity such as `deploy:release-engineering` truncates
independently instead of pushing the filename out of view.

```go-html-template
{{</* filetree label="Deployment filesystem" */>}}
  {{</* filetree/folder name="/srv/atlas" open=true icon="fa-solid fa-server" color="primary" comment="Application root" owner="root" group="root" mode="0755" */>}}
    {{</* filetree/folder name="releases" open=true color="secondary" comment="Immutable builds" owner="deploy" group="release-engineering" mode="0750" */>}}
      {{</* filetree/folder name="2026.08.16" open=true icon="fa-solid fa-box-archive" color="success" comment="Active release" owner="deploy" group="release-engineering" mode="0750" */>}}
        {{</* filetree/file name="atlas-server" icon="fa-solid fa-terminal" color="success" comment="Executable" owner="deploy" group="atlas" mode="0555" */>}}
        {{</* filetree/file name="app.toml" icon="fa-solid fa-gears" color="info" comment="Runtime configuration" owner="root" group="atlas" mode="0640" */>}}
      {{</* /filetree/folder */>}}
    {{</* /filetree/folder */>}}
    {{</* filetree/folder name="secrets" icon="fa-solid fa-lock" color="danger" comment="Restricted credentials" owner="root" group="security" mode="0700" */>}}
      {{</* filetree/file name="production.env" color="danger" owner="root" group="security" mode="0600" */>}}
    {{</* /filetree/folder */>}}
  {{</* /filetree/folder */>}}
{{</* /filetree */>}}
```

<!-- prettier-ignore-start -->

- /srv/atlas/ — 0755 root:root · Application root
  - releases/ — 0750 deploy:release-engineering · Immutable builds
    - 2026.08.16/ — 0750 deploy:release-engineering · Active release
      - atlas-server — 0555 deploy:atlas · Executable
      - app.toml — 0640 root:atlas · Runtime configuration
  - secrets/ — 0700 root:security · Restricted credentials
    - production.env — 0600 root:security
{.filetree}

<!-- prettier-ignore-end -->

Every metadata field is optional. If only `mode` is supplied, its four-character
slot remains aligned and the identity cell stays empty. `owner` may appear by
itself; `group` requires `owner` and joins it with a colon. Hover a clipped
identity to see its complete text.

### Semantic icons and colors {#semantic-icons-and-colors}

Icons can distinguish file kinds or important domains while `color` maps them to
the theme's semantic palette. Keep the visible name and comment meaningful:
icons and colors are decorative and disappear from Markdown output.

```go-html-template
{{</* filetree label="Data platform workspace" */>}}
  {{</* filetree/folder name="warehouse" open=true icon="fa-solid fa-database" color="primary" comment="Persistent datasets" */>}}
    {{</* filetree/file name="customers.parquet" icon="fa-solid fa-table-columns" color="info" comment="Curated customer dimension" */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/folder name="pipelines" open=true icon="fa-solid fa-diagram-project" color="secondary" comment="Scheduled transformations" */>}}
    {{</* filetree/file name="extract.py" icon="fa-brands fa-python" color="warning" comment="Source ingestion" */>}}
    {{</* filetree/file name="quality.sql" icon="fa-solid fa-database" color="success" comment="Validation checks" */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/folder name="secrets" icon="fa-solid fa-lock" color="danger" comment="Not committed" */>}}
    {{</* filetree/file name=".env" color="danger" comment="Local credentials" */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/file name="Dockerfile" icon="fa-brands fa-docker" color="info" comment="Runtime image" */>}}
  {{</* filetree/file name="README.md" link="/docs/" icon="fa-brands fa-markdown" color="neutral" comment="Operator guide" */>}}
{{</* /filetree */>}}
```

<!-- prettier-ignore-start -->

- warehouse/ — Persistent datasets
  - customers.parquet — Curated customer dimension
- pipelines/ — Scheduled transformations
  - extract.py — Source ingestion
  - quality.sql — Validation checks
- secrets/ — Not committed
  - .env — Local credentials
- Dockerfile — Runtime image
- [README.md](/docs/) — Operator guide
{.filetree}

<!-- prettier-ignore-end -->

The `warehouse`, `pipelines`, and `secrets` folders use authored icons, so those
icons do not change when the folders open. Omit `icon` when the open/closed
folder state is more useful than a domain-specific glyph.

## Root parameters {#root-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree parameters" >}}
  {{< field name="label" type="string" >}}
  A nonempty visible label associated with the root list.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

The root accepts only direct `filetree/folder` and `filetree/file` children. Add
at least one meaningful entry rather than publishing an empty tree.

## Shared entry parameters {#shared-entry-parameters}

Both `filetree/folder` and `filetree/file` accept these optional parameters.

<!-- prettier-ignore-start -->

{{< fields label="Shared folder and file parameters" >}}
  {{< field name="icon" type="Font Awesome classes" >}}
  Exactly one style/name pair such as `fa-solid fa-file-code`, `fa-regular fa-newspaper`, or `fa-brands fa-python`. Use an icon included in Oink's bundled Font Awesome assets.
  {{< /field >}}
  {{< field name="color" type="enum" >}}
  One of `neutral`, `primary`, `secondary`, `info`, `success`, `warning`, or `danger`. The value selects a semantic theme token, not an arbitrary CSS color.
  {{< /field >}}
  {{< field name="mode" type="string" >}}
  Nonempty plain text rendered verbatim in the fixed-width mode column. Quote octal values to preserve the leading zero, for example `mode="0555"`.
  {{< /field >}}
  {{< field name="owner" type="string" >}}
  A nonempty user/owner name. It appears alone or as the first half of `owner:group`.
  {{< /field >}}
  {{< field name="group" type="string" >}}
  A nonempty group name appended to `owner` with a colon. Supplying `group` without `owner` stops the build.
  {{< /field >}}
  {{< field name="comment" type="string" >}}
  Nonempty plain text displayed in the code font with a visible `#` prefix. It uses an ellipsis when horizontal space is tight.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

The `icon` value must exactly match `fa-(solid|regular|brands) fa-[a-z0-9-]+`.
Comments and metadata are plain text, not Markdown. Oink displays `mode` exactly
as authored and never converts octal values to symbolic permissions. Supplying
`mode` or `owner` creates the aligned metadata region.

## Folder parameters {#folder-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree/folder parameters" >}}
  {{< field name="name" type="string" required=true >}}
  A nonempty visible directory name.
  {{< /field >}}
  {{< field name="open" type="boolean" default=false >}}
  Controls the initial interactive HTML state. Pass the boolean without quotes.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

Without `icon`, a folder switches between the standard Font Awesome closed and
open folder glyphs. An authored icon overrides both states. Folder colors
default to the theme's folder color.

## File parameters {#file-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree/file parameters" >}}
  {{< field name="name" type="string" required=true >}}
  A nonempty visible file name.
  {{< /field >}}
  {{< field name="link" type="URL" >}}
  A validated internal, relative, HTTP(S), or `mailto:` destination. When set, the filename becomes a link.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

Files default to `fa-regular fa-file` with the neutral theme color. A file
cannot contain children.

## Presentation and interaction {#presentation-and-interaction}

File and folder names use Oink's code-font token. Hovering a file or folder
highlights its complete row; keyboard focus gives folders the same treatment and
retains a visible focus outline. Native disclosure markers are suppressed, so
the icon—not an extra triangle—communicates the default folder state.

The name and comment share the flexible main region. A preferred filename column
makes the code-font `# comment` values line up where space permits. The name
remains readable and may wrap, while the comment stays on one line and
ellipsizes first.

Filesystem metadata occupies a compact two-column region at the inline end. The
four-character mode comes first; the remaining space belongs to `owner` or
`owner:group`, which ellipsizes independently and exposes its complete value in
a `title` tooltip. The region shrinks proportionally on narrow or deeply nested
rows without causing page-level horizontal overflow.

## Semantics and fallback {#semantics-and-fallback}

The structure is a nested `ul`. Interactive folders add native `details` and
`summary`; Oink deliberately does not declare `role="tree"`, because that ARIA
widget would require a complete arrow-key navigation model. No JavaScript is
loaded.

Print and RSS expand every folder. Markdown becomes a nested list, retains file
links, prefixes comments with `#`, and writes mode before the combined owner
identity:

```markdown
- content/ # Page bundles and templates (mode: `0755`; owner: `docs:writers`)
  - _index.md # Section landing page (mode: `0644`; owner: `docs:writers`)
```

Decorative icons and colors are intentionally omitted from Markdown.

## Deliberate limits {#deliberate-limits}

FileTree is author-controlled and never reads a local directory or calls `stat`
during a Hugo build. The owner, group, and mode strings are annotations; Oink
does not resolve them against a host filesystem or translate one permission
notation into another. Entries do not accept arbitrary CSS classes, styles, or
raw colors. Sorting, badges, automatic metadata, selection, and direction-key
tree navigation remain outside the component.
