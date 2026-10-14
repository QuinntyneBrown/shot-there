The DS section list: the full-row links of the site menu sheet below 48rem. `st-section-links` renders a `nav` named by `navLabel` around `ul.section-list`; each `SectionLink` is one `a.section-link`, at least 72px tall, holding `.section-link__title`, an optional `.section-link__meta` line and a trailing chevron.

The current screen's row gets `aria-current="page"` through `RouterLinkActive` (exact when `exact`), drawn as an accent bar and accent title. `attention` adds `data-highlight`, which draws the meta in the danger colour.
