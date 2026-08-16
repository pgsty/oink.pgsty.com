---
title: Tables
description:
  Choose a table kind — reference list, compatibility matrix, captioned,
  numbered, tabbed, or full-width — with one attribute line under a normal
  Markdown table.
weight: 45
---

Every table on an OINK site is an ordinary GFM pipe table. The theme's table
render hook wraps it in a scrollable region so a wide table never widens the
page, and an attribute line on the line after the table selects a table kind or
adds a caption. Site CSS classes pass through untouched.

## Default table {#default-table}

<!-- prettier-ignore-start -->

```markdown
| Column A | Column B | Column C |
| -------- | -------- | -------: |
| a1       | b1       |        1 |
```

<!-- prettier-ignore-end -->

| Column A | Column B | Column C |
| -------- | -------- | -------: |
| a1       | b1       |        1 |
| a2       | b2       |       22 |

Alignment comes from the delimiter row as usual. Header cells are
`th scope="col"` and the wrapper is a keyboard-focusable scroll region.

## Reference list `{.fields}` {#fields}

Turns a table into a definition list: first column name, last column
description, middle columns metadata. See [Fields](/docs/components/fields/).

<!-- prettier-ignore-start -->

| Function   | Returns   | Description                        |
| ---------- | --------- | ---------------------------------- |
| `now()`    | timestamp | The current transaction timestamp  |
| `random()` | float     | A random number in `[0, 1)`         |
{.fields}

<!-- prettier-ignore-end -->

## Matrix `{.matrix}` {#matrix}

A compatibility or feature matrix: the first column becomes a row header
(`th scope="row"`), the header row and first column stay sticky while the region
scrolls, and the remaining cells are centered unless the delimiter row says
otherwise. Write ✅ and ❌ yourself; nothing is parsed.

<!-- prettier-ignore-start -->

```markdown
| OS / PG      | PG18 | PG17 | PG16 | PG15 |
| ------------ | :--: | :--: | :--: | :--: |
| EL 9         |  ✅  |  ✅  |  ✅  |  ✅  |
| Debian 12    |  ✅  |  ✅  |  ✅  |  ✅  |
| Ubuntu 24.04 |  ✅  |  ✅  |  ✅  |  ❌  |
{.matrix}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

| OS / PG      | PG18 | PG17 | PG16 | PG15 |
| ------------ | :--: | :--: | :--: | :--: |
| EL 9         |  ✅  |  ✅  |  ✅  |  ✅  |
| Debian 12    |  ✅  |  ✅  |  ✅  |  ✅  |
| Ubuntu 24.04 |  ✅  |  ✅  |  ✅  |  ❌  |
{.matrix}

<!-- prettier-ignore-end -->

## Caption `{caption="…"}` {#caption}

Adds a visible `caption` element without numbering the table.

<!-- prettier-ignore-start -->

| Item    | Value      |
| ------- | ---------- |
| Version | 0.5.0      |
| License | Apache-2.0 |
{caption="Release facts"}

<!-- prettier-ignore-end -->

## Numbered table `{#id num="…" caption="…"}` {#numbered}

A Book table: the attribute line registers a numbered target with a localized
label that `xref` can reference. The `id` defaults to `tbl-<num>`.

<!-- prettier-ignore-start -->

```markdown
| Isolation                                                           | Dirty read | Lost update |
| ------------------------------------------------------------------- | ---------- | ----------- |
| Read committed                                                      | no         | yes         |
| Serializable                                                        | no         | no          |
{#tab_iso num="9-1" caption="Anomalies allowed by isolation level"}

See {{</* xref tbl="9-1" anchor="tab_iso" */>}}.
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

| Isolation      | Dirty read | Lost update |
| -------------- | ---------- | ----------- |
| Read committed | no         | yes         |
| Serializable   | no         | no          |
{#tab_iso num="9-1" caption="Anomalies allowed by isolation level"}

<!-- prettier-ignore-end -->

See {{< xref tbl="9-1" anchor="tab_iso" />}} and
[Book publishing](/docs/scenarios/book/) for the numbered-media contract.

## Tabbed tables `{tab="…"}` {#tabs}

Consecutive tables with a `tab` attribute become one tab set, exactly like
[adjacent code fences](/docs/components/code-blocks/#tabs): `group` on the first
table opts into hash, sync, and persistence; every table of a grouped run then
needs a `value`.

<!-- prettier-ignore-start -->

| Parameter         | Value |
| ----------------- | ----- |
| `max_connections` | 100   |
{tab="PG 17" group="pgver" value="pg17"}

| Parameter         | Value |
| ----------------- | ----- |
| `max_connections` | 200   |
{tab="PG 16" value="pg16"}

<!-- prettier-ignore-end -->

## Full width `{.full-width}` {#full-width}

Lets a wide table use the whole article canvas instead of the prose measure.

<!-- prettier-ignore-start -->

| A   | B   | C   | D   | E   | F   | G   | H   |
| --- | --- | --- | --- | --- | --- | --- | --- |
| a   | b   | c   | d   | e   | f   | g   | h   |
{.full-width}

<!-- prettier-ignore-end -->

## Rules {#rules}

- `.fields` cannot be combined with `.matrix`, `.full-width`, or `num`; `num`
  and `tab` are mutually exclusive.
- Marker classes (`fields`, `matrix`, `full-width`) are fixed vocabulary; any
  other class passes through to site CSS.
- `data-*` and `aria-*` attributes pass through; `style`, event handlers, and
  unknown attributes fail the build.
- Print removes the scroll wrapper; Markdown output keeps the source table with
  its attribute line.
