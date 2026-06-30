import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
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
  '&::before': {
    content: "''",
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    height: 200,
    background: theme.gradients.aurora1,
    pointerEvents: 'none',
    opacity: 0.6,
  },
});

export const HeroTitle = styled.h1({
  fontSize: 24,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  marginBottom: 8,
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

export const CallItem = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: 12,
  borderRadius: theme.radius.md,
  background: theme.colors.bg.glass,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  marginBottom: 8,
});

export const CallOutcome = styled(Tag)({
  fontSize: 12,
  fontWeight: 600,
  background: theme.colors.bg.glass,
  border: 'none',
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
