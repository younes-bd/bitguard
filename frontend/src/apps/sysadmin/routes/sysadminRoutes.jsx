import React from 'react';
import { Route } from 'react-router-dom';
import SysadminDashboard from '../pages/dashboards/SysadminDashboard';
import PlatformSettings from '../pages/settings/PlatformSettings';
import AuditLogList from '../pages/lists/AuditLogList';
import SystemLogs from '../pages/lists/SystemLogs';

import AppInstaller from '../pages/features/AppInstaller';

export const sysadminRoutes = (
  <>
    <Route path="dashboard" element={<SysadminDashboard />} />
    <Route path="apps" element={<AppInstaller />} />
    <Route path="settings" element={<PlatformSettings />} />
    <Route path="logs" element={<AuditLogList />} />
    <Route path="server-logs" element={<SystemLogs />} />
  </>
);
