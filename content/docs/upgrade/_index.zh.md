---
title: 升级迁移
description: 安全升级 Oink、Hugo Extended，或迁移现有 Docsy 站点。
aliases: [/upgrade/, /docs/update/, /docs/updating/]
weight: 6
icon: fa-solid fa-arrows-rotate
---

本节介绍 OINK 的更新合同。**目标版本**
指站点准备升级到的版本。开始之前，请先阅读对应的发布注记，其中会记录破坏性变更、必要操作和已经验证的 Hugo 版本范围。

<a id="update-node"></a>

OINK 消费端构建不安装 Node.js 软件包。npm 仍可供主题维护者使用，但不是站点更新步骤。

## 更新前的准备 {#before-you-update}

- 在 Git 分支或其他可恢复的站点副本上操作。
- 记录当前固定的主题修订版本与 Hugo Extended 版本。
- 先完整构建一次当前生产站点，以便区分新增故障与原有问题。
- 阅读当前版本到目标版本之间的每一篇发布注记，不要跳过中间版本的迁移操作。

## 更新顺序 {#update-order}

请按以下顺序更新：

1. 如果目标版本改变了支持范围，先[更新 Hugo](#update-hugo)。
2. 根据站点的安装方式[更新主题](#update-theme)。
3. [审查主题覆盖](#update-overrides)。
4. 分别通过开发构建与生产构建[检查站点](#check)。

## 更新 Hugo {#update-hugo}

安装目标版本支持的 Hugo Extended，并同步更新本地开发环境、CI、Cloudflare
Pages、Netlify、容器镜像和相关缓存键。构建前先核对实际选中的二进制文件：

```sh
hugo version
```

当前验证基线是 Hugo Extended `0.164.0`，主题当前声明的最低版本是
`0.160.1`。如果发布注记调整了其中任一数值，应以发布注记为准。

## 更新主题 {#update-theme}

根据站点的安装方式选择对应页面：

- [Hugo 模块](hugo-module/)
- [Git submodule 或克隆](git/)
- [从上游 npm 包迁移](npm-package/)

如果使用发布归档，请先保留站点自己的覆盖，再用目标版本归档替换现有主题目录。务必校验归档的 checksum，并让
`LICENSE`、`NOTICE` 与 `VENDOR.json` 始终随发行物保留。

## 审查主题覆盖 {#update-overrides}

如果站点覆盖了主题文件，请逐一与新版本主题中的对应文件比较，并移植仍然适用的变更。重点检查以下目录：

- `assets/`
- `i18n/`
- `layouts/`
- `static/`

当主题已经提供相同行为时，应删除对应覆盖。带业务语义的站点组件、产品页面和品牌素材则应继续留在站点层。

## 检查站点 {#check}

既要运行开发预览，也要执行与生产环境完全相同的命令。Hugo-only 合同下的生产构建命令是：

```sh
hugo --gc --minify
```

至少验证以下项目：

- [ ] 构建完成，且没有错误、警告或弃用提示。
- [ ] 中英文首页、文档页、普通博客页与发布注记页均能正常渲染。
- [ ] 导航、面包屑、目录、稳定标题链接和语言切换均指向正确位置。
- [ ] 本地搜索能返回中英文结果。
- [ ] 深浅色模式、移动端导航与打印输出仍然可用。
- [ ] 页面只加载实际使用的本地运行时；默认页面不发起由主题产生的第三方子资源请求。
- [ ] Mermaid、KaTeX、Markmap、Swagger
      UI、Redoc 以及实际使用的内容组件仍能渲染。
- [ ] 站点自有短代码和业务页面保持完整。

最后，执行目标版本发布注记列出的所有版本专属检查。
