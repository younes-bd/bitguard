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
    getAlerts: (params) => client.get('soc/alerts/', { params }),
    getAlert: (id) => client.get(`soc/alerts/${id}/`),
    updateAlert: (id, data) => client.patch(`soc/alerts/${id}/`, data),
    resolveAlert: (id) => client.post(`soc/alerts/${id}/resolve/`),

    // â”€â”€ Incidents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getIncidents: (params) => client.get('soc/incidents/', { params }),
    getIncident: (id) => client.get(`soc/incidents/${id}/`),
    createIncident: (data) => client.post('soc/incidents/', data),
    updateIncident: (id, data) => client.patch(`soc/incidents/${id}/`, data),
    transitionIncident: (id, newStatus) =>
        client.post(`soc/incidents/${id}/transition/`, { status: newStatus }),

    // â”€â”€ ManagedEndpoints (Assets) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getAssets: (params) => client.get('soc/endpoints/', { params }),
    getAsset: (id) => client.get(`soc/endpoints/${id}/`),
    isolateAsset: (id) => client.post(`soc/endpoints/${id}/isolate/`),
    updateAsset: (id, data) => client.patch(`soc/endpoints/${id}/`, data),

    // â”€â”€ Workspaces â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getWorkspaces: (params) => client.get('soc/workspaces/', { params }),
    createWorkspace: (data) => client.post('soc/workspaces/', data),

    // â”€â”€ Cloud Apps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getCloudApps: (params) => client.get('soc/cloud-apps/', { params }),

    // â”€â”€ Threat Intelligence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getIndicators: (params) => client.get('soc/threats/', { params }),
    getThreatIntelligence: (params) => client.get('soc/threats/', { params }),

    // â”€â”€ Monitoring â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getSystemMonitors: (params) => client.get('soc/monitors/', { params }),

    // â”€â”€ Network â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getNetworkEvents: (params) => client.get('soc/network-events/', { params }),

    // â”€â”€ Email / Security Gaps (mapped from threats/network) â”€â”€
    getEmailThreats: (params) =>
        client.get('soc/threats/', { params: { ...params, indicator_type: 'email' } }),
    getSecurityGaps: (params) =>
        client.get('soc/network-events/', { params: { ...params, category: 'anomalous_traffic' } }),

    // â”€â”€ Cloud Integrations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getCloudIntegrations: (params) => client.get('soc/cloud-integrations/', { params }),
    connectIntegration: (data) => client.post('soc/cloud-integrations/', data),

    // â”€â”€ Remote Sessions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getRemoteSessions: (params) => client.get('soc/remote-sessions/', { params }),
    createRemoteSession: (data) => client.post('soc/remote-sessions/', data),
    endRemoteSession: (id) => client.post(`soc/remote-sessions/${id}/end/`),

    // â”€â”€ Log Analysis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getLogAnalysis: (params) => client.get('soc/logs/', { params }),

    // â”€â”€ Vulnerabilities (mapped to at_risk endpoints) â”€â”€â”€â”€â”€
    getVulnerabilities: (params) =>
        client.get('soc/endpoints/', { params: { ...params, status: 'at_risk' } }),
};

export default securityService;
