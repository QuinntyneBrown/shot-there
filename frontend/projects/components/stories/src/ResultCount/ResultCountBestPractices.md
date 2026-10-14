## Best practices

### Layout

- Put the count first in the results head, before the filter trigger and the sort select, so it is read before the controls.
- In admin lists the count can be hidden with the global `visually-hidden` class on the host; it is still announced.

### Content

- A number and a plural noun: "7 studios", "1 studio", "0 spots"; the application builds the string.
- Use `srSuffix` to say what changed that is not visible in the count, such as the sort order.

### Accessibility

- It is a polite live region: keep the element on the page and change its `text`, rather than re-creating it, so the change is announced.
- Do not move focus to the count.
