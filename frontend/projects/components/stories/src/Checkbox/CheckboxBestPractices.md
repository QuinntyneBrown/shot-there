## Best practices

### Layout

- Each row is at least 44px tall and the whole label is clickable.
- For several boxes that answer one question, use a checkbox group instead of stacking single checkboxes.

### Content

- Write the label as a statement that is true when ticked: "20 A circuits available".
- Use `description` for a short qualifier under the label; use `help` for guidance about the field.
- The application decides validity and passes `error`.

### Accessibility

- It is a native checkbox inside its `<label>`; Space toggles it.
- `aria-describedby` lists the error (or warning), then the help; `aria-invalid` is set only for an error.
- Disable through the forms API (`FormControl.disable()`).
