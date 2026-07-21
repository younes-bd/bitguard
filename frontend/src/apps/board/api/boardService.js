import apiClient from '../../../core/api/client';

export const boardService = {
    /**
     * Fetch aggregated cross-module metrics for the Command Center.
     * Backend wraps response as { status, data: { crm, store, ... } }
     */
    getMetrics: async () => {
        const response = await apiClient.get('board/metrics/');
        // Unwrap the BFF envelope: { status: "success", data: { crm, store, ... } }
        return response.data?.data ?? response.data ?? {};
    },

    /**
     * Fetch backend server health stats (Admin Only).
     */
    getSystemHealth: async () => {
        const response = await apiClient.get('board/health/');
        return response.data?.data ?? response.data ?? {};
    },

    /**
     * Fetch recent notifications for the activity feed.
     */
    getRecentActivity: async (limit = 8) => {
        const response = await apiClient.get(`notifications/?limit=${limit}`);
        return response.data?.results ?? response.data ?? [];
    },

    getMrr: async () => {
        const response = await apiClient.get('board/mrr/');
        return response.data?.data ?? response.data ?? {};
    },
};
