import styled from 'styled-components';
import { theme } from '../../../../app/styles/theme';

export const aurora = {
  '0%': { opacity: 0.6, transform: 'scale(1) translate(0, 0)' },
  '33%': { opacity: 0.8, transform: 'scale(1.08) translate(3%, -2%)' },
  '66%': { opacity: 0.5, transform: 'scale(0.95) translate(-2%, 3%)' },
  '100%': { opacity: 0.6, transform: 'scale(1) translate(0, 0)' },
};

export const AuroraBgWrapper = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  background: theme.colors.bg.deep,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: [theme.gradients.aurora1, theme.gradients.aurora2, theme.gradients.aurora3].join(', '),
  },
  '&::after': {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  },
});
