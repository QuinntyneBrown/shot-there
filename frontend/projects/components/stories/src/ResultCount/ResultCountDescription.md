The DS result count: the status line above a list that says how many results it shows — "7 studios", "5 spots", "No guides match". `st-result-count` renders its `text`, plus an optional `srSuffix` that only screen readers hear, such as ", sorted by all-in cost".

The host carries the `.result-count` class with `role="status"` and `aria-live="polite"`, so every change of `text` is announced without moving focus.
