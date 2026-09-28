import apiClient from '@/core/api/client';

const BASE_URL = 'core/bank-accounts/';

export const bankAccountService = {
  getAll: (params) => apiClient.get(BASE_URL, { params }),
  getById: (id) => apiClient.get(`${BASE_URL}${id}/`),
  create: (data) => apiClient.post(BASE_URL, data),
  update: (id, data) => apiClient.patch(`${BASE_URL}${id}/`, data),
  delete: (id) => apiClient.delete(`${BASE_URL}${id}/`),
};
