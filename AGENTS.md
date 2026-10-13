## Project Overview

This repository is `shot-there`. Full detail is in `shotthere-prd.md`.

## Product brief

ShotThere is a review and comparison site, with a companion YouTube channel,
for places to shoot photos in Toronto: rental studios first, then outdoor spots.
Each location is reviewed first-hand with the same measurements and test setup,
so locations compare side by side. **Nothing is listed unless it has been shot
there.**

This repository is the full-stack web solution: a Next.js backend and an
Angular frontend.

## Boundaries

- `AGENTS.md` is generated. Regenerate it with `primer init`; edits to it are replaced.

## Frontend (Angular)

- Angular (standalone components, signals, zoneless, SSR) in `frontend/`, an
  Angular workspace with three projects under `frontend/projects/`:
  - `shot-there` — the application (`projects/shot-there/src/app/` holds
    `core/` and `features/<area>/`).
  - `api` — the API library, imported as `@shot-there/api`.
  - `components` — the UI component library, imported as
    `@shot-there/components`.
  Import libraries only through their `@shot-there/*` path alias, which maps
  to each library's `src/public-api.ts`; export everything a library offers
  from that file. Name the project in CLI commands (`ng serve shot-there`,
  `ng build api`).
- Playwright acceptance tests live in `frontend/e2e/` (specs, `pages/` page
  objects, `fakes/` for faked API responses), with `frontend/playwright.config.ts`.
- Frontend business rules (validation messages, eligibility, view models, URL
  state) live in plain TypeScript beside the page, never in templates or
  library components. The server remains the authority for every rule.
- Services that talk to the backend live in the `api` library. The
  contract is `abstract class FooService` in `foo.service.ts` and is its own DI
  token; the implementation is `class HttpFooService extends FooService` in
  `http-foo.service.ts`. Register `{ provide: FooService, useClass:
  HttpFooService }`; pages inject `FooService`, never the implementation.
- Dependency direction: `features/<area>` → `core` → libraries.
- All user-facing text is marked for Angular i18n; lint fails on unmarked
  template text.
- Routes live in `features/<area>/routes.ts`. App paths and page titles come
  from one central place; never type a path or title suffix inline.
- Read design tokens by role, never by hex value.
- Keep component styles encapsulated and global styles limited to shared
  foundations and utilities.
- One type per file: each class, interface, type alias and enum gets its own
  kebab-case file. Never put two classes in one file.
- No single-file components: every component keeps its template in
  `<file>.html` (`templateUrl`) and any styles in `<file>.css` (`styleUrl`),
  never inline `template` or `styles`.
- No inline forms in pages. Button-triggered editing opens a dialog or
  navigates to a screen. Use the UI framework's accessible dialog/overlay
  primitives; don't hand-roll modals.
- Mobile first: every screen must work at phone width without horizontal
  scrolling and respect device safe areas.
- Meet WCAG 2.2 AA.

## Scope, Simplicity, and Zero-Waste Engineering (CRITICAL)

This is the absolute highest-priority rule in this repository. AI agents tend to over-engineer, hallucinate future needs, and balloon codebase complexity. This kills project velocity and comprehensibility. You must resist this impulse. Deliver radically simple solutions that fulfill the exact prompt—nothing more.

### 1. Absolute Scope Lock
*   **Deliver Only the Explicit Request:** Implement exactly what is asked for in the immediate task. Do not invent features, add unrequested states, create predictive API endpoints, or spin up new UI screens/components unless explicitly ordered.
*   **Zero Future-Proofing:** Do not write code for "imagined future use cases." Write code strictly for the present moment. If the user didn't ask for it today, it does not exist.
*   **Ignore Unsent Requirements:** Documents, specs, or mocks may contain broader context or future phases. Do not implement them early. Only implement what is requested in the active prompt.

### 2. Radical Simplicity & Proportionality
*   **Proportional Diffs:** The size and footprint of your code change must match the size of the request. A small feature or fix must result in a small, clean, readable diff.
*   **Path of Least Resistance:** Always choose the simplest, most direct code path that solves the problem. Do not introduce new abstractions, architectural layers, design patterns, wrappers, or external libraries unless it is physically impossible to solve the issue without them.
*   **No Unsolicited Refactoring:** Do not "improve," rewrite, or clean up code adjacent to your task unless it is strictly broken and blocking your implementation. Leave surrounding code alone.

### 3. Hard Stop & Query Clause
*   **When in Doubt, Ask:** If a task seems to logically require expanding the scope, introduces a major jump in complexity, or conflicts with the existing architecture, **STOP IMMEDIATELY**. Do not guess. Present the trade-offs to the user and await explicit confirmation before writing a single line of code.

## Incremental Implementation and ATDD - mandatory

Mocks and the design system are design artifacts. ATDD does not apply to their
development. Do not write tests for mocks or the design system.

Every new feature or change to production behavior MUST have a requirement, a
detailed design, and a mock before implementation begins. This includes
behavioral changes to existing features, such as changing how a page behaves.
This requirement applies to production-code changes only; documentation-only,
design-system-only, mock-only, and test-only changes are out of scope unless
they are part of implementing a production behavior change.

Every production behavior implementation MUST invoke and follow the
`implementing-incrementally` skill (`.claude/skills/implementing-incrementally`
and `.agents/skills/implementing-incrementally`) before any code is written,
combined with acceptance test-driven development (ATDD). Plan small,
reviewable slices, then complete one slice at a time: write Given-When-Then
acceptance criteria, write the acceptance test, and run it to prove it fails for
the expected reason BEFORE writing production code. Implement only what satisfies
that slice, refactor with tests green, and run the relevant regression checks.
Do not move to the next slice until those checks pass. No bulk implementation,
no tests added afterward, and no weakening tests to manufacture a pass. Keep
the requirement, detailed design, mock, criteria, tests, and implementation
aligned until the entire feature or behavior change is complete.

Front end tests use Playwright with the Page Object Model - one page object per
screen, owning the selectors and the interactions. Tests state intent; page
objects know the DOM. Never put a selector in a test.

Frontend tests never need the backend running: fake every API response with
Playwright route interception (`frontend/e2e/fakes/`). The `e2e` build
configuration renders in the browser so every `/api` call can be faked.

Run frontend tests in Chromium only. Do not configure or run Firefox, WebKit,
or any other browser for frontend testing.

### Never write architecture tests

Never add a test that asserts the shape of the codebase rather than its behavior:
no structure, layout, or naming tests; no banned-API scans; no traceability tests
that parse the specifications. Those constraints belong to the compiler, the
formatter, and review. A test suite exists to prove behavior.

## Skills

Project skills live in `.claude/skills/` and are mirrored in `.agents/skills/`
for other agents. Keep the two copies identical.

- `engineering-requirements` — L1/L2 requirements with acceptance criteria
- `writing-software-design-documents` — detailed designs from requirements
- `writing-html-mocks` — static HTML mocks for every page, dialog and
  notification in every state
- `extracting-design-systems` — design system from the HTML mocks
- `writing-component-requirements-documents` — CRDs for UI components
- `implementing-incrementally` — thin, verifiable slices (mandatory, see above)
- `creating-videos` — narrated walkthrough videos
