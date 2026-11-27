---
title: Maps
linkTitle: Maps
description: List places in a `map` fence to get a numbered place list everywhere, plus an interactive map once the site names a tile service.
weight: 178
search_keywords: [map, maps, places, markers, route, popup, OpenStreetMap, Leaflet, tiles, coordinates, WGS 84, travel]
---

A map fence suits places that belong together in an order: the stops of a
trip, a company's offices, the venues of a conference, the sites of a field
survey. You write the places as a short YAML list, and every output renders
them as a numbered list with names, notes, thumbnails and coordinates that link
to OpenStreetMap. That list is the content, and it works in print, in RSS and
without JavaScript.

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
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
- name: Kiyomizu-dera
  lat: 34.9949
  lng: 135.7850
- name: Fushimi Inari Taisha
  lat: 34.9671
  lng: 135.7727
```
````

```map
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
- name: Kiyomizu-dera
  lat: 34.9949
  lng: 135.7850
- name: Fushimi Inari Taisha
  lat: 34.9671
  lng: 135.7727
```

This site has a tile service configured, so a map appears above the list, with
markers numbered like the list and zoomed to fit every place. On a site
without one, the same fence renders only the list. Each coordinate pair links
to the place on openstreetmap.org; that is an ordinary link the reader may
follow, not a request the page makes.

The body is parsed as YAML, and since JSON is valid YAML,
`[{"name": "Kyoto Station", "lat": 34.9858, "lng": 135.7589}]` works too.

## Site configuration {#configuration}

Maps are off by default. To turn them on, choose a tile service and add it to
`hugo.yml`. This site uses OpenStreetMap's standard tiles:

```yaml {title="hugo.yml"}
params:
  map:
    enable: true
    tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    attribution: "© OpenStreetMap contributors"
```

- `tiles` is an `https://` URL template containing `{z}`, `{x}` and `{y}`.
  An optional `dark_tiles`, with the same rules, is used in dark mode.
- `attribution` is the plain-text credit the tile service requires; it appears
  in the corner of every map.
- `max_zoom` is a whole number from 1 to 22 and defaults to 19.
- `enable: true` without a valid `tiles` and an `attribution` warns and leaves
  maps off, so a half-finished configuration never sends readers to a service
  you have not agreed to. Fences keep rendering their lists.

Pick a service that fits your traffic. The OpenStreetMap Foundation's
[tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
allows light use of its standard tiles with attribution; a busy site should
use a commercial tile service with a domain-restricted key, or
host its own tiles. A key in the tile URL is visible to every reader, which is
why the restriction to your domain matters.

Each tile request sends the reader's IP address and the area being viewed to
the tile service. Requests start only on sites that enable maps, and only when
a map scrolls into view, so mention the service in your privacy notice if you
have one.

## Place fields {#places}

Besides `name` and the coordinates, a place can carry a note, a thumbnail and a
link:

```yaml {title="One place with every field"}
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
  text: Arrive at opening time to avoid the crowds.
  image: kinkakuji.webp
  link: "#day-1"
```

- `name` and `text` are plain text: Markdown and HTML in them show literally,
  and popups are built from this text, never from HTML.
- `image` is resolved like any image: page resource, then global resource,
  then static path, then remote URL. Local raster images are resized to fit
  480×360 for the list and the popup; remote images are used as they are.
  Thumbnails are decorative (`alt=""`), since the name beside them already says
  what they show.
- `link` turns the name into a link in the list and in the popup, typically to
  a `#anchor` on the same page. Quote it, because YAML reads an unquoted `#` as
  the start of a comment.
- A place without a name, without numeric coordinates, or with coordinates out
  of range warns and is skipped. A quoted number such as `lat: "35.0394"` is a
  string, so that place is skipped too.
- Unknown fields warn and are ignored. A fence with no valid place warns and
  renders nothing.

## Routes and captions {#route}

`route=true` joins the places with a line in list order. `caption` adds a
plain-text caption under the list, and screen readers announce it as the name
of the map.

````markdown {title="Source"}
```map {caption="Kyoto in one day" route=true}
- name: Kyoto Station
  lat: 34.9858
  lng: 135.7589
  text: Start here. The station has its own map below.
  link: "#single"
- name: Fushimi Inari Taisha
  lat: 34.9671
  lng: 135.7727
  text: Thousands of vermilion torii gates climb the hill.
- name: Kiyomizu-dera
  lat: 34.9949
  lng: 135.7850
  text: The wooden stage looks out over the city.
- name: Ginkaku-ji
  lat: 35.0270
  lng: 135.7982
  text: The Philosopher's Path starts at its gate.
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
  text: The gold-leaf pavilion over its pond.
```
````

```map {caption="Kyoto in one day" route=true}
- name: Kyoto Station
  lat: 34.9858
  lng: 135.7589
  text: Start here. The station has its own map below.
  link: "#single"
- name: Fushimi Inari Taisha
  lat: 34.9671
  lng: 135.7727
  text: Thousands of vermilion torii gates climb the hill.
- name: Kiyomizu-dera
  lat: 34.9949
  lng: 135.7850
  text: The wooden stage looks out over the city.
- name: Ginkaku-ji
  lat: 35.0270
  lng: 135.7982
  text: The Philosopher's Path starts at its gate.
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
  text: The gold-leaf pavilion over its pond.
```

Select a marker to open its popup with the name, the note and the thumbnail
when there is one; the first place links to the next section. The route is a
straight line from place to place, not a computed walking or driving route.

## One place and zoom {#single}

A single place opens at zoom level 15. `zoom` sets another level, from 1 (the
whole world) to 19 (a street corner), and `height` sets the map's height as a
CSS length.

````markdown {title="Source"}
```map {zoom=17 height="18rem"}
- name: Kyoto Station
  lat: 34.9858
  lng: 135.7589
  text: Trains from Osaka and Tokyo arrive here.
```
````

```map {zoom=17 height="18rem"}
- name: Kyoto Station
  lat: 34.9858
  lng: 135.7589
  text: Trains from Osaka and Tokyo arrive here.
```

With several places, `zoom` replaces the fitted zoom level but keeps the
fitted center. Without `height` the map is `min(26rem, 60vh)` tall, so a reader
on a phone can always scroll past it. `height` takes a number followed by
`px`, `rem`, `em`, `vh`, `vw` or `%`; anything else warns and keeps the
default.

## The interactive map {#interactive}

- The theme bundles Leaflet 1.9.4. Only pages with a map link its stylesheet,
  and the script loads when a map comes within 320px of the viewport.
- Scroll-wheel zoom is off, so scrolling the page never zooms a map by
  accident. Readers zoom with the buttons, with the keyboard (focus the map,
  then use the arrow keys and <kbd>+</kbd> / <kbd>-</kbd>) or with a pinch.
- Selecting a marker, by pointer or with <kbd>Enter</kbd>, opens its popup.
- In dark mode the map switches to `dark_tiles` when the site configures them,
  and switches back when the reader changes the color scheme; otherwise the
  light tiles stay.
- The map resizes with its container, including when a tab panel is shown or a
  disclosure opens.
- If the script or the tiles fail to load, the list is still there.

The list stays under the map as its legend and as the accessible alternative,
and it uses two columns on wide screens.

## Coordinates {#coordinates}

Coordinates are WGS 84 decimal degrees, the system used by GPS, photo metadata
and OpenStreetMap. The explicit `lat` and `lng` keys avoid the mix-ups that
GeoJSON's `[lng, lat]` order causes. To look up a place, open it on
openstreetmap.org: the address bar ends with `#map=zoom/lat/lng`.

Tile services in mainland China commonly use GCJ-02 or BD-09 coordinates, on
which WGS 84 markers land hundreds of meters off. The theme converts no
coordinates, so pick a tile service that works in WGS 84.

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
| `zoom` | whole number | fit | 1 to 19. Without it: 15 for one place, otherwise fit all places |
| `height` | CSS length | `min(26rem, 60vh)` | A number plus `px` `rem` `em` `vh` `vw` `%` |
| `tab` | plain text | — | Makes this map one panel of a [tab set](/docs/components/tabs/) |
| `group` / `value` | string | — | Tab group and sync value; must appear with `tab` |
| `id` | element ID | generated | The figure's ID, for links to the map |
| `class` | class list | — | Passed through to the figure for site CSS |
{.fields meta="type default"}

`num`, `style`, `on*` and other attributes warn and are ignored.

Site parameters (`hugo.yml`):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `params.map.enable` | bool | `false` | Turns on interactive maps; requires `tiles` and `attribution` |
| `params.map.tiles` | URL template | — | `https://` with `{z}`, `{x}`, `{y}` |
| `params.map.attribution` | string | — | The plain-text attribution the tile service requires |
| `params.map.dark_tiles` | URL template | — | Optional; used in dark mode |
| `params.map.max_zoom` | whole number | `19` | 1 to 22 |
{.fields meta="type default"}

## Limits {#limits}

- Coordinates are WGS 84 only; markers on GCJ-02 or BD-09 tiles appear offset.
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
