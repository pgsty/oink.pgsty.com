---
title: 警告与安全回退
linkTitle: 诊断策略
description: 作者输入无效时，预览阶段发出警告并安全降级；--panicOnWarning 在发布阶段恢复硬门禁。
weight: 10
icon: fa-solid fa-triangle-exclamation
search_keywords: [warnf, errorf, panicOnWarning, 校验, 回退, hugo server]
design_kind: decision
design_status: accepted
decision_date: 2026-08-19
---

> [!IMPORTANT] 决策
> OINK 不调用 Hugo 的 `errorf`。作者或站点输入无效时，主题发出警告，并使用文档中
> 明确的安全回退，或者省略无效片段。版本发布与部署构建使用 `--panicOnWarning`，
> 因此同一条警告在发布门禁中仍会导致硬失败。

## 背景 {#context}

Hugo 把整座站点作为一次事务构建。编辑一页时触发的 `errorf` 会让该次重建中的所有 URL
都返回错误，包括无关页面和首页。服务器进程仍然存在，修正输入后也会自动恢复，但多人共享
的预览在此期间完全不可用。

警告的开发成本不同。出错的值可以回退，站点其余部分仍可检查，作者也能看到准确消息。
发布构建则不会放过它，因为 OINK 的 CI 与集成门禁都会加上 `--panicOnWarning`。

## 决策 {#decision}

校验遵循四条规则：

1. 点明无效键和值、允许的形状以及实际采用的回退值。
2. 值来自页面 front matter 时带上页面位置；站点级错误不要在每一页重复刷屏。
3. 不允许无效值继续参与后续运算。先校验，再用规范化后的值渲染。
4. 没有诚实回退时，警告并且不渲染。不能为了继续构建而编造内容、发起网络请求或输出
   不安全 URL。

枚举、布尔、CSS 长度与数字的共享校验形状位于
`layouts/_partials/validate.html`。领域 resolver 可以增加更窄的规则，但必须保留同一套
警告与回退契约。

## 安全边界 {#safety-boundary}

继续构建不等于继续输出危险内容。被拒绝的 CSS 长度要在进入 `style` 属性之前回退；远程服务
配置不完整时，要在浏览器可能发起请求之前省略组件；不安全的操作 URL 直接丢弃。真正的保护是
坏输出没有出现，而不是 Hugo 被终止。

这也把编辑与发布清晰分开：

| 阶段                         | 无效输入的处理                                       |
| ---------------------------- | ---------------------------------------------------- |
| `hugo server` 或普通本地构建 | 警告、回退或省略，其它页面继续可用                   |
| CI、版本验收、部署           | 同一警告在 `--panicOnWarning` 下让构建以非零状态退出 |

## 后果 {#consequences}

- 每个回退值都是公开契约的一部分，必须与主题声明的默认值一致。
- 从“失败”改成“回退”时，测试也必须改变。负向测试要同时证明普通构建存活、警告文案、
  渲染后的回退，以及严格构建失败。
- 检查器必须直接验证被拒绝的输出。例如 URL 安全测试应断言危险 URL 没有进入产物，不能把
  任意构建失败当作充分证据。
- 参数源码检查器守住主题 layout 中不存在 `errorf` 调用这一不变量。

## 验证 {#verification}

本决策的归属参考包括
[架构契约](/zh/docs/design/architecture/#configuration-and-diagnostics)、
`bin/check-params.py`，以及主题夹具与本站的严格构建。
