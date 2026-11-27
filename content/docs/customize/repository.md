---
title: Repository links and page info
linkTitle: Repository links
description: Connect "edit this page", "open an issue", and "view history" to your repository. Show last-modified information, contributors, and feedback at the page end.
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

A reader who spots a mistake should be one click away from fixing it, and a
reader who lands on a page should be able to tell how current it is. Point
OINK at the GitHub repository that holds your content, and the page action
menu at the right of the breadcrumb row gains Edit this page, View edit
history and issue links, while the end of each page shows when it last changed
and in which commit.

## Configure links with four keys {#link-configuration}

```yaml {title="hugo.yml"}
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com # the documentation source repository
  github_project_repo: https://github.com/pgsty/oink # the product repository (optional)
  github_branch: main # defaults to main
  github_subdir: '' # path from the repository root to the Hugo site root
```

With these settings, this page's action menu points to:

| Menu entry | Target |
| --- | --- |
| Edit this page | `…/edit/main/content/docs/customize/repository.md` |
| View edit history | `…/commits/main/content/docs/customize/repository.md` |
| Create child page | `…/new/main/content/docs/customize?filename=change-me.md&value=<template>` |
| Create docs issue | `…/issues/new?title=Repository links and page info` |
| Create project issue | `https://github.com/pgsty/oink/issues/new` |

- `github_repo` is the repository that holds your content, not the theme's; pointing it elsewhere sends readers' fixes to the wrong place. Without it, the first four entries above are unavailable.
- `github_project_repo` is optional: a second repository where readers report bugs in the product rather than in the documentation. It alone controls Create project issue, and it is also where the navbar's GitHub button points. Leave it out if your readers would not know which repository to choose.
- `github_branch` (default `main`) is the branch your content is edited on, not a deployment or Pages branch.
- `github_subdir` is the path from the repository root to the Hugo site. Leave it empty when the site is at the root; set it to `website` when the repository holds code with the site in `website/`.

Each key can be set for the site, for one language, in a section cascade, or
in a page's front matter, so one site can draw content from several
repositories. The full definitions are in
[Configuration](/docs/customize/config/).

## Content from another repository {#imported-content}

When a section is copied or mounted from an upstream repository, its edit and
history links should lead to that repository. Override the repository keys in
the section's cascade, and use `path_base_for_github_subdir` to strip or
replace the prefix of each page's source path before it is appended to
`github_subdir`. For files copied into the site, that path is relative to the
site root:

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

`content/reference/api/client.md` then maps to `docs/api/client.md` upstream.

For a directory mounted from outside the site, match its absolute source path,
not the mount target inside Hugo. Paths are compared with `/` separators on
every platform, Windows included, and keep their filename case:

```yaml {title="External source at /srv/upstream/docs/"}
path_base_for_github_subdir: '^/srv/upstream/docs/'
```

With `github_subdir: docs`, `/srv/upstream/docs/api/client.md` maps to
`docs/api/client.md`. The result must be a non-empty path inside the
repository. When an external file matches no mapping, or the result is
absolute, starts with a drive letter, is `.` or climbs out with `..`, the page
gets no Edit, View edit history or Create child page entry; its issue links
still follow their own repository settings.

`path_base_for_github_subdir` is a regular expression. When upstream files have
different names from the local ones, give a `from` / `to` pair instead; this
maps each section's `_index.md` to the upstream `README.md`:

```yaml {title="content/reference/_index.md"}
path_base_for_github_subdir:
  from: content/reference/(.*?)/_index.md
  to: $1/README.md
```

OINK keeps `.md` and `.zh.md` side by side in one directory, so both languages
share a path prefix and the expression needs no language directory. After
changing it, click Edit this page on a leaf page and on a section index, in
every language: an expression that strips too much produces URLs that look
right and return 404.

## Turning individual entries off {#disable-actions}

Every entry in the menu has a stable action ID, listed in
[the page action menu](/docs/customize/navigation/#page-actions). When your
Git host does not support an action, hide its entry with CSS:

```css {title="assets/css/project.css"}
.td-page-actions__item[data-td-action='create_child_page'] {
  display: none;
}
```

The command palette uses the same IDs and still offers an entry hidden this
way. CSS can hide a link but cannot correct its target, so when a target is
wrong for the whole site, remove the configuration key it comes from instead.
To drop the whole menu from one page, set `page_context_menu: false` in its
front matter; see [Page parameters](/docs/write/frontmatter/).

Create child page opens a new file prefilled from the theme's
`assets/stubs/new-page-template.md`. Put your own file at the same path in your
site, `assets/stubs/new-page-template.md`, to prefill your own skeleton.

## Last modified {#lastmod}

The last-modified line comes from Git history, not file modification times,
which a checkout resets. Turn on Hugo's Git support:

```yaml {title="hugo.yml"}
enableGitInfo: true
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com
  ui:
    lastmod_commit: subject # subject | hash | none
```

The end of the page then reads "Last modified August 17, 2026 · <commit
subject> (a1b2c3d)", and the commit part links to `…/commit/<hash>`.
`lastmod_commit` chooses that commit part:

| Value | What is shown |
| --- | --- |
| `subject` (default) | The commit subject plus the abbreviated hash |
| `hash` | `commit a1b2c3d` |
| `none` | The date only, with no commit link |

Any other value warns (`invalid params.ui.lastmod_commit`) and uses `subject`.

In CI, set `fetch-depth: 0` on the checkout step: a shallow clone, the default
in GitHub Actions, contains only the latest commit, so every page shows that
commit's date or none at all. [Deploy](/docs/admin/deploy/#hosts) has the
complete workflows. A file you have not committed yet has no Git date, so a new
page previewed locally shows no last-modified line. If your build has no Git
history at all, leave the line off rather than substituting the build time,
which says nothing about when the content changed.

The line belongs to the page's **annotation** block, which is on by default;
`annotation: false` turns the block off for one page. The same block also shows
where a page came from, driven by its front matter with no template override:

- **Upstream attribution**: on a page derived from someone else's work, set `upstream_link` with the four required keys `upstream_name`, `upstream_copyright`, `upstream_license` and `upstream_notice`. The page end then names the work, its copyright holder and license, and links to the full notice. Add `upstream_modified: true` to say the page was changed downstream.
- **Translation notice**: set `params.ui.translation_notice` to the language code of the authoritative version, and translated pages link back to the original. A page written natively in its own language opts out with `translation_notice: false`.

Both families are defined in full in
[Page parameters](/docs/write/frontmatter/#upstream). To change the block
itself, override the narrowest of three partials:

| Partial to override | What it changes |
| --- | --- |
| `layouts/_partials/annotation-items.html` | Add, remove or reorder the lines, keeping the theme's markup, icons, print rules and accessible label |
| `layouts/_partials/page-meta-lastmod.html` | Replace the markup those lines render as |
| `layouts/_partials/page-annotation.html` | Replace the block's outer container |

## What the page end is made of {#page-end}

Every reading layout ends a page with the same five blocks, always in this
order:

| Order | Component | Theme default | Page switch |
| --- | --- | --- | --- |
| 1 | Share | Off (`params.ui.share` is empty) | `share: false`, or the page's own list |
| 2 | Feedback | Off | `feedback: true` / `false` |
| 3 | Annotation | On | `annotation: false` |
| 4 | Pager | On for docs / book / blog | `pager: false` |
| 5 | Comments | On when fully configured | `comments: false` |

The order follows what a reader does after the last paragraph: pass the page
on, say whether it helped, check where it came from, move to the next page,
join the discussion. Share comes first because a reader who wants to pass a
page on has decided that before being asked whether it helped. The share bar is
configured in [Writing a blog](/docs/write/blog/#share), the pager in
[Navigation and menus](/docs/customize/navigation/#pager), and comments in
[Comments](/docs/admin/comments/).

## The feedback widget {#feedback}

The feedback widget asks "Was this page helpful?" with Yes and No buttons, and
after No offers four optional reasons, so you learn which pages fail readers
without running a survey. It is off by default:

```yaml {title="hugo.yml"}
params:
  ui:
    feedback:
      enable: true
      reasons: true # whether to ask for a reason after "no"
```

A blog usually keeps just comments, so you may prefer to turn the widget on for
the documentation section only, with a cascade:

```yaml {title="content/docs/_index.md"}
---
title: Docs
cascade:
  feedback: true
---
```

- One click completes it: there is no text box, no submit button and no sign-in.
- The browser keeps the choice in `localStorage` per page and language, so a returning reader sees it and can change it.
- When the site has Google Analytics (`gtag`), the widget sends a `docs_feedback` event with `result` (`solved` / `not_solved`), `page_path` and `language`. Choosing a reason sends a second event that adds `reason` and `refinement: true`, so it is not counted twice. Without analytics the widget still works and reports nothing; it needs no backend.
- When the page has comments, an "Add details in the comments" link appears under the answer. The widget never writes a comment on the reader's behalf.

This page turns the widget on in its front matter, so you can try it at the end
of the page.

## The contributor wall {#contributors}

The `contributors` shortcode shows a grid of GitHub avatars for the people
behind a project. It reads a file in your site's `data/` directory and never
contacts GitHub at build time:

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

- `github` is required and must be a valid GitHub username; a repeated username warns and is skipped.
- `name` defaults to the username, and `role` is optional.
- `url` defaults to `https://github.com/<github>`.
- `avatar` is optional. Without it the entry shows an initial and the page makes no network request; with it, the value must be an `http(s)://` URL or a path from the site root.

For several lists, keep one data file per list and name it with `data=`;
`class=` adds classes for your own CSS:

```markdown {title="Source"}
{{</* contributors data="maintainers" */>}}
```

In Markdown and RSS output, the grid becomes a list of
`- [@handle](url) — role` lines.

> [!NOTE] This site has no `data/contributors.yaml`
> The example therefore does not render on this page. Add a data file to
> `data/` to render it.

## Verify {#verify}

From your site's root, build and list the action links of a page whose source
belongs to the configured repository. Replace the example path with one of
your own pages:

```bash
hugo --printPathWarnings
PAGE=public/docs/getting-started/index.html
test -f "$PAGE" && grep -o '<a[^>]*data-td-action[^>]*>' "$PAGE"
```

- The link with `data-td-action="edit_page"` points to `github.com/<your repository>/edit/<branch>/<source path>`, and every segment of the source path matches the real file.
- A section index (`_index.md`) gets a correct source path too.
- The page end shows a last-modified line, except on a new page that is not committed yet.

## Related {#related}

- [Page parameters](/docs/write/frontmatter/) — `annotation` / `feedback` / `pager` / `page_context_menu` and the other page switches
- [Configuration](/docs/customize/config/) — full definitions of `github_*`, `ui.lastmod_commit` and `ui.feedback`
- [Comments](/docs/admin/comments/) — the last block at the page end
- [Analytics and SEO](/docs/admin/analytics/) — where feedback events are sent
- [AI-agent support](/docs/customize/agents/) — the Markdown and assistant entries in the action menu
