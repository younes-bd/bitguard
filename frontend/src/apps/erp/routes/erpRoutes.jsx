import React from 'react';
import { Route } from 'react-router-dom';
import ErpDashboard from '../pages/dashboards/ErpDashboard';

import FinancialsDashboard from '../pages/FinancialsDashboard';
import ExpenseList from '../pages/ExpenseList';
import InvoiceList from '../pages/InvoiceList';
import InvoiceCreate from '../pages/InvoiceCreate';
import InvoiceDetail from '../pages/InvoiceDetail';
import ProjectList from '../pages/ProjectList';
import ProjectCreate from '../pages/ProjectCreate';
import ProjectDetail from '../pages/ProjectDetail';

import ErpSettings from '../pages/ErpSettings';
import ErpReportPage from '../pages/ErpReportPage';

import BillingOverview from '../pages/billing/BillingOverview';
import DeliveryNoteList from '../pages/billing/DeliveryNoteList';
import DeliveryNoteCreate from '../pages/billing/DeliveryNoteCreate';
import AgingReport from '../pages/billing/AgingReport';
import ClientStatement from '../pages/billing/ClientStatement';
import RecurringInvoices from '../pages/billing/RecurringInvoices';

import VendorList from '../pages/vendors/VendorList';
import VendorCreate from '../pages/vendors/VendorCreate';
import PurchaseOrderList from '../pages/vendors/PurchaseOrderList';
import PurchaseOrderCreate from '../pages/vendors/PurchaseOrderCreate';

import ChartOfAccounts from '../pages/accounting/ChartOfAccounts';
import JournalEntries from '../pages/accounting/JournalEntries';
import BankingDashboard from '../pages/accounting/BankingDashboard';
import FixedAssets from '../pages/accounting/FixedAssets';
import BalanceSheet from '../pages/reports/BalanceSheet';
import CashFlowStatement from '../pages/reports/CashFlowStatement';
import ProfitLoss from '../pages/reports/ProfitLoss';
import BudgetReport from '../pages/reports/BudgetReport';
import TimeBilling from '../pages/TimeBilling';

export const erpRoutes = (
    <>
        <Route path="overview" element={<ErpDashboard />} />
        <Route path="billing" element={<BillingOverview />} />
        
        <Route path="financials" element={<FinancialsDashboard />} />
        <Route path="payments" element={<FinancialsDashboard />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<InvoiceCreate />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/create" element={<ProjectCreate />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        
        <Route path="delivery" element={<DeliveryNoteList />} />
        <Route path="delivery/create" element={<DeliveryNoteCreate />} />
        
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/create" element={<VendorCreate />} />
        <Route path="purchase-orders" element={<PurchaseOrderList />} />
        <Route path="purchase-orders/create" element={<PurchaseOrderCreate />} />
        
        <Route path="aging-report" element={<AgingReport />} />
        <Route path="client-statement/:clientId" element={<ClientStatement />} />
        <Route path="recurring" element={<RecurringInvoices />} />

        <Route path="profit-loss" element={<ProfitLoss />} />
        <Route path="budget-report" element={<BudgetReport />} />
        
        <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="journal-entries" element={<JournalEntries />} />
        <Route path="banking" element={<BankingDashboard />} />
        <Route path="fixed-assets" element={<FixedAssets />} />
        
        <Route path="balance-sheet" element={<BalanceSheet />} />
        <Route path="cash-flow" element={<CashFlowStatement />} />

        <Route path="time-billing" element={<TimeBilling />} />
        <Route path="settings" element={<ErpSettings />} />
        <Route path="reports" element={<ErpReportPage />} />
    </>
);
