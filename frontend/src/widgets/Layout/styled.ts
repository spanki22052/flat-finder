import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { theme } from '../../app/styles/theme';

export const LayoutWrapper = styled.div({
  position: 'relative',
  minHeight: '100vh',
  background: theme.colors.bg.surface,
});

export const MainArea = styled.div<{ $isMobile?: boolean }>((props) => ({
  transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '100vh',
  position: 'relative',
  zIndex: 1,
  marginLeft: props.$isMobile ? 0 : 260,
  [`@media (max-width: ${theme.breakpoints.md})`]: { marginLeft: 0 },
}));

export const TopBar = styled.header({
  position: 'sticky',
  top: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '16px 32px',
  minHeight: 80,
  background: `${theme.colors.bg.surface}cc !important`,
  backdropFilter: 'blur(12px)',
  borderBottom: `2px solid ${theme.colors.secondaryContainer}`,
  '@media (max-width: 1100px)': {
    padding: '14px 20px',
    minHeight: 72,
  },
  '@media (max-width: 720px)': {
    padding: '12px 16px',
    gap: 8,
  },
});

export const TopBarLead = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  minWidth: 0,
});

export const TopBarTitle = styled.h2({
  fontFamily: theme.fonts.sans,
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.colors.primary,
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: 0,
  '@media (max-width: 1100px)': { fontSize: 20 },
  '@media (max-width: 720px)': { fontSize: 18 },
});

export const TopBarActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
});

export const TopBarSearch = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0 16px',
  height: 44,
  background: theme.colors.bg.surfaceLow,
  border: `2px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.pill,
  minWidth: 260,
  transition: theme.transition,
  '.anticon': { color: theme.colors.text.muted, fontSize: 18 },
  'input': {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: theme.fonts.sans,
    fontSize: 14,
    color: theme.colors.text.primary,
    '&::placeholder': { color: theme.colors.text.muted },
  },
  '&:focus-within': {
    borderColor: theme.colors.primary,
    boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
  },
  '@media (max-width: 1180px)': { display: 'none' },
});

export const TopBarIconBtn = styled.button({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: theme.radius.pill,
  background: 'transparent',
  color: theme.colors.text.secondary,
  fontSize: 20,
  transition: theme.transition,
  border: `2px solid transparent`,
  cursor: 'pointer',
  '&:hover': {
    background: theme.colors.primaryFixed,
    color: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  '&:active': { transform: 'scale(0.96)' },
});

export const TopBarBadgeWrap = styled.span<{ $count: number }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  lineHeight: 1,
  // Push the AntD badge ribbon into the bell's top-right corner.
  '.ant-badge': { lineHeight: 0 },
  '.ant-badge-count, .ant-badge-dot': {
    boxShadow: `0 0 0 2px ${theme.colors.bg.surface}`,
    fontFamily: theme.fonts.sans,
    fontWeight: 700,
  },
  // Empty-state dot stays warm + on-brand.
  ...(props.$count === 0 && {
    '.ant-badge': { transform: 'translate(0,0)' },
  }),
}));

export const RoomSwitcher = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  maxWidth: 220,
  height: 44,
  padding: '0 14px 0 12px',
  borderRadius: theme.radius.pill,
  background: theme.colors.bg.surfaceLow,
  border: `2px solid ${theme.colors.outlineVariant}`,
  color: theme.colors.text.primary,
  fontFamily: theme.fonts.sans,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: theme.transition,
  '.anticon': { fontSize: 18, color: theme.colors.primary, flexShrink: 0 },
  '.room-switcher-name': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  '.room-switcher-swap': {
    fontSize: 14,
    color: theme.colors.text.muted,
    flexShrink: 0,
    transition: theme.transition,
  },
  '&:hover': {
    background: theme.colors.primaryFixed,
    borderColor: theme.colors.primary,
    color: theme.colors.onPrimaryFixedVariant,
    '.room-switcher-swap': { color: theme.colors.primary, transform: 'translateX(2px)' },
  },
  '&:active': { transform: 'scale(0.98)' },
  '@media (max-width: 1180px)': {
    maxWidth: 44,
    padding: '0 12px',
    '.room-switcher-name, .room-switcher-swap': { display: 'none' },
  },
});

export const Fab = styled.button({
  position: 'fixed',
  right: 32,
  bottom: 32,
  zIndex: 90,
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: theme.gradients.primaryHero,
  color: theme.colors.text.onPrimary,
  fontSize: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  boxShadow: theme.shadows.primary,
  transition: theme.transition,
  '&:hover': {
    transform: 'scale(1.08) rotate(90deg)',
    boxShadow: '0 12px 28px rgba(150, 67, 37, 0.45)',
  },
  '&:active': { transform: 'scale(0.94)' },
  '@media (max-width: 768px)': { display: 'none' },
});

export const MobileMenuBtn = styled.button({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: theme.radius.md,
  color: theme.colors.text.secondary,
  fontSize: 20,
  transition: theme.transition,
  border: `2px solid transparent`,
  '&:hover': {
    background: theme.colors.primaryFixed,
    color: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  [`@media (max-width: ${theme.breakpoints.md})`]: { display: 'flex' },
});

export const PageContent = styled.main({
  padding: 40,
  maxWidth: 1400,
  margin: '0 auto',
  width: '100%',
  minWidth: 0,
  [`@media (max-width: ${theme.breakpoints.sm})`]: { padding: 16 },
  [`@media (max-width: ${theme.breakpoints.md})`]: {
    paddingBottom: 96,
    overflowX: 'hidden',
  },
});

export const BottomBar = styled.nav({
  display: 'none',
  [`@media (max-width: ${theme.breakpoints.md})`]: {
    display: 'flex',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    height: 72,
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    background: theme.colors.bg.card,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: `2px solid ${theme.colors.secondaryContainer}`,
    boxShadow: '0 -8px 24px rgba(150, 67, 37, 0.06)',
  },
});

export const BottomItem = styled(NavLink)<{ $accent?: boolean }>((props) => ({
  flex: 1,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  padding: '8px 4px',
  textDecoration: 'none',
  color: props.$accent ? theme.colors.primary : theme.colors.text.muted,
  transition: theme.transition,
  '& .bottom-icon': {
    fontSize: props.$accent ? 28 : 22,
    lineHeight: 1,
    transition: theme.transition,
    width: props.$accent ? 56 : 'auto',
    height: props.$accent ? 56 : 'auto',
    borderRadius: '50%',
    background: props.$accent ? theme.gradients.primaryHero : 'transparent',
    color: props.$accent ? theme.colors.text.onPrimary : 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: props.$accent ? theme.shadows.primary : 'none',
    marginTop: props.$accent ? -16 : 0,
  },
  '&:hover': { color: theme.colors.primary },
  '&.active': {
    color: theme.colors.primary,
    '& .bottom-icon': {
      transform: 'translateY(-2px)',
      filter: props.$accent ? 'none' : 'drop-shadow(0 0 6px rgba(150, 67, 37, 0.45))',
    },
  },
}));

export const BottomIconWrap = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  position: 'relative',
  '.ant-badge-count': {
    boxShadow: `0 0 0 2px ${theme.colors.bg.card}`,
    fontFamily: theme.fonts.sans,
    fontWeight: 700,
  },
});

export const BottomLabel = styled.span({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
});

export const MobileRoomBar = styled.div({
  display: 'none',
  position: 'sticky',
  top: 0,
  zIndex: 40,
  padding: '10px 16px',
  background: `${theme.colors.bg.surface}cc`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  gap: 10,
  alignItems: 'center',
  [`@media (max-width: ${theme.breakpoints.md})`]: { display: 'flex' },
  '> :first-child': { flex: '1 1 auto', minWidth: 0 },
});

export const MobileRoomBtn = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  padding: '10px 14px',
  borderRadius: theme.radius.pill,
  border: `2px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.surfaceLow,
  color: theme.colors.text.primary,
  fontFamily: theme.fonts.sans,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: theme.transition,
  '.anticon': { fontSize: 18, color: theme.colors.primary, flexShrink: 0 },
  '.label': {
    flex: '1 1 auto',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
  },
  '.chev': { fontSize: 14, color: theme.colors.text.muted, flexShrink: 0 },
  '&:hover, &:focus-visible': {
    borderColor: theme.colors.primary,
    background: theme.colors.primaryFixed,
    color: theme.colors.onPrimaryFixedVariant,
    outline: 'none',
    '.chev': { color: theme.colors.primary },
  },
  '&:active': { transform: 'scale(0.99)' },
});

export const MobileBellBtn = styled.button({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
  width: 44,
  height: 44,
  borderRadius: theme.radius.pill,
  background: theme.colors.bg.surfaceLow,
  border: `2px solid ${theme.colors.outlineVariant}`,
  color: theme.colors.primary,
  fontSize: 20,
  cursor: 'pointer',
  transition: theme.transition,
  '&:hover, &:focus-visible': {
    borderColor: theme.colors.primary,
    background: theme.colors.primaryFixed,
    outline: 'none',
  },
  '&:active': { transform: 'scale(0.96)' },
});

export const MobileBellBadgeWrap = styled.span<{ $count: number }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  lineHeight: 1,
  '.ant-badge': { lineHeight: 0 },
  '.ant-badge-count, .ant-badge-dot': {
    boxShadow: `0 0 0 2px ${theme.colors.bg.surface}`,
    fontFamily: theme.fonts.sans,
    fontWeight: 700,
  },
  ...(props.$count === 0 && {
    '.ant-badge': { transform: 'translate(0,0)' },
  }),
}));