# Email signup

| Field | Value |
|---|---|
| Selector | `st-email-signup` (application component `EmailSignupComponent`) |
| Library path | `frontend/projects/shot-there/src/app/features/email-signup/email-signup/` |
| Status | planned |
| Traces to | L2-039, L2-040, L2-041, L2-064, L2-065, L2-066, L2-067, L2-068, L2-069, L2-070, L2-071 |
| Design system | [`signup.html`](../../design-system/components/signup.html) |
| Source mocks | [`pages/home/default`](../../mocks/pages/home/default.html), [`pages/home/invalid`](../../mocks/pages/home/invalid.html), [`pages/home/submitting`](../../mocks/pages/home/submitting.html), [`pages/home/success`](../../mocks/pages/home/success.html), [`pages/home/rate-limited`](../../mocks/pages/home/rate-limited.html), [`pages/home/error`](../../mocks/pages/home/error.html), [`pages/home/empty`](../../mocks/pages/home/empty.html), [`pages/studio/default`](../../mocks/pages/studio/default.html), [`pages/studios/default`](../../mocks/pages/studios/default.html), [`pages/spot/default`](../../mocks/pages/spot/default.html), [`pages/guide/default`](../../mocks/pages/guide/default.html), [`pages/not-found/default`](../../mocks/pages/not-found/default.html) |
| Rendering | [`signup.html`](signup.html) |

## Purpose and scope

The email signup is the one form a visitor fills in: an email address and a
Subscribe button that gets them one email per new review (L2-039). ShotThere
has no visitor accounts, so this is how a visitor follows the site. It sits in
the home page hero, where Subscribe is the page's one primary action, and in
the footer of every public page, where Subscribe is secondary. It confirms
inline without leaving the page.

`EmailSignupComponent` is an **application** component (ICD-002 §11.2 gives
`.signup*` to application feature CSS). It owns the form, the honeypot, the
view state, validation, the request through `SubscriberService` and the
layout of the `.signup` block. It composes library parts, specified in their
own CRDs and not repeated here: [`st-text-field`](text-field.md) for the email
field (with the shared [field contract](form-field.md)),
[`button[st-button]`](button.md) for Subscribe, [`st-alert`](alert.md) for the
rate-limit and server-error messages, and [`st-icon`](icon.md) for the
success tick.

Out of scope:

- The server: validation, lowercasing, storage, rate limiting and the
  honeypot check (L2-040), in `app/api/subscribers/route.ts` per the
  subscribe-by-email design.
- Where the signup sits in its parent's layout: the home hero places the hero
  instance; the shell gives the footer instance `flex: 1 1 20rem` through its
  `footer-signup` class ([footer.md](footer.md) D-1).
- Signup in a dialog, sheet or toast, and any field besides the email address: never (design system).
- Unsubscribing and the emails themselves.

## Usage

Every `.signup` in `docs/mocks/` (two per home mock, one in the footer of every
public page: 46 mocks), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/home/*` hero | `variant="hero"`: title "Get new reviews by email", promise "One short email per new review. No ads, no sponsors.", primary Subscribe | email field, honeypot | default, invalid empty, invalid not-an-email (note), submitting, success, rate limited, server error | canvas (`.home-hero`) |
| Footer of every public page (`home/*`, `studio/*`, `studios/*`, `spot/*`, `spots/*`, `compare/*`, `guide/default`, `guides/*`, `editorial-policy/default`, `not-found/default`, `server-error/default`, `notifications/public-toast/*`) | `variant="footer"`: title "New reviews by email", promise "One email when a new studio or spot goes up. Unsubscribe any time.", secondary Subscribe | email field, honeypot | default in every mock; the same states as the hero apply (design system) | canvas, inside `st-site-footer`'s muted text |

Both rows are one component with one input. Every state of either placement is
buildable from the view state below.

## Anatomy

1. **Form** — `form.signup`, `novalidate`, `method="post"`, named by its title
   through `aria-labelledby`, so it is a form landmark. Column with `--space-3`
   gaps, full width up to 32rem.
2. **Title** — `h2.signup__title`, `--text-h4`, `--color-fg-default`.
3. **Promise** — one `p` saying how often and what is sent. Inherits the
   surrounding text style (muted inside the footer).
4. **Row** — `div.signup__row`: the email field and Subscribe, stacked below
   36rem, one row from 36rem.
5. **Email field** — [`st-text-field`](text-field.md) with label "Email
   address", `type="email"`, `autocomplete="email"`, `inputmode="email"`; its
   error renders inside the field, under the input (D-1).
6. **Subscribe** — [`button[st-button]`](button.md) `type="submit"`, primary
   in the hero and secondary in the footer; busy while submitting.
7. **Message (one at a time)** — under the row: [`st-alert`](alert.md) warning
   (rate limited) or danger (server error), both `role="alert"`.
8. **Honeypot** — `div.signup__trap[aria-hidden=true]` with a plain
   `<label>` "Leave this field empty" and `<input name="website"
   tabindex="-1" autocomplete="off">`: off-screen, out of the tab order and
   hidden from assistive technology.
9. **Confirmation** — on success the form is replaced by `div.signup` with
   `role="status"`, `aria-live="polite"`, `tabindex="-1"`, holding
   `p.signup__done`: the success tick ([`st-icon`](icon.md) `name="success"` in
   a `span.signup__tick`) and the sentence.

Host: `st-email-signup` is `display: block`; it is the item its parent places.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `SignupVariant` (`'hero' \| 'footer'`) | — | yes | Picks the title, promise, Subscribe variant (`primary` in the hero, `secondary` in the footer) and the ID prefix (`hero-`, `footer-`). One instance of each per page at most. |

All copy is fixed by the variant and marked for translation in the
component's template (L2-070); there are no copy inputs.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The component submits through `SubscriberService` itself and shows the outcome inline. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | |

### Dependencies

- `SubscriberService` (`@shot-there/api`, abstract class and DI token):
  `subscribe(request: SubscribeRequest): Observable<void>` posting
  `{ email, sourcePath, website }` to `POST /api/subscribers`.
- `Router` (`url` without query or fragment, for `sourcePath`: "/" on the home
  page, "/studios/the-junction-loft" on The Junction Loft's page).
- `DOCUMENT` and `afterNextRender` to move focus after a refused submit and after success.

### View state (plain TypeScript beside the component)

| File | Contents |
|---|---|
| `signup-variant.ts` | `type SignupVariant = 'hero' \| 'footer'`. |
| `signup-state.ts` | `type SignupState = 'idle' \| 'submitting' \| 'success' \| 'invalid' \| 'rate-limited' \| 'failed'` (design). |
| `signup-form.ts` | `validateEmail(value: string): 'required' \| 'format' \| null` — trimmed empty → `'required'`; longer than 254 characters or not `local@domain.tld` (no spaces, one `@`, a dot after it) → `'format'`. `toSignupState(status: number): SignupState` — `200` → `success`, `429` → `rate-limited`, anything else (including `0` for a network failure and `400`) → `failed`. |

Messages: `'required'` → "Enter your email address"; `'format'` → "Enter a
valid email address, like name@example.com".

## Variants and sizes

| Variant | Title | Promise | Subscribe | Where |
|---|---|---|---|---|
| Hero | "Get new reviews by email" | "One short email per new review. No ads, no sponsors." | `variant="primary"` (`.btn--primary`) | Home page hero; the page's one primary action |
| Footer | "New reviews by email" | "One email when a new studio or spot goes up. Unsubscribe any time." | secondary (`.btn`) | Footer of every public page; never competes with the page's primary |

| Size | Field and Subscribe | Width |
|---|---|---|
| One size | `--control-height-md` (44 px) at every width | 100 % of the parent up to 32rem; the footer item flexes from 20rem |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Idle | first render | Title, promise, empty field, Subscribe | Form landmark "Get new reviews by email" |
| Invalid: empty | Subscribe with a blank field | Danger edge; "Enter your email address" under the input; no request | `aria-invalid="true"`, error in `aria-describedby`; focus moves to the field |
| Invalid: not an email | Subscribe with "not-an-email" | "Enter a valid email address, like name@example.com"; the text stays in the field | As above |
| Re-validating | input or blur after a refused submit | The error clears as soon as the address is valid, or changes wording | `aria-invalid` removed with it |
| Submitting | valid submit, request pending | Subscribe busy: spinner, label kept transparent, width kept; field stays editable | Subscribe `aria-busy="true"` and `aria-disabled="true"`, name "Subscribe", focus kept; further presses do nothing |
| Success | HTTP 200 (new, repeat, or honeypot) | The form is replaced by the confirmation with the tick, at the form's height (D-6) | `role="status"` polite region; focus moves to it, so it is read |
| Rate limited | HTTP 429 | Warning alert "Too many tries." / "Wait a minute, then try again." under the row; email kept; Subscribe enabled | `role="alert"`; focus stays on Subscribe |
| Server error | HTTP 500, `400`, network failure | Danger alert "We couldn't subscribe you just now." / "Your email is still here — try again." under the row; email kept; Subscribe enabled | `role="alert"`; focus stays on Subscribe |
| Retry | Subscribe after rate limited or server error | The alert goes; Submitting; the same address is sent | — |
| Hover, focus, active | pointer and keyboard | From the text field and the button | Focus ring on the input and on Subscribe |

Only one message shows at a time: the field error, the warning or the danger
alert. The field is never disabled or read-only; Subscribe is never natively
disabled (busy uses `aria-disabled`, [button.md](button.md) D-1).

## Markup

```html
<!-- rendered: hero, idle -->
<st-email-signup>
  <form class="signup" action="/api/subscribers" method="post" novalidate aria-labelledby="hero-signup-title">
    <h2 class="signup__title" id="hero-signup-title">Get new reviews by email</h2>
    <p>One short email per new review. No ads, no sponsors.</p>
    <div class="signup__row">
      <st-text-field class="signup__field">
        <div class="field">
          <label class="field__label" for="hero-email">Email address</label>
          <input class="input" id="hero-email" name="email" type="email" autocomplete="email" inputmode="email">
        </div>
      </st-text-field>
      <button class="btn btn--primary signup__submit" type="submit">Subscribe</button>
    </div>
    <div class="signup__trap" aria-hidden="true">
      <label for="hero-website">Leave this field empty</label>
      <input id="hero-website" name="website" type="text" tabindex="-1" autocomplete="off">
    </div>
  </form>
</st-email-signup>
```

```html
<!-- rendered: footer, invalid (error inside the field, D-1) -->
<form class="signup" action="/api/subscribers" method="post" novalidate aria-labelledby="footer-signup-title">
  <h2 class="signup__title" id="footer-signup-title">New reviews by email</h2>
  <p>One email when a new studio or spot goes up. Unsubscribe any time.</p>
  <div class="signup__row">
    <div class="field">
      <label class="field__label" for="footer-email">Email address</label>
      <input class="input" id="footer-email" name="email" type="email" autocomplete="email" inputmode="email"
             aria-invalid="true" aria-describedby="footer-email-error">
      <span class="field__error" id="footer-email-error">Enter your email address</span>
    </div>
    <button class="btn signup__submit" type="submit">Subscribe</button>
  </div>
  <div class="signup__trap" aria-hidden="true">…</div>
</form>
```

```html
<!-- rendered: submitting -->
<button class="btn btn--primary signup__submit" type="submit" aria-busy="true" aria-disabled="true">Subscribe</button>
```

```html
<!-- rendered: rate limited (server error is the same with alert--danger and its copy) -->
<div class="signup__row">…</div>
<div class="alert alert--warning" role="alert">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg>
  <div class="alert__body"><p class="alert__title">Too many tries.</p><p>Wait a minute, then try again.</p></div>
</div>
<div class="signup__trap" aria-hidden="true">…</div>
```

```html
<!-- rendered: success (replaces the form; focus moves here) -->
<div class="signup" role="status" aria-live="polite" tabindex="-1" style="min-height: 196px">
  <p class="signup__done"><span class="signup__tick"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg></span><span>You're subscribed. We'll email maya.chen@example.com when a new review goes up.</span></p>
</div>
```

The inner markup of `st-text-field`, `button[st-button]`, `st-alert` and
`st-icon` is theirs. The `signup__field`, `signup__submit` and `signup__tick`
classes are this component's own, on library hosts or its own elements, for
placement only (ICD-DOM-5). ID values follow the variant prefix; the `min-height`
value is measured (D-6).

```html
<!-- component template (email-signup.component.html), abridged -->
@if (state() === 'success') {
  <div class="signup" role="status" aria-live="polite" tabindex="-1" #done [style.min-height.px]="formHeight()">
    <p class="signup__done"><span class="signup__tick"><st-icon name="success" /></span>
      <span i18n>You're subscribed. We'll email {{ submittedEmail() }} when a new review goes up.</span></p>
  </div>
} @else {
  <form class="signup" action="/api/subscribers" method="post" novalidate #form
        [attr.aria-labelledby]="prefix() + '-signup-title'" [formGroup]="form" (ngSubmit)="submit()">
    <h2 class="signup__title" [id]="prefix() + '-signup-title'">{{ title() }}</h2>
    <p>{{ promise() }}</p>
    <div class="signup__row">
      <st-text-field class="signup__field" formControlName="email" [inputId]="prefix() + '-email'" name="email"
        type="email" autocomplete="email" inputmode="email" i18n-label label="Email address" [error]="emailError()" />
      <button st-button class="signup__submit" type="submit"
        [variant]="variant() === 'hero' ? 'primary' : 'secondary'" [busy]="state() === 'submitting'" i18n>Subscribe</button>
    </div>
    @if (state() === 'rate-limited') {
      <st-alert tone="warning" role="alert" i18n-title title="Too many tries." i18n>Wait a minute, then try again.</st-alert>
    } @else if (state() === 'failed') {
      <st-alert tone="danger" role="alert" i18n-title title="We couldn't subscribe you just now." i18n>Your email is still here — try again.</st-alert>
    }
    <div class="signup__trap" aria-hidden="true">
      <label [for]="prefix() + '-website'" i18n>Leave this field empty</label>
      <input [id]="prefix() + '-website'" name="website" type="text" tabindex="-1" autocomplete="off" formControlName="website">
    </div>
  </form>
}
```

`title()` and `promise()` are `computed` from the variant, returning
`$localize` strings.

```html
<!-- consumers -->
<st-email-signup variant="hero" />                                          <!-- HomePageComponent, inside .home-hero -->
<st-email-signup slot="signup" class="footer-signup" variant="footer" />    <!-- shell, inside st-site-footer -->
```

## Design

- `.signup`: `display: flex; flex-direction: column`, gap `--space-3`, `width: 100%`, `max-width: 32rem`.
- `.signup__title`: `--text-h4`, `--color-fg-default`.
- `.signup__row`: column with gap `--space-2` below 36rem, and `.signup__submit`
  `width: 100%`. From 36rem: row, `align-items: flex-start`; `.signup__field`
  `flex: 1`; `.signup__submit` `width: auto` and `margin-top: calc(var(--font-size-sm) *
  var(--line-height-normal) + var(--space-1))`, the height of the field label
  and its gap, so Subscribe lines up with the input whether or not an error
  shows under it (D-1).
- `.signup__trap`: `position: absolute; left: -100vw; width: 1px; height: 1px; overflow: hidden`.
- `.signup__done`: flex row, gap `--space-3`, `align-items: flex-start`, `--color-fg-default`.
- `.signup__tick`: `color: var(--color-success-icon)`, `flex: none`,
  `margin-top: var(--space-0-5)`; the icon inherits the colour.
- Motion: none of its own. The swap from form to confirmation is instant; only
  the button's busy spinner turns.

The component declares no tokens. It reads the field tokens (`--field-bg`,
`--field-border`, `--field-fg`) and button tokens (`--btn-bg`, `--btn-fg`,
`--btn-border`) through the composed parts, so re-skinning those changes the
signup with them.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Title, label, confirmation | `--color-fg-default` | `--palette-stone-950` | `--palette-stone-100` |
| Promise in the footer | `--color-fg-muted` | `--palette-stone-700` | `--palette-stone-350` |
| Page behind | `--color-bg-canvas` | `--palette-white` | `--palette-stone-950` |
| Input edge | `--color-border-strong` | `--palette-stone-500` | `--palette-stone-500` |
| Invalid edge | `--color-danger-solid` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Field error | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Primary Subscribe fill / label | `--color-action` / `--color-fg-on-action` | `--palette-stone-950` / `--palette-white` | `--palette-stone-100` / `--palette-stone-950` |
| Rate-limit alert text / fill | `--color-warning-fg` / `--color-warning-bg` | `--palette-mango-700` / `--palette-mango-50` | `--palette-mango-300` / `--palette-mango-950` |
| Server-error alert text / fill | `--color-danger-fg` / `--color-danger-bg` | `--palette-sorrel-600` / `--palette-sorrel-50` | `--palette-sorrel-300` / `--palette-sorrel-950` |
| Success tick | `--color-success-icon` | `--palette-callaloo-500` | `--palette-callaloo-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Title, label and confirmation |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Footer promise |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Input and secondary Subscribe edge |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid input edge |
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | Field error |
| `--color-fg-on-action` | `--color-action` | 4.5:1 | Primary Subscribe label |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Rate-limit alert text |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Server-error alert text |
| `--color-success-icon` | `--color-bg-canvas` | 3:1 | Success tick |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

The tick repeats what the sentence says, so the confirmation never depends on
it. Forced colours come from the composed parts; the tick follows `CanvasText`.

## Responsive behaviour

- XS (below 36rem): the field and Subscribe stack and both are full width
  (L2-039.5); messages sit under Subscribe.
- From 36rem: one row; the field grows and Subscribe keeps its natural width,
  level with the input (D-1).
- The form is capped at 32rem, so the input never becomes a page-wide bar.
- Footer: the shell's `footer-signup` class gives the host `flex: 1 1 20rem`;
  it wraps under the brand when the footer is narrower.
- The honeypot sits off-screen inside a 1 px box, so it never causes
  horizontal scroll. At 320 px nothing scrolls sideways; at 200 % zoom every
  part stays visible and operable; the input and Subscribe are 44 px tall at every width.

## Accessibility

### Role and pattern

A native `<form>` named by its heading (`aria-labelledby`), so it is a form
landmark ("Get new reviews by email, form"). A native email input and a native
submit button. `novalidate` turns off browser bubbles; the component shows its
own message. The honeypot wrapper is `aria-hidden="true"` and its input has
`tabindex="-1"`, so neither keyboard nor screen-reader users reach it.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Email field, then Subscribe; the honeypot is skipped. |
| <kbd>Enter</kbd> in the field | Submits, like Subscribe. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> on Subscribe | Submits; ignored while busy. |

### Focus

- Refused submit (empty or not an email): focus moves to the email input, whose error is read with it.
- Submitting: focus stays on whatever had it; a busy Subscribe keeps focus.
- Success: the form, and the focused element with it, is removed, so focus
  moves to the confirmation wrapper (`tabindex="-1"`), which is then read.
- Rate limited or server error: focus stays on Subscribe so the visitor can retry at once.
- Never `autofocus` on page load (the invalid mock's `autofocus` only marks where focus lands).

### Labelling

- "Email address" is a visible `<label>`; no placeholder. `autocomplete="email"`
  and `inputmode="email"` (WCAG 1.3.5).
- Errors: `aria-invalid="true"` and `aria-describedby` to the `.field__error` (L2-069.2), from `st-text-field`.
- Busy Subscribe keeps its name "Subscribe" with `aria-busy="true"`.

### Announcements

The confirmation is a `role="status"` polite region and takes focus, so it is
read once. Rate-limit and server-error alerts are `role="alert"`, inserted when
the response arrives. Field errors are announced through focus moving to the
field. Nothing goes through `AnnouncerService` (ICD-A11Y-4: each change has one announcer).

### Motion

Only the busy spinner moves, and it keeps turning under reduced motion because
it reports status. The swap to the confirmation is instant
([signup.html](../../design-system/components/signup.html), Accessibility › Motion).

## Content and internationalisation

- Title says what arrives: "Get new reviews by email" (hero), "New reviews by email" (footer).
- Promise says how often and what is not sent: "One short email per new review.
  No ads, no sponsors." / "One email when a new studio or spot goes up. Unsubscribe any time."
- Button is always "Subscribe": not "Sign up" (no accounts), not "Submit".
- Errors say how to fix it: "Enter your email address", "Enter a valid email
  address, like name@example.com".
- Rate limit: "Too many tries." with "Wait a minute, then try again." Server
  error: "We couldn't subscribe you just now." with "Your email is still here — try again."
- Confirmation repeats the address so a typo is visible: "You're subscribed.
  We'll email maya.chen@example.com when a new review goes up." It never says
  "already subscribed" (L2-039.4).
- Honeypot label: "Leave this field empty" (never shown).
- Every string is in the component's template marked `i18n` (or `i18n-title`,
  `i18n-label`) or a `$localize` string in TypeScript; the address is data
  (an interpolation placeholder). French copy wraps; nothing truncates.

## Performance

- Change detection: `OnPush`; the view state, the email error, the title, the
  promise and the ID prefix are signals or `computed`.
- One request per valid submit; the busy button swallows further presses, so
  there is no duplicate request.
- Performance scenario: measured on the application's home page (`/`), which
  shows the hero and the footer instance, on the Lighthouse mobile profile
  (an application component has no `components-harness` route). Pressing
  Subscribe with "maya.chen@example.com" must stay within the L2-071 INP
  budget, and the swap to the confirmation must not move the content below (D-6).
- Regression rule: a change to the template, styles or change detection is
  measured on `/` against the base branch before it is pushed.
- Weight: the component and `signup-form.ts` are part of the public shell
  (the footer is on every public page), so they import only Angular forms and
  the library parts above; no validation library.

## Acceptance criteria

### Rendering

- **AC-1** Given the home page, when the hero signup renders, then it is a `form.signup` with `novalidate`, named "Get new reviews by email" through `aria-labelledby` on its `h2.signup__title`, holding the promise "One short email per new review. No ads, no sponsors.", an `st-text-field` labelled "Email address" with `type="email"`, `autocomplete="email"` and `inputmode="email"`, and a `button.btn.btn--primary[type=submit]` named "Subscribe". (L2-039)
- **AC-2** Given The Junction Loft's page, when the footer signup renders, then its title is "New reviews by email", its promise is "One email when a new studio or spot goes up. Unsubscribe any time.", and Subscribe has the class `btn` with no variant modifier. (L2-039)
- **AC-3** Given either signup, when a keyboard user tabs from the email field, then focus goes to Subscribe and then out of the form, the `website` input inside `.signup__trap[aria-hidden=true]` has `tabindex="-1"` and `autocomplete="off"`, and it is absent from the accessibility tree. (L2-040)
- **AC-4** Given the footer signup on `/studios/the-junction-loft` with "maya.chen@example.com" entered, when the visitor presses Subscribe, then exactly one request reaches `SubscriberService.subscribe` with `email` "maya.chen@example.com", `sourcePath` "/studios/the-junction-loft" and `website` "". (L2-040)

### Validation

- **AC-5** Given the hero field is empty, when the visitor presses Subscribe, then no request is sent, the input has `aria-invalid="true"` and `aria-describedby` naming the visible error "Enter your email address", and focus is on the input. (L2-039)
- **AC-6** Given the hero field holds "not-an-email", when the visitor presses Subscribe, then no request is sent, the error reads "Enter a valid email address, like name@example.com", and the field still holds "not-an-email". (L2-039)
- **AC-7** Given an address of 255 characters, when the visitor presses Subscribe, then no request is sent and the error reads "Enter a valid email address, like name@example.com". (L2-039)
- **AC-8** Given the "Enter your email address" error is showing, when the visitor types "maya.chen@example.com", then the error and `aria-invalid` are removed without another submit. (L2-039)

### Submitting

- **AC-9** Given a valid address and a pending request, when the form renders, then Subscribe has `aria-busy="true"` and `aria-disabled="true"`, keeps the name "Subscribe" and its width, shows the spinner, and the field stays editable. (L2-041)
- **AC-10** Given Subscribe is busy, when the visitor presses it again or presses Enter in the field, then no second request is sent. (L2-041)

### Outcomes

- **AC-11** Given the server answers HTTP 200 for "maya.chen@example.com", when the response arrives, then the form is replaced by `div.signup[role=status][aria-live=polite]` reading "You're subscribed. We'll email maya.chen@example.com when a new review goes up.", focus is on that element, and the message is announced. (L2-039)
- **AC-12** Given "maya.chen@example.com" is already subscribed and the server answers HTTP 200, when the response arrives, then the visitor sees exactly the same confirmation as a new subscriber and no text says "already". (L2-039)
- **AC-13** Given the server answers HTTP 429, when the response arrives, then a warning `st-alert` with `role="alert"` reading "Too many tries." and "Wait a minute, then try again." appears under the row, the field still holds the address, Subscribe is enabled, and focus is on Subscribe. (L2-041)
- **AC-14** Given the server answers HTTP 500, when the response arrives, then a danger `st-alert` with `role="alert"` reading "We couldn't subscribe you just now." and "Your email is still here — try again." appears under the row, the field still holds "maya.chen@example.com", and Subscribe is enabled. (L2-041)
- **AC-15** Given the server-error alert is showing, when the visitor presses Subscribe again, then the alert is removed, Subscribe goes busy, and the same address is sent once. (L2-041)
- **AC-16** Given a network failure with no HTTP status, when the request fails, then the server-error alert shows and the address is kept. (L2-041)

### Keyboard and focus

- **AC-17** Given focus in the hero field with a valid address, when the visitor presses Enter, then the form submits exactly as if Subscribe were pressed. (L2-067)
- **AC-18** Given a keyboard user tabs to the email input and then to Subscribe, when each takes focus, then a `--focus-ring-width` (2 px) ring in `--color-focus-ring` with at least 3:1 contrast against the page is visible on it. (L2-067)

### Screen readers

- **AC-19** Given the home page in its default, invalid, submitting, success, rate-limited and error states, when axe-core scans the hero and footer signups in light and dark, then it reports no violations, and each form is exposed as a form landmark with its title as name. (L2-069)

### Theming

- **AC-20** Given the hero and footer signups in each state in the light and the dark theme, when the contrast check runs, then the title, label, footer promise, field error, primary Subscribe label and alert texts are at least 4.5:1 against their backgrounds, and the input edge, invalid edge, success tick and focus ring are at least 3:1. (L2-068)

### Responsive

- **AC-21** Given the hero signup at 360 px, when it renders, then the field and Subscribe are stacked and each is the full width of the form. (L2-039)
- **AC-22** Given the hero signup at 768 px with and without the error "Enter your email address", when it renders, then the field and Subscribe share one row, Subscribe keeps its natural width, and its top edge is level with the input's top edge in both cases. (L2-064)
- **AC-23** Given the home page and The Junction Loft's page at 320 px, when they render with the signups in every state, then `document.documentElement.scrollWidth` equals the viewport width, the honeypot included. (L2-064)
- **AC-24** Given the signups at 360 px and at 1280 px, when the email input and Subscribe are measured, then each is at least 44 px tall. (L2-065)
- **AC-25** Given the home page at 200 % zoom in a 1280 px viewport, when the visitor reaches the hero signup, then the field, Subscribe and any message are fully visible and operable with no horizontal page scroll. (L2-066)

### Content and internationalisation

- **AC-26** Given the frontend lint, when it runs over `email-signup.component.html` and `email-signup.component.ts`, then it reports no unmarked user-facing text: every title, promise, label, button, message and the honeypot label is marked `i18n` or `$localize`. (L2-070)

### Motion

The design-system rule (no AC; L2 has no motion requirement): the swap from
form to confirmation is instant and only the busy spinner moves, which keeps
turning under `prefers-reduced-motion: reduce`
([signup.html](../../design-system/components/signup.html), Accessibility › Motion).

### Performance

- **AC-27** Given the home page on the Lighthouse mobile profile, when the visitor submits "maya.chen@example.com" in the hero and the confirmation replaces the form, then the interaction-to-next-paint is at most 200 ms and the content below the hero does not move. (L2-071)

## Implementation notes

- Folder `frontend/projects/shot-there/src/app/features/email-signup/email-signup/`:
  `email-signup.component.ts` (`EmailSignupComponent`, selector
  `st-email-signup`, `OnPush`, reactive form `{ email: string, website: string }`),
  `email-signup.component.html`, `email-signup.component.css` (port of
  `.signup`, `.signup__title`, `.signup__row`, `.signup__trap`,
  `.signup__done`, plus `.signup__field`, `.signup__submit` and `.signup__tick`
  placement rules), `signup-form.ts`, `signup-state.ts`, `signup-variant.ts`.
  The subscribe-by-email design places the files in `features/email-signup/`;
  the folder above follows the CRD convention for application components.
- `SubscriberService`, `HttpSubscriberService` and `SubscribeRequest` live in
  `@shot-there/api` (`frontend/projects/api/src/lib/…`, ICD-002 D-1); the app
  registers `{ provide: SubscriberService, useClass: HttpSubscriberService }`.
- Submit: validate with `validateEmail`; on a message set state `invalid`,
  mark the email control touched and focus `#{prefix}-email` in
  `afterNextRender`; otherwise measure the form's height (`formHeight`), set
  `submitting`, call `subscribe`, then map the status with `toSignupState`. On
  success keep the address for the sentence and focus `#done` in `afterNextRender`.
- After the first refused submit, the email control re-validates on input and
  blur (forms pattern: "a field re-validates on input and blur").
- CSS the component does **not** port: the design system's
  `.signup__row .btn` and `.site-footer .signup*` rules, which target library
  classes (ICD-DOM-5) and are replaced by `.signup__submit`, `.signup__tick` and
  the shell's `footer-signup` class.
- Mocks drift the component corrects: the inline `style="align-self: flex-end"`
  on Subscribe (now `.signup__submit`); native `disabled` on the busy Subscribe
  (now `aria-disabled`); the invalid mock's `autofocus`; the error after the
  row (now inside the field, D-1); the success mock does not move focus (now it does).

## Decisions

- **D-1** *The design system puts the email error under the row, outside the field; `st-text-field` renders it inside `.field` (ICD-FORM-5). Where does it go, and how does Subscribe stay level with the input?* Inside the field, under the input, as [form-field.md](form-field.md) D-5 and [text-field.md](text-field.md) D-11 decide. From 36rem the row aligns to the top and Subscribe takes a top margin equal to the label line and its gap, so it stays level with the input whether or not an error shows. Below 36rem the order is field, error, Subscribe. The design-system page catches up.
- **D-2** *The design system's `.signup__row .btn` and `.site-footer .signup .btn` rules target library classes, which ICD-DOM-5 forbids.* Not ported. Subscribe is placed through the component's own `signup__submit` class on the button host (width, margin, flex only). The footer colour override existed because unscoped footer link styles reached the button; emulated encapsulation stops that ([footer.md](footer.md) D-1).
- **D-3** *How does the success tick get `--color-success-icon` when the application may not colour a library host?* The `st-icon` sits in the component's own `span.signup__tick`, which sets the colour; the icon's `currentColor` inherits it.
- **D-4** *What `action` and `method` does the form carry?* `method="post"` and `action="/api/subscribers"` (the subscribe-by-email endpoint, replacing the design system's `/api/signup`). Angular's form directive prevents the native submission once hydrated; before hydration a submit can never put the address in a URL.
- **D-5** *What does HTTP 400 show?* The server-error alert, as the design's `toSignupState` maps every failure except 429. The browser check already catches empty, malformed and over-254-character addresses, so a 400 is unexpected and "try again" is honest.
- **D-6** *Replacing the form with a one-line confirmation would pull the content below upward after the response, a layout shift L2-071 counts.* The confirmation wrapper takes the form's height measured at submit as its `min-height`, so nothing below moves.
- **D-7** *Which input chooses the placement, and what is it called?* `variant: 'hero' | 'footer'`, required, because the two placements differ in copy and emphasis and nothing else. ([footer.md](footer.md)'s consumer example writes `variant="compact"`; the value is `footer`.)
- **D-8** *Which heading level do the titles use?* `h2` in both placements: the hero sits under the home page's `h1`, and the footer title is the first heading in the content-info landmark. The design system and every mock use `h2`.
- **D-9** *When does a field error clear?* On the next input or blur that makes the address valid, after the first refused submit (forms pattern, validation timing). Before any submit, nothing is validated.
