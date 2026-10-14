## Best practices

### Layout

- Use it once per review, as the verdict's headline, followed by the `st-score-list` rubric.
- It sizes to its content and stays on one line at every width.

### Content

- The value always has one decimal, formatted by the application: "4.0", never "4".
- The scale is "out of 5": pass `maxText` "overall, out of 5". No percentages.

### Accessibility

- It is plain text and reads as one sentence: "3.8 overall, out of 5".
- Scores do not change while the page is open, so nothing is announced and nothing animates.
