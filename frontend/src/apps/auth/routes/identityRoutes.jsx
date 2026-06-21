import React from 'react';
import { Route } from 'react-router-dom';

// IAM Pages
import SecurityDashboard from '../../users/pages/dashboards/SecurityDashboard';
import AuditLogList from '../../sysadmin/pages/lists/AuditLogList';
import UserList from '../pages/identity/UserList';
import RoleList from '../pages/identity/RoleList';
import PermissionsList from '../pages/identity/PermissionsList';
import MfaManagement from '../pages/identity/MfaManagement';
import ApiKeyManagement from '../pages/identity/ApiKeyManagement';
import ActiveSessions from '../pages/identity/ActiveSessions';
import IamSettings from '../pages/identity/IamSettings';
import TenantList from '../pages/identity/TenantList';

export const identityRoutes = (
    <>
        <Route index element={<SecurityDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="roles" element={<RoleList />} />
        <Route path="permissions" element={<PermissionsList />} />
        <Route path="audit" element={<AuditLogList />} />
        <Route path="mfa" element={<MfaManagement />} />
        <Route path="api-keys" element={<ApiKeyManagement />} />
        <Route path="sessions" element={<ActiveSessions />} />
        <Route path="settings" element={<IamSettings />} />
        <Route path="tenants" element={<TenantList />} />
    </>
);
