The DS skip link: the first tab stop on every page. `st-skip-link` renders one `a.skip-link` (the host adds no box) parked above the viewport until it has keyboard focus, when it slides in at the top left. Activating it focuses the element whose id is `targetId` (default `main`); if there is no such element the browser follows the `#main` hash as usual.

`label` defaults to the library string "Skip to content" (`@@st.skipLink.label`). Press <kbd>Tab</kbd> inside a story to see it.
