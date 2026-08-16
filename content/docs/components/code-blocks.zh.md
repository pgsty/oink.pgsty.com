---
title: 代码块与标签页
linkTitle: 代码块
description: 为 Hugo 代码示例添加标题、精确复制、换行、折叠与可分享的标签页。
weight: 10
---

OINK 在不替换 Chroma、也不引入浏览器端高亮器的前提下增强 Hugo 普通围栏代码块。服务器输出完整代码与外壳；按页面加载的小型脚本只负责复制、视觉折叠与标签状态。

## 增强围栏 {#enhanced-fences}

在 Hugo 围栏属性列表中补充元数据。没有属性的围栏也会获得同一套响应式外壳与默认复制行为。`title`
会增加可见标题栏（`filename`
是它的历史别名，同时设置两者会导致构建失败）。两者都没有时，OINK 使用紧凑浮层，不绘制空标题栏。

**作者写法**

````markdown {title="content/docs/example.md" copy="all"}
```yaml {title="hugo.yml" copy="all" lineNos="table" hl_lines="4 7-9" wrap=false collapse=18}
params:
  offlineSearch: true
```
````

### 实时效果 {#live-result}

**实际效果**

下面的代码块同时使用了文件名、内联行号、稳定根 ID、行链接和源码行高亮。显示的行号从 12 开始，但
`hl_lines` 仍按围栏内的源码行编号：

```yaml {id="zh-docs-code-config" title="hugo.yaml" copy="all" lineNos="inline" lineNoStart=12 hl_lines="3 6-7" anchorLineNos=true}
markup:
  highlight:
    noClasses: false
params:
  offlineSearch: true
  ui:
    sidebar_menu_foldable: true
```

### 外壳参数 {#shell-parameters}

| 属性       | 取值                                | 行为                                                 |
| ---------- | ----------------------------------- | ---------------------------------------------------- |
| `title`    | 字符串                              | 可见文件名与无障碍分组名称                           |
| `filename` | 字符串                              | `title` 的历史别名；同时使用会导致构建失败           |
| `copy`     | `all`、`command`、`false` 或 `true` | 复制策略；`true` 等价于 `all`                        |
| `wrap`     | `true` 或 `false`                   | 仅在视觉上换行，不改变源码                           |
| `collapse` | 正整数                              | 初始最多显示的源码行数                               |
| `label`    | 字符串                              | 文件名不适用时的无障碍标签                           |
| `id`       | 字符串                              | 稳定公开块 ID 与行锚点前缀                           |
| `tab`      | 字符串                              | 标签名；连续带 `tab` 的围栏组成一个[标签页集](#tabs) |
| `group`    | 小写 token                          | 为整组标签页启用 hash、同步与持久化                  |
| `value`    | 小写 token                          | 分组内稳定的标签值                                   |
| `num`      | `[0-9A-Za-z.-]+`                    | 带编号的 Book 示例（`eg`）；需要 `caption`           |
| `caption`  | 字符串                              | 编号 Book 示例的标题；需要 `num`                     |

`class`、`data-*` 与 `aria-*` 属性会保留在 `.td-code` 根元素。以 `data-td-code`
开头的名称和 `data-language`
为保留项；其它未知属性、事件处理器与内联样式会导致构建失败。需要覆盖由文件名派生的无障碍名称时，应使用
`label`；同时设置通用 `aria-label` 与 `label` 或 `title` 会导致构建失败。

### Hugo 选项 {#hugo-options}

渲染钩子仍会把以下选项传给 Hugo：

- `lineNos`、`lineNoStart` 与 `anchorLineNos`；
- `hl_lines`；
- `tabWidth` 与 `style`。

基于 class 的 Chroma 标记仍位于 `.highlight` 和 `.chroma`
中，因此既有 token 级覆盖可以继续工作。新的稳定外层元素是 `.td-code`；使用
`.td-content > .highlight` 等直接子选择器的站点需要更新选择器。

界面会把常见的 `bash`、`sh` 与 `shell` lexer 别名统一显示为
`BASH`。传给 Chroma 的原始 lexer 值以及 `data-language` 不会改变。

Diff 有意继续使用 Chroma 标准的 `diff` lexer，不引入自定义 transformer：

**作者写法**

````markdown {title="content/docs/configuration.md"}
```diff {title="hugo.yaml.diff"}
 params:
-  offlineSearch: false
+  offlineSearch: true
```
````

**实际效果**

```diff {title="hugo.yaml.diff"}
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

复制控件只显示紧凑图标，不在旁边重复文字。它仍通过无障碍名称与悬停提示提供本地化说明；成功或失败时也会切换图标并更新实时状态消息。

多行终端命令应在每个续行中写出续行提示符（通常为
`>`）。Chroma 会把没有提示符的行分类为输出，因此 `copy="command"`
会有意排除这些行。

下面这个实时会话的复制操作只会得到两条命令，不会包含提示符与输出：

**作者写法**

````markdown {title="content/docs/terminal.md"}
```console {title="终端会话"}
$ hugo version
hugo v0.164.0+extended darwin/arm64
$ hugo --gc --minify
Total in 742 ms
```
````

**实际效果**

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

**作者写法**

````markdown {title="content/docs/downloads.md"}
```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```
````

**实际效果**

```text {title="config/artifacts.env" wrap=true}
ARTIFACT_URL=https://downloads.example.com/releases/2026/08/oink-complete-offline-distribution-arm64.tar.zst
CHECKSUM=sha256:6d3dce4f7acb18f586469adcb80ab35f3e859f9837786e151cfbc2b3c0f587b2
```

第二个示例由服务器输出全部内容，但在浏览器中初始只显示六行：

**作者写法**

````markdown {title="content/docs/configuration.md"}
```yaml {title="hugo.yaml" collapse=6}
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
````

**实际效果**

```yaml {title="hugo.yaml" collapse=6}
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

**作者写法**

````markdown {title="content/docs/server.md"}
```go {id="zh-server-start" lineNos="inline" anchorLineNos=true}
func start() {}
```
````

**实际效果**

```go {id="zh-server-start" lineNos="inline" anchorLineNos=true}
func start() {}
```

OINK 会从该 ID 派生唯一行锚点前缀。自动生成的 ID 在页面内是安全的，但依赖代码块顺序，不构成永久链接契约；在前面插入新围栏可能改变它。

## 标签页 {#tabs}

<a id="code-groups"></a>

连续带有 `tab`
属性的围栏会组成一个标签页集。这是代码标签页的原生形态：每个围栏在服务器端都是一个完整的带标题代码块；一段小型运行时在浏览器里把相邻的块重新组合成标签页。

**作者写法**

````markdown {title="content/docs/install.md"}
```bash {tab="npm" group="docs-package-manager" value="npm"}
npm install @example/client
```

```bash {tab="pnpm" value="pnpm"}
pnpm add @example/client
```

```bash {tab="yarn" value="yarn"}
yarn add @example/client
```
````

**实际效果**

<!-- prettier-ignore-start -->

```bash {tab="npm" group="docs-package-manager" value="npm"}
npm install @example/client
```

```bash {tab="pnpm" value="pnpm"}
pnpm add @example/client
```

```bash {tab="yarn" value="yarn"}
yarn add @example/client
```

<!-- prettier-ignore-end -->

### 标签属性 {#group-and-tab-parameters}

| 属性    | 取值                    | 行为                                                          |
| ------- | ----------------------- | ------------------------------------------------------------- |
| `tab`   | 非空字符串              | 可见标签名；没有 JavaScript 时就是代码块标题                  |
| `group` | `^[a-z][a-z0-9_-]*$`    | 写在一组的第一个围栏上：启用 URL hash、页内同步与浏览器持久化 |
| `value` | `^[a-z0-9][a-z0-9_-]*$` | 稳定的机器值；分组内每个围栏必填，无分组时禁止                |

没有 `tab` 的 `group`/`value`、分组内缺失或重复的 `value`、以及 `tab` 与 Book
`num` 同时出现，都会导致构建失败。`tab` 可以与 `title`
共存：标签名进入标签栏，文件名标题栏留在面板内。`group`
不同的围栏或中间隔着非代码块，都会开始新的一组。

### 选择、同步与持久化 {#selection-sync-and-persistence}

分组面板拥有公开 hash `#<group>-<value>`，例如
`#docs-package-manager-pnpm`。初始选择的优先级依次为 URL
hash、已保存的值、第一个围栏。共享同一 `group`
的标签页集会选中同一个值（前提是各组都有该值；缺少该值的一组保持不变）。用户选择会通过
`replaceState` 更新 hash，并把值保存到 `localStorage` 的 `td-tabs:v1:<group>`
键。无分组的标签页集只在本地切换，不改动 hash 也不写存储。

### 实时同步的标签页 {#live-synchronized-groups}

上面的安装标签页集与下面的运行标签页集共享同一个
`group`。在任意一组选择包管理器，另一组会随之切换；各面板也拥有可分享的 hash：带着
`#docs-package-manager-pnpm` 打开本页，两组都会选中 pnpm。

**作者写法**

````markdown {title="content/docs/run.md"}
```bash {tab="npm" group="docs-package-manager" value="npm"}
npm run docs:dev
```

```bash {tab="pnpm" value="pnpm"}
pnpm docs:dev
```
````

**实际效果**

<!-- prettier-ignore-start -->

```bash {tab="npm" group="docs-package-manager" value="npm"}
npm run docs:dev
```

```bash {tab="pnpm" value="pnpm"}
pnpm docs:dev
```

<!-- prettier-ignore-end -->

### 正文标签页 {#prose-tabs}

当一个标签页承载的是 Markdown 而不是单个围栏时，使用[Callouts、标签页、步骤与卡片](/zh/docs/components/layout/#tabs-shortcode)中记录的
`tabs`/`tab`
短代码。两种形态共用同一个运行时、同一套 DOM 契约和同样的键盘行为：左右方向键（感知 RTL）与 Home/End 移动并激活标签，焦点停留在标签上，运行时增强前不会隐藏任何面板。

## 输出与兼容性 {#output-and-compatibility}

打印时隐藏控件与标签栏，展开所有代码，并把每个标签的标题放在对应代码之前。Markdown输出保留每个围栏及其
`tab`
属性，并在源码包含反引号时选择更长的分隔符。RSS等非交互输出使用堆叠的带标题示例。没有相应代码或标签页的页面不会加载对应运行时。

Docsy 的 `tabpane`/`tab` 与 OINK 的 `code-group`/`code-tab`
短代码已删除；主题的迁移工具会把既有内容改写为相邻围栏或 `tabs`
短代码。Prism 仍是遗留备选方案，不会获得增强代码块与标签页能力。`mermaid`、`math`、`chem`、`markmap`
与 `plantuml` 钩子继续使用各自的渲染器，`echarts`、`infographic` 与 `checksums`
围栏属于[数据围栏](/zh/docs/components/echarts/)。
