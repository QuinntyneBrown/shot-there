# Estimate — Set the episode video

## Basis

The estimate assumes an intermediate Angular/TypeScript and Next.js developer.
The studio and spot editors and their save routes exist from their own designs.
The hours assume the three accepted forms listed in the design; further forms
are `<TO SUPPLY>`. Hours cover implementation, tests and review fixes.
[Detailed design](../../detailed-designs/content-management/set-episode-video/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `extractVideoId` with unit tests for each accepted and rejected form | 2 |
| `videoIdField` zod schema in studio and spot save schemas | 1 |
| `videoLinkValidator` and message in both editors | 2 |
| `videoId` columns and migration | 1 |
| API tests for save with link, short link, invalid link and empty value | 1 |
| Playwright acceptance tests via page objects | 2 |
| **Total** | **9** |

## Minimal scope

The minimal version keeps the server extraction and schema and shows the
server's field error in the editor, without a client validator. It satisfies
`L2-059` in full, as the message appears after the save attempt. Total: 7
hours.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| Client validator; rely on server field error | Message before a round trip | 2 |
