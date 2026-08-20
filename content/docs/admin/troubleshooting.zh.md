---
title: 排错与检查
linkTitle: 排错与检查
description: 构建、语言、搜索、平台四类故障的症状 → 原因 → 修法，以及站点可以自己跑的那几项检查。
weight: 60
search_keywords: [排错, 故障, 报错, 构建失败, 搜索不到, 404, baseURL, 检查, troubleshooting, error, debug]
aliases:
  - /docs/tutorial/troubleshooting/
---

出问题时先做一次干净的生产构建，从第一条错误开始看，后面的多半是级联结果：

```bash {title="终端"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning --logLevel info
```

日志里出现 npm、PostCSS、Autoprefixer 或下载浏览器资源的步骤，说明配置里混进了上游 Docsy 的流程。OINK 消费端的构建只有一条 Hugo 命令。

下面四张表按「症状 → 原因 → 修法」组织，找到症状那一行即可，不必从头读。

## 构建 {#build}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| 构建报要求更高的 Hugo 版本 | 装的是标准版而不是 Extended，或版本低于 {{< param hugoMinVersion >}} | `hugo version` 输出里必须有 `extended`。多个 Hugo 共存时先查 `PATH` 与版本固定配置，而不是再装一份 |
| `module "github.com/pgsty/oink" not found` | 主题没解析出来 | Hugo Module：看 `hugo mod graph`、`go.mod`、`go.sum`，以及有没有多余的 workspace / replace。submodule：CI 有没有在 Hugo 之前跑 `git submodule update --init`。归档 / 克隆：`theme:` 的值要与 `themes/` 下的目录名一致 |
| 模块下载卡住或超时 | Go 的模块代理不通 | Hugo 通过 Go 拉模块，所以走 `GOPROXY`。国内网络可以 `export GOPROXY=https://goproxy.cn,direct`；隔离环境改用离线归档或提交 `themes/oink/` |
| 页面上出现 `{.cards}`、`{.steps}`、`{caption=…}` 这类原样文字 | 站点没开 goldmark 的块级属性 | 站点的 `hugo.yml` 里必须有下面那三项，主题的 `markup` 配置不会被 Hugo 合并进来 |
| 图片带属性行时被包进了 `<p>`，图注没生效 | 缺 `wrapStandAloneImageWithinParagraph: false` | 同上，三项一起加 |
| 行内 HTML 被转义成文字 | 缺 `renderer.unsafe: true` | 同上 |
| `\(…\)` `$$…$$` 原样显示 | 站点没启用 goldmark passthrough | 见[公式](/zh/docs/components/math/)；`math: true` 不是启用开关 |
| `shortcode "tabs" must be closed or self-closed` | 有 `{{</* tabs */>}}` 没写对应的 `{{</* /tabs */>}}` | 报错里带 `文件:行:列`，去那一行补上闭合标记 |
| `template for shortcode "tabs" not found` | 正文里写了一个不存在的 shortcode，或引用 shortcode 语法时没有转义 | 文档里讲解 shortcode 语法时必须转义：在开标记与闭标记的内侧各加一对 `/*` 与 `*/`，Hugo 才会把它当文字而不是调用。名字打错就改回正确的名字 |
| `... attributes: unknown attribute "witdh" at ...` | 属性行里的键拼错或不被允许 | 属性行只接受该组件的允许键、`class`、`data-*`、`aria-*`；`style` 与 `on*` 一律构建失败。允许的键就写在报错括号里 |
| `shortcode "field": unsupported parameter "colour" at ...` | shortcode 参数名不对 | **组件参数**——shortcode 参数与属性行的键——一律构建失败，不做静默降级。报错格式固定为「哪个 shortcode → 哪个参数 → 哪个文件的第几行」，照着改即可 |
| `invalid params.ui.page_width "widee" (allowed: normal \| wide \| full) -- using "normal"` | **配置或 front matter 的取值**，不在允许集合里 | 配置类的错误降级而不中断，一个笔误不会让 `hugo server` 下每个 URL 都返回 500。消息里带键名、收到的值和实际用的回退值。构建加 `--panicOnWarning`，它就上不了线 |
| 某个页面设置不生效，也没有任何提示 | 键写在了 front matter 的 `ui:` 段里 | 页面键写在 front matter 顶层，键名是站点键去掉 `ui.`。写进 `ui:` 段的键没有人读，也没有人报错，见[页面参数](/zh/docs/write/frontmatter/) |
| 构建通过但线上少东西 | 有 WARNING 没人看 | 构建命令加 `--panicOnWarning`。非法配置取值、giscus 必填键缺失、不支持的 `comments.type`、Hugo 的弃用提示都只是告警 |

那三项 goldmark 配置：

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      wrapStandAloneImageWithinParagraph: false
      attribute:
        block: true
    renderer:
      unsafe: true
```

两个最常见的 shortcode 报错长这样，注意结尾的 `文件:行:列`：

```text {title="构建输出" copy=false}
ERROR error building site: assemble: failed to create page from pageMetaSource /a:
  "…/content/docs/x.md:4:1": failed to extract shortcode:
  shortcode "tabs" must be closed or self-closed

ERROR error building site: assemble: failed to create page from pageMetaSource /a:
  "…/content/docs/x.md:4:5": failed to extract shortcode:
  template for shortcode "tabs" not found
```

## 语言 {#language}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| 译文页面不出现 | 四种可能，按顺序查 | ① `hugo.yml` 里有 `languages.zh` 且设了 `weight`；② 文件名是 `page.zh.md`，`zh` 必须小写；③ 译文 front matter 没有 `draft: true`，`date` 不在未来；④ 影响路由的元数据与源文件一致 |
| 语言切换跳到了首页 | Hugo 没找到对应译文 | 这是设计行为：找不到译文就回退到目标语言首页。要跳到对应页面，需要那个译文文件确实存在 |
| 锚点链接打开了页面却不定位 | 译文标题文字不同，自动生成的 ID 也不同 | 在译文标题上显式写英文 ID：`## 安装 {#installation}`。标题里含 shortcode 或行内 HTML 时不要凭文本猜 ID，去看英文页渲染出来的 HTML |
| 菜单 / 首页分区没翻译 | 这些不在页面里，在配置和数据文件里 | 菜单在 `languages.<lang>.menus`，首页分区在 `data/home/<lang>.yaml`，界面字符串在 `i18n/<lang>.yaml`，见[多语言](/zh/docs/customize/i18n/) |
| 中文页 `hreflang` 指向英文首页 | 该页没有英文对等文件 | 补上英文页，或接受这个回退：它同时是「Hugo 有没有认出译文关系」的探针 |

## 搜索 {#search}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| 搜索框有但一直没结果 | 索引没生成 | `params.offline_search: true` 之后，产物根目录下应该有 `offline-search-index.<语言>.json`，每种语言一份。没有就是没开 |
| 索引文件请求 404 | `baseURL` 不对 | 子路径部署下 `baseURL` 配错是索引 404 最常见的原因。先在浏览器网络面板看它去哪里取索引，见[发布上线](/zh/docs/admin/deploy/#baseurl) |
| `hugo server` 下搜不了，构建出来就正常 | 站点把预览期的索引关掉了 | `params.offline_search_on_serve` 默认为 `true`，预览与线上行为一致；配置里显式写成 `false` 时预览不生成索引，删掉或改回 `true` |
| 中文搜不到 | 多数不是分词问题 | 中文查询走主题的 CJK 子串回退。先确认那个中文页面的内容进了中文索引（打开 `offline-search-index.zh.json` 查一下），再看分词 |
| 新页面搜不到，旧页面正常 | 索引是构建产物 | 重新构建。`hugo server` 下改了页面要等它重建完 |
| `params.search.algolia requires explicit appId, apiKey, and indexName values` | Algolia 三个键没配全 | 三个键必须显式给全，主题不会替你用别的项目的 DocSearch 凭据。不用 Algolia 就把这段配置删掉 |
| 命令面板搜不到内容 | 它与全文检索是两件事 | 索引不可用时命令面板仍然能打开，只是提示索引不可用，页面操作与命令照常，见[命令面板](/zh/docs/customize/panel/) |

## 平台 {#platform}

| 症状 | 原因 | 修法 |
| --- | --- | --- |
| GitHub Pages 上页面 404 或样式全丢 | 项目站点的 URL 带仓库路径，`baseURL` 没带 | 用工作流里的 `--baseURL "${{ steps.pages.outputs.base_url }}/"`，别手写。完整工作流见[发布上线](/zh/docs/admin/deploy/#hosts) |
| GitHub Pages 上「最后修改时间」「贡献者」全空 | checkout 是浅克隆 | `actions/checkout` 加 `fetch-depth: 0`：`enableGitInfo` 要读完整历史 |
| Cloudflare Pages 构建报 Hugo 版本太低 | 构建镜像的默认 Hugo 低于主题要求 | 在 Production 和 Preview 两个环境都设 `HUGO_VERSION`，并设 `SKIP_DEPENDENCY_INSTALL=1` |
| 托管商构建时拉不到主题 | 构建环境没有 Go | Hugo Module 需要 Go。平台不提供就改用 submodule 或把 `themes/oink/` 提交进仓库 |
| CI 上构建结果和本地不一样 | `go.work` 参与了 CI 构建 | CI 里设 `GOWORK: off` 与 `HUGO_MODULE_WORKSPACE: off`，让它只认 `go.mod` 里固定的版本 |
| 预览部署被搜索引擎收录了 | 预览也用了 production 环境构建 | 预览构建不要带 `--environment production`，非 production 自带 `noindex` 与 `Disallow: /`，见[分析与 SEO](/zh/docs/admin/analytics/#robots) |
| macOS 报打开文件过多 | 实时预览监视的文件超过了 shell 限制 | 先把生成目录与无关目录排除出监视范围，这通常才是根因；再考虑 `ulimit -n` |
| WSL 下很慢或漏掉改动 | 跨 Windows 挂载点工作 | 让 Hugo 处理 Linux 文件系统里的路径，跨文件系统的变更通知和权限行为会让实时重载失效 |
| 缺 Bootstrap / Font Awesome / Lunr / Mermaid 之类资源 | 发行物不完整 | 不要用 CDN URL 掩盖。确认 `assets/third_party/`、`assets/js/third_party/`、`static/webfonts/`、`VENDOR.json` 都在；确实缺就重新获取同一个固定版本 |

## 站点自带检查 {#site-checks}

除了构建本身，站点还可以自己跑这几项。前两条任何 OINK 站点都能用，后面几条是本仓库的 npm 脚本，其它站点跑等价的检查即可。

| 检查 | 命令 | 管什么 |
| --- | --- | --- |
| 零告警构建 | `hugo --printPathWarnings --panicOnWarning` | 重复输出路径、参数非法、外部集成配置不全 |
| 输出信任检查 | `python3 bin/check-output-security.py --public public --base-url https://oink.pgsty.com/` | 四种输出里的每个 `href` / `src` 都是站内相对或 `http(s)` / `mailto` / `tel`；没有 `javascript:` URL、没有行内 `on*` 事件处理器；跨站的 `<iframe>` `<script>` `<img>` 等要显式加 `--third-party` 才放行 |
| 翻译对等 | `node scripts/check-doc-translations.mjs --public public` | 每个英文页有没有中文对等页，以及渲染后的标题 ID 是否逐一对齐；锚点链接错位在这里暴露 |
| 完整门禁 | `npm test` | 下面六项串起来跑 |
{.fields}

`npm test` 里的六项各管一段：

- `test:base` — 先构建一次，再跑 Markdown 风格、翻译对等、渲染后的 Markdown 与链接检查。
- `test:hugo-build` — 构建断言：博客元数据、RSS、内容组件、构建过程零弃用提示。
- `test:md-output` — Markdown 与 `llms.txt` 输出的 golden 比对，字节级。改了组件的 Markdown 形态就会在这里挂。
- `test:alt-site` — 用 `tests/fixtures/*.yml` 里的替代配置各构建一次，确认不同配置组合都能起来。
- `test:favicons` — head 输出的 golden 比对。
- `test:release-pin-contract` — 站点公告的版本与 `go.mod` 固定的版本是否一致。

浏览器行为另开一套：`npm run test:browser` 依次跑 Playwright 的无障碍（axe WCAG AA）、响应式外壳、键盘导航、内容组件、代码块与场景组件六个套件。

> [!TIP] `check-output-security.py` 在主题仓库里
> 它在主题仓库的 `bin/` 下，是产品级的信任检查，任何 OINK 站点都可以跑，不依赖站点的测试框架。克隆主题仓库后指向自己的 `public/` 即可，参数与用法见[断网构建验证](/zh/docs/admin/preview/#air-gapped)。

## 诊断习惯 {#habits}

上面的表覆盖不到的问题，按这几条挖：

- 用固定的 Hugo Extended 版本复现，不在版本浮动的环境里判断。
- 清掉 `public/` 与 `resources/_gen` 再重建，排除陈旧缓存。
- 对比开发与生产两套配置层，很多只在线上出现的问题是环境差异。
- 看第一条错误，不是最后那条。
- 用一个最小页面区分「主题行为」和「站点覆盖」：把可疑内容单独放一页，站点覆盖分批重新启用，定位到具体那一项。
- 看故障页面的浏览器控制台与网络面板，尤其是 404 的资源路径。

## 求助渠道 {#getting-help}
开 issue 时带上这几样，能省掉一轮来回：Hugo 版本（`hugo version` 完整输出）、主题版本（`hugo mod graph | grep oink`）、第一条完整错误、能复现的最小页面或最小站点。

- 主题与文档的问题：<https://github.com/pgsty/oink/issues>
- 本站内容的问题：<https://github.com/pgsty/oink.pgsty.com/issues>
- 上游 Docsy 的兼容性讨论：<https://github.com/google/docsy/discussions>

## 相关 {#related}

- [本地预览](/zh/docs/admin/preview/) — 干净构建、清缓存、容器与工作区
- [发布上线](/zh/docs/admin/deploy/) — `baseURL`、验收清单与回滚
- [版本升级](/zh/docs/admin/upgrade/) — 升级引入的问题与迁移工具
- [全文检索](/zh/docs/customize/search/) — 索引范围、权重与 Algolia
- [多语言](/zh/docs/customize/i18n/) — 语言配置与锚点对齐流程
