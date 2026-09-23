import client from '@/core/api/client';

export const events = {
  getItems: (params) => client.get('/events/', { params }),
  getItem: (id) => client.get(`/events/${id}/`),
  createItem: (data) => client.post('/events/', data),
  updateItem: (id, data) => client.patch(`/events/${id}/`, data),
  deleteItem: (id) => client.delete(`/events/${id}/`),
};

export const eventsService = events;
