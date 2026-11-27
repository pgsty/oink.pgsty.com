---
title: Keyboard navigation
linkTitle: Keyboard navigation
description: Use single-key shortcuts and understand when typing disables them. Disable shortcuts for the site or individual pages.
weight: 80
search_keywords: [keyboard navigation, shortcuts, shortcut help, WASD, zen mode, browsing history, page width, expand all, Gemini, keyboard_nav, accessibility, skip link]
aliases:
  - /docs/advanced/keyboard/
---

Your readers can work through your documentation without reaching for the
mouse: every interactive OINK page answers thirty single-key shortcuts, ten for
moving around, ten for acting on the page and ten for changing the view.
Press {{< kbd "'" >}} on any page to see all thirty; keys the current page
cannot use are dimmed. Shortcuts are on by default, step aside whenever the
reader is typing, and can be [turned off](#disable) for a site or a page.

## Navigation {#navigation}

| Key | Action |
| --- | --- |
| {{< kbd "W" >}} {{< kbd "S" >}} | Move to the previous / next entry of the sidebar tree |
| {{< kbd "A" >}} {{< kbd "D" >}} | Collapse / expand the section |
| {{< kbd "Enter" >}} {{< kbd "Space" >}} | Open the focused tree entry |
| {{< kbd "Q" >}} {{< kbd "E" >}} | Previous / next page in sidebar order |
| {{< kbd "K" >}} {{< kbd "J" >}} | Previous / next heading of the page outline |
| {{< kbd "X" >}} | Switch to the next language |
| {{< kbd "R" >}} | Switch to the next top-level section |
| {{< kbd "V" >}} | Switch to the next version |
| {{< kbd "H" >}} | Open the browsing history |
| {{< kbd "G" >}} | Go to the home page |

### Sidebar tree {#sidebar}

The tree keys work on every page with a sidebar tree, and you do not have to
enter the tree first: with focus in the article, {{< kbd "S" >}} moves from the
current page's entry to the next one in a single press. The focused row is
tinted one step darker than the current-page row, so "where I am" and "where
the cursor is" stay distinguishable. When the sidebar sits in the phone drawer
or is collapsed on desktop, the first press opens it.

Once focus is in the tree, {{< kbd "↑" >}} {{< kbd "↓" >}} {{< kbd "←" >}}
{{< kbd "→" >}} work like the letters; in the article the arrows keep native
scrolling. In a right-to-left language {{< kbd "←" >}} and {{< kbd "→" >}}
follow the reading direction, while {{< kbd "A" >}} always collapses and
{{< kbd "D" >}} always expands.

From a page entry, {{< kbd "A" >}} first moves to the parent section and a
second press collapses it. {{< kbd "D" >}} opens a collapsed section, or steps
into its first visible child when it is already open. Sections without a page
of their own take focus through their disclosure button, which
{{< kbd "Enter" >}} or {{< kbd "Space" >}} toggles. {{< kbd "Esc" >}} leaves the
tree and returns focus to where it was.

### Reading {#reading}

{{< kbd "K" >}} and {{< kbd "J" >}} visit the same targets as the right-hand
outline and land where an outline click would. Every jump takes 100 ms however
far it goes, and you can press again before it finishes. Deep inside a section,
{{< kbd "K" >}} first returns to that section's start. A page without headings
scrolls a short step instead. On the home page the two keys move between the
landing sections.

{{< kbd "Q" >}} and {{< kbd "E" >}} follow the order the sidebar shows, not
dates, and skip collapsed branches, so paging and tree focus always agree. A
section's index page is an entry of its own: at a blog boundary the order runs
from the last post of one section to the next section's index, then to its
first post. Without a sidebar tree, paging uses the page-end pager, then the
`rel="prev"` and `rel="next"` links in `<head>`.

### Language, section and version {#switching}

These keys work on every interactive page and do nothing when there is no
other choice:

- {{< kbd "X" >}} switches to the next language, wrapping after the last one.
  It opens this page's translation, or that language's home page when the page
  has none.
- {{< kbd "R" >}} cycles through the same-origin top-level navbar entries. It
  skips external links and the navbar's utility controls.
- {{< kbd "V" >}} opens the next version listed in `params.versions` that has a
  URL, wrapping after the last one.

### Browsing history {#history}

{{< kbd "H" >}} opens a search-style list of the pages you have read on this
site, newest first. The page you are on is left out, so {{< kbd "H" >}} then
{{< kbd "Enter" >}} takes you back to the previous page.

| Key | In the history list |
| --- | --- |
| Typing | Filter by title and path; every word must match |
| {{< kbd "↑" >}} {{< kbd "↓" >}} | Select an entry |
| {{< kbd "Enter" >}} | Open it; {{< kbd "Ctrl" "Enter" >}} ({{< kbd "⌘" "Enter" >}} on macOS) opens it in a new tab |
| {{< kbd "Shift" "Delete" >}} | Remove the selected entry |
| {{< kbd "Esc" >}} | Close the list |

The **Clear history** button empties the list. The command palette also offers
a **Browsing history** command that opens the same list.

History keeps the last 100 pages in this browser's `localStorage`, under a key
named after the site's base path, such as `td-history:/`. Every language of the
site shares one list, and two sites on the same domain keep separate ones. OINK
never sends it anywhere. It is recorded only on pages where keyboard navigation
is on, and there is no separate switch for it.

{{< kbd "G" >}} opens the home page of the current language. On the home page
itself it scrolls back to the top.

## Actions {#actions}

| Key | Action |
| --- | --- |
| {{< kbd "/" >}} {{< kbd "F" >}} | Search |
| {{< kbd "C" >}} {{< kbd "`" >}} | Open the command palette with commands only |
| {{< kbd "U" >}} | Edit this page |
| {{< kbd "N" >}} | Create a child page |
| {{< kbd "I" >}} | Create a docs issue |
| {{< kbd "O" >}} | Expand or collapse everything that folds |
| {{< kbd "P" >}} | Print this page |
| {{< kbd "[" >}} | Open in ChatGPT |
| {{< kbd "]" >}} | Open in Claude |
| {{< kbd `\` >}} | Open in Gemini |

### Search and commands {#search}

{{< kbd "/" >}} opens the [command palette](/docs/customize/panel/) ready to
search, and {{< kbd "`" >}} (also {{< kbd "~" >}}) opens it with commands only.
Both keys belong to the palette, so they keep working when keyboard
navigation is off; {{< kbd "F" >}} and {{< kbd "C" >}} are the keyboard
navigation equivalents. {{< kbd "⌘" "K" >}} on macOS and {{< kbd "Ctrl" "K" >}}
elsewhere open the palette from anywhere, even a text field, and close it
again. On layouts where {{< kbd "`" >}} is hard to reach, press {{< kbd "C" >}}
or type `>` at the start of the search box.

The palette needs local search (`params.offline_search: true`); without it
these four keys do nothing.

### Page actions {#page-actions}

{{< kbd "U" >}}, {{< kbd "N" >}} and {{< kbd "I" >}} run the same actions as the
page menu beside the title and open their target in a new tab. All three need
a [repository](/docs/customize/repository/) configured for the site;
{{< kbd "U" >}} and {{< kbd "N" >}} also need a page with a source file, so
they do nothing on generated pages such as tag lists. {{< kbd "P" >}} prints
the page, exactly like the browser's print command.

{{< kbd "[" >}}, {{< kbd "]" >}} and {{< kbd `\` >}} hand the page to an AI
assistant in a new tab. They work only when the site enables
`params.ui.page_context_menu.assistant_links`. Gemini cannot receive a prompt
through its address, so OINK copies the prompt to the clipboard as it opens
Gemini: paste it into the message box.

### Expand or collapse all {#expand-all}

{{< kbd "O" >}} opens everything on the page that folds: the sidebar sections,
the right-rail groups (outline, backlinks, term clouds), collapsible callouts,
file trees, "show more" lists and long code blocks. When everything is already
open, it folds all of them instead, except the sidebar branch of the current
page, so you never lose your place. The line you are reading stays where it is
while the page above it grows or shrinks.

Menus and popovers such as navbar dropdowns are not folded content and stay
closed. Collapsed rails stay collapsed; restore them with their own buttons.

## View {#view}

| Key | Action |
| --- | --- |
| {{< kbd "B" >}} | Open or close the Duo View |
| {{< kbd "Z" >}} | Turn Zen Mode on or off |
| {{< kbd "M" >}} | View the page's Markdown source |
| {{< kbd "T" >}} | Switch to the next visual style |
| {{< kbd "Y" >}} | Switch color mode: light, dark, system |
| {{< kbd "L" >}} | Switch the index layout: list, cards, table, gallery |
| {{< kbd ";" >}} | Switch the gallery layout: wall, cards, seamless |
| {{< kbd "," >}} {{< kbd "." >}} | Smaller / larger gallery images |
| {{< kbd "-" >}} {{< kbd "=" >}} | Narrower / wider reading column |
| {{< kbd "'" >}} | Open or close the shortcut help |

### Zen Mode and Duo View {#zen}

{{< kbd "Z" >}} hides the navigation shell so only the text remains: the
navbar and footer on the home page, and also both rails and the floating
buttons on documentation pages. The choice lasts for the browser tab and is
restored before the first frame, so paging with {{< kbd "Q" >}}
{{< kbd "E" >}} keeps it without a flicker. At phone width the top bar stays,
because it is the only way back to the navigation. While the shell is hidden,
the tree keys do nothing.

{{< kbd "B" >}} opens the [Duo View](/docs/customize/i18n/#bilingual-view) when
the site sets `params.ui.compare: true` and the page has a translation, and
closes it again from either pane.

{{< kbd "M" >}} opens the page's Markdown output in a new tab on sites that
publish it.

### Appearance {#appearance}

{{< kbd "T" >}} steps through the visual styles the site offers in
`params.ui.preset_menu` and wraps after the last one; it does nothing when the
site offers a single style. {{< kbd "Y" >}} steps through light, dark and
system color modes and does nothing when the color-mode menu is off. Both work
on every interactive page and remember the choice like the Appearance menu does.

### Index and gallery layouts {#layouts}

On blog, release and case index pages with `params.ui.blog_index_toggle`,
{{< kbd "L" >}} cycles the index through list, cards, table and gallery. On an
[Expo album](/docs/write/expo/#shortcuts), and on an index while its
[gallery view](/docs/write/blog/#list-gallery) is showing, three more keys
control the grid:

| Key | Gallery action |
| --- | --- |
| {{< kbd ";" >}} | Cycle the layout: wall, cards, seamless |
| {{< kbd "," >}} or {{< kbd "<" >}} | Shrink the target image size by 20 px, down to 160 px |
| {{< kbd "." >}} or {{< kbd ">" >}} | Enlarge the target image size by 20 px, up to 360 px |

The toolbar follows each change, the grid reflows at once, and the choice is
remembered: `td-expo-mode` and `td-expo-size` for Expo albums,
`td-blog-gallery-mode` and `td-blog-gallery-size` for index galleries. Clicking
a layout icon or dragging the size slider does not stop these keys.

### Page width {#page-width}

On wide screens the reading column keeps its page width even when the window
has room to spare. {{< kbd "-" >}} and {{< kbd "=" >}} (or {{< kbd "+" >}})
narrow and widen it by 100 px at a time on documentation, book, blog and Expo
pages:

- The column never gets narrower than 600 px and never wider than the space
  between the rails. Widening until it touches the rails makes it fill that
  space on any screen size.
- The width applies to every page of the site in this browser and is restored
  before the first frame. It replaces each page's `page_width` and the Book
  content measure. Printing ignores it.
- A step that reaches the page's own width stops there and forgets the stored
  width (`td-shell-article-w` in `localStorage`), so stepping back always
  returns every page to the width its author chose.

### Expo viewer {#expo-viewer}

An Expo image opens in a viewer with its own keys for moving, zooming and
changing images, listed in the [Expo guide](/docs/write/expo/#shortcuts). Page
shortcuts pause while the viewer is open and resume when it closes. The viewer
keys work even when `keyboard_nav` is off.

## Shortcut help {#help}

{{< kbd "'" >}} opens all thirty shortcuts in a centered dialog: navigation,
actions and view side by side, ten rows each. Rows the current page cannot run
stay in place but are dimmed, and screen readers hear them as unavailable, so
the grid keeps the same shape everywhere. The dialog opens from anywhere: in
the middle of a long page, in Zen Mode, or on pages without a footer
(`footer_style: none`). {{< kbd "'" >}}, {{< kbd "Esc" >}}, the close button or
a click outside the dialog closes it.

The question-mark button at the end of the footer's bottom bar offers the same
dialog. Hovering or focusing it shows a short hint with the keys readers reach
for first; clicking it opens the full dialog, and closing the dialog returns
focus to the button.

With keyboard navigation off and local search on, the button keeps only the
two palette keys, {{< kbd "/" >}} and {{< kbd "`" >}}, and opens no dialog.

## Keys left free {#reserved}

{{< kbd "?" >}} and the digits are deliberately unbound, and every letter key
pressed with a modifier keeps its browser or system meaning. Only
{{< kbd "<" >}}, {{< kbd ">" >}}, {{< kbd "+" >}} and {{< kbd "~" >}} accept
{{< kbd "Shift" >}}, because standard keyboards need it to type them.

## When shortcuts stand down {#stand-down}

Every binding is a single key, so each one steps aside when it could collide
with typing or an overlay:

- Focus is in a text field: `<textarea>`, `<select>`, `contenteditable`, or an
  `<input>` you type into, such as text, search, email, password or number.
  Non-text controls such as gallery layout radio buttons and the size slider
  keep the page shortcuts and their own arrow keys.
- An input method is composing, which matters on every Chinese, Japanese or
  Korean site.
- A modifier key is held. {{< kbd "⌘" "C" >}} still copies,
  {{< kbd "Shift" "M" >}} does nothing, and {{< kbd "Shift" "↓" >}} stays a
  browser action.
- The command palette, the browsing history, the shortcut help, the Expo
  viewer, another open dialog or a visible ARIA dialog owns the keyboard.
  Hidden ARIA dialogs do not block shortcuts.

Comments load in an iframe, so their keystrokes never reach the page.

## Focus order and accessibility {#a11y}

- **Skip link**: the first {{< kbd "Tab" >}} on a page reveals "Skip to main
  content", which passes the navbar and sidebar in one step and marks the
  article title.
- **Real focus**: tree navigation moves the actual DOM focus, so a screen reader
  announces the link name and its "current page" state, {{< kbd "Enter" >}}
  keeps the link's native behavior, and the Tab order is unchanged.
- **Hidden content**: a collapsed sidebar or closed drawer leaves the Tab order,
  while the button that restores it stays reachable. Clicking the article, a
  table or a code block does not leave a large outline behind for the next key.
- **High contrast**: under `forced-colors` the focused row and the selected
  history entry are outlined in the system highlight color.
- **Reduced motion**: with `prefers-reduced-motion`, heading jumps and paging
  land instantly.
- The keycaps in the shortcut help are the same as the
  [Kbd](/docs/components/kbd/) component you write in pages.

## Turning it off {#disable}

Site-wide:

```yaml {title="hugo.yml"}
params:
  ui:
    keyboard_nav: false
```

For one page, such as an interaction-heavy demonstration, or for a whole
section through `cascade`:

```yaml {title="content/docs/playground.md"}
---
title: Interactive playground
keyboard_nav: false
---
```

The key takes a boolean only; see [Configuration](/docs/customize/config/) for
the complete definition. A page with keyboard navigation off ships no keyboard
runtime at all: no shortcuts, no browsing history recording and no restored
page width. {{< kbd "/" >}}, {{< kbd "`" >}} and {{< kbd "⌘" "K" >}} belong to
search and keep working, and the footer's collapse arrow is unaffected.

## Verify {#verify}

Build your site, then replace `public/docs/getting-started/index.html` below
with a documentation page your site actually generates, including any language
prefix.

1. Confirm that the help button is in the page:

   ```bash
   hugo --printPathWarnings
   PAGE=public/docs/getting-started/index.html
   test -f "$PAGE" && grep -c 'td-shell-keyboard__trigger' "$PAGE"
   ```

   With keyboard navigation off and no local search, the button is not
   generated.

2. Open a documentation page and press {{< kbd "'" >}}: three columns of ten
   appear, with dimmed rows for features this page lacks. Press it again to
   close the dialog.
3. With focus in the article, press {{< kbd "S" >}} a few times. The sidebar
   focus moves down from the current page and the article stays still. Then
   press {{< kbd "E" >}} and check that pages follow the sidebar order.
4. Read two pages, then press {{< kbd "H" >}} and {{< kbd "Enter" >}}: you are
   back on the first one.
5. Press {{< kbd "O" >}} twice. Every sidebar section opens, then everything
   folds again except the branch of the current page.
6. On a wide window, press {{< kbd "=" >}} and {{< kbd "-" >}}. The column
   widens and narrows, and keeps its width after a reload.
7. Click in the search box and press {{< kbd "J" >}}. The letter is typed and
   the page does not scroll. Repeat with an input method.

## Related {#related}

- [Command palette](/docs/customize/panel/): the dialog behind {{< kbd "/" >}}, {{< kbd "F" >}}, {{< kbd "C" >}} and {{< kbd "`" >}}
- [Search](/docs/customize/search/): where the palette's page results come from
- [Layouts and page types](/docs/customize/layout/): which pages have a sidebar and an outline, and so which keys apply
- [Kbd](/docs/components/kbd/): writing keycaps in your own pages
- [Configuration](/docs/customize/config/): the complete definition of `ui.keyboard_nav`
