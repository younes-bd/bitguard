import client from '@/core/api/client';

export const appraisals = {
  getItems: (params) => client.get('/api/performance/', { params }),
  getItem: (id) => client.get(`/api/performance/${id}/`),
  createItem: (data) => client.post('/api/performance/', data),
  updateItem: (id, data) => client.patch(`/api/performance/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/performance/${id}/`),
};

export const appraisalsService = appraisals;
