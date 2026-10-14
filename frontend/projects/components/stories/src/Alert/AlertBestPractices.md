## Best practices

### Layout

- Place the alert where its message applies: above a form, inside a review section, in a dialog body.
- At most one action: a link or a `size="sm"` button with `slot="action"`.
- `banner` is for a full-width strip under the site header.

### Content

- Title: the condition in sentence case, a few words: "Prices may be out of date", "Too many sign-in attempts".
- Text: what it means and the next step, with the real number: "We last checked these prices 225 days ago. Confirm with the studio before you book."
- Say "we" for ShotThere's side of a failure, and reassure about what is kept: "What you typed is still here."

### Accessibility

- Choose `role` by urgency, not tone: `alert` for something the visitor must hear now (a rate limit, a failed save), `status` for a polite note (a stale price), none for plain content.
- For the role to announce, insert the alert after the page has loaded.
- The alert never takes focus. After `dismissed`, the application removes it and moves focus to the next heading.
- The title is a paragraph, not a heading, so the page outline is unchanged; the icon is decorative.
