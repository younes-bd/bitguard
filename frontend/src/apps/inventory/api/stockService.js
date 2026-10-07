import client from '@/core/api/client';

export const stockService = {
    getShippingNotes: async (params = {}) => {
        const queryParams = { picking_type: 'shipping', ...params };
        const r = await client.get('stock/pickings/', { params: queryParams });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getShippingNote: async (id) => {
        const r = await client.get(`stock/pickings/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createShippingNote: async (data) => {
        const payload = { picking_type: 'shipping', ...data };
        const r = await client.post('stock/pickings/', payload);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateShippingNoteStatus: async (id, newStatus) => {
        const r = await client.patch(`stock/pickings/${id}/`, { state: newStatus });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    validateShippingNote: async (id) => {
        const r = await client.post(`stock/shipping-notes/${id}/validate/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    downloadShippingNote: async (id) => {
        try {
            const { default: reportsService } = await import('@/apps/reports/api/reportsService');
            const res = await reportsService.generateReport(null, 'erp.ShippingNote', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    }
};
