import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthProvider';
import { RoomProvider } from './RoomProvider';
import { GlobalStyles } from '../styles/GlobalStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const antdTheme = {
  token: {
    colorPrimary: '#964325',
    colorPrimaryHover: '#b55b3b',
    colorPrimaryActive: '#7a2f12',
    colorPrimaryBg: '#ffdbcf',
    colorPrimaryBgHover: '#ffb59c',
    colorPrimaryBorder: '#964325',
    colorPrimaryBorderHover: '#b55b3b',

    colorBgBase: '#fff8f5',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#fff8f5',
    colorBgSpotlight: '#fbf2ed',
    colorBgMask: 'rgba(30, 27, 24, 0.45)',

    colorText: '#1e1b18',
    colorTextSecondary: '#55433d',
    colorTextTertiary: '#88726b',
    colorTextQuaternary: '#dbc1b9',
    colorTextHeading: '#1e1b18',
    colorTextLabel: '#55433d',
    colorTextDescription: '#88726b',
    colorTextLightSolid: '#ffffff',

    colorBorder: '#dbc1b9',
    colorBorderSecondary: '#e9e1dc',
    colorSplit: '#f5ece7',

    colorSuccess: '#4f7a52',
    colorWarning: '#7f5214',
    colorError: '#ba1a1a',
    colorInfo: '#3d6b8a',

    colorIcon: '#55433d',
    colorIconHover: '#964325',

    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    fontFamily: "'Montserrat', system-ui, sans-serif",
    wireframe: false,
    boxShadow: '0 8px 32px rgba(150, 67, 37, 0.06)',
    boxShadowSecondary: '0 4px 16px rgba(150, 67, 37, 0.08)',
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 40,
      paddingContentHorizontal: 20,
      fontWeight: 600,
      colorPrimaryHover: '#b55b3b',
      colorPrimaryActive: '#7a2f12',
      defaultBg: '#fbf2ed',
      defaultBorderColor: '#dbc1b9',
      defaultColor: '#1e1b18',
      defaultHoverBg: '#ffdbcf',
      defaultHoverBorderColor: '#964325',
      defaultHoverColor: '#964325',
    },
    Input: {
      borderRadius: 10,
      controlHeight: 44,
      colorBgContainer: '#ffffff',
      colorText: '#1e1b18',
      colorTextPlaceholder: '#88726b',
      activeBorderColor: '#964325',
      hoverBorderColor: '#b55b3b',
      activeShadow: '0 0 0 3px rgba(150, 67, 37, 0.12)',
    },
    InputNumber: {
      borderRadius: 10,
      controlHeight: 44,
      colorText: '#1e1b18',
      colorTextPlaceholder: '#88726b',
    },
    Select: {
      borderRadius: 10,
      controlHeight: 44,
      colorBgContainer: '#ffffff',
      colorText: '#1e1b18',
      colorTextPlaceholder: '#88726b',
      optionSelectedBg: '#ffdbcf',
      optionSelectedColor: '#390c00',
      optionActiveBg: '#fbf2ed',
      colorIcon: '#88726b',
      colorIconHover: '#964325',
    },
    Card: {
      borderRadiusLG: 16,
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorderSecondary: '#e9e1dc',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#fbf2ed',
      headerColor: '#1e1b18',
      headerSortActiveBg: '#ffdbcf',
      headerSortHoverBg: '#f5ece7',
      rowHoverBg: '#fbf2ed',
      colorBgContainer: '#ffffff',
      borderColor: '#e9e1dc',
    },
    Menu: {
      itemBorderRadius: 10,
      itemSelectedBg: '#ffdbcf',
      itemSelectedColor: '#964325',
      itemHoverBg: '#fbf2ed',
      itemHoverColor: '#7a2f12',
      itemColor: '#55433d',
      colorBgContainer: 'transparent',
    },
    Modal: {
      borderRadiusLG: 20,
      colorBgElevated: '#ffffff',
      colorBgModal: '#ffffff',
    },
    Drawer: {
      colorBgElevated: '#ffffff',
    },
    Tag: {
      borderRadiusSM: 9999,
      defaultBg: '#ffdbcf',
      defaultColor: '#390c00',
    },
    Dropdown: {
      colorBgElevated: '#ffffff',
      borderRadiusLG: 12,
      controlItemBgHover: '#fbf2ed',
    },
    Popover: {
      colorBgElevated: '#ffffff',
      borderRadiusLG: 12,
    },
    Tooltip: {
      colorBgSpotlight: '#1e1b18',
      borderRadius: 8,
    },
    DatePicker: {
      borderRadius: 10,
      controlHeight: 44,
      colorBgContainer: '#ffffff',
      colorText: '#1e1b18',
      colorTextPlaceholder: '#88726b',
    },
    Checkbox: {
      borderRadiusSM: 6,
      colorPrimary: '#964325',
      colorPrimaryHover: '#b55b3b',
    },
    Switch: {},
    Tabs: {
      itemColor: '#88726b',
      itemSelectedColor: '#964325',
      itemHoverColor: '#7a2f12',
      inkBarColor: '#964325',
    },
    Pagination: {
      itemActiveBg: '#ffdbcf',
      itemActiveColor: '#964325',
    },
    Segmented: {
      itemSelectedBg: '#ffffff',
      itemSelectedColor: '#964325',
      itemHoverBg: '#fbf2ed',
      itemColor: '#55433d',
      trackBg: '#f5ece7',
    },
    Form: {
      labelColor: '#55433d',
    },
    Descriptions: {
      labelBg: 'transparent',
      titleColor: '#1e1b18',
      labelColor: '#88726b',
      contentColor: '#1e1b18',
    },
    Avatar: {
      colorTextLightSolid: '#ffffff',
    },
    Layout: {
      bodyBg: '#fff8f5',
      headerBg: '#fff8f5',
      siderBg: '#ffffff',
      footerBg: '#fff8f5',
    },
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ruRU} theme={antdTheme}>
        <AntApp>
          <BrowserRouter>
            <AuthProvider>
              <RoomProvider>
                <GlobalStyles />
                {children}
              </RoomProvider>
            </AuthProvider>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}