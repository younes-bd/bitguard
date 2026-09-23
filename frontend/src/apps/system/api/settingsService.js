import apiClient from '@/core/api/client';

export const settingsService = {
  // Modules
  getModules: () => apiClient.get('core/modules/'),
  getModule: (id) => apiClient.get(`core/modules/${id}/`),
  updateModuleList: () => apiClient.post('core/modules/update_list/'),
  installModule: (id) => apiClient.post(`core/modules/${id}/install/`),
  uninstallModule: (id) => apiClient.post(`core/modules/${id}/uninstall/`),
  upgradeModule: (id) => apiClient.post(`core/modules/${id}/upgrade/`),

  // System Settings (now System Parameters in core)
  getSettings: () => apiClient.get('core/parameters/'),
  updateSetting: (id, data) => apiClient.patch(`core/parameters/${id}/`, data),
  deleteSetting: (id) => apiClient.delete(`core/parameters/${id}/`),

  // Scheduled Actions
  getScheduledActions: () => apiClient.get('core/scheduled-actions/'),
  toggleScheduledAction: (id, isActive) => apiClient.patch(`core/scheduled-actions/${id}/`, { is_active: isActive }),
  runScheduledAction: (id) => apiClient.post(`core/scheduled-actions/${id}/run/`),
  deleteScheduledAction: (id) => apiClient.delete(`core/scheduled-actions/${id}/`),
  createScheduledAction: (data) => apiClient.post('core/scheduled-actions/', data),
  updateScheduledAction: (id, data) => apiClient.put(`core/scheduled-actions/${id}/`, data),

  // Languages
  getLanguages: () => apiClient.get('core/languages/'),
  createLanguage: (data) => apiClient.post('core/languages/', data),
  updateLanguage: (id, data) => apiClient.patch(`core/languages/${id}/`, data),
  deleteLanguage: (id) => apiClient.delete(`core/languages/${id}/`),
  setDefaultLanguage: (id) => apiClient.post(`core/languages/${id}/set_default/`),

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
  getContentTypes: () => apiClient.get('core/content-types/'),
  createAccessRight: (data) => apiClient.post('users/role-permissions/', data),
  updateAccessRight: (id, data) => apiClient.patch(`users/role-permissions/${id}/`, data),
  deleteAccessRight: (id) => apiClient.delete(`users/role-permissions/${id}/`),

  // Record Rules
  getRecordRules: (params) => apiClient.get('users/record-rules/', { params }),
  createRecordRule: (data) => apiClient.post('users/record-rules/', data),
  updateRecordRule: (id, data) => apiClient.patch(`users/record-rules/${id}/`, data),
  deleteRecordRule: (id) => apiClient.delete(`users/record-rules/${id}/`),

  // Automated Actions (base.automation equivalent)
  getAutomatedActions: (params) => apiClient.get('automation/actions/', { params }),
  getAutomatedAction: (id) => apiClient.get(`automation/actions/${id}/`),
  createAutomatedAction: (data) => apiClient.post('automation/actions/', data),
  updateAutomatedAction: (id, data) => apiClient.put(`automation/actions/${id}/`, data),
  deleteAutomatedAction: (id) => apiClient.delete(`automation/actions/${id}/`),
  toggleAutomatedAction: (id, isActive) => apiClient.patch(`automation/actions/${id}/`, { is_active: isActive }),
  runAutomatedAction: (id) => apiClient.post(`automation/actions/${id}/run/`),
  
  // Reports
  getReports: (params) => apiClient.get('reports/generated/', { params }),

  // Tenants & Company
  getMyCompany: () => apiClient.get('tenants/my-company/'),
  updateMyCompany: (data) => apiClient.patch('tenants/my-company/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Advanced System Actions (These might be defunct but left for UI safety)
  batchUpdateSettings: (data) => apiClient.post('core/parameters/batch_update/', data),
  createSetting: (data) => apiClient.post('core/parameters/', data),
  triggerBackup: () => apiClient.post('core/database-backups/trigger/'),
  pruneAuditLogs: (days) => apiClient.post('core/parameters/prune/', { days }),
  clearCache: () => apiClient.post('core/parameters/clear_cache/'),
  getSystemMetrics: () => apiClient.get('core/parameters/metrics/'),
  getServerLogs: () => apiClient.get('core/parameters/server_logs/'),

  // API Keys (Integration Keys)
  getIntegrationKeys: () => apiClient.get('system/integration-keys/'),
  createIntegrationKey: (data) => apiClient.post('system/integration-keys/', data),
  deleteIntegrationKey: (id) => apiClient.delete(`system/integration-keys/${id}/`),

  // Webhooks
  getWebhooks: () => apiClient.get('automation/webhook-endpoints/'),
  createWebhook: (data) => apiClient.post('automation/webhook-endpoints/', data),
  deleteWebhook: (id) => apiClient.delete(`automation/webhook-endpoints/${id}/`),
  testWebhook: (id) => apiClient.post(`automation/webhook-endpoints/${id}/test/`),

  // Backups
  getBackups: () => apiClient.get('core/database-backups/'),

  // Audit Logs
  getAuditLogs: (params) => apiClient.get('core/audit-logs/', { params }),
  exportAuditLogs: (params) => apiClient.get('core/audit-logs/?export=csv', { params }),

  // Email Config
  getEmailConfig: () => apiClient.get('system/email-config/'),
  updateEmailConfig: (data) => apiClient.post('system/email-config/', data),
  testEmailConfig: (data) => apiClient.post('system/email-config/test/', data)
};

export const getDocumentConfig = async () => {
    const response = await apiClient.get('system/document-config/');
    return response.data;
};

export const updateDocumentConfig = async (id, data) => {
    const response = await apiClient.patch(`system/document-config/${id}/`, data);
    return response.data;
};
