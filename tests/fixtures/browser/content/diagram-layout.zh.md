---
title: 图表布局
---

> [!NOTE]- 展开图表
>
> ```infographic {height="320px" full=true}
> infographic list-row-simple-horizontal-arrow
> data
>   title 隐藏图表
>   items
>     - label 源文
>     - label 预览
>     - label 发布
> ```

> [!NOTE]- 展开思维导图
>
> ```markmap
> # 隐藏导图
> ## 源文
> - Markdown
> ## 输出
> - HTML
> - Print
> ```

```markmap

---
markmap:
  initialExpandLevel: 1
  maxWidth: 120
---
# 开头有空行且标题很长的根节点
## 子节点
### 叶节点

```

```markmap

    ---
    markmap:
      initialExpandLevel: 1
      maxWidth: 120
    ---
    # 整体缩进且标题很长的根节点
    ## 子节点
    ### 叶节点

```

```infographic {data-theme-case="light"}
infographic list-row-simple-horizontal-arrow
theme
  type light
  palette #123456 #fedcba
data
  title 作者主题 light
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
  title 作者主题 dark
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
  title 作者主题 hand-drawn
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
  title 作者主题 custom
  items
    - label Alpha
    - label Beta
```
