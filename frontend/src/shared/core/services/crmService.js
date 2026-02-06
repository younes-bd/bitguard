import client from './client';

export const crmService = {
    // --- CLIENTS ---
    getClients: async (params = {}) => {
        try {
            const response = await client.get('crm/clients/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Clients Error:", error);
            throw error;
        }
    },

    getClient: async (id) => {
        try {
            const response = await client.get(`crm/clients/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Fetch Client ${id} Error:`, error);
            throw error;
        }
    },

    createClient: async (data) => {
        try {
            const response = await client.post('crm/clients/', data);
            return response.data;
        } catch (error) {
            console.error("Create Client Error:", error);
            throw error;
        }
    },

    updateClient: async (id, data) => {
        try {
            const response = await client.patch(`crm/clients/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Update Client ${id} Error:`, error);
            throw error;
        }
    },

    deleteClient: async (id) => {
        try {
            const response = await client.delete(`crm/clients/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Delete Client ${id} Error:`, error);
            throw error;
        }
    },

    // Orders (Global)
    getOrders: async (params = {}) => {
        try {
            const response = await client.get('crm/orders/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Orders Error:", error);
            throw error;
        }
    },

    getClientOrders: async (id) => {
        try {
            const response = await client.get(`crm/clients/${id}/orders/`);
            return response.data;
        } catch (error) {
            console.error("Fetch Client Orders Error:", error);
            throw error;
        }
    },


    getClientInvoices: async (id) => {
        try {
            const response = await client.get(`crm/clients/${id}/invoices/`);
            return response.data;
        } catch (error) {
            console.error("Fetch Client Invoices Error:", error);
            throw error;
        }
    },

    // --- TICKETS ---
    getTickets: async (params = {}) => {
        try {
            const response = await client.get('crm/tickets/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Tickets Error:", error);
            throw error;
        }
    },

    getTicket: async (id) => {
        try {
            const response = await client.get(`crm/tickets/${id}/`);
            return response.data;
        } catch (error) {
            console.error("Fetch Ticket Error:", error);
            throw error;
        }
    },

    createTicket: async (data) => {
        try {
            const response = await client.post('crm/tickets/', data);
            return response.data;
        } catch (error) {
            console.error("Create Ticket Error:", error);
            throw error;
        }
    },

    updateTicket: async (id, data) => {
        try {
            const response = await client.patch(`crm/tickets/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Update Ticket ${id} Error:`, error);
            throw error;
        }
    },

    deleteTicket: async (id) => {
        try {
            const response = await client.delete(`crm/tickets/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Delete Ticket ${id} Error:`, error);
            throw error;
        }
    },

    // --- DEALS ---
    getDeals: async (params = {}) => {
        try {
            const response = await client.get('crm/deals/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Deals Error:", error);
            throw error;
        }
    },

    createDeal: async (data) => {
        try {
            const response = await client.post('crm/deals/', data);
            return response.data;
        } catch (error) {
            console.error("Create Deal Error:", error);
            throw error;
        }
    },

    updateDeal: async (id, data) => {
        try {
            const response = await client.patch(`crm/deals/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error("Update Deal Error:", error);
            throw error;
        }
    },

    deleteDeal: async (id) => {
        try {
            const response = await client.delete(`crm/deals/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Delete Deal ${id} Error:`, error);
            throw error;
        }
    },

    // --- CONTRACTS ---
    getContracts: async (params = {}) => {
        try {
            const response = await client.get('crm/contracts/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Contracts Error:", error);
            throw error;
        }
    },

    createContract: async (data) => {
        try {
            const response = await client.post('crm/contracts/', data);
            return response.data;
        } catch (error) {
            console.error("Create Contract Error:", error);
            throw error;
        }
    },

    updateContract: async (id, data) => {
        try {
            const response = await client.patch(`crm/contracts/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Update Contract ${id} Error:`, error);
            throw error;
        }
    },

    deleteContract: async (id) => {
        try {
            const response = await client.delete(`crm/contracts/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Delete Contract ${id} Error:`, error);
            throw error;
        }
    },

    // --- CONTACTS ---
    getContacts: async () => {
        try {
            const response = await client.get('crm/contacts/');
            return response.data;
        } catch (error) {
            console.error("Fetch Contacts Error:", error);
            throw error;
        }
    },

    createContact: async (data) => {
        try {
            const response = await client.post('crm/contacts/', data);
            return response.data;
        } catch (error) {
            console.error("Create Contact Error:", error);
            throw error;
        }
    },

    updateContact: async (id, data) => {
        try {
            const response = await client.patch(`crm/contacts/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Update Contact ${id} Error:`, error);
            throw error;
        }
    },

    deleteContact: async (id) => {
        try {
            const response = await client.delete(`crm/contacts/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Delete Contact ${id} Error:`, error);
            throw error;
        }
    },

    // --- INTERACTIONS ---
    getInteractions: async (params = {}) => {
        try {
            const response = await client.get('crm/interactions/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Interactions Error:", error);
            throw error;
        }
    },

    createInteraction: async (data) => {
        try {
            const response = await client.post('crm/interactions/', data);
            return response.data;
        } catch (error) {
            console.error("Create Interaction Error:", error);
            throw error;
        }
    }
};
