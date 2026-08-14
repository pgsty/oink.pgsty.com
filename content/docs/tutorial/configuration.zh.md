---
title: 基础配置
linkTitle: 基础配置
weight: 40
description: 站点身份、语言、搜索、仓库链接与生产构建参数。
---

Hugo 从 `hugo.yaml`、`hugo.toml` 或 `hugo.json`
读取站点级设置。OINK 项目站点用 YAML，因为多语言菜单和主题选项以 YAML 形式更好读、也更好评审。

这一页覆盖让站点跑起来所必需的配置。导航菜单、多语言细节和版本管理见[站点配置](/zh/docs/configure/)。

## 完整最小配置 {#minimum-configuration}

```yaml {filename="hugo.yaml" lineNos="table" collapse=28}
title: Product Documentation
baseURL: https://docs.example.com/
defaultContentLanguage: en

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

markup:
  goldmark:
    renderer:
      unsafe: true

params:
  offlineSearch: true
  github_repo: https://github.com/example/product-docs
  github_branch: main
  copyright:
    authors: '[Example Authors](https://example.org/)'
    from_year: 2026
  footer_center_info: 'Powered by [Oink](https://oink.pgsty.com)'
  ui:
    showLightDarkModeMenu: true
    sidebar_menu_foldable: true

module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: {{% param hugoMinVersion %}}
```

## 关键参数 {#key-parameters}

{{< fields >}} {{% field name="baseURL" type="string" required=true %}}
生产环境的真实地址，**包含子路径**。部署到 `example.com/docs/` 时必须写成
`https://example.com/docs/`，否则所有资源链接都会指向错误位置。 {{% /field %}}
{{% field name="defaultContentLanguage" type="string" default="en" %}}
默认语言。它决定了不带语言前缀的 URL 对应哪种语言。 {{% /field %}}
{{% field name="languages.<lang>.weight" type="integer" %}}
语言排序。权重最小的排在最前，点击语言按钮时按此顺序轮换。 {{% /field %}}
{{% field name="params.offlineSearch" type="boolean" default="false" %}}
启用主题内置的同源 Lunr 索引与 CJK 子串回退。索引按语言分别生成，查询不出站。
{{% /field %}} {{% field name="params.github_repo" type="string" %}}
内容仓库地址。页面操作里的「编辑此页」「查阅编辑历史」「报告问题」都由它推导。
{{% /field %}}
{{% field name="params.github_branch" type="string" default="main" %}}
编辑与历史链接指向的分支。 {{% /field %}}
{{% field name="params.ui.showLightDarkModeMenu" type="boolean" default="false" %}}
显示明暗主题切换。OINK 的交互特性一律是显式启用，主题不替站点做策略决定。
{{% /field %}} {{< /fields >}}

## 输出格式 {#output-formats}

OINK 不强制启用任何可选输出格式，需要什么由站点自己声明：

```yaml {filename="hugo.yaml"}
outputs:
  home: [HTML, RSS, markdown, LLMS]
  page: [HTML, markdown]
  section: [HTML, RSS, print, markdown]
```

| 格式       | 作用                                                           |
| ---------- | -------------------------------------------------------------- |
| `markdown` | 启用页面操作里的「复制 Markdown 文本」和「查阅 Markdown 源码」 |
| `LLMS`     | 生成 `llms.txt`，供 AI 工具索引站点内容                        |
| `print`    | 启用整个分区的打印视图                                         |

## 本地运行时 {#local-runtimes}

Mermaid、KaTeX、Markmap、Swagger
UI、Redoc、Asciinema、ECharts、Infographic全部由主题本地提供，**按页面实际用到的功能加载**。没用到的页面不会下发对应运行时。

PlantUML 和 Draw.io 是例外——它们的正常工作流依赖渲染服务，所以 OINK
**不提供默认端点**。启用但不配置端点会直接让构建失败：

```yaml {filename="hugo.yaml"}
params:
  plantuml:
    enable: true
    svg_image_url: https://diagrams.internal.example/plantuml/svg/
```

这是有意为之：宁可构建失败，也不静默把内容发到一个你没选择过的公共服务。

## 生产环境检查清单 {#production-checklist}

- `baseURL` 用真实生产地址，含子路径
- 除非是明确的产品决策，否则关闭在线分析、评论、Google CSE、Algolia 和远程嵌入
- 在 CI 中固定 Hugo Extended 版本和主题版本
- 生产构建命令用 `hugo --gc --minify`
- 重新分发归档时保留 `LICENSE`、`NOTICE` 和 `VENDOR.json`

可直接构建的完整参考配置，见项目站点仓库的 `hugo.yml`。

## 下一步 {#next-steps}

- [站点配置](/zh/docs/configure/)：导航菜单、多语言、版本管理
- [创作内容](/zh/docs/content/)：开始写文档
