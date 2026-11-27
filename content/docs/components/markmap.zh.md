---
title: 思维导图
linkTitle: 思维导图
description: 用 `markmap` 围栏把一段 Markdown 大纲变成可展开、可缩放的思维导图，源码本身就是能读的提纲。
weight: 130
search_keywords: [思维导图, Markmap, mind map, 大纲, outline, 脑图, 树状图]
---

思维导图让读者一眼看清一个主题的全貌：一份指南讲了哪些内容、一个系统拆成哪几块、哪些检查项归在一起。`markmap` 围栏直接用普通的 Markdown 大纲画出这张图：源码在 GitHub、打印稿和订阅源里仍是一份可读的列表，站点读者则可以折叠分支、缩放和拖动。节点之间有方向或条件（谁调用谁、失败就重试）时，改用 [Mermaid](/zh/docs/components/mermaid/) 流程图。

## 最简例子 {#minimal}

Markmap 默认关闭，需要先在站点配置中打开。打开之前，围栏只是普通代码块，也不加载任何导图脚本。

```yaml {title="hugo.yml"}
params:
  markmap: true
```

然后把大纲写进 `markmap` 围栏：

````markdown {title="源码"}
```markmap
# 备份策略
## 物理备份
- pgBackRest 全量与增量
- 持续归档 WAL
## 逻辑备份
- 按库执行 pg_dump
- 恢复到临时实例
## 校验
- 每周恢复演练
- 每份备份做校验和
```
````

```markmap
# 备份策略
## 物理备份
- pgBackRest 全量与增量
- 持续归档 WAL
## 逻辑备份
- 按库执行 pg_dump
- 恢复到临时实例
## 校验
- 每周恢复演练
- 每份备份做校验和
```

第一个标题是根节点，其余标题和列表项按层级挂在它下面。点击节点上的圆点折叠或展开这一支，滚轮缩放，拖动平移。在你拖动或缩放之前，正文栏宽度一变，导图就自动重新适配；一旦手动操作过，导图会保持你的位置，此时点导图下方的 **适应窗口** 即可重新显示整张图，并恢复自动适配。这个按钮可以用键盘操作，打印时隐藏。

## 多层级 {#depth}

主题需要几层就写几层标题和列表，导图会自动排布，并把整棵树缩放到画布内。

````markdown {title="源码"}
```markmap
# 运维手册
## 安装
### 环境要求
### 单节点
### 三节点集群
## 配置
### 连接池
### 内存与 WAL
### 访问控制
## 监控
### 监控面板
### 告警规则
## 备份与恢复
### 全量与增量备份
### 时间点恢复
### 恢复演练
## 升级
### 小版本
### 用 pg_upgrade 升级大版本
```
````

```markmap
# 运维手册
## 安装
### 环境要求
### 单节点
### 三节点集群
## 配置
### 连接池
### 内存与 WAL
### 访问控制
## 监控
### 监控面板
### 告警规则
## 备份与恢复
### 全量与增量备份
### 时间点恢复
### 恢复演练
## 升级
### 小版本
### 用 pg_upgrade 升级大版本
```

## 链接、代码与强调 {#inline-markdown}

节点文字支持行内 Markdown：链接可以点击，并以链接文字作为无障碍名称；行内代码用等宽字体；粗体与斜体照常生效。

````markdown {title="源码"}
```markmap
# 日常命令
## 预览
- `hugo server` — 打开 [localhost:1313](http://localhost:1313/)
- `hugo server -D` — **连草稿一起**预览
## 构建
- `hugo --printPathWarnings`
- `hugo --gc --minify` — 发布用
## 主题
- `hugo mod get -u github.com/pgsty/oink`
- [主题仓库](https://github.com/pgsty/oink)
- [本站源码](https://github.com/pgsty/oink.pgsty.com)
```
````

```markmap
# 日常命令
## 预览
- `hugo server` — 打开 [localhost:1313](http://localhost:1313/)
- `hugo server -D` — **连草稿一起**预览
## 构建
- `hugo --printPathWarnings`
- `hugo --gc --minify` — 发布用
## 主题
- `hugo mod get -u github.com/pgsty/oink`
- [主题仓库](https://github.com/pgsty/oink)
- [本站源码](https://github.com/pgsty/oink.pgsty.com)
```

写在标题或列表项下面的段落、表格和代码块，会成为该节点的注释。节点上会出现一个标记，点击它，或用 Tab 聚焦后按 Enter 或空格，即可打开注释；按 Escape 关闭，焦点回到标记上。

## 节点里的公式 {#math}

在节点里写 `$…$` 即可插入公式。导图用随主题内置的 MathJax 排版公式，只有含公式的导图才会加载它；正文里的普通公式仍由 [KaTeX](/zh/docs/components/math/) 渲染。

````markdown {title="源码"}
```markmap
# 常看的几个 PostgreSQL 指标
## 缓存命中率
- $\frac{blks\_hit}{blks\_hit + blks\_read}$
- 低于 0.99 时检查 shared_buffers
## 复制延迟
- $lsn_{primary} - lsn_{replica}$
## 事务吞吐
- $TPS = \frac{\Delta xact\_commit}{\Delta t}$
```
````

```markmap
# 常看的几个 PostgreSQL 指标
## 缓存命中率
- $\frac{blks\_hit}{blks\_hit + blks\_read}$
- 低于 0.99 时检查 shared_buffers
## 复制延迟
- $lsn_{primary} - lsn_{replica}$
## 事务吞吐
- $TPS = \frac{\Delta xact\_commit}{\Delta t}$
```

## 控制初始展开层数 {#options}

大导图初始折叠起来更好读。在围栏正文最前面写一段 Markmap 的 YAML 头（它属于这张图，不是 Hugo 的 front matter）：`foldLevel: 1` 只显示根节点和第一层分支，更深的层级全部收起，读者按需展开自己关心的分支。`colorDepth` 指定从第几层起，每个分支沿用同一种颜色。

````markdown {title="源码"}
```markmap
---
markmap:
  foldLevel: 1
  colorDepth: 2
---

# 故障处理手册
## 主库宕机
### 用两个监控源确认
### 提升从库
### 让连接池指向新主库
## 复制延迟
### 查找长时间运行的查询
### 检查网络吞吐
## 磁盘将满
### 清理过期的 WAL 归档
### 扩容数据卷
## 慢查询
### 查看 pg_stat_statements
### 检查缺失的索引
```
````

```markmap
---
markmap:
  foldLevel: 1
  colorDepth: 2
---

# 故障处理手册
## 主库宕机
### 用两个监控源确认
### 提升从库
### 让连接池指向新主库
## 复制延迟
### 查找长时间运行的查询
### 检查网络吞吐
## 磁盘将满
### 清理过期的 WAL 归档
### 扩容数据卷
## 慢查询
### 查看 pg_stat_statements
### 检查缺失的索引
```

## 折进折叠块 {#in-details}

每张导图固定 300 像素高，连放几张就会把正文撑得很散。只有部分读者需要的全景图，放进 `> [!DETAILS]` 折叠块；折叠块里的每一行都以 `>` 开头，围栏行也不例外。

````markdown {title="源码"}
> [!DETAILS] 监控系统采集的全部指标
> ```markmap
> # 指标
> ## 主机
> - CPU、内存与磁盘
> - 网络吞吐
> ## PostgreSQL
> - 连接与锁
> - 复制延迟
> - 缓存命中率
> ## 连接池
> - 客户端与服务端连接
> - 等待时间
> ## 备份
> - 最近一次成功备份
> - WAL 归档延迟
> ```
````

> [!DETAILS] 监控系统采集的全部指标
> ```markmap
> # 指标
> ## 主机
> - CPU、内存与磁盘
> - 网络吞吐
> ## PostgreSQL
> - 连接与锁
> - 复制延迟
> - 缓存命中率
> ## 连接池
> - 客户端与服务端连接
> - 等待时间
> ## 备份
> - 最近一次成功备份
> - WAL 归档延迟
> ```

## 输出形态 {#outputs}

读者滚动到导图附近时才绘制它；在此之前，以及关闭 JavaScript 或引擎加载失败时，页面显示的是大纲源码，完整层级照样可读。打印、Markdown 输出和 RSS 始终原样保留大纲。

## 参数参考 {#reference}

站点参数（`hugo.yml`）：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `params.markmap` | bool | `false` | 关闭时围栏保持为代码块，不加载任何运行时 |
{.fields meta="type default"}

单张导图的选项（`foldLevel`、`colorDepth`、`wrapWidth` 等）写在围栏正文开头的 `markmap:` YAML 头里。它们是 Markmap 1 的选项，完整列表见 [Markmap 文档](https://markmap.js.org/docs/options)。围栏属性不影响导图：宽度撑满正文栏，高度固定为 300px。

## 限制与常见问题 {#limits}

- 300px 的高度来自主题的一条 `.markmap > svg` 规则，围栏无法修改。层级很深时，用 `foldLevel` 收起，或拆成两张图。导图是内联 SVG，`{#id num=}` 编号与图片缩放都不适用。
- 节点文字跟随站点正文颜色，连线保留 Markmap 自己的配色。站点改过颜色的，要在浅色和深色模式下各检查一遍。
- `>`、`&`、引号等字符按原样显示；节点里的 HTML 标签会被丢弃，图片标签和 Markmap 的魔法注释除外。
- 某张导图、它的注释或公式加载失败时，这张图退回大纲源码，同页其他导图不受影响。

## 旧选项名 {#migration}

导图的 YAML 头里如果还在用左列的旧选项名，请改成右列的新名字。旧名字会被忽略，构建时给出告警。

| 旧选项 | 现行选项 |
| --- | --- |
| `initialExpandLevel: N` | N 为正整数时改为 `foldLevel: N-1`；N 为 `-1` 时直接删除 |
| `maxWidth` | `wrapWidth` |
| `spacingHorizontal` | `levelGap` |
| `spacingVertical` | `siblingGap` |
| `colorFreezeLevel` | `colorDepth` |

`foldLevel` 把根节点算作第 0 层，所以数值要减一。`paddingX`、`lineWidth`、`extraJs`、`extraCss`、`embedAssets`、`htmlParser` 与 `activeNode` 已不存在，请直接删除：导图不能自行注入脚本或样式。

## 相关 {#related}

- [Mermaid](/zh/docs/components/mermaid/) — 有方向、有条件的图
- [文件树](/zh/docs/components/filetree/) — 目录结构用它更准确
- [提示块](/zh/docs/components/callout/) — `[!DETAILS]` 折叠块的完整用法
- [配置总览](/zh/docs/customize/config/) — `params.markmap`
