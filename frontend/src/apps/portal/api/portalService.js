import client from '@/core/api/client';

export const portalService = {
  // Aggregate portal endpoints acting as BFF (Backend-for-Frontend)
  getDashboardData: (params) => client.get('portal/dashboard/', { params }),
  
  // Invoices
  getInvoices: (params) => client.get('portal/invoices/', { params }),
  getInvoice: (id) => client.get(`portal/invoices/${id}/`),
  downloadInvoicePdf: (id) => client.get(`portal/invoices/${id}/download/`, { responseType: 'blob' }),
  
  // Tickets
  getTickets: (params) => client.get('portal/tickets/', { params }),
  getTicket: (id) => client.get(`portal/tickets/${id}/`),
  createTicket: (data) => client.post('portal/tickets/', data),
  
  // Documents
  getDocuments: (params) => client.get('portal/documents/', { params }),
  getDocument: (id) => client.get(`portal/documents/${id}/`),
  downloadDocument: (id) => client.get(`portal/documents/${id}/download/`, { responseType: 'blob' }),
  
  // Orders
  getOrders: (params) => client.get('portal/orders/', { params }),
  getOrder: (id) => client.get(`portal/orders/${id}/`),
  acceptQuote: (id) => client.patch(`portal/orders/${id}/`, { action: 'accept' }),
  
  // Projects
  getProjects: (params) => client.get('portal/projects/', { params }),
  
  // Subscriptions
  getSubscriptions: (params) => client.get('portal/subscriptions/', { params }),
  
  // Profile
  getProfile: () => client.get('portal/profile/'),
  updateProfile: (data) => client.patch('portal/profile/', data),
};
