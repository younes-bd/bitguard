import client from './client';

export const reportsService = {
    getRevenueReport: async () => {
        const response = await client.get('reports/revenue/');
        return response.data?.data ?? response.data;
    },
    getCrmReport: async () => {
        const response = await client.get('reports/crm/');
        return response.data?.data ?? response.data;
    },
    getSupportReport: async () => {
        const response = await client.get('reports/support/');
        return response.data?.data ?? response.data;
    },
    getSecurityReport: async () => {
        const response = await client.get('reports/security/');
        return response.data?.data ?? response.data;
    },
    exportReport: async (type, format = 'csv') => {
        const response = await client.get(`reports/export/${type}/?format=${format}`, { responseType: 'blob' });
        return response.data;
    }
};
