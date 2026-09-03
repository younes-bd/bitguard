import apiClient from '@/core/api/client';

const fleetService = {
  getDashboardStats: () => apiClient.get('/fleet/dashboard/stats/').then(r => r.data),
  getVehicles: (params) => apiClient.get('/fleet/vehicles/', { params }).then(r => r.data),
  getVehicle: (id) => apiClient.get(`/fleet/vehicles/${id}/`).then(r => r.data),
  createVehicle: (data) => apiClient.post('/fleet/vehicles/', data).then(r => r.data),
  updateVehicle: (id, data) => apiClient.put(`/fleet/vehicles/${id}/`, data).then(r => r.data),
  deleteVehicle: (id) => apiClient.delete(`/fleet/vehicles/${id}/`),
  addMaintenance: (id, data) => apiClient.post(`/fleet/vehicles/${id}/add_maintenance/`, data).then(r => r.data),
  addFuel: (id, data) => apiClient.post(`/fleet/vehicles/${id}/add_fuel/`, data).then(r => r.data),
  getLogs: (params) => apiClient.get('/fleet/logs/', { params }).then(r => r.data),
  getContracts: (params) => apiClient.get('/fleet/contracts/', { params }).then(r => r.data),
};

export default fleetService;
