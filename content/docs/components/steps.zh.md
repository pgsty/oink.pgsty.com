---
title: 步骤
linkTitle: 步骤
description: 有序列表加 `{.steps}` 就是带编号圆点与竖线的操作步骤；步骤要带标题、要进目录时改用 steps shortcode。
weight: 220
search_keywords: [步骤, Steps, 有序列表, 操作步骤, 教程, ol, start, 目录, TOC]
---

步骤（Steps）把一段流程排成一列带编号的圆点，并用竖线串起来，读者照着安装或升级时，一眼就能看出做到了第几步、还剩几步。写法是在普通有序列表下面加一行 `{.steps}`，圆点和竖线由 CSS 绘制，不加载脚本。只有顺序要紧时才用步骤；并列的选项或相关链接，用普通列表或[卡片](/zh/docs/components/cards/)。

默认先用有序列表。每一步都需要自己的标题、并且要进入目录时，改用 `{{%/* steps */%}}` shortcode；两者的取舍见[两种形态的选择](#which)。

## 最简例子 {#minimal}

每一项都写 `1.`，让 Markdown 自己数。这样增删、调换步骤都不用改编号，内容缩进也恒定是三个空格。

```markdown {title="源码"}
1. 安装 Hugo
1. 克隆 OINK Starter
1. 启动本地预览
{.steps}
```

1. 安装 Hugo
1. 克隆 OINK Starter
1. 启动本地预览
{.steps}

`{.steps}` 要写在最后一项的下一行。中间隔了空行，Goldmark 会静默丢掉这一行，列表按普通有序列表渲染。

## 步骤内容 {#blocks}

一步里可以放任何块级内容：段落、代码围栏、提示块、表格、嵌套列表、图片。缩进对齐到列表项的内容列，也就是三个空格。

````markdown {title="源码"}
1. 克隆 OINK Starter，它是面向项目的精简模板。

   ```bash
   git clone https://github.com/pgsty/oink-starter my-docs
   cd my-docs
   ```

1. 启动本地服务器。

   ```bash
   hugo server
   ```

   > [!NOTE]
   > 首次构建会通过 Go 模块代理拉取主题，需要本机安装 Go。

1. 替换三处内容，它就是你的站点。

   | 位置 | 替换为 |
   | --- | --- |
   | `hugo.yml` 的 `title` | 你的站名 |
   | `hugo.yml` 的 `baseURL` | 你的域名 |
   | `content/` | 你的内容 |
{.steps}
````

1. 克隆 OINK Starter，它是面向项目的精简模板。

   ```bash
   git clone https://github.com/pgsty/oink-starter my-docs
   cd my-docs
   ```

1. 启动本地服务器。

   ```bash
   hugo server
   ```

   > [!NOTE]
   > 首次构建会通过 Go 模块代理拉取主题，需要本机安装 Go。

1. 替换三处内容，它就是你的站点。

   | 位置 | 替换为 |
   | --- | --- |
   | `hugo.yml` 的 `title` | 你的站名 |
   | `hugo.yml` 的 `baseURL` | 你的域名 |
   | `content/` | 你的内容 |
{.steps}

`{{</* … */>}}` 形式的 shortcode（标签页、卡片、徽章等）也可以写在步骤里；`{{%/* … */%}}` 形式不行，原因见[限制](#limits)。

## 一步里按平台分开 {#tabs-in-steps}

某一步在不同平台上做法不同时，把带 `{tab=}` 的围栏并排写进那个列表项，它们照样会合成一组标签页。

`````markdown {title="源码"}
1. 安装 Hugo。

1. 安装依赖：

   ```bash {tab="EL / RHEL" group="stepdemo" value="rpm"}
   sudo dnf install golang git
   ```
   ```bash {tab="Debian / Ubuntu" value="deb"}
   sudo apt install golang-go git
   ```

1. 运行 `hugo server` 预览。
{.steps}
`````

1. 安装 Hugo。

1. 安装依赖：

   ```bash {tab="EL / RHEL" group="stepdemo" value="rpm"}
   sudo dnf install golang git
   ```
   ```bash {tab="Debian / Ubuntu" value="deb"}
   sudo apt install golang-go git
   ```

1. 运行 `hugo server` 预览。
{.steps}

## 接着上一组往下编号 {#start}

正文把一段流程隔开时，新一组的第一项写成它实际的序号。Markdown 会把这个序号写成列表的 `start`，圆点编号从那里接着走；支持从 2 到 40 起始。

```markdown {title="源码"}
4. 配置 `baseURL` 与部署工作流。
1. 推送到 `main`，等待 GitHub Actions 构建完成。
{.steps}
```

4. 配置 `baseURL` 与部署工作流。
1. 推送到 `main`，等待 GitHub Actions 构建完成。
{.steps}

## 带标题的步骤 {#shortcode}

流程较长时，每一步都有一个能进目录、能被链接的标题，读者更容易定位。用 `{{%/* steps */%}}` 把整段流程包起来：正文是普通的页面 Markdown，不用缩进，每个直接子标题开始一步。下面三步的标题就在本页的目录里。

```markdown {title="源码"}
{{%/* steps */%}}

### 安装工具链 {#install-toolchain}

安装 Hugo 与 Go，所需版本见[快速上手](/zh/docs/start/)。

### 启动服务器 {#run-server}

{{</* tabs group="oink-os" default="macos" */>}}
{{</* tab label="macOS" value="macos" */>}}
`brew install hugo go`
{{</* /tab */>}}
{{</* tab label="Debian" value="debian" */>}}
`sudo apt install hugo golang-go`
{{</* /tab */>}}
{{</* /tabs */>}}

### 发布 {#publish}

推送到 `main`，仓库自带的工作流会构建并发布。

{{%/* /steps */%}}
```

{{% steps %}}

### 安装工具链 {#install-toolchain}

安装 Hugo 与 Go，所需版本见[快速上手](/zh/docs/start/)。

### 启动服务器 {#run-server}

{{< tabs group="oink-os" default="macos" >}}
{{< tab label="macOS" value="macos" >}}
`brew install hugo go`
{{< /tab >}}
{{< tab label="Debian" value="debian" >}}
`sudo apt install hugo golang-go`
{{< /tab >}}
{{< /tabs >}}

### 发布 {#publish}

推送到 `main`，仓库自带的工作流会构建并发布。

{{% /steps %}}

`steps` 是主题里唯一用百分号分隔符书写的 shortcode。百分号形式把正文交给 Goldmark 当作页面 Markdown 处理，让步骤里的标题进入目录。代价是它不能放进列表项，也不能套在另一个百分号容器里，包括另一个 `steps`。同一组步骤的标题请保持同一层级。

## 两种形态的选择 {#which}

| 情况 | 用法 |
| --- | --- |
| 步骤是一两句话加一段命令 | 有序列表 + `{.steps}` |
| 每一步需要标题、需要被链接、需要进目录 | `{{%/* steps */%}}` |
| 步骤本身要嵌在另一个列表项里 | 有序列表 + `{.steps}` |

## 可选呈现 {#presentation}

简短的流程可以用 `{.steps .td-steps-compact}` 或 `steps variant="compact"` 收紧间距，编号、嵌套和标题锚点的行为不变。[组件呈现](/zh/docs/components/presentation/#steps)页把两者与常规样式放在一起对照。

## 输出形态 {#outputs}

步骤不加载脚本，关闭 JavaScript 后样子不变。打印时编号、内容和竖线都保留；Markdown 输出原样保留源码，RSS 中是普通列表或按标题分节的内容。

## 参数参考 {#reference}

| 写法 | 位置 | 说明 |
| --- | --- | --- |
| `{.steps}` | 有序列表下一行 | 必需；写在无序列表上不生效 |
| `{.steps .td-steps-compact}` | 有序列表下一行 | 简短流程使用的紧凑间距 |
| `1.` | 每一项 | 让 Markdown 自己数；内容缩进恒为三个空格 |
| `4.`（首项） | 第一项 | 输出 `<ol start="4">`，编号从 4 接着走，支持 2–40 |
| `{{%/* steps */%}}` | 包住若干标题 | 直接子标题（`##`–`######`）就是步骤；正文不缩进 |
| `variant="compact"` | 写在 `{{%/* steps */%}}` 上 | 紧凑间距；其他取值会告警并使用常规布局 |
{.fields meta="-"}

## 限制与常见问题 {#limits}

- 不要在列表项里写 `{{%/* … */%}}` 形式的 shortcode：它的多行输出会让列表提前结束。要在步骤里放 `{{%/* … */%}}` shortcode，改用 shortcode 形态。
- Prettier 之类的格式化工具可能把 `{.steps}` 和列表拆开，用 `<!-- prettier-ignore-start -->` 与 `<!-- prettier-ignore-end -->` 把列表包起来。
- `{.steps}` 只对有序列表有效，写在 `-` 开头的无序列表上不会有编号。
- 步骤不能折叠或展开，也不记录进度，没有「已完成」状态。

## 相关 {#related}

- [标签页](/zh/docs/components/tabs/) — 按平台分开的命令
- [提示块](/zh/docs/components/callout/) — 某一步里的前提与警告
- [代码块](/zh/docs/components/code/) — 步骤里的命令
- [卡片](/zh/docs/components/cards/) — 步骤做完之后的「下一步」
