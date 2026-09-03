import { create } from 'zustand';

export const useAccountingStore = create((set) => ({
    // State
    invoices: [],
    bills: [],
    journalEntries: [],
    isLoading: false,
    error: null,
    
    // Actions
    setInvoices: (invoices) => set({ invoices }),
    setBills: (bills) => set({ bills }),
    setJournalEntries: (journalEntries) => set({ journalEntries }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}));
