import client from '../../../core/api/client';

export const accountingService = {
    // ─── BANK RECONCILIATIONS ───────────────────────────────────────────────────
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

    // ─── TAX GROUPS & AUTHORITIES ──────────────────────────────────────────────
    getTaxGroups: async (params = {}) => {
        const r = await client.get('accounting/tax-groups/', { params });
        return r.data?.data ?? r.data;
    },
    createTaxGroup: async (data) => {
        const r = await client.post('accounting/tax-groups/', data);
        return r.data?.data ?? r.data;
    },
    updateTaxGroup: async (id, data) => {
        const r = await client.patch(`accounting/tax-groups/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    
    getTaxAuthorities: async (params = {}) => {
        const r = await client.get('accounting/tax-authorities/', { params });
        return r.data?.data ?? r.data;
    },

    // ─── FIXED ASSETS ────────────────────────────────────────────────────────
    getFixedAssets: async (params = {}) => {
        const r = await client.get('accounting/fixed-assets/', { params });
        return r.data?.data ?? r.data;
    },
    createFixedAsset: async (data) => {
        const r = await client.post('accounting/fixed-assets/', data);
        return r.data?.data ?? r.data;
    },
    updateFixedAsset: async (id, data) => {
        const r = await client.patch(`accounting/fixed-assets/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteFixedAsset: async (id) => {
        const r = await client.delete(`accounting/fixed-assets/${id}/`);
        return r.data?.data ?? r.data;
    },
    
    // ─── CURRENCIES & EXCHANGE RATES ──────────────────────────────────────────
    getCurrencies: async (params = {}) => {
        const r = await client.get('accounting/currencies/', { params });
        return r.data?.data ?? r.data;
    },
    getExchangeRates: async (params = {}) => {
        const r = await client.get('accounting/exchange-rates/', { params });
        return r.data?.data ?? r.data;
    },
    
    // ─── BANK TRANSACTIONS (FOR RECONCILIATION) ──────────────────────────────
    getBankTransactions: async (params = {}) => {
        const r = await client.get('accounting/bank-transactions/', { params });
        return r.data?.data ?? r.data;
    },
    
    // ─── PAYMENTS AND EXPENSES (FOR RECONCILIATION) ──────────────────────────
    getPayments: async (params = {}) => {
        const r = await client.get('accounting/payments/', { params });
        return r.data?.data ?? r.data;
    },
    getExpenses: async (params = {}) => {
        const r = await client.get('accounting/expenses/', { params });
        return r.data?.data ?? r.data;
    },
    
    // ─── ACCOUNTS & DEPRECIATION ──────────────────────────────────────────────
    getAccounts: async (params = {}) => {
        const r = await client.get('accounting/accounts/', { params });
        return r.data?.data ?? r.data;
    },
    runDepreciation: async () => {
        const r = await client.post('accounting/fixed-assets/run-depreciation/');
        return r.data?.data ?? r.data;
    },
    
    // ─── DOCUMENT GENERATION ──────────────────────────────────────────────────
    downloadDocument: async (model, id) => {
        const { default: reportingService } = await import('../../../core/api/reportingService');
        const res = await reportingService.generateReport(null, model, id);
        if (res && res.file) {
            window.open(res.file, '_blank');
        }
        return res;
    }
};
