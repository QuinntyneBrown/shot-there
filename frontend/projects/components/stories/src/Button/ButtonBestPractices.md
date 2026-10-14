## Best practices

### Layout

- One `primary` button per screen: the solid ink action. Everything else is `secondary`, `ghost` or `link`.
- Every control is 44px tall by default (`md`); `sm` is for dense rows such as table actions and chips.
- Use `block` to fill a narrow column — a sign-in form, a filter sheet's footer.

### Content

- Sentence case, usually a verb: "Save changes", "Apply filters", "Show 7 studios".
- Icon-only buttons (`iconOnly`) **must** have an `aria-label` on the host.
- Use `danger` and `ghost-danger` only for destructive actions, and confirm them in a dialog.

### Accessibility

- `busy` and `softDisabled` keep the button focusable and set `aria-disabled`; clicks are swallowed so a form submits nothing.
- Prefer `softDisabled` with an explanation over native `disabled`, which removes the button from the tab order.
- `pressed` turns the button into a toggle with `aria-pressed`.
