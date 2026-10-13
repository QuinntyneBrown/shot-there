# @shot-there/components

The ShotThere UI component library: reusable components and directives, such as `FallbackImageDirective`. Everything public is exported from `src/public-api.ts`.

Build it with `npm run build:components` (`ng build components`, output in `dist/components`). The app and the components harness compile against that built package, and `styles/shot-there.css` (tokens, foundations, utilities) is published beside it as the only global stylesheet. ICD-002 (`docs/icd/components-library.md`) governs everything it exports.
