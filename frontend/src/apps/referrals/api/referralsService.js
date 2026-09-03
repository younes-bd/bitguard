import client from '@/core/api/client';

export const referrals = {
  getItems: (params) => client.get('/api/hr/referrals/', { params }),
  getItem: (id) => client.get(`/api/hr/referrals/${id}/`),
  createItem: (data) => client.post('/api/hr/referrals/', data),
  updateItem: (id, data) => client.patch(`/api/hr/referrals/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/hr/referrals/${id}/`),
};

export const referralsService = referrals;
