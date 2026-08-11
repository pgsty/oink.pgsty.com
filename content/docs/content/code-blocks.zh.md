---
title: 代码块与代码组
description: 为 Hugo 代码示例添加文件名、精确复制、换行、折叠与可分享的代码组。
weight: 65
icon: fa-solid fa-code
---

OINK 在不替换 Chroma、也不引入浏览器端高亮器的前提下增强 Hugo 普通围栏代码块。服务器输出完整代码与外壳；按页面加载的小型脚本只负责复制、视觉折叠与标签状态。

## 增强围栏 {#enhanced-fences}

在 Hugo 围栏属性列表中补充元数据：

````markdown {filename="content/docs/example.md" copy="all"}
```yaml {filename="hugo.yml" copy="all" lineNos="table" hl_lines="4 7-9" wrap=false collapse=18}
params:
  offlineSearch: true
```
````

没有属性的围栏也会获得同一套响应式外壳与默认复制行为。`filename`
会增加可见标题栏；`title` 是普通围栏中 `filename`
的兼容别名，同时设置两者会导致构建失败。两者都没有时，OINK 使用紧凑浮层，不会绘制空标题栏。

### 实时效果 {#live-result}

下面的代码块同时使用了文件名、内联行号、稳定根 ID、行链接和源码行高亮。显示的行号从 12 开始，但
`hl_lines` 仍按围栏内的源码行编号：

```yaml {id="zh-docs-code-config" filename="hugo.yaml" copy="all" lineNos="inline" lineNoStart=12 hl_lines="3 6-7" anchorLineNos=true}
markup:
  highlight:
    noClasses: false
params:
  offlineSearch: true
  ui:
    sidebar_menu_foldable: true
```

### 外壳参数 {#shell-parameters}

| 属性       | 取值                                | 行为                          |
| ---------- | ----------------------------------- | ----------------------------- |
| `filename` | 字符串                              | 可见文件名与无障碍分组名称    |
| `title`    | 字符串                              | 普通围栏中 `filename` 的别名  |
| `copy`     | `all`、`command`、`false` 或 `true` | 复制策略；`true` 等价于 `all` |
| `wrap`     | `true` 或 `false`                   | 仅在视觉上换行，不改变源码    |
| `collapse` | 正整数                              | 初始最多显示的源码行数        |
| `label`    | 字符串                              | 文件名不适用时的无障碍标签    |
| `id`       | 字符串                              | 稳定公开块 ID 与行锚点前缀    |

Hugo 通用 `class`、安全的 `data-*`、`aria-*` 与全局属性会保留在 `.td-code`
根元素。以 `data-td-code` 开头的名称和 `data-language`
为保留项；事件处理器与内联样式属性会被拒绝。需要覆盖由文件名派生的无障碍名称时，应使用
`label`；同时设置通用 `aria-label` 与 `label` 或 `filename` 会导致构建失败。

### Hugo 选项 {#hugo-options}

渲染钩子仍会把以下选项传给 Hugo：

- `lineNos`、`lineNoStart` 与 `anchorLineNos`；
- `hl_lines`；
- `tabWidth` 与 `style`。

基于 class 的 Chroma 标记仍位于 `.highlight` 和 `.chroma`
中，因此既有 token 级覆盖可以继续工作。新的稳定外层元素是 `.td-code`；使用
`.td-content > .highlight` 等直接子选择器的站点需要更新选择器。

Diff 有意继续使用 Chroma 标准的 `diff` lexer，不引入自定义 transformer：

```diff {filename="hugo.yaml.diff"}
 params:
-  offlineSearch: false
+  offlineSearch: true
```

## 复制语义 {#copy-semantics}

普通源码默认使用 `copy="all"`。`console` 与 `shell-session` 默认使用
`copy="command"`：只复制含 Chroma 提示符 token 的行，并排除提示符与输出 token。确实需要完整终端记录时可设置
`copy="all"`；在其他语言上使用 `command` 会导致构建失败。

复制会保留缩进、内部空行与 Unicode，移除行号，只裁掉末尾换行符并补上恰好一个最终换行。会话 lexer 没有生成提示符 token 时，界面会报告本地化失败并且不复制任何内容。设置
`params.disable_click2copy_chroma: true` 可以在整个站点硬关闭复制。

多行终端命令应在每个续行中写出续行提示符（通常为
`>`）。Chroma 会把没有提示符的行分类为输出，因此 `copy="command"`
会有意排除这些行。

下面这个实时会话的复制操作只会得到两条命令，不会包含提示符与输出：

```console {title="终端会话"}
$ hugo version
hugo v0.164.0+extended darwin/arm64
$ hugo --gc --minify
Total in 742 ms
```

## 换行与折叠 {#wrapping-and-collapse}

`wrap=true`
只改变显示，不会改变复制出的源码。它与 Chroma 表格行号布局不兼容，因为独立换行的行号栏和源码栏会错位；应使用内联行号或关闭换行。OINK 会让构建明确失败，而不是静默产生错位结果。

`collapse=N`
属于渐进增强。服务器始终输出全部源码；浏览器只有在能够测量第 N 个真实 Chroma 行节点后才会裁切。没有 JavaScript、使用辅助技术以及打印时，代码始终完整。减少动态效果偏好会关闭高度动画。

第一个示例会在视觉上换行长值，但不会改动复制出的文本：

```text {filename="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```

第二个示例由服务器输出全部内容，但在浏览器中初始只显示六行：

```yaml {filename="hugo.yaml" collapse=6}
baseURL: https://docs.example.com/
title: Product Documentation
defaultContentLanguage: en
languages:
  en:
    label: English
    weight: 1
  zh:
    label: 简体中文
    weight: 2
params:
  offlineSearch: true
```

## 稳定 ID 与行链接 {#stable-ids-and-line-links}

发布行号链接时应设置页面内唯一的明确
`id`。ID 不能包含 ASCII 空白或控制字符，也不能与其他代码组件生成的 viewport、标签、面板、标题或行锚点 ID 冲突；任何此类冲突都会导致构建失败：

````markdown {filename="content/docs/server.md"}
```go {id="server-start" lineNos="inline" anchorLineNos=true}
func start() {}
```
````

OINK 会从该 ID 派生唯一行锚点前缀。自动生成的 ID 在页面内是安全的，但依赖代码块顺序，不构成永久链接契约；在前面插入新围栏可能改变它。

## 代码组 {#code-groups}

如果多个示例是同一任务的替代方案，应使用 `code-group`：

```go-html-template {filename="content/docs/install.md" wrap=true}
{{</* code-group id="install-client" sync="package-manager" persist=true
    label="选择包管理器" copy="all" */>}}
  {{</* code-tab title="npm" value="npm" lang="bash" */>}}
npm install @example/client
  {{</* /code-tab */>}}
  {{</* code-tab title="pnpm" value="pnpm" lang="bash" selected=true */>}}
pnpm add @example/client
  {{</* /code-tab */>}}
{{</* /code-group */>}}
```

`code-tab`
包含原始代码而不是 Markdown。OINK 会移除用于排版的首个换行和结束短代码前的缩进，同时保留源码内部的全部空白。Markdown 格式化工具可能会重排这段原始内容；使用 Prettier 时，应像下面的实时示例一样，在每个
`code-group` 前紧邻放置 `<!-- prettier-ignore -->`。

### 分组与标签参数 {#group-and-tab-parameters}

每个分组都需要页面内唯一的小写 `id`。可选的
`sync`、`persist`、`label`、`copy`、`wrap` 和 `collapse`
作用于整个分组；后三项会作为子项继承的默认值。`persist` 默认为 `true`。

每个子项都需要纯文本 `title` 与稳定的小写 `value`。`lang` 默认为
`text`；`selected`、`copy`、`wrap`、`collapse`
和 Hugo 高亮选项可以覆盖分组默认值。分组不能为空、不能重复 value，也不能有多个
`selected=true` 子项。代码组不支持文件名，因为标签本身已经标识示例。

### 选择、同步与持久化 {#selection-sync-and-persistence}

选中面板的公开 hash 是 `#<group-id>-<value>`，例如
`#install-client-pnpm`。初始选择优先级依次为 URL
hash、已保存值、`selected=true`、第一个子项。

共享 `sync`
的分组会在双方都存在某个 value 时同步选择；缺少该 value 的同伴保持不变。用户选择会通过
`replaceState`
更新 hash，并在启用持久化时保存 value。访问分享 hash 会激活指定示例，但不会覆盖读者保存的偏好。`persist=false`
只关闭存储，不会关闭页面内同步。

### 实时同步分组 {#live-synchronized-groups}

下面两个实时分组共享同一个 `sync`
key。在任意分组中选择包管理器，另一个分组都会随之切换。第一个分组的
[npm](#zh-docs-install-client-npm)、[pnpm](#zh-docs-install-client-pnpm) 与
[yarn](#zh-docs-install-client-yarn) 面板也都有可分享的 hash。

<!-- prettier-ignore -->
{{< code-group id="zh-docs-install-client" sync="zh-docs-package-manager" persist=false >}}
  {{< code-tab title="npm" value="npm" lang="bash" >}}
npm install @example/client
  {{< /code-tab >}}
  {{< code-tab title="pnpm" value="pnpm" lang="bash" selected=true >}}
pnpm add @example/client
  {{< /code-tab >}}
  {{< code-tab title="yarn" value="yarn" lang="bash" >}}
yarn add @example/client
  {{< /code-tab >}}
{{< /code-group >}}

<!-- prettier-ignore -->
{{< code-group id="zh-docs-run-client" sync="zh-docs-package-manager" persist=false >}}
  {{< code-tab title="npm" value="npm" lang="bash" >}}
npm run docs:dev
  {{< /code-tab >}}
  {{< code-tab title="pnpm" value="pnpm" lang="bash" selected=true >}}
pnpm docs:dev
  {{< /code-tab >}}
  {{< code-tab title="yarn" value="yarn" lang="bash" >}}
yarn docs:dev
  {{< /code-tab >}}
{{< /code-group >}}

## 输出与兼容性 {#output-and-compatibility}

打印会隐藏控件与标签行、展开全部代码，并在每个分组示例前显示标题。Markdown 输出会把代码组与旧标签分别还原为可读的带标题围栏；源码包含反引号时会自动选择更长的围栏。Feed 与其他非交互输出使用顺序堆叠示例。没有相关代码或标签的页面不会加载对应 runtime。

既有 `tabpane` 源码及其 `td-tp-persist:*`
浏览器键保持兼容。Prism 仍是旧版替代方案，不会获得 Enhanced Code Block 或 Code
Group。`mermaid`、`math`、`chem`、`markmap` 与 `plantuml`
等专用钩子继续使用各自渲染器。
