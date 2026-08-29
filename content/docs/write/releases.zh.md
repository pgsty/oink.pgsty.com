---
title: 发布与下载页
linkTitle: 发布与下载页
description: 把版本号、标签、归档链接、校验和与安装命令写成本地事实，再让发布卡片、资产表、下载区块和索引页从同一份记录推导出来。
weight: 60
search_keywords: [发布, 下载, release, download, 校验和, checksums, sha256, 发布卡片, 资产表, 滚动渠道, 固定版本]
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
aliases:
  - /docs/scenarios/releases/
---

OINK 把发布事实集中在两处本地数据：页面 front matter 的 `release_url` 指明这一页对应哪个 GitHub 发布，`data/download/<key>.yaml` 记录安装方式。发布卡片、资产表、下载区块与索引页都从这两处推导。构建期不访问 GitHub，也不声称某个标签或资产已经存在。

> [!NOTE] 本页自带演示用的发布事实
> front matter 里放了一个 `release_url`（OINK v0.4.0），下面的卡片、资产表与下载区块都是真实渲染。校验和与资产文件名是构造的：URL 由组件按仓库与标签本地推导，指向的文件在真实发布里不存在，不要用这里的哈希校验产物。

## 组件与事实来源 {#overview}

| 你要的 | 用什么 | 事实来自 |
| --- | --- | --- |
| 版本摘要卡片（标签、日期、归档、仓库） | `release-card` | 页面的 `release_url` |
| 校验和资产表 | `checksums` 围栏 / `release-assets` | 正文里的 `sha*sum` 行 |
| 多渠道下载区块 | `download` | `data/download/<key>.yaml` |
| 按时间排序的发布索引页 | `layout: releases` | 各页的 `release_url`，没有则用标题 |

## 页面拥有发布事实 {#release-facts}

发布页 front matter 里的一个键就是全部记录——精确到标签的 GitHub 发布 URL：

```yaml {title="content/blog/release/0.4.0.zh.md"}
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
```

owner、项目名与标签从 URL 里解析出来，日期用页面自己的 `date`。不是精确
标签形式的 GitHub 发布 URL 会警告并跳过发布区块——`--panicOnWarning` 构建
随之失败。0.5 的 `release` 映射（product / version / repo / tag / date /
prev / checksums）及其字符串简写已移除；仍携带它的页面会收到指名
`release_url` 的警告。

在需要摘要的位置放一个不带参数的 shortcode，调用里不接受任何事实：

```markdown {title="源码"}
{{</* release-card */>}}
```

{{< release-card >}}

卡片带着仅凭 URL 就能推导的四个链接——发布页、两种源码归档、仓库——全部本地推导。校验和文件放在正文下方的资产表里，版本对比在 GitHub 上看。

## 发布索引页 {#release-index}

一个分区可以改用发布索引布局。它列出小节里的每一个常规页面，从新到旧
——按页面日期排序，同一天内以标签里的版本号决胜（SemVer 优先级，非 SemVer
标签用确定的字典序兜底）：

```yaml {title="content/blog/release/_index.zh.md"}
---
title: 版本发布
layout: releases
---
```

`release_url` 可解析的条目读作「项目名 + 标签」——如 `oink v0.4.0`——下一行
是页面描述；没有它的页面保留自己的标题，版本之间夹一篇普通短文是合法条目，
不是警告。0.5 的 `release_products` 过滤与 `release_group_by_product` 分组
已移除；写了会警告。

本站的[版本发布](/zh/blog/release/)目前用普通博客列表。需要严格时间序时改用 `layout: releases`。

## 校验和资产 {#assets}

`checksums` 围栏是校验和表的原生形态，围栏里写 `sha*sum` 命令的原样输出：

````markdown {title="源码"}
```checksums
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
7b3d9e0c145a8f26d0b7e93c48156aa2f0d9c7b31e846a5029df1b6c7a3e8250 *oink-0.4.0-darwin-arm64.tar.gz
```
````

```checksums
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
7b3d9e0c145a8f26d0b7e93c48156aa2f0d9c7b31e846a5029df1b6c7a3e8250 *oink-0.4.0-darwin-arm64.tar.gz
```

只接受两种行：`<十六进制><两个空格><文件名>` 与 `<十六进制><空格>*<文件名>`。空行
与以 `#` 开头的行忽略。哈希长度决定算法（MD5 / SHA-1 / SHA-256 / SHA-512），一个块
里只能有一种算法。格式错误的行带行号告警并跳过；严格发布构建拒绝这条警告。文件名
必须是单个路径段。类型、操作系统与架构徽章由文件名推断，属于装饰，推断不出时不显示。

资产链接的基址：页面有 `release_url` front matter 时推导为 `https://github.com/<repo>/releases/download/<tag>/`；没有发布事实的页面必须显式写 `base=`。两者同时存在时报错。

````markdown {title="没有 release front matter 的页面"}
```checksums {base="https://repo.pigsty.io/oink/v0.4.0/" algo="sha256"}
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
```
````

`release-assets` 是同一个解析器与渲染器的 shortcode 形态。它多一个围栏没有的 `src=`，可以把校验和文件本身提交为页面资源或全局资产（`src` 与围栏内容互斥）；`group="auto"` 按平台与架构分组：

```markdown {title="源码"}
{{</* release-assets group="auto" */>}}
5a0c7d1e93b4826f0ad35c9e17b6402d8f1c95ae63d70b28c4e19a5f38207db6  oink-0.4.0-1.el9.x86_64.rpm
c93f16a8d052b7e41ac68d3907b25fe0a41d8c7362b95e0187ac4d63f9520ea8  oink-0.4.0-1.el9.aarch64.rpm
{{</* /release-assets */>}}
```

{{< release-assets group="auto" >}}
5a0c7d1e93b4826f0ad35c9e17b6402d8f1c95ae63d70b28c4e19a5f38207db6  oink-0.4.0-1.el9.x86_64.rpm
c93f16a8d052b7e41ac68d3907b25fe0a41d8c7362b95e0187ac4d63f9520ea8  oink-0.4.0-1.el9.aarch64.rpm
{{< /release-assets >}}

HTML 里哈希截断显示，完整哈希保留在无障碍名称与复制源里，复制按钮由按需加载的本地运行时提供。禁用 JavaScript 时仍是一张完整的带链接表格。打印展开完整哈希且不带控件，Markdown 与 RSS 是完整哈希的管道表。

## 下载渠道数据 {#download-data}

安装方式属于产品，不属于某一次发布，因此存放在 `data/download/<key>.yaml`。本站真实的记录是 `data/download/prd5.yaml`：

```yaml {title="data/download/prd5.yaml"}
version: 0.4.0
repo: pgsty/oink
published: true
channels:
  - id: script
    kind: rolling
    title: Install script
    title_zh: 安装脚本
    icon: fa-solid fa-bolt
    note: The rolling channel deliberately contains no version interpolation.
    note_zh: 滚动渠道刻意不插入版本号。
    steps:
      - title: Install
        title_zh: 安装
        code: curl -fsSL https://repo.example.org/oink/install | bash
        lang: bash
  - id: source
    kind: pinned
    title: Source archive
    title_zh: 源码归档
    icon: fa-solid fa-code-branch
    url: https://github.com/pgsty/oink/archive/refs/tags/${tag}.tar.gz
    steps:
      - title: Clone the tag
        title_zh: 克隆标签
        code: git clone --branch ${tag} https://github.com/pgsty/oink.git
        lang: bash
  - id: assets
    kind: pinned
    title: Release assets
    title_zh: 发布资产
    icon: fa-solid fa-box-open
    checksums: |
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  oink-0.4.0.tar.gz
```

记录级字段只有 `version` `repo` `tag` `published` `channels` 五个。多写一个键时告警并
跳过记录，严格发布构建拒绝这条警告。`version` 也可以不写在这里，改由站点的
`params.version` 提供。

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `version` | 字符串 | 站点 `params.version` | 两处都没有时告警并跳过区块 |
| `repo` | `owner/name` | — | 固定版本渠道有链接或资产时必填 |
| `tag` | 字符串 | `v{version}` | 只允许 URL 安全字符 |
| `published` | 布尔 | `true` | `false` 表示不可变发布还不存在 |
| `channels` | 数组 | — | 非空 |
{.fields meta="type default"}

每个渠道：

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `^[a-z][a-z0-9-]*$` | — | 记录内唯一，用作锚点 |
| `kind` | `rolling` \| `pinned` | — | 决定能不能插值版本事实 |
| `title` | 本地化字符串 | — | 必须能解析出非空值 |
| `note` | 本地化字符串 | — | 渠道下方的一行说明 |
| `icon` | Font Awesome class 对 | — | 例如 `fa-solid fa-bolt` |
| `url` | http(s) 或站内路径 | — | 仅 `pinned` 可插值 |
| `steps[]` | `title` / `code` / `lang` | `lang: text` | 代码步骤走 OINK 的增强代码渲染器 |
| `checksums` | `sha*sum` 文本 | — | 仅 `pinned`；与 `checksums_src` 互斥 |
| `checksums_src` | 资产路径 | — | 把校验和文件当作 Hugo 资产读入 |
{.fields meta="type default"}

两条规则：

- 本地化按后缀解析：`<字段>_<精确语言>` → `<字段>_<主语言>` → `<字段>`。中文站解析 `title_zh_cn`、`title_zh`、`title`。不接受 camelCase 别名。
- 只有固定版本渠道的 `url` 与 `steps[].code` 能插值 `${version}` 与 `${tag}`。滚动渠道拒绝插值，避免稳定版安装命令被绑定到某个版本。标题与说明不插值。

## 渲染下载区块 {#download-shortcode}

`download` 接受恰好一个位置参数，即数据键：

```markdown {title="源码"}
{{</* download "prd5" */>}}
```

{{< download "prd5" >}}

HTML 渲染一排锚点 chip 加各渠道分区，代码步骤复用增强代码块与按需加载的复制运行时，校验和渠道复用上面那张资产表。打印静态展开同样的内容，Markdown 输出标题、源码围栏与完整哈希，RSS 不输出这个组件。

标签未打、资产未上传时，把记录标为未发布：

```yaml {title="data/download/<key>.yaml"}
published: false
```

滚动渠道照常可用。固定版本渠道变成不可点击的「待发布」状态，省略固定版本命令，禁用资产链接与复制控件。标签与资产可解析之后再翻转这个开关，不要先在正文里写入推测出来的链接。

同一份记录也能被 Landing 页面的 `download` 分区消费，不需要第二套版本模型，见[首页与落地页](/zh/docs/customize/home/)。

## 与博客发布注记的关系 {#release-notes}

两者分工：

- 博客里的发布注记（本站在 `content/blog/release/`）是叙事：这一版改了什么、怎么升级、有什么破坏性变更。它的 front matter 里带 `release_url`，页首可以放一张 `release-card`。写法见[博客与文章](/zh/docs/write/blog/)。
- 下载数据是操作：选哪个渠道、运行哪条命令、校验哪个哈希。它与版本号解耦，升级时只改一处。

一次发布的顺序：更新 `data/download/<key>.yaml` 的 `version` → 新写一篇 `content/blog/release/<version>.md` 并填 `release_url` → 标签与资产就绪后把 `published` 翻成 `true`。

## 验证 {#verify}

1. 构建零告警：`hugo --printPathWarnings --panicOnWarning`。哈希行格式、算法混用、缺 `base`、渠道字段拼错都在这一步失败。
2. 页面上：卡片显示的标签与日期与仓库一致；资产表每行都能点开真实的下载 URL。
3. 逐条核对哈希与实际产物：组件只负责排版，不验证内容。
4. 检查非 HTML 输出里哈希是完整的：

```bash
curl -s http://localhost:1313/zh/docs/write/releases/index.md | grep -c '^| '
```

5. 发布前先用 `published: false` 走一遍，标签与资产确实存在后再改成 `true`；每种语言、子路径部署各测一次。

## 相关 {#related}

- [博客与文章](/zh/docs/write/blog/) — 发布注记住在哪、怎么排
- [代码块](/zh/docs/components/code/) — 下载步骤里的代码渲染与复制
- [首页与落地页](/zh/docs/customize/home/) — Landing 的 `download` 分区
- [配置总览](/zh/docs/customize/config/) — `params.version` 与相关站点参数
- [版本升级](/zh/docs/admin/upgrade/) — 消费站怎么跟随主题版本
