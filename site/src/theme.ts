// Per-site config, alongside `.env`. If a client needs something beyond
// these tokens and the env vars changed, it's either a real feature (fold it
// back into the shared components) or scope creep (bill it).
export const theme = {
  colors: {
    background: '#faf7f0',
    surface: '#ffffff',
    text: '#1f1a14',
    textMuted: '#6b6459',
    primary: '#4a6741',
    primaryContrast: '#ffffff',
    accent: '#c9a24b',
    border: '#e5ddd0',
  },
  fonts: {
    heading: "'Fraunces', serif",
    body: "'Inter', sans-serif",
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
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
