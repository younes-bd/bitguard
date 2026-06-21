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
        const r = await client.get('accounting/invoices/', { params });
        return r.data?.data ?? r.data;
    },
    getInvoice: async (id) => {
        const r = await client.get(`accounting/invoices/${id}/`);
        return r.data?.data ?? r.data;
    },
    createInvoice: async (data) => {
        const r = await client.post('accounting/invoices/', data);
        return r.data?.data ?? r.data;
    },
    updateInvoice: async (id, data) => {
        const r = await client.patch(`accounting/invoices/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    markInvoiceSent: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/mark-sent/`);
        return r.data?.data ?? r.data;
    },
    markInvoicePaid: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/mark-paid/`);
        return r.data?.data ?? r.data;
    },
    voidInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/void/`);
        return r.data?.data ?? r.data;
    },
    duplicateInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/duplicate/`);
        return r.data?.data ?? r.data;
    },
    sendInvoiceToClient: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/send-to-client/`);
        return r.data?.data ?? r.data;
    },
    convertProforma: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/convert-to-invoice/`);
        return r.data?.data ?? r.data;
    },
    convertQuotationToInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/convert-to-invoice/`);
        return r.data?.data ?? r.data;
    },
    acceptQuotation: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/accept-quotation/`);
        return r.data?.data ?? r.data;
    },
    declineQuotation: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/decline-quotation/`);
        return r.data?.data ?? r.data;
    },
    getAgingReport: async () => {
        const r = await client.get('accounting/invoices/aging-report/');
        return r.data?.data ?? r.data;
    },
    downloadInvoice: async (id) => {
        try {
            const { default: reportingService } = await import('./reportingService');
            const res = await reportingService.generateReport(null, 'accounting.Invoice', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    },

    // ─── PAYMENTS ─────────────────────────────────────────────────────────────
    getPayments: async (params = {}) => {
        const r = await client.get('accounting/payments/', { params });
        return r.data?.data ?? r.data;
    },
    createPayment: async (data) => {
        const r = await client.post('accounting/payments/', data);
        return r.data?.data ?? r.data;
    },
    voidPayment: async (id) => {
        const r = await client.post(`accounting/payments/${id}/void/`);
        return r.data?.data ?? r.data;
    },

    // ─── EXPENSES ─────────────────────────────────────────────────────────────
    getExpenses: async (params = {}) => {
        const r = await client.get('accounting/expenses/', { params });
        return r.data?.data ?? r.data;
    },
    createExpense: async (data) => {
        const r = await client.post('accounting/expenses/', data);
        return r.data?.data ?? r.data;
    },
    updateExpense: async (id, data) => {
        const r = await client.patch(`accounting/expenses/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteExpense: async (id) => {
        const r = await client.delete(`accounting/expenses/${id}/`);
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
            const { default: reportingService } = await import('./reportingService');
            const res = await reportingService.generateReport(null, 'erp.DeliveryNote', id);
            if (res && res.file) {
                window.open(res.file, '_blank');
            }
        } catch (error) {
            console.error("Download Error:", error);
            throw error;
        }
    },

    // ─── VENDORS ──────────────────────────────────────────────────────────────
    getVendors: async (params = {}) => {
        const r = await client.get('purchase/vendors/', { params });
        return r.data?.data ?? r.data;
    },
    getVendor: async (id) => {
        const r = await client.get(`purchase/vendors/${id}/`);
        return r.data?.data ?? r.data;
    },
    createVendor: async (data) => {
        const r = await client.post('purchase/vendors/', data);
        return r.data?.data ?? r.data;
    },
    updateVendor: async (id, data) => {
        const r = await client.patch(`purchase/vendors/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteVendor: async (id) => {
        const r = await client.delete(`purchase/vendors/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── PURCHASE ORDERS ──────────────────────────────────────────────────────
    getPurchaseOrders: async (params = {}) => {
        const r = await client.get('purchase/purchase-orders/', { params });
        return r.data?.data ?? r.data;
    },
    downloadPurchaseOrder: async (id) => {
        const { default: reportingService } = await import('./reportingService');
        const res = await reportingService.generateReport(null, 'purchase.PurchaseOrder', id);
        if (res && res.file) {
            window.open(res.file, '_blank');
        }
    },
    getPurchaseOrder: async (id) => {
        const r = await client.get(`purchase/purchase-orders/${id}/`);
        return r.data?.data ?? r.data;
    },
    createPurchaseOrder: async (data) => {
        const r = await client.post('purchase/purchase-orders/', data);
        return r.data?.data ?? r.data;
    },
    updatePurchaseOrder: async (id, data) => {
        const r = await client.patch(`purchase/purchase-orders/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    receivePurchaseOrder: async (id) => {
        const r = await client.post(`purchase/purchase-orders/${id}/receive/`);
        return r.data?.data ?? r.data;
    },

    // ─── RECURRING INVOICES ───────────────────────────────────────────────────
    getRecurringInvoices: async () => {
        const r = await client.get('accounting/recurring-invoices/');
        return r.data?.data ?? r.data;
    },
    createRecurringInvoice: async (data) => {
        const r = await client.post('accounting/recurring-invoices/', data);
        return r.data?.data ?? r.data;
    },
    updateRecurringInvoice: async (id, data) => {
        const r = await client.patch(`accounting/recurring-invoices/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    toggleRecurring: async (id) => {
        const r = await client.post(`accounting/recurring-invoices/${id}/toggle/`);
        return r.data?.data ?? r.data;
    },
    runRecurringNow: async (id) => {
        const r = await client.post(`accounting/recurring-invoices/${id}/run-now/`);
        return r.data?.data ?? r.data;
    },

    // ─── REPORTS ──────────────────────────────────────────────────────────────
    getClientStatement: async (clientId) => {
        const r = await client.get(`erp/client-statement/${clientId}/`);
        return r.data?.data ?? r.data;
    },

    // ─── TAXES / LEDGER / BUDGETS ─────────────────────────────────────────────
    getTaxes: async () => {
        const r = await client.get('accounting/taxes/');
        return r.data?.data ?? r.data;
    },
    getLedger: async (params = {}) => {
        const r = await client.get('accounting/ledger/', { params });
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
        const r = await client.get('accounting/accounts/', { params });
        return r.data?.data ?? r.data;
    },
    createAccount: async (data) => {
        const r = await client.post('accounting/accounts/', data);
        return r.data?.data ?? r.data;
    },
    getJournalEntries: async (params = {}) => {
        const r = await client.get('accounting/journal-entries/', { params });
        return r.data?.data ?? r.data;
    },
    createJournalEntry: async (data) => {
        const r = await client.post('accounting/journal-entries/', data);
        return r.data?.data ?? r.data;
    },
    getBankAccounts: async (params = {}) => {
        const r = await client.get('accounting/bank-accounts/', { params });
        return r.data?.data ?? r.data;
    },
    createBankAccount: async (data) => {
        const r = await client.post('accounting/bank-accounts/', data);
        return r.data?.data ?? r.data;
    },
    getBankTransactions: async (params = {}) => {
        const r = await client.get('accounting/bank-transactions/', { params });
        return r.data?.data ?? r.data;
    },
    getBalanceSheet: async (date) => {
        const r = await client.get('accounting/reports/balance-sheet/', { params: { date } });
        return r.data?.data ?? r.data;
    },
    getCashFlow: async (start_date, end_date) => {
        const r = await client.get('accounting/reports/cash-flow/', { params: { start_date, end_date } });
        return r.data?.data ?? r.data;
    },
    getFixedAssets: async (params = {}) => {
        const r = await client.get('accounting/fixed-assets/', { params });
        return r.data?.data ?? r.data;
    },
    createFixedAsset: async (data) => {
        const r = await client.post('accounting/fixed-assets/', data);
        return r.data?.data ?? r.data;
    },
    runDepreciation: async () => {
        const r = await client.post('accounting/fixed-assets/run-depreciation/');
        return r.data?.data ?? r.data;
    },

    // ─── EXPENSE WORKFLOW ────────────────────────────────────────────────
    approveExpense: async (id) => {
        const r = await client.post(`accounting/expenses/${id}/approve/`);
        return r.data?.data ?? r.data;
    },
    rejectExpense: async (id) => {
        const r = await client.post(`accounting/expenses/${id}/reject/`);
        return r.data?.data ?? r.data;
    },
    reimburseExpense: async (id) => {
        const r = await client.post(`accounting/expenses/${id}/reimburse/`);
        return r.data?.data ?? r.data;
    },

    getProfitLoss: async (date_from, date_to) => {
        const r = await client.get('accounting/reports/profit-loss/', { params: { date_from, date_to } });
        return r.data?.data ?? r.data;
    },
    getMonthlyFinancials: async (months = 6) => {
        const r = await client.get('erp/monthly/', { params: { months } });
        return r.data?.data ?? r.data;
    },

    // ─── CREDIT NOTES ─────────────────────────────────────────────────────────
    getCreditNotes: async (params = {}) => {
        const r = await client.get('accounting/credit-notes/', { params });
        return r.data?.data ?? r.data;
    },
    getCreditNote: async (id) => {
        const r = await client.get(`accounting/credit-notes/${id}/`);
        return r.data?.data ?? r.data;
    },
    applyCreditNote: async (id, invoiceId) => {
        const r = await client.post(`accounting/credit-notes/${id}/apply/`, { invoice_id: invoiceId });
        return r.data?.data ?? r.data;
    },
    createCreditNote: async (data) => {
        const r = await client.post('accounting/credit-notes/', data);
        return r.data?.data ?? r.data;
    },
    getCatalogItems: async (params) => {
        const r = await client.get('store/products/', { params });
        return r.data?.data ?? r.data;
    },

    // ─── PAYMENT TERMS ────────────────────────────────────────────────────────
    getPaymentTerms: async (params = {}) => {
        const r = await client.get('accounting/payment-terms/', { params });
        return r.data?.data ?? r.data;
    },
    createPaymentTerm: async (data) => {
        const r = await client.post('accounting/payment-terms/', data);
        return r.data?.data ?? r.data;
    },
    updatePaymentTerm: async (id, data) => {
        const r = await client.patch(`accounting/payment-terms/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deletePaymentTerm: async (id) => {
        const r = await client.delete(`accounting/payment-terms/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── INVOICE BRANDING ─────────────────────────────────────────────────────
    getInvoiceBrandings: async (params = {}) => {
        const r = await client.get('accounting/invoice-branding/', { params });
        return r.data?.data ?? r.data;
    },
    createInvoiceBranding: async (data) => {
        const r = await client.post('accounting/invoice-branding/', data);
        return r.data?.data ?? r.data;
    },
    updateInvoiceBranding: async (id, data) => {
        const r = await client.patch(`accounting/invoice-branding/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteInvoiceBranding: async (id) => {
        const r = await client.delete(`accounting/invoice-branding/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── DEFERRED REVENUE ─────────────────────────────────────────────────────
    getDeferredRevenues: async (params = {}) => {
        const r = await client.get('accounting/deferred-revenue/', { params });
        return r.data?.data ?? r.data;
    },
    createDeferredRevenue: async (data) => {
        const r = await client.post('accounting/deferred-revenue/', data);
        return r.data?.data ?? r.data;
    },
    updateDeferredRevenue: async (id, data) => {
        const r = await client.patch(`accounting/deferred-revenue/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteDeferredRevenue: async (id) => {
        const r = await client.delete(`accounting/deferred-revenue/${id}/`);
        return r.data?.data ?? r.data;
    },

    // ─── AGED REPORTS ─────────────────────────────────────────────────────────
    getAgedReceivables: async () => {
        const r = await client.get('accounting/reports/aged-receivables/');
        return r.data?.data ?? r.data;
    },
    getAgedPayables: async () => {
        const r = await client.get('accounting/reports/aged-payables/');
        return r.data?.data ?? r.data;
    },

    // ─── VENDOR BILLS ─────────────────────────────────────────────────────────
    getVendorBills: async (params = {}) => {
        const r = await client.get('accounting/vendor-bills/', { params });
        return r.data?.data ?? r.data;
    },
    getVendorBill: async (id) => {
        const r = await client.get(`accounting/vendor-bills/${id}/`);
        return r.data?.data ?? r.data;
    },
    createVendorBill: async (data) => {
        const r = await client.post('accounting/vendor-bills/', data);
        return r.data?.data ?? r.data;
    },
    updateVendorBill: async (id, data) => {
        const r = await client.patch(`accounting/vendor-bills/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    payVendorBill: async (id) => {
        const r = await client.post(`accounting/vendor-bills/${id}/pay/`);
        return r.data?.data ?? r.data;
    },

    // ─── RECURRING INVOICES ───────────────────────────────────────────────────
    getRecurringInvoices: async (params = {}) => {
        const r = await client.get('accounting/recurring-invoices/', { params });
        return r.data?.data ?? r.data;
    },
    getRecurringInvoice: async (id) => {
        const r = await client.get(`accounting/recurring-invoices/${id}/`);
        return r.data?.data ?? r.data;
    },
    createRecurringInvoice: async (data) => {
        const r = await client.post('accounting/recurring-invoices/', data);
        return r.data?.data ?? r.data;
    },
    updateRecurringInvoice: async (id, data) => {
        const r = await client.patch(`accounting/recurring-invoices/${id}/`, data);
        return r.data?.data ?? r.data;
    },

    // ─── SALE ORDERS (PHASE 9/10) ─────────────────────────────────────────────
    getSaleOrders: async (params = {}) => {
        const r = await client.get('sale/orders/', { params });
        return r.data?.data ?? r.data;
    },
    getSaleOrder: async (id) => {
        const r = await client.get(`sale/orders/${id}/`);
        return r.data?.data ?? r.data;
    },
    createSaleOrder: async (data) => {
        const r = await client.post('sale/orders/', data);
        return r.data?.data ?? r.data;
    },

    // ─── SCM GOODS RECEIPTS ───────────────────────────────────────────────────
    getGoodsReceipts: async (params = {}) => {
        const r = await client.get('inventory/goods-receipts/', { params });
        return r.data?.data ?? r.data;
    },

    // ─── HRM PAYROLL ──────────────────────────────────────────────────────────
    getPayrollRuns: async (params = {}) => {
        const r = await client.get('hrm/payroll-runs/', { params });
        return r.data?.data ?? r.data;
    },
    getPayrollStructures: async (params = {}) => {
        const r = await client.get('hrm/payroll-structures/', { params });
        return r.data?.data ?? r.data;
    },
    getExpenseReports: async (params = {}) => {
        const r = await client.get('hrm/expense-reports/', { params });
        return r.data?.data ?? r.data;
    },

    // ─── ANALYTIC ACCOUNTS ────────────────────────────────────────────────────
    getAnalyticAccounts: async (params = {}) => {
        const r = await client.get('erp/analytic-accounts/', { params });
        return r.data?.data ?? r.data;
    },
};
