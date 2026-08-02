import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Form, Button, Input } from 'antd';
import { theme } from '../../app/styles/theme';

export const Shell = styled.div({
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: 'minmax(360px, 5fr) minmax(420px, 7fr)',
  background: theme.editorial.paper,
  color: theme.editorial.ink,
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 980px)': {
    gridTemplateColumns: '1fr',
  },
});

// ─── Left: editorial manifesto ──────────────────────────────────────────────
export const Manifesto = styled.aside({
  position: 'relative',
  padding: '40px 48px 48px',
  borderRight: `1px solid ${theme.editorial.rule}`,
  background: theme.editorial.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  '@media (max-width: 980px)': {
    borderRight: 'none',
    borderBottom: `1px solid ${theme.editorial.rule}`,
    padding: '28px 24px',
    gap: 20,
  },
});

export const ManifestoHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: theme.editorial.mute,
});

export const Stamp = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  border: `1.5px solid ${theme.editorial.stamp}`,
  color: theme.editorial.stamp,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  transform: 'rotate(-2deg)',
  borderRadius: 4,
  background: theme.editorial.paperSoft,
});

export const HeroBlock = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
});

export const Eyebrow = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 12,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: theme.editorial.mute,
});

export const Headline = styled(motion.h1)({
  fontFamily: theme.fonts.display,
  fontWeight: 500,
  fontSize: 'clamp(44px, 5.2vw, 76px)',
  lineHeight: 0.96,
  letterSpacing: '-0.025em',
  fontVariationSettings: "'SOFT' 50, 'WONK' 1",
  color: theme.editorial.ink,
  margin: 0,
  'span': {
    fontStyle: 'italic',
    fontWeight: 400,
    color: theme.editorial.stamp,
  },
});

export const Lede = styled.p({
  fontFamily: theme.fonts.sans,
  fontSize: 15,
  lineHeight: 1.55,
  maxWidth: 460,
  color: theme.editorial.ink,
  opacity: 0.75,
});

// ─── Index card ─────────────────────────────────────────────────────────────
export const IndexCard = styled.div({
  border: `1px solid ${theme.editorial.rule}`,
  borderRadius: 6,
  padding: 20,
  background: theme.editorial.paperSoft,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

export const IndexHeader = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: theme.editorial.mute,
});

export const IndexList = styled.ul({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const IndexItem = styled.li({
  display: 'grid',
  gridTemplateColumns: '40px 1fr auto',
  alignItems: 'baseline',
  gap: 12,
  paddingBottom: 10,
  borderBottom: `1px dashed ${theme.editorial.rule}`,
  '&:last-child': { borderBottom: 'none', paddingBottom: 0 },
  fontFamily: theme.fonts.sans,
  fontSize: 14,
});

export const IndexNum = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  color: theme.editorial.stamp,
  fontWeight: 600,
});

export const IndexLabel = styled.span({
  color: theme.editorial.ink,
});

export const IndexMeta = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  color: theme.editorial.mute,
  letterSpacing: '0.05em',
});

// ─── Ticker ─────────────────────────────────────────────────────────────────
export const TickerRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: theme.editorial.mute,
});

export const TickerDot = styled.span({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: theme.editorial.green,
  display: 'inline-block',
  boxShadow: `0 0 0 0 ${theme.editorial.green}`,
  animation: 'ff-pulse 2s infinite',
  '@keyframes ff-pulse': {
    '0%': { boxShadow: `0 0 0 0 rgba(31, 61, 43, 0.5)` },
    '70%': { boxShadow: `0 0 0 8px rgba(31, 61, 43, 0)` },
    '100%': { boxShadow: `0 0 0 0 rgba(31, 61, 43, 0)` },
  },
});

// ─── Footer (manifesto column) ──────────────────────────────────────────────
export const ManifestoFooter = styled.footer({
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: 12,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: theme.editorial.mute,
  borderTop: `1px solid ${theme.editorial.rule}`,
  paddingTop: 18,
});

// ─── Right: working column ──────────────────────────────────────────────────
export const Work = styled.section({
  padding: '40px 48px',
  background: theme.editorial.ink,
  color: theme.editorial.paper,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 980px)': {
    padding: '32px 24px',
  },
});

export const WorkTopBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 48,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(244, 239, 230, 0.55)',
});

export const TabSwitch = styled.div({
  display: 'inline-flex',
  gap: 0,
  border: `1px solid rgba(244, 239, 230, 0.2)`,
  borderRadius: 4,
  padding: 3,
});

export const Tab = styled.a<{ $active: boolean }>(({ $active }) => ({
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  padding: '8px 16px',
  border: 'none',
  cursor: 'pointer',
  background: $active ? theme.editorial.paper : 'transparent',
  color: $active ? theme.editorial.ink : 'rgba(244, 239, 230, 0.7)',
  borderRadius: 3,
  transition: 'all 0.2s ease',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
}));

export const FormFrame = styled(motion.div)({
  maxWidth: 460,
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
});

export const FormTitle = styled.h2({
  fontFamily: theme.fonts.display,
  fontWeight: 500,
  fontSize: 'clamp(32px, 3.4vw, 44px)',
  lineHeight: 1.02,
  letterSpacing: '-0.02em',
  color: theme.editorial.paper,
  margin: 0,
  fontVariationSettings: "'SOFT' 60",
  'span': {
    fontStyle: 'italic',
    color: theme.editorial.stamp,
  },
});

export const FormSubtitle = styled.p({
  fontFamily: theme.fonts.sans,
  fontSize: 14,
  lineHeight: 1.55,
  color: 'rgba(244, 239, 230, 0.7)',
  margin: 0,
});

export const FormStyled = styled(Form)<{ $tone?: 'dark' }>({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  '.ant-form-item': { marginBottom: 0 },
  '.ant-form-item-label > label': {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(244, 239, 230, 0.55) !important',
    paddingBottom: 6,
  },
  '.ant-form-item-explain-error': {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: '0.04em',
    color: theme.editorial.stamp,
    marginTop: 6,
  },
});

export const FieldInput = styled(Input)({
  background: 'rgba(244, 239, 230, 0.06) !important',
  border: `1px solid rgba(244, 239, 230, 0.18) !important`,
  color: `${theme.editorial.paper} !important`,
  borderRadius: '4px !important',
  fontSize: '15px !important',
  fontFamily: `${theme.fonts.sans} !important`,
  padding: '12px 14px !important',
  transition: 'all 0.2s ease !important',
  '&::placeholder': {
    color: 'rgba(244, 239, 230, 0.35) !important',
  },
  '&:hover': {
    borderColor: `rgba(244, 239, 230, 0.4) !important`,
    background: 'rgba(244, 239, 230, 0.09) !important',
  },
  '&:focus, &.ant-input-focused': {
    borderColor: `${theme.editorial.stamp} !important`,
    boxShadow: `0 0 0 3px rgba(200, 70, 44, 0.18) !important`,
    background: 'rgba(244, 239, 230, 0.09) !important',
  },
  '.ant-input-prefix': {
    color: 'rgba(244, 239, 230, 0.4)',
    marginRight: 10,
  },
});

export const PasswordFieldInput = styled(Input.Password)({
  background: 'rgba(244, 239, 230, 0.06) !important',
  border: `1px solid rgba(244, 239, 230, 0.18) !important`,
  color: `${theme.editorial.paper} !important`,
  borderRadius: '4px !important',
  fontSize: '15px !important',
  fontFamily: `${theme.fonts.sans} !important`,
  padding: '12px 14px !important',
  transition: 'all 0.2s ease !important',
  '&::placeholder': {
    color: 'rgba(244, 239, 230, 0.35) !important',
  },
  '&:hover': {
    borderColor: `rgba(244, 239, 230, 0.4) !important`,
    background: 'rgba(244, 239, 230, 0.09) !important',
  },
  '&:focus, &.ant-input-affix-wrapper-focused': {
    borderColor: `${theme.editorial.stamp} !important`,
    boxShadow: `0 0 0 3px rgba(200, 70, 44, 0.18) !important`,
    background: 'rgba(244, 239, 230, 0.09) !important',
  },
  '.ant-input-prefix': {
    color: 'rgba(244, 239, 230, 0.4)',
    marginRight: 10,
  },
  '.ant-input': {
    background: 'transparent !important',
    color: `${theme.editorial.paper} !important`,
  },
});

export const SubmitBtn = styled(Button)({
  width: '100%',
  height: '52px !important',
  borderRadius: '4px !important',
  fontFamily: `${theme.fonts.mono} !important`,
  fontWeight: '700 !important',
  fontSize: '12px !important',
  letterSpacing: '0.22em !important',
  textTransform: 'uppercase',
  background: `${theme.editorial.paper} !important`,
  color: `${theme.editorial.ink} !important`,
  border: 'none !important',
  marginTop: 8,
  transition: 'all 0.2s ease !important',
  '&:hover': {
    background: `${theme.editorial.stamp} !important`,
    color: `${theme.editorial.paper} !important`,
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
  '&:disabled': { opacity: 0.4, transform: 'none' },
});

export const SwitchLink = styled.div({
  fontFamily: theme.fonts.sans,
  fontSize: 14,
  color: 'rgba(244, 239, 230, 0.6)',
  textAlign: 'center',
  marginTop: 4,
  'a': {
    color: theme.editorial.paper,
    fontWeight: 600,
    borderBottom: `1px solid ${theme.editorial.stamp}`,
    paddingBottom: 2,
    transition: 'all 0.2s ease',
  },
  'a:hover': {
    color: theme.editorial.stamp,
    borderBottomColor: theme.editorial.paper,
  },
});

export const SavedChip = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: theme.fonts.mono,
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(244, 239, 230, 0.5)',
  'span:first-child': {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: theme.editorial.green,
    display: 'inline-block',
  },
});

export const WorkFooter = styled.footer({
  marginTop: 'auto',
  paddingTop: 32,
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: theme.fonts.mono,
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(244, 239, 230, 0.4)',
});

export const ErrorBanner = styled.div({
  fontFamily: theme.fonts.mono,
  fontSize: 12,
  letterSpacing: '0.04em',
  color: theme.editorial.paper,
  background: theme.editorial.stamp,
  padding: '10px 14px',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  '&::before': {
    content: "'!'",
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: theme.editorial.paper,
    color: theme.editorial.stamp,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0,
  },
});