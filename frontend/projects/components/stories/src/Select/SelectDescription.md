The DS select: one answer from a short, fixed list through the platform's own picker — how to sort the studios, the minimum usable space, which way a studio's windows face. `st-select` renders the label, optional marker, a native `<select>` with a CSS chevron, one error or warning, then help, over the `SelectOption[]` it is given.

The host carries the `.field` class (plus `.field--warning` and `.field--inline`); the control is `.select` (`.input--sm`, `.input--lg`). It is a `ControlValueAccessor`, so its value and disabled state come from Angular forms.
