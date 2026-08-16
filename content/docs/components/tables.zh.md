---
title: 表格
description:
  在普通 Markdown
  表格下方加一行属性，即可选择表格种类——参考列表、兼容矩阵、带标题、带编号、标签页或全宽。
weight: 45
---

OINK 站点上的每张表格都是普通的 GFM
pipe 表格。主题的表格渲染钩子把它包进可滚动区域，宽表格不会撑宽页面；表格下一行的属性行用来选择表格种类或添加标题。站点自己的 CSS
class 会原样透传。

## 默认表格 {#default-table}

<!-- prettier-ignore-start -->

```markdown
| 列 A | 列 B | 列 C |
| ---- | ---- | ---: |
| a1   | b1   |    1 |
```

<!-- prettier-ignore-end -->

| 列 A | 列 B | 列 C |
| ---- | ---- | ---: |
| a1   | b1   |    1 |
| a2   | b2   |   22 |

对齐方式照旧来自分隔行。表头单元格是
`th scope="col"`，外层容器是可用键盘聚焦的滚动区域。

## 参考列表 `{.fields}` {#fields}

把表格变成定义列表：第一列是名称，最后一列是说明，中间列是元数据。见
[Fields](/zh/docs/components/fields/)。

<!-- prettier-ignore-start -->

| 函数       | 返回值    | 说明                       |
| ---------- | --------- | -------------------------- |
| `now()`    | timestamp | 当前事务时间戳             |
| `random()` | float     | `[0, 1)` 区间内的随机数     |
{.fields}

<!-- prettier-ignore-end -->

## 矩阵 `{.matrix}` {#matrix}

兼容性或特性矩阵：第一列成为行表头（`th scope="row"`），区域滚动时表头行与第一列保持吸附，其余单元格居中（除非分隔行另有指定）。✅ 与 ❌ 由作者自己书写，主题不做任何解析。

<!-- prettier-ignore-start -->

```markdown
| OS / PG      | PG18 | PG17 | PG16 | PG15 |
| ------------ | :--: | :--: | :--: | :--: |
| EL 9         |  ✅  |  ✅  |  ✅  |  ✅  |
| Debian 12    |  ✅  |  ✅  |  ✅  |  ✅  |
| Ubuntu 24.04 |  ✅  |  ✅  |  ✅  |  ❌  |
{.matrix}
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

| OS / PG      | PG18 | PG17 | PG16 | PG15 |
| ------------ | :--: | :--: | :--: | :--: |
| EL 9         |  ✅  |  ✅  |  ✅  |  ✅  |
| Debian 12    |  ✅  |  ✅  |  ✅  |  ✅  |
| Ubuntu 24.04 |  ✅  |  ✅  |  ✅  |  ❌  |
{.matrix}

<!-- prettier-ignore-end -->

## 标题 `{caption="…"}` {#caption}

添加可见的 `caption` 元素，不给表格编号。

<!-- prettier-ignore-start -->

| 条目     | 取值       |
| -------- | ---------- |
| 版本     | 0.5.0      |
| 许可证   | Apache-2.0 |
{caption="发布事实"}

<!-- prettier-ignore-end -->

## 编号表格 `{#id num="…" caption="…"}` {#numbered}

Book 表格：属性行会注册一个带本地化标签的编号目标，供 `xref` 引用。`id` 默认是
`tbl-<num>`。

<!-- prettier-ignore-start -->

```markdown
| 隔离级别                                            | 脏读 | 丢失更新 |
| --------------------------------------------------- | ---- | -------- |
| 读已提交                                            | 否   | 是       |
| 可串行化                                            | 否   | 否       |
{#tab_iso num="9-1" caption="各隔离级别允许的异象"}

参见 {{</* xref tbl="9-1" anchor="tab_iso" */>}}。
```

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->

| 隔离级别   | 脏读 | 丢失更新 |
| ---------- | ---- | -------- |
| 读已提交   | 否   | 是       |
| 可串行化   | 否   | 否       |
{#tab_iso num="9-1" caption="各隔离级别允许的异象"}

<!-- prettier-ignore-end -->

参见 {{< xref tbl="9-1" anchor="tab_iso" />}}；编号媒体契约见
[Book 出版](/zh/docs/scenarios/book/)。

## 标签页表格 `{tab="…"}` {#tabs}

连续带 `tab`
属性的表格会组成一个标签页集，规则与[相邻代码围栏](/zh/docs/components/code-blocks/#tabs)完全一致：第一张表上的
`group` 启用 hash、同步与持久化，分组内的每张表随后都需要 `value`。

<!-- prettier-ignore-start -->

| 参数              | 取值 |
| ----------------- | ---- |
| `max_connections` | 100  |
{tab="PG 17" group="pgver" value="pg17"}

| 参数              | 取值 |
| ----------------- | ---- |
| `max_connections` | 200  |
{tab="PG 16" value="pg16"}

<!-- prettier-ignore-end -->

## 全宽 `{.full-width}` {#full-width}

让宽表格使用整个文章画布，而不是正文栏宽。

<!-- prettier-ignore-start -->

| A   | B   | C   | D   | E   | F   | G   | H   |
| --- | --- | --- | --- | --- | --- | --- | --- |
| a   | b   | c   | d   | e   | f   | g   | h   |
{.full-width}

<!-- prettier-ignore-end -->

## 规则 {#rules}

- `.fields` 不能与 `.matrix`、`.full-width` 或 `num` 组合；`num` 与 `tab` 互斥。
- 标记 class（`fields`、`matrix`、`full-width`）是固定词汇；其他 class 会透传给站点 CSS。
- `data-*` 与 `aria-*` 属性透传；`style`、事件处理器和未知属性会导致构建失败。
- 打印时移除滚动容器；Markdown 输出保留源码表格及其属性行。
