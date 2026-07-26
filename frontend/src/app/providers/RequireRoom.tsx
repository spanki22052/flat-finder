import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useRoom } from './RoomProvider';

export function RequireRoom() {
  const { currentRoomId, isLoading } = useRoom();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentRoomId) {
    return <Navigate to="/rooms" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
