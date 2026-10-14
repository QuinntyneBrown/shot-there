## Best practices

### Layout

- Put the message right under what it is about; long messages wrap downward and never truncate.
- For several errors at once, stack the paragraphs inside one wrapper.

### Content

- Help is a full sentence that adds what the label does not: "The preview moves as you type."
- A field-less error names its object so it makes sense alone: "gallery-04.jpg didn't upload. Check your connection."
- Name the limit, not the rule: "raw-export.tif is 25 MB. The limit is 20 MB." No "Error:" prefix, no "please", no blame.

### Accessibility

- Give a message an `id` when something references it with `aria-describedby`.
- An error that appears without a submit gets `role="alert"` — on the host for one line, or on the wrapper for a stack, once.
- Messages are never focusable and never move focus.
