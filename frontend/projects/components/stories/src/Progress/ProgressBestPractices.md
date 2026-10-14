## Best practices

### Layout

- The bar fills the width of its container, typically an image row under the file line.
- Use `value: null` while the server is processing a file whose bytes have all been sent.

### Content

- Name the file in `label`: "Uploading gallery-02.jpg", never "Upload progress", so several bars in a list have distinct names.
- A visible value beside the bar ("Uploading… 45%") is the consumer's: present participle, ellipsis, no space before %.

### Accessibility

- The bar announces nothing and has no live region; value changes are not announced. Announce a failure with the row's `role="alert"` error.
- Hide any visible percentage text with `aria-hidden="true"` so the value is not heard twice.
- The bar is never focusable. Under reduced motion the indeterminate segment stops sliding.
