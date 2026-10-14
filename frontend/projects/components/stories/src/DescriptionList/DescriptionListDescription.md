The DS description list (`.kv`): `st-description-list` renders one `<dt>`/`<dd>` pair per `Fact` in `items` — a studio's pricing, measured specifications and logistics, or a spot's practical conditions. Rows stack below 36rem and become a 12rem label column beside the value from 36rem, with hairline rules between rows.

A fact can carry a `numeric` value (tabular figures, `.num`), a visually hidden `srSuffix` read after the value, and a `badge` (`st-badge`). An empty `items` renders nothing.
