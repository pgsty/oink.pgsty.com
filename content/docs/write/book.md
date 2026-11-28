---
title: Books
linkTitle: Books
description: "Turn a directory tree into a book with `type: book`: chapter numbering, numbered figures and tables, cross-references, generated indexes and whole-book print."
weight: 50
search_keywords: [book, chapter, numbering, figure numbering, cross-reference, xref, book-toc, whole-book print, long documents, publishing]
aliases:
  - /docs/scenarios/book/
  - /docs/scenarios/reading/
---

Documentation is consulted: readers arrive from search, read one page and
leave. A book is read in order, and its readers expect what print taught them:
numbered chapters, figures and tables they can cite as "Figure 2-1",
cross-references that keep working when chapters move, and the whole text as
one document they can print or export. Set `type: book` on a content tree and
OINK provides all of that while every chapter stays an ordinary Markdown page.

A book needs two site settings. Goldmark block attributes and passthrough must
be on, as listed in
[the three Goldmark prerequisites](/docs/customize/config/#goldmark), and
`params.ui.shell_types` must contain `book`, which the default list already
does. If the manuscript already exists in another Hugo site, read
[Migrating an existing manuscript](#migrate) first.

## A minimal book {#layout}

The book root is an ordinary Hugo section, its subdirectories are chapters, and
the pages inside them are sections. That tree is the only chapter list: the
sidebar, the pager, the generated contents and the printed book all read it,
so moving a file moves the chapter everywhere at once.

```filetree {title="content/handbook/, one book"}
- content/handbook/
  - _index.md              # book home: type: book + cascade, holding book-toc and the indexes
  - ch01/
    - _index.md            # chapter 1 front page: book_number: 1
    - install.md           # section 1.x
    - bootstrap.md
  - ch02/
    - _index.md            # chapter 2: numbered with book_number, optionally marked draft
    - replication.md
    - failover.md
  - appendix.md            # an unnumbered appendix, still in the sidebar and the reading order
```

The root page declares the type, cascades it to every page below, and asks for
the `print` output that produces the whole-book document. Print is opt-in
because aggregating every chapter makes the build noticeably slower:

```yaml {title="content/handbook/_index.md"}
---
title: The PostgreSQL operations handbook
type: book
book_number: B
cascade:
  type: book
outputs: [HTML, print, markdown]
---
```

Front matter `outputs` replaces the site's list for that page, so name every
format the root should keep. To set it in `hugo.yml` instead, add `print` to
`outputs.section`, or to `outputs.home` when the book is the site root; that
turns print on for every page of that kind.

A chapter's `_index.md` needs only a title, its number and its position:

```yaml {title="content/handbook/ch02/_index.md"}
---
title: Replication and failover
book_number: 2
book_status: draft
weight: 20
---
```

## Chapter numbers, drafts and headings {#front-matter}

`book_number` is shown exactly as written before the chapter title, in the
sidebar entry and in the generated contents. The theme never derives a number
from directory order, so `2`, `B` and `A` are all valid, and rearranging the
tree never changes a number a reader has already cited. Figure, table,
equation and example numbers follow the same rule: each `num` is a string you
write, such as `2-1`, `5.3` or `A-2`, not a counter.

`book_status: draft` labels an unfinished chapter in the sidebar and in
`book-toc`. It is an editorial label, not Hugo's `draft`: the chapter still
builds and publishes. To also put a localized notice above the body of every
draft chapter, turn on the banner, which is off by default:

```yaml {title="hugo.yml"}
params:
  ui:
    book_draft_banner: true
    sidebar_headings: 3
```

The banner appears only on `type: book` pages with `book_status: draft`, and its
text is the `book_draft_notice` localization string.

`sidebar_headings` lists the current page's headings under its sidebar entry,
which helps in long chapters. It is `false` by default; `true` lists h2
headings, and `2`, `3` or `4` sets the deepest level listed. A page or a
section cascade can override the site value, and the table of contents on the
right is unaffected either way.

Give every heading you plan to link to an explicit ID, such as
`## Synchronous replication {#sync-replication}`. A generated ID changes when
the heading text does, which is fine for navigation but breaks references that
must last. The complete key definitions are in
[Configuration](/docs/customize/config/) and
[Page parameters](/docs/write/frontmatter/#book).

## Numbering: the native form {#numbering-native}

Figures, tables, equations and examples each get a number from an attribute
line placed directly under the Markdown block, with no blank line between them:
`num=` sets the number, `#id` the anchor, and `caption=` a plain-text caption.
This is the form to reach for first, because the source stays readable in any
Markdown viewer and footnotes inside the block keep working.

### Figures {#figure}

Without an `#id`, a figure's anchor is `fig-<num>`.

```markdown {title="Source"}
![The OINK release notes page](/images/releasenote.webp)
{#book-release-note num="2-1" caption="The release notes page is also the single source of release facts." width=600 height=300}
```

![The OINK release notes page](/images/releasenote.webp)
{#book-release-note num="2-1" caption="The release notes page is also the single source of release facts." width=600 height=300}

Native figures need
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`; otherwise
Hugo wraps the image in a paragraph, the attribute line attaches to the
paragraph, and the figure gets no number. The alternative text comes from the
image's own `![…]`, never from the caption. To make the figure a link, add
`link=` to the same attribute line; you do not need the `fig` shortcode for
that.

### Tables {#table}

An attribute line under a pipe table numbers it, with `tbl-<num>` as the
default anchor.

```markdown {title="Source"}
| Isolation level | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| Read Committed | Not possible | Possible | Possible |
| Repeatable Read | Not possible | Not possible | Possible |
| Serializable | Not possible | Not possible | Not possible |
{#tbl-2-1 num="2-1" caption="Anomalies permitted at each PostgreSQL isolation level."}
```

| Isolation level | Dirty read | Non-repeatable read | Phantom read |
| --- | --- | --- | --- |
| Read Committed | Not possible | Possible | Possible |
| Repeatable Read | Not possible | Not possible | Possible |
| Serializable | Not possible | Not possible | Not possible |
{#tbl-2-1 num="2-1" caption="Anomalies permitted at each PostgreSQL isolation level."}

### Equations {#equation}

An attribute line under a `$$` block numbers the formula, with `eq-<num>` as the
default anchor. On wide screens the number and caption sit to the right of the
formula; on narrow screens they wrap below it, and a formula wider than the
screen scrolls sideways. Short captions keep equations easy to scan.

```markdown {title="Source"}
$$
A = \frac{\mathrm{MTBF}}{\mathrm{MTBF} + \mathrm{MTTR}}
$$
{#eq-2-1 num="2-1" caption="Availability from MTBF and MTTR."}
```

$$
A = \frac{\mathrm{MTBF}}{\mathrm{MTBF} + \mathrm{MTTR}}
$$
{#eq-2-1 num="2-1" caption="Availability from MTBF and MTTR."}

This form needs Goldmark passthrough. A site without it uses the `eq`
shortcode below, which renders the formula with KaTeX during the build.

### Examples {#example}

A code fence with `num=` and `caption=` becomes a numbered example, with
`eg-<num>` as the default anchor. An `#id` on the fence names the surrounding
`<figure>`, which is what references point to. An example needs both
attributes: a caption without a number is ignored, and a number without a
caption is dropped with a warning. The caption heads a single frame around the
code.

````markdown {title="Source"}
```sql {num="2-1" caption="Daily write volume on the primary." #eg-2-1}
SELECT date_trunc('day', ts) AS day, count(*)
FROM pg_stat_statements_history
GROUP BY 1 ORDER BY 1 DESC LIMIT 7;
```
````

```sql {num="2-1" caption="Daily write volume on the primary." #eg-2-1}
SELECT date_trunc('day', ts) AS day, count(*)
FROM pg_stat_statements_history
GROUP BY 1 ORDER BY 1 DESC LIMIT 7;
```

## Numbering: the shortcode form {#numbering-shortcodes}

The shortcodes `fig`, `tbl`, `eq` and `eg` render the same `<figure>` as the
native form, register in the same target table, and sort by their position in
the source. Use them when a single Markdown block cannot hold the content: a
figure made of several images or other Markdown, several tables under one
number, an equation on a site without passthrough, or an example with several
fences and prose between them.

`fig` takes its image from `src=` or from its inner Markdown, never both. It
also accepts `link`, `alt`, `width`, `height` and `class`, and `title` as an
alias of `caption` for migrated content:

```markdown {title="Source"}
{{</* fig num="2-2" src="/images/docsy.webp" alt="The default Docsy shell"
    caption="OINK's upstream: the Docsy content model is still underneath." width="600" height="300" /*/>}}
```

{{< fig num="2-2" src="/images/docsy.webp" alt="The default Docsy shell" caption="OINK's upstream: the Docsy content model is still underneath." width="600" height="300" />}}

`tbl` wraps the label, the table, the caption and the anchor in one figure:

```markdown {title="Source"}
{{</* tbl num="2-2" caption="How a numbered component appears in each of the four outputs." */>}}
| Output | Label | Anchor |
| --- | --- | --- |
| HTML | Visible | Stable |
| Print | Visible | Stable |
{{</* /tbl */>}}
```

{{< tbl num="2-2" caption="How a numbered component appears in each of the four outputs." >}}
| Output | Label | Anchor |
| --- | --- | --- |
| HTML | Visible | Stable |
| Print | Visible | Stable |
{{< /tbl >}}

`eq` renders its content with KaTeX during the build, so it works without
passthrough:

```markdown {title="Source"}
{{</* eq num="2-2" caption="Connection pool saturation." */>}}U = \frac{\lambda}{\mu \cdot c}{{</* /eq */>}}
```

{{< eq num="2-2" caption="Connection pool saturation." >}}U = \frac{\lambda}{\mu \cdot c}{{< /eq >}}

Written without parameters, `{{</* eq */>}}` is plain display math: it has no
number and no anchor, `xref` cannot point at it, and it is not listed among the
equations.

`eg` wraps any Markdown, usually one or more fences:

````markdown {title="Source"}
{{</* eg num="2-2" caption="Bringing up a new replica with pg_basebackup." */>}}
```bash
pg_basebackup -h primary -U replicator -D /pg/data -Fp -Xs -P -R
```
{{</* /eg */>}}
````

{{< eg num="2-2" caption="Bringing up a new replica with pg_basebackup." >}}
```bash
pg_basebackup -h primary -U replicator -D /pg/data -Fp -Xs -P -R
```
{{< /eg >}}

In both forms, an ID must be unique within its page, and within one kind a
number maps to a single ID. A duplicate keeps the first registration and logs a
warning that gives the line of the first one.

> [!IMPORTANT] No footnotes inside a shortcode body
> Hugo renders each shortcode body as a separate document, but footnotes belong
> to the page. A `[^label]` inside the body of `tbl`, `eg`, `fig`, `card`,
> `tab`, `field` or `include` therefore either prints literally, when the
> definition is on the page, or starts a second footnote list whose `fn:N` IDs
> collide with the page's own, when the definition is inside the body. The
> build warns with the file, line and label.
>
> Use the native form for a table or code block that needs footnotes. A table,
> image or fence with `{num=… caption=…}` stays in the page document, so its
> footnotes number and link normally, and the rendered figure is the same.
> Footnote-like text in code, such as a `[^0-9]` character class, is not
> affected.

## Cross-references {#xref}

On the same page an ordinary link works: [Table 2-1](#tbl-2-1) points at the
isolation-level table above. You type the label and number yourself, though,
and must find every such link when a number changes. `xref` builds the label,
number and link from the kind and number, and works across pages and
languages:

```markdown {title="Source"}
See {{</* xref fig="2-2" /*/>}} and {{</* xref eg="2-1" /*/>}};
with an explicit anchor: {{</* xref fig="2-1" anchor="book-release-note" /*/>}}.
```

See {{< xref fig="2-2" />}} and {{< xref eg="2-1" />}};
with an explicit anchor: {{< xref fig="2-1" anchor="book-release-note" />}}.

- Give at most one kind key: `fig`, `tbl`, `eq` or `eg`. It supplies the localized label (Figure, Table, Equation, Example) and the default anchor `<kind>-<num>`.
- `anchor=` replaces that anchor when the target declared its own `#id`.
- `page=` points at another page, looked up in the current language, so the source never hard-codes a `/zh/` prefix.
- Without a kind, give both `anchor=` and the link text: `{{</* xref page="../ch01/install" anchor="sync-replication" */>}}synchronous replication{{</* /xref */>}}`.
- A reference may come before its target, on the same page or in a later chapter.

In the whole-book print, an `xref` becomes a jump within the document, while a
plain Markdown link to another page still points at the website. Write any
reference that should also work in print as an `xref`.

## Indexes: contents and lists of figures {#indexes}

Five shortcodes generate what a printed book carries up front: a table of
contents and lists of figures, tables, equations and examples. Each walks the
book tree, renders the pages below the current navigation root and collects
what they registered, so they usually sit on the book root (`_index.md`) or a
dedicated page:

```markdown {title="content/handbook/_index.md"}
{{</* book-toc depth=3 */>}}

## List of figures {#lof}
{{</* book-figures */>}}

## List of tables {#lot}
{{</* book-tables */>}}

## List of equations {#loe}
{{</* book-equations */>}}

## List of examples {#lox}
{{</* book-examples */>}}
```

They appear here only as source, because on this page they would list the
entire Docs tree. [OINK Hands-On](/book/) shows them at work; its source
is
[`content/book/_index.md`](https://github.com/pgsty/oink.pgsty.com/blob/main/content/book/_index.md).

- `book-toc` lists chapters at `depth=1`, adds nested sections at `2` (the default), and adds each page's headings at `3`. `drafts=false` leaves `book_status: draft` chapters out of this list without unpublishing them.
- `book-figures`, `book-tables`, `book-equations` and `book-examples` take no parameters. Each entry reads like "Figure 2-1 — caption" and links to the target's anchor.
- In the whole-book print, every one of these links becomes a jump within the document.

## Reading order {#reading}

Readers move through a book with the pager at the end of each page. It follows
the sidebar tree in pre-order, a section's index page first and then its
children by `weight`, and it is on for `docs`, `book` and `blog` by default.
Set `params.ui.pager_types` to change those types, or `pager: false` to remove
it from one page:

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book]
```

Entries hidden with `toc_hide`, link-only `manual_link` entries and
`sidebar_divider` rows are never pager destinations.

## Printing the whole book {#print}

Once the root has the `print` output, `/_print/handbook/` holds the whole book
as one HTML document: a cover, a table of contents, the root page's body, and
every chapter in reading order. Pages with `no_print: true`, link-only entries,
divider rows and hidden placeholders are left out. Per-chapter print and the
print switches are covered in [Print](/docs/customize/print/).

Numbered figures, tables, equations and examples keep their IDs exactly, so
`xref` links resolve inside the document. Heading and footnote IDs get a
prefix naming their source page, because several chapters may each have a
`summary` heading or a first footnote `fn:1`; the links the theme generates
are rewritten to match. A single page printed on its own keeps its ordinary
IDs.

For EPUB or PDF, also list `BookManifest` in the root's `outputs`. The build
then writes `book.json` beside the root page, recording the reading order,
headings, numbered targets and references. Two scripts in the theme repository
turn the manifest and the print HTML into files: `bin/book-epub.py` needs
Pandoc 3 and a Pandoc metadata file with the book's title and author, and
`bin/book-pdf.py` needs Chrome or Chromium and produces A4 pages. Run them after
the build; Hugo itself produces neither file. Here and below, `/path/to/oink`
is a checkout of the theme repository at the release your site pins:

```bash {title="Terminal"}
python3 /path/to/oink/bin/book-epub.py --manifest public/handbook/book.json \
  --public public --metadata epub.yaml --output handbook.epub
python3 /path/to/oink/bin/book-pdf.py --manifest public/handbook/book.json \
  --public public --output handbook.pdf
```

## Migrating an existing manuscript {#migrate}

A manuscript written for another Hugo theme usually numbers figures with a
site-specific `figure` shortcode, bold pseudo-captions and bare links to
`#fig_*` anchors. `bin/migrations/book_figures.py` rewrites those forms into
`fig`, `tbl` and `xref` and keeps the anchors already published, so inbound
links keep working. Pin the site to the current OINK release first, then
migrate the content on a dedicated branch, starting with a dry run:

```bash {title="Dry run: diff and report only, no files changed"}
python3 /path/to/oink/bin/migrations/book_figures.py \
  --profile tpme \
  --root /path/to/your-book \
  --report /tmp/book-migrate.json > /tmp/book-migrate.diff
```

Each profile recognizes the conventions of one real manuscript, and only the
forms actually found in it. DDIA has one profile for each of its two editions:

| `--profile` | Legacy form it recognizes |
| --- | --- |
| `tpme` | A pseudo-h6 caption beside an image, a caption beside a table, and bare `/en/...#fragment` links |
| `ddia-v2` | The site's own `figure` shortcode, classified by number into figure / table / code example |
| `ddia-v1` | A bare image with an adjacent bold numbered caption, with the ID derived from the image filename |
| `pg-internal` | A bold or italic "Figure N" caption in Chinese or English next to an image, and a numbered table caption next to a table |
{.fields}

A manuscript whose conventions match none of them is rewritten by hand into
[the native form](#numbering-native).

| Option | What it does |
| --- | --- |
| `--profile` | Required; one of the four values above |
| `--root` | Required; the consuming repository's root |
| `--path` | Restricts to a file or directory under `--root`; repeatable. The default scans the whole content tree |
| `--write` | Applies the rewrite. The default is a dry run that writes nothing |
| `--no-diff` | Suppresses the diff while keeping the summary and the report |
| `--report` | Writes the machine-readable JSON report |
{.fields}

The diff goes to standard output and the summary to standard error. The report
carries `files_scanned`, `files_changed`, `counts`, `skipped` and `idempotent`.
The script rewrites only targets it can identify uniquely; where the number is
unclear, the caption is not unique or the marker form is unknown, it leaves the
text alone and records the item in `skipped` for you to handle. Bold text,
inline code and formulas inside a legacy caption become plain text, because a
Book caption is plain text.

After reviewing the diff, apply it, then run the script again to confirm there
is nothing left to change:

```bash {title="Apply, then verify idempotency"}
python3 /path/to/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --write \
  --report /tmp/book-migrate-written.json

python3 /path/to/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --no-diff \
  --report /tmp/book-migrate-second.json
```

The second report should show `files_changed: 0`, empty `counts` and
`idempotent: true`, and the script exits with code 0.

## Verify {#verify}

1. Build with `hugo --printPathWarnings` and read every warning: a malformed number, a duplicate ID and an example without a caption each produce one.
2. On a page, check for localized labels such as "Figure 2-1" and for `xref` links that land on their targets.
3. Compare the chapter order in the sidebar, the pager, `book-toc` and the whole-book print.
4. Check the Markdown output with `curl -s http://localhost:1313/handbook/ch02/index.md`. A shortcode figure becomes `**Figure 2-2.** caption` followed by its body; a native figure keeps its source block and attribute line.
5. Run the theme's anchor check against the build output. It confirms that every reference's target exists, that kind and number agree, that IDs are unique within each page, and that numbered images have alternative text; it expects at least one numbered target and one `xref`.

```bash {title="Terminal"}
python3 /path/to/oink/bin/check-book.py --site-public public
```

## Book shortcode parameters {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `num` | string | — | Required (except for the bare `eq` form). Matches `[0-9A-Za-z.-]+` and must be quoted |
| `id` | string | `fig-<num>` / `tbl-<num>` / `eq-<num>` / `eg-<num>` | Matches `[A-Za-z][A-Za-z0-9_.:-]*` and is preserved byte for byte |
| `caption` | plain text | empty | Required for `eg`. Optional for `fig`, `tbl`, and `eq`. Not Markdown |
| `class` | class token | — | Appended to the `<figure>`. Requires `num` |
| `src` | image path | — | `fig` only. Mutually exclusive with inner content, and follows the shared image resolution order |
| `link` `alt` `width` `height` | — | — | `fig` only. Width and height are positive integers |
| `title` | plain text | — | `fig` only. A migration alias for `caption`, mutually exclusive with it |
{.fields meta="type default"}

`xref`:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `fig` `tbl` `eq` `eg` | number string | — | At most one. Supplies the localized label and derives the anchor |
| `anchor` | ID | derived from kind and number | Required when no kind is given, together with inner link text |
| `page` | page reference | current page | Resolved through page lookup in the current language. A missing page warns and renders text without a link |
{.fields meta="type default"}

`book-toc`:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `depth` | integer 1–3 | `2` | 1 chapters / 2 with nested sections / 3 with the heading tree |
| `drafts` | boolean | `true` | `false` filters draft chapters out of the generated list |
{.fields meta="type default"}

`book-figures`, `book-tables`, `book-equations` and `book-examples` take no
parameters.

## Limits {#limits}

- An attribute line must touch its block. A formatter such as Prettier that separates or moves it turns a numbered figure back into a plain image without any warning.
- `book_kind` and `book_part` are accepted as metadata but change nothing on the page; only `book_number` and `book_status` have a visible effect.
- The index shortcodes render every page below the root, which lengthens the build of a very large book. Whole-book `print` is opt-in for the same reason.
- EPUB and PDF come from the two scripts, never from Hugo alone. Typeset pagination, font embedding and back-of-book index compilation are not provided.

## Related {#related}

- [Organizing content](/docs/write/organize/) — how the tree becomes the sidebar and the reading order
- [Images](/docs/components/image/) — captions, sizing, zoom and image processing
- [Tables](/docs/components/table/) — table attribute lines and full-width tables
- [Math](/docs/components/math/) — KaTeX and passthrough configuration
- [Print](/docs/customize/print/) — per-chapter and whole-book print
