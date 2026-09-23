import client from '@/core/api/client';

export const holidays = {
  getItems: (params) => client.get('/api/timeoff/', { params }),
  getItem: (id) => client.get(`/api/timeoff/${id}/`),
  createItem: (data) => client.post('/api/timeoff/', data),
  updateItem: (id, data) => client.patch(`/api/timeoff/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/timeoff/${id}/`),
};

export const holidaysService = holidays;
