---
title: 流程、时间线与循环
linkTitle: 流程与时间线
description: 根据顺序关系选择横向、时间线或循环模板。
weight: 10
icon: fa-solid fa-arrows-spin
---

不同序列模板回答不同问题。横向流程强调有序交接，时间线强调先后顺序，循环则强调末尾阶段会再次回到起点。相邻正文必须说明真正重要的是哪一种关系。

## 横向流程 {#horizontal-process}

简短的从左到右流程可以使用
`list-row-simple-horizontal-arrow`。请缩短标签，并在窄屏下确认渲染顺序仍然清晰。

```go-html-template
{{</* infographic */>}}
infographic list-row-simple-horizontal-arrow
data
  title 文档交付
  items
    - label 规划
      desc 明确读者与预期结果
    - label 撰写
      desc 完成最小而完整的页面
    - label 评审
      desc 核对事实、语言与链接
    - label 交付
      desc 构建并验证线上路由
{{</* /infographic */>}}
```

该流程从规划进入撰写和评审，最后得到经过单独验证的线上结果。

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-row-simple-horizontal-arrow
data
  title 文档交付
  items
    - label 规划
      desc 明确读者与预期结果
    - label 撰写
      desc 完成最小而完整的页面
    - label 评审
      desc 核对事实、语言与链接
    - label 交付
      desc 构建并验证线上路由
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 时间顺序 {#chronological-timeline}

时间或版本先后是主要关系时，使用 `sequence-timeline-simple`。

```go-html-template
{{</* infographic */>}}
infographic sequence-timeline-simple
data
  title 发布证据
  items
    - label 源码就绪
      desc 范围、文案、归属与评审全部完成
    - label 检查通过
      desc 主题与项目站测试套件通过
    - label 标签公开
      desc 不可变模块版本可以解析
    - label 站点部署
      desc 生产路由通过冒烟测试
{{</* /infographic */>}}
```

这条时间线区分四项证据：测试通过不能跳过公开标签与部署阶段。

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic sequence-timeline-simple
data
  title 发布证据
  items
    - label 源码就绪
      desc 范围、文案、归属与评审全部完成
    - label 检查通过
      desc 主题与项目站测试套件通过
    - label 标签公开
      desc 不可变模块版本可以解析
    - label 站点部署
      desc 生产路由通过冒烟测试
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 持续循环 {#continuous-cycle}

只有最后一项确实会把工作送回第一项时，才使用
`sequence-circular-simple`。存在终止状态的流程不应画成循环。

```go-html-template
{{</* infographic height="480px" */>}}
infographic sequence-circular-simple
data
  title 文档维护循环
  items
    - label 观察
      desc 收集支持请求与搜索信号
    - label 排序
      desc 选择要解决的读者问题
    - label 改进
      desc 更新内容与示例
    - label 验证
      desc 检查链接、渲染与结果
{{</* /infographic */>}}
```

验证会产生新的观察结果，因此维护循环会再次回到第一阶段。

<!-- prettier-ignore-start -->

{{< infographic height="480px" >}}
infographic sequence-circular-simple
data
  title 文档维护循环
  items
    - label 观察
      desc 收集支持请求与搜索信号
    - label 排序
      desc 选择要解决的读者问题
    - label 改进
      desc 更新内容与示例
    - label 验证
      desc 检查链接、渲染与结果
{{< /infographic >}}

<!-- prettier-ignore-end -->

## 选择原则 {#selection-rule}

如果去掉箭头或时间轴也不会改变含义，请改用原生列表或卡片。信息图应该揭示关系，而不是装饰一组彼此无关的陈述。
