import client from '@/core/api/client';

export const accountingService = {
    getDashboardStats: async () => {
        const r = await client.get('accounting/dashboard/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    downloadDocument: async (model, id) => {
        const { default: reportsService } = await import('@/apps/reports/api/reportsService');
        const res = await reportsService.generateReport(null, model, id);
        if (res && res.file) {
            window.open(res.file, '_blank');
        }
        return res;
    }
};
