# 05 · Signing in and the dashboard

The rest of the series is the owner's side of ShotThere. There is one admin account, the reviewer's. This walkthrough covers signing in, the dashboard, and the admin list of studios.

## Signing in

The sign-in page is short on purpose: email, password, and a Sign in button, with a link back to the public site.

Submit it empty, and a summary at the top says there are two problems to fix. Each one links to its field, and each field repeats its own message.

While the request is on its way, the button says it is signing in and can't be pressed twice.

If the email or the password is wrong, the message is the same either way. Email or password is incorrect. The page never says which one was wrong, and the password field is cleared.

After five failures in fifteen minutes from the same client, sign-in is paused. The page says to wait fifteen minutes, and the button is disabled. In the MVP, the limit is per client only.

On a phone, the form fills the width. The MVP has no session-expired message yet, and it doesn't return the owner to the page they first asked for.

## The dashboard

The dashboard answers one question: what needs my attention? Three tiles count what is published and what is still a draft, for studios, outdoor spots and guides. Each tile has a button to start a new one.

Below the tiles is the list that matters most: needs re-verification. Any price or permit rule last checked more than one hundred and eighty-three days ago is listed here, oldest first. Junction Cyc Studio's prices are two hundred and twenty-five days old. Distillery District's permit rules are two hundred and seven. Each row has an Edit button that opens that location's editor.

When nothing is stale, the list says everything is up to date.

On a brand new site, every count is zero, and there is nothing to re-check yet.

While it loads, the tiles and rows show grey placeholders. If the server doesn't respond, the dashboard says so, with a Try again button.

On a phone, the tiles stack in a single column, above the re-verification list.

## The admin studio list

The studio list shows drafts and published reviews together, most recently updated first. Each row has the name, a published or draft badge, a prices stale flag when it applies, the neighbourhood, the last update, and an Edit button. The count at the top splits published from draft.

Search looks at names and neighbourhoods. Type junction, and one of seven studios remains.

Type something that matches nothing, like annex, and the page says so, explains what search looks at, and offers Clear search.

The other states follow the same pattern as the dashboard. Placeholder rows while loading. A clear error with Try again. And when there are no studios at all, the empty list explains that a studio stays a draft until every standard field is in, with a button to add the first one.

On a phone, each row wraps into a card, with the name, status, stale flag and Edit button kept together. In the MVP, this list covers studios only. Lists for spots and guides come later.

## Recap

Things to remember. Sign-in never reveals which field was wrong, and pauses after five failures. The dashboard puts stale prices and permits first. And the studio list shows drafts and published reviews side by side, with stale prices flagged.

Next, editing a studio, from the first save to publishing, unpublishing and deleting.
