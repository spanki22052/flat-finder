import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthProvider';
import { GlobalStyles } from '../styles/GlobalStyles';

dayjs.locale('ru');

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
    // Primary colors from palette
    colorPrimary: '#9FA1FF',
    colorBgBase: '#2a2318',
    colorBgContainer: '#352f24',
    colorBgElevated: '#403930',
    colorBgSpotlight: 'rgba(159,161,255,0.15)',
    colorText: '#FFEED6',
    colorTextSecondary: '#b8a990',
    colorTextTertiary: '#8a7d68',
    colorTextQuaternary: '#FFEED6',
    colorBorder: 'rgba(255,238,214,0.12)',
    colorBorderSecondary: 'rgba(255,238,214,0.08)',
    colorSuccess: '#9FA1FF',
    colorWarning: '#C1EBE9',
    colorError: '#fb7185',
    colorIcon: '#FFEED6',
    colorIconHover: '#B5BAFF',
    borderRadius: 10,
    fontFamily: "'Inter', system-ui, sans-serif",
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      paddingContentHorizontal: 20,
      colorPrimaryHover: '#B5BAFF',
      colorPrimaryActive: '#D9F9DF',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#352f24',
      colorText: '#FFFFFF',
      colorTextPlaceholder: 'rgba(255,255,255,0.45)',
      activeBorderColor: '#9FA1FF',
      hoverBorderColor: '#B5BAFF',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#352f24',
      colorText: '#FFFFFF',
      colorTextPlaceholder: 'rgba(255,255,255,0.45)',
      optionSelectedBg: 'rgba(159,161,255,0.2)',
      colorIcon: '#FFEED6',
      colorIconHover: '#B5BAFF',
    },
    Card: {
      borderRadiusLG: 16,
      colorBgContainer: '#352f24',
      colorBgElevated: '#403930',
    },
    Table: {
      borderRadius: 12,
      headerBg: 'rgba(159,161,255,0.08)',
      headerColor: '#FFEED6',
      rowHoverBg: 'rgba(159,161,255,0.06)',
      colorBgContainer: '#352f24',
    },
    Menu: {
      itemBorderRadius: 8,
      itemSelectedBg: 'rgba(159,161,255,0.15)',
      itemSelectedColor: '#B5BAFF',
      itemHoverBg: 'rgba(193,235,233,0.1)',
      itemHoverColor: '#C1EBE9',
      colorBgContainer: 'transparent',
      darkItemColor: '#b8a990',
      darkItemSelectedColor: '#FFEED6',
    },
    Modal: {
      borderRadiusLG: 20,
      colorBgElevated: '#352f24',
      colorBgModal: '#2a2318',
    },
    Drawer: {
      colorBgElevated: '#352f24',
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Dropdown: {
      colorBgElevated: '#352f24',
    },
    Popover: {
      colorBgElevated: '#352f24',
    },
    Tooltip: {
      colorBgSpotlight: '#403930',
    },
    InputNumber: {
      controlHeight: 40,
      borderRadius: 8,
      colorText: '#FFFFFF',
      colorTextPlaceholder: 'rgba(255,255,255,0.45)',
    },
    DatePicker: {
      borderRadius: 8,
      controlHeight: 40,
      colorBgContainer: '#352f24',
      colorText: '#FFFFFF',
      colorTextPlaceholder: 'rgba(255,255,255,0.45)',
    },
    Checkbox: {
      borderRadiusSM: 4,
    },
    Switch: {},
    Tabs: {
      itemColor: '#b8a990',
      itemSelectedColor: '#FFEED6',
      itemHoverColor: '#C1EBE9',
      inkBarColor: '#9FA1FF',
    },
    Pagination: {
      itemActiveBg: 'rgba(159,161,255,0.15)',
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
              <GlobalStyles />
              {children}
            </AuthProvider>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}