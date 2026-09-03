import client from '@/core/api/client';

export const social = {
  getItems: (params) => client.get('/api/marketing/social/', { params }),
  getItem: (id) => client.get(`/api/marketing/social/${id}/`),
  createItem: (data) => client.post('/api/marketing/social/', data),
  updateItem: (id, data) => client.patch(`/api/marketing/social/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/marketing/social/${id}/`),
};

export const socialService = social;
