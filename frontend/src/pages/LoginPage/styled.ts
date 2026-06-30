import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Form, Button } from 'antd';
import { theme } from '../../app/styles/theme';

export const bgPulse = {
  '0%': { opacity: 0.4, transform: 'scale(1) translate(0, 0)' },
  '50%': { opacity: 0.7, transform: 'scale(1.05) translate(2%, -1%)' },
  '100%': { opacity: 0.4, transform: 'scale(1) translate(0, 0)' },
};

export const Page = styled.div({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: [
      'radial-gradient(ellipse 70% 60% at 20% 10%, rgba(159, 161, 255, 0.4), transparent)',
      'radial-gradient(ellipse 50% 50% at 80% 80%, rgba(193, 235, 233, 0.25), transparent)',
      'radial-gradient(ellipse 60% 40% at 50% 110%, rgba(217, 249, 223, 0.15), transparent)',
    ].join(', '),
  },
});

export const Card = styled(motion.div)({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 420,
  background: theme.colors.bg.card,
  backdropFilter: 'blur(24px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: 24,
  padding: 40,
  boxShadow: `${theme.shadows.card}, 0 0 60px rgba(159, 161, 255, 0.12)`,
  '@media (max-width: 480px)': {
    padding: '28px 24px',
    borderRadius: 20,
  },
});

export const LogoArea = styled.div({
  textAlign: 'center',
  marginBottom: 32,
});

export const LogoIcon = styled.div({
  width: 56,
  height: 56,
  borderRadius: 16,
  background: theme.gradients.accent,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 24,
  color: theme.colors.text.inverse,
  boxShadow: '0 8px 24px rgba(159, 161, 255, 0.4)',
  marginBottom: 16,
});

export const Title = styled.h1({
  fontSize: 22,
  fontWeight: 700,
  color: theme.colors.text.inverse,
  marginBottom: 4,
});

export const Subtitle = styled.p({
  fontSize: 14,
  color: theme.colors.text.secondary,
});

export const FormStyled = styled(Form)({
  '.ant-form-item': { marginBottom: 20 },
  '.ant-input-affix-wrapper, .ant-input': {
    background: 'rgba(255, 255, 255, 0.04) !important',
    borderColor: `${theme.colors.bg.glassBorder} !important`,
    color: `${theme.colors.text.inverse} !important`,
    borderRadius: 10,
    fontSize: 15,
    '&::placeholder': { color: `${theme.colors.text.muted} !important` },
    '&:hover, &:focus': {
      borderColor: `${theme.colors.accent.primary} !important`,
      boxShadow: '0 0 0 3px rgba(159, 161, 255, 0.18) !important',
    },
  },
});

export const SubmitBtn = styled(Button)({
  width: '100%',
  height: '48px !important',
  borderRadius: '10px !important',
  fontWeight: '600 !important',
  fontSize: '15px !important',
  background: `${theme.gradients.accent} !important`,
  border: 'none !important',
  boxShadow: '0 4px 16px rgba(159, 161, 255, 0.4) !important',
  transition: 'all 0.2s ease !important',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(159, 161, 255, 0.55) !important',
  },
  '&:active': { transform: 'translateY(0)' },
  '&:disabled': { opacity: 0.5, transform: 'none' },
});

export const FooterText = styled.p({
  textAlign: 'center',
  marginTop: 24,
  fontSize: 14,
  color: theme.colors.text.secondary,
  a: {
    color: theme.colors.accent.primary,
    fontWeight: 600,
    transition: theme.transition,
    '&:hover': { color: theme.colors.accent.secondary },
  },
});
