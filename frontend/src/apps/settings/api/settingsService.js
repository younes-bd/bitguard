import apiClient from '../../../core/api/client';

export const settingsService = {
  // System Settings
  getSettings: (params) => apiClient.get('base_setup/settings/', { params }),
  getSetting: (id) => apiClient.get(`base_setup/settings/${id}/`),
  updateSetting: (id, data) => apiClient.put(`base_setup/settings/${id}/`, data),
  batchUpdateSettings: (settings) => apiClient.post('base_setup/settings/batch_update/', { settings }),
  
  // Tenant Settings
  getMyCompany: () => apiClient.get('tenants/my_company/'),
  updateMyCompany: (data) => apiClient.patch('tenants/my_company/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Email Configuration
  getEmailConfig: () => apiClient.get('base_setup/email-config/'),
  saveEmailConfig: (data) => apiClient.post('base_setup/email-config/', data),
  testEmail: (data) => apiClient.post('base_setup/email-config/test/', data),
  
  // Audit Logs
  getAuditLogs: (params) => apiClient.get('base_setup/audit-logs/', { params }),
  getAuditLog: (id) => apiClient.get(`base_setup/audit-logs/${id}/`),
  
  // System Metrics
  getSystemMetrics: () => apiClient.get('base_setup/settings/metrics/'),

  // Platform Actions
  clearCache: () => apiClient.post('base_setup/settings/clear_cache/'),
  syncIndexes: () => apiClient.post('base_setup/settings/sync_indexes/'),
  toggleMaintenance: () => apiClient.post('base_setup/settings/toggle_maintenance/'),

  // Reports
  generateReport: () => apiClient.get('base_setup/settings/generate_report/', { responseType: 'blob' }),
  exportAuditLogs: (params) => apiClient.get('base_setup/audit-logs/export_csv/', { params, responseType: 'blob' }),

  // API Keys
  getApiKeys: () => apiClient.get('base_setup/api-keys/'),
  createApiKey: (data) => apiClient.post('base_setup/api-keys/', data),
  deleteApiKey: (id) => apiClient.delete(`base_setup/api-keys/${id}/`),

  // Webhooks
  getWebhooks: () => apiClient.get('base_setup/webhooks/'),
  createWebhook: (data) => apiClient.post('base_setup/webhooks/', data),
  deleteWebhook: (id) => apiClient.delete(`base_setup/webhooks/${id}/`),
  testWebhook: (id) => apiClient.post(`base_setup/webhooks/${id}/test/`),

  // Backups & Retention
  getBackups: () => apiClient.get('base_setup/backups/'),
  triggerBackup: () => apiClient.post('base_setup/backups/trigger/'),
  pruneAuditLogs: (days) => apiClient.post('base_setup/audit-logs/prune/', { days }),

  // System Logs (Raw)
  getServerLogs: () => apiClient.get('base_setup/settings/server_logs/'),

  // Scheduled Actions
  getScheduledActions: () => apiClient.get('base_setup/scheduled-actions/'),
  toggleScheduledAction: (id, isActive) => apiClient.patch(`base_setup/scheduled-actions/${id}/`, { is_active: isActive }),
  runScheduledAction: (id) => apiClient.post(`base_setup/scheduled-actions/${id}/run/`),
  deleteScheduledAction: (id) => apiClient.delete(`base_setup/scheduled-actions/${id}/`),
  createScheduledAction: (data) => apiClient.post('base_setup/scheduled-actions/', data),
  updateScheduledAction: (id, data) => apiClient.put(`base_setup/scheduled-actions/${id}/`, data),

  // Languages
  getLanguages: () => apiClient.get('base_setup/languages/'),
  createLanguage: (data) => apiClient.post('base_setup/languages/', data),
  updateLanguage: (id, data) => apiClient.patch(`base_setup/languages/${id}/`, data),
  deleteLanguage: (id) => apiClient.delete(`base_setup/languages/${id}/`),
  setDefaultLanguage: (id) => apiClient.post(`base_setup/languages/${id}/set_default/`),

  // Outgoing Mail Servers (SMTP)
  getOutgoingMailServers: () => apiClient.get('base_setup/mail-servers-outgoing/'),
  createOutgoingMailServer: (data) => apiClient.post('base_setup/mail-servers-outgoing/', data),
  updateOutgoingMailServer: (id, data) => apiClient.patch(`base_setup/mail-servers-outgoing/${id}/`, data),
  deleteOutgoingMailServer: (id) => apiClient.delete(`base_setup/mail-servers-outgoing/${id}/`),
  testOutgoingMailServer: (id) => apiClient.post(`base_setup/mail-servers-outgoing/${id}/test/`),

  // Incoming Mail Servers (IMAP/POP3)
  getIncomingMailServers: () => apiClient.get('base_setup/mail-servers-incoming/'),
  createIncomingMailServer: (data) => apiClient.post('base_setup/mail-servers-incoming/', data),
  updateIncomingMailServer: (id, data) => apiClient.patch(`base_setup/mail-servers-incoming/${id}/`, data),
  deleteIncomingMailServer: (id) => apiClient.delete(`base_setup/mail-servers-incoming/${id}/`),
  fetchMailNow: (id) => apiClient.post(`base_setup/mail-servers-incoming/${id}/fetch_now/`),

  // Email Templates
  getEmailTemplates: (params) => apiClient.get('base_setup/email-templates/', { params }),
  getEmailTemplate: (id) => apiClient.get(`base_setup/email-templates/${id}/`),
  createEmailTemplate: (data) => apiClient.post('base_setup/email-templates/', data),
  updateEmailTemplate: (id, data) => apiClient.put(`base_setup/email-templates/${id}/`, data),
  deleteEmailTemplate: (id) => apiClient.delete(`base_setup/email-templates/${id}/`),
  testEmailTemplate: (id, data) => apiClient.post(`base_setup/email-templates/${id}/send_test/`, data),

  // Sequences (Document Numbering)
  getSequences: (params) => apiClient.get('core/sequences/', { params }),
  getSequence: (id) => apiClient.get(`core/sequences/${id}/`),
  createSequence: (data) => apiClient.post('core/sequences/', data),
  updateSequence: (id, data) => apiClient.put(`core/sequences/${id}/`, data),
  deleteSequence: (id) => apiClient.delete(`core/sequences/${id}/`)
};
