---
title: FileTree
description: 使用语义化渐进展开列表展示仓库与目录结构。
weight: 40
icon: fa-solid fa-folder-tree
---

FileTree 用于解释仓库或目录结构中与读者有关的部分。交互式 HTML 使用原生展开控件表示目录，所有输出格式都会保留完整嵌套结构。

## 适用场景 {#when-to-use}

FileTree 适合安装指南、架构概览与贡献说明中的精选结构。如果需要逐字复制命令输出，请使用代码块。对于自动生成或频繁变化的目录树，应使用正文描述，不要提交很快就会过时的大型快照。

## 快速开始 {#quick-start}

### 源码 {#source}

```go-html-template
{{</* filetree label="仓库结构" */>}}
  {{</* filetree/folder name="content" open=true */>}}
    {{</* filetree/file name="_index.md" */>}}
    {{</* filetree/folder name="docs" open=true */>}}
      {{</* filetree/file name="getting-started.md" */>}}
    {{</* /filetree/folder */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/file name="hugo.yml" link="/zh/docs/getting-started/" */>}}
{{</* /filetree */>}}
```

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

{{< filetree label="仓库结构" >}}
  {{< filetree/folder name="content" open=true >}}
    {{< filetree/file name="_index.md" >}}
    {{< filetree/folder name="docs" open=true >}}
      {{< filetree/folder name="operations-and-troubleshooting" open=true >}}
        {{< filetree/file name="a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md" link="/zh/docs/" >}}
      {{< /filetree/folder >}}
      {{< filetree/file name="configuration.md" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="blog" >}}
      {{< filetree/file name="release.md" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="hugo.yml" link="https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml" >}}
{{< /filetree >}}

<!-- prettier-ignore-end -->

`blog`
目录初始为关闭状态。使用指针、Enter 或 Space 操作摘要即可显示子文件；这项行为来自原生
`details` 元素，不依赖自定义脚本。

## 根组件参数 {#root-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree 参数" >}}
  {{< field name="label" type="string" >}}
  与根列表关联的非空可见标签。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

根组件只接受直接的 `filetree/folder` 与 `filetree/file`
子项。不要发布空树，应至少添加一个有意义的条目。

## 目录与文件参数 {#folder-and-file-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree/folder 参数" >}}
  {{< field name="name" type="string" required=true >}}
  非空可见目录名。
  {{< /field >}}
  {{< field name="open" type="boolean" default=false >}}
  控制交互式 HTML 初始状态。
  {{< /field >}}
{{< /fields >}}

{{< fields label="filetree/file 参数" >}}
  {{< field name="name" type="string" required=true >}}
  非空可见文件名。
  {{< /field >}}
  {{< field name="link" type="URL" >}}
  经过校验的站内、相对、HTTP(S) 或 `mailto:` 目标。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

目录可以递归包含目录与文件，文件不能包含子项。未知参数、子项之间的普通文字，或放在非法父级中的子项都会让构建停止，并报告源文件位置。

## 语义与回退 {#semantics-and-fallback}

整体结构是嵌套 `ul`，交互式目录添加原生 `details` 与 `summary`。Oink有意不声明
`role="tree"`，因为这种 ARIA 控件需要实现完整的方向键导航模型。打印与 RSS 会展开所有目录，Markdown 会变成嵌套列表，并在适用时保留文件链接。组件不会加载 JavaScript。

## 有意保留的边界 {#deliberate-limits}

FileTree 完全由作者控制，绝不会在 Hugo 构建期间读取本地目录，因此构建安全且可复现。第一版也不为条目提供公共 badge 或 icon 参数；内置目录与文件图形只是主题的展示细节，不属于内容 API。
