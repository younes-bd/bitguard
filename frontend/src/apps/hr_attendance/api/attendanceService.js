import client from '@/core/api/client';

export const attendance = {
  getItems: (params) => client.get('/api/hr_attendance/', { params }),
  getItem: (id) => client.get(`/api/hr_attendance/${id}/`),
  createItem: (data) => client.post('/api/hr_attendance/', data),
  updateItem: (id, data) => client.patch(`/api/hr_attendance/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/hr_attendance/${id}/`),
};
export const attendanceService = attendance;
