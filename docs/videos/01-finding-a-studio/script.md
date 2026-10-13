# 01 · Finding a studio

This is the first of six short walkthroughs of the ShotThere MVP mocks. Each one shows every behaviour of a part of the product, using the real mock screens. This one covers the studio list: how a visitor finds a rental studio in Toronto, and what they see when things are slow, empty or broken.

## The studio list

The studio list is the front door. Every studio on it has been shot in by our reviewer, with the same measurements and the same three test setups, so the cards compare like for like.

Five studios are published in the mocks. They are sorted by the most recent review first, so the newest work is always at the top.

Each card carries the same facts. A photo, the name, the neighbourhood and the review date. Then the two numbers people decide on: the all-in cost for a standard two-hour shoot, fees included, and the overall score out of five.

Look at Junction Cyc Studio. Its prices were last checked in March, more than six months ago, so the card carries a flag that says prices may be out of date. We never hide a stale price. We say so.

Every card also has a Compare button. That is how a visitor builds a side-by-side comparison, which the next video covers.

## Sorting and filtering

Above the results sits the count and the sort. A visitor can sort by most recent review, by all-in cost from low to high, or by overall score from high to low.

The filters sit beside the results on a wide screen. A visitor can set a price range for the two-hour shoot, pick neighbourhoods, ask for natural light or a cyc wall, set a minimum floor space, require included gear, and choose a parking option.

Here, the visitor has set a maximum of one hundred and sixty dollars, asked for natural light, and sorted by cost. Two studios match: Leslieville Window Room and Parkdale Daylight Loft. The filter heading shows that two filters are applied.

The whole view lives in the address bar. Opening the same link in a new session shows exactly this result, and the browser's Back button returns to the previous one.

## When results are not normal

The first page arrives already rendered from the server. When a visitor changes a filter, the results area says it is updating, with plain loading text. The MVP uses text here, not skeleton cards.

If nothing matches, the page says so in plain words and names the reason. No studio with a cyc wall and on-site parking costs one hundred and fifty dollars or less. It suggests raising the maximum or clearing a filter, with a Clear filters button right there.

If the server fails, the visitor sees that we couldn't load studios. The filters are kept, so a single Try again is all it takes.

And before any review is published, the list is empty on purpose. The page explains that we only list studios we have shot in, and points to the outdoor spots instead.

## On a phone

Every screen works at phone width. The five main links fold behind a Menu button, which opens as an accessible disclosure. Escape closes it and puts focus back on the button.

The filters become a single collapsible panel above the results, so the cards stay one tap away.

## Recap

Things to remember. Every studio card shows the same facts, with the all-in cost first. Stale prices are flagged, never hidden. Filters and sort live in the link, so any view can be shared. And every slow, empty or failed state tells the visitor what happened and what to do next.

Next, we open a studio review and compare studios side by side.
