---
title: Maps
linkTitle: Maps
description: List places in a `map` fence to get a numbered place list in HTML, Print and RSS, plus an interactive map once the site names a tile service.
weight: 290
search_keywords: [map, maps, places, markers, route, popup, OpenStreetMap, Leaflet, tiles, coordinates, WGS 84, travel, Beijing]
---

A map fence suits places that belong together in an order: the stops of a
trip, a company's offices, the venues of a conference, the sites of a field
survey. HTML, Print and RSS show a numbered list with names, notes, thumbnails
and OpenStreetMap coordinates. The list works without JavaScript. Markdown and
LLMS keep the original YAML fence.

The interactive map above the list is something your site turns on. Map tiles
are images fetched from a third-party tile service in the reader's browser,
and every service has its own usage policy, quota and attribution terms, so
the theme does not pick one for you: until you set `params.map` with a tile
URL and its attribution, as described in
[Site configuration](#configuration), pages show the list and make no map
requests at all.

For addresses that need no map, a [table](/docs/components/table/) is enough;
a map that is a drawing belongs in an [image](/docs/components/image/).

## Shortest form {#minimal}

Each place needs a `name`, a `lat` and a `lng`.

````markdown {title="Source"}
```map
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
- name: Temple of Heaven
  lat: 39.8822
  lng: 116.4066
- name: Summer Palace
  lat: 39.9901
  lng: 116.2647
```
````

```map
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
- name: Temple of Heaven
  lat: 39.8822
  lng: 116.4066
- name: Summer Palace
  lat: 39.9901
  lng: 116.2647
```

This site has a tile service configured, so a map appears above the list, with
markers numbered like the list and zoomed to fit every place. On a site
without one, the same fence renders only the list. Each coordinate pair links
to the place on openstreetmap.org; that is an ordinary link the reader may
follow, not a request the page makes.

The body is parsed as YAML, and since JSON is valid YAML,
`[{"name": "Forbidden City", "lat": 39.9159, "lng": 116.3908}]` works too.

## Site configuration {#configuration}

Maps are off by default. To turn them on, choose a tile service and add it to
`hugo.yml`. This site uses OpenStreetMap's standard tiles:

```yaml {title="hugo.yml — OpenStreetMap (light use)"}
params:
  map:
    enable: true
    tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    attribution: "© OpenStreetMap contributors"
    attribution_url: https://www.openstreetmap.org/copyright
```

```yaml {title="hugo.yml — commercial service with dark tiles & subdomains"}
params:
  map:
    enable: true
    tiles: https://{s}.tiles.example.com/light/{z}/{x}/{y}{r}.png?apikey=YOUR_DOMAIN_RESTRICTED_KEY
    dark_tiles: https://{s}.tiles.example.com/dark/{z}/{x}/{y}{r}.png?apikey=YOUR_DOMAIN_RESTRICTED_KEY
    subdomains: abcd
    attribution: "© Example Maps, © OpenStreetMap contributors"
    attribution_url: https://www.openstreetmap.org/copyright
    max_zoom: 20
```

```yaml {title="hugo.yml — self-hosted tiles with click-to-load"}
params:
  map:
    enable: true
    tiles: https://tiles.your-domain.example/styles/basic/{z}/{x}/{y}.png
    attribution: "Map data © OpenStreetMap contributors"
    attribution_url: https://www.openstreetmap.org/copyright
    loading: click
```

- `tiles` is an `https://` URL template containing `{z}`, `{x}` and `{y}`
  (`{s}` for subdomains, `{r}` for high-DPI tiles and `{-y}` for TMS row order
  are allowed). Any other placeholder, such as `{apikey}` or `{accessToken}`,
  has no value to fill: write the key into the URL itself, or the template
  warns and is ignored. An optional `dark_tiles`, with the same rules, is used
  in dark mode. Only `{s}` may vary in either host. Put tile coordinates in the path or query.
- `attribution` is the plain-text credit the tile service requires; it appears
  in the corner of every map. Add `attribution_url` (`https://`) to turn the
  credit into a clickable link without accepting author HTML — OpenStreetMap's
  [attribution guidelines](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines)
  require interactive web maps to link to `https://www.openstreetmap.org/copyright`.
- `subdomains` overrides Leaflet's default `abc` when `tiles` uses `{s}` (for
  example `abcd` or `"01234567"`). Quote digits: YAML reads an unquoted
  `01234567` as a number, which warns and falls back to Leaflet's default.
- `max_zoom` is a whole number from 1 to 22 and defaults to 19.
- `loading` is `lazy` (the default: a map loads once it is on screen, within
  320px below the viewport, or anywhere above the reading position) or `click`
  (show a button naming every tile host the map may contact, `dark_tiles`
  included and `{s}` written as `*`, and send no tile requests until clicked;
  if the button still holds focus, it moves to the map on success or the first coordinate link on failure).
- `enable: true` without a valid `tiles` and an `attribution` warns and leaves
  maps off, so a half-finished configuration never sends readers to a service
  you have not agreed to. Fences keep rendering their lists.
- Surrounding whitespace in `tiles`, `dark_tiles`, `attribution_url` and
  `subdomains` is trimmed. An unknown key warns and is ignored, including a
  camel-case spelling such as `maxZoom`, which Hugo lowercases; write
  `max_zoom`.

Pick a service that fits your traffic. The OpenStreetMap Foundation's
[tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
allows light use of its standard tiles with linked attribution; a busy site
should use a commercial tile service with a domain-restricted key, or
host its own tiles. A key in the tile URL is visible to every reader, which is
why the restriction to your domain matters.

Each tile request sends the reader's IP address and the area being viewed to
the tile service. Requests start only on sites that enable maps. Under the
default `lazy` loading they start as a map nears the viewport, and a reader who
opens a link to a later section loads every map above it at once, so the text
being read is not pushed down later. If no tile request may happen before the
reader agrees, set `loading: click`: nothing is requested until the button is
pressed. Either way, mention the service in your privacy notice if you have one.

## Place fields {#places}

Besides `name` and the coordinates, a place can carry a note, a thumbnail and a
link:

```yaml {title="One place with every field"}
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
  text: Enter through the Meridian Gate in the morning.
  image: forbidden-city.webp
  link: "#single"
```

- `name` and `text` are plain text: Markdown and HTML in them show literally,
  and popups are built from this text, never from HTML.
- `image` is resolved like any image: page resource, then global resource,
  then static path, then remote URL. Local raster images are resized to fit
  480×360 for the list and the popup, and carry their width and height in
  both, so the popup keeps its size while the image loads; remote images are
  used as they are.
  Thumbnails are decorative (`alt=""`), since the name beside them already says
  what they show. The route map below uses four images stored beside this
  page's `index.md`.
- `link` turns the name into a link in the list and in the popup, typically to
  a `#anchor` on the same page. Quote it, because YAML reads an unquoted `#` as
  the start of a comment.
- A place without a name, without numeric coordinates, or with coordinates out
  of range warns and is skipped. A quoted number such as `lat: "39.9159"` is a
  string, so that place is skipped too.
- Unknown fields warn and are ignored. A fence with no valid place, including
  an empty list `[]`, warns and renders nothing.

## Routes, thumbnails and captions {#route}

`route=true` joins the places with a line in list order, and `image` adds a
resized thumbnail to both the list entry and its marker popup. `caption` adds a
plain-text caption under the list, and screen readers announce it as the name
of the map.

````markdown {title="Source"}
```map {caption="Beijing Central Axis walk" route=true}
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
  text: Start at the Hall of Supreme Harmony; close-up below.
  image: forbidden-city.webp
  link: "#single"
- name: Jingshan Park
  lat: 39.9245
  lng: 116.3904
  text: Climb Wanchun Pavilion to overlook the palace roofs.
  image: jingshan.webp
- name: Beihai Park
  lat: 39.9264
  lng: 116.3825
  text: Cross Yong'an Bridge toward the White Dagoba.
  image: beihai.webp
- name: Drum Tower
  lat: 39.9393
  lng: 116.3898
  text: End the walk at the northern drum plaza.
  image: drum-tower.webp
```
````

```map {caption="Beijing Central Axis walk" route=true}
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
  text: Start at the Hall of Supreme Harmony; close-up below.
  image: forbidden-city.webp
  link: "#single"
- name: Jingshan Park
  lat: 39.9245
  lng: 116.3904
  text: Climb Wanchun Pavilion to overlook the palace roofs.
  image: jingshan.webp
- name: Beihai Park
  lat: 39.9264
  lng: 116.3825
  text: Cross Yong'an Bridge toward the White Dagoba.
  image: beihai.webp
- name: Drum Tower
  lat: 39.9393
  lng: 116.3898
  text: End the walk at the northern drum plaza.
  image: drum-tower.webp
```

Select a marker or a row in the list below to open its popup with the
thumbnail, the name and the note; the first place links to the next section.
The route is a straight line from place to place, not a computed walking or
driving route.

## One place and zoom {#single}

A single place opens at zoom level 15. `zoom` sets another level, from 1 (the
whole world) to 22 (a street corner, capped by `params.map.max_zoom`), and
`height` sets the map's height as a CSS length.

````markdown {title="Source"}
```map {zoom=16 height="18rem"}
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
  text: Hall of Supreme Harmony, centered inside the palace moat.
  image: forbidden-city.webp
```
````

```map {zoom=16 height="18rem"}
- name: Forbidden City
  lat: 39.9159
  lng: 116.3908
  text: Hall of Supreme Harmony, centered inside the palace moat.
  image: forbidden-city.webp
```

With several places, `zoom` replaces the fitted zoom level but keeps the
fitted center. Without `height` the map is `min(26rem, 60vh)` tall, so a reader
on a phone can always scroll past it. `height` takes a positive number
followed by `px`, `rem`, `em`, `vh` or `vw`. A percentage has no height to
resolve against and a zero height leaves nothing to see, so both, like anything
else, warn and keep the default.

## The interactive map {#interactive}

- The theme bundles Leaflet 1.9.4. Only pages with a map link its stylesheet,
  and the script loads when the first map is due: on screen, within 320px
  below the viewport, or anywhere above the reading position (or when the
  reader clicks the load button under `loading: click`).
- Scroll-wheel zoom is off, and on touchscreens single-finger swipes keep
  scrolling the page instead of trapping the reader inside the map. Readers
  pan and zoom with two-finger pinch, the zoom buttons, a mouse or pen drag, or the
  keyboard (focus the map, then use the arrow keys and <kbd>+</kbd> / <kbd>-</kbd>;
  site-wide single-key shortcuts yield while focus is inside the map).
- Selecting a marker by pointer or with <kbd>Enter</kbd>, or clicking a place
  entry in the list below, pans to the place and opens its popup. A popup
  opened with <kbd>Enter</kbd> takes focus, so its link and close button come
  next; <kbd>Escape</kbd> or the close button closes it and returns focus to
  the marker.
- In dark mode the map switches to `dark_tiles` when the site configures them,
  and switches back when the reader changes the color scheme; without
  `dark_tiles`, light tiles are gently dimmed without inverting map colors.
  If every `dark_tiles` request fails, the map keeps the dimmed light tiles.
- The map resizes and frames with its container, including when a tab panel is
  shown or a disclosure opens, without fetching tiles for hidden tabs ahead of time.
- If Leaflet or all light tiles fail to load, the canvas hides and the list remains.

The list stays under the map as its interactive legend and accessible
alternative, and it uses two columns on wide screens.

## Coordinates {#coordinates}

Coordinates are WGS 84 decimal degrees, the system used by GPS, photo metadata
and OpenStreetMap. The explicit `lat` and `lng` keys avoid the mix-ups that
GeoJSON's `[lng, lat]` order causes. To look up a place, open it on
openstreetmap.org: the address bar ends with `#map=zoom/lat/lng`.

Tile services in mainland China commonly use GCJ-02 or BD-09 coordinates, on
which WGS 84 markers land hundreds of meters off. The theme does not ship
unofficial coordinate transforms; choose a WGS 84 / CGCS2000 tile service
(such as compliant self-hosted tiles, a global commercial provider, or Tianditu
with `subdomains: "01234567"` — note that Tianditu splits base imagery and
place labels into two separate layers while `params.map.tiles` configures one).

## Output {#outputs}

Print and RSS show the list and the caption without a map, and RSS makes the
thumbnail URLs absolute. On a site without a tile service, the HTML page has
no map script, stylesheet or tile URL at all. The page's Markdown output keeps
the `map` fence as you wrote it.

## Parameter reference {#reference}

Place fields:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | plain text | — | Required. The list entry and the popup title |
| `lat` | number | — | Required. WGS 84 latitude, −90 to 90 |
| `lng` | number | — | Required. WGS 84 longitude, −180 to 180 |
| `text` | plain text | — | A note under the name and in the popup |
| `image` | image source | — | Page resource / global resource / static path / remote URL; local rasters are resized |
| `link` | URL | — | Links the name; a same-page `#anchor` is typical |
{.fields meta="type default"}

Fence attributes:

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `caption` | plain text | — | Caption under the list; also labels the map region |
| `route` | bool | `false` | `true` connects the places in list order |
| `zoom` | whole number | fit | 1 to 22 (capped by `params.map.max_zoom`). Without it: 15 for one place, otherwise fit all places |
| `height` | CSS length | `min(26rem, 60vh)` | A positive number plus `px` `rem` `em` `vh` `vw` |
| `tab` | plain text | — | Makes this map one panel of a [tab set](/docs/components/tabs/) |
| `group` / `value` | string | — | Tab group and sync value; must appear with `tab` |
| `id` | element ID | generated | The figure's ID, for links to the map |
| `class` | class list | — | Passed through to the figure for site CSS |
{.fields meta="type default"}

`num` and other unknown attributes warn and are ignored. Hugo consumes
`style` and strips `on*` attributes before the theme sees the fence, so those
are ignored without a warning.

Site parameters (`hugo.yml`):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.map.enable` | bool | `false` | Turns on interactive maps; requires `tiles` and `attribution` |
| `params.map.tiles` | URL template | — | `https://` with `{z}`, `{x}`, `{y}` (`{s}`, `{r}` and `{-y}` allowed; other placeholders warn) |
| `params.map.attribution` | string | — | The plain-text attribution the tile service requires |
| `params.map.attribution_url` | URL | — | Optional `https://` URL that turns `attribution` into a link |
| `params.map.dark_tiles` | URL template | — | Optional; used in dark mode |
| `params.map.subdomains` | string | — | Optional `{s}` subdomain characters as a quoted string (e.g. `abcd`, `"01234567"`); empty uses Leaflet's `abc` |
| `params.map.max_zoom` | whole number | `19` | 1 to 22 |
| `params.map.loading` | `lazy` \| `click` | `lazy` | `lazy` mounts on, near or above the reading position; `click` waits for a reader click |
{.fields meta="type default"}

## Limits {#limits}

- Coordinates are WGS 84 only; markers on GCJ-02 or BD-09 tiles appear offset.
- Routes connect places directly in coordinate space and do not wrap across
  the antimeridian.
- There are no GPX or GeoJSON tracks, no marker clustering, search or
  geocoding, and no custom marker icons.
- Markers are not read from photo GPS metadata; write the coordinates.
- `name`, `text` and `caption` are plain text; put rich text in a paragraph
  next to the fence.
- Remote thumbnails are neither downloaded nor resized at build time.

## Related {#related}

- [Gallery](/docs/components/gallery/) — the photos from the places on the map
- [Images](/docs/components/image/) — where thumbnails come from
- [Tabs](/docs/components/tabs/) — one map per day of a trip
- [Expo layout](/docs/write/expo/) — photo essays and exhibitions
- [Draw.io](/docs/components/drawio/) — another feature that stays off until the site names a service
