import apiClient from '@/core/api/client';

/**
 * SOC (Security Operations Center) — Forward-compatibility stubs.
 * These endpoints do not yet exist in the backend.
 * Do NOT call these methods until the SOC backend app is built.
 */
export const socService = {
  getSystemMonitors: (params) => apiClient.get('soc/monitors/', { params }),
  getNetworkEvents: (params) => apiClient.get('soc/network-events/', { params }),
  getEndpoints: (params) => apiClient.get('soc/endpoints/', { params }),
  isolateEndpoint: (id) => apiClient.post(`soc/endpoints/${id}/isolate/`),
  getRemoteSessions: (params) => apiClient.get('soc/remote-sessions/', { params }),
  createRemoteSession: (data) => apiClient.post('soc/remote-sessions/', data),
  getLogs: (params) => apiClient.get('soc/logs/', { params }),
  getWorkspaces: (params) => apiClient.get('soc/workspaces/', { params }),
  createWorkspace: (data) => apiClient.post('soc/workspaces/', data),
  deleteWorkspace: (id) => apiClient.delete(`soc/workspaces/${id}/`),
};
