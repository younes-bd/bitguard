import client from '@/core/api/client';

export const bankReconciliationService = {
    getBankReconciliations: async (params = {}) => {
        const r = await client.get('accounting/bank-reconciliations/', { params });
        return r.data?.data ?? r.data;
    },
    createBankReconciliation: async (data) => {
        const r = await client.post('accounting/bank-reconciliations/', data);
        return r.data?.data ?? r.data;
    },
    updateBankReconciliation: async (id, data) => {
        const r = await client.patch(`accounting/bank-reconciliations/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    getBankTransactions: async (params = {}) => {
        const r = await client.get('accounting/bank-transactions/', { params });
        return r.data?.data ?? r.data;
    }
};
