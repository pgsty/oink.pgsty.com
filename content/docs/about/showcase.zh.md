---
title: Case 导览
linkTitle: 案例
description: 按文档、书籍、落地页与交互工具的形态，找到最接近自己需求的 OINK 生产案例。
weight: 20
search_keywords: [Case 导览, 案例, 示例站点, 生产站点, Pigsty, 谁在用 OINK]
aliases:
  - /docs/about/examples/
---

正式的 [Case 案例库](/zh/case/) 把十五个生产站点整理成可复用的实现模式，
首页展示的也是同样这十五个。其中十四个使用 OINK，本站本身也作为自举案例
列入；[pgext.cloud](/zh/case/pgext-cloud/) 则作为边界案例保留，因为它刻意
不使用 OINK。

当你已经知道自己要搭建哪类站点时，可以从这里开始：先通过案例了解架构与
取舍，再沿页面链接进入具体配置文档。案例中的数量描述对应盘点时的快照，
不是对持续变化的线上站点作永久承诺。

## 发行版文档 {#pigsty-sites}

### [pigsty.io](/zh/case/pigsty-io/) {#pigsty-io}

大型英文站，把发行版手册、博客、扩展目录、分类、版本导航与价格落地页放在
同一个站点中。

### [pigsty.cc](/zh/case/pigsty-cc/) {#pigsty-cc}

独立部署的中文对等站；当两种语言的语料都已成为完整产品时，拆成两个单语站
是一种清晰的取舍。

### [pgsty.pro](/zh/case/pgsty-pro/) {#pgsty-pro}

双语版本档案站，从可复用的结构化发布数据渲染大量版本页面。

## 产品文档 {#product-sites}

### [PIG](/zh/case/pig/) {#pig-pgsty-com}

紧凑的双语命令行工具手册，配有数据驱动首页与体量更大的博客。

### [SOW](/zh/case/sow/) {#sow-pgsty-com}

双语运维手册，使用独立下载内容类型展示发布元数据与产物。

### [SILO](/zh/case/silo/) {#silo-pgsty-com}

大型上游迁移案例，通过受检查的清单生成双语文档导航。

### [PG Exporter](/zh/case/pg-exporter/) {#exp-pgsty-com}

把生成导航、结构化指标目录与系统字体组合起来的指标手册。

## 书籍 {#book-sites}

### [《设计数据密集型应用》](/zh/case/ddia/) {#ddia-vonng-com}

多语言、多版本书籍，也是编号图表、交叉引用、章节导航与索引最完整的案例。

### [《The Product-Minded Engineer》](/zh/case/tpme/) {#tpme-vonng-com}

只需要 OINK Book 外壳的聚焦型双语出版物。

### [《PG 技术内幕》](/zh/case/pg-internal/) {#pgint-vonng-com}

已完稿的中文译本，刻意做成单语 Book：没有文档树，也没有可切换的第二语言。

## 汇编、落地页与自定义站点 {#other-sites}

### [pgsql.cc](/zh/case/pgsql-cc/) {#pgsql-cc}

聚合型运维文库，让多个上游手册与完成度不一的翻译树共享搜索和视觉体系。

### [pgsty.com](/zh/case/pgsty-com/) {#pgsty-com}

小型双语公司站，展示 OINK 也可以主要作为数据驱动的落地页系统。

### [Capslock](/zh/case/capslock/) {#caps-vonng-com}

每种语言只有两页，其中自定义外壳承载数据驱动交互配置生成器。

### [oink.pgsty.com](/zh/case/oink/) {#oink-pgsty-com}

完整参考站：公开文档、实时组件示例、设计契约、多种内容外壳与回归覆盖都在
同一个仓库中。

### [pgext.cloud](/zh/case/pgext-cloud/) {#pgext-cloud}

不是 OINK 站点：专门定制的单页扩展目录，收在案例库里，用来标出可查询数据集
超出文档主题适用范围的那条边界。

## 如何选择起点 {#choosing-a-starting-point}

- 常规产品手册：从 [PIG](/zh/case/pig/) 或 [SOW](/zh/case/sow/) 开始。
- 大型迁移：对比 [SILO](/zh/case/silo/) 与 [pgsql.cc](/zh/case/pgsql-cc/)。
- 书籍：对比精简的 [TPME](/zh/case/tpme/) 与更复杂的 [DDIA](/zh/case/ddia/)，
  单语场景可参考 [《PG 技术内幕》](/zh/case/pg-internal/)。
- 落地页或交互站：参考 [pgsty.com](/zh/case/pgsty-com/) 或
  [Capslock](/zh/case/capslock/)。
- 最完整的参考实现：使用 [OINK Docs](/zh/case/oink/)。
- 如果读者是来查询数据集而不是来阅读的，看看
  [pgext.cloud](/zh/case/pgext-cloud/) 为什么不是 Hugo 站点。

主题仓库的 `tests/site/` 是内部 CI 夹具，而不是起步模板；其中页面的职责是
触发渲染行为。上面的生产案例更适合作为架构与设计参考。

→ [浏览全部案例](/zh/case/) · [十分钟上手](/zh/docs/start/) · [仓库导览](/zh/docs/start/anatomy/)
