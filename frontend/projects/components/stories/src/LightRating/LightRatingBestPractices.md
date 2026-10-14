## Best practices

### Layout

- Place it inside the tile or table cell for its time of day; it sizes to its word and sits inline.
- In a stacked table card it sits under the "Rating" label, read with its row header ("Golden hour").

### Content

- The words are None, Low, Medium and Strong, capitalised, and must match `level`.
- The time of day comes from the surrounding tile text or row header, not from the rating.

### Accessibility

- The pips are `aria-hidden`; the word carries the value, so meaning never relies on the pips alone.
- In forced-colours mode each pip keeps a `CanvasText` border and filled pips a `CanvasText` fill.
