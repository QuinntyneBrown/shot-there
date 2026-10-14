## Best practices

### Layout

- One skip link per page, placed first in the document, before the site header.
- The application renders the one `<main id="main" tabindex="-1">` it targets.

### Content

- Exactly "Skip to content", sentence case; no icon or arrow. Override `label` only to translate it.
- A longer translation wraps within the screen; it never widens the page.

### Accessibility

- The visible text is the name: no `aria-label`, no `title`.
- After activating it, the next <kbd>Tab</kbd> lands on the first control inside `<main>` instead of the wordmark and header links.
