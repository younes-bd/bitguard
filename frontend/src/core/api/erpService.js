import client from './client';

export const erpService = {
    // ─── DASHBOARD ───────────────────────────────────────────────────────────
    getDashboardStats: async () => {
        try {
            const r = await client.get('erp/dashboard/');
            return r.data?.data ?? r.data;
        } catch (e) { console.error(e); return null; }
    },

    // ─── INVOICES ─────────────────────────────────────────────────────────────
    getInvoices: async (params = {}) => {
        const r = await client.get('erp/invoices/', { params });
        return r.data?.data ?? r.data;
    },
    getInvoice: async (id) => {
        const r = await client.get(`erp/invoices/${id}/`);
        return r.data?.data ?? r.data;
    },
    createInvoice: async (data) => {
        const r = await client.post('erp/invoices/', data);
        return r.data?.data ?? r.data;
    },
    updateInvoice: async (id, data) => {
        const r = await client.patch(`erp/invoices/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    markInvoiceSent: async (id) => {
        const r = await client.post(`erp/invoices/${id}/mark-sent/`);
        return r.data?.data ?? r.data;
    },
    markInvoicePaid: async (id) => {
        const r = await client.post(`erp/invoices/${id}/mark-paid/`);
        return r.data?.data ?? r.data;
    },
    voidInvoice: async (id) => {
        const r = await client.post(`erp/invoices/${id}/void/`);
        return r.data?.data ?? r.data;
    },
    duplicateInvoice: async (id) => {
        const r = await client.post(`erp/invoices/${id}/duplicate/`);
        return r.data?.data ?? r.data;
    },
    sendInvoiceToClient: async (id) => {
        const r = await client.post(`erp/invoices/${id}/send-to-client/`);
        return r.data?.data ?? r.data;
    },
    convertProforma: async (id) => {
        const r = await client.post(`erp/invoices/${id}/convert-to-invoice/`);
        return r.data?.data ?? r.data;
    },
    getAgingReport: async () => {
        const r = await client.get('erp/invoices/aging-report/');
        return r.data?.data ?? r.data;
    },
    // Removed duplicate getProfitLoss (moved to reports section)
    downloadInvoice: async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = client.defaults.baseURL || 'http://127.0.0.1:8000/api/';
            const response = await fetch(`${baseUrl}erp/invoices/${id}/download-pdf/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant-ID': localStorage.getItem('tenant_id') || 'bitguard.tech'
                }
            });
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    },

    // ─── PAYMENTS ─────────────────────────────────────────────────────────────
    getPayments: async (params = {}) => {
        const r = await client.get('erp/payments/', { params });
        return r.data?.data ?? r.data;
    },
    createPayment: async (data) => {
        const r = await client.post('erp/payments/', data);
        return r.data?.data ?? r.data;
    },
    voidPayment: async (id) => {
        const r = await client.post(`erp/payments/${id}/void/`);
        return r.data?.data ?? r.data;
    },

    // ─── EXPENSES ─────────────────────────────────────────────────────────────
    getExpenses: async (params = {}) => {
        const r = await client.get('erp/expenses/', { params });
        return r.data?.data ?? r.data;
    },
    createExpense: async (data) => {
        const r = await client.post('erp/expenses/', data);
        return r.data?.data ?? r.data;
    },
    updateExpense: async (id, data) => {
        const r = await client.patch(`erp/expenses/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteExpense: async (id) => {
        const r = await client.delete(`erp/expenses/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── DELIVERY NOTES ───────────────────────────────────────────────────────
    getDeliveryNotes: async (params = {}) => {
        const r = await client.get('erp/delivery-notes/', { params });
        return r.data?.data ?? r.data;
    },
    getDeliveryNote: async (id) => {
        const r = await client.get(`erp/delivery-notes/${id}/`);
        return r.data?.data ?? r.data;
    },
    createDeliveryNote: async (data) => {
        const r = await client.post('erp/delivery-notes/', data);
        return r.data?.data ?? r.data;
    },
    updateDeliveryNoteStatus: async (id, newStatus) => {
        const r = await client.post(`erp/delivery-notes/${id}/update-status/`, { status: newStatus });
        return r.data?.data ?? r.data;
    },
    downloadDeliveryNote: async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const baseUrl = client.defaults.baseURL || 'http://127.0.0.1:8000/api/';
            const response = await fetch(`${baseUrl}erp/delivery-notes/${id}/download-pdf/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant-ID': localStorage.getItem('tenant_id') || 'bitguard.tech'
                }
            });
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `DeliveryNote-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    },

    // ─── VENDORS ──────────────────────────────────────────────────────────────
    getVendors: async (params = {}) => {
        const r = await client.get('erp/vendors/', { params });
        return r.data?.data ?? r.data;
    },
    getVendor: async (id) => {
        const r = await client.get(`erp/vendors/${id}/`);
        return r.data?.data ?? r.data;
    },
    createVendor: async (data) => {
        const r = await client.post('erp/vendors/', data);
        return r.data?.data ?? r.data;
    },
    updateVendor: async (id, data) => {
        const r = await client.patch(`erp/vendors/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteVendor: async (id) => {
        const r = await client.delete(`erp/vendors/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── PURCHASE ORDERS ──────────────────────────────────────────────────────
    getPurchaseOrders: async (params = {}) => {
        const r = await client.get('erp/purchase-orders/', { params });
        return r.data?.data ?? r.data;
    },
    getPurchaseOrder: async (id) => {
        const r = await client.get(`erp/purchase-orders/${id}/`);
        return r.data?.data ?? r.data;
    },
    createPurchaseOrder: async (data) => {
        const r = await client.post('erp/purchase-orders/', data);
        return r.data?.data ?? r.data;
    },
    updatePurchaseOrder: async (id, data) => {
        const r = await client.patch(`erp/purchase-orders/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    receivePurchaseOrder: async (id) => {
        const r = await client.post(`erp/purchase-orders/${id}/receive/`);
        return r.data?.data ?? r.data;
    },

    // ─── RECURRING INVOICES ───────────────────────────────────────────────────
    getRecurringInvoices: async () => {
        const r = await client.get('erp/recurring-invoices/');
        return r.data?.data ?? r.data;
    },
    createRecurringInvoice: async (data) => {
        const r = await client.post('erp/recurring-invoices/', data);
        return r.data?.data ?? r.data;
    },
    updateRecurringInvoice: async (id, data) => {
        const r = await client.patch(`erp/recurring-invoices/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    toggleRecurring: async (id) => {
        const r = await client.post(`erp/recurring-invoices/${id}/toggle/`);
        return r.data?.data ?? r.data;
    },
    runRecurringNow: async (id) => {
        const r = await client.post(`erp/recurring-invoices/${id}/run-now/`);
        return r.data?.data ?? r.data;
    },

    // ─── REPORTS ──────────────────────────────────────────────────────────────
    getClientStatement: async (clientId) => {
        const r = await client.get(`erp/client-statement/${clientId}/`);
        return r.data?.data ?? r.data;
    },

    // ─── TAXES / LEDGER / BUDGETS ─────────────────────────────────────────────
    getTaxes: async () => {
        const r = await client.get('erp/taxes/');
        return r.data?.data ?? r.data;
    },
    getLedger: async (params = {}) => {
        const r = await client.get('erp/ledger/', { params });
        return r.data?.data ?? r.data;
    },
    getBudgets: async () => {
        const r = await client.get('erp/budgets/');
        return r.data?.data ?? r.data;
    },
    getCostCenters: async () => {
        const r = await client.get('erp/cost-centers/');
        return r.data?.data ?? r.data;
    },

    // ─── PROJECTS ─────────────────────────────────────────────────────────────
    getProjects: async (params = {}) => {
        const r = await client.get('erp/projects/', { params });
        return r.data?.data ?? r.data;
    },
    createProject: async (data) => {
        const r = await client.post('erp/projects/', data);
        return r.data?.data ?? r.data;
    },
    updateProject: async (id, data) => {
        const r = await client.patch(`erp/projects/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    getProject: async (id) => {
        const r = await client.get(`erp/projects/${id}/`);
        return r.data?.data ?? r.data;
    },
    deleteProject: async (id) => {
        const r = await client.delete(`erp/projects/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── RISKS ────────────────────────────────────────────────────────────────
    getRisks: async (params = {}) => {
        const r = await client.get('erp/risks/', { params });
        return r.data?.data ?? r.data;
    },
    createRisk: async (data) => {
        const r = await client.post('erp/risks/', data);
        return r.data?.data ?? r.data;
    },
    updateRisk: async (id, data) => {
        const r = await client.patch(`erp/risks/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteRisk: async (id) => {
        const r = await client.delete(`erp/risks/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── PHASE 3: FINANCIAL ACCOUNTING ────────────────────────────────────────
    getAccounts: async (params = {}) => {
        const r = await client.get('erp/accounts/', { params });
        return r.data?.data ?? r.data;
    },
    createAccount: async (data) => {
        const r = await client.post('erp/accounts/', data);
        return r.data?.data ?? r.data;
    },
    getJournalEntries: async (params = {}) => {
        const r = await client.get('erp/journal-entries/', { params });
        return r.data?.data ?? r.data;
    },
    createJournalEntry: async (data) => {
        const r = await client.post('erp/journal-entries/', data);
        return r.data?.data ?? r.data;
    },
    getBankAccounts: async (params = {}) => {
        const r = await client.get('erp/bank-accounts/', { params });
        return r.data?.data ?? r.data;
    },
    createBankAccount: async (data) => {
        const r = await client.post('erp/bank-accounts/', data);
        return r.data?.data ?? r.data;
    },
    getBankTransactions: async (params = {}) => {
        const r = await client.get('erp/bank-transactions/', { params });
        return r.data?.data ?? r.data;
    },
    getBalanceSheet: async (date) => {
        const r = await client.get('erp/reports/balance-sheet/', { params: { date } });
        return r.data?.data ?? r.data;
    },
    getCashFlow: async (start_date, end_date) => {
        const r = await client.get('erp/reports/cash-flow/', { params: { start_date, end_date } });
        return r.data?.data ?? r.data;
    },
    getFixedAssets: async (params = {}) => {
        const r = await client.get('erp/fixed-assets/', { params });
        return r.data?.data ?? r.data;
    },
    createFixedAsset: async (data) => {
        const r = await client.post('erp/fixed-assets/', data);
        return r.data?.data ?? r.data;
    },
    runDepreciation: async () => {
        const r = await client.post('erp/fixed-assets/run-depreciation/');
        return r.data?.data ?? r.data;
    },

    // ─── EXPENSE WORKFLOW ────────────────────────────────────────────────
    approveExpense: async (id) => {
        const r = await client.post(`erp/expenses/${id}/approve/`);
        return r.data?.data ?? r.data;
    },
    rejectExpense: async (id) => {
        const r = await client.post(`erp/expenses/${id}/reject/`);
        return r.data?.data ?? r.data;
    },
    reimburseExpense: async (id) => {
        const r = await client.post(`erp/expenses/${id}/reimburse/`);
        return r.data?.data ?? r.data;
    },

    getProfitLoss: async (date_from, date_to) => {
        const r = await client.get('erp/reports/profit-loss/', { params: { date_from, date_to } });
        return r.data?.data ?? r.data;
    },
    getMonthlyFinancials: async (months = 6) => {
        const r = await client.get('erp/dashboard/monthly/', { params: { months } });
        return r.data?.data ?? r.data;
    },

    // ─── CREDIT NOTES ─────────────────────────────────────────────────────────
    getCreditNotes: async (params = {}) => {
        const r = await client.get('erp/credit-notes/', { params });
        return r.data?.data ?? r.data;
    },
    applyCreditNote: async (id, invoiceId) => {
        const r = await client.post(`erp/credit-notes/${id}/apply/`, { invoice_id: invoiceId });
        return r.data?.data ?? r.data;
    },
};
