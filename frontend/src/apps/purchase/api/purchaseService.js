import client from '@/core/api/client';

class PurchaseService {
    async getStats() {
        const response = await client.get('purchase/dashboard/');
        return response.data?.data ?? response.data ?? {};
    }

    async getVendors(params = {}) {
        const response = await client.get('purchase/vendors/', { params });
        return response.data?.data ?? response.data;
    }

    async getVendor(id) {
        const response = await client.get(`purchase/vendors/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createVendor(data) {
        const response = await client.post('purchase/vendors/', data);
        return response.data?.data ?? response.data;
    }

    async updateVendor(id, data) {
        const response = await client.patch(`purchase/vendors/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteVendor(id) {
        return client.delete(`purchase/vendors/${id}/`);
    }

    async getPurchaseOrders(params = {}) {
        const response = await client.get('purchase/purchase-orders/', { params });
        return response.data?.data ?? response.data;
    }

    async getPurchaseOrder(id) {
        const response = await client.get(`purchase/purchase-orders/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createPurchaseOrder(data) {
        const response = await client.post('purchase/purchase-orders/', data);
        return response.data?.data ?? response.data;
    }

    async receivePurchaseOrder(id) {
        const response = await client.post(`purchase/purchase-orders/${id}/receive/`);
        return response.data?.data ?? response.data;
    }

    async downloadPurchaseOrder(id) {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            const res = await reportingService.generateReport(null, 'purchase.PurchaseOrder', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    }

    async updatePurchaseOrder(id, data) {
        const response = await client.patch(`purchase/purchase-orders/${id}/`, data);
        return response.data?.data ?? response.data;
    }
}

export const purchaseService = new PurchaseService();
export default purchaseService;
