## Best practices

### Layout

- Render it as the whole content of `main`; the public header and footer stay around it.
- One primary action, then a secondary one: "Go to the home page", "Browse studios".

### Content

- The heading says what happened from the visitor's side: "We couldn't find that page", "Something went wrong on our side".
- A not-found page never reveals drafts: "It may have been renamed, or the location isn't published."
- Code line: "Error 404"; reference: "Reference" plus the ID. No status jargon, jokes or exclamation marks.

### Accessibility

- The `h1` is the page's only `h1`; the document title names the error.
- No live region: the page loads as a page. After a client-side route here the application moves focus to `main`.
- The reference is plain text so it can be selected and copied.
