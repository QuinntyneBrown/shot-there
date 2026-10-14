## Best practices

### Layout

- First thing in `<main>`, above the page title; only detail pages have one. Top-level pages are marked by the site header instead.
- Trails are two levels: the section list and the page. Never start with "Home"; the wordmark already goes home.

### Content

- The parent is the section name as the header says it: "Studios", "Spots", "Guides".
- The current crumb is the record's name exactly as the title shows it; an unsaved record is "New studio".
- Never truncate with an ellipsis: wrap, or `collapse` on phones. When a record cannot be opened, keep only the way back and set `current` to false.

### Accessibility

- The landmark is named by `label` ("Breadcrumb"); the separators and the collapsed "‹" are not read.
- While `loading`, the current crumb's only text is its hidden label ("Loading"), beside the hidden skeleton.
