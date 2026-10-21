---
title: Includes
linkTitle: Includes
description: Use include to insert a file, param to print a site parameter, and comment to remove a note from every output.
weight: 200
search_keywords: [include, file, snippet, reuse, readfile, param, interpolation, comment]
params:
  pigsty_pg_major: 18
---

`include` inserts another file's content into the page. `param` prints a page or site parameter. `comment` removes a passage.
Use them for fragments or constants shared by multiple pages.
For example, use `include` for installation steps on three pages and `param` for a version number on dozens of pages.
You then edit one source. Keep content used by only one page on that page.

## Shortest form {#minimal}

`include` takes one required parameter, `file`:

```markdown {title="Source"}
{{</* include file="parts/install-oink.md" */>}}
```

The included file contains ordinary Markdown under `assets/`:

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

The result is the same as writing the content here. The code block has a copy button, and the callout displays normally.

{{< include file="parts/install-oink.md" >}}

An included file is not a separate page. It has no sidebar entry, translation pairing, or URL.

## Where the file comes from {#sources}

`file` resolves in this order. The first match takes precedence:

| Order | Looked up as | Written as |
| --- | --- | --- |
| 1 | A page resource — a file in this page's bundle | `file="config.yaml"` |
| 2 | A global resource under `assets/` | `file="snippets/dsn.txt"` |
| 3 | A file under `content/`: a leading `/` is the content root, otherwise relative to the page's directory | `file="notes/caveat.md"`, `file="/shared/notice.md"` |

If no source matches, or the path contains `..`, the include warns and emits nothing. Review the warning and rendered fallback before publication.
Include reads only from `content/` and `assets/`.

Markdown fragments are read as source. Use the file's actual disk name.
Page resources in step 1 have one exception. Hugo attaches language-suffixed resources such as `notice.zh.md` under a name without the language suffix.
Requesting `notice.md` from a bundle therefore gives `include` rendered HTML instead of source.
The Markdown output can then contain `<div class="td-code">`.
Under `assets/` and `content/`, the written name identifies the exact file. Non-Markdown files (`.yaml`, `.sh`, `.txt`) have no such distinction.

Each language of this page includes its own fragment.
English uses `assets/parts/install-oink.md`; Chinese uses `assets/parts/install-oink.zh.md`.
Storing fragments under `assets/` instead of the page bundle lets both languages retrieve source with the written filename.

## Including code files {#code}

`code=true` displays the file as a code block. `lang=` sets its highlighting language.
Use a real repository file to keep the documentation consistent with that file.

```markdown {title="Source"}
{{</* include file="parts/module.yml" code=true lang="yaml" */>}}
```

{{< include file="parts/module.yml" code=true lang="yaml" >}}

Included code and fences share the same pipeline for highlighting, line numbers, and copying.
You cannot pass fence attributes such as `title=`, `collapse`, or `hl_lines=` through include.
If you need them, write an ordinary [code block](/docs/components/code/).

## What a fragment can contain {#snippet-content}

Fragments use page-level Markdown in the current page's context. They support callouts, tables, lists, images, steps, and shortcodes.
The example fragment's last line, "The current release is v0.8.1", comes from `{{</* param version */>}}` expanded on this page.

If two pages include the same fragment, each renders it separately. Each generates its own heading anchors and code-block IDs without collisions.

> [!TIP] What makes a good fragment
> Use fragments for installation commands, connection strings, support matrices, and legal notices that must change on all pages together.
> Keep content used by only one page on that page.

## Printing a site parameter {#param}

`param` prints one parameter. It checks page front matter first, then site configuration, following Hugo's `.Param` rule.

```markdown {title="Source"}
This site publishes {{</* param version */>}}, copyright from {{</* param copyright.from_year */>}},
and this page's front matter says `pigsty_pg_major: 18`, which reads back as {{</* param pigsty_pg_major */>}}.
```

This site publishes {{< param version >}}, copyright from {{< param copyright.from_year >}},
and this page's front matter says `pigsty_pg_major: 18`, which reads back as {{< param pigsty_pg_major >}}.

Join nested keys with `.`. For example, `copyright.from_year` reads `params.copyright.from_year`.
Missing parameters and values that are maps or lists warn and print nothing. Review the warning and rendered fallback before publication.

## Parameters inside commands, tables and links {#param-in-place}

`param` emits escaped plain text. It can appear in code fences, table cells, or link targets.
For example, use it for a version number in an installation command:

````markdown {title="Source"}
```sh
hugo mod get github.com/pgsty/oink@{{</* param tdVersion.latest */>}}
```

| Item | Value |
| --- | --- |
| Current version | {{</* param version */>}} |
| Hugo floor | {{</* param hugoMinVersion */>}} |

[Release notes](https://github.com/pgsty/oink/releases/tag/{{</* param tdVersion.latest */>}})
````

```sh
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

| Item | Value |
| --- | --- |
| Current version | {{< param version >}} |
| Hugo floor | {{< param hugoMinVersion >}} |

[Release notes](https://github.com/pgsty/oink/releases/tag/{{< param tdVersion.latest >}})

[Configuration](/docs/customize/config/) defines site parameters. [Front matter](/docs/write/frontmatter/) defines page parameters.

## Notes deleted at build time {#comment}

A `comment` body appears in none of the four outputs: HTML, print, Markdown, or RSS.
HTML comments remain in page source and reach `llms.txt`.

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

A comment exists between those paragraphs, but it does not appear in the page source.

## Output {#outputs}

| Output | `include` (Markdown) | `include code=true` | `param` | `comment` |
| --- | --- | --- | --- | --- |
| HTML | The fragment renders as normal content | Highlighted code block + copy button | Escaped plain text | nothing |
| Print | As HTML | As HTML, without the copy button | As HTML | nothing |
| Markdown | The fragment's source, as written | A source fence | The value itself | nothing |
| RSS | As HTML | As HTML | As HTML | nothing |

Markdown output preserves fragment source instead of rendered HTML. Its shortcodes remain as `{{</* param version */>}}`.
This is the intended source-preserving behavior. None of these three shortcodes loads a script.

## Parameter reference {#reference}

`include` (named parameters only):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | path (required) | — | Resolution order in [Where the file comes from](#sources); a `..`, missing file, or empty value warns and emits nothing |
| `code` | boolean | `false` | `true` renders as a code block; quoted `code="true"` warns and includes ordinary content |
| `lang` | string | — | Code language; without `code=true` it warns and is ignored |
{.fields meta="type default"}

Other parameter names warn and are ignored. The message identifies the file and line. Review the warning and rendered fallback before publication.

`param` (one positional parameter):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| parameter name | string (required) | — | Nested keys join with `.`; page front matter first, then site `params`; missing or non-scalar values warn and print nothing |
{.fields meta="type default"}

`comment` takes no parameters. Use opening and closing shortcodes.
All content between `{{</* comment */>}}` and `{{</* /comment */>}}` is discarded.

## Limits {#limits}

- `include` is not a template. You cannot pass variables, include conditionally, or supply code-block fence attributes such as `title=` or `collapse`.
  For platform variants, create two fragments and use [tabs](/docs/components/tabs/).
- You maintain fragment languages. `include` has no language fallback and uses the exact written path.
  You can share a fragment across languages, as this page's Chinese translation includes the same English file.
  Alternatively, write one fragment per language and use its path on the corresponding page.
- `param` prints only scalars. Put structured data, such as version matrices or download lists, in `data/` and use the matching component.
- `comment` discards content on every build. To temporarily unpublish a whole page, use `draft: true`.
- Do not use `include` to create an index page. If a page needs ten fragments, give readers ten links instead.

## Related {#related}

- [Code blocks](/docs/components/code/) — every fence attribute, and the pipeline `include code=true` reuses
- [Tabs](/docs/components/tabs/) — per-platform or per-language fragments
- [Configuration](/docs/customize/config/) — the site parameters `param` can reach
- [Front matter](/docs/write/frontmatter/) — page parameters, which win over site configuration
