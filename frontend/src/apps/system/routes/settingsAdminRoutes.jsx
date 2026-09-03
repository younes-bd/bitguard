import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import SettingsDashboard from '../pages/dashboards/SettingsDashboard';
import GeneralSettings from '../pages/settings/GeneralSettings';
import AuditLogList from '../pages/lists/AuditLogList';
import SystemLogs from '../pages/lists/SystemLogs';

import CRMSettings from '../../crm/pages/settings/CrmSettings_new';
import SalesSettings from "../../sale/pages/settings/SalesSettings";
import AccountingSettings from '../../accounting/pages/settings/AccountingSettings';
import InventorySettings from '../../stock/pages/settings/InventorySettings_new';
import ManufacturingSettings from '../../mrp/pages/settings/ManufacturingSettings';
import WebsiteSettings from '../../website/pages/settings/WebsiteSettings';

import UsersList from '../pages/lists/UsersList';
import CompaniesList from '../pages/lists/CompaniesList';
import ScheduledActions from '../pages/lists/ScheduledActions';
import Languages from '../pages/lists/Languages';

import UserGroups from '../pages/lists/UserGroups';
import AccessRights from '../pages/lists/AccessRights';
import OutgoingMailServers from '../pages/lists/OutgoingMailServers';
import IncomingMailServers from '../pages/lists/IncomingMailServers';
import Sequences from '../pages/lists/Sequences';
import ServerActions from '../pages/lists/ServerActions';
import RecordRules from '../pages/lists/RecordRules';
import EmailTemplates from '../pages/lists/EmailTemplates';
import SecurityPolicy from '../pages/settings/SecurityPolicy';
import AutomationsSettings from '../pages/settings/AutomationsSettings';

import TranslationsExport from '../pages/features/TranslationsExport';
import TranslationsImport from '../pages/features/TranslationsImport';
import MenuSequenceEditor from '../pages/features/MenuSequenceEditor';
import ReportsList from '../pages/lists/ReportsList';
import ReportTagsList from '../pages/lists/ReportTagsList';
import MailAliasesList from '../pages/lists/MailAliasesList';
import APIKeysList from '../pages/lists/APIKeysList';
import WebhooksList from '../pages/lists/WebhooksList';
import PrintFormats from '../../reporting/pages/settings/PrintFormats';
import PaymentSettings from '../pages/settings/PaymentSettings';
import NotificationSettings from '../pages/settings/NotificationSettings';
import IntegrationSettings from '../pages/settings/IntegrationSettings';
import SystemParameters from '../pages/lists/SystemParameters';
import AgentDashboard from '../../ai_agent/pages/dashboards/AgentDashboard';

export const settingsAdminRoutes = (
  <>
        <Route index element={<SettingsDashboard />} />
    <Route path="general" element={<GeneralSettings />} />
    <Route path="crm" element={<CRMSettings />} />
    <Route path="sales" element={<SalesSettings />} />
    <Route path="accounting" element={<AccountingSettings />} />
    <Route path="inventory" element={<InventorySettings />} />
    <Route path="manufacturing" element={<ManufacturingSettings />} />
    <Route path="website" element={<WebsiteSettings />} />
    <Route path="profile" element={<Navigate to="/admin/users/profile" replace />} />
    <Route path="users" element={<UsersList />} />
    <Route path="companies" element={<CompaniesList />} />
    <Route path="languages" element={<Languages />} />
    <Route path="scheduled-actions" element={<ScheduledActions />} />
    <Route path="logs" element={<AuditLogList />} />
    <Route path="audit" element={<AuditLogList />} />
    <Route path="server-logs" element={<SystemLogs />} />
    <Route path="print-formats" element={<PrintFormats />} />
    
    <Route path="groups" element={<UserGroups />} />
    <Route path="access-rights" element={<AccessRights />} />
    <Route path="outgoing-mail-servers" element={<OutgoingMailServers />} />
    <Route path="incoming-mail-servers" element={<IncomingMailServers />} />
    <Route path="sequences" element={<Sequences />} />
    <Route path="automated-actions" element={<ServerActions />} />
    <Route path="record-rules" element={<RecordRules />} />
    <Route path="email-templates" element={<EmailTemplates />} />
    <Route path="security-policy" element={<SecurityPolicy />} />
    <Route path="automations" element={<AutomationsSettings />} />
    <Route path="payment" element={<PaymentSettings />} />
    <Route path="notifications" element={<NotificationSettings />} />
    <Route path="integrations" element={<IntegrationSettings />} />
    <Route path="parameters" element={<SystemParameters />} />
    <Route path="virtual-agents" element={<AgentDashboard />} />
    
    <Route path="translations-export" element={<TranslationsExport />} />
    <Route path="translations-import" element={<TranslationsImport />} />
    <Route path="reports" element={<ReportsList />} />
    <Route path="report-tags" element={<ReportTagsList />} />
    <Route path="mail-aliases" element={<MailAliasesList />} />
    <Route path="api-keys" element={<APIKeysList />} />
    <Route path="webhooks" element={<WebhooksList />} />
    <Route path="menu-sequences" element={<MenuSequenceEditor />} />

  </>
);

