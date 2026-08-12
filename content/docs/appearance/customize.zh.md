---
title: 高级定制
weight: 30
description:
  通过兼容 Docsy 的 Sass 输入与 OINK 语义 token 定制字体和局部视觉样式。
cSpell:ignore: Cascadia Chakra Petch PingFang Sarasa
---

OINK 提供一套小而清晰的分层定制接口，站点不需要复制组件选择器，也不需要分叉主题。全部样式仍由 Hugo
Extended 与 Hugo
Pipes 处理，不引入 Node.js、npm、PostCSS、远程字体服务或浏览器端 preset 加载器。

本文记录正式支持的扩展点，以及第一组公开的语义 token：字体系统。颜色模式、代码高亮、导航栏与模板定制示例，参见[外观与风格](/zh/docs/appearance/styling/)。

## 选择正确的定制层 {#choose-the-right-layer}

优先使用能够表达需求的最高层接口：

| 层级                | 扩展点                                         | 适用场景                                     |
| ------------------- | ---------------------------------------------- | -------------------------------------------- |
| Hugo 配置           | `hugo.yaml` 或页面 Front Matter                | 字体 preset、页面宽度等正式支持的选项        |
| Sass 基础层         | `assets/scss/_variables_project.scss`          | 影响整个样式包的 Docsy 与 Bootstrap 既有变量 |
| Bootstrap 后置 Sass | `assets/scss/_variables_project_after_bs.scss` | 少数依赖 Bootstrap 变量或 map 的覆盖项       |
| 语义 CSS            | `assets/scss/_styles_project.scss`             | 语义角色、某类内容、某组页面或单个组件       |
| Hugo 模板           | `layouts/` 与 Partial hook                     | CSS 无法表达的结构或 DOM 修改                |

先尝试配置项或既有 Sass 变量；需要缩小作用域时，再使用语义 CSS 属性。只有找不到合适 token 时才覆盖选择器，只有结构本身必须变化时才覆盖模板。

站点品牌定制不要直接修改主题、Bootstrap、Font
Awesome 或主题字体目录中的文件。这些修改难以审计，也会在升级时丢失或产生冲突。

## CSS 接口如何分层 {#how-the-css-contract-is-layered}

OINK 保持单向依赖：

```text
Docsy / Bootstrap Sass 变量
              ↓
Bootstrap --bs-* 属性
              ↓
OINK 语义 --td-* 角色
              ↓
组件别名与选择器
```

Docsy 与 Bootstrap 的既有变量继续充当基础层。只有多个组件需要共享同一种含义时，OINK 才增加语义角色，例如“文章正文”或“技术元信息”。Bootstrap 属性不会反向引用 OINK 角色，因此不会形成 CSS 自定义属性循环。

接口稳定性有明确边界：

- 在可行范围内，既有 Docsy 与 Bootstrap 变量继续作为兼容输入；
- 下文列出的字体角色是面向站点定制的公开 API；
- `--td-asciinema-font-family` 这类已记录的组件别名只承诺更窄的组件级用途；
- 未记录的 `--td-shell-*` 与选择器局部属性属于实现细节。不能因为某个属性以
  `--td-*` 开头，就默认它是公共 API。

## 字体 preset {#typography-presets}

在 `hugo.yaml` 中选择全站内置 preset：

```yaml
params:
  ui:
    typography:
      preset: technical # technical | system
```

| Preset      | 效果                                                                          | 字体请求                                                |
| ----------- | ----------------------------------------------------------------------------- | ------------------------------------------------------- |
| `technical` | 默认 OINK 风格，包括 Chakra Petch 展示文字与 IBM Plex Mono 技术文字           | 只使用主题本地文件                                      |
| `system`    | 使用操作系统 sans 与 monospace 字体栈，适合作为中性基础，也能缩减文本字体请求 | 除非项目 CSS 主动引用，否则不会请求 OINK 自带的文本字体 |

OINK 会把最终取值写入 `<html>` 元素的 `data-td-typography`
属性。无效值会让 Hugo 构建失败，而不是静默回退。这是站点构建时选择，不是依赖 JavaScript 的读者偏好设置。

Preset 只提供默认值，项目 Sass 与 CSS 始终拥有最终控制权。例如，站点即使选择了
`system`，只要项目样式明确引用 IBM Plex Mono，浏览器仍会加载它。

## 公开字体角色 {#public-font-roles}

组件只消费语义角色，不直接指定品牌字体：

| CSS 属性                   | 控制范围                                | 默认来源                                          |
| -------------------------- | --------------------------------------- | ------------------------------------------------- |
| `--td-ui-font-family`      | 导航、控件、搜索与通用界面外壳          | Bootstrap 正文字体                                |
| `--td-body-font-family`    | 文档与博客正文                          | UI 角色                                           |
| `--td-heading-font-family` | 文章标题                                | `$headings-font-family`，未设置时使用正文角色     |
| `--td-code-font-family`    | `code`、`pre`、`kbd`、`samp` 与终端内容 | `$font-family-code`                               |
| `--td-display-font-family` | 字标与展示型标题                        | Chakra Petch，后备为 UI 角色                      |
| `--td-meta-font-family`    | 技术标签与元信息                        | IBM Plex Mono，后备为代码角色                     |
| `--td-print-font-family`   | 打印正文及默认打印标题                  | `$td-google-font-name`，后备为 Bootstrap 正文字体 |

大多数情况下应修改较宽泛的语义角色。例如 Asciinema 使用
`--td-asciinema-font-family`，其默认值是
`--td-code-font-family`。只有终端回放确实需要与其他代码不同的字体时，才单独覆盖组件别名。

## 复用 Docsy 与 Bootstrap Sass 变量 {#reuse-docsy-and-bootstrap-sass-variables}

OINK 直接解释既有名字，不再增加一组平行的 Sass 开关：

| 既有变量                                                          | OINK 的解释方式                            |
| ----------------------------------------------------------------- | ------------------------------------------ |
| `$td-fonts-serif`、`$font-family-sans-serif`、`$font-family-base` | Bootstrap 正文字体，继而成为 UI 与正文角色 |
| `$headings-font-family`                                           | 明确设置时成为标题角色                     |
| `$td-font-family-monospace`、`$font-family-monospace`             | Bootstrap 等宽字体基础                     |
| `$font-family-code`                                               | 代码角色与普通代码元素                     |
| `$td-google-font-name`                                            | 默认打印字体                               |

与 Docsy 一样，把这些编译期覆盖项写入 `_variables_project.scss`：

```scss
// assets/scss/_variables_project.scss
$font-family-sans-serif: 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
$headings-font-family: $font-family-sans-serif;
$font-family-monospace:
  'Sarasa Mono SC', 'Cascadia Code', ui-monospace, monospace;
$font-family-code: $font-family-monospace;
```

这会修改编译后的默认值。同一站点的不同区域需要不同风格时，请在
`_styles_project.scss` 中覆盖语义 CSS 属性。

## 添加站点自有字体 {#add-a-site-owned-font}

把经过审查的 `.woff2` 文件放在使用方站点的 `static/webfonts/` 目录中，再到
`_styles_project.scss` 声明并分配字体：

```scss
// assets/scss/_styles_project.scss
@font-face {
  font-family: 'My Sans';
  font-display: swap;
  font-style: normal;
  font-weight: 400 800;
  src: url('../webfonts/my-sans-variable.woff2') format('woff2');
}

:root {
  --td-ui-font-family:
    'My Sans', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
  --td-body-font-family: var(--td-ui-font-family);
  --td-heading-font-family: var(--td-ui-font-family);
  --td-display-font-family: var(--td-heading-font-family);
}
```

内容可能包含中文时，应为代码字体明确提供 CJK 后备：

```scss
:root {
  --td-code-font-family:
    'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
}
```

应对子集进行裁剪并自行托管字体，包含站点需要的全部文字，设置
`font-display: swap`，并记录许可证。OINK 有意不允许通过 YAML 注入任意字体 URL 或 CSS 字符串。

## 按内容类型限定样式 {#scope-styles-by-content-type}

语义属性可以正常继承，因此内容专属风格不需要第二份样式表，也不需要复制组件规则。博客页面已经带有
`td-blog` body class：

```scss
// assets/scss/_styles_project.scss
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

OINK 还会为 Swagger/OpenAPI 页面添加
`td-swagger`。如果是项目自己定义的页面类型，可在 Front Matter 或 section
cascade 中设置 `body_class`：

```yaml
---
body_class: code-reference
page_width: wide
---
```

```scss
body.code-reference {
  --td-meta-font-family: var(--td-code-font-family);
}
```

请使用站点自有且具有语义的 class 名称，绝不能向 `body_class` 写入不可信内容。

## 让布局与字体彼此独立 {#keep-layout-and-typography-independent}

字体、文章宽度与组件结构是三个独立维度。OINK 现有的 `page_width` 参数支持
`normal`、`wide` 与 `full`，既可全局设置，也可在页面 Front Matter 中覆盖：

```yaml
params:
  page_width: normal
```

这样无需制造一个包办一切的 preset，就能组合出不同使用体验：

| 使用场景         | 推荐组合                                                          |
| ---------------- | ----------------------------------------------------------------- |
| 标准文档         | `page_width: normal` 加全站字体 preset                            |
| 全宽画布         | `page_width: full`，必要时再加页面专属 `body_class`               |
| 博客或文章阅读   | 在 `td-blog` 中覆盖正文与标题角色，通常保持 `normal` 宽度         |
| 代码密集型参考页 | 用项目 body class 调整代码与元信息角色                            |
| OpenAPI 参考页   | 使用 Swagger layout 与 `td-swagger`，渲染器专属结构留在对应布局中 |

将这些关注点分开，可以避免 preset 数量膨胀，后续 editorial、API 或代码风格也能复用同一组语义角色。

## 颜色与组件 surface {#colors-and-component-surfaces}

编译期配色应使用 `$primary`、`$secondary`、`$danger`
等 Bootstrap 变量；运行时则优先使用
`--bs-body-bg`、`--bs-body-color`、`--bs-link-color` 与 `--bs-border-color`
等 Bootstrap 语义属性。

OINK 还记录了一小组品牌层属性，包括
`--td-brand-elev`、`--td-brand-silk`、`--td-brand-copper`、`--td-brand-header-bg`
与
`--td-brand-mark-gradient`。浅色与深色值应成对覆盖，完整示例参见[外观与风格](/zh/docs/appearance/styling/#colors-and-color-themes)。

不要仅仅因为某个 shell 或组件 token 的名字看起来顺手，就在全局覆盖它。应先修改它的 Bootstrap 来源或已记录的语义来源；只有该组件确实需要独立变化时，才使用组件别名。

## 验收清单 {#review-checklist}

发布定制样式前：

1. 使用当前支持的最旧与最新 Hugo Extended 版本构建；
2. 检查浅色、深色、打印、forced-colors 与 reduced-motion；
3. 检查涉及范围内的文档、博客、代码、搜索与 OpenAPI 页面；
4. 检查窄屏和宽屏，以及较长的 CJK 文本与代码行；
5. 确认字体请求全部来自本地，加载有意、许可证清楚，而且体积没有不必要的膨胀；
6. 优先使用一次语义覆盖，避免重复堆叠选择器补丁。

这些约束共同守住 OINK 的核心前提：定制之后，站点仍然只依赖一个 Hugo 二进制文件，不增加额外构建或运行时依赖。
