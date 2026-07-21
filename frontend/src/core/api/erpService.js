import client from './client';

export const erpService = {
    // ─── DASHBOARD ───────────────────────────────────────────────────────────
    getDashboardStats: async () => {
        try {
            const r = await client.get('accounting/dashboard/stats/');
            return r.data?.data ?? r.data?.results ?? r.data;
        } catch (e) { console.error(e); return null; }
    },

    // ─── INVOICES ─────────────────────────────────────────────────────────────
    getInvoices: async (params = {}) => {
        const r = await client.get('accounting/invoices/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getInvoice: async (id) => {
        const r = await client.get(`accounting/invoices/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createInvoice: async (data) => {
        const r = await client.post('accounting/invoices/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateInvoice: async (id, data) => {
        const r = await client.patch(`accounting/invoices/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    markInvoiceSent: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/mark-sent/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    markInvoicePaid: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/mark-paid/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    voidInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/void/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    duplicateInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/duplicate/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    sendInvoiceToClient: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/send-to-client/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    convertProforma: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/convert-to-invoice/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    convertQuotationToInvoice: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/convert-to-invoice/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    acceptQuotation: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/accept-quotation/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    declineQuotation: async (id) => {
        const r = await client.post(`accounting/invoices/${id}/decline-quotation/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getAgingReport: async () => {
        const r = await client.get('accounting/invoices/aging-report/');
        return r.data?.data ?? r.data?.results ?? r.data;
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
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createPayment: async (data) => {
        const r = await client.post('accounting/payments/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    voidPayment: async (id) => {
        const r = await client.post(`accounting/payments/${id}/void/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── EXPENSES ─────────────────────────────────────────────────────────────
    getExpenses: async (params = {}) => {
        const r = await client.get('accounting/expenses/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createExpense: async (data) => {
        const r = await client.post('accounting/expenses/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateExpense: async (id, data) => {
        const r = await client.patch(`accounting/expenses/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteExpense: async (id) => {
        const r = await client.delete(`accounting/expenses/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── DELIVERY NOTES ───────────────────────────────────────────────────────
    getDeliveryNotes: async (params = {}) => {
        const queryParams = { picking_type: 'delivery', ...params };
        const r = await client.get('stock/pickings/', { params: queryParams });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getDeliveryNote: async (id) => {
        const r = await client.get(`stock/pickings/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createDeliveryNote: async (data) => {
        const payload = { picking_type: 'delivery', ...data };
        const r = await client.post('stock/pickings/', payload);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateDeliveryNoteStatus: async (id, newStatus) => {
        const r = await client.patch(`stock/pickings/${id}/`, { state: newStatus });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    validateDeliveryNote: async (id) => {
        const r = await client.post(`stock/delivery-notes/${id}/validate/`);
        return r.data?.data ?? r.data?.results ?? r.data;
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
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getVendor: async (id) => {
        const r = await client.get(`purchase/vendors/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createVendor: async (data) => {
        const r = await client.post('purchase/vendors/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateVendor: async (id, data) => {
        const r = await client.patch(`purchase/vendors/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteVendor: async (id) => {
        const r = await client.delete(`purchase/vendors/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── PURCHASE ORDERS ──────────────────────────────────────────────────────
    getPurchaseOrders: async (params = {}) => {
        const r = await client.get('purchase/purchase-orders/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
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
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createPurchaseOrder: async (data) => {
        const r = await client.post('purchase/purchase-orders/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updatePurchaseOrder: async (id, data) => {
        const r = await client.patch(`purchase/purchase-orders/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    receivePurchaseOrder: async (id) => {
        const r = await client.post(`purchase/purchase-orders/${id}/receive/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    approvePurchaseOrder: async (id) => {
        const r = await client.post(`purchase/purchase-orders/${id}/approve/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    cancelPurchaseOrder: async (id) => {
        const r = await client.post(`purchase/purchase-orders/${id}/cancel/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── RECURRING INVOICES ───────────────────────────────────────────────────
    getRecurringInvoices: async () => {
        const r = await client.get('accounting/recurring-invoices/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createRecurringInvoice: async (data) => {
        const r = await client.post('accounting/recurring-invoices/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateRecurringInvoice: async (id, data) => {
        const r = await client.patch(`accounting/recurring-invoices/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    toggleRecurring: async (id) => {
        const r = await client.post(`accounting/recurring-invoices/${id}/toggle/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    runRecurringNow: async (id) => {
        const r = await client.post(`accounting/recurring-invoices/${id}/run-now/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── REPORTS ──────────────────────────────────────────────────────────────
    getClientStatement: async (clientId) => {
        const r = await client.get(`accounting/client-statement/${clientId}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── TAXES & JOURNALS (PHASE 6) ──────────────────────────────────────────
    getTaxes: async () => {
        const r = await client.get('accounting/taxes/');
        return r.data?.data || r.data;
    },
    getTaxesV2: async () => {
        const r = await client.get('accounting/taxes-v2/');
        return r.data?.data || r.data;
    },
    getTaxGroups: async () => {
        const r = await client.get('accounting/tax-groups/');
        return r.data?.data || r.data;
    },
    getAccountJournals: async () => {
        const r = await client.get('accounting/account-journals/');
        return r.data?.data || r.data;
    },
    getBankReconciliations: async () => {
        const r = await client.get('accounting/bank-reconciliations/');
        return r.data?.data || r.data;
    },

    // ─── TAXES / LEDGER / BUDGETS ─────────────────────────────────────────────
    getLedger: async (params = {}) => {
        const r = await client.get('accounting/ledger/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getBudgets: async () => {
        const r = await client.get('accounting/budgets/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getCostCenters: async () => {
        const r = await client.get('accounting/cost-centers/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── PROJECTS ─────────────────────────────────────────────────────────────
    getProjects: async (params = {}) => {
        const r = await client.get('projects/projects/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createProject: async (data) => {
        const r = await client.post('projects/projects/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateProject: async (id, data) => {
        const r = await client.patch(`projects/projects/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getProject: async (id) => {
        const r = await client.get(`projects/projects/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteProject: async (id) => {
        const r = await client.delete(`projects/projects/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── RISKS ────────────────────────────────────────────────────────────────
    getRisks: async (params = {}) => {
        const r = await client.get('projects/risks/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createRisk: async (data) => {
        const r = await client.post('projects/risks/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateRisk: async (id, data) => {
        const r = await client.patch(`projects/risks/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteRisk: async (id) => {
        const r = await client.delete(`projects/risks/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── PHASE 3: FINANCIAL ACCOUNTING ────────────────────────────────────────
    getAccounts: async (params = {}) => {
        const r = await client.get('accounting/accounts/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createAccount: async (data) => {
        const r = await client.post('accounting/accounts/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getJournalEntries: async (params = {}) => {
        const r = await client.get('accounting/journal-entries/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createJournalEntry: async (data) => {
        const r = await client.post('accounting/journal-entries/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getBankAccounts: async (params = {}) => {
        const r = await client.get('accounting/bank-accounts/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createBankAccount: async (data) => {
        const r = await client.post('accounting/bank-accounts/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getBankTransactions: async (params = {}) => {
        const r = await client.get('accounting/bank-transactions/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getBalanceSheet: async (date) => {
        const r = await client.get('accounting/reports/balance-sheet/', { params: { date } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getCashFlow: async (start_date, end_date) => {
        const r = await client.get('accounting/reports/cash-flow/', { params: { start_date, end_date } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getFixedAssets: async (params = {}) => {
        const r = await client.get('accounting/fixed-assets/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createFixedAsset: async (data) => {
        const r = await client.post('accounting/fixed-assets/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    runDepreciation: async () => {
        const r = await client.post('accounting/fixed-assets/run-depreciation/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── EXPENSE WORKFLOW ────────────────────────────────────────────────
    approveExpense: async (id) => {
        const r = await client.post(`accounting/expenses/${id}/approve/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    rejectExpense: async (id) => {
        const r = await client.post(`accounting/expenses/${id}/reject/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    reimburseExpense: async (id) => {
        const r = await client.post(`accounting/expenses/${id}/reimburse/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    getProfitLoss: async (date_from, date_to) => {
        const r = await client.get('accounting/reports/profit-loss/', { params: { date_from, date_to } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getMonthlyFinancials: async (months = 6) => {
        const r = await client.get('accounting/dashboard/financials/', { params: { months } });
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── CREDIT NOTES ─────────────────────────────────────────────────────────
    getCreditNotes: async (params = {}) => {
        const r = await client.get('accounting/credit-notes/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getCreditNote: async (id) => {
        const r = await client.get(`accounting/credit-notes/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    applyCreditNote: async (id, invoiceId) => {
        const r = await client.post(`accounting/credit-notes/${id}/apply/`, { invoice_id: invoiceId });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createCreditNote: async (data) => {
        const r = await client.post('accounting/credit-notes/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getCatalogItems: async (params) => {
        const r = await client.get('store/products/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── PAYMENT TERMS ────────────────────────────────────────────────────────
    getPaymentTerms: async (params = {}) => {
        const r = await client.get('accounting/payment-terms/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createPaymentTerm: async (data) => {
        const r = await client.post('accounting/payment-terms/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updatePaymentTerm: async (id, data) => {
        const r = await client.patch(`accounting/payment-terms/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deletePaymentTerm: async (id) => {
        const r = await client.delete(`accounting/payment-terms/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── INVOICE BRANDING ─────────────────────────────────────────────────────
    getInvoiceBrandings: async (params = {}) => {
        const r = await client.get('accounting/invoice-branding/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createInvoiceBranding: async (data) => {
        const r = await client.post('accounting/invoice-branding/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateInvoiceBranding: async (id, data) => {
        const r = await client.patch(`accounting/invoice-branding/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteInvoiceBranding: async (id) => {
        const r = await client.delete(`accounting/invoice-branding/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── DEFERRED REVENUE ─────────────────────────────────────────────────────
    getDeferredRevenues: async (params = {}) => {
        const r = await client.get('accounting/deferred-revenue/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createDeferredRevenue: async (data) => {
        const r = await client.post('accounting/deferred-revenue/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateDeferredRevenue: async (id, data) => {
        const r = await client.patch(`accounting/deferred-revenue/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteDeferredRevenue: async (id) => {
        const r = await client.delete(`accounting/deferred-revenue/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── AGED REPORTS ─────────────────────────────────────────────────────────
    getAgedReceivables: async () => {
        const r = await client.get('accounting/reports/aged-receivables/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getAgedPayables: async () => {
        const r = await client.get('accounting/reports/aged-payables/');
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── VENDOR BILLS ─────────────────────────────────────────────────────────
    getVendorBills: async (params = {}) => {
        const r = await client.get('accounting/vendor-bills/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getVendorBill: async (id) => {
        const r = await client.get(`accounting/vendor-bills/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createVendorBill: async (data) => {
        const r = await client.post('accounting/vendor-bills/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateVendorBill: async (id, data) => {
        const r = await client.patch(`accounting/vendor-bills/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    payVendorBill: async (id) => {
        const r = await client.post(`accounting/vendor-bills/${id}/pay/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── RECURRING INVOICES ───────────────────────────────────────────────────
    getRecurringInvoices: async (params = {}) => {
        const r = await client.get('accounting/recurring-invoices/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getRecurringInvoice: async (id) => {
        const r = await client.get(`accounting/recurring-invoices/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createRecurringInvoice: async (data) => {
        const r = await client.post('accounting/recurring-invoices/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateRecurringInvoice: async (id, data) => {
        const r = await client.patch(`accounting/recurring-invoices/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── SALE ORDERS (PHASE 9/10) ─────────────────────────────────────────────
    getSaleOrders: async (params = {}) => client.get('sale/orders/', { params }).then(r => r.data?.results ?? r.data),
    getSaleOrder: async (id) => client.get(`sale/orders/${id}/`).then(r => r.data),
    createSaleOrder: async (data) => client.post('sale/orders/', data).then(r => r.data),
    updateSaleOrder: async (id, data) => client.patch(`sale/orders/${id}/`, data).then(r => r.data),
    confirmSaleOrder: async (id) => client.post(`sale/orders/${id}/confirm/`).then(r => r.data),
    cancelSaleOrder: async (id) => client.post(`sale/orders/${id}/cancel/`).then(r => r.data),
    invoiceSaleOrder: async (id) => client.post(`sale/orders/${id}/invoice-order/`).then(r => r.data),
    createDeliveryFromSale: async (id) => client.post(`sale/orders/${id}/create-delivery/`).then(r => r.data),

    // ─── SALE SETTINGS / CONFIG ───────────────────────────────────────────────
    getSalesTeams: async (params = {}) => client.get('sale/teams/', { params }).then(r => r.data?.results ?? r.data),
    createSalesTeam: async (data) => client.post('sale/teams/', data).then(r => r.data),
    updateSalesTeam: async (id, data) => client.patch(`sale/teams/${id}/`, data).then(r => r.data),
    deleteSalesTeam: async (id) => client.delete(`sale/teams/${id}/`).then(r => r.data),

    getPricelists: async (params = {}) => client.get('sale/pricelists/', { params }).then(r => r.data?.results ?? r.data),
    createPricelist: async (data) => client.post('sale/pricelists/', data).then(r => r.data),
    updatePricelist: async (id, data) => client.patch(`sale/pricelists/${id}/`, data).then(r => r.data),
    deletePricelist: async (id) => client.delete(`sale/pricelists/${id}/`).then(r => r.data),

    getQuotationTemplates: async (params = {}) => client.get('sale/templates/', { params }).then(r => r.data?.results ?? r.data),
    createQuotationTemplate: async (data) => client.post('sale/templates/', data).then(r => r.data),
    updateQuotationTemplate: async (id, data) => client.patch(`sale/templates/${id}/`, data).then(r => r.data),
    deleteQuotationTemplate: async (id) => client.delete(`sale/templates/${id}/`).then(r => r.data),

    getShippingMethods: async (params = {}) => client.get('sale/shipping-methods/', { params }).then(r => r.data?.results ?? r.data),
    createShippingMethod: async (data) => client.post('sale/shipping-methods/', data).then(r => r.data),
    updateShippingMethod: async (id, data) => client.patch(`sale/shipping-methods/${id}/`, data).then(r => r.data),
    deleteShippingMethod: async (id) => client.delete(`sale/shipping-methods/${id}/`).then(r => r.data),

    // ─── SCM GOODS RECEIPTS ───────────────────────────────────────────────────
    getGoodsReceipts: async (params = {}) => {
        const r = await client.get('stock/goods-receipts/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── HRM PAYROLL ──────────────────────────────────────────────────────────
    getPayrollRuns: async (params = {}) => {
        const r = await client.get('hrm/payroll-runs/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getPayrollStructures: async (params = {}) => {
        const r = await client.get('hrm/payroll-structures/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    getExpenseReports: async (params = {}) => {
        const r = await client.get('hrm/expense-reports/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── ANALYTIC ACCOUNTS ────────────────────────────────────────────────────
    getAnalyticAccounts: async (params = {}) => {
        const r = await client.get('accounting/analytic-accounts/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },

    // ─── HRM PHASE 1 EXTRAS ───────────────────────────────────────────────────
    getJobApplicants: async (params = {}) => client.get('hrm/frontend-applicants/', { params }).then(r => r.data?.results ?? r.data),
    getPerformanceAppraisals: async (params = {}) => client.get('hrm/frontend-appraisals/', { params }).then(r => r.data?.results ?? r.data),
    getReferralCampaigns: async (params = {}) => client.get('hrm/frontend-referrals/', { params }).then(r => r.data?.results ?? r.data),

    // ─── MARKETING EXTRAS ─────────────────────────────────────────────────────
    getMassMailings: async (params = {}) => client.get('marketing/mailings/', { params }).then(r => r.data?.results ?? r.data),
    getSocialPosts: async (params = {}) => client.get('marketing/social-posts/', { params }).then(r => r.data?.results ?? r.data),
    getSMSCampaigns: async (params = {}) => client.get('marketing/sms-campaigns/', { params }).then(r => r.data?.results ?? r.data),
    getEvents: async (params = {}) => client.get('marketing/events/', { params }).then(r => r.data?.results ?? r.data),
    getSurveys: async (params = {}) => client.get('marketing/surveys/', { params }).then(r => r.data?.results ?? r.data),

    // ─── SERVICES / PROJECTS EXTRAS ───────────────────────────────────────────
    getResourceShifts: async (params = {}) => client.get('services/resource-shifts/', { params }).then(r => r.data?.results ?? r.data),
    getAppointments: async (params = {}) => client.get('services/appointments/', { params }).then(r => r.data?.results ?? r.data),
    getTaskTimesheets: async (params = {}) => client.get('projects/task-timesheets/', { params }).then(r => r.data?.results ?? r.data),

    // ─── CORE / CMS / EDMS EXTRAS ─────────────────────────────────────────────
    getUoMs: async (params = {}) => client.get('core/uoms/', { params }).then(r => r.data?.results ?? r.data),
    getUoMCategories: async (params = {}) => client.get('core/uom-categories/', { params }).then(r => r.data?.results ?? r.data),
    getSequences: async (params = {}) => client.get('core/sequences/', { params }).then(r => r.data?.results ?? r.data),
    getAttachments: async (params = {}) => client.get('core/attachments/', { params }).then(r => r.data?.results ?? r.data),
    getCourses: async (params = {}) => client.get('cms/courses/', { params }).then(r => r.data?.results ?? r.data),
    getSpreadsheetDocuments: async (params = {}) => client.get('documents/spreadsheet-documents/', { params }).then(r => r.data?.results ?? r.data),
    // ─── WEBSITE PILLAR (CMS, BLOG, ELEARNING) ────────────────────────────────
    getWebsites: async (params = {}) => client.get('website/websites/', { params }).then(r => r.data?.results ?? r.data),
    getWebsitePages: async (params = {}) => client.get('website/pages/', { params }).then(r => r.data?.results ?? r.data),
    getWebsiteMenus: async (params = {}) => client.get('website/menus/', { params }).then(r => r.data?.results ?? r.data),
    getWebsiteRedirects: async (params = {}) => client.get('website/redirects/', { params }).then(r => r.data?.results ?? r.data),
    
    getBlogPosts: async (params = {}) => client.get('blog/posts/', { params }).then(r => r.data?.results ?? r.data),
    getBlogPost: async (slug) => client.get(`blog/posts/${slug}/`).then(r => r.data),
    getBlogCategories: async (params = {}) => client.get('blog/categories/', { params }).then(r => r.data?.results ?? r.data),
    getBlogComments: async (params = {}) => client.get('blog/comments/', { params }).then(r => r.data?.results ?? r.data),

    getElearningCourses: async (params = {}) => client.get('elearning/courses/', { params }).then(r => r.data?.results ?? r.data),
    getElearningGroups: async (params = {}) => client.get('elearning/course-groups/', { params }).then(r => r.data?.results ?? r.data),
    getElearningCertifications: async (params = {}) => client.get('elearning/certifications/', { params }).then(r => r.data?.results ?? r.data),
};
