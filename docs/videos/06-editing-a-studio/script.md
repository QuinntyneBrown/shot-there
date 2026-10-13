# 06 · Editing a studio

This walkthrough follows a studio through the owner's editor: creating it, filling it in, adding images, saving, publishing, unpublishing and deleting. Every confirmation and every message along the way is shown.

## Creating a studio

New studio opens an empty editor. The owner fills in the basics and pricing, and adds every fee the studio charges. Prices verified on defaults to today. Images can only be added after the studio exists, so those sections say so.

Create studio saves a draft and lands on the full editor, with a message that gives the studio's public address. If the name's address is already taken, the server adds a number, and the message shows the final address.

## The editor

The editor is one long form, in sections. At the top, the studio's name, its status, its public address, and when it was last saved.

Basics and pricing come first. Each fee has a name, an amount, and whether it is mandatory or optional, because mandatory fees go into the all-in cost.

Then the images: the three standard test shots and the gallery. Every image needs a description, and each one can move up, move down or be removed.

Then the six rubric scores, whole numbers from one to five. The overall score is calculated on save. Then the verdict: who the studio is for, and who should skip it.

Last, the disclosure. Paid in full, discounted, or comped. For discounted and comped sessions, the provider is required. And the episode, a YouTube link or video ID, which is optional.

The Save, Publish and Delete buttons stay pinned to the bottom of the screen. On a phone, the form fills the width and the same actions stay in reach.

## Images

Uploads go one file at a time in the MVP. While a file uploads, its row says so, and Save waits until it finishes.

Files are checked in the browser and again on the server. A video file is refused, with its name, and a list of the image types that are allowed. A file over twenty megabytes is refused, with its actual size.

Removing an image asks first. The dialog shows the image and its description, and says it leaves the public page within sixty seconds. While removing, the button shows it is busy. If removal fails, the dialog says the image is still in the gallery.

One removal is refused outright. A published studio needs at least one standard test shot, so the last one can't be removed. The dialog explains what to do instead.

## Saving

Save changes shows that it is saving, and the button can't be pressed twice.

If anything is invalid, the server says so. A summary at the top counts the problems, here seven, and each line links to its field. The broken booking link, a negative rate, a date in the future, a missing image description, a score out of range, a missing provider, and an episode link that isn't a YouTube link.

If the server can't be reached, a message says the changes were not saved, and that they are still in the form. This message stays until it is dismissed.

While the editor loads, its sections show placeholders. If the studio can't be loaded, the page says nothing has changed, with Try again and a way back to the list.

## Publishing

Publish only works when every standard field is in. Every published studio carries the same standard data. If anything is missing, the studio stays a draft, and a dialog lists exactly what is missing.

In the MVP, this dialog lists fields like ceiling height and cyc wall that the minimal editor has no input for yet. That gap is called out as an open question in the mocks.

When everything is in, the studio publishes. A message says the public page is live within sixty seconds, with a link to view it.

A published studio swaps Publish for Unpublish. Delete stays disabled, with the reason right under it: unpublish this studio before you can delete it.

## Unpublishing

Unpublish asks first. The page will return not found, and the studio leaves the lists, the map, comparisons and guides within sixty seconds. It can be published again later.

While it works, the button shows it is busy. If it fails, the dialog says the studio is still live.

When it succeeds, a message says the studio is a draft again, with a button to publish it again.

## Deleting

Only drafts can be deleted, and Delete asks first. The draft and its images are deleted for good. Guide entries that point to it are removed, but the guides stay. Focus starts on Keep studio, the safe choice, and Escape closes the dialog without deleting anything.

While deleting, the button is busy. If it fails, nothing was removed.

When it succeeds, the owner is back on the studio list, with a message that the studio and its images are gone.

## Unsaved changes

Leave the editor with unsaved changes, and a dialog names what changed. Here, the hourly rate and the verdict. Discard changes, or stay. Closing the browser tab shows the browser's own leave-page prompt instead. In the MVP, this protection covers the studio editor only.

## Recap

Things to remember. Drafts can't be published until every standard field is in. Every destructive action asks first, and says what will happen and how long it takes. Busy and failed states are shown inside each dialog. And the editor never loses unsaved work without asking.

Next, the last video: editing outdoor spots and guides.
