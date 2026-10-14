## Best practices

### Layout

- Always place tiles in a `ul[st-stat-grid]`; the tile fills its cell, so tiles in a row match the tallest and their actions line up at the bottom.
- Under the dashboard's hidden "Content" `h2`, pass `headingLevel` 3.
- Project one action: an `a[st-button]` with a leading `plus` icon. Only one tile's action is `primary` per screen ("New studio").

### Content

- Title: the plural content type as the admin navigation names it — "Studios", "Spots", "Guides".
- Counts: exactly "{n} published, {m} draft"; zero is written "0", never hidden.
- Action: "New" plus the singular type — "New studio". No other copy: no trends, deltas or dates.

### Accessibility

- Tab visits the title link, then the action, tile by tile.
- The counts are plain text after the heading; the plus icon is `aria-hidden`, so the action reads "New studio".
