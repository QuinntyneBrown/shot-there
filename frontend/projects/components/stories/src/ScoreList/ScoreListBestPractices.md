## Best practices

### Layout

- The list fills its column; pips never scale with the viewport.
- Use it under `st-score-overall` in the verdict. Cards, guide entries and comparison cells show the number only, without pips.

### Content

- The six categories are fixed and always in this order: Value, Light, Space, Gear, Logistics, Condition. Never abbreviate them.
- Values are whole numbers from 0 to 5 on the default `max` of 5.
- Name the list with `label`, such as "Rubric scores".

### Accessibility

- Each row is read as one sentence ("Space: 3 out of 5"); the label, pips and number are `aria-hidden`.
- Filled and empty pips differ by fill and edge, not only colour, and keep their shapes in forced-colours mode.
- Nothing is interactive or animated.
