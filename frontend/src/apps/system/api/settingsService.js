import apiClient from '@/core/api/client';

export const settingsService = {
  // Modules
  getModules: () => apiClient.get('system/modules/'),
  getModule: (id) => apiClient.get(`system/modules/${id}/`),
  updateModuleList: () => apiClient.post('system/modules/update_list/'),
  installModule: (id) => apiClient.post(`system/modules/${id}/install/`),
  uninstallModule: (id) => apiClient.post(`system/modules/${id}/uninstall/`),
  upgradeModule: (id) => apiClient.post(`system/modules/${id}/upgrade/`),
  // System Settings
  getSettings: (params) => apiClient.get('system/settings/', { params }),
  getSetting: (id) => apiClient.get(`system/settings/${id}/`),
  updateSetting: (id, data) => apiClient.put(`system/settings/${id}/`, data),
  batchUpdateSettings: (settings) => apiClient.post('system/settings/batch_update/', { settings }),
  
  // Tenant Settings
  getMyCompany: () => apiClient.get('tenants/my-company/'),
  updateMyCompany: (data) => apiClient.patch('tenants/my-company/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Email Configuration
  getEmailConfig: () => apiClient.get('system/email-config/'),
  saveEmailConfig: (data) => apiClient.post('system/email-config/', data),
  testEmail: (data) => apiClient.post('system/email-config/test/', data),
  
  // Audit Logs
  getAuditLogs: (params) => apiClient.get('system/audit-logs/', { params }),
  getAuditLog: (id) => apiClient.get(`system/audit-logs/${id}/`),
  
  // System Metrics
  getSystemMetrics: () => apiClient.get('system/settings/metrics/'),

  // Platform Actions
  clearCache: () => apiClient.post('system/settings/clear_cache/'),
  syncIndexes: () => apiClient.post('system/settings/sync_indexes/'),
  toggleMaintenance: () => apiClient.post('system/settings/toggle_maintenance/'),

  // Reports
  generateReport: () => apiClient.get('system/settings/generate_report/', { responseType: 'blob' }),
  exportAuditLogs: (params) => apiClient.get('system/audit-logs/export_csv/', { params, responseType: 'blob' }),

  // API Keys
  getApiKeys: () => apiClient.get('system/api-keys/'),
  createApiKey: (data) => apiClient.post('system/api-keys/', data),
  deleteApiKey: (id) => apiClient.delete(`system/api-keys/${id}/`),

  // Webhooks
  getWebhooks: () => apiClient.get('system/webhooks/'),
  createWebhook: (data) => apiClient.post('system/webhooks/', data),
  deleteWebhook: (id) => apiClient.delete(`system/webhooks/${id}/`),
  testWebhook: (id) => apiClient.post(`system/webhooks/${id}/test/`),

  // Backups & Retention
  getBackups: () => apiClient.get('system/backups/'),
  triggerBackup: () => apiClient.post('system/backups/trigger/'),
  pruneAuditLogs: (days) => apiClient.post('system/audit-logs/prune/', { days }),

  // System Logs (Raw)
  getServerLogs: () => apiClient.get('system/settings/server_logs/'),

  // Scheduled Actions
  getScheduledActions: () => apiClient.get('system/scheduled-actions/'),
  toggleScheduledAction: (id, isActive) => apiClient.patch(`system/scheduled-actions/${id}/`, { is_active: isActive }),
  runScheduledAction: (id) => apiClient.post(`system/scheduled-actions/${id}/run/`),
  deleteScheduledAction: (id) => apiClient.delete(`system/scheduled-actions/${id}/`),
  createScheduledAction: (data) => apiClient.post('system/scheduled-actions/', data),
  updateScheduledAction: (id, data) => apiClient.put(`system/scheduled-actions/${id}/`, data),

  // Languages
  getLanguages: () => apiClient.get('system/languages/'),
  createLanguage: (data) => apiClient.post('system/languages/', data),
  updateLanguage: (id, data) => apiClient.patch(`system/languages/${id}/`, data),
  deleteLanguage: (id) => apiClient.delete(`system/languages/${id}/`),
  setDefaultLanguage: (id) => apiClient.post(`system/languages/${id}/set_default/`),

  // Outgoing Mail Servers (SMTP)
  getOutgoingMailServers: () => apiClient.get('system/mail-servers-outgoing/'),
  createOutgoingMailServer: (data) => apiClient.post('system/mail-servers-outgoing/', data),
  updateOutgoingMailServer: (id, data) => apiClient.patch(`system/mail-servers-outgoing/${id}/`, data),
  deleteOutgoingMailServer: (id) => apiClient.delete(`system/mail-servers-outgoing/${id}/`),
  testOutgoingMailServer: (id) => apiClient.post(`system/mail-servers-outgoing/${id}/test/`),

  // Incoming Mail Servers (IMAP/POP3)
  getIncomingMailServers: () => apiClient.get('system/mail-servers-incoming/'),
  createIncomingMailServer: (data) => apiClient.post('system/mail-servers-incoming/', data),
  updateIncomingMailServer: (id, data) => apiClient.patch(`system/mail-servers-incoming/${id}/`, data),
  deleteIncomingMailServer: (id) => apiClient.delete(`system/mail-servers-incoming/${id}/`),
  fetchMailNow: (id) => apiClient.post(`system/mail-servers-incoming/${id}/fetch_now/`),

  // Email Templates
  getEmailTemplates: (params) => apiClient.get('system/email-templates/', { params }),
  getEmailTemplate: (id) => apiClient.get(`system/email-templates/${id}/`),
  createEmailTemplate: (data) => apiClient.post('system/email-templates/', data),
  updateEmailTemplate: (id, data) => apiClient.put(`system/email-templates/${id}/`, data),
  deleteEmailTemplate: (id) => apiClient.delete(`system/email-templates/${id}/`),
  testEmailTemplate: (id, data) => apiClient.post(`system/email-templates/${id}/send_test/`, data),

  // Sequences (Document Numbering)
  getSequences: (params) => apiClient.get('core/sequences/', { params }),
  getSequence: (id) => apiClient.get(`core/sequences/${id}/`),
  createSequence: (data) => apiClient.post('core/sequences/', data),
  updateSequence: (id, data) => apiClient.put(`core/sequences/${id}/`, data),
  deleteSequence: (id) => apiClient.delete(`core/sequences/${id}/`),

  // User Groups (Roles)
  getUserGroups: () => apiClient.get('users/roles/'),
  createUserGroup: (data) => apiClient.post('users/roles/', data),
  updateUserGroup: (id, data) => apiClient.patch(`users/roles/${id}/`, data),
  deleteUserGroup: (id) => apiClient.delete(`users/roles/${id}/`),

  // Access Rights (Role Permissions)
  getAccessRights: (params) => apiClient.get('users/role-permissions/', { params }),
  getContentTypes: () => apiClient.get('users/content-types/'),
  createAccessRight: (data) => apiClient.post('users/role-permissions/', data),
  updateAccessRight: (id, data) => apiClient.patch(`users/role-permissions/${id}/`, data),
  deleteAccessRight: (id) => apiClient.delete(`users/role-permissions/${id}/`),

  // Record Rules
  getRecordRules: (params) => apiClient.get('users/record-rules/', { params }),
  createRecordRule: (data) => apiClient.post('users/record-rules/', data),
  updateRecordRule: (id, data) => apiClient.patch(`users/record-rules/${id}/`, data),
  deleteRecordRule: (id) => apiClient.delete(`users/record-rules/${id}/`),

  // Automated Actions (base.automation equivalent)
  getAutomatedActions: (params) => apiClient.get('system/automated-actions/', { params }),
  getAutomatedAction: (id) => apiClient.get(`system/automated-actions/${id}/`),
  createAutomatedAction: (data) => apiClient.post('system/automated-actions/', data),
  updateAutomatedAction: (id, data) => apiClient.put(`system/automated-actions/${id}/`, data),
  deleteAutomatedAction: (id) => apiClient.delete(`system/automated-actions/${id}/`),
  toggleAutomatedAction: (id, isActive) => apiClient.patch(`system/automated-actions/${id}/`, { is_active: isActive }),
  runAutomatedAction: (id) => apiClient.post(`system/automated-actions/${id}/run/`),
  
  // Reports
  getReports: (params) => apiClient.get('system/reports/', { params })
};
