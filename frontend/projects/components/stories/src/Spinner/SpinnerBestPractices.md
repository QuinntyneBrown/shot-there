## Best practices

### Layout

- `md` (20px, the default) sits beside body text; `sm` (16px) sits in a dense line such as a search field's busy caption; `lg` stands alone in a region.
- Sizes never change by breakpoint.

### Content

- The `label` names the work: "Searching…", "Loading studios…". Present participle and the ellipsis character; never "Please wait" and no time estimates.
- With no `label` it reads "Loading".

### Accessibility

- To be announced, render the spinner inside a `role="status"` element that is already in the DOM before the spinner arrives.
- When that status element already says the words, hide the spinner's container with `aria-hidden` so nothing is read twice.
- The spinner is never focusable and keeps turning under reduced motion, because a still ring reads as frozen.
