import client from '@/core/api/client';

export const knowledge = {
  getItems: (params) => client.get('/api/knowledge/', { params }),
  getItem: (id) => client.get(`/api/knowledge/${id}/`),
  createItem: (data) => client.post('/api/knowledge/', data),
  updateItem: (id, data) => client.patch(`/api/knowledge/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/knowledge/${id}/`),
};

export const knowledgeService = knowledge;
