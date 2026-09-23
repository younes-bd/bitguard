import client from '@/core/api/client';

export const whatsapp = {
  getItems: (params) => client.get('/whatsapp/whatsapp/', { params }),
  getItem: (id) => client.get(`/whatsapp/whatsapp/${id}/`),
  createItem: (data) => client.post('/whatsapp/whatsapp/', data),
  updateItem: (id, data) => client.patch(`/whatsapp/whatsapp/${id}/`, data),
  deleteItem: (id) => client.delete(`/whatsapp/whatsapp/${id}/`),
};

export const whatsappService = whatsapp;
