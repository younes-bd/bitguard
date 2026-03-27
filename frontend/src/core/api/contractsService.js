import client from './client';

const base = '/contracts';

export const contractsService = {
    // Service Contracts
    getContracts: (params = {}) => client.get(`${base}/contracts/`, { params }).then(r => r.data),
    getContract: (id) => client.get(`${base}/contracts/${id}/`).then(r => r.data),
    createContract: (data) => client.post(`${base}/contracts/`, data).then(r => r.data),
    updateContract: (id, data) => client.patch(`${base}/contracts/${id}/`, data).then(r => r.data),

    // Quotes
    getQuotes: (params = {}) => client.get(`${base}/quotes/`, { params }).then(r => r.data),
    getQuote: (id) => client.get(`${base}/quotes/${id}/`).then(r => r.data),
    createQuote: (data) => client.post(`${base}/quotes/`, data).then(r => r.data),
    acceptQuote: (id) => client.post(`${base}/quotes/${id}/accept/`).then(r => r.data),
    sendQuote: (id) => client.post(`${base}/quotes/${id}/send/`).then(r => r.data),

    // SLA Tiers
    getSlaTiers: () => client.get(`${base}/sla-tiers/`).then(r => r.data?.results ?? r.data ?? []),
    createSlaTier: (data) => client.post(`${base}/sla-tiers/`, data).then(r => r.data),
    updateSlaTier: (id, data) => client.patch(`${base}/sla-tiers/${id}/`, data).then(r => r.data),

    // SLA Breaches
    getSlaBreaches: (params = {}) => client.get(`${base}/sla-breaches/`, { params }).then(r => r.data),
};

export default contractsService;
