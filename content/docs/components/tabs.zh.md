---
title: 标签页
linkTitle: 标签页
description: 把包管理器、配置格式这类可互相替代的写法并排放在一组标签页里，读者选一次，全站同组的标签页都跟着切换。
weight: 210
search_keywords: [标签页, Tabs, tab, group, value, 同步, 持久化, localStorage, hash, 选项卡]
---

标签页把几种可以互相替代的写法并排放在一起：包管理器、操作系统、YAML / TOML / JSON，或者同一项设置的环境变量与配置键。每位读者只看与自己相关的那一种。有先后顺序的步骤、彼此无关的内容不要放进标签页：读者一次只看到一个面板，其余的可能根本不会点开。

标签页有两种写法，共用同一个运行时、同一套 DOM 和相同的键盘操作。常用的是给相邻的代码围栏（以及 `filetree`、`gallery`、`map` 数据围栏）或表格加 `tab` 属性；面板里需要正文、列表或提示块时，用 `tabs`/`tab` shortcode。

## 最简例子 {#minimal}

连写两个带 `tab` 的围栏，中间只隔空行。

````markdown {title="源码"}
```bash {tab="Homebrew"}
brew install hugo
```
```bash {tab="Debian / Ubuntu"}
sudo apt install hugo
```
````

```bash {tab="Homebrew"}
brew install hugo
```
```bash {tab="Debian / Ubuntu"}
sudo apt install hugo
```

页面本身输出的是两个完整的代码块，各自以标签名作标题；页面加载后，浏览器再把相邻的块合成一组标签页。在 GitHub 上、打印出来或关闭 JavaScript 时，读者看到的是前后排列的两个代码块，任何内容都不会被藏起来。

## 分组：链接、同步与记忆 {#group}

在第一个块上写 `group`，并给这一组的每个块都写上 `value`。这组标签页就有了可分享的 URL hash `#<group>-<value>`，会与同组的其他标签页联动，还会记住读者的选择。

````markdown {title="源码"}
```bash {tab="npm" group="pkgmgr" value="npm"}
npm create hugo-site@latest
```
```bash {tab="pnpm" value="pnpm"}
pnpm create hugo-site
```
```bash {tab="Yarn" value="yarn"}
yarn create hugo-site
```
````

```bash {tab="npm" group="pkgmgr" value="npm"}
npm create hugo-site@latest
```
```bash {tab="pnpm" value="pnpm"}
pnpm create hugo-site
```
```bash {tab="Yarn" value="yarn"}
yarn create hugo-site
```

`tab` 是给人看的标签名，`value` 是写进 URL 和存储的标识，须匹配 `^[a-z0-9][a-z0-9_-]*$`。两者分开，改标签名就不会让链接失效。上面这组的 pnpm 面板对应 `#pkgmgr-pnpm`，带这个 hash 打开本页就会选中它。

## 同组联动 {#sync}

下面这组用了同一个 `group="pkgmgr"`，在任意一组里切换包管理器，另一组都会跟着切。选择保存在 `localStorage` 的 `td-tabs:v1:pkgmgr` 键里，对全站每个页面上的 `pkgmgr` 组都生效：读者选过一次 pnpm，之后处处都是 pnpm。

````markdown {title="源码"}
```bash {tab="npm" group="pkgmgr" value="npm"}
npm run build
```
```bash {tab="pnpm" value="pnpm"}
pnpm build
```
````

```bash {tab="npm" group="pkgmgr" value="npm"}
npm run build
```
```bash {tab="pnpm" value="pnpm"}
pnpm build
```

这组没有 `yarn` 面板。同组切换到某组没有的值时，这一组保持当前面板不变，所以任何一组总有一个面板处于选中状态。页面加载时，每组按以下顺序取第一个可用的选择：URL hash、已存储的选择、shortcode 的 `default` 或第一个块、第一个标签。通过 hash 选中面板不会覆盖读者已存储的选择。

## 表格也能做标签页 {#tables}

同样的属性写在表格的属性行上，相邻的表格就组成一组。

```markdown {title="源码"}
| 参数 | 默认值 |
| --- | --- |
| `shared_buffers` | 25% RAM |
| `max_connections` | 100 |
{tab="PostgreSQL 18" group="pgver" value="pg18"}

| 参数 | 默认值 |
| --- | --- |
| `shared_buffers` | 128MB |
| `max_connections` | 100 |
{tab="PostgreSQL 13" value="pg13"}
```

| 参数 | 默认值 |
| --- | --- |
| `shared_buffers` | 25% RAM |
| `max_connections` | 100 |
{tab="PostgreSQL 18" group="pgver" value="pg18"}

| 参数 | 默认值 |
| --- | --- |
| `shared_buffers` | 128MB |
| `max_connections` | 100 |
{tab="PostgreSQL 13" value="pg13"}

一组里只能全是围栏或全是表格，相邻的围栏和表格不会合成一组。需要混排时用 [shortcode 写法](#shortcode)。

## 标签名与文件名共存 {#tab-with-title}

围栏可以同时写 `tab` 和 `title`：标签名进标签栏，文件名留在面板内的标题栏里。

````markdown {title="源码"}
```yaml {tab="YAML" title="hugo.yml" group="conffmt" value="yaml"}
params:
  ui:
    sidebar_menu_foldable: true
```
```toml {tab="TOML" title="hugo.toml" value="toml"}
[params.ui]
sidebar_menu_foldable = true
```
````

```yaml {tab="YAML" title="hugo.yml" group="conffmt" value="yaml"}
params:
  ui:
    sidebar_menu_foldable: true
```
```toml {tab="TOML" title="hugo.toml" value="toml"}
[params.ui]
sidebar_menu_foldable = true
```

## 单独一个块只是带标题的块 {#single-block}

一组标签页至少需要两个相邻的同类块。只有一个带 `tab` 的块时，标签名成为它的标题，不会出现只有一个标签的标签栏。

````markdown {title="源码"}
```ini {tab="只有这一块"}
listen_addresses = '*'
```
````

```ini {tab="只有这一块"}
listen_addresses = '*'
```

同一组的块之间只能有空行，其他任何东西都会把这一组截断：一段正文、一个标题或列表；一条 HTML 注释（常见的是多出来的 `<!-- prettier-ignore-end -->`）；或者一个自己声明了 `group` 的块，它会开始新的一组。

## 正文标签页 {#shortcode}

面板里需要段落、列表、提示块或多个代码块时，用 `tabs`/`tab` shortcode。每个 `tab` 的内容都是完整的 Markdown。

`````markdown {title="源码"}
{{</* tabs group="deploy" default="pages" label="部署方式" */>}}
{{</* tab label="GitHub Pages" value="pages" */>}}
仓库自带 `.github/workflows/`，推到 `main` 就会构建并发布。

> [!NOTE]
> `baseURL` 要写成仓库的 Pages 地址。
{{</* /tab */>}}
{{</* tab label="Cloudflare Pages" value="cloudflare" */>}}
在 Cloudflare 控制台里连接仓库，构建命令：

```bash
hugo --gc --minify
```
{{</* /tab */>}}
{{</* /tabs */>}}
`````

{{< tabs group="deploy" default="pages" label="部署方式" >}}
{{< tab label="GitHub Pages" value="pages" >}}
仓库自带 `.github/workflows/`，推到 `main` 就会构建并发布。

> [!NOTE]
> `baseURL` 要写成仓库的 Pages 地址。
{{< /tab >}}
{{< tab label="Cloudflare Pages" value="cloudflare" >}}
在 Cloudflare 控制台里连接仓库，构建命令：

```bash
hugo --gc --minify
```
{{< /tab >}}
{{< /tabs >}}

`default` 指定初始面板，必须等于某个子项的 `value`，并且需要 `group`。没有 `group` 时，主题自己把各个标签编号为 `tab1`、`tab2`……，写了 `value` 会告警并被忽略；这样的一组只在本地切换，不改 URL，也不写存储。

shortcode 写法在构建时检查整组标签页。属性写法在构建时只检查每个块自己的属性，因为这些块要到浏览器里才合成一组；整组层面的问题，例如后面某个块没写 `value`、两个块的值重复，会作为告警出现在浏览器控制台里。

## 输出形态 {#outputs}

只有用到标签页的页面才加载 `tabs.js`。它运行之前，以及打印、RSS 和没有 JavaScript 的浏览器中，每个面板都以带标题的分节显示，没有标签栏。Markdown 输出中，围栏写法保留源码围栏（包括 `{tab=}` 属性）；shortcode 写法的每个标签输出为加粗的标签名，后面跟着它的内容。

## 参数参考 {#reference}

写在围栏信息行或表格属性行上的属性：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `tab` | 非空字符串 | 无 | 可见的标签名；单独一个块时就是这个块的标题 |
| `group` | `^[a-z][a-z0-9_-]*$` | 无 | 只写在一组的第一个块上，启用 hash、页内同步与持久化；需要 `tab` |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | 无 | 分组时每个块必填；未分组时只用作面板标识；需要 `tab` |
{.fields meta="type default"}

`tabs` shortcode：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `group` | `^[a-z][a-z0-9_-]*$` | 无 | 同上，启用 hash、同步与持久化 |
| `default` | 某个子项的 `value` | 第一个子项 | 初始选中的面板；需要 `group` |
| `label` | 纯文本 | 本地化的「选项卡」 | 标签栏的无障碍名称，不在页面上显示 |
{.fields meta="type default"}

`tab` shortcode：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `label` | 纯文本 | 是 | 可见的标签名 |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | 有 `group` 时 | 未分组时禁止，由主题生成 `tab1`、`tab2`…… |
{.fields meta="type required"}

分组时，面板 ID 为 `<group>-<value>`。同一页里同一个 `group` 出现多次，后面几组的 ID 依次加 `-2`、`-3`……后缀，深链接指向第一组；未分组的标签页使用主题生成的 ID。存储键为 `td-tabs:v1:<group>`。点击或按键会用 `replaceState` 更新 hash 并写入存储，带 hash 打开页面则只切换选中项。左右方向键（在从右到左书写的页面上方向相反）以及 Home、End 会移到对应标签并选中它，焦点停在标签上。

## 限制与常见问题 {#limits}

- 无效输入会告警并采用安全的回退，构建告警会给出源码位置。无法使用的 `group`、`value` 或 `default` 被丢弃，`tabs` 里夹杂的其他内容被忽略，shortcode 中重复的 `value` 两个标签都保留，没有子项的 `tabs` 不输出任何内容。
- 属性写法的一组里只要有一个块缺少可用的 `value`，整组就失去分组，只在本地切换；主题不会替分组编造值。相邻的块 `value` 重复时，它们保持为各自独立的带标题块。
- 一组里只能全是围栏或全是表格。正文与代码混排请用 shortcode。
- 标签页不是用来收起内容的。只想折叠长输出，用 `> [!DETAILS]`，见[提示块](/zh/docs/components/callout/)。
- `group` 名在全站共享：读者在一个页面上选了 pnpm，其他页面所有 `pkgmgr` 组也会切到 pnpm。按含义给分组命名，例如 `pkgmgr`、`os`，不要用 `tabs1` 这类名字。

## 相关 {#related}

- [代码块](/zh/docs/components/code/) — 围栏的其余属性（标题、复制、行号、折叠）
- [表格](/zh/docs/components/table/) — 表格属性行的其余取值
- [提示块](/zh/docs/components/callout/) — 折叠而不是并列时用它
- [步骤](/zh/docs/components/steps/) — 步骤里可以放标签页
