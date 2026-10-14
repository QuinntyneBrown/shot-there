# @shot-there/components

The ShotThere UI component library: reusable components and directives, such as `FallbackImageDirective`. Everything public is exported from `src/public-api.ts`.

Build it with `npm run build:components` (`ng build components`, output in `dist/components`). The app and the components harness compile against that built package, and `styles/shot-there.css` (tokens, foundations, utilities) is published beside it as the only global stylesheet. ICD-002 (`docs/icd/components-library-application.md`) governs everything it exports.

The Storybook docsite lives in `.storybook/` and `stories/src/` (concept and theme pages, then one folder per component). Run it from `frontend/` with `npm run storybook` (http://localhost:6006) or build it with `npm run build-storybook` (output in `dist/storybook`).
