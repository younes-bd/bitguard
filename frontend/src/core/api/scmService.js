import client from './client';

const base = '/scm';

export const scmService = {
    // Dashboard
    getStats: () => client.get(`${base}/stats/`).then(r => r.data?.data ?? r.data ?? {}),

    // Vendors
    getVendors: (params = {}) => client.get(`${base}/vendors/`, { params }).then(r => r.data),
    getVendor: (id) => client.get(`${base}/vendors/${id}/`).then(r => r.data),
    createVendor: (data) => client.post(`${base}/vendors/`, data).then(r => r.data),
    updateVendor: (id, data) => client.patch(`${base}/vendors/${id}/`, data).then(r => r.data),
    deleteVendor: (id) => client.delete(`${base}/vendors/${id}/`),

    // Inventory
    getInventoryItems: (params = {}) => client.get(`${base}/inventory/`, { params }).then(r => r.data),
    getInventoryItem: (id) => client.get(`${base}/inventory/${id}/`).then(r => r.data),
    createInventoryItem: (data) => client.post(`${base}/inventory/`, data).then(r => r.data),
    updateInventoryItem: (id, data) => client.patch(`${base}/inventory/${id}/`, data).then(r => r.data),
    adjustStock: (id, qty) => client.post(`${base}/inventory/${id}/adjust/`, { quantity: qty }).then(r => r.data),

    // Purchase Orders
    getPurchaseOrders: (params = {}) => client.get(`${base}/purchase-orders/`, { params }).then(r => r.data),
    getPurchaseOrder: (id) => client.get(`${base}/purchase-orders/${id}/`).then(r => r.data),
    createPurchaseOrder: (data) => client.post(`${base}/purchase-orders/`, data).then(r => r.data),
    receivePurchaseOrder: (id) => client.post(`${base}/purchase-orders/${id}/receive/`).then(r => r.data),
    updatePurchaseOrder: (id, data) => client.patch(`${base}/purchase-orders/${id}/`, data).then(r => r.data),
};

export default scmService;
