import apiClient from '@/core/api/client';

export const inboxService = {
  getAll: (params) => apiClient.get('inbox/', { params }).then(r => r.data),
  getById: (id) => apiClient.get(`inbox/${id}/`).then(r => r.data),
  create: (data) => apiClient.post('inbox/', data).then(r => r.data),
  update: (id, data) => apiClient.patch(`inbox/${id}/`, data).then(r => r.data),
  delete: (id) => apiClient.delete(`inbox/${id}/`).then(r => r.data),
  markAllRead: () => apiClient.post('inbox/mark_all_read/').then(r => r.data),
  getUnreadCount: () => apiClient.get('inbox/?is_read=false&limit=1').then(r => {
    const data = r.data;
    return Array.isArray(data) ? data.length : (data?.count || 0);
  }),
};
