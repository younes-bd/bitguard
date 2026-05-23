import apiClient from '../../../core/api/client';

export const sysadminService = {
  // System Settings
  getSettings: (params) => apiClient.get('sysadmin/settings/', { params }),
  getSetting: (id) => apiClient.get(`sysadmin/settings/${id}/`),
  updateSetting: (id, data) => apiClient.put(`sysadmin/settings/${id}/`, data),
  batchUpdateSettings: (settings) => apiClient.post('sysadmin/settings/batch_update/', { settings }),
  
  // Audit Logs
  getAuditLogs: (params) => apiClient.get('sysadmin/audit-logs/', { params }),
  getAuditLog: (id) => apiClient.get(`sysadmin/audit-logs/${id}/`),
  
  // System Metrics
  getSystemMetrics: () => apiClient.get('sysadmin/settings/metrics/'),

  // Platform Actions
  clearCache: () => apiClient.post('sysadmin/settings/clear_cache/'),
  syncIndexes: () => apiClient.post('sysadmin/settings/sync_indexes/'),
  toggleMaintenance: () => apiClient.post('sysadmin/settings/toggle_maintenance/'),

  // Reports
  generateReport: () => apiClient.get('sysadmin/settings/generate_report/', { responseType: 'blob' }),
  exportAuditLogs: (params) => apiClient.get('sysadmin/audit-logs/export_csv/', { params, responseType: 'blob' }),

  // API Keys
  getApiKeys: () => apiClient.get('sysadmin/api-keys/'),
  createApiKey: (data) => apiClient.post('sysadmin/api-keys/', data),
  deleteApiKey: (id) => apiClient.delete(`sysadmin/api-keys/${id}/`),

  // Webhooks
  getWebhooks: () => apiClient.get('sysadmin/webhooks/'),
  createWebhook: (data) => apiClient.post('sysadmin/webhooks/', data),
  deleteWebhook: (id) => apiClient.delete(`sysadmin/webhooks/${id}/`),

  // Backups & Retention
  getBackups: () => apiClient.get('sysadmin/backups/'),
  triggerBackup: () => apiClient.post('sysadmin/backups/trigger/'),
  pruneAuditLogs: (days) => apiClient.post('sysadmin/audit-logs/prune/', { days }),

  // System Logs (Raw)
  getServerLogs: () => apiClient.get('sysadmin/settings/server_logs/')
};
