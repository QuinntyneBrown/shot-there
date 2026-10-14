## Best practices

### Layout

- Use `appearance="filter"` in the filters sheet and sidebar, `form` (default) in editors.
- A dependent field (the "Provided by" text field) sits after the group, outside the fieldset; the application enables or disables it through the forms API.

### Content

- The legend asks the question: "How was this session paid for?".
- Two to five short options. Use a select for longer lists and a checkbox group when more than one answer applies.
- A filter can offer "Any" with the value `''`; a new review starts with nothing chosen and the application passes `error` if it is saved that way.

### Accessibility

- Native radios in a `<fieldset>` and `<legend>`, sharing `name` (the generated id when no `name` is set, so every group on a page stays separate): the group is one tab stop and the arrow keys move and select, wrapping at the ends.
- The fieldset's `aria-describedby` lists the error, then the help; each radio gets `aria-invalid` while there is an error.
- Disable the whole group through the forms API, or one option with `disabled`.
