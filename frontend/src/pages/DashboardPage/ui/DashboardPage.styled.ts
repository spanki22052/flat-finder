import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { theme } from '@/app/styles/theme';

const BP = {
  sm: '@media (max-width: 640px)',
  md: '@media (max-width: 768px)',
  lg: '@media (max-width: 1024px)',
};

export const CenterSpin = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 360,
});

// ─── Desktop shell ──────────────────────────────────────────────────────────

export const DesktopOnly = styled.div({
  [BP.md]: { display: 'none' },
});

export const Shell = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

// ─── Hero (mirrors TeamPage / ProfilePage ink hero) ─────────────────────────

export const Hero = styled.section({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(140deg, #1e1b18 0%, #3b2a23 55%, #7a2f12 100%)',
  color: theme.colors.text.onPrimary,
  borderRadius: theme.radius.xl,
  padding: '36px 36px 30px',
  boxShadow: '0 24px 60px rgba(30, 27, 24, 0.32)',
  [BP.lg]: { padding: '28px 26px 24px', borderRadius: theme.radius.lg },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 88% -10%, rgba(255, 187, 115, 0.28), transparent 55%),' +
      'radial-gradient(circle at 8% 110%, rgba(248, 187, 115, 0.12), transparent 60%)',
    pointerEvents: 'none',
  },
});

export const HeroRow = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 20,
  minWidth: 0,
});

export const HeroIdentity = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const HeroEyebrow = styled.div({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#f8bb73',
});

export const HeroTitle = styled.h1({
  margin: 0,
  fontFamily: theme.fonts.sans,
  fontSize: 32,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  color: '#fff8f5',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  [BP.lg]: { fontSize: 26 },
});

export const HeroLead = styled.p({
  margin: 0,
  fontSize: 14,
  fontWeight: 500,
  color: 'rgba(255, 248, 245, 0.75)',
  maxWidth: 460,
});

export const HeroActions = styled.div({
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  flexShrink: 0,
});

export const HeroActionBtn = styled.button<{ $variant?: 'primary' | 'ghost' }>((props) => ({
  height: 44,
  borderRadius: theme.radius.md,
  border: '1px solid transparent',
  padding: '0 18px',
  fontWeight: 700,
  fontSize: 14,
  fontFamily: theme.fonts.sans,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  transition: theme.transition,
  whiteSpace: 'nowrap',
  background: props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.06)' : '#f8bb73',
  color: props.$variant === 'ghost' ? '#fff8f5' : '#1e1b18',
  borderColor: props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
  '&:hover': {
    transform: 'translateY(-1px)',
    background: props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.12)' : '#ffddb9',
  },
  '&:focus-visible': { outline: '2px solid #f8bb73', outlineOffset: 2 },
}));

export const HeroMetaRow = styled.div({
  position: 'relative',
  marginTop: 28,
  paddingTop: 24,
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 12,
  [BP.lg]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
});

export const HeroMetaPill = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 0,
  padding: '14px 16px',
  borderRadius: theme.radius.md,
  background: 'rgba(255, 248, 245, 0.06)',
  border: '1px solid rgba(255, 248, 245, 0.1)',
  textDecoration: 'none',
  transition: theme.transition,
  '&:hover': { background: 'rgba(255, 248, 245, 0.1)', borderColor: 'rgba(248, 187, 115, 0.4)' },
  '.value': {
    fontFamily: theme.fonts.sans,
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    color: '#fff8f5',
    fontVariantNumeric: 'tabular-nums',
  },
  '.label': {
    fontSize: 11,
    fontWeight: 700,
    color: '#f8bb73',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

// ─── Desktop content grid ───────────────────────────────────────────────────

export const DesktopGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
  gap: 20,
  alignItems: 'start',
  [BP.lg]: { gridTemplateColumns: '1fr' },
});

export const MainColumn = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  minWidth: 0,
});

export const SideColumn = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  minWidth: 0,
});

export const SectionCard = styled.section({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 24,
  boxShadow: theme.shadows.soft,
  minWidth: 0,
  [BP.lg]: { padding: 20 },
});

export const SectionHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 16,
});

export const SectionTitle = styled.h2({
  fontFamily: theme.fonts.sans,
  fontSize: 17,
  fontWeight: 800,
  color: theme.colors.text.primary,
  margin: 0,
  letterSpacing: '-0.01em',
});

export const SeeAll = styled(Link)({
  color: theme.colors.primary,
  fontWeight: 700,
  fontSize: 12,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  '&:hover': { textDecoration: 'underline' },
});

export const StatusOverview = styled.section({
  padding: '22px 24px 18px',
  borderRadius: theme.radius.xl,
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  boxShadow: theme.shadows.soft,
  [BP.sm]: { padding: 16, borderRadius: theme.radius.lg },
});

export const StatusOverviewHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 22,
});

export const StatusOverviewLead = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
  '& > span': {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
  },
  '& > strong': {
    color: theme.colors.text.primary,
    fontSize: 17,
    lineHeight: 1.2,
  },
});

export const StatusOverviewTotal = styled.span({
  flexShrink: 0,
  color: theme.colors.text.muted,
  fontSize: 12,
  fontWeight: 700,
  paddingTop: 2,
});

export const StatusFlow = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 0,
  [BP.lg]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', rowGap: 22 },
  [BP.sm]: { gridTemplateColumns: '1fr', rowGap: 16 },
});

export const StatusStageLink = styled(Link)<{ $tone: string }>(({ $tone }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  minWidth: 0,
  padding: '0 22px 0 0',
  color: theme.colors.text.primary,
  textDecoration: 'none',
  '&:not(:first-child)': { paddingLeft: 22 },
  '&:not(:last-child)::after': {
    content: '→',
    position: 'absolute',
    right: 8,
    top: 5,
    color: theme.colors.outline,
    fontSize: 18,
    fontWeight: 500,
  },
  '&:hover .stage-label': { color: $tone },
  '&:focus-visible': { outline: `2px solid ${$tone}`, outlineOffset: 4, borderRadius: theme.radius.sm },
  [BP.lg]: {
    '&:nth-child(odd)': { paddingLeft: 0 },
    '&:nth-child(even)': { paddingRight: 0 },
    '&:nth-child(2)::after': { display: 'none' },
  },
  [BP.sm]: {
    padding: '0 0 0 30px !important',
    '&:not(:first-child)': { paddingLeft: 30 },
    '&::after, &:not(:last-child)::after': {
      content: '↓',
      left: 8,
      right: 'auto',
      top: 25,
      fontSize: 16,
    },
  },
}));

export const StatusStageTop = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 8,
  minHeight: 26,
});

export const StatusStageDot = styled.span<{ $tone: string }>(({ $tone }) => ({
  width: 12,
  height: 12,
  flexShrink: 0,
  borderRadius: '50%',
  background: $tone,
  boxShadow: `0 0 0 5px ${$tone}18`,
}));

export const StatusStageCount = styled.strong({
  color: theme.colors.text.primary,
  fontSize: 24,
  lineHeight: 1,
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
});

export const StatusStageLabel = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.colors.text.primary,
  fontSize: 13,
  fontWeight: 800,
  '&.stage-label': { transition: theme.transition },
});

export const StatusStageHint = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.colors.text.muted,
  fontSize: 11,
});

export const StatusArchive = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  flexWrap: 'wrap',
  marginTop: 22,
  paddingTop: 14,
  borderTop: `1px solid ${theme.colors.outlineVariant}`,
  color: theme.colors.text.muted,
  fontSize: 11,
  fontWeight: 700,
  '& > span': { marginRight: 2 },
});

export const StatusArchiveLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  color: theme.colors.text.secondary,
  fontSize: 11,
  fontWeight: 700,
  textDecoration: 'none',
  '&:hover': { color: theme.colors.primary },
  '& strong': { color: theme.colors.text.primary, fontVariantNumeric: 'tabular-nums' },
  '.archive-dot': { width: 7, height: 7, borderRadius: '50%' },
});

export const DashboardError = styled.div({
  maxWidth: 620,
  margin: '80px auto',
  padding: '0 16px',
});

// ─── Apartments grid (desktop) ──────────────────────────────────────────────

export const ApartmentsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 14,
});

export const ApartmentTile = styled(Link)({
  display: 'block',
  overflow: 'hidden',
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.card,
  color: theme.colors.text.primary,
  textDecoration: 'none',
  transition: theme.transition,
  minWidth: 0,
  '&:hover': {
    borderColor: theme.colors.primary,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.cardHover,
  },
});

export const ApartmentTileImage = styled.div<{ $src?: string }>((props) => ({
  height: 120,
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  fontSize: 28,
  color: theme.colors.primary,
  background: props.$src ? `url("${props.$src}") center / cover no-repeat` : theme.colors.primaryFixed,
}));

export const ApartmentStatusBadge = styled.span({
  position: 'absolute',
  right: 8,
  top: 8,
  padding: '4px 8px',
  borderRadius: theme.radius.sm,
  background: 'rgba(255,255,255,0.92)',
  color: theme.colors.primary,
  fontSize: 10,
  fontWeight: 800,
});

export const ApartmentTileBody = styled.div({
  padding: '10px 12px 12px',
  minWidth: 0,
});

export const ApartmentTileTitle = styled.div({
  fontSize: 13,
  fontWeight: 700,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ApartmentTileLocation = styled.div({
  marginTop: 3,
  color: theme.colors.text.muted,
  fontSize: 11,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ApartmentTilePrice = styled.div({
  marginTop: 8,
  color: theme.colors.primary,
  fontSize: 13,
  fontWeight: 800,
});

// ─── Reminders panel (desktop) ──────────────────────────────────────────────

export const RemindersList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const ReminderRow = styled(Link)({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '11px 0',
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  textDecoration: 'none',
  color: 'inherit',
  minWidth: 0,
  '&:last-child': { borderBottom: 'none' },
});

export const ReminderIconWrap = styled.span<{ $overdue?: boolean }>((props) => ({
  flexShrink: 0,
  width: 32,
  height: 32,
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  fontSize: 14,
  background: props.$overdue ? theme.colors.errorContainer : theme.colors.primaryFixed,
  color: props.$overdue ? theme.colors.error : theme.colors.primary,
}));

export const ReminderRowBody = styled.div({
  minWidth: 0,
  flex: 1,
});

export const ReminderRowTitle = styled.div({
  fontSize: 13,
  fontWeight: 700,
  color: theme.colors.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ReminderRowMeta = styled.div({
  marginTop: 2,
  fontSize: 11,
  color: theme.colors.text.muted,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
});

export const ReminderDueBadge = styled.span<{ $overdue?: boolean }>((props) => ({
  fontWeight: 700,
  color: props.$overdue ? theme.colors.error : theme.colors.text.muted,
}));

// ─── Empty state (shared, desktop panels) ───────────────────────────────────

export const EmptyBlock = styled.div({
  padding: '32px 8px',
  textAlign: 'center',
  color: theme.colors.text.muted,
  fontSize: 13,
});

// ─── Quick links row (desktop) ──────────────────────────────────────────────

export const QuickLinksRow = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 14,
  [BP.lg]: { gridTemplateColumns: '1fr' },
});

export const QuickLinkCard = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '18px 20px',
  borderRadius: theme.radius.xl,
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  boxShadow: theme.shadows.soft,
  color: theme.colors.text.primary,
  textDecoration: 'none',
  transition: theme.transition,
  minWidth: 0,
  '&:hover': {
    borderColor: theme.colors.primary,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.cardHover,
  },
});

export const QuickLinkIcon = styled.span<{ $tone: 'coral' | 'sage' | 'amber' }>((props) => {
  const tones = {
    coral: { bg: theme.colors.primaryFixed, fg: theme.colors.primary },
    sage: { bg: '#e4eedc', fg: '#4f7a52' },
    amber: { bg: theme.colors.tertiaryFixed, fg: theme.colors.tertiary },
  };
  const t = tones[props.$tone];
  return {
    flexShrink: 0,
    width: 44,
    height: 44,
    display: 'grid',
    placeItems: 'center',
    borderRadius: theme.radius.md,
    background: t.bg,
    color: t.fg,
    fontSize: 19,
  };
});

export const QuickLinkBody = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  '.title': { fontSize: 14, fontWeight: 700 },
  '.caption': { fontSize: 12, color: theme.colors.text.muted },
});

// ─── Mobile shell ────────────────────────────────────────────────────────────

export const MobileShell = styled.div({
  display: 'none',
  [BP.md]: { display: 'block', margin: '-16px -16px 0' },
});

export const MobileTopBar = styled.header({
  height: 76,
  padding: '14px 20px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.colors.bg.card,
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
});

export const MobileBrand = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: theme.colors.text.primary,
  fontSize: 17,
  fontWeight: 800,
});

export const MobileBrandLogo = styled.span({
  width: 34,
  height: 34,
  borderRadius: 10,
  display: 'grid',
  placeItems: 'center',
  background: theme.colors.primary,
  color: theme.colors.text.onPrimary,
  fontSize: 18,
});

export const MobileBrandCaption = styled.div({
  color: theme.colors.text.muted,
  fontWeight: 600,
  fontSize: 10,
  marginTop: 2,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const MobileTopActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const MobileBellBtn = styled.button({
  border: 0,
  padding: 0,
  width: 38,
  height: 38,
  background: 'transparent',
  color: theme.colors.text.secondary,
  fontSize: 20,
  cursor: 'pointer',
  borderRadius: '50%',
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 2 },
});

export const MobileAvatar = styled(Avatar)({
  marginLeft: 2,
  verticalAlign: 'middle',
  background: theme.colors.tertiaryContainer,
  color: theme.colors.onPrimaryFixed,
  fontWeight: 800,
  fontSize: 12,
});

export const MobileBody = styled.main({
  padding: '20px 16px 112px',
  background: theme.colors.bg.surface,
  minHeight: 'calc(100vh - 76px)',
});

// ─── Mobile progress card ────────────────────────────────────────────────────

export const ProgressCard = styled.section({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(140deg, #1e1b18 0%, #3b2a23 55%, #7a2f12 100%)',
  color: '#fff',
  borderRadius: theme.radius.xl,
  padding: '20px 20px 18px',
  boxShadow: '0 16px 32px rgba(30, 27, 24, 0.28)',
  marginBottom: 16,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 90% -10%, rgba(255, 187, 115, 0.32), transparent 55%),' +
      'radial-gradient(circle at 5% 110%, rgba(248, 187, 115, 0.14), transparent 60%)',
    pointerEvents: 'none',
  },
});

export const ProgressHeader = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
});

export const ProgressEyebrow = styled.div({
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontSize: 10,
  fontWeight: 800,
  color: '#f8bb73',
  marginBottom: 6,
});

export const ProgressTitle = styled.div({
  fontFamily: theme.fonts.sans,
  fontWeight: 800,
  fontSize: 21,
  lineHeight: 1.1,
  color: '#fff8f5',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
});

export const ProgressMeta = styled.span({
  flexShrink: 0,
  padding: '5px 10px',
  borderRadius: theme.radius.pill,
  background: 'rgba(255, 248, 245, 0.14)',
  fontSize: 11,
  whiteSpace: 'nowrap',
  fontWeight: 700,
});

export const ProgressBar = styled.div({
  position: 'relative',
  height: 7,
  borderRadius: 5,
  background: 'rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
  margin: '18px 0 12px',
});

export const ProgressBarFill = styled.div({
  height: '100%',
  borderRadius: 'inherit',
  background: '#f8bb73',
  transition: 'width 0.5s ease',
});

export const ProgressCopy = styled.p({
  position: 'relative',
  margin: 0,
  fontSize: 13,
  lineHeight: 1.45,
  color: 'rgba(255, 248, 245, 0.85)',
});

// ─── Mobile stats + consensus ────────────────────────────────────────────────

export const StatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginBottom: 16,
});

export const StatCard = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: 14,
  border: `1px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.card,
  borderRadius: theme.radius.lg,
  minWidth: 0,
});

export const StatIcon = styled.span<{ $tone: 'coral' | 'sage' }>((props) => ({
  flexShrink: 0,
  width: 38,
  height: 38,
  display: 'grid',
  placeItems: 'center',
  borderRadius: theme.radius.md,
  fontSize: 18,
  background: props.$tone === 'coral' ? theme.colors.primaryFixed : '#e4eedc',
  color: props.$tone === 'coral' ? theme.colors.primary : '#4f7a52',
}));

export const StatValue = styled.div({
  fontSize: 21,
  color: theme.colors.text.primary,
  fontWeight: 800,
  lineHeight: 1.05,
});

export const StatLabel = styled.div({
  color: theme.colors.text.muted,
  fontSize: 11,
  fontWeight: 600,
  marginTop: 3,
});

export const ConsensusCard = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 14,
  borderRadius: theme.radius.lg,
  background: theme.colors.tertiaryFixed,
  border: `1px solid ${theme.colors.tertiaryFixedDim}`,
  color: theme.colors.text.primary,
  textDecoration: 'none',
  marginBottom: 26,
  minWidth: 0,
  '& > .anticon:last-child': { color: theme.colors.tertiary, fontSize: 13, flexShrink: 0 },
});

export const ConsensusIcon = styled.span({
  flexShrink: 0,
  width: 36,
  height: 36,
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  background: theme.colors.tertiaryFixedDim,
  color: theme.colors.onPrimaryFixedVariant,
  fontSize: 17,
});

export const ConsensusContent = styled.div({
  flex: 1,
  minWidth: 0,
  '& > span': { color: theme.colors.text.muted, fontSize: 11, display: 'block', marginTop: 3 },
});

export const ConsensusText = styled.div({
  fontSize: 14,
  fontWeight: 800,
});

// ─── Mobile section headers + apartments rail ───────────────────────────────

export const MobileSectionHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
  margin: '0 0 12px',
});

export const MobileSectionTitle = styled.h2({
  color: theme.colors.text.primary,
  fontSize: 18,
  fontWeight: 800,
  margin: 0,
  lineHeight: 1.2,
});

export const MobileSeeAll = styled(Link)({
  color: theme.colors.primary,
  fontWeight: 800,
  fontSize: 12,
  textDecoration: 'none',
});

export const ApartmentsRail = styled.div({
  display: 'flex',
  gap: 12,
  overflowX: 'auto',
  paddingBottom: 24,
  marginBottom: 18,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const ApartmentCard = styled(Link)({
  display: 'block',
  minWidth: 188,
  width: 188,
  overflow: 'hidden',
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.card,
  color: theme.colors.text.primary,
  textDecoration: 'none',
});

export const ApartmentCardImage = styled.div<{ $src?: string }>((props) => ({
  height: 118,
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  fontSize: 30,
  color: theme.colors.primary,
  background: props.$src ? `url("${props.$src}") center / cover no-repeat` : theme.colors.primaryFixed,
}));

export const ConsensusBadge = styled.span({
  position: 'absolute',
  right: 8,
  top: 8,
  padding: '4px 6px',
  borderRadius: theme.radius.sm,
  background: 'rgba(255,255,255,0.92)',
  color: theme.colors.primary,
  fontSize: 10,
  fontWeight: 800,
});

export const ApartmentCardInfo = styled.div({
  padding: '10px 10px 12px',
});

export const ApartmentCardTitle = styled.div({
  fontSize: 13,
  fontWeight: 800,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ApartmentCardLocation = styled.div({
  marginTop: 4,
  color: theme.colors.text.muted,
  fontSize: 11,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const ApartmentCardPrice = styled.div({
  marginTop: 10,
  color: theme.colors.primary,
  fontSize: 13,
  fontWeight: 800,
});

// ─── Mobile activity feed (reminders) ───────────────────────────────────────

export const ActivityFeed = styled.div({
  padding: '2px 0 14px',
});

export const ActivityItem = styled.div({
  display: 'flex',
  gap: 11,
  padding: '10px 0',
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  '&:last-child': { borderBottom: 0 },
});

export const ActivityAvatar = styled.div<{ $color: string }>((props) => ({
  width: 34,
  height: 34,
  flexShrink: 0,
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  background: props.$color,
  color: '#fff',
  fontSize: 10,
  fontWeight: 800,
}));

export const AvatarInitials = styled.span({
  fontSize: 'inherit',
});

export const ActivityContent = styled.div({
  minWidth: 0,
  paddingTop: 1,
});

export const ActivityText = styled.div({
  color: theme.colors.text.secondary,
  fontSize: 12,
  lineHeight: 1.35,
  '& strong': { color: theme.colors.text.primary },
  '& span': { color: theme.colors.primary, fontWeight: 700 },
});

export const ActivityTime = styled.div({
  color: theme.colors.text.muted,
  fontSize: 10,
  marginTop: 4,
});

export const EmptyPanel = styled.div({
  padding: '6px 0 22px',
  '.ant-empty': { margin: '12px 0' },
  '.ant-empty-description': { fontSize: 12, color: theme.colors.text.muted },
});

export const AddListingButton = styled.button({
  width: '100%',
  border: 0,
  borderRadius: theme.radius.lg,
  padding: 14,
  background: theme.colors.primary,
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 14,
  '& .anticon': { marginRight: 7 },
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});
