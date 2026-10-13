# ICD-001: Angular web application ↔ Next.js API

| | |
|---|---|
| **Document** | ICD-001, Interface Control Document |
| **Interface** | ShotThere web application (Angular SSR, `frontend/`) ↔ ShotThere API (Next.js route handlers, `backend/`) |
| **Version** | 1.0 |
| **Status** | Baselined |
| **Date** | 2026-10-13 |
| **Interface owners** | Frontend maintainers (consumer), backend maintainers (provider) |
| **Change authority** | Repository owner. Any change follows [§16 Change control](#16-change-control). |

---

## 1. Purpose and authority

This document is the binding contract between the ShotThere web application
and the ShotThere API. It fixes every endpoint, request, response, header,
cookie, status code, error body, data type and validation rule that crosses
the boundary between them.

- Both sides **MUST** implement this document exactly. A difference between
  the code and this document is a defect in the code.
- Where a detailed design under `docs/detailed-designs/` describes the
  boundary differently, **this document governs**. [Appendix A](#appendix-a-reconciliation-with-detailed-designs)
  lists each such point.
- Requirements in `docs/specs/L2.md` outrank this document. If this document
  conflicts with an L2 requirement, the L2 requirement wins and this document
  is corrected.

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY**
are used as defined in RFC 2119 and RFC 8174.

## 2. Scope

**In scope**

- Every HTTP call from the Angular code (browser, SSR server and build-time
  prerender) to the Next.js API under `/api/*`.
- Cookies the API sets and the browser returns to it.
- Data types (DTOs) carried in those calls, and the enumerations they use.

**Out of scope**

- Page URLs, page HTML and Angular routes, except where an API response
  carries a page path (`SlugRedirectDto.location`, `SitemapEntryDto.path`).
- Calls from the API to PostgreSQL, the object store, and the hosting
  provider's regeneration interface.
- Calls from the browser to YouTube, the map tile provider, and the image CDN.
  The API only supplies the URLs and IDs those calls use.

## 3. References

| ID | Document |
|----|----------|
| R1 | `docs/specs/L1.md`, high-level requirements |
| R2 | `docs/specs/L2.md`, detailed requirements and acceptance criteria |
| R3 | `docs/detailed-designs/`, per-feature detailed designs |
| R4 | `AGENTS.md`, working agreement (API library pattern, i18n, dependency direction) |
| R5 | RFC 9110, HTTP Semantics |
| R6 | RFC 9457, Problem Details for HTTP APIs |
| R7 | RFC 3339, Date and Time on the Internet: Timestamps |
| R8 | RFC 6265, HTTP State Management (cookies) |

## 4. Interface overview

### 4.1 Parties

| Party | Runs | Role on this interface |
|-------|------|------------------------|
| **Browser** | Angular client bundle | Calls the API for list refinements, the email signup, owner sign-in and every administration screen. |
| **SSR server** | `frontend/src/server.ts` (Express + `@angular/ssr`) | Calls the API while rendering public pages, resolving slug redirects and building `/sitemap.xml`. |
| **Prerender** | `ng build` | Calls the API at build time to list public routes and render them. |
| **API** | `backend/` Next.js route handlers | Provider. Sole authority for every business rule and every stored value. |

### 4.2 Topology

```
                       one public origin  (SITE_ORIGIN, HTTPS)
                  ┌──────────────────────────────────────────────┐
  Browser ──────▶ │ CDN                                          │
                  │   /api/*      ───────────────────────────────┼──▶ API (Next.js)
                  │   all other   ──▶ SSR server (Angular) ──────┼──▶ API via API_ORIGIN
                  └──────────────────────────────────────────────┘
  Prerender (build) ─────────────────────────────────────────────────▶ API via API_ORIGIN
```

### 4.3 Who calls what

| Endpoint group | Prerender | SSR server | Browser |
|----------------|:---------:|:----------:|:-------:|
| Public reads (`/api/studios*`, `/api/spots*`, `/api/map/locations`, `/api/compare`, `/api/guides*`) | ✓ | ✓ | ✓ |
| `GET /api/public-routes` | ✓ | | |
| `GET /api/slug-redirects/{type}/{slug}` | | ✓ | |
| `GET /api/sitemap-entries` | | ✓ | |
| `POST /api/subscribers` | | | ✓ |
| `/api/auth/*` | | | ✓ |
| `/api/admin/*` | | | ✓ |
| `GET /api/health` | Operators and monitors only. The Angular code **MUST NOT** call it. | | |

## 5. Transport and connection

| ID | Rule |
|----|------|
| T-1 | All traffic **MUST** use HTTPS in production. The API answers a plain-HTTP request with `301` to the HTTPS URL. |
| T-2 | The browser **MUST** reach the API on the same origin as the pages, at the path prefix `/api`. The CDN (production) and the Angular dev-server proxy (local) route `/api/*` to the API. The API sends no CORS headers, and cross-origin browser calls are unsupported. |
| T-3 | Angular code **MUST** address the API with relative paths that start with `/api/`. On the SSR server and during prerender, one `HttpInterceptorFn` in `core` prefixes the value of the `API_ORIGIN` environment variable. Relative paths keep the `HttpClient` transfer-cache keys identical on server and browser, so hydration does not refetch. |
| T-4 | The SSR server and prerender **MUST NOT** call `/api/auth/*` or `/api/admin/*`, and **MUST NOT** forward a browser's `Cookie` header to the API. Administration routes therefore render in the browser (`RenderMode.Client`). |
| T-5 | Allowed methods are `GET`, `POST`, `PUT` and `DELETE`. A method a route does not support answers `405` with an `Allow` header. |
| T-6 | API paths have no trailing slash. Clients **MUST NOT** add one. |
| T-7 | The SSR server **SHOULD** send `X-Correlation-Id` on its API calls (see [§11](#11-observability)). |

Environment variables that configure this interface:

| Variable | Side | Meaning |
|----------|------|---------|
| `SITE_ORIGIN` | Both | Public origin, for example `https://<TO SUPPLY>`. The frontend builds canonical URLs from it, and the API checks `Origin` against it. |
| `API_ORIGIN` | Frontend server | Base URL the SSR server and prerender use to reach the API, for example `http://localhost:3000`. It is never sent to the browser. |

## 6. Common conventions

### 6.1 Media types and encoding

| ID | Rule |
|----|------|
| C-1 | Request and response bodies are JSON, encoded as UTF-8. JSON requests carry `Content-Type: application/json`. Any other request media type on a JSON endpoint answers `415`. The image upload is the only exception: it uses `multipart/form-data`. |
| C-2 | Successful responses use `Content-Type: application/json; charset=utf-8`. Error responses use `application/problem+json` ([§9](#9-errors)). |
| C-3 | `204` responses and `401` responses have an empty body. |

### 6.2 Field naming and presence

| ID | Rule |
|----|------|
| C-4 | JSON property names are `camelCase`. |
| C-5 | Enumeration **values** are lowercase `snake_case` strings, such as `paid_in_full` and `freight_elevator` ([§14](#14-enumerations)). |
| C-6 | Every property this document defines on a **response** type is always present. A missing value is `null`, never an omitted key. An empty list is `[]`, never `null`. |
| C-7 | On a **request** type, a property is optional only where this document marks it with `?`. Every other property **MUST** be present, though it may be `null` where the type allows. |
| C-8 | The frontend **MUST** ignore unknown response properties (tolerant reader). The API **MUST** reject unknown request properties on every write endpoint ([§8.6](#86-input-handling)). |

### 6.3 Scalar formats

| Type alias | Wire format | Example |
|------------|-------------|---------|
| `Slug` | Lowercase letters and digits in hyphen-separated words, matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`, at most 100 characters | `the-junction-loft` |
| `Id` | Opaque string of at most 64 characters, assigned by the API. Clients **MUST NOT** parse or construct it. | `"clx3k…"` |
| `IsoDate` | Calendar date `YYYY-MM-DD`, read in the `America/Toronto` time zone | `"2026-04-30"` |
| `IsoDateTime` | RFC 3339 instant in UTC with a `Z` suffix and millisecond precision | `"2026-10-13T14:05:00.000Z"` |
| `Cad` | JSON number in Canadian dollars, 0 or more, with at most 2 decimal places | `145`, `91.5` |
| `Metres` | JSON number in metres, greater than 0, with at most 2 decimal places | `6.1` |
| `Url` | Absolute `https` or `http` URL, at most 2,048 characters | `"https://example.com/book"` |

| ID | Rule |
|----|------|
| C-9 | "Today" for every date rule (staleness, no future dates, default verification dates) is the current date in `America/Toronto`. |
| C-10 | Money is always in Canadian dollars, so no currency code is sent. The frontend formats money for `en-CA` and **MUST NOT** perform arithmetic on it. |
| C-11 | Lengths are always sent in metres. The frontend converts to feet for display. |
| C-12 | Public responses identify content by `Slug` and never expose an `Id`. Administration responses identify content by `Id`. |

### 6.4 Text

| ID | Rule |
|----|------|
| C-13 | Stored text is plain text. Newlines are allowed in long-text fields. Neither side interprets HTML in stored text. The frontend renders it through Angular interpolation and **MUST NOT** bind it to `innerHTML`. |
| C-14 | The API trims every incoming string. After trimming, an empty string becomes `null` on a nullable field and fails with `required` on a non-nullable field. |
| C-15 | The API sends **data, not display text**. The only human-readable strings in responses are owner-entered content (names, notes, verdicts). Labels, units, status words and sentences such as "Prices may be out of date" or "Required" are built by the frontend from enumerations and flags, and marked for i18n. |

### 6.5 Collections and order

| ID | Rule |
|----|------|
| C-16 | Collection endpoints return a bare JSON array. The catalogue is small, so no endpoint paginates. |
| C-17 | Array order is significant wherever this document gives one. In request bodies, an item's array index is its position. |
| C-18 | When a sort leaves a tie, the API breaks it by `reviewedAt` descending, then by `slug` ascending, so the order is deterministic. |

### 6.6 Query parameters

| ID | Rule |
|----|------|
| C-19 | A multi-value parameter repeats its key (`hood=leslieville&hood=junction`). The exception is `GET /api/compare`, whose `studios` value is comma-separated, as L2-032 requires. |
| C-20 | Boolean query parameters are on only when their value is exactly `true`. |
| C-21 | **Public** read endpoints are lenient. They ignore unknown parameters and unknown values, apply the remaining valid ones, and never answer `400` because of a query value (L2-025). |
| C-22 | **Administration** endpoints are strict. An invalid query value answers `400`. |

## 7. Server-owned values

The API computes the following values on every read. The frontend **MUST**
display them as received and **MUST NOT** compute, round or adjust them.

| Value | Rule | L2 |
|-------|------|----|
| `allInCost2h` | `hourlyRate × max(2, minBookingHours)` plus the sum of mandatory fee amounts, rounded half up to cents | L2-004 |
| `overallScore` | Mean of the six rubric scores, rounded half up to one decimal place | L2-011 |
| `priceStale`, `permitStale`, `stale` | `true` when the verification date is more than 183 days before today. A date exactly 183 days old is not stale. | L2-043 |
| `group` (`due_soon`) | Verification age from 153 to 183 days inclusive | L2-044 |
| `distanceKm` | Haversine straight-line distance, rounded to one decimal place | L2-037 |
| `isLowestAllInCost` | `true` on every compared studio whose `allInCost2h` equals the lowest in the comparison | L2-031 |
| `slug` | Derived from the name on create, made unique with `-2`, `-3` and onward | L2-054, L2-075 |
| Published-only filtering | Public endpoints never return draft content or content that points at it | L2-001 |

Every response that carries `allInCost2h` also carries `priceStale` for the same studio.

## 8. Security

### 8.1 Cookies

The API sets both cookies on a successful sign-in and clears both on
sign-out. Neither cookie has a `Domain` attribute, so both are host-only.

| Cookie | Value | Attributes | Read by |
|--------|-------|------------|---------|
| `st_session` | Opaque random session token | `HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=604800` | The API only. With `Path=/api` the browser never sends it to the SSR server. |
| `st_csrf` | Random anti-forgery token tied to the session | `Secure; SameSite=Lax; Path=/; Max-Age=604800` (not `HttpOnly`) | Angular's XSRF interceptor, which copies it into `X-CSRF-Token` |

The session identifier **MUST NOT** appear in any response body, URL or log line (L2-051).

### 8.2 Session lifetime

| Rule | Value |
|------|-------|
| Idle timeout | 12 hours since the last authenticated request (L2-051) |
| Absolute timeout | 7 days since sign-in, even when active (L2-051) |
| Sign-out | Deletes the session on the server. A reused old cookie is rejected. |
| Expired or invalid session on `/api/admin/*` | `401` with an empty body and no data, before any read or write (L2-052, L2-079) |

### 8.3 Cross-site request forgery

| ID | Rule |
|----|------|
| S-1 | The frontend registers `provideHttpClient(withFetch(), withXsrfConfiguration({ cookieName: 'st_csrf', headerName: 'X-CSRF-Token' }))`. Angular then sends the header on every relative-URL `POST`, `PUT` and `DELETE`. |
| S-2 | Every `POST`, `PUT` and `DELETE` under `/api/admin/*`, and `POST /api/auth/sign-out`, **MUST** carry `X-CSRF-Token` equal to the session's token (compared in constant time) and an `Origin` header equal to `SITE_ORIGIN`. A missing or mismatched token or origin answers `403` (`csrf-rejected`). |
| S-3 | `POST /api/auth/sign-in` **MUST** carry `Origin` equal to `SITE_ORIGIN`. Any other origin answers `403`. |
| S-4 | Order of checks on an administration write: HTTPS → body size → session (`401`) → CSRF (`403`) → schema (`400`) → existence (`404`) → business rules (`409`, `422`). The first failing check decides the response. |

### 8.4 Security headers

The API and the SSR server both set these headers on every response, from
the shared constant `securityHeaders` (L2-080):

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Includes `script-src 'self'` and `frame-src https://www.youtube-nocookie.com <map provider origin>`. The map provider origin is `<TO SUPPLY>`. |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |

### 8.5 Limits

| Limit | Value | Response when exceeded |
|-------|-------|------------------------|
| JSON request body | 1 MB, measured on the stream, not only `Content-Length` | `413` |
| Image upload body | 20 MB | `413` |
| Email signup | 6 requests per client per minute. The 7th answers `429`. | `429` with `Retry-After` |
| Sign-in failures per client | 5 in 15 minutes. The 6th attempt answers `429`. | `429` with `Retry-After` |
| Sign-in failures per account | 10 in 15 minutes from any clients. The 11th attempt answers `429`. | `429` with `Retry-After` |

`Retry-After` is a whole number of seconds.

### 8.6 Input handling

| ID | Rule |
|----|------|
| S-5 | Every write endpoint validates its body against a strict schema ([§15](#15-request-validation-rules)). It rejects unknown properties, wrong types, out-of-range values and oversized payloads, whatever the client already checked (L2-078). |
| S-6 | Client-side validation is a convenience only. The frontend **MUST** still handle every `400` the API can return for that endpoint. |

### 8.7 Data exposure

| ID | Rule |
|----|------|
| S-7 | Public endpoints **MUST NOT** return draft content, owner email, password hash, session data, subscriber data or internal `Id` values (L2-001, L2-079). |
| S-8 | Public endpoints include only images whose alt text is not empty. |
| S-9 | Error bodies **MUST NOT** contain stack traces, SQL, internal identifiers or connection details (L2-079, L2-083). |
| S-10 | `OwnerSessionState` reveals only whether a session exists, never who holds it. |

## 9. Errors

### 9.1 Status codes

| Status | Meaning on this interface | Body |
|--------|---------------------------|------|
| `200` | Success with a body | DTO |
| `201` | Created. Carries a `Location` header naming the new resource's API path. | DTO |
| `204` | Success with no body | empty |
| `301` | Plain HTTP in production. The redirect goes to the HTTPS URL. | empty |
| `400` | Request failed validation | `ProblemDetails` (`validation-failed`) |
| `401` | No valid owner session, or sign-in credentials are wrong | **empty** |
| `403` | Anti-forgery or origin check failed | `ProblemDetails` (`csrf-rejected`) |
| `404` | Unknown route, unknown or draft slug, or unknown `Id` | `ProblemDetails` (`not-found`) |
| `405` | Method not supported on the route | empty, with `Allow` |
| `409` | Request conflicts with the item's state | `ProblemDetails` (`conflict`) |
| `413` | Body too large | `ProblemDetails` (`payload-too-large`) |
| `415` | Wrong request media type | `ProblemDetails` (`unsupported-media-type`) |
| `422` | Publish refused because the standard data set is incomplete | `ProblemDetails` (`publish-incomplete`) |
| `429` | Rate limit reached | `ProblemDetails` (`rate-limited`), with `Retry-After` |
| `500` | Unhandled server error | `ProblemDetails` (`internal-error`) |
| `503` | Health check only: the data store is unreachable | `HealthStatus` |

### 9.2 Problem details body

Error responses follow RFC 9457 with `Content-Type: application/problem+json`.

```ts
interface ProblemDetails {
  type: ProblemType;        // stable identifier; the frontend switches on this
  title: string;            // short English summary for logs; never shown to users
  status: number;           // same as the HTTP status
  detail: string | null;    // English diagnostic text; never shown to users
  correlationId: string;    // same value as the X-Correlation-Id header
  errors: FieldError[];     // non-empty only for validation-failed
  missingFields: string[];  // non-empty only for publish-incomplete
}

interface FieldError {
  field: string;            // dot path into the request, e.g. "fees.0.amount"; "" for the whole body
  code: FieldErrorCode;
  message: string;          // English diagnostic text; never shown to users
}
```

| `ProblemType` | Status | Used when |
|---------------|--------|-----------|
| `urn:shotthere:problem:validation-failed` | 400 | Schema or field rule failed, including unparsable JSON (`field: ""`, `code: invalid_format`) |
| `urn:shotthere:problem:csrf-rejected` | 403 | Rule S-2 or S-3 failed |
| `urn:shotthere:problem:not-found` | 404 | Unknown route, slug or `Id` |
| `urn:shotthere:problem:conflict` | 409 | Delete of a published item, or removal of the last test shot of a published studio |
| `urn:shotthere:problem:payload-too-large` | 413 | [§8.5](#85-limits) |
| `urn:shotthere:problem:unsupported-media-type` | 415 | Rule C-1 |
| `urn:shotthere:problem:publish-incomplete` | 422 | Publish refused. `missingFields` lists the keys from [§15.5](#155-standard-data-set-publish-check). |
| `urn:shotthere:problem:rate-limited` | 429 | [§8.5](#85-limits) |
| `urn:shotthere:problem:internal-error` | 500 | Any unhandled error |

### 9.3 Field error codes

The frontend turns a `(field, code)` pair into an i18n-marked message in the
page's messages file, such as `studio-editor-messages.ts`. It **MUST NOT**
show `message`, `title` or `detail` to users.

| `FieldErrorCode` | Meaning | Example that produces it |
|------------------|---------|--------------------------|
| `required` | Missing, `null` or empty where a value is required | Image without alt text: `gallery.0.alt` → "Describe this image" |
| `required_while_published` | The save would clear a standard-data-set field of a published item (L2-002 AC4) | `ceilingHeight: null` on a published studio |
| `invalid_type` | Wrong JSON type | `hourlyRate: "abc"` (L2-078) |
| `invalid_format` | Malformed email, URL, slug, date or decimal places, or unparsable JSON | `bookingUrl: "ftp://x"` |
| `invalid_value` | Value outside a fixed set, or an image list that does not match the attached set | Tampered spot `type` (L2-055 AC3) |
| `out_of_range` | Number, string length or list size outside its bounds | `hourlyRate: -5`, score `6`, latitude `95`, a 255-character email |
| `date_in_future` | A verification date after today | `priceVerifiedAt: "2099-01-01"` (L2-042) |
| `unrecognized_key` | A property the schema does not declare. `field` is that property's path. | `isSponsored` (L2-078) |
| `duplicate` | A repeated value in a set that must be unique | The same studio twice in a guide (L2-060) |
| `already_in_use` | The slug belongs to another item of the same type | Slug change on update |
| `not_found` | A referenced `Id` does not exist | Guide entry `locationId`, image `imageId` |
| `invalid_video_link` | Not an accepted YouTube URL or ID (L2-059) | `https://example.com/video` |
| `unsupported_image_type` | Image content is not JPEG, PNG, WebP or AVIF, judged by inspecting the content (L2-057) | `.svg`, `.exe` |
| `image_type_mismatch` | The detected content type differs from the declared one (L2-057 AC5) | PNG bytes sent as `image/jpeg` |

## 10. Caching and freshness

| Response class | `Cache-Control` |
|----------------|-----------------|
| Public `GET` (`200` and `404`), including `/api/public-routes`, `/api/slug-redirects/*` and `/api/sitemap-entries` | `public, max-age=60` |
| `/api/auth/*`, `/api/admin/*`, `POST /api/subscribers`, `/api/health`, every non-`GET` | `no-store` |
| Image variant URLs (served by the object store through the CDN, not the API) | `public, max-age=31536000, immutable`. The URL contains a content hash, so it changes when the image changes. |

A published change appears on the public site within 60 seconds (L2-073,
L2-056). After a publish, the API triggers regeneration of the affected
routes. The 60-second lifetime above guarantees convergence even when a
purge is missed.

## 11. Observability

| ID | Rule |
|----|------|
| O-1 | Every API response carries `X-Correlation-Id`. |
| O-2 | When a request carries an `X-Correlation-Id` that is a UUID, the API reuses it. Otherwise the API generates a UUID v4. |
| O-3 | `ProblemDetails.correlationId` equals the response header. |
| O-4 | The SSR server **SHOULD** send one correlation ID per page render on all of that render's API calls and write it in its own logs. |

## 12. Endpoint catalogue

### 12.1 Summary

| # | Method and path | Auth | Request | Success | Frontend service (`libs/api`) |
|---|-----------------|------|---------|---------|-------------------------------|
| E1 | `GET /api/studios` | — | `StudioListQuery` | `200 StudioSummary[]` | `StudiosService.listStudios` |
| E2 | `GET /api/studios/{slug}` | — | — | `200 StudioDetailDto` | `StudioService.getStudio` |
| E3 | `GET /api/spots` | — | `SpotListQuery` | `200 SpotSummary[]` | `SpotsService.listSpots` |
| E4 | `GET /api/spots/{slug}` | — | — | `200 SpotDetailDto` | `SpotsService.getSpot` |
| E5 | `GET /api/map/locations` | — | — | `200 MapLocation[]` | `MapLocationsService.listMapLocations` |
| E6 | `GET /api/compare` | — | `?studios=` | `200 ComparisonDto` | `CompareService.getComparison` |
| E7 | `GET /api/guides` | — | — | `200 GuideSummaryDto[]` | `GuideService.listGuides` |
| E8 | `GET /api/guides/{slug}` | — | — | `200 GuideDto` | `GuideService.getGuide` |
| E9 | `POST /api/subscribers` | — | `SubscribeRequest` | `200` empty | `SubscriberService.subscribe` |
| E10 | `GET /api/public-routes` | — | — | `200 PublicRoutesDto` | `PublicRoutesService` |
| E11 | `GET /api/slug-redirects/{type}/{slug}` | — | — | `200 SlugRedirectDto` | `SlugRedirectService` |
| E12 | `GET /api/sitemap-entries` | — | — | `200 SitemapEntryDto[]` | `SitemapService` |
| E13 | `GET /api/health` | — | — | `200 HealthStatus` | none (operators) |
| E14 | `POST /api/auth/sign-in` | Origin | `SignInRequest` | `204` + cookies | `AuthService.signIn` |
| E15 | `GET /api/auth/session` | cookie (optional) | — | `200 OwnerSessionState` | `AuthService.getSession` |
| E16 | `POST /api/auth/sign-out` | session + CSRF | — | `204` + cleared cookies | `AuthService.signOut` |
| E17 | `GET /api/admin/dashboard` | session | — | `200 AdminDashboard` | `AdminDashboardService.getDashboard` |
| E18 | `GET /api/admin/studios` | session | — | `200 AdminContentRow[]` | `AdminContentService.list('studio')` |
| E19 | `POST /api/admin/studios` | session + CSRF | `StudioInput` | `201 StudioEditorModel` | `StudioEditorService.create` |
| E20 | `GET /api/admin/studios/{id}` | session | — | `200 StudioEditorModel` | `StudioEditorService.get` |
| E21 | `PUT /api/admin/studios/{id}` | session + CSRF | `StudioInput` | `200 StudioEditorModel` | `StudioEditorService.update` |
| E22 | `DELETE /api/admin/studios/{id}` | session + CSRF | — | `204` | `ContentDeletionService.delete('studio', id)` |
| E23 | `POST /api/admin/studios/{id}/publish` | session + CSRF | — | `200 PublicationStatusDto` | `PublishingService.publish('studio', id)` |
| E24 | `DELETE /api/admin/studios/{id}/publish` | session + CSRF | — | `200 PublicationStatusDto` | `PublishingService.unpublish('studio', id)` |
| E25 | `GET /api/admin/spots` | session | — | `200 AdminContentRow[]` | `AdminContentService.list('spot')` |
| E26 | `POST /api/admin/spots` | session + CSRF | `SpotInput` | `201 SpotEditorModel` | `SpotEditorService.create` |
| E27 | `GET /api/admin/spots/{id}` | session | — | `200 SpotEditorModel` | `SpotEditorService.get` |
| E28 | `PUT /api/admin/spots/{id}` | session + CSRF | `SpotInput` | `200 SpotEditorModel` | `SpotEditorService.update` |
| E29 | `DELETE /api/admin/spots/{id}` | session + CSRF | — | `204` | `ContentDeletionService.delete('spot', id)` |
| E30 | `POST /api/admin/spots/{id}/publish` | session + CSRF | — | `200 PublicationStatusDto` | `PublishingService.publish('spot', id)` |
| E31 | `DELETE /api/admin/spots/{id}/publish` | session + CSRF | — | `200 PublicationStatusDto` | `PublishingService.unpublish('spot', id)` |
| E32 | `GET /api/admin/guides` | session | — | `200 AdminContentRow[]` | `AdminContentService.list('guide')` |
| E33 | `POST /api/admin/guides` | session + CSRF | `GuideInput` | `201 GuideEditorModel` | `GuideEditorService.create` |
| E34 | `GET /api/admin/guides/{id}` | session | — | `200 GuideEditorModel` | `GuideEditorService.get` |
| E35 | `PUT /api/admin/guides/{id}` | session + CSRF | `GuideInput` | `200 GuideEditorModel` | `GuideEditorService.update` |
| E36 | `DELETE /api/admin/guides/{id}` | session + CSRF | — | `204` | `ContentDeletionService.delete('guide', id)` |
| E37 | `POST /api/admin/guides/{id}/publish` | session + CSRF | — | `200 PublicationStatusDto` | `GuideEditorService.publish` |
| E38 | `DELETE /api/admin/guides/{id}/publish` | session + CSRF | — | `200 PublicationStatusDto` | `GuideEditorService.unpublish` |
| E39 | `GET /api/admin/guide-candidates` | session | `?q=` | `200 GuideCandidate[]` | `GuideEditorService.searchCandidates` |
| E40 | `POST /api/admin/images` | session + CSRF | multipart | `201 UploadedImageDto` | `ImageService.upload` |
| E41 | `DELETE /api/admin/images/{id}` | session + CSRF | — | `204` | `ImageService.remove` |

Every `/api/admin/*` endpoint can also answer `401`. Every endpoint can also
answer `500`. The per-endpoint tables below list only the other statuses.

### 12.2 Public reads

#### E1 `GET /api/studios`: list and filter published studios

Query parameters (`StudioListQuery`). All are optional and follow rule C-21.

| Parameter | Type | Meaning |
|-----------|------|---------|
| `costMin`, `costMax` | `Cad` | `allInCost2h` range, inclusive. When `costMin > costMax`, both are ignored (L2-025 AC4). |
| `hood` | repeated `Slug` | Neighbourhood, compared as `toSlug(neighbourhood)`. The values combine with OR. |
| `light` | `true` | At least `medium` natural light at any time of day |
| `cyc` | `true` | Has a cyc wall |
| `space` | number > 0 | Minimum usable area in square metres (`usableWidth × usableDepth`) |
| `gear` | repeated `GearFilter` | Included gear category. The values combine with OR. |
| `parking` | `Parking` | Parking type |
| `sort` | `StudioSort` | `recent` (default, `reviewedAt` descending), `cost` (`allInCost2h` ascending) or `score` (`overallScore` descending) |

Different filters combine with AND (L2-022). Rule C-18 breaks ties. No other
factor affects the order (L2-046).

| Status | When |
|--------|------|
| `200` | Always, even when no studio matches (`[]`) |

#### E2 `GET /api/studios/{slug}`: one published studio

| Status | When |
|--------|------|
| `200` | A published studio has this slug |
| `404` | No studio has this slug, or the studio is a draft (L2-001). The page renders the not-found page with status `404`. |

#### E3 `GET /api/spots`: list and filter published spots

| Parameter | Type | Meaning |
|-----------|------|---------|
| `type` | repeated `SpotType` | Spot type. The values combine with OR. |
| `use` | repeated `BestUse` | Best use. The values combine with OR. |
| `permit` | `SpotPermitFilter` | `any` (default) or `none_needed`. `none_needed` keeps spots whose permit status is `not_required` for the shoot type that the selected use case maps to. L2-024 maps `family` to `portrait`. The full mapping is open item OI-6. |

Order is `reviewedAt` descending, with ties broken by rule C-18. Answers `200` always.

#### E4 `GET /api/spots/{slug}`: one published spot

Same statuses as E2. `rainBackup` lists up to three published studios that
have coordinates, nearest first (L2-037). It is `[]` when there are none, and
the page then shows the empty state (L2-038).

#### E5 `GET /api/map/locations`: every published location

Returns every published studio and spot that has coordinates, studios first,
then spots, each group by `slug` ascending. Answers `200` always.

#### E6 `GET /api/compare?studios=a,b`: comparison

| Rule | Behaviour |
|------|-----------|
| Parsing | The API splits `studios` on commas, trims each part, drops empty parts and duplicates (keeping the first), and reads at most 20 slugs. |
| Resolution | Unknown and draft slugs go to `notFoundSlugs` in URL order. |
| Cap | The API keeps the first 4 valid studios in URL order. `truncated` is `true` when more than 4 were valid (L2-032 AC4). |
| Fewer than 2 | `studios` may hold 0 or 1 entries. The page shows the "pick at least two" message (L2-032 AC3). |

Answers `200` in every case above, including a missing `studios` parameter.

#### E7 `GET /api/guides`: published guides

Returns `GuideSummaryDto[]` ordered by most recent publication first (OI-9). Answers `200` always.

#### E8 `GET /api/guides/{slug}`: one published guide

Entries come in their configured order. The API leaves out entries whose
location is a draft (L2-034 AC2) and computes the values on studio entries
when the guide is read (L2-034 AC3). Same statuses as E2.

### 12.3 Email signup

#### E9 `POST /api/subscribers`

Request body: `SubscribeRequest`. The API checks in this order: rate limit, then schema, then honeypot.

| Status | When | Frontend behaviour (L2-039, L2-041) |
|--------|------|-------------------------------------|
| `200` | New address stored, address already subscribed, or honeypot `website` not empty (nothing stored) | Show the same confirmation in every case |
| `400` | Invalid email or `sourcePath` | Mark the field invalid |
| `429` | 7th request from the client within one minute | Ask the visitor to wait a minute |
| `500` | Server failure | Keep the email in the field, show the error, re-enable submit |

The response body is empty. The API stores the email in lowercase, with the
subscription time and `sourcePath` (L2-040).

### 12.4 SSR and build support

#### E10 `GET /api/public-routes`

Returns the published slugs per content type, each list by `slug` ascending.
Prerender's `getPrerenderParams` uses it (L2-087). Answers `200`.

#### E11 `GET /api/slug-redirects/{type}/{slug}`

`type` is a `ContentType` and `slug` is a `Slug`.

| Status | When |
|--------|------|
| `200` | A retired slug maps to the current slug of a published item. The SSR middleware answers `301` to `location`. |
| `400` | `type` or `slug` is malformed |
| `404` | No mapping exists |

The SSR middleware treats any status other than `200` as "no redirect" and
continues to the not-found page. Redirects never chain: `toSlug` is always the current slug.

#### E12 `GET /api/sitemap-entries`

Returns one entry per published studio, spot and guide, plus `/studios`,
`/spots`, `/map` and `/guides`, in that order (L2-077). Answers `200`.

#### E13 `GET /api/health`

| Status | Body | When |
|--------|------|------|
| `200` | `{"status":"ok"}` | The API and data store respond |
| `503` | `{"status":"degraded"}` | The data store is unreachable or slower than 300 ms |

The API answers within 500 ms and never includes connection details (L2-084).

### 12.5 Owner authentication

#### E14 `POST /api/auth/sign-in`

Request body: `SignInRequest`. Rule S-3 applies.

| Status | When | Frontend behaviour |
|--------|------|--------------------|
| `204` | Credentials correct. `Set-Cookie` carries `st_session` and `st_csrf`. | Go to the validated `returnUrl` when it starts with `/admin`, otherwise to the dashboard |
| `400` | Body fails `signInSchema` | Show field messages |
| `401` | Wrong email or password, with an empty body. The response takes as long as the success path, within 100 ms (L2-049). | Show "Email or password is incorrect" and never say which field was wrong |
| `403` | Foreign or missing `Origin` | Show the generic error |
| `429` | Rate limit ([§8.5](#85-limits)) | Tell the owner to wait before trying again |

#### E15 `GET /api/auth/session`

Always answers `200` with `OwnerSessionState`. It never answers `401`. A
valid request refreshes the idle timer.

#### E16 `POST /api/auth/sign-out`

Rule S-2 applies when a valid session exists. Answers `204` and sets both
cookies with `Max-Age=0`. It also answers `204` when no valid session exists.
It answers `403` only when a valid session exists and the CSRF check fails.

#### Frontend handling of `401` from `/api/admin/*`

`adminUnauthorizedInterceptor` sends the owner to the sign-in screen with
`returnUrl` set to the current URL and `reason=expired` (L2-051 AC2, L2-052).

### 12.6 Administration

#### E17 `GET /api/admin/dashboard`

Returns counts by status, and `verification` entries in groups `stale` and
`due_soon`, ordered oldest first (L2-044, L2-053). For a spot,
`permitVerifiedAt` is the verification date.

#### E18, E25, E32 `GET /api/admin/{studios|spots|guides}`

Returns every item of that type, draft and published, by `updatedAt`
descending (L2-063). The frontend searches the loaded list in the browser.
`stale` is always `false` for guides.

#### E19, E26, E33 `POST /api/admin/{studios|spots|guides}`: create

| Status | When |
|--------|------|
| `201` | Created as `draft`. `Location` is `/api/admin/{type}/{id}`. The body holds the final, unique slug (L2-054 AC7). |
| `400` | Validation failed |

When the create body omits `priceVerifiedAt` or `permitVerifiedAt`, the API
sets it to today (L2-042 AC1). Image lists in a create body **MUST** be
empty, because no image can be attached before the item exists.

#### E20, E27, E34 `GET /api/admin/{studios|spots|guides}/{id}`

Returns the item in any status. Answers `404` for an unknown `id`, with no internal detail (L2-079 AC3).

#### E21, E28, E35 `PUT /api/admin/{studios|spots|guides}/{id}`: full replace

| Rule | Behaviour |
|------|-----------|
| Semantics | Full replacement. Every non-optional property is present (rule C-7). |
| `slug` absent | Keeps the current slug |
| `slug` changed on a published item | The API records a slug redirect from the old slug (L2-075 AC2) |
| `priceVerifiedAt` / `permitVerifiedAt` absent | Keeps the stored date (L2-042 AC3) |
| Image lists | Each list **MUST** name exactly the images attached for that role, in the new order. A different set answers `400` with `invalid_value` on the list. |
| Published item | A save that clears a standard-data-set field answers `400` with `required_while_published`, and the stored value stays (L2-002 AC4) |

| Status | When |
|--------|------|
| `200` | Saved. The body is the stored model. |
| `400` | Validation failed |
| `404` | Unknown `id` |

#### E22, E29, E36 `DELETE /api/admin/{studios|spots|guides}/{id}`

| Status | When |
|--------|------|
| `204` | The draft is deleted with its images. Guide entries that pointed at it are removed, and the guides remain (L2-061). |
| `404` | Unknown `id` |
| `409` | The item is published and must be unpublished first |

#### E23, E30, E37 `POST …/{id}/publish` and E24, E31, E38 `DELETE …/{id}/publish`

| Status | When |
|--------|------|
| `200` | Status changed, or already in the requested status (idempotent). The body is `PublicationStatusDto`. |
| `404` | Unknown `id` |
| `422` | Publish only. `missingFields` lists every missing key from [§15.5](#155-standard-data-set-publish-check) (L2-002, L2-045, L2-055, L2-060). The frontend lists each one with a link that focuses its control (L2-056 AC3). |

#### E39 `GET /api/admin/guide-candidates?q=`

`q` is required and holds 1 to 100 characters after trimming. The API
matches names case-insensitively across studios and spots of any status and
returns at most 20 results by name ascending, within 500 ms (L2-060 AC4). An
invalid `q` answers `400`.

#### E40 `POST /api/admin/images`: upload

`multipart/form-data` fields:

| Field | Type | Rule |
|-------|------|------|
| `file` | binary | At most 20 MB. The content must be JPEG, PNG, WebP or AVIF, judged by inspecting the bytes. |
| `role` | `ImageRole` | `test_shot` and `gallery` need `locationKind=studio`. `sample_shot` needs `locationKind=spot`. |
| `locationKind` | `LocationKind` | |
| `locationId` | `Id` | The location must exist |

| Status | When |
|--------|------|
| `201` | Stored under a server-generated name with all variants. The image goes at the end of its role's list with empty alt text, and public pages do not show it until a save gives it alt text (rule S-8). |
| `400` | `unsupported_image_type`, `image_type_mismatch`, or an invalid field |
| `404` | Unknown `locationId` |
| `413` | Body over 20 MB |

The frontend tracks progress with `reportProgress: true`. It **MUST** refuse
files over 20 MB and other formats before sending (L2-057 AC2, AC3), and lets
the owner retry each failed file on its own.

#### E41 `DELETE /api/admin/images/{id}`

| Status | When |
|--------|------|
| `204` | Removed, including its variants |
| `404` | Unknown `id` |
| `409` | The image is the last standard test shot of a published studio (L2-058 AC4) |

## 13. Data types

Both sides declare each type below with the same name and shape: the
backend in `backend/lib/<area>/`, the frontend in `frontend/libs/api/src/`,
one type per kebab-case file. Comments state the constraints the API
guarantees on responses.

### 13.1 Shared

```ts
type Slug = string;
type Id = string;
type IsoDate = string;
type IsoDateTime = string;
type Cad = number;
type Metres = number;
type Url = string;

interface ImageSourceDto {
  format: ImageFormat;           // order in ImageDto.sources: avif, webp, jpeg
  srcset: string;                // "https://…/480.avif 480w, https://…/960.avif 960w, …"
}

interface ImageDto {
  alt: string;                   // non-empty on public responses
  width: number;                 // intrinsic width of the original, px
  height: number;                // intrinsic height of the original, px
  sources: ImageSourceDto[];     // widths 480, 960, 1440, 2048, without upscaling
  fallbackUrl: Url;              // 960 px JPEG
}

interface CaptionedImageDto {
  image: ImageDto;
  caption: string;               // standard setup caption
}

interface SampleShotDto {
  image: ImageDto;
  focalLengthMm: number;         // integer
  angleNote: string;
}

interface EpisodeDto {
  videoId: string;               // 11 characters, [A-Za-z0-9_-]
  title: string;                 // stored episode title, or the location name when none is stored
}

interface DisclosureDto {
  kind: DisclosureKind;
  provider: string | null;       // non-null for discounted and comped
}

interface GuideLinkDto {
  slug: Slug;
  title: string;
}
```

### 13.2 Studios

```ts
interface StudioSummary {
  slug: Slug;
  name: string;
  neighbourhood: string;
  allInCost2h: Cad;
  priceStale: boolean;
  overallScore: number;          // one decimal place
  reviewedAt: IsoDateTime;
  thumbnail: ImageDto;           // first gallery image
}

interface StudioDetailDto {
  slug: Slug;
  basics: StudioBasicsDto;
  pricing: StudioPricingDto;
  specifications: StudioSpecificationsDto;
  gear: StudioGearDto;
  logistics: StudioLogisticsDto;
  testShots: CaptionedImageDto[];  // configured order, at least 1
  gallery: ImageDto[];             // configured order, at least 1
  verdict: StudioVerdictDto;
  disclosure: DisclosureDto;
  episode: EpisodeDto | null;      // null: render no video section (L2-013)
  featuredIn: GuideLinkDto[];      // published guides only; []: render no section (L2-036)
  reviewedAt: IsoDateTime;
  ogImageUrl: Url;                 // 1200 × 630 JPEG crop of the first gallery image (L2-076)
}

interface StudioBasicsDto {
  name: string;
  neighbourhood: string;
  addressOrCrossStreets: string;
  bookingUrl: Url;
}

interface StudioFeeDto {
  name: string;
  amount: Cad;
  mandatory: boolean;
}

interface StudioPricingDto {
  hourlyRate: Cad;
  minBookingHours: number;
  fees: StudioFeeDto[];            // configured order
  allInCost2h: Cad;
  priceVerifiedAt: IsoDate;
  priceStale: boolean;
}

interface NaturalLightDto {
  morning: LightRating;
  midday: LightRating;
  afternoon: LightRating;
  evening: LightRating;
}

interface PowerDto {
  outletCount: number;             // integer
  outletType: string;
  has20aCircuits: boolean;
}

interface StudioSpecificationsDto {
  usableWidth: Metres;
  usableDepth: Metres;
  ceilingHeight: Metres;
  windowDirection: string;
  naturalLight: NaturalLightDto;
  power: PowerDto;
  hasCycWall: boolean;
  cycWallCondition: string | null; // null whenever hasCycWall is false
  backdrops: string[];
}

interface IncludedGearDto {
  name: string;
  category: GearCategory;
  quantity: number;                // integer, 1 or more
}

interface ExtraGearDto {
  name: string;
  category: GearCategory;
  quantity: number;
  extraCost: Cad;
}

interface StudioGearDto {
  included: IncludedGearDto[];
  extras: ExtraGearDto[];          // []: "nothing costs extra" (L2-007 AC2)
}

interface StudioLogisticsDto {     // null: the frontend shows "None" (L2-008 AC2)
  loadIn: LoadIn | null;
  loadInNote: string | null;
  parking: Parking | null;
  transit: string | null;
  washroom: string | null;
  changingArea: string | null;
  clientSeating: string | null;
  noise: string | null;
}

interface RubricScoresDto {        // integers from 1 to 5
  value: number;
  light: number;
  space: number;
  gear: number;
  logistics: number;
  condition: number;
}

interface StudioVerdictDto {
  whoItsFor: string;
  whoShouldSkip: string;
  scores: RubricScoresDto;
  overallScore: number;            // one decimal place
}
```

### 13.3 Comparison

```ts
interface ComparisonDto {
  studios: ComparedStudioDto[];    // URL order, 0 to 4 entries
  notFoundSlugs: Slug[];           // URL order
  truncated: boolean;
}

interface ComparedStudioDto {
  slug: Slug;
  name: string;
  pricing: StudioPricingDto;       // the mandatory-fees row reads pricing.fees where mandatory is true
  specifications: StudioSpecificationsDto;
  includedGear: IncludedGearDto[];
  parking: Parking | null;         // null: the frontend shows "—" (L2-031 AC3)
  loadIn: LoadIn | null;
  scores: RubricScoresDto;
  overallScore: number;
  testShots: CaptionedImageDto[];
  isLowestAllInCost: boolean;
}
```

### 13.4 Spots

```ts
interface PermitsByShootTypeDto {
  portrait: PermitRequirement;
  weddingEngagement: PermitRequirement;
  commercial: PermitRequirement;
  video: PermitRequirement;
}

interface SpotSummary {
  slug: Slug;
  name: string;
  neighbourhood: string;
  type: SpotType | null;           // not in the standard data set (OI-12)
  bestUses: BestUse[];             // fixed order: engagement, family, portrait, brand, video
  permits: PermitsByShootTypeDto;
  permitStale: boolean;
  thumbnail: ImageDto;             // first sample shot
}

interface LightSlotDto {
  rating: LightRating;
  note: string | null;
}

interface SpotLightByTimeDto {
  morning: LightSlotDto;
  midday: LightSlotDto;
  afternoon: LightSlotDto;
  goldenHour: LightSlotDto;
  blueHour: LightSlotDto;
}

interface SpotLightBySeasonDto {
  spring: string;
  summer: string;
  autumn: string;
  winter: string;
}

interface SpotConditionsDto {      // null facility: "None nearby" (L2-017 AC2)
  weekdayCrowds: CrowdLevel | null;
  weekendCrowds: CrowdLevel | null;
  parking: string | null;
  washrooms: string | null;
  changing: string | null;
}

interface SpotPermitsDto {
  byShootType: PermitsByShootTypeDto;
  sourceUrl: Url;
  verifiedAt: IsoDate;
  permitStale: boolean;
}

interface RainBackupStudioDto {
  slug: Slug;
  name: string;
  distanceKm: number;              // one decimal place
  allInCost2h: Cad;
  priceStale: boolean;
}

interface SpotDetailDto {
  slug: Slug;
  name: string;
  neighbourhood: string;
  type: SpotType | null;
  latitude: number;
  longitude: number;
  directions: string;
  lightByTime: SpotLightByTimeDto;
  lightBySeason: SpotLightBySeasonDto;
  sampleShots: SampleShotDto[];    // configured order, at least 1
  conditions: SpotConditionsDto;
  permits: SpotPermitsDto;
  bestUses: BestUse[];             // at least 1
  disclosure: DisclosureDto;
  episode: EpisodeDto | null;
  rainBackup: RainBackupStudioDto[]; // 0 to 3, nearest first
  reviewedAt: IsoDateTime;
}
```

### 13.5 Map

```ts
type MapLocation = StudioMapLocation | SpotMapLocation;   // discriminated on kind

interface StudioMapLocation {
  kind: 'studio';
  slug: Slug;
  name: string;
  latitude: number;
  longitude: number;
  allInCost2h: Cad;
  priceStale: boolean;
}

interface SpotMapLocation {
  kind: 'spot';
  slug: Slug;
  name: string;
  latitude: number;
  longitude: number;
  permits: PermitsByShootTypeDto;
  permitStale: boolean;
}
```

### 13.6 Guides

```ts
interface GuideSummaryDto {
  slug: Slug;
  title: string;
  summary: string | null;
}

interface GuideDataPointDto {
  key: GuideDataPointKey;
  value: number;
}

type GuideEntryDto = StudioGuideEntryDto | SpotGuideEntryDto;   // discriminated on kind

interface StudioGuideEntryDto {
  kind: 'studio';
  location: StudioSummary;
  dataPoints: GuideDataPointDto[]; // in the guide's dataPoints order
  editorNote: string | null;
}

interface SpotGuideEntryDto {
  kind: 'spot';
  location: SpotSummary;
  dataPoints: GuideDataPointDto[]; // [] until a spot data point key exists
  editorNote: string | null;
}

interface GuideDto {
  slug: Slug;
  title: string;
  summary: string | null;
  introduction: string | null;
  entries: GuideEntryDto[];        // configured order; draft locations left out
}
```

### 13.7 Signup, platform and health

```ts
interface SubscribeRequest {
  email: string;
  sourcePath: string;              // page path the form was on, starting with "/"
  website?: string;                // honeypot; the browser leaves it empty
}

interface PublicRoutesDto {
  studios: Slug[];
  spots: Slug[];
  guides: Slug[];
}

interface SlugRedirectDto {
  type: ContentType;
  fromSlug: Slug;
  toSlug: Slug;
  location: string;                // page path, e.g. "/studios/the-junction-loft"
}

interface SitemapEntryDto {
  path: string;                    // page path starting with "/"
  lastModified: IsoDateTime;
}

interface HealthStatus {
  status: 'ok' | 'degraded';
}
```

### 13.8 Authentication

```ts
interface SignInRequest {
  email: string;
  password: string;
}

interface OwnerSessionState {
  signedIn: boolean;
}
```

The frontend's `SignInResult` (`signedIn`, `invalidCredentials`,
`rateLimited`) is mapped inside `HttpAuthService` from `204`, `401` and `429`.
It does not cross the wire.

### 13.9 Administration: reads

```ts
interface ContentCountDto {
  published: number;
  draft: number;
}

interface ContentCounts {
  studios: ContentCountDto;
  spots: ContentCountDto;
  guides: ContentCountDto;
}

interface VerificationItem {
  kind: LocationKind;
  id: Id;
  name: string;
  field: VerificationField;
  verifiedAt: IsoDate;
  ageDays: number;
  group: VerificationGroup;
}

interface AdminDashboard {
  counts: ContentCounts;
  verification: VerificationItem[];   // oldest first
}

interface AdminContentRow {
  id: Id;
  name: string;                    // the title, for guides
  neighbourhood: string | null;    // null for guides
  status: PublicationStatus;
  updatedAt: IsoDateTime;
  stale: boolean;
}

interface PublicationStatusDto {
  status: PublicationStatus;
  publishedAt: IsoDateTime | null;
}

interface GuideCandidate {
  kind: LocationKind;
  id: Id;
  name: string;
  neighbourhood: string | null;
  status: PublicationStatus;
}

interface UploadedImageDto {
  imageId: Id;
  role: ImageRole;
  preview: ImageDto;               // alt is "" until the owner saves alt text
}
```

### 13.10 Administration: studio input and model

```ts
interface StudioFeeInput {
  name: string;
  amount: Cad;
  mandatory: boolean;
}

interface GearItemInput {
  name: string;
  category: GearCategory;
  quantity: number;
  included: boolean;
  extraCost: Cad | null;           // required when included is false; null when true
}

interface NaturalLightInput {
  morning: LightRating | null;
  midday: LightRating | null;
  afternoon: LightRating | null;
  evening: LightRating | null;
}

interface RubricScoresInput {
  value: number | null;
  light: number | null;
  space: number | null;
  gear: number | null;
  logistics: number | null;
  condition: number | null;
}

interface ImageOrderItem {
  imageId: Id;
  alt: string;
}

interface TestShotOrderItem {
  imageId: Id;
  alt: string;
  caption: string;
}

interface StudioInput {
  name: string;
  slug?: Slug;
  neighbourhood: string | null;
  addressOrCrossStreets: string | null;
  bookingUrl: Url | null;
  latitude: number | null;
  longitude: number | null;
  hourlyRate: Cad | null;
  minBookingHours: number | null;
  fees: StudioFeeInput[];
  priceVerifiedAt?: IsoDate;
  usableWidth: Metres | null;
  usableDepth: Metres | null;
  ceilingHeight: Metres | null;
  windowDirection: string | null;
  naturalLight: NaturalLightInput;
  outletCount: number | null;
  outletType: string | null;
  has20aCircuits: boolean | null;
  hasCycWall: boolean | null;
  cycWallCondition: string | null;
  backdrops: string[];
  gear: GearItemInput[];
  loadIn: LoadIn | null;
  loadInNote: string | null;
  parking: Parking | null;
  transit: string | null;
  washroom: string | null;
  changingArea: string | null;
  clientSeating: string | null;
  noise: string | null;
  scores: RubricScoresInput;
  whoItsFor: string | null;
  whoShouldSkip: string | null;
  disclosure: DisclosureKind | null;
  disclosureProvider: string | null;
  videoLink: string | null;        // YouTube URL or 11-character ID; stored as the ID
  episodeTitle: string | null;
  testShots: TestShotOrderItem[];
  gallery: ImageOrderItem[];
}

interface EditorImage {
  imageId: Id;
  alt: string;
  preview: ImageDto;
}

interface EditorTestShot {
  imageId: Id;
  alt: string;
  caption: string;
  preview: ImageDto;
}

interface StudioEditorModel {
  id: Id;
  slug: Slug;
  status: PublicationStatus;
  publishedAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
  // Every StudioInput property, with these differences:
  //   priceVerifiedAt: IsoDate (always present);
  //   videoLink: the stored video ID or null;
  //   testShots: EditorTestShot[]; gallery: EditorImage[].
  name: string;
  neighbourhood: string | null;
  addressOrCrossStreets: string | null;
  bookingUrl: Url | null;
  latitude: number | null;
  longitude: number | null;
  hourlyRate: Cad | null;
  minBookingHours: number | null;
  fees: StudioFeeInput[];
  priceVerifiedAt: IsoDate;
  usableWidth: Metres | null;
  usableDepth: Metres | null;
  ceilingHeight: Metres | null;
  windowDirection: string | null;
  naturalLight: NaturalLightInput;
  outletCount: number | null;
  outletType: string | null;
  has20aCircuits: boolean | null;
  hasCycWall: boolean | null;
  cycWallCondition: string | null;
  backdrops: string[];
  gear: GearItemInput[];
  loadIn: LoadIn | null;
  loadInNote: string | null;
  parking: Parking | null;
  transit: string | null;
  washroom: string | null;
  changingArea: string | null;
  clientSeating: string | null;
  noise: string | null;
  scores: RubricScoresInput;
  whoItsFor: string | null;
  whoShouldSkip: string | null;
  disclosure: DisclosureKind | null;
  disclosureProvider: string | null;
  videoLink: string | null;
  episodeTitle: string | null;
  testShots: EditorTestShot[];
  gallery: EditorImage[];
}
```

### 13.11 Administration: spot input and model

```ts
interface LightSlotInput {
  rating: LightRating | null;
  note: string | null;
}

interface SpotLightByTimeInput {
  morning: LightSlotInput;
  midday: LightSlotInput;
  afternoon: LightSlotInput;
  goldenHour: LightSlotInput;
  blueHour: LightSlotInput;
}

interface SpotLightBySeasonInput {
  spring: string | null;
  summer: string | null;
  autumn: string | null;
  winter: string | null;
}

interface PermitsByShootTypeInput {
  portrait: PermitRequirement | null;
  weddingEngagement: PermitRequirement | null;
  commercial: PermitRequirement | null;
  video: PermitRequirement | null;
}

interface SampleShotOrderItem {
  imageId: Id;
  alt: string;
  focalLengthMm: number;
  angleNote: string;
}

interface SpotInput {
  name: string;
  slug?: Slug;
  neighbourhood: string | null;
  type: SpotType | null;
  latitude: number | null;
  longitude: number | null;
  directions: string | null;
  lightByTime: SpotLightByTimeInput;
  lightBySeason: SpotLightBySeasonInput;
  weekdayCrowds: CrowdLevel | null;
  weekendCrowds: CrowdLevel | null;
  parking: string | null;
  washrooms: string | null;
  changing: string | null;
  permits: PermitsByShootTypeInput;
  permitSourceUrl: Url | null;
  permitVerifiedAt?: IsoDate;
  bestUses: BestUse[];
  disclosure: DisclosureKind | null;
  disclosureProvider: string | null;
  videoLink: string | null;
  episodeTitle: string | null;
  sampleShots: SampleShotOrderItem[];
}

interface EditorSampleShot {
  imageId: Id;
  alt: string;
  focalLengthMm: number | null;    // null only straight after upload
  angleNote: string | null;
  preview: ImageDto;
}

interface SpotEditorModel {
  id: Id;
  slug: Slug;
  status: PublicationStatus;
  publishedAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
  // Every SpotInput property, with these differences:
  //   permitVerifiedAt: IsoDate (always present);
  //   videoLink: the stored video ID or null;
  //   sampleShots: EditorSampleShot[].
  name: string;
  neighbourhood: string | null;
  type: SpotType | null;
  latitude: number | null;
  longitude: number | null;
  directions: string | null;
  lightByTime: SpotLightByTimeInput;
  lightBySeason: SpotLightBySeasonInput;
  weekdayCrowds: CrowdLevel | null;
  weekendCrowds: CrowdLevel | null;
  parking: string | null;
  washrooms: string | null;
  changing: string | null;
  permits: PermitsByShootTypeInput;
  permitSourceUrl: Url | null;
  permitVerifiedAt: IsoDate;
  bestUses: BestUse[];
  disclosure: DisclosureKind | null;
  disclosureProvider: string | null;
  videoLink: string | null;
  episodeTitle: string | null;
  sampleShots: EditorSampleShot[];
}
```

### 13.12 Administration: guide input and model

```ts
interface GuideEntryInput {
  kind: LocationKind;
  locationId: Id;
  note: string | null;
}

interface GuideInput {
  title: string;
  slug: Slug;
  summary: string | null;
  introduction: string | null;
  dataPoints: GuideDataPointKey[];
  entries: GuideEntryInput[];      // array order is the configured order
}

interface GuideEditorEntry {
  kind: LocationKind;
  locationId: Id;
  name: string;
  status: PublicationStatus;
  note: string | null;
}

interface GuideEditorModel {
  id: Id;
  slug: Slug;
  status: PublicationStatus;
  publishedAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
  title: string;
  summary: string | null;
  introduction: string | null;
  dataPoints: GuideDataPointKey[];
  entries: GuideEditorEntry[];
}
```

## 14. Enumerations

Each enumeration is a string union type in its own file on both sides. Values are exact.

| Type | Values |
|------|--------|
| `PublicationStatus` | `draft`, `published` |
| `ContentType` | `studio`, `spot`, `guide` |
| `LocationKind` | `studio`, `spot` |
| `DisclosureKind` | `paid_in_full`, `discounted`, `comped` |
| `LightRating` | `none`, `low`, `medium`, `strong` |
| `GearCategory` | `lights`, `modifiers`, `stands`, `backdrops`, `other` |
| `GearFilter` | `lights`, `modifiers`, `stands`, `backdrops` |
| `LoadIn` | `stairs`, `elevator`, `freight_elevator` |
| `Parking` | `on_site`, `street`, `none` |
| `StudioSort` | `recent`, `cost`, `score` |
| `SpotType` | `park`, `architecture`, `waterfront`, `indoor_public` |
| `BestUse` | `engagement`, `family`, `portrait`, `brand`, `video` |
| `CrowdLevel` | `low`, `medium`, `high` |
| `PermitRequirement` | `required`, `not_required` |
| `SpotPermitFilter` | `any`, `none_needed` |
| `ImageRole` | `test_shot`, `gallery`, `sample_shot` |
| `ImageFormat` | `avif`, `webp`, `jpeg` |
| `VerificationField` | `price`, `permit` |
| `VerificationGroup` | `stale`, `due_soon` |
| `GuideDataPointKey` | `all_in_cost_2h`, `overall_score` (OI-8) |
| `ProblemType` | See [§9.2](#92-problem-details-body) |
| `FieldErrorCode` | See [§9.3](#93-field-error-codes) |

Times of day, seasons, shoot types and rubric categories are fixed
**property names** (`goldenHour`, `weddingEngagement`, `logistics`), not enumeration values.

## 15. Request validation rules

The API enforces every rule below on every save, whatever the publication
status, whenever a value is present. Strings are trimmed first (rule C-14).
"Length" counts characters after trimming.

### 15.1 Studio input

| Field | Rule | Code on failure |
|-------|------|-----------------|
| `name` | Required, length 1–120 | `required`, `out_of_range` |
| `slug` | `Slug`, unique among studios | `invalid_format`, `already_in_use` |
| `neighbourhood` | Length 1–80 | `out_of_range` |
| `addressOrCrossStreets` | Length 1–200 | `out_of_range` |
| `bookingUrl` | `Url` with scheme `http` or `https` (L2-054 AC4) | `invalid_format` |
| `latitude` / `longitude` | −90 to 90 / −180 to 180. Both present or both `null`. | `out_of_range`, `required` |
| `hourlyRate` | `Cad` from 0 to 10,000 (L2-054 AC2) | `invalid_type`, `out_of_range`, `invalid_format` |
| `minBookingHours` | Greater than 0 and at most 24, at most 2 decimal places | `out_of_range`, `invalid_format` |
| `fees` | At most 20. Each: `name` length 1–80, `amount` `Cad` 0–10,000, `mandatory` boolean (L2-054 AC5) | `required`, `out_of_range` |
| `priceVerifiedAt` | `IsoDate`, not after today. When present it must not be `null`. | `invalid_format`, `date_in_future` |
| `usableWidth`, `usableDepth` | `Metres`, at most 100 | `out_of_range` |
| `ceilingHeight` | `Metres`, at most 30 | `out_of_range` |
| `windowDirection` | Length 1–80 | `out_of_range` |
| `naturalLight.*` | `LightRating` | `invalid_value` |
| `outletCount` | Integer 0–100 | `out_of_range` |
| `outletType` | Length 1–80 | `out_of_range` |
| `cycWallCondition` | Length 1–80. The API stores `null` unless `hasCycWall` is `true`. | `out_of_range` |
| `backdrops` | At most 20 items, each length 1–80 | `out_of_range` |
| `gear` | At most 50. Each: `name` length 1–80, `quantity` integer 1–99, `extraCost` as defined on `GearItemInput` | `required`, `out_of_range` |
| `loadInNote`, `washroom`, `changingArea`, `clientSeating`, `noise` | Length 1–200 | `out_of_range` |
| `transit` | Length 1–300 | `out_of_range` |
| `scores.*` | Integer 1–5 (L2-054 AC3) | `out_of_range`, `invalid_type` |
| `whoItsFor`, `whoShouldSkip` | Length 1–2,000 | `out_of_range` |
| `disclosureProvider` | Length 1–120. Required when `disclosure` is `discounted` or `comped` (L2-045 AC1). The API stores `null` when it is `paid_in_full`. | `required` |
| `videoLink` | Empty or `null` clears the video. Otherwise an 11-character ID matching `^[A-Za-z0-9_-]{11}$`, a `youtube.com/watch?v=` URL on `www.`, bare or `m.` host, or a `youtu.be/` URL. The API ignores other query parameters (L2-059). | `invalid_video_link` |
| `episodeTitle` | Length 1–150 | `out_of_range` |
| `testShots` | At most 12, exactly the attached `test_shot` images. Each `alt` length 1–300 (L2-057 AC4), `caption` length 1–200. | `invalid_value`, `required` |
| `gallery` | At most 60, exactly the attached `gallery` images. Each `alt` length 1–300. | `invalid_value`, `required` |

### 15.2 Spot input

| Field | Rule | Code on failure |
|-------|------|-----------------|
| `name`, `slug`, `neighbourhood` | As for studios | as for studios |
| `type` | `SpotType` (L2-055 AC3) | `invalid_value` |
| `latitude` / `longitude` | −90 to 90 / −180 to 180 (L2-055 AC1). Both present or both `null`. | `out_of_range`, `required` |
| `directions` | Length 1–4,000 | `out_of_range` |
| `lightByTime.*.rating` | `LightRating` | `invalid_value` |
| `lightByTime.*.note` | Length 1–200 | `out_of_range` |
| `lightBySeason.*` | Length 1–300 | `out_of_range` |
| `weekdayCrowds`, `weekendCrowds` | `CrowdLevel` | `invalid_value` |
| `parking`, `washrooms`, `changing` | Length 1–200 | `out_of_range` |
| `permits.*` | `PermitRequirement` | `invalid_value` |
| `permitSourceUrl` | `Url` with scheme `http` or `https` | `invalid_format` |
| `permitVerifiedAt` | `IsoDate`, not after today. When present it must not be `null`. | `invalid_format`, `date_in_future` |
| `bestUses` | Values from `BestUse`, no repeats. `[]` is allowed on a draft. | `invalid_value`, `duplicate` |
| `disclosure`, `disclosureProvider`, `videoLink`, `episodeTitle` | As for studios | as for studios |
| `sampleShots` | At most 30, exactly the attached `sample_shot` images. Each `alt` length 1–300, `focalLengthMm` integer 1–2,000, `angleNote` length 1–200. | `invalid_value`, `required`, `out_of_range` |

### 15.3 Guide input

| Field | Rule | Code on failure |
|-------|------|-----------------|
| `title` | Required, length 1–150 | `required`, `out_of_range` |
| `slug` | Required, `Slug`, unique among guides. On create a taken slug gets a numeric suffix. On update it answers `already_in_use`. | `required`, `invalid_format`, `already_in_use` |
| `summary` | Length 1–300 | `out_of_range` |
| `introduction` | Length 1–5,000 | `out_of_range` |
| `dataPoints` | Values from `GuideDataPointKey`, no repeats | `invalid_value`, `duplicate` |
| `entries` | At most 50. No repeated (`kind`, `locationId`) pair (L2-060 AC2). Each `locationId` must exist. Each `note` length 1–1,000. | `duplicate`, `not_found`, `out_of_range` |

### 15.4 Other inputs

| Input | Field | Rule | Code on failure |
|-------|-------|------|-----------------|
| `SubscribeRequest` | `email` | Required, at most 254 characters, email syntax (L2-040) | `required`, `out_of_range`, `invalid_format` |
| | `sourcePath` | Required, starts with `/`, at most 2,048 characters | `required`, `invalid_format` |
| | `website` | Optional string of at most 200 characters | `out_of_range` |
| `SignInRequest` | `email` | Required, email syntax | `required`, `invalid_format` |
| | `password` | Required, length 1–200 | `required`, `out_of_range` |

### 15.5 Standard data set (publish check)

A publish request (E23, E30, E37) succeeds only when every key below has a
value. Otherwise it answers `422`, and `missingFields` lists the missing keys
in the order shown. Each key is a field path in the matching input type, so
the frontend can focus the control. On an already published item, a `PUT`
that would empty any of these keys answers `400` with
`required_while_published` on that field.

| Type | Keys (L2-002, L2-045, L2-055, L2-060) |
|------|----------------------------------------|
| Studio | `name`, `neighbourhood`, `addressOrCrossStreets`, `bookingUrl`, `hourlyRate`, `minBookingHours`, `priceVerifiedAt`, `usableWidth`, `usableDepth`, `ceilingHeight`, `windowDirection`, `naturalLight.morning`, `naturalLight.midday`, `naturalLight.afternoon`, `naturalLight.evening`, `outletCount`, `outletType`, `has20aCircuits`, `hasCycWall`, `testShots` (at least 1), `gallery` (at least 1), `scores.value`, `scores.light`, `scores.space`, `scores.gear`, `scores.logistics`, `scores.condition`, `whoItsFor`, `whoShouldSkip`, `disclosure` |
| Spot | `name`, `neighbourhood`, `latitude`, `longitude`, `directions`, `lightByTime.morning`, `lightByTime.midday`, `lightByTime.afternoon`, `lightByTime.goldenHour`, `lightByTime.blueHour` (each reported when its `rating` is `null`), `lightBySeason.spring`, `lightBySeason.summer`, `lightBySeason.autumn`, `lightBySeason.winter`, `sampleShots` (at least 1), `permits.portrait`, `permits.weddingEngagement`, `permits.commercial`, `permits.video`, `permitSourceUrl`, `permitVerifiedAt`, `bestUses` (at least 1), `disclosure` |
| Guide | `entries` (at least 1) |

## 16. Change control

### 16.1 Versioning

This document carries a `MAJOR.MINOR` version. The API path has no version
segment, because frontend and backend deploy together from one commit.
Compatibility therefore rests on the rules below.

| Change | Class | Rule |
|--------|-------|------|
| New endpoint | Minor | Backend first or in the same release |
| New property on a response type | Minor | Allowed. The frontend ignores unknown properties (rule C-8). |
| New optional request property | Minor | The backend accepts it before or in the same release in which the frontend sends it |
| New value in a response enumeration | Minor, frontend first | The frontend handles the value before the backend can send it |
| Looser validation | Minor | Allowed |
| Removing or renaming a property, changing a type, unit or meaning, changing a status code, a new required request property, stricter validation, removing an endpoint | Major | Expand and contract over two releases: add the new form, move the consumer, then remove the old form. Pages and scripts cached at the CDN and in open browser tabs keep calling the previous contract for a while. |

### 16.2 Process

1. A change to anything this document defines **MUST** update this document
   in the same pull request as the code on both sides, bumping the version
   and adding a row to [§19](#19-revision-history).
2. A pull request that changes a route handler under `backend/app/api/`, a DTO
   or enumeration under `backend/lib/`, or a service, DTO or enumeration under
   `frontend/libs/api/` **MUST** name the section of this document it
   implements.
3. A change that needs a new requirement follows the repository's normal
   order: requirement, detailed design, mock, then this document and the
   code.

## 17. Verification

Adherence is proven by behaviour tests, not by inspecting code structure.

| Side | How |
|------|-----|
| Backend | API tests call each endpoint and assert its status codes, headers (`Content-Type`, `Cache-Control`, `X-Correlation-Id`, cookies, `Retry-After`, `Location`) and body shape against the types in [§13](#13-data-types). They cover every status listed for that endpoint in [§12](#12-endpoint-catalogue). |
| Frontend | Playwright acceptance tests drive each screen against the API, or against route-intercepted fixtures typed with the `libs/api` DTOs. They cover each status the screen handles: `404` page, list error state, `401` redirect, `422` dialog, `429` message. |
| Both | One end-to-end smoke test runs the prerendered build against a seeded API and checks a studio page, a spot page, the studio list and a sign-in. |

## 18. Open items

These `<TO SUPPLY>` items from the detailed designs affect the interface.
Until each is closed, the interim rule in this document applies. Closing an
item that changes the contract follows [§16](#16-change-control).

| ID | Item | Interim rule in this document |
|----|------|-------------------------------|
| OI-1 | Time zone for "today" | `America/Toronto` (rule C-9) |
| OI-2 | Neighbourhood vocabulary for the `hood` filter options | The filter value is `toSlug(neighbourhood)` |
| OI-3 | Studio coordinates are not in the L2-002 standard data set, yet the map (L2-027) and rain backup (L2-037) need them | Coordinates are optional. Studios without them are left out of E5 and of `rainBackup`. |
| OI-4 | Meaning of `reviewedAt` ("most recent review") | The time of the latest publish |
| OI-5 | Episode poster source: uploaded image or YouTube thumbnail | `EpisodeDto` carries no poster. If an uploaded image is chosen, `poster: ImageDto` is added as a minor change. |
| OI-6 | Mapping from use case to shoot type for `permit=none_needed`, and the rule when no use case is selected | `family` and `portrait` map to `portrait`, `engagement` to `weddingEngagement`, `brand` to `commercial`, and `video` to `video`. With no use case, a spot must be `not_required` for `portrait`. |
| OI-7 | Permit requirement values beyond "Required" and "Not required" | `required`, `not_required` only |
| OI-8 | Guide data point vocabulary | `all_in_cost_2h`, `overall_score` |
| OI-9 | Order of the guides index and of `featuredIn` | Most recent publish first |
| OI-10 | Standard setup caption: per image or one text per position | Per image (`TestShotOrderItem.caption`) |
| OI-11 | Further YouTube URL forms (`/shorts/`, `/embed/`) | Not accepted |
| OI-12 | Spot `type` is not in the L2-002 standard data set | `type` may be `null` on public responses |
| OI-13 | Upscaling of images smaller than a variant width | No upscaling. Widths above the original are not generated. |
| OI-14 | Rounding of halves in `overallScore` and `allInCost2h` | Round half up |
| OI-15 | Map provider origin for the CSP `frame-src` | `<TO SUPPLY>` |

## 19. Revision history

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-10-13 | First baseline, covering every endpoint in the detailed designs |

---

## Appendix A. Reconciliation with detailed designs

The detailed designs were written feature by feature and describe parts of
the boundary differently. This document settles each difference as follows.
Where a design's text conflicts, this document governs ([§1](#1-purpose-and-authority)).

| # | Topic | Design text | This document |
|---|-------|-------------|---------------|
| A1 | Error body | `ValidationProblem { status, errors[] }` (secure-requests). A `FieldErrors` map of path to message (edit-studio). `MissingFieldsProblem` (publish-and-unpublish-location). | One RFC 9457 `ProblemDetails` with `errors` and `missingFields` ([§9.2](#92-problem-details-body)) |
| A2 | Error text | Server messages mapped onto controls | The server sends a stable `code`, and the frontend owns every user-facing message (i18n, rule C-15) |
| A3 | Disclosure values | `paidFull` (show-studio-verdict-and-disclosure). A free-text `disclosure: string` on spots (show-spot-best-uses-disclosure-and-episode). | `DisclosureDto { kind, provider }` with `paid_in_full`, `discounted`, `comped` for studios and spots (L2-045) |
| A4 | Enumeration spelling | Mixed: `goldenHour`, `weddingEngagement`, `none-needed`, `indoor public` | Values are `snake_case` (rule C-5). Times of day and shoot types become property names. |
| A5 | Image shape | `ImageDto` with `variants[]`; `src` + `srcset`; `ImageRef`; `kind`/`role`; `position`/`sortOrder`; `alt`/`altText` | One `ImageDto` (serve-responsive-images) wrapped by `CaptionedImageDto` and `SampleShotDto`. Request order is array order, and the field is `alt`. |
| A6 | Permit summary | Server-built `permitSummary` text | Structured `permits` and `permitStale`. The frontend builds the words. |
| A7 | Permit source and date | Per shoot-type row, `verifiedOn` | One `permitSourceUrl` and `permitVerifiedAt` per spot, as named by L2-002 |
| A8 | Episode | `episode { videoId, title }` on studios, `videoId` on spots | `episode: EpisodeDto \| null` on both. The title falls back to the location name. |
| A9 | Studio parking | Free text (show-studio-specifications assumption) | `Parking` enumeration, needed by the L2-022 filter |
| A10 | Type names | `StudioDto`, `SpotDto` (cross-link-guides-from-studio, emit-metadata-and-sitemap) | `StudioDetailDto`, `SpotDetailDto` |
| A11 | Guide data points | `{ label, value }` display strings | `{ key, value }`. The frontend builds the label. |
| A12 | Guide entry card | `LocationCardDto` | Reuses `StudioSummary` and `SpotSummary` |
| A13 | Publish response | Not specified | `200 PublicationStatusDto`, idempotent |
| A14 | Create response | Not specified | `201` with `Location` and the editor model |
| A15 | `401` body | Empty (maintain-owner-session) | Empty everywhere, including sign-in |
| A16 | Session cookie scope | Not specified | `st_session` on `Path=/api`. The SSR server never forwards cookies, and admin routes render in the browser (rule T-4). |
| A17 | Sign-out protection | CSRF on "administration writes" | Sign-out also requires the CSRF token, and sign-in checks `Origin` |
| A18 | Image order on save | `sortOrder` per item | Lists name the complete attached set, and array index is the position |
| A19 | Lengths | Units `<TO SUPPLY>` (edit-studio) | Metres on the wire: `usableWidth`, `usableDepth`, `ceilingHeight` |
| A20 | Slug change | Not in the studio or spot editor inputs | Optional `slug` on `StudioInput` and `SpotInput` (L2-075 AC2) |
| A21 | Guide summary | Not in `GuideInput` | `summary` added, because L2-035 lists it on the index |
| A22 | Studio coordinates | Read by the map and rain backup, absent from the editor input | `latitude` and `longitude` on `StudioInput` (OI-3) |
| A23 | Staleness beside cost | Not stated for rain backup and map | `priceStale` goes with every `allInCost2h` ([§7](#7-server-owned-values)) |
| A24 | Images without alt text | Not stated | Excluded from public responses (rule S-8) |

## Appendix B. Traceability

| Endpoint | L2 requirements | Detailed design |
|----------|-----------------|-----------------|
| E1 | L2-001, L2-021, L2-022, L2-023, L2-025, L2-026, L2-043, L2-046, L2-073 | browse/list-studios, browse/filter-and-sort-studios |
| E2 | L2-001, L2-003 – L2-013, L2-036, L2-043, L2-076 | studio-reviews/*, guides/cross-link-guides-from-studio |
| E3 | L2-001, L2-024, L2-025 | browse/list-and-filter-spots |
| E4 | L2-001, L2-014 – L2-020, L2-037, L2-038 | outdoor-spots/* |
| E5 | L2-027, L2-028 | browse/view-locations-map |
| E6 | L2-031, L2-032, L2-033, L2-043 | comparison/view-comparison |
| E7, E8 | L2-034, L2-035 | guides/view-guide, guides/browse-guides |
| E9 | L2-039, L2-040, L2-041 | email-signup/subscribe-by-email |
| E10, E11 | L2-075, L2-087 | platform/deliver-public-pages |
| E12 | L2-077 | platform/emit-metadata-and-sitemap |
| E13 | L2-084 | platform/handle-errors-and-health |
| E14 | L2-049, L2-050 | owner-access/sign-in-as-owner |
| E15, E16 | L2-051, L2-052 | owner-access/maintain-owner-session |
| E17 | L2-044, L2-053 | content-management/view-admin-dashboard |
| E18, E25, E32 | L2-063 | content-management/list-admin-content |
| E19 – E21 | L2-042, L2-054, L2-059 | content-management/edit-studio, content-management/set-episode-video |
| E26 – E28 | L2-055, L2-059 | content-management/edit-outdoor-spot, content-management/set-episode-video |
| E33 – E35, E39 | L2-060 | content-management/edit-guide |
| E22, E29, E36 | L2-061 | content-management/delete-content |
| E23, E24, E30, E31, E37, E38 | L2-002, L2-045, L2-056 | content-management/publish-and-unpublish-location, content-management/edit-guide |
| E40, E41 | L2-057, L2-058, L2-081 | content-management/upload-and-arrange-images, platform/serve-responsive-images |
| All | L2-078, L2-079, L2-080, L2-085 | platform/secure-requests, platform/handle-errors-and-health, owner-access/maintain-owner-session |
