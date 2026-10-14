## Best practices

### Layout

- Mirror the shape of the content that will replace it: a `rect` for the 3:2 card photo, a `title` for the name, `text` lines for the details.
- Set widths on the host (`style="width: 70%"`); give `rect`, `pill` and `circle` a height too. A trailing `text` line is 60% wide.
- Cover no more than the region that is loading; real controls around it (filters, Sort by) stay usable.

### Content

- Never put "Loading" text inside a skeleton.
- Beside the skeletons, show one status message for the region, "Loading" plus what is loading: "Loading studios…".

### Accessibility

- The loading region carries `aria-busy="true"` and one `role="status"` message — one per region, not one per placeholder.
- Skeletons are never focusable and never move focus.
- The shimmer stops under `prefers-reduced-motion: reduce`.
