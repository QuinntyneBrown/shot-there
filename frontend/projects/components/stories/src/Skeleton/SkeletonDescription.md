The DS skeleton: a shimmering placeholder block that stands in for content while it loads. The `st-skeleton` host is the block itself and carries `.skeleton` plus `.skeleton--<shape>` (`text`, `title`, `rect`, `pill`, `circle`).

It is always `aria-hidden="true"` and has no words. The consumer sizes it (a width on the host, and a height for `rect`, `pill` and `circle`) and marks the loading region busy.
