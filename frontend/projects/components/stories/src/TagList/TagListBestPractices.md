## Best practices

### Layout

- Tags wrap onto as many lines as they need; they never scroll sideways.
- Inside a location card use static tags only, since the card is already a link.

### Content

- Short nouns in sentence case: "Engagement", "Best natural light". The component renders `items` in the order given.
- The application builds link paths from its central paths, and omits the whole section (heading included) when there are no items.
- Tags never change state: use chips for removable filters and badges for status.

### Accessibility

- A native list of text or links; static tags are not in the tab order.
- Set `label` (the list's `aria-label`) only when no visible heading or caption names the list.
