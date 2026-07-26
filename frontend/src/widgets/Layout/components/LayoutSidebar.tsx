import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import {
  DashboardOutlined, HomeOutlined, BellOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined,
  UserOutlined, UserAddOutlined, PlusCircleOutlined, TeamOutlined, SwapOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useRoom } from '../../../app/providers/RoomProvider';
import {
  SidebarWrap, LogoArea, LogoIcon, LogoText, LogoTitle, LogoSubtitle,
  NavList, StyledNavLink, NavLabel, SidebarBadge, SidebarBadgeDot, BottomSection,
  InviteButton, UserInfo, Avatar, UserName, UserNameText, UserRole,
  LogoutBtn, CollapseBtn, Backdrop,
} from './LayoutSidebar/styled';
import { usePendingReminders } from '../hooks/usePendingReminders';

const NAV_ITEMS = [
  { key: '/dashboard', label: 'Дашборд', icon: <DashboardOutlined /> },
  { key: '/apartments', label: 'Квартиры', icon: <HomeOutlined /> },
  { key: '/reminders', label: 'Напоминания', icon: <BellOutlined /> },
  { key: '/team', label: 'Команда', icon: <TeamOutlined /> },
  { key: '/profile', label: 'Профиль', icon: <UserOutlined /> },
];

interface LayoutSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function LayoutSidebar({ collapsed, onToggle }: LayoutSidebarProps) {
  const { user, logout } = useAuth();
  const { currentRoom, clearRoom } = useRoom();
  const { pendingCount } = usePendingReminders();
  const navigate = useNavigate();

  const switchRoom = () => {
    clearRoom();
    navigate('/rooms');
  };

  const badgeText = pendingCount > 99 ? '99+' : String(pendingCount);

  return (
    <>
      <AnimatePresence>
        {!collapsed && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>
      <SidebarWrap
        $collapsed={collapsed}
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <LogoArea>
          <LogoIcon>FF</LogoIcon>
          {!collapsed && (
            <LogoText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <LogoTitle>FlatFinder</LogoTitle>
              <LogoSubtitle>Cozy Hunting</LogoSubtitle>
            </LogoText>
          )}
        </LogoArea>

        <NavList>
          {NAV_ITEMS.map(({ key, label, icon }) => {
            const isReminders = key === '/reminders';
            const showBadge = isReminders && pendingCount > 0;
            return (
              <Tooltip key={key} title={collapsed ? label : ''} placement="right">
                <StyledNavLink to={key} $collapsed={collapsed} end={key === '/'}>
                  {icon}
                  {!collapsed && <NavLabel>{label}</NavLabel>}
                  {!collapsed && showBadge && (
                    <SidebarBadge aria-hidden>{badgeText}</SidebarBadge>
                  )}
                  {collapsed && showBadge && <SidebarBadgeDot aria-hidden />}
                </StyledNavLink>
              </Tooltip>
            );
          })}
        </NavList>

        <BottomSection>
          <Tooltip title={collapsed ? `Комната: ${currentRoom?.name ?? '—'}` : ''} placement="right">
            <UserInfo
              type="button"
              $collapsed={collapsed}
              onClick={switchRoom}
              aria-label="Сменить комнату"
            >
              <Avatar><SwapOutlined /></Avatar>
              {!collapsed && (
                <UserName initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <UserNameText>{currentRoom?.name ?? 'Комната'}</UserNameText>
                  <UserRole>Сменить</UserRole>
                </UserName>
              )}
            </UserInfo>
          </Tooltip>

          <Tooltip title={collapsed ? 'Профиль' : ''} placement="right">
            <UserInfo
              type="button"
              $collapsed={collapsed}
              onClick={() => navigate('/profile')}
              aria-label="Открыть профиль"
            >
              <Avatar>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</Avatar>
              {!collapsed && (
                <UserName initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <UserNameText>{user?.name ?? 'User'}</UserNameText>
                  <UserRole>{user?.role === 'ADMIN' ? 'Admin' : 'Hunter'}</UserRole>
                </UserName>
              )}
            </UserInfo>
          </Tooltip>

          <CollapseBtn $collapsed={collapsed} onClick={onToggle} aria-label="Свернуть меню">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </CollapseBtn>

          <Tooltip title={collapsed ? 'Выйти' : ''} placement="right">
            <LogoutBtn type="button" $collapsed={collapsed} onClick={logout} aria-label="Выйти">
              <LogoutOutlined />
              {!collapsed && 'Выйти'}
            </LogoutBtn>
          </Tooltip>
        </BottomSection>
      </SidebarWrap>
    </>
  );
}