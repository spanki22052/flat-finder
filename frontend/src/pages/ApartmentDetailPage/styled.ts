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
  fontSize: 24,
  fontWeight: 700,
  color: theme.colors.text.inverse,
});

export const HeroMeta = styled.div({
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  alignItems: 'center',
  fontSize: 14,
  color: theme.colors.text.secondary,
  marginBottom: 20,
});

export const MeetingBlock = styled.div({
  padding: '16px 18px',
  borderRadius: 16,
  background: 'rgba(52, 211, 153, 0.08)',
  border: '1px solid rgba(52, 211, 153, 0.32)',
  boxShadow: '0 8px 24px rgba(52, 211, 153, 0.08)',
  minWidth: 0,
});

export const MeetingLabel = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#10b981',
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
  gap: 8,
  marginBottom: 8,
});

export const GalleryImage = styled.img({
  width: '100%',
  height: 120,
  objectFit: 'cover',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  cursor: 'pointer',
  transition: theme.transition,
  '&:hover': { transform: 'scale(1.02)', borderColor: theme.colors.accent.primary },
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
  background: 'rgba(159,161,255,0.14)',
  border: '1px solid rgba(159,161,255,0.4)',
  color: '#B5BAFF',
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
    background: 'rgba(159,161,255,0.22)',
    color: '#fff',
  },
});
