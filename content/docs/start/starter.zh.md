---
title: 使用 OINK Starter
linkTitle: OINK Starter
description: 按语言、身份、首页、内容、品牌、集成、部署的顺序，把 OINK Starter 逐层改造成你的项目站点。
weight: 10
icon: fa-solid fa-wand-magic-sparkles
search_keywords: [OINK Starter, GitHub 模板, Use this template, 定制 Starter, starter repository]
---

做完[快速上手](/zh/docs/start/)，Starter 已经在本机跑起来，你也改过一处看得见的地方。本页接着把这个示例站点逐层改成你自己的项目站点：先定语言，因为语言数量决定了后面每样东西要改几份；然后依次是身份、首页、内容、品牌、外部集成和部署。每改完一层就预览、提交一次，出了问题立刻知道是哪一步引起的。

## 模板包含什么 {#contents}

| 部分 | Starter 自带的内容 | 你要先做的决定 |
| --- | --- | --- |
| 语言 | 英语、简体中文、法语 | 三种都留，还是关掉一两种 |
| 内容 | 分四个栏目的 Docs、一个 Blog、一本四章的 Book | 重写示例；确定项目用不上某个部分时才整体删除 |
| 首页 | 每种语言一份精简的 `data/home/<lang>.yaml` | 换成你的标语与入口链接 |
| 品牌 | 中性的 Logo 与 favicon | 正式图形定稿前先保留 |
| 集成 | 仓库链接、Giscus、Google Analytics、分享、反馈，全部注释掉 | 只启用你准备长期维护的 |
| 部署 | GitHub Pages 与 Cloudflare Pages Direct Upload 两套 workflow | 选定一个托管商，并检查它的公开 URL |

Starter 自带的 Book（`/book/`）用四个短章讲了同样的流程。读一遍之后，把它换成你的项目真正需要的长篇指南。

## 创建自己的仓库 {#create-repository}

站点应建在你自己的仓库里，而不是 `pgsty/oink-starter` 的克隆上。打开 [GitHub 上的 Starter](https://github.com/pgsty/oink-starter)，点击 **Use this template → Create a new repository**，再克隆 GitHub 为你创建的仓库：

```bash
git clone https://github.com/OWNER/PROJECT-DOCS.git
cd PROJECT-DOCS
hugo server
```

新仓库从一个提交开始自己的历史，GitHub 也会标明它由 Starter 生成。如果之前为了试用克隆过原仓库，请回到模板重新创建，不要删掉那个克隆的 `.git` 目录了事：文件完全相同，但起点干净、来历可查。

## 分层定制 {#customize}

保持 `hugo server` 运行，按顺序逐层修改。每一层最后都有一项可以在浏览器里检查的结果。

### 第一层：语言配置 {#languages}

Starter 在 `/` 发布英文、`/zh/` 发布中文、`/fr/` 发布法语。要少发布几种语言，在 `hugo.yaml` 顶层加上 `disableLanguages`，已经改过的其它设置都不受影响：

```yaml {title="hugo.yaml"}
disableLanguages: [fr]        # 英文与中文
# disableLanguages: [zh, fr]  # 仅英文
```

被禁用的语言要继续保留在 `languages` 下。这样 Hugo 仍把 `.zh.md`、`.fr.md` 认作译文并跳过它们；删掉声明的话，这些文件会被当成重复的英文页面。

如果还没改过 `hugo.yaml`，也可以直接用两份完整的 profile 之一覆盖它：

```bash
cp examples/hugo.single.yaml hugo.yaml     # 仅英文
cp examples/hugo.bilingual.yaml hugo.yaml  # 英文 + 中文
```

profile 会替换整个文件，包括第五、六层要取消注释的那些示例，所以必须最先复制。要换成另一份 profile，先从 Git 恢复三语版 `hugo.yaml`。

检查语言菜单里已经没有被关掉的语言。要彻底移除一种语言，先确认站点在禁用它的状态下能正常构建，再删除对应的内容文件和 `data/home/<lang>.yaml`。

### 第二层：站点身份 {#identity}

`hugo.yaml` 顶部标着 `CHANGE ME` 的两个值是站名和生产地址。在快速上手里做过那处修改，这两项就已经完成了。`&siteTitle` 这个 YAML 锚点把同一个站名带进所有语言：

```yaml {title="hugo.yaml"}
title: &siteTitle Project Name # CHANGE ME: one shared title for every language
baseURL: https://example.org/ # CHANGE ME: canonical production URL
```

内置的两套 workflow 会在构建时把托管商的真实地址作为 `baseURL` 传入；这个值为什么重要，见[确定 baseURL](/zh/docs/admin/deploy/#baseurl)。接着修改版权人；等 GitHub 上的仓库建好之后，再取消仓库链接的注释：

```yaml {title="hugo.yaml"}
params:
  copyright:
    authors: '[项目贡献者](https://example.org/community/)'
    from_year: 2026
  github_repo: https://github.com/OWNER/PROJECT-DOCS
  github_branch: main
```

`github_repo` 会给每一页加上编辑、历史与 issue 链接，所以在仓库真实存在之前保持注释，否则这些链接都无处可去。

检查浏览器标签页、页脚和页面源码中的 canonical 链接，再点一次「编辑当前页面」，确认打开的是正确的文件。

### 第三层：首页 {#home}

首页是数据，不是模板。每种语言在 `data/home/` 下有一个文件，主题直接读取它渲染首页：

```text
data/home/en.yaml
data/home/zh.yaml
data/home/fr.yaml
```

每个文件里，`sections` 按显示顺序列出区块（Starter 中是 `[hero, cards, cta]`），`hero`、`cards`、`cta` 三个键分别存放各区块的文字与链接。保持结构不变，先把一种语言完整改好，再翻译到其它语言。还能添加哪些区块类型，见[首页与落地页](/zh/docs/customize/home/)。

检查首页显示的是你的标语，每个按钮和卡片都能打开一个真实存在的页面。

### 第四层：内容与导航 {#content-navigation}

示例内容分布在三棵目录树里：

```text
content/docs/  简介、快速上手、教程、参考四个栏目
content/blog/  文章、设计记录与发布说明
content/book/  介绍 Starter 的四章短书
```

可以重写或删除其中的示例页面，但在确定项目是否需要某个部分之前，先保留各自的 `_index.md`。整体删除一个部分还要多做几步，见[可选内容区](/zh/docs/start/anatomy/#optional)。

目录树就是侧栏，按 `weight` 排序，详见[组织内容](/zh/docs/write/organize/)。顶部导航来自各栏目 `_index.md` 中的 `menus.main`，所以要把 **Docs** 改名，就改 `content/docs/_index.md` 及其译文里的 `title`（文件里有 `linkTitle` 时改 `linkTitle`），不存在另一份需要同步的菜单文件。译文与原文并排放置，对应标题使用相同的显式 ID：

```text
page.md
page.zh.md
page.fr.md
```

检查每种语言下，侧栏和顶部导航都按你预期的顺序列出各栏目。

### 第五层：品牌与阅读功能 {#brand-features}

正式图形定稿后，替换 `assets/icons/logo.svg` 与 `static/favicon.svg`；在此之前，中性图形看起来也不突兀。Starter 已经使用 `paper` 预设，向读者提供 `paper`、`slate`、`ink`、`terminal` 四种预设，并开启了深色模式。`params.ui` 下被注释的几行，是大多数站点接下来会加的设置，一次取消注释一行，每次都刷新看看效果：

```yaml {title="hugo.yaml"}
params:
  ui:
    theme_color: '#245f94'
    typography: system
    image_zoom: true
    share: [mastodon, linkedin, email, copy]
```

要用自己的字体，在 `params.ui.fonts` 中写字体族名，或在站点 CSS 中声明字体文件，见[字体](/zh/docs/customize/brand/#fonts)。页宽、侧栏、搜索与组件设置都在[配置总览](/zh/docs/customize/config/)里，需要哪项就从那里加哪项；不要整份照抄 `oink.pgsty.com` 的配置，它大得多，带着许多你的站点用不上的设置。

在浅色和深色模式下各检查一遍强调色与字体。

### 第六层：外部集成 {#integrations}

Starter 中的外部集成全部关闭或注释掉了，因为每一项都需要只有你才知道的信息。一个配置块里的值全部真实可用时再取消注释；不完整的配置只会告警，功能保持关闭。

- 仓库链接需要真实的 owner、仓库名和分支（第二层）。
- Giscus 评论需要仓库与分类的名称及其 ID，见[启用评论](/zh/docs/admin/comments/)。
- Google Analytics 需要项目自己的 measurement ID，并且只在生产构建中生效，见[分析与 SEO](/zh/docs/admin/analytics/)。
- 反馈按钮通过 Google Analytics 发送事件，没有接入分析就什么也记录不到，见[仓库与页面信息](/zh/docs/customize/repository/#feedback)。
- 助手链接（`params.ui.page_context_menu.assistant_links`）在读者点击时会把页面 URL 发给 ChatGPT、Claude 或 Gemini。它默认关闭，是否开启是项目的隐私决策。

检查启用的每项集成都出现在页面上，构建输出中也没有关于它的告警。

## 构建与部署 {#build-deploy}

### 本地生产构建 {#strict-build}

启用任何 workflow 之前，先在本地执行与 workflow 相同的构建。`make build` 运行的是同一条命令，并会关闭所有本地主题替换：

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

认真看告警。OINK 把拼错的键、不完整的集成报告为告警，并用安全的默认值继续构建，所以一条告警往往意味着你以为开着的功能其实关着。workflow 用到的构建参数见 [CI 构建设置](/zh/docs/admin/deploy/#ci)。

提交 `hugo.yaml`、`go.mod` 与 `go.sum`。`.gitignore` 已经排除了 `public/`、`resources/` 和 Hugo 缓存。不要提交本地模块替换：托管商构建时会去找一个只存在于你本机的主题路径。

### GitHub Pages {#github-pages}

在仓库的 **Settings → Pages** 中把 **Source** 设为 **GitHub Actions**。此后每次推送到 `main` 都会运行 `.github/workflows/github-pages.yaml`：它用 Go 1.27.4 和最新的 Hugo 构建，把 GitHub 给出的 Pages 地址（包括项目子路径）作为 `baseURL` 传入，再通过 Pages 部署 API 发布 `public/`。也可以在 Actions 页面手动运行。

### Cloudflare Pages {#cloudflare-pages}

`.github/workflows/cloudflare-pages.yaml` 在 GitHub Actions 中构建，再用 Cloudflare 的 Direct Upload 上传结果：

1. 创建一个 **Direct Upload** 类型的 Cloudflare Pages 项目。项目名与仓库名相同，或者设置仓库变量 `CLOUDFLARE_PROJECT_NAME`。
1. 添加仓库 secrets `CLOUDFLARE_ACCOUNT_ID` 与 `CLOUDFLARE_API_TOKEN`。token 需要 **Account → Cloudflare Pages → Edit** 权限。
1. 在 Actions 页面手动运行一次 **Deploy to Cloudflare Pages**。
1. 要让每次推送 `main` 都自动部署，设置仓库变量 `CLOUDFLARE_PAGES_ENABLED=true`。

站点地址默认是 `https://<project>.pages.dev/`；绑定自己的域名后，设置变量 `CLOUDFLARE_SITE_URL`。一个 Pages 项目要么用 Direct Upload，要么用 Cloudflare 的 Git integration，所以同一个项目只选这个 workflow 或 Git integration 之一。其它托管商与 `baseURL` 规则见[发布上线](/zh/docs/admin/deploy/)。

## 验证并删除示例 {#verify}

正式对外发布之前：

1. 搜索 Starter 的占位符，逐条决定剩下的是否有意保留：
   `grep -rnE "Project Name|example\.org|OWNER|REPOSITORY" hugo.yaml data content`。
1. 分别在桌面端和手机上打开每种语言的首页，以及几篇 Docs、Blog、Book 页面。
1. 在有译文的页面上切换语言，应当落到对应的译文，而不是首页。
1. 试一下搜索、深色模式、一个组件、Markdown 与打印视图、一个不存在的 URL（404 页面）、canonical 链接和页面操作菜单。
1. 打开部署后的公开 URL。本地构建通过，不能说明托管商那边的设置也没问题。
{.steps}

要删除示例 Blog 或 Book，按[可选内容区](/zh/docs/start/anatomy/#optional)操作，那里也说明了如何处理它的菜单项和首页上指向它的链接。每删除一个部分就重新构建一次，出错时才能归因到单一改动。

## 下一步 {#next}

[Starter 仓库导览](/zh/docs/start/anatomy/)逐个说明模板里的文件。开始写正式内容时读[编写页面](/zh/docs/write/pages/)，查配置键读[配置总览](/zh/docs/customize/config/)。如果项目已经有一个 Hugo 站点，改走[从零建站](/zh/docs/start/from-scratch/)，把 OINK 接入现有站点。
