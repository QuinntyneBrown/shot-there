## Best practices

### Layout

- Render exactly one `st-toast-region`, as the last part of the shell, so its live region exists before any toast arrives.
- The region sits bottom-right from 36rem and spans the bottom on phones, above the safe area. Only the newest three show.

### Content

- Title: what happened, naming the thing, no full stop: "Corktown Garage Studio is published", "Link copied".
- Failures start "Couldn't …" and the text says what is safe and what to do: "Your changes are still here. Check your connection and try again."
- At most one action, as a verb phrase: "View public page", "Try again". No "OK" and no Undo.

### Accessibility

- A toast never takes focus; focus stays on the control that raised it.
- Use `danger` for failures: it is announced at once (`role="alert"`) and does not time out.
- Timers are 8 seconds and pause while the toast is hovered or focused (WCAG 2.2.1).
- Do not also announce the same result another way; the region is the only announcer.
