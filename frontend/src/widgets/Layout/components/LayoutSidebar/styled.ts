import styled from 'styled-components';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { theme } from '../../../../app/styles/theme';

export const SidebarWrap = styled(motion.aside)<{ $collapsed: boolean }>((props) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: props.$collapsed ? 72 : 240,
  background: theme.colors.bg.card,
  backdropFilter: 'blur(20px)',
  borderRight: `1px solid ${theme.colors.bg.glassBorder}`,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  [`@media (max-width: ${theme.breakpoints.md})`]: {
    transform: `translateX(${props.$collapsed ? '-100%' : '0'})`,
    width: 260,
  },
}));

export const LogoArea = styled.div({
  padding: '24px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
  minHeight: 72,
});

export const LogoIcon = styled.div({
  width: 36,
  height: 36,
  borderRadius: 10,
  background: theme.gradients.accent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 18,
  color: theme.colors.text.primary,
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(159, 161, 255, 0.4)',
});

export const LogoText = styled(motion.span)({
  fontWeight: 700,
  fontSize: 17,
  color: theme.colors.text.inverse,
  whiteSpace: 'nowrap',
  background: theme.gradients.accent,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

export const NavList = styled.nav({
  flex: 1,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const StyledNavLink = styled(NavLink)<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: props.$collapsed ? 12 : '10px 14px',
  borderRadius: theme.radius.md,
  color: theme.colors.text.secondary,
  fontSize: 14,
  fontWeight: 500,
  transition: theme.transition,
  position: 'relative',
  justifyContent: props.$collapsed ? 'center' : 'flex-start',
  '.anticon': { fontSize: 18, flexShrink: 0 },
  '&:hover': {
    background: theme.colors.bg.glass,
    color: theme.colors.text.primary,
  },
  '&.active': {
    background: 'rgba(159, 161, 255, 0.12)',
    color: theme.colors.accent.primaryLight,
    '&::before': {
      content: "''",
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3,
      height: 24,
      background: theme.gradients.accent,
      borderRadius: '0 2px 2px 0',
    },
  },
}));

export const NavLabel = styled(motion.span)({
  whiteSpace: 'nowrap',
});

export const BottomSection = styled.div({
  padding: 12,
  borderTop: `1px solid ${theme.colors.bg.glassBorder}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const UserInfo = styled.div<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: props.$collapsed ? 8 : '10px 14px',
  borderRadius: theme.radius.md,
  justifyContent: props.$collapsed ? 'center' : 'flex-start',
}));

export const Avatar = styled.div({
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: theme.gradients.accent,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 13,
  color: 'white',
  flexShrink: 0,
});

export const UserName = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

export const UserNameText = styled.span({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.inverse,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const UserRole = styled.span({
  fontSize: 11,
  color: theme.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const LogoutBtn = styled.button<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  padding: props.$collapsed ? 10 : '10px 14px',
  borderRadius: theme.radius.md,
  color: theme.colors.text.muted,
  fontSize: 14,
  fontWeight: 500,
  transition: theme.transition,
  justifyContent: props.$collapsed ? 'center' : 'flex-start',
  '.anticon': { fontSize: 18 },
  '&:hover': {
    background: 'rgba(159, 161, 255, 0.08)',
    color: theme.colors.accent.secondary,
  },
}));

export const CollapseBtn = styled.button<{ $collapsed: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: props.$collapsed ? 'center' : 'flex-end',
  width: '100%',
  padding: '10px 14px',
  borderRadius: theme.radius.md,
  color: theme.colors.text.muted,
  fontSize: 14,
  transition: theme.transition,
  '.anticon': { fontSize: 16 },
  '&:hover': {
    background: theme.colors.bg.glass,
    color: theme.colors.text.secondary,
  },
  [`@media (min-width: ${theme.breakpoints.md})`]: { display: 'none' },
}));

export const Backdrop = styled(motion.div)({
  display: 'none',
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  zIndex: 99,
  [`@media (max-width: ${theme.breakpoints.md})`]: { display: 'block' },
});
