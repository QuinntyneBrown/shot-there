## Best practices

### Layout

- Render three in a `ul[st-stat-grid]`, one per tile to come, so the loaded tiles replace them without a layout shift.

### Content

- The skeleton is empty: no text, no partial counts.

### Accessibility

- It is hidden from assistive technology. Wrap the grid in an `aria-busy="true"` element and add a visually hidden `role="status"` message, "Loading the dashboard".
- The shimmer stops under `prefers-reduced-motion: reduce`.
