import client from './client';

export const platformService = {
    // --- Dashboard Stats ---
    getDashboardStats: async () => {
        const response = await client.get('platform/stats/');
        return response.data;
    },

    // --- Workspaces ---
    getWorkspaces: async (params = {}) => {
        const response = await client.get('platform/workspaces/', { params });
        return response.data;
    },
    getWorkspace: async (id) => {
        const response = await client.get(`platform/workspaces/${id}/`);
        return response.data;
    },
    createWorkspace: async (data) => {
        const response = await client.post('platform/workspaces/', data);
        return response.data;
    },
    updateWorkspace: async (id, data) => {
        const response = await client.patch(`platform/workspaces/${id}/`, data);
        return response.data;
    },
    deleteWorkspace: async (id) => {
        await client.delete(`platform/workspaces/${id}/`);
    },

    // --- Security Center (Alerts & Incidents) ---
    getAlerts: async (params = {}) => {
        const response = await client.get('platform/alerts/', { params });
        return response.data;
    },
    getAlert: async (id) => {
        const response = await client.get(`platform/alerts/${id}/`);
        return response.data;
    },
    updateAlert: async (id, data) => {
        const response = await client.patch(`platform/alerts/${id}/`, data);
        return response.data;
    },
    runPlaybook: async (id, playbookName) => {
        const response = await client.post(`platform/alerts/${id}/run_playbook/`, { playbook: playbookName });
        return response.data;
    },

    getIncidents: async (params = {}) => {
        const response = await client.get('platform/incidents/', { params });
        return response.data;
    },
    createIncident: async (data) => {
        const response = await client.post('platform/incidents/', data);
        return response.data;
    },
    updateIncident: async (id, data) => {
        const response = await client.patch(`platform/incidents/${id}/`, data);
        return response.data;
    },

    // --- Asset Management (Endpoints & Cloud Apps) ---
    getEndpoints: async (params = {}) => {
        const response = await client.get('platform/endpoints/', { params });
        return response.data;
    },
    updateEndpoint: async (id, data) => {
        const response = await client.patch(`platform/endpoints/${id}/`, data);
        return response.data;
    },
    isolateEndpoint: async (id) => {
        const response = await client.post(`platform/endpoints/${id}/isolate/`);
        return response.data;
    },

    getCloudApps: async (params = {}) => {
        const response = await client.get('platform/cloud-apps/', { params });
        return response.data;
    },
    updateCloudApp: async (id, data) => {
        const response = await client.patch(`platform/cloud-apps/${id}/`, data);
        return response.data;
    },

    // --- Threat Intelligence ---
    getEmailThreats: async (params = {}) => {
        const response = await client.get('platform/email-threats/', { params });
        return response.data;
    },

    getSecurityGaps: async (params = {}) => {
        const response = await client.get('platform/security-gaps/', { params });
        return response.data;
    },

    // --- Monitoring & Network ---
    getSystemMonitors: async (params = {}) => {
        const response = await client.get('platform/monitors/', { params });
        return response.data;
    },

    getNetworkEvents: async (params = {}) => {
        const response = await client.get('platform/network-events/', { params });
        return response.data;
    },

    getHealthMetrics: async (params = {}) => {
        const response = await client.get('platform/health-metrics/', { params });
        return response.data;
    },

    // --- Tools & Integrations ---
    getCloudIntegrations: async (params = {}) => {
        const response = await client.get('platform/cloud-integrations/', { params });
        return response.data;
    },
    connectIntegration: async (data) => {
        const response = await client.post('platform/cloud-integrations/', data);
        return response.data;
    },

    getRemoteSessions: async (params = {}) => {
        const response = await client.get('platform/remote-sessions/', { params });
        return response.data;
    },
    createRemoteSession: async (data) => {
        const response = await client.post('platform/remote-sessions/', data);
        return response.data;
    }
};
