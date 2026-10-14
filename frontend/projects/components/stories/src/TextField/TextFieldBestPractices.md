## Best practices

### Layout

- The field fills its column; set the width on the layout, not the field.
- `inline` puts a short label beside the control. Never combine it with `help`, `warning` or `error`.
- Medium (44px) is the default; `lg` is for the sign-in card, `sm` for dense rows.

### Content

- Fields are required unless marked: set `optional` on the few that are not, and `optionalLabel` when the marker needs more words.
- The value is the string typed. The application parses numbers and dates and decides validity; the field only shows `error`.
- Errors say how to fix the value: "Enter an amount of 0 or more", not "Invalid".
- Use `prefix="$"` for an amount in CAD rather than writing the currency into the label.

### Accessibility

- The label is a real `<label for>`; `inputId` sets the id, otherwise one is generated.
- `aria-describedby` lists the error (or warning), then the help; `aria-invalid` is set only for an error, never for a warning.
- Disable through the forms API (`FormControl.disable()`); `readonly` keeps the value readable while a form submits and also disables the password toggle.
- The password toggle is a pressed-state button named "Show password" for screen readers.
