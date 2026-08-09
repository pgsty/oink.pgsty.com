---
title: OINK
linkTitle: OINK
weight: 5
icon: fa-solid fa-layer-group
description: 产品边界、架构与运作方式
---

Oink 是一款从 Docsy 演化而来的独立、本地优先 Hugo 文档主题。它保留 Docsy 成熟的内容模型，同时把一套实现确立为标准产品：文档外壳、仅依赖 Hugo 的消费端构建、本地浏览器运行时、多语言基础设施，以及可复用的内容组件。

公开 Hugo Module 是 `github.com/pgsty/oink`；文档与回归内容独立存放在
`github.com/pgsty/oink.pgsty.com`。

## 产品契约 {#product-contract}

### 唯一标准主题 {#one-canonical-theme}

Oink 不是叠加在另一套 Docsy 安装之上的皮肤。项目不存在 `oink.enabled`
开关、不建立 `params.oink.*`
命名空间，也没有需要同步维护的第二套视觉实现。主题仓库根目录中的布局与资源就是产品本身。

语言、模块、菜单、输出与标记设置使用 Hugo 原生配置；语义仍然适用时沿用 Docsy 现有参数；只有当主题确实需要用户做出选择时，才增加职责单一的参数。

### 消费端仅依赖 Hugo 构建 {#hugo-only-consumer-builds}

站点导入模块后，生产构建命令只有：

```sh
hugo --gc --minify
```

消费站点无需安装 Node.js、npm、PostCSS、Autoprefixer 或浏览器端软件包。项目站点仓库中的维护工具不属于消费端构建契约。

### 默认本地优先 {#local-first-by-default}

Bootstrap、Font
Awesome、Web 字体、本地搜索、图表与 API 文档运行时，以及 Oink 内容组件都随主题提供。资源从生成后的站点提供；在可行的情况下，只有实际使用相应能力的页面才会加载它们。

作者仍可链接互联网、嵌入远程媒体、启用托管服务，或配置 PlantUML 与 Diagrams.net 端点。但这些网络边界必须显式声明；对于主题自带能力，Oink 不会暗中选择公共端点。

### 把多语言作为基础设施 {#multilingual-as-infrastructure}

语言行为完全根据 Hugo 已配置的语言和页面译文推导。Oink 会输出语言、书写方向、canonical、`hreflang`
和 Open Graph locale 元数据，并支持 `.md` 与 `.zh.md` 这样的并置译文。

## 交付内容 {#what-ships}

- 响应式文档与博客外壳、导航、搜索、打印输出、深色模式和移动端行为；
- 本地 Mermaid、KaTeX、Markmap、Swagger
  UI、Redoc、Asciinema、ECharts 与 Infographic 运行时；
- 折叠块、标签页、卡片、导航卡片、文档卡片和轮播；
- 翻译资源，以及记录来源、许可证和校验值的版本化 `VENDOR.json`；
- Hugo 模块声明、Apache-2.0 许可证与必需归属信息。

## 不在交付范围内的内容 {#what-does-not-ship}

主题仓库不包含项目网站、生成的 `public/` 输出、npm
workspace、产品专用控件或部署配置。这些职责留在消费站点或独立的项目站点仓库中。

生产站点应固定发布标签或不可变 commit，而不是跟随 `main`。

## 代码仓库 {#repositories}

| 仓库                                                              | 用途                   |
| ----------------------------------------------------------------- | ---------------------- |
| [`pgsty/oink`](https://github.com/pgsty/oink)                     | 发布主题与 Hugo Module |
| [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) | 文档、示例、测试与部署 |

本地开发主题时，把两个仓库克隆为同级目录，并用被忽略的 Go workspace 连接。

## 项目状态 {#project-status}

当前验证基线为 Hugo Extended `0.164.0`，主题声明的最低版本为
`0.160.1`。本地构建成功，本身并不能证明公开标签、托管站点或下游部署已经存在。

项目保留 Docsy 的 Apache-2.0 历史与归属信息。源码与离线发行包必须保留
`LICENSE`、`NOTICE` 以及适用的第三方声明。

## 后续步骤 {#next-steps}

1. [安装 Hugo Module](getting-started/)。
2. 阅读[架构](architecture/)与[本地优先模型](local-first/)。
3. 查看[内容组件](components/)与[配置](configuration/)。
4. 选择[部署方案](deployment/)，并遵循[发布检查表](release/)。
5. 从现有 Docsy 站点迁移时，请从[迁移指南](migration/)开始。
