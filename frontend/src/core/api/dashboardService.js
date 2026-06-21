import client from './client';

/**
 * Dashboard Service (core/api layer)
 * Proxies to the canonical dashboard BFF endpoints.
 * The authoritative service is at apps/dashboard/api/dashboardService.js
 * This file keeps backward-compatibility for any imports from core/api/.
 */
export const dashboardService = {
    getMetrics: async () => {
        try {
            const response = await client.get('dashboard/metrics/');
            return response.data?.data ?? response.data ?? {};
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            throw error;
        }
    },

    getSystemHealth: async () => {
        try {
            const response = await client.get('dashboard/health/');
            return response.data?.data ?? response.data ?? {};
        } catch (error) {
            console.error("Dashboard Health Error:", error);
            throw error;
        }
    },

    getMrrHistory: async () => {
        try {
            const response = await client.get('dashboard/mrr/');
            return response.data?.data ?? response.data ?? {};
        } catch (error) {
            console.error("Dashboard MRR Error:", error);
            throw error;
        }
    },

    getRecentActivity: async (limit = 8) => {
        try {
            const response = await client.get(`notifications/?limit=${limit}`);
            return response.data?.data ?? response.data ?? [];
        } catch (error) {
            console.error("Dashboard Activity Error:", error);
            return [];
        }
    },

    globalSearch: async (query) => {
        if (!query || query.length < 2) return [];
        try {
            const response = await client.get(`dashboard/search/?q=${encodeURIComponent(query)}`);
            return response.data?.data ?? [];
        } catch (error) {
            console.error("Global Search Error:", error);
            return [];
        }
    }
};

export default dashboardService;
