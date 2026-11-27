---
title: API 文档
linkTitle: API 文档
description: 用随主题分发的 Swagger UI 或 Redoc，把 OpenAPI 规范渲染成可浏览的接口文档，不连 CDN。
weight: 70
search_keywords: [API, OpenAPI, Swagger, Swagger UI, Redoc, 接口文档, swagger, spec, 规范]
---

服务已经有 OpenAPI 文件，就可以直接用它发布接口文档：把文件放进 `static/`，在页面里写一个短代码。希望读者在页面上试发请求，选 Swagger UI；读者主要阅读端点说明与数据结构，选 Redoc。两个运行时都随主题分发，只在用到它们的页面上加载，站点因此不依赖 CDN；Swagger UI 的在线校验器也已关闭。远程规范，以及读者向你的 API 发出的请求，仍会访问各自的主机。

## 规范文件的位置 {#spec-file}

规范文件放在 `static/` 下。Hugo 把这个目录原样发布到站点根，两个短代码因此都能拿到浏览器可以访问的 URL：

```filetree {title="规范文件的位置"}
- static/
  - openapi/
    - docs-demo.yaml    # 发布为 /openapi/docs-demo.yaml
- content/
  - docs/
    - write/
      - openapi.zh.md    # 这一页
```

不要把规范文件放在页面旁边。两个短代码都不解析页面资源：页面包里的 `.yaml` 只有在模板请求它时才会发布，在短代码里写出它的名字并不算请求，浏览器因此会得到 404。

两个短代码也接受以 `https://…` 开头的远程规范。这样每次访问页面都要依赖那台主机，读者的地址和浏览器信息也会暴露给它，所以内网站点和设置了内容安全策略的站点应当使用同源副本。只接受 `http` 与 `https`：其他 scheme、协议相对的 `//host` 或空值都会告警，短代码不渲染任何内容。

想在自己的站点上试用下面的例子，把 [docs-demo.yaml](/openapi/docs-demo.yaml) 保存为 `static/openapi/docs-demo.yaml`。它描述一份演示用的集群管理 API，背后没有服务端。

## Swagger UI {#swaggerui}

`swagger` 只有一个具名参数 `src`，值是规范从站点根开始的 URL。主题像处理其他站内 URL 一样解析它，所以站点部署在子路径下时链接依然正确：

```markdown {title="源码"}
{{</* swagger src="/openapi/docs-demo.yaml" */>}}
```

页面把每个操作列成可展开的一行，显示请求参数与响应数据结构。“Try it out” 会向规范 `servers` 列表中的地址发送真实请求；演示文件里的地址不会响应。

## Redoc {#redoc}

`redoc` 只接受一个位置参数，即规范路径。多写一个参数会告警，短代码不渲染任何内容。

```markdown {title="源码"}
{{</* redoc "openapi/docs-demo.yaml" */>}}
```

{{< redoc "openapi/docs-demo.yaml" >}}

路径相对于 `static/`，开头有无斜杠都一样，短代码会基于 `baseURL` 把它转成绝对 URL：`baseURL` 为 `https://example.com/preview/` 时，`openapi/docs-demo.yaml` 与 `/openapi/docs-demo.yaml` 都会变成 `https://example.com/preview/openapi/docs-demo.yaml`。`http` 或 `https` URL 则原样使用。

每个 `redoc` 短代码都在独立的框架里运行 ReDoc 3.1.0，文件来自主题本地。框架把自己的导航记在自己的 URL 片段里，因此不会干扰文章锚点，也不会干扰同一页上的其他阅读器。它使用 ReDoc 的浅色配色、独立滚动，下方附一条指向规范的普通链接。遥测已关闭，ReDoc 的两张品牌图片改为内嵌，阅读器不会向任何 CDN 发请求；远程规范以及规范中引用的图片仍会从各自的主机获取。直接打开这个框架时，它只接受同源规范。如果站点的[内容安全策略](/zh/docs/admin/deploy/#csp)限制了框架，用 `frame-src 'self'` 放行阅读器。

ReDoc 能读取 OpenAPI、AsyncAPI 与 GraphQL 描述。代码示例写在 `x-codeSamples` 扩展里；旧规范中的 `x-code-samples` 需要改名。OINK 1.6.0 之前定制过 Redoc 短代码或其样式的站点，请阅读[升级到 1.6.0](/zh/docs/admin/upgrade/#preparing-1-6)。

## 专用页面外壳 {#shell}

接口文档往往又宽又长，适合使用 `swagger` 页面类型并加宽页面：

```yaml {title="content/api/_index.md"}
---
title: 集群管理 API
type: swagger
page_width: wide
cascade:
  type: swagger
---
```

`swagger` 外壳就是 `docs` 外壳，只多了一处：`<body>` 上多一个 `td-swagger` class，方便站点 CSS 单独为接口页面写样式。侧栏、目录、面包屑、翻页器与页尾都照常工作。`swagger` 在 `params.ui.shell_types` 的默认列表里；站点覆盖这个列表时要保留它。外壳与页宽的完整说明见[布局与页面类型](/zh/docs/customize/layout/)。

## 输出形态 {#outputs}

只有 HTML 页面加载交互界面。打印、Markdown 与 RSS 把每个短代码替换成一条指向规范的普通链接；在 Markdown 里是 `[OpenAPI 规范](/openapi/example.yaml)`，而不是端点清单。因此打印出来的页面、读取 Markdown 的智能体都看不到任何端点。如果这些读者需要了解关键端点，就在同一页用正文写出来，因为短代码之外的正文在每种输出里都完整保留。

## 限制与常见问题 {#limits}

- 两套界面都有上游的无障碍限制：Swagger UI 包含未命名的服务器控件和无法用键盘访问的滚动区域，Redoc 的接口说明文字对比度低于 AA 标准。站点有严格的无障碍要求时，请同时用 Markdown 正文写出关键端点。
- Swagger UI 与 Redoc 可以放在同一页，但页面会很长，还会同时加载两套运行时。正式站点选一个即可。
- 同一页放多个短代码也不会冲突：每个容器 ID 都由页面地址加短代码序号推导而来。
- 没有 mock 服务。“Try it out” 会向 `servers` 中的地址发出真实请求。

## 验证 {#verify}

1. 用 `hugo --printPathWarnings` 构建，阅读告警。
2. 确认规范已经发布：`ls public/openapi/docs-demo.yaml`，或访问 `http://localhost:1313/openapi/docs-demo.yaml`。
3. 在页面上展开几个端点，确认能看到数据结构，浏览器控制台没有 404 或跨域报错。
4. 断开外部网络，但保持本地预览服务器可以访问，再刷新页面。运行时来自本地、规范同源时，接口文档应照常显示。

## 相关 {#related}

- [编写页面](/zh/docs/write/pages/) — 页面 front matter 与正文的基本写法
- [布局与页面类型](/zh/docs/customize/layout/) — `shell_types`、页宽与侧栏
- [Agent 支持](/zh/docs/customize/agents/) — 为什么只在 HTML 里可交互的组件要配文字说明
- [代码块](/zh/docs/components/code/) — 用请求 / 响应示例代替整套 UI 的轻量做法
