import client from './client';

const securityService = {
    // Stats
    getDashboardStats: () => client.get('security/stats/'),

    // Assets
    getAssets: (params) => client.get('security/assets/', { params }),
    getAsset: (id) => client.get(`security/assets/${id}/`),
    createAsset: (data) => client.post('security/assets/', data),
    updateAsset: (id, data) => client.put(`security/assets/${id}/`, data),
    deleteAsset: (id) => client.delete(`security/assets/${id}/`),
    isolateAsset: (id) => client.post(`security/assets/${id}/isolate_asset/`),

    // Vulnerabilities
    getVulnerabilities: (params) => client.get('security/vulnerabilities/', { params }),
    getVulnerability: (id) => client.get(`security/vulnerabilities/${id}/`),

    // Indicators
    getIndicators: (params) => client.get('security/indicators/', { params }),
    createIndicator: (data) => client.post('security/indicators/', data),

    // Alerts
    getAlerts: (params) => client.get('security/alerts/', { params }),
    getAlert: (id) => client.get(`security/alerts/${id}/`),
    updateAlert: (id, data) => client.patch(`security/alerts/${id}/`, data),

    // Incidents
    getIncidents: (params) => client.get('security/incidents/', { params }),
    getIncident: (id) => client.get(`security/incidents/${id}/`),
    createIncident: (data) => client.post('security/incidents/', data),
    updateIncident: (id, data) => client.patch(`security/incidents/${id}/`, data),

    // Email Security
    getEmailThreats: (params) => client.get('security/email-threats/', { params }),

    // Cloud Security
    getCloudApps: (params) => client.get('security/cloud-apps/', { params }),

    // Network Security
    getNetworkEvents: (params) => client.get('security/network-events/', { params }),

    // Gaps
    getSecurityGaps: (params) => client.get('security/security-gaps/', { params }),
};

export default securityService;
