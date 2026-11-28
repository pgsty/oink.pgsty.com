---
title: 分析与 SEO
linkTitle: 分析与 SEO
description: 需要访问统计时接入 Google Analytics 或其它服务，并核对搜索引擎读取的 canonical、hreflang、社交卡片、站点地图与 robots 输出。
weight: 40
search_keywords: [分析, 统计, Google Analytics, GA4, Plausible, Umami, SEO, 搜索引擎, 站点地图, sitemap, robots, canonical, hreflang, Open Graph]
aliases:
  - /docs/advanced/analytics/
---

在你接入统计服务之前，OINK 站点不会向任何人上报数据：Google Analytics 用 Hugo 的一项配置接入，其它服务用一个钩子文件接入。主题本身不加载任何分析、表单或广告脚本，接不接、隐私说明里怎么写，都由你决定。

搜索引擎需要的元数据则不用配置。每个页面都自动带有 canonical 链接、指向各个译文的 `hreflang` 链接、`robots` meta 标签，以及 Open Graph 与 Twitter 卡片；你要做的只是把 `baseURL` 配对，并给每页写好 `description`。

## 接 Google Analytics {#google-analytics}

把 GA4 measurement ID 写进 Hugo 的服务配置：

```yaml {title="hugo.yml"}
services:
  googleAnalytics:
    id: G-YOUR_MEASUREMENT_ID
```

统计代码只在生产构建中加载，所以 `hugo server` 不会上报。`hugo` 默认按生产环境构建，在预览宿主上也是如此，因此 PR 预览与 staging 部署要换一个环境构建，做法见[预览部署不要被收录](/zh/docs/admin/deploy/#preview-builds)。没有 ID 时什么都不加载；Universal Analytics 的 `UA-` ID 已不再支持，填了只会得到一条构建告警，不会输出统计代码。

只用这一个键，顶层的 `googleAnalytics` 键已经弃用。不需要统计时，删掉整段配置，不要留一个占位 ID：占位 ID 照样会加载 Google 的脚本。

> [!WARNING] Google Analytics 会把数据发出你的网络
> 配置之后，页面浏览量与事件会发送给 Google，网络隔离的站点因此不能使用它；严格的内容安全策略也要为它放行，见[内容安全策略](/zh/docs/admin/deploy/#csp)。

## 接其它分析服务 {#other-analytics}

Plausible、Umami、Matomo 这类服务只需要在页面上放一段脚本。主题为此渲染两个钩子 partial，你在站点里加一个文件即可，不用改动主题：

| 文件 | 插入位置 | 适合放什么 |
| --- | --- | --- |
| `layouts/_partials/hooks/head-end.html` | `</head>` 之前，Google Analytics 代码之前 | 分析脚本、cookie 同意脚本、主题没有输出的 meta 标签 |
| `layouts/_partials/hooks/body-end.html` | 页面其它脚本全部之后 | 影响交互而不影响首屏的第三方代码 |
{.fields}

接 Plausible 时，域名换成你自己账户里登记的那个：

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script defer data-domain="your-site.example"
        src="https://plausible.io/js/script.js"></script>
{{ end }}
```

保留 `hugo.IsProduction` 这层判断。少了它，每位作者的每次本地预览都会向你的统计账户上报访问。

> [!NOTE] head-end 在 Google Analytics 之前执行
> 因此放在 `head-end.html` 里的 cookie 同意脚本会先运行，能够阻止统计脚本启动。

「这篇文档有用吗」反馈组件是另一回事，默认关闭。它自己不发任何请求，站点接了 Google Analytics 时通过它记录读者的选择，见[仓库与页面信息](/zh/docs/customize/repository/)。

## 双列视图窗格 {#bilingual-view}

开启[双列视图](/zh/docs/customize/i18n/#bilingual-view)（`params.ui.compare`）后，打开它会在两个同源 frame 中加载两侧页面。Google Analytics 集成（`services.googleAnalytics.id`）会跳过这些窗格，打开阅读器不会多算两次浏览量。为此，OINK 改用自带的、能识别窗格的模板输出统计代码，而不调用 Hugo 内置模板，所以双列视图开启期间，站点覆盖的 `layouts/_partials/google_analytics.html` 不会生效。

`head-end.html` 里的脚本仍会在每个窗格中执行。记录浏览量之前先检查 `window.OinkComparePane`：

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script>
  if (!window.OinkComparePane) {
    var script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = 'your-site.example';
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
</script>
{{ end }}
```

服务器与 CDN 日志同样会看到窗格请求。它们带有查询参数 `oink_compare_pane=1`，可以据此过滤。

## 页面描述 {#description}

`<meta name="description">` 依次取以下第一个非空的值：

1. 页面 front matter 的 `description`
1. Hugo 计算出的页面摘要（`.Summary`）
1. 站点配置里的 `params.description`
{.steps}

所以作者唯一要做的 SEO 工作，就是每页写一句 `description`，而它会在三处派上用场：搜索结果下方的摘要、所在栏目首页的卡片副标题，以及站内搜索的结果预览。

```yaml {title="content/docs/install.zh.md"}
---
title: 安装 PostgreSQL
description: 在 Debian、Ubuntu 或 RHEL 上用官方软件包安装 PostgreSQL 18，并启动第一个集群。
---
```

多语言站点要用每种语言分别写描述，不要把英文描述照搬过来；站点级的兜底描述也按语言设置：

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

每个页面输出一条 canonical 链接，并为每个实际存在的译文输出一条 `hreflang` 备用链接，不需要任何配置：

```html {title="渲染结果（本页）" copy=false}
<link rel="canonical" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
<link rel="alternate" hreflang="zh-CN" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
<link rel="alternate" hreflang="en-US" href="https://oink.pgsty.com/docs/admin/analytics/">
```

`hreflang` 的语言代码来自各语言的 `locale`（本站是 `en-US` 与 `zh-CN`），链接依据 Hugo 的译文配对生成。页面缺少某种语言的译文时，不会输出该语言的 `hreflang` 与 `og:locale:alternate`，尽管语言切换器仍会提供那种语言的首页。

博客索引分页后，每一页都有自己的 canonical URL。从第 2 页起不输出 `hreflang` 备用链接，因为各语言的文章数量可能不同，分页边界对不上。

canonical 由 `baseURL` 拼出。`baseURL` 配错时，搜索引擎会被引向不存在的地址，这比构建失败更难察觉，所以上线前请按[验收清单](/zh/docs/admin/deploy/#checklist)检查一遍。语言本身的配置见[多语言](/zh/docs/customize/i18n/)。

## 社交卡片 {#social-cards}

主题调用 Hugo 内置的 Open Graph 与 Twitter 卡片模板，标题、描述、URL、语言与站名都会自动填好：

```html {title="渲染结果（本页）" copy=false}
<meta property="og:title" content="分析与 SEO">
<meta property="og:type" content="article">
<meta property="og:url" content="https://oink.pgsty.com/zh/docs/admin/analytics/">
<meta property="og:locale" content="zh_CN">
<meta property="og:locale:alternate" content="en_US">
<meta name="twitter:card" content="summary">
```

想让分享出去的链接带一张图，在页面 front matter 里设置 `images`：

```yaml {title="content/blog/release-3.0.zh.md"}
---
title: 3.0 版本发布
images: [/images/release-3.0.webp]
---
```

全站兜底图写在 `params` 下的同名键里：

```yaml {title="hugo.yml"}
params:
  images: [/images/social-card.webp]
```

有图时，`twitter:card` 变为 `summary_large_image`，输出里也会多出 `og:image` 与 `twitter:image`。本站两处都没有设置，所以上面的输出里没有图片标签。

## 站点地图 {#sitemap}

站点地图由 Hugo 自己生成；多语言站点生成的是一个索引，指向每种语言各自的站点地图：

```text {title="public/ 下的结构" copy=false}
sitemap.xml        ← 索引，指向下面两个
en/sitemap.xml
zh/sitemap.xml
```

站点级默认值与页面级覆盖用的都是 Hugo 原生的键：

```yaml {title="hugo.yml"}
sitemap:
  changefreq: monthly
  filename: sitemap.xml
  priority: 0.5
```

```yaml {title="content/release/notes.zh.md"}
---
title: 发布说明
sitemap:
  priority: 0.8
---
```

搜索引擎只把 `changefreq` 与 `priority` 当作提示，可以不理会。更值得做的是在上线前确认：草稿、私有内容和非规范副本没有进入站点地图，每种语言也都有自己的那一份。

## robots.txt 与不收录 {#robots}

只有站点打开开关，Hugo 才会生成 `robots.txt`：

```yaml {title="hugo.yml"}
enableRobotsTXT: true
```

内容由主题提供，取决于[构建环境](/zh/docs/admin/deploy/#preview-builds)：

```text {title="production 构建" copy=false}
User-agent: *
Allow: /

Sitemap: https://oink.pgsty.com/sitemap.xml
```

```text {title="非 production 构建" copy=false}
User-agent: *
Disallow: /
```

页面上的 `robots` meta 标签遵循同一规则：生产构建中是 `index, follow`，其它环境以及任何环境下的打印输出都是 `noindex, nofollow`。

主题没有按页设置 `noindex` 的开关。要可靠地让某页不被收录，就不要发布它：用 `draft: true` 或 Hugo 的 `build` 选项。页面必须发布却又不想被收录时，在 `head-end.html` 钩子里自己输出一条标签；这样页面上会有两条 `robots` 标签，如何合并由各家搜索引擎决定。

## 收录检查 {#indexing}

上线一两周后，确认搜索引擎看到的就是你以为自己发布的站点：

1. 抓取权限：`<baseURL>/robots.txt` 是 `Allow: /`，而不是 `Disallow: /`。
1. 页面清单：`<baseURL>/sitemap.xml` 能打开，顺着它点进某种语言的站点地图，核对页面数量。
1. 收录数量：搜索 `site:你的域名`，数量级对得上就行。
1. 规范地址：搜索结果打开的是 canonical URL，而不是带 `?` 参数或旧域名的版本。
1. 主动提交：在 Google Search Console 与 Bing Webmaster Tools 中添加站点并提交 `sitemap.xml` 地址，比被动等待抓取更快。
{.steps}

## 验证 {#verify}

在站点根目录执行，把 `PAGE` 换成站点实际生成的某个页面（按需带上语言前缀）：

```bash {title="终端"}
hugo --gc --minify --printPathWarnings
PAGE=public/zh/docs/getting-started/index.html
test -f "$PAGE"

# canonical 应使用真实生产地址；production 的 robots 允许收录。
grep -o '<link[^>]*canonical[^>]*>' "$PAGE"
grep -o '<meta[^>]*robots[^>]*>' "$PAGE"
cat public/robots.txt
head -5 public/sitemap.xml

# 未配置 Google Analytics 时，应没有匹配结果。
grep -o '<script[^>]*googletagmanager[^>]*>' "$PAGE"
```

在浏览器 Network 面板中确认，统计请求带的是你自己的 measurement ID 或登记的域名。用 `--environment staging` 构建的部署不能出现任何统计请求；没有配置统计的站点在两种环境下都不会有统计请求，不过你启用的其它集成仍会访问各自的服务。

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — `baseURL`、验收清单与不被收录的预览部署
- [仓库与页面信息](/zh/docs/customize/repository/) — 反馈组件、编辑链接与最后修改时间
- [多语言](/zh/docs/customize/i18n/) — 语言配置决定 `hreflang` 与译文配对
- [Agent 支持](/zh/docs/customize/agents/) — 写给大模型的 `.md` 输出与 `llms.txt`
- [配置总览](/zh/docs/customize/config/) — `services`、`sitemap`、`enableRobotsTXT` 等键
