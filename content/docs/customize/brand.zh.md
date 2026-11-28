---
title: 品牌外观
linkTitle: 品牌外观
description: 换上自己的站名、Logo、favicon、强调色与字体，选一套视觉预设，再用项目样式表补上其余定制。
weight: 20
search_keywords:
  [品牌, 外观, Logo, favicon, 主色, 配色, 深色模式, 字体, 排版, brand, logo, colors, dark mode, fonts, typography, scss]
aliases:
  - /docs/appearance/
  - /docs/appearance/typography/
  - /docs/appearance/styling/
  - /docs/appearance/customize/
---

站点换上自己的名字、Logo 和颜色，才算有了自己的样子。这三样都是 `hugo.yml` 里的设置，改一次、刷新一下就能看到第一版品牌效果：

```yaml {title="hugo.yml"}
title: Acme DB 文档

params:
  logo: images/acme-mark.svg # 放在 assets/ 或 static/ 下
  ui:
    theme_color: '#0f766e'
    dark_mode: true
```

字体、整体风格与页脚同样是配置项。配置管不到的地方，在 [`assets/css/project.css`](#scss) 里写纯 CSS，它在主题样式表之后加载。不要改主题自己的文件：下一次 `hugo mod get` 会把它们替换掉。

## 站名 {#site-title}

站名出现在顶栏、浏览器标签页和页脚。多语言站点在 `languages.<lang>.title` 下为每种语言各写一个；某种语言没写时，回退到顶层 `title`。

```yaml {title="hugo.yml"}
title: Acme DB 文档

languages:
  en:
    title: Acme DB Docs
    label: English
    locale: en-US
    weight: 1
  zh:
    title: Acme DB 文档
    label: 简体中文
    locale: zh-CN
    weight: 2
```

## Logo 与字标 {#logo}

默认情况下，顶栏显示主题自带的图标 `assets/icons/logo.svg`，旁边是站名。要替换其中任意一半，把图片放进站点的 `assets/` 或 `static/`，再写出它相对该目录的路径：

```yaml {title="hugo.yml"}
params:
  logo: images/acme-mark.svg
  wordmark: images/acme-wordmark.svg # 可选
```

- `params.logo` 是方形图标，顶栏、侧栏顶部与页脚共用。放在 `assets/` 下的文件经过 Hugo 资源管线，放在 `static/` 下的按原样发布。
- `params.wordmark` 是一张写着名字的图片，用来替换图标旁边的站名文字。顶栏把它绘制为 16px 高，宽度低于 992px 时与站名一样隐藏，只留下图标，所以字标里只放名字、不要带图标。页脚单独显示字标，除非[页脚数据](/zh/docs/customize/navigation/#footer)另外指定了 Logo。

SVG 要贴着图形边缘裁切并带上 `viewBox`，否则与旁边的文字对不齐。主题用 `<img>` 放置这两张图，页面 CSS 无法给它们换色，`currentColor` 在其中会解析成黑色。请选在浅色和深色背景上都清晰的颜色，或者照主题自带图标的做法：在 SVG 内部写一段 `<style>`，加上 `@media (prefers-color-scheme: dark)` 规则。这条规则跟随读者的系统设置，而不是站点上的明暗切换。

## favicon {#favicon}

favicon 没有配置项。主题在站点的 `static/` 目录里查找约定的文件名，找到一个就在每个页面输出一条对应的 `<link>`：

| 文件 | 生成的链接 |
| --- | --- |
| `static/favicon.ico` | `rel="icon"` |
| `static/favicon.svg` | `rel="icon"` `type="image/svg+xml"` |
| `static/favicon-32x32.png` | `rel="icon"` `type="image/png"`，带 `sizes`；有多个尺寸时从小到大输出 |
| `static/apple-touch-icon.png` | `rel="apple-touch-icon"` |
| `static/apple-touch-icon-180x180.png` | `rel="apple-touch-icon"`，带 `sizes` |
{.fields}

有 `favicon.ico`、`favicon.svg` 和 `apple-touch-icon.png` 三个文件，所有浏览器就都够用了。文件名带尺寸的必须是正方形（`NxN`），否则主题会忽略它。

Web App Manifest 等其它 head 元数据写在 `layouts/_partials/hooks/head-end.html` 里。要换查找目录或接受其它文件名，在站点里覆盖 `layouts/_partials/favicons.html`。

## 强调色 {#theme-color}

强调色标出读者“在哪里”：侧栏选中行与悬停背景、目录中当前章节的标记及其轨道、标签与徽章的悬停状态、卡片边框与分享按钮的悬停效果、文本选中、焦点环，以及侧栏切换器里各分区的图标。用一个十六进制颜色设置：

```yaml {title="hugo.yml"}
params:
  ui:
    theme_color: '#0f766e'
    theme_color_dark: '#5eead4' # 可选
```

按分区设置最有用。把这一对颜色写进分区根的 `cascade`，整个分区（包括分区首页）都换成这个颜色，读者一眼就能分清文档和博客，站点其余部分仍用默认配色：

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

正文链接、外部链接和行内代码在任何分区都保持预设的颜色，因为读者在哪里都该一眼认出链接和标识符。要改它们，请覆盖[配色](#colors)。

`theme_color_dark` 可以不写。省略时，主题把浅色向白色提亮，直到它在深色背景上达到正文的 AA 对比度；派生出的色调偏离品牌时，再自己指定。浅色是必需的：单独写 `theme_color_dark`，或者与非法的 `theme_color` 一起写，都会被忽略并告警，一个页面要么两种模式都着色，要么都不着色。

要让某一页回到默认配色，在它的 front matter 里写 `theme_color: false`，继承来的深色值也一并取消，不产生告警。其它不是 `#rgb` 或 `#rrggbb` 的取值，例如数字、`true` 或颜色名，都会告警并保留默认配色。Hugo 按键合并参数，某一页只覆盖 `theme_color` 时，仍会继承分区的 `theme_color_dark`，所以两个键要么都覆盖，要么都不覆盖。

主题会拿你写的颜色与自己的背景色比对，对比度低于正文 AA 标准 4.5:1 时告警。颜色照样生效，因为自定义背景或固定的品牌色可能确有理由；在真实背景上确认过之后，可以把告警里的 ID 加进 Hugo 的 `ignoreLogs`。刚好过线的颜色，还要看看那些把它同时用作文字和 12% 同色底的交互元素，例如可点击的徽章；读起来吃力就换深一档。

## 字体 {#fonts}

OINK 把西文字体作为本地字体随主题分发、从你自己的站点加载，任何页面都不会请求 Google Fonts 或其它字体服务。中文使用读者系统里已有的字体，主题不分发中文字体文件。每套[视觉预设](#visual-presets)的字体编排各不相同：

| 预设 | 界面与正文 | 标题 | 中文 |
| --- | --- | --- | --- |
| Paper | IBM Plex Sans | IBM Plex Sans | 通篇黑体 |
| Slate | Inter | Inter；展示标题用 Chakra Petch | 通篇黑体 |
| GitHub | GitHub 的系统字体栈 | GitHub 的系统字体栈 | 通篇黑体 |
| Ink | Palatino | Palatino，章节为斜体 | 标题与界面用楷体，正文用仿宋，缺少时为宋体 |
| News | 系统衬线字体 | 粗重的 Times New Roman | 通篇宋体，标题用最粗的一档 |
| Terminal | IBM Plex Mono，打印时用 IBM Plex Sans | IBM Plex Mono | 通篇黑体 |
{.wide}

Paper 与 Slate 的代码字体是 IBM Plex Mono，字标是 Chakra Petch。Plex Sans 与 Inter 包含拉丁、西里尔、希腊与越南语字符。中文的强调与引文在读者装有楷体时改用楷体，汉字不会被强行倾斜；Terminal 则改为给强调文字着色。

想用平台自带字体、不加载任何内置字体，就切换字体策略：

```yaml {title="hugo.yml"}
params:
  ui:
    typography: system # technical（默认）| system
```

设为 `system` 后，所有字体角色都使用平台字体栈。取值非法时告警并回退到 `technical`。实际生效的策略写在 `<html data-td-typography="…">` 上。

### 使用读者已有的字体 {#fonts-in-config}

只换字体族、不想写 CSS 时，设置 `params.ui.fonts`：

```yaml {title="hugo.yml"}
params:
  ui:
    fonts:
      # 所有预设的正文和标题都跟随这款字体
      ui: "'Source Han Sans SC', 'PingFang SC', sans-serif"
      # 等宽字体要带中文兜底，否则中英混排的代码块会对不齐
      code: "'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace"
```

设置 `ui` 会同时改变所有预设的正文和标题字体。要为标题单独选字体，设置 `heading`。其余键见[字体角色](#custom-fonts)。

这里写的是字体族名，不是字体文件，主题不会因为这个键下载或加载任何字体。所写的字体族要么已经装在读者系统里，要么由你自己的 [`@font-face`](#fonts-in-css) 声明，所以每个列表都要以通用族（`sans-serif`、`serif`、`monospace`）结尾，两者都没有的读者会落到这里。

取值只接受字体族语法：带引号的名字、裸标识符、`-apple-system` 这样的前导连字符，以及任何文字写成的名字（`苹方` 也是合法的字体族名）。分号、花括号、圆括号、`url()` 和尖括号都会被拒绝。未知角色或不安全的取值会告警，只丢弃这一项，其余各项照常生效。主题在样式表之后输出这些值，所以它们优先于预设，也优先于 `typography: system`。

### 自带字体文件 {#fonts-in-css}

要随站点分发字体文件，或者只给某一类内容换字体，就用项目样式表。把 `.woff2` 文件放进站点的 `static/webfonts/`，声明字体，再把各角色指向它：

```css {title="assets/css/project.css"}
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

字体角色是普通的、可继承的 CSS 自定义属性，把它限定在某个 body class 下，就能只给这一类页面换字体，不必去找组件选择器：

```css {title="assets/css/project.css"}
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

等宽字体栈要带中文兜底，否则中英混排的代码会对不齐：

```css {title="assets/css/project.css"}
:root {
  --td-code-font-family: 'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
}
```

### 字体角色 {#custom-fonts}

字体角色由八个 CSS 自定义属性承载，每个也都可以用 `params.ui.fonts` 下对应的键设置：

| 属性 | 配置键 | 用在哪里 |
| --- | --- | --- |
| `--td-ui-font-family` | `ui` | 导航、控件与界面文字 |
| `--td-body-font-family` | `body` | 正文与博客文章 |
| `--td-heading-font-family` | `heading` | 正文标题 |
| `--td-code-font-family` | `code` | 代码与终端 |
| `--td-display-font-family` | `display` | 展示型大标题 |
| `--td-meta-font-family` | `meta` | 技术标签与元数据 |
| `--td-brand-font-family` | `brand` | 字标 |
| `--td-print-font-family` | `print` | 打印正文；未设置时跟随 `body` |

## 视觉预设 {#visual-presets}

预设是一整套外观：配色、字体、链接样式与表格样式，浅色深色都包含在内。先挑一套最接近自己品牌的，再动手调颜色。

| 预设 | 外观 |
| --- | --- |
| `paper`（默认） | 暖白纸色背景、墨色正文、蓝色链接与强调色、Plex Sans 与外框表格 |
| `slate` | 冷灰蓝的技术风格 |
| `github`（实验） | 像 GitHub 显示 README 那样呈现 Markdown：GitHub 的字体与配色、带边框的表格、提示块配色与绿色按钮 |
| `ink`（实验） | 写在暖色纸上的页面：界面与标题通篇用 Palatino 与楷体，正文用仿宋或宋体，朱色标记（着重号、首字、当前行），笔触分隔线与带下划线的正文链接；夜间是紫青色绀纸上的金银字 |
| `news`（实验） | 灰色新闻纸上的印刷版面：粗重的 Times New Roman 与宋体标题、衬线正文与界面、一种专色蓝、报头双线、标题下的副题与日期线、粗细双线分节、拉引与敞开的表格；夜间是暗房，黑底银字配安全灯橙 |
| `terminal`（实验） | 控件、标题与正文都用等宽字体，青色链接、琥珀色强调、紧凑的桌面导航；夜间是一块荧光屏，黑底灰字，标题、链接与光标为绿色 |

每套预设的深色模式沿用浅色模式的字体，但配色各自独立，切换到深色是另一种阅读体验，而不是把页面反相。

`params.ui.preset` 决定站点的外观，`params.ui.preset_menu` 决定读者能否在「外观」菜单里换成别的预设：

```yaml {title="hugo.yml"}
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, github, ink, news, terminal]
    dark_mode: true
```

| `preset_menu` | 读者可选 |
| --- | --- |
| `false`（默认） | 不可选，所有页面都用 `preset` |
| `true` | Paper、Slate 与站点自己的预设 |
| 列表 | 恰好是列出的这些；漏写站点预设时主题会补上并告警 |

GitHub、Ink、News 与 Terminal 只有被点名（写在 `preset` 或列表里）时才会出现，菜单始终按上表的顺序排列。Ink 与 Terminal 已测试的范围见[实验记录](/zh/docs/design/research/2026-10-05-ink-terminal-experiment/)。读者选的风格与明暗分别保存在浏览器里；选回标注为站点默认的那一项，就恢复跟随站点。打印始终使用白纸上的浅色配色。

字体设置与 `theme_color` 在所有预设下都优先生效，但你在自己 CSS 里写的深色覆盖不一定：Paper 的深色配色限定在 `[data-td-preset='paper'][data-bs-theme='dark']` 上，优先级高于单独的 `[data-bs-theme='dark']`。深色覆盖请按[配色](#colors)一节的写法来写。

## 深浅色模式 {#dark-mode}

站点默认只有浅色，需要时再开启深色模式：

```yaml {title="hugo.yml"}
params:
  ui:
    dark_mode: true
```

开启后，主题加入深色配色，并在顶栏与页脚的「外观」控件里加入浅色、深色、跟随系统三个选项，控件图标显示读者的选择：浅色为太阳，深色为月亮，跟随系统为半实心圆，系统在明暗之间切换时它保持不变。控件支持触屏与键盘，在手机上以底部面板打开。读者的选择保存在浏览器里并在各标签页之间同步；没有保存过选择时，页面跟随系统的 `prefers-color-scheme`。一小段内联脚本在样式表加载前就应用好明暗模式，页面不会先闪一下错误的配色。

只想在读者系统要求时提供深色配色、不显示控件，写 `dark_mode: { enable: true, show_menu: false }`。如果 `preset_menu` 仍提供风格选择，控件会保留，图标改为调色板。

## 页脚 {#footer}

```yaml {title="hugo.yml"}
params:
  ui:
    footer_style: fat # fat | slim | none
  copyright:
    authors: '[Acme DB 团队](https://example.com/)'
    from_year: 2026
    to_year: present
  footer_center_info: 'Powered by [Oink](https://oink.pgsty.com)'
```

| `footer_style` | 页脚 |
| --- | --- |
| `fat`（默认） | 版权行上方有多列链接网格 |
| `slim` | 只有版权行 |
| `none` | 不显示页脚 |

链接列来自 `data/footer/<语言>.yaml`，写法见[导航与菜单](/zh/docs/customize/navigation/#footer)。这个文件还不存在时，`fat` 页脚按 `slim` 渲染，所以可以先开启、再补链接。front matter 或分区的 `cascade` 可以单独指定样式（例如在需要专注阅读的栏目改用 `slim`，其余栏目保留 `fat`）。无法识别的取值会告警并使用 `fat`。

`params.copyright` 可以是一段 Markdown 字符串，也可以是 `authors`、`from_year`、`to_year` 三个键组成的 map，`present` 表示当前年份。`footer_center_info` 是版权行中间的行内 Markdown，设为空字符串即可让那里留空。

## 项目样式表 {#scss}

配置管不到的地方，用纯 CSS 写在站点的 `assets/css/` 下：

| 文件 | 用途 |
| --- | --- |
| `project.css` | 你自己的选择器与自定义属性覆盖 |
| `project/*.css` | 可选的更多文件，按路径顺序接在 `project.css` 之后 |

主题把它们发布为一份样式表，在主题样式表之后加载，生产构建中会压缩、加指纹并带完整性校验。因为是单独的文件，修改站点样式不会改动主题样式表，读者浏览器里缓存的那一份也不受影响。

Hugo 只压缩这个文件、不编译它，所以要写 CSS 而不是 SCSS：`//` 注释、Sass 变量、mixin、`@extend` 和 `&-suffix` 选择器都不起作用，原生 CSS 嵌套会原样交给浏览器。相对 URL 从 `/css/` 解析，所以 `../webfonts/my-font.woff2` 指向站点的 `static/webfonts/my-font.woff2`。从旧版 OINK 或 Docsy 升级来的站点，`assets/scss/` 下可能还留着文件；在你按[已退役的 SCSS 钩子](/zh/docs/admin/upgrade/#sass-hooks)转换之前，构建会告警并忽略它们。

只依赖主题 CSS 的公开部分：八个[字体角色](#custom-fonts)与 `--td-brand-*` 属性在小版本之间保持名字与含义不变。`--td-asciinema-font-family` 这类组件别名只在各自组件内有效，`--td-shell-*` 等其它变量在任何版本都可能变化。有变量就用变量，没有再写作用范围尽量小的选择器；为了改一个颜色去覆盖 `baseof.html`，每次升级主题都得手动合并。

要引入第三方样式表，先把它复制进站点，再通过 `layouts/_partials/hooks/head-end.html` 作为本地资源发布，不要在 Markdown 里写 `<link>`。样式表与字体都放在本地，不要指向 CDN，这样对方服务器出问题时站点照常可用。

### 配色 {#colors}

强调色以外的颜色都是 CSS 自定义属性，在项目样式表里覆盖。每套预设都同时设置了浅色和深色，所以两种模式要一起覆盖，否则其中一种会保留预设的颜色。

链接使用 Bootstrap 的链接变量 `--bs-link-color` 与 `--bs-link-hover-color`，以及它们对应的 `-rgb` 变量。按钮等 Bootstrap 组件使用语义色；覆盖这个属性，以及把颜色写成固定值的按钮变量：

```css {title="assets/css/project.css"}
:root,
[data-bs-theme='light'] {
  --bs-primary: #315f8f;
  --bs-primary-rgb: 49, 95, 143;
}

.btn-primary {
  --bs-btn-bg: #315f8f;
  --bs-btn-border-color: #315f8f;
  --bs-btn-hover-bg: #2a5179;
  --bs-btn-hover-border-color: #274c72;
}
```

主题的品牌层也是同样的做法。深色块要同时写下面两个选择器：单独的那个覆盖 Slate，带预设限定的那个才能压过 Paper 的深色配色。

```css {title="assets/css/project.css"}
:root {
  --td-brand-copper: #a66722;
  --td-brand-mark-from: #1d588c;
  --td-brand-mark-to: #a66722;
}

[data-bs-theme='dark'],
[data-td-preset='paper'][data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
  --td-brand-mark-from: #7fb8e8;
  --td-brand-mark-to: #e0a35c;
}
```

| 属性 | 用于 |
| --- | --- |
| `--td-brand-copper`、`--td-brand-copper-dim` | 暖色的次强调色，用在页脚与 Landing 分区，以及它的弱化版 |
| `--td-brand-mark-from`、`--td-brand-mark-to`、`--td-brand-mark-gradient` | 品牌渐变，例如顶栏里的站名 |
| `--td-brand-header-bg` | 顶栏背景 |
| `--td-brand-elev` | 浮层背景 |
| `--td-brand-silk` | 次要文字 |
| `--td-brand-line-strong` | 加重的分隔线 |
| `--td-brand-shadow-sm`、`--td-brand-shadow-md` | 阴影 |
{.wide}

无论改了哪些颜色，都要在两种模式下检查悬停、聚焦、禁用与选中状态：正文对比度至少 4.5:1，大号文字至少 3:1。

### 站点自有外壳的样式 {#bundles}

自带版式的页面（例如手工搭建的首页）可以只借用主题的一部分样式，而不引入阅读外壳。这类布局不加载每个 OINK 页面都用的 `main` 样式表，而是按名称取一份较小的样式表：

| 名称 | 内容 |
| --- | --- |
| `chrome` | 设计变量、排版、六套配色、站点顶栏，以及语言、明暗与外观控件 |
| `landing` | Landing 分区，须在 `chrome` 之后加载 |
| `search` | 命令面板与本地搜索 |
| `compare` | 双列视图 |
{.fields}

```go-html-template {title="layouts/_partials/my-head.html"}
{{ with partial "css/bundle.html" "chrome" }}
  <link rel="stylesheet" href="{{ (. | minify | fingerprint).RelPermalink }}">
{{ end }}
```

这个 partial 返回一个 Hugo 资源，发布为 `css/<name>.css`，位于站点根目录下一级，其中的 `../webfonts/…` 引用在这里才能正确解析；压缩与指纹由你的布局完成。名称未知时会告警。这些样式表跟随锁定的主题版本，所以按名称取用，不要复制到站点里，也不要读取主题 `assets/css/td/` 下的分层文件，它们在任何版本都可能变化。

## 验证 {#verify}

```bash
hugo --printPathWarnings
```

- 构建以 `Total in …` 结束且没有 ERROR。读一遍告警：被拒绝的颜色、字体取值或预设名都会在这里报出，并换成默认值。
- 顶栏显示你的 Logo 与站名，浏览器标签页显示你的 favicon，切换语言时站名随之切换。
- `<html>` 上的 `data-td-typography` 与 `data-td-preset` 是你设置的值。
- 深色模式下，正文、表格、提示块、代码块与焦点环都仍然清晰。每处颜色改动都要在两种模式、以及你提供的每套预设下检查。
- 在浏览器开发者工具里，正文段落的 `font-family` 包含你的字体族，实际渲染的也是你预期的字体文件或系统字体。

## 相关 {#related}

- [配置总览](/zh/docs/customize/config/#identity) — 品牌相关配置的类型与默认值
- [导航与菜单](/zh/docs/customize/navigation/) — 顶栏菜单、页面操作与页脚数据
- [布局与页面类型](/zh/docs/customize/layout/) — 外壳、侧栏、目录与页宽
- [图片](/zh/docs/components/image/) — 正文图片、深浅色双图与图注
- [首页与落地页](/zh/docs/customize/home/) — Hero、分区与落地页数据
