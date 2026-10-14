# Toast

| Field | Value |
|---|---|
| Selector | `st-toast-region`, service `ToastService` (with `ToastOptions`, `ToastRef`) |
| Library path | `frontend/projects/components/src/lib/toast/` |
| Status | planned |
| Traces to | L2-030, L2-032, L2-054, L2-056, L2-061, L2-064, L2-065, L2-067, L2-068, L2-069, L2-070, L2-071, L2-074 |
| Design system | [`toast.html`](../../design-system/components/toast.html), [`notifications.html`](../../design-system/patterns/notifications.html), [`feedback-and-loading.html`](../../design-system/patterns/feedback-and-loading.html) |
| Source mocks | [`notifications/public-toast/success`](../../mocks/notifications/public-toast/success.html), [`notifications/public-toast/warning`](../../mocks/notifications/public-toast/warning.html), [`notifications/public-toast/danger`](../../mocks/notifications/public-toast/danger.html), [`notifications/admin-toast/info`](../../mocks/notifications/admin-toast/info.html), [`notifications/admin-toast/success`](../../mocks/notifications/admin-toast/success.html), [`notifications/admin-toast/warning`](../../mocks/notifications/admin-toast/warning.html), [`notifications/admin-toast/danger`](../../mocks/notifications/admin-toast/danger.html), [`notifications/admin-toast/stacked`](../../mocks/notifications/admin-toast/stacked.html) |
| Rendering | [`toast.html`](toast.html) |

## Purpose and scope

A toast confirms an action the person just took, without moving them: "Link
copied", "Corktown Garage Studio is published", "You can compare up to 4
studios", "Couldn't save Corktown Garage Studio". It appears at the bottom of
the screen, says what happened and offers at most one next step. Info, success
and warning toasts leave by themselves after 8 seconds; a danger toast stays
until it is dismissed or its action is used.

The toast is two library parts with one job. `st-toast-region` is the fixed,
initially empty live region that the shell renders once; `ToastService` is the
only way to put a toast in it (ICD-OVL-5). The service holds the stack, the
timers and the rules (ICD-OVL-6); the region renders what the service holds.

Use an [alert](alert.md) for a condition that stays true on the page ("Prices
may be out of date", "Studio created as a draft"); an inline field message
for one field or one image row; the compare bar's own count
([compare-bar.md](compare-bar.md)) for "3 selected".

Out of scope:

- Which outcomes toast, their tone and copy, and what an action does: the
  application's (ICD §10.2, §14).
- Formatting numbers and addresses in the copy: the application's (ICD-I18N-4).
- Undo: ShotThere has none (DS Content); reversing Publish is Unpublish.
- The compare bar and the `has-compare-bar` class on `body`: the application's
  and [compare-bar.md](compare-bar.md)'s; the region only reacts to the class.
- Retrying: the danger toast's "Try again" calls the application's `action`.

## Usage

Every `.toast` in `docs/mocks/` (inventory from `usage_inventory.py docs/mocks toast "div"`), grouped by configuration.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `notifications/public-toast/success` (comparison page, Copy link) | success, no action, timer | "Link copied" / "Anyone with the link sees these 3 studios side by side." | entering, counting down, paused, leaving | inverse over the comparison page |
| `notifications/public-toast/warning` (studio list, Compare on a fifth studio) | warning, no action, timer, region raised above the compare bar | "You can compare up to 4 studios" / "Remove one from the bar to add Ossington Blackbox." | counting down; focus stays on the card's Compare | inverse over the list, above the compare bar |
| `notifications/public-toast/danger` (comparison page, copy refused) | danger, `role="alert"`, no action, no timer | "Couldn't copy the link" / "Copy the address from your browser's address bar instead." | persistent until Dismiss | inverse |
| `notifications/admin-toast/info` (studio editor, create with a taken slug) | info, no action, timer | "Saved with a new address" / "/studios/annex-attic-studio-2 — annex-attic-studio was already taken." | counting down, paused | inverse over the editor |
| `notifications/admin-toast/success` (editor, Publish) | success, link action, timer | "Corktown Garage Studio is published" / "It appears in lists, the map and the sitemap within a minute." + link "View public page" to `/studios/corktown-garage-studio` | counting down; action hover, focus | inverse |
| `notifications/admin-toast/warning` (editor, Unpublish confirmed) | warning, no action, timer | "The Junction Loft is unpublished" / "Its public page returns not found within a minute." | counting down | inverse |
| `notifications/admin-toast/danger` (editor, save failed) | danger, `role="alert"`, button action, no timer | "Couldn't save Corktown Garage Studio" / "Your changes are still here. Check your connection and try again." + button "Try again" | persistent; action hover, focus | inverse |
| `notifications/admin-toast/stacked` | three at once: info, success, danger | as above | stacked, newest at the bottom | inverse |
| Delete confirmation (`delete-content` detailed design; no mock) | success, no action, shown on the admin list after deleting a draft | the application's copy, naming the item | survives the route change | inverse over the list |

Every row is buildable with `ToastService.show(options)`: tone, title and text
are `ToastOptions` fields; a button action is `actionLabel` + `action`; a link
action is `actionLabel` + `actionLink` (ICD change, D-1). Raising above the
compare bar needs nothing from the caller.

## Anatomy

Region:

1. **Region** — the host `st-toast-region`, carrying `.toast-region`,
   `role="status"` and `aria-live="polite"`. In the DOM from the first render,
   empty until a toast arrives. Fixed to the bottom of the viewport, a column
   of toasts with `--space-3` gaps, `pointer-events: none` (each toast takes them
   back), padded by `env(safe-area-inset-bottom)`, layer `--z-toast`.

Each toast:

2. **Container** — `div.toast.toast--{tone}`; `role="alert"` on danger only.
   Inverse surface, `--radius-md`, `--shadow-3`, `--space-4` padding, flex row
   with `--space-3` gaps, `overflow: hidden` (clips the timer bar).
3. **Tone icon** — [`st-icon`](icon.md) `info`, `success`, `warning` or
   `danger`: `svg.icon`, `aria-hidden="true"`, `--icon-size-md`, in the text
   colour (the shape carries the tone).
4. **Body** — `div.toast__body`, a column with `--space-0-5` gaps that takes the
   remaining width.
5. **Title** — `div.toast__title`: what happened, naming the thing.
   `--text-label` at `--font-size-md`.
6. **Text (optional)** — `div.toast__text`, rendered only when `text` is set:
   one sentence at 90 % opacity, `--text-body-sm`.
7. **Action (optional)** — `.toast__action` inside the body: `<a href>` for a
   link action (`actionLink`), `<button type="button">` for a callback action.
   Underlined, ink inherited. At most one.
8. **Dismiss** — `button.close` with `aria-label` "Dismiss" and an `st-icon`
   `close` at `sm` size. Every toast has one.
9. **Timer bar** — `span.toast__progress`, `aria-hidden="true"`, a
   `--border-width-thick` line along the bottom that shrinks from full width to
   nothing over the toast's 8 seconds. Info, success and warning only.

Host: `st-toast-region` is the `.toast-region` box (ICD-DOM-1). The toasts are
plain elements in its template, not components. The region takes no inputs
and no content.

## API

### `st-toast-region`

#### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| None | | | | The region renders `ToastService`'s stack. The application renders it exactly once, in the shell, after the footer and the compare bar (ICD-OVL-5). |

#### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | Callers learn of activation through `action`; dismissal needs no event. |

#### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | No projection. |

Library string (ICD §12): `st.toast.dismiss` "Dismiss", the Dismiss button's
`aria-label`; it has no override input.

### `ToastService`

`providedIn: 'root'`.

#### Methods

| Method | Signature | Rule |
|---|---|---|
| `show` | `show(options: ToastOptions): ToastRef` | Appends a toast at the bottom of the stack and returns its handle. During server rendering it does nothing and returns a handle whose `dismiss()` does nothing. When three toasts are already visible, the oldest non-danger toast leaves first (D-3). |

#### `ToastOptions`

| Field | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `Exclude<Tone, 'neutral'>` | — | yes | `.toast--{tone}` and the icon. `danger` adds `role="alert"`, drops the timer and the bar, and never dismisses on its own. |
| `title` | `string` | — | yes | `.toast__title`. Names the thing ("Couldn't save Corktown Garage Studio"). |
| `text` | `string` | `undefined` | no | `.toast__text`; omitted when absent or empty. |
| `actionLabel` | `string` | `undefined` | no | The action's visible text ("Try again", "View public page"). Rendered only with `action` or `actionLink`. |
| `action` | `() => void` | `undefined` | with `actionLabel`, unless `actionLink` | Renders `button.toast__action`. On activation the service calls it once, then dismisses the toast. |
| `actionLink` | `string` | `undefined` | no | **ICD change (ICD-002 1.1.0, additive).** An application path (from `APP_PATHS`). Renders `a.toast__action` with `routerLink` and the resolved `href`; on activation the router navigates and the toast is dismissed. When both are set, `actionLink` wins and `action` is ignored (D-1). |

`actionLabel` without `action` or `actionLink` renders no action and, in
development mode, logs a console error naming the toast's title.

#### `ToastRef`

| Member | Signature | Rule |
|---|---|---|
| `dismiss` | `dismiss(): void` | Starts the leaving animation and removes the toast. Calling it again, or after the toast has gone (timer, Dismiss, push-out), does nothing. |

All copy (`title`, `text`, `actionLabel`) is product copy that the
application marks with `$localize` (ICD-I18N-2).

## Variants and sizes

| Variant | Modifier / attribute | Use for |
|---|---|---|
| Info | `.toast--info` | A side effect the owner should notice: "Saved with a new address". |
| Success | `.toast--success` | An action worked: "Link copied", "Corktown Garage Studio is published". |
| Warning | `.toast--warning` | A refusal the person can resolve or an outcome with a cost: "You can compare up to 4 studios", "The Junction Loft is unpublished". |
| Danger | `.toast--danger` + `role="alert"` | A request that failed: "Couldn't copy the link", "Couldn't save Corktown Garage Studio". Persistent; no timer bar. |
| With link action | `a.toast__action` | "View public page". |
| With button action | `button.toast__action` | "Try again". |
| Public set | success, warning, danger; no actions | Visitors (Copy link, the compare limit). |
| Admin set | info, success, warning, danger; link or button action | The owner's editors. |
| Stacked | up to three `.toast` in the region | Several results in a row; newest at the bottom. |

All tones share the inverse surface; the modifier picks the icon and the live
role, not a colour. One size: the region is 24rem wide from 36rem and the
viewport width less `--space-4` each side below it; height follows the text.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Region empty | no toasts | Nothing visible; the region exists | Live region ready (`role="status"`) |
| Entering | `show()` | Slides up 16 px and fades in over `--duration-base` with `--ease-enter` | Info, success, warning: read politely from the region; danger: `role="alert"`, read at once |
| Counting down | non-danger, not hovered, no focus inside | Timer bar shrinks linearly from full width over 8 s | — |
| Paused | pointer over the toast, or focus inside it | Timer bar stops; no other change | — |
| Resumed | pointer leaves and focus leaves | Bar continues from where it stopped; the toast leaves when the remaining time runs out | — |
| Persistent | danger | No bar; stays until Dismiss or the action | — |
| Leaving | timer ends, Dismiss, action, `ToastRef.dismiss()`, or push-out | `.toast--leaving`: fades and drops `--space-2` over `--duration-base` with `--ease-exit`, then removed (D-4) | Nothing announced |
| Stacked | two or three toasts | Column, oldest at the top, newest at the bottom, `--space-3` apart | Each read when it arrives |
| Pushed out | a fourth `show()` | The oldest non-danger toast leaves (D-3) | — |
| Raised | `body.has-compare-bar` | Region bottom sits above the compare bar | — |
| Action / Dismiss hover | `:hover` | Action underline thickens to `--border-width-thick`; Dismiss opacity 1 on `currentColor` at 12 % | — |
| Action / Dismiss focus | `:focus-visible` | Ring in `--color-fg-inverse`, `--focus-ring-width`, offset `--focus-ring-offset` | Focus on the control; timer paused |
| Action / Dismiss active | `:active` | Same as hover | — |
| Print | `@media print` | Region hidden | — |

Disabled is not used: an action that can no longer run closes its toast
instead (DS States).

## Markup

```html
<!-- rendered: the region, empty, in the shell from the first render -->
<st-toast-region class="toast-region" role="status" aria-live="polite"></st-toast-region>
```

```html
<!-- rendered: success with a link action and the timer (Publish) -->
<st-toast-region class="toast-region" role="status" aria-live="polite">
  <div class="toast toast--success">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>
    <div class="toast__body">
      <div class="toast__title">Corktown Garage Studio is published</div>
      <div class="toast__text">It appears in lists, the map and the sitemap within a minute.</div>
      <a class="toast__action" href="/studios/corktown-garage-studio">View public page</a>
    </div>
    <button class="close" type="button" aria-label="Dismiss"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    <span class="toast__progress" aria-hidden="true"></span>
  </div>
</st-toast-region>
```

```html
<!-- rendered: danger with a button action, persistent (save failed) -->
<div class="toast toast--danger" role="alert">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16h.01"/></svg>
  <div class="toast__body">
    <div class="toast__title">Couldn't save Corktown Garage Studio</div>
    <div class="toast__text">Your changes are still here. Check your connection and try again.</div>
    <button class="toast__action" type="button">Try again</button>
  </div>
  <button class="close" type="button" aria-label="Dismiss"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
</div>
```

```html
<!-- rendered: warning, no action, leaving -->
<div class="toast toast--warning toast--leaving">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4 2.5 20h19L12 4z"/><path d="M12 10v4M12 17h.01"/></svg>
  <div class="toast__body">
    <div class="toast__title">You can compare up to 4 studios</div>
    <div class="toast__text">Remove one from the bar to add Ossington Blackbox.</div>
  </div>
  <button class="close" type="button" aria-label="Dismiss">…</button>
  <span class="toast__progress" aria-hidden="true"></span>
</div>
```

The info toast differs from the success toast only in its modifier, icon and
absent action. Each `svg.icon` sits in an `st-icon` host; host tag names and
Angular's `_ngcontent-*` attributes are not part of the contract (ICD-DOM-3).
The inline `animation-duration` the service sets on `.toast__progress` is free
to change.

```ts
// consumer: comparison page, Copy link
const copied = await this.clipboard.copy(location.href);
this.toasts.show(copied
  ? { tone: 'success', title: $localize`Link copied`,
      text: $localize`Anyone with the link sees these ${count}:count: studios side by side.` }
  : { tone: 'danger', title: $localize`Couldn't copy the link`,
      text: $localize`Copy the address from your browser's address bar instead.` });

// consumer: studio editor, Publish succeeded
this.toasts.show({
  tone: 'success',
  title: $localize`${name}:name: is published`,
  text: $localize`It appears in lists, the map and the sitemap within a minute.`,
  actionLabel: $localize`View public page`,
  actionLink: APP_PATHS.studio(slug),
});

// consumer: studio editor, save failed
this.toasts.show({
  tone: 'danger',
  title: $localize`Couldn't save ${name}:name:`,
  text: $localize`Your changes are still here. Check your connection and try again.`,
  actionLabel: $localize`Try again`,
  action: () => this.save(),
});
```

```html
<!-- consumer: the shell, once -->
<st-site-header … />
<main id="main" tabindex="-1"><router-outlet /></main>
<st-site-footer … />
<st-toast-region />
```

## Design

- Region: `position: fixed`; below 36rem `left`, `right` and `bottom` `--space-4`; from 36rem `width: 24rem`, `right` and `bottom` `--space-6`, `left: auto`; `padding-bottom: env(safe-area-inset-bottom)`; column, `gap` `--space-3`; `z-index` `--z-toast`; `pointer-events: none` on the region, `auto` on each toast.
- Raised: under `.has-compare-bar` on an ancestor (`:host-context(.has-compare-bar)`), `bottom` is `calc(var(--space-24) + env(safe-area-inset-bottom))` from 36rem and `calc(var(--space-32) + var(--space-4) + env(safe-area-inset-bottom))` below.
- Toast: `padding` `--space-4`, `gap` `--space-3`, `--radius-md`, `--shadow-3`, `overflow: hidden`, `position: relative`.
- Type: title `--text-label` at `--font-size-md`; text `--text-body-sm` at 0.9 opacity; both `overflow-wrap: anywhere`; action `--text-label`, underlined, `min-height` `--target-min`, `padding` `--space-1` 0.
- Dismiss: `--target-min` square from 48rem, `--target-comfortable` below; `--radius-sm`; 0.8 opacity, 1 on hover; close icon `--icon-size-sm`.
- Timer bar: `--border-width-thick` high, `currentColor` at 0.4 opacity, anchored left; scales from full width to 0 over 8000 ms, linear; paused with `animation-play-state: paused` while the toast is hovered or has focus inside.
- Motion: enter `slide-up` over `--duration-base` with `--ease-enter`; leave `fade-out` over `--duration-base` with `--ease-exit`.
- Elevation `--shadow-3`; layer `--z-toast` (above the compare bar, below dialogs).

Component tokens: `--toast-tone` is declared by every tone modifier and aliases
`--color-fg-inverse`; nothing reads it today, and the icon uses `currentColor`.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Surface | `--color-bg-inverse` | `--palette-stone-950` | `--palette-stone-50` |
| Title, text, icon, action, Dismiss | `--color-fg-inverse` | `--palette-white` | `--palette-stone-950` |
| Focus ring | `--color-fg-inverse` | `--palette-white` | `--palette-stone-950` |
| Timer bar | `currentColor` (`--color-fg-inverse`) at 40 % | `--palette-white` | `--palette-stone-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-inverse` | `--color-bg-inverse` | 4.5:1 | Title, text (still above 4.5:1 at 90 % opacity), action |
| `--color-fg-inverse` | `--color-bg-inverse` | 3:1 | Icon, Dismiss icon, focus ring |

The timer bar is decorative and has no minimum. Tone colours are never used on
the toast: on the near-white dark-theme toast the success green would be about
1.7:1 (DS Do and don't). Forced colours: the fill becomes `Canvas` and a 1 px
`CanvasText` edge outlines each toast; icons keep their shape.

## Responsive behaviour

- Below 36rem the region spans the viewport less `--space-4` each side, at the
  bottom, clear of the home indicator (`env(safe-area-inset-bottom)`); from
  36rem it is 24rem wide at the bottom right, `--space-6` in.
- On pages with the compare bar the region sits above the bar at every width,
  so a toast never covers "Clear" or "Compare" (two-row bar below 36rem).
- Below 48rem Dismiss is 44 × 44 and the action at least 44 px tall (D-5); from
  48rem Dismiss is 24 × 24 and the action at least 24 px tall.
- Text wraps; long addresses such as `/studios/annex-attic-studio-2` break
  anywhere. Nothing truncates; the toast grows in height.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom the region stays inside the viewport and every control stays reachable.
- Hidden in print.

## Accessibility

### Role and pattern

The region is a polite live region (`role="status"`, `aria-live="polite"`)
present and empty from the first render, as WCAG 4.1.3 and the DS require: a
live region must exist before content is put in it. Info, success and warning
toasts are inserted into it and read politely. A danger toast carries
`role="alert"` ([APG Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/))
and is read at once (D-2). Toasts are not dialogs and never trap focus.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches each toast's action and Dismiss in DOM order, after the page content (the region is the last part of the shell). Focus inside a toast pauses its timer. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates "Try again" or Dismiss. |
| <kbd>Enter</kbd> | Follows "View public page". |
| <kbd>Escape</kbd> | Nothing; Escape belongs to open dialogs. |

### Focus

- A toast never takes focus. After Compare on a fifth studio, focus stays on
  that Compare button (L2-030.3); after Publish it stays on Publish.
- When a toast that holds focus leaves (Dismiss, action, `ToastRef.dismiss()`),
  focus moves to the next remaining toast's Dismiss (the one below, else the
  one above); when no toast remains, to the element that was focused when
  `show()` was called, if it is still in the document; otherwise to the `main`
  element (D-6).
- The focus ring uses `--color-fg-inverse` on the inverse surface, because
  `--color-focus-ring` does not reach 3:1 on the dark-theme toast.

### Labelling

- The title names the studio or the link so the announcement stands alone
  ("Couldn't save Corktown Garage Studio").
- Dismiss is named "Dismiss" (`st.toast.dismiss`). The action's name is its
  visible text.
- Icons and the timer bar are `aria-hidden="true"`.

### Announcements

The region is the only announcer for toasts (ICD-A11Y-4): the application
does not also announce the same result through its `AnnouncerService`. What is
read is the toast's text content: title, text and action label.

### Motion

The design-system rule: enter and leave read `--duration-base`, which reduced
motion sets to 0.01 ms, so toasts appear and go without movement. Under
`prefers-reduced-motion: reduce` the timer bar does not animate; it stays at
full width while the timer still runs and pauses as usual (notifications
pattern, Motion). Timers are 8 s, long enough to read two lines, and pause on
hover and focus (WCAG 2.2.1).

## Content and internationalisation

- Title: what happened, past tense or a state, naming the thing: "Corktown
  Garage Studio is published", "Link copied". Titles carry no full stop.
- Failures start "Couldn't …" and the text says what is safe and what to do:
  "Your changes are still here. Check your connection and try again."
- Refusals state the limit and the way out: "You can compare up to 4 studios" /
  "Remove one from the bar to add Ossington Blackbox."
- Text is one full sentence; it may name timing ("within a minute").
- One action, as a verb phrase: "View public page", "Try again". No "OK", no
  Undo.
- Translatable: `title`, `text`, `actionLabel` (the application's `$localize`),
  and the library's "Dismiss". Data: studio names, addresses
  (`/studios/annex-attic-studio-2`), counts ("these 3 studios", formatted by
  the application).
- French runs about 30 % longer: the toast grows taller; the 8 s timer stays.

## Performance

- Change detection: `OnPush`; the stack is a signal in `ToastService`; the
  region's `@for` tracks each toast by a numeric id the service assigns.
- Timers: one `setTimeout` per counting toast, cleared on pause, leave and
  destroy; no intervals. The bar animates `scale` on the compositor, not
  `width`.
- Server rendering: `show()` is ignored on the server; the region renders
  empty and hydrates without mismatch.
- Performance scenario: the `components-harness` route `toast/performance`
  raises the admin stack (info "Saved with a new address", success "Corktown
  Garage Studio is published", danger "Couldn't save Corktown Garage Studio")
  and then a fourth toast; raising each must stay within the L2-071 INP budget
  and add no layout shift.
- Regression rule: a change to the template, service, styles or change
  detection is measured on that route against the base branch before it is
  pushed.
- Layout stability: the region is fixed, so toasts never move page content
  (CLS 0 from toasts).
- Weight: imports `@angular/core`, `@angular/common` (`isPlatformBrowser`,
  `DOCUMENT`), `@angular/router` (`RouterLink`) and the library's `st-icon`; no
  CDK overlay.

## Acceptance criteria

### Rendering

- **AC-1** Given the shell with `<st-toast-region />` and no toast raised, when any page loads, then exactly one element with the class `toast-region`, `role="status"` and `aria-live="polite"` is in the DOM and it is empty. (L2-069)
- **AC-2** Given the comparison page, when the visitor activates "Copy link" and the application calls `show({ tone: 'success', title: 'Link copied', text: 'Anyone with the link sees these 3 studios side by side.' })`, then the region contains one `.toast.toast--success` with the title, the text, a Dismiss button and an `aria-hidden` `.toast__progress`, and the confirmation is announced politely. (L2-032)
- **AC-3** Given four studios selected on the studio list, when the visitor activates Compare on Ossington Blackbox and the warning toast "You can compare up to 4 studios" / "Remove one from the bar to add Ossington Blackbox." is shown, then focus stays on that Compare button. (L2-030)
- **AC-4** Given the copy was refused, when the danger toast "Couldn't copy the link" is shown, then it has `role="alert"`, no `.toast__progress`, and it is still present 30 seconds later. (L2-032)
- **AC-5** Given a new studio saved with a taken slug, when the info toast "Saved with a new address" / "/studios/annex-attic-studio-2 — annex-attic-studio was already taken." is shown, then it has `.toast--info`, the circled-i icon and the full address in its text. (L2-054)
- **AC-6** Given Corktown Garage Studio published, when the success toast is shown with `actionLabel: 'View public page'` and `actionLink: '/studios/corktown-garage-studio'`, then the action is an `a.toast__action` with `href="/studios/corktown-garage-studio"`, and activating it navigates there and removes the toast. (L2-056)
- **AC-7** Given The Junction Loft unpublished, when the warning toast "The Junction Loft is unpublished" / "Its public page returns not found within a minute." is shown, then it has `.toast--warning` and a timer bar. (L2-056)
- **AC-8** Given a failed save, when the danger toast "Couldn't save Corktown Garage Studio" is shown with `actionLabel: 'Try again'` and an `action`, and the owner activates "Try again", then the action runs exactly once and the toast is removed. (L2-054)
- **AC-9** Given a draft deleted from its editor, when the application shows its success toast and navigates to the studio admin list, then the toast is still shown on the list after the route change. (L2-061)

### Timing and stacking

- **AC-10** Given "Link copied" with no pointer over it and no focus inside, when 8 seconds pass, then it leaves and is removed from the DOM, and the empty region stays in the DOM for the next toast. (L2-032)
- **AC-11** Given "Saved with a new address" shown for 6 seconds, when the owner rests the pointer on it for 10 seconds, then it is still shown and its bar is paused; when the pointer leaves, it is removed about 2 seconds later. (L2-054)
- **AC-12** Given the danger toast "Couldn't save Corktown Garage Studio", when 60 seconds pass with no interaction, then it is still shown. (L2-054)
- **AC-13** Given info, success and danger toasts shown in that order, when they render, then the region holds them top to bottom in that order; when a fourth (warning "The Junction Loft is unpublished") is shown, then the info toast leaves, the danger toast stays, and the order is success, danger, warning. (L2-054)
- **AC-14** Given `ToastRef.dismiss()` called on "Link copied", when it is called a second time or after the toast has already left, then nothing happens and no error is thrown. (L2-032)

### Keyboard and focus

- **AC-15** Given the danger toast with "Try again", when a keyboard user tabs past the page content to "Try again" and presses Enter, then the action runs; when they instead tab to Dismiss and press Space, the toast is removed. (L2-067)
- **AC-16** Given "Link copied" with keyboard focus on its Dismiss button, when 8 seconds pass, then it is still shown; when focus moves out of the toast, it leaves after its remaining time. (L2-067)
- **AC-17** Given two toasts with focus on the first one's Dismiss, when Enter is pressed, then the first toast is removed and focus is on the second toast's Dismiss; when that one is dismissed too, focus returns to the "Copy link" button that raised it. (L2-067)
- **AC-18** Given a toast's action and Dismiss with keyboard focus, in light and dark, when they render, then the focus ring is drawn in `--color-fg-inverse`, at least 2 px, with at least 3:1 against `--color-bg-inverse`. (L2-067)

### Screen readers

- **AC-19** Given every toast in the usage table, when axe-core scans the `toast` harness routes in light and dark, then no violations are reported, icons and the timer bar are hidden from the accessibility tree, and every Dismiss is named "Dismiss". (L2-069)
- **AC-20** Given the application has not overridden anything, when its translations are extracted, then the Dismiss name comes from the `$localize` string `@@st.toast.dismiss` "Dismiss". (L2-070)

### Theming

- **AC-21** Given success, warning and danger toasts in light and dark, when the contrast check runs, then the title, text (at 90 % opacity) and action are at least 4.5:1 against the inverse surface and the icons at least 3:1, and no toast uses a tone colour. (L2-068)

### Responsive

- **AC-22** Given the studio list at 360 px with four studios selected and the compare bar shown, when the warning toast appears, then the toast's bottom edge is above the compare bar's top edge and "Clear" and "Compare" are not covered. (L2-065)
- **AC-23** Given a device with a 34 px bottom safe-area inset, when a toast is shown on a page without the compare bar, then the region's bottom padding includes the inset and the toast sits above it. (L2-065)
- **AC-24** Given a toast at 360 px, when Dismiss and "Try again" are measured, then Dismiss is at least 44 × 44 CSS px and "Try again" at least 44 px tall; at 1280 px Dismiss is 24 × 24. (L2-065)
- **AC-25** Given the studio editor at 320 px with "Saved with a new address", when the toast renders, then it spans the viewport less 16 px each side, the address wraps, and `document.documentElement.scrollWidth` equals the viewport width; at 1280 px the region is 24rem wide at the bottom right. (L2-064)

### Motion

The design-system rule (no AC; L2 has no motion requirement): under
`prefers-reduced-motion: reduce` toasts appear and go without sliding or
fading and the timer bar stays still while the timer runs
([toast.html](../../design-system/components/toast.html), Accessibility › Motion;
[notifications.html](../../design-system/patterns/notifications.html), Motion).

### Server rendering

- **AC-26** Given the comparison page rendered on the server, when a component calls `show()` during server rendering, then rendering completes, the response HTML contains the empty region and no toast, and hydration reports no mismatch. (L2-074)

### Performance

- **AC-27** Given the `toast/performance` harness route, when the four toasts are raised one after another, then each raise has an interaction-to-next-paint of at most 200 ms on the Lighthouse mobile profile and the page's layout shift stays 0. (L2-071)

## Implementation notes

- Folder `frontend/projects/components/src/lib/toast/`:
  `toast-region.component.ts` (`ToastRegionComponent`, selector
  `st-toast-region`), `toast-region.component.html`,
  `toast-region.component.css` (port of `.toast-region`, `.toast*`,
  `.has-compare-bar .toast-region` as `:host-context(.has-compare-bar)`, the
  phone-target and print rules, plus `.toast--leaving` and the timer keyframes);
  `toast.service.ts` (`ToastService`); internal `toast-item.ts` (the stack
  entry: id, options, remaining milliseconds, paused, leaving, the element
  focused at `show()` time). Types `ToastOptions` and `ToastRef` in
  `src/lib/types/`.
- Host bindings: `class="toast-region"`, `role="status"`, `aria-live="polite"`.
- Template: `@for (t of service.toasts(); track t.id)` rendering the markup
  above; `(mouseenter)`, `(mouseleave)`, `(focusin)`, `(focusout)` on `.toast`
  pause and resume; `(animationend)` on a leaving toast removes it.
- Timer: `setTimeout` for the remaining time, started only in the browser
  (`isPlatformBrowser`); paused time is subtracted on pause. The duration is a
  constant `TOAST_DURATION_MS = 8000` in `toast.service.ts`, also written as the
  bar's `animation-duration`.
- Link action: `RouterLink` on `a.toast__action` (allowed by ICD-DEP-1); the
  click handler dismisses after the router handles the click.
- ICD change: `ToastOptions` gains `actionLink?: string` (ICD-002 1.1.0,
  additive: a new optional member on an input-only type, §15).
- Composes [`st-icon`](icon.md). Uses no other library component: the action and
  Dismiss are the toast block's own elements (D-7).
- Mocks drift the component corrects: `public-toast/warning`'s inline `bottom`
  on the region becomes the `has-compare-bar` rule; its triangle path becomes the
  `st-icon` `warning` drawing; `.toast__progress`'s fixed 60 % width becomes the
  running timer.

## Decisions

- **D-1** *ICD-002's `ToastOptions` only has a callback `action`, but the admin success toast's "View public page" is a link (`a.toast__action href`) in the mock, the DS Code and the notifications pattern.* `ToastOptions` gains `actionLink?: string` (ICD change, additive). A button that navigates would break ICD-DOM-1 and the link semantics a keyboard or screen-reader user expects (open in a new tab, announced as a link). `actionLink` wins when both are set, so the rendered element is never ambiguous.
- **D-2** *Danger toasts nest `role="alert"` inside the polite `role="status"` region in every mock; the DS warns this may be read twice.* Kept as the mocks and DS Code show it, so the region stays one ordered stack. The double-reading check with NVDA and VoiceOver is part of review (§16.1); if it reads twice, the fix (a sibling `role="alert"` container in the same stack, which the DS names) is made in the DS first and then here.
- **D-3** *"A fourth pushes out the oldest", but ICD-OVL-6 says danger never auto-dismisses.* The oldest non-danger toast is pushed out; only when all three visible toasts are danger does the oldest danger toast leave. A failure the owner has not seen is worth more than a confirmation, and three unresolved failures already ask for action.
- **D-4** *The DS animates leaving with `data-state="leaving"`, which ICD-DOM-2 forbids the library to render.* The region adds the class `.toast--leaving` with the same `fade-out` rule, then removes the toast on `animationend`. The DS page catches up at the next extraction.
- **D-5** *The DS toast page says Dismiss and the action are 44 px "below 36rem", while the stylesheet grows them below 48rem.* Below 48rem, as the stylesheet and L2-065.3 (XS and SM) say.
- **D-6** *Where does focus go when a focused toast leaves?* To the next toast's Dismiss, else the control that raised it, else `main`. This merges the toast page ("returns to the control that raised it") and the notifications pattern ("moves to the next toast or back to the page"); `main` is the application's fixed landmark (ICD-A11Y-3), so focus is never dropped on `body`.
- **D-7** *ICD-002 lists toasts among `st-icon-button`'s users, but the mocks and DS draw Dismiss as `button.close` (24 / 44 px).* The toast renders `button.close` from its own block (ICD §11.2 `.toast*`), as the DOM contract requires; `st-icon-button`'s 44 px circle would not match.
- **D-8** *The notifications pattern says public toasts show "one at a time" while ICD-OVL-6 allows three.* The service applies three to every toast; on public pages the application keeps the previous `ToastRef` and dismisses it before showing the next, which gives "one at a time" with the existing API.
- **D-9** *Does the timer restart after a pause?* No; it continues with the time left, so hovering never makes a toast stay longer than 8 s of unhovered time.
- **D-10** *What does the timer bar do under reduced motion?* It stays at full width without animating while the timer still runs, as the notifications pattern says ("stops under reduced motion"); the 8 s rule is unchanged.
