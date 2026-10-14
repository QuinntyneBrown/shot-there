## Best practices

### Layout

- Inline links sit inside a sentence; `standalone` is the way on from a block ("Read the full review", "Change studios").
- Use `a[st-button]` instead when the link is the page's main call to action ("Book on the studio's site").

### Content

- Say where it goes, in sentence case: "Read the full review", "Watch on YouTube", "Open in Google Maps". Never "Click here", "More" or a bare URL.
- Name an external source by its owner and topic: "Evergreen: photography and filming".
- Show an email address in full as its own text: "corrections@shotthere.ca".

### Accessibility

- Repeated links carry their target in visually hidden text: "Read the full review<span class="visually-hidden"> of Kensington Window Room</span>".
- `external` ends the name with the hidden `externalHint`, because the arrow is hidden; override `externalHint` only to translate it.
