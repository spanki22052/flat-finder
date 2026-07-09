// ─── Design Tokens ────────────────────────────────────────────────────────────

export const theme = {
  colors: {
    bg: {
      deep:     '#2a2218',
      base:     '#3c3128',
      card:     'rgba(60, 51, 40, 0.78)',
      cardHover:'rgba(78, 66, 50, 0.92)',
      glass:    'rgba(255, 238, 214, 0.06)',
      glassBorder: 'rgba(255, 238, 214, 0.16)',
    },
    accent: {
      primary:     '#A8AAFF',  // фиолетовый
      primaryLight:'#C5C8FF',  // светло-фиолетовый
      secondary:   '#C1EBE9',  // мятный
      tertiary:    '#D9F9DF',  // светло-зелёный
      highlight:   '#FFEED6',  // светло-бежевый (оставлен для инверсии текста)
    },
    text: {
      primary:  '#D6CCB8',
      secondary:'#D6CCB8',
      muted:    '#B3A78F',
      inverse:  '#FFFAF0',
    },
    status: {
      NEW:      '#9FA1FF',
      ACTIVE:   '#34d399',
      CALLBACK: '#C1EBE9',
      VIEWING:  '#D9F9DF',
      REJECTED: '#fb7185',
      DONE:     '#6b7280',
    },
  },
  gradients: {
    aurora1: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(159, 161, 255, 0.35), transparent)',
    aurora2: 'radial-gradient(ellipse 60% 40% at 80% 10%, rgba(193, 235, 233, 0.2), transparent)',
    aurora3: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(217, 249, 223, 0.18), transparent)',
    card:    'linear-gradient(135deg, rgba(255,238,214,0.06) 0%, rgba(255,238,214,0.01) 100%)',
    accent:  'linear-gradient(135deg, #9FA1FF, #B5BAFF)',
    success: 'linear-gradient(135deg, #9FA1FF, #B5BAFF)',
    warning: 'linear-gradient(135deg, #C1EBE9, #9FA1FF)',
    danger:  'linear-gradient(135deg, #fb7185, #f43f5e)',
  },
  radius: {
    sm:   '8px',
    md:   '12px',
    lg:   '16px',
    xl:   '24px',
    full: '9999px',
  },
  shadows: {
    card:  '0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(168,170,255,0.08) inset',
    glow:  '0 0 20px rgba(168,170,255,0.35)',
    glowSecondary: '0 0 20px rgba(193,235,233,0.35)',
  },
  fonts: {
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    xxl:'1536px',
  },
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

export type Theme = typeof theme;