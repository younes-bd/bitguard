import api from './client';

export const cmsService = {
    // Pages
    getPages: () => api.get('home/pages/').then(res => res.data),
    getPageBySlug: (slug) => api.get(`home/pages/${slug}/`).then(res => res.data),
    createPage: (data) => api.post('home/pages/', data).then(res => res.data),
    updatePage: (slug, data) => api.patch(`home/pages/${slug}/`, data).then(res => res.data),
    deletePage: (slug) => api.delete(`home/pages/${slug}/`).then(res => res.data),

    // Inquiries
    getInquiries: () => api.get('home/inquiries/').then(res => res.data),
    updateInquiry: (id, data) => api.patch(`home/inquiries/${id}/`, data).then(res => res.data),
    deleteInquiry: (id) => api.delete(`home/inquiries/${id}/`).then(res => res.data),

    // Signups
    getSignups: () => api.get('home/signups/').then(res => res.data),

    // Announcements
    getAnnouncements: () => api.get('home/announcements/').then(res => res.data),
    createAnnouncement: (data) => api.post('home/announcements/', data).then(res => res.data),
    updateAnnouncement: (id, data) => api.patch(`home/announcements/${id}/`, data).then(res => res.data),
    deleteAnnouncement: (id) => api.delete(`home/announcements/${id}/`).then(res => res.data),
};
