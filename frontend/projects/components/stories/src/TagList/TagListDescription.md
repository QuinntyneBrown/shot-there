The DS tag list: quiet outlined labels that say what a place is good for ("Engagement", "Portrait") or link to a related page — the spot list filtered to that use, a guide a studio is featured in. `st-tag-list` renders `items` as a `<ul class="tags">`; an item with a `link` becomes a `routerLink` tag, one without stays static text.

Static tags are `li.tag` (compact); link tags are `a.tag.tag--link`, the large 44px size. When `items` is empty the component renders nothing.
