import React from 'react';
import { Route } from 'react-router-dom';
import { Shield, Activity, Settings } from 'lucide-react';
import IdentityDashboard from '../pages/identity/dashboards/IdentityDashboard';
import UserList from '../pages/identity/UserList';
import RoleList from '../pages/identity/RoleList';

import PermissionsList from '../pages/identity/PermissionsList';
import AuditLogs from '../pages/identity/AuditLogs';
import SecuritySettings from '../pages/identity/SecuritySettings';

export const identityRoutes = (
    <>
        <Route index element={<IdentityDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="roles" element={<RoleList />} />
        
        <Route path="permissions" element={<PermissionsList />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<SecuritySettings />} />
    </>
);
