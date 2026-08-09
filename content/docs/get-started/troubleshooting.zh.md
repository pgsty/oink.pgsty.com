---
title: 故障排查与已知问题
linkTitle: 故障排查
weight: 60
description: 诊断 OINK 安装、构建、语言、搜索与平台问题。
aliases: [known_issues]
cSpell:ignore: maxfiles maxfilesperproc
---

请从一次干净的生产构建开始诊断：

```sh
hugo --gc --minify --logLevel info
```

消费端命令不应调用 npm、PostCSS、Autoprefixer，也不应下载主题浏览器资源。

## 构建问题 {#build-issues}

### Hugo 不是 Extended 版本或版本过旧 {#hugo-is-not-extended-or-is-too-old}

运行 `hugo version`。输出必须包含 `extended`，版本也不得低于
`{{% param hugoMinVersion %}}`。如果 shell、编辑器、CI
runner 或容器仍然选中了旧二进制文件，请检查它的 `PATH`
和固定工具配置，不要盲目再安装一份。

### 找不到主题 {#the-theme-cannot-be-found}

`module "github.com/pgsty/oink" not found`
一类错误表示 Hugo 无法解析配置中的主题。请按所选安装方式检查：

- 对于 Git checkout，主题名称必须与目录路径一致；
- 对于 Hugo 模块，运行 `hugo mod graph`，并检查
  `go.mod`、`go.sum`，以及所有 Hugo workspace 或 replacement；
- 对于 CI
  checkout，请在运行 Hugo 前初始化固定版本的 submodule，或恢复完整发布归档。

### 缺少本地浏览器资源 {#a-local-browser-asset-is-missing}

如果缺少 Bootstrap、Font
Awesome、Lunr、Mermaid 或其他 OINK 资源，不要通过添加 CDN
URL 来掩盖问题。请确认发行物完整，并包含
`assets/third_party/`、`assets/js/third_party/`、`static/webfonts/` 和
`VENDOR.json`。如果确有文件缺失，请重新解压或获取同一个固定版本。

## 语言与链接问题 {#language-and-link-issues}

### 译文页面没有出现 {#a-translated-page-does-not-appear}

逐项检查以下四个条件：

1. `hugo.yaml` 中存在 `languages.zh`，并且设置了权重。
2. 文件名是 `page.zh.md`，其中 `zh` 必须小写。
3. 译文 front matter 没有设置 `draft: true`，日期也不在未来。
4. 除非有意采用不同路由，否则会影响路由的元数据应与源文件一致。

当 Hugo 能找到页面译文时，语言选择器会直接链接过去；否则会按设计回退到目标语言首页。

### 片段链接打开了页面，却没有定位到标题 {#a-fragment-link-opens-the-page-but-not-the-heading}

翻译后的标题文字通常会生成不同的自动 ID。请在译文标题中显式加入英文渲染 ID：

```markdown
## 安装 {#installation}
```

不要推测包含短代码或内联 HTML 的标题 ID。请检查英文渲染结果，再比较中英文标题 ID 列表。

## 搜索问题 {#search-issues}

启用 `offlineSearch: true` 后，每种语言都会生成自己的搜索索引。请确认输出中存在
`offline-search-index.en.json` 和
`offline-search-index.zh.json`，并检查浏览器是否从站点 base
URL 请求这些文件。子路径部署中，错误的 `baseURL` 是索引缺失的常见原因。

中文分词使用主题的 CJK 回退。如果搜索结果为空，应先确认中文页面内容确实进入中文索引，而不是立即修改分词器。

## 平台问题 {#platform-issues}

### macOS 报告打开文件过多 {#macos-reports-too-many-open-files}

大型实时预览内容树可能超过 shell 的打开文件数限制。通过 `ulimit -n`
查看当前限制；如果本地策略允许，可以为当前 shell 临时提高限制。在修改整台机器的限制之前，应优先从监视树中排除生成目录和无关目录。

### Windows Subsystem for Linux 速度慢或遗漏变更 {#windows-subsystem-for-linux-is-slow-or-misses-changes}

请让 Hugo 处理 Linux 文件系统中的路径，而不是 Windows 挂载路径。跨文件系统的通知与权限行为可能让实时重载变慢或不可靠。

## 诊断清单 {#diagnostic-checklist}

- 使用固定的准确 Hugo Extended 版本复现问题。
- 通过项目规定的清理命令删除陈旧的 `public/` 和 `resources/` 产物，再重新构建。
- 比较开发环境与生产环境的配置层。
- 关注第一条构建错误，而不只是最后出现的级联报错。
- 使用最小页面区分主题行为与站点覆盖。
- 分小组逐步重新启用站点覆盖和内容组件。
- 检查故障页面的浏览器控制台和网络日志。
