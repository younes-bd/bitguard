import { create } from 'zustand';

export const useSalesStore = create((set) => ({
    // State
    quotations: [],
    saleOrders: [],
    products: [],
    isLoading: false,
    error: null,
    
    // Actions
    setQuotations: (quotations) => set({ quotations }),
    setSaleOrders: (saleOrders) => set({ saleOrders }),
    setProducts: (products) => set({ products }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}));
