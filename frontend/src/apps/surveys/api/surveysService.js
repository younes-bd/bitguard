import client from '@/core/api/client';

export const surveys = {
  getItems: (params) => client.get('/api/surveys/', { params }),
  getItem: (id) => client.get(`/api/surveys/${id}/`),
  createItem: (data) => client.post('/api/surveys/', data),
  updateItem: (id, data) => client.patch(`/api/surveys/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/surveys/${id}/`),
};

export const surveysService = surveys;
