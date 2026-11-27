---
title: Maps
linkTitle: Maps
description: List places in a `map` fence. Every output shows a numbered place list; on sites that name a tile service, HTML adds an interactive map whose numbered markers match it.
weight: 178
search_keywords: [map, maps, places, markers, route, popup, OpenStreetMap, Leaflet, tiles, coordinates, WGS 84, travel]
---

A `map` fence holds a YAML or JSON list of places. Every output renders them as a numbered list with names, notes, thumbnails, and coordinates that link to OpenStreetMap.
That list is the content. On sites that configure a tile service, HTML pages also show an interactive map above the list, with numbered markers that match it.
Use it for places in an order: travel notes, venues and offices, field trips, photo essays.
Use a [table](/docs/components/table/) for addresses that need no map, and an [image](/docs/components/image/) for a map that is a drawing.

## Shortest form {#minimal}

Each place needs `name`, `lat`, and `lng`.

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

This site configures a tile service, so the map appears above the list. Its markers carry the list numbers, and with several places it fits all of them.
Each coordinate pair links to the place on openstreetmap.org. That is an ordinary outbound link, not a request made by the page.
The body is parsed as YAML. JSON is valid YAML, so `[{"name": "Kyoto Station", "lat": 34.9858, "lng": 135.7589}]` works too.

## Place fields {#places}

Besides `name` and the coordinates, a place can have a note, a thumbnail, and a link:

```yaml {title="One place with every field"}
- name: Kinkaku-ji
  lat: 35.0394
  lng: 135.7292
  text: Arrive at opening time to avoid the crowds.
  image: kinkakuji.webp
  link: "#day-1"
```

- `name` and `text` are plain text. Markdown and HTML appear literally, and popups are built from this text, never from HTML.
- `image` uses the shared image resolver: page resource → global resource → static path → remote URL.
  A local raster is resized to fit 480×360 for the list and the popup. Remote images are used as they are.
  Thumbnails are decorative (`alt=""`). The name beside them says what they show.
- `link` turns the name into a link in the list and in the popup. A `#anchor` on the same page is typical.
  Quote it: YAML reads an unquoted `#` as the start of a comment.
- A place without a name, without numeric coordinates, or with coordinates out of range warns and is skipped.
  A quoted number such as `lat: "35.0394"` is a string, so that place is skipped too.
- Unknown fields warn and are ignored. A fence without a valid place warns and renders nothing.

## Routes and captions {#route}

`route=true` connects the places with a line, in list order. `caption` adds a plain-text caption under the list and names the map region for screen readers.

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

Select a marker to open its popup: the name, the note, and the thumbnail when there is one. The first place links to the next section.
The line is drawn straight from place to place. It is not a computed walking or driving route.

## One place and zoom {#single}

A single place opens at zoom 15. `zoom` sets another level, from 1 (the whole world) to 19 (a street corner).
`height` sets the map's height as a CSS length.

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

With several places, `zoom` replaces the fitted level and keeps the fitted center.
Without `height`, the map is `min(26rem, 60vh)` high, so a phone can always scroll past it.
`height` accepts a number followed by `px`, `rem`, `em`, `vh`, `vw`, or `%`. Anything else warns and keeps the default.

## The interactive map {#interactive}

- The theme vendors Leaflet 1.9.4. Only pages with a map link its stylesheet,
  and the engine script loads only when a map comes within 320px of the viewport.
- Scroll-wheel zoom is off, so scrolling the page never zooms a map.
  Zoom with the buttons, the keyboard (focus the map, then use the arrow keys and <kbd>+</kbd> / <kbd>-</kbd>), or a pinch.
- Markers are numbered like the list. Selecting a marker, by pointer or with <kbd>Enter</kbd>, opens its popup.
  Popups are built from text; no author HTML reaches them.
- In dark mode the map uses `dark_tiles` when the site configures them, and it switches when the reader changes the color scheme.
  Without `dark_tiles`, the light tiles stay.
- The map resizes with its container, when a tab panel is shown, and when a disclosure opens.
- Browser printing hides the map and prints the list.
- If the engine or the tiles fail to load, the list remains.

The list stays under the map as its legend and as the accessible alternative. On wide screens it uses two columns.

## Site configuration {#configuration}

Maps are off by default. A site turns them on with `params.map` and the tile service it has chosen. This site's configuration:

```yaml {title="hugo.yml"}
params:
  map:
    enable: true
    tiles: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    attribution: "© OpenStreetMap contributors"
```

- The theme names no default tile service. `enable: true` without a valid `tiles` and an `attribution` warns, and maps stay off.
  The fences still render their lists.
- `tiles` is an `https://` URL template containing `{z}`, `{x}`, and `{y}`. `dark_tiles` follows the same rules.
- `attribution` is the plain text the tile service requires. It appears in the corner of every map.
- `max_zoom` is a whole number from 1 to 22. It defaults to 19.

Tile services have usage policies, quotas, and attribution terms, so the choice belongs to the site.
This site uses OpenStreetMap's standard tiles, which the OpenStreetMap Foundation's [tile usage policy](https://operations.osmfoundation.org/policies/tiles/) permits for light use with attribution.
A busy site should use a commercial tile service with a domain-restricted key, or host its own tiles. A key in a tile URL is visible to every reader.

Tile requests send the reader's IP address and the area being viewed to the tile service.
They start only on sites that enable maps, and only when a map comes into view.

## Coordinates {#coordinates}

Coordinates are WGS 84 decimal degrees, the system used by GPS, photo metadata, and OpenStreetMap.
The explicit `lat` and `lng` keys avoid the order confusion of GeoJSON's `[lng, lat]` arrays.
To look up a place, open it on openstreetmap.org: the address bar ends with `#map=zoom/lat/lng`.

Tile services in mainland China commonly use GCJ-02 or BD-09 coordinates.
On those tiles, WGS 84 markers appear offset by hundreds of meters. The theme converts no coordinates, so use a tile service that works in WGS 84.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML, maps off | `<figure class="td-map">` with `<ol class="td-map__places">` and the caption; no script, stylesheet, or tile URL |
| HTML, maps on | The same figure with `data-td-map`, a map canvas above the list, and a JSON copy of the places; Leaflet loads as the reader approaches |
| Print | The list and the caption; no map |
| Markdown | The `map` fence, emitted as written |
| RSS | The list, with absolute thumbnail URLs |

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

`num`, `style`, `on*`, and other attributes warn and are ignored. Without `id`, the figure gets a generated ID.

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

- Coordinates are WGS 84 only. Markers on GCJ-02 or BD-09 tiles appear offset.
- There are no GPX or GeoJSON tracks, clustering, search, geocoding, or custom marker icons.
- Pins are not derived from photo GPS metadata yet. Write the coordinates.
- Without a configured tile service there is no map, only the list. Print, RSS, and LLMS readers always get the list or the fence.
- `name`, `text`, and `caption` are plain text. Put rich text in a paragraph next to the fence.
- Remote thumbnails are not downloaded or resized at build time.

## Related {#related}

- [Gallery](/docs/components/gallery/) — the photos from the places on the map
- [Images](/docs/components/image/) — where thumbnails come from
- [Tabs](/docs/components/tabs/) — one map per day of a trip
- [Expo layout](/docs/write/expo/) — photo essays and exhibitions
- [Draw.io](/docs/components/drawio/) — another feature that stays off until the site names a service
