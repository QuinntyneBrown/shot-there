## Best practices

### Layout

- Use it only where a glyph is universally understood and space is tight; everywhere else use `st-button`, with a visible word.
- Use `outline` for the hairline ring the lightbox draws on its controls over the canvas.

### Content

- `label` is a short verb phrase in sentence case: "Close", "Previous photo", "Next photo". In a list the name includes its object ("Remove test shot 2").
- One glyph, one meaning: × closes, chevrons step, the external arrow leaves ShotThere.

### Accessibility

- `label` is required and renders as `aria-label`; no `title` tooltip — a glyph that needs one needs a word.
- Bind `pressed` only for a toggle; it renders `aria-pressed` and the accent ink. Leave it unset otherwise.
- On an `<a>`, `aria-current="page"` draws the current state.
