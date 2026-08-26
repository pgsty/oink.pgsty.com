---
title: Book 出版链路
linkTitle: Book 出版
description: 把 Book 语义降级与通用 EPUB/PDF 打包收回 OINK，同时让出版事实继续属于消费站。
weight: 40
icon: fa-solid fa-book-open
search_keywords: [Book 出版, EPUB, PDF, Pandoc, 打印, manifest]
design_kind: proposal
design_status: draft
proposal_owner: OINK 维护者
proposal_date: 2026-08-24
affected_contracts: [architecture, authoring, Book, outputs]
---

> [!WARNING] 已实现出版工具的提案草案
> 选择启用的 `BookManifest`、通用 EPUB/PDF runner 与产物校验都已随版本发布，
> 其规范性描述在[架构](/zh/docs/design/architecture/)。没有任何一次构建会自己产出这两种文件。
> 本提案仍然未决、且只在本提案未决的，是消费站迁移。

## 背景与证据 {#context-and-evidence}

OINK 已经负责 Book 导航顺序、编号图表公式示例、交叉引用、整书 Print HTML、标题与
脚注命名空间，以及逐页 Markdown 降级。缺失的是一份机器可读的整书交接产物，供
通用打包器消费。

DDIA 当前保留了一份规模不小的 EPUB 预处理器，持续追踪 OINK 的编号原语、跨页链接、
脚注、图片路径与 Book 顺序。TPME 则留有一份更早的导出脚本，它依赖的历史根目录文件
已经不再匹配当前 Hugo 内容树。前者证明出版需求真实存在，后者证明消费站自有配方会
悄悄过期。

EPUB 不是一份模板渲染结果。它是一个 ZIP 容器，包含出版元数据、资源 manifest、
spine、导航、内容文档、样式与媒体。Hugo 可以渲染中间输出，但最终文件必须由打包工具
生成并校验。

## 目标 {#goals}

1. 让每一种 Book 原语在出版场景中只有一份主题拥有的语义结果。
2. 发布选择启用的整书中间产物，确定性记录页面顺序、稳定目标与交叉引用；只在显式打包时
   从语义 Print 文档解析本地资源。
3. 提供通用、带版本的 EPUB 打包器，以及版本固定的 Print-to-PDF runner；消费站只传入
   自己的出版事实。
4. 用两个结构不同的公开 Book 消费站证明边界成立。

## 非目标 {#non-goals}

- 不为每个站点或分区默认启用昂贵的聚合输出。
- 不把 Markdown、JSON 或 HTML 中间产物称为 EPUB。
- 不猜测书名、作者、封面、ISBN、版本、权利或发布策略。
- 普通 Hugo 构建不抓取远程图片或服务。
- 不增加第二套 Book 外壳、第二个导航权威或通用出版配置命名空间。
- 不承诺不同浏览器引擎产生逐像素相同的 PDF 分页。

## 所有权边界 {#ownership-boundary}

| OINK 负责 | 消费站负责 |
| --- | --- |
| 从现有导航权威导出的 Book 顺序 | 要发布的语言、版本与 Book 根 |
| `fig`、`tbl`、`eq`、`eg`、xref、标题与脚注的语义降级 | 书名、作者、标识符、封面、权利与出版者信息 |
| 稳定中间 schema 与通用打包器行为 | 可选章节排除，以及出版专用的前后置内容 |
| EPUB 结构/链接校验与 Print-to-PDF runner | 发布自动化、签名、分发与法律批准 |
| 主题夹具与兼容检查 | 内容正确性与最终产物批准 |

消费站传递事实，不补丁 OINK 标记；OINK 提供语义，不决定一本书是否可以分发。

## 提议行为 {#proposed-behavior}

第一步实现是一份选择启用的 Book manifest，不是最终电子书。它引用已经发布的逐页
Markdown，只记录主题能够诚实推导的事实：

- schema 版本与语言；
- Book 根与拍平后的页面顺序；
- 页面标题、可选 Book 编号、HTML URL 与 Markdown URL；
- 稳定标题目标与编号对象目标；
- 跨页引用。

只有明确启用该输出的 Book 根才生成 manifest。普通 HTML、Print、Markdown、RSS、
搜索与导航构建不受这项 opt-in 影响，保持彼此独立。

OINK EPUB 打包器消费 manifest 与既有整书 Print HTML；后者已经包含命名空间化标题与脚注、
编号目标、作者原始锚点、MathML 与静态交互降级。打包器只改写出版 URL，调用固定版本的
Pandoc 3.10 profile，再用 EPUBCheck 与 OINK 自有内部目标检查器验证。消费站提供一份小型
metadata 文件与封面。逐页 Markdown 仍作为可审计的源码形态输出记录在 manifest 中，
但不成为第二条语义转换路径。

本地资源必须存在于生成的 `public/` 树下，默认打包完全不访问网络。如果消费站明确保留了
远程图片，必须显式传入 `--allow-remote-resources`；它只允许被动 HTTP(S) 媒体，绝不放行
远程脚本或本地文件协议。除非明确传入 `--force`，工具也不会覆盖已有 EPUB。

PDF 来自同一份整书 Print HTML。Runner 在带 `script-src 'none'` 的临时回环服务中提供构建产物，
默认阻止外部资源，调用显式指定的 Chrome/Chromium 二进制，并拒绝隐式覆盖。Print CSS 负责 A4 纸张、纸面代码
换行、占满版心的编号公式与页码。Checker 通过 Poppler 校验 PDF 结构、A4 几何、可提取的
Book 标题与抽样页码；最终批准仍包含渲染页面复核。

参考工作流保持四个显式步骤，不增加 Hugo 模式：

```sh
python3 /path/to/oink/bin/book-epub.py --manifest public/book/book.json \
  --public public --metadata metadata.yaml --output output/book.epub
python3 /path/to/oink/bin/check-book-epub.py output/book.epub \
  --manifest public/book/book.json
python3 /path/to/oink/bin/book-pdf.py --manifest public/book/book.json \
  --public public --chrome /path/to/chrome-headless-shell --output output/book.pdf
python3 /path/to/oink/bin/check-book-pdf.py output/book.pdf \
  --manifest public/book/book.json
```

## 输出、无障碍与安全 {#output-accessibility-security}

- HTML 与现有输出不加载 exporter，也不增加浏览器运行时。
- 中间产物保留文档语言、标题层级、替代文本、表头、链接文本与源码顺序。
- 交互控件沿用既有静态 Markdown/Print 降级。
- 资源路径必须解析到构建产物内部，或明确作为外部链接；打包过程绝不跟随作者内容中的
  任意本地路径。
- 任何消费站值在未经现有输出同等级的校验与规范化之前，都不能成为原始 HTML、CSS、
  命令参数或文件系统路径。

## 兼容与迁移 {#compatibility-and-migration}

这是一项增量、选择启用的能力。现有 Book 站保留当前输出与脚本。只有当主题中间产物能
解释 DDIA 当前校验的每一章、编号对象、脚注、图片与内部链接后，DDIA pilot 才删除消费站
侧的转换。TPME 是第二消费站门禁；任何 DDIA 专用路由、标签或章节清单都不能进入通用 schema。

## 原型证据 {#prototype-evidence}

第一版 manifest 在两个消费站隔离快照中选择启用，未修改任一消费站工作树，结果如下：

| 消费站 | 有序页面 | 标题 | Markdown 原始锚点 | 编号目标 | Xref | 未解析 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| DDIA | 23 | 597 | 33 | 131（106 图、3 表、22 示例） | 292 | 0 |
| TPME | 18 | 295 | 946 | 41（31 图、10 表） | 1,062 | 0 |

两份 manifest 都没有重复编号目标 ID。本机样本中，严格构建额外耗时约为 DDIA 0.28 秒、
TPME 0.22 秒。TPME 大量保留原始锚点这一事实很关键：打包器必须消费仍保留这些显式锚点的
渲染输出。整书 Print HTML 已经同时携带命名空间化标题、脚注、编号目标与 MathML，因此
manifest 不应再复制整棵文档树。

随后，两份隔离快照通过同一个通用命令完成打包：

| 消费站 | EPUB 章节 | 带类型目标 | 包大小 | OINK 包/链接检查 | EPUBCheck 5.3.0 |
| --- | ---: | ---: | ---: | --- | --- |
| DDIA | 23 | 131 | 22.9 MB | 0 错误 | 0 错误、0 警告 |
| TPME | 18 | 41 | 2.2 MB | 0 错误 | 0 错误、0 警告 |

DDIA 唯一的远程海报图使用了显式网络资源开关；TPME 完全由本地产物打包。通用 checker
按 `BookManifest` 校验每个页面锚点，以及每个目标的 `kind` 与 `num`，不再依赖 DDIA
旧预处理器的包装类。主题夹具同样通过了 Hugo minify 后的打包检查。出版 CI 把 Pandoc
3.10 与 EPUBCheck 5.3.0 的版本及归档摘要固定下来，并与 Hugo 兼容矩阵分为独立 job。

Print-to-PDF 试点使用 Chrome for Testing headless shell 151.0.7922.34，并在同一出版 CI job
按归档摘要固定：

| 消费站 | Book 页面 | PDF 页数 | 包大小 | 结构/文本/页码检查 | 渲染复核 |
| --- | ---: | ---: | ---: | --- | --- |
| 主题夹具 | 5 | 23 | 1.1 MB | 0 错误 | 封面、表格、代码、公式、脚注 |
| DDIA | 23 | 527 | 60.3 MB | 0 错误 | CJK、表格、图片、代码、参考文献、后置内容 |
| TPME | 18 | 197 | 8.4 MB | 0 错误 | CJK、宽表、代码、callout、后置内容 |

三份 PDF 均为 Tagged、未加密的 A4 文档。真实消费站 checker 找到了全部 manifest 页面标题，
以及首页、中页和末页的 CSS 页码。视觉复核还暴露并修复了三项既有 Print 缺陷：子页面数学
能力未把 KaTeX 样式传播给整书聚合；过宽的 Bootstrap 列重置误命中 KaTeX `col-align-*`
内部类；`pre > code` 覆盖了纸面换行。它们都是范围明确的 Print 修复，不是 exporter 专用
DOM 改写。

## 实施计划 {#implementation-plan}

1. **已完成**：把 Print 页面序列提取成一份共享 Book partial，不改变 Print 产物。
2. **已完成**：增加默认关闭的 manifest 与夹具 checker。
3. **已完成**：用同一条通用 EPUB 链路打包 DDIA 与 TPME 隔离快照，再校验带类型目标、
   内部链接与 EPUB 3.3 合规性。
4. **已完成**：用同一份固定 Chrome runner 渲染主题夹具与 DDIA/TPME 隔离快照，校验并
   目视复核代表页面。
5. **下一项消费站迁移**：只有在 DDIA 仓库独立接受新出版门禁后，才用 metadata 加一次
   调用替代它的语义预处理器。

## 验收标准 {#acceptance-criteria}

- 默认站点不发布新聚合文件，也没有显著构建成本。
- Hugo 0.160.1 与当前受支持 Hugo 都能在 warning 即失败模式下构建 opt-in 夹具。
- 现有 HTML、Print、Markdown、RSS、导航、搜索与浏览器测试全部通过。
- DDIA pilot 保留 23 章以及全部 106 图、3 表、22 示例与内部链接；这些都作为带类型的
  语义目标存在，未解析目标为零。
- TPME 通过同一份 schema 与打包器生成产物。
- 消费站脚本不再包含 OINK 原语专用正则表达式。
- EPUBCheck 与 OINK 包/链接检查器通过；PDF 结构/文本/页码 checker 与代表页面渲染复核
  全部通过。

## 待决问题 {#open-decisions}

1. 消费站迁移应发生在下一个 OINK release tag 之前还是之后？

## 决策记录 {#decision-log}

- 2026-08-24：起草主题/消费站所有权边界；先选择 opt-in 语义中间产物，不提前承诺最终
  EPUB API 或实现。
- 2026-08-24：DDIA/TPME 隔离试点解决了第一项格式决策：保留一份引用既有逐页 Markdown
  的 JSON manifest，并消费既有整书 Print HTML；不增加生成式整书 Markdown 或另一条
  语义降级路径。
- 2026-08-24：打包器消费整书 Print HTML，因此 manifest 同样使用既有 `no_print` 排除。
  这样出版顺序只有一份，也不需要第二个输出专用排除键。
- 2026-08-24：实现通用 EPUB 链路，并在出版 CI 固定 Pandoc 3.10 与 EPUBCheck 5.3.0。
  DDIA 与 TPME 隔离包同时通过带类型目标/内部链接检查与官方 EPUB 3.3 校验。
- 2026-08-24：远程出版资源继续默认拒绝。DDIA 的历史远程海报图通过显式 opt-in 验证，
  没有因此放松默认值，也没有加入 DDIA 专用改写。
- 2026-08-24：增加回环 Print-to-PDF runner，并按归档摘要固定 Chrome for Testing
  headless shell 151.0.7922.34。主题、DDIA 与 TPME PDF 均通过结构、文本、A4、页码检查
  与渲染复核。
- 2026-08-24：PDF 复核只修复 owning Print 契约：聚合数学能力传播、Bootstrap 列选择器
  范围、代码换行、编号公式单列布局与 CSS 页边距。
