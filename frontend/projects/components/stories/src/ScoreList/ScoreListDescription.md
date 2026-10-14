The DS rubric score list: `st-score-list` renders a `ul.score-list` named by `label`, with one `li.score` per `RubricScore` — the label, a row of `max` pips (`.pips`, the first `value` filled in ink, the rest a 3:1 edge) and the number. Rows stack in one column and form two columns from 48rem.

The host adds no box (`display: contents`). Each row hides its visible parts and exposes one sentence instead: "Value: 4 out of 5".
