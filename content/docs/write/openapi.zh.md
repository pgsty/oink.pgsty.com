---
title: API 文档
linkTitle: API 文档
description: 把 OpenAPI 规范放进站点，用随主题分发的 Swagger UI 或 Redoc 渲染成可浏览的接口文档，不连 CDN。
weight: 70
search_keywords: [API, OpenAPI, Swagger, Swagger UI, Redoc, 接口文档, swagger, spec, 规范]
---

一页接口文档由一份 OpenAPI 规范加一个短代码构成。需要让读者试发请求时选 Swagger UI，以阅读端点说明与数据结构为主时选 Redoc。两个运行时都随主题分发，只在用到它们的页面的 HTML 输出中加载，不依赖 CDN。Swagger UI 的在线校验器已关闭；远程规范与 API 请求仍会访问各自配置的主机。

三个步骤：把规范文件放进 `static/`，新建一页写上 shortcode，需要专用外壳时把页面 `type` 改成 `swagger`。

## 规范文件的位置 {#spec-file}
规范文件放在 `static/` 下，原样发布到站点根，两个 shortcode 得到的都是浏览器可取的 URL：

```filetree {title="规范文件的位置"}
- static/
  - openapi/
    - docs-demo.yaml    # 发布为 /openapi/docs-demo.yaml
- content/
  - docs/
    - write/
      - openapi.zh.md    # 这一页
```

不要把规范文件放在页面旁边。两个 shortcode 都把本地值视为 `static/` 下的路径，
都不解析页面资源。内容页面旁边的 `.yaml` 属于页面资源，仅在 shortcode 中写出
它的名字并不会让 Hugo 发布它，浏览器因此会得到 404。

远程规范（`https://…` 开头）两个 shortcode 都接受，但那是一项网络依赖，还会把读者的元数据暴露给那台主机。内网部署与有 CSP 的站点应当使用同源规范。只接受 `http` 与 `https`：其它 scheme、协议相对的 `//host` 或空值都会告警，shortcode 不渲染。

试用下面的例子时，下载 [docs-demo.yaml](/openapi/docs-demo.yaml)，保存为自己站点的 `static/openapi/docs-demo.yaml`。它描述一份演示用的集群管理 API，没有可访问的服务端。

## Swagger UI {#swaggerui}

`swagger` 只有一个具名参数 `src`，值是从站点根开始的 URL。它经过主题的 URL 校验，子路径部署同样正确：

```markdown {title="源码"}
{{</* swagger src="/openapi/docs-demo.yaml" */>}}
```

在本地预览中，页面会显示可展开的 API 操作、请求参数与响应数据结构。“Try it out” 会向规范中的 `servers` 地址发送请求；示例没有可用的后端服务。

本页展示 Swagger UI 源码，下方提供 Redoc 实效。两个控件都有已知的无障碍限制，见[限制](#limits)。

## Redoc {#redoc}

`redoc` 只接受一个位置参数，即规范路径。多写一个参数会告警，shortcode 不渲染。

```markdown {title="源码"}
{{</* redoc "openapi/docs-demo.yaml" */>}}
```

{{< redoc "openapi/docs-demo.yaml" >}}

`http` 或 `https` URL 保持为远程地址。其它通过校验的值都是 `static/` 下的路径，
开头有无斜杠等价。例如站点 `baseURL` 为 `https://example.com/preview/` 时，
`openapi/docs-demo.yaml` 与 `/openapi/docs-demo.yaml` 都会变成
`https://example.com/preview/openapi/docs-demo.yaml`。与 `swagger` 不同，Redoc
接收的是这个基于 `baseURL` 的绝对 URL。

主题固定了 `hide-hostname` `hide-logo` `suppress-warnings` `lazy-rendering` `native-scrollbars` 五个属性，并用 CSS 隐藏 Redocly 品牌图标。Redoc 的其余属性目前不开放给作者，需要它们时在站点里覆盖 `layouts/_shortcodes/redoc.html`。

## 专用页面外壳 {#shell}

接口文档页通常较宽较长，可以用 `swagger` 页面类型：

```yaml {title="content/api/_index.md"}
---
title: 集群管理 API
type: swagger
page_width: wide
cascade:
  type: swagger
---
```

`swagger` 是主题默认的外壳类型之一（`params.ui.shell_types` 默认是 `[docs, book, blog, swagger]`，站点覆盖这个列表时需要保留它）。它与 `docs` 外壳的差别只有两处：`<body>` 上多一个 `td-swagger` class 供样式挂钩，以及不显示版本横幅。侧栏、目录、面包屑、翻页器与页尾都照常。

外壳与页宽的完整说明见[布局与页面类型](/zh/docs/customize/layout/)。

## 输出形态 {#outputs}

| 输出 | 呈现 |
| --- | --- |
| HTML | 完整的交互式 Swagger UI / Redoc；运行时按需加载，本地文件，无 CDN，且只在这一种输出里 |
| 打印 | 一行带标题的静态链接，规范地址可见；两套运行时都不加载 |
| Markdown | 一个纯 Markdown 链接 `[OpenAPI 规格文件](/openapi/example.yaml)`，不会退化成接口清单 |
| RSS | 同样的纯链接 |

在 HTML 之外，接口文档是一个指路牌而不是一份参考。要让打印或 Agent 输出里也有接口信息，在同一页用正文写关键端点的说明；shortcode 之外的正文在四种输出里都完整保留。

## 限制与常见问题 {#limits}

- 两个组件的容器 ID 都按「页面地址 + shortcode 序号」推导，同一页放多个互不冲突。
- 两者可以同页共存，但页面会很长，HTML 输出也会同时加载两套运行时。正式站点选一个。
- 两个界面都不是完全无障碍的：Swagger UI 存在未命名的服务器控件与无法通过键盘访问的滚动区域；Redoc 的接口描述文字对比度不足。请按站点的无障碍要求评估这些限制。把控件排除在自动检查之外不等于符合要求；嵌入式控件不适用时，提供可阅读的端点文档。
- `redoc` 不接受额外属性参数：写第二个位置参数会告警，shortcode 不渲染。
- 本地 `redoc` 路径以 `static/` 为根，开头的 `/` 可有可无；它不解析页面资源。
- 规范文件必须能被浏览器取到：放 `static/`，构建后确认 `public/` 下存在该文件。
- 没有服务端 mock：Swagger UI 的 "Try it out" 会向 `servers` 里写的地址发起真实请求，示例规范里的地址不可访问。

## 验证 {#verify}

1. 构建零告警：`hugo --printPathWarnings --panicOnWarning`。
2. 规范确实发布了：`ls public/openapi/docs-demo.yaml`，或访问 `http://localhost:1313/openapi/docs-demo.yaml`。
3. 页面上能展开端点、看到 schema；浏览器控制台没有 404 或跨域报错。
4. 断开外部网络，但保持本地预览服务器可访问，再刷新页面：运行时与规范都来自本地时，界面应照常出现。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 页面 front matter 与正文的基本写法
- [布局与页面类型](/zh/docs/customize/layout/) — `shell_types`、页宽与侧栏
- [Agent 支持](/zh/docs/customize/agents/) — 为什么只在 HTML 里可交互的组件要配文字说明
- [代码块](/zh/docs/components/code/) — 用请求 / 响应示例代替整套 UI 的轻量做法
