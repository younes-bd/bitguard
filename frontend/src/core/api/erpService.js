import client from './client';

export const erpService = {
    // Dashboard Stats calculated from real data
    getDashboardStats: async () => {
        try {
            const [invoices, payments, expenses] = await Promise.all([
                client.get('erp/invoices/').then(r => r.data.data?.results || r.data.data || []),
                client.get('erp/payments/').then(r => r.data.data?.results || r.data.data || []),
                client.get('erp/expenses/').then(r => r.data.data?.results || r.data.data || [])
            ]);
            
            const total_revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseFloat(i.total), 0);
            const total_costs = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

            return {
                financials: { total_revenue, mrr: 0, total_costs, net_profit: total_revenue - total_costs, profit_margin: total_revenue ? ((total_revenue - total_costs)/total_revenue * 100) : 0 },
                kpi: { new_invoices: invoices.length, overdue_tasks: 0, active_projects: 0 },
                system: { core: 'Operational', database: 'Operational' }
            };
        } catch (e) {
            console.error(e);
            return { financials: {}, kpi: {}, system: {} };
        }
    },

    // Invoices
    getInvoices: async (params = {}) => {
        try {
            const response = await client.get('erp/invoices/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Invoices Error:", error);
            throw error;
        }
    },
    getInvoice: async (id) => {
        try {
            const response = await client.get(`erp/invoices/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Fetch Invoice ${id} Error:`, error);
            throw error;
        }
    },
    createInvoice: async (data) => {
        try {
            const response = await client.post('erp/invoices/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Invoice Error:", error);
            throw error;
        }
    },

    // Payments
    getPayments: async (params = {}) => {
        try {
            const response = await client.get('erp/payments/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Payments Error:", error);
            throw error;
        }
    },
    createPayment: async (data) => {
        try {
            const response = await client.post('erp/payments/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Payment Error:", error);
            throw error;
        }
    },

    // Expenses
    getExpenses: async (params = {}) => {
        try {
            const response = await client.get('erp/expenses/', { params });
            return response.data.data;
        } catch (error) {
            console.error("Fetch Expenses Error:", error);
            throw error;
        }
    },
    getExpense: async (id) => {
        try {
            const response = await client.get(`erp/expenses/${id}/`);
            return response.data.data;
        } catch (error) {
            console.error(`Fetch Expense ${id} Error:`, error);
            throw error;
        }
    },
    createExpense: async (data) => {
        try {
            const response = await client.post('erp/expenses/', data);
            return response.data.data;
        } catch (error) {
            console.error("Create Expense Error:", error);
            throw error;
        }
    }
};
