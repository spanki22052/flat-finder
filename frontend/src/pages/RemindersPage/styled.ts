import styled, { keyframes } from 'styled-components';
import { Segmented } from 'antd';
import { Link } from 'react-router-dom';
import { theme } from '@/app/styles/theme';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Shell = styled.div({
  '@media (max-width: 640px)': { display: 'none' },
});

// ─── Page header ──────────────────────────────────────────────────────────
export const PageHeader = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: 24,
  marginBottom: 28,
  flexWrap: 'wrap',
});

export const HeaderTitleGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 0,
});

export const HeaderEyebrow = styled.span({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: theme.colors.primary,
});

export const HeaderTitle = styled.h1({
  fontFamily: theme.fonts.display,
  fontSize: 40,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: theme.colors.text.primary,
  margin: 0,
  lineHeight: 1.05,
});

export const HeaderLead = styled.p({
  fontSize: 15,
  color: theme.colors.text.secondary,
  margin: 0,
  maxWidth: 560,
  lineHeight: 1.5,
});

export const HeaderActions = styled.div({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
});

export const NewButton = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  height: 48,
  paddingInline: 22,
  border: 'none',
  borderRadius: 14,
  background: theme.gradients.accent,
  color: '#fff',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: theme.shadows.primary,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': { transform: 'translateY(-1px)', boxShadow: theme.shadows.glow },
  '&:active': { transform: 'translateY(0)' },
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});

// ─── Week strip ───────────────────────────────────────────────────────────
export const WeekStrip = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 8,
  marginBottom: 16,
  padding: 12,
  background: theme.colors.bg.card,
  borderRadius: theme.radius.xl,
  border: `1px solid ${theme.colors.outlineVariant}`,
  boxShadow: theme.shadows.soft,
});

export const WeekDay = styled.button<{ $active: boolean }>((props) => ({
  appearance: 'none',
  border: 'none',
  background: props.$active ? theme.colors.primary : 'transparent',
  color: props.$active ? '#fff' : theme.colors.text.primary,
  borderRadius: 14,
  padding: '12px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
  transition: 'background 0.15s ease, transform 0.15s ease',
  fontFamily: 'inherit',
  '&:hover': {
    background: props.$active ? theme.colors.primaryHover : theme.colors.bg.surfaceLow,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: 2,
  },
}));

export const WeekDayLetter = styled.span({
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  opacity: 0.7,
});

export const WeekDayNumber = styled.span<{ $today: boolean }>((props) => ({
  fontFamily: theme.fonts.display,
  fontSize: 26,
  fontWeight: 700,
  lineHeight: 1,
  position: 'relative',
  ...(props.$today && {
    textDecoration: 'underline',
    textDecorationColor: theme.colors.accent.tertiary,
    textDecorationThickness: 3,
    textUnderlineOffset: 6,
  }),
}));

export const WeekDayToday = styled.span({
  fontSize: 10,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  height: 16,
  display: 'inline-flex',
  alignItems: 'center',
  opacity: 0.85,
});

export const WeekDayCount = styled.span<{ $today: boolean; $hasCount: boolean }>((props) => ({
  fontSize: 12,
  fontWeight: 800,
  minWidth: 22,
  height: 22,
  padding: '0 6px',
  borderRadius: 11,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: props.$hasCount
    ? (props.$today ? 'rgba(255,255,255,0.25)' : theme.colors.primaryFixed)
    : 'transparent',
  color: props.$hasCount
    ? (props.$today ? '#fff' : theme.colors.onPrimaryFixedVariant)
    : theme.colors.text.muted,
}));

// ─── Filters bar ──────────────────────────────────────────────────────────
export const FiltersBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 24,
  flexWrap: 'wrap',
});

export const SegmentedControl = styled(Segmented)({
  background: theme.colors.bg.card,
  padding: 4,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.outlineVariant}`,
  '.ant-segmented-item': {
    borderRadius: 10,
    fontWeight: 600,
  },
  '.ant-segmented-item-selected': {
    background: theme.colors.primary,
    color: '#fff',
  },
});

export const SegmentedOption = styled.span<{ $active: boolean }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  fontWeight: props.$active ? 700 : 600,
}));

// ─── Sections ─────────────────────────────────────────────────────────────
export const SectionBlock = styled.section`
  margin-bottom: 28px;
  animation: ${fadeInUp} 0.2s ease both;
`;

export const SectionHeader = styled.header({
  display: 'flex',
  alignItems: 'baseline',
  gap: 12,
  marginBottom: 12,
  padding: '0 4px',
  flexWrap: 'wrap',
});

export const SectionEyebrow = styled.span({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
});

export const SectionTitle = styled.h2({
  fontFamily: theme.fonts.display,
  fontSize: 22,
  fontWeight: 700,
  color: theme.colors.text.primary,
  margin: 0,
  letterSpacing: '-0.01em',
});

export const SectionMeta = styled.span({
  fontSize: 13,
  color: theme.colors.text.muted,
  marginLeft: 'auto',
});

export const OverdueBanner = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 18px',
  marginBottom: 12,
  borderRadius: theme.radius.lg,
  background: 'rgba(186, 26, 26, 0.07)',
  border: '1px solid rgba(186, 26, 26, 0.18)',
  color: theme.colors.error,
  '& > .anticon': { fontSize: 18 },
});

// ─── Reminder card ────────────────────────────────────────────────────────
export const ReminderCard = styled.article<{ $done: boolean; $overdue: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
  padding: '18px 20px',
  background: theme.colors.bg.card,
  border: `1px solid ${props.$overdue ? 'rgba(186, 26, 26, 0.22)' : theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  marginBottom: 8,
  transition: 'box-shadow 0.15s ease, transform 0.15s ease',
  opacity: props.$done ? 0.6 : 1,
  position: 'relative',
  ...(props.$overdue && {
    boxShadow: '0 0 0 3px rgba(186, 26, 26, 0.06)',
  }),
  '&:hover': {
    boxShadow: theme.shadows.soft,
    transform: 'translateY(-1px)',
  },
}));

export const ReminderCardIcon = styled.div<{ $done: boolean; $overdue: boolean }>((props) => {
  const baseColor = props.$done
    ? theme.colors.status.ACTIVE
    : props.$overdue
      ? theme.colors.error
      : theme.colors.primary;
  return {
    width: 48,
    height: 48,
    borderRadius: 14,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    background: `${baseColor}1A`,
    color: baseColor,
    border: `1px solid ${baseColor}33`,
  };
});

export const ReminderCardBody = styled.div({
  flex: 1,
  minWidth: 0,
});

export const ReminderCardTitle = styled.div<{ $done: boolean }>((props) => ({
  fontSize: 16,
  fontWeight: 700,
  color: theme.colors.text.primary,
  textDecoration: props.$done ? 'line-through' : 'none',
  lineHeight: 1.3,
  marginBottom: 4,
}));

export const ReminderCardTime = styled.div<{ $overdue: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  color: props.$overdue ? theme.colors.error : theme.colors.text.secondary,
  fontWeight: 600,
  flexWrap: 'wrap',
  '& .anticon': { fontSize: 12 },
}));

export const ReminderCardApartmentLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px 4px 8px',
  background: theme.colors.bg.surfaceLow,
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color: theme.colors.text.primary,
  textDecoration: 'none',
  transition: 'background 0.15s ease',
  '&:hover': {
    background: theme.colors.primaryFixed,
  },
});

export const ReminderCardAssignee = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: theme.colors.text.secondary,
});

export const ReminderCardActions = styled.div({
  display: 'flex',
  gap: 6,
  flexShrink: 0,
  alignItems: 'center',
});

export const ReminderCardAction = styled.button<{ $tone?: 'done' | 'cancel' | 'delete' }>((props) => {
  const tone = props.$tone;
  const color = tone === 'done'
    ? theme.colors.status.ACTIVE
    : tone === 'cancel' || tone === 'delete'
      ? theme.colors.error
      : theme.colors.text.secondary;
  return {
    appearance: 'none',
    border: `1px solid ${theme.colors.outlineVariant}`,
    background: theme.colors.bg.card,
    color,
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
    '&:hover': {
      background: color,
      color: '#fff',
      borderColor: color,
    },
    '&:focus-visible': {
      outline: `2px solid ${color}`,
      outlineOffset: 2,
    },
  };
});

// ─── Empty / results ──────────────────────────────────────────────────────
export const EmptyResults = styled.div({
  padding: '72px 24px',
  background: theme.colors.bg.card,
  borderRadius: theme.radius.xl,
  border: `1px dashed ${theme.colors.outlineVariant}`,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
});

export const EmptyPanel = styled.div({
  padding: '48px 24px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
});

export const EmptyPanelTitle = styled.h3({
  margin: 0,
  fontFamily: theme.fonts.display,
  fontSize: 22,
  fontWeight: 700,
  color: theme.colors.text.primary,
});

export const EmptyPanelHint = styled.p({
  margin: 0,
  fontSize: 14,
  color: theme.colors.text.secondary,
  maxWidth: 380,
  lineHeight: 1.5,
});

// ─── Mobile shell ─────────────────────────────────────────────────────────
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
  color: '#fff',
  fontSize: 18,
});

export const MobileBrandCaption = styled.div({
  color: theme.colors.text.muted,
  fontWeight: 700,
  fontSize: 10,
  marginTop: 2,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const MobileTopActions = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const MobileAvatar = styled.div({
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: theme.colors.tertiaryContainer,
  color: theme.colors.onPrimaryFixed,
  fontWeight: 800,
  fontSize: 12,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const MobileBody = styled.main({
  padding: '20px 16px 120px',
  background: theme.colors.bg.surface,
  minHeight: 'calc(100vh - 76px)',
});

export const MobileHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 16,
});

export const MobileHeaderText = styled.div({
  flex: 1,
  minWidth: 0,
});

export const MobileHeaderTitle = styled.h1({
  fontFamily: theme.fonts.display,
  fontSize: 26,
  fontWeight: 700,
  margin: 0,
  lineHeight: 1.1,
  letterSpacing: '-0.01em',
  color: theme.colors.text.primary,
});

export const MobileHeaderCount = styled.div({
  fontSize: 12,
  fontWeight: 600,
  color: theme.colors.text.muted,
  marginTop: 4,
});

export const MobileNewButton = styled.button({
  flex: '0 0 auto',
  height: 40,
  paddingInline: 16,
  borderRadius: 12,
  border: 0,
  background: theme.colors.primary,
  color: '#fff',
  fontSize: 14,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
  boxShadow: theme.shadows.soft,
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});

export const MobileFilterRow = styled.div({
  display: 'flex',
  gap: 8,
  marginBottom: 12,
  overflowX: 'auto',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const MobileDateChip = styled.button<{ $active?: boolean; $today?: boolean }>((props) => ({
  appearance: 'none',
  border: 'none',
  flex: '0 0 auto',
  minWidth: 56,
  padding: '10px 12px',
  borderRadius: 14,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  cursor: 'pointer',
  fontFamily: 'inherit',
  background: props.$active
    ? theme.colors.primary
    : props.$today
      ? theme.colors.primaryFixed
      : theme.colors.bg.card,
  color: props.$active ? '#fff' : theme.colors.text.primary,
  boxShadow: props.$active ? 'none' : `0 0 0 1px ${theme.colors.outlineVariant}`,
  transition: 'background 0.15s ease',
}));

export const MobileList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 8,
});

export const MobileReminderCard = styled.article<{ $done?: boolean; $overdue?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: ${theme.colors.bg.card};
  border: 1px solid ${(props) => (props.$overdue ? 'rgba(186, 26, 26, 0.24)' : theme.colors.outlineVariant)};
  border-radius: ${theme.radius.lg};
  opacity: ${(props) => (props.$done ? 0.6 : 1)};
  box-shadow: ${theme.shadows.soft};
  animation: ${fadeInUp} 0.2s ease both;
`;

export const MobileReminderIcon = styled.div<{ $done?: boolean; $overdue?: boolean }>((props) => {
  const baseColor = props.$done
    ? theme.colors.status.ACTIVE
    : props.$overdue
      ? theme.colors.error
      : theme.colors.primary;
  return {
    width: 40,
    height: 40,
    borderRadius: 10,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    background: `${baseColor}1A`,
    color: baseColor,
  };
});

export const MobileReminderBody = styled.div({
  flex: 1,
  minWidth: 0,
});

export const MobileReminderTitle = styled.div<{ $done?: boolean }>((props) => ({
  fontSize: 14,
  fontWeight: 700,
  color: theme.colors.text.primary,
  textDecoration: props.$done ? 'line-through' : 'none',
  lineHeight: 1.3,
}));

export const MobileReminderMeta = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginTop: 4,
  fontSize: 12,
  color: theme.colors.text.secondary,
});

export const MobileReminderActions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flexShrink: 0,
});

export const MobileReminderAction = styled.button<{ $tone?: 'done' | 'cancel' | 'delete' }>((props) => {
  const color = props.$tone === 'done'
    ? theme.colors.status.ACTIVE
    : props.$tone === 'cancel' || props.$tone === 'delete'
      ? theme.colors.error
      : theme.colors.text.secondary;
  return {
    appearance: 'none',
    border: `1px solid ${theme.colors.outlineVariant}`,
    background: theme.colors.bg.card,
    color,
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 13,
    '&:hover': { background: color, color: '#fff' },
  };
});

export const MobileEmptyPanel = styled.div({
  padding: '48px 16px',
  textAlign: 'center',
});
