import React from 'react';
import { Route } from 'react-router-dom';

// Users Pages
import UsersDashboard from '../pages/dashboards/UsersDashboard';
import UserList from '../pages/lists/UserList';
import RoleList from '../pages/lists/RoleList';
import PermissionsList from '../pages/lists/PermissionsList';
import AuditLogPage from '../pages/lists/AuditLogPage';
import MfaManagement from '../pages/settings/MfaManagement';
import ApiKeyManagement from '../pages/settings/ApiKeyManagement';
import ActiveSessions from '../pages/lists/ActiveSessions';
import UsersSettings from '../pages/settings/UsersSettings';
import TenantList from '../pages/lists/TenantList';
import UserProfile from '../pages/profile/UserProfile';

export const usersAdminRoutes = (
    <>
        <Route index element={<UsersDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="roles" element={<RoleList />} />
        <Route path="permissions" element={<PermissionsList />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="mfa" element={<MfaManagement />} />
        <Route path="api-keys" element={<ApiKeyManagement />} />
        <Route path="sessions" element={<ActiveSessions />} />
        <Route path="settings" element={<UsersSettings />} />
        <Route path="tenants" element={<TenantList />} />
        <Route path="profile" element={<UserProfile />} />
    </>
);
