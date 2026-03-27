import React from 'react';
import { Route } from 'react-router-dom';
import SysadminDashboard from '../pages/SysadminDashboard';
import PlatformSettings from '../pages/PlatformSettings';
import SystemLogs from '../pages/SystemLogs';

export const sysadminRoutes = (
  <>
    <Route path="dashboard" element={<SysadminDashboard />} />
    <Route path="settings" element={<PlatformSettings />} />
    <Route path="logs" element={<SystemLogs />} />
  </>
);
