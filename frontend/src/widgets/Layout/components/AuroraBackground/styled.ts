import styled from 'styled-components';
import { theme } from '../../../../app/styles/theme';

export const AuroraBgWrapper = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  background: theme.colors.bg.surface,
  '&::before': {
    content: "''",
    position: 'absolute',
    inset: 0,
    background: [
      'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(255, 219, 207, 0.55), transparent)',
      'radial-gradient(ellipse 60% 50% at 85% 20%, rgba(255, 221, 185, 0.45), transparent)',
      'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(232, 223, 204, 0.35), transparent)',
    ].join(', '),
  },
});