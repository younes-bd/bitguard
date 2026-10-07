import client from '@/core/api/client';

export const financialReportService = {
    getProfitLoss: async (start, end) => {
        const r = await client.get('accounting/reports/profit-loss/', { params: { start_date: start, end_date: end } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getCashFlow: async (start, end) => {
        const r = await client.get('accounting/reports/cash-flow/', { params: { start_date: start, end_date: end } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getBalanceSheet: async (date) => {
        const r = await client.get('accounting/reports/balance-sheet/', { params: { as_of: date } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getAgedReceivables: async () => {
        const r = await client.get('accounting/reports/aged-receivables/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getTaxReport: async (start, end) => {
        const r = await client.get('accounting/reports/tax/', { params: { start_date: start, end_date: end } });
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
