import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../app/styles/theme';

export const PageWrap = styled.div({
  maxWidth: 1180,
  margin: '0 auto',
  paddingBottom: 48,
  '@media (max-width: 720px)': { paddingBottom: 28 },
});

export const HeroCard = styled.div({
  background: 'linear-gradient(145deg, #fffdfb 0%, #fff3ed 100%)',
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 40,
  marginBottom: 24,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
  '&::after': {
    content: '""',
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    right: -140,
    top: -170,
    background: 'rgba(255, 181, 156, 0.22)',
    filter: 'blur(4px)',
  },
  '@media (max-width: 720px)': { padding: 24 },
});

export const HeroInner = styled.div<{ $hasSidebar?: boolean }>((props) => ({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: props.$hasSidebar
    ? 'minmax(0, 1fr) minmax(240px, 320px)'
    : 'minmax(0, 1fr)',
  gap: props.$hasSidebar ? 24 : 0,
  alignItems: 'flex-start',
  '@media (max-width: 720px)': {
    gridTemplateColumns: '1fr',
    gap: 16,
  },
}));

export const HeroMain = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const HeroTitle = styled.h1({
  minWidth: 0,
  overflowWrap: 'anywhere',
  fontSize: 'clamp(28px, 4vw, 48px)',
  lineHeight: 1.06,
  fontWeight: 800,
  letterSpacing: '-0.045em',
  color: theme.colors.text.primary,
  textWrap: 'pretty',
  '@media (max-width: 640px)': { fontSize: 30 },
});

export const HeroMeta = styled.div({
  display: 'flex',
  gap: 8,
  minWidth: 0,
  flexWrap: 'wrap',
  alignItems: 'center',
  fontSize: 13,
  color: theme.colors.text.secondary,
  marginBottom: 22,
  '& span': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 10px',
    borderRadius: theme.radius.pill,
    background: 'rgba(255, 255, 255, 0.72)',
    border: `1px solid ${theme.colors.outlineVariant}`,
  },
});

export const MeetingBlock = styled.div({
  padding: '16px 18px',
  borderRadius: 16,
  background: 'rgba(79, 122, 82, 0.08)',
  border: '1px solid rgba(79, 122, 82, 0.32)',
  boxShadow: '0 8px 24px rgba(79, 122, 82, 0.10)',
  minWidth: 0,
});

export const MeetingLabel = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: theme.colors.status.ACTIVE,
  marginBottom: 8,
});

export const MeetingTime = styled.div({
  fontSize: 15,
  fontWeight: 700,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.inverse,
  lineHeight: 1.2,
});

export const MeetingEmpty = styled.div({
  fontSize: 13,
  color: theme.colors.text.muted,
});

export const MeetingTitle = styled.div({
  fontSize: 13,
  color: theme.colors.text.secondary,
  marginTop: 4,
});

export const MeetingActions = styled.div({
  display: 'flex',
  gap: 6,
  marginTop: 12,
  overflowX: 'auto',
  paddingBottom: 2,
  '& > *': { flex: '0 0 auto' },
  '& .ant-btn': { whiteSpace: 'nowrap' },
});

export const PriceDisplay = styled.div({
  fontSize: 'clamp(34px, 5vw, 56px)',
  fontWeight: 800,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.primary,
  lineHeight: 1,
  letterSpacing: '-0.06em',
  marginBottom: 18,
  span: { fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', color: theme.colors.text.muted },
});

// ─── Call CTA ────────────────────────────────────────────────────────────────
// Sits right under the price, where Avito/Cian-style listings put it — the
// single most likely next action on this page. Sage green ties it to the
// "live / act now" meaning already used by the ACTIVE status tag and the
// scheduled-meeting accent, distinct from the terracotta brand gradient.

export const CallRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  flexWrap: 'wrap',
  marginBottom: 10,
});

export const CallBtn = styled.a({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minHeight: 46,
  padding: '0 18px',
  background: theme.colors.primary,
  border: `1px solid ${theme.colors.primary}`,
  borderRadius: theme.radius.lg,
  color: '#fff',
  fontFamily: theme.fonts.sans,
  fontSize: 13,
  fontWeight: 800,
  textDecoration: 'none',
  transition: theme.transition,
  boxShadow: theme.shadows.primary,
  '&:hover': { color: '#fff', background: theme.colors.primaryHover, transform: 'translateY(-1px)' },
  '&:active': { transform: 'translateY(0)' },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.accent.primary}`,
    outlineOffset: 3,
  },
});

export const CallChip = styled.a({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  minHeight: 46,
  padding: '0 14px',
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  color: theme.colors.text.primary,
  fontFamily: theme.fonts.mono,
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  transition: theme.transition,
  '&:hover': {
    color: theme.colors.primary,
    borderColor: theme.colors.primaryFixedDim,
    background: theme.colors.primaryFixed,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.accent.primary}`,
    outlineOffset: 3,
  },
});

export const TagPills = styled.div({
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
});

export const SectionCard = styled.div({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 28,
  marginBottom: 24,
  boxShadow: '0 3px 18px rgba(65, 38, 27, 0.045)',
  '@media (max-width: 640px)': { padding: 20, borderRadius: theme.radius.lg },
});

export const SectionTitle = styled.h2({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 12,
  fontWeight: 800,
  color: theme.colors.text.muted,
  marginBottom: 18,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  '&::before': {
    content: '""',
    width: 24,
    height: 3,
    borderRadius: 99,
    background: theme.colors.primary,
  },
});

export const BackBtn = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  color: theme.colors.text.muted,
  transition: theme.transition,
  marginBottom: 18,
  padding: '8px 12px 8px 0',
  '&:hover': { color: theme.colors.primary, transform: 'translateX(-2px)' },
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});

export const GalleryGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gridAutoRows: 150,
  '@media (max-width: 760px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gridAutoRows: 130,
  },
  gap: 10,
  marginBottom: 8,
});

export const GalleryImage = styled.div({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.outlineVariant}`,
  cursor: 'pointer',
  overflow: 'hidden',
  transition: theme.transition,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)',
  },
  '&:hover img': { transform: 'scale(1.06)' },
  '&:hover': { borderColor: theme.colors.primaryHover, boxShadow: theme.shadows.soft },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.accent.primary}`,
    outlineOffset: 2,
  },
  '&:first-child': {
    gridColumn: 'span 2',
    gridRow: 'span 2',
    '@media (max-width: 760px)': { gridColumn: 'span 2', gridRow: 'span 1' },
  },
});

export const GalleryMore = styled.div({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  background: 'rgba(20, 22, 28, 0.62)',
  color: '#fff',
  fontFamily: theme.fonts.mono,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  transition: theme.transition,
  '& span': {
    fontFamily: theme.fonts.sans,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    opacity: 0.92,
  },
  [`${GalleryImage}:hover &`]: { background: 'rgba(20, 22, 28, 0.72)' },
});

export const GalleryMoreLink = styled.button({
  marginTop: 12,
  padding: 0,
  background: 'transparent',
  border: 0,
  fontFamily: theme.fonts.sans,
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.accent.primary,
  cursor: 'pointer',
  transition: theme.transition,
  '&:hover': { color: theme.colors.accent.secondary },
});

export const ExpandableWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 8,
});

export const DescriptionText = styled.p<{ $expanded: boolean; $collapsedLines: number }>((props) => ({
  color: theme.colors.text.secondary,
  fontSize: 14,
  lineHeight: 1.7,
  margin: 0,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: props.$expanded ? 'unset' : props.$collapsedLines,
  overflow: props.$expanded ? 'visible' : 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

export const ExpandBtn = styled.button({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 0',
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.accent.primary,
  transition: theme.transition,
  '&:hover': { color: theme.colors.accent.secondary },
});

export const HeroStatusRow = styled.div({
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
  marginBottom: 4,
});

export const HeroTitleRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flexWrap: 'wrap',
  marginBottom: 8,
});

export const SourceLinkIcon = styled.button({
  background: theme.colors.primaryFixed,
  border: `1px solid ${theme.colors.primaryFixedDim}`,
  color: theme.colors.onPrimaryFixedVariant,
  width: 32,
  height: 32,
  borderRadius: 8,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.15s ease, color 0.15s ease',
  '&:hover': {
    background: theme.colors.primaryFixedDim,
    color: theme.colors.primaryHover,
  },
});

// ─── Scheduled-meeting card ──────────────────────────────────────────────────
// Replaces the old bordered MeetingBlock. Signature: an oversized day mark
// in mono, month in spaced caps, then time + title + actions as a quiet list.
// Sage accent on the day tile; no gradient, no glow.

export const PlanCta = styled.button({
  width: 'auto',
  minWidth: 200,
  height: 44,
  padding: '0 18px',
  borderRadius: theme.radius.lg,
  border: 0,
  background: theme.gradients.accent,
  color: '#fff',
  fontFamily: theme.fonts.sans,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.01em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  cursor: 'pointer',
  boxShadow: theme.shadows.primary,
  transition: theme.transition,
  '&:hover': { transform: 'translateY(-1px)' },
  '&:active': { transform: 'translateY(0)' },
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});

export const ScheduledCard = styled.article({
  position: 'relative',
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: '20px 22px 18px',
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: 18,
  alignItems: 'flex-start',
  boxShadow: theme.shadows.soft,
  overflow: 'hidden',
});

export const ScheduledAccent = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 3,
  background: '#5e7a55',
});

export const ScheduledDayTile = styled.div({
  width: 92,
  minHeight: 96,
  borderRadius: 14,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 6px',
  flexShrink: 0,
});

export const ScheduledDayNumber = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 44,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: theme.colors.text.primary,
  lineHeight: 1,
});

export const ScheduledDayMonth = styled.span({
  marginTop: 4,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
});

export const ScheduledBody = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const ScheduledEyebrow = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#5e7a55',
  '.anticon': { fontSize: 12 },
});

export const ScheduledTime = styled.div({
  fontFamily: theme.fonts.mono,
  fontSize: 18,
  fontWeight: 700,
  color: theme.colors.text.primary,
  letterSpacing: '-0.01em',
});

export const ScheduledRelative = styled.span({
  fontFamily: theme.fonts.sans,
  fontSize: 12,
  fontWeight: 600,
  color: theme.colors.text.muted,
  marginLeft: 8,
});

export const ScheduledTitle = styled.div({
  fontSize: 14,
  color: theme.colors.text.secondary,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
});

export const ScheduledActions = styled.div({
  display: 'flex',
  gap: 8,
  marginTop: 6,
  flexWrap: 'wrap',
  '& > *': { flex: '0 0 auto' },
});
