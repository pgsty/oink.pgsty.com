---
title: 依赖迁移回归
type: docs
comments: false
reading_width: full
outputs: [HTML, print, markdown, RSS]
---

## API 阅读器 {#api-readers}

{{< redoc "openapi/docs-demo.yaml" >}}

{{< redoc "/openapi/docs-demo.yaml" >}}

{{< swagger src="/openapi/docs-demo.yaml" >}}

## SVG 导图 {#svg-map}

```markmap
# Escapes & punctuation
- x > y & z "quoted"
- $x^2 + \frac{1}{2}$
- [Theme **source**](https://github.com/pgsty/oink) and [Docs](https://github.com/pgsty/oink.pgsty.com)
- Notes

  A paragraph becomes a note.
```

## 播放器隔离 {#player-isolation}

{{< asciinema file="/images/install.cast" title="Recording fallback" >}}

```echarts
{"xAxis":{"type":"category","data":["A","B"]},"yAxis":{},"series":[{"type":"bar","data":[1,2]}]}
```

```mermaid
---
config:
  layout: elk
  look: neo
  theme: redux-color
---
flowchart LR
  source[ELK] --> result[Local render]
```
