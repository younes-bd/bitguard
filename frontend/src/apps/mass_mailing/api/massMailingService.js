import client from '@/core/api/client';

export const massMailing = {
  getItems: (params) => client.get('/api/marketing/', { params }),
  getItem: (id) => client.get(`/api/marketing/${id}/`),
  createItem: (data) => client.post('/api/marketing/', data),
  updateItem: (id, data) => client.patch(`/api/marketing/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/marketing/${id}/`),
};

export const massMailingService = massMailing;
