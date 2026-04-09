import React from 'react';
import { Route } from 'react-router-dom';
import ErpDashboard from '../pages/dashboards/ErpDashboard';

import FinancialsDashboard from '../pages/FinancialsDashboard';
import ExpenseList from '../pages/ExpenseList';
import InvoiceList from '../pages/InvoiceList';
import InvoiceCreate from '../pages/InvoiceCreate';
import InvoiceDetail from '../pages/InvoiceDetail';

import ErpSettings from '../pages/ErpSettings';
import ErpReportPage from '../pages/ErpReportPage';

export const erpRoutes = (
    <>
        <Route path="overview" element={<ErpDashboard />} />
        
        <Route path="financials" element={<FinancialsDashboard />} />
        <Route path="payments" element={<FinancialsDashboard />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<InvoiceCreate />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        
        <Route path="settings" element={<ErpSettings />} />
        <Route path="reports" element={<ErpReportPage />} />
    </>
);
