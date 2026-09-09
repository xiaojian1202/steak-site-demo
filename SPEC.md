# Café & Beverage Site Template — Spec

**Status:** planning
**Date:** 2026-09-08

---

## Business context

**Goal:** Build sellable websites for local food & beverage businesses. Primary
motivation is job-hunting portfolio work; income is secondary and realistic
expectations are set below.

**Market reality:**
- ~8 candidate shops (cafés/restaurants) within a 15-mile radius.
- Most already have a website; a minority have none. The larger pool is shops
  whose site exists but is dated/unusable on mobile — that's a redesign sale,
  not a "you need a website" sale.
- Realistic conversion: 2–3 sales from 8 shops at $500 = $1,000–$1,500.
  This is **paid portfolio work**, not income. Do not let it displace the job
  search.

**Vertical:** local food & beverage broadly (cafés, restaurants, bakeries,
juice/bubble tea). Matcha is the aesthetic wedge and first build, not the
market — scoping the business to matcha alone caps the pool at ~3 shops.

**Pitch, in order of strength:**
1. A real, live redesign of *their* shop, shown on your phone in person.
   "I made this for you. If you like it, it's yours."
2. Their Instagram link in Google Maps hits an app-install wall for logged-out
   users. A real site doesn't.
3. Done-for-you + taste. This is the honest differentiator against Squarespace
   ($20/mo, has templates and a menu editor). They aren't buying software; they
   are buying not spending a weekend on it, and a result that looks better than
   what they'd make.

**Pre-build validation (do before writing code):**
- [ ] List all 8 shops by name; classify: no site / bad site / fine site.
- [ ] Verify Instagram presence directly on Instagram (not via Maps links).
- [ ] Visit 3 shops at ~3pm on a weekday. Ask one question and then listen:
      *"When someone wants to know if you're open or what's on the seasonal
      menu, where do they look?"*

---

## Pricing & scope

**$500 for the first three clients.** Raise to ~$1,200 on the fourth, once
there are three live sites to point at.

**Included:**
- Single-page site (sections listed below) + optional About page
- One round of revisions
- Content entry for initial menu (cap the hours, e.g. 3)
- Sanity Studio setup + a 5-minute Loom walkthrough

**Not included:**
- Photography, logo/brand design
- Ongoing edits after handoff — quote $X/hr or $Y/month, even if nobody buys it.
  Naming the number is what stops the free-forever slide.

**Their costs, stated out loud so it doesn't look like markup:**
- Domain ~$15/yr (their registrar, their card)
- Sanity: free tier
- Netlify: free tier

**Ownership:**

| Thing | Owner | Cost |
|---|---|---|
| Sanity project | Their account; you invited as admin | Free |
| Netlify site | Their account; your GitHub repo connected | Free |
| Domain | Their registrar, their card, their email | ~$15/yr |
| GitHub repo | **Yours** | Free |

The repo staying yours is the honest arrangement: they own their content and
their site, you own the code reused across clients. Say this during the sale —
it's why the price is $500 and not $5,000.

---

## Architecture

**Astro + Sanity, static, deployed to Netlify.**

Astro over Next.js: no server runtime; output is plain HTML/CSS with near-zero
JS, which is what a phone on 4G in a parking lot needs. No server also means no
cold starts and nothing to keep alive.

**Content updates:** Sanity webhook → Netlify deploy hook → rebuild.
~30–60 seconds from Publish to live.

**Decision — rebuild vs. live fetch:** rebuild. Keeps the page fully static and
fast; a menu that updates a minute after publishing is fine for a café. Only
reach for a client-side fetch if a shop needs same-second changes (sold-out
toggles during service) — and then add it for that one field, not the whole menu.

### Sanity free tier (verified 2026-09)

- 20 user seats, 2 datasets, 10,000 documents
- 1M CDN API requests/month, 250K direct API requests/month
- 100GB assets, 100GB bandwidth
- **Public datasets only** — no private/draft-only content. Fine for a café
  menu (public anyway), but never put anything sensitive in it; anyone with the
  project ID can read the dataset.
- Excludes scheduled publishing, custom RBAC, AI Assist.

A café site uses a rounding error of these limits. One free project per client,
created under the client's own account.

Sources:
- https://robotostudio.com/blog/sanity-cms-pricing-which-plan-is-right-for-you
- https://www.flowninja.com/blog/sanity-cms-pricing

---

## Sanity schema

Five types. Resist adding more until a real client forces it.

### `siteSettings` (singleton)
- `shopName` — string, required
- `tagline` — string
- `logo` — image
- `phone`, `email` — string
- `address` — object: street, city, state, zip
- `mapsUrl` — url (their Google Maps link, for the Directions button)
- `social` — array of `{platform, url}`
- `orderingLinks` — array of `{label, url}` (DoorDash, Toast, Square). Small
  shops care about these more than you'd expect.
- `seo` — object: metaTitle, metaDescription, ogImage

### `hours`
Part of siteSettings, but modeled as its own object array so "Open now" logic
has real data.

- `days` — array of 7 objects:
  - `dayOfWeek` — number 0–6
  - `closed` — boolean
  - `open` — string, 24h `"09:00"`
  - `close` — string, 24h `"17:00"`
- `holidayNote` — string. The escape hatch for "closed Dec 24–26" without
  building a holiday calendar.

Store times as 24h strings; compute open/closed at render in the shop's
timezone. Do not build a recurring-exceptions system — the note covers ~95%.

### `menuCategory`
- `title` — string, required ("Matcha", "Espresso", "Pastries")
- `description` — text, optional
- `order` — number, or use the `orderable-document-list` plugin for
  drag-and-drop (worth the setup for a non-technical owner)

### `menuItem`
- `name` — string, required
- `description` — text
- `price` — **number**, formatted at render. Not a string; people type
  `"$4.50 "` with a trailing space.
- `priceVariants` — array of `{label, price}` ("12oz / 16oz"), optional
- `category` — reference → `menuCategory`, required
- `image` — image, optional. **Most items won't have one — design for that.**
- `available` — boolean, default true. The "86'd" toggle, and the thing that
  makes them log in weekly.
- `tags` — array of strings from a fixed list: vegan, gluten-free, seasonal, new
- `order` — number

### `announcement`
The banner that stops them from calling you.

- `message` — text, required
- `active` — boolean
- `link` — url, optional

This one field is why the site will feel like theirs. "Closed Monday for
maintenance." "New yuzu matcha is here." Make it prominent in Studio.

### `page`
For About / Story, so copy changes don't require a redeploy by hand.

- `title`, `slug`, `body` (portable text), `heroImage`

---

## Shared codebase

One repo. Per-site config lives in exactly two places:

- `.env` — Sanity project ID, dataset
- `src/theme.ts` — color tokens, font pair, radius/spacing scale

If a client needs anything beyond those two files changed, it is either a real
feature (fold it back into the shared components) or scope creep (bill it).
That discipline is what makes the second site take three days instead of three
weeks.

### Page structure

Ordered by what the actual customer needs, not by what's fun to build:

1. **Hero** — shop name, one-line tagline, **open/closed status**, address,
   "Directions" and "Order" buttons
2. **Announcement banner** — if active
3. **Menu** — categories, items; unavailable items dimmed or hidden
4. **About** — short, one image
5. **Footer** — hours table, address, map embed, socials, phone

Beauty goes into type, spacing, imagery, and one or two restrained motion
moments. Never at the cost of a customer finding the hours.

---

## Demo templates

Build three demos: a matcha café, a bakery/restaurant, a bubble tea shop.
Same skeleton, genuinely different visual directions — the point is showing
range, not one theme recolored.

**Build them as real sites on the real schema with seeded fake content, not
static HTML mockups.** Then:

- Showing a business = sending a live URL that already works, menu editor
  included.
- Converting a demo to a client = new Sanity project, replace fake content with
  theirs, swap theme tokens. Hours, not weeks.
- The CMS is proven during the pitch instead of promised.

---

## Studio setup for a non-technical owner

This is where the sale is won or lost, and it is ~90% configuration:

- Deploy Studio to `studio.theirdomain.com` or the free `*.sanity.studio` —
  either way, **one URL and a Google login, no GitHub account.**
- Structure Builder: collapse to **Menu**, **Hours**, **Announcement**,
  **Shop Info**. Hide everything else. They should never see a document type list.
- Custom preview panes so a menu item renders as it appears on the site.
- Every field gets a `description` written for a human:
  *"Turn this off when you sell out. Turn it back on tomorrow."*
- Record a 5-minute Loom walkthrough; send it with the handoff. It will cut
  support emails by more than half.

---

## Handoff checklist

Answer these in writing before the first client, and hand them over at close:

- [ ] Netlify account: theirs, their card on file (free tier, but the account
      is theirs)
- [ ] Domain: theirs, their registrar, renewal notices to their email
- [ ] Sanity: their account, their Google login; you invited as admin
- [ ] Support terms: what happens when they email in four months — response
      time, hourly rate, or explicit "no ongoing support"

---

## Non-goals

Say no to all of these on the first three builds. Each is a real feature
someone will ask for; each turns a $500 template into an unpaid project.

- Online ordering, payments, reservations → point at Toast/Square
- Blog, multi-location, i18n
- Analytics dashboards

---

## Next steps

1. Complete pre-build validation (shop list, Instagram check, 3 conversations)
2. Pick one shop — worst web presence, best product, ideally one you already go to
3. Scaffold repo: Astro + Sanity schema + Structure Builder config
4. Build that shop's real site; ship to a live URL
5. Walk in at 3pm and show them on your phone
6. Whatever ships becomes the template — the shared structure is discovered by
   building one real thing, not by designing an abstraction first
