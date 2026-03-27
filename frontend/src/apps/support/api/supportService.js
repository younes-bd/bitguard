import apiClient from '../../../core/api/client';

export const supportService = {
    /**
     * Get a list of support tickets.
     */
    getTickets: async (params = {}) => {
        const response = await apiClient.get('/support/tickets/', { params });
        return response.data;
    },

    /**
     * Get a single support ticket by ID.
     */
    getTicket: async (id) => {
        const response = await apiClient.get(`/support/tickets/${id}/`);
        return response.data;
    },

    /**
     * Create a new support ticket.
     */
    createTicket: async (data) => {
        const response = await apiClient.post('/support/tickets/', data);
        return response.data;
    },

    /**
     * Add a message to an existing ticket.
     */
    addMessage: async (id, body) => {
        const response = await apiClient.post(`/support/tickets/${id}/add_message/`, { body });
        return response.data;
    }
};
