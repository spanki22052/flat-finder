import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { theme } from '../../../../app/styles/theme';

export const SidebarWrap = styled(motion.aside)<{ $collapsed: boolean }>((props) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: props.$collapsed ? 80 : 260,
  background: theme.colors.bg.card,
  borderRight: `1px solid ${theme.colors.outlineVariant}`,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  boxShadow: theme.shadows.sidebar,
  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  [`@media (max-width: ${theme.breakpoints.md})`]: {
    transform: `translateX(${props.$collapsed ? '-100%' : '0'})`,
    width: 280,
  },
}));

export const LogoArea = styled.div({
  padding: '28px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  minHeight: 88,
});

export const LogoIcon = styled.div({
  width: 44,
  height: 44,
  borderRadius: theme.radius.md,
  background: theme.gradients.primaryHero,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 18,
  color: theme.colors.text.onPrimary,
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(150, 67, 37, 0.3)',
  letterSpacing: '-0.02em',
});

export const LogoText = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export const LogoTitle = styled.span({
  fontWeight: 700,
  fontSize: 18,
  color: theme.colors.primary,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
});

export const LogoSubtitle = styled.span({
  fontSize: 11,
  fontWeight: 500,
  color: theme.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
});

export const NavList = styled.nav({
  flex: 1,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const StyledNavLink = styled(NavLink)<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: props.$collapsed ? '14px' : '12px 16px',
  borderRadius: theme.radius.md,
  color: theme.colors.text.secondary,
  fontSize: 15,
  fontWeight: 500,
  transition: theme.transition,
  position: 'relative',
  justifyContent: props.$collapsed ? 'center' : 'flex-start',
  textDecoration: 'none',
  '.anticon': { fontSize: 20, flexShrink: 0 },
  '&:hover': {
    background: theme.colors.bg.surfaceLow,
    color: theme.colors.primary,
  },
  '&.active': {
    background: theme.colors.primaryFixed,
    color: theme.colors.onPrimaryFixedVariant,
    fontWeight: 700,
    borderRight: `4px solid ${theme.colors.primary}`,
    '&::before': {
      content: "''",
      position: 'absolute',
      right: -4,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 4,
      height: 24,
      background: theme.colors.primary,
      borderRadius: '2px 0 0 2px',
    },
  },
  [`@media (max-width: ${theme.breakpoints.md})`]: {
    justifyContent: 'flex-start',
  },
}));

export const NavLabel = styled(motion.span)({
  whiteSpace: 'nowrap',
});

export const SidebarBadge = styled.span({
  marginLeft: 'auto',
  minWidth: 20,
  height: 20,
  padding: '0 6px',
  borderRadius: 10,
  background: theme.colors.error,
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  lineHeight: '20px',
  textAlign: 'center',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(150, 67, 37, 0.25)',
});

export const SidebarBadgeDot = styled.span({
  position: 'absolute',
  top: 6,
  right: 6,
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: theme.colors.error,
  border: `2px solid ${theme.colors.bg.card}`,
});

export const BottomSection = styled.div({
  padding: 16,
  borderTop: `1px solid ${theme.colors.outlineVariant}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const InviteButton = styled.button<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: props.$collapsed ? 'center' : 'center',
  gap: 8,
  width: '100%',
  padding: '14px 16px',
  background: theme.colors.primary,
  color: theme.colors.text.onPrimary,
  borderRadius: theme.radius.md,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '0.02em',
  boxShadow: '0 4px 12px rgba(150, 67, 37, 0.25)',
  transition: theme.transition,
  '.anticon': { fontSize: 18 },
  '&:hover': {
    background: theme.colors.primaryHover,
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(150, 67, 37, 0.35)',
  },
  '&:active': { transform: 'translateY(0) scale(0.98)' },
}));

export const UserInfo = styled.button<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: props.$collapsed ? 12 : '12px 16px',
  borderRadius: theme.radius.md,
  justifyContent: props.$collapsed ? 'center' : 'flex-start',
  background: theme.colors.bg.surfaceLow,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  transition: theme.transition,
  '&:hover': {
    background: theme.colors.primaryFixed,
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0) scale(0.98)' },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: 2,
  },
}));

export const Avatar = styled.div({
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: theme.gradients.primaryHero,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 16,
  color: theme.colors.text.onPrimary,
  flexShrink: 0,
  boxShadow: '0 2px 8px rgba(150, 67, 37, 0.2)',
});

export const UserName = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  gap: 2,
});

export const UserNameText = styled.span({
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const UserRole = styled.span({
  fontSize: 10,
  color: theme.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 600,
});

export const LogoutBtn = styled.button<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  padding: props.$collapsed ? 12 : '10px 16px',
  borderRadius: theme.radius.md,
  color: theme.colors.text.muted,
  fontSize: 14,
  fontWeight: 500,
  transition: theme.transition,
  justifyContent: props.$collapsed ? 'center' : 'flex-start',
  '.anticon': { fontSize: 18 },
  '&:hover': {
    background: theme.colors.errorContainer,
    color: theme.colors.error,
  },
}));

export const CollapseBtn = styled.button<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: props.$collapsed ? 'center' : 'flex-end',
  width: '100%',
  padding: '8px 12px',
  borderRadius: theme.radius.sm,
  color: theme.colors.text.muted,
  fontSize: 14,
  transition: theme.transition,
  '.anticon': { fontSize: 16 },
  '&:hover': {
    background: theme.colors.bg.surfaceLow,
    color: theme.colors.primary,
  },
  [`@media (min-width: ${theme.breakpoints.md})`]: { display: 'none' },
}));

export const Backdrop = styled(motion.div)({
  display: 'none',
  position: 'fixed',
  inset: 0,
  background: 'rgba(30, 27, 24, 0.35)',
  zIndex: 99,
  [`@media (max-width: ${theme.breakpoints.md})`]: { display: 'block' },
});