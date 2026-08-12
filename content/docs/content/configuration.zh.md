---
title: 配置
weight: 10
icon: fa-solid fa-sliders
description: 使用 Hugo 设置与职责明确的主题参数配置 Oink。
search_keywords: [配置, 设置, 参数, YAML]
search_boost: 1.6
aliases: [/docs/oink/configuration/]
---

OINK 遵循“原生优先”的配置模型。站点身份、语言、菜单、输出、taxonomy、标记与模块继续放在 Hugo 规定的位置；语义仍然适用的 Docsy 参数也保持原位。只有无法可靠推导的行为选择，OINK 才会增加职责明确的配置。

## 配置原则 {#configuration-rules}

1. 优先使用 Hugo 配置，不创建主题专用的重复项。
2. 优先使用成熟的 Docsy 参数，不另造 OINK 同义词。
3. 品牌、内容、仓库与 UI 选项应放在各自语义位置。
4. 内部 vendor 路径与模板组装方式不属于公开 API。
5. 遇到非法值或缺少必需端点时，应尽早失败。

OINK 不提供 `oink.enabled` 开关，也不建立 `params.oink.*`
配置树。增加这些配置会制造第二套主题模式，让每项修复、测试和文档都产生歧义。

## 完整基线配置 {#a-complete-baseline}

以下示例把英文设为首要语言、简体中文设为第二语言：

```yaml
title: Product Documentation
baseURL: https://docs.example.com/
defaultContentLanguage: en
enableRobotsTXT: true

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: Product Documentation
    menus:
      main:
        - { name: Docs, pageRef: /docs, weight: 10 }
        - { name: Blog, pageRef: /blog, weight: 20 }
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: 产品文档
    menus:
      main:
        - { name: 文档, pageRef: /docs, weight: 10 }
        - { name: 博客, pageRef: /blog, weight: 20 }

outputs:
  home: [HTML]
  section: [HTML, RSS, print]

markup:
  goldmark:
    renderer:
      unsafe: true
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
  highlight:
    noClasses: false

params:
  logo: icons/logo.svg
  offlineSearch: true
  offlineSearchIndex: summary
  offlineSearchMaxResults: 10
  github_repo: https://github.com/example/product-docs
  github_branch: main
  footer_icp: ''
  footer_icp_url: https://beian.miit.gov.cn/
  copyright:
    authors: Example Authors
    from_year: 2026
  ui:
    showLightDarkModeMenu: true
    quick_links: [docs, blog]
    sidebar_menu_foldable: true
    sidebar_item_overflow: wrap
    breadcrumb_disable: false

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: 0.160.1
```

模块版本固定在站点的 `go.mod` 中。使用传统主题 checkout 时，可以把仓库放在
`themes/oink/`，并改用 `theme: oink`。

## 语言 {#languages}

`defaultContentLanguage` 决定不带路径前缀的首要站点；语言 `weight`
控制显示顺序；`label` 是该语言的自称；`locale` 提供完整的 HTML 与 SEO
locale。对于 RTL 语言，还应设置 `languageDirection: rtl`。

### 文件命名 {#file-naming}

本站使用并置模型：

```text
content/docs/guide.md
content/docs/guide.zh.md
```

基本名称相同的文件互为译文，其逻辑页面身份应保持一致。OINK 读取 Hugo 建立的翻译关系，不会根据任意 URL 模式猜测。

### 选择器状态 {#selector-states}

语言选择器不需要模式参数。只配置一种语言时隐藏；配置两种或更多语言时，点击语言图标会按
`weight` 顺序切换到下一种语言，悬停半秒或聚焦图标则打开完整菜单。

当前页面缺少目标译文时，会进入目标语言首页。不要为了让选择器停留在同一路径而生成貌似存在、实际失效的页面 URL。

## 品牌与代码仓库 {#brand-and-repository}

请设置站点与各语言的 `title` 和描述。`params.logo` 可以指向 Hugo
Asset，也可以指向 `static/`
下的路径。favicon 与社交分享图应放在文档指定的资源位置。

仓库元数据用于生成“编辑此页”、问题反馈和最后修改记录链接：

```yaml
params:
  github_repo: https://github.com/example/product-docs
  github_project_repo: https://github.com/example/product
  github_branch: main
  github_subdir: site
```

在支持的位置，`github_project_repo` 默认回退到 `github_repo`。`github_subdir`
是内容站在 monorepo 中的路径。`github_branch`
必须能够解析；用于展示的版本号不一定是 Git ref。

如果希望首页导航、文档页头、移动端抽屉与页脚使用横向品牌图，请设置
`params.wordmark`。它接受与 `params.logo` 相同的 Hugo Asset 或 `static/`
路径。省略 `wordmark` 时，OINK 保留原有的“图标 + 标题”样式：

```yaml
params:
  logo: images/product-mark.svg
  wordmark: images/product-wordmark.svg
```

## 导航与布局 {#navigation-and-layout}

OINK 沿用 Docsy 菜单与 UI 参数，并增加职责明确的外壳控制项：

```yaml
params:
  page_width: normal
  ui:
    quick_links: [docs, blog]
    sidebar_width_min: 220
    sidebar_width_max: 480
    sidebar_item_overflow: wrap
    sidebar_menu_compact: true
    sidebar_menu_foldable: true
    sidebar_root_enabled: true
    sidebar_root_menu: true
    sidebar_search_disable: false
    breadcrumb_disable: false
    showLightDarkModeMenu: true
    page_context_menu:
      enable: true
      links: []
    readingtime:
      enable: true
```

`page_width` 接受 `normal`、`wide` 或 `full`，也可以在页面 front
matter 中覆盖。侧栏最小与最大值以像素为单位，用来限制桌面端拖动调整的范围。`sidebar_item_overflow: wrap`
会让长标签换行；其他值保持紧凑的省略号行为。

`quick_links` 指定外壳中显示的顶层 page
reference。请在各语言主菜单中定义相应的本地化名称。

页面上下文菜单在所有视口宽度下都保证“在 ChatGPT /
Claude 中打开”“复制Markdown”“查看 Markdown”、编辑、反馈与打印入口可访问。内置助手入口只出现在文档页面，并且仅在读者激活时，才把当前URL 放进本地化提示词中；它不会上传页面正文。`links`
默认为空，额外的自定义链接可使用经过 URL 编码的 `{url}`、`{title}` 与
`{markdown_url}` 占位符：

```yaml
params:
  ui:
    page_context_menu:
      enable: true
      links: []
      # - name: 询问外部助手
      #   icon: fa-solid fa-wand-magic-sparkles
      #   url: https://assistant.example/new?source={markdown_url}&title={title}
```

## 首页与页脚 {#homepage-and-footer}

首页内容位于
`data/home/<language>.yaml`；缺少相应语言数据时回退到英文。每个语言文件包含具名数据块，以及一个可选的
`sections`
列表；该列表会按照准确顺序把数据块组合成首页。页脚使用同一份文件，但不受
`sections` 控制。

### 组合首页分区 {#compose-sections}

字符串条目会同时把该值用作分区类型与数据键。映射条目可以选择内置
`type`，读取另一个具名 `key`，设置稳定 `id`，或临时设置 `enabled: false`：

```yaml
sections:
  - hero
  - metrics
  - capabilities
  - type: logo_wall
    key: ecosystem
  - gallery
  - faq
  - cta

ecosystem:
  title: 使用熟悉的工具构建
  columns: 4
  items:
    - {
        name: Hugo,
        icon: fa-solid fa-bolt,
        url: https://gohugo.io/,
        external: true,
      }
```

映射条目也可以通过 `data`
直接携带内容，适合短小且只使用一次的区块。两个分区需要相同呈现时，可以用不同的键重用内置类型。站点自有布局还可以指定
`partial`，但这属于自定义模板契约，而不是可移植的首页数据。

如果没有 `sections`，OINK 会保留 0.1.x 的顺序，从
`hero`、`metrics`、`capabilities`、`principles` 与 `cta`
中按存在情况进行渲染。添加 `sections`
表示显式组合；此后即使文件中仍有某个数据块，只要列表没有引用，它就不会出现在首页。

### 内置分区 {#built-in-sections}

OINK 0.2.0 提供 12 种分区类型：

| 类型           | 适用内容                               |
| -------------- | -------------------------------------- |
| `hero`         | 核心信息、操作按钮与跟随主题的图片     |
| `metrics`      | 紧凑的事实、数字、链接与辅助文字       |
| `capabilities` | 交替的功能叙事与专用视觉面板           |
| `principles`   | 带编号的产品原则或工作原则             |
| `cards`        | 通用功能、价值、服务或路径集合         |
| `logo_wall`    | 工具、集成、合作伙伴或项目渊源         |
| `gallery`      | 带徽标与操作的截图或图标示例           |
| `testimonials` | 带可选署名与来源链接的引语             |
| `contributors` | 人员、角色、头像与个人页链接           |
| `faq`          | 使用原生展开控件与 Markdown 答案的问答 |
| `markdown`     | 没有合适集合布局时使用的自由文字       |
| `cta`          | 最后一个操作，或一组紧凑操作           |

通用集合区块接受 `eyebrow`、`title`、`desc` 或 `text`、 `columns` 与
`items`。条目字段随呈现方式而异，但统一使用 `title` 或 `name`、`desc` 或
`text`、`icon`、`image`、`url` 与
`external`。普通文字字段会渲染 Markdown。站内 URL 应相对于当前语言根路径；应作为外部导航打开的链接设置
`external: true`。

### Hero 图片与品牌页脚 {#hero-media-and-brand-footer}

每个区块都可以省略，因此无需复制布局也能得到更精简的首页。例如：

```yaml
hero:
  eyebrow: 本地优先的产品文档
  title_lines:
    - words:
        - { mark: P, text: roduct, color: red }
        - { mark: D, text: ocs, color: blue }
  lead: 只用 Hugo 构建和交付的技术文档。
  image:
    light: images/hero-light.webp
    dark: images/hero-dark.webp
    alt: 产品文档工作流插图
  actions:
    - { label: 阅读文档, url: docs/, icon: fa-solid fa-book, style: primary }

footer:
  brand:
    name: Product Docs
    tagline: 支持 **Markdown** 的简短介绍。
    slogan: 让答案离产品更近。
  columns:
    - title: 产品
      links:
        - { label: 概览, url: docs/ }
```

可选的 `hero.image` 会在 Hero 右侧添加一幅跟随颜色主题的图片。将 `light` 与
`dark` 指向站点 `static/` 目录下的文件，图片会随主题选择器切换。只配置
`src`、`light` 或 `dark`
中的一项时，OINK 会在两种主题下复用该图；也可以直接用字符串配置通用图片。省略
`image` 则保持纯文字 Hero。

首页会在通用小页脚上方渲染品牌与导航组成的大页脚。小页脚左侧来自
`params.copyright`，中间使用可选的 `params.footer_icp` 与
`params.footer_icp_url`，右侧列出所有已配置语言。版权作者与大页脚品牌文字中的 Markdown 会渲染为真实链接与行内标记。

### 可导航的功能面板 {#linked-capability-boards}

价值主张区块可以把组件面板变成紧凑导航。为每个可导航项目添加 `url`，用
`aria_label`
命名导航区域，并配置一至四列。没有 URL 的项目仍是装饰卡片，因此既有面板会保持原有行为：

```yaml
capabilities:
  items:
    - title: 按需加载内容能力
      visual:
        type: components
        aria_label: 浏览内容组件
        columns: 3
        compact: true
        items:
          - {
              title: Asciinema,
              icon: fa-solid fa-terminal,
              url: docs/content/components/#asciinema,
            }
          - {
              title: Mermaid,
              icon: fa-solid fa-share-nodes,
              url: docs/content/diagrams-and-formulae/#diagrams-with-mermaid,
            }
```

## 搜索 {#search}

项目站默认启用本地搜索：

```yaml
params:
  offlineSearch: true
  offlineSearchIndex: summary
  offlineSearchSummaryLength: 70
  offlineSearchMaxResults: 10
```

`offlineSearchIndex`
控制每种语言索引中可下载的文本范围，四档范围逐级累加：`title`
索引标题与分类元数据；`heading` 增加页面标题；`summary`
增加描述或摘要；`content` 再加入完整正文。`content`
是兼容旧行为的默认值，而多数文档站可从体积更小的 `summary`
开始。`offlineSearchMaxResults` 同时约束 Lunr 与 CJK 子串兜底结果数。

每种语言都会得到独立索引。通过 Docsy 既有配置仍可使用托管搜索，但启用它们会显式增加外部服务边界。除非已经决定界面应显示哪一种，否则不要同时配置多个相互竞争的搜索提供方。

## 内容运行时 {#content-runtimes}

### 纯浏览器运行时 {#browser-only-runtimes}

Mermaid 与 KaTeX 会根据内容自动检测；Markmap 需要在站点级启用：

```yaml
params:
  markmap:
    enable: true
  mermaid:
    theme: default
```

Swagger
UI、Redoc、Asciinema、ECharts、Infographic 与轮播资源会在相应短代码出现时加载。它们的本地运行时路径属于内部实现，不应配置。

### 服务端点 {#service-endpoints}

PlantUML 与 Diagrams.net 需要显式端点：

```yaml
params:
  plantuml:
    enable: true
    svg: true
    svg_image_url: https://diagrams.internal.example/plantuml/svg/
  drawio:
    enable: true
    drawio_server: https://diagrams.internal.example/
```

网络隔离站点应保持这些功能关闭，除非上述 URL 可以在隔离网络内部访问。

## 页面级覆盖 {#page-level-overrides}

Hugo 的 `.Param` 查找机制允许在 front matter 中覆盖许多站点参数：

```yaml
---
title: Wide reference
page_width: wide
hide_feedback: true
hide_readingtime: true
ui:
  no_left_sidebar: false
  scrollSpy:
    disable: false
---
```

只应为真实的内容差异使用覆盖，不要靠逐页设置重建另一套视觉系统。

## 避免虚假配置 {#avoid-false-configuration}

不要暴露：

- 在“Docsy”与“OINK”外壳之间切换的开关；
- vendor JavaScript、CSS、字体或内部 partial 的路径；
- 品牌命名空间下重复的语言或仓库值；
- 只用于二选一复制实现的开关。

如果站点需要定制产品矩阵或门户，请把该组件留在站点，并使用范围明确的 hook 或短代码。清晰的本地业务功能，优于误导性的全局主题选项。

## 验证配置变更 {#validate-changes}

修改配置后：

1. 分别使用最低支持版本与当前验证版本的 Hugo Extended 构建；
2. 测试每种已配置语言，以及至少一个缺少译文的页面；
3. 如果同时支持根路径与子路径部署，验证两种 `baseURL` 输出；
4. 检查本地搜索与可选运行时请求；
5. 检查桌面端和移动端外壳、深浅色主题与打印输出。

真正可接受的配置必须能够正确构建并按预期运行，而不只是可以被 YAML 解析。
