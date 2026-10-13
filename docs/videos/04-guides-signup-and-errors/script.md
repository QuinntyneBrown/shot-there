# 04 · Guides, signup and error pages

This walkthrough covers the pages around the reviews: guides that turn review data into shortlists, the email signup in every footer, the editorial policy, and the two error pages.

## Guides

The guides index lists every published guide. Three are live in the mocks: best studios for headshots, best natural light studios, and best studios under one hundred and twenty dollars for two hours. Each has a one-line description, and every pick links to the full review behind it.

A guide is a short, ranked list. Best studios for headshots opens with an introduction, then three numbered entries. Each entry shows the studio, its neighbourhood, the all-in cost for two hours, and a note from the editor on why it made the list.

The costs are not typed into the guide. They come from each review, so they are always current. Queen West Black Box carries the stale price flag here too, because its review does.

In the MVP, guides list studios only, and the all-in cost is the one data point on every entry. If a studio goes back to draft, its entry is left out of the public guide.

On a phone, the entries stack in a single column.

Guides link back the other way as well. Every studio review lists the guides that feature it, under Featured in.

## The email signup

The email signup sits in the footer of every public page. One field, one button, and a promise: one email when a new review goes up.

Submit it empty, and no request is sent. The field says to enter your email address, the message is tied to the field for screen readers, and focus moves to the field.

Type something that is not an email address, and the field asks for a valid one, with an example. The browser and the server both check, and the server also caps the length.

While the request is on its way, the button is disabled and shows that it is busy, so nobody subscribes twice.

On success, the form is replaced by a confirmation. You're subscribed. A repeat address gets exactly the same message, so the form never reveals who is already on the list.

If something goes wrong, one plain message says we couldn't sign you up just now. The email stays in the field, and the button works again. In the MVP, this one message covers every failure, including rate limiting.

On a phone, the field and the button stack at full width.

## The editorial policy

The editorial policy is linked from every footer. It says what ShotThere will never do. We only list places we have shot at. Scores are never for sale. Comped sessions are disclosed. Owners can correct facts, but not reviews. We publish the bad with the good. And every price and permit rule shows the date we last checked it.

## Error pages

The not found page is returned for unknown addresses, and for any location that is still a draft. It says the link may be mistyped, or the review may have been taken down while we re-check it, and offers a way into studios and outdoor spots.

The server error page is deliberately plain. In the MVP, it is a static page served without the site's header and footer. It says something went wrong on our side, that it isn't anything the visitor did, and links back to the studio list. It never shows a stack trace or internal detail.

## Recap

Things to remember. Guides pull their costs from the reviews, so they never go stale on their own. The signup handles empty, invalid, busy, success and failure, and never reveals who has subscribed. The editorial policy is public. And both error pages tell the visitor what to do next.

Next, the owner's side of ShotThere: signing in, the dashboard and the studio list.
