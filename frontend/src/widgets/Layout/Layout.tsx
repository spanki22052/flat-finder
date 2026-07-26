import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import { AuroraBackground } from './components/AuroraBackground';
import { LayoutSidebar } from './components/LayoutSidebar';
import { BottomNav } from './components/BottomNav';
import { NotificationsDropdown } from './components/NotificationsDropdown';
import { theme } from '../../app/styles/theme';
import { useRoom } from '../../app/providers/RoomProvider';
import {
  MenuFoldOutlined, SearchOutlined, BellOutlined, SettingOutlined, PlusOutlined,
  HomeOutlined, SwapOutlined, SettingFilled, CaretDownOutlined,
} from '@ant-design/icons';
import {
  LayoutWrapper, MainArea, TopBar, TopBarTitle, TopBarActions,
  TopBarSearch, TopBarIconBtn, TopBarBadgeWrap, MobileMenuBtn, PageContent, Fab,
  RoomSwitcher, MobileRoomBar, MobileRoomBtn, MobileBellBtn, MobileBellBadgeWrap,
} from './styled';
import { usePendingReminders } from './hooks/usePendingReminders';

const { Header, Content } = AntLayout;

const MOBILE_BREAKPOINT = parseInt(theme.breakpoints.md, 10);

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Дашборд',
  '/apartments': 'Квартиры',
  '/reminders': 'Напоминания',
  '/team': 'Команда',
  '/profile': 'Профиль',
  '/rooms/manage': 'Комната',
};

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRoom, clearRoom } = useRoom();
  const { pendingCount, pendingItems, refresh } = usePendingReminders();
  const title = PAGE_TITLES[location.pathname] ?? 'Flat Finder';

  const switchRoom = () => {
    clearRoom();
    navigate('/rooms');
  };

  const goManage = () => {
    navigate('/rooms/manage');
  };

  const handleCopyInvite = async () => {
    if (!currentRoom) return;
    try {
      await navigator.clipboard.writeText(currentRoom.inviteCode);
    } catch {
      // ignore
    }
  };

  const roomMenu: MenuProps = {
    items: [
      {
        key: 'current',
        label: currentRoom?.name ?? 'Без комнаты',
        disabled: true,
      },
      { type: 'divider' },
      {
        key: 'manage',
        label: 'Управление комнатой',
        icon: <SettingFilled />,
        onClick: goManage,
      },
      {
        key: 'copy',
        label: 'Копировать код приглашения',
        icon: <SwapOutlined />,
        onClick: handleCopyInvite,
      },
      {
        key: 'switch',
        label: 'Сменить комнату',
        icon: <HomeOutlined />,
        onClick: switchRoom,
      },
    ],
  };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <LayoutWrapper>
      <AuroraBackground />
      {!isMobile && (
        <LayoutSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      )}
      <MainArea
        $isMobile={isMobile}
        style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 260) }}
      >
        {!isMobile && (
          <TopBar>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <MobileMenuBtn onClick={() => setCollapsed(false)} aria-label="Меню">
                <MenuFoldOutlined />
              </MobileMenuBtn>
              <TopBarTitle>{title}</TopBarTitle>
            </div>
            <TopBarActions>
              <TopBarSearch>
                <SearchOutlined />
                <input placeholder="Поиск квартир..." type="text" aria-label="Поиск" />
              </TopBarSearch>
              <Dropdown menu={roomMenu} trigger={['click']} placement="bottomRight">
                <RoomSwitcher type="button" aria-label="Сменить комнату" title={currentRoom?.name ?? 'Выбрать комнату'}>
                  <HomeOutlined />
                  <span className="room-switcher-name">{currentRoom?.name ?? 'Выбрать комнату'}</span>
                  <SwapOutlined className="room-switcher-swap" />
                </RoomSwitcher>
              </Dropdown>
              <Dropdown
                trigger={['click']}
                placement="bottomRight"
                arrow
                dropdownRender={() => (
                  <NotificationsDropdown
                    items={pendingItems}
                    total={pendingCount}
                    onChanged={refresh}
                  />
                )}
              >
                <TopBarIconBtn
                  type="button"
                  aria-label={`Уведомления${pendingCount ? `, ${pendingCount} активных` : ''}`}
                >
                  <TopBarBadgeWrap $count={pendingCount}>
                    {pendingCount > 0 ? (
                      <Badge
                        count={pendingCount}
                        overflowCount={99}
                        color="#964325"
                        title={`${pendingCount} активных напоминаний`}
                      >
                        <BellOutlined />
                      </Badge>
                    ) : (
                      <Badge dot color="#964325" title="Нет активных напоминаний">
                        <BellOutlined />
                      </Badge>
                    )}
                  </TopBarBadgeWrap>
                </TopBarIconBtn>
              </Dropdown>
              <TopBarIconBtn type="button" aria-label="Настройки">
                <SettingOutlined />
              </TopBarIconBtn>
            </TopBarActions>
          </TopBar>
        )}
        {isMobile && (
          <MobileRoomBar>
            <Dropdown menu={roomMenu} trigger={['click']} placement="bottomRight">
              <MobileRoomBtn type="button" aria-label="Сменить комнату">
                <HomeOutlined />
                <span className="label">{currentRoom?.name ?? 'Выбрать комнату'}</span>
                <CaretDownOutlined className="chev" />
              </MobileRoomBtn>
            </Dropdown>
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              arrow
              dropdownRender={() => (
                <NotificationsDropdown
                  items={pendingItems}
                  total={pendingCount}
                  onChanged={refresh}
                />
              )}
            >
              <MobileBellBtn
                type="button"
                aria-label={`Уведомления${pendingCount ? `, ${pendingCount} активных` : ''}`}
              >
                <MobileBellBadgeWrap $count={pendingCount}>
                  {pendingCount > 0 ? (
                    <Badge
                      count={pendingCount}
                      overflowCount={99}
                      color="#964325"
                      title={`${pendingCount} активных напоминаний`}
                    >
                      <BellOutlined />
                    </Badge>
                  ) : (
                    <Badge dot color="#964325" title="Нет активных напоминаний">
                      <BellOutlined />
                    </Badge>
                  )}
                </MobileBellBadgeWrap>
              </MobileBellBtn>
            </Dropdown>
          </MobileRoomBar>
        )}
        <PageContent>
          <Outlet />
        </PageContent>
        {!isMobile && (
          <Fab type="button" aria-label="Добавить квартиру" onClick={() => navigate('/apartments')}>
            <PlusOutlined />
          </Fab>
        )}
        {isMobile && <BottomNav />}
      </MainArea>
    </LayoutWrapper>
  );
}