import client from './client';

export const crmService = {
    // --- CLIENTS ---
    getClients: async (params = {}) => {
        try {
            const response = await client.get('crm/clients/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Clients Error:", error);
            throw error;
        }
    },

    getClient: async (id) => {
        try {
            const response = await client.get(`crm/clients/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Fetch Client ${id} Error:`, error);
            throw error;
        }
    },

    createClient: async (data) => {
        try {
            const response = await client.post('crm/clients/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Client Error:", error);
            throw error;
        }
    },

    updateClient: async (id, data) => {
        try {
            const response = await client.patch(`crm/clients/${id}/`, data);
            return response.data.data;
        } catch (error) {
            console.error(`Update Client ${id} Error:`, error);
            throw error;
        }
    },

    deleteClient: async (id) => {
        try {
            const response = await client.delete(`crm/clients/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Delete Client ${id} Error:`, error);
            throw error;
        }
    },

    // --- CONTACTS ---
    getContacts: async (params = {}) => {
        try {
            const response = await client.get('crm/contacts/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Contacts Error:", error);
            throw error;
        }
    },

    createContact: async (data) => {
        try {
            const response = await client.post('crm/contacts/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Contact Error:", error);
            throw error;
        }
    },

    updateContact: async (id, data) => {
        try {
            const response = await client.patch(`crm/contacts/${id}/`, data);
            return response.data.data;
        } catch (error) {
            console.error(`Update Contact ${id} Error:`, error);
            throw error;
        }
    },

    deleteContact: async (id) => {
        try {
            const response = await client.delete(`crm/contacts/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Delete Contact ${id} Error:`, error);
            throw error;
        }
    },

    // --- LEADS ---
    getLeads: async (params = {}) => {
        try {
            const response = await client.get('crm/leads/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Leads Error:", error);
            throw error;
        }
    },

    createLead: async (data) => {
        try {
            const response = await client.post('crm/leads/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Lead Error:", error);
            throw error;
        }
    },

    updateLead: async (id, data) => {
        try {
            const response = await client.patch(`crm/leads/${id}/`, data);
            return response.data.data;
        } catch (error) {
            console.error(`Update Lead ${id} Error:`, error);
            throw error;
        }
    },

    deleteLead: async (id) => {
        try {
            const response = await client.delete(`crm/leads/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Delete Lead ${id} Error:`, error);
            throw error;
        }
    },

    // --- DEALS ---
    getDeals: async (params = {}) => {
        try {
            const response = await client.get('crm/deals/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Deals Error:", error);
            throw error;
        }
    },

    createDeal: async (data) => {
        try {
            const response = await client.post('crm/deals/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Deal Error:", error);
            throw error;
        }
    },

    updateDeal: async (id, data) => {
        try {
            const response = await client.patch(`crm/deals/${id}/`, data);
            return response.data.data;
        } catch (error) {
            console.error("Update Deal Error:", error);
            throw error;
        }
    },

    deleteDeal: async (id) => {
        try {
            const response = await client.delete(`crm/deals/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Delete Deal ${id} Error:`, error);
            throw error;
        }
    },

    // --- ACTIVITIES ---
    getActivities: async (params = {}) => {
        try {
            const response = await client.get('crm/activities/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Activities Error:", error);
            throw error;
        }
    },

    createActivity: async (data) => {
        try {
            const response = await client.post('crm/activities/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Activity Error:", error);
            throw error;
        }
    }
};
