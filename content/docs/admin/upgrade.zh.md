---
title: 版本升级
linkTitle: 版本升级
description: 固定已发布的主题版本、从 1.0 升到 1.1、迁移旧内容或 Docsy 站点，并在出问题时安全回滚。
weight: 50
search_keywords: [升级, 迁移, 版本, Hugo Module, hugo mod get, oink06, Docsy, jQuery, 破坏性变更, upgrade, migration]
aliases:
  - /docs/upgrade/
  - /docs/upgrade/upgrade/
  - /docs/upgrade/from-docsy/
  - /docs/upgrade/v0-4/
---

升级 OINK 是换一个固定的模块版本，再确认站点仍能零告警构建。内容多数不用改；
0.4 shortcode 改成当前 Markdown 原生形态时，有一套默认干跑的迁移工具，不必手改
几百个文件。

升级会改变渲染结果。先建一个升级分支再动手，回退的代价就是丢弃一个分支。

## 先看发布注记 {#release-notes}

每个版本的变更、破坏性改动与升级要点都写在发布注记里，升级前先读一遍目标版本那篇：

- 本站的 [项目博客](/zh/blog/) 里的 release 系列
- GitHub 上的 [Releases 页面](https://github.com/pgsty/oink/releases)

注记说明这次要不要改内容、有没有配置键被移除、默认行为有没有变化。跳过这一步的代价是升级后对着一个变了样的页面猜原因。

## 升级 Hugo Module {#hugo-module}

生产站点固定已发布标签或主动选定的不可变 commit，不跟随分支，也不用 `@latest`。
下面升级到已发布的 `v1.1.0` 标签；选择后续版本时，先确认已经发布且模块可以解析，
再替换示例中的版本。

```bash {title="终端"}
hugo mod get github.com/pgsty/oink@v1.1.0   # 已发布的版本标签
hugo mod tidy
hugo mod graph | grep github.com/pgsty/oink
```

选择标签时，确认模块图显示的就是该版本。主动选定的不可变 commit 通常会记录为 Go
伪版本；只要它解析到预期提交就是有效固定，但不能作为某个命名版本已发布的证据。
提交生成的 `go.mod` 与 `go.sum`。使用上面的公开标签时，`go.mod` 包含：

```go {title="go.mod"}
module github.com/pgsty/oink.pgsty.com

go 1.27.0

require github.com/pgsty/oink v1.1.0
```

> [!DANGER] 本地模块替换会盖掉这个固定版本
> `make dev` 和 `make check` 会仅对当前命令设置 `HUGO_MODULE_REPLACEMENTS`，使用同级的主题 checkout。判定某个发布标签是否可用时使用不带替换的 `make build`，否则验证的是本地那份代码。

使用 Git submodule 时，先确认没有本地修改，再拉取标签并检出精确的公开版本，
不要跟随远端分支：

```bash {title="终端"}
git -C themes/oink fetch origin --tags
git -C themes/oink checkout --detach v1.1.0
git add themes/oink
```

验证后提交更新的 submodule 指针。离线归档与克隆则用选定版本的完整内容替换
`themes/oink/`，确认 `theme:` 的值仍与目录名一致。安装方式的取舍见
[从零建站与其它安装方式](/zh/docs/start/from-scratch/)。

## 升级后必做 {#after-upgrade}

```bash {title="终端"}
rm -rf public resources/_gen
hugo --gc --minify --printPathWarnings --panicOnWarning --logLevel info
```

三件事一起做了：清掉可能过期的缓存、用新版本重新构建、把任何告警变成失败。

`--logLevel info` 包含信息级诊断，`--panicOnWarning` 将警告视为失败。升级 Hugo
之前，先处理当前固定版本发出的弃用提示；诊断级别与移除时间取决于具体的弃用功能。

构建通过之后，人眼再过一遍：首页、一个文档页、一个博客页、404、两种语言、两种配色、打印视图，以及站点自己定制过的地方。

## 从 1.0 升到 1.1 {#from-1-0}

> [!IMPORTANT] OINK 1.1.0 升级清单
> 本清单对应已发布的 v1.1.0。各消费站仍需更新依赖固定版本、重新构建和部署；
> 主题发布不会自动升级既有站点。

从 1.0.0 升级不需要迁移源码。Hugo Extended 0.160.1 仍是下限，CI 固定使用 0.165.0，
模块的 Go 1.27.0 声明与 1.0.0 相同。在 Hugo 0.160.x 上，非默认通用 `zh` 与区域中文
目录并存时，需要配置 `locale: zh-CN`。

选择新固定版本前，检查这些受影响的页面与行为：

| 范围 | 1.1 行为与升级检查 |
| --- | --- |
| 语言 | 32 份界面目录均具有相同的原生消息结构。检查站点语言标签、复数计数与 RTL 方向；正文译文仍由站点负责。 |
| 分类法 | 根页变成术语卡片目录，并提供分类法切换器。检查分类法模板或 CSS 覆盖、作者头像与本地化面包屑。 |
| 侧栏 | 缓存树保留页面有效设置，没有 JavaScript 时也可使用。检查折叠、悬停恢复、移动抽屉与键盘焦点，隐藏内容必须退出焦点顺序。 |
| 分组 | `sidebar_divider: true` 保留分区子文档。仅在明确不发布分组自身输出时添加 `build.render: never`；检查子导航、面包屑、翻页、Print 与 Book 目录。 |
| 根菜单 | 显式 `sidebar_root_menu: false` 对自根分区也生效；当前可链接的根仍作为位置标记显示。 |
| 自定义脚本 | 若还需支持 1.0.0，先检测 `OinkSidebar` 与 `OinkCommandPalette.registerSearchTail`。通过 API 恢复分支状态，不要直接修改 class 或 ARIA 属性。 |
| 文章复制 | 启用图片缩放时，以纯文本与富文本 HTML 复制图片和图注。预览提示不得进入文章复制内容，缩放与键盘操作仍需正常工作。 |
| Print 与 Redoc | 检查单页和 Book 聚合 Print、标题与标签页链接，以及真实部署前缀下的本地 Redoc 规范。本地规范路径相对于 `static/`。 |
{.fields}

`params.ui.image_zoom` 与 `params.offline_search` 仍默认关闭。新搜索钩子不会启用远程
服务，也不会添加查询遥测。`params.ui.scroll_spy` 与页面级 `scroll_spy` 在 1.x 中仍
作为 no-op 接受；移除无效补丁不影响普通大纲跟踪。

将受影响的站点级主题副本与新实现比较后再更新或移除。保留旧图片缩放脚本或侧栏
partial，会让站点继续使用旧实现，无法获得上游修复。

在文档站验证本地主题修改时，使用同级主题 checkout，不要提交文件系统模块替换：

```bash {title="终端 — 在 oink.pgsty.com 目录内"}
make check
make browser
make dev
```

这些命令验证的是本地 checkout。验收正式版本时，固定已发布标签，在没有模块替换的情况下
构建，并验证部署后的页面。创作与 API 细节见[内容分组](/zh/docs/write/organize/#group-only)、
[侧栏契约](/zh/docs/design/shell/#sidebar-runtime)、
[搜索动作](/zh/docs/customize/panel/#search-tail) 与[图片缩放](/zh/docs/components/image/#zoom)。

## 内容迁移工具 {#migration-toolkit}

0.4 的一批 shortcode 已换成当前 Markdown 原生形态。主题仓库带了一个只依赖
Python 标准库的工具做这件事：

```bash {title="终端"}
git clone https://github.com/pgsty/oink
cd oink

# 1. 只读盘点：一次看多个站点要改什么，可导出 Markdown / JSON 报告
python3 bin/migrations/oink06.py report --sites ~/pgsty/oink.pgsty.com ~/www/ddia --md report.md

# 2. 干跑：打印每个文件的 diff 与计数，不写任何东西
python3 bin/migrations/oink06.py migrate --site ~/pgsty/oink.pgsty.com

# 3. 真改：原子写入
python3 bin/migrations/oink06.py migrate --site ~/pgsty/oink.pgsty.com --write

# 4. 查残留：还有旧语法就退出码 1
python3 bin/migrations/oink06.py check --site ~/pgsty/oink.pgsty.com
```

用它的时候记住四条：

- 干跑是默认行为，只有 `--write` 才落盘。先干跑，读 diff，再写。
- 重跑一次应该零改动。第二次 `--write` 还报改动，说明有转换不收敛，停下来看那几个文件。
- 围栏里的文字不动，文档站里示范旧写法的代码块不会被误伤。
- 表达不了的构造原样保留，并附 `file:line` 与原因列出，作为手工处理清单，不是失败。

只想先转某一类时用 `--only`，键名见下表最后一列：

```bash {title="终端"}
python3 bin/migrations/oink06.py migrate --site ~/www/ddia --only callout,tabs --write
```

改完重新构建一次（带 `--panicOnWarning`），并逐页看渲染结果：工具保证语法正确，不保证语义符合预期。

## 0.4 → 当前语法映射 {#syntax-map}

| 0.4 的写法 | 当前写法 | `--only` 键 |
| --- | --- | --- |
| `{{%/* alert color= title= */%}}`、`{{%/* details */%}}`、`{{%/* pageinfo */%}}`、手写 `<details><summary>` | `> [!TYPE] 标题` / `> [!DETAILS]-` | `callout` |
| `{{</* tabpane */>}}` + `{{%/* tab header= */%}}`、`{{</* code-group */>}}` + `{{</* code-tab */>}}` | 相邻围栏加 `{tab= group= value=}`；正文型标签页用 `{{</* tabs */>}}` + `{{</* tab */>}}` | `tabs` |
| `{{</* filetree */>}}` 与 `filetree/folder`、`filetree/file` | `filetree` 数据围栏 | `filetree` |
| `{{</* gallery */>}}` 与 `gallery/image` | `gallery` 数据围栏 | `gallery` |
| `{{</* echarts */>}}`、`{{</* infographic */>}}` | 同名数据围栏（`$fn:` 不变，`js` 子围栏要挪到 `window.OinkEchartsFunctions`） | `datafence` |
| `doc-cards` / `doc-card`、`nav-cards` / `nav-card`、`card` / `cardpane`、`doc-carousel` | `{{</* cards */>}}` + `{{</* card */>}}`，或链接列表加 `{.cards}` | `cards` |
| `{{</* imgproc */>}}`、`{{</* image */>}}` | `![alt](src)` 加属性行 `{command= options= caption=}` | `image` |
| `{{</* readfile file= */>}}` | `{{</* include file= */>}}` | `include` |
| 围栏属性 `{filename="x"}` | `{title="x"}` | `fencetitle` |
| `{{</* badge outline= */>}}` | 去掉 `outline` 参数 | `badge` |
| `{{</* example */>}}` + 围栏、`{{</* book-figures kind="tbl" */>}}` | `{{</* eg */>}}…{{</* /eg */>}}`、`{{</* book-tables */>}}` | `eg` |
| `{{%/* _param x */%}}`、`iframe`、`conditional-text`、`blocks/*`、`netlify`、不带 kind 的 `xref` | 工具只报告，需要手工处理 | `reportonly` |
{.fields}

每个新写法长什么样、有哪些参数，去[组件](/zh/docs/components/)里对应的那一页。

## 从 Docsy 迁移 {#from-docsy}

OINK 是 Docsy 的硬分支：内容模型、`td-` 命名、Sass 变量、大部分 front matter 都还在。迁移的核心动作是删掉站点里复制的公共外壳，让主题的实现接管，而不是重写正文。

1. 固定目标版本。在 `go.mod` 里换成 OINK 的发布标签，或者用完整的版本化归档。评估期可以用不提交的 `go.work` 指向本地 checkout。

1. 清点覆盖项。把 `layouts/`、`assets/`、`static/` 下每个站点级文件归成四类：公共外壳的副本（验证后删）、OINK 已提供的组件（删或机械重命名）、品牌定制（保留，缩到最小 hook）、业务专属数据与交互（留在站点）。按引用关系删，不要清空 `layouts/`：首页、下载页这些地方可能还在调用你要删的 partial。

1. 搬配置。`title`、`languages.*`、`github_repo`、`github_branch`、`page_width`、`params.ui.*` 全部留在原来的语义位置，OINK 没有另起一套命名空间。搜索与 Logo 这类只要打开对应的键：

   ```yaml {title="hugo.yml"}
   params:
     logo: img/product.svg
     offline_search: true
   ```

   Docsy 的驼峰式检索键在 OINK 中已改名：`offlineSearch`、`offlineSearchIndex`、`offlineSearchMaxResults`、`offlineSearchOnServe`、`offlineSearchSummaryLength` 一律改为下划线形式。这一步要自己盯着改——那份「中断构建并报出新键名」的迁移登记表已经删除，旧键现在只是一个没人读的键，检索会一声不响地保持关闭。

1. 字体与样式的兼容点。站点的 `assets/scss/_variables_project.scss` 里那些 Docsy Sass 变量仍然生效，会作为字体角色的种子值，不用为了升级把它们删掉：`$td-fonts-serif`、`$font-family-sans-serif`、`$headings-font-family`、`$font-family-code` 各自喂给对应的字体角色。Docsy 的 Google Fonts 开关 `$td-enable-google-fonts`、`$td-google-font-name` 与 `$td-web-font-path` 主题已不再读取，留在文件里不影响构建，也不产生任何效果：OINK 自带 Inter、Chakra Petch 与 IBM Plex Mono，任何预设都不向 Google Fonts 发请求。想换字体走 token 层，见[品牌外观](/zh/docs/customize/brand/)。

1. 换 shortcode。Docsy 的 `alert`、`pageinfo`、`tabpane`、`card` 系列都有当前对应
   形态，用上面的[迁移工具](#migration-toolkit)批量转，`--only` 一类一类来。

1. 一次删一组，每组构建一次。在临时副本里演练，记下主题 commit、Hugo 版本、删了哪些文件、产出多少个 HTML；确认等价之后再在生产分支上重做一遍。
{.steps}

第二步里「验证后删」的那一类，通常是这些文件：

- `layouts/baseof.html` 与公共的 docs / blog `baseof*.html`；
- navbar、footer、sidebar、TOC、search、head CSS 的 partial 及其对应 hook；
- 旧的品牌文档外壳 partial；
- `asciinema`、`echarts`、`infographic`、`doc-carousel`、`details`、`tab` / `tabpane`、card 与 `param` 的 shortcode 副本；
- 只服务于上述实现的 JavaScript、Lunr 副本、轮播代码与 SCSS；
- 不再被任何站点资源需要的 PostCSS 与 Autoprefixer 步骤。

删完之后有两类问题会浮出来。

站点自己的脚本报 `$ is not defined`：主题不带 jQuery，它以前由 Docsy 在每个页面的 `<head>` 里加载。主题的功能都不需要它，仍然需要的站点自己引入：

```html {title="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

用 Docsy `blocks/*` 搭的首页在 OINK 构建中报
`template for shortcode "blocks/cover" not found`：主题没有这一组 shortcode。改用
`data/home/<语言>.yaml` 的首页分区，或给页面写 `layout: landing`，见
[首页与落地页](/zh/docs/customize/home/)。

## 从 0.4 升级的要点 {#from-0-4}

0.4 改了几个默认行为。升级后发现页面多了或少了东西，先看这几条：

- 顺序翻页默认开启。`docs`、`book`、`blog` 页尾都有上一页 / 下一页；文档沿侧栏树走，博客沿时间走。刻意不属于任何序列的页面用 `pager: false` 退出。
- 顶栏在所有布局上都显示。紧凑状态只有一行图标导航，没有第二套移动端手风琴菜单，依赖旧移动菜单的本地脚本与测试要删掉。整个分区不要顶栏时用 cascade 里的 `navbar_enabled: false`。
- 页脚默认 `fat` 且全站生效。只接受 `fat` / `slim` / `none`；页脚数据必须放在
  `data/footer/<语言>.yaml`（单语言站点用 `data/footer.yaml`），`data/home` 里残留的
  `footer` 键会告警并提示新位置，严格发布构建拒绝这条警告。
- 单键导航默认开启：`/` 打开完整搜索，`\` 只进命令模式。培训材料里描述旧行为的地方要改。页面操作也挪到了面包屑旁边的拆分按钮上。
- 代码块的 DOM 变了。`.td-code` 外壳套在原来的 `.highlight` 外面（`.highlight` 与 `.chroma` 都保留），站点 CSS 里 `.td-content > .highlight` 这类直接子选择器要改成后代选择器 `.td-content .highlight`。
- 两个 ICP 页脚参数被移除：`footer_icp` 与 `footer_icp_url` 换成一个支持行内 Markdown 的字符串。

  ```yaml {title="hugo.yml"}
  params:
    footer_center_info: '[京ICP备00000000号](https://beian.miit.gov.cn/)'
  ```

- 数学公式要站点自己开 passthrough。Hugo 不会合并主题的 `markup` 配置，用 `\(…\)`、`\[…\]`、`$$…$$` 的站点必须在自己的 `hugo.yml` 里启用 goldmark passthrough 扩展，见[公式](/zh/docs/components/math/)。

这几项的完整配置都在[配置总览](/zh/docs/customize/config/)与[布局与页面类型](/zh/docs/customize/layout/)。

## 验证 {#verify}

升级不是「构建通过」就算完，按表面分别看：

| 表面 | 看什么 |
| --- | --- |
| 文档 / Book | 侧栏顺序、翻页、标题、页面操作、编号与交叉引用 |
| 博客 | 时间顺序翻页、RSS 归属、顶栏与页脚 |
| 首页 / Landing | 无 JS 时的内容、紧凑菜单、打印 |
| 发布页 | 推导出的下载 URL、校验和、发布状态 |
| 组件 | 站点用得最多的那几个组件各找一页看渲染结果 |
| 无障碍 | 纯键盘走一遍、焦点顺序、两种配色、强制颜色模式 |
| 部署 | 站内链接与资源都保留了 base path 前缀 |
{.fields}

本站的完整门禁是：

```bash {title="终端"}
make check     # 同级本地主题：构建、输出、翻译与渲染后链接
make browser   # 同级本地主题：无障碍、响应式与交互行为
make build     # go.mod 固定的公开主题，不带本地替换
```

其它站点跑等价的构建、链接、输出与浏览器检查即可，细节见[排错与检查](/zh/docs/admin/troubleshooting/#site-checks)。

> [!IMPORTANT] 本地构建成功不等于发布完成
> 源码提交通过验收、公开标签能通过模块代理解析、消费站固定版本及校验和、生产部署
> 通过验证，是彼此独立的状态。一次绿色的本地构建不能代替其它证据。

最后一步在真实环境上做：先部署一份预览，在真实 URL 上验证页面与浏览器的网络请求，评审通过再合并，合并后在生产上做一次冒烟测试。

## 回滚 {#rollback}

回滚的是版本固定，不是工作树：

```bash {title="终端"}
hugo mod get github.com/pgsty/oink@v1.0.0   # 示例：本站上一个已知可用的标签
hugo mod tidy
rm -rf public resources/_gen
hugo --gc --minify --panicOnWarning
```

三条原则：

- 保留升级前的模块固定、站点 commit 与已知可用的部署产物，回滚时三者一起恢复。
- 不要只回滚一部分。给新主题塞回几个旧布局副本，会得到一个比任何完整版本都更难诊断的混合状态。
- 升级分支与验收证据都留着。回滚是为了先恢复线上，不是丢掉已经做完的工作。

线上产物本身的回滚（重新发布上一个部署）见[发布上线](/zh/docs/admin/deploy/#rollback)。

## 相关 {#related}

- [发布上线](/zh/docs/admin/deploy/) — 部署产物的回滚
- [排错与检查](/zh/docs/admin/troubleshooting/) — 升级后构建报错怎么读
- [本地预览](/zh/docs/admin/preview/) — 清缓存与 `go.work` 工作区
- [从零建站与其它安装方式](/zh/docs/start/from-scratch/) — 四种安装方式的取舍
- [组件总览](/zh/docs/components/) — 每个组件的当前写法
