import styled from 'styled-components';
import { theme } from '../../../../app/styles/theme';

export const Panel = styled.div({
  width: 380,
  maxWidth: '92vw',
  background: theme.colors.bg.card,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  boxShadow: '0 24px 60px rgba(30, 27, 24, 0.18), 0 4px 16px rgba(150, 67, 37, 0.08)',
  overflow: 'hidden',
  fontFamily: theme.fonts.sans,
});

export const PanelHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
  background: theme.colors.bg.surfaceLow,
});

export const PanelTitle = styled.h3({
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '-0.005em',
  color: theme.colors.text.primary,
  margin: 0,
});

export const PanelCount = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 26,
  height: 22,
  padding: '0 8px',
  borderRadius: 999,
  background: theme.colors.primary,
  color: theme.colors.text.onPrimary,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: '22px',
});

export const PanelList = styled.div({
  maxHeight: 360,
  overflowY: 'auto',
  padding: '6px 0',
  // Scrollbar — keep it subtle.
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-thumb': {
    background: theme.colors.outlineVariant,
    borderRadius: 3,
  },
});

export const PanelItem = styled.div<{ $overdue?: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '12px 18px',
  borderLeft: `3px solid ${props.$overdue ? theme.colors.error : 'transparent'}`,
  transition: theme.transition,
  '&:hover': {
    background: theme.colors.bg.surfaceLow,
  },
  '& + &': {
    borderTop: `1px solid ${theme.colors.bg.glassBorder}`,
  },
}));

export const ItemBody = styled.div({
  flex: '1 1 auto',
  minWidth: 0,
});

export const ItemTitle = styled.div({
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text.primary,
  lineHeight: 1.35,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export const ItemMeta = styled.div({
  marginTop: 6,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
  fontSize: 12,
  color: theme.colors.text.muted,
});

export const ItemTime = styled.span<{ $overdue?: boolean }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontWeight: 600,
  color: props.$overdue ? theme.colors.error : theme.colors.primary,
  '.anticon': { fontSize: 12 },
}));

export const ItemApt = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
  padding: '2px 6px',
  borderRadius: theme.radius.sm,
  transition: theme.transition,
  '.anticon': { color: theme.colors.primary, fontSize: 12 },
  '&:hover': {
    background: theme.colors.primaryFixed,
    color: theme.colors.primary,
  },
});

export const ItemActions = styled.div({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const MarkDone = styled.button({
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: `2px solid ${theme.colors.outlineVariant}`,
  background: 'transparent',
  color: theme.colors.text.muted,
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: theme.transition,
  '&:hover': {
    borderColor: theme.colors.status.ACTIVE,
    background: theme.colors.status.ACTIVE,
    color: '#fff',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: 2,
  },
});

export const PanelFooter = styled.div({
  padding: '10px 12px',
  borderTop: `1px solid ${theme.colors.bg.glassBorder}`,
  background: theme.colors.bg.surfaceLow,
  display: 'flex',
  justifyContent: 'flex-end',
});

export const FooterLink = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 14px',
  border: 'none',
  background: 'transparent',
  color: theme.colors.primary,
  fontFamily: theme.fonts.sans,
  fontSize: 13,
  fontWeight: 600,
  borderRadius: theme.radius.pill,
  cursor: 'pointer',
  transition: theme.transition,
  '.anticon': { fontSize: 12, transition: theme.transition },
  '&:hover': {
    background: theme.colors.primaryFixed,
    color: theme.colors.onPrimaryFixedVariant,
    '.anticon': { transform: 'translateX(2px)' },
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: 2,
  },
});
