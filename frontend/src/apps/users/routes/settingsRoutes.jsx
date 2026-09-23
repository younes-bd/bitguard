import React from 'react';
import { Route } from 'react-router-dom';
import UsersList from '../pages/lists/UsersListPage';
import UserGroups from '../pages/lists/UserGroupsPage';
import AccessRights from '../pages/lists/AccessRightsPage';
import RecordRules from '../pages/lists/RecordRulesPage';

export default [
    <Route key="users" path="users" element={<UsersList />} />,
    <Route key="user-groups" path="groups" element={<UserGroups />} />,
    <Route key="access-rights" path="access-rights" element={<AccessRights />} />,
    <Route key="record-rules" path="record-rules" element={<RecordRules />} />
];
