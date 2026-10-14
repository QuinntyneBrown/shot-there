## Best practices

### Layout

- Use `inline` for a short label beside the control, such as "Sort by" above the studio list. Never combine it with help, warning or error.
- Use a radio group instead when there are only two or three options, or they must be compared at a glance.

### Content

- Options are data: a stable `value` and a sentence-case `label`. The application owns the list, its order and any empty option ("Any size", "Not set").
- An option can be `disabled` to keep it in view but unavailable.
- Errors name the choice to make: "Choose a type".

### Accessibility

- It is a native `<select>` with a `<label for>`, so phones get their own picker and type-ahead works.
- `aria-describedby` lists the error (or warning), then the help; `aria-invalid` is set only for an error.
- Disable through the forms API (`FormControl.disable()`).
