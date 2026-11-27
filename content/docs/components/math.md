---
title: Math
linkTitle: Math
description: Use KaTeX for inline and display mathematics at build time. Readers download no script.
weight: 100
search_keywords: [Math, KaTeX, LaTeX, TeX, passthrough, chem, mhchem, chemistry, numbered equation, eq]
---

Write formulas in TeX and Hugo turns them into HTML and MathML with KaTeX while
it builds the site, so readers download one local stylesheet and no script,
and nothing is sent to a remote math service. Use `\(…\)` inside a sentence,
`$$…$$` or `\[…\]` for a formula on its own line, and the `math` and `chem`
fences where you cannot change the site configuration. For TikZ drawings or
macro packages KaTeX does not support, use a pre-rendered
[image](/docs/components/image/).

## Site prerequisites {#config}

The `$$`, `\[…\]` and `\(…\)` delimiters work only after you enable Goldmark's
passthrough extension in your site's own configuration; Hugo does not inherit
`markup` settings from a theme, so OINK cannot do it for you. A `math: true`
key, in front matter or in `params`, does not enable anything: without this
block, `$$` stays on the page as literal text.

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true # numbered equations need the attribute line
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
```

A single `$` is deliberately left out of the inline delimiters, so a price
such as "$5" in prose is never read as the start of a formula.
[Configuration](/docs/customize/config/) describes each key. The `math` and
`chem` fences and the `eq` shortcode need none of this.

## Shortest form {#minimal}

An inline formula sits in the sentence; keep the surrounding spaces and
punctuation outside the delimiters.

```markdown {title="Source"}
The shared buffer hit ratio is \(\mathrm{hit} = \frac{H}{H + R}\), where \(H\) is `blks_hit` and \(R\) is `blks_read`.
```

The shared buffer hit ratio is \(\mathrm{hit} = \frac{H}{H + R}\), where \(H\) is `blks_hit` and \(R\) is `blks_read`.

## Display formulas {#display}

Put a formula in its own paragraph between `$$` delimiters, or `\[…\]`, to
show it larger and centered.

```markdown {title="Source"}
A B-tree with fan-out \(f\) over \(N\) keys has height:

$$
h = \left\lceil \log_{f} N \right\rceil
$$
```

A B-tree with fan-out \(f\) over \(N\) keys has height:

$$
h = \left\lceil \log_{f} N \right\rceil
$$

A formula too long for the column scrolls sideways inside it instead of
widening the page.

## The `math` fence {#math-fence}

A `math` fence is another way to write a display formula. It needs no
passthrough configuration, and GitHub shows it as an ordinary code block.

````markdown {title="Source"}
```math
N_{\text{conn}} = \lambda \cdot \bar{t}_{\text{resp}}
```
````

```math
N_{\text{conn}} = \lambda \cdot \bar{t}_{\text{resp}}
```

This is Little's law applied to a connection pool: in steady state, the
connections you need equal the arrival rate times the mean response time,
which is why a pool can be much smaller than the number of clients.

## Chemistry and units {#chem}

A `chem` fence typesets a `\ce{…}` body with KaTeX's mhchem extension, which
also handles physical units.

````markdown {title="Source"}
```chem
\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3^-}
```
````

```chem
\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3^-}
```

The [mhchem manual](https://mhchem.github.io/MathJax-mhchem/) documents the
syntax.

## Numbered equations {#numbered}

Put an attribute line under a display formula to number it. You write the
number yourself in `num`, such as `3-1` or `5.3`, because the theme does not
count; the anchor defaults to `#eq-<num>`. The number appears at the right of
the formula after a localized "Equation" label.

```markdown {title="Source"}
$$
\text{WAL}_{\text{day}} \approx \text{TPS} \times \bar{s}_{\text{record}} \times 86400
$$
{#eq-wal num="3-1" caption="Estimating daily WAL volume"}

See [Equation 3-1](#eq-wal): multiply by the retention period for the floor on archive disk size.
```

$$
\text{WAL}_{\text{day}} \approx \text{TPS} \times \bar{s}_{\text{record}} \times 86400
$$
{#eq-wal num="3-1" caption="Estimating daily WAL volume"}

See [Equation 3-1](#eq-wal): multiply by the retention period for the floor on
archive disk size.

`caption` is optional plain text, and both `#id` and `caption` need `num`. An
incomplete attribute line warns and drops the parts it cannot use; a duplicate
target warns and keeps the first. On a narrow screen a long caption wraps
inside the column.

## Cross references {#xref}

An ordinary link reaches a numbered equation on the same page, as above. To
link across pages, or to have the "Equation N" label written for you, use
`xref`:

```markdown {title="Source"}
Capacity planning starts from {{</* xref eq="3-1" anchor="eq-wal" /*/>}}.
```

Capacity planning starts from {{< xref eq="3-1" anchor="eq-wal" />}}.

`xref` may come before the equation it points to. For a book-wide list of
equations and the `book-equations` index, see
[publishing books](/docs/write/book/).

## The `eq` shortcode {#eq-shortcode}

`eq` renders with the same KaTeX engine for sites that cannot enable
passthrough, such as a migrated manuscript or a site whose `hugo.yml` you do
not control. Without parameters it is an unnumbered display formula; with
`num` it matches the attribute-line form. Where you can enable passthrough,
`$$` is shorter.

```markdown {title="Source"}
{{</* eq */>}}\sigma_{\text{idx}} = \frac{\text{rows}_{\text{matched}}}{\text{rows}_{\text{total}}}{{</* /eq */>}}

{{</* eq num="3-2" caption="Where a sequential scan and an index scan cost the same" */>}}
c_{\text{seq}} \cdot P = c_{\text{rand}} \cdot \sigma \cdot T
{{</* /eq */>}}
```

{{< eq >}}\sigma_{\text{idx}} = \frac{\text{rows}_{\text{matched}}}{\text{rows}_{\text{total}}}{{< /eq >}}

{{< eq num="3-2" caption="Where a sequential scan and an index scan cost the same" >}}
c_{\text{seq}} \cdot P = c_{\text{rand}} \cdot \sigma \cdot T
{{< /eq >}}

## Output {#outputs}

No form loads JavaScript. A page with formulas loads a local `katex.min.css`
and the WOFF2 fonts it names; a page without formulas loads neither. Print
shows formulas the same way, without scrolling. The Markdown output and RSS
keep the TeX source as written, except that an `eq` shortcode becomes
`**Equation 3-2.** caption` followed by a `$$` block.

## Parameter reference {#reference}

The four ways to write a formula:

| Spelling | Placement | Description |
| --- | --- | --- |
| `\(…\)` | inline | Needs the site's passthrough configuration; takes no attributes |
| `$$…$$` / `\[…\]` | display | Needs the site's passthrough configuration; an attribute line below it numbers it |
| ```` ```math ```` | display fence | Works without passthrough; takes no attributes |
| ```` ```chem ```` | display fence | Works without passthrough; the body is `\ce{…}` |
{.fields}

The attribute line `{…}` under a display formula:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `num` | string | — | `[0-9A-Za-z.-]+`; registers a numbered equation and shows "Equation N" at the right |
| `#id` | identifier | `eq-<num>` | `[A-Za-z][A-Za-z0-9_.:-]*`; the anchor and cross-reference target |
| `caption` | plain text | — | Caption after the number; requires `num` |
{.fields meta="type default"}

The `eq` shortcode:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `num` | string | — | As above; without it the formula is an unnumbered display formula |
| `id` | identifier | `eq-<num>` | Requires `num` |
| `caption` | plain text | — | Requires `num` |
| `class` | class list | — | Requires `num`; passed through for site CSS |
| Body | TeX | — | Required, non-empty |
{.fields meta="type default"}

Invalid TeX does not stop the build. It warns with KaTeX's error message and
the source position, and the page shows the expression as written, so search
the build log for these warnings before you publish.

## Limits {#limits}

- Only `$$` blocks and `eq` can be numbered. The `math` fence takes no
  attribute line, so switch forms when you need a number.
- The theme never counts or renumbers equations. When you reorder chapters,
  update `num` yourself.
- Inline formulas take no attributes; the attribute line applies only to
  display formulas.
- `caption` is plain text, so Markdown in it appears literally.

## Related {#related}

- [Code blocks](/docs/components/code/) — fence attributes and numbered examples
- [Images](/docs/components/image/) — figures use the same `{#id num=}` numbering
- [Publishing books](/docs/write/book/) — lists of equations and cross-page references
- [Configuration](/docs/customize/config/) — the `markup.goldmark` keys
