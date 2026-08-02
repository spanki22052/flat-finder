import styled from 'styled-components';
import { Button } from 'antd';
import { theme } from '../../app/styles/theme';

export const Page = styled.div({
  minHeight: '100vh',
  padding: '40px 24px 120px',
  position: 'relative',
  background: theme.colors.bg.surface,
  '@media (max-width: 768px)': {
    padding: '24px 16px 100px',
  },
});

export const Wrap = styled.div({
  maxWidth: 640,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

export const Heading = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 26,
  fontWeight: 700,
  color: theme.colors.text.primary,
  margin: 0,
  letterSpacing: '-0.01em',
});

export const Subheading = styled.p({
  fontSize: 14,
  color: theme.colors.text.secondary,
  margin: 0,
  lineHeight: 1.5,
});

export const Card = styled.div({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 32,
  boxShadow: theme.shadows.soft,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 16,
  textAlign: 'center',
  '@media (max-width: 640px)': {
    padding: 22,
    borderRadius: theme.radius.lg,
  },
});

export const StatusIcon = styled.div<{ $tone: 'loading' | 'error' | 'success' }>((props) => ({
  width: 56,
  height: 56,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  fontSize: 24,
  background:
    props.$tone === 'error'
      ? theme.colors.errorContainer
      : props.$tone === 'success'
        ? theme.colors.primaryFixed
        : theme.colors.secondaryContainer,
  color:
    props.$tone === 'error'
      ? theme.colors.error
      : props.$tone === 'success'
        ? theme.colors.onPrimaryFixedVariant
        : theme.colors.secondary,
}));

export const StatusTitle = styled.h2({
  fontFamily: theme.fonts.sans,
  fontSize: 18,
  fontWeight: 700,
  color: theme.colors.text.primary,
  margin: 0,
});

export const StatusText = styled.p({
  fontSize: 14,
  color: theme.colors.text.secondary,
  margin: 0,
  lineHeight: 1.6,
  maxWidth: 420,
});

export const SourceBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  padding: '4px 12px',
  borderRadius: theme.radius.pill,
  background: theme.colors.primaryFixed,
  color: theme.colors.onPrimaryFixedVariant,
});

export const ActionRow = styled.div({
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const PrimaryBtn = styled(Button)({
  height: '44px !important',
  borderRadius: `${theme.radius.md} !important`,
  fontWeight: '600 !important',
  padding: '0 22px !important',
  background: `${theme.gradients.primaryHero} !important`,
  border: 'none !important',
  color: `${theme.colors.text.onPrimary} !important`,
});

export const SecondaryBtn = styled(Button)({
  height: '44px !important',
  borderRadius: `${theme.radius.md} !important`,
  fontWeight: '600 !important',
  padding: '0 22px !important',
});
