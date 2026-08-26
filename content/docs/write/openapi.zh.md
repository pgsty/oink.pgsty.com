---
title: API 文档
linkTitle: API 文档
description: 把 OpenAPI 规范放进站点，用随主题分发的 Swagger UI 或 Redoc 渲染成可浏览的接口文档，不连 CDN。
weight: 70
search_keywords: [API, OpenAPI, Swagger, Swagger UI, Redoc, 接口文档, swagger, spec, 规范]
---

一页接口文档由一份 OpenAPI 规范加一个 shortcode 构成。Swagger UI 与 Redoc 两个运行时随主题分发（版本分别是 5.32.13 与 2.5.3，见仓库 `VENDOR.json`），只有用到它们的页面、且只在 HTML 输出里加载，构建与浏览都不访问外部服务。Swagger UI 的在线 validator 已写死关闭（`validatorUrl: null`），已发布的接口页面不会把规范地址发往任何地方。

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

不要把规范文件放在页面旁边。`redoc` 会在内容目录里查找同名文件并据此拼出 URL，但内容目录里的 `.yaml` 是页面资源，Hugo 只在它被引用或处理时才发布。`redoc` 只拼 URL、不引用资源，浏览器因此得到 404。

远程规范（`https://…` 开头）两个 shortcode 都接受，但那是一项网络依赖，还会把读者的元数据暴露给那台主机。内网部署与有 CSP 的站点应当使用同源规范。只接受 `http` 与 `https`：其它 scheme、协议相对的 `//host` 或空值都会告警，shortcode 不渲染。

下面的例子用真实存在的 `/openapi/docs-demo.yaml`，一份演示用的集群管理 API，没有可访问的服务端。

## Swagger UI {#swaggerui}

`swagger` 只有一个具名参数 `src`，值是从站点根开始的 URL。它经过主题的 URL 校验，子路径部署同样正确：

```markdown {title="源码"}
{{</* swagger src="/openapi/docs-demo.yaml" */>}}
```

它渲染一个 `class="td-swagger-ui"` 的容器，规范地址放在 `data-td-spec-url` 上；页面上所有容器由一个可缓存的 `js/chunks/swagger-init.js` 统一挂载。容器 ID 由页面地址与 shortcode 序号推导（`td-swagger-<hash>-<n>`），因此同一页可以放多个。

本页只给源码，不真渲染 Swagger UI：它自己生成的标记有 axe WCAG AA 违规（服务器下拉框没有可访问名称、版本号区域是不能聚焦的可滚动区），本站的无障碍门禁要求每个页面零违规。下面的 Redoc 是真渲染的——但要知道两个控件都被排除在那道门禁之外，因为 Redoc 的接口描述文字自身有对比度缺陷。两者都不是完全无障碍的界面，见[限制](#limits)。

## Redoc {#redoc}

`redoc` 只接受一个位置参数，即规范路径。多写一个参数会告警，shortcode 不渲染。

```markdown {title="源码"}
{{</* redoc "openapi/docs-demo.yaml" */>}}
```

{{< redoc "openapi/docs-demo.yaml" >}}

路径解析按顺序有三条分支：`http` 开头视为远程 URL；能在内容目录里找到同名文件时用 `baseURL + 页面目录 + 文件名`；否则用 `baseURL + 原样路径`。`redoc` 的路径因此不要以斜杠开头，`/openapi/…` 会拼出 `https://example.com//openapi/…` 这样的双斜杠。与 `swagger` 不同，它生成基于 `baseURL` 的绝对 URL。

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
- 两个界面都不是完全无障碍的，且都来自主题不改写的上游产物。Swagger UI 的标记有 axe WCAG AA 违规（`select-name`、`scrollable-region-focusable`）；Redoc 的接口描述文字不满足 AA 对比度。本站因此把 `.td-swagger-ui` 与 `.td-redoc` 排除在零违规门禁之外——有同类门禁的站点只能照做，并且应当明说，而不是默认其中某一个能过。
- `redoc` 不接受额外属性参数：写第二个位置参数会告警，shortcode 不渲染。
- `redoc` 路径不要以 `/` 开头，否则拼出双斜杠。
- 规范文件必须能被浏览器取到：放 `static/`，构建后确认 `public/` 下存在该文件。
- 没有服务端 mock：Swagger UI 的 "Try it out" 会向 `servers` 里写的地址发起真实请求，示例规范里的地址不可访问。

## 验证 {#verify}

1. 构建零告警：`hugo --printPathWarnings --panicOnWarning`。
2. 规范确实发布了：`ls public/openapi/docs-demo.yaml`，或访问 `http://localhost:1313/openapi/docs-demo.yaml`。
3. 页面上能展开端点、看到 schema；浏览器控制台没有 404 或跨域报错。
4. 断网后再刷新一次：运行时是本地的，规范同源时界面应照常出现。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 页面 front matter 与正文的基本写法
- [布局与页面类型](/zh/docs/customize/layout/) — `shell_types`、页宽与侧栏
- [Agent 支持](/zh/docs/customize/agents/) — 为什么只在 HTML 里可交互的组件要配文字说明
- [代码块](/zh/docs/components/code/) — 用请求 / 响应示例代替整套 UI 的轻量做法
