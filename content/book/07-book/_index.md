---
title: Write a book with numbers and references
linkTitle: Books
description: Turn a directory into a book with numbered chapters, figures, tables, equations and examples, link them with xref, generate the indexes and print the whole book as one document.
book_kind: chapter
book_number: 7
weight: 70
---

Documentation is consulted; a book is read in order. Its readers expect what
print taught them: numbered chapters, "Table 3-1" they can cite, references
that keep working when chapters move, and the whole text as one document.
OINK provides all of that for any tree marked `type: book`, while every chapter
stays an ordinary Markdown page. The Starter's `content/book/` is already one;
this chapter turns it into the Acme DB Operations Handbook, and the numbered
items below are live examples in this book.

## The book root {#root}

The root page declares the type, passes it to every page below, and asks for
the `print` output that produces the whole-book document. The Starter's root
already does all three; give it the handbook's title:

```markdown {title="content/book/_index.md"}
---
title: The Acme DB Operations Handbook
linkTitle: Handbook
type: book
book_kind: book
outputs: [HTML, print, markdown]
cascade:
  type: book
  sidebar_headings: 3
---

Run Acme DB in production, from sizing the first server to recovering from a
lost disk.

{{</* book-toc depth=2 */>}}
```

Front matter `outputs` replaces the site's list for this page, so it names
every format the root keeps. `sidebar_headings: 3` lists each chapter's
headings under it in the sidebar, which helps in long chapters.

## Chapters {#chapters}

Each chapter is a page with a number and a position. Replace the Starter's
four sample chapters with the handbook's own:

```markdown {title="content/book/03-capacity.md"}
---
title: Plan capacity
description: Size CPU, memory and disk for a sustained ingest rate and retention period.
book_kind: chapter
book_number: 3
book_status: draft
weight: 30
---
```

`book_number` is shown exactly as written, in the sidebar, the contents and the
print view. The theme never derives it from directory order, so `3`, `A` and
`B` are all valid, and moving a file never renumbers a chapter that readers have
already cited. `book_status: draft` labels an unfinished chapter without
unpublishing it; with `params.ui.book_draft_banner: true` the chapter also
opens with a notice, the way this book's draft chapters would.

## Number what readers cite {#numbering}

A figure, a table, an equation or a code example gets its number from an
attribute line directly under it, with no blank line between: `num=` is the
number as you want it printed and `caption=` a plain-text caption. In the
handbook these would be numbered after chapter 3; here they carry this
chapter's number, 7.

### A table {#numbered-table}

```markdown {title="Source"}
| Sustained ingest | CPU cores | Memory | Disk for 90 days |
| --- | ---: | ---: | ---: |
| 100,000 points/s | 4 | 8 GB | 1.2 TB |
| 1,000,000 points/s | 8 | 32 GB | 12 TB |
| 3,000,000 points/s | 16 | 64 GB | 37 TB |
{num="7-1" caption="Server sizes by sustained ingest rate."}
```

| Sustained ingest | CPU cores | Memory | Disk for 90 days |
| --- | ---: | ---: | ---: |
| 100,000 points/s | 4 | 8 GB | 1.2 TB |
| 1,000,000 points/s | 8 | 32 GB | 12 TB |
| 3,000,000 points/s | 16 | 64 GB | 37 TB |
{num="7-1" caption="Server sizes by sustained ingest rate."}

### An equation {#numbered-equation}

The disk column comes from the formula of [Chapter 5](/book/05-media/#math),
now numbered:

```markdown {title="Source"}
$$
S = \frac{N \cdot f \cdot T \cdot b}{c}
$$
{num="7-1" caption="Disk use over a retention period."}
```

$$
S = \frac{N \cdot f \cdot T \cdot b}{c}
$$
{num="7-1" caption="Disk use over a retention period."}

### A code example {#numbered-example}

A fence takes `num` and `caption` in its own attributes:

````markdown {title="Source"}
```toml {num="7-1" caption="acme.toml for a server ingesting up to a million points per second."}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"
memtable_size = "4GB"

[retention]
default = "90d"
```
````

```toml {num="7-1" caption="acme.toml for a server ingesting up to a million points per second."}
[server]
listen = ":8086"
data_dir = "/var/lib/acme"
memtable_size = "4GB"

[retention]
default = "90d"
```

### A figure {#numbered-figure}

An image in a paragraph of its own takes the same attribute line:

```markdown {title="Source"}
![The ddia.vonng.com home page with contents, reading and print buttons](/case/ddia/featured.webp)
{num="7-1" caption="ddia.vonng.com: contents, the first chapter and the whole book in print, one click each." width=900 height=506}
```

![The ddia.vonng.com home page with contents, reading and print buttons](/case/ddia/featured.webp)
{num="7-1" caption="ddia.vonng.com: contents, the first chapter and the whole book in print, one click each." width=900 height=506}

Each kind counts separately, so Table 7-1, Equation 7-1, Example 7-1 and Figure
7-1 coexist. Without an `#id`, the anchor is the kind and the number, such as
`#tbl-7-1`. Add an explicit one, `{#tbl-server-sizes num="7-1" …}`, when other
sites will link to the target, so a renumbering does not break their links.
Keep the attribute line touching its block: a formatter that moves it turns a
numbered figure back into a plain image without any warning.

## Cross-reference with xref {#xref}

A hand-written "see Table 7-1" goes stale when the table is renumbered. The
`xref` shortcode builds the label, the number and the link from the kind and
the number, in the reader's language:

```markdown {title="Source"}
Size the server from {{</* xref tbl="7-1" /*/>}}, which applies
{{</* xref eq="7-1" /*/>}} to 16-byte points with a compression ratio of 10.
Chapter 1 opened with {{</* xref eg="1-1" page="/book/01-start" anchor="eg-prompt-blog" /*/>}}.
```

Size the server from {{< xref tbl="7-1" />}}, which applies
{{< xref eq="7-1" />}} to 16-byte points with a compression ratio of 10.
Chapter 1 opened with {{< xref eg="1-1" page="/book/01-start" anchor="eg-prompt-blog" />}}.

`page=` points at another chapter, looked up in the current language, so the
Chinese edition of this sentence links to the Chinese chapter without a `/zh/`
prefix in the source. `anchor=` is needed when the target declared its own ID,
as Example 1-1 did. A reference may come before its target, in the same chapter
or a later one.

## Generated indexes {#indexes}

The root page, or a dedicated contents page, collects everything the chapters
registered:

```markdown {title="content/book/_index.md"}
{{</* book-toc depth=3 */>}}

## Figures {#figures}
{{</* book-figures */>}}

## Tables {#tables}
{{</* book-tables */>}}

## Equations {#equations}
{{</* book-equations */>}}

## Examples {#examples}
{{</* book-examples */>}}
```

`book-toc` lists chapters at `depth=1`, adds nested sections at `2` and each
page's headings at `3`. This book's [root page](/book/#figures) carries all
five; the items numbered in this chapter are listed there beside the prompts
from Part I.

## Print the whole book {#print}

Because the root has the `print` output, `/_print/book/` holds the whole book
as one HTML document: a cover, the contents, and every chapter in reading
order. Every `xref` becomes a jump within the document, so the references keep
working on paper. Open [this book's print view](/_print/book/) and save it as a
PDF from the browser's print dialog. For EPUB or a paginated PDF, the theme
repository ships two scripts that work from the build output; see
[Books](/docs/write/book/#print).

## Check your work {#checkpoint}

- The handbook's chapters appear in the sidebar with their numbers, and the draft chapter carries its label.
- Each numbered item shows its label, such as "Table 3-1", and its caption.
- Every `xref` link lands on its target, including one into another chapter.
- `/_print/book/` contains every chapter, with the contents and indexes linking inside the document.

## Ask your agent {#agent}

```text {num="7-2" caption="Prompt: turn a manuscript folder into a book." #eg-agent-book}
Turn the Markdown chapters in ./manuscript into an OINK book under
content/book/, following https://oink.pgsty.com/docs/write/book/. One file per
chapter with book_number and weight; keep the wording unchanged. Number every
figure, table and code example after its chapter (3-1, 3-2, …) with native
attribute lines, and replace hand-written "see Figure 3" text with xref. Put
book-toc and the four index shortcodes on the root page and enable the print
output. Report any figure without alt text, then check the numbering, the
cross-references and /_print/book/ in the browser.
```
