import client from './client';

export const dashboardService = {
    // Fetch aggregated stats
    // Fetch aggregated stats from the new unified backend endpoint
    getStats: async () => {
        try {
            const response = await client.get('core/dashboard/kpi/');
            return response.data;
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            throw error;
        }
    },

    // Fetch recent activity (Mocked for now, or map from Logs)
    getRecentActivity: async () => {
        return [
            { id: 1, text: "System System initialization complete", time: "Just now", type: "system" },
            { id: 2, text: "API Verification passed", time: "1 hour ago", type: "success" },
        ];
    }
};
