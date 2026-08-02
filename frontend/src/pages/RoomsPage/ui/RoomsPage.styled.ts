import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Form, Button, Input } from 'antd';
import { theme } from '@/app/styles/theme';

// ─── Shell ──────────────────────────────────────────────────────────────────
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

// ─── Left: dossier index ────────────────────────────────────────────────────
export const Dossier = styled.aside({
  position: 'relative',
  padding: '40px 48px 48px',
  borderRight: `1px solid ${theme.editorial.rule}`,
  background: theme.editorial.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  '@media (max-width: 980px)': {
    borderRight: 'none',
    borderBottom: `1px solid ${theme.editorial.rule}`,
    padding: '28px 24px',
    gap: 20,
  },
});

export const DossierHeader = styled.div({
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

export const DossierStamp = styled.div({
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
  fontSize: 'clamp(44px, 5.4vw, 78px)',
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
  maxWidth: 480,
  color: theme.editorial.ink,
  opacity: 0.75,
  margin: 0,
});

// ─── Rooms ledger ───────────────────────────────────────────────────────────
export const Ledger = styled.div({
  display: 'flex',
  flexDirection: 'column',
  borderTop: `1px solid ${theme.editorial.rule}`,
  marginTop: 4,
});

export const LedgerHeader = styled.div({
  display: 'grid',
  gridTemplateColumns: '52px 1fr auto auto',
  alignItems: 'baseline',
  gap: 12,
  padding: '12px 4px 10px',
  borderBottom: `1px solid ${theme.editorial.rule}`,
  fontFamily: theme.fonts.mono,
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: theme.editorial.mute,
});

export const LedgerList = styled.ul({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const LedgerEmpty = styled.div({
  padding: '36px 4px',
  borderBottom: `1px solid ${theme.editorial.rule}`,
  fontFamily: theme.fonts.sans,
  fontSize: 14,
  color: theme.editorial.ink,
  opacity: 0.65,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  'span': {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: theme.editorial.mute,
  },
});

export const LedgerRow = styled(motion.li)<{ $active?: boolean }>(({ $active }) => ({
  display: 'grid',
  gridTemplateColumns: '52px 1fr auto auto',
  alignItems: 'center',
  gap: 12,
  padding: '16px 4px',
  borderBottom: `1px solid ${theme.editorial.rule}`,
  cursor: 'pointer',
  background: $active ? theme.editorial.paperDeep : 'transparent',
  transition: 'background 0.2s ease',
  '&:hover': { background: theme.editorial.paperDeep },
  '&:focus-visible': {
    outline: `2px solid ${theme.editorial.stamp}`,
    outlineOffset: -2,
  },
}));

export const LedgerNum = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 13,
  color: theme.editorial.stamp,
  fontWeight: 600,
  letterSpacing: '0.04em',
});

export const LedgerName = styled.span({
  fontFamily: theme.fonts.display,
  fontSize: 22,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: theme.editorial.ink,
  fontVariationSettings: "'SOFT' 40",
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const LedgerRole = styled.span<{ $owner?: boolean }>(({ $owner }) => ({
  fontFamily: theme.fonts.mono,
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  padding: '4px 8px',
  borderRadius: 2,
  border: `1px solid ${$owner ? theme.editorial.stamp : theme.editorial.rule}`,
  color: $owner ? theme.editorial.stamp : theme.editorial.mute,
  background: $owner ? theme.editorial.paperSoft : 'transparent',
  fontWeight: 600,
}));

export const LedgerCount = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 12,
  letterSpacing: '0.04em',
  color: theme.editorial.mute,
  fontVariantNumeric: 'tabular-nums',
});

// ─── Ticker / footer (left column) ──────────────────────────────────────────
export const DossierFooter = styled.footer({
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
  padding: '40px 56px',
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
  marginBottom: 36,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(244, 239, 230, 0.55)',
});

export const TabSwitch = styled.div({
  display: 'inline-flex',
  gap: 0,
  border: '1px solid rgba(244, 239, 230, 0.2)',
  borderRadius: 4,
  padding: 3,
});

export const Tab = styled.button<{ $active: boolean }>(({ $active }) => ({
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
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  '&:hover': $active ? {} : { color: theme.editorial.paper },
}));

export const Folio = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  gap: 16,
  marginBottom: 28,
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'rgba(244, 239, 230, 0.5)',
  'span': {
    fontFamily: theme.fonts.display,
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: 56,
    lineHeight: 0.9,
    letterSpacing: '-0.02em',
    color: theme.editorial.stamp,
    fontVariationSettings: "'SOFT' 80",
  },
});

export const FormFrame = styled(motion.div)({
  maxWidth: 480,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
});

export const FormTitle = styled.h2({
  fontFamily: theme.fonts.display,
  fontWeight: 500,
  fontSize: 'clamp(28px, 2.8vw, 38px)',
  lineHeight: 1.04,
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
  'em': {
    fontStyle: 'italic',
    color: theme.editorial.paper,
    fontFamily: theme.fonts.display,
  },
});

export const FormStyled = styled(Form)({
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
  border: '1px solid rgba(244, 239, 230, 0.18) !important',
  color: `${theme.editorial.paper} !important`,
  borderRadius: '4px !important',
  fontSize: '15px !important',
  fontFamily: `${theme.fonts.sans} !important`,
  padding: '12px 14px !important',
  letterSpacing: '0.18em',
  transition: 'all 0.2s ease !important',
  '&::placeholder': {
    color: 'rgba(244, 239, 230, 0.35) !important',
    letterSpacing: '0.04em',
  },
  '&:hover': {
    borderColor: 'rgba(244, 239, 230, 0.4) !important',
    background: 'rgba(244, 239, 230, 0.09) !important',
  },
  '&:focus, &.ant-input-focused': {
    borderColor: `${theme.editorial.stamp} !important`,
    boxShadow: '0 0 0 3px rgba(200, 70, 44, 0.18) !important',
    background: 'rgba(244, 239, 230, 0.09) !important',
  },
});

export const HelperText = styled.p({
  fontFamily: theme.fonts.mono,
  fontSize: 11,
  letterSpacing: '0.06em',
  color: 'rgba(244, 239, 230, 0.45)',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const GreenDot = styled.span({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: theme.editorial.green,
  display: 'inline-block',
  flexShrink: 0,
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

export const SignOutBtn = styled(Button)({
  fontFamily: `${theme.fonts.mono} !important`,
  fontSize: '11px !important',
  letterSpacing: '0.18em !important',
  textTransform: 'uppercase',
  color: 'rgba(244, 239, 230, 0.55) !important',
  padding: '0 !important',
  height: 'auto !important',
  borderBottom: '1px solid rgba(244, 239, 230, 0.2)',
  borderRadius: '0 !important',
  background: 'transparent !important',
  borderTop: 'none !important',
  borderLeft: 'none !important',
  borderRight: 'none !important',
  transition: 'all 0.2s ease !important',
  '&:hover': {
    color: `${theme.editorial.stamp} !important`,
    borderBottomColor: `${theme.editorial.stamp} !important`,
  },
});

export const WorkFooter = styled.footer({
  marginTop: 'auto',
  paddingTop: 32,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: 12,
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

// ─── Quick action chips (work column) ───────────────────────────────────────
export const QuickRow = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 4,
});

export const QuickChip = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  padding: '6px 10px',
  borderRadius: 2,
  border: '1px solid rgba(244, 239, 230, 0.2)',
  color: 'rgba(244, 239, 230, 0.6)',
  background: 'rgba(244, 239, 230, 0.04)',
});
