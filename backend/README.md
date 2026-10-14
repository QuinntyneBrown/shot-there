# ShotThere backend

The Next.js API (route handlers only) behind the ShotThere site, backed by PostgreSQL through Prisma and an
S3-compatible bucket for images. Every endpoint, body, header and error follows the interface control document
[ICD-001](../docs/icd/backend-frontend-api.md); a difference between the two is a defect in the code.

## Set up

```sh
npm install
cp .env.example .env   # then fill in the values
npm run prisma:generate
```

Every variable is documented in `.env.example`: `DATABASE_URL`, `SITE_ORIGIN` (the origin admin requests must come
from), the `STORAGE_*` bucket settings with `IMAGE_CDN_BASE_URL`, and the optional `MAP_PROVIDER_ORIGIN`.

## Database

```sh
npx prisma migrate deploy
```

applies the migrations in `prisma/migrations`. Then create or reset the single owner account:

```sh
OWNER_EMAIL=owner@example.com OWNER_PASSWORD='a long passphrase' npm run owner:set-password
```

## Run

```sh
npm run dev      # development server
npm run build    # production build
npm start
```

`GET /api/health` answers `{"status":"ok"}`, or `503 {"status":"degraded"}` when the database is unreachable.

## Test

```sh
npm test
npm run typecheck
npm run lint
```

The tests are acceptance tests that call the route handlers directly. They run against in-memory fakes of the
database and object store (`tests/support/`) and never touch a real database or the network.
