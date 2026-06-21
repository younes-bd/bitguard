import React from 'react';
import { Route } from 'react-router-dom';

import FinancialsDashboard from '../pages/dashboards/FinancialsDashboard';
import ExpenseList from '../pages/core/ExpenseList';
import InvoiceList from '../pages/invoices/InvoiceList';
import InvoiceCreate from '../pages/invoices/InvoiceCreate';
import InvoiceDetail from '../pages/invoices/InvoiceDetail';
import InvoiceEdit from '../pages/invoices/InvoiceEdit';

import BillingOverview from '../pages/billing/BillingOverview';
import DeliveryNoteList from '../pages/billing/DeliveryNoteList';
import DeliveryNoteCreate from '../pages/billing/DeliveryNoteCreate';
import AgingReport from '../pages/billing/AgingReport';
import ClientStatement from '../pages/billing/ClientStatement';
import RecurringInvoices from '../pages/billing/RecurringInvoices';
import TimeBilling from '../pages/billing/TimeBilling';

import ChartOfAccounts from '../pages/core/ChartOfAccounts';
import JournalEntries from '../pages/core/JournalEntries';
import BankingDashboard from '../pages/core/BankingDashboard';
import FixedAssets from '../pages/core/FixedAssets';
import DeferredRevenue from '../pages/core/DeferredRevenue';
import BankReconciliation from '../pages/core/BankReconciliation';
import TaxGroups from '../pages/core/TaxGroups';
import BudgetManagement from '../pages/core/BudgetManagement';

import BalanceSheet from '../pages/reports/BalanceSheet';
import CashFlowStatement from '../pages/reports/CashFlowStatement';
import ProfitLoss from '../pages/reports/ProfitLoss';
import BudgetReport from '../pages/reports/BudgetReport';
import VendorBillsList from '../pages/lists/VendorBillsList';
import AgedReceivables from '../pages/reports/AgedReceivables';
import AgedPayables from '../pages/reports/AgedPayables';

export const accountingRoutes = (
    <>
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
        <Route path="bank-reconciliation" element={<BankReconciliation />} />
        <Route path="tax-management" element={<TaxGroups />} />
        <Route path="budget" element={<BudgetManagement />} />

        {/* Added Routes */}
        <Route path="vendor-bills" element={<VendorBillsList />} />
        <Route path="recurring-invoices" element={<RecurringInvoices />} />
        <Route path="reports/aged-receivables" element={<AgedReceivables />} />
        <Route path="reports/aged-payables" element={<AgedPayables />} />
    </>
);
