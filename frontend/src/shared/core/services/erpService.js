import client from './client';

export const erpService = {
    // Dashboard Stats
    getDashboardStats: async () => {
        try {
            const response = await client.get('erp/dashboard-stats/');
            return response.data;
        } catch (error) {
            console.error("Fetch ERP Dashboard Stats Error:", error);
            throw error;
        }
    },

    // Projects
    getProjects: async (params = {}) => {
        try {
            const response = await client.get('erp/projects/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Projects Error:", error);
            throw error;
        }
    },

    getProject: async (id) => {
        try {
            const response = await client.get(`erp/projects/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Fetch Project ${id} Error:`, error);
            throw error;
        }
    },

    createProject: async (data) => {
        try {
            const response = await client.post('erp/projects/', data);
            return response.data;
        } catch (error) {
            console.error("Create Project Error:", error);
            throw error;
        }
    },

    // Tasks (For Project Detail)
    getProjectTasks: async (projectId) => {
        try {
            // Assuming we have a filter or dedicated endpoint
            const response = await client.get('erp/tasks/', { params: { project: projectId } });
            return response.data;
        } catch (error) {
            console.error(`Fetch Tasks for Project ${projectId} Error:`, error);
            throw error;
        }
    },

    // Resources
    getEmployees: async () => {
        try {
            const response = await client.get('erp/workforce/');
            return response.data;
        } catch (error) {
            console.error("Fetch Employees Error:", error);
            throw error;
        }
    },

    // Financials
    getInvoices: async (params = {}) => {
        try {
            const response = await client.get('erp/invoices/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Invoices Error:", error);
            throw error;
        }
    },

    getInvoice: async (id) => {
        try {
            const response = await client.get(`erp/invoices/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Fetch Invoice ${id} Error:`, error);
            throw error;
        }
    },

    createInvoice: async (data) => {
        try {
            const response = await client.post('erp/invoices/', data);
            return response.data;
        } catch (error) {
            console.error("Create Invoice Error:", error);
            throw error;
        }
    },

    // Expenses
    getExpenses: async (params = {}) => {
        try {
            const response = await client.get('erp/expenses/', { params });
            return response.data;
        } catch (error) {
            console.error("Fetch Expenses Error:", error);
            throw error;
        }
    },

    getExpense: async (id) => {
        try {
            const response = await client.get(`erp/expenses/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Fetch Expense ${id} Error:`, error);
            throw error;
        }
    },

    createExpense: async (data) => {
        try {
            const response = await client.post('erp/expenses/', data);
            return response.data;
        } catch (error) {
            console.error("Create Expense Error:", error);
            throw error;
        }
    },

    // Risk & Assets
    getRisks: async () => {
        try {
            const response = await client.get('erp/risk/');
            return response.data;
        } catch (error) {
            console.error("Fetch Risks Error:", error);
            throw error;
        }
    },

    getAssets: async () => {
        try {
            const response = await client.get('erp/assets/');
            return response.data;
        } catch (error) {
            console.error("Fetch Assets Error:", error);
            throw error;
        }
    }
};
