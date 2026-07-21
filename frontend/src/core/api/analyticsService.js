import client from './client';

export const analyticsService = {
    getRevenueReport: async (params = {}) => {
        const response = await client.get('board/revenue/', { params });
        return response.data?.data ?? response.data;
    },
    getCrmReport: async (params = {}) => {
        const response = await client.get('board/crm/', { params });
        return response.data?.data ?? response.data;
    },
    getSupportReport: async (params = {}) => {
        const response = await client.get('board/support/', { params });
        return response.data?.data ?? response.data;
    },
    getSecurityReport: async (params = {}) => {
        const response = await client.get('board/security/', { params });
        return response.data?.data ?? response.data;
    },
    exportReport: async (type, params = {}) => {
        const response = await client.get(`board/export/${type}/`, { 
            params: { format: 'csv', ...params },
            responseType: 'blob' 
        });
        return response.data;
    }
};
