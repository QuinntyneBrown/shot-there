## Best practices

### Layout

- One page header per page, at the top of `main`, inside the `container`.
- Actions sit at the end of the row and wrap under the title block on narrow screens, in the same order.
- List pages (the studio and spot browse pages, home) use their own heads, not this component.

### Content

- The title is the page's name: "Liberty Village Loft", "Studios", "Dashboard".
- The subtitle is one short muted line: status, last saved, who is signed in.
- Usually one primary action; the rest `secondary` or `ghost`.

### Accessibility

- The title is the page's only `h1`.
- While `loading`, the `h1` still reads the title (e.g. "Loading studio") behind the skeleton; mark `main` `aria-busy="true"` from the page.
