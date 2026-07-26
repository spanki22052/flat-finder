import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../app/styles/theme';

const BP = {
  xxl: '@media (max-width: 1280px)',
  lg: '@media (max-width: 1024px)',
  md: '@media (max-width: 768px)',
  sm: '@media (max-width: 640px)',
  xs: '@media (max-width: 480px)',
  xxs: '@media (max-width: 380px)',
};

export const Page = styled.div({
  position: 'relative',
  minHeight: 'calc(100vh - 80px)',
  padding: '24px 24px 140px',
  minWidth: 0,
  maxWidth: '100%',
  overflowX: 'hidden',
  [BP.md]: { padding: '16px 14px 120px' },
  [BP.xs]: { padding: '12px 10px 110px' },
});

export const Shell = styled(motion.div)({
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
  minWidth: 0,
  [BP.md]: { gap: 16 },
});

// ─── Hero ──────────────────────────────────────────────────────────────────

export const HeroCard = styled(motion.section)({
  position: 'relative',
  overflow: 'hidden',
  background: theme.gradients.primaryHero,
  color: theme.colors.text.onPrimary,
  borderRadius: theme.radius.xl,
  padding: '32px 32px 28px',
  boxShadow: theme.shadows.primary,
  [BP.lg]: { padding: '28px 24px 24px', borderRadius: theme.radius.lg },
  [BP.md]: { padding: '24px 20px 22px', borderRadius: theme.radius.lg },
  [BP.sm]: { padding: '22px 18px 20px' },
  [BP.xs]: { padding: '20px 14px 18px' },
});

export const HeroPattern = styled.div({
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(circle at 90% -10%, rgba(255,221,185,0.35), transparent 55%), radial-gradient(circle at 10% 110%, rgba(255,255,255,0.15), transparent 60%)',
  pointerEvents: 'none',
});

export const HeroRow = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
  minWidth: 0,
  [BP.sm]: { gap: 12 },
});

export const HeroHeading = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  margin: 0,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  minWidth: 0,
  [BP.lg]: { fontSize: 28 },
  [BP.md]: { fontSize: 24 },
  [BP.sm]: { fontSize: 22 },
  [BP.xs]: { fontSize: 19 },
  [BP.xxs]: { fontSize: 17 },
});

export const HeroSubtitle = styled.p({
  margin: 0,
  marginTop: 6,
  fontSize: 14,
  opacity: 0.9,
  fontWeight: 500,
  minWidth: 0,
  [BP.sm]: { fontSize: 13 },
  [BP.xs]: { fontSize: 12 },
});

export const HeroActions = styled.div({
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  minWidth: 0,
  [BP.md]: { width: '100%', overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: 4, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } },
});

export const HeroBtn = styled.button<{ $variant?: 'primary' | 'ghost' }>((props) => ({
  height: 44,
  borderRadius: theme.radius.md,
  border: 'none',
  padding: '0 18px',
  fontWeight: 700,
  fontSize: 14,
  fontFamily: theme.fonts.sans,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  transition: theme.transition,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  background: props.$variant === 'ghost' ? 'rgba(255,255,255,0.18)' : '#fff8f5',
  color: props.$variant === 'ghost' ? '#fff' : theme.colors.primary,
  '&:hover': {
    transform: 'translateY(-1px)',
    background: props.$variant === 'ghost' ? 'rgba(255,255,255,0.28)' : '#fff',
  },
  '&:active': { transform: 'translateY(0)' },
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  [BP.sm]: { height: 40, padding: '0 14px', fontSize: 13 },
  [BP.xs]: { padding: '0 12px', fontSize: 12 },
}));

export const StatsRow = styled.div({
  position: 'relative',
  marginTop: 24,
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 14,
  [BP.lg]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 20 },
  [BP.sm]: { marginTop: 18, gap: 10 },
  [BP.xs]: { gap: 8 },
});

export const StatTile = styled.div({
  background: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: theme.radius.lg,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
  overflow: 'hidden',
  '.value': {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    overflowWrap: 'anywhere',
  },
  '.label': {
    fontSize: 12,
    fontWeight: 600,
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  [BP.lg]: { padding: '12px 14px' },
  [BP.md]: { padding: '12px 14px' },
  [BP.sm]: { padding: '10px 12px', '.value': { fontSize: 20 } },
  [BP.xs]: { '.value': { fontSize: 18 } },
});

// ─── Controls ──────────────────────────────────────────────────────────────

export const ControlsRow = styled.div({
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  alignItems: 'center',
  minWidth: 0,
  [BP.md]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
});

export const SearchInput = styled.div({
  position: 'relative',
  flex: '1 1 260px',
  minWidth: 180,
  display: 'flex',
  alignItems: 'center',
  background: theme.colors.bg.card,
  border: `2px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.md,
  height: 44,
  padding: '0 14px',
  transition: theme.transition,
  '&:focus-within': {
    borderColor: theme.colors.primary,
    boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
  },
  '& .icon': {
    color: theme.colors.text.muted,
    fontSize: 16,
    marginRight: 10,
    display: 'inline-flex',
    flexShrink: 0,
  },
  '& input': {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    minWidth: 0,
    fontSize: 14,
    fontFamily: theme.fonts.sans,
    color: theme.colors.text.primary,
    '&::placeholder': { color: theme.colors.text.muted },
  },
  [BP.md]: { flex: '1 1 auto', width: '100%' },
  [BP.sm]: { height: 42 },
});

export const ChipsRow = styled.div({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  minWidth: 0,
  [BP.md]: {
    width: '100%',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const FilterChip = styled.button<{ $active?: boolean }>((props) => ({
  height: 36,
  padding: '0 14px',
  borderRadius: theme.radius.pill,
  border: `1.5px solid ${props.$active ? theme.colors.primary : theme.colors.outlineVariant}`,
  background: props.$active ? theme.colors.primaryFixed : theme.colors.bg.card,
  color: props.$active ? theme.colors.onPrimaryFixedVariant : theme.colors.text.secondary,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  transition: theme.transition,
  fontFamily: theme.fonts.sans,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: theme.colors.primary,
    background: props.$active ? theme.colors.primaryFixed : theme.colors.bg.surfaceLow,
  },
  [BP.sm]: { height: 34, fontSize: 12, padding: '0 12px' },
}));

// ─── Table ─────────────────────────────────────────────────────────────────

export const TableCard = styled(motion.section)({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 8,
  boxShadow: theme.shadows.soft,
  overflow: 'hidden',
  minWidth: 0,
  containerType: 'inline-size',
  [BP.md]: { borderRadius: theme.radius.lg, padding: 4 },
});

export const MemberGrid = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  minWidth: 0,
});

// ─── Member Row: container-query driven to stay adaptive inside TableCard ─
export const MemberRow = styled(motion.li)({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
  gridTemplateAreas: '"avatar main stats actions"',
  alignItems: 'center',
  gap: 16,
  padding: '14px 16px',
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  transition: theme.transition,
  minWidth: 0,
  overflow: 'hidden',
  '&:hover': {
    background: theme.colors.bg.card,
    borderColor: theme.colors.primaryFixed,
    boxShadow: theme.shadows.soft,
  },
  // Container query fallback: if row is too narrow, stack to vertical card.
  '@container (max-width: 720px)': {
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gridTemplateAreas: `"avatar main" "stats stats" "actions actions"`,
    rowGap: 12,
  },
  '@container (max-width: 380px)': {
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gridTemplateAreas: `"avatar main" "stats stats" "actions actions"`,
    rowGap: 10,
    padding: '12px 12px',
  },
  // Media query fallback for browsers without container queries.
  [BP.lg]: {
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    gridTemplateAreas: `"avatar main actions" "stats stats stats"`,
    rowGap: 12,
  },
  [BP.md]: {
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gridTemplateAreas: `"avatar main" "stats stats" "actions actions"`,
    rowGap: 12,
  },
  [BP.xs]: { padding: '12px 12px', rowGap: 10 },
});

export const Avatar = styled.div<{ $hue?: number }>((props) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: `linear-gradient(135deg, hsl(${(props.$hue ?? 0) * 40 % 360}, 60%, 55%), hsl(${((props.$hue ?? 0) * 40 + 30) % 360}, 65%, 45%))`,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 17,
  letterSpacing: '0.02em',
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(150, 67, 37, 0.18)',
  gridArea: 'avatar',
  [BP.sm]: { width: 44, height: 44, fontSize: 15 },
  [BP.xs]: { width: 40, height: 40, fontSize: 14 },
}));

export const Main = styled.div({
  minWidth: 0,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  gridArea: 'main',
});

export const NameRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  minWidth: 0,
  maxWidth: '100%',
});

export const NameText = styled.span({
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: '0 1 auto',
  minWidth: 0,
  maxWidth: '100%',
  [BP.xs]: { fontSize: 14 },
});

export const RoleTag = styled.span<{ $owner?: boolean }>((props) => ({
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: theme.radius.pill,
  background: props.$owner ? theme.colors.primaryFixed : theme.colors.secondaryContainer,
  color: props.$owner ? theme.colors.onPrimaryFixedVariant : theme.colors.text.secondary,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
}));

export const SelfBadge = styled.span({
  fontSize: 10,
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: theme.radius.pill,
  background: theme.colors.accent.highlight,
  color: theme.colors.text.secondary,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
});

export const Meta = styled.div({
  display: 'flex',
  gap: 14,
  fontSize: 12,
  color: theme.colors.text.muted,
  flexWrap: 'wrap',
  minWidth: 0,
  '& > span': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:last-child': { whiteSpace: 'normal' },
  },
  [BP.xs]: { gap: 8, fontSize: 11 },
});

export const StatsInline = styled.div({
  gridArea: 'stats',
  display: 'flex',
  gap: 6,
  alignItems: 'center',
  flexWrap: 'wrap',
  minWidth: 0,
});

export const StatPill = styled.div<{ $tone?: 'amber' | 'sage' | 'muted' }>((props) => {
  const tones = {
    amber: { bg: theme.colors.tertiaryFixed, color: theme.colors.onPrimaryFixedVariant },
    sage: { bg: '#e8f0e7', color: '#3a5d3e' },
    muted: { bg: theme.colors.bg.surfaceContainerHigh, color: theme.colors.text.secondary },
  } as const;
  const t = tones[props.$tone ?? 'muted'];
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '6px 10px',
    minWidth: 52,
    background: t.bg,
    color: t.color,
    borderRadius: theme.radius.md,
    flex: '0 0 auto',
    '.value': { fontSize: 16, fontWeight: 800, lineHeight: 1 },
    '.label': { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' },
  };
});

export const Actions = styled.div({
  display: 'flex',
  gap: 8,
  flexShrink: 0,
  gridArea: 'actions',
  flexWrap: 'wrap',
  minWidth: 0,
  [BP.lg]: {
    justifyContent: 'flex-end',
  },
});

export const IconBtn = styled.button<{ $variant?: 'default' | 'danger' | 'primary' }>((props) => {
  const variants = {
    default: { bg: theme.colors.bg.card, color: theme.colors.text.secondary, border: theme.colors.outlineVariant },
    primary: { bg: theme.colors.primaryFixed, color: theme.colors.onPrimaryFixedVariant, border: theme.colors.primaryFixed },
    danger: { bg: '#ffdad6', color: theme.colors.error, border: '#ffb3ac' },
  } as const;
  const v = variants[props.$variant ?? 'default'];
  return {
    height: 36,
    minWidth: 36,
    padding: '0 12px',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${v.border}`,
    background: v.bg,
    color: v.color,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: theme.transition,
    fontFamily: theme.fonts.sans,
    flex: '0 0 auto',
    whiteSpace: 'nowrap',
    '&:hover': {
      transform: 'translateY(-1px)',
      filter: 'brightness(0.97)',
    },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
    '> .btn-label': {
      display: 'inline',
    },
    [BP.md]: {
      '> .btn-label': { display: 'none' },
    },
  };
});

export const EmptyState = styled.div({
  padding: '48px 24px',
  textAlign: 'center',
  color: theme.colors.text.muted,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'center',
  '.icon': {
    fontSize: 32,
    color: theme.colors.outline,
    marginBottom: 4,
  },
  '.title': { fontSize: 16, fontWeight: 700, color: theme.colors.text.primary },
  '.hint': { fontSize: 13, color: theme.colors.text.muted },
  [BP.sm]: { padding: '32px 16px' },
});

export const SkeletonRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '14px 16px',
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  marginBottom: 10,
  minWidth: 0,
});

export const FormRow = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 14,
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  input: {
    height: 44,
    padding: '0 14px',
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.outlineVariant}`,
    background: theme.colors.bg.surfaceLow,
    fontSize: 15,
    color: theme.colors.text.primary,
    fontFamily: theme.fonts.sans,
    transition: theme.transition,
    width: '100%',
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
    },
    '&:disabled': { opacity: 0.6 },
  },
});

export const FormActions = styled.div({
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  marginTop: 8,
});

export const InviteCallout = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 16px',
  borderRadius: theme.radius.md,
  background: theme.colors.bg.surfaceLow,
  border: `1px dashed ${theme.colors.outlineVariant}`,
  flexWrap: 'wrap',
  minWidth: 0,
  '> div': { minWidth: 0, flex: '1 1 auto' },
  '.code': {
    fontFamily: theme.fonts.mono,
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: theme.colors.text.primary,
    fontSize: 15,
    overflowWrap: 'anywhere',
  },
  '.label': {
    fontSize: 11,
    fontWeight: 700,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 2,
  },
  [BP.sm]: { padding: '10px 14px', '.code': { fontSize: 14 } },
});

export const Hint = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px',
  borderRadius: theme.radius.md,
  background: theme.colors.tertiaryFixed,
  color: theme.colors.text.secondary,
  fontSize: 13,
  fontWeight: 500,
  minWidth: 0,
  [BP.sm]: { padding: '10px 14px', fontSize: 12 },
  [BP.xs]: { padding: '10px 12px', fontSize: 12 },
});

export const PendingDot = styled.span<{ $color?: string }>((props) => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: props.$color ?? theme.colors.primary,
  boxShadow: `0 0 0 3px ${props.$color ? props.$color + '33' : 'rgba(150, 67, 37, 0.18)'}`,
}));
