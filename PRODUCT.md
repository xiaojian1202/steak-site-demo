# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two distinct audiences interact with each deployed instance of this template:

1. **End customers** of a café/restaurant client — visiting the site to check open/closed status, hours, the current menu (including which items are 86'd), and to get directions or reach an ordering link (DoorDash/Toast/Square). Named usage scene: a phone on 4G in a parking lot, deciding whether to walk in.
2. **The shop owner** — a non-technical operator who edits content (menu, hours, announcements, About copy) through Sanity Studio. They log in with Google, see only Menu / Hours / Announcement / Shop Info (Structure Builder collapsed to hide the raw document-type list), and should never need to touch code or wait on the builder for a routine edit like turning an item on or off.

## Product Purpose

One shared Astro + Sanity codebase that becomes a distinct, live website for each local food/beverage client (café, bakery, restaurant, juice/bubble tea) — sold as paid portfolio work at $500 for the first three clients, rising to ~$1,200 after. Success is a shop owner who gets a fast, mobile-first site they can edit themselves without touching code, and a builder who converts an in-person phone demo into a paying client. This is paid portfolio work for a job search, not a business meant to displace it.

## Positioning

Sold as done-for-you + taste — the honest differentiator against Squarespace ($20/mo, generic templates and a menu editor): a real, live redesign of *their* shop shown on a phone in person ("I made this for you. If you like it, it's yours."), already built and looking better than what the owner would make themselves. The shared-component-plus-two-config-files architecture is what makes the second client take days instead of weeks, and is proven to a prospect by showing a working live demo (Sanity Studio included) rather than promising one.

## Operating Context

- Astro + Sanity, statically built, deployed to Netlify. Sanity webhook → Netlify deploy hook → rebuild; ~30–60 seconds from Publish to live. Deliberately rebuild-on-publish rather than client-side fetch, to keep pages fully static — a live client-side fetch is only added for one specific field (e.g. a same-second sold-out toggle) if a client ever needs it, not for the whole menu.
- Sanity Studio is deployed live (`*.sanity.studio` or a client subdomain) for every client, including demos — "menu editor included" is part of the pitch, not a follow-up.
- Per-client differences are meant to live in exactly two files: `.env` (Sanity project ID/dataset) and `src/theme.ts` (colors, font pair, radius/spacing scale). Anything else a client needs is either a real feature (folded back into the shared components so every client benefits) or scope creep (billed separately).
- Sales/proof motion: fully-live demo sites (matcha café built first as the reference implementation, then a bakery/restaurant re-skin touching only `theme.ts`/`.env`/content) exist to prove the shared-codebase claim before real client outreach. A third demo (bubble tea) and the pre-build shop validation checklist (list 8 candidate shops, verify Instagram, visit 3 in person) are deferred until after both demos ship.
- Ownership on handoff: the client's Sanity project and Netlify site belong to the client's own accounts (builder invited as admin/collaborator); the GitHub repo stays the builder's, since it's the code reused across clients — this is stated to the client as the reason the price is $500 and not $5,000.

## Capabilities and Constraints

- Five Sanity schema types, deliberately resisted expansion beyond: `siteSettings` (singleton; includes `hours` as a 7-day array of `{dayOfWeek, closed, open, close}` plus a `holidayNote` escape hatch), `menuCategory`, `menuItem` (`price` is a number, not a string, to survive owners typing `"$4.50 "`; optional `priceVariants`; `image` is optional and most items won't have one — the UI must design for that, not treat it as an edge case; `available` boolean is the "86'd" toggle; `tags` from a fixed list: vegan/gluten-free/seasonal/new), `announcement` (`message`, `active`, optional `link`), `page` (About/Story via portable text + heroImage).
- Open/closed status computes at render time from stored 24h time strings (`"09:00"`), in the shop's own timezone — no timezone conversion, no recurring-exceptions system. `holidayNote` covers the "closed Dec 24–26" case instead.
- Confirmed non-goals (say no on the first three builds; each is a real feature that turns a $500 template into an unpaid project): online ordering, payments, reservations (point at Toast/Square instead); blog; multi-location; i18n; analytics dashboards.
- Dark mode is in-scope and implemented (theme-token-driven light/dark palettes in `theme.ts`, applied via `prefers-color-scheme` in `BaseLayout.astro`). This reverses SPEC.md's original "dark mode" non-goal — SPEC.md has been updated to match.
- No client-specific accessibility standard has been named; see Accessibility & Inclusion below for the working default.

## Brand Commitments

None for the template itself — each client site takes its own name, palette, and voice via `theme.ts` and its own Sanity content. No agency or business name has been established for the template product.

## Evidence on Hand

- `SPEC.md` — full schema, pricing, architecture, sales pitch, and non-goals for the template business.
- `PRD.md` — plan for two fully-live demo sites (matcha café, bakery/restaurant) proving the shared-codebase claim before client outreach; as of this session, neither demo has been built yet (only shared-component work exists on `main`).
- No real client has been onboarded yet, and no testimonial, case study, or real shop content exists — future work must not fabricate any of these.

## Product Principles

- Per-client differences live in exactly two files (`.env`, `theme.ts`); anything else is either a real feature (goes into shared components, benefits every client) or scope creep (billed, not silently absorbed).
- Never let visual polish cost the customer finding the hours — the page order (Hero → Announcement → Menu → About → Footer) exists because that's what an actual customer needs, not what's fun to build.
- Build for "a phone on 4G in a parking lot": static HTML/CSS, near-zero JS, fast by default, no server runtime.
- Design for missing/sparse data as the normal case — most menu items have no photo, hours can be closed, an announcement can be off — rather than treating sparse content as an edge case to patch later.
- The Sanity Studio experience is as much the product as the public site: a non-technical owner should never see a raw document-type list, and every field needs a plain-English `description`.

## Accessibility & Inclusion

No formal standard is named in SPEC.md. A prior audit pass on this codebase fixed WCAG 2.1 A/AA-level gaps (missing alt text on content images, missing `<main>` landmark and skip link, no explicit focus-visible styling, a couple of hard-coded status colors bypassing the contrast-checked token system). Treat WCAG AA as the working bar for this template going forward, absent a client-specific requirement.
