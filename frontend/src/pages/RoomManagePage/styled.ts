import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { theme } from '../../app/styles/theme';

export const Page = styled.div({
  minHeight: '100vh',
  padding: '40px 24px 120px',
  position: 'relative',
  background: theme.colors.bg.surface,
  '@media (max-width: 768px)': {
    padding: '20px 16px 120px',
  },
});

export const Wrap = styled.div({
  maxWidth: 720,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

export const TopRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
});

export const BackBtn = styled(Button)({
  fontWeight: 600,
});

export const Heading = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 28,
  fontWeight: 700,
  color: theme.colors.text.primary,
  margin: 0,
  letterSpacing: '-0.01em',
  '@media (max-width: 640px)': { fontSize: 22 },
});

export const Card = styled(motion.section)({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 32,
  boxShadow: theme.shadows.soft,
  '@media (max-width: 640px)': {
    padding: 20,
    borderRadius: theme.radius.lg,
  },
});

export const SectionTitle = styled.h2({
  fontFamily: theme.fonts.sans,
  fontSize: 18,
  fontWeight: 700,
  color: theme.colors.text.primary,
  margin: 0,
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const RenameRow = styled.div({
  display: 'flex',
  gap: 12,
  alignItems: 'stretch',
  flexWrap: 'wrap',
  input: {
    flex: '1 1 240px',
    minWidth: 0,
    height: 44,
    padding: '0 16px',
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.outlineVariant}`,
    background: theme.colors.bg.surfaceLow,
    fontSize: 15,
    color: theme.colors.text.primary,
    fontFamily: theme.fonts.sans,
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
    },
  },
});

export const PrimaryBtn = styled(Button)({
  height: '44px !important',
  borderRadius: `${theme.radius.md} !important`,
  fontWeight: '600 !important',
  padding: '0 20px !important',
  background: `${theme.gradients.primaryHero} !important`,
  border: 'none !important',
  color: `${theme.colors.text.onPrimary} !important`,
  '&:hover': { background: `${theme.colors.primaryHover} !important` },
  '&:disabled': { opacity: 0.5 },
});

export const SecondaryBtn = styled(Button)({
  height: '44px !important',
  borderRadius: `${theme.radius.md} !important`,
  fontWeight: '600 !important',
  padding: '0 20px !important',
});

export const DangerBtn = styled(Button)({
  height: '44px !important',
  borderRadius: `${theme.radius.md} !important`,
  fontWeight: '600 !important',
  padding: '0 20px !important',
});

export const InviteBox = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 16px',
  borderRadius: theme.radius.md,
  background: theme.colors.bg.surfaceLow,
  border: `1px dashed ${theme.colors.outlineVariant}`,
  fontFamily: theme.fonts.mono,
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: theme.colors.text.primary,
  flexWrap: 'wrap',
  '.invite-code': { flex: '1 1 auto', minWidth: 0 },
});

export const MemberList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const MemberItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 14px',
  borderRadius: theme.radius.md,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  flexWrap: 'wrap',
});

export const MemberAvatar = styled.div({
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: theme.gradients.primaryHero,
  color: theme.colors.text.onPrimary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 16,
  flexShrink: 0,
});

export const MemberInfo = styled.div({
  flex: '1 1 auto',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const MemberName = styled.span({
  fontSize: 15,
  fontWeight: 600,
  color: theme.colors.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const MemberEmail = styled.span({
  fontSize: 12,
  color: theme.colors.text.muted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const MemberRoleTag = styled.span<{ $owner?: boolean }>((props) => ({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: theme.radius.pill,
  background: props.$owner ? theme.colors.primaryFixed : theme.colors.secondaryContainer,
  color: props.$owner ? theme.colors.onPrimaryFixedVariant : theme.colors.text.secondary,
  flexShrink: 0,
}));

export const MemberActions = styled.div({
  display: 'flex',
  gap: 8,
  flexShrink: 0,
});