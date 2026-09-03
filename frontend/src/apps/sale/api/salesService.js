import client from '@/core/api/client';

export const salesService = {
    getSaleOrders: async (params = {}) => client.get('sale/orders/', { params }).then(r => r.data?.results ?? r.data),
    getSaleOrder: async (id) => client.get(`sale/orders/${id}/`).then(r => r.data),
    createSaleOrder: async (data) => client.post('sale/orders/', data).then(r => r.data),
    updateSaleOrder: async (id, data) => client.patch(`sale/orders/${id}/`, data).then(r => r.data),
    confirmSaleOrder: async (id) => {
        const r = await client.post(`sale/sale-orders/${id}/confirm/`);
        return r.data?.data ?? r.data;
    },
    downloadSaleOrder: async (id) => {
        try {
            const { default: reportingService } = await import('@/apps/reporting/api/reportingService');
            const res = await reportingService.generateReport(null, 'sale.SaleOrder', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    },
    cancelSaleOrder: async (id) => client.post(`sale/orders/${id}/cancel/`).then(r => r.data),
    invoiceSaleOrder: async (id) => client.post(`sale/orders/${id}/invoice-order/`).then(r => r.data),
    createDeliveryFromSale: async (id) => client.post(`sale/orders/${id}/create-delivery/`).then(r => r.data),

    // ——— SALE SETTINGS / CONFIG ———————————————————————————————————————————————,
    getSalesTeams: async (params = {}) => client.get('sale/teams/', { params }).then(r => r.data?.results ?? r.data),
    createSalesTeam: async (data) => client.post('sale/teams/', data).then(r => r.data),
    updateSalesTeam: async (id, data) => client.patch(`sale/teams/${id}/`, data).then(r => r.data),
    deleteSalesTeam: async (id) => client.delete(`sale/teams/${id}/`).then(r => r.data),
    getPricelists: async (params = {}) => client.get('sale/pricelists/', { params }).then(r => r.data?.results ?? r.data),
    createPricelist: async (data) => client.post('sale/pricelists/', data).then(r => r.data),
    updatePricelist: async (id, data) => client.patch(`sale/pricelists/${id}/`, data).then(r => r.data),
    deletePricelist: async (id) => client.delete(`sale/pricelists/${id}/`).then(r => r.data),
    getQuotationTemplates: async (params = {}) => client.get('sale/templates/', { params }).then(r => r.data?.results ?? r.data),
    createQuotationTemplate: async (data) => client.post('sale/templates/', data).then(r => r.data),
    updateQuotationTemplate: async (id, data) => client.patch(`sale/templates/${id}/`, data).then(r => r.data),
    deleteQuotationTemplate: async (id) => client.delete(`sale/templates/${id}/`).then(r => r.data),
    getShippingMethods: async (params = {}) => client.get('sale/shipping-methods/', { params }).then(r => r.data?.results ?? r.data),
    createShippingMethod: async (data) => client.post('sale/shipping-methods/', data).then(r => r.data),
    updateShippingMethod: async (id, data) => client.patch(`sale/shipping-methods/${id}/`, data).then(r => r.data),
    deleteShippingMethod: async (id) => client.delete(`sale/shipping-methods/${id}/`).then(r => r.data),

    // â”€â”€â”€ SCM GOODS RECEIPTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
};
