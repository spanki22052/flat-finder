import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../providers/ProtectedRoute';
import { RequireRoom } from '../providers/RequireRoom';
import { Layout } from '../../widgets/Layout/Layout';
import { LoginPage } from '../../pages/LoginPage/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage';
import { RoomsPage } from '../../pages/RoomsPage/RoomsPage';
import { RoomManagePage } from '../../pages/RoomManagePage/RoomManagePage';
import { DashboardPage } from '../../pages/DashboardPage/DashboardPage';
import { ApartmentsPage } from '../../pages/ApartmentsPage/ApartmentsPage';
import { ApartmentDetailPage } from '../../pages/ApartmentDetailPage/ApartmentDetailPage';
import { RemindersPage } from '../../pages/RemindersPage/RemindersPage';
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage';
import { TeamPage } from '../../pages/TeamPage/TeamPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route element={<RequireRoom />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms/manage" element={<RoomManagePage />} />
            <Route path="/apartments" element={<ApartmentsPage />} />
            <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="/team" element={<TeamPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
