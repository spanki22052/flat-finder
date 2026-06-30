import styled from 'styled-components';
import { Input, Drawer } from 'antd';
import { theme } from '../../app/styles/theme';

export const PageHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  flexWrap: 'wrap',
  gap: 16,
});

export const PageTitle = styled.h1({
  fontSize: 26,
  fontWeight: 700,
  color: theme.colors.text.inverse,
});

export const FiltersRow = styled.div({
  display: 'flex',
  gap: 12,
  marginBottom: 20,
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const SearchInput = styled(Input)({
  maxWidth: 280,
  '.ant-input': {
    background: 'rgba(255,255,255,0.04) !important',
    borderColor: `${theme.colors.bg.glassBorder} !important`,
  },
});

export const GlassCard = styled.div({
  background: theme.colors.bg.card,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
  borderRadius: theme.radius.xl,
  overflow: 'hidden',
  boxShadow: theme.shadows.card,
});

export const ApartmentRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '4px 0',
});

export const AptThumb = styled.div<{ $status: string }>((props) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  flexShrink: 0,
  background: `${props.$status}18`,
  border: `1px solid ${props.$status}30`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
}));

export const AptInfo = styled.div({ flex: 1, minWidth: 0 });

export const AptTitle = styled.div({
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text.inverse,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const AptMeta = styled.div({
  fontSize: 12,
  color: theme.colors.text.secondary,
  marginTop: 2,
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
});

export const PriceTag = styled.div({
  fontSize: 15,
  fontWeight: 700,
  fontFamily: theme.fonts.mono,
  color: theme.colors.text.inverse,
  whiteSpace: 'nowrap',
});

export const TagPills = styled.div({
  display: 'flex',
  gap: 4,
  flexWrap: 'wrap',
});

export const DrawerStyled = styled(Drawer)({
  '.ant-drawer-body': { padding: '24px !important', background: theme.colors.bg.base },
});

export const FormSection = styled.div({
  marginBottom: 24,
  '.ant-form-item': { marginBottom: 16 },
  '.ant-input, .ant-input-affix-wrapper, .ant-select-selector, .ant-picker': {
    background: 'rgba(255,255,255,0.04) !important',
    borderColor: `${theme.colors.bg.glassBorder} !important`,
    color: `${theme.colors.text.inverse} !important`,
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
  padding: '60px 20px',
  color: theme.colors.text.muted,
});

export const ModeSwitchWrapper = styled.div({
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  '.ant-segmented': {
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${theme.colors.bg.glassBorder}`,
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
  background: 'rgba(159,161,255,0.14)',
  border: `1px solid rgba(159,161,255,0.4)`,
  color: '#B5BAFF',
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
    background: 'rgba(159,161,255,0.22)',
  },
  '&:active': {
    transform: 'translateY(1px)',
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
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${theme.colors.bg.glassBorder}`,
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
  background: 'rgba(15, 23, 42, 0.78)',
  color: '#fff',
  fontSize: 13,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { background: 'rgba(239, 68, 68, 0.85)' },
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