---
title: 组件呈现
linkTitle: 组件呈现
description: 在 OINK 四种视觉预设中查看卡片、折叠块、标签页和紧凑流程。
weight: 115
outputs: [HTML, markdown, print]
search_keywords: [组件样式, 卡片列表, 紧凑步骤, 命令条, 预设]
---

本页把常用组件和它们的紧凑变体并排放在一起，方便你选用之前先看效果：在外观菜单里切换 Paper、Slate、Ink、Terminal 以及明暗模式，对照着看即可。每种变体只是在你原本的 Markdown 上多加一个 class 或一个 `variant` 参数，不加载脚本，也不改变链接、键盘操作、复制出的文字、打印与 Markdown 输出；写了未知的变体会告警，并回退到常规样式。

## 卡片与卡片列表 {#cards}

常规的卡片网格：

- [创建站点](/zh/docs/start/)

  安装主题，在本地预览第一个页面。

- [配置站点](/zh/docs/customize/config/)

  设置导航、语言、外观和搜索。
{.cards #presentation-cards}

紧凑的资源目录用 `{.cards .td-cards-list}`：同一份链接列表变成一个带分隔线的单框列表，每行高度随说明文字自然伸展。

- [创作内容](/zh/docs/write/) — 组织文章、指南和发布说明，另见 **[配置指南](/zh/docs/customize/config/)**。
- [标题较长的组件参考入口](/zh/docs/components/) — 选择原生 Markdown 或组合短代码。
{.cards .td-cards-list #presentation-card-list}

每行需要图标、徽章或较长说明时，改用 shortcode 形式的 `cards variant="list"`：

{{< cards variant="list" >}}
{{< card title="安装" link="/zh/docs/start/" icon="fa-solid fa-rocket" badge="从这里开始" >}}
先建立本地预览，再调整站点配置。
{{< /card >}}
{{< card title="参考资料" icon="fa-solid fa-book" >}}
阅读[配置指南](/zh/docs/customize/config/)或[写作指南](/zh/docs/write/)。没有标题链接的卡片仍然是普通内容。
{{< /card >}}
{{< /cards >}}

## 提示与折叠块 {#disclosures}

提示块没有变体，放在这里是为了对照它们在各个预设下的颜色与折叠行。

> [!NOTE] 保持本地预览
> 除了桌面效果，也要检查窄屏上的页面。

> [!WARNING] 检查目标位置
> 发布新版本之前，确认目标位置正确。

> [!DETAILS] 不启用 JavaScript 时如何工作？
> 折叠块使用原生 HTML `details` 元素，禁用脚本后仍然可以操作。
>
> 标题、箭头与焦点轮廓位于同一个尺寸稳定的摘要行中。

> [!TIP]+ 较长的标题可以自然换行，不会挤走箭头或缩小整行的操作区域
> 每个折叠块独立展开，其他内容保持原有状态。

## 标签页与命令 {#tabs}

```bash {tab="macOS / Homebrew" group="presentation-os" value="macos"}
brew install hugo
```
```bash {tab="Debian / Ubuntu" value="debian"}
sudo apt install hugo
```

单行围栏加上 `{class="td-code-command"}` 就成了命令条。复制按钮独占一列，长命令滚动或换行时不会被按钮挡住。

```bash {class="td-code-command" id="presentation-command"}
hugo server --bind 127.0.0.1 --port 1313
```

```bash {class="td-code-command" wrap=true id="presentation-command-wrap"}
hugo --environment production --baseURL https://example.com/documentation/ --destination public
```

`wrap`、`copy` 和无障碍标签的用法与普通代码块相同。命令条只能有一行，所以多行、带行号或可折叠的代码块加上这个 class 会告警，并按普通代码块渲染。

## 短流程 {#steps}

简短的流程在标记里加上 `.td-steps-compact`，写成 `{.steps .td-steps-compact}`。较长的教程保留常规的 `.steps`，宽松的间距更易读。

3. 检查配置。
1. 运行本地预览。
1. 检查生成结果。
{.steps .td-steps-compact #presentation-steps}

带标题的流程用 shortcode 的 `variant="compact"`，以百分号分隔符书写：

{{% steps variant="compact" %}}

### 预览 {#preview}

运行开发服务器，打开修改的页面。

### 检查 {#review}

按读者使用的语言和外观检查页面。

{{% /steps %}}

## 表格与元信息 {#metadata}

表格、参数表、徽章与按键序列同样没有变体，放在这里是为了对照它们与预设其余部分是否协调。

| 视图 | 用途 | 输入 |
| --- | --- | --- |
| 卡片 | 相关资源 | 链接列表 |
| 步骤 | 有序流程 | 有序列表 |
| 标签页 | 等价选项 | 相邻内容块 |

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| title | string | 简洁的标题，允许自然换行。 |
| description | string | 与主要标签分开的辅助信息。 |
{.fields}

{{< badge text="预览" tone="info" >}} {{< badge text="已验证" tone="success" >}} {{< badge text="待检查" tone="warning" >}}

用 {{< kbd "Ctrl" "K" >}} 打开搜索，用方向键切换结果。
