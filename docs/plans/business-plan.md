# ShotThere business plan

**Status:** Founder's plan, 13 October 2026. Not a specification; nothing here
is a requirement until it has L1/L2 requirements, a detailed design and mocks
(`AGENTS.md`). Figures are approximate and in CAD.

Explained in plain words in video [01 · The plan, in plain
words](../videos/01-the-plan-in-plain-words/README.md).

## Executive summary

ShotThere can reach roughly $47K revenue in its first year, $174K in year two and $345K in year three as a solo-founder business, with the free review site and YouTube channel as the audience engine and the founder's camera, photographer's know-how and software as the money.

[ShotThere](https://github.com/QuinntyneBrown/shot-there) is a review and comparison site, with a companion YouTube channel, for places to shoot photos in Toronto: rental studios first, then outdoor spots. Every location is reviewed first-hand with the same measurements and the same standard test setup, so any two locations compare on identical data. Nothing is listed unless it has been shot there. The site stays free to read, and it never sells placement, rank or a score.

Money comes from four places: the channel (ads, sponsors, affiliates, members), the camera (paid client sessions shot at the location under review, studio marketing media, workshops), maps and guides (illustrated shoot maps, the annual Toronto studio report, location scouting) and the computer (the ShotThere platform and method licensed to other cities, measured data licensed to marketplaces and apps, a spec-sheet widget for studios).

The thesis is sequencing. The camera pays in year one while the catalogue and the channel grow. The channel and the digital products overtake the camera in year two, once there are enough reviews, views and search traffic to earn from. By year three the computer is the fastest-growing line: other cities and data customers pay for the method and the data, which cost the founder almost no hours per dollar.

One person can do this because the founder wears four hats, photographer, software architect, salesperson and communicator, and because AI does the repetitive half of each. Coding agents build the site requirement-first; AI drafts scripts, captions, chapters, search pages and shoot-map notes; the founder measures, shoots, scores, decides and sells. AI never measures and never scores.

All figures are CAD and approximate. Year one assumes ShotThere takes about half the founder's working days, with the other half on existing photography and software work outside this plan; years two and three assume full time. A conservative case is about 50% of every number in this plan.

## The opportunity

Toronto has thousands of working photographers, hundreds of rentable studios, and no one who tests the studios the same way twice.

| Segment | Toronto estimate | Basis |
| --- | --- | --- |
| Photographers (NOC 53110), Toronto region | ~4,600 | [Job Bank](https://www.jobbank.gc.ca/marketreport/outlook-occupation/5514/22437) counted about 4,580 in the Toronto region (profile updated November 2023) |
| Videographers, content creators, small brands and serious hobbyists who rent studios | 15,000–30,000 | Founder estimate: three to six renters for every working photographer; confirm from marketplace booking counts |
| Rentable photo studios and creative spaces in Toronto | 150–300 | Founder count to confirm across Peerspace, Giggster, Tagvenue and studios' own sites |
| Typical hourly rate | $40–$190, about $100 average | [Tagvenue](https://www.tagvenue.com/ca/hire/cheap-photo-studios/toronto) (January 2026 data) puts budget studios at $75–$125 an hour; [Giggster](https://giggster.com/find/toronto--on/photo-studio) listings run $54–$110 with higher headline averages |
| Studio bookings a year | 150,000–300,000 | 200 studios at 15–30 paid bookings a week |
| Outdoor spots photographers ask about | 50–100 | Parks, waterfront, architecture and conservatories; permit rules differ by site |

The demand side is not only professionals. Headshot season (January and September), engagement season (May to October) and every small brand's product launch send first-time renters to a marketplace page with the owner's own photos and a star rating. Nobody measures the light, the ceiling, the power or the all-in cost of a 2-hour shoot, and nobody shoots the same test in every room.

That is the gap. A photographer picks a studio the way they would pick a lens if there were no reviews: by the owner's description and a hope. ShotThere gives them identical data for every room and a video of someone actually shooting there.

## Product

ShotThere launches as a free, search-friendly review site and a channel, and grows in three stages, each unlocked by the one before.

**Stage 1 — Reviews and the channel (launch to month 6).** Studio review pages with basics, the all-in cost of a standard 2-hour shoot, measured specs, included gear, logistics, standard test shots, a gallery from a real shoot, a scored verdict, a disclosure and the episode. Outdoor spot pages with a map, best light by time and season, sample shots with lens notes, a dated permit status and rain-backup studios. Browse, filter, sort, map, side-by-side comparison, "best for" guides and email signup. Every feature is already specified in [docs/specs](../specs/L1.md), designed in [docs/detailed-designs](../detailed-designs/README.md) and mocked in [docs/mocks](../mocks/README.md): Angular frontend, Next.js API, PostgreSQL, Playwright acceptance suite.

**Stage 2 — Products and members (months 4–12).** Illustrated shoot maps for each outdoor spot. Members get early access, raw test files and a monthly Q&A. Workshops at reviewed studios. The first Toronto studio report.

**Stage 3 — The method as a product (year 2).** The ShotThere platform, test kit and rubric licensed to a photographer-reviewer in another city. Measured studio data licensed to booking marketplaces and production apps. A spec-sheet widget studios embed on their own sites.

What ShotThere will not be: a booking site, a marketplace, a directory anyone can list on, a pay-to-rank site or a studio's marketing agency. First-hand only and same test every time are the product; everything that would dilute them is out.

## Founder advantages

The founder's four hats cover what a review business normally pays four people for, and AI shrinks the work under each hat.

| Hat | What it replaces | How it earns |
| --- | --- | --- |
| Photographer | A reviewer who has to hire a shooter, or a shooter who cannot judge a room | Every review shoot is a real session; client sessions, studio marketing media, workshops, shoot maps, scouting |
| Software architect | $150K+ a year of contract development | The site, the admin area, the comparison engine, the data API, the city licence; built with coding agents from the specs already in the repo |
| Salesperson | An ad sales rep or a sponsorship agency at 20–30% | Sponsors, data customers, city licensees, studios buying media, workshop seats |
| Leader and communicator | A presenter, a writer and an editor | The channel, the newsletter, the report, the right-of-reply conversations with studio owners |

The AI leverage, concretely: coding agents implement the L1/L2 requirements in thin, tested slices (`AGENTS.md`); a script, chapter list, captions and a search page draft come out of each review's measurements and notes; shoot maps are drawn from the founder's spot notes; the support inbox and sponsor follow-ups start as drafts. The rule that keeps the brand honest: AI never visits, measures, shoots or scores a location, and never writes a verdict. The founder does those, every time.

The compounding effect: a review brings an episode, the episode brings viewers, viewers book client sessions and buy maps, sessions produce the next gallery, the gallery and data make the comparison tool better, and the comparison tool is what another city wants to license.

## Revenue streams

Thirteen streams across four groups. Reading, browsing and comparing stay free in every one of them, and no stream buys a score or a position.

**A. The channel** (audience; scales without founder hours)

| Stream | Pricing | Who pays | Sizing | Start |
| --- | --- | --- | --- | --- |
| YouTube ads | Long-form RPM about $5–$12 per 1,000 views in Canada ([2026 guide](https://ibrahimkamara.com/blog/rpm-cpm-youtube-canada-2026)); plan at $6 | YouTube | 400K views year 1, 1.2M year 2, 2.5M year 3 | Month 1 |
| Episode and newsletter sponsors | $750–$2,000 per episode; $300 per newsletter send | Gear retailers, rental houses, software, insurers, print labs; never a location under review | 1 sponsor year 1, 4 at a time by year 3 | Month 6 |
| Affiliates | 3–8% on the gear in the standard test kit and recommended extras | Retailers | Every episode shows the kit | Month 1 |
| Members | $5 a month: early access, raw test files, monthly Q&A | Viewers | 25 year 1, 150 year 2, 400 year 3 | Month 4 |

**B. The camera** (founder's photography)

| Stream | Pricing | Sizing |
| --- | --- | --- |
| Client sessions at the studio under review | Headshots $250–$350 a person; brand and portrait sessions $600–$1,200; the client's session is the review shoot, the client is told and gets the studio story | 30 in year 1, 60 in year 2, 80 in year 3 |
| Studio marketing media | A fixed price list, the same for every studio: $400 for 15 photos of the space, $900 with a 60-second video; bought only after the review is published; disclosed on the page; never changes a score | 8 in year 1, 24 in year 2, 34 in year 3 |
| Workshops | "Shoot it with me": 6 seats at $149, half a day at a reviewed studio | 4 in year 1, 18 in year 2, 30 in year 3 |

**C. Maps and guides** (the photographer's know-how as products)

| Stream | Pricing | Sizing |
| --- | --- | --- |
| Shoot maps | $15 an outdoor spot, $49 for the city bundle: numbered spots, routes, lens and light notes; a client-facing version without photographer notes | 200 year 1, 800 year 2, 1,600 year 3 |
| Toronto studio report | Free summary; $29 full PDF with every measurement and all-in cost; $500 brand and agency edition with the data | First edition month 10; 2 a year from year 2 |
| Location scouting | $350 a half day with the data library, for brands, agencies and music videos | 6 year 1, 25 year 2, 50 year 3 |

**D. The computer** (founder's software)

| Stream | Pricing | Sizing |
| --- | --- | --- |
| City licence | $800 a month plus 10% of the licensee's channel and product revenue: the platform, the test kit list, the rubric and the method, run by a local photographer-reviewer (Vancouver, Montreal, Calgary, Ottawa) | 1 in year 2, 3 in year 3 |
| Data licensing and API | $500–$2,000 a month per customer: measured specs and all-in costs for booking marketplaces, production apps and gear retailers | 1 in year 2, 3 in year 3 |
| Spec-sheet widget | $19 a month: a studio embeds its ShotThere measurements and test shots on its own site; the widget shows the data, never the score, and nothing changes on ShotThere | 15 in year 2, 40 in year 3 |

**Bookings.** Out of scope. ShotThere links to the studio's own booking page and takes nothing. If a referral fee is ever introduced it must be the same for every studio, disclosed on every page, and never tied to a score; that would need its own requirement and this plan does not assume it.

## Go-to-market and marketing

Catalogue first: ten studios and five spots reviewed and filmed before launch, because a comparison site with two rows compares nothing.

**Months 1–3: build the catalogue.** Review two studios a week, batched into one shoot day each, paying in full by default so the first disclosures are clean. Film every one. Book a paying client for as many review shoots as possible: January headshot season is the launch window. Build the site with coding agents from the existing specs, designs and mocks. Recruit the first 500 email signups from the founder's network, Toronto photography groups and the studios themselves, who get a right of reply before publication and a link the day it goes live.

**Months 3–6: launch and compound.** Public launch on 15 January 2027 with ten studio reviews, five spots, three guides, the comparison tool and ten episodes. Channels, in order of expected return:

1. YouTube: one episode a week, the same structure every time, the test shots on screen, the all-in cost in the title.
2. SEO: a page per studio, per spot, per neighbourhood and per guide ("photo studio under $120 Toronto", "Trinity Bellwoods permit for photography"). Low competition, high intent, compounding.
3. The comparison tool: shareable URLs are the thing photographers send each other.
4. Email newsletter: fortnightly, what got reviewed, what changed price, what went stale.
5. Community: Toronto photography meetups, camera stores, colleges, the studios' own social accounts reposting their episode.
6. Press: the measured, side-by-side angle is what blogTO, Toronto Life and the photography press cover.

**Months 6–12: make it a habit.** A workshop a month at a reviewed studio, each one a content day. Shoot maps for every published spot. The first Toronto studio report before the September headshot season.

**Paid spend.** Under $150 a month in year one, all of it promoting specific episodes to Toronto photographers. Scale to $500 a month in year two once a workshop seat or a map converts at a known cost.

## Financial forecast

Revenue grows from about $47K in year one to $174K in year two and $345K in year three, with the camera carrying year one and the channel, products and the computer carrying year three.

Channel, maps and computer revenue need few founder hours per dollar, so their share rising from about 38% to 71% is what makes year three possible for one person. A conservative case is about 50% of each figure.

**By stream (CAD)**

| Stream | Year 1 | Year 2 | Year 3 | Year 3 assumption |
| --- | --- | --- | --- | --- |
| YouTube ads | 2,000 | 8,000 | 16,000 | 2.5M views at $6 RPM plus shorts |
| Episode and newsletter sponsors | 6,000 | 30,000 | 60,000 | 4 sponsors at $1,250 a month |
| Affiliates | 1,500 | 6,000 | 12,000 | 2.5M views, 0.5% click, $1 a click |
| Members | 1,500 | 9,000 | 24,000 | 400 members at $5 a month |
| Client sessions at reviewed studios | 20,000 | 40,000 | 52,000 | 80 sessions at $650 |
| Studio marketing media | 5,000 | 15,000 | 22,000 | 34 studios at $650 average |
| Workshops | 4,000 | 16,000 | 27,000 | 30 workshops at $900 |
| Shoot maps | 3,000 | 12,000 | 24,000 | 1,600 maps at $15 |
| Toronto studio report | 2,000 | 8,000 | 15,000 | 2 editions, 400 PDFs and 6 agency editions |
| Location scouting | 2,000 | 9,000 | 18,000 | 50 half days at $350 |
| City licences | 0 | 6,000 | 30,000 | 3 cities at $800 a month plus share |
| Data licensing and API | 0 | 12,000 | 36,000 | 3 customers at $1,000 a month |
| Spec-sheet widget | 0 | 3,000 | 9,000 | 40 studios at $19 a month |
| Total | 47,000 | 174,000 | 345,000 | |

**By jar (CAD)**

| Jar | Year 1 | Year 2 | Year 3 | Year 3 share |
| --- | --- | --- | --- | --- |
| The channel | 11,000 | 53,000 | 112,000 | 32% |
| The camera | 29,000 | 71,000 | 101,000 | 29% |
| Maps and guides | 7,000 | 29,000 | 57,000 | 17% |
| The computer | 0 | 21,000 | 75,000 | 22% |

**Costs (CAD)**

| Cost | Year 1 | Year 2 | Year 3 |
| --- | --- | --- | --- |
| Studio rental for reviews | 4,000 | 6,000 | 8,000 |
| Hosting, CDN and domains | 600 | 1,200 | 2,400 |
| AI and software tools (coding agents, editing, analytics) | 3,600 | 4,800 | 6,000 |
| Test kit and gear upkeep (light meter, laser measure, colour checker) | 2,500 | 2,000 | 3,000 |
| Insurance (liability, equipment) | 1,200 | 1,500 | 2,000 |
| Marketing | 1,500 | 6,000 | 12,000 |
| Contractors (video editor from year 2, second shooter for workshops) | 0 | 12,000 | 30,000 |
| Payment processing | 500 | 3,000 | 7,000 |
| Legal and accounting | 1,500 | 2,500 | 3,500 |
| Transit, parking and travel to locations | 1,200 | 2,000 | 2,500 |
| Total | 16,600 | 41,000 | 76,400 |

Net before founder pay is roughly $30K, $133K and $269K. Fixed costs in year one are about $700 a month, which one client session covers, so the business is cash-positive from the first month a review shoot has a paying client.

## Operations as a solo founder

The plan fits one person only if every review is one batched shoot day, the site runs itself behind a CDN, AI does the first draft of everything written, and the two expensive things, custom data work and workshops, are capped.

| Work | Year 1 days | Year 2 days | How it stays small |
| --- | --- | --- | --- |
| Reviews: shoot, measure, film (24 studios, 12 spots; 36 new and 10 revisits in year 2) | 50 | 65 | One day per location; the client session is the review shoot; the standard kit and checklist never change |
| Edit, write, publish (review page, episode, search page) | 30 | 35 | AI drafts the script, captions, chapters and page from the measurement sheet; the founder edits and writes the verdict |
| Client sessions outside review days | 10 | 20 | Booked into review days wherever possible |
| Workshops and scouting | 6 | 24 | Fixed monthly calendar; second shooter on contract from year 2 |
| Products (maps, report) | 10 | 15 | Maps drawn from spot notes; the report is generated from the database |
| Platform engineering | 25 | 20 | Requirement-first, acceptance tests, coding agents, already the repo's workflow |
| Licensing, data customers, support | 0 | 20 | One playbook per city; the API documents itself |
| Marketing, sales, admin | 20 | 30 | Templates, a shared inbox, AI-drafted replies, a weekly ops review |
| Total | 151 | 229 | About 240 working days in a year; year 1 leaves room for outside work |

What the founder never does: sell a score or a position, let a studio see a review before publication except for a factual right of reply, take a sponsor from a location under review, let AI measure or score a room, list a place not shot there, hide a negative finding, or build a feature no reader or customer has asked for.

## Risks and compliance

The biggest risk is editorial: a review business that is paid by the places it reviews stops being a review business, so every dollar from a studio is a fixed-price service bought after publication and shown on the page.

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| A studio disputes a negative review or threatens legal action | Medium | Measurements, not adjectives; every number dated and repeatable; a factual right of reply before publication and the reply published; the editorial policy page; a lawyer reviews the policy once; general liability insurance |
| Studios refuse access or inflate prices for the reviewer | Medium | Pay in full by default and book as any customer would; comped sessions allowed only with disclosure; the review stands either way |
| The channel grows slower than planned | Medium | Search pages and the comparison tool carry traffic without views; the camera jar is profitable on its own |
| Studio marketing media looks like pay-to-play | Medium | Fixed price list, same for every studio, bought only after publication, disclosed on the page, never touches a score; no featured spots exist |
| Data goes stale and readers stop trusting it | High | Every price and permit carries a verified date; anything older than six months is flagged on the page (L1-010); the owner's stale list drives revisits |
| Founder burnout | High | Day caps in the operations table; year one at half time; contractor budget from year 2; a 90-day review that drops streams |
| A marketplace copies the format | Low | They host owner-uploaded photos and cannot shoot every studio themselves; first-hand, same-test data is the moat |
| Permit information is wrong and a reader is fined | Low | Permit status links to the official source with a verified date; the site says it is not legal advice |
| AI-generated text drifts from the facts | Medium | AI drafts only from the measurement sheet; the founder signs every verdict; nothing publishes without an owner review (L1-014) |

**Legal setup.** Incorporate (an Ontario or federal corporation), register for HST once revenue passes $30,000, hold commercial general liability and equipment insurance, add event liability for workshops, publish the editorial policy (L2-046), and get terms of use, the privacy policy and the editorial policy reviewed by a lawyer once before launch. YouTube sponsorships and affiliate links are disclosed in the video, the description and on the page.

## 90-day launch plan

The first 90 days are built around one date: a public launch on 15 January 2027, at the start of headshot season, with ten studio reviews, five spots and ten episodes live.

Reviewing and building run in parallel from week one: two studios a week shot, measured and filmed, each with a paying client where possible; the site built from the existing specs, designs and mocks with coding agents in thin, tested slices; the channel trailer and the first three episodes published in December to seed subscribers before launch day.

Targets for the 90-day review on 15 April 2027: 15 studios and 5 spots live with dated data, 2,000 subscribers, 100,000 views, 1,000 email signups, 8 paid client sessions shot at reviewed studios, 1 sponsor signed, 1 workshop sold out and 100 shoot maps sold. Miss two or more and the review decides which streams to drop before year-one spend grows.
