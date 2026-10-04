---
title: 组合出值得阅读的页面
linkTitle: 组合页面
description: 把正文、提示块、代码、媒体、表格与数学公式组合在一起，而不把页面变成组件目录。
book_kind: chapter
book_number: 3
weight: 30
---

组件应该帮助论证，而不是与内容争夺注意力。先写普通正文，只有当读者需要比较、验证、复制
或停下来思考时，才引入额外结构。

## 让每个内容块只做一件事 {#one-job}

> [!TIP] 先写出那句话
>
> 如果你无法用一句话解释某个组件为什么应该出现在这里，
> 那就先保留普通正文，直到需求变得明确。

用提示块表达前置条件或风险，用表格对齐重复字段，用代码块放置读者可以执行的材料，
只在形状或空间关系承载了正文无法表达的信息时才使用图片。

## 从一份小型页面契约开始 {#page-contract}

继续修改第 2 章的 `content/docs/preview-check.zh.md`，用下面的完整示例替换内容。
保留预览服务运行，在第二个终端的站点仓库目录中执行页面里的构建命令。

````markdown {title="content/docs/preview-check.zh.md" num="3-1" caption="同一页面现在明确了前置条件、命令与可见结果。" #eg-page-contract}
---
title: 验证本地预览
description: 确认文档修改已显示在浏览器中，并通过无警告构建。
weight: 25
---

## 检查预览 {#check-preview}

> [!NOTE] 保持预览服务运行
> 在第二个终端中进入站点仓库，再执行下方构建。

```bash
hugo --environment production --panicOnWarning
```

命令应成功退出且没有警告。刷新本页
`http://localhost:1313/zh/docs/preview-check/`，确认新提示块与命令已显示。
构建成功与可见内容已更新，需要分别确认。
````

在 `preview-check.md` 中用英文补上相同任务与命令，保留 `weight: 25` 和
`#check-preview`，本地 URL 使用 `/docs/preview-check/`。标题命名任务，摘要说明结果，
提示块解释命令在哪执行。再次打开双语页面并检查语言切换，再继续添加组件。

## 不用装饰数量衡量质量 {#quality}

有用的页面需要同时平衡三项独立属性：

$$
Q = C_{clarity} \times A_{accuracy} \times K_{consistency}
$$
{#eq-page-quality num="3.1" caption="清晰度、准确性或一致性中任何一项降为零，整个页面就会失败。"}

这里刻意使用乘法：视觉精美无法弥补错误命令，准确的正文在读者找不到或无法按步骤执行时，
同样会失败。

## 连接证据 {#connect-evidence}

用 {{< xref eg="3-1" anchor="eg-page-contract" />}} 作为源码模式，
再用 {{< xref eq="3.1" anchor="eq-page-quality" />}} 作为评审问题。第 4 章概述下一阶段的视觉设计；现在需要继续操作时，按[Starter 分层定制](/zh/docs/start/starter/#customize)完成下一步。

组件参考的起点是[组件](/zh/docs/components/)。只有当教程引入了某项真实需求时，
才需要阅读对应组件的独立页面。

