---
title: Diagram layout
---

> [!NOTE]- Reveal diagram
>
> ```infographic {height="320px" full=true}
> infographic list-row-simple-horizontal-arrow
> data
>   title Hidden chart
>   items
>     - label Source
>     - label Preview
>     - label Publish
> ```

> [!NOTE]- Reveal mind map
>
> ```markmap
> # Hidden map
> ## Source
> - Markdown
> ## Output
> - HTML
> - Print
> ```

```markmap

---
markmap:
  initialExpandLevel: 1
  maxWidth: 120
---
# Blank line root with a long label
## Child
### Leaf

```

```markmap

    ---
    markmap:
      initialExpandLevel: 1
      maxWidth: 120
    ---
    # Indented root with a long label
    ## Child
    ### Leaf

```

```infographic {data-theme-case="light"}
infographic list-row-simple-horizontal-arrow
theme
  type light
  palette #123456 #fedcba
data
  title Authored theme light
  items
    - label Alpha
    - label Beta
```

```infographic {data-theme-case="dark"}
infographic list-row-simple-horizontal-arrow
theme
  type dark
  palette #123456 #fedcba
data
  title Authored theme dark
  items
    - label Alpha
    - label Beta
```

```infographic {data-theme-case="hand-drawn"}
infographic list-row-simple-horizontal-arrow
theme
  type hand-drawn
  palette #123456 #fedcba
data
  title Authored theme hand-drawn
  items
    - label Alpha
    - label Beta
```

```infographic {data-theme-case="custom"}
infographic list-row-simple-horizontal-arrow
theme
  type light
  colorBg #fff2cc
  palette #123456 #fedcba
data
  title Authored theme custom
  items
    - label Alpha
    - label Beta
```
