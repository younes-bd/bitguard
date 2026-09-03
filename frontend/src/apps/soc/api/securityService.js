/**
 * securityService.js â€” Unified Security Platform API client.
 * Delegates to platformService (which calls /api/security/) so all
 * existing page imports continue to work without modification.
 */
import { settingsService } from '../../system/api/settingsService';
import client from '@/core/api/client';

const securityService = {
    // â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getDashboardStats: () => client.get('users/stats/'),

    // â”€â”€ Alerts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getAlerts: (params) => client.get('security/alerts/', { params }),
    getAlert: (id) => client.get(`security/alerts/${id}/`),
    updateAlert: (id, data) => client.patch(`security/alerts/${id}/`, data),
    resolveAlert: (id) => client.post(`security/alerts/${id}/resolve/`),

    // â”€â”€ Incidents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getIncidents: (params) => client.get('security/incidents/', { params }),
    getIncident: (id) => client.get(`security/incidents/${id}/`),
    createIncident: (data) => client.post('security/incidents/', data),
    updateIncident: (id, data) => client.patch(`security/incidents/${id}/`, data),
    transitionIncident: (id, newStatus) =>
        client.post(`security/incidents/${id}/transition/`, { status: newStatus }),

    // â”€â”€ ManagedEndpoints (Assets) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getAssets: (params) => client.get('security/endpoints/', { params }),
    getAsset: (id) => client.get(`security/endpoints/${id}/`),
    isolateAsset: (id) => client.post(`security/endpoints/${id}/isolate/`),
    updateAsset: (id, data) => client.patch(`security/endpoints/${id}/`, data),

    // â”€â”€ Workspaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getWorkspaces: (params) => client.get('security/workspaces/', { params }),
    createWorkspace: (data) => client.post('security/workspaces/', data),

    // â”€â”€ Cloud Apps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getCloudApps: (params) => client.get('security/cloud-apps/', { params }),

    // â”€â”€ Threat Intelligence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getIndicators: (params) => client.get('security/threats/', { params }),
    getThreatIntelligence: (params) => client.get('security/threats/', { params }),

    // â”€â”€ Monitoring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getSystemMonitors: (params) => client.get('security/monitors/', { params }),

    // â”€â”€ Network â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getNetworkEvents: (params) => client.get('security/network-events/', { params }),

    // â”€â”€ Email / Security Gaps (mapped from threats/network) â”€â”€
    getEmailThreats: (params) =>
        client.get('security/threats/', { params: { ...params, indicator_type: 'email' } }),
    getSecurityGaps: (params) =>
        client.get('security/network-events/', { params: { ...params, category: 'anomalous_traffic' } }),

    // â”€â”€ Cloud Integrations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getCloudIntegrations: (params) => client.get('security/cloud-integrations/', { params }),
    connectIntegration: (data) => client.post('security/cloud-integrations/', data),

    // â”€â”€ Remote Sessions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getRemoteSessions: (params) => client.get('security/remote-sessions/', { params }),
    createRemoteSession: (data) => client.post('security/remote-sessions/', data),
    endRemoteSession: (id) => client.post(`security/remote-sessions/${id}/end/`),

    // â”€â”€ Log Analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getLogAnalysis: (params) => client.get('security/logs/', { params }),

    // â”€â”€ Vulnerabilities (mapped to at_risk endpoints) â”€â”€â”€â”€â”€
    getVulnerabilities: (params) =>
        client.get('security/endpoints/', { params: { ...params, status: 'at_risk' } }),
};

export default securityService;
