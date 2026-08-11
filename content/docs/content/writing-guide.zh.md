---
title: Hugo 内容技巧
weight: 40
icon: fa-solid fa-lightbulb
description: 避免为 Oink 站点编写内容时的常见陷阱。
aliases: [/docs/best-practices/site-guidance/, /docs/tutorial/writing-guide/]
---

Oink 是一款 Hugo 主题，因此普通 Markdown 与 Hugo 内容模型仍是创作基础。遵循以下约定，可以让页面在翻译、重组或部署到子路径后继续保持清晰与稳定。

## 链接到发布后的路由 {#link-to-published-routes}

面向读者的链接应指向规范发布 URL，而不是相邻源码文件路径。`/zh/docs/content/`
这样的根相对链接便于全站审计。如果链接需要在源码移动后继续跟随目标页面，可以使用 Hugo 的
`ref` 或 `relref` 短代码：

```markdown
[配置]({{</* ref "/docs/content/configuration" */>}})
```

移动页面后，应为旧公开路径添加 alias，并把所有站内链接更新为新的规范路由。不要让 alias 长期承担站点导航职责。链接与图片行为详见[添加内容](/zh/docs/content/adding-content/#links)。

## 让 front matter 提供有效信息 {#keep-front-matter-useful}

每个可导航页面都需要清晰的 `title`、精简的 `description`、经过安排的 `weight`
与合适的 Font Awesome
`icon`。描述只用一句话，并确保在普通桌面内容卡片中可以单行显示。只有当导航标签确实需要与页面标题不同时，才添加
`linkTitle`。

英文是主要源语言；简体中文译文以 `.zh.md`
形式与其并置。面向读者的元数据必须与正文一样认真翻译。

## 保持标题 ID 稳定 {#preserve-stable-headings}

多语言页面或经常被引用的页面应使用显式标题 ID：

```markdown
## 故障恢复 {#failure-recovery}
```

对应中文标题使用同一个 ID。重命名标题时，只要语义没有改变，就应继续保留已经公开的 ID。

## 把操作流程写成任务 {#write-procedures-as-tasks}

在命令之前说明前提条件，步骤使用祈使句，并给出预期结果或验证命令。区分本地预览、生产构建、托管部署与公开发布证据；前一层成功不能证明后一层已经完成。

## 让代码示例可以直接使用 {#make-code-examples-actionable}

代码块对应真实文件时应标出文件名；包含提示符与输出的会话应使用
`console`；不必在继续阅读前看完的长参考配置可以折叠。只有当多个面板是完成同一任务的可互换方案时，才使用代码组。

```yaml {filename="hugo.yaml" hl_lines="3"}
params:
  offlineSearch: true
  print:
    disable_toc: false
```

元数据应帮助读者理解示例，而不是装饰每一个围栏。文件名、复制策略、换行、折叠、行链接与同步替代方案的完整说明参见[代码块与代码组](/zh/docs/content/code-blocks/)。

## 检查渲染后的状态 {#review-rendered-states}

构建两种语言，并在桌面端、移动端、浅色与深色模式下检查代表页面。验证渲染后的标题、片段链接、代码、表格、提示、导航、搜索、打印输出与页面描述。
