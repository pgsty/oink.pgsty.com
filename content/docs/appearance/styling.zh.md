---
title: 外观与风格
weight: 60
description: 定制主题、字体、代码样式与页面布局。
---

OINK 在 Bootstrap 与 Docsy 基础上提供完整的视觉系统，并将字体、图标、样式和浏览器端代码全部本地化。使用方无需重建 Node 依赖树，就能通过设计变量和项目样式完成定制。

## 项目样式 {#project-styles}

Hugo Extended 通过 Hugo
Pipes 编译主题 SCSS。项目覆盖项会进入同一个资源包，因此生产构建可以对一份同源样式表完成压缩、指纹和完整性校验。

### 项目样式文件 {#project-style-files}

在站点的 `assets/scss/` 目录中覆盖以下文件：

| 文件                               | 用途                                    |
| ---------------------------------- | --------------------------------------- |
| `_variables_project.scss`          | 在 Bootstrap 与 OINK 默认值之前设置变量 |
| `_variables_project_after_bs.scss` | 设置依赖 Bootstrap 定义的变量或映射     |
| `_styles_project.scss`             | 在主题组件样式之后加载项目选择器        |

先从最小覆盖项开始：

```scss
// assets/scss/_variables_project.scss
$primary: #315f8f;
$secondary: #b4762e;
```

```scss
// assets/scss/_styles_project.scss
body.td-blog {
  --td-body-font-family: 'Noto Serif', 'Noto Serif SC', serif;
}
```

普通品牌定制不要直接修改纳管的 Bootstrap、Font
Awesome 或本地字体文件。主题更新会覆盖这些改动，也会模糊依赖边界。

### 高级样式定制 {#advanced-style-customization}

稳定的定制层次、字体 preset、语义字体角色与按内容限定作用域的完整说明，参见[高级定制][]。

OINK 的 SCSS 导入顺序如下：

1. Bootstrap 函数；
2. 项目变量；
3. OINK 默认值与 Bootstrap；
4. Bootstrap 之后的项目变量；
5. OINK 组件与本地品牌层；
6. 项目样式。

稳定的设计决策应通过变量或 CSS 自定义属性表达。没有合适设计变量时才覆盖选择器，而且作用域应尽量缩小到具体组件。许多颜色会随主题变化，因此必须检查浅色与深色输出。

#### :warning: 重置内部样式 {#resetting-internal-styles}

OINK 的内部 Partial 并不是公开 Sass
API。单独导入或屏蔽内部文件会让站点耦合到仓库布局和导入顺序。产品确实需要完全不同的页面框架时，应覆盖 Hugo 布局或有意识地维护主题分支，而不是重置整份样式表。

#### 额外样式 {#extra-styles}

隔离的第三方 CSS 可以通过钩子发布为本地资源：

```go-html-template
{{ $extra := resources.Get "css/extra.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $extra.RelPermalink }}"
  integrity="{{ $extra.Data.Integrity }}" crossorigin="anonymous">
```

将模板放在
`layouts/partials/hooks/head-end.html`。如果规则属于站点设计系统，应优先写入项目 SCSS 文件。绝不能把远程样式表当作隐式后备资源。

## 颜色与颜色主题 {#colors-and-color-themes}

主题各处都可以使用 Bootstrap 语义颜色与 OINK 品牌设计变量。语义名称比具体色值更能说明用途。

### 站点颜色 {#site-colors}

在编译前设置 Bootstrap 变量：

```scss
$primary: #315f8f;
$secondary: #b4762e;
$success: #2c7a4b;
$warning: #9a6700;
$danger: #b42318;
```

OINK 的标准品牌层还公开
`--td-brand-elev`、`--td-brand-silk`、`--td-brand-copper`、`--td-brand-header-bg`
和 `--td-brand-mark-gradient` 等 CSS 属性。应同时在 `:root` 与
`[data-bs-theme='dark']` 中成对覆盖：

```scss
:root {
  --td-brand-copper: #a66722;
}

[data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
}
```

### 浅色/深色主题与模式支持 {#lightdark-color-feature}

颜色 **主题** 是组件采用的配色方案，颜色 **模式**
则是整个站点当前处于浅色还是深色状态。OINK 使用 Bootstrap 的
`data-bs-theme="light|dark"`
属性，并把读者明确选择的模式保存在浏览器本地存储中。没有明确选择时，站点跟随
`prefers-color-scheme`。

每个自定义组件都必须为两种模式定义可读状态，包括悬停、焦点、禁用、选中和代码颜色。不能只用颜色传递含义。

## 浅色/深色模式 {#lightdark-color-modes}

样例站默认启用颜色模式支持并显示选择器：

```yaml
params:
  ui:
    showLightDarkModeMenu: true
```

选择器会在页面进入正常交互前更新文档，以减少错误主题闪烁。OINK 的脚本从本地加载，不会联系外部服务。

### 为站点选择主题或颜色模式 {#choosing-themes-or-color-modes-for-your-site}

多数站点应使用默认自动行为。只有完整视觉系统已经在某种模式下通过测试，而且读者确实不需要另一种模式时，才应强制指定。截图不足以完成验证：还要检查真实正文、表格、告警、表单、图表、代码和焦点指示器。

### 禁用深色模式 {#how-to-disable-dark-mode}

如需禁用深色模式并隐藏菜单：

```yaml
params:
  ui:
    showLightDarkModeMenu: false
```

实验值 `enable-only (experimental)`
会启用主题感知样式，但不显示选择器。该配置面仍可能变化，只能作为过渡选项使用。

### 选择具有良好对比度的颜色 {#pick-good-color-contrast}

所有组件状态都应满足 WCAG 对比度要求，并以浏览器实际计算后的颜色为准，包括叠加在图片上的半透明图层。作为工作基线，普通文字的对比度至少为 4.5:1，大号文字至少为 3:1；焦点和非文本界面指示器同样需要足够对比度。自动化工具可以发现常见问题，但仍需进行键盘和人工视觉审查。

## 字体 {#fonts}

OINK 不会拉取 Google Fonts。主题使用的 Open Sans、Chakra Petch、IBM Plex
Mono 与 Font Awesome 字体文件均保存在本地。由于历史原因，旧版 Sass 变量
`$td-enable-google-fonts` 实际控制的是随主题提供的 Open Sans 字体。

在 `_variables_project.scss` 中设置字体：

```scss
$td-enable-google-fonts: true;
$font-family-sans-serif: 'Noto Sans SC', 'Open Sans', system-ui, sans-serif;
$font-family-monospace: 'IBM Plex Mono', ui-monospace, monospace;
```

OINK 还提供构建时字体 preset 与不依赖运行时脚本的语义字体角色。博客、OpenAPI 或代码密集页面的作用域示例与完整公开接口，参见[高级定制][]。

新增字体时，应制作所需子集并自行托管，包含必要字形，设置
`font-display: swap`，在 `VENDOR.json`
中记录许可证，并测试 CJK 后备字体。页面渲染不能依赖字体 CDN。

## CSS 工具类 {#css-utilities}

在允许原始 HTML 的 Markdown 和布局中可以使用 Bootstrap 工具类。内容优先使用语义化 Markdown 与 OINK 短代码；工具类只适合在不同断点下仍易于理解的小范围表现调整。项目级模式应写入
`_styles_project.scss`。

## 代码块 {#code-blocks}

OINK 默认支持 Hugo
Chroma，并提供本地纳管的 Prism 兼容选项。一个站点应统一选择一种高亮器；同时启用会产生重复标记或样式。文件名、复制策略、换行、折叠、行锚点与可分享代码组的完整说明参见[代码块与代码组](/zh/docs/components/code-blocks/)。

### 使用 Chroma 进行代码高亮 {#code-highlighting-with-chroma}

Chroma 在 Hugo 构建期间运行，不需要浏览器端高亮器。代码块应指定语言：

````markdown
```go
fmt.Println("hello")
```
````

#### Chroma 基础样式配置 {#chroma-style-configuration}

在 Hugo 中配置标记渲染：

```yaml
markup:
  highlight:
    guessSyntax: false
    noClasses: false
    lineNos: false
```

OINK 使用基于 class 的输出，以便浅色和深色模式采用不同样式。重新生成配色时，应将 CSS 保存在本地，并结合品牌背景完成审查。

#### 浅色/深色代码样式及其他配置 {#lightdark-code-styles}

主题在 `assets/scss/td/chroma/`
中提供两套 Chroma 配色，并按模式应用。项目覆盖项应在相应主题属性下定位
`.chroma`，不要硬编码全局背景。

##### 选择控制台代码块内容 {#selecting-console-block-content}

终端记录使用
`console`。OINK 会调整提示符和输出的选中行为，使读者复制命令时不会带上装饰性提示符。命令与输出应各占一行，而且不能只靠颜色区分。

#### 未指定语言的代码块 {#code-blocks-without-a-specified-language}

没有标签的围栏会渲染为纯代码。只有确实不存在相应语法时才这样做；命令会话应标为
`console` 或 `bash`，不要让 Chroma 猜测。

#### 复制到剪贴板 {#copy-to-clipboard}

除非 `params.disable_click2copy_chroma`
为 true，否则 Chroma 会显示复制按钮。已部署站点中的剪贴板访问需要安全上下文。该控件必须支持键盘操作，而且不应复制行号或提示符。

### 使用 Prism 进行代码高亮 {#code-highlighting-with-prism}

设置：

```yaml
params:
  prism_syntax_highlighting: true
```

即可使用 OINK 本地提供的 `prism.js` 与
`prism.css`。这是面向既有站点的兼容选项；若要尽量减少浏览器负担，优先使用 Chroma。

#### 没有语言的代码块 {#code-blocks-with-no-language}

Prism 同样会把没有标签的代码块当作纯文本。应补充正确的语言 class，而不是启用启发式检测。

#### 扩展 Prism 语言或插件 {#extending-prism-for-additional-languages-or-plugins}

构建并纳管准确的 Prism 资源包，通过受控主题变更替换本地文件，记录版本与许可证，并添加覆盖该语言或插件的 Fixture。运行时不得从 CDN 拉取 Prism 组件。

## 导航栏 {#navbar}

OINK 导航栏包含项目标识、主菜单、按需显示的版本与语言选择器、颜色模式控件以及搜索。小屏幕上，溢出的主菜单项仍可通过横向滚动访问。

### 默认外观 {#default-look-and-feel}

导航栏使用本地品牌配色和固定的最小高度。

#### 移动端 {#on-mobile}

品牌与操作控件保持可见，主菜单可以滚动。应测试较长的中文标签、200% 缩放、触控目标、焦点顺序以及两种页面方向。

#### 桌面端 {#on-desktop}

主菜单在一行内展开；版本、语言、模式和搜索控件保持分组。不要添加过多自定义入口，以免把控件挤出视口。

##### 覆盖图上的默认半透明效果 {#default-over-cover}

`blocks/cover`
短代码会把导航栏标记为覆盖图感知状态。导航栏起初为半透明，页面滚动后恢复常规背景。

### 自定义导航栏 {#navbar-customization}

行为通过配置调整，表现通过项目 SCSS 调整。覆盖导航栏 Partial 时，必须保留导航地标、焦点顺序、无障碍标签和响应式溢出行为。

#### 导航栏高度 {#navbar-height}

在主题样式编译前覆盖
`$td-navbar-min-height`。锚点偏移、侧边栏高度、移动端换行和覆盖图都依赖该值，因此必须重新测试。

#### 背景颜色与透明度 {#navbar-background}

在两种模式下分别设置 `--td-navbar-bg-color` 或
`--td-brand-header-bg`。背景为半透明时，应在所有覆盖图上验证对比度，并为滚动状态提供不透明背景。

#### 设置导航栏浅色/深色主题 {#navbar-lightdark-theme}

覆盖图需要浅色前景控件时，页面可以在 Front Matter 或 cascade 中设置
`ui.navbar_theme: dark`。这只会调整导航栏组件样式，不会强制改变整个站点的颜色模式。

#### 自定义覆盖图上的半透明效果 {#customize-over-cover}

可以在站点级禁用半透明：

```yaml
params:
  ui:
    navbar_translucent_over_cover_disable: true
```

覆盖图不可预测，或无障碍审查无法保证对比度时，应优先关闭该效果。

### 设置项目徽标与名称样式 {#styling-your-project-logo-and-name}

徽标 Partial 覆盖项放在 `layouts/partials/`，源资源放在 `assets/` 或
`static/`。具有信息含义的标志应提供有意义的替代文本；纯装饰标志应使用空替代文本。SVG 必须包含 view
box，并为两种模式继承或定义颜色。

OINK 样例使用带本地渐变效果的文字标识。站点标题在语言配置中修改，视觉变量在项目 SCSS 中修改；可选择的文字能够胜任时，不要用图片替代品牌名称。

### 浅色/深色模式菜单 {#lightdark-mode-menu}

`params.ui.showLightDarkModeMenu`
为 true 时显示选择器。应把它留在共享导航中，使颜色状态在所有语言和页面类型中保持一致。

## 告警 {#alerts}

Markdown 告警类型会映射到语义化 OINK/Bootstrap 样式。`.alert-*`
与告警渲染钩子应成对调整，保留可见标签或图标，并测试每种背景中的链接和行内代码。语法参见[添加内容](/zh/docs/content/writing/#alerts)。

## 表格 {#tables}

Markdown 表格具有响应式和主题感知样式。单元格应保持简洁，表头应使用真正的标题单元格；需要上下文时可在自定义 HTML 中添加标题，并在移动端测试横向溢出。不能用表格布局互不相关的内容。

## 自定义模板 {#customizing-templates}

Hugo 会优先解析站点布局，再解析主题布局。只复制确实需要修改的最小 Partial，并在同步上游时进行对比；覆盖完整
`baseof.html` 可能会悄然遗漏后续的无障碍与资源流水线修复。

### 在 head 或 body 末尾添加代码 {#add-code-to-head-or-before-body-end}

Head 附加内容使用 `layouts/partials/hooks/head-end.html`，脚本或结束集成使用
`layouts/partials/hooks/body-end.html`。资源应自行托管，只在需要的页面加载，并与生产 CSP 保持兼容。

### 在页面正文前添加横幅 {#before-page-content}

根据页面参数设置条件，并覆盖相应钩子或内容 Partial。横幅不得遮挡页面标题、困住键盘焦点，也不能把锚点目标挤到固定导航下方。

## 为 body 元素添加自定义 class {#adding-custom-class-to-the-body-element}

在页面 Front Matter 或分区 cascade 中设置 `body_class`：

```yaml
---
body_class: product-reference
---
```

OINK 会把该值追加到自动生成的 body
class。请使用项目专属且有语义的名称，绝不能向该字段写入不可信内容。

[高级定制]: /zh/docs/appearance/customize/
