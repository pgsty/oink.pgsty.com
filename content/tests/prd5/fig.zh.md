---
title: 编号图片输出
description: 用于 Markdown 降级测试的稳定图片与同页交叉引用。
weight: 20
outputs: [HTML, markdown]
---

降级输出会保留对 {{< xref fig="T-1" anchor="prd5-figure" />}} 的引用。

{{< fig num="T-1" id="prd5-figure" src="/images/feedback.png" alt="OINK 反馈控件" caption="编号图片离开 HTML 后仍保留完整语义。" width="720" height="480" />}}
