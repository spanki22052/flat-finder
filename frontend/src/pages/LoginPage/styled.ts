import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Form, Button } from 'antd';
import { theme } from '../../app/styles/theme';

export const Page = styled.div({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
  background: theme.colors.bg.surface,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: [
      'radial-gradient(ellipse 70% 60% at 20% 10%, rgba(255, 219, 207, 0.6), transparent)',
      'radial-gradient(ellipse 50% 50% at 80% 80%, rgba(255, 221, 185, 0.5), transparent)',
      'radial-gradient(ellipse 60% 40% at 50% 110%, rgba(232, 223, 204, 0.4), transparent)',
    ].join(', '),
  },
});

export const Card = styled(motion.div)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 440,
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 48,
  boxShadow: theme.shadows.cardHover,
  '@media (max-width: 480px)': {
    padding: '32px 24px',
    borderRadius: theme.radius.lg,
  },
});

export const LogoArea = styled.div({
  textAlign: 'center',
  marginBottom: 32,
});

export const LogoIcon = styled.div({
  width: 64,
  height: 64,
  borderRadius: theme.radius.lg,
  background: theme.gradients.primaryHero,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 26,
  color: theme.colors.text.onPrimary,
  boxShadow: theme.shadows.primary,
  marginBottom: 16,
  letterSpacing: '-0.02em',
});

export const Title = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.colors.text.primary,
  marginBottom: 6,
});

export const Subtitle = styled.p({
  fontSize: 14,
  color: theme.colors.text.secondary,
});

export const FormStyled = styled(Form)({
  '.ant-form-item': { marginBottom: 18 },
  '.ant-input-affix-wrapper, .ant-input': {
    background: theme.colors.bg.surfaceLow,
    borderColor: theme.colors.outlineVariant,
    color: theme.colors.text.primary,
    borderRadius: theme.radius.md,
    fontSize: 15,
    '&::placeholder': { color: theme.colors.text.muted },
    '&:hover, &:focus': {
      borderColor: theme.colors.primary,
      boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
    },
  },
});

export const SubmitBtn = styled(Button)({
  width: '100%',
  height: '48px !important',
  borderRadius: `${theme.radius.md} !important`,
  fontWeight: '700 !important',
  fontSize: '15px !important',
  background: `${theme.gradients.primaryHero} !important`,
  border: 'none !important',
  color: `${theme.colors.text.onPrimary} !important`,
  boxShadow: `${theme.shadows.primary} !important`,
  transition: 'all 0.2s ease !important',
  letterSpacing: '0.02em',
  '&:hover': {
    transform: 'translateY(-1px) !important',
    boxShadow: '0 8px 24px rgba(150, 67, 37, 0.4) !important',
    background: `${theme.colors.primaryHover} !important`,
  },
  '&:active': { transform: 'translateY(0) !important' },
  '&:disabled': { opacity: 0.5, transform: 'none' },
});

export const FooterText = styled.p({
  textAlign: 'center',
  marginTop: 24,
  fontSize: 14,
  color: theme.colors.text.secondary,
  a: {
    color: theme.colors.primary,
    fontWeight: 700,
    transition: theme.transition,
    '&:hover': { color: theme.colors.primaryHover },
  },
});