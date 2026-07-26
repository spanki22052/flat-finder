import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../app/styles/theme';

export const PageWrap = styled.div({
  maxWidth: 900,
  margin: '0 auto',
});

export const HeroCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  padding: 32,
  marginBottom: 20,
  position: 'relative',
  overflow: 'hidden',
});

export const HeroInner = styled.div({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(240px, 320px)',
  gap: 24,
  alignItems: 'flex-start',
  '@media (max-width: 720px)': {
    gridTemplateColumns: '1fr',
  },
});

export const HeroMain = styled.div({
  minWidth: 0,
});

export const HeroTitle = styled.h1({
  minWidth: 0,
  overflowWrap: 'anywhere',
  fontSize: 24,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  '@media (max-width: 640px)': { fontSize: 20 },
});

export const HeroMeta = styled.div({
  display: 'flex',
  gap: 16,
  minWidth: 0,
  flexWrap: 'wrap',
  alignItems: 'center',
  fontSize: 14,
  color: theme.colors.text.secondary,
  marginBottom: 20,
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
  fontSize: 32,
  fontWeight: 800,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.inverse,
  lineHeight: 1,
  marginBottom: 16,
  span: { fontSize: 16, fontWeight: 500, color: theme.colors.text.secondary },
});

export const TagPills = styled.div({
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
});

export const SectionCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  padding: 24,
  marginBottom: 20,
});

export const SectionTitle = styled.h2({
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const BackBtn = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 14,
  color: theme.colors.text.secondary,
  transition: theme.transition,
  marginBottom: 16,
  '&:hover': { color: theme.colors.accent.primary },
});

export const GalleryGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  '@media (max-width: 640px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  gap: 8,
  marginBottom: 8,
});

export const GalleryImage = styled.div({
  position: 'relative',
  width: '100%',
  height: 120,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  cursor: 'pointer',
  overflow: 'hidden',
  transition: theme.transition,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: theme.transition,
  },
  '&:hover img': { transform: 'scale(1.04)' },
  '&:hover': { borderColor: theme.colors.accent.primary },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.accent.primary}`,
    outlineOffset: 2,
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
  width: '100%',
  height: 48,
  borderRadius: 14,
  border: 0,
  background: theme.gradients.accent,
  color: '#fff',
  fontFamily: theme.fonts.sans,
  fontSize: 14,
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
