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
import RiskList from '../pages/RiskList';

import ErpSettings from '../pages/ErpSettings';
import ErpReportPage from '../pages/ErpReportPage';

import PaymentTerms from '../pages/PaymentTerms';
import ProductCatalog from '../pages/ProductCatalog';
import InvoiceBranding from '../pages/InvoiceBranding';

import DocumentHub from '../pages/documents/DocumentHub';
import QuotationList from '../pages/documents/QuotationList';
import QuotationCreate from '../pages/documents/QuotationCreate';
import QuotationDetail from '../pages/documents/QuotationDetail';
import ReceiptList from '../pages/documents/ReceiptList';
import ReceiptDetail from '../pages/documents/ReceiptDetail';
import CreditNoteList from '../pages/documents/CreditNoteList';
import CreditNoteCreate from '../pages/documents/CreditNoteCreate';
import CreditNoteDetail from '../pages/documents/CreditNoteDetail';

import BillingOverview from '../pages/billing/BillingOverview';
import DeliveryNoteList from '../pages/billing/DeliveryNoteList';
import DeliveryNoteCreate from '../pages/billing/DeliveryNoteCreate';
import AgingReport from '../pages/billing/AgingReport';
import ClientStatement from '../pages/billing/ClientStatement';
import RecurringInvoices from '../pages/billing/RecurringInvoices';

import VendorList from '../pages/vendors/VendorList';
import VendorCreate from '../pages/vendors/VendorCreate';
import VendorDetail from '../pages/vendors/VendorDetail';
import PurchaseOrderList from '../pages/vendors/PurchaseOrderList';
import PurchaseOrderCreate from '../pages/vendors/PurchaseOrderCreate';
import PurchaseOrderDetail from '../pages/vendors/PurchaseOrderDetail';

import ChartOfAccounts from '../pages/accounting/ChartOfAccounts';
import JournalEntries from '../pages/accounting/JournalEntries';
import BankingDashboard from '../pages/accounting/BankingDashboard';
import FixedAssets from '../pages/accounting/FixedAssets';
import DeferredRevenue from '../pages/accounting/DeferredRevenue';
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
        
        {/* Document Hub Pages */}
        <Route path="documents" element={<DocumentHub />} />
        <Route path="quotations" element={<QuotationList />} />
        <Route path="quotations/create" element={<QuotationCreate />} />
        <Route path="quotations/:id" element={<QuotationDetail />} />
        <Route path="receipts" element={<ReceiptList />} />
        <Route path="receipts/:id" element={<ReceiptDetail />} />
        <Route path="credit-notes" element={<CreditNoteList />} />
        <Route path="credit-notes/create" element={<CreditNoteCreate />} />
        <Route path="credit-notes/:id" element={<CreditNoteDetail />} />

        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/create" element={<ProjectCreate />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="risks" element={<RiskList />} />
        
        <Route path="delivery" element={<DeliveryNoteList />} />
        <Route path="delivery/create" element={<DeliveryNoteCreate />} />
        
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/create" element={<VendorCreate />} />
        <Route path="vendors/:id" element={<VendorDetail />} />
        <Route path="purchase-orders" element={<PurchaseOrderList />} />
        <Route path="purchase-orders/create" element={<PurchaseOrderCreate />} />
        <Route path="purchase-orders/:id" element={<PurchaseOrderDetail />} />
        
        <Route path="aging-report" element={<AgingReport />} />
        <Route path="client-statement/:clientId" element={<ClientStatement />} />
        <Route path="recurring" element={<RecurringInvoices />} />

        <Route path="profit-loss" element={<ProfitLoss />} />
        <Route path="budget-report" element={<BudgetReport />} />
        
        <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
        <Route path="journal-entries" element={<JournalEntries />} />
        <Route path="banking" element={<BankingDashboard />} />
        <Route path="fixed-assets" element={<FixedAssets />} />
        <Route path="deferred-revenue" element={<DeferredRevenue />} />
        
        <Route path="balance-sheet" element={<BalanceSheet />} />
        <Route path="cash-flow" element={<CashFlowStatement />} />

        <Route path="time-billing" element={<TimeBilling />} />
        <Route path="settings" element={<ErpSettings />} />
        <Route path="settings/payment-terms" element={<PaymentTerms />} />
        <Route path="settings/branding" element={<InvoiceBranding />} />
        <Route path="catalog" element={<ProductCatalog />} />
        
        <Route path="reports" element={<ErpReportPage />} />
    </>
);
