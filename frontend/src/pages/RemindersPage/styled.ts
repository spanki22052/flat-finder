import styled, { keyframes } from 'styled-components';
import { Avatar } from 'antd';
import { theme } from '../../app/styles/theme';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 24,
  flexWrap: 'wrap',
  gap: 16,
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

export const PageHeaderTitleGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const PageTitle = styled.h1({
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: theme.colors.text.inverse,
});

export const PageSubtitle = styled.div({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.muted,
});

export const FiltersRow = styled.div({
  display: 'flex',
  gap: 12,
  marginBottom: 20,
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '12px 16px',
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadows.soft,
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

export const ResultsBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginLeft: 'auto',
  padding: '8px 14px',
  borderRadius: theme.radius.pill,
  background: theme.colors.primaryFixed,
  color: theme.colors.onPrimaryFixedVariant,
  fontSize: 13,
  fontWeight: 700,
  whiteSpace: 'nowrap',
});

export const DesktopList = styled.div({
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

export const GlassCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
});

export const ReminderItem = styled.div<{ $done: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'flex-start',
  minWidth: 0,
  gap: 16,
  padding: '18px 24px',
  borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
  transition: 'background-color 0.15s ease',
  opacity: props.$done ? 0.55 : 1,
  '&:last-child': { borderBottom: 'none' },
  '&:hover': { background: theme.colors.bg.surfaceLow },
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
  transition: 'transform 0.15s ease',
}));

export const ReminderInfo = styled.div({ flex: 1, minWidth: 0 });

export const ReminderTitle = styled.div<{ $done: boolean }>((props) => ({
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  textDecoration: props.$done ? 'line-through' : 'none',
}));

export const RowActions = styled.div({
  display: 'flex',
  gap: 8,
  flexShrink: 0,
  '.ant-btn': {
    borderRadius: 8,
  },
});

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
  padding: '72px 20px',
  color: theme.colors.text.muted,
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'center',
});

export const EmptyIconWrap = styled.div({
  width: 96,
  height: 96,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle, rgba(150, 67, 37, 0.14), rgba(150, 67, 37, 0.03))',
  marginBottom: 16,
});

export const CountBadge = styled.div({
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: theme.colors.text.muted,
  padding: '14px 24px',
  marginBottom: 4,
});

// ─── Mobile FlatFinder shell (matches Apartments/Profile mobile) ─────────────

export const MobileShell = styled.div({
  display: 'none',
  '@media (max-width: 640px)': {
    display: 'block',
    margin: '-16px -16px 0',
  },
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
});

export const MobileAvatar = styled(Avatar)({
  marginLeft: 4,
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

export const MobileToolbar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 16,
});

export const MobileHeading = styled.h1({
  fontSize: 24,
  fontWeight: 800,
  color: theme.colors.text.primary,
  lineHeight: 1.1,
  '& > span': {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
});

export const MobileAddBtn = styled.button({
  flex: '0 0 auto',
  height: 40,
  paddingInline: 16,
  borderRadius: 8,
  border: 0,
  background: theme.colors.primary,
  color: '#fff',
  fontSize: 14,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});

export const MobileChips = styled.div({
  display: 'flex',
  gap: 8,
  marginBottom: 18,
  overflowX: 'auto',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const MobileChip = styled.button<{ $active?: boolean }>((props) => ({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  height: 34,
  paddingInline: 14,
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  border: `1px solid ${props.$active ? theme.colors.primary : theme.colors.outlineVariant}`,
  background: props.$active ? theme.colors.primary : theme.colors.bg.card,
  color: props.$active ? '#fff' : theme.colors.text.secondary,
}));

export const MobileSectionLabel = styled.div({
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: theme.colors.text.muted,
  marginBottom: 10,
  marginTop: 4,
});

export const MobileList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginBottom: 22,
});

export const MobileReminderCard = styled.article<{ $done?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: ${theme.colors.bg.card};
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.soft};
  opacity: ${(props) => (props.$done ? 0.6 : 1)};
  animation: ${fadeInUp} 0.3s ease both;
  &:active {
    transform: scale(0.99);
  }
`;

export const MobileReminderIcon = styled.div<{ $done?: boolean }>((props) => ({
  width: 40,
  height: 40,
  borderRadius: 10,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  background: props.$done ? 'rgba(79, 122, 82, 0.10)' : 'rgba(150, 67, 37, 0.10)',
  color: props.$done ? theme.colors.status.ACTIVE : theme.colors.primary,
}));

export const MobileReminderInfo = styled.div({ flex: 1, minWidth: 0 });

export const MobileReminderTitle = styled.div<{ $done?: boolean }>((props) => ({
  fontSize: 14,
  fontWeight: 700,
  color: theme.colors.text.primary,
  textDecoration: props.$done ? 'line-through' : 'none',
  marginBottom: 4,
}));

export const MobileReminderMeta = styled.div({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  fontSize: 12,
  color: theme.colors.text.secondary,
});

export const MobileReminderActions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  flexShrink: 0,
});

export const MobileEmptyState = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '56px 20px',
  color: theme.colors.text.muted,
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'center',
  gap: 6,
});
