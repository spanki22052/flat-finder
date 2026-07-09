import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import {
  DashboardOutlined, HomeOutlined, BellOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../app/providers/AuthProvider';
import {
  SidebarWrap, LogoArea, LogoIcon, LogoText,
  NavList, StyledNavLink, NavLabel, BottomSection,
  UserInfo, Avatar, UserName, UserNameText, UserRole,
  LogoutBtn, CollapseBtn, Backdrop,
} from './LayoutSidebar/styled';

const NAV_ITEMS = [
  { key: '/dashboard', label: 'Дашборд', icon: <DashboardOutlined /> },
  { key: '/apartments', label: 'Квартиры', icon: <HomeOutlined /> },
  { key: '/reminders', label: 'Напоминания', icon: <BellOutlined /> },
  { key: '/profile', label: 'Профиль', icon: <UserOutlined /> },
];

interface LayoutSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function LayoutSidebar({ collapsed, onToggle }: LayoutSidebarProps) {
  const { user, logout } = useAuth();

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
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <LogoArea>
          <LogoIcon>FF</LogoIcon>
          {!collapsed && (
            <LogoText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              Flat Finder
            </LogoText>
          )}
        </LogoArea>

        <NavList>
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <Tooltip key={key} title={collapsed ? label : ''} placement="right">
              <StyledNavLink to={key} $collapsed={collapsed} end={key === '/'}>
                {icon}
                {!collapsed && <NavLabel>{label}</NavLabel>}
              </StyledNavLink>
            </Tooltip>
          ))}
        </NavList>

        <BottomSection>
          <CollapseBtn $collapsed={collapsed} onClick={onToggle}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </CollapseBtn>

          <UserInfo $collapsed={collapsed}>
            <Avatar>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</Avatar>
            {!collapsed && (
              <UserName initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <UserNameText>{user?.name ?? 'User'}</UserNameText>
                <UserRole>{user?.role ?? 'USER'}</UserRole>
              </UserName>
            )}
          </UserInfo>

          <Tooltip title={collapsed ? 'Выйти' : ''} placement="right">
            <LogoutBtn $collapsed={collapsed} onClick={logout}>
              <LogoutOutlined />
              {!collapsed && 'Выйти'}
            </LogoutBtn>
          </Tooltip>
        </BottomSection>
      </SidebarWrap>
    </>
  );
}
