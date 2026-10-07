import client from '@/core/api/client';

export const sms = {
  getItems: (params) => client.get('/sms/campaigns/', { params }),
  getItem: (id) => client.get(`/sms/campaigns/${id}/`),
  createItem: (data) => client.post('/sms/campaigns/', data),
  updateItem: (id, data) => client.patch(`/sms/campaigns/${id}/`, data),
  deleteItem: (id) => client.delete(`/sms/campaigns/${id}/`),
};

export const smsService = sms;
