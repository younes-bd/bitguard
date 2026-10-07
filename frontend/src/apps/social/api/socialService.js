import client from '@/core/api/client';

export const social = {
  getItems: (params) => client.get('/social/posts/', { params }),
  getItem: (id) => client.get(`/social/posts/${id}/`),
  createItem: (data) => client.post('/social/posts/', data),
  updateItem: (id, data) => client.patch(`/social/posts/${id}/`, data),
  deleteItem: (id) => client.delete(`/social/posts/${id}/`),
};

export const socialService = social;
