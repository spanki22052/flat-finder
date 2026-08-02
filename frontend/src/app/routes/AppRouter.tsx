import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../providers/ProtectedRoute';
import { RequireRoom } from '../providers/RequireRoom';
import { Layout } from '../../widgets/Layout/Layout';
import { LoginPage } from '../../pages/LoginPage/ui/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage/ui/RegisterPage';
import { RoomsPage } from '../../pages/RoomsPage/ui/RoomsPage';
import { RoomManagePage } from '../../pages/RoomManagePage/ui/RoomManagePage';
import { DashboardPage } from '../../pages/DashboardPage/ui/DashboardPage';
import { ApartmentsPage } from '../../pages/ApartmentsPage/ui/ApartmentsPage';
import { ApartmentDetailPage } from '../../pages/ApartmentDetailPage/ui/ApartmentDetailPage';
import { ImportPage } from '../../pages/ImportPage/ui/ImportPage';
import { RemindersPage } from '../../pages/RemindersPage/ui/RemindersPage';
import { ProfilePage } from '../../pages/ProfilePage/ui/ProfilePage';
import { TeamPage } from '../../pages/TeamPage/ui/TeamPage';

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
            <Route path="/import" element={<ImportPage />} />
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
