import client from '@/core/api/client';

class ProcurementService {
    async getStats() {
        const response = await client.get('procurement/dashboard/');
        return response.data?.data ?? response.data ?? {};
    }

    async getVendors(params = {}) {
        const response = await client.get('procurement/vendors/', { params });
        return response.data?.data ?? response.data;
    }

    async getVendor(id) {
        const response = await client.get(`procurement/vendors/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createVendor(data) {
        const response = await client.post('procurement/vendors/', data);
        return response.data?.data ?? response.data;
    }

    async updateVendor(id, data) {
        const response = await client.patch(`procurement/vendors/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async deleteVendor(id) {
        return client.delete(`procurement/vendors/${id}/`);
    }

    async getProcurementOrders(params = {}) {
        const response = await client.get('procurement/procurement-orders/', { params });
        return response.data?.data ?? response.data;
    }

    async getProcurementOrder(id) {
        const response = await client.get(`procurement/procurement-orders/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createProcurementOrder(data) {
        const response = await client.post('procurement/procurement-orders/', data);
        return response.data?.data ?? response.data;
    }

    async receiveProcurementOrder(id) {
        const response = await client.post(`procurement/procurement-orders/${id}/receive/`);
        return response.data?.data ?? response.data;
    }

    async downloadProcurementOrder(id) {
        try {
            const { default: reportsService } = await import('@/apps/reports/api/reportsService');
            const res = await reportsService.generateReport(null, 'procurement.ProcurementOrder', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    }

    async updateProcurementOrder(id, data) {
        const response = await client.patch(`procurement/procurement-orders/${id}/`, data);
        return response.data?.data ?? response.data;
    }
}

export const procurementService = new ProcurementService();
export default procurementService;
