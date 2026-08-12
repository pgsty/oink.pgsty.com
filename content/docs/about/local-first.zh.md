---
title: 本地优先运行
weight: 20
description: 无需隐藏网络访问即可构建并浏览 Oink。
aliases: [/docs/oink/local-first/]
---

OINK 的本地优先原则很简单：由主题提供的功能，不得暗中依赖公共 CDN、构建期下载或未经配置的公共服务。完整发行包能够在网络隔离环境中构建，其核心页面也能在该环境中浏览。

## 本地优先覆盖的范围 {#what-local-first-covers}

主题会从生成后的站点提供以下依赖：

| 能力                 | 本地交付方式                                         |
| -------------------- | ---------------------------------------------------- |
| 页面外壳与响应式界面 | Bootstrap 与 OINK CSS/JavaScript                     |
| 图标与字体           | Font Awesome、Open Sans、Chakra Petch、IBM Plex Mono |
| 搜索                 | Lunr、CJK 子串回退与按语言生成的索引                 |
| 图表与公式           | Mermaid、KaTeX 与 Markmap                            |
| API 文档             | Swagger UI 与 Redoc                                  |
| 富内容               | Asciinema、ECharts、Infographic 与轮播运行时         |

这些资源提交在 `assets/` 或 `static/` 中。Hugo 会按照站点 `baseURL`
发布它们，部署在子路径时也不例外。

## 本地优先不覆盖的范围 {#what-local-first-does-not-cover}

OINK 无法让作者任意添加的内容自动离线。以下项目仍然是显式网络选择：

- 外部链接、远程图片、视频、iframe 与 API 规范；
- Algolia、Google CSE 等托管搜索；
- 分析、评论、身份提供商与其他 SaaS 集成；
- 作者主动选择远程渲染器时的 PlantUML 或 Diagrams.net。

使用这些功能的页面仍然可以是有效页面，但站点不应再宣称该页面能够完全离线使用。

## 依赖服务的图表 {#service-backed-diagrams}

PlantUML 与 Diagrams.net 不同于纯浏览器库：其常规工作流依赖渲染或编辑服务。因此 OINK 不提供隐含的公共端点。

启用 PlantUML 却未设置
`params.plantuml.svg_image_url`，或启用 Diagrams.net 却未设置
`params.drawio.drawio_server`
时，构建会失败并给出可操作的错误信息。你可以配置受控的本地端点、发布预渲染图片，或者明确选择远程服务：

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

为了继续渲染继承而来的图表示例，OINK 文档回归站显式配置了公共演示服务。这是样例站自己的选择，不是主题默认值，也不应复制到网络隔离站点。

## 本地搜索 {#local-search}

设置：

```yaml
params:
  offlineSearch: true
```

Hugo 会为每种语言生成搜索索引。浏览器对拉丁文字查询使用本地 Lunr 搜索，对 CJK 文本使用本地子串回退。查询内容不会离开站点。

为了提高搜索质量，请编写清晰的标题与摘要、设置正确的页面语言，并排除不应进入公开客户端索引的生成页面或敏感页面。本地索引可被每位访客下载，不能充当访问控制手段。

## 页面级资源加载 {#per-page-assets}

OINK 不会给每个页面都加载所有运行时。Mermaid、KaTeX、Markmap、Swagger
UI、Redoc、Asciinema、ECharts、Infographic 与轮播，会根据页面功能标记按需选取。不使用某个组件的页面不会收到对应运行时。

同一页包含多个相同组件实例时，运行时仍只会加入一次。在 Hugo 流水线允许的情况下，生产资源会生成指纹，便于提供完整性元数据并使用长期缓存。

## 第三方来源追踪 {#third-party-provenance}

`VENDOR.json` 是随附依赖的机器可读清单。每项依赖都会记录：

- 名称与固定版本；
- 原始来源；
- 适用的许可证文件；
- 已选取产物的路径与 SHA-256 值；
- 维护者更新流程。

主题会在 vendor 资源旁保留相应许可证。更新运行时意味着同时更新产物、许可证与 NOTICE 材料、校验值和测试，使整个变更可以一次性审查。

## 准备离线归档 {#obtain-an-offline-archive}

在联网且可信的机器上，从不可变的 Oink 标签准备归档。例如：

```sh
git clone --branch vX.Y.Z --depth 1 https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-vX.Y.Z.tar.gz vX.Y.Z
shasum -a 256 oink-vX.Y.Z.tar.gz > oink-vX.Y.Z.tar.gz.sha256
```

把两个文件传入隔离环境，验证校验值并解压传统主题：

```sh
shasum -a 256 -c oink-vX.Y.Z.tar.gz.sha256
mkdir -p product-docs/themes
tar -xzf oink-vX.Y.Z.tar.gz -C product-docs/themes
```

然后让隔离站点使用它：

```yaml
theme: oink
```

归档必须包含
`go.mod`、`hugo.yaml`、布局、资源、静态文件、翻译、`LICENSE`、`NOTICE` 与
`VENDOR.json`。在断网构建中使用前，应先检查归档内容。如果未来某个 release 发布了归档与校验文件，应独立验证这些公开产物，不要假定每个标签都带有附件。

## 验证隔离站点 {#verify-an-isolated-site}

有意义的网络隔离验收必须同时覆盖构建阶段与浏览器阶段：

1. 从已经验证的主题归档和空 Hugo 缓存开始；
2. 阻断出站 HTTP、HTTPS 与 Go Module 代理；
3. 运行 Hugo 生产构建命令；
4. 浏览生成结果中的英文与中文页面；
5. 操作搜索、深色模式、图表、API 文档与内容组件；
6. 检查全部 HTML 和 CSS 子资源 URL，确认没有意外远程来源。

项目站点回归套件会针对本地主题候选版本执行这些检查。一次成功只能证明被测提交与环境；每个候选版本以及每次随附依赖更新后都应重新验证。

## 内容安全策略 {#content-security-policy}

本地资源让严格的内容安全策略（CSP）更容易实现，但 OINK 不会为所有站点虚构一份万能策略。作者行内 HTML、ECharts 回调脚本、分析服务、远程规范与自定义集成都可能改变所需指令。

请从能够支持已审查功能的最小策略开始。无需回调时让 ECharts 选项保持结构化，审查行内脚本，只为站点主动启用的集成增加远程来源。
