## Best practices

### Layout

- The textarea grows by `rows` (default 4), not by size; people can drag it taller.
- Use a text field for anything that fits on one line ("Bench for 3").

### Content

- `maxlength` shows "12 of 20 characters" and an over-limit state. It never truncates and never decides validity — the application passes `error` when text is too long.
- Errors say what to write: "Write who this studio is for".
- Use `labelSuffix` for repeated fields, such as "Editor's note" for each guide entry, so each is named uniquely for screen readers.

### Accessibility

- The counter is part of `aria-describedby`; a separate polite live region announces the count only after typing pauses for a second.
- Enter inserts a new line and never submits the form.
- Disable through the forms API (`FormControl.disable()`).
