import apiClient from '@/core/api/client';

export const settingsService = {
  // Modules
  getModules: () => apiClient.get('core/modules/'),
  getModule: (id) => apiClient.get(`core/modules/${id}/`),
  updateModuleList: () => apiClient.post('core/modules/update_list/'),
  installModule: (id) => apiClient.post(`core/modules/${id}/install/`),
  uninstallModule: (id) => apiClient.post(`core/modules/${id}/uninstall/`),
  upgradeModule: (id) => apiClient.post(`core/modules/${id}/upgrade/`),

  // System Settings
  getSettings: () => apiClient.get('core/parameters/'),
  updateSetting: (id, data) => apiClient.patch(`core/parameters/${id}/`, data),
  deleteSetting: (id) => apiClient.delete(`core/parameters/${id}/`),
  getSystemStatus: async () => {
    try {
      const res = await apiClient.get('core/command-center/system_health/');
      return { 
        systems: [
          { name: 'API Server', status: 'Operational', uptime: res.data.api_uptime || '100%' },
          { name: 'Database', status: 'Operational', load: res.data.db_load || 'Normal' }
        ], 
        incidents: [], 
        overallStatus: 'Operational',
        active_sessions: res.data.active_sessions || 0
      };
    } catch (err) {
      return { systems: [], incidents: [], overallStatus: 'Degraded' };
    }
  },

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

  // Audit Logs
  getAuditLogs: (params) => apiClient.get('core/audit-logs/', { params }),
  exportAuditLogs: (params) => apiClient.get('core/audit-logs/?export=csv', { params }),

  // Email Config
  getEmailConfig: () => apiClient.get('system/email-config/'),
  updateEmailConfig: (data) => apiClient.post('system/email-config/', data),
  testEmailConfig: (data) => apiClient.post('system/email-config/test/', data),

  // Integration Keys
  getIntegrationKeys: () => apiClient.get('system/integration-keys/'),
  createIntegrationKey: (data) => apiClient.post('system/integration-keys/', data),
  deleteIntegrationKey: (id) => apiClient.delete(`system/integration-keys/${id}/`),

  // Backups
  getBackups: () => apiClient.get('core/database-backups/'),

  // SOC (Security Operations Center) - Forward compatibility
  getSystemMonitors: (params) => apiClient.get('soc/monitors/', { params }),
  getNetworkEvents: (params) => apiClient.get('soc/network-events/', { params }),
  getEndpoints: (params) => apiClient.get('soc/endpoints/', { params }),
  isolateEndpoint: (id) => apiClient.post(`soc/endpoints/${id}/isolate/`),
  getRemoteSessions: (params) => apiClient.get('soc/remote-sessions/', { params }),
  createRemoteSession: (data) => apiClient.post('soc/remote-sessions/', data),
  getLogs: (params) => apiClient.get('soc/logs/', { params }),
  getWorkspaces: (params) => apiClient.get('soc/workspaces/', { params }),
  createWorkspace: (data) => apiClient.post('soc/workspaces/', data),
  deleteWorkspace: (id) => apiClient.delete(`soc/workspaces/${id}/`)
};

export const getDocumentConfig = async () => {
    const response = await apiClient.get('system/document-config/');
    return response.data;
};

export const updateDocumentConfig = async (id, data) => {
    const response = await apiClient.patch(`system/document-config/${id}/`, data);
    return response.data;
};
