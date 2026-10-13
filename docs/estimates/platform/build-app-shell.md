# Estimate — Build the app shell

## Basis

The hours assume an intermediate Angular/TypeScript developer working in a freshly generated Angular workspace with `@angular/ssr`, Angular CDK, Playwright, and axe-core installed. Theme token values are assumed to exist in the design system; if they are still `<TO SUPPLY>`, contrast fixes add time. Hours cover implementation, tests, and review fixes. [Detailed design](../../detailed-designs/platform/build-app-shell/README.md)

## Full design

| Work item | Hours |
|-----------|------:|
| `ShellComponent` with main landmark and safe-area padding | 3 |
| `SkipLinkComponent` with focus move to `#main` | 2 |
| `HeaderComponent` with responsive menu disclosure and Escape handling | 6 |
| `SiteFooterComponent` and `NavLink` | 2 |
| `APP_PATHS`, `PAGE_TITLES`, and `ShotThereTitleStrategy` | 3 |
| `AnnouncerService` wrapping CDK `LiveAnnouncer` | 2 |
| Global foundations: `.st-container`, `:focus-visible`, visually hidden utility | 3 |
| `lang="en-CA"`, `LOCALE_ID`, and i18n markup on shell text | 2 |
| `@angular-eslint/template/i18n` lint rule wired into CI | 2 |
| `ShellPage` page object and Playwright tests at 320px, 200% zoom, and landscape SM | 6 |
| axe-core scan and contrast check in light and dark themes | 3 |
| **Total** | **34** |

## Minimal scope

The minimal shell keeps `ShellComponent`, `SkipLinkComponent`, `HeaderComponent` with the menu disclosure, the layout container, the focus style, `lang="en-CA"`, and the i18n lint rule, with Playwright tests for those behaviours. It drops `SiteFooterComponent`, `ShotThereTitleStrategy`, `AnnouncerService`, and the shell-level axe-core and contrast checks. The minimal scope totals 22 hours. It satisfies `L2-064`, `L2-065`, `L2-066`, `L2-067`, and `L2-070`. It defers `L2-068` and `L2-069` acceptance to the first page that renders content and announces changes.

## Partial descoping

| Descope | What is lost | Hours saved |
|---------|--------------|------------:|
| `AnnouncerService`; pages call CDK `LiveAnnouncer` directly | One shared announcement entry point | 2 |
| `ShotThereTitleStrategy`; pages set titles themselves | Central title suffix handling | 2 |
| Shell axe-core and contrast checks; rely on per-page scans | Early detection of shell accessibility regressions | 3 |
| Landscape SM test case | Automated proof of the 25% header height limit | 2 |
