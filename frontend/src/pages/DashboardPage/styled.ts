import styled from 'styled-components';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { theme } from '@/app/styles/theme';

export const CenterSpin = styled.div({
  display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360,
});

export const DashboardMobile = styled.div({
  display: 'none',
  '@media (max-width: 768px)': { display: 'block', margin: '-16px -16px 0' },
});

export const DashboardDesktop = styled.div({
  display: 'block',
  '& > h1': { color: theme.colors.text.primary, margin: 0, fontSize: 30, letterSpacing: 0 },
  '& > p': { color: theme.colors.text.muted, margin: '6px 0 28px', fontSize: 15 },
  '@media (max-width: 768px)': { display: 'none' },
});

export const MobileHeader = styled.header({
  height: 76,
  padding: '14px 20px 12px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: theme.colors.bg.card,
  borderBottom: `1px solid ${theme.colors.outlineVariant}`,
});

export const HeaderBrand = styled.div({ display: 'flex', alignItems: 'center', gap: 10, color: theme.colors.text.primary, fontSize: 17, fontWeight: 800 });
export const HeaderLogo = styled.span({
  width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center',
  background: theme.colors.primary, color: theme.colors.text.onPrimary, fontSize: 18,
});
export const HeaderGreeting = styled.div({ color: theme.colors.text.muted, fontWeight: 600, fontSize: 10, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' });
export const HeaderNotification = styled.button({
  border: 0, padding: 0, width: 38, height: 38, background: 'transparent', color: theme.colors.text.secondary,
  fontSize: 20, verticalAlign: 'middle', cursor: 'pointer', borderRadius: '50%',
  '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 2 },
});
export const HeaderAvatar = styled(Avatar)({
  marginLeft: 4, verticalAlign: 'middle', background: theme.colors.tertiaryContainer, color: theme.colors.onPrimaryFixed,
  fontWeight: 800, fontSize: 12,
});

export const MobilePage = styled.main({ padding: '20px 16px 112px', background: theme.colors.bg.surface, minHeight: 'calc(100vh - 76px)' });

export const ProgressCard = styled.section({
  background: 'linear-gradient(135deg, #a44e2d 0%, #d9794e 100%)', color: '#fff', borderRadius: 8, padding: 20,
  boxShadow: '0 12px 24px rgba(150, 67, 37, 0.2)',
});
export const ProgressHeader = styled.div({ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' });
export const ProgressEyebrow = styled.div({ textTransform: 'uppercase', letterSpacing: '0.09em', fontSize: 10, fontWeight: 800, opacity: 0.8, marginBottom: 6 });
export const ProgressTitle = styled.div({ textTransform: 'uppercase', letterSpacing: 0, fontWeight: 800, fontSize: 22, lineHeight: 1.05 });
export const ProgressMeta = styled.span({ padding: '5px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.18)', fontSize: 11, whiteSpace: 'nowrap', fontWeight: 700 });
export const ProgressBar = styled.div({ height: 7, borderRadius: 5, background: 'rgba(255,255,255,0.25)', overflow: 'hidden', margin: '20px 0 12px' });
export const ProgressBarFill = styled.div({ height: '100%', borderRadius: 'inherit', background: '#fff5ed', transition: 'width 0.5s ease' });
export const ProgressCopy = styled.p({ margin: 0, fontSize: 13, lineHeight: 1.45, color: 'rgba(255,255,255,0.94)' });

export const StatsGrid = styled.div({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' });
export const StatCard = styled.div({ display: 'flex', alignItems: 'center', gap: 10, padding: 14, border: `1px solid ${theme.colors.outlineVariant}`, background: theme.colors.bg.card, borderRadius: 8 });
export const StatIcon = styled.span<{ $tone: 'coral' | 'sage' }>((props) => ({
  width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: 8, fontSize: 18,
  background: props.$tone === 'coral' ? theme.colors.primaryFixed : '#e4eedc',
  color: props.$tone === 'coral' ? theme.colors.primary : '#4f7a52',
}));
export const StatValue = styled.div({ fontSize: 21, color: theme.colors.text.primary, fontWeight: 800, lineHeight: 1.05 });
export const StatLabel = styled.div({ color: theme.colors.text.muted, fontSize: 11, fontWeight: 600, marginTop: 3 });

export const ConsensusCard = styled(Link)({
  display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 8, background: '#fff6e8',
  border: '1px solid #f2d8ad', color: theme.colors.text.primary, textDecoration: 'none', marginBottom: 26,
  '& > .anticon:last-child': { color: theme.colors.tertiary, fontSize: 13 },
});
export const ConsensusIcon = styled.span({ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#ffe1a9', color: '#9a681d', fontSize: 17 });
export const ConsensusContent = styled.div({ flex: 1, minWidth: 0, '& > span': { color: theme.colors.text.muted, fontSize: 11, display: 'block', marginTop: 3 } });
export const ConsensusText = styled.div({ fontSize: 14, fontWeight: 800 });

export const SectionHeader = styled.div({ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, margin: '0 0 12px' });
export const SectionTitle = styled.h2({ color: theme.colors.text.primary, fontSize: 18, fontWeight: 800, margin: 0, lineHeight: 1.2 });
export const SeeAll = styled(Link)({ color: theme.colors.primary, fontWeight: 800, fontSize: 12, textDecoration: 'none' });

export const ApartmentsRail = styled.div({ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 24, marginBottom: 18, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } });
export const ApartmentCard = styled(Link)({ display: 'block', minWidth: 188, width: 188, overflow: 'hidden', border: `1px solid ${theme.colors.outlineVariant}`, borderRadius: 8, background: theme.colors.bg.card, color: theme.colors.text.primary, textDecoration: 'none' });
export const ApartmentCardImage = styled.div<{ $src?: string }>((props) => ({
  height: 118, position: 'relative', display: 'grid', placeItems: 'center', fontSize: 30,
  color: theme.colors.primary, background: props.$src ? `url("${props.$src}") center / cover no-repeat` : theme.colors.primaryFixed,
}));
export const ConsensusBadge = styled.span({ position: 'absolute', right: 8, top: 8, padding: '4px 6px', borderRadius: 5, background: 'rgba(255,255,255,0.92)', color: theme.colors.primary, fontSize: 10, fontWeight: 800 });
export const ApartmentCardInfo = styled.div({ padding: '10px 10px 12px' });
export const ApartmentCardTitle = styled.div({ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
export const ApartmentCardLocation = styled.div({ marginTop: 4, color: theme.colors.text.muted, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
export const ApartmentCardPrice = styled.div({ marginTop: 10, color: theme.colors.primary, fontSize: 13, fontWeight: 800 });

export const ActivityFeed = styled.div({ padding: '2px 0 14px' });
export const ActivityItem = styled.div({ display: 'flex', gap: 11, padding: '10px 0', borderBottom: `1px solid ${theme.colors.outlineVariant}`, '&:last-child': { borderBottom: 0 } });
export const ActivityAvatar = styled.div<{ $color: string }>((props) => ({ width: 34, height: 34, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', background: props.$color, color: '#fff', fontSize: 10, fontWeight: 800 }));
export const AvatarInitials = styled.span({ fontSize: 'inherit' });
export const ActivityContent = styled.div({ minWidth: 0, paddingTop: 1 });
export const ActivityText = styled.div({ color: theme.colors.text.secondary, fontSize: 12, lineHeight: 1.35, '& strong': { color: theme.colors.text.primary }, '& span': { color: theme.colors.primary, fontWeight: 700 } });
export const ActivityTime = styled.div({ color: theme.colors.text.muted, fontSize: 10, marginTop: 4 });
export const EmptyPanel = styled.div({ padding: '6px 0 22px', '.ant-empty': { margin: '12px 0' }, '.ant-empty-description': { fontSize: 12, color: theme.colors.text.muted } });
export const AddListingButton = styled.button({ width: '100%', border: 0, borderRadius: 8, padding: 14, background: theme.colors.primary, color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 14, '& .anticon': { marginRight: 7 }, '&:focus-visible': { outline: `2px solid ${theme.colors.primary}`, outlineOffset: 3 } });

export const DesktopGrid = styled.div({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 });
export const DesktopStat = styled.div({ minHeight: 150, borderRadius: 16, background: theme.colors.bg.card, border: `1px solid ${theme.colors.outlineVariant}`, display: 'flex', flexDirection: 'column', gap: 8, padding: 24, color: theme.colors.primary, fontSize: 23, '& strong': { color: theme.colors.text.primary, fontSize: 38 }, '& span': { color: theme.colors.text.muted, fontSize: 13, fontWeight: 600 } });
export const DesktopPanel = styled.div({ gridColumn: 'span 3', padding: 24, borderRadius: 16, background: theme.colors.bg.card, border: `1px solid ${theme.colors.outlineVariant}` });
