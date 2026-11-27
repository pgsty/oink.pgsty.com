---
title: Asciinema
linkTitle: Asciinema
description: Embed a .cast terminal recording that readers can play, pause and copy text from, with the player shipped in the theme.
weight: 210
search_keywords: [Asciinema, terminal recording, cast, asciicast, screencast, demo, player, chapters, markers]
---

`asciinema` plays a `.cast` terminal recording in the page. Use it when a
command-line procedure is easier to follow when watched: an installation, a
migration, a long-running build. Unlike a video, the terminal output stays
text, so readers can pause and copy a command out of the player, and the
six-minute installation on this page weighs about 196 KB. For graphical
interfaces, use screenshots or a [video](/docs/components/video/) instead. The
player and its styles ship with the theme, so nothing is downloaded at build
time and no CDN is contacted.

## Shortest form {#minimal}

`file` is the only required parameter:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" */>}}
```

{{< asciinema file="images/install.cast" >}}

This is a single-node Pigsty installation on Debian, recorded in a 120×36
terminal and about 6 minutes 42 seconds long. To try it on your own site,
download the [sample recording](/images/install.cast) to
`static/images/install.cast`. `file` is a path from the site root, and the
same value also finds a file under `assets/`, because the theme looks for a
global resource first. Page-bundle files are not found. Without `title`, the
window title shows the value of `file`.

## Window title and theme {#title-theme}

`title` names the window and `theme` sets the terminal colors:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Pigsty single-node install" theme="dracula" */>}}
```

{{< asciinema file="images/install.cast" title="Pigsty single-node install" theme="dracula" >}}

The default, `theme="auto"`, follows the site: `td-light` in light mode and
`td-dark` in dark mode, and the player redraws in place when the reader
switches. Any other value fixes the palette in both modes: the player's own
`asciinema`, `dracula`, `gruvbox-dark`, `monokai`, `nord`, `seti`,
`solarized-dark`, `solarized-light` and `tango`, or the theme's `td-light` and
`td-dark`. A fixed light palette such as `solarized-light` looks out of place
on a dark page, so prefer `auto` unless the recording needs its own colors. The
terminal font is always the site's code font.

## Speed, start point and poster {#playback}

For a long recording, `speed` sets the playback rate, `startAt` skips the
opening, and `poster` chooses the frame shown before the reader presses play:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="From 60 seconds in, at double speed"
  speed="2" startAt="60" poster="npt:1:30" */>}}
```

{{< asciinema file="images/install.cast" title="From 60 seconds in, at double speed" speed="2" startAt="60" poster="npt:1:30" >}}

`speed` and `startAt` are numbers, `startAt` in seconds. `poster` uses the
player's `npt:` time notation, so `npt:1:30` is the frame at one minute thirty:
the player above shows that frame and starts playing from second 60.

`idleTimeLimit` shortens every silent stretch to at most that many seconds.
This recording needs none, because its `.cast` header already sets
`idle_time_limit: 0.5`; use it for a recording made without an idle limit.

## Chapter markers {#markers}

`markers` puts named chapters on the progress bar, so a reader can jump to the
part of a long recording they came for. Write each chapter as `time:label`,
with the time in seconds, and separate chapters with commas:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Pigsty install in chapters" preload="true"
  markers="5:Download, 26:Deploy playbook, 56:Infrastructure, 118:PostgreSQL, 169:Recap" */>}}
```

{{< asciinema file="images/install.cast" title="Pigsty install in chapters" preload="true" markers="5:Download, 26:Deploy playbook, 56:Infrastructure, 118:PostgreSQL, 169:Recap" >}}

Hover a mark to read its label; with the player focused, `[` and `]` jump to
the previous and next chapter. The marks appear once the recording has
loaded, so pair `markers` with `preload="true"` when they should show before
the reader presses play. `pauseOnMarkers="true"` stops at every chapter, which
suits a walkthrough the reader steps through.

Times count on the player's clock, after the idle limit (`idleTimeLimit`, or
the one in the `.cast` header) has shortened the silences, so take them from
the player's timer rather than from the `.cast` file. A label may contain
colons but not commas, and a chapter written as a bare time has no label.

## Size and fit {#size}

The player takes its terminal size from the `.cast` header and scales to the
width of the column (`fit="width"`). `cols` and `rows` override the header:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Only 16 rows tall" rows="16" */>}}
```

{{< asciinema file="images/install.cast" title="Only 16 rows tall" rows="16" >}}

A size smaller than the recording clips it: the player above shows 16 of the
36 rows. Use `cols` and `rows` to correct a header that has the wrong size, not
to make the player smaller; for a shorter player, record again in a smaller
terminal.

`fit` decides how the terminal scales: `width` (the default) fits the column
width, `height` fits the container's height, `both` fits both, and `none` keeps
the font at its natural size, so a wide terminal overflows the column.

## Looping and preloading {#autoplay}

`loop` starts again at the end. `preload` fetches the recording as soon as the
player appears, so it starts without a pause when the reader presses play:

```markdown {title="Source"}
{{</* asciinema file="images/install.cast" title="Looping: the first minute after login"
  startAt="0" speed="3" loop="true" preload="true" */>}}
```

{{< asciinema file="images/install.cast" title="Looping: the first minute after login" startAt="0" speed="3" loop="true" preload="true" >}}

`autoplay="true"` starts playback without a click. Avoid it: the reader's
"reduce motion" setting only turns off the player's control animations, not
autoplay, so a moving terminal is forced on everyone. If you must autoplay,
keep the clip very short, add `loop`, and use one per page.

## Inside steps {#in-steps}

A recording works best beside the step it shows: the text says what to do,
the recording shows what happens.

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

A page can hold any number of players; the script and styles load once.

## Recording a cast file {#recording}

Record with [asciinema](https://docs.asciinema.org/), for example
`asciinema rec --idle-time-limit=2 --cols=100 --rows=28 install.cast`, and
check the result with `asciinema play install.cast` before you commit it.

- Keep the terminal under 100 columns so the text stays legible on a phone,
  and run `clear` before you start.
- Remove secrets before you record. A `.cast` file is plain text, so every
  character typed or printed can be found with `grep`; read the file before
  committing it.
- Commit the file to your site, for example as `static/images/install.cast`
  with `file="images/install.cast"`, rather than pointing at another site's
  `.cast`. A remote recording breaks when that site moves it.

## Output {#outputs}

Print, RSS and the page's Markdown output have no player: each shows the
recording as a link with its title. Readers of a printed page, feed readers
and tools that read `llms.txt` therefore get only that link and your prose, so
write the key commands and their output beside the recording as text or code.

## Parameter reference {#reference}

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file` | path (required) | — | Named, or the first positional parameter. Looked up as a global resource in `assets/`, then as a path from the site root; an `http` or `https` URL is used as is |
| `title` | plain text | the value of `file` | The window title |
| `theme` | enum | `auto` | `auto` follows the site's color scheme; or `td-light` `td-dark` `asciinema` `dracula` `gruvbox-dark` `monokai` `nord` `seti` `solarized-dark` `solarized-light` `tango` |
| `fit` | enum | `width` | `width` `height` `both` `none` |
| `cols` / `rows` | positive integer | from the `.cast` header | Override the terminal size; smaller than the recording clips it |
| `speed` | positive number | `1` | Playback rate |
| `startAt` | number (seconds) | `0` | Where playback starts |
| `idleTimeLimit` | number (seconds) | from the `.cast` header | Longest a silent stretch plays for |
| `poster` | string | — | The frame shown before playback, `npt:mm:ss` |
| `autoplay` | `"true"` / omitted | off | Play without a click; not recommended |
| `loop` | `"true"` / omitted | off | Replay at the end |
| `preload` | `"true"` / omitted | off | Fetch the recording as soon as the player appears |
| `pauseOnMarkers` | `"true"` / omitted | off | Pause at chapter markers |
| `markers` | `time:label,time:label` | — | Named chapters on the progress bar, times in seconds on the player's clock; see [Chapter markers](#markers) |
{.fields meta="type default"}

The on/off parameters are on only when their value is the text `true`, so
`loop="true"` and `loop=true` both work and anything else means off. Other
invalid values warn and fall back: an unknown `fit` uses `width`, a `speed`
that is not a positive number uses `1`, a non-numeric `startAt` uses `0`, and
non-numeric `cols`, `rows`, `idleTimeLimit` or marker times are ignored. A
`file` with another scheme, a protocol-relative `//host` address, or an empty
value warns and renders nothing.

## Limits {#limits}

- The player needs JavaScript. With scripts off, the window frame holds a
  link to the recording instead.
- Site search indexes page text, not recordings, so a command that appears
  only in a recording cannot be found.
- Few readers finish a recording longer than five or six minutes. Split a long
  procedure into short recordings, each with its own text.

## Related {#related}

- [Code blocks](/docs/components/code/) — the key commands and output, copyable
- [Steps](/docs/components/steps/) — the recording beside the step it belongs to
- [Images](/docs/components/image/) — static screenshots: recordings for terminals, screenshots for graphical interfaces
- [Include](/docs/components/include/) — when the same commands appear on several pages
