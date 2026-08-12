---
title: 故障排查
linkTitle: 故障排查
weight: 70
description: 构建、语言、搜索、升级与平台五类常见问题的定位方法。
cSpell:ignore: maxfiles maxfilesperproc
---

诊断从一次干净的生产构建开始：

```sh
hugo --gc --minify --logLevel info
```

消费端的构建命令不应该调用 npm、PostCSS 或 Autoprefixer，也不应该下载主题的浏览器资源。如果日志里出现这些，说明配置里混进了上游 Docsy 的流程。

## 构建问题 {#build-issues}

### Hugo 不是 Extended 版本或版本过旧 {#hugo-is-not-extended-or-too-old}

```sh
hugo version
```

输出必须包含 `extended`，版本不低于 `{{% param hugoMinVersion %}}`。

如果 shell、编辑器、CI runner 或容器仍然选中旧二进制，先查 `PATH`
和工具版本固定配置，**不要盲目再装一份**——多个 Hugo 共存会让问题更难定位。

### 找不到主题 {#the-theme-cannot-be-found}

`module "github.com/pgsty/oink" not found`
说明 Hugo 无法解析主题。按安装方式排查：

| 安装方式      | 检查项                                                                   |
| ------------- | ------------------------------------------------------------------------ |
| Hugo Module   | `hugo mod graph`，以及 `go.mod`、`go.sum`、是否存在 workspace 或 replace |
| Git submodule | CI 是否在跑 Hugo 前执行了 `git submodule update --init`                  |
| 归档 / 克隆   | `theme:` 的值是否与 `themes/` 下的目录名一致                             |

### 缺少本地浏览器资源 {#a-local-browser-asset-is-missing}

Bootstrap、Font Awesome、Lunr、Mermaid 等资源缺失时，**不要加 CDN
URL 来掩盖**。确认发行物完整，应包含：

- `assets/third_party/`
- `assets/js/third_party/`
- `static/webfonts/`
- `VENDOR.json`

确实缺文件就重新解压或重新获取同一个固定版本。

## 升级后出现的问题 {#issues-after-upgrading}

### 站点自己的脚本报 `$ is not defined` {#site-scripts-report-dollar-is-not-defined}

OINK 0.3.0 **移除了 jQuery**。此前它在每个页面的 `<head>`
里加载，所以站点自己的脚本可能一直隐式依赖全局 `$`。

主题的任何功能都不需要它。仍然需要的站点自行打包：

```html {filename="layouts/_partials/hooks/head-end.html"}
<script src="{{ (resources.Get "js/jquery.min.js").RelPermalink }}"></script>
```

### 自定义字体失效 {#custom-fonts-stopped-working}

0.3.0 把字体收敛到语义角色之后，正文和标题角色直接作用于内容。只改原始 `body`
或标题选择器的站点需要改用角色变量：

```scss {filename="assets/scss/_styles_project.scss"}
/* 改前 */
body {
  font-family: 'My Sans', sans-serif;
}

/* 改后 */
:root {
  --td-body-font-family: 'My Sans', sans-serif;
}
```

完整迁移清单见[升级 OINK](/zh/docs/upgrade/upgrade/)。

## 语言与链接问题 {#language-and-link-issues}

### 译文页面没出现 {#a-translated-page-does-not-appear}

按顺序检查四项：

1. `hugo.yaml` 里有 `languages.zh` 并设置了 `weight`
2. 文件名是 `page.zh.md`，`zh` **必须小写**
3. 译文 front matter 没有 `draft: true`，`date` 也不在未来
4. 影响路由的元数据与源文件一致（除非有意换路由）

Hugo 能找到译文时，语言选择器会直接链过去；找不到时会按设计回退到目标语言首页——这是预期行为，不是 bug。

### 锚点链接打开了页面却没定位 {#fragment-links-do-not-scroll}

翻译后的标题文字会生成不同的自动 ID。在译文标题里显式写上英文渲染出的 ID：

```markdown
## 安装 {#installation}
```

含 shortcode 或内联 HTML 的标题不要凭文本猜 ID，要看英文渲染出的 HTML。

## 搜索问题 {#search-issues}

`offlineSearch: true` 会为每种语言生成独立索引。确认输出中有：

```text {copy=false}
public/offline-search-index.en.json
public/offline-search-index.zh.json
```

再检查浏览器是否从正确的 base URL 请求这些文件。**子路径部署下 `baseURL`
配错，是索引 404 最常见的原因。**

中文查询走主题的 CJK 子串回退。搜索无结果时，先确认中文页面的内容确实进了中文索引，而不是急着改分词逻辑。

命令面板（`Cmd/Ctrl-K`，或 `/`
直接进命令模式）在搜索索引不可用时仍然可用——它会提示索引不可用，但页面操作和命令照常工作。

## 平台问题 {#platform-issues}

### macOS 报打开文件过多 {#macos-too-many-open-files}

大型内容树的实时预览可能超过 shell 的打开文件数限制：

```sh
ulimit -n
```

在调整整机限制之前，**先把生成目录和无关目录排除出监视范围**——这通常才是根因。

### WSL 下速度慢或漏掉变更 {#wsl-is-slow-or-misses-changes}

让 Hugo 处理 Linux 文件系统里的路径，不要跨 Windows 挂载点。跨文件系统的变更通知和权限行为会让实时重载变慢甚至失效。

## 诊断清单 {#diagnostic-checklist}

- 用固定的确切 Hugo Extended 版本复现
- 清掉陈旧的 `public/` 和 `resources/` 再重建
- 对比开发与生产的配置层
- **看第一条错误**，而不是最后那条级联报错
- 用一个最小页面区分「主题行为」和「站点覆盖」
- 分批重新启用站点覆盖和内容组件，定位到具体那一项
- 检查故障页面的浏览器控制台和网络日志
