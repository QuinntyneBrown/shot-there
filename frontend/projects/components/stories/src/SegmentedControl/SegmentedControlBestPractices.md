## Best practices

### Layout

- Use it to change what the current page shows, instantly: the map bar's "Show" and its phone "View as".
- Use `st-select` for sort, checkboxes and radios for filters, and an `st-button` toggle for a single on/off action.

### Content

- One word per item, sentence case, the noun the page uses: "Both", "Studios", "Spots", "Map", "List".
- Broadest option first and pressed by default: "Both" before "Studios" and "Spots".
- `value` is a machine key and is never translated; `label` and each option's `label` are.

### Accessibility

- `label` names the group ("Show", "View as") and reads before every item; screen readers add "pressed" or "not pressed".
- No counts in the items: the page's own status announces the result ("7 locations").
