import client from '@/core/api/client';

export const vendorBillService = {
    getVendorBills: async (params = {}) => {
        const r = await client.get('accounting/vendor-bills/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getVendorBill: async (id) => {
        const r = await client.get(`accounting/vendor-bills/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createVendorBill: async (data) => {
        const r = await client.post('accounting/vendor-bills/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateVendorBill: async (id, data) => {
        const r = await client.patch(`accounting/vendor-bills/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
