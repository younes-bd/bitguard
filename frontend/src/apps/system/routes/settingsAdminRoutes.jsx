import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DocumentLayouts from '../pages/features/DocumentLayoutsPage';
import GeneralSettings from '../pages/settings/GeneralSettingsPage';
import SystemLogs from '../pages/lists/SystemLogsPage';
import AuditLogList from '../../core/components/AuditLogList';

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
import CompanyInfo from '../pages/features/CompanyInfoPage';
import Currencies from '../pages/lists/CurrenciesPage';



// DYNAMIC SETTINGS REGISTRY (Tier-1 Standard)
const settingsModules = import.meta.glob('../../*/pages/settings/*Settings*.jsx', { eager: true });
const featureModules = import.meta.glob('../../*/pages/features/*Settings*.jsx', { eager: true });
const pluginSettingsRoutes = import.meta.glob('../../*/routes/settingsRoutes.jsx', { eager: true });
const allDynamicModules = { ...settingsModules, ...featureModules };

export const settingsAdminRoutes = (
  <>
    {/* Base System Routes */}
    <Route index element={<Navigate to="general" replace />} />
    <Route path="document-layouts" element={<DocumentLayouts />} />
    <Route path="general" element={<GeneralSettings />} />
    <Route path="profile" element={<Navigate to="/admin/users/profile" replace />} />
    <Route path="logs" element={<AuditLogList />} />
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
    <Route path="company" element={<CompanyInfo />} />
    <Route path="currencies" element={<Currencies />} />



    {/* Dynamically Injected Settings Lists from Business Plugins */}
    {Object.entries(pluginSettingsRoutes).map(([path, mod]) => {
        return mod.default || null;
    })}

    {/* Dynamic App Settings Pages */}
    {Object.entries(allDynamicModules).map(([path, mod]) => {
        const appName = path.split('/')[2];
        if (['system', 'core', 'auth', 'reports', 'inbox', 'users'].includes(appName)) return null;

        const Component = Object.values(mod)[0] || mod.default;
        if (!Component) return null;
        
        return <Route key={`settings-${appName}`} path={appName} element={<Component />} />;
    })}
  </>
);
