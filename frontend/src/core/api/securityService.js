/**
 * securityService.js — Unified Security Platform API client.
 * Delegates to platformService (which calls /api/security/) so all
 * existing page imports continue to work without modification.
 */
import { platformService } from './platformService';
import client from './client';

const securityService = {
    // ── Dashboard ─────────────────────────────────────────
    getDashboardStats: () => platformService.getDashboardStats(),

    // ── Alerts ────────────────────────────────────────────
    getAlerts: (params) => client.get('security/alerts/', { params }),
    getAlert: (id) => client.get(`security/alerts/${id}/`),
    updateAlert: (id, data) => client.patch(`security/alerts/${id}/`, data),
    resolveAlert: (id) => client.post(`security/alerts/${id}/resolve/`),

    // ── Incidents ─────────────────────────────────────────
    getIncidents: (params) => client.get('security/incidents/', { params }),
    getIncident: (id) => client.get(`security/incidents/${id}/`),
    createIncident: (data) => client.post('security/incidents/', data),
    updateIncident: (id, data) => client.patch(`security/incidents/${id}/`, data),
    transitionIncident: (id, newStatus) =>
        client.post(`security/incidents/${id}/transition/`, { status: newStatus }),

    // ── ManagedEndpoints (Assets) ─────────────────────────
    getAssets: (params) => client.get('security/endpoints/', { params }),
    getAsset: (id) => client.get(`security/endpoints/${id}/`),
    isolateAsset: (id) => client.post(`security/endpoints/${id}/isolate/`),
    updateAsset: (id, data) => client.patch(`security/endpoints/${id}/`, data),

    // ── Workspaces ────────────────────────────────────────
    getWorkspaces: (params) => client.get('security/workspaces/', { params }),
    createWorkspace: (data) => client.post('security/workspaces/', data),

    // ── Cloud Apps ────────────────────────────────────────
    getCloudApps: (params) => client.get('security/cloud-apps/', { params }),

    // ── Threat Intelligence ───────────────────────────────
    getIndicators: (params) => client.get('security/threats/', { params }),
    getThreatIntelligence: (params) => client.get('security/threats/', { params }),

    // ── Monitoring ────────────────────────────────────────
    getSystemMonitors: (params) => client.get('security/monitors/', { params }),

    // ── Network ───────────────────────────────────────────
    getNetworkEvents: (params) => client.get('security/network-events/', { params }),

    // ── Email / Security Gaps (mapped from threats/network) ──
    getEmailThreats: (params) =>
        client.get('security/threats/', { params: { ...params, indicator_type: 'email' } }),
    getSecurityGaps: (params) =>
        client.get('security/network-events/', { params: { ...params, category: 'anomalous_traffic' } }),

    // ── Cloud Integrations ────────────────────────────────
    getCloudIntegrations: (params) => client.get('security/cloud-integrations/', { params }),
    connectIntegration: (data) => client.post('security/cloud-integrations/', data),

    // ── Remote Sessions ───────────────────────────────────
    getRemoteSessions: (params) => client.get('security/remote-sessions/', { params }),
    createRemoteSession: (data) => client.post('security/remote-sessions/', data),
    endRemoteSession: (id) => client.post(`security/remote-sessions/${id}/end/`),

    // ── Log Analysis ──────────────────────────────────────
    getLogAnalysis: (params) => client.get('security/logs/', { params }),

    // ── Vulnerabilities (mapped to at_risk endpoints) ─────
    getVulnerabilities: (params) =>
        client.get('security/endpoints/', { params: { ...params, status: 'at_risk' } }),
};

export default securityService;
