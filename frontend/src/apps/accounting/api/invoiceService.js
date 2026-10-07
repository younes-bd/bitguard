import client from '@/core/api/client';

export const invoiceService = {
    getInvoices: async (params = {}) => {
        const r = await client.get('accounting/invoices/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getInvoice: async (id) => {
        const r = await client.get(`accounting/invoices/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createInvoice: async (data) => {
        const r = await client.post('accounting/invoices/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateInvoice: async (id, data) => {
        const r = await client.patch(`accounting/invoices/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteInvoice: async (id) => {
        const r = await client.delete(`accounting/invoices/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    acceptQuotation: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/accept-quotation/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    declineQuotation: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/decline-quotation/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getAgingReport: async () => {
        const r = await client.get('accounting/invoices/aging-report/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    downloadInvoice: async (id) => {
        try {
            const { default: reportsService } = await import('@/apps/reports/api/reportsService');
            const res = await reportsService.generateReport(null, 'accounting.Invoice', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    },
    convertQuotationToInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/convert/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    sendInvoiceToClient: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/send/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
