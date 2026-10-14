## Best practices

### Layout

- Name each list with a section heading through `aria-labelledby` ("Pricing", "Measured specifications"); the heading is the application's.
- Use a table instead when people read down a second column, such as light by time of day.
- When there is nothing to list, the application shows its own sentence ("Nothing costs extra at this studio.") in place of the list.

### Content

- Labels are the same on every location, in the same order, so reviews compare side by side.
- Values arrive formatted: CAD with two decimals and `numeric` ("$60.00"), metric first with imperial in brackets ("3.4 m (11 ft)").
- Absent values are words — "No", "None", "None nearby", "Not measured" — never a blank or a dash.
- Fee badges say whether the fee counts: "Mandatory" or "Optional, not in all-in".

### Accessibility

- Nothing in the list is focusable; it reads as term and definition pairs.
- Use `srSuffix` to complete a bare figure for screen readers: "5" is read as "5 out of 5".
- A badge is text, so a fee's kind never relies on colour.
