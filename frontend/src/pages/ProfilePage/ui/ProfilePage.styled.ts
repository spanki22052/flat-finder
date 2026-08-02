import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '@/app/styles/theme';

// Shared ink + sage accent from the teammate view, mirrored in subtle
// accents on the self view for cross-page consistency.
const INK = '#1e1b18';
const SAGE = '#5e7a55';

const BP = {
  sm: '@media (max-width: 640px)',
  md: '@media (max-width: 768px)',
  lg: '@media (max-width: 1024px)',
};

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginBottom: 24,
  flexWrap: 'wrap',
  gap: 16,
});

export const PageTitle = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: theme.colors.text.primary,
  margin: 0,
  [BP.md]: { fontSize: 26 },
  [BP.sm]: { fontSize: 22 },
});

export const PageEyebrow = styled.div({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
  marginBottom: 6,
});

export const PageLead = styled.div({
  marginTop: 4,
  fontSize: 13,
  fontWeight: 500,
  color: theme.colors.text.secondary,
  maxWidth: 560,
});

export const Actions = styled.div({
  display: 'flex',
  gap: 10,
  '@media (max-width: 640px)': {
    width: '100%',
    overflowX: 'auto',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    '& > .ant-btn': {
      flex: '0 0 auto',
      whiteSpace: 'nowrap',
    },
  },
});

export const Card = styled.div({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: '32px 32px',
  boxShadow: theme.shadows.card,
  color: theme.colors.text.primary,
  [BP.sm]: { padding: '22px 18px' },
});

// ─── Self view — new hero (warm amber, mirror of TeamPage direction) ────────

export const SelfShell = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  '@media (max-width: 640px)': { display: 'none' },
});

export const SelfHero = styled.section({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(140deg, #1e1b18 0%, #3b2a23 55%, #7a2f12 100%)',
  color: theme.colors.text.onPrimary,
  borderRadius: theme.radius.xl,
  padding: '40px 40px 32px',
  boxShadow: '0 24px 60px rgba(30, 27, 24, 0.32)',
  [BP.lg]: { padding: '34px 30px 28px', borderRadius: theme.radius.lg },
  [BP.md]: { padding: '24px 22px 22px' },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 88% -10%, rgba(255, 187, 115, 0.28), transparent 55%),' +
      'radial-gradient(circle at 8% 110%, rgba(248, 187, 115, 0.12), transparent 60%)',
    pointerEvents: 'none',
  },
});

export const SelfHeroRow = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 16,
  minWidth: 0,
});

export const SelfHeroLeft = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 22,
  minWidth: 0,
  [BP.lg]: { gap: 16 },
});

export const SelfAvatarTile = styled.div<{ $tone?: number }>((props) => {
  const tones = [
    { from: '#b55b3b', to: '#7a2f12' },
    { from: '#9b6a2b', to: '#5c3a14' },
    { from: '#4f7a52', to: '#2c4630' },
    { from: '#3d6b8a', to: '#1f3f55' },
  ];
  const t = tones[props.$tone ?? 0];
  return {
    width: 84,
    height: 84,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
    color: '#fff8f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: theme.fonts.sans,
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    boxShadow: '0 12px 32px rgba(30, 27, 24, 0.4)',
    border: '2px solid rgba(255, 248, 245, 0.25)',
    flexShrink: 0,
    [BP.md]: { width: 72, height: 72, fontSize: 26 },
  };
});

export const SelfIdentity = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const SelfLabel = styled.div({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#f8bb73',
});

export const SelfName = styled.h1({
  margin: 0,
  fontFamily: theme.fonts.sans,
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  color: '#fff8f5',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  [BP.lg]: { fontSize: 24 },
  [BP.md]: { fontSize: 22 },
  [BP.sm]: { fontSize: 20 },
});

export const SelfHandle = styled.div({
  fontFamily: theme.fonts.mono,
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(255, 248, 245, 0.7)',
  letterSpacing: '0.02em',
});

export const SelfHeroActions = styled.div({
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  flexShrink: 0,
  position: 'relative',
  [BP.md]: { justifyContent: 'flex-start' },
});

export const SelfMetaRow = styled.div({
  position: 'relative',
  marginTop: 30,
  paddingTop: 26,
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 12,
  [BP.lg]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    marginTop: 24,
    paddingTop: 22,
  },
  [BP.sm]: { gap: 10, marginTop: 18, paddingTop: 16 },
});

export const SelfMetaPill = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 0,
  padding: '16px 18px',
  borderRadius: theme.radius.md,
  background: 'rgba(255, 248, 245, 0.06)',
  border: '1px solid rgba(255, 248, 245, 0.1)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  '.value': {
    fontFamily: theme.fonts.sans,
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    color: '#fff8f5',
    overflowWrap: 'anywhere',
    fontVariantNumeric: 'tabular-nums',
  },
  '.label': {
    fontSize: 11,
    fontWeight: 700,
    color: '#f8bb73',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  [BP.lg]: {
    padding: '14px 16px',
  },
  [BP.sm]: {
    padding: '12px 14px',
    '.value': { fontSize: 22 },
  },
});

// ─── Self view — account details card ───────────────────────────────────────

export const SelfAccountCard = styled.section({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: 8,
  boxShadow: theme.shadows.soft,
  overflow: 'hidden',
});

export const SelfAccountList = styled.ul({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const SelfAccountRow = styled.li({
  display: 'grid',
  gridTemplateColumns: '180px minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 16,
  padding: '16px 18px',
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  minWidth: 0,
  '&:last-child': { borderBottom: 'none' },
  [BP.md]: {
    gridTemplateColumns: '120px minmax(0, 1fr)',
    gridTemplateAreas: '"label value" "hint hint"',
    rowGap: 4,
  },
});

export const SelfAccountLabel = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
  '.anticon': {
    fontSize: 14,
    color: theme.colors.primary,
  },
  [BP.md]: { gridArea: 'label' },
});

export const SelfAccountValue = styled.div<{ $mono?: boolean }>((props) => ({
  fontFamily: props.$mono ? theme.fonts.mono : theme.fonts.sans,
  fontSize: 15,
  fontWeight: 600,
  color: theme.colors.text.primary,
  minWidth: 0,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  [BP.md]: { gridArea: 'value' },
}));

export const SelfAccountCopy = styled.button({
  border: `1.5px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.surfaceLow,
  color: theme.colors.text.secondary,
  borderRadius: theme.radius.md,
  height: 32,
  padding: '0 12px',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: theme.fonts.sans,
  transition: theme.transition,
  flexShrink: 0,
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  [BP.md]: { display: 'none' },
});

// ─── Self view — danger zone ────────────────────────────────────────────────

export const DangerZone = styled.section({
  marginTop: 4,
  padding: '18px 22px',
  borderRadius: theme.radius.lg,
  background: 'linear-gradient(180deg, #fff8f5 0%, #fbf2ed 100%)',
  border: `1px dashed ${theme.colors.outlineVariant}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
});

export const DangerLabel = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
  '.title': {
    fontSize: 13,
    fontWeight: 700,
    color: theme.colors.text.primary,
  },
  '.hint': {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
});

// ─── Mobile FlatFinder shell ──────────────────────────────────────────────────

export const DesktopOnly = styled.div({
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

export const MobileShell = styled.div({
  display: 'none',
  '@media (max-width: 640px)': {
    display: 'block',
    margin: '-16px -16px 0',
  },
});

export const MobileTopBar = styled.header({
  height: 76,
  padding: '14px 20px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.colors.bg.card,
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
});

export const MobileBrand = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  color: theme.colors.text.primary,
  fontSize: 17,
  fontWeight: 800,
});

export const MobileBrandLogo = styled.span({
  width: 34,
  height: 34,
  borderRadius: 10,
  display: 'grid',
  placeItems: 'center',
  background: theme.colors.primary,
  color: theme.colors.text.onPrimary,
  fontSize: 18,
});

export const MobileBrandCaption = styled.div({
  color: theme.colors.text.muted,
  fontWeight: 600,
  fontSize: 10,
  marginTop: 2,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const MobileBellBtn = styled.button({
  border: 0,
  padding: 0,
  width: 38,
  height: 38,
  background: 'transparent',
  color: theme.colors.text.secondary,
  fontSize: 20,
  cursor: 'pointer',
  borderRadius: '50%',
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 2 },
});

export const MobileBody = styled.main({
  padding: '20px 16px 112px',
  background: theme.colors.bg.surface,
  minHeight: 'calc(100vh - 76px)',
});

export const MobileHeroCard = styled.section({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(140deg, #1e1b18 0%, #3b2a23 55%, #7a2f12 100%)',
  color: '#fff',
  borderRadius: theme.radius.xl,
  padding: '20px 20px 16px',
  textAlign: 'center',
  boxShadow: '0 16px 32px rgba(30, 27, 24, 0.28)',
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 90% -10%, rgba(255, 187, 115, 0.32), transparent 55%),' +
      'radial-gradient(circle at 5% 110%, rgba(248, 187, 115, 0.14), transparent 60%)',
    pointerEvents: 'none',
  },
});

export const MobileHeroAvatarWrap = styled.div({
  position: 'relative',
  marginBottom: 10,
  width: 64,
  height: 64,
  flexShrink: 0,
  '& .ant-avatar': {
    flexShrink: 0,
  },
});

export const MobileHeroName = styled.h2({
  position: 'relative',
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: '-0.01em',
  lineHeight: 1.2,
  color: '#fff8f5',
  wordBreak: 'keep-all',
  overflowWrap: 'normal',
  maxWidth: '100%',
});

export const MobileHeroRole = styled.div({
  position: 'relative',
  marginTop: 4,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#f8bb73',
});

export const MobileStatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 8,
  marginBottom: 16,
  '@media (max-width: 380px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
});

export const MobileStatCard = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  padding: '14px 14px',
  border: `1px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.card,
  borderRadius: theme.radius.lg,
  minWidth: 0,
});

export const MobileStatValue = styled.div({
  fontSize: 22,
  color: theme.colors.text.primary,
  fontWeight: 800,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
});

export const MobileStatLabel = styled.div({
  color: theme.colors.text.muted,
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const MobileSectionTitle = styled.h3({
  color: theme.colors.text.primary,
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  margin: '4px 0 10px',
});

export const MobileAccountCard = styled.section({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  padding: '2px 16px',
  marginBottom: 16,
});

export const MobileAccountRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '13px 0',
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  minWidth: 0,
  '&:last-child': { borderBottom: 0 },
});

export const MobileAccountLabel = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
  color: theme.colors.text.muted,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  '.anticon': {
    fontSize: 14,
    color: theme.colors.primary,
  },
});

export const MobileAccountValue = styled.div<{ $mono?: boolean }>((props) => ({
  minWidth: 0,
  color: theme.colors.text.primary,
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'right',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '60%',
  fontFamily: props.$mono ? theme.fonts.mono : theme.fonts.sans,
}));

export const MobileActionsCol = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const MobileRefreshBtn = styled.button({
  width: '100%',
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.md,
  padding: 14,
  background: theme.colors.bg.card,
  color: theme.colors.text.primary,
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
  '&:disabled': { opacity: 0.6, cursor: 'default' },
});

export const MobileLogoutBtn = styled.button({
  width: '100%',
  border: 0,
  borderRadius: theme.radius.md,
  padding: 14,
  background: theme.colors.error,
  color: '#fff',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  '&:focus-visible': { outline: `2px solid ${theme.colors.error}`, outlineOffset: 3 },
});

// ─── Teammate view ──────────────────────────────────────────────────────────
// Distinct identity card for "someone else's profile". Deliberate visual
// signature: an asymmetric deep-ink tile carrying the monogram, with a sage
// hairline grid behind it. The role mark anchors the bottom-right corner.
// This is NOT another cream-with-rust-gradient hero. Different subject (a
// teammate, not the user) deserves a different visual register.

export const TeammateHero = styled.section({
  position: 'relative',
  overflow: 'hidden',
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  padding: '28px 32px 26px',
  boxShadow: theme.shadows.soft,
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gridTemplateAreas: '"tile identity" "divider divider" "stats stats"',
  columnGap: 28,
  rowGap: 22,
  alignItems: 'center',
  [BP.sm]: {
    padding: '22px 20px 20px',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    columnGap: 18,
    rowGap: 16,
  },
  '@media (max-width: 480px)': {
    gridTemplateAreas: '"tile" "identity" "divider" "stats"',
    gridTemplateColumns: '1fr',
  },
});

export const HeroTile = styled.div({
  gridArea: 'tile',
  position: 'relative',
  width: 140,
  height: 140,
  background: INK,
  borderRadius: 18,
  display: 'grid',
  placeItems: 'center',
  clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
  boxShadow:
    `0 0 0 1px ${SAGE}55, 0 18px 36px rgba(30, 27, 24, 0.18)`,
  [BP.sm]: { width: 104, height: 104, borderRadius: 14 },
  '@media (max-width: 380px)': { width: 88, height: 88 },
});

export const HeroTopo = styled.div({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0.5,
  backgroundImage:
    'repeating-linear-gradient(115deg, transparent 0 22px, rgba(150, 67, 37, 0.05) 22px 23px),' +
    'repeating-linear-gradient(25deg, transparent 0 34px, rgba(150, 67, 37, 0.04) 34px 35px)',
  maskImage: 'linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)',
});

export const HeroMonogram = styled.span({
  color: '#fff',
  fontFamily: theme.fonts.sans,
  fontSize: 60,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  userSelect: 'none',
  transform: 'translate(-2px, -2px)',
  [BP.sm]: { fontSize: 44 },
  '@media (max-width: 380px)': { fontSize: 36 },
});

export const HeroRoleMark = styled.span<{ $owner?: boolean }>((props) => ({
  position: 'absolute',
  right: -10,
  bottom: -10,
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: props.$owner ? theme.colors.primary : SAGE,
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontSize: 18,
  boxShadow: '0 6px 14px rgba(30, 27, 24, 0.25)',
  border: '2px solid #fff',
  [BP.sm]: { width: 36, height: 36, fontSize: 15, right: -8, bottom: -8 },
}));

export const HeroHeaderRow = styled.div({
  gridArea: 'identity',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const HeroIdentity = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const HeroName = styled.h1({
  margin: 0,
  fontFamily: theme.fonts.sans,
  fontSize: 26,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: theme.colors.text.primary,
  lineHeight: 1.1,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  [BP.lg]: { fontSize: 24 },
  [BP.md]: { fontSize: 22 },
  [BP.sm]: { fontSize: 20 },
});

export const HeroHandle = styled.span({
  fontFamily: theme.fonts.mono,
  fontSize: 14,
  fontWeight: 500,
  color: theme.colors.text.muted,
  letterSpacing: '0.02em',
  [BP.sm]: { fontSize: 13 },
});

export const HeroTagRow = styled.div({
  marginTop: 8,
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
});

export const HeroTag = styled.span<{ $accent?: boolean }>((props) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 28,
  padding: '0 12px',
  borderRadius: theme.radius.pill,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.01em',
  background: props.$accent ? theme.colors.primaryFixed : theme.colors.bg.surfaceLow,
  color: props.$accent ? theme.colors.onPrimaryFixedVariant : theme.colors.text.secondary,
  border: `1px solid ${props.$accent ? theme.colors.primaryFixedDim : theme.colors.outlineVariant}`,
  whiteSpace: 'nowrap',
  '.anticon': { fontSize: 12 },
}));

export const HeroBackBtn = styled.button({
  padding: 0,
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: theme.colors.bg.surfaceLow,
  color: theme.colors.text.secondary,
  fontSize: 16,
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  border: `1px solid ${theme.colors.outlineVariant}`,
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 2 },
});

export const BackLinkBtn = styled.button({
  height: 40,
  padding: '0 16px',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.card,
  color: theme.colors.text.primary,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: theme.fonts.sans,
  transition: theme.transition,
  '&:hover': { borderColor: theme.colors.primary, color: theme.colors.primary },
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 2 },
});

export const HeroDivider = styled.hr({
  gridArea: 'divider',
  border: 0,
  borderTop: `1px solid ${theme.colors.outlineVariant}`,
  margin: 0,
});

export const HeroStatsRow = styled.div({
  gridArea: 'stats',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 10,
  '@media (max-width: 640px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
});

export const HeroStat = styled.div({
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.md,
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
});

export const HeroStatValue = styled.span({
  fontFamily: theme.fonts.sans,
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: theme.colors.text.primary,
  lineHeight: 1,
});

export const HeroStatLabel = styled.span({
  fontSize: 11,
  fontWeight: 700,
  color: theme.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginTop: 4,
});

export const TeammateMeta = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 14,
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
  },
});

export const MetaBlock = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '14px 16px',
  borderRadius: theme.radius.md,
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  minWidth: 0,
});

export const MetaKey = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.colors.text.muted,
  '.anticon': { fontSize: 12, color: theme.colors.primary },
});

export const MetaValue = styled.span<{ $mono?: boolean }>((props) => ({
  fontSize: 15,
  fontWeight: 600,
  color: theme.colors.text.primary,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  fontFamily: props.$mono ? theme.fonts.mono : theme.fonts.sans,
}));

export const TeammateActions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 18,
  flexWrap: 'wrap',
});

export const TeamEntry = styled.button({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 18,
  width: '100%',
  textAlign: 'left',
  padding: '18px 22px 18px 26px',
  marginTop: 8,
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.xl,
  cursor: 'pointer',
  fontFamily: theme.fonts.sans,
  overflow: 'hidden',
  transition: theme.transition,
  '&:hover': {
    borderColor: theme.colors.primary,
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows.soft,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: 3,
  },
});

export const TeamEntryAccent = styled.span({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 3,
  background: '#5e7a55',
});

export const TeamEntryBody = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const TeamEntryEyebrow = styled.span({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#5e7a55',
});

export const TeamEntryTitle = styled.span({
  fontSize: 18,
  fontWeight: 700,
  color: theme.colors.text.primary,
  letterSpacing: '-0.01em',
});

export const TeamEntryCaption = styled.span({
  fontSize: 13,
  color: theme.colors.text.muted,
  lineHeight: 1.45,
});

export const TeamEntryArrow = styled.span({
  flexShrink: 0,
  fontSize: 22,
  lineHeight: 1,
  color: theme.colors.primary,
  transition: theme.transition,
  'button:hover &': { transform: 'translateX(4px)' },
});