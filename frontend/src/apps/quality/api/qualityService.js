import apiClient from '@/core/api/client';

const qualityService = {
  getAlerts: (params) => apiClient.get('/quality/alerts/', { params }).then(r => r.data),
  getAlert: (id) => apiClient.get(`/quality/alerts/${id}/`).then(r => r.data),
  createAlert: (data) => apiClient.post('/quality/alerts/', data).then(r => r.data),
  updateAlert: (id, data) => apiClient.put(`/quality/alerts/${id}/`, data).then(r => r.data),
  deleteAlert: (id) => apiClient.delete(`/quality/alerts/${id}/`),
  getPoints: (params) => apiClient.get('/quality/points/', { params }).then(r => r.data),
  getChecks: (params) => apiClient.get('/quality/checks/', { params }).then(r => r.data),
};

export default qualityService;
