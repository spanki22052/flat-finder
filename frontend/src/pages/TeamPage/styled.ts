import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Modal } from 'antd';
import { theme } from '../../app/styles/theme';

const BP = {
  lg: '@media (max-width: 1024px)',
  md: '@media (max-width: 768px)',
  sm: '@media (max-width: 640px)',
  xs: '@media (max-width: 480px)',
};

export const Page = styled.div({
  position: 'relative',
  minHeight: 'calc(100vh - 80px)',
  padding: '24px 24px 140px',
  minWidth: 0,
  maxWidth: '100%',
  overflowX: 'hidden',
  [BP.md]: { padding: 0, paddingBottom: 96 },
});

export const Shell = styled(motion.div)({
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  minWidth: 0,
  [BP.md]: { display: 'none' },
});

// ─── Hero ───────────────────────────────────────────────────────────────────

export const HeroCard = styled(motion.section)({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(140deg, #1e1b18 0%, #3b2a23 55%, #7a2f12 100%)',
  color: theme.colors.text.onPrimary,
  borderRadius: theme.radius.xl,
  padding: '36px 36px 28px',
  boxShadow: '0 24px 60px rgba(30, 27, 24, 0.32)',
  [BP.lg]: { padding: '30px 28px 24px', borderRadius: theme.radius.lg },
  [BP.md]: { padding: '24px 20px 22px', borderRadius: theme.radius.lg },
  [BP.sm]: { padding: '22px 18px 20px' },
  [BP.xs]: { padding: '20px 14px 18px' },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 88% -10%, rgba(255, 187, 115, 0.28), transparent 55%),' +
      'radial-gradient(circle at 8% 110%, rgba(248, 187, 115, 0.12), transparent 60%)',
    pointerEvents: 'none',
  },
});

export const HeroRow = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 20,
  flexWrap: 'wrap',
  minWidth: 0,
  [BP.md]: { flexDirection: 'column', alignItems: 'stretch' },
});

export const HeroLabel = styled.div({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#f8bb73',
  marginBottom: 6,
});

export const HeroTitle = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 38,
  fontWeight: 800,
  letterSpacing: '-0.025em',
  margin: 0,
  lineHeight: 1.05,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  minWidth: 0,
  [BP.lg]: { fontSize: 32 },
  [BP.md]: { fontSize: 26 },
  [BP.sm]: { fontSize: 22 },
  [BP.xs]: { fontSize: 20 },
});

export const HeroLead = styled.p({
  margin: 0,
  marginTop: 10,
  fontSize: 14,
  opacity: 0.75,
  fontWeight: 500,
  minWidth: 0,
  maxWidth: 460,
  [BP.sm]: { fontSize: 13 },
});

export const HeroActions = styled.div({
  position: 'relative',
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  alignItems: 'center',
  minWidth: 0,
  [BP.md]: {
    width: '100%',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const HeroBtn = styled.button<{ $variant?: 'primary' | 'ghost' }>((props) => ({
  height: 44,
  borderRadius: theme.radius.md,
  border: '1px solid transparent',
  padding: '0 18px',
  fontWeight: 700,
  fontSize: 14,
  fontFamily: theme.fonts.sans,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  transition: theme.transition,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  background: props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.06)' : '#f8bb73',
  color: props.$variant === 'ghost' ? '#fff8f5' : '#1e1b18',
  borderColor: props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
  '&:hover': {
    transform: 'translateY(-1px)',
    background: props.$variant === 'ghost' ? 'rgba(255, 255, 255, 0.12)' : '#ffddb9',
  },
  '&:active': { transform: 'translateY(0)' },
  '&:disabled': { opacity: 0.55, cursor: 'not-allowed' },
  [BP.sm]: { height: 40, padding: '0 14px', fontSize: 13 },
  '.btn-code': {
    fontFamily: theme.fonts.mono,
    letterSpacing: '0.1em',
    fontWeight: 800,
  },
  '.btn-label-sm': {
    '@media (max-width: 480px)': { display: 'none' },
  },
}));

export const HeroMetaRow = styled.div({
  position: 'relative',
  marginTop: 28,
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 12,
  paddingTop: 24,
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  [BP.lg]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', marginTop: 22, paddingTop: 18 },
  [BP.sm]: { marginTop: 18, paddingTop: 16, gap: 8 },
});

export const MetaPill = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '4px 0',
  minWidth: 0,
  '.value': {
    fontFamily: theme.fonts.sans,
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    color: '#fff8f5',
    overflowWrap: 'anywhere',
  },
  '.label': {
    fontSize: 11,
    fontWeight: 700,
    color: '#f8bb73',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  [BP.sm]: {
    '.value': { fontSize: 22 },
  },
});

// ─── Roster card ────────────────────────────────────────────────────────────

export const RosterCard = styled(motion.section)({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 8,
  boxShadow: theme.shadows.soft,
  overflow: 'hidden',
  minWidth: 0,
});

export const RosterToolbar = styled.div({
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '8px 8px 12px',
  minWidth: 0,
  [BP.md]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
});

export const SearchField = styled.label({
  position: 'relative',
  flex: '1 1 280px',
  minWidth: 220,
  display: 'flex',
  alignItems: 'center',
  background: theme.colors.bg.surfaceLow,
  border: `2px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.md,
  height: 44,
  padding: '0 14px',
  transition: theme.transition,
  '&:focus-within': {
    borderColor: theme.colors.primary,
    boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
    background: theme.colors.bg.card,
  },
  '& .icon': {
    color: theme.colors.text.muted,
    fontSize: 16,
    marginRight: 10,
    flexShrink: 0,
  },
  '& input': {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    minWidth: 0,
    fontSize: 14,
    fontFamily: theme.fonts.sans,
    color: theme.colors.text.primary,
    '&::placeholder': { color: theme.colors.text.muted },
  },
  [BP.md]: { flex: '1 1 auto', width: '100%' },
});

export const ChipsRow = styled.div({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  minWidth: 0,
  [BP.md]: {
    width: '100%',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const FilterChip = styled.button<{ $active?: boolean }>((props) => ({
  height: 38,
  padding: '0 16px',
  borderRadius: theme.radius.pill,
  border: `1.5px solid ${props.$active ? theme.colors.primary : theme.colors.outlineVariant}`,
  background: props.$active ? theme.colors.primary : theme.colors.bg.card,
  color: props.$active ? '#fff8f5' : theme.colors.text.secondary,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  transition: theme.transition,
  fontFamily: theme.fonts.sans,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: theme.colors.primary,
    background: props.$active ? theme.colors.primaryHover : theme.colors.bg.surfaceLow,
  },
  [BP.sm]: { height: 36, fontSize: 12, padding: '0 12px' },
}));

// ─── Roster row ─────────────────────────────────────────────────────────────

export const RosterList = styled.ul({
  listStyle: 'none',
  padding: 4,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minWidth: 0,
});

export const RosterRow = styled(motion.li)<{ $owner?: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'stretch',
  flexWrap: 'nowrap',
  gap: 0,
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${props.$owner ? '#f8bb73' : theme.colors.outlineVariant}`,
  overflow: 'hidden',
  minWidth: 0,
  transition: theme.transition,
  '&:hover': {
    background: theme.colors.bg.card,
    borderColor: props.$owner ? '#f8bb73' : theme.colors.primaryFixed,
    boxShadow: theme.shadows.soft,
    transform: 'translateY(-1px)',
  },
  [BP.md]: {
    flexWrap: 'wrap',
  },
}));

export const RosterRail = styled.div<{ $owner?: boolean }>((props) => ({
  position: 'relative',
  padding: '16px 14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
  background: props.$owner
    ? 'linear-gradient(160deg, #f8bb73 0%, #ffddb9 100%)'
    : 'linear-gradient(160deg, #fff8f5 0%, #fbf2ed 100%)',
  borderRight: `1px solid ${props.$owner ? '#f8bb73' : theme.colors.outlineVariant}`,
  flex: '0 0 auto',
  width: 160,
  minWidth: 120,
  '.avatar': {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff8f5',
    fontWeight: 800,
    fontSize: 19,
    letterSpacing: '0.02em',
    boxShadow: '0 6px 18px rgba(30, 27, 24, 0.18)',
    flexShrink: 0,
  },
  [BP.lg]: {
    width: 130,
    minWidth: 110,
    padding: '14px 10px',
    '.avatar': { width: 48, height: 48, fontSize: 16 },
  },
  [BP.md]: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    borderRight: 'none',
    borderBottom: `1px solid ${props.$owner ? '#f8bb73' : theme.colors.outlineVariant}`,
    padding: '12px 14px',
    '.avatar': { width: 40, height: 40, fontSize: 14 },
  },
}));

export const RailName = styled.div({
  fontSize: 12,
  fontWeight: 700,
  color: theme.colors.text.primary,
  textAlign: 'center',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const RailTag = styled.div<{ $owner?: boolean }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '3px 8px',
  borderRadius: theme.radius.pill,
  background: props.$owner ? '#1e1b18' : theme.colors.bg.card,
  color: props.$owner ? '#f8bb73' : theme.colors.text.secondary,
  border: `1px solid ${props.$owner ? '#1e1b18' : theme.colors.outlineVariant}`,
}));

export const RosterBody = styled.div({
  display: 'flex',
  flex: '1 1 auto',
  flexWrap: 'wrap',
  gap: 12,
  padding: '16px 20px',
  alignItems: 'center',
  minWidth: 0,
  [BP.md]: {
    padding: '14px 14px',
    gap: 12,
  },
});

export const Identity = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
  minWidth: 0,
  flex: '1 1 220px',
});

export const NameLine = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
});

export const NameText = styled.span({
  fontSize: 16,
  fontWeight: 700,
  color: theme.colors.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  maxWidth: '100%',
});

export const BadgeRow = styled.div({
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const RoleBadge = styled.span<{ $owner?: boolean }>((props) => ({
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '4px 9px',
  borderRadius: theme.radius.pill,
  background: props.$owner ? '#1e1b18' : theme.colors.secondaryContainer,
  color: props.$owner ? '#f8bb73' : theme.colors.text.secondary,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
}));

export const SelfBadge = styled.span({
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '4px 9px',
  borderRadius: theme.radius.pill,
  background: '#f8bb73',
  color: '#1e1b18',
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
});

export const ContactLine = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  color: theme.colors.text.secondary,
  fontWeight: 500,
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const JoinedLine = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  color: theme.colors.text.muted,
  fontWeight: 500,
  minWidth: 0,
  whiteSpace: 'nowrap',
});

export const Pulse = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: theme.colors.text.muted,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  '&::before': {
    content: '""',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: theme.colors.primary,
    boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.18)',
    animation: 'teamPulse 1.4s ease-in-out infinite',
  },
  '@keyframes teamPulse': {
    '0%, 100%': { opacity: 0.4 },
    '50%': { opacity: 1 },
  },
});

export const ActivityCell = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 88,
  flex: '0 0 auto',
  paddingLeft: 14,
  borderLeft: `1px dashed ${theme.colors.outlineVariant}`,
  [BP.md]: {
    paddingLeft: 10,
    borderLeft: 'none',
    minWidth: 0,
    flex: '1 1 calc((100% - 24px) / 3)',
  },
});

export const ActivityHead = styled.div({
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
});

export const ActivityValue = styled.div({
  fontFamily: theme.fonts.sans,
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  color: theme.colors.text.primary,
  fontVariantNumeric: 'tabular-nums',
});

export const ActivityLabel = styled.div({
  fontSize: 11,
  fontWeight: 500,
  color: theme.colors.text.secondary,
});

export const ActionCell = styled.div({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexShrink: 0,
  minWidth: 0,
  marginLeft: 'auto',
  [BP.md]: {
    marginLeft: 0,
    width: '100%',
    justifyContent: 'flex-end',
    paddingTop: 6,
  },
});

export const IconAction = styled.button<{ $variant?: 'default' | 'primary' }>((props) => ({
  height: 38,
  minWidth: 38,
  padding: '0 14px',
  borderRadius: theme.radius.md,
  border: `1.5px solid ${props.$variant === 'primary' ? theme.colors.primary : theme.colors.outlineVariant}`,
  background: props.$variant === 'primary' ? theme.colors.primary : theme.colors.bg.card,
  color: props.$variant === 'primary' ? '#fff8f5' : theme.colors.text.secondary,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  transition: theme.transition,
  fontFamily: theme.fonts.sans,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  '&:hover': {
    transform: 'translateY(-1px)',
    filter: 'brightness(0.97)',
  },
  '&:disabled': { opacity: 0.55, cursor: 'not-allowed' },
  '& span': {
    '@media (max-width: 1024px)': { display: 'none' },
  },
}));

export const IconActionDanger = styled.button({
  height: 38,
  width: 38,
  borderRadius: theme.radius.md,
  border: '1.5px solid #ffb3ac',
  background: '#ffdad6',
  color: theme.colors.error,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: theme.transition,
  flex: '0 0 auto',
  '&:hover': {
    transform: 'translateY(-1px)',
    filter: 'brightness(0.97)',
  },
});

// ─── Empty / loading / hint ─────────────────────────────────────────────────

export const EmptyState = styled.div({
  padding: '64px 24px',
  textAlign: 'center',
  color: theme.colors.text.muted,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'center',
  '.icon': {
    fontSize: 36,
    color: theme.colors.outline,
    marginBottom: 4,
  },
  '.title': { fontSize: 16, fontWeight: 700, color: theme.colors.text.primary },
  '.hint': { fontSize: 13, color: theme.colors.text.muted },
  [BP.sm]: { padding: '40px 16px' },
});

export const SkeletonRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '14px 16px',
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  marginBottom: 10,
  minWidth: 0,
});

export const OwnerHint = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 18px',
  margin: '4px 8px 12px',
  borderRadius: theme.radius.md,
  background: 'linear-gradient(90deg, rgba(248, 187, 115, 0.18), rgba(255, 221, 185, 0.10))',
  border: '1px dashed #f8bb73',
  color: theme.colors.text.secondary,
  fontSize: 13,
  fontWeight: 500,
  minWidth: 0,
  '.anticon': {
    color: '#7a2f12',
    fontSize: 16,
    flexShrink: 0,
  },
  '> span': { flex: '1 1 auto', minWidth: 0 },
  [BP.sm]: { padding: '10px 14px', fontSize: 12 },
});

// ─── Bottom callout ─────────────────────────────────────────────────────────

export const BottomCallout = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '18px 22px',
  borderRadius: theme.radius.lg,
  background:
    'linear-gradient(135deg, #fff8f5 0%, #fbf2ed 100%)',
  border: `1.5px dashed ${theme.colors.outlineVariant}`,
  flexWrap: 'wrap',
  minWidth: 0,
  '> div': { minWidth: 0, flex: '1 1 auto' },
  '.code': { fontFamily: theme.fonts.mono, fontWeight: 800, letterSpacing: '0.1em', fontSize: 15 },
});

export const CalloutLabel = styled.div({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
  marginBottom: 4,
});

export const CalloutCode = styled.div({
  fontFamily: theme.fonts.mono,
  fontWeight: 800,
  letterSpacing: '0.1em',
  fontSize: 18,
  color: theme.colors.text.primary,
  overflowWrap: 'anywhere',
});

export const CalloutAction = styled.button({
  height: 44,
  padding: '0 22px',
  borderRadius: theme.radius.md,
  background: theme.colors.primary,
  color: '#fff8f5',
  border: 'none',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  transition: theme.transition,
  '&:hover': { background: theme.colors.primaryHover, transform: 'translateY(-1px)' },
});

// ─── Edit modal ─────────────────────────────────────────────────────────────

export const EditModal = styled(Modal)({
  '& .ant-modal-content': {
    background: theme.colors.bg.surface,
    borderRadius: theme.radius.xl,
    border: `1px solid ${theme.colors.outlineVariant}`,
    padding: 0,
    overflow: 'hidden',
  },
  '& .ant-modal-header': {
    background: 'transparent',
    borderBottom: `1px solid ${theme.colors.outlineVariant}`,
    padding: '20px 24px',
    marginBottom: 0,
  },
  '& .ant-modal-title': {
    fontFamily: theme.fonts.sans,
    fontWeight: 800,
    fontSize: 18,
    color: theme.colors.text.primary,
    letterSpacing: '-0.01em',
  },
});

export const EditModalFormShell = styled.div({
  padding: '20px 24px 24px',
});

export const EditRow = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 14,
});

export const EditLabel = styled.label({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
});

export const EditInput = styled.input({
  height: 44,
  padding: '0 14px',
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.card,
  fontSize: 15,
  color: theme.colors.text.primary,
  fontFamily: theme.fonts.sans,
  transition: theme.transition,
  width: '100%',
  outline: 'none',
  '&:focus': {
    borderColor: theme.colors.primary,
    boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
  },
  '&:disabled': { opacity: 0.6 },
});

export const EditModalFooter = styled.div({
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 12,
});

export const EditModalPrimaryBtn = styled.button({
  height: 44,
  padding: '0 22px',
  borderRadius: theme.radius.md,
  background: theme.colors.primary,
  color: '#fff8f5',
  border: 'none',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  transition: theme.transition,
  '&:hover': { background: theme.colors.primaryHover },
});

// ─── Mobile composition ────────────────────────────────────────────────────

export const MobileShell = styled.div({
  display: 'none',
  [BP.md]: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: theme.colors.bg.surface,
  },
});

export const MobileTopBar = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  background: theme.colors.bg.card,
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
});

export const MobileBrand = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
});

export const MobileBrandLogo = styled.div({
  width: 36,
  height: 36,
  borderRadius: 12,
  background: theme.colors.primary,
  color: '#fff8f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  flexShrink: 0,
});

export const MobileBrandText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  minWidth: 0,
  '& > div:first-child': {
    fontSize: 14,
    fontWeight: 800,
    color: theme.colors.text.primary,
    letterSpacing: '-0.01em',
  },
});

export const MobileBrandCaption = styled.div({
  fontSize: 11,
  fontWeight: 600,
  color: theme.colors.text.muted,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 180,
});

export const MobileTopActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const MobileAvatar = styled.div<{ size?: number }>((props) => ({
  width: props.size ?? 36,
  height: props.size ?? 36,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #964325, #7a2f12)',
  color: '#fff8f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 13,
  letterSpacing: '0.02em',
  flexShrink: 0,
}));

export const MobileBody = styled.div({
  padding: '16px 16px 96px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const MobileHeading = styled.h2({
  margin: 0,
  fontFamily: theme.fonts.sans,
  fontSize: 24,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: theme.colors.text.primary,
  display: 'flex',
  alignItems: 'baseline',
  gap: 10,
  flexWrap: 'wrap',
  '& span': {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
});

export const MobileSub = styled.p({
  margin: 0,
  fontSize: 13,
  color: theme.colors.text.secondary,
  fontWeight: 500,
});

export const MobileSearch = styled.input({
  height: 44,
  padding: '0 14px 0 38px',
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.card,
  fontSize: 14,
  fontFamily: theme.fonts.sans,
  color: theme.colors.text.primary,
  width: '100%',
  outline: 'none',
  transition: theme.transition,
  '&:focus': {
    borderColor: theme.colors.primary,
    boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
  },
});

export const MobileSearchWrap = styled.div({
  position: 'relative',
  width: '100%',
  '& .icon': {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.text.muted,
    fontSize: 16,
    pointerEvents: 'none',
  },
});

export const MobileChips = styled.div({
  display: 'flex',
  gap: 6,
  overflowX: 'auto',
  flexWrap: 'nowrap',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  marginLeft: -16,
  marginRight: -16,
  paddingLeft: 16,
  paddingRight: 16,
});

export const MobileChip = styled.button<{ $active?: boolean }>((props) => ({
  height: 36,
  padding: '0 14px',
  borderRadius: theme.radius.pill,
  border: `1.5px solid ${props.$active ? theme.colors.primary : theme.colors.outlineVariant}`,
  background: props.$active ? theme.colors.primary : theme.colors.bg.card,
  color: props.$active ? '#fff8f5' : theme.colors.text.secondary,
  fontWeight: 700,
  fontSize: 12,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  fontFamily: theme.fonts.sans,
  transition: theme.transition,
}));

export const MobileRoster = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginTop: 4,
});

export const MobileRosterCard = styled.div<{ $owner?: boolean }>((props) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '64px minmax(0, 1fr)',
  gridTemplateAreas: '"rail identity" "stats stats" "actions actions"',
  gap: 12,
  padding: '14px 14px 12px',
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.card,
  border: `1.5px solid ${props.$owner ? '#f8bb73' : theme.colors.outlineVariant}`,
  minWidth: 0,
  overflow: 'hidden',
}));

export const MobileRail = styled.div<{ $owner?: boolean }>((props) => ({
  gridArea: 'rail',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: 2,
  '.avatar': {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff8f5',
    fontWeight: 800,
    fontSize: 18,
    boxShadow: `0 4px 14px ${props.$owner ? 'rgba(248, 187, 115, 0.45)' : 'rgba(30, 27, 24, 0.16)'}`,
  },
}));

export const MobileIdentity = styled.div({
  gridArea: 'identity',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
});

export const MobileName = styled.div({
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text.primary,
  letterSpacing: '-0.01em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const MobileBadgeRow = styled.div({
  display: 'flex',
  gap: 4,
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const MobileRole = styled.span<{ $owner?: boolean }>((props) => ({
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '3px 8px',
  borderRadius: theme.radius.pill,
  background: props.$owner ? '#1e1b18' : theme.colors.secondaryContainer,
  color: props.$owner ? '#f8bb73' : theme.colors.text.secondary,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
}));

export const MobileSelfBadge = styled.span({
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '3px 8px',
  borderRadius: theme.radius.pill,
  background: '#f8bb73',
  color: '#1e1b18',
});

export const MobileMetaLine = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 11,
  color: theme.colors.text.muted,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

export const MobileStats = styled.div({
  gridArea: 'stats',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 6,
  paddingTop: 10,
  borderTop: `1px dashed ${theme.colors.outlineVariant}`,
  marginTop: 2,
});

export const MobileStat = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 1,
});

export const MobileStatValue = styled.div({
  fontFamily: theme.fonts.sans,
  fontSize: 17,
  fontWeight: 800,
  letterSpacing: '-0.01em',
  lineHeight: 1.1,
  color: theme.colors.text.primary,
  fontVariantNumeric: 'tabular-nums',
});

export const MobileStatLabel = styled.div({
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
});

export const MobileActions = styled.div({
  gridArea: 'actions',
  display: 'flex',
  gap: 6,
  justifyContent: 'flex-end',
  marginTop: 2,
});

export const MobileActionBtn = styled.button({
  height: 36,
  padding: '0 12px',
  borderRadius: theme.radius.md,
  border: `1.5px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.surfaceLow,
  color: theme.colors.text.secondary,
  fontWeight: 700,
  fontSize: 12,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  fontFamily: theme.fonts.sans,
  transition: theme.transition,
});

export const MobileActionDanger = styled.button({
  height: 36,
  width: 36,
  borderRadius: theme.radius.md,
  border: '1.5px solid #ffb3ac',
  background: '#ffdad6',
  color: theme.colors.error,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
});

export const MobileCallout = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
  borderRadius: theme.radius.lg,
  background: 'linear-gradient(135deg, #fff8f5 0%, #fbf2ed 100%)',
  border: `1.5px dashed ${theme.colors.outlineVariant}`,
  flexWrap: 'wrap',
  '> div': { minWidth: 0, flex: '1 1 auto' },
});

export const MobileCalloutLabel = styled.div({
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
});

export const MobileCalloutCode = styled.div({
  fontFamily: theme.fonts.mono,
  fontWeight: 800,
  letterSpacing: '0.1em',
  fontSize: 16,
  color: theme.colors.text.primary,
  overflowWrap: 'anywhere',
  marginTop: 2,
});

export const MobileCalloutCopy = styled.button({
  height: 40,
  padding: '0 14px',
  borderRadius: theme.radius.md,
  background: theme.colors.primary,
  color: '#fff8f5',
  border: 'none',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  fontFamily: theme.fonts.sans,
});

export const MobileEmpty = styled.div({
  padding: '40px 16px',
  textAlign: 'center',
  color: theme.colors.text.muted,
  fontSize: 14,
  fontWeight: 500,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  border: `1px dashed ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  background: theme.colors.bg.card,
});

export const MobileOwnerHint = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: theme.radius.md,
  background: 'rgba(248, 187, 115, 0.15)',
  border: '1px dashed #f8bb73',
  color: theme.colors.text.secondary,
  fontSize: 12,
  fontWeight: 500,
  flexWrap: 'wrap',
  '.anticon': { color: '#7a2f12', fontSize: 14 },
  '> span': { flex: '1 1 auto', minWidth: 0 },
});