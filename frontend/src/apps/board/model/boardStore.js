import { create } from 'zustand';
import boardService from '../api/boardService';

const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const useBoardStore = create((set, get) => ({
    metrics: null,
    health: null,
    recentActivity: [],
    lastFetched: null,
    isLoading: false,
    error: null,

    fetchMetrics: async (params = {}) => {
        const { lastFetched, isLoading } = get();
        const now = Date.now();
        if (isLoading) return;
        if (lastFetched && (now - lastFetched) < CACHE_TTL_MS && !params.force) return;

        set({ isLoading: true, error: null });
        try {
            const [metricsRes, healthRes] = await Promise.all([
                boardService.getMetrics(params),
                boardService.getSystemHealth().catch(() => ({})),
            ]);
            set({
                metrics: metricsRes?.data || metricsRes || {},
                health: healthRes?.data || healthRes || {},
                lastFetched: now,
                isLoading: false,
            });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchActivity: async () => {
        try {
            const res = await boardService.getRecentActivity(10);
            set({ recentActivity: Array.isArray(res) ? res : (res?.results || []) });
        } catch (err) {
            set({ recentActivity: [] });
        }
    },

    invalidate: () => set({ metrics: null, health: null, lastFetched: null }),

    reset: () => set({ metrics: null, health: null, recentActivity: [], lastFetched: null, isLoading: false, error: null }),
}));

export default useBoardStore;
