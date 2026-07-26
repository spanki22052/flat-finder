import styled from 'styled-components';
import { theme } from '../../app/styles/theme';

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  flexWrap: 'wrap',
  gap: 16,
  '@media (max-width: 640px)': {
    alignItems: 'stretch',
    gap: 12,
    '& > .ant-btn': {
      width: '100%',
      whiteSpace: 'nowrap',
    },
  },
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
  '@media (max-width: 640px)': {
    '& > *': {
      width: '100% !important',
      maxWidth: 'none',
    },
  },
});

export const GlassCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.sm,
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
});

export const ReminderItem = styled.div<{ $done: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'flex-start',
  minWidth: 0,
  gap: 16,
  padding: '20px 24px',
  borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
  transition: theme.transition,
  opacity: props.$done ? 0.55 : 1,
  '&:last-child': { borderBottom: 'none' },
  '&:hover': { background: theme.colors.bg.cardHover },
  '@media (max-width: 640px)': {
    gap: 10,
    padding: '14px 16px',
    flexWrap: 'wrap',
    '& > .ant-space': {
      width: '100%',
      marginLeft: 54,
      overflowX: 'auto',
      flexWrap: 'nowrap',
      '& > .ant-space-item': { flex: '0 0 auto' },
    },
    '& .ant-btn': { whiteSpace: 'nowrap', flex: '0 0 auto' },
  },
}));

export const ReminderIcon = styled.div<{ $done: boolean }>((props) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  flexShrink: 0,
  background: props.$done ? 'rgba(79, 122, 82, 0.10)' : 'rgba(150, 67, 37, 0.10)',
  border: `1px solid ${props.$done ? 'rgba(79, 122, 82, 0.28)' : 'rgba(150, 67, 37, 0.24)'}`,
  color: props.$done ? theme.colors.status.ACTIVE : theme.colors.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
}));

export const ReminderInfo = styled.div({ flex: 1 });

export const ReminderTitle = styled.div<{ $done: boolean }>((props) => ({
  fontSize: 15,
  fontWeight: 600,
  color: theme.colors.text.inverse,
  textDecoration: props.$done ? 'line-through' : 'none',
}));

export const ReminderMeta = styled.div({
  fontSize: 13,
  color: theme.colors.text.secondary,
  marginTop: 4,
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
});

export const DueBadge = styled.div<{ $overdue: boolean }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  fontWeight: 600,
  color: props.$overdue ? theme.colors.error : theme.colors.primary,
  background: props.$overdue ? 'rgba(186, 26, 26, 0.10)' : 'rgba(150, 67, 37, 0.10)',
  padding: '2px 8px',
  borderRadius: 6,
}));

export const EmptyState = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  color: theme.colors.text.muted,
  textAlign: 'center',
});

export const CountBadge = styled.div({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.secondary,
  padding: '12px 24px',
  marginBottom: 8,
});
