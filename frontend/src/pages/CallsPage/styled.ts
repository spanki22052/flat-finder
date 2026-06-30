import styled from 'styled-components';
import { Input } from 'antd';
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
});

export const FiltersRow = styled.div({
  display: 'flex',
  gap: 12,
  marginBottom: 20,
  flexWrap: 'wrap',
});

export const SearchInput = styled(Input)({
  maxWidth: 280,
  '.ant-input': { background: 'rgba(255,255,255,0.04) !important' },
});

export const GlassCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
});

export const CallCard = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
  borderRadius: theme.radius.md,
  background: theme.colors.bg.glass,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  transition: theme.transition,
  '&:hover': { background: theme.colors.bg.cardHover },
});

export const CallIcon = styled.div({
  width: 40,
  height: 40,
  borderRadius: 10,
  flexShrink: 0,
  background: theme.colors.bg.glass,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
});

export const CallInfo = styled.div({ flex: 1 });

export const CallTitle = styled.div({
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text.inverse,
});

export const CallMeta = styled.div({
  fontSize: 12,
  color: theme.colors.text.secondary,
  marginTop: 2,
});

export const DurationBadge = styled.div({
  fontSize: 12,
  fontWeight: 600,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.secondary,
  background: theme.colors.bg.glass,
  padding: '2px 8px',
  borderRadius: 6,
});
