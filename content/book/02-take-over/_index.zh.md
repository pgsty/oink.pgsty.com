---
title: 接手你的站点
linkTitle: 接手站点
description: 亲手运行预览，弄清每类改动由哪个文件控制，对照一份清单审阅 agent 的成果，再用一个个小的后续提示词持续改进站点。
book_kind: chapter
book_number: 2
weight: 20
---

agent 的会话总会结束，站点却不该随之结束。在提出更多要求之前，先确认三件事：你能脱离 agent
运行站点，知道每类改动落在哪里，并且亲自检查过结果。这大约需要二十分钟，却能把一个生成出来的站点，变成真正属于你的站点。

## 亲手运行 {#preview}

在站点目录里启动预览，打开 Hugo 打印出的地址：

```bash
cd my-site
hugo server
```

第一次启动会慢一些，因为 Hugo 要把固定版本的 OINK 下载到模块缓存里。之后改一句首页上的文字，改在
`data/home/en.yaml` 或 agent 写的其他语言文件（如 `data/home/zh.yaml`）里，然后保存，浏览器会自动刷新。看到自己的修改出现在页面上，小改动就不必再依赖
agent 了。

## 认识五个位置 {#anatomy}

OINK 站点就是一个普通的 Hugo 仓库。你要做的几乎所有改动，都落在下面五个位置之一：

```filetree {title="OINK 站点：改动各落在哪里"}
- hugo.yaml           # 全站设置：标题、baseURL、语言、菜单、params.ui
- go.mod              # 站点固定使用的 OINK 版本
- content/            # 所有页面；路径即 URL，*.zh.md 是对应的中文页面
  - docs/
  - blog/
- data/               # 首页区块、下载记录、页脚链接
  - home/
- assets/             # Logo、需要处理的图片、css/project.css
- static/             # 原样发布的文件
- layouts/            # 模板覆盖；最好为空
- .github/workflows/  # 部署流水线
```

`content/` 和 `data/` 每周都在变；`hugo.yaml` 一改就影响整个站点；`go.mod` 只在升级 OINK
时才会改动。`layouts/` 值得在第一天就看一眼：放在这里的文件会替换主题模板，从此收不到主题的修复，所以每个覆盖都应该有一个你说得出的理由。[Starter 仓库导览](/zh/docs/start/anatomy/)逐一介绍了
Starter 自带的每个文件。

## 审阅成果 {#review}

agent 检查过自己的工作，但站点真正面向的读者是你。打开预览，逐项过一遍：

| 检查项 | 怎么做 | 能发现什么 |
| --- | --- | --- |
| 每种语言 | 在三个不同页面上，用顶部导航栏切换语言 | agent 只写了一种语言版本的页面 |
| 每种外观 | 按 {{< kbd "T" >}} 循环切换预设，按 {{< kbd "Y" >}} 循环切换浅色与深色 | 在某种模式下看不清的自定义颜色 |
| 手机 | 把窗口缩窄到约 390 像素 | 过宽的表格、头图和过长的代码行 |
| 搜索 | 按 {{< kbd "/" >}}，搜索你自己页面里的一个词 | 缺失或过期的搜索索引 |
| Markdown 副本 | 在页面地址后加上 `index.md` | 转成纯文本后，AI 读者难以读懂的组件 |
| 覆盖文件 | 列出 `layouts/` 和 `assets/css/` 下的文件 | 没有理由就从主题复制过来的模板 |
| 占位内容 | 在仓库里搜索 `<`、`TODO` 和 `example.com` | agent 无从得知、留给你补的信息 |
| 生产构建 | 运行下面的命令，读完每一条告警 | 被 OINK 忽略并替换成安全默认值的设置 |
{#tbl-first-review num="2-1" caption="对 agent 搭建的站点做第一次审阅，大约二十分钟。"}

生产构建就是你的托管平台将要运行的那条命令：

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

它以一行 `Total in …` 结束。读一读这一行上方的告警：OINK
遇到拼错的配置键或不完整的集成时，会报告一条告警并继续构建，所以告警通常意味着某个你期待的功能被关掉了，而不是站点坏了。

## 用后续提示词改进 {#follow-up}

每段提示词只要求一处改动，并说明 agent 该如何检查。小改动换回的是一分钟就能读完的小
diff；“把网站改得更好”换回的却是四十个你根本审不过来的文件。

```text {num="2-1" caption="后续提示词，每段对应一处可审阅的改动。" #eg-follow-ups}
把全站的强调色改成 #0f766e，博客单独改成 #6d28d9。
在浅色和深色模式下都检查一遍。

把 content/docs/get-started/ 下的所有页面翻译成简体中文。
front matter 里的权重和每个标题 ID 都要与英文保持一致。

安装页太长了。把它拆到 content/docs/install/ 下，每个平台一页，
并用 aliases 让旧地址继续可用。

运行生产构建，修复每一条告警，每处修复用一句话说明。
```

如果自己动手比描述改动更快，就直接改文件：一句话、一个菜单标签、一个日期。一次涉及大量文件的改动，比如一轮翻译或一次结构调整，以及你还没学过的设置，交给
agent 去做。第二部分会讲这些设置，久而久之，你就能准确告诉 agent 该改哪个键，或者干脆自己改。

## 保存基线 {#baseline}

把站点当前的状态提交到 Git，这样以后每次会话的改动，都会以 diff 的形式呈现在一个你审阅过的版本之上：

```bash
git init        # 如果 agent 已经建好了仓库，跳过这一步
git add -A
git commit -m "Initial site from the OINK Starter"
```

Starter 自带的 `.gitignore` 已经把 `public/`、`resources/` 和 Hugo 的缓存排除在 Git
之外。在这次提交旁边记下 Hugo 版本（`hugo version`）和 `go.mod` 里的 OINK
版本；以后出了变化，这三个事实能告诉你，变的是内容、主题还是工具链。

## 第二部分讲什么 {#part-two}

第二部分在一个示例项目上亲手重建同类功能：开源时序数据库 Acme DB 的文档站，从
[OINK Starter](https://github.com/pgsty/oink-starter)
起步。每章为它加上一层，在本页里把源码和效果并排展示，并在结尾给出一段提示词，让你在自己的站点上做同样的事。[第 3 章](/zh/book/03-pages/)从单个页面开始。
