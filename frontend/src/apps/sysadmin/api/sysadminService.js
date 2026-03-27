import apiClient from '../../../core/api/client';

export const sysadminService = {
  // System Settings
  getSettings: (params) => apiClient.get('/sysadmin/settings/', { params }),
  getSetting: (id) => apiClient.get(`/sysadmin/settings/${id}/`),
  updateSetting: (id, data) => apiClient.put(`/sysadmin/settings/${id}/`, data),
  batchUpdateSettings: (settings) => apiClient.post('/sysadmin/settings/batch_update/', { settings }),
  
  // Audit Logs
  getAuditLogs: (params) => apiClient.get('/sysadmin/audit-logs/', { params }),
  getAuditLog: (id) => apiClient.get(`/sysadmin/audit-logs/${id}/`),
  
  // System Metrics
  getSystemMetrics: () => apiClient.get('/sysadmin/settings/metrics/'),

  // Platform Actions
  clearCache: () => apiClient.post('/sysadmin/settings/clear_cache/'),
  syncIndexes: () => apiClient.post('/sysadmin/settings/sync_indexes/'),
  toggleMaintenance: () => apiClient.post('/sysadmin/settings/toggle_maintenance/'),

  // Reports
  generateReport: () => apiClient.get('/sysadmin/settings/generate_report/', { responseType: 'blob' }),
  exportAuditLogs: (params) => apiClient.get('/sysadmin/audit-logs/export_csv/', { params, responseType: 'blob' })
};
