import apiClient from './client';
import Dexie from 'dexie';

// Initialize Offline Database
export const posDb = new Dexie('BitGuardPOS');
posDb.version(1).stores({
  products: 'id, name, price, sku', // Cached products for offline lookup
  orders: '++localId, session_id, payload, status' // Offline orders queue
});

const posService = {
  getSessions: (params) => apiClient.get('/pos/sessions/', { params }).then(r => r.data),
  getSession: (id) => apiClient.get(`/pos/sessions/${id}/`).then(r => r.data),
  createSession: (data) => apiClient.post('/pos/sessions/', data).then(r => r.data),
  updateSession: (id, data) => apiClient.put(`/pos/sessions/${id}/`, data).then(r => r.data),
  deleteSession: (id) => apiClient.delete(`/pos/sessions/${id}/`),
  openSession: (id, data) => apiClient.post(`/pos/sessions/${id}/open/`, data).then(r => r.data),
  closeSession: (id, data) => apiClient.post(`/pos/sessions/${id}/close/`, data).then(r => r.data),
  getOrders: (params) => apiClient.get('/pos/orders/', { params }).then(r => r.data),
  getPayments: (params) => apiClient.get('/pos/payments/', { params }).then(r => r.data),
  getConfigs: () => apiClient.get('/pos/configs/').then(r => r.data),
  getFloors: (params) => apiClient.get('/pos/floors/', { params }).then(r => r.data),
  getTables: (params) => apiClient.get('/pos/tables/', { params }).then(r => r.data),
  getPrinters: (params) => apiClient.get('/pos/printers/', { params }).then(r => r.data),

  // Offline Sync Methods
  cacheProducts: async () => {
    try {
      const response = await apiClient.get('/store/products/');
      const products = Array.isArray(response.data) ? response.data : response.data.results || [];
      await posDb.products.bulkPut(products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        sku: p.sku,
        image: p.image
      })));
      return true;
    } catch (error) {
      console.error("Failed to cache products:", error);
      return false;
    }
  },
  
  syncOfflineOrders: async () => {
    const pending = await posDb.orders.where({ status: 'pending' }).toArray();
    if (pending.length === 0) return;
    
    console.log(`Syncing ${pending.length} offline orders...`);
    for (const order of pending) {
      try {
        await apiClient.post('/pos/orders/', order.payload);
        await posDb.orders.update(order.localId, { status: 'synced' });
      } catch (err) {
        console.error("Failed to sync order", order.localId, err);
      }
    }
  },
  
  createOrder: async (payload) => {
    if (!navigator.onLine) {
      // Save offline
      await posDb.orders.add({ payload, status: 'pending' });
      return { success: true, offline: true };
    }
    // Online
    try {
      const response = await apiClient.post('/pos/orders/', payload);
      return { success: true, data: response.data };
    } catch (err) {
      // Fallback to offline cache if API fails
      await posDb.orders.add({ payload, status: 'pending' });
      return { success: true, offline: true };
    }
  }
};

export default posService;
