---
title: 示例站点
description: 查看完整项目站、主题示例与最小双语消费站点。
weight: 10
aliases: [/examples/, /docs/examples/, /docs/about/example/]
---

OINK 提供三种不同规模的示例。请选用足以回答当前问题的最小示例：完整项目站适合回归验证，但它有意包含比普通消费站点更多的内容。

## 选择合适的示例 {#choose-an-example}

| 示例                | 最适合验证的内容          | 仓库或指南               |
| ------------------- | ------------------------- | ------------------------ |
| 双语项目站          | 生产规模的配置与质量检查  | `pgsty/oink.pgsty.com`   |
| 主题 `exampleSite/` | 落地页组合与主题 checkout | `pgsty/oink/exampleSite` |
| 最小双语消费站点    | 从零新建文档站            | [从零新建站点][]         |

## 双语项目站 {#bilingual-project-site}

[`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
是你正在阅读的完整文档与回归站。它把英文和简体中文内容并列保存，在 `go.mod`
中固定已发布的 Oink 模块，并覆盖文档、博客、搜索、打印、富内容、元数据与响应式导航。

使用 Hugo 克隆并预览公开模块路径：

```sh
git clone https://github.com/pgsty/oink.pgsty.com.git
cd oink.pgsty.com
hugo server --disableFastRender
```

创建生产构建产物：

```sh
hugo --gc --minify
```

Node.js 与 npm 只是本仓库执行格式、翻译、链接、浏览器和回归检查时的维护依赖，并不是 Oink 消费端的构建要求。

## 主题示例站 {#theme-example-site}

主题仓库包含一个刻意保持精简的
`exampleSite/`。它直接使用当前 checkout 中的主题，演示可组合落地页，不会引入项目站的文档内容或 npm
workspace。

```sh
git clone https://github.com/pgsty/oink.git
cd oink/exampleSite
hugo server
```

修改落地页数据或检查主题 checkout 时使用这个示例；验证文档导航、译文、本地搜索、富内容组件或发布行为时，则使用双语项目站。

## 创建最小消费站点 {#build-a-minimal-consumer}

按照[从零新建站点][]，从空目录组装一个小型双语消费站点。该指南会显式创建模块版本、配置、内容树与首次预览，让读者看清每个必要文件，不依赖可能逐渐失真的复制模板。

相关参考包括：

- [架构]：了解仓库与构建边界；
- [内容组件]：了解可复用的创作原语；
- [多语言支持]：了解并置译文与稳定锚点；
- [部署]：了解构建产物、静态托管、验收与回滚；
- [迁移]：把现有 Docsy 消费站点迁移到 Oink。

## 验证正确的交付层 {#verify-the-right-layer}

本地预览只能证明某个 checkout 可以渲染；它不能证明主题标签已经公开、部署包含相同 commit，或线上路由可用。引用示例作为证据时，应分别记录源码、构建、版本发布与线上验证。

[从零新建站点]: /zh/docs/tutorial/create-site/
[内容组件]: /zh/docs/components/
[多语言支持]: /zh/docs/configure/language/
[部署]: /zh/docs/deploy/
[架构]: /zh/docs/about/architecture/
[迁移]: /zh/docs/upgrade/from-docsy/
