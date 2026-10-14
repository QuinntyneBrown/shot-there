A help or error message that stands outside a form field — under an image row, a drop area or an editor section. `st-inline-message` is an attribute on a native `<p>`; the host carries `.field__help` for `tone="help"` (the default) or `.field__error` for `tone="error"`, which adds a ⚠ glyph that is never read aloud.

The consumer writes `id` and `role`. Messages that belong to a single control come from the form field components instead.
