## Best practices

### Layout

- The slot belongs to the owner: give the wrapper its aspect ratio, `overflow: hidden`, corners and the `--color-bg-photo` ground; the image fills it with `object-fit: cover`.
- Set `priority` on exactly one image per page, the first above the fold (the review hero, or the first card of a list). Every other image stays lazy.
- Pass a `sizes` that tells the browser the slot's rendered width, so it picks the smallest variant that fills it.

### Content

- Alt text says what the photo shows and what it proves, in one sentence: "Close portrait against the brick wall with the octabox as fill." Never "Image 2" or a file name.
- Use `decorative` (`alt=""`) only when the name beside the photo says the same thing, such as a card photo followed by the studio's name.
- A failed image never says "Image unavailable": the alt text is the message.

### Accessibility

- Neither the image nor the fallback is focusable; Tab stops on the link or button around it, loaded or failed.
- The fallback icon is `aria-hidden`; a failed informative image keeps its alt text as visible text, a failed decorative one prints nothing.
