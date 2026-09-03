import apiClient from '@/core/api/client';

const plmService = {
  getECOs: (params) => apiClient.get('/mrp_plm/ecos/', { params }).then(r => r.data),
  getECO: (id) => apiClient.get(`/mrp_plm/ecos/${id}/`).then(r => r.data),
  createECO: (data) => apiClient.post('/mrp_plm/ecos/', data).then(r => r.data),
  updateECO: (id, data) => apiClient.put(`/mrp_plm/ecos/${id}/`, data).then(r => r.data),
  deleteECO: (id) => apiClient.delete(`/mrp_plm/ecos/${id}/`),
  getECOTypes: () => apiClient.get('/mrp_plm/eco-types/').then(r => r.data),
};

export default plmService;
