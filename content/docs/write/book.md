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

A book is a content tree with `type: book`. The directory determines chapter
order. Front matter determines chapter numbers. Each figure, table, equation,
and example has a manually assigned number and stable anchor. Cross-references
resolve in all four outputs. The book root can generate whole-book print HTML.

Two settings are required. Enable attribute lines and passthrough in the site's
`markup.goldmark` (see [Components](/docs/components/)). Keep `book` in
`params.ui.shell_types`. The theme default includes it.

For a new book, start with the directory below. For an existing manuscript,
see [Migrating an existing manuscript](#migrate).

## A book's directory {#layout}

The book root is an ordinary Hugo section. Chapters are its subdirectories.
Sections are pages inside each chapter. There is no second chapter list. The
sidebar, pager, and generated contents all read this tree.

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

Assign chapter numbers manually. `book_number` displays exactly what you write.
The theme never numbers chapters by directory order. The `num` on a figure,
table, equation, or example also uses an author-controlled string.
`2-1`, `5.3`, and `A-2` are valid. Rendering does not compute an index.
Rearranging the tree never changes a number that has already been printed.

## The book home and chapter pages {#front-matter}

The book root declares the type, cascades it to descendants, and explicitly
requests the `print` output. That aggregate is expensive to build, so the theme
does not turn it on for a consuming site:

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

A book section uses Hugo's `section` output kind. `home` applies
only when the book sits at the site root:

```yaml {title="hugo.yml"}
outputs:
  section: [HTML, print, markdown]
params:
  ui:
    sidebar_headings: false # default; use 3 to add h2–h3 below the current entry
    book_draft_banner: true # draft chapters get a localized banner above the body
```

A chapter page needs only its number and its order:

```yaml {title="content/handbook/ch02/_index.md"}
---
title: Replication and failover
book_number: 2
book_status: draft
weight: 20
---
```

`book_number` appears before the page title, in the sidebar and in the generated
contents. `book_status: draft` is a visible editorial label and does not change
Hugo's publication state. A draft chapter builds and publishes as usual.

`sidebar_headings` defaults to `false` and accepts `true` (h2 only) or a maximum
level from 2 to 4. A page or section cascade can override the site setting.
The right outline remains available when this left branch is disabled.
Give every heading that will be referenced an explicit ID, such as
`## Synchronous replication {#sync-replication}`. A generated slug works for
navigation. Do not use it as a long-term reference target.

The full key definitions are in [Configuration](/docs/customize/config/) and
[Page parameters](/docs/write/frontmatter/).

## Numbering: the native form {#numbering-native}

Each of the four numbered kinds has a native form. Put an attribute line
immediately after one Markdown block. Use `num=` for the number, `#id` for
the anchor, and `caption=` for a plain-text caption.

### Figures {#figure}

An attribute line follows the image block. Omitting `#id` defaults it to
`fig-<num>`.

```markdown {title="Source"}
![The OINK release notes page](/images/releasenote.webp)
{#book-release-note num="2-1" caption="The release notes page is also the single source of release facts." width=600 height=300}
```

![The OINK release notes page](/images/releasenote.webp)
{#book-release-note num="2-1" caption="The release notes page is also the single source of release facts." width=600 height=300}

The native figure form requires the site to set
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph: false`. Otherwise,
the attribute line attaches to the paragraph and is ignored. The alternative
text comes from the Markdown image itself and is never replaced by the caption.

### Tables {#table}

An attribute line follows a pipe table, and the default ID is `tbl-<num>`.

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

An attribute line follows a `$$` block, and the default ID is `eq-<num>`. The
number and caption sit to the right of the formula on wider screens. On narrow
screens, they move below it and wrap. A wide formula can scroll horizontally.
Short captions keep the equation easy to scan.

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

The native form depends on the site enabling Goldmark passthrough. Without it,
use the `eq` shortcode below, which goes through local server-side KaTeX.

### Examples {#example}

A code fence with `num=` and `caption=` is a numbered example, and the default
ID is `eg-<num>`. An `#id` on the fence names the enclosing `<figure>`, which
is the reference target. It does not name the code block. The caption is
required. A caption without a number is ignored. A number without a caption
is dropped with a warning. Review the warning and rendered fallback before publication. A numbered
example renders in one frame. The caption is the frame header. The body sits
inside it. If the body is one code block, it uses the frame border without
a second border.

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

The four shortcodes `fig`, `tbl`, `eq` and `eg` render a `<figure>` identical to
the native form, register into the same target table, and sort by source
position. Use them when the native form is insufficient. Examples include figures with
several images or other Markdown, several tables under one number, sites without
passthrough, and examples with several fences and prose. A single
numbered image can use `link` in its native attribute line. It does not need
`fig` just for an outbound link.

`fig` takes `src=` (it also accepts inner Markdown content, and the two are
mutually exclusive) and additionally supports `link`, `alt`, `width`, `height`,
`class`, and the migration alias `title`:

```markdown {title="Source"}
{{</* fig num="2-2" src="/images/docsy.webp" alt="The default Docsy shell"
    caption="OINK's upstream: the Docsy content model is still underneath." width="600" height="300" /*/>}}
```

{{< fig num="2-2" src="/images/docsy.webp" alt="The default Docsy shell" caption="OINK's upstream: the Docsy content model is still underneath." width="600" height="300" />}}

`tbl` wraps the label, the table, the caption and the anchor in one semantic
figure:

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

`eq` hands its content to local server-side KaTeX, so it does not depend on
passthrough:

```markdown {title="Source"}
{{</* eq num="2-2" caption="Connection pool saturation." */>}}U = \frac{\lambda}{\mu \cdot c}{{</* /eq */>}}
```

{{< eq num="2-2" caption="Connection pool saturation." >}}U = \frac{\lambda}{\mu \cdot c}{{< /eq >}}

Use a bare `{{</* eq */>}}` without parameters for unnumbered display math.
It registers no target. `xref` cannot reference it. It does not appear in the
equation index.

`eg` is a wrapping shortcode whose body renders under the page's Markdown
policy, usually holding one or more fences:

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

IDs must be unique within a page, and within one kind a number maps to exactly
one ID. A duplicate warns and keeps the first registration. Review the warning and rendered fallback before publication. The warning names the first registration's line.

> [!IMPORTANT] Footnotes cannot appear in a shortcode body
> Hugo renders each shortcode body as a separate Goldmark document. Footnotes
> belong to the page. A `[^label]` inside the body of `tbl`, `eg`, `fig`, `card`, `tab`,
> `field` or `include` warns, naming the file, line, and label. Review the warning and rendered fallback before publication.
> With the definition on the page, the reference would print literally as
> `[^label]`. With the definition in the body, it would build a second footnote
> list. Its `fn:N` IDs would collide with the page's IDs. Neither belongs in
> published output.
>
> If a table or code block needs footnotes, use the native form. A table,
> image, or fence with `{num=… caption=…}` keeps its content in the page
> document. Its footnotes then use normal numbering, links, and backlinks.
> The rendered figure is the same either way, so this is usually a one-line
> change. Text that resembles a footnote in code remains unchanged. This includes a
> `[^0-9]` character class in a listing or a code span.

## Cross-references {#xref}

A target on the same page can be reached with a plain Markdown link:
[Table 2-1](#tbl-2-1) points at the isolation table above. You must write the
label and number manually. If you change a number, you must find its references
yourself.

`xref` combines the label, number, and anchor. It works across pages and
languages:

```markdown {title="Source"}
See {{</* xref fig="2-2" /*/>}} and {{</* xref eg="2-1" /*/>}};
with an explicit anchor: {{</* xref fig="2-1" anchor="book-release-note" /*/>}}.
```

See {{< xref fig="2-2" />}} and {{< xref eg="2-1" />}};
with an explicit anchor: {{< xref fig="2-1" anchor="book-release-note" />}}.

The rules:

- At most one kind key (`fig`, `tbl`, `eq`, `eg`). The kind supplies the localized label (Figure / Table / Equation / Example) and derives the default anchor `<kind>-<num>`.
- `anchor=` overrides the derived anchor, for a target that wrote an explicit `#id`.
- `page=` references another page through Hugo's page lookup in the current language, so the source never hard-codes a `/zh/` prefix.
- Without a kind, both `anchor=` and inner link text are required: `{{</* xref page="../ch01/install" anchor="sync-replication" */>}}synchronous replication{{</* /xref */>}}`.
- A reference may precede its target. Nothing reads the registry at render time. Forward references are valid.

A plain cross-page Markdown link is still a site URL inside the whole-book
print. A reference that must also jump within the aggregate document is written
as an `xref`.

## Indexes: contents and lists of figures {#indexes}

Five index shortcodes walk the same book tree, triggering descendant content and
aggregating what it registered. They usually sit on the book home
(`_index.md`) or on a dedicated "list of figures" page.

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

These five appear here only as source. They start at the current page's
navigation root and process its descendants. In an ordinary documentation tree,
one would list the whole docs tree as a book. For the real effect, read
[Write Beautiful Docs](/book/) and inspect its
[`content/book/_index.md`](https://github.com/pgsty/oink.pgsty.com/blob/main/content/book/_index.md)
source.

- `book-toc` takes a `depth` of 1 to 3: 1 lists chapters, 2 adds nested sections, 3 also projects each page's heading tree. `drafts=false` filters `book_status: draft` rows out of this generated list only, and does not affect publication.
- `book-figures`, `book-tables`, `book-equations` and `book-examples` take no parameters. Each lists one kind, with entries like "Figure 2-1 — caption" linked to the stable ID.
- In whole-book print, all of these links become in-document fragments.

## Sequential reading and drafts {#reading}

The pager is on by default for `docs`, `book`, and `blog`. It uses a pre-order
walk of the sidebar tree. The section index comes first, followed by its
children in `weight` order. Turn a whole type off with `params.ui.pager_types`, and a
single page off with `pager: false`.

```yaml {title="hugo.yml"}
params:
  ui:
    pager_types: [docs, book]
```

Entries hidden with `toc_hide`, `manual_link` link-only placeholders and
`sidebar_divider` rows never become pager destinations.

Besides the "draft" label in the sidebar, a draft chapter can carry a banner
above its body:

```yaml {title="hugo.yml"}
params:
  ui:
    book_draft_banner: true
```

The banner appears only on pages that are both `type: book` and
`book_status: draft`, and its wording comes from the localization key
`book_draft_notice`.

## Printing the whole book {#print}

Once the book root has the `print` output, it generates a cover, a local table
of contents, the root page's body and every descendant chapter in visible
reading order, all inside one HTML document. Pages with `no_print: true`,
link-only nodes, divider rows and hidden placeholders never become chapters.

Inside the aggregate, the IDs of numbered components are preserved byte for
byte. Markdown heading and footnote IDs within a page are prefixed with their
source page to avoid collisions when several chapters share an anchor such as
`summary` or start with `fn:1`. Generated links are rewritten to match. A
page rendered alone as Print keeps the same page-local IDs as ordinary HTML.
Only a multi-page section or whole-Book aggregate adds the namespace.

The output is print-oriented HTML. An opt-in `BookManifest` output records that
same reading order as JSON, and the theme ships `bin/book-epub.py` and
`bin/book-pdf.py`, which turn the manifest and the print HTML into EPUB and
PDF.

The switches themselves, and per-chapter print, are covered in
[Print](/docs/customize/print/).

## Migrating an existing manuscript {#migrate}

An existing manuscript usually expresses figure and table numbering with the
site's own `figure` shortcode, bold pseudo-captions, and bare links to `#fig_*`.
The theme repository ships a migration script that rewrites those legacy forms
into `fig`, `tbl` and `xref` while preserving the public anchors already
published. Pin the site to a released OINK version that includes the Book
components first, then migrate the content.

```bash {title="Dry run: diff and report only, no files changed"}
python3 ~/pgsty/oink/bin/migrations/book_figures.py \
  --profile tpme \
  --root /path/to/your-book \
  --report /tmp/book-migrate.json > /tmp/book-migrate.diff
```

Four profiles cover the legacy conventions of three real manuscripts (DDIA
contributes one each for v1 and v2), and each recognizes only the forms actually
observed in them:

| `--profile` | Legacy form it recognizes |
| --- | --- |
| `tpme` | A pseudo-h6 caption beside an image, a caption beside a table, and bare `/en/...#fragment` links |
| `ddia-v2` | The site's own `figure` shortcode, classified by number into figure / table / code example |
| `ddia-v1` | A bare image with an adjacent bold numbered caption, with the ID derived from the image filename |
| `pg-internal` | A bold or italic "Figure N" caption in Chinese or English next to an image, and a numbered table caption next to a table |

| Option | What it does |
| --- | --- |
| `--profile` | Required; one of the four values above |
| `--root` | Required; the consuming repository's root |
| `--path` | Restricts to a file or directory under `--root`; repeatable. The default scans the whole content tree |
| `--write` | Applies the rewrite. The default is a dry run that writes nothing |
| `--no-diff` | Suppresses the diff while keeping the summary and the report |
| `--report` | Writes the machine-readable JSON report |
{.fields}

The diff goes to standard output, the summary to standard error, and the report
carries `files_scanned`, `files_changed`, `counts`, `skipped` and `idempotent`.
The script rewrites only targets it can identify uniquely. If the number is
unclear, the caption is not unique, or the marker form is unrecognized, it
preserves the text. It records the item in `skipped` for human review. Bold text, inline
code and formulas inside a legacy caption degrade to plain text, because a Book
caption is plain text by contract.

After reviewing the diff, apply it on a dedicated branch and run a second pass
to confirm idempotency:

```bash {title="Apply, then verify idempotency"}
python3 ~/pgsty/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --write \
  --report /tmp/book-migrate-written.json

python3 ~/pgsty/oink/bin/migrations/book_figures.py \
  --profile tpme --root /path/to/your-book --no-diff \
  --report /tmp/book-migrate-second.json
```

The second report should show `files_changed: 0`, empty `counts`, and
`idempotent: true`. The script signals idempotency with exit code 0.

The profiles recognize only the legacy forms actually observed in those three
manuscripts. Where a manuscript's conventions fall outside the four, the script
does not apply and the rewrite is manual, following
[Numbering: the native form](#numbering-native). The theme repository's
`bin/check-book-migrations.py` covers all four profiles with a dry-run and an
idempotency check.

## Verify {#verify}

1. Build with visible diagnostics: `hugo --printPathWarnings`. A malformed number, a duplicate ID and a missing caption all produce warnings that need review.
2. The page should show a localized label such as "Figure 2-1", clickable `xref` links, and anchors that land correctly.
3. Compare the chapter order across all four places: sidebar, pager, `book-toc` and whole-book print.
4. Check the Markdown output: `curl -s http://localhost:1313/handbook/ch02/index.md`. The shortcode form should degrade to `**Figure 2-2.** caption` plus the original body, and the native form should keep its source block and attribute line as they are.
5. Run the anchor check from the theme repository against the build output:

```bash
python3 ~/pgsty/oink/bin/check-book.py --site-public public
```

It verifies that every reference's target anchor exists, that kind and number
agree, that page-local IDs are unique, and that a numbered image has
alternative text appropriate for its caption.

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

- There is no automatic numbering. Assign chapter, figure, and table numbers manually. Only an explicit edit changes a number. A build does not change it.
- The attribute line must touch its block, with no blank line between. If a tool such as Prettier moves an attribute line, it fails silently. The figure becomes a plain image.
- `book_kind` and `book_part` are metadata keys the contract acknowledges but the current templates do not render. The ones with a visible effect are `book_number` and `book_status`.
- The index shortcodes trigger descendant content rendering, which noticeably lengthens the build on a very large tree. The same reason is why whole-book `print` has to be requested explicitly.
- A footnote reference cannot appear in a shortcode body. It warns and identifies the native form to use instead. Review the warning and rendered fallback before publication. See [Numbering: the shortcode form](#numbering-shortcodes).
- Packaging requires explicit selection and runs outside the build. `BookManifest` plus `bin/book-epub.py` / `bin/book-pdf.py` produce EPUB and PDF. Hugo alone emits neither file. Typeset pagination, font embedding, and index compilation remain outside the contract.

## Related {#related}

- [Organizing content](/docs/write/organize/) — how the tree becomes the sidebar and the reading order
- [Images](/docs/components/image/) — captions, sizing, zoom and image processing
- [Tables](/docs/components/table/) — table attribute lines and full-width tables
- [Math](/docs/components/math/) — KaTeX and passthrough configuration
- [Print](/docs/customize/print/) — per-chapter and whole-book print
