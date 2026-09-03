import client from '@/core/api/client';

export const esg = {
  getItems: (params) => client.get('/api/esg/', { params }),
  getItem: (id) => client.get(`/api/esg/${id}/`),
  createItem: (data) => client.post('/api/esg/', data),
  updateItem: (id, data) => client.patch(`/api/esg/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/esg/${id}/`),
};

export const esgService = esg;
