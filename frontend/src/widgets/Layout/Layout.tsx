import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { AuroraBackground } from './components/AuroraBackground';
import { LayoutSidebar } from './components/LayoutSidebar';
import { theme } from '../../app/styles/theme';
import { MenuFoldOutlined } from '@ant-design/icons';
import {
  LayoutWrapper, MainArea, TopBar, MobileMenuBtn, PageContent,
} from './styled';

const { Header, Content } = AntLayout;

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutWrapper>
      <AuroraBackground />
      <LayoutSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <MainArea style={{ marginLeft: collapsed ? 72 : 240 }}>
        <TopBar>
          <MobileMenuBtn onClick={() => setCollapsed(false)}>
            <MenuFoldOutlined />
          </MobileMenuBtn>
        </TopBar>
        <PageContent>
          <Outlet />
        </PageContent>
      </MainArea>
    </LayoutWrapper>
  );
}
