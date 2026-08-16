---
title: Kbd
description: Write keyboard shortcuts as accessible, static key sequences.
weight: 30
---

Use Kbd to distinguish literal keys and shortcuts from surrounding prose. It
renders semantic HTML, remains readable in Markdown and print, and needs no
JavaScript.

## When to use {#when-to-use}

Use Kbd for keys the reader should press, including multi-key shortcuts. Use
inline code for commands, option names, or text the reader should type; those
are not physical or virtual keys.

## Quick start {#quick-start}

### Source {#source}

```go-html-template
Press {{</* kbd "Ctrl" "K" */>}} to open search.
Use {{</* kbd "⌘" "Shift" "P" */>}} to open the command palette.
```

### Rendered result {#rendered-result}

Press {{< kbd "Ctrl" "K" >}} to open search. Use {{< kbd "⌘" "Shift" "P" >}} to
open the command palette, or press {{< kbd "Alt" "Enter" >}} to apply an action.

## Interface {#interface}

Kbd accepts one or more nonempty positional strings:

```go-html-template
{{</* kbd "key" */>}}
{{</* kbd "first key" "second key" "third key" */>}}
```

It has no named parameters. Quotes are required because every key must be a
string. Missing keys, blank strings, named arguments, or non-string values stop
the build with the source position.

Use the label printed on the relevant platform when the distinction matters. For
cross-platform instructions, name the platform in prose instead of placing
alternatives inside one key sequence.

## Semantics and fallback {#semantics-and-fallback}

Raw `<kbd>Ctrl</kbd>` written in Markdown is styled the same way, which is what
GitHub renders too; the shortcode adds the separators and the accessible
sequence. HTML contains one nested `kbd` element per key. Visual plus signs are
hidden from assistive technology; a localized word separates the keys for screen
readers. Markdown, print, and RSS use an unambiguous sequence such as
`Ctrl + K`. The instruction remains complete when CSS or JavaScript is absent.

## Deliberate limits {#deliberate-limits}

Kbd represents simultaneous key sequences only. It does not model menus, gesture
input, key remapping, platform detection, or an interactive shortcut recorder.
Explain sequential actions in prose: “press Escape, then Enter.”
