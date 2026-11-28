---
title: Includes
linkTitle: Includes
description: Reuse one source across pages with include for shared fragments and files, param for site and page values, and comment for notes that never publish.
weight: 260
search_keywords: [include, file, snippet, reuse, readfile, param, interpolation, comment]
params:
  pigsty_pg_major: 18
---

When the same installation steps appear on three pages, or the current version
number on thirty, every copy is a chance for the pages to drift apart. These
three shortcodes keep one source instead: `include` inserts the content of
another file, `param` prints a page or site parameter, and `comment` holds a
note for authors that no output ever shows. Content that only one page uses
belongs on that page.

## Shortest form {#minimal}

`include` has one required parameter, `file`:

```markdown {title="Source"}
{{</* include file="parts/install-oink.md" */>}}
```

The included file is ordinary Markdown, kept under `assets/`:

````markdown {title="assets/parts/install-oink.md"}
Installing OINK into an existing Hugo site takes three commands:

```sh
hugo mod init github.com/you/your-site
hugo mod get github.com/pgsty/oink
hugo server
```

> [!NOTE]
> `hugo mod get` needs Go on the machine; an offline archive or a submodule does not.

The current release is {{</* param version */>}}.
````

It renders exactly as if you had written it here, copy button and callout
included:

{{< include file="parts/install-oink.md" >}}

An included file is not a page: it has no URL, no sidebar entry and no
translation of its own.

## Where the file comes from {#sources}

`file` is looked up in this order, and the first match wins:

| Order | Looked up as | Written as |
| --- | --- | --- |
| 1 | A page resource — a file in this page's bundle | `file="config.yaml"` |
| 2 | A global resource under `assets/` | `file="snippets/dsn.txt"` |
| 3 | A file under `content/`: a leading `/` is the content root, otherwise relative to the page's directory | `file="notes/caveat.md"`, `file="/shared/notice.md"` |

Include never reads outside `content/` and `assets/`. A path containing `..`,
or one that matches nothing, warns and includes nothing.

Keep Markdown fragments under `assets/` or `content/`, where the name you
write is exactly the file you get. In a page bundle (step 1), Hugo files
language-suffixed resources such as `notice.zh.md` under the name without the
suffix, and asking the bundle for `notice.md` returns rendered HTML rather than
source, which then leaks into the page's Markdown output as
`<div class="td-code">` markup. Non-Markdown files such as `.yaml`, `.sh` or
`.txt` are not affected.

## Including code files {#code}

`code=true` shows the file as a code block, and `lang=` picks its
highlighting. Including a real configuration file from the repository keeps
the documentation in step with the file.

```markdown {title="Source"}
{{</* include file="parts/module.yml" code=true lang="yaml" */>}}
```

{{< include file="parts/module.yml" code=true lang="yaml" >}}

The block gets the same highlighting, line numbers and copy button as a code
fence. Fence attributes such as `title=`, `collapse` or `hl_lines=` cannot be
passed through `include`; when you need them, write an ordinary
[code block](/docs/components/code/).

## What a fragment can contain {#snippet-content}

A fragment is ordinary Markdown rendered in the context of the page that
includes it, so callouts, tables, lists, images, steps and shortcodes all
work. That is why the last line of the example above shows this site's current
release: its `{{</* param version */>}}` expands on this page.

When two pages include the same fragment, each renders it separately with its
own heading anchors and code-block IDs, so nothing collides. Good fragments are
the things that must change everywhere at once: installation commands,
connection strings, support matrices, legal notices.

## Printing a site parameter {#param}

`param` prints one parameter, looking in the page's front matter first and then
in the site configuration, the same lookup as Hugo's `.Param`.

```markdown {title="Source"}
This site publishes {{</* param version */>}}, copyright from {{</* param copyright.from_year */>}},
and this page's front matter says `pigsty_pg_major: 18`, which reads back as {{</* param pigsty_pg_major */>}}.
```

This site publishes {{< param version >}}, copyright from {{< param copyright.from_year >}},
and this page's front matter says `pigsty_pg_major: 18`, which reads back as {{< param pigsty_pg_major >}}.

Join nested keys with `.`: `copyright.from_year` reads
`params.copyright.from_year`. A missing parameter, or one whose value is a map
or a list, warns and prints nothing.

## Parameters inside commands, tables and links {#param-in-place}

`param` prints escaped plain text, so it also works inside code fences, table
cells and link targets, which is where version numbers usually live:

````markdown {title="Source"}
```sh
hugo mod get github.com/pgsty/oink@{{</* param tdVersion.latest */>}}
```

| Item | Value |
| --- | --- |
| Current version | {{</* param version */>}} |
| Visual preset | {{</* param ui.preset */>}} |

[Release notes](https://github.com/pgsty/oink/releases/tag/{{</* param tdVersion.latest */>}})
````

```sh
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

| Item | Value |
| --- | --- |
| Current version | {{< param version >}} |
| Visual preset | {{< param ui.preset >}} |

[Release notes](https://github.com/pgsty/oink/releases/tag/{{< param tdVersion.latest >}})

Site parameters are set in [Configuration](/docs/customize/config/), page
parameters in [Front matter](/docs/write/frontmatter/).

## Notes deleted at build time {#comment}

Use `comment` for a to-do or a note to the next author. Its body is dropped
from every output: HTML, print, Markdown and RSS. An HTML comment would not do,
because it stays in the page source and reaches `llms.txt`.

```markdown {title="Source"}
Since PostgreSQL 18, `pg_stat_io` breaks out WAL statistics.

{{</* comment */>}}
TODO: after v0.5 ships, bump the version above to 19 and add a pg_stat_io screenshot.
This text reaches no output at all, llms.txt included.
{{</* /comment */>}}

Verify the dashboards on a test database before upgrading.
```

Since PostgreSQL 18, `pg_stat_io` breaks out WAL statistics.

{{< comment >}}
TODO: after v0.5 ships, bump the version above to 19 and add a pg_stat_io screenshot.
This text reaches no output at all, llms.txt included.
{{< /comment >}}

Verify the dashboards on a test database before upgrading.

There is a comment between these two paragraphs, and not even the page source
shows it.

## Output {#outputs}

None of the three shortcodes loads a script, and print and RSS show the same
content as the web page. The page's Markdown output keeps sources rather than
rendered HTML: an included fragment appears as written, with shortcodes such
as `{{</* param version */>}}` still unexpanded, `include code=true` becomes a
fenced code block, `param` becomes its value, and `comment` leaves nothing.

## Parameter reference {#reference}

`include` (named parameters only):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | path (required) | — | Resolution order in [Where the file comes from](#sources); a `..`, missing file, or empty value warns and emits nothing |
| `code` | boolean | `false` | `true` renders as a code block; quoted `code="true"` warns and includes ordinary content |
| `lang` | string | — | Code language; without `code=true` it warns and is ignored |
{.fields meta="type default"}

Any other parameter name warns, with the file and line, and is ignored.

`param` (one positional parameter):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| parameter name | string (required) | — | Nested keys join with `.`; page front matter first, then site `params`; missing or non-scalar values warn and print nothing |
{.fields meta="type default"}

`comment` takes no parameters. It is a paired shortcode, and everything
between `{{</* comment */>}}` and `{{</* /comment */>}}` is discarded.

## Limits {#limits}

- `include` is not a template: it cannot pass variables to a fragment, include
  one conditionally, or add fence attributes such as `title=` or `collapse` to
  an included code block. For per-platform variants, write two fragments and
  put them in [tabs](/docs/components/tabs/).
- `include` has no language fallback and reads exactly the path you write. A
  fragment can serve every language, or you can keep one per language, as this
  page does with `install-oink.md` and `install-oink.zh.md`, and point each
  translation at its own.
- `param` prints scalars only. Keep structured data such as version matrices
  or download lists in `data/` and render it with the matching component.
- `comment` discards its content on every build. To take a whole page offline
  for a while, set `draft: true`.
- If a page needs ten fragments, readers are better served by ten links than
  by one page assembled from includes.

## Related {#related}

- [Code blocks](/docs/components/code/) — every fence attribute, and the pipeline `include code=true` reuses
- [Tabs](/docs/components/tabs/) — per-platform or per-language fragments
- [Configuration](/docs/customize/config/) — the site parameters `param` can reach
- [Front matter](/docs/write/frontmatter/) — page parameters, which win over site configuration
