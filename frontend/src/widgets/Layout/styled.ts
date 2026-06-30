import styled from 'styled-components';
import { theme } from '../../app/styles/theme';

export const LayoutWrapper = styled.div({
  position: 'relative',
  minHeight: '100vh',
});

export const MainArea = styled.div({
  marginLeft: 240,
  transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '100vh',
  position: 'relative',
  zIndex: 1,
  [`@media (max-width: ${theme.breakpoints.md})`]: { marginLeft: 0 },
});

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
});
