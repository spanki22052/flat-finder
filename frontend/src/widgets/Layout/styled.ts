import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { theme } from '../../app/styles/theme';

export const LayoutWrapper = styled.div({
  position: 'relative',
  minHeight: '100vh',
});

export const MainArea = styled.div<{ $isMobile?: boolean }>((props) => ({
  transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '100vh',
  position: 'relative',
  zIndex: 1,
  marginLeft: props.$isMobile ? 0 : 240,
  [`@media (max-width: ${theme.breakpoints.md})`]: { marginLeft: 0 },
}));

export const TopBar = styled.header({
  position: 'sticky',
  top: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px !important',
  height: 60,
  background: 'rgba(42, 35, 24, 0.85) !important',
  backdropFilter: 'blur(16px)',
  borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
});

export const MobileMenuBtn = styled.button({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: theme.radius.md,
  color: theme.colors.text.secondary,
  fontSize: 18,
  transition: theme.transition,
  '&:hover': {
    background: theme.colors.bg.glass,
    color: theme.colors.text.primary,
  },
  [`@media (max-width: ${theme.breakpoints.md})`]: { display: 'flex' },
});

export const PageContent = styled.main({
  padding: 24,
  maxWidth: 1400,
  margin: '0 auto',
  width: '100%',
  [`@media (max-width: ${theme.breakpoints.sm})`]: { padding: 16 },
  [`@media (max-width: ${theme.breakpoints.md})`]: { paddingBottom: 96 },
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
    height: 64,
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    background: 'rgba(42, 35, 24, 0.92)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderTop: `1px solid ${theme.colors.bg.glassBorder}`,
    boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.35)',
  },
});

export const BottomItem = styled(NavLink)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  padding: '6px 4px',
  textDecoration: 'none',
  color: theme.colors.text.muted,
  transition: theme.transition,
  '& .bottom-icon': {
    fontSize: 20,
    lineHeight: 1,
    transition: theme.transition,
  },
  '&:hover': { color: theme.colors.text.secondary },
  '&.active': {
    color: theme.colors.accent.primary,
    '& .bottom-icon': {
      transform: 'translateY(-2px)',
      filter: `drop-shadow(0 0 6px ${theme.colors.accent.primary}80)`,
    },
  },
});

export const BottomLabel = styled.span({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.01em',
});
