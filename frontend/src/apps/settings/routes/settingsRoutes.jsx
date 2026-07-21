import React from 'react';
import { Route } from 'react-router-dom';
import SettingsDashboard from '../pages/dashboards/SettingsDashboard';
import GeneralSettings from '../pages/settings/GeneralSettings';
import AuditLogList from '../pages/lists/AuditLogList';
import SystemLogs from '../pages/lists/SystemLogs';
import PlaceholderPage from '../../../core/components/PlaceholderPage';

import AppInstaller from '../pages/features/AppInstaller';

import ErpSettings from '../pages/settings/ErpSettings';
import UsersList from '../pages/lists/UsersList';
import CompaniesList from '../pages/lists/CompaniesList';
import ScheduledActions from '../pages/lists/ScheduledActions';
import Languages from '../pages/lists/Languages';
import UserProfile from '../../users/pages/profile/UserProfile';

import UserGroups from '../pages/lists/UserGroups';
import AccessRights from '../pages/lists/AccessRights';
import OutgoingMailServers from '../pages/lists/OutgoingMailServers';
import IncomingMailServers from '../pages/lists/IncomingMailServers';
import Sequences from '../pages/lists/Sequences';
import ServerActions from '../pages/lists/ServerActions';
import RecordRules from '../pages/lists/RecordRules';
import EmailTemplates from '../pages/lists/EmailTemplates';
import SecurityPolicy from '../pages/settings/SecurityPolicy';

export const settingsRoutes = (
  <>
    <Route path="general" element={<GeneralSettings />} />
    <Route path="erp-settings" element={<ErpSettings />} />
    <Route path="crm" element={<ErpSettings />} />
    <Route path="sales" element={<ErpSettings />} />
    <Route path="accounting" element={<ErpSettings />} />
    <Route path="inventory" element={<ErpSettings />} />
    <Route path="manufacturing" element={<ErpSettings />} />
    <Route path="website" element={<ErpSettings />} />
    <Route path="profile" element={<UserProfile />} />
    <Route path="users" element={<UsersList />} />
    <Route path="companies" element={<CompaniesList />} />
    <Route path="languages" element={<Languages />} />
    <Route path="scheduled-actions" element={<ScheduledActions />} />
    <Route path="logs" element={<AuditLogList />} />
    <Route path="server-logs" element={<SystemLogs />} />
    
    <Route path="groups" element={<UserGroups />} />
    <Route path="access-rights" element={<AccessRights />} />
    <Route path="email-servers-outgoing" element={<OutgoingMailServers />} />
    <Route path="email-servers-incoming" element={<IncomingMailServers />} />
    <Route path="sequences" element={<Sequences />} />
    <Route path="server-actions" element={<ServerActions />} />
    <Route path="record-rules" element={<RecordRules />} />
    <Route path="email-templates" element={<EmailTemplates />} />
    <Route path="security-policy" element={<SecurityPolicy />} />
    <Route path="translations-export" element={<PlaceholderPage title="Export Translations" />} />
    <Route path="translations-import" element={<PlaceholderPage title="Import Translations" />} />
    <Route path="reports" element={<PlaceholderPage title="Reports" />} />
    <Route path="report-tags" element={<PlaceholderPage title="Report Tags" />} />
    <Route path="mail-aliases" element={<PlaceholderPage title="Mail Aliases" />} />
  </>
);
