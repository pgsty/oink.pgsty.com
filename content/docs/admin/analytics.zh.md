---
title: 分析与 SEO
linkTitle: 分析与 SEO
description: 接入一个分析服务（或者不接），并把主题已经生成的 canonical、hreflang、社交卡片、站点地图与 robots 配对。
weight: 40
search_keywords: [分析, 统计, Google Analytics, GA4, Plausible, Umami, SEO, 搜索引擎, 站点地图, sitemap, robots, canonical, hreflang, Open Graph]
aliases:
  - /docs/advanced/analytics/
---

主题默认不加载任何分析、表单或广告脚本，不配置就没有对外请求。接入需要显式配置，并把这条外部数据边界写进站点的隐私说明。SEO 一侧相反：canonical、hreflang、`robots` meta、Open Graph 与 Twitter 卡片由主题逐页生成，需要你做的是把 `baseURL` 与每页的 `description` 写对。

## 接 Google Analytics {#google-analytics}

用 Hugo 内置的服务配置，填 GA4 的 measurement ID：

```yaml {title="hugo.yml"}
services:
  googleAnalytics:
    id: G-6JLQEHYFQG
```

主题只在 production 环境渲染这段脚本（`hugo` 构建默认 production，`hugo server` 默认 development）。本地预览与预览部署因此不上报数据，不需要另加开关。

不要同时设置已经弃用的顶层 `googleAnalytics` 键。不需要分析时删掉整段配置，不要填一个假 ID。

> [!WARNING] 这与网络隔离环境不兼容
> 配上之后，页面浏览量与事件会发给 Google。严格的同源内容安全策略也需要为它放行，见[内容安全策略](/zh/docs/admin/deploy/#csp)。这是站点决策，不是主题默认。

## 接其它分析服务 {#other-analytics}

Plausible、Umami、Matomo 这类服务只要求插入一段脚本。主题提供两个注入点，在站点仓库里建同名文件即可，不用改主题：

| 文件 | 插入位置 | 适合放什么 |
| --- | --- | --- |
| `layouts/_partials/hooks/head-end.html` | `</head>` 之前，在 Google Analytics 模板之前 | 分析脚本、cookie 同意脚本、主题没提供的 meta 标签 |
| `layouts/_partials/hooks/body-end.html` | 页面脚本的最后 | 只影响交互、不影响首屏的第三方代码 |
{.fields}

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script defer data-domain="oink.pgsty.com"
        src="https://plausible.io/js/script.js"></script>
{{ end }}
```

`hugo.IsProduction` 这一层不要省：没有它，每个人的本地预览都会向你的统计上报数据。

> [!NOTE] head-end 在 Google Analytics 之前执行
> 这是有意的：cookie 同意脚本必须先于分析脚本运行，才能真正拦住它。

「这篇文档解决了你的问题吗」反馈组件是另一件事：默认关闭，不发网络请求，配置见[仓库与页面信息](/zh/docs/customize/repository/)。

## 页面描述 {#description}

`<meta name="description">` 按这个顺序取值，取到第一个非空的就停：

1. 页面 front matter 的 `description`
1. Hugo 计算出的页面摘要（`.Summary`）
1. 站点配置里的 `params.description`
{.steps}

每页写一句 `description` 是唯一需要作者做的 SEO 动作。它同时用于三处：搜索引擎的摘要、栏目首页的卡片副标题、站内搜索的结果预览。

```yaml {title="content/docs/admin/analytics.zh.md（本页）"}
---
title: 分析与 SEO
description: 接入一个分析服务（或者不接），并把主题已经生成的 canonical、hreflang、社交卡片、站点地图与 robots 配对。
---
```

多语言站点要给每种语言各写一句，不要把英文描述抄到中文页上。站点级默认值也是分语言的：

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      description: A Hugo theme for engineering docs
  zh:
    params:
      description: 为工程而设计的 Hugo 文档主题
```

## canonical 与 hreflang {#canonical-hreflang}

主题为每个页面输出一条 canonical 和一组 `hreflang` 备用链接，不需要配置：

```html {title="渲染结果（本页）" copy=false}
<link rel="canonical" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
<link rel="alternate" hreflang="zh-CN" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
<link rel="alternate" hreflang="en-US" href="https://oink.pgsty.com/">
```

`hreflang` 的语言代码来自各语言的 `locale`（本站是 `en-US` / `zh-CN`），链接来自 Hugo 的译文关系。上面英文那一条指向站点首页而不是对应的英文页：本页没有英文对等文件，Hugo 找不到译文时回退到目标语言首页。这是预期行为，也可以用来判断译文关系有没有被 Hugo 认出来。

canonical 由 `baseURL` 拼出。`baseURL` 配错时 canonical 会把搜索引擎指向不存在的地址，比构建失败更难发现。上线前照[发布上线的验收清单](/zh/docs/admin/deploy/#checklist)查一遍。

多语言的完整配置在[多语言](/zh/docs/customize/i18n/)。

## 社交卡片 {#social-cards}

主题调用 Hugo 内置的 Open Graph 与 Twitter 卡片模板，标题、描述、URL、语言、站名都是自动的：

```html {title="渲染结果（本页）" copy=false}
<meta property="og:title" content="分析与 SEO">
<meta property="og:type" content="article">
<meta property="og:url" content="https://oink.pgsty.com/zh/docs/admin/analytics/">
<meta property="og:locale" content="zh_CN">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary">
```

要让分享出去的链接带图，在 front matter 里给 `images`：

```yaml {title="任意页面"}
---
title: OINK v0.6.0 发布
images: [/images/releasenote.webp]
---
```

给全站一张兜底图就把同样的键写进 `params`：

```yaml {title="hugo.yml"}
params:
  images: [/images/oink.webp]
```

有图时 `twitter:card` 从 `summary` 变成 `summary_large_image`，并多出 `og:image` 与 `twitter:image` 两条。本站两处都没有设置，上面的渲染结果里因此看不到图片相关的标签。

## 站点地图 {#sitemap}

Hugo 自动生成，多语言站点生成的是一个索引：

```text {title="public/ 下的结构" copy=false}
sitemap.xml        ← 索引，指向下面两个
en/sitemap.xml
zh/sitemap.xml
```

站点级默认值和页面级覆盖都是 Hugo 原生的：

```yaml {title="hugo.yml"}
sitemap:
  changefreq: monthly
  filename: sitemap.xml
  priority: 0.5
```

```yaml {title="某个页面"}
---
title: 发布说明
sitemap:
  priority: 0.8
---
```

`changefreq` 与 `priority` 是提示不是承诺，搜索引擎可以忽略。值得做的是发布前确认草稿、私有内容与非规范副本没有进入站点地图，并且每种语言的那份都生成了。

## robots.txt 与不收录 {#robots}

Hugo 只在站点配置里打开开关时才生成 `robots.txt`：

```yaml {title="hugo.yml"}
enableRobotsTXT: true
```

主题提供的模板按构建环境给出两种结果，不需要你写内容：

```text {title="production 构建" copy=false}
User-agent: *
Allow: /

Sitemap: https://oink.pgsty.com/sitemap.xml
```

```text {title="非 production 构建" copy=false}
User-agent: *
Disallow: /
```

页面里的 `robots` meta 跟着同一个开关走：production 且不是打印输出时是 `index, follow`，否则是 `noindex, nofollow`。预览部署不要用 `--environment production` 构建，非 production 自带不收录的行为。

主题没有按页 `noindex` 的开关。某一页不该被收录时，可靠的做法是不发布它（`draft: true`，或用 Hugo 的 `_build` 选项）。既要发布又不想被收录，就用 `head-end.html` 钩子自己输出；主题已经输出了一条 `robots` meta，两条同时存在时如何合并由搜索引擎决定。

## 收录检查 {#indexing}

上线一两周后，按这个顺序确认搜索引擎看到的东西和你以为的一致：

1. 抓取权限：访问 `<baseURL>/robots.txt`，确认是 `Allow: /` 而不是 `Disallow: /`。
1. 页面清单：访问 `<baseURL>/sitemap.xml`，点进语言子地图，看页面数量对不对。
1. 收录数量：在搜索引擎里查 `site:你的域名`，数量级对得上就行，不必逐页核对。
1. 规范地址：搜索结果应当落在 canonical 指向的 URL 上，而不是带 `?` 参数或旧域名的版本。
1. 主动提交：在 Google Search Console / Bing Webmaster Tools 里加上站点并提交 `sitemap.xml` 的地址，比等着被爬快。
{.steps}

搜索元数据补不了内容本身的问题：单薄、重复、过时的页面，写再好的 `description` 也一样。

## 验证 {#verify}

```bash {title="终端"}
hugo --gc --minify --printPathWarnings --panicOnWarning
```

在产物里查这几项：

```bash {title="终端"}
# canonical 指向真实生产地址
grep -o '<link rel="canonical"[^>]*>' public/zh/docs/admin/analytics/index.html

# production 构建才有 index, follow
grep -o '<meta name="robots"[^>]*>' public/zh/docs/admin/analytics/index.html

# robots.txt 与站点地图
cat public/robots.txt
head -5 public/sitemap.xml

# 没接分析时，产物里不应该有任何 gtag / analytics 请求
grep -rl 'googletagmanager\|gtag(' public/ | head
```

浏览器里再确认一次：打开一个代表性页面，看开发者工具的网络面板，没接分析的站点不应有指向第三方域名的请求。

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — `baseURL`、验收清单与预览部署不被收录
- [仓库与页面信息](/zh/docs/customize/repository/) — 页面反馈组件、编辑本页与最后修改时间
- [多语言](/zh/docs/customize/i18n/) — 语言配置决定 `hreflang` 与译文关系
- [Agent 支持](/zh/docs/customize/agents/) — 给大模型看的 `.md` 输出与 `llms.txt`
- [配置总览](/zh/docs/customize/config/) — `services`、`sitemap`、`enableRobotsTXT` 等键的定义
