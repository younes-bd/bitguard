import client from '@/core/api/client';

export const attendance = {
  getItems: (params) => client.get('/api/timeclock/', { params }),
  getItem: (id) => client.get(`/api/timeclock/${id}/`),
  createItem: (data) => client.post('/api/timeclock/', data),
  updateItem: (id, data) => client.patch(`/api/timeclock/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/timeclock/${id}/`),
};
export const attendanceService = attendance;
