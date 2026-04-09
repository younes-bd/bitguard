import api from './client';

export const notificationService = {
    getAll: async () => {
        const response = await api.get('notifications/');
        return response.data?.data || [];
    },

    markAsRead: async (id) => {
        const response = await api.patch(`notifications/${id}/`, { is_read: true });
        return response.data.data;
    },

    markAllAsRead: async () => {
        const response = await api.post('notifications/mark_all_read/');
        return response.data.data;
    },

    delete: async (id) => {
        await api.delete(`notifications/${id}/`);
    }
};
