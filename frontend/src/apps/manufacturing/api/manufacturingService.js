import apiClient from '@/core/api/client';

const manufacturingService = {
  getOrders: (params) => apiClient.get('/manufacturing/orders/', { params }).then(r => r.data?.data ?? r.data),
  getOrder: (id) => apiClient.get(`/manufacturing/orders/${id}/`).then(r => r.data?.data ?? r.data),
  createOrder: (data) => apiClient.post('/manufacturing/orders/', data).then(r => r.data?.data ?? r.data),
  updateOrder: (id, data) => apiClient.put(`/manufacturing/orders/${id}/`, data).then(r => r.data?.data ?? r.data),
  
  confirmOrder: (id) => apiClient.post(`/manufacturing/orders/${id}/confirm/`).then(r => r.data?.data ?? r.data),
  startOrder: (id) => apiClient.post(`/manufacturing/orders/${id}/start/`).then(r => r.data?.data ?? r.data),
  produceOrder: (id) => apiClient.post(`/manufacturing/orders/${id}/produce/`).then(r => r.data?.data ?? r.data),
  getOrderWorkOrders: (id) => apiClient.get(`/manufacturing/orders/${id}/work-orders/`).then(r => r.data?.data ?? r.data),
  
  getBOMs: (params) => apiClient.get('/manufacturing/boms/', { params }).then(r => r.data?.data ?? r.data),
  getBOM: (id) => apiClient.get(`/manufacturing/boms/${id}/`).then(r => r.data?.data ?? r.data),
  
  getWorkCenters: () => apiClient.get('/manufacturing/work-centers/').then(r => r.data?.data ?? r.data),
  
  getRoutings: () => apiClient.get('/manufacturing/routings/').then(r => r.data?.data ?? r.data),
  
  getWorkOrders: (params) => apiClient.get('/manufacturing/work-orders/', { params }).then(r => r.data?.data ?? r.data),
  updateWorkOrder: (id, data) => apiClient.patch(`/manufacturing/work-orders/${id}/`, data).then(r => r.data?.data ?? r.data),
  
  getScrapOrders: (params) => apiClient.get('/manufacturing/scrap-orders/', { params }).then(r => r.data?.data ?? r.data),
};

export default manufacturingService;
