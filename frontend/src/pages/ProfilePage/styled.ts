import styled from 'styled-components';
import { theme } from '../../app/styles/theme';

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 28,
  flexWrap: 'wrap',
  gap: 16,
});

export const PageTitle = styled.h1({
  fontFamily: theme.fonts.sans,
  fontSize: 32,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.colors.primary,
  margin: 0,
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
  padding: '36px 32px',
  boxShadow: theme.shadows.card,
  color: theme.colors.text.primary,
});

export const TopBlock = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  minWidth: 0,
  paddingBottom: 28,
  marginBottom: 28,
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  '@media (max-width: 640px)': {
    alignItems: 'flex-start',
    gap: 14,
  },
});

export const AvatarWrap = styled.div({
  flexShrink: 0,
});

export const Name = styled.h2({
  margin: 0,
  overflowWrap: 'anywhere',
  fontFamily: theme.fonts.sans,
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: '-0.01em',
  color: theme.colors.text.primary,
});

export const Role = styled.div({
  marginTop: 6,
  fontSize: 12,
  color: theme.colors.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 600,
});

export const MetaRow = styled.div({
  display: 'flex',
  gap: 24,
  flexWrap: 'wrap',
  marginTop: 28,
  paddingTop: 24,
  borderTop: `1px solid ${theme.colors.outlineVariant}`,
});

export const MetaItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontSize: 14,
});

export const MetaIcon = styled.span({
  width: 36,
  height: 36,
  borderRadius: theme.radius.sm,
  background: theme.colors.primaryFixed,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  color: theme.colors.primary,
});

export const MetaText = styled.span({
  color: theme.colors.text.secondary,
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
  background: theme.gradients.primaryHero,
  color: '#fff',
  borderRadius: 8,
  padding: '28px 20px',
  textAlign: 'center',
  boxShadow: '0 12px 24px rgba(150, 67, 37, 0.2)',
  marginBottom: 16,
});

export const MobileHeroAvatarWrap = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 14,
});

export const MobileHeroName = styled.h2({
  margin: 0,
  overflowWrap: 'anywhere',
  fontSize: 20,
  fontWeight: 800,
});

export const MobileHeroRole = styled.div({
  marginTop: 6,
  fontSize: 12,
  fontWeight: 700,
  opacity: 0.88,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
});

export const MobileStatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
  marginBottom: 16,
});

export const MobileStatCard = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: 14,
  border: `1px solid ${theme.colors.outlineVariant}`,
  background: theme.colors.bg.card,
  borderRadius: 8,
});

export const MobileStatIcon = styled.span<{ $tone: 'coral' | 'sage' }>((props) => ({
  width: 38,
  height: 38,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 8,
  fontSize: 18,
  background: props.$tone === 'coral' ? theme.colors.primaryFixed : '#e4eedc',
  color: props.$tone === 'coral' ? theme.colors.primary : '#4f7a52',
}));

export const MobileStatValue = styled.div({
  fontSize: 21,
  color: theme.colors.text.primary,
  fontWeight: 800,
  lineHeight: 1.05,
});

export const MobileStatLabel = styled.div({
  color: theme.colors.text.muted,
  fontSize: 11,
  fontWeight: 600,
  marginTop: 3,
});

export const MobileSectionTitle = styled.h3({
  color: theme.colors.text.primary,
  fontSize: 13,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  margin: '0 0 10px',
});

export const MobileAccountCard = styled.section({
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: 8,
  padding: '4px 16px',
  marginBottom: 20,
});

export const MobileAccountRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '13px 0',
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
  '&:last-child': { borderBottom: 0 },
});

export const MobileAccountLabel = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
  color: theme.colors.text.muted,
  fontSize: 13,
  fontWeight: 600,
  '.anticon': {
    fontSize: 15,
    color: theme.colors.primary,
  },
});

export const MobileAccountValue = styled.div({
  minWidth: 0,
  color: theme.colors.text.primary,
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'right',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '58%',
});

export const MobileActionsCol = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const MobileRefreshBtn = styled.button({
  width: '100%',
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: 8,
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
  borderRadius: 8,
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

const INK = '#1e1b18';
const SAGE = '#5e7a55';

const BP = {
  sm: '@media (max-width: 640px)',
  md: '@media (max-width: 768px)',
  lg: '@media (max-width: 1024px)',
};

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
  width: 168,
  height: 168,
  background: INK,
  borderRadius: 18,
  display: 'grid',
  placeItems: 'center',
  // Asymmetric clip — diagonal cut from top-right corner. Signatures this view.
  clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
  // A second layer gives a hairline sage edge that survives the clip.
  boxShadow:
    `0 0 0 1px ${SAGE}55, 0 18px 36px rgba(30, 27, 24, 0.18)`,
  [BP.sm]: { width: 124, height: 124, borderRadius: 14 },
  '@media (max-width: 380px)': { width: 100, height: 100 },
});

export const HeroTopo = styled.div({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0.5,
  // Subtle topographic linework — subject matter: a flat-hunter maps territory.
  backgroundImage:
    'repeating-linear-gradient(115deg, transparent 0 22px, rgba(150, 67, 37, 0.05) 22px 23px),' +
    'repeating-linear-gradient(25deg, transparent 0 34px, rgba(150, 67, 37, 0.04) 34px 35px)',
  maskImage: 'linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)',
});

export const HeroMonogram = styled.span({
  color: '#fff',
  fontFamily: theme.fonts.sans,
  fontSize: 76,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  userSelect: 'none',
  // Tiny offset so the mark sits flush with the visual weight of the tile,
  // not mathematically centered.
  transform: 'translate(-2px, -2px)',
  [BP.sm]: { fontSize: 56 },
  '@media (max-width: 380px)': { fontSize: 44 },
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
  fontSize: 38,
  fontWeight: 800,
  letterSpacing: '-0.025em',
  color: theme.colors.text.primary,
  lineHeight: 1.05,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  [BP.lg]: { fontSize: 34 },
  [BP.md]: { fontSize: 30 },
  [BP.sm]: { fontSize: 26 },
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
  marginTop: 20,
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