The DS alert: a toned message in the flow of the page, with the tone's icon, an optional `title`, the body text, an optional action and an optional Dismiss button. The `st-alert` host carries `.alert` and `.alert--info` (default), `.alert--success`, `.alert--warning` or `.alert--danger`; `banner` adds `.banner` for a full-width strip.

The default slot is the body paragraph; an element with `slot="action"` (one link or small button) goes in `.alert__actions`. `role` is `status`, `alert` or none, and `dismissible` shows a close button that emits `dismissed`.
