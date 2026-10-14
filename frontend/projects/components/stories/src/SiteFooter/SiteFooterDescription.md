The DS site footer that closes every public page: canvas background, muted small text, no border and a large gap above. `st-site-footer` carries `.site-footer`; it renders `.site-footer__brand` (the `brand` in `<strong>`, the optional `tagline` and a `[slot=signup]` slot), a `nav` named by `navLabel` with one link per `NavLink`, and the optional `.site-footer__copy` line.

Internal links get `aria-current="page"` through `RouterLinkActive`; external links open a new tab and end with the hidden `externalHint`.
