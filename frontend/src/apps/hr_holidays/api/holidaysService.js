import client from '@/core/api/client';

export const holidays = {
  getItems: (params) => client.get('/api/hr_holidays/', { params }),
  getItem: (id) => client.get(`/api/hr_holidays/${id}/`),
  createItem: (data) => client.post('/api/hr_holidays/', data),
  updateItem: (id, data) => client.patch(`/api/hr_holidays/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/hr_holidays/${id}/`),
};

export const holidaysService = holidays;
