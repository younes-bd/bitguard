import client from '@/core/api/client';

export const timesheets = {
  getItems: (params) => client.get('/api/hr/timesheets/', { params }),
  getItem: (id) => client.get(`/api/hr/timesheets/${id}/`),
  createItem: (data) => client.post('/api/hr/timesheets/', data),
  updateItem: (id, data) => client.patch(`/api/hr/timesheets/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/hr/timesheets/${id}/`),
};

export const timesheetsService = timesheets;
