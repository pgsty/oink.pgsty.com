---
title: Keyboard navigation
weight: 5
description: Browse the docs with WASD, hjkl-style keys, and single-key toggles.
---

OINK ships single-key keyboard navigation on docs, blog, and Swagger pages. It
is on by default, every binding yields to anything you are typing into, and a
site or a single page can switch it off. The design treats the current page as
the implicit sidebar cursor, reuses the rendered table of contents for section
jumps, and delegates every action to an existing theme mechanism rather than
building a parallel navigation state.

## Shortcuts {#shortcuts}

### Sidebar {#sidebar}

`w`, `s`, `a`, and `d` steer the sidebar in one step: the current page's item is
the implicit starting point, so the first press already moves or folds from
there. The focused row is tinted a step stronger than the current-page pill, so
"where I am" and "where the cursor is" stay distinguishable. On narrow screens
where the sidebar lives in a drawer, the first press opens the drawer. If the
desktop sidebar was collapsed, the same press restores it and still performs the
requested one-step move or fold.

| Key                     | Action                                                    |
| ----------------------- | --------------------------------------------------------- |
| `w` / `↑`               | Move focus to the previous visible item                   |
| `s` / `↓`               | Move focus to the next visible item                       |
| `a` / `←`               | Collapse the focused group; on a leaf, jump to its parent |
| `d` / `→`               | Expand the focused group; when expanded, step into it     |
| `Enter` / `Space` / `g` | Open the focused page                                     |
| `Escape`                | Return focus to the content                               |

Arrow keys act on the tree only while focus is inside it — outside the sidebar
they keep their native scrolling behavior. In right-to-left languages `←`/`→`
swap to match the reading direction.

### Reading {#reading}

| Key       | Action                                                  |
| --------- | ------------------------------------------------------- |
| `j` / `k` | Jump to the next / previous section of the page outline |
| `q` / `e` | Go to the previous / next page in sidebar order         |
| `h`       | Hide or restore all navigation chrome (focus mode)      |

`j` and `k` follow the same outline as the right-hand table of contents and
glide with an eased animation; deep inside a section, `k` first returns to the
section's own start, and pages without headings fall back to smooth scrolling.
The `h` reading mode hides the navbar, both rails, floating controls, and the
footer. It is restored before the first painted frame for the rest of the tab's
session, so flipping pages with `q`/`e` keeps it without a flash. WASD stays
inert while the sidebar is deliberately hidden.

### Appearance and language {#appearance-and-language}

| Key | Action                                |
| --- | ------------------------------------- |
| `l` | Cycle through the available languages |
| `t` | Toggle between light and dark mode    |

### Search and commands {#search-and-commands}

| Key              | Action                                       |
| ---------------- | -------------------------------------------- |
| `f` or `/`       | Open the Command Palette in full search mode |
| `c` or `\`       | Open the Command Palette with commands only  |
| `Cmd`/`Ctrl`+`K` | Open the Command Palette                     |

Inside the palette, prefixing a query with `>` also restricts it to commands.
Command listings mirror the navbar control order — version, language, theme,
then GitHub — with your configured commands after the built-ins. The `?` key is
reserved for a future shortcut help overlay.

## Footer collapse {#footer-collapse}

Independent of the keyboard: when the fat footer is on, a small arrow at the
right edge of the copyright line collapses or restores the link grid above it.
The choice is remembered in the browser and defaults to expanded. The `h`
reading mode is broader — it hides the whole footer along with both rails.

## When shortcuts stand down {#when-shortcuts-stand-down}

All bindings are plain single characters, so they are disabled whenever they
could collide with typing or an open surface:

- focus is in an input, textarea, select, or `contenteditable` region;
- an IME is composing (for example while typing Chinese);
- a modifier key is held — `Cmd`+`C` still copies your selection and
  `Shift`+arrow retains the browser's selection behavior;
- the Command Palette or another dialog is open.

Scrolling and section jumps respect `prefers-reduced-motion` by stepping
instantly instead of animating.

## Turning it off {#turning-it-off}

`keyboard_nav.enable` defaults to `true`. Disable it site-wide:

```yaml {filename="hugo.yaml"}
params:
  ui:
    keyboard_nav:
      enable: false
```

Or per page (and per section, through a front-matter cascade):

```yaml
---
title: Interactive playground
ui:
  keyboard_nav:
    enable: false
---
```

A non-boolean value fails the build. When disabled, the runtime is left out of
the JavaScript bundle entirely; the `/`, `\`, and `Cmd`/`Ctrl`+`K` palette
shortcuts belong to search and keep working, and the footer arrow keeps working
too.
