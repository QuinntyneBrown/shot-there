<h1 align="center">ShotThere</h1>

<p align="center">
  <strong>Toronto's places to shoot photos, reviewed first-hand and compared side by side.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-141312.svg"></a>
  <img alt="Angular" src="https://img.shields.io/badge/frontend-Angular-141312.svg">
  <img alt="Next.js" src="https://img.shields.io/badge/backend-Next.js-141312.svg">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/database-PostgreSQL-141312.svg">
  <a href="CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-141312.svg"></a>
</p>

<p align="center">
  <a href="#about">About</a> ·
  <a href="#features">Features</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#repository-layout">Layout</a> ·
  <a href="#documentation">Documentation</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#license">License</a>
</p>

---

## About

ShotThere is a review and comparison site, with a companion YouTube channel,
for places to shoot photos in Toronto: rental studios first, then outdoor
spots. Every location is reviewed first-hand with the same measurements and the
same standard test setup, so any two locations compare on identical data.

**Nothing is listed unless it has been shot there.**

This repository is the full web solution: an Angular frontend (a
server-rendered public site plus an owner-only administration area) and a
Next.js backend API on PostgreSQL.

### Principles

- **First-hand only.** No user-submitted listings or reviews. Every published
  location has been shot at by the reviewer.
- **Same test, every time.** Standard measurements and standard test shots
  make side-by-side comparison meaningful.
- **Honest and disclosed.** Every review says whether the session was paid for
  or comped. Scores are never bought, there is no paid placement, and negative
  findings are published alongside positive ones.
- **Fresh data, dated.** Every price and permit carries the date it was last
  verified, and anything older than six months is visibly flagged.
- **Mobile first and accessible.** Every screen works at phone width and meets
  WCAG 2.2 AA.
- **Cheap to run.** The public site is static or cached output behind a CDN.

## Features

- **Studio reviews** with basics, the all-in cost of a standard 2-hour shoot,
  measured specs, included gear, logistics, standard test shots, a real-shoot
  gallery, a scored verdict and the YouTube episode.
- **Outdoor spot pages** with a map, directions, best light by time and
  season, sample shots with lens notes, practical conditions, a dated permit
  status and rain-backup studios.
- **Browse, filter and sort**, with the current view held in a shareable URL.
- **Map view** of every published location.
- **Side-by-side comparison** of two to four studios, shareable and usable on
  a phone.
- **"Best for" guides** built from review data.
- **Email signup** with validation and abuse protection.
- **Owner administration** to create, edit, publish and unpublish studios,
  spots and guides without code changes.
- **Search-friendly** server-rendered pages with structured data, metadata and
  a sitemap.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (current LTS) with npm
- [PostgreSQL](https://www.postgresql.org/) for the backend database

### Run the app locally

```sh
git clone https://github.com/QuinntyneBrown/shot-there.git
cd shot-there

npm install --prefix backend
npm install --prefix frontend

# Backend: set DATABASE_URL, then apply migrations and the seed
cd backend
npm run migrate
npm run seed
npm run dev

# Frontend, in a second terminal
cd frontend
npm start
```

See [`backend/README.md`](backend/README.md) for every environment variable and
[`frontend/README.md`](frontend/README.md) for frontend conventions and ports.

### Run the tests and checks

```sh
cd backend
npm test           # acceptance tests against the API
npm run typecheck

cd ../frontend
npm run e2e        # Playwright acceptance suite (Chromium only)
npm run lint
npm run typecheck
```

## Repository layout

```
shot-there/
├── backend/        HTTP API: Next.js, Prisma and PostgreSQL
├── frontend/       Angular workspace (standalone, signals, zoneless, SSR)
│   ├── src/app/features/   one folder per product area, each with routes.ts
│   ├── src/app/core/       auth, SEO and app-wide services
│   ├── src/server/         SSR server: sitemap, redirects, cache headers
│   ├── libs/               API and design-system component libraries
│   └── e2e/                Playwright acceptance suite (page objects)
├── docs/
│   ├── specs/              L1/L2 requirements
│   ├── detailed-designs/   detailed designs per feature
│   ├── estimates/          estimates per feature
│   └── design-system/      tokens, foundations, components and patterns
├── .claude/skills/ project skills (mirrored in .agents/skills/)
└── AGENTS.md       working agreement for contributors and coding agents
```

## Documentation

- **Requirements:** [`docs/specs/`](docs/specs/) ([L1](docs/specs/L1.md), [L2](docs/specs/L2.md))
- **Designs:** [`docs/detailed-designs/`](docs/detailed-designs/)
- **Estimates:** [`docs/estimates/`](docs/estimates/)
- **Design system:** [`docs/design-system/`](docs/design-system/), open `docs/design-system/index.html` in a browser
- **Working agreements for contributors and coding agents:** [`AGENTS.md`](AGENTS.md)

## Contributing

Contributions are welcome. ShotThere works requirement first: every change to
production behaviour starts with a requirement, a detailed design and a mock,
and is built in small slices with acceptance tests written first. Read
[CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Report a bug or ask for a feature in [GitHub Issues](https://github.com/QuinntyneBrown/shot-there/issues).
- Get help with the project: see [SUPPORT.md](SUPPORT.md).
- Report a security vulnerability privately: see [SECURITY.md](SECURITY.md).
- See who has helped: [CONTRIBUTORS.md](CONTRIBUTORS.md).

Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

ShotThere is released under the [MIT License](LICENSE).

Seed data is fictional. Any resemblance to real businesses is coincidental.
