A decorative outline glyph from the DS icon sheet. `st-icon` renders one inline `<svg class="icon">` on a 24-unit grid with a round stroke in `currentColor`; the host adds no box (`display: contents`). `size` adds `.icon--sm`, `.icon--lg` or `.icon--xl`; `md` adds nothing.

The SVG is always `aria-hidden="true"`: the words beside it, or the accessible name of the control that holds it, carry the meaning. Inside `.btn`, `.link--external`, `.tag`, `.alert`, `.toast` and other DS blocks the icon takes that block's size and colour.
