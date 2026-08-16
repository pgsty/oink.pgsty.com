---
title: 部署
linkTitle: 部署
weight: 70
icon: fa-solid fa-cloud-arrow-up
description: 一次构建，发布到任意静态托管。
cascade:
  categories: [部署]
---

OINK 站点的产物是一个纯静态目录。**任何能托管静态文件的地方都能部署**，不需要 Node 运行时、不需要服务端渲染、也不需要构建插件。

## 生产构建 {#production-build}

```sh
hugo --gc --minify
```

产物写入 `public/`。这个目录可以脱离源码树独立部署。

{{< fields >}} {{< field name="--gc" type="flag" >}}
构建后清理未被引用的缓存资源。 {{< /field >}}
{{< field name="--minify" type="flag" >}} 压缩 HTML、CSS、JS 与 XML 输出。
{{< /field >}} {{< field name="--baseURL" type="string" >}} 覆盖配置里的
`baseURL`。**部署到子路径时必须带上该路径。** {{< /field >}} {{< /fields >}}

## baseURL 是最常见的故障源 {#baseurl}

部署到子路径时，`baseURL` 必须包含它：

```sh
hugo --gc --minify --baseURL https://example.com/docs/
```

配错的后果不是页面打不开，而是更隐蔽的半坏状态：页面能显示，但搜索索引 404、页面操作链接指向错误位置、部分资源加载失败。

排查时先确认浏览器请求的 `offline-search-index.*.json` 路径是否正确。

## 本章内容 {#in-this-chapter}

- [Cloudflare Pages](cloudflare/)：Git 集成，构建在平台侧完成
- [GitHub Pages](github-pages/)：用 Actions 构建并发布
- [其他托管](other/)：Netlify、S3/CloudFront 及通用静态托管
- [本地与离线构建](local/)：网络隔离环境

## 构建环境与索引控制 {#build-environments}

Hugo 的 `-e` 只选择构建期行为（指纹、压缩），**不区分站点内容**。

预览环境应该阻止搜索引擎收录：

```yaml {title="hugo.yaml"}
params:
  # 预览部署设为 true
  private: true
```

或者在预览分支的构建中传入不同的 `--baseURL`，并在托管侧配置 `X-Robots-Tag`。

## 发布前检查 {#pre-publish-checklist}

- [ ] `baseURL` 是真实生产地址（含子路径）
- [ ] 两种语言的页面都能打开，语言切换正常
- [ ] 搜索有结果（检查索引文件的请求路径）
- [ ] 打印视图与明暗模式正常
- [ ] 404 页面可访问
- [ ] 分析、评论等外部集成符合预期（预览环境通常应关闭）
