import client from '@/core/api/client';

export const equity = {
  getItems: (params) => client.get('/api/equity/', { params }),
  getItem: (id) => client.get(`/api/equity/${id}/`),
  createItem: (data) => client.post('/api/equity/', data),
  updateItem: (id, data) => client.patch(`/api/equity/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/equity/${id}/`),
};

export const equityService = equity;
