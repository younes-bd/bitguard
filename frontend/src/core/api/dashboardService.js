import client from './client';

/**
 * Dashboard Service (core/api layer)
 * Proxies to the canonical dashboard BFF endpoints.
 * The authoritative service is at apps/dashboard/api/dashboardService.js
 * This file keeps backward-compatibility for any imports from core/api/.
 */
export const dashboardService = {
    getStats: async () => {
        try {
            const response = await client.get('dashboard/metrics/');
            return response.data?.data ?? response.data ?? {};
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            throw error;
        }
    },

    getHealth: async () => {
        try {
            const response = await client.get('dashboard/health/');
            return response.data?.data ?? response.data ?? {};
        } catch (error) {
            console.error("Dashboard Health Error:", error);
            throw error;
        }
    },

    getRecentActivity: async () => {
        return [];
    }
};

export default dashboardService;
