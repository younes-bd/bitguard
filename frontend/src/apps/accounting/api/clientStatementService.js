import client from '@/core/api/client';

export const clientStatementService = {
    getClientStatement: async (clientId) => {
        const r = await client.get(`accounting/clients/${clientId}/statement/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
