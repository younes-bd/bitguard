import client from '@/core/api/client';

export const timesheets = {
  getItems: (params) => client.get('/timesheets/time-entries/', { params }),
  getItem: (id) => client.get(`/timesheets/time-entries/${id}/`),
  createItem: (data) => client.post('/timesheets/time-entries/', data),
  updateItem: (id, data) => client.patch(`/timesheets/time-entries/${id}/`, data),
  deleteItem: (id) => client.delete(`/timesheets/time-entries/${id}/`),
};

export const timesheetsService = timesheets;
