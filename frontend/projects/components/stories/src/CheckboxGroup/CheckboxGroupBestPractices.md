## Best practices

### Layout

- Use `appearance="filter"` in the filters sheet and sidebar, `form` (default) in editors.
- Project a control that answers the same question (the "Minimum usable space" select under "Space and light") into the group rather than placing it outside.

### Content

- The legend asks the question ("Included gear"); each option is a short noun.
- Options are data: a stable `value`, a `label`, an optional `description` and `disabled`.
- The application decides validity ("Choose at least one best use") and passes `error`.

### Accessibility

- A native `<fieldset>` and `<legend>`: each box is heard with its question, e.g. "Included gear, group. Lights, checkbox, not checked".
- The fieldset's `aria-describedby` lists the error, then the help; each box gets `aria-invalid` while there is an error.
- Disable the whole group through the forms API, or one option with `disabled`.
