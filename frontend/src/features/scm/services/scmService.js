import client from '../../../shared/core/services/client';

const scmService = {
    // Vendors
    getVendors: async () => {
        // Placeholder: Replace with client.get('/scm/vendors/') when ready
        return new Promise(resolve => setTimeout(() => resolve({
            data: [
                { id: 1, name: 'Global Tech Supplies', rating: 'A', active: true },
                { id: 2, name: 'Logistics Prime', rating: 'A+', active: true },
                { id: 3, name: 'Component Source Inc.', rating: 'B', active: true },
            ]
        }), 500));
    },

    // Inventory
    getInventorySummary: async () => {
        return new Promise(resolve => setTimeout(() => resolve({
            data: {
                total_value: 1250000,
                low_stock_count: 8,
                pending_orders: 12,
                active_vendors: 124
            }
        }), 600));
    }
};

export default scmService;
