## Best practices

### Layout

- Show it below LG only; from LG the filters sit in a column beside the results.
- It is 44px tall (`--control-height-md`) and sizes to its label and count.

### Content

- The slot is "Filters"; `count` is the number of active filters, and 0 hides the bubble.

### Accessibility

- The application owns `aria-expanded`: bind it to whether the filters sheet is open.
- The visible "Filters" and "2" are both in the name ("Filters, 2 active"), meeting WCAG 2.5.3.
- Native `disabled` dims the pill and removes it from the tab order.
