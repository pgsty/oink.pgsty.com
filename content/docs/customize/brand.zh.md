---
title: 品牌外观
linkTitle: 品牌外观
description: 替换站名、Logo、favicon、主色、深浅色与字体，只需改配置与两个 SCSS 入口文件。
weight: 20
search_keywords:
  [品牌, 外观, Logo, favicon, 主色, 配色, 深色模式, 字体, 排版, brand, logo, colors, dark mode, fonts, typography, scss]
aliases:
  - /docs/appearance/
  - /docs/appearance/typography/
  - /docs/appearance/styling/
  - /docs/appearance/customize/
---

本页覆盖站点外观：站名与 Logo 写在 `hugo.yml`，配色与字体走 SCSS 入口，页宽与页脚形态是参数。前提是站点已能构建（[十分钟上手](/zh/docs/start/)）。

需要改动的文件有四个：`hugo.yml`、`static/` 下的图标、`assets/scss/_variables_project.scss`、`assets/scss/_styles_project.scss`。**不要改主题目录里的文件**：主题是 Hugo Module，升级时整个目录会被替换。

## 站名 {#site-title}

站名出现在顶栏、浏览器标题与页脚。多语言站每种语言各写一个：

```yaml {title="hugo.yml"}
title: 产品文档

languages:
  en:
    title: Product Docs
    label: English
    locale: en-US
    weight: 1
  zh:
    title: 产品文档
    label: 简体中文
    locale: zh-CN
    weight: 2
```

顶层 `title` 是兜底，`languages.<lang>.title` 优先。

## Logo 与字标 {#logo}

主题默认使用自带的 `assets/icons/logo.svg`。替换步骤是把图标文件放进站点的 `assets/` 或 `static/`，再在配置里指向它。

```yaml {title="hugo.yml"}
params:
  logo: images/product-mark.svg
  wordmark: logo.svg
```

- `params.logo` 是方形图标，顶栏、侧栏与页脚共用。放在 `assets/` 下会经过 Hugo 资源管线（可指纹化），放在 `static/` 下按原样发布；两种写法都是相对 `assets/`、`static/` 根的路径。
- `params.wordmark` 是横向字标。设置后顶栏用它替代「图标 + 站名」，窄屏放不下时回落到 `params.logo`。不设置则保持「图标 + 站名」。

源 SVG 应紧贴图形边缘裁切，否则各处尺寸对不齐。SVG 必须带 `viewBox`，颜色继承 `currentColor`，或者在深浅色下都有足够对比度。

本站两个参数都不设：顶栏用主题自带的 `assets/icons/logo.svg` 搭配以展示字体渲染的站名。

## favicon {#favicon}

favicon 没有参数。主题扫描站点 `static/` 目录里的约定文件名，发现哪个就在每个页面输出对应的 `<link>`：

| 文件 | 生成的链接 |
| --- | --- |
| `static/favicon.ico` | `rel="icon"` |
| `static/favicon.svg` | `rel="icon"` `type="image/svg+xml"` |
| `static/favicon-32x32.png` | `rel="icon"` 带 `sizes`，按尺寸升序输出 |
| `static/apple-touch-icon.png` | `rel="apple-touch-icon"` |
| `static/apple-touch-icon-180x180.png` | `rel="apple-touch-icon"` 带 `sizes` |

够用的最小组合是 `favicon.ico` + `favicon.svg` + `apple-touch-icon.png`。带尺寸后缀的文件必须是正方形（`NxN`），否则不会被识别。

这些文件用任意图形工具生成即可。主题不需要 Node.js，Hugo 只发布 `static/` 里已经存在的文件。

Web App Manifest 一类的额外 head 元数据不在扫描范围内，用 `layouts/_partials/hooks/head-end.html` 钩子自行输出；要改变发现规则本身（换目录、增加文件名），在站点 `layouts/` 下覆盖 `layouts/_partials/favicons.html`。

## 主色与配色 {#colors}

配色分两层：Bootstrap 的语义色（编译期 Sass 变量）和 OINK 的品牌层（运行期 CSS 自定义属性）。

先改语义色，它决定按钮、链接、提示块的色调：

```scss {title="assets/scss/_variables_project.scss"}
$primary: #315f8f;
$secondary: #b4762e;
$success: #2c7a4b;
$warning: #9a6700;
$danger: #b42318;
```

这个文件在 Bootstrap 与 OINK 默认值 **之前** 加载，是覆盖 Sass 变量的位置。需要引用 Bootstrap 已定义的变量或 map 时，改用 `_variables_project_after_bs.scss`。

品牌层是一组 CSS 自定义属性，浅色和深色 **必须成对覆盖**，否则一种模式下会漏色：

```scss {title="assets/scss/_styles_project.scss"}
:root {
  --td-brand-copper: #a66722;
  --td-brand-mark-from: #1d588c;
  --td-brand-mark-to: #a66722;
}

[data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
  --td-brand-mark-from: #7fb8e8;
  --td-brand-mark-to: #e0a35c;
}
```

可覆盖的品牌属性有 `--td-brand-elev`（浮层底色）、`--td-brand-silk`（次要文字）、`--td-brand-copper` 与 `--td-brand-copper-dim`（强调色与它的弱化版）、`--td-brand-line-strong`（分隔线）、`--td-brand-header-bg`（顶栏背景）、`--td-brand-shadow-sm` / `--td-brand-shadow-md`（阴影）、`--td-brand-mark-from` / `--td-brand-mark-to` / `--td-brand-mark-gradient`（品牌渐变）。

## 分区主题色 {#theme-color}

上面的品牌配色决定整站的颜色。`theme_color` 是它旁边一件更小的乐器：一个十六
进制色，为外壳的强调底着色，让读者不用被告知也知道自己身在站点的哪一块。

```yaml {title="hugo.yml"}
params:
  ui:
    theme_color: '#6d28d9'
    theme_color_dark: '#a78bfa' # 可选
```

它按分区写比按站点写有用得多。写进分区根的 `cascade`，整个分区就有了身份 ——
藏青的文档、紫色的博客、橙色的教程 —— 而站点默认仍是品牌色：

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

Hugo 会把这些 cascade 值同时解析到分区首页与子页，因此只声明这一对即可。同一对
解析结果既驱动页面强调色，也驱动根切换器里该分区的图标。

**它作用于**：侧栏选中行、以及指针划过其它行时那一层更灰的底、hover 淡铺、
页面目录的药丸与那条会走的轨道和光点、指针落在其上的 Book 章节小标题、标签与
徽章的 hover、内容卡片 hover 时的外边、分享按钮 hover 时的实心底、文本选中、
焦点环，以及侧栏根切换器里每个分区的图标。

**它刻意不作用于**：正文链接、外链、行内代码。这些是阅读约定，不是品牌表面 ——
一页密集的标识符在任何分区都该读成「代码与正文」，链接在哪里都该看起来像链接。
这也是强调色单独占一个自定义属性、而不是去重刷 Bootstrap 链接色的原因。

暗色一半是可选的。省略时，从亮色向白提亮，直到在暗色画布上达到 AA 正文对比度，
所以只填一个颜色的作者不可能产出不可读的暗色配色。派生结果不再符合期望的品牌
色相时，再自己指定暗色一半。亮色才是主键：单独设置 `theme_color_dark`，或者把它放在
一个非法的 `theme_color` 旁边，两种模式都不会着色 —— 主题会发出警告并保留默认配色，
而不是只给暗色模式上色。

彩色栏目里的某一页可以用主题的裸布尔惯例谢绝颜色：front matter 写
`theme_color: false` 即让该页退出继承的栏目色（含继承的暗色一半），静默回到默认
配色，不产生警告。其他非十六进制取值（数字、`true`、颜色名）都会告警。

> [!CAUTION] 对比度是检查，不是强制
> 主题会把你的颜色放在它自己的画布上读，低于 AA 正文对比度（4.5:1）就告警。
> 颜色照常生效：自定义画布或品牌强制色是你的决定。告警里带着能让它闭嘴的
> `ignoreLogs` id；而发布构建带 `--panicOnWarning`，所以在你要么调深颜色、
> 要么关掉检查之前，关卡会一直卡住。
>
> 这个检查是拿颜色对着页面画布读的。有些交互表面会同时把它用作文字与半透明淡铺；
> 例如可点击的实心徽章在 hover 时，是强调色文字压在 12% 的同色淡铺上。这一对比
> 画布检查更紧。如果颜色只是刚好过线，还要检查这些表面，必要时再调深一档。

Hugo 按键合并参数：某一页在同时设了 `theme_color_dark` 的分区里只覆盖
`theme_color`，会继承那个暗色。要么两个都覆盖，要么都不覆盖。

## 深浅色模式 {#dark-mode}

主题默认 **不显示** 深浅色控件。开启方式：

```yaml {title="hugo.yml"}
params:
  ui:
    dark_mode: true
```

开启后顶栏出现一个主题控件：点击在浅色与深色之间切换，悬停或键盘聚焦展开「跟随系统 / 浅色 / 深色」。读者的选择存在浏览器本地，没有选择时跟随 `prefers-color-scheme`。切换脚本在首屏绘制前设置好 `data-bs-theme`，不会出现主题闪烁。

只要深色调色板、不要控件时写 `dark_mode: { show_menu: false, enable: true }`；`dark_mode: false`（默认）两者都不启用。

自定义组件在两种模式下都要给出可读的悬停、聚焦、禁用、选中状态，正文对比度至少 4.5:1、大号文字 3:1。

## 字体 {#fonts}

字体有两档预设，在构建期决定，不涉及 JavaScript：

```yaml {title="hugo.yml"}
params:
  ui:
    typography: technical # technical | system
```

- `technical`（默认）：界面与正文用随主题分发的 Inter（可变字重，拉丁 / 西里尔 / 希腊 / 越南语子集，中文与 emoji 落到平台字体），标题装饰用 Chakra Petch，代码用 IBM Plex Mono。字体文件都是本地的，不请求 Google Fonts。
- `system`：界面、展示、元数据、打印与等宽角色全部回到平台字体栈，浏览器不请求品牌字体。字体文件仍随主题分发，只是不被引用。

非法取值告警并回落到 `technical`，普通 `hugo server` 照常可用；发布门禁开着 `--panicOnWarning`，这类告警在那里才是硬失败。选中的值写入 `<html data-td-typography="…">`，可在浏览器中确认。

### 自定义字体 {#custom-fonts}
字体角色是七个 CSS 自定义属性，覆盖它们即可，不必查找组件选择器：

| 属性 | 配置键 | 用在哪 |
| --- | --- | --- |
| `--td-ui-font-family` | `ui` | 导航、控件与界面文字 |
| `--td-body-font-family` | `body` | 正文与博客 |
| `--td-heading-font-family` | `heading` | 正文标题 |
| `--td-code-font-family` | `code` | 代码与终端 |
| `--td-display-font-family` | `display` | 字标与展示型大标题 |
| `--td-meta-font-family` | `meta` | 技术标签与元数据 |
| `--td-print-font-family` | `print` | 打印正文 |

`ui` 是主字体：`body` 经它解析，`heading` 又经 `body` 解析，所以只写 `ui` 一行，界面、正文与标题一起换掉。

#### 在配置里换 {#fonts-in-config}
只是想换一套字体族，不必碰 SCSS，写 `params.ui.fonts` 即可：

```yaml {title="hugo.yml"}
params:
  ui:
    fonts:
      # 主字体：界面、正文、标题一起跟着走
      ui: "'Source Han Sans SC', 'PingFang SC', sans-serif"
      # 等宽要带中文兜底，否则中英混排的代码块会对不齐
      code: "'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace"
```

这里写的是字体族名，不是字体文件。主题不会因为这个键去下载或加载任何字体：所写的族必须是读者机器上已有的，或者站点自己在样式表里 `@font-face` 声明过的。所以每个列表都要以通用族（`sans-serif`、`monospace`、`serif`）收尾——读者没有你写的字体时，落到那里。

取值只放行纯粹的字体族语法：带引号的名字、裸标识符、允许前导连字符（`-apple-system`），以及任何文字系统写成的名字（`苹方` 合法）。分号、花括号、括号、`url()`、尖括号一律不过关。未知角色或不合法取值只告警并单独丢弃，同一份 map 里其余的行照常生效。什么都不设时，`<head>` 里连这个 `style` 元素都不会出现。

该块在样式表之后输出，这正是作者字体能在同等优先级下压过 `typography` 预设的原因。

#### 在样式表里换 {#fonts-in-css}
要自带字体文件，或者只给某一类内容换字体，仍然走样式表。把 `.woff2` 放进站点 `static/webfonts/`，在项目样式里声明字面，再改写角色：

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

角色按 CSS 规则继承，只给某类内容换字体也不必复制组件选择器：

```scss {title="assets/scss/_styles_project.scss"}
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

等宽字体要带中文兜底，否则中英混排的代码块会对不齐：

```scss {title="assets/scss/_styles_project.scss"}
:root {
  --td-code-font-family: 'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
}
```

从 Docsy 迁移过来的站点不必改写法。旧的 Sass 变量仍然喂进对应角色，写在 `_variables_project.scss` 里照样生效，优先级高于预设默认值：

| 旧 Sass 变量 | 喂给的字体角色 | 说明 |
| --- | --- | --- |
| `$td-fonts-serif` | `--td-ui-font-family` / `--td-body-font-family` | Docsy 的界面字体栈，赋值给 `$font-family-sans-serif` |
| `$font-family-sans-serif` | `--td-ui-font-family` / `--td-body-font-family` | 项目给出自己的栈时，`technical` 预设不再把 Inter 放在它前面 |
| `$font-family-base` | `--td-ui-font-family` / `--td-body-font-family` | Bootstrap 的正文变量，经 `--bs-body-font-family` 进入角色 |
| `$headings-font-family` | `--td-heading-font-family` | 不设置时标题继承正文角色 |
| `$font-family-code` | `--td-code-font-family` | 代码、终端与 `pre` / `code` / `kbd` |
| `$td-font-family-monospace` | `--bs-font-monospace` | 赋值给 `$font-family-monospace` |
| `$font-family-monospace` | `--bs-font-monospace` | `system` 预设下，项目的显式取值优先于平台等宽栈 |

Docsy 的三个 Google Fonts 变量 `$td-enable-google-fonts`、`$td-google-font-name` 与 `$td-web-font-path` 主题已不再读取。它们留在 `_variables_project.scss` 里不影响构建，也不产生任何效果：随主题分发的是 Inter、Chakra Petch 与 IBM Plex Mono，两档预设都不向 Google Fonts 发请求。打印角色 `--td-print-font-family` 跟随正文角色，主题不为纸张单独提供字体。

YAML 里只接受字体族名。远程字体 URL 与任意 CSS 都不接受：字体文件与样式必须是可审查的本地输入，一次普通构建不会因为字体发出任何网络请求。

## 页宽 {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

`page_width` 控制外壳整体宽度，可逐页或按分区 cascade 覆盖。Book 页另有一个
`reading_width`（`slim` / `normal` / `wide`），改的是正文阅读行宽，不是外壳。
两个键取值非法都会在普通预览中告警并回退；带 `--panicOnWarning` 的发布构建会失败。

## 页脚 {#footer}

```yaml {title="hugo.yml"}
params:
  ui:
    footer_style: fat # fat | slim | none
  copyright:
    authors: '[产品团队](https://example.com/)'
    from_year: 2026
    to_year: present
  footer_center_info: 'Powered by [Oink](https://oink.pgsty.com)'
```

- `fat`（默认）：多列链接网格 + 版权行；
- `slim`：只有版权行；
- `none`：不渲染页脚。

页面 front matter（含分区 cascade）可以覆盖它，本站的文档栏目用的是
`footer_style: slim`。无法识别的取值在普通预览中告警并回退到 `fat`，严格发布构建
拒绝这条警告。

多列网格的数据在 `data/footer/<语言>.yaml`，写法见[导航与菜单](/zh/docs/customize/navigation/#footer)。配了 `fat` 但没有数据时自动降级成 `slim`，可以先开启再补内容。

`params.copyright` 接受 Markdown 字符串，或 `authors` / `from_year` / `to_year` 三键的 map（`present` 表示今年）。`footer_center_info` 是页脚中间的行内 Markdown，显式设为空字符串即隐藏中间区域。

## SCSS 入口与不该做的事 {#scss}

站点的 SCSS 覆盖进入主题的同一个样式包，生产构建仍然只有一份带指纹与完整性校验的样式表。三个入口文件放在站点 `assets/scss/` 下：

| 文件 | 什么时候用 |
| --- | --- |
| `_variables_project.scss` | 在 Bootstrap 与 OINK 默认值之前设置 Sass 变量（`$primary`、字体变量） |
| `_variables_project_after_bs.scss` | 设置依赖 Bootstrap 已有定义的变量或 map |
| `_styles_project.scss` | 在主题组件样式之后写选择器与 CSS 自定义属性 |

编译顺序是：Bootstrap 函数 → 项目变量 → OINK 默认值与 Bootstrap → Bootstrap 之后的项目变量 → OINK 组件与品牌层 → 项目样式。

CSS 接口有明确边界。[字体](#fonts)那一节的七个字体角色与 `--td-brand-*` 品牌属性是公开接口，主题在小版本之间保持它们的名字与含义。组件别名（如 `--td-asciinema-font-family`）只承诺在该组件范围内有效，未在文档中记录的 `--td-shell-*` 一类变量是实现细节，随时可能改名或消失。

不该做的事：

- 不改主题目录里的任何文件（`hugo mod` 会覆盖）；
- 不单独 `@import` 主题的内部 partial，它们不是公开的 Sass 接口，导入顺序可能变化；
- 不为了改一个颜色去覆盖 `baseof.html`。有设计变量就用变量，没有再写作用域尽量小的选择器；
- 不引用远程样式表或字体 CDN。

需要额外的第三方 CSS 时，用 `layouts/_partials/hooks/head-end.html` 钩子发布本地资源，不在 Markdown 里写 `<link>`。

## 验证 {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

- 构建输出 `Total in …`，没有 ERROR / WARN；
- 页面源码里 `<html>` 上有 `data-td-typography="technical"`（或所选的预设）；
- 浏览器中顶栏显示自己的 Logo 与站名，标签页图标是自己的 favicon；
- 切到深色模式再看一遍正文、表格、提示块、代码块与焦点框。配色改动容易只在一种模式下验证过；
- 换一种语言，确认站名随之切换。

字体是否已替换，用浏览器开发者工具查任意一段正文的 `font-family`：应当是自己声明的字面，而不是 `Inter`。

## 相关 {#related}

- [配置总览](/zh/docs/customize/config/#identity) — 品牌相关参数的类型与默认值
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单、页面操作与页脚数据
- [布局与页面类型](/zh/docs/customize/layout/) — 外壳、侧栏与目录
- [图片](/zh/docs/components/image/) — 正文里的图片、深浅色双图与图注
- [首页与落地页](/zh/docs/customize/home/) — Hero、分区与落地页数据
