import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: ${theme.fonts.sans};
    background-color: ${theme.colors.bg.surface};
    color: ${theme.colors.text.primary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
  }

  ::selection {
    background: ${theme.colors.primaryFixed};
    color: ${theme.colors.onPrimaryFixed};
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.outlineVariant};
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.outline};
  }

  :focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${theme.radius.sm};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${theme.colors.primaryHover};
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  .ant-btn,
  .ant-btn:focus,
  .ant-btn:hover,
  .ant-btn:active,
  .ant-btn[disabled],
  .ant-btn-dangerous,
  .ant-btn-dangerous:focus,
  .ant-btn-dangerous:hover,
  .ant-btn-dangerous:active {
    box-shadow: none !important;
  }

  /* AntD body/wrapper override — light warm bg */
  .ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover {
    background: ${theme.colors.primaryFixed} !important;
  }
  .ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner,
  .ant-picker-time-panel-cell:focus .ant-picker-time-panel-cell-inner {
    background: ${theme.colors.primary} !important;
    color: ${theme.colors.text.onPrimary} !important;
    font-weight: 600;
  }
`;