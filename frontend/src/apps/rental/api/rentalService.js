import apiClient from '@/core/api/client';

const rentalService = {
  getOrders: (params) => apiClient.get('/rental/orders/', { params }).then(r => r.data),
  getOrder: (id) => apiClient.get(`/rental/orders/${id}/`).then(r => r.data),
  createOrder: (data) => apiClient.post('/rental/orders/', data).then(r => r.data),
  updateOrder: (id, data) => apiClient.put(`/rental/orders/${id}/`, data).then(r => r.data),
  deleteOrder: (id) => apiClient.delete(`/rental/orders/${id}/`),
  getOrderLines: (params) => apiClient.get('/rental/order-lines/', { params }).then(r => r.data),
  createOrderLine: (data) => apiClient.post('/rental/order-lines/', data).then(r => r.data),
};

export default rentalService;
