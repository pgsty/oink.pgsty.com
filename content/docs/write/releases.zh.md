---
title: 发布与下载页
linkTitle: 发布与下载页
description: 发布一个带 GitHub Release 卡片、校验和资产表与安装说明的版本页，全部内容都来自仓库里提交的事实。
weight: 60
search_keywords: [发布, 下载, release, download, 校验和, checksums, sha256, 发布卡片, 资产表, 滚动渠道, 固定版本]
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
aliases:
  - /docs/scenarios/releases/
---

发布页要告诉读者这一版发布了什么，并让他们安全地下载：一张链接到 GitHub Release 与源码归档的卡片，一张列出文件及其校验和的表格，以及每种获取方式的安装说明。OINK 从仓库里提交的事实生成这一切：页面 front matter 里的一个 `release_url`、粘贴进正文的 `sha256sum` 输出，以及一份 `data/download/<key>.yaml` 记录。因此构建时不会访问 GitHub。

> [!NOTE] 本页的示例都是真实渲染的
> 本页自己的 front matter 把 `release_url` 设为 OINK v0.4.0，所以下面的卡片、资产表与下载区块都是实际输出。但校验和与资产文件名是编造的，生成的下载链接指向并不存在的文件。不要用这些哈希校验任何东西。

## 发布页由什么组成 {#overview}

| 你要的 | 用什么渲染 | 事实来自 |
| --- | --- | --- |
| 摘要卡片：标签、日期、源码归档与仓库 | `release-card` | 页面的 `release_url` |
| 带校验和的资产表 | `checksums` 围栏，或 `release-assets` | 正文里的 `sha*sum` 行 |
| 多渠道安装说明 | `download` | `data/download/<key>.yaml` |
| 按时间排列的发布索引 | `layout: releases` | 各页的 `release_url`，没有则用标题 |

## 关联版本发布 {#release-facts}

发布页用一个 front matter 键指明对应的 GitHub Release，即精确到标签的发布地址：

```yaml {title="content/blog/release/0.4.0.zh.md"}
release_url: https://github.com/pgsty/oink/releases/tag/v0.4.0
```

owner、项目名与标签从 URL 中解析，日期取页面自己的 `date`。不是精确标签形式的 GitHub 发布地址会告警，并跳过发布区块。为 OINK 0.5 写的页面（`release` 映射、`release_products`、`release_group_by_product`）会收到指明替代写法的告警，见 [0.6.0 发布注记](/zh/release/0.6.0/#migration)。

在需要摘要的位置放上卡片。这个 shortcode 不接受参数，因为所有事实都来自 front matter：

```markdown {title="源码"}
{{</* release-card */>}}
```

{{< release-card >}}

卡片上有四个由 URL 推导出的链接：发布页本身、`.tar.gz` 与 `.zip` 两种源码归档，以及仓库。它不列校验和文件，那属于下面的资产表；也不和上一版做对比，GitHub 的发布页已经提供了。

## 校验和与资产 {#assets}

把 `sha256sum`（或任何 `sha*sum` 命令）的输出粘贴进 `checksums` 围栏，页面上就会出现一张下载表：每个文件都带链接，哈希可以一键复制。

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

每一行必须是 `<十六进制><两个空格><文件名>` 或 `<十六进制><空格>*<文件名>`，也就是这些工具原样打印的格式；空行和以 `#` 开头的行会被忽略。算法由哈希长度识别（MD5、SHA-1、SHA-256 或 SHA-512），一个代码块只能有一种算法。文件名必须是单个路径段；能从文件名识别出包类型、操作系统与架构时，会自动加上相应的徽章。格式错误的行，或算法与块内其它行不同的行，会带行号告警并被跳过，所以一处笔误只损失一行，而不是整张表。

页面有 `release_url` 时，资产链接指向 `https://github.com/<owner>/<repo>/releases/download/<tag>/`。没有 `release_url` 的页面，要用 `base=` 写明文件的托管位置。两者同时存在或都没有时，会告警并跳过整个代码块，因为猜出来的基址会让链接指向错误的文件：

````markdown {title="没有 release_url 的页面"}
```checksums {base="https://repo.pigsty.io/oink/v0.4.0/" algo="sha256"}
1e2f4c8a9d05b7361f8ac25d0e7b4913a6c8df215047eb9c3a1d6b8250f9e7c4  oink-0.4.0-linux-amd64.tar.gz
```
````

`algo=` 直接指定算法而不再自动识别，`group="auto"` 按平台与架构给行分组。

`release-assets` 是同一张表的 shortcode 形态。它比围栏多一个参数 `src=`，可以直接从页面资源或全局资产读取校验和文件，而不是在正文里逐行粘贴；`src` 与行内内容只能二选一。

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

HTML 表格里的哈希会截短显示，屏幕阅读器与复制按钮拿到的仍是完整值；复制按钮的脚本只在有这类表格的页面上加载。禁用 JavaScript 时，表格依然完整且带链接。打印与 RSS 显示完整哈希、不带控件，页面的 Markdown 输出是一张包含完整哈希的管道表。

## 下载区块 {#download-shortcode}

安装方式属于产品，而不属于某一次发布：安装脚本、源码归档、软件包仓库在各个版本之间都不变。把它们写进一份数据记录，再用 `download` 渲染。它唯一的参数是记录的键，即 `data/download/` 下去掉 `.yaml` 的文件名：

```markdown {title="源码"}
{{</* download "prd5" */>}}
```

{{< download "prd5" >}}

区块开头是一排指向各渠道的链接，后面每个渠道一节。代码步骤使用增强代码块及其复制按钮，带校验和的渠道渲染成与上面相同的资产表。打印时内容完整展开，Markdown 输出保留标题、代码围栏与完整哈希，RSS 不输出这个区块。落地页的 `download` 分区读取的是同一份记录，首页和文档对当前版本的说法因此始终一致，见[首页与落地页](/zh/docs/customize/home/)。

## 发布流程 {#release-notes}

发布注记与下载数据分工不同。发布注记写成一篇[博客文章](/zh/docs/write/blog/#release-notes)，告诉读者这一版改了什么、怎么升级、有哪些破坏性变更；它带有 `release_url`，开头可以放一张 `release-card`。下载数据告诉读者该选哪个渠道、运行哪条命令、校验哪个哈希；版本变化时只需改这一处。

按下面的顺序发布新版本，任何页面都不会链接到尚不存在的文件：

1. 在 `data/download/<key>.yaml` 中把 `version` 改成新版本，并设置 `published: false`。滚动渠道照常可用；固定版本渠道显示「待发布」状态，省略其中的命令，资产链接与复制按钮也被禁用。
2. 写好发布注记，例如 `content/blog/release/0.4.0.zh.md`，填上 `release_url`。
3. 创建标签、上传资产，然后改为 `published: true`。在此之前，不要在正文里写入推测出来的下载链接。

## 发布索引页 {#release-index}

存放发布注记的分区可以改用严格的时间序索引，而不是博客列表：

```yaml {title="content/blog/release/_index.zh.md"}
---
title: 版本发布
layout: releases
---
```

分区里的每个常规页面按 `date` 从新到旧排列；两页日期相同时，按标签里的版本号决定先后，采用 SemVer 优先级，非 SemVer 标签用确定的规则兜底。`release_url` 能解析的条目显示为「项目名 标签」，例如 `oink v0.4.0`，下面是页面描述。没有 `release_url` 的页面保留自己的标题，所以夹在两个版本之间的普通短文是正常条目，而不是错误。

如果想保留博客外壳，`blog_index: table` 也能给出一份按日期排列的紧凑归档；本站的[发布注记](/zh/release/)用的就是它。

## 下载数据格式 {#download-data}

本站真实使用的记录是 `data/download/prd5.yaml`，也就是上面渲染的那一份：

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

记录只接受下表中的五个顶层字段，出现其它键时会告警并跳过整个区块。

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `version` | 字符串 | 站点 `params.version` | 当前版本。记录与站点都没有时告警并跳过区块 |
| `repo` | `owner/name` | — | GitHub 仓库；固定版本渠道有链接或资产时必填 |
| `tag` | 字符串 | `v{version}` | 发布标签，只允许 URL 安全字符 |
| `published` | 布尔 | `true` | 带标签的发布与资产尚不存在时设为 `false` |
| `channels` | 数组 | — | 各渠道，按显示顺序排列。不能为空 |
{.fields meta="type default"}

每个渠道：

| 字段 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `^[a-z][a-z0-9-]*$` | — | 记录内唯一，同时用作渠道的锚点 |
| `kind` | `rolling` \| `pinned` | — | 渠道跟随最新版本还是固定在某个版本，决定能否插值版本信息 |
| `title` | 本地化字符串 | — | 渠道名称，必须能解析出非空值 |
| `note` | 本地化字符串 | — | 渠道名称下方的一行说明 |
| `icon` | Font Awesome class 对 | — | 例如 `fa-solid fa-bolt` |
| `url` | http(s) URL 或站内路径 | — | 下载链接，仅 `pinned` 渠道插值 |
| `steps[]` | `title` / `code` / `lang` | `lang: text` | 代码步骤，由 OINK 的增强代码块渲染 |
| `checksums` | `sha*sum` 文本 | — | 本渠道的资产。仅限 `pinned`；与 `checksums_src` 二选一 |
| `checksums_src` | 资产路径 | — | 把校验和文件作为 Hugo 资产读入 |
{.fields meta="type default"}

文本字段遵循两条规则：

- 本地化字段按后缀解析，顺序是 `<字段>_<精确语言>` → `<字段>_<主语言>` → `<字段>`。`zh-cn` 页面依次尝试 `title_zh_cn`、`title_zh`、`title`。不接受 camelCase 写法。
- 只有固定版本渠道的 `url` 与 `steps[].code` 会插值 `${version}` 与 `${tag}`。滚动渠道拒绝插值，这样用来安装最新版的命令就不会被悄悄绑死在某个版本上。标题与说明一律不插值。

## 验证 {#verify}

1. 带着诊断信息构建：`hugo --printPathWarnings`。哈希行格式错误、算法混用、缺少 `base`、渠道字段拼错，都会各自产生一条告警；逐条阅读，因为每一条都意味着页面上少了一行、一张表或一个渠道。
2. 在页面上确认：卡片显示的标签与日期和仓库一致，资产表的每一行都能打开真实的下载地址。
3. 亲自用真实产物逐个核对哈希。表格只负责展示你粘贴的哈希，不做任何校验。
4. 确认 Markdown 输出里的哈希是完整的：

   ```bash
   curl -s http://localhost:1313/zh/docs/write/releases/index.md | grep -c '^| '
   ```

5. 先用 `published: false` 预览一遍，标签与资产确实存在后再改成 `true`。每种语言都要检查；如果部署在子路径下，也要测一次。

## 相关 {#related}

- [博客与文章](/zh/docs/write/blog/) — 发布注记放在哪里、如何排序
- [代码块](/zh/docs/components/code/) — 下载步骤里的代码渲染与复制
- [首页与落地页](/zh/docs/customize/home/) — Landing 的 `download` 分区
- [配置总览](/zh/docs/customize/config/) — `params.version` 与相关站点参数
- [版本升级](/zh/docs/admin/upgrade/) — 站点如何跟进新的 OINK 版本
