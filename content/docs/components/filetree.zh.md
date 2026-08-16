---
title: FileTree
description: 使用语义化渐进展开列表，展示带注释的仓库与目录结构。
weight: 50
---

FileTree 用于解释仓库或目录结构中与读者有关的部分。文件与目录名称使用代码字体，目录具有明确的打开与关闭状态；还可以添加备注和文件系统元数据，在不把目录树变成宽表格的前提下补充上下文。

## 适用场景 {#when-to-use}

FileTree 适合安装指南、架构概览、部署手册与贡献说明中的精选结构。如果需要逐字复制命令输出，请使用代码块。对于自动生成或频繁变化的目录树，应使用正文描述，不要提交很快就会过时的大型快照。

## 快速开始 {#quick-start}

下面的仓库示例同时展示了目录开关状态、文件链接、自定义图标、语义颜色、`#`
备注，以及紧凑的 mode/owner:group 信息区。

### 源码 {#source}

```go-html-template
{{</* filetree label="仓库结构" */>}}
  {{</* filetree/folder name="content" open=true comment="页面包与模板" owner="docs" group="writers" mode="0755" */>}}
    {{</* filetree/file name="_index.md" icon="fa-solid fa-file-code" color="primary" comment="分区入口页" owner="docs" group="writers" mode="0644" */>}}
    {{</* filetree/folder name="docs" open=true comment="产品指南" */>}}
      {{</* filetree/folder name="operations-and-troubleshooting" open=true icon="fa-solid fa-screwdriver-wrench" color="warning" comment="操作手册与故障恢复" */>}}
        {{</* filetree/file name="a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md" link="/zh/docs/" color="danger" comment="应急操作流程" owner="sre" group="on-call" mode="0640" */>}}
      {{</* /filetree/folder */>}}
      {{</* filetree/file name="configuration.md" link="/zh/docs/configure/" icon="fa-solid fa-gears" color="info" comment="运行参数" */>}}
    {{</* /filetree/folder */>}}
    {{</* filetree/folder name="blog" comment="版本说明与文章" */>}}
      {{</* filetree/file name="release.md" icon="fa-regular fa-newspaper" color="secondary" comment="版本公告" */>}}
    {{</* /filetree/folder */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/file name="hugo.yml" link="https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml" icon="fa-solid fa-gears" color="warning" comment="站点配置" owner="root" group="wheel" mode="0640" */>}}
{{</* /filetree */>}}
```

### 渲染结果 {#rendered-result}

<!-- prettier-ignore-start -->

{{< filetree label="仓库结构" >}}
  {{< filetree/folder name="content" open=true comment="页面包与模板" owner="docs" group="writers" mode="0755" >}}
    {{< filetree/file name="_index.md" icon="fa-solid fa-file-code" color="primary" comment="分区入口页" owner="docs" group="writers" mode="0644" >}}
    {{< filetree/folder name="docs" open=true comment="产品指南" >}}
      {{< filetree/folder name="operations-and-troubleshooting" open=true icon="fa-solid fa-screwdriver-wrench" color="warning" comment="操作手册与故障恢复" >}}
        {{< filetree/file name="a-deliberately-long-runbook-filename-that-wraps-without-horizontal-overflow.md" link="/zh/docs/" color="danger" comment="应急操作流程" owner="sre" group="on-call" mode="0640" >}}
      {{< /filetree/folder >}}
      {{< filetree/file name="configuration.md" link="/zh/docs/configure/" icon="fa-solid fa-gears" color="info" comment="运行参数" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="blog" comment="版本说明与文章" >}}
      {{< filetree/file name="release.md" icon="fa-regular fa-newspaper" color="secondary" comment="版本公告" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="hugo.yml" link="https://github.com/pgsty/oink.pgsty.com/blob/main/hugo.yml" icon="fa-solid fa-gears" color="warning" comment="站点配置" owner="root" group="wheel" mode="0640" >}}
{{< /filetree >}}

<!-- prettier-ignore-end -->

`blog`
目录初始为关闭状态，并使用默认的关闭目录图标。使用指针、Enter 或 Space 激活整行，即可显示子文件并切换为打开目录图标。`operations-and-troubleshooting`
使用作者指定的扳手图标，因此在打开和关闭时保持不变。

## 丰富示例 {#rich-examples}

### 属主与权限 {#ownership-and-permissions}

当目录结构本身需要表达运维边界时，可以使用 `mode`、`owner` 和
`group`。固定宽度的 mode 放在前面，后面显示 `owner` 或
`owner:group`。`deploy:release-engineering`
这样的长身份会独立省略，不会把文件名挤出视野。

```go-html-template
{{</* filetree label="部署文件系统" */>}}
  {{</* filetree/folder name="/srv/atlas" open=true icon="fa-solid fa-server" color="primary" comment="应用根目录" owner="root" group="root" mode="0755" */>}}
    {{</* filetree/folder name="releases" open=true color="secondary" comment="不可变构建" owner="deploy" group="release-engineering" mode="0750" */>}}
      {{</* filetree/folder name="2026.08.16" open=true icon="fa-solid fa-box-archive" color="success" comment="当前版本" owner="deploy" group="release-engineering" mode="0750" */>}}
        {{</* filetree/file name="atlas-server" icon="fa-solid fa-terminal" color="success" comment="可执行文件" owner="deploy" group="atlas" mode="0555" */>}}
        {{</* filetree/file name="app.toml" icon="fa-solid fa-gears" color="info" comment="运行配置" owner="root" group="atlas" mode="0640" */>}}
      {{</* /filetree/folder */>}}
    {{</* /filetree/folder */>}}
    {{</* filetree/folder name="secrets" icon="fa-solid fa-lock" color="danger" comment="受限凭据" owner="root" group="security" mode="0700" */>}}
      {{</* filetree/file name="production.env" color="danger" owner="root" group="security" mode="0600" */>}}
    {{</* /filetree/folder */>}}
  {{</* /filetree/folder */>}}
{{</* /filetree */>}}
```

<!-- prettier-ignore-start -->

{{< filetree label="部署文件系统" >}}
  {{< filetree/folder name="/srv/atlas" open=true icon="fa-solid fa-server" color="primary" comment="应用根目录" owner="root" group="root" mode="0755" >}}
    {{< filetree/folder name="releases" open=true color="secondary" comment="不可变构建" owner="deploy" group="release-engineering" mode="0750" >}}
      {{< filetree/folder name="2026.08.16" open=true icon="fa-solid fa-box-archive" color="success" comment="当前版本" owner="deploy" group="release-engineering" mode="0750" >}}
        {{< filetree/file name="atlas-server" icon="fa-solid fa-terminal" color="success" comment="可执行文件" owner="deploy" group="atlas" mode="0555" >}}
        {{< filetree/file name="app.toml" icon="fa-solid fa-gears" color="info" comment="运行配置" owner="root" group="atlas" mode="0640" >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="secrets" icon="fa-solid fa-lock" color="danger" comment="受限凭据" owner="root" group="security" mode="0700" >}}
      {{< filetree/file name="production.env" color="danger" owner="root" group="security" mode="0600" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree >}}

<!-- prettier-ignore-end -->

每个元数据字段都是可选的。即使只提供
`mode`，四字符槽位仍会保持对齐，身份单元格留空。`owner` 可以单独出现；`group`
必须与 `owner`
同时提供，并使用冒号连接。鼠标悬停在被省略的身份上，可以查看完整文本。

### 语义图标与颜色 {#semantic-icons-and-colors}

图标可以区分文件类型或重要领域，`color`
则把图标映射到主题的语义色板。可见名称与备注仍应独立表达含义：图标和颜色只是装饰，在 Markdown 输出中会被省略。

```go-html-template
{{</* filetree label="数据平台工作区" */>}}
  {{</* filetree/folder name="warehouse" open=true icon="fa-solid fa-database" color="primary" comment="持久化数据集" */>}}
    {{</* filetree/file name="customers.parquet" icon="fa-solid fa-table-columns" color="info" comment="已整理的客户维度" */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/folder name="pipelines" open=true icon="fa-solid fa-diagram-project" color="secondary" comment="定时数据转换" */>}}
    {{</* filetree/file name="extract.py" icon="fa-brands fa-python" color="warning" comment="源数据采集" */>}}
    {{</* filetree/file name="quality.sql" icon="fa-solid fa-database" color="success" comment="数据质量检查" */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/folder name="secrets" icon="fa-solid fa-lock" color="danger" comment="不提交到仓库" */>}}
    {{</* filetree/file name=".env" color="danger" comment="本地凭据" */>}}
  {{</* /filetree/folder */>}}
  {{</* filetree/file name="Dockerfile" icon="fa-brands fa-docker" color="info" comment="运行时镜像" */>}}
  {{</* filetree/file name="README.md" link="/zh/docs/" icon="fa-brands fa-markdown" color="neutral" comment="运维指南" */>}}
{{</* /filetree */>}}
```

<!-- prettier-ignore-start -->

{{< filetree label="数据平台工作区" >}}
  {{< filetree/folder name="warehouse" open=true icon="fa-solid fa-database" color="primary" comment="持久化数据集" >}}
    {{< filetree/file name="customers.parquet" icon="fa-solid fa-table-columns" color="info" comment="已整理的客户维度" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="pipelines" open=true icon="fa-solid fa-diagram-project" color="secondary" comment="定时数据转换" >}}
    {{< filetree/file name="extract.py" icon="fa-brands fa-python" color="warning" comment="源数据采集" >}}
    {{< filetree/file name="quality.sql" icon="fa-solid fa-database" color="success" comment="数据质量检查" >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="secrets" icon="fa-solid fa-lock" color="danger" comment="不提交到仓库" >}}
    {{< filetree/file name=".env" color="danger" comment="本地凭据" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="Dockerfile" icon="fa-brands fa-docker" color="info" comment="运行时镜像" >}}
  {{< filetree/file name="README.md" link="/zh/docs/" icon="fa-brands fa-markdown" color="neutral" comment="运维指南" >}}
{{< /filetree >}}

<!-- prettier-ignore-end -->

`warehouse`、`pipelines` 与 `secrets`
使用作者指定的图标，因此打开目录时不会切换图标。如果打开/关闭状态比领域图标更重要，请省略
`icon`。

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

## 共享条目参数 {#shared-entry-parameters}

`filetree/folder` 与 `filetree/file` 都接受下面这些可选参数。

<!-- prettier-ignore-start -->

{{< fields label="目录与文件共享参数" >}}
  {{< field name="icon" type="Font Awesome classes" >}}
  恰好一个样式/名称类对，例如 `fa-solid fa-file-code`、`fa-regular fa-newspaper` 或 `fa-brands fa-python`。应选择 Oink 内置 Font Awesome 资源中存在的图标。
  {{< /field >}}
  {{< field name="color" type="enum" >}}
  可选值为 `neutral`、`primary`、`secondary`、`info`、`success`、`warning` 或 `danger`。该值选择语义主题令牌，不接受任意 CSS 颜色。
  {{< /field >}}
  {{< field name="mode" type="string" >}}
  在固定宽度 mode 列中原样显示的非空纯文本。八进制值必须加引号以保留开头的零，例如 `mode="0555"`。
  {{< /field >}}
  {{< field name="owner" type="string" >}}
  非空的用户/属主名称。它可以单独显示，也可以作为 `owner:group` 的前半部分。
  {{< /field >}}
  {{< field name="group" type="string" >}}
  使用冒号追加到 `owner` 后的非空组名。只提供 `group` 而没有 `owner` 会让构建停止。
  {{< /field >}}
  {{< field name="comment" type="string" >}}
  使用代码字体显示的非空纯文本，前面带有可见的 `#`。横向空间不足时显示省略号。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

`icon` 的值必须完整匹配
`fa-(solid|regular|brands) fa-[a-z0-9-]+`。备注与元数据是纯文本，不会解析 Markdown。Oink 会原样显示
`mode`，绝不会把八进制值转换成符号权限。提供 `mode` 或 `owner`
就会创建对齐的元数据区域。

## 目录参数 {#folder-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree/folder 参数" >}}
  {{< field name="name" type="string" required=true >}}
  非空可见目录名。
  {{< /field >}}
  {{< field name="open" type="boolean" default=false >}}
  控制交互式 HTML 的初始状态。布尔值不能加引号。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

省略 `icon` 时，目录会在标准 Font
Awesome 关闭与打开目录图标之间切换。作者指定的图标会覆盖这两个状态。目录颜色默认使用主题的目录色。

## 文件参数 {#file-parameters}

<!-- prettier-ignore-start -->

{{< fields label="filetree/file 参数" >}}
  {{< field name="name" type="string" required=true >}}
  非空可见文件名。
  {{< /field >}}
  {{< field name="link" type="URL" >}}
  经过校验的站内、相对、HTTP(S) 或 `mailto:` 目标。提供后，文件名会成为链接。
  {{< /field >}}
{{< /fields >}}

<!-- prettier-ignore-end -->

文件默认使用 `fa-regular fa-file` 与中性主题色。文件不能包含子项。

## 显示与交互 {#presentation-and-interaction}

文件与目录名称使用 Oink 的代码字体令牌。鼠标悬停在文件或目录上时会高亮完整行；目录获得键盘焦点时使用相同的背景，并保留清晰的焦点轮廓。原生展开三角形会被隐藏，因此由图标直接表达目录的默认状态，不会出现多余的三角形。

名称与备注共享可伸缩的主区域。首选文件名列宽会在空间允许时对齐使用代码字体的
`# comment`。名称始终保持可读并可以换行；备注保持单行，在空间不足时优先显示省略号。

文件系统元数据在行尾占用紧凑的两列区域。四字符 mode 放在前面；剩余空间显示
`owner` 或 `owner:group`，超长时独立省略，并通过 `title`
提示保留完整值。窄屏或深层嵌套时，该区域会按比例收缩，不会造成页面级横向溢出。

## 语义与回退 {#semantics-and-fallback}

整体结构是嵌套 `ul`，交互式目录添加原生 `details` 与 `summary`。Oink 有意不声明
`role="tree"`，因为这种 ARIA 控件需要实现完整的方向键导航模型。组件不会加载 JavaScript。

打印与 RSS 会展开所有目录。Markdown 会变成嵌套列表，保留文件链接，使用 `#`
标记备注，并在合并后的属主身份前输出 mode：

```markdown
- content/ # 页面包与模板 (mode: `0755`; owner: `docs:writers`)
  - _index.md # 分区入口页 (mode: `0644`; owner: `docs:writers`)
```

装饰性图标与颜色会有意从 Markdown 输出中省略。

## 有意保留的边界 {#deliberate-limits}

FileTree 完全由作者控制，绝不会在 Hugo 构建期间读取本地目录或调用
`stat`。owner、group 与 mode 都只是注释；Oink 不会根据宿主文件系统解析它们，也不会在不同权限记法之间转换。条目不接受任意 CSS 类、样式或原始颜色。排序、徽章、自动元数据、选择状态与方向键树导航都不属于该组件。
