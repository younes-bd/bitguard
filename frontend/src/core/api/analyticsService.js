import client from './client';

export const analyticsService = {
    getRevenueReport: async () => {
        const response = await client.get('dashboard/revenue/');
        return response.data?.data ?? response.data;
    },
    getCrmReport: async () => {
        const response = await client.get('dashboard/crm/');
        return response.data?.data ?? response.data;
    },
    getSupportReport: async () => {
        const response = await client.get('dashboard/support/');
        return response.data?.data ?? response.data;
    },
    getSecurityReport: async () => {
        const response = await client.get('dashboard/security/');
        return response.data?.data ?? response.data;
    },
    exportReport: async (type, format = 'csv') => {
        const response = await client.get(`dashboard/export/${type}/?format=${format}`, { responseType: 'blob' });
        return response.data;
    }
};
