import client from '@/core/api/client';

export const whatsapp = {
  getItems: (params) => client.get('/api/discuss/whatsapp/', { params }),
  getItem: (id) => client.get(`/api/discuss/whatsapp/${id}/`),
  createItem: (data) => client.post('/api/discuss/whatsapp/', data),
  updateItem: (id, data) => client.patch(`/api/discuss/whatsapp/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/discuss/whatsapp/${id}/`),
};

export const whatsappService = whatsapp;
