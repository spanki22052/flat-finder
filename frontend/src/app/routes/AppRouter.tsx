import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../providers/ProtectedRoute';
import { Layout } from '../../widgets/Layout/Layout';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage';
import { DashboardPage } from '../../pages/DashboardPage/DashboardPage';
import { ApartmentsPage } from '../../pages/ApartmentsPage/ApartmentsPage';
import { ApartmentDetailPage } from '../../pages/ApartmentDetailPage/ApartmentDetailPage';
import { CallsPage } from '../../pages/CallsPage/CallsPage';
import { RemindersPage } from '../../pages/RemindersPage/RemindersPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/apartments" element={<ApartmentsPage />} />
          <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
          <Route path="/calls" element={<CallsPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
