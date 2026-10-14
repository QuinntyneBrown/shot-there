The DS textarea: room for a few sentences visitors will read on the public page — who a studio is for, a guide's introduction, how to get to a spot. `st-textarea` renders the label, optional marker, a native `<textarea>`, one error or warning, help and, with `maxlength`, a character counter.

The host carries the `.field` class (and `.field--warning`); the control is `.textarea` and the counter `.field__counter` (`.field__counter--over` past the limit). It is a `ControlValueAccessor`, so its value and disabled state come from Angular forms.
