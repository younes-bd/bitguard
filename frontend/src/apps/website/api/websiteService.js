import api from '@/core/api/client';

export const websiteService = {
    // Services
    getServices: async () => {
        try {
            const response = await api.get('/home/services/');
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
            const response = await api.get(`/home/services/${slug}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching service ${slug}:`, error);
            throw error;
        }
    },

    // Global Search
    search: async (query) => {
        const response = await api.get(`/home/search/?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Inquiries
    submitInquiry: async (data) => {
        const response = await api.post('/home/inquiries/', data);
        return response.data;
    },

    // Support Tickets
    submitSupportTicket: async (data) => {
        const response = await api.post('/home/support/ticket/', data);
        return response.data;
    },

    // Websites
    getWebsites: async () => {
        const response = await api.get('/home/websites/');
        return response.data;
    },
    getWebsite: async (id) => {
        const response = await api.get(`/home/websites/${id}/`);
        return response.data;
    },
    createWebsite: async (data) => {
        const response = await api.post('/home/websites/', data);
        return response.data;
    },
    updateWebsite: async (id, data) => {
        const response = await api.put(`/home/websites/${id}/`, data);
        return response.data;
    },
    deleteWebsite: async (id) => {
        const response = await api.delete(`/home/websites/${id}/`);
        return response.data;
    },

    // Website Menus
    getMenus: async () => {
        const response = await api.get('/home/menus/');
        return response.data;
    },
    createMenu: async (data) => {
        const response = await api.post('/home/menus/', data);
        return response.data;
    },
    updateMenu: async (id, data) => {
        const response = await api.put(`/home/menus/${id}/`, data);
        return response.data;
    },
    deleteMenu: async (id) => {
        const response = await api.delete(`/home/menus/${id}/`);
        return response.data;
    },

    // Website Redirects
    getRedirects: async () => {
        const response = await api.get('/home/redirects/');
        return response.data;
    },
    createRedirect: async (data) => {
        const response = await api.post('/home/redirects/', data);
        return response.data;
    },
    updateRedirect: async (id, data) => {
        const response = await api.put(`/home/redirects/${id}/`, data);
        return response.data;
    },
    deleteRedirect: async (id) => {
        const response = await api.delete(`/home/redirects/${id}/`);
        return response.data;
    }
,
    getWebsites: async (params = {}) => client.get('website/websites/', { params }).then(r => r.data?.results ?? r.data),
    getWebsitePages: async (params = {}) => client.get('website/pages/', { params }).then(r => r.data?.results ?? r.data),
    getWebsiteMenus: async (params = {}) => client.get('website/menus/', { params }).then(r => r.data?.results ?? r.data),
    getWebsiteRedirects: async (params = {}) => client.get('website/redirects/', { params }).then(r => r.data?.results ?? r.data),
    
};

export default websiteService;
