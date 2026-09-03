import client from '@/core/api/client';

export const events = {
  getItems: (params) => client.get('/api/events/', { params }),
  getItem: (id) => client.get(`/api/events/${id}/`),
  createItem: (data) => client.post('/api/events/', data),
  updateItem: (id, data) => client.patch(`/api/events/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/events/${id}/`),
};

export const eventsService = events;
