The DS breadcrumb: a one-line trail above a detail page's title that names its list and links back to it, "Studios / The Junction Loft". `st-breadcrumb` renders a `nav` named by `label` (default "Breadcrumb") around `ol.breadcrumb`; items with a `link` are `routerLink`s, and the last item is the current page (`aria-current="page"`) while `current` is true.

`loading` swaps the current crumb for an `st-skeleton` beside its label in hidden text. `collapse` adds `.breadcrumb--collapse`: below 48rem only the parent shows, prefixed with "‹".
