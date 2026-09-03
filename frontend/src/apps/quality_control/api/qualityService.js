import apiClient from '@/core/api/client';

const qualityService = {
  getAlerts: (params) => apiClient.get('/quality_control/alerts/', { params }).then(r => r.data),
  getAlert: (id) => apiClient.get(`/quality_control/alerts/${id}/`).then(r => r.data),
  createAlert: (data) => apiClient.post('/quality_control/alerts/', data).then(r => r.data),
  updateAlert: (id, data) => apiClient.put(`/quality_control/alerts/${id}/`, data).then(r => r.data),
  deleteAlert: (id) => apiClient.delete(`/quality_control/alerts/${id}/`),
  getPoints: (params) => apiClient.get('/quality_control/points/', { params }).then(r => r.data),
  getChecks: (params) => apiClient.get('/quality_control/checks/', { params }).then(r => r.data),
};

export default qualityService;
