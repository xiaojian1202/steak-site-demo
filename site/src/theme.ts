// Per-site config, alongside `.env`. If a client needs something beyond
// these tokens and the env vars changed, it's either a real feature (fold it
// back into the shared components) or scope creep (bill it).
export const theme = {
  colors: {
    background: '#eaceaa',
    surface: '#ffffff',
    text: '#150c0c',
    textMuted: '#85431e',
    primary: '#34150f',
    primaryContrast: '#eaceaa',
    accent: '#d39858',
    accentContrast: '#150c0c',
    // Secondary whiskey-sour accent — hover fills, "today" highlights,
    // category icon strokes — the light mid-tone against the dark
    // primary, not just the deep browns.
    accentSoft: '#eaceaa',
    border: '#150c0c',
    statusOpen: '#85431e',
    statusClosed: '#34150f',
  },
  // Dark variant of `colors`, applied via prefers-color-scheme in
  // BaseLayout. Same keys, same contrast intent — swap the pair, not the
  // relationships between them.
  darkColors: {
    background: '#150c0c',
    surface: '#34150f',
    text: '#eaceaa',
    textMuted: '#d39858',
    primary: '#d39858',
    primaryContrast: '#150c0c',
    accent: '#eaceaa',
    accentContrast: '#150c0c',
    accentSoft: '#85431e',
    border: '#eaceaa',
    statusOpen: '#d39858',
    statusClosed: '#eaceaa',
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
