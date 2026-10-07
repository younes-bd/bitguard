import { socSettingsService } from '@/apps/soc/api/socSettingsService';
/**
 * securityService.js — Unified Security Platform API client.
 * Delegates to platformService (which calls /api/security/) so all
 * existing page imports continue to work without modification.
 */

import client from '@/core/api/client';

const securityService = {
    // ── Dashboard ─────────────────────────────────────────
    getDashboardStats: () => client.get('users/stats/'),

    // ── Alerts ────────────────────────────────────────────
    getAlerts: (params) => client.get('soc/alerts/', { params }),
    getAlert: (id) => client.get(`soc/alerts/${id}/`),
    updateAlert: (id, data) => client.patch(`soc/alerts/${id}/`, data),
    resolveAlert: (id) => client.post(`soc/alerts/${id}/resolve/`),

    // ── Incidents ─────────────────────────────────────────
    getIncidents: (params) => client.get('soc/incidents/', { params }),
    getIncident: (id) => client.get(`soc/incidents/${id}/`),
    createIncident: (data) => client.post('soc/incidents/', data),
    updateIncident: (id, data) => client.patch(`soc/incidents/${id}/`, data),
    transitionIncident: (id, newStatus) =>
        client.post(`soc/incidents/${id}/transition/`, { status: newStatus }),

    // ── ManagedEndpoints (Assets) ─────────────────────────
    getAssets: (params) => client.get('soc/endpoints/', { params }),
    getAsset: (id) => client.get(`soc/endpoints/${id}/`),
    isolateAsset: (id) => client.post(`soc/endpoints/${id}/isolate/`),
    updateAsset: (id, data) => client.patch(`soc/endpoints/${id}/`, data),

    // ── Workspaces ────────────────────────────────────────
    getWorkspaces: (params) => client.get('soc/workspaces/', { params }),
    createWorkspace: (data) => client.post('soc/workspaces/', data),

    // ── Cloud Apps ────────────────────────────────────────
    getCloudApps: (params) => client.get('soc/cloud-apps/', { params }),

    // ── Threat Intelligence ───────────────────────────────
    getIndicators: (params) => client.get('soc/threats/', { params }),
    getThreatIntelligence: (params) => client.get('soc/threats/', { params }),

    // ── Monitoring ────────────────────────────────────────
    getSystemMonitors: (params) => client.get('soc/monitors/', { params }),

    // ── Network ───────────────────────────────────────────
    getNetworkEvents: (params) => client.get('soc/network-events/', { params }),

    // ── Email / Security Gaps (mapped from threats/network) ──
    getEmailThreats: (params) =>
        client.get('soc/threats/', { params: { ...params, indicator_type: 'email' } }),
    getSecurityGaps: (params) =>
        client.get('soc/network-events/', { params: { ...params, category: 'anomalous_traffic' } }),

    // ── Cloud Integrations ────────────────────────────────
    getCloudIntegrations: (params) => client.get('soc/cloud-integrations/', { params }),
    connectIntegration: (data) => client.post('soc/cloud-integrations/', data),

    // ── Remote Sessions ───────────────────────────────────
    getRemoteSessions: (params) => client.get('soc/remote-sessions/', { params }),
    createRemoteSession: (data) => client.post('soc/remote-sessions/', data),
    endRemoteSession: (id) => client.post(`soc/remote-sessions/${id}/end/`),

    // ── Log Analysis ──────────────────────────────────────
    getLogAnalysis: (params) => client.get('soc/logs/', { params }),

    // ── Vulnerabilities (mapped to at_risk endpoints) ─────
    getVulnerabilities: (params) =>
        client.get('soc/endpoints/', { params: { ...params, status: 'at_risk' } }),
};

export default securityService;
