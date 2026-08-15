---
downstream_modified: true
title: Repository links and page information
linkTitle: Repo links and page info
description: Help readers inspect, edit, and report issues against page source.
weight: 50
cSpell:ignore: lastmod
---

OINK's documentation and blog layouts can show links to the current page's
source repository. They live in the
[page actions menu](/docs/configure/navigation/#page-actions) at the end of the
breadcrumb row:

- **View markdown** opens the generated Markdown alternate when that output is
  enabled.
- **View edit history** opens the source file's commit history.
- **Edit this page** opens an editable source view.
- **Create child page** starts a new file below the current page and can use the
  site's `assets/stubs/new-page-template.md` template.
- **Create documentation issue** opens an issue against the documentation
  repository with page context.
- **Create project issue** optionally targets a separate product repository.

The built-in URL patterns target GitHub-style repositories. Verify every action
when using another compatible host, and override the relevant partial for a
different URL scheme.

## Link configuration

A typical site configuration is:

```yaml
params:
  github_repo: https://github.com/OWNER/DOCS
  github_project_repo: https://github.com/OWNER/PRODUCT
  github_branch: main
  github_subdir: site
```

The values can be set globally, per language, in a section cascade, or in page
front matter when content comes from more than one repository.

### `github_repo`

The documentation source repository URL. It drives edit, history, child-page,
and documentation-issue links:

```yaml
params:
  github_repo: https://github.com/pgsty/oink
```

Omit it to suppress repository-derived page actions. Do not point it at the
theme repository when the page source actually lives in a consuming site.

### `github_subdir` (optional)

Set the path from the repository root to the Hugo site source. This project
stores its site in `oink.pgsty.com`:

```yaml
params:
  github_subdir: oink.pgsty.com
```

The value is a repository path, not a local absolute path and not the content
directory itself unless that is the actual site root.

### `github_project_repo` (optional)

Set a separate product repository to show **Create project issue**:

```yaml
params:
  github_project_repo: https://github.com/OWNER/PRODUCT
```

Use the documentation repository for content defects and the product repository
for behavior discussed by the page. If that distinction is not clear to readers,
omit the second link.

### `github_branch` (optional)

Set the branch used by source and edit URLs:

```yaml
params:
  github_branch: main
```

This is normally the site's source branch. It is not necessarily the deployed
branch, generated Pages branch, or theme revision.

### `path_base_for_github_subdir` (optional) {#path_base_for_github_subdir-optional}

Use a section cascade when a subtree is mounted from another repository. The
path base is removed before the remaining content path is appended to
`github_subdir`:

```yaml
---
title: Imported reference
cascade:
  github_repo: https://github.com/OWNER/UPSTREAM
  github_project_repo: https://github.com/OWNER/UPSTREAM
  github_subdir: docs
  path_base_for_github_subdir: content/reference
---
```

For a source page at `content/reference/api/client.md`, this configuration maps
the repository path to `docs/api/client.md`.

`path_base_for_github_subdir` can be a regular expression. A language-directory
site might use:

```yaml
path_base_for_github_subdir: content/\w+/reference
```

OINK's colocated `.md` / `.zh.md` layout normally uses the same static base for
both languages and does not need the language component in this expression.

When the source file has another name, use a `from` and `to` mapping. This
example maps a section `_index.md` to an upstream `README.md`:

```yaml
path_base_for_github_subdir:
  from: content/reference/(.*?)/_index.md
  to: $1/README.md
```

Test view and edit links from a leaf page, a section page, and both language
versions. A regular expression that removes too much can produce a plausible but
incorrect repository URL.

### `github_url` (optional)

> [!WARNING]
>
> `github_url` is deprecated. Use
> [`path_base_for_github_subdir`](#path_base_for_github_subdir-optional) and the
> repository parameters for new content.

A legacy page can set a complete custom edit URL in front matter:

```yaml
---
title: Imported page
github_url: https://github.com/OWNER/UPSTREAM/edit/main/README.md
---
```

Pages using this value expose **Edit this page** but not **View edit history**:
the opaque URL has no repository path from which OINK can derive a history
destination. A site-specific template override is preferable when the
destination is not GitHub-compatible.

### Disabling links

Every entry in the menu carries a stable action ID in `data-oink-action`:

| Link                       | Action ID              |
| -------------------------- | ---------------------- |
| View generated source      | `view_markdown`        |
| View edit history          | `view_history`         |
| Edit this page             | `edit_page`            |
| Create child page          | `create_child_page`    |
| Create documentation issue | `create_issue`         |
| Create project issue       | `create_project_issue` |

Hide an action in `assets/scss/_styles_project.scss` when the destination does
not support it:

```scss
.td-page-actions__item[data-oink-action='create_child_page'] {
  display: none;
}
```

The same IDs name the actions in the Command Palette, so hiding the menu entry
alone leaves the command reachable there.

Prefer omitting an unavailable global destination in configuration. CSS hiding
is useful for selective policy; it does not make a malformed link correct.

## Page annotation and last-modified metadata {#last-modified-page-metadata}

Enable Hugo Git information and configure the source repository:

```yaml
enableGitInfo: true
params:
  github_repo: https://github.com/OWNER/DOCS
```

OINK can then show the last commit date, subject, hash, and source link on
documentation and blog pages. CI must fetch enough Git history for the current
file; shallow checkouts can produce missing or misleading metadata.

This note is the default **Annotation** component. It appears after Feedback and
before Previous/Next navigation. Annotation is on by default; set
`annotation: false` in page front matter or a cascade to hide it.

Consumers may override the stable slot at
`layouts/_partials/page-annotation.html`. The default slot delegates to
`page-meta-lastmod.html`, so an existing override of that older partial keeps
working. A site-specific annotation can read any front matter schema, for
example:

```yaml
upstream:
  project: minio/docs
  url: https://github.com/minio/docs
  license: CC BY 4.0
modified_by: Silo project
translated_from:
  language: English
  revision: 9d02de5
```

```go-html-template {filename="layouts/_partials/page-annotation.html"}
{{ partial "page-meta-lastmod.html" . }}
{{ with .Params.upstream }}
  <p>Portions adapted from <a href="{{ .url }}">{{ .project }}</a>,
    under {{ .license }}.</p>
{{ end }}
{{ with .Params.translated_from }}
  <p>Translated from {{ .language }}, revision {{ .revision }}.</p>
{{ end }}
```

OINK intentionally does not prescribe the extension fields: the stable partial
and page-end position are the contract. Do not label a file “last modified” from
the build timestamp when Git history is unavailable.
