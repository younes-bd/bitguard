import React from 'react';
import { Route } from 'react-router-dom';
import UsersList from '../pages/lists/UsersListPage';
import UserGroups from '../pages/lists/UserGroupsPage';
import AccessRights from '../pages/lists/AccessRightsPage';
import RecordRules from '../pages/lists/RecordRulesPage';
import ActiveSessions from '../pages/lists/ActiveSessionsPage';
import PersonalAccessTokens from '../pages/settings/PersonalAccessTokensPage';

export default [
    <Route key="users" path="users" element={<UsersList />} />,
    <Route key="user-groups" path="groups" element={<UserGroups />} />,
    <Route key="access-rights" path="access-rights" element={<AccessRights />} />,
    <Route key="record-rules" path="record-rules" element={<RecordRules />} />,
    <Route key="active-sessions" path="active-sessions" element={<ActiveSessions />} />,
    <Route key="personal-access-tokens" path="personal-access-tokens" element={<PersonalAccessTokens />} />
];
