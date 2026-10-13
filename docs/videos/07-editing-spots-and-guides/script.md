# 07 · Editing spots and guides

The last walkthrough covers the two other editors: outdoor spots and guides. Both work like the studio editor, so this video focuses on what is different.

## The spot editor

New spot opens an empty editor, and Create spot saves a draft, the same way a new studio does.

A spot's basics are its name, neighbourhood and type: park, architecture, waterfront or indoor public. Location takes latitude and longitude in decimal degrees, with an example under each field, and a box for how to get there by transit, car and on foot.

Permits are set one shoot type at a time: portrait, wedding or engagement, commercial and video, each required or not. Then the official source link, and the date the rules were verified. Best uses are checkboxes, and publishing needs at least one.

Sample shots carry a description, a focal length and an angle or position, which become the captions on the public page. Disclosure and episode work exactly as they do for studios.

On a phone, the form fills the width, with Save and Publish in reach.

## Spot editor states

Saving shows a busy button. Invalid values are listed in a summary at the top, here a latitude outside minus ninety to ninety, and a source link that isn't a web address. Each line links to its field.

While the editor loads, it shows placeholders. If the spot can't be loaded, the page says nothing has changed, with Try again and a way back to the dashboard.

## Publishing a spot

Publishing a spot is refused until every standard field is in. Here, three are missing: best light by time of day, best light by season, and best uses.

In the MVP, the best light sections are deferred, so this refusal can't yet be fixed from the editor. The mocks flag that as an open question.

A published spot has Unpublish instead of Publish, and Delete is disabled until it is unpublished. The MVP has no admin list of spots, so the back link goes to the dashboard, where stale spots appear for re-verification.

## The guide editor

A guide has a title, a slug and an introduction. The slug is lowercase words joined by hyphens, and becomes the guide's address.

Entries are the studios the guide recommends, in order. Each entry shows the studio, its neighbourhood and its current all-in cost, with an editor's note on why it is there. Entries move up and down, or are removed. In the MVP, entries are studios only.

On a phone, the guide fields stack in one column.

## Adding a studio to a guide

Add studio opens a picker. Type part of a studio's name, and matching studios appear as you type, with their neighbourhood and cost. Arrow keys move through the results, and Enter adds the studio. In the MVP, the picker searches a list loaded once when it opens.

While that list loads, the picker says so. If it fails to load, the picker says so, with Try again.

A studio that is already in the guide is shown, but greyed out, and can't be added twice.

If nothing matches, the picker suggests checking the spelling, or adding the studio first.

## Guide editor states

Saving shows a busy button. Publishing a guide with no entries is refused. The draft still saves, and the message names what is missing: at least one studio.

A published guide has a link to its public page. In the MVP, guides can't be unpublished or deleted yet, and the editor says so under the Save button.

Loading and load errors work the same way as in the other editors.

## Recap

Things to remember. Spots add location, permits by shoot type, best uses and sample shots with focal lengths. Spots and guides follow the same publishing rules as studios. The guide picker adds studios by name, never twice. And the mocks are honest about what the MVP leaves out, so the gaps are visible before anyone builds.

That is every behaviour in the ShotThere MVP mocks.
