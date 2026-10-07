import client from '@/core/api/client';

export const journalService = {
    getAccountJournals: async (params = {}) => {
        const r = await client.get('accounting/journals/', { params });
        return r.data?.data ?? r.data;
    },
    createJournal: async (data) => {
        const r = await client.post('accounting/journals/', data);
        return r.data?.data ?? r.data;
    },
    getJournalEntries: async (params = {}) => {
        const r = await client.get('accounting/journal-entries/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    postJournalEntry: async (id) => {
        const r = await client.post(`accounting/journal-entries/${id}/post/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
