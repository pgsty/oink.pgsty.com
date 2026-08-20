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

面包屑行右侧的 **操作菜单** 里与仓库有关的条目，由几个 `github_*` 参数推导；页尾的「最后修改」信息行来自 git 历史。前提是内容存放在一个 GitHub 风格的仓库里。

## 四个键接通全部链接 {#link-configuration}

操作菜单里所有跟仓库有关的条目，都由这几个键推导出来：

```yaml {title="hugo.yml"}
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com # 文档源码仓库
  github_project_repo: https://github.com/pgsty/oink # 产品仓库（可选）
  github_branch: main # 默认 main
  github_subdir: '' # 仓库根到 Hugo 站点根的路径
```

上面是本站的真实配置。填好之后，本页的操作菜单里这几条指向：

| 菜单条目 | 目标 |
| --- | --- |
| 编辑当前页面 | `…/edit/main/content/docs/customize/repository.zh.md` |
| 查阅编辑历史 | `…/commits/main/content/docs/customize/repository.zh.md` |
| 添加子页面 | `…/new/main/content/docs/customize?filename=change-me.md&value=<模板>` |
| 提交文档议题 | `…/issues/new?title=仓库与页面信息` |
| 提交项目议题 | `https://github.com/pgsty/oink/issues/new` |

几点约定：

- `github_repo` 指向内容所在的仓库，不是主题仓库。写主题仓库会把读者的改动引到错误的位置。省略它时，上表五条全部消失。
- `github_project_repo` 是第二个仓库，接收产品缺陷而非文档错误的议题。读者难以区分两者时不要配置它。
- `github_branch` 默认 `main`，填的是内容分支，不是部署分支，也不是 Pages 自动生成的分支。
- `github_subdir` 是仓库内路径。站点源码在仓库根目录时留空；放在子目录（例如仓库里同时有代码和 `website/`）时填 `website`。

这几个键都可以在站点、单语言、栏目 cascade 或页面 front matter 上设置，内容来自多个仓库时用得到。键的完整定义在[配置总览](/zh/docs/customize/config/)。

## 内容来自另一个仓库 {#imported-content}

把一棵子树从上游仓库挂进来时，用栏目 cascade 覆盖仓库参数，再用 `path_base_for_github_subdir` 告诉主题：先去掉本地路径前缀，剩下的部分接到 `github_subdir` 后面。

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

`content/reference/api/client.md` 因此映射到上游的 `docs/api/client.md`。

`path_base_for_github_subdir` 的值是正则；源文件名与本地不同名时改用 `from` / `to` 映射，例如把每个栏目的 `_index.md` 对到上游的 `README.md`：

```yaml {title="content/reference/_index.zh.md"}
path_base_for_github_subdir:
  from: content/reference/(.*?)/_index.md
  to: $1/README.md
```

OINK 把 `.md` 与 `.zh.md` 并排放在同一个目录里，两种语言共用同一个路径前缀，正则里不需要语言目录。改完从叶子页、栏目首页、两种语言各点一次「编辑当前页面」：正则去掉的部分过多时，生成的 URL 看上去合理，实际是 404。

## 关闭其中几条 {#disable-actions}

菜单里每个条目都带一个稳定的操作 ID：

| 菜单条目 | 操作 ID |
| --- | --- |
| 复制 Markdown 文本 | `copy_markdown` |
| 查阅 Markdown 源码 | `view_markdown` |
| 在 ChatGPT / Claude 中打开 | `open_chatgpt` / `open_claude` |
| 查阅编辑历史 | `view_history` |
| 编辑当前页面 | `edit_page` |
| 添加子页面 | `create_child_page` |
| 提交文档议题 | `create_issue` |
| 提交项目议题 | `create_project_issue` |
| 打印完整章节 | `print_section` |

托管服务不支持某条时，用 CSS 隐藏：

```scss {title="assets/scss/_styles_project.scss"}
.td-page-actions__item[data-oink-action='create_child_page'] {
  display: none;
}
```

命令面板用的是同一批 ID，隐藏菜单条目不会让它从面板里消失。全站用不上的目标应当从配置里省略对应的键，而不是用 CSS 遮盖：CSS 只能隐藏链接，不能把错误的链接改对。

整个菜单也可以按页面关闭，front matter 写 `page_context_menu: false`，见[页面参数](/zh/docs/write/frontmatter/)。

「添加子页面」预填的新页面模板来自主题的 `assets/stubs/new-page-template.md`；站点在自己的 `assets/stubs/new-page-template.md` 放一份同名文件即可替换成自己的骨架。

## 最后修改时间 {#lastmod}

这一行的数据来自 git，不是文件的 mtime。打开 Hugo 的 git 支持：

```yaml {title="hugo.yml"}
enableGitInfo: true
params:
  github_repo: https://github.com/pgsty/oink.pgsty.com
  ui:
    lastmod_commit: subject # subject | hash | none
```

页尾出现「最后修改 2026年8月17日 · <commit 主题> (a1b2c3d)」，commit 部分链到 `…/commit/<hash>`。`lastmod_commit` 三个取值：

| 取值 | 显示 |
| --- | --- |
| `subject`（默认） | commit 主题 + 缩写 hash |
| `hash` | `commit a1b2c3d` |
| `none` | 只有日期，不链 commit |

写别的值会让构建失败，报 `invalid params.ui.lastmod_commit`。

两点注意：

- CI 必须有足够的 git 历史。浅克隆（`fetch-depth: 1`）取不到文件的最后一次提交，日期会缺失或错误。GitHub Actions 里设 `fetch-depth: 0`。
- 未提交的文件没有 git 时间。本地预览新写的页面时这一行不出现。

git 历史不可用时不要用构建时间代替「最后修改」，构建时间不是内容的修改时间。

这一行属于 **页面信息（Annotation）** 组件，默认开启，位置在反馈之后、翻页器之前。整页关闭写 `annotation: false`。

这一行不是页面信息区块的全部。同一个区块还会渲染两种来源说明，都由页面 front matter 驱动，不需要覆盖模板：

- **上游署名**：页面改写自别处时写 `upstream_link`，配上 `upstream_name`、`upstream_copyright`、`upstream_license`、`upstream_notice` 四个必填键，页尾出现一条带作品、版权人、许可证与完整声明链接的署名行；再写 `upstream_modified: true` 追加一条「本地已修改」。
- **译文说明**：`params.ui.translation_notice` 写权威版本的语言代码，译文页就显示一条指回原文的说明；以本语言原创的页面写 `translation_notice: false` 退出。

这两族键的完整定义见[页面参数](/zh/docs/write/frontmatter/#upstream)。

确实需要自定义时，三个覆盖点各管一层：

| 覆盖哪个 partial | 改什么 |
| --- | --- |
| `layouts/_partials/annotation-items.html` | 增删或重排这些行，保留主题的标记、图标、打印规则与无障碍标签 |
| `layouts/_partials/page-meta-lastmod.html` | 换掉这些行的渲染标记 |
| `layouts/_partials/page-annotation.html` | 换掉整个区块的外层容器 |

## 页尾的组成 {#page-end}

五个组件的顺序是固定的，所有阅读型布局共用一份实现：

| 顺序 | 组件 | 主题默认 | 页面开关 |
| --- | --- | --- | --- |
| 1 | 分享 Share | 关（`params.ui.share` 为空） | `share: false`，或页面自己的列表 |
| 2 | 反馈 Feedback | 关 | `feedback: true` / `false` |
| 3 | 页面信息 Annotation | 开 | `annotation: false` |
| 4 | 翻页器 Pager | docs / book / blog 开 | `pager: false` |
| 5 | 评论 Comments | 配置完整时开 | `comments: false` |

顺序对应读者读完最后一段之后依次会做的事：把这页递出去、说一句有没有帮上忙、看看它从哪来、翻到下一页、加入讨论。分享排在最前，因为它是唯一朝外的一块，而且一个决定要把文章转给别人的读者，在被问「这页怎么样」之前就已经决定了。分享栏的配置见[写博客](/zh/docs/write/blog/#share)。

评论的配置在[启用评论](/zh/docs/admin/comments/)。

## 反馈组件 {#feedback}

一行问题、两个按钮：「这篇文档解决了你的问题吗？」→ 是 / 否。选「否」再展开四个可选原因。默认关闭：

```yaml {title="hugo.yml"}
params:
  ui:
    feedback:
      enable: true
      reasons: true # 选「否」后是否追问原因
```

只给文档栏目开，用 cascade（博客通常只留评论）：

```yaml {title="content/docs/_index.md"}
---
title: 文档
cascade:
  feedback: true
---
```

行为边界：

- 点击即完成，没有输入框、没有提交按钮、没有登录。
- 选择按「页面 + 语言」写进浏览器 `localStorage`，读者回访时还能看到并修改自己的选择。
- 站点已有 Google Analytics（`gtag`）时，发送 `docs_feedback` 事件，字段 `result`（`solved` / `not_solved`）、`page_path`、`language`；选原因时再发一次，多带 `reason` 与 `refinement: true`，便于和首次计数区分。**没有 analytics 时组件照常工作**，只是不上报，它不需要任何后端。
- 本页启用了评论时，反馈结果下面会多一条「在评论区补充详情」的锚点链接。反馈与 giscus 是两条独立的数据流，主题不会代替读者写评论。

本页在 front matter 里写了 `feedback: true`（docs 栏目默认关闭），页尾可以看到真实的组件。

## 贡献者墙 {#contributors}

`contributors` shortcode 渲染一面 GitHub 头像墙，数据来自站点 `data/` 目录下的一个文件，**不在构建期访问 GitHub**：

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

字段：`github` 必填（校验成合法的 GitHub 用户名，重复会让构建失败）；`name` 缺省等于 `github`；`role` 可选；`url` 缺省是 `https://github.com/<github>`；`avatar` 可选，不填时渲染成首字母占位块，不发任何网络请求，填写时必须是 `http(s)://` 或站内根相对路径。

多套名单写多个数据文件，用 `data=` 指定：

```markdown {title="源码"}
{{</* contributors data="maintainers" */>}}
```

在 Markdown 与 RSS 输出里，头像墙降级成一串 `- [@handle](url) — role` 的列表。

> [!NOTE] 本站没有 `data/contributors.yaml`
> 上面的例子因此不在本页渲染。放一个数据文件进 `data/` 就能看到效果。

## 验证 {#verify}

- 点开本页面包屑行右侧的操作菜单，「编辑当前页面」应该指向 `github.com/<你的仓库>/edit/<分支>/<源文件路径>`，路径要与仓库里的实际路径逐段对应。
- 从栏目首页（`_index.md`）再点一次：栏目首页最容易被 `path_base_for_github_subdir` 的正则改错。
- 页尾应有「最后修改」行；本地新建、尚未 `git commit` 的页面没有这一行是正常的。
- 命令行核对生成的链接：

```bash
hugo -d public
grep -o 'data-oink-action="edit_page" href="[^"]*"' \
  public/zh/docs/customize/repository/index.html
```

## 相关 {#related}

- [页面参数](/zh/docs/write/frontmatter/) — `annotation` / `feedback` / `pager` / `page_context_menu` 等页面开关
- [配置总览](/zh/docs/customize/config/) — `github_*`、`ui.lastmod_commit`、`ui.feedback` 的完整定义
- [启用评论](/zh/docs/admin/comments/) — 页尾最后一块
- [分析与 SEO](/zh/docs/admin/analytics/) — 反馈事件落在哪里
- [Agent 支持](/zh/docs/customize/agents/) — 操作菜单里 Markdown 与助手那几条
