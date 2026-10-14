The DS spinner: a ring that turns while a short wait has no measurable amount. `st-spinner` renders the `.spinner` ring (`.spinner--sm`, `.spinner--lg`) with `aria-hidden="true"`, followed by its `label` in a `.visually-hidden` span.

It has no role and no live region of its own; the consumer places it inside a `role="status"` element to announce it. For a wait with a known amount use `st-progress`; for a busy button use `st-button`'s own `busy` ring.
