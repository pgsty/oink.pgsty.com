---
title: Asciinema
linkTitle: Asciinema
description: Display a .cast terminal recording with selectable text. The theme includes the player and does not use a CDN.
weight: 210
search_keywords: [Asciinema, terminal recording, cast, asciicast, screencast, demo, player]
---

`asciinema` displays a `.cast` recording in a terminal player. Use it for command-line procedures.
Readers can select and copy the terminal text. The six-minute installation recording on this page is about 196 KB.
This component plays only terminal recordings. Use screenshots or video for graphical interfaces.
The theme includes the player and styles. It downloads nothing at build time and contacts no CDN at runtime.
The runtime loads only in HTML output on pages that use the component.

## Shortest form {#minimal}

`file` is the only required parameter:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" */>}}
```

{{< asciinema file="images/install.cast" >}}

The recording shows a single-node Pigsty installation on Debian in a 120×36 terminal. It lasts about 6 minutes and 42 seconds.
Download the [sample recording](/images/install.cast) to `static/images/install.cast` in your site. Write its path from the site root.
For a file under `assets/`, use a relative path. The theme checks resources first, then treats the value as a site-root path.
If you omit `title`, the window title shows the value of `file`.

## Window title and theme {#title-theme}

`title` sets the window title. `theme` sets the colors:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Pigsty single-node install" theme="dracula" */>}}
```

{{< asciinema file="images/install.cast" title="Pigsty single-node install" theme="dracula" >}}

`theme` defaults to `auto` and follows the site's color scheme. It uses `td-light` in light mode and `td-dark` in dark mode.
When the reader changes modes, the player remounts in place. To fix the terminal palette, use a player theme:
`asciinema`, `dracula`, `gruvbox-dark`, `monokai`, `nord`, `seti`, `solarized-dark`, `solarized-light`, or `tango`.
You can also use the theme's `td-light` / `td-dark`. A fixed theme does not follow the site's color scheme.
`solarized-light` does not provide usable contrast on a dark site. The player uses the same code font as the site's code blocks.

## Speed, start point and poster {#playback}

Three parameters control the initial playback state. `speed` sets the rate, `startAt` skips the opening, and `poster` sets the frame before playback.

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="From 60 seconds in, at double speed"
  speed="2" startAt="60" poster="npt:1:30" */>}}
```

{{< asciinema file="images/install.cast" title="From 60 seconds in, at double speed" speed="2" startAt="60" poster="npt:1:30" >}}

`speed` and `startAt` take numbers (seconds). `poster` uses the player's `npt:` time notation.
For example, `npt:1:30` means one minute and thirty seconds. The player above shows the frame at 90 seconds and starts playback at 60 seconds.

`idleTimeLimit` limits silent intervals to N seconds. This recording already limits idle time through `idle_time_limit: 0.5` in its `.cast` header.
It needs no additional limit. Only recordings made without an idle limit need this setting.

## Size and fit {#size}

By default, the player scales to the container width (`fit="width"`). It reads the terminal dimensions from the `.cast` header.
Use `cols` / `rows` to override those dimensions:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Only 16 rows tall" rows="16" */>}}
```

{{< asciinema file="images/install.cast" title="Only 16 rows tall" rows="16" >}}

Dimensions smaller than the recording clip its content. The example above shows 16 of the 36 rows.
Use `cols` / `rows` to correct incorrect header dimensions. Do not use them to control layout.
To make the player shorter, record again in a smaller terminal.

`fit` accepts four values: `width`, the default, scales to width; `height` scales to height; `both` fits both axes.
`none` disables scaling, so a wide terminal overflows.

## Looping and preloading {#autoplay}

`loop` restarts playback at the end. `preload` fetches the `.cast` when the page loads, so playback starts without waiting:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Looping: the first minute after login"
  startAt="0" speed="3" loop="true" preload="true" */>}}
```

{{< asciinema file="images/install.cast" title="Looping: the first minute after login" startAt="0" speed="3" loop="true" preload="true" >}}

`autoplay="true"` starts playback when the page opens. This is not recommended.
The "reduce motion" preference disables only player control transitions. It does not stop autoplay.
If autoplay is necessary, use `loop`, keep the clip very short, and use only one clip per page.

## Inside steps {#in-steps}

Put the recording beside its step. The text gives the action. The recording shows the result.

````markdown {title="Source"}
1. Install the dependencies and fetch the installer:

   ```sh
   curl -fsSL https://repo.pigsty.io/get | bash
   ```

2. Run the install; the recording plays the process at four times speed:

   {{</* asciinema file="images/install.cast" title="pig install" speed="4" */>}}

3. Open `http://<node address>:3000` and sign in to Grafana with `admin / pigsty`.
{.steps}
````

1. Install the dependencies and fetch the installer:

   ```sh
   curl -fsSL https://repo.pigsty.io/get | bash
   ```

2. Run the install; the recording plays the process at four times speed:

   {{< asciinema file="images/install.cast" title="pig install" speed="4" >}}

3. Open `http://<node address>:3000` and sign in to Grafana with `admin / pigsty`.
{.steps}

A page can hold several players, and the script and styles load once.

## Recording a cast file {#recording}

The theme plays recordings but does not create them. Record with [asciinema](https://docs.asciinema.org/).
Use `asciinema rec --idle-time-limit=2 --cols=100 --rows=28 install.cast`, then check locally with `asciinema play install.cast`.

- Keep the terminal under 100 columns so it stays readable on narrow screens. Run `clear` before you start.
- Remove secrets before recording. A `.cast` is plain text, so every recorded character can be searched. Check the file before committing.
- Put the file at `static/images/install.cast` and use `file="images/install.cast"`.
  `assets/images/install.cast` works with the same value. Page-bundle resources are not resolved.
  Commit the recording instead of using a `.cast` URL from another site.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | A `<div class="td-asciinema">` window frame plus the player; the player CSS/JS and the runtime load on demand, once per page, and only in this output |
| Print | A labelled static link showing the recording's address; no player, no runtime |
| Markdown | A plain Markdown link, `[title](/images/install.cast)` — no component markup, no configuration block |
| RSS | The same plain link |

A recording must never be the only source of information. Write the key commands and output beside it as text or code.
Offline readers, consumers of `llms.txt`, and readers of printed pages receive the link and prose. They do not receive the terminal session.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | path (required) | — | Named, or the first positional parameter; looked up as a global resource first, then as a site-root path; a full URL with a scheme is passed through unchanged |
| `title` | plain text | the value of `file` | The window title |
| `theme` | enum | `auto` | `auto` follows the site's colour scheme; or `td-light` `td-dark` `asciinema` `dracula` `gruvbox-dark` `monokai` `nord` `seti` `solarized-dark` `solarized-light` `tango` |
| `fit` | enum | `width` | `width` `height` `both` `none`; anything else warns and uses `width` |
| `cols` / `rows` | integer | from the `.cast` header | Override the terminal size; smaller than the recording clips it |
| `speed` | number | `1` | Playback rate |
| `startAt` | number (seconds) | `0` | Where playback starts |
| `idleTimeLimit` | number (seconds) | from the `.cast` header | Longest a silent stretch plays for |
| `poster` | string | — | The frame shown before playback, `npt:mm:ss` |
| `autoplay` | `"true"` / omitted | off | Play as the page opens; not recommended |
| `loop` | `"true"` / omitted | off | Replay at the end |
| `preload` | `"true"` / omitted | off | Fetch the `.cast` when the page loads |
| `pauseOnMarkers` | `"true"` / omitted | off | Pause at chapter markers |
| `markers` | `time:label,time:label` | — | Chapter markers; see the limits — the labels do not reach the player today |
{.fields meta="type default"}

Boolean-like parameters compare their value with the text `true`. Both `loop="true"` and `loop=true` enable the option. Other values disable it.
Other invalid values warn and use a fallback: invalid `fit` uses `width`, nonnumeric `speed` uses `1`, nonnumeric `startAt` uses `0`,
and nonnumeric `cols`, `rows`, `idleTimeLimit`, and marker times are ignored.

## Limits {#limits}

- `markers` labels are lost. The theme converts the `time:label` list to a one-dimensional array, but the player accepts only pairs.
  The timeline therefore has unlabeled markers. A nonnumeric marker time warns and is skipped. If you need chapters, write a list beside the recording.
- The player needs JavaScript. With browser scripts disabled, only the window frame remains.
  Print, Markdown, and RSS provide a link instead. See [Output](#outputs).
- Recordings are not searchable. The site index covers page text, so it cannot find commands that appear only in recordings.
- Do not use a remote `.cast`. Although `http` and `https` addresses are accepted, they make the page depend on another site.
  Other schemes, protocol-relative `//host` addresses, and empty values warn and render nothing.
- Keep clips short. Few readers finish recordings longer than five or six minutes.
  Split long procedures into short recordings, each with its own text.

## Related {#related}

- [Code blocks](/docs/components/code/) — the key commands and output, copyable
- [Steps](/docs/components/steps/) — the recording beside the step it belongs to
- [Images](/docs/components/image/) — static screenshots: recordings for terminals, screenshots for graphical interfaces
- [Include](/docs/components/include/) — when the same commands appear on several pages
