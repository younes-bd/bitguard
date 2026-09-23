import client from '@/core/api/client';

export const surveys = {
  getItems: (params) => client.get('/surveys/', { params }),
  getItem: (id) => client.get(`/surveys/${id}/`),
  createItem: (data) => client.post('/surveys/', data),
  updateItem: (id, data) => client.patch(`/surveys/${id}/`, data),
  deleteItem: (id) => client.delete(`/surveys/${id}/`),
};

export const surveysService = surveys;
