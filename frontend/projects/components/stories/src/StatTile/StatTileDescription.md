The DS stat tile (`.stat-tile`, on the host): `li[st-stat-tile]` is one administration-dashboard card for a content type — a heading (`.stat-tile__title`) that links to the type's admin list when `link` is set, the counts (`.stat-tile__counts`, "7 published, 2 draft") and, in the default slot, the tile's action (`.stat-tile__action`).

The heading is an `h2` by default; `headingLevel` sets 3 or 4. Tiles live in a `ul[st-stat-grid]` and fill their grid cell.
