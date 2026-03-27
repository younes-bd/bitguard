import api from './client';

export const notificationService = {
    getAll: async () => {
        const response = await api.get('/notifications/');
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/`, { is_read: true });
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.post('/notifications/mark_all_read/');
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/notifications/${id}/`);
    }
};
