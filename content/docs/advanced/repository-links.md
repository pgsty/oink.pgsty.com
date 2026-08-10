---
downstream_modified: true
title: Repository links and page information
linkTitle: Repo links and page info
description: Help readers inspect, edit, and report issues against page source.
weight: 80
icon: fa-solid fa-code
aliases: [/docs/content/repository-links/, /docs/feature/repository-links/]
cSpell:ignore: lastmod
---

OINK's documentation and blog layouts can show links to the current page's
source repository:

- **View page source** opens the source file.
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

The documentation source repository URL. It drives view, edit, child-page, and
documentation-issue links:

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

Pages using this value expose only **Edit this page**. A site-specific template
override is preferable when the destination is not GitHub-compatible.

### Disabling links

Each action has a stable CSS class:

| Link                       | Class                          |
| -------------------------- | ------------------------------ |
| View page source           | `.td-page-meta__view`          |
| Edit this page             | `.td-page-meta__edit`          |
| Create child page          | `.td-page-meta__child`         |
| Create documentation issue | `.td-page-meta__issue`         |
| Create project issue       | `.td-page-meta__project-issue` |

Hide an action in `assets/scss/_styles_project.scss` when the destination does
not support it:

```scss
.td-page-meta__child {
  display: none;
}
```

Prefer omitting an unavailable global destination in configuration. CSS hiding
is useful for selective policy; it does not make a malformed link correct.

## Last-modified page metadata

Enable Hugo Git information and configure the source repository:

```yaml
enableGitInfo: true
params:
  github_repo: https://github.com/OWNER/DOCS
```

OINK can then show the last commit date, subject, hash, and source link on
documentation and blog pages. CI must fetch enough Git history for the current
file; shallow checkouts can produce missing or misleading metadata.

To hide the note for a particular site or section, override its style or the
responsible page-meta partial. Do not label a file “last modified” from the
build timestamp when Git history is unavailable.
