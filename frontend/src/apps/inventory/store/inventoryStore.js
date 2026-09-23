import { create } from 'zustand';

export const useInventoryStore = create((set) => ({
    // State
    products: [],
    stockMoves: [],
    warehouses: [],
    isLoading: false,
    error: null,
    
    // Actions
    setProducts: (products) => set({ products }),
    setInventoryMoves: (stockMoves) => set({ stockMoves }),
    setWarehouses: (warehouses) => set({ warehouses }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}));
