// Per-site config, alongside `.env`. If a client needs something beyond
// these tokens and the env vars changed, it's either a real feature (fold it
// back into the shared components) or scope creep (bill it).
export const theme = {
  colors: {
    background: '#f1ebe1',
    surface: '#ffffff',
    text: '#2c3a2f',
    textMuted: '#5c6b5c',
    primary: '#44624a',
    primaryContrast: '#f1ebe1',
    accent: '#44624a',
    accentContrast: '#f1ebe1',
    // Secondary matcha accent — hover fills, "today" highlights, category
    // icon strokes — so the palette's mid-green swatch gets used too,
    // not just the deep primary/accent green.
    accentSoft: '#8ba888',
    border: '#2c3a2f',
    statusOpen: '#44624a',
    statusClosed: '#a3583f',
  },
  // Dark variant of `colors`, applied via prefers-color-scheme in
  // BaseLayout. Same keys, same contrast intent — swap the pair, not the
  // relationships between them.
  darkColors: {
    background: '#1b2620',
    surface: '#24322a',
    text: '#eef1e9',
    textMuted: '#aebfae',
    primary: '#a9c39a',
    primaryContrast: '#152019',
    accent: '#a9c39a',
    accentContrast: '#152019',
    accentSoft: '#8ba888',
    border: '#cdd8c8',
    statusOpen: '#a9c39a',
    statusClosed: '#dd9c85',
  },
  fonts: {
    // Marker/hand-lettered display voice for the shop name and annotations,
    // paired with an architectural grotesk for structural headings and a
    // mono workhorse for prices/labels — see DESIGN.md for the sketchbook
    // rationale. Never fall back to a system face here.
    display: "'Caveat', cursive",
    heading: "'Space Grotesk', sans-serif",
    body: "'IBM Plex Sans', sans-serif",
    mono: "'IBM Plex Mono', monospace",
  },
  radius: {
    // Zero throughout — every edge in this world is a drawn ink line, not a
    // rounded rectangle. Kept as tokens (not deleted) so a future client
    // theme can still opt back into soft corners.
    sm: '0px',
    md: '0px',
    lg: '0px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2.5rem',
    xl: '4rem',
  },
} as const

export type Theme = typeof theme
