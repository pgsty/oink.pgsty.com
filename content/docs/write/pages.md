---
title: Writing pages
linkTitle: Writing pages
description: Create a documentation page, from where the file goes and the front matter it needs to stable anchors, links, images, drafts and the controls the theme adds at the end.
weight: 10
search_keywords: [writing pages, front matter, heading ID, heading anchor, links, ref, relref, draft, Markdown]
aliases:
  - /docs/content/writing/
---

A documentation page is one Markdown file under `content/`: a few lines of YAML
front matter, then the body. Where you save the file decides its URL and its
place in the sidebar, so a new page needs nothing beyond the file itself:

```markdown {title="content/docs/install.md"}
---
title: Install Pigsty
linkTitle: Install
description: Get a working PostgreSQL cluster onto a clean EL 9 machine.
weight: 20
---

## Prerequisites {#prerequisites}

A Linux machine you can reach over SSH, passwordless `sudo`, and Python 3.11 or
newer.

> [!IMPORTANT]
> The installer rewrites `/etc/yum.repos.d/`. Back it up first.
```

With `hugo server` running, the page appears at `/docs/install/` and as
**Install** in the sidebar. If your site does not build yet, start with
[Get started](/docs/start/).

## Creating a page {#new-page}

The path under `content/` becomes the URL: `content/docs/install.md` is
published at `/docs/install/`. A translation is a file of the same name with a
language suffix, such as `install.zh.md`, in the same directory, and it shares
the English page's logical path.

A page with no files of its own is a single `.md` file. When it has
screenshots, recordings or example configuration, make it a directory instead:
name the page `index.md` and put its files beside it. Hugo calls this a
[page bundle](https://gohugo.io/content-management/page-bundles/), and the
page refers to its files by their bare names:

```filetree {title="the two page shapes inside content/"}
- content/
  - docs/
    - _index.md                      # section index, English
    - _index.zh.md                   # section index, Chinese
    - install.md                     # single-file page → /docs/install/
    - install.zh.md                  # its Chinese translation
    - anatomy/                       # page bundle → /docs/anatomy/
      - index.md
      - index.zh.md
      - shell.webp                   # page resource, shared by both languages
```

Both shapes look the same in the sidebar. `hugo new content docs/install.md`
creates the file with front matter from an
[archetype](https://gohugo.io/commands/hugo_new_content/); writing it by hand
works just as well. A bundle resource without a language suffix is shared by
every language. [File naming and resources](/docs/customize/i18n/#files)
explains language-specific resources and the one case that needs them: a page
that exists only in Chinese.

## The front matter you need {#front-matter}

The YAML between the two `---` lines at the top of the file is the front
matter. Four keys belong on every page:

```yaml {title="content/docs/install.md"}
---
title: Install Pigsty       # page heading, browser title, search result title
linkTitle: Install          # short name in the sidebar and breadcrumbs; falls back to title
description: Get a working PostgreSQL cluster onto a clean EL 9 machine.
weight: 20                  # ordering among siblings; use multiples of 10 to leave room
---
```

Write `description` as one sentence saying what the reader can do with the
page. It appears on section index cards, in search results and on social
cards, so it is what someone reads when deciding whether to open the page.
`weight` orders the page among its siblings; [Ordering](/docs/write/organize/#weight)
explains ties and pages without one.

Every other key is optional: an icon, draft status, a search boost, comments,
the page shell. [Page parameters](/docs/write/frontmatter/) lists them all.

## Heading levels and stable anchors {#headings}

Start body sections at `##`. The theme renders `title` as the page's one `#`
heading, so a `#` in the body would add a second. The outline in the right
column lists headings from `##` down to Hugo's
`markup.tableOfContents.endLevel`, which is `###` unless you set it to `4` to
include `####`.

Give every `##` and `###` an explicit English ID:

```markdown {title="Source"}
## Prerequisites {#prerequisites}

### Disk and memory {#disk-and-memory}
```

Without an explicit ID, Hugo derives one from the heading text, which causes
two problems:

- A translated heading gets a different ID (`#前提条件` instead of
  `#prerequisites`), so a link that works in English lands at the top of the
  Chinese page. With the English ID on both, `/docs/install/#prerequisites`
  and `/zh/docs/install/#prerequisites` reach the same place; see
  [Heading anchors must align](/docs/customize/i18n/#anchors).
- Rewording a heading silently breaks every link to it. Treat a published ID
  as part of the URL, and when you must rename one, leave an empty anchor with
  the old ID so existing links still arrive:

  ```markdown {title="Source: leaving a target behind for the old anchor"}
  ## Getting started <a id="get-started"></a> {#quickstart}
  ```

Use lowercase English words joined by hyphens, unique within the page.

## OINK's Markdown extensions {#extensions}

The body is standard Markdown, rendered by Hugo's Goldmark, plus the forms
below. Each is ordinary Markdown with at most one attribute line, so the
source still reads well on GitHub or in any editor:

| Component | Shortest syntax | Page |
| --- | --- | --- |
| Callouts | `> [!NOTE]` on the first line of a blockquote; `> [!SOCIAL]` quotes a social post | [Callouts](/docs/components/callout/) · [Social](/docs/components/social/) |
| Code blocks | `{title="hugo.yml" copy=false}` on the fence info line | [Code Blocks](/docs/components/code/) |
| Table extras | A table followed by `{.matrix}` or `{caption="…"}` | [Tables](/docs/components/table/) |
| Field lists | A table followed by `{.fields meta="type default"}` | [Fields](/docs/components/fields/) |
| Tabs | Two adjacent fences each carrying `{tab="Homebrew"}` | [Tabs](/docs/components/tabs/) |
| Steps | An ordered list followed by a `{.steps}` line | [Steps](/docs/components/steps/) |
| Timelines | A definition list followed by a `{.timeline}` line | [Timelines](/docs/components/timeline/) |
| Updates | A heading with `{.update date="…" tags="…"}` | [Updates](/docs/components/update/) |
| Cards | A list of links followed by a `{.cards}` line | [Cards](/docs/components/cards/) |
| Diagrams | A `mermaid` fence (also `plantuml`, `markmap`, `echarts`) | [Mermaid](/docs/components/mermaid/) |
| Maps | A `map` fence with a YAML or JSON list of places | [Maps](/docs/components/map/) |
| File trees | A `filetree` fence, one `- name/  # comment` per line | [FileTree](/docs/components/filetree/) |
| Mathematics | A `math` fence, or display math wrapped in `$$` | [Math](/docs/components/math/) |
| Images & media | A standalone image/video/audio line followed by `{caption="…"}` | [Images](/docs/components/image/) · [Video](/docs/components/video/) · [Audio](/docs/components/audio/) |

The few components that need more than Markdown can express use shortcodes:
badges, keyboard keys (bare `<kbd>` also renders as a keycap), file includes,
terminal recordings, and the Book figure and table family. Their syntax is in [Components](/docs/components/).

The forms combine. Here a code fence and a callout sit inside steps:

````markdown {title="Source"}
1. Install PostgreSQL 18:
   ```bash
   brew install postgresql@18
   ```
1. Start the server and connect to it:
   ```bash
   brew services start postgresql@18
   psql postgres
   ```
   > [!TIP]
   > `brew services list` shows whether the server is running.
{.steps}
````

1. Install PostgreSQL 18:
   ```bash
   brew install postgresql@18
   ```
1. Start the server and connect to it:
   ```bash
   brew services start postgresql@18
   psql postgres
   ```
   > [!TIP]
   > `brew services list` shows whether the server is running.
{.steps}

## Writing links {#links}

Choose the form by what the link points at:

| Form | Example | When to use it |
| --- | --- | --- |
| Absolute site path | `[Configuration](/docs/customize/config/)` | The default. It names the published route, survives moving the source file, and is easy to find and replace across the site |
| Relative path | `[another page](../organize/)`, `![diagram](shell.webp)` | Resources in the same page bundle, or a neighboring page that should move with its source directory |
| The `ref` / `relref` shortcode | `[Configuration]({{</* ref "/docs/customize/config" */>}})` | A target that must exist: a missing one fails the build instead of leaving a broken link |

All three point at directory-style routes with a trailing slash
(`/docs/write/pages/`), the way Hugo publishes pages by default. In a
bilingual site, link to the logical page rather than to a `.zh.md` file, and
use the same fragment IDs in both languages.

Plain Markdown links are not checked when the site builds, so:

- Write internal links as absolute paths; after a restructure, one site-wide
  search and replace finds them all.
- When you move a page, add its old path to `aliases` so outside links keep
  working, and point your own links at the new route instead of leaning on the
  alias.
- When you are not sure a target exists, use `ref` and let the build check it.

The theme passes links to Goldmark unchanged; it has no link render hook.
External links therefore open in the same tab. For new tabs, write the link as
HTML or add your own `layouts/_markup/render-link.html`.

## Where images go {#images}

Put a page's own screenshots in its page bundle, images several pages share in
`assets/images/`, and large files that need no processing in `static/`. All
three use the same `![alt text](source)` syntax, and an attribute line below the
image adds a caption, a size, zoom or a figure number; see
[Images](/docs/components/image/).

## Drafts and publishing {#drafts}

Mark an unfinished page `draft: true` and no build publishes it:

```yaml {title="front matter"}
---
title: Migration guide, not yet final
draft: true
---
```

`hugo server -D` (`--buildDrafts`) previews drafts. A page whose `date` lies in
the future is left out the same way until you build after that date, and `-F`
(`--buildFuture`) previews it. Production builds use neither flag, so plain
`hugo` publishes only finished pages.

## What appears at the end of a page {#page-end}

Do not write a feedback prompt, a last-updated line, previous/next links or a
comment box into the body. The theme adds them after the last paragraph,
always in this order:

| Block | Default | Off for one page | Configure |
| --- | --- | --- | --- |
| Share bar | Off until `params.ui.share` lists networks | `share: false` | [Blog posts](/docs/write/blog/#share) |
| Feedback: the two "Was this page helpful?" buttons | Off | `feedback: false` | [Repository links and page info](/docs/customize/repository/#feedback) |
| Last modified: the time and the latest commit subject, linked to GitHub | On when Git information is available | `annotation: false` | [Repository links and page info](/docs/customize/repository/#lastmod) |
| Pager: previous and next, in sidebar order | On for docs, book and blog | `pager: false` | [Navigation and menus](/docs/customize/navigation/#pager) |
| Comments: Giscus | On when configured and enabled | `comments: false` | [Comments](/docs/admin/comments/) |

The action menu beside the title (copy as Markdown, edit this page, view
history, open an issue, print) is generated too, and is configured in
[Repository links and page info](/docs/customize/repository/). Why the blocks
come in this order is explained in
[What the page end is made of](/docs/customize/repository/#page-end).

## Verify {#verify}

Build once after writing a page:

```bash
hugo --printPathWarnings
```

The build should end with `Total in …` and no `ERROR`. A mistyped attribute or
component parameter produces a warning with its source position and renders a
safe fallback, as described in
[Configuration principles](/docs/customize/config/#principles); a `ref` to a
missing page fails the build. `--printPathWarnings` reports two pages that
publish to the same path, which happens most often in multilingual sites or
after a change to `permalinks`.

Then check in the browser:

1. The page sits in the sidebar where its `weight` puts it.
2. The right-hand outline lists your `##` headings, and clicking one puts an
   English anchor in the URL.
3. A heading has the same anchor on the English page and on its translation.

## Related {#related}

- [Organizing content](/docs/write/organize/) — how the directory structure decides the sidebar
- [Page parameters](/docs/write/frontmatter/) — the full front matter table
- [Components](/docs/components/) — each component's syntax and parameters
- [Languages](/docs/customize/i18n/) — paired bilingual files and fallback for untranslated pages
- [Local preview](/docs/admin/preview/) — the `hugo server` switches worth knowing
