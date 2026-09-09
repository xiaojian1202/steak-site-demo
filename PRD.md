# Two-Demo Build — PRD

**Status:** confirmed, ready to build
**Date:** 2026-09-08
**Context:** Repo is scaffolded per `SPEC.md`. This document covers the next
phase only — building two live demos before approaching any real client.
See `SPEC.md` for schema, pricing, and long-term architecture; this file
does not repeat it.

---

## Goal

Ship two fully-live demo sites — **matcha café** and **bakery/restaurant** —
built on the real schema with seeded fake content, proving the shared-codebase
claim in `SPEC.md` before any client outreach. Bubble tea (the spec's third
direction) and the spec's pre-build validation checklist (list the 8 real
shops, verify Instagram, visit 3 at 3pm) are both **deferred until after both
demos ship**.

---

## Decisions

### Demo pair
Matcha + bakery/restaurant. Matcha is the proven aesthetic wedge; bakery is
the widest visual departure (savory, warm, less drink-centric), showing more
range than two drink shops would. Bubble tea skipped for this round.

### Fidelity
Fully live — real Netlify URL + real Sanity project + deployed Sanity Studio
for each demo. Matches the spec's own logic: "showing a business = sending a
live URL that already works, menu editor included." Also proves the Sanity
webhook → Netlify rebuild pipeline works before a real client is waiting on
it.

### Architecture — running two configs from one repo
`theme.ts` and `.env` are single-value files, so two live demos need two
branches:

- `demo/matcha` and `demo/bakery`, each with its own `theme.ts` + `.env`.
- Shared component changes land on `main` and merge into both branches.
- Each branch connects to its own Netlify site and its own Sanity project
  (both under the builder's personal account — demos have no client owner
  yet; per `SPEC.md`, a real client gets a fresh project under *their*
  account at conversion time, so the demo project itself never transfers).

**Current state (verified before writing this doc):** the shared components
(`Hero`, `Menu`, `AnnouncementBanner`, `About`, `Footer`) already query Sanity
generically via `src/lib/queries.ts` — none are hardcoded to a client. Sanity
Studio's structure (`studio/structure/index.ts`) is already collapsed to
Menu / Announcement / Shop Info & Hours / Pages, and `menuItem.ts` already has
human-written field descriptions and a working preview (shows `(86'd)` when
unavailable). So this phase is mostly **config + content**, not new component
code.

### Build order
1. Build `demo/matcha` first as the reference implementation — seed content,
   verify every invariant (hours logic, 86'd items, announcement banner),
   run the done checklist below.
2. Re-skin `demo/bakery` by touching **only** `theme.ts`, `.env`, and Sanity
   content — the first real test of the "per-client differences live in
   exactly two files" claim before a paying client does.

### Content
- 3–4 menu categories × 4–6 items each, per demo.
- Fictional shop names, taglines, and copy — entirely invented, no
  resemblance to any of the 8 real candidate shops on the pre-build
  validation list, to avoid confusion if one of them sees a demo before
  being approached.
- Images: mostly omitted, per the schema's own design constraint ("most
  items won't have one — design for that"). 1–2 license-checked free stock
  photos (Unsplash/Pexels) for hero/about only.

### Studio
Deploy both Studios live (`*.sanity.studio`) rather than local-only —
matches "menu editor included" and proves the exact handoff experience a
real client will get. Structure Builder collapse and field descriptions are
already in place (see "current state" above); no further Studio config work
is expected unless the reference build surfaces a gap.

### Validation checklist timing
The spec's pre-build validation (shop list, Instagram check, 3 in-person
conversations) is **deferred entirely** until after both demos ship — it
happens right before outreach starts, not in parallel with the build.

---

## Definition of done, per demo

All of the following must be true before moving to the next demo or to
outreach:

- [ ] All 5 page sections (Hero, Announcement, Menu, About, Footer) render
      with seeded content.
- [ ] Open/closed hours logic verified correct for at least one open-hours
      test case and one closed-hours test case.
- [ ] Announcement banner verified toggling on/off (`active` boolean).
- [ ] At least one menu item marked `available: false` renders correctly
      dimmed/hidden on the site.
- [ ] Checked on an actual phone viewport, not just a resized desktop
      browser window.
- [ ] Lighthouse mobile pass run, no major regressions — matters more here
      than usual given the spec's "phone on 4G in a parking lot" performance
      goal.

---

## Non-goals for this phase

Everything already listed as a non-goal in `SPEC.md` (online ordering,
payments, reservations, blog, multi-location, i18n, analytics, dark mode)
still applies. In addition, for this phase specifically:

- No bubble tea demo yet.
- No pre-build shop validation yet.
- No real client Sanity/Netlify projects yet — both demos live under the
  builder's own accounts.
