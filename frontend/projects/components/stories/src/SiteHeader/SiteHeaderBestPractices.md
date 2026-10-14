## Best practices

### Layout

- One header at the top of every page, after the skip link; it scrolls away with the page.
- Below 48rem only the wordmark and Menu show; below 24rem the tag hides too.
- Project the admin's Sign out into `slot="actions"`.

### Content

- Public links, in order: Studios, Spots, Map, Compare, Guides. Admin: Dashboard, Studios, Spots, Guides, View site, then Sign out.
- Tags are "Toronto" and "Admin". `brand` "ShotThere" is a name and is not translated.
- Mark Dashboard and View site `exact` so they are not current on every admin page.

### Accessibility

- `navLabel` names the landmark ("Primary", "Administration"); nav links are single visible words with no `aria-label`.
- Bind `menuExpanded` and `menuControls` to the application's menu sheet, so Menu exposes `aria-expanded` and `aria-controls`.
