---
title: 快速上手
linkTitle: 快速上手
description: 从官方 OINK Starter 建立可运行的本地基线，再依次定制内容、语言、品牌、集成与部署。
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords: [快速上手, OINK Starter, 模板, 安装, Hugo, 本地预览, 部署]
aliases:
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

新站点的推荐起点是
[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter)，而不是复制本站这个
文档与回归测试仓库。Starter 是公开的 GitHub 模板：它固定 OINK
{{% param version %}}，默认即可构建，只包含中性的项目示例与部署 workflow。

> [!IMPORTANT] 两个版本号承担不同职责
> OINK 声明的兼容性下限是 Hugo Extended {{% param hugoMinVersion %}}。当前
> Starter 与它的 CI 固定使用 Hugo Extended 0.165.0 和 Go 1.26。下面这条路径应
> 使用 Starter 固定的工具链；只有刻意维护旧环境的既有站点才使用较低的兼容下限。

## 选择起点 {#choose}

| 当前情况 | 推荐路径 | 得到什么 |
| --- | --- | --- |
| 新建文档站或项目站 | [OINK Starter](/zh/docs/start/starter/) | 一套精简的三语 Docs、Blog、Book 站点与两条部署 workflow |
| 已有 Hugo 站点 | [从零安装](/zh/docs/start/from-scratch/) | 不替换内容，只补 OINK 模块与 Goldmark 前置配置 |
| 已有 Docsy 或旧版 OINK 站点 | [版本升级](/zh/docs/admin/upgrade/) | 保留内容，迁移受支持的语法，并审查站点覆盖 |

## 五分钟建立基线 {#baseline}

1. ### 安装工具 {#tools}

   安装 Git、Go 1.26 或更新版本，以及 Hugo Extended 0.165.0 或更新版本。Hugo
   输出必须包含 `extended`：

   ```console
   $ go version
   go version go1.26.0 darwin/arm64
   $ hugo version
   hugo v0.165.0+extended+withdeploy darwin/arm64
   ```

   macOS 可以执行 `brew install git go hugo`。Linux 与 Windows 请按官方
   [Hugo 安装指南](https://gohugo.io/installation/)和
   [Go 下载页](https://go.dev/dl/)安装，并确认选择 Hugo **Extended**。

1. ### 创建或克隆站点 {#clone}

   准备长期维护时，请打开 Starter 仓库并点击 **Use this template**，然后克隆
   GitHub 为你创建的新仓库。只想在本机评估原始模板时执行：

   ```bash
   git clone https://github.com/pgsty/oink-starter.git my-docs
   cd my-docs
   hugo server
   ```

1. ### 打开基线 {#open}

   打开 <http://localhost:1313/>。默认 Starter 还在 `/zh/` 发布中文，在 `/fr/`
   发布法语。开始修改前，先确认 Docs、Blog、Book、本地搜索、语言切换与深浅色
   模式都能工作。

1. ### 完成一个可见修改 {#first-change}

   修改 `hugo.yaml` 顶部的站名与规范 URL，再修改 `data/home/en.yaml` 中的一句话。
   浏览器刷新后能同时看到两处变化，才算证明配置、内容与固定版本的主题已经正确连通。
{.steps}

## 由浅入深地定制 {#learning-path}

- [使用 OINK Starter](/zh/docs/start/starter/) — 先改身份，再依次处理语言、首页、
  内容、导航、品牌、集成与部署。
- [Starter 仓库导览](/zh/docs/start/anatomy/) — 每个文件负责什么，哪些要替换，
  哪些可以删除。
- [编写页面](/zh/docs/write/pages/) — front matter、标题、链接、图片、草稿与页尾控件。
- [组件总览](/zh/docs/components/) — 内容树稳定后，再增加表达能力。
- [品牌外观](/zh/docs/customize/brand/) — Logo、强调色、字体、页宽与 CSS 扩展点。
- [发布上线](/zh/docs/admin/deploy/) — 使用内置 GitHub Pages 或 Cloudflare Pages
  workflow，再验证真实公开路由。
{.cards}

这个顺序是有意的。先证明构建与内容树，再逐项增加定制，比同时修改语言、导航、
CSS、分析与托管更容易定位问题。

## 发布门禁 {#publication-gate}

第一次推送前，执行与 Starter workflow 相同的严格生产构建：

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
```

命令以 `Total in …` 结束、没有警告或错误，而且 `public/` 中存在各语言根与代表性的
Docs、Blog、Book 路由，才算通过。此时仍只证明本地构建：本地构建、提交、推送、
workflow 变绿与公开站点正确，是彼此独立的关卡。

## 下一步 {#next}

继续阅读[完整 Starter 教程](/zh/docs/start/starter/)。如果模板有你不需要的结构，
按[仓库导览](/zh/docs/start/anatomy/)安全删减。只有在给既有站点接入 OINK，或者
明确想亲手组装每个文件时，才走[从零建站](/zh/docs/start/from-scratch/)路径。
