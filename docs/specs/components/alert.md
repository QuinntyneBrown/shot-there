# Alert

| Field | Value |
|---|---|
| Selector | `st-alert` |
| Library path | `frontend/projects/components/src/lib/alert/` |
| Status | planned |
| Traces to | L2-005, L2-018, L2-026, L2-032, L2-041, L2-049, L2-050, L2-051, L2-054, L2-056, L2-058, L2-061, L2-064, L2-065, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 |
| Design system | [`alert.html`](../../design-system/components/alert.html), [`notifications.html`](../../design-system/patterns/notifications.html) |
| Source mocks | [`pages/studio/stale`](../../mocks/pages/studio/stale.html), [`pages/spot/stale-permit`](../../mocks/pages/spot/stale-permit.html), [`pages/sign-in/session-expired`](../../mocks/pages/sign-in/session-expired.html), [`pages/sign-in/signed-out`](../../mocks/pages/sign-in/signed-out.html), [`pages/sign-in/incorrect`](../../mocks/pages/sign-in/incorrect.html), [`pages/sign-in/error`](../../mocks/pages/sign-in/error.html), [`pages/sign-in/rate-limited`](../../mocks/pages/sign-in/rate-limited.html), [`pages/home/error`](../../mocks/pages/home/error.html), [`pages/home/rate-limited`](../../mocks/pages/home/rate-limited.html), [`pages/compare/over-limit`](../../mocks/pages/compare/over-limit.html), [`pages/compare/unknown-slug`](../../mocks/pages/compare/unknown-slug.html), [`pages/studio-editor/success`](../../mocks/pages/studio-editor/success.html), [`pages/spot-editor/success`](../../mocks/pages/spot-editor/success.html), [`pages/guide-editor/success`](../../mocks/pages/guide-editor/success.html), [`pages/admin-dashboard/partial`](../../mocks/pages/admin-dashboard/partial.html), [`dialogs/unpublish/failed`](../../mocks/dialogs/unpublish/failed.html), [`dialogs/delete-content/failed`](../../mocks/dialogs/delete-content/failed.html), [`dialogs/remove-image/refused`](../../mocks/dialogs/remove-image/refused.html) |
| Rendering | [`alert.html`](alert.html) |

## Purpose and scope

An alert is a tinted block that stays on the page as long as something is true:
these prices may be out of date, your session expired, too many sign-in
attempts, we couldn't load the re-verification list. It sits inside the
content it is about (under the pricing, above the sign-in form, at the top of a
dialog body) and never leaves on a timer. Its tone (info, success, warning,
danger) is the meaning; its live role (`status`, `alert` or none) is the
urgency, chosen separately by the application.

Use a [toast](toast.md) for the result of an action whose effect is elsewhere
("Link copied", "Corktown Garage Studio is published"); an inline field
message ([`form-field.md`](form-field.md)) for one field or one image row; the
[empty state](empty-state.md) or [error page](error-page.md) when a page or
list could not load at all; the [error summary](form-field.md) when a save is
refused with field errors; a [badge](badge.md) for a standing flag on a card or
row ("Prices may be out of date" in the summary panel).

Out of scope:

- Whether an alert shows, which tone and role it has, and its copy (the
  server's stale flag, the sign-in answer, the comparison link rules): the
  application's (ICD-API-10).
- Removing the alert after Dismiss and moving focus afterwards: the
  application's (`dismissed` output, D-2).
- Retrying: "Try again" is the consumer's button in the `action` slot, or the
  dialog footer's own button in a dialog.
- A failed or refused image upload: an inline `.field__error` with
  `role="alert"` in the image row (DS alert, Overview), not an alert.
- Wiring a dialog's `aria-describedby` to the alert text: [`st-dialog`](dialog.md)'s.

## Usage

Every `.alert` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks alert "div|p|section|aside"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/studio/stale` pricing section | warning, `role="status"`, title | "Prices may be out of date" / "We last checked these prices 225 days ago. Confirm with the studio before you book." | present (Ossington Blackbox, verified 2 Mar 2026) | canvas (review section) |
| `pages/spot/stale-permit` permit section | warning, `role="status"`, title | "Permit rules may be out of date" / "We last checked these rules 207 days ago. Confirm with the Distillery District before you shoot." | present | canvas |
| `pages/sign-in/session-expired` above the form | info, `role="status"`, title | "Your session expired" / "Sign in again to carry on where you were." | present at load | surface (auth card) |
| `pages/sign-in/signed-out` | success, `role="status"`, title, link action | "You've signed out." / "Your session has ended on this device." + link "Go to the public site" | present at load; link hover, focus | surface (auth card) |
| `pages/sign-in/incorrect` | danger, `role="alert"`, title | "Email or password is incorrect" / "Check both and try again. Passwords are case-sensitive." | inserted after submit | surface (auth card) |
| `pages/sign-in/error` | danger, `role="alert"`, title | "We couldn't sign you in just now" / "Try again in a minute. What you typed is still here." | inserted after submit | surface (auth card) |
| `pages/sign-in/rate-limited` | warning, `role="alert"`, title | "Too many sign-in attempts" / "Wait 15 minutes, then try again." | inserted after submit | surface (auth card) |
| `pages/home/error` hero signup (and the footer signup on every public page) | danger, `role="alert"`, title | "We couldn't subscribe you just now." / "Your email is still here — try again." | inserted after submit | canvas |
| `pages/home/rate-limited` signup | warning, `role="alert"`, title | "Too many tries." / "Wait a minute, then try again." | inserted after submit | canvas |
| `pages/compare/over-limit`, `pages/compare/unknown-slug` above the table | info, `role="status"`, body only | "You can compare up to 4 studios. We're showing the first 4 from this link." / "One studio in this link couldn't be found, so we're comparing the other two." | present at load | canvas |
| `pages/studio-editor/success` above the editor | success, `role="status"`, title, `dismissible` | "Studio created as a draft" / "Its address will be `/studios/corktown-garage-studio`." | present after create; Dismiss hover, focus | canvas |
| `pages/spot-editor/success`, `pages/guide-editor/success` | success, `role="status"`, title, `dismissible` (D-10) | "Spot created as a draft" / "Its address will be `/spots/scarborough-bluffs`. …"; "Guide created as a draft" / "Its address will be `/guides/best-for-headshots`. …" | present after create | canvas |
| `pages/admin-dashboard/partial` re-verification section | danger, `role="alert"`, title, button action | "We couldn't load the re-verification list." / "The counts above are current. Try again to see what needs checking." + small secondary button with `refresh` icon "Try again" | inserted after the failed fetch; action hover, focus, active, busy | canvas |
| `dialogs/unpublish/failed`, `dialogs/delete-content/failed` dialog body | danger, `role="alert"`, body only | "We couldn't unpublish it. Nothing changed. Try again." / "We couldn't delete it. Try again." (the footer's Unpublish / Delete studio retries) | inserted after the failed request | dialog surface |
| `dialogs/remove-image/refused` dialog body | warning, no role, body only, `id` on the host referenced by `st-dialog`'s `describedBy` | "A published studio needs at least one standard test shot. Add another before removing this one." | present when the dialog opens | dialog surface |
| No mock today | any tone with `banner` | full-width strip under the site header | — (D-3) | canvas, full bleed |

Every row is buildable with the API below: tone, title, role, `banner` and
`dismissible` are inputs; the body paragraphs (with any `<code>`) are the
default slot; one link or small button is the `action` slot; a native `id` on
the host lets a dialog reference the alert.

## Anatomy

1. **Container** — the host `st-alert`, carrying `.alert` and `.alert--{tone}`
   (and `.banner` when `banner`). Flex row, `--space-3` gap, `--space-4`
   padding, 1 px tone border, `--radius-md`, tone fill and ink. Fills the width
   of its column.
2. **Tone icon** — [`st-icon`](icon.md) with the tone's name (`info`,
   `success`, `warning`, `danger`): `svg.icon`, `aria-hidden="true"`,
   `--icon-size-md`, in `--alert-icon`, nudged 0.1rem down to sit on the first
   line. Its shape (circled i, circled tick, triangle, circled !) repeats the tone
   without colour.
3. **Body** — `div.alert__body`: a column with `--space-1` gaps that takes the
   remaining width (`flex: 1; min-width: 0`) and breaks long words anywhere.
4. **Title (optional)** — `p.alert__title`, rendered only when `title` is a
   non-empty string. `--text-label` at `--font-size-md`. Not a heading.
5. **Text** — the default slot: one or two `<p>` the consumer projects, or bare
   text for a one-sentence alert.
6. **Actions (optional)** — `div.alert__actions` holding the `action` slot:
   one small button or one link. Always rendered; collapses when empty (D-4).
7. **Dismiss (optional)** — `button.close` at the end of the row, rendered only
   when `dismissible`: `type="button"`, `aria-label` from `dismissLabel`, an
   `st-icon` `close` inside. 24 × 24 from 48rem, 44 × 44 below.

Host: `st-alert` is the `.alert` box itself (ICD-DOM-1). The component sets
`class`, `role` on the host through host bindings; the consumer may add a
native `id`, and margin, flex or grid placement and width to the host
(ICD-DOM-5), as the mocks' `margin-bottom: var(--space-6)` above an editor does.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `Exclude<Tone, 'neutral'>` (`'info' \| 'success' \| 'warning' \| 'danger'`) | `'info'` | no | Adds `.alert--{tone}` (always, `info` included, D-5) and picks the icon: `info` → `info`, `success` → `success`, `warning` → `warning`, `danger` → `danger`. |
| `title` | `string \| null` | `null` | no | When a non-empty string, renders `p.alert__title` first in the body. `null` or `''` renders no title element (body-only alert). Product copy. |
| `role` | `'alert' \| 'status' \| null` | `null` | no | Reflected as the host's `role` attribute; `null` renders none. `alert` for a request the person just made that was refused or failed; `status` for conditions found at load or after a successful step; `null` for static text, such as a dialog's description. Independent of `tone` (D-11). |
| `banner` | `boolean` | `false` | no | Adds `.banner`: full-bleed strip with no radius or side borders (D-3). |
| `dismissible` | `boolean` | `false` | no | Renders the Dismiss button. |
| `dismissLabel` | `string` | `$localize` `@@st.alert.dismiss` "Dismiss" | no | The Dismiss button's `aria-label`. |

Inputs are signal inputs; `banner` and `dismissible` use `booleanAttribute`.
`role` is both the input and the host attribute, so `<st-alert role="status">`
works as written.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `dismissed` | `void` | The Dismiss button is activated (click, Enter or Space). Once per activation. The component does not hide or remove itself; the application removes it (D-2). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | One or two `<p>` (inline `<code>`, `<strong>`, `<time>` allowed), or bare text for one sentence | The body text after the title. Product copy, marked `i18n` by the consumer. |
| `action` (`[slot=action]`) | One `button[st-button]` with `size="sm"`, or one link (`a[st-link]`, or `a[st-button]` with `variant="link"`) | Placed in `.alert__actions`. At most one (DS Content). |

Library string (ICD §12): `st.alert.dismiss` "Dismiss", overridden by `dismissLabel`.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Info | `.alert--info` | Neutral facts about what the page is showing: "Your session expired", "You can compare up to 4 studios. We're showing the first 4 from this link." |
| Success | `.alert--success` | A step that worked and changed the screen: "You've signed out.", "Studio created as a draft". |
| Warning | `.alert--warning` | Data that may be wrong or a wait the person must respect: "Prices may be out of date", "Too many sign-in attempts", the refused test-shot removal. |
| Danger | `.alert--danger` | A request that was refused or failed: "Email or password is incorrect", "We couldn't unpublish it. Nothing changed. Try again." |
| With title | `p.alert__title` present | Two-part alerts: condition, then what to do. |
| Body only | no title | One-sentence alerts (comparison notes, dialog failures). |
| With action | `.alert__actions` filled | "Try again" (button) on the dashboard; "Go to the public site" (link) after sign-out. |
| Dismissible | `button.close` present | The editors' "created as a draft" alerts. |
| Banner | `.banner` | A page-wide notice under the site header: full bleed, centred, side padding `--layout-margin` (D-3). |

One size. The alert takes the width of the column it sits in (review section,
auth card, dialog body, editor column); the banner takes the viewport width.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Present | rendered by the application | Tone fill, border, icon, title, text | Read in place; with `role="status"` announced politely when inserted or changed, with `role="alert"` announced at once |
| Static (no role) | `role` null | Same | Not a live region; read in reading order or through the dialog's description |
| Dismiss default | `dismissible` | Transparent square, close icon in the tone ink | Button "Dismiss" |
| Dismiss hover | `:hover` | `currentColor` at 8 % behind the icon | — |
| Dismiss focus | `:focus-visible` | `--focus-ring-width` ring in `--color-focus-ring`, offset `--focus-ring-offset` (at least 3:1 on every tone fill) | Focus on "Dismiss" |
| Dismiss active | `:active` | Same as hover | — |
| Dismissed | Dismiss activated | No change by the component; `dismissed` emitted | The application removes the alert and moves focus (D-2) |
| Action default, hover, focus, active | projected button or link | The projected component's own states ([button.md](button.md), [link.md](link.md)) | Button or link role, its own name |
| Action busy | consumer sets `busy` on the projected "Try again" | Button busy look | `aria-busy`; the alert stays |
| Gone | the application stops rendering it | Removed with no animation | Nothing announced |
| Banner | `banner` | Full bleed, no radius, bottom border only, centred row | Same as the alert |

Disabled does not apply: a retry is always allowed (DS States).

## Markup

```html
<!-- rendered: warning with title, status role (Ossington Blackbox pricing) -->
<st-alert class="alert alert--warning" role="status">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4 2.5 20h19L12 4z"/><path d="M12 10v4M12 17h.01"/></svg>
  <div class="alert__body">
    <p class="alert__title">Prices may be out of date</p>
    <p>We last checked these prices 225 days ago. Confirm with the studio before you book.</p>
    <div class="alert__actions"></div>
  </div>
</st-alert>
```

```html
<!-- rendered: info, body only (comparison link trimmed) -->
<st-alert class="alert alert--info" role="status">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
  <div class="alert__body">
    <p>You can compare up to 4 studios. We're showing the first 4 from this link.</p>
    <div class="alert__actions"></div>
  </div>
</st-alert>
```

```html
<!-- rendered: danger with a button action (dashboard re-verification list) -->
<st-alert class="alert alert--danger" role="alert">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/></svg>
  <div class="alert__body">
    <p class="alert__title">We couldn't load the re-verification list.</p>
    <p>The counts above are current. Try again to see what needs checking.</p>
    <div class="alert__actions"><button class="btn btn--sm" type="button"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg>Try again</button></div>
  </div>
</st-alert>
```

```html
<!-- rendered: success, dismissible (studio created) -->
<st-alert class="alert alert--success" role="status">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>
  <div class="alert__body">
    <p class="alert__title">Studio created as a draft</p>
    <p>Its address will be <code>/studios/corktown-garage-studio</code>.</p>
    <div class="alert__actions"></div>
  </div>
  <button class="close" type="button" aria-label="Dismiss"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
</st-alert>
```

```html
<!-- rendered: warning, no role, as a dialog description (remove image refused) -->
<st-alert id="refused-rule" class="alert alert--warning">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4 2.5 20h19L12 4z"/><path d="M12 10v4M12 17h.01"/></svg>
  <div class="alert__body">
    <p>A published studio needs at least one standard test shot. Add another before removing this one.</p>
    <div class="alert__actions"></div>
  </div>
</st-alert>
```

```html
<!-- rendered: banner -->
<st-alert class="alert alert--info banner" role="status">…same parts…</st-alert>
```

The success-with-link variant differs only in its action
(`<a href="/">Go to the public site</a>` from the consumer's `a[st-link]`).
Each `svg.icon` sits inside its `st-icon` host; host tag names and Angular's
`_ngcontent-*` attributes are not part of the contract (ICD-DOM-3). The empty
`div.alert__actions` is part of the DOM and takes no space (D-4).

```html
<!-- consumer: stale price warning (studio page) -->
<st-alert tone="warning" role="status" i18n-title title="Prices may be out of date">
  <p i18n>We last checked these prices {{ vm().priceAgeDays }} days ago. Confirm with the studio before you book.</p>
</st-alert>

<!-- consumer: sign-in refused -->
@if (vm().error === 'incorrect') {
  <st-alert tone="danger" role="alert" i18n-title title="Email or password is incorrect">
    <p i18n>Check both and try again. Passwords are case-sensitive.</p>
  </st-alert>
}

<!-- consumer: dashboard list failed, with a retry -->
<st-alert tone="danger" role="alert" i18n-title title="We couldn't load the re-verification list.">
  <p i18n>The counts above are current. Try again to see what needs checking.</p>
  <button st-button size="sm" type="button" slot="action" [busy]="reloading()" (click)="reload()">
    <st-icon name="refresh" /><ng-container i18n>Try again</ng-container>
  </button>
</st-alert>

<!-- consumer: created as a draft, dismissible -->
@if (showCreated()) {
  <st-alert tone="success" role="status" dismissible i18n-title title="Studio created as a draft" (dismissed)="dismissCreated()">
    <p i18n>Its address will be <code>{{ vm().publicPath }}</code>.</p>
  </st-alert>
}

<!-- consumer: dialog description (st-dialog describedBy="refused-rule") -->
<st-alert id="refused-rule" tone="warning">
  <p i18n>A published studio needs at least one standard test shot. Add another before removing this one.</p>
</st-alert>
```

## Design

- Layout: flex row, `gap` `--space-3`, `padding` `--space-4`; body column `gap` `--space-1`, `flex: 1`, `min-width: 0`, `overflow-wrap: anywhere`.
- Title `--text-label` at `--font-size-md`; text inherits the body type (`--text-body`); actions row `gap` `--space-3`, `margin-top` `--space-1`, wraps.
- Shape: `--border-width-hairline` border in `--alert-border`, `--radius-md`.
- Icon `--icon-size-md`, `flex: none`, in `--alert-icon`.
- Dismiss: `--target-min` square (24 px) from 48rem, `--target-comfortable` (44 px) below; `--radius-sm`; transparent, ink inherited; pulled up and right by `--space-1` so the icon aligns with the title.
- Focus ring: `--focus-ring-width` in `--color-focus-ring`, offset `--focus-ring-offset`.
- Elevation: none. Motion: none (alerts appear with the content). Layer: in flow.
- Banner: `border-radius: 0`, no top or side borders, `justify-content: center`, `padding-inline` `--layout-margin`; the body becomes a wrapping row (`gap` `--space-4`, centred) (D-3).

Component tokens (declared on `.alert`, set by each tone modifier):

| Token | Aliases | Overridden by |
|---|---|---|
| `--alert-bg` | `--color-info-bg` | success `--color-success-bg`; warning `--color-warning-bg`; danger `--color-danger-bg` |
| `--alert-fg` | `--color-info-fg` | `--color-success-fg`, `--color-warning-fg`, `--color-danger-fg` |
| `--alert-border` | `--color-info-border` | `--color-success-border`, `--color-warning-border`, `--color-danger-border` |
| `--alert-icon` | `--color-info-icon` | `--color-success-icon`, `--color-warning-icon`, `--color-danger-icon` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Info fill | `--color-info-bg` | `--palette-stone-50` | `--palette-stone-900` |
| Info text | `--color-info-fg` | `--palette-stone-800` | `--palette-stone-200` |
| Info border | `--color-info-border` | `--palette-stone-300` | `--palette-stone-700` |
| Info icon | `--color-info-icon` | `--palette-stone-700` | `--palette-stone-350` |
| Success fill | `--color-success-bg` | `--palette-callaloo-50` | `--palette-callaloo-950` |
| Success text | `--color-success-fg` | `--palette-callaloo-700` | `--palette-callaloo-300` |
| Success border | `--color-success-border` | `--palette-callaloo-300` | `--palette-callaloo-700` |
| Success icon | `--color-success-icon` | `--palette-callaloo-500` | `--palette-callaloo-300` |
| Warning fill | `--color-warning-bg` | `--palette-mango-50` | `--palette-mango-950` |
| Warning text | `--color-warning-fg` | `--palette-mango-700` | `--palette-mango-300` |
| Warning border | `--color-warning-border` | `--palette-mango-300` | `--palette-mango-700` |
| Warning icon | `--color-warning-icon` | `--palette-mango-500` | `--palette-mango-300` |
| Danger fill | `--color-danger-bg` | `--palette-sorrel-50` | `--palette-sorrel-950` |
| Danger text | `--color-danger-fg` | `--palette-sorrel-600` | `--palette-sorrel-300` |
| Danger border | `--color-danger-border` | `--palette-sorrel-300` | `--palette-sorrel-700` |
| Danger icon | `--color-danger-icon` | `--palette-sorrel-500` | `--palette-sorrel-300` |
| Focus ring | `--color-focus-ring` | `--palette-pepper-600` | `--palette-pepper-300` |
| Link action | `--color-fg-link` | `--palette-stone-950` | `--palette-stone-100` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info title and text |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | Success title and text |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning title and text |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger title and text |
| `--color-info-icon` | `--color-info-bg` | 3:1 | Info icon |
| `--color-success-icon` | `--color-success-bg` | 3:1 | Success icon |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | Warning icon |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Danger icon |
| `--color-focus-ring` | `--color-info-bg` | 3:1 | Focus ring on an info alert |
| `--color-focus-ring` | `--color-success-bg` | 3:1 | Focus ring on Dismiss (success) |
| `--color-focus-ring` | `--color-warning-bg` | 3:1 | Focus ring on a warning alert |
| `--color-focus-ring` | `--color-danger-bg` | 3:1 | Focus ring on "Try again" (danger) |
| `--color-fg-link` | `--color-success-bg` | 4.5:1 | "Go to the public site" (D-1) |
| `--color-border-strong` | `--color-danger-bg` | 3:1 | "Try again" button edge (D-1) |

The tone border is decorative (the fill, icon shape and words carry the
meaning), so it has no minimum. Forced colours: the fill disappears, and the
1 px border, the icon shape and the text remain; the Dismiss button keeps a
`CanvasText` icon.

## Responsive behaviour

- The alert fills its column at every width; the icon and Dismiss keep their
  size and the body wraps between them. Long addresses such as
  `/studios/corktown-garage-studio` and `/guides/best-for-headshots` break
  anywhere (`overflow-wrap: anywhere`); text never truncates.
- Below 48rem the Dismiss button is `--target-comfortable` (44 × 44) and a small
  action button is 44 px tall ([button.md](button.md)); from 48rem Dismiss is
  `--target-min` (24 × 24) and the action is 36 px.
- The actions row wraps onto its own line under the text at every width.
- Banner: full viewport width at every breakpoint, `--layout-margin` side
  padding (16 px below 48rem, 32 px from 48rem), title and text on one row that
  wraps; Dismiss 44 × 44 below 48rem.
- Placement (under the pricing, above the form, top of the dialog body) is the
  page's and does not change by breakpoint.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 24 × 24 CSS px, and 44 × 44 below 48rem.

## Accessibility

### Role and pattern

[APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) for
`role="alert"`; WCAG 4.1.3 Status Messages for `role="status"`. The role
follows urgency, not tone: a rate limit is a warning with `role="alert"`; a
stale price is a warning with `role="status"`. An alert with no role is plain
content. The alert is not focusable and never traps or moves focus.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches the action, then Dismiss, in DOM order. The alert itself is not a tab stop. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | On Dismiss: emits `dismissed`. On a button action: activates it. |
| <kbd>Enter</kbd> | On a link action: follows it. |
| <kbd>Escape</kbd> | Nothing; an alert is not an overlay (D-8). |

### Focus

The alert never takes focus: on sign-in pages focus stays on the email or
password field while the alert is announced. The focus ring on the action
and on Dismiss keeps 3:1 on every tone fill. After Dismiss the application
removes the alert and moves focus to the next heading (the editor's "Status"
heading), so focus is not lost on the removed button (D-2).

### Labelling

- The title and text are the content; the icon is `aria-hidden="true"`; the
  tone is said in words ("may be out of date", "couldn't", "incorrect"), never
  in colour alone.
- Dismiss is named by `dismissLabel` ("Dismiss").
- The title is a paragraph, not a heading, so alerts never break the page's
  heading outline (L2-069.1).
- When the alert is a dialog's description, the consumer puts an `id` on the
  host and [`st-dialog`](dialog.md)'s `describedBy` references it; the alert has
  no role, so the text is not announced twice.

### Announcements

The host is the live region when `role` is set: `status` (polite) or `alert`
(assertive, read at once). For an announcement to happen, the application
inserts the alert (or changes its text) after the page has loaded, as the
sign-in answers and dialog failures do; an alert present in the server HTML is
read in place. The component never announces anything else.

### Motion

None. Alerts appear and go with the content; no slide or fade (DS Motion).
Dismiss's hover background has no transition.

## Content and internationalisation

- Title: the condition in sentence case, a few words: "Prices may be out of
  date", "Your session expired", "Too many sign-in attempts".
- Text: what it means and the next step, with the real number: "We last checked
  these prices 225 days ago. Confirm with the studio before you book."
- "We" for ShotThere's side of a failure ("We couldn't sign you in just now")
  and reassurance about what is kept ("What you typed is still here", "Nothing
  changed", "Your email is still here — try again").
- Waits are exact: "Wait 15 minutes, then try again.", "Wait a minute, then try
  again."
- At most one action, as a verb phrase: "Try again", "Go to the public site".
- Drop the title when the alert is one sentence ("One studio in this link
  couldn't be found, so we're comparing the other two.").
- Translatable: `title`, the default slot, the action's label, `dismissLabel`.
  Data inside the text: day counts (formatted by the application), studio and
  spot names ("Distillery District"), addresses (`/studios/corktown-garage-studio`).
- French runs about 30 % longer: the body wraps and the alert grows in height;
  nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; the host class list and the icon
  name come from one `computed` each.
- No listeners except the Dismiss button's click; no timers; no projected-content
  queries (the empty actions row is hidden by CSS, D-4).
- Server rendering: the alert renders fully on the server, so the stale
  warnings are in the public page's HTML (L2-074) and hydrate without change.
- Performance scenario: the `components-harness` route `alert/performance`
  renders the studio page's pricing section for Ossington Blackbox with its
  stale warning, the four sign-in alerts and the dashboard's danger alert with
  "Try again"; loading it must add no layout shift and stay within the L2-071
  budget.
- Regression rule: a change to the template, inputs, styles or change detection
  is measured on that route against the base branch before it is pushed.
- Layout stability: the icon and Dismiss have fixed sizes, so nothing moves when
  fonts or icons load.
- Weight: imports `@angular/core` and the library's `st-icon`; no CDK.

## Acceptance criteria

### Rendering

- **AC-1** Given Ossington Blackbox's page with pricing verified 2 Mar 2026 (225 days), when the pricing section renders `<st-alert tone="warning" role="status" title="Prices may be out of date">`, then the host has the classes `alert alert--warning` and `role="status"`, contains a `p.alert__title` "Prices may be out of date" followed by "We last checked these prices 225 days ago. Confirm with the studio before you book.", and an `aria-hidden` triangle icon. (L2-005)
- **AC-2** Given the Distillery District page with permits verified 20 Mar 2026, when the permit section renders the warning alert, then it reads "Permit rules may be out of date" and "We last checked these rules 207 days ago. Confirm with the Distillery District before you shoot." with `role="status"`. (L2-018)
- **AC-3** Given Ossington Blackbox's page fetched with JavaScript disabled, when the HTML is inspected, then the stale alert's title and text are present in the server response. (L2-074)
- **AC-4** Given `/compare` opened with five studio slugs, when the info alert renders without a title, then the host has `alert alert--info` and `role="status"`, contains no `.alert__title` element, and its only text is "You can compare up to 4 studios. We're showing the first 4 from this link.". (L2-032)
- **AC-5** Given `/compare` opened with one unknown slug and two valid slugs, when the page renders, then an info alert reads "One studio in this link couldn't be found, so we're comparing the other two.". (L2-032)
- **AC-6** Given an alert with `tone` not set, when it renders, then it carries `.alert--info` and the circled-i icon; given `role` not set, the host has no `role` attribute. (L2-069)

### Variants and states

- **AC-7** Given the sign-in form submitted with a wrong password, when the application inserts the danger alert "Email or password is incorrect" / "Check both and try again. Passwords are case-sensitive.", then the host has `role="alert"`, the text is announced at once, and focus stays in the password field. (L2-049)
- **AC-8** Given a sixth failed sign-in within 15 minutes, when the warning alert "Too many sign-in attempts" / "Wait 15 minutes, then try again." is inserted, then it has `.alert--warning` and `role="alert"`. (L2-050)
- **AC-9** Given the sign-in page reached after a 12-hour idle session, when it renders, then an info alert with `role="status"` reads "Your session expired" / "Sign in again to carry on where you were.". (L2-051)
- **AC-10** Given the sign-in page after "Sign out", when it renders the success alert with a link in the `action` slot, then `.alert__actions` contains the link "Go to the public site", which is reachable by Tab and follows on Enter. (L2-051)
- **AC-11** Given the home signup returning HTTP 500, when the danger alert "We couldn't subscribe you just now." / "Your email is still here — try again." is inserted, then it has `role="alert"`; given HTTP 429, the warning alert "Too many tries." / "Wait a minute, then try again." has `role="alert"`. (L2-041)
- **AC-12** Given the dashboard whose re-verification list failed to load, when the danger alert renders with a small "Try again" button in the `action` slot and the owner activates it, then the consumer's handler runs once and the alert stays rendered until the application removes it. (L2-026)
- **AC-13** Given the Unpublish dialog after a failed request, when the body shows the danger alert "We couldn't unpublish it. Nothing changed. Try again." with no `action` slot, then the empty `.alert__actions` takes no height and the dialog footer's "Unpublish" is the retry. (L2-056)
- **AC-14** Given the delete dialog for Corktown Garage Studio after a failed request, when the alert "We couldn't delete it. Try again." renders, then it has `.alert--danger` and `role="alert"`. (L2-061)
- **AC-15** Given the Remove image dialog refusing the last test shot, when the warning alert renders with `role` null and `id="refused-rule"` on the host, referenced by the dialog's `describedBy`, then the host has no `role` attribute and the dialog's accessible description is "A published studio needs at least one standard test shot. Add another before removing this one.". (L2-058)
- **AC-16** Given Corktown Garage Studio's editor after its first save, when the success alert "Studio created as a draft" renders with `dismissible` and the owner activates "Dismiss", then `dismissed` is emitted exactly once and the component itself stays in the DOM until the application removes it. (L2-054)

### Keyboard and focus

- **AC-17** Given the "Studio created as a draft" alert, when a keyboard user tabs to Dismiss and presses Enter, and on another render presses Space, then each key emits `dismissed` once; Escape emits nothing. (L2-067)
- **AC-18** Given the success alert's Dismiss and the danger alert's "Try again", when each receives keyboard focus, then a `--focus-ring-width` ring in `--color-focus-ring` is drawn with at least 3:1 against the tone fill, in light and dark. (L2-067)

### Screen readers

- **AC-19** Given every alert configuration in the usage table, when axe-core scans the `alert` harness routes in light and dark, then no violations are reported, the icon is hidden from the accessibility tree, and Dismiss is named "Dismiss". (L2-069)
- **AC-20** Given an alert with a title, when the heading outline of the page is inspected, then the title is a paragraph and adds no heading. (L2-069)
- **AC-21** Given `dismissLabel` not set, when the application is extracted for translation, then the Dismiss label comes from the `$localize` string `@@st.alert.dismiss` "Dismiss"; given `dismissLabel="Close notice"`, the button's name is "Close notice". (L2-070)

### Theming

- **AC-22** Given info, success, warning and danger alerts with a title, text and focus ring, when the contrast check runs in light and dark, then title and text are at least 4.5:1 against the fill, the icon at least 3:1, and the focus ring at least 3:1. (L2-068)
- **AC-23** Given the four tones rendered side by side, when colour is removed (forced colours or greyscale), then each tone is still identified by its distinct icon shape and its words. (L2-068)

### Responsive

- **AC-24** Given the studio editor at 320 px wide with "Its address will be /studios/corktown-garage-studio.", when the alert renders, then the address wraps inside the alert and `document.documentElement.scrollWidth` equals the viewport width. (L2-064)
- **AC-25** Given the dismissible alert and the dashboard's "Try again" at 360 px, when measured, then Dismiss is at least 44 × 44 CSS px and "Try again" at least 44 px tall; at 1280 px Dismiss is 24 × 24. (L2-065)
- **AC-26** Given an alert with `banner` at 320 px and at 1280 px, when it renders under the site header, then it has the classes `alert alert--info banner`, spans the viewport width with no radius and no side borders, and the page has no horizontal scroll. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): alerts appear
and go with no animation in every motion setting
([alert.html](../../design-system/components/alert.html), Accessibility › Motion).

### Performance

- **AC-27** Given the `alert/performance` harness route, when it is measured with Lighthouse in mobile mode, then the alerts add no layout shift after first paint (CLS at most 0.1 for the route) and pressing "Try again" has an interaction-to-next-paint of at most 200 ms. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/alert/`: `alert.component.ts`
  (`AlertComponent`, selector `st-alert`), `alert.component.html`,
  `alert.component.css` (port of `.alert*`, `.alert .close` and the restored
  `.banner` rules, written against `:host(.alert)`, `:host(.alert--warning)`,
  `:host(.banner)` …). Type `Tone` in `src/lib/types/tone.ts`; the role union is
  inline in the input.
- Host bindings: `[class]` from a `computed` of tone and banner
  (`alert alert--{tone}` plus `banner`); `[attr.role]` from `role()`.
- Template: `<st-icon [name]="icon()" />`, then `div.alert__body` with
  `@if (title()) { <p class="alert__title">{{ title() }}</p> }`, `<ng-content />`,
  `<div class="alert__actions"><ng-content select="[slot=action]" /></div>`;
  then `@if (dismissible()) { <button class="close" type="button" [attr.aria-label]="dismissLabel()" (click)="dismissed.emit()"><st-icon name="close" /></button> }`.
- CSS: `.alert__actions:empty { display: none; }` (D-4). The DS rule
  `.alert__actions a, .alert__actions button { color: inherit; … }` is not
  ported (D-1). The phone-target rule for `.alert .close` moves into this
  component's CSS under `@media (max-width: 47.99rem)`.
- Composes [`st-icon`](icon.md). Projected actions are [`button[st-button]`](button.md)
  or [`a[st-link]`](link.md), owned by the consumer.
- Mocks drift the component corrects: the five icon drawings become the
  `st-icon` set (D-6); dialog alerts' bare text becomes a projected `<p>` (D-7);
  the inline `style="margin-…"` on hosts becomes the consumer's spacing
  utility or feature class on the host.

## Decisions

- **D-1** *How do the projected "Try again" button and "Go to the public site" link take the alert's ink, as the DS rule `.alert__actions a, .alert__actions button { color: inherit }` does?* They don't: they keep their own component colours (secondary button, `--color-fg-link` link). Encapsulated alert CSS cannot reach projected elements and ICD-STY-3 forbids `::ng-deep`; both keep at least 4.5:1 text and 3:1 edges on every tone fill (Colour table), so the change is visual only. The rendering shows the required look.
- **D-2** *Does Dismiss hide the alert, and where does focus go?* The component only emits `dismissed`; the application removes the alert (ICD §9.7) and moves focus to the next heading, as the DS Focus section asks. The page knows what comes next; the component does not (ICD §14, focus after page-level changes).
- **D-3** *ICD-002 has a `banner` input, but the DS removed `.banner` because no mock used it (DS README).* The banner keeps the pre-removal DS rules (git `ee40038^`): full bleed, no radius or side borders, centred row, `--layout-margin` padding, 44 px Dismiss on phones. Removing the input would be a breaking change; specifying its look keeps it buildable. The rendering applies these rules as a specimen until the DS restores them.
- **D-4** *How does the component avoid an empty actions row without querying projected content (ICD-API-9)?* `div.alert__actions` is always rendered and hidden by `:empty`; Angular leaves no nodes when the slot is unfilled.
- **D-5** *Is `.alert--info` written when the tone is the default?* Yes. The mocks write it on every info alert and page objects can select every tone the same way.
- **D-6** *Which icon drawing?* The `st-icon` set (`info`, `success`, `warning`, `danger`), which the DS documented from the toast mocks; the mocks' five variants of the triangle and dot are drift.
- **D-7** *The dialog alerts put bare text in `.alert__body`; the DS documents a `<p>`.* Both are accepted in the default slot and render alike (the body is a flex column, so bare text becomes one line box). A dialog references the alert through a native `id` on the host, as [dialog.md](dialog.md) D-2 specifies.
- **D-8** *Does Escape dismiss a dismissible alert?* No. Escape belongs to open overlays (DS toast and dialog pages); a page alert is content.
- **D-9** *Is Dismiss an `st-button` or `st-icon-button`?* Neither: the DS and the mock render `button.close`, which is part of the `.alert` block (ICD §11.2), with its 24 / 44 px sizes.
- **D-10** *Only `studio-editor/success` has a Dismiss; the spot and guide "created as a draft" alerts don't (DS drift).* `dismissible` is per use; the application sets it on all three, because the three editors are the same pattern and the draft is already visible below each.
- **D-11** *Is the role derived from the tone?* No. ICD-002 makes them separate inputs and the DS pairs them by urgency (a rate limit is warning + `alert`; a stale price is warning + `status`).
