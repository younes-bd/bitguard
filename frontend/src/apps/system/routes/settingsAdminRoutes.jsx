import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DocumentLayouts from '../pages/features/DocumentLayoutsPage';
import GeneralSettings from '../pages/settings/GeneralSettingsPage';
import { Outlet } from 'react-router-dom';
import SettingsTopBar from '../components/SettingsTopBar';
import SystemLogs from '../pages/lists/SystemLogsPage';
import SystemEventPage from '../pages/security/SystemEventPage';

import SecurityPolicy from '../pages/settings/SecurityPolicyPage';

import MenuSequenceEditor from '../pages/features/MenuSequenceEditorPage';
import IntegrationKeysPage from '../pages/lists/IntegrationKeysPage';
import BackupsList from '../pages/lists/BackupsListPage';
import SystemParameters from '../pages/lists/SystemParametersPage';

import ScheduledActions from '../pages/lists/ScheduledActionsPage';
import Languages from '../pages/lists/LanguagesPage';
import TranslationsExport from '../pages/features/TranslationsExportPage';
import TranslationsImport from '../pages/features/TranslationsImportPage';

import CompaniesList from '../pages/lists/CompaniesListPage';
import Sequences from '../pages/lists/SequencesPage';
import FinancialSettingsPage from '../pages/settings/FinancialSettingsPage';
import CurrenciesPage from '../pages/lists/CurrenciesPage';

// newly discovered existing pages
import UsersListPage from '../../users/pages/lists/UsersListPage';
import UserGroupsPage from '../../users/pages/lists/UserGroupsPage';
import ActiveSessionsPage from '../../users/pages/lists/ActiveSessionsPage';
import AccessRightsPage from '../../users/pages/lists/AccessRightsPage';
import RecordRulesPage from '../../users/pages/lists/RecordRulesPage';
import OutgoingMailServersPage from '../../inbox/pages/lists/OutgoingMailServersPage';
import IncomingMailServersPage from '../../inbox/pages/lists/IncomingMailServersPage';
import EmailTemplatesPage from '../../inbox/pages/lists/EmailTemplatesPage';
import ChannelsPage from '../../discuss/pages/features/ChannelsPage';
import PortalSettingsPage from '../../portal/pages/PortalSettingsPage';
import WebhooksListPage from '../../automation/pages/lists/WebhooksListPage';

// DYNAMIC SETTINGS REGISTRY (Tier-1 Standard)
const pluginSettingsRoutes = import.meta.glob('../../*/routes/settingsRoutes.jsx', { eager: true });

const SettingsLayout = () => (
    <div className="flex flex-col h-full w-full">
        <SettingsTopBar />
        <div className="flex-1 overflow-auto">
            <Outlet />
        </div>
    </div>
);

export const settingsAdminRoutes = (
  <Route element={<SettingsLayout />}>
    {/* Base System Routes */}
    <Route index element={<Navigate to="general" replace />} />
    <Route path="document-layouts" element={<DocumentLayouts />} />
    <Route path="general" element={<GeneralSettings />} />
    <Route path="profile" element={<Navigate to="/admin/users/profile" replace />} />
    <Route path="system-events" element={<SystemEventPage />} />
    <Route path="server-logs" element={<SystemLogs />} />
    <Route path="security-policy" element={<SecurityPolicy />} />
    <Route path="integration-keys" element={<IntegrationKeysPage />} />
    <Route path="backups" element={<BackupsList />} />
    <Route path="parameters" element={<SystemParameters />} />
    <Route path="menu-sequences" element={<MenuSequenceEditor />} />

    <Route path="scheduled-actions" element={<ScheduledActions />} />
    <Route path="languages" element={<Languages />} />
    <Route path="translations-export" element={<TranslationsExport />} />
    <Route path="translations-import" element={<TranslationsImport />} />

    <Route path="companies" element={<CompaniesList />} />
    <Route path="sequences" element={<Sequences />} />
    <Route path="financial" element={<FinancialSettingsPage />} />
    <Route path="currencies" element={<CurrenciesPage />} />

    {/* Integrated Existing Layer-2 App Pages */}
    <Route path="users" element={<UsersListPage />} />
    <Route path="groups" element={<UserGroupsPage />} />
    <Route path="active-sessions" element={<ActiveSessionsPage />} />
    <Route path="access-rights" element={<AccessRightsPage />} />
    <Route path="record-rules" element={<RecordRulesPage />} />
    <Route path="webhooks" element={<WebhooksListPage />} />
    <Route path="outgoing-mail" element={<OutgoingMailServersPage />} />
    <Route path="incoming-mail" element={<IncomingMailServersPage />} />
    <Route path="email-templates" element={<EmailTemplatesPage />} />
    <Route path="channels" element={<ChannelsPage />} />
    <Route path="portal" element={<PortalSettingsPage />} />

    {/* Dynamically Injected Settings Lists from Business Plugins */}
    {Object.entries(pluginSettingsRoutes).map(([path, mod]) => {
        return mod.default || null;
    })}
  </Route>
);

