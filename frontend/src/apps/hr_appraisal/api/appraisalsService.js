import client from '@/core/api/client';

export const appraisals = {
  getItems: (params) => client.get('/api/hr_appraisal/', { params }),
  getItem: (id) => client.get(`/api/hr_appraisal/${id}/`),
  createItem: (data) => client.post('/api/hr_appraisal/', data),
  updateItem: (id, data) => client.patch(`/api/hr_appraisal/${id}/`, data),
  deleteItem: (id) => client.delete(`/api/hr_appraisal/${id}/`),
};

export const appraisalsService = appraisals;
