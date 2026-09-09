# DESIGN.md — `demo/sketch` branch

<!-- impeccable:design-schema 1 -->

This file documents the visual world built on the `demo/sketch` branch only.
`main` and its `theme.ts`/`global.css` are untouched — this is a swappable
demo skin proving the "conceptual sketch" direction before it's offered to
any client. See `PRODUCT.md` for product truth and `.impeccable/surfaces/site-src-pages-index-astro.md`
for the direction contract this build follows.

## World

**Conceptual sketch.** The site reads as a page torn from the shop owner's
own concept sketchbook — pencil/ink linework, crosshatching, a hand-lettered
marker voice for annotations, sketch-paper grain — rather than the category's
default warm-photo-plus-rounded-card café template. Nothing on the page uses
`border-radius`; every edge that looks drawn is an actual SVG path run
through a hand-wobble filter, not a straight CSS border standing in for one.

## Palette

Paper/graphite greyscale with one desaturated artichoke-green accent
carrying status, price emphasis, and primary actions (~15–20% of the
surface, never scattered as decoration). Contrast-checked against WCAG AA
(all pairs ≥6:1; see below).

| Token | Light | Dark | Role |
|---|---|---|---|
| `background` | `#f4f2ea` | `#211f1a` | page ground (paper) |
| `surface` | `#ece8dc` | `#2a281f` | cards, notes, insets |
| `text` | `#26241f` | `#eae6d9` | ink |
| `textMuted` | `#5c584e` | `#b3ac99` | secondary ink |
| `primary` / `accent` | `#4f5e3f` | `#9bb083` | artichoke green — status, price, CTA |
| `border` | `#26241f` | `#c9c3b0` | ink line color for all drawn strokes |
| `statusOpen` | `#4f5e3f` | `#9bb083` | shares the accent |
| `statusClosed` | `#7a382e` | `#d99a8b` | the palette's one warm departure |

`primary` and `accent` are intentionally the same value — this world commits
to one accent, not a primary/accent pair.

## Type

- **Display / annotation** (`--font-display`): Caveat — the hand that
  "wrote on" the page: shop-name underline callouts, taglines, the
  open/closed stamp, section notes, menu tags. Never used for body copy or
  anything that must be scanned quickly at small size.
- **Heading / structure** (`--font-heading`): Space Grotesk — architectural
  grotesk for h1–h3, category headings, item names, buttons. Deliberately
  not a warm serif; the structure is drawn with a ruler, the annotations are
  drawn by hand.
- **Body** (`--font-body`): IBM Plex Sans — workhorse reading face for
  descriptions and paragraph copy.
- **Mono** (`--font-mono`): IBM Plex Mono — reserved for genuine tabular/
  measurement data only: prices, price variants, the hours list. Not used as
  a "technical" costume elsewhere.

## Motifs (reusable across components)

- **`.ink-rule`** — a 2px line run through `filter: url(#ink-wobble)`;
  replaces every `<hr>`/border-bottom divider in this world.
- **`.crosshatch`** — a 45°/-45° repeating-linear-gradient pair; replaces
  solid fills, shadows, and hover states on outlined buttons.
- **`filter: url(#ink-wobble)` / `#ink-wobble-lg`** — feTurbulence +
  feDisplacementMap SVG filters (defined once in `BaseLayout.astro`,
  reused everywhere) that give straight vector edges a drawn, hand-wobbled
  quality. `-lg` is a larger-amplitude variant for bigger shapes (photo
  frames, the name underline).
- **`.paper-ground`** — a fixed, full-viewport feTurbulence grain layer at
  low opacity behind every section (`#paper-grain` filter), instead of a
  tiled background-image texture.
- **The stamp** — `.stamp` in `Hero.astro`: a rotated, ink-wobbled pill
  outline carrying the open/closed word, standing in for the old solid-color
  dot indicator.
- **Category ink icons** — three hand-drawn SVG line icons (cup, leaf,
  matcha bowl) cycled by category index in `Menu.astro`, not tied to
  category title text. Decoration, not per-item illustration — the data
  model's sparse-image norm (most items have no photo) is treated as the
  default, not an edge case.
- **Dotted leader lines** — `.item-leader` in the menu list: a classic
  hand-written-menu dot leader between item name and price, replacing the
  old `justify-content: space-between` layout.

## What stayed the same

Page order (Hero → Announcement → Menu → About → Footer), all component
props/data contracts, the Sanity schema, dark-mode support via
`prefers-color-scheme`, and the accessibility baseline (skip link, `<main>`
landmark, focus-visible ring, alt text) — this is a visual redesign of the
existing shared component system, not a content or architecture change.

## Hero section (revised: illustration replaces stock photo)

`Hero.astro` uses an asymmetric two-column layout (stacked on mobile, art at
right on desktop ≥800px, bottom-aligned rather than centered so the art
overlaps the copy's baseline instead of sitting in a clean symmetric grid):
shop name/status/actions on one side, a single hand-drawn scene on the
other — no photography anywhere in this world. The scene is the
mood-board-referenced ink-line cat mid-whisk with its own bowl of matcha,
now enlarged to be the hero's primary visual (rotated, no frame, no card),
with rising steam and a hand-drawn circle+arrow annotation ("whisked to
order") pointing at the bowl, replacing the earlier doodle-over-photo
treatment. Reference: a user-supplied mood board of bold-ink zine/poster
illustration (thick confident outlines, naive proportions, hand-lettered
captions) — the mascot and annotation follow that register, distinct from
the thinner wobbled lines used elsewhere in the system.

A hand-torn paper edge (`.hero-tear`, an ink-wobbled jagged SVG path with a
faint crosshatch shadow beneath it) closes the Hero section, giving it a
visible "torn from the notebook, turn the page" transition into whatever
follows (Announcement banner or Menu) instead of an abrupt flat cut.

## Provenance

- All ink-line and paper-grain effects are pure CSS/SVG (`feTurbulence` +
  `feDisplacementMap`), authored directly in this session — no rasters
  generated or sourced there.
- The shop mascot (cat + matcha bowl), the steam, the circle+arrow
  annotation, and the torn-page divider are all hand-authored inline SVG,
  drawn directly in `Hero.astro`, not generated or sourced.
- No stock or sourced photography remains in this world. The earlier
  placeholder Unsplash photograph (`site/public/images/hero-matcha.jpg`)
  has been removed — a real client site would use the shop's own
  photography or a commissioned illustration here, never a generic stock
  image.

## Process note

Built without image generation available in this session, so this shipped
code-led per the skill's contract (no comp round). Given the brief named
its own concrete direction (pencil/ink, crosshatching, greyscale,
annotations, paper texture) it was treated as brief-pinned rather than run
through the full concept-seed roll. The multi-agent finish-review/
documentation pipeline was substituted with an in-thread review (browser
screenshots at mobile and the effective rendered width, console-error check,
mechanical `impeccable detect` pass — zero findings, contrast math for
every color pair) and this document, written directly rather than by the
dedicated subagents, because no subagent fan-out was invoked this session.

## Refine addendum (`demo/sketch-refine` branch)

Carries the same conceptual-sketch world forward for a matcha café
specifically, on top of the branch above.

**Palette.** Swapped the paper/graphite greyscale for a matcha swatch:
`#f1ebe1` paper, `#ffffff` surface, `#44624a` deep-matcha primary/accent,
a new `accentSoft` token (`#8ba888`) for secondary accents (hover fills,
the Hours "today" highlight), ink derived from the deep green
(`#2c3a2f`) rather than pure black. Dark mode inverts the same way the
original file did. Crosshatch/stamp density was dialed back in favor of
negative space — fewer simultaneous ink flourishes per viewport — without
removing the motif system itself.

**Hero.** Rebuilt as full-bleed with a single quiet hand-written headline
(no stacked tagline-arrow-stamp block); the illustration gained a second
hand-drawn animal (a small bird perched beside the matcha bowl, watching
the whisk) alongside the existing cat mascot, all inline SVG, same
provenance discipline as the original scene.

**Motion system.** One shared module, `site/src/scripts/motion.ts`,
owns GSAP + `ScrollTrigger` and a Lenis momentum-scroll instance, and
exposes `revealOnScroll`/`parallax`/`pinSection`/`drawIn` helpers so each
component wires effects declaratively instead of hand-rolling
ScrollTrigger config: the hero illustration draws its strokes in on load
and splits into two parallax layers on scroll; Menu categories/items
reveal on scroll; the Hours section (new, `Hours.astro` — previously hours
only appeared as a plain list in the footer) pins briefly while its rows
reveal one at a time; About gets a clip-path reveal. Every effect checks
`prefers-reduced-motion: reduce` up front and degrades to the plain,
fully-visible CSS state — Lenis isn't even instantiated in that case.

**WebGL.** `site/src/scripts/webgl-image.ts` is a small reusable
Three.js class (one plane, one shader) that ripples the About section's
image around the pointer on hover — lazy-loaded via dynamic `import()` so
Three.js never ships in the shared bundle, only in the chunk that loads
when an About image is actually present. Falls back to the plain
`<img>` when WebGL or motion is unavailable.

**Provenance.** The bird, the hero's parallax/draw-in wiring, the Hours
section, and the WebGL ripple shader are all hand-authored directly in
this session — no rasters or third-party components. `gsap`, `lenis`,
and `three` were added as dependencies (the standard GSAP+Lenis pairing
for scroll-linked motion; Three.js for the one shader effect).

**Verification.** `vitest` (unchanged, still 8/8 green), `astro check`
(0 errors), `astro build` (main bundle 137 KB / 52 KB gzip; the Three.js
chunk is a separate, lazily-loaded 514 KB), and a live `astro dev` pass in
the browser confirming the hero draw-in/parallax, Menu scroll reveals, and
the Hours pin-and-reveal all fire correctly with no console errors. This
dataset's Sanity content has no "about" page, so the WebGL hover effect
couldn't be exercised visually this session — the component still renders
its existing image+frame fallback whenever `heroImage` is present, and the
code path was verified by type-check and read-through rather than a live
screenshot.
