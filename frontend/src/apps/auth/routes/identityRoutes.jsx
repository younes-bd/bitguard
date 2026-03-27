import React from 'react';
import { Route } from 'react-router-dom';
import IdentityDashboard from '../pages/identity/dashboards/IdentityDashboard';
import UserList from '../pages/identity/UserList';
import RoleList from '../pages/identity/RoleList';

export const identityRoutes = (
    <>
        <Route index element={<IdentityDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="roles" element={<RoleList />} />
        {/* Placeholders for other routes */}
        <Route path="permissions" element={<div className="text-white p-10">Permissions Page Coming Soon</div>} />
        <Route path="audit-logs" element={<div className="text-white p-10">Audit Logs Page Coming Soon</div>} />
        <Route path="settings" element={<div className="text-white p-10">Settings Page Coming Soon</div>} />
    </>
);
