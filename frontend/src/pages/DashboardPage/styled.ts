import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../app/styles/theme';

export const fadeUp = {
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

export const shimmer = {
  '0%': { backgroundPosition: '-200% center' },
  '100%': { backgroundPosition: '200% center' },
};

export const PageWrap = styled.div({
  animation: `fadeUp 0.4s ease-out`,
});

export const PageTitle = styled.h1({
  fontSize: 28,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  marginBottom: 6,
});

export const PageSubtitle = styled.p({
  fontSize: 14,
  color: theme.colors.text.secondary,
  marginBottom: 28,
});

export const BentoGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'auto',
  gap: 16,
  '@media (max-width: 1200px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
    gap: 12,
  },
});

export const StatCard = styled.div<{ $span?: number; $accent?: string; $gradient?: string }>((props) => ({
  gridColumn: `span ${props.$span ?? 1}`,
  background: props.$gradient ?? theme.colors.bg.card,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  animation: `fadeUp 0.4s ease-out both`,
  '&:nth-child(1)': { animationDelay: '0.05s' },
  '&:nth-child(2)': { animationDelay: '0.1s' },
  '&:nth-child(3)': { animationDelay: '0.15s' },
  '&:nth-child(4)': { animationDelay: '0.2s' },
  '&:nth-child(5)': { animationDelay: '0.25s' },
  '&:nth-child(6)': { animationDelay: '0.3s' },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: props.$accent ? `${theme.shadows.card}, 0 8px 32px ${props.$accent}22` : theme.shadows.card,
  },
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: props.$gradient ?? theme.gradients.card,
    pointerEvents: 'none',
  },
  '@media (max-width: 640px)': {
    gridColumn: 'span 1',
    padding: '18px 16px',
    borderRadius: theme.radius.lg,
  },
}));

export const StatCardIcon = styled.div<{ $color: string }>((props) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  background: `${props.$color}18`,
  border: `1px solid ${props.$color}30`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  color: props.$color,
  marginBottom: 16,
  '@media (max-width: 640px)': {
    width: 38,
    height: 38,
    fontSize: 18,
    marginBottom: 12,
  },
}));

export const StatValue = styled.div({
  fontSize: 36,
  fontWeight: 800,
  color: theme.colors.text.inverse,
  lineHeight: 1,
  fontFamily: theme.fonts.mono,
  letterSpacing: '-0.02em',
  '@media (max-width: 640px)': { fontSize: 28 },
});

export const StatLabel = styled.div({
  fontSize: 13,
  color: theme.colors.text.secondary,
  marginTop: 6,
  fontWeight: 500,
});

export const StatTrend = styled.div<{ $up: boolean }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  fontWeight: 600,
  color: props.$up ? theme.colors.accent.primary : theme.colors.accent.secondary,
  marginTop: 8,
}));

export const CardTitle = styled.div({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 16,
});

export const AptCard = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  borderRadius: theme.radius.md,
  background: theme.colors.bg.glass,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  transition: theme.transition,
  textDecoration: 'none',
  '&:hover': {
    background: theme.colors.bg.cardHover,
    borderColor: 'rgba(255,255,255,0.15)',
    transform: 'translateX(2px)',
  },
});

export const AptThumb = styled.div<{ $color: string }>((props) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  background: `${props.$color}20`,
  border: `1px solid ${props.$color}35`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  flexShrink: 0,
}));

export const AptInfo = styled.div({ flex: 1, minWidth: 0 });

export const AptTitle = styled.div({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const AptMeta = styled.div({
  fontSize: 12,
  color: theme.colors.text.secondary,
  marginTop: 2,
});

export const AptPrice = styled.div({
  fontSize: 14,
  fontWeight: 700,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.secondary,
  whiteSpace: 'nowrap',
});

export const ArrowIcon = styled.span({
  color: theme.colors.text.muted,
  fontSize: 11,
});

export const AptList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const ReminderItem = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: 12,
  borderRadius: theme.radius.md,
  background: theme.colors.bg.glass,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
});

export const ReminderDot = styled.div<{ $color: string }>((props) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: props.$color,
  marginTop: 5,
  flexShrink: 0,
  boxShadow: `0 0 8px ${props.$color}`,
}));

export const ReminderInfo = styled.div({ flex: 1 });

export const ReminderTitle = styled.div({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.secondary,
});

export const ReminderTime = styled.div({
  fontSize: 12,
  color: theme.colors.text.secondary,
  marginTop: 2,
});

export const SectionHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
});

export const SeeAllLink = styled(Link)({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.accent.primary,
  transition: theme.transition,
  '&:hover': { color: theme.colors.accent.secondary },
});

export const CenterSpin = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 320,
  width: '100%',
});
