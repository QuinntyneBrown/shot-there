# Contributing to ShotThere

Thank you for wanting to help photographers find the right place to shoot in
Toronto. This guide explains how to propose a change and what a pull request
needs before it can be merged.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Before you start](#before-you-start)
- [Development setup](#development-setup)
- [How we build: requirement first, test first](#how-we-build-requirement-first-test-first)
- [Coding conventions](#coding-conventions)
- [Testing](#testing)
- [Commit messages](#commit-messages)
- [Pull requests](#pull-requests)
- [Reporting bugs and requesting features](#reporting-bugs-and-requesting-features)
- [Security issues](#security-issues)
- [License](#license)

## Ways to contribute

- Report a bug or suggest an improvement in
  [GitHub Issues](https://github.com/QuinntyneBrown/shot-there/issues).
- Improve requirements, designs, mocks or documentation.
- Pick up an open issue.
- Review open pull requests.

ShotThere does not accept location submissions or reviews: nothing is listed
unless the reviewer has shot there. Tips about studios or spots worth
reviewing are welcome as issues.

## Before you start

- **Read [`AGENTS.md`](AGENTS.md).** It is the working agreement for everyone
  who changes this repository, people and coding agents alike.
- **Open or find an issue first** for anything larger than a typo, so the
  approach can be agreed before you invest time in it.
- **Keep scope tight.** Deliver exactly what the issue asks for, with the
  simplest code that does it. No speculative features or unrequested
  refactoring.

## Development setup

You need Node.js (current LTS) and PostgreSQL.

```sh
git clone https://github.com/<your-username>/shot-there.git
cd shot-there
npm install --prefix backend
npm install --prefix frontend
```

See [README.md](README.md#getting-started), [`backend/README.md`](backend/README.md)
and [`frontend/README.md`](frontend/README.md) for every command and setting.

## How we build: requirement first, test first

Every change to production behaviour, including a change to how an existing
page behaves, follows the same path:

1. **Requirement.** Add or update the L1/L2 requirement in
   [`docs/specs/`](docs/specs/), with acceptance criteria.
2. **Detailed design** in [`docs/detailed-designs/`](docs/detailed-designs/).
3. **Mock** for every page, dialog and notification the change touches, in
   every state.
4. **Implement incrementally with acceptance tests first (ATDD).** Plan small,
   reviewable slices. For each slice: write Given-When-Then criteria, write the
   acceptance test, run it and see it fail for the expected reason, then write
   only the code that makes it pass. Refactor with the tests green and run the
   regression checks before the next slice.

Documentation-only, design-system-only, mock-only and test-only changes do not
need this path. Mocks and the design system are design artifacts and do not
get tests.

The project skills in `.claude/skills/` describe each step in detail. They are
mirrored in `.agents/skills/`; keep the two copies identical.

## Coding conventions

The full list is in [`AGENTS.md`](AGENTS.md). The ones reviewers check most:

**Product**

- Publish only locations that have been shot at, with the standard
  measurements and test shots.
- Every price and permit field stores the date it was last verified.
- Every review discloses whether the session was paid for or comped.
- The server is the authority for every rule.

**Frontend**

- Pages inject abstract service classes (`FooService`), never the `Http…`
  implementations.
- Business rules live in plain TypeScript beside the page, never in templates.
- One type per file, in a kebab-case file.
- Every component keeps its template and styles in separate files.
- No inline forms in pages: editing opens a dialog or a separate screen.
- Mark all user-facing text for Angular i18n; lint fails otherwise.
- App paths and page titles come from one central place.
- Use design tokens by role, never by hex value.
- Mobile first, and WCAG 2.2 AA.

## Testing

```sh
cd backend
npm test            # acceptance tests against the API
npm run typecheck

cd ../frontend
npm run e2e         # Playwright, Chromium only
npm run lint
npm run typecheck
```

- **Frontend:** Playwright with the Page Object Model, one page object per
  screen. Tests state intent; page objects own the selectors. Never put a
  selector in a test.
- Run frontend tests in Chromium only.
- Do not write architecture tests (structure, naming, banned-API scans or
  specification parsing). Tests prove behaviour.
- Never skip, disable or weaken a test to get a green build.

## Commit messages

Write a short summary line in the imperative mood that says what changes for
the people who use ShotThere, for example:

```
Flag studio prices verified more than six months ago
```

Add a body when the reason is not obvious from the summary. Reference the
issue or requirement it addresses (for example `Fixes #12` or `L2-010`).

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Make your change following the path above, keeping each pull request to one
   reviewable change.
3. Run the tests and checks for every part of the stack you touched.
4. Update documentation if you change the repository layout or an
   architectural rule.
5. Open the pull request and describe what a user sees before and after, and
   how you tested it. Include screenshots at phone width for visible changes.

A pull request is ready to merge when CI is green, review comments are
resolved and a maintainer has approved it. Add yourself to
[CONTRIBUTORS.md](CONTRIBUTORS.md) in your first pull request.

## Reporting bugs and requesting features

- **Bug report:** what happened, what you expected, steps to reproduce, and
  your browser, device and screen width.
- **Feature request:** the problem from a photographer's point of view before
  the solution.

Search existing issues first.

## Security issues

Do not report security vulnerabilities in public issues. Follow
[SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE) that covers this project.
