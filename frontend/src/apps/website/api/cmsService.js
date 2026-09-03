import api from '@/core/api/client';

export const cmsService = {
    // Services
    getServices: async () => {
        const response = await api.get('/home/services/');
        return response.data;
    },

    getServiceBySlug: async (slug) => {
        const response = await api.get(`/home/services/${slug}/`);
        return response.data;
    },

    createService: async (data) => {
        const response = await api.post('/home/services/', data);
        return response.data;
    },

    updateService: async (slug, data) => {
        const response = await api.put(`/home/services/${slug}/`, data);
        return response.data;
    },

    deleteService: async (slug) => {
        const response = await api.delete(`/home/services/${slug}/`);
        return response.data;
    },

    // Pages
    getPages: async () => {
        const response = await api.get('/home/pages/');
        return response.data;
    },

    getPageBySlug: async (slug) => {
        const response = await api.get(`/home/pages/${slug}/`);
        return response.data;
    },

    createPage: async (data) => {
        const response = await api.post('/home/pages/', data);
        return response.data;
    },

    updatePage: async (slug, data) => {
        const response = await api.put(`/home/pages/${slug}/`, data);
        return response.data;
    },

    deletePage: async (slug) => {
        const response = await api.delete(`/home/pages/${slug}/`);
        return response.data;
    },

    publishPage: async (slug) => {
        const response = await api.post(`/home/pages/${slug}/publish/`);
        return response.data;
    },

    unpublishPage: async (slug) => {
        const response = await api.post(`/home/pages/${slug}/unpublish/`);
        return response.data;
    },

    // Media
    getMediaAssets: async () => {
        const response = await api.get('/home/media/');
        return response.data;
    },

    uploadMedia: async (formData) => {
        const response = await api.post('/home/media/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteMediaAsset: async (id) => {
        const response = await api.delete(`/home/media/${id}/`);
        return response.data;
    },

    // Inquiries (Website app)
    getInquiries: async () => {
        const response = await api.get('/home/inquiries/');
        return response.data;
    },
    updateInquiry: async (id, data) => {
        const response = await api.patch(`/home/inquiries/${id}/`, data);
        return response.data;
    },
    deleteInquiry: async (id) => {
        const response = await api.delete(`/home/inquiries/${id}/`);
        return response.data;
    },

    // Signups
    getSignups: async () => {
        const response = await api.get('/home/signups/');
        return response.data;
    },

    // Announcements
    getAnnouncements: async () => {
        const response = await api.get('/home/announcements/');
        return response.data;
    },
    createAnnouncement: async (data) => {
        const response = await api.post('/home/announcements/', data);
        return response.data;
    },
    updateAnnouncement: async (id, data) => {
        const response = await api.patch(`/home/announcements/${id}/`, data);
        return response.data;
    },
    deleteAnnouncement: async (id) => {
        const response = await api.delete(`/home/announcements/${id}/`);
        return response.data;
    }
};

export default cmsService;
