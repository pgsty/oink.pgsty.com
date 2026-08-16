---
title: 字体预设
linkTitle: 字体预设
weight: 10
description: 用语义化字体角色换字体，不必复制主题的组件选择器。
---

OINK 把字体选择收敛到七个语义化 CSS 自定义属性之后。站点覆盖这些角色即可换字体，不需要知道主题内部用了哪些选择器。

整套机制由 Hugo 在构建期编译进同一份静态样式表：**不引入 JavaScript、不请求远程字体服务、不需要运行时预设加载器**。

## 两个内置预设 {#presets}

```yaml {title="hugo.yaml"}
params:
  ui:
    typography:
      preset: technical # technical | system
```

| 预设        | 效果                                                                        |
| ----------- | --------------------------------------------------------------------------- |
| `technical` | 默认值。保留 Chakra Petch 与 IBM Plex Mono 的工程观感，字体文件全部本地打包 |
| `system`    | 展示、元信息、打印与等宽角色改用平台字体栈，**不请求任何 OINK 品牌字体**    |

选中的值会输出到 `<html>` 的 `data-td-typography`
属性上。**无效取值直接让构建失败**，而不是静默改变站点外观。

> [!NOTE] `system`
> 预设下，OINK 的品牌字体文件仍然是主题的静态资源，只是浏览器在默认配置下不会去请求它们。

## 七个语义角色 {#roles}

{{< fields >}} {{< field name="--td-ui-font-family" type="CSS 属性" >}}
导航、控件与界面外壳。默认继承 `--bs-body-font-family`。 {{< /field >}}
{{< field name="--td-body-font-family" type="CSS 属性" >}}
文章与博客正文。默认继承 UI 角色。 {{< /field >}}
{{< field name="--td-heading-font-family" type="CSS 属性" >}} 内容标题。默认取
`$headings-font-family`，未设置时回落到正文角色。 {{< /field >}}
{{< field name="--td-code-font-family" type="CSS 属性" >}}
代码与终端内容。默认取 `$font-family-code`。 {{< /field >}}
{{< field name="--td-display-font-family" type="CSS 属性" >}}
文字商标与展示型标题。默认 Chakra Petch，然后回落到 UI 角色。 {{< /field >}}
{{< field name="--td-meta-font-family" type="CSS 属性" >}}
技术标签与元信息。默认 IBM Plex Mono，然后回落到代码角色。 {{< /field >}}
{{< field name="--td-print-font-family" type="CSS 属性" >}}
仅用于打印输出的正文。 {{< /field >}} {{< /fields >}}

主题组件只消费这些角色或组件级别名（例如
`--td-asciinema-font-family`），**不会直接写死字体名**。依赖方向始终是：

```text {copy=false}
Bootstrap 基础变量  →  OINK 语义角色  →  组件别名
```

反向引用是禁止的——Bootstrap 的自定义属性不会引用 OINK 的属性，这样依赖图保持单向，不会产生自定义属性循环。

## 使用站点自己的字体 {#site-owned-fonts}

把本地 `.woff2` 放到站点的 `static/webfonts/` 下，在 `_styles_project.scss`
里声明字体并覆盖需要的角色。Hugo会在主题样式之后加载这个文件：

```scss {title="assets/scss/_styles_project.scss"}
@font-face {
  font-family: 'My Sans';
  font-display: swap;
  font-style: normal;
  font-weight: 400 800;
  src: url('../webfonts/my-sans-variable.woff2') format('woff2');
}

:root {
  --td-ui-font-family: 'My Sans', 'Noto Sans SC', sans-serif;
  --td-body-font-family: var(--td-ui-font-family);
  --td-heading-font-family: var(--td-ui-font-family);
  --td-display-font-family: var(--td-heading-font-family);
}
```

> [!IMPORTANT] 站点内容可能包含中文时，等宽字体必须写明 CJK 回退，否则中文会掉进浏览器的默认字体，在代码块里和西文字符宽度不一致：
>
> ```scss
> :root {
>   --td-code-font-family:
>     'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
> }
> ```

**远程 URL 和任意 CSS 不能通过 YAML 注入。**
字体文件和样式表始终是本地的、可审查的构建输入。

## 按内容类型分别设置 {#per-content-typography}

角色是正常继承的，所以给某一类内容单独换字体不需要新增全局预设，也不用复制组件选择器：

```scss {title="assets/scss/_styles_project.scss"}
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

## 与旧配置的兼容 {#compatibility}

已有的 Sass 定制仍然是这套系统的第一输入。OINK 复用既有变量而不是另起一套：

| 既有变量                                        | OINK 的解读                                     |
| ----------------------------------------------- | ----------------------------------------------- |
| `$font-family-base` / `$font-family-sans-serif` | Bootstrap 正文字体，进而作为 UI 与正文角色      |
| `$headings-font-family`                         | 显式配置时作为标题角色                          |
| `$font-family-monospace`                        | Bootstrap 等宽基线                              |
| `$font-family-code`                             | 代码角色，以及普通 `code`、`pre`、`kbd`、`samp` |
| `$td-google-font-name`                          | 默认打印字体                                    |

这些覆盖写在
`assets/scss/_variables_project.scss`，与 Docsy 一致，会被编译进角色默认值。

`_styles_project.scss`
里的自定义属性覆盖在更晚的层级生效，因此仍可用于上下文相关的定制。项目设置优先于预设默认值是有意为之。

## 范围说明 {#scope}

这是设计令牌工作的第一片：只覆盖字体。语义颜色、表面、圆角、密度和外观预设不在其中——它们应该在各自的 Bootstrap与壳层令牌契约有了对应的回归覆盖之后再单独引入。

## 下一步 {#next-steps}

- [样式覆盖](../styling/)：配色与布局
- [进阶定制](../customize/)：模板覆盖
