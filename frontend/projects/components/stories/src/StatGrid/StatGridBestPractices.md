## Best practices

### Layout

- Three tiles in the order Studios, Spots, Guides: one column on phones, one row from 48rem, with equal widths and heights.
- Place it under a heading ("Content", which may be visually hidden) so the tiles' `h3` titles follow without a skipped level.

### Content

- Only `li[st-stat-tile]` or `li[st-stat-tile-skeleton]` items go inside; it is a native list.
- When the counts fail, render no grid at all: the page shows its error empty state instead of guessed counts.

### Accessibility

- It stays a `ul`, so a screen reader announces a list of three items.
- While loading, set `aria-busy="true"` on the wrapper and put a visually hidden `role="status"` message ("Loading the dashboard") beside the grid; the skeleton tiles are hidden.
