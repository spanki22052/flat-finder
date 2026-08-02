import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/config/dayjs';
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/routes/AppRouter';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);
