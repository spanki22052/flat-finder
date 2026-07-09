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
    background-color: ${theme.colors.bg.deep};
    color: ${theme.colors.text.inverse};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
  }

  ::selection {
    background: rgba(159, 161, 255, 0.4);
    color: ${theme.colors.text.primary};
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(159, 161, 255, 0.3);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(159, 161, 255, 0.5);
  }

  :focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
    border-radius: ${theme.radius.sm};
  }

  a {
    color: ${theme.colors.accent.primary};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${theme.colors.accent.secondary};
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

  /* DatePicker time panel — darker hover/focus for dark theme */
  .ant-picker-time-panel-cell .ant-picker-time-panel-cell-inner:hover {
    background: rgba(159, 161, 255, 0.18) !important;
  }
  .ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner,
  .ant-picker-time-panel-cell:focus .ant-picker-time-panel-cell-inner {
    background: rgba(159, 161, 255, 0.32) !important;
    color: #fff !important;
    font-weight: 600;
  }

  /* Select clear icon — white circular background for visibility on dark inputs */
  .ant-select-clear {
    background: #fff !important;
    color: ${theme.colors.bg.deep};
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-select-clear .anticon {
    font-size: 12px;
  }
`;
