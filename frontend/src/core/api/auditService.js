import client from './client';

export const auditService = {
    getAuditLogs: async (params = {}) => {
        const response = await client.get('audit/logs/', { params });
        return response.data?.results ?? response.data ?? [];
    }
};

export default auditService;
