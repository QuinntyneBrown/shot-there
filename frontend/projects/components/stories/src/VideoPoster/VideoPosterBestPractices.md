## Best practices

### Layout

- The poster and the player fill their column at 16:9 at every width, so the slot is sized before the still or the player arrives.
- When a review has no video, render no poster at all: the component has no empty state.
- Put the "Watch on YouTube" link and the episode line beside the poster; they are the application's, not the component's.

### Content

- Keep the default `playLabel`, "Play episode"; never "Watch now" or a bare "Play".
- `playContext` names only the episode number and location (": Episode 4, The Junction Loft"); it is visually hidden and makes the link's name unique.
- `title` is the full episode title as published; it names the player.

### Accessibility

- The poster is a native link; its name is `playLabel` + `playContext`, starting with the visible words.
- After activation focus moves to the player, so keyboard and screen-reader users land in it. The player never autoplays.
- The still is `alt=""`; the link's name already carries the episode.
