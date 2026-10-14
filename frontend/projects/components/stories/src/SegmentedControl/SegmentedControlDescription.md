The DS segmented control: a short, wrapping row of toggle buttons where exactly one is pressed. `st-segmented` carries `.segmented`, `role="group"` and an `aria-label` from `label`; each `SegmentedOption` renders a native `<button>` with `aria-pressed`, muted at rest and accent semibold when pressed.

`value` is a model: pressing an option sets it and emits `valueChange`; pressing the pressed option does nothing. Each item reserves its semibold width, so selecting never shifts the row.
