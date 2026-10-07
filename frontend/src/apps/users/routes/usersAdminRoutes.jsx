import React from 'react';
import { Route } from 'react-router-dom';

// Users Pages
import UsersDashboard from '../pages/dashboards/UsersDashboardPage';
import UserList from '../pages/lists/UserListPage';
import RoleList from '../pages/lists/RoleListPage';
import PermissionsList from '../pages/lists/PermissionsListPage';
import MfaManagement from '../pages/settings/MfaManagementPage';
import PersonalAccessTokens from '../pages/settings/PersonalAccessTokensPage';
import ActiveSessions from '../pages/lists/ActiveSessionsPage';
// import UsersSettings from '../pages/settings/UsersSettingsPage';
import TenantList from '../pages/lists/TenantListPage';
import UserProfile from '../pages/profile/UserProfilePage';
import AccessRightsPage from '../pages/lists/AccessRightsPage';
import RecordRulesPage from '../pages/lists/RecordRulesPage';

export const usersAdminRoutes = (
    <>
        <Route index element={<UsersDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="roles" element={<RoleList />} />
        <Route path="permissions" element={<PermissionsList />} />
        <Route path="mfa" element={<MfaManagement />} />
        <Route path="personal-access-tokens" element={<PersonalAccessTokens />} />
        <Route path="sessions" element={<ActiveSessions />} />
        {/* <Route path="settings" element={<UsersSettings />} /> */}
        <Route path="tenants" element={<TenantList />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="access-rights" element={<AccessRightsPage />} />
        <Route path="record-rules" element={<RecordRulesPage />} />
    </>
);
