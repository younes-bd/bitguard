import apiClient from '@/core/api/client';

export const notificationsService = {
  getAll: (params) => apiClient.get('notifications/', { params }).then(r => r.data),
  getById: (id) => apiClient.get(`notifications/${id}/`).then(r => r.data),
  create: (data) => apiClient.post('notifications/', data).then(r => r.data),
  update: (id, data) => apiClient.patch(`notifications/${id}/`, data).then(r => r.data),
  delete: (id) => apiClient.delete(`notifications/${id}/`).then(r => r.data),
  markAllRead: () => apiClient.post('notifications/mark_all_read/').then(r => r.data),
  getUnreadCount: () => apiClient.get('notifications/?is_read=false&limit=1').then(r => {
    const data = r.data;
    return Array.isArray(data) ? data.length : (data?.count || 0);
  }),
};
