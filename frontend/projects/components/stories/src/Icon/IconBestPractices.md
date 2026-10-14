## Best practices

### Layout

- One icon per control: leading for "Try again", "Copy link", "Filters"; trailing only for the external arrow.
- Let the containing block size the icon; reach for `size` only for a standalone glyph such as an empty-state circle (`xl`).

### Content

- Text first: an icon sits beside a visible label, or inside one of the icon-only controls (Close, Previous photo, Next photo).
- No icons in headings, body copy or as bullets, and never a score, light level or permit status drawn as an icon alone.
- If no icon on the sheet matches, the label goes without one rather than borrowing a near miss.

### Accessibility

- The icon adds nothing to any accessible name: "Try again", not "refresh Try again".
- Icon-only controls take their name from their own `aria-label`; status icons always repeat a title in words (WCAG 1.4.1).
