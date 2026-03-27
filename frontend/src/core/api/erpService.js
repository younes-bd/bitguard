import client from './client';

export const erpService = {
    // Legacy Stubs for UI Stability
    getDashboardStats: async () => ({
        kpi: { active_projects: 0, planning_projects: 0, my_tasks: 0, overdue_tasks: 0, high_risks: 0, new_invoices: 0, budget_usage: 0, resource_utilization: 0, sla_health: 100 },
        financials: { total_revenue: 0, mrr: 0, total_costs: 0, net_profit: 0, profit_margin: 0 },
        system: { core: 'Operational', database: 'Operational' }
    }),
    getProjects: async () => [],
    getProject: async () => ({}),
    getEmployees: async () => [],
    getRisks: async () => [],
    getAssets: async () => [],

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
