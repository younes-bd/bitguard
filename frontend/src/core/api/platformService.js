/**
 * Security Platform Service — Updated to use /api/security/ routes.
 * Previously called /api/platform/ which had no backend.
 * Now maps directly to the extended SOC app endpoints.
 */
import client from './client';

export const platformService = {
    // --- Dashboard Stats ---
    getDashboardStats: async () => {
        const [alerts, incidents, endpoints, cloudApps] = await Promise.all([
            client.get('security/alerts/?is_resolved=false'),
            client.get('security/incidents/?status=open'),
            client.get('security/endpoints/'),
            client.get('security/cloud-apps/'),
        ]);
        return {
            data: {
                open_alerts: alerts.data.count ?? alerts.data.length ?? 0,
                open_incidents: incidents.data.count ?? incidents.data.length ?? 0,
                managed_endpoints: endpoints.data.count ?? endpoints.data.length ?? 0,
                monitored_apps: cloudApps.data.count ?? cloudApps.data.length ?? 0,
            }
        };
    },

    // --- Workspaces ---
    getWorkspaces: async (params = {}) => {
        const response = await client.get('security/workspaces/', { params });
        return response.data;
    },
    getWorkspace: async (id) => {
        const response = await client.get(`security/workspaces/${id}/`);
        return response.data;
    },
    createWorkspace: async (data) => {
        const response = await client.post('security/workspaces/', data);
        return response.data;
    },
    updateWorkspace: async (id, data) => {
        const response = await client.patch(`security/workspaces/${id}/`, data);
        return response.data;
    },
    deleteWorkspace: async (id) => {
        await client.delete(`security/workspaces/${id}/`);
    },

    // --- Security Alerts (via SOC) ---
    getAlerts: async (params = {}) => {
        const response = await client.get('security/alerts/', { params });
        return response.data;
    },
    getAlert: async (id) => {
        const response = await client.get(`security/alerts/${id}/`);
        return response.data;
    },
    updateAlert: async (id, data) => {
        const response = await client.patch(`security/alerts/${id}/`, data);
        return response.data;
    },
    resolveAlert: async (id) => {
        const response = await client.post(`security/alerts/${id}/resolve/`);
        return response.data;
    },

    // --- Incidents (via SOC) ---
    getIncidents: async (params = {}) => {
        const response = await client.get('security/incidents/', { params });
        return response.data;
    },
    createIncident: async (data) => {
        const response = await client.post('security/incidents/', data);
        return response.data;
    },
    updateIncident: async (id, data) => {
        const response = await client.patch(`security/incidents/${id}/`, data);
        return response.data;
    },
    transitionIncident: async (id, newStatus) => {
        const response = await client.post(`security/incidents/${id}/transition/`, { status: newStatus });
        return response.data;
    },

    // --- Endpoints (ITAM / MDR) ---
    getEndpoints: async (params = {}) => {
        const response = await client.get('security/endpoints/', { params });
        return response.data;
    },
    getEndpoint: async (id) => {
        const response = await client.get(`security/endpoints/${id}/`);
        return response.data;
    },
    updateEndpoint: async (id, data) => {
        const response = await client.patch(`security/endpoints/${id}/`, data);
        return response.data;
    },
    isolateEndpoint: async (id) => {
        const response = await client.post(`security/endpoints/${id}/isolate/`);
        return response.data;
    },

    // --- Cloud Apps ---
    getCloudApps: async (params = {}) => {
        const response = await client.get('security/cloud-apps/', { params });
        return response.data;
    },
    updateCloudApp: async (id, data) => {
        const response = await client.patch(`security/cloud-apps/${id}/`, data);
        return response.data;
    },

    // --- Threat Intelligence ---
    getEmailThreats: async (params = {}) => {
        const response = await client.get('security/threats/', { params: { ...params, indicator_type: 'email' } });
        return response.data;
    },
    getSecurityGaps: async (params = {}) => {
        // Map to network events flagged as anomalous
        const response = await client.get('security/network-events/', { params: { ...params, category: 'anomalous_traffic' } });
        return response.data;
    },

    // --- Monitoring & Network ---
    getSystemMonitors: async (params = {}) => {
        const response = await client.get('security/monitors/', { params });
        return response.data;
    },
    getNetworkEvents: async (params = {}) => {
        const response = await client.get('security/network-events/', { params });
        return response.data;
    },
    getHealthMetrics: async (endpointId) => {
        const response = await client.get('security/monitors/', { params: { endpoint: endpointId } });
        return response.data;
    },

    // --- Cloud Integrations ---
    getCloudIntegrations: async (params = {}) => {
        const response = await client.get('security/cloud-integrations/', { params });
        return response.data;
    },
    connectIntegration: async (data) => {
        const response = await client.post('security/cloud-integrations/', data);
        return response.data;
    },

    // --- Remote Sessions ---
    getRemoteSessions: async (params = {}) => {
        const response = await client.get('security/remote-sessions/', { params });
        return response.data;
    },
    createRemoteSession: async (data) => {
        const response = await client.post('security/remote-sessions/', data);
        return response.data;
    },
    endRemoteSession: async (id) => {
        const response = await client.post(`security/remote-sessions/${id}/end/`);
        return response.data;
    },
};

export default platformService;
