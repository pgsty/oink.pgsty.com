---
title: 快速上手
linkTitle: 快速上手
description: 从零搭建一个双语 OINK 文档站，并把它部署出去。
weight: 10
icon: fa-solid fa-rocket
cascade:
  categories: [教程]
---

OINK 是一个把浏览器运行时随主题一起发布的 Hugo 主题。消费站点**只需要 Hugo
Extended**：不装 Node.js、不跑 PostCSS、不依赖 CDN，构建期间也不会远程拉取主题资源。

## 这一章讲什么 {#what-this-chapter-covers}

按顺序读完这七页，你会得到一个可以部署的双语文档站：

{{< fields >}} {{% field name="环境准备" type="5 分钟" %}} 装 Hugo
Extended，确认版本带 `extended` 标记。Git 和 Go 是否需要取决于你怎么获取主题。
{{% /field %}} {{% field name="安装 OINK" type="5 分钟" %}} 推荐用 Hugo
Module 固定一个版本。另外三种发行方式（离线归档、submodule、克隆）也在这一页。
{{% /field %}} {{% field name="创建站点" type="15 分钟" %}}
从空目录到第一个可预览的页面，包含双语内容的组织方式。 {{% /field %}}
{{% field name="基础配置" type="20 分钟" %}}
站点身份、语言、搜索、仓库链接、生产构建参数。 {{% /field %}}
{{% field name="项目站点" type="可选" %}} 直接拿 `oink.pgsty.com`
当模板改，适合给开源项目快速起一个文档站。 {{% /field %}}
{{% field name="容器预览" type="可选" %}}
不在本机装 Hugo，用容器跑预览和生产构建。 {{% /field %}}
{{% field name="故障排查" type="备查" %}}
构建、语言、搜索、平台四类常见问题的定位方法。 {{% /field %}} {{< /fields >}}

## 三条起步路径 {#three-starting-points}

| 你的情况        | 建议路径                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| 全新项目        | [环境准备](prerequisites/) → [安装](install/) → [创建站点](create-site/) |
| 已有 Hugo 站点  | 直接看[安装](install/)，把 OINK 作为模块导入                             |
| 已有 Docsy 站点 | 看[从 Docsy 迁移](/zh/docs/upgrade/from-docsy/)，正文不用重写            |

## 最短路径 {#shortest-path}

如果你已经装好 Hugo Extended、Git 和 Go，三条命令就能跑起来：

```sh
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{% param tdVersion.latest %}}
hugo server
```

`hugo.yaml` 里加上模块导入：

```yaml {filename="hugo.yaml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

所有受支持的安装方式，预览和生产构建命令都一样：

```sh
hugo server --disableFastRender   # 本地预览
hugo --gc --minify                # 生产构建
```

## 下一步 {#next-steps}

站点跑起来之后，按需要继续：

- [站点配置](/zh/docs/configure/)：导航菜单、多语言、版本管理
- [组件参考](/zh/docs/components/)：代码块、Fields、FileTree 等写作组件
- [部署](/zh/docs/deploy/)：Cloudflare Pages、GitHub Pages 及其他托管
