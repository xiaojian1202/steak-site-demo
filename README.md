# Café & Beverage Site Template

Astro + Sanity, static, deployed to Netlify. See `SPEC.md` for the full plan.

## Layout

- `site/` — the Astro site (public-facing pages)
- `studio/` — the Sanity Studio (content editing for the shop owner)

## Per-client config

Everything that changes between clients lives in exactly two places:

- `site/.env` — Sanity project ID and dataset for that client
- `site/src/theme.ts` — color tokens, font pair, radius/spacing scale

Anything else that needs to change is either a real feature (fold it back
into the shared components) or scope creep.

## Local setup

```bash
# Studio
cd studio
cp .env.example .env   # fill in SANITY_STUDIO_PROJECT_ID
npm install
npm run dev             # http://localhost:3333

# Site
cd site
cp .env.example .env    # fill in SANITY_PROJECT_ID (same project)
npm install
npm run dev              # http://localhost:4321
```

## Deploy

- **Studio:** `npm run deploy` from `studio/` (deploys to `*.sanity.studio`),
  or point a custom domain at it per the spec.
- **Site:** connect the repo's `site/` directory to Netlify. Add a Sanity
  webhook → Netlify build hook so publishing content triggers a rebuild.
