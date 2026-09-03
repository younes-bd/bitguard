import client from '@/core/api/client';

const BASE = 'crm';

export const crmService = {
  // Deals
  getDeals: (params) => client.get(`${BASE}/deals/`, { params }),
  getDeal: (id) => client.get(`${BASE}/deals/${id}/`),
  createDeal: (data) => client.post(`${BASE}/deals/`, data),
  updateDeal: (id, data) => client.patch(`${BASE}/deals/${id}/`, data),
  setDealStage: (id, stageId) => client.post(`${BASE}/deals/${id}/set-stage/`, { stage_id: stageId }),
  markDealWon: (id) => client.post(`${BASE}/deals/${id}/mark-won/`),
  markDealLost: (id, reasonId) => client.post(`${BASE}/deals/${id}/mark-lost/`, { lost_reason_id: reasonId }),
  
  // Leads
  getLeads: (params) => client.get(`${BASE}/leads/`, { params }),
  getLead: (id) => client.get(`${BASE}/leads/${id}/`),
  createLead: (data) => client.post(`${BASE}/leads/`, data),
  updateLead: (id, data) => client.patch(`${BASE}/leads/${id}/`, data),
  convertLead: (id) => client.post(`${BASE}/leads/${id}/convert/`),
  markLeadLost: (id) => client.post(`${BASE}/leads/${id}/mark-lost/`),

  // Config
  getStages: () => client.get(`${BASE}/stages/`),
  getTeams: () => client.get(`${BASE}/teams/`),
  getLostReasons: () => client.get(`${BASE}/lost-reasons/`),
  getTags: () => client.get(`${BASE}/tags/`),
  getDashboardStats: () => client.get(`${BASE}/dashboard/stats/`),

getClients: async (params = {}) => {
        try {
            const response = await client.get('crm/clients/', { params });
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error("Fetch Clients Error:", error);
            throw error;
        }
    },

    getClient: async (id) => {
        try {
            const response = await client.get(`crm/clients/${id}/`);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error(`Fetch Client ${id} Error:`, error);
            throw error;
        }
    },

    createClient: async (data) => {
        try {
            const response = await client.post('crm/clients/', data);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error("Create Client Error:", error);
            throw error;
        }
    },

    updateClient: async (id, data) => {
        try {
            const response = await client.patch(`crm/clients/${id}/`, data);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error(`Update Client ${id} Error:`, error);
            throw error;
        }
    },

    deleteClient: async (id) => {
        try {
            const response = await client.delete(`crm/clients/${id}/`);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error(`Delete Client ${id} Error:`, error);
            throw error;
        }
    },
    getContacts: async (params = {}) => {
        try {
            const response = await client.get('crm/contacts/', { params });
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error("Fetch Contacts Error:", error);
            throw error;
        }
    },

    createContact: async (data) => {
        try {
            const response = await client.post('crm/contacts/', data);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error("Create Contact Error:", error);
            throw error;
        }
    },

    updateContact: async (id, data) => {
        try {
            const response = await client.patch(`crm/contacts/${id}/`, data);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error(`Update Contact ${id} Error:`, error);
            throw error;
        }
    },

    deleteContact: async (id) => {
        try {
            const response = await client.delete(`crm/contacts/${id}/`);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error(`Delete Contact ${id} Error:`, error);
            throw error;
        }
    },
    convertLeadToSale: async (id) => {
        try {
            const response = await client.post(`crm/leads/${id}/convert-to-sale/`);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error(`Convert Lead to Sale ${id} Error:`, error);
            throw error;
        }
    },
    getActivities: async (params = {}) => {
        try {
            const response = await client.get('crm/activities/', { params });
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error("Fetch Activities Error:", error);
            throw error;
        }
    },

    createActivity: async (data) => {
        try {
            const response = await client.post('crm/activities/', data);
            return response.data?.data ?? response.data?.results ?? response.data;
        } catch (error) {
            console.error("Create Activity Error:", error);
            throw error;
        }
    },

    getClientOrders: async (clientId) => {
        try {
            const response = await client.get('store/orders/', { params: { client: clientId } });
            return response.data?.data ?? response.data?.results ?? response.data ?? [];
        } catch (error) {
            console.error(`Fetch Orders for Client ${clientId} Error:`, error);
            return [];
        }
    },

    // â”€â”€â”€ DOCUMENT GENERATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    downloadDocument: async (model, id) => {
        const response = await client.get(`${model}/${id}/download/`, { responseType: 'blob' });
        return response.data;
    }
};
