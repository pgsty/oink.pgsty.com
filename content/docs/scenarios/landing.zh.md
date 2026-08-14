---
title: Landing 页面
linkTitle: Landing 页面
weight: 30
description:
  使用本地、多语言数据与 Oink 严格校验的分区注册表，组合可复用的全宽产品页面。
search_keywords: [Landing 页面, 分区, 定价, 时间线, 案例, 条形图]
---

Landing 页面是使用全宽场景外壳的普通 Hugo 内容页。它保留站点顶部导航栏、命令面板与已配置页脚，同时移除文档侧栏和目录栏。内容仍然位于本地并由服务端渲染，不需要前端构建或远程事实 API。

首页继续使用
`data/home/<lang>.yaml`，但内部已经与普通 Landing 页面共用渲染器与分区契约。

## 创建 Landing 页面 {#create-a-landing-page}

创建普通内容文件，并指定本地数据键：

```yaml
---
title: 定价
layout: landing
landing: pricing
outputs: [HTML, print, markdown]
---
```

把中英文叙事数据放在独立文件中：

```text
data/
└── landing/
    └── pricing/
        ├── en.yaml
        └── zh.yaml
```

非首页 Landing 按以下顺序解析数据：

1. 直接写在页面 front matter 中的 `sections`；
2. `data/landing/<key>/<精确语言>.yaml`；
3. `data/landing/<key>.yaml` 中的精确语言记录；
4. 英文或无后缀的本地记录。

叙事内容优先使用分语言文件。共享事实字段可以依次使用精确语言后缀、主语言后缀与无后缀回退；语言标签中的
`-` 会规范化为 `_`。例如先尝试 `title_zh_cn`，再尝试 `title_zh`，最后使用
`title`。不接受 camelCase 后缀别名。

## 组合分区 {#compose-sections}

`sections` 中的每项可以是类型字符串或 Map。Map 可以设置 `type`、通过另一个 `key`
读取数据、提供稳定 `id`、使用 `enabled: false` 暂时关闭，或直接携带一次性
`data`：

```yaml
sections:
  - type: hero
    data:
      eyebrow: 本地优先的工程文档
      title: 只用 Hugo 发布产品页面
      lead: 服务端输出完整内容，只在确有需要时增强。
      actions:
        - { label: 阅读文档, url: /docs/, style: primary }
  - type: metrics
    key: project-facts
  - type: command-box
    data:
      title: 安装
      code: hugo mod get github.com/pgsty/oink@v0.4.0
      lang: bash
  - type: download
    data:
      title: 下载
      keys: [product]
  - cta

project-facts:
  title: 本地事实
  items:
    - { value: 21, label: 分区类型 }
    - { value: 0, label: 运行时事实请求 }
```

新内容使用带连字符的标准类型名；既有首页数据中的下划线会做兼容性规范化。未知类型会给出警告，而不是静默消失。站点可以有意使用自有
`partial` 作为逃生舱，但它属于本地模板契约，不是可移植 Landing 数据。

## 分区注册表 {#section-registry}

Oink 0.4.0 提供 21 种标准分区：

| 类型              | 适用内容                                   |
| ----------------- | ------------------------------------------ |
| `hero`            | 核心信息、操作与跟随主题的图片             |
| `metrics`         | 紧凑事实、数字、链接与计数增强             |
| `capabilities`    | 交替的功能叙事与专用视觉面板               |
| `principles`      | 编号产品原则或工作原则                     |
| `cards`           | 通用功能、价值、服务或路径集合             |
| `logo-wall`       | 使用网格或纯 CSS 跑马灯展示工具与伙伴      |
| `gallery`         | 截图或图标示例                             |
| `testimonials`    | 带可选署名的引语                           |
| `contributors`    | 人员、角色、头像与个人链接                 |
| `faq`             | 原生展开控件或静态平铺问题列表             |
| `markdown`        | 自由文字                                   |
| `cta`             | 最后一个操作或紧凑操作组                   |
| `pricing`         | 产品层级、价格、功能与操作按钮             |
| `pricing-compare` | 不同定价层级的功能对比矩阵                 |
| `command-box`     | 可复制的聚焦命令与可选说明                 |
| `steps`           | 带可选命令示例的有序流程                   |
| `timeline`        | 带日期的里程碑、路线图与发布历史           |
| `code-plate`      | 展示面板中的 Chroma 代码或严格逐行数据     |
| `case-study`      | 带指标、引语与来源的证据型案例             |
| `download`        | 一项或多项经过校验的 `data/download/` 记录 |
| `bar-chart`       | 不使用图表 JS 的非负数值归一化比较         |

既有[首页配置](/zh/docs/configure/overview/#homepage-and-footer)说明了共用集合与 Hero 字段。对 9 种面向场景的新类型，可以从小记录开始，让严格校验指出缺失或非法字段。Oink 仓库的
[`exampleSite` 数据](https://github.com/pgsty/oink/blob/v0.4.0/exampleSite/data/landing/demo/en.yaml)是完整的可执行参考。

## 保持事实本地化 {#local-facts}

价格、star、截图、头像、引语与下载状态必须在 Hugo 启动前就已存在。请在站点自己的维护任务或 CI 中刷新，审阅差异后再提交或生成本地数据。不要在分区中添加浏览器 fetch。

可选的本地外壳事实同样经过严格校验：

```yaml
params:
  offlineSearch: true
  ui:
    landing_search: true
    github_stars: 2189
    alt_site:
      label: English site
      url: https://example.com/
```

`landing_search` 必须是布尔值，并且只有站点同时启用 `offlineSearch`
时才显示既有本地命令面板。`github_stars` 是已提交的字符串或数字，不会触发 GitHub
API 请求。`alt_site` 要求标签与绝对 HTTP(S) URL。

## 渐进增强与无障碍 {#progressive-enhancement}

HTML 设置一个页面标记，并按需加载
`landing.js`。该运行时增强渐显、计数、复制、主题图片与紧凑菜单；关闭 JavaScript 后，服务端文档仍然完整。

跑马灯复制轨道只使用 CSS，副本不会暴露给辅助技术，也不可交互；本地化复选框无需 JavaScript 即可暂停。减少动态效果偏好会关闭移动与渐显过渡；强制颜色模式会保留控件与状态差异。紧凑菜单使用真实链接与按钮，不锁定焦点，也不会复制桌面导航树。

## 输出与验收 {#validation}

| 输出     | 契约                                       |
| -------- | ------------------------------------------ |
| HTML     | 完整静态内容，再按需渐进增强               |
| print    | 保留内容，动态区域变静态，移除控件         |
| Markdown | 标题、正文、列表、表格与代码，不含组件类名 |
| RSS      | 省略 Landing 分区                          |

发布前请分别检查关闭 JavaScript、减少动态效果、强制颜色、纯键盘输入、两种颜色模式、每种语言与子路径 base
URL。确认所有站内链接与资产都保留部署前缀。既有 Docsy
block 短代码仍兼容，但新页面应使用 Landing 数据，不要再增加一层自定义 HTML。
