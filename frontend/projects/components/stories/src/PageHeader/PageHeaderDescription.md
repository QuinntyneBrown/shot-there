The DS page header: the title block of every page that is not a list — a review, an editor, an admin page. `st-page-header` renders the page's one `<h1>` from `title`, a muted subtitle slot (`slot="subtitle"`) under it and an actions slot (`slot="actions"`) at the end of the row.

The host carries the `.page-header` class: a wrapping flex row whose actions move under the title when there is no room. With `loading` the heading shows a skeleton while keeping its name for screen readers.
