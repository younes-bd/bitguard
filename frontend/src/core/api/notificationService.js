import client from './client';

export const notificationService = {
    getNotifications: async (params = {}) => {
        const response = await client.get('notifications/', { params });
        return response.data?.results ?? response.data ?? [];
    },
    markRead: async (id) => {
        const response = await client.patch(`notifications/${id}/`, { is_read: true });
        return response.data?.data ?? response.data;
    },
    markAllRead: async () => {
        const response = await client.post('notifications/mark-all-read/');
        return response.data?.data ?? response.data;
    },
    getUnreadCount: async () => {
        const response = await client.get('notifications/unread-count/');
        return response.data?.data ?? response.data;
    },
    delete: async (id) => {
        const response = await client.delete(`notifications/${id}/`);
        return response.data?.data ?? response.data;
    },
    // Alias for getNotifications to match common naming patterns
    getAll: async (params = {}) => {
        const response = await client.get('notifications/', { params });
        return response.data?.results ?? response.data ?? [];
    }
};
