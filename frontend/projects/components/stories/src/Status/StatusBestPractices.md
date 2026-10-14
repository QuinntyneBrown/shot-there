## Best practices

### Layout

- Use it in the admin lists' Status column, in an editor's page header subtitle, and in the editor's Status aside.
- It stays on one line.

### Content

- Exactly two words, sentence case: "Published" and "Draft". Never "Live", "Public", "Hidden" or "Unpublished".
- Where there is room, say what the state means beside it: "Draft · not on the public site", "Published · Last saved 29 Sep 2026, 9:40 am".

### Accessibility

- The word is the accessible text; the shape is a pseudo-element and is not read. Never ship the shape without the word, or replace the word with an icon or `aria-label`.
- A state change is announced by the toast that confirms the publish or unpublish, not by the label.
