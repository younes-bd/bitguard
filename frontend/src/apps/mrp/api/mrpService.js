import apiClient from '@/core/api/client';

const mrpService = {
  getOrders: (params) => apiClient.get('/mrp/orders/', { params }).then(r => r.data?.data ?? r.data),
  getOrder: (id) => apiClient.get(`/mrp/orders/${id}/`).then(r => r.data?.data ?? r.data),
  createOrder: (data) => apiClient.post('/mrp/orders/', data).then(r => r.data?.data ?? r.data),
  updateOrder: (id, data) => apiClient.put(`/mrp/orders/${id}/`, data).then(r => r.data?.data ?? r.data),
  
  confirmOrder: (id) => apiClient.post(`/mrp/orders/${id}/confirm/`).then(r => r.data?.data ?? r.data),
  startOrder: (id) => apiClient.post(`/mrp/orders/${id}/start/`).then(r => r.data?.data ?? r.data),
  produceOrder: (id) => apiClient.post(`/mrp/orders/${id}/produce/`).then(r => r.data?.data ?? r.data),
  getOrderWorkOrders: (id) => apiClient.get(`/mrp/orders/${id}/work-orders/`).then(r => r.data?.data ?? r.data),
  
  getBOMs: (params) => apiClient.get('/mrp/boms/', { params }).then(r => r.data?.data ?? r.data),
  getBOM: (id) => apiClient.get(`/mrp/boms/${id}/`).then(r => r.data?.data ?? r.data),
  
  getWorkCenters: () => apiClient.get('/mrp/work-centers/').then(r => r.data?.data ?? r.data),
  
  getRoutings: () => apiClient.get('/mrp/routings/').then(r => r.data?.data ?? r.data),
  
  getWorkOrders: (params) => apiClient.get('/mrp/work-orders/', { params }).then(r => r.data?.data ?? r.data),
  updateWorkOrder: (id, data) => apiClient.patch(`/mrp/work-orders/${id}/`, data).then(r => r.data?.data ?? r.data),
  
  getScrapOrders: (params) => apiClient.get('/mrp/scrap-orders/', { params }).then(r => r.data?.data ?? r.data),
};

export default mrpService;
