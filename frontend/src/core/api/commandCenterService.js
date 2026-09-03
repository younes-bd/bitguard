import apiClient from '@/core/api/client';

export const boardService = {
    // ---------------------------------------------------------
    // Core Board Metrics
    // ---------------------------------------------------------
    getMetrics: async () => {
        const response = await apiClient.get('core/analytics/global/');
        return response.data?.data ?? response.data ?? {};
    },
    getSystemHealth: async () => {
        return { data: { status: 'healthy', uptime: '99.99%', api_latency: '42ms' } };
    },
    getMrr: async () => {
        const response = await apiClient.get('board/mrr/');
        return response.data?.data ?? response.data ?? {};
    },
    getRecentActivity: async (limit = 8) => {
        const response = await apiClient.get(`notifications/?limit=${limit}`);
        return response.data?.results ?? response.data ?? [];
    },

    // ---------------------------------------------------------
    // Export Endpoints
    // ---------------------------------------------------------
    exportReport: async (type, params = {}) => {
        const response = await apiClient.get(`board/export/${type}/`, { 
            params: { ...params },
            responseType: 'blob' 
        });
        return response.data;
    },

    // ---------------------------------------------------------
    // Domain Specific Analytics (from dashboardsService)
    // ---------------------------------------------------------
    getRevenueReport: (params) => apiClient.get('board/revenue/', { params }).then(res => res.data?.data ?? res.data),
    getCrmReport: (params) => apiClient.get('board/crm/', { params }).then(res => res.data?.data ?? res.data),
    getSupportReport: (params) => apiClient.get('board/support/', { params }).then(res => res.data?.data ?? res.data),
    getSecurityReport: (params) => apiClient.get('board/security/', { params }).then(res => res.data?.data ?? res.data),
    
    // Fixed domain-specific aggregation views
    getFinanceReport: (params) => apiClient.get('board/finance/', { params }).then(r => r.data?.data ?? r.data),
    getHrmReport: (params) => apiClient.get('board/hrm/', { params }).then(r => r.data?.data ?? r.data),
    getProjectsReport: (params) => apiClient.get('board/projects-report/', { params }).then(r => r.data?.data ?? r.data),
};

export default boardService;
