import styled from 'styled-components';
import { theme } from '../../app/styles/theme';

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  flexWrap: 'wrap',
  gap: 16,
});

export const PageTitle = styled.h1({
  fontSize: 26,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  margin: 0,
});

export const Actions = styled.div({
  display: 'flex',
  gap: 8,
});

export const Card = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.sm,
  padding: '32px 28px',
  boxShadow: theme.shadows.card,
  color: theme.colors.text.inverse,
});

export const TopBlock = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  paddingBottom: 24,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
});

export const AvatarWrap = styled.div({
  flexShrink: 0,
});

export const Name = styled.h2({
  margin: 0,
  fontSize: 22,
  fontWeight: 700,
  color: theme.colors.text.inverse,
});

export const Role = styled.div({
  marginTop: 4,
  fontSize: 13,
  color: theme.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const MetaRow = styled.div({
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  marginTop: 28,
  paddingTop: 24,
  borderTop: `1px solid ${theme.colors.bg.glassBorder}`,
});

export const MetaItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 14,
});

export const MetaIcon = styled.span({
  width: 32,
  height: 32,
  borderRadius: 8,
  background: theme.colors.bg.cardHover,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  color: theme.colors.text.inverse,
});

export const MetaText = styled.span({
  color: theme.colors.text.muted,
});