---
title: FileTree
description:
  Present repository and directory structures as semantic, progressively
  disclosed lists.
weight: 40
icon: fa-solid fa-folder-tree
---

Use FileTree to explain the part of a repository or directory layout that
matters to the reader. Folders use native disclosure controls in interactive
HTML; every output retains the complete nested structure.

## When to use {#when-to-use}

FileTree works best for curated structures in setup guides, architecture
overviews, and contribution instructions. Use a code block for literal command
output that should be copied verbatim. Describe generated or highly dynamic
trees in prose instead of committing a large snapshot that will quickly drift.

## Quick start {#quick-start}

### Source {#source}

```go-html-template
{{</* filetree label="Repository structure" */>}}
  {{</* filetree/folder name="content" open=true */>}}
    {{</* filetree/file name="_index.md" */>}}
    {{</* filetree/folder name="docs" open=true */>}}
      {{</* filetree/file name="getting-started.md" */>}}
    {{</* /filetree/folder */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/file name="hugo.yml" link="/docs/getting-started/" */>}}
{{</* /filetree */>}}
```

### Rendered result {#rendered-result}

<!-- prettier-ignore-start -->

{{< filetree label="Repository structure" >}}
  {{< filetree/folder name="content" open=true >}}
    {{< filetree/file name="_index.md" >}}
    {{< filetree/folder name="docs" open=true >}}
      {{< filetree/folder name="operations-and-troubleshooting" open=true >}}
        {{< filetree/file name="a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md" link="/docs/" >}}
      {{< /filetree/folder >}}
      {{< filetree/file name="configuration.md" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="blog" >}}
      {{< filetree/file name="release.md" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="hugo.yml" link="https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml" >}}
{{< /filetree >}}

<!-- prettier-ignore-end -->

The `blog` folder starts closed. Activate its summary with a pointer, Enter, or
Space to reveal the child file; this behavior comes from the native `details`
element rather than a custom script.

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

## Folder and file parameters {#folder-and-file-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree/folder parameters" >}}
  {{< field name="name" type="string" required=true >}}
  A nonempty visible directory name.
  {{< /field >}}
  {{< field name="open" type="boolean" default=false >}}
  Controls the initial interactive HTML state.
  {{< /field >}}
{{< /fields >}}

{{< fields label="filetree/file parameters" >}}
  {{< field name="name" type="string" required=true >}}
  A nonempty visible file name.
  {{< /field >}}
  {{< field name="link" type="URL" >}}
  A validated internal, relative, HTTP(S), or `mailto:` destination.
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

A folder can contain folders and files recursively. A file cannot contain
children. Unknown parameters, text between children, or a child outside an
allowed parent stops the build with its source position.

## Semantics and fallback {#semantics-and-fallback}

The structure is a nested `ul`. Interactive folders add native `details` and
`summary`; Oink deliberately does not declare `role="tree"`, because that ARIA
widget would require a complete arrow-key navigation model. Print and RSS expand
all folders. Markdown becomes a nested list with linked file names where
applicable. No JavaScript is loaded.

## Deliberate limits {#deliberate-limits}

FileTree is author-controlled and never reads a local directory during a Hugo
build. This keeps builds safe and reproducible. Version one also has no public
badge or icon parameters for entries; the built-in folder and file glyphs are
presentational theme details, not content APIs.
