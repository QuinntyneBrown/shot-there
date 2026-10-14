The DS progress bar. The `st-progress` host is the `.progress` track with `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"` and `aria-valuenow`; its `.progress__bar` fills to `value` (clamped to 0–100). A `null` value adds `.progress--indeterminate` and omits `aria-valuenow`.

`label` is required and becomes the bar's `aria-label`. `tone` adds `.progress--success` or `.progress--danger`.
