import client from './client';

class InventoryService {
    async getStats() {
        const response = await client.get('inventory/dashboard/');
        return response.data?.data ?? response.data ?? {};
    }

    async getInventoryItems(params = {}) {
        const response = await client.get('inventory/items/', { params });
        return response.data?.data ?? response.data;
    }

    async getInventoryItem(id) {
        const response = await client.get(`inventory/items/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createInventoryItem(data) {
        const response = await client.post('inventory/items/', data);
        return response.data?.data ?? response.data;
    }

    async updateInventoryItem(id, data) {
        const response = await client.patch(`inventory/items/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async adjustStock(id, data) {
        const response = await client.post(`inventory/items/${id}/adjust_stock/`, data);
        return response.data;
    }

    async getGoodsReceipts(params = {}) {
        const response = await client.get('inventory/goods-receipts/', { params });
        return response.data?.data ?? response.data;
    }
}

export const inventoryService = new InventoryService();
export default inventoryService;
