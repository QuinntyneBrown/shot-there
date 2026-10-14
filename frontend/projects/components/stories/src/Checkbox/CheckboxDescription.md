The DS single checkbox: one yes-or-no fact, such as "20 A circuits available" in the studio editor. `st-checkbox` renders a native checkbox inside a wrapping `label.choice`, so the whole row is the target, with an optional description under the label, then one error or warning and help.

The host carries the `.field` class (and `.field--warning`); the row is `.choice`, with `.choice__text` when there is a `description`. It is a `ControlValueAccessor` whose value is a `boolean`; the disabled state comes from Angular forms.
