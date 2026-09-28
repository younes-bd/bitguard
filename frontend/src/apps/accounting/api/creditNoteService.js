import client from '@/core/api/client';

export const creditNoteService = {
    getCreditNotes: async (params = {}) => {
        const r = await client.get('accounting/credit-notes/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createCreditNote: async (data) => {
        const r = await client.post('accounting/credit-notes/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
