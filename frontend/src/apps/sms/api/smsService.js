import client from '@/core/api/client';

export const sms = {
  getItems: (params) => client.get('/api/marketing/sms/', { params }),
  getItem: (id) => client.get(`/api/marketing/sms/${id}/`),
  createItem: (data) => client.post('/api/marketing/sms/', data),
  updateItem: (id, data) => client.patch(`/api/marketing/sms/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/marketing/sms/${id}/`),
};

export const smsService = sms;
