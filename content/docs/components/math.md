---
title: Math
linkTitle: Math
description: Use KaTeX for inline and display mathematics at build time. Readers download no script.
weight: 100
search_keywords: [Math, KaTeX, LaTeX, TeX, passthrough, chem, mhchem, chemistry, numbered equation, eq]
---

KaTeX renders mathematics to HTML + MathML at build time. Pages with formulas load one local KaTeX stylesheet.
They load no JavaScript and contact no remote mathematics service.
Use `\(…\)` for inline formulas, `$$…$$` or `\[…\]` for display formulas, or `math` and `chem` fences.
For TikZ or macro packages unsupported by KaTeX, use a pre-rendered [image](/docs/components/image/).

Validate generated formulas with Hugo Extended 0.168.0 and the bundled stylesheet.
TeX and MathML remain unchanged. No browser mathematics runtime or extra site switch is needed.

## Site prerequisites {#config}

`math` and `chem` fences need no configuration.
The `$$`, `\[…\]`, and `\(…\)` delimiters need Goldmark's passthrough extension.
Hugo does not merge theme `markup` configuration. Put this block in your site's configuration file.
This site uses:

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

[Configuration](/docs/customize/config/) defines each key. Delimiters must not conflict with prose.
A single `$` is deliberately not configured, so prices such as "$5" are never treated as mathematics.


## Shortest form {#minimal}

Put inline formulas inside sentences. Keep surrounding spaces and punctuation outside the delimiters.

```markdown {title="Source"}
The shared buffer hit ratio is \(\mathrm{hit} = \frac{H}{H + R}\), where \(H\) is `blks_hit` and \(R\) is `blks_read`.
```

The shared buffer hit ratio is \(\mathrm{hit} = \frac{H}{H + R}\), where \(H\) is `blks_hit` and \(R\) is `blks_read`.

## Display formulas {#display}

Put a formula in its own paragraph between `$$` delimiters. It displays larger and centered.
`\[…\]` has the same effect.

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

Long formulas scroll horizontally within the reading column instead of widening the layout. In print, they remain static.

## The `math` fence {#math-fence}

The `math` fence is another form for display formulas. It needs no site passthrough configuration.
GitHub displays its source as an ordinary code block.

````markdown {title="Source"}
```math
N_{\text{conn}} = \lambda \cdot \bar{t}_{\text{resp}}
```
````

```math
N_{\text{conn}} = \lambda \cdot \bar{t}_{\text{resp}}
```

This is Little's law for a connection pool. In steady state, required concurrency equals arrival rate multiplied by mean response time.
The pool is usually much smaller than the client count.

## Chemistry and units {#chem}

The `chem` fence uses KaTeX's mhchem extension with a `\ce{…}` body. This extension also typesets physical units.

````markdown {title="Source"}
```chem
\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3^-}
```
````

```chem
\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3^-}
```

For the syntax see the [mhchem manual](https://mhchem.github.io/MathJax-mhchem/).

## Numbered equations {#numbered}

An attribute line below a display formula creates a numbered equation.
`num` is an author-provided string, such as `3-1` or `5.3`. The theme never counts. `#id` defaults to `eq-<num>`.
The number appears to the right of the formula with a localized "Equation" prefix.

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

`caption` is optional plain text. `#id` and `caption` require `num`.
Incomplete or duplicate targets warn and remove unusable parts or keep the first target.
On narrow screens, long captions wrap within the reading column without widening the page.

## Cross references {#xref}

Reference numbered equations with ordinary links, as above.
For cross-page references or automatic "Equation N" labels, use `xref`:

```markdown {title="Source"}
Capacity planning starts from {{</* xref eq="3-1" anchor="eq-wal" /*/>}}.
```

Capacity planning starts from {{< xref eq="3-1" anchor="eq-wal" />}}.

`xref` may appear before its target. Forward references are allowed.
For the book-wide equation list and `book-equations` index, see [publishing books](/docs/write/book/).

## The `eq` shortcode {#eq-shortcode}

Use `eq` when your site cannot enable passthrough. It uses the same KaTeX renderer.
Without parameters, it displays an unnumbered formula. With `num`, it is equivalent to the attribute-line form.

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

This site enables passthrough, so ordinary authoring uses `$$`.
Use `eq` for migrated manuscripts or sites whose `hugo.yml` cannot be changed.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | KaTeX HTML + MathML rendered at build time; this page also loads a local `katex.min.css`, which pages without formulas never load |
| Print | Same as HTML, static, long formulas do not scroll |
| Markdown | The source as written: `$$` blocks with their attribute line, `math` / `chem` fences, `\(…\)`; the `eq` shortcode emits `**Equation 3-2.** caption` plus a `$$` block |
| RSS | The same static text as Markdown |

No form loads JavaScript.

## Parameter reference {#reference}

Four spellings:

| Spelling | Placement | Description |
| --- | --- | --- |
| `\(…\)` | inline | Governed by the site's passthrough configuration; takes no attributes |
| `$$…$$` / `\[…\]` | display | As above; may be followed by an attribute line to become numbered |
| ```` ```math ```` | display fence | Independent of passthrough; takes no attributes |
| ```` ```chem ```` | display fence | As above, with `\ce{…}` in the body |
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

Invalid TeX warns and preserves the expression in ordinary previews. The message includes KaTeX details and the source position.
Review the warning and rendered fallback before publication.

## Limits {#limits}

- The site's `markup.goldmark` passthrough extension controls whether `$$`, `\[…\]`, and `\(…\)` render.
  The theme does not read a `math: true` front matter key. Without configuration, `$$` appears literally.
  The `math` fence and `eq` work without this configuration.
- Only `$$` blocks and `eq` support numbering. The `math` fence accepts no attribute line. Use another form when you need numbers.
- Authors provide numbers. The theme neither counts nor renumbers. If you reorder chapters, edit `num`.
- Inline formulas accept no attributes. Attribute lines apply only to display formulas.
- `caption` is plain text. Markdown in captions is not parsed.

## Related {#related}

- [Code blocks](/docs/components/code/) — fence attributes and numbered examples
- [Images](/docs/components/image/) — figures use the same `{#id num=}` numbering
- [Publishing books](/docs/write/book/) — lists of equations and cross-page references
- [Configuration](/docs/customize/config/) — the `markup.goldmark` keys
