import React from 'react';
import { Route } from 'react-router-dom';

import FinancialsDashboard from '../pages/dashboards/FinancialsDashboardPage';
import ExpenseList from '../pages/core/ExpenseListPage';
import InvoiceList from '../pages/invoices/InvoiceListPage';
import InvoiceCreate from '../pages/invoices/InvoiceCreatePage';
import InvoiceDetail from '../pages/invoices/InvoiceDetailPage';
import InvoiceEdit from '../pages/invoices/InvoiceEditPage';

import BillingOverview from '../pages/billing/BillingOverviewPage';
import ShippingNoteList from '../pages/billing/ShippingNoteListPage';
import ShippingNoteCreate from '../pages/billing/ShippingNoteCreatePage';
import AgingReport from '../pages/billing/AgingReportPage';
import ClientStatement from '../pages/billing/ClientStatementPage';
import RecurringInvoices from '../pages/billing/RecurringInvoicesPage';
import TimeBilling from '../pages/billing/TimeBillingPage';

import ChartOfAccounts from '../pages/core/ChartOfAccountsPage';
import JournalEntries from '../pages/core/JournalEntriesPage';
import BankingDashboard from '../pages/core/BankingDashboardPage';
import FixedAssets from '../pages/core/FixedAssetsPage';
import DeferredRevenue from '../pages/core/DeferredRevenuePage';
import BankReconciliationList from '../pages/lists/BankReconciliationList_newPage';
import TaxList from '../pages/lists/TaxListPage';
import BudgetManagement from '../pages/core/BudgetManagementPage';

import BalanceSheet from '../pages/reports/BalanceSheetPage';
import CashFlowStatement from '../pages/reports/CashFlowStatementPage';
import ProfitLoss from '../pages/reports/ProfitLossPage';
import VATReport from '../pages/reports/VATReportPage';
import BudgetReport from '../pages/reports/BudgetReportPage';
import VendorBillsList from '../pages/lists/VendorBillsListPage';
import AgedReceivables from '../pages/reports/AgedReceivablesPage';
import AgedPayables from '../pages/reports/AgedPayablesPage';
import Ledgers from '../pages/core/LedgersPage';
import CustomerCreditNotes from '../pages/reports/CustomerCreditNotesPage';
import VendorRefunds from '../pages/reports/VendorRefundsPage';
import JournalList from '../pages/lists/JournalListPage';
import CustomerPayments from '../pages/core/CustomerPaymentsPage';
import VendorPayments from '../pages/core/VendorPaymentsPage';
import AccountingReportPage from '../pages/reports/AccountingReportPage';

import ProductList from '../../product/pages/ProductListPage';
import ProductDetail from '../../product/pages/ProductDetailPage';

export const accountingAdminRoutes = (
    <>
        <Route index element={<FinancialsDashboard />} />
        <Route path="financials" element={<FinancialsDashboard />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<InvoiceCreate />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="invoices/:id/edit" element={<InvoiceEdit />} />
        
        <Route path="billing" element={<BillingOverview />} />
        <Route path="aging-report" element={<AgingReport />} />
        <Route path="client-statement/:clientId" element={<ClientStatement />} />
        <Route path="recurring" element={<RecurringInvoices />} />
        <Route path="time-billing" element={<TimeBilling />} />

        <Route path="profit-loss" element={<ProfitLoss />} />
        <Route path="budget-report" element={<BudgetReport />} />
        <Route path="balance-sheet" element={<BalanceSheet />} />
        <Route path="cash-flow" element={<CashFlowStatement />} />
        
        <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="journal-entries" element={<JournalEntries />} />
        <Route path="banking" element={<BankingDashboard />} />
        <Route path="fixed-assets" element={<FixedAssets />} />
        <Route path="deferred-revenue" element={<DeferredRevenue />} />
        <Route path="bank-reconciliation" element={<BankReconciliationList />} />
        <Route path="tax-management" element={<TaxList />} />
        <Route path="budget" element={<BudgetManagement />} />

        {/* Added Routes */}
        <Route path="vendor-bills" element={<VendorBillsList />} />
        <Route path="recurring-invoices" element={<RecurringInvoices />} />
        <Route path="reports/vat" element={<VATReport />} />
        <Route path="reports/aged-receivables" element={<AgedReceivables />} />
        <Route path="reports/aged-payables" element={<AgedPayables />} />
        
        {/* Missing Phase 3 Routes */}
        <Route path="ledgers" element={<Ledgers />} />
        <Route path="customer-credit-notes" element={<CustomerCreditNotes />} />
        <Route path="vendor-refunds" element={<VendorRefunds />} />
        <Route path="journals" element={<JournalList />} />
        <Route path="reports-overview" element={<AccountingReportPage />} />
        <Route path="customer-payments" element={<CustomerPayments />} />
        <Route path="vendor-payments" element={<VendorPayments />} />

        {/* Product Master Data */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="vendor-products" element={<ProductList />} />
    </>
);
