# @shot-there/api

The ShotThere API library: one abstract service per backend resource (its own DI token), its `Http*` implementation, and the DTOs it returns. Everything public is exported from `src/public-api.ts`.

Build it on its own with `ng build api`; the app compiles it from source through the `@shot-there/api` path alias.
