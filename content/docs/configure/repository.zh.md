---
title: 代码仓库链接与页面信息
linkTitle: 仓库链接与页面信息
description: 帮助读者查看、编辑页面源码，并针对源码报告问题。
weight: 50
cSpell:ignore: lastmod
---

OINK 的文档与博客布局可以显示指向当前页面源码仓库的链接。它们位于面包屑行末尾的[页面操作菜单](/zh/docs/configure/navigation/#page-actions)中：

- **查阅 Markdown 源码**：当启用 Markdown 输出时，打开生成的 Markdown 备用版本。
- **查阅编辑历史**：打开源文件的提交历史。
- **编辑本页**：打开可编辑的源码视图。
- **创建子页面**：在当前页面下新建文件，并可使用站点的
  `assets/stubs/new-page-template.md` 模板。
- **创建文档 issue**：携带页面上下文，在文档仓库中创建 issue。
- **创建项目 issue**：可选地把 issue 提交到另一个产品仓库。

内置 URL 模式面向 GitHub 风格的代码仓库。如果使用其他兼容托管服务，请逐项验证；如果 URL 结构不同，应覆盖相应 partial。

## 链接配置 {#link-configuration}

典型站点配置如下：

```yaml
params:
  github_repo: https://github.com/OWNER/DOCS
  github_project_repo: https://github.com/OWNER/PRODUCT
  github_branch: main
  github_subdir: site
```

当内容来自多个代码仓库时，可以在全局、单种语言、分区 cascade 或页面 front
matter 中设置这些值。

### `github_repo` {#github_repo}

文档源码仓库 URL。它用于生成编辑、历史、创建子页面和创建文档 issue 链接：

```yaml
params:
  github_repo: https://github.com/pgsty/oink
```

省略后将隐藏从仓库派生的页面操作。如果页面源码实际位于消费站点，不要把它错误地指向主题仓库。

### `github_subdir`（可选） {#github_subdir-optional}

设置从仓库根目录到 Hugo 站点源码的路径。本项目把站点存放在 `oink.pgsty.com` 中：

```yaml
params:
  github_subdir: oink.pgsty.com
```

该值是仓库内路径，不是本地绝对路径；除非内容目录就是实际站点根目录，否则也不能直接填写内容目录。

### `github_project_repo`（可选） {#github_project_repo-optional}

设置另一个产品仓库，以显示 **创建项目 issue**：

```yaml
params:
  github_project_repo: https://github.com/OWNER/PRODUCT
```

内容缺陷应提交到文档仓库，页面讨论的产品行为应提交到产品仓库。如果读者无法清楚理解两者区别，应省略第二条链接。

### `github_branch`（可选） {#github_branch-optional}

设置源码与编辑 URL 使用的分支：

```yaml
params:
  github_branch: main
```

通常应填写站点源码分支。它不一定是部署分支、自动生成的 Pages 分支或主题修订版本。

### `path_base_for_github_subdir`（可选） {#path_base_for_github_subdir-optional}

如果某棵内容子树从另一个仓库挂载，请使用分区 cascade。系统会先移除 path
base，再把剩余内容路径附加到 `github_subdir`：

```yaml
---
title: Imported reference
cascade:
  github_repo: https://github.com/OWNER/UPSTREAM
  github_project_repo: https://github.com/OWNER/UPSTREAM
  github_subdir: docs
  path_base_for_github_subdir: content/reference
---
```

对于源页面 `content/reference/api/client.md`，以上配置会把仓库路径映射为
`docs/api/client.md`。

`path_base_for_github_subdir`
可以是正则表达式。按语言目录组织内容的站点可以写成：

```yaml
path_base_for_github_subdir: content/\w+/reference
```

OINK 将 `.md` 与 `.zh.md`
并置保存，通常两种语言使用相同静态 base，因此表达式中不需要语言目录。

如果源文件使用不同名称，请使用 `from` 和 `to` 映射。下面把分区 `_index.md`
映射到上游 `README.md`：

```yaml
path_base_for_github_subdir:
  from: content/reference/(.*?)/_index.md
  to: $1/README.md
```

请分别从叶子页、分区页和两种语言页面测试查看与编辑链接。正则表达式移除路径过多时，可能生成看似合理却指向错误位置的仓库 URL。

### `github_url`（可选） {#github_url-optional}

> [!WARNING]
>
> `github_url` 已弃用。新内容应使用
> [`path_base_for_github_subdir`](#path_base_for_github_subdir-optional)
> 和仓库参数。

旧页面可以在 front matter 中设置完整的自定义编辑 URL：

```yaml
---
title: Imported page
github_url: https://github.com/OWNER/UPSTREAM/edit/main/README.md
---
```

使用该值的页面会显示 **编辑本页**，但不显示
**查阅编辑历史**：这个不透明 URL 没有可供 OINK 推导历史链接的仓库路径。当目标与 GitHub 不兼容时，更适合使用站点专属模板覆盖。

### 禁用链接 {#disabling-links}

菜单中的每个条目都在 `data-oink-action` 上携带稳定的操作 ID：

| 链接           | 操作 ID                |
| -------------- | ---------------------- |
| 查阅生成源码   | `view_markdown`        |
| 查阅编辑历史   | `view_history`         |
| 编辑本页       | `edit_page`            |
| 创建子页面     | `create_child_page`    |
| 创建文档 issue | `create_issue`         |
| 创建项目 issue | `create_project_issue` |

当目标不支持某项操作时，可以在 `assets/scss/_styles_project.scss` 中将其隐藏：

```scss
.td-page-actions__item[data-oink-action='create_child_page'] {
  display: none;
}
```

命令面板中的操作使用同一批 ID，因此只隐藏菜单条目并不会让对应命令从面板中消失。

对于全局不可用的目标，应优先从配置中省略。CSS 隐藏适合选择性策略，但不能让错误链接变正确。

## 页面最后修改信息 {#last-modified-page-metadata}

启用 Hugo Git 信息并配置源码仓库：

```yaml
enableGitInfo: true
params:
  github_repo: https://github.com/OWNER/DOCS
```

OINK 随后可以在文档与博客页显示最后一次提交的日期、主题、hash 和源码链接。CI 必须为当前文件获取足够的 Git 历史；浅克隆可能导致元数据缺失或产生误导。

如果要在特定站点或分区隐藏提示，可以覆盖样式或负责页面元信息的 partial。当 Git 历史不可用时，不要把构建时间冒充为“最后修改”时间。
