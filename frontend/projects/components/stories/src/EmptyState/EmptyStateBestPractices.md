## Best practices

### Layout

- Use `compact` inside a section, a floating card or under a search box; the full size where the empty state is the page's main content.
- Set `headingLevel` to fit the outline: `3` under a section heading or the hidden "Results" heading, `2` on admin pages and compare.
- Drop the icon inside a small section such as Rain backup or Entries.

### Content

- Title: what is (not) here, in plain words: "No studio reviews yet", "No studios match these filters". Errors start "We couldn't…".
- Text: why, and what next, in one or two sentences; reassure after a failure ("your filters are kept").
- One way forward, named for what it does ("Clear filters", "Try again", "Browse studios"); a second action only to leave.

### Accessibility

- The component sets no live role and never moves focus. When an error replaces content after a request, put `role="alert"` on the host so it is announced; a no-results state is announced by the result count instead.
- The icon is decorative and hidden from assistive technology.
