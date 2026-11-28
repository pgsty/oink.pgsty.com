---
title: 本地浏览
linkTitle: 本地浏览
description: 面向初学者的本地使用指南：克隆一个 OINK 站点后运行 hugo serve，在浏览器里实时阅读、边改边看，或实时查阅 AI Agent 写入的最新工作报告。
weight: 10
search_keywords:
  [
    本地浏览,
    本地预览,
    hugo serve,
    hugo server,
    实时刷新,
    AI Agent 报告,
    初学者,
    local browsing,
  ]
---

使用 OINK 不必等到部署上线，也不必自己从头搭站。只要你手上已经有一个 OINK 站点仓库——无论是克隆下来的本文档站、团队的内部手册、在线书籍，还是 AI Agent 正在持续写入文档的工作区——在目录里运行一条 `hugo serve`，打开浏览器就能像访问正式网站一样实时阅读它。

## 克隆仓库并启动本地服务器 {#start-server}

先按[准备工具](/zh/docs/start/#tools)装好 Git、Go 和 Hugo，然后克隆站点仓库，在包含 `hugo.yml`（或 `hugo.yaml`）的目录里执行 `hugo serve`（它是 `hugo server` 的内置简写）：

```bash {title="终端"}
git clone https://github.com/OWNER/OINK-SITE.git
cd OINK-SITE
hugo serve
```

第一次启动时，Hugo 会把 `go.mod` 中固定的 OINK 主题拉到本地 Go 模块缓存。终端打印出 `Web Server is available at http://localhost:1313/` 后，用浏览器打开 <http://localhost:1313/> 即可。结束浏览时，在终端里按 {{< kbd "Ctrl" "C" >}} 停止服务。

## 在浏览器里实时阅读 {#reading}

与在编辑器或 GitHub 网页上翻看原始 `.md` 文件相比，用 `hugo serve` 打开本地站点能直接用到整套阅读能力：

- **完整的目录与导航**：折叠侧栏、右侧页内目录（TOC）、面包屑与上下页翻页，都按目录树自动组织好。
- **即开即用的检索与快捷键**：按 {{< kbd "/" >}} 或 {{< kbd "Ctrl" "K" >}} 在本地全文搜索整个仓库，按 {{< kbd "'" >}} 或点击页脚的 `?` 按钮查看快捷键速查表。
- **完整渲染工程组件**：提示块、标签页、参数表、KaTeX 数学公式、Mermaid / ECharts 图表与画廊全部本地渲染，无需额外服务。地图的地点列表同样离线可见，只有站点配置了瓦片服务时才会加载地图瓦片。
- **舒适的阅读外观**：自由切换 Paper、Slate、GitHub、Ink、News、Terminal 六套风格与深浅色模式；双语站点还能一键打开双列对照视图，或直接打印成排版干净的 PDF。

如果仓库里包含尚未发布的草稿（front matter 中写了 `draft: true`），启动时加上 `-D` 参数（`hugo serve -D`），草稿就会一同显示在侧栏里。

## 边编辑，边看效果 {#live-edit}

让 `hugo serve` 在一个终端里保持运行，同时用你顺手的编辑器修改 `content/` 下的 Markdown 或 `data/` 下的首页数据。每次保存文件——甚至切换 Git 分支——Hugo 都会在几十毫秒内完成增量重建，并自动刷新浏览器页面。

```bash {title="常用的本地启动组合"}
hugo serve -D                     # 同时预览 draft: true 的草稿页
hugo serve -D --navigateToChanged # 每次保存自动把浏览器跳转到刚编辑的那一页
hugo serve -D --renderToMemory    # 纯内存渲染，不在磁盘上写入 public/
```

在 Git 仓库里日常浏览或写作时，加上 `--renderToMemory`（简写 `-M`）非常省心：预览过程不会在磁盘上生成 `public/`，避免不小心把预览产物混进工作区。

## 实时阅读 AI Agent 的最新报告 {#agent-reports}

除了自己写作，本地浏览还有一个很实用的场景：**把浏览器变成 AI Agent 干活时的实时阅读面板**。

当 Claude Code、Codex 等编程 Agent 在帮你分析代码库、撰写设计方案、整理调研笔记或输出实验报告时，在滚动的终端里读大段 Markdown 表格和图表代码既费眼又容易漏掉细节。只要让 Agent 把产出按普通 Markdown 写进 OINK 站点的 `content/` 目录，并在旁边开着 `hugo serve -D --renderToMemory`：

1. Agent 在 `content/` 下新建或更新报告文件（例如 `content/docs/reports/audit.md`），用上标题层级、`{.fields}` 参数表、提示块、Mermaid 流程图或 ECharts 图表。
1. Hugo 立刻监测到文件落盘，在内存中完成重建并自动刷新浏览器页面，阅读位置保持不动。
1. 你在浏览器里实时查阅排版清晰、可搜索、可交互的最新工作报告；同时因为全程在内存渲染，不会往仓库里多写任何构建产物，不影响 Agent 的 Git 状态。
{.steps}

这样一来，任何一个 OINK 站点既是可发布的网站，也是本地零配置的人机协作知识库。

## 常见问题与下一步 {#tips}

| 遇到的情况 | 解决办法 |
| --- | --- |
| 提示 `1313` 端口已被另一个预览占用 | 换一个端口：`hugo serve -p 1314` |
| 改了 `hugo.yml`、`data/` 或模板后页面没变化 | 改用 `hugo serve --disableFastRender` 重启，再强制刷新浏览器 |
| 写了 `draft: true` 的文章在侧栏里看不到 | 启动时加上 `-D`（`hugo serve -D`） |
| 站点位于项目仓库的 `docs/` 子目录下 | 在仓库根目录执行 `hugo serve -s docs`，或先 `cd docs` 再 `hugo serve` |

需要查看全部 `hugo server` 参数、局域网手机预览、Docker 容器预览、清理缓存以及生产构建命令，请继续阅读[本地预览](/zh/docs/admin/preview/)。

## 相关 {#related}

- [快速上手](/zh/docs/start/) — 克隆文档站跑通基线，并用 AI Agent 搭建个人站
- [从零开始](/zh/docs/start/from-scratch/) — 从空目录自己搭一个独立 OINK 站点
- [加装文档](/zh/docs/start/add-docs/) — 在现有开源项目的 `docs/` 目录下加装文档站
- [本地预览](/zh/docs/admin/preview/) — `hugo server` 完整参数、局域网访问、容器与缓存管理
