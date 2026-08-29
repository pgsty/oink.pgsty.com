---
title: Repository links and page info
linkTitle: Repository links
description: Wire "edit this page", "open an issue" and "view history" to your repository, and show the last-modified line, contributors and the feedback widget at the page end.
weight: 120
search_keywords:
  [
    repository links,
    edit this page,
    open an issue,
    last modified,
    contributors,
    feedback,
    github_repo,
    github_subdir,
    github_url,
    lastmod,
    enableGitInfo,
  ]
# so this page really renders the feedback widget (the docs cascade defaults it to false)
feedback: true
aliases:
  - /docs/configure/repository/
---

The repository-related entries in the **action menu** at the right of the
breadcrumb row are derived from a few `github_*` parameters, and the "last
modified" line at the page end comes from git history. Both assume the content
lives in a GitHub-style repository.

## Four keys wire up every link {#link-configuration}

Every repository-related entry in the action menu derives from these keys:

```yaml {title="hugo.yml"}
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com # the documentation source repository
  github_project_repo: https://github.com/pgsty/oink # the product repository (optional)
  github_branch: main # defaults to main
  github_subdir: '' # path from the repository root to the Hugo site root
```

That is this site's real configuration. With it filled in, this page's action
menu points at:

| Menu entry | Target |
| --- | --- |
| Edit this page | `…/edit/main/content/docs/customize/repository.md` |
| View history | `…/commits/main/content/docs/customize/repository.md` |
| Create child page | `…/new/main/content/docs/customize?filename=change-me.md&value=<template>` |
| Open a documentation issue | `…/issues/new?title=Repository links and page info` |
| Open a project issue | `https://github.com/pgsty/oink/issues/new` |

A few conventions:

- `github_repo` points at the repository holding the content, not the theme repository. Naming the theme repository sends a reader's change to the wrong place. Omit it and all five rows above disappear.
- `github_project_repo` is a second repository, receiving product bugs rather than documentation errors. Do not configure it where readers cannot tell the two apart.
- `github_branch` defaults to `main` and names the content branch — not the deployment branch, and not the branch Pages generates.
- `github_subdir` is the path inside the repository. Leave it empty when the site source is at the repository root; set it to `website` when the source sits in a subdirectory (a repository holding both code and `website/`, say).

All of these can be set at site level, per language, in a section cascade or in
a page's front matter, which matters when content comes from several
repositories. The full definitions are in
[Configuration](/docs/customize/config/).

## Content from another repository {#imported-content}

When a subtree is mounted from an upstream repository, override the repository
parameters with a section cascade, then use `path_base_for_github_subdir` to
tell the theme: strip the local path prefix, and append what remains to
`github_subdir`.

```yaml {title="content/reference/_index.md"}
---
title: Upstream reference
cascade:
  github_repo: https://github.com/OWNER/UPSTREAM
  github_project_repo: https://github.com/OWNER/UPSTREAM
  github_subdir: docs
  path_base_for_github_subdir: content/reference
---
```

`content/reference/api/client.md` therefore maps to the upstream's
`docs/api/client.md`.

The value of `path_base_for_github_subdir` is a regular expression. Where the
source filename differs from the local one, use a `from` / `to` mapping instead
— for example, matching each section's `_index.md` to the upstream `README.md`:

```yaml {title="content/reference/_index.md"}
path_base_for_github_subdir:
  from: content/reference/(.*?)/_index.md
  to: $1/README.md
```

OINK keeps `.md` and `.zh.md` side by side in one directory, so both languages
share a path prefix and the expression needs no language directory. After
changing it, click "edit this page" once from a leaf page, once from a section
index and once in each language: when the expression strips too much, the
generated URL looks plausible and is a 404.

## Turning individual entries off {#disable-actions}

Every menu entry carries a stable action ID:

| Menu entry | Action ID |
| --- | --- |
| Copy as Markdown | `copy_markdown` |
| View Markdown source | `view_markdown` |
| Open in ChatGPT / Claude | `open_chatgpt` / `open_claude` |
| View history | `view_history` |
| Edit this page | `edit_page` |
| Create child page | `create_child_page` |
| Open a documentation issue | `create_issue` |
| Open a project issue | `create_project_issue` |
| Print the whole section | `print_section` |

Where a host does not support one, hide it with CSS:

```scss {title="assets/scss/_styles_project.scss"}
.td-page-actions__item[data-oink-action='create_child_page'] {
  display: none;
}
```

The command palette uses the same IDs, so hiding a menu entry does not remove it
from the palette. A target the whole site cannot use should have its key omitted
from the configuration rather than covered with CSS: CSS can hide a link, but it
cannot make a wrong link right.

The whole menu can also be turned off per page with `page_context_menu: false`
in front matter — see [Page parameters](/docs/write/frontmatter/).

The new-page template that "create child page" prefills comes from the theme's
`assets/stubs/new-page-template.md`; a site replaces it with its own skeleton by
placing a file of the same name at `assets/stubs/new-page-template.md`.

## Last modified {#lastmod}

This line's data comes from git, not from a file's mtime. Turn on Hugo's git
support:

```yaml {title="hugo.yml"}
enableGitInfo: true
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com
  ui:
    lastmod_commit: subject # subject | hash | none
```

The page end then reads "Last modified August 17, 2026 · <commit subject>
(a1b2c3d)", with the commit part linking to `…/commit/<hash>`. The three values
of `lastmod_commit`:

| Value | What is shown |
| --- | --- |
| `subject` (default) | The commit subject plus the abbreviated hash |
| `hash` | `commit a1b2c3d` |
| `none` | The date only, with no commit link |

Any other value warns and uses `subject` during ordinary preview; a strict
publishing build fails on `invalid params.ui.lastmod_commit`.

Two things to watch:

- CI needs enough git history. A shallow clone (`fetch-depth: 1`) cannot reach a file's last commit, and the date goes missing or wrong. Set `fetch-depth: 0` in GitHub Actions.
- An uncommitted file has no git time. Previewing a newly written page locally, this line is simply absent.

Where git history is unavailable, do not substitute the build time for "last
modified": build time is not when the content changed.

This line belongs to the **annotation** component, which is on by default and
sits after feedback and before the pager. Turn it off for a page with
`annotation: false`.

The line is not all the annotation block renders. The same block also carries
two kinds of provenance, both driven by page front matter and needing no
template override:

- **Upstream attribution**: a page derived from elsewhere writes `upstream_link` plus the four required keys `upstream_name`, `upstream_copyright`, `upstream_license` and `upstream_notice`, and the page end gains an attribution line naming the work, the copyright holder, the licence and a link to the full notice. Adding `upstream_modified: true` appends a "modified downstream" line.
- **Translation notice**: `params.ui.translation_notice` holds the language code of the authoritative version, and a translated page then shows a line pointing back at the original; a page authored natively in this language opts out with `translation_notice: false`.

Both families are defined in full in
[Page parameters](/docs/write/frontmatter/#upstream).

Where customization really is needed, three override points cover one layer
each:

| Partial to override | What it changes |
| --- | --- |
| `layouts/_partials/annotation-items.html` | Add, remove or reorder the lines, keeping the theme's markup, icons, print rules and accessible label |
| `layouts/_partials/page-meta-lastmod.html` | Replace the markup those lines render as |
| `layouts/_partials/page-annotation.html` | Replace the block's outer container |

## What the page end is made of {#page-end}

The five components are in a fixed order, and every reading layout shares one
implementation:

| Order | Component | Theme default | Page switch |
| --- | --- | --- | --- |
| 1 | Share | Off (`params.ui.share` is empty) | `share: false`, or the page's own list |
| 2 | Feedback | Off | `feedback: true` / `false` |
| 3 | Annotation | On | `annotation: false` |
| 4 | Pager | On for docs / book / blog | `pager: false` |
| 5 | Comments | On when fully configured | `comments: false` |

The order follows what a reader does after the last paragraph: hand the page
on, say whether it helped, see where it came from, go to the next one, join the
discussion. Share leads because it is the only block that points outward, and
because a reader who has decided to pass a page on decided it before being
asked how the page went. Configuring the bar is in
[Writing a blog](/docs/write/blog/#share).

Configuring comments is in [Comments](/docs/admin/comments/).

## The feedback widget {#feedback}

One question and two buttons: "Did this page solve your problem?" → yes / no.
Choosing no expands four optional reasons. It is off by default:

```yaml {title="hugo.yml"}
params:
  ui:
    feedback:
      enable: true
      reasons: true # whether to ask for a reason after "no"
```

To enable it for the documentation section only, use a cascade (a blog usually
keeps just comments):

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  feedback: true
---
```

Where the boundaries are:

- A click completes it. There is no text box, no submit button and no sign-in.
- The choice is written to the browser's `localStorage` per page and language, so a returning reader sees and can change it.
- Where the site already has Google Analytics (`gtag`), it sends a `docs_feedback` event with `result` (`solved` / `not_solved`), `page_path` and `language`; choosing a reason sends a second event carrying `reason` and `refinement: true`, distinguishing it from the first count. **Without analytics the widget still works**, simply reporting nothing — it needs no backend at all.
- Where the page has comments enabled, an anchor link reading "add details in the comments" appears under the result. Feedback and giscus are two independent data flows, and the theme never writes a comment on the reader's behalf.

This page sets `feedback: true` in its front matter (the docs section defaults
it off), so the real widget is visible at the page end.

## The contributor wall {#contributors}

The `contributors` shortcode renders a wall of GitHub avatars from a file under
the site's `data/` directory, and **never contacts GitHub at build time**:

```yaml {title="data/contributors.yaml"}
items:
  - github: Vonng
    name: Ruohang Feng
    role: Theme author
  - github: pgsty
    name: Pigsty
    role: Project organization
  - github: gohugoio
    role: Static site generator
    avatar: /icons/logo.svg
```

```markdown {title="Source"}
{{</* contributors */>}}
```

The fields: `github` is required and validated as a GitHub username; a
duplicate warns and skips the repeated entry, and strict publishing rejects
the warning. `name` defaults to `github`; `role` is optional;
`url` defaults to `https://github.com/<github>`; `avatar` is optional, and
without it an initial placeholder block is rendered with no network request at
all, while a value must be `http(s)://` or a site-root-relative path.

Several lists mean several data files, selected with `data=`:

```markdown {title="Source"}
{{</* contributors data="maintainers" */>}}
```

In Markdown and RSS output the wall degrades to a list of
`- [@handle](url) — role`.

> [!NOTE] This site has no `data/contributors.yaml`
> The example above therefore does not render on this page. Drop a data file
> into `data/` to see it.

## Verify {#verify}

- Open the action menu at the right of this page's breadcrumb row: "edit this page" should point at `github.com/<your repository>/edit/<branch>/<source path>`, with the path matching the repository segment for segment.
- Click it again from a section index (`_index.md`): a section index is the likeliest thing for a `path_base_for_github_subdir` expression to get wrong.
- The page end should have a "last modified" line; its absence on a locally created, not-yet-committed page is expected.
- Check the generated links from the command line:

```bash
hugo -d public
grep -o 'data-oink-action="edit_page" href="[^"]*"' \
  public/docs/customize/repository/index.html
```

## Related {#related}

- [Page parameters](/docs/write/frontmatter/) — `annotation` / `feedback` / `pager` / `page_context_menu` and the other page switches
- [Configuration](/docs/customize/config/) — full definitions of `github_*`, `ui.lastmod_commit` and `ui.feedback`
- [Comments](/docs/admin/comments/) — the last block at the page end
- [Analytics and SEO](/docs/admin/analytics/) — where feedback events land
- [AI-agent support](/docs/customize/agents/) — the Markdown and assistant entries in the action menu
