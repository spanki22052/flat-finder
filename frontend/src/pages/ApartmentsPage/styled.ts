import styled, { keyframes } from 'styled-components';
import { Input, Drawer, Button, Avatar, Space } from 'antd';
import { theme } from '../../app/styles/theme';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 28,
  flexWrap: 'wrap',
  gap: 16,
});

export const PageHeaderTitleGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const PageTitle = styled.h1({
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: theme.colors.text.inverse,
});

export const PageSubtitle = styled.div({
  fontSize: 13,
  fontWeight: 600,
  color: theme.colors.text.muted,
});

export const HeaderActions = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  '@media (max-width: 640px)': {
    width: '100%',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const FiltersRow = styled.div({
  display: 'flex',
  gap: 12,
  marginBottom: 20,
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '12px 16px',
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadows.soft,
  '& > *': {
    flex: '0 0 auto',
  },
  '@media (max-width: 640px)': {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 8,
    '& > *': {
      width: '100% !important',
      maxWidth: 'none',
    },
  },
});

export const SearchInput = styled(Input)({
  width: 300,
  maxWidth: 300,
  height: 44,
  borderRadius: `${theme.radius.pill} !important`,
  '.ant-input': {
    background: `${theme.colors.bg.card} !important`,
  },
  '@media (max-width: 640px)': {
    width: '100%',
    maxWidth: 'none',
  },
});

export const ResultsBadge = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginLeft: 'auto',
  padding: '8px 14px',
  borderRadius: theme.radius.pill,
  background: theme.colors.primaryFixed,
  color: theme.colors.onPrimaryFixedVariant,
  fontSize: 13,
  fontWeight: 700,
  whiteSpace: 'nowrap',
  '@media (max-width: 640px)': { display: 'none' },
});

export const ACTION_COL_BG = theme.colors.bg.card;

export const ACTION_COL_BG_HOVER = ACTION_COL_BG;

export const GlassCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
  '.ant-table-thead > tr > th': {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: theme.colors.text.muted,
  },
  '.ant-table-tbody > tr': {
    transition: 'background-color 0.15s ease',
  },
  '.ant-table-tbody > tr:hover > td': {
    background: `${theme.colors.bg.surfaceLow} !important`,
  },
  '.ant-table-tbody > tr > td': {
    borderBottom: `1px solid ${theme.colors.bg.glassBorder}`,
  },
  '.ant-table-cell-fix-right, .ant-table-cell-fix-right-first': {
    zIndex: 5,
    background: `${ACTION_COL_BG} !important`,
    backgroundColor: `${theme.colors.bg.deep} !important`,
    '&::before': {
      background: `${ACTION_COL_BG} !important`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 2,
      background: `linear-gradient(180deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
      opacity: 0.6,
      pointerEvents: 'none',
    },
  },
  '.ant-table-thead > tr > th.ant-table-cell-fix-right': {
    background: `${ACTION_COL_BG} !important`,
    backgroundColor: `${theme.colors.bg.deep} !important`,
  },
  '.ant-pagination': {
    padding: '14px 24px',
  },
});

export const ApartmentRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '6px 0',
  '@media (max-width: 640px)': {
    gap: 8,
  },
});

export const AptThumb = styled.div<{ $status: string }>((props) => ({
  width: 52,
  height: 52,
  borderRadius: 12,
  flexShrink: 0,
  background: `${props.$status}18`,
  border: `1px solid ${props.$status}30`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  color: props.$status,
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '@media (max-width: 640px)': {
    width: 36,
    height: 36,
    fontSize: 15,
    borderRadius: 8,
  },
}));

export const AptInfo = styled.div({ flex: 1, minWidth: 0 });

export const AptTitle = styled.div({
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text.muted,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  minWidth: 0,
  '@media (max-width: 640px)': {
    fontSize: 13,
  },
});

export const TitleButton = styled.button({
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
  textAlign: 'left',
  flex: 1,
  minWidth: 0,
  borderRadius: 4,
  transition: 'color 0.15s ease, background 0.15s ease',
  '&:hover': {
    color: theme.colors.primary,
    background: theme.colors.primaryFixed,
  },
  '@media (max-width: 640px)': {
    fontSize: 13,
  },
});

export const SourceLinkButton = styled.button({
  background: 'transparent',
  border: 'none',
  padding: '2px 4px',
  cursor: 'pointer',
  color: theme.colors.primary,
  fontSize: 12,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  flexShrink: 0,
  transition: 'background 0.15s ease, color 0.15s ease',
  '&:hover': {
    background: theme.colors.primaryFixed,
    color: theme.colors.primaryHover,
  },
});

export const AptMeta = styled.div({
  fontSize: 12,
  color: theme.colors.text.secondary,
  marginTop: 2,
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  '@media (max-width: 640px)': {
    fontSize: 11,
    gap: 6,
  },
});

export const PriceTag = styled.div({
  fontSize: 16,
  fontWeight: 800,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.primary,
  whiteSpace: 'nowrap',
  '@media (max-width: 640px)': {
    fontSize: 13,
  },
});

export const PriceTagMeta = styled.div({
  fontSize: 11,
  fontWeight: 500,
  color: theme.colors.text.muted,
  whiteSpace: 'nowrap',
  marginTop: 2,
});

export const TagPills = styled.div({
  display: 'flex',
  gap: 4,
  flexWrap: 'wrap',
  maxWidth: '100%',
  overflow: 'hidden',
});

export const RowActions = styled(Space)({
  '.ant-btn': {
    borderRadius: 8,
  },
});

export const DrawerStyled = styled(Drawer)({
  '.ant-drawer-body': { padding: '24px !important', background: theme.colors.bg.surface },
});

export const FormSection = styled.div({
  marginBottom: 24,
  '.ant-form-item': { marginBottom: 16 },
  '.ant-input, .ant-input-affix-wrapper, .ant-select-selector, .ant-picker': {
    background: `${theme.colors.bg.card} !important`,
    borderColor: `${theme.colors.outlineVariant} !important`,
    color: `${theme.colors.text.primary} !important`,
    borderRadius: '10px !important',
  },
});

export const SectionTitle = styled.div({
  fontSize: 12,
  fontWeight: 700,
  color: theme.colors.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 12,
});

export const EmptyState = styled.div({
  textAlign: 'center',
  padding: '72px 20px',
  color: theme.colors.text.muted,
  fontSize: 14,
  fontWeight: 600,
});

export const EmptyIconWrap = styled.div({
  width: 96,
  height: 96,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle, rgba(150, 67, 37, 0.14), rgba(150, 67, 37, 0.03))',
  margin: '0 auto 16px',
});

export const ModeSwitchWrapper = styled.div({
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  '.ant-segmented': {
    background: theme.colors.bg.surfaceContainer,
    border: `1px solid ${theme.colors.outlineVariant}`,
    padding: 4,
    borderRadius: 12,
  },
  '.ant-segmented-item': {
    color: theme.colors.text.secondary,
  },
  '.ant-segmented-item-selected': {
    background: theme.gradients.accent,
    color: '#fff !important',
    borderRadius: 8,
  },
});

export const LinkModeHint = styled.div({
  fontSize: 12,
  color: theme.colors.text.secondary,
  marginTop: 8,
  lineHeight: 1.5,
});

export const ImportButton = styled.button({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  background: theme.colors.primaryFixed,
  border: `1px solid ${theme.colors.primaryFixedDim}`,
  color: theme.colors.onPrimaryFixedVariant,
  fontSize: 14,
  fontWeight: 600,
  padding: '0 18px',
  height: 44,
  borderRadius: 12,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  transition: 'background 0.15s ease, transform 0.1s ease',
  '&:hover': {
    background: theme.colors.primaryFixedDim,
  },
  '&:active': {
    transform: 'translateY(1px)',
  },
  '@media (max-width: 640px)': {
    height: 36,
    padding: '0 12px',
    fontSize: 12,
    gap: 6,
    borderRadius: 10,
  },
});

export const AddApartmentButton = styled(Button)({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  height: 44,
  paddingInline: 18,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 12,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: `${theme.gradients.accent} !important`,
  border: 'none !important',
  '&:active': {
    transform: 'translateY(1px)',
  },
  '@media (max-width: 640px)': {
    height: 36,
    paddingInline: 12,
    fontSize: 12,
    gap: 6,
    borderRadius: 10,
  },
});

export const PhotoGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
  gap: 8,
  marginTop: 8,
});

export const PhotoTile = styled.div({
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 3',
  borderRadius: 8,
  overflow: 'hidden',
  background: theme.colors.bg.surfaceLow,
  border: `1px solid ${theme.colors.outlineVariant}`,
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
});

export const PhotoRemoveBtn = styled.button({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 22,
  height: 22,
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(30, 27, 24, 0.72)',
  color: '#fff',
  fontSize: 13,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { background: theme.colors.error },
});

export const PhotoAddRow = styled.div({
  display: 'flex',
  gap: 6,
  marginTop: 8,
  alignItems: 'center',
});

export const PhotoCounter = styled.span({
  fontSize: 12,
  color: theme.colors.text.muted,
  marginTop: 6,
  display: 'inline-block',
});

export const DesktopList = styled.div({
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

// ─── Mobile FlatFinder shell (matches DashboardPage mobile) ──────────────────

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

export const MobileTopActions = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const MobileBellBtn = styled.button({
  border: 0,
  padding: 0,
  width: 38,
  height: 38,
  background: 'transparent',
  color: theme.colors.text.secondary,
  fontSize: 20,
  verticalAlign: 'middle',
  cursor: 'pointer',
  borderRadius: '50%',
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 2 },
});

export const MobileAvatar = styled(Avatar)({
  marginLeft: 4,
  verticalAlign: 'middle',
  background: theme.colors.tertiaryContainer,
  color: theme.colors.onPrimaryFixed,
  fontWeight: 800,
  fontSize: 12,
});

export const MobileBody = styled.main({
  padding: '20px 16px 112px',
  background: theme.colors.bg.surface,
  minHeight: 'calc(100vh - 76px)',
});

export const MobileToolbar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 16,
});

export const MobileHeading = styled.h1({
  fontSize: 24,
  fontWeight: 800,
  color: theme.colors.text.primary,
  lineHeight: 1.1,
  '& > span': {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
});

export const MobileAddBtn = styled.button({
  flex: '0 0 auto',
  height: 40,
  paddingInline: 16,
  borderRadius: 8,
  border: 0,
  background: theme.colors.primary,
  color: '#fff',
  fontSize: 14,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 },
});

export const MobileImportRow = styled.div({
  display: 'flex',
  gap: 8,
  marginBottom: 12,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const MobileImportBtn = styled.button({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  height: 38,
  paddingInline: 14,
  borderRadius: 8,
  background: theme.colors.primaryFixed,
  border: `1px solid ${theme.colors.primaryFixedDim}`,
  color: theme.colors.onPrimaryFixedVariant,
  fontSize: 13,
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  cursor: 'pointer',
});

export const MobileSearch = styled(Input)({
  height: 44,
  borderRadius: 8,
  marginBottom: 12,
  background: `${theme.colors.bg.card} !important`,
  borderColor: `${theme.colors.outlineVariant} !important`,
  '.ant-input': {
    background: 'transparent !important',
  },
});

export const MobileChips = styled.div({
  display: 'flex',
  gap: 8,
  marginBottom: 18,
  overflowX: 'auto',
  paddingBottom: 4,
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const MobileChip = styled.button<{ $active?: boolean }>((props) => ({
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  height: 34,
  paddingInline: 14,
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  border: `1px solid ${props.$active ? theme.colors.primary : theme.colors.outlineVariant}`,
  background: props.$active ? theme.colors.primary : theme.colors.bg.card,
  color: props.$active ? '#fff' : theme.colors.text.secondary,
}));

export const MobileList = styled.div({
  display: 'grid',
  gap: 14,
});

export const MobileApartmentCard = styled.article`
  overflow: hidden;
  background: ${theme.colors.bg.card};
  border: 1px solid ${theme.colors.outlineVariant};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.card};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  animation: ${fadeInUp} 0.3s ease both;
  &:active {
    transform: scale(0.99);
  }
`;

export const MobileApartmentImage = styled.div<{ $status: string }>((props) => ({
  position: 'relative',
  height: 176,
  background: `${props.$status}18`,
  color: props.$status,
  display: 'grid',
  placeItems: 'center',
  fontSize: 40,
  overflow: 'hidden',
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

export const MobileStatusBadge = styled.span<{ $color?: string }>((props) => ({
  position: 'absolute',
  right: 10,
  top: 10,
  padding: '4px 10px',
  borderRadius: theme.radius.pill,
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(4px)',
  color: props.$color ?? theme.colors.primary,
  fontSize: 11,
  fontWeight: 800,
  boxShadow: '0 2px 8px rgba(30, 27, 24, 0.12)',
}));

export const MobilePhotoCount = styled.span({
  position: 'absolute',
  left: 10,
  top: 10,
  padding: '3px 8px',
  borderRadius: 6,
  background: 'rgba(30, 27, 24, 0.62)',
  color: '#fff',
  fontSize: 11,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
});

export const MobileCardBody = styled.div({
  minWidth: 0,
  padding: '12px 14px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const MobileCardHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 10,
});

export const MobileApartmentTitle = styled.button({
  minWidth: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: theme.colors.text.primary,
  fontSize: 15,
  lineHeight: 1.3,
  fontWeight: 800,
  textAlign: 'left',
  cursor: 'pointer',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  '&:hover': { color: theme.colors.primary },
});

export const MobilePrice = styled.div({
  color: theme.colors.primary,
  fontFamily: theme.fonts.mono,
  fontSize: 15,
  fontWeight: 800,
  whiteSpace: 'nowrap',
});

export const MobilePriceMeta = styled.div({
  color: theme.colors.text.muted,
  fontSize: 11,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  textAlign: 'right',
});

export const MobileMeta = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px 10px',
  color: theme.colors.text.muted,
  fontSize: 12,
  lineHeight: 1.35,
  span: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
  },
});

export const MobileTagRow = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  alignItems: 'center',
  '.ant-tag': {
    marginInlineEnd: 0,
    border: 0,
    background: theme.colors.primaryFixed,
    color: theme.colors.onPrimaryFixedVariant,
    fontSize: 11,
    lineHeight: '22px',
    borderRadius: 6,
  },
});

export const MobileCardActions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 4,
  paddingTop: 10,
  borderTop: `1px solid ${theme.colors.outlineVariant}`,
  '.ant-btn': {
    width: 34,
    height: 34,
    padding: 0,
    borderRadius: 8,
  },
});

export const MobileEmptyState = styled.div({
  minHeight: 280,
  display: 'grid',
  placeItems: 'center',
  alignContent: 'center',
  color: theme.colors.text.muted,
  textAlign: 'center',
  background: theme.colors.bg.card,
  border: `1px solid ${theme.colors.outlineVariant}`,
  borderRadius: 8,
});

export const MobilePagination = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 20,
});