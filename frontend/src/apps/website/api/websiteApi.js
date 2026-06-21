import api from '../../../core/api/client';

export const websiteApi = {
    // Services
    getServices: async () => {
        try {
            const response = await api.get('/cms/services/');
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    /**
     * Fetch a specific service by its slug.
     */
    getServiceBySlug: async (slug) => {
        try {
            const response = await api.get(`/cms/services/${slug}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching service ${slug}:`, error);
            throw error;
        }
    },

    // Global Search
    search: async (query) => {
        const response = await api.get(`/website/search/?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Inquiries
    submitInquiry: async (data) => {
        const response = await api.post('/website/inquiries/', data);
        return response.data;
    },

    // Support Tickets
    submitSupportTicket: async (data) => {
        const response = await api.post('/website/support/ticket/', data);
        return response.data;
    }
};

export default websiteApi;
