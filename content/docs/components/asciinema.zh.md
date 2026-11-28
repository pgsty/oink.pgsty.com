---
title: Asciinema
linkTitle: Asciinema
description: 在页面里嵌入 .cast 终端录像，读者可以播放、暂停并从中复制文字，播放器随主题分发。
weight: 450
search_keywords: [Asciinema, 终端录像, cast, asciicast, 录屏, 演示, terminal recording, 播放器, 章节, markers]
---

`asciinema` 在页面里播放一段 `.cast` 终端录像。有些命令行流程看一遍比读一遍更容易明白，例如一次安装、一次迁移、一次耗时很长的构建，这时就用它。与视频不同，录像里的终端输出仍然是文字：读者可以暂停，直接从播放器里复制命令；本页那段三分钟的安装录像也只有约 196 KB。图形界面的操作请用截图或[视频](/zh/docs/components/video/)。播放器与样式随主题分发，构建期不下载任何东西，运行时也不连接 CDN。

## 最简例子 {#minimal}

只有 `file` 是必填的：

```markdown {title="源码"}
{{</* asciinema file="images/install.cast" */>}}
```

{{< asciinema file="images/install.cast" >}}

这是 Pigsty 在一台 Debian 机器上的单机安装，终端尺寸 120×36，实录 6 分 42 秒，0.5 秒静默上限使播放约 3 分钟。想在自己的站点上试，把[示例录像](/images/install.cast)下载到 `static/images/install.cast`。`file` 写的是从站点根开始的路径；同样的写法也能找到 `assets/` 下的文件，因为主题会先查找全局资源。页面包里的文件找不到。不写 `title` 时，窗口标题显示 `file` 的值。

## 窗口标题与主题 {#title-theme}

`title` 设置窗口标题，`theme` 设置终端配色：

```markdown {title="源码"}
{{</* asciinema file="images/install.cast" title="Pigsty 单机安装" theme="dracula" */>}}
```

{{< asciinema file="images/install.cast" title="Pigsty 单机安装" theme="dracula" >}}

默认的 `theme="auto"` 跟随站点：浅色模式用 `td-light`，深色模式用 `td-dark`，读者切换配色时播放器就地重绘。其它取值会在两种模式下固定同一套配色，可选播放器自带的 `asciinema`、`dracula`、`gruvbox-dark`、`monokai`、`nord`、`seti`、`solarized-dark`、`solarized-light`、`tango`，以及主题提供的 `td-light`、`td-dark`。`solarized-light` 这样的浅色配色放在深色页面上很突兀，所以除非录像需要自己的配色，否则用 `auto`。终端字体始终是站点的代码字体。

## 速度、起点与封面 {#playback}

录像较长时，`speed` 设倍速，`startAt` 跳过开头，`poster` 决定读者按下播放前定格的画面：

```markdown {title="源码"}
{{</* asciinema file="images/install.cast" title="从第 60 秒开始，两倍速"
  speed="2" startAt="60" poster="npt:1:30" */>}}
```

{{< asciinema file="images/install.cast" title="从第 60 秒开始，两倍速" speed="2" startAt="60" poster="npt:1:30" >}}

`speed` 与 `startAt` 是数字，`startAt` 以秒计。`poster` 用播放器的 `npt:` 记法表示时间点，`npt:1:30` 就是第 1 分 30 秒：上面的播放器定格在这一帧，点播放后从第 60 秒开始。

`idleTimeLimit` 把每段静默压缩到最多 N 秒。这段录像不需要它，因为 `.cast` 文件头里已经写了 `idle_time_limit: 0.5`；录制时没有限制静默时长的文件才用得上。

## 章节标记 {#markers}

`markers` 在进度条上标出带名字的章节，读者可以直接跳到长录像里自己要看的那一段。每个章节写成 `时间:标签`，时间以秒计，章节之间用逗号分隔：

```markdown {title="源码"}
{{</* asciinema file="images/install.cast" title="分章节的 Pigsty 安装" preload="true"
  markers="5:下载, 26:执行部署剧本, 56:基础设施, 118:PostgreSQL, 169:汇总" */>}}
```

{{< asciinema file="images/install.cast" title="分章节的 Pigsty 安装" preload="true" markers="5:下载, 26:执行部署剧本, 56:基础设施, 118:PostgreSQL, 169:汇总" >}}

鼠标悬停在标记上可以看到标签；播放器获得焦点时，`[` 与 `]` 跳到上一个、下一个章节。标记要等录像加载后才出现，所以希望读者按下播放前就看到它们时，给 `markers` 配上 `preload="true"`。`pauseOnMarkers="true"` 会在每个章节处暂停，适合让读者一步步看完的演示。

时间按播放器的时钟计算，也就是静默段已经按静默上限（`idleTimeLimit`，或 `.cast` 文件头里的值）压缩之后的时间，所以要从播放器的计时器上读，而不是从 `.cast` 文件里读。标签里可以有冒号，不能有逗号；只写时间的章节没有标签。

## 尺寸与适配 {#size}

播放器从 `.cast` 文件头读取终端行列数，并按栏宽缩放（`fit="width"`）。`cols` 与 `rows` 可以覆盖文件头：

```markdown {title="源码"}
{{</* asciinema file="images/install.cast" title="只留 16 行高" rows="16" */>}}
```

{{< asciinema file="images/install.cast" title="只留 16 行高" rows="16" >}}

比录像本身小的尺寸会裁掉内容：上面的播放器只显示 36 行里的 16 行。`cols` 与 `rows` 用来修正文件头里写错的尺寸，不是用来缩小播放器的；想要更矮的播放器，就在更小的终端里重录一遍。

`fit` 决定终端怎样缩放：`width`（默认）适配栏宽，`height` 适配容器高度，`both` 两个方向都适配，`none` 保持字体原始大小，宽终端会超出栏宽。

## 循环与预加载 {#autoplay}

`loop` 播完从头再来。`preload` 在播放器出现时就取回录像，读者按下播放后不必等待：

```markdown {title="源码"}
{{</* asciinema file="images/install.cast" title="循环播放：登录后的第一分钟"
  startAt="0" speed="3" loop="true" preload="true" */>}}
```

{{< asciinema file="images/install.cast" title="循环播放：登录后的第一分钟" startAt="0" speed="3" loop="true" preload="true" >}}

`autoplay="true"` 不用点击就开始播放。尽量不要用：读者系统里的「减少动态效果」设置只会关掉播放器控件的动画，挡不住自动播放，等于把一个滚动的终端强加给所有人。确实需要时，内容要非常短，配上 `loop`，并且一页只放一个。

## 放进步骤里 {#in-steps}

录像最适合放在它所演示的那一步旁边：文字说明要做什么，录像展示实际发生了什么。

````markdown {title="源码"}
1. 安装依赖，获取安装脚本：

   ```sh
   curl -fsSL https://repo.pigsty.io/get | bash
   ```

2. 执行安装，录像以四倍速播放安装过程：

   {{</* asciinema file="images/install.cast" title="pig install" speed="4" */>}}

3. 打开 `http://<节点地址>:3000`，用 `admin / pigsty` 登录 Grafana。
{.steps}
````

1. 安装依赖，获取安装脚本：

   ```sh
   curl -fsSL https://repo.pigsty.io/get | bash
   ```

2. 执行安装，录像以四倍速播放安装过程：

   {{< asciinema file="images/install.cast" title="pig install" speed="4" >}}

3. 打开 `http://<节点地址>:3000`，用 `admin / pigsty` 登录 Grafana。
{.steps}

一页可以放任意多个播放器，脚本与样式只加载一次。

## 录制 cast 文件 {#recording}

用 [asciinema](https://docs.asciinema.org/) 录制，例如 `asciinema rec --idle-time-limit=2 --cols=100 --rows=28 install.cast`，提交前用 `asciinema play install.cast` 在本地回放检查。

- 终端宽度控制在 100 列以内，手机上也看得清；开始录制前先执行 `clear`。
- 录制前清理密钥。`.cast` 是纯文本，录下的每个字符都能用 `grep` 找到，提交前通读一遍。
- 把文件提交到自己的站点，例如放在 `static/images/install.cast`，用 `file="images/install.cast"` 引用，不要指向别的网站上的 `.cast`：对方一挪文件，录像就失效了。

## 输出形态 {#outputs}

打印、RSS 和页面的 Markdown 输出里没有播放器，录像显示为一个带标题的链接。打印读者、订阅阅读器和读取 `llms.txt` 的工具拿到的只有这个链接和你写的文字，所以关键命令与关键输出要在录像旁边用文字或代码块写一遍。

## 参数参考 {#reference}

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `file` | 路径（必填） | — | 具名参数或第一个位置参数。先在 `assets/` 中按全局资源查找，再当作从站点根开始的路径；`http` 或 `https` 地址原样使用 |
| `title` | 纯文本 | `file` 的值 | 窗口标题 |
| `theme` | 枚举 | `auto` | `auto` 跟随站点深浅色；或 `td-light` `td-dark` `asciinema` `dracula` `gruvbox-dark` `monokai` `nord` `seti` `solarized-dark` `solarized-light` `tango` |
| `fit` | 枚举 | `width` | `width` `height` `both` `none` |
| `cols` / `rows` | 正整数 | 来自 `.cast` 文件头 | 覆盖终端行列数；比录像小会裁掉内容 |
| `speed` | 正数 | `1` | 播放倍速 |
| `startAt` | 数字（秒） | `0` | 起播位置 |
| `idleTimeLimit` | 数字（秒） | 来自 `.cast` 文件头 | 静默段最多播这么久 |
| `poster` | 字符串 | — | 播放前定格的画面，`npt:分:秒` |
| `autoplay` | `"true"` / 不写 | 关 | 不用点击就播放；不建议 |
| `loop` | `"true"` / 不写 | 关 | 播完重播 |
| `preload` | `"true"` / 不写 | 关 | 播放器出现时就取回录像 |
| `pauseOnMarkers` | `"true"` / 不写 | 关 | 播到章节标记处暂停 |
| `markers` | `时间:标签,时间:标签` | — | 进度条上带名字的章节，时间以秒计、按播放器的时钟；见[章节标记](#markers) |
{.fields meta="type default"}

开关类参数只有值为文本 `true` 时才开启，`loop="true"` 与 `loop=true` 都可以，其它值一律表示关闭。其余参数非法时告警并回退：未知的 `fit` 用 `width`，`speed` 不是正数时用 `1`，`startAt` 不是数字时用 `0`，`cols`、`rows`、`idleTimeLimit` 与标记时间不是数字时忽略。`file` 使用其它 scheme、写成协议相对的 `//host` 地址或为空时，告警且不渲染。

## 限制与常见问题 {#limits}

- 播放器需要 JavaScript。浏览器禁用脚本时，窗口外框里是一个指向录像的链接。
- 站内搜索索引的是页面文字，不是录像，只在录像里出现过的命令搜不到。
- 超过五六分钟的录像很少有人看完。长流程拆成几段短录像，每段配上自己的文字。

## 相关 {#related}

- [代码块](/zh/docs/components/code/) — 关键命令与输出写成可复制的代码块
- [步骤](/zh/docs/components/steps/) — 把录像放在它所属的那一步旁边
- [图片](/zh/docs/components/image/) — 静态截图；终端内容用录像，图形界面用截图
- [引用](/zh/docs/components/include/) — 同一段命令要在几页复用时
