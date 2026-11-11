---
title: 依赖注释回归
type: docs
comments: false
reading_width: full
outputs: [HTML, print, markdown, RSS]
---

## 独立注释 {#notes}

````markmap
# First map
- Rich notes

  A paragraph with [a local link](/docs/start/), `inline code` and $x^2$.

  ```js
  const greeting = "hello <world> & friends";
  ```

  | Key | Value |
  | --- | --- |
  | 中文 | 42 |

  <script>window.markmapUnsafe = true</script>

  [Unsafe](javascript:alert(1))
````

```markmap
# Second map
- Independent notes

  Notes in the second map retain their own focus and appearance.
```
