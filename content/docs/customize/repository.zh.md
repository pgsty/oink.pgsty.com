---
title: 仓库与页面信息
linkTitle: 仓库与页面信息
description: 把「编辑当前页面」「提交文档议题」「查阅编辑历史」接到你的仓库，并在页尾显示最后修改时间、贡献者与反馈组件。
weight: 120
search_keywords:
  [
    仓库链接,
    编辑本页,
    提交议题,
    最后修改,
    贡献者,
    反馈,
    github_repo,
    github_subdir,
    github_url,
    lastmod,
    enableGitInfo,
    contributors,
    feedback,
    edit this page,
  ]
# 让本页真的渲染出反馈组件（docs 栏目 cascade 里默认是 false）
feedback: true
aliases:
  - /docs/configure/repository/
---

读者发现错误时，应该一键就能去修正；读者打开一页时，应该看得出它有多新。把 OINK 指向存放内容的 GitHub 仓库后，面包屑行右侧的页面操作菜单会多出「编辑当前页面」「查看编辑历史」和提交议题的入口，每页末尾则显示它最后一次修改的时间和对应的提交。

## 四个键接通全部链接 {#link-configuration}

```yaml {title="hugo.yml"}
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com # 文档源码仓库
  github_project_repo: https://github.com/pgsty/oink # 产品仓库（可选）
  github_branch: main # 默认 main
  github_subdir: '' # 仓库根到 Hugo 站点根的路径
```

按本站的这套配置，本页操作菜单中的条目指向：

| 菜单条目 | 目标 |
| --- | --- |
| 编辑当前页面 | `…/edit/main/content/docs/customize/repository.zh.md` |
| 查看编辑历史 | `…/commits/main/content/docs/customize/repository.zh.md` |
| 添加子页面 | `…/new/main/content/docs/customize?filename=change-me.md&value=<模板>` |
| 提交文档议题 | `…/issues/new?title=仓库与页面信息` |
| 提交项目议题 | `https://github.com/pgsty/oink/issues/new` |

- `github_repo` 是存放内容的仓库，不是主题仓库；指错了，读者提交的修改就会送到错误的地方。不设置它时，上表前四项都不可用。
- `github_project_repo` 可选，是读者报告产品缺陷（而非文档错误）的第二个仓库。「提交项目议题」只取决于它，顶栏的 GitHub 按钮也指向它。读者分不清该去哪个仓库时，就不要配置它。
- `github_branch`（默认 `main`）是编辑内容所在的分支，不是部署分支，也不是 Pages 生成的分支。
- `github_subdir` 是仓库根到 Hugo 站点的路径。站点在仓库根目录时留空；仓库里既有代码、站点放在 `website/` 下时，填 `website`。

每个键都可以在站点、单个语言、分区 cascade 或页面 front matter 中设置，因此一个站点可以汇集来自多个仓库的内容。完整定义见[配置总览](/zh/docs/customize/config/)。

## 内容来自另一个仓库 {#imported-content}

某个分区是从上游仓库复制或挂载过来的时候，它的编辑与历史链接应该指向上游。在该分区的 cascade 里覆盖仓库参数，再用 `path_base_for_github_subdir` 去掉或替换每页源文件路径的前缀，结果接在 `github_subdir` 后面。复制进站点的文件，路径相对站点根目录：

```yaml {title="content/reference/_index.zh.md"}
---
title: 上游参考
cascade:
  github_repo: https://github.com/OWNER/UPSTREAM
  github_project_repo: https://github.com/OWNER/UPSTREAM
  github_subdir: docs
  path_base_for_github_subdir: content/reference
---
```

于是 `content/reference/api/client.md` 映射到上游的 `docs/api/client.md`。

从站点外部挂载的目录，要匹配它的绝对源路径，而不是 Hugo 内部的挂载目标。在所有平台上（包括 Windows）路径都统一用 `/` 分隔后再比较，文件名保留原有大小写：

```yaml {title="外部源码位于 /srv/upstream/docs/"}
path_base_for_github_subdir: '^/srv/upstream/docs/'
```

配合 `github_subdir: docs`，`/srv/upstream/docs/api/client.md` 映射为 `docs/api/client.md`。映射结果必须是仓库内的非空路径。外部文件没有匹配任何映射，或者结果是绝对路径、以盘符开头、等于 `.`、用 `..` 跳出仓库时，该页不生成「编辑当前页面」「查看编辑历史」「添加子页面」三项；议题链接仍按各自的仓库配置生成。

`path_base_for_github_subdir` 的值是正则表达式。上游文件与本地文件名字不同时，改用 `from` / `to` 映射，例如把每个分区的 `_index.md` 对应到上游的 `README.md`：

```yaml {title="content/reference/_index.zh.md"}
path_base_for_github_subdir:
  from: content/reference/(.*?)/_index.md
  to: $1/README.md
```

OINK 把 `.md` 与 `.zh.md` 并排放在同一目录中，两种语言共用同一路径前缀，表达式里不需要语言目录。改完之后，在叶子页面和分区索引页上、每种语言各点一次「编辑当前页面」：表达式去掉的部分过多时，生成的 URL 看上去没问题，打开却是 404。

## 关闭其中几条 {#disable-actions}

菜单中的每个条目都有一个稳定的操作 ID，见[页面操作菜单](/zh/docs/customize/navigation/#page-actions)。Git 托管服务不支持某个操作时，用 CSS 隐藏对应条目：

```css {title="assets/css/project.css"}
.td-page-actions__item[data-td-action='create_child_page'] {
  display: none;
}
```

命令面板使用同一批 ID，用这种方式隐藏的条目在面板里仍然可用。CSS 只能隐藏链接，不能把错误的目标改对，所以某个目标对全站都不适用时，应当删掉产生它的配置键。要去掉某一页的整个菜单，在它的 front matter 中设置 `page_context_menu: false`，见[页面参数](/zh/docs/write/frontmatter/)。

「添加子页面」打开的新文件预填了主题 `assets/stubs/new-page-template.md` 的内容。在站点自己的同一路径 `assets/stubs/new-page-template.md` 放一份文件，就能换成你自己的页面骨架。

## 最后修改时间 {#lastmod}

「最后修改」一行取自 git 历史，而不是文件的修改时间，因为检出代码会重置文件时间。开启 Hugo 的 git 支持：

```yaml {title="hugo.yml"}
enableGitInfo: true
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com
  ui:
    lastmod_commit: subject # subject | hash | none
```

页尾随之显示「最后修改 2026年8月17日 · <commit 主题> (a1b2c3d)」，提交部分链接到 `…/commit/<hash>`。`lastmod_commit` 决定提交部分的样子：

| 取值 | 显示 |
| --- | --- |
| `subject`（默认） | commit 主题 + 缩写 hash |
| `hash` | `commit a1b2c3d` |
| `none` | 只显示日期，不链接 commit |

其它取值会告警（`invalid params.ui.lastmod_commit`）并使用 `subject`。

在 CI 中，要在 checkout 步骤设置 `fetch-depth: 0`：GitHub Actions 默认做浅克隆，只取最新一次提交，结果每一页都显示那次提交的日期，或者干脆没有日期。完整的工作流见[部署](/zh/docs/admin/deploy/#hosts)。尚未提交的文件没有 git 时间，所以在本地预览新写的页面时看不到这一行。构建环境完全没有 git 历史时，宁可不显示这一行，也不要用构建时间代替，因为构建时间说明不了内容何时修改。

这一行属于页面的 **页面信息（Annotation）** 区块，默认开启，单页用 `annotation: false` 关闭。同一个区块还会说明页面的来源，由 front matter 驱动，不需要覆盖模板：

- **上游署名**：页面改编自他人作品时，设置 `upstream_link` 以及四个必填键 `upstream_name`、`upstream_copyright`、`upstream_license`、`upstream_notice`。页尾会写明作品名、版权人与许可证，并链接到完整声明。再加 `upstream_modified: true`，注明本页在下游做过修改。
- **译文说明**：把 `params.ui.translation_notice` 设为权威版本的语言代码，译文页面就会显示一条指回原文的链接。用本语言原创的页面写 `translation_notice: false` 退出。

这两组键的完整定义见[页面参数](/zh/docs/write/frontmatter/#upstream)。要改动区块本身，覆盖下面三个 partial 中范围最小的那个：

| 覆盖哪个 partial | 改什么 |
| --- | --- |
| `layouts/_partials/annotation-items.html` | 增删或重排这些行，保留主题的标记、图标、打印规则与无障碍标签 |
| `layouts/_partials/page-meta-lastmod.html` | 换掉这些行的渲染标记 |
| `layouts/_partials/page-annotation.html` | 换掉整个区块的外层容器 |

## 页尾的组成 {#page-end}

所有阅读型布局都以同样的五个区块结束一页，顺序固定：

| 顺序 | 组件 | 主题默认 | 页面开关 |
| --- | --- | --- | --- |
| 1 | 分享 Share | 关（`params.ui.share` 为空） | `share: false`，或页面自己的列表 |
| 2 | 反馈 Feedback | 关 | `feedback: true` / `false` |
| 3 | 页面信息 Annotation | 开 | `annotation: false` |
| 4 | 翻页器 Pager | docs / book / blog 开 | `pager: false` |
| 5 | 评论 Comments | 配置完整时开 | `comments: false` |

这个顺序对应读者读完最后一段后依次会做的事：把这页转给别人、说一句有没有帮上忙、看看它从哪里来、翻到下一页、加入讨论。分享排在最前，因为想转发文章的读者，在被问到「有没有帮助」之前就已经拿定了主意。分享栏的配置见[写博客](/zh/docs/write/blog/#share)，翻页器见[导航与菜单](/zh/docs/customize/navigation/#pager)，评论见[启用评论](/zh/docs/admin/comments/)。

## 反馈组件 {#feedback}

反馈组件问一句「本页对你有帮助吗？」，给出「是」「否」两个按钮，选「否」后再提供四个可选原因。不用做问卷，你也能知道哪些页面没帮上读者。它默认关闭：

```yaml {title="hugo.yml"}
params:
  ui:
    feedback:
      enable: true
      reasons: true # 选「否」后是否追问原因
```

博客通常只保留评论，所以你可能只想在文档分区开启它，用 cascade：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  feedback: true
---
```

- 点一下就完成，没有输入框、没有提交按钮，也不需要登录。
- 浏览器按「页面 + 语言」把选择存进 `localStorage`，读者回访时能看到并修改自己的选择。
- 站点已接入 Google Analytics（`gtag`）时，组件发送 `docs_feedback` 事件，字段为 `result`（`solved` / `not_solved`）、`page_path`、`language`；选择原因时再发送一次，多带 `reason` 与 `refinement: true`，避免重复计数。没有 analytics 时组件照常工作，只是不上报；它不需要任何后端。
- 页面开启了评论时，回答下方会出现「在评论区补充详情」链接。组件不会替读者发表评论。

本页在 front matter 中开启了反馈组件，可以在页尾试用。

## 贡献者墙 {#contributors}

`contributors` 短代码用一面 GitHub 头像墙展示项目背后的人。数据来自站点 `data/` 目录下的文件，构建时不会访问 GitHub：

```yaml {title="data/contributors.yaml"}
items:
  - github: Vonng
    name: Ruohang Feng
    role: 主题作者
  - github: pgsty
    name: Pigsty
    role: 项目组织
  - github: gohugoio
    role: 静态站点生成器
    avatar: /icons/logo.svg
```

```markdown {title="源码"}
{{</* contributors */>}}
```

- `github` 必填，且必须是合法的 GitHub 用户名；重复的用户名会告警并跳过。
- `name` 默认等于用户名，`role` 可选。
- `url` 默认为 `https://github.com/<github>`。
- `avatar` 可选。不填时显示首字母占位，页面不发出任何网络请求；填写时必须是 `http(s)://` 地址或从站点根开始的路径。

需要多份名单时，每份名单一个数据文件，用 `data=` 指定；`class=` 用来加上供站点 CSS 使用的类名：

```markdown {title="源码"}
{{</* contributors data="maintainers" */>}}
```

在 Markdown 与 RSS 输出中，头像墙变成一串 `- [@handle](url) — role` 形式的列表。

> [!NOTE] 本站没有 `data/contributors.yaml`
> 上面的例子因此不在本页渲染。放一个数据文件进 `data/` 就能看到效果。

## 验证 {#verify}

在站点根目录构建，列出某个页面的操作链接，该页的源文件应属于配置的仓库。把示例路径换成你自己的页面：

```bash
hugo --printPathWarnings
PAGE=public/zh/docs/getting-started/index.html
test -f "$PAGE" && grep -o '<a[^>]*data-td-action[^>]*>' "$PAGE"
```

- 带 `data-td-action="edit_page"` 的链接指向 `github.com/<你的仓库>/edit/<分支>/<源文件路径>`，源文件路径与实际文件逐段一致。
- 分区索引页（`_index.md`）的源文件路径同样正确。
- 页尾有「最后修改」一行；尚未提交的新页面没有这一行属于正常情况。

## 相关 {#related}

- [页面参数](/zh/docs/write/frontmatter/) — `annotation` / `feedback` / `pager` / `page_context_menu` 等页面开关
- [配置总览](/zh/docs/customize/config/) — `github_*`、`ui.lastmod_commit`、`ui.feedback` 的完整定义
- [启用评论](/zh/docs/admin/comments/) — 页尾最后一块
- [分析与 SEO](/zh/docs/admin/analytics/) — 反馈事件落在哪里
- [Agent 支持](/zh/docs/customize/agents/) — 操作菜单里 Markdown 与助手那几条
