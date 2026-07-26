// ─── Warm Hearth Design Tokens (Stitch Warm Hearth System) ───────────────────

export const theme = {
  colors: {
    bg: {
      // Warm Hearth surface tokens
      surface: '#fff8f5',
      surfaceDim: '#e1d8d4',
      surfaceLow: '#fbf2ed',
      surfaceContainer: '#f5ece7',
      surfaceContainerHigh: '#efe6e2',
      surfaceContainerHighest: '#e9e1dc',
      card: '#ffffff',
      // Legacy aliases — kept so existing page-level styled files still compile.
      // Will be phased out as pages migrate to the new tokens.
      base: '#fff8f5',
      deep: '#fff8f5',
      cardHover: '#fbf2ed',
      glass: 'rgba(255, 219, 207, 0.55)',
      glassBorder: '#e9e1dc',
    },
    text: {
      primary: '#1e1b18',
      secondary: '#55433d',
      muted: '#88726b',
      onPrimary: '#ffffff',
      // Legacy aliases
      inverse: '#1e1b18',
    },
    primary: '#964325',
    primaryHover: '#b55b3b',
    primaryFixed: '#ffdbcf',
    primaryFixedDim: '#ffb59c',
    onPrimaryFixed: '#390c00',
    onPrimaryFixedVariant: '#7a2f12',
    secondary: '#645e4f',
    secondaryContainer: '#e8dfcc',
    tertiary: '#7f5214',
    tertiaryContainer: '#9b6a2b',
    tertiaryFixed: '#ffddb9',
    tertiaryFixedDim: '#f8bb73',
    outline: '#88726b',
    outlineVariant: '#dbc1b9',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    // Legacy aliases — preserve old names so existing pages compile.
    accent: {
      primary: '#964325',
      primaryLight: '#b55b3b',
      secondary: '#9b6a2b',
      tertiary: '#f8bb73',
      highlight: '#FFEED6',
    },
    status: {
      NEW: '#964325',
      ACTIVE: '#4f7a52',
      CALLBACK: '#9b6a2b',
      VIEWING: '#3d6b8a',
      REJECTED: '#ba1a1a',
      DONE: '#88726b',
    },
  },
  gradients: {
    primaryHero: 'linear-gradient(135deg, #964325 0%, #b55b3b 100%)',
    warmSurface: 'linear-gradient(135deg, #fff8f5 0%, #fbf2ed 100%)',
    amberGlow: 'linear-gradient(135deg, #ffddb9 0%, #f8bb73 100%)',
    sunset: 'linear-gradient(135deg, #ffb59c 0%, #ffddb9 100%)',
    // Legacy aliases
    aurora1: 'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(255, 219, 207, 0.55), transparent)',
    aurora2: 'radial-gradient(ellipse 60% 50% at 85% 20%, rgba(255, 221, 185, 0.45), transparent)',
    aurora3: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(232, 223, 204, 0.35), transparent)',
    card: 'linear-gradient(135deg, #ffdbcf 0%, #ffb59c 100%)',
    accent: 'linear-gradient(135deg, #964325 0%, #b55b3b 100%)',
    success: 'linear-gradient(135deg, #4f7a52 0%, #6a9468 100%)',
    warning: 'linear-gradient(135deg, #9b6a2b 0%, #f8bb73 100%)',
    danger:  'linear-gradient(135deg, #ba1a1a 0%, #d8362a 100%)',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    pill: '9999px',
    full: '9999px',
  },
  shadows: {
    card: '0 8px 32px rgba(150, 67, 37, 0.06)',
    cardHover: '0 12px 40px rgba(150, 67, 37, 0.12)',
    soft: '0 4px 16px rgba(150, 67, 37, 0.08)',
    sidebar: '16px 0 32px rgba(150, 67, 37, 0.08)',
    primary: '0 8px 24px rgba(150, 67, 37, 0.3)',
    // Legacy aliases
    glow: '0 0 20px rgba(150, 67, 37, 0.35)',
    glowSecondary: '0 0 20px rgba(155, 106, 43, 0.35)',
  },
  fonts: {
    sans: "'Montserrat', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

export type Theme = typeof theme;