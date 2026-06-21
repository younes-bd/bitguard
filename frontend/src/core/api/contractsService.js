import client from './client';

const base = 'contracts';

export const contractsService = {
    // Service Contracts
    getContracts: async (params = {}) => {
        const response = await client.get(`${base}/service-contracts/`, { params });
        return response.data?.data ?? response.data;
    },
    getContract: async (id) => {
        const response = await client.get(`${base}/service-contracts/${id}/`);
        return response.data?.data ?? response.data;
    },
    createContract: async (data) => {
        const response = await client.post(`${base}/service-contracts/`, data);
        return response.data?.data ?? response.data;
    },
    updateContract: async (id, data) => {
        const response = await client.patch(`${base}/service-contracts/${id}/`, data);
        return response.data?.data ?? response.data;
    },

    // Quotes
    getQuotes: async (params = {}) => {
        const response = await client.get(`${base}/quotes/`, { params });
        return response.data?.data ?? response.data;
    },
    getQuote: async (id) => {
        const response = await client.get(`${base}/quotes/${id}/`);
        return response.data?.data ?? response.data;
    },
    createQuote: async (data) => {
        const response = await client.post(`${base}/quotes/`, data);
        return response.data?.data ?? response.data;
    },
    acceptQuote: async (id) => {
        const response = await client.post(`${base}/quotes/${id}/accept/`);
        return response.data?.data ?? response.data;
    },
    sendQuote: async (id) => {
        const response = await client.post(`${base}/quotes/${id}/send/`);
        return response.data?.data ?? response.data;
    },
    downloadQuote: async (id) => {
        const { default: reportingService } = await import('./reportingService');
        const res = await reportingService.generateReport(null, 'contracts.Quote', id);
        if (res && res.file) window.open(res.file, '_blank');
        return res;
    },
    downloadContract: async (id) => {
        const { default: reportingService } = await import('./reportingService');
        const res = await reportingService.generateReport(null, 'contracts.ServiceContract', id);
        if (res && res.file) window.open(res.file, '_blank');
        return res;
    },

    // SLA Tiers
    getSlaTiers: async () => {
        const response = await client.get(`${base}/sla-tiers/`);
        return response.data?.data ?? response.data;
    },
    createSlaTier: async (data) => {
        const response = await client.post(`${base}/sla-tiers/`, data);
        return response.data?.data ?? response.data;
    },
    updateSlaTier: async (id, data) => {
        const response = await client.patch(`${base}/sla-tiers/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteSlaTier: async (id) => {
        const response = await client.delete(`${base}/sla-tiers/${id}/`);
        return response.data?.data ?? response.data;
    },

    // SLA Breaches
    getSlaBreaches: async (params = {}) => {
        const response = await client.get(`${base}/sla-breaches/`, { params });
        return response.data?.data ?? response.data;
    },
    acknowledgeBreach: async (id) => {
        const response = await client.patch(`${base}/sla-breaches/${id}/`, { acknowledged: true });
        return response.data?.data ?? response.data;
    },

    // ─── DOCUMENT GENERATION ──────────────────────────────────────────────────
    downloadDocument: async (model, id) => {
        const response = await client.post('reporting/generated/generate/', {
            record_model: model,
            record_id: id,
        });
        return response.data;
    }
};

export default contractsService;
