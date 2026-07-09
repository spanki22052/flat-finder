import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { AuroraBackground } from './components/AuroraBackground';
import { LayoutSidebar } from './components/LayoutSidebar';
import { BottomNav } from './components/BottomNav';
import { theme } from '../../app/styles/theme';
import { MenuFoldOutlined } from '@ant-design/icons';
import {
  LayoutWrapper, MainArea, TopBar, MobileMenuBtn, PageContent,
} from './styled';

const { Header, Content } = AntLayout;

const MOBILE_BREAKPOINT = parseInt(theme.breakpoints.md, 10);

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT,
  );

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
        style={{ marginLeft: isMobile ? 0 : (collapsed ? 72 : 240) }}
      >
        {!isMobile && (
          <TopBar>
            <MobileMenuBtn onClick={() => setCollapsed(false)}>
              <MenuFoldOutlined />
            </MobileMenuBtn>
          </TopBar>
        )}
        <PageContent>
          <Outlet />
        </PageContent>
        {isMobile && <BottomNav />}
      </MainArea>
    </LayoutWrapper>
  );
}